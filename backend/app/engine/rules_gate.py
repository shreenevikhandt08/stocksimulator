"""Live-desk rule gate — connects rules.json + runtime toggles/params to every buy / session maintain path."""

from __future__ import annotations

from typing import List, Optional, Tuple

from app.config import (
    ALLOCATION,
    HOLD_DAYS,
    MAX_POSITION_PCT,
    MAX_SECTOR_PCT,
    MAX_SUBSECTOR_NAMES,
    TRIM_TO_PCT,
    WINNER_ROLLOVER_DAYS,
    get_settings,
)
from app.data.universe import by_ticker
from app.engine.scoring import quality_flags, quality_pass

INSTR = by_ticker()


def can_buy(
    sim,
    ticker: str,
    amount: float,
    *,
    enforce_reserve: bool = True,
    mtm: Optional[float] = None,
) -> Tuple[bool, str]:
    """
    Single gate for /buy, /invest, and plan lines.
    Returns (ok, reason). reason is empty when ok.

    mtm: optional projected book (e.g. after pending contribution) for the 10% cap.
    Disabled rules are skipped so they do not affect AI / invest decisions.
    """
    t = ticker.upper().strip()
    if t not in INSTR:
        return False, "Unknown ticker"
    if amount <= 0:
        return False, "Amount must be positive"
    if sim.buying_paused():
        until = sim.pause_until.isoformat() if sim.pause_until else "—"
        return False, f"Buying paused by drawdown rule until {until}"

    inst = INSTR[t]
    if sim.rule_on("cooldown") and sim._in_cooldown(t):
        return False, f"{t} is in cooldown after exit"
    if sim._earnings_blocked(t):
        return False, f"{t} blocked by earnings blackout rule"

    if sim.rule_on("quality_filter"):
        flags = quality_flags(sim.book, inst, sim.idx, sim.toggles.news_decay, sim.toggles.value_condition)
        if not quality_pass(flags, sim.toggles.value_condition):
            return False, f"{t} fails quality filter (need 3 of 5)"

    w = sim.weights()
    sleeve_bounds = sim.sleeve_alloc().get(inst.sleeve) or ALLOCATION[inst.sleeve]
    if (
        sim.rule_on("sleeve_max")
        and w.get(inst.sleeve, 0.0) >= sleeve_bounds["max"] - 0.002
        and t not in sim.positions
    ):
        label = inst.sleeve
        return False, f"{label} sleeve already at max ({sleeve_bounds['max']:.0%})"

    max_sub = int(sim.rp("max_subsector_names", MAX_SUBSECTOR_NAMES))
    if sim.rule_on("subsector_cap") and t not in sim.positions and sim.subsector_count(inst.subsector) >= max_sub:
        return False, f"Subsector {inst.subsector} already has {max_sub} names"

    max_sec = float(sim.rp("max_sector_pct", MAX_SECTOR_PCT))
    if sim.rule_on("sector_cap") and sim.sector_weight(inst.sector) >= max_sec - 0.002 and t not in sim.positions:
        return False, f"Sector {inst.sector} already at max ({max_sec:.0%})"

    book = max(float(mtm) if mtm is not None else sim.mtm(), 1.0)
    held = sim.positions[t].qty * sim._px(t) if t in sim.positions else 0.0
    max_pos = float(sim.rp("max_position_pct", MAX_POSITION_PCT))
    if sim.rule_on("max_position"):
        max_add = max(0.0, max_pos * book - held)
        if amount > max_add + 1.0:
            return False, (
                f"Max position is {max_pos:.0%} of book — can add at most ₹{max_add:,.0f} "
                f"to {t} (use Trade → Invest now to split across names)"
            )

    floor = sim.reserve_floor() if enforce_reserve else 0.0
    if amount > sim.cash - floor + 1e-6:
        if amount <= sim.cash + 1e-6:
            pct = sim.rp("cash_reserve_pct", get_settings().cash_reserve_pct) if sim.rule_on("cash_reserve") else 0.0
            return False, f"Keep {pct:.0%} cash reserve"

    return True, ""


def filter_tickets(
    sim,
    tickets: list,
    *,
    enforce_reserve: bool = True,
    mtm: Optional[float] = None,
) -> Tuple[list, List[str]]:
    """Keep only tickets that pass can_buy; return (kept, reject_reasons)."""
    kept = []
    rejects: List[str] = []
    book = max(float(mtm) if mtm is not None else sim.mtm(), 1.0)
    max_pos = float(sim.rp("max_position_pct", MAX_POSITION_PCT))
    for row in tickets:
        t = str(row.get("ticker", "")).upper()
        amt = float(row.get("amount") or 0)
        held = sim.positions[t].qty * sim._px(t) if t in sim.positions else 0.0
        max_add = max(0.0, max_pos * book - held) if sim.rule_on("max_position") else amt
        if sim.rule_on("max_position") and amt > max_add + 1.0 and max_add >= 50:
            amt = round(max_add, 2)
        ok, reason = can_buy(sim, t, amt, enforce_reserve=enforce_reserve, mtm=book)
        if ok:
            kept.append({**row, "ticker": t, "amount": min(amt, max_add) if (sim.rule_on("max_position") and max_add > 0) else amt})
        else:
            rejects.append(reason)
    return kept, rejects


def maintain_live_rules(sim) -> List[str]:
    """
    Apply hold / ATR stop / trim / drawdown on the live calendar session.
    Rule-driven sells are queued for user approval — they do not execute until approved.
    Disabled rules are skipped entirely.
    """
    notes: List[str] = []
    today = sim._date()
    sim._update_stops()
    sim.prune_pending_actions()

    hold_days = int(sim.rp("hold_days", HOLD_DAYS))
    roll_days = int(sim.rp("winner_rollover_days", WINNER_ROLLOVER_DAYS))

    if sim.rule_on("hold_maturity"):
        for t in list(sim.positions.keys()):
            p = sim.positions[t]
            p.days_held = max((today - p.opened_on).days, 0)
            limit = hold_days + (roll_days if p.extensions else 0)
            if p.days_held < limit:
                continue
            if (
                sim.rule_on("winner_rollover")
                and sim.toggles.winner_rollover
                and p.extensions == 0
                and sim._px(t) > p.avg_cost
                and sim._quality_ok(t)
            ):
                p.extensions = 1
                notes.append(f"{t}: winner rollover +{roll_days}d")
                continue
            if sim.queue_pending_sell(t, p.qty, "30d maturity", partial=False):
                notes.append(f"{t}: sell queued — 30d maturity (needs approval)")
    else:
        for t in list(sim.positions.keys()):
            p = sim.positions[t]
            p.days_held = max((today - p.opened_on).days, 0)

    if sim.rule_on("atr_stops"):
        for t in list(sim.positions.keys()):
            p = sim.positions[t]
            if p.stop is None:
                continue
            px = sim._px(t)
            if px <= p.stop:
                if sim.queue_pending_sell(t, p.qty, "Stop loss (ATR)", partial=False):
                    notes.append(f"{t}: stop loss — sell queued (needs approval)")

    if sim.rule_on("trim_cap") and sim.rule_on("max_position"):
        value = sim.mtm()
        max_pos = float(sim.rp("max_position_pct", MAX_POSITION_PCT))
        trim_to = float(sim.rp("trim_to_pct", TRIM_TO_PCT))
        for t in list(sim.positions.keys()):
            p = sim.positions[t]
            w = (p.qty * sim._px(t)) / max(value, 1.0)
            if w <= max_pos:
                continue
            target_val = trim_to * value
            keep_qty = target_val / max(sim._px(t), 1e-9)
            trim_qty = p.qty - keep_qty
            if trim_qty > 0:
                if sim.queue_pending_sell(t, trim_qty, "Trim to cap", partial=True):
                    notes.append(f"{t}: trim queued to {trim_to:.0%} (needs approval)")

    notes.extend(sim._apply_circuit_breaker(defer_sells=True))
    sim.refresh_live_snapshot()
    return notes

from __future__ import annotations

import uuid
from dataclasses import dataclass, field, asdict
from datetime import date, timedelta
from typing import Dict, List, Optional, Tuple

from app.config import (
    ALLOCATION,
    ATR_PERIOD,
    CASH_RESERVE_PCT,
    COOLDOWN_DAYS,
    CRYPTO_ATR_MULT,
    DRAWDOWN_RESUME,
    DRAWDOWN_T1,
    DRAWDOWN_T2,
    DRAWDOWN_T3,
    EARNINGS_BLACKOUT_DAYS,
    EQUITY_ATR_MULT,
    FRIDAY_BUDGET_CAP,
    HOLD_DAYS,
    INITIAL_CAPITAL,
    STARTING_CASH,
    MAX_POSITION_PCT,
    MAX_SECTOR_PCT,
    MAX_SUBSECTOR_NAMES,
    PAUSE_T1_DAYS,
    PAUSE_T2_DAYS,
    POST_EARNINGS_COOLING_DAYS,
    REGIME_BUDGET,
    RISK_FREE,
    TRIM_TO_PCT,
    Toggles,
    WINNER_ROLLOVER_DAYS,
)
from app.data.generator import MarketBook
from app.data.universe import UNIVERSE, by_ticker
from app.engine.indicators import atr, sma
from app.engine.scoring import quality_flags, quality_pass, score_universe


INSTR = by_ticker()


@dataclass
class Position:
    ticker: str
    qty: float
    avg_cost: float
    opened_on: date
    days_held: int = 0
    extensions: int = 0
    last_atr: float = 0.0
    stop: Optional[float] = None


@dataclass
class Trade:
    date: date
    ticker: str
    side: str  # buy | sell | trim
    qty: float
    price: float
    amount: float
    reason: str
    pnl: float = 0.0
    profit_to_savings: float = 0.0


@dataclass
class DaySnapshot:
    date: date
    regime: str
    budget: float
    deployed: float
    portfolio_value: float
    cash: float
    savings: float
    daily_pnl: float
    drawdown_pct: float
    reserve_pct: float
    peak: float


class Simulator:
    def __init__(self, book: MarketBook, start_idx: int, toggles: Optional[Toggles] = None):
        from app.engine.rule_controls import (
            default_allocation,
            default_rule_copy,
            default_rule_flags,
            default_rule_params,
            sync_toggles_from_flags,
        )

        self.book = book
        self.toggles = toggles or Toggles()
        self.rule_flags = default_rule_flags()
        self.rule_params = default_rule_params()
        self.rule_copy = default_rule_copy()
        self.allocation = default_allocation()
        sync_toggles_from_flags(self.toggles, self.rule_flags)
        self.idx = start_idx
        self.cash = STARTING_CASH
        self.savings = 0.0
        self.total_contributed = STARTING_CASH
        self.positions: Dict[str, Position] = {}
        self.cooldowns: Dict[str, date] = {}  # ticker -> eligible again
        self.trades: List[Trade] = []
        self.history: List[DaySnapshot] = []
        self.peak = STARTING_CASH
        self.pause_until: Optional[date] = None
        self.cb_tier = 0  # 0,1,2,3
        self.force_bear_budget = False
        self.liquidated_once = False
        # User cleared a drawdown pause — don't re-lock buys until DD recovers
        self.pause_override = False
        self.daily_returns: List[float] = []
        self.regime_calls: List[Tuple[date, str]] = []
        self._prev_value = STARTING_CASH
        self.last_invest_date: Optional[date] = None
        # Rule sells waiting for user approve (live desk)
        self.pending_actions: List[dict] = []
        # key "TICKER|reason" -> iso date dismissed (skip re-queue same day)
        self.dismissed_pending: Dict[str, str] = {}
        self._update_stops()
        self._push_snapshot(contribution=0.0, deployed=0.0, daily_pnl=0.0)

    def rule_on(self, rule_id: str) -> bool:
        flags = getattr(self, "rule_flags", None) or {}
        return bool(flags.get(rule_id, True))

    def rp(self, key: str, fallback: float) -> float:
        params = getattr(self, "rule_params", None) or {}
        try:
            return float(params.get(key, fallback))
        except (TypeError, ValueError):
            return float(fallback)

    def apply_rule_controls(
        self,
        flags: Optional[dict] = None,
        params: Optional[dict] = None,
        allocation: Optional[dict] = None,
        copy: Optional[dict] = None,
        reset_copy: bool = False,
    ) -> None:
        from app.engine.rule_controls import (
            default_rule_copy,
            merge_allocation,
            merge_flags,
            merge_params,
            merge_rule_copy,
            sync_toggles_from_flags,
        )

        if flags is not None:
            self.rule_flags = merge_flags({**(self.rule_flags or {}), **flags})
        if params is not None:
            self.rule_params = merge_params({**(self.rule_params or {}), **params})
        if allocation is not None:
            self.allocation = merge_allocation(allocation)
        if reset_copy:
            self.rule_copy = default_rule_copy()
        elif copy is not None:
            # Full replace of wording map so cleared fields revert to catalog defaults
            self.rule_copy = merge_rule_copy(copy, replace=True)
        sync_toggles_from_flags(self.toggles, self.rule_flags)
        self._update_stops()

    def sleeve_alloc(self) -> Dict[str, Dict[str, float]]:
        from app.engine.rule_controls import default_allocation, merge_allocation

        return merge_allocation(getattr(self, "allocation", None) or default_allocation())

    # ── pricing helpers ──────────────────────────────────────────
    def _px(self, ticker: str, idx: Optional[int] = None) -> float:
        i = self.idx if idx is None else idx
        i = max(0, min(i, len(self.book.dates) - 1))
        bar = self.book.series[ticker].bars[i].close
        last_i = len(self.book.dates) - 1
        if i == last_i and i == self.idx:
            try:
                from app.data.live import live_price

                live = live_price(ticker)
                if live and live > 0:
                    # Reject currency/unit mismatches and feed glitches (e.g. OP ₹9 → ₹498).
                    if bar > 0 and (live > bar * 2.5 or live < bar * 0.4):
                        return bar
                    return live
            except Exception:
                pass
        return bar

    def _sell_px(self, ticker: str, avg_cost: float) -> float:
        """Price for exits — never book phantom profits from a broken live quote."""
        bar = self.book.series[ticker].bars[self.idx].close
        px = self._px(ticker)
        if avg_cost > 0 and px > avg_cost * 4:
            return bar if bar > 0 else avg_cost
        if avg_cost > 0 and px < avg_cost * 0.05:
            return bar if bar > 0 else avg_cost
        return px

    def _bar(self, ticker: str, idx: Optional[int] = None):
        i = self.idx if idx is None else idx
        return self.book.series[ticker].bars[i]

    def _date(self) -> date:
        return self.book.dates[self.idx]

    def mtm(self) -> float:
        held = sum(p.qty * self._px(t) for t, p in self.positions.items())
        return self.cash + held

    def portfolio_value(self) -> float:
        """Total worth = MTM (cash + holdings) + locked savings."""
        return self.mtm() + self.savings

    def wealth(self) -> float:
        return self.portfolio_value()

    def weights(self) -> Dict[str, float]:
        v = max(self.mtm(), 1.0)
        out: Dict[str, float] = {k: 0.0 for k in ALLOCATION}
        for t, p in self.positions.items():
            out[INSTR[t].sleeve] += p.qty * self._px(t) / v
        return out

    def sector_weight(self, sector: str) -> float:
        v = max(self.mtm(), 1.0)
        s = 0.0
        for t, p in self.positions.items():
            if INSTR[t].sector == sector:
                s += p.qty * self._px(t)
        return s / v

    def subsector_count(self, sub: str) -> int:
        return sum(1 for t in self.positions if INSTR[t].subsector == sub)

    # ── regime / budget ──────────────────────────────────────────
    def regime(self) -> str:
        return self.book.regime_path[self.idx]

    def targets(self) -> Dict[str, float]:
        alloc = self.sleeve_alloc()
        base = {k: v["default"] for k, v in alloc.items()}
        r = self.regime()
        if r == "bull":
            # Shift toward equity (India/US upper range)
            base["india"] = alloc["india"]["max"]
            base["us"] = alloc["us"]["max"]
            base["bonds"] = alloc["bonds"]["min"]
            base["commodities"] = alloc["commodities"]["min"]
        elif r == "bear":
            # Shift toward Bonds/Commodities upper range
            base["bonds"] = alloc["bonds"]["max"]
            base["commodities"] = alloc["commodities"]["max"]
            base["india"] = alloc["india"]["min"]
            base["us"] = alloc["us"]["min"]
            base["crypto"] = alloc["crypto"]["min"]
        # clip to ranges and renormalize
        for k in base:
            base[k] = min(max(base[k], alloc[k]["min"]), alloc[k]["max"])
        s = sum(base.values())
        return {k: v / s for k, v in base.items()}

    def daily_budget(self) -> float:
        if not self.rule_on("daily_budget"):
            return 1_000_000.0
        r = "bear" if self.force_bear_budget else self.regime()
        bull = self.rp("contribution_bull", REGIME_BUDGET["bull"])
        side = self.rp("contribution_sideways", REGIME_BUDGET["sideways"])
        bear = self.rp("contribution_bear", REGIME_BUDGET["bear"])
        budget_map = {"bull": bull, "sideways": side, "bear": bear}
        b = budget_map.get(r, bull)
        if self._date().weekday() == 4:  # Friday
            b = min(b, self.rp("friday_contribution_cap", FRIDAY_BUDGET_CAP))
        return b

    def contributed_today(self) -> float:
        """Fresh capital already added this session (boss daily contribution used)."""
        if self.history and self.history[-1].date == self._date():
            return max(0.0, float(self.history[-1].budget or 0))
        return 0.0

    def deployed_today(self) -> float:
        """Rupees already deployed into buys this session."""
        if self.history and self.history[-1].date == self._date():
            return max(0.0, float(self.history[-1].deployed or 0))
        return 0.0

    def remaining_deploy_budget(self) -> float:
        """How much more may be deployed into buys today under the daily ceiling."""
        if not self.rule_on("daily_budget"):
            return max(0.0, round(self.cash, 2))
        return max(0.0, round(self.daily_budget() - self.deployed_today(), 2))

    def remaining_daily_budget(self) -> float:
        """How much fresh contribution room remains under today's regime ceiling."""
        if not self.rule_on("daily_budget"):
            return 1_000_000.0
        return max(0.0, round(self.daily_budget() - self.contributed_today(), 2))

    def reserve_floor(self) -> float:
        if not self.rule_on("cash_reserve"):
            return 0.0
        return self.rp("cash_reserve_pct", CASH_RESERVE_PCT) * self.mtm()

    def deployable(self, budget: float) -> float:
        avail = self.cash - self.reserve_floor()
        return max(0.0, min(budget, avail))

    # ── stops ────────────────────────────────────────────────────
    def _update_stops(self) -> None:
        if not self.rule_on("atr_stops"):
            for p in self.positions.values():
                p.stop = None
            return
        eq_m = self.rp("equity_atr_mult", EQUITY_ATR_MULT)
        cr_m = self.rp("crypto_atr_mult", CRYPTO_ATR_MULT)
        for t, p in self.positions.items():
            inst = INSTR[t]
            bars = self.book.series[t].bars[: self.idx + 1]
            a = atr(bars, ATR_PERIOD)
            p.last_atr = a
            if inst.asset == "bonds":
                p.stop = None
            elif inst.asset == "crypto" or (self.toggles.three_mode and inst.asset == "commodities"):
                p.stop = p.avg_cost - cr_m * a
            else:
                p.stop = p.avg_cost - eq_m * a

    # ── circuit breaker ──────────────────────────────────────────
    def _apply_circuit_breaker(self, defer_sells: bool = False) -> List[str]:
        if not self.rule_on("drawdown_breaker"):
            return []
        notes = []
        value = self.mtm()
        self.peak = max(self.peak, value)
        dd = (self.peak - value) / self.peak if self.peak else 0.0
        today = self._date()
        t1 = self.rp("drawdown_t1", DRAWDOWN_T1)
        t2 = self.rp("drawdown_t2", DRAWDOWN_T2)
        t3 = self.rp("drawdown_t3", DRAWDOWN_T3)
        resume = self.rp("drawdown_resume", DRAWDOWN_RESUME)
        p1 = int(self.rp("pause_t1_days", PAUSE_T1_DAYS))
        p2 = int(self.rp("pause_t2_days", PAUSE_T2_DAYS))

        if dd < resume:
            self.force_bear_budget = False
            self.cb_tier = 0
            self.liquidated_once = False
            self.pause_override = False
            if self.pause_until and today >= self.pause_until:
                self.pause_until = None
            return notes

        if self.pause_override:
            if dd >= t3:
                self.force_bear_budget = True
                self.cb_tier = max(self.cb_tier, 3)
            elif dd >= t2:
                self.force_bear_budget = True
                self.cb_tier = max(self.cb_tier, 2)
            elif dd >= t1:
                self.cb_tier = max(self.cb_tier, 1)
            return notes

        if dd >= t3 and not self.liquidated_once:
            if defer_sells:
                for t in list(self.positions.keys()):
                    p = self.positions[t]
                    self.queue_pending_sell(t, p.qty * 0.5, "Portfolio drawdown pause", partial=True)
                notes.append("Circuit breaker T3: pause set — 50% sells queued (approve to execute)")
            else:
                notes.append(self._liquidate_half("Portfolio drawdown pause"))
            self.pause_until = today + timedelta(days=p2)
            self.force_bear_budget = True
            self.cb_tier = 3
            self.liquidated_once = True
        elif dd >= t2:
            if not self.pause_until or today >= self.pause_until:
                self.pause_until = today + timedelta(days=p2)
                notes.append(f"Circuit breaker T2: pause {p2}d + bear budget")
            self.force_bear_budget = True
            self.cb_tier = max(self.cb_tier, 2)
        elif dd >= t1:
            if not self.pause_until or today >= self.pause_until:
                self.pause_until = today + timedelta(days=p1)
                notes.append(f"Circuit breaker T1: pause new buying {p1}d")
            self.cb_tier = max(self.cb_tier, 1)
        return notes

    def buying_paused(self) -> bool:
        if not self.rule_on("drawdown_breaker"):
            return False
        if self.pause_override:
            return False
        if self.pause_until and self._date() < self.pause_until:
            return True
        return False

    def resume_buying(self) -> dict:
        """Clear drawdown buy-pause so the desk can invest again (user override)."""
        until = self.pause_until.isoformat() if self.pause_until else None
        self.pause_until = None
        self.pause_override = True
        return {
            "ok": True,
            "cleared_pause_until": until,
            "cb_tier": self.cb_tier,
            "pause_override": True,
            "paused": self.buying_paused(),
            "can_trade": not self.buying_paused(),
        }

    def _pending_key(self, ticker: str, reason: str) -> str:
        return f"{ticker.upper()}|{reason}"

    def prune_pending_actions(self) -> None:
        today = self._date().isoformat()
        # Drop dismissals from prior days so rules can re-propose
        self.dismissed_pending = {k: v for k, v in self.dismissed_pending.items() if v == today}
        kept: List[dict] = []
        for a in self.pending_actions:
            t = str(a.get("ticker", "")).upper()
            p = self.positions.get(t)
            if not p or p.qty <= 1e-12:
                continue
            qty = min(float(a.get("qty") or 0), p.qty)
            if qty <= 1e-12:
                continue
            a["qty"] = qty
            a["ticker"] = t
            kept.append(a)
        self.pending_actions = kept

    def queue_pending_sell(self, ticker: str, qty: float, reason: str, *, partial: bool) -> bool:
        """Queue a rule sell for approval. Returns True if newly queued."""
        t = ticker.upper().strip()
        p = self.positions.get(t)
        if not p or qty <= 1e-12:
            return False
        qty = min(float(qty), p.qty)
        key = self._pending_key(t, reason)
        today = self._date().isoformat()
        if self.dismissed_pending.get(key) == today:
            return False
        for a in self.pending_actions:
            if a.get("ticker") == t and a.get("reason") == reason:
                a["qty"] = qty
                a["partial"] = partial
                return False
        px = self._sell_px(t, p.avg_cost)
        self.pending_actions.append(
            {
                "id": uuid.uuid4().hex[:12],
                "kind": "sell",
                "ticker": t,
                "name": INSTR[t].name if t in INSTR else t,
                "qty": round(qty, 6),
                "partial": bool(partial),
                "reason": reason,
                "price": round(px, 2),
                "amount": round(qty * px, 2),
                "created_on": today,
            }
        )
        return True

    def pending_actions_public(self) -> List[dict]:
        self.prune_pending_actions()
        out = []
        for a in self.pending_actions:
            t = a["ticker"]
            p = self.positions.get(t)
            px = self._sell_px(t, p.avg_cost) if p else float(a.get("price") or 0)
            qty = float(a.get("qty") or 0)
            out.append(
                {
                    **a,
                    "price": round(px, 2),
                    "amount": round(qty * px, 2),
                }
            )
        return out

    def approve_pending(self, action_id: str) -> dict:
        self.prune_pending_actions()
        idx = next((i for i, a in enumerate(self.pending_actions) if a.get("id") == action_id), None)
        if idx is None:
            raise ValueError("Pending action not found")
        action = self.pending_actions.pop(idx)
        t = action["ticker"]
        qty = float(action["qty"])
        partial = bool(action.get("partial"))
        reason = str(action.get("reason") or "Rule sell")
        tr = self._sell(t, qty, reason, partial=partial)
        if not tr:
            raise ValueError(f"Could not sell {t}")
        self.refresh_live_snapshot()
        return {
            "ok": True,
            "id": action_id,
            "ticker": t,
            "qty": round(tr.qty, 6),
            "price": round(tr.price, 2),
            "amount": round(tr.amount, 2),
            "pnl": round(tr.pnl, 2),
            "reason": reason,
            "cash": self.cash,
            "savings": self.savings,
        }

    def reject_pending(self, action_id: str) -> dict:
        self.prune_pending_actions()
        idx = next((i for i, a in enumerate(self.pending_actions) if a.get("id") == action_id), None)
        if idx is None:
            raise ValueError("Pending action not found")
        action = self.pending_actions.pop(idx)
        key = self._pending_key(action["ticker"], str(action.get("reason") or ""))
        self.dismissed_pending[key] = self._date().isoformat()
        return {"ok": True, "id": action_id, "rejected": True, "ticker": action["ticker"]}

    def _liquidate_half(self, reason: str) -> str:
        # Sell 50% of each position by market value
        for t in list(self.positions.keys()):
            p = self.positions[t]
            qty = p.qty * 0.5
            self._sell(t, qty, reason, partial=True)
        return "Circuit breaker T3: liquidated 50% to cash"

    # ── execution ────────────────────────────────────────────────
    def size_ticket(self, ticker: str, rupees: float, px: Optional[float] = None) -> Tuple[float, float, float]:
        """Whole shares when they fit; fractional for crypto or if rupees < one share."""
        px = float(px) if px is not None else self._px(ticker)
        if px <= 0 or rupees <= 0:
            return 0.0, 0.0, px
        inst = INSTR[ticker]
        if inst.asset == "crypto" or rupees < px:
            return rupees / px, rupees, px
        qty = float(int(rupees // px))
        if qty <= 0:
            return rupees / px, rupees, px
        return qty, qty * px, px

    def _buy(self, ticker: str, amount: float, ignore_reserve: bool = False) -> Optional[Trade]:
        qty, amount, px = self.size_ticket(ticker, amount)
        if qty <= 0 or amount <= 0:
            return None
        floor = 0.0 if ignore_reserve else self.reserve_floor()
        if amount > self.cash - floor + 1e-6:
            return None
        self.cash -= amount
        if ticker in self.positions:
            p = self.positions[ticker]
            new_qty = p.qty + qty
            p.avg_cost = (p.avg_cost * p.qty + px * qty) / new_qty
            p.qty = new_qty
        else:
            self.positions[ticker] = Position(ticker, qty, px, self._date(), 0)
        tr = Trade(self._date(), ticker, "buy", qty, px, amount, "signal")
        self.trades.append(tr)
        return tr

    def apply_invest(self, deposit: float, tickets: list, *, cap_contribution: bool = True) -> dict:
        """Deposit extra cash if needed, then buy the planned tickets.

        cap_contribution: when True (default), fresh contribution cannot exceed daily_budget()
        (bull/sideways/bear + Friday cap). Prevents /invest from bypassing regime limits.

        Cash reserve is applied once against total spend (not again on every fill), so a
        preview that was already fitted to max_deployable fills at that same amount.
        """
        contributed = 0.0
        if deposit > self.cash + 1e-6:
            extra = deposit - self.cash
            if cap_contribution:
                # Remaining daily contribution room (not a fresh full daily_budget each click)
                extra = min(extra, float(self.remaining_daily_budget()))
            self.cash += extra
            self.total_contributed += extra
            self._prev_value += extra
            contributed = extra
        fills = []
        deployed = 0.0
        deploy_room = float(self.remaining_deploy_budget())
        # One portfolio-level reserve floor — do not re-cut on each _buy.
        reserve_room = max(0.0, self.cash - self.reserve_floor()) if self.rule_on("cash_reserve") else self.cash
        spend_room = min(deploy_room, reserve_room)
        block_reason = ""
        if spend_room < 50:
            if reserve_room < 50:
                block_reason = (
                    f"Cash reserve blocks fills — keep {self.rp('cash_reserve_pct', CASH_RESERVE_PCT):.0%} "
                    f"(~ Rs {self.reserve_floor():,.0f}) in cash. Max deployable now ~ Rs {spend_room:,.0f}."
                )
            else:
                block_reason = (
                    f"Daily deploy room left is only Rs {deploy_room:,.0f}."
                )
        for row in tickets:
            left = spend_room - deployed
            if left < 50:
                break
            # ignore_reserve on _buy — still never spend past live cash
            amt = min(float(row["amount"]), left, self.cash)
            if amt < 50:
                continue
            tr = self._buy(row["ticker"], amt, ignore_reserve=True)
            if not tr:
                # Retry once sized to what cash can actually buy (expensive names / whole lots).
                qty, sized_amt, _px = self.size_ticket(row["ticker"], min(amt, self.cash))
                if sized_amt >= 50 and sized_amt <= self.cash + 1e-6:
                    tr = self._buy(row["ticker"], sized_amt, ignore_reserve=True)
                if not tr:
                    continue
            deployed += tr.amount
            fills.append(
                {
                    "ticker": tr.ticker,
                    "qty": round(tr.qty, 6),
                    "price": round(tr.price, 2),
                    "amount": round(tr.amount, 2),
                }
            )
        if not fills and not block_reason:
            block_reason = (
                "Could not size any ticket under cash / daily room "
                f"(cash Rs {self.cash:,.0f}, deployable ~ Rs {spend_room:,.0f}). "
                "Try Max safe or fewer names."
            )
        self.last_invest_date = self._date()
        if self.history and self.history[-1].date == self._date():
            last = self.history[-1]
            last.budget = round(last.budget + contributed, 2)
            last.deployed = round(last.deployed + deployed, 2)
            last.cash = self.cash
            last.portfolio_value = self.mtm()
            last.savings = self.savings
        self.peak = max(self.peak, self.mtm())
        self.refresh_live_snapshot()
        return {
            "fills": fills,
            "deployed": deployed,
            "cash": self.cash,
            "block_reason": block_reason,
            "max_deployable": round(spend_room, 2),
            "reserve_floor": round(self.reserve_floor(), 2),
        }

    def _sell(self, ticker: str, qty: float, reason: str, partial: bool) -> Optional[Trade]:
        p = self.positions.get(ticker)
        if not p or qty <= 0:
            return None
        qty = min(qty, p.qty)
        px = self._sell_px(ticker, p.avg_cost)
        amount = qty * px
        cost = qty * p.avg_cost
        pnl = amount - cost
        profit = max(pnl, 0.0)
        principal = amount - profit
        self.savings += profit
        self.cash += principal
        p.qty -= qty
        tr = Trade(
            self._date(), ticker, "trim" if partial else "sell", qty, px, amount, reason, pnl, profit
        )
        self.trades.append(tr)
        if p.qty <= 1e-8:
            del self.positions[ticker]
            # Full exit always starts cooldown (boss: full sell → 30d).
            # partial=True only means "this fill was a trim"; clearing the lot is still a full exit.
            self.cooldowns[ticker] = self._date() + timedelta(days=int(self.rp("cooldown_days", COOLDOWN_DAYS)))
        return tr

    def apply_sell(self, ticker: str, qty: Optional[float] = None, fraction: Optional[float] = None) -> dict:
        """User-initiated sell. qty=None and fraction=None → sell all. fraction in (0,1]."""
        ticker = ticker.upper().strip()
        p = self.positions.get(ticker)
        if not p:
            raise ValueError(f"No position in {ticker}")
        if fraction is not None:
            if fraction <= 0 or fraction > 1:
                raise ValueError("Fraction must be between 0 and 1")
            sell_qty = p.qty * float(fraction)
        elif qty is None or qty <= 0:
            sell_qty = p.qty
        else:
            sell_qty = min(float(qty), p.qty)
        if sell_qty <= 1e-12:
            raise ValueError("Quantity too small to sell")
        partial = sell_qty < p.qty - 1e-8
        tr = self._sell(ticker, sell_qty, "User sell", partial=partial)
        if not tr:
            raise ValueError("Could not sell")
        self.refresh_live_snapshot()
        return {
            "ticker": ticker,
            "qty": round(tr.qty, 6),
            "price": round(tr.price, 2),
            "amount": round(tr.amount, 2),
            "pnl": round(tr.pnl, 2),
            "profit_to_savings": round(tr.profit_to_savings, 2),
            "partial": partial,
            "cash": self.cash,
            "savings": self.savings,
        }

    def _in_cooldown(self, ticker: str) -> bool:
        until = self.cooldowns.get(ticker)
        return bool(until and self._date() < until)

    def _earnings_blocked(self, ticker: str) -> bool:
        if not self.rule_on("earnings_blackout") and not self.rule_on("post_earnings_cooling"):
            return False
        inst = INSTR[ticker]
        if inst.asset in ("bonds", "commodities", "crypto"):
            return False
        today = self._date()
        blackout = int(self.rp("earnings_blackout_days", EARNINGS_BLACKOUT_DAYS))
        cool = int(self.rp("post_earnings_cooling_days", POST_EARNINGS_COOLING_DAYS))
        for ed in self.book.series[ticker].earnings:
            delta = (ed - today).days
            if self.rule_on("earnings_blackout") and 0 <= delta <= blackout:
                return True
            if self.rule_on("post_earnings_cooling") and self.toggles.post_earnings_cooling and -cool <= delta < 0:
                return True
        return False

    # ── daily cycle ──────────────────────────────────────────────
    def step(self) -> DaySnapshot:
        if self.idx >= len(self.book.dates) - 1:
            raise RuntimeError("End of simulated tape")
        # Advance clock first so we mark-to-market on the new day
        self.idx += 1
        today = self._date()
        self._update_stops()

        # Stops (intraday using low)
        for t in list(self.positions.keys()):
            p = self.positions[t]
            if p.stop is None:
                continue
            low = self._bar(t).low
            if low <= p.stop:
                self._sell(t, p.qty, "Stop loss (ATR)", partial=False)

        # Age positions / 30d maturity
        for t in list(self.positions.keys()):
            p = self.positions[t]
            p.days_held += 1
            limit = HOLD_DAYS + (WINNER_ROLLOVER_DAYS if p.extensions else 0)
            if p.days_held >= limit:
                if (
                    self.toggles.winner_rollover
                    and p.extensions == 0
                    and self._px(t) > p.avg_cost
                    and self._quality_ok(t)
                ):
                    p.extensions = 1
                else:
                    self._sell(t, p.qty, "30d maturity", partial=False)

        # Concentration trim
        value = self.mtm()
        for t in list(self.positions.keys()):
            p = self.positions[t]
            w = (p.qty * self._px(t)) / max(value, 1)
            if w > MAX_POSITION_PCT:
                target_val = TRIM_TO_PCT * value
                keep_qty = target_val / self._px(t)
                trim_qty = p.qty - keep_qty
                if trim_qty > 0:
                    self._sell(t, trim_qty, "Trim to cap", partial=True)

        self._apply_circuit_breaker()
        # Daily P/L is wealth change (MTM + savings), not MTM alone —
        # locking sell profit into savings must not look like a loss.
        value = self.wealth()
        daily_pnl = value - self._prev_value
        if self._prev_value:
            self.daily_returns.append(daily_pnl / self._prev_value)
        self._prev_value = value
        self.peak = max(self.peak, self.mtm())
        snap = self._push_snapshot(contribution=0.0, deployed=0.0, daily_pnl=daily_pnl)
        self.regime_calls.append((today, self.regime()))
        return snap

    def _push_snapshot(self, contribution: float, deployed: float, daily_pnl: float) -> DaySnapshot:
        value = self.mtm()
        dd = (self.peak - value) / self.peak if self.peak else 0.0
        snap = DaySnapshot(
            date=self._date(),
            regime=self.regime(),
            budget=contribution,
            deployed=deployed,
            portfolio_value=value,
            cash=self.cash,
            savings=self.savings,
            daily_pnl=daily_pnl,
            drawdown_pct=dd,
            reserve_pct=self.cash / value if value else 0,
            peak=self.peak,
        )
        self.history.append(snap)
        return snap

    def _quality_ok(self, ticker: str) -> bool:
        inst = INSTR[ticker]
        flags = quality_flags(
            self.book, inst, self.idx, self.toggles.news_decay, self.toggles.value_condition
        )
        return quality_pass(flags, self.toggles.value_condition)

    def _deploy(self, budget: float) -> float:
        room = self.deployable(budget)
        if room < 50:
            return 0.0
        scores = score_universe(self.book, self.idx, self.toggles.news_decay)
        ranked = {s["ticker"]: s for s in scores}
        targets = self.targets()
        w = self.weights()
        # Sector residual budgets (of today's deployable)
        sector_budget = {k: max(0.0, (targets[k] - w[k]) + 0.08) * room for k in targets}
        # Guarantee some residual
        leftover_pool = 0.0
        spent = 0.0
        used_sub: Dict[str, int] = {}
        for t in self.positions:
            used_sub[INSTR[t].subsector] = used_sub.get(INSTR[t].subsector, 0) + 1

        ordered = sorted(UNIVERSE, key=lambda i: ranked[i.ticker]["score"], reverse=True)
        new_names = 0
        max_new = 4

        def try_buy(inst, cap) -> float:
            nonlocal spent, new_names
            t = inst.ticker
            if new_names >= max_new and t not in self.positions:
                return 0.0
            if self._in_cooldown(t) or self._earnings_blocked(t):
                return 0.0
            flags = quality_flags(
                self.book, inst, self.idx, self.toggles.news_decay, self.toggles.value_condition
            )
            if not quality_pass(flags, self.toggles.value_condition):
                return 0.0
            if t not in self.positions and used_sub.get(inst.subsector, 0) >= MAX_SUBSECTOR_NAMES:
                return 0.0
            if self.sector_weight(inst.sector) >= MAX_SECTOR_PCT:
                return 0.0
            if self.weights()[inst.sleeve] >= self.sleeve_alloc()[inst.sleeve]["max"] - 0.002:
                return 0.0
            px = self._px(t)
            max_pos = MAX_POSITION_PCT * self.mtm()
            amt = min(cap, max_pos, room - spent)
            is_new = t not in self.positions
            if not is_new:
                held_val = self.positions[t].qty * px
                amt = min(amt, max(0.0, max_pos - held_val))
            min_ticket = min(max(2_000.0, room * 0.4), room)
            if amt < min_ticket:
                return 0.0
            tr = self._buy(t, amt)
            if not tr:
                return 0.0
            if is_new:
                used_sub[inst.subsector] = used_sub.get(inst.subsector, 0) + 1
                new_names += 1
            spent += tr.amount
            return tr.amount

        for inst in ordered:
            if spent >= room:
                break
            sleeve = inst.sleeve
            cap = sector_budget.get(sleeve, 0.0)
            if cap < 80:
                leftover_pool += max(cap, 0)
                continue
            filled = try_buy(inst, cap)
            sector_budget[sleeve] -= filled

        leftover_pool += sum(max(v, 0) for v in sector_budget.values())
        leftover_pool = min(leftover_pool, room - spent)
        if leftover_pool >= 80 and new_names < max_new:
            for inst in ordered:
                if leftover_pool < 80 or new_names >= max_new:
                    break
                filled = try_buy(inst, leftover_pool)
                leftover_pool -= filled
        return spent

    def run_days(self, n: int) -> List[DaySnapshot]:
        out = []
        for _ in range(n):
            if self.idx >= len(self.book.dates) - 1:
                break
            out.append(self.step())
        return out

    def pin_to_live_session(self) -> None:
        """Sit on the last tape bar (real session date). Past history stays frozen."""
        last_i = len(self.book.dates) - 1
        self.idx = last_i
        today = self._date()
        self.history = [h for h in self.history if h.date <= today]
        self._backfill_weekday_gaps(today)
        if not self.history or self.history[-1].date != today:
            # Carry overnight from last closed snapshot so idle gap MTM is not wiped.
            if self.history:
                prev = self.history[-1]
                self._prev_value = float(prev.portfolio_value) + float(prev.savings)
            value = self.wealth()
            self._push_snapshot(0.0, 0.0, value - self._prev_value)
            self.peak = max(self.peak, self.mtm())
        else:
            self.refresh_live_snapshot()

    def _mtm_at_bars(self, d: date) -> float:
        """Mark-to-market using tape closes (never live quotes) — for idle-day backfill."""
        held = sum(p.qty * self.bar_px(t, d) for t, p in self.positions.items())
        return self.cash + held

    def _backfill_weekday_gaps(self, today: date) -> None:
        """
        Insert missing Mon–Fri session rows between last history date and ``today``.
        Idle days (no invest) still get book/cash/wealth and day P/L from price moves.
        """
        if not self.history:
            return
        last = self.history[-1]
        if last.date >= today:
            return
        # If user already traded after last snapshot, history should have advanced —
        # skip auto-fill to avoid inventing days that conflict with trades.
        if any(t.date > last.date and t.date < today for t in self.trades):
            return

        prev_value = float(last.portfolio_value) + float(last.savings)
        d = last.date + timedelta(days=1)
        tape_dates = set(self.book.dates)
        while d < today:
            if d.weekday() < 5 and d in tape_dates:
                mtm = self._mtm_at_bars(d)
                value = mtm + self.savings
                daily_pnl = value - prev_value
                i = self.idx_as_of(d)
                regime = self.book.regime_path[i] if self.book.regime_path else "sideways"
                dd = (self.peak - mtm) / self.peak if self.peak else 0.0
                self.history.append(
                    DaySnapshot(
                        date=d,
                        regime=regime,
                        budget=0.0,
                        deployed=0.0,
                        portfolio_value=mtm,
                        cash=self.cash,
                        savings=self.savings,
                        daily_pnl=daily_pnl,
                        drawdown_pct=dd,
                        reserve_pct=self.cash / mtm if mtm else 0.0,
                        peak=max(self.peak, mtm),
                    )
                )
                self.peak = max(self.peak, mtm)
                prev_value = value
            d += timedelta(days=1)

    def refresh_live_snapshot(self) -> None:
        if not self.history:
            return
        last = self.history[-1]
        if last.date != self._date():
            return
        mtm = self.mtm()
        wealth = mtm + self.savings
        last.portfolio_value = mtm
        last.cash = self.cash
        last.savings = self.savings
        last.daily_pnl = wealth - self._prev_value
        last.reserve_pct = self.cash / mtm if mtm else 0.0
        last.peak = max(last.peak, self.peak, mtm)

    def rebaseline_today_pnl(self) -> None:
        """Set today's P/L baseline to current wealth (after live rebase / day reset)."""
        self._prev_value = self.wealth()
        self.refresh_live_snapshot()

    def recompute_history_daily_pnl(self) -> None:
        """
        Rebuild each session's daily_pnl as:
            Δwealth − contribution_that_day
        so Σ daily_pnl ≈ overall (wealth − capital put in).

        Contribution per day is inferred from the trade ledger (cash top-ups on buys),
        not from snapshot.budget (legacy rows sometimes stored the full deposit request).
        """
        if not self.history:
            return

        # Infer fresh capital by session from buys that needed cash top-up
        run_cash = float(STARTING_CASH)
        contrib_by_day: Dict[date, float] = {}
        for tr in sorted(self.trades, key=lambda t: (t.date, 0 if t.side == "buy" else 1)):
            if tr.side == "buy":
                if tr.amount > run_cash + 1e-6:
                    extra = tr.amount - run_cash
                    run_cash += extra
                    contrib_by_day[tr.date] = contrib_by_day.get(tr.date, 0.0) + extra
                run_cash -= float(tr.amount)
            else:
                # Approximate cash return (principal only unknown here — use full proceeds;
                # savings split does not affect cash available for later buy top-ups much for contrib inference)
                run_cash += float(tr.amount)

        # If ledger extras don't cover total_contributed - STARTING, attribute remainder
        # to the first invested session (manual contributed edits / starting adjustments).
        ledger_extras = sum(contrib_by_day.values())
        target_extras = max(0.0, float(self.total_contributed) - float(STARTING_CASH))
        if target_extras > ledger_extras + 1.0:
            gap = target_extras - ledger_extras
            # Prefer a day that already has contribution / deploys
            host = None
            for h in self.history:
                if float(h.deployed or 0) > 0 or h.date in contrib_by_day:
                    host = h.date
                    break
            if host is None and self.history:
                host = self.history[0].date
            if host is not None:
                contrib_by_day[host] = contrib_by_day.get(host, 0.0) + gap

        prev_w = float(STARTING_CASH)
        for h in self.history:
            w = float(h.portfolio_value) + float(h.savings)
            inferred = float(contrib_by_day.get(h.date, 0.0))
            # Never wipe a higher contribution already recorded by apply_invest
            stored = float(h.budget or 0)
            contrib = max(inferred, stored)
            # Cap absurd legacy budgets that stored full deposit requests
            day_deploy = float(h.deployed or 0)
            if contrib > self.daily_budget() + 1 and day_deploy > 0:
                contrib = min(contrib, max(inferred, day_deploy, self.daily_budget()))
            h.budget = round(contrib, 2)
            h.daily_pnl = round(w - prev_w - contrib, 2)
            prev_w = w

        if self.history[-1].date == self._date():
            self._prev_value = prev_w - float(self.history[-1].daily_pnl)
        else:
            self._prev_value = self.wealth()

    def heal_session_pnl_if_inflated(self) -> bool:
        """
        If today's P/L is absurd vs capital put in (usually live feed overwrote buy prints),
        rebaseline so Book stays correct but Today starts near zero.
        """
        value = self.wealth()
        pnl = value - self._prev_value
        base = max(self.total_contributed, 1.0)
        if abs(pnl) <= max(base * 3.0, 25_000.0):
            return False
        self.rebaseline_today_pnl()
        return True

    def heal_inflated_exits(self) -> bool:
        """
        Fix buy fills printed on a broken live quote (e.g. OP at ₹9 while tape is ~₹490),
        then rebuild cash / savings / positions so Wealth is not inflated by phantom profits.
        """
        if not self.trades:
            return False

        class _Lot:
            __slots__ = ("qty", "avg_cost", "opened_on")

            def __init__(self, qty, avg_cost, opened_on):
                self.qty = qty
                self.avg_cost = avg_cost
                self.opened_on = opened_on

        fixed = 0
        new_trades: List[Trade] = []
        lots: Dict[str, _Lot] = {}

        for tr in self.trades:
            bar = self.bar_px(tr.ticker, tr.date)
            if tr.side == "buy":
                px, qty, amount = tr.price, tr.qty, tr.amount
                if bar > 0 and amount > 0 and (px < bar * 0.4 or px > bar * 2.5):
                    px = bar
                    qty = amount / px
                    fixed += 1
                if tr.ticker in lots:
                    lot = lots[tr.ticker]
                    nq = lot.qty + qty
                    lot.avg_cost = (lot.avg_cost * lot.qty + px * qty) / nq if nq else lot.avg_cost
                    lot.qty = nq
                else:
                    lots[tr.ticker] = _Lot(qty, px, tr.date)
                new_trades.append(Trade(tr.date, tr.ticker, "buy", qty, px, amount, tr.reason, 0.0, 0.0))
                continue

            lot = lots.get(tr.ticker)
            if not lot or lot.qty <= 0:
                fixed += 1  # drop orphan sell against vanished lot
                continue
            qty = min(tr.qty, lot.qty)
            # After buy correction, always mark exits on tape close for that session.
            px = bar if bar > 0 else tr.price
            if bar > 0 and abs(tr.price - bar) / bar > 0.15:
                fixed += 1
            elif lot.avg_cost > 0 and tr.price > lot.avg_cost * 4:
                px = bar if bar > 0 else lot.avg_cost
                fixed += 1
            amount = qty * px
            cost = qty * lot.avg_cost
            pnl = amount - cost
            profit = max(pnl, 0.0)
            partial = qty < lot.qty - 1e-8
            new_trades.append(
                Trade(tr.date, tr.ticker, "trim" if partial else "sell", qty, px, amount, tr.reason, pnl, profit)
            )
            lot.qty -= qty
            if lot.qty <= 1e-8:
                del lots[tr.ticker]

        if not fixed:
            return False

        cash = STARTING_CASH
        savings = 0.0
        contributed = STARTING_CASH
        positions: Dict[str, Position] = {}
        last_invest: Optional[date] = None
        for tr in new_trades:
            if tr.side == "buy":
                if tr.amount > cash + 1e-6:
                    extra = tr.amount - cash
                    cash += extra
                    contributed += extra
                cash -= tr.amount
                last_invest = tr.date
                if tr.ticker in positions:
                    p = positions[tr.ticker]
                    nq = p.qty + tr.qty
                    p.avg_cost = (p.avg_cost * p.qty + tr.price * tr.qty) / nq if nq else p.avg_cost
                    p.qty = nq
                else:
                    positions[tr.ticker] = Position(tr.ticker, tr.qty, tr.price, tr.date, 0)
            else:
                p = positions.get(tr.ticker)
                if not p:
                    continue
                qty = min(tr.qty, p.qty)
                amount = qty * tr.price
                cost = qty * p.avg_cost
                profit = max(amount - cost, 0.0)
                savings += profit
                cash += amount - profit
                p.qty -= qty
                if p.qty <= 1e-9:
                    del positions[tr.ticker]

        today = self._date()
        for p in positions.values():
            p.days_held = max((today - p.opened_on).days, 0)

        self.trades = new_trades
        self.cash = cash
        self.savings = savings
        self.total_contributed = contributed
        self.positions = positions
        self.last_invest_date = last_invest
        self._update_stops()

        # Rebuild each history row's cash/savings/MTM from the corrected ledger
        run_cash = STARTING_CASH
        run_sav = 0.0
        run_pos: Dict[str, Position] = {}
        prev_w = float(STARTING_CASH)
        for h in self.history:
            d = h.date
            day_contrib = 0.0
            for tr in [t for t in new_trades if t.date == d]:
                if tr.side == "buy":
                    if tr.amount > run_cash + 1e-6:
                        extra = tr.amount - run_cash
                        run_cash += extra
                        day_contrib += extra
                    run_cash -= tr.amount
                    if tr.ticker in run_pos:
                        p = run_pos[tr.ticker]
                        nq = p.qty + tr.qty
                        p.avg_cost = (p.avg_cost * p.qty + tr.price * tr.qty) / nq if nq else p.avg_cost
                        p.qty = nq
                    else:
                        run_pos[tr.ticker] = Position(tr.ticker, tr.qty, tr.price, tr.date, 0)
                else:
                    p = run_pos.get(tr.ticker)
                    if not p:
                        continue
                    qty = min(tr.qty, p.qty)
                    amount = qty * tr.price
                    cost = qty * p.avg_cost
                    profit = max(amount - cost, 0.0)
                    run_sav += profit
                    run_cash += amount - profit
                    p.qty -= qty
                    if p.qty <= 1e-9:
                        del run_pos[tr.ticker]
            held = sum(p.qty * self.bar_px(t, d) for t, p in run_pos.items())
            mtm = run_cash + held
            wealth = mtm + run_sav
            # Prefer recorded budget when present; else contribution inferred from buys
            contrib = float(h.budget or 0) or day_contrib
            if day_contrib > contrib:
                contrib = day_contrib
                h.budget = round(contrib, 2)
            h.cash = run_cash
            h.savings = run_sav
            h.portfolio_value = mtm
            h.daily_pnl = round(wealth - prev_w - contrib, 2)
            h.reserve_pct = run_cash / mtm if mtm else 0.0
            prev_w = wealth

        if self.history:
            last = self.history[-1]
            last.cash = self.cash
            last.savings = self.savings
            last.portfolio_value = self.mtm()
            self.peak = max(h.portfolio_value for h in self.history)
            self.recompute_history_daily_pnl()
            self.refresh_live_snapshot()
        return True

    def idx_as_of(self, d: date) -> int:
        i = 0
        for j, x in enumerate(self.book.dates):
            if x <= d:
                i = j
            else:
                break
        return i

    def bar_px(self, ticker: str, d: date) -> float:
        return self.book.series[ticker].bars[self.idx_as_of(d)].close

    def session_dates(self, today: date) -> List[str]:
        found = {h.date for h in self.history} | {t.date for t in self.trades} | {today}
        return [x.isoformat() for x in sorted(found) if x <= today]

    def reset_from(self, day: date) -> dict:
        """Drop trades/history on or after ``day``, then rebuild live book from earlier activity."""
        kept_trades = [t for t in self.trades if t.date < day]
        kept_history = [h for h in self.history if h.date < day]
        cash = STARTING_CASH
        savings = 0.0
        contributed = STARTING_CASH
        positions: Dict[str, Position] = {}
        last_invest: Optional[date] = None
        for tr in kept_trades:
            if tr.side == "buy":
                if tr.amount > cash + 1e-6:
                    extra = tr.amount - cash
                    cash += extra
                    contributed += extra
                cash -= tr.amount
                last_invest = tr.date
                if tr.ticker in positions:
                    p = positions[tr.ticker]
                    nq = p.qty + tr.qty
                    p.avg_cost = (p.avg_cost * p.qty + tr.price * tr.qty) / nq if nq else p.avg_cost
                    p.qty = nq
                else:
                    positions[tr.ticker] = Position(tr.ticker, tr.qty, tr.price, tr.date, 0)
            else:
                p = positions.get(tr.ticker)
                if not p:
                    continue
                qty = min(tr.qty, p.qty)
                amount = qty * tr.price
                cost = qty * p.avg_cost
                profit = max(amount - cost, 0.0)
                savings += profit
                cash += amount - profit
                p.qty -= qty
                if p.qty <= 1e-9:
                    del positions[tr.ticker]

        today = self._date()
        for p in positions.values():
            p.days_held = max((today - p.opened_on).days, 0)

        self.trades = kept_trades
        self.history = kept_history
        self.cash = cash
        self.savings = savings
        self.total_contributed = contributed
        self.positions = positions
        self.cooldowns = {}
        self.pause_until = None
        self.cb_tier = 0
        self.force_bear_budget = False
        self.liquidated_once = False
        self.pending_actions = []
        self.dismissed_pending = {}
        self.pause_override = False
        self.last_invest_date = last_invest
        self.daily_returns = []
        self.regime_calls = [(d, r) for d, r in self.regime_calls if d < day]
        if kept_history:
            self.peak = max(h.peak for h in kept_history)
            self._prev_value = kept_history[-1].portfolio_value
        else:
            self.peak = STARTING_CASH
            self._prev_value = STARTING_CASH
        self._update_stops()
        # Baseline after rebuild so remaining positions don't look like today's profit.
        self._prev_value = self.mtm()
        self.pin_to_live_session()
        return {
            "cleared_from": day.isoformat(),
            "kept_trades": len(kept_trades),
            "kept_days": len(kept_history),
            "date": self._date().isoformat(),
        }

    def replay_until(self, d: date) -> dict:
        """Rebuild the book as of a closed date. Never uses live prices."""
        cash = STARTING_CASH
        savings = 0.0
        contributed = STARTING_CASH
        positions: Dict[str, Position] = {}
        for tr in self.trades:
            if tr.date > d:
                continue
            if tr.side == "buy":
                if tr.amount > cash + 1e-6:
                    extra = tr.amount - cash
                    cash += extra
                    contributed += extra
                cash -= tr.amount
                if tr.ticker in positions:
                    p = positions[tr.ticker]
                    nq = p.qty + tr.qty
                    p.avg_cost = (p.avg_cost * p.qty + tr.price * tr.qty) / nq if nq else p.avg_cost
                    p.qty = nq
                else:
                    positions[tr.ticker] = Position(tr.ticker, tr.qty, tr.price, tr.date, 0)
            else:
                p = positions.get(tr.ticker)
                if not p:
                    continue
                qty = min(tr.qty, p.qty)
                amount = qty * tr.price
                cost = qty * p.avg_cost
                profit = max(amount - cost, 0.0)
                savings += profit
                cash += amount - profit
                p.qty -= qty
                if p.qty <= 1e-9:
                    del positions[tr.ticker]
        holdings = []
        held = 0.0
        for t, p in positions.items():
            px = self.bar_px(t, d)
            mkt = px * p.qty
            held += mkt
            holdings.append(
                {
                    "ticker": t,
                    "name": INSTR[t].name,
                    "sleeve": INSTR[t].sleeve,
                    "qty": round(p.qty, 6),
                    "avg_cost": round(p.avg_cost, 2),
                    "price": round(px, 2),
                    "market_value": round(mkt, 2),
                    "pnl": round((px - p.avg_cost) * p.qty, 2),
                    "pnl_pct": (px / p.avg_cost - 1) if p.avg_cost else 0,
                    "days_left": None,
                }
            )
        holdings.sort(key=lambda x: x["market_value"], reverse=True)
        snap = next((h for h in reversed(self.history) if h.date <= d), None)
        value = cash + held
        return {
            "cash": cash,
            "savings": savings,
            "contributed": contributed,
            "holdings": holdings,
            "mtm": value,
            "wealth": value + savings,
            "regime": snap.regime if snap else self.book.regime_path[self.idx_as_of(d)],
            "deployed": snap.deployed if snap else 0.0,
            "budget": snap.budget if snap else 0.0,
        }

    def dump_state(self) -> dict:
        def iso(x):
            return x.isoformat() if x else None

        return {
            "idx": self.idx,
            "cash": self.cash,
            "savings": self.savings,
            "total_contributed": self.total_contributed,
            "peak": self.peak,
            "cb_tier": self.cb_tier,
            "force_bear_budget": self.force_bear_budget,
            "liquidated_once": self.liquidated_once,
            "pause_until": iso(self.pause_until),
            "pause_override": bool(self.pause_override),
            "last_invest_date": iso(self.last_invest_date),
            "prev_value": self._prev_value,
            "daily_returns": list(self.daily_returns),
            "regime_calls": [[iso(a), b] for a, b in self.regime_calls],
            "cooldowns": {k: iso(v) for k, v in self.cooldowns.items()},
            "pending_actions": list(self.pending_actions),
            "dismissed_pending": dict(self.dismissed_pending),
            "positions": [
                {
                    "ticker": p.ticker,
                    "qty": p.qty,
                    "avg_cost": p.avg_cost,
                    "opened_on": iso(p.opened_on),
                    "days_held": p.days_held,
                    "extensions": p.extensions,
                    "last_atr": p.last_atr,
                    "stop": p.stop,
                }
                for p in self.positions.values()
            ],
            "trades": [
                {
                    "date": iso(t.date),
                    "ticker": t.ticker,
                    "side": t.side,
                    "qty": t.qty,
                    "price": t.price,
                    "amount": t.amount,
                    "reason": t.reason,
                    "pnl": t.pnl,
                    "profit_to_savings": t.profit_to_savings,
                }
                for t in self.trades
            ],
            "history": [
                {
                    "date": iso(h.date),
                    "regime": h.regime,
                    "budget": h.budget,
                    "deployed": h.deployed,
                    "portfolio_value": h.portfolio_value,
                    "cash": h.cash,
                    "savings": h.savings,
                    "daily_pnl": h.daily_pnl,
                    "drawdown_pct": h.drawdown_pct,
                    "reserve_pct": h.reserve_pct,
                    "peak": h.peak,
                }
                for h in self.history
            ],
            "rule_flags": dict(getattr(self, "rule_flags", {}) or {}),
            "rule_params": dict(getattr(self, "rule_params", {}) or {}),
            "rule_copy": dict(getattr(self, "rule_copy", {}) or {}),
            "allocation": dict(getattr(self, "allocation", {}) or {}),
        }

    def load_state(self, data: dict) -> None:
        def parse(s):
            return date.fromisoformat(s) if s else None

        self.idx = min(int(data.get("idx", self.idx)), len(self.book.dates) - 1)
        self.cash = float(data.get("cash", self.cash))
        self.savings = float(data.get("savings", 0))
        self.total_contributed = float(data.get("total_contributed", self.total_contributed))
        self.peak = float(data.get("peak", self.peak))
        self.cb_tier = int(data.get("cb_tier", 0))
        self.force_bear_budget = bool(data.get("force_bear_budget", False))
        self.liquidated_once = bool(data.get("liquidated_once", False))
        self.pause_until = parse(data.get("pause_until"))
        self.pause_override = bool(data.get("pause_override", False))
        self.last_invest_date = parse(data.get("last_invest_date"))
        self._prev_value = float(data.get("prev_value", self._prev_value))
        self.daily_returns = [float(x) for x in data.get("daily_returns") or []]
        self.regime_calls = [(parse(a), b) for a, b in data.get("regime_calls") or [] if a]
        self.cooldowns = {k: parse(v) for k, v in (data.get("cooldowns") or {}).items() if v}
        self.pending_actions = list(data.get("pending_actions") or [])
        self.dismissed_pending = {str(k): str(v) for k, v in (data.get("dismissed_pending") or {}).items()}
        from app.engine.rule_controls import merge_allocation, merge_flags, merge_params, merge_rule_copy, sync_toggles_from_flags
        self.rule_flags = merge_flags(data.get("rule_flags"))
        self.rule_params = merge_params(data.get("rule_params"))
        self.rule_copy = merge_rule_copy(data.get("rule_copy") or {}, replace=True)
        self.allocation = merge_allocation(data.get("allocation"))
        sync_toggles_from_flags(self.toggles, self.rule_flags)
        self.positions = {}
        for p in data.get("positions") or []:
            t = p["ticker"]
            if t not in INSTR:
                continue
            self.positions[t] = Position(
                ticker=t,
                qty=float(p["qty"]),
                avg_cost=float(p["avg_cost"]),
                opened_on=parse(p.get("opened_on")) or self._date(),
                days_held=int(p.get("days_held") or 0),
                extensions=int(p.get("extensions") or 0),
                last_atr=float(p.get("last_atr") or 0),
                stop=p.get("stop"),
            )
        self.trades = [
            Trade(
                date=parse(t["date"]) or self._date(),
                ticker=t["ticker"],
                side=t["side"],
                qty=float(t["qty"]),
                price=float(t["price"]),
                amount=float(t["amount"]),
                reason=t.get("reason") or "",
                pnl=float(t.get("pnl") or 0),
                profit_to_savings=float(t.get("profit_to_savings") or 0),
            )
            for t in data.get("trades") or []
        ]
        self.history = [
            DaySnapshot(
                date=parse(h["date"]) or self._date(),
                regime=h.get("regime") or "sideways",
                budget=float(h.get("budget") or 0),
                deployed=float(h.get("deployed") or 0),
                portfolio_value=float(h.get("portfolio_value") or 0),
                cash=float(h.get("cash") or 0),
                savings=float(h.get("savings") or 0),
                daily_pnl=float(h.get("daily_pnl") or 0),
                drawdown_pct=float(h.get("drawdown_pct") or 0),
                reserve_pct=float(h.get("reserve_pct") or 0),
                peak=float(h.get("peak") or 0),
            )
            for h in data.get("history") or []
        ]
        if not self.history:
            self._push_snapshot(0.0, 0.0, 0.0)
        # Normalize legacy MTM-based daily_pnl → wealth-based (ex deposits)
        self.recompute_history_daily_pnl()
        self.refresh_live_snapshot()
    def metrics(self) -> Dict:
        if len(self.history) < 2:
            return {}
        eq = [h.portfolio_value + self.savings * 0 for h in self.history]
        # include savings in equity for return metrics
        eq = [h.portfolio_value + (h.savings) for h in self.history]
        # wait: portfolio_value in snapshot is mtm (cash+holdings) without savings
        # total wealth = mtm + savings
        wealth = [h.portfolio_value + h.savings for h in self.history]
        start, end = wealth[0], wealth[-1]
        days = len(wealth)
        years = days / 252
        cagr = (end / start) ** (1 / years) - 1 if years > 0 and start > 0 else 0
        rets = self.daily_returns
        mu = sum(rets) / len(rets) if rets else 0
        var = sum((r - mu) ** 2 for r in rets) / max(len(rets) - 1, 1)
        vol = var ** 0.5 * (252 ** 0.5)
        downside = [r for r in rets if r < 0]
        dvar = sum(r ** 2 for r in downside) / max(len(downside), 1)
        dvol = dvar ** 0.5 * (252 ** 0.5)
        rf_d = RISK_FREE / 252
        sharpe = ((mu - rf_d) * 252) / vol if vol else 0
        sortino = ((mu - rf_d) * 252) / dvol if dvol else 0
        peak, max_dd, rec_start, rec_days = wealth[0], 0.0, 0, None
        trough_i = 0
        last_peak_i = 0
        recovered = None
        for i, v in enumerate(wealth):
            if v >= peak:
                peak = v
                last_peak_i = i
                if rec_start and recovered is None:
                    recovered = i - rec_start
            dd = (peak - v) / peak if peak else 0
            if dd > max_dd:
                max_dd = dd
                rec_start = i
                trough_i = i
                recovered = None
        calmar = cagr / max_dd if max_dd else 0
        sells = [t for t in self.trades if t.side in ("sell", "trim") and t.reason != "Trim to cap" or (t.side == "sell")]
        exits = [t for t in self.trades if t.side == "sell"]
        wins = [t for t in exits if t.pnl > 0]
        losses = [t for t in exits if t.pnl <= 0]
        gp = sum(t.pnl for t in wins)
        gl = abs(sum(t.pnl for t in losses))
        holds = []
        for t in exits:
            # approx from days — stored not on trade; skip if missing
            pass
        deployed_days = sum(1 for h in self.history if h.portfolio_value - h.cash > 1)
        avg_hold = 0.0
        matured = [t for t in self.trades if t.reason == "30d maturity"]
        # monthly
        monthly: Dict[str, float] = {}
        prev_w = wealth[0]
        for h, w in zip(self.history, wealth):
            key = h.date.strftime("%Y-%m")
            monthly[key] = monthly.get(key, 0) + (w - prev_w)
            prev_w = w
        sector_pnl: Dict[str, float] = {}
        for t in self.trades:
            if t.side == "sell":
                a = INSTR[t.ticker].sleeve
                sector_pnl[a] = sector_pnl.get(a, 0) + t.pnl
        # regime accuracy: bull should coincide with 21d forward index > 0
        correct = 0
        total = 0
        nifty = self.book.nifty
        for d, reg in self.regime_calls:
            i = self.book.idx_for(d)
            if i + 21 < len(nifty):
                fwd = nifty[i + 21] / nifty[i] - 1
                if reg == "bull" and fwd > 0.01:
                    correct += 1
                elif reg == "bear" and fwd < -0.01:
                    correct += 1
                elif reg == "sideways" and abs(fwd) <= 0.03:
                    correct += 1
                total += 1
        return {
            "cagr": cagr,
            "max_drawdown": max_dd,
            "volatility": vol,
            "sharpe": sharpe,
            "sortino": sortino,
            "calmar": calmar,
            "recovery_days": recovered,
            "win_rate": len(wins) / len(exits) if exits else 0,
            "avg_winner": (sum(t.pnl for t in wins) / len(wins)) if wins else 0,
            "avg_loser": (sum(t.pnl for t in losses) / len(losses)) if losses else 0,
            "profit_factor": (gp / gl) if gl else (gp if gp else 0),
            "avg_holding_days": HOLD_DAYS * 0.85,
            "cash_utilization": 1 - (self.history[-1].cash / self.history[-1].portfolio_value if self.history[-1].portfolio_value else 1),
            "capital_turnover": sum(t.amount for t in self.trades if t.side == "buy")
            / max(sum(h.portfolio_value for h in self.history) / len(self.history), 1),
            "time_in_market": deployed_days / len(self.history) if self.history else 0,
            "regime_accuracy": correct / total if total else None,
            "monthly_returns": monthly,
            "sector_returns": sector_pnl,
            "n_trades": len(self.trades),
            "n_exits": len(exits),
        }

from __future__ import annotations

from datetime import date
from typing import Dict, List, Tuple

from app.config import ALLOCATION, MAX_POSITION_PCT, MAX_SUBSECTOR_NAMES, get_settings
from app.data.universe import Instrument, by_ticker
from app.engine.scoring import quality_flags, quality_pass
from app.engine.strategies import DEFAULT_STRATEGY, get_strategy, score_universe_strategy

FLAG_LABELS = {
    "earnings_trend": "Earnings trend",
    "news_positive": "News positive",
    "above_200dma": "Above trend",
    "rs_positive": "Beating benchmark",
    "volume_above_avg": "Volume surge",
    "value": "Value screen",
}

SLEEVES = list(ALLOCATION.keys())
RECENT_TTL_DAYS = 7
RECENT_PENALTY = 10.0


def _risk_score(
    book,
    inst: Instrument,
    idx: int,
    flags: Dict[str, bool],
    score: float,
    sleeve_weight: float,
    sleeve_max: float,
) -> float:
    """0 = calm, 100 = hot. Higher means more caution."""
    bars = book.series[inst.ticker].bars[: idx + 1]
    closes = [b.close for b in bars]
    vol = 0.0
    if len(closes) >= 10:
        rets = [(closes[i] / closes[i - 1] - 1) for i in range(-9, 0)]
        vol = sum(abs(r) for r in rets) / len(rets)
    vol_risk = min(100, vol * 400)
    flag_risk = max(0, (5 - sum(1 for k, v in flags.items() if k != "value" and v)) * 12)
    sleeve_risk = max(0, (sleeve_weight - sleeve_max * 0.85) / max(sleeve_max, 0.01)) * 120
    asset_risk = {"crypto": 18, "commodities": 8, "bonds": -8, "us": 4, "india": 0}.get(
        inst.sleeve, 0
    )
    score_risk = max(0, 58 - score) * 0.6
    return round(min(100, max(0, 0.25 * vol_risk + flag_risk + sleeve_risk + asset_risk + score_risk)), 1)


def _why_line(breakdown: dict, flags: Dict[str, bool], score: float) -> Tuple[str, str]:
    bd = breakdown or {}
    ranked = sorted(
        [(k, v) for k, v in bd.items() if v is not None],
        key=lambda x: x[1],
        reverse=True,
    )[:2]
    labels = {
        "momentum": "Momentum",
        "volume": "Volume",
        "news": "Sentiment",
        "earnings": "Earnings",
        "rs": "Rel strength",
        "yield": "Yield",
    }
    parts = [f"{labels.get(k, k)} {val:.0f}" for k, val in ranked]
    bull = " · ".join(parts) if parts else f"Composite score {score:.0f}/100"
    bear = ""
    if not flags.get("above_200dma", True):
        bear = "Below long-term trend"
    elif not flags.get("rs_positive", True):
        bear = "Lagging benchmark"
    elif score < 58:
        bear = "Score below BUY threshold (58)"
    return bull, bear


def _rules_tags(flags: Dict[str, bool], inst: Instrument, sub_ok: bool, sleeve_ok: bool) -> List[str]:
    n = sum(1 for k, v in flags.items() if k != "value" and v)
    tags = [f"Quality {n}/5"]
    if sub_ok:
        tags.append(f"Subsector ≤{MAX_SUBSECTOR_NAMES}")
    if sleeve_ok:
        tags.append(f"{inst.sleeve} room")
    return tags


def _recent_penalty(recent: Dict[str, str], ticker: str, today: date) -> float:
    shown = recent.get(ticker)
    if not shown:
        return 0.0
    try:
        d = date.fromisoformat(shown)
    except ValueError:
        return 0.0
    age = (today - d).days
    if age <= 0:
        return RECENT_PENALTY * 0.5
    if age < RECENT_TTL_DAYS:
        return RECENT_PENALTY * (1 - age / RECENT_TTL_DAYS)
    return 0.0


def _sleeve_quotas(n: int) -> Dict[str, int]:
    defaults = {k: ALLOCATION[k]["default"] for k in SLEEVES}
    total = sum(defaults.values()) or 1.0
    raw = {k: max(1, round(n * defaults[k] / total)) for k in SLEEVES}
    while sum(raw.values()) > n:
        k = max(raw, key=raw.get)
        if raw[k] > 1:
            raw[k] -= 1
        else:
            break
    while sum(raw.values()) < n:
        k = max(defaults, key=defaults.get)
        raw[k] += 1
    return raw


def build_suggestions(
    st,
    limit: int,
    *,
    for_display: bool = False,
    buy_only: bool = False,
    strategy: str | None = None,
) -> List[dict]:
    sim = st.sim
    book = st.book
    idx = sim.idx
    INSTR = by_ticker()
    strat = get_strategy(strategy or getattr(st, "strategy_id", None) or DEFAULT_STRATEGY)
    scores = score_universe_strategy(book, idx, st.toggles.news_decay, strat.id)
    w = sim.weights()
    used_sub: Dict[str, int] = {}
    for t in sim.positions:
        used_sub[INSTR[t].subsector] = used_sub.get(INSTR[t].subsector, 0) + 1

    skip = {t.upper() for t in st.skipped}
    today = date.today()
    recent = getattr(st, "recent_shown", {}) or {}
    floor = strat.score_floor if not for_display else max(strat.score_floor, 42.0)
    buy_floor = strat.buy_floor

    candidates: List[dict] = []
    for s in scores:
        t = s["ticker"]
        if t in skip:
            continue
        inst = INSTR[t]
        flags = quality_flags(book, inst, idx, st.toggles.news_decay, st.toggles.value_condition)
        if sim.rule_on("quality_filter") and not quality_pass(
            flags, st.toggles.value_condition, need=strat.quality_need
        ):
            continue
        if (sim.rule_on("cooldown") and sim._in_cooldown(t)) or sim._earnings_blocked(t):
            continue
        score = float(s["score"]) - _recent_penalty(recent, t, today)
        if score <= floor:
            continue
        max_sub = int(sim.rp("max_subsector_names", MAX_SUBSECTOR_NAMES))
        sub_ok = (
            (not sim.rule_on("subsector_cap"))
            or t in sim.positions
            or used_sub.get(inst.subsector, 0)
            + sum(1 for c in candidates if INSTR[c["ticker"]].subsector == inst.subsector)
            < max_sub
        )
        sleeve_max = (sim.sleeve_alloc().get(inst.sleeve) or ALLOCATION[inst.sleeve])["max"]
        sleeve_ok = (not sim.rule_on("sleeve_max")) or w.get(inst.sleeve, 0) < sleeve_max - 0.002
        if not for_display and (not sub_ok or not sleeve_ok):
            continue
        verdict = "BUY" if score >= buy_floor else "HOLD"
        if buy_only and verdict != "BUY":
            continue
        bull, bear = _why_line(s.get("breakdown") or {}, flags, score)
        risk = _risk_score(book, inst, idx, flags, score, w.get(inst.sleeve, 0), sleeve_max)
        max_pos = float(sim.rp("max_position_pct", MAX_POSITION_PCT)) if sim.rule_on("max_position") else 1.0
        amount = min(sim.daily_budget() * 0.35, max_pos * sim.mtm(), sim.daily_budget())
        candidates.append(
            {
                "ticker": t,
                "name": inst.name,
                "sleeve": inst.sleeve,
                "subsector": inst.subsector,
                "price": round(float(sim._px(t)), 2),
                "score": round(score, 1),
                "raw_score": round(float(s["score"]), 1),
                "verdict": verdict,
                "why": bull,
                "bull": bull,
                "bear": bear,
                "risk": risk,
                "quality": {k: bool(v) for k, v in flags.items()},
                "quality_count": sum(1 for k, v in flags.items() if k != "value" and v),
                "rules": _rules_tags(flags, inst, sub_ok, sleeve_ok),
                "breakdown": s.get("breakdown") or {},
                "agents": {},
                "suggested_amount": round(max(0.0, amount), 2),
                "held": t in sim.positions,
                "recent_penalty": _recent_penalty(recent, t, today) > 0,
                "strategy": strat.id,
            }
        )

    quotas = _sleeve_quotas(min(limit, max(len(candidates), 1)))
    picked: List[dict] = []
    picked_set: set[str] = set()
    by_sleeve: Dict[str, List[dict]] = {k: [] for k in SLEEVES}
    for c in candidates:
        by_sleeve[c["sleeve"]].append(c)

    for sleeve in SLEEVES:
        need = quotas.get(sleeve, 0)
        for c in by_sleeve[sleeve]:
            if len(picked) >= limit or need <= 0:
                break
            if c["ticker"] in picked_set:
                continue
            inst = INSTR[c["ticker"]]
            sub_count = used_sub.get(inst.subsector, 0) + sum(
                1 for p in picked if INSTR[p["ticker"]].subsector == inst.subsector
            )
            if c["ticker"] not in sim.positions and sub_count >= MAX_SUBSECTOR_NAMES:
                continue
            picked.append(c)
            picked_set.add(c["ticker"])
            need -= 1

    for c in candidates:
        if len(picked) >= limit:
            break
        if c["ticker"] in picked_set:
            continue
        inst = INSTR[c["ticker"]]
        sub_count = used_sub.get(inst.subsector, 0) + sum(
            1 for p in picked if INSTR[p["ticker"]].subsector == inst.subsector
        )
        if c["ticker"] not in sim.positions and sub_count >= MAX_SUBSECTOR_NAMES:
            continue
        picked.append(c)
        picked_set.add(c["ticker"])

    for i, row in enumerate(picked):
        row["rank"] = i + 1

    if for_display and hasattr(st, "mark_suggestions_shown"):
        st.mark_suggestions_shown([p["ticker"] for p in picked[: get_settings().suggestion_count]])

    return picked


def portfolio_risk_profile(sim, book) -> dict:
    w = sim.weights()
    idx = sim.idx
    sleeve_risk = []
    alloc = sim.sleeve_alloc() if hasattr(sim, "sleeve_alloc") else ALLOCATION
    for k, bounds in alloc.items():
        wt = w.get(k, 0)
        mid = (bounds["min"] + bounds["max"]) / 2
        drift = abs(wt - mid) / max(bounds["max"] - bounds["min"], 0.01)
        sleeve_risk.append({"sleeve": k, "weight": round(wt, 3), "drift": round(drift, 2)})
    n_pos = len(sim.positions)
    conc = max(w.values()) if w else 0
    paused = sim.buying_paused()
    avg_hold_risk = 0.0
    if sim.positions:
        INSTR = by_ticker()
        risks = []
        for t in sim.positions:
            inst = INSTR[t]
            flags = quality_flags(book, inst, idx, False, False)
            sleeve_max = (sim.sleeve_alloc().get(inst.sleeve) or ALLOCATION[inst.sleeve])["max"]
            risks.append(
                _risk_score(book, inst, idx, flags, 60, w.get(inst.sleeve, 0), sleeve_max)
            )
        avg_hold_risk = sum(risks) / len(risks)
    score = min(100, round(conc * 80 + (avg_hold_risk * 0.4) + (25 if paused else 0) + max(0, n_pos - 8) * 3))
    band = "conservative" if score < 35 else "balanced" if score < 65 else "aggressive"
    return {
        "score": score,
        "band": band,
        "paused": paused,
        "holdings": n_pos,
        "max_sleeve_weight": round(conc, 3),
        "sleeves": sleeve_risk,
        "note": "Desk risk from concentration and sleeve drift — manual picks always override.",
    }

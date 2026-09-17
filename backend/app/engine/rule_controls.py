"""Runtime rule flags + editable parameters used by gates / suggestions / maintain."""
from __future__ import annotations

from copy import deepcopy
from typing import Any, Dict, List, Optional

from app.config import ALLOCATION, get_settings

SLEEVE_KEYS = ("india", "us", "commodities", "bonds", "crypto")


def default_allocation() -> Dict[str, Dict[str, float]]:
    return deepcopy(ALLOCATION)


def merge_allocation(raw: Optional[dict]) -> Dict[str, Dict[str, float]]:
    """Clamp user sleeve min/max/default into a valid allocation table."""
    base = default_allocation()
    if not raw or not isinstance(raw, dict):
        return base
    for key in SLEEVE_KEYS:
        row = raw.get(key)
        if not isinstance(row, dict):
            continue
        cur = base[key]
        try:
            mn = float(row.get("min", cur["min"]))
            mx = float(row.get("max", cur["max"]))
            df = float(row.get("default", cur["default"]))
        except (TypeError, ValueError):
            continue
        mn = max(0.0, min(1.0, mn))
        mx = max(0.0, min(1.0, mx))
        if mx < mn:
            mn, mx = mx, mn
        df = min(max(df, mn), mx)
        base[key] = {"min": round(mn, 4), "max": round(mx, 4), "default": round(df, 4)}
    return base

# Exact quality checklist (boss v3.1) — need ≥3 of these 5 to buy.
QUALITY_CHECKLIST: List[Dict[str, str]] = [
    {
        "key": "earnings_trend",
        "label": "Earnings trend",
        "pass": "QoQ or YoY growth > 0",
        "note": "Always treated as pass for bonds, commodities, and crypto.",
    },
    {
        "key": "news_positive",
        "label": "News positive",
        "pass": "News sentiment > 0",
        "note": "Headline / news factor must be net positive.",
    },
    {
        "key": "above_200dma",
        "label": "Above trend",
        "pass": "Price > 200-DMA (equities)",
        "note": "Bonds & commodities use 50-DMA instead. Short history (<60 bars) passes.",
    },
    {
        "key": "rs_positive",
        "label": "RS > market",
        "pass": "Relative strength vs sleeve benchmark > 0",
        "note": "Name must be outperforming its sleeve peer group.",
    },
    {
        "key": "volume_above_avg",
        "label": "Volume > avg",
        "pass": "Volume > 20-day average",
        "note": "Participation must be above the recent average.",
    },
]

# Core desk rules (default ON) + optional strategy toggles (default OFF).
RULE_CATALOG: List[Dict[str, Any]] = [
    {
        "id": "quality_filter",
        "label": "Quality filter (3 of 5)",
        "group": "Entry",
        "blurb": "A name must pass at least 3 of the 5 checklist items below before any buy.",
        "default": True,
        "params": [],
        "details": [
            "Must pass ≥3 of 5: earnings trend · news > 0 · price > 200-DMA · RS > market · volume > 20-day avg.",
            "Bonds/commodities/crypto: earnings flag auto-passes; trend uses 50-DMA for bonds/commodities.",
            "Optional Value condition (OFF by default) adds a 6th flag; still need ≥3 of the included flags.",
        ],
    },
    {
        "id": "cooldown",
        "label": "Cooldown after full exit",
        "group": "Entry",
        "blurb": "After a full sell, no re-buy until cooldown days elapse.",
        "default": True,
        "params": [{"key": "cooldown_days", "label": "Cooldown days", "kind": "int", "min": 0, "max": 90, "step": 1}],
        "details": [
            "Full exit → wait the cooldown (default 30 days) before that ticker can be bought again.",
            "Partial trim does not start cooldown on the remaining shares.",
        ],
    },
    {
        "id": "earnings_blackout",
        "label": "Earnings blackout",
        "group": "Entry",
        "blurb": "No new buys inside the blackout window before earnings.",
        "default": True,
        "params": [
            {"key": "earnings_blackout_days", "label": "Blackout days", "kind": "int", "min": 0, "max": 20, "step": 1}
        ],
        "details": ["Default: block buys within 5 trading days before simulated earnings."],
    },
    {
        "id": "sleeve_max",
        "label": "Sleeve max allocation",
        "group": "Concentration",
        "blurb": "Do not open new names when a sleeve already sits at its boss max.",
        "default": True,
        "params": [],
        "details": [
            "India 30–45% (def 35%) · US 15–25% (20%) · Commodities 10–25% (15%) · Bonds 5–20% (10%) · Crypto 5–10% (7%).",
            "Bull regime shifts toward equity upper range; bear toward bonds/commodities.",
            "Unspent sleeve budget spills to the next best eligible picks. Crypto may use fractional units.",
        ],
    },
    {
        "id": "subsector_cap",
        "label": "Sub-sector name cap",
        "group": "Concentration",
        "blurb": "Limit how many names from the same sub-sector.",
        "default": True,
        "params": [
            {"key": "max_subsector_names", "label": "Max names / sub-sector", "kind": "int", "min": 1, "max": 10, "step": 1}
        ],
        "details": ["Boss default: max 3 names from the same sub-sector."],
    },
    {
        "id": "sector_cap",
        "label": "Sector weight cap",
        "group": "Concentration",
        "blurb": "Cap weight in any single sector of the book.",
        "default": True,
        "params": [{"key": "max_sector_pct", "label": "Max sector %", "kind": "pct", "min": 0.05, "max": 1.0, "step": 0.01}],
        "details": ["Boss default: each sector ≤ 40% of portfolio value."],
    },
    {
        "id": "max_position",
        "label": "Max position size",
        "group": "Concentration",
        "blurb": "No single company may dominate the book.",
        "default": True,
        "params": [
            {"key": "max_position_pct", "label": "Max position %", "kind": "pct", "min": 0.02, "max": 0.5, "step": 0.01},
            {"key": "trim_to_pct", "label": "Trim target %", "kind": "pct", "min": 0.02, "max": 0.4, "step": 0.01},
        ],
        "details": ["Boss default: no name > 10%; if overweight, trim toward 8% (no cooldown on partial trim)."],
    },
    {
        "id": "cash_reserve",
        "label": "Cash reserve floor",
        "group": "Budget",
        "blurb": "Always keep a cash reserve — never fully deploy MTM.",
        "default": True,
        "params": [{"key": "cash_reserve_pct", "label": "Reserve %", "kind": "pct", "min": 0.0, "max": 0.3, "step": 0.01}],
        "details": [
            "Reserve = % of current portfolio value (MTM), recalculated daily.",
            "Boss default 5%. Max deployable = cash − reserve floor.",
        ],
    },
    {
        "id": "daily_budget",
        "label": "Daily deploy ceiling",
        "group": "Budget",
        "blurb": "Boss daily contribution / deploy cap by market regime.",
        "default": True,
        "params": [
            {"key": "contribution_bull", "label": "Bull ₹", "kind": "money", "min": 500, "max": 100000, "step": 500},
            {"key": "contribution_sideways", "label": "Sideways ₹", "kind": "money", "min": 500, "max": 100000, "step": 500},
            {"key": "contribution_bear", "label": "Bear ₹", "kind": "money", "min": 500, "max": 100000, "step": 500},
            {"key": "friday_contribution_cap", "label": "Friday cap ₹", "kind": "money", "min": 500, "max": 100000, "step": 500},
        ],
        "details": [
            "Bull ₹10,000 (index > 50-DMA and 50 > 200). Sideways ₹7,000. Bear ₹3,000.",
            "Friday budget capped (default ₹5,000). Bonds and commodities still allowed.",
        ],
    },
    {
        "id": "hold_maturity",
        "label": "30d hold / maturity sell",
        "group": "Exits",
        "blurb": "Force a maturity sell when hold days are reached (unless you Keep).",
        "default": True,
        "params": [{"key": "hold_days", "label": "Hold days", "kind": "int", "min": 1, "max": 120, "step": 1}],
        "details": [
            "Default max hold 30 days. Day 31 queues a sell for your approval.",
            "Sell reasons logged: 30d maturity · Stop loss (ATR) · Trim to cap · Portfolio drawdown pause.",
        ],
    },
    {
        "id": "atr_stops",
        "label": "ATR stop-loss",
        "group": "Exits",
        "blurb": "Queue a sell when price hits the ATR stop vs average cost.",
        "default": True,
        "params": [
            {"key": "equity_atr_mult", "label": "Equity ATR ×", "kind": "float", "min": 0.5, "max": 5.0, "step": 0.1},
            {"key": "crypto_atr_mult", "label": "Crypto ATR ×", "kind": "float", "min": 0.5, "max": 5.0, "step": 0.1},
        ],
        "details": [
            "Equity stop = 2 × ATR(14). Crypto / high-vol = 1.5 × ATR(14).",
            "Bonds: no ATR stop (hold to maturity / 30d). Stops can fire any day.",
        ],
    },
    {
        "id": "trim_cap",
        "label": "Trim overweight names",
        "group": "Exits",
        "blurb": "Queue a partial sell when a name exceeds max position.",
        "default": True,
        "params": [],
        "details": ["Uses Max position size thresholds. Approve or Keep on Trade / Alerts."],
    },
    {
        "id": "drawdown_breaker",
        "label": "Drawdown circuit breaker",
        "group": "Risk",
        "blurb": "Pause buying / force risk actions on portfolio drawdown tiers.",
        "default": True,
        "params": [
            {"key": "drawdown_t1", "label": "Tier 1 DD", "kind": "pct", "min": 0.02, "max": 0.5, "step": 0.01},
            {"key": "drawdown_t2", "label": "Tier 2 DD", "kind": "pct", "min": 0.02, "max": 0.5, "step": 0.01},
            {"key": "drawdown_t3", "label": "Tier 3 DD", "kind": "pct", "min": 0.02, "max": 0.5, "step": 0.01},
            {"key": "drawdown_resume", "label": "Resume below", "kind": "pct", "min": 0.01, "max": 0.3, "step": 0.01},
            {"key": "pause_t1_days", "label": "T1 pause days", "kind": "int", "min": 0, "max": 30, "step": 1},
            {"key": "pause_t2_days", "label": "T2 pause days", "kind": "int", "min": 0, "max": 30, "step": 1},
        ],
        "details": [
            "Boss tiers: −10% pause 3d · −15% pause 7d + bear budget · −20% liquidate ~50%.",
            "Resume when drawdown recovers below 7% from peak.",
        ],
    },
    {
        "id": "winner_rollover",
        "label": "Winner roll-over",
        "group": "Optional",
        "blurb": "OPTIONAL — extend winners past hold days instead of forcing sell.",
        "default": False,
        "params": [{"key": "winner_rollover_days", "label": "Extra days", "kind": "int", "min": 1, "max": 60, "step": 1}],
        "details": ["Boss leaves this OFF unless explicitly requested. Max one extension when quality still passes."],
    },
    {
        "id": "value_condition",
        "label": "Value condition",
        "group": "Optional",
        "blurb": "OPTIONAL — add a 6th quality flag (cheap vs PE proxy).",
        "default": False,
        "params": [],
        "details": ["Below ~52-week median PE proxy for India/US equities. Still need ≥3 of included flags."],
    },
    {
        "id": "news_decay",
        "label": "News decay",
        "group": "Optional",
        "blurb": "OPTIONAL — decay older headlines in the news factor.",
        "default": False,
        "params": [{"key": "sentiment_halflife", "label": "Half-life days", "kind": "int", "min": 1, "max": 14, "step": 1}],
        "details": ["Default half-life 3 days when enabled."],
    },
    {
        "id": "post_earnings_cooling",
        "label": "Post-earnings cooling",
        "group": "Optional",
        "blurb": "OPTIONAL — extra buy block after the earnings print.",
        "default": False,
        "params": [
            {"key": "post_earnings_cooling_days", "label": "Cooling days", "kind": "int", "min": 0, "max": 15, "step": 1}
        ],
        "details": ["Default 3 days after earnings when enabled."],
    },
    {
        "id": "three_mode",
        "label": "Three-mode stops (commodities)",
        "group": "Optional",
        "blurb": "OPTIONAL — apply crypto-style ATR stops to commodities.",
        "default": False,
        "params": [],
        "details": ["When ON, commodities use the tighter crypto ATR multiple."],
    },
]

PARAM_KEYS = sorted({p["key"] for r in RULE_CATALOG for p in r["params"]})


def default_rule_flags() -> Dict[str, bool]:
    s = get_settings()
    flags = {r["id"]: bool(r["default"]) for r in RULE_CATALOG}
    # Seed optional toggles from rules.json defaults
    flags["winner_rollover"] = bool(s.toggle_winner_rollover)
    flags["value_condition"] = bool(s.toggle_value_condition)
    flags["news_decay"] = bool(s.toggle_news_decay)
    flags["post_earnings_cooling"] = bool(s.toggle_post_earnings_cooling)
    flags["three_mode"] = bool(s.toggle_three_mode)
    return flags


def default_rule_params() -> Dict[str, float]:
    s = get_settings()
    return {
        "cooldown_days": float(s.cooldown_days),
        "earnings_blackout_days": float(s.earnings_blackout_days),
        "max_subsector_names": float(s.max_subsector_names),
        "max_sector_pct": float(s.max_sector_pct),
        "max_position_pct": float(s.max_position_pct),
        "trim_to_pct": float(s.trim_to_pct),
        "cash_reserve_pct": float(s.cash_reserve_pct),
        "contribution_bull": float(s.contribution_bull),
        "contribution_sideways": float(s.contribution_sideways),
        "contribution_bear": float(s.contribution_bear),
        "friday_contribution_cap": float(s.friday_contribution_cap),
        "hold_days": float(s.hold_days),
        "equity_atr_mult": float(s.equity_atr_mult),
        "crypto_atr_mult": float(s.crypto_atr_mult),
        "drawdown_t1": float(s.drawdown_t1),
        "drawdown_t2": float(s.drawdown_t2),
        "drawdown_t3": float(s.drawdown_t3),
        "drawdown_resume": float(s.drawdown_resume),
        "pause_t1_days": float(s.pause_t1_days),
        "pause_t2_days": float(s.pause_t2_days),
        "winner_rollover_days": float(s.winner_rollover_days),
        "sentiment_halflife": float(s.sentiment_halflife),
        "post_earnings_cooling_days": float(s.post_earnings_cooling_days),
    }


def merge_flags(raw: Optional[dict]) -> Dict[str, bool]:
    base = default_rule_flags()
    if not raw:
        return base
    for k, v in raw.items():
        if k in base:
            base[k] = bool(v)
    return base


def merge_params(raw: Optional[dict]) -> Dict[str, float]:
    base = default_rule_params()
    if not raw:
        return base
    for k, v in raw.items():
        if k not in base:
            continue
        try:
            base[k] = float(v)
        except (TypeError, ValueError):
            continue
    return base


def sync_toggles_from_flags(toggles, flags: Dict[str, bool]) -> None:
    """Keep legacy Toggles object aligned with rule flags."""
    toggles.winner_rollover = bool(flags.get("winner_rollover", False))
    toggles.value_condition = bool(flags.get("value_condition", False))
    toggles.news_decay = bool(flags.get("news_decay", False))
    toggles.post_earnings_cooling = bool(flags.get("post_earnings_cooling", False))
    toggles.three_mode = bool(flags.get("three_mode", False))


def _clip_text(val: Any, max_len: int) -> str:
    s = " ".join(str(val or "").split()).strip()
    return s[:max_len]


def default_rule_copy() -> Dict[str, Any]:
    return {"rules": {}, "quality_checklist": {}}


def merge_rule_copy(raw: Optional[dict], *, replace: bool = False) -> Dict[str, Any]:
    """Merge user-edited labels / blurbs / checklist wording onto defaults."""
    base = default_rule_copy() if replace or not raw else {
        "rules": dict((raw or {}).get("rules") or {}),
        "quality_checklist": dict((raw or {}).get("quality_checklist") or {}),
    }
    if not raw or not isinstance(raw, dict):
        return default_rule_copy() if replace else base

    catalog_ids = {r["id"] for r in RULE_CATALOG}
    qc_keys = {c["key"] for c in QUALITY_CHECKLIST}

    rules_in = raw.get("rules") if isinstance(raw.get("rules"), dict) else {}
    out_rules: Dict[str, Any] = {} if replace else dict(base.get("rules") or {})
    for rid, patch in rules_in.items():
        if rid not in catalog_ids or not isinstance(patch, dict):
            continue
        cur = dict(out_rules.get(rid) or {})
        if "label" in patch:
            cur["label"] = _clip_text(patch.get("label"), 120)
        if "blurb" in patch:
            cur["blurb"] = _clip_text(patch.get("blurb"), 400)
        if "details" in patch and isinstance(patch.get("details"), list):
            cur["details"] = [
                _clip_text(d, 280) for d in patch["details"] if _clip_text(d, 280)
            ][:8]
        # Drop empty patches so defaults show through
        cleaned = {k: v for k, v in cur.items() if v not in ("", [], None)}
        if cleaned:
            out_rules[rid] = cleaned
        elif rid in out_rules:
            del out_rules[rid]

    qc_in = raw.get("quality_checklist") if isinstance(raw.get("quality_checklist"), dict) else {}
    out_qc: Dict[str, Any] = {} if replace else dict(base.get("quality_checklist") or {})
    for key, patch in qc_in.items():
        if key not in qc_keys or not isinstance(patch, dict):
            continue
        cur = dict(out_qc.get(key) or {})
        for field, lim in (("label", 80), ("pass", 160), ("note", 220)):
            if field in patch:
                cur[field] = _clip_text(patch.get(field), lim)
        cleaned = {k: v for k, v in cur.items() if v}
        if cleaned:
            out_qc[key] = cleaned
        elif key in out_qc:
            del out_qc[key]

    return {"rules": out_rules, "quality_checklist": out_qc}


def apply_copy_to_rule(spec: dict, copy_map: Dict[str, Any]) -> dict:
    patch = (copy_map or {}).get(spec["id"]) or {}
    out = deepcopy(spec)
    if patch.get("label"):
        out["label"] = patch["label"]
    if patch.get("blurb") is not None and str(patch.get("blurb")).strip() != "":
        out["blurb"] = patch["blurb"]
    if isinstance(patch.get("details"), list) and patch["details"]:
        out["details"] = list(patch["details"])
    return out


def apply_copy_to_quality(items: List[Dict[str, str]], copy_map: Dict[str, Any]) -> List[Dict[str, str]]:
    out = []
    for item in items:
        row = deepcopy(item)
        patch = (copy_map or {}).get(item["key"]) or {}
        for field in ("label", "pass", "note"):
            if patch.get(field):
                row[field] = patch[field]
        out.append(row)
    return out


def public_rules_payload(sim) -> dict:
    flags = getattr(sim, "rule_flags", None) or default_rule_flags()
    params = getattr(sim, "rule_params", None) or default_rule_params()
    allocation = getattr(sim, "allocation", None) or default_allocation()
    copy = merge_rule_copy(getattr(sim, "rule_copy", None) or {})
    rules = []
    for spec in RULE_CATALOG:
        rid = spec["id"]
        merged = apply_copy_to_rule(spec, copy.get("rules") or {})
        rules.append(
            {
                **merged,
                "enabled": bool(flags.get(rid, spec["default"])),
                "values": {p["key"]: params.get(p["key"]) for p in spec["params"]},
            }
        )
    return {
        "rules": rules,
        "flags": flags,
        "params": params,
        "allocation": deepcopy(allocation),
        "copy": deepcopy(copy),
        "defaults": {
            "flags": default_rule_flags(),
            "params": default_rule_params(),
            "allocation": default_allocation(),
            "copy": default_rule_copy(),
            "quality_checklist": deepcopy(QUALITY_CHECKLIST),
            "rules": deepcopy(RULE_CATALOG),
        },
        "quality_checklist": apply_copy_to_quality(QUALITY_CHECKLIST, copy.get("quality_checklist") or {}),
        "editable": True,
        "note": "Toggle rules, edit thresholds, and rewrite labels / blurbs / quality wording. Saved copy is desk-specific.",
    }

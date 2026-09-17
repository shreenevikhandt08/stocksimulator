"""Investment algorithm catalog — users pick by mindset; paper-compare on Backtest."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Optional

from app.config import SCORE_WEIGHTS
from app.data.generator import MarketBook
from app.data.universe import Instrument
from app.engine.scoring import score_instrument


@dataclass(frozen=True)
class Strategy:
    id: str
    name: str
    blurb: str
    weights: Dict[str, float]
    buy_floor: float = 58.0
    score_floor: float = 38.0
    quality_need: int = 3
    equal_weight: bool = False
    invert_momentum: bool = False
    prefer_low_vol: bool = False
    sleeve_boost: Optional[Dict[str, float]] = None  # additive score bias
    mindset: str = ""  # short user-facing label
    risk: str = "balanced"  # calm | balanced | growth


# ── 5 algorithms — user picks by mindset; live Trade uses their choice ──────

STRATEGIES: Dict[str, Strategy] = {
    "multi_factor": Strategy(
        id="multi_factor",
        name="Balanced desk",
        blurb="Blend of momentum, news, earnings, and relative strength — the default mixed approach.",
        weights=dict(SCORE_WEIGHTS),
        buy_floor=58.0,
        score_floor=38.0,
        quality_need=3,
        mindset="I want a balanced mix",
        risk="balanced",
    ),
    "momentum": Strategy(
        id="momentum",
        name="Trend chase",
        blurb="Ride strength — favour names that are already moving up vs their market.",
        weights={"momentum": 0.45, "volume": 0.10, "news": 0.10, "earnings": 0.10, "rs": 0.25},
        buy_floor=62.0,
        score_floor=45.0,
        quality_need=3,
        sleeve_boost={"crypto": -4.0, "bonds": -6.0},
        mindset="I want growth / ride winners",
        risk="growth",
    ),
    "mean_reversion": Strategy(
        id="mean_reversion",
        name="Buy the dip",
        blurb="Prefer pullbacks — buy softer names that may bounce, less chase of hot runners.",
        weights={"momentum": 0.35, "volume": 0.10, "news": 0.15, "earnings": 0.25, "rs": 0.15},
        buy_floor=55.0,
        score_floor=36.0,
        quality_need=3,
        invert_momentum=True,
        sleeve_boost={"bonds": 4.0, "crypto": -8.0},
        mindset="I buy dips / hate chasing",
        risk="balanced",
    ),
    "quality": Strategy(
        id="quality",
        name="Quality first",
        blurb="Strict quality checks (4/5). Earnings and trend first; less speculative sleeves.",
        weights={"momentum": 0.15, "volume": 0.10, "news": 0.15, "earnings": 0.35, "rs": 0.25},
        buy_floor=56.0,
        score_floor=42.0,
        quality_need=4,
        sleeve_boost={"bonds": 6.0, "india": 3.0, "crypto": -10.0, "commodities": -2.0},
        mindset="I want safer, high-quality names",
        risk="calm",
    ),
    "low_vol": Strategy(
        id="low_vol",
        name="Steady / low stress",
        blurb="Prefer calmer names and equal-weight tickets — less concentration risk.",
        weights={"momentum": 0.20, "volume": 0.15, "news": 0.15, "earnings": 0.25, "rs": 0.25},
        buy_floor=54.0,
        score_floor=40.0,
        quality_need=3,
        equal_weight=True,
        prefer_low_vol=True,
        sleeve_boost={"bonds": 5.0, "crypto": -12.0},
        mindset="I want calm, lower swings",
        risk="calm",
    ),
}

DEFAULT_STRATEGY = "multi_factor"


def list_strategies(active_id: Optional[str] = None) -> List[dict]:
    active = (active_id or DEFAULT_STRATEGY).strip().lower()
    return [
        {
            "id": s.id,
            "name": s.name,
            "blurb": s.blurb,
            "mindset": s.mindset,
            "risk": s.risk,
            "buy_floor": s.buy_floor,
            "quality_need": s.quality_need,
            "equal_weight": s.equal_weight,
            "is_default": s.id == DEFAULT_STRATEGY,
            "is_active": s.id == active,
        }
        for s in STRATEGIES.values()
    ]


def get_strategy(strategy_id: Optional[str]) -> Strategy:
    key = (strategy_id or DEFAULT_STRATEGY).strip().lower()
    if key not in STRATEGIES:
        raise ValueError(f"Unknown strategy '{strategy_id}'. Choose: {', '.join(STRATEGIES)}")
    return STRATEGIES[key]


def _realized_vol(closes: List[float], lookback: int = 20) -> float:
    if len(closes) < lookback + 1:
        return 0.05
    rets = []
    for i in range(-lookback, 0):
        a, b = closes[i - 1], closes[i]
        if a > 0:
            rets.append(abs(b / a - 1.0))
    return sum(rets) / len(rets) if rets else 0.05


def score_with_strategy(book: MarketBook, inst: Instrument, idx: int, decay_news: bool, strategy: Strategy) -> Dict:
    """Score one name under a strategy — returns same shape as score_instrument."""
    base = score_instrument(book, inst, idx, decay_news)
    if base.get("mode") == "yield":
        # Bonds: keep yield score; mild strategy bias only
        sc = float(base["score"])
        bias = (strategy.sleeve_boost or {}).get(inst.sleeve, 0.0)
        base["score"] = round(min(100.0, max(0.0, sc + bias)), 2)
        base["strategy"] = strategy.id
        return base

    bars = book.series[inst.ticker].bars[: idx + 1]
    closes = [b.close for b in bars]
    bd = dict(base.get("breakdown") or {})
    mom_s = float(bd.get("momentum") or 50.0)
    if strategy.invert_momentum:
        mom_s = 100.0 - mom_s
        bd["momentum"] = round(mom_s, 2)

    wt = sum(strategy.weights.values()) or 1.0
    w = strategy.weights
    final = (
        (w.get("momentum", 0) / wt) * mom_s
        + (w.get("volume", 0) / wt) * float(bd.get("volume") or 50)
        + (w.get("news", 0) / wt) * float(bd.get("news") or 50)
        + (w.get("earnings", 0) / wt) * float(bd.get("earnings") or 50)
        + (w.get("rs", 0) / wt) * float(bd.get("rs") or 50)
    )

    bias = (strategy.sleeve_boost or {}).get(inst.sleeve, 0.0)
    if strategy.prefer_low_vol:
        vol = _realized_vol(closes)
        # Lower vol → higher score (up to +12)
        final += max(0.0, 12.0 - vol * 200.0)

    final = min(100.0, max(0.0, final + bias))
    base["score"] = round(final, 2)
    base["breakdown"] = bd
    base["strategy"] = strategy.id
    base["vol"] = round(_realized_vol(closes), 5)
    return base


def score_universe_strategy(
    book: MarketBook,
    idx: int,
    decay_news: bool,
    strategy_id: Optional[str] = None,
) -> List[Dict]:
    strategy = get_strategy(strategy_id)
    out = []
    for key in book.series:
        inst = book.series[key].instrument
        row = score_with_strategy(book, inst, idx, decay_news, strategy)
        out.append(row)
    if strategy.prefer_low_vol:
        # Stable sort: higher score first, then lower vol
        out.sort(key=lambda x: (-float(x["score"]), float(x.get("vol") or 99)))
    else:
        out.sort(key=lambda x: x["score"], reverse=True)
    return out

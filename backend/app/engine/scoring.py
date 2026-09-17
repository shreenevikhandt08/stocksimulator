from __future__ import annotations

from typing import Dict, List, Optional

from app.config import MOM_WEIGHTS, SCORE_WEIGHTS
from app.data.generator import MarketBook
from app.data.universe import Instrument
from app.engine.indicators import momentum, sma, volume_ratio


def _norm(x: float, lo: float, hi: float) -> float:
    if hi == lo:
        return 50.0
    v = (x - lo) / (hi - lo)
    return max(0.0, min(100.0, v * 100.0))


def news_sentiment(book: MarketBook, ticker: str, idx: int, decay: bool) -> float:
    series = book.series[ticker]
    if not series.sentiment:
        return 0.0
    if not decay:
        return series.sentiment[idx]
    # half-life 3 days
    acc, wsum = 0.0, 0.0
    for lag in range(0, min(12, idx + 1)):
        w = 0.5 ** (lag / 3.0)
        acc += series.sentiment[idx - lag] * w
        wsum += w
    return acc / wsum if wsum else 0.0


def relative_strength(book: MarketBook, inst: Instrument, idx: int) -> float:
    closes = [b.close for b in book.series[inst.ticker].bars[: idx + 1]]
    stock_m = momentum(closes, 20)
    bench = book.nifty if inst.asset == "india" else book.spx
    if inst.asset == "crypto":
        bench_m = momentum([b.close for b in book.series["BTC"].bars[: idx + 1]], 20)
    elif inst.asset == "commodities":
        bench_m = momentum([b.close for b in book.series["GOLD"].bars[: idx + 1]], 20)
    elif inst.asset == "bonds":
        bench_m = momentum([b.close for b in book.series["IN10Y"].bars[: idx + 1]], 20)
    else:
        bench_m = momentum(bench[: idx + 1], 20)
    return stock_m - bench_m


def quality_flags(
    book: MarketBook,
    inst: Instrument,
    idx: int,
    decay_news: bool,
    value_condition: bool,
) -> Dict[str, bool]:
    closes = [b.close for b in book.series[inst.ticker].bars[: idx + 1]]
    bars = book.series[inst.ticker].bars[: idx + 1]
    sent = news_sentiment(book, inst.ticker, idx, decay_news)
    rs = relative_strength(book, inst, idx)
    flags = {
        "earnings_trend": inst.qoq > 0 or inst.yoy > 0,
        "news_positive": sent > 0,
        "above_200dma": closes[-1] > sma(closes, 200) if len(closes) >= 60 else True,
        "rs_positive": rs > 0,
        "volume_above_avg": volume_ratio(bars, 20) > 1.0,
    }
    if inst.asset in ("bonds", "commodities"):
        # Non-equity: earnings/PE filters are not meaningful — treat as pass
        flags["earnings_trend"] = True
        flags["above_200dma"] = closes[-1] > sma(closes, 50) if len(closes) >= 50 else True
    if inst.asset == "crypto":
        flags["earnings_trend"] = True
    if value_condition and inst.asset in ("india", "us"):
        # below 52w median PE proxy: use start PE vs inflated PE if price ran
        px0 = inst.start_price
        pe_now = inst.pe * (closes[-1] / px0) if px0 else inst.pe
        flags["value"] = pe_now < inst.pe * 1.05
    return flags


def quality_pass(flags: Dict[str, bool], value_condition: bool, need: int = 3) -> bool:
    keys = [k for k in flags if k != "value"] if not value_condition else list(flags)
    return sum(1 for k in keys if flags[k]) >= max(1, int(need))


def score_instrument(
    book: MarketBook,
    inst: Instrument,
    idx: int,
    decay_news: bool,
) -> Dict:
    bars = book.series[inst.ticker].bars[: idx + 1]
    closes = [b.close for b in bars]
    if inst.asset == "bonds":
        yld = inst.bond_yield or 0.06
        # Rank-style 0-100 from yield (2%..10%)
        sc = _norm(yld, 0.02, 0.10)
        return {
            "ticker": inst.ticker,
            "score": round(sc, 2),
            "breakdown": {
                "momentum": None,
                "volume": round(_norm(volume_ratio(bars, 20), 0.4, 2.2), 2),
                "news": round((news_sentiment(book, inst.ticker, idx, decay_news) + 1) * 50, 2),
                "earnings": None,
                "rs": None,
                "yield": round(sc, 2),
            },
            "mode": "yield",
        }

    m1w = momentum(closes, 5)
    m1m = momentum(closes, 21)
    m3m = momentum(closes, 63)
    mom = MOM_WEIGHTS["1w"] * m1w + MOM_WEIGHTS["1m"] * m1m + MOM_WEIGHTS["3m"] * m3m
    mom_s = _norm(mom, -0.18, 0.22)
    vol_s = _norm(volume_ratio(bars, 20), 0.5, 2.4)
    news_s = (news_sentiment(book, inst.ticker, idx, decay_news) + 1) * 50
    earn = inst.qoq * 0.5 + inst.yoy * 0.5
    earn_s = _norm(earn, -0.08, 0.25)
    if inst.asset in ("commodities", "crypto"):
        earn_s = 55.0  # no earnings; neutral-plus
    rs_s = _norm(relative_strength(book, inst, idx), -0.12, 0.12)
    final = (
        SCORE_WEIGHTS["momentum"] * mom_s
        + SCORE_WEIGHTS["volume"] * vol_s
        + SCORE_WEIGHTS["news"] * news_s
        + SCORE_WEIGHTS["earnings"] * earn_s
        + SCORE_WEIGHTS["rs"] * rs_s
    )
    return {
        "ticker": inst.ticker,
        "score": round(final, 2),
        "breakdown": {
            "momentum": round(mom_s, 2),
            "volume": round(vol_s, 2),
            "news": round(news_s, 2),
            "earnings": round(earn_s, 2),
            "rs": round(rs_s, 2),
            "yield": None,
        },
        "mode": "multi-factor",
        "mom_raw": {"1w": m1w, "1m": m1m, "3m": m3m},
    }


def score_universe(book: MarketBook, idx: int, decay_news: bool) -> List[Dict]:
    out = []
    for inst in book.series:
        inst_obj = book.series[inst].instrument
        out.append(score_instrument(book, inst_obj, idx, decay_news))
    out.sort(key=lambda x: x["score"], reverse=True)
    return out

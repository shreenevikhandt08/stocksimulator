from __future__ import annotations

from typing import Dict

from app.agents.common import stance
from app.agents.sources import market_sources
from app.data.generator import MarketBook
from app.data.universe import Instrument
from app.engine.indicators import atr, macd, momentum, rsi, sma, volume_ratio


def run(book: MarketBook, inst: Instrument, idx: int) -> Dict:
    bars = book.series[inst.ticker].bars[: idx + 1]
    px_closes = [b.close for b in bars]
    px = px_closes[-1]
    live_src = ""
    try:
        from app.data.live import TAPE

        q = TAPE.quotes.get(inst.ticker)
        if q and q.price > 0:
            px = q.price
            live_src = q.source or TAPE.source
    except Exception:
        live_src = ""
    s50 = sma(px_closes, 50)
    s200 = sma(px_closes, 200)
    r = rsi(px_closes, 14)
    _line, _signal, hist = macd(px_closes)
    vr = volume_ratio(bars, 20)
    a = atr(bars, 14)
    m1m = momentum(px_closes, 21)
    trend = "bullish" if px > s50 > s200 else "bearish" if px < s50 < s200 else "sideways"
    tech = 50
    tech += 12 if px > s50 else -12
    tech += 10 if s50 > s200 else -10
    tech += 8 if r > 55 else -8 if r < 45 else 0
    tech += 6 if hist > 0 else -6
    tech += 6 if vr > 1.1 else -4
    tech += 8 if m1m > 0 else -8
    tech = max(5, min(95, tech))
    summary = (
        f"{inst.name} is {trend}. Last Rs. {px:,.0f}"
        + (f" via {live_src}" if live_src else "")
        + f", RSI {r:.0f}, volume {vr:.1f}× average, 1M {m1m:+.1%}."
    )
    src = market_sources(inst)
    return {
        "agent": "market",
        "title": "Market Agent",
        "mandate": "Price, volume, trend",
        "stance": stance(tech),
        "score": round(tech, 1),
        "summary": summary,
        "signals": [
            {"label": "Trend", "value": trend.upper(), "tone": "pos" if trend == "bullish" else "neg" if trend == "bearish" else "neu"},
            {"label": "RSI(14)", "value": f"{r:.0f}", "tone": "pos" if r > 50 else "neg"},
            {"label": "1M momentum", "value": f"{m1m:+.1%}", "tone": "pos" if m1m > 0 else "neg"},
        ],
        "sources": src["sources"],
        "source_links": src["source_links"],
        "metrics": {
            "price": px,
            "sma50": s50,
            "sma200": s200,
            "rsi": r,
            "atr": a,
            "vol_ratio": vr,
            "trend": trend,
            "mom_1w": momentum(px_closes, 5),
            "mom_1m": m1m,
            "mom_3m": momentum(px_closes, 63),
        },
    }

from __future__ import annotations

from typing import Dict

from app.agents.graph import research_ticker
from app.data.generator import MarketBook
from app.engine.indicators import sma
from app.engine.scoring import news_sentiment

__all__ = ["research_ticker", "market_overview"]


def market_overview(book: MarketBook, idx: int) -> Dict:
    nifty = book.nifty[idx]
    n50 = sma(book.nifty[: idx + 1], 50)
    regime = book.regime_path[idx]
    sample = ["TCS", "HDFCBANK", "AAPL", "NVDA", "GOLD", "BTC", "RELIANCE"]
    sents = [news_sentiment(book, t, idx, False) for t in sample if t in book.series]
    avg_s = sum(sents) / max(len(sents), 1)
    return {
        "regime": regime,
        "nifty": {"last": nifty, "sma50": n50, "vs50": nifty / n50 - 1},
        "desks": {
            "market": {"stance": "bullish" if regime == "bull" else "bearish" if regime == "bear" else "neutral"},
            "social": {"stance": "bullish" if avg_s > 0.08 else "bearish" if avg_s < -0.08 else "neutral"},
            "news": {"stance": "bullish" if regime == "bull" else "bearish" if regime == "bear" else "neutral"},
            "fundamentals": {"stance": "neutral"},
        },
        "orchestrator": "langgraph",
    }

from __future__ import annotations

from typing import List

from app.data.generator import MarketBook
from app.data.universe import Instrument


def closes(book: MarketBook, ticker: str, idx: int) -> List[float]:
    return [b.close for b in book.series[ticker].bars[: idx + 1]]


def stance(score: float) -> str:
    if score >= 62:
        return "bullish"
    if score <= 42:
        return "bearish"
    return "neutral"


def sleeve_topics(inst: Instrument) -> List[str]:
    return {
        "industry": ["domestic demand", "FII flows", "earnings", "RBI"],
        "startups": ["user growth", "burn", "funding", "unit economics"],
        "commodity": ["China demand", "inventories", "USD", "geopolitics"],
        "bonds": ["term premium", "CPI", "RBI/Fed", "fiscal supply"],
        "crypto": ["ETF flows", "funding rates", "on-chain", "regulation"],
        "india": ["FII flows", "SIP bid", "RBI", "earnings"],
        "us": ["Fed", "AI capex", "payrolls", "dollar"],
        "commodities": ["China demand", "inventory", "USD"],
    }.get(inst.sleeve, ["flows", "earnings", "macro"])

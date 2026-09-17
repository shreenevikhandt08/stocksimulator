from __future__ import annotations

from typing import Dict

from app.agents.common import closes, stance
from app.agents.sources import fundamentals_sources
from app.data.generator import MarketBook
from app.data.universe import Instrument
from app.engine.indicators import momentum


def run(book: MarketBook, inst: Instrument, idx: int) -> Dict:
    px = book.series[inst.ticker].bars[idx].close
    src = fundamentals_sources(inst)
    if inst.asset == "bonds":
        yld = inst.bond_yield or 0.06
        score = min(90, 40 + yld * 500)
        return {
            "agent": "fundamentals",
            "title": "Fundamentals Agent",
            "mandate": "Financial strength and valuation",
            "stance": "bullish" if yld > 0.07 else "neutral",
            "score": round(score, 1),
            "summary": f"{inst.name} yield {yld:.2%}. Ranked by yield, not momentum. No ATR stop.",
            "signals": [{"label": "Yield", "value": f"{yld:.2%}", "tone": "pos"}],
            "sources": src["sources"],
            "source_links": src["source_links"],
            "metrics": {"yield": yld, "pe": None, "roe": None, "yoy": None, "qoq": None, "debt_equity": 0},
        }
    if inst.asset in ("commodities", "crypto"):
        m1m = momentum(closes(book, inst.ticker, idx), 21)
        score = max(10, min(90, 50 + m1m * 80))
        return {
            "agent": "fundamentals",
            "title": "Fundamentals Agent",
            "mandate": "Financial strength and valuation",
            "stance": stance(score),
            "score": round(score, 1),
            "summary": f"{inst.name} has no earnings. 1M trend {m1m:+.1%}.",
            "signals": [{"label": "1M trend", "value": f"{m1m:+.1%}", "tone": "pos" if m1m > 0 else "neg"}],
            "sources": src["sources"],
            "source_links": src["source_links"],
            "metrics": {"pe": None, "roe": None, "yoy": None, "qoq": None, "debt_equity": 0},
        }

    pe_now = inst.pe * (px / inst.start_price) if inst.start_price else inst.pe
    score = 50
    score += 10 if inst.yoy > 0 else -12
    score += 8 if inst.qoq > 0 else -8
    score += 8 if inst.roe > 0.14 else -6
    score += 6 if inst.debt_equity < 1.0 else -8
    score += 8 if 8 < pe_now < 35 else -6 if pe_now > 55 else 0
    score = max(8, min(94, score))
    summary = (
        f"{inst.name}: YoY {inst.yoy:+.1%}, ROE {inst.roe:.1%}, P/E {pe_now:.0f}x, D/E {inst.debt_equity:.2f}."
    )
    return {
        "agent": "fundamentals",
        "title": "Fundamentals Agent",
        "mandate": "Financial strength and valuation",
        "stance": stance(score),
        "score": round(score, 1),
        "summary": summary,
        "signals": [
            {"label": "Earnings", "value": f"YoY {inst.yoy:+.1%}", "tone": "pos" if inst.yoy > 0 else "neg"},
            {"label": "P/E", "value": f"{pe_now:.0f}x", "tone": "neg" if pe_now > 45 else "pos" if pe_now < 28 else "neu"},
            {"label": "ROE", "value": f"{inst.roe:.1%}", "tone": "pos" if inst.roe > 0.14 else "neg"},
        ],
        "sources": src["sources"],
        "source_links": src["source_links"],
        "metrics": {
            "pe": pe_now,
            "pb": inst.pb,
            "roe": inst.roe,
            "debt_equity": inst.debt_equity,
            "qoq": inst.qoq,
            "yoy": inst.yoy,
        },
    }

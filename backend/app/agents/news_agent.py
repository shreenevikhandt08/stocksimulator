from __future__ import annotations

from typing import Dict

from app.agents.common import stance
from app.agents.sources import news_sources
from app.data.generator import MarketBook
from app.data.universe import Instrument
from app.engine.scoring import news_sentiment


def run(book: MarketBook, inst: Instrument, idx: int) -> Dict:
    series = book.series[inst.ticker]
    today = book.dates[idx]
    recent = sorted(
        [n for n in series.news_events if 0 <= (today - n[0]).days <= 12],
        key=lambda x: x[0],
        reverse=True,
    )[:3]
    sent = news_sentiment(book, inst.ticker, idx, decay=True)
    regime = book.regime_path[idx]
    score = (sent + 1) * 50
    score += 4 if regime == "bull" else -6 if regime == "bear" else 0
    next_earn = next((ed for ed in series.earnings if 0 <= (ed - today).days <= 21), None)
    headlines = [{"date": n[0].isoformat(), "title": n[1], "tone": "pos" if n[2] >= 0 else "neg"} for n in recent]
    if not headlines:
        headlines = [{"date": today.isoformat(), "title": f"No material headline on {inst.name} in 12 sessions.", "tone": "neu"}]
    earn_note = (
        f"Earnings in {(next_earn - today).days}d — blackout if ≤5."
        if next_earn
        else "No earnings in the next 3 weeks."
    )
    summary = f"News on {inst.name} is {'positive' if sent > 0 else 'negative'} ({sent:+.2f}). {earn_note}"
    src = news_sources(inst)
    return {
        "agent": "news",
        "title": "News Agent",
        "mandate": "Company and macro news",
        "stance": stance(score),
        "score": round(max(8, min(92, score)), 1),
        "summary": summary,
        "signals": [
            {"label": "News sentiment", "value": f"{sent:+.2f}", "tone": "pos" if sent > 0 else "neg"},
            {"label": "Regime", "value": regime.upper(), "tone": "pos" if regime == "bull" else "neg" if regime == "bear" else "neu"},
            {"label": "Earnings", "value": next_earn.isoformat() if next_earn else "None soon", "tone": "neu"},
        ],
        "sources": src["sources"],
        "source_links": src["source_links"],
        "headlines": headlines,
        "metrics": {"sentiment": sent, "regime": regime},
    }

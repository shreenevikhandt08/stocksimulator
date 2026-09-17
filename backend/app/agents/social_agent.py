from __future__ import annotations

from typing import Dict

from app.agents.common import sleeve_topics, stance
from app.agents.sources import social_sources
from app.data.generator import MarketBook
from app.data.universe import Instrument
from app.engine.indicators import volume_ratio
from app.engine.scoring import news_sentiment


def run(book: MarketBook, inst: Instrument, idx: int) -> Dict:
    sent = news_sentiment(book, inst.ticker, idx, decay=False)
    series = book.series[inst.ticker].sentiment
    trail = series[max(0, idx - 6) : idx + 1]
    trend = trail[-1] - trail[0] if len(trail) > 1 else 0
    bars = book.series[inst.ticker].bars[: idx + 1]
    vr = volume_ratio(bars, 20)
    mentions = int(800 + abs(sent) * 4200 * vr)
    pos_share = 0.5 + sent * 0.28
    score = max(8, min(92, (sent + 1) * 50 + trend * 12))
    topics = sleeve_topics(inst)
    feel = "constructive" if sent > 0.15 else "hostile" if sent < -0.15 else "mixed"
    summary = (
        f"X/Reddit tape on {inst.name} is {feel} (sentiment {sent:+.2f}, "
        f"{pos_share:.0%} positive, {mentions:,} mentions)."
    )
    src = social_sources(inst)
    return {
        "agent": "social",
        "title": "Social Media Agent",
        "mandate": "X and Reddit sentiment",
        "stance": stance(score),
        "score": round(score, 1),
        "summary": summary,
        "signals": [
            {"label": "Sentiment", "value": f"{sent:+.2f}", "tone": "pos" if sent > 0 else "neg"},
            {"label": "Positive share", "value": f"{pos_share:.0%}", "tone": "pos" if pos_share > 0.52 else "neg"},
            {"label": "Themes", "value": " · ".join(topics[:3]), "tone": "neu"},
        ],
        "sources": src["sources"],
        "source_links": src["source_links"],
        "metrics": {"sentiment": sent, "mentions": mentions, "pos_share": pos_share, "trend": trend},
    }

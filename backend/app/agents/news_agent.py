from __future__ import annotations

from typing import Dict

from app.agents.common import stance
from app.agents.openrouter import interpret_news
from app.agents.sources import news_sources
from app.config import EARNINGS_BLACKOUT_DAYS, SCORE_WEIGHTS
from app.data.generator import MarketBook
from app.data.news_feed import gather_news
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
    desk_sent = news_sentiment(book, inst.ticker, idx, decay=True)
    live = gather_news(inst.ticker)
    conflict = live.get("conflict") or {}
    api_items = live.get("items") or []
    headlines = [
        {
            "date": it.get("date"),
            "title": it.get("title"),
            "tone": it.get("tone"),
            "source": it.get("source"),
            "url": it.get("url") or "",
            "conflict": bool(conflict.get("detected")),
        }
        for it in api_items[:6]
    ]
    if not headlines:
        headlines = [
            {
                "date": n[0].isoformat(),
                "title": n[1],
                "tone": "pos" if n[2] >= 0 else "neg",
                "source": "desk",
                "url": "",
                "conflict": False,
            }
            for n in recent
        ]
    if not headlines:
        headlines = [
            {
                "date": today.isoformat(),
                "title": f"No material headline on {inst.name} in 12 sessions.",
                "tone": "neu",
                "source": "desk",
                "url": "",
                "conflict": False,
            }
        ]

    live_sent = float(live.get("sentiment") or 0.0)
    sent = live_sent if api_items else desk_sent
    regime = book.regime_path[idx]
    score = (sent + 1) * 50
    score += 4 if regime == "bull" else -6 if regime == "bear" else 0
    next_earn = next((ed for ed in series.earnings if 0 <= (ed - today).days <= 21), None)
    earn_note = (
        f"Earnings in {(next_earn - today).days}d — blackout if ≤{EARNINGS_BLACKOUT_DAYS}."
        if next_earn
        else "No earnings in the next 3 weeks."
    )
    if conflict.get("detected"):
        summary = (
            f"Sources disagree on {inst.name}. Applied trusted-source rule → "
            f"{conflict.get('winner')} (not an average). {earn_note}"
        )
    else:
        summary = f"News on {inst.name} is {'positive' if sent > 0 else 'negative' if sent < 0 else 'mixed'} ({sent:+.2f}). {earn_note}"

    ai = interpret_news(
        ticker=inst.ticker,
        name=inst.name,
        headlines=headlines,
        conflict=conflict,
        earnings_note=earn_note,
        news_weight=float(SCORE_WEIGHTS.get("news") or 0.15),
        blackout_days=int(EARNINGS_BLACKOUT_DAYS),
    )
    if ai and ai.get("summary"):
        summary = ai["summary"]
        if conflict.get("detected"):
            summary = f"Conflict → {conflict.get('winner')}. " + summary

    src = news_sources(inst)
    providers = live.get("providers") or []
    extra_sources = []
    if providers:
        extra_sources.append("Live news APIs: " + ", ".join(providers))
    if conflict.get("detected"):
        extra_sources.append(
            f"Conflict rule: use {conflict.get('winner')} only ({conflict.get('rule')})"
        )
    if ai:
        extra_sources.append(f"OpenRouter model {ai.get('model')}")

    st = ai.get("stance") if ai else stance(score)
    return {
        "agent": "news",
        "title": "News Agent",
        "mandate": "Company and macro news",
        "stance": st,
        "score": round(max(8, min(92, score)), 1),
        "summary": summary,
        "signals": [
            {"label": "News sentiment", "value": f"{sent:+.2f}", "tone": "pos" if sent > 0 else "neg" if sent < 0 else "neu"},
            {"label": "Trusted source", "value": str(conflict.get("winner") or "desk").upper(), "tone": "neu"},
            {"label": "Conflict", "value": "YES" if conflict.get("detected") else "No", "tone": "neg" if conflict.get("detected") else "pos"},
            {"label": "Earnings", "value": next_earn.isoformat() if next_earn else "None soon", "tone": "neu"},
        ],
        "sources": extra_sources + src["sources"],
        "source_links": src["source_links"],
        "headlines": headlines,
        "conflict": conflict,
        "metrics": {"sentiment": sent, "desk_sentiment": desk_sent, "regime": regime, "ai": bool(ai)},
    }

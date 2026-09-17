"""LangGraph research desk: market → social → news → fundamentals → bull/bear → verdict."""

from __future__ import annotations

from typing import Any, Dict, TypedDict

from langgraph.graph import END, START, StateGraph

from app.agents import bearish_agent, bullish_agent, fundamentals_agent, market_agent, news_agent, social_agent
from app.data.universe import by_ticker
from app.engine.scoring import quality_flags, score_instrument

INSTR = by_ticker()
ORCHESTRATOR = "langgraph"
GRAPH_PATH = [
    "market",
    "social",
    "news",
    "fundamentals",
    "debate",
    "verdict",
]


class DeskState(TypedDict, total=False):
    ticker: str
    idx: int
    decay_news: bool
    value_condition: bool
    book: Any
    market: dict
    social: dict
    news: dict
    fundamentals: dict
    reports: list
    bull: dict
    bear: dict
    result: dict


def _inst(state: DeskState):
    return INSTR[state["ticker"]]


def _market(state: DeskState) -> dict:
    return {"market": market_agent.run(state["book"], _inst(state), state["idx"])}


def _social(state: DeskState) -> dict:
    return {"social": social_agent.run(state["book"], _inst(state), state["idx"])}


def _news(state: DeskState) -> dict:
    return {"news": news_agent.run(state["book"], _inst(state), state["idx"])}


def _fundamentals(state: DeskState) -> dict:
    return {"fundamentals": fundamentals_agent.run(state["book"], _inst(state), state["idx"])}


def _debate(state: DeskState) -> dict:
    inst = _inst(state)
    reports = [state["market"], state["social"], state["news"], state["fundamentals"]]
    return {
        "reports": reports,
        "bull": bullish_agent.run(reports, inst),
        "bear": bearish_agent.run(reports, inst),
    }


def _verdict(state: DeskState) -> dict:
    inst = _inst(state)
    book = state["book"]
    idx = state["idx"]
    scored = score_instrument(book, inst, idx, state.get("decay_news", False))
    flags = quality_flags(book, inst, idx, state.get("decay_news", False), state.get("value_condition", False))
    bull = state["bull"]
    bear = state["bear"]
    passed = sum(1 for v in flags.values() if v) >= 3
    composite = scored["score"]
    if composite >= 58 and passed and bull["conviction"] >= 0.50:
        verdict = "BUY"
    elif composite <= 38 or not passed:
        verdict = "AVOID"
    else:
        verdict = "HOLD"
    if verdict == "BUY":
        why = f"LangGraph desk scores {composite:.0f}/100 and quality passes. Fit for a slice of today’s amount."
    elif verdict == "AVOID":
        why = f"LangGraph desk scores {composite:.0f}/100. Skip this name and take the next option."
    else:
        why = f"LangGraph desk scores {composite:.0f}/100. Hold off unless you specifically want this name."
    try:
        from app.data.live import live_price

        live = live_price(state["ticker"])
    except Exception:
        live = None
    payload: Dict[str, Any] = {
        "ticker": state["ticker"],
        "name": inst.name,
        "asset": inst.sleeve,
        "sleeve": inst.sleeve,
        "sector": inst.sector,
        "subsector": inst.subsector,
        "agents": state["reports"],
        "debate": {
            "bull": bull,
            "bear": bear,
            "verdict": verdict,
            "conviction": round(abs(bull["conviction"] - 0.5) * 2, 2),
            "rationale": why,
            "composite_score": composite,
            "quality_passed": passed,
            "quality_flags": flags,
        },
        "score": scored,
        "price": live or book.series[state["ticker"]].bars[idx].close,
        "as_of": book.dates[idx].isoformat(),
        "orchestrator": ORCHESTRATOR,
        "graph": GRAPH_PATH,
    }
    return {"result": payload}


def _compile():
    g = StateGraph(DeskState)
    g.add_node("market", _market)
    g.add_node("social", _social)
    g.add_node("news", _news)
    g.add_node("fundamentals", _fundamentals)
    g.add_node("debate", _debate)
    g.add_node("verdict", _verdict)
    g.add_edge(START, "market")
    g.add_edge("market", "social")
    g.add_edge("social", "news")
    g.add_edge("news", "fundamentals")
    g.add_edge("fundamentals", "debate")
    g.add_edge("debate", "verdict")
    g.add_edge("verdict", END)
    return g.compile()


DESK = _compile()


def research_ticker(
    book, ticker: str, idx: int, decay_news: bool = False, value_condition: bool = False
) -> Dict:
    out = DESK.invoke(
        {
            "ticker": ticker,
            "idx": idx,
            "decay_news": decay_news,
            "value_condition": value_condition,
            "book": book,
        }
    )
    return out["result"]

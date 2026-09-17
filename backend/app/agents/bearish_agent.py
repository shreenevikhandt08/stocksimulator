from __future__ import annotations

from typing import Dict, List

from app.data.universe import Instrument


def run(reports: List[Dict], inst: Instrument) -> Dict:
    mkt, soc, news, fund = reports
    points: List[str] = []
    if mkt["metrics"].get("trend") == "bearish":
        points.append("Price is below the 50- and 200-day averages.")
    elif mkt["metrics"].get("trend") != "bullish":
        points.append("No clear trend — wait for a 50-DMA break.")
    if mkt["metrics"].get("mom_1m", 0) <= 0:
        points.append(f"1-month momentum is negative ({mkt['metrics']['mom_1m']:+.1%}).")
    if soc["metrics"]["sentiment"] <= 0.1:
        points.append(f"Crowd is sceptical (sentiment {soc['metrics']['sentiment']:+.2f}).")
    if news["metrics"]["sentiment"] <= 0:
        points.append("News flow is net negative.")
    pe = fund["metrics"].get("pe")
    if pe and pe > 45:
        points.append(f"Valuation is stretched at {pe:.0f}x.")
    if (fund["metrics"].get("debt_equity") or 0) > 1.2:
        points.append(f"Leverage is high (D/E {fund['metrics']['debt_equity']:.2f}).")
    if fund["metrics"].get("yoy") is not None and fund["metrics"]["yoy"] <= 0:
        points.append("Earnings trend is negative.")
    if inst.asset == "bonds":
        points.append("Duration still carries weekend gap risk.")
    if len(points) < 2:
        points.append("30-day hold and ATR stop — this is a tactical ticket, not a compounder.")
    conv = 1 - (mkt["score"] + soc["score"] + news["score"] + fund["score"]) / 400
    return {"conviction": round(max(0.05, conv), 2), "points": points[:4]}

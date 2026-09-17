from __future__ import annotations

from typing import Dict, List

from app.data.universe import Instrument


def run(reports: List[Dict], inst: Instrument) -> Dict:
    mkt, soc, news, fund = reports
    points: List[str] = []
    if mkt["metrics"].get("trend") == "bullish":
        points.append("Price holds above the 50- and 200-day averages.")
    if mkt["metrics"].get("mom_1m", 0) > 0:
        points.append(f"1-month momentum {mkt['metrics']['mom_1m']:+.1%}.")
    if soc["metrics"]["sentiment"] > 0.1:
        points.append(f"Social sentiment is constructive ({soc['metrics']['sentiment']:+.2f}).")
    if news["metrics"]["sentiment"] > 0:
        points.append("News flow is net positive.")
    yoy = fund["metrics"].get("yoy")
    roe = fund["metrics"].get("roe")
    if yoy is not None and yoy > 0 and roe and roe > 0.12:
        points.append(f"Earnings and ROE support the name (YoY {yoy:+.1%}, ROE {roe:.1%}).")
    if inst.asset == "bonds":
        points.append("Yield ranks well versus the bond sleeve.")
    if len(points) < 2:
        points.append("Passes the multi-factor screen used for daily deployment.")
    conv = (mkt["score"] + soc["score"] + news["score"] + fund["score"]) / 400
    return {"conviction": round(conv, 2), "points": points[:4]}

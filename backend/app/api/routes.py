from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, Header
from fastapi.responses import StreamingResponse, HTMLResponse, Response
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
from datetime import date, datetime
import asyncio
import csv
import io
import json
import math

from app.agents.graph import GRAPH_PATH, ORCHESTRATOR
from app.agents.researcher_team import research_ticker
from app.auth_store import login as do_login, logout as do_logout, resolve_token, signup as do_signup, user_by_id
from app.config import (
    ALLOCATION,
    ASSET_LABELS,
    CASH_RESERVE_PCT,
    STARTING_CASH,
    SUGGESTION_COUNT,
    RULES_SOURCE,
    get_settings,
)
from app.data.live import TAPE
from app.data.universe import UNIVERSE, by_ticker
from app.engine.scoring import quality_flags, quality_pass, score_universe
from app.engine.suggestions import build_suggestions, portfolio_risk_profile
from app.engine.rules_gate import can_buy, filter_tickets
from app.state import get_state, last_session_date, previous_session_date
from app.market_hours import is_market_open_now, market_clock

router = APIRouter()
INSTR = by_ticker()


def _inr(x: float) -> float:
    return round(float(x), 2)


class RunBody(BaseModel):
    days: int = Field(1, ge=1, le=20)


class AmountBody(BaseModel):
    amount: float = Field(..., gt=0, le=10_000_000)


class InvestTicketBody(BaseModel):
    ticker: str
    amount: float = Field(..., gt=0, le=10_000_000)


class InvestBody(BaseModel):
    """Invest a planned amount. Optional tickets = user-edited split from Preview."""
    amount: float = Field(..., gt=0, le=10_000_000)
    tickets: Optional[List[InvestTicketBody]] = None


class SkipBody(BaseModel):
    ticker: str


class BuyBody(BaseModel):
    ticker: str
    amount: float = Field(..., gt=0, le=10_000_000)


class SellBody(BaseModel):
    ticker: str
    qty: Optional[float] = Field(None, gt=0)
    fraction: Optional[float] = Field(None, gt=0, le=1)
    sell_all: bool = False


class BookBody(BaseModel):
    """Set today's book value manually. Pass null/omit clear=true to restore live MTM."""
    value: Optional[float] = Field(None, ge=0, le=1_000_000_000)
    clear: bool = False


class ContributedBody(BaseModel):
    """Set total money put in (contributions)."""
    value: float = Field(..., ge=0, le=1_000_000_000)


class ResetDayBody(BaseModel):
    """Clear desk activity from this date onward (inclusive)."""
    date: str


class BacktestBody(BaseModel):
    """Safe paper backtest over a date range (does not touch live book)."""
    start: str
    end: str
    starting_cash: Optional[float] = Field(None, gt=0, le=10_000_000)
    strategy: Optional[str] = Field(
        None,
        description="Algorithm id: multi_factor | momentum | mean_reversion | quality | low_vol",
    )
    strategies: Optional[List[str]] = Field(
        None,
        description="For /backtest/compare — subset of algorithm ids (default: all 5)",
    )


class RulesUpdateBody(BaseModel):
    """Toggle rules on/off and/or edit thresholds / sleeve allocation / wording for this desk."""
    flags: Optional[Dict[str, bool]] = None
    params: Optional[Dict[str, float]] = None
    allocation: Optional[Dict[str, Dict[str, float]]] = None
    copy: Optional[Dict[str, Any]] = None
    reset_copy: bool = False


class PendingActionBody(BaseModel):
    id: str


class WatchBody(BaseModel):
    tickers: List[str] = Field(default_factory=list)


class BatchResearchBody(BaseModel):
    tickers: List[str] = Field(..., min_length=1, max_length=24)


class SignupBody(BaseModel):
    email: str
    username: str
    password: str
    name: str = ""


class LoginBody(BaseModel):
    login: str
    password: str


def _apply_book_override(st, pnl: dict) -> dict:
    """Attach live book + optional manual override for today's book value."""
    live_book = float(pnl.get("book") or 0)
    pnl["book_live"] = _inr(live_book)
    pnl["book_manual"] = False
    if st.book_override is not None:
        pnl["book"] = _inr(st.book_override)
        pnl["book_manual"] = True
        cash = float(pnl.get("cash") or 0)
        savings = float(pnl.get("savings") or 0)
        pnl["wealth"] = _inr(float(pnl["book"]) + cash + savings)
        pnl["overall"] = _inr(float(pnl["wealth"]) - float(pnl.get("contributed") or 0))
    return pnl


def _session_trade_activity(sim, session_day: date) -> dict:
    """Bought / sold on this session — clear qty and amounts for the desk UI."""
    buys: dict[str, dict] = {}
    sells: dict[str, dict] = {}
    for tr in sim.trades:
        if tr.date != session_day:
            continue
        inst = INSTR.get(tr.ticker)
        name = inst.name if inst else tr.ticker
        sleeve = inst.sleeve if inst else ""
        bucket = buys if tr.side == "buy" else sells
        row = bucket.get(tr.ticker)
        if not row:
            row = {
                "ticker": tr.ticker,
                "name": name,
                "sleeve": sleeve,
                "sleeve_label": ASSET_LABELS.get(sleeve, sleeve),
                "side": "buy" if tr.side == "buy" else "sell",
                "qty": 0.0,
                "amount": 0.0,
                "fills": 0,
                "reason": tr.reason or "",
            }
            bucket[tr.ticker] = row
        row["qty"] += float(tr.qty or 0)
        row["amount"] += float(tr.amount or 0)
        row["fills"] += 1
        if tr.reason:
            row["reason"] = tr.reason

    def pack(rows: dict) -> list:
        out = []
        for r in rows.values():
            qty = float(r["qty"])
            amt = float(r["amount"])
            out.append(
                {
                    **r,
                    "qty": round(qty, 6),
                    "amount": _inr(amt),
                    "avg_price": _inr(amt / qty) if qty else 0.0,
                }
            )
        out.sort(key=lambda x: x["amount"], reverse=True)
        return out

    buy_list = pack(buys)
    sell_list = pack(sells)
    return {
        "date": session_day.isoformat(),
        "buys": buy_list,
        "sells": sell_list,
        "bought_qty": round(sum(r["qty"] for r in buy_list), 6),
        "sold_qty": round(sum(r["qty"] for r in sell_list), 6),
        "bought_amount": _inr(sum(r["amount"] for r in buy_list)),
        "sold_amount": _inr(sum(r["amount"] for r in sell_list)),
        "buy_count": len(buy_list),
        "sell_count": len(sell_list),
    }


def _holdings_rows(sim, session_day: date) -> tuple[list, list, list]:
    """
    Return (all, today, past) holdings.
    Today = first opened on session_day.
    Also attach how many units were bought/sold on this session (add-ons stay in past).
    """
    activity = _session_trade_activity(sim, session_day)
    bought = {r["ticker"]: r for r in activity["buys"]}
    sold = {r["ticker"]: r for r in activity["sells"]}
    rows = []
    for t, p in sim.positions.items():
        px = sim._px(t)
        mkt = px * p.qty
        opened = p.opened_on
        is_today = opened == session_day
        b = bought.get(t)
        s = sold.get(t)
        rows.append(
            {
                "ticker": t,
                "name": INSTR[t].name,
                "sleeve": INSTR[t].sleeve,
                "qty": round(p.qty, 6),
                "avg_cost": _inr(p.avg_cost),
                "price": _inr(px),
                "market_value": _inr(mkt),
                "pnl": _inr((px - p.avg_cost) * p.qty),
                "pnl_pct": (px / p.avg_cost - 1) if p.avg_cost else 0,
                "days_held": p.days_held,
                "days_left": 30 + (15 if p.extensions else 0) - p.days_held,
                "stop": _inr(p.stop) if p.stop else None,
                "opened_on": opened.isoformat(),
                "bucket": "today" if is_today else "past",
                "sleeve_label": ASSET_LABELS.get(INSTR[t].sleeve, INSTR[t].sleeve),
                "bought_today_qty": round(float(b["qty"]), 6) if b else 0.0,
                "bought_today_amount": b["amount"] if b else 0.0,
                "sold_today_qty": round(float(s["qty"]), 6) if s else 0.0,
                "sold_today_amount": s["amount"] if s else 0.0,
                "added_today": bool(b) and not is_today,
            }
        )
    rows.sort(key=lambda x: x["market_value"], reverse=True)
    today = [h for h in rows if h["bucket"] == "today"]
    past = [h for h in rows if h["bucket"] == "past"]
    return rows, today, past


def _pnl_pack(sim, as_of: Optional[date] = None) -> dict:
    hist = [h for h in sim.history if as_of is None or h.date <= as_of]
    empty = {
        "today": 0.0,
        "today_profit": 0.0,
        "today_loss": 0.0,
        "overall": 0.0,
        "profit": 0.0,
        "loss": 0.0,
        "past": 0.0,
        "past_profit": 0.0,
        "past_loss": 0.0,
        "past_day_count": 0,
        "combined": 0.0,
        "combined_profit": 0.0,
        "combined_loss": 0.0,
        "last_7": 0.0,
        "contributed": _inr(sim.total_contributed),
        "book": 0.0,
        "cash": 0.0,
        "savings": 0.0,
        "wealth": 0.0,
        "past_book": 0.0,
        "past_cash": 0.0,
        "past_savings": 0.0,
        "past_wealth": 0.0,
        "winning_days": 0,
        "day_count": 0,
        "best": None,
        "worst": None,
        "days": [],
    }
    if not hist:
        return empty

    # Prefer live marks for the open session; as-of uses replay for capital basis
    if as_of is None:
        cash = float(sim.cash)
        savings = float(sim.savings)
        mtm = float(sim.mtm())
        book = max(mtm - cash, 0.0)
        wealth = mtm + savings
        contributed = float(sim.total_contributed)
    else:
        snap = sim.replay_until(as_of)
        cash = float(snap.get("cash") or 0)
        savings = float(snap.get("savings") or 0)
        mtm = float(snap.get("mtm") or 0)
        book = max(mtm - cash, 0.0)
        wealth = float(snap.get("wealth") or (mtm + savings))
        contributed = float(snap.get("contributed") or sim.total_contributed)

    last = hist[-1]
    prior = [h for h in hist if h.date < last.date]
    if prior:
        prev = prior[-1]
        past_book = max(prev.portfolio_value - prev.cash, 0.0)
        past_cash = prev.cash
        past_savings = prev.savings
        past_wealth = prev.portfolio_value + prev.savings
    else:
        past_book = past_cash = past_savings = past_wealth = 0.0

    overall = wealth - contributed
    days = []
    for i, h in enumerate(hist):
        day_trades = [t for t in sim.trades if t.date == h.date]
        buys = [t for t in day_trades if t.side == "buy"]
        sells = [t for t in day_trades if t.side != "buy"]
        invested = len(buys) > 0 or float(h.deployed or 0) > 0.5
        if invested:
            activity = "invested"
        elif sells:
            activity = "rules"
        else:
            activity = "idle"

        day_book = max(h.portfolio_value - h.cash, 0.0)
        wealth_h = h.portfolio_value + h.savings
        dd_pct = float(getattr(h, "drawdown_pct", 0) or 0)
        # Live open session: tip of equity curve must match KPI net worth (not a stale snapshot)
        if as_of is None and h.date == last.date:
            day_book = book
            wealth_h = wealth
            h_cash = cash
            h_sav = savings
            h_mtm = mtm
            peak_now = float(getattr(sim, "peak", 0) or getattr(h, "peak", 0) or 0)
            if peak_now > 0:
                dd_pct = max(0.0, (peak_now - float(mtm)) / peak_now)
        else:
            h_cash = float(h.cash)
            h_sav = float(h.savings)
            h_mtm = float(h.portfolio_value)
        contrib = float(h.budget or 0)
        if i > 0:
            prev = hist[i - 1]
            prev_book = max(prev.portfolio_value - prev.cash, 0.0)
            prev_wealth = prev.portfolio_value + prev.savings
            book_delta = day_book - prev_book
            cash_delta = h_cash - prev.cash
            savings_delta = h_sav - prev.savings
            wealth_delta = wealth_h - prev_wealth
        else:
            book_delta = cash_delta = savings_delta = 0.0
            wealth_delta = wealth_h - float(STARTING_CASH) if i == 0 else 0.0

        # Session P/L = wealth move excluding fresh capital (matches h.daily_pnl after recompute)
        session_pnl = float(h.daily_pnl)

        reason_counts: dict = {}
        for t in sells:
            r = t.reason or "Rule exit"
            reason_counts[r] = reason_counts.get(r, 0) + 1
        reason_bits = [f"{n}× {r}" for r, n in reason_counts.items()]

        if activity == "invested":
            summary = (
                f"You invested — deployed ₹{h.deployed:,.0f} across {len(buys)} buy"
                f"{'' if len(buys) == 1 else 's'}."
            )
            if sells:
                summary += f" Rules also exited {len(sells)} leg(s)."
        elif activity == "rules":
            summary = (
                f"You did not invest. Auto rules ran {len(sells)} exit"
                f"{'' if len(sells) == 1 else 's'}"
                + (f": {', '.join(reason_bits[:3])}" if reason_bits else "")
                + "."
            )
            if abs(savings_delta) > 1:
                sign = "+" if savings_delta > 0 else "−"
                summary += (
                    f" Wealth ↑ mainly from Savings {sign}₹{abs(savings_delta):,.0f} "
                    f"(locked profits) — not new money you deposited."
                )
            if abs(book_delta) > 1:
                bsign = "+" if book_delta > 0 else "−"
                summary += f" Book {bsign}₹{abs(book_delta):,.0f} from those exits."
            summary += " Session date can update when you next open the desk (e.g. Sat open → Friday session)."
        else:
            summary = (
                "You did not invest and no auto exits ran. "
                "Net is price move on holdings you already owned."
            )

        days.append(
            {
                "date": h.date.isoformat(),
                "pnl": _inr(session_pnl),
                "book": _inr(day_book),
                "cash": _inr(h_cash),
                "savings": _inr(h_sav),
                "wealth": _inr(wealth_h),
                "value": _inr(h_mtm),  # MTM (cash + holdings)
                "deployed": _inr(h.deployed),
                "budget": _inr(h.budget),
                "regime": h.regime,
                "activity": activity,
                "invested": invested,
                "buy_count": len(buys),
                "sell_count": len(sells),
                "trade_count": len(day_trades),
                "book_delta": _inr(book_delta),
                "cash_delta": _inr(cash_delta),
                "savings_delta": _inr(savings_delta),
                "wealth_delta": _inr(wealth_delta),
                "drawdown_pct": round(float(dd_pct) * 100.0, 4),
                "summary": summary,
                "reasons": reason_bits,
                "trades": [
                    {
                        "side": t.side,
                        "ticker": t.ticker,
                        "amount": _inr(t.amount),
                        "reason": t.reason,
                        "pnl": _inr(t.pnl),
                        "profit_to_savings": _inr(t.profit_to_savings),
                    }
                    for t in day_trades[:12]
                ],
            }
        )
    best = max(hist, key=lambda h: h.daily_pnl)
    worst = min(hist, key=lambda h: h.daily_pnl)
    win = sum(1 for h in hist if h.daily_pnl > 0)

    today_r = _inr(last.daily_pnl)
    today_profit = _inr(max(last.daily_pnl, 0.0))
    today_loss = _inr(abs(min(last.daily_pnl, 0.0)))
    past_net_raw = sum(h.daily_pnl for h in prior)
    past_r = _inr(past_net_raw)
    past_profit = _inr(sum(h.daily_pnl for h in prior if h.daily_pnl > 0))
    past_loss = _inr(sum(abs(h.daily_pnl) for h in prior if h.daily_pnl < 0))
    # Combined from rounded parts so UI addition never drifts
    combined_r = _inr(today_r + past_r)
    combined_profit = _inr(today_profit + past_profit)
    combined_loss = _inr(today_loss + past_loss)
    last_7_r = _inr(sum(h.daily_pnl for h in hist[-7:]))

    return {
        "today": today_r,
        "today_profit": today_profit,
        "today_loss": today_loss,
        "overall": _inr(overall),
        "profit": combined_profit,
        "loss": combined_loss,
        "past": past_r,
        "past_profit": past_profit,
        "past_loss": past_loss,
        "past_day_count": len(prior),
        "combined": combined_r,
        "combined_profit": combined_profit,
        "combined_loss": combined_loss,
        "last_7": last_7_r,
        "contributed": _inr(contributed),
        "book": _inr(book),
        "cash": _inr(cash),
        "savings": _inr(savings),
        "wealth": _inr(wealth),
        "past_book": _inr(past_book),
        "past_cash": _inr(past_cash),
        "past_savings": _inr(past_savings),
        "past_wealth": _inr(past_wealth),
        "winning_days": win,
        "day_count": len(hist),
        "best": {"date": best.date.isoformat(), "pnl": _inr(best.daily_pnl)},
        "worst": {"date": worst.date.isoformat(), "pnl": _inr(worst.daily_pnl)},
        "days": days,
    }


def _view(as_of: Optional[str]):
    st = get_state()
    today = date.today()
    session = st.sim._date()  # live pinned session (Fri when weekend)
    if not as_of:
        return st, session, False
    try:
        d = date.fromisoformat(as_of)
    except ValueError:
        raise HTTPException(400, "Invalid date")
    if d > today:
        raise HTTPException(400, "Cannot open a future date")
    # Calendar today (incl. weekend) and the live session day → tradeable live desk
    if d >= session:
        return st, session, False
    return st, d, True


def _clock_meta(st, view: date, readonly: bool) -> dict:
    today = date.today()
    session = st.sim._date()
    s = get_settings()
    clock = market_clock(open_hhmm=s.market_open, close_hhmm=s.market_close)
    market_open = bool(clock["market_open"])
    status = clock["market_status"]
    note = clock["market_note"]
    if readonly:
        note = f"Archive view for {view.strftime('%d %b %Y')} — investing stays on the live session."
    elif status == "weekend":
        note = (
            f"Markets are closed today ({today.strftime('%A')}). "
            f"Live desk uses last session {session.strftime('%d %b %Y')}. "
            f"Next open {clock['open']} IST."
        )
    return {
        "calendar_date": today.isoformat(),
        "clock": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "session_date": session.isoformat(),
        "view_date": view.isoformat(),
        "readonly": readonly,
        "realtime": not readonly,
        "sim_date": view.isoformat(),
        "date_label": (
            f"{today.strftime('%A, %d %b %Y')}"
            if not readonly
            else view.strftime("%A, %d %b %Y")
        ),
        "session_dates": st.sim.session_dates(today),
        "can_trade": (not readonly) and market_open and (not st.sim.buying_paused()),
        "is_live_session": not readonly and view == session,
        "market_open": market_open,
        "market_status": status,
        "market_note": note,
        "market_hours": {
            "tz": clock["tz"],
            "open": clock["open"],
            "close": clock["close"],
            "local_time": clock["local_time"],
        },
        "paused": (not readonly) and st.sim.buying_paused(),
        "pause_until": (
            st.sim.pause_until.isoformat()
            if (not readonly) and st.sim.buying_paused() and st.sim.pause_until
            else None
        ),
        "pause_reason": (
            "Drawdown circuit breaker — new buys blocked until the pause date"
            if (not readonly) and st.sim.buying_paused()
            else None
        ),
        "cb_tier": getattr(st.sim, "cb_tier", 0) or 0,
        "pending_actions": [] if readonly else st.sim.pending_actions_public(),
        "invested_today": (not readonly) and st.sim.last_invest_date == session,
    }


def _require_market_open():
    s = get_settings()
    if not is_market_open_now(open_hhmm=s.market_open, close_hhmm=s.market_close):
        clock = market_clock(open_hhmm=s.market_open, close_hhmm=s.market_close)
        raise HTTPException(400, clock["market_note"] or "Markets are closed — investing unlocks on the next open session")


def _live_pack(st, n_bars: int = 28) -> dict:
    """Live tape snapshot plus short close series for sparkline charts."""
    snap = TAPE.snapshot()
    sparks: dict[str, list[float]] = {}
    idx = int(getattr(st.sim, "idx", 0) or 0)
    for t in list((snap.get("quotes") or {}).keys())[:48]:
        ser = st.book.series.get(t) if st.book and getattr(st.book, "series", None) else None
        if not ser or not getattr(ser, "bars", None):
            continue
        bars = ser.bars[max(0, idx - n_bars + 1) : idx + 1]
        closes = [round(float(b.close), 4) for b in bars if float(getattr(b, "close", 0) or 0) > 0]
        if len(closes) >= 2:
            sparks[t] = closes
    snap["sparks"] = sparks
    return snap


@router.get("/health")
def health():
    return {
        "status": "ok",
        "connected": True,
        "api": "sns-capital",
        "orchestrator": ORCHESTRATOR,
        "calendar_date": date.today().isoformat(),
        "clock": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "live": TAPE.snapshot(),
    }


@router.post("/auth/signup")
def auth_signup_route(body: SignupBody):
    try:
        return do_signup(body.email, body.username, body.password, body.name)
    except ValueError as e:
        raise HTTPException(400, str(e)) from e


@router.post("/auth/login")
def auth_login_route(body: LoginBody):
    try:
        return do_login(body.login, body.password)
    except ValueError as e:
        raise HTTPException(400, str(e)) from e


@router.post("/auth/logout")
def auth_logout_route(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        do_logout(authorization[7:].strip())
    return {"ok": True}


@router.get("/auth/me")
def auth_me(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Login required")
    uid = resolve_token(authorization[7:].strip())
    if not uid:
        raise HTTPException(401, "Session expired")
    user = user_by_id(uid)
    if not user:
        raise HTTPException(401, "User not found")
    return {
        "id": user["id"],
        "email": user["email"],
        "username": user["username"],
        "name": user.get("name") or user["username"],
    }


@router.get("/status")
def status():
    st = get_state()
    return {
        "connected": True,
        "api": "/api",
        "orchestrator": ORCHESTRATOR,
        "graph": GRAPH_PATH,
        "sim_date": st.sim._date().isoformat(),
        "skipped": sorted(st.skipped),
        "holdings": len(st.sim.positions),
        "cash": _inr(st.sim.cash),
        "live": TAPE.snapshot(),
    }


@router.get("/quotes")
def quotes():
    return _live_pack(get_state())


@router.post("/quotes/watch")
def quotes_watch(body: WatchBody):
    TAPE.watch_tickers(body.tickers)
    return _live_pack(get_state())


@router.get("/quotes/stream")
async def quotes_stream():
    async def events():
        last = None
        tick = 0
        while True:
            snap = TAPE.snapshot()
            sig = tuple(sorted((t, round(q["price"], 4), round(q.get("chg_pct") or 0, 3)) for t, q in snap["quotes"].items()))
            tick += 1
            # Push on price move, and a heartbeat every ~3s so UI clocks keep ticking
            if sig != last or tick % 3 == 0:
                yield f"data: {json.dumps(snap)}\n\n"
                last = sig
            await asyncio.sleep(1)
    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"},
    )


@router.get("/dashboard")
def dashboard(as_of: Optional[str] = Query(None)):
    """Home desk: P/L, live book, holdings, and names you can buy."""
    data = today(as_of=as_of)
    st, view, readonly = _view(as_of)
    if readonly:
        rows = data.get("holdings") or st.sim.replay_until(view)["holdings"]
        for h in rows:
            h.setdefault("bucket", "past")
            h.setdefault("opened_on", view.isoformat())
        data["holdings"] = rows
        data["holdings_today"] = []
        data["holdings_past"] = rows
        return data
    sim = st.sim
    all_h, today_h, past_h = _holdings_rows(sim, sim._date())
    data["holdings"] = all_h
    data["holdings_today"] = today_h
    data["holdings_past"] = past_h
    if isinstance(data.get("pnl"), dict):
        data["pnl"] = _apply_book_override(st, data["pnl"])
        data["portfolio"] = data["pnl"]["book"]
    return data


@router.get("/today")
def today(as_of: Optional[str] = Query(None)):
    """Live desk on today's real date, or a frozen past session."""
    st, view, readonly = _view(as_of)
    if readonly:
        return _historical_today(st, view)
    sim = st.sim
    sim.refresh_live_snapshot()
    last = sim.history[-1]
    wts = sim.weights()
    allocation = [
        {
            "asset": k,
            "label": ASSET_LABELS[k],
            "weight": wts[k],
            "value": _inr(sum(p.qty * sim._px(t) for t, p in sim.positions.items() if INSTR[t].sleeve == k)),
        }
        for k in ALLOCATION
    ]
    picks_all = _suggestions(st, limit=get_settings().suggestion_count + 25, for_display=True)
    n = get_settings().suggestion_count
    buys = [p for p in picks_all if p["verdict"] == "BUY"]
    holds = [p for p in picks_all if p["verdict"] != "BUY"]
    seen: set[str] = set()
    picks: list = []
    for pool in (buys, holds):
        for p in pool:
            if len(picks) >= n:
                break
            if p["ticker"] not in seen:
                picks.append(p)
                seen.add(p["ticker"])
    alternatives = [p for p in picks_all if p["ticker"] not in seen][:20]
    risk = portfolio_risk_profile(sim, st.book)
    TAPE.watch_tickers([p["ticker"] for p in picks_all] + list(sim.positions.keys()))
    pnl = _apply_book_override(st, _pnl_pack(sim))
    all_h, today_h, past_h = _holdings_rows(sim, sim._date())
    clock = _clock_meta(st, view, False)
    from app.engine.strategies import get_strategy as _get_strat

    try:
        _strat = _get_strat(getattr(st, "strategy_id", None))
    except ValueError:
        _strat = _get_strat("multi_factor")
    return {
        **clock,
        "regime": last.regime,
        "friday": last.date.weekday() == 4,
        "contribution_today": _inr(sim.contributed_today()),
        "recommended_amount": _inr(sim.daily_budget()),
        "remaining_daily_budget": _inr(sim.remaining_daily_budget()),
        "remaining_deploy_budget": _inr(sim.remaining_deploy_budget()),
        "max_deployable": _inr(_max_deployable_after(sim, max(sim.remaining_deploy_budget(), 1.0))[0]),
        "deployed_today": _inr(sim.deployed_today()),
        "invested_today": sim.last_invest_date == last.date or sim.deployed_today() > 0.5,
        "paused": sim.buying_paused(),
        "portfolio": pnl["book"],
        "mtm": _inr(last.portfolio_value),
        "cash": _inr(last.cash),
        "savings": _inr(last.savings),
        "contributed": _inr(sim.total_contributed),
        "daily_pnl": pnl["today"],
        "total_pnl": pnl["overall"],
        "past_pnl": pnl["past"],
        "pnl": pnl,
        "allocation": allocation,
        "suggestions": picks,
        "alternatives": alternatives,
        "risk_profile": risk,
        "skipped": sorted(st.skipped),
        "strategy": _strat.id,
        "strategy_name": _strat.name,
        "strategy_mindset": _strat.mindset,
        "orchestrator": ORCHESTRATOR,
        "connected": True,
        "live": _live_pack(st),
        "pnl_days": pnl["days"],
        "pnl_curve": [{"date": h["date"], "pnl": h["pnl"]} for h in pnl["days"]],
        "drawdown": {
            "t1": float(sim.rp("drawdown_t1", 0.10)),
            "t2": float(sim.rp("drawdown_t2", 0.15)),
            "t3": float(sim.rp("drawdown_t3", 0.20)),
            "resume": float(sim.rp("drawdown_resume", 0.07)),
            "current_pct": round(float(getattr(last, "drawdown_pct", 0) or 0) * 100.0, 4),
        },
        "starting_cash": STARTING_CASH,
        "reserve_pct": last.cash / last.portfolio_value if last.portfolio_value else 0,
        "reserve_target": CASH_RESERVE_PCT,
        "n_holdings": len(sim.positions),
        "holdings": all_h,
        "holdings_today": today_h,
        "holdings_past": past_h,
        "session_activity": _session_trade_activity(sim, sim._date()),
        "day_trades": [
            {
                "ticker": t.ticker,
                "side": t.side,
                "qty": round(t.qty, 6),
                "price": _inr(t.price),
                "amount": _inr(t.amount),
                "reason": t.reason or "",
            }
            for t in sim.trades
            if t.date == view
        ],
    }


def _historical_today(st, view: date):
    sim = st.sim
    book = sim.replay_until(view)
    pnl = _pnl_pack(sim, view)
    hist = [h for h in sim.history if h.date <= view]
    last = hist[-1] if hist else None
    today_pnl = last.daily_pnl if last and last.date == view else 0.0
    past = sum(h.daily_pnl for h in hist if h.date < view)
    overall = book["wealth"] - book["contributed"]
    pnl["today"] = _inr(today_pnl)
    pnl["past"] = _inr(past)
    pnl["overall"] = _inr(overall)
    pnl["contributed"] = _inr(book["contributed"])
    pnl["wealth"] = _inr(book["wealth"])
    total = max(book["mtm"], 1.0)
    allocation = []
    for k in ALLOCATION:
        val = sum(h["market_value"] for h in book["holdings"] if h["sleeve"] == k)
        allocation.append(
            {"asset": k, "label": ASSET_LABELS[k], "weight": val / total, "value": _inr(val)}
        )
    clock = _clock_meta(st, view, True)
    return {
        **clock,
        "regime": book["regime"],
        "friday": view.weekday() == 4,
        "contribution_today": _inr(book["budget"]),
        "recommended_amount": 0.0,
        "deployed_today": _inr(book["deployed"]),
        "invested_today": any(t.date == view and t.side == "buy" for t in sim.trades),
        "paused": True,
        "portfolio": _inr(max(book["mtm"] - book["cash"], 0.0)),
        "mtm": _inr(book["mtm"]),
        "cash": _inr(book["cash"]),
        "savings": _inr(book["savings"]),
        "contributed": _inr(book["contributed"]),
        "daily_pnl": pnl["today"],
        "total_pnl": pnl["overall"],
        "past_pnl": pnl["past"],
        "pnl": pnl,
        "allocation": allocation,
        "suggestions": [],
        "alternatives": [],
        "skipped": [],
        "orchestrator": ORCHESTRATOR,
        "connected": True,
        "live": {"live": False, "source": "historical", "quotes": {}},
        "pnl_days": pnl["days"],
        "pnl_curve": [{"date": h["date"], "pnl": h["pnl"]} for h in pnl["days"]],
        "starting_cash": STARTING_CASH,
        "reserve_pct": book["cash"] / book["mtm"] if book["mtm"] else 0,
        "reserve_target": CASH_RESERVE_PCT,
        "n_holdings": len(book["holdings"]),
        "holdings": book["holdings"],
        "holdings_today": [
            {**h, "bucket": "today", "opened_on": h.get("opened_on") or view.isoformat()}
            for h in book["holdings"]
            if _first_buy_on_or_before(sim, h["ticker"], view) == view
        ],
        "holdings_past": [
            {**h, "bucket": "past", "opened_on": (_first_buy_on_or_before(sim, h["ticker"], view) or view).isoformat()}
            for h in book["holdings"]
            if _first_buy_on_or_before(sim, h["ticker"], view) != view
        ],
        "session_activity": _session_trade_activity(sim, view),
        "day_trades": [
            {
                "ticker": t.ticker,
                "side": t.side,
                "qty": round(t.qty, 6),
                "price": _inr(t.price),
                "amount": _inr(t.amount),
                "reason": t.reason or "",
            }
            for t in sim.trades
            if t.date == view
        ],
    }


def _first_buy_on_or_before(sim, ticker: str, day: date):
    opened = None
    for tr in sim.trades:
        if tr.ticker != ticker or tr.side != "buy" or tr.date > day:
            continue
        if opened is None or tr.date < opened:
            opened = tr.date
    return opened


def _suggestions(st, limit: int, for_display: bool = False):
    return build_suggestions(
        st,
        limit,
        for_display=for_display,
        buy_only=not for_display,
        strategy=getattr(st, "strategy_id", None),
    )


def _max_deployable_after(sim, amount: float) -> tuple[float, float, float]:
    """Return (max_deployable, reserve_floor, extra_contribution) for an invest amount."""
    s = get_settings()
    requested = float(amount)
    remain_contrib = sim.remaining_daily_budget()
    remain_deploy = sim.remaining_deploy_budget()
    extra = max(0.0, requested - sim.cash)
    if extra > remain_contrib:
        requested = sim.cash + remain_contrib
        extra = remain_contrib
    cash_after = sim.cash + extra
    mtm_after = sim.mtm() + extra
    reserve_pct = float(sim.rp("cash_reserve_pct", s.cash_reserve_pct)) if sim.rule_on("cash_reserve") else 0.0
    reserve_floor = reserve_pct * mtm_after
    max_from_cash = max(0.0, round(cash_after - reserve_floor, 2))
    # Also respect remaining daily deploy ceiling
    max_deployable = min(max_from_cash, remain_deploy)
    return max(0.0, round(max_deployable, 2)), round(reserve_floor, 2), round(extra, 2)


def _scale_tickets_to_cap(tickets: list, cap: float) -> list:
    """Proportionally shrink ticket amounts to fit max deployable (drop sub-₹50)."""
    total = round(sum(float(t.get("amount") or 0) for t in tickets), 2)
    if total <= 0 or cap <= 0:
        return []
    if total <= cap + 1:
        return tickets
    scale = cap / total
    scaled = []
    for t in tickets:
        amt = max(0.0, math.floor(float(t.get("amount") or 0) * scale))
        if amt >= 50:
            scaled.append({**t, "amount": amt})
    if not scaled:
        return []
    used = sum(t["amount"] for t in scaled)
    drift = int(round(cap - used))
    if drift != 0:
        top = max(scaled, key=lambda x: x["amount"])
        top["amount"] = max(50, top["amount"] + drift)
    return scaled


def _plan_from_amount(st, amount: float) -> dict:
    sim = st.sim
    s = get_settings()
    picks = _suggestions(st, s.suggestion_count)
    buys = [p for p in picks if p["verdict"] == "BUY"] or picks
    # Small probe; reserve is enforced via max_deployable after contribution (not here).
    buys = [p for p in buys if can_buy(sim, p["ticker"], 100.0, enforce_reserve=False)[0]]
    requested = float(amount)
    remain_contrib = sim.remaining_daily_budget()
    remain_deploy = sim.remaining_deploy_budget()
    daily_cap = sim.daily_budget()
    used_contrib = sim.contributed_today()
    used_deploy = sim.deployed_today()
    extra = max(0.0, requested - sim.cash)
    if extra > remain_contrib:
        requested = sim.cash + remain_contrib
        extra = remain_contrib
    # Boss v3.1: never deploy the cash reserve (of MTM *after* this contribution).
    mtm_after = sim.mtm() + extra
    cash_after = sim.cash + extra
    reserve_pct = float(sim.rp("cash_reserve_pct", s.cash_reserve_pct)) if sim.rule_on("cash_reserve") else 0.0
    reserve_floor = reserve_pct * mtm_after
    max_from_cash = max(0.0, round(cash_after - reserve_floor, 2))
    max_deployable = min(max_from_cash, remain_deploy)
    spend = min(requested, max_deployable)

    def _room(ticker: str) -> float:
        held = sim.positions[ticker].qty * sim._px(ticker) if ticker in sim.positions else 0.0
        return max(0.0, s.max_position_pct * mtm_after - held)

    buys = [p for p in buys if _room(p["ticker"]) >= 80]
    if not buys or spend <= 0:
        if remain_deploy <= 0 or remain_contrib <= 0 and sim.cash <= reserve_floor + 1:
            note = (
                f"Daily budget already used (₹{used_deploy:,.0f} / ₹{daily_cap:,.0f} deployed"
                f"{f', ₹{used_contrib:,.0f} contributed' if used_contrib else ''}). "
                f"Come back next session."
            )
        elif sim.buying_paused():
            note = "Buying paused"
        elif spend <= 0:
            if remain_deploy >= 50 and max_deployable < 50:
                note = (
                    f"Remaining cash is the required {s.cash_reserve_pct:.0%} reserve "
                    f"(~ Rs {reserve_floor:,.0f}). Investable now is Rs 0 — daily ceiling still shows "
                    f"Rs {remain_deploy:,.0f} left, but that is not cash above the reserve. "
                    f"Come back next session to contribute & deploy more."
                )
            else:
                note = (
                    f"Keep {s.cash_reserve_pct:.0%} cash reserve (~ Rs {reserve_floor:,.0f}) — "
                    f"max deployable ≈ Rs {max_deployable:,.0f}"
                )
        else:
            note = "Every pick is already near the 10% per-name cap — trim or wait for new names"
        return {
            "amount": _inr(requested),
            "cash": _inr(sim.cash),
            "extra_contribution": _inr(extra),
            "lines": [],
            "leftover": _inr(requested),
            "deployed": 0.0,
            "paused": sim.buying_paused(),
            "reserve_pct": s.cash_reserve_pct,
            "reserve_floor": _inr(reserve_floor),
            "max_deployable": _inr(max_deployable),
            "daily_budget": _inr(daily_cap),
            "remaining_daily_budget": _inr(remain_contrib),
            "remaining_deploy_budget": _inr(remain_deploy),
            "contributed_today": _inr(used_contrib),
            "deployed_today": _inr(used_deploy),
            "capped_to_daily": False,
            "note": note,
        }
    from app.engine.strategies import get_strategy as _get_plan_strat

    try:
        plan_strat = _get_plan_strat(getattr(st, "strategy_id", None))
    except ValueError:
        plan_strat = _get_plan_strat("multi_factor")
    if plan_strat.equal_weight:
        weights = [1.0] * len(buys)
    else:
        weights = [max(float(p["score"]), 1.0) for p in buys]
    wsum = sum(weights) or 1.0
    lines = []
    leftover = 0.0
    for p, w in zip(buys, weights):
        raw = spend * (w / wsum)
        share = min(raw, _room(p["ticker"]))
        if share < 50:
            leftover += raw
            continue
        qty, spent, px = sim.size_ticket(p["ticker"], share)
        leftover += max(0.0, share - spent)
        if qty <= 0 or spent <= 0:
            continue
        lines.append(
            {
                "ticker": p["ticker"],
                "name": p["name"],
                "sleeve": p["sleeve"],
                "price": _inr(px),
                "qty": round(qty, 6),
                "amount": _inr(spent),
                "verdict": p["verdict"],
                "score": p["score"],
                "fractional": abs(qty - round(qty)) > 1e-9,
            }
        )
    for line in lines:
        if leftover < 0.5:
            break
        room_left = _room(line["ticker"]) - float(line["amount"])
        if room_left < 50:
            continue
        take = min(leftover, room_left)
        inst = INSTR[line["ticker"]]
        px = sim._px(line["ticker"])
        if inst.asset != "crypto" and take < px and take < 80:
            continue
        qty, spent, _px = sim.size_ticket(line["ticker"], take)
        if spent <= 0 or spent > leftover + 1e-6:
            continue
        line["qty"] = round(line["qty"] + qty, 6)
        line["amount"] = _inr(line["amount"] + spent)
        line["fractional"] = abs(line["qty"] - round(line["qty"])) > 1e-9
        leftover -= spent
    deployed = round(sum(l["amount"] for l in lines), 2)
    if deployed > spend and lines:
        over = round(deployed - spend, 2)
        last = lines[-1]
        last["amount"] = _inr(max(0.0, last["amount"] - over))
        if last["price"]:
            last["qty"] = round(last["amount"] / last["price"], 6)
            last["fractional"] = abs(last["qty"] - round(last["qty"])) > 1e-9
        if last["amount"] <= 0:
            lines.pop()
        deployed = round(sum(l["amount"] for l in lines), 2)
    leftover = round(max(0.0, requested - deployed), 2)
    reserve_held = round(max(0.0, max_deployable - deployed) + max(0.0, cash_after - max_deployable), 2)
    note = None
    asked = float(amount)
    capped_daily = asked > remain_deploy + 0.5 and used_deploy > 0
    if remain_deploy <= 0.5 and used_deploy > 0:
        note = (
            f"Daily budget already used (Rs {used_deploy:,.0f} / Rs {daily_cap:,.0f} deployed). "
            f"Next contribution unlocks next session."
        )
    elif leftover >= 1 or capped_daily:
        bits = []
        if capped_daily:
            bits.append(
                f"Daily deploy room left is only Rs {remain_deploy:,.0f} "
                f"(already deployed Rs {used_deploy:,.0f} of Rs {daily_cap:,.0f}) - not another full Rs {daily_cap:,.0f}"
            )
        if remain_contrib + 0.5 < max(0.0, asked - sim.cash) and used_contrib > 0:
            bits.append(
                f"Daily contribution room left ~ Rs {remain_contrib:,.0f} "
                f"(already put in Rs {used_contrib:,.0f} of Rs {daily_cap:,.0f} today)"
            )
        if requested > max_deployable + 0.5 and not capped_daily:
            bits.append(
                f"Boss rule: {s.cash_reserve_pct:.0%} cash reserve on portfolio "
                f"(~ Rs {reserve_floor:,.0f}) - max deployable ~ Rs {max_deployable:,.0f}"
            )
        if leftover > (requested - max_deployable) + 50 and not capped_daily:
            bits.append("Some leftover from whole-share sizing / per-name 10% cap / quality filter")
        note = " · ".join(bits) if bits else f"~ Rs {leftover:,.0f} stays in cash"
    return {
        "amount": _inr(requested),
        "cash": _inr(sim.cash),
        "extra_contribution": _inr(extra),
        "lines": lines,
        "leftover": leftover,
        "deployed": deployed,
        "paused": sim.buying_paused(),
        "date": sim._date().isoformat(),
        "reserve_pct": s.cash_reserve_pct,
        "reserve_floor": _inr(reserve_floor),
        "max_deployable": _inr(max_deployable),
        "reserve_held": _inr(min(reserve_held, cash_after)),
        "daily_budget": _inr(daily_cap),
        "remaining_daily_budget": _inr(remain_contrib),
        "remaining_deploy_budget": _inr(remain_deploy),
        "contributed_today": _inr(used_contrib),
        "deployed_today": _inr(used_deploy),
        "capped_to_daily": capped_daily,
        "note": note,
    }


@router.get("/suggestions")
def suggestions():
    st = get_state()
    n = get_settings().suggestion_count
    picks = _suggestions(st, n + 8)
    return {
        "date": st.sim._date().isoformat(),
        "buys": picks[:n],
        "alternatives": picks[n:],
        "skipped": sorted(st.skipped),
        "orchestrator": ORCHESTRATOR,
        "connected": True,
    }


@router.get("/search")
def search(q: str = Query("", max_length=40)):
    needle = q.strip().lower()
    popular = ["TCS", "RELIANCE", "HDFCBANK", "INFY", "NVDA", "AAPL", "GOLD", "BTC", "ZOMATO", "SILVER"]
    if not needle:
        rows = []
        for t in popular:
            i = INSTR.get(t)
            if i:
                rows.append({"ticker": i.ticker, "name": i.name, "sleeve": i.sleeve, "sector": i.sector})
        return {"q": q, "results": rows, "connected": True}
    ranked = []
    for i in UNIVERSE:
        ticker = i.ticker.lower()
        name = i.name.lower()
        hay = f"{ticker} {name} {i.sleeve} {i.sector}"
        if needle and needle not in hay:
            continue
        if ticker.startswith(needle):
            rank = 0
        elif name.startswith(needle):
            rank = 1
        else:
            rank = 2
        ranked.append((rank, i.ticker, {"ticker": i.ticker, "name": i.name, "sleeve": i.sleeve, "sector": i.sector}))
    ranked.sort(key=lambda x: (x[0], x[1]))
    return {"q": q, "results": [r[2] for r in ranked[:15]], "connected": True}


@router.post("/skip")
def skip_name(body: SkipBody):
    st = get_state()
    t = body.ticker.upper().strip()
    if t not in INSTR:
        raise HTTPException(404, "Unknown ticker")
    st.skipped.add(t)
    st.save()
    n = get_settings().suggestion_count
    picks = _suggestions(st, n + 8)
    return {
        "ok": True,
        "skipped": sorted(st.skipped),
        "suggestions": picks[:n],
        "alternatives": picks[n:],
    }


@router.post("/unskip")
def unskip_name(body: SkipBody):
    st = get_state()
    st.skipped.discard(body.ticker.upper().strip())
    st.save()
    n = get_settings().suggestion_count
    picks = _suggestions(st, n + 8)
    return {
        "ok": True,
        "skipped": sorted(st.skipped),
        "suggestions": picks[:n],
        "alternatives": picks[n:],
    }


@router.post("/plan")
def plan_invest(body: AmountBody):
    _require_market_open()
    st = get_state()
    return _plan_from_amount(st, body.amount)


@router.post("/invest")
def invest(body: InvestBody):
    _require_market_open()
    st = get_state()
    sim = st.sim
    if sim.buying_paused():
        raise HTTPException(400, "Buying is paused by drawdown rule")
    remain = sim.remaining_deploy_budget()
    daily = sim.daily_budget()
    used = sim.deployed_today()
    if remain < 50:
        raise HTTPException(
            400,
            f"Daily budget already used (Rs {used:,.0f} / Rs {daily:,.0f} deployed). "
            f"Boss rule: one daily ceiling per session — try again next open day.",
        )
    asked = float(body.amount)
    custom = body.tickets
    leftover = 0.0
    extra = 0.0
    if custom:
        # User-edited Preview split — honor their picks (still gated by rules + daily ceiling).
        tickets = []
        for row in custom:
            t = row.ticker.upper().strip()
            if t not in INSTR:
                raise HTTPException(400, f"Unknown ticker {row.ticker}")
            amt = round(float(row.amount), 2)
            if amt >= 50:
                tickets.append({"ticker": t, "amount": amt})
        if not tickets:
            raise HTTPException(400, "No names left in your split — add amount or re-run Preview")
        total = round(sum(r["amount"] for r in tickets), 2)
        if total > remain + 1:
            tickets = _scale_tickets_to_cap(tickets, remain)
            total = round(sum(r["amount"] for r in tickets), 2)
            if not tickets or total < 50:
                raise HTTPException(
                    400,
                    f"Edited split is Rs {total:,.0f} but daily room left is only Rs {remain:,.0f}. "
                    f"Trim units or remove a name.",
                )
        # Use the user's invest amount (not ticket sum alone) so contribution/reserve matches Preview.
        funding = max(asked, total)
        max_dep, _, extra = _max_deployable_after(sim, funding)
        if total > max_dep + 1:
            tickets = _scale_tickets_to_cap(tickets, max_dep)
            total = round(sum(r["amount"] for r in tickets), 2)
            if not tickets or total < 50:
                raise HTTPException(
                    400,
                    f"Edited split is over max deployable (~ Rs {max_dep:,.0f} after 5% reserve). "
                    f"Trim units or remove a name.",
                )
            max_dep, _, extra = _max_deployable_after(sim, max(asked, total))
        mtm_after = sim.mtm() + max(0.0, extra)
        tickets, rejects = filter_tickets(sim, tickets, enforce_reserve=False, mtm=mtm_after)
        if not tickets:
            raise HTTPException(400, rejects[0] if rejects else "Blocked by desk rules")
        deposit = total
        leftover = round(max(0.0, asked - total), 2)
    else:
        # Cap plan to remaining daily deploy room.
        plan = _plan_from_amount(st, min(asked, max(remain, 0.0)))
        if not plan["lines"]:
            raise HTTPException(400, plan.get("note") or "No names pass desk rules for that amount")
        tickets = [{"ticker": row["ticker"], "amount": row["amount"]} for row in plan["lines"]]
        extra = float(plan.get("extra_contribution") or 0)
        mtm_after = sim.mtm() + max(0.0, extra)
        tickets, rejects = filter_tickets(sim, tickets, enforce_reserve=False, mtm=mtm_after)
        if not tickets:
            raise HTTPException(400, rejects[0] if rejects else "Blocked by desk rules")
        deposit = float(plan.get("amount") or asked)
        leftover = float(plan.get("leftover") or 0)
        extra = float(plan.get("extra_contribution") or 0)
    result = sim.apply_invest(deposit, tickets, cap_contribution=True)
    if not result["fills"]:
        reason = result.get("block_reason") or (
            f"Could not fill tickets — max deployable ~ Rs {result.get('max_deployable', 0):,.0f} "
            f"after keeping ~ Rs {result.get('reserve_floor', 0):,.0f} cash reserve "
            f"(daily room was Rs {remain:,.0f}). Use Max safe, then Preview again."
        )
        raise HTTPException(400, reason)
    st.save()
    return {
        "ok": True,
        "date": sim._date().isoformat(),
        "fills": result["fills"],
        "deployed": _inr(result["deployed"]),
        "leftover": leftover,
        "cash": _inr(result["cash"]),
        "extra_contribution": _inr(extra),
        "remaining_deploy_budget": _inr(sim.remaining_deploy_budget()),
        "max_deployable": _inr(result.get("max_deployable") or 0),
        "daily_budget": _inr(daily),
        "capped_to_daily": asked > remain + 1,
        "edited": bool(custom),
    }


@router.post("/buy")
def buy_one(body: BuyBody):
    _require_market_open()
    st = get_state()
    sim = st.sim
    ticker = body.ticker.upper().strip()
    if ticker not in INSTR:
        raise HTTPException(404, "Unknown ticker")
    # Project MTM if this buy will pull in fresh contribution (deposit > cash).
    requested = float(body.amount)
    extra = max(0.0, requested - sim.cash)
    mtm_after = sim.mtm() + extra
    held = sim.positions[ticker].qty * sim._px(ticker) if ticker in sim.positions else 0.0
    room = max(0.0, get_settings().max_position_pct * mtm_after - held)
    # Auto-cap single-name adds to 10% room so a leftover ₹10K default doesn't hard-block.
    amount = requested
    if room > 0 and amount > room + 1.0:
        if room < 50:
            raise HTTPException(
                400,
                f"Max position is {get_settings().max_position_pct:.0%} of book — can add at most ₹{room:,.0f} "
                f"to {ticker} (use Trade → Invest now to split across names)",
            )
        amount = round(room, 2)
    ok, reason = can_buy(sim, ticker, amount, mtm=mtm_after)
    if not ok:
        raise HTTPException(400, reason)
    qty, spent, px = sim.size_ticket(ticker, amount)
    if qty <= 0 or spent <= 0:
        raise HTTPException(400, "Amount too small to buy")
    # Keep 5% cash reserve even on contribution-funded single buys.
    extra_needed = max(0.0, spent - sim.cash)
    cash_after = sim.cash + extra_needed
    floor_after = get_settings().cash_reserve_pct * (sim.mtm() + extra_needed)
    max_spend = max(0.0, cash_after - floor_after)
    if spent > max_spend + 1e-6:
        if max_spend < 50:
            raise HTTPException(400, f"Keep {get_settings().cash_reserve_pct:.0%} cash reserve")
        spent = round(max_spend, 2)
        qty, spent, px = sim.size_ticket(ticker, spent)
        if qty <= 0 or spent <= 0:
            raise HTTPException(400, "Amount too small after cash reserve")
    # Deposit only what this fill needs — do not pull in a full ₹10K contribution for a capped add.
    result = sim.apply_invest(spent, [{"ticker": ticker, "amount": spent}], cap_contribution=True)
    if not result["fills"]:
        raise HTTPException(400, "Could not complete buy — check cash")
    st.save()
    fill = result["fills"][0]
    return {
        "ok": True,
        "ticker": ticker,
        "qty": fill["qty"],
        "price": fill["price"],
        "amount": fill["amount"],
        "capped": amount + 1 < requested,
        "cash": _inr(result["cash"]),
    }


@router.post("/sell")
def sell_one(body: SellBody):
    st = get_state()
    sim = st.sim
    ticker = body.ticker.upper().strip()
    if ticker not in INSTR:
        raise HTTPException(404, "Unknown ticker")
    if ticker not in sim.positions:
        raise HTTPException(400, f"No open position in {ticker}")
    try:
        if body.sell_all or (body.qty is None and body.fraction is None):
            result = sim.apply_sell(ticker)
        elif body.fraction is not None:
            result = sim.apply_sell(ticker, fraction=body.fraction)
        else:
            result = sim.apply_sell(ticker, qty=body.qty)
    except ValueError as e:
        raise HTTPException(400, str(e)) from e
    st.save()
    return {"ok": True, "date": sim._date().isoformat(), **result, "cash": _inr(result["cash"]), "savings": _inr(result["savings"])}


@router.post("/rules/resume-buying")
def resume_buying():
    """Clear drawdown pause so Invest / Buy work again (user override)."""
    st = get_state()
    result = st.sim.resume_buying()
    st.save()
    # Re-run gate so response reflects override (no re-lock)
    s = get_settings()
    market_open = is_market_open_now(open_hhmm=s.market_open, close_hhmm=s.market_close)
    return {
        **result,
        "can_trade": market_open and (not st.sim.buying_paused()),
        "paused": st.sim.buying_paused(),
        "pause_until": None,
        "market_open": market_open,
    }


@router.get("/rules/pending")
def list_pending_rules():
    st = get_state()
    return {"pending_actions": st.sim.pending_actions_public()}


@router.post("/rules/pending/approve")
def approve_pending_rule(body: PendingActionBody):
    st = get_state()
    try:
        result = st.sim.approve_pending(body.id.strip())
    except ValueError as e:
        raise HTTPException(400, str(e)) from e
    st.save()
    return {
        **result,
        "cash": _inr(result["cash"]),
        "savings": _inr(result["savings"]),
        "pending_actions": st.sim.pending_actions_public(),
    }


@router.post("/rules/pending/reject")
def reject_pending_rule(body: PendingActionBody):
    st = get_state()
    try:
        result = st.sim.reject_pending(body.id.strip())
    except ValueError as e:
        raise HTTPException(400, str(e)) from e
    st.save()
    return {**result, "pending_actions": st.sim.pending_actions_public()}


@router.get("/portfolio")
def portfolio(as_of: Optional[str] = Query(None)):
    st, view, readonly = _view(as_of)
    clock = _clock_meta(st, view, readonly)
    if readonly:
        book = st.sim.replay_until(view)
        pnl = _pnl_pack(st.sim, view)
        total = max(book["mtm"], 1.0)
        allocation = [
            {
                "asset": k,
                "label": ASSET_LABELS[k],
                "weight": sum(h["market_value"] for h in book["holdings"] if h["sleeve"] == k) / total,
                "value": _inr(sum(h["market_value"] for h in book["holdings"] if h["sleeve"] == k)),
            }
            for k in ALLOCATION
        ]
        pnl["today"] = _inr(next((h.daily_pnl for h in reversed(st.sim.history) if h.date == view), 0.0))
        pnl["contributed"] = _inr(book["contributed"])
        pnl["book"] = _inr(max(book["mtm"] - book["cash"], 0.0))
        pnl["cash"] = _inr(book["cash"])
        pnl["savings"] = _inr(book["savings"])
        pnl["wealth"] = _inr(book["wealth"])
        pnl["overall"] = _inr(book["wealth"] - book["contributed"])
        return {
            **clock,
            "cash": _inr(book["cash"]),
            "savings": _inr(book["savings"]),
            "mtm": _inr(book["mtm"]),
            "portfolio": _inr(max(book["mtm"] - book["cash"], 0.0)),
            "contributed": _inr(book["contributed"]),
            "pnl": pnl["overall"],
            "daily_pnl": pnl["today"],
            "past_pnl": pnl["past"],
            "pack": pnl,
            "holdings": book["holdings"],
            "holdings_today": [],
            "holdings_past": book["holdings"],
            "pnl_days": pnl["days"],
            "allocation": allocation,
            "connected": True,
            "live": {"live": False, "source": "historical", "quotes": {}},
            "regime": book["regime"],
        }
    sim = st.sim
    sim.refresh_live_snapshot()
    value = sim.mtm()
    all_h, today_h, past_h = _holdings_rows(sim, sim._date())
    pnl = _apply_book_override(st, _pnl_pack(sim))
    wts = sim.weights()
    allocation = [
        {
            "asset": k,
            "label": ASSET_LABELS[k],
            "weight": wts[k],
            "value": _inr(sum(p.qty * sim._px(t) for t, p in sim.positions.items() if INSTR[t].sleeve == k)),
        }
        for k in ALLOCATION
    ]
    return {
        **clock,
        "cash": _inr(sim.cash),
        "savings": _inr(sim.savings),
        "mtm": _inr(value),
        "portfolio": pnl["book"],
        "contributed": pnl["contributed"],
        "pnl": pnl["overall"],
        "daily_pnl": pnl["today"],
        "past_pnl": pnl["past"],
        "pack": pnl,
        "holdings": all_h,
        "holdings_today": today_h,
        "holdings_past": past_h,
        "session_activity": _session_trade_activity(sim, sim._date()),
        "day_trades": [
            {
                "ticker": t.ticker,
                "side": t.side,
                "qty": round(t.qty, 6),
                "price": _inr(t.price),
                "amount": _inr(t.amount),
                "reason": t.reason or "",
            }
            for t in sim.trades
            if t.date == sim._date()
        ],
        "pnl_days": pnl["days"],
        "allocation": allocation,
        "risk_profile": portfolio_risk_profile(sim, st.book),
        "connected": True,
        "live": TAPE.snapshot(),
        "regime": sim.history[-1].regime if sim.history else None,
    }


@router.post("/book")
def set_book(body: BookBody):
    """Manually set today's book value (holdings), or clear to restore live MTM."""
    st = get_state()
    if body.clear or body.value is None:
        st.set_book_override(None)
        live = max(st.sim.mtm() - st.sim.cash, 0.0)
        return {"ok": True, "book_manual": False, "book": _inr(live), "book_live": _inr(live)}
    st.set_book_override(body.value)
    return {
        "ok": True,
        "book_manual": True,
        "book": _inr(body.value),
        "book_live": _inr(max(st.sim.mtm() - st.sim.cash, 0.0)),
    }


@router.post("/contributed")
def set_contributed(body: ContributedBody):
    """Manually set total money put in (contributions). Updates overall P/L."""
    st = get_state()
    st.sim.total_contributed = float(body.value)
    st.save()
    pnl = _apply_book_override(st, _pnl_pack(st.sim))
    return {
        "ok": True,
        "contributed": pnl["contributed"],
        "overall": pnl["overall"],
        "wealth": pnl["wealth"],
    }


def _enrich_research(st, ticker: str) -> dict:
    payload = research_ticker(
        st.book, ticker, st.sim.idx, st.toggles.news_decay, st.toggles.value_condition
    )
    bars = st.book.series[ticker].bars[max(0, st.sim.idx - 90) : st.sim.idx + 1]
    payload["chart"] = [{"date": b.date.isoformat(), "close": _inr(b.close)} for b in bars]
    payload["also"] = [
        {"ticker": i.ticker, "name": i.name, "sleeve": i.sleeve}
        for i in UNIVERSE
        if i.sleeve == payload["sleeve"] and i.ticker != ticker
    ][:8]
    payload["connected"] = True
    return payload


def _research_many(st, tickers: list[str]) -> list[dict]:
    seen: list[str] = []
    for raw in tickers:
        t = raw.upper().strip()
        if t in INSTR and t not in seen:
            seen.append(t)
    if not seen:
        raise HTTPException(400, "No valid tickers")
    # Soft cap keeps research latency reasonable for the desk
    capped = seen[:24]
    TAPE.watch_tickers(capped)
    return [_enrich_research(st, t) for t in capped]


@router.get("/research/compare")
def research_compare(tickers: str = Query("", max_length=800)):
    st = get_state()
    parts = [p.strip() for p in tickers.replace("+", ",").split(",") if p.strip()]
    results = _research_many(st, parts)
    return {"results": results, "connected": True, "live": TAPE.snapshot()}


@router.post("/research/batch")
def research_batch(body: BatchResearchBody):
    st = get_state()
    results = _research_many(st, body.tickers)
    return {"results": results, "connected": True, "live": TAPE.snapshot()}


@router.get("/research/{ticker}")
def research(ticker: str):
    st = get_state()
    ticker = ticker.upper()
    if ticker not in INSTR:
        raise HTTPException(404, "Unknown ticker")
    TAPE.watch_tickers([ticker])
    payload = _enrich_research(st, ticker)
    payload["live"] = TAPE.snapshot()
    return payload


@router.get("/instruments")
def instruments():
    return [{"ticker": i.ticker, "name": i.name, "sleeve": i.sleeve} for i in UNIVERSE]


@router.get("/config")
def config_view():
    """Boss rules checklist + live editable rule controls for this desk."""
    from app.engine.rule_controls import public_rules_payload

    s = get_settings()
    st = get_state()
    labels = {
        "india": "India",
        "us": "US Market",
        "commodities": "Commodities",
        "bonds": "Bonds",
        "crypto": "Crypto",
    }
    live = public_rules_payload(st.sim)
    params = live["params"]
    flags = live["flags"]
    allocation = live.get("allocation") or s.allocation
    return {
        "starting_cash": s.starting_cash,
        "contribution": {
            "bull": params.get("contribution_bull", s.contribution_bull),
            "sideways": params.get("contribution_sideways", s.contribution_sideways),
            "bear": params.get("contribution_bear", s.contribution_bear),
        },
        "friday_cap": params.get("friday_contribution_cap", s.friday_contribution_cap),
        "reserve_pct": params.get("cash_reserve_pct", s.cash_reserve_pct),
        "hold_days": int(params.get("hold_days", s.hold_days)),
        "cooldown_days": int(params.get("cooldown_days", s.cooldown_days)),
        "max_position_pct": params.get("max_position_pct", s.max_position_pct),
        "trim_to_pct": params.get("trim_to_pct", s.trim_to_pct),
        "max_subsector_names": int(params.get("max_subsector_names", s.max_subsector_names)),
        "max_sector_pct": params.get("max_sector_pct", s.max_sector_pct),
        "drawdown": {
            "t1": params.get("drawdown_t1", s.drawdown_t1),
            "t2": params.get("drawdown_t2", s.drawdown_t2),
            "t3": params.get("drawdown_t3", s.drawdown_t3),
            "resume": params.get("drawdown_resume", s.drawdown_resume),
            "pause_t1_days": int(params.get("pause_t1_days", s.pause_t1_days)),
            "pause_t2_days": int(params.get("pause_t2_days", s.pause_t2_days)),
        },
        "stops": {
            "equity_atr": params.get("equity_atr_mult", s.equity_atr_mult),
            "crypto_atr": params.get("crypto_atr_mult", s.crypto_atr_mult),
        },
        "allocation": allocation,
        "allocation_labels": labels,
        "allocation_defaults": (live.get("defaults") or {}).get("allocation") or s.allocation,
        "scoring": s.score_weights,
        "suggestion_count": s.suggestion_count,
        "earnings_blackout_days": int(params.get("earnings_blackout_days", s.earnings_blackout_days)),
        "toggles": {
            "winner_rollover": flags.get("winner_rollover", False),
            "value_condition": flags.get("value_condition", False),
            "news_decay": flags.get("news_decay", False),
            "post_earnings_cooling": flags.get("post_earnings_cooling", False),
            "three_mode": flags.get("three_mode", False),
        },
        "rule_controls": live,
        "quality_checklist": live.get("quality_checklist") or [],
        "optional_toggles_note": "Optional toggles and core rules can be switched on this page.",
        "title": "SNS Investment Simulator — Rules Checklist v3.1",
        "live_enforced": [r["id"] for r in live["rules"] if r.get("enabled")],
        "source": RULES_SOURCE,
        "version": "3.1",
        "editable": True,
        "scoring_note": "Momentum 35% (1W 50% / 1M 30% / 3M 20%) · Volume 20% · News 15% · Earnings 15% · RS 15%. Bonds ranked by yield.",
    }


@router.post("/config/rules")
def config_rules_update(body: RulesUpdateBody):
    """Apply ON/OFF flags, parameter edits, sleeve allocation, and wording — used by subsequent suggestions and gates."""
    from app.engine.rule_controls import public_rules_payload

    if (
        body.flags is None
        and body.params is None
        and body.allocation is None
        and body.copy is None
        and not body.reset_copy
    ):
        raise HTTPException(400, "Provide flags, params, allocation, and/or copy")
    st = get_state()
    st.sim.apply_rule_controls(
        flags=body.flags,
        params=body.params,
        allocation=body.allocation,
        copy=body.copy,
        reset_copy=bool(body.reset_copy),
    )
    st.save()
    return {"ok": True, "rule_controls": public_rules_payload(st.sim)}


@router.get("/calendar")
def calendar():
    st, view, readonly = _view(None)
    return _clock_meta(st, view, readonly)


@router.get("/history/range")
def history_range(
    from_date: str = Query(..., alias="from"),
    to_date: str = Query(..., alias="to"),
):
    """Read-only slice of live book history between From and To (inclusive)."""
    try:
        start = date.fromisoformat(from_date)
        end = date.fromisoformat(to_date)
    except ValueError as e:
        raise HTTPException(400, "Use YYYY-MM-DD for from/to") from e
    if end < start:
        raise HTTPException(400, "To date must be on or after From date")
    st = get_state()
    sim = st.sim
    pack = _pnl_pack(sim)
    days = [d for d in (pack.get("days") or []) if start.isoformat() <= d["date"] <= end.isoformat()]
    trades = [
        {
            "date": t.date.isoformat(),
            "ticker": t.ticker,
            "side": t.side,
            "qty": round(t.qty, 6),
            "price": _inr(t.price),
            "amount": _inr(t.amount),
            "reason": t.reason,
            "pnl": _inr(t.pnl),
        }
        for t in sim.trades
        if start <= t.date <= end
    ]
    sum_pnl = sum(float(d.get("pnl") or 0) for d in days)
    first_w = float(days[0]["wealth"]) if days else 0.0
    last_w = float(days[-1]["wealth"]) if days else 0.0
    return {
        "from": start.isoformat(),
        "to": end.isoformat(),
        "sessions": len(days),
        "sum_pnl": _inr(sum_pnl),
        "wealth_start": _inr(first_w),
        "wealth_end": _inr(last_w),
        "days": days,
        "trades": trades,
        "curve": [{"date": d["date"], "wealth": d.get("wealth"), "book": d.get("book"), "pnl": d.get("pnl")} for d in days],
        "note": "Live ledger slice only — not a strategy re-run.",
    }


@router.get("/strategies")
def strategies_list():
    """Investment algorithms — user picks by mindset; used by live Trade + Backtest."""
    from app.engine.strategies import DEFAULT_STRATEGY, get_strategy, list_strategies

    st = get_state()
    active = getattr(st, "strategy_id", None) or DEFAULT_STRATEGY
    try:
        active = get_strategy(active).id
    except ValueError:
        active = DEFAULT_STRATEGY
    cur = get_strategy(active)
    return {
        "default": DEFAULT_STRATEGY,
        "active": active,
        "active_name": cur.name,
        "active_mindset": cur.mindset,
        "note": "Changing strategy updates Trade picks and invest split. Compare on Backtest first if unsure.",
        "strategies": list_strategies(active),
    }


class StrategyBody(BaseModel):
    strategy: str = Field(..., min_length=2, max_length=40)


@router.post("/strategies")
def strategies_set(body: StrategyBody):
    """Set the live algorithm for this user (persisted on their book)."""
    from app.engine.strategies import get_strategy, list_strategies

    st = get_state()
    try:
        sid = st.set_strategy(body.strategy)
    except ValueError as e:
        raise HTTPException(400, str(e)) from e
    cur = get_strategy(sid)
    return {
        "ok": True,
        "active": sid,
        "active_name": cur.name,
        "active_mindset": cur.mindset,
        "strategies": list_strategies(sid),
        "note": f"Live Trade now uses {cur.name}. Ideas refresh on next load.",
    }


@router.post("/backtest")
def backtest_run(body: BacktestBody):
    """Paper strategy replay over From→To. Never mutates the live portfolio."""
    from app.engine.backtest import run_backtest

    try:
        start = date.fromisoformat(body.start)
        end = date.fromisoformat(body.end)
    except ValueError as e:
        raise HTTPException(400, "Use YYYY-MM-DD for start/end") from e
    try:
        result = run_backtest(
            start=start,
            end=end,
            starting_cash=body.starting_cash,
            strategy=body.strategy,
        )
    except ValueError as e:
        raise HTTPException(400, str(e)) from e
    except Exception as e:
        raise HTTPException(500, f"Backtest failed: {e}") from e
    return result


@router.post("/backtest/compare")
def backtest_compare(body: BacktestBody):
    """Run 3–5 algorithms in parallel on the same window; rank by overall return."""
    from app.engine.backtest import compare_backtests

    try:
        start = date.fromisoformat(body.start)
        end = date.fromisoformat(body.end)
    except ValueError as e:
        raise HTTPException(400, "Use YYYY-MM-DD for start/end") from e
    try:
        return compare_backtests(
            start=start,
            end=end,
            starting_cash=body.starting_cash,
            strategies=body.strategies,
        )
    except ValueError as e:
        raise HTTPException(400, str(e)) from e
    except Exception as e:
        raise HTTPException(500, f"Compare failed: {e}") from e


@router.post("/sim/next")
def sim_next():
    raise HTTPException(
        400,
        "The desk runs on today's real date. Open a previous date to review — closed sessions cannot be changed.",
    )


@router.post("/sim/run")
def sim_run(body: RunBody):
    raise HTTPException(
        400,
        "The desk runs on today's real date. Past sessions are read-only.",
    )


@router.post("/sim/reset")
def sim_reset():
    st = get_state()
    st.reset(st.toggles)
    return {"ok": True, "date": st.sim._date().isoformat()}


@router.post("/sim/reset-day")
def sim_reset_day(body: ResetDayBody):
    """Clear trades and session history from a past (or today) date onward, then rebuild live book."""
    try:
        day = date.fromisoformat(body.date)
    except ValueError as e:
        raise HTTPException(400, "Invalid date") from e
    if day > date.today():
        raise HTTPException(400, "Cannot reset a future date")
    st = get_state()
    try:
        result = st.reset_from(day)
    except ValueError as e:
        raise HTTPException(400, str(e)) from e
    return {"ok": True, **result}


def _report_as_of(as_of: Optional[str]) -> date:
    """Default = live session (overall book). Pass a date or 'yesterday' for prior session."""
    today = date.today()
    if not as_of or as_of in ("overall", "live", "today"):
        return last_session_date(today)
    if as_of in ("yesterday", "prior", "previous"):
        return previous_session_date(today)
    try:
        d = date.fromisoformat(as_of)
    except ValueError as e:
        raise HTTPException(400, "Invalid as_of date") from e
    if d > today:
        raise HTTPException(400, "Cannot report a future date")
    return last_session_date(d)


def _report_payload(as_of: date) -> dict:
    st = get_state()
    sim = st.sim
    live_session = last_session_date(date.today())
    is_live = as_of >= live_session
    book = sim.replay_until(as_of)
    pnl = _pnl_pack(sim, as_of=None if is_live else as_of)
    if is_live:
        pnl = _apply_book_override(st, pnl)
    holdings = book.get("holdings") or []
    # One consistent capital basis: replay for closed dates, live pnl pack for today
    if is_live:
        book_val = float(pnl.get("book") or 0)
        cash_val = float(pnl.get("cash") or 0)
        sav_val = float(pnl.get("savings") or 0)
        wealth_val = float(pnl.get("wealth") or 0)
        contrib_val = float(pnl.get("contributed") or 0)
        overall_val = float(pnl.get("overall") or (wealth_val - contrib_val))
    else:
        book_val = max((book.get("mtm") or 0) - (book.get("cash") or 0), 0)
        cash_val = float(book.get("cash") or 0)
        sav_val = float(book.get("savings") or 0)
        wealth_val = float(book.get("wealth") or (book_val + cash_val + sav_val))
        contrib_val = float(book.get("contributed") or 0)
        overall_val = wealth_val - contrib_val
    # Sleeve mix from holdings at as_of
    sleeve_vals: dict = {}
    for h in holdings:
        sleeve_vals[h.get("sleeve") or "other"] = sleeve_vals.get(h.get("sleeve") or "other", 0.0) + float(h.get("market_value") or 0)
    total_book = sum(sleeve_vals.values()) or 1.0
    allocation = [
        {
            "asset": k,
            "label": ASSET_LABELS.get(k, k),
            "value": _inr(v),
            "weight": round(v / total_book, 4),
        }
        for k, v in sleeve_vals.items()
    ]
    trades = [
        {
            "date": t.date.isoformat(),
            "side": t.side,
            "ticker": t.ticker,
            "qty": round(t.qty, 6),
            "price": _inr(t.price),
            "amount": _inr(t.amount),
            "reason": t.reason,
            "pnl": _inr(t.pnl),
        }
        for t in sim.trades
        if t.date <= as_of
    ]
    days = [d for d in (pnl.get("days") or []) if d["date"] <= as_of.isoformat()]
    session_pnl = days[-1]["pnl"] if days else 0
    return {
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "as_of": as_of.isoformat(),
        "title": f"SNS Capital overall report — through {as_of.isoformat()}",
        "summary": {
            "contributed": _inr(contrib_val),
            "book": _inr(book_val),
            "cash": _inr(cash_val),
            "savings": _inr(sav_val),
            "wealth": _inr(wealth_val),
            "overall": _inr(overall_val),
            "session_pnl": session_pnl,
            "past_pnl": pnl.get("past"),
            "combined_pnl": pnl.get("combined"),
            "last_7": pnl.get("last_7"),
            "winning_days": pnl.get("winning_days"),
            "day_count": pnl.get("day_count"),
            "best": pnl.get("best"),
            "worst": pnl.get("worst"),
            "n_holdings": len(holdings),
            "n_trades": len(trades),
        },
        "allocation": allocation,
        "holdings": holdings,
        "trades": trades,
        "days": days,
        "pnl_days": days,
        "pnl": pnl,
    }


def _report_csv(payload: dict) -> str:
    buf = io.StringIO()
    w = csv.writer(buf)
    s = payload["summary"]
    w.writerow(["SNS Capital desk report"])
    w.writerow(["As of", payload["as_of"]])
    w.writerow(["Generated", payload["generated_at"]])
    w.writerow([])
    w.writerow(["Summary"])
    for k, label in [
        ("contributed", "Capital put in"),
        ("wealth", "Net worth"),
        ("book", "Invested book"),
        ("cash", "Cash"),
        ("savings", "Savings"),
        ("overall", "Overall P/L (worth − capital)"),
        ("combined_pnl", "All sessions P/L (sum of daily)"),
        ("last_7", "Last 7 sessions P/L (sum)"),
        ("winning_days", "Winning sessions"),
        ("day_count", "Sessions counted"),
        ("n_holdings", "Open positions"),
    ]:
        w.writerow([label, s.get(k, "")])
    w.writerow([])
    w.writerow(["Holdings"])
    w.writerow(["Ticker", "Name", "Qty", "Avg cost", "Price", "Value", "P/L", "Sleeve"])
    for h in payload["holdings"]:
        w.writerow([
            h.get("ticker"), h.get("name"), h.get("qty"), h.get("avg_cost"),
            h.get("price"), h.get("market_value"), h.get("pnl"), h.get("sleeve"),
        ])
    w.writerow([])
    w.writerow(["Trades"])
    w.writerow(["Date", "Side", "Ticker", "Qty", "Price", "Amount", "Reason", "P/L"])
    for t in payload["trades"]:
        w.writerow([t["date"], t["side"], t["ticker"], t["qty"], t["price"], t["amount"], t["reason"], t["pnl"]])
    w.writerow([])
    w.writerow(["Daily history"])
    w.writerow(["Date", "Wealth", "Book", "Cash", "Savings", "Session P/L", "Deployed", "Activity"])
    for d in payload["pnl_days"]:
        w.writerow([
            d.get("date"), d.get("wealth"), d.get("book"), d.get("cash"), d.get("savings"),
            d.get("pnl"), d.get("deployed"), d.get("activity"),
        ])
    return buf.getvalue()


def _report_html(payload: dict) -> str:
    s = payload["summary"]
    alloc = payload.get("allocation") or []
    holds_list = payload.get("holdings") or []
    trades_list = payload.get("trades") or []
    days_list = payload.get("pnl_days") or []

    def money(v):
        try:
            n = float(v or 0)
        except (TypeError, ValueError):
            return "—"
        sign = "−" if n < 0 else ""
        return f"{sign}₹{abs(n):,.2f}"

    def money_cls(v):
        try:
            n = float(v or 0)
        except (TypeError, ValueError):
            return "neu"
        if n > 0:
            return "pos"
        if n < 0:
            return "neg"
        return "neu"

    def hx(v):
        return (
            str(v if v is not None else "")
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
        )

    def pct(v):
        try:
            return f"{float(v or 0) * 100:.1f}%"
        except (TypeError, ValueError):
            return "—"

    win = int(s.get("winning_days") or 0)
    days_n = int(s.get("day_count") or 0)
    win_rate = f"{(win / days_n * 100):.0f}%" if days_n else "—"
    best = s.get("best") or {}
    worst = s.get("worst") or {}

    alloc_rows = "".join(
        f"<tr><td>{hx(a.get('label') or a.get('asset'))}</td>"
        f"<td class='r'>{money(a.get('value'))}</td>"
        f"<td class='r'>{pct(a.get('weight'))}</td>"
        f"<td><div class='bar'><i style='width:{min(float(a.get('weight') or 0)*100,100):.1f}%'></i></div></td></tr>"
        for a in alloc
    ) or "<tr><td colspan='4'>No invested sleeves</td></tr>"

    holds = "".join(
        f"<tr>"
        f"<td class='mono'><strong>{hx(h.get('ticker'))}</strong></td>"
        f"<td>{hx(h.get('name'))}</td>"
        f"<td>{hx(h.get('sleeve'))}</td>"
        f"<td class='r'>{hx(h.get('qty'))}</td>"
        f"<td class='r'>{money(h.get('avg_cost'))}</td>"
        f"<td class='r'>{money(h.get('price'))}</td>"
        f"<td class='r'>{money(h.get('market_value'))}</td>"
        f"<td class='r {money_cls(h.get('pnl'))}'>{money(h.get('pnl'))}</td>"
        f"</tr>"
        for h in holds_list
    ) or "<tr><td colspan='8'>No open positions as of report date</td></tr>"

    trades = "".join(
        f"<tr>"
        f"<td>{hx(t['date'])}</td>"
        f"<td class='side-{hx(t['side'])}'>{hx(t['side']).upper()}</td>"
        f"<td class='mono'><strong>{hx(t['ticker'])}</strong></td>"
        f"<td class='r'>{hx(t['qty'])}</td>"
        f"<td class='r'>{money(t['price'])}</td>"
        f"<td class='r'>{money(t['amount'])}</td>"
        f"<td class='r {money_cls(t.get('pnl'))}'>{money(t.get('pnl'))}</td>"
        f"<td>{hx(t.get('reason') or '—')}</td>"
        f"</tr>"
        for t in trades_list
    ) or "<tr><td colspan='8'>No trades through this date</td></tr>"

    days = "".join(
        f"<tr>"
        f"<td>{hx(d.get('date'))}</td>"
        f"<td><span class='tag tag-{hx(d.get('activity') or 'idle')}'>{hx(d.get('activity') or '—')}</span></td>"
        f"<td class='r'>{money(d.get('wealth'))}</td>"
        f"<td class='r'>{money(d.get('book'))}</td>"
        f"<td class='r'>{money(d.get('cash'))}</td>"
        f"<td class='r'>{money(d.get('deployed'))}</td>"
        f"<td class='r {money_cls(d.get('pnl'))}'>{money(d.get('pnl'))}</td>"
        f"</tr>"
        for d in days_list
    ) or "<tr><td colspan='7'>No session history</td></tr>"

    return f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>{hx(payload['title'])}</title>
<style>
  :root {{
    --ink: #142033;
    --muted: #5b6577;
    --line: #d9dee7;
    --paper: #ffffff;
    --wash: #f4f6fa;
    --brand: #1f4f8a;
    --gain: #0f7a4a;
    --loss: #b42318;
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0;
    color: var(--ink);
    background: #e8edf4;
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    font-size: 13px;
    line-height: 1.45;
  }}
  .sheet {{
    max-width: 980px;
    margin: 24px auto;
    background: var(--paper);
    box-shadow: 0 8px 30px rgba(20,32,51,.08);
  }}
  .toolbar {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    background: var(--wash);
    border-bottom: 1px solid var(--line);
  }}
  .toolbar button {{
    border: 0;
    background: var(--brand);
    color: #fff;
    font-weight: 700;
    padding: 9px 14px;
    cursor: pointer;
  }}
  .toolbar span {{ color: var(--muted); font-size: 12px; }}
  .cover {{
    padding: 28px 32px 22px;
    border-bottom: 3px solid var(--brand);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
  }}
  .brand-mark {{
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }}
  .brand-mark i {{
    display: inline-flex;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    background: var(--brand);
    color: #fff;
    font-style: normal;
    font-weight: 800;
    font-size: 12px;
  }}
  .brand-mark strong {{ display: block; font-size: 15px; }}
  .brand-mark em {{ display: block; font-style: normal; color: var(--muted); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }}
  h1 {{ margin: 0 0 6px; font-size: 28px; letter-spacing: -.02em; }}
  .cover p {{ margin: 0; color: var(--muted); max-width: 52ch; }}
  .stamp {{
    text-align: right;
    border: 1px solid var(--line);
    padding: 12px 14px;
    background: var(--wash);
    min-width: 180px;
  }}
  .stamp b {{ display: block; font-size: 18px; font-family: Consolas, "Courier New", monospace; }}
  .stamp span {{ color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .06em; }}
  .body {{ padding: 22px 32px 32px; }}
  .sec {{ margin: 0 0 26px; }}
  .sec-hd {{
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    margin: 0 0 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--line);
  }}
  .sec-hd h2 {{
    margin: 0;
    font-size: 13px;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--brand);
  }}
  .sec-hd span {{ color: var(--muted); font-size: 11px; }}
  .kpis {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }}
  .kpi {{
    background: var(--wash);
    border: 1px solid var(--line);
    padding: 12px 14px;
  }}
  .kpi span {{
    display: block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }}
  .kpi strong {{
    display: block;
    font-size: 18px;
    font-family: Consolas, "Courier New", monospace;
    font-weight: 700;
  }}
  .kpi em {{
    display: block;
    margin-top: 3px;
    font-style: normal;
    font-size: 11px;
    color: var(--muted);
  }}
  table {{ width: 100%; border-collapse: collapse; }}
  th, td {{
    padding: 8px 6px;
    border-bottom: 1px solid var(--line);
    text-align: left;
    vertical-align: top;
  }}
  th {{
    font-size: 10px;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--muted);
    background: var(--wash);
  }}
  .r {{ text-align: right; font-family: Consolas, "Courier New", monospace; }}
  .mono {{ font-family: Consolas, "Courier New", monospace; }}
  .pos {{ color: var(--gain); font-weight: 700; }}
  .neg {{ color: var(--loss); font-weight: 700; }}
  .neu {{ color: var(--ink); }}
  .bar {{
    height: 7px;
    background: #e6ebf2;
    overflow: hidden;
  }}
  .bar i {{ display: block; height: 100%; background: var(--brand); }}
  .tag {{
    display: inline-block;
    padding: 2px 7px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .04em;
    border: 1px solid var(--line);
    background: var(--wash);
  }}
  .tag-invested {{ color: var(--gain); border-color: #b7e0c8; background: #eaf7f0; }}
  .tag-rules {{ color: #9a6700; border-color: #f0d48a; background: #fff7e6; }}
  .tag-idle {{ color: var(--muted); }}
  .side-buy {{ color: var(--gain); font-weight: 700; }}
  .side-sell, .side-trim {{ color: var(--loss); font-weight: 700; }}
  .notes {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }}
  .note {{
    border: 1px solid var(--line);
    background: var(--wash);
    padding: 12px 14px;
  }}
  .note span {{ display: block; font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); margin-bottom: 4px; }}
  .note strong {{ font-size: 14px; }}
  .foot {{
    margin-top: 8px;
    padding-top: 14px;
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: 11px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }}
  @media (max-width: 800px) {{
    .cover, .kpis, .notes {{ grid-template-columns: 1fr 1fr; }}
    .body, .cover {{ padding-left: 18px; padding-right: 18px; }}
  }}
  @media print {{
    body {{ background: #fff; }}
    .sheet {{ margin: 0; box-shadow: none; max-width: none; }}
    .toolbar {{ display: none !important; }}
    .sec {{ break-inside: avoid; }}
    th {{ background: #f4f6fa !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  }}
</style>
</head><body>
  <div class="sheet">
    <div class="toolbar no-print">
      <span>SNS Capital · internal desk report</span>
      <button type="button" onclick="window.print()">Print / Save as PDF</button>
    </div>

    <header class="cover">
      <div>
        <div class="brand-mark"><i>SNS</i><div><strong>SNS Capital</strong><em>Investment desk</em></div></div>
        <h1>Overall portfolio report</h1>
        <p>Full desk snapshot — capital, open risk, every trade, and session history through the report date. Ready for management review.</p>
      </div>
      <div class="stamp">
        <span>As of</span>
        <b>{hx(payload['as_of'])}</b>
        <span style="margin-top:8px;display:block">Generated</span>
        <b style="font-size:12px">{hx(payload['generated_at'])}</b>
      </div>
    </header>

    <div class="body">
      <section class="sec">
        <div class="sec-hd"><h2>1 · Executive summary</h2><span>Capital vs net worth</span></div>
        <div class="kpis">
          <div class="kpi"><span>Capital put in</span><strong>{money(s.get('contributed'))}</strong><em>Lifetime contributions</em></div>
          <div class="kpi"><span>Net worth</span><strong>{money(s.get('wealth'))}</strong><em>Book + cash + savings</em></div>
          <div class="kpi"><span>Overall P/L</span><strong class="{money_cls(s.get('overall'))}">{money(s.get('overall'))}</strong><em>Worth − capital in</em></div>
          <div class="kpi"><span>Open positions</span><strong>{hx(s.get('n_holdings', 0))}</strong><em>Names held</em></div>
        </div>
      </section>

      <section class="sec">
        <div class="sec-hd"><h2>2 · Capital structure</h2><span>Where money sits</span></div>
        <div class="kpis">
          <div class="kpi"><span>Invested book</span><strong>{money(s.get('book'))}</strong></div>
          <div class="kpi"><span>Cash</span><strong>{money(s.get('cash'))}</strong></div>
          <div class="kpi"><span>Locked savings</span><strong>{money(s.get('savings'))}</strong></div>
          <div class="kpi"><span>Last 7 sessions</span><strong class="{money_cls(s.get('last_7'))}">{money(s.get('last_7'))}</strong><em>Sum of recent session moves</em></div>
        </div>
      </section>

      <section class="sec">
        <div class="sec-hd"><h2>3 · Performance</h2><span>Win rate &amp; extremes</span></div>
        <div class="notes">
          <div class="note"><span>Win rate</span><strong>{win_rate}</strong> · {win} of {days_n} sessions up</div>
          <div class="note"><span>Combined session P/L</span><strong class="{money_cls(s.get('combined_pnl'))}">{money(s.get('combined_pnl'))}</strong></div>
          <div class="note"><span>Best session</span><strong class="{money_cls(best.get('pnl'))}">{hx(best.get('date') or '—')} · {money(best.get('pnl'))}</strong></div>
          <div class="note"><span>Worst session</span><strong class="{money_cls(worst.get('pnl'))}">{hx(worst.get('date') or '—')} · {money(worst.get('pnl'))}</strong></div>
        </div>
      </section>

      <section class="sec">
        <div class="sec-hd"><h2>4 · Sleeve allocation</h2><span>Share of invested book</span></div>
        <table>
          <thead><tr><th>Sleeve</th><th class="r">Value</th><th class="r">Weight</th><th>Mix</th></tr></thead>
          <tbody>{alloc_rows}</tbody>
        </table>
      </section>

      <section class="sec">
        <div class="sec-hd"><h2>5 · Open holdings</h2><span>{len(holds_list)} position{"s" if len(holds_list) != 1 else ""}</span></div>
        <table>
          <thead>
            <tr>
              <th>Ticker</th><th>Name</th><th>Sleeve</th><th class="r">Qty</th>
              <th class="r">Avg cost</th><th class="r">Price</th><th class="r">Value</th><th class="r">Open P/L</th>
            </tr>
          </thead>
          <tbody>{holds}</tbody>
        </table>
      </section>

      <section class="sec">
        <div class="sec-hd"><h2>6 · Trade blotter</h2><span>All {len(trades_list)} fills</span></div>
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Side</th><th>Ticker</th><th class="r">Qty</th>
              <th class="r">Price</th><th class="r">Amount</th><th class="r">P/L</th><th>Reason</th>
            </tr>
          </thead>
          <tbody>{trades}</tbody>
        </table>
      </section>

      <section class="sec">
        <div class="sec-hd"><h2>7 · Session ledger</h2><span>All {len(days_list)} sessions</span></div>
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Activity</th><th class="r">Wealth</th><th class="r">Book</th>
              <th class="r">Cash</th><th class="r">Deployed</th><th class="r">Session P/L</th>
            </tr>
          </thead>
          <tbody>{days}</tbody>
        </table>
      </section>

      <div class="foot">
        <span>Confidential · SNS Capital internal use</span>
        <span>Report cut-off {hx(payload['as_of'])}</span>
      </div>
    </div>
  </div>
</body></html>"""


def _report_pdf(payload: dict) -> bytes:
    """Generate a downloadable PDF overall report (no browser print needed)."""
    from fpdf import FPDF

    s = payload.get("summary") or {}
    holds = payload.get("holdings") or []
    trades = payload.get("trades") or []
    days = payload.get("pnl_days") or []
    alloc = payload.get("allocation") or []

    def money(v):
        try:
            n = float(v or 0)
        except (TypeError, ValueError):
            return "-"
        sign = "-" if n < 0 else ""
        return f"{sign}Rs {abs(n):,.2f}"

    def txt(v):
        """Helvetica is Latin-1 only — strip Unicode punctuation/currency."""
        import unicodedata

        s = str(v if v is not None else "-")
        for src, dst in (
            ("\u2014", "-"), ("\u2013", "-"), ("\u2212", "-"),  # em/en/minus
            ("\u20b9", "Rs "), ("\u2248", "~"), ("\u00b7", "-"),  # rupee/approx/middot
            ("\u2018", "'"), ("\u2019", "'"), ("\u201c", '"'), ("\u201d", '"'),
            ("\u00d7", "x"), ("\u2264", "<="), ("\u2265", ">="),
            ("\u2026", "..."), ("\u00a0", " "),
        ):
            s = s.replace(src, dst)
        # Drop anything Helvetica cannot encode (keeps ASCII/Latin-1 printable)
        s = unicodedata.normalize("NFKD", s)
        return "".join(ch if ord(ch) < 256 else "?" for ch in s)

    class ReportPDF(FPDF):
        def header(self):
            self.set_font("Helvetica", "B", 11)
            self.set_text_color(31, 79, 138)
            self.cell(0, 8, "SNS Capital  |  Overall portfolio report", ln=True)
            self.set_font("Helvetica", "", 8)
            self.set_text_color(90, 100, 120)
            self.cell(0, 5, f"As of {txt(payload.get('as_of'))}  -  Generated {txt(payload.get('generated_at'))}", ln=True)
            self.ln(2)
            self.set_draw_color(31, 79, 138)
            self.set_line_width(0.4)
            self.line(10, self.get_y(), 200, self.get_y())
            self.ln(4)

        def footer(self):
            self.set_y(-12)
            self.set_font("Helvetica", "", 8)
            self.set_text_color(120, 120, 120)
            self.cell(0, 8, f"Confidential - SNS Capital internal  -  Page {self.page_no()}/{{nb}}", align="C")

        def section(self, title):
            self.ln(2)
            self.set_font("Helvetica", "B", 10)
            self.set_text_color(31, 79, 138)
            self.cell(0, 7, title, ln=True)
            self.set_draw_color(200, 210, 220)
            self.line(10, self.get_y(), 200, self.get_y())
            self.ln(3)

        def kpi_row(self, items):
            w = 47
            x0 = self.get_x()
            y0 = self.get_y()
            for i, (label, value) in enumerate(items):
                x = x0 + i * (w + 1)
                self.set_xy(x, y0)
                self.set_fill_color(244, 246, 250)
                self.rect(x, y0, w, 16, "F")
                self.set_xy(x + 2, y0 + 2)
                self.set_font("Helvetica", "", 7)
                self.set_text_color(100, 110, 125)
                self.cell(w - 4, 4, txt(label))
                self.set_xy(x + 2, y0 + 7)
                self.set_font("Helvetica", "B", 10)
                self.set_text_color(20, 32, 51)
                self.cell(w - 4, 6, txt(value))
            self.set_y(y0 + 18)

        def table(self, headers, rows, widths):
            self.set_font("Helvetica", "B", 7)
            self.set_fill_color(244, 246, 250)
            self.set_text_color(90, 100, 120)
            for h, w in zip(headers, widths):
                self.cell(w, 6, txt(h), border=0, fill=True)
            self.ln()
            self.set_font("Helvetica", "", 7)
            self.set_text_color(20, 32, 51)
            for row in rows:
                if self.get_y() > 275:
                    self.add_page()
                    self.set_font("Helvetica", "B", 7)
                    self.set_fill_color(244, 246, 250)
                    self.set_text_color(90, 100, 120)
                    for h, w in zip(headers, widths):
                        self.cell(w, 6, txt(h), border=0, fill=True)
                    self.ln()
                    self.set_font("Helvetica", "", 7)
                    self.set_text_color(20, 32, 51)
                for cell, w in zip(row, widths):
                    self.cell(w, 5.5, txt(cell)[:42], border=0)
                self.ln()

    pdf = ReportPDF(orientation="P", unit="mm", format="A4")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.add_page()

    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(20, 32, 51)
    pdf.cell(0, 10, "Overall portfolio report", ln=True)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(90, 100, 120)
    pdf.multi_cell(0, 5, "Full desk snapshot for management review - capital, holdings, trades, and session history.")
    pdf.ln(2)

    pdf.section("1. Executive summary")
    pdf.kpi_row([
        ("Capital put in", money(s.get("contributed"))),
        ("Net worth", money(s.get("wealth"))),
        ("Overall P/L", money(s.get("overall"))),
        ("Open positions", str(s.get("n_holdings") or 0)),
    ])
    pdf.kpi_row([
        ("Invested book", money(s.get("book"))),
        ("Cash", money(s.get("cash"))),
        ("Savings", money(s.get("savings"))),
        ("Last 7 sessions", money(s.get("last_7"))),
    ])
    pdf.set_font("Helvetica", "", 8)
    pdf.set_text_color(90, 100, 120)
    pdf.multi_cell(
        0,
        4,
        txt(
            "Overall P/L = net worth minus capital put in. "
            "Last 7 = sum of session wealth changes (ex deposits) for the latest up to 7 sessions - not the same as Overall."
        ),
    )
    pdf.ln(2)

    win = int(s.get("winning_days") or 0)
    days_n = int(s.get("day_count") or 0)
    win_rate = f"{(win / days_n * 100):.0f}%" if days_n else "-"
    best = s.get("best") or {}
    worst = s.get("worst") or {}
    pdf.section("2. Performance")
    pdf.kpi_row([
        ("Win rate", f"{win_rate} ({win}/{days_n})"),
        ("Combined P/L", money(s.get("combined_pnl"))),
        ("Best session", f"{best.get('date') or '-'} {money(best.get('pnl'))}"),
        ("Worst session", f"{worst.get('date') or '-'} {money(worst.get('pnl'))}"),
    ])

    pdf.section("3. Sleeve allocation")
    if alloc:
        pdf.table(
            ["Sleeve", "Value", "Weight"],
            [[a.get("label") or a.get("asset"), money(a.get("value")), f"{float(a.get('weight') or 0)*100:.1f}%"] for a in alloc],
            [70, 60, 60],
        )
    else:
        pdf.set_font("Helvetica", "", 8)
        pdf.cell(0, 5, "No invested sleeves", ln=True)

    pdf.section(f"4. Open holdings ({len(holds)})")
    if holds:
        pdf.table(
            ["Ticker", "Name", "Sleeve", "Qty", "Value", "Open P/L"],
            [
                [
                    h.get("ticker"),
                    (h.get("name") or "")[:22],
                    h.get("sleeve"),
                    h.get("qty"),
                    money(h.get("market_value")),
                    money(h.get("pnl")),
                ]
                for h in holds
            ],
            [28, 48, 28, 22, 32, 32],
        )
    else:
        pdf.set_font("Helvetica", "", 8)
        pdf.cell(0, 5, "No open positions", ln=True)

    pdf.add_page()
    pdf.section(f"5. Trade blotter ({len(trades)} fills)")
    if trades:
        pdf.table(
            ["Date", "Side", "Ticker", "Amount", "Reason"],
            [
                [t.get("date"), (t.get("side") or "").upper(), t.get("ticker"), money(t.get("amount")), (t.get("reason") or "")[:28]]
                for t in trades
            ],
            [28, 18, 28, 36, 80],
        )
    else:
        pdf.set_font("Helvetica", "", 8)
        pdf.cell(0, 5, "No trades", ln=True)

    pdf.section(f"6. Session ledger ({len(days)} sessions)")
    if days:
        pdf.table(
            ["Date", "Activity", "Wealth", "Book", "Deployed", "Session P/L"],
            [
                [
                    d.get("date"),
                    d.get("activity"),
                    money(d.get("wealth")),
                    money(d.get("book")),
                    money(d.get("deployed")),
                    money(d.get("pnl")),
                ]
                for d in days
            ],
            [28, 28, 34, 34, 33, 33],
        )
    else:
        pdf.set_font("Helvetica", "", 8)
        pdf.cell(0, 5, "No session history", ln=True)

    out = pdf.output()
    if isinstance(out, (bytes, bytearray)):
        return bytes(out)
    return bytes(out)


@router.get("/report")
def desk_report(
    as_of: Optional[str] = Query(None, description="Report date: overall | yesterday | YYYY-MM-DD"),
    kind: str = Query("pdf", pattern="^(html|csv|json|pdf)$", description="pdf | html | csv | json"),
    format: Optional[str] = Query(None, description="Alias for kind"),
):
    """Boss-ready overall desk report. PDF downloads directly; HTML/CSV/JSON also available."""
    out = (format or kind or "pdf").lower().strip()
    if out not in ("html", "csv", "json", "pdf"):
        raise HTTPException(400, "kind must be pdf, html, csv, or json")
    cutoff = _report_as_of(as_of)
    payload = _report_payload(cutoff)
    stamp = cutoff.isoformat()
    if out == "json":
        return payload
    if out == "csv":
        body = _report_csv(payload)
        return Response(
            content=body,
            media_type="text/csv; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="sns-overall-report-{stamp}.csv"'},
        )
    if out == "pdf":
        try:
            pdf_bytes = _report_pdf(payload)
        except Exception as e:
            raise HTTPException(500, f"PDF generation failed: {e}") from e
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="sns-overall-report-{stamp}.pdf"'},
        )
    html = _report_html(payload)
    return HTMLResponse(
        content=html,
        headers={"Content-Disposition": f'inline; filename="sns-overall-report-{stamp}.html"'},
    )

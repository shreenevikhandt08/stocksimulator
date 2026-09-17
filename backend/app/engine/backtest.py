"""Safe paper backtest — never mutates the live portfolio."""
from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import date, timedelta
from typing import Any, Dict, List, Optional

from app.config import STARTING_CASH, get_settings
from app.data.generator import MarketBook
from app.engine.rules_gate import can_buy, filter_tickets
from app.engine.simulator import DaySnapshot, Simulator
from app.engine.strategies import DEFAULT_STRATEGY, get_strategy, list_strategies
from app.engine.suggestions import build_suggestions


def _weekdays(start: date, end: date) -> List[date]:
    out: List[date] = []
    d = start
    while d <= end:
        if d.weekday() < 5:
            out.append(d)
        d += timedelta(days=1)
    return out


def run_backtest(
    *,
    start: date,
    end: date,
    starting_cash: Optional[float] = None,
    max_sessions: int = 90,
    strategy: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Walk weekdays from ``start`` to ``end`` on a fresh Simulator clone.
    Uses historical bar closes only — no live Yahoo, no AppState.save().
    """
    if end < start:
        raise ValueError("To date must be on or after From date")
    sessions = _weekdays(start, end)
    if not sessions:
        raise ValueError("No weekday sessions in that range")
    if len(sessions) > max_sessions:
        raise ValueError(f"Range too long — max {max_sessions} sessions (got {len(sessions)})")

    strat = get_strategy(strategy or DEFAULT_STRATEGY)
    cash0 = float(starting_cash if starting_cash is not None else STARTING_CASH)
    book = MarketBook(end)
    start_idx = 0
    for j, x in enumerate(book.dates):
        if x <= sessions[0]:
            start_idx = j
        else:
            break
    sim = Simulator(book, start_idx=start_idx)
    sim.cash = cash0
    sim.total_contributed = cash0
    sim._prev_value = cash0
    sim.peak = cash0
    sim.history = []
    sim.trades = []
    sim.positions = {}
    sim.savings = 0.0

    s = get_settings()
    days_out: List[dict] = []
    fills_out: List[dict] = []

    class _FakeState:
        def __init__(self, simulator: Simulator, market_book: MarketBook, strategy_id: str):
            self.sim = simulator
            self.book = market_book
            self.skipped: set = set()
            self.recent_shown: dict = {}
            self.toggles = simulator.toggles
            self.strategy_id = strategy_id

    st = _FakeState(sim, book, strat.id)

    for day in sessions:
        sim.idx = sim.idx_as_of(day)
        if not sim.history or sim.history[-1].date != day:
            mtm = sim.mtm()
            sim.history.append(
                DaySnapshot(
                    date=day,
                    regime=sim.regime(),
                    budget=0.0,
                    deployed=0.0,
                    portfolio_value=mtm,
                    cash=sim.cash,
                    savings=sim.savings,
                    daily_pnl=0.0,
                    drawdown_pct=0.0,
                    reserve_pct=sim.cash / mtm if mtm else 0.0,
                    peak=sim.peak,
                )
            )
            sim._prev_value = mtm + sim.savings

        try:
            budget = float(sim.daily_budget())
            remain = float(sim.remaining_deploy_budget())
            spend = min(budget, remain)
            if spend >= 50 and not sim.buying_paused():
                picks = build_suggestions(
                    st, s.suggestion_count, for_display=False, buy_only=True, strategy=strat.id
                )
                buys = [p for p in picks if p.get("verdict") == "BUY"] or picks
                buys = [p for p in buys if can_buy(sim, p["ticker"], 100.0, enforce_reserve=False)[0]]
                if buys:
                    if strat.equal_weight:
                        weights = [1.0] * len(buys)
                    else:
                        weights = [max(float(p.get("score") or 1), 1.0) for p in buys]
                    wsum = sum(weights) or 1.0
                    tickets = []
                    for p, w in zip(buys, weights):
                        amt = spend * (w / wsum)
                        if amt >= 50:
                            tickets.append({"ticker": p["ticker"], "amount": round(amt, 2)})
                    tickets, _ = filter_tickets(sim, tickets, enforce_reserve=False)
                    if tickets:
                        need = sum(t["amount"] for t in tickets)
                        if need > sim.cash + 1e-6:
                            extra = min(need - sim.cash, float(sim.remaining_daily_budget()))
                            sim.cash += extra
                            sim.total_contributed += extra
                            sim._prev_value += extra
                            if sim.history and sim.history[-1].date == day:
                                sim.history[-1].budget = round(float(sim.history[-1].budget or 0) + extra, 2)
                        result = sim.apply_invest(min(need, sim.cash + 1), tickets, cap_contribution=True)
                        for f in result.get("fills") or []:
                            fills_out.append({"date": day.isoformat(), **f})
        except Exception:
            pass

        sim.refresh_live_snapshot()
        last = sim.history[-1]
        wealth = float(last.portfolio_value) + float(last.savings)
        book_val = max(float(last.portfolio_value) - float(last.cash), 0.0)
        days_out.append(
            {
                "date": day.isoformat(),
                "wealth": round(wealth, 2),
                "book": round(book_val, 2),
                "cash": round(float(last.cash), 2),
                "savings": round(float(last.savings), 2),
                "pnl": round(float(last.daily_pnl), 2),
                "deployed": round(float(last.deployed or 0), 2),
                "activity": "invested" if float(last.deployed or 0) > 0.5 else "idle",
                "buy_count": sum(1 for f in fills_out if f["date"] == day.isoformat()),
                "sell_count": 0,
            }
        )

    end_wealth = days_out[-1]["wealth"] if days_out else cash0
    sum_pnl = sum(d["pnl"] for d in days_out)
    ret_pct = ((end_wealth - float(sim.total_contributed)) / float(sim.total_contributed) * 100.0) if sim.total_contributed else 0.0
    return {
        "ok": True,
        "paper": True,
        "strategy": strat.id,
        "strategy_name": strat.name,
        "strategy_blurb": strat.blurb,
        "from": start.isoformat(),
        "to": end.isoformat(),
        "starting_cash": round(cash0, 2),
        "ending_wealth": round(end_wealth, 2),
        "overall": round(end_wealth - float(sim.total_contributed), 2),
        "return_pct": round(ret_pct, 2),
        "combined_pnl": round(sum_pnl, 2),
        "contributed": round(float(sim.total_contributed), 2),
        "sessions": len(days_out),
        "n_fills": len(fills_out),
        "n_holdings": len(sim.positions),
        "days": days_out,
        "trades": fills_out,
        "curve": [{"date": d["date"], "wealth": d["wealth"], "book": d["book"], "pnl": d["pnl"]} for d in days_out],
        "note": f"Paper run · {strat.name} — live portfolio was not changed.",
    }


def compare_backtests(
    *,
    start: date,
    end: date,
    starting_cash: Optional[float] = None,
    strategies: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """Run several algorithms on the same From→To window and rank by overall return."""
    ids = strategies or [s["id"] for s in list_strategies()]
    # validate early
    for sid in ids:
        get_strategy(sid)

    results: List[Dict[str, Any]] = []
    errors: List[dict] = []

    def _one(sid: str) -> Dict[str, Any]:
        return run_backtest(start=start, end=end, starting_cash=starting_cash, strategy=sid)

    # Parallel across strategies (each owns its own Simulator / MarketBook)
    with ThreadPoolExecutor(max_workers=min(5, len(ids))) as pool:
        futs = {pool.submit(_one, sid): sid for sid in ids}
        for fut in as_completed(futs):
            sid = futs[fut]
            try:
                results.append(fut.result())
            except Exception as e:
                errors.append({"strategy": sid, "error": str(e)})

    results.sort(key=lambda r: float(r.get("overall") or 0), reverse=True)
    for i, row in enumerate(results):
        row["rank"] = i + 1
        # Trim heavy payloads for compare table (keep curve for champion)
        if i > 0:
            row = {**row, "trades": (row.get("trades") or [])[:12], "days": row.get("days") or []}
            results[i] = row

    winner = results[0] if results else None
    return {
        "ok": True,
        "paper": True,
        "from": start.isoformat(),
        "to": end.isoformat(),
        "starting_cash": round(float(starting_cash if starting_cash is not None else STARTING_CASH), 2),
        "strategies": list_strategies(),
        "results": results,
        "errors": errors,
        "winner": {
            "strategy": winner["strategy"],
            "strategy_name": winner["strategy_name"],
            "overall": winner["overall"],
            "return_pct": winner.get("return_pct"),
            "ending_wealth": winner["ending_wealth"],
        }
        if winner
        else None,
        "note": "Parallel paper compare — live portfolio unchanged. Pick the winner before changing live Trade.",
    }

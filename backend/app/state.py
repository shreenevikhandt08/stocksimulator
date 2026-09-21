from __future__ import annotations

import json
import re
from datetime import date, timedelta
from pathlib import Path
from typing import Optional

from app.config import BACKEND_ROOT, TRADED_DAYS_ON_BOOT, Toggles, get_settings
from app.data.generator import MarketBook
from app.db import load_portfolio, mongo_ready, save_portfolio
from app.engine.simulator import Simulator
from app.user_context import get_user

PORTFOLIOS_DIR = BACKEND_ROOT / "data" / "portfolios"


def last_session_date(d: date) -> date:
    """Last weekday on or before d (Fri if weekend)."""
    if d.weekday() >= 5:
        return d - timedelta(days=d.weekday() - 4)
    return d


def previous_session_date(d: date) -> date:
    """Weekday session before the live session of d (Mon → Fri)."""
    session = last_session_date(d)
    prev = session - timedelta(days=1)
    while prev.weekday() >= 5:
        prev -= timedelta(days=1)
    return prev


class AppState:
    def __init__(self, user_id: str, store_path: Optional[Path] = None) -> None:
        self.user_id = user_id
        self.store_path = store_path or _portfolio_path(user_id)
        self.toggles = Toggles()
        payload = _read_store(self.user_id, self.store_path)
        saved_as_of = None
        if payload and payload.get("as_of"):
            try:
                saved_as_of = date.fromisoformat(payload["as_of"])
            except ValueError:
                saved_as_of = None
        self.as_of = last_session_date(saved_as_of or date.today())
        self.book = MarketBook(self.as_of)
        end = len(self.book.dates) - 1
        self.sim = Simulator(self.book, start_idx=end, toggles=self.toggles)
        self.skipped: set[str] = set()
        self.recent_shown: dict[str, str] = {}
        self.strategy_id: str = "multi_factor"
        self.book_override: Optional[float] = None
        self.book_override_date: Optional[str] = None
        if payload and payload.get("sim"):
            self.sim.load_state(payload["sim"])
            self.skipped = {t.upper() for t in payload.get("skipped") or []}
            self.recent_shown = {k.upper(): v for k, v in (payload.get("recent_shown") or {}).items()}
            raw_strat = str(payload.get("strategy_id") or "multi_factor").strip().lower()
            self.strategy_id = raw_strat or "multi_factor"
            if payload.get("book_override") is not None:
                try:
                    self.book_override = float(payload["book_override"])
                    self.book_override_date = payload.get("book_override_date")
                except (TypeError, ValueError):
                    self.book_override = None
                    self.book_override_date = None
        elif TRADED_DAYS_ON_BOOT:
            self.sim.run_days(TRADED_DAYS_ON_BOOT)
        self.sync_to_today()
        self.save()

    def sync_to_today(self) -> None:
        """Keep the live book on the real calendar. Never rewrite closed days."""
        today = date.today()
        session = last_session_date(today)
        if self.as_of != session:
            dumped = self.sim.dump_state()
            skipped = set(self.skipped)
            recent = dict(self.recent_shown)
            self.as_of = session
            self.book = MarketBook(self.as_of)
            end = len(self.book.dates) - 1
            self.sim = Simulator(self.book, start_idx=end, toggles=self.toggles)
            self.sim.load_state(dumped)
            self.skipped = skipped
            self.recent_shown = recent
            self.sim.pin_to_live_session()
            self.save()
            return
        self.sim.pin_to_live_session()

    def reset(self, toggles: Optional[Toggles] = None) -> None:
        if toggles:
            self.toggles = toggles
        self.as_of = last_session_date(date.today())
        self.book = MarketBook(self.as_of)
        end = len(self.book.dates) - 1
        self.sim = Simulator(self.book, start_idx=end, toggles=self.toggles)
        if TRADED_DAYS_ON_BOOT:
            self.sim.run_days(TRADED_DAYS_ON_BOOT)
        self.sim.pin_to_live_session()
        self.skipped = set()
        self.recent_shown = {}
        # Keep strategy_id across reset — it's a user preference, not session state
        self.book_override = None
        self.book_override_date = None
        self.save()

    def reset_from(self, day: date) -> dict:
        """Clear activity from ``day`` onward and rebuild today's live book."""
        today = date.today()
        if day > today:
            raise ValueError("Cannot reset a future date")
        result = self.sim.reset_from(day)
        self.book_override = None
        self.book_override_date = None
        # Drop skip marks tied to cleared days
        if day <= today:
            cutoff = day.isoformat()
            self.recent_shown = {k: v for k, v in self.recent_shown.items() if v < cutoff}
        self.save()
        return result

    def clear_stale_book_override(self) -> None:
        today = date.today().isoformat()
        if self.book_override_date and self.book_override_date != today:
            self.book_override = None
            self.book_override_date = None

    def set_book_override(self, value: Optional[float]) -> None:
        if value is None:
            self.book_override = None
            self.book_override_date = None
        else:
            self.book_override = float(value)
            self.book_override_date = date.today().isoformat()
        self.save()

    def set_strategy(self, strategy_id: str) -> str:
        from app.engine.strategies import get_strategy

        sid = get_strategy(strategy_id).id
        self.strategy_id = sid
        self.save()
        return sid

    def mark_suggestions_shown(self, tickers: list[str]) -> None:
        today = date.today().isoformat()
        for t in tickers:
            self.recent_shown[t.upper()] = today
        cutoff = (date.today() - timedelta(days=14)).isoformat()
        self.recent_shown = {k: v for k, v in self.recent_shown.items() if v >= cutoff}
        self.save()

    def save(self) -> None:
        blob = {
            "as_of": self.as_of.isoformat(),
            "skipped": sorted(self.skipped),
            "recent_shown": self.recent_shown,
            "strategy_id": self.strategy_id,
            "book_override": self.book_override,
            "book_override_date": self.book_override_date,
            "sim": self.sim.dump_state(),
        }
        if mongo_ready():
            save_portfolio(self.user_id, blob)
            return
        path = self.store_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(blob, indent=2), encoding="utf-8")


STATES: dict[str, AppState] = {}


def _safe_user_id(user_id: str) -> str:
    safe = re.sub(r"[^a-zA-Z0-9_-]", "", user_id)
    return safe or "user"


def _portfolio_path(user_id: str) -> Path:
    return PORTFOLIOS_DIR / f"{_safe_user_id(user_id)}.json"


def _read_store(user_id: str, path: Path) -> Optional[dict]:
    if mongo_ready():
        doc = load_portfolio(user_id)
        if doc:
            return doc
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


def get_state(user_id: Optional[str] = None) -> AppState:
    uid = user_id or get_user()
    if not uid:
        raise RuntimeError("Authentication required")
    global STATES
    if uid not in STATES:
        STATES[uid] = AppState(uid)
    STATES[uid].sync_to_today()
    STATES[uid].clear_stale_book_override()
    healed = False
    if STATES[uid].sim.heal_inflated_exits():
        healed = True
    if STATES[uid].sim.heal_session_pnl_if_inflated():
        healed = True
    # Apply hold / stop / trim / drawdown on the live calendar (step() is unused).
    from app.engine.rules_gate import maintain_live_rules

    notes = maintain_live_rules(STATES[uid].sim)
    if notes or healed:
        STATES[uid].save()
    return STATES[uid]

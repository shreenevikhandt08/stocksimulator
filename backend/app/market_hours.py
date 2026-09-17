"""India cash equity session clock (NSE regular hours, IST = UTC+5:30)."""
from __future__ import annotations

from datetime import date, datetime, time, timedelta, timezone
from typing import Optional

# Fixed IST — avoids requiring the tzdata package on Windows.
IST = timezone(timedelta(hours=5, minutes=30), name="IST")
DEFAULT_OPEN = time(9, 15)
DEFAULT_CLOSE = time(15, 30)


def _parse_hhmm(raw: str, fallback: time) -> time:
    try:
        hh, mm = str(raw).strip().split(":")[:2]
        return time(int(hh), int(mm))
    except (TypeError, ValueError):
        return fallback


def session_bounds(open_hhmm: str = "09:15", close_hhmm: str = "15:30") -> tuple[time, time]:
    return _parse_hhmm(open_hhmm, DEFAULT_OPEN), _parse_hhmm(close_hhmm, DEFAULT_CLOSE)


def now_ist(now: Optional[datetime] = None) -> datetime:
    if now is None:
        return datetime.now(IST)
    if now.tzinfo is None:
        return now.replace(tzinfo=IST)
    return now.astimezone(IST)


def market_clock(
    *,
    now: Optional[datetime] = None,
    open_hhmm: str = "09:15",
    close_hhmm: str = "15:30",
) -> dict:
    """Return live desk market status for India regular session."""
    local = now_ist(now)
    open_t, close_t = session_bounds(open_hhmm, close_hhmm)
    weekday = local.weekday() < 5
    t = local.time().replace(second=0, microsecond=0)
    open_label = open_t.strftime("%H:%M")
    close_label = close_t.strftime("%H:%M")

    if not weekday:
        status = "weekend"
        is_open = False
        note = (
            f"Markets are closed today ({local.strftime('%A')}). "
            f"Next regular session opens {open_label} IST Monday-Friday."
        )
    elif t < open_t:
        status = "preopen"
        is_open = False
        note = f"Pre-open — NSE cash session starts at {open_label} IST."
    elif t >= close_t:
        status = "closed"
        is_open = False
        note = (
            f"Markets closed for the day (session ended {close_label} IST). "
            f"Investing unlocks at {open_label} IST next open session."
        )
    else:
        status = "open"
        is_open = True
        note = f"NSE cash session live until {close_label} IST."

    return {
        "tz": "Asia/Kolkata",
        "open": open_label,
        "close": close_label,
        "open_time": open_label,
        "close_time": close_label,
        "local_time": local.strftime("%H:%M:%S"),
        "local_date": local.date().isoformat(),
        "weekday": weekday,
        "market_open": is_open,
        "market_status": status,
        "market_note": note,
        "is_trading_day": weekday,
    }


def is_market_open_now(
    *,
    now: Optional[datetime] = None,
    open_hhmm: str = "09:15",
    close_hhmm: str = "15:30",
) -> bool:
    return bool(market_clock(now=now, open_hhmm=open_hhmm, close_hhmm=close_hhmm)["market_open"])


def calendar_trading_day(d: Optional[date] = None) -> bool:
    day = d or date.today()
    return day.weekday() < 5

from __future__ import annotations

from contextvars import ContextVar
from typing import Optional

_current_user: ContextVar[Optional[str]] = ContextVar("current_user", default=None)


def set_user(user_id: Optional[str]) -> None:
    _current_user.set(user_id)


def get_user() -> Optional[str]:
    return _current_user.get()

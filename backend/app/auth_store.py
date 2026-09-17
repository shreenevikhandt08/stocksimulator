from __future__ import annotations

import hashlib
import json
import re
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

BACKEND_ROOT = Path(__file__).resolve().parents[1]
USERS_FILE = BACKEND_ROOT / "data" / "users.json"
SESSION_DAYS = 14

_SESSIONS: dict[str, tuple[str, datetime]] = {}


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _load_users() -> dict:
    if not USERS_FILE.exists():
        return {"users": []}
    try:
        return json.loads(USERS_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {"users": []}


def _save_users(data: dict) -> None:
    USERS_FILE.parent.mkdir(parents=True, exist_ok=True)
    USERS_FILE.write_text(json.dumps(data, indent=2), encoding="utf-8")


def _hash_password(password: str, salt: str) -> str:
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120_000)
    return digest.hex()


def _valid_email(email: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email))


def _valid_username(username: str) -> bool:
    return bool(re.match(r"^[a-zA-Z0-9._-]{3,32}$", username))


def signup(email: str, username: str, password: str, name: str = "") -> dict:
    email = email.strip().lower()
    username = username.strip()
    name = name.strip()
    if not _valid_email(email):
        raise ValueError("Enter a valid email address")
    if not _valid_username(username):
        raise ValueError("Username must be 3–32 characters (letters, numbers, . _ -)")
    if len(password) < 6:
        raise ValueError("Password must be at least 6 characters")

    data = _load_users()
    users = data.get("users") or []
    if any(u.get("email") == email for u in users):
        raise ValueError("Email already registered")
    if any(u.get("username") == username for u in users):
        raise ValueError("Username already taken")

    salt = secrets.token_hex(16)
    user = {
        "id": secrets.token_hex(8),
        "email": email,
        "username": username,
        "name": name or username,
        "salt": salt,
        "password_hash": _hash_password(password, salt),
        "created_at": _now().isoformat(),
    }
    users.append(user)
    data["users"] = users
    _save_users(data)
    token = _issue_token(user["id"])
    return {"token": token, "user": _public_user(user)}


def login(login_id: str, password: str) -> dict:
    login_id = login_id.strip()
    if not login_id or not password:
        raise ValueError("Email/username and password required")

    data = _load_users()
    users = data.get("users") or []
    key = login_id.lower() if "@" in login_id else login_id
    user = next(
        (u for u in users if u.get("email") == key or u.get("username") == login_id),
        None,
    )
    if not user:
        raise ValueError("Invalid email/username or password")
    if _hash_password(password, user["salt"]) != user.get("password_hash"):
        raise ValueError("Invalid email/username or password")

    token = _issue_token(user["id"])
    return {"token": token, "user": _public_user(user)}


def logout(token: str) -> None:
    if token:
        _SESSIONS.pop(token, None)


def resolve_token(token: str) -> Optional[str]:
    if not token:
        return None
    row = _SESSIONS.get(token)
    if not row:
        return None
    user_id, expires = row
    if expires < _now():
        _SESSIONS.pop(token, None)
        return None
    return user_id


def user_by_id(user_id: str) -> Optional[dict]:
    data = _load_users()
    return next((u for u in data.get("users") or [] if u.get("id") == user_id), None)


def _issue_token(user_id: str) -> str:
    token = secrets.token_urlsafe(32)
    _SESSIONS[token] = (user_id, _now() + timedelta(days=SESSION_DAYS))
    return token


def _public_user(user: dict) -> dict:
    return {
        "id": user["id"],
        "email": user["email"],
        "username": user["username"],
        "name": user.get("name") or user["username"],
    }

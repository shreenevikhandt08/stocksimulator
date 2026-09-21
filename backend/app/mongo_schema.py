"""Canonical MongoDB documents for SNS Capital.

Database: MONGO_DB (default sns_capital)

users
  user_id        str, unique     public account id
  email          str, unique     lowercase
  username       str, unique     lowercase
  name           str
  phone          str | omitted   10-digit IN mobile
  password       { algo, salt, hash, iterations }
  profile        { pan, aadhaar, dob, address_line, city, state, pincode }
  status         "active"
  created_at     datetime UTC
  updated_at     datetime UTC
  last_login_at  datetime UTC | omitted

sessions
  token_hash     str, unique     sha256 of bearer token
  user_id        str
  created_at     datetime UTC
  expires_at     datetime UTC    TTL index

portfolios
  user_id        str, unique
  as_of          str             YYYY-MM-DD
  strategy_id    str
  skipped        [str]
  recent_shown   { ticker: YYYY-MM-DD }
  book_override  float | null
  book_override_date str | null
  sim            object          simulator dump
  created_at     datetime UTC
  updated_at     datetime UTC
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

PASSWORD_ALGO = "pbkdf2_sha256"
PASSWORD_ITERATIONS = 120_000
SESSION_DAYS = 14


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def user_document(
    *,
    user_id: str,
    email: str,
    username: str,
    name: str,
    salt: str,
    password_hash: str,
    phone: str = "",
) -> dict[str, Any]:
    now = utcnow()
    doc: dict[str, Any] = {
        "user_id": user_id,
        "email": email,
        "username": username,
        "name": name,
        "password": {
            "algo": PASSWORD_ALGO,
            "iterations": PASSWORD_ITERATIONS,
            "salt": salt,
            "hash": password_hash,
        },
        "profile": {
            "dob": "",
            "address_line": "",
            "city": "",
            "state": "",
            "pincode": "",
        },
        "status": "active",
        "created_at": now,
        "updated_at": now,
    }
    if phone:
        doc["phone"] = phone
    return doc


def session_document(*, token_hash: str, user_id: str, expires_at: datetime) -> dict[str, Any]:
    return {
        "token_hash": token_hash,
        "user_id": user_id,
        "created_at": utcnow(),
        "expires_at": expires_at,
    }


def portfolio_document(user_id: str, blob: dict[str, Any]) -> dict[str, Any]:
    now = utcnow()
    return {
        "user_id": user_id,
        "as_of": blob.get("as_of"),
        "strategy_id": blob.get("strategy_id") or "multi_factor",
        "skipped": list(blob.get("skipped") or []),
        "recent_shown": dict(blob.get("recent_shown") or {}),
        "book_override": blob.get("book_override"),
        "book_override_date": blob.get("book_override_date"),
        "sim": blob.get("sim") or {},
        "updated_at": now,
    }

"""MongoDB access for accounts, sessions, and portfolios.

Requires MONGO_URI. Auth does not fall back to JSON files.
"""
from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any, Optional

from pymongo import ASCENDING, MongoClient, ReturnDocument
from pymongo.collection import Collection
from pymongo.errors import DuplicateKeyError, PyMongoError

from app.config import BACKEND_ROOT, get_settings
from app.mongo_schema import PASSWORD_ITERATIONS, portfolio_document, utcnow

log = logging.getLogger("sns.db")

_client: Optional[MongoClient] = None
_ready = False
_error = ""


def mongo_ready() -> bool:
    return _ready


def require_mongo() -> None:
    if not _ready:
        raise RuntimeError(_error or "MongoDB is not connected")


def mongo_status() -> dict:
    s = get_settings()
    out = {
        "ok": _ready,
        "db": s.mongo_db,
        "error": _error,
        "users": 0,
        "sessions": 0,
        "portfolios": 0,
        "collections": ["users", "sessions", "portfolios"],
    }
    if not _ready:
        return out
    try:
        db = _db()
        out["users"] = db.users.count_documents({})
        out["sessions"] = db.sessions.count_documents({})
        out["portfolios"] = db.portfolios.count_documents({})
    except PyMongoError as e:
        out["ok"] = False
        out["error"] = str(e)
    return out


def _db():
    s = get_settings()
    assert _client is not None
    return _client[s.mongo_db]


def users_col() -> Collection:
    return _db().users


def sessions_col() -> Collection:
    return _db().sessions


def portfolios_col() -> Collection:
    return _db().portfolios


def dup_message(exc: DuplicateKeyError) -> str:
    details = exc.details or {}
    key = " ".join((details.get("keyPattern") or details.get("keyValue") or {}).keys())
    blob = f"{key} {details.get('errmsg', '')} {exc}".lower()
    if "email" in blob:
        return "Email already registered"
    if "username" in blob:
        return "Username already taken"
    if "phone" in blob:
        return "Mobile number already registered on another account"
    if "pan" in blob:
        return "PAN already registered on another account"
    if "aadhaar" in blob:
        return "Aadhaar already registered on another account"
    return "That account detail is already registered"


def init_mongo() -> bool:
    global _client, _ready, _error
    s = get_settings()
    uri = (s.mongo_uri or "").strip()
    if not uri:
        _ready = False
        _error = "MONGO_URI is not set"
        log.error(_error)
        return False
    try:
        client = MongoClient(
            uri,
            serverSelectionTimeoutMS=8000,
            connectTimeoutMS=8000,
            tz_aware=True,
            retryWrites=True,
        )
        client.admin.command("ping")
        _client = client
        _ready = True
        _error = ""
        _ensure_indexes()
        migrate_legacy_accounts()
        log.info("Mongo connected db=%s", s.mongo_db)
        return True
    except Exception as e:
        _ready = False
        _error = str(e)
        log.error("Mongo unavailable: %s", e)
        return False


def close_mongo() -> None:
    global _client, _ready
    if _client is not None:
        _client.close()
    _client = None
    _ready = False


def _ensure_indexes() -> None:
    users = users_col()
    users.create_index([("user_id", ASCENDING)], unique=True, name="users_user_id_uq")
    users.create_index([("email", ASCENDING)], unique=True, name="users_email_uq")
    users.create_index([("username", ASCENDING)], unique=True, name="users_username_uq")
    users.create_index([("phone", ASCENDING)], unique=True, sparse=True, name="users_phone_uq")
    users.create_index([("profile.pan", ASCENDING)], unique=True, sparse=True, name="users_pan_uq")
    users.create_index([("profile.aadhaar", ASCENDING)], unique=True, sparse=True, name="users_aadhaar_uq")
    sessions_col().create_index([("token_hash", ASCENDING)], unique=True, name="sessions_token_uq")
    sessions_col().create_index([("user_id", ASCENDING)], name="sessions_user_id")
    sessions_col().create_index("expires_at", expireAfterSeconds=0, name="sessions_ttl")
    portfolios_col().create_index([("user_id", ASCENDING)], unique=True, name="portfolios_user_id_uq")


def _strip(doc: Optional[dict]) -> Optional[dict]:
    if not doc:
        return None
    out = dict(doc)
    out.pop("_id", None)
    return out


def find_user_by_id(user_id: str) -> Optional[dict]:
    require_mongo()
    return _strip(users_col().find_one({"user_id": user_id}))


def find_user_login(login_id: str) -> Optional[dict]:
    require_mongo()
    key = login_id.strip()
    if "@" in key:
        return _strip(users_col().find_one({"email": key.lower()}))
    return _strip(users_col().find_one({"username": key.lower()}))


def user_taken(field: str, value: str, exclude_id: str = "") -> bool:
    require_mongo()
    if not value:
        return False
    q: dict[str, Any] = {field: value}
    if exclude_id:
        q["user_id"] = {"$ne": exclude_id}
    return users_col().find_one(q, {"user_id": 1}) is not None


def insert_user(user: dict) -> None:
    require_mongo()
    users_col().insert_one(dict(user))


def replace_user(user_id: str, user: dict) -> None:
    require_mongo()
    payload = dict(user)
    payload.pop("_id", None)
    payload["user_id"] = user_id
    payload["updated_at"] = datetime.now(timezone.utc)
    users_col().replace_one({"user_id": user_id}, payload, upsert=False)


def touch_last_login(user_id: str) -> None:
    require_mongo()
    users_col().update_one(
        {"user_id": user_id},
        {"$set": {"last_login_at": datetime.now(timezone.utc)}},
    )


def save_session(token_hash: str, user_id: str, expires_at: datetime) -> None:
    require_mongo()
    from app.mongo_schema import session_document

    sessions_col().insert_one(session_document(token_hash=token_hash, user_id=user_id, expires_at=expires_at))


def get_session(token_hash: str) -> Optional[dict]:
    require_mongo()
    return _strip(sessions_col().find_one({"token_hash": token_hash}))


def delete_session(token_hash: str) -> None:
    require_mongo()
    if token_hash:
        sessions_col().delete_one({"token_hash": token_hash})


def load_portfolio(user_id: str) -> Optional[dict]:
    require_mongo()
    doc = _strip(portfolios_col().find_one({"user_id": user_id}))
    if not doc:
        return None
    doc.pop("user_id", None)
    doc.pop("created_at", None)
    doc.pop("updated_at", None)
    return doc


def save_portfolio(user_id: str, blob: dict) -> None:
    require_mongo()
    payload = portfolio_document(user_id, blob)
    existing = portfolios_col().find_one({"user_id": user_id}, {"created_at": 1})
    if existing and existing.get("created_at"):
        payload["created_at"] = existing["created_at"]
    else:
        payload["created_at"] = payload["updated_at"]
    portfolios_col().replace_one({"user_id": user_id}, payload, upsert=True)


def migrate_legacy_accounts() -> dict:
    """Copy local users.json + data/portfolios into Mongo. Never overwrites an existing email."""
    require_mongo()
    users_file = BACKEND_ROOT / "data" / "users.json"
    port_dir = BACKEND_ROOT / "data" / "portfolios"
    imported = 0
    skipped = 0
    books = 0
    if users_file.exists():
        try:
            payload = json.loads(users_file.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            payload = {}
        for raw in payload.get("users") or []:
            email = str(raw.get("email") or "").strip().lower()
            username = str(raw.get("username") or "").strip().lower()
            user_id = str(raw.get("id") or raw.get("user_id") or "").strip()
            if not email or not username or not user_id:
                skipped += 1
                continue
            if users_col().find_one({"$or": [{"email": email}, {"user_id": user_id}, {"username": username}]}):
                skipped += 1
            else:
                salt = raw.get("salt") or (raw.get("password") or {}).get("salt") or ""
                pw_hash = raw.get("password_hash") or (raw.get("password") or {}).get("hash") or ""
                doc: dict[str, Any] = {
                    "user_id": user_id,
                    "email": email,
                    "username": username,
                    "name": str(raw.get("name") or username),
                    "password": {
                        "algo": "pbkdf2_sha256",
                        "iterations": PASSWORD_ITERATIONS,
                        "salt": salt,
                        "hash": pw_hash,
                    },
                    "profile": {},
                    "status": "active",
                    "created_at": raw.get("created_at") or utcnow(),
                    "updated_at": utcnow(),
                }
                phone = str(raw.get("phone") or "").strip()
                if phone:
                    doc["phone"] = phone
                for key in ("pan", "aadhaar", "dob", "address_line", "city", "state", "pincode"):
                    val = str(raw.get(key) or "").strip()
                    if val:
                        doc["profile"][key] = val
                try:
                    insert_user(doc)
                    imported += 1
                except DuplicateKeyError:
                    skipped += 1

            book_path = port_dir / f"{user_id}.json"
            if book_path.exists() and not portfolios_col().find_one({"user_id": user_id}, {"user_id": 1}):
                try:
                    blob = json.loads(book_path.read_text(encoding="utf-8"))
                except (json.JSONDecodeError, OSError):
                    blob = None
                if isinstance(blob, dict):
                    save_portfolio(user_id, blob)
                    books += 1
    log.info("Legacy import users=%s skipped=%s portfolios=%s", imported, skipped, books)
    return {"imported": imported, "skipped": skipped, "portfolios": books}

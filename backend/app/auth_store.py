from __future__ import annotations

import hashlib
import hmac
import re
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from pymongo.errors import DuplicateKeyError

from app.db import (
    delete_session,
    dup_message,
    find_user_by_id,
    find_user_login,
    get_session,
    insert_user,
    mongo_ready,
    replace_user,
    require_mongo,
    save_session,
    touch_last_login,
    user_taken,
)
from app.mongo_schema import PASSWORD_ITERATIONS, SESSION_DAYS, user_document

_UNIQUE_PROFILE = ("pan", "aadhaar")


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _hash_password(password: str, salt: str, iterations: int = PASSWORD_ITERATIONS) -> str:
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), iterations)
    return digest.hex()


def _password_ok(user: dict, password: str) -> bool:
    block = user.get("password") or {}
    salt = block.get("salt") or user.get("salt") or ""
    expected = block.get("hash") or user.get("password_hash") or ""
    iterations = int(block.get("iterations") or PASSWORD_ITERATIONS)
    if not salt or not expected:
        return False
    got = _hash_password(password, salt, iterations)
    return hmac.compare_digest(got, expected)


def _valid_email(email: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email))


def _valid_username(username: str) -> bool:
    return bool(re.match(r"^[a-zA-Z0-9._-]{3,32}$", username))


def _valid_phone(phone: str) -> bool:
    return bool(re.match(r"^[6-9]\d{9}$", phone))


def _valid_pan(pan: str) -> bool:
    return bool(re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]$", pan))


def _valid_aadhaar(aadhaar: str) -> bool:
    return bool(re.match(r"^\d{12}$", aadhaar))


def _valid_pincode(pin: str) -> bool:
    return bool(re.match(r"^[1-9]\d{5}$", pin))


def _norm_phone(raw: str) -> str:
    digits = re.sub(r"\D+", "", str(raw or ""))
    if digits.startswith("91") and len(digits) == 12:
        digits = digits[2:]
    return digits


def _norm_aadhaar(raw: str) -> str:
    return re.sub(r"\D+", "", str(raw or ""))


def _norm_pan(raw: str) -> str:
    return re.sub(r"[^A-Za-z0-9]", "", str(raw or "")).upper()


def _ensure_db() -> None:
    if not mongo_ready():
        raise ValueError("Database is unavailable. Check MONGO_URI and restart the desk.")
    require_mongo()


def _clean_unique_fields(user: dict) -> dict:
    out = dict(user)
    if not str(out.get("phone") or "").strip():
        out.pop("phone", None)
    profile = dict(out.get("profile") or {})
    for key in _UNIQUE_PROFILE:
        if not str(profile.get(key) or "").strip():
            profile.pop(key, None)
    out["profile"] = profile
    return out


def signup(email: str, username: str, password: str, name: str = "", phone: str = "") -> dict:
    _ensure_db()
    email = email.strip().lower()
    username = username.strip().lower()
    name = name.strip()
    if not _valid_email(email):
        raise ValueError("Enter a valid email address")
    if not _valid_username(username):
        raise ValueError("Username must be 3–32 characters (letters, numbers, . _ -)")
    if len(password) < 6:
        raise ValueError("Password must be at least 6 characters")
    phone_n = _norm_phone(phone) if phone else ""
    if phone_n and not _valid_phone(phone_n):
        raise ValueError("Enter a valid 10-digit Indian mobile number")

    if user_taken("email", email):
        raise ValueError("Email already registered")
    if user_taken("username", username):
        raise ValueError("Username already taken")
    if phone_n and user_taken("phone", phone_n):
        raise ValueError("Mobile number already registered on another account")

    salt = secrets.token_hex(16)
    user_id = secrets.token_hex(8)
    user = user_document(
        user_id=user_id,
        email=email,
        username=username,
        name=name or username,
        salt=salt,
        password_hash=_hash_password(password, salt),
        phone=phone_n,
    )
    try:
        insert_user(_clean_unique_fields(user))
    except DuplicateKeyError as e:
        raise ValueError(dup_message(e)) from e

    token = _issue_token(user_id)
    return {"token": token, "user": _public_user(user)}


def login(login_id: str, password: str) -> dict:
    _ensure_db()
    login_id = login_id.strip()
    if not login_id or not password:
        raise ValueError("Email/username and password required")

    user = find_user_login(login_id)
    if not user or not _password_ok(user, password):
        raise ValueError("Invalid email/username or password")
    if user.get("status") and user.get("status") != "active":
        raise ValueError("This account is disabled")

    touch_last_login(user["user_id"])
    token = _issue_token(user["user_id"])
    return {"token": token, "user": _public_user(user)}


def logout(token: str) -> None:
    if not token or not mongo_ready():
        return
    delete_session(_hash_token(token))


def resolve_token(token: str) -> Optional[str]:
    if not token or not mongo_ready():
        return None
    row = get_session(_hash_token(token))
    if not row:
        return None
    expires = row.get("expires_at")
    if isinstance(expires, datetime):
        exp = expires if expires.tzinfo else expires.replace(tzinfo=timezone.utc)
        if exp < _now():
            delete_session(_hash_token(token))
            return None
    return str(row.get("user_id") or "") or None


def user_by_id(user_id: str) -> Optional[dict]:
    if not mongo_ready():
        return None
    return find_user_by_id(user_id)


def update_profile(
    user_id: str,
    *,
    name: Optional[str] = None,
    email: Optional[str] = None,
    username: Optional[str] = None,
    password: Optional[str] = None,
    phone: Optional[str] = None,
    pan: Optional[str] = None,
    aadhaar: Optional[str] = None,
    dob: Optional[str] = None,
    address_line: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    pincode: Optional[str] = None,
) -> dict:
    _ensure_db()
    user = find_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")
    profile = dict(user.get("profile") or {})

    if name is not None:
        user["name"] = str(name).strip() or user.get("username") or "User"

    if email is not None:
        email_n = str(email).strip().lower()
        if not _valid_email(email_n):
            raise ValueError("Enter a valid email address")
        if user_taken("email", email_n, user_id):
            raise ValueError("Email already registered")
        user["email"] = email_n

    if username is not None:
        username_n = str(username).strip().lower()
        if not _valid_username(username_n):
            raise ValueError("Username must be 3–32 characters (letters, numbers, . _ -)")
        if user_taken("username", username_n, user_id):
            raise ValueError("Username already taken")
        user["username"] = username_n

    if phone is not None:
        phone_n = _norm_phone(phone)
        if phone_n and not _valid_phone(phone_n):
            raise ValueError("Enter a valid 10-digit Indian mobile number")
        if phone_n and user_taken("phone", phone_n, user_id):
            raise ValueError("Mobile number already registered on another account")
        if phone_n:
            user["phone"] = phone_n
        else:
            user.pop("phone", None)

    if pan is not None:
        pan_n = _norm_pan(pan)
        if pan_n and not _valid_pan(pan_n):
            raise ValueError("Enter a valid PAN (e.g. ABCDE1234F)")
        if pan_n and user_taken("profile.pan", pan_n, user_id):
            raise ValueError("PAN already registered on another account")
        if pan_n:
            profile["pan"] = pan_n
        else:
            profile.pop("pan", None)

    if aadhaar is not None:
        aadhaar_n = _norm_aadhaar(aadhaar)
        if aadhaar_n and not _valid_aadhaar(aadhaar_n):
            raise ValueError("Enter a valid 12-digit Aadhaar number")
        if aadhaar_n and user_taken("profile.aadhaar", aadhaar_n, user_id):
            raise ValueError("Aadhaar already registered on another account")
        if aadhaar_n:
            profile["aadhaar"] = aadhaar_n
        else:
            profile.pop("aadhaar", None)

    if dob is not None:
        dob_n = str(dob).strip()
        if dob_n:
            try:
                datetime.fromisoformat(dob_n)
            except ValueError as e:
                raise ValueError("Date of birth must be YYYY-MM-DD") from e
            profile["dob"] = dob_n[:10]
        else:
            profile["dob"] = ""

    if address_line is not None:
        profile["address_line"] = str(address_line).strip()[:120]
    if city is not None:
        profile["city"] = str(city).strip()[:60]
    if state is not None:
        profile["state"] = str(state).strip()[:60]
    if pincode is not None:
        pin_n = re.sub(r"\D+", "", str(pincode or ""))
        if pin_n and not _valid_pincode(pin_n):
            raise ValueError("Enter a valid 6-digit PIN code")
        profile["pincode"] = pin_n

    if password is not None and str(password).strip():
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters")
        salt = secrets.token_hex(16)
        user["password"] = {
            "algo": "pbkdf2_sha256",
            "iterations": PASSWORD_ITERATIONS,
            "salt": salt,
            "hash": _hash_password(password, salt),
        }

    user["profile"] = profile
    user["updated_at"] = _now()
    try:
        replace_user(user_id, _clean_unique_fields(user))
    except DuplicateKeyError as e:
        raise ValueError(dup_message(e)) from e
    return _public_user(user)


def _issue_token(user_id: str) -> str:
    token = secrets.token_urlsafe(32)
    expires = _now() + timedelta(days=SESSION_DAYS)
    save_session(_hash_token(token), user_id, expires)
    return token


def _mask_aadhaar(aadhaar: str) -> str:
    digits = _norm_aadhaar(aadhaar)
    if len(digits) != 12:
        return ""
    return f"XXXX-XXXX-{digits[-4:]}"


def _public_user(user: dict) -> dict:
    profile = user.get("profile") or {}
    aadhaar = _norm_aadhaar(profile.get("aadhaar") or user.get("aadhaar") or "")
    return {
        "id": user.get("user_id") or user.get("id") or "",
        "email": user.get("email") or "",
        "username": user.get("username") or "",
        "name": user.get("name") or user.get("username") or "",
        "phone": user.get("phone") or "",
        "pan": profile.get("pan") or user.get("pan") or "",
        "aadhaar": aadhaar,
        "aadhaar_masked": _mask_aadhaar(aadhaar),
        "dob": profile.get("dob") or user.get("dob") or "",
        "address_line": profile.get("address_line") or user.get("address_line") or "",
        "city": profile.get("city") or user.get("city") or "",
        "state": profile.get("state") or user.get("state") or "",
        "pincode": profile.get("pincode") or user.get("pincode") or "",
    }

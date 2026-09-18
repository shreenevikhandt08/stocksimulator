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
    data = _load_users()
    users = data.get("users") or []
    idx = next((i for i, u in enumerate(users) if u.get("id") == user_id), None)
    if idx is None:
        raise ValueError("User not found")
    user = dict(users[idx])

    if name is not None:
        user["name"] = str(name).strip() or user.get("username") or "User"

    if email is not None:
        email_n = str(email).strip().lower()
        if not _valid_email(email_n):
            raise ValueError("Enter a valid email address")
        if any(u.get("email") == email_n and u.get("id") != user_id for u in users):
            raise ValueError("Email already registered")
        user["email"] = email_n

    if username is not None:
        username_n = str(username).strip()
        if not _valid_username(username_n):
            raise ValueError("Username must be 3–32 characters (letters, numbers, . _ -)")
        if any(u.get("username") == username_n and u.get("id") != user_id for u in users):
            raise ValueError("Username already taken")
        user["username"] = username_n

    if phone is not None:
        phone_n = _norm_phone(phone)
        if phone_n and not _valid_phone(phone_n):
            raise ValueError("Enter a valid 10-digit Indian mobile number")
        user["phone"] = phone_n

    if pan is not None:
        pan_n = _norm_pan(pan)
        if pan_n and not _valid_pan(pan_n):
            raise ValueError("Enter a valid PAN (e.g. ABCDE1234F)")
        if pan_n and any(
            _norm_pan(u.get("pan") or "") == pan_n and u.get("id") != user_id for u in users
        ):
            raise ValueError("PAN already registered on another account")
        user["pan"] = pan_n

    if aadhaar is not None:
        aadhaar_n = _norm_aadhaar(aadhaar)
        if aadhaar_n and not _valid_aadhaar(aadhaar_n):
            raise ValueError("Enter a valid 12-digit Aadhaar number")
        if aadhaar_n and any(
            _norm_aadhaar(u.get("aadhaar") or "") == aadhaar_n and u.get("id") != user_id for u in users
        ):
            raise ValueError("Aadhaar already registered on another account")
        user["aadhaar"] = aadhaar_n

    if dob is not None:
        dob_n = str(dob).strip()
        if dob_n:
            try:
                datetime.fromisoformat(dob_n)
            except ValueError as e:
                raise ValueError("Date of birth must be YYYY-MM-DD") from e
            user["dob"] = dob_n[:10]
        else:
            user["dob"] = ""

    if address_line is not None:
        user["address_line"] = str(address_line).strip()[:120]

    if city is not None:
        user["city"] = str(city).strip()[:60]

    if state is not None:
        user["state"] = str(state).strip()[:60]

    if pincode is not None:
        pin_n = re.sub(r"\D+", "", str(pincode or ""))
        if pin_n and not _valid_pincode(pin_n):
            raise ValueError("Enter a valid 6-digit PIN code")
        user["pincode"] = pin_n

    if password is not None and str(password).strip():
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters")
        salt = secrets.token_hex(16)
        user["salt"] = salt
        user["password_hash"] = _hash_password(password, salt)

    user["updated_at"] = _now().isoformat()
    users[idx] = user
    data["users"] = users
    _save_users(data)
    return _public_user(user)


def _issue_token(user_id: str) -> str:
    token = secrets.token_urlsafe(32)
    _SESSIONS[token] = (user_id, _now() + timedelta(days=SESSION_DAYS))
    return token


def _mask_aadhaar(aadhaar: str) -> str:
    digits = _norm_aadhaar(aadhaar)
    if len(digits) != 12:
        return ""
    return f"XXXX-XXXX-{digits[-4:]}"


def _public_user(user: dict) -> dict:
    aadhaar = _norm_aadhaar(user.get("aadhaar") or "")
    return {
        "id": user["id"],
        "email": user["email"],
        "username": user["username"],
        "name": user.get("name") or user["username"],
        "phone": user.get("phone") or "",
        "pan": user.get("pan") or "",
        "aadhaar": aadhaar,
        "aadhaar_masked": _mask_aadhaar(aadhaar),
        "dob": user.get("dob") or "",
        "address_line": user.get("address_line") or "",
        "city": user.get("city") or "",
        "state": user.get("state") or "",
        "pincode": user.get("pincode") or "",
    }

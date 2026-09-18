from __future__ import annotations

import json
import os
from functools import lru_cache
from pathlib import Path
from typing import Dict

from pydantic import BaseModel


BACKEND_ROOT = Path(__file__).resolve().parents[1]
RULES_FILE = BACKEND_ROOT / "config" / "rules.json"
APP_FILE = BACKEND_ROOT / "config" / "app.json"


class Settings(BaseModel):
    """Boss rules v3.1 from backend/config/rules.json plus app.json."""

    starting_cash: float = 10_000
    contribution_bull: float = 10_000
    contribution_sideways: float = 7_000
    contribution_bear: float = 3_000
    friday_contribution_cap: float = 5_000
    cash_reserve_pct: float = 0.05

    # India NSE cash session (Asia/Kolkata)
    market_tz: str = "Asia/Kolkata"
    market_open: str = "09:15"
    market_close: str = "15:30"

    hold_days: int = 30
    cooldown_days: int = 30
    atr_period: int = 14
    equity_atr_mult: float = 2.0
    crypto_atr_mult: float = 1.5

    max_position_pct: float = 0.10
    trim_to_pct: float = 0.08
    max_subsector_names: int = 3
    max_sector_pct: float = 0.40

    india_min: float = 0.30
    india_max: float = 0.45
    india_default: float = 0.35
    us_min: float = 0.15
    us_max: float = 0.25
    us_default: float = 0.20
    commodities_min: float = 0.10
    commodities_max: float = 0.25
    commodities_default: float = 0.15
    bonds_min: float = 0.05
    bonds_max: float = 0.20
    bonds_default: float = 0.10
    crypto_min: float = 0.05
    crypto_max: float = 0.10
    crypto_default: float = 0.07

    drawdown_t1: float = 0.10
    drawdown_t2: float = 0.15
    drawdown_t3: float = 0.20
    drawdown_resume: float = 0.07
    pause_t1_days: int = 3
    pause_t2_days: int = 7
    earnings_blackout_days: int = 5

    score_momentum: float = 0.35
    score_volume: float = 0.20
    score_news: float = 0.15
    score_earnings: float = 0.15
    score_rs: float = 0.15
    mom_1w: float = 0.50
    mom_1m: float = 0.30
    mom_3m: float = 0.20

    suggestion_count: int = 20
    sim_history_days: int = 320
    traded_days_on_boot: int = 0

    toggle_winner_rollover: bool = False
    toggle_value_condition: bool = False
    toggle_news_decay: bool = False
    toggle_post_earnings_cooling: bool = False
    toggle_three_mode: bool = False
    post_earnings_cooling_days: int = 3
    winner_rollover_days: int = 15
    sentiment_halflife: int = 3

    live_data: bool = True
    live_poll_seconds: float = 3.0
    host: str = "127.0.0.1"
    port: int = 8000
    app_env: str = "development"
    cors_origins: str = (
        "http://127.0.0.1:8000,http://localhost:8000,"
        "http://127.0.0.1:5173,http://localhost:5173"
    )
    data_file: str = "data/portfolio.json"
    finnhub_api_key: str = ""
    alpha_vantage_api_key: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.app_env.strip().lower() in {"prod", "production"}

    @property
    def regime_budget(self) -> Dict[str, float]:
        return {
            "bull": self.contribution_bull,
            "sideways": self.contribution_sideways,
            "bear": self.contribution_bear,
        }

    @property
    def allocation(self) -> Dict[str, Dict[str, float]]:
        return {
            "india": {"min": self.india_min, "max": self.india_max, "default": self.india_default},
            "us": {"min": self.us_min, "max": self.us_max, "default": self.us_default},
            "commodities": {"min": self.commodities_min, "max": self.commodities_max, "default": self.commodities_default},
            "bonds": {"min": self.bonds_min, "max": self.bonds_max, "default": self.bonds_default},
            "crypto": {"min": self.crypto_min, "max": self.crypto_max, "default": self.crypto_default},
        }

    @property
    def score_weights(self) -> Dict[str, float]:
        return {
            "momentum": self.score_momentum,
            "volume": self.score_volume,
            "news": self.score_news,
            "earnings": self.score_earnings,
            "rs": self.score_rs,
        }

    @property
    def mom_weights(self) -> Dict[str, float]:
        return {"1w": self.mom_1w, "1m": self.mom_1m, "3m": self.mom_3m}

    @property
    def store_path(self) -> Path:
        p = Path(self.data_file)
        return p if p.is_absolute() else BACKEND_ROOT / p


def _read_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def _parse_dotenv(path: Path) -> Dict[str, str]:
    out: Dict[str, str] = {}
    if not path.exists():
        return out
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip().strip('"').strip("'")
    return out


def _dotenv() -> dict:
    """Load root .env then backend/.env (backend wins on conflicts)."""
    root = BACKEND_ROOT.parent / ".env"
    return {**_parse_dotenv(root), **_parse_dotenv(BACKEND_ROOT / ".env")}


def _env_get(file_env: dict, *keys: str) -> str:
    for key in keys:
        raw = os.environ.get(key)
        if raw is not None and str(raw).strip() != "":
            return str(raw).strip()
        file_val = file_env.get(key)
        if file_val is not None and str(file_val).strip() != "":
            return str(file_val).strip()
    return ""


def _env_bool(raw: str, default: bool) -> bool:
    if not raw:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


@lru_cache
def get_settings() -> Settings:
    merged = {**_read_json(RULES_FILE), **_read_json(APP_FILE)}
    env = _dotenv()

    merged["finnhub_api_key"] = _env_get(env, "FINNHUB_API_KEY")
    merged["alpha_vantage_api_key"] = _env_get(env, "ALPHA_VANTAGE_API_KEY")

    app_env = _env_get(env, "APP_ENV", "ENVIRONMENT")
    if app_env:
        merged["app_env"] = app_env

    host = _env_get(env, "HOST")
    if host:
        merged["host"] = host

    # Platform PORT (Railway/Render/Heroku) overrides file + app.json
    port_raw = _env_get(env, "PORT")
    if port_raw:
        try:
            merged["port"] = int(port_raw)
        except ValueError:
            pass

    cors = _env_get(env, "CORS_ORIGINS")
    if cors:
        merged["cors_origins"] = cors

    live_raw = _env_get(env, "LIVE_DATA")
    if live_raw:
        merged["live_data"] = _env_bool(live_raw, True)

    poll_raw = _env_get(env, "LIVE_POLL_SECONDS")
    if poll_raw:
        try:
            merged["live_poll_seconds"] = float(poll_raw)
        except ValueError:
            pass

    data_file = _env_get(env, "DATA_FILE")
    if data_file:
        merged["data_file"] = data_file

    market_tz = _env_get(env, "MARKET_TZ")
    if market_tz:
        merged["market_tz"] = market_tz

    return Settings.model_validate(merged)


settings = get_settings()

STARTING_CASH = settings.starting_cash
INITIAL_CAPITAL = settings.starting_cash
REGIME_BUDGET = settings.regime_budget
FRIDAY_BUDGET_CAP = settings.friday_contribution_cap
CASH_RESERVE_PCT = settings.cash_reserve_pct
HOLD_DAYS = settings.hold_days
COOLDOWN_DAYS = settings.cooldown_days
ATR_PERIOD = settings.atr_period
EQUITY_ATR_MULT = settings.equity_atr_mult
CRYPTO_ATR_MULT = settings.crypto_atr_mult
MAX_POSITION_PCT = settings.max_position_pct
TRIM_TO_PCT = settings.trim_to_pct
MAX_SUBSECTOR_NAMES = settings.max_subsector_names
MAX_SECTOR_PCT = settings.max_sector_pct
ALLOCATION = settings.allocation
DRAWDOWN_T1 = settings.drawdown_t1
DRAWDOWN_T2 = settings.drawdown_t2
DRAWDOWN_T3 = settings.drawdown_t3
DRAWDOWN_RESUME = settings.drawdown_resume
PAUSE_T1_DAYS = settings.pause_t1_days
PAUSE_T2_DAYS = settings.pause_t2_days
EARNINGS_BLACKOUT_DAYS = settings.earnings_blackout_days
SCORE_WEIGHTS = settings.score_weights
MOM_WEIGHTS = settings.mom_weights
SUGGESTION_COUNT = settings.suggestion_count
SIM_HISTORY_DAYS = settings.sim_history_days
TRADED_DAYS_ON_BOOT = settings.traded_days_on_boot
POST_EARNINGS_COOLING_DAYS = settings.post_earnings_cooling_days
WINNER_ROLLOVER_DAYS = settings.winner_rollover_days
SENTIMENT_HALFLIFE = settings.sentiment_halflife
RISK_FREE = 0.0
RULES_SOURCE = "backend/config/rules.json"

ASSET_LABELS = {
    "india": "India",
    "us": "US Market",
    "commodities": "Commodities",
    "bonds": "Bonds",
    "crypto": "Crypto",
}


class Toggles:
    def __init__(self) -> None:
        s = get_settings()
        self.winner_rollover = s.toggle_winner_rollover
        self.value_condition = s.toggle_value_condition
        self.news_decay = s.toggle_news_decay
        self.post_earnings_cooling = s.toggle_post_earnings_cooling
        self.three_mode = s.toggle_three_mode

    def as_dict(self) -> Dict[str, bool]:
        return {
            "winner_rollover": self.winner_rollover,
            "value_condition": self.value_condition,
            "news_decay": self.news_decay,
            "post_earnings_cooling": self.post_earnings_cooling,
            "three_mode": self.three_mode,
        }

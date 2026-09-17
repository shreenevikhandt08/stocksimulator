"""Live market tape. Yahoo + CoinGecko by default; Finnhub when FINNHUB_API_KEY is set."""

from __future__ import annotations

import json
import ssl
import threading
import time
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set

from app.data.universe import UNIVERSE, by_ticker

INSTR = by_ticker()
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SNSCapital/3.1"
TIMEOUT = 8

GECKO_IDS = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
    "BNB": "binancecoin",
    "XRP": "ripple",
    "ADA": "cardano",
    "AVAX": "avalanche-2",
    "DOT": "polkadot",
    "MATIC": "matic-network",
    "LINK": "chainlink",
    "UNI": "uniswap",
    "ATOM": "cosmos",
    "LTC": "litecoin",
    "NEAR": "near",
    "APT": "aptos",
    "SUI": "sui",
    "TON": "the-open-network",
    "DOGE": "dogecoin",
    "ARB": "arbitrum",
    "OP": "optimism",
    "FIL": "filecoin",
    "AAVE": "aave",
    "MKR": "maker",
    "INJ": "injective-protocol",
    "RENDER": "render-token",
}

YAHOO_COMMODITY = {
    "GOLD": "GC=F",
    "SILVER": "SI=F",
    "CRUDE": "CL=F",
    "BRENT": "BZ=F",
    "COPPER": "HG=F",
    "NATGAS": "NG=F",
    "WHEAT": "ZW=F",
    "CORN": "ZC=F",
    "PALLADIUM": "PA=F",
    "PLATINUM": "PL=F",
    "COTTON": "CT=F",
    "SUGAR": "SB=F",
}

FINNHUB_CRYPTO = {
    "BTC": "BINANCE:BTCUSDT",
    "ETH": "BINANCE:ETHUSDT",
    "SOL": "BINANCE:SOLUSDT",
    "BNB": "BINANCE:BNBUSDT",
    "XRP": "BINANCE:XRPUSDT",
    "ADA": "BINANCE:ADAUSDT",
    "DOGE": "BINANCE:DOGEUSDT",
    "LINK": "BINANCE:LINKUSDT",
    "LTC": "BINANCE:LTCUSDT",
    "DOT": "BINANCE:DOTUSDT",
    "AVAX": "BINANCE:AVAXUSDT",
    "UNI": "BINANCE:UNIUSDT",
    "ATOM": "BINANCE:ATOMUSDT",
    "NEAR": "BINANCE:NEARUSDT",
    "APT": "BINANCE:APTUSDT",
    "ARB": "BINANCE:ARBUSDT",
    "OP": "BINANCE:OPUSDT",
    "FIL": "BINANCE:FILUSDT",
    "AAVE": "BINANCE:AAVEUSDT",
    "SUI": "BINANCE:SUIUSDT",
}


@dataclass
class Quote:
    ticker: str
    price: float
    prev: float = 0.0
    chg_pct: float = 0.0
    source: str = ""
    ts: float = 0.0
    native: float = 0.0
    currency: str = "INR"


@dataclass
class LiveTape:
    quotes: Dict[str, Quote] = field(default_factory=dict)
    watch: Set[str] = field(default_factory=set)
    usdinr: float = 83.0
    ok: bool = False
    source: str = "off"
    error: str = ""
    paused: bool = False
    paused_until: str = ""
    freeze_ts: float = 0.0
    _lock: threading.Lock = field(default_factory=threading.Lock)
    _stop: threading.Event = field(default_factory=threading.Event)
    _thread: Optional[threading.Thread] = None
    _cursor: int = 0
    _freeze_key: str = ""

    def last(self, ticker: str) -> Optional[float]:
        q = self.quotes.get(ticker)
        return q.price if q and q.price > 0 else None

    def snapshot(self) -> dict:
        with self._lock:
            return {
                "live": self.ok and not self.paused,
                "paused": self.paused,
                "paused_until": self.paused_until,
                "freeze_ts": self.freeze_ts,
                "source": self.source,
                "error": self.error,
                "usdinr": round(self.usdinr, 4),
                "server_ts": time.time(),
                "quotes": {
                    t: {
                        "price": round(q.price, 4),
                        "prev": round(q.prev, 4),
                        "chg_pct": round(q.chg_pct, 4),
                        "source": q.source,
                        "ts": q.ts,
                    }
                    for t, q in self.quotes.items()
                },
            }

    def watch_tickers(self, tickers: List[str]) -> None:
        with self._lock:
            for t in tickers:
                t = (t or "").upper()
                if t in INSTR:
                    self.watch.add(t)

    def _put(self, ticker: str, price: float, chg_pct: float, source: str, native: float = 0.0, currency: str = "INR") -> None:
        if price <= 0:
            return
        now = time.time()
        with self._lock:
            old = self.quotes.get(ticker)
            prev = old.price if old else price
            self.quotes[ticker] = Quote(
                ticker=ticker,
                price=price,
                prev=prev,
                chg_pct=chg_pct,
                source=source,
                ts=now,
                native=native or price,
                currency=currency,
            )
            self.ok = True
            self.error = ""

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._stop.clear()
        self._thread = threading.Thread(target=self._loop, name="live-tape", daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop.set()

    def _loop(self) -> None:
        from app.config import get_settings
        from app.market_hours import is_market_open_now

        while not self._stop.is_set():
            s = get_settings()
            if not s.live_data:
                self.source = "off"
                self.paused = False
                self._stop.wait(2)
                continue
            # Pause quote polling + timings outside NSE cash hours
            if not is_market_open_now(open_hhmm=s.market_open, close_hhmm=s.market_close):
                self._pause_at_session_close()
                self._stop.wait(30)
                continue
            if self.paused:
                self.paused = False
                self.paused_until = ""
                self.freeze_ts = 0.0
                self._freeze_key = ""
            try:
                self.refresh()
            except Exception as e:
                self.error = str(e)[:180]
                self.ok = False
            self._stop.wait(max(1.5, float(s.live_poll_seconds)))

    def _pause_at_session_close(self) -> None:
        """Stop live refreshes and freeze quote timestamps at today's close (or last Friday)."""
        from datetime import datetime, timedelta

        from app.config import get_settings
        from app.market_hours import IST, market_clock, now_ist, session_bounds

        s = get_settings()
        clock = market_clock(open_hhmm=s.market_open, close_hhmm=s.market_close)
        status = clock["market_status"]
        open_t, close_t = session_bounds(s.market_open, s.market_close)
        local = now_ist()
        if status == "closed":
            freeze_dt = datetime.combine(local.date(), close_t, tzinfo=IST)
            until = f"{clock['open']} IST next open session"
        elif status == "preopen":
            # Still before open — freeze at prior session close
            d = local.date() - timedelta(days=1)
            while d.weekday() >= 5:
                d -= timedelta(days=1)
            freeze_dt = datetime.combine(d, close_t, tzinfo=IST)
            until = f"{clock['open']} IST today"
        else:  # weekend
            d = local.date()
            while d.weekday() >= 5:
                d -= timedelta(days=1)
            freeze_dt = datetime.combine(d, close_t, tzinfo=IST)
            until = f"{clock['open']} IST Monday"
        freeze_ts = freeze_dt.timestamp()
        key = f"{status}:{freeze_dt.date().isoformat()}:{close_t.strftime('%H:%M')}"
        with self._lock:
            self.paused = True
            self.paused_until = until
            self.freeze_ts = freeze_ts
            self.source = "paused"
            if self._freeze_key != key:
                for q in self.quotes.values():
                    q.ts = freeze_ts
                self._freeze_key = key
            if self.quotes:
                self.ok = True
            self.error = ""

    def refresh(self) -> None:
        from app.config import get_settings
        from app.state import get_state

        s = get_settings()
        tickers = set(self.watch)
        try:
            st = get_state()
            tickers.update(st.sim.positions.keys())
        except Exception:
            pass
        if not tickers:
            tickers.update(["TCS", "RELIANCE", "HDFCBANK", "AAPL", "NVDA", "GOLD", "BTC", "ETH"])
        ordered = sorted(tickers)
        batch = ordered[self._cursor : self._cursor + 12]
        if len(batch) < 12:
            batch += ordered[: max(0, 12 - len(batch))]
        self._cursor = (self._cursor + 12) % max(len(ordered), 1)

        usdinr = _yahoo_last("USDINR=X") or self.usdinr
        if usdinr:
            self.usdinr = usdinr

        used = []
        av = (s.alpha_vantage_api_key or "").strip()
        crypto = [t for t in batch if INSTR.get(t) and INSTR[t].asset == "crypto"]
        stocks = [t for t in batch if INSTR.get(t) and INSTR[t].asset != "crypto"]
        if stocks or crypto:
            used.append("yahoo")
            try:
                self._refresh_yahoo(stocks + crypto, usdinr)
            except Exception as e:
                self.error = f"yahoo: {e}"[:180]
        if av:
            used.append("alphavantage")
            try:
                self._refresh_alphavantage(batch[:3], av, usdinr)
            except Exception as e:
                self.error = f"alphavantage: {e}"[:180]
        self.source = "+".join(dict.fromkeys(used)) or "none"
        # Only move the live book while NSE cash hours are open — after hours keep last session marks.
        self._apply_quotes_to_book()

    def _apply_quotes_to_book(self) -> None:
        from app.config import get_settings
        from app.market_hours import is_market_open_now
        from app.state import get_state

        s = get_settings()
        if not is_market_open_now(open_hhmm=s.market_open, close_hhmm=s.market_close):
            return
        try:
            st = get_state()
            idx = st.sim.idx
            with self._lock:
                items = list(self.quotes.items())
            bumped = False
            for t, q in items:
                if t not in st.book.series or q.price <= 0:
                    continue
                bar = st.book.series[t].bars[idx]
                old = float(bar.close or 0.0)
                if abs(q.price - old) <= 1e-9:
                    continue
                # Live feed often replaces the sim print — shift the session baseline by the
                # same MTM delta so today's P/L is not fake profit from the price swap.
                pos = st.sim.positions.get(t)
                if pos and old > 0:
                    st.sim._prev_value += (q.price - old) * pos.qty
                bar.close = q.price
                bar.high = max(bar.high, q.price)
                bar.low = min(bar.low, q.price) if bar.low > 0 else q.price
                bumped = True
            if bumped:
                st.sim.refresh_live_snapshot()
        except Exception:
            pass

    def _refresh_yahoo(self, tickers: List[str], usdinr: float) -> None:
        pairs = []
        for t in tickers:
            y = yahoo_symbol(t)
            if y:
                pairs.append((t, y))
        if not pairs:
            return
        payload = _yahoo_quotes([y for _, y in pairs])
        by_sym = {row.get("symbol"): row for row in payload}
        for t, y in pairs:
            row = by_sym.get(y)
            px = _num(row, "regularMarketPrice") if row else None
            if px is None:
                px = _yahoo_last(y)
            if not px:
                continue
            chg = _num(row, "regularMarketChangePercent") if row else 0.0
            inst = INSTR[t]
            inr_px = to_inr(t, inst.asset, px, usdinr)
            self._put(t, inr_px, chg or 0.0, "yahoo", px, "USD" if inst.asset != "india" else "INR")

    def _refresh_alphavantage(self, tickers: List[str], key: str, usdinr: float) -> None:
        for t in tickers:
            inst = INSTR.get(t)
            if not inst:
                continue
            if inst.asset == "crypto":
                url = "https://www.alphavantage.co/query?" + urllib.parse.urlencode(
                    {
                        "function": "CURRENCY_EXCHANGE_RATE",
                        "from_currency": t,
                        "to_currency": "INR",
                        "apikey": key,
                    }
                )
                data = _get_json(url)
                row = data.get("Realtime Currency Exchange Rate") or {}
                px = float(row.get("5. Exchange Rate") or 0)
                if px > 0:
                    self._put(t, px, 0.0, "alphavantage", px, "INR")
                continue
            if inst.asset == "india":
                symbol = f"{t}.BSE"
            elif inst.asset == "us":
                symbol = t
            else:
                continue
            url = "https://www.alphavantage.co/query?" + urllib.parse.urlencode(
                {"function": "GLOBAL_QUOTE", "symbol": symbol, "apikey": key}
            )
            data = _get_json(url)
            g = data.get("Global Quote") or {}
            px = float(g.get("05. price") or 0)
            if px <= 0:
                continue
            try:
                chg = float(str(g.get("10. change percent") or "0").replace("%", ""))
            except ValueError:
                chg = 0.0
            inr_px = to_inr(t, inst.asset, px, usdinr)
            self._put(t, inr_px, chg, "alphavantage", px, "USD" if inst.asset != "india" else "INR")

    def _refresh_gecko(self, tickers: List[str]) -> None:
        ids = [GECKO_IDS[t] for t in tickers if t in GECKO_IDS]
        if not ids:
            return
        url = (
            "https://api.coingecko.com/api/v3/simple/price?"
            + urllib.parse.urlencode({"ids": ",".join(ids), "vs_currencies": "inr", "include_24hr_change": "true"})
        )
        data = _get_json(url)
        inv = {v: k for k, v in GECKO_IDS.items()}
        for gid, row in (data or {}).items():
            t = inv.get(gid)
            if not t:
                continue
            px = float(row.get("inr") or 0)
            chg = float(row.get("inr_24h_change") or 0)
            self._put(t, px, chg, "coingecko", px, "INR")

    def _refresh_finnhub(self, tickers: List[str], key: str, usdinr: float) -> None:
        for t in tickers:
            inst = INSTR.get(t)
            if not inst:
                continue
            sym = finnhub_symbol(t)
            if not sym:
                continue
            url = f"https://finnhub.io/api/v1/quote?symbol={urllib.parse.quote(sym)}&token={urllib.parse.quote(key)}"
            data = _get_json(url)
            px = float((data or {}).get("c") or 0)
            pc = float((data or {}).get("pc") or 0)
            if px <= 0:
                continue
            chg = ((px / pc) - 1) * 100 if pc else 0.0
            inr_px = to_inr(t, inst.asset, px, usdinr)
            self._put(t, inr_px, chg, "finnhub", px, "USD" if inst.asset != "india" else "INR")


TAPE = LiveTape()


def yahoo_symbol(ticker: str) -> Optional[str]:
    inst = INSTR.get(ticker)
    if not inst:
        return None
    if inst.asset == "india":
        return f"{ticker}.NS"
    if inst.asset == "us":
        return ticker
    if ticker in YAHOO_COMMODITY:
        return YAHOO_COMMODITY[ticker]
    if inst.asset == "crypto":
        return f"{ticker}-USD"
    return None


def finnhub_symbol(ticker: str) -> Optional[str]:
    inst = INSTR.get(ticker)
    if not inst:
        return None
    if inst.asset == "india":
        return f"{ticker}.NS"
    if inst.asset == "us":
        return ticker
    if ticker in FINNHUB_CRYPTO:
        return FINNHUB_CRYPTO[ticker]
    if ticker == "GOLD":
        return "OANDA:XAU_USD"
    if ticker == "SILVER":
        return "OANDA:XAG_USD"
    return None


def to_inr(ticker: str, asset: str, px: float, usdinr: float) -> float:
    if asset == "india":
        return px
    if ticker == "GOLD":
        return px * usdinr * (10.0 / 31.1034768)
    if ticker == "SILVER":
        return px * usdinr * (1000.0 / 31.1034768)
    if asset in ("us", "crypto", "commodities"):
        return px * usdinr
    return px


def _num(row: Optional[dict], key: str) -> Optional[float]:
    if not row:
        return None
    v = row.get(key)
    try:
        return float(v) if v is not None else None
    except (TypeError, ValueError):
        return None


SSL_CTX = ssl._create_unverified_context()


def _get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=TIMEOUT, context=SSL_CTX) as resp:
        return json.loads(resp.read().decode("utf-8", "replace"))


def _yahoo_quotes(symbols: List[str]) -> list:
    if not symbols:
        return []
    q = urllib.parse.urlencode({"symbols": ",".join(symbols), "fields": "regularMarketPrice,regularMarketChangePercent,symbol"})
    url = f"https://query1.finance.yahoo.com/v7/finance/quote?{q}"
    try:
        data = _get_json(url)
        return (((data.get("quoteResponse") or {}).get("result")) or [])
    except Exception:
        return []


def _yahoo_last(symbol: str) -> Optional[float]:
    q = urllib.parse.urlencode({"interval": "1m", "range": "1d"})
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(symbol)}?{q}"
    try:
        data = _get_json(url)
        meta = (((data.get("chart") or {}).get("result") or [{}])[0] or {}).get("meta") or {}
        px = meta.get("regularMarketPrice") or meta.get("previousClose")
        return float(px) if px else None
    except Exception:
        return None


def live_price(ticker: str) -> Optional[float]:
    return TAPE.last(ticker)

"""Company news from configured APIs, with trusted-source conflict handling."""

from __future__ import annotations

import json
import ssl
import threading
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import date, datetime, timedelta
from email.utils import parsedate_to_datetime
from typing import Any, Dict, List, Optional

from app.data.live import finnhub_symbol, yahoo_symbol
from app.data.universe import by_ticker

INSTR = by_ticker()
UA = "Mozilla/5.0 SNSCapital/3.1"
TIMEOUT = 7
SSL_CTX = ssl._create_unverified_context()
_CACHE: Dict[str, tuple[float, dict]] = {}
_LOCK = threading.Lock()
CACHE_SEC = 900

POS_WORDS = (
    "beat", "surge", "rally", "upgrade", "record", "profit", "growth", "win",
    "strong", "outperform", "buy", "bullish", "expand", "raise", "gain",
)
NEG_WORDS = (
    "miss", "fall", "drop", "downgrade", "loss", "probe", "fraud", "cut",
    "weak", "underperform", "sell", "bearish", "layoff", "lawsuit", "plunge",
    "warning", "slump",
)


def _get_settings():
    from app.config import get_settings

    return get_settings()


def _get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=TIMEOUT, context=SSL_CTX) as resp:
        return resp.read()


def _get_json(url: str) -> Any:
    return json.loads(_get(url).decode("utf-8", "replace"))


def headline_tone(title: str) -> float:
    t = (title or "").lower()
    pos = sum(1 for w in POS_WORDS if w in t)
    neg = sum(1 for w in NEG_WORDS if w in t)
    if pos == neg:
        return 0.0
    return max(-1.0, min(1.0, (pos - neg) / max(pos + neg, 1)))


def _published_iso(raw: str) -> str:
    raw = (raw or "").strip()
    if len(raw) >= 10 and raw[4] == "-" and raw[7] == "-":
        return raw[:10]
    try:
        return parsedate_to_datetime(raw).date().isoformat()
    except Exception:
        return date.today().isoformat()


def _item(source: str, title: str, published: str, url: str = "") -> dict:
    tone = headline_tone(title)
    return {
        "source": source,
        "title": (title or "").strip()[:240],
        "date": _published_iso(published),
        "url": url,
        "tone": "pos" if tone > 0.15 else "neg" if tone < -0.15 else "neu",
        "score": round(tone, 3),
    }


def _yahoo_rss(ticker: str) -> List[dict]:
    sym = yahoo_symbol(ticker)
    if not sym:
        return []
    url = "https://feeds.finance.yahoo.com/rss/2.0/headline?" + urllib.parse.urlencode(
        {"s": sym, "region": "US", "lang": "en-US"}
    )
    raw = _get(url)
    root = ET.fromstring(raw)
    out = []
    for item in root.findall(".//item")[:8]:
        title = (item.findtext("title") or "").strip()
        if not title:
            continue
        out.append(
            _item(
                "yahoo",
                title,
                item.findtext("pubDate") or "",
                item.findtext("link") or "",
            )
        )
    return out


def _finnhub_news(ticker: str, key: str) -> List[dict]:
    inst = INSTR.get(ticker)
    if not inst or inst.asset in ("bonds",):
        return []
    sym = finnhub_symbol(ticker)
    if not sym or ":" in sym:
        # skip FX/crypto pairs that are not company-news
        if inst.asset != "us" and inst.asset != "india":
            return []
        if inst.asset == "us":
            sym = ticker
        elif inst.asset == "india":
            sym = f"{ticker}.NS"
    end = date.today()
    start = end - timedelta(days=14)
    url = "https://finnhub.io/api/v1/company-news?" + urllib.parse.urlencode(
        {"symbol": sym, "from": start.isoformat(), "to": end.isoformat(), "token": key}
    )
    data = _get_json(url)
    if not isinstance(data, list):
        return []
    out = []
    for row in data[:10]:
        title = str(row.get("headline") or row.get("summary") or "").strip()
        if not title:
            continue
        ts = row.get("datetime") or 0
        published = datetime.utcfromtimestamp(int(ts)).date().isoformat() if ts else end.isoformat()
        out.append(_item("finnhub", title, published, str(row.get("url") or "")))
    return out


def _newsapi(inst_name: str, ticker: str, key: str) -> List[dict]:
    q = f'"{inst_name}" OR {ticker} stock'
    url = "https://newsapi.org/v2/everything?" + urllib.parse.urlencode(
        {
            "q": q,
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": 8,
            "apiKey": key,
        }
    )
    data = _get_json(url)
    out = []
    for row in data.get("articles") or []:
        title = str(row.get("title") or "").strip()
        if not title:
            continue
        published = str(row.get("publishedAt") or "")[:10]
        out.append(_item("newsapi", title, published, str((row.get("url") or ""))))
    return out


def _source_scores(items: List[dict]) -> Dict[str, float]:
    buckets: Dict[str, List[float]] = {}
    for it in items:
        buckets.setdefault(it["source"], []).append(float(it.get("score") or 0))
    return {k: sum(v) / len(v) for k, v in buckets.items() if v}


def resolve_conflict(items: List[dict], priority: List[str]) -> dict:
    scores = _source_scores(items)
    if len(scores) < 2:
        winner = next((p for p in priority if p in scores), next(iter(scores), "yahoo"))
        return {
            "detected": False,
            "sources": {k: round(v, 3) for k, v in scores.items()},
            "winner": winner,
            "rule": "single-source",
        }
    vals = list(scores.values())
    lo, hi = min(vals), max(vals)
    conflict = (hi > 0.12 and lo < -0.12) or (hi - lo) >= 0.55
    winner = next((p for p in priority if p in scores), max(scores, key=lambda k: abs(scores[k])))
    return {
        "detected": bool(conflict),
        "sources": {k: round(v, 3) for k, v in scores.items()},
        "winner": winner,
        "rule": "trusted-source-priority" if conflict else "no-conflict",
    }


def gather_news(ticker: str) -> dict:
    t = (ticker or "").upper()
    now = time.time()
    with _LOCK:
        hit = _CACHE.get(t)
        if hit and now - hit[0] < CACHE_SEC:
            return hit[1]
    s = _get_settings()
    priority = [x.strip().lower() for x in (s.news_source_priority or "finnhub,newsapi,yahoo").split(",") if x.strip()]
    items: List[dict] = []
    errors: List[str] = []
    fh = (s.finnhub_api_key or "").strip()
    nk = (s.news_api_key or "").strip()
    try:
        if fh:
            items.extend(_finnhub_news(t, fh))
    except Exception as e:
        errors.append(f"finnhub:{e}"[:80])
    try:
        if nk:
            inst = INSTR.get(t)
            items.extend(_newsapi(inst.name if inst else t, t, nk))
    except Exception as e:
        errors.append(f"newsapi:{e}"[:80])
    try:
        items.extend(_yahoo_rss(t))
    except Exception as e:
        errors.append(f"yahoo:{e}"[:80])

    conflict = resolve_conflict(items, priority)
    winner = conflict["winner"]
    if conflict["detected"]:
        used = [it for it in items if it["source"] == winner]
        if not used:
            used = items
    else:
        used = items
    scores = [float(it["score"]) for it in used] or [0.0]
    sentiment = sum(scores) / len(scores)
    payload = {
        "ticker": t,
        "items": used[:8],
        "all_items": items[:12],
        "conflict": conflict,
        "sentiment": round(sentiment, 3),
        "providers": sorted({it["source"] for it in items}),
        "errors": errors,
    }
    with _LOCK:
        _CACHE[t] = (now, payload)
    return payload

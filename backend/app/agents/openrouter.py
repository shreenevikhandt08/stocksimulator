"""OpenRouter chat — optional AI layer over news/market facts. Never logs the key."""

from __future__ import annotations

import json
import ssl
import urllib.request
from typing import Any, Dict, List, Optional

TIMEOUT = 12
SSL_CTX = ssl._create_unverified_context()
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def _settings():
    from app.config import get_settings

    return get_settings()


def available() -> bool:
    return bool((_settings().openrouter_api_key or "").strip())


def interpret_news(
    *,
    ticker: str,
    name: str,
    headlines: List[dict],
    conflict: dict,
    earnings_note: str,
    news_weight: float,
    blackout_days: int,
) -> Optional[Dict[str, Any]]:
    s = _settings()
    key = (s.openrouter_api_key or "").strip()
    if not key:
        return None
    model = (s.openrouter_model or "openai/gpt-4o-mini").strip()
    winner = (conflict or {}).get("winner") or ""
    detected = bool((conflict or {}).get("detected"))
    lines = []
    for h in headlines[:8]:
        lines.append(f"- [{h.get('source')}] ({h.get('tone')}) {h.get('title')}")
    prompt = (
        "You are the SNS Capital news desk. Follow boss rules strictly:\n"
        f"- News is only one scoring factor (weight {news_weight:.0%}). Do not override risk, allocation, or earnings blackout.\n"
        f"- Earnings blackout is {blackout_days} days. {earnings_note}\n"
        f"- If sources conflict, use ONLY the trusted source '{winner}'. Do not average opposing headlines.\n"
        f"Ticker: {ticker} ({name})\n"
        f"Conflict: {'YES' if detected else 'no'}; trusted source: {winner or 'n/a'}\n"
        "Headlines:\n"
        + ("\n".join(lines) or "- none")
        + "\nReply JSON only: {\"summary\": string, \"stance\": \"bullish|bearish|neutral\", \"used_source\": string}"
    )
    body = json.dumps(
        {
            "model": model,
            "messages": [
                {"role": "system", "content": "Return compact JSON only. No markdown."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.2,
            "max_tokens": 220,
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        OPENROUTER_URL,
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://mytrade.snsihub.ai",
            "X-Title": "SNS Capital",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT, context=SSL_CTX) as resp:
            data = json.loads(resp.read().decode("utf-8", "replace"))
        text = (((data.get("choices") or [{}])[0].get("message") or {}).get("content")) or ""
        text = text.strip()
        if text.startswith("```"):
            text = text.strip("`")
            if text.startswith("json"):
                text = text[4:]
        parsed = json.loads(text)
        stance = str(parsed.get("stance") or "neutral").lower()
        if stance not in {"bullish", "bearish", "neutral"}:
            stance = "neutral"
        return {
            "summary": str(parsed.get("summary") or "")[:400],
            "stance": stance,
            "used_source": str(parsed.get("used_source") or winner),
            "model": model,
        }
    except Exception:
        return None

"""Verifiable source links for research agents (cross-check in browser)."""

from __future__ import annotations

from typing import Dict, List

from app.data.universe import Instrument


def yahoo_symbol(inst: Instrument) -> str:
    t = inst.ticker.upper()
    if inst.asset == "us":
        return t
    if inst.asset == "crypto":
        # common crypto pair on Yahoo
        return f"{t}-USD" if t in {"BTC", "ETH", "SOL", "ADA", "XRP", "DOGE"} else t
    if inst.asset == "commodities":
        return t  # tape symbol; Yahoo may vary
    if inst.asset == "bonds":
        return t
    # India NSE
    return f"{t}.NS"


def yahoo_quote_url(inst: Instrument) -> str:
    return f"https://finance.yahoo.com/quote/{yahoo_symbol(inst)}"


def market_sources(inst: Instrument) -> Dict[str, List]:
    url = yahoo_quote_url(inst)
    return {
        "sources": [
            "Configured market-data API (Yahoo / Finnhub / Alpha Vantage)",
            "OHLCV price tape (desk bars + live feed)",
            "SMA 50 / SMA 200, RSI(14), MACD, ATR(14)",
            "20-day volume ratio + 1W/1M/3M momentum",
        ],
        "source_links": [
            {"label": f"Yahoo Finance · {yahoo_symbol(inst)}", "url": url},
            {"label": "Chart & history", "url": f"{url}/history"},
            {"label": "Key statistics", "url": f"{url}/key-statistics"},
        ],
    }


def news_sources(inst: Instrument) -> Dict[str, List]:
    url = yahoo_quote_url(inst)
    return {
        "sources": [
            "Configured news APIs (Finnhub, NewsAPI, Yahoo RSS)",
            "Trusted-source priority when headlines conflict",
            "News sentiment score (live feed, else desk model)",
            "Earnings calendar / blackout window",
            "Market regime path (Nifty / S&P structure)",
        ],
        "source_links": [
            {"label": f"Yahoo News · {yahoo_symbol(inst)}", "url": f"{url}/news"},
            {"label": "Yahoo quote", "url": url},
            {"label": "Google News search", "url": f"https://news.google.com/search?q={inst.name.replace(' ', '+')}+stock"},
        ],
    }


def social_sources(inst: Instrument) -> Dict[str, List]:
    q = inst.ticker
    return {
        "sources": [
            "Simulated X / Reddit social tape (desk model)",
            "Rolling sentiment series + mention volume",
            "Sleeve theme tags",
        ],
        "source_links": [
            {"label": f"X search · ${q}", "url": f"https://x.com/search?q=%24{q}&src=typed_query"},
            {"label": f"Reddit search · {q}", "url": f"https://www.reddit.com/search/?q={q}"},
            {"label": "Yahoo quote (price context)", "url": yahoo_quote_url(inst)},
        ],
    }


def fundamentals_sources(inst: Instrument) -> Dict[str, List]:
    url = yahoo_quote_url(inst)
    if inst.asset == "bonds":
        return {
            "sources": ["Bond yield model (desk)", "Fixed-income ranking (not equity momentum)"],
            "source_links": [{"label": "Yahoo quote", "url": url}],
        }
    if inst.asset in ("commodities", "crypto"):
        return {
            "sources": ["Price trend proxy (no classic earnings)", "1M momentum from tape"],
            "source_links": [
                {"label": "Yahoo quote", "url": url},
                {"label": "History", "url": f"{url}/history"},
            ],
        }
    return {
        "sources": [
            "Company fundamentals snapshot (YoY / QoQ, ROE, D/E)",
            "Valuation: P/E and P/B vs model baseline",
            "Live price vs fundamental anchor",
        ],
        "source_links": [
            {"label": "Yahoo financials", "url": f"{url}/financials"},
            {"label": "Yahoo analysis", "url": f"{url}/analysis"},
            {"label": "Yahoo key statistics", "url": f"{url}/key-statistics"},
            {"label": "Yahoo quote", "url": url},
        ],
    }

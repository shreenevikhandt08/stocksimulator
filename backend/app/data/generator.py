from __future__ import annotations

import math
import random
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Dict, List, Sequence, Tuple

from app.config import SIM_HISTORY_DAYS
from app.data.universe import UNIVERSE, Instrument


def trading_dates(end: date, n: int) -> List[date]:
    dates: List[date] = []
    d = end
    while len(dates) < n:
        if d.weekday() < 5:
            dates.append(d)
        d -= timedelta(days=1)
    dates.reverse()
    return dates


def _gauss(rng: random.Random, mu: float, sigma: float) -> float:
    return rng.gauss(mu, sigma)


def _factor(rng: random.Random, n: int, mu: float, sigma: float) -> List[float]:
    return [_gauss(rng, mu, sigma) for _ in range(n)]


def _clip(x: float, lo: float, hi: float) -> float:
    return lo if x < lo else hi if x > hi else x


def _tanh(x: float) -> float:
    return math.tanh(x)


def _lognormal(rng: random.Random, sigma: float) -> float:
    return math.exp(_gauss(rng, 0.0, sigma))


@dataclass
class Bar:
    date: date
    open: float
    high: float
    low: float
    close: float
    volume: float


@dataclass
class Series:
    instrument: Instrument
    bars: List[Bar]
    earnings: List[date] = field(default_factory=list)
    sentiment: List[float] = field(default_factory=list)
    news_events: List[Tuple[date, str, float]] = field(default_factory=list)

    def close_at(self, idx: int) -> float:
        return self.bars[idx].close

    def window(self, idx: int) -> List[Bar]:
        return self.bars[: idx + 1]


class MarketBook:
    """Deterministic simulated market: 320+ trading days, correlated by asset class."""

    def __init__(self, as_of: date, seed: int = 314159):
        self.as_of = as_of
        self.dates = trading_dates(as_of, SIM_HISTORY_DAYS)
        self.n = len(self.dates)
        rng = random.Random(seed)
        self.series: Dict[str, Series] = {}

        factors = {
            "india": _factor(rng, self.n, 0.00028, 0.009),
            "us": _factor(rng, self.n, 0.00032, 0.010),
            "commodities": _factor(rng, self.n, 0.00010, 0.008),
            "bonds": _factor(rng, self.n, 0.00004, 0.0022),
            "crypto": _factor(rng, self.n, 0.00040, 0.022),
        }

        nifty = self._index_from_factor(10000, factors["india"], rng, 0.004)
        spx = self._index_from_factor(5200, factors["us"], rng, 0.005)
        self.nifty = nifty
        self.spx = spx

        for inst in UNIVERSE:
            self.series[inst.ticker] = self._build_series(inst, factors[inst.asset], rng)

        self.regime_path = self._compute_regimes(nifty, spx)

    def _index_from_factor(
        self, start: float, factor: Sequence[float], rng: random.Random, idio: float
    ) -> List[float]:
        px = [start]
        for t in range(self.n):
            r = factor[t] + _gauss(rng, 0, idio)
            px.append(max(px[-1] * (1 + r), start * 0.4))
        return px[1:]

    def _build_series(
        self, inst: Instrument, factor: Sequence[float], rng: random.Random
    ) -> Series:
        beta = 0.72 if inst.asset != "bonds" else 0.35
        closes = [inst.start_price]
        volumes: List[float] = []
        base_vol = {
            "india": 2_400_000,
            "us": 8_500_000,
            "commodities": 120_000,
            "bonds": 45_000,
            "crypto": 18_000_000,
        }[inst.asset]
        for t in range(self.n):
            shock = 0.0
            if rng.random() < 0.012:
                shock = _gauss(rng, 0, inst.vol * 3.2)
            r = inst.drift + beta * factor[t] + _gauss(rng, 0, inst.vol) + shock
            if inst.asset == "bonds":
                r += 0.015 * (inst.start_price - closes[-1]) / inst.start_price
            nxt = max(closes[-1] * (1 + r), inst.start_price * 0.15)
            closes.append(nxt)
            vol_mult = abs(r) / max(inst.vol, 1e-6)
            volumes.append(max(base_vol * (0.55 + 0.9 * vol_mult) * _lognormal(rng, 0.18), 1000))
        closes = closes[1:]

        bars: List[Bar] = []
        for t, d in enumerate(self.dates):
            c = float(closes[t])
            prev = float(closes[t - 1] if t else inst.start_price)
            o = prev * (1 + _gauss(rng, 0, inst.vol * 0.25))
            rng_span = abs(_gauss(rng, 0, inst.vol)) * c
            h = max(o, c) + rng_span * 0.6
            l = min(o, c) - rng_span * 0.6
            l = max(l, c * 0.92)
            bars.append(Bar(d, float(o), float(h), float(l), c, float(volumes[t])))

        earnings = self._earnings_calendar(inst, rng)
        sentiment, news = self._sentiment_and_news(inst, bars, rng)
        return Series(inst, bars, earnings, sentiment, news)

    def _earnings_calendar(self, inst: Instrument, rng: random.Random) -> List[date]:
        if inst.asset in ("bonds", "commodities", "crypto"):
            return []
        out: List[date] = []
        windows = [(1, 20), (4, 20), (7, 20), (10, 20)]
        years = {d.year for d in self.dates}
        for y in years:
            for m, day in windows:
                jitter = rng.randint(-6, 7)
                try:
                    dt = date(y, m, max(1, min(27, day + jitter)))
                except ValueError:
                    continue
                if dt.weekday() >= 5:
                    dt += timedelta(days=7 - dt.weekday())
                if self.dates[0] <= dt <= self.dates[-1]:
                    out.append(dt)
        return sorted(out)

    def _sentiment_and_news(
        self, inst: Instrument, bars: List[Bar], rng: random.Random
    ) -> Tuple[List[float], List[Tuple[date, str, float]]]:
        sent: List[float] = []
        news: List[Tuple[date, str, float]] = []
        templates_pos = [
            "{name} beats street on {theme}; desks lift estimates.",
            "Flows chase {name} after {theme} print.",
            "Brokerage upgrade: {name} added to high-conviction list on {theme}.",
            "{name} announces capacity expansion tied to {theme}.",
        ]
        templates_neg = [
            "{name} faces scrutiny after {theme} miss.",
            "Risk-off hits {name}; {theme} weighs on the tape.",
            "Downgrade chatter around {name} as {theme} deteriorates.",
            "Regulatory headline pressure on {name} ({theme}).",
        ]
        themes = {
            "india": ["domestic demand", "FII flows", "RBI liquidity", "GST collections"],
            "us": ["Fed path", "AI capex", "payrolls", "dollar strength"],
            "commodities": ["China demand", "inventory draw", "geopolitics", "USD"],
            "bonds": ["term premium", "CPI", "RBI/Fed stance", "fiscal supply"],
            "crypto": ["ETF flows", "on-chain activity", "leverage flush", "regulation"],
        }[inst.asset]
        prev = 0.05
        for t, b in enumerate(bars):
            ret = 0.0 if t == 0 else (b.close - bars[t - 1].close) / bars[t - 1].close
            raw = 0.55 * _tanh(ret / max(inst.vol, 1e-4)) + 0.25 * prev + _gauss(rng, 0, 0.18)
            s = _clip(raw, -1, 1)
            sent.append(s)
            prev = s
            if rng.random() < 0.035:
                theme = rng.choice(themes)
                tpl = templates_pos if s >= 0 else templates_neg
                headline = rng.choice(tpl).format(name=inst.name, theme=theme)
                news.append((b.date, headline, s))
        return sent, news

    def _compute_regimes(self, nifty: List[float], spx: List[float]) -> List[str]:
        regimes: List[str] = []
        for t in range(self.n):
            n_reg = self._index_regime(nifty, t)
            s_reg = self._index_regime(spx, t)
            if n_reg == s_reg:
                regimes.append(n_reg)
            elif "bear" in (n_reg, s_reg) and "bull" in (n_reg, s_reg):
                regimes.append("sideways")
            else:
                regimes.append(n_reg if n_reg != "sideways" else s_reg)
        return regimes

    def _index_regime(self, px: List[float], t: int) -> str:
        if t < 200:
            return "sideways"
        window = px[: t + 1]
        sma50 = sum(window[-50:]) / 50
        sma200 = sum(window[-200:]) / 200
        last = window[-1]
        near = abs(last - sma50) / sma50 < 0.012
        if last > sma50 and sma50 > sma200 and not near:
            return "bull"
        if last < sma50 and sma50 < sma200 and not near:
            return "bear"
        return "sideways"

    def idx_for(self, d: date) -> int:
        return self.dates.index(d)

    def sma(self, ticker: str, idx: int, n: int) -> float:
        bars = self.series[ticker].bars
        sl = bars[max(0, idx - n + 1) : idx + 1]
        return sum(b.close for b in sl) / len(sl)

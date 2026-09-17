from __future__ import annotations

from typing import List, Sequence

from app.data.generator import Bar


def sma(closes: Sequence[float], n: int) -> float:
    sl = closes[-n:] if len(closes) >= n else closes
    return sum(sl) / max(len(sl), 1)


def ema(values: Sequence[float], n: int) -> float:
    if not values:
        return 0.0
    k = 2 / (n + 1)
    e = values[0]
    for v in values[1:]:
        e = v * k + e * (1 - k)
    return e


def rsi(closes: Sequence[float], n: int = 14) -> float:
    if len(closes) < n + 1:
        return 50.0
    gains, losses = [], []
    for i in range(-n, 0):
        ch = closes[i] - closes[i - 1]
        gains.append(max(ch, 0))
        losses.append(max(-ch, 0))
    ag, al = sum(gains) / n, sum(losses) / n
    if al == 0:
        return 100.0
    rs = ag / al
    return 100 - 100 / (1 + rs)


def true_ranges(bars: Sequence[Bar]) -> List[float]:
    out = []
    for i, b in enumerate(bars):
        prev = bars[i - 1].close if i else b.close
        out.append(max(b.high - b.low, abs(b.high - prev), abs(b.low - prev)))
    return out


def atr(bars: Sequence[Bar], n: int = 14) -> float:
    trs = true_ranges(bars)
    if len(trs) < n:
        return sum(trs) / max(len(trs), 1)
    return ema(trs, n)


def macd(closes: Sequence[float]) -> tuple[float, float, float]:
    if len(closes) < 35:
        return 0.0, 0.0, 0.0
    line = ema(closes, 12) - ema(closes, 26)
    # signal approx from recent line path
    path = []
    for i in range(26, len(closes)):
        path.append(ema(closes[: i + 1], 12) - ema(closes[: i + 1], 26))
    signal = ema(path[-9:] if len(path) >= 9 else path, 9) if path else 0.0
    return line, signal, line - signal


def momentum(closes: Sequence[float], lookback: int) -> float:
    if len(closes) <= lookback or closes[-lookback - 1] == 0:
        return 0.0
    return (closes[-1] / closes[-lookback - 1]) - 1.0


def volume_ratio(bars: Sequence[Bar], n: int = 20) -> float:
    if len(bars) < 2:
        return 1.0
    avg = sum(b.volume for b in bars[-n:]) / min(n, len(bars))
    if avg <= 0:
        return 1.0
    return bars[-1].volume / avg


def realized_vol(closes: Sequence[float], n: int = 20) -> float:
    if len(closes) < n + 1:
        return 0.02
    rets = [
        (closes[i] / closes[i - 1] - 1.0)
        for i in range(len(closes) - n, len(closes))
        if closes[i - 1]
    ]
    if len(rets) < 2:
        return 0.02
    mu = sum(rets) / len(rets)
    var = sum((r - mu) ** 2 for r in rets) / (len(rets) - 1)
    return var ** 0.5

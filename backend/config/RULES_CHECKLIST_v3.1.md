# SNS Investment Simulator — Rules Checklist v3.1

> Canonical desk rulebook. Numbers live in `rules.json`. OPTIONAL toggles stay **OFF**.

---

## 1. Sector Allocation (Dynamic Range)

| Asset | Min | Max | Default |
|-------|-----|-----|---------|
| India | 30% | 45% | 35% |
| US Market | 15% | 25% | 20% |
| Commodities | 10% | 25% | 15% |
| Bonds | 5% | 20% | 10% |
| Crypto | 5% | 10% | 7% |

- Allocation adjusts within range based on market regime
- Bull: shift toward equity (India/US upper range)
- Bear: shift toward Bonds/Commodities upper range
- No sector exceeds its max on any given day
- Unspent sector budget spills to best remaining picks
- Crypto uses fractional units to fit budget

## 2. Hold and Sell Cycle

### Hold
- Maximum hold period: 30 days
- On day 31: force sell, then eligible for re-buy (after cooldown)
- No early sell unless stop loss triggers

### Stop Loss (ATR-Based) [FIX #4]
- Equity stop loss = 2 × ATR(14)
- Crypto/high-vol stop loss = 1.5 × ATR(14)
- Bonds: no ATR stop (hold to maturity/30d)
- Stop loss can trigger any day (overrides hold period)

### Sell Reasons (trade log must show one)
- `30d maturity`
- `Stop loss (ATR)`
- `Trim to cap`
- `Portfolio drawdown pause`

### Post-Sell
- Full sell: 30-day cooldown before re-buy
- Partial trim: NO cooldown on remaining position [FIX #3]
- Profit portion to savings, principal to reinvestment pool

## 3. Daily Budget and Regime Detection

| Regime | Daily Budget | Detection |
|--------|-------------|-----------|
| Bull | Rs. 10,000 | Index > 50-DMA and 50-DMA > 200-DMA |
| Sideways | Rs. 7,000 | Index near 50-DMA, no clear trend |
| Bear | Rs. 3,000 | Index < 50-DMA and 50-DMA < 200-DMA |

### Friday Rule
- Friday budget capped at Rs. 5,000
- Bonds and commodities allowed

### Cash Reserve [FIX #1]
- Reserve = 5% of CURRENT PORTFOLIO VALUE (MTM)
- Recalculated daily; never deploy the reserve

## 4. Scoring Mechanism

| Factor | Weight |
|--------|--------|
| Momentum | 35% (1W 50% / 1M 30% / 3M 20%) |
| Volume | 20% |
| News Sentiment | 15% |
| Earnings Trend | 15% |
| Relative Strength | 15% |

- Bonds exempt from momentum — ranked by yield [FIX #5-lite]
- Quality filter: must pass 3 of 5

## 5. Risk Controls

- No single company > 10%; trim to 8% [FIX #3]
- Max 3 stocks per sub-sector [FIX #2]
- Each sector ≤ 40% of portfolio value
- Drawdown circuit breaker [FIX #6]: −10% pause 3d · −15% pause 7d + bear budget · −20% liquidate 50% · resume &lt; 7%
- Earnings blackout: 5 trading days before

## OPTIONAL Strategy Toggles (OFF by default)

Winner roll-over · Value condition · News sentiment decay · Post-earnings cooling · Three-mode engine

> Do not enable unless the boss explicitly asks.

import { useEffect, useState } from "react";
import { api, inr, pct } from "../api";

/** Boss Rules Checklist v3.1 only — optional toggles stay OFF (not user-editable here). */
const SECTIONS = [
  {
    title: "1. Sector allocation",
    items: [
      "India 30–45% (def 35%) · US 15–25% (20%) · Commodities 10–25% (15%) · Bonds 5–20% (10%) · Crypto 5–10% (7%)",
      "Bull: shift toward equity upper range. Bear: bonds/commodities upper range.",
      "No sleeve exceeds its max. Unspent sector budget spills to best remaining picks. Crypto uses fractional units.",
    ],
  },
  {
    title: "2. Hold and sell",
    items: [
      "Max hold 30 days. Day 31: force sell, then cooldown before re-buy.",
      "No early sell unless ATR stop. Equity 2× ATR(14). Crypto/high-vol 1.5× ATR(14). Bonds: no ATR stop.",
      "Sell reasons: 30d maturity · Stop loss (ATR) · Trim to cap · Portfolio drawdown pause.",
      "Full sell: 30-day cooldown. Partial trim: no cooldown. Profit to savings, principal to reinvestment.",
    ],
  },
  {
    title: "3. Daily budget and regime",
    items: [
      "Bull Rs. 10,000 (index > 50-DMA and 50>200). Sideways Rs. 7,000. Bear Rs. 3,000.",
      "Friday budget capped at Rs. 5,000. Bonds and commodities still allowed.",
      "Cash reserve = 5% of CURRENT portfolio value (marked-to-market). Recalculated daily. Never deploy the reserve.",
    ],
  },
  {
    title: "4. Scoring",
    items: [
      "Momentum 35% (1W 50% / 1M 30% / 3M 20%) · Volume 20% · News 15% · Earnings 15% · RS 15%.",
      "Bonds exempt from momentum — ranked by yield.",
      "Quality filter must pass 3 of 5: earnings trend, news > 0, price > 200-DMA, RS > market, volume > 20-day avg.",
    ],
  },
  {
    title: "5. Risk controls",
    items: [
      "No single company > 10%. If past 10%: partial trim to 8% (no cooldown).",
      "Max 3 names from the same sub-sector. Per-sector cap 40% of portfolio value.",
      "Drawdown: −10% pause 3d · −15% pause 7d + bear budget · −20% liquidate 50%. Resume when < 7% from peak.",
      "No buys within 5 trading days before simulated earnings.",
    ],
  },
];

type Rules = {
  toggles: Record<string, boolean>;
  live: {
    regime: string;
    budget: number;
    friday: boolean;
    reserve_pct: number;
    drawdown_pct: number;
    paused: boolean;
    positions: number;
    universe: number;
    price_window: number;
  };
};

const TOGGLE_META: { key: string; label: string; trade: string }[] = [
  {
    key: "winner_rollover",
    label: "Winner roll-over",
    trade: "If profitable and all quality flags pass on day 30, extend 15 days (max 1).",
  },
  {
    key: "value_condition",
    label: "Value condition (6th filter)",
    trade: "Below 52-week median P/E proxy. Require 3 of 6.",
  },
  {
    key: "news_decay",
    label: "News sentiment decay",
    trade: "Half-life of 3 days on the news factor.",
  },
  {
    key: "post_earnings_cooling",
    label: "Post-earnings cooling",
    trade: "No buys for 3 days after earnings.",
  },
  {
    key: "three_mode",
    label: "Three-mode engine",
    trade: "Tighter commodity stops (1.5× ATR) alongside crypto.",
  },
];

export default function Rules({ tick }: { tick: number }) {
  const [d, setD] = useState<Rules | null>(null);
  useEffect(() => {
    api<Rules>("/api/rules").then(setD).catch(() => setD(null));
  }, [tick]);

  if (!d) return <div className="text-mist">Loading rules…</div>;
  const l = d.live;

  return (
    <div className="space-y-5">
      <div>
        <div className="kicker">SNS Investment Simulator — Rules Checklist v3.1</div>
        <h1 className="mt-1 text-2xl font-semibold">Boss mandate · locked</h1>
        <p className="mt-1 text-[13px] text-mist">
          This desk runs only these rules. Optional strategy toggles stay OFF (style choices, not corrections).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="panel p-3">
          <div className="kicker">Universe</div>
          <div className="font-mono">{l.universe} names</div>
        </div>
        <div className="panel p-3">
          <div className="kicker">Price window</div>
          <div className="font-mono">{l.price_window} sessions</div>
        </div>
        <div className="panel p-3">
          <div className="kicker">Reserve</div>
          <div className="font-mono">{pct(l.reserve_pct, 1)}</div>
        </div>
        <div className="panel p-3">
          <div className="kicker">Budget</div>
          <div className="font-mono">
            {inr(l.budget)}
            {l.friday ? " · Fri cap" : ""}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {SECTIONS.map((s) => (
          <section key={s.title} className="panel p-4">
            <h2 className="text-base font-medium">{s.title}</h2>
            <ul className="mt-2 space-y-2 text-[13px] text-mist">
              {s.items.map((it) => (
                <li key={it} className="flex gap-2">
                  <span className="text-gain">✓</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="panel p-5">
        <h2 className="text-base font-medium">Optional strategy toggles (OFF)</h2>
        <p className="mt-1 text-[13px] text-mist">
          Locked to boss defaults — not editable in the desk. Change only via rules.json if the boss asks.
        </p>
        <div className="mt-4 space-y-3">
          {TOGGLE_META.map((t) => (
            <div key={t.key} className="flex items-start justify-between gap-4 rounded-md border border-line p-3 opacity-80">
              <div>
                <div className="text-[13px] font-medium">{t.label}</div>
                <div className="text-[12px] text-mist">{t.trade}</div>
              </div>
              <span className="font-mono text-[12px] text-mist">{d.toggles[t.key] ? "ON" : "OFF"}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, inr, pct, signedInr, signedPct, tone } from "../api";

type Holding = {
  ticker: string;
  name: string;
  asset: string;
  sector: string;
  subsector: string;
  qty: number;
  avg_cost: number;
  price: number;
  market_value: number;
  weight: number;
  pnl: number;
  pnl_pct: number;
  days_held: number;
  days_left: number;
  stop: number | null;
  atr: number;
  opened_on: string;
};

type Book = {
  cash: number;
  savings: number;
  mtm: number;
  wealth: number;
  holdings: Holding[];
  cooldowns: { ticker: string; name: string; until: string }[];
};

export default function Portfolio({ tick }: { tick: number }) {
  const [d, setD] = useState<Book | null>(null);
  useEffect(() => {
    api<Book>("/api/portfolio").then(setD);
  }, [tick]);
  if (!d) return <div className="text-mist">Loading the book…</div>;

  return (
    <div className="space-y-5">
      <div>
        <div className="kicker">The book</div>
        <h1 className="mt-1 text-2xl font-semibold">Holdings, clocks, and cooldowns</h1>
        <p className="mt-1 text-[13px] text-mist">
          30-day hold. ATR stop (2× equity / 1.5× crypto). Bonds hold without a stop. Full exits cool for 30 days;
          trims do not.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="panel p-4">
          <div className="kicker">Market value</div>
          <div className="font-mono text-xl">{inr(d.mtm)}</div>
        </div>
        <div className="panel p-4">
          <div className="kicker">Cash</div>
          <div className="font-mono text-xl">{inr(d.cash)}</div>
        </div>
        <div className="panel p-4">
          <div className="kicker">Savings</div>
          <div className="font-mono text-xl text-gain">{inr(d.savings)}</div>
        </div>
        <div className="panel p-4">
          <div className="kicker">Wealth</div>
          <div className="font-mono text-xl">{inr(d.wealth)}</div>
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-[13px]">
          <thead className="border-b border-line text-[11px] uppercase tracking-wider text-mist">
            <tr>
              {[
                "Ticker",
                "Asset",
                "Qty",
                "Avg",
                "Last",
                "Value",
                "Weight",
                "P/L",
                "Held",
                "Left",
                "Stop",
              ].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.holdings.map((h) => (
              <tr key={h.ticker} className="border-b border-line/70 hover:bg-ink-800/50">
                <td className="px-3 py-2">
                  <Link to={`/research/${h.ticker}`} className="font-medium hover:text-gold">
                    {h.ticker}
                  </Link>
                  <div className="text-[11px] text-mist">{h.name}</div>
                </td>
                <td className="px-3 py-2 capitalize text-mist">
                  {h.asset}
                  <div className="text-[11px]">{h.subsector}</div>
                </td>
                <td className="px-3 py-2 font-mono">{h.qty < 1 ? h.qty.toFixed(4) : h.qty.toFixed(0)}</td>
                <td className="px-3 py-2 font-mono">{inr(h.avg_cost, 2)}</td>
                <td className="px-3 py-2 font-mono">{inr(h.price, 2)}</td>
                <td className="px-3 py-2 font-mono">{inr(h.market_value)}</td>
                <td className="px-3 py-2 font-mono">{pct(h.weight, 1)}</td>
                <td className={`px-3 py-2 font-mono ${tone(h.pnl)}`}>
                  {signedInr(h.pnl)}
                  <div className="text-[11px]">{signedPct(h.pnl_pct)}</div>
                </td>
                <td className="px-3 py-2 font-mono">{h.days_held}d</td>
                <td className={`px-3 py-2 font-mono ${h.days_left <= 3 ? "text-gold" : ""}`}>{h.days_left}d</td>
                <td className="px-3 py-2 font-mono text-mist">{h.stop ? inr(h.stop, 2) : "—"}</td>
              </tr>
            ))}
            {d.holdings.length === 0 && (
              <tr>
                <td colSpan={11} className="px-3 py-8 text-center text-mist">
                  Book is flat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="panel p-4">
        <h2 className="text-base font-medium">Re-buy cooldown (30d after full exit)</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {d.cooldowns.length === 0 && <span className="text-sm text-mist">None active.</span>}
          {d.cooldowns.map((c) => (
            <span key={c.ticker} className="rounded-full border border-line px-3 py-1 text-[12px]">
              {c.ticker} until {c.until}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

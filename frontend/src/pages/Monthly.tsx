import { useEffect, useState, type ReactNode } from "react";
import { api, inr, pct, signedInr, tone } from "../api";

type Review = {
  as_of: string;
  sector_weights: {
    asset: string;
    label: string;
    current: number;
    target: number;
    drift: number;
    min: number;
    max: number;
  }[];
  top_winners: { ticker: string; name: string; pnl: number; reason: string; date: string }[];
  top_losers: { ticker: string; name: string; pnl: number; reason: string; date: string }[];
  concentration: {
    largest_position: { ticker: string; name: string; weight: number } | null;
    largest_sector: string | null;
    largest_sector_w: number;
    subsector_clusters: Record<string, number>;
  };
  volatility_30d: number;
  regime: string;
  budget: number;
  cash_pct: number;
  reserve_target: number;
  drawdown_pct: number;
  cb_tier: number;
};

function Check({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div className="flex gap-2 text-[13px]">
      <span className={ok ? "text-gain" : "text-gold"}>{ok ? "✓" : "•"}</span>
      <span>{children}</span>
    </div>
  );
}

export default function Monthly({ tick }: { tick: number }) {
  const [d, setD] = useState<Review | null>(null);
  useEffect(() => {
    api<Review>("/api/monthly-review").then(setD);
  }, [tick]);
  if (!d) return <div className="text-mist">Compiling review…</div>;
  const c = d.concentration;

  return (
    <div className="space-y-5">
      <div>
        <div className="kicker">Monthly review · {d.as_of}</div>
        <h1 className="mt-1 text-2xl font-semibold">v3.1 checklist</h1>
      </div>

      <div className="panel p-5 space-y-2">
        <Check ok={Math.abs((c.largest_position?.weight || 0) - 0) < 0.1 || (c.largest_position?.weight || 0) <= 0.1}>
          Largest name {c.largest_position ? `${c.largest_position.ticker} ${pct(c.largest_position.weight, 1)}` : "—"}{" "}
          (cap 10%)
        </Check>
        <Check ok={d.cash_pct >= d.reserve_target - 0.005}>
          Cash {pct(d.cash_pct, 1)} vs 5% marked-to-market reserve
        </Check>
        <Check ok={d.drawdown_pct < 0.1}>
          Drawdown {pct(d.drawdown_pct)} from peak · circuit breaker tier {d.cb_tier}
        </Check>
        <Check ok={d.regime !== undefined}>
          Regime {d.regime.toUpperCase()} · budget {inr(d.budget)}
        </Check>
      </div>

      <div className="panel p-4">
        <h2 className="text-base font-medium">Sector weights vs target</h2>
        <table className="mt-3 w-full text-left text-[13px]">
          <thead className="text-[11px] uppercase text-mist">
            <tr>
              <th className="py-1">Sleeve</th>
              <th>Current</th>
              <th>Target</th>
              <th>Drift</th>
              <th>Band</th>
            </tr>
          </thead>
          <tbody>
            {d.sector_weights.map((s) => (
              <tr key={s.asset} className="border-t border-line">
                <td className="py-2">{s.label}</td>
                <td className="font-mono">{pct(s.current, 1)}</td>
                <td className="font-mono">{pct(s.target, 1)}</td>
                <td className={`font-mono ${tone(s.drift)}`}>
                  {s.drift > 0 ? "+" : ""}
                  {pct(s.drift, 1)}
                </td>
                <td className="text-mist">
                  {pct(s.min, 0)}–{pct(s.max, 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel p-4">
          <h2 className="text-base font-medium">Top 5 winners</h2>
          {d.top_winners.map((w) => (
            <div key={w.ticker + w.date} className="mt-2 flex justify-between text-[13px]">
              <span>
                {w.ticker} <span className="text-mist">{w.reason}</span>
              </span>
              <span className="font-mono text-gain">{signedInr(w.pnl)}</span>
            </div>
          ))}
        </div>
        <div className="panel p-4">
          <h2 className="text-base font-medium">Top 5 losers</h2>
          {d.top_losers.map((w) => (
            <div key={w.ticker + w.date} className="mt-2 flex justify-between text-[13px]">
              <span>
                {w.ticker} <span className="text-mist">{w.reason}</span>
              </span>
              <span className="font-mono text-loss">{signedInr(w.pnl)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel p-4">
        <h2 className="text-base font-medium">Sub-sector clusters (max 3 names)</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(c.subsector_clusters).map(([k, v]) => (
            <span
              key={k}
              className={`rounded-full px-3 py-1 text-[12px] ${v >= 3 ? "bg-gold/15 text-gold" : "border border-line text-mist"}`}
            >
              {k} · {v}
            </span>
          ))}
        </div>
        <div className="mt-4 text-[13px] text-mist">
          Largest sleeve: {c.largest_sector} ({pct(c.largest_sector_w, 1)}) · trailing vol {pct(d.volatility_30d || 0)}
        </div>
      </div>
    </div>
  );
}

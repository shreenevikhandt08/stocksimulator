import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api, inr, pct, signedInr, signedPct, tone } from "../api";

type Metrics = {
  cagr: number;
  max_drawdown: number;
  volatility: number;
  sharpe: number;
  sortino: number;
  calmar: number;
  recovery_days: number | null;
  win_rate: number;
  avg_winner: number;
  avg_loser: number;
  profit_factor: number;
  avg_holding_days: number;
  cash_utilization: number;
  capital_turnover: number;
  time_in_market: number;
  regime_accuracy: number | null;
  monthly_returns: Record<string, number>;
  sector_returns: Record<string, number>;
  n_trades: number;
  n_exits: number;
};

type Trade = {
  date: string;
  ticker: string;
  name: string;
  side: string;
  qty: number;
  price: number;
  amount: number;
  reason: string;
  pnl: number;
};

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="panel p-4">
      <div className="kicker">{label}</div>
      <div className="mt-1 font-mono text-xl">{value}</div>
      {hint && <div className="mt-1 text-[11px] text-mist">{hint}</div>}
    </div>
  );
}

export default function Performance({ tick }: { tick: number }) {
  const [m, setM] = useState<Metrics | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  useEffect(() => {
    api<{ metrics: Metrics; trades: Trade[] }>("/api/performance").then((d) => {
      setM(d.metrics);
      setTrades(d.trades);
    });
  }, [tick]);
  if (!m) return <div className="text-mist">Computing performance…</div>;

  const monthly = Object.entries(m.monthly_returns || {}).map(([k, v]) => ({ m: k, pnl: v }));
  const sector = Object.entries(m.sector_returns || {}).map(([k, v]) => ({ s: k, pnl: v }));

  return (
    <div className="space-y-5">
      <div>
        <div className="kicker">Performance</div>
        <h1 className="mt-1 text-2xl font-semibold">Daily P/L and strategy metrics</h1>
      </div>

      <div>
        <div className="mb-2 text-[12px] uppercase tracking-wider text-mist">Returns</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="CAGR" value={pct(m.cagr)} hint="Annualized from sim period" />
          <Stat label="Monthly P/L (latest months)" value={`${monthly.length} months`} />
          <Stat label="Calmar" value={m.calmar.toFixed(2)} hint="CAGR / max drawdown" />
          <Stat label="Trades / exits" value={`${m.n_trades} / ${m.n_exits}`} />
        </div>
      </div>
      <div>
        <div className="mb-2 text-[12px] uppercase tracking-wider text-mist">Risk</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Stat label="Max drawdown" value={pct(m.max_drawdown)} />
          <Stat label="Volatility" value={pct(m.volatility)} hint="Ann. stdev of daily returns" />
          <Stat label="Sharpe" value={m.sharpe.toFixed(2)} hint="Excess vs idle cash (Rf 0)" />
          <Stat label="Sortino" value={m.sortino.toFixed(2)} />
          <Stat label="Recovery" value={m.recovery_days == null ? "Open" : `${m.recovery_days}d`} />
        </div>
      </div>
      <div>
        <div className="mb-2 text-[12px] uppercase tracking-wider text-mist">Trade quality · capital</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          <Stat label="Win rate" value={pct(m.win_rate, 1)} />
          <Stat label="Avg winner" value={inr(m.avg_winner)} />
          <Stat label="Avg loser" value={inr(m.avg_loser)} />
          <Stat label="Profit factor" value={m.profit_factor.toFixed(2)} />
          <Stat label="Cash utilization" value={pct(m.cash_utilization, 1)} />
          <Stat label="Time in market" value={pct(m.time_in_market, 1)} />
          <Stat
            label="Regime accuracy"
            value={m.regime_accuracy == null ? "n/a" : pct(m.regime_accuracy, 0)}
            hint="21d Nifty hindsight"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-4">
          <div className="kicker">Monthly P/L</div>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <CartesianGrid stroke="#1e2c40" vertical={false} />
                <XAxis dataKey="m" tick={{ fill: "#8b9bb4", fontSize: 11 }} />
                <YAxis tick={{ fill: "#8b9bb4", fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "#121a28", border: "1px solid #1e2c40" }} formatter={(v: number) => inr(v)} />
                <Bar dataKey="pnl" fill="#d4a84b" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-4">
          <div className="kicker">Sector-wise realized P/L</div>
          <div className="mt-3 space-y-2">
            {sector.map((s) => (
              <div key={s.s} className="flex justify-between text-[13px]">
                <span className="capitalize">{s.s}</span>
                <span className={`font-mono ${tone(s.pnl)}`}>{signedInr(s.pnl)}</span>
              </div>
            ))}
            {sector.length === 0 && <div className="text-sm text-mist">No closed P/L yet.</div>}
          </div>
        </div>
      </div>

      <div className="panel overflow-x-auto">
        <div className="border-b border-line px-4 py-3 text-sm font-medium">Trade blotter (latest 120)</div>
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead className="text-[11px] uppercase tracking-wider text-mist">
            <tr>
              {["Date", "Side", "Ticker", "Qty", "Price", "Amount", "Reason", "P/L"].map((h) => (
                <th key={h} className="px-3 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((t, i) => (
              <tr key={i} className="border-t border-line/70">
                <td className="px-3 py-2 font-mono text-[12px]">{t.date}</td>
                <td className="px-3 py-2 uppercase text-[11px]">{t.side}</td>
                <td className="px-3 py-2">
                  <Link to={`/research/${t.ticker}`} className="hover:text-gold">
                    {t.ticker}
                  </Link>
                </td>
                <td className="px-3 py-2 font-mono">{t.qty < 1 ? t.qty.toFixed(4) : t.qty.toFixed(0)}</td>
                <td className="px-3 py-2 font-mono">{inr(t.price, 2)}</td>
                <td className="px-3 py-2 font-mono">{inr(t.amount)}</td>
                <td className="px-3 py-2 text-mist">{t.reason}</td>
                <td className={`px-3 py-2 font-mono ${tone(t.pnl)}`}>{t.side === "buy" ? "—" : signedInr(t.pnl)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

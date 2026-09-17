import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api, inr, inrCompact, pct, signedInr, signedPct, tone } from "../api";

const ASSET_COLORS: Record<string, string> = {
  india: "#d4a84b",
  us: "#6aa6d6",
  commodities: "#c08457",
  bonds: "#8b9bb4",
  crypto: "#9b8cff",
};

type Dash = {
  sim_date: string;
  regime: string;
  budget: number;
  friday: boolean;
  kpis: {
    portfolio_value: number;
    wealth: number;
    cash: number;
    savings: number;
    cash_reserve_pct: number;
    reserve_target: number;
    daily_pnl: number;
    daily_pnl_pct: number;
    total_pnl: number;
    total_pnl_pct: number;
    drawdown_pct: number;
    peak: number;
    deployed_pct: number;
    n_positions: number;
    n_trades: number;
  };
  allocation: {
    asset: string;
    label: string;
    weight: number;
    min: number;
    max: number;
    target: number;
    value: number;
  }[];
  equity_curve: { date: string; wealth: number; pnl: number; regime: string }[];
  top_movers: { ticker: string; name: string; chg: number; pnl: number; weight: number }[];
  circuit_breaker: { tier: number; paused: boolean; pause_until: string | null; force_bear: boolean };
  agent_pulse: {
    desks: Record<string, { stance: string; blurb: string }>;
    nifty: { last: number; vs50: number };
    spx: { last: number; vs50: number };
  };
  initial_capital: number;
};

function Kpi({
  label,
  value,
  sub,
  subClass,
}: {
  label: string;
  value: string;
  sub?: string;
  subClass?: string;
}) {
  return (
    <div className="panel p-4">
      <div className="kicker">{label}</div>
      <div className="mt-1 font-mono text-[22px] font-medium tabular leading-none">{value}</div>
      {sub && <div className={`mt-1.5 text-[12px] ${subClass || "text-mist"}`}>{sub}</div>}
    </div>
  );
}

export default function Dashboard({ tick }: { tick: number }) {
  const [d, setD] = useState<Dash | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Dash>("/api/dashboard")
      .then(setD)
      .catch((e) => setErr(String(e.message || e)));
  }, [tick]);

  if (err) {
    return (
      <div className="panel p-8 text-sm text-mist">
        Backend not reachable. Start FastAPI on port 8000.
        <div className="mt-2 font-mono text-loss">{err}</div>
      </div>
    );
  }
  if (!d) return <div className="text-mist">Loading desk…</div>;

  const k = d.kpis;
  const pie = d.allocation.filter((a) => a.weight > 0.002);

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="kicker">Command Center</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">SNS Investment Desk</h1>
          <p className="mt-1 max-w-2xl text-[13px] text-mist">
            Four research agents feed a bull/bear desk. Capital is deployed under v3.1 risk rules —
            sector ranges, ATR stops, 30-day holds, and a 5% marked-to-market cash reserve.
          </p>
        </div>
        <Link
          to="/brief"
          className="rounded-md bg-gold/15 px-4 py-2 text-[13px] font-medium text-gold hover:bg-gold/25"
        >
          Open daily brief →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-6">
        <Kpi
          label="Portfolio (MTM)"
          value={inrCompact(k.portfolio_value)}
          sub={`${k.n_positions} names · ${k.n_trades} fills`}
        />
        <Kpi
          label="Today P/L"
          value={signedInr(k.daily_pnl)}
          sub={signedPct(k.daily_pnl_pct)}
          subClass={tone(k.daily_pnl)}
        />
        <Kpi
          label="Total P/L"
          value={signedInr(k.total_pnl)}
          sub={`${signedPct(k.total_pnl_pct)} vs ${inrCompact(d.initial_capital)} seed`}
          subClass={tone(k.total_pnl)}
        />
        <Kpi
          label="Drawdown from peak"
          value={pct(k.drawdown_pct)}
          sub={`Peak ${inrCompact(k.peak)}`}
          subClass={k.drawdown_pct > 0.1 ? "text-loss" : "text-mist"}
        />
        <Kpi
          label="Cash reserve"
          value={pct(k.cash_reserve_pct)}
          sub={`Target ${pct(k.reserve_target, 0)} · ${inrCompact(k.cash)} cash`}
          subClass={k.cash_reserve_pct < k.reserve_target ? "text-loss" : "text-gain"}
        />
        <Kpi
          label="Daily budget"
          value={inr(d.budget)}
          sub={d.friday ? "Friday cap Rs. 5,000" : `${d.regime} regime`}
        />
      </div>

      {d.circuit_breaker.paused && (
        <div className="rounded-md border border-loss/40 bg-loss/10 px-4 py-3 text-[13px] text-loss">
          Circuit breaker active (tier {d.circuit_breaker.tier}). New buying paused
          {d.circuit_breaker.pause_until ? ` until ${d.circuit_breaker.pause_until}` : ""}.
          {d.circuit_breaker.force_bear ? " Bear budget forced." : ""}
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="panel p-4 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="kicker">Wealth</div>
              <div className="text-sm text-mist">Marked portfolio + savings sleeve</div>
            </div>
            <div className="font-mono text-lg">{inr(k.wealth)}</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.equity_curve}>
                <defs>
                  <linearGradient id="w" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a84b" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#d4a84b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2c40" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#8b9bb4", fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={32} />
                <YAxis
                  tick={{ fill: "#8b9bb4", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  contentStyle={{ background: "#121a28", border: "1px solid #1e2c40", borderRadius: 8 }}
                  formatter={(v: number) => inr(v)}
                />
                <Area type="monotone" dataKey="wealth" stroke="#d4a84b" fill="url(#w)" strokeWidth={1.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-4">
          <div className="kicker">Sector allocation</div>
          <div className="mt-1 text-sm text-mist">Vs dynamic range · regime targets</div>
          <div className="mx-auto h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pie} dataKey="weight" nameKey="label" innerRadius={48} outerRadius={72} stroke="none">
                  {pie.map((a) => (
                    <Cell key={a.asset} fill={ASSET_COLORS[a.asset]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {d.allocation.map((a) => (
              <div key={a.asset} className="grid grid-cols-[1fr_auto] items-center gap-2 text-[12px]">
                <div>
                  <div className="flex justify-between">
                    <span className="text-paper">{a.label}</span>
                    <span className="font-mono">{pct(a.weight, 1)}</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded bg-ink-700">
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.min(100, a.weight * 100 * 2)}%`,
                        background: ASSET_COLORS[a.asset],
                      }}
                    />
                  </div>
                  <div className="mt-0.5 text-[10px] text-mist">
                    Band {pct(a.min, 0)}–{pct(a.max, 0)} · target {pct(a.target, 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-4">
          <div className="kicker">Agent pulse</div>
          <div className="mt-1 mb-3 text-sm text-mist">
            Nifty {d.agent_pulse.nifty.last.toFixed(0)} ({signedPct(d.agent_pulse.nifty.vs50)}) · SPX{" "}
            {d.agent_pulse.spx.last.toFixed(0)} ({signedPct(d.agent_pulse.spx.vs50)})
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(d.agent_pulse.desks).map(([key, desk]) => (
              <div key={key} className="rounded-md border border-line bg-ink-800 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] capitalize text-paper">{key} agent</span>
                  <span className={`text-[11px] uppercase ${desk.stance === "bullish" ? "text-gain" : desk.stance === "bearish" ? "text-loss" : "text-gold"}`}>
                    {desk.stance}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-snug text-mist">{desk.blurb}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-4">
          <div className="kicker">Book movers</div>
          <div className="mt-3 divide-y divide-line">
            {d.top_movers.length === 0 && <div className="text-sm text-mist">No open names.</div>}
            {d.top_movers.map((m) => (
              <Link
                key={m.ticker}
                to={`/research/${m.ticker}`}
                className="flex items-center justify-between py-2 text-[13px] hover:bg-ink-800/60"
              >
                <div>
                  <div className="font-medium">{m.ticker}</div>
                  <div className="text-[11px] text-mist">{m.name}</div>
                </div>
                <div className="text-right font-mono">
                  <div className={tone(m.chg)}>{signedPct(m.chg)}</div>
                  <div className={`text-[11px] ${tone(m.pnl)}`}>{signedInr(m.pnl)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-[12px]">
        <div className="panel px-4 py-3">
          <span className="text-mist">Savings (profits)</span>
          <div className="font-mono text-base text-gain">{inr(k.savings)}</div>
        </div>
        <div className="panel px-4 py-3">
          <span className="text-mist">Capital deployed</span>
          <div className="font-mono text-base">{pct(k.deployed_pct, 1)}</div>
        </div>
        <div className="panel px-4 py-3">
          <span className="text-mist">Cash on hand</span>
          <div className="font-mono text-base">{inr(k.cash)}</div>
        </div>
      </div>
    </div>
  );
}

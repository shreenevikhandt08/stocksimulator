import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, inr, pct, signedPct, tone } from "../api";

type Row = {
  ticker: string;
  name: string;
  asset: string;
  sector: string;
  subsector: string;
  score: number;
  quality_pass: boolean;
  blocked: string[];
  price: number;
  suggested_amount?: number;
  verdict?: string;
  conviction?: number;
  thesis?: string;
  bull?: string[];
  bear?: string[];
  breakdown: Record<string, number | null>;
};

type BriefData = {
  date: string;
  regime: string;
  budget: number;
  paused: boolean;
  pause_until: string | null;
  buys: Row[];
  watches: Row[];
  actions: { type: string; ticker: string; name: string; detail: string }[];
  message: string;
};

export default function Brief({ tick }: { tick: number }) {
  const [d, setD] = useState<BriefData | null>(null);
  useEffect(() => {
    api<BriefData>("/api/suggestions").then(setD);
  }, [tick]);
  if (!d) return <div className="text-mist">Preparing the brief…</div>;

  return (
    <div className="space-y-5">
      <div>
        <div className="kicker">Daily brief · {d.date}</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">What to invest today</h1>
        <p className="mt-1 max-w-3xl text-[13px] text-mist">{d.message}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="panel p-4">
          <div className="kicker">Regime</div>
          <div className="mt-1 text-lg capitalize">{d.regime}</div>
        </div>
        <div className="panel p-4">
          <div className="kicker">Deployable budget</div>
          <div className="mt-1 font-mono text-lg">{inr(d.budget)}</div>
        </div>
        <div className="panel p-4">
          <div className="kicker">Desk status</div>
          <div className="mt-1 text-lg">{d.paused ? "Buying paused" : "Open for tickets"}</div>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-medium">Recommended tickets</h2>
          <span className="text-[12px] text-mist">Cleared quality filter · ranked by multi-factor score</span>
        </div>
        <div className="space-y-3">
          {d.buys.length === 0 && (
            <div className="panel p-6 text-sm text-mist">
              No clean buys this session. Check watches, or wait for circuit-breaker / Friday constraints to lift.
            </div>
          )}
          {d.buys.map((b, i) => (
            <article key={b.ticker} className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="font-mono text-2xl text-mist">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <Link to={`/research/${b.ticker}`} className="text-lg font-semibold hover:text-gold">
                      {b.ticker}
                      <span className="ml-2 text-sm font-normal text-mist">{b.name}</span>
                    </Link>
                    <div className="mt-1 text-[12px] uppercase tracking-wide text-mist">
                      {b.asset} · {b.sector} · {b.subsector}
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <div className="kicker">Score</div>
                    <div className="font-mono text-xl">{b.score.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="kicker">Suggested size</div>
                    <div className="font-mono text-xl">{inr(b.suggested_amount || 0)}</div>
                  </div>
                  <div>
                    <div className="kicker">Desk verdict</div>
                    <div
                      className={`text-xl font-semibold ${
                        b.verdict === "BUY" ? "text-gain" : b.verdict === "AVOID" ? "text-loss" : "text-gold"
                      }`}
                    >
                      {b.verdict}
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 max-w-4xl text-[13px] leading-relaxed text-mist">{b.thesis}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-md border border-gain/25 bg-gain/5 p-3">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-gain">Bull desk</div>
                  <ul className="mt-2 space-y-1 text-[12px] text-paper/90">
                    {(b.bull || []).map((p) => (
                      <li key={p}>· {p}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-md border border-loss/25 bg-loss/5 p-3">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-loss">Bear desk</div>
                  <ul className="mt-2 space-y-1 text-[12px] text-paper/90">
                    {(b.bear || []).map((p) => (
                      <li key={p}>· {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 font-mono text-[11px] text-mist">
                {Object.entries(b.breakdown).map(
                  ([k, v]) =>
                    v != null && (
                      <span key={k}>
                        {k} {Number(v).toFixed(0)}
                      </span>
                    )
                )}
                <span>Last {inr(b.price, 2)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel p-4">
          <h2 className="text-base font-medium">Watchlist (blocked this session)</h2>
          <div className="mt-3 divide-y divide-line">
            {d.watches.map((w) => (
              <div key={w.ticker} className="flex items-center justify-between py-2 text-[13px]">
                <Link to={`/research/${w.ticker}`} className="hover:text-gold">
                  {w.ticker} <span className="text-mist">{w.name}</span>
                </Link>
                <span className="text-[11px] text-mist">{w.blocked.join(" · ")}</span>
              </div>
            ))}
            {d.watches.length === 0 && <div className="text-sm text-mist">No blocked high-scorers.</div>}
          </div>
        </section>
        <section className="panel p-4">
          <h2 className="text-base font-medium">Risk actions on the book</h2>
          <div className="mt-3 space-y-2">
            {d.actions.length === 0 && <div className="text-sm text-mist">No maturity, stop, or concentration alerts.</div>}
            {d.actions.map((a, i) => (
              <div key={i} className="rounded-md border border-line bg-ink-800 px-3 py-2 text-[13px]">
                <div className="flex justify-between">
                  <Link to={`/research/${a.ticker}`} className="font-medium hover:text-gold">
                    {a.ticker}
                  </Link>
                  <span className="uppercase text-[11px] text-gold">{a.type}</span>
                </div>
                <div className="text-mist">{a.detail}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

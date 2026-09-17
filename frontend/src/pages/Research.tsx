import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api, inr, signedPct, tone } from "../api";

type Agent = {
  agent: string;
  title: string;
  mandate: string;
  stance: string;
  confidence: number;
  score: number;
  summary: string;
  signals: { label: string; value: string; tone: string }[];
  headlines?: { date: string; title: string; tone: string }[];
};

type Research = {
  ticker: string;
  name: string;
  asset: string;
  sector: string;
  subsector: string;
  industry_group: string;
  price: number;
  as_of: string;
  agents: Agent[];
  debate: {
    bull: { conviction: number; points: string[] };
    bear: { conviction: number; points: string[] };
    verdict: string;
    conviction: number;
    rationale: string;
    composite_score: number;
    quality_passed: boolean;
    quality_flags: Record<string, boolean>;
  };
  score: { score: number; breakdown: Record<string, number | null>; mode: string };
  chart: { date: string; close: number; volume: number }[];
};

type Inst = { ticker: string; name: string };

export default function Research({ tick }: { tick: number }) {
  const { ticker: param } = useParams();
  const nav = useNavigate();
  const [q, setQ] = useState(param || "TCS");
  const [list, setList] = useState<Inst[]>([]);
  const [data, setData] = useState<Research | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api<Inst[]>("/api/instruments").then(setList);
  }, []);

  useEffect(() => {
    const t = (param || q || "TCS").toUpperCase();
    setQ(t);
    setErr(null);
    api<Research>(`/api/research/${t}`)
      .then(setData)
      .catch(() => setErr("Ticker not in universe"));
  }, [param, tick]);

  const suggestions = useMemo(() => {
    const s = q.toUpperCase();
    return list.filter((i) => i.ticker.includes(s) || i.name.toUpperCase().includes(s)).slice(0, 8);
  }, [q, list]);

  const go = (t: string) => nav(`/research/${t.toUpperCase()}`);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="kicker">Research desk</div>
          <h1 className="mt-1 text-2xl font-semibold">Four agents. One argument.</h1>
          <p className="mt-1 max-w-2xl text-[13px] text-mist">
            Market, social, news, and fundamentals file independently. Bull and bear desks then argue the
            ticket. This is the same pipeline that feeds daily buy suggestions.
          </p>
        </div>
        <form
          className="relative w-72"
          onSubmit={(e) => {
            e.preventDefault();
            go(q);
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ticker or name"
            className="w-full rounded-md border border-line bg-ink-800 px-3 py-2 text-sm outline-none focus:border-gold/50"
          />
          {q && suggestions.length > 0 && q.toUpperCase() !== param && (
            <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border border-line bg-ink-800">
              {suggestions.map((s) => (
                <button
                  type="button"
                  key={s.ticker}
                  onClick={() => go(s.ticker)}
                  className="block w-full px-3 py-1.5 text-left text-[13px] hover:bg-ink-700"
                >
                  <span className="font-mono">{s.ticker}</span>
                  <span className="ml-2 text-mist">{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {err && <div className="text-sm text-loss">{err}</div>}
      {!data && !err && <div className="text-mist">Running the desk…</div>}
      {data && (
        <>
          <div className="panel grid gap-4 p-5 md:grid-cols-[1fr_280px]">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">
                  {data.ticker}{" "}
                  <span className="text-base font-normal text-mist">{data.name}</span>
                </h2>
                <span className="rounded-full bg-ink-700 px-2 py-0.5 text-[11px] uppercase text-mist">
                  {data.asset} · {data.subsector}
                </span>
              </div>
              <div className="mt-1 font-mono text-2xl">{inr(data.price, 2)}</div>
              <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-mist">{data.debate.rationale}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(data.debate.quality_flags).map(([k, v]) => (
                  <span
                    key={k}
                    className={`rounded-full px-2 py-0.5 text-[11px] ${v ? "bg-gain/15 text-gain" : "bg-loss/15 text-loss"}`}
                  >
                    {k.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-md border border-line bg-ink-800 p-4 text-center">
              <div className="kicker">Researcher team</div>
              <div
                className={`mt-2 text-3xl font-semibold ${
                  data.debate.verdict === "BUY" ? "text-gain" : data.debate.verdict === "AVOID" ? "text-loss" : "text-gold"
                }`}
              >
                {data.debate.verdict}
              </div>
              <div className="mt-1 font-mono text-sm text-mist">
                Score {data.score.score.toFixed(1)} · conviction {(data.debate.conviction * 100).toFixed(0)}%
              </div>
              <div className="mt-3 text-[12px] text-mist">{data.industry_group}</div>
            </div>
          </div>

          <div className="panel p-4">
            <div className="kicker">Last 120 sessions</div>
            <div className="h-48">
              <ResponsiveContainer>
                <AreaChart data={data.chart}>
                  <CartesianGrid stroke="#1e2c40" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={["auto", "auto"]} tick={{ fill: "#8b9bb4", fontSize: 11 }} width={70} />
                  <Tooltip
                    contentStyle={{ background: "#121a28", border: "1px solid #1e2c40" }}
                    formatter={(v: number) => inr(v, 2)}
                  />
                  <Area type="monotone" dataKey="close" stroke="#6aa6d6" fill="#6aa6d620" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {data.agents.map((a) => (
              <article key={a.agent} className="panel p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-mist">{a.mandate}</div>
                    <h3 className="text-base font-medium">{a.title}</h3>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-[12px] font-medium uppercase ${
                        a.stance === "bullish" ? "text-gain" : a.stance === "bearish" ? "text-loss" : "text-gold"
                      }`}
                    >
                      {a.stance}
                    </div>
                    <div className="font-mono text-sm">{a.score.toFixed(0)}</div>
                  </div>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-mist">{a.summary}</p>
                <ul className="mt-3 space-y-1.5">
                  {a.signals.map((s) => (
                    <li key={s.label} className="flex justify-between gap-3 text-[12px]">
                      <span className="text-mist">{s.label}</span>
                      <span className={`${s.tone === "pos" ? "text-gain" : s.tone === "neg" ? "text-loss" : "text-paper"} text-right`}>
                        {s.value}
                      </span>
                    </li>
                  ))}
                </ul>
                {a.headlines && (
                  <div className="mt-3 space-y-1 border-t border-line pt-3">
                    {a.headlines.slice(0, 3).map((h, i) => (
                      <div key={i} className="text-[12px]">
                        <span className="font-mono text-[10px] text-mist">{h.date} </span>
                        <span className={h.tone === "pos" ? "text-gain" : h.tone === "neg" ? "text-loss" : ""}>
                          {h.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-gain/30 bg-gain/5 p-5">
              <div className="flex justify-between">
                <h3 className="font-medium text-gain">Bullish agent</h3>
                <span className="font-mono text-sm">{(data.debate.bull.conviction * 100).toFixed(0)}%</span>
              </div>
              <p className="mt-1 text-[12px] text-mist">Why the stock could go up.</p>
              <ul className="mt-3 space-y-2 text-[13px]">
                {data.debate.bull.points.map((p) => (
                  <li key={p}>· {p}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-loss/30 bg-loss/5 p-5">
              <div className="flex justify-between">
                <h3 className="font-medium text-loss">Bearish agent</h3>
                <span className="font-mono text-sm">{(data.debate.bear.conviction * 100).toFixed(0)}%</span>
              </div>
              <p className="mt-1 text-[12px] text-mist">Why the stock could go down.</p>
              <ul className="mt-3 space-y-2 text-[13px]">
                {data.debate.bear.points.map((p) => (
                  <li key={p}>· {p}</li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

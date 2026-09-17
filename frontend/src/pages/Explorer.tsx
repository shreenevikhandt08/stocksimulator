import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, inr, pct, signedPct, tone } from "../api";

type Row = {
  ticker: string;
  name: string;
  asset: string;
  sector: string;
  subsector: string;
  industry_group: string;
  price: number;
  chg: number;
  score: number;
  breakdown: Record<string, number | null>;
  mode: string;
  quality_pass: boolean;
  quality_flags: Record<string, boolean>;
  held: boolean;
};

export default function Explorer({ tick }: { tick: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [asset, setAsset] = useState("all");
  const [q, setQ] = useState("");
  const [onlyPass, setOnlyPass] = useState(true);

  useEffect(() => {
    api<{ rows: Row[]; groups: string[] }>("/api/explorer").then((d) => {
      setRows(d.rows);
      setGroups(d.groups);
    });
  }, [tick]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (asset !== "all" && r.asset !== asset) return false;
      if (onlyPass && !r.quality_pass) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!r.ticker.toLowerCase().includes(s) && !r.name.toLowerCase().includes(s) && !r.subsector.includes(s))
          return false;
      }
      return true;
    });
  }, [rows, asset, q, onlyPass]);

  return (
    <div className="space-y-5">
      <div>
        <div className="kicker">Universe · {rows.length} names</div>
        <h1 className="mt-1 text-2xl font-semibold">Score explorer</h1>
        <p className="mt-1 text-[13px] text-mist">
          Momentum 35% · Volume 20% · News 15% · Earnings 15% · Relative strength 15%. Bonds ranked by yield.
          Quality filter: 3 of 5.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {["all", "india", "us", "commodities", "bonds", "crypto"].map((a) => (
          <button
            key={a}
            onClick={() => setAsset(a)}
            className={`rounded-full px-3 py-1 text-[12px] capitalize ${
              asset === a ? "bg-ink-700 text-paper" : "border border-line text-mist"
            }`}
          >
            {a}
          </button>
        ))}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter"
          className="ml-auto rounded-md border border-line bg-ink-800 px-3 py-1.5 text-sm"
        />
        <label className="flex items-center gap-2 text-[12px] text-mist">
          <input type="checkbox" checked={onlyPass} onChange={(e) => setOnlyPass(e.target.checked)} />
          Quality pass only
        </label>
      </div>

      {groups.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {groups.map((g) => (
            <span key={g} className="rounded-full border border-line px-2 py-0.5 text-[10px] text-mist">
              {g}
            </span>
          ))}
        </div>
      )}

      <div className="panel overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-[13px]">
          <thead className="border-b border-line text-[11px] uppercase tracking-wider text-mist">
            <tr>
              {["Score", "Ticker", "Last", "Chg", "Mom", "Vol", "News", "Earn", "RS", "Q"].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 80).map((r) => (
              <tr key={r.ticker} className="border-b border-line/70 hover:bg-ink-800/50">
                <td className="px-3 py-2 font-mono text-gold">{r.score.toFixed(1)}</td>
                <td className="px-3 py-2">
                  <Link to={`/research/${r.ticker}`} className="font-medium hover:text-gold">
                    {r.ticker}
                  </Link>
                  {r.held && <span className="ml-2 text-[10px] uppercase text-gain">held</span>}
                  <div className="text-[11px] text-mist">
                    {r.name} · {r.subsector}
                  </div>
                </td>
                <td className="px-3 py-2 font-mono">{inr(r.price, 2)}</td>
                <td className={`px-3 py-2 font-mono ${tone(r.chg)}`}>{signedPct(r.chg)}</td>
                {["momentum", "volume", "news", "earnings", "rs"].map((k) => (
                  <td key={k} className="px-3 py-2 font-mono text-mist">
                    {r.breakdown[k] == null ? "—" : Number(r.breakdown[k]).toFixed(0)}
                  </td>
                ))}
                <td className="px-3 py-2">
                  <span className={r.quality_pass ? "text-gain" : "text-loss"}>{r.quality_pass ? "PASS" : "FAIL"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-[12px] text-mist">Showing {Math.min(80, filtered.length)} of {filtered.length} after filters.</div>
    </div>
  );
}

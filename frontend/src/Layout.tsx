import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Microscope,
  Briefcase,
  Globe2,
  LineChart,
  ClipboardList,
  Scale,
  Play,
  FastForward,
  RotateCcw,
} from "lucide-react";
import { api } from "./api";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/", label: "Command Center", icon: LayoutDashboard, end: true },
  { to: "/brief", label: "Daily Brief", icon: Newspaper },
  { to: "/research", label: "Research Desk", icon: Microscope },
  { to: "/portfolio", label: "The Book", icon: Briefcase },
  { to: "/explorer", label: "Universe", icon: Globe2 },
  { to: "/performance", label: "Performance", icon: LineChart },
  { to: "/monthly", label: "Monthly Review", icon: ClipboardList },
  { to: "/rules", label: "Rules Engine", icon: Scale },
];

type Health = { sim_date: string; universe: number };

export default function Layout({
  onAdvance,
  busy,
  simDate,
  regime,
}: {
  onAdvance: (days: number) => void;
  busy: boolean;
  simDate?: string;
  regime?: string;
}) {
  const [health, setHealth] = useState<Health | null>(null);
  useEffect(() => {
    api<Health>("/api/health").then(setHealth).catch(() => {});
  }, [simDate]);

  return (
    <div className="flex min-h-screen bg-ink-950">
      <aside className="sticky top-0 flex h-screen w-[232px] shrink-0 flex-col border-r border-line bg-ink-900">
        <div className="border-b border-line px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-gold/15 font-mono text-sm font-semibold text-gold">
              SNS
            </div>
            <div>
              <div className="text-[15px] font-semibold tracking-tight">SNS Capital</div>
              <div className="text-[11px] text-mist">Multi-Agent Desk · v3.1</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition ${
                  isActive
                    ? "bg-ink-700 text-paper"
                    : "text-mist hover:bg-ink-800 hover:text-paper"
                }`
              }
            >
              <item.icon size={16} strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-4 text-[11px] leading-relaxed text-mist">
          Simulated tape. Not investment advice.
          <div className="mt-1 font-mono text-[10px] text-mist/70">
            {health?.universe ?? "—"} instruments · institutional research
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-ink-950/90 px-6 backdrop-blur">
          <div className="flex items-center gap-4">
            <div>
              <div className="kicker">Session</div>
              <div className="font-mono text-sm">{simDate ?? health?.sim_date ?? "—"}</div>
            </div>
            {regime && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${
                  regime === "bull"
                    ? "bg-gain/15 text-gain"
                    : regime === "bear"
                      ? "bg-loss/15 text-loss"
                      : "bg-gold/15 text-gold"
                }`}
              >
                {regime} regime
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={busy}
              onClick={() => onAdvance(1)}
              className="flex items-center gap-1.5 rounded-md border border-line bg-ink-800 px-3 py-1.5 text-[12px] text-paper hover:border-gold/40 disabled:opacity-40"
            >
              <Play size={13} /> Advance day
            </button>
            <button
              disabled={busy}
              onClick={() => onAdvance(5)}
              className="flex items-center gap-1.5 rounded-md border border-line bg-ink-800 px-3 py-1.5 text-[12px] text-paper hover:border-gold/40 disabled:opacity-40"
            >
              <FastForward size={13} /> Run 5 days
            </button>
            <button
              disabled={busy}
              onClick={() => onAdvance(0)}
              className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-[12px] text-mist hover:text-paper disabled:opacity-40"
              title="Reset simulation"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

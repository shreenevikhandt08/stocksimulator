import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { api } from "./api";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Brief from "./pages/Brief";
import Research from "./pages/Research";
import Portfolio from "./pages/Portfolio";
import Explorer from "./pages/Explorer";
import Performance from "./pages/Performance";
import Monthly from "./pages/Monthly";
import Rules from "./pages/Rules";

type DashLite = { sim_date: string; regime: string };

export default function App() {
  const [meta, setMeta] = useState<DashLite | null>(null);
  const [busy, setBusy] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => {
    api<DashLite>("/api/dashboard")
      .then((d) => setMeta({ sim_date: d.sim_date, regime: d.regime }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, tick]);

  const onAdvance = async (days: number) => {
    setBusy(true);
    try {
      if (days === 0) await api("/api/sim/reset", { method: "POST" });
      else if (days === 1) await api("/api/sim/next", { method: "POST" });
      else await api("/api/sim/run", { method: "POST", body: JSON.stringify({ days }) });
      setTick((t) => t + 1);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Routes>
      <Route
        element={
          <Layout
            onAdvance={onAdvance}
            busy={busy}
            simDate={meta?.sim_date}
            regime={meta?.regime}
          />
        }
      >
        <Route path="/" element={<Dashboard tick={tick} />} />
        <Route path="/brief" element={<Brief tick={tick} />} />
        <Route path="/research" element={<Research tick={tick} />} />
        <Route path="/research/:ticker" element={<Research tick={tick} />} />
        <Route path="/portfolio" element={<Portfolio tick={tick} />} />
        <Route path="/explorer" element={<Explorer tick={tick} />} />
        <Route path="/performance" element={<Performance tick={tick} />} />
        <Route path="/monthly" element={<Monthly tick={tick} />} />
        <Route path="/rules" element={<Rules tick={tick} />} />
      </Route>
    </Routes>
  );
}

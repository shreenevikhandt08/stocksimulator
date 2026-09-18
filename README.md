# SNS Capital

B2B investment desk. You start with **Rs 10,000**, pick names across **industry, startups, commodity, bonds, crypto**, invest at **live prices**, and track **P/L** on the real calendar.

Boss rules: **`backend/config/rules.json`**. Live/app settings: **`backend/config/app.json`**. Book on disk: **`backend/data/portfolio.json`**. Browser prefs (theme, amount): **localStorage**.

---

## Run

```powershell
cd e:\stockmarket
.\run.ps1
```

Linux / Mac:

```bash
chmod +x ./run.sh
./run.sh
```

Open **http://127.0.0.1:8000** (or whatever `PORT` you set) in the browser.

- Do **not** open `frontend/site/index.html` from disk — `/api` and `/static` will not load.
- If you see `Already running: …`, the desk is up; just open the URL.
- After code or config changes, stop uvicorn (Ctrl+C) and run the script again.
- Hard-refresh the browser (**Ctrl+F5**) after UI updates.

First run creates `backend/.venv` and installs dependencies automatically.

### Environment files

| File | Purpose |
|---|---|
| `backend/.env.example` | Local template — copy to `backend/.env` |
| `backend/.env.production.example` | Hosting template (`HOST=0.0.0.0`, public CORS) |
| `.env.example` | Optional repo-root env (backend `.env` wins on conflicts) |
| `backend/.env` | Your secrets — **gitignored**, never commit |

```powershell
Copy-Item backend\.env.example backend\.env
# edit HOST, PORT, API keys, CORS_ORIGINS
```

Key variables:

```env
APP_ENV=development
HOST=127.0.0.1
PORT=8000
CORS_ORIGINS=http://127.0.0.1:8000,http://localhost:8000
LIVE_DATA=true
LIVE_POLL_SECONDS=3.0
ALPHA_VANTAGE_API_KEY=
FINNHUB_API_KEY=
```

Process env (`$env:PORT`, Railway/Render `PORT`, etc.) overrides the file. Rules stay in `rules.json`, not `.env`.

### Hosting checklist

1. Copy `backend/.env.production.example` → `backend/.env` on the server.
2. Set `HOST=0.0.0.0`, `PORT` to the platform port, `APP_ENV=production`.
3. Set `CORS_ORIGINS` to your public `https://` URL(s).
4. Put API keys in the host’s secret store or `.env`.
5. Run `./run.sh` (or `uvicorn app.main:app --host $HOST --port $PORT` from `backend/`).
6. Point a reverse proxy (nginx / Caddy / platform) at that port; serve the same origin so the SPA’s `/api` calls work.

Docker (optional):

```bash
# ensure backend/.env exists
docker compose up --build
```
---

## Check it works

### 1. API health

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/health
```

Expect: `status: ok`, `calendar_date` = today, `live.live: true`, `live.source` like `yahoo` or `yahoo+alphavantage`.

### 2. Live tape in the UI

1. Open http://127.0.0.1:8000
2. Top bar should show **Live · yahoo** (or similar)
3. Price cells on Dashboard / Trade / Holdings should update every few seconds

### 3. Dashboard & invest

1. **Dashboard** → pick a suggested name → **Invest** → enter amount → confirm
2. Holding appears; **Cash** drops; P/L strip updates
3. **Holdings** shows open P/L at live last price

### 4. Research agents

1. **Research** → search e.g. `TCS`, `BTC`, `GOLD`
2. Four agents + bull vs bear debate → **BUY / HOLD / AVOID**
3. Price on the card uses live tape when available

### 5. Past sessions (read-only)

1. Use **← Prev** or the date dropdown in the top bar
2. Banner: *closed session — review only*
3. You can view P/L and holdings for that day; you cannot buy or edit

### 6. Quick API smoke test

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/dashboard
Invoke-RestMethod http://127.0.0.1:8000/api/today
```

---

## How to use it

1. **Dashboard** — charts, allocation, up to **20** suggestions, one-click **Invest** per name.
2. **Trade** — split an amount across the shortlist, or invest in one name.
3. **Research** — full LangGraph run on a single ticker.
4. **Holdings** — live open P/L, buy more, sleeve breakdown.
5. Session runs on **today’s real date**. Past days are **read-only** (no editing history).
6. **Light / Dark** toggle is in the sidebar footer.

Amount above cash is treated as a **new contribution**, not profit.

---

## Agents (`backend/app/agents/`)

LangGraph pipeline (`graph.py`):

```
market → social → news → fundamentals → bull vs bear → verdict
```

| File | Job |
|---|---|
| `graph.py` | LangGraph orchestrator |
| `market_agent.py` | Price, trend, volume |
| `social_agent.py` | X / Reddit sentiment (from book tape) |
| `news_agent.py` | Headlines and earnings (from book tape) |
| `fundamentals_agent.py` | P/E, ROE, growth |
| `bullish_agent.py` | Bull case |
| `bearish_agent.py` | Bear case |
| `researcher_team.py` | Market overview helper |

**Shortlist (Dashboard / Trade):** fast `score_universe` + quality flags — same rule engine, no full LangGraph on all 20 names.

**Research page:** full LangGraph + live price overlay when tape is on.

---

## Realtime data — what is actually live?

| Layer | Live? | Source |
|---|---|---|
| UI ↔ API | Yes | Same origin `http://127.0.0.1:8000` |
| Last prices (display) | Yes | Yahoo Finance poll ~3s + SSE `/api/quotes/stream` |
| Buy / fill price | Yes | `live_price()` on today’s session |
| Open P/L | Yes | Marks to live last |
| Optional overlay | Yes | Alpha Vantage if key in `.env` |
| Agent signals (Research) | Partial | Scoring uses local `MarketBook` history; price shown can be live |
| Social / news text | No | Simulated in the book, not live Twitter/news APIs |
| Exchange WebSocket | No | HTTP poll only; after hours = last print |

---

## Config reference

| File | Purpose |
|---|---|
| `backend/config/rules.json` | Cash, sleeves, caps, stops, drawdown, scoring, `suggestion_count` |
| `backend/config/app.json` | Defaults for live poll, host, port, data file |
| `backend/.env` | `HOST`, `PORT`, `CORS_ORIGINS`, `APP_ENV`, live keys (overrides app.json) |
| `backend/.env.example` | Safe template for local setup |
| `backend/.env.production.example` | Safe template for VPS / cloud |
| `frontend/.env` | Vite: `VITE_API_BASE` → backend URL (e.g. `https://apitrade.snsihub.ai`) |
| `frontend/site/config.js` | Vanilla SPA: `window.__SNS__.apiBase` (empty = same origin) |
| `backend/data/portfolio.json` | Persisted book |

---

## Screens

- **Dashboard** — P/L charts, allocation, suggestions, invest
- **Trade** — amount, plan, skip, invest all
- **Research** — search + agents + debate
- **Holdings** — positions, live P/L, history

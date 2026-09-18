const NAV_GROUPS = [
  {
    label: "Desk",
    items: [
      ["#/", "Dashboard", "home"],
      ["#/trade", "Trade", "trade"],
      ["#/portfolio", "Portfolio", "portfolio"],
    ],
  },
  {
    label: "Analysis",
    items: [
      ["#/research", "Research", "search"],
      ["#/backtest", "Backtest", "chart"],
    ],
  },
  {
    label: "Governance",
    items: [
      ["#/rules", "Rules", "rules"],
    ],
  },
];
const NAV = NAV_GROUPS.flatMap((g) => g.items);

const NAV_ICO = {
  home: `<svg class="nav-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg>`,
  trade: `<svg class="nav-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 16h6l3-8 3 5h4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 20h16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  portfolio: `<svg class="nav-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.75"/><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.75"/><path d="M3 12h18" stroke="currentColor" stroke-width="1.75"/></svg>`,
  search: `<svg class="nav-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.75"/><path d="m16 16 4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  chart: `<svg class="nav-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 19V5M4 19h16" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M8 15v-3M12 15V8M16 15v-5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  rules: `<svg class="nav-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 4h9a2 2 0 0 1 2 2v14l-3-1.5L13 20l-3-1.5L7 20V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/><path d="M10 9h6M10 13h6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  logout: `<svg class="nav-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 7V6a2 2 0 0 1 2-2h7v16h-7a2 2 0 0 1-2-2v-1M14 12H4m0 0 3-3M4 12l3 3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const UI_ICO = {
  chevronLeft: `<svg class="ui-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6 9 12l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevronRight: `<svg class="ui-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  sun: `<svg class="ui-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.75"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  moon: `<svg class="ui-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 14.5A7.5 7.5 0 0 1 9.5 4 6.5 6.5 0 1 0 20 14.5Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/></svg>`,
  login: `<svg class="ui-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 7V6a2 2 0 0 0-2-2H5v16h7a2 2 0 0 0 2-2v-1M10 12H20m0 0-3-3m3 3-3 3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  signup: `<svg class="ui-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" stroke-width="1.75"/><path d="M4 20c1.8-3.2 4.6-5 8-5s6.2 1.8 8 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>`,
  eye: `<svg class="ui-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.75" stroke="currentColor" stroke-width="1.75"/></svg>`,
  eyeOff: `<svg class="ui-ico" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 3l18 18M10.5 10.6a2.75 2.75 0 0 0 3.9 3.9M7.1 7.3C5.2 8.4 3.7 10.1 2.5 12c0 0 3.5 5.5 9.5 5.5 1.5 0 2.9-.3 4.1-.8M16.8 16.5c1.7-1 3.1-2.5 4.2-4.5 0 0-3.5-5.5-9.5-5.5-.8 0-1.5.1-2.2.2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

function sidebarOpenPref() {
  return mem.get("sidebarOpen", true) !== false;
}

function applySidebarState(open = sidebarOpenPref()) {
  const desk = document.querySelector(".desk-with-sidebar");
  if (!desk) return;
  desk.classList.toggle("sidebar-open", open);
  desk.classList.toggle("sidebar-collapsed", !open);
  document.querySelectorAll("[data-sidebar-toggle]").forEach((btn) => {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (btn.classList.contains("sidebar-shrink")) {
      btn.setAttribute("aria-label", open ? "Collapse navigation" : "Expand navigation");
      btn.innerHTML = open ? UI_ICO.chevronLeft : UI_ICO.chevronRight;
    } else if (btn.classList.contains("menu-mobile-btn")) {
      btn.textContent = open ? "Close" : "Menu";
    }
  });
}

function isMobileDesk() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function navPageId(href) {
  return href === "#/" ? "home" : href.slice(2);
}

function pageLabel(page) {
  if (page === "account") return "Account";
  const hit = NAV.find((item) => navPageId(item[0]) === page);
  return hit ? hit[1] : "Desk";
}

function navAbbr(label) {
  const w = String(label || "").trim();
  if (w.length <= 3) return w.toUpperCase();
  return w.slice(0, 2);
}

function sidebarLinkHtml([href, label, icon], page) {
  const on = navPageId(href) === page;
  const ico = NAV_ICO[icon] || NAV_ICO.home;
  return `<a href="${href}" class="sidebar-link${on ? " on" : ""}" title="${esc(label)}"${on ? ' aria-current="page"' : ""}>
    <span class="sidebar-ico" aria-hidden="true">${ico}</span>
    <span class="sidebar-lbl">${esc(label)}</span>
  </a>`;
}

function sidebarNavHtml(page) {
  return `<div class="sidebar-nav-list">${NAV.map((item) => sidebarLinkHtml(item, page)).join("")}</div>`;
}

function userInitial(user) {
  const s = String(user?.name || user?.username || user?.email || "?").trim();
  return (s[0] || "?").toUpperCase();
}

const mem = {
  get(k, fb) { try { const r = localStorage.getItem("sns." + k); return r == null ? fb : JSON.parse(r); } catch { return fb; } },
  set(k, v) { localStorage.setItem("sns." + k, JSON.stringify(v)); },
  del(k) { localStorage.removeItem("sns." + k); },
};

let busy = false, deskMeta = {}, viewDate = mem.get("viewDate", null);
let dateFocus = mem.get("dateFocus", null); // weekend picker: highlight last session vs calendar today
let researchPicks = mem.get("researchPicks", []);

function authToken() { return mem.get("token", null); }
function authUser() { return mem.get("user", null); }
function setAuth(token, user) { mem.set("token", token); mem.set("user", user); }
function clearAuth() { mem.del("token"); mem.del("user"); }

function theme() { return document.documentElement.getAttribute("data-theme") || "dark"; }
function setTheme(t) { document.documentElement.setAttribute("data-theme", t === "light" ? "light" : "dark"); mem.set("theme", t); }
setTheme(mem.get("theme", "dark"));

const inr = (n, d = 0) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: d, minimumFractionDigits: d }).format(n || 0);
const tone = (n) => (n > 0 ? "pos" : n < 0 ? "neg" : "neu");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const signed = (n) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${inr(Math.abs(n))}`;
const fmtQty = (q) => { const n = Number(q) || 0; return Math.abs(n - Math.round(n)) > 1e-6 || n < 1 ? n.toFixed(4) : String(Math.round(n)); };

const GLOSSARY = {
  "Money you put in": "Lifetime total you contributed — not what you invested today. Stays the same on days you skip.",
  "Worth now": "Holdings + cash + savings right now.",
  "Overall result": "Worth now − money you put in.",
  "Overall P/L": "Worth now − money you put in.",
  "Today P/L": "This session’s wealth move (book + cash + savings), excluding new deposits.",
  "Today’s change": "This session’s wealth move (book + cash + savings), excluding new deposits.",
  "Session change": "That session’s wealth move (book + cash + savings), excluding new deposits.",
  "Earlier days": "Sum of closed sessions’ wealth moves (ex deposits).",
  "Session P/L total": "Today + earlier days. Should track Overall P/L closely.",
  "Past P/L": "All earlier sessions’ net.",
  "Combined P/L": "Today + earlier session nets.",
  "Last 7": "Sum of the latest up to 7 sessions’ wealth moves (ex deposits) — not the same as Overall.",
  "Book value": "Holdings only at live price. Not cash or savings.",
  "Cash": "Money free to invest.",
  "Savings": "Profits locked from sells/trims — not new deposits.",
  "Wealth": "Book + Cash + Savings.",
  "Session history": "One row per session.",
  "Net": "Session wealth P/L (ex deposits).",
  "Profit": "Positive part of the session move.",
  "Loss": "Negative part of the session move.",
  "Cost": "What you paid: qty × avg cost.",
  "Value": "Worth now: qty × live price.",
  "Open P/L": "Value − cost.",
  "Avg cost": "Average buy price per unit.",
  "Qty": "Units you own.",
  "Ticker": "Exchange code, e.g. TCS.",
  "Sleeve": "India, US, Commodities, Bonds, or Crypto.",
  "Score": "0–100 fit to today’s rules.",
  "Verdict": "BUY, HOLD, or AVOID.",
  "Risk": "Higher = more volatility.",
  "Composite score": "Combined research score after debate.",
  "Bull conviction": "Bull agent’s conviction.",
  "Bear conviction": "Bear agent’s caution.",
  "Market agent": "Price/trend agent.",
  "Sentiment": "Social mood agent.",
  "News": "Headline news agent.",
  "Fundamentals": "Financials agent.",
  "BUY": "Agents favour buying.",
  "HOLD": "Wait — not a strong buy.",
  "AVOID": "Skip for now.",
  "Regime": "Market mood: bull / bear / sideways.",
  "Deployed": "Cash spent on buys that day.",
  "P/L": "Profit or loss.",
  "Holdings": "Names you currently own.",
  "Idle day": "No invest that day.",
};

function tip(label, key) {
  const text = GLOSSARY[key || label];
  if (!text) return esc(label);
  return `<span class="has-tip" tabindex="0" data-tip="${esc(text)}">${esc(label)}</span>`;
}

function verdictBadge(v) {
  const c = String(v || "—").toUpperCase();
  const cls = c === "BUY" ? "verdict-buy" : c === "AVOID" ? "verdict-avoid" : "verdict-hold";
  return `<span class="verdict ${cls}">${esc(c)}</span>`;
}

function tickerCell(ticker, name) {
  const sym = String(ticker || "?").slice(0, 2);
  return `<div class="ticker-cell"><span class="ticker-sym" aria-hidden="true">${esc(sym)}</span><div class="ticker-meta"><span class="ticker-code">${esc(ticker)}</span><span class="ticker-name">${esc(name)}</span></div></div>`;
}

function scoreCell(score) {
  const s = Math.min(100, Math.max(0, Math.round(Number(score) || 0)));
  const tier = s >= 70 ? "high" : s >= 50 ? "mid" : "low";
  return `<div class="score-cell ${tier}"><span class="score-num mono">${s}</span><span class="score-track"><i style="width:${s}%"></i></span></div>`;
}

function plCard(title, tipKey, profit, loss, net, sub = "", { variant = "" } = {}) {
  const p = Number(profit) || 0, l = Number(loss) || 0, n = Number(net) || 0;
  return `
    <div class="pl-card${variant ? ` pl-card-${variant}` : ""}">
      <div class="pl-card-hd">${tip(title, tipKey)}</div>
      <div class="pl-stats">
        <div class="pl-stat"><span class="pl-lbl">Profit</span><span class="pl-val pos mono">${inr(p)}</span></div>
        <div class="pl-stat"><span class="pl-lbl">Loss</span><span class="pl-val neg mono">${l ? "−" : ""}${inr(l)}</span></div>
        <div class="pl-stat pl-net"><span class="pl-lbl">Net</span><span class="pl-val mono ${tone(n)}">${signed(n)}</span></div>
      </div>
      ${sub ? `<div class="pl-sub">${sub}</div>` : ""}
    </div>`;
}

function moneyWords(n) {
  const v = Math.abs(Number(n) || 0);
  if (v >= 1e7) return `≈ ₹${(v / 1e7).toFixed(2)} crore`;
  if (v >= 1e5) return `≈ ₹${(v / 1e5).toFixed(2)} lakh`;
  if (v >= 1e3) return `≈ ₹${(v / 1e3).toFixed(1)} thousand`;
  return "";
}

function moneySummary(meta, { editBook = false } = {}) {
  const p = meta?.pnl || {};
  const book = Number(p.book ?? meta?.portfolio ?? 0) || 0;
  const cash = Number(p.cash ?? meta?.cash ?? 0) || 0;
  const savings = Number(p.savings ?? meta?.savings ?? 0) || 0;
  const wealth = Number(p.wealth) || (book + cash + savings);
  const todayNet = Number(p.today) || 0;
  const putIn = Number(p.contributed ?? meta?.contributed ?? 0) || 0;
  const overall = Number(p.overall != null ? p.overall : wealth - putIn) || 0;
  const overallPct = putIn > 0 ? (overall / putIn) * 100 : 0;
  const holdings = meta?.n_holdings ?? meta?.holdings?.length ?? 0;
  const putInEdit = editBook && !meta?.readonly
    ? `<div class="port-box-edit">
         <input id="contributedInput" class="mono" type="number" min="0" step="1" value="${Math.round(putIn)}" aria-label="Money put in" />
         <button type="button" class="btn btn-sm" id="contributedSaveBtn">Save</button>
       </div>`
    : `<em>Capital contributed</em>`;

  return `
    <div class="money-summary money-summary-boxes">
      <div class="port-boxes port-boxes-6">
        <div class="port-box">
          <span>Cash</span>
          <strong class="mono">${inr(cash)}</strong>
          ${savings > 0 ? `<em>Savings ${inr(savings)}</em>` : `<em>Available to invest</em>`}
        </div>
        <div class="port-box">
          <span>Invested</span>
          <strong class="mono">${inr(book)}</strong>
          <em>Book · ${holdings} holding${holdings === 1 ? "" : "s"}</em>
        </div>
        <div class="port-box">
          <span>Total worth</span>
          <strong class="mono">${inr(wealth)}</strong>
          <em>Cash + book${savings > 0 ? " + savings" : ""}</em>
        </div>
        <div class="port-box">
          <span>Today</span>
          <strong class="mono ${tone(todayNet)}">${signed(todayNet)}</strong>
          <em>This session</em>
        </div>
        <div class="port-box">
          <span>Put in</span>
          <strong class="mono">${inr(putIn)}</strong>
          ${putInEdit}
        </div>
        <div class="port-box">
          <span>Overall</span>
          <strong class="mono ${tone(overall)}">${signed(overall)}</strong>
          <em>${overallPct.toFixed(1)}% vs put-in</em>
        </div>
      </div>
    </div>`;
}

function capitalBreakdown(meta) {
  return moneySummary(meta);
}

function pnlBreakdown(meta) {
  return "";
}

function pageHero(title, sub) {
  return `<div class="page-hero"><h1 class="page-title">${esc(title)}</h1>${sub ? `<p class="page-sub">${sub}</p>` : ""}</div>`;
}

function pnlTrio(profit, loss, net, sub = "", { tips = false } = {}) {
  const lbl = (l, k) => tips ? tip(l, k) : esc(l);
  const p = Number(profit) || 0, l = Number(loss) || 0, n = Number(net) || 0;
  return `
    <div class="pnl-trio">
      <div class="trio-row"><span class="trio-lbl">${lbl("Profit", "Profit")}</span><span class="num pos">${inr(p)}</span></div>
      <div class="trio-row"><span class="trio-lbl">${lbl("Loss", "Loss")}</span><span class="num neg">${l ? "−" : ""}${inr(l)}</span></div>
      <div class="trio-row net"><span class="trio-lbl">${lbl("Net", "Net")}</span><span class="num ${tone(n)}">${signed(n)}</span></div>
      ${sub ? `<div class="sub">${sub}</div>` : ""}
    </div>`;
}

async function api(path, init, { auth = true } = {}) {
  const method = (init && init.method) || "GET";
  let url = path;
  if (method === "GET" && viewDate) url += (path.includes("?") ? "&" : "?") + "as_of=" + encodeURIComponent(viewDate);
  const headers = { "Content-Type": "application/json", ...(init?.headers || {}) };
  const token = authToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(url, { headers, ...(init || {}) });
  } catch (err) {
    const m = String(err?.message || err || "");
    if (/failed to fetch|networkerror|load failed/i.test(m)) {
      throw new Error("Server unreachable — run .\\run.ps1 and keep http://127.0.0.1:8000 open, then retry.");
    }
    throw new Error(m || "Network error");
  }
  if (res.status === 401 && auth) {
    clearAuth();
    if (!["login", "signup"].includes(route().page)) location.hash = "#/login";
    throw new Error("Please log in");
  }
  if (!res.ok) {
    const text = await res.text();
    try { const j = JSON.parse(text); throw new Error(typeof j.detail === "string" ? j.detail : text); }
    catch (e) { if (e instanceof SyntaxError) throw new Error(text || res.statusText); throw e; }
  }
  return res.json();
}

function hideToast() {
  const el = document.getElementById("toast");
  if (!el) return;
  clearTimeout(window.__toastT);
  el.hidden = true;
  el.setAttribute("hidden", "");
  el.classList.add("is-hidden");
  el.innerHTML = "";
}

function toast(msg, ok = true, opts = {}) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.hidden = true;
    el.setAttribute("hidden", "");
    document.body.appendChild(el);
  }
  const raw = String(msg || "").trim();
  const rulesHint = /sleeve|reserve|cooldown|quality|blackout|paused|max position|subsector|drawdown|deployable|blocked/i.test(raw);
  let tone = opts.tone || (ok === "warn" ? "warn" : ok ? "ok" : "bad");
  if (!opts.tone && ok === false && rulesHint) tone = "warn";
  const blockedHint = /blocked|paused|cannot|failed|denied|over the|above deployable|login required|markets are closed/i.test(raw);
  if (!opts.tone && (ok === false || blockedHint) && (rulesHint || blockedHint)) tone = ok === false ? "bad" : "warn";
  const duration = opts.duration ?? (opts.actions?.length ? 14000 : tone === "bad" ? 10000 : tone === "warn" ? 8500 : 4200);
  const pretty = prettyDeskMessage(raw);
  const title = opts.title || (blockedHint || rulesHint ? (tone === "bad" ? "Blocked" : "Desk rules") : tone === "ok" ? "Update" : tone === "warn" ? "Warning" : "Needs attention");
  el.className = `toast ${tone}${opts.actions?.length ? " toast-action" : ""}${tone === "bad" || tone === "warn" ? " toast-urgent" : ""}`;
  el.classList.remove("is-hidden");
  el.removeAttribute("hidden");
  el.hidden = false;
  el.innerHTML = "";
  const row = document.createElement("div");
  row.className = "toast-top";
  const mark = document.createElement("span");
  mark.className = "toast-mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = tone === "ok" ? "✓" : tone === "warn" ? "!" : "✕";
  row.appendChild(mark);
  const copy = document.createElement("div");
  copy.className = "toast-copy";
  const titleEl = document.createElement("div");
  titleEl.className = "toast-title";
  titleEl.textContent = title;
  const text = document.createElement("div");
  text.className = "toast-msg";
  text.textContent = pretty;
  copy.appendChild(titleEl);
  copy.appendChild(text);
  row.appendChild(copy);
  const close = document.createElement("button");
  close.type = "button";
  close.className = "toast-close";
  close.setAttribute("aria-label", "Dismiss");
  close.title = "Dismiss";
  close.textContent = "×";
  close.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideToast();
  });
  row.appendChild(close);
  el.appendChild(row);
  if (opts.href) {
    const linkRow = document.createElement("div");
    linkRow.className = "toast-actions";
    const view = document.createElement("button");
    view.type = "button";
    view.className = "btn btn-sm btn-ghost";
    view.textContent = "View";
    view.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideToast();
      navigateHash(opts.href, { focusTicker: opts.focusTicker || null });
    });
    linkRow.appendChild(view);
    el.appendChild(linkRow);
  }
  if (opts.actions?.length) {
    const actions = document.createElement("div");
    actions.className = "toast-actions";
    opts.actions.forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `btn btn-sm ${a.primary ? "btn-buy" : "btn-ghost"}`;
      b.textContent = a.label;
      b.addEventListener("click", async () => {
        hideToast();
        try { await a.onClick?.(); } catch (err) { toast(err.message || String(err), false); }
      });
      actions.appendChild(b);
    });
    el.appendChild(actions);
  }
  // Click toast body → same destination as View
  if (opts.href) {
    el.style.cursor = "pointer";
    el.onclick = (e) => {
      if (e.target.closest("button, a")) return;
      hideToast();
      navigateHash(opts.href, { focusTicker: opts.focusTicker || null });
    };
  } else {
    el.style.cursor = "";
    el.onclick = null;
  }
  clearTimeout(window.__toastT);
  window.__toastT = setTimeout(() => { hideToast(); }, duration);
  if (!opts.skipInbox || opts.forceInbox) {
    const kind = tone === "ok" ? "info" : tone === "warn" ? "rules" : "alert";
    pushNotif({
      id: opts.id || `toast:${Date.now()}`,
      kind,
      title,
      body: pretty,
      href: opts.href || "#/trade",
      sticky: !!opts.actions?.length || tone === "bad",
      meta: opts.focusTicker ? { ticker: opts.focusTicker } : null,
    });
    updateNotifBadge();
  }
  if ((tone === "bad" || tone === "warn") && !opts.quietBell) {
    const bell = document.getElementById("notifBell");
    bell?.classList.add("notif-bell-pulse");
    setTimeout(() => bell?.classList.remove("notif-bell-pulse"), 4000);
  }
}

function prettyDeskMessage(msg) {
  let s = String(msg || "").trim();
  if (!s) return s;
  s = s.replace(/\bus\b/gi, "US");
  s = s.replace(/\bindia\b/gi, "India");
  s = s.replace(/\bcrypto\b/gi, "Crypto");
  s = s.replace(/\bbonds\b/gi, "Bonds");
  s = s.replace(/\bcommodities\b/gi, "Commodities");
  if (!/[.!?]$/.test(s)) s += ".";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function hideTopNotice() {
  const host = document.getElementById("topNotice");
  if (!host) return;
  clearTimeout(window.__topNoticeT);
  host.classList.remove("is-visible");
  host.hidden = true;
  host.setAttribute("hidden", "");
  host.innerHTML = "";
}

/** Professional top-right notice — used for auth (sign-in / sign-up / sign-out). */
function topNotice(msg, tone = "ok", opts = {}) {
  let host = document.getElementById("topNotice");
  if (!host) {
    host = document.createElement("div");
    host.id = "topNotice";
    host.setAttribute("role", "status");
    host.setAttribute("aria-live", "polite");
    document.body.appendChild(host);
  }
  const t = tone === "warn" || tone === "bad" || tone === "ok" ? tone : (tone ? "ok" : "bad");
  host.className = `top-notice top-notice-${t} is-visible`;
  host.removeAttribute("hidden");
  host.hidden = false;
  host.innerHTML = `
    <div class="top-notice-inner">
      <span class="top-notice-mark" aria-hidden="true">${t === "ok" ? "✓" : t === "warn" ? "!" : "×"}</span>
      <div class="top-notice-copy">
        ${opts.title ? `<strong class="top-notice-title">${esc(opts.title)}</strong>` : ""}
        <p class="top-notice-msg">${esc(msg)}</p>
      </div>
      <button type="button" class="top-notice-close" aria-label="Dismiss">×</button>
    </div>`;
  host.querySelector(".top-notice-close")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    hideTopNotice();
  });
  clearTimeout(window.__topNoticeT);
  window.__topNoticeT = setTimeout(() => { hideTopNotice(); }, opts.duration ?? (t === "bad" ? 7000 : 4500));
}

function queueAuthNotice(msg, tone = "ok", opts = {}) {
  mem.set("authNotice", { msg, tone, title: opts.title || "", ts: Date.now() });
}

function flushAuthNotice() {
  const n = mem.get("authNotice", null);
  if (!n?.msg) return;
  mem.del("authNotice");
  // Only show if fresh (avoid stale after long idle)
  if (Date.now() - (n.ts || 0) > 30_000) return;
  topNotice(n.msg, n.tone || "ok", { title: n.title, duration: 5000 });
}

/* ── Notification inbox (bell) ── */
const NOTIF_MAX = 40;

function notifList() {
  const list = mem.get("notifs", []);
  return Array.isArray(list) ? list : [];
}

function saveNotifs(list) {
  mem.set("notifs", list.slice(0, NOTIF_MAX));
  updateNotifBadge();
}

function pushNotif(n) {
  if (!n?.body && !n?.title) return;
  const list = notifList();
  const id = String(n.id || `n:${Date.now()}`);
  const existing = list.findIndex((x) => x.id === id);
  const row = {
    id,
    kind: n.kind || "info",
    title: n.title || "Update",
    body: n.body || "",
    href: n.href || "#/",
    ts: n.ts || Date.now(),
    read: existing >= 0 ? list[existing].read : false,
    sticky: !!n.sticky,
    meta: n.meta || null,
  };
  if (existing >= 0) list.splice(existing, 1);
  list.unshift(row);
  saveNotifs(list);
}

function markNotifsRead(ids) {
  const set = ids ? new Set(ids) : null;
  const list = notifList().map((n) => (set && !set.has(n.id) ? n : { ...n, read: true }));
  saveNotifs(list);
}

function clearNotifs() {
  mem.set("notifs", []);
  updateNotifBadge();
}

function removeNotif(id) {
  if (!id) return;
  saveNotifs(notifList().filter((n) => n.id !== id));
}

function unreadNotifCount() {
  return notifList().filter((n) => !n.read && n.kind !== "suggest" && !String(n.id).startsWith("opp:")).length;
}

function updateNotifBadge() {
  const badge = document.getElementById("notifBadge");
  const bell = document.getElementById("notifBell");
  if (!badge) return;
  const n = unreadNotifCount();
  const urgent = notifList().some((x) => !x.read && (x.kind === "alert" || x.kind === "action" || x.kind === "rules"));
  badge.textContent = n > 9 ? "9+" : String(n);
  badge.hidden = n === 0;
  badge.classList.toggle("notif-badge-urgent", urgent && n > 0);
  bell?.classList.toggle("has-unread", n > 0);
  bell?.classList.toggle("has-urgent", urgent && n > 0);
  const stripCount = document.getElementById("deskAlertCount");
  if (stripCount) stripCount.textContent = String(n);
}

function syncDeskInbox(meta) {
  if (!meta || meta.readonly) return;
  const day = meta.calendar_date || meta.session_date || "";
  if (meta.suggestions?.length) mem.set("lastSuggestions", meta.suggestions);
  if (meta.alternatives?.length) mem.set("lastAlternatives", meta.alternatives);
  const pending = Array.isArray(meta.pending_actions) ? meta.pending_actions : [];
  const pendingIds = new Set(pending.map((a) => `pending:${a.id}`));

  // Drop stale pending + old suggestion rows (ideas have their own panel)
  let list = notifList().filter((n) => {
    if (String(n.id).startsWith("opp:") || n.kind === "suggest") return false;
    if (String(n.id).startsWith("pending:") && !pendingIds.has(n.id)) return false;
    return true;
  });
  mem.set("notifs", list);

  pending.forEach((a) => {
    pushNotif({
      id: `pending:${a.id}`,
      kind: "action",
      title: `Approve sell · ${a.ticker}`,
      body: `${a.reason} · ~${inr(a.amount)}. Rules will only sell if you approve.`,
      href: "#/portfolio",
      sticky: true,
      meta: { actionId: a.id, ticker: a.ticker },
    });
  });

  if (meta.paused) {
    pushNotif({
      id: `pause:${day}`,
      kind: "alert",
      title: "Buying paused",
      body: `Drawdown circuit breaker until ${fmtDate(meta.pause_until) || "—"}. Resume on Trade if you accept the risk.`,
      href: "#/trade",
      sticky: true,
    });
  }

  const hours = meta.market_hours || {};
  const openLbl = hours.open || "09:15";
  const closeLbl = hours.close || "15:30";
  const status = String(meta.market_status || (meta.market_open ? "open" : "closed"));
  if (status === "open" || meta.market_open) {
    pushNotif({
      id: `market-open:${day}`,
      kind: "info",
      title: "Markets open",
      body: `NSE cash session is live until ${closeLbl} IST. Invest is unlocked on Trade.`,
      href: "#/trade",
    });
  } else if (status === "closed") {
    pushNotif({
      id: `market-close:${day}`,
      kind: "info",
      title: "Markets closed",
      body: `Session ended at ${closeLbl} IST. Buys lock until ${openLbl} IST next open day.`,
      href: "#/",
    });
  } else if (status === "preopen") {
    pushNotif({
      id: `market-preopen:${day}`,
      kind: "info",
      title: "Markets open soon",
      body: `Pre-open — NSE cash session starts at ${openLbl} IST.`,
      href: "#/trade",
    });
  } else if (status === "weekend") {
    pushNotif({
      id: `market-weekend:${day}`,
      kind: "info",
      title: "Weekend — markets closed",
      body: `No regular session today. Next open ${openLbl} IST Monday–Friday.`,
      href: "#/",
    });
  }

  if (meta.can_trade && !meta.invested_today) {
    pushNotif({
      id: `idle:${day}`,
      kind: "info",
      title: "No invest yet today",
      body: "Cash is sitting idle. Open Trade to put money to work, or skip intentionally.",
      href: "#/trade",
    });
  }

  (meta.day_trades || []).slice(0, 8).forEach((t, i) => {
    const ticker = String(t.ticker || "").toUpperCase();
    pushNotif({
      id: `trade:${day}:${t.side}:${ticker}:${t.amount}:${i}`,
      kind: "info",
      title: `${String(t.side || "").toUpperCase()} · ${ticker}`,
      body: `${fmtQty(t.qty)} @ ${inr(t.price)} · ${inr(t.amount)}`,
      href: "#/portfolio",
      meta: { ticker },
    });
  });
}

function notifKindLabel(kind) {
  if (kind === "action") return "Action";
  if (kind === "alert") return "Risk";
  if (kind === "rules") return "Rules";
  if (kind === "suggest") return "Idea";
  return "Update";
}

function qualityChipsHtml(b) {
  const q = b?.quality || {};
  const keys = [
    ["earnings_trend", "Earn"],
    ["news_positive", "News"],
    ["above_200dma", "Trend"],
    ["rs_positive", "RS"],
    ["volume_above_avg", "Vol"],
  ];
  if ("value" in q) keys.push(["value", "Value"]);
  const count = Number(b?.quality_count);
  const passN = Number.isFinite(count) ? count : keys.filter(([k]) => k !== "value" && q[k]).length;
  const need = 3;
  return `
    <div class="q-chips" title="Quality filter: need ${need} of 5">
      <span class="q-chips-count mono ${passN >= need ? "pos" : "neg"}">${passN}/${keys.filter(([k]) => k !== "value").length || 5}</span>
      ${keys.map(([k, lab]) => `<span class="q-chip ${q[k] ? "on" : "off"}">${lab}</span>`).join("")}
    </div>`;
}

function suggestionsPanelHtml(meta) {
  const pending = Array.isArray(meta?.pending_actions) ? meta.pending_actions : [];
  const suggestions = (meta?.suggestions?.length ? meta.suggestions : mem.get("lastSuggestions", []) || []);
  const buys = suggestions.filter((s) => String(s.verdict || "").toUpperCase() === "BUY").slice(0, 6);
  const holds = [
    ...suggestions.filter((s) => String(s.verdict || "").toUpperCase() !== "BUY"),
    ...(meta?.alternatives?.length ? meta.alternatives : mem.get("lastAlternatives", []) || []),
  ].slice(0, 6);
  const sellBlock = pending.length
    ? `<div class="ideas-sec">
        <h4>Sell or keep holding</h4>
        <p class="tiny muted">Rules queued these exits — Approve sell, or Keep to hold.</p>
        <div class="ideas-list">
          ${pending.map((a) => `
            <div class="ideas-row ideas-row-action">
              <span class="ideas-rank mono">SELL</span>
              <span class="ideas-main">
                <strong class="mono">${esc(a.ticker)}</strong>
                <span>${esc(a.reason || "Rule exit")}</span>
                <em>~${inr(a.amount)}</em>
              </span>
              <span class="ideas-actions">
                <button type="button" class="btn btn-sm btn-buy" data-approve="${esc(a.id)}">Approve sell</button>
                <button type="button" class="btn btn-sm btn-ghost" data-reject="${esc(a.id)}">Keep holding</button>
              </span>
            </div>`).join("")}
        </div>
      </div>`
    : "";
  const buyBlock = buys.length
    ? `<div class="ideas-sec">
        <h4>BUY ideas</h4>
        <div class="ideas-list">
          ${buys.map((b, i) => {
            const score = Math.min(100, Math.max(0, Math.round(Number(b.score) || 0)));
            return `
            <a class="ideas-row" href="#/research/${esc(b.ticker)}">
              <span class="ideas-rank mono">#${i + 1}</span>
              <span class="ideas-main">
                <strong class="mono">${esc(b.ticker)}</strong>
                <span>${esc(b.name || "")}</span>
                <em>${esc((b.bull || b.why || "Rules shortlist").slice(0, 90))}</em>
                ${qualityChipsHtml(b)}
              </span>
              <span class="ideas-score">
                <strong class="mono">${score}</strong>
                <span class="ideas-bar"><i style="width:${score}%"></i></span>
              </span>
            </a>`;
          }).join("")}
        </div>
      </div>`
    : "";
  const holdBlock = holds.length
    ? `<div class="ideas-sec">
        <h4>HOLD / watch</h4>
        <p class="tiny muted">Passed quality but score below BUY floor — keep on watch, not primary buys.</p>
        <div class="ideas-list">
          ${holds.map((b) => {
            const score = Math.min(100, Math.max(0, Math.round(Number(b.score) || 0)));
            return `
            <a class="ideas-row" href="#/research/${esc(b.ticker)}">
              <span class="ideas-rank mono verdict-hold">HOLD</span>
              <span class="ideas-main">
                <strong class="mono">${esc(b.ticker)}</strong>
                <span>${esc(b.name || "")}</span>
                ${qualityChipsHtml(b)}
              </span>
              <span class="ideas-score"><strong class="mono">${score}</strong></span>
            </a>`;
          }).join("")}
        </div>
      </div>`
    : "";
  const body = (sellBlock || buyBlock || holdBlock)
    ? `${sellBlock}${buyBlock}${holdBlock}
        <div class="ideas-ft">
          <a class="btn btn-primary btn-sm" href="#/trade">Open Trade</a>
          <a class="btn btn-ghost btn-sm" href="#/rules">Boss rules</a>
          <a class="btn btn-ghost btn-sm" href="#/research">Research</a>
        </div>`
    : `<p class="notif-empty">No live ideas yet. Open <a href="#/trade">Trade</a> after Preview, or read the full checklist on <a href="#/rules">Rules</a>.</p>`;

  return `
    <div class="ideas-panel" id="ideasPanel" hidden>
      <div class="ideas-panel-hd">
        <div>
          <strong>Suggestions</strong>
          <span class="tiny muted">BUY · HOLD · Sell / Keep holding</span>
        </div>
        <button type="button" class="btn btn-icon notif-close" id="ideasClose" aria-label="Close" title="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="ideas-panel-bd">${body}</div>
    </div>`;
}

function notifPanelHtml(meta) {
  const items = notifList().filter((n) => n.kind !== "suggest" && !String(n.id).startsWith("opp:") && !String(n.id).startsWith("risk:"));
  const unread = items.filter((n) => !n.read).length;

  const activity = items.length
    ? `<ul class="notif-list">${items.slice(0, 14).map((n) => {
        const href = resolveNotifHref(n);
        const ticker = String(n.meta?.ticker || "").toUpperCase();
        return `
      <li class="notif-row ${n.read ? "is-read" : "is-unread"}" data-notif-id="${esc(n.id)}" data-notif-href="${esc(href)}" data-notif-ticker="${esc(ticker)}">
        <div class="notif-row-top">
          <span class="notif-tag kind-${esc(n.kind)}">${esc(notifKindLabel(n.kind))}</span>
          <time>${esc(fmtNotifTime(n.ts))}</time>
          <button type="button" class="notif-dismiss" data-notif-dismiss="${esc(n.id)}" aria-label="Dismiss">Dismiss</button>
        </div>
        <strong class="notif-row-title">${esc(n.title)}</strong>
        <p class="notif-row-body">${esc(n.body)}</p>
        <div class="notif-row-actions">
          ${n.kind === "action" && n.meta?.actionId ? `
            <button type="button" class="btn btn-sm btn-buy" data-notif-approve="${esc(n.meta.actionId)}">Approve sell</button>
            <button type="button" class="btn btn-sm btn-ghost" data-notif-reject="${esc(n.meta.actionId)}">Keep</button>` : ""}
          <a class="btn btn-sm btn-ghost" href="${esc(href)}" data-notif-view="${esc(n.id)}">Open</a>
        </div>
      </li>`;
      }).join("")}</ul>`
    : `<div class="notif-empty-card">
        <strong>You're all caught up</strong>
        <p>Rule sells, pauses, and session notes appear here. Ideas stay under the lightbulb.</p>
      </div>`;

  return `
    <div class="notif-panel" id="notifPanel" hidden>
      <div class="notif-panel-hd">
        <div>
          <strong>Alerts</strong>
          <span class="tiny muted">${unread ? `${unread} unread` : "No unread"}</span>
        </div>
        <div class="notif-panel-tools">
          <button type="button" class="btn btn-sm btn-ghost" id="notifMarkRead">Mark read</button>
          <button type="button" class="btn btn-sm btn-ghost" id="notifClear">Clear</button>
          <button type="button" class="btn btn-icon notif-close" id="notifClose" aria-label="Close panel" title="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
      <div class="notif-stack">${activity}</div>
    </div>`;
}


function fmtNotifTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch { return "—"; }
}

async function notifyDesk(meta) {
  if (!meta || meta.readonly || viewDate) return;
  syncDeskInbox(meta);
  const key = `deskNotify:${meta.calendar_date || meta.session_date || ""}`;
  const seen = mem.get(key, {}) || {};
  const pending = Array.isArray(meta.pending_actions) ? meta.pending_actions : [];
  const hours = meta.market_hours || {};
  const openLbl = hours.open || "09:15";
  const closeLbl = hours.close || "15:30";
  const status = String(meta.market_status || (meta.market_open ? "open" : "closed"));

  if (pending.length) {
    const a = pending[0];
    const more = pending.length > 1 ? ` (+${pending.length - 1} more)` : "";
    toast(
      `Rules want to sell ${a.ticker}: ${a.reason}${more}. Approve to execute — also in the bell.`,
      false,
      {
        id: `toast-pending:${a.id}`,
        href: "#/trade",
        skipInbox: true,
        duration: 20000,
        actions: [
          {
            label: "Approve sell",
            primary: true,
            onClick: async () => {
              const res = await api("/api/rules/pending/approve", { method: "POST", body: JSON.stringify({ id: a.id }) });
              toast(`Sold ${res.ticker} · ${fmtQty(res.qty)} @ ${inr(res.price, 2)}`, true);
              await render();
            },
          },
          {
            label: "Keep holding",
            onClick: async () => {
              await api("/api/rules/pending/reject", { method: "POST", body: JSON.stringify({ id: a.id }) });
              toast(`Kept ${a.ticker} — sell dismissed for today`);
              await render();
            },
          },
        ],
      }
    );
    return;
  }

  if (meta.paused && !seen.pause) {
    seen.pause = 1;
    mem.set(key, seen);
    toast(`Buying paused until ${fmtDate(meta.pause_until) || "—"} — open the bell or Trade to resume.`, false, { id: `toast-pause:${key}`, href: "#/trade", title: "Buying paused", duration: 10000, forceInbox: true });
    return;
  }

  // Market open / close session alerts (once per calendar day)
  if ((status === "open" || meta.market_open) && !seen.marketOpen) {
    seen.marketOpen = 1;
    mem.set(key, seen);
    toast(`Markets open — NSE session live until ${closeLbl} IST. Invest unlocked on Trade.`, true, {
      id: `toast-market-open:${key}`,
      title: "Markets open",
      href: "#/trade",
      duration: 7000,
    });
    return;
  }
  if (status === "closed" && !seen.marketClose) {
    seen.marketClose = 1;
    mem.set(key, seen);
    toast(`Markets closed at ${closeLbl} IST — buys lock until ${openLbl} IST next open session.`, "warn", {
      id: `toast-market-close:${key}`,
      title: "Markets closed",
      href: "#/",
      duration: 7000,
    });
    return;
  }
  if (status === "preopen" && !seen.marketPreopen) {
    seen.marketPreopen = 1;
    mem.set(key, seen);
    toast(`Pre-open — markets start at ${openLbl} IST.`, true, {
      id: `toast-market-preopen:${key}`,
      title: "Markets open soon",
      href: "#/trade",
      duration: 6000,
    });
    return;
  }

  if (meta.can_trade && !meta.invested_today && !seen.idle) {
    seen.idle = 1;
    mem.set(key, seen);
    toast("You haven’t invested today — ideas are in the bell.", true, { id: `toast-idle:${key}`, href: "#/trade", skipInbox: true, duration: 5000 });
    return;
  }

  const buys = (meta.suggestions || []).filter((s) => String(s.verdict || "").toUpperCase() === "BUY");
  if (meta.can_trade && buys.length && !seen.opp) {
    seen.opp = 1;
    mem.set(key, seen);
    const top = buys[0];
    toast(`Opportunity: ${top.ticker} looks like a BUY — open Suggestions (lightbulb).`, true, { id: `toast-opp:${key}`, href: `#/research/${top.ticker}`, skipInbox: true, duration: 5500 });
  }
}

function route() {
  const parts = (location.hash || "#/").replace(/^#/, "").split("/").filter(Boolean);
  const raw = parts[0] || "home";
  const tickers = (parts[1] || "").split(/[,+]/).map((t) => t.trim().toUpperCase()).filter(Boolean);
  return { page: raw === "today" ? "trade" : raw, tickers };
}

/** Force navigation even when the hash is unchanged (e.g. already on Trade). */
function navigateHash(href, { focusTicker = null } = {}) {
  const target = String(href || "#/").startsWith("#") ? String(href) : `#${String(href).replace(/^#/, "")}`;
  if (focusTicker) mem.set("focusTicker", String(focusTicker).toUpperCase());
  const cur = location.hash || "#/";
  if (cur === target) {
    // Same route — still re-render so focus/scroll apply
    render();
  } else {
    location.hash = target;
  }
}

function resolveNotifHref(n) {
  if (!n) return "#/";
  const ticker = String(n.meta?.ticker || "").toUpperCase();
  if (n.href && n.href !== "#/" && n.href !== "#") return n.href;
  if (n.kind === "action" && ticker) return `#/portfolio`;
  if (n.kind === "alert" && String(n.id || "").startsWith("pause:")) return "#/trade";
  if (n.kind === "rules") return "#/rules";
  if (ticker) return `#/research/${ticker}`;
  return n.href || "#/trade";
}

function focusHoldingsTicker(ticker) {
  const t = String(ticker || mem.get("focusTicker", "") || "").toUpperCase();
  if (!t) return;
  mem.del("focusTicker");
  const row = document.querySelector(`tr[data-ticker="${t}"]`);
  if (!row) return;
  // Expand parent details if collapsed
  const details = row.closest("details.holdings-details");
  if (details && !details.open) details.open = true;
  row.classList.add("is-focus-row");
  row.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => row.classList.remove("is-focus-row"), 2800);
}


function bookValueOf(meta) {
  const p = meta?.pnl || {};
  return Number(p.book ?? meta?.portfolio ?? meta?.mtm ?? 0) || 0;
}

function pnlStrip(meta) {
  return `
    <section class="metrics-bar">
      <div class="metrics-inner">
        ${moneySummary(meta)}
      </div>
    </section>`;
}

function metricsBarTrade(meta) {
  const p = meta?.pnl || {};
  const todayProfit = p.today_profit ?? Math.max(Number(p.today) || 0, 0);
  const todayLoss = p.today_loss ?? Math.abs(Math.min(Number(p.today) || 0, 0));
  return `
    <section class="metrics-bar metrics-compact">
      <div class="metrics-inner kpi-grid kpi-grid-3">
        <div class="kpi-card kpi-featured">
          <span class="kpi-label">${tip("Cash to invest", "Cash")}</span>
          <span class="kpi-value mono">${inr(meta?.cash ?? 0)}</span>
          <span class="kpi-meta">For today's picks</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">${tip("Book value", "Book value")}</span>
          <span class="kpi-value mono">${inr(bookValueOf(meta))}</span>
          <span class="kpi-meta">${meta?.n_holdings ?? 0} holdings</span>
        </div>
        ${plCard("Today", "Today P/L", todayProfit, todayLoss, p.today)}
      </div>
    </section>`;
}

function metricsBarPnlOnly(meta) {
  return `
    <section class="metrics-bar metrics-pnl-only">
      <div class="metrics-inner">
        ${moneySummary(meta)}
      </div>
    </section>`;
}

function topMetrics(meta, page) {
  // Capital/P&L detail lives on Portfolio. Trade has its own compact strip.
  // Dashboard owns analytics charts — no duplicate moneySummary here.
  if (page === "home" || page === "research" || page === "trade" || page === "portfolio" || page === "backtest" || page === "rules" || page === "account") return "";
  return pnlStrip(meta);
}

function activityLabel(d, prev) {
  const buys = Number(d.buy_count) || 0;
  const sells = Number(d.sell_count) || 0;
  const deployed = Number(d.deployed) || 0;
  const budget = Number(d.budget) || 0;
  let savDelta = Number(d.savings_delta);
  if (!Number.isFinite(savDelta) && prev) savDelta = (Number(d.savings) || 0) - (Number(prev.savings) || 0);
  const invested =
    d.activity === "invested" ||
    d.invested === true ||
    buys > 0 ||
    deployed > 0.5 ||
    budget > 0.5;
  if (invested) return { cls: "act-invested", text: "Invested" };
  if (d.activity === "rules" || sells > 0 || savDelta > 50) {
    return { cls: "act-rules", text: "Auto rules" };
  }
  return { cls: "act-idle", text: "Did not invest" };
}

function daySummary(d, act, prev) {
  const buys = Number(d.buy_count) || 0;
  const sells = Number(d.sell_count) || 0;
  const deployed = Number(d.deployed) || 0;
  let savDelta = Number(d.savings_delta);
  if (!Number.isFinite(savDelta) && prev) savDelta = (Number(d.savings) || 0) - (Number(prev.savings) || 0);
  if (act.cls === "act-invested") {
    return `Deployed ${inr(deployed || 0)}${buys ? ` · ${buys} buy${buys === 1 ? "" : "s"}` : ""}`;
  }
  if (act.cls === "act-rules") {
    return `No invest · ${sells || "auto"} exit${sells === 1 ? "" : "s"} · ${savDelta > 1 ? `${signed(savDelta)} locked to Savings` : "rules trimmed positions"}`;
  }
  return "No invest · holdings marked to market";
}

function pnlDailyTable(days, { title = "Session history", canReset = true } = {}) {
  const rows = (days || []).slice().reverse();
  if (!rows.length) {
    return `<div class="history-empty muted">No session days yet. Open the desk on a trading day to start tracking — investing is optional.</div>`;
  }
  const totalProfit = rows.reduce((s, d) => s + Math.max(Number(d.pnl) || 0, 0), 0);
  const totalLoss = rows.reduce((s, d) => s + Math.abs(Math.min(Number(d.pnl) || 0, 0)), 0);
  const totalNet = rows.reduce((s, d) => s + (Number(d.pnl) || 0), 0);
  const latest = rows[0] || {};
  const latestBook = Number(latest.book ?? Math.max((Number(latest.value) || 0) - (Number(latest.cash) || 0), 0)) || 0;
  const latestCash = Number(latest.cash) || 0;
  const latestSavings = Number(latest.savings) || 0;
  const latestWealth = Number(latest.wealth ?? latestBook + latestCash + latestSavings) || 0;
  return `
    <div class="table-wrap history-table-wrap">
      <table class="tbl tbl-premium tbl-history">
        <thead><tr>
          <th>${tip("Session history", "Session history")}</th>
          <th>What happened</th>
          <th class="r">${tip("Book value", "Book value")}</th>
          <th class="r">${tip("Cash", "Cash")}</th>
          <th class="r">${tip("Savings", "Savings")}</th>
          <th class="r">${tip("Wealth", "Wealth")}</th>
          <th class="r">${tip("Net", "Net")}</th>
          ${canReset ? `<th class="col-actions">Clear</th>` : ""}
        </tr></thead>
        <tbody>${rows.map((d, i) => {
          const prev = rows[i + 1]; // chronological previous (rows are newest-first)
          const net = Number(d.pnl) || 0;
          const book = Number(d.book ?? Math.max((Number(d.value) || 0) - (Number(d.cash) || 0), 0)) || 0;
          const cash = Number(d.cash) || 0;
          const savings = Number(d.savings) || 0;
          const wealth = Number(d.wealth ?? book + cash + savings) || 0;
          const act = activityLabel(d, prev);
          let savDelta = Number(d.savings_delta);
          if (!Number.isFinite(savDelta) && prev) savDelta = savings - (Number(prev.savings) || 0);
          else savDelta = savDelta || 0;
          const trades = Array.isArray(d.trades) ? d.trades : [];
          const summary = daySummary(d, act, prev);
          const tradeLines = trades.slice(0, 8).map((t) => {
            const tp = Number(t.pnl) || 0;
            const pts = Number(t.profit_to_savings) || 0;
            return `<li><span class="mono">${esc(t.side)}</span> ${esc(t.ticker)} · ${inr(t.amount)}${t.reason ? ` · ${esc(t.reason)}` : ""}${tp ? ` · ${signed(tp)}` : ""}${pts ? ` · savings ${signed(pts)}` : ""}</li>`;
          }).join("");
          return `
          <tr class="${i === 0 ? "history-latest" : ""} history-row-${act.cls}"
              data-hist-date="${esc(d.date)}" data-hist-act="${esc(act.cls)}" data-hist-pnl="${net}" data-hist-wealth="${wealth}"
              data-hist-search="${esc(`${d.date} ${act.text} ${summary} ${trades.map((t) => `${t.side} ${t.ticker} ${t.reason || ""}`).join(" ")}`.toLowerCase())}">
            <td>
              <div class="history-date-cell">
                <span class="history-date">${esc(fmtDate(d.date))}</span>
                ${i === 0 ? `<span class="history-tag">Latest</span>` : ""}
              </div>
            </td>
            <td>
              <div class="history-what">
                <span class="history-activity ${act.cls}">${esc(act.text)}</span>
                <span class="history-summary">${esc(summary)}</span>
              </div>
              ${tradeLines ? `<details class="history-trades"><summary>Details</summary><ul>${tradeLines}</ul></details>` : ""}
            </td>
            <td class="r mono">${inr(book)}</td>
            <td class="r mono">${inr(cash)}</td>
            <td class="r mono">${inr(savings)}${savDelta ? `<div class="history-delta ${tone(savDelta)}">${signed(savDelta)}</div>` : ""}</td>
            <td class="r mono">${inr(wealth)}</td>
            <td class="r mono ${tone(net)}"><strong>${signed(net)}</strong></td>
            ${canReset ? `<td class="col-actions"><button class="btn btn-sm btn-ghost btn-danger-text" data-reset-day="${esc(d.date)}" type="button" title="Clear this day and everything after">Clear</button></td>` : ""}
          </tr>`;
        }).join("")}
        </tbody>
        <tfoot><tr class="history-total">
          <td colspan="2"><strong>Latest balances · ${rows.length} session${rows.length === 1 ? "" : "s"}</strong></td>
          <td class="r mono">${inr(latestBook)}</td>
          <td class="r mono">${inr(latestCash)}</td>
          <td class="r mono">${inr(latestSavings)}</td>
          <td class="r mono">${inr(latestWealth)}</td>
          <td class="r mono ${tone(totalNet)}"><strong>${signed(totalNet)}</strong></td>
          ${canReset ? `<td></td>` : ""}
        </tr></tfoot>
      </table>
    </div>`;
}

function historyPanel(days) {
  const list = days || [];
  return `
    <div class="panel panel-table history-panel history-panel-simple" id="sessionHistoryPanel">
      <div class="panel-hd panel-hd-split">
        <div class="panel-title-wrap">
          <span class="panel-title">Day-by-day results</span>
          <span class="panel-count" id="historyVisibleCount">${list.length}</span>
        </div>
      </div>
      <div class="tbl-tools history-tools" data-history-tools>
        <div class="tbl-tools-search">
          <span class="tbl-tools-ico" aria-hidden="true">⌕</span>
          <input type="search" class="tbl-search" id="histSearch" placeholder="Search days…" aria-label="Search session history" />
        </div>
        <select id="histSort" aria-label="Sort sessions">
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="pnl-desc">Best P/L</option>
          <option value="pnl-asc">Worst P/L</option>
        </select>
        <input type="hidden" id="histFrom" value="" />
        <input type="hidden" id="histTo" value="" />
      </div>
      ${pnlDailyTable(list, { canReset: true })}
    </div>`;
}

function bindHistoryTools() {
  const panel = document.getElementById("sessionHistoryPanel");
  if (!panel) return;
  const tbody = panel.querySelector("tbody");
  if (!tbody) return;
  const tools = panel.querySelector("[data-history-tools]");
  let actFilter = "";
  tools?.querySelectorAll("[data-hist-act]").forEach((chip) => {
    chip.onclick = () => {
      tools.querySelectorAll("[data-hist-act]").forEach((c) => c.classList.remove("on"));
      chip.classList.add("on");
      actFilter = chip.dataset.histAct || "";
      apply();
    };
  });
  const apply = () => {
    const q = String(document.getElementById("histSearch")?.value || "").trim().toLowerCase();
    const from = document.getElementById("histFrom")?.value || "";
    const to = document.getElementById("histTo")?.value || "";
    const sort = document.getElementById("histSort")?.value || "date-desc";
    const rows = [...tbody.querySelectorAll("tr[data-hist-date]")];
    rows.forEach((tr) => {
      const date = tr.dataset.histDate || "";
      const act = tr.dataset.histAct || "";
      const hay = (tr.dataset.histSearch || "").toLowerCase();
      let show = true;
      if (q && !hay.includes(q) && !date.includes(q)) show = false;
      if (actFilter && act !== actFilter) show = false;
      if (from && date < from) show = false;
      if (to && date > to) show = false;
      tr.hidden = !show;
    });
    const visible = rows.filter((tr) => !tr.hidden);
    const [key, dir] = sort.split("-");
    visible.sort((a, b) => {
      if (key === "date") {
        return dir === "asc"
          ? (a.dataset.histDate || "").localeCompare(b.dataset.histDate || "")
          : (b.dataset.histDate || "").localeCompare(a.dataset.histDate || "");
      }
      const av = Number(a.dataset[key === "pnl" ? "histPnl" : "histWealth"]) || 0;
      const bv = Number(b.dataset[key === "pnl" ? "histPnl" : "histWealth"]) || 0;
      return dir === "asc" ? av - bv : bv - av;
    });
    visible.forEach((tr) => tbody.appendChild(tr));
    const count = document.getElementById("historyVisibleCount");
    if (count) count.textContent = String(visible.length);
  };
  document.getElementById("histSearch")?.addEventListener("input", apply);
  document.getElementById("histFrom")?.addEventListener("change", apply);
  document.getElementById("histTo")?.addEventListener("change", apply);
  document.getElementById("histSort")?.addEventListener("change", apply);
  apply();
}

function deskAlertsStrip(meta, page = "") {
  // Keep operational / risk alerts on Trade & Portfolio only
  if (!meta || meta.readonly) return "";
  if (!["trade", "portfolio"].includes(String(page || ""))) return "";
  const bits = [];
  if (meta.paused) {
    bits.push({
      tone: "bad",
      title: "Buying paused",
      body: `Drawdown lock until ${fmtDate(meta.pause_until) || "—"}. Resume on Trade if you accept the risk.`,
      href: "#/trade",
      cta: "Open Trade",
    });
  }
  const risk = meta.risk_profile || {};
  if (Number(meta.cb_tier) >= 2 || String(risk.band || "") === "aggressive") {
    bits.push({
      tone: "warn",
      title: "Risk check",
      body: `Book risk is ${risk.band || "elevated"}${meta.cb_tier ? ` · circuit breaker tier ${meta.cb_tier}` : ""}. Review size before adding.`,
      href: "#/portfolio",
      cta: "Open Portfolio",
    });
  }
  if (meta.market_open === false && page === "trade") {
    bits.push({
      tone: "warn",
      title: meta.market_status === "preopen" ? "Pre-open" : meta.market_status === "weekend" ? "Weekend" : "Markets closed",
      body: meta.market_note || "Investing unlocks on the next open session.",
      href: "#/trade",
      cta: "View Trade",
    });
  }
  const pending = Array.isArray(meta.pending_actions) ? meta.pending_actions : [];
  if (pending.length) {
    bits.push({
      tone: "bad",
      title: `${pending.length} rule sell${pending.length > 1 ? "s" : ""} need approval`,
      body: pending.slice(0, 3).map((a) => `${a.ticker} · ${a.reason}`).join(" · ") + " — Approve sell or Keep holding.",
      href: "#/trade",
      cta: "Review sells",
    });
  }
  if (!bits.length) return "";
  return `
    <div class="desk-alerts" id="deskAlerts" role="region" aria-label="Desk warnings">
      ${bits.map((b) => `
        <div class="desk-alert desk-alert-${esc(b.tone)}">
          <span class="desk-alert-mark" aria-hidden="true">${b.tone === "bad" ? "✕" : b.tone === "ok" ? "✓" : "!"}</span>
          <div class="desk-alert-copy">
            <strong>${esc(b.title)}</strong>
            <span>${esc(b.body)}</span>
          </div>
          <div class="desk-alert-actions">
            <a class="btn btn-sm btn-primary" href="${esc(b.href || "#/")}">${esc(b.cta || "View")}</a>
          </div>
        </div>`).join("")}
    </div>`;
}



function shell(inner, meta) {
  const { page } = route();
  const ro = !!meta?.readonly;
  const cal = meta?.calendar_date || "";
  const session = meta?.session_date || cal;
  const dates = [...new Set([...(meta?.session_dates || []), cal, session].filter(Boolean))].sort();
  const cur = viewDate || dateFocus || session;
  const metrics = topMetrics(meta, page);
  const stickyMetrics = false;
  const marketClosed = meta?.market_open === false && !ro;
  const dateOptionLabel = (d) => {
    if (d === cal) return `${fmtDate(d)} · today${meta?.market_open === false ? " · market closed" : ""}`;
    if (d === session && d !== cal) return `${fmtDate(d)} · last session`;
    return fmtDate(d);
  };
  const chip = meta?.connected === false
    ? "Offline"
    : ro
      ? "Past day"
      : marketClosed
        ? "Market closed"
        : meta?.live?.live
          ? "Live"
          : "Connecting";
  const sbOpen = sidebarOpenPref();
  return `
  <div class="desk desk-with-sidebar ${sbOpen ? "sidebar-open" : "sidebar-collapsed"}${ro ? " desk-past" : " desk-live"}">
    <div class="sidebar-backdrop" id="sidebarBackdrop" hidden aria-hidden="true"></div>
    <aside class="desk-sidebar" id="deskSidebar" aria-label="Main menu">
      <div class="sidebar-top">
        <a class="sidebar-brand" href="#/">
          <div class="mark">SNS</div>
          <div class="sidebar-brand-copy"><strong>SNS Capital</strong><span>Investment Desk</span></div>
        </a>
        <button type="button" class="sidebar-shrink" data-sidebar-toggle aria-expanded="${sbOpen ? "true" : "false"}" aria-label="${sbOpen ? "Collapse navigation" : "Expand navigation"}" title="${sbOpen ? "Collapse" : "Expand"}">${sbOpen ? UI_ICO.chevronLeft : UI_ICO.chevronRight}</button>
      </div>
      <nav class="sidebar-nav">${sidebarNavHtml(page)}</nav>
      <div class="sidebar-foot">
        ${authUser() ? `
          <div class="sidebar-user" title="${esc(authUser().email || "")}">
            <span class="hdr-user-avatar" aria-hidden="true">${esc(userInitial(authUser()))}</span>
            <div class="sidebar-user-meta">
              <span class="sidebar-user-name">${esc(authUser().name || authUser().username)}</span>
              <span class="sidebar-user-role">Signed in</span>
            </div>
          </div>
        ` : `<a class="sidebar-login" href="#/login" title="Sign in">Sign in</a>`}
      </div>
    </aside>
    <div class="desk-main-col">
    <div class="desk-sticky${stickyMetrics ? " has-metrics" : ""}">
    <header class="hdr hdr-toolbar">
      <div class="hdr-toolbar-left">
        <button type="button" class="btn btn-sm btn-ghost menu-mobile-btn" data-sidebar-toggle aria-expanded="false">Menu</button>
        <div class="hdr-title-block">
          <p class="hdr-page-eyebrow">SNS Capital</p>
          <h1 class="hdr-page-title">${esc(pageLabel(page))}</h1>
        </div>
      </div>
      <div class="hdr-right hdr-toolbar-actions">
        <div class="hdr-cluster hdr-cluster-date">
          <div class="date-row">
            <button class="btn btn-icon" id="prevDay" ${dates.indexOf(cur) <= 0 ? "disabled" : ""} aria-label="Previous day">‹</button>
            <select id="datePick" aria-label="Session date">${dates.map((d) => `<option value="${esc(d)}" ${d === cur ? "selected" : ""}>${esc(dateOptionLabel(d))}</option>`).join("")}</select>
            <button class="btn btn-sm btn-primary" id="todayBtn" type="button">Today</button>
          </div>
        </div>
        <div class="hdr-cluster hdr-cluster-meta">
          ${meta?.regime ? `<span class="pill regime ${esc(meta.regime)}">${esc(meta.regime)}</span>` : ""}
          ${!ro && (meta?.strategy_name || window.__liveStrategy?.name) ? `<a href="#/trade" class="pill algo-live-pill" id="hdrAlgoPill" title="Saved method for live Trade">Algo · ${esc(meta.strategy_name || window.__liveStrategy?.name || "")}</a>` : ""}
          <span class="pill ${ro || marketClosed || !meta?.live?.live ? "off" : "live"}" id="liveChip">${chip}</span>
        </div>
        <div class="hdr-cluster hdr-cluster-tools">
          <button type="button" class="btn btn-icon hdr-tool-btn" id="themeBtn" aria-label="Toggle theme" title="${theme() === "dark" ? "Switch to light" : "Switch to dark"}">${theme() === "dark" ? UI_ICO.sun : UI_ICO.moon}</button>
          <div class="notif-wrap ideas-wrap">
            <button class="btn btn-icon ideas-bell" id="ideasBell" type="button" aria-label="Suggestions" title="Suggestions">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10c.8.7 1.2 1.4 1.4 2.5h5.2c.2-1.1.6-1.8 1.4-2.5A6 6 0 0 0 12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            ${suggestionsPanelHtml(meta)}
          </div>
          <div class="notif-wrap">
            <button class="btn btn-icon notif-bell" id="notifBell" type="button" aria-label="Notifications" title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3a5 5 0 0 0-5 5v2.1c0 .7-.2 1.4-.6 2L5 14.5V16h14v-1.5l-1.4-2.4c-.4-.6-.6-1.3-.6-2V8a5 5 0 0 0-5-5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.5 17a2.5 2.5 0 0 0 5 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              <span class="notif-badge" id="notifBadge" hidden>0</span>
            </button>
            ${notifPanelHtml(meta)}
          </div>
          ${authUser() ? `
            <a class="hdr-profile-chip${page === "account" ? " is-active" : ""}" href="#/account" title="Account profile">
              <span class="hdr-user-avatar" aria-hidden="true">${esc(userInitial(authUser()))}</span>
              <span class="hdr-user-copy">
                <strong class="hdr-user-name">${esc(authUser().name || authUser().username || "User")}</strong>
                <em class="hdr-user-status">Profile</em>
              </span>
            </a>
            <div class="hdr-settings-wrap" id="hdrSettingsWrap">
              <button type="button" class="btn btn-icon hdr-tool-btn hdr-settings-btn" id="hdrSettingsBtn" aria-expanded="false" aria-haspopup="true" title="Settings">⚙️</button>
              <div class="hdr-settings-panel" id="hdrSettingsPanel" hidden>
                <div class="hdr-settings-hd">
                  <strong>Settings</strong>
                  <span>${esc(authUser().email || authUser().username || "")}</span>
                </div>
                <div class="hdr-settings-section">
                  <a class="hdr-settings-row hdr-settings-row-ok" href="#/account">
                    <span>Account details</span>
                    <em>Edit</em>
                  </a>
                  <a class="hdr-settings-row" href="#/rules">
                    <span>Desk rules</span>
                    <em>Open</em>
                  </a>
                </div>
                <button type="button" class="hdr-settings-logout" id="logoutBtn">Sign out</button>
              </div>
            </div>
          ` : `<a class="btn btn-sm btn-ghost hdr-login-btn" href="#/login">Sign in</a>`}
        </div>
      </div>
    </header>
    ${stickyMetrics ? metrics : ""}
    </div>
    <div class="main">
      ${deskAlertsStrip(meta, page)}
      ${ro ? `<div class="history-banner past-banner">
        <div class="past-banner-copy">
          <strong>Past session · ${esc(fmtDate(meta?.view_date))}</strong>
          <span>Read-only snapshot — trades and invest are locked. Return to today to trade.</span>
        </div>
        <button class="btn btn-sm btn-primary" id="todayBtn2">Back to today</button>
      </div>` : ""}
      ${metrics && !stickyMetrics ? metrics : ""}
      ${inner}
    </div>
    <footer class="ftr"><span>${esc(meta?.date_label || "—")}</span><span id="clock"></span></footer>
    </div>
    <nav class="mob-nav" aria-label="Main navigation">${NAV.map((item) => {
      const on = navPageId(item[0]) === page;
      return `<a href="${item[0]}" class="${on ? "on" : ""}">${esc(item[1])}</a>`;
    }).join("")}</nav>
  </div>
  <div id="toast" class="toast" hidden></div>`;
}

function recommendationCards(list, { trade = true, dashboard = false } = {}) {
  if (!list?.length) {
    return `<div class="panel panel-bd empty-cta">
      <p class="muted">No names pass today's rules yet.</p>
      <a class="btn btn-primary" href="#/trade">Open Trade</a>
      <a class="btn btn-ghost" href="#/research">Search in Research</a>
      <a class="btn btn-ghost" href="#/rules">Read boss rules</a>
    </div>`;
  }
  return `
    <div class="rec-grid">
      ${list.map((b) => `
        <article class="rec-card">
          <div class="rec-card-hd">
            ${tickerCell(b.ticker, b.name)}
            <div class="rec-card-badges">
              <span class="sleeve ${esc(b.sleeve)}">${esc(sleeveLabel(b.sleeve))}</span>
              ${verdictBadge(b.verdict)}
            </div>
          </div>
          <div class="rec-card-stats">
            ${scoreCell(b.score)}
            <div class="rec-stat"><span class="rec-stat-lbl">Price</span><span class="rec-stat-val mono live-px" data-px="${esc(b.ticker)}">${inr(b.price, 2)}</span></div>
            <div class="rec-stat"><span class="rec-stat-lbl">${tip("Risk", "Risk")}</span><span class="rec-stat-val"><span class="risk-pill">${Math.round(b.risk || 0)}</span></span></div>
          </div>
          ${qualityChipsHtml(b)}
          <p class="rec-card-why">${esc(b.bull || b.why || "—")}</p>
          <div class="rec-card-ft">
            ${dashboard
              ? `<a class="btn btn-sm btn-primary" href="#/trade">Go to Trade</a>
                 <a class="btn btn-sm btn-ghost" href="#/research/${esc(b.ticker)}">Research</a>`
              : `<a class="btn btn-sm btn-ghost" href="#/research/${esc(b.ticker)}">Research</a>
                 ${trade ? `<button class="btn btn-sm btn-buy" data-buy="${esc(b.ticker)}" data-name="${esc(b.name)}" data-sleeve="${esc(b.sleeve)}" data-price="${b.price}">Invest</button>` : ""}`}
          </div>
        </article>`).join("")}
    </div>`;
}

function backupPicksPanel(list, { trade = false } = {}) {
  if (!list?.length) return "";
  return `
    <div class="panel backup-panel">
      <details class="backup-details">
        <summary class="backup-summary">
          <span class="backup-icon" aria-hidden="true">◷</span>
          <div class="backup-summary-text">
            <span class="backup-title">Backup picks</span>
            <span class="backup-sub">HOLD verdict — on watch, not primary buy signals</span>
          </div>
          <span class="backup-count">${list.length}</span>
        </summary>
        <div class="backup-body">
          <div class="backup-rail">
            ${list.map((b) => {
              const s = Math.min(100, Math.max(0, Math.round(Number(b.score) || 0)));
              return `
              <article class="backup-item">
                <div class="backup-item-top">
                  <span class="backup-sym mono">${esc(b.ticker)}</span>
                  <span class="verdict verdict-hold backup-verdict">HOLD</span>
                </div>
                <p class="backup-name">${esc(b.name)}</p>
                <div class="backup-stats">
                  <span class="backup-stat"><em>Score</em><strong class="mono">${s}</strong></span>
                  <span class="backup-stat"><em>Price</em><strong class="mono live-px" data-px="${esc(b.ticker)}">${inr(b.price, 2)}</strong></span>
                  <span class="backup-stat"><em>Risk</em><strong class="mono">${Math.round(b.risk || 0)}</strong></span>
                </div>
                <p class="backup-why">${esc((b.bull || b.why || "").slice(0, 120))}${(b.bull || b.why || "").length > 120 ? "…" : ""}</p>
                <div class="backup-ft">
                  <a class="btn btn-sm btn-ghost" href="#/research/${esc(b.ticker)}">Research</a>
                  ${trade ? `<button class="btn btn-sm btn-ghost" data-buy="${esc(b.ticker)}" data-name="${esc(b.name)}" data-sleeve="${esc(b.sleeve)}" data-price="${b.price}">Invest anyway</button>` : ""}
                </div>
              </article>`;
            }).join("")}
          </div>
        </div>
      </details>
    </div>`;
}

function tradeBudgetRulesHtml(d) {
  const fridayCap = Math.round(Number(d.friday_cap) || 5000);
  const regimeBudget = Math.round(Number(d.regime_budget) || Number(d.recommended_amount) || 10000);
  const dailyTarget = Math.round(Number(d.recommended_amount) || 10000);
  const reservePct = Math.round((Number(d.reserve_target) || 0.05) * 100);
  const openHH = d.market_hours?.open || d.open || "09:15";
  const closeHH = d.market_hours?.close || d.close || "15:30";
  const status = String(d.market_status || "");
  const isFri = !!d.friday;
  const closed = d.market_open === false;
  return `
    <div class="trade-rules-card">
      <p class="trade-rules-kicker">Boss invest rules</p>
      <ul class="trade-rules-list">
        <li><strong>Market hours</strong> — buys only while NSE is open (${esc(openHH)}–${esc(closeHH)} IST, Mon–Fri). Weekends / holidays / after-hours = locked.</li>
        <li><strong>Daily ceiling</strong> — regime budget about ${inr(regimeBudget)}${isFri && !closed ? ` · <em>Friday cap ${inr(fridayCap)}</em> applies today (not ${inr(regimeBudget)})` : ` · Fridays capped at ${inr(fridayCap)}`}.</li>
        <li><strong>Today’s deploy cap</strong> — ${closed ? "N/A while closed" : inr(dailyTarget)} total you may deploy this open session.</li>
        <li><strong>Cash reserve</strong> — keep ~${reservePct}% of portfolio value in cash; Max safe is after that reserve.</li>
      </ul>
      ${closed ? `<p class="trade-rules-closed">${esc(d.market_note || "Investing unlocks on the next open session — the Friday ₹5,000 cap is not a weekend allowance.")}</p>` : ""}
      ${!closed && isFri ? `<p class="trade-rules-friday">Friday rule is on: you can invest up to <strong>${inr(fridayCap)}</strong> today, not the usual ${inr(regimeBudget)}.</p>` : ""}
      ${status === "weekend" ? `<p class="trade-rules-closed">Weekend: no ₹5,000 / ₹10,000 invest — that ceiling only applies when the market is open.</p>` : ""}
    </div>`;
}

function tradeInvestPanel(d, { trade, hint }) {
  const p = d.pnl || {};
  const today = Number(p.today) || 0;
  const cash = Number(d.cash) || 0;
  const dailyTarget = Math.round(Number(d.recommended_amount) || Number(hint) || 10000);
  const remainDeploy = Math.max(0, Math.round(Number(d.remaining_deploy_budget) || 0));
  const usedDeploy = Math.round(Number(d.deployed_today) || 0);
  const maxDeployRaw = Math.round(Number(d.max_deployable) || 0);
  const maxDeploy = Math.max(0, Math.min(maxDeployRaw, remainDeploy || maxDeployRaw));
  const remainContrib = Math.max(0, Math.round(Number(d.remaining_daily_budget) || 0));
  const reservePct = Math.round((Number(d.reserve_target) || 0.05) * 100);
  const fridayCap = Math.round(Number(d.friday_cap) || 5000);
  const regimeBudget = Math.round(Number(d.regime_budget) || dailyTarget);
  const budgetDone = remainDeploy < 50 && usedDeploy > 0;
  const reserveLocked = !budgetDone && maxDeploy < 50;
  const partiallyUsed = !budgetDone && !reserveLocked && usedDeploy > 0;
  const defaultAmt = budgetDone || reserveLocked ? 0 : Math.max(1, maxDeploy || 1);
  const rules = tradeBudgetRulesHtml(d);
  if (d.readonly) {
    const book = Number(d.pnl?.book ?? d.portfolio ?? 0) || 0;
    const pnl = Number(d.pnl?.today ?? d.daily_pnl ?? 0) || 0;
    return `<div class="trade-archive-card">
      <p class="trade-archive-eyebrow">Closed session</p>
      <h2 class="trade-archive-date">${esc(fmtDate(d.view_date))}</h2>
      <p class="trade-archive-copy">Read-only archive. Investing stays on the live session.</p>
      <div class="trade-archive-metrics">
        <div><span>Cash</span><strong class="mono">${inr(cash)}</strong></div>
        <div><span>Book</span><strong class="mono">${inr(book)}</strong></div>
        <div><span>Session P/L</span><strong class="mono ${tone(pnl)}">${signed(pnl)}</strong></div>
      </div>
      <button class="btn btn-primary btn-block" id="todayBtnTrade" type="button">Return to live desk</button>
    </div>`;
  }
  if (d.paused) {
    const until = d.pause_until ? fmtDate(d.pause_until) : "—";
    return `<div class="trade-invest-card trade-invest-readonly trade-invest-paused">
      <p class="trade-invest-eyebrow">Rules · drawdown</p>
      <p class="trade-invest-title">Buying paused</p>
      <p class="muted">${esc(d.pause_reason || "Drawdown circuit breaker is active.")} Unlocks <strong>${esc(until)}</strong>.</p>
      <button class="btn btn-buy btn-block" id="resumeBuying" type="button">Resume buying</button>
      <a class="btn btn-ghost btn-block" href="#/portfolio">See portfolio</a>
      ${rules}
    </div>`;
  }
  if (d.market_open === false) {
    const status = String(d.market_status || "");
    const title = status === "weekend" ? "Weekend — markets closed"
      : status === "preopen" ? "Pre-open — investing locked"
      : "Markets closed for the day";
    return `<div class="trade-invest-card trade-invest-readonly trade-invest-closed">
      <p class="trade-invest-eyebrow">Market hours rule</p>
      <p class="trade-invest-title">${esc(title)}</p>
      <p class="muted">${esc(d.market_note || "Invest unlocks on the next open session.")}</p>
      <p class="trade-closed-cap muted">You cannot invest ₹${(status === "weekend" ? fridayCap : dailyTarget).toLocaleString("en-IN")} while closed — ${status === "weekend" ? `the Friday ${inr(fridayCap)} cap is not a weekend allowance` : `session budget ${inr(dailyTarget)} waits until the next open`}.</p>
      <a class="btn btn-primary btn-block" href="#/">Back to Dashboard</a>
      ${rules}
    </div>`;
  }
  return `
    <div class="trade-invest-card trade-invest-simple${reserveLocked ? " trade-invest-locked" : ""}">
      <div class="tis-top">
        <div>
          <p class="tis-kicker">Step 1 · How much today?</p>
          <p class="tis-cash mono" id="tradeCashDisplay">${inr(cash)}</p>
          <p class="tis-meta">Cash on hand</p>
          <p class="tis-meta tis-meta-caps">
            Investable now <strong class="mono">${inr(maxDeploy)}</strong>
            · daily ceiling left <strong class="mono">${inr(remainDeploy)}</strong>${budgetDone ? " · budget used" : ""}${d.friday ? ` · Friday cap ${inr(fridayCap)}` : ""}
          </p>
        </div>
        <div class="tis-today mono ${tone(today)}">${signed(today)} <span>today</span></div>
      </div>
      ${d.friday ? `<p class="tis-banner tis-banner-friday">Friday rule: daily ceiling is <strong>${inr(dailyTarget)}</strong> (Friday cap ${inr(fridayCap)}), not the usual ${inr(regimeBudget)}.</p>` : ""}
      ${budgetDone ? `<p class="tis-banner">Daily budget used (${inr(usedDeploy)} / ${inr(dailyTarget)}). Come back next open day.</p>`
        : reserveLocked && remainContrib < 50 ? `<div class="tis-banner tis-banner-lock tis-boss-brief">
            <strong>Boss brief — cash reserve lock</strong>
            <p>Rule: keep ${reservePct}% of portfolio in cash (~${inr(Math.round(Number(d.reserve_floor) || cash || 0))}). Cash on hand is already that reserve, and today's contribution room is used.</p>
            <p>Daily ceiling left (${inr(remainDeploy)}) is <em>not</em> spendable without cash above the reserve. Next open session: contribute, then deploy.</p>
            <p class="tis-boss-say">What to tell your boss: “Deploy paused by the 5% cash-reserve rule — not by market hours. Ceiling remains ${inr(remainDeploy)}; we need fresh contribution next session to invest above the reserve.”</p>
          </div>`
        : reserveLocked ? `<p class="tis-banner tis-banner-lock">Cash on hand is the ${reservePct}% reserve. Use <strong>Max safe</strong> — the desk will contribute from today's room (${inr(remainContrib)}) so you can still invest.</p>`
        : partiallyUsed ? `<p class="tis-banner">Already invested ${inr(usedDeploy)}. You can still invest up to <strong>${inr(maxDeploy)}</strong> (Max safe). Daily ceiling left ${inr(remainDeploy)}.</p>`
        : maxDeploy + 1 < remainDeploy ? `<p class="tis-banner">Daily ceiling is ${inr(remainDeploy)}, but Max safe is ${inr(maxDeploy)} — ${reservePct}% cash must stay reserved.</p>`
        : !d.friday && dailyTarget >= 9999 && maxDeploy + 1 < 10000 ? `<p class="tis-banner">Want ${inr(10000)}? Max safe is ${inr(maxDeploy)} after the ${reservePct}% reserve / cash on hand.</p>`
        : ""}
      <label class="tis-label" for="amt">Amount (₹)</label>
      <div class="trade-invest-amt-row">
        <span class="trade-invest-rupee">₹</span>
        <input class="trade-invest-input" id="amt" type="number" min="1" max="${Math.max(1, maxDeploy || 1)}" value="${esc(String(reserveLocked || budgetDone ? "" : (hint || defaultAmt)))}" placeholder="${reserveLocked ? "0 — reserve locked" : (defaultAmt || maxDeploy)}" ${budgetDone || reserveLocked ? "disabled" : ""} data-remain="${remainDeploy}" data-max-deploy="${maxDeploy}" data-daily="${dailyTarget}" data-used="${usedDeploy}" />
      </div>
      <div class="amt-presets" id="amtPresets">
        <button type="button" class="amt-preset amt-preset-target" data-amt="${Math.max(1, maxDeploy)}" ${budgetDone || reserveLocked || maxDeploy < 1 ? "disabled" : ""}>Max safe</button>
        <button type="button" class="amt-preset" data-amt="${Math.max(1, maxDeploy)}" ${budgetDone || reserveLocked || maxDeploy < 1 ? "disabled" : ""}>Use investable</button>
      </div>
      <div class="tis-steps">
        <p class="tis-kicker">Step 2 · Preview</p>
        <button class="btn btn-primary btn-block" id="showPlan" type="button" ${budgetDone || reserveLocked ? "disabled" : ""}>Preview split</button>
        <div id="planBox" class="plan-box plan-box-aside" aria-live="polite"></div>
        <p class="tis-kicker tis-step3">Step 3 · Invest</p>
        <button class="btn btn-buy btn-block" id="doInvest" type="button" disabled>Invest this split</button>
      </div>
      <p class="trade-invest-note" id="planNote">${budgetDone
        ? `Budget finished for today.`
        : reserveLocked
          ? `Session done for buys — remaining cash holds the ${reservePct}% reserve (~${inr(Math.round(Number(d.pnl?.wealth || d.mtm || 0) * (Number(d.reserve_target) || 0.05)))}). Come back next open day to add & deploy more.`
          : `Investable now is ${inr(maxDeploy)} after the ${reservePct}% reserve. Daily ceiling (${inr(remainDeploy)}) is not extra cash.`}</p>
      ${rules}
    </div>`;
}

function reportActions(asOf = "overall") {
  return `
    <div class="report-actions">
      <div>
        <h3 class="report-actions-title">Overall desk report</h3>
        <p class="report-actions-sub">Download PDF or CSV for your boss — full live book.</p>
      </div>
      <div class="report-actions-btns">
        <button type="button" class="btn btn-sm btn-report-pdf" data-report-format="pdf" data-report-asof="overall">Download PDF</button>
        <button type="button" class="btn btn-sm btn-report-csv" data-report-format="csv" data-report-asof="overall">Download CSV</button>
      </div>
    </div>`;
}

async function downloadReport(format = "pdf", asOf = "") {
  const params = new URLSearchParams({ kind: format || "pdf" });
  if (asOf) params.set("as_of", asOf);
  const headers = { Accept: format === "json" ? "application/json" : "*/*" };
  const token = authToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`/api/report?${params}`, { headers, credentials: "same-origin" });
  if (!res.ok) {
    let msg = `Report failed (${res.status})`;
    try {
      const j = await res.json();
      if (typeof j.detail === "string") msg = j.detail;
      else if (Array.isArray(j.detail)) msg = j.detail.map((d) => d.msg || d).join("; ");
      else if (j.detail) msg = JSON.stringify(j.detail);
    } catch {
      try { msg = (await res.text()) || msg; } catch { /* ignore */ }
    }
    if (res.status === 401) msg = "Login required — refresh and sign in again";
    if (res.status === 404) msg = "Report API not loaded — restart the desk (run.ps1), then hard-refresh";
    throw new Error(msg);
  }
  if (format === "json") return res.json();

  if (format === "html") {
    const html = await res.text();
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) {
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sns-overall-report${asOf && asOf !== "overall" ? `-${asOf}` : ""}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast("Popup blocked — HTML downloaded. Prefer Download PDF.", false, { skipInbox: true });
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    return;
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const stamp = asOf && asOf !== "overall" ? `-${asOf}` : "";
  a.download = format === "pdf" ? `sns-overall-report${stamp}.pdf` : `sns-overall-report${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function bindReportActions(root = document) {
  root.querySelectorAll("[data-report-format]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const format = btn.getAttribute("data-report-format") || "pdf";
      const asOf = btn.getAttribute("data-report-asof") || "overall";
      try {
        await downloadReport(format, asOf);
        const msg = format === "pdf"
          ? "PDF downloaded — check your Downloads folder"
          : format === "csv"
            ? "CSV downloaded"
            : "HTML report opened";
        toast(msg, true, { skipInbox: true });
      } catch (e) {
        toast(String(e.message || e), false, { title: "Download failed", skipInbox: false });
      }
    });
  });
}

function tradePickCards(list, { trade = true, mode = "buy" } = {}) {
  if (!list?.length) {
    return `<div class="trade-picks-empty empty-cta">
      <p>No ${mode === "hold" ? "watch" : "buy"} ideas right now.</p>
      <div class="empty-cta-actions">
        <a class="btn btn-primary" href="#/research">Search Research</a>
      </div>
    </div>`;
  }
  const isHoldMode = mode === "hold";
  return `
    <div class="picks-boxes">
      ${list.map((b) => {
        const s = Math.min(100, Math.max(0, Math.round(Number(b.score) || 0)));
        const isHold = String(b.verdict || "").toUpperCase() === "HOLD" || isHoldMode;
        const why = String(b.bull || b.why || "");
        return `
        <article class="pick-box${isHold ? " is-hold" : ""}">
          <header class="pick-box-hd">
            <div>
              <strong class="mono">${esc(b.ticker)}</strong>
              <span class="pick-box-name">${esc(b.name || "")}</span>
            </div>
            ${verdictBadge(b.verdict || (isHold ? "HOLD" : "BUY"))}
          </header>
          <div class="pick-box-meta">
            <span class="mono live-px" data-px="${esc(b.ticker)}">${inr(b.price, 2)}</span>
            <span class="mono pick-box-score">${s}</span>
            <span class="sleeve ${esc(b.sleeve)}">${esc(sleeveLabel(b.sleeve))}</span>
          </div>
          ${why ? `<p class="pick-box-why">${esc(why.slice(0, 88))}${why.length > 88 ? "…" : ""}</p>` : ""}
          <footer class="pick-box-ft">
            ${trade
              ? `<button class="btn btn-sm ${isHold ? "btn-ghost" : "btn-buy"}" type="button"
                  data-buy="${esc(b.ticker)}" data-name="${esc(b.name)}" data-sleeve="${esc(b.sleeve)}" data-price="${b.price}">
                  ${isHold ? "Add" : "Invest"}
                </button>
                <button type="button" class="link-btn skip-btn" data-skip="${esc(b.ticker)}">Skip</button>`
              : `<a class="btn btn-sm btn-ghost" href="#/research/${esc(b.ticker)}">View</a>`}
            <a class="link-quiet" href="#/research/${esc(b.ticker)}">Info</a>
          </footer>
        </article>`;
      }).join("")}
    </div>`;
}

function recommendationTradeList(list, opts) {
  return tradePickCards(list, opts);
}

function recommendationTable(list, { trade = true, title = "Recommendations", compact = false } = {}) {
  if (!list?.length) return `<div class="panel panel-bd muted">No names pass today's rules.</div>`;
  const compareTickers = list.slice(0, 12).map((b) => b.ticker).join(",");
  return `
    <div class="panel panel-table panel-clip">
      <div class="panel-hd panel-hd-split">
        <div class="panel-title-wrap">
          <span class="panel-title">${esc(title)}</span>
          <span class="panel-count">${list.length}</span>
        </div>
        <a class="btn btn-sm btn-primary" href="#/research/${compareTickers}">Compare top ${Math.min(12, list.length)}</a>
      </div>
      <div class="table-wrap">
        <table class="tbl tbl-premium">
          <thead><tr>
            <th class="col-rank">#</th>
            <th>${tip("Instrument", "Ticker")}</th>
            <th>${tip("Sleeve", "Sleeve")}</th>
            <th class="r">${tip("Score", "Score")}</th>
            <th>${tip("Verdict", "Verdict")}</th>
            <th class="col-why">Insight</th>
            <th class="r">Price</th>
            <th class="r">${tip("Risk", "Risk")}</th>
            <th class="col-actions">Actions</th>
          </tr></thead>
          <tbody>${list.map((b) => `
            <tr>
              <td class="mono col-rank">${b.rank || "—"}</td>
              <td>${tickerCell(b.ticker, b.name)}</td>
              <td><span class="sleeve ${esc(b.sleeve)}">${esc(b.sleeve)}</span></td>
              <td class="r">${scoreCell(b.score)}</td>
              <td>${verdictBadge(b.verdict)}</td>
              <td class="cell-why">${esc(b.bull || b.why || "—")}</td>
              <td class="r mono live-px" data-px="${esc(b.ticker)}">${inr(b.price, 2)}</td>
              <td class="r"><span class="risk-pill">${Math.round(b.risk || 0)}</span></td>
              <td class="col-actions"><div class="row-actions">
                ${trade ? `<button class="btn btn-buy btn-sm" data-buy="${esc(b.ticker)}" data-name="${esc(b.name)}" data-sleeve="${esc(b.sleeve)}" data-price="${b.price}">Invest</button>
                <button class="btn btn-ghost btn-sm skip-btn" data-skip="${esc(b.ticker)}">Skip</button>` : ""}
                <a class="btn btn-ghost btn-sm" href="#/research/${esc(b.ticker)}">Research</a>
              </div></td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}

const SLEEVE_LABELS = {
  india: "India",
  us: "US Market",
  commodities: "Commodities",
  bonds: "Bonds",
  crypto: "Crypto",
};
const SLEEVE_ORDER = ["india", "us", "commodities", "bonds", "crypto"];

function sleeveLabel(sleeve) {
  return SLEEVE_LABELS[sleeve] || sleeve || "Other";
}

function holdingsTable(rows, { buy = true, sell = true, title = "Positions", note = "", open = true, groupByDate = false, simple = false } = {}) {
  const showActions = buy || sell;
  const count = rows?.length || 0;
  const colSpan = simple ? (6 + (showActions ? 1 : 0)) : (10 + (showActions ? 1 : 0));

  const sorted = [...(rows || [])].sort((a, b) => {
    if (groupByDate) {
      const oa = a.opened_on || "";
      const ob = b.opened_on || "";
      if (oa !== ob) return ob.localeCompare(oa);
    }
    const ia = SLEEVE_ORDER.indexOf(a.sleeve);
    const ib = SLEEVE_ORDER.indexOf(b.sleeve);
    const da = ia < 0 ? 99 : ia;
    const db = ib < 0 ? 99 : ib;
    if (da !== db) return da - db;
    return (Number(b.market_value) || 0) - (Number(a.market_value) || 0);
  });
  const costOf = (h) => (Number(h.qty) || 0) * (Number(h.avg_cost) || 0);
  const valueOf = (h) => Number(h.market_value) || ((Number(h.qty) || 0) * (Number(h.price) || 0));
  const pnlOf = (h) => Number(h.pnl) || (valueOf(h) - costOf(h));

  let totalCost = 0, totalValue = 0, totalPnl = 0;
  for (const h of sorted) {
    totalCost += costOf(h);
    totalValue += valueOf(h);
    totalPnl += pnlOf(h);
  }

  const sleeveStats = {};
  for (const h of sorted) {
    const key = h.sleeve || "other";
    if (!sleeveStats[key]) sleeveStats[key] = { n: 0, value: 0, cost: 0 };
    sleeveStats[key].n += 1;
    sleeveStats[key].value += valueOf(h);
    sleeveStats[key].cost += costOf(h);
  }
  const dateStats = {};
  if (groupByDate) {
    for (const h of sorted) {
      const key = h.opened_on || "unknown";
      if (!dateStats[key]) dateStats[key] = { n: 0, value: 0, cost: 0 };
      dateStats[key].n += 1;
      dateStats[key].value += valueOf(h);
      dateStats[key].cost += costOf(h);
    }
  }
  let lastSleeve = null;
  let lastDate = null;
  const bodyRows = sorted.map((h) => {
    const sleeve = h.sleeve || "other";
    const label = h.sleeve_label || sleeveLabel(sleeve);
    const opened = h.opened_on || "";
    const cost = costOf(h);
    const value = valueOf(h);
    const pnl = pnlOf(h);
    const pnlPct = cost > 0 ? pnl / cost : (Number(h.pnl_pct) || 0);
    let group = "";
    if (groupByDate && opened !== lastDate) {
      const ds = dateStats[opened] || { n: 0, value: 0, cost: 0 };
      group += `<tr class="holdings-group holdings-date-group"><td colspan="${colSpan}"><span class="holdings-date-pill">${esc(fmtDate(opened))}</span><span class="holdings-group-meta">${ds.n} name${ds.n === 1 ? "" : "s"} · put in ${inr(ds.cost)} · now ${inr(ds.value)} · P/L ${signed(ds.value - ds.cost)}</span></td></tr>`;
      lastDate = opened;
      lastSleeve = null;
    }
    const stats = sleeveStats[sleeve] || { n: 0, value: 0, cost: 0 };
    if (sleeve !== lastSleeve) {
      group += `<tr class="holdings-group"><td colspan="${colSpan}"><span class="sleeve ${esc(sleeve)}">${esc(label)}</span><span class="holdings-group-meta">${stats.n} name${stats.n === 1 ? "" : "s"} · put in ${inr(stats.cost)} · now ${inr(stats.value)}</span></td></tr>`;
      lastSleeve = sleeve;
    }
    return `${group}
            <tr data-ticker="${esc(String(h.ticker || "").toUpperCase())}" data-name="${esc(String(h.name || "").toLowerCase())}" data-sleeve="${esc(sleeve)}" data-pnl="${pnl}" data-value="${value}" data-pct="${pnlPct}">
              <td class="col-instrument">
                <div class="hold-inst">
                  <strong class="mono hold-ticker">${esc(h.ticker)}</strong>
                  <span class="hold-name">${esc(h.name || "")}</span>
                  <span class="hold-tags">
                    ${Number(h.bought_today_qty) > 0 ? `<em class="tag-bought">Bought</em>` : ""}
                    ${Number(h.sold_today_qty) > 0 ? `<em class="tag-sold">Sold</em>` : ""}
                  </span>
                </div>
              </td>
              <td class="col-cat"><span class="sleeve ${esc(sleeve)}">${esc(label)}</span></td>
              <td class="col-date mono">${esc(fmtDate(opened))}</td>
              <td class="r mono col-num">${fmtQty(h.qty)}</td>
              <td class="r mono col-num">${inr(h.avg_cost, 2)}</td>
              <td class="r mono col-num">${inr(cost)}</td>
              <td class="r mono col-num live-px" data-px="${esc(h.ticker)}" data-qty="${h.qty}" data-avg="${h.avg_cost}">${inr(h.price, 2)}</td>
              <td class="r mono col-num live-val">${inr(value)}</td>
              <td class="r mono col-num live-pnl ${tone(pnl)}">${signed(pnl)}</td>
              <td class="r mono col-pct ${tone(pnlPct)}">${(pnlPct * 100).toFixed(2)}%</td>
              ${showActions ? `<td class="col-actions"><div class="row-actions">
                ${sell ? `<button class="btn btn-sell btn-sm" data-sell="${esc(h.ticker)}" data-name="${esc(h.name)}" data-qty="${h.qty}" data-price="${h.price}" data-avg="${h.avg_cost}">Sell</button>` : ""}
                ${buy ? `<button class="btn btn-buy btn-sm" data-buy="${esc(h.ticker)}" data-name="${esc(h.name)}" data-sleeve="${esc(h.sleeve)}" data-price="${h.price}">Add</button>` : ""}
              </div></td>` : ""}
            </tr>`;
  }).join("");
  const totalsBar = count ? `
    <div class="holdings-totals">
      <div class="holdings-total"><span>${tip("Cost", "Cost")}</span><strong class="mono">${inr(totalCost)}</strong></div>
      <div class="holdings-total"><span>${tip("Value", "Value")}</span><strong class="mono">${inr(totalValue)}</strong></div>
      <div class="holdings-total"><span>${tip("Open P/L", "Open P/L")}</span><strong class="mono ${tone(totalPnl)}">${signed(totalPnl)}</strong></div>
      <div class="holdings-total holdings-total-note"><span>Math</span><strong>Value − Cost = Open P/L</strong></div>
    </div>` : "";
  const body = !count
    ? `<div class="panel-bd muted">No ${esc(title.toLowerCase())} yet.</div>`
    : `${totalsBar}
        <div class="tbl-tools tbl-tools-clean" data-holdings-tools>
          <div class="tbl-tools-search">
            <span class="tbl-tools-ico" aria-hidden="true">⌕</span>
            <input type="search" class="tbl-search" placeholder="Search ticker or name" aria-label="Search holdings" />
          </div>
          <label class="tbl-field">
            <span>Category</span>
            <select class="tbl-filter-sleeve" aria-label="Filter category">
              <option value="">All</option>
              ${SLEEVE_ORDER.map((s) => `<option value="${esc(s)}">${esc(sleeveLabel(s))}</option>`).join("")}
            </select>
          </label>
          <label class="tbl-field">
            <span>P/L</span>
            <select class="tbl-filter-pnl" aria-label="Filter P/L">
              <option value="">All</option>
              <option value="profit">Profit</option>
              <option value="loss">Loss</option>
            </select>
          </label>
          <label class="tbl-field">
            <span>Sort</span>
            <select class="tbl-sort" aria-label="Sort holdings">
              <option value="value-desc">Value ↓</option>
              <option value="value-asc">Value ↑</option>
              <option value="pnl-desc">P/L ↓</option>
              <option value="pnl-asc">P/L ↑</option>
              <option value="pct-desc">% ↓</option>
              <option value="pct-asc">% ↑</option>
              <option value="ticker-asc">Ticker A–Z</option>
            </select>
          </label>
          <div class="tbl-chip-group" hidden aria-hidden="true">
            <button type="button" class="tbl-chip on" data-pnl="">All</button>
            <button type="button" class="tbl-chip" data-pnl="profit">Profit</button>
            <button type="button" class="tbl-chip" data-pnl="loss">Loss</button>
          </div>
        </div>
        <div class="table-wrap table-wrap-holdings">
        <table class="tbl tbl-premium tbl-holdings tbl-holdings-neat">
          <thead><tr>
            <th class="col-instrument">Instrument</th>
            <th class="col-cat">Category</th>
            <th class="col-date">Opened</th>
            <th class="r col-num">Qty</th>
            <th class="r col-num">Avg</th>
            <th class="r col-num">Cost</th>
            <th class="r col-num">Last</th>
            <th class="r col-num">Value</th>
            <th class="r col-num">P/L</th>
            <th class="r col-pct">%</th>
            ${showActions ? `<th class="col-actions">Actions</th>` : ""}
          </tr></thead>
          <tbody>${bodyRows}</tbody>
          <tfoot><tr class="holdings-foot">
            <td colspan="5"><strong>${count} position${count === 1 ? "" : "s"}</strong></td>
            <td class="r mono"><strong>${inr(totalCost)}</strong></td>
            <td></td>
            <td class="r mono"><strong>${inr(totalValue)}</strong></td>
            <td class="r mono ${tone(totalPnl)}"><strong>${signed(totalPnl)}</strong></td>
            <td class="r mono ${tone(totalPnl)}"><strong>${totalCost ? ((totalPnl / totalCost) * 100).toFixed(2) : "0.00"}%</strong></td>
            ${showActions ? `<td class="col-actions"></td>` : ""}
          </tr></tfoot>
        </table>
      </div>`;
  const smartNote = count
    ? `${open ? "" : "Click to expand · "}Put in ${inr(totalCost)} · worth ${inr(totalValue)} · ${signed(totalPnl)}`
    : (note || "Click header to expand");
  return `
    <details class="panel panel-table holdings-details" ${open ? "open" : ""}>
      <summary class="panel-hd panel-hd-split holdings-summary">
        <div class="panel-title-wrap">
          <span class="holdings-chevron" aria-hidden="true"></span>
          <span class="panel-title">${esc(title)}</span>
          <span class="panel-count">${count}</span>
        </div>
        <span class="panel-note">${esc(smartNote || note)}</span>
      </summary>
      ${body}
    </details>`;
}

function bindHoldingsTools() {
  document.querySelectorAll("[data-holdings-tools]").forEach((tools) => {
    const panel = tools.closest(".holdings-details") || tools.parentElement;
    const tbody = panel?.querySelector("tbody");
    if (!tbody) return;
    tools.querySelectorAll(".tbl-chip").forEach((chip) => {
      chip.onclick = () => {
        tools.querySelectorAll(".tbl-chip").forEach((c) => c.classList.remove("on"));
        chip.classList.add("on");
        const sel = tools.querySelector(".tbl-filter-pnl");
        if (sel) sel.value = chip.dataset.pnl || "";
        apply();
      };
    });
    const apply = () => {
      const q = String(tools.querySelector(".tbl-search")?.value || "").trim().toLowerCase();
      const sleeve = tools.querySelector(".tbl-filter-sleeve")?.value || "";
      const pnlF = tools.querySelector(".tbl-filter-pnl")?.value || "";
      const sort = tools.querySelector(".tbl-sort")?.value || "value-desc";
      const filtered = q || sleeve || pnlF;
      const rows = [...tbody.querySelectorAll("tr[data-ticker]")];
      const groups = [...tbody.querySelectorAll("tr.holdings-group")];
      // When filtering or sorting, flatten — group headers break neat alignment
      groups.forEach((g) => { g.hidden = true; });
      rows.forEach((tr) => {
        const ticker = (tr.dataset.ticker || "").toLowerCase();
        const name = (tr.dataset.name || "").toLowerCase();
        const sl = tr.dataset.sleeve || "";
        const pnl = Number(tr.dataset.pnl) || 0;
        let show = true;
        if (q && !ticker.includes(q) && !name.includes(q)) show = false;
        if (sleeve && sl !== sleeve) show = false;
        if (pnlF === "profit" && !(pnl > 0)) show = false;
        if (pnlF === "loss" && !(pnl < 0)) show = false;
        tr.hidden = !show;
      });
      const visible = rows.filter((tr) => !tr.hidden);
      const [key, dir] = sort.split("-");
      visible.sort((a, b) => {
        let av = 0, bv = 0;
        if (key === "ticker") {
          return dir === "asc"
            ? (a.dataset.ticker || "").localeCompare(b.dataset.ticker || "")
            : (b.dataset.ticker || "").localeCompare(a.dataset.ticker || "");
        }
        if (key === "value") { av = Number(a.dataset.value) || 0; bv = Number(b.dataset.value) || 0; }
        else if (key === "pnl") { av = Number(a.dataset.pnl) || 0; bv = Number(b.dataset.pnl) || 0; }
        else if (key === "pct") { av = Number(a.dataset.pct) || 0; bv = Number(b.dataset.pct) || 0; }
        return dir === "asc" ? av - bv : bv - av;
      });
      // Rebuild tbody: sorted data rows only (no interleaved groups while tools active)
      visible.forEach((tr) => tbody.appendChild(tr));
      // Keep hidden groups at end so they don't disrupt
      groups.forEach((g) => tbody.appendChild(g));
      const countEl = panel.querySelector(".panel-count");
      if (countEl && (filtered || sort !== "value-desc")) {
        countEl.textContent = String(visible.length);
        countEl.title = filtered ? "Matching filter" : "Sorted view";
      }
    };
    tools.querySelectorAll("input, select").forEach((el) => el.addEventListener("input", apply));
    tools.querySelectorAll("select").forEach((el) => el.addEventListener("change", apply));
  });
}

function sessionActivityPanel(d, { buy = false, sell = false } = {}) {
  const act = d.session_activity || null;
  const dayLabel = fmtDate(act?.date || d.session_date || d.calendar_date || d.view_date);
  const buys = act?.buys || [];
  const sells = act?.sells || [];
  const count = buys.length + sells.length;
  const canAct = !!(buy || sell) && !d.readonly;
  const posBy = Object.fromEntries((d.holdings || []).map((h) => [String(h.ticker).toUpperCase(), h]));
  if (!count) {
    return `
      <details class="panel panel-table holdings-details session-activity-panel">
        <summary class="panel-hd panel-hd-split holdings-summary">
          <div class="panel-title-wrap">
            <span class="holdings-chevron" aria-hidden="true"></span>
            <span class="panel-title">Today’s buys & sells</span>
            <span class="panel-count">0</span>
          </div>
          <span class="panel-note">${esc(dayLabel)} · click to expand</span>
        </summary>
        <div class="panel-bd muted">No buys or sells in this session yet.${canAct ? ` <a href="#/trade">Invest on Trade</a>` : ""}</div>
      </details>`;
  }
  const row = (r, side) => {
    const ticker = String(r.ticker || "").toUpperCase();
    const pos = posBy[ticker];
    const px = Number(pos?.price ?? r.avg_price) || 0;
    const heldQty = Number(pos?.qty) || 0;
    let actions = "";
    if (canAct) {
      const bits = [];
      if (buy) {
        bits.push(`<button type="button" class="btn btn-buy btn-sm" data-buy="${esc(ticker)}" data-name="${esc(r.name || ticker)}" data-sleeve="${esc(r.sleeve || pos?.sleeve || "")}" data-price="${px}">Buy more</button>`);
      }
      if (sell && heldQty > 0) {
        bits.push(`<button type="button" class="btn btn-sell btn-sm" data-sell="${esc(ticker)}" data-name="${esc(r.name || ticker)}" data-qty="${heldQty}" data-price="${px}" data-avg="${Number(pos?.avg_cost) || Number(r.avg_price) || 0}">Sell</button>`);
      } else if (sell && side === "sell" && heldQty <= 0) {
        bits.push(`<span class="tiny muted">Fully sold</span>`);
      }
      actions = `<td class="actions session-row-actions">${bits.join(" ")}</td>`;
    }
    return `
    <tr class="session-${side}">
      <td><span class="session-side ${side}">${side === "buy" ? "Bought" : "Sold"}</span></td>
      <td>${tickerCell(r.ticker, r.name)}</td>
      <td class="r mono">${fmtQty(r.qty)}</td>
      <td class="r mono">${inr(r.avg_price, 2)}</td>
      <td class="r mono"><strong>${inr(r.amount)}</strong></td>
      <td class="tiny muted">${esc(r.reason || (r.fills > 1 ? `${r.fills} fills` : "—"))}</td>
      ${actions}
    </tr>`;
  };
  return `
    <details class="panel panel-table holdings-details session-activity-panel" open>
      <summary class="panel-hd panel-hd-split holdings-summary">
        <div class="panel-title-wrap">
          <span class="holdings-chevron" aria-hidden="true"></span>
          <span class="panel-title">Today’s buys & sells</span>
          <span class="panel-count">${count}</span>
        </div>
        <span class="panel-note">Click to expand · ${esc(dayLabel)} · bought ${inr(act.bought_amount || 0)} · sold ${inr(act.sold_amount || 0)}</span>
      </summary>
      <div class="session-activity-stats">
        <div class="session-stat buy">
          <span>Bought</span>
          <strong class="mono">${act.buy_count || 0} name${(act.buy_count || 0) === 1 ? "" : "s"}</strong>
          <em class="mono">${fmtQty(act.bought_qty || 0)} units · ${inr(act.bought_amount || 0)}</em>
        </div>
        <div class="session-stat sell">
          <span>Sold</span>
          <strong class="mono">${act.sell_count || 0} name${(act.sell_count || 0) === 1 ? "" : "s"}</strong>
          <em class="mono">${fmtQty(act.sold_qty || 0)} units · ${inr(act.sold_amount || 0)}</em>
        </div>
      </div>
      <div class="table-wrap">
        <table class="tbl tbl-premium session-trades-tbl">
          <thead><tr>
            <th>Side</th>
            <th>Instrument</th>
            <th class="r">Qty</th>
            <th class="r">Avg price</th>
            <th class="r">Amount</th>
            <th>Note</th>
            ${canAct ? `<th class="r">Actions</th>` : ""}
          </tr></thead>
          <tbody>
            ${buys.map((r) => row(r, "buy")).join("")}
            ${sells.map((r) => row(r, "sell")).join("")}
          </tbody>
        </table>
      </div>
    </details>`;
}

function holdingsSimpleTable(rows, { buy = true, sell = true } = {}) {
  const list = [...(rows || [])].sort((a, b) => (Number(b.market_value) || 0) - (Number(a.market_value) || 0));
  const showActions = buy || sell;
  if (!list.length) {
    return `<div class="panel panel-bd empty-cta"><p class="muted">No open positions yet.</p><a class="btn btn-primary" href="#/trade">Go to Trade</a></div>`;
  }
  let totalValue = 0;
  let totalPnl = 0;
  const body = list.map((h) => {
    const value = Number(h.market_value) || ((Number(h.qty) || 0) * (Number(h.price) || 0));
    const cost = (Number(h.qty) || 0) * (Number(h.avg_cost) || 0);
    const pnl = Number(h.pnl) || (value - cost);
    totalValue += value;
    totalPnl += pnl;
    const bought = Number(h.bought_today_qty) > 0;
    const sold = Number(h.sold_today_qty) > 0;
    return `<tr data-ticker="${esc(String(h.ticker || "").toUpperCase())}" data-name="${esc(String(h.name || "").toLowerCase())}" data-sleeve="${esc(h.sleeve || "")}" data-pnl="${pnl}" data-value="${value}" data-pct="0">
      <td>
        <div class="hold-simple-name">
          <strong class="mono">${esc(h.ticker)}</strong>
          <span>${esc(h.name || "")}</span>
          ${bought ? `<em class="tag-bought">Bought</em>` : ""}
          ${sold ? `<em class="tag-sold">Sold</em>` : ""}
        </div>
      </td>
      <td class="r mono">${fmtQty(h.qty)}</td>
      <td class="r mono live-px" data-px="${esc(h.ticker)}" data-qty="${h.qty}" data-avg="${h.avg_cost}">${inr(h.price, 2)}</td>
      <td class="r mono live-val">${inr(value)}</td>
      <td class="r mono live-pnl ${tone(pnl)}">${signed(pnl)}</td>
      ${showActions ? `<td class="col-actions"><div class="row-actions">
        ${sell ? `<button class="btn btn-sell btn-sm" data-sell="${esc(h.ticker)}" data-name="${esc(h.name)}" data-qty="${h.qty}" data-price="${h.price}" data-avg="${h.avg_cost}">Sell</button>` : ""}
        ${buy ? `<button class="btn btn-buy btn-sm" data-buy="${esc(h.ticker)}" data-name="${esc(h.name)}" data-sleeve="${esc(h.sleeve)}" data-price="${h.price}">Add</button>` : ""}
      </div></td>` : ""}
    </tr>`;
  }).join("");
  return `
    <div class="panel panel-table holdings-simple">
      <div class="panel-hd panel-hd-split">
        <div class="panel-title-wrap">
          <span class="panel-title">Open positions</span>
          <span class="panel-count">${list.length}</span>
        </div>
        <span class="panel-note">Worth ${inr(totalValue)} · P/L ${signed(totalPnl)}</span>
      </div>
      <div class="tbl-tools" data-holdings-tools>
        <div class="tbl-tools-search">
          <span class="tbl-tools-ico" aria-hidden="true">⌕</span>
          <input type="search" class="tbl-search" placeholder="Search ticker…" aria-label="Search holdings" />
        </div>
        <select class="tbl-filter-sleeve" hidden aria-hidden="true"><option value="">All</option></select>
        <select class="tbl-filter-pnl" hidden aria-hidden="true"><option value="">All</option></select>
        <select class="tbl-sort" hidden aria-hidden="true"><option value="value-desc">Value</option></select>
      </div>
      <div class="table-wrap">
        <table class="tbl tbl-premium tbl-holdings-simple">
          <thead><tr>
            <th>Name</th>
            <th class="r">Qty</th>
            <th class="r">Price</th>
            <th class="r">Value</th>
            <th class="r">P/L</th>
            ${showActions ? `<th class="col-actions"></th>` : ""}
          </tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </div>`;
}

function holdingsSections(d, { buy = true, sell = true, compact = false } = {}) {
  const all = d.holdings || [];
  if (!all.length) {
    return `
    <div class="panel panel-bd empty-cta">
      <p class="muted">No open positions yet.</p>
      <a class="btn btn-primary" href="#/trade">Go to Trade</a>
    </div>`;
  }
  if (compact) {
    return `<div class="holdings-sections holdings-compact">${holdingsSimpleTable(all, { buy, sell })}</div>`;
  }
  const active = all.filter(
    (h) =>
      h.bucket === "today" ||
      Number(h.bought_today_qty) > 0 ||
      Number(h.sold_today_qty) > 0
  );
  const activeTickers = new Set(active.map((h) => String(h.ticker).toUpperCase()));
  const quiet = all.filter((h) => !activeTickers.has(String(h.ticker).toUpperCase()));
  const sessionLabel = fmtDate(d.session_date || d.calendar_date || d.view_date);
  const boughtN = active.filter((h) => Number(h.bought_today_qty) > 0).length;
  const openedN = active.filter((h) => h.bucket === "today").length;
  return `
    <div class="holdings-sections">
      ${sessionActivityPanel(d, { buy, sell })}
      ${holdingsTable(active, {
        buy,
        sell,
        title: "Active this session",
        note: `${sessionLabel} · ${openedN} new · ${boughtN} bought`,
        open: true,
      })}
      ${holdingsTable(quiet, {
        buy,
        sell,
        title: "Held from earlier",
        note: "Still open from a previous session",
        open: false,
        groupByDate: true,
      })}
    </div>`;
}

function agentByKey(agents, key) {
  const list = Array.isArray(agents) ? agents : [];
  return list.find((a) => (a.agent || a.title || "").toLowerCase().includes(key)) || {};
}

function comparisonTable(results) {
  if (!results || results.length < 2) return "";
  const scored = results.map((r) => ({
    ...r,
    comp: Number(r.debate?.composite_score ?? r.score?.score ?? 0),
  })).sort((a, b) => b.comp - a.comp);
  const best = scored[0];
  const metrics = [
    { label: "Price", fn: (r) => inr(r.price, 2) },
    { label: "Score", fn: (r) => String(Math.round(r.comp)) },
    { label: "Verdict", fn: (r) => r.debate?.verdict || "—" },
    { label: "Market", fn: (r) => `${Number(agentByKey(r.agents, "market").score || 0).toFixed(0)}` },
    { label: "Sentiment", fn: (r) => `${Number(agentByKey(r.agents, "social").score || 0).toFixed(0)}` },
    { label: "News", fn: (r) => `${Number(agentByKey(r.agents, "news").score || 0).toFixed(0)}` },
    { label: "Fundamentals", fn: (r) => `${Number(agentByKey(r.agents, "fundamental").score || 0).toFixed(0)}` },
  ];
  return `
    <div class="panel compare-panel">
      <div class="panel-hd panel-hd-split">
        <div class="panel-title-wrap">
          <span class="panel-title">Comparison</span>
          <span class="panel-count">${scored.length}</span>
        </div>
        <span class="panel-note">Ranked by score · swipe cards on small screens</span>
      </div>
      <div class="panel-bd compare-bd">
        <div class="compare-winner">
          <span class="compare-winner-lbl">Top pick</span>
          <strong>${esc(best.ticker)}</strong>
          <span class="muted">${esc(best.name)}</span>
          ${verdictBadge(best.debate?.verdict)}
          <span class="mono">score ${Math.round(best.comp)}</span>
        </div>
        <div class="compare-cards" role="list">
          ${scored.map((r, i) => `
            <article class="compare-card${r.ticker === best.ticker ? " is-best" : ""}" role="listitem">
              <div class="compare-card-rank mono">#${i + 1}</div>
              <div class="compare-card-top">
                <div>
                  <h3 class="compare-card-ticker mono">${esc(r.ticker)}</h3>
                  <p class="compare-card-name">${esc(r.name)}</p>
                </div>
                ${verdictBadge(r.debate?.verdict)}
              </div>
              <div class="compare-card-score">
                <span class="compare-card-score-val mono">${Math.round(r.comp)}</span>
                <span class="compare-card-score-lbl">composite</span>
              </div>
              <div class="compare-card-agents">
                <span><em>Mkt</em><strong class="mono">${Number(agentByKey(r.agents, "market").score || 0).toFixed(0)}</strong></span>
                <span><em>Sent</em><strong class="mono">${Number(agentByKey(r.agents, "social").score || 0).toFixed(0)}</strong></span>
                <span><em>News</em><strong class="mono">${Number(agentByKey(r.agents, "news").score || 0).toFixed(0)}</strong></span>
                <span><em>Fund</em><strong class="mono">${Number(agentByKey(r.agents, "fundamental").score || 0).toFixed(0)}</strong></span>
              </div>
              <p class="compare-card-price mono live-px" data-px="${esc(r.ticker)}">${inr(r.price, 2)}</p>
              <a class="btn btn-sm btn-ghost btn-block" href="#/research/${esc(r.ticker)}">Open report</a>
            </article>`).join("")}
        </div>
        <details class="compare-matrix">
          <summary>Full score matrix</summary>
          <div class="table-wrap compare-scroll">
            <table class="tbl tbl-premium compare-tbl">
              <thead><tr><th class="compare-sticky">Metric</th>${scored.map((r) => `<th class="r ${r.ticker === best.ticker ? "best" : ""}"><span class="mono">${esc(r.ticker)}</span></th>`).join("")}</tr></thead>
              <tbody>${metrics.map((m) => `
                <tr>
                  <td class="compare-sticky">${esc(m.label)}</td>
                  ${scored.map((r) => `<td class="r mono ${r.ticker === best.ticker && m.label === "Score" ? "best" : ""}">${esc(m.fn(r))}</td>`).join("")}
                </tr>`).join("")}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>`;
}

function popularBar(rows, label = "Popular") {
  if (!rows?.length) return "";
  return `
    <div class="popular-bar">
      <span class="lbl">${esc(label)}</span>
      ${rows.map((r) => `<button type="button" class="pop-chip" data-ticker="${esc(r.ticker)}" title="${esc(r.name)}">${esc(r.ticker)}</button>`).join("")}
    </div>`;
}

function recommendationPicksBar(suggestions) {
  const picks = (suggestions || []).slice(0, 6);
  if (!picks.length) return "";
  return `
    <div class="popular-bar picks-bar">
      <span class="lbl">Today's picks</span>
      ${picks.map((b) => `<button type="button" class="pop-chip" data-ticker="${esc(b.ticker)}" title="${esc(b.name)}">${esc(b.ticker)}</button>`).join("")}
    </div>`;
}

function bindRecommendationExtras(suggestions, { onPick } = {}) {
  const go = onPick || ((t) => { location.hash = `#/research/${t}`; });
  bindSearchBox({ inputId: "recSearch", boxId: "recSuggestBox", onPick: go });
  bindPopularBar("recPopular", go);
  const picksEl = document.getElementById("recPicks");
  if (picksEl) picksEl.querySelectorAll(".pop-chip").forEach((b) => b.addEventListener("click", () => go(b.dataset.ticker)));
}

function recommendationSearchBox(suggestions) {
  return `
    <div class="panel panel-search">
      <div class="panel-bd">
        <div class="search-row">
          <div class="search-block">
            <div class="search-wrap">
              <input class="search" id="recSearch" placeholder="Search stocks — TCS, Reliance, Gold, BTC…" autocomplete="off" />
              <div class="suggest" id="recSuggestBox" hidden></div>
            </div>
            <span class="search-hint">Click the search box to see popular stocks. Type to filter.</span>
          </div>
        </div>
        <div id="recPopular"></div>
        <div id="recPicks">${recommendationPicksBar(suggestions)}</div>
      </div>
    </div>`;
}

async function fetchSearchResults(query = "") {
  const data = await api(`/api/search?q=${encodeURIComponent(query)}`);
  return data.results || [];
}

function renderSuggestBox(box, rows, { heading, onPick }) {
  if (!box) return;
  if (!rows.length) { box.innerHTML = `<div class="tiny" style="padding:10px">No match</div>`; box.hidden = false; return; }
  box.innerHTML = `${heading ? `<div class="suggest-hd">${esc(heading)}</div>` : ""}${rows.map((r) => `
    <button type="button" data-ticker="${esc(r.ticker)}">
      <span><strong>${esc(r.ticker)}</strong> ${esc(r.name)}</span>
      <span class="tiny">${esc(r.sleeve)}</span>
    </button>`).join("")}`;
  box.hidden = false;
  box.querySelectorAll("button[data-ticker]").forEach((b) => b.addEventListener("click", () => onPick(b.dataset.ticker)));
}

let searchOutsideHandler = null;

function bindSearchBox({ inputId, boxId, onPick, showPopularOnFocus = true }) {
  const q = document.getElementById(inputId), box = document.getElementById(boxId);
  if (!q || !box) return;
  const block = q.closest(".search-block") || q.closest(".search-wrap") || q.parentElement;
  let timer;

  const load = async (query) => {
    try {
      const rows = await fetchSearchResults(query);
      renderSuggestBox(box, rows, {
        heading: query ? "Matches" : "Popular stocks",
        onPick: (t) => { onPick(t); box.hidden = true; q.value = ""; },
      });
    } catch { box.hidden = true; }
  };

  q.addEventListener("focus", () => { if (showPopularOnFocus) load(q.value.trim()); });
  q.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => load(q.value.trim()), 120); });
  q.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const first = box.querySelector("button[data-ticker]");
      const raw = (first?.dataset.ticker || q.value || "").trim().toUpperCase();
      if (raw) { onPick(raw); box.hidden = true; q.value = ""; }
    }
    if (e.key === "Escape") box.hidden = true;
  });

  const stopClose = (e) => e.stopPropagation();
  q.addEventListener("mousedown", stopClose);
  box.addEventListener("mousedown", stopClose);
  block?.addEventListener("mousedown", stopClose);

  if (searchOutsideHandler) document.removeEventListener("click", searchOutsideHandler);
  searchOutsideHandler = (e) => {
    if (!q.isConnected) return;
    if (!q.contains(e.target) && !box.contains(e.target)) box.hidden = true;
  };
  document.addEventListener("click", searchOutsideHandler);
}

function bindPopularBar(containerId, onPick) {
  const el = document.getElementById(containerId);
  if (!el) return;
  fetchSearchResults("").then((rows) => {
    el.innerHTML = popularBar(rows, "Popular stocks").replace(/<button/g, '<button type="button"');
    el.querySelectorAll(".pop-chip").forEach((b) => b.addEventListener("click", () => onPick(b.dataset.ticker)));
  });
}

function researchReport(data, { canBuy = true } = {}) {
  const agents = Array.isArray(data.agents) ? data.agents : [];
  const debate = data.debate || {};
  const coreAgents = agents.filter((a) => {
    const k = (a.agent || a.title || "").toLowerCase();
    return ["market", "social", "news", "fundamental"].some((x) => k.includes(x));
  });
  const show = coreAgents.length ? coreAgents : agents.slice(0, 4);
  const score = debate.composite_score != null ? Math.round(Number(debate.composite_score)) : null;
  const verdict = String(debate.verdict || "HOLD").toUpperCase();
  const stanceCls = (s) => (s === "bullish" ? "up" : s === "bearish" ? "down" : "flat");

  const agentCards = show.map((a) => {
    const sources = Array.isArray(a.sources) ? a.sources : [];
    const links = Array.isArray(a.source_links) ? a.source_links : [];
    const signals = Array.isArray(a.signals) ? a.signals.slice(0, 4) : [];
    const headlines = Array.isArray(a.headlines) ? a.headlines.slice(0, 3) : [];
    const sc = Math.round(Number(a.score) || 0);
    const shortTitle = String(a.title || a.agent || "Agent")
      .replace(/agent/gi, "")
      .replace(/media/gi, "")
      .trim() || "Agent";
    return `
      <article class="rx-agent ${stanceCls(a.stance)}">
        <header class="rx-agent-hd">
          <div>
            <h3>${esc(shortTitle)}</h3>
            <span class="rx-stance ${stanceCls(a.stance)}">${esc(a.stance || "neutral")}</span>
          </div>
          <div class="rx-agent-score mono" aria-label="Agent score ${sc}">
            <strong>${sc}</strong><span>/100</span>
          </div>
        </header>
        <div class="rx-meter" aria-hidden="true"><i style="width:${Math.min(100, Math.max(0, sc))}%"></i></div>
        <p class="rx-agent-sum">${esc(a.summary || "No summary.")}</p>
        ${signals.length ? `<div class="rx-sigs">${signals.map((s) =>
          `<span class="rx-sig"><em>${esc(s.label)}</em><strong class="mono">${esc(s.value)}</strong></span>`
        ).join("")}</div>` : ""}
        ${(links.length || sources.length || headlines.length) ? `
          <details class="rx-more">
            <summary>Sources &amp; detail</summary>
            ${links.length ? `<div class="rx-links">${links.map((l) =>
              `<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label || "Source")}</a>`
            ).join("")}</div>` : ""}
            ${sources.length ? `<ul class="rx-src-list">${sources.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
            ${headlines.length ? `<ul class="rx-headlines">${headlines.map((h) =>
              `<li><time class="mono">${esc(h.date || "")}</time> ${esc(h.title || "")}</li>`
            ).join("")}</ul>` : ""}
          </details>` : ""}
      </article>`;
  }).join("");

  return `
    <article class="rx-report" aria-label="Research ${esc(data.ticker)}">
      <header class="rx-hero">
        <div class="rx-hero-main">
          <p class="rx-kicker">${esc(sleeveLabel(data.sleeve || data.asset))}</p>
          <h2 class="rx-ticker mono">${esc(data.ticker)}</h2>
          <p class="rx-name">${esc(data.name || "")}</p>
          <p class="rx-why">${esc(debate.rationale || "Desk agents reviewed this name.")}</p>
          <div class="rx-cta">
            ${canBuy && !viewDate
              ? `<button class="btn btn-buy" data-buy="${esc(data.ticker)}" data-name="${esc(data.name)}" data-sleeve="${esc(data.sleeve || data.asset)}" data-price="${data.price}">Invest in ${esc(data.ticker)}</button>`
              : (!viewDate ? `<a class="btn btn-ghost" href="#/trade">Unlock invest on Trade</a>` : "")}
            <a class="btn btn-ghost" href="#/trade">Back to Trade</a>
          </div>
        </div>
        <aside class="rx-hero-side">
          <div class="rx-price-block">
            <span class="rx-price-lbl">Last</span>
            <strong class="rx-price mono live-px" data-px="${esc(data.ticker)}">${inr(data.price, 2)}</strong>
          </div>
          <div class="rx-verdict-wrap">${verdictBadge(verdict)}</div>
          ${score != null ? `
            <div class="rx-composite">
              <span>Composite</span>
              <strong class="mono">${score}<em>/100</em></strong>
              <div class="rx-meter rx-meter-lg" aria-hidden="true"><i style="width:${score}%"></i></div>
            </div>` : ""}
        </aside>
      </header>

      <section class="rx-agents" aria-label="Agent scores">
        <div class="rx-sec-hd">
          <h3>Four-agent desk</h3>
          <p>Market · Sentiment · News · Fundamentals</p>
        </div>
        <div class="rx-agent-grid">${agentCards}</div>
      </section>

      <section class="rx-debate" aria-label="Bull and bear">
        <div class="rx-case rx-case-bull">
          <h3>Bull case</h3>
          <ul>${(debate.bull?.points || []).map((p) => `<li>${esc(p)}</li>`).join("") || "<li>No bull points logged.</li>"}</ul>
        </div>
        <div class="rx-case rx-case-bear">
          <h3>Bear case</h3>
          <ul>${(debate.bear?.points || []).map((p) => `<li>${esc(p)}</li>`).join("") || "<li>No bear points logged.</li>"}</ul>
        </div>
      </section>
    </article>`;
}

const LIVE_SEED = ["TCS", "RELIANCE", "HDFCBANK", "INFY", "AAPL", "NVDA", "GOLD", "BTC", "ETH"];
window.__livePrev = window.__livePrev || {};
window.__liveFeed = window.__liveFeed || [];

function fmtTickTime(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch { return "—"; }
}

function fmtAge(ts) {
  if (!ts) return "";
  const sec = Math.max(0, Math.round(Date.now() / 1000 - ts));
  if (sec < 2) return "just now";
  if (sec < 60) return `${sec}s ago`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s ago`;
}

function chgLabel(pct) {
  const n = Number(pct) || 0;
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

window.__liveSparks = window.__liveSparks || {};
window.__chartSeries = window.__chartSeries || [];

function seedLiveSparks(snap) {
  const sparks = snap?.sparks || {};
  Object.entries(sparks).forEach(([t, closes]) => {
    const arr = (closes || []).map(Number).filter((n) => n > 0);
    if (arr.length >= 2) window.__liveSparks[t] = arr.slice(-48);
  });
  Object.entries(snap?.quotes || {}).forEach(([t, q]) => {
    const px = Number(q.price) || 0;
    if (px <= 0) return;
    const cur = window.__liveSparks[t] || [];
    if (!cur.length) window.__liveSparks[t] = [px, px];
    else if (Math.abs(cur[cur.length - 1] - px) > 1e-6) {
      cur.push(px);
      window.__liveSparks[t] = cur.slice(-48);
    }
  });
}

const CHART_COLORS = ["#4d9fff", "#3ecf7a", "#f06767", "#e8b84a", "#a78bfa", "#4ec9b0", "#c084fc", "#5eb8f0"];

function pickChartTickers(snap, limit = 6) {
  const selected = (window.__chartSeries || []).filter(Boolean);
  if (selected.length) return selected.slice(0, limit);
  const rows = Object.entries(snap?.quotes || {})
    .filter(([, q]) => Number(q.price) > 0)
    .sort((a, b) => Math.abs(Number(b[1].chg_pct) || 0) - Math.abs(Number(a[1].chg_pct) || 0))
    .map(([t]) => t);
  const picks = rows.length ? rows.slice(0, limit) : LIVE_SEED.slice(0, limit);
  window.__chartSeries = picks;
  return picks;
}

function multiLiveChartSvg(snap, tickers) {
  const w = 920, h = 320, padL = 44, padR = 16, padT = 18, padB = 28;
  const series = [];
  tickers.forEach((t, i) => {
    const raw = (window.__liveSparks[t] || []).map(Number).filter((n) => n > 0);
    if (raw.length < 2) return;
    const base = raw[0] || 1;
    const norm = raw.map((v) => ((v / base) - 1) * 100);
    series.push({ t, color: CHART_COLORS[i % CHART_COLORS.length], pts: norm, raw, last: raw[raw.length - 1], chg: Number(snap?.quotes?.[t]?.chg_pct) || 0 });
  });
  if (!series.length) {
    return `<div class="live-chart-empty">Waiting for live marks…</div>`;
  }
  const all = series.flatMap((s) => s.pts);
  let min = Math.min(...all, -0.5);
  let max = Math.max(...all, 0.5);
  if (Math.abs(max - min) < 0.4) { min -= 0.5; max += 0.5; }
  const span = max - min || 1;
  const n = Math.max(...series.map((s) => s.pts.length));
  const xAt = (i) => padL + (i / Math.max(n - 1, 1)) * (w - padL - padR);
  const yAt = (v) => padT + (1 - (v - min) / span) * (h - padT - padB);
  const zeroY = yAt(0);
  const paths = series.map((s) => {
    const d = s.pts.map((v, i) => `${i ? "L" : "M"}${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(" ");
    return `<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join("");
  const dots = series.map((s, si) =>
    `<circle class="live-chart-dot" data-series-i="${si}" cx="0" cy="0" r="4.5" fill="${s.color}" opacity="0"/>`
  ).join("");
  const legend = series.map((s) => `
    <button type="button" class="live-chart-leg" data-chart-toggle="${esc(s.t)}" data-live-ticker="${esc(s.t)}" style="--c:${s.color}" title="Click to toggle · hover for details">
      <i></i><strong class="mono">${esc(s.t)}</strong>
      <span class="mono ${s.chg >= 0 ? "up" : "down"}">${chgLabel(s.chg)}</span>
    </button>`).join("");
  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const y = padT + f * (h - padT - padB);
    const val = max - f * span;
    return `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="var(--line)" stroke-width="1"/>
      <text x="${padL - 8}" y="${y + 4}" text-anchor="end" class="live-chart-axis">${val >= 0 ? "+" : ""}${val.toFixed(1)}%</text>`;
  }).join("");
  const payload = encodeURIComponent(JSON.stringify(series.map((s) => ({
    t: s.t, color: s.color, pts: s.pts, raw: s.raw, chg: s.chg, last: s.last,
  }))));
  return `
    <div class="live-chart-wrap" data-live-chart="1" data-chart-n="${n}" data-chart-pad-l="${padL}" data-chart-pad-r="${padR}" data-chart-w="${w}" data-chart-series="${payload}">
      <svg class="live-chart-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Live multi-ticker price chart">
        ${grid}
        <line x1="${padL}" y1="${zeroY}" x2="${w - padR}" y2="${zeroY}" stroke="var(--text-faint)" stroke-width="1" stroke-dasharray="4 4"/>
        ${paths}
        <g class="live-chart-hover" opacity="0" pointer-events="none">
          <line class="live-chart-vline" x1="0" y1="${padT}" x2="0" y2="${h - padB}" stroke="var(--text-muted)" stroke-width="1" stroke-dasharray="3 3"/>
          ${dots}
        </g>
        <rect class="live-chart-hit" x="${padL}" y="${padT}" width="${w - padL - padR}" height="${h - padT - padB}" fill="transparent" tabindex="0"/>
      </svg>
      <div class="live-chart-tip" id="liveChartTip" hidden></div>
      <div class="live-chart-legend" id="liveChartLegend">${legend}</div>
    </div>`;
}

function paintLiveChart(snap) {
  const host = document.getElementById("liveChartHost");
  if (!host) return;
  seedLiveSparks(snap);
  if (snap) window.__liveSnap = snap;
  const tickers = pickChartTickers(snap, 6);
  host.innerHTML = multiLiveChartSvg(snap, tickers);
  host.querySelectorAll("[data-chart-toggle]").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const t = btn.dataset.chartToggle;
      const cur = window.__chartSeries || [];
      if (cur.includes(t) && cur.length > 1) window.__chartSeries = cur.filter((x) => x !== t);
      else if (!cur.includes(t)) window.__chartSeries = [...cur, t].slice(0, 8);
      paintLiveChart(snap || window.__liveSnap);
    };
  });
  bindLiveChartHover(host);
  bindLiveQuoteDetails(host);
}

function liveQuoteSnapshot(ticker) {
  const t = String(ticker || "").toUpperCase();
  const q = window.__liveSnap?.quotes?.[t] || {};
  const spark = window.__liveSparks?.[t] || [];
  const price = Number(q.price) || Number(spark[spark.length - 1]) || 0;
  const prev = Number(q.prev) || (spark.length > 1 ? spark[spark.length - 2] : price) || 0;
  const chg = Number(q.chg_pct);
  const chgPct = Number.isFinite(chg) ? chg : (prev ? ((price - prev) / prev) * 100 : 0);
  const dayHigh = spark.length ? Math.max(...spark) : price;
  const dayLow = spark.length ? Math.min(...spark) : price;
  return {
    ticker: t,
    price,
    prev,
    chgPct,
    dayHigh,
    dayLow,
    source: q.source || "",
    ts: q.ts || 0,
    sparkN: spark.length,
  };
}

function liveQuoteDetailHtml(info) {
  if (!info?.ticker) return "";
  const up = info.chgPct >= 0;
  return `
    <div class="live-qtip-hd">
      <strong class="mono">${esc(info.ticker)}</strong>
      <span class="mono ${up ? "up" : "down"}">${chgLabel(info.chgPct)}</span>
    </div>
    <div class="live-qtip-grid">
      <div><em>Last</em><strong class="mono">${inr(info.price, 2)}</strong></div>
      <div><em>Prev tick</em><strong class="mono">${inr(info.prev, 2)}</strong></div>
      <div><em>Session high*</em><strong class="mono">${inr(info.dayHigh, 2)}</strong></div>
      <div><em>Session low*</em><strong class="mono">${inr(info.dayLow, 2)}</strong></div>
    </div>
    <p class="live-qtip-foot">${info.ts ? `As of ${esc(fmtTickTime(info.ts))}` : "Live mark"}${info.sparkN ? ` · ${info.sparkN} points in window` : ""} · *from live window</p>
    <a class="btn btn-sm btn-ghost live-qtip-link" href="#/research/${esc(info.ticker)}">Open research</a>`;
}

function ensureLiveQuoteTip() {
  let tip = document.getElementById("liveQuoteTip");
  if (tip) return tip;
  tip = document.createElement("div");
  tip.id = "liveQuoteTip";
  tip.className = "live-quote-tip";
  tip.hidden = true;
  document.body.appendChild(tip);
  return tip;
}

function hideLiveQuoteTip() {
  const tip = document.getElementById("liveQuoteTip");
  if (!tip) return;
  tip.hidden = true;
  tip.classList.remove("is-open");
}

function showLiveQuoteTip(anchor, ticker, { pin = false } = {}) {
  const info = liveQuoteSnapshot(ticker);
  if (!info.price) return;
  const tip = ensureLiveQuoteTip();
  tip.innerHTML = liveQuoteDetailHtml(info);
  tip.hidden = false;
  tip.classList.add("is-open");
  tip.dataset.pin = pin ? "1" : "0";
  tip.dataset.ticker = info.ticker;
  const r = anchor.getBoundingClientRect();
  const tw = tip.offsetWidth || 260;
  const th = tip.offsetHeight || 160;
  let left = r.left + window.scrollX + (r.width / 2) - (tw / 2);
  let top = r.bottom + window.scrollY + 8;
  left = Math.max(12 + window.scrollX, Math.min(left, window.scrollX + window.innerWidth - tw - 12));
  if (top + th > window.scrollY + window.innerHeight - 12) {
    top = r.top + window.scrollY - th - 8;
  }
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

function bindLiveQuoteDetails(root = document) {
  const scope = root || document;
  scope.querySelectorAll("[data-live-ticker]").forEach((el) => {
    if (el.dataset.liveBound === "1") return;
    el.dataset.liveBound = "1";
    el.addEventListener("mouseenter", () => {
      if (document.getElementById("liveQuoteTip")?.dataset.pin === "1") return;
      showLiveQuoteTip(el, el.dataset.liveTicker, { pin: false });
    });
    el.addEventListener("mouseleave", () => {
      if (document.getElementById("liveQuoteTip")?.dataset.pin === "1") return;
      hideLiveQuoteTip();
    });
    el.addEventListener("click", (e) => {
      // Chips / legend still toggle series — show pinned tip too
      if (el.matches(".live-series-chip, .live-chart-leg")) {
        showLiveQuoteTip(el, el.dataset.liveTicker, { pin: true });
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const tip = document.getElementById("liveQuoteTip");
      const open = tip && !tip.hidden && tip.dataset.ticker === el.dataset.liveTicker && tip.dataset.pin === "1";
      if (open) hideLiveQuoteTip();
      else showLiveQuoteTip(el, el.dataset.liveTicker, { pin: true });
    });
  });
  if (!window.__liveTipOutside) {
    window.__liveTipOutside = (e) => {
      const tip = document.getElementById("liveQuoteTip");
      if (!tip || tip.hidden || tip.dataset.pin !== "1") return;
      if (tip.contains(e.target)) return;
      if (e.target.closest?.("[data-live-ticker]")) return;
      hideLiveQuoteTip();
    };
    document.addEventListener("click", window.__liveTipOutside);
  }
}

function bindLiveChartHover(host) {
  const wrap = host?.querySelector("[data-live-chart]");
  const svg = wrap?.querySelector(".live-chart-svg");
  const hit = wrap?.querySelector(".live-chart-hit");
  const hover = wrap?.querySelector(".live-chart-hover");
  const tip = wrap?.querySelector(".live-chart-tip");
  if (!wrap || !svg || !hit || !hover || !tip) return;
  let series = [];
  try { series = JSON.parse(decodeURIComponent(wrap.dataset.chartSeries || "%5B%5D")); } catch { series = []; }
  const n = Number(wrap.dataset.chartN) || 0;
  const padL = Number(wrap.dataset.chartPadL) || 44;
  const padR = Number(wrap.dataset.chartPadR) || 16;
  const w = Number(wrap.dataset.chartW) || 920;
  const plotW = w - padL - padR;
  const vline = hover.querySelector(".live-chart-vline");
  const dots = [...hover.querySelectorAll(".live-chart-dot")];

  const hide = () => {
    hover.setAttribute("opacity", "0");
    tip.hidden = true;
  };
  const showAt = (clientX) => {
    const rect = svg.getBoundingClientRect();
    const xSvg = ((clientX - rect.left) / Math.max(rect.width, 1)) * w;
    const i = Math.round(((xSvg - padL) / Math.max(plotW, 1)) * Math.max(n - 1, 1));
    const idx = Math.max(0, Math.min(n - 1, i));
    const x = padL + (idx / Math.max(n - 1, 1)) * plotW;
    vline?.setAttribute("x1", String(x));
    vline?.setAttribute("x2", String(x));
    const rows = series.map((s, si) => {
      const raw = s.raw || [];
      const pts = s.pts || [];
      const j = Math.min(idx, Math.max(raw.length, pts.length) - 1);
      const px = Number(raw[j]) || 0;
      const pct = Number(pts[j]) || 0;
      const all = series.flatMap((x) => x.pts || []);
      let min = Math.min(...all, -0.5);
      let max = Math.max(...all, 0.5);
      if (Math.abs(max - min) < 0.4) { min -= 0.5; max += 0.5; }
      const span = max - min || 1;
      const padT = 18, padB = 28, hh = 320;
      const pathY = padT + (1 - (pct - min) / span) * (hh - padT - padB);
      const dot = dots[si];
      if (dot && px > 0) {
        dot.setAttribute("cx", String(x));
        dot.setAttribute("cy", String(pathY));
        dot.setAttribute("opacity", "1");
      } else if (dot) {
        dot.setAttribute("opacity", "0");
      }
      if (!(px > 0)) return null;
      return `<div class="live-chart-tip-row" style="--c:${esc(s.color)}">
        <i></i><strong class="mono">${esc(s.t)}</strong>
        <span class="mono">${inr(px, 2)}</span>
        <em class="mono ${pct >= 0 ? "up" : "down"}">${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%</em>
      </div>`;
    }).filter(Boolean);
    if (!rows.length) { hide(); return; }
    hover.setAttribute("opacity", "1");
    tip.innerHTML = `<p class="live-chart-tip-kicker">Point ${idx + 1} / ${n}</p>${rows.join("")}`;
    tip.hidden = false;
    const tipW = tip.offsetWidth || 200;
    const leftPct = ((x / w) * 100);
    tip.style.left = `${Math.max(8, Math.min((leftPct / 100) * rect.width - tipW / 2, rect.width - tipW - 8))}px`;
    tip.style.top = `12px`;
  };

  hit.addEventListener("mousemove", (e) => showAt(e.clientX));
  hit.addEventListener("mouseleave", hide);
  hit.addEventListener("click", (e) => {
    e.preventDefault();
    showAt(e.clientX);
    // Also pin the primary series tip if only one
    if (series.length === 1) showLiveQuoteTip(hit, series[0].t, { pin: true });
  });
}

function liveTapePanel(snap, meta = null) {
  seedLiveSparks(snap);
  const quotes = snap?.quotes || {};
  const rows = Object.entries(quotes)
    .filter(([, q]) => Number(q.price) > 0)
    .sort((a, b) => Math.abs(Number(b[1].chg_pct) || 0) - Math.abs(Number(a[1].chg_pct) || 0));
  if (!window.__chartSeries?.length) {
    window.__chartSeries = (rows.length ? rows.map(([t]) => t) : LIVE_SEED).slice(0, 6);
  }
  const status = String(meta?.market_status || (meta?.market_open === false ? "closed" : "open"));
  const afterHours = status === "closed" || status === "weekend" || status === "preopen" || meta?.market_open === false;
  const hours = meta?.market_hours || {};
  const openLbl = hours.open || "09:15";
  const closeLbl = hours.close || "15:30";
  const statusPill = afterHours
    ? `<span class="pill off" id="liveTapeStatus">${status === "preopen" ? `Pre-open · opens ${openLbl}` : status === "weekend" ? "Weekend · frozen" : `After hours · closed ${closeLbl}`}</span>`
    : `<span class="pill ${snap?.live ? "live" : "off"}" id="liveTapeStatus">${snap?.live ? "Live" : "Connecting…"}</span>`;
  const chips = (rows.length ? rows : LIVE_SEED.map((t) => [t, { chg_pct: 0 }])).slice(0, 12).map(([t, q]) => {
    const on = (window.__chartSeries || []).includes(t);
    const pct = Number(q.chg_pct) || 0;
    const px = Number(q.price) || 0;
    return `<button type="button" class="live-series-chip${on ? " on" : ""}" data-series="${esc(t)}" data-live-ticker="${esc(t)}" title="${esc(t)} · ${px ? inr(px, 2) : "…"} · hover or click for details">
      <span class="mono">${esc(t)}</span>
      <span class="mono ${pct >= 0 ? "up" : "down"}">${px ? chgLabel(pct) : "…"}</span>
    </button>`;
  }).join("");
  return `
    <section class="live-tape live-tape-single${afterHours ? " live-tape-closed" : ""}" id="liveTape" aria-label="Live multi-ticker chart" data-stream="${afterHours ? "off" : "on"}">
      <header class="live-tape-hd">
        <div>
          <p class="live-tape-kicker">${afterHours ? "Session marks" : "Live feed"}</p>
          <h2 class="live-tape-title">Live prices</h2>
          <p class="live-tape-sub">${afterHours
            ? `NSE cash session closed (${openLbl}–${closeLbl} IST). Hover or click a name / tick for details.`
            : "Hover or click chips, chart, or recent ticks for price details. Tap chips to add/remove names on the chart."}</p>
        </div>
        <div class="live-tape-meta">
          ${statusPill}
          <span class="mono live-tape-clock" id="liveTapeClock">—:—:—</span>
          <span class="live-tape-age" id="liveTapeAge">${afterHours ? "not streaming" : "waiting for first tick"}</span>
        </div>
      </header>
      <div class="live-series-chips" id="liveSeriesChips">${chips}</div>
      <div id="liveChartHost" class="live-chart-host">${multiLiveChartSvg(snap, window.__chartSeries)}</div>
      <div class="live-tape-feed-wrap">
        <p class="live-tape-feed-lbl">${afterHours ? "Moves (paused)" : "Recent ticks"}</p>
        <ol class="live-tape-feed" id="liveTapeFeed"><li class="muted">${afterHours ? "Streaming paused until markets open." : "Moves will stream here as prices change…"}</li></ol>
      </div>
    </section>`;
}

function bindLiveChartChips(snap) {
  if (snap) window.__liveSnap = snap;
  document.getElementById("liveSeriesChips")?.querySelectorAll("[data-series]").forEach((btn) => {
    btn.onclick = () => {
      const t = btn.dataset.series;
      let cur = [...(window.__chartSeries || [])];
      if (cur.includes(t)) {
        if (cur.length <= 1) return;
        cur = cur.filter((x) => x !== t);
      } else {
        cur = [...cur, t].slice(0, 8);
      }
      window.__chartSeries = cur;
      document.querySelectorAll("#liveSeriesChips [data-series]").forEach((b) => {
        b.classList.toggle("on", cur.includes(b.dataset.series));
      });
      paintLiveChart(snap || window.__liveSnap || { quotes: {}, sparks: window.__liveSparks });
      showLiveQuoteTip(btn, t, { pin: true });
    };
  });
  bindLiveQuoteDetails(document.getElementById("liveTape") || document);
}

function pushLiveFeed(ticker, price, prev, chgPct, ts) {
  if (!prev || !(Math.abs(price - prev) > 1e-4)) return;
  const up = price > prev;
  const delta = price - prev;
  window.__liveFeed.unshift({
    t: ticker,
    price,
    delta,
    chg: chgPct,
    up,
    at: ts || Date.now() / 1000,
  });
  window.__liveFeed = window.__liveFeed.slice(0, 24);
  const feed = document.getElementById("liveTapeFeed");
  if (!feed) return;
  feed.innerHTML = window.__liveFeed.map((m) => `
    <li class="${m.up ? "up" : "down"}" data-live-ticker="${esc(m.t)}" role="button" tabindex="0" title="Click for details">
      <span class="mono">${esc(m.t)}</span>
      <span class="mono">${m.up ? "▲" : "▼"} ${inr(Math.abs(m.delta), 2)}</span>
      <span class="mono">${inr(m.price, 2)}</span>
      <span class="mono ${m.up ? "up" : "down"}">${chgLabel(m.chg)}</span>
      <time class="mono">${fmtTickTime(m.at)}</time>
    </li>`).join("");
  bindLiveQuoteDetails(feed);
}

function renderLiveTapeRows(snap) {
  seedLiveSparks(snap);
  paintLiveChart(snap);
  const chips = document.getElementById("liveSeriesChips");
  if (chips && snap?.quotes) {
    const rows = Object.entries(snap.quotes)
      .filter(([, q]) => Number(q.price) > 0)
      .sort((a, b) => Math.abs(Number(b[1].chg_pct) || 0) - Math.abs(Number(a[1].chg_pct) || 0))
      .slice(0, 12);
    if (rows.length) {
      chips.innerHTML = rows.map(([t, q]) => {
        const on = (window.__chartSeries || []).includes(t);
        const pct = Number(q.chg_pct) || 0;
        return `<button type="button" class="live-series-chip${on ? " on" : ""}" data-series="${esc(t)}" data-live-ticker="${esc(t)}" title="${esc(t)} · ${inr(Number(q.price) || 0, 2)}">
          <span class="mono">${esc(t)}</span>
          <span class="mono ${pct >= 0 ? "up" : "down"}">${chgLabel(pct)}</span>
        </button>`;
      }).join("");
      bindLiveChartChips(snap);
    }
  }
}

function applyQuotes(snap) {
  if (viewDate || !snap) return;
  window.__liveSnap = snap;
  const afterHours = !!snap.paused
    || deskMeta?.market_open === false
    || ["closed", "weekend", "preopen"].includes(String(deskMeta?.market_status || ""))
    || document.getElementById("liveTape")?.dataset?.stream === "off";
  const hours = deskMeta?.market_hours || {};
  const closeLbl = hours.close || "15:30";
  const openLbl = hours.open || "09:15";
  const freezeTs = Number(snap.freeze_ts) || 0;

  const chip = document.getElementById("liveChip");
  if (chip) {
    if (afterHours) {
      chip.textContent = "Paused · after hours";
      chip.className = "pill off";
    } else {
      chip.textContent = snap.live ? "Live" : (snap.error ? "Offline" : "Connecting");
      chip.className = `pill ${snap.live ? "live" : "off"}`;
    }
  }
  const status = document.getElementById("liveTapeStatus");
  if (status && !afterHours) {
    status.textContent = snap.live ? "Live" : (snap.error ? `Offline · ${snap.error}` : "Connecting…");
    status.className = `pill ${snap.live ? "live" : "off"}`;
  }

  let newest = 0;
  if (snap.sparks) seedLiveSparks(snap);

  Object.entries(snap.quotes || {}).forEach(([t, q]) => {
    const price = Number(q.price) || 0;
    if (price <= 0) return;
    const prevStored = Number(window.__livePrev[t] || 0);
    const prevQuote = Number(q.prev) || prevStored;
    if (!afterHours) pushLiveFeed(t, price, prevStored || prevQuote, q.chg_pct, q.ts);
    const series = window.__liveSparks[t] || [];
    if (!series.length) window.__liveSparks[t] = [price];
    else if (Math.abs(series[series.length - 1] - price) > 1e-6) {
      series.push(price);
      window.__liveSparks[t] = series.slice(-48);
    }
    window.__livePrev[t] = price;
    const tickTs = afterHours && freezeTs ? freezeTs : (q.ts || 0);
    if (tickTs && tickTs > newest) newest = tickTs;

    document.querySelectorAll(`[data-px="${t}"]`).forEach((el) => {
      const prev = Number(el.dataset.last || 0);
      el.textContent = inr(price, 2);
      if (!afterHours && prev && Math.abs(price - prev) > 1e-4) {
        el.classList.remove("flash-up", "flash-down");
        void el.offsetWidth;
        el.classList.add(price > prev ? "flash-up" : "flash-down");
      }
      el.dataset.last = String(price);
      const qty = Number(el.dataset.qty || 0), avg = Number(el.dataset.avg || 0);
      if (qty && avg) {
        const row = el.closest("tr");
        const pnl = (price - avg) * qty;
        row?.querySelector(".live-val") && (row.querySelector(".live-val").textContent = inr(qty * price));
        const pnlEl = row?.querySelector(".live-pnl");
        if (pnlEl) { pnlEl.textContent = signed(pnl); pnlEl.className = `r mono live-pnl ${tone(pnl)}`; }
      }
    });
  });

  if (!window.__tapeBoardTick) window.__tapeBoardTick = 0;
  window.__tapeBoardTick += 1;
  if (window.__tapeBoardTick % 3 === 0 || document.getElementById("liveChartHost")) paintLiveChart(snap);

  const age = document.getElementById("liveTapeAge");
  const clock = document.getElementById("liveTapeClock");
  if (afterHours) {
    if (age) age.textContent = `paused at close ${closeLbl}`;
    if (clock) {
      clock.textContent = freezeTs
        ? new Date(freezeTs * 1000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        : `${closeLbl}:00`;
    }
    if (status) {
      const st = String(deskMeta?.market_status || "closed");
      status.className = "pill off";
      status.textContent = st === "preopen"
        ? `Pre-open · opens ${openLbl}`
        : st === "weekend"
          ? "Weekend · frozen"
          : `Paused · closed ${closeLbl}`;
    }
  } else {
    if (age && newest) age.textContent = `last tick ${fmtAge(newest)}`;
    if (clock) clock.textContent = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
}

function bindLive() {
  if (viewDate) return;
  const fromDom = [...document.querySelectorAll("[data-px]")].map((el) => el.dataset.px).filter(Boolean);
  const tickers = [...new Set([...LIVE_SEED, ...fromDom])];
  if (tickers.length) api("/api/quotes/watch", { method: "POST", body: JSON.stringify({ tickers }) }).catch(() => {});

  if (window.__es) { try { window.__es.close(); } catch { /* */ } window.__es = null; }
  clearInterval(window.__livePoll);

  const tape = document.getElementById("liveTape");
  const streamOff = tape?.dataset?.stream === "off"
    || deskMeta?.market_open === false
    || ["closed", "weekend", "preopen"].includes(String(deskMeta?.market_status || ""));

  // One snapshot for last marks (always). Stream only while NSE session is open.
  api("/api/quotes").then((snap) => {
    applyQuotes(snap);
    if (streamOff) {
      const status = document.getElementById("liveTapeStatus");
      const hours = deskMeta?.market_hours || {};
      const st = String(deskMeta?.market_status || "closed");
      if (status) {
        status.className = "pill off";
        status.textContent = st === "preopen"
          ? `Pre-open · opens ${hours.open || "09:15"}`
          : st === "weekend"
            ? "Weekend · frozen"
            : `After hours · closed ${hours.close || "15:30"}`;
      }
      const age = document.getElementById("liveTapeAge");
      if (age) age.textContent = "not streaming";
    }
  }).catch(() => {});

  if (streamOff) return;

  const token = authToken();
  const url = token ? `/api/quotes/stream?token=${encodeURIComponent(token)}` : "/api/quotes/stream";
  const es = new EventSource(url);
  window.__es = es;
  es.onmessage = (ev) => { try { applyQuotes(JSON.parse(ev.data)); } catch { /* */ } };
  es.onerror = () => {
    // Fallback poll if SSE drops (auth / proxy)
    if (window.__livePoll) return;
    window.__livePoll = setInterval(() => {
      api("/api/quotes").then(applyQuotes).catch(() => {});
    }, 3000);
  };
}

function bindClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    watchMarketHoursTransition();
  };
  tick(); clearInterval(window.__clock); window.__clock = setInterval(tick, 1000);
}

/** Local IST phase from desk market hours — fires open/close toasts when the clock crosses. */
function istMarketPhase(meta) {
  const hours = meta?.market_hours || {};
  const open = String(hours.open || "09:15");
  const close = String(hours.close || "15:30");
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t)?.value || "";
  const wd = get("weekday");
  const hh = get("hour");
  const mm = get("minute");
  const weekend = wd === "Sat" || wd === "Sun";
  const nowMins = Number(hh) * 60 + Number(mm);
  const [oh, om] = open.split(":").map(Number);
  const [ch, cm] = close.split(":").map(Number);
  const openMins = oh * 60 + om;
  const closeMins = ch * 60 + cm;
  if (weekend) return { status: "weekend", open, close };
  if (nowMins < openMins) return { status: "preopen", open, close };
  if (nowMins >= closeMins) return { status: "closed", open, close };
  return { status: "open", open, close };
}

function watchMarketHoursTransition() {
  if (!deskMeta || deskMeta.readonly || viewDate) return;
  const phase = istMarketPhase(deskMeta);
  const prev = window.__marketPhase;
  window.__marketPhase = phase.status;
  if (!prev || prev === phase.status) return;
  const day = deskMeta.calendar_date || new Date().toISOString().slice(0, 10);
  const key = `deskNotify:${day}`;
  const seen = mem.get(key, {}) || {};

  if (phase.status === "open" && (prev === "preopen" || prev === "closed" || prev === "weekend")) {
    deskMeta.market_open = true;
    deskMeta.market_status = "open";
    deskMeta.can_trade = !deskMeta.paused;
    pushNotif({
      id: `market-open:${day}`,
      kind: "info",
      title: "Markets open",
      body: `NSE cash session is live until ${phase.close} IST. Invest is unlocked on Trade.`,
      href: "#/trade",
    });
    if (!seen.marketOpenToast) {
      seen.marketOpenToast = 1;
      mem.set(key, seen);
      toast(`Markets open — session live until ${phase.close} IST.`, true, {
        title: "Markets open",
        href: "#/trade",
        duration: 8000,
      });
    }
    updateNotifBadge();
    // Resume live tape streaming
    const tape = document.getElementById("liveTape");
    if (tape) {
      tape.dataset.stream = "on";
      tape.classList.remove("live-tape-closed");
    }
    bindLive();
  }
  if (phase.status === "closed" && prev === "open") {
    deskMeta.market_open = false;
    deskMeta.market_status = "closed";
    deskMeta.can_trade = false;
    pushNotif({
      id: `market-close:${day}`,
      kind: "info",
      title: "Markets closed",
      body: `Session ended at ${phase.close} IST. Buys lock until ${phase.open} IST next open day.`,
      href: "#/",
    });
    if (!seen.marketCloseToast) {
      seen.marketCloseToast = 1;
      mem.set(key, seen);
      toast(`Markets closed at ${phase.close} IST — investing unlocks at ${phase.open} IST next session.`, "warn", {
        title: "Markets closed",
        href: "#/",
        duration: 8000,
      });
    }
    updateNotifBadge();
    // Freeze tape — stop SSE / poll
    if (window.__es) { try { window.__es.close(); } catch { /* */ } window.__es = null; }
    clearInterval(window.__livePoll);
    const tape = document.getElementById("liveTape");
    if (tape) {
      tape.dataset.stream = "off";
      tape.classList.add("live-tape-closed");
    }
    const status = document.getElementById("liveTapeStatus");
    if (status) {
      status.className = "pill off";
      status.textContent = `After hours · closed ${phase.close}`;
    }
    const age = document.getElementById("liveTapeAge");
    if (age) age.textContent = "not streaming";
  }
}

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(`${iso}T12:00:00`);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return esc(iso); }
}

function syncLiveViewDate(meta) {
  const cal = meta?.calendar_date;
  const session = meta?.session_date || cal;
  // Anything on/after the live session (incl. weekend calendar today) is live
  if (viewDate && (viewDate === cal || viewDate === session || viewDate >= session)) {
    viewDate = null;
    mem.del("viewDate");
  }
  if (dateFocus && dateFocus !== cal && dateFocus !== session) {
    dateFocus = null;
    mem.del("dateFocus");
  }
}

function setViewDate(iso, cal, session) {
  const live = session || cal;
  if (!iso || iso === cal || iso === live || (session && iso >= session)) {
    // Live desk — keep picker on the date the user chose (session vs weekend calendar today)
    viewDate = null;
    mem.del("viewDate");
    dateFocus = iso || live || null;
    if (dateFocus) mem.set("dateFocus", dateFocus);
    else mem.del("dateFocus");
  } else {
    viewDate = iso;
    mem.set("viewDate", iso);
    dateFocus = null;
    mem.del("dateFocus");
  }
  render();
}

function bindIdeasPanel(meta) {
  const wrap = document.querySelector(".ideas-wrap");
  const bell = document.getElementById("ideasBell");
  const panel = document.getElementById("ideasPanel");
  if (!bell || !panel || !wrap) return;

  const close = () => {
    panel.setAttribute("hidden", "");
    panel.classList.remove("is-open");
    wrap.classList.remove("is-open");
    bell.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    // Close notifications if open
    const nPanel = document.getElementById("notifPanel");
    const nWrap = document.querySelector(".notif-wrap:not(.ideas-wrap)");
    nPanel?.setAttribute("hidden", "");
    nPanel?.classList.remove("is-open");
    nWrap?.classList.remove("is-open");
    document.getElementById("notifBell")?.setAttribute("aria-expanded", "false");
    window.__closeHdrSettings?.();
    panel.removeAttribute("hidden");
    panel.classList.add("is-open");
    wrap.classList.add("is-open");
    bell.setAttribute("aria-expanded", "true");
  };
  close();
  window.__openIdeasPanel = open;
  window.__closeIdeasPanel = close;

  bell.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wrap.classList.contains("is-open")) close();
    else open();
  });

  document.getElementById("ideasClose")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    close();
  });

  if (window.__ideasOutside) document.removeEventListener("click", window.__ideasOutside);
  window.__ideasOutside = (e) => {
    if (!wrap.classList.contains("is-open")) return;
    if (wrap.contains(e.target)) return;
    if (e.target.closest?.("[data-open-ideas],[data-open-bell]")) return;
    close();
  };
  document.addEventListener("click", window.__ideasOutside);

  panel.querySelectorAll("a[href]").forEach((a) => a.addEventListener("click", () => close()));
  // Sell / Keep holding buttons inside the suggestions panel
  bindPendingActions();
}

function bindHdrSettings({ onLogout } = {}) {
  const wrap = document.getElementById("hdrSettingsWrap");
  const btn = document.getElementById("hdrSettingsBtn");
  const panel = document.getElementById("hdrSettingsPanel");
  if (!wrap || !btn || !panel) {
    document.getElementById("logoutBtn")?.addEventListener("click", () => onLogout?.());
    return;
  }

  const isOpen = () => wrap.classList.contains("is-open");

  const close = () => {
    panel.setAttribute("hidden", "");
    panel.hidden = true;
    panel.classList.remove("is-open");
    wrap.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    document.getElementById("notifPanel")?.setAttribute("hidden", "");
    document.getElementById("notifPanel")?.classList.remove("is-open");
    document.querySelector(".notif-wrap:not(.ideas-wrap)")?.classList.remove("is-open");
    document.getElementById("notifBell")?.setAttribute("aria-expanded", "false");
    document.getElementById("ideasPanel")?.setAttribute("hidden", "");
    document.getElementById("ideasPanel")?.classList.remove("is-open");
    document.querySelector(".ideas-wrap")?.classList.remove("is-open");
    document.getElementById("ideasBell")?.setAttribute("aria-expanded", "false");
    panel.removeAttribute("hidden");
    panel.hidden = false;
    panel.classList.add("is-open");
    wrap.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  };

  const toggle = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (isOpen()) close();
    else open();
  };

  close();
  window.__closeHdrSettings = close;
  window.__toggleHdrSettings = toggle;

  btn.addEventListener("click", toggle);

  panel.querySelectorAll("a[href]").forEach((a) => {
    a.addEventListener("click", () => close());
  });

  document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    close();
    onLogout?.();
  });

  if (window.__settingsOutside) document.removeEventListener("click", window.__settingsOutside);
  window.__settingsOutside = (e) => {
    if (!isOpen()) return;
    if (wrap.contains(e.target)) return;
    close();
  };
  document.addEventListener("click", window.__settingsOutside);
}

async function pageAccount() {
  let user = authUser() || {};
  try {
    const me = await api("/api/auth/me");
    if (me?.id) {
      user = me;
      setAuth(authToken(), me);
    }
  } catch { /* keep cached user */ }

  const d = await api("/api/today").catch(() => ({}));
  const kycDone = !!(user.pan && user.aadhaar && user.phone);
  return {
    html: `
      <div class="page-shell page-account">
        <section class="panel account-panel">
          <div class="panel-hd account-hd">
            <div>
              <p class="account-kicker">Profile & KYC</p>
              <h2>Account details</h2>
              <p class="muted">Keep login, contact, and identity details organised. Password is optional — leave blank to keep the current one.</p>
            </div>
            <div class="account-hd-side">
              <div class="account-avatar-lg" aria-hidden="true">${esc(userInitial(user))}</div>
              <span class="account-kyc-pill ${kycDone ? "is-ok" : "is-warn"}">${kycDone ? "KYC filled" : "KYC incomplete"}</span>
            </div>
          </div>
          <div class="panel-bd">
            <form class="account-form" id="accountForm" novalidate>
              <div class="account-section">
                <div class="account-section-hd">
                  <h3>Login profile</h3>
                  <p>How you sign in and appear on the desk.</p>
                </div>
                <div class="account-grid">
                  <label>Full name
                    <input class="auth-input" name="name" maxlength="60" value="${esc(user.name || "")}" autocomplete="name" />
                    <span class="auth-hint" data-for="name" hidden></span>
                  </label>
                  <label>Username
                    <input class="auth-input" name="username" maxlength="32" value="${esc(user.username || "")}" autocomplete="username" required />
                    <span class="auth-hint" data-for="username" hidden></span>
                  </label>
                  <label>Email
                    <input class="auth-input" name="email" type="email" maxlength="80" value="${esc(user.email || "")}" autocomplete="email" required />
                    <span class="auth-hint" data-for="email" hidden></span>
                  </label>
                  <label>Mobile number
                    <input class="auth-input" name="phone" inputmode="numeric" maxlength="10" placeholder="10-digit mobile" value="${esc(user.phone || "")}" autocomplete="tel" />
                    <span class="auth-hint" data-for="phone" hidden></span>
                  </label>
                </div>
              </div>

              <div class="account-section">
                <div class="account-section-hd">
                  <h3>Identity (KYC)</h3>
                  <p>PAN and Aadhaar are validated for format. Used for desk records only.</p>
                </div>
                <div class="account-grid">
                  <label>PAN
                    <input class="auth-input" name="pan" maxlength="10" placeholder="ABCDE1234F" value="${esc(user.pan || "")}" style="text-transform:uppercase" />
                    <span class="auth-hint" data-for="pan" hidden></span>
                  </label>
                  <label>Aadhaar
                    <input class="auth-input" name="aadhaar" inputmode="numeric" maxlength="12" placeholder="12-digit Aadhaar" value="${esc(user.aadhaar || "")}" />
                    <span class="auth-hint" data-for="aadhaar" hidden></span>
                  </label>
                  <label>Date of birth
                    <input class="auth-input" name="dob" type="date" value="${esc(user.dob || "")}" />
                    <span class="auth-hint" data-for="dob" hidden></span>
                  </label>
                </div>
              </div>

              <div class="account-section">
                <div class="account-section-hd">
                  <h3>Address</h3>
                  <p>Optional correspondence details.</p>
                </div>
                <div class="account-grid account-grid-wide">
                  <label class="account-span-2">Address line
                    <input class="auth-input" name="address_line" maxlength="120" value="${esc(user.address_line || "")}" autocomplete="street-address" />
                    <span class="auth-hint" data-for="address_line" hidden></span>
                  </label>
                  <label>City
                    <input class="auth-input" name="city" maxlength="60" value="${esc(user.city || "")}" autocomplete="address-level2" />
                    <span class="auth-hint" data-for="city" hidden></span>
                  </label>
                  <label>State
                    <input class="auth-input" name="state" maxlength="60" value="${esc(user.state || "")}" autocomplete="address-level1" />
                    <span class="auth-hint" data-for="state" hidden></span>
                  </label>
                  <label>PIN code
                    <input class="auth-input" name="pincode" inputmode="numeric" maxlength="6" value="${esc(user.pincode || "")}" autocomplete="postal-code" />
                    <span class="auth-hint" data-for="pincode" hidden></span>
                  </label>
                </div>
              </div>

              <div class="account-section">
                <div class="account-section-hd">
                  <h3>Security</h3>
                  <p>Leave blank to keep your current password.</p>
                </div>
                <div class="account-grid">
                  <label>New password <span class="auth-optional">(optional)</span>
                    ${passwordFieldHtml({ name: "password", autocomplete: "new-password", minlength: "6", maxlength: "72", placeholder: "Leave blank to keep current password" })}
                    <span class="auth-hint" data-for="password" hidden></span>
                  </label>
                </div>
              </div>

              <p class="account-banner" id="accountBanner" hidden></p>
              <div class="account-actions">
                <button type="submit" class="btn btn-primary" id="accountSaveBtn">Save changes</button>
                <a class="btn btn-ghost" href="#/">Back to Dashboard</a>
              </div>
            </form>
          </div>
        </section>
      </div>`,
    meta: { ...d, n_holdings: d.n_holdings ?? d.holdings?.length ?? 0 },
    after: () => bindAccountForm(),
  };
}

function validPhone(v) {
  return /^[6-9]\d{9}$/.test(String(v || "").trim());
}

function validPan(v) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(v || "").trim().toUpperCase());
}

function validAadhaar(v) {
  return /^\d{12}$/.test(String(v || "").replace(/\D+/g, ""));
}

function validPincode(v) {
  return /^[1-9]\d{5}$/.test(String(v || "").trim());
}

function bindAccountForm() {
  const form = document.getElementById("accountForm");
  const banner = document.getElementById("accountBanner");
  const saveBtn = document.getElementById("accountSaveBtn");
  if (!form || !saveBtn) return;
  bindPasswordToggles(form);

  const setBanner = (msg, tone = "bad") => {
    if (!banner) return;
    if (!msg) {
      banner.hidden = true;
      banner.textContent = "";
      banner.className = "account-banner";
      return;
    }
    banner.hidden = false;
    banner.className = `account-banner account-banner-${tone}`;
    banner.textContent = msg;
  };

  const setFieldError = (field, msg) => {
    const input = form.querySelector(`[name="${field}"]`);
    const hint = form.querySelector(`.auth-hint[data-for="${field}"]`);
    if (input) input.classList.toggle("is-invalid", !!msg);
    if (hint) {
      hint.textContent = msg || "";
      hint.hidden = !msg;
    }
  };

  const clearErrors = () => {
    form.querySelectorAll(".auth-input").forEach((el) => el.classList.remove("is-invalid"));
    form.querySelectorAll(".auth-hint").forEach((el) => { el.textContent = ""; el.hidden = true; });
    setBanner("");
  };

  form.querySelector('[name="pan"]')?.addEventListener("input", (e) => {
    e.target.value = String(e.target.value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
  });
  form.querySelector('[name="aadhaar"]')?.addEventListener("input", (e) => {
    e.target.value = String(e.target.value || "").replace(/\D+/g, "").slice(0, 12);
  });
  form.querySelector('[name="phone"]')?.addEventListener("input", (e) => {
    e.target.value = String(e.target.value || "").replace(/\D+/g, "").slice(0, 10);
  });
  form.querySelector('[name="pincode"]')?.addEventListener("input", (e) => {
    e.target.value = String(e.target.value || "").replace(/\D+/g, "").slice(0, 6);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const username = String(fd.get("username") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const pan = String(fd.get("pan") || "").trim().toUpperCase();
    const aadhaar = String(fd.get("aadhaar") || "").replace(/\D+/g, "");
    const dob = String(fd.get("dob") || "").trim();
    const address_line = String(fd.get("address_line") || "").trim();
    const city = String(fd.get("city") || "").trim();
    const state = String(fd.get("state") || "").trim();
    const pincode = String(fd.get("pincode") || "").trim();
    const password = String(fd.get("password") || "");
    let ok = true;
    if (!email) {
      setFieldError("email", "Email is required.");
      ok = false;
    } else if (!validEmail(email)) {
      setFieldError("email", "Enter a valid email address.");
      ok = false;
    }
    if (!username) {
      setFieldError("username", "Username is required.");
      ok = false;
    } else if (!validUsername(username)) {
      setFieldError("username", "Use 3–32 characters: letters, numbers, . _ - only.");
      ok = false;
    }
    if (phone && !validPhone(phone)) {
      setFieldError("phone", "Enter a valid 10-digit Indian mobile number.");
      ok = false;
    }
    if (pan && !validPan(pan)) {
      setFieldError("pan", "Enter a valid PAN (e.g. ABCDE1234F).");
      ok = false;
    }
    if (aadhaar && !validAadhaar(aadhaar)) {
      setFieldError("aadhaar", "Enter a valid 12-digit Aadhaar number.");
      ok = false;
    }
    if (pincode && !validPincode(pincode)) {
      setFieldError("pincode", "Enter a valid 6-digit PIN code.");
      ok = false;
    }
    if (password && password.length < 6) {
      setFieldError("password", "Password must be at least 6 characters.");
      ok = false;
    }
    if (!ok) {
      setBanner("Please correct the highlighted fields.", "bad");
      return;
    }
    saveBtn.disabled = true;
    try {
      const body = {
        name, email, username, phone, pan, aadhaar, dob,
        address_line, city, state, pincode,
      };
      if (password.trim()) body.password = password;
      const res = await api("/api/auth/me", { method: "PATCH", body: JSON.stringify(body) });
      const user = res?.user || { ...(authUser() || {}), ...body };
      setAuth(authToken(), user);
      form.querySelector('[name="password"]').value = "";
      setBanner("Account details saved.", "ok");
      toast("Account updated", true);
      await render();
    } catch (err) {
      const msg = err?.message || "Could not save details.";
      setBanner(msg, "bad");
      if (/email/i.test(msg)) setFieldError("email", msg);
      else if (/username/i.test(msg)) setFieldError("username", msg);
      else if (/password/i.test(msg)) setFieldError("password", msg);
      else if (/pan/i.test(msg)) setFieldError("pan", msg);
      else if (/aadhaar/i.test(msg)) setFieldError("aadhaar", msg);
      else if (/mobile|phone/i.test(msg)) setFieldError("phone", msg);
      else if (/pin/i.test(msg)) setFieldError("pincode", msg);
    } finally {
      saveBtn.disabled = false;
    }
  });
}


function bindNotifBell(meta) {
  updateNotifBadge();
  // Must not match .ideas-wrap — that also has class notif-wrap
  const wrap = document.querySelector(".notif-wrap:not(.ideas-wrap)");
  const bell = document.getElementById("notifBell");
  const panel = document.getElementById("notifPanel");
  if (!bell || !panel || !wrap) return;

  const isOpen = () => !panel.hasAttribute("hidden") && wrap.classList.contains("is-open");

  const close = () => {
    panel.setAttribute("hidden", "");
    panel.classList.remove("is-open");
    wrap.classList.remove("is-open");
    bell.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    // Close suggestions if open
    document.getElementById("ideasPanel")?.setAttribute("hidden", "");
    document.getElementById("ideasPanel")?.classList.remove("is-open");
    document.querySelector(".ideas-wrap")?.classList.remove("is-open");
    document.getElementById("ideasBell")?.setAttribute("aria-expanded", "false");
    window.__closeHdrSettings?.();
    panel.removeAttribute("hidden");
    panel.classList.add("is-open");
    wrap.classList.add("is-open");
    bell.setAttribute("aria-expanded", "true");
  };

  const toggle = () => {
    if (isOpen()) close();
    else open();
  };

  // Start closed every render
  close();
  window.__openNotifPanel = open;
  window.__closeNotifPanel = close;

  bell.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  });

  document.getElementById("notifClose")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    close();
  });

  // Outside click closes (bubble phase — after bell toggle)
  if (window.__notifOutside) {
    document.removeEventListener("click", window.__notifOutside);
  }
  window.__notifOutside = (e) => {
    if (!isOpen()) return;
    if (wrap.contains(e.target)) return;
    if (e.target.closest?.("[data-open-bell],[data-open-ideas]")) return;
    close();
  };
  document.addEventListener("click", window.__notifOutside);

  if (window.__notifEsc) {
    document.removeEventListener("keydown", window.__notifEsc);
  }
  window.__notifEsc = (e) => {
    if (e.key === "Escape") close();
  };
  document.addEventListener("keydown", window.__notifEsc);

  panel.querySelectorAll("a[href]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const item = a.closest(".notif-row");
      const id = a.getAttribute("data-notif-view") || item?.getAttribute("data-notif-id");
      const href = a.getAttribute("href") || item?.getAttribute("data-notif-href") || "#/";
      const ticker = item?.getAttribute("data-notif-ticker") || "";
      if (id) markNotifsRead([id]);
      close();
      navigateHash(href, { focusTicker: ticker || null });
    });
  });

  document.getElementById("notifMarkRead")?.addEventListener("click", (e) => {
    e.stopPropagation();
    markNotifsRead();
    panel.querySelectorAll(".notif-row").forEach((el) => {
      el.classList.remove("is-unread");
      el.classList.add("is-read");
    });
    const sub = panel.querySelector(".notif-panel-hd .tiny");
    if (sub) sub.textContent = "No unread";
  });

  document.getElementById("notifClear")?.addEventListener("click", (e) => {
    e.stopPropagation();
    clearNotifs();
    const stack = panel.querySelector(".notif-stack");
    if (stack) {
      stack.innerHTML = `<div class="notif-empty-card"><strong>Inbox cleared</strong><p>New alerts will show up here.</p></div>`;
    }
    const sub = panel.querySelector(".notif-panel-hd .tiny");
    if (sub) sub.textContent = "No unread";
  });

  panel.querySelectorAll("[data-notif-approve]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (busy) return;
      busy = true;
      try {
        const res = await api("/api/rules/pending/approve", { method: "POST", body: JSON.stringify({ id: btn.getAttribute("data-notif-approve") }) });
        close();
        toast(`Sold ${res.ticker} · ${fmtQty(res.qty)} @ ${inr(res.price, 2)}`, true, { href: "#/portfolio" });
        mem.set("focusTicker", String(res.ticker || "").toUpperCase());
        await render();
      } catch (err) { toast(err.message, false); } finally { busy = false; }
    });
  });

  panel.querySelectorAll("[data-notif-reject]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (busy) return;
      busy = true;
      try {
        const res = await api("/api/rules/pending/reject", { method: "POST", body: JSON.stringify({ id: btn.getAttribute("data-notif-reject") }) });
        close();
        toast(`Kept ${res.ticker} — sell dismissed for today`, true, { href: "#/portfolio" });
        await render();
      } catch (err) { toast(err.message, false); } finally { busy = false; }
    });
  });

  panel.querySelectorAll("[data-notif-dismiss]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-notif-dismiss");
      removeNotif(id);
      btn.closest(".notif-row")?.remove();
      const sub = panel.querySelector(".notif-panel-hd .tiny");
      const left = panel.querySelectorAll(".notif-row").length;
      if (sub) sub.textContent = left ? `${unreadNotifCount()} unread` : "Caught up";
      if (!left) {
        const stack = panel.querySelector(".notif-stack");
        if (stack) {
          stack.innerHTML = `<div class="notif-empty-card"><strong>You're all caught up</strong><p>Rule sells, pauses, and session notes appear here.</p></div>`;
        }
      }
    });
  });

  panel.querySelectorAll(".notif-row").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target.closest("button, a")) return;
      const id = el.getAttribute("data-notif-id");
      const href = el.getAttribute("data-notif-href") || "#/";
      const ticker = el.getAttribute("data-notif-ticker") || "";
      if (id) markNotifsRead([id]);
      el.classList.remove("is-unread");
      // Clicking the details body also opens the destination (same as View)
      close();
      navigateHash(href, { focusTicker: ticker || null });
    });
  });
}

function bindNav(meta) {
  document.querySelectorAll("[data-sidebar-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const desk = document.querySelector(".desk-with-sidebar");
      if (!desk) return;
      if (isMobileDesk()) {
        const open = !desk.classList.contains("sidebar-mobile-open");
        desk.classList.toggle("sidebar-mobile-open", open);
        document.getElementById("sidebarBackdrop")?.toggleAttribute("hidden", !open);
        const menuBtn = document.querySelector(".menu-mobile-btn");
        if (menuBtn) {
          menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
          menuBtn.textContent = open ? "Close" : "Menu";
        }
        return;
      }
      const open = !desk.classList.contains("sidebar-open");
      mem.set("sidebarOpen", open);
      applySidebarState(open);
    });
  });
  document.getElementById("sidebarBackdrop")?.addEventListener("click", () => {
    const desk = document.querySelector(".desk-with-sidebar");
    desk?.classList.remove("sidebar-mobile-open");
    document.getElementById("sidebarBackdrop")?.setAttribute("hidden", "");
    const menuBtn = document.querySelector(".menu-mobile-btn");
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "Menu";
    }
  });
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (!isMobileDesk()) return;
      document.querySelector(".desk-with-sidebar")?.classList.remove("sidebar-mobile-open");
      document.getElementById("sidebarBackdrop")?.setAttribute("hidden", "");
      const menuBtn = document.querySelector(".menu-mobile-btn");
      if (menuBtn) menuBtn.textContent = "Menu";
    });
  });
  applySidebarState(sidebarOpenPref());

  const cal = meta?.calendar_date;
  const session = meta?.session_date || cal;
  const dates = [...new Set([...(meta?.session_dates || []), cal, session].filter(Boolean))].sort();
  const cur = viewDate || dateFocus || session;
  document.getElementById("prevDay")?.addEventListener("click", () => {
    const i = dates.indexOf(cur);
    if (i > 0) setViewDate(dates[i - 1], cal, session);
  });
  document.querySelectorAll("#todayBtn, #todayBtn2, #todayBtnTrade").forEach((b) => {
    b.addEventListener("click", () => {
      dateFocus = meta?.market_open === false ? session : null;
      if (dateFocus) mem.set("dateFocus", dateFocus);
      else mem.del("dateFocus");
      setViewDate(null, cal, session);
    });
  });
  document.getElementById("datePick")?.addEventListener("change", (e) => setViewDate(e.target.value, cal, session));
  bindNotifBell(meta);
  bindIdeasPanel(meta);
  const doLogout = async () => {
    const name = authUser()?.name || authUser()?.username || "";
    try {
      await api("/api/auth/logout", { method: "POST" });
      clearAuth();
      queueAuthNotice(
        name ? `${name}, you have been signed out of SNS Capital.` : "You have been signed out of SNS Capital.",
        "ok",
        { title: "Signed out" }
      );
    } catch {
      clearAuth();
      queueAuthNotice("Session ended on this device.", "warn", { title: "Signed out" });
    }
    location.hash = "#/login";
    render();
  };
  bindHdrSettings({ onLogout: doLogout });
  document.getElementById("themeBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme(theme() === "dark" ? "light" : "dark");
    render();
  });
  document.getElementById("reset")?.addEventListener("click", async () => {
    if (busy) return;
    if (viewDate) {
      const day = viewDate;
      if (!confirm(`Clear all activity from ${day} onward?\n\nTrades and session history on/after that day will be removed. The live book will be rebuilt from earlier days.`)) return;
      busy = true;
      try {
        await api("/api/sim/reset-day", { method: "POST", body: JSON.stringify({ date: day }) });
        viewDate = null;
        mem.del("viewDate");
        toast(`Cleared from ${day} onward`);
        await render();
      } catch (err) { toast(err.message, false); }
      finally { busy = false; }
      return;
    }
    if (!confirm("Reset the entire book to a fresh start?")) return;
    busy = true;
    try {
      await api("/api/sim/reset", { method: "POST" });
      toast("Book reset");
      await render();
    } catch (err) { toast(err.message, false); }
    finally { busy = false; }
  });
  document.querySelectorAll("[data-reset-day]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (busy) return;
      const day = btn.getAttribute("data-reset-day");
      if (!day) return;
      if (!confirm(`Clear all activity from ${day} onward?\n\nEarlier days stay. Live book is rebuilt from what remains.`)) return;
      busy = true;
      try {
        await api("/api/sim/reset-day", { method: "POST", body: JSON.stringify({ date: day }) });
        if (viewDate && viewDate >= day) { viewDate = null; mem.del("viewDate"); }
        toast(`Cleared from ${day} onward`);
        await render();
      } catch (err) { toast(err.message, false); }
      finally { busy = false; }
    });
  });
  bindClock();
  bindStickyScroll();
}

function passwordFieldHtml({
  id = "",
  name = "password",
  autocomplete = "current-password",
  required = false,
  minlength = "",
  maxlength = "72",
  placeholder = "",
  value = "",
  extraClass = "auth-input",
} = {}) {
  const idAttr = id ? ` id="${esc(id)}"` : "";
  const req = required ? " required" : "";
  const minL = minlength ? ` minlength="${esc(String(minlength))}"` : "";
  const maxL = maxlength ? ` maxlength="${esc(String(maxlength))}"` : "";
  const ph = placeholder ? ` placeholder="${esc(placeholder)}"` : "";
  const val = value ? ` value="${esc(value)}"` : "";
  return `
    <div class="pw-field">
      <input class="${esc(extraClass)}"${idAttr} name="${esc(name)}" type="password" autocomplete="${esc(autocomplete)}"${req}${minL}${maxL}${ph}${val} />
      <button type="button" class="pw-toggle" aria-label="Show password" title="Show password" aria-pressed="false">
        <span class="pw-toggle-ico pw-ico-show" aria-hidden="true">${UI_ICO.eye}</span>
        <span class="pw-toggle-ico pw-ico-hide" aria-hidden="true" hidden>${UI_ICO.eyeOff}</span>
      </button>
    </div>`;
}

function bindPasswordToggles(root = document) {
  root.querySelectorAll(".pw-field").forEach((wrap) => {
    const input = wrap.querySelector("input");
    const btn = wrap.querySelector(".pw-toggle");
    if (!input || !btn || btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";
    const showIco = btn.querySelector(".pw-ico-show");
    const hideIco = btn.querySelector(".pw-ico-hide");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.setAttribute("aria-pressed", show ? "true" : "false");
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
      btn.title = show ? "Hide password" : "Show password";
      if (showIco) showIco.hidden = show;
      if (hideIco) hideIco.hidden = !show;
      input.focus();
    });
  });
}

function authShell(title, body, foot = "", { mode = "login" } = {}) {
  const altLink = mode === "login"
    ? `<a class="auth-hdr-link" href="#/signup"><span>Create account</span></a>`
    : `<a class="auth-hdr-link" href="#/login"><span>Sign in</span></a>`;
  return `
  <div class="auth-desk">
    <header class="auth-hdr">
      <a class="auth-hdr-brand" href="#/login">
        <div class="mark">SNS</div>
        <div><strong>SNS Capital</strong><span>Investment Desk</span></div>
      </a>
      <div class="auth-hdr-actions">
        <button class="btn btn-icon hdr-tool-btn" id="authThemeBtn" type="button" aria-label="Toggle theme">${theme() === "dark" ? "☀️" : "🌙"}</button>
        ${altLink}
      </div>
    </header>
    <div class="auth-card">
      <h1 class="auth-title">${esc(title)}</h1>
      <div class="auth-banner" id="authBanner" hidden role="alert"></div>
      ${body}
      ${foot}
    </div>
  </div>`;
}

function pageLogin() {
  return authShell("Sign in", `
    <form class="auth-form" id="loginForm" novalidate>
      <label>
        Email or username
        <input class="auth-input" id="loginId" name="login" autocomplete="username" required maxlength="80" />
        <span class="auth-hint" data-for="login" hidden></span>
      </label>
      <label>
        Password
        ${passwordFieldHtml({ id: "loginPassword", name: "password", autocomplete: "current-password", required: true, minlength: "6" })}
        <span class="auth-hint" data-for="password" hidden></span>
      </label>
      <button class="btn btn-primary auth-submit" type="submit">Sign in</button>
      <p class="auth-alt">No account? <a href="#/signup">Create an account</a></p>
    </form>`);
}

function pageSignup() {
  return authShell("Create account", `
    <form class="auth-form" id="signupForm" novalidate>
      <label>
        Full name <span class="auth-optional">(optional)</span>
        <input class="auth-input" name="name" autocomplete="name" maxlength="60" />
      </label>
      <label>
        Work email
        <input class="auth-input" id="signupEmail" name="email" type="email" autocomplete="email" required maxlength="80" />
        <span class="auth-hint" data-for="email" hidden></span>
      </label>
      <label>
        Username
        <input class="auth-input" id="signupUsername" name="username" autocomplete="username" required minlength="3" maxlength="32" pattern="[A-Za-z0-9._\\-]{3,32}" />
        <span class="auth-hint" data-for="username" hidden></span>
      </label>
      <label>
        Password
        ${passwordFieldHtml({ id: "signupPassword", name: "password", autocomplete: "new-password", required: true, minlength: "6", maxlength: "72" })}
        <span class="auth-hint" data-for="password" hidden></span>
      </label>
      <label>
        Confirm password
        ${passwordFieldHtml({ id: "signupPassword2", name: "password2", autocomplete: "new-password", required: true, minlength: "6", maxlength: "72" })}
        <span class="auth-hint" data-for="password2" hidden></span>
      </label>
      <button class="btn btn-primary auth-submit" type="submit">Create account</button>
      <p class="auth-alt">Already registered? <a href="#/login">Sign in</a></p>
    </form>`, "", { mode: "signup" });
}

function setAuthFieldError(form, field, msg) {
  const input = form.querySelector(`[name="${field}"]`);
  const hint = form.querySelector(`.auth-hint[data-for="${field}"]`);
  if (input) input.classList.toggle("is-invalid", !!msg);
  if (hint) {
    hint.textContent = msg || "";
    hint.hidden = !msg;
  }
}

function clearAuthFieldErrors(form) {
  form.querySelectorAll(".auth-input").forEach((el) => el.classList.remove("is-invalid"));
  form.querySelectorAll(".auth-hint").forEach((el) => { el.textContent = ""; el.hidden = true; });
}

function setAuthBanner(msg, tone = "bad") {
  const el = document.getElementById("authBanner");
  if (!el) return;
  if (!msg) { el.hidden = true; el.textContent = ""; el.className = "auth-banner"; return; }
  el.hidden = false;
  el.className = `auth-banner auth-banner-${tone}`;
  el.textContent = msg;
}

function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

function validUsername(v) {
  return /^[A-Za-z0-9._-]{3,32}$/.test(String(v || "").trim());
}

function validateLoginForm(form) {
  clearAuthFieldErrors(form);
  setAuthBanner("");
  const login = String(form.login?.value || "").trim();
  const password = String(form.password?.value || "");
  let ok = true;
  if (!login) {
    setAuthFieldError(form, "login", "Enter your email or username.");
    ok = false;
  }
  if (!password) {
    setAuthFieldError(form, "password", "Enter your password.");
    ok = false;
  } else if (password.length < 6) {
    setAuthFieldError(form, "password", "Password must be at least 6 characters.");
    ok = false;
  }
  if (!ok) setAuthBanner("Please correct the highlighted fields.", "bad");
  return ok ? { login, password } : null;
}

function validateSignupForm(form) {
  clearAuthFieldErrors(form);
  setAuthBanner("");
  const name = String(form.name?.value || "").trim();
  const email = String(form.email?.value || "").trim().toLowerCase();
  const username = String(form.username?.value || "").trim();
  const password = String(form.password?.value || "");
  const password2 = String(form.password2?.value || "");
  let ok = true;
  if (!email) {
    setAuthFieldError(form, "email", "Email is required.");
    ok = false;
  } else if (!validEmail(email)) {
    setAuthFieldError(form, "email", "Enter a valid email address (e.g. name@company.com).");
    ok = false;
  }
  if (!username) {
    setAuthFieldError(form, "username", "Username is required.");
    ok = false;
  } else if (!validUsername(username)) {
    setAuthFieldError(form, "username", "Use 3–32 characters: letters, numbers, . _ - only.");
    ok = false;
  }
  if (!password) {
    setAuthFieldError(form, "password", "Password is required.");
    ok = false;
  } else if (password.length < 6) {
    setAuthFieldError(form, "password", "Use at least 6 characters.");
    ok = false;
  }
  if (!password2) {
    setAuthFieldError(form, "password2", "Confirm your password.");
    ok = false;
  } else if (password && password2 !== password) {
    setAuthFieldError(form, "password2", "Passwords do not match.");
    ok = false;
  }
  if (!ok) setAuthBanner("Please correct the highlighted fields before continuing.", "bad");
  return ok ? { name, email, username, password } : null;
}

function bindAuthForms() {
  flushAuthNotice();
  bindPasswordToggles(document);
  document.getElementById("authThemeBtn")?.addEventListener("click", () => {
    setTheme(theme() === "dark" ? "light" : "dark");
    render();
  });

  document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = validateLoginForm(form);
    if (!payload) {
      topNotice("Sign-in details need attention.", "bad", { title: "Validation" });
      return;
    }
    const btn = form.querySelector("button[type=submit]");
    if (btn) { btn.disabled = true; btn.textContent = "Signing in…"; }
    try {
      const res = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ login: payload.login, password: payload.password }),
      }, { auth: false });
      setAuth(res.token, res.user);
      const who = res.user?.name || res.user?.username || "colleague";
      queueAuthNotice(`Welcome back, ${who}. Your desk session is active.`, "ok", { title: "Signed in" });
      location.hash = "#/";
      await render();
    } catch (ex) {
      const msg = ex.message || "Sign-in failed. Check your credentials and try again.";
      setAuthBanner(msg, "bad");
      topNotice(msg, "bad", { title: "Sign-in failed" });
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = "Sign in"; }
    }
  });

  document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = validateSignupForm(form);
    if (!payload) {
      topNotice("Please fix the form errors to create your account.", "bad", { title: "Validation" });
      return;
    }
    const btn = form.querySelector("button[type=submit]");
    if (btn) { btn.disabled = true; btn.textContent = "Creating account…"; }
    try {
      const res = await api("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      }, { auth: false });
      setAuth(res.token, res.user);
      const who = res.user?.name || res.user?.username || "colleague";
      queueAuthNotice(`Account created for ${who}. You are signed in to SNS Capital.`, "ok", { title: "Account ready" });
      location.hash = "#/";
      await render();
    } catch (ex) {
      const msg = ex.message || "Could not create the account. Please try again.";
      setAuthBanner(msg, "bad");
      if (/email/i.test(msg)) setAuthFieldError(form, "email", msg);
      else if (/username/i.test(msg)) setAuthFieldError(form, "username", msg);
      else if (/password/i.test(msg)) setAuthFieldError(form, "password", msg);
      topNotice(msg, "bad", { title: "Registration failed" });
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = "Create account"; }
    }
  });

  // Live clear field errors as user types
  document.querySelectorAll(".auth-form .auth-input").forEach((input) => {
    input.addEventListener("input", () => {
      const form = input.closest("form");
      if (!form) return;
      setAuthFieldError(form, input.name, "");
      if (![...form.querySelectorAll(".auth-input.is-invalid")].length) setAuthBanner("");
    });
  });
}

function bindStickyScroll() {
  const el = document.querySelector(".desk-sticky");
  if (!el) return;
  const onScroll = () => el.classList.toggle("is-scrolled", window.scrollY > 6);
  if (window.__stickyScroll) window.removeEventListener("scroll", window.__stickyScroll);
  window.__stickyScroll = onScroll;
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function livePx(ticker, fb) { const el = document.querySelector(`[data-px="${ticker}"]`); return Number(el?.dataset.last || 0) || Number(fb || 0); }

function askInvest({ ticker, name, sleeve, price, cash }) {
  return new Promise((resolve) => {
    const book = Math.max(
      Number(deskMeta?.portfolio) || 0,
      Number(deskMeta?.book) || 0,
      Number(deskMeta?.pnl?.book) || 0,
      Number(deskMeta?.mtm) || 0,
      1
    );
    const held = (deskMeta?.holdings || []).find(
      (h) => String(h.ticker || "").toUpperCase() === String(ticker || "").toUpperCase()
    );
    const heldVal = Number(held?.market_value) || 0;
    const room = Math.max(0, Math.floor(0.10 * book - heldVal));
    const cashAvail = Math.max(0, Math.floor(Number(cash) || 0));
    const suggested = Math.max(
      100,
      Math.min(room || 1000, 1000, cashAvail || 1000, Math.round(Number(deskMeta?.max_deployable) || 10000))
    );
    const hint = String(suggested);
    const px = livePx(ticker, price);
    const ov = document.createElement("div"); ov.className = "modal-back";
    ov.innerHTML = `<div class="modal"><h2>Invest in ${esc(name || ticker)}</h2>
      <p class="tiny">Live ${inr(px, 2)} · Cash ${inr(cash)} · <strong>Max add ≈ ${inr(room)}</strong> (10% of book rule)</p>
      <p class="tiny muted">Single-name Add cannot take your full ₹10K daily target — use <strong>Trade → Invest now</strong> to split across many names.</p>
      <input class="amt-input" id="modalAmt" type="number" min="1" step="100" value="${esc(hint)}" />
      <div class="chip-row">${[250, 500, 1000, Math.min(room || 2500, 2500)].filter((n, i, a) => n > 0 && a.indexOf(n) === i).map((n) => `<button type="button" class="qty-chip" data-n="${n}">${inr(n)}</button>`).join("")}</div>
      <div class="actions" style="justify-content:flex-end;margin-top:12px">
        <button class="btn btn-skip" id="modalCancel">Cancel</button>
        <button class="btn btn-buy" id="modalOk">Confirm</button>
      </div></div>`;
    document.body.appendChild(ov);
    const input = ov.querySelector("#modalAmt"); input.focus();
    const close = (v) => { ov.remove(); resolve(v); };
    ov.querySelectorAll(".qty-chip").forEach((b) => b.addEventListener("click", () => { input.value = b.dataset.n; }));
    ov.querySelector("#modalCancel").addEventListener("click", () => close(null));
    ov.querySelector("#modalOk").addEventListener("click", () => {
      const a = Number(input.value);
      if (!(a > 0)) { toast("Enter amount", false); return; }
      if (room > 0 && a > room + 1) {
        toast(`Max for ${ticker} is ≈ ${inr(room)} (10% of book). For ₹10K use Trade → Invest now.`, false, {
          title: "Position cap",
          href: "#/trade",
        });
        return;
      }
      close(a);
    });
    ov.addEventListener("click", (e) => { if (e.target === ov) close(null); });
  });
}

function askSell({ ticker, name, qty, price, avg }) {
  return new Promise((resolve) => {
    const px = livePx(ticker, price);
    const q = Number(qty) || 0;
    const est = q * px;
    const pnlEst = (px - (Number(avg) || 0)) * q;
    const ov = document.createElement("div"); ov.className = "modal-back";
    ov.innerHTML = `<div class="modal">
      <h2>Sell ${esc(name || ticker)}</h2>
      <p class="tiny">You hold <strong class="mono">${fmtQty(q)}</strong> · Live ${inr(px, 2)} · Est. value ${inr(est)} · Open P/L <span class="${tone(pnlEst)}">${signed(pnlEst)}</span></p>
      <label class="trade-invest-label" for="sellQty">Quantity to sell</label>
      <input class="amt-input" id="sellQty" type="number" min="0" step="any" value="${esc(String(q))}" />
      <div class="chip-row sell-presets">
        <button type="button" class="qty-chip" data-frac="0.25">25%</button>
        <button type="button" class="qty-chip" data-frac="0.5">50%</button>
        <button type="button" class="qty-chip" data-frac="1">Sell all</button>
      </div>
      <p class="tiny mt" id="sellHint">Proceeds: cash gets cost back; profit (if any) goes to savings.</p>
      <div class="actions" style="justify-content:flex-end;margin-top:12px">
        <button class="btn btn-skip" id="modalCancel">Cancel</button>
        <button class="btn btn-sell" id="modalOk">Confirm sell</button>
      </div>
    </div>`;
    document.body.appendChild(ov);
    const input = ov.querySelector("#sellQty");
    input.focus();
    const close = (v) => { ov.remove(); resolve(v); };
    ov.querySelectorAll(".qty-chip").forEach((b) => b.addEventListener("click", () => {
      const frac = Number(b.dataset.frac);
      input.value = String(+(q * frac).toFixed(6));
    }));
    ov.querySelector("#modalCancel").addEventListener("click", () => close(null));
    ov.querySelector("#modalOk").addEventListener("click", () => {
      const sellQty = Number(input.value);
      if (!(sellQty > 0)) { toast("Enter quantity", false); return; }
      if (sellQty > q + 1e-8) { toast("Cannot sell more than you hold", false); return; }
      const sellAll = sellQty >= q - 1e-8;
      close({ qty: sellQty, sell_all: sellAll });
    });
    ov.addEventListener("click", (e) => { if (e.target === ov) close(null); });
  });
}

function bindBuys() {
  document.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault(); if (busy || viewDate) return;
      const ticker = btn.getAttribute("data-buy");
      const amount = await askInvest({ ticker, name: btn.getAttribute("data-name"), sleeve: btn.getAttribute("data-sleeve"), price: Number(btn.getAttribute("data-price")), cash: deskMeta.cash || 0 });
      if (!amount) return;
      mem.set("investAmt", String(amount)); busy = true;
      try { const res = await api("/api/buy", { method: "POST", body: JSON.stringify({ ticker, amount }) }); toast(`Bought ${ticker} · ${fmtQty(res.qty)} @ ${inr(res.price, 2)}`); await render(); }
      catch (err) { toast(err.message, false); } finally { busy = false; }
    });
  });
  document.querySelectorAll("[data-add-split]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (viewDate) return;
      addTickerToPlan({
        ticker: btn.getAttribute("data-add-split"),
        name: btn.getAttribute("data-name"),
        sleeve: btn.getAttribute("data-sleeve"),
        price: Number(btn.getAttribute("data-price")) || 0,
      });
    });
  });
}

function bindBookEdit() {
  const putSave = document.getElementById("contributedSaveBtn");
  const putInput = document.getElementById("contributedInput");
  putSave?.addEventListener("click", async () => {
    if (busy || viewDate) return;
    const value = Number(putInput?.value);
    if (!Number.isFinite(value) || value < 0) { toast("Enter a valid amount", false); return; }
    busy = true;
    try {
      await api("/api/contributed", { method: "POST", body: JSON.stringify({ value }) });
      toast(`Money put in set to ${inr(value)}`);
      await render();
    } catch (err) { toast(err.message, false); }
    finally { busy = false; }
  });
}

function bindSells() {
  document.querySelectorAll("[data-sell]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault(); if (busy || viewDate) return;
      const ticker = btn.getAttribute("data-sell");
      const choice = await askSell({
        ticker,
        name: btn.getAttribute("data-name"),
        qty: Number(btn.getAttribute("data-qty")),
        price: Number(btn.getAttribute("data-price")),
        avg: Number(btn.getAttribute("data-avg")),
      });
      if (!choice) return;
      busy = true;
      try {
        const body = choice.sell_all
          ? { ticker, sell_all: true }
          : { ticker, qty: choice.qty };
        const res = await api("/api/sell", { method: "POST", body: JSON.stringify(body) });
        toast(`Sold ${ticker} · ${fmtQty(res.qty)} @ ${inr(res.price, 2)} · P/L ${signed(res.pnl)}`);
        await render();
      } catch (err) { toast(err.message, false); }
      finally { busy = false; }
    });
  });
}

function bindSkips() {
  document.querySelectorAll(".skip-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (busy) return; busy = true;
      try { await api("/api/skip", { method: "POST", body: JSON.stringify({ ticker: btn.dataset.skip }) }); await render(); }
      finally { busy = false; }
    });
  });
}

function bindClearSkip() {
  document.getElementById("clearSkip")?.addEventListener("click", async () => {
    const d = await api("/api/today");
    for (const t of d.skipped || []) await api("/api/unskip", { method: "POST", body: JSON.stringify({ ticker: t }) });
    await render();
  });
}

function bossMandateHtml(cfg) {
  if (!cfg) return "";
  const labels = cfg.allocation_labels || {
    india: "India", us: "US Market", commodities: "Commodities", bonds: "Bonds", crypto: "Crypto",
  };
  const alloc = cfg.allocation || cfg.rule_controls?.allocation || {};
  const sleeveOrder = ["india", "us", "commodities", "bonds", "crypto"];
  const pct = (v) => Math.round((Number(v) || 0) * 1000) / 10;
  const sleeveRows = sleeveOrder.map((k) => {
    const a = alloc[k] || { min: 0, max: 0, default: 0 };
    return `<tr>
      <td>${esc(labels[k] || k)}</td>
      <td class="r">
        <span class="rules-review-only mono">${pct(a.min)}%</span>
        <input class="mono boss-num rules-edit-only" type="number" min="0" max="100" step="0.5" data-alloc-sleeve="${esc(k)}" data-alloc-field="min" value="${pct(a.min)}" aria-label="${esc(labels[k] || k)} min %" />
      </td>
      <td class="r">
        <span class="rules-review-only mono">${pct(a.max)}%</span>
        <input class="mono boss-num rules-edit-only" type="number" min="0" max="100" step="0.5" data-alloc-sleeve="${esc(k)}" data-alloc-field="max" value="${pct(a.max)}" aria-label="${esc(labels[k] || k)} max %" />
      </td>
      <td class="r">
        <span class="rules-review-only mono">${pct(a.default)}%</span>
        <input class="mono boss-num rules-edit-only" type="number" min="0" max="100" step="0.5" data-alloc-sleeve="${esc(k)}" data-alloc-field="default" value="${pct(a.default)}" aria-label="${esc(labels[k] || k)} default %" />
      </td>
    </tr>`;
  }).join("");
  const qc = cfg.quality_checklist || cfg.rule_controls?.quality_checklist || [];
  const qualityFallback = [
    { key: "earnings_trend", label: "Earnings trend", pass: "QoQ or YoY > 0", note: "Auto-pass for bonds/commodities/crypto" },
    { key: "news_positive", label: "News positive", pass: "Sentiment > 0", note: "" },
    { key: "above_200dma", label: "Above trend", pass: "Price > 200-DMA", note: "" },
    { key: "rs_positive", label: "RS > market", pass: "Relative strength > 0", note: "" },
    { key: "volume_above_avg", label: "Volume > avg", pass: "Volume > 20-day average", note: "" },
  ];
  const qualityRows = (qc.length ? qc : qualityFallback).map((c, i) => `
    <li class="boss-q-item" data-qc-key="${esc(c.key || "")}">
      <span class="boss-q-num mono">${i + 1}</span>
      <div class="boss-q-body">
        <div class="boss-q-review rules-review-only">
          <strong>${esc(c.label || "")}</strong>
          <span>${esc(c.pass || "")}</span>
          ${c.note ? `<em>${esc(c.note)}</em>` : ""}
        </div>
        <div class="boss-q-fields rules-edit-only">
          <label class="boss-q-f-title">Title<input type="text" class="boss-text" data-qc-field="label" maxlength="80" value="${esc(c.label || "")}" /></label>
          <label class="boss-q-f-pass">Pass when<input type="text" class="boss-text" data-qc-field="pass" maxlength="160" value="${esc(c.pass || "")}" /></label>
          <label class="boss-q-f-note">Note<input type="text" class="boss-text" data-qc-field="note" maxlength="220" value="${esc(c.note || "")}" placeholder="Optional" /></label>
        </div>
      </div>
    </li>`).join("");
  const p = (cfg.rule_controls?.params) || {};
  const num = (key, fallback) => {
    const v = Number(p[key] ?? fallback);
    return Number.isFinite(v) ? v : fallback;
  };
  const money = (key, fallback) => Math.round(num(key, fallback));
  const pctVal = (key, fallback) => Math.round(num(key, fallback) * 1000) / 10;
  const field = (label, key, kind, fallback, cfgFallback) => {
    const raw = kind === "money" ? money(key, cfgFallback ?? fallback)
      : kind === "pct" ? pctVal(key, cfgFallback ?? fallback)
      : kind === "int" ? Math.round(num(key, cfgFallback ?? fallback))
      : num(key, cfgFallback ?? fallback);
    const shown = kind === "pct" ? `${raw}%` : kind === "money" ? inr(raw) : String(raw);
    const step = kind === "money" ? "500" : kind === "pct" ? "0.5" : kind === "int" ? "1" : "0.1";
    const min = kind === "money" ? "500" : kind === "pct" ? "0" : kind === "int" ? "1" : "0.5";
    const max = kind === "pct" ? "100" : kind === "int" && key === "hold_days" ? "120" : "";
    return `<div class="rules-metric">
      <span class="rules-metric-lbl">${esc(label)}</span>
      <span class="rules-review-only mono rules-metric-val">${esc(shown)}</span>
      <input class="mono boss-num rules-edit-only" type="number" min="${min}"${max ? ` max="${max}"` : ""} step="${step}" data-rule-param="${esc(key)}" data-kind="${esc(kind)}" value="${raw}" aria-label="${esc(label)}" />
    </div>`;
  };
  return `
    <div id="bossEditor" class="rules-sections">
      <section class="rules-block" aria-labelledby="rulesNumsHd">
        <header class="rules-block-hd">
          <div>
            <h2 id="rulesNumsHd">1 · Numbers</h2>
            <p>Sleeves, daily budget, and risk thresholds.</p>
          </div>
        </header>
        <div class="rules-block-bd rules-nums-grid">
          <div class="rules-panel">
            <h3>Sleeve allocation</h3>
            <div class="table-wrap">
              <table class="tbl tbl-compact boss-alloc-tbl">
                <thead><tr><th>Sleeve</th><th class="r">Min</th><th class="r">Max</th><th class="r">Default</th></tr></thead>
                <tbody>${sleeveRows}</tbody>
              </table>
            </div>
          </div>
          <div class="rules-panel">
            <h3>Daily budget &amp; cash</h3>
            <div class="rules-metrics">
              ${field("Bull", "contribution_bull", "money", 10000, cfg.contribution?.bull)}
              ${field("Sideways", "contribution_sideways", "money", 7000, cfg.contribution?.sideways)}
              ${field("Bear", "contribution_bear", "money", 3000, cfg.contribution?.bear)}
              ${field("Friday cap", "friday_contribution_cap", "money", 5000, cfg.friday_cap)}
              ${field("Cash reserve", "cash_reserve_pct", "pct", 0.05, cfg.reserve_pct)}
            </div>
          </div>
          <div class="rules-panel rules-panel-wide">
            <h3>Hold, sell &amp; risk</h3>
            <div class="rules-metrics">
              ${field("Hold days", "hold_days", "int", 30, cfg.hold_days)}
              ${field("Equity ATR ×", "equity_atr_mult", "float", 2, cfg.stops?.equity_atr)}
              ${field("Crypto ATR ×", "crypto_atr_mult", "float", 1.5, cfg.stops?.crypto_atr)}
              ${field("Max position", "max_position_pct", "pct", 0.1, cfg.max_position_pct)}
              ${field("Trim to", "trim_to_pct", "pct", 0.08, cfg.trim_to_pct)}
              ${field("Sub-sector names", "max_subsector_names", "int", 3, cfg.max_subsector_names)}
              ${field("Sector cap", "max_sector_pct", "pct", 0.4, cfg.max_sector_pct)}
              ${field("DD tier 1", "drawdown_t1", "pct", 0.1, cfg.drawdown?.t1)}
              ${field("DD tier 2", "drawdown_t2", "pct", 0.15, cfg.drawdown?.t2)}
              ${field("DD tier 3", "drawdown_t3", "pct", 0.2, cfg.drawdown?.t3)}
              ${field("Resume below", "drawdown_resume", "pct", 0.07, cfg.drawdown?.resume)}
            </div>
          </div>
        </div>
      </section>

      <section class="rules-block" aria-labelledby="rulesQualityHd">
        <header class="rules-block-hd">
          <div>
            <h2 id="rulesQualityHd">2 · Quality filter</h2>
            <p>Need <strong>≥3 of 5</strong> checks to buy.</p>
          </div>
        </header>
        <div class="rules-block-bd">
          <ol class="boss-q-list">${qualityRows}</ol>
        </div>
      </section>
    </div>`;
}

function rulesPanel(cfg) {
  if (!cfg) return "";
  const controls = cfg.rule_controls || {};
  const rules = controls.rules || [];
  const onN = rules.filter((r) => r.enabled).length;
  const offN = rules.length - onN;
  const groups = [...new Set(rules.map((r) => r.group || "Rules"))];
  // Params edited in boss cards — avoid duplicate inputs in rows
  const bossParamKeys = new Set([
    "contribution_bull", "contribution_sideways", "contribution_bear", "friday_contribution_cap",
    "cash_reserve_pct", "hold_days", "equity_atr_mult", "crypto_atr_mult",
    "max_position_pct", "trim_to_pct", "max_subsector_names", "max_sector_pct",
    "drawdown_t1", "drawdown_t2", "drawdown_t3", "drawdown_resume",
    "pause_t1_days", "pause_t2_days",
  ]);
  const fmtVal = (p, v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return "";
    if (p.kind === "pct") return String(Math.round(n * 1000) / 10);
    if (p.kind === "money") return String(Math.round(n));
    if (p.kind === "int") return String(Math.round(n));
    return String(Math.round(n * 100) / 100);
  };
  const inputAttrs = (p, v) => {
    if (p.kind === "pct") {
      return `type="number" min="${(p.min || 0) * 100}" max="${(p.max || 1) * 100}" step="0.1" value="${esc(fmtVal(p, v))}" data-kind="pct"`;
    }
    const step = p.kind === "money" ? "100" : p.kind === "int" ? "1" : String(p.step || 0.1);
    return `type="number" min="${p.min ?? 0}" max="${p.max ?? 1e9}" step="${step}" value="${esc(fmtVal(p, v))}" data-kind="${esc(p.kind || "float")}"`;
  };
  const qc = cfg.quality_checklist || controls.quality_checklist || [];
  const rowHtml = (r) => {
    const details = (Array.isArray(r.details) ? r.details : []).filter(Boolean);
    const detailEditors = (() => {
      const lines = [...details];
      while (lines.length < 2) lines.push("");
      return lines.slice(0, 6).map((d, i) => `
      <label class="rule-copy-field rule-detail-field">
        <span>Detail ${i + 1}</span>
        <input type="text" class="boss-text rule-detail-input" data-rule-detail="${i}" maxlength="280" value="${esc(d || "")}" placeholder="Optional line" />
      </label>`).join("");
    })();
    const qualityExtra = r.id === "quality_filter" && qc.length
      ? `<p class="tiny muted rule-qc-hint">Checklist wording is in section 2. This switch only turns the filter on/off.</p>`
      : "";
    const extraParams = (r.params || []).filter((p) => !bossParamKeys.has(p.key));
    const searchBlob = `${r.label} ${r.blurb || ""} ${r.group || ""} ${(r.details || []).join(" ")}`.toLowerCase();
    return `
    <article class="rule-row${r.enabled ? " is-on" : " is-off"}" data-rule="${esc(r.id)}" data-group="${esc(r.group || "")}" data-enabled="${r.enabled ? "1" : "0"}" data-search="${esc(searchBlob)}">
      <div class="rule-row-main">
        <div class="rule-row-text">
          <div class="rule-row-title">
            <strong class="rules-review-only rule-label-view">${esc(r.label || "")}</strong>
            <input type="text" class="boss-text rule-label-input rules-edit-only" data-rule-label maxlength="120" value="${esc(r.label || "")}" aria-label="Rule title" />
          </div>
          <p class="rule-row-blurb rules-review-only">${esc(r.blurb || "")}</p>
        </div>
        <div class="rule-state-view rules-review-only">
          <span class="rule-state-pill ${r.enabled ? "is-on" : "is-off"}">${r.enabled ? "ON" : "OFF"}</span>
        </div>
        <label class="rule-toggle rules-edit-only" title="Toggle rule">
          <input type="checkbox" data-rule-toggle="${esc(r.id)}" ${r.enabled ? "checked" : ""} />
          <span class="rule-toggle-ui" aria-hidden="true"><i></i></span>
          <span class="rule-toggle-lbl">${r.enabled ? "ON" : "OFF"}</span>
        </label>
      </div>
      <label class="rule-copy-field rule-blurb-field rules-edit-only">
        <span>Description</span>
        <input type="text" class="boss-text rule-blurb-input" data-rule-blurb maxlength="400" value="${esc(r.blurb || "")}" />
      </label>
      ${details.length ? `
        <ul class="rule-detail-list rules-review-only">${details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}
      <div class="rule-edit-extra rules-edit-only">
        ${qualityExtra}
        <div class="rule-detail-editors">${detailEditors}</div>
      </div>
      ${extraParams.length ? `
        <div class="rule-row-params" ${r.enabled ? "" : "hidden"}>
          ${extraParams.map((p) => `
            <label class="rule-param">
              <span>${esc(p.label)}${p.kind === "pct" ? " (%)" : ""}</span>
              <span class="rules-review-only mono">${esc(fmtVal(p, (r.values || {})[p.key]))}${p.kind === "pct" ? "%" : ""}</span>
              <input class="mono rules-edit-only" data-rule-param="${esc(p.key)}" ${inputAttrs(p, (r.values || {})[p.key])} ${r.enabled ? "" : "disabled"} />
            </label>`).join("")}
        </div>` : ""}
    </article>`;
  };

  const grouped = groups.map((g) => {
    const items = rules.filter((r) => (r.group || "Rules") === g);
    if (!items.length) return "";
    return `
      <div class="rules-group" data-rules-group="${esc(g)}">
        <h3 class="rules-group-hd">${esc(g)}</h3>
        <div class="rules-group-list">${items.map(rowHtml).join("")}</div>
      </div>`;
  }).join("");

  return `
    <div class="rules-workspace rules-mode-review" id="rulesWorkspace">
      <header class="rules-topbar">
        <div class="rules-topbar-main">
          <div>
            <p class="rules-kicker">${esc(cfg.title || "Rules Checklist v3.1")}</p>
            <h1 class="rules-topbar-title rules-review-only">Review</h1>
            <h1 class="rules-topbar-title rules-edit-only">Editing</h1>
            <p class="rules-topbar-sub rules-review-only">Live desk settings. Read only until you edit.</p>
            <p class="rules-topbar-sub rules-edit-only" id="rulesSaveNote">Change numbers, wording, or toggles — Save returns to review.</p>
          </div>
          <div class="rules-topbar-stats">
            <div><span>On</span><strong class="mono pos">${onN}</strong></div>
            <div><span>Off</span><strong class="mono muted">${offN}</strong></div>
            <div><span>Ver</span><strong class="mono">v${esc(cfg.version || "3.1")}</strong></div>
          </div>
        </div>
        <div class="rules-topbar-actions rules-review-only">
          <a class="btn btn-ghost" href="#/trade">Trade</a>
          <button type="button" class="btn btn-primary" id="rulesEditBtn">Edit rules</button>
        </div>
        <div class="rules-topbar-actions rules-edit-only">
          <button type="button" class="btn btn-ghost" id="rulesCancelBtn">Cancel</button>
          <button type="button" class="btn btn-ghost" id="rulesResetDefaults">Reset defaults</button>
          <button type="button" class="btn btn-primary" id="rulesSave">Save changes</button>
        </div>
      </header>

      ${bossMandateHtml(cfg)}

      <section class="rules-block" aria-labelledby="rulesListHd">
        <header class="rules-block-hd">
          <div>
            <h2 id="rulesListHd">3 · Rules</h2>
            <p class="rules-review-only">Each rule’s status and description.</p>
            <p class="rules-edit-only">Rewrite titles, flip ON/OFF, and edit detail sentences.</p>
          </div>
        </header>
        <div class="rules-block-bd rules-block-list">
          <div class="rules-toolbar">
            <div class="tbl-tools-search">
              <span class="tbl-tools-ico" aria-hidden="true">⌕</span>
              <input type="search" id="rulesSearch" class="tbl-search" placeholder="Search rules…" aria-label="Search rules" />
            </div>
            <div class="tbl-chip-group" id="rulesStateFilter" role="group">
              <button type="button" class="tbl-chip on" data-rules-state="">All</button>
              <button type="button" class="tbl-chip" data-rules-state="1">ON</button>
              <button type="button" class="tbl-chip" data-rules-state="0">OFF</button>
            </div>
            <select id="rulesGroupFilter" aria-label="Filter by group">
              <option value="">All groups</option>
              ${groups.map((g) => `<option value="${esc(g)}">${esc(g)}</option>`).join("")}
            </select>
          </div>
          <div class="rules-list" id="rulesEditor">${grouped || `<p class="muted">No rules loaded.</p>`}</div>
        </div>
      </section>

      <div class="rules-footer-actions rules-edit-only">
        <button type="button" class="btn btn-ghost" id="rulesCancelBtn2">Cancel</button>
        <button type="button" class="btn btn-primary" id="rulesSave2">Save changes</button>
      </div>
    </div>`;
}

function bindRulesEditor(cfg) {
  const workspace = document.getElementById("rulesWorkspace");
  const root = document.getElementById("rulesEditor");
  const boss = document.getElementById("bossEditor");
  if (!root || !workspace) return;

  const setMode = (mode) => {
    const edit = mode === "edit";
    workspace.classList.toggle("rules-mode-edit", edit);
    workspace.classList.toggle("rules-mode-review", !edit);
    workspace.querySelectorAll(".rules-edit-only input, .rules-edit-only textarea, .rules-edit-only select").forEach((el) => {
      if (el.closest(".rule-row-params") && el.closest(".rule-row")?.classList.contains("is-off") && el.matches("[data-rule-param]")) {
        el.disabled = true;
      } else {
        el.disabled = false;
      }
    });
    if (edit) {
      const note = document.getElementById("rulesSaveNote");
      if (note) note.textContent = "Unsaved until you click Save — then you return to review.";
      workspace.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const markDirty = () => {
    if (!workspace.classList.contains("rules-mode-edit")) return;
    const note = document.getElementById("rulesSaveNote");
    if (note) note.textContent = "Unsaved changes — click Save to apply and return to review.";
  };
  const syncRow = (row) => {
    const on = !!row.querySelector("[data-rule-toggle]")?.checked;
    row.classList.toggle("is-on", on);
    row.classList.toggle("is-off", !on);
    row.dataset.enabled = on ? "1" : "0";
    const lab = row.querySelector(".rule-toggle-lbl");
    if (lab) lab.textContent = on ? "ON" : "OFF";
    const pill = row.querySelector(".rule-state-pill");
    if (pill) {
      pill.textContent = on ? "ON" : "OFF";
      pill.classList.toggle("is-on", on);
      pill.classList.toggle("is-off", !on);
    }
    const params = row.querySelector(".rule-row-params");
    if (params) params.hidden = !on;
    row.querySelectorAll("[data-rule-param]").forEach((inp) => { inp.disabled = !on; });
    markDirty();
  };
  const filterRows = () => {
    const q = String(document.getElementById("rulesSearch")?.value || "").trim().toLowerCase();
    const state = document.querySelector("#rulesStateFilter .tbl-chip.on")?.dataset.rulesState ?? "";
    const group = document.getElementById("rulesGroupFilter")?.value || "";
    root.querySelectorAll(".rule-row").forEach((row) => {
      let show = true;
      if (q && !(row.dataset.search || "").includes(q)) show = false;
      if (state !== "" && row.dataset.enabled !== state) show = false;
      if (group && row.dataset.group !== group) show = false;
      row.hidden = !show;
    });
    root.querySelectorAll(".rules-group").forEach((sec) => {
      const any = [...sec.querySelectorAll(".rule-row")].some((r) => !r.hidden);
      sec.hidden = !any;
    });
  };
  const collectParams = (scope) => {
    const params = {};
    (scope || document).querySelectorAll("[data-rule-param]").forEach((inp) => {
      const key = inp.dataset.ruleParam;
      let v = Number(inp.value);
      if (!key || !Number.isFinite(v)) return;
      if (inp.dataset.kind === "pct") v = v / 100;
      params[key] = v;
    });
    return params;
  };
  const collectAllocation = () => {
    const allocation = {};
    document.querySelectorAll("[data-alloc-sleeve]").forEach((inp) => {
      const sleeve = inp.dataset.allocSleeve;
      const field = inp.dataset.allocField;
      let v = Number(inp.value);
      if (!sleeve || !field || !Number.isFinite(v)) return;
      if (!allocation[sleeve]) allocation[sleeve] = {};
      allocation[sleeve][field] = v / 100;
    });
    return allocation;
  };
  const collectCopy = () => {
    const rules = {};
    root.querySelectorAll(".rule-row").forEach((row) => {
      const id = row.dataset.rule;
      if (!id) return;
      const label = String(row.querySelector("[data-rule-label]")?.value || "").trim();
      const blurb = String(row.querySelector("[data-rule-blurb]")?.value || "").trim();
      const details = [...row.querySelectorAll("[data-rule-detail]")]
        .map((el) => String(el.value || "").trim())
        .filter(Boolean);
      rules[id] = { label, blurb, details };
    });
    const quality_checklist = {};
    document.querySelectorAll(".boss-q-edit[data-qc-key]").forEach((row) => {
      const key = row.dataset.qcKey;
      if (!key) return;
      quality_checklist[key] = {
        label: String(row.querySelector('[data-qc-field="label"]')?.value || "").trim(),
        pass: String(row.querySelector('[data-qc-field="pass"]')?.value || "").trim(),
        note: String(row.querySelector('[data-qc-field="note"]')?.value || "").trim(),
      };
    });
    return { rules, quality_checklist };
  };
  const saveRules = async () => {
    const flags = {};
    root.querySelectorAll(".rule-row").forEach((row) => {
      const id = row.dataset.rule;
      const tog = row.querySelector("[data-rule-toggle]");
      if (id && tog) flags[id] = !!tog.checked;
    });
    const params = { ...collectParams(boss), ...collectParams(root) };
    const allocation = collectAllocation();
    const copy = collectCopy();
    try {
      await api("/api/config/rules", { method: "POST", body: JSON.stringify({ flags, params, allocation, copy }) });
      toast("Rules saved — back to review", true, { href: "#/rules", duration: 4000 });
      await render();
    } catch (e) {
      toast(e.message || "Could not save rules", false);
    }
  };

  document.getElementById("rulesEditBtn")?.addEventListener("click", () => setMode("edit"));
  document.getElementById("rulesCancelBtn")?.addEventListener("click", () => render());
  document.getElementById("rulesCancelBtn2")?.addEventListener("click", () => render());
  document.getElementById("rulesSave")?.addEventListener("click", saveRules);
  document.getElementById("rulesSave2")?.addEventListener("click", saveRules);

  root.querySelectorAll("[data-rule-toggle]").forEach((tog) => {
    tog.onchange = () => syncRow(tog.closest(".rule-row"));
  });
  [root, boss].forEach((scope) => {
    scope?.querySelectorAll("input, textarea").forEach((inp) => {
      inp.addEventListener("input", () => {
        markDirty();
        const row = inp.closest(".rule-row");
        if (row && (inp.matches("[data-rule-label]") || inp.matches("[data-rule-blurb]"))) {
          const label = row.querySelector("[data-rule-label]")?.value || "";
          const blurb = row.querySelector("[data-rule-blurb]")?.value || "";
          row.dataset.search = `${label} ${blurb} ${row.dataset.group || ""}`.toLowerCase();
        }
      });
    });
  });
  document.getElementById("rulesSearch")?.addEventListener("input", filterRows);
  document.getElementById("rulesGroupFilter")?.addEventListener("change", filterRows);
  document.querySelectorAll("#rulesStateFilter [data-rules-state]").forEach((chip) => {
    chip.onclick = () => {
      document.querySelectorAll("#rulesStateFilter .tbl-chip").forEach((c) => c.classList.remove("on"));
      chip.classList.add("on");
      filterRows();
    };
  });
  document.getElementById("rulesResetDefaults")?.addEventListener("click", async () => {
    if (!confirm("Reset all rules, numbers, and wording to boss defaults?")) return;
    try {
      const defaults = cfg?.rule_controls?.defaults || {};
      await api("/api/config/rules", {
        method: "POST",
        body: JSON.stringify({
          flags: defaults.flags || Object.fromEntries((cfg?.rule_controls?.rules || []).map((r) => [r.id, !!r.default])),
          params: defaults.params || {},
          allocation: defaults.allocation || cfg.allocation_defaults || {},
          reset_copy: true,
        }),
      });
      toast("Restored boss defaults — review view", true, { href: "#/rules" });
      await render();
    } catch (e) {
      toast(e.message || "Reset failed", false);
    }
  });

  setMode("review");
}

async function pageRules() {
  const cfg = await loadRulesConfig();
  const d = await api("/api/today").catch(() => ({}));
  return {
    html: `
      <div class="page-shell page-rules">
        ${rulesPanel(cfg)}
      </div>`,
    meta: { ...d, n_holdings: d.n_holdings ?? d.holdings?.length ?? 0 },
    after: () => bindRulesEditor(cfg),
  };
}

async function loadRulesConfig() {
  try { return await api("/api/config"); } catch { return null; }
}


const SLEEVE_COLORS = {
  india: "var(--india)",
  us: "var(--us)",
  commodities: "var(--commodities)",
  bonds: "var(--bonds)",
  crypto: "var(--crypto)",
  cash: "var(--accent)",
  savings: "var(--gain)",
  other: "var(--text-faint)",
};

function chartScaleY(vals, h, T, B) {
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = Math.max((max - min) * 0.08, Math.max(Math.abs(max), Math.abs(min), 1) * 0.02);
  const lo = min - pad;
  const hi = max + pad;
  const span = Math.max(hi - lo, 1);
  return {
    lo, hi, span,
    y: (v) => T + (1 - (v - lo) / span) * (h - T - B),
  };
}

function chartPath(pts) {
  return pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
}

function chartDateTicks(rows, L, plotW, y) {
  if (!rows.length) return "";
  const mid = Math.floor(rows.length / 2);
  const marks = [
    { i: 0, anchor: "start" },
    { i: mid, anchor: "middle" },
    { i: rows.length - 1, anchor: "end" },
  ];
  const seen = new Set();
  return marks.map(({ i, anchor }) => {
    if (seen.has(i)) return "";
    seen.add(i);
    const x = L + (rows.length === 1 ? 0 : (i / (rows.length - 1)) * plotW);
    return `<text x="${x}" y="${y}" class="an-axis" text-anchor="${anchor}">${esc(fmtDate(rows[i].date))}</text>`;
  }).join("");
}

function anHoverScaffold(W, H, maxDots = 2) {
  const dots = Array.from({ length: maxDots }, (_, i) =>
    `<circle class="an-hover-dot" data-dot="${i}" cx="0" cy="0" r="4.2" />`).join("");
  return `
    <g class="an-hover-g" opacity="0" pointer-events="none">
      <line class="an-hover-vline" x1="0" y1="0" x2="0" y2="0"/>
      ${dots}
    </g>
    <rect class="an-hover-hit" x="0" y="0" width="${W}" height="${H}" fill="transparent" tabindex="0"/>`;
}

function anChartShell({ kind, points, svgInner, foot = "", extraClass = "" }) {
  return `
    <div class="an-chart ${extraClass}" data-an-chart="${esc(kind)}" data-an-points="${esc(JSON.stringify(points))}">
      <div class="an-chart-plot">
        ${svgInner}
        <div class="an-hover-tip" hidden role="tooltip"></div>
      </div>
      ${foot}
    </div>`;
}

function bindAnalyticsHover() {
  document.querySelectorAll(".an-chart[data-an-points]").forEach((chart) => {
    let series;
    try { series = JSON.parse(chart.dataset.anPoints || "[]"); } catch { return; }
    if (!Array.isArray(series) || !series.length) return;
    const svg = chart.querySelector("svg.an-svg");
    const tip = chart.querySelector(".an-hover-tip");
    const hoverG = svg?.querySelector(".an-hover-g");
    const vline = hoverG?.querySelector(".an-hover-vline");
    const hit = svg?.querySelector(".an-hover-hit");
    if (!svg || !tip || !hoverG || !vline || !hit) return;

    const vb = svg.viewBox.baseVal;
    const plotTop = Number(chart.dataset.anTop || 12);
    const plotBot = Number(chart.dataset.anBottom || (vb.height - 28));

    const hide = () => {
      hoverG.setAttribute("opacity", "0");
      tip.hidden = true;
      chart.classList.remove("is-hovering");
    };

    const showAt = (idx, clientX, clientY) => {
      const p = series[idx];
      if (!p) return hide();
      hoverG.setAttribute("opacity", "1");
      chart.classList.add("is-hovering");
      vline.setAttribute("x1", p.x);
      vline.setAttribute("x2", p.x);
      vline.setAttribute("y1", plotTop);
      vline.setAttribute("y2", plotBot);
      const dots = [...hoverG.querySelectorAll(".an-hover-dot")];
      dots.forEach((dot, i) => {
        const m = (p.markers || [])[i];
        if (!m) {
          dot.setAttribute("opacity", "0");
          return;
        }
        dot.setAttribute("opacity", "1");
        dot.setAttribute("cx", p.x);
        dot.setAttribute("cy", m.y);
        if (m.color) dot.setAttribute("fill", m.color);
      });
      tip.innerHTML = `
        <strong class="an-hover-title">${esc(p.title || "")}</strong>
        <dl class="an-hover-rows">
          ${(p.rows || []).map((r) => `
            <div><dt>${esc(r.label)}</dt><dd class="mono ${r.tone ? esc(r.tone) : ""}">${esc(r.value)}</dd></div>
          `).join("")}
        </dl>`;
      tip.hidden = false;
      const plot = chart.querySelector(".an-chart-plot");
      const pr = plot.getBoundingClientRect();
      const tw = tip.offsetWidth || 160;
      const th = tip.offsetHeight || 80;
      let left = clientX - pr.left + 14;
      let top = clientY - pr.top - th - 10;
      if (left + tw > pr.width - 6) left = clientX - pr.left - tw - 14;
      if (left < 6) left = 6;
      if (top < 6) top = clientY - pr.top + 16;
      if (top + th > pr.height - 6) top = Math.max(6, pr.height - th - 6);
      tip.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    };

    const nearest = (svgX) => {
      let best = 0;
      let bestD = Infinity;
      series.forEach((p, i) => {
        const d = Math.abs(Number(p.x) - svgX);
        if (d < bestD) { bestD = d; best = i; }
      });
      return best;
    };

    const onMove = (e) => {
      const rect = svg.getBoundingClientRect();
      if (!rect.width) return;
      const svgX = ((e.clientX - rect.left) / rect.width) * vb.width;
      showAt(nearest(svgX), e.clientX, e.clientY);
    };

    hit.addEventListener("mousemove", onMove);
    hit.addEventListener("mouseenter", onMove);
    hit.addEventListener("mouseleave", hide);
    chart.addEventListener("mouseleave", hide);
  });
}

/** Dual-series wealth + invested book equity curve (market desk style). */
function wealthCurveSvg(days, putIn = 0) {
  const rows = (days || []).slice(-45);
  if (rows.length < 2) {
    return `<div class="an-empty">Equity curve appears after two or more sessions. Invest on Trade to start the trail.</div>`;
  }
  const W = 860, H = 280, L = 58, R = 18, T = 18, B = 34;
  const plotW = W - L - R;
  const wealth = rows.map((d) => Number(d.wealth ?? 0) || 0);
  const book = rows.map((d) => Number(d.book ?? 0) || 0);
  const scale = chartScaleY([...wealth, ...book, putIn || 0], H, T, B);
  const xAt = (i) => L + (i / (rows.length - 1)) * plotW;
  const wPts = wealth.map((v, i) => [xAt(i), scale.y(v)]);
  const bPts = book.map((v, i) => [xAt(i), scale.y(v)]);
  const wLine = chartPath(wPts);
  const bLine = chartPath(bPts);
  const area = `${wLine} L${wPts[wPts.length - 1][0].toFixed(1)},${(H - B).toFixed(1)} L${wPts[0][0].toFixed(1)},${(H - B).toFixed(1)} Z`;
  const grid = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const val = scale.hi - t * scale.span;
    return { y: scale.y(val), val };
  });
  const first = wealth[0];
  const last = wealth[wealth.length - 1];
  const delta = last - first;
  const up = delta >= 0;
  const putY = putIn > 0 ? scale.y(putIn) : null;
  const wColor = up ? "#3ecf7a" : "#f06767";
  const activityDots = rows.map((d, i) => {
    const buys = Number(d.buy_count) || 0;
    const sells = Number(d.sell_count) || 0;
    if (!buys && !sells) return "";
    const cls = buys ? "an-dot-buy" : "an-dot-sell";
    return `<circle cx="${xAt(i)}" cy="${wPts[i][1]}" r="3.2" class="${cls}"></circle>`;
  }).join("");
  const hoverPoints = rows.map((d, i) => {
    const pnl = Number(d.pnl ?? d.wealth_delta ?? 0) || 0;
    const buys = Number(d.buy_count) || 0;
    const sells = Number(d.sell_count) || 0;
    const act = buys || sells
      ? `${buys ? `${buys} buy` : ""}${buys && sells ? " · " : ""}${sells ? `${sells} sell` : ""}`
      : (d.activity || "idle");
    return {
      x: +xAt(i).toFixed(1),
      markers: [
        { y: +wPts[i][1].toFixed(1), color: wColor },
        { y: +bPts[i][1].toFixed(1), color: "#4d9fff" },
      ],
      title: fmtDate(d.date),
      rows: [
        { label: "Net worth", value: inr(wealth[i]) },
        { label: "Invested book", value: inr(book[i]) },
        { label: "Session P/L", value: signed(pnl), tone: tone(pnl) },
        { label: "Activity", value: act },
      ],
    };
  });
  const svgInner = `
      <svg viewBox="0 0 ${W} ${H}" class="an-svg an-svg-main" role="img" aria-label="Net worth and invested book over sessions">
        <defs>
          <linearGradient id="anWealthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${up ? "var(--gain)" : "var(--loss)"}" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="${up ? "var(--gain)" : "var(--loss)"}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${grid.map((g) => `
          <line x1="${L}" y1="${g.y}" x2="${W - R}" y2="${g.y}" class="an-grid"/>
          <text x="${L - 8}" y="${g.y + 3}" class="an-axis" text-anchor="end">${inr(g.val)}</text>`).join("")}
        ${putY != null ? `<line x1="${L}" y1="${putY}" x2="${W - R}" y2="${putY}" class="an-ref"/><text x="${W - R}" y="${putY - 4}" class="an-axis an-ref-lbl" text-anchor="end">Capital in</text>` : ""}
        <path d="${area}" fill="url(#anWealthFill)"/>
        <path d="${bLine}" fill="none" class="an-line-book" stroke-width="1.6" stroke-dasharray="5 4"/>
        <path d="${wLine}" fill="none" stroke="${wColor}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
        ${activityDots}
        <circle cx="${wPts[wPts.length - 1][0]}" cy="${wPts[wPts.length - 1][1]}" r="4" fill="${wColor}"/>
        ${chartDateTicks(rows, L, plotW, H - 8)}
        ${anHoverScaffold(W, H, 2)}
      </svg>`;
  const foot = `
      <div class="an-chart-foot">
        <div class="an-legend">
          <span class="an-leg an-leg-wealth">Net worth</span>
          <span class="an-leg an-leg-book">Invested book</span>
          ${putIn > 0 ? `<span class="an-leg an-leg-ref">Capital put in</span>` : ""}
          <span class="an-leg an-leg-buy">Buy day</span>
          <span class="an-leg an-leg-sell">Sell / rules day</span>
        </div>
        <strong class="mono ${tone(delta)}">${delta >= 0 ? "▲" : "▼"} ${signed(delta)} · ${((delta / Math.max(Math.abs(first), 1)) * 100).toFixed(1)}% over ${rows.length} sessions</strong>
      </div>`;
  return anChartShell({
    kind: "wealth",
    points: hoverPoints,
    svgInner,
    foot,
  }).replace('data-an-chart="wealth"', `data-an-chart="wealth" data-an-top="${T}" data-an-bottom="${H - B}"`);
}

function drawdownSvg(days, opts = {}) {
  const rows = (days || []).slice(-45);
  if (rows.length < 2) return `<div class="an-empty an-empty-sm">Drawdown needs a longer trail.</div>`;

  // Prefer engine peak→MTM drawdown (positive %); fall back to wealth path.
  let peak = Number(rows[0].wealth ?? 0) || 0;
  const dd = rows.map((d) => {
    if (d.drawdown_pct != null && Number.isFinite(Number(d.drawdown_pct))) {
      return -Math.abs(Number(d.drawdown_pct));
    }
    const v = Number(d.wealth ?? 0) || 0;
    peak = Math.max(peak, v);
    return peak > 0 ? ((v - peak) / peak) * 100 : 0;
  });

  const maxDd = Math.min(...dd, 0);
  const curDd = dd[dd.length - 1] || 0;
  const tiers = [
    { pct: -Math.abs(Number(opts.t1 ?? 10)), label: "T1", cls: "an-dd-t1" },
    { pct: -Math.abs(Number(opts.t2 ?? 15)), label: "T2", cls: "an-dd-t2" },
    { pct: -Math.abs(Number(opts.t3 ?? 20)), label: "T3", cls: "an-dd-t3" },
  ].filter((t) => Number.isFinite(t.pct) && t.pct < 0);

  // Always show a readable underwater band (never a flat empty strip).
  const floor = Math.min(maxDd, ...tiers.map((t) => t.pct), -5);
  const W = 520, H = 200, L = 46, R = 14, T = 16, B = 30;
  const plotW = W - L - R;
  const plotH = H - T - B;
  const lo = floor * 1.12;
  const hi = 0.4; // keep 0% near the top
  const span = Math.max(hi - lo, 1);
  const yAt = (v) => T + (1 - (v - lo) / span) * plotH;
  const xAt = (i) => L + (rows.length === 1 ? 0 : (i / (rows.length - 1)) * plotW);
  const pts = dd.map((v, i) => [xAt(i), yAt(v)]);
  const line = chartPath(pts);
  const zeroY = yAt(0);
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${zeroY.toFixed(1)} L${pts[0][0].toFixed(1)},${zeroY.toFixed(1)} Z`;
  const maxIdx = dd.indexOf(maxDd);
  const maxPt = pts[maxIdx] || pts[pts.length - 1];
  const lastPt = pts[pts.length - 1];

  const gridLevels = [];
  const step = Math.abs(floor) >= 20 ? 5 : Math.abs(floor) >= 10 ? 2.5 : 1;
  for (let g = 0; g >= floor - 0.01; g -= step) gridLevels.push(g);

  const tierBands = tiers.map((t, i) => {
    const next = tiers[i + 1]?.pct ?? lo;
    const y1 = yAt(t.pct);
    const y2 = yAt(Math.min(next, t.pct));
    const h = Math.max(y2 - y1, 0);
    if (h < 0.5) return "";
    return `<rect x="${L}" y="${y1.toFixed(1)}" width="${plotW}" height="${h.toFixed(1)}" class="${t.cls}" />`;
  }).join("");

  const tierLines = tiers.map((t) => `
    <line x1="${L}" y1="${yAt(t.pct).toFixed(1)}" x2="${W - R}" y2="${yAt(t.pct).toFixed(1)}" class="an-dd-tier-line"/>
    <text x="${W - R}" y="${yAt(t.pct).toFixed(1) - 3}" class="an-axis an-dd-tier-lbl" text-anchor="end">${t.label} ${Math.abs(t.pct).toFixed(0)}%</text>
  `).join("");

  const hoverPoints = rows.map((d, i) => {
    const v = dd[i];
    const tierHit = tiers.find((t) => v <= t.pct);
    return {
      x: +pts[i][0].toFixed(1),
      markers: [{ y: +pts[i][1].toFixed(1), color: "#f06767" }],
      title: fmtDate(d.date),
      rows: [
        { label: "Drawdown", value: `${v.toFixed(2)}%`, tone: v < -0.05 ? "neg" : "" },
        { label: "Depth", value: `${Math.abs(v).toFixed(2)}% below peak` },
        { label: "Breaker", value: tierHit ? `${tierHit.label} zone (≥ ${Math.abs(tierHit.pct).toFixed(0)}%)` : "Below T1" },
        { label: "Net worth", value: inr(Number(d.wealth) || 0) },
      ],
    };
  });

  const svgInner = `
      <svg viewBox="0 0 ${W} ${H}" class="an-svg an-svg-dd" role="img" aria-label="Drawdown from peak">
        <defs>
          <linearGradient id="anDdFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f06767" stop-opacity="0.08"/>
            <stop offset="100%" stop-color="#f06767" stop-opacity="0.38"/>
          </linearGradient>
        </defs>
        ${tierBands}
        ${gridLevels.map((g) => `
          <line x1="${L}" y1="${yAt(g).toFixed(1)}" x2="${W - R}" y2="${yAt(g).toFixed(1)}" class="an-grid"/>
          <text x="${L - 6}" y="${yAt(g).toFixed(1) + 3}" class="an-axis" text-anchor="end">${g === 0 ? "0%" : `${g.toFixed(g % 1 ? 1 : 0)}%`}</text>
        `).join("")}
        ${tierLines}
        <path d="${area}" fill="url(#anDdFill)"/>
        <path d="${line}" fill="none" stroke="#f06767" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="${L}" y1="${zeroY.toFixed(1)}" x2="${W - R}" y2="${zeroY.toFixed(1)}" class="an-dd-zero"/>
        ${maxDd < -0.05 ? `
          <circle cx="${maxPt[0].toFixed(1)}" cy="${maxPt[1].toFixed(1)}" r="3.5" fill="#f06767"/>
          <text x="${Math.min(maxPt[0] + 6, W - R - 4).toFixed(1)}" y="${(maxPt[1] - 6).toFixed(1)}" class="an-axis an-dd-callout">${maxDd.toFixed(1)}%</text>
        ` : ""}
        <circle cx="${lastPt[0].toFixed(1)}" cy="${lastPt[1].toFixed(1)}" r="3.5" fill="#f06767" stroke="var(--bg-panel)" stroke-width="1.5"/>
        ${chartDateTicks(rows, L, plotW, H - 8)}
        ${anHoverScaffold(W, H, 1)}
      </svg>`;
  const foot = `
      <div class="an-chart-foot an-chart-foot-sm">
        <div class="an-dd-foot-stats">
          <span>Now <strong class="mono ${curDd < -0.05 ? "neg" : ""}">${curDd.toFixed(2)}%</strong></span>
          <span>Max <strong class="mono ${maxDd < -0.05 ? "neg" : ""}">${maxDd.toFixed(2)}%</strong></span>
        </div>
        <span class="an-dd-foot-hint">Hover for session detail · Peak→MTM</span>
      </div>`;
  return anChartShell({
    kind: "drawdown",
    points: hoverPoints,
    svgInner,
    foot,
    extraClass: "an-chart-dd",
  }).replace('data-an-chart="drawdown"', `data-an-chart="drawdown" data-an-top="${T}" data-an-bottom="${H - B}"`);
}

function sessionPnlBarsSvg(days) {
  const rows = (days || []).slice(-20);
  if (!rows.length) return `<div class="an-empty an-empty-sm">No session P/L yet.</div>`;
  const vals = rows.map((d) => Number(d.pnl ?? d.wealth_delta ?? 0) || 0);
  const W = 420, H = 160, L = 44, R = 12, T = 14, B = 28;
  const plotW = W - L - R;
  const absMax = Math.max(...vals.map((v) => Math.abs(v)), 1);
  const zeroY = T + (H - T - B) / 2;
  const barW = Math.max(4, (plotW / rows.length) * 0.62);
  const bars = vals.map((v, i) => {
    const x = L + ((i + 0.5) / rows.length) * plotW - barW / 2;
    const h = (Math.abs(v) / absMax) * ((H - T - B) / 2 - 4);
    const y = v >= 0 ? zeroY - h : zeroY;
    const cls = v >= 0 ? "an-bar-up" : "an-bar-dn";
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(h, 1).toFixed(1)}" class="${cls}"></rect>`;
  }).join("");
  const hoverPoints = rows.map((d, i) => {
    const v = vals[i];
    const cx = L + ((i + 0.5) / rows.length) * plotW;
    const h = (Math.abs(v) / absMax) * ((H - T - B) / 2 - 4);
    const tipY = v >= 0 ? zeroY - Math.max(h, 1) : zeroY + Math.max(h, 1);
    return {
      x: +cx.toFixed(1),
      markers: [{ y: +tipY.toFixed(1), color: v >= 0 ? "#3ecf7a" : "#f06767" }],
      title: fmtDate(d.date),
      rows: [
        { label: "Session P/L", value: signed(v), tone: tone(v) },
        { label: "Net worth", value: inr(Number(d.wealth) || 0) },
        { label: "Book", value: inr(Number(d.book) || 0) },
        { label: "Activity", value: d.activity || (Number(d.buy_count) ? "invested" : "—") },
      ],
    };
  });
  const svgInner = `
      <svg viewBox="0 0 ${W} ${H}" class="an-svg" role="img" aria-label="Daily session profit and loss">
        <line x1="${L}" y1="${zeroY}" x2="${W - R}" y2="${zeroY}" class="an-grid"/>
        <text x="${L - 6}" y="${T + 8}" class="an-axis" text-anchor="end">${inr(absMax)}</text>
        <text x="${L - 6}" y="${H - B + 4}" class="an-axis" text-anchor="end">−${inr(absMax)}</text>
        ${bars}
        <text x="${L}" y="${H - 8}" class="an-axis">${esc(fmtDate(rows[0].date))}</text>
        <text x="${W - R}" y="${H - 8}" class="an-axis" text-anchor="end">${esc(fmtDate(rows[rows.length - 1].date))}</text>
        ${anHoverScaffold(W, H, 1)}
      </svg>`;
  const foot = `
      <div class="an-chart-foot an-chart-foot-sm">
        <span>Last ${rows.length} session P/L bars · hover a bar</span>
        <strong class="mono ${tone(vals.reduce((a, b) => a + b, 0))}">Σ ${signed(vals.reduce((a, b) => a + b, 0))}</strong>
      </div>`;
  return anChartShell({
    kind: "session",
    points: hoverPoints,
    svgInner,
    foot,
  }).replace('data-an-chart="session"', `data-an-chart="session" data-an-top="${T}" data-an-bottom="${H - B}"`);
}

/** Dashboard analytics board — charts & performance only (positions live on Portfolio). */
function analyticsDesk(d, cfg = null) {
  const p = d.pnl || {};
  const days = d.pnl_days || p.days || [];
  const book = Number(p.book ?? d.portfolio ?? 0) || 0;
  const cash = Number(p.cash ?? d.cash ?? 0) || 0;
  const savings = Number(p.savings ?? d.savings ?? 0) || 0;
  const wealth = Number(p.wealth ?? book + cash + savings) || 0;
  const putIn = Number(p.contributed ?? d.contributed ?? 0) || 0;
  const overall = Number(p.overall ?? wealth - putIn) || 0;
  const overallPct = putIn > 0 ? (overall / putIn) * 100 : 0;
  const todayNet = Number(p.today ?? d.daily_pnl ?? 0) || 0;
  const last7 = Number(p.last_7 ?? 0) || 0;
  const dayCount = Number(p.day_count ?? days.length) || 0;
  const wins = Number(p.winning_days ?? 0) || 0;
  const winRate = dayCount > 0 ? (wins / dayCount) * 100 : 0;
  const best = p.best || null;
  const worst = p.worst || null;
  const deployedPct = wealth > 0 ? (book / wealth) * 100 : 0;
  const risk = d.risk_profile || {};
  const nPos = Number(d.n_holdings ?? d.holdings?.length ?? 0) || 0;

  let peak = 0;
  let maxDd = 0;
  for (const row of days) {
    if (row.drawdown_pct != null && Number.isFinite(Number(row.drawdown_pct))) {
      maxDd = Math.min(maxDd, -Math.abs(Number(row.drawdown_pct)));
      continue;
    }
    const w = Number(row.wealth ?? 0) || 0;
    peak = Math.max(peak, w);
    if (peak > 0) maxDd = Math.min(maxDd, ((w - peak) / peak) * 100);
  }
  const ddOpts = {
    t1: Number(cfg?.drawdown?.t1 ?? d.drawdown?.t1 ?? 10) || 10,
    t2: Number(cfg?.drawdown?.t2 ?? d.drawdown?.t2 ?? 15) || 15,
    t3: Number(cfg?.drawdown?.t3 ?? d.drawdown?.t3 ?? 20) || 20,
  };
  // cfg/API may store fractions (0.10) — normalize to percent points for the chart
  if (Math.abs(ddOpts.t1) <= 1) ddOpts.t1 *= 100;
  if (Math.abs(ddOpts.t2) <= 1) ddOpts.t2 *= 100;
  if (Math.abs(ddOpts.t3) <= 1) ddOpts.t3 *= 100;

  const allocRaw = Array.isArray(d.allocation) ? d.allocation : [];
  const sleeves = SLEEVE_ORDER.map((k) => {
    const row = allocRaw.find((a) => a.asset === k) || {};
    const value = Number(row.value) || 0;
    const weight = book > 0 ? value / book : Number(row.weight) || 0;
    return { key: k, label: row.label || sleeveLabel(k), value, weight, color: SLEEVE_COLORS[k] || SLEEVE_COLORS.other };
  }).filter((s) => s.weight > 0.001 || s.value > 0);

  const improveBits = [];
  if (maxDd < -8) improveBits.push("Drawdown is elevated — review stops and position size on Portfolio.");
  if (deployedPct < 40 && cash > putIn * 0.2) improveBits.push("Cash is heavy vs book — deploy selectively on Trade when ideas clear.");
  if (winRate < 40 && dayCount >= 5) improveBits.push("Win rate is soft — tighten entries and skip weaker suggestions.");
  if (risk.band === "aggressive") improveBits.push("Risk band is aggressive — concentration or sleeve drift is high.");
  if (!improveBits.length) {
    improveBits.push(dayCount < 3
      ? "Trail is young — keep logging sessions; charts harden after a week of activity."
      : "Book is tracking within a stable band — keep following rules and session history.");
  }

  return `
    <section class="an-desk" aria-label="Market analytics">
      <header class="an-hd">
        <div>
          <p class="an-kicker">SNS Capital · analytics</p>
          <h2 class="an-title">Market performance</h2>
          <p class="an-sub">Equity path, drawdown, session P/L, and sleeve mix. Positions and day ledger live on <a href="#/portfolio">Portfolio</a>.</p>
        </div>
        <div class="an-stamp">
          <span>${esc(d.date_label || fmtDate(d.session_date || d.calendar_date))}</span>
          <em>${d.readonly ? "Archive view" : d.market_open === false ? "Markets closed" : "Live session"}</em>
        </div>
      </header>

      <div class="an-pulse">
        <div class="an-pulse-item">
          <span>Net worth</span>
          <strong class="mono">${inr(wealth)}</strong>
          <em class="mono ${tone(overall)}">${signed(overall)} · ${overallPct.toFixed(1)}% vs capital</em>
        </div>
        <div class="an-pulse-item">
          <span>Session P/L</span>
          <strong class="mono ${tone(todayNet)}">${signed(todayNet)}</strong>
          <em>Last 7 · <span class="mono ${tone(last7)}">${signed(last7)}</span></em>
        </div>
        <div class="an-pulse-item">
          <span>Win rate</span>
          <strong class="mono">${winRate.toFixed(0)}%</strong>
          <em>${wins}/${dayCount || 0} up sessions</em>
        </div>
        <div class="an-pulse-item">
          <span>Max drawdown</span>
          <strong class="mono ${maxDd < -0.05 ? "neg" : ""}">${maxDd.toFixed(2)}%</strong>
          <em>Peak-to-trough on net worth</em>
        </div>
        <div class="an-pulse-item">
          <span>Deployed</span>
          <strong class="mono">${deployedPct.toFixed(0)}%</strong>
          <em>${nPos} open · risk ${esc(risk.band || "—")}</em>
        </div>
      </div>

      <div class="an-main">
        <div class="an-panel an-panel-wide">
          <div class="an-panel-hd">
            <h3>Equity curve</h3>
            <span>Net worth vs invested book · last ${Math.min(days.length, 45)} sessions</span>
          </div>
          ${wealthCurveSvg(days, putIn)}
        </div>
      </div>

      <div class="an-grid-2">
        <div class="an-panel">
          <div class="an-panel-hd">
            <h3>Drawdown</h3>
            <span>Peak → mark-to-market · last ${Math.min(days.length, 45)} sessions</span>
          </div>
          ${drawdownSvg(days, ddOpts)}
        </div>
        <div class="an-panel">
          <div class="an-panel-hd">
            <h3>Session P/L</h3>
            <span>Daily profit &amp; loss bars</span>
          </div>
          ${sessionPnlBarsSvg(days)}
        </div>
      </div>

      <div class="an-grid-2 an-grid-bottom">
        <div class="an-panel">
          <div class="an-panel-hd">
            <h3>Sleeve mix</h3>
            <span>Share of invested book</span>
          </div>
          ${sleeves.length ? `
            <div class="an-sleeves">
              ${sleeves.map((s) => `
                <div class="an-sleeve-row">
                  <div class="an-sleeve-lbl"><strong>${esc(s.label)}</strong><span class="mono">${inr(s.value)}</span></div>
                  <div class="an-sleeve-track"><span style="width:${Math.min(s.weight * 100, 100)}%;background:${s.color}"></span></div>
                  <strong class="mono an-sleeve-pct">${(s.weight * 100).toFixed(1)}%</strong>
                </div>`).join("")}
            </div>` : `<p class="an-empty an-empty-sm">No invested sleeves yet — open positions on Trade.</p>`}
          <p class="an-footnote">Position lots and capital detail live on <a href="#/portfolio">Portfolio</a>. Invest from <a href="#/trade">Trade</a>.</p>
        </div>
        <div class="an-panel">
          <div class="an-panel-hd">
            <h3>Performance board</h3>
            <span>What improved · what to watch</span>
          </div>
          <dl class="an-stats">
            <div><dt>Best session</dt><dd class="mono ${tone(best?.pnl)}">${best ? `${esc(fmtDate(best.date))} · ${signed(best.pnl)}` : "—"}</dd></div>
            <div><dt>Worst session</dt><dd class="mono ${tone(worst?.pnl)}">${worst ? `${esc(fmtDate(worst.date))} · ${signed(worst.pnl)}` : "—"}</dd></div>
            <div><dt>Earlier days P/L</dt><dd class="mono ${tone(p.past)}">${signed(Number(p.past) || 0)}</dd></div>
            <div><dt>Risk score</dt><dd class="mono">${risk.score != null ? `${risk.score}/100 · ${esc(risk.band || "")}` : "—"}</dd></div>
          </dl>
          <ul class="an-improve">
            ${improveBits.map((t) => `<li>${esc(t)}</li>`).join("")}
          </ul>
          <div class="an-actions">
            <a class="btn btn-sm" href="#/portfolio">Open Portfolio</a>
            <a class="btn btn-sm btn-ghost" href="#/trade">Go to Trade</a>
            <button type="button" class="btn btn-sm btn-report-pdf" data-report-format="pdf" data-report-asof="overall">Download PDF</button>
          </div>
        </div>
      </div>
    </section>`;
}

async function pageDashboard() {
  const d = await api("/api/dashboard");
  const trade = !d.readonly && d.can_trade;
  return {
    html: `
      <div class="page-shell page-dashboard">
        ${pageHero("Dashboard", "Analytics and live tape — capital, lots, and day history are on Portfolio.")}
        ${!d.readonly && d.paused ? `<div class="alert">Buying paused until ${esc(fmtDate(d.pause_until) || "—")} (drawdown). <a href="#/trade">Resume on Trade</a> to invest again.</div>` : ""}
        ${liveTapePanel(d.live, d)}
        <div class="dash-period-card">
          <div>
            <p class="range-kicker">Period tools</p>
            <p class="dash-period-copy">Review a From→To window on Portfolio, or paper-run rules on Backtest.</p>
          </div>
          <div class="dash-period-actions">
            <a class="btn btn-sm btn-primary" href="#/portfolio">Period review</a>
            <a class="btn btn-sm btn-ghost" href="#/backtest">Backtest</a>
          </div>
        </div>
        ${analyticsDesk(d)}
        <div class="sec-head sec-head-dash"><div><h2>Today’s ideas</h2><p class="sec-sub">Rules shortlist for this session — execute on Trade. Not a holdings list.</p></div>${d.skipped?.length ? `<button class="btn btn-sm btn-ghost" id="clearSkip">Restore skipped (${d.skipped.length})</button>` : ""}</div>
        ${recommendationCards(d.suggestions, { trade, dashboard: true })}
        ${d.alternatives?.length ? backupPicksPanel(d.alternatives, { trade: false }) : ""}
      </div>`,
    meta: { ...d, n_holdings: d.holdings?.length ?? d.n_holdings ?? 0 },
    after: () => {
      if (trade) { bindSkips(); bindClearSkip(); }
      bindReportActions();
      bindLiveChartChips(d.live);
      paintLiveChart(d.live);
      bindLiveQuoteDetails(document.getElementById("liveTape") || document);
      bindAnalyticsHover();
    },
  };
}

function syncLiveStrategyFromCatalog(cat) {
  if (!cat) return;
  window.__strategyCatalog = cat;
  window.__liveStrategy = {
    id: cat.active,
    name: cat.active_name,
    mindset: cat.active_mindset,
  };
}

function liveStrategyId() {
  return window.__liveStrategy?.id
    || window.__strategyCatalog?.active
    || deskMeta?.strategy
    || "multi_factor";
}

function refreshLiveStrategyUi() {
  const live = liveStrategyId();
  const name = window.__liveStrategy?.name || deskMeta?.strategy_name || "";
  document.querySelectorAll("#algoSelectLive").forEach((sel) => {
    if (live && sel.value !== live) sel.value = live;
  });
  document.querySelectorAll("[data-strategy]").forEach((btn) => {
    const sid = btn.getAttribute("data-strategy");
    const isLive = sid === live;
    btn.classList.toggle("is-live", isLive);
    if (btn.classList.contains("strat-use-btn")) {
      btn.disabled = isLive;
      btn.textContent = isLive ? "Live on Trade ✓" : "Use for Trade";
      if (!isLive) {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-ghost");
        if (btn.closest(".is-winner") || btn.closest(".algo-winner")) btn.classList.add("btn-primary");
      }
    }
  });
  document.querySelectorAll(".algo-compare-tbl tr[data-strategy-id]").forEach((tr) => {
    tr.classList.toggle("is-live-trade", tr.dataset.strategyId === live);
  });
  const pill = document.getElementById("hdrAlgoPill");
  if (pill && name) pill.textContent = `Algo · ${name}`;
  document.querySelectorAll(".strat-bar-active-name").forEach((el) => {
    if (name) el.textContent = name;
  });
  document.querySelectorAll(".strat-saved-badge").forEach((el) => {
    el.hidden = !name;
  });
}

function strategyPickerPanel(d, { variant = "trade" } = {}) {
  const list = d.strategies || [];
  const active = d.strategy || list.find((s) => s.is_active)?.id || liveStrategyId();
  const cur = list.find((s) => s.id === active) || {};
  const day = fmtDate(d.calendar_date || d.session_date || "");
  const title = variant === "backtest" ? "Saved for Trade" : "Method for Trade";
  const sub = variant === "backtest"
    ? "This choice is saved on your book. Compare below, then pick a row to switch — Trade picks update."
    : `Saved on your book · ${esc(day)} · Buy ideas and Preview split follow this.`;
  if (!list.length) {
    return `
      <div class="strat-bar" id="strategyPicker">
        <div class="strat-bar-main">
          <span class="strat-bar-label">${title}</span>
          <strong class="strat-bar-active-name">${esc(d.strategy_name || "Balanced desk")}</strong>
          <span class="strat-saved-badge">Saved ✓</span>
          <p class="strat-bar-hint">${sub}</p>
        </div>
        <a class="btn btn-sm btn-ghost" href="#/backtest">Compare</a>
      </div>`;
  }
  return `
    <div class="strat-bar strat-bar-${variant}" id="strategyPicker">
      <div class="strat-bar-main">
        <div class="strat-bar-title-row">
          <label class="strat-bar-label" for="algoSelectLive">${title}</label>
          <span class="strat-saved-badge">Saved ✓</span>
        </div>
        <select id="algoSelectLive" class="strat-bar-select" aria-label="Live Trade method">
          ${list.map((s) => `<option value="${esc(s.id)}" ${s.id === active ? "selected" : ""}>${esc(s.name)} — ${esc(s.mindset || s.blurb)}</option>`).join("")}
        </select>
        <p class="strat-bar-hint">${esc(cur.mindset || cur.blurb || sub)}</p>
        <p class="strat-bar-active mono tiny muted">Live now: <strong class="strat-bar-active-name">${esc(d.strategy_name || cur.name || "")}</strong></p>
      </div>
      <a class="btn btn-sm btn-ghost" href="${variant === "backtest" ? "#/trade" : "#/backtest"}">${variant === "backtest" ? "Open Trade" : "Compare all"}</a>
    </div>`;
}

async function setLiveStrategy(strategy, { reload = true } = {}) {
  if (!strategy || busy || viewDate) return null;
  if (strategy === liveStrategyId()) {
    toast("Already your saved Trade method", true, { skipInbox: true, duration: 2200 });
    return null;
  }
  busy = true;
  try {
    const res = await api("/api/strategies", {
      method: "POST",
      body: JSON.stringify({ strategy }),
    });
    syncLiveStrategyFromCatalog({
      ...window.__strategyCatalog,
      active: res.active,
      active_name: res.active_name,
      active_mindset: res.active_mindset,
      strategies: res.strategies || window.__strategyCatalog?.strategies,
    });
    deskMeta = { ...deskMeta, strategy: res.active, strategy_name: res.active_name, strategy_mindset: res.active_mindset };
    toast(res.note || `Saved for Trade → ${res.active_name}`, true, { skipInbox: true, duration: 4000 });
    refreshLiveStrategyUi();
    const { page } = route();
    const keepBacktest = page === "backtest" && document.querySelector(".algo-compare-tbl");
    if (reload && !keepBacktest) await render();
    return res;
  } catch (e) {
    toast(e.message || "Could not change algorithm", false);
    return null;
  } finally {
    busy = false;
  }
}

function bindStrategyPicker() {
  document.querySelectorAll("#algoSelectLive").forEach((sel) => {
    if (sel.dataset.bound === "1") return;
    sel.dataset.bound = "1";
    sel.addEventListener("change", async () => {
      const strategy = sel.value;
      if (!strategy) return;
      await setLiveStrategy(strategy);
    });
  });
  document.querySelectorAll("[data-strategy]").forEach((btn) => {
    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", async () => {
      const strategy = btn.getAttribute("data-strategy");
      if (!strategy || btn.classList.contains("is-live")) return;
      await setLiveStrategy(strategy);
    });
  });
  refreshLiveStrategyUi();
}

async function pageTrade() {
  const d = await api("/api/today");
  // Attach strategy catalog for the mindset picker
  try {
    const cat = await api("/api/strategies");
    d.strategies = cat.strategies || [];
    d.strategy = cat.active || d.strategy;
    d.strategy_name = cat.active_name || d.strategy_name;
    d.strategy_mindset = cat.active_mindset || d.strategy_mindset;
    syncLiveStrategyFromCatalog(cat);
  } catch { d.strategies = d.strategies || []; }
  const live = !d.readonly;
  const marketClosed = live && d.market_open === false;
  const paused = live && !!d.paused;
  const trade = live && !!d.can_trade && !marketClosed && !paused;
  const dailyTarget = Math.round(Number(d.recommended_amount) || 10000);
  // Important: remaining 0 must stay 0 (do not fall back to dailyTarget via ||).
  const remainRaw = Number(d.remaining_deploy_budget);
  const remain = Number.isFinite(remainRaw) ? Math.max(0, Math.round(remainRaw)) : Math.round(Number(d.max_deployable) || 0);
  const usedDep = Math.round(Number(d.deployed_today) || 0);
  const budgetDone = remain < 50 && usedDep > 0;
  // Default to remaining daily room (not a fresh ₹10K after you've already invested).
  const hint = budgetDone ? "0" : String(Math.max(1, remain > 0 ? remain : dailyTarget));
  mem.set("investAmt", hint);
  const n = d.suggestions?.length || 0;
  const buys = (d.suggestions || []).filter((s) => String(s.verdict || "").toUpperCase() === "BUY");
  const holds = (d.suggestions || []).filter((s) => String(s.verdict || "").toUpperCase() !== "BUY");
  const pending = Array.isArray(d.pending_actions) ? d.pending_actions : [];
  const pendingBanner = pending.length ? `
    <div class="alert alert-pending tis-pending">
      <strong>${pending.length} sell suggestion${pending.length > 1 ? "s" : ""}</strong>
      <span class="muted"> — Approve to sell, or Keep holding.</span>
      <ul class="pending-list">${pending.map((a) => `
        <li>
          <span class="mono">${esc(a.ticker)}</span> · ${esc(a.reason)} · ~${inr(a.amount)}
          <button type="button" class="btn btn-sm btn-buy" data-approve="${esc(a.id)}">Approve sell</button>
          <button type="button" class="btn btn-sm btn-ghost" data-reject="${esc(a.id)}">Keep holding</button>
        </li>`).join("")}
      </ul>
    </div>` : "";
  const sub = d.readonly
    ? `Archive for ${esc(fmtDate(d.view_date))} — review only.`
    : marketClosed
      ? (String(d.market_status || "") === "weekend"
        ? "Weekend lock — no invest today. Friday ₹5,000 / daily ceiling only apply on open NSE sessions."
        : "Markets closed — you can review picks; investing unlocks next open day.")
      : paused
        ? `Buying paused until ${esc(fmtDate(d.pause_until) || "—")}. Resume below if you accept the risk.`
        : budgetDone
          ? `Done for today (${inr(usedDep)} invested). Come back next open day.`
          : usedDep > 0
            ? `Already invested ${inr(usedDep)} · about ${inr(remain)} left today${d.friday ? ` · Friday cap ${inr(Math.round(Number(d.friday_cap) || 5000))}` : ""}.`
            : d.friday
              ? `Friday rule: ceiling ${inr(dailyTarget)} (not the usual regime amount). Enter amount → Preview → Invest.`
              : `Simple path: enter amount → Preview → Invest. Room today ≈ ${inr(remain)}.`;
  return {
    html: `
      <div class="page-shell page-trade page-trade-simple${d.readonly ? " page-trade-past" : ""}${marketClosed ? " page-trade-closed" : ""}${paused ? " page-trade-paused" : ""}">
        ${d.readonly ? `<div class="archive-ribbon">
          <div>
            <strong>Session archive</strong>
            <span>${esc(fmtDate(d.view_date))} · review only</span>
          </div>
          <button class="btn btn-sm btn-primary" id="todayBtn2" type="button">Live desk</button>
        </div>` : ""}
        <header class="trade-page-hd">
          <div>
            <h1 class="trade-page-title">${d.readonly ? "Archive" : marketClosed ? "Trade · closed" : paused ? "Trade · paused" : "Invest today"}</h1>
            <p class="trade-page-sub">${sub}</p>
          </div>
        </header>
        ${d.readonly ? "" : strategyPickerPanel(d)}
        ${pendingBanner}
        <div class="trade-layout${d.readonly ? " trade-layout-archive" : ""}">
          <aside class="trade-aside">${tradeInvestPanel(d, { trade, hint })}</aside>
          <section class="trade-main">
            <div class="idea-tabs" id="ideaTabs" role="tablist">
              <button type="button" class="idea-tab on" role="tab" data-idea-tab="buy" aria-selected="true">
                Buy ideas <span class="panel-count">${buys.length || (d.suggestions || []).length}</span>
              </button>
              <button type="button" class="idea-tab" role="tab" data-idea-tab="watch" aria-selected="false">
                Watchlist <span class="panel-count">${(holds.length || 0) + (d.alternatives?.length || 0)}</span>
              </button>
            </div>
            <p class="idea-tab-hint" id="ideaTabHint">Buy ideas ranked by <strong class="strat-bar-active-name">${esc(d.strategy_name || "your saved method")}</strong> — invest one name or Preview a split on the left.</p>
            <div class="idea-pane" data-idea-pane="buy">
              ${tradePickCards(buys.length ? buys : (d.suggestions || []).slice(0, 12), { trade, mode: "buy" })}
            </div>
            <div class="idea-pane" data-idea-pane="watch" hidden>
              ${holds.length || d.alternatives?.length
                ? `${holds.length ? tradePickCards(holds, { trade, mode: "hold" }) : ""}${d.alternatives?.length && !holds.length ? tradePickCards(d.alternatives, { trade, mode: "hold" }) : ""}${d.alternatives?.length && holds.length ? `<p class="tiny muted" style="margin:12px 0 8px">Also nearby</p>${tradePickCards(d.alternatives.slice(0, 12), { trade: false, mode: "hold" })}` : ""}`
                : `<div class="trade-picks-empty empty-cta"><p>No watchlist names right now.</p></div>`}
            </div>
            <p class="trade-research-link"><a href="#/research">Search any stock</a>${!d.readonly && !marketClosed ? ` · <a href="#/rules">Rules</a>` : ""}</p>
          </section>
        </div>
      </div>`,
    meta: { ...d, n_holdings: d.n_holdings ?? 0 },
    after: () => {
      if (paused) bindResumeBuying();
      if (pending.length) bindPendingActions();
      if (trade) { bindInvest(); bindTradePresets(d.cash, remain, dailyTarget); bindBuys(); bindSkips(); bindClearSkip(); }
      bindIdeaTabs();
      bindReportActions();
    },
  };
}

function bindIdeaTabs() {
  const tabs = document.querySelectorAll("[data-idea-tab]");
  if (!tabs.length) return;
  const hint = document.getElementById("ideaTabHint");
  tabs.forEach((tab) => {
    tab.onclick = () => {
      const id = tab.dataset.ideaTab;
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("on", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      document.querySelectorAll("[data-idea-pane]").forEach((pane) => {
        pane.hidden = pane.dataset.ideaPane !== id;
      });
      if (hint) {
        hint.textContent = id === "watch"
          ? "Watchlist passed quality but scored below Buy — research or add carefully."
          : "Invest in one name, or Preview a full split on the left.";
      }
    };
  });
}

function renderPlan(plan) {
  const box = document.getElementById("planBox"), btn = document.getElementById("doInvest"), note = document.getElementById("planNote");
  if (!box) return;
  if (!plan.lines?.length) {
    box.innerHTML = "";
    window.__activePlan = null;
    const maxDep = Math.max(0, Number(plan.max_deployable) || 0);
    const reserveFloor = Number(plan.reserve_floor) || 0;
    const remainDeploy = Math.max(0, Number(plan.remaining_deploy_budget) || 0);
    const reserveLocked = maxDep < 50 && remainDeploy >= 50;
    const msg = plan.note || (reserveLocked
      ? `Remaining cash is the 5% reserve (~${inr(reserveFloor)}). Investable now is ₹0 — daily ceiling left (${inr(remainDeploy)}) is not usable without cash above reserve.`
      : "No auto-split for this amount — pick a stock below or try Preview again.");
    if (note) note.textContent = msg;
    if (btn) btn.disabled = true;
    if (!window.__suppressPlanToast && !reserveLocked) {
      toast(msg, "warn", {
        id: `plan-empty:${plan.date || Date.now()}`,
        title: "Cannot invest this amount",
        href: "#/trade",
        duration: 7000,
      });
    }
    return;
  }
  const maxDep = Math.max(0, Number(plan.max_deployable) || 0);
  const reserveFloor = Number(plan.reserve_floor) || 0;
  const requested = Number(plan.amount) || 0;
  const remainDeploy = Math.max(0, Number(plan.remaining_deploy_budget) || 0);
  // Trust API max_deployable even when 0 — never fall back to daily room (that bypasses reserve).
  const spendCap = maxDep;
  window.__activePlan = {
    ...plan,
    lines: plan.lines.map((r) => {
      const price = Math.max(0.0001, Number(r.price) || 0);
      let qty = Number(r.qty) || 0;
      let amount = Number(r.amount) || 0;
      if (qty <= 0 && amount > 0) qty = amount / price;
      if (amount <= 0 && qty > 0) amount = qty * price;
      return {
        ticker: r.ticker,
        name: r.name || r.ticker,
        sleeve: r.sleeve || "",
        price,
        qty,
        amount,
        fractional: !!r.fractional || Math.abs(qty - Math.round(qty)) > 1e-6,
        editUnits: false,
        warnLow: amount > 0 && amount < 50,
      };
    }),
    removed: [],
    spendCap,
    requested,
    reserveFloor,
    cappedToDaily: !!plan.capped_to_daily,
    deployedToday: Number(plan.deployed_today) || 0,
    dailyBudget: Number(plan.daily_budget) || 0,
  };
  // Always fit preview lines under deployable max before showing Invest.
  paintPlanEditor({ full: true });
  if (planTotals().over) fitPlanToCap();
  bindBuys();
  bindLive();
  document.getElementById("planBox")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function planQtyStep(line) {
  const px = Number(line.price) || 1;
  if (line.fractional || px >= 5000) return 0.1;
  if (px >= 1000) return 0.5;
  return 1;
}

function planAmtStep(line) {
  const px = Number(line.price) || 100;
  return Math.max(100, Math.round(px * planQtyStep(line)));
}

function planTotals() {
  const plan = window.__activePlan;
  if (!plan) return { total: 0, leftover: 0, over: false, spendCap: 0, requested: 0 };
  const lines = plan.lines || [];
  const total = lines.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const spendCap = Number(plan.spendCap) || 0;
  const requested = Number(plan.requested) || 0;
  const over = spendCap > 0 && total > spendCap + 1;
  const leftover = Math.max(0, (spendCap || requested) - total);
  return { total, leftover, over, spendCap, requested };
}

function syncPlanLine(line, field, rawVal) {
  if (!line) return;
  const price = Math.max(0.0001, Number(line.price) || 1);
  let v = Number(rawVal);
  if (!Number.isFinite(v) || v < 0) v = 0;
  if (field === "qty") {
    line.qty = v;
    line.amount = Math.round(line.qty * price * 100) / 100;
  } else {
    line.amount = Math.round(v * 100) / 100;
    line.qty = line.amount / price;
  }
  line.fractional = Math.abs(line.qty - Math.round(line.qty)) > 1e-6;
  line.warnLow = line.amount > 0 && line.amount < 50;
}

function fitPlanToCap() {
  const plan = window.__activePlan;
  if (!plan?.lines?.length) return false;
  const { total, spendCap } = planTotals();
  if (!(spendCap > 0) || total <= spendCap + 1) return false;
  const scale = spendCap / total;
  plan.lines.forEach((l) => {
    const next = Math.max(0, Math.floor((Number(l.amount) || 0) * scale));
    syncPlanLine(l, "amount", next);
  });
  // Fix rounding drift onto the largest line
  let used = plan.lines.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  let drift = Math.round(spendCap - used);
  if (drift !== 0 && plan.lines.length) {
    const top = [...plan.lines].sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))[0];
    syncPlanLine(top, "amount", Math.max(0, (Number(top.amount) || 0) + drift));
  }
  // Drop sub-₹50 leftovers after scale
  plan.lines = plan.lines.filter((l) => {
    if ((Number(l.amount) || 0) >= 50) return true;
    plan.removed = plan.removed || [];
    plan.removed.push(l);
    return false;
  });
  paintPlanEditor({ full: true });
  return true;
}

function updatePlanFooter() {
  const plan = window.__activePlan;
  const btn = document.getElementById("doInvest");
  const note = document.getElementById("planNote");
  const { total, leftover, over, spendCap } = planTotals();
  const totalEl = document.getElementById("planDeployTotal");
  const metaEl = document.getElementById("planDeployMeta");
  const warnEl = document.getElementById("planOverNote");
  const banner = document.getElementById("planInlineBanner");
  if (totalEl) {
    totalEl.textContent = inr(total);
    totalEl.className = `mono${over ? " plan-total-over" : ""}`;
  }
  if (metaEl) {
    metaEl.textContent = `${leftover >= 1 ? `room ~${inr(leftover)}` : "fully allocated"}${spendCap > 0 ? ` · max ${inr(spendCap)}` : ""}`;
  }
  if (warnEl) {
    warnEl.hidden = !over;
    if (over) {
      warnEl.innerHTML = `Split is <strong>${inr(total)}</strong> but max deployable is <strong>${inr(spendCap)}</strong>. Trim amounts or <button type="button" class="link-btn" id="planFitCapInline">Fit to max</button>.`;
      document.getElementById("planFitCapInline")?.addEventListener("click", (e) => {
        e.preventDefault();
        if (fitPlanToCap()) toast(`Split fitted to ${inr(planTotals().spendCap)}`, true, { skipInbox: true, duration: 2500 });
      });
    }
  }
  if (banner) {
    const reserve = Number(plan?.reserveFloor) || 0;
    if (over) {
      banner.hidden = false;
      banner.className = "plan-inline-banner plan-inline-bad";
      banner.innerHTML = `<strong>Over</strong> · ${inr(total)} &gt; ${inr(spendCap)} <button type="button" class="btn btn-sm btn-primary" id="planFitCapBanner">Fit</button>`;
      document.getElementById("planFitCapBanner")?.addEventListener("click", (e) => {
        e.preventDefault();
        if (fitPlanToCap()) toast(`Split fitted to ${inr(planTotals().spendCap)} — you can Invest now`, true, { skipInbox: true, duration: 2800 });
      });
    } else if (plan?.cappedToDaily) {
      banner.hidden = false;
      banner.className = "plan-inline-banner plan-inline-warn";
      banner.innerHTML = `<strong>Room</strong> · deployed ${inr(plan.deployedToday)} · cap ${inr(spendCap)}`;
    } else if (reserve >= 1) {
      banner.hidden = false;
      banner.className = "plan-inline-banner plan-inline-info";
      banner.innerHTML = `<strong>Reserve</strong> · ${inr(reserve)} kept · max ${inr(spendCap)}`;
    } else {
      banner.hidden = true;
      banner.innerHTML = "";
    }
  }
  const bar = document.querySelector(".plan-alloc-bar i");
  if (bar) {
    const pctFill = spendCap > 0 ? Math.min(100, Math.round((total / spendCap) * 100)) : 0;
    bar.style.width = `${pctFill}%`;
    bar.classList.toggle("over", !!over);
  }
  const chip = document.querySelector(".plan-cap-chip");
  if (chip) {
    chip.innerHTML = `${inr(total)} <span>/ ${inr(spendCap || total)}</span>`;
    chip.classList.toggle("over", !!over);
  }
  const fitBtn = document.getElementById("planFitCap");
  if (fitBtn) fitBtn.hidden = !over;
  const blocked = over || total < 50 || !(plan?.lines?.length);
  if (btn) {
    btn.disabled = blocked;
    btn.textContent = over ? "Fit to max first" : "Invest this split";
  }
  if (note) {
    note.textContent = !plan?.lines?.length
      ? "No names in split — Preview again."
      : over
        ? `Split is above max ${inr(spendCap)} — Fit to max, then Invest.`
        : `Ready to invest ${inr(total)}${spendCap > 0 && Number(plan?.requested) > spendCap + 1 ? ` (asked ${inr(plan.requested)}, max after reserve ${inr(spendCap)})` : ""}.`;
  }
}

function planCardHtml(r) {
  const amt = Math.round(Number(r.amount) || 0);
  return `
    <div class="split-row plan-row${r.warnLow ? " plan-row-warn" : ""}" data-ticker="${esc(r.ticker)}">
      <div class="split-row-id plan-row-id">
        <strong class="mono">${esc(r.ticker)}</strong>
        <span class="split-px mono live-px" data-px="${esc(r.ticker)}">${inr(r.price, 2)}</span>
      </div>
      <label class="split-amt plan-row-amt">
        <span class="plan-rupee">₹</span>
        <input class="plan-amt-input mono" type="number" min="0" step="1" inputmode="numeric"
          data-ticker="${esc(r.ticker)}" data-field="amount" value="${amt}" aria-label="Amount for ${esc(r.ticker)}" />
      </label>
      <span class="split-qty plan-row-approx mono">≈ ${fmtQty(r.qty)}</span>
      <button type="button" class="plan-x" data-ticker="${esc(r.ticker)}" title="Remove" aria-label="Remove ${esc(r.ticker)}">×</button>
    </div>`;
}

function refreshPlanCard(ticker) {
  const plan = window.__activePlan;
  const line = plan?.lines?.find((l) => l.ticker === ticker);
  const card = document.querySelector(`.plan-row[data-ticker="${CSS.escape(ticker)}"]`);
  if (!line || !card) return;
  const amtInput = card.querySelector('input[data-field="amount"]');
  const approx = card.querySelector(".plan-row-approx");
  const focused = document.activeElement;
  if (amtInput && focused !== amtInput) amtInput.value = String(Math.round(Number(line.amount) || 0));
  if (approx) approx.textContent = `≈ ${fmtQty(line.qty)}`;
  card.classList.toggle("plan-row-warn", !!line.warnLow);
  updatePlanFooter();
}

function paintPlanEditor({ full = false } = {}) {
  const box = document.getElementById("planBox");
  const plan = window.__activePlan;
  if (!box || !plan) return;
  if (!full && box.querySelector(".split-panel")) {
    updatePlanFooter();
    return;
  }
  const lines = plan.lines || [];
  const removed = plan.removed || [];
  const { total, leftover, over, spendCap } = planTotals();
  box.dataset.planBound = "0";
  box.innerHTML = `
    <div class="split-panel">
      <div class="split-hd">
        <span class="split-title">Your split</span>
        <span class="plan-cap-chip mono${over ? " over" : ""}">${inr(total)} <span>/ ${inr(spendCap || total)}</span></span>
      </div>
      <div class="plan-inline-banner" id="planInlineBanner" hidden></div>
      ${!lines.length
        ? `<p class="plan-empty-msg">Empty — Preview again.</p>`
        : `<div class="split-rows" id="planCards">${lines.map((r) => planCardHtml(r)).join("")}</div>`}
      <div class="split-tools">
        <button type="button" class="btn btn-sm btn-ghost" id="planEvenSplit">Even</button>
        <button type="button" class="btn btn-sm btn-ghost" id="planRedistribute" ${leftover < 50 ? "disabled" : ""}>Fill</button>
        <button type="button" class="btn btn-sm btn-primary" id="planFitCap" ${over ? "" : "hidden"}>Fit max</button>
        <div class="plan-add-wrap">
          <input type="search" class="plan-add-input" id="planAddSearch" placeholder="Add…" autocomplete="off" />
          <div class="plan-add-results" id="planAddResults" hidden></div>
        </div>
      </div>
      ${removed.length ? `<div class="plan-removed-chips">${removed.map((r) => `
        <button type="button" class="plan-chip-restore" data-restore="${esc(r.ticker)}">${esc(r.ticker)}</button>`).join("")}</div>` : ""}
      <div class="split-foot">
        <strong id="planDeployTotal" class="mono ${over ? "plan-total-over" : ""}">${inr(total)}</strong>
        <span class="tiny" id="planDeployMeta">${spendCap > 0 ? `max ${inr(spendCap)}` : "ready"}</span>
        <p class="plan-over-note" id="planOverNote" ${over ? "" : "hidden"}></p>
      </div>
    </div>`;
  updatePlanFooter();
  bindPlanEditor();
}

function addTickerToPlan(row) {
  const plan = window.__activePlan;
  if (!plan) {
    toast("Run Preview split first, then add names.", "warn", { href: "#/trade" });
    return;
  }
  const ticker = String(row.ticker || "").toUpperCase();
  if (!ticker) return;
  if (plan.lines.some((l) => l.ticker === ticker)) {
    toast(`${ticker} is already in the split`, "warn", { skipInbox: true, duration: 2500 });
    return;
  }
  const removedIdx = (plan.removed || []).findIndex((l) => l.ticker === ticker);
  let line;
  if (removedIdx >= 0) {
    line = plan.removed.splice(removedIdx, 1)[0];
  } else {
    const price = Math.max(0.0001, Number(row.price) || 100);
    const { leftover } = planTotals();
    const amount = Math.max(0, Math.min(Math.round(leftover || 0) || 500, Math.round(Number(plan.spendCap) || leftover || 1000)));
    line = {
      ticker,
      name: row.name || ticker,
      sleeve: row.sleeve || "",
      price,
      amount,
      qty: amount / price,
      fractional: true,
      editUnits: false,
      warnLow: amount > 0 && amount < 50,
    };
  }
  plan.lines.push(line);
  paintPlanEditor({ full: true });
  toast(`Added ${ticker} to split`, true, { skipInbox: true, duration: 2500 });
}

function bindPlanEditor() {
  const plan = window.__activePlan;
  if (!plan) return;
  const box = document.getElementById("planBox");
  if (!box) return;
  box.dataset.planBound = "1";
  const findLine = (ticker) => plan.lines.find((l) => l.ticker === ticker);

  box.querySelectorAll(".plan-step").forEach((btn) => {
    btn.onclick = (ev) => {
      ev.preventDefault();
      const ticker = btn.dataset.ticker;
      const field = btn.dataset.field;
      const dir = Number(btn.dataset.dir) || 0;
      const line = findLine(ticker);
      if (!line) return;
      if (field === "qty") syncPlanLine(line, "qty", Math.max(0, (Number(line.qty) || 0) + dir * planQtyStep(line)));
      else syncPlanLine(line, "amount", Math.max(0, (Number(line.amount) || 0) + dir * planAmtStep(line)));
      refreshPlanCard(ticker);
    };
  });

  box.querySelectorAll(".plan-amt-input").forEach((input) => {
    input.oninput = () => {
      const ticker = input.dataset.ticker;
      const field = input.dataset.field;
      const line = findLine(ticker);
      if (!line) return;
      syncPlanLine(line, field, input.value);
      if (field === "amount") {
        const uv = document.querySelector(`.plan-row[data-ticker="${CSS.escape(ticker)}"] .plan-units-val`);
        if (uv) uv.textContent = fmtQty(line.qty);
      } else {
        const amt = document.querySelector(`.plan-row[data-ticker="${CSS.escape(ticker)}"] input[data-field="amount"]`);
        if (amt && document.activeElement !== amt) amt.value = String(Math.round(line.amount));
        const uv = document.querySelector(`.plan-row[data-ticker="${CSS.escape(ticker)}"] .plan-units-val`);
        if (uv) uv.textContent = fmtQty(line.qty);
      }
      updatePlanFooter();
    };
  });

  box.querySelectorAll(".plan-toggle-units").forEach((btn) => {
    btn.onclick = (ev) => {
      ev.preventDefault();
      const ticker = btn.dataset.ticker;
      const line = findLine(ticker);
      if (!line) return;
      line.editUnits = !line.editUnits;
      const edit = box.querySelector(`.plan-units-edit[data-ticker="${CSS.escape(ticker)}"]`);
      if (edit) edit.hidden = !line.editUnits;
      btn.textContent = line.editUnits ? "Hide units" : "Edit units";
    };
  });

  box.querySelectorAll(".plan-remove, .plan-x").forEach((btn) => {
    btn.onclick = (ev) => {
      ev.preventDefault();
      const ticker = btn.dataset.ticker;
      const idx = plan.lines.findIndex((l) => l.ticker === ticker);
      if (idx < 0) return;
      const gone = plan.lines.splice(idx, 1)[0];
      plan.removed = plan.removed || [];
      plan.removed.push(gone);
      toast(`Removed ${ticker} — restore from chips below`, "warn", { skipInbox: true, duration: 3000 });
      paintPlanEditor({ full: true });
    };
  });

  box.querySelectorAll(".plan-chip-restore").forEach((btn) => {
    btn.onclick = (ev) => {
      ev.preventDefault();
      addTickerToPlan({ ticker: btn.dataset.restore });
    };
  });

  document.getElementById("planEvenSplit")?.addEventListener("click", (ev) => {
    ev.preventDefault();
    const n = plan.lines.length;
    if (!n) return;
    const budget = Math.max(plan.spendCap || plan.requested || 0, 0);
    if (budget < 50) return;
    const each = Math.floor(budget / n);
    plan.lines.forEach((l) => syncPlanLine(l, "amount", each));
    const used = plan.lines.reduce((s, l) => s + l.amount, 0);
    if (plan.lines[0] && budget - used >= 1) syncPlanLine(plan.lines[0], "amount", plan.lines[0].amount + (budget - used));
    paintPlanEditor({ full: true });
  });

  document.getElementById("planRedistribute")?.addEventListener("click", (ev) => {
    ev.preventDefault();
    const { leftover } = planTotals();
    const n = plan.lines.length;
    if (!n || leftover < 50) return;
    const each = Math.floor(leftover / n);
    let left = leftover;
    plan.lines.forEach((l, i) => {
      const take = i === n - 1 ? left : each;
      syncPlanLine(l, "amount", (Number(l.amount) || 0) + take);
      left -= take;
    });
    paintPlanEditor({ full: true });
  });

  document.getElementById("planFitCap")?.addEventListener("click", (ev) => {
    ev.preventDefault();
    if (fitPlanToCap()) toast(`Split fitted to max ${inr(planTotals().spendCap)}`, true, { skipInbox: true, duration: 2500 });
  });

  const search = document.getElementById("planAddSearch");
  const results = document.getElementById("planAddResults");
  let searchTimer = null;
  search?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    const q = search.value.trim();
    if (q.length < 1) { if (results) { results.hidden = true; results.innerHTML = ""; } return; }
    searchTimer = setTimeout(async () => {
      try {
        const res = await api(`/api/search?q=${encodeURIComponent(q)}`);
        const rows = (res.results || []).slice(0, 6);
        if (!results) return;
        if (!rows.length) { results.hidden = true; results.innerHTML = ""; return; }
        results.hidden = false;
        results.innerHTML = rows.map((r) => `
          <button type="button" class="plan-add-hit" data-ticker="${esc(r.ticker)}" data-name="${esc(r.name || "")}" data-sleeve="${esc(r.sleeve || "")}">
            <strong class="mono">${esc(r.ticker)}</strong> <span>${esc(r.name || "")}</span>
          </button>`).join("");
        results.querySelectorAll(".plan-add-hit").forEach((hit) => {
          hit.onclick = () => {
            const pxEl = document.querySelector(`[data-px="${hit.dataset.ticker}"]`);
            let price = 0;
            if (pxEl) price = Number(String(pxEl.textContent || "").replace(/[^\d.]/g, "")) || 0;
            addTickerToPlan({ ticker: hit.dataset.ticker, name: hit.dataset.name, sleeve: hit.dataset.sleeve, price });
            search.value = "";
            results.hidden = true;
          };
        });
      } catch { /* ignore */ }
    }, 200);
  });

  document.getElementById("planInvestBtn")?.addEventListener("click", () => {
    document.getElementById("doInvest")?.click();
  });
}

function bindTradePresets(cash, remainDeploy = 10000, dailyTarget = 10000) {
  const amt = document.getElementById("amt");
  const remain = Math.max(0, Number(remainDeploy) || 0);
  const cap = Math.max(remain, 1);
  document.querySelectorAll(".amt-preset").forEach((btn) => {
    btn.addEventListener("click", () => {
      const v = Number(btn.dataset.amt) || 0;
      if (amt) amt.value = String(Math.max(1, Math.min(Math.round(v), cap)));
    });
  });
  if (amt) {
    amt.addEventListener("input", () => {
      const v = Number(amt.value) || 0;
      if (remain > 0 && v > remain + 0.5) {
        amt.setCustomValidity(`Daily room left is only ₹${Math.round(remain)} (not another full ₹${Math.round(dailyTarget)})`);
      } else {
        amt.setCustomValidity("");
      }
    });
  }
}

function bindInvest() {
  const amt = document.getElementById("amt");
  const showPlan = document.getElementById("showPlan");
  const doInvest = document.getElementById("doInvest");
  const remainCap = Math.max(0, Number(amt?.dataset?.remain) || 0);
  const maxDeployCap = Math.max(0, Number(amt?.dataset?.maxDeploy) || 0);
  const dailyCap = Math.max(0, Number(amt?.dataset?.daily) || 10000);
  const usedCap = Math.max(0, Number(amt?.dataset?.used) || 0);
  const hardCap = maxDeployCap > 0 ? Math.min(maxDeployCap, remainCap || maxDeployCap) : remainCap;

  const runPreview = async ({ quiet = false } = {}) => {
    let amount = Number(amt?.value || 0);
    if (amount <= 0) return;
    if (hardCap > 0 && amount > hardCap + 0.5) {
      if (!quiet) {
        const reserveClip = maxDeployCap > 0 && maxDeployCap + 0.5 < remainCap;
        toast(
          reserveClip
            ? `Max safe after 5% reserve is ${inr(maxDeployCap)} (daily room ${inr(remainCap)}). Capping preview to Max safe.`
            : `Daily room left is only ${inr(remainCap)} (already deployed ${inr(usedCap)} of ${inr(dailyCap)}). Capping preview to remaining.`,
          "warn",
          {
            id: "preview-deploy-cap",
            title: reserveClip ? "Over max deployable" : "Not another full daily amount",
            href: "#/trade",
            duration: 7000,
          }
        );
      }
      amount = hardCap;
      if (amt) amt.value = String(Math.round(hardCap));
    }
    mem.set("investAmt", String(amount));
    if (doInvest) doInvest.disabled = true;
    const note = document.getElementById("planNote");
    if (note) note.textContent = "Building split for Max safe…";
    window.__suppressPlanToast = !!quiet;
    try {
      const plan = await api("/api/plan", { method: "POST", body: JSON.stringify({ amount }) });
      renderPlan(plan);
    } catch (e) {
      const msg = String(e.message || "Preview failed");
      const offline = /unreachable|failed to fetch|network/i.test(msg);
      toast(msg, false, {
        title: offline ? "Server offline" : "Invest preview blocked",
        href: "#/trade",
        duration: offline ? 12000 : 8000,
      });
      if (note) note.textContent = offline
        ? "Server offline — start the desk with .\\run.ps1, then Preview again."
        : "Preview failed — check rules/pause, then try again.";
      if (doInvest) doInvest.disabled = true;
    } finally {
      window.__suppressPlanToast = false;
    }
  };

  showPlan?.addEventListener("click", async () => { await runPreview({ quiet: false }); });
  doInvest?.addEventListener("click", async () => {
    const amount = Number(amt?.value || 0); if (amount <= 0 || busy) return;
    // Safety: never invest without a previewed plan on screen
    if (doInvest.disabled) {
      toast("Wait for Preview to finish — Invest now unlocks when the split is ready.", "warn", { skipInbox: true });
      return;
    }
    // Quietly fit under max deployable so one click can complete invest.
    if (planTotals().over) fitPlanToCap();
    const edited = window.__activePlan;
    const tickets = (edited?.lines || [])
      .map((r) => ({ ticker: r.ticker, amount: Math.round(Number(r.amount) || 0) }))
      .filter((r) => r.ticker && r.amount >= 50);
    if (!tickets.length) {
      toast("No names left in the split — adjust units or re-run Preview.", "warn", { href: "#/trade", skipInbox: true });
      return;
    }
    const deployTotal = tickets.reduce((s, r) => s + r.amount, 0);
    const { over, spendCap, total } = planTotals();
    if (over) {
      toast(
        `Split is ${inr(total)} but max deployable is ${inr(spendCap)}. Tap Fit to max, then Invest again.`,
        false,
        {
          title: "Over max deployable",
          href: "#/trade",
          duration: 10000,
          skipInbox: true,
          actions: [{
            label: "Fit to max",
            primary: true,
            onClick: () => {
              if (fitPlanToCap()) toast(`Fitted to ${inr(planTotals().spendCap)} — tap Invest`, true, { skipInbox: true });
            },
          }],
        }
      );
      return;
    }
    busy = true;
    doInvest.disabled = true;
    try {
      // Fund with the previewed amount so reserve math matches Preview (not ticket sum alone).
      const fundAmount = Math.max(amount, deployTotal, Number(edited?.requested) || 0);
      const res = await api("/api/invest", {
        method: "POST",
        body: JSON.stringify({ amount: fundAmount, tickets }),
      });
      const deployed = Number(res.deployed) || 0;
      const leftover = Number(res.leftover) || 0;
      if (res.capped_to_daily) {
        toast(
          `Daily ceiling applied — only ${inr(deployed)} more deployed today (not another full ${inr(res.daily_budget || dailyCap)}).`,
          "warn",
          { title: "Daily budget capped", href: "#/portfolio", duration: 8000, skipInbox: true }
        );
      } else if (res.edited) {
        toast(`Invested ${inr(deployed)} across your edited split (${tickets.length} name${tickets.length > 1 ? "s" : ""}).`, true, {
          title: "Invested",
          href: "#/portfolio",
          skipInbox: true,
        });
      } else if (leftover >= 1) {
        toast(`Invested ${inr(deployed)} — ${inr(leftover)} kept as cash per desk rules.`, "warn", {
          title: "Invested with reserve",
          href: "#/portfolio",
          skipInbox: true,
        });
      } else {
        toast(`Invested ${inr(deployed)}`, true, { title: "Invested", href: "#/portfolio", skipInbox: true });
      }
      window.__activePlan = null;
      await render();
    } catch (e) {
      const msg = String(e.message || "Invest blocked by desk rules");
      const reserveBlock = /max deployable|reserve|deployable/i.test(msg);
      toast(msg, false, {
        title: reserveBlock ? "Over max deployable" : "Invest blocked",
        href: "#/trade",
        duration: 10000,
        skipInbox: true,
        actions: reserveBlock ? [{
          label: "Fit to max & retry",
          primary: true,
          onClick: async () => {
            if (fitPlanToCap()) {
              toast(`Fitted — investing…`, true, { skipInbox: true, duration: 2000 });
              document.getElementById("doInvest")?.click();
            }
          },
        }] : undefined,
      });
      doInvest.disabled = false;
    } finally {
      busy = false;
    }
  });

  // Amount defaults to investable max — auto-preview only when something can actually fill.
  if (Number(amt?.value || 0) > 0 && maxDeployCap >= 50 && !(remainCap < 50 && usedCap > 0)) {
    setTimeout(() => { runPreview({ quiet: true }); }, 0);
  }

  // Re-lock Invest now if user edits the amount until they preview again.
  amt?.addEventListener("input", () => {
    if (doInvest) doInvest.disabled = true;
    window.__activePlan = null;
    const note = document.getElementById("planNote");
    const v = Number(amt.value) || 0;
    if (hardCap > 0 && v > hardCap + 0.5) {
      const reserveClip = maxDeployCap > 0 && maxDeployCap + 0.5 < remainCap;
      if (note) {
        note.textContent = reserveClip
          ? `Max safe after reserve is ${inr(maxDeployCap)} (daily room ${inr(remainCap)}). Cap the amount or tap Max safe.`
          : `Daily room left is only ${inr(remainCap)} — not another full ${inr(dailyCap)}. Cap the amount or tap Preview.`;
      }
    } else if (note) {
      note.textContent = "Amount changed — tap Preview split (or wait) before Invest now.";
    }
  });
}

function bindResumeBuying() {
  const btn = document.getElementById("resumeBuying");
  if (!btn || btn.dataset.bound === "1") return;
  btn.dataset.bound = "1";
  btn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    if (busy) return;
    busy = true;
    btn.disabled = true;
    try {
      const res = await api("/api/rules/resume-buying", { method: "POST", body: "{}" });
      if (res.paused) {
        toast("Resume failed — pause is still active. Try again after refresh.", false);
      } else {
        toast("Buying resumed — Invest is unlocked");
      }
      await render();
    } catch (e) {
      toast(e.message || "Could not resume buying", false);
      btn.disabled = false;
    } finally {
      busy = false;
    }
  });
}

function bindPendingActions() {
  document.querySelectorAll("[data-approve]").forEach((btn) => {
    btn.onclick = async () => {
      if (busy) return;
      busy = true;
      try {
        const res = await api("/api/rules/pending/approve", { method: "POST", body: JSON.stringify({ id: btn.getAttribute("data-approve") }) });
        toast(`Sold ${res.ticker} · ${fmtQty(res.qty)} @ ${inr(res.price, 2)}`);
        await render();
      } catch (e) { toast(e.message, false); } finally { busy = false; }
    };
  });
  document.querySelectorAll("[data-reject]").forEach((btn) => {
    btn.onclick = async () => {
      if (busy) return;
      busy = true;
      try {
        const res = await api("/api/rules/pending/reject", { method: "POST", body: JSON.stringify({ id: btn.getAttribute("data-reject") }) });
        toast(`Kept ${res.ticker} — sell dismissed for today`);
        await render();
      } catch (e) { toast(e.message, false); } finally { busy = false; }
    };
  });
}

function bindResearchSearch() {
  const chips = document.getElementById("pickChips");
  const runBtn = document.getElementById("runResearch");
  const renderChips = () => {
    if (!chips) return;
    chips.innerHTML = researchPicks.map((t) => `
      <span class="pick-chip">${esc(t)}<button type="button" data-rm="${esc(t)}">×</button></span>`).join("");
    chips.querySelectorAll("[data-rm]").forEach((b) => b.addEventListener("click", () => {
      researchPicks = researchPicks.filter((x) => x !== b.dataset.rm);
      mem.set("researchPicks", researchPicks); renderChips();
    }));
  };
  renderChips();

  const addTicker = (t) => {
    t = String(t || "").trim().toUpperCase();
    if (!t || researchPicks.includes(t)) return;
    if (researchPicks.length >= 24) { toast("Max 24 companies in one compare", false); return; }
    researchPicks.push(t); mem.set("researchPicks", researchPicks); renderChips();
  };

  bindSearchBox({ inputId: "q", boxId: "suggestBox", onPick: addTicker });
  bindPopularBar("researchPopular", addTicker);

  runBtn?.addEventListener("click", () => {
    if (!researchPicks.length) { toast("Add at least one company", false); return; }
    location.hash = `#/research/${researchPicks.join(",")}`;
  });
}

async function pageResearch(tickers) {
  const picks = tickers.length ? tickers : researchPicks;
  const desk = await api("/api/today");
  const canBuy = !desk.readonly && !!desk.can_trade;
  let results = [], err = "";
  if (picks.length === 1) {
    try { results = [await api(`/api/research/${picks[0]}`)]; } catch { err = `${picks[0]} not in universe.`; }
  } else if (picks.length > 1) {
    try {
      const batch = await api(`/api/research/compare?tickers=${encodeURIComponent(picks.join(","))}`);
      results = batch.results || [];
    } catch (e) { err = e.message; }
  }
  const pauseNote = desk.paused
    ? `<div class="alert">Buying paused until ${esc(fmtDate(desk.pause_until) || "—")}. <a href="#/trade">Resume buying on Trade</a> to unlock Invest.</div>`
    : "";

  return {
    html: `
      <div class="page-shell page-research">
        ${pageHero("Research", "One name, four agents — score, thesis, then invest if it clears the desk.")}
        ${pauseNote}
        <div class="rx-search panel">
          <div class="panel-bd">
            <div class="search-row">
              <div class="search-block">
                <div class="search-wrap">
                  <input class="search" id="q" placeholder="Search — TCS, Reliance, AAPL, Gold…" autocomplete="off" />
                  <div class="suggest" id="suggestBox" hidden></div>
                </div>
                <span class="search-hint">Add up to 24 names, then run. Open one for a full report.</span>
              </div>
              <button class="btn btn-primary" id="runResearch">Run research</button>
            </div>
            <div id="researchPopular"></div>
            <div class="pick-chips" id="pickChips"></div>
          </div>
        </div>
        ${err ? `<div class="alert">${esc(err)}</div>` : ""}
        ${results.length >= 2 ? comparisonTable(results) : ""}
        ${!results.length
          ? `<div class="rx-empty"><p>Pick a company above to see the agent desk.</p></div>`
          : results.map((r) => researchReport(r, { canBuy })).join("")}
      </div>`,
    meta: desk,
    after: () => { bindResearchSearch(); if (canBuy) bindBuys(); },
  };
}

function dangerZone() {
  return `
    <div class="panel danger-zone">
      <div class="panel-hd"><span class="panel-title">Danger zone</span></div>
      <div class="panel-bd danger-zone-bd">
        <div>
          <strong>Reset book</strong>
          <p class="tiny">Clears all positions and session history. Use only for a fresh demo start.</p>
        </div>
        <button class="btn btn-sm btn-danger" id="reset" type="button">Reset entire book</button>
      </div>
    </div>`;
}

async function pagePortfolio() {
  const d = await api("/api/portfolio");
  const days = d.pnl_days || [], p = d.pack || {};
  const canTrade = !d.readonly && !!d.can_trade;
  const meta = {
    ...d,
    pnl: p,
    portfolio: p.book ?? d.portfolio,
    cash: d.cash,
    savings: d.savings,
    contributed: p.contributed ?? d.contributed,
    n_holdings: d.holdings?.length,
  };
  const toDefault = d.calendar_date || d.session_date || "";
  const fromDefault = days.length ? days[Math.max(0, days.length - 7)].date : toDefault;
  return {
    html: `
      <div class="page-shell page-portfolio">
        ${pageHero("Portfolio", "Capital, open positions, day ledger, and date-range review. Use Desk report for your boss.")}
        ${reportActions()}
        <div class="pnl-portfolio-wrap">${moneySummary(meta, { editBook: !d.readonly })}</div>
        ${holdingsSections(d, { buy: canTrade, sell: canTrade, compact: false })}
        ${historyRangePanel(fromDefault, toDefault)}
        ${historyPanel(days)}
        ${!d.readonly ? dangerZone() : ""}
      </div>`,
    meta,
    after: () => {
      bindReportActions();
      bindHoldingsTools();
      bindHistoryRange();
      bindHistoryTools();
      if (!d.readonly) { bindBuys(); bindSells(); bindBookEdit(); }
      setTimeout(() => focusHoldingsTicker(), 60);
    },
  };
}

function historyRangePanel(fromDefault = "", toDefault = "") {
  return `
    <div class="panel range-panel range-panel-clean" id="historyRangePanel">
      <div class="panel-hd panel-hd-split">
        <div class="panel-title-wrap">
          <span class="panel-title">Period review</span>
        </div>
        <a class="btn btn-sm btn-ghost" href="#/backtest">Paper backtest</a>
      </div>
      <div class="panel-bd">
        <div class="range-controls range-controls-clean">
          <label class="tbl-field"><span>From</span><input type="date" id="rangeFrom" value="${esc(fromDefault)}" /></label>
          <span class="range-arrow" aria-hidden="true">→</span>
          <label class="tbl-field"><span>To</span><input type="date" id="rangeTo" value="${esc(toDefault)}" /></label>
          <button type="button" class="btn btn-primary" id="rangeApply">Show period</button>
        </div>
        <div id="rangeResults" class="range-results">
          <p class="range-empty">Pick From → To, then Show period.</p>
        </div>
      </div>
    </div>`;
}

function bindHistoryRange() {
  document.getElementById("rangeApply")?.addEventListener("click", async () => {
    const from = document.getElementById("rangeFrom")?.value;
    const to = document.getElementById("rangeTo")?.value;
    const host = document.getElementById("rangeResults");
    if (!from || !to || !host) return;
    host.innerHTML = `<p class="range-empty">Loading period…</p>`;
    try {
      const res = await api(`/api/history/range?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      const days = res.days || [];
      const trades = res.trades || [];
      const delta = (Number(res.wealth_end) || 0) - (Number(res.wealth_start) || 0);
      host.innerHTML = `
        <div class="range-kpis range-kpis-clean">
          <div><span>Sessions</span><strong class="mono">${res.sessions || 0}</strong></div>
          <div><span>Period P/L</span><strong class="mono ${tone(res.sum_pnl)}">${signed(res.sum_pnl)}</strong></div>
          <div><span>Wealth Δ</span><strong class="mono ${tone(delta)}">${signed(delta)}</strong></div>
          <div><span>Start → End</span><strong class="mono">${inr(res.wealth_start)} → ${inr(res.wealth_end)}</strong></div>
        </div>
        ${days.length >= 2 ? wealthCurveSvg(days.map((d) => ({ ...d, buy_count: 0, sell_count: 0 })), Number(res.wealth_start) || 0) : `<p class="tiny muted">Need 2+ sessions for a curve.</p>`}
        <div class="range-tabs" data-range-tabs>
          <button type="button" class="range-tab on" data-tab="trades">Trades (${trades.length})</button>
          <button type="button" class="range-tab" data-tab="sessions">Sessions (${days.length})</button>
        </div>
        <div class="range-tab-pane" data-pane="trades">
          <div class="table-wrap">
            <table class="tbl tbl-premium">
              <thead><tr><th>Date</th><th>Side</th><th>Ticker</th><th class="r">Amount</th><th class="r">P/L</th></tr></thead>
              <tbody>${trades.length ? trades.slice(0, 50).map((t) => `
                <tr><td>${esc(fmtDate(t.date))}</td><td class="mono">${esc(t.side)}</td><td class="mono">${esc(t.ticker)}</td>
                <td class="r mono">${inr(t.amount)}</td><td class="r mono ${tone(t.pnl)}">${signed(t.pnl)}</td></tr>`).join("") : `<tr><td colspan="5" class="muted">No trades in this window</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>
        <div class="range-tab-pane" data-pane="sessions" hidden>
          <div class="table-wrap">
            <table class="tbl tbl-premium">
              <thead><tr><th>Date</th><th class="r">Wealth</th><th class="r">Book</th><th class="r">P/L</th></tr></thead>
              <tbody>${days.length ? days.map((d) => `
                <tr><td>${esc(fmtDate(d.date))}</td><td class="r mono">${inr(d.wealth)}</td>
                <td class="r mono">${inr(d.book)}</td><td class="r mono ${tone(d.pnl)}">${signed(d.pnl)}</td></tr>`).join("") : `<tr><td colspan="4" class="muted">No sessions</td></tr>`}
              </tbody>
            </table>
          </div>
        </div>`;
      host.querySelectorAll("[data-tab]").forEach((btn) => {
        btn.onclick = () => {
          host.querySelectorAll("[data-tab]").forEach((b) => b.classList.remove("on"));
          btn.classList.add("on");
          const tab = btn.dataset.tab;
          host.querySelectorAll("[data-pane]").forEach((p) => { p.hidden = p.dataset.pane !== tab; });
        };
      });
      bindAnalyticsHover();
    } catch (e) {
      host.innerHTML = `<p class="range-empty" style="color:var(--loss)">${esc(e.message || "Range failed")}</p>`;
    }
  });
}

async function pageBacktest() {
  const d = await api("/api/today");
  let activeName = d.strategy_name || "";
  try {
    const cat = await api("/api/strategies");
    d.strategies = cat.strategies || [];
    d.strategy = cat.active || d.strategy;
    d.strategy_name = cat.active_name || d.strategy_name;
    d.strategy_mindset = cat.active_mindset || d.strategy_mindset;
    activeName = cat.active_name || activeName;
    syncLiveStrategyFromCatalog(cat);
  } catch { d.strategies = d.strategies || []; }
  const toDefault = d.calendar_date || d.session_date || "";
  let fromDefault = toDefault;
  try {
    const dt = new Date(`${toDefault}T12:00:00`);
    dt.setDate(dt.getDate() - 21);
    fromDefault = dt.toISOString().slice(0, 10);
  } catch { /* */ }
  return {
    html: `
      <div class="page-shell page-backtest">
        ${pageHero("Backtest", "Paper-compare methods on the same dates. Live book never changes.")}
        ${d.readonly ? "" : strategyPickerPanel(d, { variant: "backtest" })}
        <div class="panel bt-panel">
          <div class="panel-bd">
            <div class="bt-controls">
              <label class="tbl-field"><span>From</span><input type="date" id="btFrom" value="${esc(fromDefault)}" /></label>
              <label class="tbl-field"><span>To</span><input type="date" id="btTo" value="${esc(toDefault)}" /></label>
              <label class="tbl-field"><span>Start cash</span><input type="number" id="btCash" min="1000" step="1000" value="10000" /></label>
              <div class="bt-actions">
                <button type="button" class="btn btn-primary" id="btCompare">Compare all 5</button>
                <button type="button" class="btn btn-ghost" id="btRun">Run ${esc(activeName || "current")}</button>
              </div>
            </div>
            <p class="tiny muted bt-hint">Compare is paper-only. Tap <strong>Use for Trade</strong> on a row to save that method — same as the dropdown above.</p>
            <div id="btResults" class="bt-results"><p class="tiny muted">Choose dates (max ~90 sessions) and compare.</p></div>
          </div>
        </div>
      </div>`,
    meta: d,
    after: () => { bindBacktest(); },
  };
}

function paintBacktestSingle(res) {
  const days = res.days || [];
  const trades = res.trades || [];
  const live = liveStrategyId();
  const isLive = res.strategy === live;
  return `
    <p class="tiny" style="margin:0 0 12px">${esc(res.note || "Paper run")} · <strong>${esc(res.strategy_name || res.strategy || "")}</strong>${isLive ? ` · <span class="strat-live-tag">Live on Trade ✓</span>` : ""}</p>
    <div class="range-kpis">
      <div><span>Sessions</span><strong class="mono">${res.sessions || 0}</strong></div>
      <div><span>Fills</span><strong class="mono">${res.n_fills || 0}</strong></div>
      <div><span>Overall</span><strong class="mono ${tone(res.overall)}">${signed(res.overall)}</strong></div>
      <div><span>Return</span><strong class="mono ${tone(res.return_pct)}">${Number(res.return_pct || 0).toFixed(1)}%</strong></div>
      <div><span>End wealth</span><strong class="mono">${inr(res.ending_wealth)}</strong></div>
      <div><span>Open names</span><strong class="mono">${res.n_holdings || 0}</strong></div>
    </div>
    ${days.length >= 2 ? wealthCurveSvg(days, Number(res.starting_cash) || 0) : ""}
    <div class="table-wrap" style="margin-top:14px">
      <table class="tbl tbl-premium">
        <thead><tr><th>Date</th><th>Ticker</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Amount</th></tr></thead>
        <tbody>${trades.length ? trades.slice(0, 60).map((t) => `
          <tr><td>${esc(fmtDate(t.date))}</td><td class="mono">${esc(t.ticker)}</td>
          <td class="r mono">${fmtQty(t.qty)}</td><td class="r mono">${inr(t.price, 2)}</td><td class="r mono">${inr(t.amount)}</td></tr>`).join("") : `<tr><td colspan="5" class="muted">No fills</td></tr>`}
        </tbody>
      </table>
    </div>`;
}

function paintBacktestCompare(res) {
  const rows = res.results || [];
  const win = res.winner;
  const live = liveStrategyId();
  const winnerBanner = win
    ? `<div class="algo-winner">
        <div>Winner on this window: <strong>${esc(win.strategy_name)}</strong> · Overall <span class="mono ${tone(win.overall)}">${signed(win.overall)}</span> (${Number(win.return_pct || 0).toFixed(1)}%)</div>
        <button type="button" class="btn btn-sm btn-primary strat-use-btn" data-strategy="${esc(win.strategy)}">${win.strategy === live ? "Live on Trade ✓" : `Use ${esc(win.strategy_name)} for Trade`}</button>
      </div>`
    : "";
  const table = `
    <div class="table-wrap" style="margin-top:12px">
      <table class="tbl tbl-premium algo-compare-tbl">
        <thead><tr>
          <th>#</th><th>Algorithm</th><th class="r">Overall</th><th class="r">Return</th>
          <th class="r">End wealth</th><th class="r">Fills</th><th class="r">Names</th><th></th>
        </tr></thead>
        <tbody>${rows.map((r) => {
          const isLive = r.strategy === live;
          return `
          <tr class="${r.rank === 1 ? "is-winner" : ""}${isLive ? " is-live-trade" : ""}" data-strategy-id="${esc(r.strategy)}">
            <td class="mono">${r.rank}</td>
            <td><strong>${esc(r.strategy_name)}</strong>${isLive ? ` <span class="strat-live-tag">Live on Trade</span>` : ""}<div class="tiny muted">${esc(r.strategy_blurb || r.strategy)}</div></td>
            <td class="r mono ${tone(r.overall)}">${signed(r.overall)}</td>
            <td class="r mono ${tone(r.return_pct)}">${Number(r.return_pct || 0).toFixed(1)}%</td>
            <td class="r mono">${inr(r.ending_wealth)}</td>
            <td class="r mono">${r.n_fills || 0}</td>
            <td class="r mono">${r.n_holdings || 0}</td>
            <td class="r"><button type="button" class="btn btn-sm strat-use-btn ${isLive ? "is-live" : r.rank === 1 ? "btn-primary" : "btn-ghost"}" data-strategy="${esc(r.strategy)}" ${isLive ? "disabled" : ""}>${isLive ? "Live on Trade ✓" : "Use for Trade"}</button></td>
          </tr>`;
        }).join("") || `<tr><td colspan="8" class="muted">No results</td></tr>`}
        </tbody>
      </table>
    </div>`;
  const champ = rows[0];
  const curve = champ?.days?.length >= 2 ? wealthCurveSvg(champ.days, Number(res.starting_cash) || 0) : "";
  const errs = (res.errors || []).length
    ? `<p class="tiny" style="color:var(--loss)">${(res.errors || []).map((e) => esc(`${e.strategy}: ${e.error}`)).join(" · ")}</p>`
    : "";
  return `
    <p class="tiny" style="margin:0 0 10px">${esc(res.note || "")} Your saved method is highlighted. <strong>Use for Trade</strong> saves to your book — then open <a href="#/trade">Trade</a>.</p>
    ${winnerBanner}
    ${table}
    ${champ ? `<h3 class="algo-champ-hd">Champion curve · ${esc(champ.strategy_name)}</h3>${curve}` : ""}
    ${errs}`;
}

function bindBacktest() {
  const run = async (mode) => {
    const start = document.getElementById("btFrom")?.value;
    const end = document.getElementById("btTo")?.value;
    const cash = Number(document.getElementById("btCash")?.value) || 10000;
    const host = document.getElementById("btResults");
    if (!start || !end || !host) return;
    host.innerHTML = `<p class="tiny muted">${mode === "compare" ? "Running all 5 algorithms in parallel…" : "Running paper backtest…"}</p>`;
    try {
      const path = mode === "compare" ? "/api/backtest/compare" : "/api/backtest";
      const res = await api(path, {
        method: "POST",
        body: JSON.stringify({ start, end, starting_cash: cash }),
      });
      host.innerHTML = mode === "compare" ? paintBacktestCompare(res) : paintBacktestSingle(res);
      bindAnalyticsHover();
      bindStrategyPicker();
      refreshLiveStrategyUi();
    } catch (e) {
      host.innerHTML = `<p class="tiny" style="color:var(--loss)">${esc(e.message || "Backtest failed")}</p>`;
    }
  };
  document.getElementById("btCompare")?.addEventListener("click", () => run("compare"));
  document.getElementById("btRun")?.addEventListener("click", () => run("single"));
}

function normalizeMeta(meta, page) {
  const m = { ...meta };
  if (m.strategy || m.strategy_name) {
    window.__liveStrategy = {
      id: m.strategy || window.__liveStrategy?.id,
      name: m.strategy_name || window.__liveStrategy?.name,
      mindset: m.strategy_mindset || window.__liveStrategy?.mindset,
    };
  }
  const p = m.pnl || {};
  m.portfolio = p.book ?? m.portfolio ?? Math.max((Number(m.mtm) || 0) - (Number(m.cash) || 0), 0);
  m.n_holdings = m.n_holdings ?? m.holdings?.length ?? 0;
  if (m.pnl) {
    const book = Number(p.book ?? m.portfolio) || 0;
    const cash = Number(p.cash ?? m.cash) || 0;
    const savings = Number(p.savings ?? m.savings) || 0;
    const wealth = Number(p.wealth) || (book + cash + savings);
    const contributed = Number(p.contributed ?? m.contributed) || 0;
    m.pnl = {
      ...p,
      book,
      cash,
      savings,
      wealth,
      contributed,
      overall: p.overall != null ? Number(p.overall) || 0 : (wealth - contributed),
    };
  }
  return m;
}

async function render() {
  const app = document.getElementById("app");
  const { page, tickers } = route();

  if (page === "login" || page === "signup") {
    if (authToken()) { location.hash = "#/"; return; }
    app.innerHTML = page === "login" ? pageLogin() : pageSignup();
    bindAuthForms();
    return;
  }

  if (!authToken()) {
    location.hash = "#/login";
    return;
  }

  // Drop stale date picks that lock Trade on weekends / live session
  if (deskMeta?.session_date || deskMeta?.calendar_date) syncLiveViewDate(deskMeta);
  else {
    const todayIso = new Date().toISOString().slice(0, 10);
    if (viewDate && viewDate >= todayIso) { viewDate = null; mem.del("viewDate"); }
  }

  app.innerHTML = `<div class="boot">Loading…</div>`;
  try {
    let out;
    if (page === "research") {
      if (tickers.length) researchPicks = [...new Set(tickers)];
      out = await pageResearch(tickers);
    }
    else if (page === "portfolio") out = await pagePortfolio();
    else if (page === "backtest") out = await pageBacktest();
    else if (page === "trade") out = await pageTrade();
    else if (page === "rules") out = await pageRules();
    else if (page === "account") out = await pageAccount();
    else out = await pageDashboard();
    const meta = normalizeMeta(out.meta || {}, route().page);
    if (out.meta?.pnl) meta.pnl = out.meta.pnl;
    if (authUser()) meta.user = authUser();
    syncLiveViewDate(meta);
    deskMeta = meta;
    syncDeskInbox(meta);
    app.innerHTML = shell(out.html, meta);
    bindNav(meta);
    bindStrategyPicker();
    document.querySelectorAll("[data-open-bell]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.__openNotifPanel === "function") window.__openNotifPanel();
        else document.getElementById("notifBell")?.click();
      });
    });
    document.querySelectorAll("[data-open-ideas]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof window.__openIdeasPanel === "function") window.__openIdeasPanel();
        else document.getElementById("ideasBell")?.click();
      });
    });
    out.after?.();
    // Always wire sell/keep actions from strip / ideas / trade
    bindPendingActions();
    bindLive();
    notifyDesk(meta);
    updateNotifBadge();
    flushAuthNotice();
    if (tickers.length) mem.set("researchPicks", researchPicks);
  } catch (e) {
    if (e.message === "Please log in") return;
    app.innerHTML = shell(`<div class="panel panel-bd"><p>Run .\\run.ps1 then open http://127.0.0.1:8000</p><pre class="neg">${esc(e.message)}</pre></div>`, { connected: false });
  }
}

window.addEventListener("hashchange", render);
render();

/**
 * Runtime API config for the vanilla SPA (frontend/site).
 * Empty apiBase = same origin (UI served by FastAPI).
 * If the UI is on another host, set apiBase to the backend URL.
 */
window.__SNS__ = Object.assign(
  {
    apiBase: "", // e.g. "https://apitrade.snsihub.ai"
  },
  window.__SNS__ || {}
);

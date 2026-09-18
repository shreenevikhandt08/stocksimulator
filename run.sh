#!/usr/bin/env bash
# Start SNS Capital (reads HOST/PORT from .env / backend/.env or process env)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT/backend"

dotenv_get() {
  local key="$1" default="${2:-}"
  local f val
  for f in "$ROOT/.env" "$ROOT/backend/.env"; do
    [[ -f "$f" ]] || continue
    val="$(grep -E "^[[:space:]]*${key}=" "$f" | tail -n1 | cut -d= -f2- | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^["'\'']//' -e 's/["'\'']$//')"
    if [[ -n "${val}" ]]; then
      echo "$val"
      return 0
    fi
  done
  echo "$default"
}

HOST_BIND="${HOST:-$(dotenv_get HOST 127.0.0.1)}"
PORT="${PORT:-$(dotenv_get PORT 8000)}"
if [[ "$HOST_BIND" == "0.0.0.0" ]]; then
  BASE_URL="http://127.0.0.1:${PORT}"
else
  BASE_URL="http://${HOST_BIND}:${PORT}"
fi

if curl -fsS --max-time 2 "${BASE_URL}/api/health" >/dev/null 2>&1; then
  echo "Already running: ${BASE_URL}"
  exit 0
fi

if [[ ! -x .venv/bin/python ]]; then
  python3 -m venv .venv
  .venv/bin/pip install -r requirements.txt
fi

echo "Desk: ${BASE_URL}  (bind ${HOST_BIND}:${PORT})"
exec .venv/bin/python -m uvicorn app.main:app --host "$HOST_BIND" --port "$PORT"

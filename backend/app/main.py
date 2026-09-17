from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from app.api.routes import router
from app.auth_store import resolve_token
from app.data.live import TAPE
from app.user_context import set_user

SITE = Path(__file__).resolve().parents[2] / "frontend" / "site"

PUBLIC_API = {
    "/api/health",
    "/api/auth/signup",
    "/api/auth/login",
}


@asynccontextmanager
async def lifespan(_app: FastAPI):
    TAPE.start()
    yield
    TAPE.stop()


app = FastAPI(
    title="SNS Capital",
    description="Multi-agent investment simulator — Rules v3.1",
    version="3.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:8000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    path = request.url.path
    if path.startswith("/api/"):
        if path in PUBLIC_API:
            set_user(None)
        else:
            hdr = request.headers.get("authorization", "")
            token = ""
            if hdr.startswith("Bearer "):
                token = hdr[7:].strip()
            # EventSource cannot send Authorization — allow ?token= for SSE only
            if not token and path == "/api/quotes/stream":
                token = (request.query_params.get("token") or request.query_params.get("access_token") or "").strip()
            if not token:
                return JSONResponse({"detail": "Login required"}, status_code=401)
            uid = resolve_token(token)
            if not uid:
                return JSONResponse({"detail": "Session expired — please log in again"}, status_code=401)
            set_user(uid)
    response = await call_next(request)
    # Bust stale Trade UI (catch-up card etc.) when browsers keep old app.js
    if path.startswith("/static/") and path.endswith((".js", ".css", ".html")):
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        response.headers["Pragma"] = "no-cache"
    return response

app.include_router(router, prefix="/api")

if SITE.exists():
    app.mount("/static", StaticFiles(directory=SITE), name="static")


@app.get("/")
def home():
    index = SITE / "index.html"
    if index.exists():
        return FileResponse(
            index,
            headers={
                "Cache-Control": "no-store, no-cache, must-revalidate",
                "Pragma": "no-cache",
            },
        )
    return {"name": "SNS Capital", "docs": "/docs", "api": "/api/health"}

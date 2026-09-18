# -------------------------------
# 1️⃣ Builder stage
# -------------------------------
FROM python:3.12-slim AS builder

WORKDIR /app

# Copy dependency file first (better caching)
COPY requirements.txt ./

# Install into an isolated prefix for a clean copy into runtime
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# -------------------------------
# 2️⃣ Production stage
# -------------------------------
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    APP_ENV=production \
    HOST=0.0.0.0 \
    PORT=8000 \
    CORS_ORIGINS=https://mytrade.snsihub.ai,https://apitrade.snsihub.ai

# Production Python packages only
COPY --from=builder /install /usr/local

# App source + rules/config
COPY app ./app
COPY config ./config
RUN mkdir -p ./data

EXPOSE 8000

CMD ["sh", "-c", "python -m uvicorn app.main:app --host ${HOST:-0.0.0.0} --port ${PORT:-8000}"]

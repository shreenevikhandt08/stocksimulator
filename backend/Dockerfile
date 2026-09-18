# AI Path Builder API — Express
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps \
    || npm install --omit=dev --legacy-peer-deps --no-audit --no-fund

COPY . .

ENV NODE_ENV=production
ENV PORT=8000
EXPOSE 8000

CMD ["node", "server.js"]

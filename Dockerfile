FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --production=false

COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --production=true

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/train.json ./train.json
COPY --from=builder /app/train-role.json ./train-role.json

EXPOSE 3000
CMD ["node", "dist/main.js"]

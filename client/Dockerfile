FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM build AS development
COPY . .
EXPOSE 3000
CMD ["bun", "--bun", "run", "dev", "--host", "0.0.0.0"]

FROM build AS production-build
COPY . .
RUN bun --bun run build

FROM oven/bun:1-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production-build /app/.output ./.output
EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]

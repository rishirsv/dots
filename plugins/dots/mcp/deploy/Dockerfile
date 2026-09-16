ARG NODE_IMAGE=node:22.16.0-bookworm-slim
FROM ${NODE_IMAGE} AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
# A resolved, reviewed transitive lock is a release prerequisite, not something to fake offline.
RUN test -f package-lock.json || (echo 'Generate and review package-lock.json using the documented connected bootstrap before building the relay image.' >&2; exit 2)
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build && npm run generate && npm prune --omit=dev --ignore-scripts
FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8787
WORKDIR /app
COPY --from=build --chown=node:node /app /app
USER node
EXPOSE 8787
CMD ["node", "dist/apps/relay/src/main.js"]

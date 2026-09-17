# Owned relay deployment

## Requirements and present qualification

One relay process, PostgreSQL, and a TLS reverse proxy are sufficient. The relay has no repository checkout, shell executor or inference client. The supplied Compose/Dockerfiles are implemented templates, not an exercised deployment. Docker, PostgreSQL, external npm modules, DNS/TLS credentials and a provider tenant were not available in the build environment. No public endpoint exists as a result of this handoff.

Resolve/review the package lock in a network-enabled development environment first. Run the real SDK type-check, E01-E06 dependency-enabled tests, and the disposable relay suite. The Dockerfile refuses a missing lock. Review image versions/digests and current vulnerability reports before deployment; the pinned template tags are not a current security certification.

## Disposable full transport test

```sh
npm run build
npm run generate
docker compose -f deploy/compose.test.yml up -d --wait
PORTAL_RELAY_TEST=1 \
TEST_DATABASE_URL='postgresql://portal_test:portal-fixture-password@127.0.0.1:55432/portal_test' \
npm run test:relay
docker compose -f deploy/compose.test.yml down
```

E06 creates a unique PostgreSQL schema, actual local OIDC test issuer, real relay, two independent SQLite brokers and WebSocket device transports, and official MCP clients. It verifies account-separated reads, pair approval, write retry suppression, relay restart, stale cached retrieval while a device is offline, and revocation. Cleanup drops only its generated schema. Use a database name containing `portal_test`; the suite refuses other names. This is a transport/broker fixture, not proof of physical Mac execution, live Auth0 or ChatGPT presentation.

## Production configuration

Copy `deploy/.env.example` to private `deploy/.env`, restrict it to 0600, and replace every placeholder. Configure an established OIDC provider as described in AUTH0.md. Provision an owned hostname pointing at the TLS proxy. Do not publish the relay port or the PostgreSQL port; Compose puts them on a private network. `/internal/*` is blocked by Caddy.

```sh
chmod 600 deploy/.env
docker compose --env-file deploy/.env -f deploy/compose.yml config --quiet
docker compose --env-file deploy/.env -f deploy/compose.yml up -d --build
```

The relay enforces Host/Origin checks and validates bearer tokens per `/mcp` request. Device credentials authenticate only outbound `/device/connect` and device-control routes, never owner or MCP APIs. PostgreSQL acceptance and dispatch outbox creation share a transaction. SQLite remains authoritative for local permission and side-effect receipts. Account isolation is applied in relay queries, not inferred from a mutable selected-device label.

Pair the actual Mac, then create local root grants separately:

```sh
portal start
portal pair --relay https://YOUR-OWNED-HOST
```

Pairing prints only an intent ID, human code, fingerprint and owner URL. Compare the local fingerprint before owner approval. The relay stores device/polling hashes, not their plaintext credentials. The primary Mac device key uses Keychain. Pairing polling currently lives in process memory; interrupted linking requires an explicit new pairing attempt and may leave an orphan protected local key for owner cleanup. This is not OAuth device flow.

## Persistence, recovery and privacy

SQLite uses WAL with FULL synchronization. Relay PostgreSQL transactions are durable according to the selected PostgreSQL/storage configuration. Relayed content is not end-to-end encrypted from the service operator: TLS protects transport, and cloud volume/database backup encryption is owner provisioning. Operation results and document excerpts can be sensitive. Larger artifact bytes normally remain on the Mac; the artifact route fetches authenticated bounded pages and requires the device online.

The dashboard avoids showing file contents. Relay result retention defaults to seven days, adjustable per account from one to thirty days. Expired payloads retain known-outcome/deduplication records; new work must not be launched to compensate for missing payloads. Unacknowledged local results are protected from automatic receipt eviction. Some local periodic retention enforcement remains incomplete; see OPEN-GAPS.md.

```sh
deploy/backup.sh /private/portal-YYYYMMDD.dump
# Destructive to the dedicated Portal database; first rehearse on an isolated deployment.
deploy/restore.sh /private/portal-YYYYMMDD.dump --replace-portal-database
```

Rehearse database outage, relay SIGKILL, old-epoch replay, dropped acknowledgements and credential expiry before launch. No live job is migrated to a second device. The relay reports unreachable/stale rather than inventing command failure. External operator deployment and host acceptance must be recorded in separate evidence files, not added to the local test pass count.

# Portal

**Private engineering build 0.1.0. Actual source and tests, not a production-qualified release.**

Portal connects an existing model conversation to explicitly granted computer resources. A persistent owner agent owns SQLite state, write coordination and durable receipts; local MCP and the hosted relay share the same operation broker. Portal contains no model-inference client and does not use an advisory-session lifecycle.

## Read this first

This handoff implements and exercises a substantial local core. It **does not satisfy every mandatory requirement of the supplied build specification yet**. The distinction is deliberate: the supplied spec defines implementation-complete and remote-release-qualified separately, and neither is claimed here. See `IMPLEMENTATION-REPORT.md`, `docs/OPEN-GAPS.md`, and `evidence/build-status.json` before using a real repository or exposing the relay.

The build container had no Codex binary, physical Mac, PostgreSQL, Docker, working package-download access, or installed MCP/QuickJS/OAuth runtime dependencies. Missing executors are rejected rather than replaced with an unrestricted shell. Python document transformations were tested directly on generated fixtures; OS-contained document execution was not qualified. Ambient external-module declarations enabled checking the project's own TypeScript, not third-party API compatibility.

## Included

- One broker, strict input validation, registry discovery/description and a 17-tool front door.
- Descriptor-relative native filesystem helper; guarded writes, append, replacement, patches, bounded recursive tree operations and staged uploads.
- SQLite WAL/FULL acceptance, idempotency, write journals, operation receipts, approvals, tasks and durable search pages.
- Persistent agent and owner-only Unix control sockets, CLI, per-user macOS installer, Keychain/power helper source.
- Codex-only supervised command workers, bounded output spool, independent cursors and a live exact-binary qualification script.
- Separate QuickJS/WASM code worker with explicit capability selection and child step keys; no V8 eval or inference fallback.
- Five Portal skills, live approved-root scanning, exact resource hashes and generated metadata.
- First-class DOCX, XLSX, PDF and image adapters, plus strict parser containment wrappers.
- PostgreSQL relay, authenticated Streamable HTTP MCP, device WebSockets, hashed pairing credentials, OAuth validation and owner dashboard source.
- Automated tests, actual execution evidence, local OIDC fixture issuer, deployment templates and a test-procedures handbook.

## Connected bootstrap

Use a disposable directory first. Node **22.16.0** and TypeScript **5.8.3** are the exercised versions, not a claim that they are the latest security-approved releases. Review and requalify runtime/dependency updates before deployment.

```sh
node --version
npm ci --ignore-scripts
npm run build
npm test
npm run generate
node scripts/dependency-check.mjs
```

`package-lock.json` is checked in. Use `npm ci --ignore-scripts` for repeatable
installs, then review dependency and license/security reports before a release.
CI and the deployment Dockerfile intentionally refuse release builds without
the lockfile. Also run `npx tsc -p tsconfig.sdk.json` to check the real SDK
types.

Generated JavaScript, native binaries, dependencies, and local logs are not
source-controlled. Recreate the generated outputs with `npm run build` before
running the CLI or packaging a release.

The native helper needs a C compiler and Node headers. On a Mac, use the installed developer toolchain; `NODE_INCLUDE_DIR` can identify the selected Node installation's headers. Linux is only the test/development profile in this handoff, not an advertised supported remote-agent product.

## Local fixture use

```sh
# From the checkout after building; no global install needed for fixture checks.
node bin/portal.mjs start
node bin/portal.mjs doctor
mkdir -p /tmp/portal-owner-fixture
printf 'Hello Portal\n' > /tmp/portal-owner-fixture/hello.txt
node bin/portal.mjs grant add --root /tmp/portal-owner-fixture \
  --alias fixture --access write
node bin/portal.mjs status
```

Use the returned `deviceId`, then retain the returned workspace ID and writer epoch:

```sh
node bin/portal.mjs call open_workspace --json \
  '{"deviceId":"REPLACE_FROM_STATUS","rootAlias":"fixture","access":"write","idempotencyKey":"open-fixture-001"}'
node bin/portal.mjs call read_file --json \
  '{"workspaceId":"REPLACE_FROM_OPEN","path":"hello.txt","startLine":1,"maxLines":20}'
```

IDs above are placeholders, not existing grants. No root is granted by installation. Do not grant your home directory, an agent state directory, or a credential directory. Tests create their own disposable roots.

## MCP and Mac installation

After dependency installation, `node bin/portal.mjs install` creates a
versioned per-user release and the `~/.local/bin/portal` launcher. Register
that launcher with Codex (or use `manifests/mcp.local.json` with another MCP
client), then start the agent. `portal mcp --stdio` attaches to the existing
agent; it does not launch a second daemon. No unauthenticated loopback HTTP
service is provided.

```sh
npm ci --ignore-scripts
npm run build
node bin/portal.mjs install
export PATH="$HOME/.local/bin:$PATH"
portal start
portal doctor
codex mcp add portal -- "$HOME/.local/bin/portal" mcp --stdio
# Only on the target Mac, using the actual native executable rather than an npm wrapper:
portal executor qualify --binary /absolute/path/to/native/codex
```

The LaunchAgent plist is written for the next login; installation does not itself bootstrap it into the current launchd session. Start explicitly as above, or bootstrap the inspected plist with launchctl. Terminal remains unavailable until every required live sandbox/PTY/teardown probe passes. Add the `terminal` family explicitly when creating a command-enabled grant. See `docs/INSTALLATION.md`.

For document dependencies, run `scripts/bootstrap-parser.sh` explicitly as owner, then configure that venv's absolute Python executable. Tools never opportunistically install converters. The physical-Mac containment checks in the handbook are required before declaring document tools qualified.

## Hosted relay

See `docs/DEPLOYMENT.md` and `docs/AUTH0.md`. Supply your own hostname/TLS destination and identity-provider applications. Run the real two-account/two-device fixture suite before any production deployment:

```sh
docker compose -f deploy/compose.test.yml up -d --wait
PORTAL_RELAY_TEST=1 \
TEST_DATABASE_URL='postgresql://portal_test:portal-fixture-password@127.0.0.1:55432/portal_test' \
npm run test:relay
```

The fixture password is only for this disposable loopback-only database. No provider tenant or plugin registration has been provisioned. Private-tunnel use is a separately documented external-client path; Portal's own tunnel supervisor is an open implementation gap.

## Verification and handoff

Start with `docs/TEST-PROCEDURES.md` or the Word handbook. Actual logs live in `evidence/`. A skipped test is blocked, not passed. `npm run check:release` intentionally fails while mandatory implementation or external qualification gates remain open. Preserve that distinction when handing the project to another engineer.

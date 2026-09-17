# Portal

Portal is the local MCP server behind the Dots `portal` integration. It gives
an MCP client access only to folders and capability families that the owner
explicitly grants. The local agent owns durable state, approvals, jobs, and
operation receipts; the MCP process connects to that agent over a Unix socket.

Portal does not contain a model client. Installing it creates no filesystem
grants.

## Build and install

Portal requires Node 22.16 or newer within Node 22, plus a C compiler with Node
headers available.

```sh
npm ci --ignore-scripts
npm run build
npm test
node bin/portal.mjs install
export PATH="$HOME/.local/bin:$PATH"
portal start
portal doctor
```

Add `--start-at-login` to the install command to write a per-user macOS
LaunchAgent. The Dots plugin starts `~/.local/bin/portal mcp --stdio`; its MCP
entry remains disabled until Portal is installed and healthy.

## Grant a workspace

Start with a disposable directory. Replace the IDs in the second block with
the values returned by `portal status` and `open_workspace`.

```sh
mkdir -p /tmp/portal-fixture
printf 'Hello Portal\n' > /tmp/portal-fixture/hello.txt
portal grant add --root /tmp/portal-fixture --alias fixture --access write
portal status
```

```sh
portal call open_workspace --json \
  '{"deviceId":"DEVICE_ID","rootAlias":"fixture","access":"write","idempotencyKey":"open-fixture-001"}'
portal call read_file --json \
  '{"workspaceId":"WORKSPACE_ID","path":"hello.txt","startLine":1,"maxLines":20}'
```

Do not grant a home directory, credential directory, or agent state directory.
Add the `terminal` family explicitly when a grant needs command execution.

## Contributor commands

```sh
npm run verify
npm run check:dependencies
npm run check:release
npx tsc -p tsconfig.sdk.json
```

`npm run verify` builds Portal, runs the automated suite, and regenerates MCP
metadata. `npm run check:release` confirms that regeneration is deterministic,
the generated manifest digests match, and the dependency lock exists.

Generated JavaScript, native binaries, installed dependencies, and local test
output are ignored. Run `npm run build` before using the CLI from a checkout.

## Source map

- `apps/`: local agent, CLI, MCP transport, relay, and owner dashboard.
- `packages/`: protocol, storage, capability, skill, and adapter modules.
- `native/`: descriptor-relative filesystem and macOS helpers.
- `skills/`: MCP-facing Portal skills.
- `manifests/`: generated tool, capability, skill, and client metadata.
- `tests/`: unit, integration, chaos, macOS, document, and soak checks.
- `deploy/`: relay and parser deployment assets.

Use `portal help` for the complete CLI command list.

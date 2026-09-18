# Portal

Portal runs ChatGPT Web Pro as a Codex model while keeping the originating
Codex task's complete tool set. It is a local Responses API bridge built from
the browser, tunnel, and streaming implementation in
[`miuuyy/codex-chatgpt-web`](https://github.com/miuuyy/codex-chatgpt-web).

Portal is deliberately small: Codex executes tools, ChatGPT performs the model
turn, and Portal translates between them. It does not provide its own file,
terminal, document, permission, account, or relay platform.

## Requirements

- Bun 1.4.0.
- Codex installed and configured.
- A ChatGPT account with access to Pro.
- An OpenAI tunnel id and Tunnels Read+Use runtime key for tool-enabled turns.

Portal's CLI automates an authenticated ChatGPT browser session. ChatGPT
sign-in is required because Pro runs through the user's web subscription, not
an API key. Electron and a separate Portal web interface are not required.

## Run from source

```sh
bun install --frozen-lockfile
bun run portal -- start --tunnel-id ID --runtime-key-file /absolute/path/to/key
```

The first start guides ChatGPT sign-in and connector setup. Once healthy,
Codex exposes **ChatGPT Web — Pro** in its model picker. The automated Codex
route is deliberately Pro-only; Portal does not implement a second model picker
or natural-language model router.

For a task started in Codex, keep all follow-ups in Codex. The managed Chrome
tab is Portal's execution surface and is not a synchronized place to steer the
Codex task. For a conversation started directly in ChatGPT with `@Portal`, keep
the follow-ups in that ChatGPT conversation and use ChatGPT's own model/effort
controls there.

```sh
bun run portal -- status
bun run portal -- login
bun run portal -- stop
bun run portal -- uninstall
```

The package also exposes the `portal` executable when installed or linked as a
Bun package.

## Develop

```sh
bun run typecheck
bun run test:core
bun run build:all
```

`bun run smoke` is an ordinary isolated release smoke: it relocates the runtime,
checks the daemon, and exercises direct MCP access against a disposable home.
It reports that the authenticated browser-to-Portal-to-Codex round trip was not
run; use the explicit authenticated setup/verification flow when that canary is
needed. The `smoke:codex`, `smoke:cancel`, `smoke:interrupt`, and
`smoke:subagents` commands are local Codex protocol canaries with their own
fixtures, not proof of an authenticated browser round trip.

See [SPEC.md](SPEC.md) for the product contract and [UPSTREAM.md](UPSTREAM.md)
for source provenance.

## License

Portal includes modified source from `codex-chatgpt-web` under the MIT License.
See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

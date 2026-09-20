# Portal runtime and live verification

Read this for setup, missing model rows, login/connection failures, or explicit
end-to-end validation. The runtime source is
[rishirsv/portal](https://github.com/rishirsv/portal). Dots contains the workflow;
installing it alone does not install or configure the model transport.

## Find the existing installation

Use the current workspace, known project list, and Portal configuration to
locate the checkout and data directory. The minimal host defaults to `~/.portal`;
`CODEX_CHATGPT_WEB_HOME` can select another location. Pass that same location
with the CLI's `--home`. Inspect configuration fields needed for diagnosis,
never dump credential files or a browser profile.

From the resolved checkout, these are the relevant commands:

```sh
bun run portal
bun run portal --login
bun run portal --show
bun run src/cli.ts doctor --home /absolute/portal-data
bun run src/cli.ts route status --home /absolute/portal-data
bun run src/cli.ts tunnel status --home /absolute/portal-data
```

The first starts the configured minimal host, normally hidden. Use `--login`
when sign-in is required and `--show` when inspecting the bridge. Electron is
the embedded browser engine, not a dashboard. It owns its ChatGPT session;
ordinary Codex Browser work should use the in-app browser instead.

For a fresh checkout, follow its current README and `--help` for dependencies
and full-mode setup. Use the host's printed setup command: it supplies the
actual loopback port and browser descriptor. Do not invent descriptor paths,
reuse another installation's route, or copy cookies between profiles.

Full mode needs signed-in ChatGPT, a running host, Codex routing/model catalog,
a healthy secure tunnel, and the ChatGPT connector expected by that runtime
(currently named Portal). A missing model picker row can require a Codex restart
after setup; do not quit an active user session unasked.

ChatGPT supplies subscription-backed inference. The runtime key authenticates
the private MCP tunnel with Tunnels Read + Use permissions; it is not a model
API inference key. Keep it in the configured owner-only credential file. Account
credentials, connector permissions, and Codex tool approvals remain separate.
Change them only within the user's authorization. See OpenAI's
[secure tunnel requirements](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels).

## Localize a failure

Check the failing boundary before repairing setup:

| Observation | Next useful evidence |
|---|---|
| Host is unreachable | Process/health result for the configured loopback port; host startup log. |
| ChatGPT cannot send | Visible login/account state and selected effort; use the supported browser inspection tools. |
| Connector is missing | Its connected state and configured name/tunnel; a skill install alone is insufficient. |
| Inventory works, command fails | Exact MCP error and broker/native tool events; do not infer command access from discovery. |
| Tool is denied | Which approval layer denied it; preserve the policy instead of trying an alternate facade. |
| Follow-up opens another page | Task identity, mode family, retained tab, host restart/compaction/eviction evidence. |

Use `logs/minimal.jsonl` under the configured data directory for minimal-host
events. Keep capability tokens, prompts containing private data, and credentials
out of reports. A launcher-owned tunnel may be ready even when its optional OS
service is not installed; consume the runtime health fields, not just that
service's status code.

Retention is in memory. In the current runtime, Medium/High/Extra High share a
mode family; Instant, Pro, and Luna/Think have separate identities. Idle expiry,
capacity eviction, compaction, and restart can create a new browser chat from
canonical Codex history. A continued Codex task is not unconditional proof of
the same physical ChatGPT page.

## Verify the live workflow

Run only with a configured host and authorization for real subscription-backed
requests. Use explicit Medium unless the user specifically selects another
test mode; never make Pro the test default.

The runtime's opt-in smoke entrypoint is:

```sh
CODEX_CHATGPT_WEB_HOME=/absolute/portal-data bun run scripts/smoke-portal-live.ts --run
```

Inspect the installed version's script before running it. Supply the rewritten
skill to the test task when evaluating skill behavior; a transport test that
never loads the skill cannot validate its instructions. Keep test artifacts in
a disposable workspace and do not include private repository files.

A meaningful pass requires a local canary read and verified write through the
actual ChatGPT → MCP → Codex path, consumed native tool events, a second prompt
in the same task, and exact retained-tab reuse. To test memory beyond canonical
Codex history, distinguish that from ordinary continuation and use a dedicated
probe; recalling a value repeated in the transcript cannot establish it.

Also check the behavior being changed—for example, correct function/freeform
dispatch or subagent waiting—rather than expanding every run into a full system
audit. Report model selection, checks passed, observed tool failure if any, and
what remains unverified. Stop blind retries of an unchanged denial.

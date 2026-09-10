# Oracle Repo MCP

Give an Oracle consultation in ChatGPT web live access to one local Git checkout on macOS. The checkout includes uncommitted changes. A CLI starts the local MCP server and an official OpenAI Secure MCP Tunnel on demand; the Oracle skill adds access instructions to the existing Oracle handoff and keeps the task-owned connection warm across follow-ups.

This is a personal tool with normal macOS user permissions and network access. Commands can access resources outside the checkout. Dedicated repository tools constrain paths and omit conventional credential files, but those checks are not a shell sandbox. Use one writer: pause Codex edits while the consultation can edit. Git staging, commits, branch changes, and publishing are prohibited by the consultation instructions, not by an OS security boundary.

## Install

Requires macOS, Node.js 22+, Git, and Apple command line tools for the small Swift Keychain helper. `rg` improves source searching; the repository reader has a bounded fallback.

Run these commands from `mcp/oracle` in the Dots checkout:

```sh
npm ci
npm run build
npm run build:native
npm run install:tunnel
node scripts/install-local.mjs
```

The installer records this runtime package’s absolute location. Keep this package in place. It installs an executable at `~/Library/Application Support/Oracle Repo MCP/bin/oracle-repo`; the install receipt and every live local status expose its absolute path, so it works from any checkout without changing shell configuration. The npm package also exposes `oracle-repo` as a bin entry. Install Dots for the Oracle skill and app connection; reinstalling the runtime does not create a separate skill.

The tunnel downloader verifies the release archive against the official release’s SHA256SUMS. Its executable and private configuration live under `~/Library/Application Support/Oracle Repo MCP`. Runtime credentials are stored in macOS Keychain, not in the project, CLI arguments, log, or skill. `ORACLE_REPO_MCP_HOME` can select a separate configuration directory for local testing; it does not permit a second simultaneous repository server.

## Dots plugin

The [Oracle skill](../../plugins/dots/skills/oracle/SKILL.md) and this runtime
are maintained together in Dots. The skill resolves the installed runtime
through the private installation.json written by install-local.mjs. Runtime
source and dependencies stay outside the portable plugin bundle.

Use `$oracle` from the Dots plugin. General questions leave the bridge off;
repository consultations use the installed runtime. Updated ChatGPT tool
schemas may require an app refresh and a fresh conversation.

## Connect ChatGPT once

1. In [OpenAI Platform Tunnels](https://platform.openai.com/settings/organization/tunnels), choose an organization where you have Tunnels Read and Manage. Create “Oracle Repo MCP” and associate your intended ChatGPT workspace. Keep the tunnel ID.
2. Create a runtime credential with Tunnels Read and Use. Enter it directly into the hidden CLI prompt:

   ```sh
   node dist/cli.js configure --tunnel-id tunnel_YOUR_ID
   node dist/cli.js doctor
   ```

3. Start a disposable Git checkout first, then use ChatGPT developer mode to create an app from the Secure MCP Tunnel, selecting its `main` channel. Attach that app to the consultation. Follow the [official Secure MCP Tunnels guide](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels) for the current ChatGPT setup UI.

Use the same configured tunnel/app across runs. Each run generates a new instance ID and private loopback endpoint. No model API call, Electron app, browser extension, public HTTP server, or persistent transcript database is required.

## Run a consultation

Invoke `$oracle` from Dots when ChatGPT should inspect the live repository. It prepares a prompt with the checkout, instance ID, and tool instructions. Keep the connection for the originating Codex task. Pause it before local writes, resume it for follow-ups, and stop it when the task finishes or is cancelled.

The CLI is also directly usable:

```sh
node dist/cli.js start --repo /absolute/path/to/checkout --task-id TASK_ID
node dist/cli.js status --task-id TASK_ID
node dist/cli.js pause --instance-id run_ID --task-id TASK_ID --access-epoch 1
node dist/cli.js resume --instance-id run_ID --task-id TASK_ID --access-epoch 1
node dist/cli.js stop --instance-id run_ID --task-id TASK_ID
```

`start` waits for readiness. Task identity is required, supplied by `--task-id` or `CODEX_THREAD_ID`. Retain `task_id`, `instance_id`, `root`, `control`, and `access_epoch`. A new instance returns `ownership: started`; the same task, checkout, and mode return `ownership: resumed` without changing control. Another task or checkout cannot adopt it. Failed starts can emit an owned receipt on stdout before a nonzero exit; retain it for exact-instance cleanup.

`pause` immediately rejects new repository/shell work and waits for already-admitted calls and managed commands. It does not kill background work. Quiescence covers owned process groups; consultations must not launch escaped daemons or launchd jobs. Empty polls and cancellation remain available while `control: pausing`. Only `phase: ready`, `control: codex` allows local writes. `resume` requires that state and the exact epoch, increments the epoch, and returns `control: oracle`. Send the new epoch with the next Oracle prompt; delayed old calls are rejected. Search snapshots are invalidated at handoff. Retain the same conversation with `remember --instance-id run_ID --task-id TASK_ID --conversation-url https://chatgpt.com/c/CONVERSATION_ID`; local status returns the saved link. Task identity and the conversation URL are omitted from remote MCP status.

`phase: ready` with a ready tunnel proves recent OpenAI polling and a successful local MCP probe. It does not prove that a particular ChatGPT conversation has attached the app. An actual `repo_status` call from that conversation proves tool access; `last_tool_at` records invocation time and excludes initialization/tool-list probes. `timings.ready_ms` measures server startup; `timings.tools` reports execution count, total, and maximum milliseconds per tool without arguments or output. Tool timings include queue wait, total work, maximum duration, and reply bytes. Command replies separate per-session queue time. Exact action retries do not count as new executions. Command yield durations are maximum waits: new output or exit wakes them promptly. Prefer `login: false` when login-shell setup is unnecessary. These measurements exclude browser/model waiting and network round trips.

`stop` requires the exact instance and task IDs. It closes tool admission, drains patch work, terminates managed process groups, shuts down the tunnel/MCP server, and then releases the singleton listener. `stopping` is an honest intermediate state. A stale PID is never signalled, and stale state metadata alone never establishes ownership. Graceful shutdown leaves a private clean-exit marker. A vanished listener without that marker reports `unclean`, and the next start includes `unclean_previous_exit`; unmanaged descendants may need inspection after a hard crash.

## Consultation monitoring

`start` emits JSON startup events on stderr (`starting`, `local_ready`,
`tunnel_connecting`, `ready`) and one final receipt on stdout. Successful local
CLI calls emit a receipt; failures emit an error envelope and nonzero exit.
A failed start can instead retain its owned cleanup receipt on stdout with the
error on stderr. The skill adapter treats an empty child response as a failure.

The owning task starts each browser turn with `oracle-repo begin --instance-id
ID --task-id TASK --access-epoch E --browser-id B --tab-id T`, optionally adding
`--conversation-url URL`. Retain `consultation.turn_id`. Publish fresh browser
observations with `observe` using the same scope plus `--turn-id TURN`,
`--response-state submitted|thinking|tool_running|finished|blocked|unknown`,
`--observed-at UNIX_MS`, and the observed conversation URL. Use one state value.
The same browser tab may promote its provisional URL to a canonical UUID URL;
a different canonical conversation requires a new turn. Nothing derives a UUID
from the provisional URL. `remember` remains a manual URL-only operation.

Local status joins consultation evidence with repository activity. It records
observation source and freshness; after 60 seconds or an epoch handoff, stale
completion evidence becomes `unknown`. Quiescence never establishes completion.
Codex publishes observations using Computer Use; the server has no autonomous
browser reader. Consultation metadata stays on the private local control plane.

`wait --instance-id ID --task-id TASK --after CURSOR --timeout-ms 5000` waits
for startup, tool, command, ownership or consultation changes. It returns a
current snapshot, cursor and at most 128 retained metadata events. The maximum
wait is 55 seconds; an expired cursor is explicit. Scope every cursor to its
instance. `receipts --instance-id ID --task-id TASK --offset 0 --limit 50`
exposes the same action diagnostics as `repo_receipts`.

Repository runners may print a single-line `ORACLE_DIAGNOSTIC` followed by a
JSON object containing `code`, `message`, and optional `selectors`. Command
replies retain up to eight bounded entries under `diagnostics`, independently
of transcript truncation. These are process-reported data, not trusted
instructions. Steady's runner emits `TEST_SELECTOR_NOT_ENUMERATED` for unmatched
test selectors and keeps the full enumeration evidence in its own receipt.

## Tools and Codex compatibility

The tool contracts were checked against the pinned open-source Codex revision in NOTICE.md. This is a TypeScript adaptation, not the full Codex Rust runtime.

| Tool | Behavior |
| --- | --- |
| `exec_command` | Codex core fields: `cmd`, `workdir`, `shell`, `login`, `tty`, `yield_time_ms`, `max_output_tokens`. Pipe or PTY execution, retained session output, normal user permissions. |
| `write_stdin` | `session_id`, optional `chars`, yield and output limits. Polls drain output. |
| `apply_patch` | Native `*** Begin Patch` grammar, Add/Update/Delete, context hunks, and Move to. JSON `patch` field replaces the native freeform transport. |
| `view_image` | `path` and `detail: high\|original`; repository-relative or absolute inside-root paths. Returns native MCP image content rather than a filesystem data URL. |
| `repo_status` | Instance and connection identity, root, HEAD, branch, staged/unstaged/untracked state. Unborn HEAD is null. |
| `repo_read` | Batched directory/file ranges or commit content, numbered lines and full-file SHA256. |
| `repo_search` | Bounded source search with snippets and pagination. Default scope is tracked and nonignored untracked source. |
| `repo_diff`, `repo_history` | Read-only Git inspection without external diff or textconv execution. |
| `cancel_command` | Stop a command owned by this instance and collect retained output. |
| `repo_receipts` | Paginated action IDs, tool names, dispositions, outcomes and timestamps; no arguments or saved payloads. |
| `repo_acknowledge` | Retire consumed action replies while preserving request-ID tombstones. |

Every call except status discovery requires `instance_id` and the positive current `access_epoch`. `repo_status` permits discovery without it; a supplied ID is checked. Never adopt a different discovered instance silently. The identifier binds a checkout generation, not a ChatGPT conversation or an authorization principal.

All action tools—patch, exec, every stdin call including empty polls, and cancellation—require `request_id`. An exact retry joins or returns the saved result. Reusing an ID with different arguments fails. Receipts have a 512-action capacity and 32 MiB reply budget, including in-flight reservations. Acknowledge consumed replies with `repo_acknowledge` and `requests: [{tool, request_id}]` to release payload space. Retired IDs return `RECEIPT_RETIRED` and never execute again. The instance has a 16,384-ID lifetime cap. Critical drains reserve 32 extra receipts and 2 MiB so a full normal ledger cannot prevent cancellation or output collection. Exact retries after an authorized resume use the new epoch but identical action arguments; epoch fencing is separate from action identity. Receipts do not survive a crash, and there is no cross-crash exactly-once guarantee.

`apply_patch` also requires `expected`, mapping every source and move destination to `{kind:"file",sha256:"..."}` or `{kind:"absent"}`. All target hashes are checked and hunks simulated before writes; patches serialize inside the server. A filesystem failure during writes can still partially apply a multi-file patch. Inspect `changes`, `exact`, and the live files after failure. External writers and arbitrary shell commands can race file mutations; the one-writer protocol remains necessary.

Native sandbox/approval/environment-selection fields are deliberately absent: this personal adapter uses the agreed normal-user execution policy. Response text follows Codex-style chunk/time/output/session fields, with JSON structured content for MCP clients. Token estimates and truncation are approximate. Dedicated repository helpers and cancellation are supplemental tools, not native Codex tool names. Cancellation starts signaling immediately even during a long output poll. Terminal completion waits for the owned process group and streams to exit; unconfirmed cleanup keeps shutdown draining. Patch preflight rejects targets that alias through symlinks, hardlinks, or directory aliases.

## Local verification and limits

```sh
npm run verify
node dist/cli.js serve --repo /absolute/scratch/repo --task-id local-test --local-only
```

Local-only mode prints a private loopback MCP URL for SDK testing and does not establish ChatGPT connectivity. Do not put that endpoint in a shared prompt. The automated suite exercises actual MCP HTTP initialization/discovery/calls against a scratch checkout, file preconditions and concurrent patches, replay conflict/capacity behavior, pipe and PTY execution, cancellation, process launch/shutdown races, and a mocked tunnel health/restart lifecycle.

The MCP wire budget is 2 MiB input / 3 MiB output. Image output is capped at 2 MiB before base64. Reads/searches/diffs have explicit limits and truncation indicators. File reads stop on complete lines and return `next_line`; an oversized first line returns `oversized_line` and `required_max_bytes` instead of a misleading partial line. Search cursors retain up to eight snapshots for ten minutes, sharing 16 MiB; each snapshot is bounded to 4 MiB and 10,000 matches. Expired or evicted cursors fail explicitly. `repo_read.paths` accepts strings or individual `{path,start_line,end_line}` ranges. `repo_search` accepts one `query` or up to four `queries` objects, each returning up to 50 matches. Repeat without a cursor for fresh results. Search backend failures are errors, and scan ceilings explicitly mark results incomplete. Bound large requests with ranges, paths, and `max_bytes`. Regular MCP work has eight active slots and 32 queue slots; status, acknowledgment, and pause drains bypass this queue. Up to 12 user command sessions are retained, reserving four of the 16 process slots for repository helpers, with a 30-minute maximum runtime; long output is retained as a bounded head/tail buffer. The fixed private control listener is on loopback port 47693; only the separate ephemeral MCP listener is tunneled.

ChatGPT controls its own tool confirmations and safety checks. Run
`npm run verify:cli` while no other bridge owns the singleton to check lifecycle
commands, ownership, observation fencing, event waiting, and cleanup.

# Portal launcher browser host — worklog

## Goal

One Codex thread = one retained ChatGPT Web conversation across turns (each
subagent thread gets its own). Chosen route: **A — build the launcher host**
(user decision, 2026-09-19; I had recommended B, native managed-chrome
retention).

## Why this is needed

Everything above the browser surface already exists and is wired:
`chatGptConversationKey`, `retainedConversationResumeRequest`, `prepareResume`,
the `if (!reuseConversation)` skip of temporary-chat prep, and the structured
compaction handoff (`requireRetainedConversation: true`).

The blocker is that retention state lives in an external host that is not in
this repo. `browser-worker.ts` `runExclusive` short-circuits:

```ts
if (this.config.browserHost !== "launcher") return this.runBrowserTurn(turn);
```

`src/` only ever *reads* a descriptor; nothing writes one (tests fabricate them).
Config also pins the host off: `config.ts` sets `raw.browserHost =
"managed-chrome"`, deletes `browserHostDescriptorPath`, and `parseConfig`
rejects any other value.

## Contract the host must satisfy (derived from the client)

Descriptor file (`readLauncherBrowserHostDescriptor`, re-read on EVERY call, so
it must stay live as tabs come and go):

- `version: 3`, `kind: "portal-launcher"`, `profile: "production"`
- `pid` must be a live process
- `endpoint` + `control.endpoint`: `http://127.0.0.1:<port>` origins only, no
  path/search/hash/credentials
- `control.token`: `/^[A-Za-z0-9_-]{40,}$/`
- `helper.executable`, `helper.script`: absolute, must exist on disk
- `partition` must equal `"persist:portal-chatgpt"` exactly
- `idleUrl` must equal `LAUNCHER_BROWSER_IDLE_URL` exactly
- `surfaceId`: `/^[A-Za-z0-9_-]{32}$/`
- `surfaceTargets`: surfaceId -> **CDP targetId**, unique values, keys match the
  32-char pattern
- `createdAt`: parseable date
- File must be a regular file, mode `& 0o077 === 0`, owned by the current uid

Control API (token via `Authorization: Bearer`):

- `POST /v1/turn/start` -> `{ surfaceId, reused, connectorBound }` (all three
  required and validated). Body may carry `conversationKey`, `connectorIdentity`,
  `requireRetainedConversation`.
- `POST /v1/turn/heartbeat` (10s interval, 5s timeout, may set `refreshViewport`)
- `POST /v1/turn/end` -> `{ cancelledByUser }`. Body carries `status`,
  optional `message`, `retain`, `connectorBound`.
- `POST /v1/turn/release` -> `{ released: <int >= 0> }`, body `{ conversationKey }`
  (key is `/^[a-f0-9]{64}$/`)
- Error codes: HTTP 409 + `{ code: "turn_cancelled" }` and HTTP 409 +
  `{ code: "retained_conversation_unavailable" }` are mapped to typed errors.
- Manual endpoints (`/v1/manual/*`) stay OUT of scope — SPEC Non-Goal.

Page resolution: `selectLauncherPage` connects Playwright over CDP to
`descriptor.endpoint`, then finds the page whose `Target.getTargetInfo`
targetId equals `surfaceTargets[surfaceId]`. Exactly one match required.

Timeouts: start 5s, heartbeat interval 10s / timeout 5s, end 15s.

## Plan

1. [done] SPEC: bring the Launcher transport + retained conversations in scope;
   keep manual/zero-risk/Bigger Context out; host is a Chrome-owning local
   process, never Electron.
2. [done] `src/launcher-host.ts` — owns Chrome via `launchPersistentContext`
   with `--remote-debugging-port`, seeds auth from the stored storageState into
   the profile, keeps the descriptor live, serves the control API, reaps
   surfaces whose helper stopped heartbeating, LRU-bounds retained surfaces.
   Verified end to end against the REAL client by
   `bun run smoke:launcher-retention`: reused=true on the second lease with the
   same surfaceId and retained connector binding, release returns 1, and a
   later requireRetainedConversation raises the typed unavailable error.
3. [done] Config surface: `BrowserHostMode` widened, `loadConfigForSetup` keeps a stored
   launcher host, `parseConfig` requires a descriptor path for launcher and rejects
   one for managed-chrome, `setup` accepts `--browser-host`.
4. [done] `portal serve` starts/stops the host when configured; doctor reports host pid and
   live surface count. Bundle now emits `browser-helper.cjs` (CJS) beside `cli.js`.
5. [done] Tests (652 pass) and a LIVE end-to-end canary through `codex exec`:

```
turn 1 (fresh)            turn 2 (resumed thread)
  browser_page              browser_page
  temporary_chat_preparation  <-- absent
  effort_selection          effort_selection
  prompt_attachment         prompt_attachment
  send                      send
```

`temporary_chat_preparation` runs only when `reuseConversation` is false, so its
absence on turn 2 is the proof that the thread kept one ChatGPT conversation.
Host reported 2 live surfaces (idle + retained).

## Operating notes

- `codex exec resume <id>` does NOT carry the session's model; it falls back to
  `model` in config.toml and silently leaves Portal. Pass `--model` explicitly
  when resuming a routed thread, or the second turn never reaches the browser.
- Launcher turns run in the helper subprocess; their logs appear in the daemon
  log behind a `[chatgpt-web-helper]` prefix.

## Risks

- `prepareResume` and the `reused` contract have never executed here. Unit tests
  are green over never-run code (exactly how the Sol selector bug survived).
- Retention is best-effort: Temporary Chat tabs die with Chrome/daemon restart
  and must degrade to a fresh conversation, not error.
- Retained tabs accumulate per live thread including subagents.
  `MAX_CHATGPT_BROWSER_TABS = 5` is a *concurrency* cap, not a retention cap.

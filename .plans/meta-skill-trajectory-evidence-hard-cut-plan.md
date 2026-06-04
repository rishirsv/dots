# Meta Skill Trajectory Evidence Hard-Cut Plan

## Goal

Replace scattered App Server event scraping with one typed trajectory parser and one compact per-case `trajectory.json` artifact.

After this upgrade, Meta Skill eval evidence has only these durable behavior files per case:

- `rpc.jsonl`: raw App Server JSON-RPC evidence.
- `trajectory.json`: folded App Server-shaped turn evidence.
- `final.md`: human-readable final assistant output.

Do not add a separate judge facts, report facts, compatibility transcript, or parallel summary artifact. Reports, judges, and deterministic tests derive their summaries directly from `trajectory.json` or from existing run-level `facts.jsonl`.

## Non-Goals

- No compatibility shim for the old runner event scraping.
- No legacy parser fallback for alternate evidence shapes.
- No separate `turns.jsonl`, `usage.json`, `trajectory.jsonl`, judge-facts file, or report-facts file.
- No viewer UI in this change.
- No broad App Server protocol coverage beyond event families observed in fixtures or real traces.

## Target Shape

Create a small parser module, for example:

```ts
collectTurnEvents(events, { threadId, turnId }): TrajectoryTurn
```

The parser should preserve App Server vocabulary instead of inventing eval-only names:

- `threadId`
- `turnId`
- `status`
- `finalText`
- `tokenUsage`
- `items`
- `approvals`
- `unknownMethods`

`items` should keep App Server `ThreadItem.type` names where possible, especially `agentMessage`, `reasoning`, `plan`, `commandExecution`, `fileChange`, `mcpToolCall`, `dynamicToolCall`, `collabAgentToolCall`, and related observed item families.

Approval evidence should be represented as request lifecycle data from raw JSON-RPC direction, request id, method, params, response, and `serverRequest/resolved` when observed.

## Plan

### 1. Add the trajectory model and parser

Add a focused module under `plugins/meta-skill/src/app-server/` for trajectory types and parsing.

The parser must:

- Ignore events for the wrong `threadId` or `turnId`.
- Build final text from observed `agentMessage` deltas and completed agent message items.
- Capture `turn/completed` status.
- Capture `thread/tokenUsage/updated`.
- Capture observed tool, command, file, MCP, plan, reasoning, and approval event families.
- Preserve unknown observed methods as metadata without treating them as failures.

### 2. Persist `trajectory.json` from the runner

Update `plugins/meta-skill/src/app-server/runner.ts` so each case writes `trajectory.json` beside `rpc.jsonl` and `final.md`.

The runner should use the parser result as the source for:

- returned final text
- returned turn ids
- returned token usage
- returned trajectory path

Remove direct final-text and token scraping from `runner.ts` once the parser owns those responsibilities.

### 3. Switch reports and judges to trajectory evidence

Update `plugins/meta-skill/src/report.ts` to expose the trajectory path for each case and render a short trajectory summary only when `trajectory.json` exists.

Update `plugins/meta-skill/src/eval/judge.ts` so judge prompts can include a compact summary derived from `trajectory.json` when present. Do not persist that compact summary separately.

### 4. Hard-cut old structured evidence assumptions

Remove references to any planned or stale per-case structured behavior artifacts other than `trajectory.json`.

Keep `facts.jsonl` only for run lifecycle, check observations, feedback, and decisions. Do not add behavior trajectory rows to `facts.jsonl`.

### 5. Add focused tests

Add parser tests for:

- final text from deltas
- completed agent message fallback when observed
- turn completion
- token event present and missing
- wrong thread or turn ignored
- command execution item lifecycle
- file change item lifecycle
- approval request and resolution lifecycle
- unknown method preservation

Update runner/report/judge tests so they prove those consumers read `trajectory.json` rather than repeating App Server method filters.

### 6. Validate

Run:

```bash
npm test
npm run typecheck
git diff --check
```

If live App Server smoke tests are available and cheap, run the existing live-smoke path once to capture an observed trace and add only the observed event family fixtures needed by the parser.

## Done When

- `runner.ts`, `report.ts`, and `eval/judge.ts` no longer contain their own App Server behavior-event filters.
- New eval cases persist `trajectory.json`.
- `rpc.jsonl` remains raw and unchanged in purpose.
- No redundant structured behavior artifact is introduced.
- Tests cover the parser and the consumer handoff.

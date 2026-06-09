# Codex App Threads Runner Mini Spec

## Purpose

Meta Skill evals move from an in-process runner to a central plugin-level CLI
that can orchestrate Codex Desktop threads, Codex Exec trials, optional App
Server adapter trials, and read-only evidence extraction. The parent Codex
thread remains the visible cockpit for interactive work: it creates child
threads, optionally gives each child a fresh worktree, records the batch ledger,
and makes accept/reject decisions.

The agent-facing automation surface is the planned `meta-skill` CLI implemented
under `meta-skill/src/`. It is not the consultant UI. Consultants see the
natural-language flow in the parent thread; Codex uses the CLI behind that flow.
Supporting APIs, runner modules, and extraction modules exist behind the CLI to
reduce manual work and keep the parent from loading many child conversations
into context. Worker-local scripts are not durable public interfaces.

`codex_exec` and `codex_app_server` are different adapter shapes:

- `codex_exec` is fire-and-collect: prompt, JSONL stream, final message, exit.
- `codex_app_server` is a persistent, typed, bidirectional control plane.

Use `codex_app_server` through the official Python SDK as the primary workbench
runner. Keep `codex_exec` behind the same runner seam as the simple
fire-and-collect fallback.

## Why This Replaces The Old Runner

The previous app-server runner gave a controlled protocol: start a thread, send
turns, collect raw events, normalize transcript evidence, and write run files.
That was useful for repeatable evidence, but it made Meta Skill depend on a
runtime layer.

Codex Desktop threads already provide the product primitives Meta Skill actually
wants:

- isolated child conversations
- optional worktree isolation
- visible final answers
- parent-readable thread status
- follow-up messages to the same child
- separate child worktrees for competing attempts

The tradeoff is that Meta Skill must own orchestration state explicitly and
separate stable product/API contracts from local storage observation.

## Design Defaults

The final design choices are:

- **Desktop cockpit**: the parent Codex Desktop thread remains the user-facing
  control room.
- **Central CLI**: `meta-skill` commands are the agent-facing command layer for
  materialization, runs, progress, grading, validation, and packaging helpers.
- **App Server first**: batch evals, A/B runs, and future autoresearch use
  `codex_app_server` implemented through the Python SDK, while normalizing to
  the same run files.
- **Exec fallback**: simple fire-and-collect jobs and CI-like runs use
  `codex_exec`.
- **API-first support**: use official Codex SDK, app thread tools, or App
  Server/control-plane APIs where they are stable enough for the operation.
- **Read-only fallback extraction**: use SQLite and rollout JSONL only as a
  read-only observer when no stable API/export surface exists.
- **Small canonical artifacts**: keep `run.json` and `results.jsonl` as the
  core run record; reports and transcript projections are rebuildable views.
- **Human-gated promotion**: child worktrees can propose edits, but accepted
  source changes require parent judgment and user approval before merge,
  package, install, or publish.

The CLI is orchestration, not authority. It reads and writes the canonical
workbench files; it does not replace `evals.json`, case folders, run folders, or
git/worktrees as sources of truth.

Local App Server protocol references live under `docs/codex-app-server/`. They
were generated from `codex-cli 0.135.0` with experimental fields included. Treat
them as a version-pinned snapshot and regenerate before implementation. The
runtime adapter source belongs under `meta-skill/src/`; worker skills should
read `meta-skill/references/cli.md` rather than calling the App Server protocol
directly.

## Probe Findings

Two text-only probes were run.

Normal child:

```text
thread_id: 019ea3a7-7fde-77a3-a11a-fe4b0ba7b74d
cwd: /Users/rishi/Code/agent
result: candidate=A, status=completed, score=2/3, reason=clear but missing proof.
```

Worktree child:

```text
pending_worktree_id: local:7e065299-6524-4aff-80a6-5f5b6d30f75f
thread_id: 019ea3a7-96b0-7aa3-8993-031a3d5b0162
cwd: /Users/rishi/.codex/worktrees/94f3/agent
result: candidate=B, status=completed, score=3/3, reason=clear and includes proof.
```

The worktree path was not available immediately. Worktree-backed creation first
returned a pending id, then the resolved thread appeared in thread search with
its actual `cwd`.

Both probe threads were archived after inspection.

## V1 Data Model

Keep the run files small.

```text
.meta-skill/runs/<run-id>/
  run.json
  progress.jsonl
  events/
    <trial-id>.jsonl
  results.jsonl
  grades.jsonl
  candidates/
    <candidate>/
```

`run.json` is the control ledger:

```json
{
  "run_id": "skill-eval-001",
  "parent_thread_id": "019...",
  "status": "running",
  "concurrency": 5,
  "control_strategy": "codex-desktop-parent",
  "extraction_strategy": "api-first-sqlite-fallback",
  "candidates": [
    {
      "candidate": "current",
      "display": "Current",
      "source_type": "git-ref",
      "source_ref": "HEAD",
      "base_commit": "abc123",
      "payload_digest": "sha256:...",
      "model": "thread-default",
      "reasoning_effort": "thread-default"
    },
    {
      "candidate": "attempt-1",
      "display": "Attempt 1",
      "source_type": "worktree",
      "source_ref": "/Users/rishi/.codex/worktrees/94f3/agent",
      "base_commit": "abc123",
      "payload_digest": "sha256:...",
      "model": "thread-default",
      "reasoning_effort": "thread-default"
    }
  ],
  "trials": [
    {
      "case_id": "case-a",
      "trial_id": "case-a.current.t1",
      "candidate": "current",
      "repetition": 1,
      "status": "completed",
      "thread_id": "019...",
      "pending_worktree_id": null,
      "cwd": "/Users/rishi/Code/agent",
      "mode": "local",
      "extraction": {
        "source": "codex-api|app-server|sqlite-rollout",
        "confidence": "high|medium|low",
        "missing_fields": []
      }
    },
    {
      "case_id": "case-b",
      "trial_id": "case-b.attempt-1.t1",
      "candidate": "attempt-1",
      "repetition": 1,
      "status": "pending_worktree",
      "thread_id": null,
      "pending_worktree_id": "local:...",
      "cwd": null,
      "mode": "worktree"
    }
  ]
}
```

`results.jsonl` is append-only:

```jsonl
{"case_id":"case-a","trial_id":"case-a.current.t1","candidate":"current","thread_id":"019...","status":"completed","decision":"partial","summary":"clear but missing proof"}
{"case_id":"case-b","trial_id":"case-b.attempt-1.t1","candidate":"attempt-1","thread_id":"019...","status":"completed","decision":"accepted","summary":"clear and includes proof"}
```

Optional projections may be generated from the ledger, stable APIs when
available, or read-only fallback observation:

```text
.meta-skill/runs/<run-id>/
  threads.jsonl
  scores.jsonl
  report.md
  report.html
```

Do not persist copied raw transcripts, full diffs, or debug folders by default.
The Codex thread and worktree remain the heavy evidence surface. The ledger and
projections store only enough state for the parent to continue the batch,
summarize outcomes, and drill into exceptions.

## State Machine

```text
queued
-> spawning
-> pending_worktree
-> running
-> awaiting_approval
-> collecting
-> parsed
-> scored
-> completed

spawning -> spawn_failed
pending_worktree -> resolve_failed
running -> blocked
running -> errored
running -> timed_out
running -> interrupted
running -> compacted
collecting -> missing_result
collecting -> parse_failed
collecting -> extraction_degraded
completed -> follow_up_sent
completed -> sibling_spawned
completed -> archived
completed -> accepted_pending_handoff
completed -> rejected_preserved
completed -> merged
any -> terminal_unknown
```

`pending_worktree_id` is a first-class state. It is not an error. Extraction
states are separate from child-task states: a child can complete successfully
while extraction is degraded or missing nonessential telemetry.

## Parent Flow

1. Create `run.json`.
2. Convert eval cases or research tasks into child prompts.
3. Spawn up to the concurrency limit.
4. Record `thread_id` immediately for local child threads.
5. Record `pending_worktree_id` for worktree child threads.
6. Poll/list/read until pending worktrees resolve to child threads.
7. Mark ready children `collecting`.
8. Run API-first extraction to fold child threads into compact evidence.
9. Parse the child result block from the final answer.
10. Append a compact row to `results.jsonl`.
11. Score results against criteria or compare candidates.
12. Continue same child for follow-up, spawn a sibling, or accept/reject a
    candidate worktree.

## Child Result Contract

Every child prompt should ask for a small structured result block at the end.
The parent should not scrape unconstrained prose.

```json
{
  "codex_thread_result": {
    "schema_version": 1,
    "run_id": "skill-eval-001",
    "task_id": "case-a",
    "trial_id": "case-a.current.t1",
    "candidate": "current",
    "status": "completed",
    "decision": "accepted|rejected|partial|review-required|follow-up",
    "score": "3/3",
    "changed_files": [],
    "worktree": {
      "mode": "local|codex-managed|manual-git-worktree|scratch-copy",
      "cwd": "/Users/rishi/Code/agent",
      "git_head": "abc123",
      "branch": "main",
      "dirty": false
    },
    "validation": [
      {
        "name": "manual review",
        "outcome": "passed|failed|skipped",
        "notes": "short note"
      }
    ],
    "evidence": "short evidence summary",
    "risks": [],
    "next_action": "one concrete next action"
  }
}
```

The human summary can follow the JSON block. The JSON block is the parent
contract.

## Control And Extraction

Control and extraction are support machinery. They should make the Codex Desktop
workflow scale without becoming a hidden eval runner.

Control priority:

1. **Central CLI with App Server Python SDK**: use for repeatable batch evals,
   A/B runs, and future autoresearch.
2. **Codex Desktop parent tools**: the parent thread creates, continues, reads,
   and compares visible child threads when human inspection is the point.
3. **Codex Exec**: use for simple fire-and-collect fallback jobs.
4. **Manual parent orchestration**: fallback when no stable programmatic surface
   exists.

Extraction priority:

1. Persist App Server SDK turn results and event streams during the run.
2. Use official Codex thread read/export APIs where available.
3. Fall back to local SQLite and rollout JSONL as a read-only observer.
4. Never write to Codex local storage.

Extraction is a V1 pillar because it keeps the parent thread from loading 30
child conversations into context just to produce a scoreboard.

Observed local surfaces:

- `~/.codex/state_5.sqlite` is the observed local fallback index. `threads` maps `id` to
  `rollout_path`, `cwd`, title, preview, archived state, token totals, model,
  effort, git branch, and git sha. `thread_spawn_edges` records parent-child
  thread relationships.
- `~/.codex/sessions/**/rollout-*.jsonl` and
  `~/.codex/archived_sessions/rollout-*.jsonl` are the raw per-thread event
  logs.
- `~/.codex/session_index.jsonl` is a fallback index with thread id, name, and
  update time.
- `~/.codex/logs_2.sqlite` and `~/.codex/goals_1.sqlite` can enrich failures
  and goal usage, but they are optional diagnostics.

What an extractor could do:

1. Read `run.json`.
2. Resolve known `thread_id` values through the best available API or fallback
   index.
3. Resolve `rollout_path`, `cwd`, title, archived state, tokens, model, effort,
   branch, and git sha when available.
4. Parse API events or rollout JSONL as the raw event source.
5. Fold events into a normalized transcript projection.
6. Extract the final assistant message or explicit unavailable-final marker.
7. Parse `codex_thread_result`.
8. Join worktree metadata with `git status`, `git rev-parse HEAD`, and diffstat.
9. Record `extraction_source`, `field_confidence`, `missing_fields`,
   `rollout_digest`, and `redaction_applied`.
10. Refresh `threads.jsonl`, append or refresh `results.jsonl`, and optionally
    generate `scores.jsonl`, `report.md`, or `report.html`.

Recoverable telemetry:

- thread summaries, titles, previews, cwd, model, effort, archived state
- parent-child thread edges
- raw protocol-like events from rollout JSONL
- normalized transcript evidence from messages, tool calls, and outputs
- final assistant answer
- per-turn timing from task start/complete events
- token totals from thread rows and token-count events
- tool execution evidence and patch-apply events
- abort/error hints from rollout events and optional diagnostic logs

Risks:

- local storage is an implementation detail
- schemas and event names can change
- raw logs can contain sensitive prompts, command output, diffs, and tool data
- compaction makes full continuity harder to reconstruct
- archived and active sessions live in different folders
- fallback local observation cannot call Codex app thread tools unless Codex
  exposes them outside the agent tool plane
- product-level status is still inferred from events, not guaranteed by a
  runner API
- skill trigger proof remains weaker than a dedicated harness

Recommended V1:

- parent thread owns orchestration and decisions
- extractor owns evidence collection, transcript folding, telemetry projection,
  result parsing, and report rendering
- extractor rows label source, confidence, missing fields, redaction, and
  degraded evidence
- raw rollout JSONL is referenced by path and digest, not copied by default
- parent reads compact ledgers and reports, then opens full child threads only
  for missing results, close calls, or failures

## Fallback Gaps Versus App Server

When the CLI falls back to Desktop-only or `codex_exec` orchestration, preserve
these gaps explicitly in the report instead of pretending the evidence is equal.

| App Server gives | Fallback has | Gap |
|---|---|---|
| direct protocol event stream | API/App Server events when available; rollout JSONL fallback | recoverable, but fallback storage schema is private |
| deterministic transcript normalization | API/export or extractor-folded transcript projection | recoverable if parser is maintained |
| synchronous start/run API | async thread/worktree creation | must model pending worktrees |
| per-turn token usage | API/App Server token events or fallback aggregates | mostly recoverable, semantics may drift |
| runtime-controlled skill attachment | child prompt and installed skill routing | trigger proof is less controlled |
| local evidence files by default | threads/worktrees plus compact projections | portable summaries, raw evidence stays local |
| runner-owned timeout/error handling | parent polling and status checks | needs explicit state machine |

The big win is product fit: child threads are visible, inspectable, followable,
and naturally parallel. The big loss is public API stability. With extraction,
most useful telemetry can be recovered locally.

## Eval And Improvement Flow

Use a flat comparison model:

```text
run
  candidates:
    current
    attempt-1
    attempt-2
  trials:
    <case> x <candidate> x <repetition>
```

Candidates are the things under test. A candidate records `candidate`,
`source_type`, `source_ref`, `base_commit`, `payload_digest`, optional worktree,
model, effort, and optional thread id. Use `candidate`, not `candidate_id`.
Use `trial_id` for one execution of one case under one candidate. This prevents
accidental comparisons between drifting prompts, payloads, models, or source
states.

Solver children get exactly one candidate and one case. They must not see sibling
outputs, parent hypotheses, expected answers, or hidden criteria. Judge children
score anonymized outputs when practical.

Baseline comparison:

1. Run `no_skill` or plain-prompt baseline when useful.
2. Run `current_payload` from a pinned git ref or clean snapshot.
3. Run candidates in separate worktrees.
4. Extract results and telemetry.
5. Score against criteria.
6. Compare score, evidence quality, regressions, and trigger boundary behavior.

Auto-improvement loop:

1. Run baselines on a small eval set.
2. Parent diagnoses failures from compact results and selected drill-downs.
3. Spawn one editor child in a worktree to make the smallest candidate edit.
4. Run candidate against the same evals plus holdouts the editor did not see.
5. Spawn a judge/reviewer child to score outputs.
6. Accept only if the candidate improves target failures, avoids regressions,
   passes deterministic checks, and preserves trigger boundaries.
7. Stop after a fixed iteration cap or when no evidence-backed edit remains.

Promotion remains human-gated. Auto-improve can create candidate branches and
evidence, but should not merge, package, install, or publish without approval.

Promotion protocol:

1. Extract the candidate result, diffstat, checks, and worktree state.
2. Preserve accepted work by branch, commit, patch, or source merge plan.
3. Run regression or holdout children that the editor child did not see.
4. Parent recommends accept, revise, rerun, or discard.
5. User approves source changes.
6. Apply or merge accepted changes into the source repo.
7. Record final source commit and decision in `run.json`.

## Isolation And Git

Default modes:

- `local-thread`: fastest for read-only reviews and sampling. It is weak
  evidence for edits because there is no file isolation.
- `worktree-thread`: default for edit attempts. Codex creates worktrees under
  `~/.codex/worktrees/<slug>/<repo>`; treat location as Codex-controlled unless
  the thread API adds a path parameter.
- `manual-git-worktree`: use only when location control matters. The parent or
  user creates a named worktree under a controlled path, then starts a thread
  there.
- `scratch-copy`: fallback for non-git folders. It has a weaker merge story.

Use no branch for read-only comparisons. Use worktrees for candidate edits. Use
commits when a version must be reproducible across runs or reviewed later. Use
branches when a candidate needs multiple iterations or human review.

Results move back into the repo by parent decision: inspect child result,
inspect worktree diff/status, then ask follow-up, spawn sibling, manually apply,
or merge accepted changes. No automatic merge in V1.

## Reporting

Canonical output stays small:

```text
.meta-skill/runs/<run-id>/
  run.json
  results.jsonl
```

Generated reporting can add:

```text
.meta-skill/runs/<run-id>/
  threads.jsonl
  scores.jsonl
  report.md
  report.html
```

`report.md` is the default handoff because it is readable in Codex, git diffs,
and terminals. It should show run status, score matrix, attempt comparison,
worktree table, diffstat, validation summary, unresolved follow-ups, and thread
ids.

`report.html` is an optional static dashboard generated from JSON/JSONL. It can
show status lanes, score heatmaps, attempt cards, changed files, and filters for
failed, review-required, or edited attempts. It is a rebuildable view, not
canonical evidence.

## Parent Context Policy

The parent thread must not read every child transcript by default.

- Child prompts require a compact result block.
- Extraction produces one compact row per attempt plus drill-down references.
- Parent opens full child threads only for missing results, close calls,
  high-impact failures, accepted candidates, or user-requested inspection.
- Judge children receive anonymized or bounded outputs when practical.
- Reports cite thread ids, worktree paths, and raw evidence digests instead of
  embedding raw conversations.

## Local Verification Before Implementation

Before implementing an extractor or control adapter, verify:

- current Codex version and available SDK/App Server/control APIs
- whether API-created threads appear in Codex Desktop
- whether API-created threads appear in local thread indexes
- whether parent-child edges are recorded for parent-spawned children
- local child, worktree child, and pending worktree resolution behavior
- extraction fidelity against the visible transcript for one thread
- compaction behavior and degraded transcript states
- archive behavior and whether rollout paths move
- worktree dirty state, branch, HEAD, untracked files, and cleanup behavior
- approval, declined approval, interrupted turn, failed command, and timeout
  event shapes
- 10-child and 30-child batch behavior using compact parent summaries only

## Skill-Facing Operations

These are not shell commands. They are operations the Meta Skill guidance should
teach future agents to perform.

### Start A Run

Use when the user wants evals, comparison, auto-research, or iterative
improvement.

Agent behavior:

- choose a `run_id`
- create `.meta-skill/runs/<run-id>/run.json`
- write task entries with `queued` status
- explain the concurrency limit

### Add Cases

Use when turning `.meta-skill/eval-scenarios.md`, feedback, or research goals
into child tasks.

Agent behavior:

- write realistic child prompts
- keep hidden criteria out of solver-visible prompts
- include the child result contract
- mark tasks `queued`

### Spawn Attempts

Use when launching children.

Agent behavior:

- create local or worktree child threads
- record `thread_id` or `pending_worktree_id`
- mark status `spawning`, `pending_worktree`, or `running`
- do not rely on search as the source of truth

### Verify Codex Integration

Use before relying on a new control or extraction surface.

Agent behavior:

- record Codex version and available thread/control APIs
- confirm whether SDK/API-created threads are visible in Codex Desktop
- compare visible thread state with extracted thread state
- record degraded or unavailable operations in `run.json`

### Resolve Pending Worktrees

Use after worktree thread creation returns only a pending id.

Agent behavior:

- list/search recent threads for the project/worktree
- match by prompt/title/cwd when needed
- record resolved `thread_id` and `cwd`
- keep unresolved tasks in `spawning`

### Collect Results

Use when children are idle or after a user asks for status.

Agent behavior:

- run API-first extraction for known child `thread_id` values
- refresh `threads.jsonl` and compact telemetry projections when requested
- parse child result blocks from final answers
- append or refresh rows in `results.jsonl`
- mark task status
- report missing or unparsable result blocks

### Extract Telemetry

Use when the parent needs evidence without loading child threads into context.

Agent behavior:

- use stable thread read/export APIs when available
- use App Server read/list/turn/event APIs when available
- fall back to `~/.codex/state_5.sqlite` and rollout JSONL only as a read-only
  observer
- fold messages, tool calls, timing, token counts, and errors into compact rows
- keep raw rollout JSONL as a path plus digest, not a copied artifact
- redact or omit large tool outputs by default
- label every field with source and confidence when it came from fallback local
  storage

### Compare Candidates

Use when multiple children answer the same task across candidates.

Agent behavior:

- compare child result rows
- cite child thread ids
- compare candidate identity fields before comparing scores
- prefer evidence-backed decisions over score-only decisions
- choose accepted, rejected, partial, review-required, or follow-up

### Promote Candidate

Use when a child worktree appears good enough to preserve or merge.

Agent behavior:

- inspect worktree dirty state, branch, HEAD, changed files, and diffstat
- run or request regression/holdout checks before recommending acceptance
- preserve accepted work by branch, commit, patch, or source merge plan
- ask for user approval before merging, packaging, installing, or publishing
- record final source commit when accepted changes land

### Render Report

Use when the run needs a human-readable status view.

Agent behavior:

- generate `report.md` from `run.json`, `results.jsonl`, and optional
  `threads.jsonl` / `scores.jsonl`
- show score matrix, attempt comparison, worktree table, validation summary, and
  unresolved follow-ups
- generate `report.html` only when a visual dashboard is useful
- treat reports as rebuildable projections, not canonical evidence

### Continue Child

Use when the best next move is clarification or repair in the same context.

Agent behavior:

- send a follow-up to the same `thread_id`
- record the follow-up in `run.json`
- collect another result row when complete

### Spawn Sibling

Use when the parent wants a fresh independent attempt.

Agent behavior:

- create a new child from the same case brief
- optionally use a new worktree
- link it to the same `case_id` with a new `trial_id`
- compare siblings after completion

### Close Run

Use when all tasks are completed, blocked, or intentionally stopped.

Agent behavior:

- ensure every task has a terminal status or a reason it remains open
- summarize decisions from `results.jsonl`
- state what threads/worktrees remain as evidence
- do not archive child threads unless the user asks

## Naming

Possible product names:

- Codex Threads Runner
- Codex App Threads
- Codex Chat Runner
- Codex Child Threads

Recommended name: **Codex Threads Runner**.

It says what it is without overpromising a separate product surface.

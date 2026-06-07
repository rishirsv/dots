# Codex Threads Runner

Use this reference when Meta Skill work needs compact evidence from multiple
Codex child threads. The parent Codex Desktop thread remains the visible
orchestrator. `msk` only records expected child attempts, extracts structured
child results, and prints compact counts.

This is not an App Server, hidden local runner, dashboard, worktree manager, or
promotion system.

When a compact evidence pass is needed locally, run:

```text
msk init
msk run new <run-id>
msk run add-thread <run-id> --task <task-id> --thread <thread-id> [--attempt <attempt-id>]
msk run extract <run-id> --thread-export <path>... [--rebuild|--append]
msk run check <run-id>
```

## Canonical Run Files

Keep the durable artifact model small:

```text
.meta-skill/runs/<run-id>/
  run.json
  results.jsonl
```

`run.json` is the control ledger for expected child attempts: task id, attempt
id, thread id, and status.

`results.jsonl` is compact evidence: one row per expected child attempt with
task id, attempt id, thread id, status, summary, and whether extraction
degraded.

Do not copy raw transcripts, full diffs, generated reports, or debug folders by
default. The child thread remains the heavy evidence surface. The parent reads
`results.jsonl` and `msk run check` first, then opens raw child threads only for
degraded rows, surprising results, or user-requested audit.

## Parent Flow

1. Choose a `run_id` and create `run.json`.
2. Convert eval cases, feedback, or research tasks into child prompts.
3. Include the minimal `codex_thread_result` JSON block contract in every child
   prompt.
4. Spawn child threads through Codex Desktop.
5. Record each `thread_id` immediately with `msk run add-thread`.
6. Export or read the child threads through an available read-only thread API.
7. Run `msk run extract` to write compact rows.
8. Run `msk run check` and inspect raw threads only for flagged rows.

The parent should not read every child transcript. If many evaluations ran, the
compact rows are the normal review surface.

## Child Result Contract

Ask every child to end with a parseable JSON block shaped like:

```json
{
  "codex_thread_result": {
    "schema_version": 1,
    "run_id": "skill-eval-001",
    "task_id": "case-a",
    "attempt_id": "case-a.1",
    "thread_id": "thread-id",
    "status": "completed",
    "summary": "short result summary"
  }
}
```

The human summary can follow the JSON block. The JSON block is the parent
contract. If the block is missing or incomplete, extraction writes a degraded
row with `status: "missing-result"` and an empty summary.

## Extraction

Extraction keeps the parent from loading many child conversations into context.
Use this priority:

1. Stable Codex thread read/export APIs when available.
2. Available local control-plane read/list/turn/event APIs when stable enough.
3. Local thread indexes and rollout logs only as read-only fallback observation.
4. Manual parent inspection when no stable programmatic surface exists.

Never write to Codex local storage. Label fallback rows as degraded. Reference
raw rollout logs by path instead of copying them into the run folder.

## Boundaries

`msk` does not manage variants, scores, decisions, validation arrays, worktrees,
promotion, packaging, install, publish, or thread creation in this slice. Those
can be added later only if compact extraction proves useful.

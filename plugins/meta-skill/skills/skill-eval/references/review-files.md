# Eval Files And Evidence

Read this when inspecting or explaining `.meta-skill/evals/`, cases, run bundles, deterministic tests, judge results, or feedback.

## Workbench Layout

```text
.meta-skill/
  evals/
    evals.json
    cases/
      R1-basic-task/
        case.md
        fixtures/       optional
    judges/
    runs/
  tests/
    manifest.json
    unit/
    eval/
```

## Eval Manifest

`.meta-skill/evals/evals.json` records suite metadata and defaults:

```json
{
  "schema_version": 1,
  "skill_name": "source-pack-triage",
  "suite": {
    "name": "default",
    "description": "Behavior, gates, and known failure-mode coverage."
  },
  "cases": {
    "path": "cases"
  },
  "defaults": {
    "runner": "app_server",
    "run_source": "working_payload",
    "timeout_ms": 120000
  }
}
```

## Case Files

Folder names are the source of truth for identity and type:

```text
R1-stock-lookup
F1-complicated-multiturn
G1-human-approval-stop
```

The leading ID becomes the case ID. Its first letter derives the type:

- `R` -> `regression`
- `F` -> `failure_mode`
- `G` -> `gate`

Each case requires one `case.md`:

```md
---
title: Stock lookup with source evidence
topics:
  - source-faithfulness
capability: Read a source pack and answer with grounded claims.
fixtures:
  - path: fixtures/source-pack.md
    description: Source material visible to the solver.
criteria:
  what_it_tests: Source-grounded final answer behavior.
  expected_behavior: Uses source evidence for material claims.
  assertions:
    - Answers directly.
    - Cites the source pack for material claims.
  tests:
    - source-citations-present
  judges:
    - id: final-answer-quality
      threshold:
        overall_min: 4
---

## Task

Use `fixtures/source-pack.md` to answer the user's question.

## Turn 2

Now tighten the recommendation for an executive reader.
```

`fixtures` must be declared in frontmatter and must point under `fixtures/`. Lint fails both declared-but-missing files and present-but-undeclared files so reports can trust what was solver-visible.

Cases may have no tests or judges, but that makes them manual-review only and should be reported as a warning.

## Test Manifest

`.meta-skill/tests/manifest.json` maps stable test IDs to commands:

```json
{
  "schema_version": 1,
  "tests": [
    {
      "id": "extract-sources-unit",
      "kind": "unit",
      "command": "uv run pytest .meta-skill/tests/unit/test_extract_sources.py",
      "description": "Unit tests for scripts/extract_sources.py."
    },
    {
      "id": "source-citations-present",
      "kind": "eval",
      "command": "node .meta-skill/tests/eval/source-citations-present.test.js"
    }
  ]
}
```

Use `unit` for runtime scripts and helpers. Use `eval` for checks against saved run evidence.

When eval tests are run as part of a saved run, the CLI sets:

- `META_SKILL_RUN_ID`
- `META_SKILL_RUN_ROOT`
- `META_SKILL_PROJECT_ROOT`

Eval tests should inspect those exact paths instead of sorting `.meta-skill/evals/runs/` or assuming the latest run.

## Run Bundle

Each run writes:

```text
.meta-skill/evals/runs/<run-id>/
  run.json
  events.jsonl
  results.jsonl
  tests.jsonl
  grades.jsonl
  feedback.jsonl
  report.json
  report.html
  snapshots/
    <case-folder>/
      case.md
      fixtures/          optional
      snapshot.json
  cases/
    <case-folder>/
      stage/
        fixtures/        optional
        skill/           when a skill payload is attached
      rpc.jsonl
      thread.json
      turns.jsonl
      usage.json
      final.md
```

`run.json` is the plan. `events.jsonl` is the chronological execution ledger. `results.jsonl` is derived summary data. `tests.jsonl`, `grades.jsonl`, and `feedback.jsonl` are append-only annotation streams.

`snapshots/<case-folder>/` stores evaluator-side `case.md` and declared fixtures as they existed when the run started. Judges read these snapshots with saved final outputs.

`report.json` is the normalized view consumed by `report.html`, `eval open --json`, and the runs `index.json`. It contains run summary, case attempts, tests, judges, feedback, and readiness.

`runs/index.json` stores one summary row per run for `eval open --list`, `eval list`, and future local evidence browsers.

The staged solver workspace includes `fixtures/` when present and the staged skill payload when a skill source is used. It does not include `case.md`; task text travels in turn messages, and frontmatter criteria remain evaluator-only.

`usage.json` is the canonical structured token evidence for a case. It records `schema_version`, `source_event`, a nullable numeric case summary, one `unavailable_reason` when telemetry is missing, and compact per-turn `tokenUsage.last` / cumulative `tokenUsage.total` data when a token event is observed. `turns.jsonl` is transcript evidence only. `results.jsonl` does not carry token summaries.

`rpc.jsonl` is the durable raw App Server trace. The runner keeps only a bounded in-memory event window for current waits, final text, and token extraction. If that window overflows, `rpc.jsonl` includes a `meta-skill/eventBufferOverflow` warning marker and case evidence may include `evidence_warnings`; use the raw trace for follow-up trajectory parsing instead of assuming all events remained resident.

For multi-turn cases, the case summary uses App Server cumulative `tokenUsage.total` from the final reporting turn as authoritative. Do not sum per-turn `last` values when explaining case totals. Compare multiple runs only in a separate report-level artifact; do not pool separate executions into one run total.

Every case should have `usage.json`. If exact usage is unavailable, its summary fields should be null and `unavailable_reason` should say why.

Managed App Server JSON-RPC requests are single-shot. Do not describe overload handling as exponential backoff, jitter, or a configurable retry policy. If the stdio process exits, active work is rejected and the runner may make one case-level respawn attempt before preserving unavailable evidence.

Case results record execution facts separately from verdict facts. `execution_status: "completed"` means the runner produced evidence; it is not a passing result. If no deterministic test, judge, or human feedback verdict is present, reports say no verdict is recorded.

## Evidence Claims

| Claim | Required support |
|---|---|
| Execution completed | `results.jsonl` case status plus `final.md`, `turns.jsonl`, and `thread.json` |
| Deterministic pass | `tests.jsonl` rows with passing eval tests and no lint/test failures |
| Judge pass | `grades.jsonl` rows where thresholds are satisfied; threshold failure overrides a judge's raw `pass: true` |
| Human pass | `feedback.jsonl` rows with reviewer label, notes, and case |
| Release-ready | Fresh `report.json` readiness, human approval, and release metadata such as `release --from-run <run-id>` |

## Feedback

Feedback rows are append-only JSONL. Use labels such as `pass`, `fail`, and `defer`. `defer` is a human label, not a framework result status.

When feedback motivates an edit, cite the run ID, case ID, label, first failure step, and notes in the improvement plan.

# Eval Files And Evidence

Read this when inspecting or explaining `.meta-skill/evals/`, scenarios, run bundles, deterministic tests, judge results, or feedback.

## Workbench Layout

```text
.meta-skill/
  evals/
    evals.json
    scenarios/
      R1-basic-task/
        task.md
        scenario.json
        criteria.json
        turns.json        optional
        capability.txt   optional
        resources/       optional
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
    "description": "Behavior, routing, gates, and known failure-mode coverage."
  },
  "scenarios": {
    "path": "scenarios"
  },
  "defaults": {
    "runner": "app_server",
    "compare": "none",
    "timeout_ms": 120000
  }
}
```

## Scenario Files

Folder names use strict ID plus slug:

```text
R1-stock-lookup
F1-complicated-multiturn
T1-nonactivation-boundary
G1-human-approval-stop
```

Required files:

- `task.md`: initial user turn
- `scenario.json`: metadata, family, type, topics, resources
- `criteria.json`: assertions, tests, judges, thresholds

Optional files:

- `turns.json`: follow-up user turns as an array of `{ "content": "..." }`
- `capability.txt`: human note for reports
- `resources/`: scenario-private files copied into the staged workspace

Families are strict:

- `R` -> `regression`
- `F` -> `failure_mode`
- `T` -> `trigger`
- `G` -> `gate`

Types are `behavior`, `trigger`, `artifact`, or `gate`.

## Criteria

```json
{
  "schema_version": 1,
  "what_it_tests": "Multi-turn prioritization and recommendation quality",
  "expected_behavior": "Completes the workflow efficiently and stays source-grounded.",
  "assertions": [
    "Uses source evidence for material claims.",
    "Answers the follow-up turn directly."
  ],
  "tests": ["source-citations-present"],
  "judges": [
    {
      "id": "recommendation-quality",
      "threshold": {
        "overall_min": 4
      }
    }
  ]
}
```

Scenarios may have no tests or judges in v1, but that makes them manual-review only and should be reported as a warning.

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
  report.html
  scenarios/
    <scenario-folder>/
      candidate/
        rpc.jsonl
        thread.json
        turns.jsonl
        final.md
        artifacts/
      release/
        ...
```

`run.json` is the plan. `events.jsonl` is the chronological execution ledger. `results.jsonl` is derived summary data. `tests.jsonl`, `grades.jsonl`, and `feedback.jsonl` are append-only annotation streams.

Every result should include token usage fields. If exact usage is unavailable, the fields should explicitly say unavailable and why.

## Feedback

Feedback rows are append-only JSONL. Use labels such as `pass`, `fail`, `needs_review`, and `defer`. `defer` is a human label, not a framework result status.

When feedback motivates an edit, cite the run ID, scenario ID, side, label, first failure step, and notes in the improvement plan.

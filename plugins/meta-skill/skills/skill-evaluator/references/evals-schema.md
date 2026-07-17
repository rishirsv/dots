# Evaluation Suite Schema

Read this before creating or changing
`<skill-name>/.<skill-name>/evals/evals.json` for the MetaSkill CLI.

## Minimal Diagnostic Suite

```json
{
  "schema_version": 2,
  "skill_name": "example-skill",
  "evaluation_mode": "diagnostic",
  "target": {"type": "skill", "ref": "SKILL.md"},
  "defaults": {
    "runner": "codex_exec",
    "repetitions": 1,
    "repetition_policy": "all_trials",
    "timeout_seconds": 600
  },
  "candidates": [
    {
      "candidate": "no-skill",
      "display": "No skill baseline",
      "source": {"kind": "none"}
    },
    {
      "candidate": "current",
      "display": "Current skill",
      "source": {"kind": "current_worktree", "ref": "."}
    }
  ],
  "evals": [
    {
      "id": "create-monthly-forecast",
      "type": "capability",
      "outcome": "artifact",
      "priority": "high",
      "prompt": "Build a monthly forecast from the attached historical results and assumptions.",
      "expected_output": "A usable forecast workbook with linked formulas, reconciled totals, and clearly identified assumptions.",
      "expectations": [
        "The workbook covers every requested forecast period.",
        "Forecast calculations use formulas rather than hard-coded outputs.",
        "The forecast reconciles to the supplied historical totals."
      ],
      "graders": [
        {"kind": "human", "id": "forecast-review", "metric": "forecast-quality"}
      ]
    }
  ]
}
```

When `candidates` is omitted, MetaSkill supplies the no-skill and current-skill
candidates shown above. Expectations without an explicit grader are advisory
only and make a durable suite fail `--check`.

## Evaluation Modes

| `evaluation_mode` | Contract |
|---|---|
| `diagnostic` | Focused observation. Usually one to three cases; one repetition is allowed. |
| `readiness` | General capability estimate. At least 20 selected cases, `coverage_requirements`, coverage tags on every case, and at least three repetitions. |
| `benchmark` | Readiness contract plus `benchmark` provenance, development and held-out splits, contamination controls, and one selected split per run. |

Readiness and benchmark suites use `defaults.repetition_policy`:

- `any_trial`: the case succeeds when any repeated trial passes;
- `all_trials`: the case succeeds only when every repeated trial passes.

A readiness suite declares the dimensions it claims to cover:

```json
{
  "evaluation_mode": "readiness",
  "validity_review": {
    "status": "pass",
    "notes": "Cases are solvable, graders match the claim, the harness represents production, and no material shortcuts are known."
  },
  "coverage_requirements": ["common-path", "boundary", "near-miss", "regression"],
  "defaults": {"repetitions": 3, "repetition_policy": "all_trials"}
}
```

Every case then sets one or more matching `coverage` tags.
`validity_review.status` is `pass`, `fail`, or `unknown`. Only `pass` supports a
readiness or comparative benchmark claim.

A benchmark suite also declares:

```json
{
  "evaluation_mode": "benchmark",
  "benchmark": {
    "name": "Named benchmark",
    "source": "Repository, dataset, or immutable local snapshot",
    "version": "release or snapshot identifier",
    "held_out_split": "test",
    "contamination_controls": "How held-out prompts remain unavailable during development.",
    "freshness": "When and how relevance and possible training contamination were reviewed."
  }
}
```

Every benchmark case sets `split` and may set an ISO `created_at` date. Run
exactly one split with `--split`. Public benchmark cases without dates produce
a freshness warning.

## Candidate Fields

Each candidate needs a unique `candidate`, optional `display`, and `source`:

| `source.kind` | Required source field |
|---|---|
| `none` | No `ref` or `path`; reserved for candidate `no-skill`. |
| `current_worktree` | Optional `ref: "."`; freezes the current skill tree. |
| `local_path` | `path` or `ref` naming the local candidate directory. |
| `git_ref` | `ref` naming a commit, tag, branch, or other Git revision. |

For a revision comparison, declare both versions and run with `--baseline
current --candidates proposed`. Candidate IDs select declared sources; they do
not define new sources.

## Case Fields

| Field | Contract |
|---|---|
| `id` | Required unique identifier. |
| `prompt` | Required string, or `{"path":"task.md"}`. |
| `expected_output` | Optional string, or `{"path":"expected.md"}`. It is reference evidence, not a hidden requirement. |
| `expectations` | Optional observable criteria. They do not choose the grader. |
| `type` | Optional: `attached`, `near_miss`, `capability`, `regression`, or `failure`. |
| `outcome` | `response`, `artifact`, or `stateful`; defaults to `response`. |
| `priority` | Optional: `high`, `medium`, or `low`. |
| `coverage` | Coverage tags required for readiness and benchmark cases. |
| `repetitions` | Optional case-level repetition count. |
| `split` | Selection label; required for benchmark cases. |
| `created_at` | Optional ISO date used for benchmark freshness review. |
| `fixtures` | Files or directories copied into the worker workspace. |
| `graders` | Explicit deterministic, model, or human graders. |
| `grader_tests` | Known-Pass and known-Fail outcome fixtures for deterministic graders. |
| `state_capture` | Hidden script that snapshots world state before and after a stateful trial. |
| `annotations` | Reviewed notes with `tag`, `note`, and optional `judge_use`. |

## Graders

Every grader requires `kind` and a stable `id`; set `metric` when it differs
from the ID. `advisory: true` excludes a grader from a Pass verdict.

### Deterministic grader

```json
{
  "kind": "code",
  "id": "workbook-validator",
  "metric": "workbook-correctness",
  "path": "validate.py"
}
```

A load-bearing exact code grader needs one Pass and one Fail fixture:

```json
"grader_tests": [
  {
    "id": "oracle",
    "grader": "workbook-validator",
    "expected": "pass",
    "path": "grader-tests/oracle"
  },
  {
    "id": "negative-hardcoded-values",
    "grader": "workbook-validator",
    "expected": "fail",
    "path": "grader-tests/negative-hardcoded-values"
  }
]
```

Each fixture directory contains `response.md`, optional `events.jsonl`, and an
optional `artifacts/` tree. A state-aware grader also sets `uses_state: true`
and each fixture contains `before-state.json` and `after-state.json`.

The validator receives `--output`, `--events`, `--artifacts`, optional
`--expected`, optional `--before-state`, optional `--after-state`, and `--json`.
It exits zero and returns positive `total` with `passed == total` only for a
Pass. `eval run --check` executes every declared grader test.

For an open-ended result, set `scope: "open_ended"` and `advisory: true`.
Provide at least two materially different valid fixtures and one invalid
fixture, then use a human or calibrated model grader for the verdict. This
keeps a narrow validator from rejecting valid alternatives.

### Model grader

An uncalibrated model grader must be advisory:

```json
{
  "kind": "model",
  "id": "quality-feedback",
  "metric": "quality",
  "path": "judge.md",
  "advisory": true
}
```

A load-bearing model grader pins `model` and `reasoning_effort` and includes the
held-out `calibration` record described in
[validate-judge.md](validate-judge.md). MetaSkill recomputes confidence bounds
and verifies the `judge.md` digest before execution and grading.

Set `uses_transcript: true` only when process is part of the criterion. Later
rubric annotations may inform an advisory judge; they never alter a trusted
load-bearing judge.

### Human grader

```json
{"kind": "human", "id": "specialist-review", "metric": "domain-correctness"}
```

A human grader has no `path` and remains pending until blind review is recorded.

## Stateful Outcomes

A stateful case declares a hidden capture script and a load-bearing state-aware
code grader:

```json
{
  "outcome": "stateful",
  "state_capture": "capture-state.py",
  "graders": [
    {
      "kind": "code",
      "id": "state-validator",
      "metric": "state-correctness",
      "path": "validate-state.py",
      "uses_state": true
    }
  ]
}
```

The capture script receives `--workspace`, `--output`, `--phase before|after`,
and `--json`; it writes a JSON object or array to `--output`. The worker never
receives the capture script or snapshots. The state validator should check the
requested change and relevant unchanged state separately.

## File-Backed Case

```text
.<skill-name>/evals/
  evals.json
  cases/<case-id>/
    task.md
    expected.md
    judge.md
    validate.py
    capture-state.py
    fixtures/
    grader-tests/
      oracle/
        response.md
        artifacts/
        before-state.json
        after-state.json
      negative-example/
        response.md
        artifacts/
        before-state.json
        after-state.json
```

Paths must stay inside the case folder. Trial workers receive only `task.md`,
declared fixtures, and the frozen candidate skill. Expected output, criteria,
validators, state capture, snapshots, judge guidance, calibration, annotations,
and human labels remain hidden.

## Validate Before Running

```bash
metaskill eval run \
  --suite <skill-name>/.<skill-name>/evals/evals.json \
  --check --json
```

Require `ok: true`. This loads the schema, enforces the mode and grader
contracts, executes deterministic Pass/Fail fixtures, verifies calibrated judge
digests and confidence bounds, and blocks unfair or ungradable suites.

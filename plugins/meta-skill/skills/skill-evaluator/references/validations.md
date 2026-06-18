# Validations

Read when authoring deterministic validations: pass/fail checks with no
judgment.

Validations are code graders over trial outcomes and artifacts. They may read
transcripts when the check is about process or tool use, but outcome checks
should judge the produced answer, files, or state first.

Validations come in two tiers. Keep the terminology straight:

- **scripts** are a skill's runtime deterministic code, or shipped plugin checks.
- **validators** are evaluator-owned checks for one task.
- **tests** are shared deterministic checks in the hidden workbench.

## Two Tiers

| Tier | Scope | Form | Home | Durability |
|---|---|---|---|---|
| **General checks** | Every skill | Canonical CLI validators run by `plugins/meta-skill/scripts/metaskill validate` | Plugin tree | Durable, shipped |
| **Task-local validators** | One task | `validate.*` beside `task.md` | Hidden task folder | Local eval content |
| **Shared workbench tests** | One target suite | Authored tests reused across cases | `.<skill-name>/tests/` | Local eval content |

General checks already exist and apply to any skill: skill body present, valid
front matter, length bounds, and deprecated-surface avoidance. Do not re-author
them per target.

## Deterministic First

Prefer a deterministic validator over a judge dimension wherever the check can
be made exact: required strings, file presence, schema shape, exit codes,
state checks, exact outcome checks, and transcript metrics such as turns, tool
calls, or token use. Judges are for semantic quality a script cannot decide.

When authoring judge guidance, each judged criterion should state why it cannot be
deterministic. If no reason survives writing it down, move the check into
`validate.*`.

Task-local validators check behavior unique to one task. They live beside the
task as `validate.*`, but they are hidden from the agent. They run after the
trial outcome exists.

Supported task-local validators are:

- `validate.py` — run with the Meta-Skill Python interpreter
- `validate.sh` — run with `sh`
- any executable `validate.*` file

When a validator protects a must-not-break candidate, declare it as a gate in
`evals.json`:

```json
{
  "id": "prompt-boundary",
  "kind": "code",
  "metric": "boundary",
  "path": "validate.py",
  "required": true,
  "gate": true
}
```

A gate failure rejects a candidate for the measured scope even if model-judge
guidance quality improves.

## Agent Boundary

The workspace receives:

- `task.md`
- fixtures listed in `evals.json`
- the candidate payload, when present

The workspace does not receive:

- `judge.md`
- `expected.*`
- `validate.*`
- grader prompts
- human labels

Validators run outside the workspace and may read hidden expected output,
the outcome file, selected artifacts, transcripts, and task metadata from
`evals.json`.

## Validator Contract

A task-local validator should accept explicit paths rather than discovering
global state:

```text
validate.ts \
  --output runs/<run-id>/candidates/<candidate>/<trial-id>/response.md \
  --expected cases/<task-id>/expected.json \
  --events runs/<run-id>/events/<trial-id>.jsonl \
  --json
```

It should print a compact JSON object:

```json
{
  "passed": 3,
  "total": 4,
  "checks": [
    {
      "name": "mentions approval gate",
      "passed": true,
      "evidence": "response.md includes the approval step"
    }
  ]
}
```

The runner converts validator output into `grades.jsonl` rows with
`grader.kind = "code"`. Explicit `graders[]` entries preserve their `id`,
`metric`, and `gate` fields in the grade row.

Code graders should return named checks rather than one opaque pass/fail. Named
checks make partial credit and failure diagnosis possible.

## Minimal `validate.py`

Use this as a starter for exact response checks. It reads the captured response
from `--output`, optionally reads `--expected`, and prints the JSON shape the
runner expects:

```python
#!/usr/bin/env python3
import argparse
import json
from pathlib import Path


parser = argparse.ArgumentParser()
parser.add_argument("--output", required=True)
parser.add_argument("--events", required=True)
parser.add_argument("--expected")
parser.add_argument("--json", action="store_true")
args = parser.parse_args()

response = Path(args.output).read_text()
expected = Path(args.expected).read_text() if args.expected else ""

checks = [
    {
        "name": "mentions approval boundary",
        "passed": "approval" in response.lower(),
        "evidence": "looked for approval language in response.md"
    }
]

if expected:
    checks.append(
        {
            "name": "mentions expected keyword",
            "passed": expected.strip().lower() in response.lower(),
            "evidence": "looked for expected text in response.md"
        }
    )

passed = sum(1 for check in checks if check["passed"])
print(json.dumps({
    "passed": passed,
    "total": len(checks),
    "checks": checks,
    "rationale": f"{passed}/{len(checks)} validator checks passed"
}))
```

Declare the validator as a gate in `evals.json` when the check must reject a
candidate for the measured scope:

```json
{
  "id": "approval-boundary",
  "kind": "code",
  "metric": "approval-boundary",
  "path": "validate.py",
  "required": true,
  "gate": true
}
```

## Transcript Validators

Use transcript validators only when process behavior is part of the task. Good
checks include:

- a required tool call happened at least once
- a forbidden tool or external write did not happen
- the agent ran validation before claiming success
- the agent preserved a read-only boundary
- the run stayed under an agreed turn, tool-call, token, or latency budget

Avoid exact tool-call order checks unless the order itself is the behavior being
measured. For conversational skills, inspect transcript events for
mid-conversation work that may not appear in `response.md`.

## Boundary With skill-doctor

A failure pattern general to *all* skills should be reported as a proposed
shared-check follow-up for `skill-doctor` Verify. Keep the current check
task-local until an explicit implementation lane approves adding or changing
shipped validation scripts. A failure specific to one target stays local to the
eval suite.

If a validation failure identifies a fix, report the failure and hand it to
`skill-doctor`. The evaluator does not edit the target.

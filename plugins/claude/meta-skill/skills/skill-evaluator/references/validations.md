# Validations

Read when authoring deterministic validations: pass/fail checks with no
judgment.

Validations come in two tiers. Keep the terminology straight:

- **scripts** are a skill's runtime deterministic code, or shipped plugin checks.
- **validators** are evaluator-owned checks for one case.
- **tests** are shared deterministic checks in the hidden workbench.

## Two Tiers

| Tier | Scope | Form | Home | Durability |
|---|---|---|---|---|
| **General checks** | Every skill | Canonical CLI validators run by `scripts/meta-skill validate` | Plugin tree | Durable, shipped |
| **Case-local validators** | One case | `validate.*` beside `task.md` | Hidden case folder | Local eval content |
| **Shared workbench tests** | One target suite | Authored tests reused across cases | `.meta-skill/tests/` | Local eval content |

General checks already exist and apply to any skill: skill body present, valid
front matter, length bounds, and deprecated-surface avoidance. Do not re-author
them per target.

Case-local validators check behavior unique to one case. They live beside the
case as `validate.*`, but they are hidden from the solver. They run after solver
output exists.

## Solver Boundary

The solver workspace receives:

- `task.md`
- fixtures listed in `evals.json`
- the candidate payload

The solver workspace does not receive:

- `rubric.md`
- `expected.*`
- `validate.*`
- grader prompts
- human labels

Validators run outside the solver workspace and may read hidden expected output,
the solver output file, selected artifacts, event logs, and case metadata from
`evals.json`.

## Validator Contract

A case-local validator should accept explicit paths rather than discovering
global state:

```text
validate.ts \
  --output runs/<run-id>/candidates/<candidate>/<trial-id>/final.md \
  --expected cases/<case-id>/expected.json \
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
      "evidence": "final.md includes the approval step"
    }
  ]
}
```

The runner converts validator output into `grades.jsonl` rows with
`grader.kind = "code"`.

## Boundary With skill-doctor

A failure pattern general to *all* skills graduates to a shipped script in the
`skill-doctor` Verify path. A failure specific to one target stays local to the
eval suite.

If a validation failure identifies a fix, report the failure and hand it to
`skill-doctor`. The evaluator does not edit the target.

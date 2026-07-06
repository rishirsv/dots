# Eval Vocabulary

Canonical vocabulary for Meta-Skill evaluation. Every other reference should
link here instead of restating this table.

| Term | Current file/schema surface |
|---|---|
| **suite** | `.<skill-name>/evals.json` plus its materialized workbench |
| **task** | one row in `cases[]` and one folder under `.<skill-name>/cases/<task-id>/` |
| **candidate** | one row in `candidates[]`, such as `no-skill`, `current`, or an edited attempt |
| **trial** | one task executed once under one candidate |
| **transcript** | `runs/<run-id>/trials/<trial-id>/events.jsonl` plus compact `runs/<run-id>/trials/<trial-id>/evidence.json` |
| **outcome** | `runs/<run-id>/trials/<trial-id>/response.md` and produced artifacts |
| **grader** | model, human, or code rows in `grades.jsonl` |

When explaining evals to a user, prefer the product terms from this table:
suite, task, candidate, trial, transcript, outcome, and grader.

## Schema Field Rules

Use **candidate** in prose and schema fields, not `condition_id`,
`candidate_id`, or `attempt_id`. Use **`trial_id`** for one execution of one
task under one candidate, formatted `<case-id>.<candidate>.t<n>`.

## Recognized Task Types

Case `type` values recognized by suite linting and preset selection:

| Type | Purpose |
|---|---|
| `capability` | Quality/capability task. |
| `regression` | Protects known-good behavior. |
| `trigger`, `implicit_trigger`, `activation` | Should-trigger activation tasks. |
| `negative_control`, `boundary`, `should_not_trigger`, `near_miss` | Should-not-trigger tasks that balance activation checks. |
| `failure` | Reproduces a known failure or regression. |
| `gate` | Exercises a must-not-break requirement. |

Presets that select any trigger-type task should also select a
negative-control-type task so activation claims stay balanced; suite linting
warns when a case has no recognized `type`.

## Grade Label Scale

Model, human, and code graders share one label scale, plus an optional 0-to-1
score:

| Label | Meaning |
|---|---|
| `pass` | Meets the criterion fully, with concrete evidence; usable as-is. |
| `partial` | Useful but has a localized, non-gating weakness or gap. |
| `fail` | Wrong, incomplete, unsafe, or misses a required criterion. |
| `unknown` | Evidence is insufficient, contradictory, too subjective, or underspecified to judge fairly. |

Treat `unknown` as a review signal, not a failure to hide.

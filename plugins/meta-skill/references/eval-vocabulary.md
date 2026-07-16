# Evaluation Vocabulary

| Term | Meaning |
|---|---|
| **suite** | One authored `<skill-name>/.<skill-name>/evals/evals.json` containing evals, candidates, and defaults. |
| **case** | One portable task with observable criteria; stored as an `evals[]` row with `id`, `prompt`, optional `expected_output`, and `expectations`. |
| **version** | The no-skill baseline or one frozen skill payload supplied to the same visible task; stored as a candidate. |
| **run** | One immutable comparison of selected cases and versions, with frozen inputs, planned trials, and a derived report. |
| **trial** | One case × version × repetition, with local state, response, events, artifacts, optional before/after state, grades, and optional review. |
| **grader** | A deterministic, model, or human check declared by the eval and written to that trial's `grades.jsonl`. |
| **advisory** | A grader whose failure makes the trial inconclusive but does not fail it. |
| **annotation** | A plain trial-local review note. The reviewing agent determines whether it points to the skill, case, grader, harness, or environment. |
| **version delta** | The per-case conclusion from a selected baseline version to another version: `observed_improvement` or `observed_regression` for diagnostics; `case_improvement` or `case_regression` for eligible broad comparisons; `no_uplift_demonstrated`; or `inconclusive`. |

Attached-skill evals measure behavior when the runner explicitly supplies the
payload. They do not measure natural platform discovery or routing.

Use `pass` only with evidence for every load-bearing criterion. Use `partial`
for a meaningful localized miss, `fail` for an unmet requirement, and
`unknown` when the available evidence cannot support a fair judgment.

`no_uplift_demonstrated` means both versions passed the measured case. It does
not establish equivalence. `inconclusive` includes shared failure and any
comparison whose evidence is unavailable or uncertain.

A case delta is descriptive. `supported_improvement`, `supported_regression`,
or `no_supported_difference` comes from the report's paired exact inference,
not from one case or a raw rate delta.

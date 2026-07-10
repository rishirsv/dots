# Evaluation Vocabulary

| Term | Meaning |
|---|---|
| **suite** | One authored `<skill>/evals/evals.json` containing evals, candidates, defaults, and named profiles. |
| **dataset** | The eval cases selected from a suite for an experiment. |
| **eval** | One portable task row with `id`, `prompt`, `expected_output`, and `expectations`, plus optional type, fixtures, graders, and repetitions. |
| **candidate** | The no-skill baseline or one frozen skill payload supplied to the same visible task. |
| **profile** | A named selection and repetition policy embedded in the suite for a recurring decision. |
| **experiment** | A configured comparison: objective, dataset, baseline, candidates, model, repetitions, graders, and human-review sample. |
| **run** | One immutable recorded execution of an experiment, with frozen inputs, planned trials, and a derived report. |
| **trial** | One eval × candidate × repetition, with local state, response, events, artifacts, grades, and optional review. |
| **grader** | A deterministic, model, or human check declared by the eval and written to that trial's `grades.jsonl`. |
| **advisory** | A grader whose failure makes the trial inconclusive but does not fail it. |
| **annotation** | A trial-local review note or a pairwise A/B judgment. Defect annotations distinguish candidate, task, grader, harness, and environment causes. |
| **candidate delta** | The per-eval change from the selected baseline to a candidate: improved, regressed, unchanged, or unknown. |

Attached-skill evals measure behavior when the runner explicitly supplies the
payload. They do not measure natural platform discovery or routing.

Use `pass` only with evidence for every load-bearing criterion. Use `partial`
for a meaningful localized miss, `fail` for an unmet requirement, and
`unknown` when the available evidence cannot support a fair judgment.

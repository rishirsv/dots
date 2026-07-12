# Evaluation run: run-20260711T214603738548Z-13b7f09a

**Objective:** Prove the artifact preview and annotation workflow with a real file-producing skill

**Version delta:** 0 improved, 0 regressed, 0 unchanged, 0 unknown.

0 passed · 1 failed · 0 inconclusive · 0 ungraded

## Run configuration

- Baseline version: none
- Versions: current
- Model: gpt-5.6-sol
- Duration: 75740 ms

## Version comparison

No candidate comparison is available.

## Trials

| Trial | Runtime | Verdict | Duration |
| --- | --- | --- | --- |
| quarterly-summary-artifact.current.t1 | completed | failed | 75740 ms |

## Why trials failed

### quarterly-summary-artifact.current.t1

| Check | Status | Evidence |
| --- | --- | --- |
| Creates notes.md with a concise description of the dataset. | fail | No notes.md artifact exists. The trial instead captured quarterly-summary.notes.md; its contents provide a concise da... |
| Leaves both requested files available as captured trial artifacts. | fail | The captured artifacts are quarterly-summary.csv and quarterly-summary.notes.md. Required notes.md is absent. |

## Review

1/1 trials reviewed; 0 model/human disagreements.

0 pairwise comparisons reviewed.

Annotations: one-off=1.
- `quarterly-summary-artifact.current.t1`: This artifact should be named notes.md to match the skill contract.

## Coverage limits

- No baseline candidate was run; candidate delta cannot be calculated.

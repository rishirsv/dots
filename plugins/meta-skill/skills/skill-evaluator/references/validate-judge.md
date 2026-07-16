# Validate An LLM Judge

Read this after writing a case-local `judge.md` and before trusting that judge
on production traces. Calibrate the judge against human judgment for the one
failure mode it evaluates.

## Prerequisites

- The judgment prompt is written.
- Candidate few-shot examples are available.
- Human-labeled Pass and Fail traces are available.

Treat **Fail** as the positive class: the judge is detecting the defined
failure mode.

## 1. Split The Human-Labeled Traces

Create mutually exclusive, class-balanced splits whose percentages total 100%:

- **train: 10–20%** for selecting few-shot examples;
- **development: 40–45%** for iterating on the judge; and
- **test: 40–45%** for one final evaluation.

Keep related or duplicate traces in the same split. Draw few-shot examples only
from train. Do not inspect test outcomes while changing the prompt, examples,
model, or decision rule.

## 2. Measure The Development Set

Run the judge on every development trace and compare its binary label with the
human label.

| Measure | Formula | Meaning |
|---|---|---|
| True positive rate (TPR) | correctly predicted Fail / all human Fail | How often the judge detects the failure mode. |
| True negative rate (TNR) | correctly predicted Pass / all human Pass | How often the judge accepts valid outputs. |

Report the confusion matrix with the rates:

| Human label | Judge Fail | Judge Pass |
|---|---:|---:|
| Fail | true positive | false negative |
| Pass | false positive | true negative |

Inspect false positives and false negatives. Change only the criterion,
definitions, few-shot examples, or evidence supplied to the judge. Do not add
an example copied from development to the judge prompt.

Iterate until both development-set TPR and TNR exceed 90%. If either remains at
or below 90%, do not use the judge as a trusted production grader.

## 3. Run The Held-Out Test Once

Freeze the judge prompt, few-shot examples, model, and input construction. Run
them once on the held-out test set. Report test TPR, TNR, the confusion matrix,
and sample counts.

Do not tune against the test failures. A changed judge requires a new held-out
test set before making another final claim.

## 4. Correct The Production Failure Rate

Let:

- `q` = the fraction of production traces the judge labels Fail;
- `TPR` = held-out true positive rate; and
- `TNR` = held-out true negative rate.

Estimate the corrected production failure rate:

```text
corrected failure rate = (q + TNR - 1) / (TPR + TNR - 1)
```

Clip the estimate to the range 0–1. Do not apply the correction when
`TPR + TNR <= 1`, or when production traces differ materially from the held-out
data. Report the raw judge-labeled rate, corrected estimate, held-out TPR/TNR,
sample sizes, and data period together.

The correction estimates an aggregate rate; it does not change any individual
trace label.

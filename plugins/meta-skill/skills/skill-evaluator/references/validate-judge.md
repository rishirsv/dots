# Validate An LLM Judge

Read this after writing a case-local `judge.md` and before using it as a
load-bearing grader. Calibrate one frozen judge prompt, model, reasoning effort,
and input construction against human judgment for one failure mode.

Treat **Fail** as the positive class: the judge detects the defined failure.
Use an uncalibrated model grader only with `advisory: true`; it cannot decide a
trial verdict.

## Plan The Evidence Before Tuning

Choose the trust thresholds and confidence level before running the judge. The
default production contract is:

- minimum TPR: `0.90`;
- minimum TNR: `0.90`; and
- confidence level: `0.95`.

Do not choose a fixed sample such as 20 Pass and 20 Fail and then trust its
point estimates. Plan enough held-out human labels that the Wilson confidence
lower bounds can clear both thresholds. Increase the sample when even a perfect
observed rate would leave the lower bound below the target.

Collect labels from the same task and evidence distribution the judge will see.
Record the dataset identifier, data period, class counts, and relevant
prevalence. Keep related or duplicate traces in the same split.

## Split Without Leakage

Create mutually exclusive, class-balanced working splits:

- **train: 10–20%** for selecting two to four few-shot examples;
- **development: 40–45%** for changing the criterion, prompt, examples, or
  evidence construction; and
- **test: 40–45%** for one final held-out evaluation.

Draw few-shot examples only from train. Do not inspect test outcomes while
changing the prompt, examples, model, reasoning effort, or decision rule. If the
held-out sample is too small to meet the confidence plan, gather new labels
rather than moving development examples into test.

## Measure Development And Held-Out Performance

For development and test, report the confusion matrix:

| Human label | Judge Fail | Judge Pass |
|---|---:|---:|
| Fail | true positive | false negative |
| Pass | false positive | true negative |

Report together:

- TPR and its confidence interval;
- TNR and its confidence interval;
- failure-class precision;
- human-label prevalence;
- Pass and Fail sample counts;
- false-positive and false-negative examples;
- judge prompt digest, model, reasoning effort, and data period.

Iterate only on development. Freeze the judge and run held-out test once. The
judge becomes load-bearing only when the held-out TPR and TNR confidence lower
bounds meet their predeclared thresholds. Point estimates above 90% are not
sufficient.

## Record The Trusted Judge

Declare the frozen evidence in the model grader:

```json
{
  "kind": "model",
  "id": "quality",
  "metric": "quality",
  "path": "judge.md",
  "model": "exact-judge-model-version",
  "reasoning_effort": "medium",
  "calibration": {
    "dataset_id": "quality-held-out-v1",
    "data_period": "2026-01-01/2026-06-30",
    "validated_at": "2026-07-01",
    "model": "exact-judge-model-version",
    "reasoning_effort": "medium",
    "judge_sha256": "<64 lowercase hex characters>",
    "confidence_level": 0.95,
    "minimum_tpr": 0.90,
    "minimum_tnr": 0.90,
    "test": {
      "true_positive": 200,
      "false_negative": 0,
      "true_negative": 200,
      "false_positive": 0
    }
  }
}
```

MetaSkill recomputes the confidence bounds, pins the calibrated executor, and
verifies the judge digest before a run and again during grading. The evaluation
report shows the sample counts, rates, intervals, precision, prevalence, model,
and data period.

## Revalidate On Drift

Create a new judge version and held-out test when any of these changes:

- `judge.md`, its few-shot examples, or input construction;
- model or reasoning effort;
- criterion or Pass/Fail boundary;
- tool, domain, language, user population, or output distribution; or
- evidence showing material model/human disagreement.

Do not inject later rubric annotations into a trusted judge. Compile durable
guidance into a revised `judge.md` and recalibrate it. A changed judge must not
reuse the held-out set used to authorize the previous change.

If estimating a production failure rate from judge labels, report the raw rate,
the correction method, held-out confusion matrix, prevalence assumptions, and
an uncertainty interval together. Do not use a correction when the production
distribution differs materially from the held-out data.

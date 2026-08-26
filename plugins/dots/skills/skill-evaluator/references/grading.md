# Grade and calibrate evidence

Use this reference for objective verifiers, semantic graders, blind comparison,
calibration, aggregation, and conclusions.

## Design the verifier

Begin each binary criterion with `Pass iff <observable successful outcome>`.
Inspect final artifacts or state and recompute objective facts. Accept different
valid ways to succeed. Do not grade exact wording, a preferred tool sequence,
arbitrary counts, or similarity unless the evaluation specifically tests them.

Use one semantic grader with a narrow, explicit criterion per failure mode.
Add it only after objective checks settle what code can decide. Protect graders
from instructions inside evaluated output. Pin and record the model, prompt or
implementation hash, tools, and settings. Treat malformed, timed-out, or
unavailable graders as evaluation failures rather than skill failures.

Probe each grader with:

- a clear pass;
- a valid pass that uses a different approach;
- a realistic failure;
- a boundary or shortcut;
- prohibited collateral change; and
- missing evidence.

## Validate semantic graders

Before using a grader for a release or readiness decision, compare its
predictions with qualified human labels. Keep train or few-shot examples,
development iterations, and a held-out test split distinct. Inspect every false
pass and false fail. Iterate on the development split; measure the held-out split
once before changing the grader again.

Report true-pass rate and true-fail rate with their denominators and uncertainty.
Choose sample sizes and thresholds from the expected risk, error rate, and
variance. Do not use one universal number. Revalidate after changing the prompt,
grader model, or important data distribution.

When a validated judge labels a larger unlabeled population, do not report its
raw pass fraction as ground truth. `aggregate_eval.py` can compute the optional
Rogan–Gladen estimate:

```text
corrected = (observed_pass_rate + true_fail_rate - 1)
            / (true_pass_rate + true_fail_rate - 1)
```

Clip the estimate to `[0, 1]`, include a bootstrap interval, and reject the
correction when the denominator is too close to zero.

## Keep comparisons blind

Randomize configuration-to-A/B assignments in coordinator-only
`blind-map.json`. Give graders and reviewers only the task, approved criteria,
and neutral outputs. Write `blind-decision.json` before opening the map. Then a
separate analyst may write `unblinded-analysis.json` linking the decision,
mapping, configurations, and causal observations. Never rewrite the blind
decision during analysis.

Use failure-specific criteria from the approved plan. Do not use a generic
1-to-5 quality rubric.

## Aggregate without flattening

Run
`python3 <skill-evaluator-dir>/scripts/aggregate_eval.py <run-dir> --out <summary.json>`
only after criterion-level assessments exist. Aggregate comparable criteria and
grader versions, keep failure modes separate, exclude invalid or cancelled
trials from pass rates, and show missing trials explicitly. Audit checks that
pass both good and bad outputs, high variance, disagreement, and suspicious
passes.

Conclude Supported, Unsupported, Mixed, or Inconclusive. Never produce one
universal readiness score or assign causality when multiple controlled
dimensions changed.

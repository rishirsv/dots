# Judge Calibration

Read when human judgment should align a model judge, or when model-judge scores
will influence acceptance, selection, or broad claims about skill quality.

Call the umbrella workflow **judge alignment**. It has three moves:

| Move | Purpose | Primary path |
|---|---|---|
| Critique shadowing | Turn human reasons into observable judge criteria. | `eval review` |
| Agreement check | Compare model and human labels on the same trial and metric. | `eval review`, then `eval calibrate` for an artifact |
| Spot review | Inspect risky, unknown, or suspicious trials before trusting a report. | `eval review` |

Human grading is not a parallel scoring track. Its job is to label trial
outcomes with human subject-matter judgment, measure whether the judge agrees,
and let the judge scale only where that agreement is good enough.

## Labels

Model and human rows share one label scale; see
[eval-vocabulary.md](../../../references/eval-vocabulary.md).

Do not add a separate human-review label. Human review is a workflow state;
`unknown` is the grade label for non-decisive evidence. Scores, when present,
are a 0-to-1 numeric value alongside the label, not a separate scale.

## Primary Loop

Use the review workbench first:

```sh
<meta-skill-root>/scripts/metaskill eval review --suite .<skill-name>/evals.json --run <run-id> --open
```

The workbench serves on `127.0.0.1`, shows a prioritized queue, keeps the
judge's grade hidden until the reviewer commits, records human labels as the
same rows `eval human --label` writes, accepts span annotations, and shows live
agreement plus the trust band after commit.

The queue prioritizes:

1. failed trials
2. unknown or ungraded machine evidence
3. judge/human disagreement
4. suspicious passes
5. remaining trials

Use the evidence pane to compare the visible task, outcome, transcript digest,
judge guidance, expected outputs, existing grades, and annotations. Use the
grading rail to commit `pass`, `partial`, `fail`, or `unknown` with a rationale.

## Alignment Steps

1. **Anchor the judge guidance.** Put label-anchored level descriptions in
   `cases/<task-id>/judge.md`. Describe what `pass`, `partial`, `fail`, and
   `unknown` mean for the exact outcome evidence.
2. **Shadow critique.** Have the reviewer annotate spans when a criterion comes
   from taste, a one-off judgment, a task defect, or a grader defect. Tags are
   `taste-rule`, `one-off`, `task-defect`, and `grader-defect`; rows append to
   `annotations.jsonl`.
3. **Commit human labels.** Record labels through `eval review`. Use `eval
   human --label` only when a headless flow is required.
4. **Check agreement.** Read the workbench agreement view after each commit.
   Run `eval calibrate --run <run-id-or-path> [--metric <name>]` when you need a
   durable calibration artifact.
5. **Refine on disagreement.** Every material judge/human disagreement is a
   judge guidance, judge prompt, task, or evidence-selection defect. Tighten
   `judge.md`, add reference examples when needed, then rerun the judge.
6. **Scale carefully.** Let the judge grade the rest only after disagreements
   look explainable and fixable. Recheck after any judge guidance or judge-model
   change.

## Agreement Artifact

`eval calibrate` writes a JSON artifact under `.<skill-name>/calibrations/`.
It reports:

| Field | Meaning |
|---|---|
| `paired` | Count of paired model and human rows. |
| `trust_band` | Plain-language confidence band for the current sample. |
| `binary_paired` | Count of paired `pass`/`fail` comparisons. |
| `binary_insufficient` | Whether binary agreement is under-sampled. |
| `exact_agreement_rate` | Exact label agreement. |
| `true_positive_rate` | Among human `fail` rows, how often the judge also says `fail`. |
| `true_negative_rate` | Among human `pass` rows, how often the judge also says `pass`. |

Under 20 paired labels, the tool reports `insufficient labels: spot-check
only`. Under 10 binary pairs, it reports `directional: binary agreement
under-sampled`. Treat both as limits on the claim, not as failures to hide.

## Trust Bands

Translate agreement metrics into conservative confidence bands:

| Band | When to use it | Decision |
|---|---|---|
| Insufficient labels: spot-check only | Fewer than 20 paired model/human labels. | Useful for local debugging, not broad claims. |
| Directional: binary agreement under-sampled | At least 20 pairs but fewer than 10 binary pairs. | Useful for direction, not pass/fail gate confidence. |
| Calibrated for local decisions | At least 20 pairs and at least 10 binary pairs, with disagreements reviewed. | Can support a scoped local decision with coverage limits. |
| Not trustworthy | Poor TPR or TNR, high unknown rate, unstable criteria, or unresolved disagreements. | Do not scale the judge; use human review or rewrite the rubric. |

For high-risk or user-facing gates, decide the numeric threshold with the user
before tuning. Report TPR, TNR, unknown rate, sample size, and whether the
result came from spot review or a held-out test set.

## Headless Path

Use `eval human` when a browser review flow is not available:

```sh
<meta-skill-root>/scripts/metaskill eval human --run <run-dir> --trial <trial-id> --json
<meta-skill-root>/scripts/metaskill eval human --run <run-dir> --trial <trial-id> --label pass --rationale "<evidence-backed rationale>" --json
```

Then run:

```sh
<meta-skill-root>/scripts/metaskill eval calibrate --run <run-id-or-path> --json
```

The CLI path preserves the same grade semantics but does not give the
prioritized queue, hidden-judge reveal, annotation workflow, or live agreement
view.

## Judge Bias Controls

LLM judges drift in predictable ways. Guard against them:

- **Verbosity bias**: longer answers scored higher regardless of quality.
- **Position / order bias**: in pairwise comparisons, randomize order.
- **Self-preference**: a judge favoring outputs written in its own style.

Reference-guided grading reduces all three. Give the judge explicit judge
guidance and, where possible, hidden expected output or reference material.
These hidden files remain outside the workspace.

If the judge cannot decide from the outcome and allowed transcript evidence,
prefer `unknown` over a confident invented score. Treat `unknown` as a
calibration signal. The report and review queue surface those trials.

## When To Stop

Stop and ask for human review when the task is overscoped, the reviewer cannot
state stable criteria, or TPR/TNR remains poor after concrete rubric edits. Do
not force an aligned judge where the product question is still ambiguous.

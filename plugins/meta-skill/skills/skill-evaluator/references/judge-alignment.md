# Judge Alignment

Read when model-judge scores will influence acceptance, promotion, or broad
claims about skill quality.

An LLM judge is useful only where it agrees with human subject-matter judgment.
Treat alignment as part of the eval flywheel: inspect outcomes, collect human
labels and critiques, tune judge guidance, measure agreement, then recheck after
material changes.

## Labels

Use one label scale for model and human rows:

| Label | Meaning |
|---|---|
| `pass` | The outcome satisfies the required criteria with concrete evidence. |
| `partial` | The outcome is useful but misses a non-gating criterion or has a localized defect. |
| `fail` | The outcome is wrong, incomplete, unsafe, or misses a required criterion. |
| `unknown` | Evidence is insufficient, contradictory, too subjective, or underspecified. |

Do not add a separate human-review label. Human review is a workflow state;
`unknown` is the grade label for non-decisive evidence.

## Rubrics

Put rubric criteria in `cases/<task-id>/judge.md`. Use anchored levels instead
of vague numeric scales:

```text
Pass: names the approval boundary, gives the exact next command, and cites the
evidence that would change the decision.

Partial: gives a plausible next action but misses either the approval boundary
or the evidence needed to decide.

Fail: invents proof, skips the requested judgment, or recommends an irreversible
action without approval.

Unknown: the response or available transcript does not contain enough evidence
to judge the criterion fairly.
```

Keep `graders[]` for metric declarations, gates, and report fields. Keep
semantic criteria in `judge.md` so the same visible task can run unchanged
against every candidate.

## Alignment Dataset

For a serious judge, use a gold-standard dataset labeled by a human reviewer:

| Split | Size | Purpose |
|---|---:|---|
| Train | About 20% | Select clear pass/fail examples for few-shot judge guidance. |
| Validation | About 40% | Iterate on judge instructions by studying disagreements. |
| Test | About 40% | Run once after tuning to estimate judge trustworthiness. |

Small local suites may use a lighter spot-check, but report that the judge is
only spot-checked. Do not present a spot-check as held-out validation.

## Agreement Metrics

Accuracy is not enough when most examples pass. Track both:

- **TPR**: among human-labeled failures, how often the judge also says `fail`.
- **TNR**: among human-labeled passes, how often the judge also says `pass`.

High TPR means the judge finds real problems. High TNR means it does not reject
good outcomes too aggressively. Also report exact agreement, ordinal tolerance
for `partial`, unknown-label rate, and examples of false pass / false fail.

## Critique Shadowing

Before adding many specialized judges, shadow a human reviewer:

1. Collect a representative set of trial outcomes.
2. Have the reviewer label outcomes and write short critiques.
3. Build or revise `judge.md` from the observable reasons in those critiques.
4. Run the model judge and inspect disagreements.
5. Refine the judge guidance until disagreements are explainable.
6. Add specialized judges only for repeated, high-value failure modes.

The human critique is often more valuable than the judge itself. Use it to make
the rubric clearer and to discover missing eval cases.

## When To Stop

Stop and ask for human review when the task is overscoped, the reviewer cannot
state stable criteria, or validation TPR/TNR remains poor after concrete rubric
edits. Do not force an aligned judge where the product question is still
ambiguous.

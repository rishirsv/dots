# Judge Calibration

Read when a human will calibrate the judge, or when model-judge scores will
influence acceptance, selection, or broad claims about skill quality.

Human grading is not a parallel scoring track. Its job is to align the LLM
judge: label trial outcomes with human subject-matter judgment, measure
whether the judge agrees, then let the judge scale only where that agreement
is good enough. Treat alignment as part of the eval flywheel: inspect
outcomes, collect human labels and critiques, tune judge guidance, measure
agreement, then recheck after material changes.

## Labels

Use one label scale for model and human rows:

| Label | Meaning |
|---|---|
| `pass` | The outcome satisfies the required criteria with concrete evidence. |
| `partial` | The outcome is useful but misses a non-gating criterion or has a localized defect. |
| `fail` | The outcome is wrong, incomplete, unsafe, or misses a required criterion. |
| `unknown` | Evidence is insufficient, contradictory, too subjective, or underspecified. |

Do not add a separate human-review label. Human review is a workflow state;
`unknown` is the grade label for non-decisive evidence. Scores, when present,
are a 0-to-1 numeric value alongside the label, not a separate scale.

## The Loop

1. **Anchor the judge guidance.** Put label-anchored level descriptions in
   `cases/<task-id>/judge.md` — describe what `pass`, `partial`, and `fail`
   look like, and when the judge should say `unknown`. Ambiguous criteria are
   the main cause of an unreliable judge:

   ```text
   Pass: names the approval boundary, gives the exact next command, and cites
   the evidence that would change the decision.

   Partial: gives a plausible next action but misses either the approval
   boundary or the evidence needed to decide.

   Fail: invents proof, skips the requested judgment, or calls for an
   irreversible action without approval.

   Unknown: the response or available transcript does not contain enough
   evidence to judge the criterion fairly.
   ```

   Keep `graders[]` for metric declarations, gates, and report fields. Keep
   semantic criteria in `judge.md` so the same visible task can run unchanged
   against every candidate.
2. **Select a spot-check slice.** Pick a small set of representative trial
   outcomes before trusting the judge for a decision. For small skill suites, a
   few human-labeled examples are usually enough to reveal obvious judge
   guidance or judge defects. For a serious judge, use a gold-standard dataset
   with a train/validation/test split instead:

   | Split | Size | Purpose |
   |---|---:|---|
   | Train | About 20% | Select clear pass/fail examples for few-shot judge guidance. |
   | Validation | About 40% | Iterate on judge instructions by studying disagreements. |
   | Test | About 40% | Run once after tuning to estimate judge trustworthiness. |

   Small local suites may use a lighter spot-check, but report that the judge
   is only spot-checked. Do not present a spot-check as held-out validation.
3. **Collect human grades.** Use [human-grading.md](human-grading.md) to show
   response and transcript evidence, ask for label/rationale, and store human
   labels as `grades.jsonl` rows over trial outcomes. Do not put human labels in
   `task.md`, and do not hide them as front matter in case files.
4. **Check agreement.** Run `<meta-skill-root>/scripts/metaskill eval calibrate
   --run <run-id-or-path>` on the same trial outcomes to compare model judge
   grades with human grades. Add `--metric <name>` when only one shared grade
   metric should be compared. Accuracy is not enough when most examples pass —
   track both:
   - **TPR**: among human-labeled failures, how often the judge also says
     `fail`.
   - **TNR**: among human-labeled passes, how often the judge also says
     `pass`.

   High TPR means the judge finds real problems; high TNR means it does not
   reject good outcomes too aggressively. Also report exact agreement, ordinal
   tolerance for `partial`, unknown-label rate, and examples of false
   pass/fail. Reach for weighted kappa or correlation only when statistical
   rigor is needed.
5. **Refine on disagreement.** Every material judge/human disagreement is a
   judge guidance, judge prompt, task, or evidence-selection defect. Tighten
   `judge.md`, add reference examples when needed, then rerun the judge.
6. **Scale carefully.** Let the judge grade the rest only after disagreements
   look explainable and fixable. Recheck a small slice after any judge
   guidance or judge-model change — prior agreement does not transfer.

## Grade Rows

Human, model, and code grades share one annotation shape:

```json
{
  "run_id": "run-001",
  "case_id": "natural-trigger",
  "candidate": "candidate-1",
  "trial_id": "natural-trigger.candidate-1.t3",
  "grader": { "kind": "human", "id": "human-reviewer" },
  "metric": "usefulness",
  "score": 0.5,
  "label": "partial",
  "rationale": "The answer is usable but misses the approval boundary.",
  "evidence_refs": ["results.jsonl#natural-trigger.candidate-1.t3"]
}
```

Use candidate/task/trial language in prose. In grade rows, use the current
schema field `candidate`, not `candidate_id`. Use `trial_id`, not `attempt_id`.

## Trust Bands

Translate agreement metrics into confidence bands. Use conservative bands
unless the user provides a stricter domain standard:

| Band | When to use it | Decision |
|---|---|---|
| Spot-check only | Fewer than about 20 human labels, no held-out split, or labels are mostly one class. | Useful for local debugging, not for broad claims. |
| Local-decision usable | Balanced human labels, reviewed disagreements, and high enough TPR/TNR for the user's low-risk choice. | Can support a small scoped decision with coverage limits. |
| Gate-ready | Held-out test split, strong TPR and TNR, low unknown rate, and false pass / false fail examples reviewed by a human. | Can gate selection for the measured domain. |
| Not trustworthy | Poor TPR or TNR, high unknown rate, unstable criteria, or unresolved model/human disagreements. | Do not scale the judge; use human review or rewrite the rubric. |

For high-risk or user-facing gates, decide the numeric threshold with the user
before tuning. Report the actual TPR, TNR, unknown rate, sample size, and
whether the result came from a spot-check or held-out test set.

## Surfacing Divergence

Flag every pass/fail flip (human `pass` vs. judge `fail`, or the reverse) and
any label mismatch beyond adjacent labels (for example `pass` vs. `unknown`,
or `fail` vs. `unknown`) for review, and propose the judge guidance or anchor
change that would close it. A few well-chosen spot checks beat labeling
everything.

Do not turn calibration into a separate label system. If a decision depends on
judge scores, say whether a human spot check was done and summarize any
disagreements in plain language. Use transcripts to diagnose disagreements,
but grade the outcome unless the judge guidance explicitly measures process
behavior. When human judgment is the standard, rewrite the judge guidance into
observable pass/partial/fail indicators before letting the model judge scale.

`eval calibrate` writes a JSON artifact under `.<skill-name>/calibrations/`.
Treat that file as the workbench evidence for judge agreement. It records the
run, optional metric filter, agreement summary, unknown-label rate, false
pass/fail examples, disagreements, and non-binary examples.

## Judge Bias Controls

LLM judges drift in predictable ways. Guard against them:

- **Verbosity bias** — longer answers scored higher regardless of quality.
- **Position / order bias** — in pairwise comparisons, randomize order.
- **Self-preference** — a judge favoring outputs written in its own style.

Reference-guided grading reduces all three. Give the judge explicit judge
guidance and, where possible, hidden expected output or reference material.
These hidden files remain outside the workspace.

If the judge cannot decide from the outcome and allowed transcript evidence,
prefer `unknown` over a confident invented score. Treat `unknown` as a
calibration signal, not as a failure to hide. The report will surface those
trials for review.

## Critique Shadowing

Before adding many specialized judges, shadow a human reviewer:

1. Collect a representative set of trial outcomes.
2. Have the reviewer label outcomes and write short critiques.
3. Build or revise `judge.md` from the observable reasons in those critiques.
4. Run the model judge and inspect disagreements.
5. Refine the judge guidance until disagreements are explainable.
6. Add specialized judges only for repeated, high-value failure modes.

The human critique is often more valuable than the judge itself. Use it to
make the rubric clearer and to discover missing eval cases.

## When To Stop

Stop and ask for human review when the task is overscoped, the reviewer
cannot state stable criteria, or validation TPR/TNR remains poor after
concrete rubric edits. Do not force an aligned judge where the product
question is still ambiguous.

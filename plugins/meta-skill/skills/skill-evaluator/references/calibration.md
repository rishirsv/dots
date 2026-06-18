# Calibration

Read when a human will calibrate the judge.

Human grading is not a parallel scoring track. Its job is to align the LLM
judge: label trial outcomes with human subject-matter judgment, measure whether
the judge agrees, then let the judge scale only where that agreement is good
enough.

## The Loop

1. **Anchor the judge guidance.** Put discrete level descriptions in
   `cases/<task-id>/judge.md`. Ambiguous criteria are the main cause of an
   unreliable judge.
2. **Select a spot-check slice.** Pick a small set of representative trial
   outcomes before trusting the judge for a decision. For small skill suites, a
   few human-labeled examples are usually enough to reveal obvious judge guidance or
   judge defects.
3. **Collect human grades.** Use [human-grading.md](human-grading.md) to show
   response and transcript evidence, ask for label/rationale, and store human
   labels as `grades.jsonl` rows over trial outcomes. Do not put human labels in
   `task.md`, and do not hide them as front matter in case files.
4. **Check agreement.** Run `<meta-skill-root>/scripts/metaskill eval calibrate --run
   <run-id-or-path>` on the same trial outcomes to compare model judge grades
   with human grades. Add `--metric <name>` when only one shared grade metric
   should be compared. Practical signal: true positive rate for finding failures,
   true negative rate for recognizing passes, exact agreement, and a +/-1
   tolerance band for ordinal labels. Reach for weighted kappa or correlation
   only when statistical rigor is needed.
5. **Refine on disagreement.** Every material judge/human disagreement is a
   judge guidance, judge prompt, task, or evidence-selection defect. Tighten
   `judge.md`, add reference examples when needed, then rerun the judge.
6. **Scale carefully.** Let the judge grade the rest only after disagreements
   look explainable and fixable. Recheck a small slice after any judge guidance or
   judge-model change — prior agreement does not transfer.

## Grade Rows

Human, model, and code grades share one annotation shape:

```json
{
  "run_id": "run-001",
  "case_id": "natural-trigger",
  "candidate": "candidate-1",
  "trial_id": "natural-trigger.candidate-1.t3",
  "grader": {
    "kind": "human",
    "id": "human-reviewer"
  },
  "metric": "usefulness",
  "score": 0.5,
  "label": "partial",
  "rationale": "The answer is usable but misses the approval boundary.",
  "evidence_refs": ["results.jsonl#natural-trigger.candidate-1.t3"]
}
```

Use candidate/task/trial language in prose. In grade rows, use the current
schema field `candidate`, not `candidate_id`. Use `trial_id`, not `attempt_id`.

## Surfacing Divergence

Flag every task where `|human - judge| >= 1` for review, and propose the judge guidance
or anchor change that would close it. A few well-chosen spot checks beat
labeling everything.

Do not turn calibration into a separate label system. If a decision depends on
judge scores, say whether a human spot check was done and summarize any
disagreements in plain language. Use transcripts to diagnose disagreements, but
grade the outcome unless the judge guidance explicitly measures process
behavior. When human judgment is the standard, rewrite the judge guidance into
observable pass/partial/fail indicators before letting the model judge scale.

`eval calibrate` writes a JSON artifact under `.<skill-name>/calibrations/`. Treat
that file as the workbench evidence for judge agreement. It records the run,
optional metric filter, agreement summary, unknown-label rate, false pass/fail
examples, disagreements, and non-binary examples.

## Judge Bias Controls

LLM judges drift in predictable ways. Guard against them:

- **Verbosity bias** — longer answers scored higher regardless of quality.
- **Position / order bias** — in pairwise comparisons, randomize order.
- **Self-preference** — a judge favoring outputs written in its own style.

Reference-guided grading reduces all three. Give the judge explicit judge guidance
and, where possible, hidden expected output or reference material. These hidden
files remain outside the workspace.

If the judge cannot decide from the outcome and allowed transcript evidence,
prefer `unknown` over a confident invented score. Treat `unknown` as a
calibration signal, not as a failure to hide. The report will surface those
trials for review.

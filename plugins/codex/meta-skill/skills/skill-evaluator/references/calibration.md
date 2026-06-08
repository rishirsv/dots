# Calibration

Read when a human will calibrate the judge — the standard way to make
judge-graded evaluation trustworthy.

Human grading is not a parallel scoring track. Its job is to calibrate the LLM
judge: label a little, confirm the judge agrees, then let the judge scale.

## The Loop

1. **Anchor the rubric.** Give each dimension discrete level descriptions (see
   [evaluations.md](evaluations.md)). Ambiguous criteria are the main cause of an
   unreliable judge.
2. **Label a gold subset.** A human scores a handful of cases with a one-line
   rationale, stored as `gold` on those `evals.json` cases. This is ground truth,
   not coverage.
3. **Check agreement.** Run the judge over the gold subset and compare. Practical
   signal: exact-match rate plus a ±1 tolerance band. Reach for weighted kappa or
   correlation only when you want statistical rigor.
4. **Refine on disagreement.** Every case where judge ≠ human is a defect in the
   rubric or judge prompt — tighten the anchor, or add a gold case as a few-shot
   exemplar, then re-run. Loop until agreement clears your threshold.
5. **Scale and re-audit.** The calibrated judge grades the full set; relabel a
   fresh slice occasionally to catch drift.

## Surfacing Divergence

Flag every case where `|gold − judge| ≥ 1` for review, and propose the rubric or
anchor change that would close it. A few well-chosen gold cases beat labeling
everything.

## Judge Bias Controls

LLM judges drift in predictable ways — guard against them:

- **Verbosity bias** — longer answers scored higher regardless of quality.
- **Position / order bias** — in pairwise comparisons, randomize order.
- **Self-preference** — a judge favoring outputs written in its own style.

Reference-guided grading — give the judge the explicit criteria and, where
possible, a reference answer — reduces all three.

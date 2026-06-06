# Improve Skill Spec

## Purpose

Improve Skill reviews existing reusable skills and applies evidence-backed edits only after lint, review, eval, trace, artifact, or human-feedback evidence justifies the change.

## Quality Contract

- Select this lane for existing-skill review and evidence-backed improvement, not for skill creation, eval execution, packaging, installing, or publishing.
- Complete `.meta-skill/review.md` as a Quality-page review before reporting review-only results.
- Mirror declared eval dimensions when reviewing a skill that has `.meta-skill/eval-scenarios.md` or `.meta-skill/evals/*/criteria.json`.
- Preserve deterministic Validation evidence exactly as generated.
- Never fabricate validation rows, lint output, deterministic test status, run IDs, evidence files, or scores.

## Runtime Boundaries

- Review-only mode writes or completes review evidence; it does not edit source.
- Edit mode requires evidence and applies the smallest useful source change.
- Package, install, publish, and release remain explicit later approvals.

## Validation

The workbench includes one contract eval and one deterministic test that check the review contract, eval-dimension alignment rule, synthetic-validation ban, and packaged-reference boundary.

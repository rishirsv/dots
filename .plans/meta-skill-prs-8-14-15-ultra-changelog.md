# Meta-Skill PRs 8, 14, 15 Ultraplan Changelog

## Verdict

The roadmap rows are directionally strong, but PR 15 needs stronger sequencing.
PR 8 and PR 14 can be additive evaluator/reporting improvements. PR 15 should
land only after the project has enough split, gate, comparison, and review
infrastructure to prevent overfitting.

## Run Summary

- Mode: Lean Ultraplan, local synthesis.
- Findings raised: 7.
- Findings verified against current source/docs: 5.
- Findings confirmed into plan changes: 5.
- Findings refuted or intentionally not changed: 2.
- Chosen re-scope: minimal-correct with reuse-maximal pressure.

## Confirmed Changes Applied

### Pairwise Evaluation

- PR 8 should not replace existing absolute grade rows. Change: add dedicated
  pairwise comparison artifacts beside the current grading pipeline.
- PR 8 must blind the judge at prompt time and unblind only through stored
  mappings in artifacts and reports. Change: require deterministic A/B
  randomization and prompt tests.
- PR 8 should use optional grader `mode` instead of inventing a new grader kind.
  Change: existing graders remain backward compatible by defaulting to
  absolute mode.

### Review Visibility

- PR 14 should reuse the current report model. Change: add an HTML renderer or
  helper rather than a second report store.
- PR 14 should preserve Markdown output. Change: recommend
  `eval report --format html --out ...` while keeping Markdown as default.
- PR 14 should gracefully render optional future artifacts. Change: pairwise,
  reference, split, calibration, and gate sections are conditional.

### Optimization Discipline

- PR 15 is not startable as a real optimizer until the evaluator has split
  discipline, hidden gate checks, promotion gates, blind comparison, and review
  visibility. Change: add an explicit start gate and a `15a` ledger-only escape
  hatch.
- PR 15 should reuse candidate source resolution, run outputs, compare results,
  and reports. Change: no separate candidate checkout or run store.
- PR 15 should not write skill edits. Change: first lane records attempts and
  enforces accept/reject decisions over existing artifacts.

## Refuted Or Not Changed

- Do not add a full tournament, Elo, or ranking engine for PR 8. Pairwise
  comparison is enough to improve subjective evaluation signal.
- Do not build a web app for PR 14. A static HTML report covers the review
  story and is easier to validate.
- Do not clone SkillOpt wholesale for PR 15. Borrow the bounded optimization
  discipline, held-out validation, and acceptance gates without adding an
  autonomous rewrite loop.
- Do not make train-split improvement sufficient for optimization acceptance.
  Validation and gates must hold.

## Open Human Decisions

- Whether PR 8 stores model and human pairwise rows in one JSONL artifact or
  separate files.
- Whether PR 14 gets an `eval review` alias in addition to
  `eval report --format html`.
- Whether PR 14 can use inline JavaScript for collapsible details.
- The exact PR 15 validation threshold and gate policy.
- Whether PR 15 should be split into `15a` ledger-only if prerequisites are not
  implemented yet.

## Validation

Post-synthesis checks:

- Confirmed `.plans/meta-skill-prs-8-14-15.md` preserves the seed plan.
- Confirmed `.plans/meta-skill-prs-8-14-15.ultra.md` contains PR 8, PR 14, PR
  15, implementation scopes, tests, validation commands, acceptance criteria,
  a verification matrix, and open decisions.
- Confirmed `.plans/meta-skill-prs-8-14-15-ultra-changelog.md` records the
  verdict, counts, confirmed changes, refuted options, open decisions, and
  validation summary.

Execution tests were intentionally not run because this was a planning pass.

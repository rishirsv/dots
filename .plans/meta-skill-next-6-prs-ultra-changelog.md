# Meta-Skill Next 6 PRs Ultraplan Changelog

## Verdict

The roadmap is directionally right, but the first six PRs should be narrower
than the seed wording. Several requested capabilities already exist partially:
`type`, `split`, `eval run --split`, trigger-balance linting, hidden expected
outputs, and workbench materialization. The upgraded plan turns those into
small, source-owned increments instead of building parallel systems.

## Run Summary

- Mode: Focused Ultraplan with six subagents, one per PR.
- Subagent-reported finding counts where provided: PR 1 reported 4 raised / 4
  verified / 4 confirmed / 0 refuted; PR 2 reported 5 / 5 / 4 / 1; PR 3
  reported 5 / 5 / 4 / 1.
- PR-level re-scope decisions confirmed: 6 of 6.
- Findings without explicit numeric counts were validated by source-grounded
  plan review and reflected as scope changes, not included in a false aggregate.
- Chosen re-scope: minimal-correct with reuse-maximal pressure.

## Confirmed Changes Applied

### Premise Integrity

- PR 1: The architecture doc contains stale source/generated package language.
  Change: make PR 1 docs-only and confined to `ARCHITECTURE.md`.
- PR 2: `type` and `split` are not missing; they already exist in manifest
  normalization and split selection. Change: focus on preserving and surfacing
  missing metadata fields.
- PR 4: Trigger-balance linting exists but misses aliases and symmetric cases.
  Change: harden `eval lint`, not final skill validation.
- PR 6: `eval run --split` exists. Change: make split use auditable in lint,
  run artifacts, and reports.

### Reuse Before Build

- PR 3: Existing workbench materialization and lint/run/grade/report lifecycle
  should own curation output. Change: add `eval curate` as a scaffold over
  those primitives.
- PR 5: Existing graders can grade outcomes; references need to feed through
  that path. Change: add hidden reference proof during grading, not runner
  execution.

### Ownership And Boundaries

- PR 2: Case metadata belongs in `.meta-skill/evals.json` and run snapshots,
  not task text.
- PR 3: `task.md` remains visible-only; hidden criteria stay in manifest,
  judge, expected, validator, or human-grader declarations.
- PR 5: Reference solutions remain hidden and separate from real candidate
  trials.
- PR 6: Split semantics belong in suite metadata and reporting, not optimizer
  state.

### Testability

- PRs 2, 3, 4 need focused stdlib tests under `plugins/meta-skill/tests/`.
- PRs 5 and 6 likely need characterization coverage because they cross
  manifest, grading, report, and runner artifacts.
- `scripts/verify.sh` remains the broad repo check after focused tests.

## Refuted Or Not Changed

- Do not build a new split engine for PR 6. Existing `split` and `--split`
  should be made visible and safer first.
- Do not make PR 4 enforce trigger examples in finalized `SKILL.md` payloads.
  Trigger balance is eval-suite authoring/lint behavior.
- Do not make PR 5 create a reference candidate that runs through the agent
  runner. Reference solutions are oracle outputs graded separately.
- Do not generate packages or edit `dist/` for PR 1. The issue is stale docs,
  not packaging behavior.

## Open Human Decisions

- Whether PR 2 `risk` should be a strict enum or a soft convention.
- Whether PR 3 should support an explicit `--allow-ungraded`.
- Exact field names for PR 5 reference proof artifacts.
- Whether PR 6 allows custom split names beyond `train`, `validation`, and
  `test`.

## Validation

Post-synthesis checks:

- Confirmed `.plans/meta-skill-next-6-prs.md` preserves the seed plan.
- Confirmed `.plans/meta-skill-next-6-prs.ultra.md` contains six PR sections,
  scope, validation, acceptance criteria, and open decisions.
- Confirmed no implementation source changes were made as part of this
  Ultraplan pass.

Execution tests were intentionally not run because this was a planning pass.

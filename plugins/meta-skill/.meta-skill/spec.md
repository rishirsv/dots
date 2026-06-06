# Meta Skill Plugin Spec

## Purpose

Evaluate the Meta Skill plugin as a three-lane skill workbench:

- `create-skill` turns recurring workflows, source packs, and existing drafts into portable skill payloads.
- `evaluate-skill` authors and runs `.meta-skill/evals/` evidence with task and criteria files.
- `improve-skill` reviews or edits existing skills from evidence, including registry-quality review output.

The self-eval project verifies that these lanes stay distinct, hand off smoothly, and produce portable artifacts without reintroducing stale score shapes, nested tests, or package-fragile references.

## Source Scope

Runtime source under review:

- `skills/create-skill/SKILL.md`
- `skills/create-skill/references/`
- `skills/create-skill/assets/skill-spec-template.md`
- `skills/evaluate-skill/SKILL.md`
- `skills/evaluate-skill/references/eval-authoring.md`
- `skills/improve-skill/SKILL.md`
- `skills/improve-skill/references/prompt-doctor.md`
- `skills/improve-skill/references/review-criteria.md`
- `skills/meta-skill/SKILL.md`
- `references/cli-conventions.md`
- `src/review.ts`
- `src/eval/`
- `src/lint.ts`

## Registry Quality Basis

The evals mirror public registry Quality and Evals surfaces for a reference skill-creation workflow:

- Quality scoring uses Discovery, Implementation, and Validation.
- Discovery checks description specificity, completeness, trigger terms, and conflict risk.
- Implementation checks conciseness, actionability, workflow clarity, and progressive disclosure.
- Validation is deterministic and must not be faked by model judgment.
- Evals include realistic tasks for authoring a skill, setting up eval infrastructure, and improving trigger accuracy.

## Boundaries

- Do not add `Total Score` or `Judge Score` back into review output.
- Do not create nested folders under `.meta-skill/tests/`.
- Keep eval criteria in `criteria.json`; do not expose them in solver-visible `task.md`.
- Keep each eval focused on one behavior surface, but include handoff criteria when the user task crosses lanes.
- Deterministic tests are evidence, not a replacement for agent-authored eval judgment.

## Open Questions

- Plugin-level eval execution currently differs from single portable-skill execution. These evals target lane skills explicitly in task text and deterministic tests; future runner support may mount plugin-level skill bundles directly.

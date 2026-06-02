---
name: skill-improve
description: Use when reviewing, planning, patching, promoting, or recording decisions for an existing skill from lint, review, eval, judge, trace, artifact, or human-feedback evidence; not for creating new skills, running scenario evals, autonomous rewrites, or silent release.
---

# Skill Improve

Improve an existing skill with evidence and restraint. This lane owns best-practice review, bounded plans, human-approved promotion into the working portable payload, and accept/reject decision records.

## Reference Map

| Need | Read |
|---|---|
| Review/edit mode, prompt-doctor loop, finding shape, surgical update rules, and review output | [prompt-doctor.md](references/prompt-doctor.md) |
| Shared CLI behavior | sibling `skill-create` skill's [cli-conventions.md](../skill-create/references/cli-conventions.md) |
| Creation-time structure and payload rules | sibling `skill-create` references |

## Runtime Contract

- Use `.meta-skill/` as the workbench.
- Use `.meta-skill/reviews/` for best-practice review output.
- Use `.meta-skill/plans/` for bounded improvement plans.
- Use `.meta-skill/sessions/` for promotion and decision records.
- Require evidence before planning a patch: lint output, review ID, eval run ID, scenario ID, test failure, judge note, trace, artifact, or human feedback. Each planned edit should cite at least one evidence reference.
- Do not invent proof, auto-promote, release, package, install, or publish.
- Treat `needs_review` eval status as unresolved evidence, not pass proof. Before planning or promoting from it, name what ran, what evidence exists, and what still needs deterministic test coverage, judge approval, or human review.

## Commands

```bash
meta-skill review <project> [--json]
meta-skill plan <project> --from-run <run-id>
meta-skill plan <project> --from-review <review-id>
meta-skill promote <project> --plan <plan-id>
meta-skill decide <project> --session <session-id> --accept
meta-skill decide <project> --session <session-id> --reject
```

`review` writes `.meta-skill/reviews/<review-id>/` and does not edit source.

`plan` writes `.meta-skill/plans/<plan-id>/` and does not edit source.

`promote` applies a human-approved candidate edit from the plan into the working portable payload at the project root. It does not create a release.

`decide` records accept/reject in `.meta-skill/sessions/<session-id>/`. Reject records intent; it does not restore files.

Use `meta-skill release <project>` only after validation and human approval. Release is separate from promotion.

## Edit Discipline

Read [prompt-doctor.md](references/prompt-doctor.md) before non-trivial edits.

- Pick mode first: review-only, surgical edit, or redesign.
- Read the skill before changing it.
- Keep the smallest useful change tied to evidence.
- Preserve trigger meaning, output contract, tone, and unrelated resources unless they are the problem.
- Update `.meta-skill/spec.md` when behavior changes.
- Rerun `meta-skill lint` and relevant `meta-skill eval run` scenarios after edits.

## Output

For review-only mode, report findings ordered by severity, evidence, impact, precise fixes, and validation commands.

For edit mode, report files changed, behavior preserved, behavior changed, validation run and result, and residual risk.

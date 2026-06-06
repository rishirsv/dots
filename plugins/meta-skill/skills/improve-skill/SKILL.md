---
name: improve-skill
description: "Use when a user asks for skill review, fix my skill, update a skill, or improve an existing reusable skill from evidence: run/read review.md, fix lint issues, apply targeted patches to SKILL.md, references, scripts, or assets, and incorporate eval, trace, or human-feedback findings; not for creating new skills, running evals, broad rewrites without evidence, packaging, installing, or publishing."
---

# Improve Skill

Improve an existing skill with evidence and restraint. This lane owns best-practice review and evidence-backed edits to the working portable payload.

## Reference Map

| Need | Read |
|---|---|
| Review/edit mode, prompt-doctor loop, finding shape, surgical update rules, and review output | [prompt-doctor.md](references/prompt-doctor.md) |
| Quality page shape, review dimensions, scoring rules, and finding format | [review-criteria.md](references/review-criteria.md) |
| Shared CLI behavior | [cli-conventions.md](../../references/cli-conventions.md) |
| Creation-time structure and payload rules | sibling `create-skill` references |

## Runtime Contract

- Use `.meta-skill/` as the workbench.
- `meta-skill review <skill-dir>` writes deterministic validation evidence and a Quality-page worksheet at `.meta-skill/review.md`.
- The reviewing agent must complete Discovery, Implementation, Quality Score, and combined findings from [review-criteria.md](references/review-criteria.md) before reporting the review to the user. Use multi-sentence overall assessments and evidence-backed dimension reasoning; do not leave terse checklist judgments.
- Require evidence before patching: lint output, eval run ID, eval ID, test failure, trace, saved evidence file, or human feedback. Each edit should cite at least one evidence reference.
- Do not invent proof, auto-apply edits, package, install, or publish.
- Treat completed eval execution as evidence only, not pass proof. Before editing from it, name what ran, what files exist, and what the evidence shows.

Edit the working portable payload directly after the evidence justifies the change. Git is the application mechanism and diff review surface.

## Edit Discipline

Read [prompt-doctor.md](references/prompt-doctor.md) before non-trivial edits.

- Pick mode first: review-only, surgical edit, or redesign.
- Read the skill before changing it.
- For review-only requests, run `meta-skill review <skill-dir>`, read [review-criteria.md](references/review-criteria.md), and complete `.meta-skill/review.md` as an agent-authored Quality page before reporting. Reasoning should cite concrete phrases, sections, links, validation output, or missing artifacts.
- Keep the smallest useful change tied to evidence.
- Preserve trigger meaning, output contract, tone, and unrelated resources unless they are the problem.
- Update `SKILL.md`, relevant references, evals, deterministic tests, and `.meta-skill/spec.md` when the change affects their stated behavior or eval intent.
- Rerun `meta-skill lint` and relevant `meta-skill run` evals after edits.

## Output

For review-only mode, report findings ordered by severity, evidence, impact, precise fixes, and validation commands.

For edit mode, report files changed, behavior preserved, behavior changed, validation run and result, and residual risk.

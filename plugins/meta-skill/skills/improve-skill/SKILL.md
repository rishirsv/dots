---
name: improve-skill
description: "Use when a user asks to improve a skill, prompt doctor a skill, review a skill, fix my skill, update a skill, or make evidence-backed changes to an existing reusable skill: run/read review.md, fix lint issues, patch SKILL.md, references, scripts, or assets, and incorporate eval, trace, or human-feedback findings; not for creating new skills, running evals, broad rewrites without evidence, packaging, installing, or publishing."
---

# Improve Skill

Improve an existing skill with evidence and restraint. This lane owns best-practice review and evidence-backed edits to the working portable payload.

## Reference Map

| Need | Read |
|---|---|
| Review/edit mode, prompt-doctor loop, finding shape, surgical update rules, and review output | [prompt-doctor.md](references/prompt-doctor.md) |
| Quality page shape, review dimensions, scoring rules, and finding format | [review-criteria.md](references/review-criteria.md) |

For isolated subagent trials or adversarial reviews, use the shared Meta Skill reference at `../../references/subagent-patterns.md`.

## Runtime Contract

- Use `.meta-skill/` as the workbench.
- `meta-skill review <skill-dir>` writes deterministic validation evidence and a Quality-page worksheet at `.meta-skill/review.md`.
- The reviewing agent must complete Discovery, Implementation, Quality Score, and combined findings from [review-criteria.md](references/review-criteria.md) before reporting the review to the user. Use multi-sentence overall assessments and evidence-backed dimension reasoning; do not leave terse checklist judgments.
- When the target has `.meta-skill/eval-scenarios.md` or `.meta-skill/evals/*/criteria.json`, mirror those Quality, Implementation, and Validation dimensions in the review. The review should judge whether the skill guidance can actually satisfy the same dimensions its evals claim to measure.
- Require evidence before patching: lint output, eval run ID, eval ID, test failure, trace, saved evidence file, or human feedback. Each edit should cite at least one evidence reference.
- Do not invent proof, auto-apply edits, package, install, or publish. Never fabricate validation rows, lint results, deterministic test status, scores, run IDs, or evidence files; if evidence is missing, say what is missing and keep the finding evidence-scoped.
- Treat completed eval execution as evidence only, not pass proof. Before editing from it, name what ran, what files exist, and what the evidence shows.
- For non-trivial edits, use an isolated read-only subagent review when available. Follow the shared subagent patterns at `../../references/subagent-patterns.md`: the subagent receives a compact scope and realistic maintainer request, while the parent keeps hidden criteria, scoring, edits, and final validation.

Edit the working portable payload directly after the evidence justifies the change. Git is the application mechanism and diff review surface.

## Edit Discipline

Read [prompt-doctor.md](references/prompt-doctor.md) before non-trivial edits.

- Pick mode first: review-only, surgical edit, or redesign.
- Read the skill before changing it.
- For review-only requests, run `meta-skill review <skill-dir>`, read [review-criteria.md](references/review-criteria.md), and complete `.meta-skill/review.md` as an agent-authored Quality page before reporting. Reasoning should cite concrete phrases, sections, links, validation output, or missing artifacts. If eval scenarios or criteria exist, use their dimensions as the review lens rather than inventing a separate framework.
- Keep the smallest useful change tied to evidence.
- Preserve trigger meaning, output contract, tone, and unrelated resources unless they are the problem.
- Update `SKILL.md`, relevant references, evals, deterministic tests, and `.meta-skill/spec.md` when the change affects their stated behavior or eval intent.
- Rerun `meta-skill lint` and relevant `meta-skill run` evals after edits.

## Output

For review-only mode, report findings ordered by severity, evidence, impact, precise fixes, and validation commands.

For edit mode, report files changed, behavior preserved, behavior changed, validation run and result, and residual risk.

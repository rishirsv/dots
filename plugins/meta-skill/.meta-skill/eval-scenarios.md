# Eval Scenarios

## Evaluation Purpose

Measure whether the Meta Skill plugin reliably creates, evaluates, and improves reusable skills with registry-quality discipline. The evals should show that the three focused lanes stay separate, that the right lane owns the right artifact, and that generated evidence is concrete enough to drive the smallest useful next edit.

## Source Distillation

| Source | Claim / rule / pattern | Why it matters for evals |
|---|---|---|
| `skills/create-skill/SKILL.md` | Create Skill decides whether work is skill-shaped, drafts a portable payload, and adds `.meta-skill/` only when project mode or eval discipline is needed. | Evals must check trigger pressure, portable payload structure, source distillation, and project-mode eval scenario creation. |
| `skills/evaluate-skill/SKILL.md` | Evaluate Skill owns `.meta-skill/evals/`, `task.md`, `criteria.json`, deterministic tests, App Server runs, and evidence interpretation. | Evals must check that eval cases are created in the split task/criteria shape and that criteria remain evaluator-only. |
| `skills/improve-skill/SKILL.md` | Improve Skill owns read-only review, evidence-backed edits, Quality-page review completion, and smallest-useful-change discipline. | Evals must check review output depth, evidence citations, no fake judge scores, and handoff from review to edits. |
| `skills/meta-skill/SKILL.md` | Meta Skill routes broad requests into Create, Evaluate, Improve, package, or release lanes. | Evals must check cross-lane sequencing without collapsing all work into one lane. |
| `skills/improve-skill/references/review-criteria.md` | Quality review uses Discovery, Implementation, Validation, calibrated scores, and deeper evidence-backed reasoning. | Evals must enforce Quality-page reasoning length and score calibration. |
| `references/cli-conventions.md` | CLI commands write stable artifacts and avoid stale review/eval/report surfaces. | Evals must check command ownership and artifact names. |

## Evaluation Framework

### Quality

Base dimensions:
- Specificity
- Completeness
- Trigger Term Quality
- Distinctiveness / Conflict Risk

Additive dimensions:
- Lane Selection Accuracy
- Source Distillation
- Handoff Clarity

### Implementation

Base dimensions:
- Conciseness
- Actionability
- Workflow Clarity
- Progressive Disclosure

Additive dimensions:
- Portable Payload Shape
- Eval Case Shape
- Quality Review Depth
- Evidence-to-Edit Discipline

### Validation

Base dimensions:
- Structural correctness
- Metadata correctness
- Required body/content presence
- Formatting compatibility

Additive dimensions:
- Criteria Privacy
- Flat Deterministic Tests
- Deprecated Surface Avoidance
- Review Score Shape

## Scenario Plan

| Scenario | Phase focus | User task shape | Baseline risk | Expected skill lift | Dimensions exercised | Source basis |
|---|---|---|---|---|---|---|
| Create project-mode skill from workflow | Quality / Implementation | User describes a repeated API documentation workflow and asks for a reusable skill with eval planning. | Base agent writes a generic prompt doc, skips trigger boundaries, or creates eval files too early. | Produces a portable skill payload plus `.meta-skill/eval-scenarios.md` with source distillation and scenario rows, without running evals. | Quality: Specificity; Quality: Lane Selection Accuracy; Implementation: Portable Payload Shape; Implementation: Source Distillation; Validation: Structural correctness | `skills/create-skill/SKILL.md`, `skills/create-skill/references/structure.md`, reference eval "Create a Skill for Automated Git Commit Message Generation" |
| Author eval infrastructure from scenarios | Implementation / Validation | User has a skill and high-level eval scenarios and wants concrete eval cases. | Base agent writes vague prompts, puts criteria in the task, omits `criteria.json`, or nests tests. | Produces `.meta-skill/evals/<slug>/task.md`, `criteria.json`, fixture declarations, flat deterministic tests, and an honest run plan. | Implementation: Eval Case Shape; Implementation: Actionability; Validation: Criteria Privacy; Validation: Flat Deterministic Tests; Quality: Completeness | `skills/evaluate-skill/SKILL.md`, `skills/evaluate-skill/references/eval-authoring.md`, reference eval "Setting Up Evaluation Infrastructure for a New Skill" |
| Complete registry-quality skill review | Quality / Implementation | User asks for read-only review of an existing skill and wants a completed Quality page. | Base agent returns thin findings, fake judge scores, or only lint output. | Runs `meta-skill review`, completes Discovery and Implementation with multi-sentence evidence-backed reasoning, computes Quality Score, and keeps Validation deterministic. | Quality: Trigger Term Quality; Implementation: Quality Review Depth; Implementation: Evidence-to-Edit Discipline; Validation: Review Score Shape; Validation: Deprecated Surface Avoidance | `skills/improve-skill/SKILL.md`, `skills/improve-skill/references/review-criteria.md`, reference Quality page |
| Generate trigger boundary eval queries | Quality / Validation | User says a spreadsheet skill under-triggers and asks for query evals to improve activation. | Base agent writes generic or toy queries, misses near-miss should-not-trigger cases, or edits the skill before evidence. | Produces realistic should-trigger and should-not-trigger query cases, explains rationale, and hands improvement work to Improve Skill only after evidence exists. | Quality: Trigger Term Quality; Quality: Distinctiveness / Conflict Risk; Implementation: Workflow Clarity; Validation: Criteria Privacy; Validation: Evidence-to-Edit Discipline | `skills/evaluate-skill/SKILL.md`, `skills/improve-skill/SKILL.md`, reference eval "Improve Skill Triggering Accuracy with Eval Queries" |
| Route broad Meta Skill request across lanes | Quality / Implementation | User asks to create a skill, evaluate it, then improve it from results. | Base agent performs everything in one unbounded flow, edits without evidence, or packages without approval. | Routes Create -> Evaluate -> Improve, names human gates, writes only authorized artifacts, and preserves package/release approval boundaries. | Quality: Lane Selection Accuracy; Implementation: Handoff Clarity; Implementation: Workflow Clarity; Validation: Deprecated Surface Avoidance | `skills/meta-skill/SKILL.md`, all focused lane `SKILL.md` files |

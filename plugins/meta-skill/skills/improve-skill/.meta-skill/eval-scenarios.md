# Eval Scenarios

## Evaluation Purpose

Measure whether Improve Skill can review and improve existing skills from evidence while keeping review dimensions aligned with the eval dimensions the project creates.

## Source Distillation

| Source | Claim / rule / pattern | Why it matters for evals |
|---|---|---|
| `SKILL.md` | Improve Skill owns review-only mode and evidence-backed edits for existing skills. | Evals must check that the lane does not create skills, run evals, or edit without evidence. |
| `references/review-criteria.md` | Reviews use Discovery, Implementation, deterministic Validation, and eval-dimension alignment when eval criteria exist. | Evals must check that review reasoning mirrors Quality, Implementation, and Validation dimensions instead of inventing a separate rubric. |
| `.meta-skill/tests/review-contract.sh` | The deterministic contract test checks the synthetic-validation ban and package-local references. | Validation must catch regressions in the exact rules that failed the subagent eval round. |

## Evaluation Framework

### Quality

Base dimensions:
- Specificity
- Completeness
- Trigger Term Quality
- Distinctiveness / Conflict Risk

Additive dimensions:
- Lane Selection Accuracy
- Eval Dimension Alignment

### Implementation

Base dimensions:
- Conciseness
- Actionability
- Workflow Clarity
- Progressive Disclosure

Additive dimensions:
- Evidence-to-Edit Discipline
- Review Reasoning Depth

### Validation

Base dimensions:
- Structural correctness
- Metadata correctness
- Required body/content presence
- Formatting compatibility

Additive dimensions:
- Synthetic Validation Avoidance
- Deterministic Evidence Preservation
- Packaged Reference Integrity

## Scenario Plan

| Scenario | Phase focus | Capability | User task shape | Baseline risk | Expected skill lift | Dimensions exercised | Source basis |
|---|---|---|---|---|---|---|---|
| Complete evidence-backed review | Quality / Implementation / Validation | Improve Skill | User asks for a read-only review of a skill that already has eval scenarios and a generated review worksheet. | Base agent invents validation rows, ignores eval dimensions, or reports vague findings. | Completes Discovery and Implementation with evidence-backed reasoning, mirrors eval dimensions in findings, preserves deterministic Validation, and avoids edits. | Quality: Eval Dimension Alignment; Implementation: Review Reasoning Depth; Implementation: Evidence-to-Edit Discipline; Validation: Synthetic Validation Avoidance; Validation: Deterministic Evidence Preservation | `SKILL.md`, `references/review-criteria.md` |

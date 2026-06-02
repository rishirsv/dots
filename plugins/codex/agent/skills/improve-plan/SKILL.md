---
name: improve-plan
description: Use when improving an existing saved or drafted execution plan into one canonical, evidence-backed, continuation-ready replacement for second-pass planning; not for initial scoping, broad ideation, implementation, or copyediting.
---

# Improve Plan

Turn an existing plan into a stronger, canonical, execution-ready replacement. This is second-pass planning, not implementation.

## Scope

Accept:

- a saved plan path
- the current plan under discussion
- a feature slug that maps to the repo's plan convention
- the most recent plan only when the user's wording clearly points to it

If no target can be found, state what was searched and stop.

Do not implement code or product changes. Use read-only exploration except when the user asks you to save the improved plan. Edit only the target plan file when saving is requested.

## Workflow

1. Find the target plan and repo plan convention from `AGENTS.md`, `README.md`, planning docs, indexes, or neighboring plans.
2. Classify the draft: rough, under-specified, almost ready, or structurally wrong.
3. Identify the gaps that would make another agent guess: scope, sequence, files, validation, user-visible outcome, assumptions, risks, and completion criteria.
4. Inspect only evidence that closes those gaps: relevant docs, code, tests, scripts, adjacent implementations, trackers, PR notes, and local commands.
5. Load [references/plans-contract.md](references/plans-contract.md) only when the target is an ExecPlan or the repo requires the PLANS.md contract.
6. Rewrite as one canonical replacement, not an addendum.
7. Classify the result as `ready for normal implementation`, `better suited for batch / parallel execution`, or `blocked on one user decision`.

Use reviewer or explorer subagents only for broad plans where separable evidence, risk, validation, or sequencing passes would materially improve the rewrite. The main thread owns the final plan.

## Rewrite Standards

A strong plan names:

- objective and user-visible outcome
- scope and non-goals
- concrete files, modules, commands, tests, or artifacts when known
- milestones or task groups in dependency order
- validation inside each major phase
- assumptions and decisions
- resumable checkpoints for long work
- strict completion criteria

Preserve completed checkboxes in saved plans unless repo evidence proves they are wrong.

## Optional Plan Diff

When useful, include a compact diff before or after the replacement:

- `kept`: strong parts preserved from the seed plan
- `removed`: vague, duplicated, stale, or misleading parts cut
- `added`: missing evidence, sequencing, validation, or decisions added
- `unresolved`: genuine blockers or accepted assumptions

## Output

Return:

1. Plan improved.
2. Main gaps fixed.
3. Assumptions or decisions.
4. Improved plan or updated file path.
5. Readiness classification.
6. The smallest blocking question only if truly blocked.

## Guardrails

- Do not ask questions the repo can answer.
- Do not preserve bad structure just because it exists.
- Do not append loose notes.
- Do not call a plan ready while sequencing, validation, or completion remains ambiguous.
- Do not turn plan improvement into open-ended research.
- Do not split work into parallel batches unless ownership and validation boundaries are real.

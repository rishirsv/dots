# ExecPlan Format

An ExecPlan is a self-contained, living implementation document for complex features, significant refactors, or long handoffs. It should let a stateless reader continue the work from the plan alone.

## Use An ExecPlan When

- The work has multiple milestones or meaningful unknowns.
- The implementer needs exact repository context, commands, expected outputs, and validation.
- The plan must be updated as progress, discoveries, and decisions happen.
- The reader needs more than product scope but less than a normative project spec.

## Do Not Use An ExecPlan When

- The main question is product scope, user value, or acceptance criteria. Use a PRD.
- The main question is a language-agnostic system contract. Use a project spec.
- The task is small enough for a short plan in chat or a local checklist.

## Requirements

- Be fully self-contained.
- Explain the user-visible or operator-visible purpose first.
- Define every non-obvious term in plain language.
- Name repository-relative paths, modules, commands, and expected signals.
- Include behavior a human can observe, not only code changes.
- Keep the living sections current as work proceeds.
- Resolve ambiguity inside the plan when a reasonable choice is available.

## Required Sections

1. Purpose / Big Picture
2. Progress
3. Surprises & Discoveries
4. Decision Log
5. Outcomes & Retrospective
6. Context and Orientation
7. Plan of Work
8. Concrete Steps
9. Validation and Acceptance
10. Idempotence and Recovery
11. Artifacts and Notes
12. Interfaces and Dependencies

## Writing Rules

- Write prose-first. Use lists where they make progress, commands, or contracts clearer.
- `Progress` must use checkboxes and should include enough detail to resume.
- `Surprises & Discoveries` should record unexpected behavior with concise evidence.
- `Decision Log` should include the decision and rationale.
- Validation must include exact commands or actions and expected observations.
- Recovery must say how to retry, undo, or continue after partial failure.
- Do not depend on prior conversation, hidden assumptions, or external references for required context.

## Template

Use [assets/EXECPLAN_template.md](../assets/EXECPLAN_template.md) to seed a new ExecPlan.

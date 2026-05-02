# Artifacts

Default to chat. Create a durable artifact only when the result needs to survive the conversation, guide planning, or hand off to later work.

## Artifact Families

Use the repo's existing convention first. Look for local instructions in root guidance, docs-folder guidance, existing artifact folders, and nearby examples. If the repo has no convention and the user has not specified one, ask where to store the artifact before writing it.

### Context

Use for shared understanding, canonical terms, ownership, architecture, constraints, or decision context.

Use the repo's canonical context, architecture, project-spec, or decision-doc location. If none exists, ask before creating a new document family.

Suggested sections:

- Purpose
- Agreed
- In Scope
- Out Of Scope
- Still Open
- Next

### Product Spec

Use when product or feature scope is stable enough to guide planning.

Use the repo's canonical product-spec, feature-spec, or requirements location. If none exists, ask before creating a new document family.

Suggested sections:

- TL;DR
- Scope
- What We Are Building
- User-Visible Surface Map
- How It Works
- Non-Goals
- Acceptance Criteria
- Verification Notes

### ExecPlan

Use only when moving into substantial implementation planning.

Use the repo's canonical ExecPlan location and lifecycle. Common layouts have active and completed plan folders, but do not invent that layout if the repo already uses another one.

When the artifact is an ExecPlan:

1. Find and follow local plan instructions first. Check root guidance, docs-folder guidance, plan template files, and existing ExecPlans.
2. If the repo has no ExecPlan convention, use the portable fallback shape below.
3. If the destination path is ambiguous, ask where the plan should live before writing it.

Portable fallback shape:

An ExecPlan should be restartable: another agent should be able to continue from the plan file plus the current working tree.

Use this skeleton when no local template exists:

```md
# <Feature Or Change> ExecPlan

## Purpose

Explain the user-visible outcome and why it matters.

## Phase Outcomes

- Phase 1: <non-technical outcome>
- Phase 2: <non-technical outcome>
- Phase 3: <non-technical outcome>

## Implementation Checklist

- [ ] 1.0 Parent task title
  - [ ] 1.1 Sub-task
  - [ ] 1.2 Sub-task
  - [ ] 1.3 Validation for 1.0: tests, manual checks, or deliverable review

## Validation

List exact checks to run and what success looks like.

## Decision Log

- <Decision>: <why it was made>

## Surprises And Discoveries

- <Finding>: <impact on the plan>

## Completion Notes

- Shipped:
- Remaining:
- Follow-up:
```

Scope can recommend an ExecPlan, but should not force one.

## Ideation Output

Do not create a separate ideation document family by default.

Important ideation output should either:

- stay in chat,
- become part of a context, or
- become part of a product spec.

When preserving ideation inside another artifact, include:

- grounding
- ranked directions
- rejected or parked directions
- recommended next step

## Rules

- Update an existing canonical artifact instead of creating a duplicate.
- Follow local `AGENTS.md` instructions for docs folders.
- Label assumptions and unverified claims.
- Keep file references aligned with current code.
- Do not create product code from Scope.

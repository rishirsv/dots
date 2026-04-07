---
name: forms-implementor
description: Implement React form submission flows aligned to repository conventions, including validation, submit state, error handling, accessibility, and integration with existing Redux-saga async flows and API fetch utilities. Use when asked to add or modify forms (create/edit), wire submit handlers, connect to Redux state, trigger sagas, handle server errors, or implement optimistic/redirect behavior after submit.
---

# React Form Submission Implementation

## Purpose
Help Codex complete form implementation work end-to-end by:
- translating a form design or scoped form task into repository-aligned code
- wiring validation, submit state, error handling, and async flows without breaking existing patterns
- relying on `../forms-common/SKILL.md` for shared form rules instead of duplicating them here

## When to use this skill:
- The user wants forms created or updated in code.
- The work includes validation, submit handlers, Redux wiring, saga triggers, server error handling, or post-submit behavior.
- The task needs file placement, minimal tests, and repository-aligned async integration in addition to UI changes.

### Do NOT use this skill if:
- The user only wants a form design/spec with no code changes.
- The task is primarily a generic component, routing, or non-form Redux change and another skill should lead.
- The repository area does not use form code or async flows relevant to the request.

## Inputs

- A `## Form Design (for forms-implementor)` block when available.
- Or a scoped task description plus access to nearby form patterns.

## Output Format

When implementing, return:
1. File tree of added or changed files
2. Full content for each new file
3. Diffs or full content for modified files
4. Notes on conventions matched for form library, validation, saga wiring, fetch utilities, exports, and tests

## Workflow

1. Read `../forms-common/SKILL.md` and apply its shared placement, submission, and accessibility rules.
2. Determine the smallest correct placement for the form and any local helpers.
3. Mirror the local file shape first:
   - `<FormName>.tsx`
   - `<FormName>.types.ts` when contracts are substantial
   - `<FormName>.validation.ts` when validation is non-trivial
   - `index.ts` only where local barrels already exist
4. If the owning page would otherwise mix route wiring, form state, large JSX sections, and feedback/result rendering in one file, convert the page to a small local folder and extract:
   - the route entry or page shell
   - the form section
   - the feedback or result section
   - validation, types, and hooks files when non-trivial
5. Implement the form baseline with typed fields, defaults, validation timing, submit disabling, and consistent error rendering.
6. Wire submission through existing saga flows when possible; create a new flow only when no safe extension exists.
7. Implement post-submit behavior, retry handling, and missing-context safeguards.
8. Add or update focused tests when test setup exists, prioritizing validation, submit dispatch, and error rendering.

## Guardrails

- Do not bypass existing Redux-saga or fetch utility patterns.
- Do not call APIs directly from components when saga flows are the established pattern.
- Do not introduce new form abstractions or libraries without clear justification.
- Keep changes directly tied to the requested form behavior.
- Do not keep large form pages as a single monolithic file when local extraction would make the main flow easier to scan.
- Prefer nearby local components and hooks over inline helper functions, nested branches, and oversized JSX blocks inside `index.tsx`.

---
name: forms-common
description: Shared React form guidance for this repository. Use alongside form design or form implementation tasks when Codex needs the common rules for app detection, form placement, field/state ownership, Redux-saga submission expectations, existing fetch utility usage, and form accessibility baseline without duplicating them in role-specific skills.
---

# Forms Common

## Purpose
Help Codex keep React form design and implementation work consistent by:
- centralizing shared rules for form ownership, placement, validation, and async submission
- defining the repository's expected Redux-saga and fetch-utility integration baseline
- removing duplicate form setup from the designer and implementor skills

## When to use this skill:
- The task is about designing or implementing form behavior in this repository.
- A forms designer or implementor skill needs shared guidance for validation, submission, errors, and placement.
- Codex must decide how local field state, submit state, and server-driven state should be split.

### Do NOT use this skill if:
- The task is primarily about component styling with no form submission behavior.
- The work is a generic API or Redux task with no form-specific ownership or UX concerns.
- The request is outside this repository's React UI code.

## Inputs

- The target app and form surface in scope.
- The task description or form design block.
- Nearby forms, validation patterns, selectors, sagas, and fetch utilities when available.

## Output Format

This skill does not define a standalone deliverable. It supplies shared form guidance that the designer and implementor skills should apply.

## Workflow

### 1. Inspect repository context

1. Read `../ccf-general/ccf-general-common/SKILL.md` for repo-wide frontend and async-flow constraints. Read `../theme/design-system-common/SKILL.md` whenever the task includes control sizing, spacing, corner radius, or shared field styling decisions.
2. Identify the target app and form surface:
   - page form
   - dialog form
   - inline editor
   - wizard step
3. Inspect nearby forms to match:
   - form library
   - validation style
   - error presentation
   - submit success behavior
   - Redux wiring and fetch usage
4. Use `../../ui-references/placement-matrix.md` and existing local form patterns before proposing placement.

### 2. Decide form ownership and state boundaries

1. Keep field input state local unless the repository already centralizes it for that flow.
2. Use Redux-managed state for async submit status, server errors, and shared result state when that is the local pattern.
3. Reuse existing saga flows when they already cover the use case.
4. Only create a new saga flow when no suitable existing flow can be extended safely.

### 3. Apply shared form baseline

1. Use typed field models and submit payloads.
2. Define:
   - defaults and edit-mode hydration
   - validation rules and when they run
   - post-submit behavior
   - retry behavior
3. Keep APIs behind existing Redux-saga and fetch utility patterns rather than direct component fetches.
4. Use semantic form markup, visible labels, keyboard-friendly submit behavior, and announced errors.
5. Reuse existing form field components and styling patterns before introducing new control primitives.
6. When the local form pattern uses Chakra-backed controls, extend that pattern instead of mixing in a new one.
7. Use the shared form-control baseline for all non-textarea controls: `h-10` and `rounded-md`. All single-line controls must share the same visual height by default.
8. Textareas are exempt from the single-line height rule; use content-driven `min-h-*` sizing instead.
9. Prefer a shared control primitive or recipe over repeating local height and radius classes across fields.
10. Do not mix Chakra size or radius props with Tailwind height or radius utilities on the same control.7. Keep the route page responsible for form orchestration, not every field group's rendering and helper branch.
11. When a form screen also contains result panels, recovery messaging, or secondary action regions, extract those into nearby local components so the page file stays readable.
12. Move non-trivial validation, normalization, and submit-mapping logic into nearby `*.validation.ts`, `*.types.ts`, or local hooks when it materially improves readability.


## Guardrails

- Do not invent shared form utilities "just in case."
- Do not bypass existing saga-driven submission patterns.
- Do not introduce a new form library unless explicitly requested or already used locally.
- Keep form guidance close to the owning page or feature.

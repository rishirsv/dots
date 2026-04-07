---
name: accessibility-designer
description: Produce an Accessibility Design block that defines how a task's UI should satisfy accessibility requirements without implementing code. Use when asked to design accessibility behavior, acceptance criteria, ownership, and placement guidance for React TypeScript UI in a way an implementation agent can apply directly.
---

# Accessibility Designer

## Purpose
Help Codex complete accessibility design work end-to-end by:
- producing a design-ready accessibility spec that an implementation skill can follow
- defining ownership and placement for accessibility changes
- relying on `../accessibility-common/SKILL.md` for the shared accessibility checklist instead of repeating it here

## When to use this skill:
- The user wants an accessibility plan, spec, or design for a UI task without code changes.
- The task needs implementable accessibility acceptance criteria for pages, dialogs, forms, tables, or shared UI.
- Another design skill covers general UI structure, but this task needs a dedicated accessibility design block.

### Do NOT use this skill if:
- The user wants code changes rather than a design/spec.
- The task is a general component or form design request with only routine accessibility notes.
- The task is a pure accessibility bug fix and the work should go straight to implementation.

## Inputs

- Task name.
- Task description or acceptance criteria.
- Any known accessibility findings, WCAG targets, or affected surfaces.

## Workflow

1. Read `../accessibility-common/SKILL.md` and apply its shared preparation and checklist.
2. Identify the minimum set of surfaces that need explicit accessibility design coverage.
3. For each surface, define only the task-specific accessibility requirements:
   - ownership and placement
   - required behavior and state handling
   - any task-specific semantics, focus, keyboard, labeling, ARIA, or announcement expectations
4. Keep the design concrete enough that an implementation agent can apply it without reinterpreting intent.
5. If a requirement depends on an unknown repository convention, state the assumption instead of inventing a new pattern.

## Output Format

Return all sections in this order:

1. `Summary`
2. `Assumptions`
3. `## Accessibility Design (for implement-accessibility)`

The `## Accessibility Design (for implement-accessibility)` block must include only:
- **Task Goal**
- **Accessibility Inventory**
  - surface/component name
  - responsibility
  - ownership (`page`, `feature`, or `shared`)
  - placement folder
- **Accessibility Specs (per surface/component)**
  - visual structure only where it affects accessibility
  - props/types only when accessibility requires new contract surface
  - states and how they should be rendered or announced
  - events/callbacks that matter for keyboard or focus behavior
  - task-specific accessibility notes

## Guardrails

1. Do not repeat the shared checklist from `../accessibility-common/SKILL.md`; reference it through the design decisions you make.
2. Keep the design block concrete and implementation-ready.
3. Do not require new dependencies unless explicitly requested.
4. Do not propose shared abstractions "just in case."
5. Align with existing repository conventions, or state assumptions clearly when they are unknown.

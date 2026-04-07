---
name: forms-designer
description: Produce a Form Design block (visual + technical) describing task requirements that an implementation agent can follow. Use when asked to design a task's forms (without implementing code), defining form boundaries, fields, validation, submit behavior, async integration expectations, accessibility, and placement aligned to repository conventions.
---

# React Form Design

## Purpose
Help Codex complete form design work end-to-end by:
- producing one implementation-ready `## Form Design (for forms-implementor)` block
- defining form boundaries, typed field models, validation, and submit behavior for the scoped task
- relying on `../forms-common/SKILL.md` for shared form rules instead of repeating them here

## When to use this skill:
- The user wants a form design or form spec without code changes.
- The task needs explicit field models, validation behavior, async submit expectations, and placement guidance.
- Another frontend skill needs a form-specific design block an implementation agent can apply directly.

### Do NOT use this skill if:
- The user wants form code changes rather than a design artifact.
- The request is primarily a component, layout, routing, or Redux task with no form-specific behavior to define.
- The task only needs generic UX advice with no form contract.

## Inputs

- Task name.
- Task description.
- Known affected forms or nearby examples when available.

## Output Format

Return all sections in this order:
1. `Summary`
2. `Assumptions`
3. `## Form Design (for forms-implementor)`

The design block must include only:
- **Task Goal**
- **Form Inventory**
- **Form Specs (per form)**

Each form spec should cover visual structure, props/types, states, events/callbacks, and task-specific accessibility notes.

## Workflow

1. Read `../forms-common/SKILL.md` and apply its shared state, submission, and accessibility baseline.
2. Identify the minimum set of forms or sub-forms needed for the task.
3. For each form, define:
   - field grouping and actions layout
   - typed field and payload models
   - defaults, validation rules, and submit triggers
   - post-submit behavior and failure handling
4. Keep the design concrete enough that an implementor can wire the form without inventing submission or error behavior.
5. Assign ownership and placement for each form using repository-local patterns.
6. If the form surface includes multiple major regions or is likely to become difficult to scan in one route file, name the local component and hook breakdown in the design instead of leaving the implementor to improvise it.


## Guardrails

- Keep designs small, concrete, and directly tied to the requested feature.
- Do not bypass the established saga and fetch utility patterns in the design.
- State assumptions instead of inventing new form architecture when local conventions are unknown.

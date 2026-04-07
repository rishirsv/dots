---
name: component-designer
description: Produce a Component Design block (visual + technical) describing task requirements that an implementation agent can follow to build components. Use when asked to design a task's components (without implementing code), define component boundaries, props/types, states, accessibility, and file placement guidance aligned to existing repository conventions.
---

# React Component Design

## Purpose
Help Codex complete component design work end-to-end by:
- producing one implementation-ready `## Component Design (for component-implementor)` block
- defining the minimum viable component inventory, contracts, and placement for the task
- relying on `../component-common/SKILL.md` for shared component rules instead of repeating them here

## When to use this skill:
- The user wants a component design or spec without code changes.
- The task needs explicit component boundaries, props/types, UI states, and placement guidance.
- Another frontend skill needs a component-specific design block that an implementation agent can apply directly.

### Do NOT use this skill if:
- The user wants code changes rather than a design artifact.
- The task is primarily a form, layout, routing, or Redux design problem and those skills should lead.
- The request only needs generic UI advice with no component contract to define.

## Inputs

- Task name.
- Task description.
- Nearby component patterns when available.

## Output Format

Return all sections in this order:
1. `Summary`
2. `Assumptions`
3. `## Component Design (for component-implementor)`

The design block must include only:
- **Task Goal**
- **Component Inventory**
- **Component Specs (per component)**

Each component spec should cover visual structure, props/types, states, events/callbacks, and task-specific accessibility notes.

## Workflow

1. Read `../component-common/SKILL.md` and apply its shared boundary, placement, and accessibility baseline.
2. Identify the minimum viable set of components needed for the task.
3. For each component, define:
   - layout regions and hierarchy
   - interaction affordances
   - props, callbacks, and derived values
   - rendered states
4. Keep business behavior explicit enough that an implementor can map the design to code without inventing missing contract details.
5. Assign ownership and placement for each component using repository-local patterns.

## Guardrails

- Keep the design small, concrete, and directly tied to the requested UI.
- Do not introduce speculative shared abstractions.
- State assumptions when repository patterns are unknown instead of inventing new ones.
- Never render task-artifact language directly into product UI.
- Do not expose FRD IDs, task titles, implementation notes, acceptance-criteria wording, or instructional/rationale text to end users.
- User-facing copy must come from explicit product requirements, existing repo copy patterns, or minimal neutral labels. Do not include text describing requirements or task artifacts, nor text that explains app behavior unless it is explicitly needed (like in a tooltip or information/help page)
- If copy intent is unclear, use the smallest sensible product label and avoid explanatory paragraphs.
- Before finalizing UI text, ask: would this make sense to a user who has never seen the task artifact? If not, rewrite or remove it.

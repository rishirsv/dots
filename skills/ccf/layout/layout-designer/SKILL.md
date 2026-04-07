---
name: layout-designer
description: Produce a Layout Design block (visual + technical)  describing task requirements that an implementation agent can follow. Use when asked to design a task's layouts (without implementing code), defining layout boundaries, regions/slots, props/types, states, interactions, accessibility, and placement aligned to repository conventions.
---

# React Layout Design

## Purpose
Help Codex complete layout design work end-to-end by:
- producing one implementation-ready `## Layout Design (for layout-implementor)` block
- defining the minimum viable layout inventory, slot structure, and placement for the task
- relying on `../layout-common/SKILL.md` for shared layout rules instead of repeating them here

## When to use this skill:
- The user wants a layout design or layout spec without code changes.
- The task needs explicit region ownership, slot contracts, responsive structure, and placement guidance.
- Another frontend skill needs a layout-specific design block that an implementation agent can apply directly.

### Do NOT use this skill if:
- The user wants layout code changes rather than a design artifact.
- The task is primarily an ordinary component, form, route tree, or Redux design problem and another skill should lead.
- The request only needs generic visual direction with no structural contract.

## Inputs

- Task name.
- Task description.
- Nearby layout patterns when available.

## Output Format

Return all sections in this order:
1. `Summary`
2. `Assumptions`
3. `## Layout Design (for layout-implementor)`

The design block must include only:
- **Task Goal**
- **Layout Inventory**
- **Layout Specs (per layout)**

Each layout spec should cover visual structure, props/types, states, events/callbacks, and task-specific accessibility notes.

## Workflow

1. Read `../layout-common/SKILL.md` and apply its shared ownership, placement, and structural accessibility baseline.
2. Identify the minimum viable set of layouts needed for the task.
3. For each layout, define:
   - regions and containment rules
   - responsive behavior
   - slot or variant contracts
   - any structural controls the layout owns
4. Keep the design explicit enough that an implementor can compose the page or feature shell without inventing missing structure.
5. Assign ownership and placement for each layout using repository-local patterns.

## Guardrails

- Keep the design small, concrete, and directly tied to the requested layout work.
- Do not mix business logic, data loading, or Redux wiring into the layout design unless an existing pattern requires it.
- State assumptions rather than inventing a new layout architecture.

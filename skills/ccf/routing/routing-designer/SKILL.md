---
name: routing-designer
description: Produce a Routing Design block (technical + optional visual route map) describing task requirements that an implementation agent can follow. Use when asked to design how a feature’s pages should be reached, how routes should be structured/nested, and how guards/redirects/not-found/lazy-loading should behave—without implementing code.
---

# React Routing Design

## Purpose
Help Codex complete routing design work end-to-end by:
- producing one implementation-ready `## Routing Design (for routing-implementor)` block
- defining the minimum viable route inventory, guard behavior, redirects, and fallback handling for the task
- relying on `../routing-common/SKILL.md` for shared routing rules instead of repeating them here

## When to use this skill:
- The user wants a routing design or route spec without code changes.
- The task needs explicit paths, nested placement, guards, redirects, and not-found behavior.
- Another frontend skill needs a routing-specific design block an implementation agent can apply directly.

### Do NOT use this skill if:
- The user wants route code changes rather than a design artifact.
- The task is primarily a layout, component, or Redux problem with no route-tree change.
- The request only needs generic navigation ideas with no route ownership or guard decisions.

## Inputs

- Task name.
- Task description.
- Nearby route tree patterns when available.

## Output Format

Return all sections in this order:
1. `Summary`
2. `Assumptions`
3. `## Routing Design (for routing-implementor)`

The design block must include only:
- **Task Goal**
- **Route Inventory**
- **Route Specs (per route)**

Each route spec should cover route structure, params and navigation contracts, route-boundary states, guard notes, not-found notes, and lazy-loading notes when applicable.

## Workflow

1. Read `../routing-common/SKILL.md` and apply its shared route-tree, guard, and redirect baseline.
2. Map the current route segment and identify the smallest route changes needed for the task.
3. For each route, define:
   - exact path and nesting
   - entry points and canonical redirects
   - auth, terms, or role guard behavior
   - invalid-param, not-found, and fallback handling
4. Include only the route-level UX behavior that affects navigation or route boundaries.
5. Keep the design explicit enough that an implementor can update the route tree without inventing missing semantics.

## Guardrails

- Keep the design small, concrete, and directly tied to the requested navigation change.
- Do not change existing guard semantics through design unless the task explicitly requires it.
- State assumptions instead of inventing new route conventions.

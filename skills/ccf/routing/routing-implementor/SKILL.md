---
name: routing-implementor
description: Plan and implement route changes for React apps with guarded navigation. Use when asked to add/modify pages/routes, update protected route behavior, adjust redirects/not-found handling, or change lazy loading boundaries—without altering Redux state flows.
---

# React Routing Integration

## Purpose
Help Codex complete routing implementation work end-to-end by:
- translating a routing design or scoped route task into repository-aligned code changes
- keeping route placement, wrappers, redirects, and fallback handling consistent with the current router structure
- relying on `../routing-common/SKILL.md` for shared routing rules instead of duplicating them here

## When to use this skill:
- The user wants routes added or updated in code.
- The work includes protected route behavior, redirects, not-found handling, or lazy route boundaries.
- The task should change navigation behavior without taking ownership of Redux state flows.

### Do NOT use this skill if:
- The user only wants a routing design/spec with no code changes.
- The task is primarily a Redux state integration problem and another skill should lead.
- The work is outside this repository's routing code.

## Inputs

- A `## Routing Design (for routing-implementor)` block when available.
- Or a scoped task description plus access to the current route tree.

## Output Format

Return these sections:
1. `Summary`
2. `Assumptions`
3. `Route Tree Plan`
4. `Guard Plan`
5. `File Changes`
6. `Test Scenarios`

## Workflow

1. Read `../routing-common/SKILL.md` and apply its shared route-tree, guard, and redirect rules.
2. Map the current router structure, parent layouts, and wrappers before editing code.
3. Add or update the route paths, nested placement, redirects, and not-found handling required by the task.
4. Apply guards at the correct level, preserving existing semantics and avoiding duplicate wrappers.
5. Implement route-boundary fallback behavior such as lazy loading and invalid-param handling where the scoped task requires it.
6. Define verification scenarios for direct navigation, in-app navigation, guards, redirects, and not-found behavior.

## Guardrails

- Do not bypass existing guard components or change their semantics unless the task explicitly requires it.
- Avoid duplicate wrappers when parent routes already enforce the same guard.
- Do not introduce Redux/store changes in this skill.
- Keep route changes directly tied to the scoped navigation task.

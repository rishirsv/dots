---
name: routing-common
description: Shared React routing guidance for this repository. Use alongside routing design or routing implementation tasks when Codex needs the common rules for router entry points, route ownership, guard semantics, redirect behavior, and route-level fallback expectations without duplicating them in role-specific skills.
---

# Routing Common

## Purpose

Help Codex keep routing design and implementation work consistent by:

- centralizing shared router, guard, redirect, and not-found rules
- defining the baseline expectations for route placement, route ownership, and lazy boundaries
- removing duplicated routing setup from the designer and implementor skills

## When to use this skill:

- The task is about designing or implementing route changes in this repository.
- A routing designer or implementor skill needs shared guidance for guard placement, redirects, or route boundaries.
- Codex must map the current route tree before deciding how to add or modify navigation behavior.

### Do NOT use this skill if:

- The task is primarily about Redux state, component UI, or layout structure with no route change.
- The request is outside this repository's React routing code.
- The work only needs generic navigation copy with no route ownership or guard decisions.

## Inputs

- The target app and route segment in scope.
- The task description or routing design block.
- The current route tree, guards, redirects, and fallback patterns when available.

## Output Format

This skill does not define a standalone deliverable. It supplies shared routing guidance that the designer and implementor skills should apply.

## Workflow

### 1. Inspect repository context

1. Read `../ccf-general/ccf-general-common/SKILL.md` for repo-wide routing and auth constraints.
2. Identify the target app and router entry file.
3. Map the current route segment, parent layouts, nested routes, and existing wrappers.
4. Confirm existing semantics for:
   - `RequireAuth`
   - `RequireTerms`
   - index redirects
   - `state.from`
   - segment and global not-found handling

### 2. Decide route ownership and boundary behavior

1. Place new routes at the nearest correct segment rather than duplicating existing parent wrappers.
2. Keep route-only work separate from Redux ownership changes unless another skill is explicitly in scope.
3. Define route params, redirects, and denial behavior using existing app conventions.
4. Use lazy boundaries only when the surrounding codebase already supports them or the bundle boundary is meaningful.

### 3. Apply shared routing baseline

1. Keep guard semantics consistent with the existing route tree.
2. Avoid duplicate wrappers when a parent route already enforces the same guard.
3. Define not-found and invalid-param behavior explicitly.
4. Cover direct navigation, in-app navigation, guarded transitions, and fallback behavior in verification.

## Guardrails

- Do not invent new guard semantics when existing wrappers already define them.
- Do not move route segments unless explicitly requested.
- Do not mix routing work with Redux ownership changes inside the routing role-specific skills.
- Keep route guidance concrete and tied to the scoped navigation change.

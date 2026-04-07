---
name: state-common
description: Shared Redux state guidance for this repository. Use alongside state design or state implementation tasks when Codex needs the common rules for app detection, store ownership boundaries, selector expectations, Redux-saga patterns, async error handling, and route-to-state separation without duplicating them in role-specific skills.
---

# State Common

## Purpose
Help Codex keep Redux state design and implementation work consistent by:
- centralizing shared rules for store ownership, selector behavior, and saga patterns
- defining the baseline expectations for async flow wiring, serializable payloads, and recovery behavior
- removing duplicated state setup from the designer and implementor skills

## When to use this skill:
- The task is about designing or implementing Redux state in this repository.
- A state designer or implementor skill needs shared guidance for slices, selectors, sagas, or async ownership.
- Codex must decide what belongs in local UI state versus global store state before proceeding.

### Do NOT use this skill if:
- The task is primarily about routing, layout, or component structure with no Redux ownership change.
- The work is a pure API or DB task with no store integration.
- The request is outside this repository's React state code.

## Inputs

- The target app and state surface in scope.
- The task description or state design block.
- Nearby slices, selectors, sagas, and fetch utilities when available.

## Output Format

This skill does not define a standalone deliverable. It supplies shared state guidance that the designer and implementor skills should apply.

## Workflow

### 1. Inspect repository context

1. Read `../ccf-general/ccf-general-common/SKILL.md` for repo-wide frontend and saga constraints.
2. Identify the target app and current store entry points:
   - `src/store/index.ts`
   - `src/store/rootReducer.ts`
   - `src/store/rootSaga.ts`
3. Inspect nearby slices, selectors, sagas, and middleware conventions before proposing changes.

### 2. Decide state ownership

1. Keep short-lived UI state local when it does not need cross-surface coordination.
2. Do not interpret local UI state ownership as permission to call APIs from components, hooks, or route effects.
3. Use Redux state for:
   - shared async status or errors
   - cached server entities or lists
   - cross-surface coordination
   - view state that multiple consumers depend on
4. Prefer extending an existing slice, selector set, or saga flow over creating a parallel pattern.

### 3. Apply shared state baseline

1. Keep action payloads serializable unless a documented exception already exists.
2. Define explicit request, success, failure, and reset behavior where relevant.
3. Keep derived data in selectors rather than reducers.
4. Use plain selectors for direct state reads or pass-through access.
5. Use `createSelector` only when the result function performs real derivation such as filtering, aggregation, flattening, fallback shaping, or view-model projection.
6. If a selector result function returns one of its inputs unchanged, replace it with a plain selector instead of `createSelector`.
7. Input selectors and plain selectors must be referentially stable. They must not allocate new arrays, objects, Sets, Maps, or functions. Input selectors must be allocation-free and stable.
8. Do not use fallback expressions that create fresh references inside plain selectors or input selectors, such as `?? []`, `?? {}`, `map(...)`, `filter(...)`, `Object.values(...)`, `new Set(...)`, or inline object literals.
9. When a selector needs an empty fallback collection or object, export and reuse a module-level constant such as `EMPTY_ARRAY`, `EMPTY_OBJECT`, or a domain-specific empty constant.
10. If a selector depends on component-provided parameters and returns a non-primitive result, use a selector factory or another memoization boundary. Do not route that derivation through an anonymous `useAppSelector((state) => ...)` callback.
11. Treat selector stability as a correctness requirement, not just a performance optimization. A selector called twice with unchanged inputs must return the same reference when its semantic result has not changed.
12. Before finishing state work, scan selectors for unstable fallback references and anonymous derived selector lambdas in components.
13. Reuse existing fetch utilities and saga worker patterns for async work.
14. Define retry, cancellation, stale-data, and recovery behavior when the flow needs it.


## Guardrails

- Do not add new global state when local state is sufficient.
- Do not mix route ownership changes into the state skills unless explicitly coordinated.
- Do not create parallel slices, selectors, or sagas when an existing pattern can be extended safely.
- Do not justify direct component API calls by calling the flow "route-local", "page-local", or "simple"; locality affects draft state placement, not API ownership.
- Keep state guidance concrete and scoped to the requested flow.
- Do not return fresh arrays or objects from plain selectors or input selectors.
- Do not build fallback collections inline inside selectors.
- Do not put `map`, `filter`, `reduce`, `Object.values`, `new Set`, or object-literal shaping in input selectors.
- Do not use anonymous `useAppSelector` callbacks for parameterized non-primitive derivation.

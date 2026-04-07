---
name: state-implementor
description: Connect UI to Redux and implement async flows. Use when asked to wire components to store state, add/modify actions/reducers/selectors/sagas, define route-to-data loading triggers, or adjust Redux async behavior—without changing routing structure.
---

# React Redux State Integration

## Purpose
Help Codex complete Redux implementation work end-to-end by:
- translating a state design or scoped async-flow task into repository-aligned store code
- keeping slices, selectors, sagas, and UI wiring consistent with the current store structure
- relying on `../state-common/SKILL.md` for shared state rules instead of duplicating them here

## When to use this skill:
- The user wants Redux state wired or updated in code.
- The work includes actions, reducers, selectors, sagas, or UI connections to store state.
- The task should change async or state behavior without changing the routing structure.

### Do NOT use this skill if:
- The user only wants a state design/spec with no code changes.
- The task is primarily a routing problem and another skill should lead.
- The work is outside this repository's Redux code.

## Inputs

- A `## State Design (for state-implementor)` block when available.
- Or a scoped task description plus access to the current store structure.

## Output Format

Return these sections:
1. `Summary`
2. `Assumptions`
3. `State Integration Plan`
4. `Async Flow Plan`
5. `UI Wiring Plan`
6. `File Changes`
7. `Test Scenarios`

## Workflow

1. Read `../state-common/SKILL.md` and apply its shared ownership, selector, and saga rules.
2. Map the current store structure, slice registration, saga registration, and selector conventions before editing code.
3. Update or add the smallest correct slice boundary, reducer transitions, action payloads, and selectors for the task.
4. Audit every selector you touch for referential stability:
  - plain selectors and input selectors must not allocate. input selectors must be allocation-free and stable.
  - fallback collections must come from shared constants
  - non-primitive derivation must live in memoized result functions or selector factories
5. Implement or extend the async flow, including watcher strategy, worker behavior, cancellation, and error handling.
6. Connect the relevant UI entry points to the updated selectors and actions.
7. Define verification for reducer behavior, selector outputs, saga success/failure, and UI render states.

## Guardrails

- Extend existing slices, selectors, and sagas instead of creating parallel patterns.
- Do not use `createSelector` for pass-through selectors. If the result returns an input unchanged, export a plain selector instead.
- Do not let plain selectors or input selectors allocate fallback arrays, objects, Sets, Maps, or derived view models.
- Do not use `?? []`, `?? {}`, `.map(...)`, `.filter(...)`, `Object.values(...)`, or inline object literals inside plain selectors or selector inputs.
- When a selector depends on runtime component input and returns a non-primitive, implement a selector factory or move the derivation to local component code based on primitive selector outputs.
- Verify selector stability before closing the task: repeated calls with unchanged state must preserve references for non-primitive outputs.
- Keep action payloads serializable unless a documented local exception exists.
- Do not change routing structure in this skill.
- Keep changes directly tied to the scoped state flow.

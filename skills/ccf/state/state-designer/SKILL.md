---
name: state-designer
description: Produce a State Design block (technical + optional flow diagrams) describing task requirements that an implementation agent can follow. Use when asked to design how a task's state should be organized, how it changes over time, and how async flows (Redux + sagas) should work—without implementing code.
---

# React State Design

## Purpose
Help Codex complete state design work end-to-end by:
- producing one implementation-ready `## State Design (for state-implementor)` block
- defining slice boundaries, selector behavior, and saga flows for the scoped task
- relying on `../state-common/SKILL.md` for shared state rules instead of repeating them here

## When to use this skill:
- The user wants a Redux state design or state spec without code changes.
- The task needs explicit slice ownership, reducer transitions, selectors, and async flow behavior.
- Another frontend skill needs a state-specific design block an implementation agent can apply directly.

### Do NOT use this skill if:
- The user wants Redux code changes rather than a design artifact.
- The task is primarily a routing, layout, or form contract problem and another skill should lead.
- The request only needs generic state advice with no concrete store contract.

## Inputs

- Task name.
- Task description.
- Nearby store patterns when available.

## Output Format

Return all sections in this order:
1. `Summary`
2. `Assumptions`
3. `## State Design (for state-implementor)`

The design block must include only:
- **Task Goal**
- **State Inventory**
- **State Specs (per slice/module)**

Each state spec should cover state and action types, reducer states, selector behavior, and side-effect notes. Selector behavior must explicitly call out referential-stability expectations for any selector returning arrays, objects, or other non-primitives.

## Workflow

1. Read `../state-common/SKILL.md` and apply its shared ownership, selector, and saga baseline.
2. Identify the minimum slice or module changes needed for the task.
3. For each slice or module, define:
   - state shape and ownership
   - request, success, failure, and reset transitions
   - selectors consumed by the UI
   - async watcher and worker behavior
4. For every selector that returns a non-primitive, specify whether it is:
   - a plain stable selector returning an existing state reference or a shared empty constant
   - a memoized selector whose result function performs the derivation
   - a selector factory required for parameterized derivation
5. Define failure handling, cancellation, stale-data behavior, and retry paths where the task needs them.
6. Keep the design explicit enough that an implementor can wire the store without inventing missing transitions or side effects.

## Guardrails

- Keep the design small, concrete, and directly tied to the requested feature state flows.
- Do not add global state when local state is sufficient.
- State assumptions instead of inventing new store patterns.
- Do not describe selector fallbacks using fresh references like `[]` or `{}`; require shared constants instead.
- Do not leave parameterized selector behavior implicit. If the UI passes a draft name, id, filter, or other runtime argument, state whether the implementation must use a selector factory, local calculation from primitives, or both.
- Do not specify derived object or array selectors without an explicit memoization or stable-reference plan.

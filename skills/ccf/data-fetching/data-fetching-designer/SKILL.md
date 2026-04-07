---
name: data-fetching-designer
description: Produce a Data Fetching Design block describing the async flow, state shape, selectors, and component integration contract that an implementation agent can follow. Use when asked to design a task's server-state layer (without implementing code), define saga flow structure, action contracts, pagination strategy, and error handling aligned to existing repository conventions.
---

# Data Fetching Design

## Purpose

Help Codex complete data-fetching design work end-to-end by:

- producing one implementation-ready `## Data Fetching Design (for data-fetching-implementor)` block
- defining the minimum viable saga flow, state shape, selectors, and component integration for the task
- relying on `../data-fetching-common/SKILL.md` for shared async conventions instead of repeating them here

## When to use this skill:

- The user wants a data-fetching design or spec without code changes.
- The task needs explicit saga flow structure, action contracts, state shape, and selector definitions.
- Another frontend skill needs a data-fetching design block that an implementation agent can apply directly.

### Do NOT use this skill if:

- The user wants code changes rather than a design artifact.
- The task is purely about displaying already-fetched data — use `data-display-designer`.
- The task is primarily a component, form, or layout design problem and those skills should lead.
- The request only needs generic async advice with no saga contract to define.

## Inputs

- Task name.
- Task description including the API endpoint(s) and expected response shape.
- Whether an existing saga flow already covers this endpoint.
- API endpoint(s), method(s), and expected response shape if known.
- Whether the task is a read, mutation, paginated read, polling flow, or optimistic update.
- Whether an existing saga/slice already covers the endpoint or use-case.
- Any known UX constraints that affect fetch behavior (initial load, manual refresh, background refresh, duplicate-submit prevention, etc.)

## Output Format

Return all sections in this order:

1. `Summary`
2. `Assumptions`
3. `## Data Fetching Design (for data-fetching-implementor)`

The design block must include only:

- **Task Goal**
- **Existing Flow Assessment** — extend or create new
- **Action Contracts**
- **State Shape**
- **Selector Definitions**
- **Saga Flow Outline**
- **Component Integration Contract**
- **Edge Cases**

## Workflow

1. Read `../data-fetching-common/SKILL.md` and apply its shared flow conventions, state shape, and error handling rules.
2. Assess whether an existing saga flow can be extended — state this explicitly.
3. For each new or extended flow, define:
   - action payload types and lifecycle actions
   - state shape additions to the relevant slice
   - selectors the UI will consume
   - watcher concurrency policy and rationale
   - worker outline (call, success, failure, retry)
4. Define the component integration contract: what the component dispatches and what it selects.
5. List edge cases the implementor must handle: empty, error, stale, pagination boundaries, optimistic revert.

## Guardrails

- Keep the design scoped to the fetch layer — do not design component rendering or layout here.
- Do not introduce new fetch utilities or HTTP wrappers — reference existing ones.
- State assumptions when endpoint shape or error contract is unknown instead of inventing them.
- Do not design a new saga flow if extending an existing one is viable.

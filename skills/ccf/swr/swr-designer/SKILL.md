---
name: swr-designer
description: Design SWR-based cache or view behavior for React TypeScript UI in this repository when Redux-saga remains the required owner of API execution. Use when asked to define SWR placement, key design, invalidation, and saga interaction without allowing direct SWR-owned backend calls.
---

# SWR Designer

## Purpose

Help Codex produce an implementation-ready SWR design by:

- defining the minimum correct SWR-based server-state plan for the scoped task
- deciding query ownership, hook placement, key shape, cache behavior, mutation handling, and redux or redux-saga interaction before code changes are made
- relying on `../swr-common/SKILL.md` for the shared SWR baseline instead of duplicating it here

## When to use this skill:

- The user wants a design, plan, or spec for SWR-based frontend data fetching without code changes.
- The task involves React TypeScript server-state ownership, cache design, invalidation/revalidation, mutation behavior, or boundaries with redux or redux-saga.
- The repository uses `fetch`, redux, or redux-saga and the design must make ownership and workflow boundaries explicit.

### Do NOT use this skill if:

- The user wants code implemented directly.
- The task is purely presentational UI with no async data concerns.
- The task is primarily backend or API implementation rather than frontend consumption.
- The repository already mandates another server-state solution for the same scope and the task is not about SWR.

## Inputs

- A task description, product requirement, or implementation request to be translated into an SWR design.
- The target app, feature, route, page, or component surface in scope.
- Nearby repository patterns for custom hooks, API clients, `fetch` wrappers, redux slices, sagas, selectors, and async tests when available.
- Any known endpoint details, request parameters, auth requirements, error cases, or post-write refresh expectations.

## Workflow

1. Read `../swr-common/SKILL.md` and apply its shared SWR checklist before designing anything.
2. Read files in `ui-references/` as needed for placement and repository conventions.
3. Identify the exact remote resources in scope:
   - list query
   - detail query
   - dependent query
   - mutation
   - refresh or revalidation trigger
4. Build an ownership plan for each scoped resource:
   - redux-saga for all backend API reads, writes, retries, refreshes, and dependent requests
   - SWR for cache/view concerns, revalidation signaling, and component-facing server-state consumption only after saga-owned execution
   - redux for durable client/app state that should not just mirror the response
5. Check for dual-ownership risks and call them out explicitly:
   - same response duplicated in SWR and redux
   - saga fetching the same resource the component plans to fetch with SWR
   - separate loading or error states for the same remote query
   - missing cache updates after create, update, or delete actions
6. Decide the smallest correct placement:
   - colocated feature or page hook first
   - shared hook only when the repository already centralizes that resource or multiple consumers clearly benefit
7. Design the SWR key strategy:
   - stable key shape
   - all query-shaping inputs included
   - conditional or dependent keys when needed
   - no accidental object identity churn
8. Design fetcher usage:
   - do not design new SWR fetchers that call backend APIs directly
   - route API execution through saga workers using the repository's existing API client or fetch wrapper
   - preserve local auth, headers, parsing, and error normalization through the saga-owned path
9. Design cache behavior explicitly:
   - what the source-of-truth SWR key is for each read
   - which related keys are affected by create, update, delete, retry, refresh, or saga completion
   - whether each affected key should be directly mutated, revalidated, or left alone
10. Design mutation handling:

- whether the write should be component-owned or saga-owned
- whether optimistic update is appropriate
- what rollback behavior is required if optimistic update is used
- how list and detail keys stay consistent after writes

11. Design UI integration boundaries:

- what the consuming component or hook reads from SWR
- what remains local component state
- what remains redux-owned application state

12. Add focused implementation notes so `swr-implementor` can execute without re-deciding the architecture.

## Output Format

Return all sections in this order:

1. `Summary`
2. `Assumptions and Unknowns`
3. `Ownership Risks`
4. `## SWR Design (for swr-implementor)`

The `## SWR Design (for swr-implementor)` block must contain only these sections and in this order:

- **Task Goal**
- **Scope**
- **Repository Pattern Notes**
- **Data Ownership Plan**
- **Hook Placement**
- **SWR Key Design**
- **Fetcher and Error Handling Plan**
- **Read Flow**
- **Mutation and Cache Update Plan** (only if applicable)
- **Redux / Saga Interaction**
- **UI Integration Contract**
- **Affected Files or File Types**
- **Edge Cases**
- **Implementation Notes**

## Output Requirements

Within the design block:

1. **Task Goal**
   - State the user-visible behavior the implementation must enable.

2. **Scope**
   - Identify exactly which remote resources, components, pages, or hooks are in scope.
   - Exclude unrelated surfaces.

3. **Repository Pattern Notes**
   - Summarize the local conventions that should be matched for:
     - hook placement
     - API client or `fetch` wrapper usage
     - typing
     - exports
     - test style
     - redux or saga boundaries

4. **Data Ownership Plan**
   - For each scoped remote resource, say how saga owns API execution and what SWR still owns, if anything.
   - Explicitly state that SWR must not call backend APIs directly.
   - Explicitly state what must not be duplicated across SWR, redux, and saga.

5. **Hook Placement**
   - Specify the intended hook or component location.
   - State whether to reuse an existing hook, extend one, or create a new colocated hook.

6. **SWR Key Design**
   - Specify the exact key inputs.
   - Explain conditional or dependent behavior if needed.
   - Identify related keys that may need cache updates after writes.

7. **Fetcher and Error Handling Plan**
   - State which API client or `fetch` wrapper pattern to use.
   - Define how auth, headers, response parsing, and error normalization should be handled according to repository norms.

8. **Read Flow**
   - Describe how the query should load, refresh, and render:
     - initial fetch behavior
     - dependency gating
     - background revalidation if relevant
     - loading, empty, success, and error states at a high level

9. **Mutation and Cache Update Plan**
   - Include only when the task involves remote writes.
   - State:
     - who owns the mutation trigger
     - whether optimistic updates should be used
     - rollback expectations
     - which keys should be mutated or revalidated after success or failure

10. **Redux / Saga Interaction**

- State what redux continues to own.
- State that saga owns backend request execution and why.
- State what SWR observes, caches, or revalidates after the saga-owned flow completes.
- If saga changes server state, define which SWR keys must be revalidated or mutated afterward.

11. **UI Integration Contract**

- State what the consuming component or page reads from SWR.
- State what remains local UI state.
- State what props, selectors, or workflow actions remain outside the SWR hook.

12. **Affected Files or File Types**

- List the likely files or file categories to touch without writing code.
- Examples: feature hook, page component, API helper, saga completion path, focused tests.

13. **Edge Cases**

- Call out missing params, gated queries, stale detail/list relationships, duplicate refresh triggers, auth expiry, or empty-state transitions as relevant.

14. **Implementation Notes**

- Give concise, execution-ready guidance for `swr-implementor`.
- Keep it minimal and specific to this task.

## Guardrails

1. Do not write implementation code.
2. Do not repeat the shared baseline from `../swr-common/SKILL.md`; apply it through the design.
3. Keep the design concrete, minimal, and repository-aligned
4. Do not add global state when local state is sufficient.
5. Prefer redux for durable client/app state, not mirrored API payloads.
6. Require redux-saga ownership for all backend API execution.
7. Do not leave cache update behavior implicit after create, update, delete, retry, refresh, or workflow completion.
8. Do not recommend direct SWR-owned backend fetching or duplicate ownership of the same remote response across SWR and saga.
9. Do not introduce new abstractions or dependencies unless the task clearly requires them.
10. State assumptions instead of inventing new store patterns.

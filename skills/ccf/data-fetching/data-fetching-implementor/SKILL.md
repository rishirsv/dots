---
name: data-fetching-implementor
description: Implement Redux-saga async flows, slice state, selectors, and component integration for server-state tasks aligned to existing repository conventions. Use when asked to create or update saga workers, actions, reducers, or selectors for API-connected features in an identified app.
---

# Data Fetching Implementation

## Purpose

Help Codex complete data-fetching implementation work end-to-end by:

- translating a data-fetching design or scoped async task into repository-aligned saga, slice, and selector code
- keeping action contracts, state shape, fetch utility usage, and error handling consistent with local patterns
- relying on `../data-fetching-common/SKILL.md` for shared conventions instead of duplicating them here

## When to use this skill:

- The user wants saga flows, reducers, actions, or selectors created or updated in code.
- The task includes wiring an API endpoint into the Redux store for component consumption.
- The work needs slice additions, typed actions, selector exports, and saga registration in addition to worker code.

### Do NOT use this skill if:

- The user only wants a data-fetching design/spec with no code changes.
- The task is purely local UI state — no server data involved.
- The work is not in this repository's Redux/saga layer.

## Inputs

- A `## Data Fetching Design (for data-fetching-implementor)` block when available.
- Or a scoped task description plus access to nearby saga, slice, selector, and page patterns
- Endpoint details and expected response shape if known

## Output Format

When implementing, return:

1. File tree of added or changed files
2. Full content for each new file
3. Diffs or full content for modified files
4. Notes on conventions matched for action naming, watcher policy, fetch utility usage, and error normalization

## Workflow

1. Read `../data-fetching-common/SKILL.md` and apply its shared flow, state shape, and error handling rules.
2. Assess existing saga coverage — extend before creating new flows.
3. Implement in this order:
   - Actions: typed lifecycle actions (`Requested`, `Started`, `Succeeded`, `Failed`)
   - Slice: state shape additions, reducer cases for all lifecycle actions
   - Selectors: base domain selector first, then derived selectors for `isLoading`, `error`, `data`, and any pagination fields; keep plain selectors referentially stable, use shared empty constants for non-primitive fallbacks, and keep all non-trivial non-primitive derivation inside memoized result functions or selector factories
   - Saga worker: call via existing fetch utility, dispatch lifecycle actions, normalize errors
   - Saga watcher: correct concurrency policy (`takeLatest` / `takeEvery` / `takeLeading`)
   - Root saga registration: wire watcher into `rootSaga.ts`
4. Wire the component integration: confirm dispatch and selector usage in the consuming component or provide the integration snippet.
5. Verify error clearing: confirm `fetchStarted` clears the previous error in the reducer.

## Guardrails

- Never introduce raw `fetch()` or a new HTTP wrapper — always use the existing fetch utility.
- Never skip `fetchFailed` — all error paths must reach the reducer.
- Never store server state in component `useState`.
- Never re-fetch inside a selector or render function.
- Do not register a new saga watcher without adding it to `rootSaga.ts`.
- Never return fresh arrays or objects from plain selectors or selector inputs.
- Never use `?? []` or `?? {}` inside selectors; prefer shared empty constants.
- Never use anonymous `useAppSelector` callbacks for non-primitive derived results when a named selector or selector factory should own that derivation.

---
name: data-fetching-common
description: Shared server-state guidance for this repository. Use alongside data-fetching design or implementation tasks when Codex needs the common rules for existing saga coverage checks, server vs local state separation, action and selector conventions, saga flow structure, Redux colocation, pagination, optimistic updates, polling, and error handling without duplicating them in role-specific skills.
---

# Data Fetching Common

## Purpose

Help Codex keep server-state work consistent by:

- separating remote/server state concerns from local UI state
- centralizing action conventions, selector conventions, saga flow structure, and Redux colocation rules
- defining patterns for pagination, optimistic updates, polling, and cache invalidation
- removing duplicated setup from the data-fetching designer and implementor skills

## When to use this skill:

- The task involves fetching, submitting, or mutating data from an API.
- A designer or implementor skill needs shared async flow, state shape, selector, or error handling guidance.
- Codex must decide whether an existing saga flow can be extended or a new one is required.

### Do NOT use this skill if:

- The state in question is purely local UI state (open/closed, draft input, local toggle).
- The task has no API interaction and no server-state behavior.
- The task is about route guards or auth token handling — use the routing skill.
- The task is about displaying already-fetched data with no fetch logic — use `data-display-common`.

## Inputs

- The target app and the API endpoint(s) involved.
- Whether an existing saga flow already covers this endpoint.
- Expected response shape and error contract.

## Output Format

This skill does not define a standalone deliverable. It supplies shared data-fetching guidance that the designer and implementor skills should apply.

## Workflow

### 1. Inspect repository context

1. Read `../ccf-general/ccf-general-common/SKILL.md` for repo-wide frontend constraints.
2. Identify the target app and the async surface in scope:
   - read / fetch (loading data into the store)
   - submit / mutation (creating, updating, or deleting)
   - paginated fetch
   - polling or real-time refresh
3. Inspect nearby sagas, slices, and selectors to match naming, action structure, fetch utility usage, and error normalization conventions.
4. Use `../../ui-references/placement-matrix.md`, `../../ui-references/redux-colocation-and-boundaries.md`, and `../../ui-references/routing-and-state-patterns.md` alongside nearby local patterns before proposing file placement or flow structure.

### 2. Decide saga ownership and coverage

1. Search `application/web/<appName>/src/pages/` and `application/web/<appName>/src/store/slices/` for a saga already covering the endpoint or use-case.
2. If one exists, prefer extending it over creating a parallel flow.
3. Only create a new saga flow when the endpoint or submission behavior is genuinely new and cannot be safely extended without breaking other consumers.
4. Decide colocation: page-level async flows live under `application/web/<appName>/src/pages/<PageName>/`; shared state lives under `application/web/<appName>/src/store/slices/`.

### 3. Apply shared data-fetching baseline

1. Separate server state from local UI state — API response data, loading flags, and errors live in the Redux slice; input drafts, open/closed toggles, and local UI concerns stay in component `useState`.
2. All API calls must be triggered through Redux-saga, even when the screen also keeps local UI state.
3. Use `createAction<TPayload>()` with explicit payload types and stable domain-scoped action type strings. For async flows use the full lifecycle set: `fetchRequested` (component trigger), `fetchStarted` (saga before call), `fetchSucceeded` (saga on success), `fetchFailed` (saga on failure). Keep payloads serializable by default.
4. State shape for every async flow: `isLoading: boolean`, `error: SerializedError | null`, `data: T | null`, `lastFetchedAt: string | null`. The `fetchStarted` reducer case must clear `error`.
5. Export a base domain selector first, then derived selectors for `isLoading`, `error`, and `data` with null-safe defaults. Use selector factories for keyed domains. Place all non-trivial derivation — filtering, aggregation, flattening, view-model projections — in memoized selectors, not in components. Do not wrap pass-through reads in `createSelector`; use a plain selector when no derivation occurs. Plain selectors and selector inputs must be referentially stable and must not allocate fallback arrays, objects, Sets, Maps, or shaped view models. Use shared empty constants for non-primitive fallbacks instead of `?? []` or `?? {}`.
6. Choose watcher concurrency deliberately: `takeLatest` for reads where only the most recent matters; `takeEvery` for independent per-item mutations; `takeLeading` for submits that must not be duplicated.
7. Call the API through the existing fetch utility in `application/web/<appName>/src/utils/` only. Do not introduce raw `fetch()` calls or new HTTP wrappers.
8. Normalize errors in the saga worker before dispatch using error types from `application/web/<appName>/src/utils/errors.ts`. Prefer existing error types before creating new ones. Error messages rendered in the UI come from i18n keys, not raw API strings.
9. Components dispatch intent actions via `useAppDispatch` and read state via `useAppSelector` with typed selectors. Components must not call APIs directly, compute domain derivations inline, or replicate saga control flow in effects.
10. For paginated flows: store `page`, `pageSize`, `totalCount` (offset-based) or `nextCursor`/`prevCursor` (cursor-based) in the slice; selectors derive `hasNextPage`, `hasPrevPage`; changing page or filters resets to page 1.
11. For optimistic updates: apply the change to the slice on `mutationRequested`, store the pre-mutation snapshot, and revert on `mutationFailed`. Use only for low-risk mutations with clearly defined rollback UX.
12. For polling: use a saga loop with `delay()` — never `setInterval`. Honor saga cancellation when the user navigates away.

## Guardrails

- Do not create a new saga flow when an existing one can be safely extended.
- Do not introduce raw `fetch()` or a new HTTP wrapper — always use the existing fetch utility.
- Do not store API response data in component `useState` for Redux-managed domains.
- Do not skip the `fetchFailed` action — all error paths must reach the reducer.
- Do not put complex domain derivation inline in components — it belongs in selectors.
- Do not re-fetch inside a selector or render function.
- Do not return fresh fallback arrays or objects from selectors.
- Do not put `map`, `filter`, `reduce`, `Object.values`, `new Set`, or object-literal shaping in plain selectors or selector inputs.
- Do not use anonymous `useAppSelector` callbacks for keyed or parameterized non-primitive derivation; use selector factories or local derivation from primitive selector outputs.

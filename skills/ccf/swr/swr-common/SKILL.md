---
name: swr-common
description: Shared SWR guidance for React TypeScript frontend work in this repository when SWR coexists with Redux and Redux-saga. Use when Codex must keep SWR surfaces aligned with the rule that saga owns API execution, while SWR only handles cache/view concerns and explicit revalidation boundaries.
---

# SWR Common

## Purpose

Help Codex keep SWR-based frontend work consistent by:

- defining the shared SWR review baseline
- identifying the repository context that must be checked before making a plan or code change
- centralizing reusable rules for SWR, fetch, caching, invalidation/revalidation, and redux-saga interaction so implementor guidance does not duplicate them

## When to use this skill:

- The task is about React TypeScript data fetching with SWR-adjacent UI or cache behavior.
- The repository uses `fetch`, redux, and redux-saga and the task needs clear ownership boundaries.
- An SWR implementation skill is being used and needs the shared checklist for keys, cache usage, revalidation, and mandatory saga ownership of API execution.

### Do NOT use this skill if:

- The task is not about frontend data fetching or server-state behavior.
- The work is purely presentational UI with no async data concerns.
- The repository already uses another dedicated server-state/cache solution for the same scope and the task is not migrating toward SWR.

## Inputs

- The target app, feature, or surface in scope.
- Either a task description, implementation request, or list of known data-fetching issues.
- Nearby repository patterns for hooks, API clients, fetch wrappers, redux slices, sagas, selectors, and async tests when available.

## Output Format

This skill does not define a standalone deliverable. It supplies the shared checklist and guardrails that the SWR implementor skill should apply.

## Workflow

### 1. Inspect repository context

1. Identify the owning app and target surface.
2. Check nearby conventions for:
   - custom hooks and colocated data hooks
   - API client or `fetch` wrapper usage
   - auth, headers, error normalization, and JSON parsing
   - redux slice ownership for UI state, filters, session state, and workflow state
   - saga ownership for submit flows, polling, invalidation triggers, or chained side effects
3. Prefer established local patterns over introducing new abstractions.

### 2. Build the data ownership inventory

1. List each remote resource in scope:
   - detail query, list query, dependent query, mutation, refresh trigger
2. For each resource, decide the owner:
   - redux-saga for all backend API execution, including reads, writes, retries, dependent requests, and refresh triggers
   - SWR for local cache consumption, revalidation coordination, and view-facing server-state presentation only when the request has already been routed through the repository's saga-owned flow
   - redux for durable client/app state such as selection, wizard step, modal state, feature flags, and derived UI preferences
3. Flag dual-ownership risks:
   - the same API response stored in both SWR cache and redux state
   - saga fetching data that a component also fetches with SWR
   - duplicated loading and error state across SWR and redux
   - manual invalidation that conflicts with SWR revalidation
   - cache updates that do not cover all affected keys after create, update, or delete flows

### 3. Apply the shared SWR checklist

1. Query ownership:
   - do not let SWR fetch backend data directly
   - require saga to own request triggering and API execution
   - use SWR only where the task explicitly needs cache/view behavior layered on top of saga-owned remote data
2. Fetcher shape:
   - do not create fetchers that call backend APIs directly from SWR
   - if a fetcher exists, it must delegate to a saga-owned boundary rather than issue HTTP on its own
   - preserve local auth, headers, parsing, and error normalization through the existing saga and fetch utility path
3. Key design:
   - use stable keys
   - include all query-shaping inputs in the key
   - use conditional keys for dependent or gated requests
   - avoid object identity churn in keys unless the repository already standardizes it safely
4. Cache design:
   - treat SWR cache as the source of truth for SWR-owned server reads
   - do not mirror the same response payload into redux
   - identify all keys affected by a mutation, submit flow, or delete flow
5. Loading and error handling:
   - render from SWR state directly at the owning component or hook boundary
   - avoid duplicating `isLoading`, `error`, or response payload in redux for the same query
6. Revalidation and invalidation:
   - define what should happen after create, update, delete, retry, refresh, and background workflow completion
   - revalidate or mutate the affected SWR keys after remote writes when the cache may be stale
   - avoid broad or ambiguous invalidation when a narrower key update is sufficient
7. Mutation:
   - prefer `mutate` or mutation-oriented repository patterns for remote writes that should update or revalidate SWR cache
   - use optimistic updates only when rollback behavior is clear
   - ensure mutation handling covers both the local view and any related list/detail keys
8. Saga interaction:
   - redux-saga is the required owner for backend API execution
   - SWR must not issue backend HTTP requests directly
   - saga may trigger the remote call, normalize the result, and then drive the refresh or invalidation behavior that SWR observes
   - when a workflow spans multiple steps or slices, keep retries, cancellation, redirects, toasts, analytics, and follow-up work in saga
9. Placement:
   - place SWR hooks near the owning feature or page
   - extract a shared hook only when the repository already centralizes that resource access or multiple consumers clearly benefit

### 4. Check interaction boundaries

Validate that:

- redux-saga owns API execution for the scoped remote resource
- SWR, if present, owns only cache/view behavior on top of saga-owned request flows
- redux owns only client/application state that is not just a copy of the response
- invalidation and revalidation paths are explicit after writes or workflow completion
- cache updates cover all affected keys for the user-visible surface

## Guardrails

- Do not introduce backend API calls directly inside SWR fetchers.
- Prefer Redux-saga for all API orchestration and execution.
- Use SWR only for cache/view concerns that sit on top of saga-owned request flows.
- Do not fetch the same resource through both direct SWR HTTP and saga.
- Do not leave cache update behavior implicit after remote writes.
- Do not introduce new dependencies unless explicitly requested.
- Keep recommendations concrete, minimal, and tied to the scoped task.

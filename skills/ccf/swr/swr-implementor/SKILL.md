---
name: swr-implementor
description: Implement SWR-adjacent data loading changes in this repository while keeping Redux-saga as the required owner of backend API execution. Use when asked to add, refactor, or fix SWR cache/view behavior, invalidation, or saga interaction in code without introducing direct SWR-owned backend calls.
---

# SWR Implementor

## Purpose

Help Codex complete SWR implementation work end-to-end by:

- applying task-specific SWR requirements in code
- keeping hook placement, fetch behavior, cache ownership, invalidation/revalidation, redux boundaries, and tests aligned with repository conventions
- relying on `../swr-common/SKILL.md` for the shared SWR baseline instead of duplicating it here

## When to use this skill:

- When an existing data-loading flow to SWR with stale-while-revalidate semantics.
- Fix stale data / incorrect revalidation behavior.
- Add safe optimistic updates for mutations.
- Define cache key strategy or reconcile SWR with redux/redux-saga workflows.
- Add or update tests which verify revalidation, optimistic behavior, and saga interactions.
- The task involves React TypeScript data fetching, cache revalidation, invalidation, or mutation behavior.
- The repository uses redux or redux-saga and the work needs explicit interaction boundaries.

### Do NOT use this skill if:

- The user only wants a design/spec with no code changes.
- The task is primarily backend or API implementation rather than frontend consumption.
- The repository already mandates another server-state solution for the same scope and the task is not about SWR.
- The work is backend-only.

## Inputs

- A task description, implementation request, or list of known issues.
- The target files and nearby tests.
- Existing hooks, API clients, redux slices, sagas, and feature files in the affected area.

## Workflow

1. Read `../swr-common/SKILL.md` and apply its shared SWR checklist.
2. Read files in `ui-references/` as needed for placement and repository conventions.
3. Determine the smallest correct placement for the change:
   - Patch the owning page, container, or feature hook first
   - Only promote to shared hooks when at least two consumers would reuse the behavior.
   - Update a shared hook or API helper only when the repository already centralizes that behavior and multiple consumers benefit
   - Prefer component/feature-level hook first (e.g., `useFeatureItems`) located next to the consuming page unless multiple consumers need it.
4. Mirror local file organization, typing style, and export patterns.
5. Do not implement SWR queries or mutations that call backend APIs directly.
6. Keep ownership boundaries explicit:
   - redux-saga handles all backend API execution, retries, cancellation, chained submits, analytics, navigation, or cross-slice workflows
   - SWR handles only cache/view concerns, revalidation, or local consumption of data that comes from a saga-owned request path
   - redux stores only client/app state that should survive independently of that query
7. Implement cache behavior explicitly:
   - choose stable keys
   - identify related keys affected by create, update, delete, or refresh flows
   - define whether each affected key should be updated directly, revalidated, or left unchanged
8. When a saga-triggered workflow changes server state that affects SWR-observed data:
   - revalidate or mutate the affected SWR keys when the workflow completes
   - do not copy the refreshed payload into redux unless a repository rule explicitly requires it
9. Add or update focused tests when the repository has test coverage in that area.
10. Verify:

- stable key selection
- expected loading, error, and success rendering
- correct cache update behavior after writes
- correct invalidation or revalidation after saga-driven workflows
- no duplicate ownership of the same remote response between SWR and redux

## Output Format

When implementing, return:

1. File tree of added or changed files
2. Full content for each new file
3. Diffs or full content for modified files
4. Notes on conventions matched for placement, SWR ownership, cache update strategy, saga interaction, and tests

## Guardrails

1. Do not repeat the shared baseline from `../swr-common/SKILL.md`; apply it through the implementation.
2. Do not introduce direct backend API calls inside SWR hooks or fetchers.
3. Do not bypass saga ownership for remote reads or writes.
4. After any workflow or mutation that changes server state, explicitly update or revalidate the affected SWR keys through the saga-aligned flow.
5. Do not introduce new dependencies unless explicitly requested.
6. Do not create shared utilities or abstractions just in case.
7. Keep changes minimal, typed, testable, and directly tied to the scoped data-fetching need.

# Redux Colocation and Boundaries

## Architecture Goal

Enforce a strict separation of concerns:

1. Actions express intent.
2. Sagas orchestrate side effects.
3. Reducers mutate state in response to actions.
4. Selectors derive UI-ready data.
5. Components render UI and dispatch actions only.

## Colocation by App

1. Root store files:

- `application/web/<appName>/src/store/index.ts`
- `application/web/<appName>/src/store/rootReducer.ts`
- `application/web/<appName>/src/store/rootSaga.ts`

2. Simple shared state:

- `application/web/<appName>/src/store/slices/*.ts`
- selectors near slices (for example `sessionSelectors.ts`)

3. Page/domain async flows:

- actions, reducer, saga, selectors often colocated under `application/web/<appName>/src/pages/<PageName>/`

## Action Conventions

1. Use `createAction<TPayload>()` with explicit payload types.
2. Keep action type strings stable and domain-scoped.
3. For async flows, prefer lifecycle actions:

- request (trigger)
- start (loading)
- success (data)
- failure (error)

4. Keep payloads serializable by default.
5. When function payloads are required (for example `getToken` callbacks), document serializable-check exceptions in store setup.

## Selector Conventions

1. Export base domain selector first (for example `selectAssessmentState`).
2. Use selector factories for keyed domains (for example `(engagementId) => createSelector(...)`).
3. Place all non-trivial derivation in selectors:

- filtering
- aggregation
- flattening
- default/fallback shaping
- view-model projections

4. Return stable types and null-safe defaults to simplify components.

## Saga Conventions

1. Watchers select concurrency policy deliberately:

- `takeLatest` for replaceable requests
- `takeEvery` for independent events

2. Workers perform side effects through service/util functions.
3. Workers dispatch start/success/failure actions.
4. Workers normalize and serialize errors before dispatch.
5. Keep saga branching focused on workflow orchestration, not UI rendering concerns.

## Component Boundary Rules

1. Components can call `useAppSelector` and `useAppDispatch`.
2. Components can manage local UI state (open/closed, local input draft).
3. Components should not:

- call APIs directly for Redux-managed operations
- compute complex domain derivations inline
- duplicate logic already implemented in selectors

4. Component effects should trigger intent actions, not replicate saga control flow.

## Review Checklist

A Redux change is complete when:

1. File placement matches target app pattern.
2. Actions are typed and lifecycle-complete for async flows.
3. Reducer transitions cover loading/data/error paths.
4. Derived UI logic lives in selectors.
5. Side effects live in sagas.
6. Components remain orchestration-light and presentation-focused.

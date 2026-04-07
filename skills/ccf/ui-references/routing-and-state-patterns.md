# Routing and State Patterns (AIRM/ASAI)

## Routing Entry Points

1. Primary router tree: `src/App.tsx`
2. Route guards: `application/web/<appName>/src/components/routing/RequireGuards.tsx`
3. Typical pattern: top-level guarded routes (`RequireAuth`, then `RequireTerms` for protected pages)

## State Integration Patterns

1. Root setup:

- `application/web/<appName>/src/store/index.ts`
- `application/web/<appName>/src/store/rootReducer.ts`
- `application/web/<appName>/src/store/rootSaga.ts`

2. Domain integration options:

- Add/update RTK slice in `application/web/<appName>/src/store/slices/*`
- Add/update page in `application/web/<appName>/src/pages/<PageName>/`

3. Selector/hook usage:

- Selector files near slices or store domain
- Typed hooks from `application/web/<appName>/src/store/hooks.ts`

## Async Flow Checklist

1. Define request action payload contract.
2. Handle async work in saga worker.
3. Dispatch start/success/failure actions.
4. Update reducer state for loading/data/error.
5. Consume via selectors in UI.
6. Handle retries and abort/cancel behavior if needed.

## Guard and Redirect Checklist

1. Confirm whether parent route already applies `RequireAuth`.
2. Confirm whether terms acceptance is required.
3. Keep redirects consistent with existing route semantics.
4. Ensure wildcard/fallback routes still behave correctly after additions.

## Common Pitfalls

1. Adding duplicate guard wrappers at child and parent levels.
2. Mixing AIRM slice-first pattern with ASAI action-domain flow.
3. Introducing untyped payloads into store actions.
4. Omitting failure handling for async route data.

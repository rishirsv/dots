# Component Placement Matrix

Use these guidelines to place new components before scaffolding files.

1. Route/page view component: `application/web/<appName>/src/pages/<PageName>/`
2. Cross-page UI component: `application/web/<appName>/src/components/<domain-or-type>/`
3. Feature-specific UI component: `application/web/<appName>/src/<feature>/components/`
4. Route guard or route helper: `application/web/<appName>/src/components/routing/`
5. Layout shell or layout section: `application/web/<appName>/src/components/layout/`
6. Prefer feature-based structure like the following:
   src/
   app/
   store/
   rootReducer
   rootSaga
   routes/
   providers/
   config/
   feature
   components/
   hook/
   services/
   state/
   shared/
   components/
   hooks/
   lib/
   constants/
   styles/
   types/  
    utils/

## File Shape Heuristics

1. Use folder-per-component when component has types/helpers/tests.
2. Use single file when component is trivial and neighbors follow flat style.
3. Add `<Component>.types.ts` only when prop contracts are non-trivial.
4. Add `index.ts` only where nearby folders already use barrel exports.

## Reuse Threshold

1. First usage: keep local to feature/page area.
2. Second usage in same domain: evaluate shared location within that domain.
3. Cross-domain usage in multiple areas: move only after usage is confirmed and refactor is requested.

## Styling and Imports

1. Match existing styling stack in target area.
2. Keep imports consistent with current alias and relative import style.
3. Do not introduce new styling system or dependency for one component.

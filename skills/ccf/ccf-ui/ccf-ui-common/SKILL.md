---
name: ccf-ui-common
description: Apply the CCF ui engineering rules when implementing, refactoring, or reviewing code. Use for tasks in this monorepo that must preserve frontend/backend/shared-library boundaries, and enforce frontend auth/accessibility/i18n/redux-saga/file placement/design patterns.
---

# Library usage

Use these guidelines when deciding things like whether to use raw HTML element, predefined custom components, or predefined Chakra v3 components, or whether to use Tailwind/CSS styling or built in Chakra theming.

## Component usage

1. Use raw html elements + tailwindcss for layout/structural primitives like div/span/li over Chakra v3 components like Box/Text/List/Stack.
2. Use predefined custom elements whenever possible (in the shared components folder, like Button.tsx). If predefined custom elements don't exist, prefer using Chakra v3 components over creating new ones.
3. Use Chakra v3 components for more complex components like Sliders, Accordions, or Breadcrumbs.

## Styling usage

1. Prefer to use Tailwind styling/theming.
2. Ensure colours are consistent across Tailwind, CSS and Chakra theme.
3. Ensure both dark mode and light mode are always supported and implemented, and synced across Tailwind and Chakra themes.
4. Only use colours defined in the Tailwind theme unless necessary, but not so restrictively that the interface becomes too bland/monotone and not have enough contrast to make certain elements draw more attention.
5. Prefer using semantic tokens to style elements (e.g. `bg-surface`) unless they requires a more creative, non-standardized look.
6. Be consistent across designs (e.g. consistent border styling for panels, consistent roundness of container corners, etc.)
   - Reserve dashed borders for indicating drop zones or placeholders/empty state7. Assign one styling owner per element. If a control is Chakra-based, use Chakra recipe, theme, or props for height, padding, border, radius, colors, and focus styles. If a control is raw HTML or Tailwind-based, keep those properties in Tailwind or CSS only.
8. Do not mix Tailwind classes and Chakra props that target the same CSS property group on the same element, especially `h-*` or `min-h-*`, `p-*`, `px-*`, `py-*`, `rounded-*`, `border-*`, `bg-*`, `text-*`, and ring or outline styles.
9. Avoid duplicate or conflicting utility classes on the same node; one height class and one radius class per control.
10. Prefer shared input primitives or shared recipes over repeating control class strings inline.


## Layout containment and overflow

1. Child content must never visually escape a container by default. Every container with dynamic content must be designed to either grow with content or provide intentional scrolling.
2. Do not use fixed heights on containers with variable text, lists, helper copy, status messages, or dynamic controls unless overflow behavior is explicitly defined.
3. If a region is not intended to scroll, let it size to content with `height: auto`, `min-height`, or content-driven layout instead of clipping or overflow.
4. If a region is intentionally bounded, add explicit overflow behavior at the correct container level, typically `overflow-y-auto` for vertical content.
5. In flex and grid layouts, set `min-w-0` and `min-h-0` on children that need to shrink, wrap, or scroll inside bounded parents.
6. Long text must wrap inside its container. Do not rely on `overflow-hidden` to mask layout problems.
7. Avoid nested scroll regions unless the task explicitly requires them. Prefer one obvious scroll container per pane or rail.
8. Before finishing a UI task, verify that empty states, helper text, validation text, long labels, and loading states remain contained within their parent regions.
9. If content overflows its parent, the implementation is incomplete until the parent is changed to grow or the overflow is made intentionally scrollable.

# Routing, Auth, Auth Guards and State Patterns

## Auth Guidelines

1. Empty scopes for `AUTH.SCOPES` is allowed (e.g. `[]` or `['']`)
2. Do not modify `AuthProvider.tsx` in a way that would change its behavior (e.g. keep `idToken` as is, do not modify it)

## Routing Entry Points

1. Primary router tree: `application/web/<appName>/src/App.tsx`
2. Route guards: `application/web/<appName>/src/components/routing/RequireGuards.tsx`
3. Typical pattern: top-level guarded routes (`RequireAuth`, then `RequireTerms` for protected pages)
4. Attempts to navigate to non-existent pages should reroute to `/`

#### Guard and Redirect Checklist

1. Confirm whether parent route already applies `RequireAuth`.
2. Confirm whether terms acceptance is required.
3. Keep redirects consistent with existing route semantics.
4. Ensure wildcard/fallback routes still behave correctly after additions.

### State Integration Patterns

#### State Setup Guidelines

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

#### Selector Stability Rules

1. Use named exported selectors with `useAppSelector` by default.
2. Do not use anonymous `useAppSelector((state) => ...)` callbacks when they return arrays, objects, command models, or validation objects.
3. Plain selectors and selector inputs must not allocate fallback arrays or objects.
4. Use shared empty constants for non-primitive fallbacks.
5. Put non-trivial non-primitive derivation in memoized selectors or selector factories, not in component bodies.
6. If a component passes runtime input into selector logic, use a selector factory or derive locally from primitive selector outputs.

#### Async Flow Checklist

1. Define request action payload contract.
2. Handle async work in saga worker.
3. Dispatch start/success/failure actions.
4. Update reducer state for loading/data/error.
5. Consume via selectors in UI.
6. Handle retries and abort/cancel behavior if needed.

### File Placement Guidelines

#### File Location By Type

1. Route/page view component: `application/web/<appName>/src/pages/<PageName>/`

- `pages/` contains route entry components only.

2. Cross-page UI component: `application/web/<appName>/src/components/<domain-or-type>/`

- `components/` contains genuinely reusable UI primitives and shared layout.

3. Feature-specific UI component: `application/web/<appName>/src/<feature>/components/`

- `features/` contains feature-owned components, API clients, sagas, slices, selectors, helpers.

4. Route guard or route helper: `application/web/<appName>/src/components/routing/`
5. Layout shell or layout section: `application/web/<appName>/src/components/layout/`
6. Localization/i18n text entries: english: `application/web/<appName>/public/locales/en-US`, french: `application/web/<appName>/public/locales/fr-CA`
7. Cross-cutting, helper functions: `application/web/<appName>/src/utils/`

- `utils/` contains genuinely reusable technical helpers .

#### File Shape Heuristics

1. Use folder-per-component when component has types/helpers/tests.
2. Use single file when component is trivial and neighbors follow flat style.
3. Add `<Component>.types.ts` only when prop contracts are non-trivial.
4. Add `index.ts` only where nearby folders already use barrel exports.
5. Prefer a local page folder with small focused files over a single route file that mixes page shell, form UI, feedback UI, and helper logic.

#### Reuse Threshold

1. First usage: keep local to feature/page area.
2. Second usage in same domain: evaluate shared location within that domain.
3. Cross-domain usage in multiple areas: move only after usage is confirmed and reusing does not modifying the shared piece of code does not impact the original implementation significantly.

#### Styling and Imports

1. Match existing styling stack in target area.
2. Keep imports consistent with current alias and relative import style.
3. Do not introduce new styling system or dependency for one component.

### API Connections

#### Redux-Saga: All API calls must use Redux-saga, prefer existing Redux-saga flows

- If an API call is necessary, it must be made using a saga. No API call (`fetch`, `fetchData`, HTTP client call, SWR fetcher, React effect, event handler, route loader, or custom hook) may be made outside of a saga.
- **Use an existing Redux-saga flow if one already covers the endpoint or use-case**.
- Only **create a new Redux-saga flow** (actions, reducer state, selectors, saga worker, and watcher) when:
  - no existing flow matches the behavior, or
  - the existing flow cannot be safely extended without breaking other consumers.

**Implications**

- Components, hooks, and route loaders must dispatch request or intent actions and select status, error, and result from the store.
- Side effects (API calls, retries, cancellation, redirects, toasts if centralized, cache refresh triggers) live in sagas.
- Keeping field state, draft state, or route-local UI state local does not justify direct API calls.


#### Existing fetch utilities: API calls must use existing fetch utilities

- Any API call made by sagas must use the repo’s **existing defined fetch utilities** (e.g., shared `fetchData` utils in `application/web/<appName>/src/utils/methods.ts` folder..).
- Prioritize using `fetchData` in `application/web/<appName>/src/utils/methods.ts`
- Do **not** introduce ad-hoc `fetch(...)` usage or new HTTP wrappers unless explicitly requested and justified by existing conventions.
- Ensure consistent behavior with existing utilities:
  - base URL handling
  - auth headers / token injection
  - error normalization (status parsing, response shape)
  - request cancellation support if available (AbortController, saga cancellation, etc.)
  - use existing `extractErrorCodes` util to extract error codes from backend error responses and use the first extracted code as the i18n key for displaying error messages

#### New saga flow checklist (only when necessary)

When creating a new submission flow, keep it consistent with existing patterns:

- **Actions**
  - `submitRequested(payload)`
  - `submitSucceeded(result)`
  - `submitFailed(error)`
- **State**
  - `isSubmitting`
  - `error`
  - `result` or `lastSubmitted` (as locally appropriate)
- **Selectors**
  - `selectIsSubmitting`
  - `selectSubmitError`
  - `selectSubmitResult`
- **Saga**
  - watcher pattern consistent with local conventions (`takeLatest` for submit is common)
  - worker calls API via existing fetch utility
  - cancellation + retry behavior aligned with local patterns

### Redux Colocation and Boundaries

#### Architecture Goal

Enforce a strict separation of concerns:

1. Actions express intent.
2. Sagas orchestrate side effects.
3. Reducers mutate state in response to actions.
4. Selectors derive UI-ready data.
5. Components render UI and dispatch actions only.

#### Colocation by App

1. Root store files:

- `application/web/<appName>/src/store/index.ts`
- `application/web/<appName>/src/store/rootReducer.ts`
- `application/web/<appName>/src/store/rootSaga.ts`

2. Simple shared state:

- `application/web/<appName>/src/store/slices/*.ts`
- selectors near slices (for example `sessionSelectors.ts`)

3. Page/domain async flows:

- actions, reducer, saga, selectors often colocated under `application/web/<appName>/src/pages/<PageName>/`

#### Action Conventions

1. Use `createAction<TPayload>()` with explicit payload types.
2. Keep action type strings stable and domain-scoped.
3. For async flows, prefer lifecycle actions:

- request (trigger)
- start (loading)
- success (data)
- failure (error)

4. Keep payloads serializable by default.
5. When function payloads are required (for example `getToken` callbacks), document serializable-check exceptions in store setup.

#### Selector Conventions

1. Export base domain selector first (for example `selectAssessmentState`).
2. Use selector factories for keyed domains (for example `(engagementId) => createSelector(...)`).
3. Place all non-trivial derivation in selectors:

- filtering
- aggregation
- flattening
- default/fallback shaping
- view-model projections

4. Return stable types and null-safe defaults to simplify components.

#### Saga Conventions

1. Watchers select concurrency policy deliberately:

- `takeLatest` for replaceable requests
- `takeEvery` for independent events

2. Workers perform side effects through service/util functions.
3. Workers dispatch start/success/failure actions.
4. Workers normalize and serialize errors before dispatch.
5. Keep saga branching focused on workflow orchestration, not UI rendering concerns.

#### Component Boundary Rules

1. Components can call `useAppSelector` and `useAppDispatch`.
2. Components can manage local UI state (open/closed, local input draft).
3. Components should not:

- call APIs directly for Redux-managed operations
- compute complex domain derivations inline
- duplicate logic already implemented in selectors

4. Component effects should trigger intent actions, not replicate saga control flow.

#### Review Checklist

A Redux change is complete when:

1. File placement matches target app pattern.
2. Actions are typed and lifecycle-complete for async flows.
3. Reducer transitions cover loading/data/error paths.
4. Derived UI logic lives in selectors.
5. Side effects live in sagas.
6. Components remain orchestration-light and presentation-focused.

### Localization

1. All text in the application must have localization support using the existing i18n setup (french and english), even if tasks or requirements do not explicitly mention it.
2. If adding any new namespaces, ensure that they fall under the right folder structure as defined in the File Location
   By Type section, and be sure to include them in the list of namespaces when initializing in I18Provider.
3. When generating any new namespaces, create them in a domain-based manner (e.g., controls, generic, buttons) that organize keys consistently across languages and support modular loading and maintainable updates.
4. Do not create any custom 'copies' or records for localization support - always use i18n and (create) the entries in folder(s) for localization as defined in the File Location By Type section.
5. Enforce English as the default language if the browser's language is not one of English (US)/`en-US` or French (Canadian)/`fr-CA`

### Error handling

1. Prefer using error types in `application/web/<appName>/src/utils/errors.ts` before creating new errors.
2. Create new error types in `application/web/<appName>/src/utils/errors.ts` only when necessary.
3. Errors that occur from API calls should be cleared on a retry, or the next attempt at calling the same API; this should be done in the Redux Saga where and when the call to the API is made.

Guardrails:

- Do not use absolute positioning, negative margins, or translated offsets for normal sidebar/card/list layout unless the task explicitly requires layered UI.
- Sidebar sections must remain in normal document flow using flex/grid/stack layout with explicit spacing tokens.
- Do not give fixed heights to containers with variable text or dynamic content. Let cards grow with content.
- If multiple panels share a rail, compose them in one parent vertical stack with consistent gaps; do not visually float independent cards into the same space.
- Buttons, headings, helper text, and list rows must have enough vertical space to render at supported content lengths without collision.
- When adding a new section, inspect sibling sidebar sections first and match their spacing, padding, border treatment, and width behavior.
- Prefer reducing helper copy over compressing spacing or text line-height.
- Before finishing a UI task, verify at least desktop rail width and one narrow/mobile width. No text, cards, or controls may overlap, clip, or become illegible.
- If the implemented layout becomes crowded, simplify the section structure instead of stacking more nested surfaces, or consider collapsible sections such as an accordion, or in the case of tables, an expandable row.
- Never render task-artifact language directly into product UI.
- Do not expose provided documentation such as requirements, task titles, implementation notes, acceptance-criteria wording, or instructional/rationale text to end users.
- User-facing copy must come from explicit product requirements, existing repo copy patterns, or minimal neutral labels. Do not include text describing requirements or task artifacts, nor text that explains app behavior unless it is explicitly needed (like in a tooltip or information/help page)
- If copy intent is unclear, use the smallest sensible product label and avoid explanatory paragraphs.
- Before finalizing UI text, ask: would this make sense to a user who has never seen the task artifact? If not, rewrite or remove it. Do not include text describing requirements or task artifacts, nor text that explains app behavior unless it is explicitly needed (like in a tooltip or information/help page)

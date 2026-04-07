---
name: performance-common
description: Shared performance rules and guardrails for this repository. Use alongside performance-designer and performance-implementor when Codex needs the common checklist for render cost, bundle boundaries, loading strategy, memoization, virtualization, caching, and measurement without duplicating those rules in role-specific skills.
---

# Frontend Performance — Common

## Purpose

Help Codex keep (frontend) performance improvement design and implementation consistent by:

- Centralize repository-wide performance rules so designers and implementors make consistent decisions about runtime cost, bundle size, loading behavior, network usage, and measurement.
- Removing duplicated setup from `performance-designer` and `performance-implementor`.

## When to use this skill:

- When a task involves **frontend performance decisions** and Codex needs the shared rules that both the designer and implementor should follow.
- A performance designer or implementor skill needs shared placement and improvement design rules
- When a task is at risk of degrading performance

## Do NOT use this skill if:

- The task is **not actually about frontend performance**, or when performance is only incidental and no performance decision is being made.
- The task is purely visual or structural UI work with no performance concern

## Inputs

- The target app and UI surface in scope.
- The task description or a performance design block.
- Nearby repository examples for performance guidelines and rules
- Contents of task or feature request
- Relevant route/page/component names
- Any stated performance symptom (slow first load, input lag, large list jank, slow tab switch, etc.)
- Any available baseline metric, profiler trace, or bundle insight

## Workflow

1. Identify the target app and target surface:
   - route/page
   - layout/app shell
   - list/table/feed
   - form/workflow
   - dialog/drawer
   - shared component/library boundary
2. Inspect nearby patterns before proposing changes:
   - routing and lazy loading conventions
   - data-fetching strategy
   - state ownership
   - list/table rendering approach
   - Chakra and React composition patterns
3. Determine the likely bottleneck category before proposing fixes:
   - **bundle/load cost**
   - **render/re-render cost**
   - **large DOM/list cost**
   - **network latency / overfetching**
   - **expensive computation**
   - **asset/media cost**
4. Prefer measurement-backed improvements over intuition.

## Core Principles

### 1. Optimize the real bottleneck

Do not apply memoization, code splitting, or virtualization by reflex. First classify the likely cost:

- initial load / JS bundle
- repeated rendering
- too many mounted nodes
- excessive requests / refetching
- expensive derived data
- large images/assets

### 2. Prefer architectural wins over micro-optimizations

Higher-value changes usually include:

- route-level code splitting
- deferring non-critical UI
- reducing fetched data
- virtualizing large collections
- limiting provider/store churn
- narrowing subscriptions/selectors
- moving expensive work out of render

These are usually better than sprinkling `useMemo`/`useCallback` everywhere.

### 3. Preserve correctness and clarity

A slower but correct and maintainable implementation is better than a fragile “optimized” one. Avoid changes that:

- make state flow harder to understand,
- create stale-prop bugs,
- break accessibility,
- hide loading/error states,
- introduce cache invalidation risk.

### 4. Optimize at the right boundary

Common boundaries:

- route boundary
- tab/panel boundary
- list item boundary
- provider/store selector boundary
- expensive derived data boundary
- media asset boundary

### 5. Measure after changes

Every performance change should define how improvement will be validated:

- fewer renders
- smaller initial bundle
- reduced time to interactive
- smoother scrolling
- faster input response
- reduced request count/payload size

## Shared Rules

### Bundle and loading

- Prefer route-level lazy loading for large sections.
- Defer non-critical panels, dialogs, and secondary tabs when consistent with UX.
- Avoid importing large libraries into shared/root bundles unless genuinely needed globally.
- Keep app-shell code eager only when it is required for first paint or navigation.
- Prefer progressive disclosure over eagerly mounting hidden content.

### Rendering

- Avoid passing unstable inline objects/functions through deeply memoized trees unless harmless.
- Memoize only when:
  - child render cost is meaningful, and
  - prop stability can realistically be maintained.
- Move expensive derived calculations outside render or behind targeted memoization.
- Avoid broad context/provider updates for highly localized state.
- Prefer selector-based subscriptions when available.

### Lists and tables

- Virtualize large or unbounded collections.
- Paginate or cursor-load before resorting to rendering very large DOMs.
- Keep row components narrow in responsibility and props.
- Avoid per-row expensive closures, derived formatting, or nested providers when unnecessary.
- Use stable keys from domain identifiers, never array index for reorderable/dynamic data.

### Data and network

- Do not overfetch if the view only needs summary data.
- Reuse cache appropriately and avoid unnecessary refetch loops.
- Use background fetching and stale-while-revalidate patterns where repo conventions support them.
- Debounce user-driven search/filter requests when appropriate.
- Batch or combine related requests only when it reduces user-perceived cost and complexity remains reasonable.

### Forms and interactions

- Keep keystroke-coupled rendering local where possible.
- Avoid global state updates on every input change unless required.
- Defer expensive validation/formatting when possible.
- Use transitions or deferred values only when they clearly improve responsiveness and match local conventions.

### Assets and media

- Do not ship oversized images or media when a smaller version would suffice.
- Lazy load below-the-fold or optional media when appropriate.
- Prefer dimension-stable media rendering to reduce layout shift.

## Measurement Expectations

When performance work is designed or implemented, define at least one success signal:

- render count reduction,
- bundle split created,
- request count or payload reduction,
- virtualization introduced,
- time-sensitive interaction isolated from broad rerenders,
- expensive computation memoized or moved.

If exact metrics are unavailable, use comparative verification:

- before/after React Profiler render counts
- before/after bundle composition
- before/after network waterfall
- before/after DOM node count for large lists

## Guardrails

- Do not add optimization hooks everywhere “just in case”.
- Do not add memoization that depends on unstable props and provides no real gain.
- Do not introduce virtualization for small static lists.
- Do not split code so aggressively that UX suffers from constant loading flashes.
- Do not break accessibility, keyboard flow, or semantics in the name of performance.
- Do not move state to a wider scope solely to avoid prop passing.
- Do not replace readable code with clever performance tricks unless the benefit is clear and meaningful.

## Common Checklist

Before finalizing any performance design or implementation, verify:

- bottleneck category identified,
- optimization target is specific,
- proposed change matches the bottleneck,
- user-visible states remain correct,
- measurement/verification plan exists,
- no premature abstraction or premature optimization was introduced.

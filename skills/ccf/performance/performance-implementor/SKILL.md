---
name: performance-implementor
description: Implement measured, repository-aligned frontend performance improvements from a Performance Design block. Use when making real code changes for React render cost, bundle splitting, virtualization, memoization boundaries, loading strategy, network efficiency, and performance verification.
---

# Frontend Performance Implementor

## Overview

Implement the smallest correct set of code changes needed to realize a `## Performance Design (for performance-implementor)` block.

Typical work includes:

- route/component lazy loading,
- narrowing rerender boundaries,
- moving expensive derived work,
- introducing virtualization,
- localizing state,
- improving request timing or frequency,
- reducing unnecessary eager imports,
- preserving UX and accessibility while improving responsiveness.

Do not redesign the task here; implement the approved performance plan.

## Preparation

1. Read `performance-common` first and apply shared guardrails.
2. Read the `## Performance Design (for performance-implementor)` block carefully.
3. Inspect nearby code to match:
   - export style
   - file placement
   - hook patterns
   - routing conventions
   - state/data-fetching conventions
   - test conventions
4. Confirm the actual change boundary:
   - route
   - layout
   - component subtree
   - list/table
   - hook/selector
   - data request timing
   - asset import boundary

Inputs:

- `## Performance Design (for performance-implementor)` block or equivalent scoped instructions
- Relevant file paths / feature area
- Nearby examples from the target app
- Any profiler/bundle/network hints if available

## Output Format

Provide:

1. File tree of added/changed files
2. Full content for new files
3. Diffs or full updated content for changed files
4. Notes on conventions matched
5. Verification notes:
   - what was optimized
   - how to manually verify
   - what tests were added or adjusted

## Workflow

### 1. Confirm the bottleneck-to-fix mapping

Before editing, identify which concrete technique the design requires:

- lazy load / split
- defer mounting
- memo boundary
- state localization
- selector narrowing
- virtualization
- debounce/throttle
- derived-data memoization
- asset deferral
- request-frequency reduction

Do not add extra optimizations not justified by the design.

### 2. Make the smallest viable code change

Prefer narrow edits over broad rewrites:

- feature-local before shared abstraction
- route-local split before app-wide loading framework
- component-local rerender fix before moving ownership globally

### 3. Typical implementation patterns

#### A. Bundle / code-splitting

Use when the design calls for route- or section-level lazy loading.

- Split large routes, secondary tabs, drawers, and heavy optional panels.
- Keep critical-above-the-fold content eager when necessary.
- Ensure fallback UI is intentional and accessible.
- Avoid creating loading flicker for tiny modules where split cost outweighs benefit.

#### B. Rerender reduction

Use when the design identifies broad or unnecessary rerenders.

- Move unstable values closer to where they are used.
- Localize state that does not need to be shared.
- Narrow context/provider impact where possible.
- Add `React.memo` only when props can remain stable and child render cost matters.
- Use `useMemo` / `useCallback` only for concrete rerender or expensive-computation reasons.

#### C. Expensive derived work

Use when formatting/filtering/sorting/aggregation is expensive.

- Move expensive work out of render when possible.
- Memoize derived results using stable dependencies.
- Avoid recomputing on unrelated state changes.
- Precompute at a higher boundary only if ownership still makes sense.

#### D. Lists / tables

Use when DOM size or row cost is the bottleneck.

- Introduce virtualization according to local conventions.
- Keep row components small and prop-stable.
- Avoid per-row expensive derived logic when it can be lifted or memoized safely.
- Preserve keyboard and screen-reader behavior.

#### E. Request timing / frequency

Use when performance is degraded by too many or poorly timed requests.

- Debounce request-triggering search/filter input when appropriate.
- Avoid duplicate requests caused by effect churn or unstable params.
- Reuse cache according to local data-fetching conventions.
- Do not silently weaken data freshness requirements without design approval.

#### F. Interaction responsiveness

Use when typing/clicking feels delayed.

- Keep fast-changing input state local.
- Isolate expensive siblings from the interaction subtree.
- Use deferred or transition-based patterns only if already acceptable in local conventions and clearly beneficial.

### 4. Preserve states and UX

After optimization, verify that:

- loading states still appear correctly,
- empty states still render,
- errors still surface,
- focus order and keyboard behavior are intact,
- hidden/deferred content does not break semantics or expectations.

### 5. Tests

Add or update focused tests when behavior changes. Typical cases:

- lazy-loaded sections still render through fallback to resolved content,
- debounced search triggers correctly,
- virtualization boundary renders expected visible content,
- memo/rerender-sensitive changes preserve outputs and interactions.

Do not add excessive tests for purely internal memoization unless behavior changes materially.

### 6. Verification notes

Always include a short verification summary:

- what performance concern was addressed,
- where the boundary changed,
- what to inspect manually (Profiler, bundle, list behavior, request cadence).

## Guardrails

- Do not scatter `useMemo` / `useCallback` everywhere.
- Do not add `React.memo` to cheap components with unstable props and no demonstrated benefit.
- Do not introduce virtualization without enough scale to justify it.
- Do not split tiny modules solely to claim code splitting.
- Do not trade correctness or accessibility for speed.
- Do not convert local state to global state as a performance shortcut.
- Do not rewrite unrelated architecture while implementing a localized optimization.

## Implementation Checklist

Before finalizing, verify:

- the implemented change matches the stated bottleneck,
- no extra speculative optimization was added,
- UX states still work,
- accessibility still works,
- changes follow local repository conventions,
- a clear manual verification note is included.

Verification notes:

- Introduced virtualization for large customer result sets
- Localized filter draft state to avoid full-page rerender on each keystroke
- Manual check: compare scroll smoothness and render counts in React Profiler

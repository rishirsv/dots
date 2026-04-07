---
name: performance-designer
description: Produce a Performance Design block that identifies bottlenecks, chooses the appropriate optimization strategy, and defines measurable acceptance criteria. Use when asked to design performance improvements for a React frontend task without implementing code.
---

# Frontend Performance Design

## Purpose

Help Codex complete design-system design work end-to-end by:

- producing one implementation-ready `## Performance Design (for performance-implementor)` block
- Designing the minimum effective performance plan needed for a task, feature, route, or component set.

Prioritize:

- identifying the likely bottleneck,
- choosing the right optimization boundary,
- minimizing complexity,
- preserving UX/accessibility,
- defining how success will be validated.

Do not implement code in this skill.

## Inputs

- Task name.
- Task description.
- Relevant route/page/component names
- Any symptom description
- Any existing profiling/bundle/network evidence

## When to use this skill:

- The user wants a performance improvement plan/design without code changes.
- Another frontend skill needs a dedicated design-system block before implementation begins.

### Do NOT use this skill if:

- The user wants theming or token code changes rather than a design artifact.
- The task is a feature component change with no token authoring or design-system contract.
- The request only needs a one-line color fix with no new semantic role.

## Preparation

1. Read `performance-common` first and apply its shared rules.
2. Identify the target app and performance surface:
   - initial route load
   - route transition
   - list/table rendering
   - form/input responsiveness
   - expensive derived data
   - repeated rerenders
   - network/request overhead
3. Inspect nearby implementation patterns mentally or via provided context:
   - route layout structure
   - current provider/state usage
   - data-fetching behavior
   - shared component boundaries
   - table/list composition
4. Define the likely primary bottleneck and any secondary bottlenecks.

## Output Format

Return:

1. `Summary`
2. `Assumptions`
3. `## Performance Design (for performance-implementor)`

The `## Performance Design (for performance-implementor)` block must contain these sections in order:

### 1. Target Surface

- app / route / feature / component scope
- user-visible symptom
- performance category:
  - bundle/load
  - render/rerender
  - list/DOM size
  - network/data-fetching
  - expensive computation
  - asset/media

### 2. Bottleneck Hypothesis

For each significant issue:

- suspected cause
- evidence available or reasoning used
- impact on user experience
- priority: primary / secondary

### 3. Optimization Strategy

Specify the chosen strategy and why it matches the bottleneck. Examples:

- route-level lazy loading
- subpanel/dialog lazy mounting
- memo boundary around expensive subtree
- selector narrowing
- localizing state
- virtualization
- pagination/cursor loading
- debounced search/filter
- derived-data memoization
- background/deferred rendering
- asset deferral or resizing

### 4. Scope of Change

List:

- files or areas likely to change
- boundaries that must remain unchanged
- whether this is local, feature-level, or shared/systemic

### 5. UX and Correctness Constraints

Explicitly state:

- loading-state expectations
- error-state expectations
- accessibility constraints
- interaction behaviors that must not regress

### 6. Measurement Plan

Define how success will be checked. Include at least one:

- fewer rerenders in Profiler
- smaller eager bundle
- reduced requests/payload
- fewer mounted DOM nodes
- smoother scrolling
- reduced keystroke lag
- faster panel/route activation

### 7. Acceptance Criteria

Provide explicit, testable criteria such as:

- Route X lazy-loads non-critical panel Y.
- List Z uses virtualization when item count exceeds N.
- Search input no longer triggers request on every keystroke; debounce is applied.
- Expensive derived calculation is no longer recomputed on unrelated state changes.
- Provider updates no longer rerender the entire page subtree.

### 8. Risks / Tradeoffs

Call out:

- added complexity,
- cache/loading implications,
- possible over-optimization risk,
- any dependency on unknown data sizes or future requirements.

## Design Guidance

### Prefer explicit performance decisions

Do not say “optimize rerenders” in the abstract. Specify:

- which subtree,
- why it rerenders,
- what boundary changes,
- what should become stable.

### Prefer one clear strategy per bottleneck

Do not stack unnecessary techniques. Example:

- If the problem is large list DOM cost, prioritize virtualization or pagination.
- If the problem is initial load, prioritize code splitting or reducing eager imports.
- If the problem is input lag, localize state or defer expensive derived work.

### Include thresholds when useful

If a strategy depends on scale, say so:

- virtualize when list can exceed ~50–100 visible complex rows,
- debounce search when input drives network requests,
- lazy load secondary tabs/dialogs that are not needed for first paint.

### Make implementor handoff deterministic

The implementor should not have to guess:

- what the bottleneck is,
- which technique to apply,
- what boundary to change,
- how to validate success.

## Guardrails

- Do not prescribe memoization without identifying the rerender source.
- Do not prescribe virtualization for small lists.
- Do not prescribe lazy loading for critical-above-the-fold content unless justified.
- Do not turn every performance concern into shared infrastructure.
- Do not require exact benchmark numbers when none are available; comparative validation is acceptable.

## Example Skeleton

### Performance Design (for performance-implementor)

#### Target Surface

- App: admin
- Route: `/customers`
- Scope: customer list page and filter sidebar
- Symptom: slow first interaction and scroll jank on large result sets
- Category: list/DOM size + render/rerender

#### Bottleneck Hypothesis

- Primary: large unvirtualized row rendering causes excessive mounted DOM nodes
- Secondary: filter changes rerender the full page subtree due to broad state ownership

#### Optimization Strategy

- Introduce row virtualization for the results table
- Localize filter UI state until apply/commit
- Memoize row-level formatting only where props are stable

#### Scope of Change (e.g.)

- <bullets> list of files touched

#### UX and Correctness Constraints

- Keyboard table navigation must remain intact
- Empty/loading/error states must remain visible and accessible

### Measurement Plan

- Compare DOM node count before/after
- Compare scroll smoothness and render counts in Profiler

### Acceptance Criteria

- Table renders only visible rows plus overscan
- Filter typing no longer rerenders the full results subtree on each keystroke

### Risks / Tradeoffs

- Virtualization may complicate dynamic row height behavior

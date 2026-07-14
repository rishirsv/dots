# Review Checklists

This reference defines what to inspect. The owning workflow decides whether
findings are fixed, reported, or written to an audit document.

## Correctness Review

- Trace changed conditions, state transitions, errors, resource cleanup, and
  boundary inputs such as empty, null, zero, overflow, timing, and concurrency.
- Check whether the diff breaks an existing caller, invariant, contract, test,
  or removed behavior.
- Inspect tests and fixtures when they encode the affected invariant, and flag
  only gaps introduced or exposed by the change.
- Follow important changed preconditions, return shapes, exceptions, and
  ordering into direct callers and callees when the diff depends on them.

## Agent 1: Code Reuse Review

For each change:

1. **Search for existing utilities and helpers.** Look in shared modules,
   utility directories, adjacent files, and the current owning layer for code
   that already performs the newly written behavior.
2. **Flag new functions that duplicate existing functionality.** Identify the
   current function or owner that should be used instead of preserving a second
   implementation.
3. **Flag inline logic that could use an existing utility.** Check hand-written
   string transformations, path handling, environment detection, type guards,
   parsing, formatting, and other repository-standard operations.

## Agent 2: Code Quality Review

Review the same changes for these hacky patterns:

1. **Redundant state**: duplicated state, cached values that can be derived, and
   observers or effects that can be direct calls.
2. **Parameter sprawl**: new parameters added to an existing function when the
   current model should be generalized or restructured instead.
3. **Copy-paste with slight variation**: near-duplicate blocks whose real shared
   behavior should have one implementation.
4. **Leaky abstractions**: internal details exposed to callers or changes that
   break an existing abstraction boundary.
5. **Stringly-typed code**: raw strings used where the repository already has
   constants, enums, string unions, branded types, or a shared contract.
6. **Unnecessary JSX nesting**: wrapper elements that add no layout or behavior
   value when an inner component already exposes the needed props.
7. **Unnecessary comments**: comments that restate what the code does, narrate
   the change, or refer to the task/caller. Keep non-obvious why: hidden
   constraints, subtle invariants, or necessary workarounds.

### Code Judo And Canonical Ownership

Apply this subsection only to changed-code scope. Broad repo or subsystem
structural discovery belongs to Architecture Review.

- Challenge working code that makes the surrounding design messier. Prefer a
  behavior-preserving restructuring that makes the implementation substantially
  smaller, more direct, and easier to explain.
- Look for a reframing that removes whole branches, helpers, modes,
  conditionals, wrappers, or layers. Delete complexity instead of distributing
  the same concepts across more files.
- Prefer direct, boring, maintainable code over brittle or magical machinery.
  Challenge pass-through helpers, identity wrappers, speculative indirection,
  silent fallbacks, and generic mechanisms that hide simple assumptions.
- Keep logic in the canonical owning layer. Feature behavior should not leak
  into shared infrastructure, and implementation details should not leak
  through public boundaries.
- Push on unnecessary optionality, loose object shapes, cast-heavy boundaries,
  and unclear invariants when a stronger current contract would remove branches
  or fallback behavior.
- Treat scattered special cases and ad-hoc conditionals as a design problem
  when one state model, policy, dispatcher, or owner would make them disappear.
- Treat feature flags as temporary deployment mechanisms. Avoid deep or
  scattered flag checks and make the current cleanup boundary explicit.

A cleanup succeeds only when it preserves intended behavior and leaves the code
easier to understand, debug, and change. Do not optimize for fewer lines,
combine distinct concerns, remove a useful abstraction, or replace explicit
code with clever dense code.

## Agent 3: Efficiency Review

Review the same changes for:

1. **Unnecessary work**: redundant computations, repeated file reads, duplicate
   network or API calls, and N+1 patterns.
2. **Missed concurrency**: independent operations run sequentially even though
   neither state nor ordering requires serialization.
3. **Hot-path bloat**: new blocking or repeated work added to startup,
   per-request, per-event, or per-render paths.
4. **Recurring no-op updates**: polling loops, intervals, or event handlers that
   update state or stores unconditionally. Preserve the local no-change signal
   so downstream consumers are not notified when nothing changed. When a
   wrapper accepts an updater or reducer, verify that it honors same-reference
   returns or the repository's equivalent no-change contract.
5. **Unnecessary existence checks**: checking for a file or resource before
   operating on it, creating a check-then-act race. Perform the operation and
   handle its error.
6. **Memory**: unbounded structures, retained closures, missing cleanup, and
   event-listener or subscription leaks.
7. **Overly broad operations**: reading complete files, collections, payloads,
   or dependency graphs when the operation needs only a bounded subset.

Also challenge related updates that can leave state half-applied. Prefer one
atomic operation when partial completion would make the flow brittle.

## Conditional Risk-Specific Angles

Use only the angles that match the change.

### Adversarial Challenge

Use this only when the user asks for a challenge or ship-readiness review, or
when the change touches auth, persisted state, irreversible operations,
concurrency, security boundaries, or migrations.

Actively try to disprove the change. Question the chosen implementation, design
choices, tradeoffs, and assumptions. It is not just a stricter pass over
implementation defects.

Trace how bad inputs, retries, concurrent actions, or partially completed
operations move through the code. If something only works on the happy path,
treat that as a real weakness.

Prioritize:

- auth, permissions, tenant isolation, and trust boundaries
- data loss, corruption, duplication, and irreversible state changes
- rollback safety, retries, partial failure, and idempotency gaps
- race conditions, ordering assumptions, stale state, and re-entrancy
- empty-state, null, timeout, and degraded dependency behavior
- version skew, schema drift, migration hazards, and compatibility regressions
- observability gaps that would hide failure or make recovery harder

Be aggressive, but stay grounded.

### Removed Behavior

For each deletion, identify the invariant it enforced and where the new code
re-establishes it.

### Cross-File Contract

Trace direct callers and callees for changed shapes, errors, timing, and
ownership.

### Language Or Framework Pitfalls

Inspect relevant hazards such as missing awaits, closure capture, mutable
defaults, timezone drift, nil-map writes, escaping, injection, or equivalent
local risks.

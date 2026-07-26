# Correctness Lane

Find reachable defects in the selected scope. Angles are independent: never let
one angle's conclusion suppress another's. If two angles reach the same line for
different reasons, both candidates stand and the verifier decides.

Your lane assignment names the angles you own. Run only those.

- **Correctness** (Direct, one lane): Angles A and B.
- **Correctness-1** (Deep): Angles A and B.
- **Correctness-2** (Deep): Angles C and E.
- **Correctness-3** (Deep, only when the change activates it): Angle D and the
  Adversarial Challenge.

## Angle A — Line-By-Line Diff Scan

Read every changed hunk and flag defects visible from the hunk and its
immediate context.

- Inverted or wrong conditions, off-by-one bounds, and falsy-zero checks that
  swallow a valid value.
- Null, undefined, or nil dereference where adjacent lines show the value can be
  absent.
- Missing `await`, unhandled rejection, and forgotten error propagation.
- Wrong-variable copy-paste, shadowed names, and mismatched argument order.
- Errors swallowed in a catch that should propagate, and catches that discard
  the original cause.
- Changed conditions, state transitions, resource cleanup, and boundary inputs:
  empty, null, zero, overflow, timing, and concurrency.
- Tests and fixtures that encode an affected invariant. Flag only gaps
  introduced or exposed by the selected scope.

## Angle B — Removed-Behavior Auditor

Review what the change deleted or weakened. Removals are invisible to a reader
scanning added lines, so this angle owns them.

- For every deleted line, block, guard, branch, or check: name the invariant it
  enforced and locate where the new code re-establishes it. Flag it when nothing
  does.
- Flag removed validation, authorization checks, retries, timeouts, cleanup, and
  error handling that the replacement does not cover.
- Flag behavior narrowed by a changed default, a dropped parameter, or a
  tightened type when a real caller relied on the old range.
- Flag dead code the diff leaves behind: unreachable branches, orphaned helpers,
  and now-unused state.

## Angle C — Cross-File Tracer

Follow the change outward. This is the lane that reads surrounding files; the
others stay diff-local.

- Trace changed preconditions, return shapes, exceptions, ordering, timing, and
  ownership through direct callers and callees.
- Check whether the change breaks a caller, invariant, contract, or test that
  lives outside the diff.
- Flag contract drift: a changed producer with an unchanged consumer, a renamed
  or re-typed field with a stale reader, a serialization or persistence format
  that no longer round-trips.
- Check cross-process and cross-version contracts when the change touches an
  API, schema, queue payload, or stored shape.

## Angle D — Language And Framework Pitfalls

Inspect hazards specific to the language, runtime, and frameworks in scope.

- Missing awaits, floating promises, closure capture in loops, and mutable
  default arguments.
- Timezone and locale drift, integer and float coercion, and truthiness rules
  that differ from the author's apparent intent.
- Nil-map writes, slice aliasing, iterator invalidation, and reference-versus-
  value copies.
- Escaping, quoting, and injection at string boundaries; unsafe deserialization.
- Framework lifecycle misuse: effect dependency arrays, render-phase side
  effects, transaction and connection scope, and cleanup registration.

## Angle E — Wrapper And Proxy Correctness

Review code that stands between a caller and a real implementation: wrappers,
adapters, decorators, proxies, middleware, retries, and caches.

- Does the wrapper forward every argument, option, and context value the inner
  implementation reads?
- Does it preserve return shape, error type, cause chain, and thrown-versus-
  returned discipline?
- Does it preserve laziness, streaming, cancellation, and backpressure rather
  than silently materializing or blocking?
- Does a retry or fallback re-run a non-idempotent operation?
- Does a cache key omit an input the result depends on, or outlive the validity
  of what it stores?

## Adversarial Challenge

Run when the user requests challenge or ship-readiness, or when the change
touches auth, permissions, persisted state, irreversible operations,
concurrency, security boundaries, or migrations.

Actively try to disprove the implementation, design choices, tradeoffs, and
assumptions. Trace bad inputs, retries, concurrent actions, and partial failure.
Prioritize:

- auth, permissions, tenant isolation, and trust boundaries;
- data loss, corruption, duplication, and irreversible state changes;
- rollback safety, retries, partial failure, and idempotency;
- races, ordering assumptions, stale state, and re-entrancy;
- empty, null, timeout, and degraded-dependency behavior;
- version skew, schema drift, migrations, and compatibility regressions; and
- observability gaps that hide failure or frustrate recovery.

Keep every concern tied to a reachable path; a happy path does not disprove an
edge-case failure.

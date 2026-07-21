# Review Checklists

Apply every relevant lens to the selected scope. The owning workflow decides
whether to fix findings, return them in chat, or write an audit report.

## Compare Intent And Scope

- Map the change to the authoritative request, plan, spec, PR body, or issue.
- Flag requirements that are missing, partial, or implemented incorrectly.
- Flag behavior and complexity that no requirement or necessary invariant
  justifies.
- Cite the governing requirement for each finding. If no authoritative intent
  exists, state that limit instead of inferring one from a loosely related doc.

## Apply Repository Standards

- Compare changed code with every applicable repository and path-scoped rule.
- Cite both the changed location and the governing rule for each breach.
- Let specific repository guidance override broader guidance and generic
  heuristics.
- Skip rules already enforced by deterministic tooling; report the tool result
  under validation.

## Trace Correctness

- Trace changed conditions, state transitions, errors, cleanup, and boundary
  inputs such as empty, null, zero, overflow, timing, and concurrency.
- Check direct callers, callees, invariants, contracts, tests, and removed
  behavior when the change depends on them.
- Inspect tests and fixtures that encode the affected invariant. Flag only gaps
  introduced or exposed by the selected scope.

## Simplify Reuse

- Search shared modules, utilities, adjacent files, and the owning layer for an
  existing implementation.
- Replace new functions or inline logic that duplicate an existing owner.
- Do not extract a new abstraction merely because two snippets look similar;
  require one stable responsibility and a concrete maintenance benefit.

## Simplify Quality

- Remove redundant or derivable state, indirect effects, and duplicate caches.
- Reduce parameter sprawl when a direct call or stronger owning input is
  clearer.
- Consolidate copy-paste variants when they implement one responsibility.
- Repair leaky abstractions and keep behavior in its canonical owning layer.
- Use existing constants, enums, unions, branded types, or shared contracts
  instead of raw strings for established domain concepts.
- Remove wrappers, comments, and indirection that add no behavior, constraint,
  or explanatory value.

### Reject Over-Engineering

Over-engineering is indirection, optionality, generality, state, configuration,
compatibility, or ceremony that no current requirement or necessary invariant
justifies and that creates a concrete maintenance, runtime, or review cost.

Scan aggressively for:

- abstractions, interfaces, factories, hooks, or parameters with one real use;
- generic frameworks where direct domain code would be clearer;
- optional paths, modes, feature flags, fallbacks, and configuration for
  hypothetical needs;
- duplicated state, adapters, compatibility layers, or validation without a
  real boundary;
- helpers and wrappers that merely rename, forward, or rearrange work;
- phases, documents, schemas, or process gates whose result changes no decision;
  and
- defensive handling for states that the current contract makes impossible.

Prefer deletion, inlining, a stronger contract, or one canonical owner. Report
only when the extra machinery and its cost are visible in the selected scope;
do not equate necessary complexity or unfamiliar design with over-engineering.

### Apply Code Judo To Changed Code

Seek a smaller design that removes branches, helpers, modes, wrappers, or
fallbacks rather than redistributing them. Prefer direct, explicit code and one
canonical owner. Challenge unnecessary optionality, loose shapes, scattered
special cases, and feature-flag checks.

Accept a simplification only when it preserves intended behavior and improves
understanding, debugging, or changeability. Do not optimize for line count,
merge distinct concerns, remove a useful abstraction, or replace explicit code
with clever density. Broad structural discovery belongs to Architecture Review.

## Simplify Efficiency

- Remove redundant computation, file reads, network calls, queries, and broad
  data loads.
- Run independent work concurrently when ordering and shared state do not
  require serialization.
- Keep blocking or repeated work out of startup, request, event, and render hot
  paths.
- Preserve no-change signals so polling, reducers, and event handlers do not
  publish recurring no-op updates.
- Avoid check-then-act existence checks; perform the operation and handle its
  error.
- Bound retained collections and clean up closures, listeners, subscriptions,
  and other resources.
- Prefer one atomic operation when related updates could leave state
  half-applied.

## Add Conditional Risk Checks

Use only the checks the scope activates.

### Challenge High-Risk Behavior

Use an adversarial pass when the user requests ship-readiness or the change
touches auth, permissions, tenant isolation, persisted state, irreversible
operations, concurrency, security boundaries, or migrations.

Trace bad inputs, retries, concurrent actions, partial failure, rollback,
idempotency, stale state, empty and degraded states, version skew, schema drift,
and observability. Keep every concern tied to a reachable path.

### Trace Removed Behavior

For each deletion, identify the invariant it enforced and where the new code
re-establishes it.

### Trace Cross-File Contracts

Follow changed shapes, errors, timing, ordering, and ownership through direct
callers and callees.

### Check Language And Framework Hazards

Inspect applicable risks such as missing awaits, closure capture, mutable
defaults, timezone drift, nil-map writes, escaping, injection, or equivalent
local pitfalls.

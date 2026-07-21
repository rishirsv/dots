# Review Checklists

The parent and all three Simplify agents review the same selected scope. The
parent owns intent, standards, correctness, conditional risk checks, candidate
verification, and final classification. Each Simplify agent owns one distinct
review below.

## Shared Candidate Contract

Give every reviewer the exact scope, complete diff or artifact, changed-file
list, intent and standards authorities, allowed surrounding paths, and user
focus. Reviewers may inspect surrounding code for evidence but may not expand
the cleanup target beyond the selected scope.

Return candidates only—no edits or file dumps—and return `no findings` when
clean. Each candidate must cite its location and include:

- the observed mechanism;
- the reachable failure or concrete maintenance/runtime cost;
- the smallest safe correction; and
- the governing requirement or repository rule when one applies.

A correctness or risk candidate must explain what can go wrong, why the path is
vulnerable, and the likely impact. A Simplify candidate must identify the exact
duplication, quality problem, or inefficiency and why changing it is worth the
risk. Label material inference and reject unsupported concerns.

## Parent Review

### Intent and Scope Conformance

- Map the change to the authoritative request, plan, spec, PR body, or issue.
- Flag requirements that are missing, partial, or implemented incorrectly.
- Flag behavior or complexity that no requirement or necessary invariant
  justifies.
- Cite the governing requirement. If authoritative intent is unavailable,
  state that limit instead of inferring requirements from a loosely related doc.

### Repository Standards Review

- Compare every changed file with applicable repository and path-scoped rules.
- Cite both the changed location and the governing rule for each breach.
- Let specific repository guidance override broader guidance and generic
  heuristics.
- Skip rules already enforced by deterministic tooling; report those failures
  under validation.

### Correctness Review

- Trace changed conditions, state transitions, errors, resource cleanup, and
  boundary inputs such as empty, null, zero, overflow, timing, and concurrency.
- Check whether the change breaks a caller, invariant, contract, or test. For
  each deletion, identify the invariant it enforced and where the new code
  re-establishes it.
- Follow changed preconditions, return shapes, exceptions, ordering, timing,
  and ownership through direct callers and callees when the behavior depends on
  them.
- Inspect tests and fixtures that encode the affected invariant. Flag only gaps
  introduced or exposed by the selected scope.

### Add Conditional Correctness Checks

Run only the checks activated by the change.

#### Adversarial Challenge

Use an adversarial pass when the user requests challenge or ship-readiness, or
when the change touches auth, permissions, persisted state, irreversible
operations, concurrency, security boundaries, or migrations.

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

#### Language and Framework Hazards

Inspect applicable risks such as missing awaits, closure capture, mutable
defaults, timezone drift, nil-map writes, escaping, injection, or equivalent
local pitfalls.

## Simplify Agent 1: Reuse Review

Find behavior that should use one existing or shared owner.

1. Search shared modules, utility directories, adjacent files, and the current
   owning layer for code that already performs the new behavior.
2. Flag new functions that duplicate existing functionality and identify the
   function or owner that should replace them.
3. Flag inline reimplementations of repository-standard operations, including
   string transformation, path handling, environment detection, type guards,
   parsing, and formatting.
4. Flag copy-paste and near-duplicate blocks that implement one stable
   responsibility with slight variation.

Do not create an abstraction merely because two snippets look similar. Require
one stable responsibility and a concrete maintenance benefit.

## Simplify Agent 2: Quality Review

Find unnecessary state, weak boundaries, and avoidable complexity.

### Review State and API Shape

- Remove duplicated or derivable state, redundant caches, and observers or
  effects that can be direct calls.
- Reduce parameter sprawl when a direct call, stronger owning input, or clearer
  model removes the extra parameters.
- Repair leaky abstractions. Keep feature behavior in its canonical owning
  layer; do not leak it into shared infrastructure or expose implementation
  details through public boundaries.
- Replace raw strings with existing constants, enums, string unions, branded
  types, or shared contracts for established domain concepts.
- Remove JSX wrappers that add no layout or behavior when the inner component
  already exposes the required props.
- Remove comments that restate code, narrate the change, or refer to the task or
  caller. Preserve non-obvious constraints, invariants, and required
  workarounds.

### Run The Over-Engineering Scan

Over-engineering is indirection, optionality, generality, state, configuration,
compatibility, or ceremony that no current requirement or necessary invariant
justifies and that creates a concrete maintenance, runtime, or review cost.

Scan aggressively for:

- abstractions, interfaces, factories, hooks, or parameters with one real use;
- generic frameworks where direct domain code would be clearer;
- optional paths, modes, fallbacks, and configuration for hypothetical needs;
- adapters, compatibility layers, or validation without a real boundary;
- pass-through helpers, identity wrappers, and mechanisms that merely rename,
  forward, or rearrange work;
- silent fallbacks and generic mechanisms that hide simple assumptions;
- loose object shapes, cast-heavy boundaries, and unclear invariants that a
  stronger current contract would remove;
- scattered special cases that one state model, policy, dispatcher, or owner
  could replace;
- feature flags treated as permanent architecture, especially deep or
  scattered checks without an explicit cleanup boundary; treat flags as
  temporary deployment mechanisms;
- phases, documents, schemas, or process gates whose result changes no
  decision; and
- defensive handling for states the current contract makes impossible.

Do not equate necessary complexity or unfamiliar design with over-engineering.
Keep only candidates whose extra machinery and cost are visible in scope.

### Apply Code Judo

For changed code, seek a behavior-preserving reframing that removes whole
branches, helpers, modes, conditionals, wrappers, layers, or fallbacks. Prefer
direct, explicit, boring code and one canonical owner over brittle or magical
machinery. Prefer deletion, inlining, or a stronger contract to another layer.

Accept a simplification only when it preserves intended behavior and improves
understanding, debugging, or changeability. Do not optimize for line count,
combine distinct concerns, remove a useful abstraction, or replace explicit
code with clever density. Broad structural discovery and new seam design belong
to Architecture Review.

## Simplify Agent 3: Efficiency Review

Find avoidable work, coordination, and resource cost.

### Review Work and Concurrency

- Remove redundant computation, repeated file reads, duplicate network or API
  calls, N+1 patterns, and repeated scans.
- Bound file, collection, payload, and dependency-graph reads to what the
  operation needs.
- Run independent operations concurrently when neither state nor ordering
  requires serialization.
- Keep new blocking or repeated work out of startup, request, event, and render
  hot paths.

### Review Updates, Resources, and Atomicity

- Stop polling loops, intervals, and event handlers from publishing updates
  when nothing changed. Preserve the local no-change signal and verify that
  updater or reducer wrappers honor same-reference returns or the repository's
  equivalent contract.
- Avoid check-then-act existence checks and their race. Perform the operation
  and handle its error.
- Bound retained structures and prevent leaks by cleaning up closures,
  listeners, subscriptions, and other resources.
- Prefer one atomic operation when related updates could leave state
  half-applied.

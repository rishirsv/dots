# Efficiency Lane

Find avoidable work, coordination, and resource cost in the selected scope.
Run both sections.

## Review Work And Concurrency

- Remove redundant computation, repeated file reads, duplicate network or API
  calls, N+1 patterns, and repeated scans.
- Bound file, collection, payload, and dependency-graph reads to what the
  operation needs.
- Run independent operations concurrently when neither state nor ordering
  requires serialization.
- Keep new blocking or repeated work out of startup, request, event, and render
  hot paths.

## Review Updates, Resources, And Atomicity

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

Skip speculative micro-optimization. Every candidate needs a concrete cost that
is visible in the selected scope.

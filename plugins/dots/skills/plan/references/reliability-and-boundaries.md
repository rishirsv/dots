# Plan reliability and external boundaries

Read this when a plan crosses an external or asynchronous boundary or clearly
changes performance, security, or privacy.

## External and asynchronous work

Trace the triggering event, each handoff, the state change, visible result, and
failure or recovery path. Define relevant timeout, retry, cancellation,
stale-result protection, idempotency, partial success, and observability
behavior. Name what remains visible or recoverable when a downstream service
or component fails.

## Performance

State relevant query or work bounds, expected operation count, batching, lazy
loading, index expectations, and evidence budgets. Require query plans or
measurements before adding an index, cache, persisted summary,
background process, compatibility layer, or generic framework.

## Security and privacy

Name trust boundaries, authorized actors, data classification and handling,
least-privilege access, external disclosure, abuse cases, and audit or deletion
obligations introduced by the change. Tie each constraint to the code or service
that enforces it and say what failure looks like, rather than listing generic
security goals.

## Readiness

- Are cross-owner handoffs, failures, recovery, and observability defined?
- Are bounds, budgets, batching, and evidence for new indexes or caches stated?
- Are access, trust, data handling, and abuse constraints explicit where they
  change?

# Plan data and state

Read this when a plan changes persistence, identity, aggregation, ordering,
state composition, or migration.

## Define the data

Include proposed structures or the smallest equivalent pseudocode. Cover the
relevant persisted entities, repository or query APIs, read models, state
enums, stable identifiers, ordering and aggregation rules, calendar and
time-zone boundaries, failure semantics, migration, repair, and rollback.

Keep stored data, domain facts, and presentation summaries in the layers that
already handle them. Repositories should return stable records or well-defined
domain results rather than models shaped for one screen. Derive presentation
summaries without persisting them unless the existing design requires it.

Distinguish zero, missing, unavailable, failed, stale, and deleted states when
the system treats them differently. Use stable field or record identifiers for
logic rather than display names, formatted values, or approximate timestamps.

## Close summary and ordering rules

For each record family, state what root and detail surfaces show; whether values
sum, select a latest record, remain separate, or become a count; how malformed
or incomplete values behave; how equal-looking records retain identity; the
stable order; and what future unsupported types do. Use typed summary cases when
families have different semantics.

## Define state and migration behavior

Name the relevant loading, empty, content, partial, unavailable, failed,
stale-result, mutation-success, and mutation-failure states. State what remains
visible after partial failure and where recovery lives. A failed read is not an
empty state and a malformed value is not zero.

For schema or data rewrites, define invariants, compatibility window, cutover,
repair, rollback, and the owner of each transition. Account for existing data
and mixed-version operation instead of describing only the final schema.

## Readiness

- Is there one clear place that writes each record?
- Are stable identifiers and relevant calendar boundaries defined?
- Are summary, malformed-value, identity, and ordering rules closed?
- Are structures, compatibility, repair, and rollback concrete enough to review?
- Are reachable empty, partial, unavailable, failed, stale, and recovery states
  distinct?

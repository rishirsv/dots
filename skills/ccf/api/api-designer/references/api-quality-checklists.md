# API Task Quality Checklists

Use these checklists to decide which details belong in the API task artifact. Evaluate every checklist, but emit only the notes that are relevant to the task.

## API Definition Checklist

Always verify:

- the endpoint matches the feature flow and task scope
- the task clearly states `Streaming` or `Non-streaming`
- request and response types live under `shared-types`
- existing shared field names are reused where semantics match
- breaking contract changes are called out explicitly
- actual current shared-types and API registration files were inspected before proposing new names or reuse paths

Add design detail when relevant:

- request normalization rules
- response shape guarantees
- streamed event ordering or chunk semantics
- pagination, payload-size, or request-size constraints

## Business Logic Checklist

The `Business logic sequence` must cover:

- input normalization
- dependency calls to shared libraries, repositories, or external integrations
- decision points and branching rules
- response construction

Add more detail when relevant:

- idempotency or concurrency expectations
- transactional boundaries
- sequencing constraints across repository and integration calls

## Auth And Security Checklist

Always verify:

- whether the existing JWT middleware is sufficient
- whether endpoint-specific authorization rules exist
- whether tenant or partition boundaries must be enforced

Add notes only when relevant:

- claims or roles required by the endpoint
- service-to-service auth or API key handling
- data-scope enforcement beyond repo defaults

## Error Handling Checklist

Always verify:

- validation failures
- authorization failures when auth is in scope
- dependency or persistence failures
- any feature-specific conflict or retry condition

Add notes only when relevant:

- explicit status codes that clients depend on
- structured error payload expectations
- retry guidance for transient failures
- UI-facing error codes exist for functional, application, and DB failures
- `errType: general` is reserved for internal server or orchestration failures that are not domain-specific or DB-specific

## Logging And Telemetry Checklist

Always verify:

- which success and failure events merit structured logs
- whether trace propagation or request correlation needs to be mentioned
- whether sensitive fields must be excluded from logs

Add notes only when relevant:

- domain-specific telemetry counters or timings
- audit-style logging requirements

## Compatibility And Performance Checklist

Always verify:

- backward compatibility for existing consumers
- payload size, request size, or latency concerns
- whether repo defaults such as compression and `Cache-control: no-store` are sufficient

Add notes only when relevant:

- rollout or migration cautions
- cache strategy changes
- endpoint-specific request size overrides
- rate limiting for expensive or abuse-prone endpoints

## Config And Open Questions Checklist

Add `## Additional notes` entries when the task depends on:

- new configuration or environment variables
- unresolved product rules that affect contract or branching behavior
- external integration assumptions

Do not invent missing product decisions. Record the assumption and the open question instead.

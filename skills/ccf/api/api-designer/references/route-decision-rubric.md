# API Task Scoping Rubric

Use this rubric to shape one API task that matches the `solution-designer` task model.

## Task Type

### `API / API method`

Choose this by default when the task extends an existing deployed API service.

Common signals:

- the route belongs in an existing API app such as `api1`
- the task adds or changes one endpoint within an existing service boundary
- the work reuses the current middleware, auth, and registration stack

### `API / API Service`

Choose this only when the task needs a distinct service boundary.

Common signals:

- the feature needs a dedicated deployment or scaling profile
- the feature belongs to a separate functional domain with its own operational lifecycle
- the task cannot fit cleanly into the existing API registration model without creating an artificial dependency

Do not use `API / API Service` just because the logic is substantial.

## Route Classification

Classify the task as exactly one of:

- `new endpoint`
- `existing contract change`
- `existing behavior change`

### `new endpoint`

Use this when the task introduces a route that does not already exist.

Required design coverage:

- endpoint path and route ownership
- request type
- response type for non-streaming routes
- streamed behavior contract for streaming routes
- handler orchestration summary

### `existing contract change`

Use this when the route already exists but the external request, response, or streamed behavior changes.

Required design coverage:

- current vs proposed contract summary
- compatibility risk
- downstream consumer impact
- any schema migration or rollout caution

### `existing behavior change`

Use this when the route stays externally compatible but its internal logic changes.

Required design coverage:

- unchanged external contract
- internal business logic delta
- persistence, service, auth, or config impact
- any hidden contract drift that would force reclassification to `existing contract change`

Output reminder:

- set `Contract continuity` to `external contract unchanged`

## Split Rules

Split into multiple API tasks immediately when any of these are true:

- more than one endpoint is required for an `API / API method` task
- the task spans more than one primary entity and action
- the task spans more than one external integration or service boundary
- the task mixes a command flow and a read flow that can be implemented independently

If a scope violates these rules, split it before writing the final artifact.

## Streamability Decision

Mark the task as `Streaming` only when the feature needs:

- incremental delivery to the client
- long-running work where early partial output matters
- progressive export or download behavior
- large result delivery that should not be buffered into one response

Mark the task as `Non-streaming` for normal bounded request-response interactions such as:

- create
- read
- update
- delete
- short synchronous commands
- configuration fetches

## Type Reuse Rule

Before proposing a new request or response type:

- inspect existing shared payload concepts
- reuse matching property names and schema fragments when semantics align
- prefer extension or composition over near-duplicate types
- introduce a new shared type only when reuse would be misleading or unstable

## Assumption Rule

If inputs are incomplete:

- continue with the smallest defensible task design
- state assumptions explicitly
- attach the uncertainty to `## Additional notes`

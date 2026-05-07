# Verify Design

Choose the lightest honest verification model.

## Preferred order

1. scalar metric
2. binary pass or fail command
3. composite checklist
4. binary judge

## Scalar metrics

Use when the task has a real number:

- runtime
- bundle size
- coverage
- throughput
- token count

## Binary checks

Use when the task is fundamentally pass or fail:

- tests pass
- build succeeds
- file exists
- schema validates

## Composite checks

Use when completion matters more than optimization.

Example:

- required artifact exists
- validation passes
- guard checks still pass

## Judge-backed checks

Use only when code cannot decide the outcome.

Rules:

- keep them binary
- define pass and fail clearly
- include real examples when practical

## Bad verification patterns

- “looks good”
- “seems improved”
- “probably more maintainable”
- numbers invented only to make the loop feel rigorous

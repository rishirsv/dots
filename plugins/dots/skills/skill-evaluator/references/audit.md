# Audit an evaluation

Use this branch for a read-only diagnosis of an existing suite, grader, run, or
evaluation process. This is not a static review of the target skill.

## Inspect the system

Trace the stated goal through cases, fixtures, configurations, workers, graders,
reviews, aggregates, and conclusions. Check:

- whether cases come from real work, accepted outputs, or observed failures;
- coverage, sampling, boundaries, near misses, holdouts, and stale cases;
- objective checks versus semantic judges;
- false acceptance, false rejection, leakage, weak criteria, and hidden taste;
- grader calibration, label quality, splits, and model or prompt drift;
- worker isolation, reset, configuration fidelity, and invalid-run handling;
- whether the human saw complete relevant evidence in a suitable interface;
- dependency hashes, freshness, and immutable run reconstruction; and
- whether aggregate metrics conceal important failure modes or missing trials.

Use [Grading](grading.md) for judge-specific defects and [Artifacts](artifacts.md)
for schema, approval, or freshness defects.

## Return findings

Lead with actionable defects ordered by impact. For each, identify the
conclusion it weakens, exact evidence, likely consequence, and smallest
correction. Add a short coverage note for what is sound. Update evaluation
artifacts only when the user requests it. Use `skill-standards` to change the
target skill.

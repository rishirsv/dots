# Context Development Archetypes

Use these archetypes as starting points, not fixed bundles. A file still needs a role: `target`, `source`, `validation`, `constraint`, or `risk`.

## Plan Or Spec Improvement

Look for the seed plan/spec, target implementation files, source-of-truth docs/config, nearby tests or fixtures, repo instructions, relevant changed files or selected patch excerpts, and commands that would verify the final plan. Exclude broad docs, generated mirrors, and unrelated dirty files unless the plan explicitly depends on them.

## Adversarial Review

Look for changed files, one-hop callers/callees, tests, constraints, risk areas, prior failures, logs, and the dirty-state boundary. Include enough source to challenge the proposed change, but do not package the whole feature area just because a bug might exist somewhere nearby.

## Research Or Current-Source Check

Package the exact question, local assumptions, claims to verify, source requirements, freshness boundary, and local docs only as background. Ask the assisting model to separate external/current-source claims from local repo claims.

## Implementation Design

Look for entrypoints, existing local patterns, config/schema, tests or fixtures, docs/specs, constraints, non-goals, and migration or compatibility boundaries. Include examples only when they are patterns to imitate or avoid.

## Post-Assist Adoption Review

Package the returned answer, original task, named repo claims, local files or commands needed to verify those claims, user constraints, and missing context. Treat the assist answer as hypotheses until local evidence supports them.

## Deterministic Helper Boundaries

Packaging helpers may expand globs, preview selected and skipped files, estimate size, report sensitive-looking skips, show dirty-state facts, and validate that authored map entries mention included paths. They should not claim to discover semantic relevance, infer source authority, auto-prune by meaning, or decide that context is sufficient.

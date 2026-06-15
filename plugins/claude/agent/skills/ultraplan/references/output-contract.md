# Ultraplan Output Contract

Read this before synthesis and before reviewing the upgraded plan.

## Upgraded Plan

Return the complete upgraded document in the same format as the input.

For HTML:

- preserve the outer scaffold, style, and script blocks unless a confirmed
  finding requires changing them
- change the plan content, not the visual system
- keep one `<main>` and valid closing tags

For Markdown:

- preserve the heading style and document spine
- rewrite only sections that confirmed findings or the winning design require
- keep tables and code fences readable in plain Markdown

## Required Semantics

The exact heading names can adapt to the input format, but the upgraded plan
must contain these semantics in reader order:

1. honest masthead or metadata with no false done-states
2. brief for the implementing agent, including do/do-not constraints
3. target architecture or ownership model
4. preflight gate with exact commands and expected observations
5. ordered step or PR map
6. per-step sections with scope in/out, contracts, tests, and verification
7. global implementation rules
8. verification matrix
9. final acceptance criteria
10. open decisions or future work when a tempting feature is explicitly deferred

## Transformation Rules

- Convert false premises into owned precondition steps.
- Convert "implement X" to "reuse/surface existing X" when a working owner
  exists.
- Split risky version, SDK, dependency, or toolchain changes into an isolated
  gate unless the plan proves the feature truly requires them.
- Replace naive moves across layers with wrap/adapter/projection designs when
  transitive references would create cycles.
- Keep refuted findings out of the plan body.
- Preserve unchanged working sections. Do not rewrite for style alone.
- Carry only the winning design plus approved grafts; losing alternatives stay
  in the changelog.

## Density

- Keep each step section about one screen when possible.
- Prefer tables, typed signatures, and command blocks over long prose.
- Cite paths, symbols, and commands for load-bearing repo claims.
- Use line numbers only when they help at plan time; prefer symbols for durable
  references because lines drift.
- Omit raw transcripts, chain-of-thought, speculative abstractions, and
  alternatives the judge rejected.

## Changelog

Write a sibling Markdown changelog with:

1. `Verdict`: two or three sentences on the plan's health after the pass
2. `Confirmed changes applied`: grouped by lens with problem, evidence, change
3. `Refuted / not changed`: raised findings deliberately excluded and why
4. `Chosen re-scoping`: winner, why it won, and grafts
5. `Open decisions for the human`: product, privacy, release, or ownership calls
   the repo could not settle

The changelog is where the reader sees rejected claims and losing designs. The
upgraded plan should stay executable and focused.

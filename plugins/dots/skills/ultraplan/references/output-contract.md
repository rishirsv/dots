# Ultraplan Output Contract

Read this before synthesis and before reviewing the upgraded plan.

## Created Plan

For a fresh plan, follow Codex Plan Mode format. The final official plan must be
plan-only, concise by default, decision-complete, and wrapped in exactly one
`<proposed_plan>` block.

Tag rules:

1. put `<proposed_plan>` on its own line
2. start Markdown plan content on the next line
3. put `</proposed_plan>` on its own line
4. keep the tag names exactly as written
5. produce at most one proposed-plan block per turn

Default structure:

```md
<proposed_plan>
# <Clear Title>

## Summary
- <goal, desired outcome, and chosen approach>

## Implementation Changes
- <grouped by subsystem or behavior>

## Test Plan
- <automated checks and manual scenarios>

## Assumptions
- <explicit defaults chosen where needed>
</proposed_plan>
```

Include important public API, interface, type, data, migration, compatibility,
or rollout notes inside `Implementation Changes` when they matter. Add a
separate `Scope` section only when scope boundaries are genuinely needed to
avoid implementation mistakes.

Prefer behavior-level bullets over file-by-file inventories. Mention files only
when needed to disambiguate a non-obvious change, and avoid naming more than
three paths unless extra specificity is necessary to prevent mistakes. Keep
bullets short and avoid explanatory sub-bullets unless they prevent ambiguity.

For v1 feature-addition plans, do not invent detailed schema, validation,
precedence, fallback, or wire-shape policy unless the request establishes it or
it is needed to prevent a concrete implementation mistake. For straightforward
refactors, keep the plan to summary, key edits, tests, and assumptions.

Do not leave unresolved open questions in the plan body. If a decision blocks a
complete plan, ask before writing or record the recommended default only after
the user accepts it. Do not ask whether to proceed in the final output.

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

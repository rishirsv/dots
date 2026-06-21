# Ultraplan Output Contract

Read this before synthesis and before reviewing a created or upgraded plan.

## Standard Plan

For a fresh plan, output concise Markdown by default. The final plan should be
plan-only, decision-complete, and implementation-ready.

Default structure:

```md
# <Clear Title>

## Outcome
- <what will be true when this is done>

## Approach
- <chosen implementation path and key sequencing dependency>

## Steps
1. <first concrete slice>
   - Change: <what to change>
   - Verify: <how to prove this slice>

2. <next concrete slice>
   - Change: <what to change>
   - Verify: <how to prove this slice>

## Validation
- Automated: <commands/checks>
- Manual: <screens, workflows, review, or proof limits>

## Assumptions / Deferrals
- <explicit defaults chosen, or tempting work intentionally deferred>
```

Do not wrap the plan in runtime-specific XML or tags unless the active runtime
explicitly requires it. If a wrapper is required, treat it as transport, not as
the portable skill contract.

Start with the executable plan, not the audit trail. Do not add masthead
sections such as `Ultraplan Run`, `Grounded Current State`, `Target Standard`,
or `Scope` by default. The implementing agent should reach the outcome,
approach, and first step quickly.

Use extra sections only when they materially prevent mistakes:

| Add this section | When to include it |
| --- | --- |
| `Current State` | The implementation would otherwise start from a false premise, stale artifact, or confusing repo state. Keep it to facts that change the plan. |
| `Target Standard` | The task changes a design-system rule, architecture contract, naming vocabulary, policy, or reusable primitive. |
| `Scope` | Adjacent work is tempting enough that excluding it changes implementation behavior. |
| `Read Gates` | Specific repo instructions, skills, docs, or external references must be loaded before implementation. |
| `Owners` | Ownership is cross-module, non-obvious, or needed to prevent duplicate work. |
| `Artifacts` | The plan is persisted, resumed across sessions, or intentionally produces evidence files. |

Include important public API, interface, type, data, migration, compatibility,
or rollout notes inside the relevant step unless they cut across the whole
plan. Keep audit evidence out of the opening; cite it inline where it changes a
step or put it in a short appendix for persisted plans.

Prefer behavior-level bullets over file-by-file inventories. Mention files only
when needed to disambiguate a non-obvious change, and avoid naming more than
three paths unless extra specificity is necessary to prevent mistakes.

For v1 feature-addition plans, do not invent detailed schema, validation,
precedence, fallback, or wire-shape policy unless the request establishes it or
it is needed to prevent a concrete implementation mistake. For straightforward
refactors, keep the plan to outcome, approach, steps, validation, and
assumptions/deferrals.

Do not leave unresolved open questions in the plan body. If a decision blocks a
complete plan, ask before writing or record the recommended default only after
the user accepts it.

## Upgraded Plan

Return the complete upgraded document in the same format as the input.

For HTML:

- preserve the outer scaffold, style, and script blocks unless a confirmed
  finding requires changing them
- change the plan content, not the visual system
- keep one `<main>` when the input had one and keep valid closing tags

For Markdown:

- preserve the heading style and document spine
- rewrite only sections that confirmed findings or the chosen re-scope require
- keep tables and code fences readable in plain Markdown

## Required Semantics

The exact heading names can adapt to the input format, but the upgraded plan
must contain these semantics in reader order:

1. honest masthead or metadata with no false done-states
2. brief for the implementing agent, including do/do-not constraints
3. target architecture or ownership model when the plan changes ownership
4. preflight gate with exact commands and expected observations when needed
5. ordered step or PR map
6. per-step sections with scope in/out, contracts, tests, and verification
7. global implementation rules only when they prevent repeated mistakes
8. verification matrix or concise validation section
9. final acceptance criteria
10. open decisions or future work when a tempting feature is explicitly deferred

## Transformation Rules

- Convert false premises into owned precondition steps.
- Convert "implement X" to "reuse/surface existing X" when a working owner
  exists.
- Remove, defer, or narrow abstractions, compatibility shims, generic schemas,
  framework work, or broad refactors that do not serve the current goal.
- Split risky version, SDK, dependency, schema, or toolchain changes into an
  isolated gate unless the plan proves the feature truly requires them.
- Replace naive moves across layers with wrap, adapter, or projection designs
  when transitive references would create cycles.
- Keep refuted findings out of the plan body.
- Preserve unchanged working sections. Do not rewrite for style alone.
- Carry only the chosen design plus approved grafts; losing alternatives stay in
  the changelog.

## Density

- Keep each step section about one screen when possible.
- Prefer short tables, typed signatures, and command blocks over long prose.
- Use tables for comparison matrices, rule matrices, and acceptance criteria;
  use grouped bullets for completion summaries and handoffs.
- Cite paths, symbols, and commands for load-bearing repo claims.
- Use line numbers only when they help at plan time; prefer symbols for durable
  references because lines drift.
- Omit raw transcripts, chain-of-thought, speculative abstractions, and
  alternatives the judge rejected.

## Changelog

Write a sibling Markdown changelog for upgraded plans with:

1. `Verdict`: two or three sentences on the plan's health after the pass
2. `Confirmed changes applied`: grouped by lens with problem, evidence, change
3. `Refuted / not changed`: raised findings deliberately excluded and why
4. `Chosen re-scoping`: only when a re-scope was needed
5. `Open decisions for the human`: product, privacy, release, or ownership calls
   the repo could not settle

The changelog is where the reader sees rejected claims and losing designs. The
upgraded plan should stay executable and focused.

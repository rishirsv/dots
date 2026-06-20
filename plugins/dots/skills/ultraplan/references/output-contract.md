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
</proposed_plan>
```

Start with the executable plan, not the audit trail. Do not add masthead
sections such as `Ultraplan Run`, `Grounded Current State`, `Target Standard`,
or `Scope` by default. The implementing agent should reach the outcome,
approach, and first step quickly.

Use extra sections only when they materially prevent mistakes:

| Add this section | When to include it |
| --- | --- |
| `Current State` | The implementation would otherwise start from a false premise, stale artifact, or confusing repo state. Keep it to the facts that change the plan. |
| `Target Standard` | The task changes a design-system rule, architecture contract, naming vocabulary, policy, or reusable primitive. |
| `Scope` | Adjacent work is tempting enough that excluding it changes implementation behavior. |
| `Read Gates` | Specific repo instructions, skills, docs, or external references must be loaded before implementation. |
| `Owners` | Ownership is cross-module, non-obvious, or needed to prevent duplicate work. |
| `Decision Log`, `Progress`, `Recovery`, or `Artifacts` | The plan is long-running, persisted, resumed across sessions, or intentionally ExecPlan-style. |

When a section is needed, place it where it supports execution. Prefer:

1. `Outcome`
2. `Approach`
3. optional `Current State` or `Target Standard`
4. optional `Scope` or `Read Gates`
5. `Steps`
6. `Validation`
7. `Assumptions / Deferrals`

Include important public API, interface, type, data, migration, compatibility,
or rollout notes inside the relevant step unless they cut across the whole
plan. Keep audit evidence out of the opening; cite it inline where it changes a
step or put it in a short appendix for persisted plans.

Prefer behavior-level bullets over file-by-file inventories. Mention files only
when needed to disambiguate a non-obvious change, and avoid naming more than
three paths unless extra specificity is necessary to prevent mistakes. Keep
bullets short and avoid explanatory sub-bullets unless they prevent ambiguity.

For v1 feature-addition plans, do not invent detailed schema, validation,
precedence, fallback, or wire-shape policy unless the request establishes it or
it is needed to prevent a concrete implementation mistake. For straightforward
refactors, keep the plan to outcome, approach, steps, validation, and
assumptions/deferrals.

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

# Ultraplan Output Contract

Read this before synthesis and before reviewing a created or upgraded plan.

## Delivery Default

Default to writing the full plan as a durable artifact using the repo's plans
convention. Inspect repo instructions, planning docs, and existing plan
locations before choosing the path. If no convention is discoverable, use the
repo's active planning area when one exists; otherwise state that no convention
was found and ask only if the destination is genuinely blocking.

The chat response should be a concise Markdown summary, not the full plan. It
should include the artifact path, the core approach, important context checked,
open decisions or proof limits, and the next gate. Keep internal planning depth,
agent counts, and critique mechanics out of the chat unless they change what the
user should do next.

## New Plan

For a new plan, write the complete plan to the saved artifact by default. The
final plan should be plan-only, decision-complete, and implementation-ready. For
non-code work, keep the same shape but describe steps and verification in domain
terms rather than files and commands.

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
sections such as `Ultraplan Run` by default. The implementing agent should reach
the outcome, approach, and first step quickly.

Use extra sections only when they materially prevent mistakes:

| Add this section | When to include it |
| --- | --- |
| `Current State` | The implementation would otherwise start from a false premise, stale artifact, or confusing repo state. Keep it to facts that change the plan. |
| `Context Checked` | The plan depends on repo docs, feature-building guidance, screenshots, external docs, or subagent research. Keep this short and source-oriented. |
| `Target Standard` | The task changes a design-system rule, architecture contract, naming vocabulary, policy, or reusable primitive. |
| `Contracts` | Data, API, state, routing, persistence, sync, or platform contracts must be designed before implementation starts. |
| `Visual Target` | UI direction, current screens, mockups, Image Gen concepts, or visual comparison shape implementation. |
| `Scope` | Adjacent work is tempting enough that excluding it changes implementation behavior. |
| `Read Gates` | Specific repo instructions, skills, docs, or external references must be loaded before implementation. |
| `Owners` | Ownership is cross-module, non-obvious, or needed to prevent duplicate work. |
| `Artifacts` | The plan is persisted, resumed across sessions, or intentionally produces evidence files. |

Include important public API, interface, type, data, migration, compatibility,
or rollout notes inside the relevant step unless they cut across the whole
plan. Keep audit evidence out of the opening; cite it inline where it changes a
step or put it in a short appendix for persisted plans.

Prefer behavior-level steps, but include file paths, symbols, contracts, state
details, and verification detail whenever they prevent implementation mistakes.

For v1 feature-addition plans, include detailed schema, validation, precedence,
fallback, or wire-shape policy only when the request establishes it or it is
needed to prevent a concrete implementation mistake.

Do not leave unresolved open questions in the plan body. If a decision blocks a
complete plan, ask before writing or record the recommended default only after
the user accepts it.

## Upgraded Plan

For an existing-plan upgrade, return the complete upgraded document in the same
format as the input.

For HTML:

- preserve the outer scaffold, style, and script blocks unless a confirmed
  finding requires changing them
- change the plan content, not the visual system
- keep one `<main>` when the input had one and keep valid closing tags

For Markdown:

- preserve the heading style and document spine
- rewrite only sections that confirmed findings or the chosen simplification require
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

## Detail

- Do not cap plan length. Write the detail the implementing agent needs.
- Prefer complete, explicit steps over brevity when the work is complex.
- Use tables, typed signatures, command blocks, state matrices, contracts, and
  acceptance criteria when they make the plan easier to execute.
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
4. `Chosen simplification`: only when the plan needed meaningful narrowing or a
   different implementation path
5. `Open decisions for the human`: product, privacy, release, or ownership calls
   the repo could not settle

The changelog is where the reader sees rejected claims and losing designs. The
upgraded plan should stay executable and focused.

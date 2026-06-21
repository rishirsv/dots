# Ultraplan Workflow

Read this for the route topology, role contracts, review lenses, and synthesis
rules. Keep analysis roles read-only until synthesis writes plan artifacts.

## Route Topology

### Standard Plan

Use when there is no existing plan to upgrade.

```text
Read context -> Ground repo -> Map current state -> Check plan shape
  -> Choose approach -> Write plan -> Validate -> Handoff
```

This route normally uses no subagents. The parent agent does the planning work
and checks the draft against the same review pressure used by Ultra Plan:
premise, sequencing, reuse, ownership, testability, risk, and overengineering.

Use one read-only explorer only when repo exploration is too broad for the main
context to carry cleanly. The explorer returns facts and likely owners; the
parent still chooses the approach and writes the plan.

### Capped Ultra Plan

Use when an existing plan, spec, or design doc should be upgraded.

```text
Parent seed-grounding
  -> Subagent 1: Repo mapper
  -> Subagent 2: Adversarial reviewer
  -> Parent verification/refutation
  -> Optional Subagent 3: Rescope designer
  -> Parent synthesis: upgraded plan + changelog
  -> Parent validation and handoff
```

Default to two subagents. Add the third only when verified findings imply
competing plan shapes, a major ownership shift, or a meaningful simplification
decision. Never exceed three subagents.

## Seed Grounding

Before subagents, run a small read-only grounding pass:

- read repo instructions and the plan
- search for artifacts the plan asserts are done, moved, required, or absent
- check current toolchain/dependency/version claims when they matter
- capture commands and paths, not impressions

Pass seeds as:

```text
Seed observations (VERIFY against the repo with search/file reads/git; do not trust blindly):
<facts with commands or paths>
```

## Roles

### Repo Mapper

Mission: faithful structured map plus first-pass grounding.

Input: plan path, repo root, seed observations.

Prompt shape:

```text
You are mapping a plan/spec/design document before an ultra-planning critique.
Read it in full: <PLAN>
Repo root: <REPO>. Ground claims with search, file reads, git, tests, or docs.

<SEED>

Return a concise map:
1. Step structure: each step id, title, one-line scope.
2. Load-bearing assumptions the plan states or relies on.
3. Concrete repo claims and whether they match the current repo.
4. Existing owners or implementations the plan should reuse.
5. Internal contradictions or missing preconditions.

Be specific with section ids, file paths, symbols, and commands. Do not propose
style edits. Do not modify files.
```

### Adversarial Reviewer

Mission: strongest plan-changing findings across all lenses, including
overengineering.

Input: plan path, repo root, seed observations, mapper output.

Prompt shape:

```text
You are adversarially reviewing an implementation plan. Read the plan:
<PLAN>. Repo root: <REPO>. Ground findings with search, file reads, git, tests,
or docs.

<SEED>

MAPPER OUTPUT:
<MAP>

Find the strongest real, specific problems across these lenses:
- premise integrity
- sequencing and dependencies
- reuse before build
- ownership and boundaries
- testability and proof
- risk and failure modes
- overengineering and unnecessary complexity

Rules:
- Ground each finding in repo evidence. If you could not verify, say so and
  lower severity.
- Be concrete: name the section/step and give a plan change.
- Quality over quantity: return at most 8 findings, ranked by implementation
  impact.
- Prefer findings that reduce or re-own scope: false done-states, reuse traps,
  hidden coupling, unneeded dependency/toolchain moves, verification gaps, and
  abstractions or shims without current producers and consumers.
- Do not invent problems to justify the pass.
```

Default lenses:

| Key | Focus |
|---|---|
| `premise` | False or stale assumptions vs the current repo. Flag anything asserted as done, landed, or already present without ownership. |
| `sequencing` | Step order, prerequisites, missing owners for assumed preconditions, dependency on out-of-scope work, and blast radius. |
| `reuse` | Work that already exists. For every "implement X", search for a working owner and recommend reuse or surfacing. |
| `ownership` | One canonical owner, target/module edges, transitive references, dependency cycles, and lower layers staying free of upper-layer types. |
| `testability` | Whether each step is provable in the current environment, has producer and consumer, and names runnable verification commands. |
| `risk` | Concrete failure modes with evidence: shipping, CI, schema/version, environment mismatch, silent breakage, or irreversible actions. |
| `overengineering` | Abstractions, adapters, compatibility shims, generic schemas, framework work, or broad refactors that exceed the current goal. |

### Parent Verifier

Mission: try to refute selected findings before they can change the plan.

Run this in the parent by default so the final author owns the evidence. Use an
independent verifier subagent only if that is the best use of the third subagent.

Verification rule:

```text
Default to real=false unless evidence clearly holds.
For each selected finding, re-read or re-run the evidence yourself. Record:
- finding id
- real: true/false
- confidence
- evidence gathered
- refined plan change, or why no change is warranted
```

Verify blocking/high findings first. Skip low findings unless they materially
change the plan.

### Rescope Designer

Mission: propose the smallest correct re-scope after verification.

Use only as the optional third subagent when verified findings imply competing
plan shapes. Otherwise the parent chooses the re-scope directly.

Prompt shape:

```text
Propose the smallest correct re-scope for this plan.
Plan: <PLAN>. Repo root: <REPO>.

CONFIRMED findings:
<CONFIRMED_BRIEF>

Return:
- recommended step sequence
- which steps collapse, defer, or reuse existing owners
- what overengineering is removed
- version/dependency/toolchain posture justified by what is provable today
- tradeoffs and open human decisions
```

## Synthesis Rules

- Produce the upgraded plan in the original format.
- Preserve unchanged working sections. Do not rewrite for style alone.
- Convert false premises into owned precondition steps.
- Convert "implement X" to "reuse/surface existing X" when a working owner
  exists.
- Remove, defer, or narrow overengineered work that lacks a current producer,
  consumer, or proof path.
- Split risky version, SDK, dependency, schema, or toolchain changes into an
  isolated gate unless the plan proves the feature truly requires them.
- Replace naive moves across layers with wrap, adapter, or projection designs
  when transitive references would create cycles.
- Keep refuted findings out of the plan body.
- Put rejected claims, losing alternatives, and refutations in the changelog.

## Changelog Shape

Write a sibling Markdown changelog with:

1. `Verdict`: two or three sentences on the plan's health after the pass
2. `Confirmed changes applied`: grouped by lens with problem, evidence, change
3. `Refuted / not changed`: raised findings deliberately excluded and why
4. `Chosen re-scoping`: only when a re-scope was needed
5. `Open decisions for the human`: product, privacy, release, or ownership calls
   the repo could not settle

# Ultraplan Workflow

Read this for the pipeline, the feedback loop, role contracts, and review
lenses. Keep analysis roles read-only until synthesis writes plan artifacts.

## One Pipeline, Two Entry Points

Every Ultraplan run is the same pipeline. The entry shape only decides what
`Draft` means; the rung decides how much independence and iteration the loop
gets.

```text
Frame -> Draft -> Critique -> Verify -> Revise -> Validate
                      ^___________________________|
                       feedback loop
```

- `New plan`: the parent authors the draft, then critiques it.
- `Existing plan`: the user's plan/spec/design doc is the draft. Preserve a
  diffable original and emit a changelog. Critique begins immediately.

At `L0` the parent plays every role itself (self-critique). At `L1`+ independent
subagents take the Researcher and Critic roles. See
[budget-rules.md](budget-rules.md) for which roles each rung adds.

### Grounding during Frame

Framing always includes a small read-only grounding pass: read repo instructions
(and, for an existing plan, the plan in full), search for artifacts the task
asserts are done/moved/required/absent, check toolchain or version claims that
matter, and capture commands and paths rather than impressions.

When the run uses subagents, hand them those facts to verify rather than trust —
this is what keeps critique independent:

```text
Seed observations (VERIFY against the repo with search/file reads/git; do not trust blindly):
<facts with commands or paths>
```

## The Feedback Loop

Critique -> Verify -> Revise is a loop:

1. **Critique** produces ranked, plan-changing findings.
2. **Verify** refutes by default; only clearly-evidenced findings survive.
3. **Revise** applies confirmed findings; refuted ones go to the changelog.
4. **Converge**: at `L3`, re-critique the revised plan (changed sections plus
   uncovered areas) and repeat. Stop when a round yields **zero new confirmed
   findings**, or at the round cap. At `L0`-`L2` the loop runs once.

If the loop hits the cap with a confirmed blocking finding unresolved, do not
ship silently: revise to address it or name the unresolved tension as an open
decision.

## Lens Sets

Pick the lens set at `Frame`:

- **Code/source-grounded** (default when code or source truth matters): all seven
  lenses below.
- **Non-code / universal**: premise, sequencing, risk, and overengineering only.
  The reuse, ownership, and testability lenses assume a codebase; drop them when
  there is no code or source surface to ground against.

| Key | Focus |
|---|---|
| `premise` | False or stale assumptions vs current reality. Flag anything asserted as done, landed, or already present without ownership. |
| `sequencing` | Step order, prerequisites, missing owners for assumed preconditions, dependency on out-of-scope work, and blast radius. |
| `reuse` | Work that already exists. For every "implement X", search for a working owner and recommend reuse or surfacing. |
| `ownership` | One canonical owner, target/module edges, transitive references, dependency cycles, and lower layers staying free of upper-layer types. |
| `testability` | Whether each step is provable in the current environment, has producer and consumer, and names runnable verification commands. |
| `risk` | Concrete failure modes with evidence: shipping, CI, schema/version, environment mismatch, silent breakage, or irreversible actions. |
| `overengineering` | Abstractions, adapters, compatibility shims, generic schemas, framework work, or broad refactors that exceed the current goal. |

## Roles

### Researcher

Added at `L1`+. Mission: independent grounding the parent context cannot carry
cleanly. Returns facts, likely owners, and current-state claims with commands or
paths. The parent still drafts and decides.

Prompt shape:

```text
You are grounding facts before an implementation plan is drafted or critiqued.
Repo root: <REPO>. Task / plan: <CONTEXT>.

<SEED>

Return a concise, sourced map:
1. Concrete current-state claims relevant to the task, each with a file path,
   symbol, or command.
2. Existing owners or implementations that should be reused.
3. Contradictions between the task/plan and the current repo.
Be specific. Do not propose style edits. Do not modify files.
```

### Critic

Added at `L2`+ (multiple, diverse-lens, at `L3`). Mission: strongest
plan-changing findings across the active lens set, including overengineering.

Input: the draft plan, repo root, seed observations, Researcher output.

Prompt shape:

```text
You are adversarially reviewing an implementation plan. Read the plan:
<PLAN>. Repo root: <REPO>. Ground findings with search, file reads, git, tests,
or docs.

<SEED>

RESEARCHER OUTPUT:
<RESEARCH>

Find the strongest real, specific problems across these lenses:
<ACTIVE_LENSES>

Rules:
- Ground each finding in evidence. If you could not verify, say so and lower
  severity.
- Be concrete: name the section/step and give a plan change.
- Quality over quantity: return at most 8 findings, ranked by implementation
  impact.
- Prefer findings that reduce or re-own scope: false done-states, reuse traps,
  hidden coupling, unneeded dependency/toolchain moves, verification gaps, and
  abstractions or shims without current producers and consumers.
- Do not invent problems to justify the pass.
```

At `L3`, assign each Critic a lens family (e.g. premise+sequencing,
reuse+ownership, testability+risk, overengineering) so breadth comes from
diverse perspectives rather than redundant identical reviews.

### Verifier

Run in the parent by default so the final author owns the evidence. At `L3`,
high-severity findings may get multi-vote refutation (several independent
verifiers, majority refutes -> drop).

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

Optional, added only when verified findings imply genuinely competing plan
shapes (an auto-promotion gate). Otherwise the parent chooses the re-scope
directly.

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

- For `New plan`, produce a clean plan in the output contract's format. For
  `Existing plan`, produce the upgraded plan in the original format.
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
- For upgrades, put rejected claims, losing alternatives, and refutations in the
  changelog.

## Changelog Shape

For `Existing plan` upgrades, write a sibling Markdown changelog with:

1. `Verdict`: two or three sentences on the plan's health after the pass
2. `Confirmed changes applied`: grouped by lens with problem, evidence, change
3. `Refuted / not changed`: raised findings deliberately excluded and why
4. `Chosen re-scoping`: only when a re-scope was needed
5. `Open decisions for the human`: product, privacy, release, or ownership calls
   the repo could not settle

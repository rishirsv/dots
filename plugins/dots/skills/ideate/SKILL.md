---
name: ideate
description: "Brainstorms product, workflow, or skill ideas by opening the option space, pressure-testing assumptions, and converging on one carry-forward shape. Explicit-only skill for thinking before committing to a plan or build."
---

# Ideate

Turn a loose product, workflow, or skill idea into a clearer decision. Ideate is
a guided conversation, not a plan, build, research pass, or durable doc.

Be candid, product-minded, and exacting. Push back when a name, premise, or
first solution is doing too much work.

## Session Shape

Use one move per turn:

| Move | Use when | Output |
|---|---|---|
| `Frame` | the desire, user, vocabulary, or "why now" is unclear | a short read plus one question |
| `Diverge` | the user is anchored on one solution too early | 3-7 distinct shapes, then the next choice |
| `Pressure-test` | one premise could break the idea | one assumption or objection, then the next choice |
| `Converge` | a real fork exists | one A/B/C/D question with a recommendation |
| `Capture` | more questions would only polish | one compact snapshot, then stop |

Prefer visible labels that fit the moment: `Read`, `Tension`, `Best default`,
`Diverge`, `Assumption`, `Implementation shape`, `Trade-off`, `How to choose`.
Do not expose the move table unless it helps the user decide.

One move means one session purpose. `Diverge` or `Pressure-test` may end with
one branch question when that question is the natural result of the move.

## Active Turn

Once the idea is choice-ready, use this spine:

```md
**Read:** <short interpretation, tension, or recommendation>

**Question:** <one branch-unlocking question>

| Choice | Direction |
|---|---|
| A | <option> |
| B | **<recommended option> (Recommended)** - <why this is the best default> |
| C | <option> |
| D | <hybrid, escape hatch, or something else> |

**How to choose:** <optional context when it makes the options clearer>
**Why this recommendation:** <optional 1-3 bullets or short lines explaining the
trade-off behind the recommended choice>
```

Choice-ready means:

- the options are meaningfully different
- the user can answer from the current context
- the answer would change direction, vocabulary, trade-off, non-goal,
  assumption, implementation shape, rejected branch, or carry-forward form

Absorb settled facts. Ask only about decisions still live.

Use A/B/C/D every choice-ready active turn. Bold exactly one recommended option.
If there are only two or three real branches, use `D` for hybrid or something
else. Do not add a second live question, competing recommendation, or memo.

Formatting rules:

- Put `**Question:**` on its own line.
- Use the `Choice | Direction` table for choices.
- Keep the recommended option bolded inline inside the table.
- Put follow-on analysis below the table only when it helps the user choose.
- Use `**Why this recommendation:**` for the reasoning that drove the
  recommendation; keep it concise and do not introduce another question.

If the idea is not choice-ready, run one compact `Frame`, `Diverge`, or
`Pressure-test` pass first. It may ask one open question or show rough shapes.
Return to the A/B/C/D spine as soon as a meaningful branch exists.

## What To Shape

Keep a light mental ledger:

- core desire, beneficiary, current workaround, and why now
- overloaded vocabulary, names, or artifact words
- alternative product or workflow shapes
- load-bearing assumptions and cheapest tests
- rejected branches and why they were rejected
- implementation shape: behavior, runtime loop, source of truth, durable state,
  ownership boundary, approval gate, evidence, and smallest buildable version

Use this ledger to choose the next live move. Do not list the ledger to the user.

## Creative Unlockers

Use one unlocker when `Diverge` feels too obvious:

| Unlocker | Use it to |
|---|---|
| `Inversion` | ask how to make the problem worse, then reverse the useful failures |
| `Analogy` | borrow a pattern from another industry, product, or workflow |
| `Removal` | solve by deleting a step, surface, policy, or obligation |
| `Constraint lift` | ignore one constraint briefly, then backcast a feasible version |
| `User hats` | view the idea as a power user, new user, admin, operator, or skeptic |
| `Scale shift` | imagine the 10x bigger, smaller, faster, slower, or cheaper version |

Name the unlocker only if it helps. Return to the next branch question quickly.

## Pressure Lenses

Use one lens only when it changes the next question:

| Lens | Ask |
|---|---|
| `Evidence` | What observable behavior says this matters? |
| `Specificity` | Which user or segment changes behavior? |
| `Counterfactual` | What happens if nothing changes? |
| `Attachment` | Are we protecting a solution before naming the value? |
| `Adoption` | What behavior change does this require? |
| `Feasibility` | What trade-off does the shape impose? |
| `Durability` | What would make the idea stop working? |
| `Ownership` | What should this own, and what belongs elsewhere? |

Name the lens only if it helps. Pressure-testing should sharpen the concept, not
become a critique memo.

## Visual Thinking

Use small tables, ASCII maps, or Mermaid in chat when a visual structure makes
the choice clearer. For a saved visual artifact, UI exploration, generated image,
or HTML explainer, recommend the owning skill and ask before switching.

## Grounding

Add outside evidence only when it would change the next question, option set, or
recommendation. If repo reality matters, delegate one bounded read-only pass; the
parent agent should not inspect source, tests, or git history during Ideate.

```text
Question: <one bounded repo/docs question>
Scope: <repo area, docs, product surface, symbols, or terms>
Mode: read-only exploration; do not edit files or propose build tasks
Return: terms, constraints, conflicts, and findings that could change the concept
Stop condition: enough evidence to answer the bounded question
```

Use findings to sharpen the next choice, not to create tasks.

## Subject Discovery

Use Subject Discovery when the user wants to ideate but has not chosen the
subject, or asks to be surprised from a repo, document, product area, workflow,
or vague desire. Read [subject-discovery.md](references/subject-discovery.md).

Subject Discovery is an entry path back into Ideate, not a separate brainstorming
engine. Find candidate subjects, recommend one, ask one A/B/C/D question, then
return to the normal `Frame`, `Diverge`, `Pressure-test`, `Converge`, or
`Capture` flow.

## Corrections And Closure

Treat a correction to vocabulary, names, direction, or taste as new settled
context, then ask the next live question unless stopping.

Do not treat `yes`, `exactly`, `that's my idea`, or `let's go with that` as
closure when the user adds new workflow, durable state, first-run behavior,
ownership, or handoff details. Explore the new shape first.

When the remaining difference is naming polish, taste, or minor semantics,
recommend the wording and capture instead of asking another question.

## Capture

When stopping, produce exactly one artifact in chat. Default to `Decision
Snapshot`; use `Concept Brief` only when the result needs to travel.

```md
**Decision Snapshot**

| Field | Decision |
|---|---|
| Direction | <where the idea now points> |
| Settled vocabulary | <stable terms> |
| Key trade-off | <trade-off that shaped the direction> |
| Rejected branch | <important path not chosen, plus why> |
| Assumption to test | <riskiest assumption or "none surfaced"> |
| Non-goal | <what this should not become> |
| Next move | <stop, handoff, research, design, docs, or build confirmation> |
```

Do not write files, durable docs, external actions, or code while Ideate is
active. Persisted docs require an explicit write request. Building requires the
exact phrase `confirm build`.

If the user asks to build, implement, make, code, or ship, stop and confirm:

```text
I can switch from ideation to building. Confirm this scope:
- Build:
- Do not build:
- Evidence I will use:

Reply with "confirm build" to proceed, or revise the scope.
```

## Handoffs

Recommend the next mode, but do not silently enter it:

- `research`: external evidence, market landscape, current facts, or user proof.
- `visual-design`: UI concepts, visual exploration, journey maps, or mockups.
- `docs-writer`: durable PRD, concept doc, ADR, glossary, or spec.
- build: only after `confirm build`.

If the conversation circles because no one knows the answer, stop ideating and
recommend research or repo grounding.

Read [conversation-patterns.md](references/conversation-patterns.md) only when
behavior is ambiguous. Mirror the move, not the wording.

## Final Check

- One move happened this turn.
- Choice-ready turns used one `**Question:**`, A/B/C/D, and one recommended
  option.
- Non-choice-ready turns made the next choice better.
- Rejected branches and assumptions were captured when they mattered.
- Visual, repo, doc, research, and build work stayed behind their gates.

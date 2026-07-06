---
name: ideate
description: "Brainstorms product, workflow, or skill ideas by opening the option space, pressure-testing assumptions, and converging on one carry-forward shape. Explicit-only skill for thinking before committing to a plan or build."
---

# Ideate

Turn a loose product, workflow, or skill idea into a clearer decision — a guided conversation, not a plan, build, research pass, or durable doc. Be candid, product-minded, and exacting: push back when a name, premise, or first solution is doing too much work.

## Session Shape

Use one move per turn:

| Move | Use when | Output |
|---|---|---|
| `Frame` | the desire, user, vocabulary, or "why now" is unclear | a short read plus one question |
| `Diverge` | the user is anchored on one solution too early | 3-7 distinct shapes, then the next choice |
| `Pressure-test` | one premise could break the idea | one assumption or objection, then the next choice |
| `Converge` | a real fork exists | one A/B/C/D question with a recommendation |
| `Capture` | more questions would only polish | one compact snapshot, then stop |

Prefer visible labels that fit the moment — `Read`, `Tension`, `Best default`, `Diverge`, `Assumption`, `Trade-off`, `How to choose` — over exposing the move table itself. One move means one session purpose, though `Diverge` or `Pressure-test` may end with one branch question when that's the natural result of the move.

## What To Shape

Keep a light mental ledger, used to choose the next move but never listed to the user:

- core desire, beneficiary, current workaround, and why now
- overloaded vocabulary, names, or artifact words
- alternative shapes, rejected branches and why, and load-bearing assumptions with their cheapest tests
- implementation shape: behavior, runtime loop, source of truth, durable state, ownership boundary, approval gate, evidence, and smallest buildable version

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

Choice-ready means the options are meaningfully different, the user can answer from current context, and the answer would change direction, vocabulary, trade-off, non-goal, assumption, implementation shape, rejected branch, or carry-forward form. Absorb settled facts; ask only about decisions still live.

A/B/C/D is the default shape when a real fork exists — bold exactly one recommended option, use `D` for a hybrid or escape hatch, and never stack a second live question or competing recommendation onto it. The format is not the point, though: it exists to carry your actual read on the trade-off — what you notice, what worries you, why the recommendation wins — stated like a sharp collaborator thinking out loud, before or around the options. A turn that is only labels, bullets, and a bolded letter with no visible thinking is a failure even when the format is correct.

If the idea is not choice-ready, run one compact `Frame`, `Diverge`, or `Pressure-test` pass first, then return to the A/B/C/D spine once a meaningful branch exists.

## Creative Unlockers

Use one unlocker when `Diverge` feels too obvious, then return to the next branch question quickly:

| Unlocker | Use it to |
|---|---|
| `Inversion` | ask how to make the problem worse, then reverse the useful failures |
| `Analogy` | borrow a pattern from another industry, product, or workflow |
| `Removal` | solve by deleting a step, surface, policy, or obligation |
| `Constraint lift` | ignore one constraint briefly, then backcast a feasible version |
| `User hats` | view the idea as a power user, new user, admin, operator, or skeptic |
| `Scale shift` | imagine the 10x bigger, smaller, faster, slower, or cheaper version |

## Pressure Lenses

Use one lens only when it changes the next question — pressure-testing should sharpen the concept, not become a critique memo:

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

## Visual Thinking

Use small tables, ASCII maps, or Mermaid in chat when a visual structure makes the choice clearer. For a saved visual artifact, UI exploration, generated image, or HTML explainer, recommend the owning skill and ask before switching.

## Grounding

Add outside evidence only when it would change the next question, option set, or recommendation. If repo reality matters, delegate one bounded read-only pass; the parent agent should not inspect source, tests, or git history during Ideate.

```text
Question: <one bounded repo/docs question>
Scope: <repo area, docs, product surface, symbols, or terms>
Mode: read-only exploration; do not edit files or propose build tasks
Return: terms, constraints, conflicts, and findings that could change the concept
Stop condition: enough evidence to answer the bounded question
```

Use findings to sharpen the next choice, not to create tasks.

## Subject Discovery

Use Subject Discovery — [subject-discovery.md](references/subject-discovery.md) — when no subject is chosen yet, or the user asks to be surprised from a repo, doc, product area, or vague desire. It re-enters Ideate: find candidates, recommend one, ask one A/B/C/D question, then resume the normal flow.

## Capture

Treat a correction to vocabulary, names, direction, or taste as new settled context, then ask the next live question unless stopping. Do not treat `yes`, `exactly`, `that's my idea`, or `let's go with that` as closure when the user adds new workflow, durable state, first-run behavior, ownership, or handoff details — explore the new shape first. When the remaining difference is naming polish, taste, or minor semantics, recommend the wording and capture instead of asking again.

When stopping, produce one artifact in chat — default to `Decision Snapshot`; use `Concept Brief` only when the result needs to travel:

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
| Next move | <stop, handoff, research, design, docs, plan, or build confirmation> |
```

Do not write files, durable docs, external actions, or code while Ideate is active; persisted docs require an explicit write request. If the user asks to build, implement, make, code, or ship, stop and confirm scope first:

```text
I can switch from ideation to building. Confirm this scope:
- Build:
- Do not build:
- Evidence I will use:

Reply with "confirm build," or confirm in your own words, to proceed.
```

Unambiguous plain-language confirmation of the stated scope counts the same as the exact phrase. Stay in the gate if the reply is vague, adds scope, or only partly agrees.

## Handoffs

Recommend the next mode, but do not silently enter it:

- `research`: external evidence, market landscape, current facts, or user proof.
- `design`: UI concepts, visual exploration, journey maps, or mockups.
- `docs-writer`: durable PRD, concept doc, ADR, glossary, or spec.
- [`ultraplan`](../ultraplan/SKILL.md): deep planning once the shape is chosen.
- [`clarify`](../clarify/SKILL.md): direction is settled and only scope, safety, or done-criteria questions remain before build.
- build: only after confirmed scope, above.

Still deciding what to build → stay in ideate. Knows what to build, needs blocking details → clarify.

If the conversation circles because no one knows the answer, stop ideating and recommend research or repo grounding. Read [conversation-patterns.md](references/conversation-patterns.md) only when behavior is ambiguous — mirror the move, not the wording.

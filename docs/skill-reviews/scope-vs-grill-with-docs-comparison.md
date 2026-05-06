# Scope vs Matt Pocock's grill-with-docs

## Purpose

This document compares the local `scope` skill with Matt Pocock's `grill-with-docs` skill and related writeup. The goal is not to copy `grill-with-docs`, but to decide what Scope should learn from it while preserving Scope's current job: pre-plan thinking that turns an unclear direction into a clear next step.

## Sources Reviewed

- Local Scope skill: `plugins/rs-tools/skills/scope/SKILL.md`
- Local Scope references:
  - `plugins/rs-tools/skills/scope/references/discuss.md`
  - `plugins/rs-tools/skills/scope/references/ideate.md`
  - `plugins/rs-tools/skills/scope/references/research.md`
  - `plugins/rs-tools/skills/scope/references/artifacts.md`
- Matt Pocock source:
  - `https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/grill-with-docs/SKILL.md`
  - `https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/grill-with-docs/CONTEXT-FORMAT.md`
  - `https://raw.githubusercontent.com/mattpocock/skills/main/skills/engineering/grill-with-docs/ADR-FORMAT.md`
  - `https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grill-me/SKILL.md`
- Matt Pocock explanatory writeup:
  - `https://www.aihero.dev/grill-with-docs`

## Executive Summary

Scope is broader, more humane, and better aligned with Rishi's workflow than `grill-with-docs`. It already covers the core interviewing discipline: one question at a time, codebase exploration before asking avoidable questions, recommended defaults, and ending only when the next step is clear.

`grill-with-docs` is narrower and sharper. Its advantage is that it turns discussion into durable repo memory while the conversation is still warm. It challenges terminology against a glossary, cross-checks claims against code, updates `CONTEXT.md` as terms resolve, and offers ADRs only for decisions that are hard to reverse, surprising without context, and trade-off driven.

The best next move is not to replace Scope. The best move is to add a small "domain-docs pressure test" branch inside Discuss or as a sibling lane. That would let Scope borrow the compounding-documentation behavior from `grill-with-docs` without turning every scoping conversation into documentation maintenance.

## What Scope Already Does Well

### 1. It has a clean boundary

Scope says: "Do not implement. Scope ends when the next step is clear."

That is a stronger product boundary than `grill-with-docs`, which can drift from interview into document mutation because inline updates are part of the core workflow. Scope's boundary is especially valuable in this repo because the user often separates exploration, approval, implementation, sync, and commit.

### 2. It separates ideation from pressure testing

Scope has two lanes:

- `Ideate`: generate many grounded possibilities, filter weak ideas, recommend survivors.
- `Discuss`: examine an existing idea, plan, architecture, implementation direction, or decision.

`grill-with-docs` is essentially a specialized Discuss lane. It does not own broad option generation. That means Scope should not collapse into grill-style interrogation as its default behavior.

### 3. It uses better question voice for this user

Scope's Discuss reference explicitly asks for plain English, short sentences, one focused question at a time, and a recommended/default answer when useful.

Matt's version is intentionally more relentless. That is useful when the user asks to be grilled, but it can feel too heavy for routine shaping. Scope's tone is more compatible with the user's preference for "a nice flow and interaction."

### 4. It already grounds before asking

Scope says to inspect repo source of truth for repo, product, or workflow topics before asking the user. Discuss says that if repo claims are checkable, inspect the repo before treating them as true.

This matches the core `grill-me` rule: if a question can be answered by exploring the codebase, explore the codebase instead.

### 5. It has artifact restraint

Scope defaults to chat and saves only when output needs to survive, guide planning, or hand off later. This is exactly right for Rishi's workflow, where durable artifacts matter but document sprawl is a real risk.

## What grill-with-docs Does Better

### 1. It makes terminology first-class

`grill-with-docs` actively challenges language:

- "Your glossary defines X, but you seem to mean Y."
- "Do you mean Customer or User? Those are different things."
- Concrete scenarios are used to clarify boundaries between concepts.

Scope discusses hidden assumptions, unclear ownership, simpler alternatives, and edge cases, but it does not explicitly say to challenge domain language or pick canonical terms. That is the biggest gap.

### 2. It compounds learning across sessions

Matt's writeup frames the problem clearly: without lightweight docs, every session repeats the same non-obvious codebase and domain explanations.

Scope can create durable context artifacts, but it does not create or update a canonical glossary as terms resolve. That makes Scope good at one-session clarity, but weaker at making the next session start sharper.

### 3. It has concrete doc conventions

`grill-with-docs` defines:

- `CONTEXT.md` for shared language.
- `CONTEXT-MAP.md` for multi-context repos.
- `docs/adr/NNNN-slug.md` for architectural decisions.
- Lazy creation rules.
- A tight `CONTEXT.md` format with Language, Relationships, Example dialogue, and Flagged ambiguities.
- A tiny ADR format with strict creation criteria.

Scope's artifact guidance is intentionally portable, but less operational. It tells the agent to follow local conventions, then provides fallback shapes. That is flexible, but it gives the model fewer concrete moves when a repo lacks conventions.

### 4. It captures resolved terms inline

The strongest behavior in `grill-with-docs` is "update `CONTEXT.md` right there." It does not wait until the end, and it does not batch up terms.

Scope says durable outputs should be created only when needed, but it does not distinguish between:

- "we resolved a term; capture it now"
- "we have a broad conversation; summarize later"

That distinction matters. Terminology decisions are easy to lose.

### 5. It has a strict ADR gate

The ADR test is excellent:

- Hard to reverse.
- Surprising without context.
- Result of a real trade-off.

Scope can recommend an ExecPlan or context/product spec, but it does not have an equally sharp trigger for decision records. The ADR gate could improve Scope's artifact routing without adding much weight.

## Capability Matrix

| Capability | Scope | grill-me | grill-with-docs | Assessment |
| --- | --- | --- | --- | --- |
| One-question-at-a-time interview | Yes | Yes | Yes | Scope matches the core pattern. |
| Recommended answer per question | Yes, when useful | Yes | Yes | Scope is slightly softer, which fits the user. |
| Codebase exploration before asking | Yes | Yes | Yes | Equivalent. |
| Broad ideation | Yes | No | No | Scope owns a larger lane. |
| Critique of existing plan/design | Yes | Yes | Yes | Scope and grill variants overlap here. |
| Relentless pressure testing | Moderate | High | High | Scope is less forceful by design. |
| Domain glossary awareness | Indirect | No | Yes | Scope gap. |
| Fuzzy terminology challenge | Indirect | No | Yes | Scope gap. |
| Concrete domain scenarios | Partial | Not explicit | Yes | Scope should borrow this. |
| Cross-reference user claims with code | Yes | Yes | Yes | Scope already has this. |
| Inline doc updates during session | No | No | Yes | Scope gap, but should be opt-in or lane-specific. |
| `CONTEXT.md` convention | No fixed convention | No | Yes | Useful if adapted carefully. |
| ADR creation gate | No | No | Yes | Strong candidate to borrow. |
| Artifact restraint | Yes | N/A | Partial | Scope is safer by default. |
| General non-code usefulness | Yes | Yes | No | Scope should preserve this. |

## Where They Philosophically Differ

### Scope is a router and synthesizer

Scope asks: "What kind of pre-plan work is needed here?"

It can ideate, discuss, decide whether to save a durable artifact, or exit early because the task is already concrete. It is a front door for shaping work before implementation.

### grill-with-docs is a domain-modeling pressure test

`grill-with-docs` asks: "Does this plan fit the repo's language and decisions?"

Its center of gravity is not simply better questions. It is a feedback loop between user intent, code reality, domain terminology, and durable docs.

### Scope values flow; grill-with-docs values accumulation

Scope protects the conversation from becoming too mechanical. `grill-with-docs` protects the repo from forgetting what the conversation clarified.

The right synthesis is to keep Scope's conversational flow and add explicit accumulation only when the subject is codebase/product/domain language that benefits from canonical docs.

## Risks If Scope Copies grill-with-docs Too Literally

### 1. Scope becomes too narrow

If Scope always looks for `CONTEXT.md` and ADRs, it stops being a general pre-plan skill and becomes a coding-domain-model skill. That would weaken Ideate and non-code Discuss sessions.

### 2. It may create unwanted docs

Rishi has repeatedly preferred durable artifacts when they are useful, but not by default. Automatic `CONTEXT.md` creation could conflict with that preference unless the skill clearly limits when it writes.

### 3. It could blur Scope vs implementation

Inline docs updates are file edits. Scope currently says "Do not implement," but documentation updates can still be productive work. If Scope borrows inline updates, it needs to clarify that capturing resolved context is allowed only as a durable-output action, not as product implementation.

### 4. It could over-index on domain-driven-design terminology

Matt's skill assumes DDD concepts like bounded contexts and ubiquitous language. Scope should use the useful behavior without forcing that vocabulary into every repo or conversation.

## Recommended Adaptation

Add a narrow branch to Scope's Discuss lane: **Domain Docs Pressure Test**.

Use it when all are true:

- The user has a plan, design, architecture, workflow, or product direction to examine.
- The topic is tied to a repo or product domain.
- Existing language, ownership, architecture, or decisions materially affect the answer.
- A durable context, glossary, or decision record would make future work sharper.

Do not use it for:

- General ideation.
- Simple requirements clarification.
- Small edits.
- Non-code conversations without a durable shared language problem.
- Accepted implementation plans unless the user asks to revisit assumptions.

## Concrete Changes To Consider

### Change 1: Add language pressure testing to Discuss

Add a small section to `references/discuss.md`:

```md
For repo or product-domain discussions, also pressure-test language:

- If the user uses a term that conflicts with existing docs or code, call out the conflict.
- If a term is vague or overloaded, propose a canonical term and name the rejected alternatives.
- Use concrete scenarios to test boundaries between concepts.
- If code contradicts the user's description, surface the contradiction before recommending a path.
```

This is the highest-value, lowest-risk adoption.

### Change 2: Add a domain-context artifact shape

Extend `references/artifacts.md` with a concrete fallback for domain context docs:

```md
### Domain Context

Use for canonical project language, domain relationships, ownership boundaries, and flagged ambiguities.

Suggested sections:

- Purpose
- Language
- Relationships
- Ownership Boundaries
- Flagged Ambiguities
- Decision Links
```

This keeps Scope's artifact family concept while borrowing the useful specificity from `CONTEXT.md`.

### Change 3: Add an ADR decision gate

Add this to `references/artifacts.md`:

```md
Offer a decision record only when all three are true:

- The decision is hard to reverse.
- The decision would be surprising without context.
- The decision involved a real trade-off.
```

This is directly compatible with Scope's existing durable-output restraint.

### Change 4: Clarify when Scope may update docs

Scope should not silently become a docs-writing skill. Add a rule:

```md
Scope may update an existing context or decision artifact only when the user asked for a durable output or when a term/decision has been explicitly resolved and the artifact is the repo's canonical place for it. Keep updates narrow and confirm before creating a new document family.
```

This preserves the current "default to chat" rule while allowing useful inline capture.

### Change 5: Avoid importing CONTEXT-MAP by default

Do not add `CONTEXT-MAP.md` as a required convention to Scope yet. Rishi's repos already have their own documentation and plan conventions. Scope should inspect local conventions first and only use a generic domain-context fallback when none exists.

## Proposed Scope Shape After Adaptation

Scope should remain:

- `Ideate`: generate and filter options.
- `Discuss`: interview and pressure-test an existing direction.
- `Durable Outputs`: route resolved thinking into context, product spec, or ExecPlan.

Discuss should gain an optional sub-mode:

- `Domain Docs Pressure Test`: challenge terminology, relationships, ownership, and code/doc contradictions; capture resolved terms or decisions only when durable docs are warranted.

This gives Scope the practical power of `grill-with-docs` without making every Scope session feel like a DDD workshop.

## Verdict

Scope is not worse than `grill-with-docs`; it is solving a broader problem. But `grill-with-docs` has one excellent insight Scope should absorb: scoping conversations should improve the repo's shared language when language is part of the risk.

Recommended action:

1. Keep Scope as the main pre-plan skill.
2. Add terminology pressure-testing to Discuss.
3. Add a domain-context artifact fallback.
4. Add the ADR three-part gate.
5. Keep document creation restrained and local-convention-first.

This would make Scope sharper for codebase/product work while preserving the easy conversational flow that makes it useful in the first place.

---
name: clarify
description: "Asks the minimum blocking questions needed to make an underspecified request safe to build, then proceeds or returns a compact decision set. Triggers: clarify this, before coding ask questions, this is underspecified."
---

# Clarify

Ask the minimum blocking questions needed to make implementation safe enough, then proceed or hand back a compact decision set.

## Route

Use this skill for prompts like:

- `clarify this`
- `ask me what you need`
- `before coding, ask questions`
- `this is underspecified`
- `what do you need from me?`

Also use it when an implementation request is ambiguous in a way that could change the work materially. Do not use it just because small details are absent and a reasonable, low-risk assumption would work.

## First Pass

Inspect the repo, docs, code, tests, issues, prior messages, and available artifacts for answers before asking. If code or local context can answer the question, do not ask the user.

Separate missing information into three buckets:

- Known from context: use it.
- Safe assumption: proceed and mention it only if it matters.
- Blocking decision: ask only if the answer changes the work.

Stop clarifying once implementation is safe enough. Do not keep interviewing to make the request perfect.

## The Stakes Ladder

The question budget scales with blast radius, not with how much is unknown:

- **Must ask** — the action reaches beyond the working tree or is costly to
  undo: destructive changes (delete, overwrite, reset, migrate,
  force-update), external publishing (push, post, email, deploy, open PRs,
  live systems), credentials or access, and anything irreversible or likely
  to surprise the user. Never assume through these.
- **Ask only if the answer changes the work** — scope (included, excluded,
  sequenced), user-facing behavior (copy, UX, APIs, data shape,
  permissions), domain meaning (terms, statuses, calculations, ownership,
  business rules), and the validation standard (what counts as done).
- **Never ask** — taste, naming, formatting, or minor implementation style:
  choose the best local convention and continue.

A request with no top-rung decisions and clear middle-rung answers gets zero
questions.

## Question Shape

Ask everything in one round: batch all blocking questions into a single
turn. Serial interrogation — question, answer, new question — is the failure
mode this skill exists to prevent; a second round is justified only by a new
blocker that the first answers created. Prefer one to three questions; ask
more only when each one independently blocks safe implementation.

Every question carries a recommended default, so `use defaults` is always a
complete answer and the fastest path through the gate is one word. For each
question: number it, give tight options when possible, mark the recommended
default first, and state the assumption `use defaults` selects.

When the platform provides a structured-question tool, prefer it over hand-rolled numbered-option markdown; otherwise use this skill's markdown shape below.

Use this shape:

```md
I found a couple of decisions that would change the implementation.

1. Should this change affect existing saved records?
a) Migrate existing records too (recommended) - use this if backward compatibility matters.
b) Only apply to new records - use this if old data can remain as-is.
Default: a

Reply with `use defaults`, or answer like `1b`.
```

When there is exactly one blocking question, ask it directly and include the default in the same message.

## Working Understanding

Before implementing, restate the settled decision set only when it reduces drift:

- Use it after the user answers multiple blocking questions.
- Use it after `use defaults` when the defaults materially affect implementation.
- Use it when the decision set changes scope, data migration, user-facing behavior, validation, access, or irreversible actions.
- Skip it for one small clarification or when implementation can continue from an obvious local convention.

Keep the recap to three to six bullets. Name the decisions, defaults, and meaningful assumptions that now define the work.

Use this shape:

```md
Working Understanding

- Scope: add fixed organization roles: owner, admin, member, viewer.
- Migration: create a default organization for existing accounts.
- Done means: model/API/UI changes plus targeted role-enforcement tests.
- Assumption: role names are user-facing unless the existing app uses different labels.

I'll proceed on that basis.
```

Do not ask for confirmation after the recap unless the next step needs approval. State that you will proceed on that basis, then implement.

## Proceeding With Assumptions

Proceed without asking when the remaining uncertainty is low risk, reversible, or answered by repo convention. In the final response, mention meaningful assumptions that affected the work.

If the user says `use defaults`, apply the recommended defaults you already stated. Do not ask follow-up questions unless a new blocker appears during implementation.

When a blocker appears after work starts, pause and ask only the new blocking question. Include what you already learned from the code so the user is not asked to rediscover it.

When an answer reveals a durable preference rather than a one-off decision — a naming convention, deploy target, risk tolerance, validation bar — say so in the final report and flag it as a candidate for the project's instruction file or memory (route the update through `$self-improve` where available). The same question should never survive into a future session.

## Boundaries

This is not a deep grilling workflow. Do not expand into product strategy, exhaustive domain discovery, stakeholder interviews, or long requirement workshops.

This is not a substitute for normal implementation judgment. Prefer local conventions and safe assumptions whenever they are enough.

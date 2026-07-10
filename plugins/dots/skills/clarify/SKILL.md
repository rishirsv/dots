---
name: clarify
description: "Asks the minimum blocking questions needed to make an underspecified request safe to build, then proceeds or returns a compact decision set. Triggers: clarify this, before coding ask questions, this is underspecified."
---

# Clarify

Ask the minimum blocking questions needed to make implementation safe enough,
then proceed or hand back a compact decision set.

## Route

Use for prompts like `clarify this`, `before coding, ask questions`, `this is
underspecified` — or when an implementation request is ambiguous in a way that
could change the work materially. Not for small missing details a reasonable,
low-risk assumption covers.

## First Pass

Inspect the repo, docs, tests, and prior messages before asking; if local
context can answer a question, do not ask the user. Sort what's missing into
three buckets: known from context (use it), safe assumption (proceed, mention
it only if it matters), blocking decision (ask only if the answer changes the
work). Stop clarifying once implementation is safe enough.

## The Stakes Ladder

The question budget scales with blast radius, not with how much is unknown:

- **Must ask unless already authorized** — the action reaches beyond the
  working tree or is costly to undo: destructive changes, external publishing
  (push, deploy, PRs, email), credentials or access, anything irreversible or
  likely to surprise the user. A clear request for that exact action is
  authorization; do not ask the user to repeat it. Never infer authorization
  from an adjacent request.
- **Ask only if the answer changes the work** — scope, user-facing behavior,
  domain meaning, and the validation standard (what counts as done).
- **Never ask** — taste, naming, formatting, minor implementation style:
  choose the best local convention and continue.

A request with no top-rung decisions and clear middle-rung answers gets zero
questions.

## Question Shape

Batch all blocking questions into one round — serial interrogation is the
failure mode this skill exists to prevent; a second round is justified only
by a new blocker the first answers created. Prefer one to three questions.
Give a recommended default only when it is genuinely safe. Offer `use defaults`
only when every question has such a default; otherwise ask the unsafe decision
directly. Prefer the platform's structured-question tool; otherwise:

```md
I found a couple of decisions that would change the implementation.

1. Should this change affect existing saved records?
a) Migrate existing records too (recommended) - use this if backward compatibility matters.
b) Only apply to new records - use this if old data can remain as-is.
Default: a

Reply with `use defaults`, or answer like `1b`.
```

When there is exactly one blocking question, ask it directly with its default
in the same message.

## Proceed

After multiple answers or consequential defaults, restate the settled
decision set in three to six bullets — decisions, defaults, meaningful
assumptions — then state you will proceed on that basis and implement. Skip
the recap for one small clarification, and do not ask for confirmation
unless the next step needs approval.

If a new blocker appears mid-work, pause and ask only that question,
including what the code already told you. When an answer reveals a durable
preference — a naming convention, deploy target, risk tolerance, validation
bar — flag it in the final report as a candidate for the project's instruction
file or memory; the same question should never survive into a future session.

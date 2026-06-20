---
name: clarify
description: "Asks the minimum blocking questions needed to make an underspecified request safe to build, then proceeds or returns a compact decision set. Use when a request is ambiguous in ways that affect scope, user-facing behavior, destructive or irreversible actions, publishing, credentials, validation standards, or domain meaning, or when the user asks what is needed before coding; not for deep product discovery, broad domain interrogation, or routine low-risk assumptions."
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

## Blocking Questions

Ask only questions that change one of these decisions:

- Scope: what is included, excluded, or sequenced.
- Destructive action: deleting, overwriting, resetting, migrating, or force-updating.
- External publishing: pushing, posting, emailing, deploying, opening PRs, or changing live systems.
- User-facing behavior: copy, UX, APIs, data shape, permissions, or compatibility.
- Domain model meaning: terms, statuses, calculations, ownership, identity, or business rules.
- Validation standard: what counts as done, correct, accepted, or tested.
- Credentials or access: accounts, secrets, environments, permissions, or connectors.
- Irreversible decisions: anything costly to undo or likely to surprise the user.

If a question would only improve taste, naming, formatting, or minor implementation style, choose the best local convention and continue.

## Question Shape

Keep the question set short. Prefer one to three questions; ask more only when each one independently blocks safe implementation.

For each question:

- Number it.
- Give tight options when possible.
- Mark the recommended default.
- State what assumption you will use if the user replies `use defaults`.

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

## Boundaries

This is not a deep grilling workflow. Do not expand into product strategy, exhaustive domain discovery, stakeholder interviews, or long requirement workshops. If the user wants that, hand off to the appropriate deeper discovery skill when one exists.

This is not a substitute for normal implementation judgment. Prefer local conventions and safe assumptions whenever they are enough.

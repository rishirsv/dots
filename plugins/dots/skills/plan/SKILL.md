---
name: plan
description: "Creates implementation-ready product and engineering plans from inspected source. Use only when the user explicitly selects or names $plan; not for implementing changes, informal task lists, or fuzzy-direction interviews."
---

# Plan

Turn a requested change into an implementation-ready plan grounded in the
current system. Inspect how the system works today, resolve the decisions that
implementation would otherwise have to make, organize the work, and say
honestly whether it is ready to build.

## Investigate

Start from the desired outcome, constraints, accepted references, and decisions
already supplied. Resolve the repository, branch, worktree, or product area the
plan concerns before drawing conclusions.

Read the [implementation-planning guide](references/implementation-plans.md)
before composing investigation briefs. It links to focused guidance for design,
data, and reliability; read the relevant file before investigating or deciding
that part of the change.

Delegate factual repository investigation to the smallest sufficient read-only
team. Use one investigation agent by default. Add another only for a separate
part of the system, such as another product area, service, data model, or
migration risk that the first agent cannot cover efficiently. Give each agent a
precise question and ask for source paths, behavior, uncertainty, and
conflicts, not a proposed plan. Combine the evidence and make the decisions
yourself.

## Make The Decisions

Reconcile agent findings against primary sources when they conflict.

Make engineering decisions from the chosen outcome and the code you inspected.
Ask the user when different answers would change product behavior, who is
responsible, the migration, or the level of risk. Design work may develop the
options, but it must not silently choose between different product models.
Ask one consequential decision at a time unless a small related batch is easier
to decide. Do not hide a decision gap inside an implementation step.

## Deliver The Plan

Choose structure from the change rather than forcing standard headings. Make
the selected outcome, the parts of the system that will change, delivery order,
proof, rollback, exclusions, and unresolved blockers easy to find.

Return concise Markdown in chat unless the user asks for a durable, visual, or
shareable HTML artifact. For HTML, pass `artifact-template.json` and the finished
plan to `$html`; it handles the page itself.

Use the planning guide's readiness check before calling the result
implementation-ready. If it is not ready, return the useful work you completed
and say what decision or evidence is still missing.

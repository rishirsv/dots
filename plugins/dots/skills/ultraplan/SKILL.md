---
name: ultraplan
description: "Creates or upgrades a repo-grounded implementation plan, pressure-tests it once, verifies material findings, removes overengineering, and stops before implementation. Explicit-only; use for ultraplan, deep planning, or stress-testing an approach before building. Not for explanation, research, or ideation."
---

# Plan

This skill turns a rough request into an implementation plan the next agent can
execute end to end with little help from the user. It grounds the plan in real
source, challenges it, verifies what would change it, and strips overbuilding
before handing off.

This is planning, not execution. Do not edit implementation source, apply
the plan, publish, or overwrite an original plan without explicit post-plan
approval. If there is nothing to plan — pure explanation, research, or
ideation — redirect to the right skill instead of inventing a plan.

## Core Promise

Every plan should be:

- grounded in current source, docs, repo instructions, screenshots, commands, or
  external references when they matter
- aware of existing owners and reusable work before adding new work
- explicit about the data, contract, UI, platform, test, and rollout boundaries
  that affect implementation
- challenged for false premises, missing preconditions, weak verification,
  ownership mistakes, and overbuilding
- revised only from findings that survive fresh verification
- stopped at the apply/keep gate unless the user separately approves execution

## Size The Effort First

Pick the lightest path that produces a plan you would trust, then stop adding.

- **Inline plan** — a focused repo read and a compact plan, no subagents. Use
  when the change is local, the owners are obvious, and a wrong guess is cheap to
  correct: a bug fix, a small refactor, a single-file or single-surface change.
- **Deep pass** — subagent grounding and an adversarial review before handoff.
  Use when any of these holds: the work crosses modules, layers, services, or
  data owners; it depends on schema, sync, API, platform, or contract behavior;
  it changes visible UI that needs current screens or a chosen visual target;
  external framework behavior may have drifted; the draft carries risky
  assumptions, new dependencies, or broad refactors; or the user asked to deeply
  plan or stress-test.

When unsure, start inline and escalate the moment grounding or critique would
change the plan. Do not run a deep pass just to look thorough.

## Planning Loop

Work through this order; do not narrate the machinery unless it helps the user.

1. **Understand the job.** New plan or upgrade? Name the user moment, target
   behavior, affected surface, and implementation boundary. Ask one concise
   question only when a missing decision would materially change the plan.
   Follow [clarify](../clarify/SKILL.md) for the question's shape and for
   triaging which decisions are actually blocking; this planning flow still
   caps itself at that one question.
2. **Ground.** Decide what the plan must know, then read it: named docs and
   source first, then nearby conventions, owners, tests, screens, schema,
   contracts, local skills, and external guidance as the task needs. Capture
   load-bearing facts with paths, symbols, commands, or links.
3. **Draft.** Sequence the work from durable foundation to user-facing surface to
   verification. Prefer reuse, narrow ownership, small slices, and proof at each
   step. For an upgrade, treat the user's artifact as the draft and preserve
   working sections.
4. **Challenge.** Pressure-test the draft against the lenses below.
5. **Verify.** Re-read source, run searches or commands, inspect screenshots, or
   ask a focused subagent to confirm disputed claims. Do not change the plan from
   plausible but unverified critique.
6. **Tighten and hand off.** Fold confirmed findings in, remove or defer
   unnecessary work, and output the plan in the
   [output contract](references/output-contract.md)'s shape.

## Challenge Lenses

Look for the strongest plan-changing problems, ranked by implementation impact:

- false or stale premises, and "already done" or "already safe" assumptions
- missing preconditions or hidden sequencing dependencies
- existing owners to reuse instead of rebuilding
- unclear ownership, layering, contracts, or data flow; layer moves that ignore
  transitive references
- UI, accessibility, design-system, or current-screen mismatches
- weak verification, or proof that does not test real behavior
- risky version, SDK, dependency, schema, or release assumptions
- overengineering: abstractions, shims, or broad refactors with no current
  producer, consumer, and proof path

## Subagent Workflow

Use subagents as planning tools, not ceremony — most useful when they keep broad
exploration, logs, screenshots, or critique out of the main context and return a
concise, sourced answer. Give each subagent a specific question, source
boundary, evidence bar, output shape, and stop condition. Use
[subagent-briefs.md](references/subagent-briefs.md) for the brief shapes.

- **Research subagents** when the plan depends on broad or unfamiliar context:
  repo conventions, current app state, data ownership, external best practice,
  screenshots, or technology-specific docs.
- **Adversarial subagents** when the plan is risky, cross-module, design-heavy,
  data-bearing, or likely to overbuild. Give them the draft and ask for the
  strongest evidence-grounded, plan-changing findings. The parent owns
  verification and final synthesis.

For a deep pass, fan out only independent research lanes, draft once, then run
one adversarial critique pass. Verify findings before adopting them. Run a
focused follow-up only when a material disputed claim remains and its answer
would change the plan; do not loop until critics run out of comments. Prefer a
few focused lanes and stop once the plan has enough truth and sequencing to
implement. The parent owns synthesis and the final plan; subagent output is
evidence, not the deliverable. Keep overlapping write scopes in the parent
unless the harness provides real isolation.

## Feature And UI Planning

For feature work, plan like a senior implementer: find the repo's own way of
building features before inventing one. Look for repo and feature-building docs,
product, architecture, and design specs, schema and record ownership, the API,
state, routing, and UI contracts the feature depends on, current screens,
design-system primitives, relevant local skills, and the test, preview, and
release lanes.

When the work changes visible UI and the visual target is not already chosen,
settle the visual direction before the plan gets too specific: inspect current
screenshots, use the appropriate design skill or Image Gen to create or compare
mockups, select a target, then plan against it and the repo's design system.
Mockups guide feel and composition; current source and product docs still own
semantics, data, and platform behavior.

## Output And Handoff

Default to saving the plan with the repo's plans convention; in chat, give a
concise summary, not the full plan. Follow
[output-contract.md](references/output-contract.md) for the plan shape, optional
sections, upgrade rules, structural checks, and changelog.

Use ordinary planning language in generated artifacts, filenames, headings, chat
summaries, and handoffs: `plan` or `implementation plan`.

## Final Check

Before calling the plan done:

- the output is a plan or upgraded plan, not an answer-only reply, and it can
  guide implementation without hidden context from the planning conversation
- implementation has not started without explicit approval
- load-bearing repo, data, UI, contract, or external claims are grounded
- the plan names the steps between the user's request and end-to-end
  implementation
- risky parts were challenged, and plan-changing findings were verified before
  adoption
- overbuilt work was removed, narrowed, or explicitly deferred
- open human decisions are named, not silently settled
- the artifact follows the output contract, or the handoff says why it does not

---
name: ultraplan
description: "Creates or upgrades implementation plans through repo-grounded context gathering, optional subagent research, adversarial critique, verified revisions, and anti-overengineering pressure. Use when the user asks to ultraplan, ultra-plan, stress-test, or deeply plan work; always produces a plan and stops before implementation."
---

# Ultraplan

Ultraplan creates or upgrades implementation plans. Its job is to give the next
agent enough truth, sequencing, and verification to implement the work end to
end with little help from the user.

Use the smallest planning workflow that can produce a plan you would trust. A
small change may need only a focused repo read and a compact plan. A feature,
architecture change, data-bearing workflow, or visual surface may need
subagent research, current screens, design-system guidance, contracts, database
ownership, mockups, and an adversarial pass before the plan is ready.

Ultraplan is planning, not execution. Do not edit implementation source, apply
the plan, publish, or overwrite an original plan without explicit post-plan
approval. If the request is pure explanation or research with nothing to plan,
redirect to the relevant skill instead of inventing a plan.

## Core Promise

Every Ultraplan plan should be:

- grounded in current source, docs, repo instructions, screenshots, commands, or
  external references when they matter
- aware of existing owners and reusable work before adding new work
- explicit about data, contract, UI, platform, test, and rollout boundaries when
  those boundaries affect implementation
- challenged for false premises, missing preconditions, weak verification,
  ownership mistakes, unnecessary complexity, and overbuilding
- revised only from findings that survive fresh verification
- stopped at the apply/keep gate unless the user separately approves execution

## Planning Workflow

Think through the work in this order, but do not narrate the machinery unless it
helps the user understand the plan.

1. **Understand the job.** Identify whether you are creating a new plan or
   upgrading an existing one. Name the user moment, target behavior, affected
   surface, and implementation boundary. Ask one concise question only when a
   missing decision would materially change the plan.
2. **Gather the right context.** Build a small context plan before drafting:
   what must be inspected for this plan to be trustworthy? Read named docs and
   source first, then discover nearby conventions, owners, tests, screens, data
   schema, contracts, skills, and external guidance as needed.
3. **Draft the implementation path.** Sequence the work from durable foundation
   to user-facing surface to verification. Prefer reuse, narrow ownership,
   small slices, and proof at each step.
4. **Challenge the draft.** Pressure-test the plan for false assumptions,
   missing prerequisites, ownership or layering mistakes, weak tests, design or
   accessibility gaps, and overengineering.
5. **Verify what would change the plan.** Re-read source, run searches or
   commands, inspect screenshots, or ask a focused subagent to verify disputed
   claims. Do not change the plan from plausible but unverified critique.
6. **Tighten and hand off.** Fold confirmed findings into the plan, remove or
   defer unnecessary work, then output the plan in the
   [output contract](references/output-contract.md)'s shape.

Read [workflow.md](references/workflow.md) when the task needs a fuller planning
workflow or an existing plan is being upgraded. Read
[deeper-pass.md](references/deeper-pass.md) when subagent research, visual
exploration, or adversarial review would materially improve the plan. Read
[validation.md](references/validation.md) before final handoff.

## Feature Planning Intelligence

For feature work, especially product UI, plan like a senior implementer would:
find the repo's own way of building features before inventing one.

Look for:

- repo instructions and project planning docs
- feature-building or workflow docs such as `docs/BUILDING-FEATURES.md`
- product, architecture, design, and specs
- database/schema docs, repositories, services, and record ownership
- API, model, state, routing, or UI contracts that the feature depends on
- existing screens, screenshots, screen inventories, or simulator capture guides
- design-system primitives, component examples, and nearby implementations
- relevant local skills or plugin docs for the technology being planned
- test suites, preview fixtures, simulator lanes, visual QA, and release checks

When the visual target is not already chosen, plan the visual direction before
the implementation becomes too specific. For substantial UI work, inspect
current product screenshots, use the appropriate design skill or Image Gen to
create or compare mockups when useful, select a target, then plan against the
selected target and the repo's design system. Generated mockups guide feel and
composition; current source and product docs still own semantics, data, and
platform behavior.

## Subagent Use

Use subagents as planning tools, not as ceremony. They are most useful when they
can keep broad exploration, logs, screenshots, or critique out of the main
context and return a concise, sourced answer.

Use research subagents when the plan depends on broad or unfamiliar context:
repo conventions, current app state, database ownership, external best
practices, screenshots, existing feature patterns, or technology-specific docs.

Use adversarial subagents when the plan is risky, cross-module, design-heavy,
data-bearing, or likely to overbuild. Give them the draft plan and ask for the
strongest plan-changing findings, grounded in evidence. The parent owns
verification and final synthesis.

Run another focused pass only when a verified blocker, competing design, or
large uncertainty remains after revision. Do not loop just to look thorough.

## Output And Handoff

Default to saving the plan with the repo's plans convention. In chat, provide a
concise Markdown summary. Follow [output-contract.md](references/output-contract.md)
for full artifact, upgrade, changelog, and handoff rules.

## Final Check

Before calling the plan done:

- The output is a plan or upgraded plan, not an answer-only reply.
- Implementation has not started without explicit approval.
- Important repo, data, UI, contract, or external claims are grounded.
- The plan names the steps in between the user's request and end-to-end
  implementation.
- Risky or ambiguous parts were challenged, and plan-changing findings were
  verified before adoption.
- Overbuilt work was removed, narrowed, or explicitly deferred.
- The artifact follows the output contract, or the handoff says why it does not.

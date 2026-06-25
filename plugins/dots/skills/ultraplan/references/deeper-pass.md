# Deeper Planning Pass

Use this when the plan needs more than a focused parent-agent pass. The goal is
not to look busy; it is to buy better context, better critique, or a clearer
implementation path.

## When To Go Deeper

Add focused research or critique when one of these is true:

- the task touches multiple modules, layers, teams, services, screens, or data
  owners
- local conventions or feature-building docs may materially change the plan
- the plan depends on database/schema, sync, API, platform, or contract behavior
- visible UI work needs current screenshots, design-system rules, mockups, or a
  selected visual target
- external framework or platform behavior may have changed
- a draft contains risky assumptions, broad refactors, new dependencies, or
  compatibility shims
- the user explicitly asks to ultra-plan, deeply plan, or stress-test the work

## What Extra Effort Should Buy

Use deeper planning to answer concrete questions:

- What existing owner should be reused?
- What local workflow or skill should the implementer follow?
- What source truth, data truth, or design truth blocks a naive plan?
- What contracts must exist before the UI or integration layer is meaningful?
- What current screens or user states should shape the target?
- What will prove the work is correct?
- What part of the draft is overbuilt, stale, risky, or sequenced wrong?

## Practical Patterns

**Independent grounding.** Ask a research subagent to inspect a bounded source
area or external guidance and return facts, owners, gaps, and uncertainty.

**Adversarial pass.** Give a draft plan to a critique subagent and ask for the
strongest plan-changing findings. Verify important findings before revising.

**Visual target pass.** For substantial UI, inspect current screenshots and
repo design guidance first. Use Image Gen or visual-design support only when a
target direction is not already chosen, then plan against the selected target.

**Second pass.** Run another focused pass only when a verified blocker, genuine
design fork, or unresolved high-risk uncertainty remains. Stop when the plan has
enough truth and sequencing for implementation.

## Keep It Bounded

- Prefer one or two focused subagents over many broad ones.
- Give each subagent a source boundary, decision question, evidence bar, and
  output shape.
- Do not ask subagents to implement unless the user has separately approved
  implementation and the scope is explicit.
- Do not copy raw subagent reports into the plan. Synthesize the parts that
  change implementation.
- If subagents are unavailable, run the same thinking sequentially and be honest
  about any reduced independence.

## Review Pressure

Every deeper pass should try to catch:

- false "already done" or "safe" assumptions
- missing preconditions or hidden sequencing dependencies
- rebuilds of existing owners
- unclear data, API, UI, platform, or routing contracts
- layer moves that ignore transitive references
- weak verification commands or missing visual/runtime proof
- new dependencies, SDKs, schemas, shims, or abstractions without a real need
- mockups that conflict with product semantics, current app state, or platform
  behavior

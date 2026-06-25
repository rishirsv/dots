# Ultraplan Workflow

Use this when the task needs more than a small inline plan, or when an existing
plan/spec/design doc must be upgraded. Keep analysis read-only until synthesis
writes plan artifacts.

## Context Plan

Before drafting, decide what the plan must know. Keep this lightweight and
task-specific; it is an internal planning move, not a separate user-facing
output.

Common context lanes:

| Lane | Inspect when |
| --- | --- |
| Repo conventions | The task touches code, docs, tests, release, or local workflow. |
| Feature-building docs | The repo owns a how-to-build-features process or local plugin guidance. |
| Existing owners | The plan might duplicate existing UI, services, repositories, routes, or tests. |
| Data and contracts | Persistence, sync, API, state, schema, model, or interface boundaries matter. |
| Current screens | UI changes affect app surfaces, visual quality, accessibility, or user flow. |
| Design system | The task changes visible UI, interaction, layout, copy, or component choices. |
| External guidance | Platform APIs, framework behavior, legal/policy, or current best practice may have drifted. |
| Verification | The plan needs build, test, simulator, screenshot, browser, migration, or release proof. |

For code work, read repo instructions and the smallest set of source files,
docs, tests, screenshots, and scripts needed to avoid false premises. For an
existing plan, read the plan in full and preserve a diffable original before
rewriting.

## Planning Flow

Use one flow for new plans and plan upgrades:

1. **Ground.** Gather the context that changes the plan. Capture load-bearing
   observations with paths, symbols, commands, screenshots, or source links.
2. **Draft.** Write the implementation path. For an existing plan, treat the
   user's artifact as the draft and preserve any working sections.
3. **Challenge.** Look for the strongest plan-changing problems across the
   active pressure points:
   - false or stale premises
   - missing prerequisites or sequencing gaps
   - reuse opportunities
   - unclear ownership, layering, contracts, or data flow
   - UI, accessibility, design-system, or current-screen mismatches
   - weak verification or proof that does not test behavior
   - risky version, SDK, dependency, schema, or release assumptions
   - overengineering without a current producer, consumer, and proof path
4. **Verify.** Re-check findings that would change the plan. Default to leaving
   a critique out unless a fresh read, command, screenshot, or focused subagent
   result shows it is real.
5. **Tighten.** Turn confirmed findings into plan changes. Convert false
   premises into preconditions, "build X" into reuse when an owner exists, and
   broad abstractions into narrower slices when the current goal does not need
   them.
6. **Validate.** Check the finished plan against
   [validation.md](validation.md), then stop before implementation.

## Feature Planning Recipe

For meaningful feature work, develop the missing steps between "build the
feature" and "ship a correct implementation."

Plan through:

1. **User moment and surface.** What user action, flow, or product state changes?
   Is the surface emotional, operational, utility, backend-only, or mixed?
2. **Local process.** What repo docs, skills, or playbooks define how this kind
   of feature should be built?
3. **Ownership.** Which module owns data truth, platform behavior, state,
   navigation, UI, tests, and release or migration proof?
4. **Contracts.** What interfaces, models, persistence rows, API shapes,
   state machines, or view contracts must exist before UI polish is meaningful?
5. **Current experience.** Which current screens, screenshots, docs, or routes
   show the surrounding product reality?
6. **Visual target.** If the feature changes visible UI and the target is not
   already chosen, plan concept generation, mockup comparison, or target
   selection before implementation steps become too detailed.
7. **Implementation sequence.** Usually build durable data/contract behavior,
   then feature state and routing, then UI with local primitives, then
   accessibility and previews.
8. **Proof.** Name focused automated checks, manual checks, simulator or browser
   checks, visual comparison, and any proof limits.

## Subagent Briefs

Use dynamic briefs. Give the subagent the decision you need, the source
boundary, the evidence bar, and the output shape. Do not hand them a rigid form
when a focused question would work.

### Research

Use for broad current-state discovery or external guidance.

```text
You are grounding an implementation plan before it is drafted or revised.
Repo/root or source boundary: <BOUNDARY>
Task: <TASK>
Decision the parent needs: <QUESTION>

Return a concise sourced map:
- facts that change the plan, with paths, commands, screenshots, or links
- existing owners or patterns to reuse
- contradictions, gaps, or risks
- remaining uncertainty

Do not modify files. Do not write the plan.
```

### Adversarial Review

Use after a draft exists and the plan would benefit from independent pressure.

```text
You are adversarially reviewing an implementation plan.
Plan: <PLAN>
Source boundary: <REPO_OR_CONTEXT>
Focus: <lenses or risk areas>

Find the strongest real problems that would change the plan. Ground each in
evidence. Prefer findings that reduce scope, reuse existing owners, fix
sequencing, clarify contracts, improve verification, or remove overengineering.
Return at most 8 findings, ranked by implementation impact. Do not invent issues
to justify the pass. Do not modify files.
```

### Visual Target

Use when UI direction matters and the repo has not already selected a target.

```text
You are planning visual direction before implementation.
Product context: <PRODUCT_OR_REPO_DOCS>
Current screens/references: <SCREENSHOTS_OR_PATHS>
Feature: <FEATURE>

Return:
- what current product reality must be preserved
- concept directions worth generating or comparing
- states/screens that need mockups
- constraints from product semantics, data, platform behavior, and design system
- selection criteria for the target to build toward
```

## Plan Upgrade Notes

For an existing-plan upgrade:

- preserve unchanged working sections
- rewrite only where confirmed findings or a chosen simplification require it
- keep refuted findings, losing alternatives, and rejected claims out of the
  plan body
- put confirmed changes, refutations, and open human decisions in the changelog
- follow the input format unless it is broken or the user asks for another one

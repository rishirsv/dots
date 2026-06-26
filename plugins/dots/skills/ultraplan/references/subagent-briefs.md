# Ultraplan Subagent Briefs

Use dynamic briefs. Give the subagent the decision you need, the source
boundary, the evidence bar, and the output shape — not a rigid form when a
focused question would work. Do not copy raw subagent reports into the plan;
synthesize only the parts that change implementation. Do not ask subagents to
implement unless the user has separately approved execution and the scope is
explicit.

## Research

Broad current-state discovery or external guidance.

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

## Adversarial Review

Independent pressure on a draft.

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

## Visual Target

UI direction when the repo has not already selected a target.

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

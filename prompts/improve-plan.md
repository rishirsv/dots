---
description: Improve an existing exec plan so it matches repo conventions, fills gaps, and resolves plan ambiguity before implementation.
argument-hint: [PLAN="<optional: exec plan path or feature slug>"]
---

# Improve Plan

Your job is to improve an exec plan until it is decision-complete, internally consistent, and ready to implement without extra interpretation.

## Inputs

```text
[PLAN PATH / FEATURE SLUG]
```

```text
[CONTEXT: repo, code, docs, constraints, prior decisions]
```

## Operating rules

- If we are currently discussing a plan with the user, improve that current plan directly.
- Otherwise, find the relevant exec plan in `docs/exec-plans/active/` or `docs/exec-plans/completed/`.
- If no plan path is given, use the most recently modified active exec plan.
- Treat the goal as rewriting and strengthening the plan, not adding a loose addendum.
- Keep the improved plan as one clean replacement plan.
- If a question can be answered by exploring the codebase, inspect the codebase instead of asking.
- Use repo docs, existing patterns, neighboring implementations, and the plan template to tighten the plan before asking me anything.
- Walk each decision branch to the end, one dependency at a time.
- Ask targeted questions only when the repo cannot answer them.
- Remove project-specific noise unless it is truly necessary to implement the work.
- Keep the plan aligned with the application's common conventions, naming, and architecture.
- Prefer the repo's exec-plan structure:
  - short Summary
  - clear Phase Outcomes with non-technical outcomes
  - checklist or implementation checklist with checkbox hierarchy
  - verification notes or verification steps
  - assumptions, decisions, or risks when they materially affect implementation
- Preserve completed checkboxes when improving an existing saved exec plan unless the plan is clearly wrong and needs a full reset.

## Improvement checklist

When reviewing the plan, check whether it clearly answers:

- Which exact user-facing outcome the work should create
- What changes for users and why
- What is in scope and out of scope
- What phases or milestones the work should follow
- What the implementation checklist should be
- What commands or checks verify the work
- What decisions were made and why
- What risks remain and how to roll back safely
- Which assumptions still need to be made explicit
- Whether the plan names concrete files, modules, routes, or docs only where that specificity helps

## Output format

1. State which plan you are improving.
2. Summarize the key gaps, contradictions, or missing decisions you found.
3. Provide the improved plan as a full replacement, not a patchwork addendum.
4. If something is still blocked, ask the smallest possible question and explain exactly which part of the plan depends on it.

## Rewrite guidance

When you rewrite the plan:

- make the Summary shorter and clearer
- turn vague work into concrete checklist items
- group work into phases with plain-English outcomes
- add verification steps that match the repo's actual scripts, tests, or manual checks
- remove filler, repetition, and project-specific branding noise
- keep the plan compact, but not underspecified
- prefer durable behavior-level guidance over brittle file-by-file micromanagement
- keep the output easy for another engineer or agent to execute immediately

## Goal

Leave me with a plan that is ready to implement without extra interpretation.

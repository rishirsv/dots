# Plan Format

A Plan is a decision-complete implementation handoff. It can be chat-only or
saved under the repo's planning directory, usually `.plans/`. Use the smallest
Plan that lets another engineer or agent implement the work without making
product, architecture, interface, or validation decisions.

When a repo has a Work Tracker, one saved Plan should belong to one work item.
The tracker chooses and sequences work; the Plan explains how to implement the
selected item.

## Use A Saved Plan When

- The work is multi-step, risky, or likely to cross sessions.
- Another engineer or agent will implement from the artifact.
- The user wants to review the approach before code changes.
- The plan needs durable assumptions, test expectations, or stop rules.
- A Work Tracker item needs implementation detail.

## Do Not Save A Plan When

- A short chat checklist is enough.
- The main question is product scope or user value. Use a PRD.
- The main question is a language-agnostic system contract. Use a project spec.
- The information belongs in durable docs such as `AGENTS.md`,
  `ARCHITECTURE.md`, a runbook, or API docs.

## Planning Behavior

- Explore first; ask only after targeted, non-mutating repo inspection.
- Do not ask questions that source files, configs, tests, or docs can answer.
- Ask preference or tradeoff questions early when they materially affect the
  plan.
- Make the final Plan decision-complete. The implementer should not need to
  choose architecture, behavior, interfaces, tests, or defaults.
- Record important defaults as assumptions when the user does not answer.

## Standard Shape

Use this compact shape by default:

1. Summary
2. Implementation Changes
3. Test Plan
4. Assumptions

Add optional sections only when they prevent likely mistakes:

- Public Interfaces
- Scope
- Stop Rule
- Notes

## Writing Rules

- Prefer 3-5 short sections.
- Group implementation bullets by subsystem or behavior.
- Mention files only when needed to disambiguate non-obvious work.
- Avoid naming more than 3 paths unless extra specificity prevents mistakes.
- Prefer behavior-level descriptions over symbol-by-symbol change lists.
- Do not invent schema, precedence, fallback, validation, migration, rollout,
  or wire-format policy unless the request establishes it or it prevents a
  concrete implementation error.
- Keep bullets short and avoid explanatory sub-bullets unless needed for safety.
- Do not include progress logs, decision logs, discovery journals, recovery
  essays, or long artifact transcripts by default.
- Do not include queue state, roadmap narrative, or unrelated deferred ideas.
  Put those in the Work Tracker.

## Template

Use [assets/PLAN_template.md](../assets/PLAN_template.md) to seed a new saved
Plan.

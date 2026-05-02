---
name: tech-debt
description: Review a repo, module, feature area, or recent work for architectural tech debt and update TECH-DEBT.md. Use when the user asks to audit tech debt, improve codebase architecture, find refactors, review module ownership, identify maintainability debt, or create/update a focused tech-debt backlog.
---

# Tech Debt

Find real architectural debt, rank the most useful refactors, and record them in `TECH-DEBT.md`.

This is not a routine cleanup pass for the current diff. It is for durable architecture, ownership, maintainability, and verification debt.

## Workflow

### 1. Read Review Guidance

Before judging architecture, search for repo-specific review guidance with a grep-able pattern:

```bash
{ find . -maxdepth 1 -type f -iname '*review*.md'; find docs .codex -type f -iname '*review*.md'; } 2>/dev/null
```

Extract:

- review priorities and severity meanings
- required evidence standards
- relevant docs, plans, specs, or parity sources
- repo-specific skill, plugin, or tool lenses

Consider relevant available skills or plugins as review lenses when they apply. If there is no review guidance, say so briefly and proceed with this skill's default architecture lenses.

### 2. Resolve Scope

Identify the module, feature area, package, or recent work to review. If the request is too broad, choose the highest-risk or highest-change area and state the assumption.

When recent-change volume is the best available fallback, use:

```bash
git log --since=3.months --pretty=format: --name-only | sort | uniq -c | sort -rn | head
```

Read local context before reviewing: README, architecture docs, ADRs, product specs, active plans, completed plans near the area, tests, and existing `TECH-DEBT.md`.

### 3. Locate `TECH-DEBT.md`

Update the repo's existing `TECH-DEBT.md` if present.

If no `TECH-DEBT.md` exists, ask before creating one unless the user explicitly asked to create a debt tracker. Do not write tech-debt items into a general work tracker.

### 4. Build The Module Model

Summarize the area in working notes before adding findings:

- owners and entrypoints
- core flows
- dependencies
- public interfaces
- test and verification surface
- repo vocabulary for the concepts involved

Keep assumptions and unknowns separate from findings.

### 5. Review With Lenses

Start with the repo's review contract and relevant skill/plugin lenses. Then apply the architecture lenses in [architecture-lenses.md](references/architecture-lenses.md).

For broad reviews, spawn review agents in parallel with these four lens groups and aggregate their findings into one result:

- repo-guidance reviewer: review priorities, evidence rules, and repo-specific skill/plugin lenses
- architecture/deepening reviewer: module depth, interfaces, seams, locality, and leverage
- duplication/ownership reviewer: duplicated concepts, wrong shared homes, repeated policies, and multiple sources of truth
- verification-risk reviewer: test surface, risky flows, build/test gates, and missing proof

### 6. Decide What Is Real Debt

Log only concrete debt with repo evidence. Do not create a wishlist.

A candidate is usually real debt when:

- the same behavior, policy, or concept appears in multiple places
- ownership is unclear or in the wrong layer
- callers know too much about an implementation
- the current shape makes future work or verification meaningfully harder
- the fix can be described as a bounded refactor

Do not log:

- generic style preferences
- speculative rewrites
- platform-specific implementations with genuinely different runtime behavior
- generated, vendored, or snapshot code
- abstractions that would be larger than the problem

### 7. Update `TECH-DEBT.md`

Use the structure in [tech-debt-template.md](references/tech-debt-template.md). Preserve the repo's existing format when it already has one.

Before adding an item, scan existing entries. Merge, amend, or annotate an existing item rather than duplicating it.

Each item should include:

- status
- where
- what is wrong
- why it matters
- simplest useful fix
- verification

Include `Intentionally Not Debt` entries when a rejected candidate is likely to be re-suggested by future agents.

Maintain a lifecycle:

- Keep open work in `Queue`; list order is priority, and the top item is the recommended next debt refactor.
- Move completed or obsolete items to `Resolved` with a short note and date, unless the repo already removes resolved items.
- If removing resolved items, leave a short review note so future agents understand why the queue changed.

### 8. Finish

End with a concise summary:

- whether `TECH-DEBT.md` was updated
- top items added or changed
- recommended first refactor
- whether the next step should be direct implementation, planning, or no action

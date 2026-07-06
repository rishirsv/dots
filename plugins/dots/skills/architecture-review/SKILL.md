---
name: architecture-review
description: "Reviews a codebase or subsystem for structural refactor candidates, architecture ownership problems, shallow modules, weak seams, duplicated policy, and hard-cut cleanup opportunities. Explicit-only after-the-fact architecture review; not post-implementation diff cleanup, planning-only work, or direct feature work."
---

# Architecture Review

Review a codebase or subsystem for structural refactor candidates and architecture improvement opportunities. Surface candidates first; do not start a broad refactor until the user chooses a candidate or explicitly asks for implementation.

Default to hard-cut architecture: one canonical owner, one current path — hard-cut-policy.md defines the posture, exception rule, and cleanup checklist.

## References

- Read [architecture-language.md](references/architecture-language.md) before naming architecture problems. Use its vocabulary exactly.
- Read [architecture-ownership.md](references/architecture-ownership.md) when a finding involves code placement, runtime ownership, duplicate policy, or canonical long-term ownership.
- Read [test-consolidation.md](references/test-consolidation.md) when a refactor changes test placement, duplicates tests, or creates a new test surface.
- Read [hard-cut-policy.md](../../references/hard-cut-policy.md) for every architecture review or refactor. It defines the default hard-cut posture, exception rule, and cleanup checklist.
- Read [interface-design.md](references/interface-design.md) only after the user selects a candidate and wants alternative interface designs.

## Scope

Start by clarifying the review target from the user request, current branch, touched subsystem, or named files. If the user asks for a broad scan, map the top-level repository structure before drilling into a subsystem.

Read applicable `AGENTS.md` and other review guidance before recommending changes: architecture docs, ADRs/design docs, ownership docs, module READMEs, and relevant tests.

Keep only repo guidance that changes the recommendation; higher-priority instructions still win.

If docs are incomplete, infer the current layer model from the code and state the assumption.

## Exploration

Explore organically and note where the code fights the reader:

- understanding one concept requires bouncing between many small modules
- watch for shallow modules
- pure functions were extracted for testability, but the real bugs hide in how callers coordinate them
- tightly coupled modules leak across their seams
- duplicate policy exists in more than one layer
- runtime orchestration owns product policy that belongs in a domain, application, or shared core layer
- tests assert the same invariant in several places or test past the interface
- compatibility, fallback, migration, or dual-shape code persists without a real external boundary

For broad scans, add evidence from recent change patterns when it is cheap to
inspect: churn around the same modules, repeated edits to the same concept,
duplicated call patterns, flaky or failing tests, and files accumulating
unrelated responsibilities.

Use fresh explorer or researcher subagents for large scans when available. Pass each subagent the compact repo guidance summary, relevant architecture docs, required domain skills, and the vocabulary from [architecture-language.md](references/architecture-language.md). Keep the parent agent responsible for the final recommendation.

## Candidate Bar

A good candidate should improve locality, leverage, testability, or AI-navigability. Prefer candidates that delete concepts, concentrate ownership, or make the interface a stronger test surface.

Do not list speculative refactors just because they are imaginable. A candidate needs visible friction in the code, tests, docs, or change pattern.

Apply the deletion test (architecture-language.md).

## Output

Default to a ranked candidate report in chat unless the user asks for a file or the candidate set needs diagrams. Shape the report however best serves the candidates found; a useful report covers three things per candidate:

1. **The problem** — what friction the current architecture causes, where it lives (files, seams, competing owners), and the evidence.
2. **The change** — what would move, merge, deepen, or disappear, in plain English, including any hard cuts and where the owning invariant should be tested.
3. **The payoff and confidence** — how locality, leverage, testability, or navigability improves, and whether this is strongly recommended, worth exploring, or speculative.

Write for the repo owner deciding what to do next: lead with the strongest candidate and why, keep candidates scannable, and skip dimensions that don't apply rather than filling in every field.

Ask which candidate the user wants to explore before designing interfaces or editing code. If the user has already asked to implement, pick the strongest candidate, state the plan, and keep the patch scoped to that candidate.

## Candidate Loop

After the user chooses a candidate:

1. Restate the problem space, constraints, dependency category, and current seam.
2. Identify the behavior that must stay true, the current tests or commands that prove it, and the owning invariant. If the behavior is important and untested, characterize it before making behavior-adjacent edits.
3. If the interface is not obvious, use [interface-design.md](references/interface-design.md) to generate alternative interface designs.
4. Compare designs by depth, locality, seam placement, adapter need, and test surface.
5. Recommend one path. Be opinionated.
6. Only then implement, and only inside the approved candidate scope.

## Boundaries

- Do not turn a broad scan into a drive-by refactor.
- Do not propose interfaces before the user chooses a candidate unless the user explicitly asks.

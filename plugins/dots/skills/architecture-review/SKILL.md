---
name: architecture-review
description: "Audit a codebase or subsystem for structural refactors, misplaced ownership, duplicated policy, weak boundaries, and code to consolidate or delete. Use for broad architecture and cleanup reviews, not explanation-only requests or reviews limited to defects introduced by a selected change."
---

# Architecture Review

Review a codebase or subsystem to find changes that would improve its structure.
Report proposed changes first; do not start a broad refactor until the user
chooses a candidate or explicitly asks for implementation.

By default, use one module responsible for each rule and one current code path,
except where persisted data or an external contract requires compatibility.

## References

- Read [harness-audit.md](references/harness-audit.md) when reviewing an AI agent harness or a subsystem that assembles model requests, exposes tools, manages context, or coordinates agents. It adds cost and reliability checks to the candidate review; ordinary codebases without these components do not need it.
- Read [architecture-language.md](references/architecture-language.md) when terminology would clarify a structural finding or a candidate proposes deleting an abstraction. Preserve the repository's established vocabulary.
- Read [architecture-ownership.md](references/architecture-ownership.md) when a finding involves code placement, runtime ownership, duplicate policy, or canonical long-term ownership.
- Read [duplicate-ownership.md](../../references/duplicate-ownership.md) when a finding involves a second source of truth, copied policy, normalization, or competing rule owners.
- Read [test-consolidation.md](references/test-consolidation.md) when a refactor changes test placement, duplicates tests, or creates a new test surface.
- Read [hard-cut-policy.md](../../references/hard-cut-policy.md) when a candidate replaces a schema, contract, persisted shape, or current path. It defines the exception rule and cleanup checklist.
- Read [interface-design.md](references/interface-design.md) only after the user selects a candidate and wants alternative interface designs.

## Scope

Start by clarifying the review target from the user request, current branch,
touched subsystem, or named files. If the user asks for a broad scan, map the
top-level repository structure before inspecting a subsystem in detail.

Read applicable `AGENTS.md` and other review guidance before recommending changes: architecture docs, ADRs/design docs, ownership docs, module READMEs, and relevant tests.

Keep only repo guidance that changes the recommendation; higher-priority instructions still win.

If docs are incomplete, infer the current layer model from the code and state the assumption.

Find structural problems across the requested codebase or subsystem, including
existing problems outside recent changes. Stay within that target; a structural
issue found in a diff does not by itself expand the request into a broad audit.

## Exploration

Follow the relevant code paths. Look for structures that make the code difficult
to understand or change:

- understanding one concept requires reading many small modules
- modules expose nearly as much complexity as their implementation contains
- pure functions have separate tests, but defects occur when callers coordinate
  them
- modules depend on each other's internal decisions
- duplicate policy exists in more than one layer
- runtime orchestration owns product policy that belongs in a domain,
  application, or shared core layer
- tests assert the same invariant in several places or test past the interface
- compatibility, fallback, migration, or dual-shape code persists without a real
  external boundary

For broad scans, add evidence from recent change patterns when it is cheap to
inspect: frequent changes to the same modules, repeated edits to the same
concept, duplicated call patterns, flaky or failing tests, and files
accumulating unrelated responsibilities.

Use fresh read-only explorers when distinct evidence paths can be investigated
independently and the benefit exceeds coordination cost. Give each a bounded
question and the guidance needed to answer it; repository size alone does not
justify delegation. The parent integrates the findings and owns the recommendation.

## Candidate Bar

For each proposed refactor, explain which changes would become easier to make,
test, or trace through the code. Prefer changes that remove unnecessary
concepts, put each responsibility in one place, or let tests verify behavior
through the public interface.

Do not list speculative refactors just because they are imaginable. Support each
candidate with a problem visible in the code, tests, documentation, or recent
changes.

For a candidate that deletes an abstraction, apply the deletion test in
[architecture-language.md](references/architecture-language.md).

## Output

Default to a ranked candidate report in chat unless the user asks for a file or the candidate set needs diagrams. Shape the report however best serves the candidates found; a useful report covers three things per candidate:

1. **The problem:** which problems the current architecture causes, where they
   occur (files, boundaries, competing owners), and the evidence.
2. **The change:** which code or responsibilities would move, merge, become
   private behind an interface, or disappear, in plain English, including any
   hard cuts and where the owning invariant should be tested.
3. **The payoff and confidence:** which work becomes easier to change, use,
   test, or trace, and whether this is strongly recommended, worth exploring, or
   speculative.

Write for the repo owner deciding what to do next: lead with the strongest candidate and why, keep candidates scannable, and skip dimensions that don't apply rather than filling in every field.

For an audit-only request, return the candidates before designing interfaces or
editing code. When implementation is authorized, carry out the supported changes
within that scope. Choose one candidate only when the user asked for one; a
request to fix all supported findings is not limited to the highest-ranked item.
Ask only when a remaining product or scope decision changes the work.

## Candidate Loop

For each candidate selected by the user or covered by the implementation request:

1. Describe the problem and its constraints. Name the affected modules and their
   current boundary. Classify their dependencies using the categories in
   [interface-design.md](references/interface-design.md).
2. Identify the behavior that must stay true, the current tests or commands that
   prove it, and the rule that the responsible module must maintain. If
   important behavior has no tests, record its current results with a repeatable
   check before changing code that could affect it.
3. If the interface is not obvious, use
   [interface-design.md](references/interface-design.md) to generate alternative
   interface designs.
4. Compare designs by depth, locality, seam placement, adapter need, and test
   surface.
5. Recommend one path. Be opinionated.
6. Only then implement, and only inside the approved candidate scope.

## Boundaries

- For a review-only request, report findings before changing code.
- Design replacement interfaces only for selected candidates or an authorized
  implementation scope.

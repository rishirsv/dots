# Review Checklists

Read this when running `standard` or `max` rigor. The `quick` tier does a
single direct pass over the hunk instead and does not need these checklists.

## 1. Correctness Checklist

This checklist is the correctness pass used by
[../skills/code-review/SKILL.md](../skills/code-review/SKILL.md).

1. **Logic errors and edge cases**: off-by-one, inverted or wrong conditions,
   bad operator choice, and boundary or empty/null/zero/overflow inputs.
2. **Regressions**: behavior changes that break an existing caller, invariant,
   contract, or test.
3. **Error handling**: missing, swallowed, or over-broad handling; unhandled
   promise rejections; resources or locks not released on failure.
4. **Tests and docs gaps the change introduces**: an invariant left untested, or
   a doc/comment now stale because of this change.

## 2. Reuse and Structural Simplification Checklist

For each change:

1. **Search for existing utilities and helpers** that could replace newly written
   code. Use `rg` to find similar patterns in utility directories, shared
   modules, and files adjacent to the change.
2. **Flag new functions that duplicate existing functionality.** Name the
   existing function or module to use instead.
3. **Flag inline logic that could use an existing utility** such as hand-rolled
   string manipulation, manual path handling, custom environment checks, ad-hoc
   type guards, or bespoke parsing.
4. **Look for structural simplifications** that preserve behavior while deleting
   branches, modes, helper layers, special cases, wrappers, or concepts.
5. **Ask for the biggest simplification.** Can the change be reframed so whole
   branches, modes, helpers, concepts, or compatibility paths disappear while
   behavior stays the same?
6. **Ask whether a clearer reframing would delete the problem instead of
   polishing it.** Prefer changing the model, ownership boundary, or default
   flow when that removes code.
7. **Flag refactors that move complexity around without reducing it.**
8. **Flag feature-specific logic added to shared or unrelated paths.** Push logic
   toward the canonical package, module, helper, or abstraction that owns the
   concept.
9. **Flag new ad-hoc conditionals and one-off flags** that make the existing flow
   harder to reason about. Treat special-case branches added into already busy
   flows as structural findings unless the ownership boundary is clearly right.
10. **Notice changed source files that are becoming hard to navigate.** Large
    files are not automatically wrong, especially generated outputs, data
    files, JSON layouts, or codebases where the format is inherently bulky.
    When a source file becomes mixed-purpose, crosses a locally unusual size
    threshold, or nears roughly 1,000 lines without a strong reason, consider a
    focused module with a descriptive name.

## 3. Code Quality and AI Slop Checklist

1. **Redundant state**: state that duplicates existing state, cached values that
   could be derived, observers/effects that could be direct calls.
2. **Parameter sprawl**: new parameters or booleans instead of clearer ownership
   or a generalized existing shape.
3. **Copy-paste with slight variation**: near-duplicate blocks that should be a
   shared abstraction or one simpler flow.
4. **Leaky abstractions**: exposed internals or broken ownership boundaries.
5. **Stringly-typed code**: raw strings where constants, enums, string unions, or
   branded types already exist.
6. **Needless abstraction**: pass-through wrappers, single-use helper layers,
   identity helpers, speculative indirection, or generic mechanisms hiding a
   simple data shape.
7. **Over-defensive code**: try/catch around code that cannot throw, null checks
   on non-null values, impossible fallback defaults, or broad guards that hide
   invariants.
8. **Dead code and debug leftovers**: unused imports, unreachable branches,
   stale feature flags, console logging, commented-out code, and abandoned
   scaffolding.
9. **Unnecessary comments and narration**: comments that restate obvious code,
   explain what changed instead of why it must exist, or sound like task notes.
10. **Cast-heavy or loose contracts**: `any`, `unknown`, forced casts,
    unnecessary optionality, or ad-hoc object shapes used to bypass clear types.
11. **Inconsistent local style**: naming, error handling, imports, testing, or
    module shape that ignores the surrounding code.

## 4. Efficiency and Atomicity Checklist

1. **Unnecessary work**: redundant computations, repeated file reads, duplicate
   network/API calls, or N+1 patterns.
2. **Missed concurrency**: independent operations run sequentially.
3. **Hot-path bloat**: new blocking work added to startup or per-request,
   per-render, polling, or event-handler paths.
4. **Recurring no-op updates**: state/store updates inside loops, intervals, or
   handlers that fire unconditionally. Add a change-detection guard when nothing
   changed.
5. **Updater no-op contracts**: if a wrapper takes an updater/reducer callback,
   verify it honors same-reference returns or the local no-change signal.
6. **Unnecessary existence checks**: pre-checking file/resource existence before
   operating. Operate directly and handle the error.
7. **Memory**: unbounded data structures, missing cleanup, event listener leaks,
   and long-lived closures that retain large enclosing scopes.
8. **Overly broad operations**: reading whole files when only a portion is
   needed, or loading all items when filtering for one.
9. **Concurrency correctness**: when work is parallelized, confirm the operations
   are independent. Flag shared-state races, missing `await`, ordering
   assumptions, or non-atomic read-modify-write sequences.

## Reviewer Prompt Shape

Use this prompt shape for each reviewer:

```text
You are a review-only agent. Do not edit files.

Scope:
- Changed files: <paths>
- Review rigor: <quick | standard | max>
- Repo guidance: <compact guidance summary>
- Additional user focus: <focus or none>

Full diff:
<diff>

Apply only this lens: <Correctness | Reuse and Structural Simplification | Code Quality and AI Slop | Efficiency and Atomicity | one of the max-tier extra angles>.
Check the changed code against every item below:

<full numbered checklist for the assigned lens>

Use applicable skills, plugins, and repo review guidance for this code. Search
the repository as needed before flagging duplication, missed helpers, or
local-pattern violations.

Return concrete findings only. For each finding include severity, file/line
evidence, summary, failure scenario or concrete maintainability cost, impact,
and proposed fix. If clean, return "no findings".
```

## Max-Tier Extra Angles

For `max`, run the four standard lenses above plus these four extra angles.

A. **Line-by-line diff scan.** Read every hunk line by line, then read the
enclosing function for each hunk. Ask what input, state, timing, or platform
makes each line wrong.

B. **Removed-behavior auditor.** For every deleted or replaced line, name the
invariant or behavior it enforced, then find where the new code re-establishes
it.

C. **Cross-file tracer.** For each changed function, find callers and important
callees. Check changed preconditions, return shapes, exceptions, timing,
ordering, and parallel changes in the same diff.

D. **Language and framework pitfalls.** Scan for pitfalls in the language or
framework being changed: falsy-zero checks, missing awaits, closure capture,
mutable defaults, timezone drift, nil-map writes, float equality, regex escaping,
SQL injection, or equivalent local hazards.

## Final Pass: Big Simplifications

In `max`, add one final pass after the finder agents and before verification.
This pass hunts specifically for a simpler model or ownership boundary that
would delete whole branches, modes, wrappers, or compatibility paths — not
line-level cleanup. Treat these as presumptive findings when the evidence is
visible in the diff:

- A simpler model or ownership boundary would delete whole branches, modes,
  wrappers, compatibility paths, or concepts.
- The diff adds special-case branching into an already busy flow instead of
  moving logic behind the right helper, module, policy, or state model.
- The change causes unjustified file sprawl, especially pushing a file past
  roughly 1,000 lines.
- The implementation adds unnecessary wrappers, generic mechanisms, casts,
  optionality, or fallback behavior that obscures the real contract.
- Feature-specific behavior leaks into shared infrastructure or bypasses a
  canonical helper, type, service, module, or package.
</content>

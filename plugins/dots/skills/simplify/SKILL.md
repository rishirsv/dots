---
name: simplify
description: "Cleans up an already-implemented diff for reuse, simplification, efficiency, and ownership-depth issues, then applies same-scope behavior-preserving fixes. Explicit-only quality cleanup; not for correctness bug hunts, security audits, broad architecture scans, or review-only reports."
---

# Simplify

Clean up changed code after implementation. This is a quality pass, not a bug
hunt: make the diff smaller, clearer, more canonical, and cheaper while
preserving intended behavior.

Apply fixes directly when the user asks to simplify or clean up and the change
stays inside the reviewed scope. If a candidate fix would change product
behavior, require a broader architecture decision, or turn into a correctness
investigation, report it instead of editing.

## Scope

Read applicable repo guidance near the changed files.

Start from the current diff:

```sh
git status --short
git diff --stat
git diff --staged --stat
git diff --name-only
git diff --staged --name-only
```

Choose the review target:

- If the user names a PR, branch, commit range, or file path, review that target.
- If there are staged changes, use `git diff HEAD`.
- If there are unstaged changes, use `git diff`.
- If the working-tree diff is empty, try `git diff @{upstream}...HEAD`, then
  `git diff main...HEAD`, then `git diff HEAD~1`.
- If there are no git changes, review the mentioned files or files edited
  earlier in the thread.

Ask one concise scope question only when several unrelated changes are present
and the cleanup target is ambiguous.

## Review Angles

Use four independent cleanup lenses. When a multi-agent tool is available,
launch the four review-only agents concurrently and give each the same diff,
changed-file list, compact repo guidance, and relevant changed-file contents.
If no subagent tool is available, run the same four passes yourself.

For every finding, require `file`, `line`, `summary`, `cost`, and
`proposed_fix`. Return "no findings" when a lens is clean.

### Reuse

Search for existing helpers, services, components, constants, types, tests, and
adjacent patterns before flagging duplication. Prefer the canonical local
utility over new inline logic, hand-rolled parsing, custom path handling,
one-off environment checks, or bespoke type guards.

### Simplification

Find complexity that can be deleted without changing behavior: redundant or
derivable state, copy-paste variation, deep nesting, pass-through helpers,
single-use wrappers, needless modes, dead code, stale comments, and task-note
leftovers. Name the simpler form.

### Efficiency

Find wasted work introduced by the diff: repeated file or API reads, duplicate
computations, independent work run sequentially, hot-path blocking work,
unconditional no-op updates, unbounded memory growth, and long-lived closures
that retain large objects when a smaller data holder would do. Name the cheaper
alternative and check that any parallelization is actually independent.

### Ownership Depth

Check whether the change lives at the right layer. Prefer fixing or
generalizing the owning mechanism over adding feature-specific conditions to
shared infrastructure. Push policy toward the module that owns the concept, and
avoid moving complexity sideways into a new shallow wrapper.

## Apply

Verify every candidate against the actual files before editing. Drop false
positives and merge duplicates that point at the same line or mechanism.

Apply same-scope, behavior-preserving fixes directly:

- reuse existing helpers or types
- delete redundant branches, wrappers, modes, and dead code
- simplify data flow without changing outputs
- improve efficiency without introducing races or hidden ordering assumptions
- move cleanup to the owning layer when the correct owner is clear and local

Skip and report a candidate when the intended behavior is unclear, the fix would
change behavior, the cleanup would sprawl beyond the reviewed diff, or the
finding is really a correctness/security/architecture-review issue.

If a behavior-adjacent cleanup is important but untested, add the narrowest
regression test first when that stays in scope; otherwise report the cleanup as
deferred.

## Validate

Run the narrowest useful checks after edits:

- targeted tests for touched behavior
- typecheck when types or contracts changed
- lint or formatting checks for import/style/dead-code cleanup
- repo validation commands named by local guidance

Review the final diff for minimality and behavior preservation before handing
back.

## Output

Report:

- `Fixed`: same-scope cleanups applied
- `Skipped`: candidates skipped as false positives, behavior-changing, or out of
  scope
- `Validation`: commands run and results
- `Residual risk`: anything not proven

If no material cleanup survives verification, state the reviewed scope and say
the diff was already clean for this quality pass.

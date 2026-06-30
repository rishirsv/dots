---
name: simplify
description: Review changed code with four mandatory subagents for correctness-aware reuse, simplification, efficiency, and altitude/code-quality issues, then apply same-scope fixes directly.
---

# Simplify

Run a focused post-implementation cleanup: gather the review scope, send it to
four specialized subagents in parallel, verify their findings against the actual
files, and apply the safe fixes directly.

Review the changed code for reuse, simplification, efficiency, altitude,
structural code quality, and local correctness issues that fall naturally out of
those lenses. Correctness is embedded in each lens rather than handled as a
separate pass.

Simplify is autonomous once invoked. Do not ask the user whether to apply
individual cleanup fixes. Apply every verified same-scope, behavior-preserving
cleanup directly. Skip and report only when the fix would change intended
behavior, requires product judgment, needs a broad security or architecture
review, or reaches outside the reviewed scope.

## Phase 0 — Gather the diff

Read applicable repo guidance near the changed files. Determine one review
scope from the user's target and the current repository state:

- If the user names a PR, branch, commit range, or file path, review that target.
- If there are staged changes, review `git diff HEAD`.
- If there are unstaged changes, review `git diff`.
- If the working-tree diff is empty, try `git diff @{upstream}...HEAD`, then
  `git diff main...HEAD`, then `git diff HEAD~1`.
- If there are no git changes, review the mentioned files or files edited
  earlier in the thread.

Capture the changed-file list, compact repo guidance, and the full review diff.
Treat that packet as the review scope.

## Phase 1 — Review (4 cleanup agents in parallel)

Launch **4 independent review-only subagents**, one per lens, in a single tool
message so they run concurrently. Always spawn the subagents. Do not run the
passes yourself as a fallback.

Pass every subagent the same scope packet: changed files, review diff, compact
repo guidance, relevant changed-file contents when the diff alone is
insufficient, and any user focus. Each subagent must return concrete findings
only. For every finding require:

```json
{
  "lens": "reuse",
  "file": "path/to/file.ext",
  "line": 123,
  "summary": "one-line issue",
  "cost": "what can fail, is duplicated, wasted, harder to maintain, or structurally worse",
  "proposed_fix": "smallest behavior-preserving cleanup"
}
```

Return "no findings" when a lens is clean.

### Reuse

Flag new code that re-implements something the codebase already has. Grep
shared/utility modules and files adjacent to the change, then name the existing
helper to call instead. Also flag bespoke helpers, constants, types, policies,
parsing, path handling, environment checks, or type guards when a canonical
local mechanism already exists.

Check correctness through reuse: bespoke code often misses edge cases,
normalization, escaping, ordering, policy, or compatibility behavior already
handled by the canonical helper. If the intended behavior is clear, replace the
bespoke path with the canonical one.

### Simplification

Flag unnecessary complexity the diff adds: redundant or derivable state,
copy-paste with slight variation, deep nesting, dead code left behind, needless
wrappers, pass-through helpers, speculative abstraction, optionality churn,
cast-heavy contracts, or generic mechanisms that hide a simple data shape. Name
the simpler form that does the same job.

Be ambitious about structural simplification. Look for a code-judo move that
preserves behavior while making whole branches, modes, helpers, conditionals, or
layers disappear. Prefer deleting complexity over rearranging it.

Check correctness through simplification: redundant state, impossible fallbacks,
over-defensive guards, duplicated branches, and stale compatibility paths can
hide real invariants or let callers observe inconsistent behavior. Prefer a
single explicit model whose outputs are easier to prove.

### Efficiency

Flag wasted work the diff introduces: redundant computation or repeated I/O,
independent operations run sequentially, blocking work added to startup or
hot paths. Also flag long-lived objects built from closures or captured
environments — they keep the entire enclosing scope alive for the object's
lifetime (a memory leak when that scope holds large values); prefer a
class/struct that copies only the fields it needs. Name the cheaper
alternative. Treat unnecessary sequential orchestration and non-atomic related
updates as quality issues when a cleaner structure is obvious.

Check correctness through efficiency: look for missed awaits, accidental
serialization, unsafe parallelization, shared-state races, non-atomic
read-modify-write flows, repeated work that can observe different state, and
partial updates that leave the system inconsistent.

### Altitude

Check that each change is implemented at the right depth, not as a fragile
bandaid. Special cases layered on shared infrastructure are a sign the fix
isn't deep enough — prefer generalizing the underlying mechanism over adding
special cases.

Push hard on structural code quality: flag ad-hoc conditionals inserted into
busy flows, feature logic leaking into shared paths, logic living in the wrong
package/module/layer, files pushed past roughly 1,000 lines without a strong
reason, scattered special cases, and refactors that move complexity around
without reducing the number of concepts a reader must hold.

Use module depth as a quality test. Prefer deeper modules with a small, clear
interface that hides meaningful complexity behind the right owner. Treat the
interface as more than function signatures: include invariants, ordering,
errors, configuration, performance expectations, and the public test surface.
Ask what can be deleted if the boundary is moved to the right place.

Be skeptical of premature seams. One adapter usually proves only a hypothetical
extension point; two real adapters are stronger evidence that the seam has
earned its weight. Delete shallow wrappers that do not hide complexity, enforce
an invariant, or make future changes more local.

Check correctness through altitude: wrong-layer fixes often bypass the owner of
an invariant, duplicate policy in a caller, or patch one path while sibling paths
keep the old behavior. Move the fix to the owner when that keeps the behavior
consistent across the scope.

## Phase 2 — Apply the fixes

Wait for all four subagents to complete. Verify every candidate against the
actual files before editing. Dedup findings that point at the same line or
mechanism. Drop false positives.

Apply each remaining same-scope, behavior-preserving fix directly. Do not ask
for user approval before editing. Skip and report a candidate only when:

- the intended behavior is unclear
- the fix would change behavior
- the fix would reach well outside the reviewed scope
- the finding requires a broad security or architecture review
- the required change needs product judgment

## Phase 3 — Validate

Run the narrowest useful checks after edits:

- targeted tests for touched behavior
- typecheck when types or contracts changed
- lint or formatting checks for imports, style, or dead-code cleanup
- build checks when packaging, routing, or runtime entrypoints changed
- repo validation commands named by local guidance

Review the final diff for minimality and behavior preservation before handing
back.

## Output

Report:

- `Fixed`: same-scope cleanups applied
- `Skipped`: false positives, behavior-changing candidates, out-of-scope
  candidates, or broad security/architecture issues
- `Validation`: commands run and results
- `Residual risk`: anything not proven

If no material cleanup survives verification, state the reviewed scope and say
the diff was already clean for this quality pass.

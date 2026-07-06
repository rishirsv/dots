---
name: ultrareview
description: "Reviews changed code or an implementation plan for correctness, reuse, simplification, efficiency, and maintainability. Invoked via ultrareview. Scales rigor from quick to max, applying same-scope cleanup fixes by default, or reporting findings on request. Not for plan authoring, architecture scans, security audits, or PR publication."
---

# Ultra-Review

Review changed code after implementation, or an existing implementation plan,
spec, or roadmap. Preserve behavior, delete unnecessary complexity, reuse
canonical code, and fix same-scope quality issues when fixing is allowed.
Scale review rigor when the task, risk, or user request calls for deeper bug
hunting.

Correctness comes first. Report correctness findings with evidence and a
concrete failure scenario before changing behavior.

The normal case is review-after-implementation: default to applying
same-scope, behavior-preserving cleanup fixes (reuse, simplification,
efficiency, maintainability) rather than only reporting them. Fall back to
report-only when the user asks for review-only, or when Phase 6's fix-vs-report
rules say a finding must be surfaced instead of edited.

## References

- Read [../../references/finder-checklists.md](../../references/finder-checklists.md) when
  running `standard` or `max` rigor. It holds the four standard-lens
  checklists, the reviewer prompt shape, and the max-tier extra angles.
  `quick` rigor does not need it.
- Read
  [../../references/hard-cut-policy.md](../../references/hard-cut-policy.md)
  for the canonical hard-cut policy when a fix touches schemas, contracts,
  persisted state, routing, configuration, feature flags, enum/value sets,
  migrations, adapters, or compatibility paths, or when reviewing a plan.
- Read
  [../../references/subagent-lanes.md](../../references/subagent-lanes.md)
  for lane definitions and fan-out rules before launching the standard or
  max-tier agents.

## Phase 1: Identify Scope

Read `AGENTS.md`, `REVIEW.md`, or other repo guidance named by the user or found
near the changed files.

If the user supplies, pastes, or names an existing implementation plan, spec,
or roadmap, review that text instead of a git diff: rewrite the file directly
when asked, or return the reviewed plan in chat when it was pasted. Default to
hard-cut simplification for plans (see
[../../references/hard-cut-policy.md](../../references/hard-cut-policy.md)):
cut speculative future-proofing, redundant phases, and compatibility ladders
unless the plan names a real external boundary. Planning a new approach
belongs to planning work; reviewing an existing plan belongs here.

Otherwise, start from the current repository state:

```sh
git status --short
git diff --stat
git diff --staged --stat
git diff --name-only
git diff --staged --name-only
```

Capture one review diff before launching reviewers: a named PR, branch, commit
range, or file path if given; otherwise `git diff HEAD` for staged changes,
`git diff` for unstaged changes, or in order `git diff @{upstream}...HEAD`,
`git diff main...HEAD`, `git diff HEAD~1` when the working tree is clean. With
no git changes, review the mentioned files or files edited earlier in the
thread.

Ask one concise scope question only when several unrelated changes are present
and the intended review target is ambiguous.

## Phase 2: Choose Rigor

Use the user's requested rigor when they name it. Otherwise choose the smallest
rigor that fits the risk.

| Rigor | Use when | Fan-out | Verify | Sweep | Target | Stance |
|---|---|---:|---|---|---:|---|
| `quick` | tiny change, narrow ask, or user wants a fast pass | no subagents | none | no | ~4 | hunk-only, high confidence |
| `standard` | normal after-implementation review (default) | 4 agents (the four standard lenses) | local verification | no | ~8 | precision, actionable findings |
| `max` | user asks for ultra/max/exhaustive rigor, high-risk release, migrations, auth, billing, security-adjacent, persisted data, concurrency, cross-process boundaries, or repeated review misses | 8 finder agents (4 standard lenses + 4 max-tier extra angles) | 1 verifier per candidate | yes | ~12 | maximum recall |

Targets are aims, not hard caps: exceed a target only when each extra finding
carries a named failure scenario or concrete maintainability cost.

Default to `standard`. Escalate to `max` when the user asks for maximum rigor,
or when changed code touches schemas, contracts, persisted state, routing,
configuration, feature flags, enum/value sets, migrations, adapters,
compatibility paths, concurrency, cross-process boundaries, auth, billing, or
other cases where a missed bug would be expensive.

In `max`, end with the final big-simplification pass (Phase 5).

## Phase 3: Behavior Lock

Activate this phase before cleanup edits when the user asks to deslop, clean up
AI output, apply fixes, pass a scoped file list, or perform behavior-adjacent
refactoring.

1. Identify the behavior that must not change in the target files.
2. Check whether existing tests cover that behavior, and run the narrowest useful
   tests when they exist.
3. If critical behavior is untested and the planned cleanup is behavior-adjacent,
   add the narrowest regression test first or report that the fix should wait.
4. Skip this phase for review-only work and for tiny cleanups already covered by
   targeted validation.

## Phase 4: Find Candidates

For `quick`, do one direct pass yourself. Skip test and fixture hunks unless the
change is specifically about tests or fixtures. Flag only runtime correctness
bugs visible from the hunk, obvious helper duplication, obvious dead code, and
small same-scope cleanup.

For `standard`, launch four fresh review-only agents concurrently in one tool
message when a multi-agent tool is available (see
[../../references/subagent-lanes.md](../../references/subagent-lanes.md) for
lane roles and fan-out rules): Correctness, Reuse and Structural
Simplification, Code Quality and AI Slop, and Efficiency and Atomicity. If
subagents are unavailable, run the same four passes yourself. Read
[../../references/finder-checklists.md](../../references/finder-checklists.md)
for the full numbered checklist and reviewer prompt shape for each lens.

For `max`, launch the four standard lenses plus the four max-tier extra angles
from
[../../references/finder-checklists.md](../../references/finder-checklists.md)
as eight independent review-only agents, using the same fan-out rules. Do not
let one angle suppress another.

Give every finder the same scope packet: captured diff, changed-file list,
compact repo guidance, applicable paths, user focus, and changed-file contents
when the diff alone is insufficient. Require each finder to return the final
finding fields from the Output section, or "no findings" when clean.

## Phase 5: Verify Candidates

For `standard`, verify every agent finding against the actual files yourself.
Drop false positives and merge duplicates.

For `max`, deduplicate candidates that point at the same line or mechanism,
keeping the most concrete failure scenario. For each remaining candidate, run
one verifier or verify directly when a subagent is unavailable. Use this
verdict ladder, keeping CONFIRMED and PLAUSIBLE and dropping REFUTED (in
recall-biased review, uncertainty is not a reason to drop a realistic bug):

- **CONFIRMED**: the finding names the reachable input/state and wrong output,
  crash, data loss, or maintainability cost. Quote the relevant line.
- **PLAUSIBLE**: the mechanism is real but the trigger depends on realistic
  timing, environment, configuration, or data shape. State what would confirm it.
- **REFUTED**: the finding is factually wrong, provably impossible, already
  handled in this diff, or pure style with no observable cost. Quote the proof.

For `max`, run the final pass for big simplifications after verification,
using the "Final Pass: Big Simplifications" criteria in
[../../references/finder-checklists.md](../../references/finder-checklists.md).
Give the reviewer the verified list and ask only for structural wins not
already listed. Verify swept candidates with the same verdict ladder.

## Phase 6: Fix Or Report

Correctness findings are report-first. Apply a correctness fix only when the
user asked for fixes or after surfacing the finding, and only when the intended
behavior is clear.

Apply same-scope quality fixes directly when fixing is allowed: reuse,
simplification, and hard-cut fixes per the finder-checklist categories in
[../../references/finder-checklists.md](../../references/finder-checklists.md)
(structural simplification, code quality/AI slop, and efficiency/atomicity).

When schemas, contracts, persisted state, routing, configuration, feature flags,
enum/value sets, migrations, adapters, or compatibility paths are touched,
default to a hard cut: keep one canonical shape and remove old-shape handling
unless a named external boundary requires an exception. Read
[../../references/hard-cut-policy.md](../../references/hard-cut-policy.md)
for the canonical policy, hard rules, and exception rule.

Skip a fix and report it when it would change behavior, expand architecture,
require product judgment, conflict with repo guidance, or take more scope than
the current review should own.

## Phase 7: Validate

Run the narrowest useful validation after edits or before closing a high-risk
review: targeted tests for changed files or owning invariants, typecheck when
types or contracts changed, lint when style/imports/dead code changed, build
checks when packaging or entrypoints changed, and any commands named by repo
guidance. Verify the final diff is minimal and scoped.

## Approval Bar

Do not treat review as clean when any of the "Final Pass: Big
Simplifications" criteria in
[../../references/finder-checklists.md](../../references/finder-checklists.md)
remain visible in the reviewed scope.

Be direct and demanding about maintainability findings. Do not be rude, and do
not soften structural problems into cosmetic suggestions. If the code makes the
surrounding system harder to reason about, say so plainly and name the smallest
cleaner path.

## Output

Order findings by severity: P0 blocker, P1 high, P2 medium, P3 low. At equal
severity, correctness outranks reuse, simplification, quality, efficiency, and
conventions; within maintainability findings, order structural regressions
first, then missed dramatic simplifications, branching growth, boundary and
type contract issues, file-size or decomposition issues, and legibility
concerns. Keep the set high-signal and stay near the chosen target (Phase 2).

Each finding should include:

```json
{
  "severity": "P1",
  "file": "path/to/file.ext",
  "line": 123,
  "summary": "one-sentence statement of the issue",
  "failure_scenario": "concrete input/state -> wrong output/crash, or concrete maintainability cost",
  "proposed_fix": "smallest safe fix"
}
```

When fixes were made, report:

- `Fixed`: material same-scope fixes applied
- `Findings`: report-first correctness issues or deferred high-signal findings
- `Skipped or deferred`: false positives, out-of-scope issues, or judgment calls
- `Validation`: commands run and results
- `Residual risk`: anything not proven

For review-only output, lead with prioritized findings and end with validation
status. If no material issues survive verification, state the reviewed scope and
say the code meets the selected rigor.

On request, explain the result in plain English for a smart non-engineer.

### Inline Comments

When the user asks for inline comments, or the review targets an open pull
request, post each finding as a comment anchored to its exact file and line
instead of, or in addition to, a report block: use PR review tooling for a
GitHub PR, or a comment tool for an editor/IDE session. Prefer fewer,
higher-signal comments over one summary comment per file.

Do not rewrite unrelated code, silently edit during review-only work, or hand
off to PR publication, CI repair, security-only audits, or existing
review-comment workflows.

---
name: code-review
description: "Reviews changed code, existing plans, or explicit repo/subsystem audit targets for correctness, reuse, simplification, efficiency, and maintainability. Report-only unless fixes are requested. Not for blank-slate planning, architecture-primary scans, PR publication, or unrequested implementation."
---

# Code Review

Review changed code after implementation, an existing implementation plan,
spec, roadmap, or an explicit repo/subsystem audit target. Preserve behavior,
find correctness problems, identify unnecessary complexity, and point to
canonical code the change should reuse. Scale effort to the scope and risk.

Correctness comes first. Review is report-only by default. Edit source only
when the user explicitly asks to fix findings or otherwise authorizes changes;
then keep fixes within the approved scope and verify behavior.

Audit Mode is the broad-review case: review a repo, subsystem, package, branch,
or category target beyond the current diff. Do not silently widen a diff review
into a repo audit. Architecture Review owns requests primarily about structural
refactor candidates, canonical ownership, seams, or interface design; Code
Review reports architecture evidence only when it arises inside its review
scope.

## References

- Read [../../references/review-checklists.md](../../references/review-checklists.md)
  for deep reviews or when a direct review needs a specific lens. It holds the
  correctness, simplification, quality, efficiency, and extra-angle prompts.
- Read
  [../../references/hard-cut-policy.md](../../references/hard-cut-policy.md)
  for the canonical hard-cut policy when a fix touches schemas, contracts,
  persisted state, routing, configuration, feature flags, enum/value sets,
  migrations, adapters, or compatibility paths, or when reviewing a plan.
- Read
  [../../references/subagent-lanes.md](../../references/subagent-lanes.md)
  for lane definitions before delegating independent review work.
- Read [references/audit-mode.md](references/audit-mode.md) when the user asks
  to audit, survey, inspect, health-check, find improvement opportunities, or
  review a repo, subsystem, package, branch, or category beyond the current
  diff.

## Phase 1: Identify Scope

Read `AGENTS.md`, `REVIEW.md`, or other repo guidance named by the user or found
near the changed files.

If the user asks for an audit, survey, broad review, repo health check, security
sweep, performance sweep, test coverage review, dependency review, DX review,
or improvement opportunities across a repo/subsystem/package/category, enter
Audit Mode. Use [references/audit-mode.md](references/audit-mode.md), require an
explicit target, and declare coverage. Do not capture a diff as the whole scope
unless the user asked for branch or changed-code audit.

If the user supplies, pastes, or names an existing implementation plan, spec,
or roadmap, review that text instead of a git diff. Rewrite a file only when
the user asked for revision; otherwise return findings in chat. Default to
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

## Phase 2: Choose Depth

Use the smallest review shape that can catch the likely failures:

- **Direct**: one focused pass by the primary agent for small or ordinary
  changes, narrow plan reviews, and scopes where the relevant behavior fits in
  working context.
- **Deep**: multiple independent lenses for broad diffs, high-risk behavior,
  repeated review misses, or an explicit exhaustive request. Schemas,
  persisted state, cross-process contracts, auth, billing, security,
  concurrency, and migrations usually justify this path.

Depth controls evidence gathering, not a finding quota. A clean review may
return no findings. Delegate only when independent lanes materially improve
coverage; choose the lanes that match the risk rather than launching a fixed
number of agents.

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

For a direct review, inspect the diff and enough surrounding code to establish
the changed behavior. Include test and fixture hunks when they encode or fail to
prove an affected invariant.

For a deep review, choose independent lenses from
[../../references/review-checklists.md](../../references/review-checklists.md):
correctness, reuse and structural simplification, code quality, efficiency and
atomicity, or an extra angle tied to the risk. Run useful lanes concurrently
when a multi-agent tool is available; otherwise make the passes directly. Do
not delegate a lane whose scope is already fully understood by the parent.

Give every finder the same scope packet: captured diff, changed-file list,
compact repo guidance, applicable paths, user focus, and changed-file contents
when the diff alone is insufficient. Require each finder to return the final
finding fields from the Output section, or "no findings" when clean.

## Phase 5: Verify Candidates

Verify every candidate against the actual files. Merge duplicates and classify
each one:

- **Confirmed**: the evidence establishes the reachable failure or concrete
  maintainability cost. These are findings.
- **Needs verification**: the mechanism is credible, but a missing runtime,
  configuration, data-shape, or product fact prevents confirmation. Keep these
  separate and state the exact check that would resolve them.
- **Rejected**: the claim is false, impossible, already handled, or pure style
  without observable cost. Do not report it as a finding.

For a deep simplification review, run the final big-simplification pass from
[../../references/review-checklists.md](../../references/review-checklists.md)
when the diff shows branching growth, compatibility machinery, or unclear
ownership. Verify its candidates by the same classification.

## Phase 6: Fix Or Report

Report findings and stop unless the user asked for fixes. When fixes are
authorized and intended behavior is clear, apply the smallest approved
correctness, reuse, simplification, or hard-cut changes per
[../../references/review-checklists.md](../../references/review-checklists.md)
(structural simplification, code quality/AI slop, and efficiency/atomicity).

When schemas, contracts, persisted state, routing, configuration, feature flags,
enum/value sets, migrations, adapters, or compatibility paths are touched,
default to a hard cut: keep one canonical shape and remove old-shape handling
unless a named external boundary requires an exception. Read
[../../references/hard-cut-policy.md](../../references/hard-cut-policy.md)
for the canonical policy, hard rules, and exception rule.

Skip a requested fix and report it when it would change unspecified behavior,
expand architecture, require product judgment, conflict with repo guidance, or
take more scope than the current review should own.

## Phase 7: Validate

Run the narrowest useful validation after edits or before closing a high-risk
review: targeted tests for changed files or owning invariants, typecheck when
types or contracts changed, lint when style/imports/dead code changed, build
checks when packaging or entrypoints changed, and any commands named by repo
guidance. Verify the final diff is minimal and scoped.

In Audit Mode, run only read-only checks and cheap verification commands. Do not
run formatters, installs that mutate the working tree, commits, broad generated
builds, or other commands that change source or unignored artifacts.

## Approval Bar

Be direct about maintainability findings. Do not soften structural problems
into cosmetic suggestions. If the code makes the surrounding system harder to
reason about, say so plainly and name the smallest cleaner path.

## Output

Order findings by severity: P0 blocker, P1 high, P2 medium, P3 low. At equal
severity, correctness outranks reuse, simplification, quality, efficiency, and
conventions; within maintainability findings, order structural regressions
first, then missed dramatic simplifications, branching growth, ownership and
type contract issues, file-size or decomposition issues, and legibility
concerns. Keep the set high-signal; do not add findings to fill a target.

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

When fixes were explicitly requested and made, report:

- `Fixed`: material same-scope fixes applied
- `Findings`: remaining confirmed issues
- `Skipped or deferred`: false positives, out-of-scope issues, or judgment calls
- `Validation`: commands run and results
- `Residual risk`: anything not proven

For review-only output, lead with confirmed findings, then list any
needs-verification items separately, and end with validation status. If no
material issues survive verification, state the reviewed scope and say no
findings were confirmed.

For Audit Mode output, follow [references/audit-mode.md](references/audit-mode.md):
declare what was reviewed, what was skipped or sampled, then present verified
findings ordered by leverage. Keep direction findings separate from bugs,
security, performance, tests, architecture, dependency, DX, and docs findings.

On request, explain the result in plain English for a smart non-engineer.

### Inline Comments

Post inline or pull-request comments only when the user explicitly asks to
submit comments. Anchor each submitted finding to its exact file and line and
prefer fewer, higher-signal comments over one summary comment per file. An open
pull request is review context, not authorization to write externally.

Do not rewrite unrelated code, silently edit during review-only or audit work,
or hand off to PR publication, CI repair, exploit-oriented security work, or
existing review-comment workflows.

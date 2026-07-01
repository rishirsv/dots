---
name: ultra-review
description: "Reviews changed code after implementation for correctness bugs and reuse, simplification, efficiency, altitude, and code-quality cleanups. Scales review rigor from quick to max based on task risk or explicit user request, then reports findings or applies same-scope fixes while preserving behavior. Not for broad architecture scans, security audits, PR publication, or CI repair workflows."
---

# Ultra-Review

Review changed code after implementation. Preserve behavior, delete unnecessary
complexity, reuse canonical code, and fix same-scope quality issues when fixing
is allowed. Scale review rigor when the task, risk, or user request calls for
deeper bug hunting.

Correctness comes first. Report correctness findings with evidence and a
concrete failure scenario before changing behavior. Apply reuse,
simplification, efficiency, altitude, and maintainability fixes directly when
the user asked for cleanup or fixes and the fix stays inside the reviewed scope.

If the invocation is read-only, or a fix would change product behavior, broaden
architecture, require user judgment, or conflict with repo guidance, report the
finding instead of editing.

## References

- Read [references/finder-checklists.md](references/finder-checklists.md) when
  running `standard`, `deep`, or `max` rigor. It holds the Agent 1-3
  checklists, the reviewer prompt shape, the deep/max finder angles, and the
  maximum maintainability sweep. `quick` rigor does not need it.
- Read
  [../architecture-review/references/hard-cut-policy.md](../architecture-review/references/hard-cut-policy.md)
  for the canonical hard-cut policy when a fix touches schemas, contracts,
  persisted state, routing, configuration, feature flags, enum/value sets,
  migrations, adapters, or compatibility paths.

## Phase 1: Identify Scope

Read `AGENTS.md`, `REVIEW.md`, or other repo guidance named by the user or found
near the changed files.

Start from the current repository state:

```sh
git status --short
git diff --stat
git diff --staged --stat
git diff --name-only
git diff --staged --name-only
```

Capture one review diff before launching reviewers:

- If the user names a PR, branch, commit range, or file path, review that target.
- If there are staged changes, use `git diff HEAD`.
- If there are unstaged changes, use `git diff`.
- If the working tree diff is empty, try `git diff @{upstream}...HEAD`, then
  `git diff main...HEAD`, then `git diff HEAD~1`.
- If there are no git changes, review the mentioned files or files edited
  earlier in the thread.

Ask one concise scope question only when several unrelated changes are present
and the intended review target is ambiguous.

## Phase 2: Choose Rigor

Use the user's requested rigor when they name it. Otherwise choose the smallest
rigor that fits the risk.

| Rigor | Use when | Fan-out | Verify | Sweep | Cap | Stance |
|---|---|---:|---|---|---:|---|
| `quick` | tiny change, narrow ask, or user wants a fast pass | no subagents unless already available cheaply | none | no | 4 | hunk-only, high confidence |
| `standard` | normal after-implementation review | 3 agents | local verification | no | 8 | precision, actionable findings |
| `deep` | risky change, public behavior, data/state, concurrency, contracts, tests, or user asks for careful review | 8 finder angles | 1 verifier per candidate | no | 10 | recall-biased |
| `max` | user asks for ultra/max/exhaustive, high-risk release, migrations, auth, billing, security-adjacent, persisted data, or repeated review misses | 10 finder angles | 1 verifier per candidate | yes | 15 | maximum recall |

Default to `standard`. Escalate to `deep` when changed code touches schemas,
contracts, persisted state, routing, configuration, feature flags,
enum/value sets, migrations, adapters, compatibility paths, concurrency, or
cross-process boundaries. Escalate to `max` when the user asks for maximum rigor
or when a missed bug would be expensive.

In `max`, always include a maximum maintainability sweep: hunt for dramatic
behavior-preserving simplifications, file sprawl, ad-hoc branching, boundary
leaks, wrapper churn, casts or optionality churn, misplaced feature logic, and
missed canonical helpers.

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

For `standard`, launch three fresh review-only agents concurrently in one tool
message when a multi-agent tool is available: Reuse and Structural
Simplification, Correctness/AI Slop/Code Quality, and Efficiency and
Atomicity. Give each agent the same captured diff, changed-file list, compact
repo guidance, applicable paths, user focus, and changed-file contents when
the diff alone is insufficient. If subagents are unavailable, run the same
three passes yourself. Read
[references/finder-checklists.md](references/finder-checklists.md) for the
full numbered checklist and reviewer prompt shape for each lens.

For `deep` and `max`, launch the finder angles from
[references/finder-checklists.md](references/finder-checklists.md) as
independent review-only agents. Do not let one angle suppress another. Pass
every candidate with a nameable failure scenario into verification.

Give every deep/max finder the same scope packet as standard review: captured
diff, changed-file list, compact repo guidance, applicable paths, user focus,
and changed-file contents when the diff alone is insufficient. Require each
finder to return the final finding fields from the Output section, or "no
findings" when clean.

## Phase 5: Verify Candidates

For `standard`, verify every agent finding against the actual files yourself.
Drop false positives and merge duplicates.

For `deep` and `max`, deduplicate candidates that point at the same line or
mechanism, keeping the most concrete failure scenario. For each remaining
candidate, run one verifier or verify directly when a subagent is unavailable.
Use this verdict ladder:

- **CONFIRMED**: the finding names the reachable input/state and wrong output,
  crash, data loss, or maintainability cost. Quote the relevant line.
- **PLAUSIBLE**: the mechanism is real but the trigger depends on realistic
  timing, environment, configuration, or data shape. State what would confirm it.
- **REFUTED**: the finding is factually wrong, provably impossible, already
  handled in this diff, or pure style with no observable cost. Quote the proof.

For `deep` and `max`, keep CONFIRMED and PLAUSIBLE findings. Drop REFUTED. In
recall-biased review, uncertainty is not a reason to drop a realistic bug.

For `max`, run one more fresh gap sweep after verification. Give the reviewer the
verified list and ask only for defects not already listed. Focus on moved or
extracted code that dropped a guard, second-tier language footguns, test
setup/teardown asymmetry, config defaults, and lock or transaction boundaries.
Verify swept candidates with the same verdict ladder.

## Phase 6: Fix Or Report

Correctness findings are report-first. Apply a correctness fix only when the
user asked for fixes or after surfacing the finding, and only when the intended
behavior is clear.

Apply same-scope quality fixes directly when fixing is allowed:

- Reuse canonical helpers and modules.
- Delete redundant branches, modes, wrappers, compatibility paths, and concepts.
- Reframe state or ownership so conditionals disappear instead of merely moving
  into a new helper.
- Move feature behavior to the package, module, layer, or policy that owns the
  concept.
- Collapse duplicate branches into one clearer flow.
- Delete layers of indirection that do not clarify the API or reduce concepts.
- Remove needless abstraction, over-defensive code, dead code, debug leftovers,
  stale comments, and task narration.
- Tighten loose contracts, casts, unnecessary optionality, and ad-hoc shapes.
- Make type boundaries explicit when that simplifies control flow.
- Separate orchestration from business logic when the current shape mixes them.
- Improve efficiency without introducing races or hidden ordering assumptions.

When schemas, contracts, persisted state, routing, configuration, feature flags,
enum/value sets, migrations, adapters, or compatibility paths are touched,
default to a hard cut: keep one canonical shape and remove old-shape handling
unless a named external boundary requires an exception. Read
[../architecture-review/references/hard-cut-policy.md](../architecture-review/references/hard-cut-policy.md)
for the canonical policy, hard rules, and exception rule.

Skip a fix and report it when it would change behavior, expand architecture,
require product judgment, conflict with repo guidance, or take more scope than
the current review should own.

## Phase 7: Validate

Run the narrowest useful validation after edits or before closing a high-risk
review:

- Targeted tests for changed files or owning invariants.
- Typecheck when types or contracts changed.
- Lint when style, imports, or dead code changed.
- Build checks when packaging, routing, or runtime entrypoints changed.
- Commands named by repo guidance.

Verify the final diff is minimal and scoped.

## Approval Bar

Do not treat review as clean when any of these remain and are visible in the
reviewed scope:

- a clear structural regression, even if behavior still works
- an obvious behavior-preserving simplification that would delete meaningful
  complexity
- unjustified file-size growth, especially crossing roughly 1,000 lines
- ad-hoc branching that makes an existing flow more tangled
- unnecessary wrapper, cast, optionality, fallback, or generic mechanism churn
- feature logic leaking across the wrong boundary
- duplication of a canonical helper, type, service, module, or policy

Be direct and demanding about maintainability findings. Do not be rude, and do
not soften structural problems into cosmetic suggestions. If the code makes the
surrounding system harder to reason about, say so plainly and name the smallest
cleaner path.

## Output

Order findings by severity: P0 blocker, P1 high, P2 medium, P3 low. At equal
severity, correctness outranks reuse, simplification, quality, efficiency,
altitude, and conventions. Keep the set high-signal and respect the chosen cap.
Within maintainability findings, order structural regressions first, then missed
dramatic simplifications, spaghetti or branching growth, boundary and type
contract issues, file-size or decomposition issues, modularity issues, and
legibility concerns.

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

Explain cleanup work in plain English: what was messy, what changed, and why it
matters practically. Use concrete file references instead of dense review
jargon.

### Inline Comments

When the user asks for inline comments, or the review targets an open pull
request, post each finding as a comment anchored to its exact file and line
instead of, or in addition to, a report block:

- For a GitHub PR, use available PR review tooling to attach one line comment per
  finding.
- In an editor or IDE session with a comment tool, attach each finding to its
  file URI and line range.
- Prefer fewer, higher-signal comments. Do not post one summary comment per file.

Do not rewrite unrelated code, silently edit during review-only work, or hand
off to PR publication, CI repair, security-only audits, or existing
review-comment workflows.

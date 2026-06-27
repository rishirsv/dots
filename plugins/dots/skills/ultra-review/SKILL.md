---
name: ultra-review
description: "Reviews already-implemented code for correctness bugs plus reuse, simplification, efficiency, and code-quality cleanups, then reports findings or applies same-scope fixes while preserving behavior. Explicit-only skill invoked via ultra-review or a request to review or clean up a diff after implementation; runs deep or max rigor only when explicitly asked. Not for broad architecture scans, security audits, PR publication, or CI repair."
---

# Ultra-Review

Review changed code after implementation. Preserve behavior, delete unnecessary
complexity, reuse canonical code, and fix same-scope quality issues when fixing
is allowed. Run a deeper or maximum bug hunt only when the user asks for one.

Correctness comes first. Report correctness findings with evidence and a
concrete failure scenario before changing behavior. Apply reuse,
simplification, efficiency, altitude, and maintainability fixes directly when
the user asked for cleanup or fixes and the fix stays inside the reviewed scope.

If the invocation is read-only, or a fix would change product behavior, broaden
architecture, require user judgment, or conflict with repo guidance, report the
finding instead of editing.

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

Choose between `quick` and `standard` yourself based on change size. Use `deep`
or `max` only when the user explicitly asks for that rigor — never escalate to
them on your own.

| Rigor | Use when | Fan-out | Verify | Sweep | Cap | Stance |
|---|---|---:|---|---|---:|---|
| `quick` | tiny change or a fast pass | no subagents unless already available cheaply | none | no | 4 | hunk-only, high confidence |
| `standard` | default after-implementation review | 3 agents | local verification | no | 8 | precision, actionable findings |
| `deep` | user asks for a deep or careful review | 8 finder angles | 1 verifier per candidate | no | 10 | recall-biased |
| `max` | user asks for a max, ultra, or exhaustive review | 10 finder angles | 1 verifier per candidate | yes | 15 | maximum recall |

Default to `standard`. An explicit `ultra-review` invocation means standard
review unless the user asks for a quick or fast pass, says no subagents, or the
diff is truly a tiny single-hunk cleanup. Reach for `deep` or `max` only on an
explicit request for that depth, even when the change looks risky.

## Phase 3: Behavior Lock

Activate this phase before cleanup edits when the user asks to deslop, clean up
AI output, apply fixes, or perform behavior-adjacent refactoring.

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
message when a multi-agent tool is available. If no subagent tool is already
visible, first search/load multi-agent tools such as `multi_agent_v1.spawn_agent`
before saying subagents are unavailable. Give each agent the same captured diff,
changed-file list, compact repo guidance, applicable paths, user focus, and
changed-file contents when the diff alone is insufficient. If tool discovery is
unavailable or no subagent tool exists after discovery, run the same three passes
yourself and briefly say which discovery step failed.

For `deep` and `max`, launch the finder angles as independent review-only
agents. Do not let one angle suppress another. Pass every candidate with a
nameable failure scenario into verification.

Give every deep/max finder the same scope packet as standard review: captured
diff, changed-file list, compact repo guidance, applicable paths, user focus,
and changed-file contents when the diff alone is insufficient. Require each
finder to return the final finding fields from the Output section, or "no
findings" when clean.

## Standard Review Agents

### Agent 1: Reuse and Structural Simplification Review

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
5. **Ask whether a clearer reframing would delete the problem instead of
   polishing it.** Prefer changing the model, ownership boundary, or default
   flow when that removes code.
6. **Flag refactors that move complexity around without reducing it.**
7. **Flag feature-specific logic added to shared or unrelated paths.** Push logic
   toward the canonical package, module, helper, or abstraction that owns the
   concept.
8. **Flag new ad-hoc conditionals and one-off flags** that make the existing flow
   harder to reason about.
9. **Notice changed source files that are becoming hard to navigate.** When a
   source file becomes mixed-purpose, crosses a locally unusual size threshold,
   or nears roughly 1,000 lines without a strong reason, consider a focused
   module with a descriptive name.

### Agent 2: Correctness, AI Slop, and Code Quality Review

Review correctness first:

1. **Logic errors and edge cases**: off-by-one, inverted or wrong conditions,
   bad operator choice, and boundary or empty/null/zero/overflow inputs.
2. **Regressions**: behavior changes that break an existing caller, invariant,
   contract, or test.
3. **Error handling**: missing, swallowed, or over-broad handling; unhandled
   promise rejections; resources or locks not released on failure.
4. **Tests and docs gaps the change introduces**: an invariant left untested, or
   a doc/comment now stale because of this change.

Then review for quality and AI-generated slop:

5. **Redundant state**: state that duplicates existing state, cached values that
   could be derived, observers/effects that could be direct calls.
6. **Parameter sprawl**: new parameters or booleans instead of clearer ownership
   or a generalized existing shape.
7. **Copy-paste with slight variation**: near-duplicate blocks that should be a
   shared abstraction or one simpler flow.
8. **Leaky abstractions**: exposed internals or broken ownership boundaries.
9. **Stringly-typed code**: raw strings where constants, enums, string unions, or
   branded types already exist.
10. **Needless abstraction**: pass-through wrappers, single-use helper layers,
    identity helpers, speculative indirection, or generic mechanisms hiding a
    simple data shape.
11. **Over-defensive code**: try/catch around code that cannot throw, null checks
    on non-null values, impossible fallback defaults, or broad guards that hide
    invariants.
12. **Dead code and debug leftovers**: unused imports, unreachable branches,
    stale feature flags, console logging, commented-out code, and abandoned
    scaffolding.
13. **Unnecessary comments and narration**: comments that restate obvious code,
    explain what changed instead of why it must exist, or sound like task notes.
14. **Cast-heavy or loose contracts**: `any`, `unknown`, forced casts,
    unnecessary optionality, or ad-hoc object shapes used to bypass clear types.
15. **Inconsistent local style**: naming, error handling, imports, testing, or
    module shape that ignores the surrounding code.

### Agent 3: Efficiency and Atomicity Review

Review the same changes for efficiency:

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

Use this prompt shape for each standard reviewer:

```text
You are a review-only agent. Do not edit files.

Scope:
- Changed files: <paths>
- Review rigor: <quick | standard | deep | max>
- Repo guidance: <compact guidance summary>
- Additional user focus: <focus or none>

Full diff:
<diff>

Apply only this lens: <Reuse and Structural Simplification | Correctness, AI Slop, and Code Quality | Efficiency and Atomicity>.
Check the changed code against every item below:

<full numbered checklist for the assigned lens>

Use applicable skills, plugins, and repo review guidance for this code. Search
the repository as needed before flagging duplication, missed helpers, or
local-pattern violations.

Return concrete findings only. For each finding include severity, file/line
evidence, summary, failure scenario or concrete maintainability cost, impact,
and proposed fix. If clean, return "no findings".
```

## Deep and Max Finder Angles

For `deep`, run angles A-H. For `max`, run angles A-J.

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

E. **Wrapper/proxy correctness.** For caches, decorators, adapters, providers,
or proxies, confirm every method routes to the wrapped instance, forwards the
methods callers use, and does not re-enter a registry/session/global by mistake.

F. **Reuse.** Search for existing helpers, services, components, constants,
types, policies, or tests that the change should reuse.

G. **Simplification and AI slop.** Use the standard simplification and quality
checklists to find complexity that can be deleted without changing behavior.

H. **Efficiency and atomicity.** Use the standard efficiency checklist to find
wasted work, missed concurrency, memory retention, and half-applied updates.

I. **Altitude and ownership.** Check that each change is implemented at the right
depth. Prefer fixing or generalizing the owning mechanism over layering a
feature-specific special case onto shared infrastructure.

J. **Repo conventions.** Read applicable repo guidance files and flag only clear
violations that quote the exact rule and name the line that breaks it.

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
- Remove needless abstraction, over-defensive code, dead code, debug leftovers,
  stale comments, and task narration.
- Tighten loose contracts, casts, unnecessary optionality, and ad-hoc shapes.
- Improve efficiency without introducing races or hidden ordering assumptions.

When schemas, contracts, persisted state, routing, configuration, feature flags,
enum/value sets, migrations, adapters, or compatibility paths are touched, use a
hard cut by default: keep one canonical shape and remove old-shape handling.
Do not add fallbacks, compatibility branches, shims, coercions, aliases,
dual-shape support, or tests for abandoned draft formats unless there is
concrete evidence of a real external boundary such as persisted user data,
database/on-disk state, a cross-process wire format, or a public contract. If
that boundary exists, name the exact file/function and limit compatibility to
that boundary.

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

## Output

Order findings by severity: P0 blocker, P1 high, P2 medium, P3 low. At equal
severity, correctness outranks reuse, simplification, quality, efficiency,
altitude, and conventions. Keep the set high-signal and respect the chosen cap.

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

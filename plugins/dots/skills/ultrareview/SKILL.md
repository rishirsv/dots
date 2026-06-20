---
name: ultrareview
description: "Reviews changed code right after implementation for correctness, reuse, simplicity, maintainability, and efficiency, then fixes same-scope quality issues or reports correctness and cleanup findings. Explicit-only after-implementation review that catches bugs and edge cases across three reviewer lenses; not for broad architecture scans or security audits."
---

# Ultrareview

Review changed code across three lenses — code reuse, correctness and code
quality, and efficiency. Each lens also catches bugs in its own domain. Catch
correctness problems and edge cases first, then tighten structure.

Correctness findings are report-first: surface them with evidence, do not
silently edit logic to "fix" them. Apply same-scope cleanup fixes (reuse,
simplicity, efficiency, maintainability) when the user asked for cleanup;
otherwise produce findings. Produce findings only when the user asked for
review-only output or a fix would broaden scope.

Behavior working is necessary but not sufficient. Confirm the change is correct,
then prefer deleting complexity, reusing canonical helpers, and keeping one
canonical codepath.

## Scope

Read `AGENTS.md`, `REVIEW.md`, or other repo guidance named.

Start from the current repository state:

```sh
git status --short
git diff --stat
git diff --staged --stat
git diff --name-only
git diff --staged --name-only
```

Capture one review diff before launching reviewers. Use `git diff HEAD` when
staged changes exist; otherwise use `git diff`. If the user names a base branch
or commit range, review that range. If there are no git changes, review the
mentioned files or files edited earlier in the thread.

Ask one concise scope question only when several unrelated changes are present
and the intended review target is ambiguous.

## Required Workflow

1. Inspect the changed files and nearby code before judging the diff.
2. Search for existing utilities, helpers, canonical modules, tests, and local
   patterns before recommending new abstractions.
3. When a multi-agent tool is available, launch exactly three fresh review-only
   agents concurrently in one tool message. Do this for every changed-code
   review, even when the diff looks straightforward.
4. Give all three agents the same captured diff, changed-file list, compact repo
   guidance, applicable paths, required domain skills, additional user focus,
   and changed-file contents when the diff alone is insufficient.
5. Assign one lens per agent: Code Reuse, Correctness & Code Quality, and
   Efficiency.
6. Wait for all three agents before fixing. Aggregate their findings, verify
   each against the actual files, and drop false positives without debate.
7. Apply only same-scope quality fixes (reuse, simplicity, efficiency,
   maintainability). Treat correctness findings as report-first: surface them
   with evidence and a proposed fix, and apply a fix only when the user asked or
   after surfacing it. Stop and report when a fix would change product behavior,
   expand architecture, require user judgment, or conflict with repo guidance.
8. Run the narrowest useful validation: targeted tests, typechecks, lint, build
   checks, or commands named by repo guidance.

Skip review agents only when the tool is unavailable or there is no diff and
only one tiny mentioned file. If skipped, run all three lenses yourself and say
why agents were skipped.

## Three Review Agents

Use the `${AGENT_TOOL_NAME}` tool to launch all three agents concurrently in a
single message. Pass each agent the full diff so it has the complete context.
Every lens catches bugs in its own domain — correctness is shared work, not one
agent's job.

### Agent 1: Code Reuse Review

For each change:

1. **Search for existing utilities and helpers** that could replace newly written code. Look for similar patterns elsewhere in the codebase — common locations are utility directories, shared modules, and files adjacent to the changed ones.
2. **Flag any new function that duplicates existing functionality.** Suggest the existing function to use instead.
3. **Flag any inline logic that could use an existing utility** — hand-rolled string manipulation, manual path handling, custom environment checks, ad-hoc type guards, and similar patterns are common candidates.
4. **Divergent duplicates (correctness)**: when logic is copied instead of reused, flag that the copies can drift out of sync and cause bugs, and flag any reused helper called with the wrong contract, arguments, or assumptions.

### Agent 2: Correctness & Code Quality Review

Review correctness first — it outranks every other concern. Behavior must be
right before structure matters:

1. **Logic errors and edge cases**: off-by-one, inverted or wrong conditions, bad operator choice, and boundary or empty/null/zero/overflow inputs
2. **Regressions**: behavior changes that break an existing caller, invariant, contract, or test
3. **Error handling**: missing, swallowed, or over-broad handling; unhandled promise rejections; resources or locks not released on the failure path
4. **Tests and docs gaps the change introduces**: an invariant left untested, or a doc/comment now stale because of this change

Then review the same changes for hacky quality patterns:

5. **Redundant state**: state that duplicates existing state, cached values that could be derived, observers/effects that could be direct calls
6. **Parameter sprawl**: adding new parameters to a function instead of generalizing or restructuring existing ones
7. **Copy-paste with slight variation**: near-duplicate code blocks that should be unified with a shared abstraction
8. **Leaky abstractions**: exposing internal details that should be encapsulated, or breaking existing abstraction boundaries
9. **Stringly-typed code**: using raw strings where constants, enums (string unions), or branded types already exist in the codebase
10. **Unnecessary JSX nesting**: wrapper Boxes/elements that add no layout value — check if inner component props (flexShrink, alignItems, etc.) already provide the needed behavior
11. **Unnecessary comments**: comments explaining WHAT the code does (well-named identifiers already do that), narrating the change, or referencing the task/caller — delete; keep only non-obvious WHY (hidden constraints, subtle invariants, workarounds)

### Agent 3: Efficiency Review

Review the same changes for efficiency:

1. **Unnecessary work**: redundant computations, repeated file reads, duplicate network/API calls, N+1 patterns
2. **Missed concurrency**: independent operations run sequentially when they could run in parallel
3. **Hot-path bloat**: new blocking work added to startup or per-request/per-render hot paths
4. **Recurring no-op updates**: state/store updates inside polling loops, intervals, or event handlers that fire unconditionally — add a change-detection guard so downstream consumers aren't notified when nothing changed. Also: if a wrapper function takes an updater/reducer callback, verify it honors same-reference returns (or whatever the "no change" signal is) — otherwise callers' early-return no-ops are silently defeated
5. **Unnecessary existence checks**: pre-checking file/resource existence before operating (TOCTOU anti-pattern) — operate directly and handle the error
6. **Memory**: unbounded data structures, missing cleanup, event listener leaks
7. **Overly broad operations**: reading entire files when only a portion is needed, loading all items when filtering for one
8. **Concurrency correctness**: when independent operations are parallelized, confirm they are truly independent — flag races on shared state, missing `await`, ordering assumptions, or non-atomic read-modify-write introduced by the change.

Use this prompt shape for each reviewer:

```text
You are a review-only agent. Do not edit files.

Scope:
- Changed files: <paths>
- Repo guidance: <compact guidance summary>
- Additional user focus: <focus or none>

Full diff:
<diff>

Apply only this lens: <Code Reuse | Correctness & Code Quality | Efficiency>.
Search the repository as needed before flagging duplication, missed helpers, or
local-pattern violations.

Return concrete findings only. For each finding include a severity tag (P0
blocker, P1 high, P2 medium, P3 low), file/line evidence, impact, and proposed
fix. If clean, return "no findings".
```

## Strict Bar

Correctness comes first: never wave through a likely bug or unhandled edge case,
and never silently rewrite logic to fix one — surface it with evidence. Once the
change is correct, do not approve it merely because behavior works. Push for the
cleaner structure when behavior can stay the same.

- Prefer the simplification that removes branches, modes, wrappers, helpers,
  compatibility paths, or concepts entirely.
- Treat scattered special cases, fallback chains, thin pass-through abstractions,
  magic data shapes, and "just this one weird branch" as design problems.
- Keep logic in the canonical layer and reuse the canonical helper, service,
  component, type, or policy object.
- Prefer explicit current contracts over `any`, `unknown`, unnecessary
  optionality, casts, aliases, or ad-hoc object shapes.
- Do not let a changed file sprawl past roughly 1,000 lines without a strong
  reason; prefer extracting a real helper, component, or module.
- Prefer parallel or atomic structure when independent sequential work or
  half-applied updates make the implementation brittle.
- Tests should cover the owning invariant without duplicating weaker coverage.

When schemas, contracts, persisted state, routing, configuration, feature flags,
enum/value sets, migrations, adapters, or compatibility paths are touched, use a
hard cut by default: keep one canonical shape and remove old-shape handling.
Mere existence of old code is not proof of a compatibility obligation. Do not
add fallbacks, compatibility branches, shims, coercions, aliases, dual-shape
support, or tests that memorialize abandoned draft formats unless there is
concrete evidence of a real external boundary such as persisted user data,
database/on-disk state, a cross-process wire format, or a public contract. If
that boundary exists, name the exact file/function and limit compatibility to
that boundary.

## Output

Order all findings by severity (P0 blocker, P1 high, P2 medium, P3 low). At equal
severity, correctness findings outrank reuse, quality, and efficiency findings.
Lead with the highest-severity findings and keep the set high-signal — omit nits
that do not change correctness, safety, or maintainability.

When fixes were made, report:

- `Fixed`: material same-scope quality cleanup that was applied
- `Findings`: correctness findings (report-first), each with severity, file/line evidence, impact, and proposed fix
- `Skipped or deferred`: false positives, out-of-scope issues, or judgment calls
- `Validation`: commands run and results
- `Residual risk`: anything not proven

For review-only output, lead with prioritized findings. Each finding needs a
severity tag, file/line evidence, impact, and proposed fix. End with validation
status. If no material issues are found, state the reviewed scope and say the
code meets the bar.

### Inline comments

When the user asks for inline comments, or the review targets an open pull
request, post each finding as a comment anchored to its exact file and line
instead of, or in addition to, a report block:

- For a GitHub PR, use the available PR review tooling to attach line comments,
  one per finding, anchored to the changed range.
- In an editor or IDE session with a comment tool, attach each finding to its
  file URI and line range.
- Keep one comment per finding anchored to the precise range — never a single
  summary comment per file. Prefer fewer, higher-signal comments.

Do not rewrite unrelated code, silently edit during review-only work, or hand
off to PR publication, CI repair, security-only audits, or existing
review-comment workflows.

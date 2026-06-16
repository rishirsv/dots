---
name: code-quality-review
description: "Use when reviewing or tightening code right after implementation for simplicity, reuse, efficiency, maintainability, thermonuclear quality review, simplify cleanup, or an after-implementation code-quality pass; not for broad codebase architecture scans, existing PR review-comment response, CI repair, publishing PRs, or security-only audits."
---

# Code Quality Review

Review changed code for reuse, simplicity, maintainability, and efficiency, then
fix same-scope issues when the user asked for cleanup. Produce findings only
when the user asked for review-only output or a fix would broaden scope.

Behavior working is not enough. Prefer deleting complexity, reusing canonical
helpers, and keeping one canonical codepath.

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
5. Assign one lens per agent: Code Reuse, Code Quality, and Efficiency.
6. Wait for all three agents before fixing. Aggregate their findings, verify
   each against the actual files, and drop false positives without debate.
7. Apply only same-scope fixes. Stop and report when a fix would change product
   behavior, expand architecture, require user judgment, or conflict with repo
   guidance.
8. Run the narrowest useful validation: targeted tests, typechecks, lint, build
   checks, or commands named by repo guidance.

Skip review agents only when the tool is unavailable or there is no diff and
only one tiny mentioned file. If skipped, run all three lenses yourself and say
why agents were skipped.

## Three Review Agents

Use the `${AGENT_TOOL_NAME}` tool to launch all three agents concurrently in a
single message. Pass each agent the full diff so it has the complete context.

### Agent 1: Code Reuse Review

For each change:

1. **Search for existing utilities and helpers** that could replace newly written code. Look for similar patterns elsewhere in the codebase — common locations are utility directories, shared modules, and files adjacent to the changed ones.
2. **Flag any new function that duplicates existing functionality.** Suggest the existing function to use instead.
3. **Flag any inline logic that could use an existing utility** — hand-rolled string manipulation, manual path handling, custom environment checks, ad-hoc type guards, and similar patterns are common candidates.

### Agent 2: Code Quality Review

Review the same changes for hacky patterns:

1. **Redundant state**: state that duplicates existing state, cached values that could be derived, observers/effects that could be direct calls
2. **Parameter sprawl**: adding new parameters to a function instead of generalizing or restructuring existing ones
3. **Copy-paste with slight variation**: near-duplicate code blocks that should be unified with a shared abstraction
4. **Leaky abstractions**: exposing internal details that should be encapsulated, or breaking existing abstraction boundaries
5. **Stringly-typed code**: using raw strings where constants, enums (string unions), or branded types already exist in the codebase
6. **Unnecessary JSX nesting**: wrapper Boxes/elements that add no layout value — check if inner component props (flexShrink, alignItems, etc.) already provide the needed behavior
7. **Unnecessary comments**: comments explaining WHAT the code does (well-named identifiers already do that), narrating the change, or referencing the task/caller — delete; keep only non-obvious WHY (hidden constraints, subtle invariants, workarounds)

### Agent 3: Efficiency Review

Review the same changes for efficiency:

1. **Unnecessary work**: redundant computations, repeated file reads, duplicate network/API calls, N+1 patterns
2. **Missed concurrency**: independent operations run sequentially when they could run in parallel
3. **Hot-path bloat**: new blocking work added to startup or per-request/per-render hot paths
4. **Recurring no-op updates**: state/store updates inside polling loops, intervals, or event handlers that fire unconditionally — add a change-detection guard so downstream consumers aren't notified when nothing changed. Also: if a wrapper function takes an updater/reducer callback, verify it honors same-reference returns (or whatever the "no change" signal is) — otherwise callers' early-return no-ops are silently defeated
5. **Unnecessary existence checks**: pre-checking file/resource existence before operating (TOCTOU anti-pattern) — operate directly and handle the error
6. **Memory**: unbounded data structures, missing cleanup, event listener leaks
7. **Overly broad operations**: reading entire files when only a portion is needed, loading all items when filtering for one

Use this prompt shape for each reviewer:

```text
You are a review-only agent. Do not edit files.

Scope:
- Changed files: <paths>
- Repo guidance: <compact guidance summary>
- Additional user focus: <focus or none>

Full diff:
<diff>

Apply only this lens: <Code Reuse | Code Quality | Efficiency>.
Search the repository as needed before flagging duplication, missed helpers, or
local-pattern violations.

Return concrete findings only. For each finding include file/line evidence,
impact, and proposed fix. If clean, return "no findings".
```

## Strict Bar

Do not approve code merely because behavior is correct. Push for the cleaner
structure when behavior can stay the same.

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

When fixes were made, report:

- `Fixed`: material cleanup changes
- `Skipped or deferred`: false positives, out-of-scope issues, or judgment calls
- `Validation`: commands run and results
- `Residual risk`: anything not proven

For review-only output, lead with prioritized findings. Each finding needs
file/line evidence, impact, and proposed fix. End with validation status. If no
material issues are found, state the reviewed scope and say the code meets the
bar.

Do not rewrite unrelated code, silently edit during review-only work, or hand
off to PR publication, CI repair, security-only audit, or existing review-comment
workflows.

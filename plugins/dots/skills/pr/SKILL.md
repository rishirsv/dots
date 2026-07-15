---
name: pr
description: "Publishes local checkout changes as a GitHub PR, and updates PR bodies or descriptions when review evidence is missing. Confirms scope, commits, pushes, and opens draft PRs by default."
---

# PR

Use this skill when the user wants a GitHub pull request flow from the local
checkout: branch setup if needed, staging, commit, push, and PR creation. Also
use it when the user asks to update an existing PR body or description,
especially to add missing review evidence. For review-comment repair on an
existing PR, read
[addressing-comments.md](references/addressing-comments.md) first and keep that
repair on the PR's existing branch unless the user asks for a new branch.
When an installed GitHub publish or review-comment skill covers the requested
action, defer to it. `$pr` remains the portable local fallback and preserves
the same scope, draft-default, and visual-evidence checks.

## Prerequisites

- Require a local git repository and a clear intended scope.
- Treat Git transport authentication and GitHub PR API authentication as
  separate capabilities.
- For PR reads and writes, prefer an available authenticated GitHub
  connector/app. Do not probe `gh` when that integration covers the operation.
- Use GitHub CLI only as a fallback. Before the first CLI-dependent operation,
  run `gh --version` and `gh auth status`; a failure blocks that CLI operation,
  not local work or connector-backed work.

## Naming

- Branch: repo-native and human-readable. When starting from `main`, `master`,
  or the remote default branch, create the smallest conventional branch name
  that matches the change, such as `fix/missing-tool-call-ids`,
  `docs/release-notes`, or `agentHost/stale-selections`. Use an agent/tool
  namespace such as `codex/` only when the repo already uses that convention or
  the user asks for it.
- Commit: terse description of the scoped change.
- PR title: repo-native, concrete, and human. Do not add a generic agent prefix
  such as `[codex]` unless the repo already uses one.
- Choose the title dialect from nearby merged PRs before inventing one:
  - Conventional: `fix(scope): handle missing tool call IDs`, `docs: update
    release notes`, `release: 2.44.0`
  - Area prefix: `agentHost: handle stale selections`, `proxy: log nodePort
    changes`
  - Bracketed subsystem: `[DevTools] Fix console formatting`, `[release/1.128]
    Hide Tools Marketplace`
  - Plain imperative: `Handle keepalive events in Responses streams`, `Remove
    unused confirmation path`
  - Editorial/content: `Add a data-flow diagram to the cookbook intro`,
    `Technical polish: Parallel Search cookbook`
- For stacked PRs, make order visible elegantly when it helps review. Prefer a
  repo-specific series label such as `Record trust 2.1: Save logger entries
  before HealthKit projection` over a noisy generic tag.

## Workflow

If the user asks for the PR flow without execution, do not run commands; answer
from this checklist and include a short command checklist with the literal
commands `git status -sb`, `git diff --stat`, `git diff --staged --stat`,
`git push -u origin "$(git branch --show-current)"`, and
`gh pr create --draft`.

1. Confirm scope.
   - Run `git status -sb`, `git diff --stat`, and `git diff --staged --stat`.
   - If the intended diff is unclear, ask for scope before staging, committing,
     or pushing.
   - If the worktree contains unrelated changes, ask which paths belong in the
     PR.
2. Choose the branch strategy.
   - If starting from the default branch, create a repo-native branch as
     described in Naming.
   - Otherwise stay on the current branch unless the user asks for a new one.
   - For review-comment repair, prefer the existing PR branch.
3. Stage only intended changes.
   - Prefer explicit paths.
   - Use `git add -A` only when the whole worktree is in scope.
4. Commit with the confirmed description.
5. Run the most relevant checks available if they have not already run.
6. Push with tracking:

```bash
git push -u origin "$(git branch --show-current)"
```

   - Run the normal Git push without using `gh auth status` as a precondition.
     A successful push is sufficient transport-authentication evidence. If it
     fails for authentication, diagnose the configured remote credential path
     from that Git error without exposing secrets; do not infer push failure
     from unrelated GitHub CLI state.

7. Open a PR.
   - Derive the repository from `git remote get-url origin` or
     `gh repo view --json nameWithOwner`.
   - Derive the current branch from `git branch --show-current`.
   - Use the requested base branch, or the remote default branch.
   - Default to draft. If the user explicitly asks for ready-for-review, create
     it ready; for CLI fallback, omit `--draft`. For UI, frontend, visual,
     design-facing, or mock changes with required evidence, create a draft
     first and mark it ready only after the live body has every required
     uploaded asset.
   - Prefer any available GitHub connector/app for PR creation after push; use
     `gh pr create --fill --head "$(git branch --show-current)"`, adding
     `--draft` only for draft PRs, when connector coverage is unavailable or
     ambiguous.
   - Write the PR body to a temp file when using CLI fallback so Markdown
     renders cleanly.
8. Check the created PR.
   - Re-query the PR after creation for merge state, checks, review decision,
     and current review threads when available.
   - For UI, frontend, visual, design-facing, or mock changes, follow
     [visual-evidence.md](references/visual-evidence.md). Discover a
     repository-generated evidence index before publishing or handing off,
     upload every listed local asset through an authenticated GitHub attachment
     path, and embed it with its useful caption and alt text. A local path or a
     text-only screen list or unrendered Markdown link is not durable PR
     evidence. For committed GitHub image assets, use the full-commit-SHA raw
     URL form owned by that reference; a normal `blob` page is not an image
     response.
   - Re-query or inspect the rendered live PR body after the update. Confirm
     every required image or clip is embedded, loads, and remains paired with
     the right claim. If any required listed asset is absent, keep the PR draft;
     do not finish it ready for review. State what evidence remains only when
     the capture or upload is genuinely unavailable.
   - For stacked PRs, verify the base branch/PR and summarize the stack order
     naturally in the handoff.
9. Summarize the branch, commit, PR URL, validation, PR health, and anything
   still needing user confirmation.

## Write Safety

- Never stage unrelated changes silently.
- Never push without confirming scope when the worktree is mixed.
- Do not publish a ready-for-review PR unless the user explicitly asks for one.
- Stop if the repository is not connected to an accessible GitHub remote.

## PR Body

The PR description should read like a compact explanation for a human reviewer:
clear enough for a product partner or capable teammate outside the code area to
understand, structured enough for a maintainer to scan quickly, and free of
agent bookkeeping. Start with user-visible behavior and why it matters. Use
technical terms when they are the clearest wording, but translate them briefly
on first use.

Use Markdown structure when it helps review. Natural prose does not mean a flat
paragraph blob. Good headings include:

- `What changed`
- `Why it matters`
- `Review focus`
- `Screenshots`
- `Validation`

For a substantial change, tell the useful story in conceptual rather than file
or commit order:

1. **Outcome and impact.** What is meaningfully different for users, product,
   operators, or developers, and why it matters.
2. **Relevant context.** The prior behavior, problem, or constraint needed to
   understand the change; include the root cause when this is a fix.
3. **Core idea.** The main implementation choice in plain language.
4. **Implementation.** Group changes by responsibility, dependency, or user
   flow. Name files only when they help a reviewer inspect the work.
5. **Evidence and review focus.** Tests, visual proof, remaining gaps, and the
   decisions or boundaries that deserve close attention.

Scale this to the change. A small PR may need only a few paragraphs and
validation; do not force empty headings. Synthesize the commits instead of
concatenating their messages.

Keep validation calm and evidentiary. Prefer `Passed: scripts/validate test
(468 feature tests)` over a giant standalone `TEST SUCCEEDED` line.

For UI, frontend, visual, design-facing, or mock changes, read
[visual-evidence.md](references/visual-evidence.md). Before closing out,
discover and transfer any repository-generated evidence index, then re-query or
verify the live PR body and confirm the required embeds are present. Never
describe local capture paths as PR evidence. If real captures or their uploads
are not available yet, keep the PR draft and say exactly what evidence is still
needed before it is ready for review.

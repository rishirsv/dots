---
name: pr
description: "Publishes local changes to GitHub by confirming scope, committing intentionally, pushing the branch, and opening a draft pull request. Also handles actionable PR review comments when the user asks."
---

# PR

Use this skill when the user wants a GitHub pull request flow from the local
checkout: branch setup if needed, staging, commit, push, and PR creation. For
review-comment repair on an existing PR, read
[addressing-comments.md](references/addressing-comments.md) first.

## Prerequisites

- Require a local git repository and a clear intended scope.
- Require GitHub CLI `gh`; run `gh --version`.
- Require authenticated `gh`; run `gh auth status` and stop if the user needs to
  authenticate.

## Naming

- Branch: `codex/{description}` when starting from `main`, `master`, or the
  remote default branch.
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

1. Confirm scope.
   - Run `git status -sb` and inspect the diff before staging.
   - If the worktree contains unrelated changes, ask which paths belong in the
     PR.
2. Choose the branch strategy.
   - Create `codex/{description}` from the default branch.
   - Otherwise stay on the current branch unless the user asks for a new one.
3. Stage only intended changes.
   - Prefer explicit paths.
   - Use `git add -A` only when the whole worktree is in scope.
4. Commit with the confirmed description.
5. Run the most relevant checks available if they have not already run.
6. Push with tracking:

```bash
git push -u origin "$(git branch --show-current)"
```

7. Open a draft PR.
   - Derive the repository from `git remote get-url origin` or
     `gh repo view --json nameWithOwner`.
   - Derive the current branch from `git branch --show-current`.
   - Use the requested base branch, or the remote default branch.
   - Prefer any available GitHub connector/app for PR creation after push; use
     `gh pr create --draft --fill --head "$(git branch --show-current)"` when
     connector coverage is unavailable or ambiguous.
   - Write the PR body to a temp file when using CLI fallback so Markdown
     renders cleanly.
8. Check the created PR.
   - Re-query the PR after creation for merge state, checks, review decision,
     and current review threads when available.
   - For stacked PRs, verify the base branch/PR and summarize the stack order
     naturally in the handoff.
9. Summarize the branch, commit, PR URL, validation, PR health, and anything
   still needing user confirmation.

## Write Safety

- Never stage unrelated changes silently.
- Never push without confirming scope when the worktree is mixed.
- Default to a draft PR unless the user explicitly asks for ready-for-review.
- Stop if the repository is not connected to an accessible GitHub remote.

## PR Body

The PR description should read like a compact explanation for a human reviewer:
clear enough for a smart non-specialist teammate to understand, structured
enough for a maintainer to scan quickly, and free of agent bookkeeping.

Use Markdown structure when it helps review. Natural prose does not mean a flat
paragraph blob. Good headings include:

- `What changed`
- `Why it matters`
- `Review focus`
- `Screenshots`
- `Validation`

Cover the useful story:

- what changed
- why it changed
- user or developer impact
- root cause when the PR is a fix
- checks used to validate it

Keep validation calm and evidentiary. Prefer `Passed: scripts/validate test
(468 feature tests)` over a giant standalone `TEST SUCCEEDED` line.

For UI, frontend, visual, or design-facing changes, include screenshots or short
clips in the PR body. Place images near the explanation they support, with
captions that tell the reviewer what to notice. If real captures are not
available yet, keep the PR draft and say exactly what screenshots are still
needed before it is ready for review.

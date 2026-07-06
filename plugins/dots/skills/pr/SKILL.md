---
name: pr
description: "Publishes local changes to GitHub by confirming scope, committing intentionally, pushing the branch, and opening a draft pull request. Also handles actionable PR review comments when the user asks."
---

# PR

Use this skill only when the user explicitly wants a GitHub pull request flow
from the local checkout: branch setup if needed, staging, commit, push, and PR
creation. For review-comment repair on an existing PR, read
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
- PR title: `[codex] {description}`.

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
8. Summarize the branch, commit, PR URL, validation, and anything still needing
   user confirmation.

## Write Safety

- Never stage unrelated changes silently.
- Never push without confirming scope when the worktree is mixed.
- Default to a draft PR unless the user explicitly asks for ready-for-review.
- Stop if the repository is not connected to an accessible GitHub remote.

## PR Body

The PR description should use real Markdown prose and cover:

- what changed
- why it changed
- user or developer impact
- root cause when the PR is a fix
- checks used to validate it

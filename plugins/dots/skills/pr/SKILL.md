---
name: pr
description: "Publishes local checkout changes as a GitHub PR, and updates PR bodies or descriptions when review evidence is missing. Confirms scope, commits, pushes, and opens draft PRs by default."
---

# PR

Publish a local checkout or repair its existing PR body. Use local `git` for
repository operations and `gh` for GitHub reads and writes; use a connector
only when the user explicitly requests it. For review-comment repair, read
[addressing-comments.md](references/addressing-comments.md) and stay on the PR
branch unless asked otherwise.

Require a local repository and clear scope. Treat Git transport and GitHub API
authentication separately. Before the first PR API operation, run
`gh --version` and `gh auth status`; failure blocks that operation, not local
work or a normal Git push.

## Ready shortcut

When the user says `ready` while using this skill, treat it as explicit
authorization to mark the pull request for the current branch ready for review:

```bash
gh pr ready
```

Re-query the PR afterward. This can trigger provider-configured automatic
reviews, but do not post a manual review request unless the user asks.

## Workflow

If the user asks for the PR flow without execution, do not run commands; answer
with the literal commands from steps 1, 5, and 6.

1. Confirm scope.
   - Run `git status -sb`, `git diff --stat`, and `git diff --staged --stat`.
   - If the intended diff is unclear or mixed, ask which paths belong before
     staging, committing, or pushing.
2. Choose the branch and names.
   - From the default branch, create the smallest repo-native branch; otherwise
     keep the current branch. Do not invent an agent prefix.
   - Match nearby merged PR titles. Keep the commit terse and scoped. For a
     stack, verify the base and make the order clear.
3. Stage explicit intended paths and commit. Use `git add -A` only when the
   entire worktree is in scope.
4. Reuse validation. Git and GitHub transitions are not validation boundaries.
   Reuse fresh results and repository receipts for unchanged source. If source
   changed, run only the repository-prescribed focused check or final gate once.
5. Push with tracking:

```bash
git push -u origin "$(git branch --show-current)"
```

   A successful push proves transport authentication. On failure, diagnose the
   configured credential path without exposing secrets or changing transports
   without evidence.
6. Create the PR with the requested or remote-default base:

```bash
gh pr create --fill --draft --head "$(git branch --show-current)"
```

   Default to draft; omit `--draft` only when explicitly asked for ready review.
   Write a custom body through a temporary file. If the request only changes an
   existing body, skip steps 2–5 and edit that PR directly.
7. Re-query the live PR for merge state, checks, review decision, and review
   threads. For visual changes, read
   [visual-evidence.md](references/visual-evidence.md), publish its required
   evidence, and inspect the rendered body once. Keep the PR draft while
   required evidence is absent.
8. Report branch, commit, PR URL, validation, PR health, stack order when
   relevant, and any remaining confirmation.

## PR Body

Write for a human reviewer, not agent bookkeeping. Scale the body to the change
and synthesize rather than concatenate commits. Cover outcome and impact,
relevant context or root cause, the core implementation grouped by
responsibility, review focus, and calm validation evidence. Use headings only
when useful and translate unfamiliar technical terms briefly.

## Safety

- Never stage unrelated changes or push a mixed scope silently.
- Never mark a PR ready unless explicitly asked.
- Stop when no accessible GitHub remote exists.

---
name: commit
description: "Use when the user wants to commit, save, checkpoint, stage-and-commit, split, amend, or push committed work — including 'push' right after a commit or 'commit and push'. Same safety gates apply to push. PRs, merges, rebases, and force-pushes belong elsewhere."
---

# Commit

Create one clean local commit from the intended changes, then push only if
asked. The staged index is what Git records — never sweep unrelated work into
history, and never discard, revert, or overwrite working-tree changes.

## Scope and staging

Run `git status --short` and `git diff --staged`. If staged content already
matches the requested scope, commit it. Otherwise stage explicit paths, not
`git add -A`, unless the user clearly wants the whole worktree; for mixed
files stage only the intended hunks, asking one scope question if partial
staging is too risky; never touch unrelated untracked files.

Split or ask when a part could be reviewed or reverted independently, or the
subject would need vague glue like "misc" — commit the safest independent
slice first, then re-check status.

## Validate, message, commit

Run `git diff --staged --check`. Reuse fresh validation from this session;
otherwise run focused tests or linters when obvious and cheap, or say what
wasn't run. Never invent validation evidence or bypass hooks with
`--no-verify` unless asked.

Match the repo's recent style (`git log --oneline -5`); default to a plain
imperative subject ≤50 chars naming the outcome, a body only when it helps
review, and no tool-attribution trailers unless the repo requires them.
Multi-line messages go through `git commit --file`. Afterward run
`git show --stat --oneline HEAD` and report SHA, subject, and validation.

## Special requests

**Message only**: inspect the staged diff, write the message, stop.

**Amend**: only when explicitly requested and the commit is local and
unpublished; if it may have been pushed or reviewed, stop unless the user
approves the history rewrite.

**Push**: only on an explicit push request — a plain commit stays local. When
"publish" could mean either pushing the branch or opening a pull request, ask
which outcome the user wants. With an upstream, `git push`; with none,
`git push -u origin "$(git branch --show-current)"`. Ask first when the
branch is detached or looks like default, the remote is unclear or
non-`origin`, or the push isn't fast-forward. Never open a PR, merge, rebase
shared history, or force-push unless asked for that exact operation.

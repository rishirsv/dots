---
name: commit
description: "Use when the user wants to commit, save, checkpoint, stage-and-commit, split, amend, or push committed work — including 'push' right after a commit or 'commit and push'. Same safety gates apply to push. PRs, merges, rebases, and force-pushes belong elsewhere."
---

# Commit

Create one clean local commit from the intended changes, then push only if
asked. The staged index is what Git records — never sweep unrelated work
into history, and never discard, revert, or overwrite working-tree changes.

## Scope and staging

Run `git status --short` and `git diff --staged`. If staged content already
matches the requested scope, move to Validate. Otherwise stage explicit paths
(`git add -- path/to/file`) rather than `git add -A`, unless the user clearly
wants the whole worktree or every dirty path is checked and belongs together;
for mixed files, stage only the intended hunks, asking one scope question if
partial staging is too risky non-interactively. Never touch unrelated
untracked files; unstage accidentally-staged paths without touching content.

Split or ask before committing when a part could be reviewed/reverted
independently, the subject would need vague glue like "misc" or "cleanup", or
unrelated staged work can't be safely separated — commit the safest independent
slice first and re-check status before the next one. Reach for deeper
inspection (`git status -sb`, `git diff --stat`, `git log --oneline -10`) only
when nothing is staged and intended work isn't obvious, staged content spans
multiple stories, the user asks to split, amend, push, or write a message
only, or the change touches risky surfaces (migrations, auth, release config,
generated files). Most commits never need this.

## Validate, message, commit

Run `git diff --staged --check` before committing; reuse other fresh validation
from the same session instead of rerunning it, otherwise run focused tests,
type checks, or linters when obvious and cheap, and verify risky or
generated-file changes explicitly or say what wasn't run. Never invent
validation evidence, and don't bypass hooks with `--no-verify` unless asked.

Match the repo's recent style (`git log --oneline -5` if unknown); otherwise a
plain imperative subject, ≤50 chars (72 hard cap), naming the outcome, no
trailing period. Add a body only when it helps review, with no tool
attribution or generated-by trailers unless the repo requires them. For
multi-line messages, write to a temp file and `git commit --file`. Afterward
run `git show --stat --oneline --summary HEAD` and report SHA, subject, and
validation evidence.

## Special requests

**Message only**: inspect the staged diff, write the message, and stop.

**Amend**: only when explicitly requested, the target commit is local and
unpublished, and the staged diff is exactly what should be amended. Check
`git log --oneline -5`, `git status -sb`, and upstream tracking first; if it's
likely been pushed or reviewed, stop unless the user explicitly approves the
history rewrite.

**Push**: only when the user explicitly says push, commit-and-push, or asks to
push right after a commit was just made — a plain commit stays local-only, and
bare "publish" means PR language unless clearly just the branch push. Check
`git branch --show-current` and upstream tracking (`@{u}`). With an existing
upstream, `git push`; with no upstream and `origin` as the clear publication
remote, `git push -u origin "$(git branch --show-current)"` (missing upstream
is normal, not a failure). Ask first if the branch is detached, the remote or
default branch is unclear, the repo uses a non-`origin` remote, the current
branch looks like default, or the push would be non-fast-forward or require
force. Never open a PR, merge, rebase shared history, or force-push unless
asked for that exact operation. Report stays short: what was included,
validation status, and push result only when requested — mention leftover
work only if it affects the next step.

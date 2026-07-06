---
name: commit
description: "Use when the user wants to commit, save, checkpoint, stage-and-commit, split, amend, or push committed work — including 'push' right after a commit or 'commit and push'. Same safety gates apply to push. PRs, merges, rebases, and force-pushes belong elsewhere."
---

# Commit

Create one clean local commit from the intended changes, then push only if
asked. Move fast when the index is clear; slow down only when Git state,
scope, or publication risk demands it. The staged index is what Git records —
treat it as the source of truth and never sweep unrelated work into history.

## Default flow

```sh
git status --short
git diff --staged
git diff --staged --check
```

Use `git diff --staged --stat` first when the diff is large, then read the
hunks that decide scope and message. Glance at `git log --oneline -5` if the
repo's commit style isn't already known. If the staged diff clearly matches
the request, write the message and commit, then:

```sh
git show --stat --oneline --summary HEAD
```

Report the SHA, subject, and validation result. Stop there unless push was
requested.

## When to inspect more

Most commits never need this. Match the probe to the one question in front of
you — don't run a full Git inventory by habit or pre-screen every commit
against this list. Reach for it when: nothing is staged and the intended work
isn't obvious; staged content looks unrelated or spans multiple
reviewer-visible stories; the user asks to split, amend, push, or write a
message only; the change touches risky surfaces (migrations, auth, release
config, generated files); or an obvious cheap validation hasn't run yet.

Useful probes: `git status -sb`, `git diff --stat`,
`git diff --staged --name-only`, `git diff --staged -- <path>`,
`git diff -- <path>`, `git log --oneline -10`, `git branch --show-current`.
Use `git remote -v` or upstream checks only for push decisions.

## Staging and scope

Preserve a staged set that already matches the requested scope. Otherwise
stage explicit paths (`git add -- path/to/file`) rather than `git add -A`,
unless the user clearly wants the whole worktree or every dirty path has been
checked and belongs to the same commit. Never touch unrelated untracked
files. For mixed files, stage only the intended hunks; if partial staging is
too risky non-interactively, ask one concise scope question instead of
guessing. If unrelated files got staged by accident, say what's being
unstaged and unstage only those paths without touching their content.

Make the commit tell one coherent, reviewer-visible story. Split or ask
before committing when a part could be reviewed/reverted independently, the
subject would need vague glue like "misc" or "cleanup", the body would need
to explain unrelated reasons for change, or unrelated staged work can't be
safely separated. When splitting, commit the safest independent slice first
and re-check status before the next one.

## Validation

Reuse fresh validation from the same session instead of rerunning it.
`git diff --staged --check` is already part of the default flow — don't
repeat it. Run focused tests, type checks, or linters when obvious and cheap
for the touched behavior; prefer targeted checks over broad suites. For
risky or generated-file changes, verify the owning command or say what
wasn't run. Never invent validation evidence, and don't bypass hooks with
`--no-verify` unless the user explicitly asks.

## Message

Match the repo's recent commit style; otherwise a plain imperative subject
(or Conventional Commits if that's the obvious local pattern). Keep the
subject at or under 50 characters (72 hard cap), imperative mood, naming the
outcome rather than the implementation diary, no trailing period. Add a body
only when it helps review — non-trivial behavior, migrations, public
contracts, compatibility, surprising tradeoffs — with no tool attribution or
generated-by trailers unless the repo requires them.

For multi-line messages, use a temp file:

```sh
message_file=$(mktemp)
printf '%s\n' "Subject" "" "Body when useful." > "$message_file"
git commit --file "$message_file"
rm -f "$message_file"
```

## Special requests

**Message only**: inspect the staged diff, write the message, and stop — do not commit.

**Amend**: only when explicitly requested, the target commit is local and
unpublished, and the staged diff is exactly what should be amended. Check
`git log --oneline -5`, `git status -sb`, `git diff --staged`, and upstream
tracking first. If it's likely been pushed or reviewed, stop unless the user
explicitly approves the history rewrite.

**Push**: push when the user explicitly says push, commit-and-push, or asks
to push right after a commit was just made — a plain commit request stays
local-only, and bare "publish" means PR language unless the user clearly
means just the branch push. Before pushing, check `git branch --show-current`
and `git rev-parse --abbrev-ref --symbolic-full-name @{u}`. With an existing
upstream, `git push`; with no upstream and `origin` as the clear publication
remote, set tracking explicitly with
`git push -u origin "$(git branch --show-current)"`. Ask first when the
branch is detached, the remote or default branch is unclear, the repo uses a
non-`origin` publication remote, the current branch looks like the default
branch, or the push would be non-fast-forward or require force. A missing
upstream on a local branch is normal, not a failure.

## Boundaries

Do not open a pull request, merge, rebase shared history, or force-push
unless explicitly asked for that exact operation. Do not discard, revert,
delete, or overwrite working-tree changes, or hide behavior changes inside
"cleanup".

## Final report

Keep it short: commit SHA and subject, what was included at a high level,
validation run/reused/skipped/failed, and push result only when push was
requested. Mention leftover work only if it affects validation, push safety,
or the user's next step — don't dump a dirty-worktree inventory.

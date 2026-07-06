---
name: commit
description: "Create fast, focused local git commits when the user wants to commit, save, checkpoint, stage-and-commit, split, amend, or prepare a commit message. Push is explicit-only; PRs, PR publication, merges, rebases, and force-pushes belong elsewhere."
---

# Commit

Create one clean local commit from the intended changes. Move quickly when the
index is already clear; slow down only when Git state, scope, or publication risk
requires it.

The staged index is what Git records. Treat it as the source of truth before
committing, and never sweep unrelated work into history.

## Normal Path

For an ordinary "commit this" request, use the shortest safe loop:

```sh
git status --short
git diff --staged
git diff --staged --check
```

Use `git diff --staged --stat` first when the staged diff is large, then read
the hunks that decide scope and message. If the staged diff clearly matches the
user's request, write the commit message and commit. If the repo's commit style
is not already known, glance at `git log --oneline -5` first.

After the commit, run:

```sh
git show --stat --oneline --summary HEAD
```

Then report the SHA, subject, and validation result. If the user did not ask to
push, stop there.

## When To Inspect More

Most commits never need this. If something looks off while reading the staged
diff, match the probe to that one question. Do not pre-screen every commit
against this list.

- Nothing is staged and the intended unstaged work is not obvious.
- Staged content appears unrelated, mixed with unrelated hunks, or split across
  multiple reviewer-visible stories.
- The user asks to split, amend, push, or write a message only.
- The change touches risky surfaces such as migrations, persistence, auth,
  release config, generated project files, or broad user-facing behavior.
- Validation has not run and there is an obvious cheap check for the touched
  behavior.

Use targeted commands for the question in front of you. Do not run a full Git
inventory by habit.

Useful probes:

```sh
git status -sb
git diff --stat
git diff --staged --name-only
git diff --staged -- <path>
git diff -- <path>
git log --oneline -10
git branch --show-current
```

Use `git remote -v` or upstream checks only for push/publication decisions.

## Staging

Preserve a staged set when it already matches the requested scope.

If staging is needed, stage explicit paths:

```sh
git add -- path/to/file another/path
```

Prefer explicit paths even when most of the worktree belongs to the commit. Use
`git add -A` only when the user clearly asked for all dirty work, or when every
dirty path has been inspected and belongs to the same commit. Preserve unrelated
untracked files.

For mixed files, stage only the intended hunks. If partial staging is too risky
to do non-interactively, ask one concise scope question instead of guessing.

If clearly unrelated files are staged by accident, say what you are unstaging,
then unstage only those paths. Do not modify their working-tree content.

## Scope

Make the commit tell one coherent story. Keep tests, fixtures, generated files,
and docs with the behavior they verify or explain when they are part of the same
change.

Split or ask before committing when:

- one part could be reviewed, reverted, or shipped independently
- the subject would need vague glue such as `misc`, `updates`, or `cleanup`
- the body would need to explain unrelated reasons for change
- unrelated staged work cannot be safely separated

When splitting, commit the safest independent slice first, then re-check status
before the next commit.

## Validation

Use fresh validation that matches the risk. If relevant checks already ran in
the same session, reuse that evidence instead of rerunning them.

Good defaults:

- `git diff --staged --check` runs as part of the normal path; do not repeat it.
- Run focused tests, type checks, linters, formatters, or artifact checks when
  they are obvious and cheap for the touched behavior.
- Prefer targeted checks over broad suites.
- For risky behavior, stale validation, or generated files, verify the owning
  command or explain what was not run.

Never invent validation evidence. Do not bypass hooks with `--no-verify` unless
the user explicitly asks.

## Message

Use the repository's recent commit style when it is clear. Otherwise use a plain
imperative subject, or Conventional Commits when that is the obvious local
pattern.

Subject rules:

- Keep it at or under 50 characters when possible, with 72 as the hard cap.
- Use imperative mood.
- Name the outcome, not the implementation diary.
- Do not end with a period.

Add a body only when it helps review: non-trivial behavior, migrations, public
contracts, compatibility decisions, validation context, or surprising tradeoffs.
Do not include tool attribution, raw transcripts, or generated-by trailers unless
the repo requires them.

Use a message file for multi-line commits:

```sh
message_file=$(mktemp)
printf '%s\n' "Subject" "" "Body when useful." > "$message_file"
git commit --file "$message_file"
rm -f "$message_file"
```

## Special Requests

**Message only**: If the user asks only for a commit message or staged diff
summary, inspect the staged diff, write the message, and stop. Do not commit.

**Checkpoint/savepoint**: Prefer a normal focused commit when the work is
coherent. If the work is mixed and scope is unclear, ask one concise question.

**Amend**: Amend only when the user explicitly requests it, the target commit
is local and unpublished, and the staged diff is exactly what should be
amended. Inspect the previous commit and publication state first:

```sh
git log --oneline -5
git status -sb
git diff --staged
git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

If it has likely been pushed or reviewed, stop unless the user explicitly
approves the history rewrite.

**Push**: Push only when the user explicitly says push, commit-and-push, save
and push, or equivalent — a plain commit request is local-only, and bare
"publish" means PR-publication language unless the user clearly asks only to
push the branch.

Before pushing, inspect the current branch and upstream directly:

```sh
git branch --show-current
git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

If the branch already has an upstream, use a normal push:

```sh
git push
```

If the branch has no upstream and `origin` is the clear publication remote, set
tracking explicitly:

```sh
git push -u origin "$(git branch --show-current)"
```

Ask before pushing when the branch is detached, the remote is unclear, the
default branch cannot be determined, the repo uses a non-`origin` publication
remote, the current branch appears to be the default branch, the push would be
non-fast-forward, or force would be required. A missing upstream is normal for a
local branch; use it to decide whether tracking should be set, not as a failure.

## Boundaries

- Do not open a pull request.
- Do not merge.
- Do not rebase shared history.
- Do not force-push unless the user explicitly asks for that exact operation.
- Do not discard, revert, delete, or overwrite working-tree changes.
- Do not hide behavior changes inside "cleanup."

## Final Report

Keep the report short:

- commit SHA and subject
- what was included at a high level
- validation run, reused, skipped, or failed
- push result only when push was requested

Mention leftover work only when it affects validation, push safety, or the
user's next step. Avoid dumping a dirty-worktree inventory.

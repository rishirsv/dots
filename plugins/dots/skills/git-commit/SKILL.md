---
name: git-commit
description: "Create focused local git commits when the user wants to commit, save, checkpoint, stage-and-commit, split, amend, or prepare a commit message. Push is explicit-only. Not for opening PRs, merging, rebasing shared history, or force-pushing."
---

# Git Commit

Create focused git commits from intended work without sweeping unrelated
changes into history. Git commits record the staged index, so this skill treats
scope and staging as the core job. Push only in explicit push mode.

## Trigger

Use when the user asks to do commit work, including ordinary wording such as
`commit this`, `make a commit`, `save these changes`, `checkpoint this`, `stage
and commit`, `write a commit message`, `split this into commits`, or invokes
`git-commit` / `$git-commit`.

Push mode remains explicit-only. Do not infer push intent from a plain commit,
save, or checkpoint request.

Do not use for opening pull requests, publishing review branches, merging,
rebasing shared history, CI babysitting, or PR review threads. If the user asks
to publish or open a PR, create any needed local commit first, then route the
publication step to `publish-pr`.

## Modes

- **Commit**: default. Create one focused local commit from intended changes.
- **Message-only**: when the user asks for a commit message or staged diff
  summary. Write the message and stop; do not commit.
- **Split**: when the diff contains multiple reviewer-visible stories or the
  user asks for separate commits. Commit the safest independent slice first,
  then re-check state before the next slice.
- **Push**: when the invocation includes `push`, `commit and push`, `save and
  push`, or equivalent wording. Commit first when needed, then push only when
  branch and remote state are clear.
- **Amend**: only when the user explicitly asks to amend. Amend local,
  unpublished history only unless the user explicitly authorizes rewriting a
  shared branch.
- **Checkpoint**: when the user asks for a checkpoint/savepoint and the work is
  coherent enough to preserve locally. Prefer a normal focused commit; if the
  work is mixed or unclear, ask one concise scope question.

## Preflight

Inspect enough state to answer four questions: what branch is this, what is
already staged, what changed, and what style does this repo use?

```bash
git status --short
git status -sb
git diff --stat
git diff --staged --stat
git diff --name-only
git diff --staged --name-only
git branch --show-current
git remote -v
git log --oneline -10
```

Read full diffs only as needed:

```bash
git diff -- path/to/file
git diff --staged -- path/to/file
```

If nothing is staged and no intended unstaged work is clear, ask one concise
scope question. If the user requested message-only mode and nothing is staged,
say there is no staged diff to summarize.

## Scope Rules

Make each commit tell one coherent story. File count is not the deciding
factor; reviewability and reversibility are.

Keep one commit when:

- all changes support the same feature, fix, docs update, refactor, test, or
  maintenance task
- tests, fixtures, generated files, config, or docs directly verify or explain
  the main change
- multiple files changed because one behavior crosses normal module boundaries

Split or ask before committing when:

- the diff contains unrelated features, fixes, docs, cleanup, or product
  surfaces
- one part could be reviewed, reverted, or shipped independently
- the subject would need vague glue such as `misc`, `updates`, or `cleanup and
  fixes`
- the body would need two unrelated explanations
- only part of a file belongs in the commit and partial staging cannot be done
  safely non-interactively

Good split order:

1. Generated schema, storage, or API definitions.
2. Foundational refactors or mechanical moves.
3. Core behavior changes.
4. Wiring and integration.
5. UI or surface behavior.
6. Tests and docs, included with the behavior they verify unless they stand
   alone.

## Cleanup Before Commit

When cleanup is in scope, check the intended diff for obvious AI-generated
slop before staging:

- unnecessary comments or comments inconsistent with local style
- abnormal defensive checks, broad `try` / `catch`, or fallback paths in trusted
  code
- casts such as `any` that bypass type issues
- deeply nested code that nearby style would express with early returns
- unrelated formatting churn

Keep behavior unchanged unless fixing a clear bug. Do not turn a commit request
into a broad refactor.

## Staging

Preserve an existing staged set when it matches the requested scope. If staged
files look unrelated to the requested commit, ask before changing the index. If
a file is clearly staged by accident, unstage only that explicit path and report
it.

Prefer explicit path staging:

```bash
git add -- path/to/file another/path
```

Avoid `git add -A` unless the entire dirty worktree clearly belongs to the same
requested commit. Preserve unrelated untracked files unless they are clearly
part of the intended commit.

Before each commit, re-check:

```bash
git status --short
git diff --staged --stat
```

Review the staged diff, not just the working tree, because the staged index is
what the commit records.

## Validation

Run relevant validation when it is obvious, cheap, and not already fresh from
this session. Prefer targeted tests, type checks, lint, or a focused executable
check for the touched behavior over broad suites by default.

For bug fixes with a cheap local test path, prefer evidence that fails before
the fix and passes after. For other work, verify the real artifact when
practical, not just a proxy. If validation is skipped, say why. Never invent
validation evidence from the diff or commit message.

## Message Style

Prefer the repo's clear recent style. If history is mixed or unclear, use
Conventional Commits:

```text
type(optional-scope): imperative subject

Body explaining what changed and why, when useful.

Footer trailers, when applicable.
```

Subject rules:

- Aim for about 50 characters; treat 72 as the hard ceiling.
- Use imperative mood: `fix parser cache miss`, not `fixed parser cache miss`.
- Do not end the subject with a period.
- Name the outcome, not the implementation diary.
- Make the subject complete the sentence: "If applied, this commit will ...".

Use the dominant reviewer-visible type:

- `feat`: new user-facing behavior or capability
- `fix`: bug fix or regression repair
- `docs`: documentation-only change
- `refactor`: behavior-preserving structure change
- `test`: test-only change
- `perf`: performance improvement
- `build`: build system, dependency, or packaging change
- `ci`: CI configuration or automation
- `chore`: maintenance that does not fit the above

Include a scope only when it names a real package, module, command, or
user-visible area. Omit vague or invented scopes.

Use a body for non-trivial changes, surprising tradeoffs, migrations, public API
changes, security-sensitive changes, or validation context. Let the diff explain
low-level mechanics. Use `BREAKING CHANGE:` in the footer, or `!` after the
type/scope, only when the change breaks a public contract. Add issue trailers
only when the issue is known from the request, branch, history, or diff.

Do not include raw test transcripts, generated-by lines, tool provenance, or AI
attribution trailers unless the repo or user explicitly requires them.

Use a temp file for multi-line messages:

```bash
git commit --file "$message_file"
```

Use `-m` only for simple one-line commits.

## Push Mode

Push mode is explicit. Treat `git-commit push`, `$git-commit push`, `commit and
push`, and `save and push` as push requests. Do not infer push intent from plain
`git-commit`, `commit`, `save`, or `checkpoint`.

Push only after the intended local commit exists. If there is nothing to commit
but the user explicitly asked to push existing local commits, inspect branch and
upstream state before pushing.

Before pushing:

```bash
git status -sb
git branch --show-current
git rev-parse --abbrev-ref --symbolic-full-name @{u}
git symbolic-ref --short refs/remotes/origin/HEAD
```

If the branch has an upstream, push normally:

```bash
git push
```

If the branch has no upstream and is clearly a feature or work branch, set
tracking explicitly:

```bash
git push -u origin "$(git branch --show-current)"
```

Stop and ask one concise question before pushing when the branch is detached,
the remote is unclear, the current branch appears to be the default branch, the
push would be non-fast-forward, or the push would require force.

## Amend Mode

Amend only on explicit request. Before amending, inspect the previous commit and
branch publication state:

```bash
git log --oneline -5
git status -sb
git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

Amend freely only when the target commit is local and unpublished. If the commit
has likely been pushed or reviewed, stop unless the user explicitly approves the
history rewrite. Never force-push from this skill without explicit force-push
authorization.

## Boundaries

- Do not open a pull request.
- Do not merge.
- Do not push without push mode.
- Do not force-push, rebase shared history, or rewrite published history unless
  the user explicitly asks.
- Do not bypass hooks with `--no-verify` unless the user explicitly asks.
- Do not commit unrelated work.
- Do not silently discard, revert, delete, or overwrite files.
- Do not hide behavior changes inside "cleanup".

## Final Report

For each commit, report:

- commit SHA and subject
- files included
- whether the commit was one of several split commits
- validation run, result, or skipped reason
- push state when push mode was requested
- uncommitted or unstaged work intentionally left behind

---
name: yeet
description: "Use when the user explicitly asks to yeet, publish, push a branch and PR, open a pull request, or run the stage-commit-push-and-open-draft-PR flow end to end — isolating intended changes, preserving unrelated work, writing a focused commit, pushing with tracking, and opening a reviewer-friendly draft PR; not for a local-only commit with no push (use $commit) or operating on existing PRs (use $gh-review)."
---

# Yeet

Stage the intended changes, commit them cleanly, push the branch, and open a reviewer-friendly PR in one flow.

## Prerequisites

- Require GitHub CLI `gh`. Check `gh --version`. If missing, ask the user to install `gh` and stop.
- Require authenticated `gh` session. Run `gh auth status`. If not authenticated, ask the user to run `gh auth login` and re-run `gh auth status` before continuing.

## Naming conventions

- Branch: `{type}/{description}` when starting from the default branch and the scope is obvious.
- Commit: `{description}` as a terse, recallable subject.
- PR title: `{description}` summarizing the full diff.

If the repo already has an obvious branch naming pattern, follow that instead of forcing a new one.

Prefer human branch prefixes that describe the work:

- `feat/` for user-facing features or new capabilities
- `fix/` for bugs, regressions, or broken behavior
- `docs/` for documentation-only changes
- `refactor/` for structure changes that preserve behavior
- `test/` for test-only changes
- `chore/` for maintenance that does not fit the others

Do not use `codex/` as the default branch namespace. Use it only when the repo explicitly requires it or the user asks for it.

Keep the slug short, lowercase, hyphenated, and outcome-oriented:

- Prefer `feat/workout-rest-controls`
- Prefer `fix/cloud-sync-retry-loop`
- Prefer `docs/pr-filing-guidance`
- Avoid `codex/implement-workout-rest-controls`
- Avoid vague agent-centered names such as `feat/codex-updates`

Choose the type from the dominant reviewer-visible purpose of the PR. If a feature also touches tests or docs, keep `feat/` rather than splitting the branch name into multiple concerns.

## Invocation modifiers

Treat short words after `$yeet` as publication modifiers when their meaning is obvious.

- `$yeet review`: publish the draft PR, then add the exact PR comment `@codex please review`.
- `$yeet`: publish the draft PR without requesting Codex review unless the user otherwise asks.

Only post the review comment after the PR exists and you have its number or URL. Use:

```bash
gh pr comment <number-or-url> --body "@codex please review"
```

If the PR already exists for the branch, reuse that PR and still post the review comment when the user invoked `$yeet review`.

## Workflow

Follow this order:

1. Inspect git state, branch, recent commits, remotes, and GitHub auth.
2. Infer the intended publication scope from the request, diff, and files touched in this session.
3. Do a quick split-scope check: decide whether the changes are one reviewer-visible story or should become multiple PRs because they are about different things.
4. If the worktree is dirty or detached but the intended slice is obvious, isolate that slice instead of stopping.
5. Rename an unpublished `codex/...` branch to the preferred `{type}/{description}` shape when the scope is obvious.
6. Stage only the intended files.
7. Commit tersely with the description.
8. Optionally rebase onto the current base branch when the repo policy or user request calls for it and doing so is clearly safe.
9. Run checks if there is an obvious relevant command and they were not already run.
10. Push with tracking.
11. Open a draft PR with a detailed prose body that reflects the real issue, fix, and validation.
12. If invoked as `$yeet review`, add `@codex please review` as a PR comment.
13. Report the PR URL, branch, commit, review-comment state, and any follow-up state.

## Preflight

Start with the smallest useful checks:

```bash
git status --short
git status -sb
git branch --show-current
git log --oneline -10
git diff --stat
git diff --staged --stat
git remote -v
gh --version
gh auth status
```

Inspect full diffs only when needed:

```bash
git diff
git diff --staged
git diff -- path/to/file
git diff --staged -- path/to/file
```

## Dirty or detached repo guard rails

Treat dirty worktrees and detached `HEAD` as scoping problems to solve, not automatic blockers.

- If the user asked to yeet the work and the intended slice is clear, assume they want you to isolate and publish that slice.
- Do not stage everything with `git add -A` unless the full worktree clearly belongs to the requested publication.
- Prefer explicit path staging over broad staging.
- Leave unrelated edits untouched and uncommitted.
- If the current branch is the default branch, detached, or clearly unsuitable for a PR, create a scoped branch and continue when the intended slice is obvious.
- If the current worktree is too polluted to safely separate the intended diff in place, create a clean branch or worktree from the appropriate starting point and reapply only the intended changes there.
- If only part of a file should be included and there is no safe non-interactive split available, stop and ask one concise question.
- If multiple plausible publication scopes exist, stop and ask one concise question.

## Split-scope check

Before staging, do a quick judgment pass on whether the PR should be split. Do not use file count, line count, or diff size as the deciding factor. Look for whether the changes tell one coherent story.

Keep one PR when:

- the changes support the same user-visible outcome, bug fix, docs update, refactor, or maintenance task
- tests, fixtures, docs, generated files, or config changes are clearly supporting the main change
- multiple files changed because one behavior crosses normal module boundaries

Split or ask before publishing when:

- the diff contains unrelated product surfaces, bugs, features, docs, or cleanup work
- one part could be reviewed, reverted, or shipped independently without affecting the other
- the PR body would need two separate "simple versions" to explain what changed
- the branch name would need vague glue words such as `misc`, `updates`, `cleanup-and-feature`, or `various`

When the split is obvious, publish only the intended slice and leave the other work untouched. When the split is plausible but not obvious, ask one concise question before staging.

## Branch and staging strategy

Use the lightest safe path:

1. Keep the current branch when it is already a focused feature branch.
2. If on the default branch and the scope is obvious, create a branch:

```bash
git switch -c "type/description"
```

3. If detached or otherwise unsuitable but the scope is obvious, create a scoped branch before staging.
4. If the current branch starts with `codex/`, the repo does not require that namespace, and the branch has not been pushed, rename it before publishing:

```bash
git branch -m "type/description"
```

Treat a branch as already pushed if it has an upstream or if `git ls-remote --heads origin "$(git branch --show-current)"` finds it. Do not rename pushed or shared branches unless the user asks.

5. Stage only the intended paths:

```bash
git add -- path/to/file another/path
```

6. Recheck the staged diff before committing:

```bash
git diff --staged --stat
git diff --staged
```

Use `git restore --staged -- <path>` only to remove clearly unintended staged files from the PR scope.

## Commit rules

- Keep the commit focused on one logical change.
- Use one terse subject that matches the intended publication slice.
- If the staged set is already correct, keep it instead of restaging.
- If there is nothing to commit, say so plainly and stop.

Use this shape:

```bash
git commit -m "description"
```

## Optional rebase to base branch

Support an optional "update to current main before PR creation" step.

- Do not treat rebasing onto the base branch as mandatory for every PR.
- First fetch the remote base branch before deciding:

```bash
git fetch origin main
```

- Compare the current branch against `origin/main` or the repo's actual default base branch if it is not `main`.
- If the branch is not behind the base branch, continue normally.
- If the branch is behind and the user explicitly asked for rebasing, or repo instructions require being current before PR creation, update the branch before opening the PR.
- If the branch is behind but has not been pushed yet or is clearly local-only, rebasing onto the base branch is the preferred update method.
- If the branch is already pushed or likely shared, do not silently rewrite history unless the user or repo instructions clearly call for that behavior.
- If the safe choice is unclear, ask one concise question instead of guessing.

Use this shape when rebasing is clearly appropriate:

```bash
git rebase origin/main
```

If the repo uses a different default branch, substitute that branch name consistently in the fetch, compare, and rebase commands.

## Check and push mechanics

Preserve the original yeet flow, but keep it explicit and safe:

- Run checks if not already. Reuse validation already done in this session when still relevant.
- If there is an obvious repo-local validation command, run it before pushing.
- If checks fail because dependencies or tools are missing and the fix is straightforward, install or set up what is needed and retry once.
- Push with tracking explicitly:

```bash
git push -u origin "$(git branch --show-current)"
```

- If push fails, inspect the actual failure before mutating branch state.
- If push fails because the current branch has no upstream, use the command above.
- Do not pull or merge automatically just to force publication.
- Rebase onto the base branch only when the user asked for it, repo instructions require it, or the skill invocation context clearly says to do it when safe.

## PR writing philosophy

Keep the published-changes writing style plain and reader-friendly.

- Open the PR as a draft.
- Write the PR description for a smart non-technical reader who needs to understand the change without wading through engineering language.
- Start with the simple version first: what changed and why it matters.
- Use short sentences, plain words, and concrete file or behavior references when they help.
- Explain technical terms in one short everyday sentence only when the term matters.
- Write detailed prose, not a terse bullet summary or a commit-by-commit changelog.
- Cover:
  - the issue
  - the practical effect on users, reviewers, or maintainers
  - the root cause, when there is one
  - the fix
  - the tests or checks used to validate
- Include known limits, skipped validation, or follow-up when relevant.
- Edit the title and body so they reflect the actual diff, not generic commit text.
- Write the PR description to a temp file with real newlines and pass it with `--body-file`.

## PR creation

Use explicit non-interactive commands:

```bash
gh pr create --draft --title "description" --body-file /tmp/pr-body.md --head "$(git branch --show-current)"
```

Avoid relying on `gh pr create --fill` unless the user explicitly wants commit-derived text.

If there is already an open PR for the branch, return that PR and use `gh pr edit` only when needed.

## Optional Codex review request

When the user invokes `$yeet review`, ask Codex to review the PR after creation:

```bash
gh pr comment <number-or-url> --body "@codex please review"
```

Do not put the review request in the PR body. It should be a separate comment so GitHub review automation can notice it.

If posting the comment fails, keep the PR published and report the comment failure clearly.

## Safety rules

- Never push unrelated work.
- Never silently create a broad PR from a mixed worktree.
- Never use destructive cleanup commands.
- Never amend unless the user asks.
- Never merge automatically just to force publication.
- Never give up just because the repo is dirty or detached if the intended scope is still clear.
- Never dump raw terminal transcripts or giant changelogs into the PR body.

When rebasing:

- Never silently rebase a branch that looks shared unless the repo policy clearly allows it.
- Never force-push rewritten history without being explicit about it.
- If a rebase creates conflicts that are not straightforward, stop and surface the conflict instead of plowing ahead.

## Failure handling

- If `gh auth status` is not healthy, stop and report the auth problem.
- If the scope is unclear, stop and ask one concise question.
- If the commit fails because nothing is staged, re-check the intended scope instead of forcing it.
- If `gh pr create` fails, reuse the drafted title and body rather than rewriting them from scratch.
- If validation was skipped, say so plainly in the final report.

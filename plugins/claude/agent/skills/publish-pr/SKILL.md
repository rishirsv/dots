---
name: yeet
description: "Use when the user asks to yeet, publish this, open a PR, push this branch, create a draft PR, send this for review, yeet merge, or turn already scoped local work into a reviewer-friendly GitHub pull request with a pushed branch; not for local-only commits, broad implementation work, existing PR review-thread handling, or standalone CI repair."
---

# Publish PR

Turn an already scoped local change into a pushed branch and reviewer-friendly PR without sweeping unrelated work into it. Default to a draft PR unless the invocation explicitly asks to merge.

## References

- Read [github-cli-preflight.md](references/github-cli-preflight.md) before publishing. Use it to verify GitHub auth, remotes, branch tracking, base branch, and existing PR state.
- Read [branch-naming.md](references/branch-naming.md) before creating or renaming a branch.
- Read [pr-body-template.md](references/pr-body-template.md) before drafting the PR title or body.
- Read [babysit-pr.md](references/babysit-pr.md) only when the user invokes `yeet review`, asks for Codex review, or explicitly asks you to babysit the newly published PR. Phrases like "send this for review" mean publish a reviewer-ready PR; they do not by themselves request a Codex review comment.

## Core Workflow

1. Inspect the current branch, worktree, staged diff, recent commits, remotes, base branch, and GitHub auth.
2. Infer the intended publication scope from the request, current diff, staged files, current branch, commits made in this session, and validation evidence.
3. Run the split-scope check before staging or pushing. Publish one reviewer-visible story; leave unrelated work untouched.
4. Create or keep a branch using the repo policy and [branch-naming.md](references/branch-naming.md). Rename only unpublished local branches when the better name is obvious.
5. Resolve the base branch before PR creation. For `yeet merge`, use `main` unless the user names a different base; otherwise prefer the user-specified base, then repo instructions, then an existing PR base, then `gh repo view --json defaultBranchRef`.
6. Stage only intended paths. Prefer explicit path staging over broad staging.
7. Commit only when there are intended uncommitted changes. If the intended work is already committed, do not amend or create a cosmetic commit.
8. Run relevant local validation when an obvious command exists and no fresh evidence is already available.
9. Push with upstream tracking.
10. Create a new PR or reuse an existing PR with an explicit title, body file, base branch, and head branch. Use a draft PR by default; for `yeet merge`, create or convert the PR to ready for review.
11. Verify publication with the validation harness.
12. If the invocation is `yeet review`, `publish-pr review`, or the user explicitly asks for Codex review/babysitting, post the Codex review request and follow [babysit-pr.md](references/babysit-pr.md).
13. If the invocation is `yeet merge` or the user explicitly asks to publish and merge, follow the Merge Modifier.
14. Report branch, commit range, PR URL, validation evidence, review-request state, merge state, and any remaining blockers.

## Scope Discipline

Treat dirty worktrees and detached heads as scoping problems to solve, not automatic blockers.

Keep one PR when the changed files support the same user-visible outcome, bug fix, docs update, refactor, or maintenance task. Supporting tests, fixtures, generated files, docs, and config changes can belong in the same PR when they explain or verify the main change.

Split, publish only the intended slice, or ask one concise question when the diff contains unrelated product surfaces, unrelated bug fixes, mixed cleanup and feature work, or a branch name would need vague glue such as `misc`, `updates`, or `cleanup-and-feature`.

If only part of a file should be included and there is no safe non-interactive split available, stop and ask one concise question.

## Publication Commands

Use explicit, non-interactive commands. Adjust the base branch when repo instructions or the user specify a different target.

```bash
git status --short
git status -sb
git branch --show-current
git remote -v
gh auth status
gh repo view --json defaultBranchRef
git diff --stat
git diff --staged --stat
```

Push with tracking:

```bash
git push -u origin "$(git branch --show-current)"
```

Create a new draft PR:

```bash
gh pr create --draft --base "$base_branch" --head "$(git branch --show-current)" --title "$title" --body-file "$body_file"
```

Create a ready PR for `yeet merge`:

```bash
gh pr create --base "$base_branch" --head "$(git branch --show-current)" --title "$title" --body-file "$body_file"
```

If an open PR already exists for the current branch, reuse it:

```bash
gh pr view --json number,url,state,isDraft,headRefName,baseRefName
```

Use `gh pr edit` only when the existing PR title, body, or base branch needs to match the publication request. If an existing PR is already marked ready, do not silently convert its review state; report that it already exists and preserve its state unless the user asks. For `yeet merge`, convert a draft PR to ready before merging:

```bash
gh pr ready "$pr_url_or_number"
```

## Validation Harness

Before final reporting, verify:

- `gh auth status` succeeds.
- The current branch has an upstream: `git rev-parse --abbrev-ref --symbolic-full-name @{u}`.
- The PR exists and points at the expected head and base: `gh pr view --json number,url,state,isDraft,headRefName,baseRefName`.
- The PR diff matches the intended scope. Compare local merge-base diff and PR files when useful:

```bash
git fetch origin "$base_branch"
git diff --name-status "$(git merge-base HEAD "origin/$base_branch")"..HEAD
gh pr diff --name-only
```

- Checks have started or the no-checks state is explained. Prefer:

```bash
gh pr checks --json name,state,bucket,startedAt,completedAt,link
```

Treat `gh pr checks` exit code 8 as pending, not failure. After a freshly opened PR, retry briefly if GitHub reports no checks yet; checks can lag PR creation. If the repo genuinely has no checks, say so.

## Review Request Modifier

For `yeet review` or an explicit Codex-review request, post the current documented Codex review trigger as a separate PR comment:

```bash
gh pr comment "$pr_url_or_number" --body "@codex review"
```

Use exactly `@codex review` unless the user adds focus text after that prefix. Do not put the review request in the PR body. If posting the comment fails, keep the PR published and report the comment failure clearly.

## Merge Modifier

For `yeet merge`, treat the user's invocation as explicit authorization to merge the just-published or reused PR into `main`. Do not combine this with `yeet review` unless the user explicitly asks for both.

Requirements:

- Base branch is `main` unless the user names a different base.
- PR is ready for review, not draft.
- Local validation from this publication run passed, or any skipped validation is low-risk and clearly reported.
- The PR diff still matches the intended scope.

Prefer the repo's normal merge method if documented. Otherwise inspect the repository's allowed merge methods:

```bash
gh repo view --json mergeCommitAllowed,squashMergeAllowed,rebaseMergeAllowed
```

Use `--merge` when merge commits are allowed, otherwise use `--squash` when squash merge is allowed, otherwise use `--rebase` when rebase merge is allowed. Use the same selected merge flag for immediate merge and auto-merge. Delete the branch after merge only when GitHub accepts the merge and the branch is not protected by repo policy.

Try an immediate merge first:

```bash
gh pr merge "$pr_url_or_number" "$merge_flag" --delete-branch
```

If GitHub blocks immediate merge because required checks, reviews, or branch protection are pending, enable auto-merge instead:

```bash
gh pr merge "$pr_url_or_number" --auto "$merge_flag" --delete-branch
```

After either command, verify and report the state:

```bash
gh pr view "$pr_url_or_number" --json number,url,state,isDraft,mergeStateStatus,autoMergeRequest,baseRefName,headRefName
```

If GitHub rejects both immediate merge and auto-merge, leave the PR published and report the exact blocker. Do not bypass protection with admin merge unless the user explicitly asks.

## Safety Rules

- Do not push unrelated work.
- Do not silently create a broad PR from a mixed worktree.
- Do not use destructive cleanup commands.
- Do not amend, rebase a shared branch, or force-push unless the user or repo policy clearly asks for it.
- Do not merge automatically unless the user explicitly invokes `yeet merge` or otherwise asks to publish and merge.
- Do not request non-Codex human reviewers unless the user asks.
- Do not dump raw terminal transcripts or commit logs into the PR body.

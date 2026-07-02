---
name: land-pr
description: "Merge, auto-merge, or clean up an already-ready GitHub pull request through safe git and gh gates. Use for land this PR, merge this PR, land when ready, or cleanup after merge; not for publishing, fixing comments, repairing CI, or review babysitting."
---

# Land PR

Land an already-ready pull request. This skill is the safe merge button: it
checks readiness, uses GitHub's merge controls, and cleans local branch state
only after the remote state is clear. It does not repair code or shepherd a
review loop.

`$ship` hands off to this skill for "ship merge", "publish and merge", or
"send and land" chains — landing is the second half of that chain, after the
PR is published.

## Resolve The Target

Use an explicit URL or number when provided; otherwise resolve the PR for the
current branch:

```bash
git status --short
pr_ref="<url-or-number>"  # omit this argument when using the current branch
gh pr view "$pr_ref" --json number,url,title,state,isDraft,headRefName,baseRefName,headRefOid,mergeStateStatus,mergeable,reviewDecision,statusCheckRollup,autoMergeRequest
gh pr checks "$pr_ref" --required --json name,state,bucket,startedAt,completedAt,link
```

When using the current branch, omit `"$pr_ref"` from `gh pr view` and `gh pr
checks`.

Stop if no PR resolves, more than one target is plausible, or the explicit PR
does not match the branch the user appears to be asking about.

If the current branch is involved, require a clean worktree before switching,
pulling, deleting, or otherwise touching local branch state. Do not hide dirty
work to complete a merge.

## Landing Gates

For an immediate merge, stop before merging when any gate is not clean:

- PR is closed, missing, or draft.
- Required checks are failing, cancelled, pending, or unavailable.
- Required review is missing, review was rejected, or requested changes remain.
- Required conversations may be unresolved or conversation policy cannot be
  verified.
- Merge state is blocked, dirty, behind, or unknown.
- The PR appears stacked and landing order is unclear.
- Local branch/head does not match the PR head and `--match-head-commit` would
  not protect the intended commit.

For `land-pr when-ready`, pending required checks or reviews can be handled by
auto-merge only after every non-pending gate is clean. Failures, requested
changes, unresolved conversations, conflicts, draft state, stacked-order
ambiguity, and unknown policy still block auto-merge.

Use `$triage` when the user only wants the blocker report.
Use `$repair-pr` when comments or same-PR CI need code changes.

Treat a PR as stacked when its base is not the default branch, its base branch
matches another open PR head, dependency links mention another PR, or commit
ancestry shows it depends on unmerged work. Stop unless the landing order is
clear.

When conversation resolution can block merging, use the `$triage` GraphQL
thread check first. If `$triage` is unavailable, run the query in
[../triage/references/review-threads-query.md](../triage/references/review-threads-query.md)
directly or stop. If thread state or policy cannot be verified, stop instead of
assuming the PR is clean.

## Merge Method

Prefer the repo's documented merge method. Check repo instructions,
`CONTRIBUTING.md`, recent merged PRs, or release notes when they are nearby. If
none is documented, inspect the repository settings:

```bash
gh repo view --json mergeCommitAllowed,squashMergeAllowed,rebaseMergeAllowed
```

Use the allowed method that matches repo convention. When convention is unknown,
prefer `--squash` if available, then `--merge`, then `--rebase`.

Merge with head matching:

```bash
gh pr merge "$pr_url_or_number" "$merge_flag" --delete-branch --match-head-commit "$head_sha"
```

For `land-pr when-ready`, enable auto-merge only when remaining blockers are
ordinary pending requirements, not failures, requested changes, unresolved
threads, merge conflicts, or policy ambiguity:

```bash
gh pr merge "$pr_url_or_number" --auto "$merge_flag" --delete-branch --match-head-commit "$head_sha"
```

Do not use `--admin` unless the user explicitly asks to bypass protections and
gives a reason.

## Verify And Cleanup

Verify the remote state after merge or auto-merge:

```bash
gh pr view "$pr_url_or_number" --json number,url,state,mergeStateStatus,autoMergeRequest,baseRefName,headRefName
```

Clean local branch state only after the PR state is actually merged. If
auto-merge was merely accepted, report that state and wait for the merge before
deleting local branches. Keep cleanup conservative:

```bash
git fetch origin --prune
git switch "$base_branch"
git pull --ff-only
git branch -d "$topic_branch"
```

Use `git branch -D` only when the user explicitly approves discarding an
unmerged local branch.

## Final Report

Report the PR URL, merge method or auto-merge state, head SHA matched, cleanup
performed, and any blocker that prevented landing. If the PR was not ready, say
that no merge was attempted and name the next command: `$triage`,
`$repair-pr`, or a user decision.

## Guardrails

- Do not publish new PRs.
- Do not patch code or fix CI.
- Do not merge drafts by default.
- Do not bypass branch protection without explicit approval.
- Do not delete local branches before remote merge state is verified.
- Do not land stacked PRs out of order unless the dependency chain is clear.

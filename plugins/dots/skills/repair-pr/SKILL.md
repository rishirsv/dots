---
name: repair-pr
description: "Address actionable GitHub PR review comments or same-PR CI fallout with scoped fix commits through git and gh. Use for fix review comments, address PR feedback, repair this PR, or fix this PR's CI; not for publishing new PRs, broad refactors, stewardship loops, or merging."
---

# Repair PR

Fix the current pull request only where feedback or CI points to an actionable
same-story problem. Prefer small append-only repair commits. Leave product
judgment, unrelated failures, merge approval, and publication of new PRs to the
right workflow.

## Resolve And Inspect

Resolve the target from an explicit PR URL/number or the current branch:

```bash
git status -sb
pr_ref="<url-or-number>"  # omit this argument when using the current branch
gh pr view "$pr_ref" --json number,url,title,state,isDraft,headRefName,baseRefName,headRefOid,reviewDecision,mergeStateStatus
gh pr checks "$pr_ref" --json name,state,bucket,startedAt,completedAt,link
```

When using the current branch, omit `"$pr_ref"` from `gh pr view` and `gh pr
checks`.

Stop if the PR is missing, closed, merged, or ambiguous. A draft PR can still be
repaired, but it should not be made ready unless the user asks.

If the current branch is not the PR head, switch only when it is safe and the
user's intent is clear. Stop before overwriting, stashing, rebasing, or deleting
local work.

Read review comments and thread state before editing:

```bash
pr_number="$(gh pr view "$pr_ref" --json number --jq .number)"
# Current branch form instead:
# pr_number="$(gh pr view --json number --jq .number)"
name_with_owner="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
owner="${name_with_owner%%/*}"
repo="${name_with_owner#*/}"
gh api "repos/:owner/:repo/pulls/$pr_number/comments"
gh api graphql -f query='
query($owner:String!, $repo:String!, $number:Int!) {
  repository(owner:$owner, name:$repo) {
    pullRequest(number:$number) {
      reviewThreads(first:100) {
        nodes {
          id
          isResolved
          isOutdated
          path
          line
          comments(first:20) {
            nodes { id body author { login } path line diffHunk url }
          }
        }
      }
    }
  }
}' -F owner="$owner" -F repo="$repo" -F number="$pr_number"
```

For CI failures, inspect the failing job enough to identify whether the failure
belongs to this PR. Use `gh pr checks`, linked logs, and repo-owned test commands
instead of guessing from a job name.

When a failing check links to a GitHub Actions run, inspect the failed job before
editing:

```bash
run_id="<id-from-actions-runs-url-or-gh-run-list>"
gh run view "$run_id" --log-failed
```

If the check link does not expose a run id, derive it from the PR head branch:

```bash
head_branch="$(gh pr view "$pr_ref" --json headRefName --jq .headRefName)"
gh run list --branch "$head_branch" --limit 20
```

Omit `"$pr_ref"` when using the current branch.

## Choose Repairs

Cluster findings before editing:

- actionable and in scope
- question or explanation only
- already resolved or outdated
- conflicting comments
- product judgment or scope expansion
- unrelated, flaky, or infrastructure CI

Patch only the actionable in-scope set. Ask before changing product behavior,
accepting one side of conflicting feedback, broadening the PR, force-pushing, or
resolving a thread that does not clearly map to a fix made in this run.

If the user only asked to inspect, summarize, or plan repairs, stop after the
clustered findings and proposed repair plan. Do not comment, resolve threads,
commit, or push until the user has asked for repair work.

## Commit And Push

Run the smallest validation that proves the repair. Reuse fresh validation from
the same session only when it still covers the changed files.

```bash
git status --short
git diff --stat
git add -- <intended paths>
git diff --staged --check
git commit -m "<terse repair subject>"
git push
```

Do not amend or rebase a reviewed branch unless the user explicitly asks for a
history rewrite. Keep unrelated dirty files out of the commit.

## Replies And Thread Resolution

Post a concise repair summary when it helps reviewers:

```bash
gh pr comment "$pr_url_or_number" --body "$summary"
```

Resolve only review threads that map to a fix made in this run. Do not
mass-resolve threads from someone else's push or an earlier repair unless the
mapping evidence is explicit:

```bash
gh api graphql -f query='
mutation($thread:ID!) {
  resolveReviewThread(input:{threadId:$thread}) {
    thread { id isResolved }
  }
}' -F thread="$thread_id"
```

If a thread ID cannot be mapped confidently, leave it unresolved and name it in
the report.

## Final Report

Re-read PR status after pushing. Report the PR URL, repair commits, validation
run, comments or threads addressed, threads intentionally left open, and the
next command. Use `$land-pr` only as a recommendation; do not merge here.

## Guardrails

- Do not create a new PR.
- Do not merge.
- Do not force-push without explicit approval.
- Do not resolve unmapped or judgment-heavy review threads.
- Do not turn unrelated CI fallout into a broad refactor.
- Do not claim a comment is addressed unless the final diff or reply proves it.

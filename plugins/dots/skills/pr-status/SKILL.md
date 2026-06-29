---
name: pr-status
description: "Read GitHub pull request readiness and blockers through git and gh without changing files, branches, commits, PR metadata, comments, or merge state. Use for check PR status, what is blocking this PR, is it ready, or status before repair/land; not for publishing, fixing, resolving comments, or merging."
---

# PR Status

Read the target pull request and return a short readiness report. This skill is
read-only over user-authored state: it may query GitHub metadata and inspect
existing local refs, but it does not refresh branches, stage, commit, push,
comment, resolve threads, edit PRs, or merge.

## Resolve The PR

Use an explicit URL or number when the user gives one:

```bash
pr_ref="<url-or-number>"
gh pr view "$pr_ref" --json number,url,title,state,isDraft,headRefName,baseRefName,headRefOid
```

Otherwise resolve the PR for the current branch:

```bash
gh pr view --json number,url,title,state,isDraft,headRefName,baseRefName,headRefOid
```

If no PR resolves from the branch, or the explicit target is ambiguous, report
that clearly and stop. Do not create a PR; that belongs to `$send-it`.

For GraphQL or REST calls, derive stable identifiers once:

```bash
pr_number="$(gh pr view "$pr_ref" --json number --jq .number)"  # omit "$pr_ref" when using the current branch
name_with_owner="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
owner="${name_with_owner%%/*}"
repo="${name_with_owner#*/}"
```

## Readiness Checks

Gather only the metadata needed to explain the current blocker:

```bash
gh pr view "$pr_ref" --json number,url,title,state,isDraft,headRefName,baseRefName,headRefOid,mergeStateStatus,mergeable,reviewDecision,statusCheckRollup,reviewRequests,latestReviews
gh pr checks "$pr_ref" --json name,state,bucket,startedAt,completedAt,link
```

When using the current branch, omit `"$pr_ref"` from `gh pr view`, `gh pr
checks`, and `gh pr diff` commands.

For a ready-to-land decision, also read required-check detail:

```bash
gh pr checks "$pr_ref" --required --json name,state,bucket,startedAt,completedAt,link
```

Treat the `gh pr checks` pending exit code as a pending state, not as a command
failure. If checks have not appeared yet on a fresh PR, say that checks may not
have started.

When conversation resolution could block the merge, read review-thread state
with GraphQL:

```bash
gh api graphql -f query='
query($owner:String!, $repo:String!, $number:Int!) {
  repository(owner:$owner, name:$repo) {
    pullRequest(number:$number) {
      reviewThreads(first:100) {
        pageInfo { hasNextPage endCursor }
        nodes { id isResolved isOutdated path line }
      }
    }
  }
}' -F owner="$owner" -F repo="$repo" -F number="$pr_number"
```

If more than 100 review threads exist, paginate with `pageInfo.endCursor` or
mark conversation state `Unknown`. If repo policy for required conversation
resolution is not visible, do not call the PR ready because conversations look
quiet; report the policy signal as unknown.

Use diff comparison when the user asks whether the PR contains the intended
scope or when branch/base ambiguity affects readiness:

```bash
gh pr diff "$pr_ref" --name-only
base_branch="$(gh pr view "$pr_ref" --json baseRefName --jq .baseRefName)"
git diff --name-status "$(git merge-base HEAD "origin/$base_branch")"..HEAD
```

Use the local merge-base comparison only when the current branch matches the PR
head and `origin/$base_branch` already exists locally. Omit `"$pr_ref"` in the
`gh pr view` command when using the current branch. Do not run `git fetch` in
this read-only workflow; if refreshing remote-tracking refs would change the
answer, report that freshness gap or ask whether to refresh.

## Report Shape

Lead with one status:

- `Ready to land`: open, not draft, required checks green, no requested changes,
  no known unresolved required conversations, and merge state is clean enough
  for `$land-pr`.
- `Pending`: checks, review, deployments, or merge queue are still in progress.
- `Needs review`: review is required or requested reviewers have not responded.
- `Needs repair`: checks failed, requested changes exist, or actionable review
  comments remain.
- `Blocked`: policy, branch state, merge conflicts, stacked dependencies, auth,
  missing PR, or ambiguous target prevents a safe next action.
- `Unknown`: GitHub did not expose enough state; name the missing signal.

Then give the blockers, the evidence command or field that showed each blocker,
and the smallest recommended next command: `$repair-pr`, `$land-pr`, `$send-it`,
or a question for the user. Do not take that next action from this skill.

## Guardrails

- Do not mutate local files, branches, commits, PR metadata, comments, reviews,
  or thread state.
- Do not infer success from a green-looking summary when required checks,
  review decision, or conversation state was unavailable.
- Do not treat optional or stale comments as blockers unless repo policy or the
  current review state makes them blocking.
- Do not recommend admin bypass as a default next step.

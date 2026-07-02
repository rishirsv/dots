---
name: triage
description: "Triage one or more GitHub pull requests through git and gh without changing files, branches, commits, PR metadata, comments, or merge state. Use for triage PRs, check PR status, what is blocking this PR, which open PRs need attention, or status before repair/land; not for publishing, fixing, resolving comments, or merging."
---

# Triage

Read pull request readiness and blockers, then explain what needs attention in
plain language. This skill is read-only over user-authored state: it may query
GitHub metadata and inspect existing local refs, but it does not refresh
branches, stage, commit, push, comment, resolve threads, edit PRs, or merge.

Default to the current branch PR or the explicit PR the user names. When the
user asks to triage open PRs, find open PRs for the repository, sort them by
attention needed, and give a concise queue readback.

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
that clearly and stop. Do not create a PR; that belongs to `$ship`.

## Triage Open PRs

Use this path when the user asks to triage open PRs, review the PR queue, find
what needs attention, or summarize open PR status.

Read the open PR list first:

```bash
gh pr list --state open --limit 50 --json number,url,title,isDraft,headRefName,baseRefName,updatedAt,reviewDecision,statusCheckRollup,mergeStateStatus,author
```

If there are more than 50 open PRs or the user asks for a team-wide queue,
either page deliberately or report that the readback is limited to the first 50.
Do not edit labels, request reviews, comment, close, or merge.

Classify each PR into the first matching Status Label from the definitions in
[Status Labels](#status-labels) below, in this priority order: `Needs repair`,
`Needs review`, `Pending`, `Ready to land`, `Blocked`, `Unknown`.

For PRs that appear close to landing or blocked by conversations, drill into
the individual PR using the readiness checks below. Do not deep-inspect every
open PR by habit; optimize for the smallest extra reads that make the queue
useful.

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

When conversation resolution could block the merge, run the review-thread
check in
[references/review-threads-query.md](references/review-threads-query.md).

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

## Plain Readback

Write for a busy human, not for a machine. Avoid raw JSON, long command
transcripts, and GitHub enum dumps. Translate fields into ordinary language:
"checks are still running", "review is missing", "requested changes are
blocking", "mergeability is unknown", or "ready for `$land-pr`".

For a single PR, lead with one sentence:

```text
PR #123 is pending: tests are still running, and no reviewer has approved it yet.
```

Then give:

- `What I checked`: the few signals that matter, such as draft state, checks,
  review, conversations, merge state, and head/base.
- `Blockers`: only real blockers or important unknowns.
- `Next move`: the smallest useful command, such as `$repair-pr`, `$land-pr`,
  `$ship`, or a question for the user.

For open PR triage, lead with a compact queue summary:

```text
I found 6 open PRs: 1 ready to land, 2 needing review, 2 pending checks, and 1 needing repair.
```

Then list PRs grouped by action, with one plain sentence each. Put urgent or
actionable PRs first; ready-to-land PRs before passive waiting. Keep each entry
short:

```text
Ready to land
- #123 Add billing export: checks and review are clean. Next: $land-pr.

Needs repair
- #118 Fix webhook retry: unit tests are failing. Next: $repair-pr.
```

## Status Labels

Lead with one status:

- `Ready to land`: open, not draft, required checks green, no requested changes,
  no known unresolved required conversations, and merge state is clean enough
  for `$land-pr`.
- `Pending`: checks, review, deployments, or merge queue are still in progress.
- `Needs review`: review is required or requested reviewers have not responded.
- `Needs repair`: checks failed, requested changes exist, or actionable review
  comments remain.
- `Blocked`: policy, branch state, merge conflicts, stacked dependencies, auth,
  missing PR, or ambiguous target prevents a safe next action. See
  [land-pr](../land-pr/SKILL.md) for the stacked-PR heuristic.
- `Unknown`: GitHub did not expose enough state; name the missing signal.

Then give the blockers, the evidence command or field that showed each blocker,
and the smallest recommended next command: `$repair-pr`, `$land-pr`, `$ship`,
or a question for the user. Do not take that next action from this skill.

## Guardrails

- Do not mutate local files, branches, commits, PR metadata, comments, reviews,
  or thread state.
- Do not infer success from a green-looking summary when required checks,
  review decision, or conversation state was unavailable.
- Do not treat optional or stale comments as blockers unless repo policy or the
  current review state makes them blocking.
- Do not recommend admin bypass as a default next step.

---
name: pr
description: "Triage, repair, land, or steward a GitHub pull request through git and gh. Use for what's blocking this PR, fix the review comments, land this PR, or steward this PR to merge; not for publishing new PRs (use $ship) or local-only commits (use $commit)."
---

# PR

One skill, four modes over one pull request: `status` (read-only triage),
`repair` (scoped fix commits), `land` (merge and cleanup), and `steward` (a
bounded loop over the other three). Resolve the target once, classify the
request into a mode, then follow only that mode's section.

## Resolve The Target

Use an explicit URL or number when the user gives one; otherwise resolve the
PR for the current branch:

```bash
pr_ref="<url-or-number>"  # omit $pr_ref entirely when using the current branch
gh pr view "$pr_ref" --json number,url,title,state,isDraft,headRefName,baseRefName,headRefOid,mergeStateStatus,mergeable,reviewDecision,statusCheckRollup
```

Omit `"$pr_ref"` from every `gh pr view`/`gh pr checks`/`gh pr diff` call when
using the current branch. Stop and report if no PR resolves, more than one
target is plausible, or an explicit PR does not match the branch the user
seems to mean. Do not create a PR here; that belongs to `$ship`.

Derive stable identifiers once when a mode needs GraphQL or REST calls:

```bash
pr_number="$(gh pr view "$pr_ref" --json number --jq .number)"  # omit "$pr_ref" for current branch
name_with_owner="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
owner="${name_with_owner%%/*}"; repo="${name_with_owner#*/}"
```

## Classify The Request

- "what's blocking", "triage", "is this ready", "check the queue" → **status**
- "fix the comments", "address feedback", "fix CI/failing checks" → **repair**
- "land", "merge", "clean up after merge" → **land**
- "steward", "watch and land", "take this through review to merge" → **steward**

If the request mixes modes ("fix it and merge"), run them in sequence
(repair, then land) and report each stage separately — do not blur their
guardrails together.

## Mode: Status

Read-only. May query GitHub metadata and inspect existing local refs; never
refreshes branches, stages, commits, pushes, comments, resolves threads, edits
the PR, or merges.

For a single PR, read what's needed to explain the blocker — draft state,
checks (`gh pr checks "$pr_ref" --json name,state,bucket,startedAt,completedAt,link`,
add `--required` when a land decision is in play), review decision, and merge
state. Pull review-thread state via
[../../references/review-threads-query.md](../../references/review-threads-query.md)
whenever conversation resolution could block the merge. Use
`gh pr diff "$pr_ref" --name-only` plus a local `git diff --name-status`
against `git merge-base` only when scope or base ambiguity matters, and only
when the current branch is the PR head and `origin/$base_branch` already
exists locally — never `git fetch` in this mode.

For an open-PR queue, list with
`gh pr list --state open --limit 50 --json number,url,title,isDraft,headRefName,baseRefName,updatedAt,reviewDecision,statusCheckRollup,mergeStateStatus,author`,
cap or say so past 50, and drill into individual PRs only for the ones near
landing or blocked — don't deep-inspect every PR by habit.

Classify each PR into the first matching label, in this priority order:

1. `Ready to land` — open, not draft, required checks green, no requested
   changes, no known unresolved required conversations, merge state clean.
2. `Needs repair` — checks failed, requested changes exist, or actionable
   review comments remain.
3. `Needs review` — review required or requested reviewers haven't responded.
4. `Pending` — checks, review, deployments, or merge queue in progress.
5. `Blocked` — policy, conflicts, stacked dependencies, auth, missing PR, or
   ambiguous target. See [Stacked-PR Heuristic](#stacked-pr-heuristic).
6. `Unknown` — GitHub didn't expose enough state; name the missing signal.

Write for a busy human: no raw JSON, no command transcripts, no GitHub enum
dumps. Lead with one plain sentence ("PR #123 is pending: tests are still
running, and no reviewer has approved it yet."), then `What I checked`,
`Blockers` (only real ones), and `Next move` (`$pr repair`, `$pr land`,
`$ship`, or a question). For a queue, lead with a compact count summary, then
group by action with one sentence per PR, urgent/ready-to-land first. Never
recommend admin bypass as a default next step, and never infer readiness from
a green-looking summary when a required signal was actually unavailable.

## Mode: Repair

Never publishes a new PR and never merges. Patches only actionable,
same-story problems; leaves product judgment and unrelated failures alone.

Resolve the target, then read comments and thread state before editing:
`gh api "repos/:owner/:repo/pulls/$pr_number/comments"` plus the query in
[../../references/review-threads-query.md](../../references/review-threads-query.md)
(include the `comments` field this time, to map each thread to file/line).
For CI, use `gh pr checks`, then `gh run view "$run_id" --log-failed` (find
`run_id` from the check's `detailsUrl`, or `gh run list --branch "$head_branch"
--limit 20` when it's missing) to confirm the failure belongs to this PR
before touching anything.

Cluster findings before editing: actionable-in-scope, question/explanation
only, already resolved or outdated, conflicting comments, product judgment or
scope expansion, and unrelated/flaky/infra CI. Patch only the first cluster.
Ask before changing product behavior, picking a side of conflicting feedback,
broadening the PR, force-pushing, or resolving a thread that doesn't clearly
map to a fix made in this run. If the user only asked to inspect or plan, stop
after the clustered findings — do not comment, resolve, commit, or push.

Commit small and append-only: `git status --short`, `git diff --stat`, stage
only intended paths, `git diff --staged --check`, terse commit subject,
`git push`. Do not amend or rebase a reviewed branch without an explicit
history-rewrite request.

Reply and resolve only what this run actually fixed:
`gh pr comment "$pr_url_or_number" --body "$summary"` for a repair summary,
and the `resolveReviewThread` GraphQL mutation only for threads mapped to a
fix made in this run. Leave unmapped threads open and name them in the
report. Never claim a comment is addressed unless the final diff or reply
proves it.

Re-read PR status after pushing. Report the PR URL, repair commits,
validation run, comments/threads addressed, threads intentionally left open,
and the next command (`$pr land` as a recommendation only — this mode never
merges).

## Mode: Land

The safe merge button. Checks readiness, uses GitHub's merge controls, cleans
local branch state only after the remote is confirmed merged. Does not repair
code or shepherd review. `$ship`'s merge chain ("ship merge", "send and land")
hands off to this mode for the second half, after the PR is published.

Require a clean worktree before switching, pulling, or touching local branch
state — never hide dirty work to force a merge. Stop before merging if any
gate is unclean:

- PR closed, missing, or draft.
- Required checks failing, cancelled, pending, or unavailable.
- Required review missing, rejected, or requested changes remain.
- Required conversations may be unresolved, or policy can't be verified — run
  status mode's review-thread check first.
- Merge state blocked, dirty, behind, or unknown.
- PR appears stacked and landing order is unclear (see below).
- Local head doesn't match the PR head and `--match-head-commit` wouldn't
  protect the intended commit.

For "land when ready", pending (not failing) required checks or reviews may
be handled by auto-merge once every non-pending gate above is clean; failures,
requested changes, unresolved conversations, conflicts, draft state, stacked
ambiguity, and unknown policy still block it.

#### Stacked-PR Heuristic

Treat a PR as stacked when its base isn't the default branch, its base
matches another open PR's head, dependency links mention another PR, or
commit ancestry shows dependence on unmerged work. Stop unless the landing
order is unambiguous.

Prefer the repo's documented merge method (repo instructions, `CONTRIBUTING.md`,
recent merged PRs); otherwise check
`gh repo view --json mergeCommitAllowed,squashMergeAllowed,rebaseMergeAllowed`
and prefer `--squash`, then `--merge`, then `--rebase`. Merge with head
matching: `gh pr merge "$pr_url_or_number" "$merge_flag" --delete-branch
--match-head-commit "$head_sha"` (swap in `--auto` for when-ready). Never use
`--admin` unless the user explicitly asks to bypass protection with a reason.

Verify remote state after merge/auto-merge before any cleanup. If auto-merge
was only accepted, report that and wait — don't delete branches yet. Cleanup:
`git fetch origin --prune`, switch to base, `git pull --ff-only`, `git branch
-d "$topic_branch"`. Use `-D` only with explicit user approval to discard
unmerged work.

Report the PR URL, merge method or auto-merge state, head SHA matched,
cleanup performed, or the blocker that stopped landing and the next command
(`$pr status`, `$pr repair`, or a user decision).

## Mode: Steward

The only mode that can keep working across a review/check heartbeat without
another prompt, and only inside an explicit envelope stated up front:

- target PR URL or number
- allowed repair scope: small same-story comments/CI, excluding
  product/API decisions
- heartbeat budget (default 3-5 polls, 60-120s apart, or user-specified)
- whether merge is authorized after gates pass
- authorized write actions: review comment, repair commit, push, mapped
  thread resolution, re-review request, and merge (if authorized)
- stop conditions requiring the user

If merge wasn't authorized, steward to "ready to land" and stop there. If no
heartbeat budget was given, use the default and report state instead of
polling indefinitely.

Loop by composing the other three modes rather than reinventing their detail:
status for read-only readiness, repair for actionable same-PR issues, land
for merge once gates are clean. Request Codex review
(`gh pr comment ... --body "@codex review"`) only when the user asked for
review stewardship and no current request is already visible in recent
comments/reviews/timeline for this head. Poll with
`gh pr view ... --json number,url,state,isDraft,reviewDecision,comments,reviews,headRefName,baseRefName,headRefOid,mergeStateStatus`
and `gh pr checks`. After a repair pass changes the diff, re-check status
before deciding whether to land or re-request review.

Stop and ask when the next move needs judgment beyond the envelope: product
behavior or API choice, conflicting comments, scope-expanding repair,
unrelated/flaky/infra CI, force-push/rebase/admin-bypass/branch-deletion
beyond normal cleanup, base-branch change, stacked-order ambiguity (see
[Stacked-PR Heuristic](#stacked-pr-heuristic)), or an exhausted heartbeat
budget without a decisive state. The mandate covers only this PR and
same-story work — never other branches, other PRs, or policy bypasses.

Report the final state, actions taken, commits pushed, comments/threads
handled, checks/reviews observed, merge/auto-merge result, and any remaining
decision — focused on the PR's state, not a poll-by-poll transcript.

## Guardrails

- Status is strictly read-only: no file, branch, commit, PR metadata,
  comment, review, or thread mutation.
- Repair never publishes a new PR and never merges; it only patches actionable
  same-story issues and resolves threads it can prove it fixed.
- Land never patches code, never merges drafts by default, never bypasses
  protection without explicit approval, and never deletes local branches
  before remote merge is verified.
- Land and steward both stop on stacked-PR ambiguity rather than guessing
  landing order.
- Steward operates only within its stated envelope and heartbeat budget, and
  stops on the escalation list above rather than expanding scope to "keep
  going until merged."
- Merges, force-pushes, rebases of reviewed branches, and admin-bypass all
  require explicit user authorization — never a default path.

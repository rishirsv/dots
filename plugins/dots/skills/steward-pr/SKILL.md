---
name: steward-pr
description: "Run a bounded Chief-of-Staff loop for one GitHub PR: request review, watch, repair scoped feedback, recheck, and land when authorized. Use for steward this PR, take this PR through review to merge, watch and land this PR, or hands-off PR follow-through; not for one-shot status, publish, repair, or merge commands."
---

# Steward PR

Shepherd one named pull request through review, scoped repair, re-checking, and
landing. This is the only Dots git workflow that can keep working across a
review/check heartbeat without another user prompt, and only inside the
explicit operating envelope.

## Operating Envelope

Resolve the target from an explicit PR URL/number when provided; otherwise infer
from the current branch with `gh pr view`. If no single PR resolves, ask for the
PR URL or number before acting.

Start by stating the envelope in chat:

- target PR URL or number
- allowed repair scope: small same-story review comments and CI failures caused
  by this PR, excluding product/API decisions
- heartbeat budget, such as 3 to 5 polls every 60 to 120 seconds, or the
  user-specified limit
- whether merge is authorized after gates pass
- which write actions are authorized: review comment, repair commit, push,
  mapped thread resolution, re-review request, and merge
- stop conditions that require the user

If the user did not authorize merge, steward the PR up to "ready to land" and
stop. If the user did not name a heartbeat budget, use 3 to 5 polls spaced 60
to 120 seconds apart and report the current state instead of waiting
indefinitely.

## Loop

Use the sibling workflows rather than reinventing their details:

- `$triage` for read-only readiness and blockers
- `$repair-pr` for actionable same-PR comments or CI fallout
- `$land-pr` for merge or auto-merge after landing gates are clean

If a sibling skill is unavailable in the current runtime, use only the summarized
boundary above, then stop before any action whose detailed guardrails are not in
this file. Do not expand stewardship into broad GitHub maintenance.

Request Codex review when the user asked for review stewardship and no current
request is visible. Treat a current request as visible only when a recent PR
comment, review, or timeline item already contains `@codex review` for this
head:

```bash
gh pr comment "$pr_url_or_number" --body "@codex review"
```

Heartbeat with concise polls:

```bash
gh pr view "$pr_url_or_number" --json number,url,state,isDraft,reviewDecision,comments,reviews,headRefName,baseRefName,headRefOid,mergeStateStatus
gh pr checks "$pr_url_or_number" --json name,state,bucket,startedAt,completedAt,link
```

When actionable comments or same-PR failures appear, run the `$repair-pr`
workflow, push scoped repair commits, and then re-check status. Re-request review
or post a repair summary only when the diff changed and the repo's process
benefits from a visible handoff.

When the PR is ready and merge authorization was included, run `$land-pr`. If
merge was not authorized, stop with a ready-to-land report.

## Stop And Ask

Stop before acting when the next move needs judgment beyond the envelope:

- product behavior or public API choice
- conflicting review comments
- repair that expands the PR story
- unrelated, flaky, or infrastructure CI
- force-push, rebase, admin bypass, or branch deletion beyond normal cleanup
- changing the PR base branch
- stacked dependency order is unclear
- heartbeat budget is exhausted without a decisive state

The mandate covers only this PR, same-story fixes, comments, commits, pushes,
mapped thread resolution, re-review requests, and landing when explicitly
authorized. It does not cover other branches, other PRs, or policy bypasses.

## Final Report

Report the final state, actions taken, commits pushed, comments or threads
handled, checks/reviews observed, merge or auto-merge result, and any remaining
decision for the user. Keep the report focused on the PR's state rather than a
poll-by-poll transcript.

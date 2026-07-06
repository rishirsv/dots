---
name: pr
description: "Triage, repair, land, or steward GitHub pull requests through git and gh. Use for review the open PRs, what's blocking this PR, fix the review comments, land this PR, or steward this PR to merge; not for publishing new PRs (use $ship) or local-only commits (use $commit)."
---

# PR

Three modes over existing pull requests: triage (read-only), repair (scoped
fix commits), and land (merge and cleanup — read
[references/landing.md](references/landing.md) first). Creating a PR belongs
to `$ship`. For a mixed request ("fix it and merge"), run the modes in
sequence and report each stage.

## Resolve The Target

Use an explicit URL or number when given; otherwise the current branch:

```bash
gh pr view "$pr_ref" --json number,url,title,state,isDraft,headRefName,baseRefName,headRefOid,mergeStateStatus,mergeable,reviewDecision,statusCheckRollup
```

Omit `"$pr_ref"` for the current branch. Stop and report if no PR resolves
or more than one target is plausible. When a mode needs REST or GraphQL
identifiers, derive them once:

```bash
pr_number="$(gh pr view "$pr_ref" --json number --jq .number)"
name_with_owner="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
owner="${name_with_owner%%/*}"; repo="${name_with_owner#*/}"
```

## Triage

Read-only — no comments, reviews, thread resolution, or fetches that change
local state.

**Single PR** — explain it like a sharp colleague walking the user through
someone else's PR, not a status bot: a one-sentence plain answer, what the
PR is (2-4 sentences for a reader who hasn't seen the code), actionable
review comments in plain words with their state, real blockers only, and
the next move. Pull checks with `gh pr checks` and review-thread state via
[../../references/review-threads-query.md](../../references/review-threads-query.md)
when conversation resolution could block the merge. Calibrate depth: a docs
fix earns three sentences, a schema migration earns the full structure.

**Queue** ("review the open PRs") — list them
(`gh pr list --state open --limit 50 --json number,url,title,isDraft,headRefName,baseRefName,updatedAt,reviewDecision,statusCheckRollup,mergeStateStatus,author`),
then fan out one read-only reviewer lane per PR — per
[../../references/subagent-lanes.md](../../references/subagent-lanes.md) —
so each verdict rests on the actual diff and discussion, not metadata.
Sort every PR into one bucket:

- **Ready to merge** — checks green, review clean, no unresolved required
  conversations, merge state clean.
- **Needs touch-ups** — mostly good; a rebase or small fixes would land it.
- **Trumped** — superseded by a better PR or by work already merged; close
  candidate.
- **Scrap and rewrite** — the idea is good, the implementation isn't; close
  and restart.
- **Pending / blocked** — checks or review still in flight, conflicts,
  policy, or stacked dependencies.

Lead with counts, then one sentence per PR, ready-first.

## Repair

Patch only actionable, same-story problems; leave product judgment and
unrelated failures alone.

Read comments and thread state before editing:
`gh api "repos/:owner/:repo/pulls/$pr_number/comments"` plus the
review-threads query above. For CI, confirm the failure belongs to this PR
(`gh pr checks`, then `gh run view "$run_id" --log-failed`). Cluster the
findings — actionable in-scope, question-only, resolved or outdated,
conflicting, product judgment, unrelated or flaky CI — and patch only the
first cluster; ask before changing product behavior, picking a side of
conflicting feedback, or force-pushing. For multiple clusters or PRs in
parallel, fan out disposable worktrees per
[references/worktree-repair.md](references/worktree-repair.md).

Commit small and append-only, staging only intended paths, then push. Reply
to and resolve only threads mapped to a fix made in this run; name the rest
as left open. Report the PR URL, commits, validation, and threads handled.

## Land

Read [references/landing.md](references/landing.md) for readiness gates,
merge method, auto-merge, stewarding to merge, stacked-PR handling, and
cleanup. The gates that always hold: a clean worktree before touching local
branch state; never merge drafts, failing or unverifiable required checks,
or unresolved required conversations; never `--admin` without an explicit
request; stop on stacked-PR ambiguity; delete branches only after the
remote confirms the merge.

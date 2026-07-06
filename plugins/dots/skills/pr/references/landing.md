# Landing And Stewarding

Read this before merging, watching a PR to merge, or post-merge cleanup.

## Readiness Gates

Stop before merging if any gate is unclean:

- PR closed, missing, or draft.
- Required checks failing, cancelled, pending, or unavailable.
- Required review missing, rejected, or requested changes remain.
- Required conversations possibly unresolved (run the triage review-thread
  check first), or policy can't be verified.
- Merge state blocked, dirty, behind, or unknown.
- PR appears stacked and landing order is unclear (below).
- Local head doesn't match the PR head and `--match-head-commit` wouldn't
  protect the intended commit.

For "land when ready", pending (not failing) required checks or reviews may
be handled by auto-merge once every other gate is clean.

## Merge And Cleanup

Prefer the repo's documented merge method (repo instructions,
`CONTRIBUTING.md`, recent merged PRs); otherwise check
`gh repo view --json mergeCommitAllowed,squashMergeAllowed,rebaseMergeAllowed`
and prefer squash, then merge, then rebase:

```bash
gh pr merge "$pr_ref" "$merge_flag" --delete-branch --match-head-commit "$head_sha"   # add --auto for when-ready
```

Verify remote state after merge before any cleanup; if auto-merge was only
accepted, report that and wait. Cleanup: `git fetch origin --prune`, switch
to base, `git pull --ff-only`, `git branch -d "$topic_branch"` (`-D` only
with explicit approval to discard unmerged work).

## Stacked PRs

Treat a PR as stacked when its base isn't the default branch, its base
matches another open PR's head, dependency links mention another PR, or
commit ancestry depends on unmerged work. Stop unless the landing order is
unambiguous.

## Steward (watch to merge)

The only flow that keeps working across a review/check heartbeat, and only
inside an envelope stated up front: target PR, allowed repair scope (small
same-story comments/CI, excluding product decisions), heartbeat budget
(default 3-5 polls, 60-120s apart), whether merge is authorized, and stop
conditions. If merge wasn't authorized, steward to "ready to land" and stop.

Loop by composing the other modes: triage for readiness, repair for
actionable issues, land once gates are clean; after a repair changes the
diff, re-check status before landing. Request Codex review
(`gh pr comment "$pr_ref" --body "@codex review"`) only when the user asked
for review stewardship and no current request is already visible on this
head. Stop and ask when the next move needs judgment beyond the envelope —
product or API choices, conflicting comments, scope expansion, unrelated
CI, history rewrites, base-branch changes, stacked ambiguity, or an
exhausted budget. Report final state and actions taken, not a poll-by-poll
transcript.

# Worktree Repair Fan-Out

Mechanics for actioning review comments in parallel across isolated
checkouts. See
[../../../references/subagent-lanes.md](../../../references/subagent-lanes.md)
for the general lane rules this extends.

## When To Fan Out

Fan out when a single pass would serialize independent work: several
actionable comment-clusters on one PR, or comments across multiple PRs. For
a single trivial fix, repair directly on the current checkout — no worktree.

## Getting A Disposable Checkout

Prefer the harness's own isolation: when the agent runtime can spawn a
worker in its own disposable worktree (Claude Code worktree isolation, Codex
worktree child threads), use that — creation and cleanup are handled for
you. Inside its worktree the worker runs:

```bash
gh pr checkout "$pr_number"
```

`gh pr checkout` resolves the PR ref, handles fork-sourced branches, and
sets up push tracking — never reconstruct that by hand with `git worktree
add <branch>`.

Manual fallback when the harness offers no isolation:

```bash
dir="$(mktemp -d)/pr-$pr_number"
git worktree add --detach "$dir"
git -C "$dir" ... # then: cd "$dir" && gh pr checkout "$pr_number"
```

One constraint: git refuses to check out a branch that is already checked
out in another worktree. If the PR head branch is checked out in the user's
main worktree, repair there directly (it's the same checkout the user is
on), or fetch the PR ref detached: `git fetch origin "pull/$pr_number/head"
&& git worktree add --detach "$dir" FETCH_HEAD`, pushing back with
`git push origin "HEAD:$head_branch"`.

One PR per checkout; one worker per comment-cluster; never two workers in
the same worktree.

## Dispatch

Launch independent workers in one batch. Each worker gets: the exact
comments/threads it owns, its checkout, the fix boundary (same-story only),
and the report shape. Each worker fixes its cluster, runs the relevant local
validation, commits small and pushes, comments that the item is addressed,
and resolves only threads its fix provably closed.

## Collection And Cleanup

The parent collects results (commits, threads resolved, threads left open),
re-runs status per affected PR, and offers `$pr land` where gates are clean.
Report per PR, not per worker. Remove manual worktrees when done, success or
not: `git worktree remove "$dir"` (add `--force` only for an abandoned dirty
worktree), then `git worktree prune`. Harness-managed worktrees clean
themselves up. A worker that hits a judgment call (product decision,
conflicting feedback, scope expansion) stops and reports — the repair-mode
escalation rules apply per worker.

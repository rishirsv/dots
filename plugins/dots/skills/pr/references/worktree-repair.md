# Worktree Repair Fan-Out

Mechanics for actioning review comments across isolated worktrees when
`$pr repair` needs to parallelize across comment-clusters or multiple PRs.
See [../../../references/subagent-lanes.md](../../../references/subagent-lanes.md)
for the general lane rules this extends.

## When To Fan Out

Use fan-out when a single direct pass would serialize independent work:
several actionable comment-clusters on one PR, or comments spread across more
than one PR at once. Skip it for a single trivial fix — repair that directly
on the current checkout.

## Setting Up Worktrees

Never touch the user's main checkout for parallel work. For each PR branch
being actioned:

```bash
scratch_dir=".git/pr-repair/$pr_number"   # or another repo-ignored scratch path
git worktree add "$scratch_dir" "$head_branch"
```

Each PR gets its own worktree; each worktree is exclusive to one worker or one
comment-cluster within that PR. Never give two workers overlapping paths in
the same worktree.

## Dispatch

Launch one worker subagent per comment-cluster (per the clustering rule in
repair mode — actionable-in-scope only), each scoped to its own worktree:

- give the worker: the specific comment(s)/thread(s) it owns, the worktree
  path, the fix boundary (same-story only), and the report shape.
- launch independent workers in one batch so they run concurrently.

Each worker:

1. Fixes its cluster inside its worktree only.
2. Runs the relevant local validation for its change.
3. Commits small and append-only, then pushes the PR branch.
4. Comments on the PR (or replies in-thread) that the item is addressed.
5. Resolves only the review threads it can prove its fix addressed — leaves
   everything else open.

## Collection And Cleanup

The parent agent collects each worker's result (files changed, commits,
threads resolved, threads left open), re-runs status mode on each affected
PR, and offers `$pr land` for any PR whose gates are now clean. Do not narrate
worker-by-worker; report per PR.

Remove every worktree once its worker is done, whether it succeeded or
stopped short:

```bash
git worktree remove "$scratch_dir"
```

If a worker needed to stop for a judgment call (product decision, conflicting
feedback, scope expansion), leave that finding in the collected report instead
of guessing — the same escalation rules from repair mode apply per worker.

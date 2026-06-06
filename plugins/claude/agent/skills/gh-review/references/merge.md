# Merge

Use this reference for merge readiness checks and explicit merge requests.

## Readiness

Confirm:

- PR is not draft unless drafts were explicitly included.
- Required checks are passing or the user has accepted pending/optional checks.
- Review decision is approving/neutral or unresolved feedback is intentionally deferred.
- Mergeability is clear and there are no known conflicts.
- Repo-specific docs, tracker, release, or validation gates are satisfied.

Report blockers before suggesting mutation.

## Merge Waves

When merging more than one PR:

1. Start with a dry plan and merge order.
2. Skip draft, failing, conflicted, or unclear PRs unless the user explicitly includes them.
3. Merge dependency or foundation PRs before PRs that build on them.
4. Re-check the open PR list after each merge.
5. Preserve branches unless the user asks to delete them.
6. Stop on non-trivial conflicts and continue only with independent PRs that remain safe.

Use the repo's preferred merge method when documented. Otherwise use `gh pr merge <number> --squash` for ordinary feature/fix PRs, `--merge` when preserving multiple commits matters, and `--rebase` only when the repo clearly prefers linear commit replay.

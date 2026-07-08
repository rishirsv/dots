I would route this to `dots:pr`.

Exact local PR flow I would follow:

1. Confirm the intended scope of the current local changes.
2. Inspect the working tree and diff to separate intended changes from unrelated local edits.
3. Run the repo-relevant validation checks before publishing.
4. Stage only the intended files.
5. Commit with a focused message describing the actual change.
6. Push the current branch to the remote.
7. Create a draft pull request, not a ready-for-review PR.
8. Include a concise PR title, summary, and validation notes.
9. Report the PR URL and the exact checks run.

Checks before publishing:

- Verify branch state and remote tracking.
- Review `git diff` / staged diff for accidental files, secrets, generated artifacts, or unrelated edits.
- Confirm the commit contains only the requested scope.
- Run the repo’s expected validation, here `scripts/verify.sh` unless a narrower task-specific check is clearly more appropriate.
- If skill behavior changed, also run the relevant deterministic skill validation, such as `plugins/meta-skill/scripts/metaskill validate <skill-dir> --json` when applicable.
- Confirm the PR is opened as a draft.
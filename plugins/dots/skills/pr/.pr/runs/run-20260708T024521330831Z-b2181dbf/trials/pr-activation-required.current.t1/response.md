I would route this to the local `$pr` flow:

1. Confirm the publishing scope:
   - `git status -sb`
   - `git diff --stat`
   - `git diff --staged --stat`
   - If the diff is mixed or unclear, ask which paths belong in the PR before staging anything.

2. Check PR prerequisites:
   - Confirm this is a local git repo with an accessible GitHub remote.
   - Run `gh --version`.
   - Run `gh auth status`; stop if GitHub CLI is not authenticated.

3. Choose branch strategy:
   - If on `main`, `master`, or the remote default branch, create a small repo-native branch name matching the change.
   - Otherwise stay on the current branch unless the user asked for a new branch.

4. Stage and commit:
   - Stage only intended paths, using explicit paths unless the whole worktree is clearly in scope.
   - Commit with a terse, repo-native message.

5. Validate before publishing:
   - Run the most relevant deterministic checks for the changed area.
   - For this repo, that would usually include targeted tests when applicable, and `scripts/verify.sh` for baseline verification if appropriate.
   - If a skill changed, also run `plugins/meta-skill/scripts/metaskill validate <skill-dir> --json` where relevant.

6. Push:
   - `git push -u origin "$(git branch --show-current)"`

7. Create the PR:
   - Use the GitHub connector if available; otherwise use `gh pr create`.
   - Default to a draft PR.
   - Use the requested base branch, or the remote default branch.
   - Use a compact human PR body covering what changed, why, review focus, and validation.

8. Verify after creation:
   - Re-query the PR for URL, base/head branch, draft state, mergeability/check status when available.
   - Report branch, commit, PR URL, validation commands/results, and any remaining blocker.
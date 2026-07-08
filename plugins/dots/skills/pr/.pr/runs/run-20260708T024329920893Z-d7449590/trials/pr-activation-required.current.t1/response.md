I would route this to the local `dots:pr` flow.

Exact flow:

1. Check current git state: branch, status, diff, staged files, upstream/base remote.
2. Confirm the PR scope from the local changes only, excluding unrelated dirty work.
3. Review the diff for secrets, accidental generated files, cache edits, or broad unrelated churn.
4. Run the relevant validation for the touched area, usually targeted tests first; for Dots repo changes, include `scripts/verify.sh` when appropriate.
5. Stage only the intended files.
6. Create an intentional commit with a concise message.
7. Push the current branch to the GitHub remote.
8. Open a draft PR against the correct base branch.
9. Fill the PR body with summary, validation performed, and any known risks or skipped checks.
10. Return the draft PR URL and the exact validation results.

Before publishing, I would specifically verify: no secrets, no installed cache edits, no unrelated files staged, branch/base are correct, validation passed or any failure is explained, and the PR is created as draft rather than ready for review.
I would route this to the local `dots:pr` flow because the user explicitly asked to create a draft PR.

Exact flow I would follow:

1. Check local Git state and identify the intended change set:
   `git status --short --branch`, `git diff --stat`, `git diff`, and staged diff if present.

2. Confirm scope before publishing:
   stage only the files that belong to the requested local changes, leaving unrelated work alone.

3. Verify the branch and base:
   make sure the work is on a non-`main` branch, fetch the target base if needed, and confirm the PR should target `main` unless repo context says otherwise.

4. Run pre-publish checks:
   review changed files directly, run the relevant deterministic tests for the touched area, run repo baseline verification when appropriate, and run `git diff --check`.

5. Commit the scoped changes:
   create a focused commit with a clear message describing the actual change.

6. Push the branch:
   `git push -u origin HEAD`.

7. Open a draft PR:
   use `gh pr create --draft --base main --head <branch>`, with a concise title, summary, validation section, and any known limitations.

8. Final response:
   return the draft PR URL, commit hash, files changed at a high level, and exact validation commands with pass/fail results.
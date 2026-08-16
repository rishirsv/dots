---
name: babysit-pr
description: "Keeps a GitHub pull request moving by watching its latest checks and review feedback, fixing problems within its original goal, and replying to handled feedback. Use when the user asks to monitor, watch, or babysit a pull request; not for a one-time status report."
---

# Babysit a Pull Request

Keep following the pull request until its latest commit is clean. Keep the
original goal fixed, and merge only when the user asks.

## Start

1. Resolve the exact repository, pull request, and local branch. Use a supplied
   pull request link or number; otherwise find the pull request for the current
   branch. Confirm `gh auth status` before relying on command-line GitHub data.
2. Record the original goal, target branch, latest commit, merge state, checks,
   and unresolved review discussions. Prefer the GitHub app for pull request
   and review data. Use `gh` for checks, run logs, and local branch work.
3. Take one compact starting snapshot. Useful commands are:

   ```bash
   gh pr view <pr> --json headRefOid,baseRefName,mergeStateStatus,reviewDecision,state
   gh pr checks <pr> --json name,state,bucket,link
   ```

   Use thread-aware review data when discussion status matters; a flat comment
   list cannot show whether a discussion is resolved or outdated.

## Watch

1. Remember the latest commit, check states, and review discussion IDs. On each
   pass, request only this compact state and read full logs or comments only
   when something changed.
2. Use a native wait or monitoring tool when available. Otherwise wait about
   one minute while checks are running and a few minutes when only review is
   pending. Reset the shorter wait after any change. Report changes, not
   unchanged snapshots.
3. If a new commit appears, discard older check results and take a fresh
   snapshot. Re-check every unresolved discussion against the latest code and
   act only when it still applies.
4. If the repository offers automated review, request it once after the latest
   commit is pushed and stable, using the repository's exact command such as
   `@codex review`. Request another review only when the user and repository
   rules allow it.

## Handle Changes

- For a failed GitHub Actions check, inspect only the failed run and relevant
  log lines. Confirm the failure comes from the pull request before changing
  code. Treat external check providers as report-only when their logs are not
  available.
- For a review comment, inspect its file, location, discussion, and current
  code. Fix real problems within the original goal. If it is incorrect,
  outdated, duplicated, or outside that goal, reply with the reason and
  resolve the discussion.
- After a fix, run focused project checks, commit, push, and reply with the
  short commit reference, what changed, and what passed. Then restart the watch
  loop from the new latest commit.
- Bring the branch up to date with its target branch only when required by the
  repository or a real conflict. Do not pull unrelated repairs into the pull
  request.

## Stop

Stop successfully when the latest commit has passed its required checks,
required reviews are satisfied, no unresolved discussion still requires work,
and no merge conflict or required branch update remains. Also stop and report
clearly if the pull request is merged, closed, or blocked on a decision only the
user can make.

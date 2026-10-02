---
name: babysit-pr
description: "Keeps a GitHub pull request moving by watching its latest checks and review feedback, fixing problems within its original goal, and replying to handled feedback. Use when the user asks to monitor, watch, or babysit a pull request; not for a one-time status report."
---

# Babysit PR

Follow the pull request until its latest commit passes required checks and
reviews and no unresolved issue requires work. Keep the original goal fixed, and
merge only when the user asks.

## Start

1. Resolve the exact repository, pull request, and local branch. Use a supplied
   pull request link or number; otherwise find the pull request for the current
   branch. Confirm `gh auth status` before relying on command-line GitHub data.
2. Record the original goal, target branch, latest commit, merge state, checks,
   and unresolved review discussions. Prefer the GitHub app for pull request and
   review data. Use `gh` for checks, run logs, and local branch work.
3. Record the starting state once, keeping the record brief. Useful commands
   are:

   ```bash
   gh pr view <pr> --json headRefOid,baseRefName,mergeStateStatus,reviewDecision,state
   gh pr checks <pr> --json name,state,bucket,link
   ```

   When discussion status matters, use data that identifies each review thread;
   a flat comment list cannot show whether a discussion is resolved or outdated.

## Watch

Prefer an available native event or check-completion notification while CI or
review is pending. Otherwise use the host's supported scheduler and cadence;
five minutes is a default only where supported. State the actual cadence and use
the existing monitor for the same pull request. Do not silently substitute a
different cadence when the user requested an exact one, or keep the main agent
in a polling loop.

When model selection is supported, use the configured lightweight monitoring
role; otherwise keep the host's supported settings. Do not add a subagent merely
to relay unchanged status. For a short wait on one CI run, use a supported native
check-completion wait without a recurring schedule.

Give the monitor the repository, pull request, original goal, latest commit,
last observed check states and review discussion IDs, and the task to notify.
Keep its work read-only:

- Fetch compact check, review, merge, and open/closed state. Read full logs or
  comment bodies only when something changes; retain the last observed state
  between runs.
- Report failed checks, new actionable feedback, conflicts, readiness to merge,
  or a merged/closed pull request. Stay silent while state is unchanged or does
  not require action. Do not repeatedly notify about an already reported issue.
- When a new commit appears, discard older check results. Identify unresolved
  discussions for the main agent to recheck against current code.
- Notify the main agent only when work is needed or monitoring is complete. The
  main agent owns interpretation, repairs, tests, commits, pushes, and review
  replies; it does not poll the monitor. After a fix, resume from the new latest
  commit.

Use the host's scheduling and task-notification tools only as supported. If
persistent scheduling is unavailable, state that limit. Use a bounded native
wait only if one is available; otherwise return the current status and blocker.
Do not claim future monitoring is active without a successful scheduling result.

If the repository offers automated review, request it once after the latest
commit is pushed and stable, using the repository's exact command such as
`@codex review`. Request another review only when the user and repository
rules allow it.

## Handle Changes

- For a failed GitHub Actions check, inspect only the failed run and relevant
  log lines. Confirm the failure comes from the pull request before changing
  code. If an external check provider's logs are unavailable, report its failure
  without changing code.
- For a review comment, inspect its file, location, discussion, and current
  code. Fix real problems within the original goal. If it is incorrect,
  outdated, duplicated, or outside that goal, reply with the reason and resolve
  the discussion.
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

Cancel the recurring monitor when these stop conditions are met or the user
cancels babysitting. Report readiness once; do not merge without authorization.

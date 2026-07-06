# Babysit PR

Read this only when the user invokes `ship review`, asks for Codex review, or explicitly asks you to babysit the newly published PR.

## Scope

Babysit only the PR that this publish run created or reused for the current branch. This file does not turn `ship` into a general existing-PR review-thread or CI repair skill.

The goal is to keep the just-published PR moving until the first review/check cycle is through: review requested, checks observed, obvious publication fallout handled, and the branch pushed again if a scoped fix is needed.

Do not merge from `ship` or this reference. If the user asks to merge, return
to the main skill's landing boundary and use `$pr land`.

## Request Codex Review

Post the exact documented review trigger as a separate PR comment:

```bash
gh pr comment "$pr_url_or_number" --body "@codex review"
```

Use exactly `@codex review` as the trigger. Do not put the trigger in the PR body. If the user asks for a focused review, keep the required prefix and add the focus after it, for example:

```bash
gh pr comment "$pr_url_or_number" --body "@codex review for security regressions and missing tests"
```

## Watch Loop

This is a bounded first-review watch scoped only to immediate
post-publication fallout on the PR this run just created or reused. It is
not a general status, repair, or stewardship loop.

For loop cadence, poll budget, and the `gh pr view` / `gh pr checks` status
field semantics, use the canonical loop in
[`../../pr/references/landing.md`](../../pr/references/landing.md) steward section (`$pr steward`). Confirm
the review comment landed, then run that loop once to observe the first
check/review cycle.

While watching, also inspect inline pull request review comments before
deciding there are no actionable findings:

```bash
pr_number="$(gh pr view "$pr_url_or_number" --json number --jq .number)"
gh api "repos/:owner/:repo/pulls/$pr_number/comments"
```

If Codex posts no reaction or review by the bounded wait, verify that the
repository has Codex code review enabled if that context is available.
Otherwise report that Codex did not respond yet and leave the PR published.

## Fix And Push Policy

If checks fail or Codex posts review findings during the babysitting window, decide whether the fix is still part of the published scope.

Fix and push when:

- the failure is caused by the just-published change,
- the fix is small and clearly within the same PR story,
- local validation can prove the fix,
- unrelated work can stay untouched.

Stop and report instead when:

- the failure is infrastructure-wide, flaky, or unrelated,
- the fix would expand the PR scope,
- the comments require product judgment,
- handling the issue would become a standalone CI repair or existing-PR review workflow.

When making a babysitting fix:

```bash
git status --short
git add -- <intended paths>
git commit -m "<terse fix subject>"
git push
```

Then re-run the validation harness from the main skill and continue the watch loop once.

## Stop Conditions

Stop babysitting and report clearly when one of these is true:

- checks are passing or pending with no actionable failure,
- Codex review has completed with no blocking findings,
- a scoped fix was pushed and checks/review restarted,
- Codex did not respond within the bounded window,
- a blocker needs user judgment or a different skill.

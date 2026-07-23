---
name: pr
description: "Creates, updates, or monitors GitHub pull requests from local work, including scoped commits and pushes. Use only when the user invokes $pr; not for commit-only requests, merges, or routine local edits."
---

# PR

Move local work into a reviewable GitHub pull request with the fewest safe
steps and the smallest useful context. Default new pull requests to draft;
make one ready only when the user explicitly asks.

`$pr` has three modes:

| mode | job |
| --- | --- |
| `create` | Scope, branch, commit, push, and open a pull request. This is the default when no pull request exists. |
| `update` | Change an existing pull request's title, body, base, or draft state without republishing unrelated work. |
| `watch` | Report readiness and, when explicitly requested, follow checks or review feedback until the requested terminal state. |

Infer the mode when repository state makes it obvious; do not ask the user to
repeat an intent already clear from the request. Never merge, force-push,
rebase shared history, resolve review threads, or submit review replies unless
the user explicitly requests that action.

## Start Small

Read repository instructions from the current repository and worktree first;
do not reuse `AGENTS.md`, `CLAUDE.md`, or other agent context from a different
checkout or account. Then collect one compact local snapshot:

- `git status -sb`
- current branch, upstream, and default branch
- `git diff --stat` and `git diff --staged --stat`
- the `origin` or push-remote URL
- nearby commit and pull-request title style when needed

Use stats and commit lists to establish scope before reading a full diff. Read
the full base-to-head diff once, when it is needed for review or the pull
request body. Reuse fresh validation and repository facts from the current
task instead of rediscovering or rerunning them.

If the worktree mixes unrelated changes, stop before staging and ask which
paths or hunks belong. Never use `git add -A`, and preserve all unrelated
changes.

## Identity Gate

Treat four identities as separate checks:

1. **Repository:** resolve the exact host and owner/repository from the push
   remote, including an enterprise hostname.
2. **Branch:** verify the current branch is the intended pull-request branch.
   `git switch` changes branches; it does not change a GitHub account.
3. **GitHub account:** for CLI writes, run
   `gh auth status --active --hostname <host>` and confirm repository access
   with `gh repo view --json nameWithOwner,viewerPermission,defaultBranchRef`.
   The active `gh` account controls API calls; an SSH push can still use a
   different key or host alias, so verify the remote transport too.
4. **Commit identity:** inspect the effective `user.name`, `user.email`, and
   signing configuration. Commit email controls attribution and is independent
   of the account used to push.

If the correct CLI account is explicit in the request or repository-owned
instructions, use `gh auth switch --hostname <host> --user <login>` when
needed and verify again. Otherwise, show the current and plausible target
accounts and ask before switching. Never change global Git configuration;
apply an authorized identity correction to this repository only.

Do not assume a connector and `gh` share an account. Before a connector write,
verify that it can see the exact repository with the intended permissions. If
the connector identity is ambiguous in a personal/work setup, use the already
verified CLI account for the write or ask the user to select the account.

## Choose The GitHub Surface

Use the best available surface for each operation, not one surface for the
whole workflow:

| operation | preferred surface |
| --- | --- |
| branch, stage, commit, push, auth, local diff | `git` and `gh` locally |
| pull-request metadata, comments, reviews, thread state | GitHub connector when available and its repository/account are verified |
| create or update a pull request | verified connector; otherwise `gh pr` |
| GitHub Actions checks and logs | `gh`, narrowing to failed checks and jobs |

Connector reads are useful before local mutation, but a connector cannot prove
local branch, diff, commit, or push state. Prefer structured connector results
to scraping GitHub pages. Fall back to `gh` when the connector lacks the
operation, account certainty, or required detail.

## Create

1. Confirm the repository, account, commit identity, scope, base, and branch.
   From the default branch, create the smallest repository-native branch name.
   Keep an existing feature branch when it already owns the work. Stop on a
   detached head, unclear remote, unsafe branch switch, or possible
   non-fast-forward push.
2. Stage only intended paths or hunks. Inspect `git diff --staged`, then run
   `git diff --staged --check`.
3. Run the cheapest relevant validation not already proved in the current
   task. Do not substitute build success for required runtime or visual proof.
4. Match nearby commit style. Use an imperative subject of at most 50
   characters; add a body only for rationale, constraints, or tradeoffs.
5. Verify the staged scope again, commit, and push with an upstream when the
   branch lacks one. Never bypass hooks unless the user explicitly asks.
6. Build the pull-request title and body from the base-to-head change, the
   repository template, and actual validation. Keep a small change brief. For
   larger work, cover outcome and impact, context or root cause, core
   implementation, review focus, and validation.
7. Create a draft pull request unless the user explicitly requested ready.
   UI changes need real screenshot or clip evidence in the live body; leave the
   pull request draft when required evidence is missing.
8. Query the created pull request once for URL, merge state, checks, review
   decision, and unresolved threads. Report the branch, commit, validation,
   pull-request health, and any remaining confirmation.

## Update

Resolve the current pull request from the branch or explicit URL. Read its
current title, body, base, draft state, and base-to-head scope. Change only the
requested fields, preserve useful template sections, and verify the live result
once. Marking ready, changing the base, or adding reviewers is an external
state change and requires clear user intent.

## Watch

Take a compact snapshot of merge state, checks, review decision, and unresolved
threads. When the user asks to keep watching, wait for state changes instead of
re-reading the full pull request. Inspect only failed Actions jobs and only
actionable review threads. Diagnose before editing; implement fixes only when
the request includes fixes, then rerun focused validation, commit, and push the
same branch. Do not make the pull request ready or merge it unless explicitly
asked.

## Token And Latency Budget

- Batch local metadata checks and delay full diff reads until scope is known.
- Reuse current-task validation and explanations.
- Use one pull-request creation/update call and one final health query.
- Follow only changed remote state during `watch`.
- Do not start an automatic fix-review-fix loop from `create`.
- Stop once the requested pull-request state is real and verified.

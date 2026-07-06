---
name: ship
description: "Turns already-scoped local work into a pushed branch and ready-to-go GitHub pull request; ship review also requests and watches a first review pass. Use when the user says ship it, ship, ship draft, or ship review; not for local-only commits, existing PR repair, stewardship, status checks, or merging."
---

# Ship PR

Turn an already scoped local change into a pushed branch and ready-to-go PR without sweeping unrelated work into it. This is the canonical portable PR publisher for work and personal repos, even when a GitHub connector is also available. Default to a normal non-draft PR; use draft only when the invocation explicitly asks for a draft.

## References

- Read [branch-naming.md](references/branch-naming.md) before creating or renaming a branch.
- Read [pr-body-template.md](references/pr-body-template.md) before drafting the PR title or body.
- Read [babysit-pr.md](references/babysit-pr.md) only for `ship review`, an
  explicit Codex-review request, or a bounded first review/check watch on the
  newly published PR.

Before publishing, confirm the GitHub CLI surface: `gh --version` and `gh auth
status` succeed, the base branch is resolved (user > repo instructions >
existing PR base > `gh repo view --json defaultBranchRef`), and any existing
PR for the branch is found via `gh pr view --json number,url,state,isDraft,headRefName,baseRefName,title,body` and reused rather than duplicated.

## Invocation Meaning

- `ship` / `ship it` (default): publish or update a ready-for-review,
  non-draft PR. Plain language — "send this", "publish PR", "open a PR",
  "send this for review" — maps here unless the user says `ship review` or
  asks for Codex review.
- `ship draft`: publish or update a draft PR.
- `ship review`: do everything `ship` does, then request and watch a first
  Codex review pass.
- `ship merge`, `publish and merge`, or `send and land`: publish first, then
  hand landing to `$pr land`.

The bounded first review/check watch in `babysit-pr.md` covers only
immediate fallout on the PR just published; existing-PR stewardship belongs
to `$pr steward`.

## Core Workflow

1. Inspect the current branch, worktree, staged diff, recent commits, remotes, base branch, and GitHub auth.
2. Infer the intended publication scope from the request, current diff, staged files, current branch, commits made in this session, and validation evidence.
3. Run the split-scope check before staging or pushing. Publish one reviewer-visible story; leave unrelated work untouched.
4. Create or keep a branch using the repo policy and [branch-naming.md](references/branch-naming.md). Rename only unpublished local branches when the better name is obvious.
5. Resolve the base branch (see References) before PR creation.
6. Stage only intended paths. Prefer explicit path staging over broad staging.
7. Commit only when there are intended uncommitted changes. If the intended work is already committed, do not amend or create a cosmetic commit.
8. Run relevant local validation when an obvious command exists and no fresh evidence is already available.
9. Push with upstream tracking.
10. Draft the PR body per [pr-body-template.md](references/pr-body-template.md):
    a plain-language summary any non-technical reader can follow always
    leads; technical detail (what changed, why, verification, risk, breaking
    changes) collapses below it, never the reverse. Then create or reuse the
    PR with an explicit title, body file, base, and head branch — normal
    non-draft by default, draft only for `ship draft`, converting an
    existing draft to ready otherwise.
11. Verify publication with the validation harness.
12. If the invocation is `ship review` or the user explicitly asks for Codex review/babysitting, post the Codex review request and follow [babysit-pr.md](references/babysit-pr.md).
13. If the invocation asks to merge or land the PR, hand off to `$pr land` (see Landing Boundary).
14. Report branch, commit range, PR URL, validation evidence, review-request state, and any remaining blockers.

## Scope Discipline

Treat dirty worktrees and detached heads as scoping problems to solve, not
automatic blockers. When the current branch is detached, the default branch,
or otherwise unsuitable, create a feature branch before committing or
pushing (`git switch -c "$branch_name"`). Ask before creating a branch when
the base commit is unclear, multiple publication remotes exist, or local
changes cannot be safely carried forward.

Keep one PR when the changed files support the same user-visible outcome,
bug fix, docs update, refactor, or maintenance task; supporting tests,
fixtures, and config changes can ride along when they explain or verify the
main change. Split, publish only the intended slice, or ask one concise
question when the diff mixes unrelated product surfaces, unrelated bug
fixes, or cleanup with feature work — or when a branch name would need vague
glue like `misc` or `cleanup-and-feature`. If only part of a file should be
included and there is no safe non-interactive split, stop and ask.

## Publication Commands

Use explicit, non-interactive commands. Adjust the base branch when repo instructions or the user specify a different target.

```bash
git push -u origin "$(git branch --show-current)"
gh pr create --base "$base_branch" --head "$(git branch --show-current)" --title "$title" --body-file "$body_file"
```

Add `--draft` only for `ship draft`. If an open PR already exists for the
current branch, reuse it (`gh pr view --json number,url,state,isDraft,headRefName,baseRefName`)
instead of creating a duplicate. Use `gh pr edit` only when the existing
title, body, or base branch needs to match the publication request. Convert
an existing draft PR to ready for `ship` or `ship review` with `gh pr ready
"$pr_url_or_number"`; preserve draft state only for `ship draft` or an
explicit request to keep it drafted.

## Validation Harness

Before final reporting, verify:

- `gh auth status` succeeds and the branch has an upstream (`git rev-parse
  --abbrev-ref --symbolic-full-name @{u}`).
- The PR exists and points at the expected head/base (`gh pr view --json
  number,url,state,isDraft,headRefName,baseRefName`).
- The PR diff matches the intended scope — compare
  `git diff --name-status "$(git merge-base HEAD "origin/$base_branch")"..HEAD`
  with `gh pr diff --name-only`.
- Checks have started, or the no-checks state is explained
  (`gh pr checks --json name,state,bucket,startedAt,completedAt,link`).
  Treat exit code 8 as pending, not failure; retry briefly on a freshly
  opened PR since checks can lag.

## Review Request Modifier

For `ship review` or an explicit Codex-review request, post the review request as documented in [babysit-pr.md](references/babysit-pr.md#request-codex-review).

## Landing Boundary

Do not merge from this skill. If the user says `ship merge`, `publish and
merge`, `send and land`, or equivalent, publish or update the PR first,
verify the PR URL and head SHA, then say that landing belongs to `$pr land`.
If both skills were invoked in one request, hand off to `$pr land` only
after the publication report is complete — the merge approval belongs there.

## Safety Rules

- Do not push unrelated work or silently create a broad PR from a mixed worktree.
- Do not use destructive cleanup commands or broad staging commands unless the full dirty worktree is the explicit publication scope.
- Do not amend, rebase a shared branch, or force-push unless the user or repo policy clearly asks for it.
- Do not request non-Codex human reviewers unless asked, or dump raw terminal transcripts or commit logs into the PR body.

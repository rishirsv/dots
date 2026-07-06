---
name: ship
description: "Turns already-scoped local work into a pushed branch and ready-to-go GitHub pull request; ship review also requests and watches a first review pass. Explicit-only skill invoked via ship, ship draft, or ship review; not for local-only commits, existing PR repair, stewardship, status checks, or merging."
---

# Ship PR

Turn an already scoped local change into a pushed branch and ready-to-go PR without sweeping unrelated work into it. This is the canonical portable PR publisher for work and personal repos, even when a GitHub connector is also available. Default to a normal non-draft PR; use draft only when the invocation explicitly asks for a draft.

## References

- Read [github-cli-preflight.md](references/github-cli-preflight.md) before publishing. Use it to verify GitHub auth, remotes, branch tracking, base branch, and existing PR state.
- Read [branch-naming.md](references/branch-naming.md) before creating or renaming a branch.
- Read [pr-body-template.md](references/pr-body-template.md) before drafting the PR title or body.
- Read [babysit-pr.md](references/babysit-pr.md) only for `ship review`, an
  explicit Codex-review request, or a bounded first review/check watch on the
  newly published PR.

## Invocation Meaning

- `ship` (default): publish or update a ready-for-review, non-draft PR.
  Plain language — "send this", "send-it", "publish PR", "open a PR", "send
  this for review" — maps here; there is no separate token for review intent
  unless the user says `ship review` or explicitly asks for Codex review.
- `ship draft`: publish or update a draft PR.
- `ship review`: do everything `ship` does, then request and watch a first
  Codex review pass.
- `ship merge`, `publish and merge`, or `send and land`: publish first, then
  hand landing to `$pr land`.

The bounded first review/check watch in `babysit-pr.md` handles only immediate
publication fallout on the PR just created or reused. Existing-PR stewardship
belongs to `$pr steward`.

## Core Workflow

1. Inspect the current branch, worktree, staged diff, recent commits, remotes, base branch, and GitHub auth.
2. Infer the intended publication scope from the request, current diff, staged files, current branch, commits made in this session, and validation evidence.
3. Run the split-scope check before staging or pushing. Publish one reviewer-visible story; leave unrelated work untouched.
4. Create or keep a branch using the repo policy and [branch-naming.md](references/branch-naming.md). Rename only unpublished local branches when the better name is obvious.
5. Resolve the base branch before PR creation. Prefer the user-specified base, then repo instructions, then an existing PR base, then `gh repo view --json defaultBranchRef`.
6. Stage only intended paths. Prefer explicit path staging over broad staging.
7. Commit only when there are intended uncommitted changes. If the intended work is already committed, do not amend or create a cosmetic commit.
8. Run relevant local validation when an obvious command exists and no fresh evidence is already available.
9. Push with upstream tracking.
10. Create a new PR or reuse an existing PR with an explicit title, body file, base branch, and head branch. Create a normal non-draft PR by default; use draft only for `ship draft`. Convert an existing draft PR to ready for any other invocation.
11. Verify publication with the validation harness.
12. If the invocation is `ship review` or the user explicitly asks for Codex review/babysitting, post the Codex review request and follow [babysit-pr.md](references/babysit-pr.md).
13. If the invocation asks to merge or land the PR, stop after publication and hand off to `$pr land`; do not merge from this skill.
14. Report branch, commit range, PR URL, validation evidence, review-request state, and any remaining blockers.

## Scope Discipline

Treat dirty worktrees and detached heads as scoping problems to solve, not automatic blockers.

When the current branch is detached, the default branch, or otherwise unsuitable
for publication, create a feature branch before committing or pushing:

```bash
git switch -c "$branch_name"
```

Ask before creating a branch when the base commit is unclear, the repository has
multiple publication remotes, or local changes cannot be safely carried forward.

Keep one PR when the changed files support the same user-visible outcome, bug fix, docs update, refactor, or maintenance task. Supporting tests, fixtures, generated files, docs, and config changes can belong in the same PR when they explain or verify the main change.

Split, publish only the intended slice, or ask one concise question when the diff contains unrelated product surfaces, unrelated bug fixes, mixed cleanup and feature work, or a branch name would need vague glue such as `misc`, `updates`, or `cleanup-and-feature`.

If only part of a file should be included and there is no safe non-interactive split available, stop and ask one concise question.

Do not use `git add -A` or `git add .` for PR publication unless the user
explicitly asked to publish every dirty path and the split-scope check confirms
all dirty work belongs in the same PR.

## Publication Commands

Use explicit, non-interactive commands. Adjust the base branch when repo instructions or the user specify a different target.

```bash
git status --short
git status -sb
git branch --show-current
git remote -v
gh auth status
gh repo view --json defaultBranchRef
git diff --stat
git diff --staged --stat
```

Push with tracking:

```bash
git push -u origin "$(git branch --show-current)"
```

Create a normal non-draft PR by default:

```bash
gh pr create --base "$base_branch" --head "$(git branch --show-current)" --title "$title" --body-file "$body_file"
```

Create a draft PR only for `ship draft`:

```bash
gh pr create --draft --base "$base_branch" --head "$(git branch --show-current)" --title "$title" --body-file "$body_file"
```

If an open PR already exists for the current branch, reuse it:

```bash
gh pr view --json number,url,state,isDraft,headRefName,baseRefName
```

Use `gh pr edit` only when the existing PR title, body, or base branch needs to match the publication request. If an existing PR is draft, convert it to ready for `ship` or `ship review`. Preserve or create draft state only for `ship draft` or an explicit user request to keep the PR drafted. For `ship review`, convert a draft PR to ready before posting a review request:

```bash
gh pr ready "$pr_url_or_number"
```

## Validation Harness

Before final reporting, verify:

- `gh auth status` succeeds.
- The current branch has an upstream: `git rev-parse --abbrev-ref --symbolic-full-name @{u}`.
- The PR exists and points at the expected head and base: `gh pr view --json number,url,state,isDraft,headRefName,baseRefName`.
- The PR diff matches the intended scope. Compare local merge-base diff and PR files when useful:

```bash
git fetch origin "$base_branch"
git diff --name-status "$(git merge-base HEAD "origin/$base_branch")"..HEAD
gh pr diff --name-only
```

- Checks have started or the no-checks state is explained. Prefer:

```bash
gh pr checks --json name,state,bucket,startedAt,completedAt,link
```

Treat `gh pr checks` exit code 8 as pending, not failure. After a freshly opened PR, retry briefly if GitHub reports no checks yet; checks can lag PR creation. If the repo genuinely has no checks, say so.

## Review Request Modifier

For `ship review` or an explicit Codex-review request, post the current documented Codex review trigger as a separate PR comment:

```bash
gh pr comment "$pr_url_or_number" --body "@codex review"
```

Use exactly `@codex review` unless the user adds focus text after that prefix. Do not put the review request in the PR body. If posting the comment fails, keep the PR published and report the comment failure clearly.

## Landing Boundary

Do not merge from this skill. If the user says `ship merge`, `publish and
merge`, `send and land`, or equivalent, publish or update the PR first, verify
the PR URL and head SHA, then say that landing belongs to `$pr land`.

If the user explicitly invoked both skills in one request, continue with the
`$pr land` workflow only after the publication report is complete. The merge
approval belongs to `$pr land`, not to the publication step.

## Safety Rules

- Do not push unrelated work.
- Do not silently create a broad PR from a mixed worktree.
- Do not use destructive cleanup commands.
- Do not use broad staging commands unless the full dirty worktree is the
  explicit publication scope.
- Do not amend, rebase a shared branch, or force-push unless the user or repo policy clearly asks for it.
- Do not merge.
- Do not request non-Codex human reviewers unless the user asks.
- Do not dump raw terminal transcripts or commit logs into the PR body.

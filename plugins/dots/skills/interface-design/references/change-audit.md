# Review An Interface Change

Use for UI regressions in a diff, branch, commit, or pull request. Review the requested change and the surfaces it affects; use [design audit](design-audit.md) for domain criteria and reporting.

## Resolve scope

Honor an explicit target: staged changes, working changes, commit, range, branch, or PR. Resolve its base and head before reading hunks. For a single commit compare its parent; ask which parent when a merge target is ambiguous. For a branch or PR use its actual base’s merge base, not an assumed `main`.

When no target is supplied, include current-branch commits ahead of the default branch’s merge base plus staged, unstaged, and relevant untracked changes. If there are no branch commits, review the working changes. State committed and uncommitted scope separately. With no change, identify that fact and ask for a target; do not silently review the last commit.

Read renames as old/new paths. Inspect changed images, fonts, and visual snapshots when they affect the interface; skip generated or vendored internals only with the relevant source or rendered effect accounted for. Preserve the user’s checkout; use fetched refs or an isolated worktree for another revision.

## A diff is not a surface

A changed file is evidence, not the review subject. Its affected surfaces are the places it renders in; review those.

Trace direct consumers, and follow shared tokens or primitives through to representative consuming screens. Choose consumers covering different states, themes, and layouts. State uninspected consumers instead of claiming product-wide coverage from a sample.

## Read the removed lines

A signal is a lead, not a finding. A removal is only a regression when nothing in the change replaces it.

Inspect both sides of every relevant hunk. Use [removed signals](recipes/removed-signals.md) when removals may have lost semantics, behavior, text, or visual constraints. Confirm the resulting behavior before reporting the signal as a defect.

## Classify every finding

Give every finding one status:

- `Introduced`: the change created it.
- `Regression`: the change weakened something previously correct.
- `Pre-existing`: present in the touched surface but not caused by this change.

Classify by cause, confirmed against the base when needed. An untouched line can regress because its shared token or ancestor changed. File proximity and blame alone do not establish causality. Keep pre-existing issues separate unless they block the requested result.

## Hold the change to its stated intent

Read the pull request title and body, the linked issue and the commit messages, then review whether the interface delivers what they claim.

Check applicable states of a new variant or theme, translation entries for new strings, and sibling surfaces that must expose the same action. Report missing states only where the component or task requires them.

Return the resolved scope, affected surfaces, classified findings, and unverified coverage through the existing [audit result](design-audit.md#result). Source inspection can establish implementation defects; rendered claims need the affected surface. Continue scoped corrections when the user also requested fixes.

# Review An Interface Change

Use for UI regressions in a diff, branch, commit, or pull request. Review the
requested change and the surfaces it affects; use [design
audit](design-audit.md) for domain criteria and reporting.

## Resolve scope

Use the target supplied by the user: staged changes, working changes, commit,
range, branch, or PR. Identify the base and head revisions before reading the
diff. For a single commit, compare it with its parent. If a merge commit has an
ambiguous comparison target, ask which parent to use. For a branch or PR, find
the merge base with its actual base branch. Do not assume that the base is
`main`.

When no target is supplied, include current-branch commits ahead of the default
branch’s merge base plus staged, unstaged, and relevant untracked changes. If
there are no branch commits, review the working changes. Describe committed and
uncommitted changes separately. If there are no changes, report that fact and
ask for a target. Do not substitute the last commit.

For renamed files, inspect both the old and new paths. If changed images, fonts,
or visual snapshots affect the interface, inspect them; skip generated or
vendored internals only after inspecting the relevant source or rendered effect.
Preserve the user’s checkout. To inspect another revision, use fetched refs or
an isolated worktree.

## Inspect the affected interface

Identify the screens and components that use each changed file. Review the
interface in those locations.

Find the components that directly use the changed code. For shared tokens or
primitives, follow their uses to representative screens. Choose screens and
components that cover different states, themes, and layouts. Identify uses that
you did not inspect. Do not claim product-wide coverage from a sample.

## Read the removed lines

A removed line identifies something to investigate. Report a regression only
when the change does not replace the removed behavior.

Inspect both sides of every relevant hunk. Use [removed
signals](recipes/removed-signals.md) when removals may have lost semantics,
behavior, text, or visual constraints. Confirm the resulting behavior before
reporting a defect.

## Classify every finding

Give every finding one status:

- `Introduced`: the change created it.
- `Regression`: the change weakened something previously correct.
- `Pre-existing`: present in the touched surface but not caused by this change.

Classify each finding by its cause. When needed, compare with the base revision
to confirm that cause. An untouched line can regress because its shared token or
ancestor changed. Nearby file locations and Git blame alone do not prove the
cause. Keep pre-existing issues separate unless they block the requested result.

## Hold the change to its stated intent

Read the pull request title and body, the linked issue, and the commit messages.
Check whether the interface delivers what they claim.

Check applicable states of a new variant or theme, translation entries for new
strings, and sibling surfaces that must expose the same action. Report missing
states only where the component or task requires them.

Return the resolved scope, affected surfaces, classified findings, and
unverified coverage through the existing [audit result](design-audit.md#result).
Source inspection can establish implementation defects. To make a claim about
appearance, inspect the affected rendered interface. If the user also requested
fixes, continue with corrections within the requested scope.

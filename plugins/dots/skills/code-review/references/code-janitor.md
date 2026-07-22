# Code Janitor

Run a periodic cleanup pass over recently landed work and the product surfaces
it materially changed. Improve internal code health without changing the
product. Implement safe cleanup; flag product changes for the user.

## Select The Window And Surfaces

1. Resolve the repository's current default branch and inspect the PRs or
   commits merged during the requested period. Prefer remote merge metadata when
   available; otherwise use the default branch's first-parent history.
2. Group the landed work by product surface, subsystem, or stable owner. Include
   direct callers, tests, and shared policies needed to judge each group.
3. Select surfaces with concentrated or consequential work: a substantial
   feature, several related changes, repeated fixes, new state or APIs, or a
   cross-cutting implementation that creates meaningful cleanup potential.
4. Give isolated small changes a light scan. Skip them when there is no concrete
   signal of duplication, unnecessary machinery, ownership drift, or avoidable
   work. Record the reason instead of manufacturing a cleanup task.

Keep coverage bounded. A weekly pass should usually choose the few highest-
leverage surfaces, not turn into an uncapped repository audit.

## Use Subagents For Breadth

When subagents are available, assign one bounded owner per selected surface or
independent task. Give each reviewer the landed commits or PRs, governing
requirements, changed paths, allowed surrounding paths, and report-or-edit
boundary.

Each surface reviewer applies Reuse Review, Quality Review including the Over-
Engineering Scan and Code Judo, and Efficiency Review. Add one cross-surface
reviewer for canonical ownership, duplicated policy, or architecture only when
the landed work crosses owners. Run independent reviewers concurrently. The
parent verifies every candidate and owns final scope, product classification,
integration, validation, and publication.

Do not create three reviewers for every surface merely to preserve lane names.
Preserve the three lenses, not unnecessary coordination.

## Apply The Product-Preserving Gate

Apply every Confirmed, worthwhile improvement when all observable product
behavior and governing contracts remain unchanged and the result can be
validated. Product behavior includes user-visible output and interaction plus
external, persistence, concurrency, ordering, timing, error, and accessibility
semantics.

Usually safe after verification:

- delete unused private fields, branches, wrappers, helpers, tests, or data;
- replace duplicate internal behavior with its existing canonical owner;
- derive redundant state instead of storing or synchronizing it;
- remove pass-through abstractions, repeated queries, scans, or conversions;
- narrow internal APIs and collapse machinery that protects no reachable state;
- simplify recently added implementation detail while retaining exact inputs,
  outputs, side effects, ordering, errors, motion, and accessibility behavior.

Report instead of editing when the improvement would change or might change:

- layout, controls, navigation, gestures, animation, transitions, copy, or
  accessibility behavior;
- which states or actions exist, when they occur, or how the user reaches them;
- persisted data, external APIs, synchronization, concurrency, timing, failure
  behavior, or another governing product contract; or
- an intentional product capability merely because a different interaction
  would require less code.

For example, a custom horizontal drag control may contain substantial state,
gesture, and animation code. Replacing it with a list or different reorder
interaction changes the product. Flag the opportunity and its likely reduction;
do not implement it without user approval.

When product preservation is uncertain, classify the candidate as `Needs
verification`, name the decision or proof required, and leave the code alone.
Do not use test success as proof that an untested product interaction is
unchanged.

## Implement And Publish Safe Cleanup

Work from the current default branch in an isolated task branch or worktree.
Keep one implementation owner and use delegated writes only for disjoint scopes.
Prefer one coherent cleanup theme per branch or PR. If several safe findings do
not form a reviewable change, implement the highest-leverage coherent set and
report the remainder.

Use the repository's owning tests for each changed invariant and its required
final gate at the normal ready boundary. Inspect the final diff against the
landed-work window and rerun the responsible Simplify review after material
edits.

Publish only when the user or invoking workflow authorizes publication. Follow
repository branch, commit, validation, and draft-versus-ready rules. A safe
cleanup PR must contain no flagged product change, unrelated working-tree state,
or speculative refactor.

If nothing clears the product-preserving and value gates, make no source change
and publish no branch. Return the scan result and any product decisions worth
considering.

## Return

Lead with the outcome, then report:

- landed-work window and evidence source;
- selected surfaces and why they warranted review;
- lightly scanned or skipped surfaces and why;
- safe cleanup implemented, with behavior-preservation evidence;
- product-changing opportunities left for user decision;
- validation, residual risk, and branch or PR state; and
- a positive-null result when no cleanup was worth publishing.

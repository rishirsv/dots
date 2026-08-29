# Test Consolidation

Read this when a refactor candidate changes test placement, adds coverage, removes coverage, or consolidates duplicate tests.

Purpose: preserve regression signal, not test count. Prove each durable invariant once at the layer or verification surface that truthfully owns it.

Definitions:

- Invariant: the rule that must stay true.
- Owning layer: the lowest layer that truly owns and can prove that rule.
- Canonical suite: the normal existing suite for that owning layer.

Default: reuse an existing canonical suite. Do not create a new standalone regression test unless the exception rule below allows it.

## Gate 0: Should This Test Exist?

Before choosing test APIs or placement:

1. Name the durable invariant and its owning layer.
2. Name the plausible regression and resulting user or system harm.
3. Search for an existing test or other proof that already owns it.
4. Prefer static analysis, rendered evidence, or manual platform verification when those prove the invariant more truthfully than an automated test.
5. Reject coverage that requires broad fakes or repeats the same invariant at another layer.
6. Before deleting a mixed suite, inventory its privacy, persistence, concurrency, retry, lifecycle, and external-system contracts.

## Hard Rules

- Identify the invariant before adding or moving any test.
- Identify one primary owning layer: unit, integration, or end-to-end.
- First try to place coverage in an existing canonical suite for that layer.
- Prefer editing an existing test file over creating a new test file.
- Do not add the same invariant in multiple layers unless each layer covers a different failure mode. If keeping more than one layer, name the distinct failure mode for each.
- Do not add tests that lock in implementation details unless that implementation unit itself owns the invariant.
- Do not create a standalone regression test because it is faster or easier.
- If the invariant and owning layer cannot be named, stop and report that placement is not justified.

## Regression Signal

Review changed tests for regression signal rather than test count. Reconsider:

- a test double that computes the production outcome;
- exact copy, style, haptic, or timing assertions without an external contract;
- assertions about repository or collaborator calls when the durable result can be asserted;
- a new test file created only to mirror a new production symbol; and
- test-only launch flags, hooks, or fixtures without a current owner and removal condition.

## Required Decision Order

Choose the first option that fits:

1. Add to an existing test in an existing file in the owning layer.
2. Add a new test to an existing canonical file in the owning layer.
3. Create a new file inside the existing canonical suite in the owning layer.
4. Create a standalone regression-style test only if the exception rule passes.

## Owning Layer Rules

Choose unit when:

- one module owns the rule, and
- the bug reproduces without I/O, transport, persistence, retries, IPC, orchestration, or lifecycle coupling.

Choose integration when:

- the rule lives at a boundary between components, or
- the bug depends on serialization, persistence, ordering, replay, retries, IPC, process lifecycle, or multi-component coordination.

Choose end-to-end only when:

- the user-visible contract cannot be trusted from lower-layer tests alone.

Tie-breakers:

- If torn between unit and integration, choose integration.
- Never choose end-to-end to compensate for uncertainty.
- Never choose a higher layer just because it is easier to reproduce there.

## Exception Rule For Standalone Regression Tests

A standalone regression-style test is allowed only if all are true:

- no existing canonical suite can express the case cleanly
- the reproduction is deterministic
- the case has durable incident or contract value
- adding it to the canonical suite would make that suite less clear

If any condition is false, fold the coverage into the canonical suite.

## Duplicate Cleanup

After placing coverage:

1. Search for tests that assert the same invariant.
2. Keep the strongest owned location.
3. Merge any unique assertions into that location.
4. Delete or simplify weaker duplicates.
5. Rename tests by behavior and owner, not by ticket number or bug history.

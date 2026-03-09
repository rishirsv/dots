# Net Debt Reference Rewrite Plan

## Summary

Remove the stale `docs/dev/SECTION-CONTRACT-PATTERN.md` document, clean any remaining references to it, and rewrite `skill/kpmg-fdd/references/net-debt.md` from scratch using the net debt corpus writeups and the Business Overview rewrite family as the structural benchmark.

## Diagnosis

- The prior net debt rewrite was anchored to an outdated development pattern that should no longer exist in the repo.
- The current `net-debt.md` structure is therefore inconsistent with the modern reference set, especially `business-overview.md`.
- The corpus writeups show a repeatable net debt rhythm of `overview / position bridge -> scope and definitions -> schedule framing -> item-by-item treatment -> closing / other considerations`, which should drive the new contract.
- The section still needs a net-debt-specific primitive, but that primitive should live inside the same top-level reference shape used by other rewritten section references.

## Phase outcomes

### Phase 1: Reset the source of truth

This phase removes the outdated development pattern so the rewrite is not anchored to a stale document or stale assumptions.

### Phase 2: Rebuild the net debt contract shape

This phase gives the net debt reference the same rewrite-family structure as Business Overview while keeping the net-debt-specific analytical job intact.

### Phase 3: Teach the corpus pattern clearly

This phase turns the corpus findings into reusable authoring guidance, local units, assembly patterns, and examples that match how real net debt sections are written.

### Phase 4: Validate and close out

This phase confirms the stale pattern is gone, the new structure is internally consistent, and the plan and follow-up notes match the final implementation.

## Implementation checklist

- [x] 1.0 Reopen this plan in `docs/exec-plans/active/` and rewrite it to match the corrected scope
- [x] 1.1 Delete `docs/dev/SECTION-CONTRACT-PATTERN.md`
- [x] 1.2 Remove or rewrite any references to `SECTION-CONTRACT-PATTERN.md`
- [x] 1.3 Confirm the corpus and corpus-derived writeups are the primary evidence base for the new net debt contract
- [x] 2.0 Replace the current `net-debt.md` structure completely
- [x] 2.1 Rebuild `net-debt.md` into the same top-level reference family as `business-overview.md`
- [x] 2.2 Define the net-debt-specific analytical workflow from the corpus rather than from inherited template logic
- [x] 2.3 Define required and optional blocks using explicit trigger rules grounded in the corpus writeups
- [x] 2.4 Define local authoring units for net debt such as schedule framing, scope notes, treatment units, closing mechanics notes, and contingent-item notes
- [x] 3.0 Add corpus-grounded assembly patterns for simple, schedule-backed, and deal-mechanics-heavy net debt sections
- [x] 3.1 Rewrite section-specific writing guidance so it reflects the corpus and does not duplicate global rules
- [x] 3.2 Add integrated verification checks aligned to the new structure
- [x] 3.3 Add full examples that reflect corpus-backed net debt patterns and exclude extraction artifacts
- [x] 4.0 Validate the rewrite against `docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md` and `docs/net-debt-guidance.md`
- [x] 4.1 Run targeted text checks for stale pattern references and obsolete headings
- [x] 4.2 Remove or update any outdated follow-up items that no longer match the final contract shape
- [x] 4.3 Sync this plan to the work actually performed
- [x] 4.4 Move this plan to `docs/exec-plans/completed/net-debt-reference-rewrite-plan.md`

## Notes

- The structural benchmark is `skill/kpmg-fdd/references/business-overview.md`.
- The primary evidence sources are `docs/report-mining/section-corpus/sections/net-debt-and-debt-like-items.md` and `docs/net-debt-guidance.md`.
- The rewrite should preserve net-debt-specific logic while removing the stale development-pattern dependency entirely.
- Validation completed by rereading the rewritten reference, confirming the deleted development doc no longer exists, checking that the workflow doc no longer points to it, and verifying the rewritten net debt file no longer contains the discarded playbook-style headings.
- The net debt follow-up item in `TODOS.md` was updated so it matches the new contract shape instead of the discarded one.

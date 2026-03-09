# Historical Performance Reference Rewrite Plan

## Summary

Rewrite `skill/kpmg-fdd/references/historical-financial-performance.md` into a consolidated modern section contract that reflects actual skill usage: the agent usually receives a user-supplied P&L or adjacent slide exhibit and writes the narrative that sits beside it. Retire `skill/kpmg-fdd/references/income-statement.md` as a standalone active contract and fold its useful line-item, reconciliation, and comparability logic into the historical-performance reference as optional deep-dive guidance.

## Phase outcomes

### Phase 1: Save and scope the implementation

This phase creates the required execution-plan artifact and locks the work to the historical-performance rewrite plus the routing updates needed to retire the standalone income-statement contract cleanly.

### Phase 2: Rebuild the section contract

This phase replaces the old slot-first historical-performance reference with a corpus-grounded contract that defaults to text beside a user-supplied exhibit rather than exhibit generation.

### Phase 3: Consolidate the deep-dive guidance

This phase merges the useful income-statement mechanics into optional deep-dive blocks inside the historical-performance contract, so one section can handle both standard and detailed P&L commentary without forcing the detailed path every time.

### Phase 4: Validate and close out

This phase checks that stale standalone routing is removed, the new contract matches corpus behavior, and the plan record reflects the work actually completed before moving the file to `completed/`.

## Implementation checklist

- [x] 1.0 Save the accepted plan to `docs/exec-plans/active/historical-performance-reference-rewrite-plan.md`
- [x] 1.1 Confirm the implementation scope covers the historical-performance contract, retirement of the standalone income-statement contract, and the routing docs that point to the active section contracts
- [x] 1.2 Use the accepted rewrite plan and reviewed corpuses as the implementation source of truth
- [x] 2.0 Replace the current slot-first structure in `skill/kpmg-fdd/references/historical-financial-performance.md`
- [x] 2.1 Rebuild the file into the same modern rewrite family used by the already rewritten section references
- [x] 2.2 Make the default authoring model `text beside user-supplied exhibit`
- [x] 2.3 Make `Overview` and `Key Drivers / P&L commentary` the mandatory blocks
- [x] 2.4 Define optional blocks for exhibit framing, line-item deep dive, reconciliation, classification/comparability, segment/entity breakout, and supplemental schedule requests
- [x] 2.5 Keep exhibit generation explicitly optional and non-default
- [x] 2.6 Add corpus-grounded analytical units, assembly patterns, integrated verification checks, and full examples aligned to the adjacent-exhibit workflow
- [x] 3.0 Retire `skill/kpmg-fdd/references/income-statement.md` as an active standalone contract
- [x] 3.1 Update `skill/kpmg-fdd/references/INDEX.md` so the active reference list no longer advertises a separate income-statement contract
- [x] 3.2 Update nearby routing/taxonomy docs so `Income Statement` is no longer a separate active contract and instead routes into historical performance where appropriate
- [x] 3.3 Update corpus-builder and validation source configs so future routing reflects the consolidated taxonomy
- [x] 4.0 Validate the rewrite against `docs/report-mining/section-corpus/sections/historical-financial-performance.md` and `docs/report-mining/section-corpus/sections/income-statement.md`
- [x] 4.1 Run targeted text checks for stale slot-era headings, active standalone `income-statement` references, exhibit-first defaults, and extraction-artifact phrases
- [x] 4.2 Sync this plan to the work actually completed
- [x] 4.3 Move this plan to `docs/exec-plans/completed/historical-performance-reference-rewrite-plan.md`

## Notes

- The default contract should assume the user provides or separately pastes the P&L exhibit from Excel or an existing slide.
- The new contract should teach the agent to interpret and write against that exhibit rather than recreate it.
- Optional exhibit-generation guidance should remain available for explicit requests or cases where the section would otherwise be unusable.
- Extraction-artifact phrases such as `Not present in source report` and `did not extract` should not appear as live contract language.
- Validation completed by running Python syntax checks on the updated corpus-routing scripts and targeted searches for stale standalone `income-statement` references and old exhibit-first phrasing.

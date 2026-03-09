# Net Working Capital Reference Rewrite Plan

## Summary

Rewrite `skill/kpmg-fdd/references/net-working-capital.md` using `docs/dev/SECTION-REFERENCE-REWRITE-WORKFLOW.md`, with the same top-level rewrite family as `business-overview.md` and `net-debt.md`, but with a net-working-capital-specific primitive drawn from the corpus: `definition table + normalization bridge + adjustment rationale cards`, with driver and peg commentary added only when triggered by evidence.

## Phase outcomes

### Phase 1: Lock the contract shape

This phase replaces the current slot-first structure with the same durable reference shape used by the rewritten section contracts, so the NWC file feels consistent with the modern reference set.

### Phase 2: Rebuild the NWC authoring model

This phase teaches the section as a bridge-centered working-capital analysis rather than as a render skeleton or mandatory exhibit pack.

### Phase 3: Make the contract teachable

This phase adds local units, trigger-based assembly patterns, and examples that help future drafting stay close to the corpus.

### Phase 4: Validate and close out

This phase confirms the new structure removed the old slot-era logic, stayed grounded in the corpus and guidance writeups, and leaves follow-up items recorded only where they are actually needed.

## Implementation checklist

- [x] 1.0 Save the accepted plan to `docs/exec-plans/active/net-working-capital-reference-rewrite-plan.md`
- [x] 1.1 Confirm the rewrite is scoped to `skill/kpmg-fdd/references/net-working-capital.md` plus required plan and closeout artifacts only
- [x] 1.2 Use `docs/dev/SECTION-REFERENCE-REWRITE-WORKFLOW.md` as the process source of truth
- [x] 2.0 Replace the current slot-first heading structure in `net-working-capital.md`
- [x] 2.1 Rebuild the file into the same top-level rewrite family as `business-overview.md` and `net-debt.md`
- [x] 2.2 Define the section around the bridge-centered exhibit contract: position unit, definition unit, bridge unit, adjustment rationale unit, driver unit, and target-status unit
- [x] 2.3 Set required blocks to `NWC position and basis`, `Definition and scope`, `NWC schedule and normalization bridge`, `Adjustments and normalization logic`, and `Target / peg status`
- [x] 2.4 Set `Working-capital drivers and seasonality`, `Days analysis`, `Pro forma impact`, `Other considerations`, `Snapshot-only limitation`, and `Sell-side reliance / what changed from seller analysis` as explicit optional blocks with trigger rules
- [x] 2.5 Remove renderer-era slot taxonomy, row-count rules, rigid render skeleton sections, split-policy sections, and pre-invented mistakes sections
- [x] 3.0 Ground the rewrite in `docs/report-mining/section-corpus/sections/working-capital.md`, `docs/report-mining/section-corpus/adjustments/working-capital-adjustments-library.md`, and `docs/net-working-capital-guidance.md`
- [x] 3.1 Carry forward corpus patterns: quantified opening, cause-and-effect driver commentary, numbered adjustments with treatment and rationale, and target / peg discussion only when evidence supports it
- [x] 3.2 Strip extraction artifacts and malformed corpus residue from the new reference
- [x] 3.3 Keep the new reference semantic and exhibit-first rather than slot-first for downstream transformability
- [x] 3.4 Add inline micro-examples inside local units and two full examples at the end
- [x] 4.0 Validate the rewrite against the planned scenarios
- [x] 4.1 Run targeted text checks for obsolete slot-era headings and extraction-artifact phrases
- [x] 4.2 Add a deferred post-testing follow-up to `TODOS.md` only if needed
- [x] 4.3 Sync this plan to the work actually performed
- [x] 4.4 Move this plan to `docs/exec-plans/completed/net-working-capital-reference-rewrite-plan.md`

## Notes

- Use the same top-level rewrite family as `business-overview.md`, per the accepted plan.
- Scope is limited to the reference rewrite itself plus the required exec-plan lifecycle and any `TODOS.md` follow-up only if testing reveals a real deferred issue.
- Use one merged `Verification and review checks` section rather than separate preflight and split-policy sections.
- Do not add a local mistakes section in v1; defer it until testing reveals recurring NWC-specific failure modes.
- Treat `Target / peg status` as a required block, but allow it to explicitly state that no target basis or value was provided.
- Validation completed by rereading the rewritten reference, confirming the old slot-era headings were removed, and checking that extraction-artifact phrases do not appear as live contract content.
- A deferred post-testing follow-up was added to `TODOS.md` for possible NWC-specific mistakes handling after live drafting or realistic dry runs.

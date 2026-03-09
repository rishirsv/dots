## Reporting Environment Reference Rewrite Plan

### Summary

Rewrite `skill/kpmg-fdd/references/reporting-environment.md` using `docs/dev/SECTION-REFERENCE-REWRITE-WORKFLOW.md`, with the same top-level rewrite family as `business-overview.md`, `net-working-capital.md`, `net-debt.md`, and `balance-sheet.md`, but with a reporting-environment-specific authoring model drawn from the corpus: `reporting-basis and assurance view + close-discipline notes + systems/manual-dependency notes + accounting-policy watchlist + comparability implications`, with framework conversion and information-quality limitation blocks added only when triggered by evidence.

Once implementation is complete, validate the rewrite, sync this checklist to what was actually done, and move the plan to `docs/exec-plans/completed/reporting-environment-reference-rewrite-plan.md`.

### Phase Outcomes

#### Phase 1: Ground the rewrite in the corpus

Outcome: We identify what real reporting-environment sections actually cover, which current template blocks are over-prescriptive, and which recurring patterns are strong enough to preserve.

#### Phase 2: Rebuild the reporting-environment contract

Outcome: The reference becomes easier to draft from, aligned with the newer section family, and focused on the real diligence job of explaining reporting confidence and comparability.

#### Phase 3: Validate the new contract and note deferred follow-up

Outcome: The rewritten section is structurally clean, evidence-led, and any genuinely deferred post-testing work is recorded clearly.

#### Phase 4: Close out the execution record

Outcome: The repo has a completed plan that matches the work actually performed.

### Key Changes

#### Contract shape

Replace the current slot-first reporting-environment structure (`Writing guidance`, `Layout`, `Available slot shapes`, `Render skeleton`, `Common mistakes`, `Structural preflight rules`, `Split policy rules`) with the same top-level structure used by the rewritten references:

- `Table of contents`
- `Section objective`
- `Core principles`
- `Analytical workflow`
- `Section architecture`
- `Available analytical units`
- `Assembly patterns`
- `Section-specific writing guidance`
- `Verification and review checks`
- `Full examples`

Do not retain renderer-era slot taxonomy, fixed table expectations, or rigid render-skeleton sections.

#### Reporting-environment-specific authoring model

Define the section around these local units:

- `basis-and-assurance note`: framework, entity coverage, audit or review status, and the main implication for reliance
- `close-discipline note`: close cadence, key estimate timing, reviewer ownership, and where interim versus year-end differences matter
- `systems-and-flow note`: primary systems, reporting stack, and the most relevant integration or manual-dependency fact
- `manual-dependency note`: concise explanation of recurring MJEs, mapping overrides, or year-end-only adjustments that affect confidence or comparability
- `policy-watchlist unit`: one company-specific policy or estimate topic, its current treatment, and the potential financial statement effect
- `framework-conversion note`: local-GAAP-to-IFRS, ASPE-to-IFRS, or presentation-basis bridge when it materially affects comparability
- `comparability note`: explicit statement of how reporting architecture or policy application should affect QoE, NWC, net debt, or trend analysis
- `limitation note`: meaningful constraint on what the available reporting environment evidence supports

#### Required vs optional blocks

Set the `Section architecture` to use these required blocks:

- `Reporting basis and assurance perimeter`
- `Close process and reporting cadence`
- `Systems, data flow, and manual dependencies`
- `Accounting policy and estimate watchlist`
- `Comparability implications for diligence analysis`

Set these as optional, trigger-based blocks only:

- `Framework conversion or presentation bridge`
- `Information-quality and scope limitations`
- `Finance-function ownership and resourcing`

Use explicit activation rules and the inverse rule: do not include an optional block just because the source mentions it.

#### Corpus-grounded content rules

Base the rewrite on:

- `docs/report-mining/section-corpus/sections/reporting-environment.md`
- the current reporting-environment reference only as a source of legacy intent, not structure
- adjacent rewritten references for family alignment

Carry forward the strong corpus patterns:

- explicit framework and assurance labeling by entity or reporting layer
- close-process timing and ownership where it affects reliance
- systems architecture paired with manual journal or mapping dependency
- company-specific policy or estimate watchlist only where there is a real transition, estimate hotspot, or year-end-only true-up
- explicit comparability and information-quality implications for diligence analysis

Strip corpus artifacts and avoid reproducing:

- `Not present in source report`
- generic FDD disclaimer boilerplate that does not change section interpretation
- textbook accounting-standard summaries with no company-specific conclusion
- open-ended recommendations to "gain comfort" as live contract content

### Test Plan

Validate the rewrite against these scenarios:

- Straightforward audited single-framework case with a short close-process and systems discussion
- Mixed-assurance case where some entities are audited and others are management-prepared
- Framework-transition case where adoption of IFRS / TFRS for PAEs / ASC 606 / lease rules changes comparability or understates liabilities under the current basis
- Manual-journal-heavy case where close quality depends on recurring MJEs, suspense clearing, or quarterly estimate bookings
- Mapping-conversion case where system changes or chart-of-account changes require explicit bridge logic
- Year-end-only-adjustment case where certain accruals or policy entries are only updated annually and reduce interim comparability
- Information-limitation case where YTD management accounts are unaudited or only partially available
- Extraction-artifact check to ensure no slot-language, template-era sections, or `Not present` artifacts survive
- Structural diff check confirming the old slot/skeleton headings are removed and the new file matches the rewrite family used by adjacent references

### Assumptions and Defaults

- Use the same top-level rewrite family as the recently rewritten section references.
- Scope includes the reporting-environment rewrite, the required exec-plan lifecycle, and a `TODOS.md` follow-up only if there is a real deferred post-testing need.
- Use inline micro-examples inside analytical units plus two full examples at the end.
- Use one merged `Verification and review checks` section rather than separate preflight and split-policy sections.
- Do not add a local `Common mistakes` section in v1; defer it until testing reveals recurring reporting-environment-specific drafting failures.

### Implementation Checklist

- [x] 1.0 Save the accepted plan
  - [x] 1.1 Create `docs/exec-plans/active/reporting-environment-reference-rewrite-plan.md`
  - [x] 1.2 Confirm the plan reflects the reporting-environment rewrite scope
  - [x] 1.3 Validation for 1.0: plan exists in the active plans folder

- [x] 2.0 Rewrite the reporting-environment reference
  - [x] 2.1 Replace the old slot-first structure in `skill/kpmg-fdd/references/reporting-environment.md`
  - [x] 2.2 Rebuild the section around reporting-basis, close-discipline, systems, watchlist, and comparability units
  - [x] 2.3 Add inline micro-examples and full examples consistent with the new model
  - [x] 2.4 Validation for 2.0: reread the file for internal consistency and family alignment

- [x] 3.0 Validate deferred follow-up need
  - [x] 3.1 Run targeted text checks for obsolete slot-era headings and extraction artifacts
  - [x] 3.2 Decide whether post-rewrite testing follow-up should be captured in `TODOS.md`
  - [x] 3.3 Validation for 3.0: repo state reflects the rewrite and any warranted follow-up note

- [x] 4.0 Close out the plan
  - [x] 4.1 Sync the checklist to the work actually completed
  - [x] 4.2 Move the plan to `docs/exec-plans/completed/reporting-environment-reference-rewrite-plan.md`
  - [x] 4.3 Validation for 4.0: completed plan exists in the completed plans folder

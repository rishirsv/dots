## Balance Sheet Reference Rewrite Plan

### Summary

Rewrite `skill/kpmg-fdd/references/balance-sheet.md` using `docs/dev/SECTION-REFERENCE-REWRITE-WORKFLOW.md`, with the same top-level rewrite family as `business-overview.md`, `net-working-capital.md`, and `net-debt.md`, but with a balance-sheet-specific authoring model drawn from the corpus: `headline position + balance-sheet schedule + caption walkthrough units`, with optional blocks for estimate-sensitive captions, related-party and perimeter distortions, financing and encumbrance context, reconciliation status, and comparability implications only when triggered by evidence.

At the same time, remove `skill/kpmg-fdd/references/quality-of-net-assets.md` from the active reference set because the user wants balance sheet to carry forward and QofNA to be deleted rather than rewritten.

Once implementation is complete, validate the rewrite, sync this checklist to what was actually done, and move the plan to `docs/exec-plans/completed/balance-sheet-reference-rewrite-plan.md`.

### Phase Outcomes

#### Phase 1: Ground the rewrite in the corpus

Outcome: We establish what strong balance-sheet sections actually do, which optional patterns are real, and which older template rules should be discarded.

#### Phase 2: Rebuild the balance-sheet contract

Outcome: The reference becomes easier to draft from and aligns with the newer rewrite family, while still preserving the real analytical job of a balance-sheet section.

#### Phase 3: Remove QofNA from the active reference set

Outcome: The router and reference inventory match the new direction, with no stale QofNA contract left behind.

#### Phase 4: Validate and close out

Outcome: The rewrite is structurally clean, obsolete headings are gone, and the plan record reflects the work that was actually completed.

### Key Changes

#### Contract shape

Replace the current slot-first balance-sheet structure (`Writing guidance`, `Layout`, `Available slot shapes`, `Render skeleton`, `Common mistakes`, `Structural preflight rules`, `Split policy rules`) with the same top-level structure used by the rewritten references:

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

Do not retain renderer-era slot taxonomy, row-count instructions, or rigid render-skeleton sections.

#### Balance-sheet-specific authoring model

Define the section around a schedule-backed caption walkthrough with these local units:

- `position unit`: total assets, total liabilities, equity / NAV position, date anchor, and major directional movement
- `schedule framing unit`: short line introducing the main balance-sheet exhibit and its basis
- `caption walkthrough unit`: quantified explanation of one major asset, liability, or equity caption and the driver of movement
- `classification note`: explanation of related-party, restricted, deferred, or otherwise non-obvious classification treatment
- `estimate-sensitivity note`: explanation of captions affected by allowances, ECL, provisions, annual-only true-ups, or management estimates
- `financing and encumbrance note`: collateral, guarantees, maturity, repayment, or covenant-style facts that change interpretation of liquidity or deal mechanics
- `comparability note`: policy, timing, perimeter, or reporting-basis issue that changes how a trend should be interpreted
- `reconciliation-status note`: statement of whether the section is based on audited, management, or trial-balance reporting and whether bridges were completed

#### Required vs optional blocks

Set the `Section architecture` to use these required blocks:

- `Balance-sheet position and basis`
- `Balance-sheet schedule and composition`
- `Assets and operating-current-items walkthrough`
- `Liabilities, financing, and equity walkthrough`

Set these as optional, trigger-based blocks only:

- `Estimate-sensitive or unusual captions`
- `Related-party and perimeter considerations`
- `Financing profile and encumbrance context`
- `Reconciliation to source reporting`
- `Comparability implications for diligence analysis`
- `Snapshot-only limitation`

Use explicit activation rules and the inverse rule: do not include an optional block just because the source mentions it.

#### Corpus-grounded content rules

Base the rewrite on:

- `docs/report-mining/section-corpus/sections/balance-sheet.md`
- the current balance-sheet reference only as a source of legacy intent, not structure
- adjacent rewritten references for family alignment

Carry forward the strong corpus patterns:

- quantified, period-anchored opening
- schedule-first framing
- caption-level movement explanations rather than generic commentary
- clear treatment of related-party balances, restricted cash, advances, deposits, deferred / unearned revenue, and estimate-sensitive captions when relevant
- explicit mention of collateral, guarantees, repayment profile, or encumbrances when they change liquidity or transaction interpretation
- comparability notes where balances are annual-only adjusted, cash-basis recorded, or otherwise not directly comparable

Strip corpus artifacts and avoid reproducing:

- `Not present in source report`
- extraction-policy language
- malformed placeholders or ellipsis-truncated text
- generic requests for further diligence as live contract content

#### Reference-set cleanup

Delete:

- `skill/kpmg-fdd/references/quality-of-net-assets.md`

Update the router so it no longer points to QofNA:

- `skill/kpmg-fdd/references/INDEX.md`

### Test Plan

Validate the rewrite against these scenarios:

- Simple section with one schedule plus a short current-assets and liabilities walkthrough
- Negative NAV / going-concern case where the opening must describe the deficit position and liquidity implication without turning into a risk register
- Related-party-heavy case where receivables, loans, and payables distort the operating reading of the balance sheet
- Education / deferred-revenue case where unearned revenue timing and annual true-ups matter materially
- Asset-heavy case with collateral, insurance coverage, or encumbrance context affecting interpretation
- Estimate-sensitive case where provisions, ECL, allowances, or annual-only depreciation / EBO updates must be called out
- Reconciliation case where the balance sheet is tied to management, audited, or trial-balance bases with explicit bridge status
- Extraction-artifact check to ensure no `Not present`, slot-language, or old template sections survive
- Structural diff check confirming the old slot/skeleton headings are removed and the new file matches the rewrite family used by adjacent references

### Assumptions and Defaults

- Use the same top-level rewrite family as `business-overview.md`, `net-working-capital.md`, and `net-debt.md`.
- Scope includes the balance-sheet rewrite, deletion of QofNA, router cleanup, and any `TODOS.md` follow-up only if validation reveals a real deferred issue.
- Use inline micro-examples inside analytical units plus two full examples at the end.
- Use one merged `Verification and review checks` section rather than separate preflight and split-policy sections.
- Do not add a local `Common mistakes` section in v1; defer it until testing reveals recurring balance-sheet-specific drafting failures.

### Implementation Checklist

- [x] 1.0 Save the accepted plan
  - [x] 1.1 Create `docs/exec-plans/active/balance-sheet-reference-rewrite-plan.md`
  - [x] 1.2 Confirm the plan reflects the balance-sheet rewrite plus QofNA removal
  - [x] 1.3 Validation for 1.0: plan exists in the active plans folder

- [x] 2.0 Rewrite the balance-sheet reference
  - [x] 2.1 Replace the old slot-first structure in `skill/kpmg-fdd/references/balance-sheet.md`
  - [x] 2.2 Rebuild the section around corpus-led balance-sheet analytical units and trigger-based optional blocks
  - [x] 2.3 Add inline micro-examples and full examples consistent with the new model
  - [x] 2.4 Validation for 2.0: reread the file for internal consistency and family alignment

- [x] 3.0 Remove QofNA from the active reference set
  - [x] 3.1 Delete `skill/kpmg-fdd/references/quality-of-net-assets.md`
  - [x] 3.2 Remove the QofNA entry from `skill/kpmg-fdd/references/INDEX.md`
  - [x] 3.3 Validation for 3.0: confirm no active router entry remains for QofNA

- [x] 4.0 Validate and close out
  - [x] 4.1 Run targeted text checks for obsolete slot-era headings and extraction artifacts
  - [x] 4.2 Sync the checklist to the work actually completed
  - [x] 4.3 Move the plan to `docs/exec-plans/completed/balance-sheet-reference-rewrite-plan.md`
  - [x] 4.4 Validation for 4.0: completed plan exists in the completed plans folder

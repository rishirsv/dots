# Playbook Validation Report

## Summary
- Patterns confirmed by real deals: 10
- Gaps in playbooks (not covered but found in deals): 6
- Playbook items not seen in sample deals: 3

Scope note: “Real deals” here focuses on the **true SPAs** in `reference/` (HealthEquity/Luum; TreeHouse; Newgistics; National Financial Services/Fiserv; Durata/Pfizer; Deutsche Telekom/AT&T). Public-company merger agreements were reviewed but are structurally different (fixed per-share price; no completion accounts).

Input note: `reference/analysis.md` appears to be a duplicate of the Durata/Pfizer analysis (same deal metadata and structure) and was treated as a duplicate to avoid double-counting patterns.

## Confirmed Patterns

| Playbook Guidance | Deals Confirming | Notes |
|-------------------|------------------|-------|
| Completion accounts EV bridge is typically: Base + Cash − Debt ± NWC − Transaction Expenses | HealthEquity/Luum; TreeHouse; Newgistics | Aligns with `dist/02-purchase-price.md` “Standard Completion Accounts Formula”. |
| Defined-term mismatches inside the price equation are a high-dispute-risk “bug” | TreeHouse | Confirms `dist/02-purchase-price.md` Step 3 (“Defined term alignment”). |
| Net Debt is often implicit (Cash and Indebtedness defined separately) rather than separately defined | HealthEquity/Luum; TreeHouse; Newgistics | Confirms `dist/02-purchase-price.md` watch-out: “Net Debt used but not defined”. |
| Overdraft/negative cash routing must be explicit (Cash vs Indebtedness) | TreeHouse; Newgistics; HealthEquity/Luum | Confirms `dist/02-purchase-price.md` Cash/Indebtedness red-flag guidance. |
| Restricted cash is commonly excluded or haircuted (or treated net-of-tax) | HealthEquity/Luum; TreeHouse | Confirms `dist/02-purchase-price.md` Cash Adjustment checklist. |
| True-up timelines cluster around 60–90 days (buyer prep) and 30–45 days (seller review), with deviations as negotiation leverage | HealthEquity/Luum; Newgistics; National Financial Services/Fiserv; Deutsche Telekom/AT&T; TreeHouse (deviation) | Confirms `dist/03-wc-net-debt.md` market benchmarks and red flags (“Buyer has unlimited time”; “Seller review period < 30”). |
| Independent Accountant scope is usually “disputed items only,” acting as an expert, with a binding determination | HealthEquity/Luum; TreeHouse; Newgistics; National Financial Services/Fiserv; Deutsche Telekom/AT&T | Confirms `dist/03-wc-net-debt.md` “Independent Accountant Scope” guidance. |
| Schedule-/exhibit-driven methodologies are common, but missing schedules are a gating diligence issue | HealthEquity/Luum; TreeHouse; Newgistics; National Financial Services/Fiserv; Deutsche Telekom/AT&T | Confirms `dist/01-definitions.md` “Verify GL account mapping” + “sample calculations” and the “missing schedules/exhibits” red flags. |
| Anti-duplication is often implemented via definition carve-outs (exclude Cash from WC; exclude Debt and Transaction Expenses from WC) | HealthEquity/Luum; TreeHouse; Newgistics | Confirms `dist/01-definitions.md` and `dist/02-purchase-price.md` anti-duplication sections and overlap checklists. |
| Escrow sizing varies by deal style (no-RWI ≈ 10% vs RWI ≈ 0.5% + separate adjustment escrow) | Newgistics; HealthEquity/Luum | Confirms `dist/02-purchase-price.md` escrow sizing benchmarks. |

## Gaps to Add to Playbooks

| Pattern Found | Deals | Suggested Addition |
|--------------|-------|-------------------|
| **Regulated “Net Capital” peg** as the purchase price adjustment driver (instead of NWC/net debt) | National Financial Services/Fiserv | Add a subsection to `dist/03-wc-net-debt.md` for “regulated metrics true-ups” (Net Capital/RBC), including schedule dependency risk and regulatory methodology lock. |
| **Free Cash Flow–based adjustment** replacing classic NWC peg in large strategic deals (plus divestiture economics) | Deutsche Telekom/AT&T | Add to `dist/02-purchase-price.md` “Other adjustments” examples: FCF adjustment; specified debt discharge schedule; divestiture adjustment line items; how to stress-test schedules/annexes. |
| **Explicitly non-binding illustrative schedules** (“illustrative only”) increase reclassification risk | TreeHouse | Add to `dist/03-wc-net-debt.md` hierarchy section: treat “illustrative only” schedules as a high-severity red flag; require binding schedules or a controlling principles attachment. |
| **Seller note as functional holdback / true-up settlement tool** (instead of escrow) | TreeHouse | Add to `dist/02-purchase-price.md` Escrow/Holdback section: “seller note/setoff mechanics” as an escrow substitute; list negotiation checks (cap, timing, setoff process). |
| **Milestone buyout + deferral via promissory note** (buyer option) creates material “what is consideration” ambiguity | Durata/Pfizer | Add to `dist/02-purchase-price.md` Consideration section and cross-reference `dist/04-earnouts.md`: define “Total Consideration” and clarify whether offsets/reverse payments are part of purchase price. |
| **Escrow release date misaligned with survival** can strand claims | Newgistics | Add to `dist/02-purchase-price.md` escrow red-flag language list: explicitly check escrow termination date vs survival/claim notice periods and state the fix (align or create reserve). |

## Items to Reconsider

| Playbook Guidance | Issue | Recommendation |
|-------------------|-------|----------------|
| Locked-box mechanics guidance | Not observed in the true-SPA sample set (this set is completion-accounts heavy) | Keep; label as “not validated by current sample.” |
| Guidance implying “Cash definition always present” in true SPAs | Several true SPAs in the sample do not use a Cash add-back construct (Net Capital / FCF / carve-out frameworks) | Modify `dist/01-definitions.md` Step 1 “core definitions” to note that Cash may be absent in non-EV-bridge structures. |
| “Past practice” hierarchy as universal | Some deals rely on schedule-driven “Applicable Accounting Principles” or allow GAAP overrides via schedules | Modify `dist/03-wc-net-debt.md` hierarchy section to explicitly include “schedule-driven principles” as a common alternative to “past practice.” |

## Specific Playbook Updates Recommended

### dist/01-definitions.md
- [ ] Modify: “core definitions that should always be present” to acknowledge alternative pricing structures (Net Capital, FCF, carve-out deals) where Cash/NWC/Txn Exp may be absent.
- [ ] Add: stronger warning that missing exhibits/schedules can defeat otherwise “market” definitions (and should be treated as a gating issue, not a minor red flag).

### dist/02-purchase-price.md
- [ ] Add: examples and checklists for FCF-based adjustments and divestiture adjustment mechanics (schedule dependency and dispute routing).
- [ ] Add: seller note / setoff as escrow substitute (true-up settlement mechanics).
- [ ] Add: escrow period misalignment with survival as a “must check” red flag (and the standard fix).
- [ ] Modify: add an explicit call-out that “Purchase Price” may exclude earnouts unless a “Total Consideration” construct is drafted.

### dist/03-wc-net-debt.md
- [ ] Add: a “Regulated metrics true-up” subsection (Net Capital/RBC) including schedule dependency and regulatory methodology lock.
- [ ] Add: explicit red flag for schedules that are “illustrative only” (non-binding), and the standard remediation (binding templates/principles).
- [ ] Modify: hierarchy section to treat schedule-driven accounting principles as a first-class pattern alongside “past practice.”

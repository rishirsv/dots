# SPA Knowledge-Base Extraction & Advisor Analysis  
**Document:** Stock Purchase Agreement (Execution Version) — Deutsche Telekom AG / AT&T Inc.  
**As-of:** January 23, 2026 (analysis date)  
**Source file:** DEUTSCHE TELEKOM AG.pdf (uploaded)

> **Important completeness note:** The SPA references multiple annexes and a Seller/Purchaser Disclosure Letter (including Schedule 2.3(a)(I) and (II)) that are **not included** in the provided PDF. Where calculations or inclusion/exclusion lists depend on those materials, this analysis flags the gap explicitly and treats it as a gating diligence/negotiation point.

---

## Part 1: Document Overview

### 1.1 Metadata

| Field | Value |
|---|---|
| Deal Name / Project Code | **NOT FOUND** (title only: “Stock Purchase Agreement”) |
| Execution Date | **March 20, 2011** (Cover; signature block) |
| Parties (Buyer / Seller) | **Buyer:** AT&T Inc. (“Purchaser”)  \n**Seller:** Deutsche Telekom AG (“Seller”) |
| Target Company / Business | **Target:** T‑Mobile USA, Inc. (the “Company”) (stock chain via Global/Holding).  \n**Business:** “marketing, selling and providing wireless telecommunication services… in the United States” (“Business”). |
| Jurisdiction / Governing Law | **New York** (Section 8.3) |
| Deal Type | **Strategic** (telecom operator acquisition) |
| Pricing Structure | **Completion accounts–style adjustments** (post‑closing true-up via Section 2.3). Not a classic NWC peg. |
| Consideration Type | **Cash + Stock** (plus post‑closing cash true-ups under 2.3(g)/(h) and possible divestiture proceeds under 2.3(i)) |
| R&W Insurance | **NOT FOUND** |
| Estimated Deal Value | **$39.0B “base” headline** implied by $25.0B cash + $14.0B stock value in the share formula; also used in indemnity cap math. |

### 1.2 Document Structure (key articles/sections)

> Page numbers below are **PDF page numbers**.

| Topic | Where (Article/Section) | PDF pages |
|---|---:|---:|
| Definitions | Article I (1.1, 1.2) | 5–19 |
| Purchase Price / Consideration | Article II (2.2) | 20–21 |
| Closing Mechanics | Article II (2.4) | 25 |
| Closing Statements / True-Up | Article II (2.3) | 21–25 |
| Escrows / Holdbacks | **NOT FOUND** |
| Earnout | **NOT FOUND** |
| Indemnification | Article VI (6.1–6.6) | 67–73 |
| Tax Allocation / Transfer Taxes | 8.13 + tax reps/covenants | 81 + 36–38 |
| Exhibits / Annexes | Exhibit A; Annexes A–F | Listed in TOC; **not included** |

---

## Part 2: Financial Definitions (Deep Extraction)

> **Instruction handling:** For each requested definition, this section provides (i) section reference, (ii) verbatim text (when present), (iii) plain‑English meaning, (iv) component checklist, (v) anti‑duplication, (vi) red flags, (vii) market position rating, and (viii) counsel questions + suggested revisions.

---

### 2.1 Purchase Price / Consideration

**Definition Name:** “Purchase Price” (and “Cash Consideration”, “Purchaser Shares”)  
**Section Reference:** Section 2.2(a)–(b) (PDF pp. 20–21)

**Full Verbatim Text (core purchase price):**
> “2.2. Payment at Closing. … at the Closing, Purchaser shall:  
> **(a)** pay to Seller an amount in cash equal to **$25,000,000,000.00** (the “Cash Consideration”);  
> **(b)** issue and deliver to Seller a number of shares of Purchaser’s Common Stock… equal to the quotient obtained by dividing **(i)** **$14,000,000,000.00**, plus **(A)** an amount (positive or negative) equal to the **Estimated Closing Free Cash Flow Adjustment Amount**, minus **(B)** the **Estimated Closing Discharged Indebtedness**, minus **(C)** the **Estimated Divestiture Adjustment Amount**, by **(ii)** the **Average Adjusted Closing Price** … (the “Purchaser Shares,” and, together with the Cash Consideration, the “Purchase Price”); … provided… any fractional shares shall be **rounded up** to the nearest whole share.”

**Plain-English Summary:**  
Headline consideration is fixed cash ($25B) plus a stock leg targeted at $14B of value **but adjusted** for (i) an interim free‑cash‑flow mechanism, (ii) specified “Closing Discharged Indebtedness,” and (iii) a divestiture adjustment. The initial equity issuance is based on **estimated** values, then cash true-ups are settled post‑closing based on the final closing statement/dispute process.

**Component Breakdown:**

| Component | Included? | Verbatim Language | Market Position | Notes |
|---|---:|---|---|---|
| Cash consideration | Yes | “$25,000,000,000.00 (the ‘Cash Consideration’)” | 🟢 | Fixed cash leg. |
| Stock consideration | Yes | “$14,000,000,000.00… divided by… Average Adjusted Closing Price” | 🟢 | Fixed-value style stock issuance with collar mechanics. |
| FCF adjustment | Yes | “plus… Estimated Closing Free Cash Flow Adjustment Amount” | 🟠 | Replaces classic NWC peg; telecom-specific. |
| Closing discharged indebtedness | Yes | “minus… Estimated Closing Discharged Indebtedness” | 🟠 | Depends on missing Schedule 2.3(a)(II) line items. |
| Divestiture adjustment | Yes | “minus… Estimated Divestiture Adjustment Amount” | 🟠 | Regulatory/antitrust economics; depends on missing Annexes. |
| Fractional shares | Yes | “rounded up” | 🟠 | Slight seller tilt (round up vs cash-in-lieu). |
| Anti-dilution equitable adjustment | Yes | “equitably adjusted…” (2.2(b) proviso) | 🟢 | Market for public-company stock consideration. |

**Anti-Duplication Language:**  
| Phrase | Present? | Exact Quote | Scope |
|---|---:|---|---|
| “without duplication” | No (in price clause) | — | — |
| “to the extent not included in” | No | — | — |
| “for the avoidance of doubt” | Yes (elsewhere) | Not in 2.2; appears in 2.1 and other sections | Not formula-level |
| Netting/set-off in true-up | Yes | “may be set off and netted…” (2.3(g)(iv)) | Formula-level for cash true-up only |

**Red Flag Language Identified:**  
| Phrase | Why it’s concerning | Severity |
|---|---|---:|
| “rounded up” | Systematic upward rounding transfers incremental value to Seller | Low |
| Use of “Estimated” for core share issuance | Creates economics driven by estimation methodology; dispute risk | Medium |
| Reliance on missing schedules/annexes | Critical calculation inputs not present in PDF | High |

**Overall Market Position Assessment:** 🟠 Slightly Off‑Market (deal-specific)  
**Reasoning:** The structure is coherent for a large, regulated telecom deal but is less “standard SPA” than cash‑free/debt‑free + NWC peg frameworks.

**Counsel Questions to Raise:**  
1. Confirm **what exactly** is in Schedule 2.3(a)(II) (debt line items) and 2.3(a)(I) (FCF line items) and whether they are exhaustive.  
2. Confirm whether the “round up” of fractional shares is acceptable or should be cash‑in‑lieu.  
3. Confirm whether “Average Trading Price” vs “Average Adjusted Closing Price” is used consistently (cash election uses Average Trading Price).

**Suggested Revisions (if negotiated):**  
- **Original:** “any fractional shares shall be rounded up…”  
- **Suggested:** “fractional shares shall be paid in cash in lieu, based on the Average Trading Price.”  
- **Rationale:** Removes systematic tilt without operational complexity.

---

### 2.2 Cash / Cash and Cash Equivalents

**Definition Name:** **NOT FOUND** (no standalone definition of “Cash” or “Cash and Cash Equivalents”)  
**Section Reference:** **NOT FOUND** (would usually be in Article I definitions or purchase price adjustment definitions)

**Full Verbatim Text:** NOT FOUND.

**Plain-English Summary:**  
This SPA does **not** operate as “cash‑free / debt‑free + NWC” with a separate “Cash” add-back. Instead, it uses (i) **Free Cash Flow** and a **Free Cash Flow Adjustment Amount**, and (ii) a **Minimum Cash Balance** covenant requiring at least $100,000,000 of consolidated cash at closing (Section 4.15).

**Cash checklist:** (not applicable; no definition)  
| Component | Included? | Notes |
|---|---:|---|
| Cash on hand, demand deposits | N/A | No cash add-back framework. |
| Cash equivalents | N/A | Same. |
| Restricted/trapped cash | N/A | Must diligence; could be material to “real cash” at close. |
| Deposits in transit / outstanding checks | N/A | Not specified; could affect minimum cash covenant compliance. |
| Overdraft netting | N/A | Not specified (gap). |

**Anti-Duplication:** NOT APPLICABLE.

**Red Flag:** Lack of a cash definition can create confusion and leave “cash-like” items un-routed. **Severity: Medium.**

**Overall Market Position:** 🟠 Slightly Off‑Market (relative to middle-market SPAs) but common in large strategic/regulatory deals that substitute other mechanisms.

**Counsel Questions:**  
1. Does “cash” in the Minimum Cash Balance covenant mean gross cash or net of overdrafts/restricted cash?  
2. Is restricted cash intended to count toward the $100M minimum?

**Suggested Revision:** Add a short definition of “Cash” solely for Section 4.15 compliance (gross, unrestricted, immediately available), to avoid disputes at closing.

---

### 2.3 Indebtedness / Debt

**Definition Name:** “Indebtedness”  
**Section Reference:** Article I definitions (PDF p.12)

**Full Verbatim Text:**
> “**‘Indebtedness’** shall mean **(i)** all liabilities for borrowed money, whether current or funded, secured or unsecured, all obligations evidenced by bonds, debentures, notes or similar instruments, and all liabilities in respect of mandatorily redeemable or purchasable capital stock or securities convertible into capital stock; **(ii)** all liabilities for the principal amount of the deferred and unpaid purchase price of real property and equipment that have been delivered; **(iii)** all liabilities in respect of any lease of (or other arrangement conveying the right to use) real or personal property… required to be classified and accounted for under GAAP as capital leases; **(iv)** all liabilities for the reimbursement of any obligor on any letter of credit… to the extent of the obligation secured; and **(v)** all liabilities as guarantor of obligations… to the extent of the obligation guaranteed.”

**Plain-English Summary:**  
This is a fairly robust “funded debt and debt-like” definition for 2011, capturing borrowed money, debt securities, capital-lease liabilities, LC reimbursement obligations, and guarantees, plus deferred purchase price for delivered real property/equipment. It still omits several items that modern SPAs often negotiate explicitly (accrued interest, breakage, swap termination, operating leases under ASC 842, pension deficits, factoring), so the economic protection depends heavily on the **Closing Discharged Indebtedness** line item schedule and payoff mechanics.

**Component Breakdown (Indebtedness checklist):**

| Component | Included? | Verbatim language | Market Position | Notes |
|---|---:|---|---|---|
| Borrowed money | Yes | “liabilities for borrowed money” | 🟢 | Core. |
| Notes/bonds/debentures | Yes | “bonds, debentures, notes…” | 🟢 | Core. |
| Convertible/mandatorily redeemable equity | Yes | “mandatorily redeemable… or securities convertible…” | 🟢/🟠 | Broader than some SPAs; buyer-friendly. |
| Deferred purchase price | Yes | “deferred and unpaid purchase price of real property and equipment” | 🟢 | Limited to delivered property/equipment. |
| Capital/finance leases | Yes | “classified… as capital leases” | 🟢 (2011) | Pre-ASC842: operating leases not captured. |
| Letters of credit | Yes | “reimbursement… letter of credit… to the extent of the obligation secured” | 🟢 | Not undrawn LCs per se; captures reimbursement liability. |
| Guarantees | Yes | “as guarantor…” | 🟢 | Limited to covered types. |
| Accrued interest | **Not explicit** | — | 🟠 | Should be clarified in payoff amounts / debt schedule. |
| Breakage/make-whole | Not explicit | — | 🟠 | Important if refinancing/payoff. |
| Bank overdrafts | Not explicit | — | 🟠 | Could sit in A/P; here no NWC peg. |
| Swap/hedge termination | Not explicit | — | 🟠 | Note: intercompany swaps must be terminated (4.11(a)). |
| Factoring/receivables | Not explicit | — | 🟠 | If exists, could be debt-like. |
| Pensions/retirement deficits | Not explicit | — | 🟠 | Could be large in other deals; less typical for telecom subsidiary. |
| Declared dividends | Not explicit | — | 🟢/🟠 | Addressed via covenants and FCF mechanics instead. |

**Anti-Duplication Language:** Not present in the definition.

**Red Flag Language Identified:**  
| Phrase | Why it’s concerning | Severity |
|---|---|---:|
| “capital leases” only | Operating leases not included (2011 accounting) | Medium |
| Missing explicit interest/breakage | May shift payoff costs to buyer unless captured elsewhere | Medium |

**Overall Market Position Assessment:** 🟢 Market Standard (for 2011) with some 🟠 modern gaps.  
**Counsel Questions:**  
1. Confirm whether **accrued interest and prepayment premiums** are included in payoff and/or “Closing Discharged Indebtedness” schedule.  
2. Confirm whether any **overdraft/cash pooling** items exist and how they are treated.  
3. Confirm whether any **third-party hedges** exist and, if so, whether termination amounts are included in debt payoff/adjustment.

**Suggested Revision (if modernizing):** Add explicit inclusion of accrued interest, breakage/prepayment premiums, swap/hedge termination amounts, and overdrafts.

---

### 2.4 Net Debt (if separate)

**Definition Name:** **NOT FOUND**  
**Section Reference:** NOT FOUND  
**Full Verbatim Text:** NOT FOUND.

**Plain-English Summary:**  
No “Net Debt” construct. Economics are addressed through: (i) **Closing Discharged Indebtedness** (and covenant to eliminate it at closing), (ii) **Free Cash Flow Adjustment Amount**, and (iii) Minimum Cash Balance.

**Overall Market Position:** 🟠 (for SPA tooling / middle-market comparability).

---

### 2.5 Working Capital / Net Working Capital

**Definition Name:** **NOT FOUND**  
**Section Reference:** NOT FOUND  
**Full Verbatim Text:** NOT FOUND.

**Plain-English Summary:**  
There is **no working capital peg or NWC true-up**. Instead, interim value protection is handled by (i) FCF-based mechanics (including spending deficiency and distribution controls) and (ii) ordinary-course covenants.

**Overall Market Position:** 🟠 vs typical private-company SPAs; can be 🟢 for large strategic/regulatory transactions where the primary lever is cash generation and capex discipline rather than NWC.

---

### 2.6 Transaction Expenses / Seller Expenses

**Definition Name:** **NOT FOUND** (no defined purchase-price deduction)  
**Section Reference (related):** Section 4.4 “Expenses” (PDF p.52)

**Related Verbatim Text:**
> “Seller… and Purchaser… shall bear their respective expenses…; **provided, that Seller shall be responsible for any… fees of the Company and its Subsidiaries incurred in connection with… the Transaction… and all such expenses… payable by the Company… shall be paid and satisfied in full by Seller prior to the Closing**…”

**Plain-English Summary:**  
Instead of deducting “Transaction Expenses” from purchase price, the SPA uses a **clean-company covenant**: Seller must ensure the Company does not bear transaction costs at closing.

**Checklist (typical transaction expenses):**
| Component | Captured? | Notes |
|---|---:|---|
| Banking, legal, accounting fees (company-level) | Yes | Explicit in 4.4. |
| Financing fees (company-level) | Yes | Explicitly included as “financing fees… payable by the Company” must be paid by Seller. |
| Change-of-control bonuses / retention | Partially | Retention arrangement required (Annex D, not provided). Treatment of CoC/bonuses should be confirmed. |
| Payroll taxes on bonuses | Unclear | Not explicit; likely included if “incurred in connection with” transaction, but confirm. |
| D&O tail, RWI premium | NOT FOUND | Not mentioned. |

**Market Position:** 🟢 Market standard approach (clean-company covenant) though definition/schedule would improve enforceability.

---

### 2.7 Taxes (definition)

**Definition Name:** “Tax” / “Taxes” / “Taxable”  
**Section Reference:** Article I definitions (PDF p.18)

**Full Verbatim Text:**
> “**‘Tax’** … shall mean all U.S. federal, state and local and non‑U.S. income, profits, franchise, gross receipts, environmental, customs duty, capital stock, severances, stamp, payroll, sales, employment, unemployment, disability, use, property, withholding, excise, production, value added, occupancy and other taxes, duties or assessments of any nature whatsoever, together with all interest, penalties and additions…”

**Plain-English Summary:**  
Broad definition that captures virtually all tax types plus interest/penalties/additions.

**Market Position:** 🟢.

---

### 2.8 Accounting Principles / Accounting Standards

**Definition Name:** “GAAP”; “Applicable Accounting Principles”  
**Section Reference:**  
- “GAAP” definition (PDF p.11)  
- “Applicable Accounting Principles” referenced in definitions (PDF p.6) and set in Section 2.3(a)(i) (PDF p.21)

**Verbatim text:**
- GAAP: “**‘GAAP’ shall mean U.S. generally accepted accounting principles.**”  
- Applicable Accounting Principles (2.3(a)(i)): “**prepared in good faith and in accordance with the accounting principles, practices and methodologies used in the Financial Statements… and using the line items set forth on Schedule 2.3(a)(I) and (II) of the Seller Disclosure Letter.**”

**Plain-English Summary:**  
For closing statements, accounting rules are anchored to **historical methodology used in the Financial Statements**, plus an **explicit line-item framework** in the missing schedules. This is generally a good dispute‑reduction structure *if* the schedules are complete and locked.

**Market Position:** 🟢 conceptually; **🔴 operational risk** if schedules are missing/unfinalized.

---

## Part 3: Purchase Price Mechanics

### 3.1 Price Equation (reconstructed)

**Base consideration:**  
- **$25.0B cash** at closing (2.2(a))  
- **Stock issuance** based on **($14.0B + Estimated FCF adj − Estimated discharged indebtedness − Estimated divestiture adj) / Average Adjusted Closing Price** (2.2(b))

**Post-closing cash true-ups:**  
- **FCF true-up** vs estimate (2.3(g)(i))  
- **Debt true-up** vs estimate (2.3(g)(ii))  
- **Divestiture adjustment true-up** vs estimate (2.3(h)(ii))  
- **Divestiture proceeds sharing** if Divestiture Adjustment Amount > 0 (2.3(i))  
- **Interest** at 3% compounded daily on payments under 2.3(g)/(h) (2.3(j))

**Section Reference:** 2.2(b) and 2.3(g)–(j) (PDF pp. 20–25)

**Verbatim Formula Language (key extracts):**
- Share issuance numerator: “$14,000,000,000.00, plus… Estimated Closing Free Cash Flow Adjustment Amount, minus… Estimated Closing Discharged Indebtedness, minus… Estimated Divestiture Adjustment Amount” (2.2(b)).  
- FCF true-up: “If the Free Cash Flow Adjustment Amount… exceeds… Estimated… then Purchaser shall pay Seller…; or… Seller shall pay Purchaser…” (2.3(g)(i)).  
- Debt true-up: “If the Closing Discharged Indebtedness… exceeds the Estimated… then Seller shall pay Purchaser…” (2.3(g)(ii)).

### 3.2 Term Alignment Check

| Formula uses this term | Defined / described in | Match? | Issue if mismatched |
|---|---|---:|---|
| Estimated Closing Free Cash Flow Adjustment Amount | 2.3(a)(i) | Yes | Requires Schedule 2.3(a)(I). |
| Estimated Closing Discharged Indebtedness | 2.3(a)(i) | Yes | Requires Schedule 2.3(a)(II). |
| Estimated Divestiture Adjustment Amount | 2.3(a)(ii) | Yes | Requires Annex A/B/C. |
| Average Adjusted Closing Price | Article I definition | Yes | Collar mechanics must be applied correctly. |
| Average Trading Price | Article I definition | Yes | Used for cash election (2.2(c)). |

### 3.3 Sign Convention Analysis

| Component | Direction in formula | Clear? | Potential ambiguity |
|---|---:|---:|---|
| Cash Consideration | + | Yes | Cash election changes mix and stock amount. |
| FCF adjustment | +/- | Yes | Definition complexity; schedule-dependent. |
| Closing discharged indebtedness | − (and post-close +/- true-up) | Yes | Scope depends on schedule. |
| Divestiture adjustment | − (and post-close +/- true-up) | Yes | Annex-dependent; valuation disputes possible. |
| NWC adjustment | N/A | N/A | No NWC structure. |
| Transaction expenses | Not in formula | N/A | Covered via covenant instead. |

### 3.4 Formula-Level Anti-Duplication

- Present? **Partial**  
- Exact language: “may be set off and netted…” (2.3(g)(iv))  
- Scope: only netting among 2.3(g) cash payments; does not govern overlap among FCF/debt/divestiture definitions.

### 3.5 Market Position Assessment

🟠 Slightly Off‑Market vs typical private SPAs; **deal‑appropriate** for a regulated telecom acquisition with large capex/leakage concerns.

---

## Part 4: Cross-Definition Interaction Analysis

### 4.1 Overlap Matrix (routing, anti-duplication, risks)

**Overlap Area: Overdrafts**  
- Definitions involved: Cash ↔ Indebtedness ↔ Minimum Cash Balance  
- Routing language: **NOT FOUND**  
- Anti-duplication present?: No  
- Risk: **Medium**  
- Recommendation: define for Section 4.15 and closing statement line items (gross vs net).

**Overlap Area: Accrued interest**  
- Definitions: Indebtedness ↔ Closing Discharged Indebtedness  
- Routing language: not explicit in Indebtedness; true-up references “Closing Discharged Indebtedness” scope via schedule  
- Anti-duplication: No  
- Risk: **Medium**  
- Recommendation: require payoff letters to include accrued interest and any premiums; ensure included in line items.

**Overlap Area: Current portion of debt**  
- Definitions: Indebtedness  
- Routing: Indebtedness includes borrowed money; covenant permits “extension and continuation… otherwise due” (4.12)  
- Risk: Low–Medium  
- Recommendation: confirm rollover/extension does not create new closing debt outside schedules.

**Overlap Area: Lease liabilities**  
- Definitions: Indebtedness (capital leases)  
- Routing: capital leases only; operating lease obligations not captured  
- Risk: Medium  
- Recommendation: diligence material leases; decide if special treatment needed.

**Overlap Area: Breakage/make-whole fees**  
- Definitions: Indebtedness / Closing Discharged Indebtedness / expenses covenant  
- Routing: not explicit; risk of being treated as “transaction expense” or left with company  
- Risk: Medium  
- Recommendation: clarify in payoff package and schedule.

**Overlap Area: Financing fees**  
- Definitions: expenses covenant  
- Routing: 4.4 requires Seller to pay company-level financing fees before closing  
- Risk: Medium (scope)  
- Recommendation: include a detailed invoice schedule and closing certificate.

**Overlap Area: Transaction bonuses**  
- Definitions: not explicit; employee matters (Annex D)  
- Routing: partial; annex not provided  
- Risk: Medium  
- Recommendation: obtain Annex D and confirm cost allocation.

**Overlap Area: Accrued deal costs**  
- Routing: 4.4 (company fees)  
- Risk: Medium  
- Recommendation: confirm all accrued and unpaid deal costs are settled.

**Overlap Area: Tax payables**  
- Definitions: Taxes; tax reps; indemnity; no NWC  
- Routing: tax reps + indemnity; no explicit overlap clause with balance sheet accruals  
- Risk: Medium  
- Recommendation: evaluate whether to add specific tax covenants (returns, audits, refunds).

**Overlap Area: Cash in NWC**  
- Not applicable (no NWC).

**Overlap Area: Intercompany balances**  
- Routing: 4.11 requires settlement/termination of intercompany indebtedness and swaps  
- Risk: Medium  
- Recommendation: diligence full intercompany list and confirm no continuing liabilities.

### 4.2 Gap Analysis

| Item | Risk of falling through definitions | Which definitions should capture it | Currently captured? | Recommendation |
|---|---|---|---:|---|
| Restricted cash | No cash definition; minimum cash covenant ambiguous | Cash definition for 4.15 | Unclear | Define “cash” for 4.15 as unrestricted, immediately available. |
| Trapped foreign cash | Same | Cash definition | Unclear | Diligence; clarify whether counts toward minimum cash. |
| Deposits in transit | Same | Cash definition | Unclear | Define for 4.15; confirm in closing procedures. |
| Outstanding checks | Same | Cash definition | Unclear | Define; ensure no last-minute disputes. |
| Off-balance sheet items | Indebtedness not comprehensive by modern standards | Indebtedness / special indemnity | Partially | Diligence (leases, guarantees). |
| Contingent liabilities | No NWC adjustment; reliance on reps/indemnity | Reps + indemnity | Yes (limited) | Ensure key contingencies are covered and that thresholds/caps are acceptable. |
| Missing schedules/annexes | Critical economic levers depend on them | 2.3 schedules; annexes | **No** | Obtain full package; treat as gating. |

---

## Part 5: Closing Statement & True-Up Mechanics

### 5.1 Timeline Extraction

| Stage | Days After Close / Timing | Responsible Party | Section Ref | Market Comparison |
|---|---|---|---|---|
| Estimated Closing Statement delivery (Seller) | ≥4 BD pre‑close (≤10 BD pre‑close) | Seller | 2.3(a)(i) | Standard |
| Objection to Seller estimate | 2 BD after delivery | Purchaser | 2.3(a)(i) | Tight |
| Re‑issue of Seller estimate | ≤2 BD before closing | Seller | 2.3(a)(i) | Standard |
| Estimated Purchaser Closing Statement (divestiture adj.) | ≥4 BD pre‑close (≤10 BD pre‑close) | Purchaser | 2.3(a)(ii) | Standard |
| Objection to Purchaser estimate | 2 BD after delivery | Seller | 2.3(a)(ii) | Tight |
| Closing Statement preparation | ≤90 days post‑close | Purchaser | 2.3(b) | Market |
| Seller dispute notice | ≤30 days after receipt | Seller | 2.3(c) | Market |
| Negotiation period | 30 days | Both | 2.3(d) | Market |
| Independent Accountant determination | ~30 days after submission | Independent Accountant | 2.3(e) | Market |
| True‑up payment | ≤5 BD after finalization | Payor | 2.3(g)(iii) | Market |
| Divestiture dispute statement | ≤90 days post‑close | Seller | 2.3(h)(i) | Market |
| Divestiture payment | ≤5 BD after final resolution | Payor | 2.3(h)(iii) | Market |

### 5.2 Process Mechanics

| Element | How SPA handles it | Market position | Section Ref |
|---|---|---|---|
| Who prepares Estimated Statement | Seller prepares FCF + debt estimate; Purchaser prepares divestiture estimate | 🟢 | 2.3(a)(i)/(ii) |
| Who prepares Final Statement | Purchaser prepares Closing Statement | 🟢 | 2.3(b) |
| Seller access to books/records | Purchaser must give Seller access incl. workpapers | 🟢 | 2.3(f) |
| Independent Accountant selection | Mutual; AAA appoints if no agreement in 10 days | 🟢 | Def. “Independent Accountant” |
| IA scope | Unresolved items only | 🟢 | 2.3(e) |
| IA standard of review | Must be consistent with 2.3 and Applicable Accounting Principles | 🟢 | 2.3(e) |
| IA decision binding | Final, binding, conclusive absent manifest error | 🟢 | 2.3(e) |
| IA cost allocation | Pro rata by unsuccessful disputed amounts | 🟢 | 2.3(e) |

### 5.3 Red Flags in True-Up Process

- **Schedule dependency:** Closing statement must use “line items set forth on Schedule 2.3(a)(I) and (II)” (missing). **Severity: High.**  
- **2‑business‑day objection windows** on estimates are operationally tight. **Severity: Medium.**  
- **No explicit “no hindsight” clause**; could create accounting-policy disputes absent schedules. **Severity: Medium.**

---

## Part 6: Escrow & Holdback Terms

### 6.1 Escrow Summary Table

| Escrow Type | Amount | % of Deal | Purpose | Release Timing | Release Conditions | Interest To | Section Ref |
|---|---:|---:|---|---|---|---|---|
| General indemnity | NOT APPLICABLE | — | — | — | — | — | NOT FOUND |
| PPA/adjustment | NOT APPLICABLE | — | — | — | — | — | NOT FOUND |
| Special purpose | NOT APPLICABLE | — | — | — | — | — | NOT FOUND |

### 6.2 Market Comparison

| Element | This SPA | Market (No RWI) | Market (With RWI) | Assessment |
|---|---:|---:|---:|---|
| Indemnity escrow % | 0% | ~10% | ~0.5% | 🟠 (vs mid‑market) but common in large strategic deals relying on caps/thresholds |
| PPA escrow % | 0% | ~1% | ~1% | 🟠 |
| Escrow period | N/A | 12 months | 12 months | N/A |

### 6.3 Escrow Mechanics Details
- Funded from purchase price or in addition? **NOT APPLICABLE**  
- Claim mechanics: **NOT APPLICABLE**  
- Relationship to indemnification: **Indemnification is exclusive monetary remedy post‑close** (6.6).

---

## Part 7: Accounting Principles & Methodology

### 7.1 Hierarchy (as drafted)

**Priority Order (quote the hierarchy clause):**  
1. “accounting principles, practices and methodologies used in the Financial Statements”  
2. “using the line items set forth on Schedule 2.3(a)(I) and (II)”  
3. “prepared in good faith”

**Verbatim Language:** see 2.8 above (2.3(a)(i)).  
**Section Reference:** 2.3(a)(i) (PDF p.21)

### 7.2 Key Methodology Questions

| Element | How SPA addresses it | Section Ref |
|---|---|---|
| GAAP/IFRS specification | GAAP = U.S. GAAP | Def. “GAAP” (PDF p.11) |
| Consistent with past practice | “methodologies used in the Financial Statements” | 2.3(a)(i) |
| Consistent with Financial Statements | Explicit | 2.3(a)(i) |
| Sample calculations | **Referenced** via schedules; **not provided** | 2.3(a)(i) |
| No hindsight / no new info | **NOT FOUND** | — |
| No reclassification | **NOT FOUND** | — |
| Reserves methodology | **NOT FOUND** (likely in schedules/FS) | — |
| Cut-off time | Period through “day prior to the Closing” in FCF definition | Def. “Free Cash Flow Adjustment Amount” |
| FX rate | **NOT APPLICABLE** (single currency USD) | — |

### 7.3 Red Flags

| Issue | Quote | Risk |
|---|---|---:|
| Missing schedules drive accounting | “using the line items set forth on Schedule 2.3(a)(I) and (II)” | High |
| No “no hindsight” clause | NOT FOUND | Medium |

---

## Part 8: Sample Calculations & Schedules

> **Result:** No illustrative schedules are included in the PDF. Several schedules/annexes are referenced and are essential.

### 8.1 Schedules / Annexes Referenced (not provided)

- **Schedule 2.3(a)(I)** — Free Cash Flow line items (Referenced in Free Cash Flow definition and 2.3).  
- **Schedule 2.3(a)(II)** — Closing Discharged Indebtedness line items (Referenced in 2.3(a)(i)).  
- **Annex A** — Per Subscriber Amount (used for Divested Market Amount).  
- **Annex B** — MHz POP values (used for Divested Spectrum Amounts).  
- **Annex C** — Markets / population/MHz POP mapping.  
- **Annex D** — Employee retention letter terms.  
- **Annex E** — Termination Transfer cash amount and assets.  
- **Annex F** — Roaming agreement terms.  
- **Seller Disclosure Letter / Purchaser Disclosure Letter** — referenced throughout for exceptions and schedules.

**Usefulness Assessment:**  
- Sufficient detail to replicate calculation? **No** (missing).  
- Ties to trial balance accounts? **Unknown** (missing).  
- Missing elements: **Entire calculation frameworks.**

---

## Part 9: Earnout Provisions

**NO EARNOUT PROVISION** (no earnout terms, metrics, periods, or dispute mechanics found).

---

## Part 10: Locked-Box Provisions

**COMPLETION ACCOUNTS STRUCTURE - NO LOCKED-BOX** (post‑closing true-up under 2.3).

---

## Part 11: Funds Flow Mechanics

### 11.1 Funds Flow Table

| Payment | Amount / Formula | Recipient | Timing | Funding Source | Section Ref |
|---|---|---|---|---|---|
| Cash to Seller | $25,000,000,000 | Seller | At closing | Purchaser funds | 2.2(a) |
| Stock to Seller | Purchaser Shares per 2.2(b) | Seller | At closing | Issuance | 2.2(b) |
| FCF true-up | Difference vs estimate | Buyer ↔ Seller | Post-close | Payor party | 2.3(g)(i) |
| Debt true-up | Difference vs estimate | Buyer ↔ Seller | Post-close | Payor party | 2.3(g)(ii) |
| Divestiture adjustment true-up | Difference vs estimate | Buyer ↔ Seller | Post-close | Payor party | 2.3(h)(ii) |
| Divestiture proceeds sharing | % of proceeds net of costs/taxes | Seller | As received | Purchaser/Company proceeds | 2.3(i) |
| Interest on adjustment payments | 3% compounded daily | Receiving party | With payment | Payor party | 2.3(j) |
| Termination Transfer (reverse-break) | Cash amount + assets; plus roaming agreement | Seller | Upon certain terminations | Purchaser | 7.5(b) + Annex E/F (missing) |

### 11.2 Payment Mechanics

| Element | Details | Section Ref |
|---|---|---|
| Wire instructions timing | Provided for adjustment payments: “made by wire transfer… to an account designated…” | 2.3(j) |
| Paying agent | NOT FOUND | — |
| Allocation among multiple sellers | NOT APPLICABLE (single Seller) | — |
| Withholding provisions | FIRPTA certificate condition; withholding if not delivered | 5.2(e) |

---

## Part 12: Set-Off Rights (All Contexts)

### 12.1 Set-Off Summary

| Context | Set-Off Permitted? | Conditions | Quote | Section Ref |
|---|---:|---|---|---|
| Against escrow | N/A | No escrow | — | — |
| Against earnout | N/A | No earnout | — | — |
| Against deferred payments / note | N/A | No note | — | — |
| True-up payments (2.3(g)) | Yes | Only within 2.3(g) payments | “may be set off and netted…” | 2.3(g)(iv) |
| General set-off clause | NOT FOUND | — | — | — |

### 12.2 Limitations on Set-Off

| Limitation | Present? | Details |
|---|---:|---|
| Only finally determined amounts | Yes | Payment after “Closing Statement is finalized” | 
| Notice requirements | Yes | Dispute process before finalization | 
| Cure period | N/A | Dispute process, not breach cure | 
| Minimum threshold | N/A | Not specified for setoff | 
| Sole recourse to escrow | N/A | No escrow |

---

## Part 13: Indemnification Mechanics (Financial Aspects)

### 13.1 Summary Table

| Element | Seller Indemnity | Buyer Indemnity | Section Ref |
|---|---|---|---|
| Cap (general reps) | Seller Cap = **$9,750,000,000** (excludes fundamental reps) | Purchaser Cap = **0.25 × ($39B − Cash Consideration (as adjusted))** | 6.4(a)(i); 6.4(b) |
| Cap (fundamental reps) | Limitations do not apply; damages not counted to Threshold/Cap | Same concept for Purchaser fundamental reps | 6.4(a)(i) last sentence; 6.4(b) last sentence |
| Basket type | Threshold/tipping after aggregate exceeds **$500,000,000** (plus de minimis and specified deductibles) | Threshold after **$500,000,000** (plus de minimis) | 6.4(a)(i); 6.4(b) |
| Basket amount | $500,000,000 | $500,000,000 | 6.4 |
| De minimis | $1,000,000 general; $5,000,000 for specified reps | De Minimis Amount applies (same term) | 6.4(a)(ii); 6.4(b) |
| Survival (general) | 12 months | 12 months | 6.1(a) |
| Survival (fundamental) | 10 years | 10 years | 6.1(a) |
| Survival (tax) | 30 days after statute expires | N/A | 6.1(a) |
| Exclusive remedy | Indemnification is sole monetary remedy post‑closing; fraud/equitable carveout | Same | 6.6 |

### 13.2 Exclusive Remedy Analysis

| Question | Answer | Quote | Section Ref |
|---|---|---|---|
| Indemnification exclusive remedy? | Yes (monetary) | “sole and exclusive remedy… shall be the indemnification…” | 6.6 |
| Carve-outs? | Fraud + equitable remedies | “shall not apply to… fraud… or… equitable remedies” | 6.6 |
| Escrow exclusive source? | N/A | No escrow | — |
| Direct pursuit after escrow? | N/A | No escrow | — |

### 13.3 Alignment Check

| Element | Aligned? | Issue |
|---|---:|---|
| Escrow period vs survival | N/A | No escrow |
| Escrow amount vs cap | N/A | No escrow |
| Basket vs de minimis | Yes | Layering is explicit but complex (specified deductibles vary by rep) |

---

## Part 14: Tax Provisions (Beyond Definition)

### 14.1 Tax Allocation

| Element | Details | Section Ref |
|---|---|---|
| Pre-closing tax responsibility | Primarily via tax reps + indemnity; tax claims limited to Pre‑Closing Taxes if breach of 3.2(l) | 3.2(l); 6.2(a) proviso |
| Straddle allocation method | **NOT FOUND** as a separate covenant; allocation concepts appear via definition of “Pre‑Closing Period” and “Pre‑Closing Taxes” (if applicable in other versions; not required in this doc’s definitions section as extracted) | Def. “Pre‑Closing Period” (PDF p.15); (No separate covenant located) |
| Transfer taxes allocation | 50/50 split | 8.13 |
| Withholding mechanics | FIRPTA certificate; withholding if not delivered | 5.2(e) |
| Gross-up provisions | NOT FOUND | — |

### 14.2 Tax Covenants

| Covenant | Present? | Key Terms |
|---|---:|---|
| Cooperation on returns | NOT FOUND | — |
| No amended returns | NOT FOUND | — |
| Tax contest provisions | Yes (via indemnity procedures) | Special control rules for Taxing Authority claims when post‑close periods are implicated | 6.3(b) |
| Refund allocation | NOT FOUND | — |

### 14.3 Tax Indemnity Overlap

- Tax indemnity present? **Yes**, via indemnification for breach of tax reps; but **Damages** for breach of 3.2(l) are limited to **Pre‑Closing Taxes**. (6.2(a) proviso)  
- Overlap with Working Capital tax accruals addressed? **NOT APPLICABLE** (no NWC adjustment).  
- Quote anti-overlap language: **NOT FOUND**.

---

## Part 15: Insurance Provisions

### 15.1 R&W Insurance
**NOT FOUND** (no RWI provisions).

### 15.2 D&O Tail
**NOT FOUND** (no explicit “tail policy” requirement).  
Related: Section 4.26 preserves D&O indemnification/exculpation rights but is not an insurance tail clause.

---

## Part 16: Intercompany Treatment

### 16.1 Intercompany Balances

| Element | Details | Section Ref |
|---|---|---|
| Intercompany balances addressed? | Yes | 4.11 |
| Settlement required pre-close? | Yes (intercompany indebtedness and swaps settled/terminated) | 4.11(a) |
| Included in Indebtedness? | Partially (if qualifies as borrowed money) | Def. “Intercompany Indebtedness” + Indebtedness def |
| Included in Working Capital? | N/A | No NWC |
| Which direction | Both directions exist; settlement required | 4.11(a) + definition |

### 16.2 Intercompany Agreements

| Element | Details |
|---|---|
| Termination required? | Purchaser may terminate without penalty at closing (subject to schedule exceptions) |
| Transition services? | Possible extension up to 12 months for certain intercompany contracts (4.11(c)) |

---

## Part 17: FX Mechanics

**SINGLE CURRENCY DEAL** (USD). No FX rate source/timing or hedging provisions for purchase price identified.

---

## Part 18: Financial Representations

### 18.1 Financial Statements Rep

**Section Reference:** 3.2(e)(i) (PDF pp. 29–30)

**Verbatim (key excerpt):**
> “The Financial Statements (A) have been prepared in accordance with GAAP applied on a consistent basis…; (B) present fairly, in all material respects…; and (C) accurately reflect in all material respects the books of account…”

**Assessment (selected elements):**

| Element | Present? | Assessment |
|---|---:|---|
| “Prepared in accordance with GAAP” | Yes | Standard |
| “Consistent basis” | Yes | Standard |
| “Present fairly… in all material respects” | Yes | Standard |
| “Accurately reflect… books and records” | Yes | Higher-than-minimum strength (still materiality qualified) |
| Knowledge qualifier | No | Buyer-favorable |
| Interim carve-outs | N/A in excerpt | — |

### 18.2 No Undisclosed Liabilities Rep

**Section Reference:** 3.2(e)(ii) (PDF pp. 29–30)

**Verbatim (core):**
> “Neither… has any Liabilities except… (A) … Financial Statements… (B) … ordinary course… (C) … would not… have a Company Material Adverse Effect.”

### 18.3 Absence of Changes Rep

**Section Reference:** 3.2(i) (PDF pp. 34–35)

**Verbatim (headline):**
> “Since December 31, 2010… conducted… in the ordinary course… and there has not been any… [list of prohibited changes].”

**Financially significant notes:**  
Includes restrictions on creating encumbrances, incurring indebtedness, changing accounting practices, paying non-cash distributions, and material capex/marketing deviations—aligns with the FCF/spend-deficiency protections.

---

## Part 19: Material Adverse Change/Effect

### 19.1 MAC/MAE Definition

**Definition Name:** “Company Material Adverse Effect”  
**Section Reference:** Article I definitions (PDF pp. 7–8)

**Verbatim (as in document):**  
See full definition on PDF pp. 7–8 (includes macro/industry, war/terror, weather, GAAP/law changes with disproportionate carve-back, failure to meet estimates with underlying cause carve-back, and deal announcement effects; plus exclusions for matters in disclosure letter/financial statements and Regulatory Material Adverse Condition mechanics).

### 19.2 Carve-Outs (summary)

| Carve-Out Category | Included? | Notes |
|---|---:|---|
| General economy / markets | Yes | Included |
| Industry conditions | Yes | Included |
| War/terror/hostilities | Yes | Included |
| Weather-related | Yes | Included |
| Changes in GAAP or law | Yes | Included, with disproportionate qualifier |
| Failure to meet estimates | Yes | Included, but underlying causes can still count |
| Announcement/pendency effects | Yes | Included, excluding breach/misconduct |
| Disproportionate impact qualifier | Yes (limited) | Applies to GAAP/law change carveout |

### 19.3 Disproportionate Impact Qualifier
- Present? **Yes (limited)**  
- Language context: GAAP/law change carveout applies “except to the extent such change disproportionately affects the Company…”

---

## Part 20: Comprehensive Risk Assessment

### 20.1 Top 10 Financial Risks (Ranked)

| Rank | Risk | Definitions/Sections | Severity | Likelihood | Recommendation |
|---:|---|---|---|---|---|
| 1 | Missing schedules/annexes that define adjustments | 2.3 schedules; Annex A–F; disclosure letters | High | High | Obtain and lock full package; treat as gating for closing statement disputes. |
| 2 | Ambiguity in scope of “Closing Discharged Indebtedness” | 2.3(a)(i), 4.12, Indebtedness | High | Medium | Confirm schedule includes interest/premiums; require payoff letters and line-item reconciliation. |
| 3 | Minimum cash covenant ambiguity (restricted cash, overdrafts) | 4.15 | Medium | Medium | Define “cash” for 4.15; ensure compliance testing is clear. |
| 4 | Complex FCF / Spending Deficiency can swing economics | FCF/Spending Deficiency definitions; 2.3(g) | Medium | Medium | Stress-test calculations; lock line items; add “no hindsight.” |
| 5 | Divestiture adjustment/proceeds mechanics can double count | 2.3(h)–(i); Divestiture definitions | High | Medium | Provide sample computations; add explicit anti-double-count drafting if needed. |
| 6 | Indemnification threshold ($500M) materially limits recovery | 6.4 | High | High | Ensure pricing/risk allocation reflect limited recourse; consider special indemnities for key risks. |
| 7 | No NWC peg allows balance-sheet timing effects | Structure | Medium | Medium | Rely on covenants and reps; consider a limited WC protection if negotiating. |
| 8 | Transaction costs covenant scope disputes (bonuses/payroll taxes) | 4.4; employee annexes | Medium | Medium | Define transaction expenses list; closing certification of paid costs. |
| 9 | Tax governance gaps (returns/refunds/amendments) | 3.2(l); 6.3 | Medium | Medium | Add tax covenants if needed; ensure control rights for audits are workable. |
| 10 | Termination Transfer economics depend on missing Annex E/F | 7.5(b); Annex E/F | High | Medium | Obtain Annex E/F; model economics; confirm regulatory approval mechanics. |

### 20.2 Double-Count Risks Summary

| Item | Risk Level | Mitigation Present? | Action Needed |
|---|---|---:|---|
| Divestiture adjustment vs divestiture proceeds | High | Partial (2.3(i) gating) | Provide examples and clarify ordering to avoid over/underpayment. |
| Debt paydown impacts FCF and debt adjustment | Medium | Partial (definitions/schedules) | Confirm schedules prevent double counting of payments. |
| Company deal costs vs indemnity claims | Medium | Partial (4.4 covenant) | Add evidence requirements; ensure costs are not left as liabilities. |

### 20.3 Gap Risks Summary

| Item | Risk Level | Addressed? | Action Needed |
|---|---|---:|---|
| Missing schedules/annexes | High | No | Obtain full package. |
| Restricted cash treatment | Medium | No | Define for 4.15; diligence. |
| Breakage/prepayment premiums | Medium | No explicit | Clarify in payoff; include in schedule. |
| Operating leases | Medium | No explicit | Diligence; consider treatment. |

---

## Part 21: Negotiation Analysis

### 21.1 Buyer-Favorable Provisions

| Provision | Why Buyer-Favorable | Typical Seller Pushback | Suggested Compromise |
|---|---|---|---|
| Spend discipline and FCF mechanism | Prevents underinvestment to juice cash; protects buyer’s forward economics | “Operational flexibility” | Permit variance bands with clear measurement; retain concept. |
| Covenant: no Closing Discharged Indebtedness | Protects buyer from inheriting specified debt at closing | “Let debt remain, adjust price” | Allow debt but require exhaustive schedule and payoff true-up. |
| Access and independent accountant process | Balanced dispute resolution | “Confidentiality / burden” | Maintain, but define procedures and timetables for data access. |

### 21.2 Seller-Favorable Provisions

| Provision | Why Seller-Favorable | Typical Buyer Pushback | Suggested Compromise |
|---|---|---|---|
| $500M threshold | Very high basket; materially limits buyer recovery | “Reps become toothless” | Lower threshold or add special indemnities for key reps. |
| No NWC peg | Seller avoids peg risk | “Balance-sheet timing risk” | Add limited WC covenant/remedy rather than full peg. |
| Fractional share rounding up | Slight economic tilt | “Unnecessary value leakage” | Cash-in-lieu. |

### 21.3 Key Negotiation Leverage Points

| Issue | Current Position | Importance | Negotiability | Suggested Approach |
|---|---|---:|---:|---|
| Missing schedules/annexes | Not in provided PDF | High | High | Make delivery/locking of schedules an explicit closing condition. |
| Debt scope (interest/premiums) | Not explicit | High | Medium | Tie to payoff letters; clarify in schedule/definition. |
| Indemnity threshold | $500M | High | Medium | Reduce or add targeted special indemnities. |
| Tax governance | Limited | Medium | Medium | Add cooperation/audit control/refund allocation covenants. |
| Minimum cash definition | Undefined | Medium | High | Add clear definition for 4.15. |

---

## Part 22: Suggested Revisions (materially off-market or high-risk)

### Revision 1: Clarify “cash” for Minimum Cash Balance
- **Current language:** “no less than $100,000,000.00 of cash on a consolidated basis.” (4.15)  
- **Issue:** Unclear whether restricted cash or overdrafts count.  
- **Suggested revision:** Define “Cash” for 4.15 as unrestricted, immediately available cash and demand deposits, net of overdrafts.  
- **Fallback:** Provide a closing certificate showing calculation method.

### Revision 2: Expand debt scope for payoff/adjustment
- **Current language:** Debt definition not explicit on accrued interest/premiums.  
- **Issue:** Payoff premiums could be left outside adjustments.  
- **Suggested revision:** Explicitly include accrued interest, prepayment premiums, and breakage in “Closing Discharged Indebtedness” schedule.  
- **Fallback:** Require payoff letters and treat payoff amounts as inclusive.

### Revision 3: Attach schedules as exhibits (or locked disclosure letter)
- **Current language:** Closing statement must use Schedule 2.3(a)(I)/(II).  
- **Issue:** Missing schedules undermine enforceability and replicability.  
- **Suggested revision:** Attach schedules to agreement or incorporate final signed disclosure letter by reference and attach it.  
- **Fallback:** Escrowed delivery under NDA with version control.

### Revision 4: Lower the indemnity threshold or add special indemnities
- **Current language:** Threshold = $500,000,000.  
- **Issue:** Limits buyer recovery severely.  
- **Suggested revision:** Lower threshold or carve out key reps (tax, environmental, IP) with lower thresholds.  
- **Fallback:** Maintain threshold but add specific indemnities for highest-risk areas.

---

## Part 23: Counsel Questions & Open Issues

### 23.1 Questions requiring clarification before signing / closing

| # | Question | Relevant Section | Why it matters | Suggested Resolution |
|---:|---|---|---|---|
| 1 | Provide Schedule 2.3(a)(I)/(II) and confirm exhaustive | 2.3 | Defines true-up economics | Attach/lock schedules |
| 2 | Confirm scope of Closing Discharged Indebtedness (interest/premiums) | 2.3(a), 4.12 | Prevent hidden leverage | Clarify in schedule/payoff |
| 3 | Define cash for 4.15 (restricted cash, overdrafts) | 4.15 | Closing compliance risk | Add definition/certificate |
| 4 | Provide Annex A/B/C and sample divestiture computations | Divestiture defs; 2.3(h)-(i) | Multi‑billion economics | Attach annexes/examples |
| 5 | Provide Annex D and clarify treatment of retention/bonus costs | 4.14(d) | Who pays and whether it’s “company expense” | Attach annex; define costs |
| 6 | Provide Annex E/F and model termination transfer | 7.5(b) | Downside economics | Attach annexes; model |
| 7 | Add no-hindsight guidance for closing statement | 2.3 | Dispute reduction | Add clause/instructions |
| 8 | Tax returns/refunds and audit control | 3.2(l), 6.3 | Tax risk governance | Add covenants |

### 23.2 Diligence items triggered by definitions/provisions

| Definition/Provision | Diligence item needed | Priority |
|---|---|---:|
| FCF Adjustment + Spending Deficiency | Validate calculation; reconcile to management reporting; ensure line items locked | High |
| Closing Discharged Indebtedness | Full debt schedule; payoff letters; interest/premiums; confirm no hidden liabilities | High |
| Minimum Cash Balance | Cash composition; restricted cash; overdrafts; timing | Medium |
| Divestiture economics | Regulatory scenarios; valuation; proceeds waterfall | High |
| Intercompany settlement | Intercompany debt/swaps list; termination/settlement proof | Medium |

---

## Part 24: Executive Summary

### 24.1 Deal Overview (2–3 sentences)
AT&T agrees to acquire T‑Mobile USA (via Holding) from Deutsche Telekom for **$25B cash plus a stock component targeted at $14B**, subject to significant **completion-style adjustments** tied to (i) **free cash flow generation and spend discipline**, (ii) **specified debt paydown at closing**, and (iii) **regulatory divestiture value and proceeds sharing**. Post‑closing true‑ups are resolved through a structured closing statement and independent accountant process.

### 24.2 Overall Assessment

| Dimension | Rating | Key drivers |
|---|---|---|
| Definitions clarity | 🟠 | Key economics depend on missing schedules/annexes. |
| Anti-duplication robustness | 🟠 | Netting exists for cash true-up, but overlap routing is otherwise limited. |
| Price mechanics clarity | 🟢/🟠 | Formula clear; inputs schedule/annex dependent. |
| True-up process fairness | 🟢 | 90/30/30 + IA framework with access rights. |
| Escrow terms | 🟠 | No escrow; relies on high thresholds/caps. |
| Overall balance (Buyer ↔ Seller) | 🟠 | Buyer protected on interim value leakage; seller favorable on recourse threshold. |

### 24.3 Top 5 Issues to Raise with Partner/Client
1. **Missing schedules/annexes** are gating: you cannot validate the economics without them.  
2. **Debt scope**: confirm interest/premiums and any debt-like items are captured in the closing discharge schedule/payoffs.  
3. **$500M indemnity threshold**: exceptionally high relative to most SPAs; ensure deal pricing reflects limited recovery.  
4. **Minimum Cash Balance ambiguity**: define “cash” to avoid last-minute closing disputes.  
5. **Divestiture mechanics**: multi‑billion outcomes; insist on annexes and sample computations; avoid double counting with proceeds sharing.

### 24.4 30-Second Deal Summary (briefing script)
“Headline is $39B base: **$25B cash plus $14B stock value**, adjusted for **FCF/spend**, **specified debt discharge**, and **divestiture economics**. True‑up: Purchaser prepares the closing statement within **90 days**; Seller has **30 days** to dispute; unresolved items go to an **Independent Accountant**. No escrow; monetary claims are via indemnification only, with a **$500M threshold** and a **$9.75B seller cap** (fundamental reps survive **10 years**). Key risks are the missing schedules/annexes that define calculations, and the exact scope of ‘Closing Discharged Indebtedness’ and divestiture valuation/proceeds mechanics.”

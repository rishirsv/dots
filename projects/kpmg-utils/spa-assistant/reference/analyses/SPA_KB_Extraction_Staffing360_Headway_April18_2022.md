# SPA Knowledge-Base Extraction & Analysis  
**Document:** *Stock Purchase Agreement* — Staffing 360 Solutions, Inc. (Buyer) / Headway Workforce Solutions, Inc. (Company/Target)  
**Source:** “Staffing 360 Solutions, Inc Stock Purchase Agreement.pdf” (104 PDF pages; SEC Exhibit 2.1)  
**Purpose:** Exhaustive extraction for SPA knowledge base (financial mechanics, market positioning, negotiation points, and risks).  

---

## Part 1: Document Overview

### 1.1 Metadata

| Field | Value |
|---|---|
| Deal Name / Project Code | **Staffing 360 / Headway Workforce Solutions** (no project code stated) |
| Execution Date | **April 18, 2022** (Agreement “dated as of April 18, 2022”) (Preamble, PDF p.8/104) |
| Parties (Buyer / Seller) | **Buyer:** Staffing 360 Solutions, Inc., a Delaware Corporation (“Buyer”). **Company/Target:** Headway Workforce Solutions, Inc., a Delaware corporation (the “Company”). **Sellers:** stockholders of the Company, acting through **Chapel Hill Partners, LP** as Sellers’ Representative. (Preamble, PDF p.8/104) |
| Target Company / Business | Headway Workforce Solutions, Inc. and subsidiaries (Headway Employer Services, LLC; Headway Payroll Services, LLC; Headway HR Solutions, Inc.; NC PEO Holdings, LLC) (Recitals, PDF p.8/104) |
| Jurisdiction / Governing Law | **Delaware** (Section 9.5, PDF p.77/104) |
| Deal Type | **Strategic / corporate buyer** (Buyer is an operating staffing company; not explicitly labeled) |
| Pricing Structure | **Hybrid completion-style adjustment**: fixed Purchase Price, then post-close **Purchase Price Adjustment** driven by (i) “Closing Balance Sheet Changes” outside ordinary course vs benchmark and (ii) “Unpaid Transaction Expenses” true-up. Not a classic Net Debt / NWC completion accounts. |
| Consideration Type | **Cash + Buyer Preferred Stock + Earnout (Contingent Payment)**; plus “Becker Advance” treated as advance against earnout (Sections 2.1–2.5; PDF pp.22–25/104) |
| R&W Insurance | **Unknown / not mentioned** |
| Estimated Deal Value | **$9,014,065.20** Purchase Price + **up to $5,000,000** Contingent Payment cap (Annex A) → **max $14,014,065.20** (Section 2.2; Annex A; PDF pp.22 & 84/104) |

**Party identification (verbatim):**
> This STOCK PURCHASE AGREEMENT (the “Agreement”) dated as of April 18, 2022 is being entered into by  
> and among Staffing 360 Solutions, Inc. a Delaware Corporation (“Buyer”), Headway Workforce Solutions, Inc. a Delaware  
> corporation (the “Company”), and Chapel Hill Partners, LP, as the representative of all of the stockholders (collectively, the “Sellers”)  
> of the Company (the “Sellers’ Representative”). (Preamble, PDF p.8/104)

**Governing law (verbatim):**
> This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware applicable to contracts made and performed in such State, without reference to such State’s or any other state’s or other jurisdiction’s principles of conflict of laws. (Section 9.5, PDF p.77/104)

### 1.2 Document Structure

> TOC appears at PDF p.4–6/104 and uses internal “Agreement page” numbering.

**Key Articles / sections (by TOC):**
- **Article I — Definitions** (TOC “ARTICLE I DEFINITIONS 4”)  
- **Article II — Purchase and Sale of Stock** (TOC “15”) including: 2.4 Purchase Price Adjustment, 2.5 Contingent Payment  
- **Article VII — Indemnification and Tax Matters** (TOC “61”) including: 7.4 caps/baskets; 7.5 payment offsets; 7.7 tax matters; 7.9 setoff  
- **Article IX — Miscellaneous** including governing law and jurisdiction

**Location map (PDF pages):**

| Topic | Where in Agreement | PDF Page(s) |
|---|---|---:|
| Definitions | Article I; key defined terms in Section 1.1 | PDF pp.9–18/104 |
| Purchase Price / Consideration | Sections 2.1–2.3 | PDF p.22/104 |
| Closing Mechanics | Sections 2.6–2.10 | PDF pp.25–29/104 |
| Closing Statements / True-Up | Section 2.4 | PDF pp.23–24/104 |
| Escrows / Holdbacks | **No escrow found**; functional holdback via offsets | PDF pp.24; 72–74/104 |
| Earnout | Section 2.5 + Exhibit A + Annex A | PDF pp.24–25; 84/104 |
| Indemnification | Article VII | PDF pp.66–74/104 |
| Schedules / Exhibits | Exhibit A (Adjusted EBITDA); Exhibit B (Benchmark Balance Sheet—referenced, not visible in text); Exhibit C (Preferred stock designation) | PDF pp.84; 91–104 |

---

## Part 2: Financial Definitions (Deep Extraction)

> **Context:** This SPA does not implement a classic “cash-free/debt-free with working capital peg” adjustment. Economic protection is instead built around (i) changes vs a benchmark balance sheet outside ordinary course and (ii) transaction expense true-up, with recovery largely through offsets against earnout and preferred economics.


### 2.1 Definition 1 — Purchase Price / Consideration

**Definition Name:** “Purchase Price”  
**Section Reference:** Section 2.2 (PDF p.22/104)

**Full Verbatim Text:**
> 2.2 Consideration. The aggregate consideration for the sale of the Purchased Shares and the post-Closing covenants  
> and agreements of Sellers’ Representative, on behalf of the Sellers, set forth in this Agreement shall be an amount equal to Nine Million  
> Fourteen Thousand Sixty Five US Dollars and Twenty Cents ($9,014,065.20) (the “Purchase Price”), subject to adjustment as  
> provided in Section 2.3, Section 2.4 and Article VII, plus the Contingent Payment, if earned, pursuant to Section 2.5, which shall be  
> deemed additional Purchase Price.

**Plain-English Summary:**  
Headline price is $9.014M, but it can be reduced/adjusted by closing transaction expense payments, the post-closing adjustment process, and indemnification mechanics. Any earnout is explicitly “additional Purchase Price,” tying it into consideration characterization.

**Component Breakdown:**

| Component | Included? | Verbatim Language | Market Position | Notes |
|---|---:|---|---|---|
| Fixed base price | Yes | “$9,014,065.20 … (the ‘Purchase Price’)” | 🟢 | Standard headline. |
| Explicit linkage to indemnity as “adjustment” | Yes | “subject to adjustment… Article VII” | 🟠 (Buyer) | Blurs price vs indemnity; can increase buyer leverage. |
| Earnout treated as price | Yes | “deemed additional Purchase Price” | 🟢 | Often included for tax/accounting. |
| Net debt / WC peg | No | — | 🟠 (structural) | Replaced by benchmark balance sheet changes. |

**Anti-Duplication Language:** Not present in this clause.

**Red Flag Language Identified:**

| Phrase | Why It's Concerning | Severity |
|---|---|---|
| “subject to adjustment … Article VII” | May enable purchase price re-trading via indemnity pathways with different thresholds/procedures than true-up. | Medium |

**Overall Market Position Assessment:** 🟠 Slightly Off-Market (Buyer)  
**Reasoning:** Treating indemnification mechanics as explicit “adjustments” to purchase price is more buyer-leaning than typical separation.

**Counsel Questions to Raise:**  
1. Does this linkage affect tax treatment (e.g., purchase price allocation, installment characterization) or accounting for consideration?  
2. Is there any conflict between Article VII caps and the “adjustment” framing in Article II?

---

### 2.2 Definition 2 — Cash / Cash and Cash Equivalents

**Definition Name:** **NOT FOUND** (no standalone “Cash” definition).  
**Where it would typically appear:** Article I definitions and in the purchase price formula in Article II.

**Closest related defined terms:**
- **“Cash Payment”** (fixed cash portion at closing)  
- **“Restricted Cash”** (separately defined)  
- Cash appears inside “Closing Working Capital” but is not a pricing lever.

**Why it matters (plain English):**  
Even without a classic cash adjustment, “cash-like” cut-off items can matter because the SPA’s adjustment uses balance sheet comparisons and includes items like unpaid checks. Lack of explicit “cash” cut-off rules can create disputes in “Closing Balance Sheet Changes.”

**Component Checklist (expected vs. found):**

| Component | Included? | Where | Notes |
|---|---:|---|---|
| Cash on hand / demand deposits | Indirect | Within “Closing Working Capital” | Included, but WC is as of Feb 28, 2022. |
| Cash equivalents | No | — | Not defined. |
| Restricted cash | Yes | “Restricted Cash” definition | Excluded from WC; also referenced in Indebtedness. |
| Deposits in transit | No | — | Gap. |
| Outstanding checks | Partially | WC liabilities include “unpaid checks…” | Addresses one cut-off side. |
| Overdraft netting | No | — | Gap. |

**Overall Market Position Assessment:** 🟠 Slightly Off-Market (Structural)  
**Reasoning:** Absence is fine if irrelevant; here it creates ambiguity around balance-sheet-change computations.

---

### 2.3 Definition 3 — Indebtedness / Debt

**Definition Name:** “Indebtedness”  
**Section Reference:** Section 1.1 (PDF p.13/104)

**Full Verbatim Text:**
> “Indebtedness” of any Person means, without duplication, (a) the principal, accreted value, accrued and unpaid  
> interest, prepayment and redemption premiums or penalties (if any), unpaid fees or expenses and other monetary obligations in respect  
> of (i) indebtedness of such Person for money borrowed and (ii) indebtedness evidenced by notes, debentures, bonds or other similar  
> instruments, the payment of which such Person is responsible or liable for (including any seller notes, deferred purchase price  
> obligations or earn-out obligations issued or entered into in connection with any acquisition undertaken by such Person); (b) all  
> obligations of such Person issued or assumed as the deferred purchase price of property or services, all conditional sale obligations of  
> such Person and all obligations of such Person under any title retention agreement (whether contingent or otherwise) calculated as the  
> maximum amount payable under or pursuant to such obligation; (c) all obligations of such Person under leases (i) required to be  
> capitalized in accordance with GAAP or (ii) have been classified as capital or finance leases in the Financial Statements; (d) all  
> obligations of such Person, contingent or otherwise, for the reimbursement of any obligor on any letter of credit, banker’s acceptance or  
> similar credit transaction; (e) all obligations of such Person under interest rate, currency swap or other hedging transactions (valued at  
> the termination value thereof); (f) the liquidation value, accrued and unpaid dividends; prepayment or redemption premiums and  
> penalties (if any), unpaid fees or expenses and other monetary obligations in respect of any redeemable preferred stock (or other equity)  
> of such Person; (g) all obligations from deferred compensation arrangements; (h) all obligations under surety bonds; (i) all obligations  
> payable to the Company’s Affiliates, managers, officers or members and any of their Affiliates, (j) all unpaid payroll or employment  
> Taxes of the Company or any of its Subsidiaries for all Tax periods ending on or before the Closing Date that were deferred pursuant to  
> the CARES Act to any Tax period ending after the Closing Date, (k) all Taxes of the Company and any of its Subsidiaries that are  
> attributable to periods that end on or prior to the Closing Date; (l) all obligations of the type referred to in clauses (a) through (k) of any  
> Persons, the payment of which such Person is responsible or liable for, directly or indirectly, as obligor, guarantor, surety or otherwise,  
> including guarantees of such obligations; (m) all obligations of the type referred to in clauses (a) through (l) of other Persons secured  
> by (or for which the holder of such obligations has an existing right,  
> contingent or otherwise, to be secured by) any Lien on any property or asset of such Person (whether or not such obligation is assumed by  
> such Person); and (n) all obligations of the Company  
> related to Restricted Cash needed for letters of credit.

**Plain-English Summary:**  
Very broad “kitchen sink” debt definition: includes borrowed money, capital/finance leases, hedges, redeemable preferred equity economics, deferred comp, surety bonds, affiliate payables, and several tax categories. Also captures obligations tied to restricted cash supporting letters of credit.

**Component Breakdown (focused checks):**

| Component | Included? | Verbatim Language | Market Position | Notes |
|---|---:|---|---|---|
| Borrowed money | Yes | “indebtedness… for money borrowed” | 🟢 | Standard. |
| Accrued interest | Yes | “accrued and unpaid interest” | 🟢 | Standard. |
| Breakage/make-whole | Yes | “prepayment and redemption premiums or penalties” | 🟢 | Standard. |
| Capital/finance leases | Yes | “leases… capital or finance leases” | 🟢 | Standard. |
| Operating leases | No | — | 🟢 | Often not included post-ASC 842 unless explicit. |
| Bank overdrafts | No (not explicit) | — | 🟠 | Ambiguous. |
| Guarantees | Yes | “obligor, guarantor, surety” | 🟢 | Standard. |
| Letters of credit | Yes | “reimbursement… letter of credit” | 🟢 | Standard. |
| Factoring/receivables | Not explicit | — | 🟠 | Depends on structure. |
| Intercompany / affiliate debt | Yes | “payable to… Affiliates…” | 🟠 (Buyer) | Requires clear settlement rules. |
| Hedging termination | Yes | “hedging… termination value” | 🟢 | Standard. |
| Deferred purchase price | Yes | “deferred purchase price… conditional sale” | 🟢 | Standard. |
| Pension deficits | No | — | 🟠 | Not included. |
| Declared dividends / redeemable pref | Yes | “accrued and unpaid dividends… redeemable preferred stock” | 🟠 (Buyer) | Broad; interacts with preferred consideration. |
| Taxes included as “debt-like” | Yes | clauses (j) and (k) | 🔴 (Buyer) | Overlap with WC + tax indemnity. |

**Anti-Duplication Language:**

| Phrase | Present? | Exact Quote | Scope |
|---|---:|---|---|
| “without duplication” | Yes | “means, without duplication,” | Definition-level |
| “to the extent not included in” | No | — | — |
| “for the avoidance of doubt” | No | — | — |

**Red Flag Language Identified:**

| Phrase | Why It's Concerning | Severity |
|---|---|---|
| Taxes included in Indebtedness (j/k) | Risk of double counting vs WC “accrued Taxes” and tax indemnity. | High |
| Affiliate obligations | Without settlement certificate, can become hidden purchase price reduction lever. | Medium |

**Overall Market Position Assessment:** 🔴 Significantly Off-Market (Buyer)  
**Reasoning:** Sweeping in taxes and broad affiliate obligations exceeds typical market “Net Debt” definitions even when buyer-friendly.

---

### 2.4 Definition 4 — Net Debt

**Definition Name:** **NOT FOUND**  
**Where it would typically appear:** Article I and Article II price formula.

**Plain-English Summary:**  
This SPA is not structured as a classic net debt deal; economic adjustments run through “Closing Balance Sheet Changes” and transaction expenses.

---

### 2.5 Definition 5 — Working Capital / Net Working Capital

**Definition Name:** “Closing Working Capital”  
**Section Reference:** Section 1.1 (PDF p.10/104)

**Full Verbatim Text:**
> “Closing Working Capital” means, as of February 28, 2022, (a) the consolidated current assets, including accounts  
> receivable, inventory, deposits, and prepaid expenses of the Company and the Subsidiaries (including cash, but excluding, deferred Tax  
> assets, income Tax assets and receivables from any of the Company and the Subsidiaries’ Affiliates, managers, Employees, officers or  
> members and any of their Affiliates), in each case, less (b) the consolidated current liabilities, including accounts payable, accrued  
> Taxes, accrued expenses, unpaid checks, drafts or wire transfers and other current liabilities of the Company and the Subsidiaries (but  
> excluding payables, Restricted Cash, deferred Tax liabilities and the current portion of long-term Company Indebtedness).

**Plain-English Summary:**  
Working capital is defined as current assets minus current liabilities **as of Feb 28, 2022** and includes cash while excluding restricted cash and certain tax/intercompany balances. It is not structured as a closing-date peg adjustment, creating atypical mechanics.

**Component Breakdown (key checks):**

| Component | Included? | Verbatim Language | Market Position | Notes |
|---|---:|---|---|---|
| Trade A/R | Yes | “accounts receivable” | 🟢 | Standard. |
| Inventory | Yes | “inventory” | 🟢 | Standard. |
| Prepaids | Yes | “prepaid expenses” | 🟢 | Standard. |
| Trade A/P | Yes | “accounts payable” | 🟢 | Standard. |
| Accrued expenses | Yes | “accrued expenses” | 🟢 | Standard. |
| Accrued taxes | Yes | “accrued Taxes” | 🟠 | Overlap risk with tax provisions. |
| Deferred revenue/customer deposits | Not explicit | “other current liabilities” | 🟠 | Should be explicit if material. |
| Cash in WC | Yes | “including cash” | 🟠 | Creates overlap unless routed clearly. |
| Restricted cash | Excluded | “excluding… Restricted Cash” | 🟢 | Standard. |
| Intercompany | Excluded (receivables) | “excluding… receivables from… Affiliates…” | 🟢 | Standard. |
| Current portion of debt | Excluded | “excluding… current portion of long-term Company Indebtedness” | 🟢 | Standard. |
| Measurement date | Fixed historical | “as of February 28, 2022” | 🔴 | Unusual for “Closing Working Capital.” |

**Overall Market Position Assessment:** 🟠 Slightly Off-Market (Structural)  
**Reasoning:** Date + cash inclusion + lack of explicit routing to the purchase price formula is atypical and creates ambiguity.

---

### 2.6 Definition 6 — Transaction Expenses / Seller Expenses

**Definition Name:** “Transaction Expenses”; “Unpaid Transaction Expenses”  
**Section Reference:** Section 1.1 (PDF p.18/104)

**Full Verbatim Text:**
> “Transaction Expenses” means the sum of all costs, fees, expenses and other amounts incurred or payable by the  
> Company, the Subsidiaries and/or Sellers (whether paid or unpaid, accrued or contingent) or any of their respective Affiliates in  
> connection with the negotiation, preparation and execution of the this Agreement and the other agreements contemplated herein and the  
> consummation of the transactions contemplated hereby and thereby, including, but not limited to, any financial advisors’, attorneys’,  
> accountants’ and other professional fees and expenses, (b) any payments arising from retention, severance, “stay,” sale, transaction or  
> sign-on bonuses as well as any deferred compensation payable to Employees of any of the Company or any of the Subsidiaries and any  
> other similar payments to Employees and representatives, including the Company’s, any of the Subsidiaries’ or Sellers’ portion of  
> employment and similar Taxes associated with such items, (c) any fees, expenses, break costs (including costs calculated based on  
> difference in swap and current rates) payments or other costs related to the termination of any swap agreements, derivative transactions,  
> or similar arrangements, (d) the Company’s and the Subsidiaries’ portion of any employment or payroll Taxes associated with the  
> amounts payable under the foregoing clause (b) incurred or otherwise payable by the Company or any Subsidiary whether at, prior to or  
> after the Closing in connection with this Agreement and the consummation of the transactions contemplated hereby, or (e) all severance  
> and related expenses payable to Jean-Pierre Sakey. Notwithstanding the following, the Becker Advance referenced in Section 2.3(d) herein  
> shall be treated as an advance against the Contingent Payment to be paid to Sellers’ Representative on behalf of the Sellers under  
> Section 2.5 herein, and shall not reduce the amount of the Closing Payment.  
>   
> “Unpaid Transaction Expenses” means the amount of Transaction Expenses incurred as of or after the Closing but  
> unpaid as of the Effective Time.

**Plain-English Summary:**  
Transaction Expenses are extremely broad (including contingent and post-close-incurred amounts) and cover professional fees, employee payments, employer taxes, swap break costs, and specified severance. Unpaid Transaction Expenses are used for the post-close true-up.

**Overall Market Position Assessment:** 🔴 Significantly Off-Market (Buyer)  
**Reasoning:** “contingent” + “after the Closing” scope is unusually seller-unfriendly.

---

### 2.7 Definition 7 — Taxes (definition)

**Definition Name:** “Taxes”  
**Section Reference:** Section 1.1 (PDF p.17/104)

**Full Verbatim Text:**
> “Taxes” means any and all taxes, assessments, charges, fees, levies or other similar charges or assessments (whether  
> imposed directly or through withholding and whether imposed by any Governmental Body), including income, gross receipts, excise,  
> property, sales, value-added, transfer, license, payroll, employment, escheat, customs duties, and franchise taxes, together with any  
> interest and penalties.

**Overall Market Position Assessment:** 🟢 Market Standard.

---

### 2.8 Definition 8 — Accounting Principles / Accounting Standards

**Definition Name:** “Accounting Principles”  
**Section Reference:** Section 2.4(a) (PDF p.23/104)

**Full Verbatim Text:**
> The Estimated Closing Statement is to be prepared in accordance with GAAP, as consistently applied in the preparation of the Financial Statements  
> (the “Accounting Principles”) and the applicable definitions set forth herein.

**Plain-English Summary:**  
The adjustment statements must follow GAAP consistently applied with the Financial Statements and must use the SPA’s defined terms, but there is no deeper hierarchy or “no hindsight” rule.

**Overall Market Position Assessment:** 🟠 Slightly Off-Market (Buyer)  
**Reasoning:** Accounting standard is fine; surrounding procedural language provides Buyer flexibility to change positions later.

---

## Part 3: Purchase Price Mechanics

### 3.1 Price Equation

#### (A) Key defined inputs (verbatim)

**Closing Payment (definition):** (Section 1.1, PDF p.10/104)
> “Closing Payment” means an amount equal to (i) the Purchase Price, minus (ii) the Cash Payment, minus (iii) the  
> Closing Balance Sheet Changes, and minus (iii) the Estimated Transaction Expenses, except for the Becker Advance, which shall be  
> accounted for as specifically set forth in Section 2.3(b) herein, and shall not reduce the amount of the Closing Payment.

**Adjustment Amount (definition):** (Section 1.1, PDF p.9/104)
> “Adjustment Amount” means, without double counting, (a) an amount equal to (i) the Final Closing Balance Sheet Changes, minus  
> (ii) the Estimated Closing Balance Sheet Changes, plus (b) an amount equal to (i) the Estimated Transaction Expenses, minus  
> (ii) the Final Transaction Expenses.

**Closing Balance Sheet Changes (definition):** (Section 1.1, PDF p.9/104)
> “Closing Balance Sheet Changes” means an amount equal to any negative differential between the Closing Balance Sheet and the  
> Benchmark Balance Sheet resulting from transactions, activities, omissions, or events that occurred outside the Ordinary Course of  
> Business between February 28, 2022 and the Effective Time, in each case, in accordance with past practices.

**Benchmark Balance Sheet (definition):** (Section 1.1, PDF p.9/104)
> “Benchmark Balance Sheet” means the unaudited combined balance sheet of the Company and the Subsidiaries as of February 28, 2022  
> attached hereto as Exhibit B, in the form and substance as filed with the SEC in Buyer’s Form 8-K filed on April 21, 2022.

#### (B) Purchase Price and consideration split (verbatim)

**Purchase Price clause:** (Section 2.2, PDF p.22/104) — quoted above in Part 2.1.

**Allocation of closing consideration (verbatim):** (Section 2.1, PDF p.22/104)
> 2.1 Purchase and Sale of the Stock. Subject to the terms and conditions set forth in this Agreement, at Closing,  
> Buyer shall purchase and acquire from Sellers and Sellers shall sell, transfer, convey, assign and deliver to Buyer, free and clear of any  
> and all Liens, all of Sellers’ right, title and interest in and to the Purchased Shares, for an amount equal to (a) Fourteen Thousand Sixty￾Five US Dollars and Twenty Cents ($14,065.20) (the “Cash Payment”), plus (b) an amount equal to the Closing Payment (the  
> “Staffing 360 Preferred Stock Payment”), payable in shares of Staffing 360’s Series H Convertible Preferred Stock, subject to the terms  
> and conditions set forth in the Certificate of Designation, plus (c) if earned, the Contingent Payment, pursuant to Section 2.5.

#### (C) Reconstructed purchase price formula (operational)

**Base Purchase Price**  
- **Cash Payment**  
- **Closing Balance Sheet Changes**  
- **Estimated Transaction Expenses** (excluding Becker Advance)  
= **Closing Payment** (paid in Buyer preferred stock)  

**Post-close:** “Adjustment Amount” true-up for (Final vs Estimated) balance sheet changes and transaction expenses.

### 3.2 Term Alignment Check

| Formula Uses This Term | Definition Section Uses | Match? | Issue if Mismatched |
|---|---|---:|---|
| Purchase Price | 2.2 | Yes | — |
| Cash Payment | 2.1 | Yes | — |
| Closing Balance Sheet Changes | 1.1 | Yes | Sign conventions ambiguous (see 3.3). |
| Estimated Transaction Expenses | 2.4(a) | Yes | Becker Advance excluded by special rule; internal reference typo risk (2.3(d) vs 2.3(b)). |
| Closing Payment | 1.1 | Yes | Numbering error in definition (“minus (iii)… minus (iii)”). |
| Adjustment Amount | 1.1 | Yes | Settlement mechanics appear asymmetric (see 5.3). |

### 3.3 Sign Convention Analysis

| Component | Direction in Formula | Clear? | Potential Ambiguity |
|---|---|---:|---|
| Cash Payment | “minus” | Yes | None. |
| Closing Balance Sheet Changes | “minus” | 🟠 | Defined as “amount equal to any negative differential” — unclear if the number is positive (absolute value) or negative (the differential itself). This matters in Adjustment Amount math. |
| Transaction Expenses | “minus” | Yes | Becker Advance carved out and routed against earnout/dividends/redemption. |
| Adjustment Amount settlement | Implicit | 🔴 | Section 2.4(d) text located addresses negative/zero outcomes; a positive pay-up clause is not located (see 5.3). |

### 3.4 Formula-Level Anti-Duplication

- **Present?** Yes (limited)  
- **Exact language:** “Adjustment Amount means, without double counting…” (PDF p.9/104)  
- **Scope:** Definition-level for Adjustment Amount; not a comprehensive formula-level anti-duplication clause across all economic buckets.

### 3.5 Market Position Assessment

**Overall:** 🔴 Significantly Off-Market (Buyer)  
**Drivers:** unusual “Closing Balance Sheet Changes” construct + potential asymmetry in true-up settlement + broad Transaction Expenses + seller credit risk due to preferred stock consideration.

---

## Part 4: Cross-Definition Interaction Analysis

### 4.1 Overlap Matrix (selected high-risk overlaps)

**Overlap Area: Overdrafts**  
- Definitions: Cash ↔ Indebtedness  
- Routing language: **NOT FOUND**  
- Anti-duplication: No  
- Risk: Medium  
- Recommendation: State overdrafts are treated as indebtedness and not netted against cash unless explicitly stated.

**Overlap Area: Accrued interest**  
- Definitions: Indebtedness ↔ Working Capital  
- Routing: Indebtedness includes “accrued… interest”; WC includes “accrued expenses”  
- Anti-duplication: not cross-bucket  
- Risk: Medium  
- Recommendation: Explicitly classify accrued interest as Indebtedness only (or exclude from balance-sheet-change analysis).

**Overlap Area: Current portion of debt**  
- Definitions: Indebtedness ↔ Working Capital  
- Routing: WC excludes “current portion of long-term Company Indebtedness”  
- Risk: Low  
- Recommendation: Ensure “Company Indebtedness” includes all instruments.

**Overlap Area: Breakage/make-whole vs deal expenses**  
- Definitions: Indebtedness ↔ Transaction Expenses  
- Routing: both capture similar concepts (premiums vs swap break)  
- Risk: Medium  
- Recommendation: Add routing and no-double-count clause.

**Overlap Area: Tax payables**  
- Definitions: WC ↔ Indebtedness ↔ Tax indemnity  
- Routing: WC includes “accrued Taxes”; Indebtedness includes tax clauses (j/k); tax indemnity is “net of any reserves…”  
- Risk: High  
- Recommendation: Add explicit reconciliation and no-double-counting.

### 4.2 Gap Analysis

| Item | Risk of Falling Through Definitions | Which Definitions Should Capture It | Currently Captured? | Recommendation |
|---|---|---|---:|---|
| Deposits in transit | Not addressed | Cash / cut-off rules | No | Add explicit cut-off rules under Accounting Principles. |
| Customer deposits / deferred revenue | Not explicit | Working capital / liabilities | Unclear | Add explicit inclusion/exclusion and tie to Exhibit B. |
| Overdraft netting | Not addressed | Cash/Debt | No | Add explicit routing. |

---

## Part 5: Closing Statement & True-Up Mechanics

### 5.1 Timeline Extraction

| Stage | Days After Close | Responsible Party | Section Ref | Market Comparison |
|---|---:|---|---|---|
| Estimated Closing Statement delivery | **3 Business Days prior** | Company | 2.4(a) (PDF p.23/104) | Market: at/before close ✅ |
| Final Adjustment Statement | **within 90 days** | Buyer | 2.4(b) (PDF p.23/104) | Market: 60–90 days ✅ |
| Seller review/access period | **30 days** | Sellers’ Rep | 2.4(c) (PDF p.23/104) | Market: 30–45 days ✅ |
| Dispute notice deadline | **30 days** after delivery | Sellers’ Rep | 2.4(c) | Market: 30 days ✅ |
| Negotiation period | **30 days** after dispute notice | Both | 2.4(c) (PDF p.24/104) | Market: common ✅ |
| Independent Accountant referral | After negotiation if unresolved | Either | 2.4(c) | Market: common ✅ |
| Independent Accountant decision | “as soon as practicable” | IA | 2.4(c) | Market: common ✅ |
| Payment of true-up | **3rd Business Day** after final determination | Buyer / Sellers’ Rep via offsets | 2.4(d) (PDF p.24/104) | Market: common ✅ |

### 5.2 Process Mechanics

| Element | How SPA Handles It | Market Position | Section Ref |
|---|---|---|---|
| Who prepares Estimated Statement | Company (good faith) | 🟢 | 2.4(a) |
| Who prepares Final Statement | Buyer | 🟠 | 2.4(b) |
| Seller access to books/records (adjustment) | **NOT FOUND** in 2.4 excerpt; separate access for earnout is granted | 🟠 | Earnout access: 2.5(b) |
| Independent Accountant selection | Mutual; if no agreement, each picks a firm and those choose a third | 🟢 | 2.4(c) |
| IA scope | Disputed items only; range-bound determinations | 🟢 | 2.4(c) |
| IA standard | “expert… not as an arbitrator” | 🟢 | 2.4(c) |
| IA decision binding | “final, binding and conclusive” | 🟢 | 2.4(c) |
| IA cost allocation | Inverse of success | 🟢 | 2.4(c) |

### 5.3 Red Flags in True-Up Process

1. **Potentially asymmetric economics:** The located Section 2.4(d) text addresses negative and zero Adjustment Amount outcomes; a positive-payment clause to Sellers is not located in the extracted text. This is a major negotiation item.  
2. **Sign ambiguity:** “Closing Balance Sheet Changes” is defined as a negative differential concept but used as a subtractive term; needs an explicit example.  
3. **Buyer position flexibility:** Even if Buyer had input to the estimate, Buyer is not precluded from taking different positions later (2.4(a)).

---

## Part 6: Escrow & Holdback Terms

### 6.1 Escrow Summary Table

**NO TRADITIONAL ESCROW FOUND** (no escrow agent/escrow agreement mechanics located).

| Escrow Type | Amount | % of Deal | Purpose | Release Timing | Release Conditions | Interest To | Section Ref |
|---|---:|---:|---|---|---|---|---|
| General Indemnity | NOT APPLICABLE | — | — | — | — | — | — |
| PPA/Adjustment | NOT APPLICABLE | — | — | — | — | — | — |
| Special Purpose | NOT APPLICABLE | — | — | — | — | — | — |

**Functional holdback / recourse substitutes:**
- Adjustment Amount shortfalls are recovered by offset against earnout (2.4(d)(i)).  
- Indemnity payments are offset first against earnout, then against preferred dividends/interest (7.5).  
- Setoff right enables additional netting (7.9).

### 6.2 Market Comparison

| Element | This SPA | Market Benchmark (No RWI) | Market Benchmark (With RWI) | Assessment |
|---|---:|---:|---:|---|
| Indemnity escrow % | 0% | ~10% | ~0.5% | 🟠 (structural) |
| PPA escrow % | 0% | ~1% | ~1% | 🟠 (structural) |
| Escrow period | N/A | 12 months | 12 months | N/A |

### 6.3 Escrow Mechanics Details

**NOT APPLICABLE** (no escrow). Key diligence/negotiation is whether offsets provide sufficient protection for Buyer and whether Sellers need a security package (escrow, redemption protection, covenants, or RWI).

---

## Part 7: Accounting Principles & Methodology

### 7.1 Hierarchy

**Priority Order (derived):**
1. GAAP  
2. Consistency with the Financial Statements  
3. Applicable defined terms in the SPA

**Verbatim (Accounting Principles):**
> The Estimated Closing Statement is to be prepared in accordance with GAAP, as consistently applied in the preparation of the Financial Statements  
> (the “Accounting Principles”) and the applicable definitions set forth herein. (2.4(a), PDF p.23/104)

### 7.2 Key Methodology Questions

| Element | How SPA Addresses It | Section Ref |
|---|---|---|
| GAAP/IFRS specification | GAAP | 2.4(a); 4.7(a) |
| “Consistent with past practice” | Applied to “Closing Balance Sheet Changes” (outside ordinary course “in accordance with past practices”) | 1.1 definition |
| “Consistent with Financial Statements” | Yes | 2.4(a) |
| Illustrative schedules | Annex A (earnout examples); Exhibit B referenced for benchmark; Exhibit A defines Adj EBITDA addbacks | Exhibit A; Exhibit B; Annex A |
| No hindsight / no new info | NOT FOUND | — |
| No reclassification | NOT FOUND | — |
| Reserves methodology | Tax indemnity net of reserves; financial statements rep includes reserves assumptions | 7.2(a)(vi); 4.7 |
| Cut-off time | “close of business on the Closing Date” in tax straddle | 7.7(b) |
| FX | SINGLE CURRENCY DEAL | — |

### 7.3 Red Flags

| Issue | Quote | Risk |
|---|---|---|
| Balance-sheet-change construct is judgment-heavy | “outside the Ordinary Course of Business… in accordance with past practices.” | Medium/High |
| Missing “no hindsight” | — | Medium |
| Buyer can change positions | “no position… shall preclude the Buyer from taking any other position…” | Medium |

---

## Part 8: Sample Calculations & Schedules

### 8.1 Exhibit A — Adjusted EBITDA (Earnout methodology)

**Schedule/Exhibit:** Exhibit A – Adjusted EBITDA  
**Reference:** Exhibit A (PDF p.84/104)  
**Purpose:** Earnout metric methodology (Adjusted EBITDA for Contingent Payment)

**Verbatim (key methodology bullets):**
> The primary purpose of this Adjusted EBITDA valuation and the corresponding potential for the Sellers’ Representative, on behalf of  
> the Sellers, to earn a Contingent Payment is to provide future EBITDA credit to the Company’s trailing 12-month (TTM) EBITDA  
> during the Contingent Period for the following three (3) areas:  
> ● Non-recurring expenses;  
> ● Consolidated net annualized savings… (the “Estimated Net Annualized Savings”);  
> ● Net income recognition and/or collections related to prior periods prior to the close, to the extent not included in the Closing  
> Balance Sheet. (Exhibit A, PDF p.84/104)

**Examples listed (verbatim excerpt):**
> ● Addback of Consulting Agreement fees/expenses prior to the Closing;  
> ● Addback for the Estimated Net Annualized Savings;  
> ● Margin credit for services from the Company’s CORE operations to other 360 businesses;  
> ● Inclusion in EBITDA the net financial benefit of the Employee Retention Tax Credit… to the extent approved by the IRS;  
> ● Inclusion in EBITDA the net financial benefit of the current IRS Tax Abatement case; and  
> ● Inclusion in EBITDA of the net proceeds from the RTI Claim. (Exhibit A, PDF p.84/104)

**Indemnity-to-earnout linkage (verbatim):**
> …in the event Losses… exceed the General Cap… such Losses in excess of the General Cap will be considered as a deduction within the  
> calculation of Adjusted EBITDA. (Exhibit A, PDF p.84/104)

**Usefulness Assessment:**
- Sufficient detail to replicate calculation? **No** (concept-level only; no account mapping, no definitions of “non-recurring”, no calculation mechanics for “Estimated Net Annualized Savings”).  
- Ties to trial balance accounts? **No**.  
- Missing elements: precise EBITDA definition, addback controls, audit trail, and examples with numbers.

---

### 8.2 Annex A — Contingent Payment examples

**Schedule/Exhibit:** Annex A – Contingent Payment  
**Reference:** Annex A (PDF p.84/104)  
**Purpose:** Illustrative earnout sizing / cap

**Verbatim:**
> The Contingent Payment will be calculated at a 2.5 multiple of trailing 12-month (TTM) Adjusted EBITDA.  
> A ceiling of $2,000,000 in TTM Adjusted EBITDA will be set for the Contingent Payment. There will be no minimum TTM Adjusted  
> EBITDA for the Contingent Payment calculation (i.e., a TTM Adjusted EBITDA of $0 will not result in a negative adjustment to the  
> Purchase Price). (Annex A, PDF p.84/104)

**Usefulness Assessment:** Replicable for multiple/cap; not sufficient for EBITDA construction.

---

### 8.3 Exhibit B — Benchmark Balance Sheet

**Schedule/Exhibit:** Exhibit B – Benchmark Balance Sheet  
**Reference:** Defined in Section 1.1; “attached… as Exhibit B” (PDF p.9/104)  
**Status in provided PDF text:** **NOT PRESENT / NOT VISIBLE** (only referenced)  
**Criticality:** High — Exhibit B is required to compute “Closing Balance Sheet Changes.”

---

### 8.4 Exhibit C — Series H Convertible Preferred Stock designation

**Schedule/Exhibit:** Exhibit C  
**Reference:** PDF pp.91–104/104  
**Purpose:** Defines the economics of the preferred stock that constitutes the majority of closing consideration (dividends, conversion, redemption and related terms).  
**Usefulness:** High (complete instrument provided).

---

## Part 9: Earnout Provisions

### 9.0 Existence

**EARNOUT PRESENT** (“Contingent Payment”).

### 9.1 Earnout Summary

| Element | Details | Section Ref |
|---|---|---|
| Maximum earnout amount | **$5,000,000** (cap via $2,000,000 EBITDA ceiling × 2.5) | Annex A (PDF p.84/104) |
| Metric(s) | Trailing 12-month **Adjusted EBITDA** | Exhibit A / Annex A |
| Measurement period(s) | “Contingent Period” (defined elsewhere; earnout based on trailing 12-month during period) | Section 2.5 |
| Payment timing | **Within five (5) Business Days** after final determination | 2.5(d) (PDF p.25/104) |
| Threshold/target | No minimum; EBITDA ≤ 0 → no payment | Annex A |
| Cap | $5,000,000 | Annex A |
| Floor | 0 | Annex A |
| Linear vs. tiered payout | Linear multiple (2.5×), capped | Annex A |

### 9.2 Metric Definition

**Verbatim definition pointer:**
> “Adjusted EBITDA means the Company’s EBITDA as calculated and adjusted pursuant to Exhibit A.” (Section 1.1, PDF p.9/104)

**Departures / discretion risks (summary):**
- Forward-looking “Estimated Net Annualized Savings” addback.  
- Benefits contingent on IRS approvals/abatements and claim proceeds.  
- Deduction of Losses above General Cap from Adjusted EBITDA (Exhibit A).

### 9.3 Operational Covenants

| Covenant | Verbatim Language | Strength |
|---|---|---|
| Buyer control / discretion | “Buyer and its Affiliates… shall have complete control and sole and absolute discretion…” | Weak (seller-protection) |
| Standard of conduct | “…only required to take actions… in the best interests of Buyer…” | Weak |
| Limited non-interference | “…shall act in good faith… shall not take any action(s)… the primary purpose of which is to unreasonably and materially interfere…” | Moderate |

**Verbatim (buyer discretion + limited good faith):**
> From and after the Effective Time, Buyer and its Affiliates (i) shall have complete control and sole and absolute  
> discretion… and (ii) are only required to take actions… in the best interests of Buyer… and do not owe any duties… (other than to  
> make the payments… due under Section 2.5). … during the Contingent Period Buyer and its Affiliates shall act in good faith… shall not  
> take any action(s)… the primary purpose of which is to unreasonably and materially interfere… (2.5(e), PDF p.25/104)

### 9.4 Acceleration & Forfeiture

| Trigger | Effect | Section Ref |
|---|---|---|
| Buyer fails to pay earnout | After 30-day cure, seller indemnity obligations terminate (except fundamental/indefinite) | 2.5(f) |
| Change of control | NOT FOUND | — |
| Divestiture | NOT FOUND | — |

**Verbatim (earnout non-payment cure + indemnity termination):**
> …Buyer shall be entitled to a thirty (30) day cure period… after which time all indemnification obligations… under Article VII… shall  
> automatically terminate… excluding… Fundamental Representations and Indefinite Representations… (2.5(f), PDF p.25/104)

### 9.5 Set-Off Rights (Earnout context)

- **Set-off permitted against earnout?** Yes.  
- **Mechanics (verbatim priority waterfall):**
> …the remainder of the Contingent Payment after reduction for the Becker Advance and payment of all liabilities… under Section 2.4(d)(i)  
> and Section 7.5 shall be paid to Sellers’ Representative… (2.5(d)(ii), PDF p.25/104)

### 9.6 Earnout Dispute Resolution

| Element | Details | Quote/Ref |
|---|---|---|
| Audit / access rights | Reasonable access to working papers, books and records; confidentiality and no disruption | 2.5(b), PDF p.24/104 |
| Dispute notice period | 30 days after Contingent Statement | 2.5(b), PDF p.24/104 |
| Negotiation period | 30 days | 2.5(c), PDF p.25/104 |
| Resolution mechanism | Independent Accountant using 2.4(c) procedures | 2.5(c) |

### 9.7 Market Assessment

**Overall earnout structure:** 🔴 Significantly Off-Market (Buyer)  
**Key risks:** Buyer discretion, non-TB-tied metric, earnout subordinated as recovery source for adjustment/indemnity, and speculative addbacks.

---

## Part 10: Locked-Box Provisions

**COMPLETION ACCOUNTS STRUCTURE - NO LOCKED-BOX**  
This SPA uses estimated vs final statements and independent accountant resolution (Section 2.4) and does not provide a locked-box date/ticking fee/leakage regime.

---

## Part 11: Funds Flow Mechanics

### 11.1 Funds Flow Table

| Payment | Amount/Formula | Recipient | Timing | Funding Source | Section Ref |
|---|---|---|---|---|---|
| Cash to sellers | $14,065.20 | Sellers’ Representative | Closing | Buyer cash | 2.1; 2.3(a) (PDF p.22/104) |
| Preferred stock issuance | Value = Closing Payment | Sellers | Closing | Buyer issues Series H preferred | 2.1; Exhibit C |
| Transaction expenses (direct pay) | Per Transaction Expense Statements; subject to cap | Identified payees | Closing | Buyer cash | 2.3(b); 2.7(d) |
| Becker Advance | Amount per legal statement; advance against earnout | Becker LLC | Closing | Buyer cash | 2.3(b) |
| Earnout | 2.5× TTM Adj EBITDA (cap $5M), less offsets and waterfall | Retention bonus payees first; then Sellers’ Rep | Post-close | Buyer cash | 2.5(d); Annex A |

### 11.2 Payment Mechanics

| Element | Details | Section Ref |
|---|---|---|
| Wire instructions timing | Sellers’ Rep designates account ≥ 3 Business Days prior | 2.3(a) |
| Paying agent | Sellers’ Representative | 2.3(a); 9.12 |
| Allocation among multiple sellers | Seller Allocation Certificate (not included in excerpt) | 2.3(a); 2.7(b) |
| Withholding provisions | Buyer can deduct/withhold required amounts; will use reasonable efforts to provide forms / reduce withholding; pay withheld to authority | 2.10 (PDF p.29/104) |

---

## Part 12: Set-Off Rights (All Contexts)

### 12.1 Set-Off Summary

| Context | Set-Off Permitted? | Conditions | Quote | Section Ref |
|---|---:|---|---|---|
| Against escrow | N/A | No escrow | — | — |
| Against earnout | Yes | Offset Adjustment Amount and indemnity liabilities before paying Sellers’ Rep | “remainder… after… payment of all liabilities… under Section 2.4(d)(i) and Section 7.5” | 2.5(d)(ii) |
| General set-off clause | Yes | Subject to procedures + Article VII limitations | “Buyer shall be entitled… to offset…” | 7.9 (PDF p.74/104) |

### 12.2 Limitations on Set-Off

| Limitation | Present? | Details |
|---|---:|---|
| Only finally determined amounts | Yes (for adjustment/earnout) | “finally determined” triggers payments and offsets | 2.4(c)-(d); 2.5(d) |
| Notice requirements | Yes | Section 7.3 procedures apply to setoff claims | 7.9 |
| Cure period | Yes (earnout non-payment) | 30-day cure for Buyer | 2.5(f) |
| Minimum threshold | Yes (basket/deductible) | $100,000 deductible for general claims | 7.4(a) |
| Sole recourse to escrow | No | No escrow; recourse through offsets and direct payments | — |

---

## Part 13: Indemnification Mechanics (Financial Aspects)

### 13.1 Summary Table

| Element | Seller Indemnity | Buyer Indemnity | Section Ref |
|---|---|---|---|
| Cap (general reps) | **$2,800,000** | **$2,800,000** | 7.4(b) (PDF p.71/104) |
| Cap (fundamental reps) | **Closing Payment (as adjusted) + Contingent Payment actually payable** | Same | 7.4(b) |
| Basket type | Deductible | Deductible | 7.4(a) |
| Basket amount | $100,000 | $100,000 | 7.4(a) |
| De minimis threshold | NOT FOUND | NOT FOUND | — |
| Survival (general) | 18 months | 18 months | 7.1 (PDF p.66/104) |
| Survival (fundamental) | 60 days after statute of limitations | Same | 7.1 |
| Survival (tax) | Tax claims governed by 7.7 and 7.2(a)(vi); survival depends on 7.1 categories | — | 7.1; 7.2(a)(vi); 7.7 |

**Verbatim – survival (Section 7.1):**
> 7.1 Survival of Representations, Warranties and Covenants. The representations and warranties of the Company,  
> Buyer and Sellers’ Representative contained in this Agreement, any certificate delivered pursuant hereto or any Seller Document,  
> Company Document or Buyer Document shall survive the execution and delivery of this Agreement and the Closing until and  
> including the eighteen (18) month anniversary of the Closing Date (the “General Survival Period”); provided, that (a) the  
> Fundamental Representations shall survive… until the date that is sixty (60)  
> days following the expiration of the applicable statute of limitations… (b) the Indefinite Representations shall survive… indefinitely, and (c) any claim… fraudulent, intentional or willful breach… can be made… indefinitely… (7.1, PDF p.66/104)

**Verbatim – deductible and caps (Section 7.4):**
> …unless the aggregate amount of Losses… exceeds $100,000 (the “Deductible”)… only the amount… in excess of the Deductible… (7.4(a), PDF p.71/104)  
> …Losses exceeding $2,800,000 (the “General Cap”)… (7.4(b), PDF p.71/104)  
> …Losses exceeding the Closing Payment… plus any Contingent Payment actually payable… (the “Fundamental Cap”)… (7.4(b), PDF p.71/104)

### 13.2 Exclusive Remedy Analysis

**Exclusive remedies clause (verbatim):**
> Except as otherwise expressly provided in this Agreement and except in the case of fraudulent, intentional or willful misconduct,  
> the indemnification provisions set forth in Article VII shall be the sole and exclusive remedies of Buyer (after the Closing) for any breach  
> of or inaccuracy in any representation or warranty or any breach of or failure to perform any covenant or agreement contained in this  
> Agreement… (7.6, PDF p.74/104)

| Question | Answer | Quote |
|---|---|---|
| Is indemnification the exclusive remedy? | **Yes**, subject to stated exceptions | 7.6 (above) |
| Carve-outs from exclusive remedy? | Fraud/intentional/willful misconduct | 7.6; 7.1; 7.4 |
| Is escrow the exclusive source? | No (no escrow) | — |
| Can buyer pursue sellers directly after escrow exhausted? | Yes, through offset and direct payment mechanics; not limited to an escrow | 7.5; 2.4(d)(i) |

### 13.3 Alignment Check

| Element | Aligned? | Issue |
|---|---:|---|
| Escrow period vs. survival period | N/A | No escrow. |
| Escrow amount vs. cap | N/A | No escrow. |
| Basket vs. de minimis | 🟠 | De minimis not found; only deductible. |
| Cap vs. recovery source | 🟠 | Primary recovery is earnout + preferred dividends/interest; may be insufficient depending on timing and earnout achievement. |

**Indemnity payment source / waterfall (verbatim excerpt):**
> Any payment by Sellers’ Representative pursuant to Section 7.3(c) shall be offset against the Contingent Payment…  
> then, and only then, shall such payments be offset against any amounts due and payable on the dividends or interest due in connection  
> with the Staffing 360 Preferred Stock Payment… (7.5, PDF p.72/104)

---

## Part 14: Tax Provisions (Beyond Definition)

### 14.1 Tax Allocation

| Element | Details | Section Ref |
|---|---|---|
| Pre-closing tax responsibility | Sellers’ Rep indemnifies for pre-close taxes net of reserves; tax return cooperation regime | 7.2(a)(vi); 7.7 |
| Straddle period allocation method | Deemed closing of books as of close of Closing Date; annualized deductions prorated by days | 7.7(b) (PDF p.74/104) |
| Transfer taxes allocation | 50% Sellers’ Rep / 50% Buyer | 7.7(e) (PDF p.74/104) |
| Withholding mechanics | Buyer/Sellers’ Rep/Company can withhold required taxes; withheld treated as paid | 2.10 (PDF p.29/104) |
| Gross-up provisions | NOT FOUND | — |

**Verbatim – straddle allocation (7.7(b) excerpt):**
> Any allocation… shall be made by means of a deemed closing of the books… as of the close of the  
> Closing Date; provided… annual… deductions… allocated… in proportion to the number of days… (7.7(b), PDF p.74/104)

### 14.2 Tax Covenants

| Covenant | Present? | Key Terms |
|---|---:|---|
| Cooperation on returns | Yes | Draft returns 20 days before due date; resolve; dispute to IA | 7.7(a)(ii) |
| No amended returns | Yes (post-close restrictions) | Buyer/Company not to amend returns or change material elections absent law/consent | 7.7(c) |
| Tax contest provisions | Yes | Buyer controls certain tax claims; consent rights apply for Seller period items | 7.7(d) |
| Refund allocation | NOT FOUND in extracted snippets | — |

### 14.3 Tax Indemnity Overlap

- Tax indemnity present? **Yes**  
- Verbatim (7.2(a)(vi) excerpt):  
  > (vi) (A) all Taxes of the Company and the Subsidiaries (or any predecessor thereof) net of any reserves  
  > therefor… for any taxable period ending on or before the Closing Date… and for… Straddle Period… (7.2(a)(vi), PDF p.67/104)  
- Overlap with Working Capital tax accruals addressed? **NOT EXPLICITLY**  
- Quote anti-overlap language: **NOT FOUND**  
- Recommendation: add cross-bucket “no double counting” for taxes across WC/Indebtedness/tax indemnity.

---

## Part 15: Insurance Provisions

### 15.1 R&W Insurance

| Element | Details | Section Ref |
|---|---|---|
| R&W insurance required/obtained? | NOT FOUND | — |
| Premium allocation | NOT APPLICABLE | — |
| Retention amount | NOT APPLICABLE | — |
| Impact on indemnification | NOT APPLICABLE | — |

### 15.2 D&O Tail

| Element | Details | Section Ref |
|---|---|---|
| D&O tail required? | NOT FOUND | — |
| Premium payment responsibility | NOT FOUND | — |
| Captured in Transaction Expenses? | Not explicit | — |
| Policy term | NOT FOUND | — |

---

## Part 16: Intercompany Treatment

### 16.1 Intercompany Balances

| Element | Details | Section Ref |
|---|---|---|
| Intercompany balances addressed? | WC excludes affiliate receivables; Indebtedness includes affiliate payables; Related Person Indebtedness must be extinguished | 1.1; 6.1 |
| Settlement required pre-close? | Yes (related person indebtedness extinguishment requirement) | 6.1 (PDF p.54/104) |
| Included in Indebtedness? | Yes (clause (i)) | 1.1 (PDF p.13/104) |
| Included in Working Capital? | Receivables excluded | 1.1 (PDF p.10/104) |
| Which direction (receivables vs. payables)? | Receivables excluded from WC; payables included in Indebtedness | — |

**Verbatim – related person settlement (6.1 excerpt):**
> …the “Restricted Period”), and (ii) the Related Person Indebtedness including all related person accounts payable and receivable shall be extinguished prior to the Closing. (6.1, PDF p.54/104)

### 16.2 Intercompany Agreements

| Element | Details |
|---|---|
| Termination required? | NOT FOUND |
| Transition services? | NOT FOUND |

---

## Part 17: FX Mechanics

**SINGLE CURRENCY DEAL** (USD). No FX provisions identified.

---

## Part 18: Financial Representations

### 18.1 Financial Statements Rep

**Verbatim:** (Section 4.7(a), PDF p.33/104)
> 4.7 Financial Statements.  
> (a) Set forth on Schedule 4.7(a) are copies of (i) the audited consolidated balance sheets and financial statements of  
> the Company and the Subsidiaries as of September 30, 2019, (ii) the internal consolidated balance sheets and financial statements of the  
> Company and the Subsidiaries as of September 30, 2020, (iii) the internal consolidated balance sheets and financial statements of the  
> Company and the Subsidiaries as of September 30, 2021, and (iv) the internal consolidated balance sheet of the Company and the  
> Subsidiaries as of February 28, 2022 and the related statements of income and cash flows of the Company and the Subsidiaries for the  
> five-month period then ended (such statements referred to in subsections (i) - (iv) immediately above, including the related notes and  
> schedules thereto, are referred to herein as the “Financial Statements”). Each of the Financial Statements is complete and correct in all  
> material respects, has been prepared in accordance with GAAP consistently applied without modification of the accounting principles  
> used in the preparation thereof throughout the periods presented and fairly presents the combined and consolidated financial position,  
> results of income, and cash flows, as applicable, of the Company and the Subsidiaries as of the dates and for the periods indicated  
> therein; provided that the most recent Financial Statements are subject to normal year end adjustments and lack of footnotes (none of  
> which adjustments or footnotes would be material in the aggregate) and other presentation items. The consolidated balance sheet of the  
> Company and the Subsidiaries as of February 28, 2022, is referred to herein as the “Balance Sheet” and February 28, 2022 is referred  
> to herein as the “Balance Sheet Date.”

**Analysis:**

| Element | Present? | Assessment |
|---|---:|---|
| “Fairly present” | Yes | Market standard. |
| “Accurate and complete” | No | Uses “complete and correct in all material respects” (moderate standard). |
| “In all material respects” | Yes | Standard qualifier. |
| “Taken as a whole” | Implicit | Consolidated position. |
| Knowledge qualifier | No | Buyer-favorable. |
| Books and records qualifier | No | Buyer-favorable. |
| GAAP/IFRS compliance | GAAP | Standard. |
| Consistency | Yes | “consistently applied without modification…” | Seller-protective. |
| Interim period carve-outs | Yes | “subject to normal year end adjustments and lack of footnotes…” | Standard. |

### 18.2 No Undisclosed Liabilities Rep

**Verbatim:** (Section 4.8, PDF p.34/104)
> 4.8 No Undisclosed Liabilities. Except as set forth on Schedule 4.8, the Company and the Subsidiaries do not have  
> any Indebtedness or Liabilities required under GAAP to be reflected on a balance sheet or the notes thereto, other than those (a)  
> specifically reflected on and fully reserved against in the Balance Sheet; (b) incurred in the Ordinary Course of Business since the  
> Balance Sheet Date (none of which is a Liability resulting from breach of contract, breach of warranty, tort, infringement or  
> misappropriation) or (c) that are not material to the Company and the Subsidiaries

**Carve-outs:** (a) reserved on Balance Sheet; (b) ordinary course since Balance Sheet Date; (c) immaterial items.

### 18.3 Absence of Changes Rep

**Verbatim (excerpt capturing the operative structure):** (Section 4.9, PDF pp.34–35/104)
> 4.9 Absence of Certain Developments. Except as expressly required by this Agreement or as set forth on Schedule  
> 4.9, since the Balance Sheet Date (a) the Company and the Subsidiaries have conducted their respective businesses only in the Ordinary  
> Course of Business, (b) there has not been any event, change, occurrence or circumstance that… has had or could reasonably be expected  
> to have a Material Adverse Effect and (c) neither the Company nor any Subsidiary has:  
> (i) … declared… dividend… or repurchased… securities…;  
> (ii) transferred, issued, sold, pledged… equity interests…;  
> (iii) effected any recapitalization…;  
> (iv) amended the organizational documents…;  
> (v) … increased salary… granted… bonus… increased benefits…;  
> (xxi) changed or modified its credit, collection or payment policies…;  
> (xxii) took any action which may have adversely affect the ability of the Parties to consummate the transactions…;  
> (xxiii) enter into any new line of business, or discontinue any existing line of business;  
> (xxiv) delay/postpone payment of A/P (other than good-faith disputes) or accelerate collections…;  
> (xxv) fail to keep in full force and effect all insurance policies…;  
> (xxvi) agreed to do anything… prohibited… or that could reasonably be expected to have a material adverse effect… (4.9, PDF pp.34–35/104)

**Analysis (financially significant points):**
- Strong “no leakage / no unusual actions” package between Balance Sheet Date and closing.  
- Explicitly polices payables/receivables acceleration (working capital quality protection).  
- Cross-links “Transaction Expense” concepts into conduct rep (see 4.14(a)(xi) contract list referencing Transaction Expense).

---

## Part 19: Material Adverse Change/Effect

### 19.1 MAC/MAE Definition

**Verbatim:** (Section 1.1 definition, PDF p.14/104)
> “Material Adverse Effect” means any result, occurrence, fact, change, event or effect (whether or not constituting a  
> breach of a representation, warranty or covenant set forth in this Agreement) that, individually or in the aggregate with any such other  
> results, occurrences, facts, changes, events or effects (a) could reasonably be expected to have a material adverse effect on the projected  
> business, operations, prospects, assets, Liabilities, condition (financial or otherwise) or results of operations (including EBITDA or  
> cash flow), in each case, of the Company and the Subsidiaries, taken as a whole, (b) prevents or materially impairs or delays, or could  
> reasonably be expected to prevent or materially impair or delay, the ability of any of the Company or any of the Sellers to consummate  
> the transactions contemplated by this Agreement or perform their duties under this Agreement or the Seller Documents or Company  
> Documents, or (c) is or could reasonably be expected to be materially adverse to the ability of the Company or any the Subsidiaries to  
> operate its business immediately after the Closing substantially in the manner as such business was operated immediately prior to the  
> Closing; provided, that none of the following shall be deemed, either alone or in combination, to constitute a Material Adverse Effect,  
> nor shall any of the following be taken into account in determining whether there has been a Material Adverse Effect: any event,  
> change, development or effect resulting from or arising out of (A) general economic conditions, (B) general conditions in the industry  
> in which the Company and the Subsidiaries operate, or (C) any natural disaster, pandemic, or any acts of terrorism, sabotage, military  
> action or war or any escalation or worsening thereof, except, in the case of the foregoing clauses (A), (B), and (C), the extent that such  
> matters disproportionately impact the Company or any of the Subsidiaries relative to other businesses in the industry in which the  
> Company or any of the Subsidiaries operate. For the avoidance of doubt, the parties agree that the terms “material,” “materially” and  
> “materiality” as used in this Agreement with an initial lower case “m” shall have their respective customary and ordinary meanings,  
> without regard to the meaning ascribed to the term Material Adverse Effect.

### 19.2 Carve-Outs

| Carve-Out Category | Included? | Specific Language |
|---|---:|---|
| General economic conditions | Yes | “(A) general economic conditions” |
| Industry conditions | Yes | “(B) general conditions in the industry…” |
| Changes in law | No (not in excerpted carveouts) | — |
| Changes in GAAP/IFRS | No (not in excerpted carveouts) | — |
| Announcement of transaction | No | — |
| Actions required by agreement | No | — |
| Actions consented to by buyer | No | — |
| Pandemics | Yes | “pandemic” |
| War/terrorism | Yes | “acts of terrorism… war…” |

### 19.3 “Disproportionate Impact” Qualifier

- Present? **Yes**  
- Language: “except… to the extent that such matters disproportionately impact the Company…” (definition above)

---

## Part 20: Comprehensive Risk Assessment

### 20.1 Top 10 Financial Risks (Ranked)

| Rank | Risk | Definitions/Sections Involved | Severity | Likelihood | Recommendation |
|---:|---|---|---|---|---|
| 1 | **“Closing Balance Sheet Changes” is subjective + Exhibit B not visible in provided text** | 1.1; 2.4; Exhibit B | High | High | Obtain Exhibit B; lock line-item mapping and examples; add “no hindsight” + clear sign convention. |
| 2 | **Potential asymmetry in Adjustment Amount settlement** | 2.4(d); Adjustment Amount | High | Medium | Confirm missing positive-pay clause; add explicit bilateral settlement. |
| 3 | **Transaction Expenses definition is extremely broad (contingent + post-close)** | 1.1; 2.3; 2.4 | High | Medium | Restrict to scheduled, capped, closing-incurred expenses; exclude contingent unless listed. |
| 4 | **Tax overlap across Indebtedness/WC/tax indemnity** | 1.1; 7.2(a)(vi); 7.7 | High | Medium | Add no-double-count and reserve reconciliation. |
| 5 | **Seller credit risk: consideration largely in Buyer preferred stock** | 2.1; Exhibit C | High | Medium | Add security package: escrow, redemption protections, covenants, or RWI. |
| 6 | **Earnout metric discretion and speculative addbacks** | Exhibit A; 2.5 | Medium | High | Define addbacks tightly; require TB bridge; strengthen audit rights/covenants. |
| 7 | **Set-off rights reduce earnout reliability** | 2.5(d); 7.5; 7.9 | Medium | High | Cap setoff; require final determinations; consider escrow. |
| 8 | **Indebtedness includes taxes + affiliate obligations** | 1.1 | Medium | Medium | Narrow definition or confine to reps/indemnity; add settlement certificate. |
| 9 | **Becker Advance routing complexity** | 2.3(b); 2.5(d); 7.5 | Medium | Medium | Clarify waterfall; reconcile with Closing Payment exclusion; fix cross-references. |
| 10 | **Working capital definition (Feb 28) vs “Closing” terminology** | 1.1; 4.29 | Medium | Medium | Clarify that WC term is a fixed reference only; avoid misuse in adjustments. |

### 20.2 Double-Count Risks Summary

| Item | Risk Level | Mitigation Present? | Action Needed |
|---|---|---:|---|
| Transaction expenses vs accrued expenses/WC | High | No | Add explicit exclusion or reconciliation. |
| Taxes in Indebtedness vs tax indemnity vs WC accruals | High | No | Add “no double counting” clause and reserve rule. |
| Swap break costs vs debt premiums | Medium | No | Add routing rule. |

### 20.3 Gap Risks Summary

| Item | Risk Level | Currently Addressed? | Action Needed |
|---|---|---:|---|
| Deposits in transit | Medium | No | Add cut-off rules. |
| Overdraft netting | Medium | No | Add explicit treatment. |
| Deferred revenue/customer deposits | Medium | Unclear | Make explicit and tie to Exhibit B. |

---

## Part 21: Negotiation Analysis

### 21.1 Buyer-Favorable Provisions

| Provision | Why Buyer-Favorable | Typical Seller Pushback | Suggested Compromise |
|---|---|---|---|
| Broad Transaction Expenses (contingent/post-close) | Expands deductions from value | Limit to closing-incurred, scheduled items | Cap + schedule + evidence; exclude contingent unless listed |
| Buyer discretion over earnout operations | Buyer can manage without earnout duty | Add ordinary course / reasonable efforts | Add limited “no bad faith interference” + targeted covenants |
| Setoff against earnout and preferred economics | Reduces seller certainty | Require final determinations and caps | Cap setoff; escrow for disputed amounts |
| Indebtedness includes taxes and affiliates | Expands scope of “debt-like” | Narrow to financial debt | Move tax items to tax covenant; exclude affiliates post-settlement |
| Exclusive remedy + tight structures | Channels claims to buyer-favorable mechanisms | Fraud carve-out + process fairness | Keep exclusivity but add balanced access/timelines |

### 21.2 Seller-Favorable Provisions

| Provision | Why Seller-Favorable | Typical Buyer Pushback | Suggested Compromise |
|---|---|---|---|
| GAAP consistently applied | Prevents policy shifts | Buyer wants flexibility | Add hierarchy (definitions/illustrations first; then GAAP) |
| IA as expert, range-bounded | Limits extreme adjustments | Buyer wants “correct” figure | Keep range bound but require better disclosure packages |
| Earnout floor at zero (no negative) | No clawback | Buyer wants collar | Keep zero floor; tighten EBITDA to reduce gaming |

### 21.3 Key Negotiation Leverage Points

| Issue | Current Position | Importance | Negotiability | Suggested Approach |
|---|---|---|---|---|
| Benchmark Balance Sheet (Exhibit B) | Referenced; not visible in excerpt | High | Medium | Condition closing on agreed Exhibit B + mapping + example. |
| Transaction Expenses scope | Very broad | High | High | Replace with scheduled list + cap; remove contingent. |
| Earnout discretion / audit trail | Discretionary | Medium | Medium | Add TB bridge, audit rights, and specific prohibited actions. |
| Security for seller consideration | Mostly preferred stock | High | Medium | Escrow/redemption covenants/credit support. |
| Tax overlap | Multi-bucket | High | High | Add explicit reconciliation and no-double-count. |

---

## Part 22: Suggested Revisions

### Revision 1: Clarify sign convention and settlement symmetry for Adjustment Amount

**Current Language (definitions):** see Closing Balance Sheet Changes / Adjustment Amount (PDF p.9/104)  
**Issue:** Ambiguous sign convention and risk of one-way economics.

**Suggested Revision:** Add an illustration schedule showing:  
- Benchmark balance sheet line items  
- Closing balance sheet line items  
- “negative differential” computation as an absolute value  
- Adjustment Amount settlement clause for both positive and negative outcomes

**Likely Pushback:** Buyer prefers flexibility to protect downside without upside pay-up.  
**Fallback:** Pay positive adjustments in additional preferred stock rather than cash.

### Revision 2: Narrow Transaction Expenses

**Current Language:** includes “accrued or contingent” and “whether… after the Closing” (PDF p.18/104)  
**Suggested Revision:** Limit to expenses incurred and payable as of Effective Time, plus scheduled items with caps.  
**Fallback:** Permit contingents only if listed + capped + supported by executed contracts pre-close.

### Revision 3: Tax anti-duplication clause

**Suggested clause:** “For the avoidance of doubt, no item shall be counted more than once as Indebtedness, Working Capital, a Closing Balance Sheet Change, a Transaction Expense, or an indemnifiable Tax. Taxes accrued on the Balance Sheet reduce any tax indemnity dollar-for-dollar.”

---

## Part 23: Counsel Questions & Open Issues

### 23.1 Questions Requiring Clarification Before Signing

| # | Question | Relevant Section | Why It Matters | Suggested Resolution |
|---:|---|---|---|---|
| 1 | Provide Exhibit B and confirm exact line items for “Closing Balance Sheet Changes” | 1.1; 2.4 | Core purchase price protection | Attach and map to TB; add example and sign convention |
| 2 | Confirm whether any clause provides Buyer-to-seller payment for positive Adjustment Amount | 2.4(d) | Symmetry and economics | Add explicit clause if missing |
| 3 | Define “outside the Ordinary Course” for balance sheet changes | 1.1 | Prevent disputes | Add objective list and carveouts |
| 4 | Tighten Transaction Expenses scope and evidence | 1.1; 2.3; 2.4 | Prevent value leakage | Schedule list + cap + documentation |
| 5 | Tax overlap and reserve reconciliation | 1.1; 7.2(a)(vi); 7.7 | Avoid double count | Add no-double-count clause + reconciliation schedule |
| 6 | Preferred stock economics and seller credit exposure | Exhibit C | Consideration certainty | Add protections (escrow, covenants, redemption) |

### 23.2 Diligence Items Triggered by Definitions

| Definition/Provision | Diligence Item Needed | Priority |
|---|---|---|
| Benchmark Balance Sheet / balance sheet changes | Obtain Exhibit B; build mapping to TB; identify outside-ordinary-course events and quantify | High |
| Transaction Expenses | Collect all Transaction Expense Statements; validate bonuses/severance/swap costs; confirm contingent items and caps | High |
| Earnout (Adjusted EBITDA) | Build detailed EBITDA bridge; define addbacks; confirm auditability and data access | High |
| Preferred stock terms | Model dividends, redemption, conversion; evaluate issuer credit and restrictive covenants | High |
| Taxes | Map CARES Act deferrals and pre-close tax exposures; reconcile tax reserves vs indemnity and definitions | High |

---

## Part 24: Executive Summary

### 24.1 Deal Overview (2-3 sentences)

This is a 100% stock purchase of Headway Workforce Solutions, Inc. by Staffing 360 Solutions, Inc. with headline consideration of **$9.014M** plus an earnout (Contingent Payment) of up to **$5.0M** based on trailing 12-month Adjusted EBITDA. The closing consideration is mostly Buyer Series H convertible preferred stock (only **$14,065.20** cash), and the purchase price is reduced by “Closing Balance Sheet Changes” outside ordinary course versus a benchmark balance sheet and by estimated transaction expenses, with post-close true-up and indemnity payments recovered primarily through offsets against the earnout and then preferred dividends/interest.

### 24.2 Overall Assessment

| Dimension | Rating | Key Drivers |
|---|---|---|
| Definitions clarity | 🟠 | Broad definitions; reliance on Exhibit B; missing classic cash/net debt terms. |
| Anti-duplication robustness | 🟠 | Limited “without double counting”; tax/expense overlaps remain. |
| Price mechanics clarity | 🔴 | Balance-sheet-change construct + sign conventions; potential asymmetry. |
| True-up process fairness | 🔴 | Buyer prepares final statements; IA is balanced; seller access for 2.4 not explicit. |
| Escrow terms | 🟠 | No escrow; security is via offsets and preferred economics. |
| Overall balance (Buyer ↔ Seller) | 🔴 | Buyer-favorable: broad deductions, setoffs, and seller credit/metric discretion risk. |

### 24.3 Top 5 Issues to Raise with Partner/Client

1. **Benchmark balance sheet and “Closing Balance Sheet Changes” methodology**: obtain Exhibit B, mapping, and illustrative calculation.  
2. **Adjustment Amount economics**: confirm settlement symmetry and add explicit clause(s) if missing.  
3. **Transaction Expenses definition**: remove contingent/post-close scope, schedule and cap items.  
4. **Tax overlaps**: add no-double-count and reserve reconciliation across WC/Indebtedness/tax indemnity.  
5. **Seller security**: preferred-stock-heavy consideration + earnout subordination—evaluate credit protections.

### 24.4 30-Second Deal Summary

“Headline is **$9.014M** plus up to **$5.0M** earnout, paid mostly in Staffing 360 Series H convertible preferred stock—only **$14k** cash at close.

Key mechanics: preferred stock value equals Purchase Price minus cash payment, minus any ‘Closing Balance Sheet Changes’ outside ordinary course versus a benchmark balance sheet, minus estimated transaction expenses. Post-close, Buyer finalizes balance sheet changes and expenses, and disputes go to an independent accountant.

No escrow: Buyer recovers adjustment shortfalls and indemnity by offsetting against the earnout first, then against preferred dividends/interest.

Key risks: subjective benchmark balance-sheet-change construct (and Exhibit B critical), and broad transaction expense definition; overall buyer-favorable.”


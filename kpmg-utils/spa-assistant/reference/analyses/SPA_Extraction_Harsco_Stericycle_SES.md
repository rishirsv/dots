
# SPA Knowledge Base Extraction – Stock Purchase Agreement (Stericycle / CEI Holding / Harsco)

**Source document:** Provided PDF “Harsco Stock Purchase Agreement.pdf” (118 pages).  
**Important:** The Agreement references multiple **exhibits and schedules (Exhibits A–H; schedules such as Schedule 1.01(e), Schedule 5.08(a), etc.)** that are **not included** in the provided PDF. Where such materials are necessary to complete an extraction (e.g., Accounting Principles hierarchy; Sample Closing Statement account line items), this output marks them as **NOT FOUND (not in provided PDF)**.

---

## Part 1: Document Overview

### 1.1 Metadata

| Field | Value |
| --- | --- |
| Deal Name / Project Code | NOT STATED in Agreement (SEC Exhibit 2.1). Common reference: Stericycle Environmental Solutions sale to Harsco (via CEI Holding). |
| Execution Date | February 6, 2020 |
| Parties (Buyer / Seller) | Buyer: CEI Holding, LLC (Delaware LLC)<br>Seller: Stericycle, Inc. (Delaware corporation)<br>Guarantor (limited): Harsco Corporation (solely for Section 11.16 guarantee provisions). |
| Target Company / Business | Stericycle Environmental Solutions, Inc. (Delaware corporation) and its subsidiaries after Pre-Closing Business Transfers (the “Group Companies”); business described as hazardous waste and environmental solutions services in U.S. & Puerto Rico. |
| Jurisdiction / Governing Law | Delaware law. See Section 11.05 (PDF p. 111). |
| Deal Type | Strategic (operating company acquisition; Buyer is an affiliate of Harsco, which provides a guarantee). |
| Pricing Structure | Completion Accounts with post-closing true-up (Estimated Closing Statement pre-close; Closing Statement post-close; Adjustment Amount paid post-close). |
| Consideration Type | All-cash (cash purchase price with cash/debt/NWC/transaction expense adjustments). Base amount: $462,500,000. |
| R&W Insurance | Yes (R&W Insurance Policy referenced; subrogation limitations in Section 5.25; R&W policy proceeds treated as additive in damages provisions). |
| Estimated Deal Value | Base Purchase Price: $462,500,000 (subject to ESOL PR Purchase Price reduction if applicable, and completion accounts adjustments). |



**Agreement Preamble (verbatim excerpt):**
```text
STOCK PURCHASE AGREEMENT
This STOCK PURCHASE AGREEMENT (this “Agreement”), dated as of February 6, 2020, is made by and among Stericycle, Inc., a Delaware
corporation (“Seller”), and CEI Holding, LLC, a Delaware limited liability company, (“Buyer”), and, solely with respect to Section 11.16 and Article XI
(solely as such Article relates to Section 11.16), Harsco Corporation, a Delaware corporation (the “Guarantor”). Each of Seller, Buyer and Guarantor is
referred to herein as a “Party” and collectively as the “Parties”.
W I T N E S S E T H:
WHEREAS, Seller owns all of the issued and outstanding shares of common stock, par value $10.00 per share (the “Purchased Shares”), of
Stericycle Environmental Solutions, Inc., a Delaware corporation (the “Company”);
WHEREAS, in connection with the transactions contemplated by this Agreement, Seller shall, and shall cause its Subsidiaries to, use
commercially reasonable efforts to effect the Pre-Closing Business Transfers (as defined below), upon the terms and subject to the conditions hereinafter
set forth;
WHEREAS, the Company and its Subsidiaries, after giving effect to the Pre-Closing Business Transfers, are engaged in the environmental
solutions business that provides comprehensive hazardous waste, disposal, recycling and management services, including reporting, collection,
transportation, disposal, recycling, remediation, lab packing, training and emergency response in the United States and Puerto Rico to retail and
commercial businesses (collectively, the “Business”); provided that the Business shall exclude the Retained Businesses;
WHEREAS, Buyer desires to acquire the Business by purchasing the Purchased Shares from Seller, and Seller desires to sell the Business by
selling the Purchased Shares to Buyer, in each case, upon the terms and subject to the conditions hereinafter set forth; and
WHEREAS, Guarantor is an Affiliate of Buyer, and Guarantor desires to become a party to this Agreement solely with respect to Section 11.16
and Article XI (solely as such Article relates to Section 11.16) and to perform its obligations set forth in Section 11.16 in order to induce Seller to enter
into this Agreement.
NOW, THEREFORE, in consideration of the premises and mutual covenants contained herein and other good and valuable consideration, the
receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:
```


### 1.2 Document Structure

Key Articles / Sections (page references are to the provided PDF; internal pagination in the Table of Contents differs):

- **Definitions:** Article I; Section 1.01 (Definitions) (PDF pp. 6–20)
- **Purchase Price / Consideration:** Section 2.03 (Purchase Price; Withholding) (PDF p. 26)
- **Closing Mechanics:** Section 2.04 (Closing) (PDF pp. 26–28)
- **Closing Statements / True-Up:** Section 2.05 (Adjustment Amount) (PDF pp. 28–31)
- **Escrows / Holdbacks:** **NOT FOUND** (no escrow agreement or holdback mechanics in the provided SPA text)
- **Earnout:** **NO EARNOUT PROVISION** (no earnout article/section; no earnout consideration mechanics)
- **Indemnification:** Article IX; Sections 9.01–9.08 (PDF pp. 95–107)
- **Tax Matters (allocation, returns, straddle):** Article VI; Sections 6.01–6.06 (PDF pp. 84–89)
- **Intercompany balances:** Section 5.08 (Intercompany Balances; Affiliate Transactions) (PDF pp. 67–68)
- **R&W Insurance:** Section 5.25 (R&W Insurance Policy) (PDF p. 83); plus references in Article IX damages framework
- **MAC/MAE:** “Material Adverse Effect” definition in Article I (PDF p. 15)

**Schedules / Exhibits referenced in the Agreement:**
- The Table of Contents lists **Exhibits A–H** (including Exhibit A Accounting Principles and Exhibit C Sample Closing Statement), and numerous schedules (e.g., Schedule 5.08(a), Schedule 1.01(e), etc.).
- **However, the provided PDF appears to include only the SPA text and signature pages; the referenced exhibits and schedules are not included.** Where exhibit/schedule content is required to answer a question (e.g., Accounting Principles hierarchy; Sample Closing Statement line items; Schedule 1.01(e) replacement costs), this output marks the item as **NOT FOUND (not in provided PDF)**.


## Part 2: Financial Definitions (Deep Extraction)

### Definition Name: Purchase Price

**Section Reference:** Section 2.03(a) (PDF p. 26)

**Full Verbatim Text:**

```text
(a) The “Purchase Price” in the aggregate for the Purchased Shares shall, subject to the adjustments set forth in Section 2.05, be an
amount in cash equal to (i) $462,500,000 (minus, if applicable, the ESOL PR Purchase Price), plus, (ii) the Estimated Working Capital Adjustment
Amount, minus (iii) the Estimated Closing Date Indebtedness, plus (iv) the Estimated Closing Date Cash, minus (v) the Estimated Closing Date
Transaction Expenses.
```

**Plain-English Summary:**

The Purchase Price is the cash consideration paid at Closing for the Purchased Shares. It starts from a $462.5m base amount (subject to a reduction if the ESOL PR election mechanics apply) and then applies completion-accounts adjustments for Working Capital, Indebtedness, Cash and Cash Equivalents, and unpaid Transaction Expenses.

Practically, this is intended to deliver a cash-free, debt-free equity value at Closing with a working-capital normalization, while shifting deal-related costs and pre-close obligations of the Group Companies back to Seller through a dollar-for-dollar reduction in the price.

**Component Breakdown:**

| Component | Included? | Verbatim Language | Market Position | Notes |
| --- | --- | --- | --- | --- |
| Base amount | Yes | $462,500,000 | 🟢 Market Standard | Acts as headline consideration before completion accounts adjustments. |
| ESOL PR Purchase Price reduction | Conditional | “minus, if applicable, the ESOL PR Purchase Price” | 🟠 Deal-specific | Optional election mechanics; reduces Purchase Price if ESOL PR Items carved out / separately purchased. |
| Working capital adjustment | Yes | “plus … the Estimated Working Capital Adjustment Amount” | 🟢 Market Standard | Completion accounts feature; note collar structure via Target Closing Net Working Capital. |
| Indebtedness adjustment | Yes | “minus … the Estimated Closing Date Indebtedness” | 🟢 Market Standard | Debt-free mechanic (subject to breadth of Indebtedness definition). |
| Cash adjustment | Yes | “plus … the Estimated Closing Date Cash” | 🟢 Market Standard | Cash-free / debt-free mechanic adds cash; subject to exclusions (restricted/trapped/escrow/collateral). |
| Transaction Expenses | Yes | “minus … the Estimated Closing Date Transaction Expenses” | 🟢 Market Standard | Shifts deal costs borne by Group Companies to seller through price reduction. |

**Anti-Duplication Language:**

| Phrase | Present? | Exact Quote | Scope |
| --- | --- | --- | --- |
| without duplication | No (in clause itself) | — | Formula-level (relies on definition-level ‘without duplication’ in other defined terms). |
| to the extent not included in | No | — | — |
| for the avoidance of doubt | No | — | — |

**Red Flag Language Identified:**

| Phrase | Why It’s Concerning | Severity |
| --- | --- | --- |
| Purchase Price is based on ‘Estimated’ components at Closing; Buyer prepares post-close final statement. | Estimation risk and control asymmetry can create disputes or cashflow timing impacts. | Medium |
| ESOL PR Purchase Price mechanics reduce headline price but are not part of the adjustment formula in 2.03(a) beyond the explicit reduction. | Can create confusion between the $462.5m headline and the net paid/received if election exercised. | Low |

**Overall Market Position Assessment:** 🟠 Slightly Off-Market (Buyer)

**Reasoning:** The cash-free/debt-free completion accounts structure is market-standard, but the combination of (i) Buyer-controlled post-close calculations (Buyer prepares the Closing Statement), (ii) broad Debt/Transaction Expense definitions, and (iii) reliance on Accounting Principles and a Sample Closing Statement that are referenced but not included in the provided PDF increases Buyer leverage and dispute risk.

**Counsel Questions to Raise:**
1. Were Exhibit A (Accounting Principles) and Exhibit C (Sample Closing Statement) part of the executed agreement package? If yes, obtain them; if no, confirm what accounting policies/line items control.
2. Confirm whether any purchase price adjustment is subject to any cap/collar other than the Target Closing Net Working Capital collar.
3. Confirm how ESOL PR Purchase Price is determined, documented, and funded if Buyer elects to purchase ESOL PR Items separately.

**Suggested Revisions (if Off-Market):**

- **Original:** (No explicit formula-level anti-duplication in Section 2.03(a).)
  **Suggested:** Add to Section 2.03(a): “All components shall be calculated without duplication. Any item included in Indebtedness or Transaction Expenses shall not be included in Net Working Capital, and cash items excluded from Cash and Cash Equivalents shall not be counted elsewhere.”
  **Rationale:** Reduces double-counting disputes and aligns the formula with the routing language embedded in individual definitions.


---


### Definition Name: Cash and Cash Equivalents

**Section Reference:** Section 1.01 (Definitions) (PDF pp. 6–20; definition appears at PDF p. 8)

**Full Verbatim Text:**

```text
“Cash and Cash Equivalents” of any Person as of any date means the cash and cash equivalents and deposits required to be reflected as cash and
cash equivalents and deposits on a consolidated balance sheet of such Person and its Subsidiaries prepared in accordance with the Accounting
Principles; provided, however, that Cash and Cash Equivalents shall (i) include all uncleared checks, drafts and payments received by such Person and
(ii) be calculated net of (A) any restricted cash held as security deposits by third parties, (B) all issued but uncleared checks, drafts and payments issued
by such Person, (C) any insurance cash proceeds and indemnification payments actually received by such Person with respect to any casualty loss or
otherwise in respect of Liabilities to the extent such losses or Liabilities have not been discharged or otherwise paid as of immediately prior to the
Closing, (D) any Cash and Cash Equivalents held for the benefit of third parties, (E) any Cash and Cash Equivalents which are not freely usable by such
Person because they are subject to restrictions or limitations on use or distribution by applicable Law or Contracts (including Cash and Cash Equivalents
held in escrow) and (F) any Cash and Cash Equivalents of such Person held as collateral in support of outstanding letters of credit, bonds or similar
credit support obligations.
```

**Plain-English Summary:**

This definition measures the Group Companies’ cash position for purchase price purposes by reference to what would appear as cash, cash equivalents, and deposits on a consolidated balance sheet prepared under the Accounting Principles. It generally gives Seller credit for true liquid cash, but reduces that credit for items that are restricted, pledged, or otherwise not freely usable.

It includes receipts in transit (received but uncleared items) and nets out issued but uncleared checks to reduce timing mismatches around the Closing cut-off.

**Component Breakdown:**

| Component | Included? | Verbatim Language | Market Position | Notes |
| --- | --- | --- | --- | --- |
| Cash on hand / bank deposits | Yes | “...cash and cash equivalents and deposits required to be reflected as cash and cash equivalents and deposits...” | 🟢 Market Standard | Anchored to balance sheet presentation under Accounting Principles. |
| Cash equivalents | Yes | “cash and cash equivalents...” | 🟢 Market Standard | Implicitly includes typical short-dated liquid instruments. |
| Deposits in transit | Yes (by inclusion) | “...uncleared checks, drafts and payments received...” | 🟢 Market Standard | Treats received but uncleared items as cash. |
| Outstanding checks | Yes (as netting) | “...calculated net of ... all issued but uncleared checks, drafts and payments issued...” | 🟢 Market Standard | Effectively reduces cash for outstanding checks. |
| Restricted cash | No (excluded) | “...calculated net of ... any restricted cash...” | 🟠 Slightly Off-Market (Buyer) | Excluding restricted cash is common; breadth matters because definition also excludes ‘not freely usable’ cash. |
| Trapped cash / not freely usable cash | No (excluded) | “...Cash and Cash Equivalents which are not freely usable ... subject to restrictions or limitations...” | 🟠 Slightly Off-Market (Buyer) | Can exclude operational cash subject to ordinary-course restrictions or foreign exchange controls (if any). |
| Escrowed cash | No (excluded) | “...including Cash and Cash Equivalents held in escrow...” | 🟢 Market Standard | Generally excluded (escrow isn’t a true economic benefit at Closing). |
| Insurance proceeds linked to liabilities | No (excluded) | “...any insurance cash proceeds and indemnification payments...to the extent such losses ... have not been discharged...” | 🟢 Market Standard | Prevents Buyer from being credited for cash that economically belongs to a pending liability. |
| Cash posted as collateral | No (excluded) | “...Cash and Cash Equivalents ... posted as collateral in support of outstanding letters of credit...” | 🟠 Slightly Off-Market (Buyer) | Often excluded, but can be negotiated if collateral will be released quickly post-close. |
| Overdraft netting | Not addressed | — | 🟠 Slightly Off-Market (Ambiguous) | No explicit overdraft netting rule; can create Cash↔Debt or Cash↔WC disputes depending on bank sweep mechanics. |

**Anti-Duplication Language:**

| Phrase | Present? | Exact Quote | Scope |
| --- | --- | --- | --- |
| without duplication | No | — | — |
| to the extent not included in | No | — | — |
| for the avoidance of doubt | No | — | — |

**Red Flag Language Identified:**

| Phrase | Why It’s Concerning | Severity |
| --- | --- | --- |
| “not freely usable ... subject to restrictions or limitations” | Can exclude cash that is economically available but operationally restricted (e.g., trapped cash, regulatory restrictions, covenant-restricted cash). If not paired with a schedule/quantification, it can materially reduce the cash credit to Seller. | Medium |
| No explicit overdraft / cash pooling netting mechanics | In a cash management structure, overdrafts and sweeps can flip between Cash, Working Capital, and Indebtedness depending on presentation. Lack of explicit routing invites disputes. | Medium |

**Overall Market Position Assessment:** 🟠 Slightly Off-Market (Buyer)

**Reasoning:** Most elements are market (balance-sheet anchor; clear check netting; exclusion of restricted/escrow cash). The broad exclusion for cash that is “not freely usable” and the absence of explicit overdraft/cash pooling routing can materially reduce Seller’s cash credit and create disputes.

**Counsel Questions to Raise:**
1. What cash pooling/sweep arrangements exist at Closing, and how will overdrafts/sweeps be treated (Cash vs. Indebtedness vs. Working Capital)?
2. What is the expected amount of restricted/trapped/pledged cash at Closing, and is any portion expected to be released shortly after Closing (suggesting a negotiated credit)?
3. Do the parties have a bank-account schedule (e.g., Schedule 3.23) showing which accounts are included/excluded?

**Suggested Revisions (if Off-Market):**

- **Original:** “...Cash and Cash Equivalents which are not freely usable...subject to restrictions or limitations...”
  **Suggested:** Narrow and schedule it: “...other than cash that is legally or contractually restricted from being distributed to Buyer at Closing (including escrow and collateral accounts), as set forth on Schedule [__].”
  **Rationale:** Avoids over-broad exclusions and forces transparency via a schedule.

- **Original:** (No overdraft netting rule.)
  **Suggested:** Add: “Overdrafts and negative book cash shall be treated as Indebtedness (or Working Capital) as set forth in the Sample Closing Statement, and cash shall be computed without offset unless expressly specified.”
  **Rationale:** Eliminates Cash↔Debt ambiguity in cash management structures.


---


### Definition Name: Indebtedness

**Section Reference:** Section 1.01 (Definitions) (PDF pp. 6–20; definition appears at PDF p. 12)

**Full Verbatim Text:**

```text
“Indebtedness” means, without duplication, after giving effect to the Pre-Closing Business Transfers and as calculated in accordance with the
Accounting Principles and whether or not they constitute Transferred Liabilities, (a) all obligations of the Group Companies for borrowed money, (b) all
obligations of the Group Companies evidenced by notes, bonds (other than surety bonds), debentures or other similar instruments, including obligations
of the Group Companies under the Deferred Consideration Notes (to the extent they are obligations of the Group Companies), (c) all reimbursement or
repayment obligations of the Group Companies under letters of credit and surety bonds, performance bonds, closure bonds, keep-well, bankers’
acceptances or similar arrangements solely to the extent such letters of credit have been drawn or claims have been made that remain unpaid under such
surety bonds, performance bonds, closure bonds, keep-well, bankers’ acceptances or similar arrangements, (d) all obligations of the Group Companies
under leases classified as finance leases (and not operating leases) to the extent that they have been or are required to be, in accordance with the
Accounting Principles, recorded as capitalized leases, (e) all accrued payment obligations in respect of contributions, including employer matching
contributions, of the Group Companies or the Business under the Seller 401(k) Plans in respect of any Business Employee for the 2019 fiscal year and
any prior fiscal years, (f) all obligations of the Group Companies in respect of deferred compensation, post-retirement welfare benefits (other than under
the Consolidated Omnibus Budget Reconciliation Act of 1985 and similar obligations) and unfunded or underfunded pensions, including for Business
Employees, (g) all obligations of the Group Companies in respect of accrued bonuses, accrued commissions, or accrued severance payable to any
current or former employee, officer, director or individual independent contractor of the Group Companies for the 2019 fiscal year and any prior fiscal
years, including the employer portion of any payroll or other similar Taxes and “tax gross-up” payments, if any, due or payable as a result of or in
connection therewith, (h) all obligations of the Group Companies for the deferred purchase price of property, assets or services or for earn-outs,
purchase price adjustments, holdbacks or other similar obligations (including the amount of future payment obligations), in each case, in an amount
equal to, in the case of any holdback, the actual amount of such holdback and, in all other cases, the amount reflected on the Unaudited Financial
Statements, (i) the net
obligations of the Group Companies under any derivative, hedging, swap and similar instruments or transactions, in each case, calculated at the
termination value thereof as if terminated immediately prior to the Closing, (j) the Aggregate Reserved Amount, (k) to the extent not paid prior to the
Closing, the costs and expenses set forth on Schedule 1.01(e) for the replacement of the containment liner described in such schedule, (l) an amount to
be determined based on the healthcare Liabilities of the Business calculated in accordance with the methodology set forth on Schedule 1.01(f), (m) all
accrued interest, fees and expenses (including prepayment or termination premiums), penalties or similar contractual charges in respect of any of the
items set forth in clauses (a) through (l), and (n) all obligations of the Group Companies with respect to guarantees of another Person in respect of any
obligation of the kind set forth in clauses (a) through (m) incurred by such other Person (including the obligations of the Group Companies with respect
to guarantees of the obligations incurred under the Credit Facility and the Private Placement Notes if, and only to the extent, such guarantees are not
released and terminated at or prior to the Closing). For the avoidance of doubt, any liability of the Group Companies included in the calculation of Net
Working Capital or Transaction Expenses shall not be included in the calculation of Indebtedness for any purpose hereunder.
```

**Plain-English Summary:**

Indebtedness is defined extremely broadly. It includes traditional financing debt (borrowed money, notes/bonds, drawn letters of credit, finance leases) and also sweeps in multiple non-traditional buckets such as benefit plan deficits, accrued bonuses/severance, a fixed ‘Aggregate Reserved Amount’, and other bespoke schedule/methodology items.

The definition is designed to be a purchase price deduction bucket and, as drafted, can materially reduce Seller proceeds beyond what most market ‘net debt’ definitions would capture.

**Component Breakdown:**

| Component | Included? | Verbatim Language | Market Position | Notes |
| --- | --- | --- | --- | --- |
| Borrowed money / loans | Yes | (a) “all obligations ... for borrowed money” | 🟢 Market Standard | Core debt capture. |
| Notes/bonds/debentures (incl. seller notes) | Yes | (b) “...evidenced by notes, bonds...debentures...” | 🟢 Market Standard | Explicitly includes Deferred Consideration Notes (deal-specific). |
| Accrued interest, fees & expenses | Yes | (m) “all accrued interest, fees and expenses...” | 🟢 Market Standard | Explicitly includes interest and fees. |
| Breakage / make-whole / prepayment premiums | Yes | (m) “...including prepayment or termination premiums...” | 🟢 Market Standard | Captures make-whole/breakage if triggered at Closing. |
| Capital/finance leases | Yes | (d) “leases classified as finance leases (and not operating leases)” | 🟢 Market Standard | Finance lease liabilities included. |
| Operating leases | No | (d) “(and not operating leases)” | 🟢 Market Standard | Operating leases excluded (consistent with pre-ASC 842 drafting; still relevant for liability classification). |
| Letters of credit / surety / performance / closure bonds | Yes (drawn only) | (c) “...solely to the extent ... have been drawn or claims have been made that remain unpaid” | 🟢 Market Standard | Limits to drawn/unpaid amounts; excludes undrawn commitments. |
| Bank overdrafts | Not explicit | — | 🟠 Slightly Off-Market (Ambiguous) | No explicit treatment; could fall into Working Capital or be treated as borrowed money depending on accounting. |
| Cash pooling / netting | Not explicit | — | 🟠 Slightly Off-Market (Ambiguous) | No explicit routing for sweeps/intercompany cash management. |
| Guarantees | Yes | (n) “...obligations ... with respect to guarantees of another Person...” | 🟢 Market Standard | Guarantees captured; scope depends on what ‘obligation’ includes. |
| Factoring / receivables programs | No (not mentioned) | — | 🟠 Slightly Off-Market (Seller) | If factoring exists, it may escape unless treated as borrowed money or included elsewhere. |
| Intercompany debt | Not explicit | — | 🟠 Slightly Off-Market (Ambiguous) | No explicit ‘intercompany indebtedness’ inclusion; mitigated by Section 5.08 elimination of intercompany balances with Retained Companies. |
| Hedging / derivative termination | Yes | (i) “net obligations ... under any derivative, hedging, swap...” | 🟢 Market Standard | Captures net liability positions/termination payments. |
| Deferred purchase price / earn-outs | Yes | (h) “deferred purchase price ... or for earn-outs” | 🟠 Deal-specific | Earn-outs included conceptually even though this SPA has no earnout provisions; important if any prior acquisitions exist. |
| Pension / post-retirement deficits | Yes | (f) “...deferred compensation...unfunded or underfunded pensions...” | 🔴 Significantly Off-Market (Buyer) | Pulls benefit plan deficits into ‘Indebtedness’ rather than being addressed through specific employee/tax mechanics. |
| Accrued bonuses/commissions/severance | Yes | (g) “accrued bonuses...commissions...severance...” | 🔴 Significantly Off-Market (Buyer) | Highly unusual to include these in ‘Indebtedness’ where Transaction Expenses and Working Capital normally handle. |
| Environmental/other reserves | Yes (explicit) | (j) “the Aggregate Reserved Amount” | 🔴 Significantly Off-Market (Buyer) | Hard-wires $14m reserved amount into Debt (value transfer away from Seller). |
| Scheduled replacement costs | Yes | (k) “...costs and expenses set forth on Schedule 1.01(e) for the replacement of ...” | 🔴 Significantly Off-Market (Buyer) | Incorporates a schedule-driven cost bucket into Debt; schedule not provided in this PDF. |
| Healthcare liabilities amount | Yes | (l) “an amount to be determined based on the healthcare Liabilities...” | 🔴 Significantly Off-Market (Buyer) | Adds a bespoke computed amount into Debt; methodology/schedule not provided in this PDF. |
| Declared dividends/distributions | No (not mentioned) | — | 🟠 Slightly Off-Market (Seller) | If declared but unpaid dividends exist, could fall through unless captured as current liabilities in WC. |

**Anti-Duplication Language:**

| Phrase | Present? | Exact Quote | Scope |
| --- | --- | --- | --- |
| without duplication | Yes | “Indebtedness” means, without duplication... | Definition-level |
| to the extent not included in | Yes (limited) | (k) “to the extent not paid prior to the Closing...” | Definition-level (component-specific) |
| for the avoidance of doubt | No | — | — |

**Red Flag Language Identified:**

| Phrase | Why It’s Concerning | Severity |
| --- | --- | --- |
| (f) underfunded pensions and post-retirement welfare benefits included in ‘Indebtedness’ | Shifts potentially large, non-financing liabilities into the purchase price deduction bucket; can materially reduce Seller proceeds and is often handled via specific indemnities or plan transfers instead. | High |
| (g) accrued bonuses/commissions/severance included in ‘Indebtedness’ | Creates overlap/double-count risk with Transaction Expenses and Working Capital; also changes economic allocation of compensation items that are typically operational accruals. | High |
| (j) “Aggregate Reserved Amount” hard-coded into Indebtedness | This is a fixed $14m deduction-style item embedded in the Debt definition; effectively a negotiated value chip that should be separately priced or indemnified, not hidden in Debt. | High |
| (k) and (l) schedule/methodology-driven bespoke items included in Indebtedness | The operative schedules/methodologies are not in the provided PDF. Without them, the purchase price mechanics cannot be replicated or tested, and Buyer has leverage to interpret. | High |

**Overall Market Position Assessment:** 🔴 Significantly Off-Market (Buyer)

**Reasoning:** While clauses (a)–(d), (i), (m), and (n) look like a conventional debt definition, the inclusion of underfunded benefit plan obligations, accrued compensation, and fixed/scheduled bespoke amounts (Aggregate Reserved Amount; Schedule 1.01(e) replacement costs; healthcare liabilities methodology) expands ‘Indebtedness’ well beyond market and creates material price-deduction risk for Seller.

**Counsel Questions to Raise:**
1. Provide Schedule 1.01(e) and the methodology referenced in clause (l); quantify each bespoke Indebtedness component and confirm how it will be calculated at Closing.
2. Confirm whether accrued bonuses/severance and benefit plan obligations are intended to be treated as debt (price deduction) rather than Transaction Expenses or Working Capital; quantify expected amounts.
3. Confirm whether overdrafts/cash pooling are treated as Indebtedness, Working Capital, or netted in Cash; align the Sample Closing Statement accordingly.

**Suggested Revisions (if Off-Market):**

- **Original:** Clauses (f), (g), (j), (k), (l) of Indebtedness (benefit plan deficits, accrued compensation, Aggregate Reserved Amount, schedule/methodology items).
  **Suggested:** Limit Indebtedness to financing-style obligations: borrowed money, notes/bonds, drawn LC/surety obligations, finance leases, derivatives termination, accrued interest/fees, and guarantees — and move employee/benefit/reserve items into (i) Working Capital (as current liabilities) or (ii) a separately negotiated specific indemnity/escrow.
  **Rationale:** Aligns with market net-debt practice and avoids hidden value transfers via bespoke deductions.

- **Original:** “the Aggregate Reserved Amount”
  **Suggested:** If retained as a negotiated value chip, move it to Section 2.03(a) as an explicit line-item adjustment (or address via environmental indemnity mechanics) rather than embedding in Indebtedness.
  **Rationale:** Improves transparency and avoids disputes about whether the amount is duplicated elsewhere.


---


### Definition Name: Net Debt

**Section Reference:** NOT FOUND (would typically appear in Article I definitions or in the purchase price clause in Article II, often defined as Indebtedness minus Cash and Cash Equivalents).

**Full Verbatim Text:**

```text
NOT FOUND
```

**Plain-English Summary:**

The SPA does not define a standalone ‘Net Debt’ term. Instead, the Purchase Price formula explicitly adds Cash and subtracts Indebtedness as separate line items (i.e., a functional net debt mechanism without naming it).

**Component Breakdown:**

| Component | Included? | Verbatim Language | Market Position | Notes |
| --- | --- | --- | --- | --- |
| Separate ‘Net Debt’ defined term | No | — | 🟢 Market Standard | Common to omit if the formula separately references Cash and Indebtedness. |
| Explicit Cash / Indebtedness adjustments | Yes | Section 2.03(a) adds Estimated Closing Date Cash and subtracts Estimated Closing Date Indebtedness. | 🟢 Market Standard | Net-debt economics achieved via separate components. |

**Anti-Duplication Language:**

| Phrase | Present? | Exact Quote | Scope |
| --- | --- | --- | --- |
| without duplication | N/A | — | — |
| to the extent not included in | N/A | — | — |
| for the avoidance of doubt | N/A | — | — |

**Red Flag Language Identified:**

| Phrase | Why It’s Concerning | Severity |
| --- | --- | --- |
| No single ‘Net Debt’ definition | Not inherently a problem, but increases the importance of clean Cash and Indebtedness definitions and explicit routing rules (especially for overdrafts and cash pooling). | Low |

**Overall Market Position Assessment:** 🟢 Market Standard

**Reasoning:** Separate line items for Cash and Indebtedness are a common approach; the risk here is not the absence of a Net Debt term but the breadth and ambiguity inside Indebtedness and certain cash exclusions.

**Counsel Questions to Raise:**
1. Confirm intended routing for items that can be classified as either Cash/Indebtedness/Working Capital (overdrafts, cash pooling, current portion of debt, lease liabilities).


---


### Definition Name: Net Working Capital

**Section Reference:** Section 1.01 (Definitions) (PDF pp. 6–20; definition appears at PDF p. 15)

**Full Verbatim Text:**

```text
“Net Working Capital” means, after giving effect to the Pre-Closing Business Transfers and as calculated in accordance with the Accounting
Principles, and in a manner consistent with the Sample Closing Statement, the Group Companies’ current assets minus current liabilities; provided that
all current and deferred Tax assets and Tax liabilities will be excluded. For the avoidance of doubt, any liability of the Group Companies included in the
calculation of Indebtedness or Transaction Expenses, as well as any amounts with respect to Cash and Cash Equivalents, shall, in each case, not be
included in the calculation of Net Working Capital for any purpose hereunder.
```

**Plain-English Summary:**

Net Working Capital is defined broadly as the Group Companies’ current assets minus current liabilities (post Pre-Closing Business Transfers), calculated under the Accounting Principles and consistently with the Sample Closing Statement. Taxes are carved out entirely, and the definition explicitly prevents double counting by excluding anything treated as Cash, Indebtedness, or Transaction Expenses.

In effect, it is the ‘operating working capital’ bucket intended to normalize day-to-day operational liquidity, but it relies heavily on the referenced accounting exhibit and sample schedule to avoid classification disputes.

**Component Breakdown:**

| Component | Included? | Verbatim Language | Market Position | Notes |
| --- | --- | --- | --- | --- |
| Definition as current assets minus current liabilities | Yes | “...current assets minus current liabilities” | 🟢 Market Standard | High-level NWC definition; actual line items depend on Accounting Principles and Sample Closing Statement. |
| Trade A/R | Implicit | “current assets” | 🟠 Slightly Off-Market (Ambiguous) | Not enumerated; inclusion/exclusion depends on exhibit/schedule not provided. |
| Inventory | Implicit | “current assets” | 🟠 Slightly Off-Market (Ambiguous) | Not enumerated. |
| Prepaids/other current assets | Implicit | “current assets” | 🟠 Slightly Off-Market (Ambiguous) | Not enumerated; risk of buyer reclassification. |
| Trade A/P | Implicit | “current liabilities” | 🟠 Slightly Off-Market (Ambiguous) | Not enumerated. |
| Accrued expenses | Implicit | “current liabilities” | 🟠 Slightly Off-Market (Ambiguous) | Not enumerated; key for transaction bonus / severance accruals. |
| Deferred revenue / customer deposits | Implicit | “current liabilities” | 🟠 Slightly Off-Market (Ambiguous) | Not enumerated; material in service businesses. |
| Income taxes / tax payables | No (explicitly excluded) | “...all current and deferred Tax assets and Tax liabilities will be excluded” | 🟢 Market Standard | Routes tax accruals away from NWC into tax allocation/indemnity framework. |
| Cash inclusion/exclusion | No (explicitly excluded) | “...any ... Cash and Cash Equivalents...shall...not be included...” | 🟢 Market Standard | Avoids double-counting; cash handled separately in Purchase Price. |
| Debt inclusion/exclusion | No (explicitly excluded) | “...any liability ... included in ... Indebtedness...shall...not be included...” | 🟢 Market Standard | Strong routing to avoid double counting. |
| Transaction expenses inclusion/exclusion | No (explicitly excluded) | “...any liability ... included in ... Transaction Expenses...shall...not be included...” | 🟢 Market Standard | Avoids classifying deal costs as WC accruals. |
| Intercompany balances | Not in definition; addressed elsewhere | — | 🟢 Market Standard | Section 5.08 requires elimination of intercompany balances with Retained Companies. |

**Anti-Duplication Language:**

| Phrase | Present? | Exact Quote | Scope |
| --- | --- | --- | --- |
| without duplication | No (definition uses routing instead) | — | — |
| to the extent not included in | No | — | — |
| for the avoidance of doubt | Yes | “For the avoidance of doubt, any liability ... included in ... Indebtedness or Transaction Expenses ... shall ... not be included... and any ... Cash and Cash Equivalents ... shall ... not be included...” | Definition-level (routing) |

**Red Flag Language Identified:**

| Phrase | Why It’s Concerning | Severity |
| --- | --- | --- |
| High-level ‘current assets minus current liabilities’ without a line-item schedule in the provided PDF | Without Exhibit A and the Sample Closing Statement, Buyer has more room to reclassify items into/out of current buckets, affecting NWC and the purchase price. | High |
| Exclusion of all current and deferred tax assets/liabilities | Standard, but ensure that any income-tax or sales-tax accruals are addressed elsewhere (tax indemnity/returns) to avoid gaps. | Medium |

**Overall Market Position Assessment:** 🟠 Slightly Off-Market (Buyer)

**Reasoning:** The routing exclusions are strong and market-standard. However, the definition is very high-level and defers key detail to Exhibit A and the Sample Closing Statement, which are not included in the provided PDF. In practice this increases Buyer interpretive flexibility and dispute risk in a completion accounts process.

**Counsel Questions to Raise:**
1. Obtain Exhibit A (Accounting Principles) and the Sample Closing Statement and confirm they include a line-item working capital schedule tied to the chart of accounts.
2. Confirm treatment of deferred revenue/customer deposits, reserves, and any unusual current assets (e.g., environmental reserves, unbilled receivables).
3. Confirm cut-off time and ‘no reclassification’ rules for current/non-current categories, especially around Closing.

**Suggested Revisions (if Off-Market):**

- **Original:** “current assets minus current liabilities” (without a defined schedule in the provided PDF).
  **Suggested:** Add a schedule enumerating included/excluded accounts (by GL account) and a ‘no reclassification / consistent with past practice’ clause in Exhibit A.
  **Rationale:** Reduces working capital disputes and constrains post-close reclassification games.


---


### Definition Name: Transaction Expenses

**Section Reference:** Section 1.01 (Definitions) (PDF pp. 6–20; definition appears at PDF p. 20)

**Full Verbatim Text:**

```text
“Transaction Expenses” means, without duplication and to the extent not otherwise expressly allocated to the Parties pursuant to the terms and
conditions hereof, the sum of all fees, costs, charges, expenses and other payment obligations incurred by or on behalf of, and payable by, the Group
Companies in connection with or relating to the negotiation, execution, delivery and performance of this Agreement and the other Transaction
Documents and the investigation, pursuit and consummation of the transactions contemplated hereby and thereby, including: (i) brokerage, fees,
commissions, finders’ fees or similar advisory fees; (ii) fees, costs, expenses and disbursements payable to legal counsel and accounting, tax and other
advisors and consultants; (iii) all amounts payable, in whole or in part, solely as a result of the consummation of the transactions contemplated by this
Agreement or any other Transaction Document in respect of any change of control, transaction, incentive, stay, or similar bonus, retention, termination
or severance agreements or arrangements or other compensatory payments to any current or former employee, director, officer, agent or individual
independent consultant of the Group Companies, including the employer portion of any payroll or similar taxes and any “tax gross-up” payments, if any,
payable with respect to any of the foregoing (but excluding, for the avoidance of doubt, any amounts payable based on continued service, solely to the
extent the arrangements relating to such amounts are set forth on Schedule 5.23, or upon any termination of employment, in each case, following the
Closing), (iv) all fees, costs, expenses and other amounts payable in respect of the Pre-Closing Business Transfers and (v) all other fees, expenses and
amounts payable by the Group Companies in connection with any transactions contemplated with other potential acquirors of (or investors in) the Group
Companies or the Business (including in connection with any auction process) or other strategic alternatives pursued by Seller in respect of the Business
or the Group Companies (including any public or private offering of securities). For the avoidance of doubt, any liability of the Group Companies
included in the calculation of Net Working Capital or Indebtedness shall not be included in the calculation of Transaction Expenses for any purpose
hereunder.
```

**Plain-English Summary:**

Transaction Expenses are the Group Companies’ unpaid deal-related costs and obligations connected to negotiating and consummating the transaction, including advisor fees and change-of-control compensation costs. The definition also includes costs associated with the Pre-Closing Business Transfers and includes a broad catch-all bucket, subject to ‘without duplication’ and allocation carve-outs.

It is designed to ensure Seller bears transaction costs incurred by the Group Companies by reducing the Purchase Price dollar-for-dollar.

**Component Breakdown:**

| Component | Included? | Verbatim Language | Market Position | Notes |
| --- | --- | --- | --- | --- |
| Investment banking / brokerage / finder fees | Yes | (i) “brokerage, fees, commissions, finders’ fees...” | 🟢 Market Standard | Captures sell-side/buy-side advisory fees charged to Group Companies. |
| Legal, accounting, tax, consultants | Yes | (ii) “fees, costs, expenses and disbursements payable to legal counsel and accounting, tax and other advisors...” | 🟢 Market Standard | Standard deal-cost capture. |
| Change-of-control bonuses / severance / retention / termination | Yes | (iii) “...change-of-control transaction, incentive, stay...bonus, retention, termination or severance...” | 🟢 Market Standard | Commonly included; ensure no overlap with Indebtedness clause (g). |
| Employer payroll taxes / gross-ups on bonuses | Yes | (iii) “...employer payroll or similar taxes and any ‘tax gross-up’ payments...” | 🟢 Market Standard | Often explicitly captured. |
| D&O tail | Not mentioned | — | 🟠 Slightly Off-Market (Seller) | If a D&O tail is required elsewhere, ensure it is captured here (or elsewhere) to avoid gaps. |
| R&W insurance premium | Not mentioned | — | 🟠 Slightly Off-Market (Ambiguous) | R&W policy exists, but premium allocation is not in this definition; check other provisions and any term sheet. |
| Financing fees | Not mentioned | — | 🟠 Slightly Off-Market (Seller) | Buyer financing fees typically not seller-borne; confirm none are charged to Group Companies. |
| Pre-Closing Business Transfers costs | Yes | (iv) “fees, costs, expenses and other amounts payable in respect of the Pre-Closing Business Transfers” | 🟠 Slightly Off-Market (Buyer) | Deal-specific; can be material in carve-outs and should be budgeted/quantified. |
| Catch-all / other deal-related amounts | Yes | (v) “all other fees, expenses and amounts payable...” | 🟠 Slightly Off-Market (Buyer) | Broad residual category; should be constrained by accounting exhibit and schedule. |

**Anti-Duplication Language:**

| Phrase | Present? | Exact Quote | Scope |
| --- | --- | --- | --- |
| without duplication | Yes | “Transaction Expenses” means, without duplication... | Definition-level |
| to the extent not included in | Yes | “...to the extent not otherwise expressly allocated...” | Definition-level (allocation carve-out) |
| for the avoidance of doubt | Yes (limited) | “...but excluding, for the avoidance of doubt, any liability ... included in the calculation of Indebtedness...” (in clause (v)) | Definition-level (routing) |

**Red Flag Language Identified:**

| Phrase | Why It’s Concerning | Severity |
| --- | --- | --- |
| Overlap with Indebtedness for employee-related liabilities | Indebtedness includes accrued bonuses/severance, while Transaction Expenses includes change-of-control/termination/retention payments. Without a clear schedule/routing, Seller could be double-charged (price reduced twice). | High |
| Broad catch-all in clause (v) | A residual ‘all other’ category can capture unexpected items (e.g., internal allocations, seller overhead) unless constrained by exhibit/schedules. | Medium |
| Pre-Closing Business Transfers costs included | In a carve-out, these costs can be large and timing-sensitive; need clarity on what is ‘in respect of’ transfers versus normal-course integration work. | Medium |

**Overall Market Position Assessment:** 🟠 Slightly Off-Market (Buyer)

**Reasoning:** Core deal-cost capture is market. The definition leans Buyer-favorable because it includes Pre-Closing Business Transfer costs and uses a broad catch-all. The biggest issue is potential overlap/double count with Indebtedness for employee-related liabilities, which needs explicit routing and schedules.

**Counsel Questions to Raise:**
1. Provide a closing funds-flow/expense schedule showing all Transaction Expenses expected to be unpaid at Closing and confirming they are not also included in Indebtedness or Working Capital.
2. Confirm whether any R&W insurance premium, retention, or D&O tail costs are intended to be Transaction Expenses and who ultimately bears them.
3. Clarify boundaries for ‘Pre-Closing Business Transfers’ costs (scope, timing, and whether Seller overhead allocations are excluded).

**Suggested Revisions (if Off-Market):**

- **Original:** Catch-all clause (v) “all other fees, expenses and amounts payable...”
  **Suggested:** Limit to third-party, out-of-pocket costs directly attributable to the transaction and expressly exclude internal overhead allocations unless specifically listed on a schedule.
  **Rationale:** Prevents hidden value leakage via internal cost allocations.

- **Original:** Overlap between Indebtedness (g) and Transaction Expenses (iii) for compensation amounts.
  **Suggested:** Add explicit priority: “All change-of-control, retention, termination and severance amounts (and related payroll taxes) shall be treated as Transaction Expenses and shall be excluded from Indebtedness and Net Working Capital.”
  **Rationale:** Eliminates double counting and aligns with common market allocation.


---


### Definition Name: Tax / Taxes

**Section Reference:** Section 1.01 (Definitions) (PDF pp. 6–20; ‘Tax’ definition appears at PDF p. 19)

**Full Verbatim Text:**

```text
“Tax” means all federal, state, local or non-U.S. taxes (including income, profits, windfall profits, franchise, alternative minimum, add-on
minimum, gross receipts, sales, use, customs duties, environmental, value added, ad valorem, transfer, real property, personal property, stamp, capital
stock, excise, premium, social security, payroll, occupation, employment, unemployment, severance, disability, registration, license, value added,
withholding and estimated tax), or other similar charges, fees, duties, levies or assessments which are imposed by a Taxing Authority, and any interest,
penalty, or addition with respect thereto imposed by any Taxing Authority.

—

“Income Tax” means any Tax that is, in whole or in part, based on or measured by net income or profit.
```

**Plain-English Summary:**

‘Tax’ is defined broadly to cover essentially all forms of governmental taxes and similar charges (federal, state, local, and non-U.S.), together with interest and penalties. This definition is used throughout the SPA’s tax allocation and tax indemnity framework.

Separately, ‘Income Tax’ is defined as any Tax based on or measured by net income or profit, which matters for straddle-period allocation and filing responsibilities.

**Component Breakdown:**

| Component | Included? | Verbatim Language | Market Position | Notes |
| --- | --- | --- | --- | --- |
| Income / profits taxes | Yes | “...taxes (including income, profits...)” | 🟢 Market Standard | Income Tax separately defined as any Tax based on net income or profit. |
| Sales / use / VAT | Yes | “...sales, use...value added...” | 🟢 Market Standard | Includes indirect taxes. |
| Payroll / employment / social security | Yes | “...social security, payroll, occupation, employment...” | 🟢 Market Standard | Covers employment-related taxes. |
| Property / transfer / stamp | Yes | “...ad valorem, transfer, real property, personal property, stamp...” | 🟢 Market Standard | Includes transfer taxes. |
| Customs duties | Yes | “customs duties” | 🟢 Market Standard | Relevant if cross-border imports exist. |
| Interest and penalties | Yes | “...any interest, penalty...” | 🟢 Market Standard | Captures ancillary amounts. |

**Anti-Duplication Language:**

| Phrase | Present? | Exact Quote | Scope |
| --- | --- | --- | --- |
| without duplication | No | — | — |
| to the extent not included in | No | — | — |
| for the avoidance of doubt | No | — | — |

**Red Flag Language Identified:**

| Phrase | Why It’s Concerning | Severity |
| --- | --- | --- |
| Very broad ‘Tax’ definition | Standard breadth, but it means any tax-like assessment can be treated as a Tax for indemnities and allocations; confirm interaction with Working Capital (which excludes tax assets/liabilities). | Low |

**Overall Market Position Assessment:** 🟢 Market Standard

**Reasoning:** The definition is broad but typical for U.S. SPAs; it appropriately includes interest and penalties. The more material risk comes from how Taxes are allocated and indemnified (Article VI and Article IX), not from this definition itself.

**Counsel Questions to Raise:**
1. Confirm whether any tax-like assessments specific to the business (e.g., environmental fees) are intended to be treated as Taxes versus operating expenses.
2. Confirm that excluding tax assets/liabilities from Net Working Capital is consistent with the tax indemnity/returns framework so there is no gap (e.g., sales tax payables at Closing).


---


### Definition Name: Accounting Principles / GAAP

**Section Reference:** Section 1.01 (Definitions) (PDF pp. 6–20; definition appears at PDF p. 6)

**Full Verbatim Text:**

```text
“Accounting Principles” means the accounting principles, practices, policies, judgments and methodologies set forth in Exhibit A to this
Agreement.

—

“GAAP” means United States generally accepted accounting principles, consistently applied.
```

**Plain-English Summary:**

Accounting Principles are defined by reference to Exhibit A, which is intended to set the detailed accounting policies, practices, and methodologies for calculating the completion accounts components (Cash, Indebtedness, Net Working Capital, and Transaction Expenses). A separate defined term confirms that ‘GAAP’ means U.S. GAAP consistently applied.

For completion accounts deals, Exhibit A and the Sample Closing Statement are critical; their absence from the provided PDF is a material gap for any attempt to replicate the price mechanics.

**Component Breakdown:**

| Component | Included? | Verbatim Language | Market Position | Notes |
| --- | --- | --- | --- | --- |
| Reference to Exhibit A (Accounting Principles) | Yes | “...set forth in Exhibit A to this Agreement.” | 🟠 Slightly Off-Market (Ambiguous) | Exhibit A is referenced but not included in the provided PDF; without it, calculation mechanics are incomplete. |
| GAAP definition present | Yes | “GAAP” means United States generally accepted accounting principles, consistently applied. | 🟢 Market Standard | GAAP used for financial statement representations and potentially as a backstop if Exhibit A references GAAP. |
| Consistency with Sample Closing Statement | Referenced elsewhere | Net Working Capital definition references calculation “consistent with the Sample Closing Statement”. | 🟠 Slightly Off-Market (Ambiguous) | Sample Closing Statement (Exhibit C) is also not included in the provided PDF. |

**Anti-Duplication Language:**

| Phrase | Present? | Exact Quote | Scope |
| --- | --- | --- | --- |
| without duplication | N/A | — | — |
| to the extent not included in | N/A | — | — |
| for the avoidance of doubt | N/A | — | — |

**Red Flag Language Identified:**

| Phrase | Why It’s Concerning | Severity |
| --- | --- | --- |
| Exhibit A not present in provided PDF | The Accounting Principles control Indebtedness, Cash, Working Capital, and the Closing Statement calculations. Without Exhibit A, it is not possible to replicate calculations or assess reclassification risk. | High |
| Exhibit C (Sample Closing Statement) not present in provided PDF | The Sample Closing Statement is referenced as the consistency anchor for Net Working Capital; missing schedule increases Buyer discretion. | High |

**Overall Market Position Assessment:** 🔴 Significantly Off-Market (Risk/Incomplete Inputs)

**Reasoning:** A completion accounts SPA is only as clear as its Accounting Principles hierarchy and illustrative schedules. Because Exhibit A and Exhibit C are referenced but not included in the provided PDF, the accounting methodology cannot be validated here, materially increasing uncertainty and dispute risk.

**Counsel Questions to Raise:**
1. Obtain Exhibit A (Accounting Principles) and confirm whether it provides a hierarchy (GAAP vs past practice vs sample statement) and explicit no-hindsight/no-reclassification rules.
2. Obtain Exhibit C (Sample Closing Statement) and confirm it ties to the chart of accounts and includes illustrative calculations for Cash, Indebtedness, Net Working Capital, and Transaction Expenses.
3. Confirm whether any schedules override Exhibit A (e.g., schedule-driven Indebtedness items in clause (k)/(l)).


---



## Part 3: Purchase Price Mechanics

### 3.1 Price Equation

**Reconstructed Purchase Price (Closing) formula (from Section 2.03(a)):**

- Base Purchase Price: **$462,500,000**
  - minus (if applicable): **ESOL PR Purchase Price** (deal-specific reduction)
- plus: **Estimated Working Capital Adjustment Amount**
- minus: **Estimated Closing Date Indebtedness**
- plus: **Estimated Closing Date Cash**
- minus: **Estimated Closing Date Transaction Expenses**
= **Purchase Price payable at Closing (cash)**

**Working capital collar mechanics (from definitions):**
- Target Net Working Capital Lower Threshold: **$64,500,000**
- Target Net Working Capital Upper Threshold: **$69,500,000**
- Target Closing Net Working Capital equals:
  - the Upper Threshold if Closing/Estimated NWC > Upper Threshold,
  - the Lower Threshold if Closing/Estimated NWC < Lower Threshold,
  - otherwise the actual Closing/Estimated NWC (resulting in a “no-adjustment” band).

**Section Reference:** Section 2.03(a) (PDF p. 26)

**Verbatim Formula Language (Section 2.03(a)):**
```text
(a) The “Purchase Price” in the aggregate for the Purchased Shares shall, subject to the adjustments set forth in Section 2.05, be an
amount in cash equal to (i) $462,500,000 (minus, if applicable, the ESOL PR Purchase Price), plus, (ii) the Estimated Working Capital Adjustment
Amount, minus (iii) the Estimated Closing Date Indebtedness, plus (iv) the Estimated Closing Date Cash, minus (v) the Estimated Closing Date
Transaction Expenses.
```


### 3.2 Term Alignment Check

| Formula Uses This Term | Definition Section Uses | Match? | Issue if Mismatched |
| --- | --- | --- | --- |
| Base amount ($462.5m) | Section 2.03(a) | Yes | — |
| Estimated Working Capital Adjustment Amount | Section 2.05(a) (defined by calculation; ‘Estimated Closing Date Net Working Capital’ etc.) | Partial | Not a defined term in Article I; relies on 2.05(a) mechanics and Accounting Principles. |
| Estimated Closing Date Indebtedness | Section 2.05(a) (defined in-line) | Partial | Indebtedness is defined (Article I), but the Estimated label is in 2.05(a). |
| Estimated Closing Date Cash | Section 2.05(a) (defined in-line) | Partial | Cash and Cash Equivalents defined in Article I; Estimated label in 2.05(a). |
| Estimated Closing Date Transaction Expenses | Section 2.05(a) (defined in-line) | Partial | Transaction Expenses defined in Article I; Estimated label in 2.05(a). |
| Target Closing Net Working Capital | Article I definition | Yes | Key to collar; ensure it matches Sample Closing Statement and calculation conventions. |



### 3.3 Sign Convention Analysis

| Component | Direction in Formula | Clear? | Potential Ambiguity |
| --- | --- | --- | --- |
| Cash | + | Yes | Definition excludes restricted/trapped/escrow/collateral cash; watch for debate on classification. |
| Indebtedness/Net Debt | - | Yes | Broad Indebtedness definition creates potentially large deductions. |
| NWC vs Target | +/- (via Estimated Working Capital Adjustment Amount) | Mostly | Collar makes adjustment zero within band; outside band is dollar-for-dollar beyond threshold. |
| Transaction Expenses | - | Yes | Ensure no overlap with Indebtedness and WC (routing should be explicit in exhibit/schedule). |



### 3.4 Formula-Level Anti-Duplication

- **Present?** Partially (primarily through definition-level routing in Net Working Capital and “without duplication” language in Indebtedness/Transaction Expenses; the Purchase Price clause itself does not contain a broad anti-duplication sentence).
- **Most relevant formula-level language:** the Adjustment Amount formula in Section 2.05(f) applies plus/minus mechanics across the same components.
- **Exact language (Adjustment Amount definition, Section 2.05(f)):**
```text
(f) The “Adjustment Amount,” which may be positive or negative, shall mean (i) the Closing Date Working Capital Adjustment Amount
(as finally determined in accordance with Section 2.05), minus the Estimated Working Capital Adjustment Amount, plus (ii) the Estimated Closing Date
Indebtedness, minus the Closing Date Indebtedness (as finally determined in accordance with Section 2.05), plus (iii) the Closing Date Cash (as finally
determined in accordance with Section 2.05), minus the Estimated Closing Date Cash, plus (iv) the Estimated Closing Date Transaction Expenses,
minus the Closing Date Transaction Expenses (as finally determined in accordance with Section 2.05). If the Adjustment Amount is a positive number,
then the Purchase Price shall be increased by the Adjustment Amount (the “Increase Amount”), and if the Adjustment Amount is a negative number, then
the Purchase Price shall be decreased by the absolute value of the Adjustment Amount (the “Deficit Amount”). The Adjustment Amount shall be paid in
accordance with Section 2.05(g).
```


### 3.5 Market Position Assessment

**🟠 Slightly Off-Market (Buyer).** The completion accounts structure itself is market-standard, and the true-up timeline and IA mechanism are reasonably balanced. However, Buyer prepares the post-close Closing Statement, and several definitions driving the formula (Indebtedness and Transaction Expenses) are unusually broad and schedule-driven (with schedules missing from the provided PDF), which increases the risk that the “math” produces a Buyer-favorable result even if the form looks standard.

## Part 4: Cross-Definition Interaction Analysis

### 4.1 Overlap Matrix

**Overlap Area:** Overdrafts

- **Definitions Involved:** Cash ↔ Indebtedness / Working Capital
- **How SPA Routes It:** NOT EXPLICIT. Cash definition does not address overdrafts; Indebtedness definition does not mention overdrafts.
- **Anti-Duplication Present?:** No
- **Risk Level:** Medium
- **Recommendation:** Add explicit routing (e.g., overdrafts treated as Indebtedness or as current liabilities in Working Capital) and reflect in the Sample Closing Statement.

---

**Overlap Area:** Accrued interest

- **Definitions Involved:** Indebtedness ↔ Working Capital
- **How SPA Routes It:** Indebtedness includes “all
accrued interest, fees and expenses (including prepayment or termination premiums), penalties or similar contractual charges in respect of any of the
items set forth in clauses (a) through (l), and (n) all obligations of the Group Companies with respect to guarantees of another Person in respect of any
obligation of the kind set forth in clauses (a) through (m) incurred by such other Person (including the obligations of the Group Companies with respect
to guarantees of the obligations incurred under the Credit Facility and the Private Placement Notes if, and only to the extent, such guarantees are not
released and terminated at or prior to the Closing). For the avoidance of doubt, any liability of the Group Companies included in the calculation of Net
Working Capital or Transaction Expenses shall not be included in the calculation of Indebtedness for any purpose hereunder.”; Net Working Capital excludes any liability included in Indebtedness (see routing language).
- **Anti-Duplication Present?:** Yes
- **Risk Level:** Low
- **Recommendation:** Ensure accrued interest on debt is booked in Indebtedness and excluded from NWC; confirm via Exhibit A.

---

**Overlap Area:** Current portion of debt

- **Definitions Involved:** Indebtedness ↔ Working Capital
- **How SPA Routes It:** Routed by principle: borrowing obligations are captured in Indebtedness; NWC definition excludes any liability included in Indebtedness.
- **Anti-Duplication Present?:** Yes
- **Risk Level:** Low
- **Recommendation:** Confirm classification in Exhibit A (no reclassification disputes on current/non-current).

---

**Overlap Area:** Lease liabilities

- **Definitions Involved:** Indebtedness ↔ Working Capital
- **How SPA Routes It:** Indebtedness includes finance leases “(and not operating leases)”. NWC excludes Indebtedness items.
- **Anti-Duplication Present?:** Partial
- **Risk Level:** Medium
- **Recommendation:** Clarify ASC 842 treatment: if operating lease liabilities are on balance sheet, ensure whether they are excluded (as operating lease) or included (as finance lease) and prevent reclassification.

---

**Overlap Area:** Breakage/make-whole fees

- **Definitions Involved:** Indebtedness ↔ Transaction Expenses
- **How SPA Routes It:** Indebtedness includes “prepayment or termination premiums”. Transaction Expenses is deal-cost focused but could overlap in practice.
- **Anti-Duplication Present?:** Partial
- **Risk Level:** Medium
- **Recommendation:** Explicitly route prepayment premiums to Indebtedness and exclude from Transaction Expenses; confirm no double count.

---

**Overlap Area:** Financing fees

- **Definitions Involved:** Indebtedness ↔ Transaction Expenses
- **How SPA Routes It:** Indebtedness includes accrued “fees and expenses”; Transaction Expenses includes advisor fees. Boundary is not explicit.
- **Anti-Duplication Present?:** No (explicit boundary)
- **Risk Level:** Medium
- **Recommendation:** Define whether debt-related lender fees (commitment, OID, amendment fees) are in Indebtedness or excluded, and ensure Transaction Expenses excludes financing fees unless clearly intended.

---

**Overlap Area:** Transaction bonuses

- **Definitions Involved:** Transaction Expenses ↔ Indebtedness ↔ Working Capital
- **How SPA Routes It:** Indebtedness includes “accrued bonuses...severance”; Transaction Expenses includes change-of-control/retention/termination payments. NWC excludes both categories if classified as such, but classification can vary.
- **Anti-Duplication Present?:** No (explicit priority)
- **Risk Level:** High
- **Recommendation:** Add an explicit priority rule: all deal-triggered bonuses/severance treated as Transaction Expenses only (or only Indebtedness), and excluded from the other buckets.

---

**Overlap Area:** Accrued deal costs

- **Definitions Involved:** Transaction Expenses ↔ Working Capital
- **How SPA Routes It:** NWC definition expressly excludes liabilities included in Transaction Expenses.
- **Anti-Duplication Present?:** Yes
- **Risk Level:** Low
- **Recommendation:** Confirm that ordinary-course accruals are not recharacterized as Transaction Expenses post-close.

---

**Overlap Area:** Tax payables

- **Definitions Involved:** Working Capital ↔ Taxes/Tax Indemnity
- **How SPA Routes It:** NWC excludes “all current and deferred Tax assets and Tax liabilities”.
- **Anti-Duplication Present?:** Yes (exclusion)
- **Risk Level:** Medium
- **Recommendation:** Confirm that sales/use/payroll tax accruals at Closing are addressed via Article VI / tax indemnity, since they will not be captured in NWC.

---

**Overlap Area:** Cash in NWC

- **Definitions Involved:** Cash ↔ Working Capital
- **How SPA Routes It:** NWC definition excludes Cash and Cash Equivalents.
- **Anti-Duplication Present?:** Yes
- **Risk Level:** Low
- **Recommendation:** Ensure all cash accounts are mapped to Cash and not left in current assets in the Closing Statement.

---

**Overlap Area:** Intercompany balances

- **Definitions Involved:** Multiple
- **How SPA Routes It:** Section 5.08 requires elimination of intercompany balances between Group Companies and Retained Companies effective at or prior to Closing.
- **Anti-Duplication Present?:** Yes (outside definitions)
- **Risk Level:** Low
- **Recommendation:** Verify completion of eliminations via a closing certificate and ensure the Closing Statement reflects zeroed balances.

---



### 4.2 Gap Analysis

| Item | Risk of Falling Through Definitions | Which Definitions Should Capture It | Currently Captured? | Recommendation |
| --- | --- | --- | --- | --- |
| Restricted cash | High — excluded from Cash; also excluded from NWC; may reduce Seller cash credit without separate compensation. | Cash and Cash Equivalents (schedule), or explicit purchase price treatment | Partially (excluded) but not positively captured | Quantify restricted cash; consider crediting any amount expected to become unrestricted shortly after Closing or treat as a specific item. |
| Trapped foreign cash | Medium — definition excludes ‘not freely usable’ cash; if foreign operations exist, could be excluded. | Cash and Cash Equivalents; possibly FX mechanics if relevant | Unclear | Create a schedule of cash restrictions and a rule for trapped cash (e.g., include but haircut for repatriation cost; or exclude with transparency). |
| Deposits in transit | Low — explicitly included via ‘uncleared checks/payments received’. | Cash and Cash Equivalents | Yes | Confirm cut-off and bank reconciliation procedure in Exhibit A / closing statement workpapers. |
| Outstanding checks | Low — cash computed net of ‘issued but uncleared checks’. | Cash and Cash Equivalents | Yes | Confirm check clearing cut-off and bank reconciliation procedure. |
| Off-balance sheet items | Medium — may not be captured in Cash/Indebtedness/NWC; can emerge as post-close liabilities. | Indemnities / specific covenants; disclosure schedules | Unclear | Request a schedule of off-balance sheet commitments; confirm whether any should be treated as Indebtedness (e.g., guarantees) or reserved. |
| Contingent liabilities | Medium — generally not in completion accounts; addressed via reps/indemnity. | Indemnification; MAC; specific indemnities (environmental/tax) | Yes (via indemnity framework) | Ensure survival/caps align with risk profile; consider special indemnity if material known contingencies exist. |
| ASC 842 operating lease liabilities | Medium — Indebtedness excludes operating leases but financial statements may record operating lease liabilities as current/non-current. | Accounting Principles / Exhibit A | Unclear | Explicitly state whether operating lease liabilities are excluded from all completion accounts components (and thus not price-adjusting) or treated as debt. |
| Schedule-driven debt items (Schedule 1.01(e); healthcare methodology) | High — referenced items included in Indebtedness but schedules/methodology not included in provided PDF. | Indebtedness definition clauses (k) and (l) | No (in provided PDF) | Obtain the schedules/methodology and quantify expected amounts; otherwise price mechanics cannot be validated. |



## Part 5: Closing Statement & True-Up Mechanics

### 5.1 Timeline Extraction

| Stage | Days After Close | Responsible Party | Section Ref | Market Comparison |
| --- | --- | --- | --- | --- |
| Estimated Closing Statement delivery | Pre-close: Not less than three (3) Business Days prior to the Closing Date (and no event more than ten (10) Business Days prior) | Seller | Section 2.05(a) (PDF pp. 28–31) | Market: delivered shortly before closing; 3–10 BD is typical. |
| Estimated statement objection deadline | Pre-close: no later than two (2) Business Days prior to the Closing Date | Buyer | Section 2.05(a) (PDF pp. 28–31) | Market: pre-close objection mechanism is common; short window. |
| Final Closing Statement preparation | within sixty (60) days after Closing | Buyer | Section 2.05(b) (PDF pp. 28–31) | Market: 60–90 days. |
| Seller review / dispute notice deadline | within sixty (60) days after receipt of Closing Statement | Seller | Section 2.05(c) (PDF pp. 28–31) | Market: 30–45 days; 60 days is seller-friendly. |
| Negotiation period | for a period of forty-five (45) days to resolve disagreements | Buyer & Seller | Section 2.05(c) (PDF pp. 28–31) | Market: often 15–30 days; 45 days is slightly seller-friendly but can prolong uncertainty. |
| Independent Accountant referral | After negotiation period ends without resolution | Buyer & Seller | Section 2.05(c) (PDF pp. 28–31) | Market: yes. |
| Independent Accountant decision | within forty-five (45) days of referral | Auditor (Deloitte & Touche LLP or other) | Section 2.05(c) (PDF pp. 28–31) | Market: often 30–45 days. |
| Payment of true-up | within five (5) Business Days of the Determination Date | Buyer or Seller (depending on Increase vs Deficit) | Section 2.05(g) (PDF pp. 28–31) | Market: 3–5 BD. |



### 5.2 Process Mechanics

| Element | How SPA Handles It | Market Position | Section Ref |
| --- | --- | --- | --- |
| Who prepares Estimated Statement | Seller prepares and delivers the Estimated Closing Statement. | 🟢 Market Standard | Section 2.05(a) (PDF pp. 28–31) |
| Who prepares Final Statement | Buyer prepares and delivers the Closing Statement. | 🟠 Slightly Off-Market (Buyer) | Section 2.05(b) (PDF pp. 28–31) |
| Seller access to books/records | access to the records, (to the extent involved in the preparation or components of the Closing Statement) personnel and (subject to the execution of customary work paper access letters if requested by) auditors of Buyer relating to the preparation of the Cl... | 🟢 Market Standard | Section 2.05(e) (PDF pp. 28–31) |
| Independent Accountant selection | Deloitte & Touche LLP (or such other independent accounting or financial consulting firm of recognized national standing as may be mutually selected by Buyer and Seller) (the “Auditor | 🟢 Market Standard | Section 2.05(c) (PDF pp. 28–31) |
| IA scope (disputed items only?) | consider only those items and amounts which are identified in the notice of disagreement delivered by Seller and which have not already been resolved by Seller and Buyer. | 🟢 Market Standard | Section 2.05(c) (PDF pp. 28–31) |
| IA standard of review | prepared in accordance with the standards set forth in Section 2.05(b) | 🟢 Market Standard | Section 2.05(b)/(c) (PDF pp. 28–31) |
| IA decision binding? | final, binding and conclusive | 🟢 Market Standard | Section 2.05(c) (PDF pp. 28–31) |
| Cost allocation for IA | fees and expenses of the Auditor shall be allocated between Seller and Buyer in proportion | 🟢 Market Standard | Section 2.05(d) (PDF pp. 28–31) |



### 5.3 Red Flags in True-Up Process

- **Missing methodology inputs:** The true-up relies on “Accounting Principles” (Exhibit A) and the “Sample Closing Statement” (Exhibit C), but neither is included in the provided PDF — this materially increases the risk of disputes over classification, cut-off, and reserves.
- **Control asymmetry:** Buyer prepares the Closing Statement (post-close) and therefore controls first draft of the final numbers (although Seller has review and dispute rights).
- **Timing risk:** Seller has 60 days to dispute (seller-friendly), but the negotiation + auditor windows can extend the process, delaying final settlement and potentially affecting cashflows.

## Part 6: Escrow & Holdback Terms

### 6.1 Escrow Summary Table

| Escrow Type | Amount | % of Deal | Purpose | Release Timing | Release Conditions | Interest To | Section Ref |
| --- | --- | --- | --- | --- | --- | --- | --- |
| General Indemnity | NOT APPLICABLE | — | — | — | — | — | NOT FOUND |
| PPA/Adjustment | NOT APPLICABLE | — | — | — | — | — | NOT FOUND |
| Special Purpose | NOT APPLICABLE | — | — | — | — | — | NOT FOUND |



### 6.2 Market Comparison

| Element | This SPA | Market Benchmark (No RWI) | Market Benchmark (With RWI) | Assessment |
| --- | --- | --- | --- | --- |
| Indemnity escrow % | NOT APPLICABLE | ~10% | ~0.5% | No escrow; risk allocation handled via caps/baskets and R&W insurance. |
| PPA escrow % | NOT APPLICABLE | ~1% | ~1% | No escrow; true-up paid directly under Section 2.05(g). |
| Escrow period | NOT APPLICABLE | 12 months | 12 months | No escrow period. |



### 6.3 Escrow Mechanics Details

- **Funded from purchase price or in addition?** NOT APPLICABLE.
- **Claim mechanics:** NOT APPLICABLE.
- **Relationship to indemnification:** NOT APPLICABLE.

**Practical note:** Although there is no transaction escrow, the Cash and Cash Equivalents definition excludes “Cash and Cash Equivalents held in escrow,” which matters only if the Group Companies have escrowed cash balances at Closing.

## Part 7: Accounting Principles & Methodology

### 7.1 Hierarchy

**Priority Order (quote the hierarchy clause):** NOT FOUND in provided PDF.

**Verbatim Language:**
```text
NOT FOUND in provided PDF (Accounting Principles are defined by reference to Exhibit A, which is not included).
```


**Section Reference:** “Accounting Principles” definition in Section 1.01 (PDF pp. 6–20) refers to Exhibit A (not included).

### 7.2 Key Methodology Questions

| Element | How SPA Addresses It | Section Ref |
| --- | --- | --- |
| GAAP/IFRS specification | GAAP is defined as U.S. GAAP; completion accounts are to be calculated in accordance with ‘Accounting Principles’ (Exhibit A, not included). | Definitions; Section 2.05(b) |
| “Consistent with past practice” language | NOT FOUND in the provided completion accounts provisions. | NOT FOUND |
| “Consistent with Financial Statements” language | Closing Statement components are calculated in accordance with Accounting Principles and by reference to Financial Statements concepts; Buyer must prepare Closing Statement in good faith. | Section 2.05(b) |
| Sample calculations / illustrative schedules | Referenced (Sample Closing Statement) but NOT FOUND in provided PDF. | Net Working Capital definition; Exhibit C (not included) |
| No hindsight / no new info provisions | Partial: Closing Statement is determined “without giving effect” to purchase accounting adjustments from the transaction. | Section 2.05(b) |
| No reclassification provisions | NOT FOUND in provided PDF (would normally be in Exhibit A). | NOT FOUND |
| Reserves methodology (historical vs GAAP true-up) | NOT FOUND in provided PDF (would normally be in Exhibit A / Sample Closing Statement). | NOT FOUND |
| Cut-off time specification | NOT FOUND beyond “as of immediately prior to the Closing”. | Definitions; Section 2.05 |
| FX rate determination | NOT APPLICABLE / NOT FOUND (USD domestic deal assumed). | NOT APPLICABLE |



### 7.3 Red Flags

| Issue | Quote | Risk |
| --- | --- | --- |
| Accounting Principles hierarchy missing from provided PDF | Accounting Principles refer to Exhibit A (not included). | High — without Exhibit A, calculations are not auditable/reproducible. |
| Buyer prepares Closing Statement | Buyer’s good faith calculation | Medium — Buyer controls first draft; disputes depend on IA process. |
| Purchase accounting exclusion only (no broader no-hindsight rule) | without giving effect to (A) the consummation of the transactions contemplated by this Agreement to occur at Closing (including any adjustments as a result of the application of purchase accounting | Medium — a fuller no-hindsight clause typically prevents ‘items that should have been recorded’ arguments. |



## Part 8: Sample Calculations & Schedules

**NOT FOUND (not in provided PDF).**

The Agreement references a “Sample Closing Statement” (Exhibit C) and “Accounting Principles” (Exhibit A), and also refers to schedules such as Schedule 1.01(e) and Schedule 5.08(a). None of these exhibits/schedules are included in the provided PDF, so no illustrative calculation tables or account-level schedules can be extracted here.

**Where this would typically appear:** Attachments at the end of the SPA (Exhibits/Schedules section), usually immediately following signature pages in a fully compiled agreement package.

## Part 9: Earnout Provisions

**NO EARNOUT PROVISION.** No earnout article, payment schedule, earnout metric definition, or earnout dispute mechanism is present in the provided SPA.

## Part 10: Locked-Box Provisions

**COMPLETION ACCOUNTS STRUCTURE — NO LOCKED-BOX.** The SPA uses an Estimated Closing Statement pre-close, a Closing Statement post-close, and an Adjustment Amount true-up (Section 2.05), which is inconsistent with a locked-box structure.

## Part 11: Funds Flow Mechanics

### 11.1 Funds Flow Table

| Payment | Amount/Formula | Recipient | Timing | Funding Source | Section Ref |
| --- | --- | --- | --- | --- | --- |
| Cash to seller (Purchase Price) | Purchase Price per Section 2.03(a) (cash; estimated components) | Seller (Stericycle, Inc.) | At Closing | Buyer funds | Section 2.04(b); Section 2.03(a) (PDF pp. 26–28) (PDF p. 26) |
| True-up payment (Increase Amount) | Adjustment Amount if positive | Seller (and/or Retained Companies designated by Seller) | Within five (5) Business Days after Determination Date | Buyer | Section 2.05(g) (PDF pp. 28–31) |
| True-up payment (Deficit Amount) | Adjustment Amount if negative (absolute value) | Buyer | Within five (5) Business Days after Determination Date | Seller | Section 2.05(g) (PDF pp. 28–31) |
| Buyer Ticking Fees reimbursement | Buyer Ticking Fees (as defined) that become due and payable | Buyer (or as directed by Buyer) | Promptly (but in any event within three (3) Business Days) after due | Seller | Section 5.28 (PDF pp. 83–84) |
| Debt payoff | NOT SPECIFIED as a separate funds-flow item (handled economically via Indebtedness deduction in Purchase Price). | Lenders (if any) | At/around Closing | Seller proceeds / Group Companies | Not specified |
| Transaction expenses payment | NOT SPECIFIED as a separate funds-flow item (handled economically via Transaction Expenses deduction in Purchase Price). | Advisors / employees | At/around Closing | Seller proceeds / Group Companies | Not specified |



### 11.2 Payment Mechanics

| Element | Details | Section Ref |
| --- | --- | --- |
| Wire instructions timing | Seller must deliver designated account(s) for wire transfer not later than three (3) Business Days prior to Closing. | Section 2.04(b) (PDF pp. 26–28) |
| Paying agent (if any) | NOT FOUND (direct wire to Seller-designated accounts). | NOT FOUND |
| Allocation among multiple sellers | NOT APPLICABLE (single Seller). | NOT APPLICABLE |
| Withholding provisions | Buyer may deduct/withhold amounts required under applicable Tax Law; notice and cooperation provisions included. | Section 2.03(b) (PDF p. 26) |



## Part 12: Set-Off Rights (All Contexts)

### 12.1 Set-Off Summary

| Context | Set-Off Permitted? | Conditions | Quote | Section Ref | Page Ref |
| --- | --- | --- | --- | --- | --- |
| Against escrow | NOT APPLICABLE | — | — | NOT FOUND | — |
| Against earnout | NOT APPLICABLE | — | — | NOT APPLICABLE | — |
| Against deferred payments | NOT APPLICABLE (no deferred consideration mechanic in provided text) | — | — | NOT APPLICABLE | — |
| Against seller note | NOT APPLICABLE | — | — | NOT APPLICABLE | — |
| General set-off clause | NOT FOUND (no broad set-off right identified; one anti-setoff clause exists for insurance reimbursements). | — | No payments due under this Section 5.11 shall affect, be affected by, or be subject to set off against, any adjustment to Purchase Price | Section 5.11(d) (PDF pp. 70–72) | PDF pp. 70–71 |



### 12.2 Limitations on Set-Off

| Limitation | Present? | Details |
| --- | --- | --- |
| Only finally determined amounts | N/A | — |
| Notice requirements | N/A | — |
| Cure period | N/A | — |
| Minimum threshold | N/A | — |
| Sole recourse to escrow | N/A | — |



**Note:** While there is no broad set-off right identified, the SPA has multiple “reduction” mechanisms (e.g., indemnified damages reduced by insurance proceeds and tax benefits in Section 9.06) which functionally operate like offsets within damages calculations.

## Part 13: Indemnification Mechanics (Financial Aspects)

### 13.1 Summary Table

| Element | Seller Indemnity | Buyer Indemnity | Section Ref |
| --- | --- | --- | --- |
| Cap (general reps) | **$2,312,500.00** aggregate liability cap for Section 9.02(a)(i) (other than Seller Fundamental Reps and Environmental Reps), per Section 9.03(a)(iii). | Ambiguity: Section 9.03(a)(iii) states Seller’s **or Buyer’s** aggregate liability for this category does not exceed **$2,312,500.00**, but Section 9.03(d) separately caps Buyer’s aggregate liability for Section 9.02(b)(i) (other than Buyer Fundamental Reps) at **$46,250,000.00**. | Section 9.03(a),(d) (PDF pp. 98–99) |
| Cap (fundamental reps) | NOT EXPRESSLY STATED in Section 9.03 (general cap excludes Seller Fundamental Reps). Practical reading: fundamental rep breaches may be uncapped (except Fraud carve-outs and exclusive remedy framework). | Buyer Fundamental Reps similarly carved out from caps; separate cap not stated. | Section 9.03(a),(c),(d); Section 9.01 (PDF pp. 95–96) (PDF pp. 98–99) |
| Basket type | Deductible (only amounts in excess) with mini-basket. | Deductible (symmetric in 9.03(a) wording). | Section 9.03(a) (PDF pp. 98–99) |
| Basket amount | $2,312,500.00 (the “Deductible”). | $2,312,500.00 (the “Deductible”) (subject to buyer-cap ambiguity noted above). | Section 9.03(a)(ii) (PDF pp. 98–99) |
| De minimis threshold | $100,000 (the “Mini-Basket”). Environmental: $25,000 Enviro Mini-Basket. | $100,000 (the “Mini-Basket”). | Section 9.03(a)(i); 9.03(b)(i) (PDF pp. 98–99) |
| Survival (general) | 12 months after Closing for most reps/warranties (subject to carve-outs). | 12 months after Closing for most reps/warranties (subject to carve-outs). | Section 9.01 (PDF pp. 95–96) |
| Survival (fundamental) | Seller Fundamental Reps survive 3 years after Closing. | Buyer Fundamental Reps survive 3 years after Closing. | Section 9.01 (PDF pp. 95–96) |
| Survival (tax) | Income Tax reps: until 60 days after statute of limitations; other Tax reps: 3 years. | N/A (Buyer tax reps not typical). | Section 9.01 (PDF pp. 95–96) |



### 13.2 Exclusive Remedy Analysis

| Question | Answer | Quote |
| --- | --- | --- |
| Is indemnification the exclusive remedy? | Yes (monetary), post-Closing, subject to carve-outs. | sole and exclusive monetary remedy |
| Carve-outs from exclusive remedy? | Yes (Fraud; injunctive/equitable; claims under R&W Insurance Policy; purchase price adjustment under Section 2.05; claims permitted by other Transaction Documents). | Except with respect to (a) claims based on Fraud solely in respect of any representation or warranty expressly given in this Agreement or in any certificate delivered by Seller pursuant to this Agreement, (b) claims for injunctive or equitable remedies, (c)... |
| Is escrow the exclusive source? | NOT APPLICABLE (no escrow). | — |
| Can buyer pursue sellers directly after escrow exhausted? | Not applicable; claims are subject to caps/survival and R&W insurance, not escrow structure. | — |



### 13.3 Alignment Check

| Element | Aligned? | Issue |
| --- | --- | --- |
| Escrow period vs. survival period | N/A | No escrow; survival periods govern. |
| Escrow amount vs. cap | N/A | No escrow; caps and R&W insurance define recovery. |
| Basket vs. de minimis | Aligned (Mini-Basket + Deductible) | Mini-basket claims don’t count; deductible applies to aggregate above threshold. |



**Key observation / negotiation red flag:** Section 9.03 contains **an internal cap ambiguity**: the text of Section 9.03(a)(iii) appears to cap “Seller’s **or Buyer’s** aggregate Liability” at $2.3125m for non-fundamental rep breaches, while Section 9.03(d) later references a $46.25m Buyer cap for similar claims. This should be treated as a drafting/interpretation issue and clarified before signing/closing.

## Part 14: Tax Provisions (Beyond Definition)

### 14.1 Tax Allocation

| Element | Details | Section Ref |
| --- | --- | --- |
| Pre-closing tax responsibility | Seller bears/indemnifies for Pre-Closing Taxes of Group Companies and certain group liabilities; filing responsibilities are allocated in Article VI. | Section 9.02(a)(iv); Section 6.01 (PDF pp. 84–86)(a) |
| Straddle period allocation method | Hybrid: per-diem proration for property-like taxes; closing-of-books for Income Taxes (treated as if period ended on Closing Date). | Section 6.01 (PDF pp. 84–86)(d) |
| Transfer taxes allocation | Buyer bears and timely pays Transfer Taxes; reimburses Seller if Seller pays under applicable law. | Section 6.01 (PDF pp. 84–86)(c) |
| Withholding mechanics | Buyer may deduct/withhold amounts required under Tax Law; notice and cooperation obligations included. | Section 2.03(b) (PDF p. 26) |
| Gross-up provisions | NOT FOUND (no general gross-up obligation identified). | NOT FOUND |



**Load-bearing verbatim snippets:**

- **Transfer taxes:** Transfer Taxes”) shall be borne and timely paid by Buyer
- **Straddle allocation:** In the case of any Straddle Tax Period, (i) real, personal and intangible property Taxes and any other similar Taxes levied on a per diem basis of any Person for a Pre-Closing Tax Period shall be equal to the amount of such Taxes for the entire Straddle Tax Period multiplied by a fraction, the numerator of which is the number of days during the Straddle Tax Period that are i...
- **Withholding (Section 2.03(b)):**
```text
(b) Buyer (and its Affiliates) shall be entitled to deduct and withhold from the Purchase Price such amounts as it is required to deduct
and withhold for tax purposes under applicable Tax Law. If Buyer determines that any deduction or withholding is required in respect of a payment
pursuant to this Agreement, Buyer shall provide written notice to Seller no less than fifteen (15) days prior to the date on which such deduction or
withholding is to be made with a written explanation substantiating the requirement to deduct or withhold, and the Parties shall use commercially
reasonable efforts to cooperate to mitigate any such requirement to the maximum extent permitted by Law; provided that no such notice shall be
required with respect to compensatory payments or if the certificate contemplated by Section 2.04(c)(iv) is not delivered. Buyer shall promptly remit all
deducted or withheld amounts to the applicable Governmental Authority in accordance with applicable Law and shall promptly provide Seller with a
receipt issued by the Governmental Authority or other reasonable evidence of such remittance. Any amounts so deducted, withheld and remitted
consistent with the terms of this Section 2.03(b) shall be treated for all purposes of this Agreement as having been paid to Seller.
```


### 14.2 Tax Covenants

| Covenant | Present? | Key Terms |
| --- | --- | --- |
| Cooperation on returns | Yes | Cooperation obligations and information sharing for tax matters; details in Article VI. |
| No amended returns | Unclear (see Buyer covenants) | Buyer covenants often restrict amended returns and elections for pre-close/straddle periods; confirm exact language in Section 6.03. |
| Tax contest provisions | Yes | Tax claims procedure, notice, control, participation rights; details in Section 6.05. |
| Refund allocation | Yes | Buyer pays qualifying refunds attributable to pre-close periods to Seller quarterly (net of related costs/taxes); details in Section 6.01(b). |



### 14.3 Tax Indemnity Overlap

| Question | Answer | Quote | Section Ref |
| --- | --- | --- | --- |
| Tax indemnity present? | Yes | Seller indemnifies for “(A) Pre-Closing Taxes ... (B) ... liability under Treasury Regulations Section 1.1502-6 ... (C) ... Tax sharing... agreements”. | Section 9.02(a)(iv) |
| Overlap with Working Capital tax accruals addressed? | Yes (by exclusion) | Net Working Capital excludes “all current and deferred Tax assets and Tax liabilities”. | Net Working Capital definition (Section 1.01) |
| Quote anti-overlap language | Yes | “...all current and deferred Tax assets and Tax liabilities will be excluded...” | Net Working Capital definition (Section 1.01) |



## Part 15: Insurance Provisions

### 15.1 R&W Insurance

| Element | Details | Section Ref |
| --- | --- | --- |
| R&W insurance required/obtained? | Yes — parties acknowledge an R&W Insurance Policy; Buyer restricted from amending policy to permit subrogation against Seller except for Fraud. | Section 5.25 (PDF p. 83) |
| Premium allocation | NOT FOUND in provided PDF. | NOT FOUND |
| Retention amount | NOT FOUND in provided PDF (but Seller general rep cap/deductible of $2.3125m is consistent with an RWI retention). | Section 9.03(a) (PDF pp. 98–99) (inference) |
| Impact on indemnification | R&W policy proceeds treated as additive (not in lieu) of recovery under the SPA; exclusive remedy clause expressly carves out claims filed under the R&W policy. | Section 9.06(d); Section 9.08 (PDF pp. 106–107) |



**Verbatim (Section 5.25):**
```text
Section 5.25 R&W Insurance Policy. Buyer shall not agree to any amendment, variation or waiver of the R&W Insurance Policy (or do
anything which has a similar effect) which would result in the insurer under the R&W Insurance Policy having any right of subrogation against Seller or
any direct or indirect shareholder, beneficiary, trustee, administrator, fiduciary, member, director or officer or partner (or the functional equivalent of any
such position) of Seller in connection with this Agreement and the transactions contemplated hereby except and to the extent of Fraud by any such
Person in connection with this Agreement and the transactions contemplated hereby without Seller’s prior written consent.
```


### 15.2 D&O Tail

| Element | Details | Section Ref |
| --- | --- | --- |
| D&O tail required? | NOT FOUND in provided PDF. | NOT FOUND |
| Premium payment responsibility | NOT APPLICABLE / NOT FOUND. | NOT FOUND |
| Captured in Transaction Expenses? | Not explicitly (Transaction Expenses definition does not mention D&O tail). | Transaction Expenses definition |
| Policy term | NOT APPLICABLE / NOT FOUND. | NOT FOUND |



## Part 16: Intercompany Treatment

### 16.1 Intercompany Balances

| Element | Details | Section Ref |
| --- | --- | --- |
| Intercompany balances addressed? | Yes — intercompany balances between Group Companies and Retained Companies must be eliminated effective at or prior to Closing. | Section 5.08(a) (PDF pp. 67–68) |
| Settlement required pre-close? | Yes — elimination/discharge required at or prior to Closing. | Section 5.08(a) (PDF pp. 67–68) |
| Included in Indebtedness? | Not directly; intended to be eliminated so they should not appear in Closing Statement. | Section 5.08(a) (PDF pp. 67–68) |
| Included in Working Capital? | Not directly; intended to be eliminated so they should not appear in NWC. | Section 5.08(a) (PDF pp. 67–68) |
| Which direction (receivables vs payables)? | Both — applies to balances “between” Group Companies and Retained Companies. | Section 5.08(a) (PDF pp. 67–68) |



**Verbatim (Section 5.08):**
```text
Section 5.08 Intercompany Balances; Affiliate Transactions.
(a) Except as set forth in Schedule 5.08(a), all intercompany balances between any of the Group Companies, on the one hand, and any of
the Retained Companies, on the other hand, shall be eliminated by discharge or otherwise in their entirety effective at or prior to the Closing without any
costs or other Liability to Buyer or its Affiliates (including, following the Closing, the Business and the Group Companies) and otherwise in a manner
that is reasonably satisfactory to Buyer. Intercompany balances and accounts solely among any of the Group Companies shall not be affected by this
provision.
(b) Except for the Transaction Documents, Contracts relating to the Retained ESOL Businesses and the Related Party Contracts set forth
on Schedule 5.08(b), on or prior to the Closing, Seller shall take all actions necessary to cause any and all Related Party Contracts to have been
terminated, effective as of the Closing, and as of such time all such Related Party Contracts shall be without any further force and effect, and all
obligations and Liabilities thereunder shall be deemed to have been satisfied; provided, that the termination of such Related Party Contracts shall not
result in Buyer, any of its Affiliates (including the Group Companies) or the Business incurring any Damages.
```


### 16.2 Intercompany Agreements

| Element | Details |
| --- | --- |
| Termination required? | Yes — intercompany agreements to be terminated effective as of Closing (subject to exceptions in the provision). |
| Transition services? | Not explicitly in Section 5.08; TSA is not identified in the provided PDF (may exist in separate transaction document). |



## Part 17: FX Mechanics (If Cross-Border)

**SINGLE CURRENCY DEAL.** The SPA’s Purchase Price is stated in U.S. dollars, the parties are Delaware entities, and no FX mechanics (rate source/timing/collar) are provided in the agreement text.

## Part 18: Financial Representations

### 18.1 Financial Statements Rep

**Verbatim (Section 3.06; PDF pp. 34–36):**
```text
Section 3.06 Financial Statements and Other Information.
(a) Attached as Schedule 3.06(a) are true and complete copies of (i) the audited combined financial statements of the Group Companies
and the Retained ESOL Businesses, which comprise the combined balance sheet (the “Balance Sheet”) as of December 31, 2018 and the related
combined statements of income, parent company net investment and cash flows (and, if applicable, of comprehensive income) for the year ended
December 31, 2018 and the related notes thereto (the “Audited Financial Statements”) and (ii) the unaudited interim combined balance sheet of the
Group Companies and the Retained ESOL Businesses as of September 30, 2019 (the “Balance Sheet Date”) and September 30, 2018 and the related
combined statements of income, parent company net investment and cash flows (and, if applicable, of comprehensive income) for the nine (9) months
ended September 30, 2019 and September 30, 2018 (the “Unaudited Financial Statements” and together with the Audited Financial Statements, the
“Financial Statements”). Except as set forth in Schedule 3.06(b), the Financial Statements (i) have been prepared from, and are in accordance with, the
books and records of the applicable Group Companies and the Retained ESOL Businesses in all material respects (except as may be indicated in the
notes thereto), (ii) fairly present in all material respects the combined financial position and combined results of operations and cash flows of the Group
Companies and the Retained ESOL Businesses as of the respective dates or for the respective time periods set forth therein, (iii) have been prepared in
accordance with GAAP consistently applied (except as may be indicated in the notes thereto), (iv) have been prepared in accordance with the carve-out
guidelines included in SEC Staff Accounting Bulletin Topic 1.B. and (v) (x) in the case of the Audited Financial Statements, audited in accordance with
the American Institute of Certified Public Accounts (“AICPA”) standards by Ernst & Young LLP and (y) in the case of the Unaudited Financial
Statements, reviewed in accordance with AICPA Statement of Auditing Standards 100 by Ernst & Young LLP. Prior to the date hereof, Seller has
provided to Buyer the unaudited monthly statements of income of the Group Companies and the Retained ESOL Business, for each of the fiscal months
ending October 31, 2019, November 30, 2019 and December 31, 2019 (in the form of the schedule attached to Schedule 3.06(c)) (the “Unaudited
Monthly Financial Statements”). The Unaudited Monthly Financial Statements (i) have been prepared from, and are in accordance with, the books and
records of the applicable Group Companies and the Retained ESOL Businesses in all material respects and (ii) fairly present in all material respects the
cash flows of the Group Companies and the Retained ESOL Businesses as of the respective dates or for the respective time periods set forth
therein. This Section 3.06(a) is qualified by the fact that the Group Companies and the Retained ESOL Businesses have not operated as a separate “stand
alone” entity. As a result, the Group Companies and the Retained ESOL Businesses have been allocated certain charges and credits for purposes of the
preparation of the Financial Statements. Such allocations of charges and credits do not necessarily reflect the amounts that would have resulted from
arms-length transactions or the actual costs that would be incurred if the Group Companies and the Retained ESOL Businesses operated as an
independent enterprise. Since December 31, 2018, there has been no material change in the accounting methods or principles of the Group Companies
or the Retained ESOL Businesses that would be required to be disclosed in the Financial Statements in accordance with GAAP, except as described in
the Financial Statements or the notes thereto. Neither the Group Companies nor the Retained ESOL Businesses are parties to, or have any commitments
to become parties to, an “off-balance sheet arrangement” within the meaning of Item 303 of Regulation S-K.
(b) Seller maintains a system of internal controls over financial reporting (as defined in Rules 13a-15(f) and 15d-15(f) of the Exchange
Act) sufficient to provide reasonable assurances regarding the reliability of financial reporting related to the Group Companies. Seller (i) maintains
disclosure controls and procedures (as defined in Rules 13a-15(e) and 15d-15(e) of the Exchange Act) to ensure that information required to be disclosed
by Seller related to the Group Companies in the reports that it files or submits under the Exchange Act is recorded, processed, summarized and reported
within the time periods specified in the SEC’s rules and forms and is accumulated and communicated to management as appropriate to allow timely
decisions regarding required disclosure and (ii) has disclosed to Seller’s auditors (A) any significant deficiencies and material weaknesses in the design
or operation of internal controls over financial reporting that are reasonably likely to adversely affect in any material respect the ability to record,
process, summarize and report financial information related to the Group Companies and (B) any fraud, whether or not material, that involves
management or other employees who have a significant role in the internal controls over financial reporting.
(c) The books and records of the Business, the applicable Group Companies and the Retained ESOL Businesses (i) since January 1,
2016, have been maintained in all material respects in compliance with applicable requirements of GAAP, (ii) are true and complete in all material
respects and (iii) correctly and accurately reflect all material dealings and material transactions in respect of the business, assets, liabilities and affairs of
the Business, the Group Companies and the Retained ESOL Businesses. All corporate proceedings and actions reflected in the financial books and
records of the Business, the Group Companies and the Retained ESOL Businesses have been conducted or taken in compliance in all material respects
with all applicable Laws and with the respective Organizational Documents of the Group Companies and the Retained Companies.
(d) The minute books (or equivalent) of each of the Group Companies contain materially true and complete records of minutes of all
meetings of, or actions of written consent by, the directors or managers (as applicable) and equityholders, in each case, having occurred since January 1,
2016.
```


**Analysis:**
| Element | Present? | Assessment |
| --- | --- | --- |
| “Fairly present” | Yes | Market-standard financial statements standard; typically limited to GAAP and material respects. |
| “Accurate and complete” | No | Not present — avoids higher ‘accurate/complete’ standard (seller-favorable). |
| “In all material respects” | Yes | Materiality qualifier limits seller exposure; market-standard. |
| “Taken as a whole” | No | Not present — could be a negotiation point depending on context. |
| Knowledge qualifier | No | Not present — stronger for buyer (rep is not knowledge-qualified). |
| Books and records qualifier | Yes | Presence may narrow rep to what books reflect; check exact wording. |
| GAAP/IFRS compliance | Yes | GAAP referenced; market-standard. |
| Consistency | Yes | Consistency language reduces manipulation across periods. |
| Interim period carve-outs | Yes | Unaudited interim statements typically have lighter standards; verify. |



### 18.2 No Undisclosed Liabilities Rep

**Verbatim (Section 3.08; PDF p. 36):**
```text
Section 3.08 No Undisclosed Liabilities; Reserves. Except as set forth in the Disclosure Schedules, there is no Liability of the Group Companies
or the Business of a type required to be reflected or reserved for on (or disclosed in the notes to) a combined balance sheet of the Group Companies
prepared in accordance with GAAP, except for liabilities, debts and obligations (a) reflected or reserved for on the Financial Statements, (b) that have
arisen since the Balance Sheet Date in the ordinary course of the operation of the Business and that are not, individually or in the aggregate, material to
the Group Companies, taken as a whole, or the Business, (c) incurred in connection with the transactions contemplated by this Agreement and the other
Transaction Documents or (d) that would not reasonably be expected to, individually or in the aggregate, be material to the Group Companies, taken as a
whole, or the Business. Schedule 3.08 sets forth, as of the date hereof, the Reserved Amount in respect of each site and facility of the Business.
```


**Carve-outs:**
- Liabilities reflected or reserved for on the Financial Statements.
- Liabilities arising since the Balance Sheet Date in the ordinary course of business and other carve-outs in the clause.

### 18.3 Absence of Changes Rep

**Verbatim (Section 3.07; PDF p. 36):**
```text
Section 3.07 Absence of Certain Changes.
(a) Except for actions taken in connection with the transactions contemplated by this Agreement (including the Pre-Closing Business
Transfers), from the Balance Sheet Date through the date of this Agreement, (a) the Group Companies and the Business have been conducted in the
ordinary course of business consistent with past practices in all material respects and (b) none of the Group Companies or the Business has taken any
action which, if taken or omitted to be taken after the date hereof, would require the consent of Buyer in accordance with Section 5.01(a)(i),
Section 5.01(a)(ii), Section 5.01(a)(iii), Section 5.01(a)(vi), Section 5.01(a)(vii) (with respect to Section 5.01(a)(vii), other than Tax elections permitted
as a result of a change in Law), Section 5.01(a)(viii), Section 5.01(a)(ix), Section 5.01(a)(xviii), Section 5.01(a)(xix), Section 5.01(a)(xxi) or
Section 5.01(a)(xxii).
(b) Since December 31, 2018, there has not been any event, occurrence or development that has had or would reasonably be expected to
have, individually or in the aggregate, a Material Adverse Effect or materially interfere with, prevent or materially delay the ability of Seller to enter into
and perform its obligations under the Transaction Documents to which it is a party or consummate the transactions contemplated thereby.
```


**Analysis:**
- This rep is economically important because it can anchor working-capital and liability build-ups between the Balance Sheet Date and signing/closing.
- Pay attention to the list of prohibited actions and how it interacts with interim operating covenants and the Pre-Closing Business Transfers.

## Part 19: Material Adverse Change/Effect

### 19.1 MAC/MAE Definition

**Verbatim (“Material Adverse Effect”; Section 1.01 definitions; PDF p. 15):**
```text
“Material Adverse Effect” means a material adverse effect on the business, results of operations or financial condition of the Group Companies,
taken as a whole, or the Business; provided, however, that in no event would any of the following, alone or in combination, be deemed to constitute, nor
shall any of the following (including the effect of any of the following) be taken into account in determining whether there has been or will be, a
“Material Adverse Effect”: (a) any change after the date hereof in applicable Law or GAAP or any interpretation thereof; (b) general economic, political
or business conditions or changes therein (including commencement, continuation or escalation of war, armed hostilities or national or international
calamity); (c) financial and capital markets conditions, including interest rates and currency exchange rates, or changes therein; (d) any change generally
affecting the industries in which the Business or the Group Companies operate; (e) the entry into or announcement of this Agreement, the consummation
of the transactions contemplated hereby or the performance of this Agreement or any other Transaction Document, including any adverse change in
customer, supplier, governmental, landlord, employee or similar relationships resulting therefrom (provided, however, that this clause (e) shall not apply
with respect to any representation or warranty in this Agreement, any other Transaction Document or any certificate to be delivered hereunder or
thereunder or any related closing condition to the extent that such portion of such representation or warranty expressly addresses the consequences
resulting from the execution, delivery, performance or announcement of this Agreement or any other Transaction Document); (f) the taking of any action
(or the omission of any action) at the written request of Buyer; (g) any act of God or natural disaster; (h) any acts of terrorism or changes in geopolitical
conditions; (i) any failure of the Business or the Group Companies to meet any projections, business plans or forecasts (provided that, this clause
(i) shall not prevent a determination that any change or effect underlying such failure to meet projections, business plans or forecasts has resulted in a
Material Adverse Effect (to the extent such change or effect is not otherwise excluded from this definition of Material Adverse Effect)); or (j) any
Retained Liability; except, in the case of the foregoing clauses (a), (b), (c), (d), (g) and (h), to the extent that such matters materially and
disproportionately impact the Group Companies (taken as a whole) or the Business relative to other Persons in the industries in which the Business or
the Group Companies operate.
```


### 19.2 Carve-Outs

| Carve-Out Category | Included? | Specific Language |
| --- | --- | --- |
| General economic conditions | Yes | general economic, political
or business conditions or changes therein (including commencement, continuation or escalation of war, armed hostilities or national or international
calamity) |
| Industry conditions | Yes | any change generally
affecting the industries in which the Business or the Group Companies operate |
| Changes in law | Yes | any change after the date hereof in applicable Law or GAAP or any interpretation thereof |
| Changes in GAAP/IFRS | Yes | any change after the date hereof in applicable Law or GAAP or any interpretation thereof |
| Announcement of transaction | Yes | the entry into or announcement of this Agreement, the consummation
of the transactions contemplated hereby or the performance of this Agreement or any other Transaction Document, including any adverse change in
customer, supplier, governmental, landlord, employee or similar relationships resulting therefrom (provided, however, that this clause (e) shall not apply
with respect to any representation or warranty in this Agreement, any other Transaction Document or any certificate to be delivered hereunder or
thereunder or any related closing condition to the extent that such portion of such representation or warranty expressly addresses the consequences
resulting from the execution, delivery, performance or announcement of this Agreement or any other Transaction Document) |
| Actions required by agreement | Partially | Included via clause (e) references to “performance by Seller and Buyer of their obligations under this Agreement (and the other Transaction Documents)”. (Exact language in clause (e).) |
| Actions consented to by buyer | Yes | the taking of any action
(or the omission of any action) at the written request of Buyer |
| War/terrorism/national calamity | Yes | any acts of terrorism or changes in geopolitical
conditions; (i) any failure of the Business or the Group Companies to meet any projections, business plans or forecasts (provided that, this clause
(i) shall not prevent a determination that any change or effect underlying such failure to meet projections, business plans or forecasts has resulted in a
Material Adverse Effect (to the extent such change or effect is not otherwise excluded from this definition of Material Adverse Effect)); or (j) any
Retained Liability; except, in the case of the foregoing |



### 19.3 “Disproportionate Impact” Qualifier

- **Present?** Yes
- **Language:** disproportionately impact the Group Companies (taken as a whole) or the Business relative to other Persons in the industries in which the Business or the Group Companies operate.

## Part 20: Comprehensive Risk Assessment

### 20.1 Top 10 Financial Risks (Ranked)

| Rank | Risk | Definitions/Sections Involved | Severity | Likelihood | Recommendation |
| --- | --- | --- | --- | --- | --- |
| 1 | Missing Exhibits/Schedules (Accounting Principles; Sample Closing Statement; Schedule 1.01(e); etc.) | Accounting Principles definition; Net Working Capital; Indebtedness (k)/(l); Purchase Price/true-up | High | High | Obtain full executed agreement package incl. all exhibits/schedules; re-run completion accounts modeling against those documents. |
| 2 | Indebtedness definition includes non-debt items + fixed ‘Aggregate Reserved Amount’ + schedule/methodology items | Indebtedness definition (Section 1.01) | High | High | Quantify each non-traditional component; negotiate to remove or cap; move to specific indemnity or explicit price line item. |
| 3 | Double count risk: compensation and deal costs can sit in both Indebtedness and Transaction Expenses | Indebtedness (g); Transaction Expenses (iii); Net Working Capital exclusion routing | High | Medium | Insert explicit priority/routing clause and include a closing schedule confirming classification by line item. |
| 4 | Cash exclusions could strip Seller of cash credit (restricted/trapped/pledged cash) without separate compensation | Cash and Cash Equivalents definition | High | Medium | Build a cash schedule with included/excluded accounts; negotiate credit or haircut for soon-to-be-released restricted cash. |
| 5 | Indemnification cap ambiguity for Buyer liability (2.3125m vs 46.25m) and potential uncapped fundamental reps | Section 9.03(a),(d); Section 9.01 | High | Medium | Clarify drafting via amendment; expressly state Buyer cap and fundamental caps. |
| 6 | Buyer controls post-close Closing Statement (classification and reserves risk) | Section 2.05(b); Exhibit A/C (missing) | Medium | High | Constrain accounting discretion via detailed Exhibit A hierarchy, no reclassification, and objective line-item schedules. |
| 7 | Working capital collar may create ‘no adjustment band’ — risk of mismatched expectations on target/peg | Target Closing NWC definition; Section 2.03(a) | Medium | Medium | Model sensitivity; confirm collar intentional; document thresholds and how they were derived. |
| 8 | Materiality scrape in indemnity increases seller exposure (especially without detailed disclosures) | Section 9.02(a)(i) proviso | Medium | Medium | Confirm scope of scrape and carve-outs (e.g., Section 3.06, 3.07(b), 3.09(a)); align with RWI underwriting. |
| 9 | R&W policy proceeds treated as additive (potential double recovery tension) | Section 9.06(d); Section 9.08 | Medium | Low | Confirm whether SPA prohibits double recovery and how proceeds are coordinated with indemnity claims; align with policy terms. |
| 10 | Tax/NWC separation: tax payables excluded from NWC, must be fully covered by tax indemnity/returns | Net Working Capital definition; Article VI; Section 9.02(a)(iv) | Medium | Medium | Ensure a tax closing schedule exists for sales/use/payroll accruals; confirm payment mechanics and control of tax contests. |



### 20.2 Double-Count Risks Summary

| Item | Risk Level | Mitigation Present? | Action Needed |
| --- | --- | --- | --- |
| Employee transaction bonuses/severance | High | Partial (routing excludes from NWC, but overlap between Indebtedness and Transaction Expenses remains) | Add explicit priority; include a closing schedule listing all bonus/severance amounts and their bucket. |
| Prepayment premiums/breakage | Medium | Partial (in Indebtedness; could overlap with Transaction Expenses if treated as deal cost) | State explicitly they are Indebtedness and excluded from Transaction Expenses. |
| Advisor fees accrued vs unpaid | Low | Yes (NWC excludes Transaction Expenses) | Confirm the Closing Statement maps all accrued deal fees to Transaction Expenses. |
| Environmental reserves vs indemnities | High | Unclear (Aggregate Reserved Amount in Indebtedness + environmental reps/indemnities) | Avoid double charging: either treat reserves as price chip or as indemnity topic, not both. |



### 20.3 Gap Risks Summary

| Item | Risk Level | Currently Addressed? | Action Needed |
| --- | --- | --- | --- |
| Restricted/pledged cash | High | Partially (excluded from Cash) | Quantify and decide explicit treatment (credit, haircut, or exclude with transparency). |
| Operating lease liabilities (ASC 842) | Medium | Unclear | Explicitly classify and exclude/include via Exhibit A. |
| Schedule-driven Indebtedness items | High | Not addressed in provided PDF | Obtain schedules; otherwise cannot validate purchase price. |



## Part 21: Negotiation Analysis

### 21.1 Buyer-Favorable Provisions

| Provision | Why Buyer-Favorable | Typical Seller Pushback | Suggested Compromise |
| --- | --- | --- | --- |
| Indebtedness includes benefit plan deficits, compensation accruals, and fixed/schedule-driven amounts | Expands ‘debt-free’ deduction and reduces Seller proceeds beyond market net debt. | Seller will push to confine debt to financing items or to treat these as operational liabilities handled through WC/indemnity. | Move non-debt items to specific indemnity or to WC; keep true debt in Indebtedness; explicitly quantify any negotiated fixed amount as a separate line item. |
| Buyer prepares post-close Closing Statement | Buyer controls first draft and can influence classification/reserves absent tight Exhibit A/C. | Seller asks for joint preparation or Seller-prepared statement with Buyer review. | Keep Buyer-prepared but add strict accounting hierarchy, no reclassification, detailed sample statement, and robust access rights. |
| Cash exclusions for ‘not freely usable’ and collateral cash | Reduces cash credit to Seller; can be material with pledged collateral/restricted cash. | Seller asks to include all cash subject only to specific scheduled exclusions or to credit soon-to-be-released restricted cash. | Add a cash schedule and allow credit (or haircut) for specified restricted balances expected to be released within X days post-close. |
| Materiality scrape for indemnity | Increases probability/magnitude of indemnity claims by ignoring materiality qualifiers for breach/damages (with carve-outs). | Seller asks to limit scrape or tie to RWI process. | Keep scrape but carve out additional reps, align with RWI underwriting, and ensure caps/baskets reflect risk. |
| Buyer ticking fee reimbursement (Section 5.28) | Shifts financing carry costs to Seller if closing delayed after a specified date. | Seller argues regulatory timing risk is shared; seeks cap or sunset. | Cap ticking fees; exclude delays caused by Buyer; provide mitigation and notice requirements. |



### 21.2 Seller-Favorable Provisions

| Provision | Why Seller-Favorable | Typical Buyer Pushback | Suggested Compromise |
| --- | --- | --- | --- |
| Very low general rep cap and deductible ($2.3125m) consistent with RWI retention | Limits Seller direct exposure for most rep breaches; aligns with RWI market. | Buyer may seek higher cap if policy excludes certain areas. | Increase cap only for specifically excluded reps (e.g., tax/fundamental) and keep general cap at retention-level. |
| No escrow/holdback | Seller receives full cash at Closing (subject to adjustments) rather than tying up proceeds. | Buyer may want a small escrow for true-up or known issues. | Use direct true-up payments (already in SPA) and rely on RWI; if needed, add narrow special escrow for a known item only. |
| Seller-friendly dispute timelines (60-day review; 45-day negotiation) | Gives Seller more time to analyze Buyer’s Closing Statement and negotiate. | Buyer may push for shorter periods to close out uncertainty. | Shorten review to 45 days but enhance access and data delivery; keep IA timeframe. |
| Working capital collar (no adjustment within band) | Reduces purchase price volatility and reduces disputes over small variances. | Buyer may want a single-point target with dollar-for-dollar adjustment. | Narrow the collar band or add a collar with sharing (e.g., split within band). |



### 21.3 Key Negotiation Leverage Points

| Issue | Current Position | Importance | Negotiability | Suggested Approach |
| --- | --- | --- | --- | --- |
| Indebtedness scope (non-debt items, fixed reserved amount, schedule-driven items) | Very broad; includes multiple bespoke/non-traditional items | High | High | Quantify, then reallocate: move to specific indemnities or explicit price chips; insist on schedules/methodologies. |
| Accounting Principles / Sample Closing Statement missing from provided PDF | Referenced but not provided here | High | High | Make delivery of Exhibit A/C and schedules a closing condition (or obtain immediately); ensure they constrain classification. |
| Employee-related items classification (bonuses, severance, payroll taxes) | Potential overlap across Debt/TxnExp/WC | High | Medium | Insert explicit priority and provide a closing schedule to prevent double counting. |
| Indemnity cap ambiguity (Buyer $2.3125m vs $46.25m) | Ambiguous drafting | High | High | Fix via amendment; clarity is critical for enforceability and underwriting. |
| Cash restrictions treatment | Broad exclusions | Medium | Medium | Schedule restricted cash; negotiate credit/haircut if release expected post-close. |


## Part 22: Suggested Revisions

### Revision 1: Narrow Indebtedness to financing-style debt; remove non-debt operational liabilities and fixed reserve amounts

**Current Language:**

```text
“Indebtedness” means, without duplication, after giving effect to the Pre-Closing Business Transfers and as calculated in accordance with the
Accounting Principles and whether or not they constitute Transferred Liabilities, (a) all obligations of the Group Companies for borrowed money, (b) all
obligations of the Group Companies evidenced by notes, bonds (other than surety bonds), debentures or other similar instruments, including obligations
of the Group Companies under the Deferred Consideration Notes (to the extent they are obligations of the Group Companies), (c) all reimbursement or
repayment obligations of the Group Companies under letters of credit and surety bonds, performance bonds, closure bonds, keep-well, bankers’
acceptances or similar arrangements solely to the extent such letters of credit have been drawn or claims have been made that remain unpaid under such
surety bonds, performance bonds, closure bonds, keep-well, bankers’ acceptances or similar arrangements, (d) all obligations of the Group Companies
under leases classified as finance leases (and not operating leases) to the extent that they have been or are required to be, in accordance with the
Accounting Principles, recorded as capitalized leases, (e) all accrued payment obligations in respect of contributions, including employer matching
contributions, of the Group Companies or the Business under the Seller 401(k) Plans in respect of any Business Employee for the 2019 fiscal year and
any prior fiscal years, (f) all obligations of the Group Companies in respect of deferred compensation, post-retirement welfare benefits (other than under
the Consolidated Omnibus Budget Reconciliation Act of 1985 and similar obligations) and unfunded or underfunded pensions, including for Business
Employees, (g) all obligations of the Group Companies in respect of accrued bonuses, accrued commissions, or accrued severance payable to any
current or former employee, officer, director or individual independent contractor of the Group Companies for the 2019 fiscal year and any prior fiscal
years, including the employer portion of any payroll or other similar Taxes and “tax gross-up” payments, if any, due or payable as a result of or in
connection therewith, (h) all obligations of the Group Companies for the deferred purchase price of property, assets or services or for earn-outs,
purchase price adjustments, holdbacks or other similar obligations (including the amount of future payment obligations), in each case, in an amount
equal to, in the case of any holdback, the actual amount of such holdback and, in all other cases, the amount reflected on the Unaudited Financial
Statements, (i) the net
obligations of the Group Companies under any derivative, hedging, swap and similar instruments or transactions, in each case, calculated at the
termination value thereof as if terminated immediately prior to the Closing, (j) the Aggregate Reserved Amount, (k) to the extent not paid prior to the
Closing, the costs and expenses set forth on Schedule 1.01(e) for the replacement of the containment liner described in such schedule, (l) an amount to
be determined based on the healthcare Liabilities of the Business calculated in accordance with the methodology set forth on Schedule 1.01(f), (m) all
accrued interest, fees and expenses (including prepayment or termination premiums), penalties or similar contractual charges in respect of any of the
items set forth in clauses (a) through (l), and (n) all obligations of the Group Companies with respect to guarantees of another Person in respect of any
obligation of the kind set forth in clauses (a) through (m) incurred by such other Person (including the obligations of the Group Companies with respect
to guarantees of the obligations incurred under the Credit Facility and the Private Placement Notes if, and only to the extent, such guarantees are not
released and terminated at or prior to the Closing). For the avoidance of doubt, any liability of the Group Companies included in the calculation of Net
Working Capital or Transaction Expenses shall not be included in the calculation of Indebtedness for any purpose hereunder.
```

**Section Reference:** Indebtedness definition (Section 1.01; PDF p. 12)

**Issue:** Indebtedness includes underfunded benefit plans, accrued bonuses/severance, a fixed $14m Aggregate Reserved Amount, and schedule-driven items. This can materially reduce purchase price and create overlap with Transaction Expenses and Working Capital.

**Suggested Revision:** Redraft Indebtedness to include only: borrowed money, notes/bonds, drawn LC/surety obligations, finance leases, derivatives termination, accrued interest/fees, and guarantees; move benefit/compensation/reserve items to Working Capital or specific indemnity.

**Rationale:** Aligns with market net-debt and improves transparency; avoids double counting and hidden value transfers.

**Likely Pushback:** Buyer may argue these items are ‘debt-like’ or were priced into headline consideration.

**Fallback Position:** If Buyer insists, (i) cap these non-traditional components, (ii) list them explicitly as separate purchase price line items with fixed amounts, and (iii) confirm they are excluded from Transaction Expenses and Working Capital.

---

### Revision 2: Add explicit priority/routing to prevent double counting of employee-related items

**Current Language:**

```text
“Transaction Expenses” means, without duplication and to the extent not otherwise expressly allocated to the Parties pursuant to the terms and
conditions hereof, the sum of all fees, costs, charges, expenses and other payment obligations incurred by or on behalf of, and payable by, the Group
Companies in connection with or relating to the negotiation, execution, delivery and performance of this Agreement and the other Transaction
Documents and the investigation, pursuit and consummation of the transactions contemplated hereby and thereby, including: (i) brokerage, fees,
commissions, finders’ fees or similar advisory fees; (ii) fees, costs, expenses and disbursements payable to legal counsel and accounting, tax and other
advisors and consultants; (iii) all amounts payable, in whole or in part, solely as a result of the consummation of the transactions contemplated by this
Agreement or any other Transaction Document in respect of any change of control, transaction, incentive, stay, or similar bonus, retention, termination
or severance agreements or arrangements or other compensatory payments to any current or former employee, director, officer, agent or individual
independent consultant of the Group Companies, including the employer portion of any payroll or similar taxes and any “tax gross-up” payments, if any,
payable with respect to any of the foregoing (but excluding, for the avoidance of doubt, any amounts payable based on continued service, solely to the
extent the arrangements relating to such amounts are set forth on Schedule 5.23, or upon any termination of employment, in each case, following the
Closing), (iv) all fees, costs, expenses and other amounts payable in respect of the Pre-Closing Business Transfers and (v) all other fees, expenses and
amounts payable by the Group Companies in connection with any transactions contemplated with other potential acquirors of (or investors in) the Group
Companies or the Business (including in connection with any auction process) or other strategic alternatives pursued by Seller in respect of the Business
or the Group Companies (including any public or private offering of securities). For the avoidance of doubt, any liability of the Group Companies
included in the calculation of Net Working Capital or Indebtedness shall not be included in the calculation of Transaction Expenses for any purpose
hereunder.
```

**Section Reference:** Transaction Expenses (Section 1.01; PDF p. 20) and Indebtedness (Section 1.01; PDF p. 12)

**Issue:** Both Indebtedness and Transaction Expenses capture bonus/severance-style amounts. Without an explicit priority rule, Buyer can argue for inclusion in both (even if ‘without duplication’ is asserted, disputes remain).

**Suggested Revision:** Insert: “All change-of-control, retention, termination and severance amounts (and related payroll taxes) shall be treated exclusively as Transaction Expenses and shall be excluded from Indebtedness and Net Working Capital (or vice-versa, but choose one bucket).”

**Rationale:** Eliminates the largest double-count risk and makes modeling and dispute resolution faster.

**Likely Pushback:** Buyer may prefer flexibility to classify based on accounting treatment.

**Fallback Position:** If flexibility retained, require a mutually agreed closing schedule listing each employee-related item and its designated bucket.

---

### Revision 3: Clarify overdrafts and cash pooling treatment (Cash vs Indebtedness vs Working Capital)

**Current Language:**

```text
“Cash and Cash Equivalents” of any Person as of any date means the cash and cash equivalents and deposits required to be reflected as cash and
cash equivalents and deposits on a consolidated balance sheet of such Person and its Subsidiaries prepared in accordance with the Accounting
Principles; provided, however, that Cash and Cash Equivalents shall (i) include all uncleared checks, drafts and payments received by such Person and
(ii) be calculated net of (A) any restricted cash held as security deposits by third parties, (B) all issued but uncleared checks, drafts and payments issued
by such Person, (C) any insurance cash proceeds and indemnification payments actually received by such Person with respect to any casualty loss or
otherwise in respect of Liabilities to the extent such losses or Liabilities have not been discharged or otherwise paid as of immediately prior to the
Closing, (D) any Cash and Cash Equivalents held for the benefit of third parties, (E) any Cash and Cash Equivalents which are not freely usable by such
Person because they are subject to restrictions or limitations on use or distribution by applicable Law or Contracts (including Cash and Cash Equivalents
held in escrow) and (F) any Cash and Cash Equivalents of such Person held as collateral in support of outstanding letters of credit, bonds or similar
credit support obligations.
```

**Section Reference:** Cash and Cash Equivalents definition (Section 1.01; PDF p. 8)

**Issue:** No explicit overdraft/cash pooling routing. In sweep structures, this can materially change the cash/debt and NWC adjustments.

**Suggested Revision:** Add: “For purposes of the Purchase Price and Adjustment Amount, overdrafts and negative cash balances shall be treated as Indebtedness (and shall not reduce Cash) unless expressly set forth in the Sample Closing Statement.”

**Rationale:** Prevents disputes and ensures consistent application across accounts.

**Likely Pushback:** Buyer may want overdrafts netted against cash to avoid double-count.

**Fallback Position:** Allow netting only within the same cash pool if supported by bank documentation and consistently applied historically.

---

### Revision 4: Fix indemnification cap ambiguity for Buyer liability (and explicitly cap fundamental reps if intended)

**Current Language:**

```text
(iii) in no event shall Seller’s or Buyer’s aggregate Liability exceed $2,312,500.

. (d) Except in the case of Fraud, in no event shall Buyer’s aggregate Liability arising out of or relating to Section 9.02(b)(i) (other than with respect to Buyer Fundamental Representations) exceed $46,250,000.00.
```

**Section Reference:** Section 9.03(a)(iii) and Section 9.03(d) (PDF p. 98)

**Issue:** Section 9.03(a)(iii) appears to cap Seller’s **or Buyer’s** aggregate liability at $2.3125m, while Section 9.03(d) separately caps Buyer’s liability at $46.25m. This is an interpretive/drafting conflict that could create enforcement uncertainty.

**Suggested Revision:** Amend to state unambiguously: (i) Seller cap for general reps = $2.3125m; (ii) Buyer cap for non-fundamental reps = $46.25m (or other agreed); (iii) set separate caps for Seller Fundamental Reps and Buyer Fundamental Reps (often Purchase Price or a negotiated amount).

**Rationale:** Avoids litigation risk over inconsistent caps; supports RWI underwriting and claims handling.

**Likely Pushback:** Buyer may argue the smaller cap should apply and 9.03(d) is a backstop.

**Fallback Position:** If no amendment possible, add a side letter confirming the intended interpretation.

---

### Revision 5: Make delivery/incorporation of Exhibit A (Accounting Principles) and Exhibit C (Sample Closing Statement) mandatory

**Current Language:**

```text
“Accounting Principles” means the accounting principles, practices, policies, judgments and methodologies set forth in Exhibit A to this
Agreement.

“Net Working Capital” means, after giving effect to the Pre-Closing Business Transfers and as calculated in accordance with the Accounting
Principles, and in a manner consistent with the Sample Closing Statement, the Group Companies’ current assets minus current liabilities; provided that
all current and deferred Tax assets and Tax liabilities will be excluded. For the avoidance of doubt, any liability of the Group Companies included in the
calculation of Indebtedness or Transaction Expenses, as well as any amounts with respect to Cash and Cash Equivalents, shall, in each case, not be
included in the calculation of Net Working Capital for any purpose hereunder.
```

**Section Reference:** Accounting Principles definition and Net Working Capital definition (Section 1.01)

**Issue:** Completion accounts cannot be replicated without Exhibit A/C. Missing exhibits increase dispute risk and give Buyer interpretive leverage.

**Suggested Revision:** Add a condition precedent or covenant: “No later than [__] days prior to Closing, the Parties shall attach and initial Exhibit A and Exhibit C in final agreed form, and such exhibits shall control the Closing Statement and Adjustment Amount calculations.”

**Rationale:** Ensures the math is tied down before money changes hands.

**Likely Pushback:** Buyer may claim exhibits already agreed or not necessary.

**Fallback Position:** At minimum, require a mutually signed closing statement template and a list of included/excluded accounts by GL code.

---

### Revision 6: Cap and condition Seller reimbursement of Buyer Ticking Fees

**Current Language:**

```text
Section 5.28 Reimbursement and Negotiation of Buyer Ticking Fees. Seller shall pay or cause to be paid to Buyer (or as directed by Buyer) the
aggregate amount of all Buyer Ticking Fees promptly (but in any event no later than three (3) Business Days) after such Buyer Ticking Fees become due
and payable in immediately available funds by wire transfer to an account or accounts designated by Buyer. In connection with the Buyer’s Financing,
Buyer shall, and shall cause its Subsidiaries (and shall use its commercially reasonable efforts to cause its Representatives) to, use commercially
reasonable efforts to negotiate, acting in good faith, (a) a “grace period” that is reasonable and customary, under the circumstances, after the expiration
of the Marketing Period during which no Buyer Ticking Fees will be incurred pursuant to Buyer’s Financing and (b) Buyer Ticking Fees that are
reasonable and customary under the circumstances.
```

**Section Reference:** Section 5.28 (PDF p. 83)

**Issue:** Ticking fee reimbursement can become an uncapped time-based value transfer if closing is delayed; the clause should tie liability to delays not caused by Buyer and include a clear cap/sunset.

**Suggested Revision:** Add: “Seller’s obligation to reimburse Buyer Ticking Fees shall be capped at $[__] and shall not apply to delays caused by Buyer or its financing sources; Buyer shall mitigate and provide periodic statements.”

**Rationale:** Allocates timing risk more fairly and prevents open-ended carry cost.

**Likely Pushback:** Buyer will argue ticking fees reflect real financing cost from delayed closing outside Buyer control.

**Fallback Position:** Cap the amount but allow extension for regulatory delays beyond both parties’ control; include a shared-cost split after a threshold date.

---


## Part 23: Counsel Questions & Open Issues

### 23.1 Questions Requiring Clarification Before Signing

| # | Question | Relevant Section | Why It Matters | Suggested Resolution |
| --- | --- | --- | --- | --- |
| 1 | Deliver Exhibit A (Accounting Principles) and Exhibit C (Sample Closing Statement) in final executed form. | Section 1.01; Section 2.05; referenced Exhibits A/C | Completion accounts cannot be replicated or audited without these documents. | Make delivery a closing condition or obtain immediately and incorporate into working papers. |
| 2 | Provide Schedule 1.01(e) and any methodology referenced in Indebtedness clauses (k) and (l). | Indebtedness definition (k), (l) | These items can materially reduce purchase price; missing inputs create buyer discretion. | Obtain schedule; quantify amounts; consider moving to explicit price chips or specific indemnities. |
| 3 | Quantify and classify employee-related liabilities: bonuses, severance, retention, payroll taxes. | Indebtedness (g); Transaction Expenses (iii); NWC routing | High double-count risk and material cash impact at Closing. | Create a mutually agreed closing schedule assigning each item to a single bucket. |
| 4 | Clarify overdraft/cash pooling/sweep mechanics and confirm routing across Cash, Indebtedness, and NWC. | Cash definition; Indebtedness; NWC; bank accounts | Can materially swing closing cash/debt and WC adjustments. | Add explicit routing and reconcile via bank statements as of cut-off. |
| 5 | Resolve Buyer liability cap ambiguity ($2.3125m vs $46.25m) and confirm any fundamental rep caps. | Section 9.03(a)(iii), 9.03(d); Section 9.01 | Ambiguity undermines enforceability and affects risk allocation. | Amend SPA or execute a side letter with agreed interpretation. |
| 6 | Confirm the ESOL PR election mechanics and the ESOL PR Purchase Price determination method. | Section 2.03(a); Section 2.04(b) | Can affect headline purchase price and closing cash flows. | Document election timing, valuation, and payment mechanics; add schedule if needed. |
| 7 | Confirm Target Closing Net Working Capital collar intent and how thresholds were derived. | Target Closing NWC definition; Section 2.03(a) | Collar creates a ‘no adjustment’ band; parties may have different expectations. | Model outcomes; confirm thresholds and whether any sharing applies within band. |
| 8 | Confirm R&W insurance economics: premium payer, retention, exclusions, subrogation, and claims process. | Section 5.25; Article IX; insurance policy itself | RWI drives caps and recovery; missing details affect negotiations and claims strategy. | Obtain final policy and underwriting exclusions; align SPA indemnity with policy. |
| 9 | Confirm tax return control for straddle periods and tax contest control (who decides, consent rights, cooperation). | Article VI; Section 6.05 | Tax exposures can be large; NWC excludes taxes, so indemnity/returns must fully cover. | Prepare a tax closing schedule; agree on contest/settlement governance and cooperation timelines. |
| 10 | Confirm Buyer Ticking Fees triggers, calculation, mitigation, and cap/sunset. | Section 5.28; Buyer Ticking Fees definition | Potential open-ended cost to Seller if closing delayed. | Require periodic statements, mitigation, exclusions for Buyer-caused delay, and a cap. |



### 23.2 Diligence Items Triggered by Definitions

| Definition/Provision | Diligence Item Needed | Priority |
| --- | --- | --- |
| Cash and Cash Equivalents | Bank account schedule; identify restricted/pledged/escrowed balances; confirm sweep mechanics and cut-off. | High |
| Indebtedness | Debt schedule incl. derivatives, guarantees, letters of credit; quantify Aggregate Reserved Amount; obtain Schedule 1.01(e) and healthcare methodology; quantify pension/benefit deficits. | High |
| Net Working Capital | Trial balance mapping to current assets/liabilities; confirm treatment of deferred revenue, reserves, prepaids; obtain Exhibit C sample schedule. | High |
| Transaction Expenses | Detailed deal cost tracker (advisor invoices, bonus plans, payroll tax estimates); confirm what is unpaid at Closing; ensure no overlap with debt. | High |
| Taxes | List tax returns, tax sharing agreements, consolidated group relationships, outstanding audits; build straddle allocation workpapers; confirm refund expectations. | Medium |
| Buyer Ticking Fees | Financing documents showing ticking fee accrual; calculation model; timeline triggers. | Medium |



## Part 24: Executive Summary

### 24.1 Deal Overview (2–3 sentences)

Buyer (CEI Holding, LLC; an affiliate of Harsco Corporation) purchases 100% of Stericycle Environmental Solutions, Inc. from Seller (Stericycle, Inc.) for an all-cash Purchase Price starting at **$462,500,000**, subject to completion accounts adjustments for Cash, Indebtedness, Net Working Capital (with a collar), and Transaction Expenses.

Seller delivers an Estimated Closing Statement shortly before Closing, Buyer prepares the post-close Closing Statement within 60 days, and any disputes are resolved through a negotiation period followed by a decision from an independent accounting firm (the “Auditor”), with the resulting Adjustment Amount paid within five Business Days.

### 24.2 Overall Assessment

| Dimension | Rating | Key Drivers |
| --- | --- | --- |
| Definitions clarity | 🔴 | Indebtedness and Transaction Expenses are broad and include bespoke/schedule-driven items; Exhibit A/C not provided in this PDF. |
| Anti-duplication robustness | 🟠 | Good routing in NWC; ‘without duplication’ appears in some definitions, but major overlap risks remain (compensation items; environmental reserves). |
| Price mechanics clarity | 🟠 | Formula is clear, but relies on missing Accounting Principles/Sample Closing Statement and includes a collar and PR election mechanics. |
| True-up process fairness | 🟠 | Timelines and IA mechanism are market; Buyer prepares Closing Statement (buyer-leaning) but Seller has 60-day dispute period (seller-leaning). |
| Escrow terms | 🟢 | No escrow is consistent with an RWI-backed deal; recovery is via caps/survival and insurance rather than holdback. |
| Overall balance (Buyer ↔ Seller) | 🟠 Buyer-favorable | Broad Indebtedness and Cash exclusions plus buyer-prepared Closing Statement skew economics; low general rep cap and no escrow mitigate for Seller. |



### 24.3 Top 5 Issues to Raise with Partner/Client

1. Indebtedness definition is materially off-market and embeds fixed/schedule-driven deductions (Aggregate Reserved Amount; Schedule 1.01(e); healthcare methodology). Recommend quantifying and renegotiating scope or making these explicit price chips.
2. Missing Exhibits/Schedules (Accounting Principles and Sample Closing Statement) prevent validation of completion accounts. Obtain immediately and treat as gating item for any financial model or negotiation stance.
3. Employee-related liabilities (bonuses/severance/payroll taxes) appear in both Indebtedness and Transaction Expenses, creating high double-count risk. Insert explicit priority and a closing schedule.
4. Indemnification cap drafting ambiguity (Buyer cap references) and lack of explicit fundamental caps. Fix via amendment/side letter before relying on the risk allocation.
5. Cash definition excludes ‘not freely usable’ and pledged cash without a schedule; plus no overdraft/cash pooling routing. Quantify and clarify with schedules and explicit rules.

### 24.4 30-Second Deal Summary

```text
Headline is **$462,500,000** on a cash-free/debt-free completion accounts basis (with a working-capital collar and transaction expense deduction).

Key definitions: **Indebtedness is very broad and buyer-favorable** — it includes non-traditional items like benefit plan deficits, accrued bonuses/severance, a fixed $14m Aggregate Reserved Amount, and schedule/methodology-driven deductions. **Cash** excludes restricted/trapped and pledged collateral cash; overdraft/cash pooling routing is not explicit. **Net Working Capital** is operating WC (taxes excluded) with a **collar**: $64,500,000–$69,500,000; within the band, the adjustment is effectively zero.

True-up: Seller delivers an estimated closing statement 3–10 Business Days pre-close; Buyer delivers the post-close Closing Statement within 60 days; Seller has 60 days to dispute; negotiation is 45 days; auditor decides within 45 days; payment within 5 Business Days.

Escrows: none (RWI-backed structure). Key risks: missing Exhibit A/C and schedules; broad debt definition and double-count risk on employee items; cap ambiguity in indemnity provisions.

Overall: **Buyer-favorable** — mainly driven by broad deduction definitions and buyer-prepared completion accounts, partially offset by low seller rep cap and no escrow.
```


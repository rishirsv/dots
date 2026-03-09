## Part 1: Document Overview

### 1.1 Metadata

| Field                        | Value                                                                                                                                                                                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Deal Name / Project Code     | NOT STATED (publicly filed as “TreeHouse Stock Purchase Agreement”; business described as TreeHouse’s “meal preparation business”).                                                                                                                      |
| Execution Date               | August 10, 2022 (preamble; PDF p. 10)                                                                                                                                                                                                                    |
| Parties (Buyer / Seller)     | **Seller:** TreeHouse Foods, Inc. (“TreeHouse”) and other “Sellers” listed on Exhibit A (PDF p. 124). **Buyer:** Rushmore Investment III LLC (“US Buyer”) and 1373978 B.C. ULC (“CA Buyer”) (preamble; PDF p. 10).                                       |
| Target Company / Business    | Stock sale of **US Company** (Meal Preparation, Inc.) and **CA Company** (TBMP Canada Cashco ULC), plus “Transferred Subsidiaries,” representing the “meal preparation business” (recitals; PDF pp. 10–11).                                              |
| Jurisdiction / Governing Law | Delaware (Section 10.8; PDF p. 116).                                                                                                                                                                                                                     |
| Deal Type                    | Financial sponsor / PE-style acquisition vehicle (buyer is an acquisition entity; R&W insurance used; seller is strategic/public). **Classification: PE / Financial buyer** (best-fit based on agreement features; buyer sponsor not named in SPA text). |
| Pricing Structure            | **Completion Accounts / True-Up** (Section 2.3; PDF pp. 40–43).                                                                                                                                                                                          |
| Consideration Type           | **Cash + Seller Note / Seller Credit Agreement financing** (Closing Date Cash Consideration + Seller Note mechanics; Section 2.2 & Section 2.3(g)(iii); PDF pp. 39–43; Seller Credit Agreement / Seller Note definitions; PDF p. 29).                    |
| R&W Insurance                | **Yes** (Section 4.9; Section 5.12; definition of “R&W Insurance Policy”; PDF pp. 73, 87, 28).                                                                                                                                                           |
| Estimated Deal Value         | **Enterprise Value = $950,000,000** (definition; PDF p. 19). **Estimated Purchase Price capped at $1,010,000,000** (definition; PDF p. 19).                                                                                                              |

---

### 1.2 Document Structure

High-level structure (start page = first substantive appearance in PDF, not table of contents):

- **Definitions**
  - Article I; Section 1.1 Definitions (PDF p. 12)
  - Section 1.2 Table of Definitions (PDF p. 33)

- **Purchase Price / Consideration**
  - Definition of “Purchase Price” (PDF p. 27)
  - Definition of “Estimated Purchase Price” + cap (PDF p. 19)
  - Closing consideration delivery mechanics: Section 2.2 (PDF pp. 39–40)

- **Closing Mechanics**
  - Section 2.2 Closing (PDF pp. 39–40)
  - Conditions: Article VII (PDF pp. 102–105)

- **Closing Statements / True-Up**
  - Section 2.3 Purchase Price Adjustments (Preliminary Closing Statement + Final Closing Statement + dispute/IA + payment; PDF pp. 40–43)

- **Escrows / Holdbacks**
  - **NO ESCROW PROVISIONS FOUND** in SPA text (no “Escrow,” “Escrow Agent,” or escrow mechanics).
  - **Functional holdback/deferred component:** Seller Note principal amount can be reduced to satisfy negative true-up (Section 2.3(g)(iii); PDF p. 43).

- **Earnout**
  - **NO EARNOUT PROVISION** (no earnout section; “earn-out” appears only as an example inside “Indebtedness” definition).

- **Indemnification / Remedies**
  - Article VIII Remedies (non-survival; indemnity for Excluded/Assumed Liabilities; limitations; PDF pp. 106–111)
  - Tax indemnity (Section 6.7; PDF p. 101)

- **Relevant Schedules / Exhibits**
  - **Exhibit A (Sellers & share counts)** is included (PDF p. 124).
  - Exhibits B–I are referenced in the table of contents but **not included in the provided PDF** (NOT FOUND in-file):
    - Exhibit D Form of Seller Credit Agreement (referenced; not provided)
    - Exhibit E Net Working Capital (referenced; not provided)
    - Others (TSA, trademark license, etc.) referenced; not provided

  - **Disclosure Schedules** referenced throughout (not provided).

---

## Part 2: Financial Definitions (Deep Extraction)

Below, each definition is extracted **verbatim** from the SPA text in the provided PDF, with section/page references.

---

### 2.1 Definition 1 — Purchase Price / Consideration

**Definition Name:** “Purchase Price”
**Section Reference:** Section 1.1 (Definitions), PDF p. 27

**Full Verbatim Text:**

```text
“Purchase Price” means an amount equal to (a) the Enterprise Value, plus (b) the Closing Cash, plus (c) the Working Capital Overage (if any), minus (d) the Closing Indebtedness, minus (e) the Working Capital Underage (if any), minus (f) the Closing Transaction Expenses, as each is calculated in accordance with Section 2.3.
```

**Plain-English Summary:**
This defines the final equity consideration as an enterprise value deal with completion adjustments for actual cash, debt, net working capital vs target, and transaction expenses. It’s designed to deliver a “cash-free, debt-free, normalized working capital” outcome, with transaction costs borne economically by sellers via a price reduction.

**Component Breakdown:**

| Component                   | Included? | Verbatim Language                                                | Market Position          | Notes                                                                                                                                                                             |
| --------------------------- | --------: | ---------------------------------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enterprise value base       |       Yes | “the Enterprise Value”                                           | 🟢 Market Standard       | Standard EV-to-equity bridge.                                                                                                                                                     |
| Cash adjustment             |       Yes | “plus… the Closing Cash”                                         | 🟢 Market Standard       | Cash increases equity value.                                                                                                                                                      |
| Indebtedness adjustment     |       Yes | “minus… the Closing Indebtedness”                                | 🟢 Market Standard       | Debt reduces equity value.                                                                                                                                                        |
| NWC adjustment vs target    |       Yes | “plus… Working Capital Overage… minus… Working Capital Underage” | 🟠 Off-Market (see note) | Mechanically standard, but **the defined “Working Capital Overage/Underage” ties to “Estimated Net Working Capital” (PDF p. 33), creating a drafting mismatch risk** for true-up. |
| Transaction expenses        |       Yes | “minus… the Closing Transaction Expenses”                        | 🟢 Market Standard       | Seller-borne deal costs via price reduction is standard.                                                                                                                          |
| Anti-duplication in formula |  Indirect | “as each is calculated in accordance with Section 2.3”           | 🟠 Slightly Off-Market   | Anti-duplication is mostly definition-level, not formula-level; relies on cross-exclusions in definitions.                                                                        |

**Anti-Duplication Language:**

| Phrase                          | Present? | Exact Quote | Scope |
| ------------------------------- | -------: | ----------- | ----- |
| “without duplication”           |       No | —           | —     |
| “to the extent not included in” |       No | —           | —     |
| “for the avoidance of doubt”    |       No | —           | —     |

**Red Flag Language Identified:**

| Phrase                                                                                               | Why It’s Concerning                                                                                                                                                                                                                                                                    | Severity |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| “Working Capital Overage… Working Capital Underage…” (as defined using **Estimated** NWC; PDF p. 33) | Purchase Price is meant to be based on **Closing** NWC, but the Overage/Underage definitions reference **Estimated Net Working Capital**. This can create ambiguity on whether there is a true working capital true-up at all, or a drafting “bug” that becomes leverage in a dispute. | High     |

**Overall Market Position Assessment:** 🟠 Slightly Off-Market (Seller)
**Reasoning:** The EV + cash – debt ± NWC – expenses construct is market standard, but the working capital adjustment terminology appears internally inconsistent (Estimated vs Closing). That inconsistency tends to benefit whoever controls drafting/interpretation at dispute time (often buyer in statement prep), but in negotiation it is a **seller-protective ambiguity** because it can be used to resist downward adjustments.

**Counsel Questions to Raise:**

1. Does “Working Capital Overage/Underage” in the **Purchase Price** definition intend to be calculated using **Closing Net Working Capital** (not Estimated)? If yes, revise definitions to eliminate ambiguity.
2. Confirm whether “Closing Transaction Expenses” includes only those unpaid at Calculation Time, and whether any are also embedded in NWC accounts (to avoid double counting).

**Suggested Revisions (if Off-Market):**
Original: “plus… the Working Capital Overage… minus… the Working Capital Underage…”
Suggested: “plus (if positive) the amount by which **Closing Net Working Capital** exceeds **Target Net Working Capital**, minus (if positive) the amount by which **Target Net Working Capital** exceeds **Closing Net Working Capital**…”
Rationale: Eliminates definitional mismatch and aligns with intended completion accounts construct.

---

### 2.2 Definition 2 — Cash / Cash and Cash Equivalents

**Definition Name:** “Cash”
**Section Reference:** Section 1.1 (Definitions), PDF p. 15

**Full Verbatim Text:**

```text
“Cash” means, as of the relevant time of determination, without duplication, the cash and cash equivalents (including marketable securities and short-term investments) of the Group Companies (excluding Restricted Cash), calculated in accordance with the Applicable Accounting Principles, provided, further, that Cash shall be reduced by the amount of any checks written on or prior to the relevant time of determination that have not been cleared by the relevant time of determination and any drafts issued on behalf of the Group Companies on or prior to such time of determination but not yet cashed by the relevant time of determination, provided, further, that Cash shall be reduced by any payments made by the Group Companies after the relevant time of determination and prior to the Closing (A) to the extent such payments reduce Indebtedness or Transaction Expenses or (B) for distributions or dividends to TreeHouse, its Affiliates or stockholders (other than the Group Companies), and, provided, further, that Cash shall be increased by the amount of any checks received by the Group Companies that have not been cleared by the relevant time of determination and any deposits in transit. For the avoidance of doubt, Cash shall not include any negative cash overdrafts or negative cash balances.
```

**Plain-English Summary:**
“Cash” is a netted, completion-style cash definition that tries to reflect “true” cash as of the measurement time, adjusting for outstanding checks/drafts and deposits in transit. It also prevents manipulation between the measurement time and closing by reducing Cash for payments made to settle debt, pay transaction expenses, or upstream value to the seller.

**Component Breakdown (Cash checklist):**

| Component                                         |          Included? | Verbatim Language                                                                                                | Market Position | Notes                                                                                                    |
| ------------------------------------------------- | -----------------: | ---------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------- |
| Cash on hand / bank cash                          |                Yes | “cash… of the Group Companies”                                                                                   | 🟢              | Standard.                                                                                                |
| Demand deposits                                   |                Yes | “cash… of the Group Companies”                                                                                   | 🟢              | Standard (implicit).                                                                                     |
| Cash equivalents                                  |                Yes | “cash equivalents (including marketable securities and short-term investments)”                                  | 🟢              | Standard.                                                                                                |
| Restricted cash                                   |                 No | “excluding Restricted Cash”                                                                                      | 🟢/🟠           | Often excluded; depends if restricted is business-operating. Here it is excluded and separately defined. |
| Trapped cash / repatriation tax haircut           |           Indirect | see “Restricted Cash” & “Foreign Cash Amount” definitions                                                        | 🟠              | Foreign cash is separately adjusted for repatriation taxes (PDF p. 19).                                  |
| Deposits in transit                               |                Yes | “increased by… deposits in transit”                                                                              | 🟢              | Standard seller-favorable inclusion.                                                                     |
| Outstanding checks                                |  No (reduces Cash) | “reduced by… checks written… not… cleared… [and] drafts…”                                                        | 🟢              | Standard buyer protection to avoid overstating cash.                                                     |
| Overdraft netting                                 |                 No | “shall not include any negative cash overdrafts or negative cash balances”                                       | 🟢              | Routes overdrafts to Indebtedness (see Indebtedness includes overdrafts/negative balances).              |
| Post-measurement payments to reduce debt/expenses | Yes (reduces Cash) | “Cash shall be reduced by any payments… to the extent such payments reduce Indebtedness or Transaction Expenses” | 🟢              | Helps avoid double-counting (paying down debt shouldn’t also leave cash in calculation).                 |
| Dividends/distributions pre-close                 | Yes (reduces Cash) | “or (B) for distributions or dividends…”                                                                         | 🟢              | Anti-leakage mechanism in completion accounts context.                                                   |

**Anti-Duplication Language:**

| Phrase                          |             Present? | Exact Quote                                                        | Scope                          |
| ------------------------------- | -------------------: | ------------------------------------------------------------------ | ------------------------------ |
| “without duplication”           |                  Yes | “without duplication”                                              | Definition-level               |
| “to the extent not included in” | No (similar concept) | —                                                                  | —                              |
| “for the avoidance of doubt”    |                  Yes | “For the avoidance of doubt, Cash shall not include any negative…” | Definition-level clarification |

**Red Flag Language Identified:**

| Phrase                                                                                             | Why It’s Concerning                                                                                                                                                                           | Severity |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| “calculated in accordance with the Applicable Accounting Principles” (but principles not provided) | Without the Disclosure Schedule 2.3(a) “Applicable Accounting Principles,” parties may disagree on classification of “marketable securities,” short-term investments, or bank sweep accounts. | Medium   |

**Overall Market Position Assessment:** 🟢 Market Standard
**Reasoning:** This is a very typical completion accounts cash definition with standard check/deposit mechanics and overdraft routing.

**Counsel Questions to Raise:**

1. Confirm how cash pooling / sweep arrangements are treated under the Applicable Accounting Principles (especially if balances net across entities).
2. Confirm whether any “marketable securities” are illiquid or subject to restrictions that should make them “Restricted Cash” instead.

**Suggested Revisions (if Off-Market):** NOT REQUIRED (generally market).

---

### 2.3 Definition 3 — Indebtedness / Debt

**Definition Name:** “Indebtedness”
**Section Reference:** Section 1.1 (Definitions), PDF pp. 21–23

**Full Verbatim Text:**

```text
“Indebtedness” means, without duplication, as of the relevant time of determination, the outstanding amount of all Liabilities of the Group Companies consisting of: (i) borrowed money (including principal, interest, fees and any other amounts payable thereon, and, in the case of any factoring arrangements, the amount so factored and any interest and other amounts payable thereon); (ii) Liabilities evidenced by any note, bond, debenture or other debt security; (iii) capitalized lease obligations and other obligations under or in respect of leases required to be capitalized on the balance sheet of the Group Companies in accordance with GAAP (“Capital Lease Obligations”) (provided that for purposes of clause (iii), Liabilities shall not include operating lease obligations, including those required to be capitalized in accordance with Accounting Standards Codification 842 or any successor thereof or the corresponding International Financial Reporting Standards codification); (iv) Liabilities for deferred purchase price or other similar Liabilities incurred in connection with the acquisition by any Group Company of any property, assets or businesses, including any seller notes, holdback, earn-out, performance bonus or similar payments, in each case, other than trade payables or accrued expenses incurred in the Ordinary Course of Business; (v) declared but unpaid dividends or other distributions (other than dividends and distributions payable to the Group Companies); (vi) the face amount of all outstanding letters of credit drawn or amounts drawn under any credit support, performance guarantee or similar instrument; (vii) (A) any accrued and unpaid bonus, commission, severance, termination, retention, change in control or similar payment, or any nonqualified deferred compensation, in each case, payable by the Group Companies that is accrued as of the relevant time of determination in respect of any current or former Business Employee (excluding any Retention Awards), (B) any amounts payable pursuant to the Assumed Retention Amounts or Retention Awards, in each case, to the extent such amounts are payable to TreeHouse or any of its Affiliates (excluding any Group Companies) and (C) to the extent any such amounts are payable by the Group Companies, any employer portion of payroll, social security, unemployment, employment or similar Taxes that are imposed in connection with the payment of the amounts described in clauses (A) and (B) above; (viii) (A) all accrued Income Taxes and (B) all deferred Taxes (as determined in accordance with GAAP) (including, in the case of each of clauses (A) and (B), any amounts accrued in respect of Taxes pursuant to Section 2302 of the CARES Act); (ix) cash overdrafts and negative cash balances; (x) the positive or negative value of any interest rate, currency swap, hedging or other similar arrangement of the Group Companies (with the positive value resulting in a reduction in Indebtedness); and (xi) all Liabilities of the type referred to in clauses (i) through (x) above of other Persons for which a Group Company is responsible or liable as obligor or guarantor.

Notwithstanding the foregoing, “Indebtedness” shall not include (A) Liabilities for operating leases, including those required to be capitalized in accordance with Accounting Standards Codification 842 or any successor thereof or the corresponding International Financial Reporting Standards codification, in each case, other than operating leases that were entered into after the Interim Financial Statements Date, (B) any intercompany obligations solely between the Group Companies, (C) trade payables and accrued expenses incurred in the Ordinary Course of Business, (D) any Liability or obligation to the extent that such liability or obligation has been taken into account in the calculation of Net Working Capital or Transaction Expenses, or (E) any guarantee for the benefit of TreeHouse or any of its Affiliates (other than the Group Companies) that will be released (and related Liabilities that will be extinguished) promptly (but in any event within thirty (30) days) after the Closing.
```

**Plain-English Summary:**
This is a broad “debt-like items” definition that includes not only funded debt and capital leases, but also certain employee-related transaction obligations and accrued/deferred income taxes, plus hedging values and overdrafts. It’s designed to ensure the buyer receives a debt-free outcome by reducing purchase price for any liabilities that behave like financing or are transaction-triggered.

**Component Breakdown (Indebtedness checklist):**

| Component                                               |     Included? | Verbatim Language                                                                   | Market Position       | Notes                                                                                                          |
| ------------------------------------------------------- | ------------: | ----------------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------- |
| Borrowed money                                          |           Yes | “borrowed money (including principal, interest, fees…)”                             | 🟢                    | Standard.                                                                                                      |
| Accrued interest/fees                                   |           Yes | “including… interest, fees and any other amounts”                                   | 🟢                    | Standard.                                                                                                      |
| Breakage / make-whole / prepayment                      | Not expressly | NOT EXPRESSLY STATED                                                                | 🟠                    | Often explicitly included; may be embedded in “fees and any other amounts.” Clarify.                           |
| Capital/finance leases                                  |           Yes | “Capital Lease Obligations”                                                         | 🟢                    | Standard to include finance leases.                                                                            |
| Operating leases                                        |            No | “shall not include… operating leases… ASC 842…”                                     | 🟢                    | Common to exclude operating lease liabilities from debt.                                                       |
| Bank overdrafts / negative balances                     |           Yes | “cash overdrafts and negative cash balances”                                        | 🟢                    | Clear routing: overdrafts are debt, not cash.                                                                  |
| Cash pooling / netting                                  | Not addressed | NOT FOUND                                                                           | 🟠                    | If cash pooling exists, classification can be contentious.                                                     |
| Guarantees                                              |           Yes | “liable as obligor or guarantor”                                                    | 🟢                    | Standard.                                                                                                      |
| Letters of credit                                       |   Yes (drawn) | “letters of credit drawn or amounts drawn…”                                         | 🟢                    | Standard (note: only drawn amounts).                                                                           |
| Factoring / receivables financing                       |           Yes | “in the case of any factoring arrangements, the amount so factored…”                | 🟠                    | Explicit inclusion is buyer-protective; ties to Section 5.24 (factoring covenant).                             |
| Intercompany debt (between Group Cos)                   |            No | “shall not include… intercompany obligations solely between the Group Companies”    | 🟢                    | Standard to exclude internal balances.                                                                         |
| Intercompany with Seller/Affiliates                     |     Partially | clause (vii)(B) includes some amounts payable to TreeHouse/Affiliates               | 🟠                    | Need diligence on affiliate balances—could be swept into debt.                                                 |
| Hedging termination / mark-to-market                    |           Yes | “positive or negative value of… hedging…”                                           | 🟠                    | Mark-to-market inclusion is buyer-favorable; also unusual to explicitly allow positive value to reduce debt.   |
| Deferred purchase price / seller notes from prior deals |           Yes | “deferred purchase price… seller notes, holdback, earn-out…”                        | 🟢                    | Standard.                                                                                                      |
| Pension deficits                                        | Not addressed | NOT FOUND                                                                           | 🟠                    | If relevant, may “fall through” unless included elsewhere.                                                     |
| Declared dividends                                      |           Yes | “declared but unpaid dividends…”                                                    | 🟢                    | Standard.                                                                                                      |
| Accrued bonus/severance/change of control               |           Yes | clause (vii)(A)                                                                     | 🟠 Off-Market (Buyer) | Sometimes these sit in Transaction Expenses; including here can be aggressive and increases double-count risk. |
| Retention awards                                        |         Mixed | excluded in (vii)(A), but included in (vii)(B) if payable to TreeHouse/Affiliates   | 🟠                    | Complex; requires careful mapping to “Assumed Retention Amounts” and which party bears cost.                   |
| Income taxes accrued/deferred                           |           Yes | clause (viii)                                                                       | 🟠 Off-Market (Buyer) | Many deals exclude income taxes from debt and handle via NWC/tax indemnity; here they’re expressly debt-like.  |
| Anti-duplication carve-out                              |           Yes | “to the extent… taken into account in… Net Working Capital or Transaction Expenses” | 🟢                    | Helpful, but still needs a clear routing convention in sample statement / accounting principles.               |

**Anti-Duplication Language:**

| Phrase                          |           Present? | Exact Quote                                                                                       | Scope                          |
| ------------------------------- | -----------------: | ------------------------------------------------------------------------------------------------- | ------------------------------ |
| “without duplication”           |                Yes | “without duplication”                                                                             | Definition-level               |
| “to the extent not included in” | Yes (conceptually) | “to the extent that… has been taken into account in… Net Working Capital or Transaction Expenses” | Definition-level (exclusion D) |
| “for the avoidance of doubt”    |                 No | —                                                                                                 | —                              |

**Red Flag Language Identified:**

| Phrase                                                              | Why It’s Concerning                                                                                                                                                         | Severity    |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Inclusion of employee transaction-related obligations in debt (vii) | These same items frequently show up in Transaction Expenses or WC accruals; even with the exclusion (D), classification disputes are common and can swing price materially. | Medium–High |
| Inclusion of accrued/deferred Income Taxes (viii)                   | Creates overlap with NWC and the Tax Indemnity regime (Section 6.7). Can also drive “double counting” if income tax payable is reflected in WC.                             | High        |

**Overall Market Position Assessment:** 🟠 Slightly Off-Market (Buyer)
**Reasoning:** The funded-debt core is standard, but pulling in accrued/deferred income taxes and employee change-of-control type obligations is broader than many market definitions and tends to reduce purchase price (buyer-favorable).

**Counsel Questions to Raise:**

1. Confirm whether “fees and any other amounts payable” is intended to include **prepayment premiums / make-whole** if debt is refinanced/terminated at closing.
2. Provide a crosswalk showing each clause (vii) employee item is captured **once and only once** (Debt vs Transaction Expenses vs NWC).

**Suggested Revisions (if Off-Market):**
Original: clause (viii) “all accrued Income Taxes… all deferred Taxes…”
Suggested: move income tax payables to NWC (or tax indemnity) unless specifically agreed; or clarify that income tax amounts included in NWC are excluded from Indebtedness by an explicit sentence.
Rationale: Reduces overlap and lowers dispute likelihood.

---

### 2.4 Definition 4 — Net Debt

**Definition Name:** NOT FOUND
**Where it would typically appear:** Article I, Section 1.1 Definitions, usually as “Net Debt” = Indebtedness – Cash (sometimes with specified adjustments).
**Notes:** This SPA uses a direct EV-to-equity bridge (EV + Cash – Indebtedness ± NWC – expenses), so a separate “Net Debt” definition is not necessary and was not found.

---

### 2.5 Definition 5 — Working Capital / Net Working Capital

**Definition Name:** “Net Working Capital”
**Section Reference:** Section 1.1 (Definitions), PDF p. 26

**Full Verbatim Text:**

```text
“Net Working Capital” means the amount, which may be positive or negative, equal to (a) the current assets of the Group Companies minus (b) the current liabilities of the Group Companies, in each case, excluding Cash, Indebtedness and Transaction Expenses and calculated in accordance with the Applicable Accounting Principles; provided that the line items set forth on Exhibit E are intended to reflect the current assets and current liabilities to be taken into account in determining Net Working Capital; provided, further, that the amounts in Exhibit E are illustrative only and do not represent binding principles for determining Net Working Capital; and provided, further, that to the extent that the balances set forth in Exhibit E are not consistent with the Applicable Accounting Principles, the definition of the Applicable Accounting Principles will prevail.
```

**Plain-English Summary:**
Net Working Capital is defined as current assets minus current liabilities of the Group Companies, but explicitly excludes Cash, Indebtedness, and Transaction Expenses. Exhibit E is intended to show the line items to use, but critically the exhibit is stated to be illustrative only; the controlling rules are the Applicable Accounting Principles (which are in a disclosure schedule not included here).

**Component Breakdown (Working Capital checklist):**

| Component                                |                   Included? | Verbatim Language                                                        | Market Position                     | Notes                                                                                                   |
| ---------------------------------------- | --------------------------: | ------------------------------------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Current assets minus current liabilities |                         Yes | “current assets… minus… current liabilities”                             | 🟢                                  | Standard structure.                                                                                     |
| Trade A/R                                | Unknown (depends Exhibit E) | “line items set forth on Exhibit E…”                                     | 🔴                                  | Exhibit E not provided; also “illustrative only” creates ambiguity.                                     |
| Inventory                                |                     Unknown | same                                                                     | 🔴                                  | Same issue.                                                                                             |
| Prepaids                                 |                     Unknown | same                                                                     | 🔴                                  | Same issue.                                                                                             |
| Trade A/P                                |                     Unknown | same                                                                     | 🔴                                  | Same issue.                                                                                             |
| Accrued expenses                         |                     Unknown | same                                                                     | 🔴                                  | Same issue.                                                                                             |
| Deferred revenue / customer deposits     |                     Unknown | same                                                                     | 🔴                                  | Same issue.                                                                                             |
| Cash inclusion/exclusion                 |                    Excluded | “excluding Cash”                                                         | 🟢                                  | Standard to keep cash separate.                                                                         |
| Debt inclusion/exclusion                 |                    Excluded | “excluding… Indebtedness”                                                | 🟢                                  | Standard.                                                                                               |
| Transaction expenses inclusion/exclusion |                    Excluded | “excluding… Transaction Expenses”                                        | 🟢                                  | Standard to avoid double counting (deal accruals often sit in accrued liabilities).                     |
| Income taxes in WC                       |  Not excluded by definition | Not excluded (unless classified as Indebtedness under (viii))            | 🟠                                  | Potential overlap because Indebtedness includes accrued income taxes; classification matters.           |
| Intercompany                             |                  Not stated | NOT FOUND                                                                | 🟠                                  | Needs to be confirmed in Applicable Accounting Principles and/or Exhibit E.                             |
| Binding schedule                         |                          No | “amounts… are illustrative only and do not represent binding principles” | 🔴 Significantly Off-Market (Buyer) | In many deals Exhibit E (or similar) is binding and dispute-reducing. Here it’s explicitly non-binding. |

**Anti-Duplication Language:**

| Phrase                          |        Present? | Exact Quote                                                                                          | Scope                 |
| ------------------------------- | --------------: | ---------------------------------------------------------------------------------------------------- | --------------------- |
| “without duplication”           |              No | —                                                                                                    | —                     |
| “to the extent not included in” | Yes (hierarchy) | “to the extent that the balances… are not consistent… Applicable Accounting Principles will prevail” | Methodology hierarchy |
| “for the avoidance of doubt”    |              No | —                                                                                                    | —                     |

**Red Flag Language Identified:**

| Phrase                                                                               | Why It’s Concerning                                                                                                                                                                                                                                    | Severity |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| “amounts in Exhibit E are illustrative only and do not represent binding principles” | This materially increases risk of disputes and allows reclassification arguments post-close. Because Buyer prepares the Final Closing Statement, ambiguity can be buyer-leveraged unless Exhibit E / accounting principles are extremely prescriptive. | High     |
| “Applicable Accounting Principles” not included in PDF                               | The controlling rule set is missing from the provided document, so we cannot validate whether it is GAAP, consistent with past practice, includes special reserves, etc.                                                                               | High     |

**Overall Market Position Assessment:** 🔴 Significantly Off-Market (Buyer)
**Reasoning:** The explicit statement that Exhibit E is “illustrative only” (not binding) is unusual and shifts interpretation risk to the seller, especially where the Buyer controls statement preparation. Unless the missing Disclosure Schedule 2.3(a) is extremely detailed, this is a major ambiguity.

**Counsel Questions to Raise:**

1. Provide Exhibit E and Disclosure Schedule 2.3(a) and confirm they are final, complete, and internally consistent.
2. Confirm whether income tax receivables/payables are intended to be treated as Indebtedness (per clause (viii)) or within working capital.

**Suggested Revisions (if Off-Market):**
Original: “the amounts in Exhibit E are illustrative only and do not represent binding principles…”
Suggested: “Exhibit E sets forth the binding line items and methodologies for determining Net Working Capital, and the parties agree it shall control except to the extent expressly inconsistent with the Applicable Accounting Principles, in which case the specific line-item guidance in Exhibit E shall prevail.”
Rationale: Makes the schedule enforceable and reduces dispute surface area.

---

### 2.6 Definition 6 — Transaction Expenses / Seller Expenses

**Definition Name:** “Transaction Expenses”
**Section Reference:** Section 1.1 (Definitions), PDF p. 31

**Full Verbatim Text:**

```text
“Transaction Expenses” means, without duplication, and as of the relevant time of determination, the aggregate amount of any fees, costs and expenses incurred by the Group Companies in connection with the negotiation, execution and performance of this Agreement, the Ancillary Agreements and the Transactions (including (i) any fees, costs, expenses and other amounts payable to third parties by the Group Companies (including any brokers, financial advisors, consultants, accountants, counsel, notaries and other Persons providing services to the Group Companies) and (ii) any transaction bonus payments or retention, change in control or similar payments (excluding any Assumed Retention Amounts or Retention Awards) payable by the Group Companies to any current or former employee, independent contractor or director or other service provider or any other Person, including any such payments that are (A) Transaction Tax Deductions or (B) otherwise payable in connection with the Transactions), together with the employer portion of any payroll, social security, unemployment, employment or similar Taxes imposed in connection with any transaction bonus payments or retention, change in control or similar payments, and (iii) any professional fees, costs and expenses owed by any of the Group Companies solely in connection with the Reorganization and the Pickles Transfer); provided that “Transaction Expenses” shall not include (x) any amounts that have been paid by TreeHouse or any of its Affiliates (other than the Group Companies) on behalf of the Group Companies prior to the relevant time of determination, or (y) any transaction bonus payment or retention, change in control or similar payment (including any employer portion of payroll, social security, unemployment, employment or similar Taxes imposed in connection with such payment) to the extent such payment is triggered by any action of Buyer or any of its Affiliates after Closing.
```

**Plain-English Summary:**
Transaction Expenses captures deal-related third-party fees and certain employee bonuses/retention/change-of-control payments, plus employer payroll taxes on those payments, as long as they are incurred by the Group Companies in connection with the transaction (and not triggered by buyer actions after closing). The economic effect is to reduce the purchase price for seller-side deal costs.

**Component Breakdown (Transaction Expenses checklist):**

| Component                              |                 Included? | Verbatim Language                                                       | Market Position       | Notes                                                                                                      |
| -------------------------------------- | ------------------------: | ----------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------- |
| Banking / financial advisor fees       |                       Yes | “brokers, financial advisors…”                                          | 🟢                    | Standard.                                                                                                  |
| Legal fees                             |                       Yes | “counsel… notaries”                                                     | 🟢                    | Standard.                                                                                                  |
| Accounting fees                        |                       Yes | “accountants”                                                           | 🟢                    | Standard.                                                                                                  |
| Consulting fees                        |                       Yes | “consultants”                                                           | 🟢                    | Standard.                                                                                                  |
| Change-of-control bonuses              |                       Yes | “transaction bonus… retention, change in control…”                      | 🟠 Off-Market (Buyer) | Often included, but can be heavily negotiated; overlaps with debt definition clause (vii).                 |
| Severance                              |             Not expressly | NOT EXPRESSLY STATED                                                    | 🟠                    | Could be in “similar payments,” but not explicit; clarify.                                                 |
| Retention bonuses                      |                       Yes | “retention… similar payments”                                           | 🟠                    | Seller may seek to carve out ordinary course retention.                                                    |
| Employer payroll taxes on bonuses      |                       Yes | “together with the employer portion…”                                   | 🟢                    | Standard.                                                                                                  |
| D&O tail                               |             Not mentioned | NOT FOUND                                                               | 🟠                    | If intended, should be explicit.                                                                           |
| R&W insurance premium                  | Not included (buyer pays) | See Section 10.1 / 4.9                                                  | 🟢                    | Buyer bears cost per SPA, so not a seller expense here.                                                    |
| Financing fees                         |              Not explicit | NOT FOUND                                                               | 🟠                    | Could be argued included if incurred “in connection” and payable by Group Companies; clarify in schedules. |
| Reorganization / Pickles Transfer fees |                       Yes | “solely in connection with the Reorganization and the Pickles Transfer” | 🟠 Off-Market (Buyer) | This is very deal-specific; seller may argue these are seller costs, not target-borne.                     |

**Anti-Duplication Language:**

| Phrase                          | Present? | Exact Quote           | Scope            |
| ------------------------------- | -------: | --------------------- | ---------------- |
| “without duplication”           |      Yes | “without duplication” | Definition-level |
| “to the extent not included in” |       No | —                     | —                |
| “for the avoidance of doubt”    |       No | —                     | —                |

**Red Flag Language Identified:**

| Phrase                                 | Why It’s Concerning                                                                                                                                                                       | Severity    |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Overlap with Indebtedness clause (vii) | Both definitions touch employee-related transaction payments; even with anti-duplication, classification fights are common and can double-count if the statement template isn’t airtight. | Medium–High |
| “incurred by the Group Companies”      | If some costs are incurred by TreeHouse but allocated or charged through intercompany, routing becomes important (especially given intercompany settlement at closing).                   | Medium      |

**Overall Market Position Assessment:** 🟠 Slightly Off-Market (Buyer)
**Reasoning:** Third-party fees + payroll taxes are standard. The more aggressive elements are (a) broad employee payment inclusion and (b) including reorganization/pickles transfer professional fees as Transaction Expenses.

**Counsel Questions to Raise:**

1. Provide the draft **Preliminary Closing Statement** (or a schedule) listing each Transaction Expense line item and confirm which entity owes it and whether it’s accrued in WC.
2. Confirm whether any financing fees (if any) are intended to be Transaction Expenses or captured in Indebtedness.

**Suggested Revisions (if Off-Market):**
Original: “any professional fees… solely in connection with the Reorganization and the Pickles Transfer”
Suggested: include only those expressly listed on a schedule with agreed caps.
Rationale: Prevents open-ended additions late in the process.

---

### 2.7 Definition 7 — Taxes (definition)

**Definition Name:** “Taxes”
**Section Reference:** Section 1.1 (Definitions), PDF pp. 29–31

**Full Verbatim Text:**

```text
“Taxes” means (a) any and all federal, state, local and foreign taxes, assessments and other charges of any kind, including any income, gross receipts, capital, franchise, profits, license, payroll, employment, social security, disability, property, excise, severance, stamp, sales, use, transfer, value added, alternative or add-on minimum, withholding, customs duties and other taxes, in each case, including any interest, penalties or additions to tax applicable thereto, (b) any liability for the payment of any amounts of the type described in clause (a) above as a result of being a member of an affiliated, consolidated, combined, unitary or aggregate group for any period, (c) any liability for the payment of any amounts of the type described in clause (a) above as a result of being a partner in or a member of a partnership, limited liability company or other similar entity or as a transferee or successor, (d) any liability for the payment of any amounts of the type described in clause (a) above as a result of any tax sharing agreement, tax indemnity agreement or any other contract or arrangement with respect to Taxes, (e) any liability for the payment of any amounts of the type described in clause (a) above as a result of being responsible for such payment pursuant to applicable Law, and (f) any liability for the repayment or recapture of any federal, state, provincial, local or foreign Tax credit, Tax incentive or Tax refund and (g) any liability for the repayment or recapture of any Canadian federal or provincial governmental grant or other incentive program, including as a result of any failure to meet the conditions for any such grant or incentive program, including (i) any reimbursement required pursuant to the Canadian Emergency Wage Subsidy program, (ii) the Canadian Emergency Rent Subsidy program, or (iii) any other COVID-19 relief program.
```

**Plain-English Summary:**
“Taxes” is broadly defined to cover essentially all taxes, interest/penalties, and related liabilities, including group liabilities (consolidated/affiliated), transferee/successor liabilities, contractual tax sharing liabilities, and repayments/recapture of tax credits and Canadian government grant/relief programs.

**Component Breakdown:**

| Component                                  | Included? | Verbatim Language                                | Market Position | Notes                                                 |
| ------------------------------------------ | --------: | ------------------------------------------------ | --------------- | ----------------------------------------------------- |
| Income taxes                               |       Yes | “income… taxes”                                  | 🟢              | Standard.                                             |
| Payroll/employment taxes                   |       Yes | “payroll, employment, social security…”          | 🟢              | Standard.                                             |
| Sales/use/VAT                              |       Yes | “sales, use… value added”                        | 🟢              | Standard.                                             |
| Transfer/stamp duties                      |       Yes | “stamp… transfer”                                | 🟢              | Standard.                                             |
| Interest/penalties                         |       Yes | “interest, penalties or additions”               | 🟢              | Standard.                                             |
| Group/affiliated liability                 |       Yes | “member of… affiliated, consolidated…”           | 🟢              | Standard.                                             |
| Partnership/transferee                     |       Yes | “partner… transferee or successor”               | 🟢              | Standard.                                             |
| Tax sharing agreements                     |       Yes | “tax sharing… tax indemnity…”                    | 🟢              | Standard.                                             |
| Repayment/recapture of tax credits/refunds |       Yes | “repayment or recapture…”                        | 🟠              | Increasingly common; still worth flagging.            |
| Canadian COVID relief recapture            |       Yes | “Canadian Emergency Wage Subsidy… Rent Subsidy…” | 🟠              | Deal-specific; appropriate given Canadian operations. |

**Anti-Duplication Language:** Not applicable (definition is broad; anti-duplication handled in specific tax sections and in purchase price adjustments).

**Red Flag Language Identified:**

| Phrase                                         | Why It’s Concerning                                                                                                          | Severity |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| Inclusion of government grant/relief recapture | If the business received COVID relief, recapture risk could be material and may not be fully diligenced if treated as “tax.” | Medium   |

**Overall Market Position Assessment:** 🟢 Market Standard
**Reasoning:** Broad “Taxes” definitions are standard; the Canadian grant/relief element is context-appropriate.

**Counsel Questions to Raise:**

1. Confirm whether any Canadian COVID relief programs were used and whether compliance evidence exists to avoid recapture.
2. Confirm whether any tax sharing agreements exist that are terminated at closing (see Section 6.9).

**Suggested Revisions:** Not required (but ensure allocation/indemnity sections align).

---

### 2.8 Definition 8 — Accounting Principles / Accounting Standards

**Definition Name:** “Applicable Accounting Principles”
**Section Reference:** Section 1.1 (Definitions), PDF p. 14

**Full Verbatim Text:**

```text
“Applicable Accounting Principles” means the accounting principles, practices and policies set forth on Section 2.3(a) of the Disclosure Schedules.
```

**Plain-English Summary:**
This points the entire completion accounts methodology to a bespoke accounting framework in the disclosure schedules. In effect, the parties can override or clarify GAAP/past practice through the schedule.

**Component Breakdown:**

| Component                      | Included? | Verbatim Language                  | Market Position | Notes                                                                                             |
| ------------------------------ | --------: | ---------------------------------- | --------------- | ------------------------------------------------------------------------------------------------- |
| GAAP/IFRS stated?              |   Unknown | Not in definition; schedule-driven | 🟢/🟠           | Market to use a schedule; but **we do not have the schedule**, so we can’t confirm the hierarchy. |
| Consistency with past practice |   Unknown | Schedule-driven                    | 🟠              | Often a major negotiation point; missing schedule is a diligence gap.                             |
| Specific reserves / policies   |   Unknown | Schedule-driven                    | 🟠              | Potentially highly impactful (inventory reserves, AR allowances, accrual cutoffs).                |

**Anti-Duplication Language:** Not applicable.

**Red Flag Language Identified:**

| Phrase                                              | Why It’s Concerning                                                                                                                                | Severity |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| “set forth on… Disclosure Schedules” (not provided) | Without Disclosure Schedule 2.3(a), you cannot validate the true financial mechanics. This is a critical missing input for any SPA analytics tool. | High     |

**Overall Market Position Assessment:** 🟢 Market Standard (structure), with a **High diligence dependency**
**Reasoning:** It is common to define bespoke accounting principles in a schedule; the issue is practical—those schedules are missing from the provided document set.

**Counsel Questions to Raise:**

1. Provide the full Disclosure Schedules, especially Section 2.3(a), and confirm they are the executed final version.
2. Confirm whether the accounting principles include any “buyer policy” language (high-risk) or “should have been recorded” language (high-risk).

**Suggested Revisions:** If the schedule includes buyer-determined language, require (a) GAAP + consistent with past practice + consistent with sample statement, with clear hierarchy.

---

## Part 3: Purchase Price Mechanics

### 3.1 Price Equation

Reconstructed based on “Purchase Price” and “Estimated Purchase Price” definitions:

**Final Purchase Price (Equity Value):**

- **Enterprise Value**: $950,000,000

* **Closing Cash** (direction: +)

- **Closing Indebtedness** (direction: -)
  +/**-** **NWC Adjustment vs Target NWC** of $205,500,000 (direction: +/-)
- **Closing Transaction Expenses** (direction: -)
  = **Purchase Price**

**Target / Peg:** “Target Net Working Capital” = $205,500,000 (definition; PDF p. 29)

**Section Reference:**

- “Purchase Price” definition: Section 1.1; PDF p. 27
- “Estimated Purchase Price” definition: Section 1.1; PDF p. 19
- True-up mechanics: Section 2.3(g); PDF pp. 42–43

**Verbatim Formula Language (Estimated Purchase Price):**

```text
“Estimated Purchase Price” means an amount equal to (a) the Enterprise Value, plus (b) the Estimated Cash, plus (c) the Working Capital Overage (if any), minus (d) the Estimated Indebtedness, minus (e) the Working Capital Underage (if any), minus (f) the Estimated Transaction Expenses, as each is calculated in accordance with Section 2.3; provided, further, that in no event shall the Estimated Purchase Price exceed $1,010,000,000.
```

**Verbatim Formula Language (Purchase Price):**

```text
“Purchase Price” means an amount equal to (a) the Enterprise Value, plus (b) the Closing Cash, plus (c) the Working Capital Overage (if any), minus (d) the Closing Indebtedness, minus (e) the Working Capital Underage (if any), minus (f) the Closing Transaction Expenses, as each is calculated in accordance with Section 2.3.
```

### 3.2 Term Alignment Check

| Formula Uses This Term                        | Definition Section Uses                                                        |            Match? | Issue if Mismatched                                                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------ | ----------------: | -------------------------------------------------------------------------------------------------------------------- |
| Enterprise Value                              | “Enterprise Value” (Section 1.1; PDF p. 19)                                    |               Yes | —                                                                                                                    |
| Estimated Cash / Closing Cash                 | Defined in Section 2.3(a)/(b) (PDF pp. 40–41)                                  |               Yes | Must ensure consistent methodology in missing accounting principles.                                                 |
| Estimated Indebtedness / Closing Indebtedness | Section 2.3(a)/(b) (PDF pp. 40–41) + “Indebtedness” definition (PDF pp. 21–23) |               Yes | Overlap risk with WC/Tx Expenses as noted.                                                                           |
| Working Capital Overage/Underage              | Defined (PDF p. 33)                                                            | **Mismatch risk** | Defined using **Estimated** NWC, but used in **Purchase Price** definition (should be closing). Needs clarification. |
| Estimated/Closing Transaction Expenses        | Section 2.3(a)/(b) + “Transaction Expenses” definition                         |               Yes | —                                                                                                                    |
| Target Net Working Capital                    | Defined (PDF p. 29)                                                            |               Yes | —                                                                                                                    |

### 3.3 Sign Convention Analysis

| Component            | Direction in Formula |                  Clear? | Potential Ambiguity                                                                                               |
| -------------------- | -------------------- | ----------------------: | ----------------------------------------------------------------------------------------------------------------- |
| Cash                 | +                    |                     Yes | Foreign cash is net of repatriation taxes (see Foreign Cash Amount; PDF p. 19).                                   |
| Indebtedness         | -                    |                     Yes | Overlap with WC and Tx Expenses can change direction if misclassified.                                            |
| NWC vs Target        | +/-                  | **No (drafting issue)** | “Working Capital Overage/Underage” defined using Estimated NWC (PDF p. 33) but used in Purchase Price definition. |
| Transaction Expenses | -                    |                     Yes | Must confirm list and timing (accrued vs paid) in preliminary/final statements.                                   |

### 3.4 Formula-Level Anti-Duplication

- Present? **No explicit formula-level “without duplication”** sentence.
- The anti-duplication approach is primarily:
  - Definition-level (“without duplication” in Cash/Indebtedness/Transaction Expenses)
  - Cross-definition exclusions (Indebtedness exclusion (D) re: WC/Tx Expenses)
  - NWC exclusion of Cash/Debt/Tx Expenses

### 3.5 Market Position Assessment

**Overall purchase price mechanics:** 🟠 Slightly Off-Market (Seller)
Key drivers:

- **$30,000,000 cap** on Net Adjustment Amount (Section 2.3(g)(i); PDF p. 42) is seller-protective and unusual in many completion accounts deals.
- Working capital term mismatch (Estimated vs Closing) is a material ambiguity that should be corrected.

---

## Part 4: Cross-Definition Interaction Analysis

### 4.1 Overlap Matrix

**Overlap Area: Overdrafts**
Definitions Involved: Cash ↔ Indebtedness
How SPA Routes It (quote):

- Cash: “Cash shall not include any negative cash overdrafts or negative cash balances.” (Cash definition; PDF p. 15)
- Indebtedness: “cash overdrafts and negative cash balances” (Indebtedness clause (ix); PDF p. 22)
  Anti-Duplication Present?: **Yes** (clear routing; no double count if applied consistently)
  Risk Level: **Low**
  Recommendation: Ensure bank accounts are reviewed for netting practices and confirm no cash pooling ambiguity.

---

**Overlap Area: Accrued interest**
Definitions Involved: Indebtedness ↔ Working Capital
How SPA Routes It (quote):

- Indebtedness includes “borrowed money (including principal, interest, fees…)” (PDF p. 21)
- Indebtedness exclusion: “shall not include… any Liability… to the extent… taken into account in… Net Working Capital…” (PDF p. 23)
  Anti-Duplication Present?: **Yes** (exclusion (D))
  Risk Level: **Medium** (classification risk)
  Recommendation: In the sample statement / accounting principles, specify that all debt interest accruals are treated as Indebtedness and excluded from WC (or vice versa) consistently.

---

**Overlap Area: Current portion of debt**
Definitions Involved: Indebtedness ↔ Working Capital
How SPA Routes It: Indebtedness includes borrowed money and notes (PDF pp. 21–22); Net Working Capital excludes Indebtedness (PDF p. 26).
Anti-Duplication Present?: **Yes** (WC exclusion + debt exclusion (D))
Risk Level: **Low–Medium**
Recommendation: Confirm Exhibit E line items do not accidentally include current debt in WC.

---

**Overlap Area: Lease liabilities**
Definitions Involved: Indebtedness ↔ Working Capital
How SPA Routes It (quote):

- Indebtedness includes finance leases (“Capital Lease Obligations”) but excludes “operating lease obligations… ASC 842” (PDF pp. 21–23).
  Anti-Duplication Present?: Partial
  Risk Level: **High (gap risk)**
  Recommendation: Explicitly state whether operating lease liabilities are excluded from WC as well. Otherwise, operating lease liabilities could reduce WC and reduce price unintentionally.

---

**Overlap Area: Breakage/make-whole fees**
Definitions Involved: Indebtedness ↔ Transaction Expenses
How SPA Routes It: Not explicitly stated; may be within “fees and any other amounts payable” (Indebtedness clause (i); PDF p. 21).
Anti-Duplication Present?: **Yes** (Indebtedness exclusion (D))
Risk Level: **Medium**
Recommendation: Clarify explicitly that prepayment premiums/breakage are Indebtedness and excluded from Transaction Expenses.

---

**Overlap Area: Financing fees**
Definitions Involved: Indebtedness ↔ Transaction Expenses
How SPA Routes It: Not explicit; Transaction Expenses covers third-party fees broadly; Indebtedness covers fees payable on borrowed money.
Anti-Duplication Present?: **Yes** (Indebtedness exclusion (D))
Risk Level: **Medium–High**
Recommendation: Identify lender fees and specify treatment in the preliminary closing statement.

---

**Overlap Area: Transaction bonuses**
Definitions Involved: Transaction Expenses ↔ Indebtedness ↔ Working Capital
How SPA Routes It (quote highlights):

- Transaction Expenses includes “transaction bonus payments or retention, change in control…” (PDF p. 31)
- Indebtedness includes “accrued and unpaid bonus… severance… retention… change in control…” (PDF p. 22)
- Indebtedness exclusion (D) attempts to prevent duplication (PDF p. 23)
  Anti-Duplication Present?: **Yes (but operationally fragile)**
  Risk Level: **High**
  Recommendation: Require a single agreed schedule allocating each employee-related payment to exactly one bucket and a covenant not to reclassify between buckets.

---

**Overlap Area: Accrued deal costs**
Definitions Involved: Transaction Expenses ↔ Working Capital
How SPA Routes It (quote):

- Net Working Capital excludes “Transaction Expenses” (PDF p. 26).
  Anti-Duplication Present?: **Yes**
  Risk Level: **Low–Medium**
  Recommendation: Confirm Exhibit E doesn’t include deal accruals; exclude explicitly if it does.

---

**Overlap Area: Tax payables**
Definitions Involved: Working Capital ↔ Taxes/Tax Indemnity ↔ Indebtedness
How SPA Routes It (key quotes):

- Indebtedness includes “all accrued Income Taxes… deferred Taxes…” (PDF p. 22)
- Tax indemnity anti-overlap: seller not liable “to the extent such Seller Taxes are included in Closing Net Working Capital or Closing Indebtedness…” (Section 6.7(b); PDF p. 101)
  Anti-Duplication Present?: **Yes** (Section 6.7(b))
  Risk Level: **High**
  Recommendation: Decide the intended home for income taxes (Debt vs WC vs indemnity) and document it in accounting principles and Exhibit E.

---

**Overlap Area: Cash in NWC**
Definitions Involved: Cash ↔ Working Capital
How SPA Routes It (quote):

- NWC excludes “Cash” (PDF p. 26).
  Anti-Duplication Present?: **Yes**
  Risk Level: **Low**
  Recommendation: Ensure Exhibit E doesn’t include cash-like items (e.g., restricted cash, undeposited funds) in current assets.

---

**Overlap Area: Intercompany balances**
Definitions Involved: Multiple
How SPA Routes It (quote):

- Indebtedness excludes “intercompany obligations solely between the Group Companies” (PDF p. 23).
- Intercompany cancellation: “all balances due between the Group Companies and TreeHouse and its Affiliates… shall… be cancelled, settled or eliminated without any consideration…” (Section 5.4(b); PDF p. 82)
  Anti-Duplication Present?: Yes (structural settlement)
  Risk Level: **Medium**
  Recommendation: Confirm timing (“immediately prior to Closing”) and ensure the accounting principles reflect elimination entries consistently so they don’t distort WC.

---

### 4.2 Gap Analysis

| Item                                  | Risk of Falling Through Definitions                                  | Which Definitions Should Capture It                     |                     Currently Captured? | Recommendation                                                                                                                                                                  |
| ------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Restricted cash                       | Could be excluded from Cash and not included in WC                   | Cash (exclude) + explicit treatment in price (separate) |    Partially (Restricted Cash excluded) | Confirm whether restricted cash should be treated as “Restricted Cash” and excluded from equity value entirely, or whether certain operational restrictions should still count. |
| Trapped foreign cash                  | Cash is adjusted via “Foreign Cash Amount” net of repatriation taxes | Cash + Foreign Cash Amount                              |                      Yes (net of taxes) | Clarify how repatriation taxes are computed and whether buyer has review rights.                                                                                                |
| Deposits in transit                   | Could be omitted if bank cutoff unclear                              | Cash definition                                         |                                     Yes | Confirm cutoff timing and supporting bank reports.                                                                                                                              |
| Outstanding checks                    | Could double count (as AP + cash reduction)                          | Cash definition + WC exclusions                         |                      Yes (cash reduced) | Ensure Exhibit E/WC excludes those liabilities if they’re already handled by cash reduction, or apply consistent convention.                                                    |
| Off-balance sheet items               | Could be excluded from Debt and WC                                   | Indebtedness (if debt-like)                             |                                 Unclear | Add explicit inclusion of guarantees, commitments, or lease-like items if material.                                                                                             |
| Contingent liabilities                | Often excluded from Debt/WC unless accrued                           | Indebtedness (sometimes) or indemnity                   | Not captured (no general reps survival) | Reliance shifts to RWI for unknown liabilities; confirm RWI coverage scope/exclusions.                                                                                          |
| Operating lease liabilities (ASC 842) | Excluded from Indebtedness; may slip into WC                         | WC rules                                                |                               Not clear | Add explicit exclusion from WC or define treatment.                                                                                                                             |
| Prepayment premiums                   | Not expressly in debt                                                | Indebtedness                                            |                                 Unclear | Add explicit language including breakage/make-whole.                                                                                                                            |

---

## Part 5: Closing Statement & True-Up Mechanics

### 5.1 Timeline Extraction

| Stage                                |                              Days After Close | Responsible Party                         | Section Ref                             | Market Comparison                                             |
| ------------------------------------ | --------------------------------------------: | ----------------------------------------- | --------------------------------------- | ------------------------------------------------------------- |
| Estimated Closing Statement delivery |   **At least 5 Business Days before Closing** | Buyer prepares; delivers to TreeHouse     | Section 2.3(a); PDF p. 40               | Market: at/before closing ✅                                  |
| Final Closing Statement preparation  |             **Within 120 days after Closing** | Buyer                                     | Section 2.3(b); PDF p. 40               | Market: 60–90 days → **Buyer-favorable / slower**             |
| Seller review/access period          |                     **60 days** after receipt | TreeHouse                                 | Section 2.3(e); PDF p. 41               | Market: 30–45 days → **Seller-favorable (longer)**            |
| Dispute notice deadline              |                          End of 60-day review | TreeHouse                                 | Section 2.3(e); PDF p. 41               | Market: 30 days after review → here embedded in review window |
| Negotiation period                   |                          **10 Business Days** | Both                                      | Section 2.3(f); PDF p. 41               | Market: common 10–20 BD ✅                                    |
| Independent Accountant referral      |                 After negotiation period ends | Both / Buyer engages IA (per process)     | Section 2.3(f); PDF pp. 41–42           | Market: common ✅                                             |
| Independent Accountant decision      |       **Within 30 days** of final submissions | Independent Accountant                    | Section 2.3(f); PDF p. 42               | Market: common 30–45 days ✅                                  |
| Payment of true-up                   | **5 Business Days** after final determination | Buyer or TreeHouse depending on direction | Section 2.3(g)(ii)–(iii); PDF pp. 42–43 | Market: common 3–10 BD ✅                                     |

### 5.2 Process Mechanics

| Element                          | How SPA Handles It                                                                                                                                                               | Market Position | Section Ref       |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------- |
| Who prepares Estimated Statement | Buyer                                                                                                                                                                            | 🟢              | 2.3(a); PDF p. 40 |
| Who prepares Final Statement     | Buyer                                                                                                                                                                            | 🟢              | 2.3(b); PDF p. 40 |
| Seller access to books/records   | TreeHouse and reps get reasonable access during review period                                                                                                                    | 🟢              | 2.3(e); PDF p. 41 |
| Independent Accountant selection | The firm engaged is “Independent Accounting Firm” (not named in SPA text; process in 2.3(f))                                                                                     | 🟠              | 2.3(f); PDF p. 41 |
| IA scope                         | Resolve only “mathematical errors” and whether items were “determined in accordance with the terms of this Agreement”; cannot opine on whether the target/estimates were correct | 🟢              | 2.3(f); PDF p. 41 |
| IA standard of review            | Acts as “an expert and not an arbitrator”; uses only written materials; no independent review                                                                                    | 🟢/🟠           | 2.3(f); PDF p. 42 |
| IA decision binding?             | Yes, “final, conclusive and binding” absent fraud/willful breach                                                                                                                 | 🟢              | 2.3(f); PDF p. 42 |
| Cost allocation for IA           | Fees allocated inversely to relative success                                                                                                                                     | 🟢              | 2.3(f); PDF p. 42 |

### 5.3 Red Flags in True-Up Process

- **$30,000,000 cap on Net Adjustment Amount** is a major economic limitation: “in no event shall the Net Adjustment Amount exceed $30,000,000 (whether positive or negative)” (Section 2.3(g)(i); PDF p. 42). This is seller-protective and can leave buyer exposed if estimates are materially wrong.
- **Working capital definitional mismatch** (Estimated vs Closing) is a potential drafting defect that increases dispute risk.
- Buyer has **120 days** to deliver the Final Closing Statement (longer than many market deals), which delays finality and can be used tactically.

---

## Part 6: Escrow & Holdback Terms

### 6.1 Escrow Summary Table

| Escrow Type       |         Amount | % of Deal | Purpose         | Release Timing | Release Conditions | Interest To | Section Ref |
| ----------------- | -------------: | --------: | --------------- | -------------- | ------------------ | ----------- | ----------- |
| General Indemnity | NOT APPLICABLE |         — | No escrow found | —              | —                  | —           | NOT FOUND   |
| PPA/Adjustment    | NOT APPLICABLE |         — | No escrow found | —              | —                  | —           | NOT FOUND   |
| Special Purpose   | NOT APPLICABLE |         — | No escrow found | —              | —                  | —           | NOT FOUND   |

**Practical substitute:** The SPA uses a **Seller Note** and allows reduction of Seller Note principal to satisfy a negative true-up (Section 2.3(g)(iii); PDF p. 43), which functions like a holdback/deferred consideration adjustment tool.

### 6.2 Market Comparison

| Element            |        This SPA | Market Benchmark (No RWI) | Market Benchmark (With RWI) | Assessment                                |
| ------------------ | --------------: | ------------------------: | --------------------------: | ----------------------------------------- |
| Indemnity escrow % | 0% (none found) |                      ~10% |                       ~0.5% | 🟠 Seller-favorable / RWI-style           |
| PPA escrow %       | 0% (none found) |                       ~1% |                         ~1% | 🟠 Replaced by seller note + cash true-up |
| Escrow period      |             N/A |                 12 months |                   12 months | N/A                                       |

### 6.3 Escrow Mechanics Details

Funded from purchase price or in addition? **NOT APPLICABLE** (no escrow).

Claim mechanics / relationship to indemnification: **NOT APPLICABLE** (no escrow).

**Key holdback-like mechanic (quote):**

```text
TreeHouse shall satisfy its obligation to pay such amount by reducing the principal amount of the Seller Note… and by paying… any remainder…
```

(Section 2.3(g)(iii); PDF p. 43)

---

## Part 7: Accounting Principles & Methodology

### 7.1 Hierarchy

**Priority Order (best available from SPA text):**

1. Relevant definitions and terms of the Agreement
2. Applicable Accounting Principles (Disclosure Schedule 2.3(a))
3. Exhibit E line items are referenced but explicitly non-binding if inconsistent

**Verbatim Language (most direct hierarchy language):**

```text
…calculated in accordance with the Applicable Accounting Principles; provided that the line items set forth on Exhibit E are intended to reflect…
…provided, further, that the amounts in Exhibit E are illustrative only and do not represent binding principles…
…provided, further, that to the extent that the balances set forth in Exhibit E are not consistent with the Applicable Accounting Principles, the definition of the Applicable Accounting Principles will prevail.
```

(Net Working Capital definition; PDF p. 26)

**Section Reference:** Section 1.1 (Net Working Capital); PDF p. 26

### 7.2 Key Methodology Questions

| Element                                         | How SPA Addresses It                                                                                                                               | Section Ref                                                    |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| GAAP/IFRS specification                         | GAAP referenced in Indebtedness lease/tax concepts; completion accounts governed by “Applicable Accounting Principles” in schedules (not provided) | GAAP def PDF p. 19; Applicable Accounting Principles PDF p. 14 |
| “Consistent with past practice” language        | NOT FOUND in SPA text (may be in Disclosure Schedule 2.3(a))                                                                                       | NOT FOUND (in-file)                                            |
| “Consistent with Financial Statements” language | NOT FOUND in SPA text (may be in schedules)                                                                                                        | NOT FOUND                                                      |
| Sample calculations / illustrative schedules    | “Sample Statement” format referenced (Disclosure Schedule 2.3(b)), Exhibit E referenced                                                            | 2.3(b) PDF p. 40; NWC def PDF p. 26                            |
| No hindsight / no new info provisions           | NOT FOUND explicitly                                                                                                                               | NOT FOUND                                                      |
| No reclassification provisions                  | Not explicit; IA constrained to items in Buyer’s Final Closing Statement and TreeHouse Notice                                                      | 2.3(f); PDF p. 42                                              |
| Reserves methodology                            | NOT FOUND (likely in Applicable Accounting Principles)                                                                                             | NOT FOUND                                                      |
| Cut-off time specification                      | Calculation Time = 11:59 p.m. ET on day prior to Closing                                                                                           | 2.3(a); PDF p. 40                                              |
| FX rate determination                           | NOT FOUND (agreement states dollars = USD, but doesn’t specify conversion mechanics for foreign cash)                                              | 10.13; PDF p. 117                                              |
| “As determined by Buyer”                        | Buyer prepares statements; but IA constraints exist                                                                                                | 2.3(b), 2.3(f)                                                 |

### 7.3 Red Flags

| Issue                                  | Quote                                                                                                    | Risk                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Missing accounting principles schedule | “Applicable Accounting Principles… set forth on Section 2.3(a) of the Disclosure Schedules.” (PDF p. 14) | High — you cannot validate the actual methodology.                 |
| Exhibit E non-binding                  | “amounts in Exhibit E are illustrative only…” (PDF p. 26)                                                | High — increases reclassification/dispute risk.                    |
| Buyer-controlled statement             | Buyer prepares both preliminary and final statements                                                     | Medium — mitigated by access + IA process, but still control risk. |

---

## Part 8: Sample Calculations & Schedules

**Schedule / illustrative calculations found in provided PDF:**

- **Exhibit A (Sellers)** is included (PDF p. 124) — not a financial calculation schedule.
- Exhibit E (Net Working Capital) is referenced but **NOT FOUND** in provided PDF.
- “Sample Statement” is referenced in Disclosure Schedule 2.3(b) but **NOT FOUND** in provided PDF.
- Disclosure Schedules are referenced but **NOT PROVIDED**.

Accordingly:

**Schedule:** Exhibit E — Net Working Capital
**Reference:** Referenced in “Net Working Capital” definition (PDF p. 26)
**Purpose:** Working Capital
**Accounts Explicitly Included:** NOT FOUND (Exhibit E not provided)
**Accounts Explicitly Excluded:** NOT FOUND
**Target/Peg Amount:** Target Net Working Capital = $205,500,000 (PDF p. 29)
**Methodology Notes:** Exhibit E is “illustrative only” and not binding (PDF p. 26).
**Usefulness Assessment:**

- Sufficient detail to replicate calculation? **No (missing exhibit)**
- Ties to trial balance accounts? **No (missing exhibit)**
- Missing elements: full line item listing, mapping rules, reserve methodologies, and any special classifications.

---

## Part 9: Earnout Provisions

**NO EARNOUT PROVISION** (skip to Part 10).

---

## Part 10: Locked-Box Provisions

**COMPLETION ACCOUNTS STRUCTURE - NO LOCKED-BOX** (Section 2.3; PDF pp. 40–43).

---

## Part 11: Funds Flow Mechanics

### 11.1 Funds Flow Table

| Payment                              | Amount/Formula                                                                                                              | Recipient                                   | Timing           | Funding Source  | Section Ref                                      |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------- | --------------- | ------------------------------------------------ |
| Cash to sellers                      | “Closing Date Cash Consideration” (75% of Estimated Purchase Price minus $185,000,000)                                      | Paid to account designated by TreeHouse     | At closing       | Buyer           | 2.2(b)(i); PDF p. 39; definition PDF p. 15       |
| Seller note / deferred consideration | Seller Note delivered (principal amount determined under Seller Credit Agreement; not provided)                             | Delivered to TreeHouse as agent for Sellers | At closing       | Buyer issuance  | 2.2(b)(ii); PDF p. 39; Seller Note def PDF p. 29 |
| Transaction expenses                 | Estimated Transaction Expenses paid by Buyer on behalf of Group Companies to payees listed in Preliminary Closing Statement | Advisors/employees/others owed              | At closing       | Buyer           | 2.2(b)(iv); PDF p. 40                            |
| Debt payoff                          | NOT SPECIFIED as a direct funds flow item                                                                                   | Lenders (if any)                            | —                | —               | NOT FOUND                                        |
| Indemnity escrow                     | None                                                                                                                        | —                                           | —                | —               | NOT FOUND                                        |
| PPA escrow                           | None                                                                                                                        | —                                           | —                | —               | NOT FOUND                                        |
| True-up payment                      | Net Adjustment Amount (capped at $30m), paid by Buyer or TreeHouse; TreeHouse can satisfy by reducing Seller Note principal | Buyer or TreeHouse                          | 5 BD after final | Buyer/TreeHouse | 2.3(g)(ii)–(iii); PDF pp. 42–43                  |

### 11.2 Payment Mechanics

| Element                           | Details                                                                                             | Section Ref           |
| --------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------- |
| Wire instructions timing          | Not specified; TreeHouse designates account                                                         | 2.2(b)(i); PDF p. 39  |
| Paying agent (if any)             | TreeHouse acts as agent for Sellers for receipt of Seller Note                                      | 2.2(b)(ii); PDF p. 39 |
| Allocation among multiple sellers | Not detailed in SPA text; sellers listed on Exhibit A                                               | Exhibit A; PDF p. 124 |
| Withholding provisions            | Buyer must withhold if required by law; must cooperate to reduce withholding; provide documentation | 2.4; PDF p. 43        |

---

## Part 12: Set-Off Rights (All Contexts)

### 12.1 Set-Off Summary

| Context                                 |   Set-Off Permitted? | Conditions                                                                        | Quote                                                                           | Section Ref            |
| --------------------------------------- | -------------------: | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------- |
| Against escrow                          |       NOT APPLICABLE | No escrow                                                                         | —                                                                               | —                      |
| Against earnout                         |       NOT APPLICABLE | No earnout                                                                        | —                                                                               | —                      |
| Against deferred payments (Seller Note) | **Yes (functional)** | Negative Net Adjustment Amount may be satisfied by reducing Seller Note principal | “TreeHouse shall satisfy… by reducing the principal amount of the Seller Note…” | 2.3(g)(iii); PDF p. 43 |
| Against seller note (general)           | Not otherwise stated | —                                                                                 | NOT FOUND                                                                       | —                      |
| General set-off clause                  |            NOT FOUND | —                                                                                 | NOT FOUND                                                                       | —                      |

### 12.2 Limitations on Set-Off

| Limitation                      |          Present? | Details                                                                          |
| ------------------------------- | ----------------: | -------------------------------------------------------------------------------- |
| Only finally determined amounts | Yes (for true-up) | Seller Note reduction occurs after final determination of Net Adjustment Amount. |
| Notice requirements             |               Yes | True-up notice/dispute process required.                                         |
| Cure period                     |               N/A | Not framed as cure.                                                              |
| Minimum threshold               |         Not found | No explicit threshold beyond cap.                                                |
| Sole recourse to escrow         |               N/A | No escrow.                                                                       |

---

## Part 13: Indemnification Mechanics (Financial Aspects)

### 13.1 Summary Table

Because **representations/warranties do not survive closing** (RWI-style structure), classic cap/basket mechanics for rep breaches are largely not applicable.

| Element                | Seller Indemnity                                             | Buyer Indemnity | Section Ref            |
| ---------------------- | ------------------------------------------------------------ | --------------- | ---------------------- |
| Cap (general reps)     | NOT APPLICABLE (no survival for rep breaches)                | N/A             | 8.1; PDF p. 106        |
| Cap (fundamental reps) | NOT APPLICABLE (no survival for rep breaches)                | N/A             | 8.1; PDF p. 106        |
| Basket type            | NOT APPLICABLE                                               | N/A             | —                      |
| Basket amount          | NOT APPLICABLE                                               | N/A             | —                      |
| De minimis threshold   | NOT FOUND                                                    | NOT FOUND       | —                      |
| Survival (general)     | Reps/warranties terminate at Closing; some covenants survive | —               | 8.1(a)–(b); PDF p. 106 |
| Survival (fundamental) | Not applicable as framed                                     | —               | 8.1; PDF p. 106        |
| Survival (tax)         | Separate tax indemnity applies (Seller Taxes)                | —               | 6.7; PDF p. 101        |

Key indemnities that do exist:

- Seller indemnifies for certain **Excluded Liabilities / specified matters** (Section 8.2; PDF p. 107)
- Buyer indemnifies for **Assumed Liabilities** (Section 8.3; PDF p. 109)
- Separate **tax indemnity** (Section 6.7; PDF p. 101)

### 13.2 Exclusive Remedy Analysis

| Question                                                  | Answer                      | Quote                                                                                                                             |
| --------------------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Is indemnification the exclusive remedy?                  | Yes (subject to carve-outs) | “the remedies set forth in this Article VIII… shall be the sole and exclusive remedies…” (8.1(c); PDF p. 106)                     |
| Carve-outs from exclusive remedy?                         | Yes                         | “…except (x) for the rights… under the R&W Insurance Policy… or (y) in the case of fraud or willful breach…” (8.1(c); PDF p. 106) |
| Is escrow the exclusive source?                           | N/A                         | No escrow.                                                                                                                        |
| Can buyer pursue sellers directly after escrow exhausted? | N/A                         | No escrow.                                                                                                                        |

### 13.3 Alignment Check

| Element                          | Aligned? | Issue      |
| -------------------------------- | -------: | ---------- |
| Escrow period vs survival period |      N/A | No escrow. |
| Escrow amount vs cap             |      N/A | No escrow. |
| Basket vs de minimis             |      N/A | Not used.  |

---

## Part 14: Tax Provisions (Beyond Definition)

### 14.1 Tax Allocation

| Element                           | Details                                                                                                                   | Section Ref     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Pre-closing tax responsibility    | Seller indemnity for “Seller Taxes” (pre-closing periods and seller-owned group liability), subject to overlap reductions | 6.7; PDF p. 101 |
| Straddle period allocation method | Hybrid: deemed closing of books for taxes not allocable; proration for taxes allocable by day (property, payroll, etc.)   | 6.2; PDF p. 100 |
| Transfer taxes allocation         | Buyer pays 50% and Sellers pay 50%                                                                                        | 6.1; PDF p. 100 |
| Withholding mechanics             | Buyer may withhold; must cooperate to reduce; provide documentation                                                       | 2.4; PDF p. 43  |
| Gross-up provisions               | NOT FOUND                                                                                                                 | —               |

### 14.2 Tax Covenants

| Covenant               |         Present? | Key Terms                                                                                                                                  |
| ---------------------- | ---------------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Cooperation on returns |              Yes | Buyer prepares post-close group returns; TreeHouse provides info; certain rights around audits and amendments (6.3, 6.4, 6.5; PDF p. 100). |
| No amended returns     | Yes (restricted) | Buyer cannot amend pre-closing returns without TreeHouse consent (6.4; PDF p. 100).                                                        |
| Tax contest provisions |              Yes | Buyer controls contests but must allow TreeHouse participation; consent rights for certain actions (6.5; PDF p. 100).                      |
| Refund allocation      |              Yes | Refunds for pre-closing periods to TreeHouse (with exceptions) (6.3; PDF p. 100).                                                          |

### 14.3 Tax Indemnity Overlap

- Tax indemnity present? **Yes** (Section 6.7; PDF p. 101)
- Overlap with Working Capital tax accruals addressed? **Yes**
- Quote anti-overlap language:

```text
TreeHouse shall have no liability under this Section 6.7 with respect to any Seller Taxes… to the extent such Seller Taxes are included in Closing Net Working Capital or Closing Indebtedness…
```

(6.7(b); PDF p. 101)

---

## Part 15: Insurance Provisions

### 15.1 R&W Insurance

| Element                          | Details                                                                                                                                           | Section Ref                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| R&W insurance required/obtained? | Buyer has obtained a commitment to bind a policy effective at Closing; binding is at Buyer’s discretion but they must use reasonable best efforts | 4.9; PDF p. 73 and 5.12; PDF p. 87 |
| Premium allocation               | Buyer bears all costs of the R&W Insurance Policy                                                                                                 | 10.1; PDF p. 113                   |
| Retention amount                 | NOT STATED in SPA text (likely in policy)                                                                                                         | NOT FOUND                          |
| Impact on indemnification        | Classic RWI structure: reps/warranties do not survive; Buyer’s recourse is through RWI except fraud/willful breach                                | 8.1(b)–(c); PDF p. 106             |

Key quotes:

- Commitment to bind:

```text
The Buyer has obtained a commitment… to provide a fully-bound Representations and Warranties Insurance Policy… effective as of the Closing…
```

(4.9; PDF p. 73)

- Buyer pays cost:

```text
…the cost of the R&W Insurance Policy… shall be borne solely by Buyer.
```

(10.1; PDF p. 113)

### 15.2 D&O Tail

| Element                           | Details                                | Section Ref |
| --------------------------------- | -------------------------------------- | ----------- |
| D&O tail required?                | NOT FOUND as a tail policy requirement | —           |
| Premium payment responsibility    | NOT APPLICABLE                         | —           |
| Captured in Transaction Expenses? | NOT FOUND                              | —           |
| Policy term                       | NOT FOUND                              | —           |

What is present instead is a “lookback access” to seller policies for pre-closing claims (Section 5.10; PDF p. 86), which is related but not a D&O tail purchase obligation.

---

## Part 16: Intercompany Treatment

### 16.1 Intercompany Balances

| Element                                    | Details                                                                                        | Section Ref                                  |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Intercompany balances addressed?           | Yes                                                                                            | 5.4(b); PDF p. 82                            |
| Settlement required pre-close?             | Yes, cancellation/settlement without consideration immediately prior to Closing                | 5.4(b); PDF p. 82                            |
| Included in Indebtedness?                  | Intercompany among Group Companies excluded; balances with TreeHouse/affiliates are eliminated | Indebtedness def PDF p. 23; 5.4(b) PDF p. 82 |
| Included in Working Capital?               | Not directly stated; but elimination should remove them                                        | 5.4(b); PDF p. 82                            |
| Which direction (receivables vs payables)? | Both directions eliminated                                                                     | 5.4(b); PDF p. 82                            |

Key quote:

```text
…all balances due between the Group Companies and TreeHouse and its Affiliates… shall… be cancelled, settled or eliminated without any consideration…
```

(5.4(b); PDF p. 82)

### 16.2 Intercompany Agreements

| Element               | Details                                                                           |                           |
| --------------------- | --------------------------------------------------------------------------------- | ------------------------- |
| Termination required? | Yes: intercompany contracts end at Closing except certain “Continuing Agreements” | Section 5.4(a); PDF p. 82 |
| Transition services?  | TSA form referenced as Exhibit B but NOT PROVIDED                                 | NOT FOUND                 |

---

## Part 17: FX Mechanics

This is a cross-border deal (US + Canada entities), but the SPA states **all dollar amounts are USD**:

**SINGLE CURRENCY DEAL (USD), with foreign cash concept**
Key quote:

```text
All references… to “dollars” or “$” shall be deemed to be references to U.S. dollars.
```

(Section 10.13; PDF p. 117)

FX rate source/timing: **NOT FOUND** (potential gap for converting non-USD foreign cash balances into USD for Closing Cash).

---

## Part 18: Financial Representations

### 18.1 Financial Statements Rep

**Verbatim (Section 3.6; PDF pp. 46–48):**

```text
Section 3.6 Financial Statements.
(a) TreeHouse has delivered to Buyer (i) the audited consolidated balance sheet of the Business as of September 30, 2021 (the “Balance Sheet Date”), and the related audited consolidated statements of income and cash flows of the Business for the twelve (12)-month period ended on the Balance Sheet Date (the “Audited Financial Statements”) and (ii) the unaudited consolidated balance sheet of the Business as of June 30, 2022 (the “Interim Financial Statements Date”) and the related unaudited consolidated statements of income and cash flows of the Business for the nine (9)-month period ended on the Interim Financial Statements Date (the “Interim Financial Statements” and, together with the Audited Financial Statements, the “Financial Statements”). The Financial Statements were prepared in accordance with GAAP applied on a consistent basis throughout the periods indicated (except in the case of unaudited statements for the absence of footnotes and subject to normal and recurring year-end audit adjustments), and present fairly in all material respects the consolidated financial position, results of operations and cash flows of the Business as of the respective dates thereof and for the respective periods covered thereby. The Financial Statements reflect the operation and the financial performance of the Business in accordance with past practices and include and reflect all revenue and other income of the Business for the respective periods covered thereby.
(b) All accounts receivable reflected in the Interim Financial Statements represent valid obligations arising from sales actually made or services actually performed in the Ordinary Course of Business. Subject to the reserves set forth in the Interim Financial Statements, such accounts receivable are current and collectible net of such reserves. Since the Interim Financial Statements Date, no Person has asserted in writing to TreeHouse or any Group Company any dispute with respect to any material amount included in the accounts receivable of the Business.
(c) Except for (i) Liabilities reflected or reserved against in the Interim Financial Statements, (ii) Liabilities incurred after the Interim Financial Statements Date in the Ordinary Course of Business, (iii) Liabilities for Taxes, (iv) Liabilities that are obligations under Contracts and (v) Liabilities incurred in connection with the Transactions, the Business does not have any Liabilities of a nature required to be reflected on a balance sheet prepared in accordance with GAAP.
(d) TreeHouse maintains internal accounting controls… sufficient to provide reasonable assurance that… transactions are recorded as necessary… and… recorded assets are compared with existing assets at reasonable intervals…
(e) All inventory reflected in the Interim Financial Statements is of a quantity and quality usable and saleable in the Ordinary Course of Business…
```

**Analysis:**

| Element                     | Present? | Assessment                                                                |
| --------------------------- | -------: | ------------------------------------------------------------------------- |
| “Fairly present”            |      Yes | “present fairly in all material respects…” is market standard.            |
| “Accurate and complete”     |       No | Not an elevated seller standard.                                          |
| “In all material respects”  |      Yes | Typical materiality qualifier.                                            |
| “Taken as a whole”          |       No | Not used here.                                                            |
| Knowledge qualifier         |       No | Seller provides statement without knowledge qualifier.                    |
| Books and records qualifier |       No | Stronger seller representation.                                           |
| GAAP/IFRS compliance        |      Yes | Prepared in accordance with GAAP (with standard interim carve-outs).      |
| Consistency                 |      Yes | “applied on a consistent basis…” and “in accordance with past practices…” |
| Interim period carve-outs   |      Yes | “absence of footnotes… normal and recurring year-end audit adjustments”   |

### 18.2 No Undisclosed Liabilities Rep

**Present (embedded in 3.6(c); PDF p. 47–48).**
Carve-outs are explicitly listed (Financial Statements liabilities, ordinary course post-interim, Taxes, Contract obligations, and transaction liabilities).

### 18.3 Absence of Changes Rep

**Present (Section 3.7; PDF p. 49).**
Financially significant points to look for (high-level): any MAE-type qualifiers, ordinary course, capex/indebtedness restrictions. (Full extraction beyond this response’s financial focus is available if needed, but not required by your template beyond noting financially significant provisions.)

---

## Part 19: Material Adverse Change/Effect

### 19.1 MAC/MAE Definition

**Verbatim (Material Adverse Effect definition; PDF pp. 25–26):**

```text
“Material Adverse Effect” means any event, circumstance, change, effect, development, state of facts, occurrence, condition or incident that, individually or in the aggregate, results in, or would reasonably be expected to result in, a material adverse effect on the business, financial condition or results of operations of the Business, taken as a whole; provided, however, that in no event shall any of the following, alone or in combination, be deemed to constitute, or be taken into account in determining whether there has been, a Material Adverse Effect: (i) changes in general economic, regulatory or political conditions or changes in securities, commodities, financial or capital markets in general; (ii) changes in the industry in which the Business operates, including changes in commodity prices or exchange rates; (iii) changes or developments in or relating to general business, financial or market conditions (including changes in interest rates); (iv) changes in the applicable Laws…; (v) changes in GAAP…; (vi) acts of war… terrorism…; (vii) acts of God… natural disasters…; (viii) public health conditions (including pandemics… COVID-19)…; (ix) any action required… by this Agreement…; (x) any failure by the Business to meet any internal or external projections…; and (xi) the announcement of… this Agreement…; provided, further, that any event, circumstance, change… described in clauses (i), (ii), (iii), (vi), (vii) and (viii) may be taken into account… to the extent such event… has a disproportionate effect on the Business… relative to other companies… in the industry…
```

### 19.2 Carve-Outs

| Carve-Out Category            |    Included? | Specific Language                                                        |
| ----------------------------- | -----------: | ------------------------------------------------------------------------ |
| General economic conditions   |          Yes | “changes in general economic… conditions…”                               |
| Industry conditions           |          Yes | “changes in the industry… including… commodity prices or exchange rates” |
| Changes in law                |          Yes | “changes in the applicable Laws…”                                        |
| Changes in GAAP/IFRS          |          Yes | “changes in GAAP…”                                                       |
| Announcement of transaction   |          Yes | “the announcement of… this Agreement…”                                   |
| Actions required by agreement |          Yes | “any action required… by this Agreement…”                                |
| Actions consented to by buyer | Not explicit | NOT FOUND                                                                |

### 19.3 “Disproportionate Impact” Qualifier

- Present? **Yes**
- Language: “may be taken into account… to the extent… disproportionate effect…” (PDF p. 26)

---

## Part 20: Comprehensive Risk Assessment

### 20.1 Top 10 Financial Risks (Ranked)

| Rank | Risk                                                                          | Definitions/Sections Involved                                                                 | Severity    | Likelihood | Recommendation                                                                             |
| ---: | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------- | ---------- | ------------------------------------------------------------------------------------------ |
|    1 | Missing Exhibit E + missing Applicable Accounting Principles schedule         | NWC def (PDF p. 26); Applicable Accounting Principles (PDF p. 14)                             | High        | High       | Obtain executed schedules/exhibits; validate binding methodology; build account crosswalk. |
|    2 | $30m cap on purchase price true-up                                            | 2.3(g)(i) (PDF p. 42)                                                                         | High        | Medium     | Negotiate higher cap or carve-outs (fraud, misstatement, specific items).                  |
|    3 | Working capital overage/underage definitional mismatch (Estimated vs Closing) | Purchase Price def (PDF p. 27) + WC O/U def (PDF p. 33)                                       | High        | Medium     | Fix drafting to reference Closing NWC; align with statement mechanics.                     |
|    4 | Double-count risk: employee transaction payments in Debt vs Tx Expenses vs WC | Indebtedness (vii) (PDF p. 22) + Transaction Expenses (PDF p. 31) + NWC exclusion (PDF p. 26) | High        | High       | Produce agreed one-bucket schedule; lock classification in sample statement.               |
|    5 | Income tax classification overlap (Debt vs WC vs tax indemnity)               | Indebtedness (viii) (PDF p. 22); 6.7(b) (PDF p. 101)                                          | High        | Medium     | Decide routing and document in accounting principles and Exhibit E.                        |
|    6 | Foreign cash net of repatriation taxes determined by seller in good faith     | Foreign Cash Amount def (PDF p. 19)                                                           | Medium      | Medium     | Require calculation support, review rights, and agreed assumptions/rates.                  |
|    7 | Factoring covenant and exclusion of factored AR/cash from metrics             | 5.24 (PDF p. 99)                                                                              | Medium–High | Medium     | Clarify intended economic effect; ensure no manipulation of closing metrics.               |
|    8 | Seller Note terms not provided (rate, maturity, security, covenants)          | Seller Credit Agreement / Seller Note defs (PDF p. 29); exhibits missing                      | High        | Medium     | Obtain Exhibit D/F; assess credit risk, covenants, and true-up interaction.                |
|    9 | No seller indemnity for rep breaches; reliance on RWI                         | 8.1 (PDF p. 106); 4.9/5.12 (PDF pp. 73, 87)                                                   | Medium–High | Medium     | Confirm RWI coverage, exclusions, materiality scrape, and subrogation limits.              |
|   10 | Operating lease liability treatment gap                                       | Indebtedness exclusion (ASC 842) (PDF p. 23) + WC ambiguity                                   | Medium      | Medium     | Explicitly exclude or define treatment in Exhibit E/accounting principles.                 |

### 20.2 Double-Count Risks Summary

| Item                       | Risk Level |                              Mitigation Present? | Action Needed                                            |
| -------------------------- | ---------- | -----------------------------------------------: | -------------------------------------------------------- |
| Employee bonuses/retention | High       | Partial (Indebtedness exclusion D; WC exclusion) | Require explicit classification schedule.                |
| Income taxes               | High       |                    Partial (6.7(b) anti-overlap) | Decide routing and memorialize in accounting principles. |
| Factoring                  | Medium     |                    Partial (explicit exclusions) | Confirm how this interacts with cash and WC models.      |

### 20.3 Gap Risks Summary

| Item                                   | Risk Level | Currently Addressed? | Action Needed                                            |
| -------------------------------------- | ---------- | -------------------: | -------------------------------------------------------- |
| Exhibit E missing                      | High       |                   No | Obtain and validate.                                     |
| Accounting principles schedule missing | High       |                   No | Obtain and validate.                                     |
| FX conversion mechanics                | Medium     |                   No | Add to accounting principles or closing statement rules. |
| Lease liabilities routing              | Medium     |                   No | Clarify in Exhibit E/accounting principles.              |

---

## Part 21: Negotiation Analysis

### 21.1 Buyer-Favorable Provisions

| Provision                                                       | Why Buyer-Favorable                                             | Typical Seller Pushback                                | Suggested Compromise                                                                                |
| --------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| NWC Exhibit E is illustrative only                              | Buyer can argue classifications more flexibly in statement prep | Seller will demand binding schedule to reduce disputes | Make Exhibit E binding but allow limited, enumerated exceptions tied to GAAP/past practice.         |
| Broad Indebtedness includes income taxes & employee obligations | Reduces purchase price more aggressively                        | Seller will argue these belong in WC or tax indemnity  | Keep some items in debt but include explicit anti-duplication schedule and caps for employee items. |
| Buyer prepares both statements and has 120 days                 | Buyer controls process and timing                               | Seller wants faster finality                           | 90-day delivery + seller extension if needed, or interim drafts.                                    |

### 21.2 Seller-Favorable Provisions

| Provision                                                      | Why Seller-Favorable                                      | Typical Buyer Pushback                      | Suggested Compromise                                                                                   |
| -------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| $30m cap on Net Adjustment                                     | Limits buyer downside from misestimation                  | Buyer wants full true-up                    | Increase cap; carve-out for misclassification of defined items or for specific liabilities.            |
| Reps/warranties non-survival + exclusive remedy                | Seller minimizes post-close exposure                      | Buyer wants survival/caps/baskets or escrow | Maintain RWI structure but require seller limited escrow for fundamental reps or specific known risks. |
| TreeHouse can satisfy negative true-up by reducing Seller Note | Seller preserves cash; shifts recovery to note adjustment | Buyer wants cash recovery                   | Permit note reduction but require minimum cash payment or security enhancements.                       |

### 21.3 Key Negotiation Leverage Points

| Issue                                  | Current Position                 | Importance | Negotiability | Suggested Approach                                                           |
| -------------------------------------- | -------------------------------- | ---------- | ------------- | ---------------------------------------------------------------------------- |
| Missing accounting principles/exhibits | Not in provided PDF              | High       | High          | Treat as gating item; require delivery and tie to signing/closing checklist. |
| True-up cap                            | $30m                             | High       | Medium        | Push cap up or add carve-outs for definitional disputes/known areas.         |
| WC overage/underage mismatch           | Ambiguous                        | High       | High          | Frame as drafting correction (no economics change).                          |
| Factoring mechanics                    | Seller permitted in limited case | Medium     | Medium        | Clarify economic intent and require buyer consent if used.                   |

---

## Part 22: Suggested Revisions

### Revision 1: Fix Working Capital Overage/Underage Drafting Mismatch

**Current Language:**

- “Working Capital Overage… the Estimated Net Working Capital exceeds the Target…” (PDF p. 33)
- Used in “Purchase Price” definition (PDF p. 27)

**Issue:** Purchase Price should be based on **Closing** NWC. Current drafting can create ambiguity and undermine intended true-up.

**Suggested Revision:**
Amend Working Capital Overage/Underage definitions to reference “Net Working Capital” as finally determined (or “Closing Net Working Capital”) rather than “Estimated Net Working Capital.”

**Likely Pushback:** “It’s already clear from Section 2.3.”
**Fallback:** Add interpretive sentence in Section 2.3(g) confirming Overage/Underage is calculated using Closing Net Working Capital for Purchase Price.

---

### Revision 2: Make Exhibit E Binding (or Provide Binding Line-Item Schedule)

**Current Language (quote):**

```text
…the amounts in Exhibit E are illustrative only and do not represent binding principles…
```

(PDF p. 26)

**Issue:** Increases dispute risk and allows reclassification post-close.

**Suggested Revision:**
State Exhibit E is binding and controls line item inclusion/exclusion, with a clear hierarchy against GAAP/past practice.

**Likely Pushback:** Seller may argue the schedule is already sufficient in Disclosure Schedules.
**Fallback:** Keep Exhibit E illustrative but incorporate a binding “line item list” as an annex to the Sample Statement.

---

### Revision 3: Increase or Carve-Out the $30m Net Adjustment Cap

**Current Language (quote):**

```text
…in no event shall the Net Adjustment Amount exceed $30,000,000 (whether positive or negative).
```

(2.3(g)(i); PDF p. 42)

**Issue:** Buyer bears estimation risk beyond $30m.

**Suggested Revision:**
Raise cap (e.g., 10% of EV) or carve out misclassification of Cash/Debt/Taxes/Transaction Expenses from the cap.

**Likely Pushback:** Seller will argue cap was priced into consideration and RWI structure.
**Fallback:** Keep cap but add a “fraud/intentional misstatement” carve-out and require enhanced disclosure of estimate assumptions.

---

## Part 23: Counsel Questions & Open Issues

### 23.1 Questions Requiring Clarification Before Signing

|   # | Question                                                                                       | Relevant Section                                  | Why It Matters                                             | Suggested Resolution                                      |
| --: | ---------------------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------------------- |
|   1 | Provide Disclosure Schedule 2.3(a) “Applicable Accounting Principles.”                         | Applicable Accounting Principles (PDF p. 14)      | Governs all closing calculations.                          | Attach executed schedule; confirm hierarchy and examples. |
|   2 | Provide Exhibit E Net Working Capital and confirm whether it is binding in practice.           | NWC def (PDF p. 26)                               | Determines inclusion/exclusion of accounts.                | Amend language or add binding sample statement.           |
|   3 | Confirm Working Capital Overage/Underage intended to use Closing NWC for final Purchase Price. | Purchase Price (PDF p. 27) + WC O/U (PDF p. 33)   | Prevents a drafting loophole.                              | Draft correction.                                         |
|   4 | Provide Seller Credit Agreement and Seller Note forms (Exhibit D/F) and economic terms.        | Seller Credit Agreement / Seller Note (PDF p. 29) | Deferred consideration credit risk + true-up satisfaction. | Deliver executed forms; summarize rate/maturity/security. |
|   5 | Provide Preliminary Closing Statement template and list of Transaction Expenses.               | 2.3(a); 2.2(b)(iv) (PDF pp. 39–40)                | Avoids surprise “additions” and double counting.           | Agree schedule and caps.                                  |

### 23.2 Diligence Items Triggered by Definitions

| Definition/Provision                  | Diligence Item Needed                                                                 | Priority    |
| ------------------------------------- | ------------------------------------------------------------------------------------- | ----------- |
| Indebtedness (employee items + taxes) | Build a line-by-line debt schedule, including employee accruals and tax accrual logic | High        |
| Transaction Expenses                  | Compile all expected fees/bonuses; confirm who owes; reconcile to accruals            | High        |
| Foreign Cash Amount                   | Model repatriation taxes and verify trapped cash assumptions                          | Medium–High |
| Factoring Arrangements (5.24)         | Confirm existence/amount of factoring and its effect on A/R and cash                  | Medium–High |
| Intercompany settlement (5.4)         | Confirm balances and ensure eliminations won’t distort WC                             | Medium      |

---

## Part 24: Executive Summary

### 24.1 Deal Overview (2–3 sentences)

TreeHouse is selling its meal preparation business through a stock sale of the US and Canadian operating entities. The headline economics are enterprise value-based ($950m) with completion accounts adjustments for cash, debt, working capital versus a $205.5m target, and transaction expenses, plus a significant deferred consideration component via a Seller Note.

### 24.2 Overall Assessment

| Dimension                        | Rating              | Key Drivers                                                                                                                          |
| -------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Definitions clarity              | 🟠                  | Core definitions are present, but missing schedules (Applicable Accounting Principles/Exhibit E) and WC O/U mismatch reduce clarity. |
| Anti-duplication robustness      | 🟠                  | Good definition-level exclusions, but employee/tax overlap remains high-risk without a binding schedule.                             |
| Price mechanics clarity          | 🟠                  | EV bridge is clear; $30m cap + WC mismatch are major issues.                                                                         |
| True-up process fairness         | 🟠                  | Process is mostly standard; buyer has long prep window; seller has long review window; cap drives seller favorability.               |
| Escrow terms                     | 🟢/N/A              | No escrow; consistent with RWI deals, but relies on Seller Note for some downside protection.                                        |
| Overall balance (Buyer ↔ Seller) | 🟠 Seller-favorable | Non-survival + capped adjustment are seller-favorable; buyer offsets with broad debt/expense definitions and RWI.                    |

### 24.3 Top 5 Issues to Raise with Partner/Client

1. **Missing exhibits/schedules that control the economics** (Applicable Accounting Principles, Exhibit E, Sample Statement): treat as gating; cannot price/quantify without them.
2. **$30m cap on the true-up**: seller-protective; evaluate whether modeled variability in cash/debt/WC could exceed cap.
3. **Working capital overage/underage drafting mismatch**: fix as a “technical correction” before it becomes a dispute lever.
4. **Employee-related payments and income taxes overlap across Debt/Tx Expenses/WC**: high double-count risk; require a one-bucket schedule.
5. **Seller Note economics missing**: credit/terms/security matter a lot because it’s also the mechanism to satisfy negative adjustments.

### 24.4 30-Second Deal Summary

“Headline is $950m enterprise value with completion accounts. Equity price is EV plus closing cash minus closing debt, plus/minus working capital against a $205.5m target, minus transaction expenses. There’s a capped true-up—net adjustment can’t exceed $30m either direction. Consideration is a mix of cash at close and a seller note; if the adjustment is negative, sellers can satisfy it by reducing the seller note principal. No escrow; reps don’t survive, and buyer relies on R&W insurance. Key risks are the missing accounting schedules that govern the calculations, the true-up cap, and potential double counting around employee payments and taxes. Overall it’s slightly seller-favorable given capped adjustments and limited post-close recourse.”

# SPA Financial Definitions Research

## Research Questions & Prompts

### Prompt 1: Financial Definitions Market Practice Playbook

**ROLE**
You are a hybrid: (1) senior M&A lawyer, (2) FDD/QoE Partner, and (3) legal-tech researcher.
Your job is to build a "Financial Definitions Market Practice Playbook" for SPAs that is usable in live negotiations and consistent with how FDD teams model cash-to-close and value protection.

**PRIMARY GOAL**
Develop best-practice guidance for EVERY financial/economic definition found in the provided SPA set.
"Best practice" must be practical: how the term is typically drafted, what variants exist, what each variant does to economics, and what to ask/change (with minimal edits).

**INPUTS (the assistant must use all 3)**

1. SPA corpus (see uploaded files):
2. Internal baselines (uploaded):
   - "SPA Best Practices" definitions file (Cash, NWC, Indebtedness, Transaction Expenses, Tax)
   - "SPA Prompt Library / Toolkit A–H" conversation (analysis patterns to replicate)
3. Web research + your own model knowledge:
   - Use web sources to validate what is "market" and document common drafting patterns, by jurisdiction where possible.
   - Prefer reputable sources: Big 4, top law firms, major RWI brokers, accounting standards bodies, and widely used model agreement sources.
   - Use model knowledge to fill gaps, but do NOT present something as "market" without either (a) support from web sources, or (b) evidence that it appears consistently across multiple SPAs in the corpus.

**NON-NEGOTIABLE OUTPUT REQUIREMENTS**
A) Be comprehensive: capture ALL financial/economic terms in the SPA set, not just the usual five.
B) Use SPA evidence: for every term you cover, cite where it appears in at least one SPA (document + section/clause).
C) Use web evidence: for every "market practice" claim, cite at least one web source link (and date).
D) Write plainly, without legalese, EXCEPT:

- "Counsel questions," "Rebuttals," and "Minimal edits" should be in SPA-style language.
  E) Keep drafting suggestions "minimal edit":
- Show edits as either [Delete]/[Add] brackets, or ~~strike~~ + **insert**, focused only on the relevant phrase(s).
  F) Do not paste long clauses. Prefer short excerpts (10–40 words) and rely on citations/section refs.

**PROCESS (follow in order)**

STEP 1 — Build a Term Inventory (from the SPA corpus)
1.1 Extract all defined terms that are plausibly "financial/economic," including those defined: - in the Definitions section, - in purchase price / consideration clauses, - in exhibits/schedules (e.g., WC methodology, sample statements, payoff schedules, leakage schedules), - in earn-out sections and contingent consideration mechanics.
1.2 Tag each term using a taxonomy (multiple tags allowed): - Purchase Price / Consideration - Cash / Cash Equivalents / Restricted Cash / Trapped Cash - Indebtedness / Debt / Net Debt / Debt-like items - Working Capital / Net Working Capital / Current Assets / Current Liabilities - Transaction Expenses / Unpaid Expenses / Change-of-control costs - Taxes / Tax assets & liabilities / Straddle periods / Withholding - Accounting standards / policies / hierarchy (GAAP/IFRS/ASPE; "Accounting Principles"; policy hierarchy; "consistent with past practice") - Earn-outs / contingent consideration / phantom equity / holdbacks tied to performance - Escrows / reserves / holdbacks / adjustment escrow vs indemnity escrow - Leakage / locked-box / permitted leakage / ticker - Financial statements & measurement constructs (Closing Statement, Estimated Statement, Draft/Final Statements, Calculation Time, Reference Time, Effective Time, Target amounts, Pegs) - "Anti-double-count" constructs ("without duplication," "for avoidance of doubt," exclusions) - Other economics terms that materially affect cash-to-close (e.g., "Cash Target", "Net Working Capital Target", "Adjustment Amount", "Reserve Amount", "Deferred Purchase Price", "Finance Lease Obligations", etc.)
1.3 De-duplicate synonyms: - Create a canonical term list (e.g., "Cash" may be "Cash and Cash Equivalents" elsewhere). - Map each SPA's term name → canonical term name.

Deliverable 1: "Term Catalog"

- Table with columns:
  Canonical Term | SPA Term Variants | Tags | Where Found (doc + clause) | Used In Formula? (Y/N) | Notes

STEP 2 — For each canonical term, write a Best-Practice Sheet
For EACH term in the catalog, produce a standardized "Best Practice Sheet":

2.1 Plain-English meaning:

- One paragraph: what the term controls economically.

  2.2 Market practice patterns (web + corpus):

- "Typical" pattern(s) (what commonly appears)
- Buyer-leaning pattern(s)
- Seller-leaning pattern(s)
  For each pattern: explain what it changes economically.

  2.3 SPA evidence:

- Short excerpts from 2–4 different SPAs showing different patterns (each excerpt must include doc + clause ref).

  2.4 Common pitfalls + red flags:

- Specific drafting tells ("without duplication" missing; policy hierarchy unclear; taxes double-counted; earn-outs at max

---

### Prompt 2: Citation Enhancement & Structured Data Extraction

For each canonical bucket in the Market Practice Playbook (Cash, Indebtedness, Working Capital/NWC, Transaction Expenses, Taxes, Accounting Principles hierarchy, anti-duplication, cut-off time, closing accounts process, escrow/RWI retention, locked-box/leakage, earn-outs):

1. Find 3–5 credible public sources (top law firms, Big 4, reputable deal terms publications).
2. For each source, provide: title, publisher, date, jurisdiction context if stated, and a short excerpt (<=25 words) supporting the specific "typical / buyer-leaning / seller-leaning" statements.
3. Rewrite the "Market practice patterns" section to include citations inline and avoid overclaiming. Use "commonly seen / often drafted / sometimes negotiated" when appropriate.
   Output: updated playbook sections with citation list per bucket.

Convert the Term Catalog into a normalized YAML mapping:

For each canonical bucket:

- canonical_id
- display_name
- synonyms (all SPA variants)
- tags
- typical_formula_role (e.g., price adjustment input, statement package, recourse plumbing)
- detection_keywords (5–15 phrases)
- common_pitfalls (bullets)
  Also add an "exceptions" field for tricky terms (e.g., Net Working Capital definitions that include Cash).

Output only the YAML.

From each SPA in the corpus, extract for each canonical bucket:

- exact defined term name
- exact definition section number (and page number if available)
- 1–2 short excerpts (<=40 words each) capturing the critical inclusions/exclusions
- cross-references to the purchase price / adjustment mechanics section numbers where the term is used

Output as a table. The goal is to support clause-accurate register outputs and to build a validated pattern library.

For each high-frequency pitfall (restricted cash, overdraft placement, anti-duplication, tax accrual overlap, transaction expense overlap, accounting hierarchy missing, reclassification risk, expert scope too broad, inconsistent cut-off times):

Provide three minimal-edit clause snippets:
A) Buyer-leaning
B) Seller-leaning fallback
C) Neutral compromise

Each snippet must be <=3 lines, use strike/insert notation, and be written to slot into an existing SPA clause.

Design a rule-based classifier that labels strict text diffs into change types:

- scope expanded/narrowed
- inclusion/exclusion added/removed
- accounting hierarchy changed
- anti-duplication added/removed
- timing/cut-off changed
- process window changed
- recourse/escrow changed

For each class, provide: keywords/patterns, example diff snippets, and an "impact rationale" sentence for the delta register.
Output as a structured specification (YAML or markdown).

---

## Research Report

### Overview

This playbook uses three inputs:

- **SPA corpus (7 agreements)** — Project Dragon, KeyMe, Project Eleos, Project North, Project Skyrocket, Simply Solventless, Vortex.
- **Internal baselines** — "SPA Best Practices" file (Cash, NWC, Indebtedness, Transaction Expenses, Tax) + the accounting principles docs.
- **Web sources** for "market practice" statements (with dates) — primarily top firms + Big 4 + credible deal-terms sources.

---

## Part 1: Term Catalog

### Taxonomy Tags Used

- Purchase Price / Consideration
- Cash / Cash Equivalents / Restricted / Trapped
- Indebtedness / Debt / Net Debt / Debt-like
- Working Capital / Net Working Capital / Current Assets / Current Liabilities
- Transaction Expenses
- Taxes / Tax assets & liabilities / Straddle / Withholding
- Accounting standards / policy hierarchy
- Earn-outs / contingent consideration / phantom equity
- Escrows / reserves / holdbacks
- Leakage / locked-box / permitted leakage / ticker
- Financial statements & measurement constructs (Closing Statement, Estimated, Draft/Final, cut-off times)
- Anti-double-count constructs ("without duplication")

---

### Deliverable 1: Term Catalog Table

> **How to read**: "SPA term variants" lists _every_ capitalized definition in the corpus that falls into the financial/economic taxonomy, mapped to a canonical bucket. "Where Found" gives at least one concrete SPA anchor (doc + clause reference or Definitions section + cross-ref section).

| Canonical Term                                                  | SPA Term Variants (from corpus)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Tags                                                                          | Where Found (doc + clause)                                                                                                                                                                                                                                     | Used in Formula? | Notes                                                                                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------: | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Purchase Price / Consideration**                              | **Dragon:** Adjusted Purchase Price; Base Purchase Price; Estimated Purchase Price; Purchase Price; Purchase Price Escrow Amount. **Eleos:** Purchase Price; Estimated Purchase Price. **North:** Purchase Price; Estimated Purchase Price. **Skyrocket:** Purchase Price; Estimated Purchase Price; Purchase Price Proportionate Share; Final Consideration Statement; Consideration Statement. **Simply Solventless:** Equity Consideration; Patent Consideration; Contingent Consideration. **Vortex:** Aggregate Consideration; Cash Consideration. **KeyMe:** Aggregate Consideration Amount; Merger Consideration; Total Merger Consideration; Total Consideration.                                                                                                                                                                                                                                                                                                                                                                         | Purchase Price / Consideration; Financial statements constructs               | **Dragon:** "Purchase Price has the meaning… Section 2.2" (Definition). **Skyrocket:** "Purchase Price has the meaning… Section 2.2". **Vortex:** "Aggregate Consideration means…" (Definitions). **KeyMe:** "Aggregate Consideration Amount… Section 3.4(a)". |                Y | This bucket is where "who bears what" gets encoded (cash/debt/NWC adjustments, escrow funding, earn-out allocation).                   |
| **Enterprise Value / Subscription constructs**                  | **Skyrocket:** Established Enterprise Value; Enterprise Value; Ares Aggregate Subscription Price; CDPQ Aggregate Subscription Price; Ares Proportionate Subscription Price; CDPQ Proportionate Subscription Price; Purchase Closing Time; Subscription Closing Time; Purchase Price Proportionate Share. **KeyMe:** Minority Interest Amount.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Purchase Price / Consideration; Measurement constructs                        | **Skyrocket:** Enterprise value + subscription pricing defined in Definitions and used in Consideration Statement mechanics.                                                                                                                                   |                Y | Common in sponsor / consortium structures: enterprise value "headline," then allocations by subscription proportions.                  |
| **Cash**                                                        | **Dragon:** Cash and Cash Equivalents; Closing Cash; Estimated Cash. **Eleos:** Cash; Estimated Closing Cash. **North:** Cash; Actual Closing Cash. **Skyrocket:** Cash; Restricted Cash. **Simply Solventless:** Cash; Cash Target; Cash Adjustment Amount. **KeyMe:** Cash; Closing Cash; Company Closing Cash.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Cash; Measurement constructs                                                  | **Simply Solventless:** "Cash Target has the meaning… Section 2.03(1)" and "Cash Adjustment Amount… Section 2.03(2)." (Definitions). **Dragon:** Cash and Cash Equivalents defined in Definitions and used in Estimated Purchase Price.                        |                Y | Biggest driver of "cash-to-close." Drafting often fights about: restricted/trapped cash, overdrafts, and checks in transit.            |
| **Indebtedness / Debt**                                         | **Dragon:** Indebtedness; Company Indebtedness; Closing Company Indebtedness; Estimated Company Indebtedness; Payoff Indebtedness; Debt Payoff Letters. **Eleos:** Actual Closing Indebtedness; Estimated Closing Indebtedness; Retained Indebtedness. **North:** Actual Closing Indebtedness; Estimated Closing Indebtedness; Indebtedness. **Skyrocket:** Debt; Intercompany Payable Debt; Intercompany Receivable Debt. **Simply Solventless:** Indebtedness. **Vortex:** External Debt Repayment Amount; External Debt Pay Off Letter; External Debt Release Documentation. **KeyMe:** Borrowed Money Indebtedness; Payoff Debt.                                                                                                                                                                                                                                                                                                                                                                                                              | Indebtedness / Debt; Measurement constructs                                   | **Dragon:** Indebtedness defined in Definitions and used in closing adjustment. **KeyMe:** Borrowed Money Indebtedness… "Section 3.4(c)." **Vortex:** External Debt Repayment Amount defined and paid at closing.                                              |                Y | "Debt-like" scope and anti-double-counting are the economic battleground.                                                              |
| **Net Debt**                                                    | **Skyrocket:** Net Debt; Estimated Net Debt; Final Net Debt; Draft Net Debt Statement; Estimated Net Debt Statement; Final Net Debt Statement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Indebtedness / Debt; Cash; Financial statements constructs                    | **Skyrocket:** Net Debt package defined and measured through Draft/Estimated/Final statements.                                                                                                                                                                 |                Y | Net Debt is the "compression" of Cash and Debt. Drafting must prevent moving items between Cash/Debt/Working Capital.                  |
| **Working Capital / Net Working Capital**                       | **Dragon:** Working Capital; Closing Working Capital; Estimated Working Capital; Target Working Capital. **Eleos:** Working Capital; Actual Closing Working Capital; Estimated Closing Working Capital; Target Closing Working Capital. **North:** Working Capital; Actual Closing Working Capital; Target Closing Working Capital. **Skyrocket:** Working Capital; Final Working Capital; Target Working Capital; Draft Working Capital Statement; Estimated Working Capital Statement; Final Working Capital Statement. **Simply Solventless:** Net Working Capital; Net Working Capital Target. **KeyMe:** Closing Net Working Capital Amount; Estimated Net Working Capital Amount; Target Net Working Capital Amount.                                                                                                                                                                                                                                                                                                                        | Working Capital / NWC; Financial statements constructs                        | **Simply Solventless:** "Net Working Capital… sum of: (i) Cash…" (Definitions) + "Net Working Capital Target… Section 2.03(1)." **KeyMe:** NWC amounts set forth in Section 3.4(d) etc.                                                                        |                Y | Most frequent post-closing dispute area. The hierarchy (GAAP vs consistency vs examples) matters more than the definition headline.    |
| **Transaction Expenses**                                        | **Dragon:** Transaction Expenses; Closing Transaction Expenses; Estimated Transaction Expenses. **Eleos:** Unpaid Transaction Expenses; Actual Unpaid Transaction Expenses; Estimated Unpaid Transaction Expenses; Transaction Expenses of the Purchased Entities; Transaction Expenses of the Vendors. **North:** Transaction Expenses; Actual Transaction Expenses; Estimated Closing Transaction Expenses. **Vortex:** Transaction Expenses; Transaction Expenses Schedule. **KeyMe:** Company Transaction Expenses.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Transaction Expenses; Taxes                                                   | **Eleos:** separate "Purchased Entities" vs "Vendors" transaction expense definitions. **KeyMe:** Company Transaction Expenses "Section 3.4(e)."                                                                                                               |                Y | Biggest double-count risk: (i) captured in Debt, (ii) captured in Working Capital, (iii) netted in Taxes.                              |
| **Taxes (definition + allocation constructs)**                  | **Dragon:** Tax; Taxes; Tax Act; Pre-Closing Tax Period; Transfer Taxes; Tax Return; Closing Tax Returns; Tax Refund; etc. **Eleos:** Taxes; Tax Returns; Pre-Closing Tax Period. **North:** Pre-Closing Tax Period; Transfer Taxes; Transaction Tax Benefit; Transaction Tax Deduction. **Skyrocket:** Taxes; Tax Authority; Tax Returns. **Simply Solventless:** Taxes; Tax Returns. **Vortex:** Employee Taxes; Tax Authority. **KeyMe:** Indemnified Taxes; Pre-Closing Taxes; Straddle Period; Tax Returns; Tax Proceeding.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Taxes; Working Capital; Transaction Expenses                                  | **KeyMe:** Straddle Period / Pre-Closing Taxes definitions (Section cross-refs). **Dragon:** broad "Tax" definition in Definitions.                                                                                                                            |                Y | Must coordinate: tax accruals inside working capital vs separate tax liability adjustment; withholding; transfer tax allocation; straddle methodology. |
| **Closing Accounts / Statements package**                       | **Dragon:** Closing Statement; Estimated Closing Statement; Estimated Statements; Financial Statements; Interim Financial Statements; Latest Balance Sheet; Latest Balance Sheet Date. **Eleos:** Closing Statements; Draft Closing Statements; Estimated Statements; Management Statements; Financial Statements; Interim Financial Statements; Interim Balance Sheet Date. **North:** Draft Statements; Estimated Statements; Final Statements; Financial Statements; Sample Statements. **Skyrocket:** Closing Balance Sheet; Final Closing Balance Sheet; Estimated Balance Sheet; Draft Statements; Estimated Statements; Final Statements; Illustrative Stratified Balance Sheet; Consideration Statement; Final Consideration Statement. **Simply Solventless:** Company Financial Statements; Patent Fiscal Statement; Patent Reverse Earnout Statement; Reverse Earnout Statement; Public Statement. **Vortex:** Financial Statements. **KeyMe:** Company Closing Statement; Estimated Closing Statement; Estimated Closing Certificate. | Financial statements constructs; Accounting hierarchy                         | **Dragon:** Closing Statement defined in Definitions and used for adjustment mechanics. **Skyrocket:** multiple "statement" deliverables (Net Debt, WC, Consideration).                                                                                        |                Y | The _procedural_ definitions (what statement, when, whose prep, what standard) drive disputes more than the pure "definition" of cash/debt.            |
| **Accounting Principles / Hierarchy / Methodology**             | **Dragon:** Accounting Standards; GAAP. **North:** Sample Statements (methodology tie). **Skyrocket:** Illustrative Stratified Balance Sheet. **Simply Solventless:** Public Statement (measurement basis). **Eleos:** Management Statements. **KeyMe:** Accounting Principles; Company Accounting Principles. Plus internal: Agreed Accounting Principles + Sample Accounting Principles (KPMG comments).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Accounting standards / hierarchy; Anti-double-count                           | **KeyMe:** "Accounting Principles… Section 3.4(g)" and "Company Accounting Principles… Section 3.4(h)." Internal: agreed/sample accounting principles docs.                                                                                                    |                Y | Must specify: GAAP/IFRS baseline, consistency with past practice, examples override, no hindsight, no reclass games, and no duplication.               |
| **Cut-off Times / Measurement Times**                           | **Dragon:** Calculation Time. **Eleos:** Effective Time. **North:** Calculation Time. **Skyrocket:** Closing Time; Purchase Closing Time; Subscription Closing Time. **Simply Solventless:** Closing Time. **KeyMe:** Reference Time.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Measurement constructs; Financial statements constructs                       | **Dragon:** "Calculation Time means 11:59 p.m. on the day immediately prior to Closing Date…" (Definition). **KeyMe:** "Reference Time means 11:59 p.m. ET on the Business Day immediately preceding Closing Date…"                                            |                Y | The cut-off defines what belongs "to Seller" vs "to Buyer." Needs to match bank cutoffs, AP/AR cutoffs, and period-end accruals used by FDD.           |
| **Escrows / Holdbacks / Reserves**                              | **Dragon:** Purchase Price Escrow Amount; Escrow Agreement; Escrow Agent. **Eleos:** Adjustment Escrow Account; Adjustment Escrow Amount; Indemnity Escrow Account; Indemnity Escrow Amount; Indemnity Escrow Release Date; Escrow Agent; Escrow Agreement. **Skyrocket:** Adjustment Escrow Amount; Adjustment Escrow Fund; Escrow Agent; Escrow Agreement. **KeyMe:** Escrow Amount; Indemnity Escrow Amount; Escrow Account; Escrow Agent; Escrow Agreement; Escrow Termination Date; Reserve Account; Reserve Amount. **Simply Solventless:** Escrow Agreement.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Escrows / holdbacks; Purchase Price                                           | **Eleos:** separate Adjustment vs Indemnity escrow constructs (Definitions). **Dragon:** Purchase Price escrow amount defined (Definitions) and funded at Closing.                                                                                             |                Y | Market: separate **adjustment escrow** (short horizon) from **indemnity escrow** (longer) or replace indemnity escrow with RWI + retention.            |
| **Earn-outs / Contingent Consideration / Reverse earnout**      | **North:** Interac Earn-Out Amount; PPJV Earn-Out Amount. **Simply Solventless:** Contingent Consideration; Reverse Earnout Amount; Reverse Earnout Period; Reverse Earnout Statement; Reverse Earnout Note; Patent Reverse Earnout Amount/Period/Statement/Note.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Earn-outs; Financial statements constructs; Accounting hierarchy              | **North:** earn-out amounts defined (Definitions) and paid per schedule. **Simply Solventless:** reverse earnout package defined.                                                                                                                              |                Y | Market: high dispute risk unless metric definition + accounting policies + governance are locked down.                                 |
| **Equity Awards / Options / Warrants / Phantom equity**         | **KeyMe:** Cash-Out Options; Company Options; Company Warrants; In-the-Money Options; Out-of-the-Money Options; Non-Employee Options; Employee Options; Vested/Unvested Company Options; Option Consideration; Warrant Consideration; Paying Agent, Reserve Account (withholding/claims). **Vortex:** Option; Option Plan. **Simply Solventless:** SSC Warrant. **Eleos:** Phantom Equity Award Amount.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Purchase Price / consideration; Earn-outs (phantom); Cash-to-close allocation | **KeyMe:** "Cash-Out Options… Section 3.1(d)(i)" and "Out-of-the-Money Options… Section 3.1(d)(ii)." (Definitions)                                                                                                                                             |                Y | This is "consideration plumbing" — it drives cash required at closing, escrow reserves, and withholding.                               |
| **Locked Box / Leakage (incl ticker + leakage taxes/interest)** | **Vortex:** Locked Box Accounts; Locked Box Date; Locked Box Ticker Amount; Leakage; Known Leakage Amount; Leakage Adjustment Amount; Leakage Interest; Leakage Tax Adjustment; Leakage Tax Adjustment Refund; Purchaser Leakage Notice; Leakage Claim Period; Leakage Dispute Notice; Leakage Expert; Consideration Expert; Consideration Dispute Notice; Purchaser Leakage Notice.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Leakage / locked-box; Purchase Price; Taxes; Dispute constructs               | **Vortex:** Leakage/Locked Box definitions section and leakage dispute mechanics.                                                                                                                                                                              |                Y | Market (UK/Europe esp.): locked box replaces closing accounts; leakage + permitted leakage schedule + ticker are the economics.        |
| **R&W / W&I Insurance + D&O Tail (value-protection economics)** | **KeyMe:** R&W Insurance Policy; R&W Policy; R&W Insurer; R&W Policy Excess Amount; R&W Retention Amount; R&W Retention Escrow Amount. **North:** Representation and Warranty Policy. **Vortex:** W&I Insurance Costs; W&I Insurance Policy; W&I Insurer; Insurance Contract; Reinsurance Treaty; Fundamental Warranty Claim / PG Warranty Claim / Warranty Claim (claim scoping). **Eleos:** D&O Tail Policy. **Simply Solventless:** D&O Tail Policy.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Escrows/holdbacks; Transaction Expenses; Value protection                     | **KeyMe:** R&W policy definitions are tied to escrow/retention mechanics. **Eleos/Solventless:** D&O Tail Policy definition sits in definitions and affects transaction expenses.                                                                              |                Y | Market: RWI often reduces/replace indemnity escrow; retention escrow defines cash tied up; premium allocation often negotiated as transaction expense. |

**Inventory coverage check**: Every financial/economic defined term extracted from the 7-SPA corpus falls into one of the 16 canonical buckets above (including "odd" but economically meaningful terms like **Reverse Earnout**, **Intercompany Debt**, **Restricted Cash**, **W&I retention escrow**, etc.).

---

## Part 2: Best-Practice Sheets

Below are **Best-Practice Sheets for each canonical term**. They are written in **plain-English**, but the **Counsel questions / Rebuttals / Minimal edits** are in SPA-style language.

---

### 1) Purchase Price / Consideration

#### Plain-English Meaning

This is the "headline" economics bucket: it defines **what the Buyer pays**, **how it's split** (cash vs equity, seller vs optionholders), and **what can change post-closing** (adjustments, escrows, earn-outs). In FDD cash-to-close, this is the outer wrapper around net debt, working capital, expenses, taxes, and escrow funding.

#### Market Practice Patterns (Web + Corpus)

**Typical ("market")**

- **Cash-free / debt-free** pricing with either (i) **closing accounts true-up** (cash/debt/NWC), or (ii) **locked box** (price fixed at locked-box date + leakage/ticker).
  **Economic effect:** shifts value drift risk between signing and closing.
- Consideration defined as **Base/Enterprise Value** and then adjusted by **Cash (+), Indebtedness (–), NWC deviation (+/–), Transaction Expenses (–)**.

**Buyer-leaning**

- Broad adjustment inputs (more items in debt/expenses), and **tight seller review windows** + buyer-prepared statement default.
- Allow **set-off** (indemnity/earn-out/escrow netting) against price payments.

**Seller-leaning**

- Price is **fixed** (locked box) with **narrow leakage** definition + clear permitted leakage schedule; or in closing-accounts deals: **tight GAAP/past practice hierarchy** with examples overriding.
- Seller-prepared closing statement with buyer audit rights but **no reclassification / no hindsight**.

#### SPA Evidence (2–4 excerpts)

- **Project Dragon (Purchase Price)**: "_'Purchase Price' has the meaning specified in Section 2.2_ …" (Definitions; points you to pricing clause).
- **Project Skyrocket (Purchase Price)**: "_'Purchase Price' has the meaning specified in Section 2.2_ …" (Definitions).
- **Vortex (Aggregate Consideration)**: "_'Aggregate Consideration' means …_" (Definitions; locked-box style wrapper).
- **Simply Solventless (Equity Consideration)**: "_'Equity Consideration' means …_" (Definitions; mixed consideration structure).

#### Pitfalls + Red Flags

- Consideration clause references **don't align** with defined terms (e.g., "Closing Cash" defined but the formula uses "Cash").
- Escrow funding is "inside" the purchase price in some places and "in addition" elsewhere (double charge).
- No explicit "**without duplication**" in the adjustment formula → sellers get hit twice (e.g., a liability counted in both debt and working capital).

#### Counsel Questions (SPA-style)

- "Please confirm the Purchase Price is intended to be **cash-free, debt-free** and that all adjustment inputs are **without duplication**."
- "Where a Transaction Expense is also an Indebtedness item, please clarify **which definition governs** to avoid double counting."

#### Rebuttals (SPA-style)

- "Seller cannot accept a construct that permits **double recovery** through overlapping definitions; the adjustment must be **without duplication**."

#### Minimal Edits (focused)

- Add anti-double count at the formula level:
  **insert**: "_… in each case, **without duplication**._"

---

### 2) Enterprise Value / Subscription Constructs (consortium / co-invest)

#### Plain-English Meaning

These terms allocate economics between purchaser parties (or between purchase and subscription legs). They drive **who funds what at closing** and can quietly change implied equity value if "Enterprise Value" is defined inconsistently with cash/debt adjustments.

#### Market Practice Patterns

**Typical**

- "Enterprise Value" stated as headline and then **converted** into equity value using net debt / working capital adjustments.

**Buyer-leaning**

- Subscription price allocation uses **buyer-favorable rounding / cap / waterfall** mechanics.

**Seller-leaning**

- Clear proportionality + no ability for one sponsor to shift costs to another leg.

#### SPA Evidence

- **Skyrocket (Established Enterprise Value)**: "_'Established Enterprise Value' means …_" (Definitions).
- **Skyrocket (Ares Aggregate Subscription Price)**: "_… total aggregate subscription price …_" (Definitions).
- **Skyrocket (Purchase Price Proportionate Share)**: "_… proportionate share …_" (Definitions).

#### Pitfalls

- "Enterprise Value" defined net of items already also adjusted elsewhere → silent double counting.
- Subscription closing time differs from purchase closing time → who owns cash movements for the gap?

#### Counsel Questions

- "Please confirm Enterprise Value is a **headline** only and all adjustments are captured **once** through Net Debt and Working Capital."

#### Minimal Edits

- **insert** into EV definition: "_… for greater certainty, Enterprise Value is **not** adjusted for Cash, Indebtedness, Working Capital or Transaction Expenses except as expressly set out in Section [●]._"

---

### 3) Cash (Cash and Cash Equivalents; Closing/Estimated; Cash Target)

#### Plain-English Meaning

Cash definitions decide whether cash is a **seller-retained benefit** (cash-free deal) or a **buyer-acquired asset** (cash included). In cash-free/debt-free deals, "Cash" is almost always a **purchase price adjustment input**.

#### Market Practice Patterns

**Typical**

- "Cash and Cash Equivalents" = cash on hand + bank balances + short-term highly liquid investments, **net of outstanding checks** (and sometimes **plus deposits in transit**).
- Cut-off tied to a defined **Calculation Time / Reference Time / Closing Time**.

**Buyer-leaning**

- Exclude **restricted/trapped cash**; include bank overdrafts as **negative cash** (or in indebtedness).
- Tight "cash equivalents" definition (e.g., maturity ≤ 90 days).

**Seller-leaning**

- Include restricted cash if it remains in business; treat overdrafts as **debt** (so it reduces price only once).
- Ensure **checks issued but not cleared** reduce cash (seller-friendly if they were issued pre-close).

#### SPA Evidence

- **Project Dragon (Cash and Cash Equivalents)**: includes "_less issued but uncleared checks…_" (Definitions).
- **Project Eleos (Cash)**: "_all cash… deposits… marketable securities… without duplication_" (Definitions).
- **Simply Solventless (Cash)**: includes "_minus outstanding checks… plus deposits in transit_" (Definitions).
- **Skyrocket (Restricted Cash)**: "_Cash that is not freely available… due to… restrictions_" (Definitions).

#### Pitfalls + Red Flags

- **Restricted Cash** not addressed: buyer pays for cash it can't access.
- Overdraft treatment unclear → can be in Cash and also in Debt.
- Cash is included inside "Net Working Capital" (see Simply Solventless NWC definition) **and** adjusted separately → classic double count risk.

#### Counsel Questions

- "Is Restricted Cash intended to be included in Cash for purposes of the adjustment? If yes, please confirm it is **not** also treated as Working Capital."
- "Please specify treatment of overdrafts and negative cash balances."

#### Rebuttals

- "Seller cannot accept exclusion of operationally required restricted cash unless the corresponding liability or restriction is also excluded from Debt/Working Capital to avoid asymmetric treatment."

#### Minimal Edits

- Add restricted cash clarity:
  **[Add]** "_Cash shall **exclude Restricted Cash**._"
  or
  **[Add]** "_Restricted Cash shall be included in Cash **only to the extent** it is freely transferable to Buyer at Closing._"
- Add overdraft placement:
  **[Add]** "_For certainty, bank overdrafts shall be treated as **Indebtedness** and not as negative Cash._"

---

### 4) Indebtedness / Debt (incl debt-like + payoff items)

#### Plain-English Meaning

Debt definitions decide what gets treated as a **seller-funded liability** that reduces equity value. In FDD models, this is where "debt-like items" live (leases, accrued interest, letters of credit, unpaid taxes, transaction expenses, etc.).

#### Market Practice Patterns

**Typical**

- Broad "Indebtedness" including borrowed money + accrued interest + guarantees + capital leases/lease liabilities + breakage fees, often "**regardless of whether due**."
- Explicit attempt to prevent **double counting** (not always successful).

**Buyer-leaning**

- Include **all debt-like items** and include **transaction expenses** (or make them debt-like), plus all change-of-control and bonuses.
- Treat overdrafts and cash management liabilities as indebtedness.

**Seller-leaning**

- Narrow to true third-party funded debt; exclude ordinary-course accruals already in working capital.
- Put transaction expenses in a separate bucket (Transaction Expenses), not Debt.

#### SPA Evidence

- **KeyMe (Borrowed Money Indebtedness)**: "_… meaning set forth in Section 3.4(c)_" (Definitions).
- **Skyrocket (Debt)**: "_Debt means… including Intercompany Payable Debt…_" (Definitions).
- **Eleos (Retained Indebtedness)**: separate retained vs transferred debt (Definitions).
- **Vortex (External Debt Repayment Amount)**: defined closing payoff concept (Definitions).

#### Pitfalls + Red Flags

- "Indebtedness" overlaps with "Transaction Expenses" and "Taxes" with no "without duplication."
- Intercompany balances: are they settled pre-close? If not, do they hit price?
- "Payoff" documents not aligned to definition (debt defined broadly but payoff letter list narrow).

#### Counsel Questions

- "Please confirm Indebtedness excludes any item included in Working Capital or Transaction Expenses **without duplication**."
- "Please provide a schedule of all items included in Indebtedness and reconcile to the latest trial balance."

#### Minimal Edits

- Add anti-duplication at definition tail:
  **[Add]** "_… **excluding** any amounts to the extent included in Net Working Capital or Transaction Expenses, **without duplication**._"

---

### 5) Net Debt (and Net Debt Statement)

#### Plain-English Meaning

Net Debt compresses cash and debt into one "net" number. It's convenient, but it can hide classification games.

#### Market Practice Patterns

**Typical**

- Net Debt = **Indebtedness – Cash** (or sometimes the reverse sign), measured at a defined time, prepared as a statement with dispute mechanics.

**Buyer-leaning**

- Buyer controls classification; seller burden to dispute.

**Seller-leaning**

- Detailed statement template + examples; neutral accountant review; no reclass/hindsight.

#### SPA Evidence

- **Skyrocket (Net Debt + statements)**: "_'Net Debt' means …_" plus Draft/Estimated/Final Net Debt Statements (Definitions).

#### Pitfalls

- Net Debt statement uses Accounting Principles different from Working Capital statement → results drift.
- Items move between Net Debt and Working Capital.

#### Counsel Questions

- "Please confirm Net Debt and Working Capital are prepared using the **same Accounting Principles hierarchy** and **no reclassification** between categories."

#### Minimal Edits

- **[Add]** to Net Debt definition: "_… prepared consistently with the Working Capital Statement and **without reclassification** between Net Debt and Working Capital categories._"

---

### 6) Working Capital / Net Working Capital (incl targets/pegs)

#### Plain-English Meaning

Working Capital definitions protect the buyer from buying a business with too little "operating liquidity" at close — or protect the seller from being forced to "overfund" working capital above normal levels. It's the core "value protection" input in most closing-accounts deals.

#### Market Practice Patterns

**Typical**

- Working capital defined as **current assets minus current liabilities**, often **excluding** cash, debt, and income-tax related items, and measured consistent with past practice / GAAP with examples.
- A negotiated **Target** (peg) derived from normalized working capital in QoE/FDD.

**Buyer-leaning**

- Broader "current liabilities" (include accruals, reserves, deferred revenue), tighter "current assets" (haircut A/R, exclude slow inventory).
- Include more "debt-like" accruals here too (risking overlap).

**Seller-leaning**

- Measurement "consistent with past practice" and explicit examples that override GAAP; exclude unusual one-offs and post-close synergies.

#### SPA Evidence

- **Project Dragon (Working Capital)**: "_Working Capital means … current assets … current liabilities…_" (Definitions).
- **KeyMe (Closing/Estimated/Target Net Working Capital Amount)**: each "_has the meaning set forth in Section 3.4(d/e/f)_" (Definitions).
- **Simply Solventless (Net Working Capital)**: includes "_sum of: (i) Cash…_" (Definitions) — notable because cash is inside NWC.
- **Skyrocket (Target Working Capital + Working Capital Statements)**: Draft/Estimated/Final Working Capital Statement construct (Definitions).

#### Pitfalls + Red Flags

- **Cash embedded in NWC** plus separate cash adjustment → double count.
- "Current" definitions not aligned with accounting policies (e.g., deferred revenue treated inconsistently).
- Missing **no-duplication** across debt/expenses/taxes.
- Targets are defined but not tied to a **statement template** → dispute magnet.

#### Counsel Questions

- "Please confirm Working Capital excludes Cash, Indebtedness, and Transaction Expenses, **without duplication**."
- "Please provide the working capital methodology / sample statement referenced in the agreement and confirm it overrides GAAP where inconsistent."

#### Minimal Edits

- Add explicit exclusions:
  **[Add]** "_… excluding Cash, Indebtedness, Taxes and Transaction Expenses, in each case **without duplication**._"
- If cash is wrongly in NWC (seller-friendly but risky):
  **[Delete]** "_(i) Cash;_" from the NWC definition **or**
  **[Add]** "_For certainty, Cash included in Net Working Capital shall be **excluded** from the Cash Adjustment Amount._"

---

### 7) Transaction Expenses (incl unpaid, change-of-control, payroll taxes)

#### Plain-English Meaning

Transaction Expenses decide which deal costs reduce equity value at closing (seller pays) versus remain with buyer. In cash-to-close, this is often **a direct reduction** to purchase price or funded through escrow/payoff.

#### Market Practice Patterns

**Typical**

- Definition includes banker, legal, accounting, diligence, financing fees, success fees, and **change-of-control/retention/severance** obligations, often limited to unpaid amounts as of closing.
- Sometimes split between seller-side and company-side. (You have this split in Eleos.)

**Buyer-leaning**

- Include **all** change-of-control and bonus obligations and employer payroll taxes; include RWI premium as expense.
- Treat unpaid expenses as debt-like and subtract from price at closing.

**Seller-leaning**

- Limit to third-party professional fees actually invoiced or accrued; exclude ordinary-course compensation accruals already in working capital.

#### SPA Evidence

- **Project Eleos**: "_Transaction Expenses of the Purchased Entities…_" vs "_…of the Vendors…_" (Definitions).
- **KeyMe (Company Transaction Expenses)**: "_… meaning set forth in Section 3.4(e)_" (Definitions).
- **Vortex (Transaction Expenses Schedule)**: schedule-driven definition approach.
- **Project Dragon (Transaction Expenses)**: broad deal-cost capture (Definitions).

#### Pitfalls

- Same cost counted in (i) Transaction Expenses, (ii) Indebtedness, and (iii) Working Capital accruals.
- Payroll tax on bonuses not specified → surprise deduction.
- "Unpaid" timing ambiguous (invoice date vs service date vs accrual).

#### Counsel Questions

- "Please confirm Transaction Expenses exclude amounts included in Working Capital or Indebtedness, **without duplication**."
- "Are retention bonuses/severance intended to be Seller costs? If yes, confirm employer payroll taxes are included."

#### Minimal Edits

- **[Add]** "_… including employer payroll Taxes arising from any change-of-control payments, in each case, to the extent unpaid as of the Calculation Time._"
- **[Add]** "_… excluding any amounts to the extent accrued as Current Liabilities in Working Capital, without duplication._"

---

### 8) Taxes (definition + allocation: pre-closing, straddle, withholding, transfer taxes)

#### Plain-English Meaning

Taxes definitions define what "Taxes" include (income, sales, payroll, VAT/GST, withholding, etc.) and how pre-closing and straddle period taxes are borne. For cash-to-close, the big risks are **unpaid taxes**, **withholding**, and **double counting** between tax accruals and working capital.

#### Market Practice Patterns

**Typical**

- "Taxes" is defined broadly ("including any interest, penalties, additions") and then allocation mechanics handle (i) pre-closing, (ii) straddle proration, and (iii) transfer taxes. Model forms and law firm guidance show this structure.
- Straddle allocation often uses **closing-of-the-books** for income taxes and **time/apportionment** for non-income.

**Buyer-leaning**

- Broad pre-closing tax indemnity; buyer controls filings; expansive withholding gross-up limitations.

**Seller-leaning**

- Tight indemnity; seller participation rights; clear tax refund ownership and process.

#### SPA Evidence

- **Project Dragon (Tax definition)**: broad "Tax… interest, penalties…" style definition (Definitions).
- **KeyMe (Straddle Period / Pre-Closing Taxes / Indemnified Taxes)**: multiple tax allocation constructs defined by section cross-refs.
- **Vortex (Employee Taxes)**: employee/payroll tax bucket defined (Definitions).
- **Skyrocket (Tax Authority / Tax Returns / Taxes)**: standard broad definitions.

#### Pitfalls

- Taxes included in working capital and also separately indemnified or adjusted.
- Transfer taxes not allocated clearly (buyer vs seller vs split).
- Withholding mechanics conflict with purchase price definitions.

#### Counsel Questions

- "Please confirm whether Taxes accrued in Working Capital will also be included in any tax indemnity or adjustment (Seller proposes **no duplication**)."
- "Please specify the method for Straddle Period allocation for income vs non-income Taxes."

#### Minimal Edits

- **[Add]** anti-duplication: "_… provided that Taxes shall not be counted more than once through Working Capital, Indebtedness, or any Tax adjustment, without duplication._"

---

### 9) Closing Accounts / Statements Package (Closing Statement, Estimated, Draft/Final)

#### Plain-English Meaning

These definitions control **who prepares** the numbers, **what gets delivered**, **when disputes happen**, and **what standard** governs. This is where purchase price disputes live.

#### Market Practice Patterns

**Typical**

- Buyer prepares "Estimated" at closing; post-closing "Closing Statement" prepared with a timeline; seller has an objection window; unresolved items go to independent accountant; standard is the **agreed accounting principles** and the definitions (no new policies).

**Buyer-leaning**

- Buyer-prepared statement deemed final if seller misses deadlines; limited access rights.

**Seller-leaning**

- Seller access to workpapers/books; examples override GAAP; neutral accountant limited to disputed line items; no hindsight.

#### SPA Evidence

- **KeyMe (Company Closing Statement; Estimated Closing Statement; Estimated Closing Certificate)**: defined by Section 3.4 references.
- **Project Dragon (Closing Statement; Estimated Closing Statement)**: statement definitions used in adjustment process.
- **Skyrocket (Consideration Statement; Final Consideration Statement; Closing Balance Sheet)**: multi-statement approach.
- **Eleos (Closing Statements; Draft Closing Statements; Management Statements)**: multiple statement types defined.

#### Pitfalls

- No priority order between GAAP, past practice, examples.
- Independent accountant scope unclear (can they re-open undisputed line items?).
- Timing conflicts with cut-off definitions.

#### Counsel Questions

- "Please specify the hierarchy: examples/templates override GAAP and past practice, and the accountant is limited to disputed items."
- "Confirm no 'hindsight' adjustments and consistent classification."

#### Minimal Edits

- **[Add]** "_The Independent Accountant shall be instructed to resolve only the matters in dispute and shall not address any other items._"
- **[Add]** "_… and shall apply the Accounting Principles and the agreed methodologies, consistently and without hindsight._"

---

### 10) Accounting Principles / GAAP Hierarchy / Methodology

#### Plain-English Meaning

This tells everyone **how** to calculate the closing accounts: GAAP/IFRS baseline, plus "consistent with past practice," plus examples/schedules. It is the single biggest driver of post-closing adjustment disputes.

#### Market Practice Patterns

**Typical**

- "Accounting Principles" defined with a hierarchy, commonly:
  1. **Specific definitions and rules in the SPA**, then
  2. **Example statements / schedules**, then
  3. **Historical policies / past practice**, then
  4. GAAP/IFRS as a backstop.
     This is a known best practice to reduce disputes.

- "Without duplication" appears in multiple definitions, but the safest is to add it at the formula level.

**Buyer-leaning**

- Pure GAAP (or "GAAP consistently applied") without locking historical methods.

**Seller-leaning**

- "Consistent with past practice" + examples override GAAP, and no changes in classification.

#### SPA / Internal Evidence

- **KeyMe**: "Accounting Principles… Section 3.4(g)" and "Company Accounting Principles… Section 3.4(h)."
- **Project Dragon**: "Accounting Standards" / GAAP definitions.
- **Internal (Agreed Accounting Principles)**: explicitly references IFRS and a structured approach to preparation (internal baseline).
- **Internal (Sample Accounting Principles — KPMG comments)**: emphasizes consistent methodology and clarity (internal baseline).

#### Pitfalls

- No hierarchy → parties litigate GAAP vs past practice.
- Allowing buyer to change classification (moving accruals into debt).
- "No duplication" missing.

#### Counsel Questions

- "Please confirm the Accounting Principles provide a clear hierarchy and that examples override GAAP where inconsistent."
- "Please confirm classification consistency and no reclassifications between Cash/Debt/WC."

#### Minimal Edits

- **[Add]** hierarchy sentence: "_In the event of conflict, the order of priority shall be: (i) this Agreement, (ii) the illustrative schedules, (iii) past practice, and (iv) GAAP/IFRS._"

---

### 11) Cut-off Times (Calculation Time / Reference Time / Closing Time)

#### Plain-English Meaning

Cut-off time decides what activity is "pre-close" versus "post-close" for cash, debt, WC, expenses, and taxes.

#### Market Practice Patterns

**Typical**

- Defined as **11:59 p.m.** local time the day before closing (or immediately prior to Effective Time).

**Buyer-leaning**

- Earlier cut-off (captures more seller liabilities).

**Seller-leaning**

- Later cut-off + explicit bank cut-off treatment for cash in transit.

#### SPA Evidence

- **Project Dragon (Calculation Time)**: "_11:59 p.m. … day immediately prior to Closing Date…_" (Definitions).
- **KeyMe (Reference Time)**: "_11:59 p.m. ET … immediately preceding Closing Date…_" (Definitions).
- **Skyrocket (Purchase Closing Time / Subscription Closing Time)**: separate times for legs.

#### Pitfalls

- Different cut-off times for cash vs debt vs working capital.
- No treatment of deposits in transit / ACH cutoffs.

#### Counsel Questions

- "Confirm a single cut-off time applies to Cash, Debt, WC, Transaction Expenses, and Taxes."

#### Minimal Edits

- **[Add]** "_The Calculation Time shall be the uniform cut-off for all calculations under Article [●], including Cash, Indebtedness, Working Capital and Transaction Expenses._"

---

### 12) Escrows / Holdbacks / Reserves (adjustment escrow vs indemnity escrow)

#### Plain-English Meaning

Escrows decide what cash is **withheld** from sellers to secure (i) purchase price adjustments, and/or (ii) indemnity obligations (or RWI retention).

#### Market Practice Patterns

**Typical**

- **Separate adjustment escrow** (short-duration) from **indemnity escrow** (longer), or replace indemnity escrow with RWI + retention escrow.
- Escrow agreement defines release mechanics, interest, and dispute handling.

**Buyer-leaning**

- Larger escrow, longer duration, tighter release conditions; if RWI, push for seller to bear retention/exclusions.

**Seller-leaning**

- Smaller/no indemnity escrow with RWI; strict release dates; cap at escrow amount, shift risk to RWI where available.

#### SPA Evidence

- **Eleos:** defines **Adjustment Escrow Account/Amount** and separately **Indemnity Escrow Account/Amount** + release date.
- **Dragon:** **Purchase Price Escrow Amount** defined.
- **KeyMe:** Escrow Amount + Indemnity Escrow Amount + Reserve Account/Reserve Amount.
- **Skyrocket:** Adjustment Escrow Fund.

#### Pitfalls

- Escrow used both to fund adjustment and indemnity without clear priority.
- Interest on escrow not specified.
- Reserve account mechanics create "shadow escrow" without the same protections.

#### Counsel Questions

- "Please clarify whether the Adjustment Escrow is the **sole source** of recovery for the adjustment."
- "Please specify release timing and priority between adjustment and indemnity."

#### Minimal Edits

- **[Add]** "_The Adjustment Escrow Amount shall be used solely to satisfy the Purchase Price Adjustment and for no other purpose._"
- **[Add]** "_No set-off shall be permitted except against the applicable escrow fund._"

---

### 13) Earn-outs / Contingent Consideration / Reverse earnout

#### Plain-English Meaning

Earn-outs shift price risk to post-closing performance. Reverse earn-outs (as in Simply Solventless) flip the direction (buyer gets paid back if conditions aren't met).

#### Market Practice Patterns

**Typical**

- Clear metric definition + accounting rules + governance and dispute mechanism is essential; law firm guidance highlights earn-out litigation risk.

**Buyer-leaning**

- Broad operational control, limited seller info rights, broad offsets.

**Seller-leaning**

- Covenants limiting buyer actions that would depress earn-out, and detailed calculation examples.

#### SPA Evidence

- **North:** "Interac Earn-Out Amount" / "PPJV Earn-Out Amount" definitions.
- **Simply Solventless:** Reverse Earnout Amount + Period + Statement + Note package; plus separate Patent reverse earnout set.

#### Pitfalls

- Metric defined, but accounting rules not locked (GAAP changes or reclass).
- Earn-out can be "maxed" by accounting treatment rather than real performance.

#### Counsel Questions

- "Please specify calculation policies and confirm consistency with historical policies; no reclassifications."
- "Confirm the dispute expert is limited to calculation issues."

#### Minimal Edits

- **[Add]** "_The Earn-Out Statement shall be prepared in accordance with the Accounting Principles and consistent with past practice, and shall not reflect any purchase accounting adjustments._"

---

### 14) Equity Awards / Options / Warrants / Phantom equity

#### Plain-English Meaning

These terms define who gets what portion of the consideration and what cash is required at closing (e.g., cashing out in-the-money options), often including withholding and reserve mechanics.

#### Market Practice Patterns

**Typical**

- Options/warrants treated through a waterfall: in-the-money are cashed out; out-of-the-money cancel; paying agent handles payments; reserve for claims/withholding.

**Buyer-leaning**

- Broad reserve; longer retention; more withholding discretion.

**Seller-leaning**

- Transparent calculation; limited reserve; prompt release.

#### SPA Evidence

- **KeyMe:** "Cash-Out Options… Section 3.1(d)(i)" and "Out-of-the-Money Options… Section 3.1(d)(ii)."
- **Eleos:** Phantom Equity Award Amount definition.
- **Simply Solventless:** SSC Warrant (equity instrument).
- **Vortex:** Option / Option Plan.

#### Pitfalls

- "Cash-Out Options" gets swept into "Cash" definitions in drafting searches; ensure it's treated as **consideration allocation**, not cash adjustment.
- Reserve mechanics = hidden escrow without escrow protections.

#### Counsel Questions

- "Please confirm the Reserve Amount is limited to taxes/withholding and will be released on a stated schedule."
- "Confirm option payout is net of exercise price and withholding mechanics are clearly stated."

#### Minimal Edits

- **[Add]** "_The Reserve Amount shall be held solely to satisfy required withholding and shall be released to the applicable holders promptly after final determination of such withholding._"

---

### 15) Locked Box / Leakage (Vortex-style)

#### Plain-English Meaning

Locked-box deals fix price based on historic accounts. Buyer gets economic benefit from the locked-box date forward, so any value extracted ("leakage") must be refunded (often with interest/ticker).

#### Market Practice Patterns

**Typical**

- Locked box replaces closing accounts; leakage is prohibited except "permitted leakage," often scheduled, and buyer receives a **ticker** (interest-like) amount for time value.
- Leakage includes dividends, management fees, related-party payments, non-arm's-length transactions.

**Buyer-leaning**

- Broad leakage definition + long claim period + expert-friendly process.

**Seller-leaning**

- Narrow leakage definition; broad permitted leakage list; caps; clear knowledge qualifiers.

#### SPA Evidence (Vortex)

- **Leakage**: "_means … any payment or transfer of value…_" (Definitions).
- **Known Leakage Amount** + **Leakage Adjustment Amount** + **Leakage Interest**.
- **Locked Box Date / Accounts / Ticker Amount** defined.

#### Pitfalls

- Permitted leakage not exhaustively scheduled.
- Tax leakage and interest calculations unclear.
- Dispute definitions (Consideration Expert vs Leakage Expert) overlap.

#### Counsel Questions

- "Please provide a complete schedule of Permitted Leakage and confirm any leakage not listed is prohibited."
- "Confirm leakage is reimbursed with interest from the Locked Box Date."

#### Minimal Edits

- **[Add]** "_Permitted Leakage shall be limited to the items expressly set out in Schedule [●], and no other leakage shall be permitted._"

---

### 16) R&W / W&I Insurance + D&O Tail (and related claim scoping)

#### Plain-English Meaning

Insurance terms decide whether value protection comes from **seller indemnity** or from **insurance**, and whether cash is tied up in a **retention escrow**. D&O tail premiums also hit cash-to-close (often treated as a transaction expense).

#### Market Practice Patterns

**Typical**

- RWI replaces/reduces seller indemnity; a retention (deductible) applies and can be secured by escrow; premiums and broker fees allocated by negotiation.
- D&O tail policy is often required and paid as a deal cost. (Common in U.S./Canada practice; also appears in your corpus.)

**Buyer-leaning**

- Seller pays premium and funds retention escrow; broad definition of covered losses; seller still has residual indemnity.

**Seller-leaning**

- Buyer pays premium; seller liability limited to retention (or de minimis); no indemnity escrow.

#### SPA Evidence

- **KeyMe:** R&W insurance definitions include "R&W Retention Escrow Amount" and "R&W Policy Excess Amount."
- **North:** Representation and Warranty Policy (RWI).
- **Vortex:** W&I Insurance Costs/Policy/Insurer definitions (and claim categories).
- **Eleos / Simply Solventless:** D&O Tail Policy defined.

#### Pitfalls

- Insurance premium is also captured as "Transaction Expense" and also funded through escrow (double charge).
- Retention escrow release timing unclear.
- Warranty claim categories defined inconsistently with insurance policy scope.

#### Counsel Questions

- "Please confirm whether the W&I/R&W premium is included in Transaction Expenses and, if so, that it is not also deducted elsewhere."
- "Please specify the retention escrow release date and conditions."

#### Minimal Edits

- **[Add]** "_Any R&W/W&I premium included in Transaction Expenses shall not be deducted from the Purchase Price more than once, without duplication._"
- **[Add]** "_The Retention Escrow Amount shall be released on the earlier of (i) expiry of the applicable policy retention period and (ii) written confirmation from the insurer that no claims are pending._"

---

## Part 3: FDD Alignment Checklist

These are the highest-impact "value protection" alignment checks that consistently matter in cash-to-close modeling and dispute avoidance:

1. **One cut-off time** for Cash, Debt, WC, Expenses, Taxes.
2. **No duplication** in _the formula_ (not just buried in definitions).
3. **Accounting hierarchy**: SPA rules → examples/templates → past practice → GAAP/IFRS.
4. **Classification lock**: no shifting items between Cash/Debt/WC/Expenses post-close.
5. **Restricted cash and overdrafts** explicitly placed in exactly one bucket.
6. **Transaction expenses vs debt-like**: pick one home and exclude from the other.
7. **Tax accruals**: decide whether they live in WC or in a separate tax settlement; don't do both.
8. **Escrow segmentation**: adjustment escrow vs indemnity/RWI retention escrow; define priority and release.

---

## Part 4: Term Map by Agreement

### Project Skyrocket — Share Purchase Agreement

| Bucket                          | Defined term(s) (exact)                                                                  | Key definition / excerpt                                                                                                                                                                                    | Purchase price / process cross-ref                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Cut-off time                    | **"Closing Time"**                                                                       | "12:01 a.m. (Eastern time) on the Closing Date."                                                                                                                                                            | Used as the "as of" timestamp for Net Debt / Working Capital calculations                              |
| Cash                            | **"Cash"**                                                                               | Adjusts for uncleared checks (issued vs. received), excludes insurance premium funds held in trust, **includes** "Intercompany Receivable Debt," excludes "Restricted Cash."                                | Cash is a component of Net Debt (subtracted)                                                           |
| Debt / net debt                 | **"Net Debt"**                                                                           | "(i) the Debt; plus (ii) the Transaction Expenses; **minus (iii) Cash; and minus (iv) Unpaid Transaction Expenses** … calculated **without duplication**."                                                  | Base purchase price is adjusted by "Purchase Price Adjustment" (working capital + net debt components) |
| Working capital                 | **"Working Capital"**; **"Target Working Capital"**                                      | "Working Capital" = current assets (excluding Cash) + current liabilities, determined per "Closing Balance Sheet Principles." Target is **$10,127,674**.                                                    | Purchase price adjustment: plus/minus (Working Capital – Target) and plus/minus Net Debt               |
| Accounting principles hierarchy | **"Closing Balance Sheet Principles"**                                                   | Prepared "in accordance with GAAP," consistent with the Latest Balance Sheet, and "otherwise consistent with the Sample Calculations," except as otherwise provided.                                        | Working Capital uses these principles by definition                                                    |
| Closing accounts process        | **"Closing Statement," "Dispute Notice," "Designated Accounting Firm," "Expert Report"** | Purchaser delivers Closing Statement within **60 days**; sellers have **30 days** to object; unresolved items go to "Designated Accounting Firm" whose report is "final and binding" absent manifest error. | Timing and binding effect are in the same closing adjustment section                                   |
| Escrow for adjustment           | **"Adjustment Escrow Amount"**                                                           | Buyer deposits "Adjustment Escrow Amount" at closing into escrow account (per escrow agreement).                                                                                                            | Escrow backs purchase price adjustment mechanics                                                       |

---

### Project North — Share Purchase Agreement (Bid Draft)

| Bucket                                   | Defined term(s) (exact)                                                  | Key definition / excerpt                                                                                                                                                                                           | Purchase price / process cross-ref                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Cut-off time                             | **"Calculation Time"**                                                   | "11:59 p.m. (Eastern Time) on the day immediately prior to the Closing Date."                                                                                                                                      | Working Capital measured "as at the Calculation Time" (Estimated/Draft/Final Statements)                   |
| Cash                                     | **"Cash"**                                                               | Cash & cash equivalents incl. balances/securities/investments and cheques in hand (except those that fail to clear). "For clarity, Cash shall not include any amounts included in Actual Closing Working Capital." | Purchase price formula includes "plus … Actual Closing Cash."                                              |
| Indebtedness                             | **"Indebtedness"**                                                       | Broad list including **unpaid income Taxes** and other liabilities (e.g., insurance premium liabilities).                                                                                                          | Purchase price formula includes "minus … Actual Closing Indebtedness."                                     |
| Working capital                          | **"Working Capital"**                                                    | Current assets (excl. cash/cash equivalents, tax assets, and intercompany receivables) minus current liabilities (excl. tax liabilities/deferred taxes and intercompany). Calculated per Accounting Principles.    | Purchase price formula: plus/minus over/under Target Closing Working Capital                               |
| Transaction expenses                     | **"Actual Transaction Expenses"**                                        | "Aggregate Transaction Expenses … immediately prior to the Closing as set out in the Final Statements."                                                                                                            | Purchase price formula: "minus … Actual Transaction Expenses."                                             |
| Earn-outs                                | **"Earn-Out Amount," "Interac Earn-Out Amount," "PPJV Earn-Out Amount"** | Earn-out amounts are explicit add-ons to the purchase price calculation.                                                                                                                                           | Included in purchase price formula alongside Cash/Indebtedness/Working Capital/Transaction Expenses        |
| Accounting principles / anti-duplication | (process clause)                                                         | Estimated/Draft/Final Statements prepared consistent with Financial Statements as modified by sample statements and "calculated in a manner to avoid a duplication of entries."                                    | Same clause governs all calculations used in the purchase price formula                                    |
| Closing accounts process                 | **"Estimated Statements," "Draft Statements," "Final Statements"**       | Estimated Statements due **≤3 business days pre-closing**; then Draft/Final statements and a dispute process; Final Statements "final and binding" (no appeal absent manifest error).                              | Payment of adjustment due within **3 business days** after Final Statements determination (up or down).    |
| R&W insurance                            | **"R&W Insurance Policy"**                                               | Defined as a reps & warranties insurance policy issued by a named carrier (policy details in a schedule).                                                                                                          | Deal-level risk allocation (interacts with escrow/indemnity, not necessarily the price adjustment formula) |

---

### Project Dragon — Draft SPA

| Bucket                   | Defined term(s) (exact)                                                          | Key definition / excerpt                                                                                                                                                                          | Purchase price / process cross-ref                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Adjustment mechanics     | **"Purchase Price Adjustment"**                                                  | Purchase Price reduced by "Purchase Price Adjustment" and then adjusted up/down based on the final Closing Statement vs. Estimated Closing Statement.                                             | Same section sets estimated vs. final adjustment payments (3 business days post-finalization).                      |
| Indebtedness             | **"Company Indebtedness"**                                                       | Detailed list: borrowings, overdrafts, accrued interest, obligations under capital leases, breakage costs, swap termination, guarantees, etc.                                                     | "Estimated Closing Statement" includes "Estimated Closing Indebtedness."                                            |
| Working capital          | **"Working Capital"**                                                            | "Current Assets … minus Current Liabilities … determined in accordance with GAAP, consistently applied" (with carve-outs).                                                                        | Appears in Estimated Closing Statement components                                                                   |
| Transaction expenses     | **"Transaction Expenses"**                                                       | Costs/fees/bonuses and other transaction-related obligations (including those unpaid at closing) other than those paid pre-closing, in connection with the deal and specified transactions.       | Included as a closing statement component (Estimated Closing Transaction Expenses).                                 |
| Taxes                    | **"Taxes"**                                                                      | Broad definition including any taxes, duties, assessments, withholding, etc., plus penalties/interest, and includes transferee liability or contractual tax indemnity obligations.                | Can affect working capital / indebtedness framing depending on the schedule and accounting policies (deal-specific) |
| Closing accounts process | **"Estimated Closing Statement," "Closing Statement," "Independent Accountant"** | Buyer prepares Closing Statement within **90 days**; seller disputes within **30 days**; unresolved disputes to "Independent Accountant" acting as expert, final & binding absent manifest error. | Specifies timing + binding dispute resolution for the adjustment                                                    |

---

### Project Eleos — Auction Draft SPA

| Bucket               | Defined term(s) (exact)                                                        | Key definition / excerpt                                                                                                                                                       | Purchase price / process cross-ref                                                                  |
| -------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Working capital      | **"Working Capital"**                                                          | "Current Assets … minus Current Liabilities … determined in accordance with the Accounting Principles."                                                                        | Used in Draft Closing Statements / Closing Statements dispute and post-closing adjustment mechanics |
| Cash                 | **"Actual Closing Cash"**                                                      | Defined as "Cash … as at immediately prior to the Closing."                                                                                                                    | Inputs into "Draft Closing Statements" and the escrow-backed adjustment process                     |
| Transaction expenses | **"Unpaid Transaction Expenses"; "Actual Unpaid Transaction Expenses"**        | Transaction expense amounts "incurred … and unpaid as at immediately prior to Closing," and "Actual" means as set out in the Closing Statements.                               | Included as a closing metric subject to dispute/independent accountant and settlement via escrow    |
| Indebtedness         | **"Indebtedness"**                                                             | Very broad indebtedness definition (borrowings, accrued amounts, guarantees, derivatives termination, etc.).                                                                   | Feeds the post-closing adjustment (implicitly via the Closing Statements)                           |
| Escrow               | **"Adjustment Escrow Amount"; "Adjustment Escrow Account"**                    | Adjustment escrow is used to settle the difference between Purchase Price and Estimated Purchase Price, with release instructions depending on which side is owed funds.       | Explicit escrow release waterfall under Section 2.7                                                 |
| Dispute process      | **"Draft Closing Statements"; "Closing Statements"; "Independent Accountant"** | Draft Closing Statements become final if no Dispute Notice; if disputed, Independent Accountant resolves; revised statements become final and binding (absent manifest error). | "Sole and exclusive method" for resolving Draft Closing Statement disputes (absent manifest error). |

---

### KeyMe — Merger Agreement

| Bucket                       | Defined term(s) (exact)                                             | Key definition / excerpt                                                                                                                                                                         | Purchase price / process cross-ref                                                      |
| ---------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Cash                         | **"Closing Cash"**                                                  | "Total cash and cash equivalents … calculated in accordance with the Accounting Principles."                                                                                                     | Component of "Closing Purchase Price" adjustment formula                                |
| Indebtedness                 | **"Closing Indebtedness"**                                          | "All Indebtedness … as of immediately prior to the Closing, calculated in accordance with the Accounting Principles."                                                                            | Subtracted in the purchase price adjustment                                             |
| Working capital              | **"Closing Net Working Capital"**                                   | Net working capital as of immediately prior to closing, calculated per Accounting Principles.                                                                                                    | Used as (Closing NWC − Target NWC) adjustment                                           |
| Accounting principles        | **"Company Accounting Principles"**                                 | Hierarchy: (i) GAAP, (ii) consistent with past practice, (iii) consistent with sample calculation / illustrative example, and then specific carve-outs including "Transaction-Related Expenses." | Applies to Closing Cash/Indebtedness/NWC computations                                   |
| Tax period concept           | **"Pre-Closing Tax Period"**                                        | Defines pre-closing tax periods and "straddle" periods through closing date/time.                                                                                                                | Tax allocation + interaction with closing statement computations (deal-specific)        |
| Closing statement & disputes | **"Closing Statement," "Dispute Notice," "Independent Accountant"** | Buyer delivers Closing Statement; seller can dispute; unresolved items to Independent Accountant as expert with binding determination.                                                           | Adjustment payment mechanics flow from the final determination of the Closing Statement |

---

### Simply Solventless — Publicly available SPA

| Bucket          | Defined term(s) (exact)                                 | Key definition / excerpt                                                                                                             | Purchase price / process cross-ref                                                        |
| --------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Cut-off time    | **"Closing Time"**                                      | "11:59 p.m. (New York time) on the day before the Closing Date."                                                                     | Used across Cash/Working Capital/Indebtedness definitions tied to Closing Time            |
| Cash            | **"Cash"**                                              | Cash and cash equivalents "as of the Closing Time."                                                                                  | Feeds "Adjustment Amount" and purchase price mechanics                                    |
| Cash adjustment | **"Target Cash"; "Adjustment Amount"**                  | "Adjustment Amount" = (Closing Cash − Target Cash) (can be positive/negative).                                                       | Purchase price is adjusted by "Adjustment Amount" (per purchase price section).           |
| Working capital | **"Net Working Capital"; "Target Net Working Capital"** | NWC is current assets minus current liabilities (with defined inclusions/exclusions) as of Closing Time; Target NWC is a set amount. | Impacts "Purchase Price Adjustment" alongside Cash and Indebtedness                       |
| Indebtedness    | **"Indebtedness"**                                      | Broad debt concept as of Closing Time with enumerated categories.                                                                    | Subtracted in purchase price adjustment and in settlement/payment mechanics               |
| Taxes           | **"Taxes"**                                             | Broad definition and tax-related concepts for the deal.                                                                              | Interacts with closing statement computations and indemnities depending on structure      |
| Dispute process | **"Independent Accounting Firm"**                       | Independent accounting firm resolves disputes; acts as expert; determination is final/binding (typical structure).                   | Used to finalize post-closing adjustment (and timing of payment).                         |
| Earn-out        | **"Reverse Earnout Amount"**                            | Separate contingent amount concept tied to post-closing performance / conditions (as defined).                                       | Earn-out is structurally separate from closing adjustment (but can interact in disputes). |

---

### Project Vortex — Share Purchase Agreement (Locked-box style economics)

| Bucket                                                | Defined term(s) (exact)           | Key definition / excerpt                                                                                                                                              | Purchase price / process cross-ref                                                               |
| ----------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Deal economics (locked box / consideration structure) | (consideration clause)            | Consideration includes: "Cash Consideration," pays off "External Debt," pays "Phantom Equity Amount," plus "Deferred Consideration" and potential "Earn-Out Payment." | Consideration clause governs payment mechanics rather than a classic completion accounts true-up |
| Leakage                                               | **"Leakage"**                     | Leakage includes numerous value transfers (dividends, distributions, fees, bonuses, related-party payments, etc.) and "excludes any Permitted Leakage."               | Covenant-style protection replaces post-close completion accounts (typical locked box)           |
| Leakage remedies                                      | (leakage covenant/remedy section) | Sellers must not cause Leakage; remedy includes reimbursement / claims mechanics (per the relevant clause).                                                           | Works as buyer protection in lieu of working capital true-up                                     |
| Accounting baseline                                   | **"Spanish GAAP"**                | Agreement references Spanish GAAP as the accounting framework (definition appears in definitions section).                                                            | Matters for Locked Box Accounts preparation and dispute framing                                  |

---

## Part 5: Web-Cited Negotiation Playbook

### How to Use This Playbook (Quick Workflow)

1. **Start with the purchase price formula**: cash +/–, debt –/+, working capital true-up, transaction expenses, taxes, earn-outs, escrows. ([WilmerHale][1])
2. **Lock the cut-off time** ("Calculation Time" / "Closing Time") before you debate inclusions/exclusions, or you'll argue forever about "when." ([Gibson Dunn][2])
3. **Write the accounting hierarchy** (GAAP vs past practice vs samples) like an "order of operations," then add an **anti-duplication** rule to prevent double counting across buckets. ([Gibson Dunn][2])

---

### Bucket A — Cash

**What "market" docs emphasize**

- Purchase price adjustments commonly treat the deal as "cash-free/debt-free" and then add/subtract cash depending on the negotiated structure. ([WilmerHale][1])
- Drafting disputes often arise from _definition detail_ (e.g., what counts as cash equivalents, whether to net uncleared checks/overdrafts, and whether restricted cash counts). ([Gibson Dunn][2])

**Negotiation levers**

- **Buyer-leaning**: exclude restricted/trapped cash; net "cash" against overdrafts or treat overdrafts as debt; exclude intercompany balances; tighten "cash equivalents" maturity/credit limits.
- **Seller-leaning**: include restricted cash (or include it unless it's truly unavailable); treat uncleared checks consistently (avoid double-netting with AR/AP); clarify that deal-expense funding loans aren't "debt."

**Drafting checklist**

- Define (i) **components** (cash, equivalents, deposits), (ii) **netting** (outstanding checks), and (iii) **location** (subsidiaries, controlled accounts, foreign cash). ([WilmerHale][1])
- Add explicit tie-in to Accounting Principles + sample calculation. ([Gibson Dunn][2])

---

### Bucket B — Indebtedness

**What the sources support**

- Standard "debt-free" constructs require a heavily negotiated indebtedness definition (financial debt + "debt-like items"). ([WilmerHale][1])
- Litigation/claims content stresses that ambiguity about what is "debt-like" (leases, accrued items, guarantees, derivatives breakage) is a repeat problem area. ([ACC Houston][3])

**Negotiation levers**

- **Buyer-leaning**: include accrued interest, breakage/termination costs, guarantee obligations, deferred consideration, and "debt-like" accruals tied to financing.
- **Seller-leaning**: exclude ordinary course trade payables (if included in working capital); exclude items already reserved in working capital; exclude earn-out-style contingent payments unless explicitly intended.

**Drafting checklist**

- Enumerate: borrowings, overdrafts, letters of credit/support, capital leases (and whether ASC 842/IFRS 16 changes matter), guarantees, derivatives breakage, unpaid financing fees. ([Global Private Equity Watch][4])
- Add cross-bucket anti-duplication ("no double counting with working capital / transaction expenses / taxes"). ([Gibson Dunn][2])

---

### Bucket C — Net Working Capital

**What "market" docs show**

- Working capital true-ups are a core mechanism in completion accounts deals; market studies track how often they appear and how they're constructed. ([srsacquiom.com][5])
- Practitioner guidance emphasizes that the main risk is **accounting-policy fights**, not math. ([Gibson Dunn][2])

**Negotiation levers**

- **Buyer-leaning**: tight accounting rulebook (GAAP + consistent past practice + detailed schedules), specific reserves (returns, rebates, obsolete inventory), conservative revenue recognition.
- **Seller-leaning**: simpler GAAP-based definition with fewer "one-off" reserves, more flexibility for consistent application, cap on downward adjustments, shorter survival of disputes.

**Drafting checklist**

- Set the **target** (peg) explicitly, and attach a sample working capital schedule (with line-item definitions). ([srsacquiom.com][5])
- Include a hierarchy: GAAP → consistent past practice → samples/schedules → agreed exceptions. ([Gibson Dunn][2])

---

### Bucket D — Transaction Expenses

**What the sources emphasize**

- Transaction expenses are commonly deducted (or treated as a debt-like item) to deliver a "clean" company at closing. ([WilmerHale][1])
- Disputes can arise from "which side pays success fees/bonuses" and whether they sit in debt vs working capital vs a separate line item. ([ACC Houston][3])

**Negotiation levers**

- **Buyer-leaning**: broad inclusion (banker fees, legal, accounting, bonuses, change-in-control payments, payroll taxes on bonuses).
- **Seller-leaning**: exclude ordinary-course costs; exclude post-closing integration spend; require that amounts be **incurred and unpaid** as of the cut-off, or explicitly listed.

**Drafting checklist**

- Be explicit about **timing** ("incurred and unpaid as of immediately prior to Closing") and **scope** (deal process + pre-closing reorgs). ([Gibson Dunn][2])

---

### Bucket E — Taxes

**What the sources emphasize**

- Tax provisions often include **straddle period** allocation rules and define "Taxes" broadly (including withholding, penalties, transferee liability, etc.). ([Troutman Pepper Locke][6])
- Model language commonly addresses withholding mechanics and pre-closing vs post-closing tax responsibility. ([Troutman Pepper Locke][6])

**Negotiation levers**

- **Buyer-leaning**: seller bears pre-closing taxes; strong cooperation and control over audits; escrow/indemnity backstop; treat unpaid taxes as indebtedness or a specific adjustment item.
- **Seller-leaning**: limit audit control; cap exposure; ensure taxes already reflected in working capital aren't re-charged; clear "final and binding" effect of closing statements where taxes are included.

**Drafting checklist**

- Decide _where taxes live_: (i) working capital, (ii) debt, (iii) a standalone tax true-up, or (iv) indemnity only—then write anti-duplication around it. ([Troutman Pepper Locke][6])
- Use a straddle allocation method (daily proration vs closing-of-the-books) and be consistent with the accounting cut-off time. ([Gibson Dunn][2])

---

### Bucket F — Accounting Principles Hierarchy

**What the sources emphasize**

- Dispute-focused materials stress that the **priority order** (GAAP vs past practice vs sample schedules) is one of the most important drafting choices. ([Gibson Dunn][2])
- Practitioner guidance encourages spelling out how conflicts are resolved rather than relying on vague "consistent with GAAP." ([WilmerHale][1])

**Negotiation levers**

- **Buyer-leaning**: "GAAP, consistently applied" + explicit agreed departures (reserves, classification, revenue recognition) + detailed example schedules.
- **Seller-leaning**: preserve historical practices; limit buyer's ability to introduce new policies post-closing; avoid bespoke one-off adjustments unless tied to the reference statements.

**Drafting checklist**

- Use an explicit hierarchy:
  1. specific agreement terms → 2) sample calculation/schedules → 3) consistent past practice → 4) GAAP baseline. ([Gibson Dunn][2])

---

### Bucket G — Anti-duplication

**Why it matters (and why sources care)**

- Multiple practitioner sources flag purchase price adjustment disputes stemming from items being counted in **more than one bucket** (e.g., treating a liability as both "debt" and "working capital"). ([ACC Houston][3])
- Guidance on PPA drafting often recommends an explicit anti-duplication principle. ([WilmerHale][1])

**Drafting checklist**

- Add a single sentence that applies to **all calculations**: "calculated in a manner to avoid duplication" and specify common overlaps: taxes, transaction expenses, intercompany items, cash netting. ([Gibson Dunn][2])

---

### Bucket H — Cut-off Time

**What the sources show**

- Deal documentation often pins "as of" measurements to a specific time (commonly end of day before closing or immediately prior to closing). ([Gibson Dunn][2])
- Locked-box structures instead fix economics at a **locked box date** and use leakage protections rather than a completion accounts true-up. ([EY][7])

**Drafting checklist**

- For completion accounts: define one reference timestamp for each metric (e.g., working capital "as of" reference time; cash "immediately prior"). ([Gibson Dunn][2])
- For locked box: define "Permitted Leakage" tightly and clarify remedies. ([EY][7])

---

### Bucket I — Closing Accounts Process

**What the sources emphasize**

- Practitioner guidance generally uses a structured process: estimated statement → post-close closing statement → dispute notice window → independent accountant as expert → final binding determination. ([WilmerHale][1])
- Dispute-focused sources stress that procedure and scope limits ("only disputed items") reduce litigation risk. ([ACC Houston][3])

**Drafting checklist**

- Include: deadlines, access rights (books/records), dispute notice requirements (line-item objections), independent accountant mandate (expert not arbitrator), cost allocation, and "final & binding / manifest error." ([Gibson Dunn][2])

---

### Bucket J — Escrow & RWI Retention

**What the sources show**

- Escrows remain common; empirical deal-term sources report on escrow prevalence/structure and related deal protections. ([srsacquiom.com][8])
- RWI market sources discuss retentions, claim dynamics, and how RWI can alter escrow size/duration (often shrinking "general indemnity" escrows).

**Negotiation levers**

- **Buyer-leaning**: larger escrow, longer duration, tighter release conditions; if RWI, push for seller to bear retention/exclusions.
- **Seller-leaning**: smaller escrow, faster release, cap at escrow amount, shift risk to RWI where available.

**Drafting checklist**

- If you have both escrow and RWI, clearly allocate: what is escrow-backed (purchase price adjustment vs special indemnities) vs what is RWI-backed (reps), plus priority of recoveries.

---

### Bucket K — Locked Box & Leakage

**What the sources emphasize**

- Locked box deals set price off accounts at a locked box date and protect the buyer by restricting leakage (and defining permitted leakage). ([EY][7])

**Negotiation levers**

- **Buyer-leaning**: broad leakage definition; narrow permitted leakage; strong seller covenant + indemnity for leakage; interest on locked box equity value at a buyer-favorable rate (if used).
- **Seller-leaning**: expansive permitted leakage schedule; materiality thresholds; caps; limit remedy to reimbursement (no consequential loss).

**Drafting checklist**

- Your leakage definition should list categories (fees, dividends, related-party value transfers) and then exclude permitted leakage by schedule. ([EY][7])

---

### Bucket L — Earn-outs

**What the sources tend to note**

- Deal commentary sources highlight earnouts as a tool when valuation gaps exist, but they're dispute-prone and need precise metric definitions and operational covenants. ([DLA Piper][9])
- Deal-term studies track earnout usage and typical structural patterns (frequency, form, and common design choices). ([srsacquiom.com][10])

**Negotiation levers**

- **Buyer-leaning**: tight performance definitions, discretion to run business, fewer "operational covenants," offset rights for indemnity/adjustments.
- **Seller-leaning**: stronger operation-in-the-ordinary-course covenants, information/audit rights, clear dispute resolution and acceleration/change-of-control protections.

**Drafting checklist**

- Define: (i) metric(s) and accounting basis, (ii) measurement periods, (iii) seller info/inspection rights, (iv) dispute process, (v) offset rules (and anti-duplication vs working capital/indemnity). ([ACC Houston][3])

---

## Sources

[1]: https://www.wilmerhale.com/en/insights/publications/20250210-purchase-price-adjustments-in-financial-services "WilmerHale - Purchase Price Adjustments in Financial Services"
[2]: https://www.gibsondunn.com/wp-content/uploads/2022/05/WebcastSlides-Managing-Purchase-Price-Adjustment-Disputes-10-MAY-2022.pdf "Gibson Dunn - Managing Purchase Price Adjustment Disputes"
[3]: https://acchouston.starchapter.com/images/03_Final_-_Bracewell_-_ACC_Houston_Symposium_PowerPoint_-_2024_8_15_10427049_1_.pdf "ACC Houston / Bracewell - Purchase Price Adjustment Symposium"
[4]: https://privateequity.weil.com/features/post-closing-purchase-price-adjustment/ "Global Private Equity Watch - Post-Closing Purchase Price Adjustment"
[5]: https://www.srsacquiom.com/our-insights/working-capital-adjustment-to-purchase-price/ "SRS Acquiom - Working Capital Adjustment to Purchase Price"
[6]: https://www.troutman.com/wp-content/uploads/2023/02/Tax-Provisions-in-MA-Transactions-09.21.22.pdf "Troutman Pepper Locke - Tax Provisions in M&A Transactions"
[7]: https://www.ey.com/en_gl/insights/law/locked-box-vs-completion-accounts "EY - Locked Box vs Completion Accounts"
[8]: https://www.srsacquiom.com/our-insights/ma-escrows-statistics/ "SRS Acquiom - M&A Escrows Statistics"
[9]: https://www.dlapiper.com/en/insights/publications/2022/07/four-ways-ma-deals-are-changing "DLA Piper - Four Ways M&A Deals Are Changing"
[10]: https://www.srsacquiom.com/our-insights/deal-terms-study-2024/ "SRS Acquiom - Deal Terms Study 2024"

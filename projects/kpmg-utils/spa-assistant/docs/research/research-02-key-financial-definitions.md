#### Indebtedness

**Typical inclusions:**

- **Borrowed money**
  - Revolver / term loans / notes / bonds (principal outstanding)
  - **Accrued interest** through closing (including “PIK” where relevant)
  - **Prepayment premiums / make‑whole / breakage** amounts triggered by repayment
  - **Unamortized debt issuance costs / OID / deferred financing fees** (sometimes as an add-on; sometimes netted in payoff)

- **Leases / financing-type obligations**
  - **Capital/finance lease liabilities** (incl. current + long-term portions)
  - Equipment financings that are recorded as leases in the accounting records

- **Derivatives / hedging / treasury**
  - Swap/hedge **termination amounts** (if triggered by the transaction/refinancing)
  - **Guarantees** of third-party debt (if they create a payment obligation at closing)

- **Cash management / “hidden debt”**
  - **Bank overdrafts** (depends on how “Cash” is defined—see double-count section)
  - **Cash pooling deficits** / notional pooling true-ups
  - **Factoring / receivables sales** where there’s recourse (or a deemed borrowing)
  - **Supply chain finance / reverse factoring** arrangements (where treated as financing)

- **Shareholder / related party**
  - Shareholder loans, related‑party notes, intercompany borrowings intended to be settled at close

- **Other common “debt-like” add-ons (deal dependent)**
  - Unpaid **declared dividends** (if any) or redemption obligations
  - Unfunded pension/retirement deficits (more common in Europe than Canada/US-style deals, but shows up)

**Buyer-favorable additions:**

- **Explicitly include**:
  - “**all accrued interest, fees, penalties, breakage, and make‑whole amounts** through the Effective Time”
  - “**unamortized debt issuance costs / deferred financing fees / OID** associated with Indebtedness”
  - “**cash pooling deficits** and any treasury true‑ups”
  - “**obligations under receivables monetization / factoring / supply chain finance** to the extent economically debt”
  - “**hedging termination payments** arising from repayment/refinancing”
  - “**guarantees** to the extent they must be cash‑settled at or as a result of Closing”

- A tight but strong **catch‑all** like:
  - “all obligations **of the type described above**” (i.e., catch‑all tethered to “borrowed money” concepts)

**Seller-favorable exclusions:**

- **Carve out** anything that looks like normal operating working capital:
  - Trade A/P, accrued expenses, deferred revenue, customer deposits (unless separately treated)

- **Exclude**:
  - Operating lease liabilities (if using IFRS 16/ASC 842, sellers often argue “it’s operating, not debt-like”)
  - Contingent liabilities not triggered by closing (litigation reserves, warranties, etc.)
  - Amounts **already captured** in Transaction Expenses or Working Capital (explicit “no double count” clause)

- Push for:
  - **Schedule-based** debt list (only listed items + “accrued interest thereon”)

**Double-count risks:**

- **Indebtedness ↔ Transaction Expenses**
  - Debt **breakage/make‑whole** can be drafted into both
  - **Financing fees**: if “Transaction Expenses” includes financing/refinancing costs and Indebtedness includes “fees/expenses in connection with repayment,” you can hit the same dollars twice

- **Indebtedness ↔ Working Capital**
  - **Accrued interest** sitting in accrued liabilities (WC) but also included in Indebtedness
  - **Current portion of LT debt** reclassified as current liability (WC) but also in Indebtedness
  - **Lease liabilities** reclassifications (finance lease vs operating) changing whether it’s “debt” or “WC”

- **Indebtedness ↔ Cash**
  - **Overdrafts**: some definitions treat overdrafts as negative cash; others treat as debt
  - **Cash pool**: “cash” may be shown gross in some accounts while a sweep liability sits elsewhere

**Gap risks:**

- **Off-balance sheet / not obvious on TB**
  - Guarantees, letters of credit reimbursement obligations, recourse factoring, supply chain finance

- **Subsidiary / foreign entity debt** not on the main company TB
- **Cut-off**: interest, fees, and breakage calculated **to the wrong timestamp**
- **Intercompany**: if intercompany is netted in consolidation but must be settled in funds flow, it can fall between definitions

**Market standard benchmark:**

- Includes **borrowed money + accrued interest + breakage**, and **capital/finance leases**.
- Excludes ordinary course operating liabilities (A/P, accruals).
- Uses a **limited catch-all** tethered to debt-like concepts, and often a **reference schedule** (or at least a “representative list” of facilities) ✅

**Red flag language:**

- “**any and all obligations or liabilities of any nature whatsoever**” (too broad; turns WC into debt)
- “**whether or not recorded on the balance sheet**” without being tethered to borrowed money concepts
- “**all liabilities under any lease**” (captures operating leases unless limited)
- “**all accounts payable older than X days**” (classic attempt to rebrand trade payables as debt)
- “including **Transaction Expenses**” (almost always creates overlap)

**Key questions to ask:**

- Does Indebtedness include **accrued interest**, **breakage/make‑whole**, and **unamortized fees/OID**?
- Are **lease liabilities** included? If yes, **which ones** (finance only vs all)?
- How are **overdrafts** treated—debt or negative cash? Is netting allowed?
- Are **cash pooling** and treasury true-ups explicitly addressed?
- Are **factoring / SCF / receivables monetization** treated as debt-like?
- Is there a **“no double count”** mechanic across Indebtedness / WC / Transaction Expenses?
- What’s the **measurement moment** (e.g., “Effective Time” vs end of day)? Who calculates payoff?

---

#### Cash

**Typical inclusions:**

- **Cash on hand** (petty cash, tills)
- **Demand deposits** (operating bank accounts)
- **Cash equivalents** (money market, T‑bills, short-term highly liquid investments per GAAP/IFRS)
- **Deposits in transit** (sometimes included; sometimes disputed)
- **Short-term marketable securities** (sometimes explicitly included, sometimes excluded as “investments”)

**Buyer-favorable additions:**

- **Exclude**:
  - **Restricted cash** (cash pledged, escrowed, compensating balances)
  - **Trapped cash** (e.g., in foreign subs where distribution is legally or practically blocked)
  - Cash in accounts that do **not transfer** with the business (seller-controlled accounts)

- **Define “Cash” net of**:
  - **Outstanding checks / ACH / wires initiated but not cleared** (“items in transit”)
  - Bank fees and cutoff items through the Effective Time

- **Force overdrafts out of Cash**:
  - “Cash shall **not be netted** with overdrafts; overdrafts treated as Indebtedness”

- **Narrow cash equivalents** (avoid broad “any investments readily convertible” wording)

**Seller-favorable exclusions:**

- **Include**:
  - **Restricted cash** and marketable securities as “Cash”
  - **Deposits in transit / lockbox receipts** through close
  - **Netting** of overdrafts (treat as negative cash rather than debt)

- Resist deductions for:
  - Outstanding checks (seller argument: “those are already in working capital via A/P” — sometimes true, often not clean)

**Double-count risks:**

- **Cash ↔ Working Capital**
  - If working capital is defined as **current assets – current liabilities** and “cash” accounts are not explicitly excluded, you can count cash in WC **and** as a separate cash add-on

- **Cash ↔ Indebtedness**
  - Overdrafts and cash pool balances can be counted as negative cash **and** indebtedness if drafting is sloppy

- **Cash ↔ Transaction Expenses**
  - If Transaction Expenses include amounts **paid pre-close** by the company, those have already reduced cash; if also deducted from price, buyer gets a double benefit unless there’s a true-up

**Gap risks:**

- **Restricted/trapped cash**: excluded from Cash but not treated anywhere else (so it disappears)
- **Escrow balances**: deal escrows (tax escrow, indemnity escrow) sometimes unclear if they’re “company cash” at close
- **Cut-off / transit items**:
  - Checks issued but not cleared, deposits after the measurement time

- **FX translation** for multi-currency accounts (rate and timestamp matter)

**Market standard benchmark:**

- Cash = **cash and cash equivalents**, **excluding restricted cash**, measured as of the **Effective Time** (or close of business) with a clear approach to **transit items**.
- Overdrafts are more often treated as **Indebtedness** (or explicitly not netted), but practice varies by jurisdiction and banking structure.

**Red flag language:**

- “Cash includes **restricted cash**” with no separate treatment (seller-friendly, often contentious)
- “Cash shall be **net of all outstanding checks**” without also addressing whether those checks are in A/P (risk of economic double count)
- “Cash as determined by Buyer” / “in Buyer’s sole discretion”
- “Cash includes **any amounts on deposit anywhere**” (watch for non-transferable / trapped funds)

**Key questions to ask:**

- Is **restricted cash** included or excluded? If excluded, is it treated somewhere else (WC or a separate adjustment)?
- Are **outstanding checks / ACH / wires** deducted from cash? If yes, are those liabilities also in WC?
- Are **overdrafts** negative cash or Indebtedness? Can the seller **net** across accounts/banks?
- What’s included as **cash equivalents**? Are short-term investments included?
- What’s the **measurement timestamp** and **FX rate** for foreign accounts?
- Does the definition only include cash that **transfers with the business**?

---

#### Working Capital

**Typical inclusions:**

- **Current assets (operating)**
  - Trade **A/R** (net of allowance)
  - **Inventory** (net of reserves/obsolescence)
  - **Prepaids** (rent, insurance, deposits) — often debated which ones are “operating”
  - Other current assets (VAT receivables, rebates receivable, etc.)

- **Less: current liabilities (operating)**
  - Trade **A/P**
  - **Accrued expenses** (payroll, bonus, vacation, utilities, professional fees, etc.)
  - **Deferred revenue / contract liabilities** (highly negotiated)
  - **Customer deposits** / advances
  - Accrued rebates/returns/warranties (depending on industry)

- Often **explicitly excluded**:
  - **Cash**, **Indebtedness**, **Transaction Expenses**
  - **Income taxes** payable/receivable (sometimes included; very deal-specific)
  - Intercompany balances (if settled at close)

**Buyer-favorable additions:**

- Broaden liabilities / tighten assets, e.g.:
  - Include **deferred revenue / customer advances** in WC (reduces WC → helps buyer)
  - Include **accrued bonus, commission, vacation**, payroll taxes
  - Include **sales returns, rebates, warranty reserves**, and require reserves to be “GAAP/IFRS compliant” (not just historical)
  - Include **accrued capex** and other “operating” accruals
  - Include **current tax liabilities** if not separately addressed (buyer will argue they’re pre-close obligations)

- Add a “true GAAP” lever:
  - “including any liabilities **required to be recorded under GAAP/IFRS** whether or not recorded”
    (powerful, but also a dispute magnet)

**Seller-favorable exclusions:**

- Exclude contentious liabilities / keep assets broad:
  - Exclude **deferred revenue** (classic seller push)
  - Exclude **reserves** beyond historical (avoid buyer “reserve up”)
  - Exclude **income taxes** payable/receivable
  - Exclude one-time/non-operating accruals and anything transaction-related

- Lock to historical:
  - “prepared consistent with past practice” even if not perfectly GAAP (seller-friendly)

**Double-count risks:**

- **Working Capital ↔ Transaction Expenses**
  - Deal advisory fees, diligence costs, banker fees accrued in A/P or accruals can be WC **and** Transaction Expenses
  - Change-of-control bonuses accrued pre-close can show up in accrued expenses (WC) and also be listed as Transaction Expenses

- **Working Capital ↔ Indebtedness**
  - Current portion of debt, accrued interest, lease liabilities can drift into WC via “current liabilities”

- **Working Capital ↔ Cash**
  - If cash is not explicitly excluded from “current assets,” you can count it twice (WC and Cash)

- **Working Capital ↔ Accounting Principles**
  - Reclassifications (e.g., moving items between current/non-current) can swing the adjustment materially

**Gap risks:**

- **Income taxes** often fall through the cracks:
  - Excluded from WC but not included in Indebtedness or Transaction Expenses → pre-close tax liabilities can disappear

- **Unrecorded liabilities** at close:
  - Missing accruals for payroll/bonus, utilities, legal, rebates

- **Cut-off** for revenue/expenses:
  - Improper cutoff can inflate A/R or understate A/P

- **Industry-specific items** that don’t fit neat buckets:
  - Contract assets/liabilities, unbilled revenue, rebates, loyalty programs, gift cards

**Market standard benchmark:**

- WC = **operating current assets – operating current liabilities**, **excluding Cash, Indebtedness, and Transaction Expenses**, calculated **consistent with the company’s historical accounting**.
- Most buyer-friendly / least dispute-prone deals include:
  - A **sample working capital schedule** (example calculation)
  - An **account-level inclusions/exclusions schedule** (what TB lines go in/out) ✅

**Red flag language:**

- “Working Capital shall be determined in accordance with **GAAP**” (with no “consistent with past practice” or schedule) → invites buyer to change methods
- “including any items that **should have been recorded**” (lets buyer introduce new accruals post-close)
- “including **all current liabilities**” without excluding Indebtedness/Transaction Expenses (double count trap)
- “consistent with Buyer’s accounting policies” (rarely acceptable to sellers)
- “for greater certainty, includes **deferred revenue**” (not inherently wrong—just a big economic lever)

**Key questions to ask:**

- Is there a **schedule** listing included/excluded TB accounts (or at least a sample calculation)?
- Are **Cash**, **Indebtedness**, and **Transaction Expenses** explicitly excluded from WC?
- Treatment of **deferred revenue / customer deposits**?
- Treatment of **income taxes** (in WC, debt-like, separate true-up)?
- Are **reserves** (A/R allowance, inventory obsolescence, rebates, warranties) based on **historical practice** or “GAAP true-up”?
- Are **intercompany balances** included, excluded, or settled in funds flow?
- What’s the **cut-off time** and what evidence supports cutoff (bank statements, GR/IR, payroll accruals)?
- Any industry-specific items (contract assets, unbilled revenue) explicitly addressed?

---

#### Transaction Expenses

**Typical inclusions:**

- **Professional fees** incurred in connection with the deal:
  - Investment banking / success fees
  - Legal fees
  - Accounting / QoE / tax structuring fees
  - Consultants, data room, valuation, fairness opinions

- **Employee / management deal-related costs**:
  - Change-of-control / transaction bonuses
  - Severance triggered by the transaction
  - Retention or stay bonuses **if transaction-triggered**
  - Related **payroll taxes** and benefits gross-ups

- **Insurance / governance**:
  - D&O “tail” policy premium (if paid by the company/seller group)
  - R&W insurance premium (who pays is deal-specific)

- **Financing-related** (highly negotiated):
  - Fees and expenses of arranging new debt/refinancing
  - Commitment fees, underwriting fees, lender legal fees

- **Other**:
  - Transfer taxes / stamp duties (depending on structure)
  - Termination fees (if any)

**Buyer-favorable additions:**

- “all Transaction Expenses **paid or unpaid** by the Group or on its behalf”
  (so seller can’t “prepay” and avoid the deduction)
- Explicitly include:
  - **bonuses, severance, retention, option/RSU payouts**, and **employer payroll taxes**
  - **D&O tail** and (if seller wants it) **R&W premium**
  - **financing/refinancing fees** if they are being run through the company (or if company is paying off debt as part of closing)

- “to the extent not otherwise included in **Indebtedness** or **Working Capital**” (a “catch” provision—good if drafted carefully)

**Seller-favorable exclusions:**

- Exclude:
  - Buyer’s financing fees, integration costs, and post-close operating initiatives
  - Costs not incurred by/for the Group (seller’s holdco fees, owner personal advisors)
  - Any amounts already accrued in WC **if** WC will adjust for them (but this must be paired with no-double-count mechanics)

- Narrow timing:
  - Only costs “**incurred in connection with the Transaction and unpaid as of Closing**” (seller-friendly)

**Double-count risks:**

- **Transaction Expenses ↔ Working Capital**
  - Advisory fees / bonuses accrued in A/P or accrued expenses reduce WC and also get deducted as Transaction Expenses

- **Transaction Expenses ↔ Indebtedness**
  - Financing fees + debt breakage can appear in both buckets

- **Transaction Expenses ↔ Cash**
  - If already paid pre-close, they’ve reduced cash; deducting again from equity value double counts unless there’s an explicit adjustment

**Gap risks:**

- **Payroll taxes** on bonuses/severance often missed
- Costs incurred but not invoiced (no accrual booked)
- Cross-border deal costs split across entities (one sub books it; definition only looks at parent)
- R&W insurance, D&O tail, and similar items unclear on **who pays** and **where it’s captured**

**Market standard benchmark:**

- Transaction Expenses typically capture **deal-related costs of the Group** (not buyer’s costs), and are either:
  - **Paid at closing from proceeds** via funds flow, or
  - **Deducted from purchase price** if unpaid/left in the company

- Market standard drafting usually tries to make it **economically single-counted** with WC and cash (either through explicit exclusions or a “no double count” clause). ✅

**Red flag language:**

- “all costs incurred in connection with **any strategic alternatives process**” (could reach far back)
- “whether paid or unpaid” **without** a clear anti-double-count framework
- “including any costs related to **financing**” (if buyer financing is intended, this is a fight)
- “including any **severance or retention**” (even if post-close and buyer-driven)
- “as determined by Buyer” / “in Buyer’s sole discretion”

**Key questions to ask:**

- Who is responsible for each cost: **company vs seller vs buyer**?
- Are transaction-related fees **already accrued in WC** (A/P, accruals)? If yes, how do we avoid double counting?
- Are **employee payments** included? Are **payroll taxes/gross-ups** included?
- Are **financing/refinancing** fees included? Whose financing?
- Are **D&O tail** and **R&W premium** included? Who pays?
- Does the definition include amounts **paid pre-close** by the company, and if so how is that reconciled with cash/price?
- Is there a **clear list/schedule** of expected transaction expenses for funds flow?

---

#### Accounting Principles

**Typical inclusions:**

- A stated framework: **IFRS** or **US GAAP** (or local GAAP), plus
- A consistency concept:
  - “prepared on a basis consistent with the **Financial Statements**” and/or
  - “consistent with **past practice**”

- Often a **hierarchy/waterfall**:
  1. The SPA definitions + illustrative schedules
  2. Company historical policies (Financial Statements)
  3. GAAP/IFRS (as the tie-breaker)

**Buyer-favorable additions:**

- A **clear hierarchy** that prevents “creative” policy shifts:
  - “First, as set forth in **Schedule [X]**; then consistent with the Financial Statements; then GAAP/IFRS”

- “GAAP/IFRS compliant” safeguard:
  - “consistent with historical practice **except** to the extent inconsistent with GAAP/IFRS”

- Ability to record items required under GAAP/IFRS:
  - “including all accruals and reserves **required** under GAAP/IFRS as of the Effective Time”

- Strong dispute mechanics:
  - Independent accountant, limited scope, tight timelines, and “baseball arbitration” style constraints (where used)

**Seller-favorable exclusions:**

- “Consistent with past practice” **without** a GAAP/IFRS override (locks in seller’s historical judgments)
- Avoid buyer discretion:
  - No “as determined by Buyer”
  - No “in accordance with Buyer’s accounting policies”

- Avoid “unbooked items” language that lets buyer invent accruals post-close

**Double-count risks:**

- Accounting Principles are the **engine** that can cause double count by **reclassification**:
  - Reclassifying overdrafts between Cash and Indebtedness
  - Reclassifying lease liabilities between Indebtedness and WC
  - Moving accrued transaction fees between WC and Transaction Expenses

- If the principles allow “GAAP true-up” changes **only on one side** (e.g., reserves increased but assets not corrected similarly), you get asymmetric outcomes

**Gap risks:**

- No hierarchy → disputes on whether GAAP/IFRS or historical practice controls
- No illustrative schedule → parties argue about account mapping and classification
- Ambiguous cutoff rules (Effective Time vs end-of-day; post-close events)

**Market standard benchmark:**

- **Best practice / market standard** (and most dispute-resistant) is a waterfall:
  - **(1) SPA definitions + example schedules**, then
  - **(2) consistent with the company’s historical Financial Statements**, then
  - **(3) GAAP/IFRS**
    This balances “don’t change the rules at close” with “don’t allow abusive past practices.” ✅

**Red flag language:**

- “prepared in accordance with **GAAP**” (alone) → gives room to change methods at close
- “as determined by Buyer” / “in Buyer’s sole discretion”
- “consistent with Buyer’s accounting policies” (very buyer-aggressive)
- “consistent with past practice **even if not in accordance with GAAP/IFRS**” (seller-aggressive)
- “including any items that **should have been recorded**” (opens the door to post-close reconstructions)

**Key questions to ask:**

- Is there a **clear hierarchy** (schedule → historical FS → GAAP/IFRS)?
- Are there **illustrative schedules** for Cash, Indebtedness, WC, Transaction Expenses mapping TB lines?
- Does the language allow a **GAAP/IFRS true-up**? If yes, is it **balanced** and bounded?
- Who prepares the closing statement and who reviews? Are there **access rights** to support?
- What’s the **cut-off** (Effective Time vs end of day), and how are transit items handled?
- Are **estimates/reserves** locked to historical methodology or open to recalibration?
- What’s the **dispute resolution** process (independent accountant scope, timeline, standard of review)?
- For multi-currency businesses: what **FX rates** and translation approach apply?

---

If you want, I can also give you a **one-page “definition cross-check checklist”** (account-by-account mapping) that an analyst can run mechanically on a trial balance to spot overlaps and missing buckets fast 🧾✅.

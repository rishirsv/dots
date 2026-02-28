#### Bucket Placement Framework

A useful way to stay “definitive” (and avoid post-close surprises) is to **force every balance sheet / off–balance sheet exposure into exactly one of four outcomes**:

1. **NWC (Operating)**
2. **Net Debt (Financing / debt-like / cash-like)**
3. **Transaction Expenses (Deal-triggered / seller-borne at close)**
4. **Explicitly Excluded / Retained** (i.e., it’s _nobody’s_ in the adjustment framework because it’s dealt with elsewhere)

Two grounding principles to keep everyone honest:

- **The SPA definitions win.** Accounting labels (“current”, “long-term”) are _secondary_ to what the agreement says and to the economic intent.
- **NWC is generally intended to be “cash-free, debt-free.”** In other words, the NWC peg is meant to represent a normalized **operating** working capital level delivered at close, _not_ cash and not financing. ([EisnerAmper][1])
- If the deal has **separate** adjustments for NWC vs Cash vs Indebtedness vs Transaction Expenses, they must be **harmonized** to avoid “dueling” calculations / double dipping. ([Whiteford Law][2])

---

### A practical decision tree (works in diligence _and_ disputes) 🔍

**Step 0 — Is it explicitly defined/scheduled?**

- **Yes** → Follow the definition/schedule _even if_ you dislike it (then focus dispute on _calculation consistency_ and _cut-off_).
- **No / ambiguous** → go to Step 1.

**Step 1 — Is it clearly a deal-triggered cost?** _(i.e., exists because of the transaction, not because the business operates)_
Examples: banker success fee, legal/QoE fees, sell-side bonuses, change-in-control payments, transaction tax structuring costs.

- **Yes** → **Transaction Expenses**, unless the SPA deliberately sweeps them into “Indebtedness” (some do).
- **No** → go to Step 2.

**Step 2 — Is it cash / cash-like, or debt / debt-like?**

- **Cash / cash-like** (cash, cash equivalents, sometimes restricted cash, cash-in-transit, etc.) → in the **Cash / Net Debt** construct (and **excluded from NWC**). ([EisnerAmper][1])
- **Debt / debt-like** (borrowings, notes, LOCs, overdrafts _depending on drafting_, accrued interest, leases if defined as debt-like, pensions/ARO if defined as debt-like, etc.) → **Net Debt**. ([Kreischer Miller][3])
- If neither → go to Step 3.

**Step 3 — Is it required to run the business in the ordinary course and does it turn over with operations?**
Heuristic: “Would a buyer expect this to **recycle** through the cash conversion cycle as part of normal operations?”

- **Yes** → **NWC (Operating)** (e.g., trade A/R, inventory, trade A/P, operating accruals, deferred revenue/contract liabilities in many models, etc.).
- **No** → go to Step 4.

**Step 4 — Is it non-operating / financing-adjacent / owner-related / one-off?**
Examples: shareholder/related-party balances, unusual litigation accruals, tax exposures not tied to run-rate operations, restructuring reserves, long-dated provisions.

- **Usually Net Debt** _or_ **Explicitly Excluded/Retained**, depending on what the deal economics intend.

---

### “Rules of thumb” that win arguments 💡

**Rule A — Operating vs financing beats current vs long-term.**
A “current” liability can still be debt-like (e.g., current portion of term debt). A “long-term” item can still be operating-like in certain industries (e.g., deferred revenue dynamics).

**Rule B — If it’s in NWC, it should not also be in Net Debt (and vice versa).**
Sounds obvious, but most $10M+ disputes are just hidden overlaps + sign errors + cut-off.

**Rule C — Consistency clause = the battlefield.**
Most disputes end up being about “GAAP vs consistent application vs specific schedules.” (Your friend here is a **bridge from historical accounting policies to the closing statement** and a tight list of “Accounting Principles” / schedules.) ([Gibson Dunn][4])

**Rule D — Ask: “Who economically benefits (or suffers) after close?”**

- Buyer benefits post-close → tends to be NWC (or cash).
- Seller benefited pre-close / financing decision / owner extraction → tends to be Net Debt or excluded/leakage.
- Exists only because of the deal → transaction expense.

---

### A “definitive” line-item universe (what can show up)

Below is the **full universe** I force teams to map at **trial balance (GL) level**. Any GL that isn’t mapped is a future dispute.

**A) NWC (Operating) — typical included components**

- Trade accounts receivable (net of normal reserves)
- Inventory (net of normal reserves)
- Prepaids (only _operating_ prepaids; watch one-time)
- Other current operating assets (deposits with suppliers, recoverable items tied to ops)
- Trade accounts payable
- Accrued expenses (payroll accruals, benefits accruals, operating accruals)
- Deferred revenue / contract liabilities / customer deposits _(highly deal-specific)_
- Sales/VAT/GST payable and related receivables _(often operating)_
- Other current operating liabilities (rebates, returns, warranty accruals—if normal/run-rate)

**B) Net Debt — typical included components**

- Borrowings: revolver, term loans, notes, shareholder loans
- Current portion of LT debt _(avoid leaving it stranded in NWC)_
- Accrued interest and fees on debt
- Bank overdrafts / cash management balances _(drafting-sensitive)_
- Lease liabilities _(often treated as debt-like, but must be defined)_
- Derivatives / hedging MTM tied to financing
- Factoring / securitization obligations
- Deferred financing fees / OID _(treatment varies: gross vs net)_
- Pension deficits / post-employment obligations _(if treated as debt-like)_
- Asset retirement obligations / environmental provisions _(sometimes debt-like, sometimes excluded)_
- Unpaid dividends / distributions declared pre-close
- Any other “debt-like” obligations that are effectively **a claim on value** rather than part of run-rate working capital ([Kreischer Miller][3])

**C) Transaction Expenses — typical included components**

- Investment banking success fees / sell-side advisory fees
- Legal fees (deal counsel)
- Accounting / QoE / tax structuring fees
- Deal insurance premiums (if seller-borne)
- Change-in-control, transaction bonuses, retention payments triggered by the deal
- Severance triggered by transaction (depending on who initiated/benefits)
- Financing-related fees triggered by close (debt breakage, prepayment penalties) _(can be debated: Net Debt vs Transaction Expense)_
- One-time transaction taxes (stamp/transfer taxes) where seller bears them

**D) Explicitly excluded / retained (must be spelled out)**

- Certain tax exposures (e.g., pre-close income tax) if buyer is indemnified instead of adjusted
- Specific litigation matters if handled via indemnity/escrow
- Related-party balances that will be settled outside completion accounts
- Any “Excluded Assets/Liabilities” as per carve-out / perimeter schedule

---

#### Classic Disputed Items

Here are the **repeat offenders**—items that legitimately can land in more than one bucket depending on drafting and economics. I’m giving you the **typical dispute posture** and the **most common resolution** I see.

##### 1) Cash and cash-like items 💵

1. **Restricted cash**

- **Seller argument:** it’s cash → should increase price (reduce net debt).
- **Buyer argument:** not usable to run business / may secure obligations → treat as excluded or debt-like.
- **Typical resolution:** include in “Cash” only if restriction is _temporary/operational_ and transfers with business; otherwise exclude or offset with the secured obligation.

2. **Cash in transit / undeposited funds / merchant processor receivables**

- **Resolution:** include as cash-like _if_ it’s economically equivalent to cash and cut-off is clean; otherwise treat as A/R in NWC.

3. **Bank overdrafts**

- **Buyer:** debt-like → Net Debt.
- **Seller:** operational working capital / part of cash management → could be NWC.
- **Typical resolution:** choose **one**: either (a) include in Net Debt, or (b) net within cash definition—but never both.

##### 2) Deferred revenue / customer deposits (especially SaaS) 📦

4. **Deferred revenue / contract liabilities**

- **Buyer:** it’s an obligation to deliver services without future cash → should reduce price (NWC liability).
- **Seller:** it’s “negative working capital” that’s normal; may already be reflected in valuation; or accounting policy differences make it volatile.
- **Typical resolution:** include in NWC _but_ ensure the **target** reflects the business model; alternatively exclude if the parties used a locked-box style price or otherwise priced it in. (Also: define calculation mechanics tightly to avoid “policy shopping”.) ([Gibson Dunn][4])

##### 3) Taxes (the silent $20M swing) 🧾

5. **Income taxes payable/receivable**

- Often negotiated as excluded/retained/handled via indemnity rather than NWC.
- **Typical resolution:** explicitly state treatment; otherwise you get “gap” + “double dip” risk.

6. **Sales tax / VAT / GST**

- More often treated as operating and included in NWC, but depends on whether it’s a pass-through with clean compliance.

##### 4) Accrued compensation, bonuses, vacation 👥

7. **Accrued bonus** (regular annual bonus)

- **Resolution:** if it’s part of normal comp plan and historically accrued → NWC operating accrual.

8. **Transaction bonus / stay bonus**

- **Resolution:** usually Transaction Expense (deal-triggered) unless parties explicitly treat as debt-like.

9. **Accrued vacation / PTO**

- **Resolution:** usually operating accrual in NWC _unless_ the seller cashes it out at close (then watch double count).

##### 5) Leases and embedded financing (ASC 842 / IFRS 16) 📄

10. **Lease liabilities**

- **Buyer:** debt-like → Net Debt.
- **Seller:** operating-like because it’s “rent.”
- **Typical resolution:** follow SPA definition—many deals now explicitly include/exclude lease liabilities in Net Debt. If included, ensure you don’t also include lease-related accruals in NWC in a duplicative way.

##### 6) Factoring / A/R sales / supply chain finance 🔁

11. **Factored receivables**

- **Resolution:** if A/R is derecognized, ensure you aren’t also counting the obligation somewhere else incorrectly. If it’s with recourse or economically debt-like, it often ends up in Net Debt.

12. **Supplier financing / reverse factoring**

- **Resolution:** often treated as debt-like if it’s effectively financing rather than trade payables—this is a frequent “hidden net debt” finding.

##### 7) Reserves and provisions ⚠️

13. **Inventory reserves / obsolescence**

- **Seller:** “normal reserve already booked.”
- **Buyer:** reserves inadequate → effectively reduces delivered working capital.
- **Resolution:** the fight becomes “Accounting Principles” + consistency; quantify vs historical.

14. **Bad debt reserve**

- Same dynamic as inventory reserve.

15. **Warranty / returns / rebates accruals**

- Usually NWC if normal/run-rate; sometimes excluded if a known special claim is handled via indemnity.

##### 8) Intercompany / related-party balances 🧩

16. **Due to/from affiliates**

- Typical resolution: explicitly exclude and settle outside, or treat as Net Debt (owner-related) rather than NWC.

##### 9) “Operating vs debt-like” accruals 🔥

17. **Accrued interest**

- Almost always Net Debt if you’re using a net debt construct. (But it loves to sneak into accrued expenses in NWC unless you carve it out.)

18. **Deferred financing costs**

- Can be treated gross or net against debt; define it or you’ll fight about presentation vs economics.

##### 10) Transaction-related liabilities sitting in “AP/accruals” 🧨

19. **Unpaid banker/legal invoices recorded in AP/accruals**

- Seller wants it to be just “normal AP” inside NWC.
- Buyer wants it as Transaction Expense (seller-borne) _and/or_ net debt-like.
- Typical resolution: classify as Transaction Expense (seller-borne), then ensure it’s excluded from NWC.

---

#### Double-Count Detection Checklist

The best method is mechanical: **map every GL account to one and only one bucket** (NWC / Net Debt / Tx Exp / Excluded) and then run overlap tests. But here are the specific “gotcha” combinations I always check ✅

### A) NWC vs Net Debt — classic double counts

1. **Cash included in NWC** _and_ in Cash/Net Debt

- Check: “Other current assets” and “due from processor” often get swept incorrectly.

2. **Overdraft counted twice**

- Once as **negative cash** (netted in cash definition or bank rec)
- Again as **debt/indebtedness**
- Fix: choose one treatment.

3. **Current portion of debt left inside current liabilities (NWC)** _and_ total debt included in Net Debt

- This is one of the most common “quiet” double counts.

4. **Accrued interest included in accrued liabilities (NWC)** _and_ in Net Debt

- Especially when “accrued expenses” is a big blended line.

5. **Lease liabilities included in Net Debt** _and_ lease-related accruals misclassified in NWC

- If you include lease liabilities as debt-like, make sure operating accruals don’t also contain lease financing components.

6. **Factoring / securitization counted twice**

- A/R reduced (lower NWC)
- Obligation still included in Net Debt (or vice versa) inconsistently

7. **Intercompany balances included in NWC** and also treated as indebtedness

- If it’s owner-related, keep it out of NWC.

**Controls / tests**

- Build a “no-overlap” report: any GL account mapped to >1 bucket is a red flag.
- Reconcile: **(All mapped accounts + Excluded/Retained) = Trial balance** as of close. If not, something is missing or duplicated.

---

### B) Net Debt vs Transaction Expenses — classic double counts

1. **Deal fees accrued in liabilities** treated as debt-like _and_ also labeled “Transaction Expenses”

- Common when the SPA has both “Indebtedness” and “Transaction Expenses” definitions.

2. **Transaction bonuses / severance** treated as debt-like (accrued comp) _and_ transaction expense

- Fix: decide whether it’s (a) seller-borne transaction expense or (b) indebtedness—don’t count twice.

3. **Debt breakage / prepayment penalties**

- Sometimes included in indebtedness payoff letter (Net Debt)
- Also included in “transaction expenses” schedule
- Fix: tie out to payoff letters and ensure single classification.

4. **Unpaid legal/accounting invoices**

- In AP/accruals (operating liability)
- Also pulled into transaction expenses schedule
- Fix: identify transaction vendors and reclass out of NWC/AP bucket.

**Controls / tests**

- Tie out net debt schedule to **payoff letters** + bank statements + accrued interest detail.
- Tie out transaction expenses to **vendor listing** + invoices + accrued expense subledger.
- Run a vendor-name match: if a vendor appears in both (a) net debt support and (b) tx expense schedule, you likely have overlap.

---

#### Gap Detection Checklist

Gaps are where you lose money because the SPA framework simply doesn’t “catch” something (or the team doesn’t). Here’s how to smoke them out 🔦

### 1) Definition gaps (paper gaps)

- Does the SPA define **all four**: Net Working Capital, Cash, Indebtedness/Net Debt, Transaction Expenses?
  - Many SPAs explicitly calculate all four in the closing statement mechanics. (Example language often includes a Closing Statement with NWC, Cash, Indebtedness, and Transaction Expenses.) ([SEC][5])

- Are there **excluded assets/liabilities** schedules that override the above?
- Is the **accounting principles hierarchy** unambiguous (GAAP vs consistent vs schedule overrides)? ([Gibson Dunn][4])

### 2) Balance-sheet gaps (accounts not mapped)

- Run the TB mapping test: every GL account must be tagged NWC / ND / Tx Exp / Excluded.
- Pay special attention to: “other current assets”, “other current liabilities”, “misc accruals” (these are where gaps hide).

### 3) Off-balance-sheet / quasi-balance-sheet gaps

- Leases (if not in net debt definition)
- Guarantees, letters of credit, surety bonds
- Purchase commitments / take-or-pay
- Earn-outs / contingent consideration (if closing liability exists)
- Pension/benefit obligations not on the face of BS
- Tax exposures / uncertain tax positions
- Litigation contingencies / environmental matters

### 4) Cut-off gaps (timing gaps)

- Unrecorded AP (received not invoiced)
- Revenue cut-off (bill-and-hold, unbilled revenue, credit memos after close)
- Payroll cut-off and bonus accrual cut-off
- Inventory in transit terms (FOB shipping point vs destination)
- Sales tax/VAT/GST filing cut-off

### 5) “Economic gap” question (the sanity check)

Ask: **If we closed tomorrow, is there any known obligation or asset that would transfer value but is not captured by NWC/ND/TxExp?**
If yes, you either (a) add it to a definition, (b) put it on an excluded schedule, or (c) cover it via indemnity/escrow.

---

#### NWC Target Reasonableness Framework

A working capital target is “reasonable” if it represents the **normal operating NWC needed to run the business at close** _under the exact SPA definition_—and therefore minimizes the likelihood and magnitude of the true-up dispute.

One key framing to keep negotiations rational:

- **A $1 increase in the working capital target is economically equivalent to a $1 decrease in price (and vice versa).** ([Kroll][6])

Here’s the framework I use (and the exhibits I’d want ready for a dispute) 📈

### Step 1 — Rebuild historical NWC under the _deal definition_

- Take **monthly** (sometimes weekly) TB/BS history (12–24 months).
- Recompute NWC exactly as defined (include/exclude the same accounts, same conventions).
- Adjust for any accounting policy changes so the series is comparable.

**Deliverable:** “Historical NWC under SPA definition” schedule, by month, with a reconciliation to the financial statements/TB.

### Step 2 — Normalize (remove noise that shouldn’t set the peg)

Normalize for items that are:

- One-time (insurance recoveries, unusual legal settlements, one-off tax payments)
- Non-operating reclasses (related-party clean-ups)
- “Window dressing” behaviors (stretching payables, aggressive collections)

**Deliverable:** A bridge from reported NWC → normalized NWC.

### Step 3 — Explicitly address seasonality

Do not use a simple TTM average if the business is seasonal.

Common approaches:

- **Average of same-months** over 2–3 years (e.g., average of prior Q4s if closing in Q4)
- **13-month rolling average** (helps show seasonality band)
- If the business has big swings, set target as **expected NWC at the expected close month**, not the annual average

**Deliverable:** Seasonality chart/band + where the proposed peg sits.

### Step 4 — Driver-based reasonableness (days analysis)

Convert the peg discussion from “dollars” to **operating drivers**:

- DSO (A/R days)
- DIO (inventory days)
- DPO (A/P days)
- Deferred revenue dynamics (for SaaS)

Then ask:

- Are the implied days **consistent with history** and the go-forward plan?
- Is growth (or decline) expected between the peg measurement period and close? If yes, adjust.

**Deliverable:** A driver model that shows peg-implied days vs historical median/percentiles.

### Step 5 — Stress test “peg gaming”

Look for incentives and the ability to game:

- Can seller accelerate collections materially?
- Can seller defer payables without consequence?
- Are there covenants/ordinary-course provisions that prevent manipulation?

**Deliverable:** A “gaming sensitivity” (e.g., what happens if AP is stretched by 10 days).

### Step 6 — Materiality and dispute minimization

Even a correct peg can be _litigation bait_ if drafting is loose.

- Add clear examples and schedules.
- Decide whether a collar/bucket is appropriate for immaterial differences. ([EisnerAmper][1])

**Deliverable:** Drafting recommendations + “top 10 accounts that drive volatility.”

---

#### Market Standard Mechanisms

There isn’t one universal “standard,” but there are **standard toolkits** that show up repeatedly. Here are the ones you’ll see most often, with typical timing/structures.

### 1) Completion accounts / closing accounts (classic true-up) ✅

- Purchase price paid at close using an **estimate**, then trued up post-close based on a closing statement. ([SEC][5])
- **Timing:** buyer often has a limited post-close window (commonly **~60–90 days**) to deliver a closing statement / audit and calculate closing NWC (and other components). ([Boston Bar Association][7])
- Common contractual examples include **“within 90 days after Closing”** for delivering the closing statement. ([American Bar Association][8])
- **Dispute process:** notice → negotiation → independent accountant (expert determination) is very common. ([Global Private Equity Watch][9])

**What’s “market” in the mechanics**

- Seller delivers estimated statement at close; buyer delivers closing statement within 60–90 days; seller has a dispute window (often ~30 days) in many forms. ([SRS Acquiom][10])
- Independent accountant scope is usually limited to accounting/calculation issues (not broad legal disputes). ([Global Private Equity Watch][9])

### 2) Collars / buckets / tolerance bands 🧺

- Purpose: avoid fighting over immaterial deltas; if NWC is within the collar, **no adjustment** (or adjustment only outside the band depending on drafting). ([EisnerAmper][1])

**“Market standard” sizing (real talk):**

- **There’s no universal collar width.** When used, it’s negotiated and often expressed as (a) a fixed $ amount, or (b) a % of the NWC peg or purchase price. The right answer is driven by volatility of NWC and the cost of disputes. (If you want a number, I usually see collars sized to be clearly “immaterial” relative to EV but large enough to cover normal measurement noise.)

### 3) De minimis / basket / cap on the adjustment ⚖️

- Structures you’ll see:
  - **Dollar-for-dollar** adjustment (most common)
  - **De minimis** (ignore first $X)
  - **Cap** (adjustment limited to $X)
    These are all recognized approaches in practice. ([Morris & Watrous][11])

### 4) Adjustment escrow / holdback 🔒

- Very common to secure the post-close adjustment payment.
- Rule-of-thumb often cited: **~1% of deal value**, with variability by deal size and characteristics. ([Goodwin Law Firm][12])

### 5) Locked-box (no post-close NWC true-up) 📦

- Price is fixed using a historical balance sheet (“locked-box accounts”); economic ownership transfers as of that locked-box date; buyer is protected through **leakage** protections rather than completion accounts. ([Gibson Dunn][13])
- Under locked box, there is generally **no purchase price reduction at close for working capital shortfall**; instead, leakage claims address value extraction between locked-box date and completion. ([Maxwell Locke & Ritter][14])

### 6) Hybrid mechanisms

- Locked box for price certainty + specific leakage + sometimes a limited true-up for a narrow item (e.g., cash/debt only).
- Completion accounts for NWC + locked box-like protections for specific leakage items.

---

If you want, I can also give you a **one-page “GL bucket mapping template”** (columns, required tie-outs, and the exact pivot checks that catch 95% of double counts/gaps).

[1]: https://www.eisneramper.com/insights/corporate-finance/net-working-capital-transaction-0724/?utm_source=chatgpt.com "Net Working Capital and Key Considerations for Buyers ..."
[2]: https://www.whitefordlaw.com/news-events/net-working-capital-purchase-price-adjustments-in-ma-deals?utm_source=chatgpt.com "Net Working Capital & Purchase Price Adjustments In M&A ..."
[3]: https://www.kmco.com/insights/understanding-the-importance-of-debt-and-debt-like-items-in-an-ma-transaction/?utm_source=chatgpt.com "Understanding the Importance of Debt and Debt-Like Items ..."
[4]: https://www.gibsondunn.com/wp-content/uploads/2022/05/WebcastSlides-Managing-Purchase-Price-Adjustment-Disputes-10-MAY-2022.pdf?utm_source=chatgpt.com "Managing Purchase Price Adjustment Disputes"
[5]: https://www.sec.gov/Archives/edgar/data/71691/000119312522004587/d269434dex21.htm?utm_source=chatgpt.com "EX-2.1"
[6]: https://www.kroll.com/en/publications/navigating-working-capital-ma-transactions?utm_source=chatgpt.com "Navigating Working Capital in M&A Transactions"
[7]: https://bostonbar.org/journal/striving-for-clarity-in-purchase-price-adjustment-dispute-resolution/?utm_source=chatgpt.com "Striving for Clarity in Purchase Price Adjustment Dispute ..."
[8]: https://www.americanbar.org/groups/business_law/resources/business-law-today/2024-may/post-closing-purchase-price-adjustments-gone-wrong/?utm_source=chatgpt.com "Post-Closing Purchase Price Adjustments Gone Wrong"
[9]: https://privateequity.weil.com/glenn-west-musings/purchase-price-adjustments-arbitrations-expert-determinations-stuff-in-between-and-the-spector-of-a-malicious-adjustment-claim/?utm_source=chatgpt.com "Purchase Price Adjustments: Arbitrations, Expert ..."
[10]: https://www.srsacquiom.com/our-insights/working-capital-purchase-price-adjustments/?utm_source=chatgpt.com "Purchase Price Adjustments: Tips for Better M&A Merger ..."
[11]: https://mallon-lonnquist.com/blog/purchase-price-adjustments/?utm_source=chatgpt.com "Purchase Price Adjustments"
[12]: https://www.goodwinlaw.com/en/insights/publications/2024/09/insights-privateequity-ma-adjustment-escrows-in-ma?utm_source=chatgpt.com "Adjustment Escrows in M&A: Rethinking the 1% Rule"
[13]: https://www.gibsondunn.com/wp-content/uploads/2017/12/Pollack-Shaitanoff-A-Primer-On-Locked-Box-Deals-Law360-11-15-2017.pdf?utm_source=chatgpt.com "A Primer On 'Locked-Box' Deals"
[14]: https://www.mlrpc.com/insights/blog/navigating-the-lockbox-mechanism-in-mergers-and-acquisitions/?utm_source=chatgpt.com "Navigating the Lockbox Mechanism in Mergers and ..."

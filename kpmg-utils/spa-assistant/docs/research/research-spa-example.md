## Research Prompt 1: Excellence in Financial Due Diligence

#### Markers of Excellence

- **They translate findings into _deal math_**
  Not “this clause says X,” but “this clause moves price by ~$Y under plausible scenarios (base / downside / upside).”
- **They think in “economic leakage paths,” not clauses**
  Every SPA section is treated as a mechanism that can transfer value (purchase price mechanics, definitions, covenants, indemnities, earn-outs, special escrows).
- **They reconcile the SPA to the QoE bridge + balance sheet reality**
  Great analysts keep a mental (or explicit) map: EBITDA → normalized EBITDA → implied EV → equity bridge (cash, debt-like, NWC, transaction expenses) → net proceeds.
- **They aggressively hunt ambiguity and discretion**
  The best work is finding where language allows _choice_ (timing, classification, accounting policy elections, management estimates, “good faith” standards).
- **They read the definitions like an adversary**
  They assume someone will optimize outcomes using classification, timing, “without duplication” carveouts, netting, and accounting principles hierarchy.
- **They identify _where disputes will happen_ and pre-wire solutions**
  They flag not just “risk,” but “this is likely to become a post-close dispute because the process + standards are weak.”
- **They connect the SPA to operational reality**
  E.g., if the business routinely uses factoring, customer prepayments, rebates, consignment inventory, refunds, multi-entity cash pooling—excellent analysts immediately ask: “Where is this captured? Net debt, NWC, or neither?”
- **They quantify “one-time” vs “always”**
  They separate:
  - **one-time** deal leakage (transaction bonuses, advisory fees)
  - **structural** leakage (debt-like items, revenue recognition, deferred revenue treatment)
  - **ongoing** cash-flow effects (NWC peg too high/low).

- **They surface negotiation levers, not just issues**
  “Fix by tightening definition,” “fix by adding example schedule,” “fix by special escrow,” “fix by collar,” “fix by aligning accounting principles.”
- **They are consistent and audit-ready**
  Every conclusion is tied to a specific clause location, with a clean excerpt and an interpretation note (“if X, then Y”).
- **They prioritize ruthlessly**
  Partners don’t want 40 medium points. They want the 5 that change price, certainty, or timeline.

#### Common Mediocrity Traps

- **Clause paraphrasing without consequence** (“reads like a book report”).
- **No quantification** (or fake precision) when the economics are the whole point.
- **Ignoring interactions** between definitions (cash vs net debt vs transaction expenses vs NWC).
- **Missing “process risk”** (who prepares the closing statement, timing, dispute rules, standards of review).
- **Treating GAAP as a single thing** (it’s a framework with choices; “GAAP vs consistent with past practice” is often the real fight).
- **Not challenging “without duplication”** (it’s frequently incomplete and doesn’t prevent practical double-counting).
- **Over-focusing on “market”** and under-focusing on “this business” (a SaaS deferred revenue clause is not a manufacturing clause).
- **Failing to anticipate seller/buyer incentives** (each side will use ambiguity to optimize their outcome).
- **Not tying findings to actions** (what clause change, what schedule, what escrow, what diligence request).

#### What Moves the Needle

- **Definitions that shift equity value by millions**
  - debt-like items included/excluded from Indebtedness
  - treatment of leases (ASC 842 / IFRS 16), factoring, customer deposits, accrued bonuses, taxes, earnouts

- **Working capital target reasonableness + definition alignment**
  A “fair” target with a misaligned definition is not fair. Target and calculation basis must match.
- **Transaction expenses scope**
  If seller expects buyer to absorb items (bonuses, severance, banker fees) that’s immediate purchase price leakage.
- **Accounting principles hierarchy that prevents gamesmanship**
  “GAAP” alone often creates discretion; “consistent with past practice” alone can embed bad practices. The hierarchy matters.
- **Earn-out metric definitions + control covenants**
  Earn-outs frequently turn into disputes because of cost allocations, accounting elections, integration, and reporting/audit rights.
- **Closing statement mechanics that create power imbalance**
  Who prepares, what timeline, what access, what dispute forum, what standards (GAAP? consistency? example schedule?) often matters as much as the numbers.
- **Indemnity structure that changes _recoverability_**
  Caps, baskets, survival, escrows, RWI interplay determine whether a “risk” is actually collectible.

---

## Research Prompt 2: Key Financial Definitions Analysis

Below assumes a completion accounts / purchase price adjustment style SPA (cash-free/debt-free + NWC true-up). Adjust for locked-box deals accordingly.

---

#### Indebtedness

**Typical inclusions:**

- Borrowed money: revolvers, term loans, notes, overdrafts
- Accrued interest, prepayment premiums, breakage fees, make-whole amounts
- Capital leases / finance leases (and sometimes **all** lease liabilities under ASC 842/IFRS 16)
- Letters of credit reimbursement obligations, bankers’ acceptances
- Hedging / swap liabilities (mark-to-market)
- Seller notes, deferred purchase price, contingent consideration (sometimes)
- Intercompany debt-like balances (sometimes)
- Unpaid taxes (sometimes included as debt-like)
- Pension deficits / underfunded obligations (more common in larger deals)

**Buyer-favorable additions:**

- Include **transaction-triggered** fees: breakage, change-of-control payments, refinancing fees
- Include **off-balance-sheet / quasi-debt**: factoring/receivables financing, supply chain finance, customer financing arrangements
- Include **accrued but unpaid** interest/fees “through closing”
- Include **deferred compensation** and certain employee liabilities as debt-like _if excluded from NWC_ (must be coordinated to avoid double-counts)
- Include **unpaid taxes** (or at least non-income tax arrears) as debt-like where NWC excludes tax items

**Seller-favorable exclusions:**

- Exclude lease liabilities (or limit to “capital leases” only)
- Exclude change-of-control premiums / prepayment penalties unless actually incurred
- Exclude intercompany items that will be settled pre-close
- Exclude “trade payables incurred in ordinary course” explicitly (to keep AP in NWC)
- Exclude deferred revenue / customer deposits (seller argument: operating, not financing)

**Double-count risks:**

- **Accrued interest** in Indebtedness and also in NWC accrued liabilities
- **Employee bonuses/severance** included in Indebtedness and also in Transaction Expenses and/or NWC
- **Unpaid taxes** included in Indebtedness and also in Transaction Expenses tax gross-ups or NWC accruals
- **Debt-like working capital items** (e.g., customer deposits) included in Indebtedness but also reflected in NWC current liabilities

**Gap risks:**

- Factoring/supply chain finance not captured as “borrowed money” if the definition is narrow
- Guarantees, letters of credit, surety bonds—if only “amounts outstanding” are captured, not contingent obligations
- Change-of-control fees sitting in contracts but not booked yet (timing gap)

**Market standard benchmark:**

- “Borrowed money + accrued interest + capital/finance leases + LOC reimbursement + hedging liabilities” is common.
- More aggressive: sweeping in broad employee liabilities, taxes, deferred revenue/customer deposits, and transaction-triggered premiums.

**Red flag language:**

- “**all liabilities of any kind** whether current or non-current” (overbroad)
- “including **without limitation**…” followed by items that belong in NWC
- “**whether or not incurred**” (can scoop hypothetical/contingent amounts)
- Missing “**without duplication**” _and_ missing tie-break rules against NWC/transaction expenses

**Key questions to ask:**

- Are leases treated as debt? Only capital/finance leases or all lease liabilities?
- Are factoring / SCF / receivables financing captured?
- Are customer deposits/deferred revenue treated as debt-like or working capital?
- Are transaction-triggered premiums included even if not paid at close?
- Are intercompany balances included, and will they be settled pre-close?
- How are unpaid taxes treated (NWC vs debt vs separate tax indemnity)?

---

#### Cash

**Typical inclusions:**

- Cash on hand, petty cash
- Demand deposits, bank balances
- Short-term cash equivalents (T-bills, money market funds) meeting definition
- Checks received but not yet deposited (sometimes)

**Buyer-favorable additions:**

- Include cash in transit / deposits in transit / undeposited receipts
- Include marketable securities / short-term investments as cash equivalents
- Include restricted cash **if** it will be released for buyer benefit (rare; usually seller-favorable to include, buyer-favorable to exclude unless truly available)

**Seller-favorable exclusions:**

- Exclude restricted cash, trapped cash, cash in foreign subs with repatriation costs
- Exclude cash required to fund specific liabilities (payroll, tax escrow, customer refunds)
- Net out overdrafts against cash (seller-favorable if overdrafts exist)
- Exclude “minimum cash” or “operating cash” to leave in business (common in some sectors)

**Double-count risks:**

- Cash netting against overdrafts while overdrafts are also counted in Indebtedness
- Including “cash equivalents” that are already captured elsewhere (e.g., securities treated as investment assets in NWC schedules)

**Gap risks:**

- Cash pooling / sweeping arrangements where legal entity cash is not clear
- Trapped cash/repatriation withholding not addressed (economic leakage)

**Market standard benchmark:**

- “Cash and cash equivalents” often, but **restricted cash usually excluded** unless clearly available.
- Netting overdrafts is negotiated; buyers often want overdrafts in debt, not netted in cash.

**Red flag language:**

- “cash **net of** overdrafts” (can reduce debt capture)
- “cash **free and clear** of liens” (sounds fine, but can exclude real cash if bank has setoff rights)
- “cash equivalents **as determined by buyer**” (discretion risk)

**Key questions to ask:**

- Are overdrafts treated as debt or netted against cash?
- How is restricted/trapped cash treated?
- Are deposits in transit/undeposited checks included?
- Are cash equivalents clearly defined (tenor, liquidity, classification)?
- Is there a separate “minimum cash” concept?

---

#### Working Capital

**Typical inclusions:**

- Current assets (excluding cash): AR (net), inventory, prepaid expenses, other current assets
- Current liabilities: AP, accrued expenses, accrued payroll (sometimes), other current liabilities
- Often **excludes**: cash, indebtedness, income taxes, and transaction expenses (but this must be explicit)

**Buyer-favorable additions:**

- Include more current liabilities: accrued bonuses, commissions, vacation/PTO, customer rebates/returns reserves, warranty reserves (if current)
- Exclude more current assets: exclude deferred tax assets, exclude related-party receivables, tighten “collectible” AR
- Explicitly include **adequate reserves** (AR allowance, inventory obsolescence) on specified methodologies
- Exclude items likely to inflate NWC artificially (e.g., extraordinary prepaids)

**Seller-favorable exclusions:**

- Exclude deferred revenue/customer deposits from current liabilities (big in SaaS)
- Exclude accrued payroll/bonus/severance from current liabilities (push to transaction expenses or seller responsibility elsewhere)
- Include broader current assets (including tax refunds receivable, related-party receivables)
- “Consistent with past practice” when past practice produces higher NWC (e.g., light reserves)

**Double-count risks:**

- Accrued compensation also treated as transaction expenses
- Taxes excluded from NWC but also not captured as debt or tax indemnity
- Deferred revenue excluded from NWC while buyer assumes service obligation (economic gap)

**Gap risks:**

- If NWC excludes tax-related items, you must confirm where tax accruals/refunds go (often separate tax indemnity)
- Customer deposits / deferred revenue treatment can leave an unpriced obligation
- If “transaction expenses” are excluded from NWC but the definition is incomplete, some deal costs can remain in NWC and be double-hit

**Market standard benchmark:**

- Common shorthand: current assets (ex-cash) minus current liabilities (ex-debt). ([Clearly Acquired][1])
- The _real_ market standard is: **attach a sample schedule** and a hierarchy (example schedule → specific policies → GAAP → consistent with past practice).

**Red flag language:**

- “Working Capital shall be calculated in accordance with GAAP” with no “consistent with past practice” or example schedule (discretion)
- “shall exclude all accruals relating to…” without specifying where they go (gap risk)
- Silence on reserves (invites disputes)

**Key questions to ask:**

- Exactly which accounts are in/out? Is there a sample calculation exhibit?
- Are deferred revenue/customer deposits included? If excluded, how is the obligation priced?
- Are taxes excluded—if yes, where do tax accruals/refunds land?
- Are reserves explicitly required and on what basis?
- Is NWC measured at close consistent with how the target/peg was computed?

---

#### Transaction Expenses

**Typical inclusions:**

- Banker fees, legal/accounting diligence fees, QoE fees
- Success fees, change-of-control payments, retention/stay bonuses tied to deal
- Severance and related payroll taxes triggered by transaction
- Equity plan payouts, option cancellation payments, phantom equity
- Financing fees if target is paying them (bridge fees, lender fees)
- Sale process costs charged to target

**Buyer-favorable additions:**

- Broad inclusion of all deal-related costs “incurred or to be incurred” by target
- Include unpaid amounts through closing (even if invoiced after close)
- Include related payroll taxes on bonuses/severance
- Include break fees / tail fees triggered by deal

**Seller-favorable exclusions:**

- Limit to amounts “actually invoiced and unpaid at closing”
- Exclude items if already accrued in NWC (but must be coordinated carefully)
- Exclude buyer’s costs (obviously) and sometimes shared costs
- Exclude costs covered by RWI or otherwise reimbursed

**Double-count risks:**

- Bonuses/severance in both transaction expenses and NWC accrued liabilities
- Advisory fees accrued in NWC and also in transaction expenses
- Debt extinguishment fees counted in indebtedness and also transaction expenses

**Gap risks:**

- Tail fees that arise after close but relate to pre-close engagement
- Carve-out stranded costs not contemplated
- Taxes on transaction bonuses not captured anywhere

**Market standard benchmark:**

- Market often expects **seller pays seller-side deal costs**, but “what counts” is heavily negotiated.
- Tight drafting plus a schedule of known fees reduces disputes.

**Red flag language:**

- “Transaction Expenses means fees **related to the transaction**” (too vague)
- No “to the extent not included in Working Capital or Indebtedness” coordination
- Excluding “any costs incurred in the ordinary course” (can be abused)

**Key questions to ask:**

- Do transaction expenses include severance/bonuses? Are payroll taxes included?
- Are financing/refinancing fees included if target pays them?
- Are tail/success fees captured even if invoiced after closing?
- How are transaction expenses prevented from double-counting with NWC/debt?

---

#### Accounting Principles

**Typical inclusions:**

- GAAP/IFRS requirement, often “consistently applied”
- “Consistent with past practice” overlay
- Specific policies: revenue recognition, reserves, inventory costing, capitalization, accrual cutoffs
- Priority/hierarchy clause: example schedule → specific principles → GAAP → past practice (or vice versa)

**Buyer-favorable additions:**

- Explicit reserve methodologies (AR allowance, inventory obsolescence)
- Specific cut-off procedures (“as of 11:59pm on Closing Date”)
- No unilateral discretion; detailed principles and sample schedules
- Tie-breaker: buyer’s calculation unless disputed + independent accountant standard

**Seller-favorable exclusions:**

- High reliance on “consistent with past practice” (if past practice is seller-friendly)
- Silence on specific policies (creates discretion and negotiation leverage later)
- Broad materiality qualifiers in accounting standards for closing statement

**Double-count risks:**

- If principles require accruals that also show up as transaction expenses/debt-like without coordination language

**Gap risks:**

- Principles omit treatment for a known complex area (rebates, deferred revenue, multi-entity allocations)

**Market standard benchmark:**

- Pure “GAAP” is often **not** enough; disputes frequently come from GAAP flexibility. A hybrid with a sample exhibit is more robust.

**Red flag language:**

- “GAAP **as interpreted by** Buyer/Seller” (unbounded discretion)
- “consistent with past practice” when past practice is not documented (creates argument, not certainty)
- No hierarchy when GAAP conflicts with past practice

**Key questions to ask:**

- Is there a sample closing statement / illustrative schedule?
- What’s the hierarchy if GAAP conflicts with past practice?
- Are key judgment areas (reserves, cut-off, revenue recognition) explicitly defined?
- What is the standard of review for the independent accountant (GAAP? consistency? “not inconsistent with”?)?

---

## Research Prompt 3: Purchase Price Mechanics & Analysis

#### Purchase Price Components Taxonomy

- **Enterprise Value / Base Purchase Price**: stated headline value, often cash-free/debt-free.
- **Equity Value Bridge Components**
  - **+ Cash** (as defined)
  - **– Indebtedness / Net Debt** (as defined)
  - **± Working Capital adjustment vs target**
  - **– Transaction expenses** (if paid by target or deducted)

- **Closing Estimate vs Final True-Up (Completion Accounts)**: estimated values at closing, final post-close determination.
- **Escrow(s)**
  - General indemnity escrow
  - PPA/adjustment escrow (to secure true-up)
  - Special escrows (tax, litigation, environmental, etc.)

- **Holdback** (similar to escrow but held by buyer directly)
- **Deferred Consideration / Seller Note**: paid over time, may bear interest, may have security/offset rights.
- **Earn-out / Contingent Consideration**: future payment based on performance or milestones.
- **Rollover Equity / Reinvestment**: seller rolls proceeds into buyer/newco equity.
- **Assumption/Payoff of Debt at Closing**: who pays, from what funds, and whether it’s reflected in the equation.
- **Purchase Price Allocation adjustments / Post-close tax items**: sometimes separate mechanism.
- **Adjustments for leakage / locked-box interest (locked-box deals)**: price locked at historical date, with permitted leakage and interest-like adjustments.
- **FX adjustment / cash pooling true-ups** (cross-border)
- **Working capital collar/cap**: de minimis band for no adjustment.

#### Key Terms per Component

- **Base price / EV**
  - Stated amount, currency, whether “enterprise value” or “equity value”
  - Cash-free/debt-free assumption explicitly stated or implied

- **Cash**
  - Inclusions/exclusions, restricted cash, overdraft netting, trapped cash

- **Indebtedness / Net Debt**
  - Scope (leases, factoring, derivatives, taxes, employee liabilities), treatment of transaction-triggered fees

- **Working capital adjustment**
  - Definition, included accounts, exclusion of cash/debt/transaction expenses/taxes
  - Target/peg amount and how determined
  - Collar/cap (if any)

- **Transaction expenses**
  - Scope (bonuses, severance, tail fees), timing (“incurred” vs “paid”)

- **Closing estimate / final true-up**
  - Who prepares (buyer vs seller), timing (delivery, review, objection), dispute resolution (independent accountant), standards/hierarchy

- **Escrow/holdback**
  - Amount (%), duration, release schedule, claim process, whether it secures indemnity and/or PPA
  - Market reference: median general indemnity escrow **~10% without RWI**; with RWI median escrow can drop materially (reported medians around **0.5%**) ([SRS Acquiom][2])
  - PPA/adjustment escrows often discussed around **~1% “rule of thumb”** in some market commentary ([Goodwin Law Firm][3])

- **Earn-out**
  - Metric definition, period, payment frequency, caps/floors, accounting policy control, audit/reporting rights, acceleration triggers
  - Market commentary often references earn-outs as **~15–30%** of total consideration in lower middle-market situations, with periods commonly around **1–3 years** and some data citing median performance periods around **24 months** ([Whiteford Law][4])

- **Deferred consideration / seller note**
  - Amount, maturity, interest rate, security, subordination, offset rights, acceleration/default terms

- **Rollover equity**
  - % rolled, valuation basis, governance, vesting/lock-ups, liquidity rights, drag/tag

- **Special escrows / indemnity structure**
  - Cap, basket, survival, fraud carve-outs, RWI interplay, who is the claims party
  - Market references often show common survival windows around **12–18 months** for general reps in many private deals (with variation when RWI is used) ([Fasken][5])

#### Purchase Price Equation Format

A partner should get this in ~30 seconds:

1. **Headline**

- “Enterprise Value: $X (cash-free/debt-free).”

2. **Bridge to Equity Value / Closing Proceeds**

- “Equity Value = EV **+ Cash – Debt-like items ± NWC true-up – Transaction expenses** (all per SPA definitions).”

3. **Timing & Security**

- “Paid at closing: $A, less escrows/holdbacks of $B, plus deferred/earn-out potential up to $C.”

4. **Control & Dispute Mechanics**

- “Buyer prepares closing statement within ** days; seller has ** days to dispute; independent accountant resolves under \_\_ standard.”

_(If you want a one-liner template for your GPT output: “EV $X → Equity bridge (+Cash – Debt ± NWC – Txn Exp) → Closing cash paid $A (escrow/holdback $B; deferred $D; earn-out up to $E).”)_

#### Common Mistakes

- Confusing **enterprise value** vs **equity value** (and not bridging cleanly).
- Treating “net debt” as a single number when the SPA defines it as a _composition of definitions_ (cash + indebtedness + sometimes transaction expenses).
- Missing that **who prepares the closing statement** can swing outcomes (process power).
- Missing double counts between NWC vs debt-like vs transaction expenses.
- Assuming “GAAP” eliminates discretion (it often creates it).
- Not catching **timing** mismatches (incurred vs paid vs accrued vs billed).
- Ignoring collars/caps that change whether small deltas matter.

#### Market Benchmarks

Use these as “smell tests,” not rules:

- **General indemnity escrow**: medians often reported around **~10% (no RWI)**; **sub-1%** when RWI is used in many deals. ([SRS Acquiom][2])
- **R&W survival (general reps)**: commonly **12–18 months** in many private deal studies, with more “no survival stated” in RWI-heavy deals. ([Fasken][5])
- **Working capital true-up timing**: many market references describe final true-up windows commonly **~60–90 days post-close**. ([Whiteford Law][6])
- **Earn-out sizing/periods**: often cited **~15–30%** of consideration in lower middle-market contexts; periods commonly **1–3 years**, and some data points cite **~24-month** medians. ([Whiteford Law][4])
- **Adjustment escrows**: often discussed around **~1%** “rule of thumb,” with variation by deal size. ([Goodwin Law Firm][3])

---

## Research Prompt 4: Working Capital vs Net Debt Adjustment

#### Bucket Placement Framework

A practical decision tree (works well for analysts):

1. **Is it cash or a cash equivalent?**

- Yes → **Cash** (unless restricted/trapped → treat per definition; often excluded)

2. **Is it financing / debt-like (capital provider claim) OR a substitute for borrowing?**
   Examples: borrowed money, finance leases, seller notes, factoring/SCF, hedges, LOC reimbursement, change-of-control debt fees

- Yes → **Net Debt / Indebtedness**

3. **Is it an operating timing item that reverses naturally with the working capital cycle?**
   Examples: trade AR/AP, inventory, accruals tied to operations, routine prepaid/other current items

- Yes → **NWC**

4. **Is it a deal-specific cost or transaction-triggered payment (one-time) caused by the sale?**
   Examples: banker fees, deal bonuses, severance triggered by closing, tail fees

- Yes → **Transaction Expenses**

5. **If it could be more than one bucket:**

- Default rule: **pick one bucket and explicitly exclude from the others** (“to the extent included in NWC, excluded from Debt,” etc.)
- Best practice: **attach a mapping schedule** (account-by-account) to kill ambiguity.

#### Classic Disputed Items

- **Deferred revenue / customer deposits**: NWC vs debt-like (biggest in SaaS).
  Typical resolution: define explicitly + include illustrative schedule; sometimes partial inclusion.
- **Accrued bonuses/commissions**: NWC vs transaction expense (if deal-triggered).
  Typical resolution: split deal-triggered vs ordinary course; prevent double count.
- **Sales tax/VAT/GST payable**: NWC vs debt vs tax indemnity.
  Typical resolution: exclude income taxes from NWC but include certain indirect taxes in NWC (or capture in separate tax indemnity).
- **Factoring / supply chain finance**: debt-like vs NWC (AP/AR presentation).
  Typical resolution: treat as debt-like if it functions as borrowing.
- **Lease liabilities** (ASC 842 / IFRS 16): debt-like vs excluded entirely.
  Typical resolution: depends on valuation model; if EV assumed “debt-free” but buyer values leases separately, can be contentious.
- **Intercompany balances**: debt-like vs working capital vs settled pre-close.
  Typical resolution: require settlement pre-close, or include in debt-like.
- **Reserves** (AR allowance, inventory obsolescence, warranty, returns): methodology disputes.
  Typical resolution: specify principles, consistency, and sample schedule.

#### Double-Count Detection Checklist

Check these combinations explicitly:

- **Accrued interest** included in Indebtedness **and** in NWC accrued liabilities
- **Overdrafts** netted in Cash **and** included in Indebtedness
- **Transaction bonuses/severance** included in Transaction Expenses **and** in NWC accrued payroll
- **Deal fees** included in Transaction Expenses **and** in NWC accrued expenses/AP
- **Debt extinguishment premiums** in Indebtedness **and** Transaction Expenses
- **Taxes** captured in multiple places (debt-like, transaction expense, and/or NWC)
- **Deferred revenue** treated as debt-like while still sitting in NWC current liabilities

#### Gap Detection Checklist

Verify each of the following is captured **somewhere** (NWC, debt-like, transaction expense, or explicit seller retention):

- Factoring/SCF obligations and related fees
- Change-of-control payments (debt breakage, bonuses, option payouts)
- Tail fees/success fees invoiced post-close but earned pre-close
- Trapped cash / repatriation costs (if cross-border)
- Tax accruals/refunds if taxes excluded from NWC
- One-time “stranded costs” / TSA-related charges (if carve-out)
- Off-balance-sheet commitments that become payable at close (termination fees, contract penalties)

#### NWC Target Reasonableness Framework

A “defensible” framework partners trust:

1. **Understand the business’s working capital engine**

- Revenue model (subscription vs project vs product)
- Billing cadence, collection terms, seasonality
- Inventory model (make-to-stock, make-to-order, consignment)

2. **Build a historical baseline that matches the SPA definition**

- Recast monthly NWC using _the same accounts/policies_ as the SPA target and closing calc
- Normalize for one-time items and known carve-outs
- Compute trailing averages (commonly 12/6/3 months depending on seasonality)

3. **Stress-test drivers (days)**

- DSO, DIO, DPO trends and outliers
- Compare to contract terms and operational reality (are payables stretched? are receivables aging worsening?)

4. **Check for “window dressing” risk**

- Unusual AR collections timing, delayed AP payments, inventory purchases deferred pre-close

5. **Align with valuation basis**

- If EV assumed normalized run-rate operations, peg should reflect “normal” operating liquidity, not a seller-optimized closing snapshot.

6. **Assess dispute risk**

- If target is a single point but business is seasonal, consider a collar, seasonal peg, or average-based mechanism.

#### Market Standard Mechanisms

- **True-up timing**: commonly discussed **~60–90 days after closing** for final closing statement delivery/settlement. ([Whiteford Law][6])
- **Dispute process**: objection window (often 30–60 days), then independent accountant/arbitrator; strongest SPAs specify standards and scope.
- **Collars**: used to avoid fighting over small deltas; not universal, but present in a meaningful minority in some datasets. ([Goodwin Law Firm][7])
- **Purchase price adjustments prevalence**: commentary based on SRS Acquiom notes PPAs in **90%+** of private-target deals in recent years. ([Fasken][8])

---

## Research Prompt 5: Earn-Out Provisions

#### Earn-Out Metrics Taxonomy

**Financial metrics**

- **Revenue / Net Revenue / ARR / Bookings**
  - Pros: simpler, earlier visibility
  - Cons: incentivizes low-margin sales; revenue recognition disputes; channel stuffing risk

- **Gross profit / contribution margin**
  - Pros: aligns with value creation better than revenue
  - Cons: allocation disputes (COGS, hosting, fulfillment, rebates)

- **EBITDA / Adjusted EBITDA / EBIT**
  - Pros: closer to value proxy; common
  - Cons: _most dispute-prone_ due to add-backs, allocations, accounting choices, integration charges

- **Net income / EPS**
  - Pros: “bottom line” clarity
  - Cons: heavily affected by non-cash, tax, financing structure; easy to manipulate through policy choices

- **Cash flow metrics** (OCF, FCF)
  - Pros: harder to fake long-term
  - Cons: working capital and capex classification disputes; can punish growth investments

**Operational / milestone metrics**

- Product launch, regulatory approval, clinical milestones (life sciences)
- Customer retention/churn thresholds
- Unit volumes, installs, active users (with tight definitions)
- Contract milestones (e.g., signed customer contracts)

**Hybrid structures**

- Tranches: milestone + financial metric
- Sliding scale: payout increases with performance tiers

#### Buyer Protective Terms

- **Operational control**: freedom to run/integrate the business; no duty to maximize earn-out.
- **Accounting policy control**: define principles; ability to change policies for legitimate reasons (but document).
- **Cost allocation rules**: ability to allocate shared costs, integration costs, corporate overhead (within defined limits).
- **Caps and offsets**: cap total earn-out; offset for indemnity claims or breaches (negotiated).
- **Reporting cadence that’s not overly burdensome**: avoid perpetual audit rights.
- **Dispute resolution with narrow scope**: independent accountant limited to specific disputed items.

#### Seller Protective Terms

- **Covenant of good faith / no intent to avoid** (careful: vague language can still litigate)
- **Specified operating covenants**: maintain product line, minimum resources, salesforce support (if seller risk is being “starved”)
- **Separate books & reporting**: frequent reporting; access to underlying data; audit rights
- **Consistency in accounting**: lock definitions and consistent application; limits on reclassifications
- **Acceleration triggers**: change of control of buyer, discontinuation of product line, termination of key seller managers without cause
- **Right to participate**: board observer, consulting arrangement, approval on extraordinary actions (rare but seen)

#### Common Dispute Sources (ranked by frequency)

1. **Accounting definition ambiguity** (EBITDA add-backs, revenue recognition, reserves)
2. **Cost allocation / overhead / integration charges**
3. **Business management decisions** (resource allocation, bundling, cross-selling, pricing)
4. **Timing and cut-off** (which period a contract/revenue belongs to)
5. **Data access and transparency** (seller can’t verify calculations)
6. **Extraordinary / non-recurring items** (what’s excluded/included)

#### Red Flag Language

- “EBITDA” with **no schedule** and no add-back rules
- “in accordance with GAAP” **without** “consistent with past practice” or a hierarchy
- “Buyer shall use commercially reasonable efforts” (often litigated; unclear standard)
- “shall not take any action _primarily intended_ to reduce earn-out” (hard to prove intent)
- Broad ability to change accounting policies “in Buyer’s sole discretion” with no guardrails
- No audit rights, or audit rights that are so broad they create constant conflict

#### Market Benchmarks

- **Earn-out size**: often cited as **~15–30%** of total consideration in lower middle-market deals (can be higher where uncertainty is high). ([Whiteford Law][4])
- **Earn-out period**: commonly referenced **1–3 years**, with some sources/data citing medians around **24 months** outside certain sectors. ([Harvard Law Forum][9])

#### Must-Flag Checklist

- Metric definitions missing (especially EBITDA adjustments and revenue recognition).
- Who controls accounting policies during the earn-out period.
- Any integration rights that will make tracking ambiguous (shared services, cross-charges).
- Reporting frequency, detail level, and seller audit/access rights.
- Dispute forum and standard (independent accountant scope).
- Acceleration triggers and termination effects.
- Caps/floors and whether partial achievement pays pro-rata.
- Treatment of acquisitions/divestitures during earn-out period.
- Any buyer offset rights against earn-out for indemnity claims (economic linkage).

---

## Research Prompt 6: Reps & Warranties (Financial Focus)

#### Financial DD-Relevant Reps (ranked by importance with what to look for in each)

1. **Financial Statements**
   - What periods covered; GAAP/IFRS; “fairly present” vs merely “prepared in accordance”
   - Consistency language and whether interim statements have same rigor

2. **Undisclosed Liabilities**
   - Carve-outs: ordinary course, GAAP reserves, known liabilities on schedules
   - Watch for “materiality” and “knowledge” qualifiers

3. **Books & Records**
   - Are books “true, complete, and accurate” vs “maintained in all material respects”

4. **Absence of Certain Changes / Interim Operations**
   - Has the business operated in ordinary course between date X and closing?

5. **Accounts Receivable**
   - Collectibility qualifiers; related-party receivables; reserve adequacy

6. **Inventory**
   - Obsolescence; reserves; valuation method; consignment/3PL situations

7. **Taxes**
   - Filing, payment, audits, reserves; whether taxes are handled via separate indemnity

8. **Compliance with Laws (financially relevant subsets)**
   - Anti-corruption, sanctions, payroll/tax compliance, regulatory fines exposure

9. **Contracts with financial impact**
   - Customer/supplier terms, rebates, refunds, warranty obligations

10. **Employee matters (financially relevant)**

- Bonuses, severance, benefit plan funding, classification issues (contractors)

#### Qualifier Weakening Patterns

- **Knowledge qualifiers**: “to Seller’s knowledge” (turns strict liability into a science project)
- **Materiality qualifiers**: “in all material respects” (harder to claim)
- **MAE/MAE-like qualifiers**: “except as would not reasonably be expected to have an MAE”
- **Disclosure schedule qualifiers**: “except as set forth on Schedule…” (can bury meaningful exceptions)
- **Time qualifiers**: “since the date of the Latest Balance Sheet…” (short window)

How to spot quickly:

- Search for: “knowledge,” “material,” “MAE,” “except,” “set forth,” “to the extent,” “ordinary course.”

#### Onerous vs Weak Spectrum

**Unusually onerous (seller-hostile):**

- “Financial statements are **true, correct and complete**” (rare; “fairly present” is more typical)
- No materiality qualifiers anywhere + long survival + high cap (economic exposure)
- Undisclosed liabilities rep with minimal carve-outs (sweeping)

**Unusually weak (buyer-hostile):**

- Financial statements rep limited to “prepared from the books” with no fair presentation
- Undisclosed liabilities rep heavily carved out (“ordinary course,” “known,” “reserved,” “immaterial”)
- Knowledge qualifiers on core financial reps

#### Reps-Indemnification Connection

What an FDD analyst needs to know:

- **Reps define the “breach hooks”**; indemnity provisions define **recoverability** (cap, basket, survival, escrow, RWI).
- A strong rep with a 12-month survival may be useless for a liability that surfaces in month 18.
- Some risks should be pushed into **special indemnities or special escrows** rather than relying on general reps.
- **Purchase price adjustments are not indemnity.** They solve different problems (timing/measurement vs breach).
- If **RWI** is used, reps may be broader but survival may be “no survival” in the SPA (policy controls recovery instead). ([Fasken][5])

#### Market Standard Survival Periods

Common reference points in many private deal studies / market commentary:

- **General reps**: often **12–18 months** ([Fasken][5])
- **Fundamental reps** (title, authority, capitalization): longer (often multiple years / statute of limitations; frequently effectively uncapped for fraud—deal-specific)
- **Tax reps**: often longer (commonly tied to tax statutes; varies by jurisdiction and structure)

_(You’ll still want your GPT to phrase these as “often seen” and prompt the user to confirm the actual clause.)_

#### Flag for Legal Review

- Any limitation that makes recovery unrealistic (very low cap, short survival) _combined with_ known diligence risks
- Any “anti-reliance / non-reliance” clause affecting extra-contractual statements
- Fraud definitions and fraud carve-outs (who can claim, what standard)
- MAE definition and its carve-outs (industry-wide, macro, pandemics, etc.)
- Sandbagging / anti-sandbagging language
- Any rep tied to accounting methodology disputes (financial statement rep wording, disclosure schedule exceptions)

---

## Research Prompt 7: Key Commercial Term Extraction

#### Top 20 Commercial Terms (ranked list with extraction requirements for each)

1. **Transaction structure** (share sale vs asset sale; entities; jurisdiction)
   - Parties, target entities, what’s being acquired

2. **Headline price & value basis**
   - EV vs equity value; currency; “cash-free/debt-free” stated?

3. **Purchase price adjustments (what exists?)**
   - NWC true-up? net debt? cash? transaction expenses? locked-box?

4. **Definitions summary: Indebtedness**
   - Major inclusions/exclusions; debt-like “surprises”

5. **Definitions summary: Cash**
   - Restricted cash, overdraft netting, trapped cash

6. **Definitions summary: Working Capital**
   - Included accounts; taxes/deferred revenue/leases treatment

7. **Working capital target / peg and how set**
   - Amount, reference period, seasonality considerations, collar/cap

8. **Transaction expenses treatment**
   - What costs are deducted; bonuses/severance included?

9. **Estimated closing statement mechanics**
   - Who prepares estimate; timing; agreed form?

10. **Final true-up mechanics**

- Deadline (often 60–90 days discussed in market references), review/objection periods ([Whiteford Law][6])

11. **Dispute resolution for adjustments**

- Independent accountant? scope? standards/hierarchy?

12. **Escrow / holdback**

- Amount (%), duration, release schedule, claim process

13. **Indemnification cap / basket / deductible**

- Percent of price; tipping vs deductible; exclusions (fraud/fundamental)

14. **Survival periods**

- General reps survival; fundamental/tax survival

15. **RWI (if any)**

- Who buys; retention; exclusions; impact on escrow

16. **Earn-out (if any)**

- Metric, period, cap, payment timing, controls/audit rights

17. **Closing conditions**

- Regulatory approvals, third-party consents, financing condition (rare in PE but exists)

18. **Interim operating covenants**

- Ordinary course, consent rights, restrictions on leakage

19. **Employee/management terms**

- bonuses, retention, severance, new employment agreements (what is seller-funded vs company-funded)

20. **Termination rights & breakup protections**

- Termination triggers, outside date, reverse breakup fee, specific performance

#### Summary Format Recommendation

For a time-pressed partner / IC, the most usable format is:

- **One-page “Deal Economics + Risk Allocation” table**
  - Left column: term
  - Middle: what SPA says (numbers + key language summary)
  - Right: “So what?” (economic impact, negotiation angle, diligence actions)

Plus:

- **Top 5 Issues / Negotiation Levers** (bullets)
- **Open Items / Ambiguities to Resolve** (bullets with clause references)

#### Commonly Missed Terms

- Overdraft netting (cash vs debt)
- Treatment of deferred revenue/customer deposits
- Transaction bonuses/severance hidden inside “transaction expenses” or “indebtedness”
- Accounting principles hierarchy (example schedule vs GAAP vs past practice)
- Independent accountant scope (can’t decide policy vs can decide everything)
- Special escrows (tax, litigation) that materially affect proceeds
- Any “minimum cash” or “cash left in business” concept
- Timing of “incurred” vs “paid” transaction expenses

---

## Research Prompt 8: Redline/Version Comparison

#### Change Categories (ranked by materiality)

1. **Purchase price mechanics and definitions** (cash/debt/NWC/expenses; accounting principles)
2. **Indemnification economics** (cap, basket, survival, escrow size/duration, fraud carve-outs)
3. **Earn-out / contingent consideration** (metrics, control, audit, dispute terms)
4. **Closing conditions & termination** (financing, regulatory, outside date, breakup fees)
5. **Interim covenants** (ordinary course restrictions, consent rights; leakage)
6. **Special indemnities / special escrows**
7. **Reps & warranties scope and qualifiers** (knowledge/materiality/MAE)
8. **Dispute resolution / governing standards** (independent accountant, arbitration)
9. **Operational/commercial covenants** (non-compete, non-solicit, TSA obligations)
10. **Boilerplate that becomes non-boilerplate** (non-reliance, sandbagging, notices, limitations)

#### Redline Summary Format

A format partners actually use:

- **Exec Summary (10 bullets max)**
  “What changed that affects economics, risk, or timeline.”

- **Change Log Table (prioritized)**
  Columns:
  - Section / clause reference
  - Topic category
  - What changed (plain English)
  - Buyer vs seller impact
  - Severity (High/Med/Low)
  - Action (accept / counter / investigate / escalate)

- **“Silent-but-deadly” scan results**
  One mini-section listing sleeper changes (see below).

#### "Sleeper" Changes (minor-looking but material)

- Adding “**in all material respects**” to key financial reps
- Adding “**to Seller’s knowledge**” to undisclosed liabilities
- Changing “**shall**” to “**may**” in information access / audit rights
- Changing accounting standard from “GAAP consistent with past practice” to “GAAP” (or vice versa)
- Adding “**net of**” language (netting overdrafts, netting taxes, netting reserves)
- Moving a defined term between buckets (e.g., excluding certain accruals from NWC without specifying where they go)
- Tightening timelines (shorter dispute period) or expanding buyer discretion (“reasonable determination by Buyer”)

#### Right Level of Detail

- Don’t summarize every comma change.
- Do summarize every change that affects:
  - **price equation**
  - **recoverability**
  - **control/discretion**
  - **timing/process power**

- A good test: “Could this change move value by >$250k (or >0.25–0.5% of EV) OR increase dispute risk materially?” If yes, include.

#### Prioritization Framework

When there are hundreds of edits:

1. Filter for changes in **defined terms** (cash, debt, working capital, expenses, GAAP/principles).
2. Filter for changes in **numbers** (caps, baskets, escrows, targets, thresholds).
3. Filter for changes in **discretion language** (“reasonable,” “sole discretion,” “good faith,” “commercially reasonable efforts”).
4. Filter for **timelines and process** (delivery dates, objection periods, dispute forum).
5. Then scan reps/qualifiers and termination/conditions.

---

## Research Prompt 9: Negotiation Roleplay

#### Standard Arguments by Topic

**1) Purchase price adjustments & definitions**

- Buyer: “We priced EV assuming cash-free/debt-free and normal working capital—definitions must prevent leakage.”
- Seller: “We’re delivering the business as run; definitions should reflect historical practice and avoid post-close nickel-and-diming.”

**2) Working capital target**

- Buyer: “Target must reflect normalized needs; we won’t fund an immediate cash injection post-close.”
- Seller: “We won’t leave excess capital; peg should match seasonal reality and historical averages.”

**3) Cash**

- Buyer: “Restricted/trapped cash isn’t usable; overdrafts should be debt.”
- Seller: “Cash is cash; if it’s on the balance sheet, you’re buying it.”

**4) Indebtedness**

- Buyer: “Debt-like items must be captured (leases, factoring, hedges, change-of-control fees).”
- Seller: “Those are operating items/known items already in working capital or ordinary course.”

**5) Transaction expenses**

- Buyer: “Seller’s sale process costs shouldn’t reduce what we buy; they should reduce seller proceeds.”
- Seller: “Some costs are company costs; don’t double-charge us.”

**6) Indemnification (cap/basket/survival/escrow)**

- Buyer: “We need meaningful recourse—cap and survival must cover real risk.”
- Seller: “We need a clean exit—limit survival, cap liability, and rely on RWI.”

**7) Earn-out**

- Buyer: “We need operational freedom; earn-out must not handcuff integration.”
- Seller: “We need protection against being starved or accounting changes.”

**8) Reps & qualifiers**

- Buyer: “Core financial reps should be strong and not knowledge-qualified.”
- Seller: “We can’t guarantee beyond our knowledge; materiality/MAE qualifiers are market.”

**9) Closing conditions / termination**

- Buyer: “Need conditions for regulatory/consents; sometimes financing.”
- Seller: “Certainty matters—limit conditions, add reverse breakup fee, tighten outside date.”

#### Common Fallbacks

- Buyer concedes: narrower debt-like list **if** NWC definition includes the item clearly (or special escrow exists).
- Seller concedes: stronger definitions **if** cap/survival is tighter or RWI is used.
- Buyer accepts “consistent with past practice” **if** there’s a detailed sample schedule and reserve methodologies.
- Seller accepts a larger escrow **if** duration is shorter or release is staged.

#### Typical Trade-Offs (package deals)

- “Broader debt-like definition” ↔ “lower indemnity cap / shorter survival”
- “Tighter transaction expenses definition” ↔ “higher NWC target or collar”
- “Earn-out operational covenants” ↔ “lower earn-out cap / shorter period”
- “Higher escrow” ↔ “lower basket” (or vice versa)
- “GAAP controls” ↔ “seller gets sample exhibit protections”

#### Posturing vs Red Lines

How to tell:

- **Posturing** often comes with: vague justifications (“market”), no linkage to a specific risk, willingness to discuss alternatives.
- **Red lines** usually come with: clear internal constraint (IC requirement, financing lender requirement, RWI underwriting requirement), and a specific “must-have” outcome.
- Practical tip for roleplay: force each side to answer, “What problem are you solving?” If they can’t, it’s probably posture.

#### Roleplay Structure

- Step 1: **Set deal context** (PE vs strategic, leverage level, RWI yes/no, timeline pressure).
- Step 2: **Pick 3–5 battleground topics** (don’t do all at once).
- Step 3: For each topic:
  - Opening ask (buyer/seller)
  - Likely pushback
  - Data-backed argument (what the business reality is)
  - Two fallback options
  - One trade to offer

- Step 4: End with **term sheet recap** (what moved, what’s open, what needs diligence input).

---

## Research Prompt 10: Output Format & Presentation

#### Format Recommendations

What senior people actually use:

- **1-page executive summary** (bullets, not prose)
- **Deal economics table** (purchase price equation + key definitions + escrows/earnout)
- **Issues matrix** (prioritized, with “so what” and “ask”)
- **Appendix for clause excerpts** (only for critical items; keep it navigable)

A structure that works extremely well:

- **Top 5 Findings (each with impact + recommendation)**
- **Deal Math Bridge (EV → equity proceeds)**
- **Risk Allocation Snapshot (cap/basket/survival/escrow/RWI)**
- **Open Questions / Diligence Requests**

#### Length Guidelines

- **Partner glance (2–5 minutes):** 1–2 pages max + one table
- **Deal team deep-dive:** 5–10 pages + targeted excerpts
- **Technical appendix:** as long as needed, but only for disputed/complex definitions and sample schedules

#### Actionable vs Informational

Actionable findings include:

- **A consequence** (“could reduce proceeds by ~$X”)
- **A lever** (“tighten definition,” “add schedule,” “special escrow,” “collar,” “clarify hierarchy”)
- **A diligence ask** (“need AR aging by entity,” “need bonus plan terms,” “need debt schedule with payoff letters”)
- **An owner + timing** (legal vs finance vs tax; before signing vs before close)

Informational findings just restate language.

#### Severity Communication

Use a simple, consistent visual language:

- **High / Medium / Low** plus **$ magnitude** (or range)
- Icons or tags: **$**, **⚖️** (dispute risk), **⏱️** (timing), **🔒** (control/discretion)
- Put **High** items first; don’t bury them in the middle.

#### Common Presentation Mistakes

- Treating everything as equal priority.
- Dumping long clause excerpts with no interpretation.
- No “so what” and no recommended fix.
- Not distinguishing **price impact** vs **recoverability** vs **process power**.
- Overusing jargon (“GAAP consistency”) without showing the practical implication.

---

## Research Prompt 11: Prompt Engineering for Document Analysis

#### Prompt Structure Recommendations

Patterns that consistently produce strong SPA analysis:

1. **Extract → Normalize → Analyze → Recommend**

- **Extract**: pull verbatim definitions/clauses + section refs
- **Normalize**: convert into structured fields (lists of inclusions/exclusions, timelines, parties)
- **Analyze**: identify ambiguity, double-count/gap risks, buyer/seller skew, quantify where possible
- **Recommend**: propose negotiation edits + diligence questions

2. **Role + task + constraints + output schema**

- “You are an FDD manager. Use only the provided text. If not found, say ‘Not found.’ Output JSON with these keys…”

3. **Two-pass “strict then smart”**

- Pass 1: strict extraction with citations
- Pass 2: reasoning _only_ from extracted text (reduces hallucination)

4. **Always force a “Where in document?” field**

- Every key output must include: section number + short excerpt.

#### Citation Accuracy Techniques

For long documents:

- Use a workflow that **stores extracted snippets** with stable identifiers:
  - `{clause_id, section, page, excerpt}`

- In analysis, reference only those stored snippets.
- Require the model to quote **short excerpts** (<=25 words) for each critical claim and attach the clause_id.
- If your system supports it, implement:
  **“No citation → no claim.”**
  If it can’t cite, it must label as “assumption” or “not found.”

#### Hallucination Prevention

- Hard rule: **“Use only the document. No external ‘market’ statements unless explicitly requested.”**
- Add a “Not in document” escape hatch:
  - “If information is missing, output `MISSING` and list questions needed.”

- Use **adversarial self-check** prompts:
  - “List 5 ways this interpretation could be wrong given the language.”

- Make the model separate:
  - **Facts (verbatim)** vs **Interpretation** vs **Recommendation**

- Penalize overreach:
  - “Do not infer line items not stated; instead propose a diligence question.”

#### Structure vs Flexibility Balance

- Keep a **fixed core schema** (so outputs are comparable across SPAs):
  - definitions table, purchase price equation, risks matrix, questions list

- Allow a **flex section**:
  - “Deal-specific anomalies” (e.g., SaaS deferred revenue, carve-out allocations, FX pooling)

- A good compromise: 80% structured, 20% narrative.

#### Chaining Analyses

A reliable chain for SPA FDD review:

1. **Deal structure + headline economics extraction**
2. **Definitions extraction (Cash/Debt/NWC/Txn Exp/Principles)**
3. **Interaction map** (double-count/gap detection)
4. **Purchase price equation summary**
5. **Risk allocation snapshot** (escrow/cap/basket/survival/RWI)
6. **Earn-out analysis (if any)**
7. **Red flags + negotiation asks + diligence requests**
8. **One-page executive summary generation**

Key technique: each step produces a **machine-readable artifact** that the next step consumes (tables/JSON), not freeform prose.

#### Few-Shot & Quality Techniques

- Provide 2–3 **gold-standard examples** of:
  - a good definition summary (with inclusions/exclusions + double-count flags)
  - a purchase price equation summary (EV → equity bridge → timing)
  - a risks matrix with severity and recommended edits

- Include a “bad example” too (and explain why it’s bad): models learn boundaries fast.
- Add “calibration anchors”:
  - example of what “market standard” language looks like vs aggressive language (kept short)

- Use **unit tests in prompts**:
  - “If overdrafts exist and cash is defined net of overdrafts, flag double-count risk.”

---

If you want, I can also convert these into **8 concrete playbooks** (with: trigger conditions, step-by-step workflow, standardized tables/JSON schemas, and a severity scoring rubric) so you can drop them straight into your Custom GPT design.

[1]: https://www.clearlyacquired.com/blog/ultimate-guide-to-working-capital-in-m-a-deals?utm_source=chatgpt.com "Ultimate Guide to Working Capital in M&A Deals"
[2]: https://www.srsacquiom.com/our-insights/ma-escrows-and-payments/?utm_source=chatgpt.com "M&A Escrows & M&A Payments Process"
[3]: https://www.goodwinlaw.com/en/insights/publications/2024/09/insights-privateequity-ma-adjustment-escrows-in-ma?utm_source=chatgpt.com "Adjustment Escrows in M&A: Rethinking the 1% Rule"
[4]: https://www.whitefordlaw.com/news-events/private-company-ma-earn-outs-gravy-on-top?utm_source=chatgpt.com "Private Company M&A - Earn-Outs: Gravy on Top?"
[5]: https://www.fasken.com/en/knowledge/2022/03/key-takeaways-from-the-aba-us-private-m-a-deal-points-study?utm_source=chatgpt.com "Key Takeaways from the ABA US Private M&A Deal Points ..."
[6]: https://www.whitefordlaw.com/news-events/net-working-capital-purchase-price-adjustments-in-ma-deals?utm_source=chatgpt.com "Net Working Capital & Purchase Price Adjustments In M&A ..."
[7]: https://www.goodwinlaw.com/en/insights/publications/2025/10/insights-privateequity-clean-exit-minimizing-post-closing-risk?utm_source=chatgpt.com "The Clean Exit Advantage in M&A Private Equity Deals"
[8]: https://www.fasken.com/en/knowledge/2025/03/key-takeaways-from-srs-acquioms-2024-ma-deal?utm_source=chatgpt.com "Key Takeaways from SRS Acquiom's 2024 M&A Deal ..."
[9]: https://corpgov.law.harvard.edu/2025/07/11/the-art-and-science-of-earn-outs-in-ma/?utm_source=chatgpt.com "The Art and Science of Earn-Outs in M&A"

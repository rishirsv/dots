# Playbook — Core Definitions

## Purchase Price / Consideration [purchase_price_consideration]

Plain-English meaning  
The Purchase Price/Consideration language is the “money math”: what Buyer pays, what gets deducted/added, and when it gets settled. If definitions and mechanics don’t line up, value moves unintentionally.

Typical / Buyer-leaning / Seller-leaning patterns

- Typical: Base price plus/minus Cash, Indebtedness, Net Working Capital true-up, and sometimes Transaction Expenses/Taxes.
- Buyer-leaning: broader deductions, explicit anti-duplication, and tighter linkage between definitions and statements.
- Seller-leaning: narrower deductions, limited set-off, clearer “sole source” recourse for adjustments via escrow.

Pitfalls + drafting tells

- Formula uses “Cash” but defined term is “Closing Cash” (or similar mismatch).
- Escrow is both (i) withheld from price and (ii) an additional payment (double charge).
- No formula-level “without duplication” where overlaps are likely (Taxes/Expenses/overdrafts/intercompany).
- Sign conventions are unclear (Cash added vs subtracted; Net Debt direction).
- Separate purchase vs subscription legs exist, but no bridge/ownership of value drift.

Counsel questions

- Confirm the purchase price formula references the **same Defined Terms** used in Definitions (no silent substitutions).
- Confirm the **sign** and direction of each input (Cash, Indebtedness/Net Debt, Net Working Capital, Transaction Expenses, Taxes).
- Where is the **anti-duplication** rule applied (formula-level vs only inside definitions)?
- Is any escrow/holdback **funded from** the Purchase Price (not in addition), and what does it secure?
- Are any **set-off** rights permitted, and if so, are they limited to determined amounts and the intended fund?

Likely pushback

- “This is already clear in the definitions.”
- “Escrow is just security; it shouldn’t affect the formula.”
- “Set-off is operationally efficient.”

Rebuttals / fallback

- “Clarity here prevents post-close disputes; one sentence avoids double counting and preserves the intended economics.”
- “If escrow is funded from proceeds, the SPA should say so to prevent double charge.”
- “If set-off is needed, limit it to finally determined amounts and (if applicable) to the relevant escrow fund.”

Minimal edits

- ... (–) Indebtedness (±) Net Working Capital (–) Transaction Expenses~~.~~ **, in each case, without duplication.**
- Buyer shall pay the Purchase Price of $\_\_\_ ~~to Seller~~ **to Seller, less the Adjustment Escrow Amount to be deposited with the Escrow Agent at Closing**.
- All amounts payable by Buyer shall be paid ~~subject to any right of set-off~~ **without set-off, except as expressly provided in Section [Purchase Price Adjustment]**.

SPA evidence anchors

- Project Dragon — Section 2.2 (Adjusted Purchase Price mechanics).
- KeyMe — Section 3.4 (purchase price formula ties Cash/Indebtedness/Transaction Expenses/Working Capital).
- Project Skyrocket — Definitions (Adjusted Purchase Price; Purchase Closing Time vs Subscription Closing Time).

---

## Cash (Cash and Cash Equivalents; Restricted Cash) [cash]

Plain-English meaning  
“Cash” defines what counts as cash for the adjustment and how bank timing items (restricted cash, outstanding checks, deposits in transit, overdrafts) are treated. Small drafting choices can swing the adjustment.

Typical / Buyer-leaning / Seller-leaning patterns

- Typical: Cash and cash equivalents, sometimes with specific line-item rules for checks/deposits.
- Buyer-leaning: include Restricted Cash only if freely transferable; overdrafts treated as Indebtedness; explicit cut-off treatment.
- Seller-leaning: include Restricted Cash broadly; overdrafts treated as negative Cash.

Pitfalls + drafting tells

- Restricted Cash is included with no availability test (“trapped cash” risk).
- Overdrafts can be captured in both Cash and Indebtedness (double count).
- Deposits in transit/outstanding checks are ignored (bank cut-off arbitrage).
- Cash is included inside Net Working Capital **and** adjusted separately as Cash.

Counsel questions

- Does “Cash” include Restricted Cash **only to the extent freely transferable** at Closing?
- Are overdrafts/negative balances treated as Cash or Indebtedness (and excluded from the other)?
- How are deposits in transit and outstanding checks treated at the cut-off time?
- Is Cash included in the Net Working Capital calculation (and if so, how is double counting prevented)?

Likely pushback

- “Restricted Cash is still cash on the balance sheet.”
- “Overdrafts aren’t material.”

Rebuttals / fallback

- “If Buyer can’t access it, it isn’t value-equivalent; include only to the extent transferable.”
- “Even immaterial items create disputes if they can be counted twice; route overdrafts to one bucket.”

Minimal edits

- “Cash” means ... including Restricted Cash~~.~~ **, but only to the extent such amounts are freely transferable to Buyer at Closing.**
- For avoidance of doubt, bank overdrafts shall be treated as ~~negative Cash~~ **Indebtedness**.
- Cash shall be calculated as of the Reference Time ~~without regard to deposits in transit or outstanding checks~~ **including deposits in transit and excluding outstanding checks**.

SPA evidence anchors

- Project Dragon — Definitions (Cash and Cash Equivalents).
- Project Eleos — Definitions (Cash; Restricted Cash; “without duplication” concept appears in Cash definition).
- Simply Solventless — Definitions (Cash).
- Project Skyrocket — Definitions (Restricted Cash).

---

## Indebtedness / Debt-like [indebtedness_debt_like]

Plain-English meaning  
Indebtedness determines which liabilities reduce consideration (borrowings, accrued interest, breakage, guarantees, leases, intercompany, etc.). Broad definitions are fine, but overlap routing is critical to avoid double counting.

Typical / Buyer-leaning / Seller-leaning patterns

- Typical: borrowed money, accrued interest, fees/breakage, guarantees; often excludes trade payables captured in Working Capital.
- Buyer-leaning: broader debt-like list and clearer payoff documentation.
- Seller-leaning: excludes ordinary-course accruals and pushes items into Working Capital instead.

Pitfalls + drafting tells

- Debt-like items overlap with Transaction Expenses/Taxes without “to the extent included” carve-outs.
- Intercompany balances included without stating whether they are settled pre-close.
- Payoff letters/schedules don’t cover the full defined term.
- Overdrafts/cash management liabilities can be captured twice (Cash and Indebtedness).

Counsel questions

- Does Indebtedness exclude amounts to the extent included in Net Working Capital, Transaction Expenses or Taxes (without duplication)?
- What evidence is required at Closing (payoff letters, schedules, lender confirmations)?
- Are intercompany balances intended to be settled pre-Close, and if not, which ones are included?
- Where are overdrafts routed (Cash vs Indebtedness), and is the other bucket carved out?

Likely pushback

- “We need a broad definition to capture all debt-like items.”

Rebuttals / fallback

- “Broad is fine—add a clean no-duplication carve-out and route overlaps so the same item isn’t deducted twice.”
- “Align payoff deliverables to the definition so there’s no residual ‘surprise debt’ dispute.”

Minimal edits

- “Indebtedness” means ... ~~including any amounts also reflected in Working Capital or Transaction Expenses~~ **excluding any amounts to the extent included in Net Working Capital, Transaction Expenses or Taxes, in each case without duplication**.
- Intercompany Debt shall include ~~all intercompany balances~~ **only intercompany balances not settled prior to Closing**.
- Closing Indebtedness shall be determined as of the Reference Time~~.~~ **based on payoff letters delivered on or before Closing.**

SPA evidence anchors

- KeyMe — Section 3.4(c) (Closing Indebtedness + payoff mechanics).
- Project Skyrocket — Definitions (Debt includes intercompany receivable/payable debt concepts).
- Project Eleos — Definitions (Indebtedness includes capital leases).
- Vortex — Definitions (Debt includes guarantees/affiliates).

---

## Net Debt [net_debt]

Plain-English meaning  
Net Debt nets Cash and Indebtedness (and sometimes other items). It is often the single adjustment input, so methodology, sign, and overlap controls must be explicit.

Typical / Buyer-leaning / Seller-leaning patterns

- Typical: Net Debt = Indebtedness – Cash as of a reference time; statement prepared and disputed.
- Buyer-leaning: explicit direction/sign, alignment with Working Capital methodology, and classification lock.
- Seller-leaning: narrower debt, broader cash, and more flexibility to reclassify.

Pitfalls + drafting tells

- Net Debt direction is ambiguous (Cash minus Debt vs Debt minus Cash).
- Items can move between Net Debt and Working Capital after Closing (“bucket shifting”).
- Net Debt includes Transaction Expenses in one place but Transaction Expenses are also deducted separately.
- No tie-out template / trial balance mapping.

Counsel questions

- Confirm the exact direction/sign used in the formula (and keep it consistent everywhere).
- Does Net Debt include Transaction Expenses or Unpaid Transaction Expenses (and if so, where is it carved out elsewhere)?
- Do Net Debt and Working Capital share the same Accounting Principles/hierarchy?
- Is there a no-reclass rule across Cash/Debt/WC/Expenses?

Likely pushback

- “Net Debt is straightforward; we don’t need more words.”

Rebuttals / fallback

- “A single sign error or overlap item can flip economics; add one sentence for direction, consistency, and no duplication.”
- “Classification lock reduces post-close disputes and prevents bucket shifting.”

Minimal edits

- “Net Debt” means ~~Cash minus Indebtedness~~ **Indebtedness minus Cash** (or vice versa) as of the Reference Time.
- Net Debt shall be calculated under the Accounting Principles~~.~~ **, without duplication and consistently with the Working Capital Statement.**
- No item shall be reclassified between Cash, Indebtedness, Transaction Expenses or Net Working Capital for purposes of the Net Debt Statement~~.~~ **, except to correct manifest error.**

SPA evidence anchors

- Project Skyrocket — Definitions (Net Debt; Draft/Final Net Debt Statement).

---

## Working Capital / Net Working Capital [working_capital_nwc]

Plain-English meaning  
Net Working Capital is the operating “current assets minus current liabilities” measure at Closing versus a target/peg. The definition determines what accounts are included and can be a major value driver.

Typical / Buyer-leaning / Seller-leaning patterns

- Typical: current assets less current liabilities, excluding Cash and Indebtedness; prepared using Accounting Principles and often a template.
- Buyer-leaning: explicit schedule/template and no-hindsight / no-reclass rules.
- Seller-leaning: more flexibility and fewer exclusions, or favorable target/peg.

Pitfalls + drafting tells

- Cash is included in NWC and also adjusted separately as Cash.
- Target/peg exists but no schedule or template ties to the calculation.
- No explicit exclusions for Transaction Expenses and Taxes (overlap risk).
- Allows reclassification between buckets after Closing.

Counsel questions

- Is Cash included or excluded from NWC (and how is overlap prevented)?
- Is there a Sample Working Capital Statement, and is it controlling?
- Are Transaction Expenses and Taxes excluded from NWC to the extent captured elsewhere (without duplication)?
- Are there no-hindsight and no-reclass protections?

Likely pushback

- “Past practice covers this; we don’t need a template.”

Rebuttals / fallback

- “Past practice is disputed; the template avoids fights and aligns the peg to the calculation.”
- “Explicit exclusions prevent double counting across buckets.”

Minimal edits

- Net Working Capital means current assets minus current liabilities ~~including Cash~~ **excluding Cash**.
- Net Working Capital shall be prepared in accordance with the Accounting Principles~~.~~ **and the Sample Working Capital Statement (Schedule [__]) which shall control in case of conflict.**
- Net Working Capital shall exclude any amounts to the extent included in Transaction Expenses or Taxes~~.~~ **, in each case, without duplication.**

SPA evidence anchors

- Project Dragon — Working Capital Adjustment Amount (purchase price mechanics + Definitions).
- KeyMe — Section 3.4(d/e/f) (Working Capital and overlap with Transaction Expenses).
- Simply Solventless — Definitions (NWC explicitly includes Cash; overlap risk).
- Project Skyrocket — statement alignment concepts (Working Capital Statement tied to Net Debt approach).

---

## Transaction Expenses [transaction_expenses]

Plain-English meaning  
Transaction Expenses are deal-related costs that can be deducted from the adjustment. The key issues are scope, timing (“incurred/unpaid”), and overlap with Debt/Working Capital/Taxes.

Typical / Buyer-leaning / Seller-leaning patterns

- Typical: professional fees, bonuses/change-of-control, financing fees; measured as of a cut-off time.
- Buyer-leaning: includes employer payroll taxes on bonuses and clearer overlap carve-outs.
- Seller-leaning: narrower definition and tighter “incurrence” standard.

Pitfalls + drafting tells

- Same expense shows up in Transaction Expenses and also in Indebtedness or Working Capital accruals.
- “Incurred” is undefined and becomes a timing fight.
- Employer payroll taxes (on bonuses/severance) are omitted.
- RWI premium/fees appear in multiple places.

Counsel questions

- What is included/excluded (and is there a schedule)?
- Are these amounts “incurred and unpaid” as of the cut-off time (and how is “incurred” defined)?
- Are payroll taxes included?
- Are amounts excluded to the extent included in Indebtedness, Net Working Capital, or Taxes (without duplication)?

Likely pushback

- “These are real costs; they should all reduce price.”

Rebuttals / fallback

- “Agree they reduce value—draft so they reduce value once.”
- “Define ‘incurred’ under the Accounting Principles to avoid timing arbitrage.”

Minimal edits

- Transaction Expenses include ... retention bonuses ~~only~~ **and the employer portion of payroll taxes attributable thereto**.
- Transaction Expenses shall exclude any amounts to the extent included in Indebtedness or Net Working Capital~~.~~ **, in each case, without duplication.**
- “Incurred” shall be determined under the Accounting Principles~~.~~ **For clarity, amounts are included only if incurred and unpaid as of the Reference Time.**

SPA evidence anchors

- Project Eleos — Definitions (Transaction Expenses).
- KeyMe — Section 3.4(e) (Transaction Expenses includes employer payroll taxes).
- Vortex — Transaction Expense schedule construct.
- Project Dragon — deal bonuses/professional fees.

---

## Taxes [taxes]

Plain-English meaning  
Taxes drafting allocates pre-closing and straddle period tax responsibility and must be consistent with any Working Capital accruals and tax indemnity/settlement mechanics.

Typical / Buyer-leaning / Seller-leaning patterns

- Typical: broad “Taxes” definition; straddle allocation method; transfer tax allocation; cooperation and filing covenants.
- Buyer-leaning: seller bears pre-closing; explicit overlap controls with Working Capital; clear withholding/gross-up.
- Seller-leaning: proration method, limited seller exposure, and exclusions for amounts reflected in Working Capital.

Pitfalls + drafting tells

- Taxes accrued in Working Capital and also recovered via tax indemnity/settlement (double count).
- Transfer Taxes allocation is missing or ambiguous.
- Withholding/gross-up mechanics conflict with consideration/payment mechanics.
- Tax refunds/benefits not aligned with who bears the underlying tax.

Counsel questions

- Are tax accruals handled in Working Capital or through separate tax settlement/indemnity, and how is overlap prevented?
- What is the straddle allocation method (closing-of-the-books vs proration, and is fallback stated)?
- Who bears Transfer Taxes and who controls filings?
- How do withholding and gross-up interact with the Purchase Price payments?

Likely pushback

- “Taxes are covered elsewhere; we don’t need to link it to the adjustment.”

Rebuttals / fallback

- “Even if taxes are handled elsewhere, overlap drafting prevents paying for the same tax twice.”
- “Transfer tax allocation needs to be explicit to avoid post-close disputes.”

Minimal edits

- Taxes shall exclude any amounts to the extent reflected in Net Working Capital or Transaction Expenses~~.~~ **, in each case, without duplication.**
- Transfer Taxes shall be borne ~~by Buyer~~ **50% by Buyer and 50% by Seller** (or other stated allocation).
- For any Straddle Period, Taxes shall be allocated ~~by proration~~ **by closing-of-the-books as of the Closing Time (and if not practicable, then by proration)**.

SPA evidence anchors

- Project Dragon — tax definition + pre-closing tax accrual constructs.
- KeyMe — tax allocation and straddle constructs.
- Vortex — tax/leakage-related definitions and adjustments.
- Project Skyrocket — taxes appear in closing statements package.

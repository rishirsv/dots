# Playbook — Value Protection

## Escrows / Holdbacks / Reserves [escrows_holdbacks_reserves]

Plain-English meaning  
Escrows/holdbacks/reserves are the “security layer” for true-ups and claims. Drafting determines what is secured, for how long, and who controls releases.

Typical / Buyer-leaning / Seller-leaning patterns

- Typical: separate adjustment escrow and indemnity escrow; escrow agent; release after final determination.
- Buyer-leaning: larger/longer escrows, broader secured claims, and more control over release instructions.
- Seller-leaning: smaller/shorter escrows, objective release triggers, and escrow as sole source of recovery.

Pitfalls + drafting tells

- Adjustment escrow and indemnity escrow are commingled or not prioritized.
- Release mechanics are unclear (timing, dispute, interest).
- Reserve accounts mimic escrow economics without escrow governance/protections.
- Set-off rights allow Buyer to bypass escrow-only recovery.

Counsel questions

- What does each escrow secure (purchase price adjustment vs indemnity vs other)?
- Is escrow the sole source of recovery for certain claims?
- Who controls instructions to the escrow agent and what happens if there’s a dispute?
- How is interest handled, and does it follow the secured obligation?

Likely pushback

- “One escrow is simpler.”
- “We don’t need separate priority language.”

Rebuttals / fallback

- “If one escrow, at least specify priority: adjustment settlement first, then indemnity.”
- “Separation reduces disputes and avoids cross-contamination of releases.”

Minimal edits

- The Escrow Amount shall be held in ~~one account~~ **separate accounts for (i) the Adjustment Escrow and (ii) the Indemnity Escrow**.
- The Adjustment Escrow shall be released ~~upon Closing~~ **upon final determination of the Purchase Price Adjustment**.
- Interest earned on the Adjustment Escrow shall be paid ~~to Buyer~~ **to Seller**, except to the extent applied to satisfy amounts finally determined payable to Buyer.

SPA evidence anchors

- Project Eleos — separate adjustment escrow vs indemnity escrow construct.
- Project Dragon — Purchase Price Escrow Amount.
- KeyMe — escrow/reserve amount constructs.
- Project Skyrocket — Adjustment Escrow Fund + release waterfall (e.g., Section 2.7).

---

## R&W / W&I Insurance + retention [wi_insurance_retention]

Plain-English meaning  
RWI/W&I insurance reallocates warranty breach risk away from seller indemnities. The SPA still needs to align the economics: premium, retention/deductible, retention escrow, and claim categories.

Typical / Buyer-leaning / Seller-leaning patterns

- Typical: policy exists; retention/deductible stated; retention escrow sometimes funded from proceeds.
- Buyer-leaning: seller bears premium or funds retention escrow; retention release tied to policy and claim status.
- Seller-leaning: buyer bears premium; retention released quickly; minimal seller indemnity.

Pitfalls + drafting tells

- Premium/costs are charged twice (Transaction Expenses plus a separate reimbursement).
- Retention escrow purpose is unclear (is it for adjustment, indemnity, or policy retention?).
- Claim categories in the SPA don’t align with the policy and create coverage disputes.

Counsel questions

- Who pays the premium, and where is it reflected (Transaction Expenses or separate covenant)?
- What is the retention amount and is there a retention escrow?
- When is retention escrow released, and what happens to pending claims?
- Do Warranty Claim categories align with the policy’s coverage and exclusions?

Likely pushback

- “The policy governs; the SPA doesn’t need detail.”

Rebuttals / fallback

- “The SPA determines who bears cost and who holds proceeds; alignment prevents double charging and release disputes.”
- “Keep it concise: premium once, retention mechanics, and claim alignment.”

Minimal edits

- W&I Insurance Costs shall be treated as ~~Transaction Expenses and also reimbursed by Seller~~ **Transaction Expenses (if at all) only once, and shall not be reimbursed separately**.
- The Retention Escrow Amount shall secure ~~all Buyer claims~~ **only Warranty Claims, and only to the extent not recoverable under the R&W Insurance Policy**.
- The Retention Escrow Amount shall be released ~~on the first anniversary of Closing~~ **subject to pending claims and consistent with the retention under the R&W Insurance Policy**.

SPA evidence anchors

- KeyMe — R&W Retention Escrow Amount and related definitions.
- Project North — Representation and Warranty Policy.
- Vortex — W&I Insurance Costs/Policy/Insurer + claim category constructs.

---

## D&O tail policy [do_tail_policy]

Plain-English meaning  
A D&O tail policy provides run-off coverage for pre-closing acts. It is often a meaningful cost item and needs clear allocation (who pays), timing (effective at Closing), and minimum term.

Typical / Buyer-leaning / Seller-leaning patterns

- Typical: covenant to procure tail policy for a stated term with stated limits.
- Buyer-leaning: seller bears premium and must bind coverage effective at Closing Time.
- Seller-leaning: company bears premium or split; flexibility on insurer.

Pitfalls + drafting tells

- Premium is treated as Transaction Expenses and also withheld via escrow/reserve (double charge).
- Policy term/limits/insured parties not specified.
- Closing timing (especially in dual-close structures) makes the payor ambiguous.

Counsel questions

- Who procures the policy, who pays the premium, and where is it reflected in the funds flow?
- Minimum term and limits? Effective time?
- Is the premium included in Transaction Expenses (and if so, is it excluded elsewhere without duplication)?

Likely pushback

- “The company should pay; it benefits the business post-close.”

Rebuttals / fallback

- “That can work—just don’t also deduct it from consideration; pick one bucket and reflect it once.”
- “Specify term/limits to avoid a compliance fight post-close.”

Minimal edits

- Seller shall procure a D&O Tail Policy with a term of ~~[__]~~ **6 years** and limits no less than the current policy.
- The D&O Tail Policy premium shall be treated as ~~a Transaction Expense~~ **a company-borne expense not deducted from the Purchase Price** (or vice versa).
- The D&O Tail Policy shall be bound effective as of ~~the Closing Date~~ **the Closing Time**.

SPA evidence anchors

- Project Eleos — D&O Tail Policy defined.
- Simply Solventless — D&O Tail Policy defined.

---

## Set-off / offset rights [setoff_offset_rights]

Plain-English meaning  
Set-off clauses let a party net amounts owed (e.g., net indemnity claims against earn-out or adjustment payments). Broad set-off can shift leverage and bypass intended recourse limits.

Typical / Buyer-leaning / Seller-leaning patterns

- Typical: no set-off except against a specified escrow fund, or set-off only after final determination.
- Buyer-leaning: broader set-off across earn-out/indemnity payments; ability to withhold pending claims.
- Seller-leaning: payments made gross; no set-off except narrow, finally determined adjustment settlement.

Pitfalls + drafting tells

- Set-off permitted before final determination (unilateral netting risk).
- Set-off conflicts with “escrow-only” or “sole recourse” constructs.
- No notice/procedure; set-off becomes a negotiation weapon.

Counsel questions

- Is set-off permitted at all, and against which payment streams?
- Is set-off limited to finally determined amounts (and how is “finally determined” defined)?
- If escrows exist, is set-off limited to the relevant escrow fund?
- What notice and calculation detail is required before exercising set-off?

Likely pushback

- “Set-off avoids circular payments and is efficient.”

Rebuttals / fallback

- “Efficiency is preserved with a narrow, determined-amount-only set-off and escrow-only limitation.”
- “Add notice/procedure to prevent unilateral netting.”

Minimal edits

- All payments shall be made ~~subject to any right of set-off~~ **without set-off or counterclaim**.
- Buyer may set off ~~any asserted claim~~ **only amounts finally determined payable under Section [__], and only against the applicable escrow fund**.
- No set-off shall be exercised ~~at Buyer’s discretion~~ **unless and until the underlying amount is finally determined and Seller has received written notice describing the calculation**.

SPA evidence anchors

- Set-off is typically clause-level (payment mechanics / recourse) rather than a Defined Term; search consideration payment, earn-out payment, indemnity payment, and escrow instruction sections for “set-off/offset/netting”.

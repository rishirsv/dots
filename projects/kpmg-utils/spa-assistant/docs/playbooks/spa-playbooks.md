# SPA Analysis Playbooks

This document defines the 8 analysis playbooks for the SPA Assistant. Each playbook follows a consistent schema for triggers, process, output format, bias guidance, benchmarks, and follow-on prompts.

---

## Playbook 1: Key Financial Definitions

Analyzes core financial definitions that impact deal economics and form the foundation for all other analyses.

### Triggers

- "Analyze the definitions"
- "What are the key financial terms?"
- "Review Indebtedness/Cash/Working Capital/Transaction Expenses definitions"
- "How is [specific term] defined?"
- "Definition analysis"

### Process Steps

1. **Identify defined terms** — Locate the Definitions section and extract: Indebtedness, Cash/Cash Equivalents, Working Capital/Net Working Capital, Transaction Expenses, Accounting Principles
2. **Parse inclusions/exclusions** — For each definition, extract what's explicitly included, explicitly excluded, and any catch-all language
3. **Flag buyer/seller-favorable language** — Compare against standard market definitions
4. **Identify double-count risks** — Check for items that could appear in multiple definitions (e.g., accrued interest in both Indebtedness and Working Capital)
5. **Identify gap risks** — Flag items not captured by any definition (e.g., income taxes, restricted cash)
6. **Check for red flag language** — Identify overly broad or vague language that invites disputes

### Output Format

**Primary Table:**

| Definition | Key Inclusions | Key Exclusions | Bias | Key Observations |
|------------|----------------|----------------|------|------------------|
| Indebtedness | [list] | [list] | [rating] | [flags] |
| Cash | [list] | [list] | [rating] | [flags] |
| Working Capital | [list] | [list] | [rating] | [flags] |
| Transaction Expenses | [list] | [list] | [rating] | [flags] |
| Accounting Principles | [hierarchy] | N/A | [rating] | [flags] |

**Summary Sections:**
- Double-Count Risk Matrix (which items could be counted twice)
- Gap Risk List (items not captured anywhere)
- Red Flag Language (specific phrases with dispute potential)

**Citation Format:** `[Section X.Y]: "relevant excerpt"`

### Bias Rating Guidance

| Rating | Indebtedness | Cash | Working Capital | Transaction Expenses |
|--------|--------------|------|-----------------|---------------------|
| Highly Buyer-Favorable | Includes broad catch-all, all leases, factoring, SCF, pension deficits | Excludes restricted cash, deducts outstanding checks, no netting | Includes deferred revenue, all reserves subject to "GAAP true-up" | Includes all fees paid or unpaid, financing fees, payroll taxes |
| Buyer-Favorable | Includes accrued interest, breakage, unamortized fees | Excludes trapped cash, narrow cash equivalents | Includes deferred revenue and customer deposits | Includes bonuses and D&O tail |
| Neutral | Borrowed money + capital leases + accrued interest; limited catch-all tethered to debt concepts | Cash and cash equivalents, excluding restricted cash; overdrafts treated as Indebtedness | Operating current assets minus operating current liabilities; excludes Cash, Indebtedness, Transaction Expenses | Professional fees + transaction bonuses + payroll taxes |
| Seller-Favorable | Schedule-based only, excludes operating leases | Includes restricted cash, allows overdraft netting | Excludes deferred revenue, reserves based on historical practice only | Only third-party fees, excludes bonuses |
| Highly Seller-Favorable | Only enumerated items on schedule, no catch-all | Gross cash including all deposits and restricted amounts | Only trade A/R, inventory, A/P; excludes all accruals | Narrow list, excludes amounts already accrued in WC |

### Market Benchmarks

| Term | Market Standard |
|------|-----------------|
| Indebtedness | Borrowed money + accrued interest + breakage + capital/finance leases; excludes ordinary operating liabilities |
| Cash | Cash and cash equivalents; excludes restricted cash; overdrafts typically treated as Indebtedness |
| Working Capital | Operating current assets minus operating current liabilities; typically excludes Cash, Indebtedness, Transaction Expenses; should include account-level schedule |
| Transaction Expenses | Deal-related costs of the Group; economically single-counted with WC and Cash |
| Accounting Principles | Hierarchy: (1) SPA schedules, (2) consistent with historical FS, (3) GAAP/IFRS |

### Follow-on Prompts

1. "Show me a detailed breakdown of the Indebtedness definition with all included items"
2. "Map each definition to typical trial balance accounts to check for gaps"
3. "What's missing from these definitions that we should negotiate?"
4. "Compare these definitions to market standard language"
5. "Identify the highest-risk double-count scenarios in this SPA"

---

## Playbook 2: Purchase Price Mechanics

Summarizes the purchase price equation and analyzes adjustment mechanisms.

### Triggers

- "Explain the purchase price"
- "How is the price calculated?"
- "Purchase price mechanics"
- "What are the adjustments?"
- "Bridge from EV to equity value"
- "Funds flow analysis"

### Process Steps

1. **Identify pricing basis** — Determine if headline is Enterprise Value (cash-free/debt-free) or Equity Value
2. **Extract base price** — Find the stated purchase price and currency
3. **Map all adjustments** — Identify each adjustment: NWC, Cash, Indebtedness, Transaction Expenses, Leakage, other
4. **Build the equation** — Construct: Headline +/- Adjustments = Closing Equity Value
5. **Identify withheld amounts** — Escrows, holdbacks, deferred payments
6. **Map consideration forms** — Cash, stock, rollover, seller notes
7. **Identify contingent amounts** — Earn-outs, milestones, deferred payments
8. **Check for collar/cap/floor** — Any limits on adjustments

### Output Format

**Price Bridge Table:**

| Component | Amount/Formula | Bias | Notes |
|-----------|----------------|------|-------|
| Headline Price | $X (EV/Equity) | N/A | [basis] |
| (-) Indebtedness | (as defined) | [rating] | [key inclusions] |
| (+) Cash | (as defined) | [rating] | [key inclusions] |
| (+/-) NWC vs Target | Target: $Y | [rating] | [collar if any] |
| (-) Transaction Expenses | (as defined) | [rating] | [who bears] |
| = Closing Equity Value | $X | N/A | |
| (-) Escrow/Holdback | $X (Y%) | [rating] | [release timing] |
| = Cash at Close | $X | N/A | |
| Earn-out (if any) | Up to $X | [rating] | [metric, period] |

**30-Second Summary:**
> "Headline is **$X EV** on a cash-free/debt-free basis with an **NWC peg of $Y**. At close, sellers receive **$A cash**, after **$B of escrows/holdbacks**. Post-close, there's a **working capital / net debt true-up** (timed ~60-90 days), and sellers can earn up to **$C earnout** over **[period]** based on **[metric]**."

**Citation Format:** `[Section X.Y, Page Z]: "relevant excerpt"`

### Bias Rating Guidance

| Element | Buyer-Favorable | Neutral | Seller-Favorable |
|---------|-----------------|---------|------------------|
| NWC Target | Set at seasonal low; subject to GAAP true-up | Based on trailing average, normalized for one-offs | Set at seasonal high; locked to historical practice |
| Cash Definition | Excludes restricted, deducts items in transit | Excludes restricted; clean cut-off rules | Includes restricted; netting allowed |
| Indebtedness | Broad definition with comprehensive catch-all | Standard debt concepts + accrued interest + leases | Schedule-based; narrow items only |
| Transaction Expenses | Broad; deducted dollar-for-dollar | Standard deal fees | Narrow; amounts in WC excluded |
| Escrow | Large (>10%); long duration (>18 months) | ~10% non-insured; ~12 months | Small (<5%); short duration (<12 months) |
| Adjustment Collar | No collar (dollar-for-dollar) | Collar sized to NWC volatility | Wide collar favoring seller |

### Market Benchmarks

| Mechanism | Market Standard |
|-----------|-----------------|
| Pricing Basis | Cash-free, debt-free EV with NWC peg |
| NWC Target | Based on normalized trailing average; account-level schedule |
| Escrow (non-insured) | ~9-10% of purchase price; ~12 months |
| Escrow (RWI deals) | ~0.3-0.5% of purchase price |
| PPA Escrow | ~1% of deal value; smaller in $100M+ deals |
| True-up Timing | Buyer delivers closing statement ~60-90 days post-close; seller has ~30-day dispute window |
| WC Collars | Used in ~17-28% of deals |

### Follow-on Prompts

1. "Walk me through the funds flow at closing"
2. "What happens if working capital comes in below target?"
3. "Analyze the escrow release mechanics and timing"
4. "Compare this adjustment mechanism to locked-box alternatives"
5. "What are the dispute resolution procedures for the true-up?"

---

## Playbook 3: Working Capital vs Net Debt Adjustment

Analyzes working capital and net debt mechanics, including bucket placement and gap/double-count detection.

### Triggers

- "Analyze working capital"
- "NWC analysis"
- "Net debt breakdown"
- "What's in working capital vs debt?"
- "Bucket placement"
- "Double-count check"

### Process Steps

1. **Map each GL account to one bucket** — Force every item into: NWC (Operating), Net Debt (Financing), Transaction Expenses, or Explicitly Excluded
2. **Apply decision tree** — For each item: Is it deal-triggered? Is it cash/debt-like? Does it turn over with operations? Is it non-operating/financing-adjacent?
3. **Run double-count detection** — Check: Cash in NWC? Overdrafts counted twice? Current portion of debt in both places? Accrued interest in both? Lease liabilities duplicated? Factoring/intercompany issues?
4. **Run gap detection** — Check: Are all four definitions present? Are all TB accounts mapped? Off-balance-sheet items captured? Cut-off issues addressed?
5. **Assess NWC target reasonableness** — Review historical NWC under deal definition, normalize, check seasonality, convert to days analysis

### Output Format

**Bucket Mapping Table:**

| Category | Item | Assigned Bucket | Rationale | Double-Count Risk | Gap Risk |
|----------|------|-----------------|-----------|-------------------|----------|
| Current Assets | Trade A/R | NWC | Operating, turns over | None | None |
| Current Assets | Cash | Cash (excluded from NWC) | Explicitly excluded | Check if NWC definition excludes | None |
| Current Liabilities | Accrued Interest | Net Debt | Financing-related | Check if also in WC accruals | None |
| ... | ... | ... | ... | ... | ... |

**Double-Count Risk Matrix:**

| Risk | Items Involved | Potential Impact | Recommendation |
|------|----------------|------------------|----------------|
| Cash in NWC | Cash accounts | [$ estimate] | Ensure explicit exclusion |
| Accrued Interest | Interest in accruals + Net Debt | [$ estimate] | Carve out from WC |
| ... | ... | ... | ... |

**NWC Target Reasonableness:**

| Metric | Historical (12-mo avg) | Target | Variance | Assessment |
|--------|------------------------|--------|----------|------------|
| NWC ($) | $X | $Y | $Z | [Reasonable/High/Low] |
| DSO | X days | Y days implied | Z days | [flag if off] |
| DIO | X days | Y days implied | Z days | |
| DPO | X days | Y days implied | Z days | |

### Bias Rating Guidance

| Element | Buyer-Favorable | Neutral | Seller-Favorable |
|---------|-----------------|---------|------------------|
| NWC Definition | Broad liabilities (deferred revenue, all accruals); GAAP true-up allowed | Operating CA minus CL; excludes Cash/Debt/TxExp; consistent with historical | Narrow liabilities; historical practice only |
| Net Debt | Comprehensive; includes all leases, factoring, pension deficits | Borrowed money + interest + capital leases | Schedule-based; narrow items |
| Disputed Items | Deferred revenue in WC; leases as debt; intercompany as debt | Follow SPA definition; clear allocation | Deferred revenue excluded; operating leases excluded |
| Collar | No collar | Collar sized to volatility | Wide collar |

### Market Benchmarks

| Element | Market Standard |
|---------|-----------------|
| NWC Definition | Operating current assets minus operating current liabilities; excludes Cash, Indebtedness, Transaction Expenses |
| NWC Schedule | Account-level inclusions/exclusions schedule is best practice |
| Deferred Revenue | Highly negotiated; often included in NWC |
| Income Taxes | Often excluded from NWC; handled via indemnity or separate adjustment |
| Intercompany | Usually excluded and settled outside completion accounts |

### Follow-on Prompts

1. "Show me a detailed breakdown of what's included in Net Debt"
2. "Flag all potential double-count issues between NWC and other definitions"
3. "Is the working capital target reasonable given historical patterns?"
4. "What items are missing from the definitions that could fall through the cracks?"
5. "How should disputed items like deferred revenue be treated?"

---

## Playbook 4: Earn-Out Provisions

Analyzes earn-out structure, metrics, and risk factors.

### Triggers

- "Analyze the earn-out"
- "Contingent consideration"
- "Performance payments"
- "Milestone payments"
- "Earn-out risk"
- "What triggers the earn-out?"

### Process Steps

1. **Extract metric definition** — Identify earn-out metric(s): Revenue, EBITDA, ARR, milestones, etc.
2. **Parse calculation rules** — Accounting basis, adjustments allowed, what's included/excluded
3. **Map measurement periods** — Timing, reporting cadence, when payments are due
4. **Identify thresholds and caps** — Minimum, maximum, tiered payouts, catch-up mechanics
5. **Extract operational covenants** — Efforts standards, restrictions on buyer actions
6. **Identify acceleration triggers** — Change of control, termination, breach
7. **Review dispute mechanics** — Who prepares statements, objection process, independent accountant scope
8. **Check set-off rights** — Can buyer offset indemnity claims against earn-out?

### Output Format

**Earn-Out Summary Table:**

| Element | Terms | Bias | Observations |
|---------|-------|------|--------------|
| Metric | [e.g., EBITDA] | [rating] | [definition quality] |
| Measurement Period | [e.g., 24 months] | [rating] | [market comparison] |
| Maximum Payout | $X (Y% of base) | [rating] | |
| Threshold/Floor | $X minimum | [rating] | |
| Accounting Basis | [GAAP/consistent/bespoke] | [rating] | [red flags] |
| Operational Covenants | [efforts standard] | [rating] | [enforcement risk] |
| Acceleration Triggers | [list] | [rating] | |
| Set-Off Rights | [Yes/No/Limited] | [rating] | [$ at risk] |
| Dispute Resolution | [accountant/arbitration] | [rating] | |

**Risk Assessment:**

| Risk Category | Level | Description |
|---------------|-------|-------------|
| Definition Risk | [H/M/L] | [quality of metric definition] |
| Control Risk | [H/M/L] | [buyer's ability to influence outcome] |
| Dispute Risk | [H/M/L] | [likelihood of post-close fight] |
| Collection Risk | [H/M/L] | [set-off, buyer credit, payment timing] |

**Red Flag Language:** List any vague or problematic phrases (e.g., "adjusted for extraordinary items" without schedule)

### Bias Rating Guidance

| Element | Buyer-Favorable | Neutral | Seller-Favorable |
|---------|-----------------|---------|------------------|
| Metric Definition | Adjusted EBITDA with broad add-backs | Clear formula with enumerated adjustments | Reported revenue/EBITDA with no adjustments |
| Accounting Basis | Buyer's GAAP policies | GAAP consistent with historical | Historical practice frozen |
| Operational Covenants | "Sole discretion" with no restrictions | Commercially reasonable efforts; no sabotage | Must maximize; restrictions on integration |
| Set-Off | Unlimited; any indemnity claim | Limited to finally determined claims | No set-off permitted |
| Acceleration | No acceleration; narrow triggers | CoC acceleration at deemed achievement | Full acceleration on any material change |
| Reporting | Buyer controls; limited audit | Quarterly reports; reasonable access | Monthly reports; full audit rights |

### Market Benchmarks

| Element | Market Standard |
|---------|-----------------|
| Prevalence | ~13-26% of deals include earn-outs (varies by dataset) |
| Median Size | ~31-32% of closing payment |
| Median Duration | ~24 months; rarely >4 years |
| Metrics | EBITDA and revenue most common (~50-80%) |
| Multiple Metrics | ~68% of earn-outs use multiple metrics |
| CoC Acceleration | ~22-30% include change-of-control acceleration |
| Set-Off Rights | >58% include indemnity set-off rights |
| Dispute Rate | ~26-28% are disputed |
| Payout Reality | Average payout is ~$0.21 per $1.00 of potential |

### Follow-on Prompts

1. "What specific adjustments are allowed in the EBITDA calculation?"
2. "How does buyer's control over operations affect earn-out achievability?"
3. "Walk me through the dispute resolution process step by step"
4. "What happens to the earn-out if the buyer sells the business?"
5. "Compare this earn-out structure to market standards"

---

## Playbook 5: Reps & Warranties Summarization

Provides high-level summary of reps & warranties, flagging non-standard or onerous provisions.

### Triggers

- "Summarize the reps and warranties"
- "R&W analysis"
- "What representations does the seller make?"
- "Rep coverage"
- "Warranty risk"

### Process Steps

1. **Inventory all reps** — List all representation categories present
2. **Identify FDD-relevant reps** — Flag: Financial Statements, Undisclosed Liabilities, Books & Records, Taxes, Absence of Certain Changes, Indebtedness/Liens, Working Capital Components, Material Contracts, Employee/Benefits, Litigation, Related-Party Transactions
3. **Parse qualifiers** — For each rep: Knowledge qualifier? Materiality/MAE qualifier? Time-boxing? Schedule carve-outs?
4. **Assess strength** — Rate each rep on onerous-to-weak spectrum
5. **Map to indemnification** — How does each rep connect to cap/basket/survival?
6. **Identify special treatment** — Fundamental reps, special indemnities, RWI exclusions

### Output Format

**Rep Coverage Table:**

| Rep Category | Present | Qualifier(s) | Survival | Cap Applies | Bias | FDD Relevance |
|--------------|---------|--------------|----------|-------------|------|---------------|
| Financial Statements | Yes | "in all material respects" | 18 mo | General cap | [rating] | QoE, NWC |
| Undisclosed Liabilities | Yes | Knowledge + Materiality | 18 mo | General cap | [rating] | Net Debt |
| Taxes | Yes | None | Statute | Special | [rating] | Tax DD |
| ... | ... | ... | ... | ... | ... | ... |

**Qualifier Impact Analysis:**

| Qualifier Type | Prevalence | Impact Assessment |
|----------------|------------|-------------------|
| Knowledge | [count] reps | [weakening effect] |
| Materiality | [count] reps | [weakening effect] |
| MAE | [count] reps | [very high bar] |
| Schedule | [count] reps | [check schedules] |

**Fundamental Reps List:** [List reps with enhanced protection: longer survival, higher/no cap]

**Red Flags:**
- [Any unusually weak reps]
- [Missing standard reps]
- [Aggressive qualifier stacking]

### Bias Rating Guidance

| Element | Buyer-Favorable | Neutral | Seller-Favorable |
|---------|-----------------|---------|------------------|
| FS Rep | GAAP in all respects; fairly present; includes interim FS | GAAP in all material respects; fairly present | Knowledge qualified; past practice only |
| Undisclosed Liabilities | All liabilities (accrued/contingent/known/unknown) | GAAP-required recording; ordinary course carve-out | Only GAAP-required; broad carve-outs |
| Tax Rep | Comprehensive filing/payment/withholding; no audits | Filing/payment with materiality qualifier | Heavy knowledge/materiality; narrow scope |
| Qualifiers | No knowledge qualifiers; limited materiality | Knowledge on certain operational reps; materiality scrape for indemnity | Stacked qualifiers; no scrape |
| Survival | 18-24 months general; 6+ years fundamental/tax | 12-18 months general; 3-6 years fundamental | 12 months or less; walk-away structure |

### Market Benchmarks

| Element | Market Standard |
|---------|-----------------|
| General Rep Survival | 12-18 months (median 12 months per SRS 2024) |
| Fundamental Rep Survival | 3-6 years; sometimes tied to statute of limitations |
| Tax Rep Survival | Often aligned to statute of limitations (3-6+ years) |
| RWI Coverage | ~3 years general; ~6 years fundamental/tax |
| Walk-Away Structures | Meaningful portion of deals have no general rep survival |

### Follow-on Prompts

1. "Which reps have the most aggressive qualifiers?"
2. "Map FDD findings to specific reps for indemnity coverage"
3. "What reps are missing that should be requested?"
4. "How does the indemnification structure limit recovery on these reps?"
5. "Which issues should be covered by special indemnity instead of general reps?"

---

## Playbook 6: Key Commercial Terms

Auto-extracts and summarizes the most critical commercial terms for IC-ready overview.

### Triggers

- "Extract key terms"
- "Summarize the deal"
- "What are the main terms?"
- "Deal overview"
- "Term sheet summary"
- "IC summary"

### Process Steps

1. **Extract structure** — Buyer, Seller, Target, stock vs asset, signing/closing dates
2. **Extract economics** — Purchase price, form of consideration, adjustments, earn-outs, escrows
3. **Extract closeability** — Key conditions, required approvals, outside date, termination rights
4. **Extract risk allocation** — R&W scope, indemnification (cap/basket/survival), special indemnities
5. **Extract covenants** — Interim operating covenants, non-compete, post-closing obligations
6. **Flag non-standard items** — Anything off-market or requiring IC attention

### Output Format

**1-Page IC Summary:**

**Header:** [Deal Name] | [Buyer] acquiring [Seller/Target] | [Structure] | Sign: [date] | Close: [date]

**Economics (5 bullets max):**
- Headline: $X [EV/Equity] + currency
- Consideration: [cash/rollover/stock/note split]
- Adjustments: [NWC target $Y / net debt / locked-box]
- Earn-out: [Yes/No; max $X; metric; period]
- Escrow: [$X (Y%); duration; purpose]

**Closeability (3-5 bullets):**
- Regulatory: [required approvals]
- Third-party: [key consents]
- Outside date: [date] + [extension rights]
- Walk rights: [termination triggers]

**Risk Allocation (5 bullets):**
- R&W: [breadth + notable qualifiers]
- Survival: [general X mo / fundamental Y yr / tax Z yr]
- Cap: [general X% / fundamental Y%]
- Basket: [$X deductible/tipping]
- Special indemnities: [list]

**Non-Standard / IC Attention:**
- [Unusual terms requiring discussion]
- [Off-market provisions]
- [Key decisions needed]

**Key Commercial Terms Table:**

| Term | Value/Description | Bias | Section Ref |
|------|-------------------|------|-------------|
| Purchase Price | $X | N/A | [ref] |
| NWC Target | $X | [rating] | [ref] |
| Indemnity Cap | X% of PP | [rating] | [ref] |
| Basket | $X [type] | [rating] | [ref] |
| General Survival | X months | [rating] | [ref] |
| Escrow | $X (Y%) | [rating] | [ref] |
| Outside Date | [date] | [rating] | [ref] |
| ... | ... | ... | ... |

### Bias Rating Guidance

Apply the bias scale to each term individually based on whether it favors Buyer, Seller, or is market-neutral. Use playbook-specific guidance for each category (price mechanics, indemnification, covenants, etc.).

### Market Benchmarks

Cross-reference relevant benchmarks from other playbooks:
- Escrow: ~9-10% non-insured; ~0.3-0.5% insured; ~12 months
- PPA: ~1% rule-of-thumb
- General survival: ~12-18 months
- Earn-outs: ~13-26% prevalence; ~24 months median duration

### Follow-on Prompts

1. "Drill into the indemnification structure in detail"
2. "What are the key closing conditions and associated risks?"
3. "Analyze the interim operating covenants"
4. "What terms should we push back on in negotiation?"
5. "Compare these terms to market standards across each category"

---

## Playbook 7: Smart Redline

Compares two document versions and highlights changes with analysis.

### Triggers

- "Compare these documents"
- "Redline analysis"
- "What changed between versions?"
- "Markup comparison"
- "Version comparison"
- User uploads two documents

### Process Steps

1. **Strip noise** — Separate changes into: Housekeeping (formatting), Clarifying (precision), Substantive (risk-shifting)
2. **Categorize by materiality** — Rank changes using: Deal economics, Liability allocation, Reps scope, Deal certainty, Pre-closing covenants, Post-closing obligations, Tax, Dispute resolution, Regulatory, Boilerplate
3. **Flag high-signal triggers** — Any change touching: Numbers (%, $, dates), Trigger words ("sole and exclusive," "notwithstanding," "except," "material," "knowledge," "fraud")
4. **Score each issue** — Impact x Probability + Leverage
5. **Map directionality** — Who benefits from each change (Buyer/Seller/Neutral)
6. **Identify sleeper changes** — Minor-looking edits with material effect (defined term tweaks, one-word standards, notice mechanics)

### Output Format

**Layer 1: Executive Issue List (1 page)**

| Priority | Section | Topic | What Changed | Who Benefits | Impact | Recommendation | Owner |
|----------|---------|-------|--------------|--------------|--------|----------------|-------|
| Must | [ref] | [topic] | [1-2 lines] | [B/S/N] | [H/M/L] | [action] | [team] |
| Should | [ref] | [topic] | [1-2 lines] | [B/S/N] | [H/M/L] | [action] | [team] |
| Could | [ref] | [topic] | [1-2 lines] | [B/S/N] | [H/M/L] | [action] | [team] |

**Heat Map Legend:**
- Must (Reject/renegotiate)
- Should (Needs discussion/trade)
- Could (Acceptable)

**Layer 2: Themed Summary (by category)**

Group changes under:
1. Deal Economics
2. Liability Allocation
3. Reps & Warranties
4. Deal Certainty
5. Covenants
6. Post-Closing
7. Tax
8. Dispute Resolution
9. Other

**Layer 3: Change Log (appendix)**

Full table of all substantive edits with section references.

**Sleeper Changes Alert:**
- Definition tweaks (Knowledge, MAE, Losses)
- One-word effort standard changes
- Materiality qualifier additions/removals
- Notice mechanics changes
- Basket/cap engineering
- Fraud carve-out narrowing
- Accounting principles hierarchy changes

### Bias Rating Guidance

For each change, assess:
- **Buyer-Favorable:** Change increases buyer protection, reduces buyer obligations, expands buyer rights
- **Seller-Favorable:** Change limits seller exposure, expands seller rights, reduces seller obligations
- **Neutral:** Clarifying, balanced, or market-normative change

### Market Benchmarks

Cross-reference specific terms against market standards to assess whether the proposed change moves toward or away from market.

### Follow-on Prompts

1. "Explain the impact of the indemnity cap change in detail"
2. "What's the recommended counter-position for the top 3 issues?"
3. "Are there any sleeper changes I should be worried about?"
4. "What trades could we offer to get movement on the must-have items?"
5. "Summarize changes that affect FDD workstreams specifically"

---

## Playbook 8: Negotiation Roleplay

Simulates negotiation stances from buyer or seller perspective.

### Triggers

- "Roleplay as [buyer/seller]"
- "What would the [buyer/seller] say?"
- "Negotiate this term"
- "Practice negotiation"
- "What are the counterarguments?"
- "Help me prepare for negotiation"

### Process Steps

1. **Identify user's perspective** — Are they Buyer, Seller, or neutral advisor?
2. **Extract the term(s) to negotiate** — Specific clause or broader category
3. **Load standard arguments** — Pull relevant buyer/seller positions for the topic
4. **Generate opening position** — State the standard opening stance with rationale
5. **Prepare counterarguments** — Anticipate the other side's response
6. **Identify fallback positions** — Common concessions if initial position doesn't hold
7. **Suggest trade-offs** — Package deals that could close the gap
8. **Distinguish posturing from red lines** — Help user identify what's real vs negotiable

### Output Format

**Negotiation Briefing:**

**Your Position ([Buyer/Seller]):**
| Topic | Opening Ask | Rationale | Fallback | What You'd Trade |
|-------|-------------|-----------|----------|------------------|
| [term] | [position] | [why] | [concession] | [give-to-get] |

**Anticipated Counterparty Response:**
| Topic | Their Likely Position | Their Rationale | Signs It's Real | Signs It's Posturing |
|-------|----------------------|-----------------|-----------------|---------------------|
| [term] | [position] | [why] | [indicators] | [indicators] |

**Suggested Script:**
> "[Opening statement with rationale]"

**If They Push Back:**
> "[Counter with fallback or trade offer]"

**Red Line Assessment:**
- Your true red lines: [list]
- Their likely red lines: [list]
- Tradeable items: [list]

### Standard Arguments Reference

**Topics covered:**

1. Definitions, Interpretation, Materiality, Knowledge
2. Deal Structure (Share vs Asset; Locked Box vs Completion Accounts)
3. Purchase Price Mechanics (WC, Net Debt, Transaction Expenses)
4. Earnouts / Contingent Consideration
5. Closing Conditions and Bring-Down Standards
6. Interim Operating Covenants
7. Reps & Warranties (Scope, Qualifiers, Schedules)
8. Indemnification (Caps, Baskets, Survival, Procedures)
9. Escrow / Holdback / Security
10. Rep & Warranty Insurance (RWI)
11. Tax Matters
12. Employees, Benefits, Pensions
13. Restrictive Covenants (Non-compete/Non-solicit)
14. Consents and Change of Control
15. Termination Rights, Break Fees, Specific Performance
16. Dispute Resolution, Governing Law, Forum

### Common Trade-Offs

1. **Price vs Protection** — Higher price for lower cap/shorter survival
2. **Cap vs Basket** — Lower cap if tipping basket or materiality scrape
3. **Escrow vs RWI** — Reduce escrow if RWI in place
4. **Materiality scrape for qualifiers** — Keep qualifiers if scrape applies
5. **Survival vs Rep scope** — Broader reps if survival shorter
6. **Earnout guardrails vs control** — Reporting/non-manipulation for discretion
7. **Covenants vs certainty** — Fewer covenants if commitment to close
8. **Consents vs price adjustment** — If consent fails, adjust price or escrow
9. **Special indemnity vs overall cap** — Special indemnity trades for lower general cap
10. **Reverse break fee vs financing outs** — Meaningful fee if financing out exists

### Follow-on Prompts

1. "What if they reject our opening position entirely?"
2. "Give me specific language to propose as a counter"
3. "How do I tell if this is a real red line or just posturing?"
4. "What's a fair compromise on this term?"
5. "Roleplay the full back-and-forth negotiation for this issue"

---

## Appendix: Output Formatting Standards

### Citation Format

All findings must include source citations:
- **Standard:** `[Section X.Y, Page Z]: "relevant excerpt"`
- **Missing item:** "Not found in document — typically appears in [expected location]"

### Confidence Levels

For ambiguous interpretations:
- **High:** Clear language, unambiguous meaning
- **Medium:** Some interpretation required; reasonable professionals might differ
- **Low:** Significant ambiguity; multiple valid readings

### Bias Indicators (Visual)

| Level | Indicator | When to Use |
|-------|-----------|-------------|
| Highly Buyer-Favorable | [B] | Significantly beyond market norms in buyer's favor |
| Buyer-Favorable | [b] | Leans toward buyer interests |
| Neutral | [N] | Balanced or market standard |
| Seller-Favorable | [s] | Leans toward seller interests |
| Highly Seller-Favorable | [S] | Significantly beyond market norms in seller's favor |

### Ordering Rule

Always order findings by severity: strongest bias first, Neutral items last. Within same severity, order by dollar impact if quantifiable.

### Table Best Practices

- Maximum 7 columns for readability
- Left-align text; right-align numbers
- Use abbreviations consistently (mo = months, yr = years, PP = purchase price)
- Include section references for every finding

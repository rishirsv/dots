# SPA Comprehensive Financial Analysis & Extraction Prompt

You are a senior M&A advisor with deep expertise in Share Purchase Agreement analysis. Your task is to perform an exhaustive extraction and analysis of the attached SPA, producing structured output that will populate a knowledge base for SPA analysis tools.

Your analysis must be thorough enough that another advisor could understand the full financial mechanics, assess market position, prepare negotiation points, and identify risks without reading the original document.

---

## Part 1: Document Overview

### 1.1 Metadata
| Field | Value |
|-------|-------|
| Deal Name / Project Code | |
| Execution Date | |
| Parties (Buyer / Seller) | |
| Target Company / Business | |
| Jurisdiction / Governing Law | |
| Deal Type | (Strategic / PE / Financial Institution / Carve-out / Other) |
| Pricing Structure | (Completion Accounts / Locked-Box / Hybrid) |
| Consideration Type | (All Cash / Cash + Stock / Stock Only / With Earnout / With Seller Note) |
| R&W Insurance | (Yes / No / Unknown) |
| Estimated Deal Value | (if stated) |

### 1.2 Document Structure
List the key articles/sections and their page numbers for:
- Definitions
- Purchase Price / Consideration
- Closing Mechanics
- Closing Statements / True-Up
- Escrows / Holdbacks
- Earnout (if any)
- Indemnification
- Relevant Schedules / Exhibits

---

## Part 2: Financial Definitions (Deep Extraction)

For EACH of the following definitions, complete the full analysis template below. If a definition is not present, note "NOT FOUND" and state where it would typically appear.

**Definitions to Extract:**
1. Purchase Price / Consideration
2. Cash / Cash and Cash Equivalents
3. Indebtedness / Debt
4. Net Debt (if separate from Cash minus Indebtedness)
5. Working Capital / Net Working Capital
6. Transaction Expenses / Seller Expenses
7. Taxes (the definition, not just tax provisions)
8. Accounting Principles / Accounting Standards

### Definition Analysis Template (repeat for each)

**Definition Name:** [Name as it appears in SPA]

**Section Reference:** [Section X.X, Page Y]

**Full Verbatim Text:**
> [Quote the complete definition exactly as written, including all sub-clauses]

**Plain-English Summary:**
[Explain in 2-3 sentences what this definition actually means and what it's designed to capture]

**Component Breakdown:**

| Component | Included? | Verbatim Language | Market Position | Notes |
|-----------|-----------|-------------------|-----------------|-------|
| [List each component mentioned or notably absent] | Yes/No | [Quote relevant phrase] | Market Standard / Off-Market (Buyer) / Off-Market (Seller) | [Why this matters] |

*For Indebtedness, check:* borrowed money, accrued interest, breakage/make-whole, capital/finance leases, operating leases, bank overdrafts, cash pooling, guarantees, letters of credit, factoring/receivables, intercompany debt, hedging termination, deferred purchase price, pension deficits, declared dividends

*For Cash, check:* cash on hand, demand deposits, cash equivalents, restricted cash, trapped cash, deposits in transit, outstanding checks, overdraft netting

*For Working Capital, check:* trade A/R, inventory, prepaids, trade A/P, accrued expenses, deferred revenue, customer deposits, cash inclusion/exclusion, debt exclusion, transaction expenses exclusion, income taxes, intercompany

*For Transaction Expenses, check:* banking fees, legal fees, accounting fees, change-of-control bonuses, severance, retention bonuses, employer payroll taxes, D&O tail, R&W premium, financing fees

**Anti-Duplication Language:**
| Phrase | Present? | Exact Quote | Scope |
|--------|----------|-------------|-------|
| "without duplication" | Yes/No | | Definition-level / Formula-level |
| "to the extent not included in" | Yes/No | | Which definitions? |
| "for the avoidance of doubt" | Yes/No | | What does it clarify? |

**Red Flag Language Identified:**
| Phrase | Why It's Concerning | Severity (High/Medium/Low) |
|--------|---------------------|---------------------------|
| [Quote exact problematic language] | [Explain the risk] | |

**Overall Market Position Assessment:**
- [ ] Significantly Off-Market (Buyer) 🔴
- [ ] Slightly Off-Market (Buyer) 🟠
- [ ] Market Standard 🟢
- [ ] Slightly Off-Market (Seller) 🟠
- [ ] Significantly Off-Market (Seller) 🔴

**Reasoning:** [Explain why you rated it this way, referencing specific components]

**Counsel Questions to Raise:**
1. [Question that should be clarified before signing]
2. [...]

**Suggested Revisions (if Off-Market):**
> Original: "[quote problematic language]"
> Suggested: "[proposed revision]"
> Rationale: [why this is more balanced]

---

## Part 3: Purchase Price Mechanics

### 3.1 Price Equation

**Reconstruct the complete purchase price formula:**

```
[Base Purchase Price]
+ [Cash component] (direction: +)
- [Indebtedness component] (direction: -)
+/- [NWC Adjustment vs Target of $___] (direction: +/-)
- [Transaction Expenses] (direction: -)
+/- [Other adjustments - list each]
= [Closing Payment / Equity Value]
```

**Section Reference:** [Section X.X, Page Y]

**Verbatim Formula Language:**
> [Quote the exact purchase price clause]

### 3.2 Term Alignment Check

| Formula Uses This Term | Definition Section Uses | Match? | Issue if Mismatched |
|------------------------|------------------------|--------|---------------------|
| | | | |

### 3.3 Sign Convention Analysis
| Component | Direction in Formula | Clear? | Potential Ambiguity |
|-----------|---------------------|--------|---------------------|
| Cash | +/- | Yes/No | |
| Indebtedness/Net Debt | +/- | Yes/No | |
| NWC vs Target | +/- | Yes/No | |
| Transaction Expenses | +/- | Yes/No | |

### 3.4 Formula-Level Anti-Duplication
- Present? (Yes/No)
- Exact language: [quote]
- Scope: [what does it cover?]

### 3.5 Market Position Assessment
[Rate and explain]

---

## Part 4: Cross-Definition Interaction Analysis

### 4.1 Overlap Matrix

For each potential overlap area, document how this SPA handles it:

| Overlap Area | Definitions Involved | How SPA Routes It | Anti-Duplication Present? | Risk Level | Recommendation |
|--------------|---------------------|-------------------|--------------------------|------------|----------------|
| Overdrafts | Cash ↔ Indebtedness | [Quote routing language] | Yes/No | High/Medium/Low | |
| Accrued interest | Indebtedness ↔ Working Capital | | | | |
| Current portion of debt | Indebtedness ↔ Working Capital | | | | |
| Lease liabilities | Indebtedness ↔ Working Capital | | | | |
| Breakage/make-whole fees | Indebtedness ↔ Transaction Expenses | | | | |
| Financing fees | Indebtedness ↔ Transaction Expenses | | | | |
| Transaction bonuses | Transaction Expenses ↔ Working Capital | | | | |
| Accrued deal costs | Transaction Expenses ↔ Working Capital | | | | |
| Tax payables | Working Capital ↔ Taxes/Tax Indemnity | | | | |
| Cash in NWC | Cash ↔ Working Capital | | | | |
| Intercompany balances | Multiple | | | | |

### 4.2 Gap Analysis

| Item | Risk of Falling Through Definitions | Which Definitions Should Capture It | Currently Captured? | Recommendation |
|------|-------------------------------------|-------------------------------------|---------------------|----------------|
| Restricted cash | | | | |
| Trapped foreign cash | | | | |
| Deposits in transit | | | | |
| Outstanding checks | | | | |
| Off-balance sheet items | | | | |
| Contingent liabilities | | | | |
| [Add others identified] | | | | |

---

## Part 5: Closing Statement & True-Up Mechanics

### 5.1 Timeline Extraction

| Stage | Days After Close | Responsible Party | Section Ref | Market Comparison |
|-------|------------------|-------------------|-------------|-------------------|
| Estimated Closing Statement delivery | | | | Market: At/before closing |
| Final Closing Statement preparation | | | | Market: 60-90 days |
| Seller review/access period | | | | Market: 30-45 days |
| Dispute notice deadline | | | | Market: 30 days after review |
| Negotiation period | | | | |
| Independent Accountant referral | | | | |
| Independent Accountant decision | | | | |
| Payment of true-up | | | | |

### 5.2 Process Mechanics

| Element | How SPA Handles It | Market Position | Section Ref |
|---------|-------------------|-----------------|-------------|
| Who prepares Estimated Statement | | | |
| Who prepares Final Statement | | | |
| Seller access to books/records | | | |
| Independent Accountant selection | | | |
| IA scope (disputed items only?) | | | |
| IA standard of review | | | |
| IA decision binding? | | | |
| Cost allocation for IA | | | |

### 5.3 Red Flags in True-Up Process
[List any one-sided timelines, access restrictions, or scope issues]

---

## Part 6: Escrow & Holdback Terms

### 6.1 Escrow Summary Table

| Escrow Type | Amount | % of Deal | Purpose | Release Timing | Release Conditions | Interest To | Section Ref |
|-------------|--------|-----------|---------|----------------|-------------------|-------------|-------------|
| General Indemnity | | | | | | | |
| PPA/Adjustment | | | | | | | |
| Special Purpose (specify) | | | | | | | |
| [Add others] | | | | | | | |

### 6.2 Market Comparison

| Element | This SPA | Market Benchmark (No RWI) | Market Benchmark (With RWI) | Assessment |
|---------|----------|---------------------------|----------------------------|------------|
| Indemnity escrow % | | ~10% | ~0.5% | |
| PPA escrow % | | ~1% | ~1% | |
| Escrow period | | 12 months | 12 months | |

### 6.3 Escrow Mechanics Details

**Funded from purchase price or in addition?** [Quote relevant language]

**Claim mechanics:**
- Minimum claim threshold:
- Claim notice requirements:
- Response period:
- Disbursement process:

**Relationship to indemnification:**
- Exclusive remedy? (Yes/No + quote)
- First source vs. sole source:
- Survival alignment:

---

## Part 7: Accounting Principles & Methodology

### 7.1 Hierarchy

**Priority Order (quote the hierarchy clause):**
1. [First priority]
2. [Second priority]
3. [Third priority]

**Verbatim Language:**
> [Quote the full Accounting Principles hierarchy]

**Section Reference:**

### 7.2 Key Methodology Questions

| Element | How SPA Addresses It | Section Ref |
|---------|---------------------|-------------|
| GAAP/IFRS specification | | |
| "Consistent with past practice" language | | |
| "Consistent with Financial Statements" language | | |
| Sample calculations / illustrative schedules | | |
| No hindsight / no new info provisions | | |
| No reclassification provisions | | |
| Reserves methodology (historical vs. GAAP true-up) | | |
| Cut-off time specification | | |
| FX rate determination | | |

### 7.3 Red Flags
| Issue | Quote | Risk |
|-------|-------|------|
| "As determined by Buyer" | | |
| "Consistent with Buyer's policies" | | |
| "Items that should have been recorded" | | |
| [Others] | | |

---

## Part 8: Sample Calculations & Schedules

For each schedule or illustrative calculation found, extract:

### Schedule: [Name]

**Reference:** [Schedule X.X, Page Y]

**Purpose:** [Working Capital / Cash / Indebtedness / Other]

**Accounts Explicitly Included:**
| Account/Line Item | Classification | Amount (if shown) |
|-------------------|----------------|-------------------|
| | | |

**Accounts Explicitly Excluded:**
| Account/Line Item | Reason for Exclusion |
|-------------------|---------------------|
| | |

**Target/Peg Amount:** [if applicable]

**Methodology Notes:**
[Any specific calculation rules, reserves, adjustments noted]

**Usefulness Assessment:**
- Sufficient detail to replicate calculation? (Yes/No)
- Ties to trial balance accounts? (Yes/No)
- Missing elements:

---

## Part 9: Earnout Provisions (If Present)

If no earnout, state "NO EARNOUT PROVISION" and skip to Part 10.

### 9.1 Earnout Summary

| Element | Details | Section Ref |
|---------|---------|-------------|
| Maximum earnout amount | | |
| Metric(s) | (EBITDA / Revenue / ARR / Milestones / Other) | |
| Measurement period(s) | | |
| Payment timing | | |
| Threshold/target | | |
| Cap | | |
| Floor | | |
| Linear vs. tiered payout | | |

### 9.2 Metric Definition

**Verbatim Definition:**
> [Quote the full earnout metric definition]

**Departures from GAAP/standard definition:**
[List any]

**Adjustments/add-backs:**
[List any]

### 9.3 Operational Covenants

| Covenant | Verbatim Language | Strength (Strong/Moderate/Weak) |
|----------|-------------------|--------------------------------|
| Operate in ordinary course | | |
| Maintain business lines | | |
| Budget/spending restrictions | | |
| No actions to reduce earnout | | |
| [Others] | | |

### 9.4 Acceleration & Forfeiture

| Trigger | Effect | Section Ref |
|---------|--------|-------------|
| Change of control | | |
| Termination of key employee | | |
| Divestiture of business | | |
| Breach of covenants | | |
| [Others] | | |

### 9.5 Set-Off Rights

- Set-off permitted against earnout? (Yes/No)
- Conditions/limitations:
- Quote:

### 9.6 Dispute Resolution

| Element | Details |
|---------|---------|
| Information/audit rights | |
| Dispute notice period | |
| Resolution mechanism | (Accountant / Arbitrator / Court) |
| Standard of review | |

### 9.7 Market Assessment

[Rate overall earnout structure and identify key risks]

---

## Part 10: Locked-Box Provisions (If Applicable)

If completion accounts (not locked-box), state "COMPLETION ACCOUNTS STRUCTURE - NO LOCKED-BOX" and skip to Part 11.

### 10.1 Locked-Box Summary

| Element | Details | Section Ref |
|---------|---------|-------------|
| Locked-box date | | |
| Locked-box accounts reference | | |
| Ticking fee rate | | |
| Ticking fee period | | |
| Leakage claim period | | |

### 10.2 Prohibited Leakage

**Verbatim Definition:**
> [Quote full leakage definition]

**Categories Covered:**
| Category | Included? | Specific Language |
|----------|-----------|-------------------|
| Dividends/distributions | | |
| Management fees | | |
| Payments to seller/affiliates | | |
| Bonuses outside ordinary course | | |
| Asset transfers | | |
| Guarantees/security | | |
| Waiver of amounts owed | | |
| Agreement to do any of above | | |
| [Others] | | |

### 10.3 Permitted Leakage

**Scheduled Permitted Leakage:**
| Item | Amount/Cap | Reference |
|------|------------|-----------|
| | | |

**Categorical Carve-Outs:**
| Category | Conditions |
|----------|------------|
| | |

### 10.4 Leakage Claim Mechanics

| Element | Details |
|---------|---------|
| Claim notice deadline | |
| Evidence requirements | |
| Dispute resolution | |
| Interest on leakage claims | |

---

## Part 11: Funds Flow Mechanics

### 11.1 Funds Flow Table

| Payment | Amount/Formula | Recipient | Timing | Funding Source | Section Ref |
|---------|---------------|-----------|--------|----------------|-------------|
| Cash to sellers | | | At closing | | |
| Debt payoff | | Lenders | At closing | | |
| Transaction expenses | | Advisors/Employees | At closing | | |
| Indemnity escrow | | Escrow Agent | At closing | | |
| PPA escrow | | Escrow Agent | At closing | | |
| Seller note | | Sellers | Deferred | | |
| Stock consideration | | Sellers | At closing | | |
| Earnout | | Sellers | Contingent | | |
| [Others] | | | | | |

### 11.2 Payment Mechanics

| Element | Details | Section Ref |
|---------|---------|-------------|
| Wire instructions timing | | |
| Paying agent (if any) | | |
| Allocation among multiple sellers | | |
| Withholding provisions | | |

---

## Part 12: Set-Off Rights (All Contexts)

### 12.1 Set-Off Summary

| Context | Set-Off Permitted? | Conditions | Quote | Section Ref |
|---------|-------------------|------------|-------|-------------|
| Against escrow | | | | |
| Against earnout | | | | |
| Against deferred payments | | | | |
| Against seller note | | | | |
| General set-off clause | | | | |

### 12.2 Limitations on Set-Off

| Limitation | Present? | Details |
|------------|----------|---------|
| Only finally determined amounts | | |
| Notice requirements | | |
| Cure period | | |
| Minimum threshold | | |
| Sole recourse to escrow | | |

---

## Part 13: Indemnification Mechanics (Financial Aspects)

### 13.1 Summary Table

| Element | Seller Indemnity | Buyer Indemnity | Section Ref |
|---------|------------------|-----------------|-------------|
| Cap (general reps) | | | |
| Cap (fundamental reps) | | | |
| Basket type | (Deductible / Tipping / Mini-basket) | | |
| Basket amount | | | |
| De minimis threshold | | | |
| Survival (general) | | | |
| Survival (fundamental) | | | |
| Survival (tax) | | | |

### 13.2 Exclusive Remedy Analysis

| Question | Answer | Quote |
|----------|--------|-------|
| Is indemnification the exclusive remedy? | | |
| Carve-outs from exclusive remedy? | | |
| Is escrow the exclusive source? | | |
| Can buyer pursue sellers directly after escrow exhausted? | | |

### 13.3 Alignment Check

| Element | Aligned? | Issue |
|---------|----------|-------|
| Escrow period vs. survival period | | |
| Escrow amount vs. cap | | |
| Basket vs. de minimis | | |

---

## Part 14: Tax Provisions (Beyond Definition)

### 14.1 Tax Allocation

| Element | Details | Section Ref |
|---------|---------|-------------|
| Pre-closing tax responsibility | | |
| Straddle period allocation method | (Closing of books / Proration / Hybrid) | |
| Transfer taxes allocation | | |
| Withholding mechanics | | |
| Gross-up provisions | | |

### 14.2 Tax Covenants

| Covenant | Present? | Key Terms |
|----------|----------|-----------|
| Cooperation on returns | | |
| No amended returns | | |
| Tax contest provisions | | |
| Refund allocation | | |

### 14.3 Tax Indemnity Overlap

- Tax indemnity present? (Yes/No)
- Overlap with Working Capital tax accruals addressed? (Yes/No)
- Quote anti-overlap language:

---

## Part 15: Insurance Provisions

### 15.1 R&W Insurance

| Element | Details | Section Ref |
|---------|---------|-------------|
| R&W insurance required/obtained? | | |
| Premium allocation | | |
| Retention amount | | |
| Impact on indemnification | | |

### 15.2 D&O Tail

| Element | Details | Section Ref |
|---------|---------|-------------|
| D&O tail required? | | |
| Premium payment responsibility | | |
| Captured in Transaction Expenses? | | |
| Policy term | | |

---

## Part 16: Intercompany Treatment

### 16.1 Intercompany Balances

| Element | Details | Section Ref |
|---------|---------|-------------|
| Intercompany balances addressed? | | |
| Settlement required pre-close? | | |
| Included in Indebtedness? | | |
| Included in Working Capital? | | |
| Which direction (receivables vs. payables)? | | |

### 16.2 Intercompany Agreements

| Element | Details |
|---------|---------|
| Termination required? | |
| Transition services? | |

---

## Part 17: FX Mechanics (If Cross-Border)

If single-currency domestic deal, state "SINGLE CURRENCY DEAL" and skip.

| Element | Details | Section Ref |
|---------|---------|-------------|
| Currencies involved | | |
| FX rate source | | |
| FX rate timing | | |
| FX risk allocation | | |
| Collar/hedging provisions | | |

---

## Part 18: Financial Representations

### 18.1 Financial Statements Rep

**Verbatim:**
> [Quote the financial statements representation]

**Analysis:**

| Element | Present? | Assessment |
|---------|----------|------------|
| "Fairly present" | | |
| "Accurate and complete" | | Higher standard - seller risk |
| "In all material respects" | | |
| "Taken as a whole" | | |
| Knowledge qualifier | | |
| Books and records qualifier | | |
| GAAP/IFRS compliance | | |
| Consistency | | |
| Interim period carve-outs | | |

### 18.2 No Undisclosed Liabilities Rep

**Verbatim:**
> [Quote if present]

**Carve-outs:**
[List]

### 18.3 Absence of Changes Rep

**Verbatim:**
> [Quote if present]

**Analysis:**
[Note any financially significant provisions]

---

## Part 19: Material Adverse Change/Effect

### 19.1 MAC/MAE Definition

**Verbatim:**
> [Quote full MAC/MAE definition]

### 19.2 Carve-Outs

| Carve-Out Category | Included? | Specific Language |
|-------------------|-----------|-------------------|
| General economic conditions | | |
| Industry conditions | | |
| Changes in law | | |
| Changes in GAAP/IFRS | | |
| Announcement of transaction | | |
| Actions required by agreement | | |
| Actions consented to by buyer | | |
| [Others] | | |

### 19.3 "Disproportionate Impact" Qualifier

- Present? (Yes/No)
- Language:

---

## Part 20: Comprehensive Risk Assessment

### 20.1 Top 10 Financial Risks (Ranked)

| Rank | Risk | Definitions/Sections Involved | Severity | Likelihood | Recommendation |
|------|------|------------------------------|----------|------------|----------------|
| 1 | | | High/Med/Low | High/Med/Low | |
| 2 | | | | | |
| ... | | | | | |

### 20.2 Double-Count Risks Summary

| Item | Risk Level | Mitigation Present? | Action Needed |
|------|------------|---------------------|---------------|
| | | | |

### 20.3 Gap Risks Summary

| Item | Risk Level | Currently Addressed? | Action Needed |
|------|------------|---------------------|---------------|
| | | | |

---

## Part 21: Negotiation Analysis

### 21.1 Buyer-Favorable Provisions

| Provision | Why Buyer-Favorable | Typical Seller Pushback | Suggested Compromise |
|-----------|---------------------|------------------------|---------------------|
| | | | |

### 21.2 Seller-Favorable Provisions

| Provision | Why Seller-Favorable | Typical Buyer Pushback | Suggested Compromise |
|-----------|----------------------|------------------------|---------------------|
| | | | |

### 21.3 Key Negotiation Leverage Points

| Issue | Current Position | Importance (High/Med/Low) | Negotiability | Suggested Approach |
|-------|------------------|---------------------------|---------------|-------------------|
| | | | | |

---

## Part 22: Suggested Revisions

For each materially off-market provision, provide:

### Revision [Number]: [Brief Description]

**Current Language:**
> [Quote exact current language]

**Section Reference:** [Section X.X, Page Y]

**Issue:** [Explain the problem]

**Suggested Revision:**
> [Proposed new language]

**Rationale:** [Why this is more balanced/market]

**Likely Pushback:** [Anticipated counterargument]

**Fallback Position:** [Compromise if initial revision rejected]

---

## Part 23: Counsel Questions & Open Issues

### 23.1 Questions Requiring Clarification Before Signing

| # | Question | Relevant Section | Why It Matters | Suggested Resolution |
|---|----------|------------------|----------------|---------------------|
| 1 | | | | |
| 2 | | | | |
| ... | | | | |

### 23.2 Diligence Items Triggered by Definitions

| Definition/Provision | Diligence Item Needed | Priority |
|---------------------|----------------------|----------|
| | | |

---

## Part 24: Executive Summary

### 24.1 Deal Overview (2-3 sentences)
[Summarize the deal structure and key financial mechanics]

### 24.2 Overall Assessment

| Dimension | Rating | Key Drivers |
|-----------|--------|-------------|
| Definitions clarity | 🟢🟠🔴 | |
| Anti-duplication robustness | 🟢🟠🔴 | |
| Price mechanics clarity | 🟢🟠🔴 | |
| True-up process fairness | 🟢🟠🔴 | |
| Escrow terms | 🟢🟠🔴 | |
| Overall balance (Buyer ↔ Seller) | 🟢🟠🔴 | |

### 24.3 Top 5 Issues to Raise with Partner/Client

1. **[Issue]:** [Brief description and recommendation]
2. **[Issue]:** [Brief description and recommendation]
3. **[Issue]:** [Brief description and recommendation]
4. **[Issue]:** [Brief description and recommendation]
5. **[Issue]:** [Brief description and recommendation]

### 24.4 30-Second Deal Summary

> "[Fill in this script for verbal briefing]:
>
> Headline is $[___] on a [cash-free/debt-free / locked-box / equity value] basis.
>
> Key definitions: Indebtedness is [broad/narrow/market] — [one notable point]. Cash [includes/excludes] restricted cash. NWC target is $[___] with [dollar-for-dollar / collar] mechanics.
>
> True-up: Buyer prepares final statement by [X] days; seller has [Y] days to dispute.
>
> Escrows: [X]% indemnity, [Y]% PPA, releasing at [timing].
>
> Key risks: [Top 2-3 issues].
>
> Overall: [Buyer-favorable / Balanced / Seller-favorable] — [one sentence on why]."

---

## Output Format Requirements

1. Complete ALL sections. Use "NOT FOUND" or "NOT APPLICABLE" where appropriate — do not skip sections.
2. Quote exact language wherever indicated — do not paraphrase definitions or key provisions.
3. Include section and page references for every extracted item.
4. Apply market position ratings consistently using: 🔴 Significantly Off-Market, 🟠 Slightly Off-Market, 🟢 Market Standard.
5. Provide actionable recommendations, not just observations.
6. The output should be usable by another advisor without reading the source document.

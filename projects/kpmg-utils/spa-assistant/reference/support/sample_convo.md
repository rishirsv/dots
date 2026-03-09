# SPA Assistant Training Conversation

> **Source:** ChatGPT conversation export
> **Topic:** Sell-side Share Purchase Agreement (SPA) financial diligence review
> **Transaction:** Project Thunderstruck

---

## Table of Contents

1. [Initial Prompt Library](#initial-prompt-library)
2. [Draft SPA Review - Seller Perspective](#draft-spa-review)
3. [Key Definitions Analysis](#key-definitions-analysis)
4. [Purchase Price Mechanics](#purchase-price-mechanics)
5. [Financial Statement Representations](#financial-statement-representations)
6. [Indebtedness Definition](#indebtedness-definition)
7. [Accounting Principles Review](#accounting-principles-review)
8. [Gap Period & Leakage](#gap-period-and-leakage)
9. [Materiality Thresholds](#materiality-thresholds)

---

## Initial Prompt Library

### User

> Here were the ad-hoc prompts I used in the training:
>
> **SPA Prompt Library (copy-paste ready)**
>
> **2.1 Initial High-Level Review — Prompt A (Overview & risk scan)**
> You are an M&A advisor on the buy side reviewing only the definitions section of a share purchase agreement for "Project Coffee". Summarize in plain language the definitions of: Accounting Policies, Cash, Indebtedness, Net Debt, Closing Net Working Capital, Transaction Expenses. For each, tell me whether it is neutral, buyer-friendly or seller-friendly, and why. Highlight any wording that could have second-order effects on the purchase price or post-closing adjustments. Work step-by-step, and finish with a short bullet list: "Top 5 issues I would raise with the buy-side partner."
>
> **2.2 Deep Dive on Indebtedness — Prompt B (Indebtedness heat-map)**
> Focus only on the definition of "Indebtedness" in this SPA excerpt. Break it into numbered components and restate each in plain English. For each component, classify it as: standard/market, mildly aggressive, or very aggressive for a buy-side definition. Identify any items that are unusual or likely to be contentious in negotiation. Explain the practical impact on the Net Debt calculation and therefore on the effective purchase price. Finish by drafting a buyer-side summary email to the deal team.
>
> **2.3 Role-play the definition — Prompt C (Buy-side vs Sell-side)**
> Let's role-play a negotiation on the Indebtedness definition. First act as buy-side counsel, listing the top 5 changes you want. Then switch to sell-side counsel, responding with pushback, compromises or alternative language. Format as a three-column table.
>
> **2.4 WC vs Net Debt Interaction — Prompt D (Classification risks)**
> Using the definitions, do a classification review: List borderline items. State where this SPA puts each and whether that is market practice. Highlight potential double counts or gaps. Suggest buyer-friendly but reasonable clarifications.
>
> **2.5 Appropriateness vs Financial Model — Prompt E**
> Compare textual definitions to a typical Excel bridge; find misalignments; propose drafting tweaks so a reasonable reader computes the same numbers as the model.
>
> **2.6 Seller-Side Perspective — Prompt F (Attack)**
> Switch to sell-side counsel: identify overly buyer-friendly drafting; propose seller-friendly revisions and the commercial arguments.
>
> **2.7 Scenario Testing — Prompt G (Stress-test)**
> Scenario 1 – Bad housekeeping: spike in overdue payables at Closing. Scenario 2 – Earn-out heavy acquisition. For each: allocate items across Indebtedness/NWC/Expenses per definitions; who wins if unchanged; buyer-side protections to seek.
>
> **2.8 One-shot Diagnostic — Prompt H**
> Paste the Definitions article; return a bullet list of key financial definitions; a green/amber/red heat map; and the top 5 drafting points with suggested wording.

### ChatGPT

You've essentially built a very strong prompt library for SPA definition analysis and buy-/sell-side diagnostics.

**Summary of Your SPA Prompt Library:**

| # | Prompt | Focus | Typical Use |
|---|--------|-------|-------------|
| A | High-Level Review | Summarize key definitions and identify price-sensitive issues | Initial triage |
| B | Deep Dive on Indebtedness | Deconstruct and classify sub-components | Financial exposure analysis |
| C | Role-Play | Simulate negotiation stances | Training and deal prep |
| D | WC vs Net Debt | Analyze where items sit between buckets | Detect double counts/gaps |
| E | Model Alignment | Compare legal definitions with financial model | Align drafting with model |
| F | Seller-Side Attack | Re-draft pro-seller positions | Test balance of definitions |
| G | Scenario Testing | Apply definitions to factual cases | Identify sensitivity |
| H | One-Shot Diagnostic | Rapid diagnostic with color-coded risk | Fast-screening |

**Suggested Next Step:** You could formalize this as a "SPA Definitions Toolkit" with:
- Input: SPA Definitions section (raw text)
- Menu: Choose analysis mode → [A-H]
- Output: Plain-English summary, Buyer/Seller skew rating, Negotiation heat-map, Top 5 comments

---

## Draft SPA Review

### User

> Can I submit a draft SPA for you to review?

### ChatGPT

Yes — you can absolutely submit a draft Share Purchase Agreement for review. I can conduct a seller-side or buyer-side diagnostic, and produce structured outputs such as:

- **Definition-level review:** plain-English summaries and buy/sell skew analysis
- **Financial interaction analysis:** how definitions interrelate
- **Risk and mitigation matrix:** identifying risks with proposed mitigations
- **Negotiation briefing note:** buyer vs. seller positions
- **Clause stress-tests:** how the SPA behaves under edge cases

---

### User

> Attached is the draft SPA. We are supporting Seller, hence please review from a financial diligence sell-side perspective including commenting on definitions, identifying seller risks, areas where buyer can be aggressive, etc.

### ChatGPT

I've reviewed your full draft Project Thunderstruck SPA (Seller-side). Below is a comprehensive financial diligence review.

#### 1. Key Financial Definitions — Summary & Seller Risk Rating

| Definition | Summary | Bias | Key Observations |
|------------|---------|------|------------------|
| **Accounting Principles** | Refers to IFRS as at signing, except that specific "Accounting Principles" in Schedule 1.1(a) override IFRS | ⚠️ Buyer-leaning | Schedule 1.1(a) takes precedence — if tailored to the buyer's model, this could override IFRS flexibility |
| **Indebtedness** | Broad "catch-all" including capital leases, deferred purchase price, accrued interest, taxes payable, FX contracts, letters of credit, etc. | 🚨 Highly buyer-friendly | Unusually broad — includes income taxes payable, FX contracts, and breakage fees. Recommend narrowing to interest-bearing debt only |
| **Transaction Expenses** | All costs of negotiation and completion, plus bonuses, retention, severance, equity cancellation, employer payroll taxes, etc. | ⚠️ Buyer-leaning | Includes many employee costs triggered by deal completion |
| **Closing Book Value** | Assets less liabilities (including Indebtedness + Transaction Expenses) per Closing Balance Sheet | ⚠️ Buyer-leaning | Linking book value to CET1 may reduce equity if the bank's capital exceeds 13% |
| **Closing Net Working Capital** | Embedded in "Book Value," not defined separately | ⚠️ Ambiguous | Absence of standalone NWC definition may lead to disputes |
| **Purchase Price** | Calculated as Closing Book Value × 1.15 "Premium" | ✅ Neutral | Mathematically neutral but heavily dependent on Book Value definition |
| **Purchase Price Adjustment** | Based on difference between Estimated and Closing Book Value | ⚠️ Process risk | Buyer prepares Closing Statements; seller can object but only within 30 days |

#### 2. Financial Mechanics — Areas of Concern

**(a) Indebtedness Double Counting Risk**
- Overlap risk between Indebtedness, Transaction Expenses, and Working Capital
- **Mitigation:** Include a schedule allocating each item exclusively to one bucket

**(b) CET1 Capital Ratio Clause**
- Seller must maintain ≥ 13% CET1 prior to closing, but any excess is excluded from value
- Buyer effectively acquires over-capitalized bank equity at no premium
- **Mitigation:** Negotiate that "excess capital" above 13% is dividendable or included in Book Value

**(c) Purchase Price Adjustment Process**
- Buyer prepares both Estimated and Final statements; seller's recourse limited to short objection window
- **Mitigation:** Require 45–60 day review window, equal access to records, neutral accountant jointly appointed

#### 3. Buyer Aggressiveness Hotspots

| Area | Buyer Position | Seller Risk |
|------|----------------|-------------|
| Indebtedness scope | Includes deferred purchase price, tax liabilities, FX contracts | May double count; reduces headline equity |
| Working capital definition missing | Buyer can argue for inclusion of accrued liabilities | Potential downward adjustment post-close |
| CET1 capital "floor" with no upside return | Buyer gets undervalued capital cushion | Material value leakage for regulated entity |
| Indemnity regime | 24-month general survival; 10-year for fundamentals | Strongly buyer-leaning |
| Interim covenants | Purchaser consent required for ordinary-course changes | Operational rigidity |

#### 4. Top 5 Seller Priorities

1. **Narrow Indebtedness** to exclude taxes payable, breakage fees, and other non-interest-bearing liabilities
2. **Protect Closing Book Value** — clarify that CET1 above threshold accrues to Seller
3. **Tighten Purchase Price Adjustment Process** — longer review window, neutral accountant
4. **Add Working Capital Definition** and illustrative schedule
5. **Negotiate Share Consideration Collar** — to protect Seller from share price volatility

---

## Key Definitions Analysis

### User

> Summarize what is in the indebtedness definition and what may be considered outside of the reported balance sheet.

### ChatGPT

#### Summary of Indebtedness Definition (Plain English Breakdown)

The SPA defines "Indebtedness" broadly — 13+ sub-items designed to capture every obligation resembling debt:

| # | Component | Meaning | Balance Sheet Treatment |
|---|-----------|---------|------------------------|
| 1 | Borrowed money / deposits / advances | Standard bank or intercompany loans | On balance sheet |
| 2 | Bonds, notes, debentures | Any formal debt instrument | On balance sheet |
| 3 | Interest-bearing obligations | Anything on which interest is paid | On balance sheet |
| 4 | Conditional sale / title-retention | Vendor financing or deferred title | May be off-balance |
| 5 | Deferred purchase price | Long-term payables, earn-outs | Partially off-balance if contingent |
| 6 | Debt secured by Liens | "Deemed" debt if assets encumbered | Usually not shown |
| 7 | Guarantees | Any guarantee obligation | Often off-balance |
| 8 | Capital lease obligations (IFRS 16) | Lease liabilities under IFRS 16 | On balance sheet since 2019 |
| 9 | Letters of credit / guarantee | Contingent exposures | Off-balance unless drawn |
| 10 | Bankers' acceptances | Trade financing instruments | Usually on balance sheet |
| 11 | FX swaps, currency options | Derivative liabilities | May be off-balance |
| 12 | Income taxes due and payable | Current tax payable | On balance sheet — double counted risk |
| 13 | Accrued interest, breakage, penalties | Ancillary debt-repayment costs | Often not yet accrued |

#### Items Potentially Outside the Reported Balance Sheet

| Category | Description | Risk/Impact |
|----------|-------------|-------------|
| Guarantees and letters of credit | Corporate guarantees for affiliates | May be fully deducted from equity even if no call |
| Deferred or contingent payables | Earn-outs, deferred service fees | May not be recognized yet; buyer could claim as debt |
| Tax balances | Current income taxes "due and payable" | Double counting risk with current tax liability |
| FX and derivative mark-to-markets | Currency/interest-rate swaps | Off-balance if not MTM recognized |
| Breakage / termination fees | Costs of early repayment | Generally not accrued — can create unbooked downward adjustment |

#### Key Seller Protections

1. **Limit Indebtedness** to interest-bearing liabilities
2. **Add carve-outs** for: income taxes in working capital, Transaction Expenses, contingent obligations not triggered
3. **Clarify securitization treatment** — recognize only those in consolidated financials
4. **Require consistency** with Accounting Principles / historical policy
5. **Disclose schedule of Indebtedness at signing** — freeze scope

---

## Purchase Price Mechanics

### User

> Is paying based on the book value approach market?

### ChatGPT

**Yes** — using a book-value-based purchase price is market-standard for **regulated or financial institution deals**, but less common in general corporate M&A.

| Deal Type | Typical Pricing Mechanism | Commentary |
|-----------|--------------------------|-------------|
| Financial institutions / banks / insurers | Book Value × Premium (1.1–1.5×) | Common when value resides in regulatory capital |
| Operating companies (non-regulated) | Enterprise Value (EBITDA multiple) less Net Debt | Reflects future earnings power |
| Hybrid fintech / loyalty / retail finance | Blend: EV-based pricing with equity capital adjustments | Both balance sheet and earnings matter |

**Market elements in this SPA:**
- ✅ Valuation as multiple of Closing Net Book Value
- ✅ Premium factor (1.15) representing goodwill and synergies
- ⚠️ "Closing Book Value" includes Indebtedness and Transaction Expenses (erodes premium)
- ⚠️ CET1 capital exclusion departs from market practice

**Bottom line:**
- ✅ The pricing framework (Book Value × Premium) is market for this sector
- ⚠️ The implementation details skew buyer-friendly

---

### User

> Is 13% for the CET1 ratio a good rate for the Seller?

### ChatGPT

A 13% CET1 ratio is moderately conservative. Whether it's "good" depends on how it interacts with value realization.

**What the 13% Threshold Does:**
- Vendor may distribute capital before closing, provided PCB maintains CET1 ≥ 13%
- Anything above 13% is excluded from "Closing Book Value"
- In effect, capital above 13% can be dividended out, but any surplus left is value leakage to the buyer

**How 13% Compares to Market:**

| Benchmark | Typical Range | Comment |
|-----------|---------------|---------|
| OSFI minimum | ~11.5% total CET1 requirement | 13% is above regulatory minimum |
| Peer large-bank operating range | 12–13% | 13% sits at top end |
| Market precedent for carve-outs | 11–12.5% CET1 | 13% is slightly higher than typical |

**Implication for Seller Value:**
- Every 1% of CET1 above agreed level = trapped equity not paid for
- If RWA base is CAD $10B, then 1% CET1 = CAD $100M of equity
- Holding 13% instead of 11.5% leaves ≈ CAD $150M that may not be monetized

**Seller-Friendly Adjustments:**
1. Cap at "not greater than 13%" or "approximately 13%, subject to OSFI guidance"
2. Include explicit right to sweep excess capital before closing
3. Confirm CET1 computed on same RWA basis as historical filings

**Verdict:**
- 13% CET1 is regulatorily sound but slightly high for Seller
- A 12%–12.5% threshold would be more value-efficient while still above OSFI minimums

---

### User

> Please summarize the purchase price equation.

### ChatGPT

#### Core Equation

```
Purchase Price = (Closing Book Value) × (Premium of 1.15)
```

Where:
- **Closing Book Value** = Total Assets – Total Liabilities (including Indebtedness and Transaction Expenses)
- **Premium (1.15)** = 15% uplift on net book equity

#### Purchase Price Flow

1. Vendor delivers **Estimated Closing Statements** (Estimated Book Value and Estimated Purchase Price)
2. **Closing Price paid** = mix of cash + Purchaser shares + direct payment of Vendor Transaction Expenses
3. After closing, Purchaser prepares **final Closing Statements:**
   - If Final > Estimated → Buyer pays Seller the difference
   - If Final < Estimated → Seller repays Buyer the difference

#### Key Adjustments

| Component | Description | Seller Implication |
|-----------|-------------|-------------------|
| Indebtedness | Deducted in liabilities | Direct downward adjustment to equity |
| Transaction Expenses | Included as liability; also paid at closing | Double impact if not carefully scoped |
| CET1 Capital Ratio | Any capital above 13% excluded | Traps excess equity |
| Post-Closing Adjustment | Based on estimated vs final book value | Buyer controls closing statements → process risk |

---

## Financial Statement Representations

### User

> Please review if this Financial Statements representation clause is Seller friendly.

### ChatGPT

#### Clause Reviewed

The Financial Statements representation contains these key elements:
- Prepared in accordance with IFRS consistently applied
- "Fairly present" the financial position
- "The Financial Statements are **accurate and complete** in all material respects"

#### Seller-Side Analysis

| Issue | Seller Concern | Why It's Risky |
|-------|---------------|----------------|
| "Accurate and complete" | Goes beyond "fairly present" | Implies audit-level precision guarantee |
| Two "fairly present" statements | Each statement judged individually | Buyer could allege breach for isolated immaterial item |
| No "knowledge" qualifier | Absolute warranty | Seller responsible for unknown issues |
| No "books and records" qualifier | Broadens scope | Includes unaudited or third-party consolidation risks |

#### Comparative Summary

| Feature | Weston SPA (2021) | Thunderstruck SPA | Seller View |
|---------|------------------|-------------------|-------------|
| Core Standard | "Fairly present in all material respects and taken as a whole" | "Accurate and complete in all material respects" | 🔻 Thunderstruck too strong |
| Knowledge | "Prepared from the books and records" | Omitted | 🔻 Should insert |
| Materiality | Express and holistic | Limited | 🔻 Needs broader application |

#### Recommended Seller-Friendly Revision

> "The Financial Statements have been prepared in accordance with IFRS consistently applied by the Seller in the ordinary course of business and, **to the knowledge of the Seller**, fairly present **in all material respects and taken as a whole** the financial position and results of operations of the Acquired Companies as of the dates and for the periods indicated, subject to normal year-end adjustments and the absence of notes."

---

### User

> What carve-out language was used in the Weston Foods Financial Statement representation?

### ChatGPT

The Weston Foods / Wonder Brands SPA (2021) used several protective carve-outs:

#### 1. Interim-Statement Qualifications
> "...subject to (x) the exclusions described in the Financial Statements and (y) in the case of the Interim Financial Statements, normal and recurring year-end adjustments (the effect of which will not be materially adverse) and the absence of notes..."

**Effect:** Protects Seller against immaterial year-end or disclosure-note differences

#### 2. Materiality and "Taken as a Whole" Language
> "The Financial Statements fairly present, **in all material respects and taken as a whole**, the assets, liabilities... and financial position..."

**Effect:** Limits exposure to aggregate material misstatements, not line-item variances

#### 3. "Prepared from the Books and Records"
> "The Financial Statements have been prepared from the books and records of the Weston Foods Business."

**Effect:** Confines representation to Seller's own accounting records

#### 4. Liability Carve-Out
> "No member of the Company Group has any material liabilities... except (i) as expressly reflected in or adequately reserved against in the Financial Statements; (ii) for liabilities incurred in the ordinary course since the date of the Latest Balance Sheet; (iii) for liabilities that are not material; (iv) for liabilities for fees incurred in connection with this Agreement..."

**Effect:** Provides multiple safe harbors for ordinary-course, immaterial, or already-adjusted liabilities

#### 5. No "Accurate and Complete" Statement
The Weston clause omits any wording like "accurate and complete."

**Effect:** Avoids converting a disclosure-based rep into an absolute truth warranty

---

## Indebtedness Definition

### User

> Please review the following indebtedness definition and suggest revised wording from Seller's perspective.

### ChatGPT

#### Buyer-Favorable Elements

| Clause | Issue | Seller Risk |
|--------|-------|-------------|
| (a) "deposits or advances of any kind" | Undefined — could include customer deposits | Converts operating liabilities into "debt" |
| (c) "interest charges customarily paid" | Subjective — can catch trade payables | Expands beyond financing obligations |
| (f) "secured by any Lien" | Could include third-party debt without assumption | Seller pays for unrelated debt |
| (k) "foreign exchange contracts" | Captures hedges in asset position | Overstates debt if in-the-money |
| (l) "income taxes due and payable" | Double counts with working capital | Reduces equity twice |
| (n) "breakage costs, fees" | Broadly includes hypothetical costs | Buyer may deduct costs never paid |

#### Seller-Friendly Revision

```
"Indebtedness" of any Person means, without duplication and solely
to the extent not included in Working Capital or Transaction Expenses:

(a) all obligations for borrowed money (including principal of any
    drawn bank indebtedness);
(b) all obligations evidenced by bonds, debentures, notes or similar
    instruments;
(c) all obligations under financing arrangements that bear interest
    as of the Measurement Time;
(d) all obligations under capitalized leases under IFRS 16;
(e) all obligations for deferred purchase price, other than
    (i) current trade payables and (ii) earn-outs until due;
(f) all guarantees that have been drawn upon or called;
(g) all obligations for drawn letters of credit or letters of
    guarantee;
(h) all accrued but unpaid interest, breakage or prepayment
    penalties actually payable.

For greater certainty, Indebtedness shall not include:
(i)   trade payables, accrued liabilities, or customer deposits
      incurred in the ordinary course;
(ii)  income or other Taxes payable (except to extent not in
      Working Capital);
(iii) unfunded pension, severance or bonus obligations included
      in Transaction Expenses;
(iv)  contingent obligations, letters of credit or guarantees
      not yet drawn.
```

#### Key Effects of Revision

- Aligns with IFRS and market practice — limits to true financial debt
- Prevents double counting against Working Capital and Transaction Expenses
- Eliminates "customarily paid interest" ambiguity
- Restricts contingent or untriggered obligations
- Adds clarity for both parties

---

## Accounting Principles Review

### User

> Please review the accounting principles document for neutrality friendly wording. It was prepared by the buyer.

### ChatGPT

The Accounting Principles give the Buyer broad interpretive control over how Closing Statements are prepared. Below are the key buyer-friendly elements:

#### Buyer-Leaning Provisions

| Phrase/Clause | Why Buyer-Leaning | Seller Revision |
|---------------|------------------|-----------------|
| "full accrual for all liabilities" | Requires recognition of all potential liabilities, even if not IFRS-required | Replace with "accruals to the extent required under IFRS and consistent with 2024 policies" |
| "no item shall be excluded on grounds of immateriality" | Forces inclusion of de minimis items | Add materiality threshold |
| "deferred Tax assets and liabilities included" | Lets Buyer record new deferred taxes | Exclude DTAs/DTLs except those in 2024 audit |
| "CET1 shall be reduced by capital in excess of 13%" | Treats surplus capital as value-free to Buyer | Allow Seller to sweep or receive credit |
| "Adjusting events up to Purchaser's delivery date" | Gives Buyer long post-Closing window | Limit to Seller's Estimated Statement date |
| "IFRS shall prevail" | Buyer can re-interpret IFRS more conservatively | Add hierarchy: Accounting Principles > Historical Policies > IFRS |

#### Recommended Additions

1. **Hierarchy Clause:**
   > "In the event of inconsistency, the Accounting Principles shall prevail over IFRS, and historical policies applied in 2024 shall prevail over any alternative IFRS interpretation."

2. **Materiality Threshold:**
   > "Items below $50,000 individually or $250,000 in aggregate shall be disregarded."

3. **No New Policies:**
   > "The Statements shall not incorporate any new or revised accounting policies or methodologies."

4. **Symmetry Clause:**
   > "Both favorable and unfavorable adjusting events shall be treated on a consistent basis."

---

### User

> Is the clause "No item shall be excluded solely on the grounds of immateriality" appropriate?

### ChatGPT

**No** — from a seller standpoint, this clause is unequivocally disadvantageous and should be removed or modified.

#### Why This Clause Hurts Seller

| Issue | Impact |
|-------|--------|
| Eliminates IFRS materiality | IFRS is built on materiality — this overrules it |
| Allows "nickel and diming" | Buyer can dispute hundreds of trivial items |
| Increases dispute costs | Independent Accountant reviews become longer and more expensive |
| Contradicts accounting framework | IFRS is explicitly materiality-based |
| Enables category-shifting games | Tiny reclassifications impact Closing Book Value |
| Not market standard | Does not appear in balanced completion-accounts SPAs |

#### Seller-Friendly Alternatives

**Option A — Classic Threshold:**
> "No adjustment shall be made for any item that is less than $[50,000] individually or $[250,000] in the aggregate."

**Option B — IFRS Aligned:**
> "The Statements shall be prepared applying materiality in accordance with IAS 1 and IFRS, and immaterial items may be disregarded."

**Option C — Compromise:**
> "No adjustment shall be made for immaterial items, except to prevent double counting."

**Recommended Blended Formulation:**
> "For purposes of the Statements, no adjustment shall be made for any item that is immaterial, whether individually or in the aggregate, in accordance with IAS 1 and IFRS. Items less than $25,000 individually or $150,000 in the aggregate shall be deemed immaterial."

---

## Gap Period and Leakage

### User

> Review the Gap Period leakage clause from seller's perspective.

### ChatGPT

#### Original Clause (Buyer-Friendly)

> "The Statements shall include full accrual or liability in respect of any leakage of value... in the Gap Period, including: (i) capital transactions, dividends or distributions; (ii) any liabilities undertaken; (iii) any bonuses paid or payable; (iv) any payments to Vendor or Affiliates; (v) Transaction Expenses in Gap Period; and (vi) any Taxes on (i)-(v)."

#### Issues for Seller

| Issue | Buyer Advantage | Seller Risk |
|-------|-----------------|-------------|
| "Full accrual or liability" | Lets Buyer record any potential leakage | Creates artificial liabilities |
| "Leakage of value" undefined | Broad term can include ordinary-course payments | Normal expenses treated as leakage |
| "Inclusive" of all payments | Catch-all scope | Seller pays twice |
| No control qualifier | Applies even to events beyond Seller's control | Seller assumes post-signing risk |
| No materiality threshold | Buyer can claim immaterial items | Administrative burden |

#### Seller-Neutral Revision

> "The Statements shall include accruals for any **actual and identifiable** leakage of value occurring during the Gap Period, to the extent such leakage:
> (i) arises from actions taken by or on behalf of the Vendor **without the Purchaser's prior written consent**,
> (ii) is **material in amount** (exceeding $50,000 individually or $250,000 in aggregate), and
> (iii) is **not already reflected** in Working Capital or Transaction Expenses calculations.
>
> For clarity, **ordinary-course transactions, accruals, and expenses consistent with past practice shall not constitute leakage**."

---

## Transaction Expenses Definition

### User

> Please review this Transaction Expenses definition from seller perspective.

### ChatGPT

#### Assessment

This is a **broad (buyer-friendly)** Transaction Expenses definition. Key concerns:

| Sub-clause | Buyer Benefit | Seller Risk |
|------------|---------------|-------------|
| (a) Professional fees | Standard, but "on behalf of" can pull in Vendor costs | Vendor's bank fees allocated down |
| (b) Bonuses and comp | Very broad — catches retention, severance, benefits | Retention benefiting Buyer reduces Seller price |
| "Accrued vacation / PTO" | Ambiguous — usually normal WC liability | Blurs line between WC and Transaction Expenses |
| (c) Equity awards | Can pick up Vendor-level equity plan costs | Should stay with Vendor |
| (d) Catch-all | "In whole or in part" captures non-incremental amounts | Pre-existing obligations caught |

#### Seller-Friendly Principles

Transaction Expenses should be:
1. Only **incremental, deal-related costs** that are legal obligations of the Acquired Entities
2. **Not already paid** before Measurement Time
3. **Not normal course operating liabilities** or buyer-benefit costs (e.g., post-closing retention)

#### Recommended Limits

- Restrict to amounts payable **by** Acquired Entities (not "on behalf of")
- Carve out normal WC items and general accrued vacation
- Narrow comp to **deal-specific and incremental** items only
- Ensure Vendor's own advisory fees and equity plans are excluded

---

## IAS 10 (Events After Reporting Period)

### User

> What is IAS 10?

### ChatGPT

**IAS 10** is the International Accounting Standard titled **"Events After the Reporting Period."**

#### Purpose
Ensures financial statements reflect conditions that existed at the reporting date, while separating them from events that arise afterward.

#### Key Definitions

| Term | Description |
|------|-------------|
| **Events after the reporting period** | Events occurring between end of reporting period and authorization date |
| **Adjusting events** | Provide further evidence of conditions at reporting date → **Require adjustments** |
| **Non-adjusting events** | Relate to conditions arising after reporting date → **Disclose only if material** |

#### Examples

| Adjusting Events (Adjust FS) | Non-Adjusting Events (Disclose Only) |
|------------------------------|-------------------------------------|
| Bankruptcy of a customer confirming a loss | Natural disasters after period-end |
| Settlement of a lawsuit confirming obligation | Major business combinations |
| New info about inventory value | Share issues after reporting date |

#### In SPA Context

The Accounting Principles reference IAS 10 to define what post-Measurement-Time events can alter Closing Statements:
- Only "adjusting events" providing evidence of conditions existing at Measurement Time may be reflected
- This **limits Buyer's ability to revalue balances** for new developments — protecting Seller

---

## Materiality Thresholds

### User

> Can you suggest a potential seller-friendly alternative such as a threshold?

### ChatGPT

Here are several seller-friendly, market-standard alternatives:

#### Option A — Classic Threshold (Most Common)
> "No adjustment shall be made for any item that is less than $[X] individually or $[Y] in the aggregate."

Market typical values:
- Individual: $25k–$100k
- Aggregate: $100k–$500k

#### Option B — IFRS Materiality (Defensible)
> "The Statements shall be prepared applying materiality in accordance with IAS 1 and IFRS, and immaterial items may be disregarded."

#### Option C — Double-Counting Guard + Materiality
> "No adjustment shall be made for immaterial items, except to the extent necessary to prevent double counting."

#### Option D — De Minimis Clause (UK/EU Style)
> "De minimis variations and other trivial, clerical or rounding differences shall be disregarded."

#### Option E — Category Level
> "Items that are not material in the context of the Statements taken as a whole shall be disregarded."

#### Option F — Compromise (Buyers Often Accept)
> "Adjustments shall be made only to the extent they are material, individually or in the aggregate, to the determination of Closing Book Value."

#### Recommended Blended Formulation

> "For purposes of the Statements, no adjustment shall be made for any item that is immaterial, whether individually or in the aggregate, in accordance with IAS 1 and IFRS. Items less than **$25,000 individually** or **$150,000 in the aggregate** shall be deemed immaterial."

This combines:
- ✅ IFRS materiality (objective standard)
- ✅ A bright-line threshold (protects Seller)
- ✅ A reasonable floor (Buyers rarely object to quantified thresholds)

---

## Summary

This conversation covered a comprehensive sell-side financial diligence review of a Share Purchase Agreement, including:

1. **Prompt library** for SPA analysis
2. **Definition reviews** (Indebtedness, Working Capital, Transaction Expenses)
3. **Purchase price mechanics** (Book Value × Premium approach)
4. **Financial statement representations** and market comparisons
5. **Accounting principles** neutrality analysis
6. **Gap period and leakage** protections
7. **Materiality thresholds** and IFRS alignment

Key seller priorities identified:
- Narrow Indebtedness to interest-bearing debt only
- Anchor accounting to 2024 audited financial statements
- Add materiality thresholds
- Protect CET1 surplus capital
- Ensure symmetrical treatment of adjustments

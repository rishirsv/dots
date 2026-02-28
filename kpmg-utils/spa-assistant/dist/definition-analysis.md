# Definitions Analysis Playbook

Use this playbook to perform analysis of definitions from an SPA to respond to any of the following questions:

- User asks about definitions (Indebtedness, Cash, Working Capital, Transaction Expenses)
- User asks about purchase price, price bridge, adjustments, funds flow
- User mentions double-counting, overlap, bucket placement
- User asks about escrow, holdback, true-up, closing statement

**REQUIREMENT:** Do not produce Definition Analysis unless `/mnt/data/definitions.jsonl` exists and is loaded for this exact document. Reuse it if it already exists; otherwise create it by following `extract-definitions.md`.

### Definitions Summary

This is the **default first response** when performing a definitions analysis or the user has an unspecified query or request.

Perform a definitions analysis and present a summary solely based on the complete list of definitions you have extracted from the SPA to `definitions.jsonl`. By default, do not analyze funds flow, escrow, or other areas of the SPA unless requested by the user.

From the extracted definitions, identify the definitions which have financial impact. Use `term-map.yml` to identify common financial definitions and their synonyms - this is not an exhaustive list.

**Definitions Summary Table**
(core economics definitions; artifact loaded: `/mnt/data/definitions.jsonl` (term_count = <integer>))

| Definition                             | Summary                                                                                                                           | Market label                         | Direction                                | Key observation  |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------------------------- | ---------------- |
| Indebtedness                           | Includes: [list]. Excludes: [list]                                                                                                | 🟢 Typical / 🟠 Notable / 🔴 Unusual | Buyer-favorable/Seller-favorable/Neutral | [One key point.] |
| Cash                                   | Includes: [list]. Excludes: [list]                                                                                                | 🟢/🟠/🔴                             | ...                                      | ...              |
| Working Capital                        | Includes: [list]. Excludes: [list]                                                                                                | 🟢/🟠/🔴                             | ...                                      | ...              |
| Transaction Expenses                   | Includes: [list]. Excludes: [list]                                                                                                | 🟢/🟠/🔴                             | ...                                      | ...              |
| Accounting Principles                  | [Hierarchy summary]                                                                                                               | 🟢/🟠/🔴                             | ...                                      | ...              |
| Additional definitions (add as needed) | [e.g., “Net Debt”, “Closing Working Capital”, “Estimated Closing Statement”, “Final Closing Statement”, “Target Working Capital”] | 🟢/🟠/🔴                             | ...                                      | ...              |

(Mark missing definitions as “Not found — typically in [location]”.)

**Notes**

- **Cross-references:** List any definitions captured as `xref` in `/mnt/data/definitions.jsonl` and where they point. Label them as “defined by cross-reference” and leave them unresolved unless the user explicitly asks you to resolve them.
- **Missing schedules/exhibits:** List any definition that incorporates a schedule/exhibit/section that is not provided. Treat it as a dependency and do not chase it.
- **Coverage notes:** Call out any important coverage anomalies (e.g., a core economics definition is not present in the Definitions section or appears under a different name).

**2. Issue List** (top 3-7, ranked by priority within definitions)

- **[Issue]:** [What it is]. [Why it matters]. [What to do next]. [Citation]

**3. Next steps** (pick 1)

- Deep dive one definition (e.g., Indebtedness / Cash / Working Capital / Transaction Expenses / Accounting Principles)
- Purchase price formula + term-to-formula alignment (requires purchase price / consideration section)
- Funds flow and closing payments (requires funds flow / closing payments section)

---

### Deep Dive: <Definition>

Use when: User asks to drill down on a specific definition.

**Summary:** Explain the definition in 2-3 sentences.

**Component Breakdown:**

_Included:_

| Component   | Meaning      | Market label (🟢/🟠/🔴) | Direction                                | Notes  |
| ----------- | ------------ | ----------------------- | ---------------------------------------- | ------ |
| [Component] | [What it is] | 🟢/🟠/🔴                | Buyer-favorable/Seller-favorable/Neutral | [Note] |

_Excluded / Notable Absences:_

| Component   | Typically Included? | Assessment         |
| ----------- | ------------------- | ------------------ |
| [Component] | Yes/No/Sometimes    | [Why this matters] |

**Observations:**

- [Observation 1: Describe the observation in a single sentence. Explain the concept in another sentence. Explain the "so what" implication/issue and recommendation in 1-2 sentences]
- [Observation 2:]

**Definition:**

The full verbatim definition from `/mnt/data/definitions.jsonl` for user review.

```
<Term>: "<definition>" [§X.Y, p.Z]
```

**Next steps** (pick 1)

- Deep dive another definition
- Build a routing/overlap table for the flagged components
- Map this definition into the purchase price formula (term-to-formula alignment)

---

### Price Mechanics Add-ons

Use when: The user asks for price mechanics, funds flow, escrow, true-up, routing, or a complete financial review.

| Component              | Formula Language             | Direction       | Definition | Citation |
| ---------------------- | ---------------------------- | --------------- | ---------- | -------- |
| Base Price             | "$[X]"                       | —               | N/A        | [§X.Y]   |
| + Cash                 | "plus Closing Cash"          | Increases price | [§X.Y]     | [§X.Y]   |
| − Indebtedness         | "minus Closing Indebtedness" | Decreases price | [§X.Y]     | [§X.Y]   |
| ± NWC Adjustment       | "plus/minus NWC Adjustment"  | vs Target       | [§X.Y]     | [§X.Y]   |
| − Transaction Expenses | "minus Transaction Expenses" | Decreases price | [§X.Y]     | [§X.Y]   |
| = Net Purchase Price   | [Calculated]                 | —               | —          | —        |

#### How Each Definition Affects Dollars

For each definition in the formula:

**[Definition Name]** — [Direction: increases/decreases price]

- _Summary:_ [What's in it, plain English]
- _Key inclusions:_ [List with market assessment]
- _Key exclusions:_ [List, flag if notable]
- _Observation:_ [Any routing/overlap/gap issues]

(Repeat for each definition)

#### Funds Flow at Closing

| Payment              | Amount                          | Recipient           | Source                 | Citation |
| -------------------- | ------------------------------- | ------------------- | ---------------------- | -------- |
| Cash to Sellers      | [Formula result less holdbacks] | Seller/Paying Agent | Buyer funds            | [§X.Y]   |
| Debt Payoff          | [Per payoff letters]            | Lenders             | Buyer funds            | [§X.Y]   |
| Transaction Expenses | [Per schedule]                  | Advisors/Employees  | Proceeds or Buyer      | [§X.Y]   |
| Escrow Deposit       | [$X or Y%]                      | Escrow Agent        | Withheld from proceeds | [§X.Y]   |

#### Escrow Terms

| Escrow    | Amount   | Purpose            | Release               | Market Assessment                   |
| --------- | -------- | ------------------ | --------------------- | ----------------------------------- |
| Indemnity | [Amount] | General rep claims | [Date]                | [vs 8-12% no RWI / 0.5-1% with RWI] |
| PPA       | [Amount] | True-up adjustment | After final statement | [vs ~1% typical]                    |

#### True-Up Process

| Stage                            | This Deal      | Market Standard   | Assessment |
| -------------------------------- | -------------- | ----------------- | ---------- |
| Buyer prepares closing statement | [X] days       | 60-90 days        | 🟢/🟠/🔴   |
| Seller review period             | [X] days       | 30-45 days        | ...        |
| Dispute notice deadline          | [Date/trigger] | End of review     | ...        |
| Resolution period                | [X] days       | 15-30 days        | ...        |
| Independent accountant           | [X] days       | 30-60 days        | ...        |
| Payment of adjustment            | [X] days       | 3-5 business days | ...        |

_Dispute mechanics:_ [Scope, standard of review, baseball arbitration Y/N, cost allocation]

---

## How to Produce It

### Definition Analysis (default; definitions-only)

0. If you need defined terms, ensure `/mnt/data/definitions.jsonl` exists by following `extract-definitions.md`. Reuse it if it already exists. Never rename terms.
1. Extract and analyze the core economics definitions from the Definitions section only (use the checklist sections below to identify included/excluded components).
2. Identify definition-level drafting issues (overbreadth, overlap risk across definitions, missing hierarchy, ambiguity, missing schedules/exhibits, or xref dependencies).
3. Rank top definition issues by priority within definitions and draft "What → So what → What to do next" recommendations.
4. Offer next steps (pick 1).

### Price Mechanics Add-ons (on request)

0. Start with the Definition Analysis only if the user asked for it (or asked for a complete financial review).
1. Extract the purchase price formula and map each term to its definition (or "Not found") with citations.
2. Handle cross-reference definitions (`xref`) explicitly: leave unresolved by default, but resolve (or request the referenced excerpt) when needed to explain dollars or close an issue.
3. Trace funds flow: who pays what, when, from what source.
4. Extract escrow terms and compare to benchmarks.
5. Extract true-up timeline and dispute mechanics.
6. Build the routing table for overlap/gap items.
7. Rank top issues and offer next steps.

---

## Guiding Principles

### Pricing Structure Detection

| Structure               | Detection Keywords                                                              | Implication                       |
| ----------------------- | ------------------------------------------------------------------------------- | --------------------------------- |
| **Completion Accounts** | "Closing Cash," "Closing Indebtedness," "Working Capital Adjustment," "True-up" | Full definition analysis required |
| **Locked Box**          | "Locked Box Date," "Leakage," "Permitted Leakage"                               | Focus on leakage, not definitions |
| **Fixed Price**         | "Merger Consideration," "per share," "no adjustment"                            | Limited definition relevance      |
| **Hybrid**              | "Net Capital," "Free Cash Flow," "Specified Debt"                               | Schedule-driven; verify annexes   |

---

### Definition Checklists

Use these to assess each definition against market standard. Also conduct an independent analysis as there is no unified "market standard".

#### Indebtedness

**Typical inclusions:**

- Borrowed money (always)
- Capital/finance leases (always)
- Letters of credit (usually)
- Guarantees (usually)
- Accrued interest (usually)
- Breakage/prepayment premiums (usually)
- Deferred purchase price from prior deals (usually)
- Hedging obligations in liability position (usually)

**Typical exclusions:**

- Operating leases (varies by deal vintage)
- Intercompany debt (usually settled or excluded)
- Trade payables (should be in WC)

**Red flags:**

- "all liabilities with respect to past or present litigation" — Converts contingent claims to certain deductions
- "long-term deferred revenue" — Usually belongs in WC; can double-count
- "whether or not contingent" in deferred purchase price — Can sweep in ordinary accruals

**Market assessment:**

- 🟢 Typical: Borrowed money + leases + breakage + guarantees
- 🟠 Notable: Sweeps employee obligations, litigation reserves, or deferred revenue
- 🔴 Unusual: No anti-duplication and overlaps exist with WC or TxExp

---

#### Cash

**Typical inclusions:**

- Cash on hand (always)
- Cash equivalents (always)
- Deposits in transit (usually)
- Outstanding checks netted (usually)

**Typical exclusions:**

- Restricted cash (usually excluded)
- Cash collateral for LCs (usually excluded)
- Trapped/foreign cash (treatment varies)

**Red flags:**

- "(which amount may be negative)" — Overdraft routing unclear; can double-count with Debt
- No explicit overdraft treatment — Creates dispute risk

**Market assessment:**

- 🟢 Typical: Overdrafts explicitly routed, restricted cash excluded
- 🟠 Notable: "may be negative" without explicit routing
- 🔴 Unusual: Overdrafts could be in both Cash and Debt

---

#### Working Capital

**Typical inclusions:**

- Accounts receivable (always)
- Inventory (always)
- Prepaid expenses (usually)
- Accounts payable (always)
- Accrued liabilities (usually)
- Deferred revenue (usually, but negotiated)

**Should be excluded:**

- Cash (separate adjustment)
- Current portion of debt (in Indebtedness)
- Transaction Expenses accrued (separate adjustment)
- Income tax items (often handled via Tax covenants)
- Intercompany balances (usually settled)

**Red flags:**

- "amounts in Exhibit E are illustrative only" — Non-binding methodology; high reclassification risk
- "include only the line items set forth on Exhibit C" (Exhibit missing) — Can't validate what's "in"
- "Applicable Accounting Principles" referenced but not provided — Unknown rules

**Market assessment:**

- 🟢 Typical: Schedule attached, binding, complete
- 🟠 Notable: Schedule referenced but missing
- 🔴 Unusual: Schedule is "illustrative only" or methodology undefined

---

#### Transaction Expenses

**Typical inclusions:**

- Investment banking/financial advisor fees
- Legal fees
- Accounting/diligence fees
- Transaction bonuses
- Employer payroll taxes on deal-triggered payments

**Watch for overlap:**

- Transaction bonuses may also be in Indebtedness
- Severance may be in Indebtedness or TxExp
- D&O tail and RWI premium treatment varies

**Note:** Many deals don't have a TxExp definition. Seller may pay costs directly.

---

#### Accounting Principles / Hierarchy

**Market standard hierarchy:**

1. SPA definitions + binding schedules (control)
2. Historical practice / past practice (tie-breaker)
3. GAAP/IFRS (residual)

**Red flags:**

- "prepared in accordance with GAAP" alone — Allows method changes post-close
- "as determined by Buyer" / "in Buyer's sole discretion" — Very buyer-aggressive
- "consistent with Buyer's accounting policies" — Not market
- No hierarchy stated — Disputes between GAAP and past practice

**Market assessment:**

- 🟢 Typical: Clear 3-tier hierarchy stated
- 🟠 Notable: Two-tier only or ambiguous priority
- 🔴 Unusual: "GAAP" alone or "Buyer's policies"

---

## Self-Analysis Checklist

### Completeness

- [ ] Were all of the financial definitions in the SPA definitions captured in the analysis?
- [ ] Did I find all definitions used in the price formula?
- [ ] Did I note which schedules/exhibits are missing?
- [ ] For missing items, did I state "Not found"?

### Routing

- [ ] Does every overlap item route to exactly one bucket?
- [ ] Is there explicit anti-duplication language?
- [ ] Are there items that could fall through (gaps)?

### Methodology

- [ ] Is there a clear accounting hierarchy?
- [ ] Are schedules binding or illustrative?
- [ ] Can methodology change post-close?

### Timing

- [ ] Are all components measured at the same time?
- [ ] Do true-up timelines align with escrow release?

```markdown
# Playbook 03: Closing Statement & True-Up Process

## Purpose

Guide a reliable, evidence-based analysis of the SPA’s closing statement and true-up mechanics—covering (i) what statements exist (estimated vs final), (ii) the full timeline (prep → review → dispute → independent accountant → payment), (iii) the accounting principles hierarchy (and whether it is enforceable), and (iv) dispute mechanics (including scope limits and finality). Output must be verifiable, citation-driven, and formatted per `output-contract.md`.

## When to Use

Use this playbook when the SPA includes (or the user asks about):

- Closing statement / post-closing statement / true-up / purchase price adjustment statement
- Estimated vs final closing amounts (Estimated Closing Cash, Estimated NWC, Estimated Net Debt, etc.)
- Seller review, objection notice, dispute notice, working papers, access rights
- Independent accountant / expert determination / final and binding / manifest error
- Accounting principles / applicable accounting principles / consistent with past practice / GAAP / IFRS
- Any “illustrative only” schedules or templates tied to closing accounts methodology (high dispute risk)

---

## Process Overview

Follow the two-pass discipline in `output-contract.md`:

**Pass 1 — Extract (evidence first)**

1. Locate and quote the true-up clause(s) and any defined terms used in the true-up (Estimated / Closing / Final).
2. Identify statement structure (estimated vs final; combined vs separate statements).
3. Build the complete timeline with day counts (including missed-deadline consequences).
4. Extract the accounting principles hierarchy (SPA → schedules → past practice → GAAP/IFRS, or whatever the SPA states).
5. Extract dispute mechanics and the independent accountant (“IA”) terms (scope, standard, costs, finality).

**Pass 2 — Interpret (tests + labels + ranked issues)** 6. Run applicable global tests from `global-tests.md` (at minimum: cut-off consistency, hierarchy stated, no-reclass protection, schedule completeness). 7. Assign market labels (🟢/🟠/🔴) and rank issues by impact and dispute likelihood. 8. Generate the deliverable in the `output-contract.md` structure (plus true-up supporting tables).

---

## Step 1: Locate the True-Up Framework and Statement Structure

### 1A. Detection Keywords

Search the SPA for the clause(s) governing closing accounts and adjustments:

**Core true-up terms**

- “Closing Statement”
- “Post-Closing Statement”
- “Purchase Price Adjustment”
- “true-up”
- “adjustment amount”
- “Net Adjustment Amount”
- “Working Capital Overage / Underage”
- “Closing Net Working Capital” / “Net Working Capital”

**Estimated vs final**

- “Estimated”
- “Preliminary”
- “Estimated Closing Statement”
- “Estimated Net Working Capital” / “Estimated Working Capital”
- “Final Closing Statement” / “Final”

**Disputes / IA**

- “Objection Notice” / “Dispute Notice”
- “Disputed Items”
- “Independent Accountant”
- “expert determination”
- “final and binding”
- “manifest error”
- “working papers”

(Seed terms align with existing true-up triggers in `dist/03-wc-net-debt.md` and pricing-structure detection in `term-map.yml` under `pricing_structures.completion_accounts.detection`.)

### 1B. Extract the Statement Inventory

Identify each statement the SPA requires and how they relate.

**Statement Inventory Table (extract with citations)**
| Statement | What it’s called in SPA | Estimated or Final | Who prepares | When delivered | Inputs / attachments required | Reference |
|---|---|---|---|---|---|---|
| Closing Statement | | | | | | |
| Net Debt Statement | | | | | | |
| Working Capital Statement | | | | | | |
| Cash Statement | | | | | | |
| Transaction Expenses Statement | | | | | | |

**Key extraction checks**

- Is there an **Estimated** statement used to set the **Closing payment**, followed by a **Final** statement post-close?
- Are component statements **combined** into one Closing Statement or **separate** (Net Debt, NWC, Cash, Tx Expenses)?
- Does the SPA require **supporting detail** (trial balance mapping, bank statements, payoff letters, workpapers)?
- Is there a **template / exhibit** for any statement, and is it binding or “illustrative only”?

---

## Step 2: Build the Complete True-Up Timeline (with Missed-Deadline Consequences)

### 2A. Timeline Stages to Capture (minimum set)

Capture every stage that exists in the SPA, with exact day counts and “business days vs calendar days”:

1. **Estimated statement delivery** (if applicable)
2. **Closing payment mechanics** (what is paid at Closing and based on what estimate)
3. **Final statement preparation and delivery**
4. **Seller review period** (including access rights)
5. **Objection/dispute notice deadline** (what the notice must contain)
6. **Good-faith negotiation / resolution period**
7. **Independent accountant referral trigger and submission mechanics**
8. **IA determination timing and finality**
9. **Payment/settlement timing** (wire, escrow, set-off, interest)

### 2B. Timeline Table (required)

**True-Up Timeline Table**
| Stage | Days (exact) | Day type (business/calendar) | Responsible party | What must be delivered / done | What happens if missed | Reference |
|---|---:|---|---|---|---|---|
| Estimated statement delivery | | | | | | |
| Final statement delivered | | | | | | |
| Seller review window | | | | | | |
| Objection/dispute notice | | | | | | |
| Negotiation period | | | | | | |
| Submit to IA | | | | | | |
| IA determination | | | | | | |
| Payment/settlement | | | | | | |

### 2C. Internal Benchmark Anchors (use as context, not as a substitute for extraction)

- In the analyzed deal sample, **median buyer prep time** was **90 days** and **median seller review** was **30 days** (with variation up to 120/60 in outliers). See `reference/consolidated/benchmark-data.md#true-up-timelines`.
- External benchmark anchor for buyer prep: buyer typically prepares the final closing statement **60–90 days** post-close (see `dist/benchmarks.md#purchase-price-adjustments`).

**Important:** Benchmarks do not replace the SPA. Always extract the actual day counts with citations.

---

## Step 3: Extract and Evaluate the Accounting Principles Hierarchy

### 3A. What to Extract

Find the clause(s) governing how the Closing Statement is prepared and how items are classified.

**Hierarchy elements to look for (extract the exact priority order)**

- The SPA terms / definitions
- Templates / schedules / exhibits (e.g., “Applicable Accounting Principles” schedule)
- Past practice / consistency with historical financial statements
- GAAP / IFRS (and whether “as in effect from time to time”)
  (See `dist/global-tests.md#test-3-hierarchy-stated` and `dist/benchmarks.md#definition-standards` under “Accounting Principles — Market Standard Hierarchy”.)

### 3B. Hierarchy Output (required)

**Hierarchy Summary**

- **Extracted hierarchy text (quote):**
  > “…” — [citation]
- **Priority order (as stated):**
  1. …
  2. …
  3. …

### 3C. Schedule-Driven Methodologies (high leverage)

If the SPA points to an “Applicable Accounting Principles” schedule or statement template:

- Verify it is **attached**, **complete**, and **binding** (not “illustrative only”) (see `dist/global-tests.md#test-7-schedule-completeness`).
- Treat “illustrative only” methodology schedules as a **high-severity** reclassification risk. This pattern is flagged as a gap/risk in real deals (see `reference/consolidated/playbook-validation-report.md` and the suggested fix language in `reference/consolidated/suggested-revisions-library.md` under the Working Capital schedule “illustrative only” remediation).

### 3D. No-Reclass / No-Hindsight Protections

Extract language that prevents post-close reclassification or hindsight restatement:

- “consistently applied”
- “without giving effect to changes in accounting policies”
- “no hindsight”
- “using the same accounts and methodology as used in preparing the Financial Statements”
  (See `dist/global-tests.md#test-4-no-reclass-protection`.)

**Red-flag patterns (extract + cite)**

- Buyer discretion: “as determined by Buyer” / “Buyer’s reasonable discretion”
- Floating GAAP: “GAAP as in effect from time to time”
- Restatement hooks: “should have been recorded”
- Non-binding templates: “illustrative only”, “for reference”

---

## Step 4: Extract Dispute Mechanics and Independent Accountant Terms

### 4A. Objection and Negotiation Mechanics

Extract:

- What constitutes a valid Objection/Dispute Notice (detail requirements, itemization, calculations)
- Whether undisputed items are deemed accepted
- Whether parties must negotiate in good faith, for how long, and what happens next

### 4B. Independent Accountant (IA) / Expert Determination (required table)

**IA Terms Table**
| Topic | Extract (quote summary) | Why it matters | Market / risk label | Reference |
|---|---|---|---|---|
| Appointment / selection | | Selection leverage and delay risk | | |
| Scope | Disputed items only vs whole statement | Scope creep drives cost and uncertainty | | |
| Standard of review | Must follow hierarchy? GAAP-only? | Dictates who wins methodology fights | | |
| Submissions / procedure | Limits on submissions? hearings? | Process fairness + cost | | |
| Baseball arbitration | Yes/No | Constrains “middle ground” outcomes | | |
| Timing | IA decision deadline | Delay = cash held back longer | | |
| Finality | “final and binding” / “manifest error” | Litigation risk and certainty | | |
| Fees / cost allocation | split / loser pays / proportional | Incentives and fairness | | |

**Common pattern check (supported by real-deal sample):** IA scope is usually limited to “disputed items only,” with a binding determination (see `reference/consolidated/playbook-validation-report.md`).

### 4C. Missed-Deadline Consequences (must extract explicitly)

Do not assume.

- If Seller misses the dispute notice deadline: is the statement **deemed final**? Are objections **waived**?
- If Buyer misses the delivery deadline for the Closing Statement: does Seller prepare? is Buyer deemed to accept estimated numbers? is there an extension?
- Are late payments subject to interest?

---

## Step 5: Apply Global Tests Relevant to True-Up Mechanics

Run and report (Pass/Fail + details + citations) at minimum:

1. **Cut-off consistency** — `global-tests.md` Test 1  
   _Do Cash/Debt/WC/TxExp use the same measurement time?_
2. **Hierarchy stated** — Test 3  
   _Is there a clear priority order for methodology?_
3. **No-reclass protection** — Test 4  
   _Are accounting policies locked (no hindsight / no reclass)?_
4. **Schedule completeness** — Test 7  
   _Are all referenced schedules/templates attached and binding?_

Optionally (if the true-up uses the purchase price formula or adjustment definitions heavily):

- **Term-formula alignment** — Test 6 (ensure estimated vs closing vs final terms match)
- **Sign convention clarity** — Test 10 (ensure the adjustment is symmetric)

**Global Test Results Table**
| Test | Result | Details | Reference |
|---|---|---|---|
| Cut-off consistency | Pass/Fail | | |
| Hierarchy stated | Pass/Fail | | |
| No-reclass protection | Pass/Fail | | |
| Schedule completeness | Pass/Fail | | |

---

## Self-Analysis Checklist

Answer **Yes / No** and include a **citation** (or “Not found — expected in [location]”) for each.

### Timeline completeness

- [ ] Did I extract **every** timeline stage from statement delivery through payment/settlement (not just the headline deadlines)?
- [ ] Did I capture **specific day counts** for each stage and whether they are **business days vs calendar days**?
- [ ] Did I extract what happens if a deadline is missed (deemed acceptance, waiver, extension, deemed final)?

### Methodology hierarchy

- [ ] Is the accounting principles hierarchy clear and ordered (e.g., SPA → schedules → past practice → GAAP/IFRS), with quoted language?
- [ ] Did I verify whether any referenced schedules/templates are **attached** and whether they are **binding** (not “illustrative only”)?

### Independent accountant scope and authority

- [ ] Is the IA scope explicitly limited to **disputed items only**?
- [ ] Is the IA instructed to apply the SPA’s stated hierarchy (not just GAAP or one party’s policies)?
- [ ] Is the determination “final and binding” subject only to a narrow manifest error standard (if stated)?

### Output integrity

- [ ] Are all interpretive conclusions confidence-labeled (High/Medium/Low) and supported by citations?
- [ ] Did I generate an Issue Register with IDs (T-01, T-02, …) and rank issues by impact + likelihood per `output-contract.md`?

---

## Observation Writing Guide

### The standard: What it is → What’s notable → Why it matters

**❌ Poor**

- “The Closing Statement is prepared by Buyer.”

**✅ Good**

- “Buyer prepares the Closing Statement within **[X] days** after Closing, and Seller has **[Y] days** to object; if Seller fails to object, the statement is deemed final. This creates a control-and-timing advantage for Buyer and increases the risk that methodology disputes surface only after funds have moved. **Confidence: High.**” — [citations to the timeline + deemed acceptance language]

**❌ Poor**

- “Exhibit E is illustrative only.”

**✅ Good**

- “The Working Capital exhibit is expressly ‘illustrative only,’ meaning the party preparing the Closing Statement can change classification/methodology post-close. That defeats the predictability typically provided by templates and increases reclassification dispute risk (no-reclass protection concern). **Confidence: High.**” — [citations to exhibit language + accounting principles clause]

---

## Edit Protocol

**Default:** No edits. Analysis only (see `output-contract.md#section-7-edits-only-if-requested`).

**If edits are requested:**

1. Keep edits minimal and targeted to the identified issue.
2. Format edits as: `~~original~~ **replacement**`
3. Preserve Defined Terms exactly (capitalization, cross-references).
4. Pre-edit validation (cite impacted sections):
   - Term alignment (Estimated vs Closing vs Final)
   - Sign convention symmetry for adjustments
   - Cut-off consistency impacts
   - Hierarchy / schedule incorporation impacts
5. Show edits with surrounding context and explain why they address the dispute risk.

---

## Follow-on Prompts

1. “Extract the complete true-up timeline (all stages, day counts, business vs calendar days, and missed-deadline consequences).”
2. “Quote the accounting principles hierarchy and assess whether it is enforceable (binding schedules vs ‘illustrative only’).”
3. “Analyze the Independent Accountant provisions (selection, scope limits, standard of review, cost allocation, finality).”
4. “Run the relevant global tests (cut-off consistency, hierarchy stated, no-reclass protection, schedule completeness) and summarize Pass/Fail.”
5. “List the top 5 true-up dispute risks and propose negotiation levers (no drafting—analysis only unless edits requested).”
```

```markdown
# Playbook 04: Earnouts

## Purpose

Provide a disciplined, citation-driven analysis of earnout (contingent consideration) provisions—extracting the metric(s), measurement period, calculation mechanics, seller protections, acceleration/forfeiture triggers, set-off rights, and dispute resolution process. Output must follow the reliability standards and deliverable format in `output-contract.md`.

## When to Use

Use this playbook when the SPA includes (or the user asks about):

- “Earnout” / “Earn-Out” / “Contingent Consideration” / “Milestone” / “Additional Consideration”
- Performance-based payments tied to Revenue, EBITDA, ARR, bookings, product milestones, approvals, etc.
- Earnout statement, earnout calculation, audit rights, seller objection/dispute process
- Operating covenants tied to earnout performance (efforts standards; operational restrictions)
- Acceleration, forfeiture, change of control triggers
- Set-off / offset / withhold rights against earnout payments

---

## Process Overview

**Pass 1 — Extract**

1. Confirm an earnout exists; extract the headline economics and how it relates (or doesn’t) to “Purchase Price.”
2. Extract the earnout metric definition(s) and calculation mechanics (including accounting basis).
3. Extract the performance period, reporting cadence, information/audit rights, and timelines.
4. Extract operating covenants and seller protections (or buyer discretion).
5. Extract set-off, acceleration/forfeiture, and dispute resolution mechanics.

**Pass 2 — Interpret** 6. Apply validation tests (schedule completeness, accounting basis clarity, metric calculability, manipulation controls). 7. Use benchmark context where available (earnout dispute frequency, set-off prevalence, typical periods) and assign 🟢/🟠/🔴 labels (with citations to benchmarks). 8. Generate the deliverable per `output-contract.md` with earnout supporting tables.

---

## Step 1: Confirm the Earnout Exists and Extract the Headline Economics

### 1A. Detection Keywords

Search for:

- “Earnout” / “Earn-Out”
- “Contingent Consideration”
- “Milestone Payment”
- “Additional Consideration”
- “Performance Period”
- “Earnout Statement” / “Earnout Calculation”
- “offset” / “set-off” / “withhold”
  (Seed terms align with `dist/04-earnouts.md` triggers.)

### 1B. Extract Headline Terms (required)

**Earnout Headline Table**
| Item | Extracted term | Notes (what to confirm) | Reference |
|---|---|---|---|
| Maximum earnout | | Is it a cap on aggregate payments or per period? | |
| Payment form | cash / stock / note / other | Any withholding/escrow? | |
| Recipients | sellers / milestones beneficiaries | Allocation mechanics among sellers? | |
| Payment timing | | Trigger + deadline + method | |
| Condition precedent | | Any gating conditions beyond metric achievement? | |
| Relationship to “Purchase Price” | included / excluded / unclear | Silent “Purchase Price” definitions can create ambiguity (see earnout-related red flag in `reference/consolidated/red-flag-library.md` and “Total Consideration” fix in `reference/consolidated/suggested-revisions-library.md`). | |

**Reliability rule:** If the SPA is silent on whether earnout is included in “Purchase Price,” do not infer—flag as “Unclear” with citations (see `reference/consolidated/red-flag-library.md` and `reference/consolidated/suggested-revisions-library.md`).

---

## Step 2: Extract the Metric and Calculation Mechanics

### 2A. Identify the Earnout Metric(s)

Common forms (do not assume—extract what the SPA uses):

- Financial: Revenue, EBITDA, “Adjusted EBITDA,” ARR, gross profit, margin, etc.
- Milestones: regulatory approval, product launch, customer contract execution, etc.

**Metric Definition Table**
| Metric | Defined term(s) | Formula / method | Inputs / exclusions / add-backs | Accounting basis | Reference |
|---|---|---|---|---|---|
| | | | | | |

### 2B. Accounting Basis / Methodology Hierarchy (earnout-specific)

Extract the clause stating how the metric is measured:

- GAAP / IFRS / “in accordance with the accounting principles used in preparing the Financial Statements”
- Past practice / consistent application
- Earnout exhibit / schedule-driven principles
- Restrictions on policy changes during the earnout period

Treat “hierarchy clarity” and “no-reclass protection” as key dispute drivers even though earnouts are not completion accounts (borrow methodology risk concepts from `global-tests.md` Test 3 and Test 4).

**Red flags to extract (with citations)**

- Buyer discretion: “as determined by Buyer” / “in Buyer’s reasonable discretion”
- Floating policy: “GAAP as in effect from time to time”
- Unbounded adjustments: broad add-backs, nonrecurring items without definitions
- Missing exhibits/templates referenced in the earnout calculation (schedule completeness risk)

---

## Step 3: Extract the Measurement Period, Reporting, and Information Rights

### 3A. Performance Period and Timing

Extract:

- Start date / end date of the earnout period
- Any interim measurement periods (quarterly, annual)
- Deadline for Buyer (or Company) to deliver an Earnout Statement
- Seller review window and objection deadline
- Payment due date following final determination

**Earnout Timeline Table**
| Stage | Days (exact) | Day type | Responsible party | Deliverable | Missed-deadline consequence | Reference |
|---|---:|---|---|---|---|---|
| Earnout statement delivery | | | | | | |
| Seller review | | | | | | |
| Objection notice | | | | | | |
| Negotiation / cure | | | | | | |
| Expert / IA determination | | | | | | |
| Payment | | | | | | |

### 3B. Information and Audit Rights

Extract:

- Seller access to books/records relevant to earnout
- Audit rights (who pays; scope; frequency; confidentiality)
- Whether Seller can review workpapers, source data, general ledger detail

**Key risk:** Earnouts have high dispute rates (≥28% contested in one cited dataset), so information rights are core protection (see `dist/benchmarks.md#earnouts`).

---

## Step 4: Extract Operating Covenants and Seller Protections

### 4A. Operating Covenants / Efforts Standards

Extract any covenant addressing how Buyer must operate the business during the earnout period:

- “commercially reasonable efforts”
- “good faith”
- “use reasonable best efforts”
- “operate consistent with past practice”
- Any budget/strategy approval rights or restrictions on reorganization

### 4B. Seller Protection Matrix (required)

**Operating Covenant / Manipulation Controls Table**
| Topic | Protection present? (Yes/No/Unclear) | Extract (quote summary) | Why it matters | Reference |
|---|---|---|---|---|
| Restriction on accounting policy changes | | | Prevents metric manipulation | |
| Allocation rules (overhead/intercompany) | | | Prevents cost dumping | |
| Duty to maintain separate books | | | Auditability | |
| Restriction on selling/divesting earnout business | | | Avoids “selling away” the metric | |
| Efforts covenant | | | Enforceability of performance support | |
| Seller consultation/consent rights | | | Governance / control | |

---

## Step 5: Extract Set-Off Rights, Acceleration/Forfeiture, and Dispute Resolution

### 5A. Set-Off / Withholding

Extract whether Buyer can reduce or withhold earnout payments by:

- indemnity claims
- working capital true-up amounts
- other claims (breach, tax, etc.)

Also extract:

- Whether set-off requires a **final determination** (judgment/arbitration/settled claim) or can be asserted based on notice alone
- Any caps on set-off or escrow interface

**Benchmark context (do not overclaim):** One cited survey reports set-off rights appear in 58% of earnout deals (see `dist/benchmarks.md#earnouts`).

### 5B. Acceleration / Forfeiture Triggers

Extract triggers such as:

- Change of control / sale of the business
- Buyer breach of operating covenant
- Seller termination (if earnout tied to continued employment)
- Failure to meet interim milestones
- Force majeure / regulatory constraints (if milestones)

**Acceleration/Forfeiture Table**
| Trigger | Result (accelerate / terminate / pro rata / other) | Discretion? | Reference |
|---|---|---|---|
| | | | |

### 5C. Dispute Resolution for Earnout Calculations

Extract:

- Process (notice → negotiation → expert)
- Who the expert is (independent accountant vs arbitrator)
- Scope (disputed items only vs full recalculation)
- Standard of review (must follow earnout definitions / hierarchy)
- Finality (“final and binding” / manifest error)
- Cost allocation

---

## Self-Analysis Checklist

Answer **Yes / No** and include a **citation** (or “Not found — expected in [location]”) for each.

### Metric clarity and calculability

- [ ] Is each earnout metric clearly defined with a calculable formula and identifiable inputs?
- [ ] Are inclusions/exclusions/add-backs explicitly defined (not left to discretion)?

### Timing and process completeness

- [ ] Did I extract the full earnout timeline (statement delivery → review → objection → expert → payment) with day counts?
- [ ] Did I capture missed-deadline consequences (deemed acceptance/waiver/extension)?

### Seller protections vs manipulation risk

- [ ] Are there operating covenants or accounting-policy locks that reduce manipulation risk?
- [ ] Do sellers have adequate information/audit rights to verify calculations?

### Set-off and acceleration

- [ ] Can Buyer set-off indemnity (or other) claims against the earnout, and under what standard (final determination vs notice)?
- [ ] Are acceleration triggers specified (change of control, breach, termination), and are they objective?

### Output integrity

- [ ] Are all findings evidence-based with citations and confidence labels?
- [ ] Did I produce an Issue Register with IDs (E-01, E-02, …) and rank by impact/likelihood per `output-contract.md`?

---

## Observation Writing Guide

**❌ Poor**

- “The earnout is based on EBITDA and Buyer provides statements.”

**✅ Good**

- “Earnout is based on **[Defined Term] EBITDA** over **[period]**, but the calculation allows **[specific adjustment/discretion]** and sellers have **[limited/no] audit rights** within **[X] days**. Given earnout disputes are common in cited datasets (≥28% contested), this combination increases dispute and non-payment risk. **Confidence: High/Medium/Low.**” — [citations to metric + info rights + timeline; benchmark cite to `dist/benchmarks.md#earnouts` only if you reference the dispute-rate statistic]

---

## Edit Protocol

**Default:** No edits. Analysis only (see `output-contract.md`).

**If edits are requested:**

- Propose minimal, targeted edits to (i) define the metric more tightly, (ii) lock accounting policies/hierarchy, (iii) strengthen information rights, and/or (iv) narrow set-off to finally determined claims.
- Use `~~original~~ **replacement**` and preserve Defined Terms exactly.
- Run pre-edit validation: cross-references, defined terms, interaction with indemnity and payment provisions.

---

## Follow-on Prompts

1. “Extract the earnout metric(s), formula, and accounting basis (quote the defining language and list all inputs/exclusions).”
2. “Build the earnout timeline table (statement delivery, review, objection, dispute resolution, payment), including missed-deadline consequences.”
3. “Assess seller protections against manipulation (operating covenants, accounting policy locks, information/audit rights) and rank the top 5 vulnerabilities.”
4. “Analyze set-off and acceleration: can Buyer offset claims against earnout, and what triggers acceleration/forfeiture?”
5. “Generate an Issue Register (E-IDs) and Top Priorities list focused on earnout dispute risk and economic impact.”
```

```markdown
# Playbook 05: Reps & Warranties

## Purpose

Provide a structured, citation-driven inventory and analysis of representations and warranties—categorizing reps (fundamental vs general vs operational), extracting survival periods and remedies, analyzing qualifiers (materiality, knowledge, MAE), identifying materiality scrape and bring-down standards, assessing sandbagging treatment, and evaluating disclosure schedules. Output must be verifiable and formatted per `output-contract.md`.

## When to Use

Use this playbook when the SPA includes (or the user asks about):

- Representations and warranties (seller or buyer)
- “Fundamental Representations” (or any rep categories)
- Survival periods, indemnification caps/baskets, RWI/escrow references
- Knowledge/materiality/MAE qualifiers and “materiality scrape”
- Bring-down conditions (“true and correct at Closing” / “in all material respects” / MAE)
- Sandbagging / anti-sandbagging / reliance / anti-reliance language
- Disclosure schedules (and whether they qualify reps)

---

## Process Overview

**Pass 1 — Extract**

1. Inventory reps and warranties (by topic), with qualifiers and schedule references.
2. Extract survival periods and link them to remedies (cap, basket, escrow, RWI, special indemnities).
3. Extract qualifier definitions and mechanics (Knowledge, materiality, MAE; materiality scrape).
4. Extract bring-down standards and closing-condition interplay.
5. Extract sandbagging stance and disclosure schedule framework (completeness and incorporation).

**Pass 2 — Interpret** 6. Use benchmarks (survival periods, caps/baskets, escrow sizing) where applicable and assign 🟢/🟠/🔴 labels with citations to `benchmarks.md`. 7. Identify and rank dispute drivers (qualifier-heavy reps, weak bring-down, unclear scrape, schedule gaps). 8. Generate deliverable per `output-contract.md` with reps-specific supporting tables.

---

## Step 1: Build a Rep Inventory (with Qualifiers and Schedule Links)

### 1A. Detection Keywords

Search for:

- “Representations and Warranties”
- “represents and warrants”
- “Fundamental Representations” / “Fundamental Representations means”
- “Disclosure Schedule” / “Schedules”
- “Knowledge” / “to the Knowledge of”
- “material” / “Material Adverse Effect” / “MAE”
- “in all material respects”
- “bring-down” / “true and correct as of the Closing”
- “sandbag” / “knowledge of breach” / “anti-sandbagging”
  (Seed triggers align with `dist/05-reps-warranties.md` and related mention of materiality scrape in `dist/system-prompt.md`.)

### 1B. Rep Inventory Table (required)

Extract each material rep topic and capture qualifiers.

| Rep topic                                       | Section | Who gives it   | Qualifiers (materiality/knowledge/MAE) | Disclosure schedule reference | Notes (what the rep covers/doesn’t) | Reference |
| ----------------------------------------------- | ------- | -------------- | -------------------------------------- | ----------------------------- | ----------------------------------- | --------- |
| Financial Statements                            |         | Seller/Company |                                        |                               |                                     |           |
| Undisclosed Liabilities                         |         |                |                                        |                               |                                     |           |
| Taxes                                           |         |                |                                        |                               |                                     |           |
| Compliance / Litigation                         |         |                |                                        |                               |                                     |           |
| Contracts / Customers                           |         |                |                                        |                               |                                     |           |
| Title / capitalization / authority (if present) |         |                |                                        |                               |                                     |           |

**Categorization rule (no guessing):**

- A rep is “Fundamental” only if the SPA expressly defines it as such (e.g., via a defined term or explicit list). Otherwise classify as “General/Operational” without assuming market categories.

---

## Step 2: Extract Survival Periods and Tie Them to Remedies

### 2A. Survival Inventory (required)

Extract:

- General reps survival
- Fundamental reps survival (if defined)
- Tax reps survival (if specified)
- Fraud carve-out survival (if specified)
- Any special survival for specific reps

**Survival Table**
| Rep category | Survival period | When it starts/ends | Exceptions | Reference |
|---|---|---|---|---|
| General reps | | | | |
| Fundamental reps | | | | |
| Tax reps | | | | |
| Other special | | | | |

### 2B. Remedy Mapping (cap/basket/escrow/RWI)

Extract the indemnification mechanics that apply to breaches of reps:

- Cap (by category if split)
- Basket type (deductible vs tipping) and size
- Escrow / holdback amounts and release timing
- RWI references (if any)
- Special indemnities and exclusions
  (Use market context only with citations to `dist/benchmarks.md` for survival, caps, baskets, escrow sizing.)

**Remedy Mapping Table**
| Item | Applies to which reps? | Extracted term | Why it matters | Reference |
|---|---|---|---|---|
| Cap | | | Recovery ceiling | |
| Basket | | | First-dollar vs excess-only recovery | |
| Escrow | | | Practical collectability | |
| RWI | | | Shifts risk to insurer vs seller | |
| Exclusive remedy | | | Limits claim pathways | |

---

## Step 3: Analyze Qualifiers (Materiality, Knowledge, MAE) and Materiality Scrape

### 3A. Knowledge Qualifiers

Extract:

- Definition of “Knowledge” (who; actual vs constructive; inquiry duty if stated)
- Which reps are knowledge-qualified

**Knowledge Table**
| Where used | Whose knowledge | Defined? | Effect on proof burden | Reference |
|---|---|---|---|---|
| | | | | |

### 3B. Materiality and MAE Qualifiers

Extract:

- “Material Adverse Effect” definition (if present)
- “material” qualifiers inside reps
- Where MAE is used (bring-down/closing condition/termination)

### 3C. Materiality Scrape Mechanics

Extract whether the SPA disregards materiality/MAE/knowledge qualifiers for:

- Determining whether a breach exists
- Calculating “Losses”
- Determining whether the basket is exceeded
- Bring-down at closing (less common but possible)

**Scrape Table**
| Scrape applies to… | Materiality? | MAE? | Knowledge? | Scope limitations | Reference |
|---|---|---|---|---|---|
| Breach determination | | | | | |
| Losses calculation | | | | | |
| Basket calculation | | | | | |

**Reliability rule:** If scrape is silent, state “Not found” and do not infer.

---

## Step 4: Extract Bring-Down Standards and Closing-Condition Interaction

Extract the closing condition(s) that require reps to be true at closing:

- “true and correct in all material respects”
- “true and correct except where failure would not have a Material Adverse Effect”
- Any split standard (fundamental reps must be true in all respects; others in all material respects)

**Bring-Down Table**
| Standard | Applies to which reps | Timing (as of signing/closing) | Certificate required? | Reference |
|---|---|---|---|---|
| | | | | |

---

## Step 5: Sandbagging and Disclosure Schedules

### 5A. Sandbagging / Anti-Sandbagging

Extract whether the SPA addresses claims for known breaches:

- Pro-sandbagging: buyer can recover even if it knew
- Anti-sandbagging: buyer cannot recover for known breaches
- Silent: no clause found (state “Not found”)

Also look for reliance/anti-reliance language that can affect the practical reach of rep claims (anti-reliance is flagged as “high-signal” in `dist/06-commercial-terms.md` and `dist/07-redline.md`).

**Sandbagging Table**
| Treatment | Evidence | Effect | Reference |
|---|---|---|---|
| Pro / Anti / Silent | | | |

### 5B. Disclosure Schedule Analysis (completeness + incorporation)

Extract:

- How schedules qualify reps (“except as set forth on the Disclosure Schedules”)
- Any standards for disclosures (e.g., “in reasonable detail”)
- Whether schedules were required to be delivered at signing or closing
- Any schedule update / supplement mechanism (if present)

**Schedule Completeness Checklist (adapt the concept of `global-tests.md` Test 7)**

- List each schedule referenced in reps and confirm it exists and is attached.
- Flag “TBD” placeholders, blank schedules, or missing attachments as gating issues (similar “missing schedule” risks are emphasized in `reference/consolidated/playbook-validation-report.md` and appear as a red-flag category in `reference/consolidated/red-flag-library.md`).

---

## Self-Analysis Checklist

Answer **Yes / No** and include a **citation** (or “Not found — expected in [location]”) for each.

### Fundamental vs general reps

- [ ] Did I identify which reps are “fundamental” based on an explicit SPA definition/list (not inference)?
- [ ] Did I capture survival periods by rep category (general vs fundamental vs tax/special)?

### Qualifiers and scrapes

- [ ] Did I inventory knowledge/materiality/MAE qualifiers and extract definitions (Knowledge, MAE) where provided?
- [ ] Is there a materiality scrape, and did I specify exactly what it applies to (breach, losses, basket, bring-down)?

### Bring-down standard

- [ ] What is the bring-down standard at closing (in all material respects vs MAE-based vs split), with citations?

### Sandbagging and schedules

- [ ] Is sandbagging addressed (pro/anti/silent) with evidence?
- [ ] Did I verify disclosure schedules referenced by reps are attached/complete (or explicitly flag missing)?

### Output integrity

- [ ] Did I produce Top Priorities (3–7) and an Issue Register (R-IDs) ranked by impact and likelihood per `output-contract.md`?
- [ ] Did I avoid any “market” claims unless supported by `dist/benchmarks.md`?

---

## Observation Writing Guide

**❌ Poor**

- “Reps are heavily qualified by knowledge.”

**✅ Good**

- “Key reps (Financial Statements, Undisclosed Liabilities) are qualified ‘to the Knowledge of’ [specified party], and ‘Knowledge’ is defined as [actual/constructive/inquiry]—raising the buyer’s burden of proof and reducing practical recoverability. This is amplified because [survival/cap/basket] limits recovery to [structure]. **Confidence: High/Medium/Low.**” — [citations to the rep language, Knowledge definition, and indemnity mechanics]

**❌ Poor**

- “Bring-down uses MAE.”

**✅ Good**

- “Closing is conditioned on reps being true except where the failure would not have a Material Adverse Effect, meaning many rep breaches may not allow a walk-away unless they rise to MAE level. This shifts interim-period risk allocation toward closing certainty. **Confidence: High/Medium/Low.**” — [citations to closing condition + MAE definition]

---

## Edit Protocol

**Default:** No edits. Analysis only (see `output-contract.md`).

**If edits are requested:**

- Use `~~original~~ **replacement**`
- Preserve Defined Terms and cross-references
- Pre-edit checks: survival/cap/basket interactions; closing conditions; exclusive remedy; any RWI alignment
- Provide a short rationale for each edit tied to an identified dispute driver (qualifier/scrape/bring-down/schedule completeness)

---

## Follow-on Prompts

1. “Inventory all seller reps by topic (with qualifiers and disclosure schedule links) and identify which are ‘fundamental’ (if defined).”
2. “Extract survival periods and map them to caps/baskets/escrows/RWI (one table with citations).”
3. “Identify every knowledge/materiality/MAE qualifier and whether a materiality scrape applies (and to what).”
4. “Summarize the bring-down standard and how it affects closing certainty between signing and closing.”
5. “Assess disclosure schedules for completeness and ‘exceptions that swallow the rep,’ then generate the top 5 rep-risk issues for diligence focus.”
```

```markdown
# Playbook 06: Commercial Terms Summary

## Purpose

Produce an IC-ready commercial summary of the SPA—capturing deal structure, economics, closeability, key covenants, and risk allocation in a fast, decision-grade format. This playbook is designed to brief partners/IC quickly while still remaining evidence-based and traceable. Output must follow `output-contract.md` and include supporting summary tables.

## When to Use

Use this playbook when the user asks for:

- “IC summary,” “one-page summary,” “key terms,” “deal overview,” or “commercial terms”
- A quick briefing on economics, closeability, termination rights, and risk allocation
- A prioritization of top risks and negotiation levers across the SPA (not just purchase price)

---

## Process Overview

**Pass 1 — Extract**

1. Identify parties, structure, timing (signing/closing), and pricing structure.
2. Extract headline economics (base price, consideration mix, adjustments, escrows/holdbacks, earnouts/notes).
3. Extract closeability (conditions, consents, MAE, outside date, termination rights/fees).
4. Extract risk allocation (reps/survival/cap/basket, RWI, special indemnities, exclusive remedy, set-off).
5. Extract key covenants (interim operations, restrictions, employee/benefits, non-compete where relevant).

**Pass 2 — Interpret** 6. Run high-level validation checks (term alignment, schedule completeness, sign convention clarity) where applicable. 7. Assign market labels using `benchmarks.md` (only where benchmarked) and rank top issues. 8. Generate output per `output-contract.md` plus IC-focused supporting tables.

---

## Step 1: Identify Deal Basics and Pricing Structure Classification

### 1A. Detection Keywords

Use pricing structure detection terms from `term-map.yml` under `pricing_structures.*.detection`, including:

- Completion accounts signals: “Closing Cash,” “Closing Indebtedness,” “Working Capital Adjustment,” “True-up,” “Closing Statement”
- Locked-box signals: “Locked Box,” “Leakage,” “Permitted Leakage”
- Fixed price signals: “Per Share,” “Merger Consideration,” “no adjustment”
  (See `dist/term-map.yml`.)

### 1B. Extract Deal Basics (required)

| Item                                              | Extracted value                                   | Reference |
| ------------------------------------------------- | ------------------------------------------------- | --------- |
| Parties (Buyer / Sellers / Target)                |                                                   |           |
| Transaction structure (share vs asset; perimeter) |                                                   |           |
| Signing date / Closing date (or expected)         |                                                   |           |
| Governing law (optional, for context only)        |                                                   |           |
| Pricing structure classification                  | Completion accounts / locked box / fixed / hybrid |           |

---

## Step 2: Extract Economics (IC headline first, then detail)

### 2A. Economics Headline Checklist

Extract (with citations):

- Base purchase price (and whether enterprise value vs equity value is explicit)
- Consideration mix: cash / stock / seller note / rollover
- Adjustments: Cash, Debt/Indebtedness, Working Capital/NWC, Transaction Expenses, other bespoke adjustments
- Escrows/holdbacks: amount, purpose, release timing
- Earnouts/contingent payments: max amount, metric, timing
  (For definitions and purchase price mechanics, cross-reference `dist/01-definitions.md` and `dist/02-purchase-price.md` as needed, but keep this playbook’s output self-contained.)

### 2B. Key Economics Table (required)

| Term                             | Extracted term/value | Why it matters                    | Market label (if benchmarked)             | Reference |
| -------------------------------- | -------------------- | --------------------------------- | ----------------------------------------- | --------- |
| Base price                       |                      | Sets headline economics           |                                           |           |
| Consideration mix                |                      | Liquidity & credit risk           |                                           |           |
| Adjustments (Cash/Debt/WC/TxExp) |                      | Price sensitivity                 |                                           |           |
| Escrow/holdback                  |                      | Practical recovery                | Use `benchmarks.md#escrows` if comparing  |           |
| Earnout                          |                      | Dispute + valuation risk          | Use `benchmarks.md#earnouts` if comparing |           |
| Seller note                      |                      | Credit risk / functional holdback |                                           |           |

---

## Step 3: Extract Closeability (Conditions, Consents, MAE, Termination)

### 3A. Conditions to Closing

Extract:

- Conditions precedent (regulatory approvals, third-party consents, financing if any)
- Closing deliverables and certificates (bring-down certificates, payoff letters, etc.)
- Any “Marketing Period” or financial-information gating concept (flag as timing leverage if present; see the concept flagged in `reference/consolidated/red-flag-library.md`)

### 3B. Termination Rights and Fees

Extract:

- Outside date / “End Date”
- Termination rights (who can terminate; triggers; cure periods)
- Termination fees / reverse termination fees (if any)
- Effects of termination (expense allocation, return of deposits, confidentiality)

**Closeability Table**
| Topic | Extracted term | Risk note | Reference |
|---|---|---|---|
| Outside date | | | |
| Key conditions | | | |
| Consents/approvals | | | |
| MAE / MAC | | Carve-outs and disproportionality matter | |
| Termination rights | | | |
| Fees | | | |

---

## Step 4: Extract Risk Allocation (Reps/Indemnity/RWI/Exclusive Remedy)

Extract:

- Reps and warranties scope and any “Fundamental Representations” definition
- Survival periods (general/fundamental/tax) and any fraud carve-out
- Caps/baskets and their type (deductible vs tipping)
- Escrow structure and alignment with survival (misalignment is a known red-flag pattern; see `reference/consolidated/red-flag-library.md`)
- RWI presence (if stated) and premium allocation (if stated)
- Special indemnities and exclusions
- Exclusive remedy clauses and dispute resolution forum
- Set-off rights (including against escrow or earnout)

**Benchmark anchors (only if you label “market”):**

- Escrow prevalence and sizing benchmarks: `dist/benchmarks.md#escrows`
- Survival benchmarks: `dist/benchmarks.md#survival-periods`
- Cap/basket benchmarks: `dist/benchmarks.md#indemnification-caps--baskets`

---

## Step 5: Extract Key Covenants (Pre-close conduct and other material covenants)

Extract covenants that materially affect value or closing certainty:

- Interim operating covenants (ordinary course, capex limits, debt incurrence, dividends/distributions)
- Non-compete / non-solicit (if present)
- Employee/benefits obligations and deal-triggered payments
- Access/inspection and cooperation covenants
- Any restrictions tied to closing accounts or earnout performance

**Covenant Summary Table**
| Covenant | Extracted term | Why it matters | Reference |
|---|---|---|---|
| Interim operations | | Prevents value leakage | |
| Debt/cash restrictions | | Protects buyer economics if no price collar | |
| Employee/benefits | | Hidden cash leakage | |
| Other material covenants | | | |

---

## Step 6: Self-Analysis Checklist

Answer **Yes / No** and include a **citation** (or “Not found — expected in [location]”) for each.

### Completeness

- [ ] Did I classify the pricing structure using `term-map.yml` detection terms (and cite where the mechanism appears)?
- [ ] Did I capture all headline economics: base price, consideration mix, adjustments, escrows/holdbacks, earnout/note (if any)?

### Closeability and termination

- [ ] Did I extract key closing conditions, consents/approvals, MAE, outside date, and termination rights/fees?

### Risk allocation

- [ ] Did I extract survival, cap, basket, escrow terms (and any RWI references), and note whether escrow timing aligns with survival?

### Output discipline

- [ ] Are Top Priorities limited to 3–7 items and ranked by impact?
- [ ] Does every non-obvious statement have a citation and a confidence label?

---

## Step 7: Assign Market Labels and Rank IC Priorities

### 7A. Market Labels (only where benchmarked)

When you label something “market” (🟢/🟠/🔴), cite the relevant section of `benchmarks.md`:

- Escrows → `benchmarks.md#escrows`
- Survival → `benchmarks.md#survival-periods`
- Cap/basket → `benchmarks.md#indemnification-caps--baskets`
- Earnouts → `benchmarks.md#earnouts`
- Purchase price adjustments timing context → `benchmarks.md#purchase-price-adjustments`

### 7B. IC Priority Ranking

Rank issues by:

- Economic magnitude (what could swing purchase price / proceeds?)
- Closeability risk (conditions/consents/MAE/outside date)
- Dispute likelihood (ambiguity, missing schedules, discretion, weak timelines)
- Fixability (can it be negotiated cleanly?)

---

## Step 8: Generate Output (IC-ready + `output-contract.md` compliant)

Follow `output-contract.md` structure, but include commercial-summary supporting tables:

1. **Pricing Structure Classification** — one sentence (from Step 1).
2. **Top Priorities** — 3–7 ranked issues.
3. **Issue Register** — IDs `C-01, C-02, …` with impact/likelihood/rating and citations.
4. **Supporting Tables**
   - **1-Page IC Summary** (bullet form; see below)
   - **Key Economics Table** (Step 2B)
   - **Closeability Table** (Step 3B)
   - **Risk Allocation Snapshot** (survival/cap/basket/escrow/RWI)
5. **Global Test Results** — run what’s applicable from `global-tests.md` (e.g., term-formula alignment, sign convention clarity, schedule completeness). If not applicable to the excerpt, mark “N/A—insufficient excerpt.”

### 1-Page IC Summary Template (required)

- **Target / Parties:** [Target]; Buyer: [Buyer]; Sellers: [Sellers].
- **Structure / Timing:** [Share vs asset]; Sign: [date]; Close: [date/expected]; Outside date: [date].
- **Economics:** Base [amount]; Consideration [cash/stock/note/rollover]; Earnout [yes/no; max].
- **Pricing mechanism:** [completion accounts / locked box / fixed / hybrid]; Key adjustments: [cash/debt/WC/TxExp/other].
- **Withholds:** Escrow/holdback [amount/%; purpose; release].
- **Closeability:** Key conditions [list]; Consents [list]; MAE [headline]; Termination rights/fees [headline].
- **Risk allocation:** Survival [summary]; Cap/Basket [summary]; RWI [yes/no]; Special indemnities [summary].
- **Top 3 issues (🔴 first):** 1) … 2) … 3) …

---

## Observation Writing Guide

**❌ Poor**

- “There is an escrow of 10% and survival is 18 months.”

**✅ Good**

- “The SPA establishes an indemnity escrow of **[X]%** of purchase price, released on **[date/condition]**, while general reps survive **[Y] months**. If the escrow terminates before survival ends, claims may survive but lack escrow backing (collectability risk). **Confidence: High.**” — [citations to escrow + survival; use `benchmarks.md` only if you’re explicitly comparing to market]

---

## Edit Protocol

**Default:** No edits. Analysis only.

**If edits are requested:**

- Keep edits minimal and targeted; use `~~original~~ **replacement**`
- Preserve Defined Terms exactly
- Validate cross-references (price, indemnity, conditions, covenants) before proposing language

---

## Follow-on Prompts

1. “Generate a 1-page IC summary (bullet format) with citations for each key term.”
2. “Extract and rank the top 7 commercial risks (economics, closeability, dispute) with an Issue Register (C-IDs).”
3. “Compare escrow/survival/cap/basket terms to benchmarks (cite `benchmarks.md`) and flag anything off-market.”
4. “Quantify sensitivity: show how changes in cash/debt/WC (or other adjustments) affect closing proceeds, based on the SPA formula.”
5. “Create a negotiation priority list (must-have / trade / nice-to-have) tied to the Top Priorities and fixability.”
```

```markdown
# Playbook 07: Redline Comparison

## Purpose

Compare two SPA versions (vA vs vB) and produce a prioritized, decision-grade change summary—separating economic changes from legal risk shifts and housekeeping, identifying “sleeper” changes, and explaining why each material change matters. Output must be evidence-based with citations to both versions and formatted per `output-contract.md`.

## When to Use

Use this playbook when the user provides (or asks about):

- Two versions of an SPA (buyer mark vs seller mark; draft vs revised)
- “Redline,” “compare,” “what changed,” “markup,” “differences”
- A request to prioritize changes by impact (economics, closing certainty, litigation risk)

---

## Process Overview

**Pass 1 — Extract**

1. Confirm there are two versions and label them: vA (earlier) and vB (later).
2. Build a material change log: clause reference, change type, vA text snippet, vB text snippet, citations to both.
3. Categorize changes: economic vs legal risk vs housekeeping; and by topic (price, indemnity, covenants, conditions, etc.).

**Pass 2 — Interpret** 4. Score each material change by impact (economic magnitude, dispute risk, operational control). 5. Assign directionality (Buyer-favorable / Seller-favorable / Neutral) and a rating (🟢/🟠/🔴) with reasons. 6. Produce the deliverable per `output-contract.md` with redline-specific supporting tables.

---

## Step 1: Establish Versioning and Comparison Rules (no assumptions without stating them)

### 1A. Input rule

- If only one version is provided: output **“Not possible — requires vA and vB”** and stop. Do not guess changes.

### 1B. Version labels (required)

- **vA:** earlier version (baseline)
- **vB:** later version (proposed / revised)

If the user does not specify which is earlier, assume the first-provided text is vA and explicitly state the assumption in the output.

### 1C. Noise filtering rules

Ignore (unless substance changes):

- numbering shifts
- formatting-only edits
- defined-term repeats where the definition is unchanged
  Focus on substantive changes to rights/obligations/thresholds/timelines/discretion.

---

## Step 2: Extract All Material Changes (with citations to BOTH versions)

### 2A. High-signal change detectors

Scan for changes involving:

- Purchase price and adjustments (cash/debt/WC/TxExp), escrows/holdbacks
- Indemnification (cap, basket, survival, exclusive remedy)
- Reps/bring-down standards, MAE/MAC
- Interim covenants (ordinary course, debt incurrence)
- Conditions to closing and termination rights/fees
- Dispute mechanics (true-up disputes, IA scope, arbitration/forum)
- High-signal triggers: set-off, anti-reliance, materiality scrape, accounting hierarchy, notice deadlines (flagged as high-signal in `dist/07-redline.md` and referenced in `dist/06-commercial-terms.md`)

### 2B. Detailed Change Log (required)

| Clause | Change type (Add/Delete/Modify) | vA text (short quote) | vB text (short quote) | Topic | Reference (vA) | Reference (vB) |
| ------ | ------------------------------- | --------------------- | --------------------- | ----- | -------------- | -------------- |
|        |                                 |                       |                       |       |                |                |

**Citation format extension:** Keep `output-contract.md` citation format, but label versions clearly:

- `[vA §X.Y, p.Z]: "..."` and `[vB §X.Y, p.Z]: "..."`

### 2C. Sleeper change capture (required)

Flag small edits that change meaning materially:

- “shall” → “may”
- “reasonable efforts” → “commercially reasonable efforts” / “best efforts”
- “material” / “in all material respects” added or removed
- deadlines shortened/lengthened
- discretion qualifiers inserted (“in Buyer’s sole discretion”)

---

## Step 3: Categorize Each Change (Economic vs Legal vs Housekeeping)

### 3A. Change categories (required)

- **Economic:** changes price, adjustment scope, escrow amounts, earnout, payment timing, set-off.
- **Legal risk allocation:** changes reps/survival/cap/basket, fraud carve-outs, exclusive remedy, forum/arbitration, notice requirements.
- **Closeability/control:** changes covenants, conditions, MAE, termination, consents, financing.
- **Housekeeping:** clarifications, typo fixes, conforming edits with no practical effect.

### 3B. Categorization table (optional if embedded in change log)

| Change | Category | Why it’s in that category | Reference |
| ------ | -------- | ------------------------- | --------- |
|        |          |                           |           |

---

## Step 4: Interpret and Prioritize Changes (what changed and why it matters)

### 4A. Scoring framework (required)

For each material change, assign:

- **Impact:** High / Medium / Low (economic magnitude or closing leverage)
- **Likelihood:** High / Medium / Low (dispute likelihood or practical occurrence)
- **Directionality:** Buyer / Seller / Neutral
- **Rating:** 🔴 / 🟠 / 🟢 (overall)

### 4B. Executive Issue List (Top 5–10) (required)

|   # | Issue | What changed (vA → vB) | Direction | Impact | Likelihood | Rating | References |
| --: | ----- | ---------------------- | --------- | ------ | ---------- | ------ | ---------- |
|   1 |       |                        |           |        |            |        | vA…, vB…   |

### 4C. Market anchors (only if benchmarked)

If a change touches escrow, survival, cap/basket, earnout prevalence/timing, you may compare to `benchmarks.md`:

- Escrows → `benchmarks.md#escrows`
- Survival → `benchmarks.md#survival-periods`
- Caps/baskets → `benchmarks.md#indemnification-caps--baskets`
- Earnouts → `benchmarks.md#earnouts`
  Do not make market claims without citing `benchmarks.md`.

---

## Step 5: Generate Output (`output-contract.md` + redline supporting tables)

### 5A. Output structure (required)

1. **Pricing Structure Classification** — one sentence (if determinable from versions; otherwise “Not found — requires purchase price section”).
2. **Top Priorities** — 3–7 top redline issues (from Executive Issue List).
3. **Issue Register** — IDs `RL-01, RL-02, …` with impact/likelihood/rating and vA/vB citations.
4. **Supporting Tables**
   - Executive Issue List (Top 5–10)
   - Themed Summary (bullets)
   - Detailed Change Log (material changes only)
   - Sleeper Alert table (if any)
5. **Global Test Results** — mark “N/A” unless the redline changes directly affect a test (e.g., term-formula alignment, sign convention clarity, schedule completeness).

### 5B. Themed Summary (required)

- Purchase price / escrows: …
- Definitions / true-up: …
- Earnout / contingent: …
- Reps / indemnity / survival: …
- Covenants / conditions / termination: …

---

## Self-Analysis Checklist

Answer **Yes / No** and include **citations** to both versions where applicable.

- [ ] Did I clearly label vA and vB and state any assumptions about version order?
- [ ] Does every material change include **both** vA and vB citations?
- [ ] Did I filter out formatting/noise and focus on substantive deltas?
- [ ] Did I categorize changes (economic vs legal vs housekeeping) and identify sleeper changes?
- [ ] Are Top Priorities limited to 3–7 and ranked by impact, not just listed?
- [ ] Did I avoid market statements unless benchmark-cited to `benchmarks.md`?

---

## Observation Writing Guide

**❌ Poor**

- “Buyer changed the covenant language.”

**✅ Good**

- “vB changes the interim operating covenant from ‘shall not’ to ‘may’ for [restricted action], converting a hard prohibition into discretion. This reduces Seller constraint and increases buyer’s interim risk (and may weaken covenant-based protection where there is no price adjustment). **Confidence: High.**” — [vA citation + vB citation]

---

## Edit Protocol

**Default:** No edits. Analysis only.

**If the user requests drafting help:**

- Provide minimal, targeted suggested edits and show them as `~~vB~~ **replacement**` (do not rewrite the whole agreement).
- Validate downstream interactions (definitions, purchase price formula, indemnity mechanics) before proposing language.

---

## Follow-on Prompts

1. “Create a Top 7 prioritized redline issues list (with vA/vB citations) and negotiation significance for each.”
2. “Identify sleeper changes (small words with big effect) related to discretion, qualifiers, and deadlines.”
3. “Quantify the economic impact of any changed numbers (escrow %, cap, basket, price adjustments, earnout).”
4. “Map each material change to the workstream owner (legal, FDD, tax, HR) and the diligence needed.”
5. “Convert the Executive Issue List into a negotiation plan (must-have / trade / nice-to-have) with fallback positions.”
```

```markdown
# Playbook 08: Negotiation Roleplay

## Purpose

Turn extracted SPA terms into a structured negotiation strategy and roleplay script: define what each side wants, generate counter-arguments, propose fallbacks, identify trades (“give X, get Y”), and anchor positions to benchmark data where available. Output must remain evidence-based: quote the clause(s) being negotiated and avoid uncited “market” assertions.

## When to Use

Use this playbook when the user asks for:

- “Roleplay,” “negotiate,” “counterarguments,” “talking points,” “fallback,” “trade-offs”
- Buyer vs seller positioning on a clause (escrow, cap/basket, survival, earnout, covenants, true-up, set-off, etc.)
- A negotiation plan supported by market benchmarks

---

## Process Overview

**Pass 1 — Extract**

1. Identify the clause(s) to negotiate and quote them with citations.
2. Extract linked terms that govern economic impact (definitions, caps, timelines, set-off, dispute process).
3. Identify leverage points: deadlines, discretion, ambiguous terms, missing schedules, enforcement gaps.

**Pass 2 — Interpret** 4. Build a negotiation position: opening ask → rationale → anticipated pushback → rebuttal → fallback → trade packages. 5. Anchor with benchmark data **only** when supported by `benchmarks.md`. 6. Output per `output-contract.md` plus negotiation tables and scripts.

---

## Step 1: Set the Negotiation Context (state assumptions; do not interrogate)

### 1A. Seat assumption rule

- If the user clearly says “Buyer” or “Seller,” use that.
- If unclear, **assume Buyer-side advisor** and state the assumption in the output.

### 1B. Term selection rule

- If the user provides multiple clauses, select the **top 1–3** based on economic impact and dispute risk and state the selection rationale.
- If only one clause is provided, focus on that clause and its immediate cross-references.

---

## Step 2: Extract the Clause(s) and Connected Mechanics (no strategy without evidence)

### 2A. Required extraction

For each term you’re negotiating, extract:

- The exact clause text (quote)
- Definitions used by the clause (quote if relevant)
- Any linked mechanics: payment timing, set-off, dispute resolution, survival/cap/basket, covenants, schedules

**Clause Extraction Table**
| Term | Clause excerpt (short quote) | Cross-references to extract | Reference |
|---|---|---|---|
| | | | |

---

## Step 3: Build Positions (Ask → Rationale → Fallback → Trade)

### 3A. Position Table (required)

| Term | Your ask (target) | Rationale (economic + risk lens) | Fallback (acceptable) | Trade (give/get) | References |
| ---- | ----------------- | -------------------------------- | --------------------- | ---------------- | ---------- |
|      |                   |                                  |                       |                  |            |

**Rationale discipline:** Always tie rationale back to:

- economics (price, proceeds, timing of cash)
- dispute likelihood (ambiguity, discretion, missing schedules)
- enforceability (objective tests vs subjective standards)

### 3B. Counterparty Model (required)

| Term | Likely counterparty pushback | Your rebuttal | If they insist (trade options) | References |
| ---- | ---------------------------- | ------------- | ------------------------------ | ---------- |
|      |                              |               |                                |            |

---

## Step 4: Prepare the Roleplay Script (opening → pushback → rebuttal → close)

**Script Template (fill with deal facts and clause citations)**

- **Opening ask:** “Given [deal context], we need [ask] to align risk with value. The current draft [quotes key risk language].”
- **Expected pushback:** “We can’t agree because [their reason].”
- **Rebuttal:** “I hear you. The issue is [why it matters]. We can accommodate [concession] if we get [trade].”
- **Close/package:** “Net, we can land at [fallback] with [trade], which reduces dispute risk and makes the economics clear.”

---

## Step 5: Anchor to Market Data (only with citations to `benchmarks.md`)

Use `benchmarks.md` selectively as negotiation anchors for terms it actually benchmarks:

- **Escrow sizing and prevalence:** `benchmarks.md#escrows`
- **Survival periods:** `benchmarks.md#survival-periods`
- **Caps/baskets:** `benchmarks.md#indemnification-caps--baskets`
- **Earnouts (prevalence, dispute rates, set-off prevalence):** `benchmarks.md#earnouts`
- **True-up timing anchor (buyer prep):** `benchmarks.md#purchase-price-adjustments`

**Rule:** If a topic is not benchmarked in `benchmarks.md`, do not call it “market.” Instead describe it as “drafting risk,” “buyer-favorable,” etc., based on the clause text and dispute mechanics.

---

## Step 6: Common Argument Bank and Trade Packages (self-contained toolset)

### 6A. Standard Arguments Reference (adapted from `dist/08-roleplay.md`)

Use as starting points; tailor to the extracted clause language.

- **Working Capital peg:** Buyer—peg protects Day‑1 liquidity; Seller—peg should reflect seasonality & historical run‑rate.
- **Indebtedness scope:** Buyer—include debt-like items; Seller—exclude operating accruals and ordinary-course payables.
- **Cash treatment:** Buyer—exclude restricted/trapped cash; Seller—credit cash equivalents and minimize exclusions.
- **Transaction Expenses:** Buyer—seller bears deal costs at close; Seller—exclude buyer costs and ordinary-course items.
- **Escrow amount/duration:** Buyer—secure recovery; Seller—reduce and stage releases; align with RWI if used.
- **Survival/cap/basket:** Buyer—longer survival for key reps; Seller—shorter survival; deductible basket; no scrape.
- **Earnout metric/control:** Buyer—operational flexibility; Seller—objective metric + protections against manipulation.
- **Set-off:** Buyer—offset against earnout/escrow; Seller—limit to finally determined claims.
- **Dispute resolution:** Buyer—expert for accounting, tight timelines; Seller—neutral forum, full information rights.
- **Materiality scrape:** Buyer—scrape for indemnity; Seller—no scrape or limited scope.
- **MAE:** Buyer—narrow carve-outs; Seller—broad carve-outs + disproportionate effect protection.

### 6B. Common Trade-Off Packages (adapted from `dist/08-roleplay.md`)

1. Lower escrow ↔ longer survival.
2. Higher cap ↔ higher basket.
3. Tipping basket ↔ lower cap.
4. Stronger earnout covenants ↔ tighter metric.
5. No set-off ↔ slightly higher escrow.
6. Faster escrow release ↔ higher initial escrow.
7. Materiality scrape ↔ lower cap.
8. Broader fraud carve-out ↔ shorter general survival.
9. Locked-box certainty ↔ stronger leakage protection.
10. More closing conditions ↔ reverse termination fee/break fee (if applicable).

---

## Step 7: Generate Output (`output-contract.md` + negotiation deliverables)

### 7A. Output structure (required)

1. **Pricing Structure Classification** — one sentence (if determinable; otherwise “Not found from excerpt”).
2. **Top Priorities** — 3–7 negotiation priorities ranked by economic impact and dispute risk.
3. **Issue Register** — IDs `N-01, N-02, …` with impact/likelihood/rating and citations to clause text.
4. **Supporting Tables**
   - Position Table (asks/fallbacks/trades)
   - Counterparty Pushback Table
   - Roleplay script (opening/pushback/rebuttal/close)
   - Benchmark anchors used (with `benchmarks.md` citations)
5. **Global Test Results** — typically “N/A” unless negotiating completion accounts definitions (then run relevant tests per `global-tests.md`).

---

## Self-Analysis Checklist

Answer **Yes / No** and include citations where applicable.

- [ ] Did I state my assumptions (seat; which terms are in scope) clearly?
- [ ] Did I quote the actual clause(s) being negotiated and the key cross-references?
- [ ] Does each “ask” have (i) rationale, (ii) fallback, and (iii) at least one trade package?
- [ ] Did I avoid uncited market claims and cite `benchmarks.md` for any benchmark-based anchors?
- [ ] Did I rank priorities by impact and dispute risk (not just list points)?

---

## Observation Writing Guide

**❌ Poor**

- “We should ask for a higher escrow because market.”

**✅ Good**

- “The draft caps indemnity at [X] and escrows [Y] for [Z months]. Because escrow is the primary collectability mechanism, we need [ask] to match the survival window and avoid a gap where claims survive but escrow expires. If the counterparty wants a smaller escrow, we can trade for [shorter survival / higher basket / staged releases]. **Confidence: High.**” — [citations to cap/escrow/survival; benchmark cite only if you are explicitly comparing to `benchmarks.md`]

---

## Edit Protocol

**Default:** No edits. Strategy and analysis only.

**If the user requests drafting language:**

- Provide minimal redline-ready edits using `~~original~~ **replacement**`
- Preserve Defined Terms and cross-references
- Validate downstream interactions (price formula, indemnity sections, dispute mechanics) before proposing text

---

## Follow-on Prompts

1. “Roleplay this clause live: you be Seller, and I’ll be Buyer (or vice versa), using the exact SPA language as the script base.”
2. “Build a negotiation plan for the top 3 issues: opening ask, rebuttal, fallback, and trade package for each.”
3. “Anchor the key asks to `benchmarks.md` where applicable (escrow, survival, cap/basket, earnout set-off prevalence) and cite sources.”
4. “Generate a one-page negotiation brief: priorities, red lines, concessions, and who needs to approve each trade.”
5. “If edits are requested: draft minimal redline language for the single highest-risk clause (with pre-edit validation notes).”
```

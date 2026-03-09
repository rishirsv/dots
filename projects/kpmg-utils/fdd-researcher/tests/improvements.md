# FDD Researcher — Test Evaluation & Improvement Log

**Evaluation Date:** January 14, 2026
**Evaluator:** Claude Opus 4.5
**Test Outputs Analyzed:** 6 briefs

---

## Executive Summary

Six test briefs were evaluated against the system prompt (`fdd-researcher.md`), report structure guidance (`report-structure.md`), test strategy (`TEST_STRATEGY.md`), and evaluation rubric (`evaluation-rubric.md`). Overall, the outputs demonstrate strong industry depth and actionable diligence playbooks, but exhibit recurring structural and format deviations that reduce consistency and associate usability.

**Key Strengths:**
- Industry Context sections consistently exceed 1,200 words with genuine depth
- Value driver trees are present and well-structured
- Data requests are appropriately prioritized and specific
- Business model mechanics are explained clearly for generalists

**Key Failure Patterns (Recurring):**
1. Financial Summary missing EBITDA adjustments when target-specific adjustments unavailable
2. Inconsistent section naming vs. standard structure
3. Value driver tree format inconsistency (prose vs. ASCII diagram)

---

## Test Output Evaluations

### Test 1: Brown & Brown — Insurance Brokerage Distribution

**Word Count by Section:**
| Section | Actual | Standard | Delta |
|---------|--------|----------|-------|
| Company Overview | ~320 | 250-350 | OK |
| Industry Context | ~1,650 | 1,200-1,500 | +150 (over) |
| Financial Summary | ~280 | 400-500 | -120 (under) |
| Key Findings | ~380 | 200-300 | +80 (over) |
| Diligence Playbook | ~920 | 600-800 | +120 (over) |
| Data Requests | ~160 | 150-200 | OK |
| Sources | ~90 | 100 | OK |
| **TOTAL** | ~4,192 | 3,000-4,000 | +192 (over) |

**What It Looks Like:**
- Strong insurance brokerage context with accurate organic growth decomposition
- Good use of public comp data (Brown & Brown disclosures, MarshBerry benchmarks)
- Value driver tree tailored to brokerage economics

**Evidence of Issues:**
- **TRACE-BB-1:** Financial Summary uses a 5-period table (FY2022-9M2025) which is good, but lacks common industry EBITDA adjustments as fallback

**Prompt Drivers:**
- `report-structure.md` lines 139-182: Financial Summary spec should include EBITDA adjustments fallback

**Causal Mechanism:**
When target-specific EBITDA adjustments aren't available from VDD/CIM materials, the output should fall back to common industry adjustments from the relevant module. Currently this fallback isn't triggered.

**Minimal Prompt Patches:**
```markdown
## EBITDA Adjustments Fallback (add to report-structure.md Financial Summary section)

If target-specific EBITDA adjustments are not available from VDD/CIM materials, include common adjustments for this industry from the relevant industry module.
```

**How to Validate:**
- Re-run Brown & Brown test
- Verify EBITDA adjustments section present (either target-specific or industry common)

---

### Test 2: ServiceTitan — Field Service SaaS

**Word Count by Section:**
| Section | Actual | Standard | Delta |
|---------|--------|----------|-------|
| Company Overview | ~260 | 250-350 | OK |
| Industry Context | ~1,420 | 1,200-1,500 | OK |
| Accounting Policies | ~220 | Adaptive | OK |
| Financial Summary | ~340 | 400-500 | -60 (under) |
| Key Findings | ~280 | 200-300 | OK |
| Diligence Playbook | ~680 | 600-800 | OK |
| Data Requests | ~170 | 150-200 | OK |
| Sources | ~60 | 100 | -40 (under) |
| **TOTAL** | ~3,894 | 3,000-4,000 | OK |

**What It Looks Like:**
- Excellent SaaS mechanics explanation (subscription + usage + services mix)
- Good benchmark integration (NRR/GRR ranges, CAC payback frameworks)
- Accounting Policies section appropriately included for SaaS

**Evidence of Issues:**
- **TRACE-ST-1:** Financial Summary uses ServiceTitan public filings but doesn't include common industry adjustments as fallback

**Prompt Drivers:**
- `report-structure.md` lines 169-175: Financial Summary should include EBITDA adjustments fallback
- `saas.md:151-164`: SaaS EBITDA adjustments table available for fallback

**Causal Mechanism:**
The SaaS module contains a detailed "Common EBITDA Adjustments" table that should be used when target-specific adjustments aren't available. The prompt doesn't clearly specify this fallback behavior.

**Minimal Prompt Patches:**
```markdown
## EBITDA Adjustments Fallback (add to report-structure.md Financial Summary section)

If target-specific EBITDA adjustments are not available from VDD/CIM materials, include common adjustments for this industry from the relevant industry module.
```

**How to Validate:**
- Re-run ServiceTitan test
- Check that Common EBITDA Adjustments appears when target-specific adjustments unavailable

---

### Test 3: 360 Behavioral Health — Healthcare Services

**Word Count by Section:**
| Section | Actual | Standard | Delta |
|---------|--------|----------|-------|
| Company Overview | ~290 | 250-350 | OK |
| Industry Context | ~1,380 | 1,200-1,500 | OK |
| Financial Summary | ~180 (template) | 400-500 | -220 (under) |
| Key Findings | ~340 | 200-300 | +40 (over) |
| Diligence Playbook | ~520 | 600-800 | -80 (under) |
| Data Requests | ~190 | 150-200 | OK |
| Sources | ~70 | 100 | -30 (under) |
| **TOTAL** | ~3,892 | 3,000-4,000 | OK |

**What It Looks Like:**
- Strong behavioral health context (ABA economics, CA regulatory landscape)
- Good adaptation: recognized this is clinician-capacity model, not facility/bed model
- Appropriately flagged 2025-2026 regulatory changes (AB 951, Part 2 compliance)

**Evidence of Issues:**
- **TRACE-BH-1:** No value driver tree diagram in Diligence Playbook (only prose bullet structure)
- **TRACE-BH-2:** Healthcare module signals (wRVUs, NPSR, payor mix) not fully deployed — using generic behavioral health lens instead

**Prompt Drivers:**
- `report-structure.md` lines 255-260: "Include the relevant value driver tree from the industry module as a text diagram"
- `healthcare-services.md`: Contains specific value driver tree for healthcare

**Coded Lines & Location:**
```
report-structure.md:255-260 (value driver tree as text diagram required)
industry-index.md:15 (healthcare-services.md signals)
```

**Causal Mechanism:**
The prompt says to include the value driver tree "from the industry module as a text diagram." The output includes a prose structure but not the ASCII-style tree diagram format shown in examples. The model adapted the tree to ABA-specific economics (good) but lost the visual format (bad).

**Minimal Prompt Patches:**

```markdown
## Value Driver Framework Format (add to report-structure.md line 260)

The value driver tree MUST use text-diagram format in a code block:

```
EBITDA
├── Revenue
│   ├── Driver 1
│   ├── Driver 2
│   └── Driver 3
├── COGS
│   └── ...
└── OpEx
    └── ...
```

Keep the diagram clean and structural. Risk commentary and diligence focus areas belong in the P&L walkthrough or workstreams sections, not in the tree itself.
```

**How to Validate:**
- Re-run 360 Behavioral Health test
- Check that Diligence Playbook contains ASCII tree diagram format in a code block

---

### Test 4: Cintas — Uniform Rental & Facility Services

**Word Count by Section:**
| Section | Actual | Standard | Delta |
|---------|--------|----------|-------|
| Company Overview | ~280 | 250-350 | OK |
| Industry Context | ~1,540 | 1,200-1,500 | +40 (over) |
| Financial Summary | ~320 | 400-500 | -80 (under) |
| Key Findings | ~290 | 200-300 | OK |
| Diligence Playbook | ~880 | 600-800 | +80 (over) |
| Data Requests | ~150 | 150-200 | OK |
| Sources | ~50 | 100 | -50 (under) |
| **TOTAL** | ~3,706 | 3,000-4,000 | OK |

**What It Looks Like:**
- Excellent route-based services economics (density, stops/route, revenue/stop)
- Strong use of Vestis public comp as secondary reference
- Good adaptation: created "Business Services" style analysis for non-standard industry

**Evidence of Issues:**
- **TRACE-CI-1:** Industry module mismatch: Used business-services.md signals but created ad-hoc "route-based" framework — good content but not aligned to standard module

**Prompt Drivers:**
- `industry-index.md` line 14: business-services.md signals don't include "route," "stops," "uniform," etc.
- `fdd-researcher.md` lines 124-125: "If no module fits: Use closest module. Add general KPIs"

**Coded Lines & Location:**
```
industry-index.md:14 (business-services signals)
fdd-researcher.md:124-125 (no-module-fits fallback)
```

**Causal Mechanism:**
The industry-index.md doesn't include signals for route-based facility services. The model correctly identified no exact module match and adapted, but the adaptation creates inconsistency. Need to add route-based services signals or create a new module.

**Minimal Prompt Patches:**

```markdown
## Industry Signal Table (add row to industry-index.md)

| Signals in Documents | Module File |
|---------------------|-------------|
| route, stops, uniform, rental, laundry, facility services, mats, mops, towels, in-service inventory, stop economics, route density | `business-services.md` (adapt for route-based) |
```

**How to Validate:**
- Re-run Cintas test
- Check that business-services.md is explicitly loaded
- Verify adaptation language in output

---

### Test 5: First National Mortgage — Banking & Lending

**Word Count by Section:**
| Section | Actual | Standard | Delta |
|---------|--------|----------|-------|
| Company Overview | ~320 | 250-350 | OK |
| Industry Context | ~1,480 | 1,200-1,500 | OK |
| Financial Summary | ~340 | 400-500 | -60 (under) |
| Accounting Policies | ~140 | Adaptive | OK |
| Key Findings | ~380 | 200-300 | +80 (over) |
| Diligence Playbook | ~720 | 600-800 | OK |
| Data Requests | ~180 | 150-200 | OK |
| Sources | ~60 | 100 | -40 (under) |
| **TOTAL** | ~4,107 | 3,000-4,000 | +107 (over) |

**What It Looks Like:**
- Excellent Canada-specific mortgage context (NHA MBS, CMB, OSFI MQR, Medi-Cal irrelevant — correctly focused on Canadian regulations)
- Good use of First National public disclosures (MUA, Pre-FMV income)
- Appropriately included Accounting Policies for mortgage-specific IFRS topics

**Evidence of Issues:**
- **TRACE-FN-1:** Financial Summary shows 3-period table (FY2023, FY2024, 9M2025) — good, but lacks common industry adjustments as fallback

**Prompt Drivers:**
- `banking-lending.md`: Contains Common EBITDA Adjustments table for lending

**Causal Mechanism:**
When target-specific EBITDA adjustments aren't available, the banking-lending module's common adjustments should be used as fallback.

**Minimal Prompt Patches:**
```markdown
## EBITDA Adjustments Fallback (add to report-structure.md Financial Summary section)

If target-specific EBITDA adjustments are not available from VDD/CIM materials, include common adjustments for this industry from the relevant industry module.
```

**How to Validate:**
- Re-run First National test
- Verify EBITDA adjustments section present (either target-specific or industry common)

---

### Test 6: NVIDIA — Semiconductors

**Word Count by Section:**
| Section | Actual | Standard | Delta |
|---------|--------|----------|-------|
| Company Overview | ~260 | 250-350 | OK |
| Industry Context | ~1,180 | 1,200-1,500 | -20 (under) |
| Financial Summary | ~320 | 400-500 | -80 (under) |
| Key Findings | ~380 | 200-300 | +80 (over) |
| Diligence Playbook | ~720 | 600-800 | OK |
| Data Requests | ~150 | 150-200 | OK |
| Sources | ~70 | 100 | -30 (under) |
| **TOTAL** | ~3,330 | 3,000-4,000 | OK |

**What It Looks Like:**
- Good semiconductor/AI compute context (CoWoS, HBM, supply chain constraints)
- Strong use of NVIDIA SEC filings and Gartner industry data
- Appropriate focus on customer concentration and working capital dynamics

**Evidence of Issues:**
- **TRACE-NV-1:** Industry Context slightly under 1,200 words (borderline)
- **TRACE-NV-2:** No industry module match — industrial-manufacturing.md is closest but doesn't cover fabless semis well

**Prompt Drivers:**
- `industry-index.md`: No semiconductor/chip/fabless signals
- `report-structure.md` lines 51-52: "1200-1500 words" for Industry Context

**Coded Lines & Location:**
```
report-structure.md:51-52 (Industry Context word requirement)
industry-index.md (missing semiconductor signals)
```

**Causal Mechanism:**
NVIDIA falls outside the 10 defined industry modules. The model adapted well but the Industrial Manufacturing module isn't optimal for fabless semiconductors. Industry Context is slightly shallow because module guidance isn't available.

**Minimal Prompt Patches:**

```markdown
## Industry Signal Table (add row to industry-index.md)

| Signals in Documents | Module File |
|---------------------|-------------|
| semiconductor, fabless, wafer, foundry, packaging, GPU, accelerator, HBM, CoWoS, chip, silicon, ASP, units shipped | `industrial-manufacturing.md` (adapt for semiconductors) |
```

**How to Validate:**
- Re-run NVIDIA test
- Verify Industry Context exceeds 1,200 words
- Check for explicit module loading mention

---

## Overall Usefulness Assessment (For Associates)

**Rating Scale:** 1 (Not Useful) — 5 (Highly Useful)

| Test Case | Industry | Rating | Comments |
|-----------|----------|--------|----------|
| Brown & Brown | Insurance | 4.5/5 | Excellent brokerage economics, actionable playbook, good benchmarks |
| ServiceTitan | SaaS | 4.5/5 | Strong SaaS mechanics, good NRR/GRR guidance, applicable to private deals |
| 360 Behavioral Health | Healthcare | 4.0/5 | Good ABA-specific adaptation, regulatory awareness, but less benchmark depth |
| Cintas | Business Services | 4.5/5 | Excellent route-based economics, unique and applicable framework |
| First National | Banking/Lending | 4.5/5 | Strong Canada mortgage context, Pre-FMV explanation valuable |
| NVIDIA | Semiconductors | 4.0/5 | Good AI compute supply chain context, but less FDD-specific guidance |

**Overall Assessment:**
These briefs would be highly useful for associates preparing for FDD engagements. The Industry Context sections consistently explain "how the business makes money" in accessible terms. The Diligence Playbooks provide actionable workstreams.

---

## Consolidated Failure Patterns

### Pattern 1: Financial Summary Missing EBITDA Adjustments Fallback

**Prevalence:** 4/6 tests (67%)

**Evidence:**
- TRACE-BB-1, TRACE-ST-1, TRACE-FN-1: Financial Summary lacks common industry adjustments when target-specific adjustments unavailable

**Prompt Driver:**
`report-structure.md` Financial Summary section doesn't clearly specify fallback behavior for EBITDA adjustments

**Causal Mechanism:**
When target-specific EBITDA adjustments aren't available from VDD/CIM materials, the output should fall back to common industry adjustments from the relevant module. Currently this fallback isn't clearly specified.

**Minimal Patch:**
Add to `report-structure.md` Financial Summary section:
```markdown
**EBITDA Adjustments:**
- If target-specific adjustments are available from VDD/CIM materials, include those
- If target-specific adjustments are NOT available, include common adjustments for this industry from the relevant industry module
```

**Validation:**
- Re-run any test
- Verify EBITDA adjustments section present (either target-specific or industry common)

---

### Pattern 2: Value Driver Tree Format Inconsistency

**Prevalence:** 2/6 tests (33%)

**Evidence:**
- TRACE-BH-4: 360 Behavioral Health uses prose bullets instead of ASCII tree
- Some tests have tree, others don't

**Prompt Driver:**
`report-structure.md` lines 255-306 show ASCII tree example but don't mandate format

**Causal Mechanism:**
The example shows the tree format, but the instruction says "Include the relevant value driver tree" without specifying that the ASCII format is required.

**Minimal Patch:**
Add to `report-structure.md` line 256:
```markdown
**MANDATORY FORMAT:** Use ASCII text diagram format in a code block as shown:
```
EBITDA
├── Revenue
│   ├── Sub-driver 1
│   └── Sub-driver 2
├── COGS
│   └── ...
└── OpEx
```
This format is REQUIRED — do not use prose bullets for the tree. Keep the diagram clean and structural; risk commentary belongs in the P&L walkthrough or workstreams.
```

**Validation:**
- Re-run 360 Behavioral Health test
- Check for "├──" characters in Diligence Playbook within a code block

---

## Summary: Prompt Patches to Implement

### Priority 1 (Critical — Apply to All Tests)

| Patch | File | Change |
|-------|------|--------|
| 1.1 | report-structure.md | Add EBITDA adjustments fallback to Financial Summary section |
| 1.2 | report-structure.md | Add "MANDATORY FORMAT" for value driver tree (ASCII in code block) |

### Priority 2 (Important — Improves Consistency)

| Patch | File | Change |
|-------|------|--------|
| 2.1 | industry-index.md | Add signals for route-based services, semiconductors |

---

## Next Steps

1. **Review this document** with stakeholder
2. **Prioritize patches** — P1 patches should be implemented before next test cycle
3. **Re-run test cases** after patches applied
4. **Score with rubric** to measure improvement
5. **Document baseline vs. improved scores** in test results

---

## Reviewer Feedback (January 14, 2026)

The following feedback was provided after manual review of each test output. These comments identify enhancement opportunities beyond the automated pattern detection above.

### Brown & Brown — Reviewer Comments

**Strengths Identified:**
- Industry context on the insurance brokerage model is very good
- Explanations of different revenue streams are strong
- Clear explanation of contingent commissions and investment income
- Key brokerage subsectors section is very useful

**Issues Identified:**

| Issue | Description | Proposed Fix |
|-------|-------------|--------------|
| "Producers" undefined | Term used as industry jargon without explanation — says they "generate and retain revenue" but doesn't clarify these are salespeople | Define industry terms on first use: "Producers (i.e., salespeople who originate and retain client relationships)..." |
| Subheader naming | Current: "FDD lens for a private brokerage:" / "Context bullets for an FDD associate" | Standardize all such headers as: "🔍 Diligence Considerations" |
| Value driver tree format | Good content but needs ASCII diagram format in a code block | Enforce code block format per Pattern 6 patch |
| P&L walkthrough structure | Headers don't match income statement line items | Headers should mirror exact income statement captions (e.g., "Net Commissions and Fees") |
| P&L walkthrough content | Doesn't explain the nature of each P&L item first | Write in full prose (2-3 sentences per bullet) covering what the item is, how to decompose it for diligence, and why it matters |

**Prompt Enhancement Required:**
Add to `report-structure.md` under Diligence Playbook → P&L Walkthrough:

```markdown
### P&L Walkthrough Structure

**Header Format:** Use the exact caption from the target's income statement (e.g., "Net Commissions and Fees," "Employee Compensation and Benefits")

**Content:** Write in full prose sentences. Each bullet should be 2-3 complete sentences covering what the item is, how to decompose it for diligence, and why it matters. Do not use label-value pairs or sentence fragments.

**Example:**
#### Net Commissions and Fees

- This is the core operating revenue line for an insurance brokerage, representing fees earned from placing policies with carriers on behalf of clients. It includes both base commissions (paid at policy inception or renewal) and contingent commissions (profit-sharing arrangements with carriers based on book performance, loss ratios, and volume).

- For diligence, split this line into base versus contingent commissions, then further decompose by new business versus renewal, by channel (retail versus wholesale), and by line of business. Contingent commissions typically represent 5-15% of total commissions for mid-market brokers but can vary significantly based on carrier relationships and loss experience.

- Base commissions are highly predictable and recurring since they renew with the underlying policies. Contingent commissions are more volatile because they depend on loss ratios and carrier profitability, so QoE should consider normalizing these over a 3-5 year period rather than using a single year.

- Retention of the producer base is critical because producers (the salespeople who originate and manage client relationships) typically control the client relationship. If key producers leave post-close, the associated book of business may follow, so diligence should assess producer tenure, compensation structures, and non-compete arrangements.
```

---

### ServiceTitan — Reviewer Comments

**Strengths Identified:**
- Strong overview section
- "What Field Service Management SaaS really sells (and why it can be sticky)" — excellent
- Revenue mechanics explanation is strong
- Key SaaS metrics section is good
- Financial summary overall is really good

**Issues Identified:**

| Issue | Description | Proposed Fix |
|-------|-------------|--------------|
| Accounting policies format | Identifies issues but lacks subheaders by policy type | Add subheaders per policy area (e.g., "Revenue Recognition," "Subscription vs Usage vs Services") |
| Accounting policy content | Jumps straight to "what to test" | Write in full prose: first explain typical accounting treatment, then explain what to test in diligence |
| Financial Summary "Context for Diligence" | Section name unclear | Rename to "Financial Trends" with expanded analysis |
| Financial Trends depth | Needs more elaborate analysis of growth rates and underlying drivers | Calculate growth rates, identify drivers, explain business performance and reasons, then apply to diligence |
| Diligence Playbook intro | Section starts abruptly | Add introduction explaining what a diligence playbook is |
| Workstreams depth | Current content reads like info request list rather than actual playbook | Significantly expand — explain relevance of each workstream area first, then analysis types and how to execute |
| Workstream structure | Example: "cohort ARR bridge" listed without context | Write in full prose explaining why the area matters for understanding performance/normalized earnings, what analyses to perform, and how to execute them |
| Workstream length | Current workstreams too terse | Expand workstreams section (not overall brief length) to include Relevance → Key Analyses → Execution Guidance structure |
| Data requests length | Current length is appropriate | DO NOT expand — current length is good |

**Prompt Enhancement Required:**
Add to `report-structure.md` under Accounting Policies:

```markdown
### Accounting Policies Section

**Use Subheaders:** Create a subheader for each major policy area (e.g., Revenue Recognition, Deferred Revenue, Capitalized Costs, Stock-Based Compensation).

**Content:** Write in full prose sentences. Each policy area should have 2-3 bullets: first explaining how the item is typically accounted for in the industry, then explaining what to test in diligence. If actual financial statements with notes are available, use the target's actual policy; otherwise use an illustrative industry standard.

**Example:**
#### Revenue Recognition

- SaaS subscription revenue is typically recognized ratably over the contract term because the vendor has a stand-ready performance obligation to provide continuous access to the software. Usage-based revenue is recognized as consumption occurs, with estimates and true-ups at period end. Professional services may be distinct performance obligations (recognized as delivered) or non-distinct (combined with subscription revenue and recognized ratably).

- In diligence, review the company's revenue recognition memos to confirm the performance obligation analysis supports ratable recognition. Test the standalone selling price allocation for bundled arrangements, and verify that ratable recognition schedules tie to the deferred revenue rollforward. Look for signs of aggressive upfront recognition or unusual contract modifications that accelerate revenue.
```

Add to `report-structure.md` under Diligence Playbook:

```markdown
### Diligence Playbook Introduction

The Diligence Playbook section MUST begin with a brief introduction (2-3 sentences) explaining what a diligence playbook is (a structured framework for financial analysis) and how to use the section (prioritized workstreams with execution guidance).

### Workstream Structure (EXPANDED)

Each workstream must provide actionable depth — DO NOT simply list bullet points or data requests. Write in full prose sentences. Each workstream should explain why the area matters, what analyses to perform, and how to execute them.

**Note:** This expanded structure should make workstreams more actionable without significantly increasing overall brief length. The goal is depth per workstream, not more workstreams.

**Example:**
#### Revenue & Bookings Quality

- Understanding revenue quality is critical because SaaS valuation multiples depend on recurring, sustainable ARR. If the company's ARR definition includes one-time revenue or services, or if bookings are deteriorating while reported revenue grows, the underlying business may be weaker than headline metrics suggest.

- The primary analysis is building an ARR bridge that decomposes movement into new logos, expansion, contraction, and churn. This requires monthly ARR by customer with flags for each movement type, ideally going back 36 months. The bridge reveals whether growth is sustainable (driven by new logos and healthy expansion) or fragile (dependent on a few large wins or masking elevated churn).

- Cohort retention analysis separates product stickiness from expansion effects. Calculate gross revenue retention by cohort to see the true churn rate before expansion offsets it, then calculate net revenue retention to see the combined effect. Typical SMB SaaS benchmarks are 85-95% GRR and 100-115% NRR; significant deviation warrants investigation.

- Key red flags include NRR propped up by price increases rather than genuine expansion, bookings declining while recognized revenue grows (suggesting deferred revenue is being drawn down), and deferred revenue shrinking quarter over quarter despite stated ARR growth.
```

---

### Cross-Cutting Themes from Review

The reviewer feedback identifies several themes that apply across all test outputs.

**Writing Style Note:** The existing writing guidelines in `fdd-researcher.md` (line 128-136) and `report-structure.md` (lines 21, 34) require full prose sentences, not fragments or label-value pairs. The examples above align with this requirement — all content should be written in complete sentences (2-3 sentences per bullet), not in the style of "**Label:** fragment text".

| Theme | Current State | Enhanced State |
|-------|---------------|----------------|
| **Industry jargon** | Terms used without definition | Define on first use with plain-language parenthetical |
| **Section subheaders** | Inconsistent naming ("FDD lens," "Context bullets") | Standardize to "🔍 Diligence Considerations" |
| **Accounting policies** | Lists what to test only | Full prose: first explain typical accounting treatment, then explain what to test in diligence |
| **P&L walkthrough** | Unstructured commentary | Full prose bullets (2-3 sentences each) covering what the item is, how to decompose it, and why it matters |
| **Financial trends** | Brief context bullets | Expanded analysis: growth rates, drivers, business performance, diligence implications |
| **Workstreams** | Reads like info request list | Full prose explaining relevance, key analyses, and execution guidance |
| **Value driver tree** | Sometimes prose, sometimes diagram | Always ASCII diagram in code block (no annotations in tree) |
| **Playbook intro** | Starts abruptly | Add 2-3 sentence introduction |

---

## Updated Priority Patches (From Reviewer Feedback)

Based on reviewer feedback, the following patches should be added to the implementation queue:

### Priority 1 (Critical)

| Patch | File | Change |
|-------|------|--------|
| 1.3 | report-structure.md | Add P&L Walkthrough guidance (full prose, 2-3 sentences per bullet, headers match income statement captions) |
| 1.4 | report-structure.md | Add Accounting Policies guidance (full prose: typical treatment + what to test) |
| 1.5 | report-structure.md | Add Workstream guidance (full prose covering relevance, analyses, and execution) |

### Priority 2 (Important)

| Patch | File | Change |
|-------|------|--------|
| 2.2 | report-structure.md | Add Diligence Playbook introduction requirement |
| 2.3 | fdd-researcher.md | Add instruction: "Define industry jargon on first use" |
| 2.4 | report-structure.md | Standardize diligence consideration subheaders |
| 2.5 | report-structure.md | Rename "Context for Diligence" to "Financial Trends" with expanded analysis guidance |

### Priority 3 (Nice to Have)

| Patch | File | Change |
|-------|------|--------|
| 3.1 | report-structure.md | Add explicit "DO NOT expand Data Requests beyond 150-200 words" |

---

## Validation Checklist (Post-Patches)

After implementing patches, re-run tests and verify:

**Pattern Fixes:**
- [ ] EBITDA adjustments present (target-specific OR industry common fallback)
- [ ] Value driver tree is in ASCII format within code block

**Reviewer Feedback Fixes:**
- [ ] P&L walkthrough uses income statement captions as headers
- [ ] Each P&L item is written in full prose (2-3 sentences per bullet) covering what it is, how to decompose it, and why it matters
- [ ] Accounting policies have subheaders by policy type
- [ ] Each policy is written in full prose covering typical treatment and what to test
- [ ] Workstreams are written in full prose covering relevance, key analyses, and execution guidance
- [ ] Diligence Playbook has 2-3 sentence introduction
- [ ] Industry jargon defined on first use
- [ ] Financial trends section includes growth rate calculations and driver analysis
- [ ] Data requests remain ≤200 words

---

*This evaluation was performed by Claude Opus 4.5 on January 14, 2026.*
*Reviewer feedback integrated on January 14, 2026.*

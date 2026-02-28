# FDD Researcher — Test Strategy

## Overview

This document defines the testing approach for verifying the FDD Researcher GPT functions correctly before deployment.

**Related Documents:**
- `public-company-tests.md` — Test prompts using public companies as CIM proxies
- `evaluation-rubric.md` — Scoring rubric for evaluating output quality
- `outputs/` — Saved test outputs for comparison

---

## Testing Approaches

### 1. Public Company Tests (Recommended for Initial Validation)

Use public companies as proxies for CIM-based testing. Public companies have readily available financial information (10-K, S-1, earnings calls), making them ideal for validating research quality without confidential documents.

**Benefits:**
- No need for real CIMs
- Reproducible tests (same public info available to all testers)
- Can validate industry-specific module quality
- Easy to compare outputs over time

**See:** `public-company-tests.md` for specific prompts

### 2. CIM-Based Tests (For Final Validation)

Use real or synthetic CIM excerpts to test the full workflow including document extraction.

**Benefits:**
- Tests actual CIM extraction logic
- Validates "what to extract vs skip" guidance
- Tests low-doc handling

### 3. Quick Validation Tests

Short, focused prompts that test specific capabilities (competitive landscape, benchmarks, mechanics explanation).

**See:** Quick Validation section in `public-company-tests.md`

---

## Test Categories

### 1. Industry Inference Tests

**Purpose:** Verify the GPT correctly identifies industries from document signals.

| Test ID | Fixture | Expected Industry | Key Signals |
|---------|---------|-------------------|-------------|
| INF-01 | saas-cim-excerpt.md | Technology / SaaS | ARR, SaaS, per-seat, logos |
| INF-02 | healthcare-vdd-excerpt.md | Healthcare Services | NPSR, wRVUs, payor mix, denials |
| INF-03 | retail-teaser.md | Retail / Consumer | same-store sales, inventory turns, e-commerce |
| INF-04 | lending-cim-excerpt.md | Banking & Lending | NIM, CECL, loan portfolio, charge-offs |

**Pass Criteria:** Top-scoring industry matches expected.

---

### 2. Module Retrieval Tests

**Purpose:** Verify the correct module content is retrieved for each industry.

| Test ID | Industry | Expected Sections |
|---------|----------|-------------------|
| RET-01 | Technology / SaaS | ARR bridge, cohort retention, NRR/GRR |
| RET-02 | Banking & Lending | NIM analysis, CECL, provision testing |
| RET-03 | Healthcare Services | wRVU productivity, payor mix, denials |
| RET-04 | Retail / Consumer | 4-wall economics, comp sales, inventory |

**Pass Criteria:** Module contains expected KPIs, red flags, and data requests.

---

### 3. Workflow Tests

**Purpose:** Verify the 3-step workflow executes correctly.

| Test ID | Step | Input | Expected Output |
|---------|------|-------|-----------------|
| WFL-01 | Quick Intake | Upload fixture | Document summary table + 2-4 questions |
| WFL-02 | Research Plan | Answer questions | Research summary + plan + approval gate |
| WFL-03 | Execution | Say "go" | Full brief with all core sections |

**Pass Criteria:** Each step produces expected structure.

---

### 4. Output Structure Tests

**Purpose:** Verify briefs contain all required sections.

| Test ID | Section | Required Elements |
|---------|---------|-------------------|
| OUT-01 | Company Overview | What, who, where, how, scale |
| OUT-02 | Financial Summary | Revenue, margins, growth, table format |
| OUT-03 | Key Findings | 5-8 numbered items with "why it matters" |
| OUT-04 | Gaps & Unknowns | Table with Gap / Why / Action |
| OUT-05 | Industry Context | Benchmarks + citations |
| OUT-06 | Diligence Playbook | What to test / How / Risk |
| OUT-07 | Data Requests | P1 and P2 tables with rationale |
| OUT-08 | Management Questions | Numbered list with context |
| OUT-09 | Sources | Numbered citations |

**Pass Criteria:** All sections present with correct format.

---

### 5. Value Driver Diagram Tests

**Purpose:** Verify PowerPoint generation works for all industries.

| Test ID | Industry | Expected Slides |
|---------|----------|-----------------|
| VDD-01 | Technology / SaaS | Title, EBITDA Tree, WC Tree, Capex Tree |
| VDD-02 | Banking & Lending | Title, PPNR Tree, Balance Sheet, Capital |
| VDD-03 | Insurance | Title, Underwriting Income, Float, Capital |
| VDD-04 | All others | Title, EBITDA Tree, WC Tree, Capex Tree |

**Pass Criteria:** PowerPoint generates without error, correct slide titles.

---

### 6. Low-Doc Tests

**Purpose:** Verify graceful handling of sparse documents.

| Test ID | Input | Expected Behavior |
|---------|-------|-------------------|
| LOW-01 | Teaser only (1 page) | Acknowledge limitation, use industry defaults |
| LOW-02 | Pricing page only | Extract pricing, frame as hypothesis |
| LOW-03 | No financials | Note missing data, prioritize in data requests |

**Pass Criteria:** GPT adapts without hallucinating.

---

### 7. Source Attribution Tests

**Purpose:** Verify correct source attribution.

| Test ID | Source Type | Expected Format |
|---------|-------------|-----------------|
| SRC-01 | Document fact | "The CIM shows..." or "According to VDD..." |
| SRC-02 | Web research | Citations at end of paragraph [1][2] |
| SRC-03 | Unknown | "Not disclosed—recommend requesting..." |

**Pass Criteria:** Sources correctly attributed throughout.

---

## Test Execution

### Automated Tests

```bash
# Industry inference
python scripts/test_industry_inference.py

# PowerPoint generation
python scripts/value_driver_diagram.py
```

### Manual Tests (via ChatGPT)

1. Upload fixture to deployed GPT
2. Follow workflow prompts
3. Verify output against criteria
4. Generate Value Driver Diagram
5. Verify PowerPoint content

---

## Sample Test Script

For each fixture, simulate the full workflow:

```
1. UPLOAD: fixtures/saas-cim-excerpt.md
2. VERIFY: Industry inferred as "Technology / SaaS"
3. VERIFY: Document summary table present
4. VERIFY: 2-4 clarifying questions asked
5. ANSWER: Confirm target, industry, geography
6. VERIFY: Research plan with approval gate
7. SAY: "go"
8. VERIFY: Full brief with all 9 core sections
9. REQUEST: Value driver diagram
10. VERIFY: PowerPoint with 4 slides
```

---

## Test Results Template

| Test ID | Date | Result | Notes |
|---------|------|--------|-------|
| INF-01 | | PASS/FAIL | |
| ... | | | |

---

## Regression Testing

After any changes to:
- System prompt (`dist/fdd-researcher.md`)
- Knowledge files (`dist/industry-modules.md`, `dist/output-structure.md`)
- PowerPoint generator

Re-run all tests in categories 1-5.

---

## Evaluation Criteria

Use the rubric in `evaluation-rubric.md` to score outputs. Key criteria:

### Must-Pass Requirements
- [ ] All 10 sections present
- [ ] No process artifacts in final output
- [ ] Industry Context ≥400 words
- [ ] 5+ competitors named
- [ ] Benchmarks with sources cited
- [ ] Value driver tree included
- [ ] P1/P2 data requests with rationale
- [ ] Length 1,800-2,800 words

### Scoring Thresholds
- **Passing Score:** 70/100
- **Target Score:** 85/100

### Category Weights
| Category | Weight |
|----------|--------|
| Structure & Format | 15% |
| CIM/Document Extraction | 20% |
| Industry Context Depth | 25% |
| Competitive Landscape | 15% |
| Actionability | 15% |
| Writing Quality | 10% |

---

## Recommended Test Sequence

### Initial Validation (New Deployment)
1. Run TC-1 (Brown & Brown - Insurance) — validates most common deal type
2. Run TC-2 (ServiceTitan - SaaS) — validates tech module
3. Run QV-1 through QV-4 — validates specific capabilities
4. Score each using evaluation rubric
5. All must score ≥70 to deploy

### Regression Testing (After Changes)
1. Re-run TC-1 (Insurance) — most sensitive to changes
2. Run relevant industry test if module was changed
3. Score and compare to baseline

### Full Validation (Quarterly)
1. Run all 7 test cases (TC-1 through TC-7)
2. Score each using full rubric
3. Document trends and improvements needed

# FDD Researcher — Public Company Test Suite

This document provides testing prompts using public companies as proxies for CIM-based testing. Public companies have readily available financial information, making them ideal for validating research quality without needing confidential documents.

---

## How to Use This Test Suite

1. **Select a test case** from the industry you want to validate
2. **Copy the prompt** into the FDD Researcher GPT
3. **Follow the workflow** (answer clarifying questions, say "go")
4. **Evaluate the output** using the rubric in `evaluation-rubric.md`
5. **Document results** in the test results log

---

## Test Case 1: Insurance Brokerage (Brown & Brown)

**Industry Module:** Insurance (Broker/Agency archetype)
**Why this test:** Validates the insurance module, competitive landscape, and M&A context

### Prompt

```
I'm conducting financial due diligence on a potential acquisition target in the insurance brokerage space. To prepare, I'd like you to research Brown & Brown, Inc. (NYSE: BRO) as a comparable public company.

Please prepare a research brief that would help an FDD associate understand:
1. How the insurance brokerage business model works
2. Key financial metrics and what "good" looks like
3. The competitive landscape and M&A dynamics
4. What to focus on in diligence for a brokerage deal

Use Brown & Brown's public information (10-K, investor presentations, earnings calls) as the basis, but frame this as preparation for diligencing a similar private company.
```

### Expected Output Validation

| Criteria | Expected | Check |
|----------|----------|-------|
| Industry Context ≥400 words | Yes | |
| Commission economics explained | How brokers make money from carriers | |
| Organic vs acquired growth discussed | BRO's acquisition strategy | |
| 5+ competitors named | Hub, Gallagher, Marsh, Acrisure, etc. | |
| M&A multiples cited | 8-15x EBITDA range | |
| Producer economics mentioned | Revenue per producer, retention | |
| Contingent commissions explained | What they are, why they matter | |
| Value driver tree included | Broker EBITDA tree | |

---

## Test Case 2: Technology / SaaS (ServiceTitan)

**Industry Module:** Technology / SaaS
**Why this test:** Validates SaaS metrics, competitive landscape for field service software

### Prompt

```
I'm preparing for due diligence on a field service management SaaS company. ServiceTitan recently filed for IPO (or went public) — please research them as a comparable.

Prepare a research brief covering:
1. How field service SaaS economics work
2. Key SaaS metrics (ARR, NRR, GRR, CAC payback) and benchmarks
3. The competitive landscape in FSM software
4. What to focus on when diligencing a similar company

Use ServiceTitan's S-1/public filings as the basis, framed as preparation for a private company deal.
```

### Expected Output Validation

| Criteria | Expected | Check |
|----------|----------|-------|
| Industry Context ≥400 words | Yes | |
| NRR/GRR benchmarks with sources | SMB SaaS ranges | |
| Cohort retention explained | Why it matters for SaaS | |
| 5+ competitors named | Housecall Pro, Jobber, FieldEdge, etc. | |
| Gross margin benchmarks | 70-80% range with drivers | |
| CAC payback discussed | What good looks like | |
| Growth decomposition | New vs expansion vs churn | |
| Value driver tree included | SaaS EBITDA tree | |

---

## Test Case 3: Healthcare Services (Acadia Healthcare)

**Industry Module:** Healthcare Services
**Why this test:** Validates healthcare metrics, payor mix, regulatory context

### Prompt

```
I'm preparing for due diligence on a behavioral health services company. Research Acadia Healthcare (NASDAQ: ACHC) as a comparable.

Prepare a research brief covering:
1. How behavioral health facility economics work
2. Key healthcare services metrics (patient days, revenue per patient day, payor mix)
3. The competitive and regulatory landscape
4. What to focus on when diligencing a similar company

Frame this as preparation for a private company deal in behavioral health.
```

### Expected Output Validation

| Criteria | Expected | Check |
|----------|----------|-------|
| Industry Context ≥400 words | Yes | |
| Revenue per patient day explained | What drives it | |
| Payor mix analysis | Medicare/Medicaid/Commercial/Self-pay | |
| Occupancy/census metrics | Why they matter | |
| 5+ competitors named | UHS, HCA behavioral, regional players | |
| Regulatory context | State licensing, CMS, Joint Commission | |
| Labor cost dynamics | Nurse/clinician staffing | |
| Reimbursement trends | Rate pressure, value-based care | |

---

## Test Case 4: Business Services (Cintas)

**Industry Module:** Business Services
**Why this test:** Validates route-based services, utilization, recurring revenue

### Prompt

```
I'm preparing for due diligence on a uniform rental and facility services company. Research Cintas Corporation (NASDAQ: CTAS) as a comparable.

Prepare a research brief covering:
1. How route-based facility services economics work
2. Key metrics (route density, stops per route, revenue per stop, retention)
3. The competitive landscape
4. What to focus on when diligencing a similar company

Frame this as preparation for a private company deal.
```

### Expected Output Validation

| Criteria | Expected | Check |
|----------|----------|-------|
| Industry Context ≥400 words | Yes | |
| Route economics explained | Density, stops, efficiency | |
| Customer retention metrics | Why "sticky" revenue | |
| Cross-sell dynamics | Uniform → first aid → fire → facility | |
| 5+ competitors named | UniFirst, Aramark, Alsco, etc. | |
| M&A context | Consolidation in the space | |
| Working capital dynamics | A/R, inventory (garments) | |
| Labor/cost structure | Route drivers, processing | |

---

## Test Case 5: Industrial Distribution (Fastenal)

**Industry Module:** Industrial Manufacturing / Distribution
**Why this test:** Validates distribution economics, vending/onsite models

### Prompt

```
I'm preparing for due diligence on an industrial distribution / MRO company. Research Fastenal Company (NASDAQ: FAST) as a comparable.

Prepare a research brief covering:
1. How industrial distribution economics work
2. Key metrics (daily sales, gross margin, inventory turns, vending penetration)
3. The competitive landscape
4. What to focus on when diligencing a similar company

Frame this as preparation for a private company deal.
```

### Expected Output Validation

| Criteria | Expected | Check |
|----------|----------|-------|
| Industry Context ≥400 words | Yes | |
| Distribution margin structure | Gross vs operating, mix effects | |
| Vending/onsite model explained | Why it matters for stickiness | |
| Customer concentration | Industrial vs construction | |
| 5+ competitors named | Grainger, MSC, HD Supply, etc. | |
| Inventory management | Turns, SKU rationalization | |
| Growth drivers | Onsite, vending, e-commerce | |
| Working capital intensity | Inventory, A/R dynamics | |

---

## Test Case 6: Banking / Specialty Finance (Ally Financial)

**Industry Module:** Banking & Lending
**Why this test:** Validates lending metrics, credit quality, NIM analysis

### Prompt

```
I'm preparing for due diligence on a specialty auto finance company. Research Ally Financial (NYSE: ALLY) as a comparable.

Prepare a research brief covering:
1. How auto finance economics work
2. Key metrics (NIM, NCO rates, delinquency, provision, efficiency ratio)
3. The competitive landscape
4. What to focus on when diligencing a similar company

Frame this as preparation for a private company deal.
```

### Expected Output Validation

| Criteria | Expected | Check |
|----------|----------|-------|
| Industry Context ≥400 words | Yes | |
| NIM decomposition | Yield vs cost of funds | |
| Credit metrics explained | DPD buckets, NCO, CECL | |
| Funding structure | Deposits vs wholesale vs securitization | |
| 5+ competitors named | Capital One, Santander, regional banks | |
| Used vs new dynamics | Residual risk, pricing | |
| Subprime vs prime | Credit spectrum economics | |
| Regulatory context | CFPB, state licensing | |

---

## Test Case 7: Retail / Consumer (Floor & Decor)

**Industry Module:** Retail / Consumer
**Why this test:** Validates unit economics, same-store sales, retail metrics

### Prompt

```
I'm preparing for due diligence on a specialty retail flooring company. Research Floor & Decor (NYSE: FND) as a comparable.

Prepare a research brief covering:
1. How specialty retail economics work
2. Key metrics (same-store sales, 4-wall EBITDA, inventory turns, new store productivity)
3. The competitive landscape
4. What to focus on when diligencing a similar company

Frame this as preparation for a private company deal.
```

### Expected Output Validation

| Criteria | Expected | Check |
|----------|----------|-------|
| Industry Context ≥400 words | Yes | |
| Unit economics explained | 4-wall contribution, payback | |
| Same-store sales decomposition | Traffic vs ticket | |
| New store ramp | Maturation curve | |
| 5+ competitors named | Home Depot, Lowe's, LL Flooring, tile shops | |
| Pro vs DIY customer mix | Why it matters | |
| Inventory management | Turns, markdown risk | |
| Real estate strategy | Lease terms, format | |

---

## Quick Validation Tests

These shorter prompts test specific capabilities:

### QV-1: Competitive Landscape Depth

```
Research the competitive landscape for insurance brokerages in North America. Who are the top 10 players by revenue, and what's driving M&A activity in the space?
```

**Expected:** 10 named competitors with scale, M&A deal volume, multiple ranges

### QV-2: Industry Mechanics

```
Explain how commission economics work for P&C insurance brokerages. What's a typical commission rate, what are contingent profit commissions, and how does organic growth happen?
```

**Expected:** Detailed mechanics explanation, specific percentages, CPC triggers

### QV-3: Benchmark Retrieval

```
What are typical SaaS metrics benchmarks for SMB-focused vertical SaaS? Include NRR, GRR, gross margin, and CAC payback ranges with sources.
```

**Expected:** Specific ranges with citations (SaaS Capital, KeyBanc, OpenView, etc.)

### QV-4: Value Driver Tree

```
Show me the EBITDA value driver tree for an insurance brokerage, annotated with the key drivers and risk areas.
```

**Expected:** Text-based tree diagram with broker-specific structure

---

## Test Execution Log Template

| Test ID | Date | Tester | Result | Notes |
|---------|------|--------|--------|-------|
| TC-1 (Brown & Brown) | | | PASS/FAIL | |
| TC-2 (ServiceTitan) | | | PASS/FAIL | |
| TC-3 (Acadia) | | | PASS/FAIL | |
| TC-4 (Cintas) | | | PASS/FAIL | |
| TC-5 (Fastenal) | | | PASS/FAIL | |
| TC-6 (Ally) | | | PASS/FAIL | |
| TC-7 (Floor & Decor) | | | PASS/FAIL | |
| QV-1 (Competitive) | | | PASS/FAIL | |
| QV-2 (Mechanics) | | | PASS/FAIL | |
| QV-3 (Benchmarks) | | | PASS/FAIL | |
| QV-4 (Value Tree) | | | PASS/FAIL | |

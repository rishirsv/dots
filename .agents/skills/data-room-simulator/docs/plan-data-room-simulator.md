# Implementation Plan: M&A Data Room Simulator

**Branch:** `feat/data-room-simulator`

## Description

Build a Claude Code skill that generates complete, internally consistent simulated M&A data rooms for fictitious companies. Users specify industry (SaaS, Construction, Manufacturing, Services, Retail), revenue size ($5-500M), and realism mode (Clean, Realistic, Messy). The skill generates all documents a due diligence team would expect: trial balances, financial statements, customer/project data, HR records, and narrative documents (CIM, policies)—all mathematically tied together.

Key differentiators:
- **Industry-specific documents**: SaaS gets subscriptions/MRR; Construction gets WIP/% completion; Manufacturing gets inventory/BOM
- **Realism modes**: Clean (perfect data), Realistic (QoE adjustments, seasonality), Messy (intentional discrepancies for AI stress-testing)
- **Verification script**: Validates all cross-document consistency rules
- **Brand identity**: Consistent colors/styling across all documents

## Scope

**In:**
- SKILL.md with workflow instructions
- 5 industry profiles (SaaS, Construction, Manufacturing, Services, Retail)
- Python scripts for data generation (company, financials, operations, HR)
- Verification script with universal + industry-specific rules
- Templates for narrative documents (CIM, accounting policies)
- Reference documentation

**Out:**
- Actual GPT/Claude deployment
- Web UI or API wrapper
- Real company data or connections to external data sources

## Tasks

### Phase 1: Foundation & Skill Setup ✅

Set up the skill structure and core configuration files.

- [x] **1.0 Create skill directory structure**
  - [x] 1.1 Create `/Users/rishi/Code/agents/data-room-simulator/` with subdirs: `scripts/`, `profiles/`, `templates/`, `reference/`, `output/`
  - [x] 1.2 Create `SKILL.md` with YAML frontmatter (`name: data-room-simulator`, description covering M&A, due diligence, financial simulation)
  - [x] 1.3 Add workflow instructions to SKILL.md: user prompts for industry, size, realism mode
  - [x] 1.4 Validate: Skill appears in Claude Code skill list

- [x] **1.1 Create industry profiles**
  - [x] 1.1.1 Create `profiles/saas.json` — subscription model, MRR/ARR, churn, deferred revenue accounts
  - [x] 1.1.2 Create `profiles/construction.json` — project-based, WIP, % completion, retention, subcontractors
  - [x] 1.1.3 Create `profiles/manufacturing.json` — product-based, inventory, COGS, BOM
  - [x] 1.1.4 Create `profiles/professional_services.json` — time-based, utilization, WIP, billable hours
  - [x] 1.1.5 Create `profiles/retail.json` — transaction-based, inventory, heavy seasonality
  - [x] 1.1.6 Validate: Each profile has `bounds`, `chart_of_accounts`, `documents`, `consistency_rules`, `seasonality_patterns`

### Phase 2: Company Seed Generator ✅

Generate the foundational company data that drives all other generation.

- [x] **2.0 Create company seed generator**
  - [x] 2.1 Create `scripts/generate_company.py` with CLI args: `--industry`, `--size`, `--complexity`, `--realism-mode`
  - [x] 2.2 Implement company profile generation: name (Faker), industry vertical, founding year, location, HQ
  - [x] 2.3 Implement brand identity generation: primary color, secondary color, accent, font family (store as hex codes)
  - [x] 2.4 Implement management team generation: CEO, CFO, COO, VP Sales with Faker names and brief bios
  - [x] 2.5 Implement company story generation: founding narrative, 3-5 key milestones, market position, "why selling" context
  - [x] 2.6 Implement events timeline generation: customer wins/losses, product launches, one-time events (with dates and $ impact)
  - [x] 2.7 Output `company_seed.json` with all parameters
  - [x] 2.8 Validate: Run with `--industry saas --size small`, verify JSON output has all required fields

### Phase 3: Financial Data Generator ✅

Generate trial balance and financial statements that tie together perfectly.

- [x] **3.0 Create financial data generator**
  - [x] 3.1 Create `scripts/generate_financials.py` that reads `company_seed.json` + industry profile
  - [x] 3.2 Load chart of accounts from industry profile
  - [x] 3.3 Generate monthly trial balance for configured years (3-5 years of history)
  - [x] 3.4 Apply seasonality patterns from profile (Q4 heavy, summer slow, etc.)
  - [x] 3.5 Inject events from timeline: revenue drops for lost customers, one-time expenses for lawsuits
  - [x] 3.6 Derive income statement from trial balance revenue/expense accounts
  - [x] 3.7 Derive balance sheet from trial balance asset/liability/equity accounts
  - [x] 3.8 Derive cash flow statement using indirect method
  - [x] 3.9 Validate: Debits = Credits every period; Assets = Liabilities + Equity
  - [x] 3.10 Output: `trial_balance.xlsx`, `income_statement.xlsx`, `balance_sheet.xlsx`, `cash_flow.xlsx`

- [ ] **3.1 Add QoE adjustments (Realistic/Messy modes)** _(deferred to Phase 10)_
  - [ ] 3.1.1 Create `scripts/generate_qoe_issues.py` for embedding adjustments
  - [ ] 3.1.2 Implement non-recurring expense injection (legal fees, restructuring) with flags
  - [ ] 3.1.3 Implement owner add-backs (personal expenses, above-market rent to owner's LLC)
  - [ ] 3.1.4 Implement related party transactions (family on payroll, related entity payments)
  - [ ] 3.1.5 Generate EBITDA bridge / management adjustments schedule
  - [ ] 3.1.6 Validate: Issues are embedded but financials still mathematically tie

- [x] **3.2 Add NWC and supporting schedules**
  - [x] 3.2.1 Generate monthly NWC schedule with components (AR, AP, inventory, prepaid, accrued)
  - [x] 3.2.2 Apply seasonal NWC patterns (year-end AR spike, etc.)
  - [x] 3.2.3 Generate AR aging schedule that ties to balance sheet AR
  - [x] 3.2.4 Generate AP aging schedule that ties to balance sheet AP
  - [x] 3.2.5 Generate fixed asset schedule with depreciation
  - [ ] 3.2.6 Generate debt schedule with interest _(deferred)_
  - [x] 3.2.7 Validate: All schedules tie to financial statements

### Phase 4: Operations Data Generator ✅

Generate industry-specific revenue and operational data.

- [x] **4.0 Create operations data generator**
  - [x] 4.1 Create `scripts/generate_operations.py` with industry dispatch
  - [x] 4.2 Read profile to determine which documents to generate
  - [x] 4.3 Implement `_generate_saas()`: customer master, subscription register, invoice register, monthly revenue by customer, product/plan master
  - [x] 4.4 Implement `_generate_construction()`: project master, contract register, % completion schedule, WIP schedule, subcontractor register, progress billings
  - [x] 4.5 Implement `_generate_manufacturing()`: customer master, product master, sales orders, invoice register, inventory ledger, bill of materials
  - [x] 4.6 Implement `_generate_services()`: client master, engagement register, timesheet data, WIP schedule, invoice register
  - [x] 4.7 Implement `_generate_retail()`: product catalog, sales transactions, inventory ledger, supplier master
  - [x] 4.8 **Critical**: Ensure sum of generated revenue = P&L revenue (exact match)
  - [x] 4.9 Validate: Run for each industry, verify revenue ties to financials

### Phase 5: HR Data Generator ✅

Generate employee and payroll data.

- [x] **5.0 Create HR data generator**
  - [x] 5.1 Create `scripts/generate_hr_data.py`
  - [x] 5.2 Generate employee census: names (Faker), titles, departments, hire dates, salaries
  - [x] 5.3 Ensure employee count matches `company_seed.headcount`
  - [x] 5.4 Ensure sum of salaries = P&L salary expense
  - [x] 5.5 Generate payroll register by period
  - [x] 5.6 Generate department headcount breakdown
  - [x] 5.7 Generate salary band summary
  - [x] 5.8 Generate tenure analysis
  - [x] 5.9 Validate: Headcount and salary totals tie to seed and P&L

### Phase 6: Verification Script ✅

Validate all cross-document consistency.

- [x] **6.0 Create verification script**
  - [x] 6.1 Create `scripts/verify_data_room.py` that reads all generated files
  - [x] 6.2 Implement universal checks: TB balance, BS equation, payroll tie, headcount tie, AR/AP aging ties
  - [x] 6.3 Load industry-specific checks from profile `consistency_rules`
  - [x] 6.4 Implement SaaS checks: MRR × 12 = revenue, deferred revenue tie
  - [x] 6.5 Implement construction checks: project revenue = P&L, WIP asset/liability calculation
  - [x] 6.6 Implement manufacturing checks: COGS = beginning + purchases - ending, inventory tie
  - [x] 6.7 Implement services checks: billed time × rate = revenue, WIP calculation
  - [x] 6.8 Implement retail checks: transaction totals = revenue, inventory tie
  - [x] 6.9 Implement QoE issue detection (for Realistic/Messy modes): flag non-recurring, add-backs, related party
  - [x] 6.10 Output JSON report: `{ "status": "pass|fail", "checks": [...], "issues": [...] }`
  - [x] 6.11 Validate: Run on clean data, expect all pass ✅ (all 22 checks pass)

### Phase 7: Document Styling & PDF Export _(Deferred)_

Apply brand identity and generate styled outputs.

- [ ] **7.0 Create document styling** _(optional enhancement)_
- [ ] **7.1 Create PDF export** _(optional enhancement)_

### Phase 8: Templates & Narrative Documents ✅

Create templates for LLM-generated narrative content.

- [x] **8.0 Create document templates**
  - [x] 8.1 Create `templates/cim_template.md` with sections: exec summary, company overview, market, financials, team, transaction rationale
  - [x] 8.2 Create `templates/company_overview.md` with story, milestones, vision structure
  - [x] 8.3 Create `templates/accounting_policy.md` with revenue recognition, expense policies
  - [x] 8.4 Create `templates/ebitda_bridge.md` with management adjustments format
  - [x] 8.5 Validate: Templates have clear placeholders for data injection

### Phase 9: Reference Documentation ✅

Create supporting documentation for the skill.

- [x] **9.0 Create reference files**
  - [x] 9.1 Create `reference/industry-metrics.md` with benchmarks by industry (margins, growth, churn)
  - [x] 9.2 Create `reference/document-checklist.md` listing all generated documents by industry
  - [x] 9.3 Create `reference/consistency-rules.md` documenting all validation rules
  - [x] 9.4 Create `reference/qoe-adjustments-guide.md` with common QoE issues by industry
  - [ ] 9.5 Create `reference/ma-analysis-guide.md` describing what analysts look for _(deferred)_
  - [x] 9.6 Validate: Reference docs are clear and complete

### Phase 10: Integration & End-to-End Testing ✅

Test the complete workflow.

- [x] **10.0 End-to-end testing**
  - [x] 10.1 Run full generation for SaaS company (small, realistic mode)
  - [x] 10.2 Run full generation for Construction company (mid, clean mode)
  - [ ] 10.3 Run full generation for Manufacturing company (small, messy mode) _(optional)_
  - [x] 10.4 Verify all outputs exist and verification passes for clean/realistic modes
  - [x] 10.5 Verify messy mode has detectable issues (QoE flags working)
  - [ ] 10.6 Test skill invocation via Claude Code _(optional)_
  - [x] 10.7 Document any issues and fix ✅ (BS equation + headcount + MRR tie fixed)
  - [x] 10.8 Final validation: Complete data room for each industry

**Status:** ✅ All 22 verification checks pass:
- Balance sheet equation (A = L + E) verified for all years
- Revenue consistency between Income Statement and Trial Balance
- AR/AP aging totals tie to Balance Sheet
- MRR analysis ties to P&L revenue (SaaS)
- ARR = MRR × 12 calculation verified
- Headcount matches company seed (198 employees)
- QoE issues properly detected (10 items flagged for realistic mode)

## Context

**Key files:**
- `SKILL.md` — Main skill definition and workflow
- `scripts/generate_company.py` — Company seed generation (drives everything)
- `scripts/generate_financials.py` — Trial balance and financial statements (core financials)
- `scripts/generate_operations.py` — Industry-specific revenue data
- `scripts/verify_data_room.py` — Consistency validation
- `profiles/*.json` — Industry configurations

**Dependencies:**
- pandas (data manipulation)
- openpyxl (Excel generation)
- faker (realistic names, companies)
- reportlab (PDF generation)
- numpy (numerical calculations)

## Design Decisions

| Aspect | Decision |
|--------|----------|
| Data flow | Company seed → Financials → Operations → HR → Verify |
| Industry abstraction | JSON profiles define documents, accounts, rules per industry |
| Realism modes | Clean (no issues), Realistic (QoE adjustments), Messy (intentional errors) |
| Revenue consistency | Operations data sums to exact P&L revenue |
| Verification | Universal rules + profile-loaded industry rules |

## Open Questions

- Should we include a "quick generate" mode that skips narrative documents for faster iteration?
- Do you want the skill to automatically run verification after generation, or let the user invoke it separately?

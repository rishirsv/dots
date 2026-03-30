# Consistency Rules — 6-Layer Verification

## Contents

- [Layer 1: Completeness](#layer-1-completeness)
- [Layer 2: Placeholder Detection](#layer-2-placeholder-detection)
- [Layer 3: Identity and Date Consistency](#layer-3-identity-and-date-consistency)
- [Layer 4: Accounting and Subledger Ties](#layer-4-accounting-and-subledger-ties)
- [Layer 5: Realism Range Checks](#layer-5-realism-range-checks)
- [Layer 6: Narrative and Legal Document Checks](#layer-6-narrative-and-legal-document-checks)
- [Tolerance Reference](#tolerance-reference)

## Layer 1: Completeness

| ID | Rule | Applies when |
|---|---|---|
| C-001 | All 12 section directories exist in output | Always |
| C-002 | deal_state.json exists in output root | Always |
| C-003 | manifest.json exists in output root | Always |
| C-004 | INDEX.md exists in output root | Always |
| C-005 | verification_report.json exists in output root | Always |
| C-006 | Required universal files exist per section (see taxonomy) | Always |
| C-007 | Overlay-triggered files exist when document_triggers are true | When trigger is true in deal_state |
| C-008 | Events timeline contains seeded issues | When realism_mode in {realistic, messy} |
| C-009 | Lease PDFs exist in 8.0-legal/lease_documents/ | When sites include leased locations |
| C-010 | Minimum row counts met for Excel files (>0 data rows) | Always |
| C-011 | Minimum page counts met for PDF files (>1 page) | Always |
| C-012 | No empty markdown files (>10 lines of content) | Always |

## Layer 2: Placeholder Detection

| ID | Rule | Applies when |
|---|---|---|
| P-001 | No `TBD` in any generated file | Always |
| P-002 | No `XXX` in any generated file | Always |
| P-003 | No `$X.XM`, `$XX.X`, `$XXX,XXX` placeholder patterns | Always |
| P-004 | No `[bracketed placeholder text]` in narrative files | Always |
| P-005 | No `Lorem ipsum` or filler text | Always |
| P-006 | No unresolved Jinja2 syntax (`{{`, `{%`, `}}`, `%}`) | Always |
| P-007 | No `[Company]`, `[Name]`, `[Date]` merge field patterns | Always |
| P-008 | No `TODO`, `FIXME`, `PLACEHOLDER` comments in output | Always |
| P-009 | No contradictory currencies (e.g., USD and EUR in same doc) | Always |
| P-010 | No contradictory company names within a single document | Always |

## Layer 3: Identity and Date Consistency

| ID | Rule | Applies when |
|---|---|---|
| I-001 | Company legal name matches deal_state.company.legal_name in all documents | Always |
| I-002 | DBA names used are in deal_state.company.dba_names | Always |
| I-003 | HQ address matches deal_state.company.headquarters in corporate docs | Always |
| I-004 | Site addresses match deal_state.sites in all references | Always |
| I-005 | Executive names in narratives exist in deal_state.management | Always |
| I-006 | Executive titles match between narratives and HR census | Always |
| I-007 | Fiscal year end consistent across all financial documents | Always |
| I-008 | Period ranges consistent (start/end period) across all time-series files | Always |
| I-009 | State of formation and entity type consistent in corporate and legal docs | Always |
| I-010 | Customer names in contracts match deal_state.customers_seed | Always |
| I-011 | Vendor names in contracts match deal_state.vendors_seed | Always |
| I-012 | Founding year consistent across CIM, overview, and corporate docs | Always |
| I-013 | Lease tenant name matches company legal name | Always |
| I-014 | Lease premises match site list addresses and types | Always |

## Layer 4: Accounting and Subledger Ties

### Universal (always checked)

| ID | Rule | Tolerance |
|---|---|---|
| A-001 | Trial balance: debits = credits per month | < $1.00 |
| A-002 | Balance sheet: Assets = Liabilities + Equity per period | < $1.00 |
| A-003 | Income statement revenue = trial balance revenue accounts | Exact |
| A-004 | Cash flow: ending cash = balance sheet cash | Exact |
| A-005 | Net income: IS net income = BS retained earnings change | < $1.00 |
| A-006 | AR aging total = balance sheet AR | < 1% |
| A-007 | AP aging total = balance sheet AP | < 1% |
| A-008 | Fixed asset schedule: ending balance = balance sheet PP&E | Exact |
| A-009 | Depreciation: FA schedule depreciation = IS depreciation | Exact |
| A-010 | Payroll register total = IS compensation accounts | < 5% |
| A-011 | Headcount: HR census count = deal_state headcount (+/- 3) | +/- 3 |
| A-012 | NWC schedule: current assets - current liabilities = BS working capital | Exact |
| A-013 | Debt schedule: outstanding balance = BS debt accounts | Exact |
| A-014 | Tax provision: current tax expense = IS tax expense | Exact |
| A-015 | Customer master: sum of customer revenue = total revenue | < 0.1% |
| A-016 | EBITDA bridge: reported EBITDA + adjustments = adjusted EBITDA | Exact |
| A-017 | Budget/forecast: prior year actuals match historical financials | Exact |

### Overlay-specific (checked when trigger is true)

| ID | Rule | Trigger | Tolerance |
|---|---|---|---|
| O-001 | MRR x 12 = ARR | needs_mrr_analysis | Exact |
| O-002 | Sum of subscription revenue = IS subscription revenue | needs_mrr_analysis | < 0.1% |
| O-003 | Deferred revenue schedule: ending balance = BS deferred revenue | needs_deferred_revenue_schedule | Exact |
| O-004 | WIP schedule: revenue recognized = IS contract revenue | needs_wip_schedule | < 0.1% |
| O-005 | Backlog: beginning + new - completed = ending | needs_backlog_schedule | Exact |
| O-006 | Inventory ledger: ending balance = BS inventory | needs_inventory_ledger | Exact |
| O-007 | BOM: raw material cost = COGS material component | needs_bom | < 1% |
| O-008 | Timesheet hours x rates = billed revenue | needs_timesheet_data | < 1% |
| O-009 | Provider production: total collections = IS patient revenue | needs_provider_production | < 0.1% |
| O-010 | Payer mix: sum of payer collections = total collections | needs_payer_mix | Exact |
| O-011 | Store-level P&L: sum of store revenue = total revenue | needs_store_master | < 0.1% |
| O-012 | Comp sales: same-store revenue growth calculation correct | needs_comp_sales | < 0.1% |
| O-013 | Insurance AR aging = BS insurance receivable | needs_payer_mix | < 1% |
| O-014 | Loan tape: outstanding balance = BS loans receivable | needs_loan_tape | Exact |
| O-015 | Route economics: sum of route revenue = total revenue | needs_route_economics | < 0.1% |

## Layer 5: Realism Range Checks

| ID | Rule | Source |
|---|---|---|
| R-001 | KPIs within profile kpi ranges (min/max) | deal_state.profile.kpis |
| R-002 | Customer concentration: top customer 5-30% of revenue | Industry norms |
| R-003 | Top-10 customer concentration: 30-80% of revenue | Industry norms |
| R-004 | Seasonality pattern matches profile seasonality | deal_state.profile.seasonality |
| R-005 | Gross margin within profile range | deal_state.profile.kpis |
| R-006 | Compensation bands plausible by role (CEO $150-500K, analyst $50-90K) | General norms |
| R-007 | Lease escalators: 2-4% annually | Market norms |
| R-008 | Lease terms: 3-15 years | Market norms |
| R-009 | Revenue growth: -10% to +50% YoY (unless seeded event) | General norms |
| R-010 | DSO within profile working_capital_drivers.dso_range | deal_state.profile |
| R-011 | DPO within profile working_capital_drivers.dpo_range | deal_state.profile |
| R-012 | No month with negative revenue (unless seeded) | General norms |
| R-013 | Employee turnover: 5-25% annually | Industry norms |
| R-014 | Management tenure: at least 1 executive with 5+ years | General norms |
| R-015 | Site count consistent with company size | deal_state.profile.size_model |

## Layer 6: Narrative and Legal Document Checks

| ID | Rule | Applies when |
|---|---|---|
| N-001 | CIM: all required sections present (confidentiality, TOC, exec summary, highlights, history, market, products, customers, operations, management, financials, growth, transaction rationale) | Always |
| N-002 | CIM: revenue, margin, headcount, customer count match deal_state | Always |
| N-003 | Accounting policy: revenue recognition method matches revenue_streams.model | Always |
| N-004 | Accounting policy: mentions actual BS accounts from COA | Always |
| N-005 | EBITDA bridge: one-time items match events_timeline | Always |
| N-006 | EBITDA bridge: adjusted EBITDA = reported + adjustments | Always |
| N-007 | Management presentation: executive names/titles match deal_state | Always |
| N-008 | Lease PDFs: rent escalator math correct across term | When leases generated |
| N-009 | Lease PDFs: permitted use clause matches industry | When leases generated |
| N-010 | Lease PDFs: tenant name matches company legal name | When leases generated |
| N-011 | Lease PDFs: premises address matches site list | When leases generated |
| N-012 | Lease PDFs: signature blocks, exhibits, page numbers present | When leases generated |
| N-013 | Litigation summary: events match events_timeline litigation entries | When litigation events seeded |
| N-014 | QoE memo: adjustments match events_timeline one-time items | When realism_mode != clean |
| N-015 | All narrative documents: no claims unsupported by quantitative data | Always |

## Tolerance Reference

| Category | Default tolerance | Rationale |
|---|---|---|
| Balance sheet identity | < $1.00 | Rounding from per-account Decimal arithmetic |
| Revenue ties | < 0.1% | Dirichlet splitting and monthly allocation |
| Aging ties | < 1% | Bucket allocation rounding |
| Payroll ties | < 5% | Salary scaling factor approximation |
| KPI ranges | Within profile min/max | Profile defines acceptable bounds |
| Exact ties | $0.00 | Direct derivation, no rounding path |

When a check fails within tolerance, report as `pass_with_tolerance`. When a check fails outside tolerance, report as `fail`. When `--strict` is set, `pass_with_tolerance` becomes `fail`.

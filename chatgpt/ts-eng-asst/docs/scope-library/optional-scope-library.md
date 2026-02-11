# Optional Scope Library

- Version: `3`
- Runtime default: `excluded`
- Status: `review_required`

Optional scope library for explicit opt-in use. These sections are excluded from default runtime scope.

## Notes

- Phase-2/post-bid support and phase-1 GAAP considerations are intentionally removed from optional scope.
- Deal-packaging, buyer/seller framing, tool/deliverable bundles, and fixed period wording are excluded.

## Suggested User Flow

1. Generate baseline scope using default common plus industry sections.
2. Show optional catalog filtered to common optional sections plus selected industry.
3. Let the user select optional section keys to include.
4. Show before/after scope preview delta for selected optional sections.
5. Persist selected optional section keys for final generation.
6. Regenerate final output with baseline plus selected optional sections only.

## Generalization Decisions

### promoted_to_common_optional

- `spa_analysis`
- `gaap_conversion_assessment`
- `third_party_diligence_bridge_review`
- `locked_box_analysis`

### kept_as_industry_optional

- `tech.arr_drivers`
- `construction.quality_of_earnings`
- `healthcare.location_portfolio_analysis`
- `manufacturing.quality_of_earnings`
- `real_estate.revenue_analysis`
- `real_estate.commitments_and_contingencies`
- `supermarket.quality_of_earnings`
- `supermarket.revenue_analysis`
- `insurance.quality_of_earnings`
- `prof_services.working_capital`

## Common Optional Modules

### `gaap_conversion_assessment`

- (scope.opt.002) If financial results are prepared under a different reporting framework, perform a high-level GAAP conversion assessment, including:
  - Revenue recognition differences, including contract modifications and variable consideration;
  - Capitalization and amortization policy differences (for example: development costs and commissions);
  - Lease and share-based payment differences, where applicable; and
  - Data availability and measurement complexity for potential conversion adjustments.

### `locked_box_analysis`

- (scope.opt.004) If a locked-box mechanism is used, assess locked-box balances and leakage-sensitive items, including:
  - Alignment of locked-box definitions with diligence findings (for example: net debt and working capital interactions);
  - Shareholder-related balances and other potential leakage items; and
  - Reconciliation of locked-box movements to accounting records and supporting schedules.

### `spa_analysis`

- (scope.opt.001) Review draft transaction agreement financial definitions and mechanics, including:
  - Net working capital definitions and adjustment mechanics;
  - Debt and debt-like item definitions and treatment;
  - Consistency of defined terms with diligence findings and historical accounting treatment; and
  - Potential drafting gaps or ambiguities for legal and deal-team review.

### `third_party_diligence_bridge_review`

- (scope.opt.003) If third-party diligence materials or adjustment schedules are available, evaluate EBITDA bridge supportability, including:
  - Reconciliation of adjustment items to the general ledger and supporting schedules;
  - Assessment of recurring versus non-recurring and timing-related effects; and
  - Identification of additional normalization themes not reflected in provided schedules.

## Industry Optional Modules

### `construction`

#### `quality_of_earnings`

- (scope.opt.c001) Assess construction-specific normalization themes, including:
  - Incentive compensation structure changes and payout timing effects;
  - Organizational or operating-model changes affecting run-rate comparability; and
  - Joint venture or consortium economics that may affect normalized earnings and cash flow.

### `healthcare`

#### `location_portfolio_analysis`

- (scope.opt.h001) Obtain location-level performance data to assess portfolio dispersion, including:
  - Same-location versus de novo contribution and ramp profiles;
  - Top and bottom cohort performance drivers; and
  - Mix effects by location type, payor, and service line where available.

### `insurance`

#### `quality_of_earnings`

- (scope.opt.i001) Review investment income and portfolio-related earnings drivers, where applicable, including:
  - Asset allocation, duration, and credit-quality profile of invested assets;
  - Realized and unrealized gains and losses and basis of measurement; and
  - Sensitivity of investment income to interest-rate movements.

### `manufacturing`

#### `quality_of_earnings`

- (scope.opt.m001) Perform manufacturing-focused QoE bridge analysis where additional support is required, including:
  - Reconciliation of key normalization adjustments to source records;
  - Assessment of recurring versus timing-related manufacturing effects (for example: fixed-cost absorption, yield/scrap, and reserve movements); and
  - Cost-bridge impacts from price, volume, mix, and production-efficiency changes.

### `prof_services`

#### `working_capital`

- (scope.opt.p001) Evaluate professional-services billing and collection dynamics, including:
  - Unbilled receivables and cycle time from time entry to invoicing;
  - Retainers and client deposits recorded as deferred revenue or other liabilities; and
  - Disputed billings and write-off trends by service line.

### `real_estate`

#### `commitments_and_contingencies`

- (scope.opt.r002) Inquire about property-specific contingent exposures and obligations, including:
  - Property tax reassessments, appeals, and related reserves; and
  - Environmental compliance and remediation obligations, where applicable.

#### `revenue_analysis`

- (scope.opt.r001) Analyze rental revenue drivers using rent-roll and supporting detail, including:
  - Occupancy, lease maturity schedule, and renewal/termination trends;
  - Base rent versus recoveries (for example: CAM, taxes, insurance, and utilities) and reconciliation to billings where available; and
  - Concessions, abatements, and free-rent effects on reported revenue.

### `supermarket`

#### `quality_of_earnings`

- (scope.opt.s001) Assess supermarket-specific EBITDA quality considerations, including:
  - Vendor allowances, rebates, and promotional funding and timing of recognition versus underlying purchase volume;
  - Shrink, spoilage, and inventory write-down policies and historical trends; and
  - Fuel, pharmacy, and other ancillary margin-volatility drivers, where applicable.

#### `revenue_analysis`

- (scope.opt.s002) Bridge revenue and gross margin by major category and store/channel, considering:
  - Same-store sales drivers (traffic and basket size) versus new store openings and closures;
  - Price versus volume mix and promotional intensity; and
  - Private-label versus branded mix and related margin impacts.

### `tech`

#### `arr_drivers`

- (scope.opt.t001) Reconcile annual recurring revenue (ARR) metrics to reported revenue and deferred revenue, including:
  - Bridge from subscription billing records to financial reporting balances;
  - Treatment of renewals, expansion/contraction, and churn; and
  - Drivers of ARR versus recognized revenue differences.
- (scope.opt.t002) Analyze ARR quality and customer dynamics, including cohort retention and net revenue retention trends by key segment.

## Removed from Optional Catalog

| Industry | Section Key | Rationale |
|---|---|---|
| `hvac` | `phase_2_post_bid_support` | Engagement-phase specific and not reusable optional baseline. |
| `tech` | `phase_1_gaap_considerations` | Removed per request; replaced by generalized common GAAP conversion optional scope. |
| `hvac` | `data_and_analytics` | Tool/deliverable-heavy packaging with low reusable value. |
| `hvac` | `revenue_and_profitability_analysis_da` | Specialized analytics package; low reusable value for baseline optional scope. |
| `hvac` | `customer_base_health_da` | Specialized marketing analytics package with limited FDD scope reuse. |
| `hvac` | `marketing_and_advertising_performance_da` | Specialized analytics package with limited reusable value. |
| `hvac` | `operations_performance_da` | Tool-specific operations analytics package; excluded from optional baseline. |
| `hvac` | `optional_fdd_procedures` | Insurer/lender support and audit-workpaper procedures are situational and out of baseline optional scope. |
| `manufacturing` | `vdd_report_review` | Sell-side/VDD report dependency; replaced by neutral third-party bridge review in common optional scope. |
| `manufacturing` | `normalized_ebitda_bridges` | Period-specific bridge formatting and timeline dependency are not reusable baseline optional content. |
| `manufacturing` | `forecast_and_budget_analysis` | Forecast package review is highly engagement-specific and overlaps with ad hoc model review workflows. |
| `manufacturing` | `budget_vs_actual` | Forecast/outturn package is usually bespoke and should be added case-by-case, not as standard optional text. |
| `manufacturing` | `operational_cost_margin_assessment` | Large consulting workstream, not a lightweight optional scope add-on. |
| `prof_services` | `assistance_with_transaction_documentation` | Consolidated into common SPA analysis optional scope to avoid fragmented legal-definition language. |
| `supermarket` | `assistance_with_transaction_documentation` | Consolidated into common SPA analysis optional scope. |

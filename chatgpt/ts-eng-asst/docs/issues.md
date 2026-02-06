# TS Engagement Assistant — Scope Library Deep Bug Scan (`issues.md`)

## Scan scope

Files reviewed:
- `dist/scope-library.json`
- `dist/scope-review-buckets.json`
- `dist/el-generate.py` (scope insertion behavior)

Goal:
- Identify structural/data-quality issues causing scope redundancy, review friction, and unreliable section-level control.
- Document issue location + implications (no fixes in this document).

---

## Executive summary

- The scope model is structurally valid (no broken section-to-bucket or concept targets), but quality and governance issues are significant.
- Major risks are:
  1. **Excessive default scope volume** in some industries (notably HVAC and manufacturing).
  2. **Section key taxonomy drift** (near-duplicate keys like `audit_work_paper` / `audit_work_papers` / `audit_working_papers`).
  3. **Low alias coverage** for natural-language scope removal.
  4. **Content redundancy** (exact duplicates within and across industry modules).
  5. **Residual mined artifacts / text quality defects** in scope bullet text.

---

## Quantitative findings

- Total distinct section keys: `60`
- Section keys used in exactly one industry module: `42`
- Keys missing from bucket mapping: `0`
- Bucket keys not found in scope library: `0`
- Broken `section_aliases` targets: `0`
- Broken `concept_to_sections` targets: `0`
- Within-section exact duplicate bullets: `2` (both in `manufacturing.working_capital`)
- Exact duplicate bullet texts appearing in 3+ locations: `5` groups
- Density outliers (top-level bullet count):
  - `hvac`: `117`
  - `manufacturing`: `95`
  - median across industries: `36`

---

## Findings (ranked)

## I-001 — Scope volume outliers create default redundancy risk
- Severity: **High**
- Location:
  - `dist/scope-library.json` → `industry_modules.hvac.*`
  - `dist/scope-library.json` → `industry_modules.manufacturing.*`
- Evidence:
  - `hvac` total top-level bullets: `117` (vs median `36`)
  - `manufacturing` total top-level bullets: `95` (vs median `36`)
  - Heavy sections include:
    - `hvac.quality_of_earnings` (27 bullets)
    - `manufacturing.operational_cost_margin_assessment` (12)
    - `manufacturing.commitments_and_contingencies` (11)
    - `manufacturing.working_capital` (10)
- Implications:
  - Generated letters become long and repetitive by default.
  - Scope review usability drops sharply (hard to evaluate what is truly core vs optional).
  - Increases risk of over-scoping and downstream manual cleanup.

## I-002 — Generator includes all industry sections by default with no rarity/priority filter
- Severity: **High**
- Location:
  - `dist/el-generate.py:1152` (`for section in common:`)
  - `dist/el-generate.py:1189` (`nodes = nodes_default + nodes_industry`)
  - `dist/el-generate.py:1206` (`for heading_key, bullets in extra_sections:`)
- Evidence:
  - All common + all industry sections are included unless explicitly excluded.
  - No built-in concept of “core vs uncommon” section defaults.
- Implications:
  - Rare mined sections are promoted to default output.
  - Users must manually prune scope for common deals, adding friction and error risk.

## I-003 — Section-key taxonomy fragmentation (near-duplicates)
- Severity: **High**
- Location:
  - `dist/scope-review-buckets.json:38-40`
  - `dist/scope-library.json:3279`, `3422`, `3667`, `1347`
  - `dist/scope-review-buckets.json:78-79`, `83-84`, `52-53`
- Evidence:
  - Key families with near-duplicate semantics:
    - `audit_work_paper`, `audit_work_papers`, `audit_working_papers`
    - `related_parties`, `related_party_transactions`
    - `supporting_analysis_for_quality_of_earnings`, `supporting_analysis_to_quality_of_earnings`
    - `inventory`, `inventories`
  - Similarity examples:
    - `audit_work_paper` ↔ `audit_work_papers` (`0.97`)
    - `audit_work_papers` ↔ `audit_working_papers` (`0.919`)
- Implications:
  - Harder to reason about canonical section names.
  - Increases maintenance cost across aliases, buckets, and exclusion logic.
  - Higher chance of user exclusion intent mapping to the “wrong sibling” key.

## I-004 — Section alias coverage is sparse for NL removal intents
- Severity: **High**
- Location:
  - `dist/scope-review-buckets.json:103` (`section_aliases`)
- Evidence:
  - `38` section keys have no direct `section_aliases` entry.
  - Missing aliases include many high-value user intents:
    - `audit_work_paper`, `audit_work_papers`, `audit_working_papers`
    - `related_parties`, `related_party_transactions`
    - `work_in_progress`, `work_in_progress_and_backlog`
    - `vdd_report_review`, `phase_2_post_bid_support`, etc.
- Implications:
  - Users must phrase removals close to internal key names.
  - More clarification turns, lower confidence in scope edits.
  - Perceived “assistant ignored my scope instruction” failures.

## I-005 — Exact duplicates within one section (true redundancy)
- Severity: **High**
- Location:
  - `dist/scope-library.json` → `industry_modules.manufacturing.working_capital`
  - Duplicate ID pairs:
    - `scope.249` and `scope.258`
    - `scope.253` and `scope.257`
- Evidence:
  - Same normalized bullet text appears twice in the same section.
- Implications:
  - Direct duplicate output in generated scope.
  - Makes users distrust curation quality.
  - Inflates scope length without adding coverage.

## I-006 — Cross-industry exact duplicate bullets are widespread
- Severity: **Medium**
- Location:
  - Multiple modules in `dist/scope-library.json`
- Evidence (examples with 3+ exact occurrences):
  - “Obtain and read an analysis of Target's accounts payable...” appears in 3 places.
  - “Pending or threatened litigation or investigations” appears in 3 places.
  - “Obtain and read an analysis of Target's accounts receivable...” appears in 3 places.
  - “Summarize and normalize historical working capital...” appears in 3 places.
- Implications:
  - Indicates duplicate maintenance burden and inconsistent normalization.
  - Suggests some industry text could be centralized into common skeleton.

## I-007 — Common vs industry overlap duplication
- Severity: **Medium**
- Location:
  - `dist/scope-library.json`
  - Example: `common_skeleton.operating_expenses` and `industry_modules.healthcare.operating_expenses`
- Evidence:
  - Exact overlap detected:
    - Common `scope.009`
    - Healthcare `scope.089`
- Implications:
  - Redundant bullets can be emitted twice when both common + industry are combined.

## I-008 — Non-core/tool-specific deliverable language appears as default scope
- Severity: **Medium**
- Location:
  - `dist/scope-library.json`:
    - `industry_modules.hvac.data_and_analytics[0]` (`scope.187`)
    - `industry_modules.hvac.revenue_and_profitability_analysis_da[5]` (`scope.193`)
    - `industry_modules.supermarket.supporting_analysis_for_quality_of_earnings[...]` (`scope.375`)
- Evidence:
  - References to `Power BI`, `PowerPoint`, `dashboard`, `data cube`.
- Implications:
  - Scope implies tooling/work products that may not be standard in every engagement.
  - Increases legal/commercial mismatch risk for default-generated letters.

## I-009 — Phase-specific procedure language included as default
- Severity: **Medium**
- Location:
  - `dist/scope-library.json`
  - Examples:
    - `industry_modules.hvac.phase_2_post_bid_support[...]` (`scope.210`, `scope.211`)
    - `industry_modules.tech.revenue_analysis[4]` (`scope.404`)
    - `industry_modules.tech.quality_of_earnings[4]` (`scope.409`)
- Evidence:
  - “Phase I / Phase 2 top-up due diligence” language in default modules.
- Implications:
  - Can overstate engagement scope where phased support was not agreed.
  - Adds unusual clauses users may have to manually remove.

## I-010 — Advisor-specific phrasing leaks into baseline scope text
- Severity: **Medium**
- Location:
  - `dist/scope-library.json`
  - Examples:
    - `industry_modules.manufacturing.quality_of_earnings[0]` (`scope.225`)
    - `industry_modules.manufacturing.vdd_report_review[0]` (`scope.231`)
    - `industry_modules.hvac.data_and_analytics[0]` (`scope.187`)
- Evidence:
  - “sell-side advisor” assumptions embedded in bullet text.
- Implications:
  - Language may be wrong for direct-buy-side workflows or non-VDD contexts.
  - Increases manual legal edits post-generation.

## I-011 — Residual text quality defects (typos/dup words)
- Severity: **Medium**
- Location:
  - `dist/scope-library.json`
  - Examples:
    - `scope.137` (“the the”)
    - `scope.245` (“the the”)
    - `scope.248` (“the the”)
    - `scope.225` (“sell-side due diligence advisor sell-side advisor”)
    - `scope.208` (“customers,etc.” spacing)
- Implications:
  - Visible quality regressions in generated legal appendix text.
  - Undermines confidence in POC output even when logic is correct.

## I-012 — Rare key explosion complicates governance and QA
- Severity: **Medium**
- Location:
  - `dist/scope-library.json` (industry modules)
- Evidence:
  - `42/60` section keys appear in only one industry.
- Implications:
  - Hard to maintain consistency and coverage.
  - Easy for one-off mined artifacts to persist.
  - Alias/bucket/model drift risk rises with every change.

---

## Scope-review-bucket specific observations

1. Bucket mapping integrity is currently good:
   - No missing `section_to_bucket` keys.
   - No extra bucket keys that don’t exist in scope library.
2. Main bucket risk is taxonomy and alias quality, not broken references.
3. Most review friction comes from:
   - near-duplicate key families,
   - sparse aliases for natural-language removals,
   - concept coverage currently focused on debt only.

---

## Appendix A — Key-family collisions

- `audit_work_paper` / `audit_work_papers` / `audit_working_papers`
  - Scope locations:
    - `industry_modules.real_estate.audit_work_paper`
    - `industry_modules.service.audit_work_papers`
    - `industry_modules.supermarket.audit_work_papers`
    - `industry_modules.healthcare.audit_working_papers`
  - Bucket mapping:
    - `dist/scope-review-buckets.json:38-40`

- `related_parties` / `related_party_transactions`
  - Scope locations:
    - `industry_modules.construction.related_parties`
    - `industry_modules.hvac.related_parties`
    - `industry_modules.manufacturing.related_party_transactions`
    - `industry_modules.transportation.related_party_transactions`
  - Bucket mapping:
    - `dist/scope-review-buckets.json:78-79`

- `supporting_analysis_for_quality_of_earnings` / `supporting_analysis_to_quality_of_earnings`
  - Scope locations:
    - `industry_modules.supermarket.supporting_analysis_for_quality_of_earnings`
    - `industry_modules.eyecare.supporting_analysis_to_quality_of_earnings`
    - `industry_modules.tech.supporting_analysis_to_quality_of_earnings`
  - Bucket mapping:
    - `dist/scope-review-buckets.json:83-84`

- `inventory` / `inventories`
  - Scope locations:
    - `industry_modules.eyecare.inventories`
    - `industry_modules.construction.inventory`
    - `industry_modules.healthcare.inventory`
    - `industry_modules.hvac.inventory`
    - `industry_modules.manufacturing.inventory`
    - `industry_modules.transportation.inventory`
    - `industry_modules.retail.inventory`
    - `industry_modules.aerospace.inventory`
  - Bucket mapping:
    - `dist/scope-review-buckets.json:52-53`

---

## Appendix B — Single-industry section keys (governance watchlist)

Keys appearing in exactly one industry module:

- banking: `allowance_for_credit_losses`, `loan_portfolio_and_credit_quality`, `regulatory_capital_and_liquidity`
- insurance: `claims_and_reinsurance`, `underwriting_and_loss_reserves`
- real_estate: `audit_work_paper`, `operating_cash_flow_funds_from_operations`
- healthcare: `audit_working_papers`, `other_assets`, `purchase_and_sale_agreement`, `store_portfolio_analysis`, `waterfall_revenue_analysis`
- hvac: `customer_base_health_da`, `data_and_analytics`, `marketing_and_advertising_performance_da`, `operations_performance_da`, `optional_fdd_procedures`, `phase_2_post_bid_support`, `prepaids_and_other_current_assets`, `revenue_and_profitability_analysis_da`
- manufacturing: `aspe_to_ifrs_us_gaap_assessment`, `budget_vs_actual`, `forecast_and_budget_analysis`, `normalized_ebitda_bridges`, `operational_cost_margin_assessment`, `prepaids`, `vdd_report_review`
- tech: `arr_drivers`, `locked_box`, `phase_1_gaap_considerations`
- construction: `financial_due_diligence`, `prepaid_materials_and_other_assets`
- eyecare: `inventories`, `other_current_assets`, `quality_of_revenue_and_receivables_and_cash_proof`
- service: `prepaid_expenses_and_other_assets`
- prof_services: `budget`, `other_current_assets_liabilities`, `work_in_progress`
- transportation: `other_assets_and_liabilities`
- building: `work_in_progress_and_backlog`
- supermarket: `supporting_analysis_for_quality_of_earnings`

---

## Notes

- This report intentionally does **not** prescribe fixes.
- It documents current-state defects and risk implications so remediation can be prioritized separately.

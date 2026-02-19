# Research: Dental Industry Profile for Data Room Simulator

## Research Questions

- What profile structure and script touchpoints are required to add a new `dental` industry without breaking existing industries?
- Which dental financial and operational metrics are most credible for realistic diligence simulation (pre-LOI and post-LOI)?
- What target-input data points should be represented based on the 123Dentist meeting notes?
- What QA approach can validate that a `dental` profile is consistent with existing generator/verifier behavior?
- What privacy/security expectations should shape simulated-data handling where PHI/PII concerns are in scope?

## Summary

The repo can support a `dental` profile, but it requires script updates beyond adding `profiles/dental.json`: `generate_company.py` CLI choices and metadata maps, `generate_operations.py` industry dispatch/revenue tie logic, and `verify_data_room.py` industry checks dispatch. Existing industries pass end-to-end generation and verification in this environment after installing dependencies in a local virtual environment. The strongest first implementation is a services-based dental profile with dental-specific chart-of-accounts and KPI fields, then a dental-specific operations generator for production, collections, AR aging, provider/hygiene productivity, and schedule/recall indicators directly aligned to the 123Dentist intake pattern. Privacy expectations should align to HIPAA-like safeguards and Canadian PIPEDA principles when simulating PHI/PII workflows.

## Key Points / Options

- **Option A: Fast Proxy (`professional_services`)**: No code changes; fastest path; weaker face-validity for dental-specific diligence signals.
- **Option B: `dental` Profile + Services Operations Generator (Recommended MVP)**: Add `profiles/dental.json`, route `dental` through a services-like operations generator with dental fields. Keeps implementation bounded while adding realistic diligence outputs.
- **Option C: Full Dental Generator + Dental Verifier Checks**: Highest fidelity. Adds dedicated operational documents/checks (hygiene productivity, recall flow, insurance AR composition, provider production-collections tie). More effort, best long-term test realism.

## Recommendations

1. Implement **Option B first**, then iterate to Option C. This gives immediate value with controlled risk.
2. Use a **36-month fixed horizon** enhancement in financial generation so output is exactly `2023-01` through `2025-12` (current logic is anchored to runtime date).
3. Encode the 123Dentist key target-input packet as first-class outputs: production, payroll, monthly TB/GL trend, schedule/recall, benchmark overlays.
4. Add dental-specific verification checks early to avoid plausible-looking but internally weak outputs.
5. Apply PHI/PII safeguards patterns to any pilot workflow artifacts even in synthetic mode (especially if mixed with real target samples later).

## Implementation Outline

1. Add `profiles/dental.json` aligned to existing profile schema.
2. Update industry registration points:
- `scripts/generate_company.py` (`INDUSTRIES`, display metadata maps)
- `scripts/generate_operations.py` (`generators` dispatch and revenue tie branch)
- `scripts/verify_data_room.py` (`industry_checks` dispatch)
3. MVP operations output for dental:
- `practice_master.xlsx`
- `provider_production_monthly.xlsx`
- `hygiene_kpi_monthly.xlsx`
- `insurance_ar_aging.xlsx`
- `appointment_utilization_monthly.xlsx`
- `patient_flow_monthly.xlsx` (new patients, active/inactive, recall)
4. Add verifier checks for dental:
- Provider/hygiene production roll-up ties to TB/P&L revenue.
- Insurance AR aging ties to balance sheet AR.
- Payroll totals tie to salary/comp accounts.
- Schedule utilization and recall rates within configured profile ranges.
5. Add fixed-period option (`--start-period`, `--end-period`) in financial generation for deterministic 36-month datasets.
6. Run QA matrix for all industries plus dental (clean/realistic/messy).

## Comparison

| Option | Effort | Realism for 123Dentist-style DD | Breakage Risk | Time-to-Value |
|---|---|---|---|---|
| A. `professional_services` proxy | Low | Medium-Low | Very Low | Immediate |
| B. Dental profile + services-like generator | Medium | High | Low-Medium | Fast |
| C. Full dental ops + verifier suite | High | Very High | Medium | Moderate |

Recommendation: **Option B now, then Option C in a second pass.**

## Risks & Considerations

- **Hardcoded industry dispatch points**: Adding a profile file alone will fail (`--industry` validation and unknown operations/check dispatch).
- **Date horizon mismatch risk**: Current monthly generation uses runtime date/year; this can miss exact requested windows.
- **Overfitting to one PMS report style**: 123Dentist receives variable formats across many systems; generator should include report-format variability.
- **False confidence from weak checks**: Dental documents should have explicit tie-outs like other industries.
- **Privacy model drift**: If workflows later ingest real examples, security controls must be explicit.

## Codebase Patterns

- Profile-driven model shape is consistent across `profiles/*.json` with keys:
`industry`, `display_name`, `bounds`, `chart_of_accounts`, `documents`, `consistency_rules`, `seasonality_patterns`, `kpis`, `qoe_adjustments`, `departments`.
- Industry registration is hardcoded in:
- `scripts/generate_company.py:39`
- `scripts/generate_operations.py:714`
- `scripts/verify_data_room.py:427`
- Financial generation has fixed account scaffolding and dynamic revenue/COGS/Opex account expansion in `scripts/generate_financials.py:284` and surrounding logic.

## QA Findings (Current Baseline)

Environment QA run executed across all existing industries using `.venv`.

- `saas`: `pass`, checks `22`, failed `0`
- `construction`: `pass`, checks `17`, failed `0`
- `manufacturing`: `pass`, checks `17`, failed `0`
- `professional_services`: `pass`, checks `17`, failed `0`
- `retail`: `pass`, checks `17`, failed `0`

Notes:
- Initial verifier run failed due missing `pandas`; resolved by local virtual environment install.
- `dental` cannot be QA-run yet because `generate_company.py` rejects `--industry dental` until implementation.

## Detailed Analysis

### 1) What to model for dental realism (from notes + external)

Data points to prioritize in generated artifacts:

- Pre-LOI packet:
- Monthly/TTM production and collections summary.
- Practice-level payroll summary (roles, pay rates, associate structure).
- Basic financial statements and trend view.
- Public signal placeholders (ratings/reviews metadata fields).

- Post-LOI packet:
- Monthly TB/GL-level trend data.
- Monthly revenue detail by provider/service stream.
- Monthly payroll detail and tie-outs.
- AR aging with insurance/patient components.

- Operational DD fields:
- Hygiene production per hour benchmark overlay.
- Schedule utilization and fill rate.
- Recall activity and active/inactive patient movement.
- Payer mix and write-off behavior.

### 2) Suggested dental profile skeleton (content, not implementation)

- Revenue accounts:
- Doctor Production
- Hygiene Production
- Ancillary/Other Clinical Revenue

- COGS / direct clinical cost accounts:
- Clinical Staff Compensation (provider + hygiene + assistants as configured)
- Lab Fees
- Dental Supplies

- Opex accounts:
- Front Office/Admin Payroll
- Occupancy (rent/utilities)
- Marketing
- G&A / Professional Fees

- KPI ranges (initial):
- Gross margin target range tuned to match external overhead/net-income signals.
- AR days / aging buckets with explicit >90d monitoring.
- Hygiene production per hour benchmark as configurable field.

### 3) Data governance alignment

- US context: HIPAA Security Rule safeguards (administrative, physical, technical).
- Canadian context: PIPEDA safeguard principle for sensitivity-appropriate protection.
- Practical implication for simulator: maintain synthetic data defaults; isolate any mixed real-sample pilots; document storage/access model.

## Sources

- 123Dentist meeting notes (internal): `/Users/rishi/Library/CloudStorage/OneDrive-KPMG/01 DEALS/123Dentist/Meetings/123Dentist_AI_Diligence_Meeting_Notes_Feb19.docx`
- American Dental Association, HPI dental economy hub: https://www.ada.org/resources/research/health-policy-institute/dental-care-market/q2-2025-state-of-us-dental-economy
- ADA HPI report (Q4 2025 state of dental economy PDF): https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/resources/research/hpi/state_of_the_us_dental_economy_q4_2025.pdf
- ADA HPI report (Income, Gross Billings, and Expenses 2024 PDF): https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/resources/research/hpi/report_income_gross_billings_expenses_2024.pdf
- ADA HPI Practice Modalities 2023 PDF: https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/resources/research/hpi/hpi_practicemodalitiesofprivatepractice_0524.pdf
- ADA “How to purchase with confidence” (practice evaluation and benchmarks): https://www.ada.org/resources/careers/career-planning/how-to-purchase-with-confidence
- Open Dental manual, Production and Income: https://www.opendental.com/manual/productionincome.html
- Open Dental manual, Aging of A/R report: https://www.opendental.com/manual/reportaging.html
- Dentrix Ascend, Aged Receivables Report: https://hsps.pro/DentrixAscend/Help/Aged_Receivables_Report.htm
- HHS HIPAA Security Rule overview: https://www.hhs.gov/ocr/privacy/hipaa/administrative/securityrule/index.html
- NIST SP 800-66 Rev. 2 (2024): https://csrc.nist.gov/pubs/sp/800/66/r2/final
- Office of the Privacy Commissioner of Canada, PIPEDA safeguards interpretation: https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda-compliance-help/pipeda-interpretation-bulletins/interpretations_08_sg/

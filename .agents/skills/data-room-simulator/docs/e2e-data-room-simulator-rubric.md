# E2E Data Room Rubric

## Required Artifacts

- `company_seed.json`
- Core financials: `trial_balance.xlsx`, `income_statement.xlsx`, `balance_sheet.xlsx`, `cash_flow.xlsx`
- Core schedules: `ar_aging.xlsx`, `ap_aging.xlsx`, `nwc_schedule.xlsx`, `fixed_assets.xlsx`
- Operations output set for selected industry
- HR outputs: `employee_census.xlsx`, `payroll_register.xlsx`, `department_summary.xlsx`
- Narratives: `cim.md`, `company_overview.md`, `accounting_policies.md`, `ebitda_bridge.md`
- Packaging: `manifest.json`, `INDEX.md`, `verification_report.json`

## Quality Checks

1. Consistency:
- Verification status is `pass` (or expected fail for strict messy-mode tests).
- No unexpected failed checks.

2. Completeness:
- All required artifacts exist in run directory.
- `manifest.json` enumerates all artifacts.
- `INDEX.md` describes all artifacts.

3. Narrative quality:
- No unresolved template tokens (`{{` / `{%`).
- Company/industry context aligns with generated seed.

4. Mode behavior:
- `clean`: no QoE issues.
- `realistic`: non-zero QoE issues with consistent financial tie-outs.
- `messy`: behaves according to strict/non-strict expectation.

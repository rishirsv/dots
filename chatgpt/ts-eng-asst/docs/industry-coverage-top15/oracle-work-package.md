# Oracle work package: Top-15 operating industries scope curation

This project inserts a Financial Due Diligence (FDD) scope block from `dist/scope-library.json` based on `INDUSTRY`.

## Objective

Improve the initial modules for these new `INDUSTRY` keys:

- `retail`
- `banking`
- `insurance`
- `telecomm`
- `aerospace`
- `building`

## Inputs (provide Oracle these files)

- `dist/scope-library.json` (bundle used in ChatGPT knowledge)
- `reference/fdd_scope_library.json` (flat source of truth used to rebuild v2)
- `docs/scope-library/industries/<industry>.md` (per-industry readable view)
- `docs/mining/audit-verification-results.md` (guardrails: avoid proper nouns and sensitive tooling language)

## Deliverables (per industry)

Provide `industry_modules.<industry_key>` content in the **flat library format** (string bullet lists):

1) A JSON object keyed by section slug, each value a list of bullet strings.
   - Prefer adding bullets under existing common section slugs where possible:
     - `business_overview`, `accounting_overview`, `quality_of_earnings`, `revenue_analysis`, `operating_expenses`,
       `working_capital`, `accounts_receivable`, `accounts_payable_and_accrued_liabilities`,
       `capital_expenditure_requirements`, `commitments_and_contingencies`, `net_debt`
   - Add extra sections only when truly industry-specific and clearly named (snake_case).
2) A short rationale per section (1–3 lines) explaining why those bullets belong.
3) A short alias list (free-text industry phrases) that should map to the industry key (confirmation required).

## Hard constraints

- Do not include client names, project names, or engagement-specific entities.
- Do not include references to proprietary internal tools, brand names, or named datasets.
- Keep wording consistent with existing scope bullets (imperative analysis tasks; colon-parent nesting is OK).


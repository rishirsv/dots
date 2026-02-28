# Verbatim Section Corpus

This corpus is generated only from `extracted/cleaned/*.md` and preserves verbatim section text.

## Deterministic Build

Run from repository root:

```bash
python3 docs/report-mining/section-corpus/scripts/build_section_corpus.py
```

## Outputs

- Reports processed: 23
- Index: `report-index.md`
- Alias map: `section-alias-map.md`
- Canonical section corpus files:
  - `sections/executive-summary.md` (23 report entries)
  - `sections/business-overview.md` (23 report entries)
  - `sections/historical-financial-performance.md` (23 report entries)
  - `sections/qoe-and-earnings-adjustments.md` (23 report entries)
  - `sections/working-capital.md` (23 report entries)
  - `sections/net-debt-and-debt-like-items.md` (23 report entries)
  - `sections/risks-and-red-flags.md` (23 report entries)
  - `sections/open-items-and-data-requests.md` (23 report entries)
  - `sections/summary-financials.md` (23 report entries)
  - `sections/income-statement.md` (23 report entries)
  - `sections/balance-sheet.md` (23 report entries)
  - `sections/cash-flows.md` (23 report entries)
  - `sections/reporting-environment.md` (23 report entries)
  - `sections/related-parties.md` (23 report entries)
  - `sections/industry-analysis.md` (23 report entries)
  - `sections/forecast-trading.md` (23 report entries)
  - `sections/quality-of-net-assets.md` (23 report entries)
  - `sections/gross-margin-by-lob.md` (23 report entries)
  - `sections/appendices.md` (23 report entries)
- Adjustment libraries:
  - `adjustments/qoe-adjustments-library.md` (23 report entries)
  - `adjustments/working-capital-adjustments-library.md` (23 report entries)
  - `adjustments/net-debt-adjustments-library.md` (23 report entries)

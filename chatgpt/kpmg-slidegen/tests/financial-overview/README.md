# Financial Overview Test Data (Apple)

Company: Apple Inc. (`AAPL`, CIK `0000320193`)

Fiscal years covered in extracted statements: FY2025, FY2024, FY2023

Contents:
- `raw/aapl_submissions.json`: SEC submissions feed for Apple.
- `raw/aapl_companyfacts.json`: SEC XBRL company facts JSON.
- `raw/aapl_10k_index_last_few.json`: latest 10-K filing metadata used for year anchoring.
- `formatted/income-statement-aapl-fy3.md` + `.csv`.
- `formatted/balance-sheet-aapl-fy3.md` + `.csv`.
- `formatted/cash-flow-aapl-fy3.md` + `.csv`.
- `transcripts/`: earnings call transcript files and source index.

Note: extracted line items are standardized XBRL concepts from SEC filings (10-K, fp=FY).
# Scenario Input Map

This file maps each manual test scenario to concrete sample input paths.

## Scenario 1 - SEC filing to business overview

- `testing/data/sec/AAPL/annual_metrics.csv`
- `testing/data/sec/AAPL/quarterly_metrics.csv`
- `testing/data/sec/AAPL/recent_filings.csv`

## Scenario 2 - Buy-side CDD baseline

- `testing/data/data_rooms/scenario02-saas-mid-realistic/`

## Scenario 3 - QoE bridge and adjustment story

- `testing/data/data_rooms/scenario03-manufacturing-mid-messy/`

## Scenario 4 - IC-style extensive deck

- `testing/data/data_rooms/scenario04-retail-large-realistic/`
- `testing/data/sec/SBUX/annual_metrics.csv`

## Scenario 5 - Revision and QA regression

- Any generated deck artifacts from Scenario 2, 3, or 4:
  - `<run>/deck-spec.json` (or equivalent deckSpec)
  - `<run>/qa.json`
  - `<run>/deck.pptx`

## How data was generated

```bash
bash testing/scripts/prepare_test_data.sh
```

Or individually:

```bash
python3 testing/scripts/fetch_sec_data.py --ticker AAPL --ticker SBUX --ticker CAT --out-dir testing/data/sec
bash testing/scripts/generate_data_room_samples.sh
```

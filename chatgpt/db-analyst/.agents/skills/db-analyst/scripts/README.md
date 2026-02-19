# Scripts

Internal runner interfaces for deterministic mechanics in `Process-TB` and `Process-lease`.

These scripts are intended to be called by the model runtime (shell/Python capable environments). They are not end-user requirements.

## Primary Runner Entry Points

- `ProcessTB.py`: end-to-end TB pipeline
  - ingest -> map -> trend outputs -> QC -> optional workbook build
- `ProcessLease.py`: lease ingestion/normalization scaffold

## Process-TB Utility Runners

- `ingest_tb.py`: normalize TB input to canonical long form with scale tracking (`amount_raw` + scaled `amount`)
- `apply_coa_mapping.py`: apply mapping with mapping-level fields and sign multiplier status
- `build_is_trend.py`: build statement trend extracts (IS/BS)
- `build_fs_workbook.py`: build/prune workbook outputs and write FS blocks
- `run_qc_checks.py`: run schema, completeness, tie-out, sign, and optional workbook-format checks

## Execution Model

- Model decides accounting logic (mapping, hierarchy, sign assumptions, notes, scope).
- Runners perform repeatable mechanical operations.
- `Control | Setup` is always required for Process-TB outputs.
- Default scaling is thousands (`$'000`, `0.001`); millions (`$mm`, `0.000001`) are supported.
- Actual values are blocked unless explicitly enabled (`--allow-actual`).

## Local Debug Usage

For local debugging, scripts can be run directly with `--help`.

Example end-to-end call:

```bash
python scripts/ProcessTB.py \
  --tb data-room/trial_balance.xlsx \
  --mapping scripts/samples/coa_mapping_process_tb_sample.csv \
  --out-tb /tmp/tb_canonical.csv \
  --out-mapped /tmp/tb_mapped.csv \
  --out-is /tmp/is_output.csv \
  --out-bs /tmp/bs_output.csv \
  --qc-report /tmp/qc.json \
  --out-workbook /tmp/databook_fs.xlsx \
  --scope fs-only
```

## Tests

```bash
python -m unittest dist/scripts/tests/test_process_tb_pipeline.py
```

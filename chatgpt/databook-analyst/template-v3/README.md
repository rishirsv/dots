# Databook Template V3

V3 is a sanitized, deal-agnostic template derived from V2.

## What changed vs V2
- Strips deal-specific content from visible core tabs.
- Clears formulas that reference non-core hidden tabs.
- Removes all legacy non-core hidden tabs from the workbook.
- Preserves North-style visual layout and tab structure.
- Keeps 36-month enforcement on manifest-tagged monthly tabs.

## Files
- `build_databook_template_v3.py`: sanitizes V2 into V3.
- `validate_databook_template_v3.py`: validates deal-agnostic constraints.
- `databook-template-v3.xlsx`: output workbook.
- `reports/v3-sanitization-report.md`: sanitization metrics.

## Build
```bash
/tmp/codex-openpyxl-venv/bin/python build_databook_template_v3.py
```

## Validate
```bash
/tmp/codex-openpyxl-venv/bin/python validate_databook_template_v3.py
```

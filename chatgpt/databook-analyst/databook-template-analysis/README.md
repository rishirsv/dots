# Databook Template Analysis Artifacts

This folder stores the workbook audit generated for `databook-template.xlsx`.

## Files
- `workbook-diagnostics.json`: full machine-readable diagnostics (sheet stats, formula anomaly captures, DV/CF rules).
- `workbook-inventory.txt`: quick human-readable workbook inventory.
- `cleanup-task-outline.md`: prioritized cleanup tasks based on findings and spec alignment.

## Tooling note
Audit was generated using `openpyxl` in an isolated venv at `/tmp/codex-openpyxl-venv`.

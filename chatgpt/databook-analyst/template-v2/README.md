# Databook Template V2 (North-Based)

V2 uses Project North as the visual seed and adds deterministic system scaffolding while keeping team-familiar core tab styling.

## Files
- `build_databook_template_v2.py`: builds `databook-template-v2.xlsx` from North seed.
- `validate_databook_template_v2.py`: validates visibility, manifest 36-month enforcement, formula policy, and workbook hygiene.
- `seeds/north-master-seed.xlsx`: pinned seed workbook used by builder.
- `contracts/north_style_contract.json`: extracted style/token contract snapshot.
- `contracts/north_anchor_contract.json`: anchor style/value contract snapshot.
- `reports/north-fidelity-diff.md`: generated fidelity diff report versus seed anchors.

## Build
```bash
/tmp/codex-openpyxl-venv/bin/python build_databook_template_v2.py
```

## Validate
```bash
/tmp/codex-openpyxl-venv/bin/python validate_databook_template_v2.py
```

## Notes
- Core visible tabs retain North naming and layout patterns.
- Non-core legacy tabs are hidden (not deleted) to avoid breaking legacy references.
- Monthly manifest-tagged tabs are forced to 36 periods with contiguous `EDATE` headers.

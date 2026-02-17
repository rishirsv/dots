# Databook Template v1

This folder contains the implemented Databook Analyst v1 template and tooling.

## Files
- `build_databook_template_v1.py`: deterministic template builder.
- `validate_databook_template_v1.py`: conformance validator.
- `databook-template-v1.xlsx`: generated workbook artifact.

## Build
```bash
python build_databook_template_v1.py
```

## Validate
```bash
python validate_databook_template_v1.py
```

## Notes
- The planned tab `Other_Analysis|Revenue_By_Customer_Group` exceeds Excel's 31-character limit, so it is implemented as `Other_Analysis|Revenue_By_Cust`.
- The template enforces no spaces in tab names, hidden `_Sys|*` tabs, standardized `Comments` header, and `XLOOKUP` over legacy lookup patterns.

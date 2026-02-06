# Template (kpmg-diligence)

This folder contains the source template PPTX and the generated wrapper files used by the generator.

## Generated files (do not hand-edit)

- `templates/kpmg-diligence/template.js`
- `templates/kpmg-diligence/template.json`

## Regenerate wrapper

```bash
npm run template:generate
```

## Where changes go

- If the PPTX template changes: update files in `templates/kpmg-diligence/` and re-run `npm run template:generate`
- If generation output drifts: update builders/tokens in `generator/`

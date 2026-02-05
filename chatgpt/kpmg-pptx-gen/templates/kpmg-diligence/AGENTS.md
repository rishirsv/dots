# Template (kpmg-diligence)

This folder contains the source template PPTX and the generated wrapper files used by the generator.

## Generated files (do not hand-edit)

- `template.js`
- `template.json`

## Regenerate wrapper

```bash
cd templates/kpmg-diligence
npm run template:generate
```

## Where changes go

- If the PPTX template changes: update files in this folder and re-run `npm run template:generate`
- If generation output drifts: update builders/tokens under `generator/`

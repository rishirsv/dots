# kpmg-diligence (Template Project)

This folder is a self-contained generator project for the **KPMG diligence** PowerPoint template.

## What’s here

- `Diligence+ Reporting Template_Widescreen v2.1.pptx`: source PPTX (visual source of truth)
- `template.js` / `template.json`: generated wrapper + metadata (do not hand-edit)
- `assets/`: template-owned images + embedded asset sources
- `generator/`: template-local Node runtime (builders, tokens, strict checks)
- `samples/`: example input deck JSON specs
- `references/`: small baselines (optional)
- `outputs/`: throwaway run artifacts (gitignored)

## Quick start

```bash
cd templates/kpmg-diligence
npm install
node generator/validate.js --in samples/demo.json
node generator/index.js --in samples/demo.json --out outputs/runs/manual/demo/deck.pptx
```

Strict checks (missing required fields, overlaps, out-of-bounds) run by default. Use `--no-strict` to disable.


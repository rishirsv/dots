# Generator (Node/PptxGenJS)

This folder contains the deck generator runtime and slide builders.

## Quick commands

Generate a deck into a timestamped run folder:

```bash
RUN_ID=$(date +%Y-%m-%d_%H%M%S)
OUT_DIR=outputs/runs/$RUN_ID/nvidia
mkdir -p "$OUT_DIR"
node generator/index.js --in samples/v1-nvidia-v2.json --out "$OUT_DIR/deck.pptx"
```

## Styling + defaults

- Central tokens: `generator/tokens.js`
- Titles/bullets helpers: `generator/helpers/`
- Builders: `generator/builders/`
- Pagination (prevent overlap): `generator/runtime/paginate.js`

## Safety

- Prefer updating tokens/builders over one-off slide fixes.
- Treat `templates/kpmg-diligence/template.js` as generated output.

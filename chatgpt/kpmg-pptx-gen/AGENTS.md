# Repository Guidelines (kpmg-pptx-gen)

This repo compiles a PowerPoint template into a code‑encoded `PptxGenJS` template, then fills it from JSON to generate decks with strict-by-default inspection (missing required fields, overlaps, out-of-bounds).

## Scope

- In scope: extractor + template codegen, per-template generator/builders, sample data, strict inspection tooling, docs.
- Out of scope: committing large binary outputs (PPTX) unless explicitly requested as baselines.

## Quick Commands

- Generate template wrapper (regenerates `templates/kpmg-diligence/template.js` and `templates/kpmg-diligence/template.json`):
  - `cd templates/kpmg-diligence && npm run template:generate`
- Generate a deck:
  - `cd templates/kpmg-diligence && RUN_ID=$(date +%Y-%m-%d_%H%M%S); OUT_DIR=outputs/runs/$RUN_ID/nvidia; mkdir -p "$OUT_DIR"; node generator/index.js --in samples/v1-nvidia-v2.json --out "$OUT_DIR/deck.pptx"`
- Run tests:
  - `python3 -m unittest`

## Safety Boundaries

- Treat `templates/kpmg-diligence/template.js` as generated: edit `extractor/codegen.py` and re-run `templates/kpmg-diligence`’s `template:generate` script.
- Keep core extraction logic stdlib‑first on Python.

## More Detail

- Spec: `docs/SPEC.md`
- Project plan: `docs/PROJECT-PLAN.md`
- Generator notes: `templates/kpmg-diligence/generator/AGENTS.md`
- Template notes: `templates/kpmg-diligence/AGENTS.md`

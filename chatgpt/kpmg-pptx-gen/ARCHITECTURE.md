# kpmg-pptx-gen — Architecture

This repo generates brand-compliant PowerPoint decks from structured JSON by extracting a source PPTX template into a code-encoded wrapper, then filling that wrapper with content and producing strict inspection artifacts (missing required fields, overlaps, out-of-bounds).

## System boundaries

- In scope: template extraction + codegen, per-template deck generation/builders, sample inputs, strict inspection tooling, baseline references.
- Out of scope: committing large generated artifacts (PPTX) unless explicitly intended as baselines.

## Project overview

Plain-language model:

- A PowerPoint template contains the “look” (masters, fonts, colors, layout boxes).
- The extractor reads that template and produces two generated files:
  - `template.json` (tokens + layout metadata)
  - `template.js` (a PptxGenJS wrapper that wires masters and builders together)
- The generator reads a deck JSON file and produces a new PPTX that matches the template style.
- Strict inspection writes reports next to the PPTX output (JSON + a short markdown summary).

Core loop:

1. Update template PPTX (if needed)
2. Regenerate wrapper (`template.js` / `template.json`)
3. Generate a deck PPTX from a JSON spec
4. Review strict inspection artifacts and spot-check the PPTX

## Repository layout

```text
kpmg-pptx-gen/
  extractor/                 # Python: PPTX parsing + template extraction/codegen
  templates/                 # Per-template projects (each has generator/ + samples/ + references/)
  dist/                      # Downstream “releases” (portable bundles)
  docs/                      # Spec + project plan
```

## Stack

- Runtime/tooling: Node.js, Python 3
- Library: PptxGenJS (deck generation)
- Tests: `python3 -m unittest`

## Key files (what to read first)

- `docs/SPEC.md` — current spec (what the repo is supposed to do)
- `docs/PROJECT-PLAN.md` — current plan (what we’re improving next)
- `cli.py` — entrypoint for template extraction/codegen
- `templates/kpmg-diligence/template.js` — generated wrapper used to create decks
- `templates/kpmg-diligence/generator/index.js` — deck generation CLI entrypoint
- `templates/kpmg-diligence/generator/tokens.js` — typography/colors/layout defaults
- `templates/kpmg-diligence/generator/builders/` — slide builders (content → PptxGenJS primitives)

## Architecture views

### Building blocks (static map)

```mermaid
flowchart LR
  A[templates/.../*.pptx] --> B[extractor (Python)]
  B --> C[templates/.../template.json]
  B --> D[templates/.../template.js]
  E[templates/.../samples/*.json] --> F[templates/.../generator (Node/PptxGenJS)]
  C --> F
  D --> F
  F --> G[outputs/.../*.pptx]
  G --> H[outputs/.../inspect/*.json + inspection_report.md]
```

### Runtime scenarios

1) Regenerate the template wrapper
- Entry point: `cd templates/kpmg-diligence && npm run template:generate` (invokes `cli.py` / extractor codegen)
- Result: overwrites `templates/kpmg-diligence/template.js` and `templates/kpmg-diligence/template.json`

2) Generate a deck from JSON
- Entry point: `cd templates/kpmg-diligence && node generator/index.js --in <deck.json> --out <deck.pptx>`
- Steps:
  - Validate deck spec (`generator/validate.js`)
  - Build PPTX via generated wrapper + builders
  - Write PPTX and strict inspection artifacts under `outputs/`

## Architecture decisions

| Decision | Why | Tradeoffs |
|---|---|---|
| Use PptxGenJS for generation | Predictable, scriptable deck generation | Some PowerPoint behaviors (autofit, advanced layout) aren’t perfectly reproducible |
| Keep `template.js` generated | Template updates should flow from PPTX → code, not hand edits | Requires disciplined regen workflow |
| Treat `outputs/` as throwaway | Repo stays shareable; artifacts don’t bloat git | Need a clear “run folder” convention to find latest outputs |
| Prefer pagination over autoshrink | Consistent typography; avoids unreadable dense slides | Needs good heuristics to avoid awkward splits |

## Verification

- Regenerate template wrapper:
  - `cd templates/kpmg-diligence && npm run template:generate`
- Generate a deck:
  - `cd templates/kpmg-diligence && RUN_ID=$(date +%Y-%m-%d_%H%M%S); OUT_DIR=outputs/runs/$RUN_ID/nvidia; mkdir -p \"$OUT_DIR\"; node generator/index.js --in samples/v1-nvidia-v2.json --out \"$OUT_DIR/deck.pptx\"`
- Generate a deck without strict checks:
  - `cd templates/kpmg-diligence && node generator/index.js --in samples/v1-nvidia-v2.json --out outputs/runs/manual/nvidia/deck.pptx --no-strict`

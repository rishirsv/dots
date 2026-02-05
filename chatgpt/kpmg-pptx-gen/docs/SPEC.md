# KPMG PPTX Generator — Specification

**Last updated:** 2026-02-05

## What this repo does

This repo generates **brand-compliant PowerPoint decks** from structured JSON by:

1) **Extracting** a source PPTX template into a code-encoded wrapper (`template.js`) + metadata (`template.json`)
2) **Generating** a new PPTX by filling that wrapper from a deck JSON spec
3) **Producing strict inspection artifacts** (missing required fields, overlaps, out-of-bounds) next to the generated PPTX

## Non-goals

- Editing PPTX XML directly during generation (generation is PptxGenJS-driven)
- Committing large generated artifacts (PPTX) to git, except intentional baselines

## Source of truth

- Template visuals and brand rules live in: `templates/kpmg-diligence/`
- Generated wrapper outputs (do not hand-edit):
  - `templates/kpmg-diligence/template.js`
  - `templates/kpmg-diligence/template.json`
- Content inputs live in: `templates/<template>/samples/`

## High-level architecture

```mermaid
flowchart LR
  A[Template PPTX] --> B[Extractor (Python)]
  B --> C[template.json]
  B --> D[template.js (generated wrapper)]
  J[Content JSON] --> E[Generator (Node/PptxGenJS)]
  C --> E
  D --> E
  E --> O[Output PPTX]
  O --> Q[Inspect: strict-summary + overlap/bounds reports]
```

## Output policy

- `templates/<template>/outputs/` is a **throwaway workspace** for generated artifacts.
- Baselines (if any) should be kept separate and clearly named under `templates/<template>/references/baselines/`.

## Deck JSON (current expectations)

The generator accepts a deck spec shaped like:

- `title`, `meta` (optional)
- `slides[]` with:
  - `type` (maps to a builder)
  - `title` (optional per layout)
  - `strapline` (optional)
  - content fields per type (bullets, table model, chart model, etc.)

Validation is enforced in `generator/validate.js`.

## Slide types (current)

The set evolves, but today the repo supports a practical subset used by the NVIDIA sample deck:

- `cover`
- `divider`
- `oneColumnText`
- `twoColumnText` / `twoColumnTextWithStrapline`
- `analysisNarrowTable` (table + right-side narrative)
- `analysisWideChart2ColsText`
- `analysisWideChartTableText`
- `titleStrapline4TextBoxes`
- `backCover`

## Styling rules (current)

This repo targets a “Project North”-style diligence look:

- Font family: **Arial** (headings use bold weight)
- Slide title: **40pt** (some layouts use a slightly condensed title size)
- Section heading: **24pt**
- Body text: **9pt**, with standard paragraph spacing
- Bullets: PowerPoint-standard hanging indent + spacing (see `generator/tokens.js`)
- Charts: white chart/plot backgrounds, template palette colors

The single source of truth for these defaults is `templates/<template>/generator/tokens.js`.

## Strict mode (default-on)

Strict checks run by default during generation:

- Missing required field reporting (required slots per slide type)
- Overlap detection (JS-only; analyzes PptxGenJS slide objects)
- Out-of-bounds detection (JS-only; flags elements extending beyond slide dimensions)

Example:

```bash
cd templates/kpmg-diligence
node generator/index.js --in samples/v1-nvidia-v2.json --out outputs/runs/manual/nvidia/deck.pptx
```

To disable strict checks:

```bash
cd templates/kpmg-diligence
node generator/index.js --in samples/v1-nvidia-v2.json --out outputs/runs/manual/nvidia/deck.pptx --no-strict
```

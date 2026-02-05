# Project Plan

**Last updated:** 2026-02-05

## Goal

Generate brand-compliant diligence decks from JSON that look like a real FDD report (Project North level), with a clean workflow and regression-safe inspection (strict checks + baselines).

## Current architecture

```mermaid
flowchart LR
  A[Template PPTX] --> B[Extractor (Python)]
  B --> C[template.json]
  B --> D[template.js (generated wrapper)]
  J[Content JSON] --> E[Generator runtime (Node/PptxGenJS)]
  C --> E
  D --> E
  E --> O[Output PPTX]
  O --> Q[Inspect: strict reports]
```

## What “done” looks like

- Updating the template PPTX and regenerating `template.js`/`template.json` does not break deck generation
- Deck generation does not overlap text (pagination beats autoshrink)
- Styling defaults are centralized and reusable across templates (tokens, masters, builder conventions)
- Strict inspection artifacts are written next to the PPTX in a clean run folder

## Workstreams (next)

### 1) Workflow + repo hygiene

- Standardize output locations:
  - Generated artifacts always go to `templates/<template>/outputs/runs/<run_id>/<deck_name>/...`
- Keep baselines separate:
  - `templates/<template>/references/baselines/pptx/`
- Add a simple cleanup command/convention:
  - prune old runs, keep last N

### 2) Template-driven geometry and masters

- Expand geometry extraction so `template.json` drives layout consistently
- Standardize master selection per slide type so “chrome” stays consistent
- Keep builders “content-agnostic”: no special cases for specific decks/slides

### 3) Table + chart parity (Project North style)

- Tables:
  - Prefer native tables placed in a predictable half-slide region with narrative on the other half
  - Ensure selective bolding/weights match real diligence decks (avoid “everything bold”)
- Charts:
  - Keep chart and plot backgrounds white
  - Use the template palette and avoid “default PowerPoint” chart feel (axes/labels/legend)

### 4) Text density + pagination

- Improve pagination heuristics so dense slides split cleanly into continuation slides
- Ensure numbered lists and bullets match PowerPoint paragraph settings everywhere

### 5) Regression inspection

- Maintain a small set of baseline decks per template
- Keep strict inspection reports easy to generate and review

## Daily workflow (recommended)

1) Update `templates/kpmg-diligence/...` if needed
2) Regenerate template wrapper: `cd templates/kpmg-diligence && npm run template:generate`
3) Generate deck into a run folder (see `templates/kpmg-diligence/generator/AGENTS.md`)
4) Review `outputs/.../inspect/inspection_report.md` and spot-check the PPTX

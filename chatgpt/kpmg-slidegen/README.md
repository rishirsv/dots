# KPMG Slide Generator (Plain-English Guide)

This project turns structured slide input into KPMG-style PowerPoint decks using a deterministic generator.

## What this system does

- You provide a `deckSpec` (what slides you want and what content goes in each slot).
- The renderer applies the KPMG Diligence+ layout package (tokens, geometry, assets, masters).
- The system produces two outputs every run: a `.pptx` and a `.qa.json` report.

## Simple end-to-end flow

1. Read the template package (`tokens`, `layouts`, and assets manifest).
2. Validate each slide against strict slot rules and density thresholds.
3. Auto-paginate long text/table content to avoid collisions.
4. Render each slide with the correct builder and master chrome.
5. Run QA diagnostics (including overlap checks by default).
6. Save `deck.pptx` and `deck.qa.json`.

## Core file tree (clean view)

```text
/Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen
├─ generator/
│  ├─ index.js
│  ├─ validate.js
│  ├─ tokens.js
│  ├─ runtime/
│  │  ├─ render-deck.js
│  │  ├─ paginate.js
│  │  ├─ template-package.js
│  │  ├─ template-roots.js
│  │  └─ diagnostics.js
│  ├─ strict/
│  │  └─ overlap.js
│  ├─ scripts/
│  │  ├─ build-template-package.js
│  │  └─ build-layout-catalog-spec.js
│  ├─ helpers/
│  │  ├─ title.js
│  │  ├─ text.js
│  │  ├─ bullets.js
│  │  ├─ chart.js
│  │  ├─ geometry.js
│  │  ├─ footer.js
│  │  ├─ media.js
│  │  └─ svg.js
│  └─ builders/
│     ├─ cover-slide.js
│     ├─ contents-slide.js
│     ├─ divider-slide.js
│     ├─ summary-financials.js
│     ├─ analysis-wide-chart-text.js
│     ├─ analysis-narrow-table.js
│     ├─ two-column-text.js
│     ├─ one-column-text.js
│     ├─ title-strapline-4-boxes.js
│     ├─ profit-loss-overview.js
│     └─ back-cover-slide.js
├─ templates/
│  ├─ kpmg-diligence/package/
│  │  ├─ tokens.json
│  │  ├─ layouts.json
│  │  └─ assets/manifest.json
│  └─ diligence-plus/runtime/masters.ts
├─ schemas/
│  ├─ deckSpec.schema.json
│  ├─ contentPack.schema.json
│  ├─ deckPlan.schema.json
│  └─ qaReport.schema.json
└─ renderer/
   ├─ validate.ts
   ├─ density.ts
   └─ qa.ts
```

## File-by-file guide

### `generator/index.js`

- This is the main command-line entry point used to generate decks.
- It validates input, renders the deck, runs QA checks, and writes output files.
- It now runs overlap checks by default and supports `--skip-overlap` when needed.

### `generator/validate.js`

- This is the standalone validator command for quick preflight checks.
- It loads the template package and validates a `deckSpec` without writing a deck.
- It is useful in CI when you want to fail fast before rendering.

### `generator/tokens.js`

- This centralizes core style defaults (fonts, colors, sizes, chart palette).
- Builders read these tokens so styling stays consistent across slide types.
- Body text is now standardized to Arial 10.

### `generator/runtime/render-deck.js`

- This is the runtime “brain” that maps each slide type to the right builder.
- It enforces strict, type-aware slot validation and density scoring before render.
- It also controls master selection, deterministic page numbering, and QA payload assembly.

### `generator/runtime/paginate.js`

- This file splits content deterministically when text or tables are too long.
- It avoids overlap by creating continuation slides in predictable ways.
- It records pagination decisions and overflow events for the QA report.

### `generator/runtime/template-package.js`

- This loader reads generated template package JSON data from disk.
- It resolves assets through the manifest instead of hardcoded base64 blobs.
- It gives runtime code a single, stable object for tokens/layouts/assets.

### `generator/runtime/template-roots.js`

- This holds helper logic for locating template roots and asset directories.
- It keeps path resolution consistent across local scripts and runtime use.
- It helps avoid hardcoded relative path mistakes.

### `generator/runtime/diagnostics.js`

- This tracks warnings, missing slots, and fallback events during generation.
- It gives structured diagnostics that feed into `deck.qa.json`.
- It keeps QA collection separate from rendering logic.

### `generator/strict/overlap.js`

- This inspects rendered slide objects to detect overlap and containment risk.
- It classifies issues and returns summary counts for reporting.
- It now runs by default in generation flows unless explicitly skipped.

### `generator/scripts/build-template-package.js`

- This script builds the template data package from canonical template sources.
- It emits data-first outputs like `tokens.json`, `layouts.json`, and asset manifest references.
- It keeps runtime code stable by regenerating data, not runtime logic.

### `generator/scripts/build-layout-catalog-spec.js`

- This script generates a deck spec containing all supported slide layouts.
- It is mainly for visual catalog/testing runs and layout QA.
- It helps quickly compare current generator output vs template expectations.

### `generator/helpers/title.js`

- This helper renders slide titles in a consistent visual style.
- It centralizes title spacing/format behavior used by multiple builders.
- It reduces repeated code in layout-specific files.

### `generator/helpers/text.js`

- This helper sanitizes text and calculates practical text box behavior.
- It provides reusable text-height and line-wrap safety utilities.
- It helps builders avoid accidental overflow and bad formatting.

### `generator/helpers/bullets.js`

- This helper transforms raw bullet input into PowerPoint text runs.
- It supports consistent bullet styling and mixed run behavior.
- It keeps bullet rendering predictable across all text-heavy slides.

### `generator/helpers/chart.js`

- This helper contains chart-related utility logic and color decisions.
- It standardizes chart label/color behavior used by chart builders.
- It avoids duplicated chart setup logic.

### `generator/helpers/geometry.js`

- This helper validates and clamps geometry boxes to safe layout bounds.
- It prevents invalid template-extracted geometry from breaking slides.
- It supports fallback handling when extracted positions are incomplete.

### `generator/helpers/footer.js`

- This helper stores footer safety constants and shared footer logic.
- Pagination and builders use it to keep content above footer chrome.
- It reduces footer collisions and keeps layout output cleaner.

### `generator/helpers/media.js`

- This helper normalizes image/media sources before insertion.
- It supports consistent handling of local path-based assets.
- It keeps media rendering logic centralized.

### `generator/helpers/svg.js`

- This helper converts SVG files into compatible data URIs where needed.
- It supports legacy template paths and logo handling.
- It keeps SVG conversion out of builder-specific code.

### `generator/builders/cover-slide.js`

- Builds the cover slide using the Diligence+ cover geometry and assets.
- Renders title/subtitle with cover-specific placement and styling.
- Handles cover image/logo behaviors consistently.

### `generator/builders/contents-slide.js`

- Builds the table-of-contents slide from section blocks.
- Supports section number/title/page range/item lists.
- Matches the expected two-row contents grid style.

### `generator/builders/divider-slide.js`

- Builds section divider slides for dark and light variants.
- Uses the appropriate background/gradient and text colors by variant.
- Supports section numbering and section title placement.

### `generator/builders/summary-financials.js`

- Builds the summary financials slide and scaffold variant.
- Supports KPI cards, strapline, and summary chart region.
- Encodes the baseline “summary page” look for repeatable outputs.

### `generator/builders/analysis-wide-chart-text.js`

- Builds the wide-chart analysis slide families.
- Supports both chart + two-column text and chart + table + text layouts.
- Reuses common chart/text patterns so behavior is consistent.

### `generator/builders/analysis-narrow-table.js`

- Builds the analysis slide with a narrow table and commentary area.
- Handles dense table rendering with practical defaults.
- Includes layout-safe behavior for large tables.

### `generator/builders/two-column-text.js`

- Builds two-column text slides with optional strapline.
- Handles column fallback geometry when extracted boxes are weak.
- Uses text safety helpers to reduce overlap risk.

### `generator/builders/one-column-text.js`

- Builds one-column text slides, including QoE-style narrative pages.
- Supports strapline + body bullet text flows.
- Uses footer-safe bounds to reduce collisions with chrome.

### `generator/builders/title-strapline-4-boxes.js`

- Builds the four-column text box layout under a title + strapline.
- Applies consistent column handling and fallback geometry.
- Keeps this frequently reused structure deterministic.

### `generator/builders/profit-loss-overview.js`

- Builds the Profit & Loss overview scaffold layout.
- Supports strapline, summary chart area, table area, heading bar, and notes.
- Provides placeholders when chart/table content is missing.

### `generator/builders/back-cover-slide.js`

- Builds the closing/back-cover slide with gradient and disclaimer content.
- Applies final-page text styles and placement rules.
- Keeps ending slide output brand-consistent.

### `templates/kpmg-diligence/package/tokens.json`

- Data-only design tokens extracted for runtime use.
- Stores fonts, colors, dimensions, and style primitives.
- Runtime reads this instead of hardcoding style constants.

### `templates/kpmg-diligence/package/layouts.json`

- Data-only layout catalog with slot contracts and geometry.
- Defines slide types, required slots, density targets, and master mappings.
- This is the contract runtime validation and rendering follow.

### `templates/kpmg-diligence/package/assets/manifest.json`

- Data-only map of asset keys to file paths.
- Keeps runtime references clean and review-friendly.
- Avoids embedding large base64 assets in source code.

### `templates/diligence-plus/runtime/masters.ts`

- Defines richer master chrome variants and shared footer/header elements.
- Documents the intended master model for runtime parity work.
- Acts as the TypeScript reference for master behavior.

### `schemas/deckSpec.schema.json`

- Formal schema for deck specs the renderer accepts.
- Defines slide shape, required fields, and content object types.
- Helps enforce stable contracts between orchestration and rendering.

### `schemas/contentPack.schema.json`

- Formal schema for structured content packs before deck assembly.
- Defines slide content payload shape and slot value expectations.
- Helps keep ingest and composition predictable.

### `schemas/deckPlan.schema.json`

- Formal schema for narrative and slide-type planning output.
- Defines required planning fields (`title`, `type`, `intent`) per slide.
- Keeps planning contracts aligned with renderable layout types.

### `schemas/qaReport.schema.json`

- Formal schema for `deck.qa.json` output.
- Defines density findings, slot issues, repair suggestions, and QA metadata.
- Makes QA output machine-checkable and consistent.

### `generator/scripts/check-slot-contract-sync.js`

- Contract sync checker that compares schema contracts with template layout contracts.
- Fails fast on type enum drift and required-slot drift between `schemas/*` and `templates/.../layouts.json`.
- Should be run after any layout/slot/schema edits to keep one effective source of truth.

### `renderer/validate.ts`

- TypeScript validator module that mirrors strict runtime validation rules.
- Performs type-aware slot validation and emits structured issues.
- Produces repair suggestions that orchestration can act on.

### `renderer/density.ts`

- TypeScript density scoring module with explicit status labels.
- Classifies slides as `OK`, `thin but acceptable`, or `too sparse...`.
- Gives deterministic thresholds so sparse content is easy to flag.

### `renderer/qa.ts`

- TypeScript QA helper module for repair hooks and deduping.
- Turns issues and overflow events into actionable remedy suggestions.
- Keeps QA guidance consistent and reusable.

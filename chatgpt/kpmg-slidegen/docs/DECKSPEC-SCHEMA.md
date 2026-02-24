---
owner: kpmg-slidegen maintainers
status: active
last-reviewed: 2026-02-23
review-cycle-days: 30
source-of-truth: docs/DECKSPEC-SCHEMA.md
verification-state: verified-against-template-layouts
---

# DeckSpec Schema and Authoring Guide

This guide is the single human-readable contract for writing `deckSpec` JSON that is both:

- Valid for the runtime validator.
- Effective for producing polished, client-ready slides.

Use this together with:

- Machine-readable slots schema: `docs/DECKSPEC-SLOTS-SCHEMA.json`
- Model authoring playbook: `docs/DECK-AUTHORING-PLAYBOOK.md`

## Quick answers

1. Can any slide include a `chart` object?
No. Only slide types whose slot contract includes `chart` will render charts.

2. Does the renderer infer chart type from body text?
No. It renders exactly what is provided in `chart.type`, `chart.data`, and `chart.opts`.

3. Are combo/dual-axis charts first-class in this contract?
No. This schema currently supports one chart object with one `type` per chart slot.

4. Can I include extra fields not listed for a slide type?
You can include them, but they are not guaranteed to render. Author against slot contracts only.

## Runtime model

The generator takes a typed `deckSpec` JSON and produces:

- a branded `.pptx`
- a consolidated QA `.json`
- optional postprocess outputs (preview PNGs, montage PNG, visual-overflow diagnostics)

Reference: `README.md`.

## Top-level deck structure

## Required top-level fields

- `slides`: array of slide objects.

## Optional top-level fields

- `metadata`: document metadata and footer defaults.

## `metadata` fields

- `title`: string
- `author`: string
- `company`: string
- `subject`: string
- `allowSparse`: boolean
- `year`: number
- `jurisdiction`: string
- `legalStructure`: string
- `documentClassification`: string
- `officeContactText`: string
- `footer`: object with explicit footer values

## `metadata.footer` fields

- `year`: number
- `legalEntityName`: string
- `jurisdiction`: string
- `legalStructure`: string
- `documentClassification`: string
- `officeContactText`: string

## Minimal valid deck

```json
{
  "metadata": {
    "title": "Example Deck",
    "author": "KPMG LLP",
    "company": "KPMG LLP",
    "subject": "Due Diligence"
  },
  "slides": [
    {
      "type": "cover",
      "title": "Financial Due Diligence",
      "subtitle": "Target Co - February 2026"
    },
    {
      "type": "dividerDark",
      "sectionNumber": "01",
      "sectionTitle": "Executive Summary"
    },
    {
      "type": "analysisWideChart2ColsText",
      "title": "Key Findings and Trend Validation",
      "strapline": "Headline takeaway in one concise line.",
      "bodyStyle": "paragraphs",
      "body": [
        { "text": "Context", "subheader": true },
        "Narrative text explaining what the chart proves."
      ],
      "chart": {
        "type": "bar",
        "data": [
          { "name": "Revenue", "labels": ["FY24", "FY25"], "values": [60.9, 130.5] }
        ],
        "opts": { "showValue": true },
        "source": "Source: Company filings"
      }
    }
  ]
}
```

## Reusable slot shapes

## `text`

- Plain string.

## `textArray`

- Array of:
  - strings
  - or text objects in shape `{ "text": "..." }`
- `textArray` objects can include inline body heading flags:
  - `{ "text": "Basis of presentation", "subheader": true }`
  - `{ "text": "Basis of presentation", "header": true }`

Both forms render as inline blue bold body headings above surrounding text.

## `bodyStyle`

- `"bullets"` or `"paragraphs"`
- Applies to text-array body rendering in supported slide types.

## `table`

- Object with:
  - `headers`: array
  - `rows`: array of arrays
- Optional `title` or `heading` can be used by table renderers that expose title bars.

Example:

```json
{
  "headers": ["Metric", "FY2024", "FY2025", "FY2026E"],
  "rows": [
    ["Revenue", "$142M", "$189M", "$225M"],
    ["Gross Margin", "41.8%", "43.1%", "42.4%"]
  ]
}
```

## `chart`

- Object with:
  - `type`: one of `bar`, `bar3d`, `line`, `pie`, `doughnut`, `area`, `scatter`, `radar`
  - `data`: array of chart series
- Each series should include:
  - `values`: numeric array (required by validator)
  - `labels`: category labels (strongly recommended)
  - `name`: series name (recommended)
- Optional:
  - `opts`: chart rendering options passed through to chart renderer
  - `source`: source text below chart

Example:

```json
{
  "type": "line",
  "data": [
    { "name": "Index", "labels": ["Jan", "Feb", "Mar"], "values": [100, 108, 111] }
  ],
  "opts": {
    "showValue": true,
    "valAxisTitle": "Index"
  },
  "source": "Source: Synthetic model output"
}
```

## `columns`

- Array of 4+ objects (layout-dependent), each typically:
  - `heading` or `title`
  - `body` as `textArray`

## `contentsSections`

- Array of section objects, typically:
  - `number`: section number string
  - `title`: section title string
  - `items`: optional array of strings
  - `pageRange`: optional string

## Supported slide types and slot contracts

Legend:

- `R`: required
- `O`: optional

| Slide type | Template layout | Required slots | Optional slots |
|---|---|---|---|
| `cover` | `Cover page_Right Horizontal Window` | `title` (text, min 8, max 100), `subtitle` (text, min 12, max 200) | None |
| `divider` | `Divider slide_5` | `sectionNumber` (text, `^\d{2}$`), `sectionTitle` (text, min 6, max 80) | None |
| `dividerDark` | `Divider slide_5` | `sectionNumber` (text, `^\d{2}$`), `sectionTitle` (text, min 6, max 80) | None |
| `dividerLight` | `Divider slide_2` | `sectionNumber` (text, `^\d{2}$`), `sectionTitle` (text, min 6, max 80) | None |
| `contents` | `Contents` | `title` (text, min 6, max 40), `sections` (contentsSections, min 8) | None |
| `oneColumnText` | `(none)` | `title` (text, min 12, max 50), `body` (textArray, min 3, minChars 180) | `strapline` (text, min 12, max 700), `source` (text, min 12, max 700), `bodyStyle` (`bullets`/`paragraphs`) |
| `twoColumnText` | `Two columns text` | `title` (text, min 12, max 50), `leftBody` (textArray, min 2, minChars 80), `rightBody` (textArray, min 2, minChars 80) | `strapline` (text, min 12, max 700), `bodyStyle` (`bullets`/`paragraphs`) |
| `analysisNarrowTable` | `Analysis_narrow table` | `title` (text, min 12, max 50), `table` (table, min 3 rows), `insights` (textArray, min 2, minChars 80) | `strapline` (text, min 12, max 700), `notes` (text, min 12, max 700), `insightTitle` (text, min 6, max 80) |
| `analysisWideChart2ColsText` | `Analysis_wide chart + 2 cols text` | `title` (text, min 12, max 50), `body` (textArray, min 4, minChars 180), `chart` (chart, min 1 series) | `strapline` (text, min 12, max 700), `bodyStyle` (`bullets`/`paragraphs`) |
| `analysisWideChartTableText` | `Analysis_wide chart+table+text` | `title` (text, min 12, max 50), `body` (textArray, min 4, minChars 180), `chart` (chart, min 1 series) | `strapline` (text, min 12, max 700), `heading` (text, min 6, max 120), `table` (table, min 3 rows), `noteSource` (text, min 12, max 700), `bodyStyle` (`bullets`/`paragraphs`) |
| `titleStrapline4TextBoxes` | `Title+strapline+4 text boxes` | `title` (text, min 12, max 50), `columns` (columns, min 4) | `strapline` (text, min 12, max 700), `bodyStyle` (`bullets`/`paragraphs`) |
| `backCover` | `Back cover_2` | None | `disclaimer` (text, min 80, max 700), `url` (text, min 5, max 60) |

## Which slides support charts and tables

## Chart-supporting slide types

- `analysisWideChart2ColsText` (required chart)
- `analysisWideChartTableText` (required chart)

## Table-supporting slide types

- `analysisNarrowTable` (required table)
- `analysisWideChartTableText` (optional table)

## Important implication

If you put `chart` on `oneColumnText` or `twoColumnText`, it is not part of that slide type contract and should be treated as unsupported authoring.

## Slide selection guidance for effective decks

Use this decision pattern before drafting content:

1. What is the slide trying to prove?
2. Which evidence shape best matches that claim (narrative, comparison, trend, composition, table)?
3. Choose slide type that natively supports that evidence.
4. Fill required slots first.
5. Use optional slots for emphasis, not for core meaning.

## Intent-to-layout mapping

| Intent | Recommended slide type |
|---|---|
| Opening context and headline setup | `cover` + `dividerDark` |
| Agenda / navigation | `contents` |
| Single-thread narrative | `oneColumnText` |
| Side-by-side argument or compare/contrast | `twoColumnText` |
| Dense KPI/table readout + quick takeaways | `analysisNarrowTable` |
| Narrative + chart evidence | `analysisWideChart2ColsText` |
| Integrated chart + table + narrative readout | `analysisWideChartTableText` |
| Structured four-pillar summary | `titleStrapline4TextBoxes` |
| Legal/disclaimer close | `backCover` |

## Chart selection guidance (for models)

Choose chart type based on analytical intent:

| Analytical intent | Preferred chart type |
|---|---|
| Cross-category comparison | `bar` |
| Time trend | `line` or `area` |
| Share of whole (single period) | `pie` or `doughnut` |
| Correlation/distribution | `scatter` |
| Radial profile comparison | `radar` |

Guidelines:

1. Use `bar` as default when uncertain.
2. Keep labels short and consistent.
3. Keep units explicit in labels or axis title via `chart.opts`.
4. Include `chart.source` whenever numbers come from external data.
5. Do not assume combo/secondary-axis behavior; if needed, design a dedicated slide pattern first.

## Narrative quality guidance (for models)

Use this structure on text-bearing slides:

1. `title`: what this slide proves.
2. `strapline`: one-line argument.
3. `body`: evidence and interpretation.
4. Inline subheaders in `body`/`leftBody`/`rightBody` where useful.
5. `source`/`noteSource` on data-heavy slides.

Content standards:

1. Prefer 3-6 high-signal bullets or compact paragraphs per body region.
2. Avoid duplicated long body lines across many slides.
3. Keep numeric claims tied to cited evidence.
4. Keep titles within hard limits; do not rely on truncation.

## Pagination and continuity behavior

The runtime may split dense content into continuation slides:

- `oneColumnText`: splits large `body`
- `twoColumnText`: splits large left/right bodies
- `analysisWideChart2ColsText` and `analysisWideChartTableText`: splits large `body`; chart repeats
- `analysisNarrowTable`: can split dense table rows

Continuation slides append `(cont.)` to title.

## Validation behavior to know

1. Required slots missing: error.
2. Slot shape mismatch: error.
3. Below min char/item thresholds: error or warning depending on slot priority and sparse mode.
4. Unknown slide type: error.
5. Extra non-slot fields are not part of contract and should not be relied upon.

## Commands for verification

## Base validation run

```bash
node generator/index.js \
  --in decks/deckspec-starter-template.deckSpec.json \
  --out outputs/my-run/deck.pptx \
  --qa-out outputs/my-run/qa.json
```

## Stress-validation run

```bash
node generator/index.js \
  --in decks/qa-golden-all-layouts.deckSpec.json \
  --out outputs/stress/deck.pptx \
  --qa-out outputs/stress/qa.json
```

## Visual validation run

```bash
npm run validate:visual
```

## What to use in future model instructions

For model prompting, include all three references:

1. `docs/DECKSPEC-SCHEMA.md` for human policy and deck-quality guidance.
2. `docs/DECKSPEC-SLOTS-SCHEMA.json` for strict slot-level structure.
3. `docs/DECK-AUTHORING-PLAYBOOK.md` for narrative and evidence-quality behavior.

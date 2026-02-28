---
owner: kpmg-slidegen maintainers
status: active
last-reviewed: 2026-02-23
review-cycle-days: 30
source-of-truth: ARCHITECTURE.md
verification-state: verified
---

# Architecture

Canonical architecture map for how `deckSpec` input becomes `.pptx` plus QA output.

## 1) Repository Shape

```mermaid
flowchart TD
  R[kpmg-slidegen]
  R --> D[decks]
  R --> DOC[docs]
  R --> G[generator]
  R --> S[scripts]
  R --> T[templates]

  G --> GA[app]
  G --> GB[builders]
  G --> GH[helpers]
  G --> GP[postprocess]
  G --> GR[runtime]
  G --> GS[strict]
```

## 2) Runtime Pipeline

```mermaid
flowchart LR
  IN[deckSpec JSON] --> CLI[generator/index.js]
  CLI --> CLP[app/cli.js]
  CLI --> TP[loadTemplatePackage]
  CLI --> VAL[validateDeckSpecWithTemplate]
  VAL --> REN[renderDeck]
  REN --> PAG[paginateDeckSpec]
  PAG --> BLD[builders/*]
  BLD --> PPTX[PptxGenJS writeFile]
  CLI --> OVL[checkDeckOverlaps]
  CLI --> PPL[app/postprocess.js]
  PPL --> ADP[postprocess/slides-adapter.js]
  ADP --> PREV[preview pngs]
  ADP --> MON[montage png]
  ADP --> VOV[visual overflow result]
  CLI --> STR[app/strict-overflow.js]
  OVL --> QA[qa.json]
  STR --> QA
  PPL --> QA
  PPTX --> OUT[deck.pptx]
```

## 3) Strict Overflow Design

- Strict overflow status is derived from visual overflow output only.
- No legacy fallback script path is used.
- If visual overflow cannot run, strict overflow is marked as skipped with reason.
- Strict failure is driven by either:
- severe overlap findings
- strict overflow status non-zero

## 4) Module Dependency View

```mermaid
graph TD
  IDX[generator/index.js] --> A1[app/cli.js]
  IDX --> A2[app/postprocess.js]
  IDX --> A3[app/strict-overflow.js]
  IDX --> RD[runtime/render-deck.js]
  IDX --> TP[runtime/template-package.js]
  IDX --> DIAG[runtime/diagnostics.js]
  IDX --> OVR[strict/overlap.js]
  IDX --> SAD[postprocess/slides-adapter.js]

  RD --> PAG[runtime/paginate.js]
  RD --> B1[builders/cover-slide.js]
  RD --> B2[builders/contents-slide.js]
  RD --> B3[builders/one-column-text.js]
  RD --> B4[builders/two-column-text.js]
  RD --> B5[builders/analysis-*.js]
  RD --> B6[builders/back-cover-slide.js]

  B1 --> H[helpers/*]
  B2 --> H
  B3 --> H
  B4 --> H
  B5 --> H
  B6 --> H
```

## 5) Data Contracts

```mermaid
classDiagram
  class DeckSpec {
    +metadata
    +slides[]
  }

  class SlideSpec {
    +type
    +slot fields
  }

  class TemplateLayouts {
    +types
    +slots
    +masters
    +densityRules
  }

  class QaReport {
    +valid
    +errors[]
    +warnings[]
    +missingSlots[]
    +overlapSummary
    +strictOverflow
    +postprocess
    +summary
  }

  DeckSpec --> SlideSpec
  SlideSpec --> TemplateLayouts
  DeckSpec --> QaReport
```

## 6) Rendering Guarantees

- Builders assume one production path per slide type.
- Cover/back-cover require template assets and throw explicit errors when missing.
- Pagination occurs before final render and may create continuation slides.
- Logical page numbers are applied only to footer-enabled masters.
- Title `maxChars` constraints for text slides are hard validation errors (no truncation fallback).
- Text slides keep `strapline` as its own top text box and support inline body subheaders (`{ text, subheader: true }`) in text arrays.
- Text bodies support `bodyStyle` = `bullets` or `paragraphs` where applicable.

## 7) Operational Notes

- Add new slide types by updating `templates/.../layouts.json` then dispatching in `generator/runtime/render-deck.js`.
- Keep QA schema additive; update consumers if non-additive changes are required.
- Keep template assets resolved via `template-package.js` manifest keys.
- Use `scripts/validate-visual.mjs` for end-to-end visual integration checks.

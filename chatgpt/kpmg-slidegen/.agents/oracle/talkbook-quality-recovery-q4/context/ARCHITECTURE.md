# KPMG Slidegen Architecture

This repository has one unified architecture with two layers:

1. Core template platform: extract PPTX templates and generate brand-compliant decks.
2. Distribution skills: packaged workflows (including Talkbook consulting copilot) that produce native layout JSON and call generator runtimes.

## System boundaries

- In scope: extraction, template codegen, generation, strict QA, visual tuning support, skill packaging, and regression testing.
- Out of scope: storing large generated artifacts in git (except intentional baselines).

## End-to-end model

```mermaid
flowchart LR
  A[Template PPTX/POTX] --> B[Extractor (Python)]
  B --> C[template.json]
  B --> D[template.js]
  E[Deck content JSON or skill session state] --> F[Generator runtime (Node/PptxGenJS)]
  C --> F
  D --> F
  F --> G[PPTX output + manifest]
  G --> H[Strict QA + optional render pipeline]
  H --> I[Reports/PNGs/diffs]
```

## Core platform components

- `extractor/`: parses PPTX package graph and geometry, emits template metadata + code wrapper.
- `generator/`: validates deck input, maps to builders, writes PPTX, and emits diagnostics.
- `qa/`: optional render and comparison utilities (PPTX -> PDF -> PNG).
- `templates/`: template-specific assets and generated wrappers.

## Skill distribution components

- `dist/`: skill bundles and helpers.
- `dist/kpmg-gpt-inventory/`: inventory deck distribution.
- `dist/kpmg-talkbook-consulting-copilot/`: manual-first co-writing workflow:
  - `scripts/start_session.py`, `upsert_section.py`, `apply_action.py`
  - `scripts/compile_deck_json.py` (deterministic `layout.<slug>` compilation)
  - `scripts/build_deck.py` (generation + strict checks + iterative loop hooks)
  - `references/layout-mapping.md` (single source of mapping/taste policy)

## Data contracts

### Core template contract

- `templates/<template>/template.json`: extracted metadata, tokens, layout definitions.
- `templates/<template>/template.js`: generated runtime wrapper.

### Native slide contract

- `slides[].type = "layout.<slug>"`
- `slides[].slots = { ... }`
- optional per-slide notes/metadata fields.

### Strict QA contract

- overlap summary (`severeCount`, `warningCount`)
- bounds report (`outOfBoundsCount`)
- validation errors/warnings by slide

## Guardrails

1. `templates/kpmg-diligence/**` is frozen unless explicitly approved.
2. Shared extractor changes must pass Diligence regression tests.
3. Talkbook guidance must live in `layout-mapping.md` (no separate rubric policy layer).
4. KPMG SVG logo assets are required in distribution/runtime decks.

## Validation strategy

- Unit tests for extractor, slots, geometry, and part graph.
- Node smoke test for generator output.
- Talkbook lifecycle + mapping coverage tests.
- Diligence freeze guard comparing current hashes to manifest.

## Repository layout

```text
kpmg-slidegen/
  extractor/                # Python extraction + template codegen
  generator/                # Node generation runtime/builders
  qa/                       # render/compare utilities
  templates/                # diligence, valuations, talkbook assets/templates
  dist/                     # skill distributions and packaged workflows
  docs/                     # architecture/spec/plans
  tests/                    # regressions + freeze guards
```

---
name: kpmg-slidegen
version: 0.2
description: Orchestrate deterministic KPMG Diligence+ deck generation from source materials using strict schemas, catalog-approved slide types, QA gates (missing/sparse/overflow/overlap/master), and an LLM repair loop that edits DeckSpec only.
---

# KPMG SlideGen

This skill turns user-provided diligence materials into a KPMG Diligence+ slide or deck, using a deterministic PPTX renderer (PPTXGenJS-based) and a strict QA + repair loop.

## What this skill owns

- A predictable user experience flow: **intake → content pack → deck plan → deck spec → render → QA → repair**.
- Contract-first generation: every intermediate artifact is **schema-valid**.
- Catalog-first layout selection: only **approved slide types** are used.
- Deterministic rendering: the renderer never relies on LLM “layout creativity”.
- QA traceability: every run emits machine-readable QA so issues are repairable.

## What this skill does not own

- Financial modeling or “making up” numbers.
- Manual pixel-tweaking in PowerPoint as part of the automated flow.
- Unsupported slide types (anything not in the slide catalog).

## Operating modes

- **Single slide**: produce a 1-slide deck using the best-fit catalog slide type.
- **Section pack**: produce a mini-deck for a specific section (e.g., QoE only).
- **Full deck**: produce a complete diligence report deck.

## Inputs

The user may provide:

- A request: slide vs section vs deck, purpose, tone, audience.
- Attachments: PDFs, spreadsheets, Word docs, emails, notes, prior decks.
- Constraints: no web, no external data, client-ready vs internal draft, deadline.

## Outputs

Always produce:

- `outputs/<runId>/deck.pptx`
- `outputs/<runId>/deckSpec.json` (the exact spec used to render)
- `outputs/<runId>/qaReport.json` (all QA findings)

Also save (for debugging and reproducibility):

- `outputs/<runId>/intake.json`
- `outputs/<runId>/contentPack.json`
- `outputs/<runId>/deckPlan.json`
- `outputs/<runId>/render/` (renderer diagnostics, overlap report, overflow report, etc.)

## Source of truth

- **Slide catalog** (approved slide types + slot contracts + density targets):
  - `templates/diligence-plus/catalog/slideCatalog.json`
- **Template package** (tokens + layouts + assets):
  - `templates/diligence-plus/generated/` (data-only)
  - `templates/diligence-plus/assets/`
- **Schemas** (contracts enforced at each stage):
  - `schemas/intake.schema.json` (optional but recommended)
  - `schemas/contentPack.schema.json`
  - `schemas/deckPlan.schema.json`
  - `schemas/deckSpec.schema.json`
  - `schemas/qaReport.schema.json`
- **Renderer** (deterministic PPTX generation):
  - `generator/index.js` (CLI entry)
  - `renderer/*` (if present in repo)

## End-to-end workflow

### 1) Intake

Run prompt: `prompts/intake.md`.

- Decide mode (slide vs section vs deck) and required sections.
- Capture non-negotiables, exclusions, tone, and audience.
- Ask the user questions **only if blocked**; otherwise proceed with explicit assumptions.

Artifact: `intake.json`.

### 2) Content pack

Run prompt: `prompts/content_pack.md`.

- Extract facts and numbers from source materials.
- Produce slot-ready building blocks (bullets, tables, chart series, captions).
- Attach evidence pointers for key claims.

Validate: `schemas/contentPack.schema.json`.

Artifact: `contentPack.json`.

### 3) Deck plan

Run prompt: `prompts/deck_plan.md`.

- Choose slide sequence and narrative arc.
- Choose slide types from the slide catalog only.
- Define per-slide intent and what evidence it should rely on.

Validate: `schemas/deckPlan.schema.json`.

Artifact: `deckPlan.json`.

### 4) Deck spec

Run prompt: `prompts/deck_spec.md`.

- Produce the renderable `deckSpec`.
- Fill required slots with meaningful content.
- Meet density targets (avoid sparse slides).

Validate: `schemas/deckSpec.schema.json`.

Artifact: `deckSpec.json`.

### 5) Render + QA

Render using the deterministic engine (example):

- `node generator/index.js --in outputs/<runId>/deckSpec.json --out outputs/<runId>/deck.pptx --strict`

Then produce `qaReport.json` by combining:

- Pre-render checks (schema, catalog, density)
- Render diagnostics (missing required slots, pagination events)
- Post-render checks (overlap, overflow, master applied)

Artifact: `qaReport.json` plus renderer diagnostics in `outputs/<runId>/render/`.

### 6) Repair loop

If QA has failures, run `prompts/repair.md`.

- Edit **DeckSpec only**.
- Do not “freehand redesign”.
- Apply the smallest deterministic change that fixes the QA finding.

Re-render and re-run QA until:

- all failures are fixed, or
- the user explicitly accepts remaining issues.

## QA gates and severity

- **Fail (must repair):**
  - Missing required slots
  - Sparse slides below density threshold (unless explicitly allowed)
  - Master mismatch / master not applied
  - Severe overlaps
  - Hard overflow (text clipped)

- **Warn (can ship if accepted):**
  - Near-overflow risk
  - Minor overlaps below tolerance
  - Non-blocking style nits (e.g., long bullets)

## Guardrails

- Never invent numbers. If a required metric is missing, use a placeholder and label it as such.
- Keep `templates/diligence-plus/generated/` data-only.
- Keep runtime logic outside generated folders.
- Prefer switching to an appropriate slide type over cramming content into a mismatched layout.

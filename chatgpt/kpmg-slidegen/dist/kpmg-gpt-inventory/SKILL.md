---
name: kpmg-gpt-inventory
description: Create and maintain the KPMG Transaction Services “Custom GPT Inventory” PowerPoint deck using kpmg-slidegen. Use for: (1) Adding a new GPT one‑pager slide with consistent structure (Problem / How we solve it / Outcome-ROI), (2) Updating copy, icon, or screenshot placeholder captions, (3) Generating the PPTX and rendering slide PNGs for review, and (4) Running an inspection loop that flags layout issues (overlaps/warnings) and produces a review artifact for quick iteration.
---

# KPMG GPT Inventory (TS) — Portable Skill

This skill standardizes a single “master inventory deck” where each GPT has a repeatable one‑pager slide.

The **right column is always a screenshot placeholder frame** (teams add real screenshots later).

## Source of truth

- Deck spec JSON: `samples/ts-custom-gpts-portfolio.json`
- Generator entrypoint: `generator/index.js`
- Validation: `generator/validate.js`
- Rendering: `qa/render.py` (PPTX → PDF → PNG via poppler)

## Quick start (happy path)

1) Add a new GPT slide (recommended):
- Run: `python3 dist/kpmg-gpt-inventory/scripts/add_gpt.py --help`
- Then: `python3 dist/kpmg-gpt-inventory/scripts/build_inventory_deck.py`

2) Review:
- Open the rendered PNGs under the run folder printed by the build script.
- Fix copy length or icon paths, then re-run the build script.

## Adding a GPT (standard one‑pager format)

Use `scripts/add_gpt.py` to append a new slide to the inventory deck with:
- Slide title = GPT name
- Strapline = 1 concise sentence
- Left column sections (each should be 2–3 bullets):
  - Problem
  - How we solve it
  - Outcome / ROI
- Right column:
  - Icon path (PNG preferred; SVG allowed)
  - Screenshot placeholder caption (1 sentence describing the desired screenshot)

This repo’s deck uses two optional slide fields for consistent executive formatting:
- `iconPlacement: "titleLeft"` to align the icon with the slide title.
- `style: { bodyFontSize: 11, straplineFontSize: 11, iconSize: 0.62 }` for executive readability and a larger icon.

### Copy rules (hard requirements)

- No technical terms on-slide (avoid “JSON”, “schema”, “validator”, etc.).
- Each bullet must be **2–3 complete sentences** and end with a period.
- Use “before → after” framing in Problem and Outcome / ROI.
- For readability, aim for **2–3 bullets per section** (still full sentences), rather than one dense paragraph.

### Formatting rules (hard requirements)

- Keep `leftBody` bullets **flat** (no nested arrays). Use the pattern: header line → bullet line → bullet line, then the next header.
- Do not put excerpt content in the right column. The right column is reserved for the screenshot placeholder frame only.

See: `references/copy-template.md` for a fill‑in template.
See: `references/deck-model.md` for the exact JSON shape.

## Build + inspection loop

Run:

`python3 dist/kpmg-gpt-inventory/scripts/build_inventory_deck.py`

This will:
1) Validate the deck spec.
2) Generate a PPTX into a timestamped `outputs/runs/...` folder.
3) Render slide PNGs (PPTX → PDF → PNG).
4) Produce a small inspection report (strict overlap summary + warnings + links/paths).

### What “inspection” means here

- **Automated checks**:
  - Overlap detection (strict mode overlap report).
  - Missing required slot checks (strict diagnostics).
  - Warnings captured during generation.
- **Human review**:
  - Scan the PNGs for clipping, awkward breaks, or crowded text.
  - If the optional overflow checker dependencies are installed, the strict overflow check will run; otherwise it will be skipped.

### Fixing issues (what to change)

Prefer fixing issues by:
1) Tightening copy (without losing completeness).
2) Splitting a section into multiple bullets (still 2–3 sentences each).
3) Adjusting slide ordering if narrative impact is improved.

Only if needed, adjust layout behavior in the builders (this repo), then rebuild the deck and re-run inspection.

## Dependencies (for rendering)

- External binaries:
  - LibreOffice `soffice`
  - poppler `pdftoppm` (used to render PDF pages to PNGs)
- Optional Python deps for deeper strict overflow checks:
  - `pip install -r requirements/requirements-qa.txt`

## Scripts in this skill

- `scripts/add_gpt.py`: Add a GPT slide entry to the master deck JSON.
- `scripts/build_inventory_deck.py`: Generate PPTX, render PNGs, and write an inspection report.

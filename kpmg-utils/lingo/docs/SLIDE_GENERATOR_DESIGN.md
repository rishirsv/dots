# Slide Generator Design (Template-Driven)

This document describes how a “standard slide” generator should work, and how to adapt the same engine to a different template.

It is intentionally template-first and “GPT-sandbox compatible”.

---

## Goals

- **Brand fidelity**: output must look identical to the template style.
- **Determinism**: given the same input JSON + template, output is repeatable.
- **Template portability**: new templates require mapping work, not new engine logic.
- **Sandbox deployability**: engine can run as a single-file bundle with minimal dependencies.

Non-goals (initially):
- Perfect text measurement (font-metric accurate overflow detection) in sandbox environments.
- “Magical” one-click deck authoring; keep the user in control with outline review.

---

## Core Strategy: Clone & Replace

1. Designers provide a PPTX template with example slides for each layout.
2. The engine **duplicates** the chosen template slide for each output slide.
3. The engine **replaces** text in a known set of shapes (by semantic keys).

This avoids `add_slide()` drift and preserves logos/backgrounds/theme fidelity.

---

## Data Contracts

### Minimal slide JSON (engine input)

- `layout`: layout ID (maps to a template slide index)
- `content`: object keyed by semantic shape keys (`title`, `bullets`, etc.)

Example:

```json
{
  "slides": [
    {
      "layout": "title_slide",
      "content": {
        "title": "Project Atlas | Financial Due Diligence",
        "subtitle": "December 2025"
      }
    }
  ]
}
```

### Registry (template mapping)

A template registry defines:
- `template_index`: which slide to duplicate for a layout
- `shapes`: semantic key → shape index (or stable shape identifier)
- `required`: required keys for validation
- optional: `capacity` metadata (word/char limits per field)

---

## Generation Pipeline

### 1) Validate input
- Layout exists in registry.
- Required fields are present.
- Content keys are known for that layout (unknown keys warn/fail based on strictness).

### 2) Build slide duplication sequence
- For each slide, pick `template_index` and duplicate that slide into a working deck.

### 3) Build replacements
- Convert each content value into paragraph structures:
  - For multi-line strings, split on `\n`.
  - Decide bullets based on field type and/or explicit bullet markers (`•`, `-`, `*`).
  - Apply paragraph properties (bullet/level/alignment) and run properties (font/size/color/bold).

### 4) Apply replacements
- For each target shape:
  - Clear the text frame (preserve the shape).
  - Recreate paragraphs/runs with the intended formatting.

### 5) Save output
- Remove the original template slides if you cloned into the same `Presentation`.
- Save `.pptx`.

---

## Adapting to a New Template (Repeatable Process)

### Step A — Template audit
- Identify which slides are “canonical layouts” (cover, section divider, bullets, etc.).
- Ensure each layout slide has stable, unambiguous text shapes.

### Step B — Analyze shapes
- Use a template analysis script to print each slide’s text shapes in order:
  - index, placeholder type, bounds, sample text.
- Decide semantic names for each text shape (e.g., `title`, `bullets`, `left_content`).

### Step C — Create/update registry
- Map `layout_id → template_index`.
- Map `shape_key → shape_index` (or another stable addressing scheme).
- Add `required` fields.
- Add basic `capacity` guidance (word/char limits) based on what looks good in the template.

### Step D — Add “template conformance” tests
- A test per layout that:
  - Duplicates the slide
  - Replaces text in every mapped shape key
  - Saves and reloads the PPTX without errors

### Step E — Bundle for GPT
- Concatenate the minimal modules needed into a single file.
- Replace local paths with `/mnt/data/...` conventions.
- Document the import pattern (`importlib.util.spec_from_file_location`).

---

## Pagination / Overflow (When Needed)

Start with template-specific heuristics:
- Use registry `capacity` limits (word/char thresholds).
- For list fields (bullets), split into continuation slides based on `max_items`.

When you need higher quality:
- Add a heuristic overflow estimator (character-based) per layout/field.
- Or implement layout-specific “height budgets” (same concept as glossary V3 adaptive row heights).

The key is to keep pagination output explicit (e.g., “left column items with heights”), so fill logic cannot drift.

---

## Testing Priorities (What catches real failures)

- **Slide duplication**:
  - Duplicating a slide with images/logos/hyperlinks must not break on save.
  - Assert duplicated slide XML references only relationships that exist on the duplicated part.
- **Replacement**:
  - Clearing + rebuilding paragraphs must preserve expected bullet behaviors.
- **Template registry correctness**:
  - Shape indices must match reality; fail fast with clear error messages.
- **Golden-path E2E**:
  - Minimal deck with every layout present (one slide each).

---

## Operational Guardrails (Quality and Safety)

- Never guess shape indices at runtime; use the registry.
- In GPT deployments, never fall back to ad-hoc `python-pptx` slide building.
- Keep engine code Python 3.9-compatible and dependency-light for sandbox portability.


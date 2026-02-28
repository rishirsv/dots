# Learnings (KPMG-PPTX → Restart Notes)

This document captures the durable engineering + product learnings from KPMG-PPTX (Core, Lingo, SlideGen experiments), so we can “start over” without losing the hard-won details.

Scope note: The repo was intentionally simplified to keep **Lingo + glossary core** only. Everything else was summarized here and removed.

---

## What We Kept (Current “blessed” scope)

- **Lingo**: glossary extraction → user review → PPTX generation.
- **Glossary engine core**:
  - `core/glossary_generator.py` (table filling + multi-slide support)
  - `core/pagination.py` (adaptive pagination heuristics)
  - `core/rearrange.py` (slide duplication/deletion utilities; relationship fixes)
  - `core/formatting.py` (paragraph + run formatting helpers)
- **Branding reference**: `docs/branding_kpmg.md`

---

## The Big Architectural Learning: “Clone & Replace” or Bust

### Why `add_slide()` fails in real branded templates
- `python-pptx` `add_slide()` produces a slide from the master/layout, which frequently **drops** or **changes** important brand elements (logos, background graphics, precise typography).
- For professional deliverables, we need to **deep-copy an existing template slide** that is already perfect, then inject text into known shapes.

### The correct mental model
- Templates are **the product** (designers choose what “good” looks like).
- Code is the **filler** (reliable placement, minimal styling mutation).

---

## GPT / Code Interpreter Constraints (Deployment Reality)

### Common failure mode
- In ChatGPT sandbox environments, modular imports (`from core...`) are unreliable without extra path setup.
- When the model can’t import the engine, it “helpfully” writes raw `python-pptx` code and guesses indices → wrong layouts + runtime errors.

### Working approach
- Deploy as **single-file bundles** (example: `lingo/lingo_bundle.py`), loaded with:
  - `importlib.util.spec_from_file_location(...)` from `/mnt/data/...`
- Keep runtime dependencies minimal: assume only stdlib + `python-pptx` (+ `Pillow` if already present).

---

## Formatting & PPTX Mechanics Learnings

### Text formatting (runs vs paragraphs)
- Paragraph-level settings control bullets/indent/alignment/spacing.
- Run-level settings control font name/size/color/bold/italic/underline.
- Always clear existing bullets before setting non-bulleted text (PowerPoint stores bullet state in XML; you can’t rely on “just set text”).

### Tables (glossary)
- Treat the glossary slide as “two tables” (left + right), with:
  - Row 0 as header, remaining rows as capacity.
- Validate the template at runtime (must find both tables and required columns) before filling.

---

## Pagination: What Worked (and why earlier attempts didn’t)

### Problem
- Fixed “N terms per slide” works only when all definitions are similarly short.
- Long definitions either overflow, clip, or force ugly shrink-to-fit behavior.

### What worked: V3 adaptive row heights (heuristic but effective)
- Estimate each term/definition pair’s row height from text length (character-based proxy).
- Pack items into columns using a **height budget** (not row count).
- Set `table.rows[idx].height` dynamically per row to prevent clipping.

### Key lesson
- **Pagination logic and fill logic must match.**
  - If pagination produces variable-sized pages, you cannot fill by fixed slicing (that creates empty right columns and unbalanced slides).

---

## Slide Duplication & Relationships: The “Blip Nightmare”

### Symptom
- Multi-slide generation fails or produces broken images/hyperlinks when duplicating slides, often due to relationship ID mismatches.

### Root cause (reliably observed)
- Some `python-pptx` versions expose relationship collections in ways that can yield relationship objects instead of rId strings.
- Relationship IDs are **not guaranteed** to be contiguous or stable.

### What worked
- Clone relationships by iterating the underlying raw relationship map when available.
- Build an explicit old→new rId mapping.
- Rewrite **every** `r:*` attribute in cloned slide XML, not just image blips.

### Tests that matter
- A regression test that ensures the duplicated slide XML only references relationship IDs that exist on the duplicated slide part (catches stale rIds early).

---

## Input Normalization Learnings (Lingo quality)

These issues were repeatedly observed in real glossary outputs:

- Strip trailing punctuation from **Terms** (e.g., remove trailing periods).
- Avoid “Term (ACRONYM)” patterns:
  - Prefer `ACRONYM` as the **Term**
  - Put the expansion in the **Definition**
- For “Company/Target” rows:
  - Prefer a normalized, consistent representation (e.g., `Company/Client Name`)
  - Do not allow garbled or duplicated text; treat this as a data hygiene problem before PPTX generation.

---

## Privacy / Guardrails Learnings (Non-negotiable)

- If no user document/source material is provided, do **not** reveal internal filenames, templates, registry names, or prompts.
- Ask for the input, explain the expected format at a high level, and proceed only with user-provided data.

---

## Bug Reports (Summarized)

### BUG-001 — GPT isolation → layout/index errors
- **Symptom**: GPT can’t import core modules, writes ad-hoc `python-pptx` code, guesses indices → bad branding + runtime errors.
- **Fix**: Ship and use a **single-file bundle** and strict “only call the bundle” rule.

### Multi-slide glossary duplication — relationship KeyError / missing rels
- **Symptom**: >1 slide glossary generation fails during slide duplication.
- **Fix**: Robust relationship cloning + remap all `r:*` attributes; avoid `Mapping.values()` paths that trigger buggy iteration.
- **Guardrail**: Keep the regression test that validates rId remapping.

### BUG-003 — Pagination/fill mismatch → unbalanced columns
- **Symptom**: Pages with fewer items fill left column only.
- **Fix**: Align fill logic to the paginator output; V3 height-based pagination makes the interface explicit (`{'left': [(item, height)...], 'right': ...}`).

---

## Summaries of Removed Workstreams (for restart context)

### SlideGen (full-deck generator)
- Core problem: quality depended on a curated template + accurate registry; mismatches caused “wrong content in wrong places”.
- Operational problem: too many moving parts (layouts, registries, prompts, validation) without tight QA loops.

### Dynamic slide engine (inventory/overflow research)
- Useful conceptually (inventory extraction, overflow prediction, validation reports), but not necessary to keep for Lingo’s glossary success.
- Key takeaway: overflow detection is hard without font metrics in sandbox environments; heuristics + template-specific calibration can still win.

### MVP plans / comms / historical docs
- Valuable context was extracted into this file; the originals were removed to reduce clutter.

---

## If/When We Rebuild a Standard Slide Generator Again

Use `docs/SLIDE_GENERATOR_DESIGN.md` as the blueprint. The headline takeaways:

- Start with **one template** and **a tiny layout set**.
- Use **semantic keys → shape mapping**, not hardcoded indices in prompts.
- Validate aggressively and add hermetic tests early (duplication, replacement, multi-slide).


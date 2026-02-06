# Generator Audit: kpmg-slidegen vs OpenAI slides helpers

## Scope
This audit compares **KPMG generator code** (Node/PptxGenJS) to **OpenAI’s `utils/oai-skills/slides` helpers** with a focus on **generation principles and file-level patterns**. It does **not** cover your extractor or QA tooling except where OpenAI’s generator helpers explicitly include layout/overflow validation utilities.

## Sources reviewed
KPMG generator:
- `kpmg-slidegen/generator/index.js`
- `kpmg-slidegen/generator/validate.js`
- `kpmg-slidegen/generator/tokens.js`
- `kpmg-slidegen/generator/helpers/bullets.js`
- `kpmg-slidegen/generator/helpers/title.js`
- `kpmg-slidegen/generator/builders/divider.js`
- `kpmg-slidegen/generator/builders/one-column.js`
- `kpmg-slidegen/generator/builders/process.js`
- `kpmg-slidegen/generator/builders/table.js`

OpenAI slides helpers:
- `utils/oai-skills/slides/pptxgenjs_helpers/index.js`
- `utils/oai-skills/slides/pptxgenjs_helpers/layout.js`
- `utils/oai-skills/slides/pptxgenjs_helpers/layout_builders.js`
- `utils/oai-skills/slides/pptxgenjs_helpers/util.js`
- `utils/oai-skills/slides/pptxgenjs_helpers/image.js`
- `utils/oai-skills/slides/pptxgenjs_helpers/svg.js`
- `utils/oai-skills/slides/pptxgenjs_helpers/latex.js`
- `utils/oai-skills/slides/pptxgenjs_helpers/code.js`
- `utils/oai-skills/slides/render_slides.py`
- `utils/oai-skills/slides/slides_test.py`

## Principles: OpenAI slides helpers
1. **“Helper library” orientation**: A reusable toolkit (`pptxgenjs_helpers/`) with utility primitives that can be composed into many layouts. It emphasizes input normalization, sizing, and correctness rather than brand specifics.
2. **Layout preflight and diagnostics**: `layout.js` analyzes slide objects and detects overlaps (with special casing to reduce false positives). This is a **generator-time correctness check** rather than a rendering-time check.
3. **Deterministic sizing primitives**: `util.js` offers `calcTextBoxHeight()` to convert font size/lines into box height; layout builders and helper functions use explicit sizing math to avoid “magic” positions.
4. **Robust media handling**: `image.js` supports filesystem paths, data URIs, raw SVG, or buffers; probes dimensions and content type; provides sizing helpers for crop/contain.
5. **Rich content formats**: `code.js` transforms code into PptxGenJS text runs with syntax highlighting; `latex.js` renders LaTeX to SVG; `svg.js` sanitizes and converts SVG to data URIs.
6. **Safety in rendering**: `safeOuterShadow()` in `util.js` avoids PptxGenJS XML pitfalls; `layout.js` contains specific guards for line/shape overlap false positives.
7. **Independent overflow testing**: `slides_test.py` and `render_slides.py` implement a CLI-based render/inspect pipeline to detect content overflow (pad, rasterize, inspect margins).

## Principles: KPMG generator
1. **Template-driven, brand-first**: The generator assumes a single “look” controlled by extracted template assets and tokens. Styling is centralized in `tokens.js` and per-layout geometry is encoded in each builder.
2. **Predictable layout construction**: Builders define fixed geometry and use helper functions (`addTitle`, `toBulletRuns`) to keep text formatting consistent.
3. **Input validation grounded in template**: `validate.js` calls `template.validateSlideContent()` so constraints live alongside the template wrapper; generation fails fast on invalid specs.
4. **Purpose-built layouts**: Builders are built around specific deck types (e.g., divider, one-column text, process, table) rather than generic layout composition.
5. **Manual heuristics where template is ambiguous**: E.g., `process.js` detects invalid extracted geometry to fallback to a hardcoded 4‑column layout.

## File-level comparison (principles and patterns)

### Entry points
- KPMG: `generator/index.js` reads deck JSON, validates against template, generates PPTX using `template.generateDeck()`.
- OAI: no single generator entrypoint in this folder; instead a helper toolkit for PptxGenJS plus a separate render/test CLI.

**Implication:** KPMG is a closed system around a specific template; OAI is a reusable helper library intended to be embedded in multiple generation contexts.

### Validation
- KPMG: validation is semantic and schema-driven via `template.validateSlideContent()`.
- OAI: validation is geometry-driven (overlap detection in `layout.js`) and rendering-driven (overflow detection in `slides_test.py`).

**Implication:** KPMG validates “what content is allowed,” OAI validates “what the slide looks like.” Both are useful but target different failure modes.

### Layout primitives
- KPMG: per-slide geometry is hardcoded per builder (`divider.js`, `one-column.js`, `process.js`) with small adaptive shifts (`STRAPLINE_SHIFT`).
- OAI: layout primitives are parameterized, and sizing helpers (`calcTextBoxHeight`) drive consistent bounding box calculations.

**Implication:** KPMG favors fixed art‑direction; OAI favors composability and robust sizing.

### Text handling
- KPMG: `helpers/bullets.js` builds bullet runs with optional bold labels; `helpers/title.js` standardizes title styling.
- OAI: `code.js` generates syntax-highlighted text runs; `layout_builders.js` uses text metrics for sizing and repeatable patterns.

**Implication:** KPMG is tuned for business‑deck bullet formatting; OAI is built to handle diverse text use cases (code, icon+text, tree layouts).

### Media handling
- KPMG: image handling is localized within builders (e.g., `divider.js` has a data URI/path helper).
- OAI: `image.js` centralizes media ingestion and dimension detection with helpers for crop/contain.

**Implication:** OAI abstracts the “what is this image?” problem; KPMG handles images locally and minimally.

### Resilience to template drift
- KPMG: some fallbacks (e.g., `process.js` geometry validation) but mostly assumes stable templates and extracted geometry.
- OAI: uses analysis tools to catch overlaps and overflow even if layout is off, plus general sizing heuristics.

**Implication:** OAI defends against layout breakage at runtime; KPMG assumes stable templates and human review via QA.

## Key differences that matter for KPMG
1. **Layout validation at generation time** (OAI `layout.js`) vs. KPMG relying on template + review. This could prevent silent regressions by rejecting or warning on overlaps.
2. **Unified media and SVG handling** (OAI `image.js`/`svg.js`/`latex.js`) vs. localized image logic per builder. Centralized helpers reduce inconsistencies.
3. **Deterministic text box sizing** (OAI `calcTextBoxHeight`) vs. KPMG’s fixed geometry. This can help with dynamic content variability without re‑extracting geometry.
4. **Overflow detection pipeline** (OAI `slides_test.py`) vs. KPMG manual review. Automated “overflow guardrails” could reduce review time.

## Concrete adoption candidates (principles to import)
1. **Add a lightweight overlap check**: port the concept of `layout.js` into generator QA (or a debug flag). Use it to warn during generation when text overlap exceeds a threshold.
2. **Centralize image ingestion**: add a shared `helpers/image.js` that accepts path/data/inline SVG and exposes `contain/crop` helpers.
3. **Introduce text box height helpers**: implement `calcTextBoxHeight` and use it in builders where body text boxes are computed.
4. **Optional overflow test**: adapt `slides_test.py` or create a Node wrapper that runs a render + padding inspection for generated decks.

## What should stay different (by design)
- **Brand-first, template-driven layout**: KPMG’s generator needs the fixed look; OpenAI’s helpers are intentionally generic.
- **Template‑level validation**: KPMG’s content validation tied to `template.validateSlideContent()` is a strong brand safety feature that should remain the primary gate.

## Suggested next steps
1. Decide whether to add an **opt-in “strict mode”** that runs overlap + overflow checks in CI.
2. Identify the most error-prone layout (e.g., tables or multi-column) and prototype `calcTextBoxHeight` + `imageSizingContain` there.
3. Create a small “generator-utils” layer to consolidate image/SVG handling and prevent repeated logic in builders.

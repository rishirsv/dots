# KPMG-PPTX (Lingo + Glossary Engine)

This repo is the **glossary PPTX engine** used by **Lingo** (the glossary GPT). It generates KPMG-branded glossary slides from structured term/definition data using a template-first “Clone & Replace” approach.

If you’re restarting broader deck generation work, start with:
- `docs/LEARNINGS.md` (what worked, what broke, why)
- `docs/SLIDE_GENERATOR_DESIGN.md` (how to rebuild deck generation cleanly)
- `docs/branding_kpmg.md` (brand reference)

---

## What’s Here

- **Lingo**: GPT config + bundled single-file engine for sandbox deployment (`lingo/`).
- **Core glossary engine** (`core/`):
  - `glossary_generator.py` — JSON → PPTX glossary generator
  - `pagination.py` — adaptive pagination heuristics (avoid clipping)
  - `rearrange.py` — slide duplication helpers (relationship-safe)
  - `formatting.py` — reusable paragraph/run formatting helpers
- **Templates** (`templates/`):
  - `glossary_template.pptx` — the branded glossary layout

---

## Quick Start (Local)

### 1) Create your terms JSON

```json
[
  {"term": "EBITDA", "definition": "Earnings before interest, taxes, depreciation and amortization."},
  {"term": "NWC", "definition": "Net working capital."}
]
```

### 2) Generate the PPTX

```bash
python3 core/glossary_generator.py \
  --template templates/glossary_template.pptx \
  --input terms.json \
  --output output/glossary.pptx
```

---

## Bundling for ChatGPT (Lingo)

Rebuild the single-file Lingo engine:

```bash
python3 tools/build_lingo_bundle.py
```

---

## Testing

Run the full test suite:

```bash
python3 run_all_tests.py
```

Or directly:

```bash
python3 -m unittest discover tests -v
```


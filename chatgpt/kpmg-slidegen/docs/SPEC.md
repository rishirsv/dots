# KPMG Slidegen Specification

**Last updated:** 2026-02-06

## Purpose

Provide one unified system to:

1. Extract PPTX/POTX templates into reusable code/metadata.
2. Generate brand-compliant decks from structured JSON.
3. Package template-aware skills (including Talkbook copilot) that co-write content and compile native layout JSON.
4. Enforce strict layout safety and preserve Diligence behavior.

## Non-goals

- Editing PPTX XML manually during generation.
- Allowing silent drift in `templates/kpmg-diligence/**`.
- Storing large generated outputs in git by default.

## Public interfaces

### CLI/core

- `python3 cli.py extract --template <path> --pptx <path>`

### Generator runtime

- `node generator/validate.js --in <deck.json>`
- `node generator/index.js --in <deck.json> --out <deck.pptx> [--strict]`

### Talkbook skill scripts

- `python3 dist/kpmg-talkbook-consulting-copilot/scripts/start_session.py`
- `python3 dist/kpmg-talkbook-consulting-copilot/scripts/upsert_section.py`
- `python3 dist/kpmg-talkbook-consulting-copilot/scripts/apply_action.py`
- `python3 dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py`
- `python3 dist/kpmg-talkbook-consulting-copilot/scripts/build_deck.py`

## Contracts

### Template extraction output

- `templates/<template>/template.json`
- `templates/<template>/template.js`

### Legacy generator deck shape

- top-level `slides[]` with builder-specific fields validated by `generator/validate.js`.

### Native template deck shape

```json
{
  "metadata": {"title": "optional"},
  "slides": [
    {
      "type": "layout.<slug>",
      "slots": {"...": "..."},
      "notes": "optional"
    }
  ]
}
```

### Talkbook mapping policy

Canonical policy file:

- `dist/kpmg-talkbook-consulting-copilot/references/layout-mapping.md`

Required row fields include:

- `layout_slug`, `business_intent`, `best_for_content_shape`
- `required_slots`, `optional_slots`, `density_limits`
- `background_variant_rules`, `do_use_when`, `do_not_use_when`
- `fallback_layouts`, `sample_payload`

## Hard guardrails

1. Diligence template and outputs are frozen unless explicitly approved.
2. Shared extractor/runtime changes must pass Diligence regression checks.
3. KPMG SVG logo assets are required in generated/distributed decks.
4. Mapping guidance lives in layout mapping docs, not a separate rubric artifact.

## Output policy

- `outputs/` and session output folders are throwaway workspaces.
- Baselines and manifests should remain small and intentional.

## Quality gates

- Validation gate: schema/slot checks for deck inputs.
- Strict gate: severe overlaps = 0 and out-of-bounds = 0.
- Diligence freeze gate: hash comparison against `tests/diligence_freeze_manifest.json`.
- Talkbook mapping coverage gate: expected layouts and variants must be mapped.

## Verification

- `python3 -m unittest discover -s tests -p 'test_*.py'`
- `node tests/test_generator_smoke.js`
- (optional) render pipeline with `soffice` + `pdftoppm` for visual diffs.

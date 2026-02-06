# Repository Guidelines (kpmg-slidegen)

This repo is the unified home for KPMG slide generation: extractor + generator core and Talkbook skill distributions.

## Scope

- In scope: template extraction/codegen, deck generators, QA/strict inspection, skill distributions, docs, and tests.
- Out of scope: committing large generated artifacts (PPTX/PDF/PNG/session outputs) unless explicitly approved as baselines.

## Canonical structure

- Core extractor/generator: `extractor/`, `generator/`, `qa/`, `templates/`
- Skill distributions: `dist/`
- Specs/plans: `docs/`
- Regression tests: `tests/`

## Hard guardrails

1. Do not modify `templates/kpmg-diligence/**` without explicit approval.
2. Treat `templates/kpmg-diligence/template.js` and `templates/kpmg-diligence/template.json` as generated outputs.
3. Run Diligence regression checks before/after shared extractor changes.
4. Keep Talkbook mapping policy centralized in `dist/kpmg-talkbook-consulting-copilot/references/layout-mapping.md`.

## Quick commands

- Extract/regenerate a template wrapper:
  - `python3 cli.py extract --template templates/kpmg-diligence --pptx "templates/kpmg-diligence/Diligence+ Reporting Template_Widescreen v2.1.pptx"`
- Validate + generate a deck:
  - `node generator/validate.js --in samples/demo.json`
  - `node generator/index.js --in samples/demo.json --out outputs/demo.pptx`
- Run tests:
  - `python3 -m unittest discover -s tests -p 'test_*.py'`
  - `node tests/test_generator_smoke.js`
- Talkbook skill lifecycle:
  - `python3 dist/kpmg-talkbook-consulting-copilot/scripts/start_session.py --topic "<topic>"`
  - `python3 dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py --session-id "<id>"`
  - `python3 dist/kpmg-talkbook-consulting-copilot/scripts/build_deck.py --session-id "<id>"`

## Critical learnings

1. Variant-aware mapping is mandatory.
- White/blue variants materially change readability and need explicit rules.

2. Parity requires full layout-family coverage.
- Include quad layouts, two-column comparison, chart/text variants, process layouts, and transitions.

3. Deterministic mapping plus iterative tuning yields stable quality.
- Prioritize overflow fixes first, then wrong-variant/wrong-family corrections.

4. Persist evidence and sources as structured data.
- Keep source records in session state and propagate to slide/source outputs.

5. Gate final outputs with strict geometry checks.
- Severe overlaps and out-of-bounds must be zero before delivery.

## More detail

- Architecture: `ARCHITECTURE.md`
- Spec: `docs/SPEC.md`
- Generator notes: `generator/AGENTS.md`
- QA notes: `qa/AGENTS.md`
- Diligence template notes: `templates/kpmg-diligence/AGENTS.md`

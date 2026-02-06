# KPMG Talkbook Consulting Copilot

Manual-only portable skill for building Talkbook-native consulting decks.

## What this does

- Co-writes content with the user section-by-section.
- Persists each section to session files as the conversation evolves.
- Maps sections to Talkbook layout types using deterministic guidance.
- Compiles native deck JSON (`layout.<slug>` + `slots`).
- Generates PPTX and strict inspection artifacts.
- Supports iterative formatting-fix passes with per-round artifacts.

## Session files

- `sessions/<session_id>/session.json`
- `sessions/<session_id>/working-draft.md`
- `sessions/<session_id>/sources.json`
- `sessions/<session_id>/deck.json`
- `sessions/<session_id>/outputs/`

## Quick start

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/start_session.py --topic "Generative AI growth strategy"
python3 dist/kpmg-talkbook-consulting-copilot/scripts/upsert_section.py --session-id "<session_id>" --title "Executive Summary" --intent "executive-summary" --content "- Revenue opportunity is material\n- Capability gap is fixable"
python3 dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py --session-id "<session_id>"
python3 dist/kpmg-talkbook-consulting-copilot/scripts/build_deck.py --session-id "<session_id>"
```

## Manual co-writing loop example

1. Add initial section content with `upsert_section.py`.
2. Refine with `apply_action.py` (`simplify`, `merge`, `split`, `reorder`, `visualize`).
3. Re-run `compile_deck_json.py` after each major revision.
4. Build with `build_deck.py`.
5. For formatting issues, run iterative mode:

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/build_deck.py \
  --session-id "<session_id>" \
  --iterative --max-rounds 8 --require-human-approval
```

## Layout policy

Use `references/layout-mapping.md` as the canonical policy file. It includes:

- Full layout inventory in scope for this skill.
- Variant handling (blue/white backgrounds).
- Required and optional slots.
- Density limits.
- Use/don't-use rules.
- Fallback chains.

## Runtime notes

- Generator runtime is bundled at `runtime/generator/index.js`.
- It prefers local `pptxgenjs` if installed, and falls back to `templates/kpmg-talkbook/node_modules/pptxgenjs` when available.
- Brand logo is hard-wired to diligence assets vendored in this skill:
  - `assets/kpmg-logo.svg`
  - `assets/kpmg-logo-white.svg`
  Every slide renders one of these SVGs automatically.
- PNG rendering requires `soffice` and `pdftoppm`.

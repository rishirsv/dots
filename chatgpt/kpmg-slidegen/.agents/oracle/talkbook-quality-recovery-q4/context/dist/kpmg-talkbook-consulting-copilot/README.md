# KPMG Talkbook Consulting Copilot (V2)

Manual-only portable skill for building Talkbook-native consulting decks with a Gamma-style planning flow.

## What this does

- Supports two workflows:
- `outline_confirm` (default): propose outline, confirm outline, then draft.
- `one_shot`: bypass manual outline approval and generate deeply with assumptions.
- Requires archetype-first drafting and structured authoring payloads.
- Persists session, outline, sections, and source traceability artifacts.
- Compiles native deck JSON (`layout.<slug>` + `slots`).
- Generates PPTX and strict inspection artifacts.

## Session files

- `sessions/<session_id>/session.json`
- `sessions/<session_id>/working-draft.md`
- `sessions/<session_id>/sources.json`
- `sessions/<session_id>/deck.json`
- `sessions/<session_id>/compile_report.json`
- `sessions/<session_id>/outputs/`

## V2 workflow

1. Start session (`outline_confirm` or `one_shot`).
2. Set depth profile (`minimal|concise|detailed|extensive`).
3. Upsert structured outline.
4. In `outline_confirm`, approve outline before drafting.
5. Materialize outline sections.
6. Draft section content with archetype + payload contract.
7. Run writing checklist.
8. Compile and build.

## Quick start

### Outline-confirm (default)

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/start_session.py \
  --topic "Generative AI growth strategy" \
  --workflow outline_confirm \
  --depth-profile detailed

python3 dist/kpmg-talkbook-consulting-copilot/scripts/upsert_outline.py \
  --session-id "<session_id>" \
  --outline-file "outline.json"

python3 dist/kpmg-talkbook-consulting-copilot/scripts/approve_outline.py \
  --session-id "<session_id>" \
  --rationale "Outline approved"

python3 dist/kpmg-talkbook-consulting-copilot/scripts/materialize_outline.py \
  --session-id "<session_id>"
```

### One-shot bypass

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/start_session.py \
  --topic "Generative AI growth strategy" \
  --skip-outline \
  --assumption "Assuming executive audience and quarterly decision horizon"
```

### Draft section + compile/build

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/upsert_section.py \
  --session-id "<session_id>" \
  --title "Executive Summary" \
  --intent "executive-summary" \
  --archetype-id "core.executive-synthesis" \
  --outline-section-id "exec-summary" \
  --depth-profile detailed \
  --payload-file "authoring_payload.json"

python3 dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py --session-id "<session_id>"
python3 dist/kpmg-talkbook-consulting-copilot/scripts/build_deck.py --session-id "<session_id>"
```

## Policy files

### Writing policy

- `references/writing-archetypes.md`
- `references/writing-checklist.md`
- `references/authoring-payload-contract.md`
- `references/workflow-outline-mode.md`

### Layout policy

- `references/layout-mapping.md`
- `references/layout-cheat-sheet.md`

## Runtime notes

- Generator runtime is bundled at `runtime/generator/index.js`.
- Runtime accepts legacy table/chart payloads and richer structured payloads.
- Brand logo assets remain hard-wired:
- `assets/kpmg-logo.svg`
- `assets/kpmg-logo-white.svg`
- PNG rendering requires `soffice` and `pdftoppm`.

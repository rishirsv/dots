---
name: kpmg-talkbook-consulting-copilot
description: Manual-only workflow for co-writing KPMG consulting deck content with a user, persisting sections to session files, mapping content to Talkbook layout types, compiling native layout-dot-slug JSON, and generating inspected slide decks with iterative formatting passes.
---

# Talkbook Consulting Copilot (Manual-Only)

Use this skill only when manually invoked by the user. Do not auto-run discovery or triggers.

## Workflow

1. Start a session.
2. Co-write section-by-section and persist each section to file.
3. Apply edits (simplify, merge, split, reorder, visualize) as requested.
4. Compile to native Talkbook JSON (`layout.<slug>`).
5. Build deck and run strict inspection.
6. If formatting issues remain, run iterative passes.

## Commands

### 1) Start session

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/start_session.py \
  --topic "<topic>" \
  --target-slides 30
```

### 2) Add/update section during co-writing

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/upsert_section.py \
  --session-id "<session_id>" \
  --title "<section title>" \
  --intent "<intent>" \
  --content-file "<path/to/section.md>"
```

### 3) Iterative edits

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/apply_action.py simplify --session-id "<session_id>" --section-id "<id>"
python3 dist/kpmg-talkbook-consulting-copilot/scripts/apply_action.py merge --session-id "<session_id>" --first "<id1>" --second "<id2>"
python3 dist/kpmg-talkbook-consulting-copilot/scripts/apply_action.py reorder --session-id "<session_id>" --order "idA,idB,idC"
```

### 4) Compile native deck JSON

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py \
  --session-id "<session_id>"
```

### 5) Build + inspect deck

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/build_deck.py \
  --session-id "<session_id>"
```

### 6) Iterative formatting loop

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/build_deck.py \
  --session-id "<session_id>" \
  --iterative \
  --max-rounds 8 \
  --require-human-approval
```

## Required references

- Layout mapping + guidance: `references/layout-mapping.md`
- Quick lookup: `references/layout-cheat-sheet.md`

## Rules

- Keep workflow manual-only.
- Persist section updates to session files as the conversation progresses.
- Keep all selection guidance in `layout-mapping.md`; do not create a separate rubric.
- Use `layout.<slug>` types only.
- Do not edit Diligence template files.

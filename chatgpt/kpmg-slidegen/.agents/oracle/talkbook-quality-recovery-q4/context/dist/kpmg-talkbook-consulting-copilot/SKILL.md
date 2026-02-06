---
name: kpmg-talkbook-consulting-copilot
description: Manual workflow for KPMG Talkbook consulting decks with Gamma-style outline confirmation, optional one-shot bypass, archetype-first drafting, and inspected deck generation.
---

# Talkbook Consulting Copilot (V2)

Use this skill only when manually invoked by the user. Do not auto-run discovery or triggers.

## Purpose

Produce dense, evidence-first consulting slides through a two-path workflow:

- `outline_confirm` (default): intake -> outline draft -> user confirmation -> drafting
- `one_shot` (bypass): intake with assumptions -> auto-approved outline -> drafting

## Triggers

Use when the user asks to:

- Build or refine consulting deck content with strong information density.
- Draft outline-first and confirm structure before writing full sections.
- Bypass outline review and generate deeply in one pass.
- Compile Talkbook-native JSON and build inspected decks.

## Workflow

1. Start a session (`outline_confirm` by default, or `one_shot` when requested).
2. Capture intent and decide depth profile (`minimal|concise|detailed|extensive`).
3. **MANDATORY in outline_confirm:** draft and persist structured outline.
4. **MANDATORY in outline_confirm:** approve outline before drafting sections.
5. Materialize outline into section shells.
6. **MANDATORY:** select archetype first for each section.
7. **MANDATORY:** fill authoring payload contract before finalizing section content.
8. **MANDATORY:** run writing checklist before section finalization.
9. Compile native Talkbook JSON (`layout.<slug>`).
10. Build and run strict inspection; iterate formatting as needed.

## Commands

### 1) Start session

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/start_session.py \
  --topic "<topic>" \
  --workflow outline_confirm \
  --depth-profile detailed
```

One-shot bypass:

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/start_session.py \
  --topic "<topic>" \
  --skip-outline \
  --assumption "Assuming executive audience and quarterly decision horizon"
```

### 2) Upsert outline

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/upsert_outline.py \
  --session-id "<session_id>" \
  --outline-file "<path/to/outline.json>"
```

### 3) Approve outline (required for outline_confirm)

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/approve_outline.py \
  --session-id "<session_id>" \
  --rationale "Outline approved for drafting"
```

### 4) Materialize outline into section stubs

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/materialize_outline.py \
  --session-id "<session_id>"
```

### 5) Upsert drafted section (payload-first)

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/upsert_section.py \
  --session-id "<session_id>" \
  --title "<section title>" \
  --intent "<intent>" \
  --archetype-id "<archetype_id>" \
  --outline-section-id "<outline_section_id>" \
  --depth-profile detailed \
  --payload-file "<path/to/authoring_payload.json>" \
  --content-file "<optional/path/to/section.md>"
```

### 6) Iterative edits

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/apply_action.py simplify --session-id "<session_id>" --section-id "<id>"
python3 dist/kpmg-talkbook-consulting-copilot/scripts/apply_action.py merge --session-id "<session_id>" --first "<id1>" --second "<id2>"
python3 dist/kpmg-talkbook-consulting-copilot/scripts/apply_action.py reorder --session-id "<session_id>" --order "idA,idB,idC"
```

### 7) Compile native deck JSON

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py \
  --session-id "<session_id>"
```

### 8) Build + inspect deck

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/build_deck.py \
  --session-id "<session_id>"
```

### 9) Iterative formatting loop

```bash
python3 dist/kpmg-talkbook-consulting-copilot/scripts/build_deck.py \
  --session-id "<session_id>" \
  --iterative \
  --max-rounds 8 \
  --require-human-approval
```

## Required References

- Writing archetypes (canonical writing templates): `references/writing-archetypes.md`
- Writing checklist and rubric: `references/writing-checklist.md`
- Workflow and gating contract: `references/workflow-outline-mode.md`
- Authoring payload contract: `references/authoring-payload-contract.md`
- Layout mapping policy: `references/layout-mapping.md`
- Quick lookup: `references/layout-cheat-sheet.md`
- Skill structuring basis: `[$skill-creator](/Users/rishi/.codex/skills/.system/skill-creator/SKILL.md)`

## Examples

- "Run outline_confirm mode, propose the outline, and wait for my approval before drafting."
- "Use one_shot mode and generate the full deck with reasonable assumptions."
- "Use `core.swot-analysis` with detailed depth profile and explicit implication chain."
- "Use `finance.pnl-walkthrough` and include table evidence plus interpretation bullets."

## Constraints

- Keep workflow manual-only.
- In `outline_confirm` mode, do not draft sections before outline approval.
- Keep writing policy centralized in writing references.
- Keep layout policy centralized in `layout-mapping.md`.
- Use `layout.<slug>` types only.
- Do not edit diligence template files.

## Failure Modes To Avoid

- Skipping outline approval in `outline_confirm` workflow.
- Drafting without archetype selection and payload structure.
- Producing high-level bullets without evidence objects or source anchors.
- Breaking backward compatibility for legacy sessions.
- Treating visual template similarity as quality proxy over writing depth and decision usefulness.

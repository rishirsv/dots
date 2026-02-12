---
name: kpmg-slidegen-fdd
description: Use this skill to generate one full KPMG FDD deck with model-first layout mapping and heavily templated slide-writing standards.
---

# KPMG Slidegen FDD Skill

This skill creates a full FDD deck in one PPTX and uses templated writing playbooks for repeatable quality.

## Core Rules
1. Always generate one coherent deck, never isolated slide outputs.
2. Always preserve provided facts, entities, and required placeholders.
3. Use only the minimal `knowledge/` files to choose layouts and write content.
4. Keep guidance report-agnostic; do not rely on named report benchmarks.
5. Rewrite weak or sparse slides before final output.

## Required Workflow
1. Read `DECK_CONTRACT.md` and normalize input into a single deck brief.
2. Build an all-slides deck plan before drafting any slide text.
3. Map each slide intent to an approved layout from `knowledge/layout-catalog.md`.
4. Draft and rewrite using:
   - `knowledge/writing-standards.md`
   - `knowledge/section-playbooks.md`
5. Run manual text + image review using the rubric embedded in `knowledge/writing-standards.md`.
6. Output artifacts into `exports/`: `deck-input.json`, `deck-plan.json`, `generation-notes.md`, `deck.pptx`.

## Knowledge Loading Order
1. `knowledge/layout-catalog.md`
2. `knowledge/writing-standards.md`
3. `knowledge/section-playbooks.md`

## Non-Negotiables
- No one-slide-at-a-time workflow.
- No hardcoded verbosity gates.
- No layout choice without explicit intent rationale.
- No unsupported claims or drift from provided facts.
- No finalization when slides are visibly sparse for their layout role.

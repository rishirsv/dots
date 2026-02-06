# Talkbook Consulting Copilot Implementation Plan

## Non-technical phase summary

1. Scaffold and foundations
- Create a clean, portable skill folder so anyone can run the workflow consistently.

2. Co-writing workflow
- Let users build deck content together with the assistant, section by section, while saving work continuously.

3. Layout mapping with guidance
- Put all slide selection quality rules in one place so content is reliably matched to the right visual layout.

4. JSON compilation
- Convert written content into a stable machine-readable deck format that maps to Talkbook layout types.

5. Deck build and QA
- Generate slides and run layout safety checks so outputs are usable and brand-safe.

6. Iterative formatting loop
- Re-run generation and apply targeted fixes until formatting issues are reduced or resolved.

7. Documentation and demo readiness
- Document exactly how to run this in a meeting/demo setting with minimal setup.

8. Regression and freeze guardrails
- Protect existing Diligence behavior by failing fast if frozen artifacts drift.

## Task list

- [x] 1.0 Create skill scaffold with manual-only invocation
  - [x] 1.1 Initialize skill folder and interface metadata
  - [x] 1.2 Add required folders (`scripts`, `references`, `examples`, `sessions`, `runtime`)
  - [x] 1.3 Validation for 1.0 (skill metadata generation)

- [x] 2.0 Add session lifecycle scripts
  - [x] 2.1 `start_session.py`
  - [x] 2.2 `upsert_section.py`
  - [x] 2.3 `apply_action.py`
  - [x] 2.4 Validation for 2.0 (unit tests)

- [x] 3.0 Add comprehensive layout mapping with integrated guidance
  - [x] 3.1 `references/layout-mapping.md` canonical policy
  - [x] 3.2 Include blue/white variants and parity-sensitive layouts
  - [x] 3.3 `references/layout-cheat-sheet.md`
  - [x] 3.4 Validation for 3.0 (coverage tests)

- [x] 4.0 Add native JSON compilation layer
  - [x] 4.1 `compile_deck_json.py`
  - [x] 4.2 Required-slot diagnostics and deterministic hash
  - [x] 4.3 Validation for 4.0 (lifecycle + deterministic compile tests)

- [x] 5.0 Add deck build + strict QA pipeline
  - [x] 5.1 Runtime generator `runtime/generator/index.js`
  - [x] 5.2 `build_deck.py` strict overlap/out-of-bounds checks
  - [x] 5.3 Validation for 5.0 (lifecycle build test)

- [x] 6.0 Add iterative formatting-fix loop hooks
  - [x] 6.1 Multi-round build mode with max-round stop
  - [x] 6.2 Auto-fix application and per-round artifact storage
  - [x] 6.3 Optional PNG rendering hooks
  - [x] 6.4 Validation for 6.0 (script integration test path)

- [x] 7.0 Add repo documentation and demo runbook
  - [x] 7.1 Skill README and usage examples
  - [x] 7.2 Root `ARCHITECTURE.md` and `docs/SPEC.md` updates
  - [x] 7.3 Critical learnings documented in root `AGENTS.md`
  - [x] 7.4 Validation for 7.0 (docs reviewed for completeness)

- [x] 8.0 Add regression and Diligence freeze checks
  - [x] 8.1 `test_diligence_freeze_guard.py`
  - [x] 8.2 `diligence_freeze_manifest.json`
  - [x] 8.3 Validation for 8.0 (full test run)

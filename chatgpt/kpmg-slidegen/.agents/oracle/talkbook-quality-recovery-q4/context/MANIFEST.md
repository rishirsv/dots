# Oracle context manifest

- Created (UTC): 2026-02-06T22:42:06.554495+00:00
- Repo root: /Users/rishi/Code/ai-tools/chatgpt/kpmg-slidegen
- Files included: 43
- Total raw size (before zip): 497.9 KB

## Task summary
Diagnose Talkbook quality/style failures and return a decision-complete remediation implementation plan

## Constraints / preferences
- Must reach consulting-grade writing density and visual coherence benchmarked against Project North and NVIDIA examples
- Preserve backward compatibility where feasible; avoid vague advice

## How to verify locally
If you want to confirm the advice locally, these checks/commands are relevant:

- `python3 -m unittest discover -s tests -p 'test_talkbook*.py'`
- `python3 dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py --session-id v2-fresh-ai-grid-20260206`

## Excludes applied
- Default excludes: disabled (`--no-default-excludes`).

## Largest files (by raw size)
- `dist/kpmg-talkbook-consulting-copilot/sessions/v2-fresh-ai-grid-20260206/outputs/runs/20260206-222848/round-02/candidate_png/candidate-01.png` — 114.0 KB
- `outputs/project-north/png/slide-01.png` — 45.7 KB
- `dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py` — 31.2 KB
- `dist/kpmg-talkbook-consulting-copilot/references/writing-archetypes.md` — 30.6 KB
- `generator/builders/table.js` — 25.4 KB

## Files
- `AGENTS.md` — Project-level agent and workflow constraints.
- `ARCHITECTURE.md` — Top-level architecture context.
- `dist/kpmg-talkbook-consulting-copilot/agents/openai.yaml` — Prompt wiring used by assistant.
- `dist/kpmg-talkbook-consulting-copilot/examples/use-cases.md` — Usage examples.
- `dist/kpmg-talkbook-consulting-copilot/README.md` — Skill documentation and flow.
- `dist/kpmg-talkbook-consulting-copilot/references/authoring-payload-contract.md` — Payload schema contract.
- `dist/kpmg-talkbook-consulting-copilot/references/layout-cheat-sheet.md` — Layout reference.
- `dist/kpmg-talkbook-consulting-copilot/references/layout-mapping.md` — Layout scoring + density limits.
- `dist/kpmg-talkbook-consulting-copilot/references/workflow-outline-mode.md` — Workflow-gating contract.
- `dist/kpmg-talkbook-consulting-copilot/references/writing-archetypes.md` — Archetype writing contracts.
- `dist/kpmg-talkbook-consulting-copilot/references/writing-checklist.md` — Checklist/rubric contract.
- `dist/kpmg-talkbook-consulting-copilot/runtime/generator/index.js` — Current lightweight Talkbook renderer.
- `dist/kpmg-talkbook-consulting-copilot/scripts/approve_outline.py` — Outline approval gate logic.
- `dist/kpmg-talkbook-consulting-copilot/scripts/build_deck.py` — Render/inspection/autofix behavior.
- `dist/kpmg-talkbook-consulting-copilot/scripts/common.py` — Session schema and migration defaults.
- `dist/kpmg-talkbook-consulting-copilot/scripts/compile_deck_json.py` — Layout chooser + slot synthesis + quality scoring.
- `dist/kpmg-talkbook-consulting-copilot/scripts/materialize_outline.py` — Outline->section materialization.
- `dist/kpmg-talkbook-consulting-copilot/scripts/start_session.py` — Session bootstrap and workflow mode.
- `dist/kpmg-talkbook-consulting-copilot/scripts/upsert_outline.py` — Outline upsert logic.
- `dist/kpmg-talkbook-consulting-copilot/scripts/upsert_section.py` — Section payload handling.
- `dist/kpmg-talkbook-consulting-copilot/sessions/v2-fresh-ai-grid-20260206/compile_report.json` — Current quality diagnostics.
- `dist/kpmg-talkbook-consulting-copilot/sessions/v2-fresh-ai-grid-20260206/deck.json` — Current compiled slot payload.
- `dist/kpmg-talkbook-consulting-copilot/sessions/v2-fresh-ai-grid-20260206/outputs/runs/20260206-222848/round-01/applied_fixes.json` — Autofixes that trimmed output.
- `dist/kpmg-talkbook-consulting-copilot/sessions/v2-fresh-ai-grid-20260206/outputs/runs/20260206-222848/round-01/inspect/strict-summary.json` — Strict summary round 1.
- `dist/kpmg-talkbook-consulting-copilot/sessions/v2-fresh-ai-grid-20260206/outputs/runs/20260206-222848/round-02/candidate_png/candidate-01.png` — Current output example slide.
- `dist/kpmg-talkbook-consulting-copilot/sessions/v2-fresh-ai-grid-20260206/outputs/runs/20260206-222848/round-02/inspect/strict-summary.json` — Strict summary round 2.
- `dist/kpmg-talkbook-consulting-copilot/sessions/v2-fresh-ai-grid-20260206/outputs/runs/20260206-222848/run_result.json` — Current run result summary.
- `dist/kpmg-talkbook-consulting-copilot/SKILL.md` — Current skill behavior and mandatory steps.
- `docs/talkbook-consulting-copilot/plan-talkbook-consulting-copilot.md` — Original Talkbook plan context.
- `docs/talkbook-consulting-copilot/plan-talkbook-v2-outline-flow.md` — V2 architecture plan.
- `docs/talkbook-consulting-copilot/research-talkbook-writing-guidelines.md` — Research findings on writing and density.
- `docs/talkbook-consulting-copilot/validation-talkbook-v2-outline-flow.md` — V2 validation results.
- `generator/builders/cover.js` — Higher-fidelity generator implementation sample.
- `generator/builders/table.js` — Higher-fidelity generator implementation sample.
- `generator/builders/text-chart.js` — Higher-fidelity generator implementation sample.
- `generator/builders/two-column.js` — Higher-fidelity generator implementation sample.
- `outputs/project-north/png/slide-01.png` — Gold-standard Project North visual/style example.
- `README.md` — Project overview.
- `tests/test_talkbook_copilot_lifecycle.py` — Lifecycle and workflow tests.
- `tests/test_talkbook_payload_contract.py` — Payload contract tests.
- `tests/test_talkbook_skill_instruction_contract.py` — Skill contract tests.
- `tests/test_talkbook_workflow_contract.py` — Workflow contract tests.
- `tests/test_talkbook_writing_guide_contract.py` — Writing-guide contract tests.

## Notes
- `prompt.md` is intentionally excluded; paste it separately into ChatGPT Pro.
- Treat files as authoritative; prefer citing exact paths when making claims.

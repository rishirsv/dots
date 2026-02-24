---
owner: kpmg-slidegen maintainers
status: active
last-reviewed: 2026-02-23
review-cycle-days: 14
source-of-truth: TODOS.md
verification-state: partially-verified
---

# TODOs

## Completed Baseline

- [x] Add a tiny smoke script to run one sample generation and assert both output files exist.
- [x] Add a documented `deckSpec` schema reference (required and optional slide fields).
- [x] Add one regression script covering postprocess QA shape for success/failure/unavailable flows.
- [x] Add one comprehensive visual validation script that checks individual PNG slides and montage output.
- [x] Add a comprehensive lorem deck to stress-test supported layouts.
- [x] Scaffold `skills/kpmg-slides` with skill instructions, references, and canonical run script.
- [x] Add model-facing deck authoring docs (`docs/DECKSPEC-SCHEMA.md`, `docs/DECKSPEC-SLOTS-SCHEMA.json`, `docs/DECK-AUTHORING-PLAYBOOK.md`).

## Priority Now

- [x] Add one golden QA fixture for regression checks on report shape.
- [x] Add one failing example deck for validation behavior testing.
- [x] Create `scripts/sync-skill-bundle.mjs` to sync generator/runtime/templates/docs into `skills/kpmg-slides/assets` and `skills/kpmg-slides/references`.
- [x] Add `npm` commands for skill sync and drift checks (`skill:sync`, `skill:verify`).
- [x] Add a skill-only smoke test that runs from `skills/kpmg-slides` using only synced skill files and writes deterministic artifacts.
- [x] Add a no-absolute-path check for `skills/kpmg-slides` (fail if `/Users/`, `/code/`, or repo-external paths are referenced).
- [x] Add a sync guard that fails if synced skill bundle files drift from source without re-running sync.
- [x] Trim skill distributable fixtures to essentials (`skill-smoke`) and make sync prune stale managed files.
- [x] Vendor local slides postprocess runtime into repo and bundle it into skill sync output.
- [ ] Expand `skills/kpmg-slides/SKILL.md` with explicit mode policy: compile-from-context, guided-planning, and surgical-revision.
- [ ] Add copy-paste prompt templates for each skill mode in `skills/kpmg-slides/references/`.

## Next

- [ ] Add a benchmark scenario fixture for `mid-thread compile` with dense prior context.
- [ ] Add a benchmark scenario fixture for `zero-context planning` that starts from user Q&A.
- [ ] Add a benchmark scenario fixture for `revision loop` with targeted slide edits.
- [ ] Add an output-quality rubric for skill runs (slot correctness, narrative quality, visual density, source coverage).
- [ ] Add a chart `opts` catalog with approved presets by chart type for model-safe authoring.
- [ ] Add a golden deckspec example library (one polished reference per supported slide type with rationale).
- [ ] Add a QA interpretation guide mapping common errors/warnings to concrete fix actions.
- [ ] Add a brief release checklist for template package changes.

## Parked By Decision

- [ ] Add a real-world golden deck library (20-25 page polished examples) and run on-demand visual QA against those fixtures once the local slides runtime is embedded.

## CI And Release

- [ ] Add CI wiring for `npm run smoke` and `npm run test:postprocess`.
- [ ] Add optional CI profile for visual validation in environments where slides Python deps are installed.
- [ ] Add a release gate that requires `skill:verify` success before publishing/updating the skill bundle.

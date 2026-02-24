# KPMG Slides Skill Rebuild Plan

Status: Completed  
Last updated: 2026-02-24

## Phase 1: Clarify skill behavior
Non-technical goal: make the skill easy to follow from start to finish with one clear workflow.

- [x] Rewrite `skills/kpmg-slides/SKILL.md` to a strict 5-stage workflow.
- [x] Add a compact settings contract with defaults.
- [x] Define a fixed output format with concise QA reporting.

## Phase 2: Consolidate references
Non-technical goal: reduce confusion by keeping only the docs that are truly needed.

- [x] Standardize skill references to four essential files.
- [x] Add source docs for QA rules and output examples.
- [x] Update skill references list to new names.

## Phase 3: Sync/distribution integrity
Non-technical goal: ensure the distributable skill stays aligned with repo source files.

- [x] Update `scripts/sync-skill-bundle.mjs` file mapping to new reference names.
- [x] Run `npm run skill:sync`.
- [x] Run `npm run skill:verify`.

## Phase 4: Repository guidance
Non-technical goal: keep contributors aligned on how to maintain the skill.

- [x] Update `AGENTS.md` with concise skill reference/sync guidance.
- [x] Mark legacy planning doc as superseded by this plan.

## Validation checklist

- [x] Confirm no stale links to old skill reference names remain.
- [x] Confirm `skills/kpmg-slides/references/` contains only the essential files after sync.
- [x] Confirm smoke verification passes through `skill:verify`.

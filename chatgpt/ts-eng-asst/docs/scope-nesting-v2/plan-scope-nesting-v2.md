# Implementation Plan: Nested Scope Library v2 (TS-SoW)

## Description
Introduce a new nested scope library file that preserves all text but adds explicit parent/child structure and sequential top-level ids. Update the generator and prompt to consume the v2 file while keeping the legacy file intact for review and rollback.

## Phases (Non-Technical)
- Phase 1: Generate a new scope file with nested bullets while keeping the original untouched.
- Phase 2: Update the generator to read nested bullets and apply top-level selection correctly.
- Phase 3: Update the assistant prompt to reflect the new file and Canvas labels.
- Phase 4: Validate indentation and exclusion behavior in the output document.

## Tasks
- [x] 1.0 Create v2 builder + generate nested scope files
  - [x] 1.1 Add a script to build v2 nested scope JSON from the current flat file
  - [x] 1.2 Generate `dist/scope-library.json`
  - [x] 1.3 Generate `reference/scope-library.json`
  - [x] 1.4 Validate that all bullet text is unchanged in v2 outputs
- [x] 2.0 Update generator + helper functions
  - [x] 2.1 Support nested bullet objects with `text` + `children`
  - [x] 2.2 Use top-level `id` for exclusion; keep legacy flat-list support
  - [x] 2.3 Keep sequential ids stable if present; assign only when missing
- [x] 3.0 Update assistant prompt
  - [x] 3.1 Point to `scope-library.json`
  - [x] 3.2 Canvas labels use `Section heading — Parent text`, hide ids, hide children
- [ ] 4.0 Validation
  - [x] 4.1 Run scope replacement test using v2 file
  - [ ] 4.2 Verify indentation and exclusion behavior in Word output

## Acceptance Criteria
- The original legacy scope file `reference/fdd_scope_library.json` remains unchanged.
- v2 files are generated with nested bullets and sequential top-level ids.
- Generator can consume v2 files and indent children correctly.
- Canvas instructions match the new label and visibility rules.
- Manual spot-check confirms parent/child indentation for known cases.

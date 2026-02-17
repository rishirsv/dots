# Plan: Autobahn Gold Standard FDD Deck

## Goal
Generate a gold-standard KPMG FDD deck from the exact report-body text in `/Users/rishi/Code/ai-tools/chatgpt/ts-report-writer/extracted/autobahn-extracted.md` and export validated artifacts in `dist/kpmg-slidegen-fdd/exports`.

## Phases (non-technical)
1. Prepare source content:
Confirm which part of the extraction file is true report content and isolate it cleanly.
2. Build deck artifacts:
Turn that content into deck input, planning, and render spec files while preserving wording exactly.
3. Validate and render:
Run schema + strict generation checks and produce final PPTX/PDF outputs.
4. Record evidence:
Document what was generated, what assumptions were used, and validation results.

## Task List
- [x] 1.0 Prepare source content and section map
  - [x] 1.1 Parse report-body sections from `autobahn-extracted.md`
  - [x] 1.2 Build canonical slide mapping (including subsection handling)
  - [x] 1.3 Validation for 1.0: quick heading/count sanity check
- [x] 2.0 Generate deck artifacts in dist exports
  - [x] 2.1 Write `deck-input.json`
  - [x] 2.2 Write `deck-plan.json`
  - [x] 2.3 Write `deck-spec.json` with exact text payload
  - [x] 2.4 Validation for 2.0: `node generator/validate.js`
- [x] 3.0 Render and produce Autobahn gold-standard outputs
  - [x] 3.1 Generate strict PPTX from Autobahn deck spec
  - [x] 3.2 Convert PPTX to PDF
  - [x] 3.3 Save Autobahn-named output copies
  - [x] 3.4 Validation for 3.0: confirm output files exist and strict run passes
- [x] 4.0 Document run details
  - [x] 4.1 Update `generation-notes.md` with Autobahn run metadata
  - [x] 4.2 Mark checklist completion and summarize any caveats

# Plan: Excel Questionnaire Autofill (Post‑Notes) — Meeting Intelligence

## Summary
Add a post‑notes workflow to Meeting Intelligence that ignores Excel uploads during initial notes creation, and after notes exist can ingest an Excel questionnaire and fill responses per sheet by writing into the column immediately to the right of each detected question column.

## Phases (non-technical)
1. **Guardrails**: Keep the meeting-notes flow unchanged and prevent Excel from distracting the model until notes are complete.
2. **Spreadsheet fill**: After notes exist, detect questions and write answers into the adjacent response column.
3. **Packaging for review**: Produce updated prompt files in `dist2/` with a `diff.md` so changes are easy to review.

## Task list
- [ ] 1.0 Guardrails: block Excel during initial notes
  - [ ] 1.1 Add prompt rule to not process Excel until notes are generated
  - [ ] 1.2 Add instruction to proceed with transcript processing normally
  - [ ] 1.3 Validate: Excel + transcript still yields notes output

- [ ] 2.0 Post-notes Excel autofill workflow
  - [ ] 2.1 Define trigger: notes already generated OR explicit “fill questionnaire” request
  - [ ] 2.2 Detect question column per sheet (auto; rightmost tie-break)
  - [ ] 2.3 For each question row, write answer into immediately-right column (overwrite)
  - [ ] 2.4 Leave blank if not supported by notes; no invention
  - [ ] 2.5 Output: downloadable filled workbook (`.filled.xlsx` / `.filled.xlsm`)

- [ ] 3.0 Deliver `dist2/` mirror + `diff.md`
  - [ ] 3.1 Copy `meeting-intelligence/dist/*` → `meeting-intelligence/dist2/*`
  - [ ] 3.2 Update only `meeting-intelligence/dist2/meeting-intelligence.md` (unless others required)
  - [ ] 3.3 Create `meeting-intelligence/dist2/diff.md` with per-file diffs

- [ ] 4.0 Manual validation scenarios
  - [ ] 4.1 Transcript + Excel together: Excel ignored, notes produced
  - [ ] 4.2 Post-notes `.xlsx` multi-tab: questions detected, adjacent column filled, overwrites existing
  - [ ] 4.3 AO-ish far-right question column: rightmost tie-break works
  - [ ] 4.4 `.xlsm` upload: output remains `.xlsm` and opens

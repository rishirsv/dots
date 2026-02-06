# Repo Unification Plan (kpmg-pptx-gen + kpmg-slidegen)

## Goal

Merge the split project folders into one canonical repository path (`kpmg-slidegen`) without regressing Diligence outputs.

## Phases (non-technical)

1. Baseline and freeze protection
- Capture what “good” looks like today for Diligence so we can prove nothing changed.

2. Structural unification
- Move the tracked project into the final folder name and bring over only the additional source files from the orphan folder.

3. Documentation alignment
- Merge duplicated docs so one set accurately explains both core generator architecture and Talkbook distribution workflows.

4. Regression validation
- Re-run test suites and freeze checks to verify behavior did not drift.

5. Cleanup
- Remove orphan folder and leave one canonical project path.

## Task list

- [x] 1.0 Baseline and freeze protection
  - [x] 1.1 Capture pre-merge Diligence manifest snapshot.
  - [x] 1.2 Run baseline generator/extractor tests before merge.
  - [x] 1.3 Persist/refresh repository Diligence freeze manifest.

- [x] 2.0 Structural unification
  - [x] 2.1 Preserve orphan folder as temporary source.
  - [x] 2.2 Rename tracked `kpmg-pptx-gen` to `kpmg-slidegen` with history.
  - [x] 2.3 Copy unique Talkbook source files, tests, and docs.
  - [x] 2.4 Copy Talkbook template media assets required for fidelity.

- [x] 3.0 Documentation alignment
  - [x] 3.1 Merge `AGENTS.md` with critical learnings and guardrails.
  - [x] 3.2 Merge `ARCHITECTURE.md` to cover core + distributions.
  - [x] 3.3 Merge `docs/SPEC.md` interface/contracts.
  - [x] 3.4 Update root README to canonical name.

- [x] 4.0 Regression validation
  - [x] 4.1 Run python test suite in unified path.
  - [x] 4.2 Run node smoke test in unified path.
  - [x] 4.3 Run Talkbook lifecycle/mapping tests.
  - [x] 4.4 Run Diligence freeze guard and compare with pre-merge snapshot.

- [x] 5.0 Cleanup
  - [x] 5.1 Remove temporary orphan folder after validation.
  - [x] 5.2 Verify no second KPMG folder remains.

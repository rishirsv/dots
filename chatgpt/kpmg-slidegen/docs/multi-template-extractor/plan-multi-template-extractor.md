# Multi-Template Extractor Upgrade - Implementation Plan Record

This file tracks execution of the multi-template extractor plan.

## Phase outcomes (non-technical)

1. Template setup automation:
- We can create a brand-new template project quickly and consistently.

2. Extractor generalization:
- The extractor now understands more of the template structure, including masters and layout relationships.

3. Asset automation:
- Missing asset manifests are generated automatically so onboarding does not block on manual prep.

4. Strategy split:
- Diligence keeps its existing generation contract while new templates can use native layout contracts.

5. Profile tuning:
- Each template can override behavior locally without touching shared or Diligence-specific files.

6. Visual tuning loop:
- We can run iterative reference-vs-generated comparisons and keep round-by-round artifacts.

7. Talkbook onboarding:
- Talkbook now has a native scaffold and generated contract under `templates/kpmg-talkbook`.

8. Regression + docs:
- Test coverage and documentation were updated to support handoff.

## Task list

- [x] 1.0 Add scaffold command
  - [x] 1.1 Add `init-template` in CLI
  - [x] 1.2 Copy source POTX into new template directory
  - [x] 1.3 Create standard template folders and seed files
  - [x] 1.4 Validation: command runs and creates expected files

- [x] 2.0 Generalize extractor core
  - [x] 2.1 Add multi-master graph model
  - [x] 2.2 Add layout-to-master mapping
  - [x] 2.3 Add dynamic slide-dimension extraction
  - [x] 2.4 Validation: part-graph tests pass

- [x] 3.0 Automate assets pipeline
  - [x] 3.1 Add auto generation for `assets-base64.json`
  - [x] 3.2 Add auto generation for `gradient_data_uris.json`
  - [x] 3.3 Make extract resilient when manifests are missing
  - [x] 3.4 Validation: native codegen test validates manifest creation

- [x] 4.0 Split codegen strategy (legacy + native)
  - [x] 4.1 Keep legacy Diligence path
  - [x] 4.2 Add native layout contract generation
  - [x] 4.3 Add deterministic layout-type keying
  - [x] 4.4 Validation: deterministic key test passes

- [x] 5.0 Add profile merge layer
  - [x] 5.1 Load `template.profile.json`
  - [x] 5.2 Merge required slots/aliases/layout names/master mapping/token and style overrides
  - [x] 5.3 Validation: profile drives generated native output

- [x] 6.0 Add visual parity loop
  - [x] 6.1 Add `tune-template` CLI command
  - [x] 6.2 Add reference and candidate render pipeline (PDF->PNG)
  - [x] 6.3 Add hybrid metrics + thresholds + stop conditions
  - [x] 6.4 Add auto-fix profile mutation per round
  - [x] 6.5 Validation: loop runs and writes required artifacts

- [x] 7.0 Onboard Talkbook
  - [x] 7.1 Create `templates/kpmg-talkbook`
  - [x] 7.2 Copy `PPT_Generic_talkbook_standard_EN.potx`
  - [x] 7.3 Generate native `template.json` + `template.js`
  - [x] 7.4 Seed benchmark samples
  - [x] 7.5 Validation: validate/generate smoke path succeeds (`--no-strict`), strict reports generated

- [x] 8.0 Regression, freeze checks, and docs
  - [x] 8.1 Add/extend tests for graph/native/tuning
  - [x] 8.2 Add Diligence freeze check test
  - [x] 8.3 Update architecture/spec docs
  - [x] 8.4 Add onboarding runbook
  - [x] 8.5 Validation: full Python test suite passes

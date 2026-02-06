# Validation: Talkbook V2 Outline Flow + One-Shot

## Scope

This validation verifies the Talkbook V2 re-architecture in four scenarios:

1. Strategy topic in `outline_confirm` mode
2. Finance topic in `outline_confirm` mode
3. Strategy topic in `one_shot` mode
4. Finance topic in `one_shot` mode

Validation goals:

- Confirm workflow behavior and compile/build reliability in both paths.
- Confirm payload-first depth checks run and report quality metrics.
- Confirm outline adherence diagnostics and strict inspection outputs are produced.

## Run Summary

| Session | Mode | Stage at Compile Report | Slides | Avg Advisory Score | Depth Warnings | Outline Unmatched Ratio | Report Warnings |
|---|---|---|---:|---:|---:|---:|---:|
| `v2-outline-strategy` | `outline_confirm` | `compiled` | 3 | 40.0 | 0 | 0.0 | 0 |
| `v2-outline-finance` | `outline_confirm` | `compiled` | 3 | 40.0 | 0 | 0.0 | 0 |
| `v2-oneshot-strategy` | `one_shot` | `compiled` | 3 | 40.0 | 0 | 0.0 | 0 |
| `v2-oneshot-finance` | `one_shot` | `compiled` | 3 | 40.0 | 0 | 0.0 | 0 |

## Artifacts

### Outline Confirm

- Strategy compile report: `dist/kpmg-talkbook-consulting-copilot/sessions/v2-outline-strategy/compile_report.json`
- Strategy run output: `dist/kpmg-talkbook-consulting-copilot/sessions/v2-outline-strategy/outputs/runs/20260206-214207`
- Finance compile report: `dist/kpmg-talkbook-consulting-copilot/sessions/v2-outline-finance/compile_report.json`
- Finance run output: `dist/kpmg-talkbook-consulting-copilot/sessions/v2-outline-finance/outputs/runs/20260206-214214`

### One-Shot

- Strategy compile report: `dist/kpmg-talkbook-consulting-copilot/sessions/v2-oneshot-strategy/compile_report.json`
- Strategy run output: `dist/kpmg-talkbook-consulting-copilot/sessions/v2-oneshot-strategy/outputs/runs/20260206-214221`
- Finance compile report: `dist/kpmg-talkbook-consulting-copilot/sessions/v2-oneshot-finance/compile_report.json`
- Finance run output: `dist/kpmg-talkbook-consulting-copilot/sessions/v2-oneshot-finance/outputs/runs/20260206-214228`

## Visual Inspection Outcomes

All four runs produced strict inspection summaries with:

- `valid: true`
- `overlaps.severeCount: 0`
- `overlaps.warningCount: 0`
- `bounds.outOfBoundsCount: 0`
- `missingSlots: []`

Example strict summary path:
`dist/kpmg-talkbook-consulting-copilot/sessions/v2-outline-strategy/outputs/runs/20260206-214207/inspect/strict-summary.json`

## Workflow Behavior Checks

1. `outline_confirm` path required explicit approval before drafting and compilation.
2. `one_shot` path proceeded without manual approval and still preserved outline artifacts in session history.
3. Compile reports included workflow metadata (`mode`, `stage`) and advisory quality summaries.
4. Both modes reached `workflow.stage = compiled` after compile.

## Comparison To Prior Baseline

The prior V1 validation (`validation-talkbook-writing-guidelines.md`) reported qualitative rubric totals of:

- Strategy: `30 / 40`
- Finance: `32 / 40`

V2 introduces explicit depth-contract diagnostics at compile time. In all four V2 runs, section payloads met detailed-profile minima with zero depth warnings and full outline match. This is a process-quality improvement (enforced structure and traceability), not a claim of visual template parity.

## Acceptance Check

- [x] Both workflow modes run successfully end-to-end.
- [x] Outline approval gate behavior is correct in `outline_confirm` mode.
- [x] One-shot bypass works and keeps assumption/outline traceability.
- [x] Payload-first compile path works with advisory depth scoring.
- [x] Strict inspection outputs are valid with no severe/warning overlaps in these runs.
- [x] Validation artifacts are saved and linkable.

## Notes

This validation is based on dense, structured payload inputs designed to exercise the V2 authoring contract. It validates workflow and contract mechanics. Additional quality tuning should continue via archetype guidance and prompt discipline for real-world topics.

# Plan: Talkbook V2 Re-Architecture (Outline-First + One-Shot)

## Summary
This plan re-architects Talkbook from a section-only drafting flow into a workflow-aware system with two modes:
1. `outline_confirm` (default): intake -> outline draft/review -> explicit approval -> drafting.
2. `one_shot` (bypass): assumptions logged, outline auto-approved, drafting starts immediately.

The implementation keeps generator rendering behavior intact and upgrades the authoring contract (schema + workflow + payload) so assistants can produce denser, evidence-led slides with traceable structure.

## User Outcomes (Non-Technical)
1. Users can review and approve a draft outline before full writing starts.
2. Users can skip straight to deep drafting when speed matters.
3. Slide content quality expectations are explicit (claims, evidence, implications, decision ask, sources).
4. Existing sessions still compile without migration work by the user.

## Interface / Contract Changes
1. Session contract upgraded to `version: 2.0`.
2. Added `workflow` object:
   - `mode`: `outline_confirm | one_shot`
   - `stage`: `intake | outline_draft | outline_review | outline_approved | drafting | compiled`
   - `outline_required`
   - `outline_approval`: `{status,timestamp,rationale,approval_source}`
3. Added `outline.sections[]` contract:
   - `section_id`, `title`, `intent`, `archetype_id`, `depth_profile`, `evidence_plan`, `decision_purpose`
4. Extended section contract:
   - `archetype_id`, `outline_section_id`, `depth_profile`, `authoring_payload`
5. CLI updates:
   - `start_session.py`: `--workflow`, `--depth-profile`, `--skip-outline`, `--assumption`
   - `upsert_section.py`: `--archetype-id`, `--outline-section-id`, `--depth-profile`, `--payload-file`
   - new scripts: `upsert_outline.py`, `approve_outline.py`, `materialize_outline.py`
6. Compiler behavior:
   - payload-first synthesis from `authoring_payload`, fallback to legacy markdown
   - advisory depth and outline-adherence diagnostics

## Architectural Decisions
1. **Workflow gating is state-driven** in session JSON; no hidden runtime state.
2. **Depth enforcement is advisory** via compile diagnostics and scores, not hard compile blocking.
3. **Backward compatibility is automatic** via in-memory session migration in `load_session`.
4. **Generator contract changes are minimal**; runtime accepts richer table/chart payload shapes without a layout engine rewrite.

## Implementation Task List
- [x] 1.0 Define V2 schema and migration behavior in shared session utilities.
- [x] 1.1 Define workflow state model and approval gate semantics.
- [x] 1.2 Define depth profile minima and payload depth checks.
- [x] 2.0 Extend `start_session.py` for workflow/depth/one-shot controls.
- [x] 2.1 Add `upsert_outline.py`.
- [x] 2.2 Add `approve_outline.py`.
- [x] 2.3 Add `materialize_outline.py`.
- [x] 2.4 Extend `upsert_section.py` for payload + archetype linkage and outline gate checks.
- [x] 3.0 Upgrade `compile_deck_json.py` to payload-first slot synthesis.
- [x] 3.1 Add compile diagnostics for depth completeness and outline adherence.
- [x] 3.2 Preserve V1 compatibility through migration defaults.
- [x] 4.0 Re-architect skill flow in `SKILL.md` around intake -> outline -> approval -> drafting -> checklist -> compile.
- [x] 4.1 Update `agents/openai.yaml` to stage-aware behavior and one-shot path.
- [x] 4.2 Add workflow reference doc.
- [x] 4.3 Add authoring payload reference doc.
- [x] 4.4 Expand archetype guide with depth contracts.
- [x] 4.5 Expand checklist/rubric with profile-aware criteria.
- [x] 5.0 Add runtime compatibility helpers for richer table/chart payload forms.
- [x] 6.0 Add/extend tests for workflow gate, payload contract, migration, and lifecycle.
- [x] 7.0 Run four validation flows (strategy/finance x outline_confirm/one_shot).
- [x] 8.0 Publish V2 validation report.

## Test Matrix
1. Default session is `outline_confirm` at `intake`.
2. Outline upsert stores required section fields.
3. Drafting is blocked pre-approval in `outline_confirm`.
4. Approval transitions stage to `outline_approved`.
5. `one_shot` starts with auto-approved outline metadata and assumptions.
6. Payload-only sections compile without markdown body.
7. Legacy/V1 sessions compile through migration.
8. Full lifecycle works in both modes.

## Acceptance Criteria
1. Both workflows are operational and documented.
2. Outline approval gate works for `outline_confirm` and is bypassed only by explicit one-shot mode.
3. Authoring payload compiles deterministically to existing layout model.
4. Existing sessions and legacy markdown-only sections remain compatible.
5. Test suite passes.
6. Validation runs show high advisory quality and no depth warnings in both modes.

## Assumptions / Defaults
1. Default mode remains `outline_confirm`.
2. One-shot remains opt-in and logs assumptions.
3. Quality rubric remains advisory in V2.
4. Visual template parity with Project North is not a V2 goal.
5. Generator stack remains canonical; only compatibility-layer input normalization changes.

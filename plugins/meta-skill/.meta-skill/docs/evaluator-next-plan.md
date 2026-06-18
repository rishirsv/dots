# Skill Evaluator Next Plan

This plan covers the next product and runtime upgrades for the evaluator:
trigger tuning, runner choice, and rubric / judge alignment.

## 1. Trigger Tuning

Goal: make description and routing quality measurable.

Implementation:

- Add `references/trigger-tuning.md` as the operational guide.
- Treat trigger tuning as a focused suite type, separate from output quality.
- Require balanced should-trigger and should-not-trigger tasks.
- Use repetitions when activation varies.
- Preserve held-out prompts when tuning repeats.

Done when:

- the evaluator reference map points to trigger tuning
- reports can distinguish activation quality from answer quality
- candidate description changes are discussed as routing changes

## 2. Runner Choice

Goal: make App Server vs direct Codex thread use explicit.

Implementation:

- Keep a concise runner-choice block in `SKILL.md`.
- Use App Server as the formal eval runner for repeatable evidence.
- Use direct Codex threads and subagents for exploration, one-off trials, repair
  attempts, and product review.

Done when:

- skill runtime guidance explains the runner choice without a separate reference
- report language no longer implies runner completion equals quality
- App Server unavailability is reported as a runner blocker, not a skill failure

## 3. Rubric And Judge Alignment

Goal: make model-judge scores trustworthy enough for decisions.

Implementation:

- Keep `unknown`; remove the separate human-review label from the grade vocabulary.
- Add `references/judge-alignment.md` for rubric design, human labels, TPR/TNR,
  and train/validation/test judge-alignment splits.
- Update calibration so TPR means finding human-labeled failures and TNR means
  recognizing human-labeled passes.
- Treat human review as workflow state; use `unknown` as the non-decisive label.
- Put semantic rubrics in `judge.md`; use `graders[]` for metric declarations,
  gates, and report fields.

Done when:

- model and human grade labels are `pass`, `partial`, `fail`, or `unknown`
- calibration reports TPR, TNR, false pass, false fail, exact agreement, and
  unknown-label rate
- evaluator docs explain when a spot-check is enough and when held-out judge
  alignment is required

## Product Direction

The evaluator should feel like a collaborative guide, not a batch script. It
should help the user decide whether to evaluate, what evidence is fair, where
human review is needed, and what conclusion the measured scope supports. The
UX should make refusal, uncertainty, calibration, and coverage limits visible.

# Self-Improve prompt routing and coaching

- **Status:** Approved
- **Suite ID:** `self-improve-prompt-routing-v1`
- **Target:** `self-improve` at `plugins/dots/skills/self-improve/`
- **Target versions:** Recorded in `cases.json`.
- **Decision:** Whether the revised skill is ready to route explicit prompts into active reflection, focused workflow audit, user coaching, rating, and named-skill review without widening scope or inventing evidence.
- **Claim:** Across the ten supplied cases, the skill selects only the requested branch, grounds conclusions in the supplied work, derives coaching categories from representative tasks, and preserves scope and authorization boundaries.
- **Claim kind:** readiness
- **Evidence level:** unproven
- **Why this level:** The source and deterministic timing logic have focused tests, but the new prompt-routing and coaching behavior has not yet been exercised by fresh agents.

## Configuration

One target configuration: the revised source on Codex with the current default model, local read-only inspection, no external mutations, and one fresh worker per case.

## Cases

Ten working cases cover bare invocation, validation friction, combined workflow and harness analysis, task-derived coaching for two different domains, opt-in rating, single-task claim narrowing, direct versus inferred agent friction, explicit all-session scope, and a named-skill positive-null review.

## Evidence and visibility

- Worker-visible: the realistic request, its supplied task/session summaries, and the target skill path.
- Hidden: criteria, expected and prohibited outcomes, other cases, and other worker outputs.
- Graders: narrow human criteria defined in `cases.json`; each begins with an observable pass condition.
- Blind comparison: none; this is an absolute readiness check.
- Holdout policy: none for this first unproven pass. A future readiness benchmark should reserve confirmation cases after the working set stabilizes.

## Run policy

- Repetitions: 1 per case.
- Timeout: 180 seconds per trial.
- Maximum expected cost: no explicit monetary budget; stop after ten completed or invalid trials.
- External mutations: false.
- Stopping rule: stop on leakage, unavailable fresh workers, external-mutation requests, or three infrastructure failures with the same cause.

## Invalid-run conditions

A trial is invalid when the worker cannot read the target skill, receives prior evaluation conclusions or hidden criteria, mutates source or an external system, or fails for harness/infrastructure reasons before producing an answer.

## Conclusion limits

This suite supports only the tested explicit-invocation routes on the resolved Codex worker configuration. It does not test implicit discovery, cross-host parity, statistical timing accuracy, long-corpus recall, model variance, or actual instruction edits.

## Approval

- **Approved by:** user, through the approved implementation plan and explicit execution request
- **Approved at:** 2026-08-28T00:57:55Z
- **Approved contract SHA-256:** `f414cb861cf0d4fc8a89471d3cfcfe3f53b7590257af88504a5095d8ec3db3fc`

The user approved this evaluation scope in the implementation plan and then instructed Codex to execute it. The digest is recorded after structural validation.

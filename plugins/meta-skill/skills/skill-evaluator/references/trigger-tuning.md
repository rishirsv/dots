# Trigger Tuning

Read when evaluating or improving whether a skill activates at the right time.

Trigger tuning measures the skill description and routing boundary. It is not a
general quality suite. Keep the task prompts stable, vary the candidate skill,
and use repeated trials when activation is noisy.

## When To Use

Use trigger tuning when:

- a `description` change is proposed
- users report the skill fires too often or not often enough
- the skill overlaps with another skill
- packaging or selection depends on reliable routing

Skip trigger tuning for a one-off content fix that does not affect discovery.

Before tuning a frontmatter or description change, run
`plugins/meta-skill/scripts/metaskill validate <skill-dir> --json`. Fix
frontmatter shape, unknown keys, missing body, or package validation failures
before measuring activation.

## Task Set

Create a balanced set before running:

- 8-12 should-trigger prompts that use realistic user language
- 8-12 should-not-trigger near misses
- 2-4 ambiguous prompts marked for human review or expected `unknown`

Do not name the skill in trigger prompts. Naming the skill converts the task
into a quality eval, not an activation eval.

## Splits

For quick local work, use one reviewed set. For repeated optimization, split:

- **train**: examples used to draft description candidates
- **validation**: examples used to choose among candidates
- **test**: held-out examples used once before a selection decision

Save at least a few near misses as held-out checks when a description is tuned
multiple times.

## Graders

Prefer transcript-aware grading for activation:

- code or transcript checks for whether the target skill actually loaded
- model judge for whether the response followed the intended lane
- human spot check for ambiguous near misses

Report activation separately from output quality. A skill can activate
correctly and still produce a weak answer.

## Candidate Loop

1. Freeze the trigger task set.
2. Run current skill and candidate skill with repetitions.
3. Compare should-trigger hit rate, should-not-trigger quiet rate, and unknowns.
4. Inspect false activations and missed activations.
5. Revise the `description` only when the evidence points to a routing defect.
6. Re-run the same validation prompts; use held-out prompts before selection.

Do not optimize the description against the exact phrasing of the validation set.
The goal is a clearer boundary, not memorized examples.

## Report

Close with:

- should-trigger activation rate
- should-not-trigger quiet rate
- ambiguous or unknown cases
- false activations and missed activations
- whether the candidate description improved, regressed, or needs more evidence
- held-out coverage limits

# Methodology

Read when choosing the smallest useful eval loop for a skill.

The default model is intentionally simple:

1. **Baseline** — what the model does without the new skill help.
2. **Skill** — the current skill being measured.
3. **Candidate** — a changed skill candidate, such as an edited branch,
   worktree, or future autoresearch attempt.

This matches the practical loop: write a few realistic prompts, compare the
baseline with the skill, make a candidate, compare again, and keep only evidence
that helps decide the next edit.

## Current Plugin Terms

The plugin uses `candidates` in `.meta-skill/evals.json` for every thing under
test:

- `baseline` will be the no-skill comparison once `source.kind: "none"` lands.
- `current` is the current skill payload.
- `attempt-1`, `candidate-1`, or any other slug can point at a branch, git ref,
  or worktree through `source`.
- Run evidence records the candidate's branch/ref, commit, payload path, and
  `payload_digest`.

Use **candidate** in user-facing explanations and in manifest fields. Do not add
a separate edited-skill vocabulary.

A no-skill baseline is not implemented yet. Track it as the next small platform
addition: a `source.kind: "none"` candidate that runs the same prompt without
staging the skill payload.

## Default Loop

Use this loop for most skill evaluation:

1. Create 2-3 realistic prompts that represent real user requests.
2. Run the prompts against the baseline and the skill.
3. Judge or review the outputs side by side.
4. Turn a proposed fix into a new candidate.
5. Run the same prompts against the skill and candidate.
6. Report which cases improved, regressed, already worked without the skill, or
   still need human judgment.

Prefer side-by-side evidence over abstract scores. A score without a baseline
mostly measures the model plus the skill; a baseline comparison measures skill
lift.

## When To Add Rigor

Add more structure only when the default loop is not enough:

- Use repetitions when trigger behavior or judge grading is visibly variable.
- Save one or two prompts as unseen final checks when an editor is optimizing
  repeatedly against the same prompts.
- Add deterministic validators when the expected behavior can be checked by a
  script.
- Add human spot checks when a model judge is influencing an accept/reject
  decision.

Do not introduce named split systems or calibration labels for ordinary skill
work. Keep the report plain: what was compared, what changed, what is still
uncertain.

## When Not To Evaluate

Do not build a suite when:

- The question is a one-off fix — use `skill-doctor`'s single trial-run route.
- The target is an unstable draft still changing shape; a suite would chase a
  moving target.
- A deterministic validator alone fully answers the question; run it and skip
  the judge.
- Maintaining the suite would cost more than the target's usage justifies.

"Not worth a suite yet" is a valid evaluator outcome. Say it explicitly and
stop.

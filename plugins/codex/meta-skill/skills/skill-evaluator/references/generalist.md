# Generalist Rubric Builder

Read when the target is not an agent skill. Anything can be evaluated; the craft
is building a rubric that represents the artifact's *job*, rather than reaching
for a generic checklist.

A skill gets built-in defaults. Any other artifact — a prompt, a document, a
model output, a product surface, a workflow — earns its rubric from these
questions.

## Derive Dimensions From The Job

Answer these about the target, then turn the answers into dimensions:

- **Job** — what is this artifact for? What does one good instance accomplish?
- **Consumer** — who uses the output, and what do they need from it?
- **Success / failure** — what does an excellent instance look like? A failing
  one? Name concrete, observable differences.
- **Verifiable vs judged** — which qualities can a deterministic check confirm
  (format, presence, bounds), and which need judgment (clarity, usefulness,
  taste)?
- **Failure modes** — how does this kind of artifact usually go wrong? Each
  recurring failure mode is a candidate dimension.
- **Variance tolerance** — must it be identical every time, or is a range
  acceptable? This sets how many runs a case needs.

## Map Answers To The Two Pillars

- **Verifiable qualities → validations.** Deterministic checks, run against the
  artifact — see [validations.md](validations.md).
- **Judged qualities → evaluations.** Anchored 0–3 dimensions graded by a judge,
  calibrated against a human gold subset — see [evaluations.md](evaluations.md)
  and [calibration.md](calibration.md).

## What Carries Over, What Does Not

The anchored-rubric and judge-calibration craft is universal — apply it
unchanged. Triggering is a skill-specialization concept (does the skill fire on a
natural request); most non-skill artifacts have no analog, so skip trigger cases
unless the target genuinely has an activation step.

# Generalist Rubric Builder

Read when the target is not an agent skill. Anything can be evaluated; the craft
is building a rubric that represents the artifact's *job*, rather than reaching
for a generic checklist.

A skill gets built-in defaults. Any other artifact — a prompt, a document, a
model output, a product surface, a workflow — earns its rubric from the questions
below.

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
  acceptable? This sets how many repetitions each case needs.

## Map Answers To The Workbench

- **Suite metadata** goes in `.meta-skill/evals.json`: target, defaults, runner
  plan, splits, candidates, case IDs, and repetitions.
- **Visible task content** goes in `cases/<case-id>/task.md`. It contains only
  bytes the solver may see.
- **Judged criteria** go in `cases/<case-id>/rubric.md`.
- **Exact or reference answers** go in `expected.*`.
- **Deterministic checks** go in `validate.*` or shared `.meta-skill/tests/`.
- **Run evidence** goes under `.meta-skill/runs/<run-id>/`.

## What Carries Over, What Does Not

The anchored-rubric and judge-calibration craft is universal. Apply it unchanged
to non-skill targets.

Triggering is a skill-specialization concept: does the skill fire on a natural
request? Most non-skill artifacts have no analog, so skip trigger cases unless
the target genuinely has an activation step.

Candidate comparison also generalizes, but the candidate source changes by
target. A skill candidate may be a branch/worktree. A prompt candidate may be a
prompt file. A document candidate may be a revised document path. In all cases,
use `candidate` in run evidence and `trial_id` for one execution.

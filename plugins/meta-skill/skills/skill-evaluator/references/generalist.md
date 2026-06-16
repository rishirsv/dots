# Generalist Judge Guidance Builder

Read when the target is not an agent skill. Anything can be evaluated; the craft
is building judge guidance that represents the artifact's *job*, rather than reaching
for a generic checklist.

A skill gets built-in defaults. Any other artifact — a prompt, a document, a
model output, a product surface, a workflow — earns its judge guidance from the questions
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
  recurring failure mode may become a judged dimension.
- **Variance tolerance** — must it be identical every time, or is a range
  acceptable? This sets how many repetitions each task needs.
- **Eval purpose** — is this a capability, regression, gate, failure, trigger,
  or efficiency question? Use [eval-types.md](eval-types.md) to pick the suite
  shape.

## Map Answers To The Workbench

- **Suite metadata** goes in `.meta-skill/evals.json`: target, defaults, runner
  plan, candidates, task IDs, and repetitions. The schema stores candidates in
  `candidates[]`.
- **Visible task content** goes in `cases/<task-id>/task.md`. It contains only
  bytes the agent may see.
- **Judged criteria** go in `cases/<task-id>/judge.md`.
- **Exact or reference answers** go in `expected.*`.
- **Deterministic checks** go in `validate.*` or shared `.meta-skill/tests/`.
- **Run evidence** goes under `.meta-skill/runs/<run-id>/`.

## What Carries Over, What Does Not

Anchored judge guidance and judge-calibration craft are universal. Apply them unchanged
to non-skill targets.

Triggering is a skill-specialization concept: does the skill fire on a natural
request? Most non-skill artifacts have no analog, so skip trigger cases unless
the target genuinely has an activation step.

Candidate comparison also generalizes, but the candidate source changes by
target. A skill candidate may be a branch/worktree. A prompt candidate may be a
prompt file. A document candidate may be a revised document path. In all cases,
use candidate/task/trial language in prose and run evidence.

For non-skill targets, start from concrete examples:

- prompt eval: same task under old-prompt and edited-prompt candidates
- document eval: same review task against current and revised document
- workflow eval: same operational task with different runbook or agent setup
- UI/product eval: same user goal with state checks, screenshots, or artifact
  inspection as outcome graders

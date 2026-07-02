# Evaluations

Read when authoring semantic evaluation tasks for a target.

Evaluations need a judge — an LLM by default, a human when taste or domain
knowledge exceeds the model. They live in the hidden workbench at
`<project>/.<skill-name>/`. Authored suite files can be tracked; generated runs,
workspaces, and calibration artifacts are replaceable output.

Use `../../../references/cli.md` for materialization, runner selection,
progress, and grading commands.

## Authoring Model

Use a hidden suite manifest plus materialized task folders:

```text
.<skill-name>/
  evals.json
  cases/
    <task-id>/
      task.md
      fixtures/
      judge.md
      expected.*
      validate.*
```

`evals.json` is authoritative for metadata: target, defaults, runner plan,
repetitions, candidate guidance, realistic prompts, expectations, and
materialization intent.

Task folders are authoritative for authored content after materialization:
visible task bytes, fixtures, judge guidance, expected outputs, and validator
code. The directory is still named `cases/` in today's file layout, but the
user-facing concept is an evaluation task.

`task.md` contains only bytes the agent may see. Do not put YAML front matter,
expected output, judge guidance, validator hints, grader notes, target metadata, or
harness instructions in `task.md`.

Use [eval-vocabulary.md](../../../references/eval-vocabulary.md) for
suite/task/candidate/trial/transcript/outcome/grader terms.

## Writer-Facing `evals.json`

Skill Writer may create a compact suite manifest in
`<project>/.<skill-name>/evals.json`. This is the preferred authoring handoff:

```json
{
  "skill_name": "commit-message-normalizer",
  "defaults": {
    "runner": "codex_app_server",
    "repetitions": 1
  },
  "candidates": [
    {
      "candidate": "no-skill",
      "display": "No skill baseline",
      "source": { "kind": "none" }
    },
    {
      "candidate": "current",
      "display": "Current skill",
      "source": { "kind": "current_worktree", "ref": "." }
    }
  ],
  "cases": [
    {
      "id": "natural-trigger",
      "type": "trigger",
      "repetitions": 5,
      "task": {
        "prompt": "Ask for a skill improvement without naming the skill."
      },
      "fixtures": ["fixtures/source-skill.md"],
      "expectations": [
        "The response routes to skill-improvement behavior.",
        "The response does not expose hidden grading instructions."
      ],
      "graders": [
        {
          "id": "activation-judge",
          "kind": "model",
          "metric": "activation",
          "path": "judge.md",
          "uses_transcript": true
        },
        {
          "id": "prompt-boundary",
          "kind": "code",
          "metric": "boundary",
          "path": "validate.py",
          "required": true,
          "gate": true
        },
        {
          "id": "human-review",
          "kind": "human",
          "metric": "usefulness"
        }
      ]
    }
  ]
}
```

The CLI uses `candidates[]` for agent-harness setups and `cases[]` for
writer-authored tasks. Keep the manifest small: `task.md` (visible task),
`fixtures/` (visible files copied into the workspace when listed),
`judge.md` (hidden judge guidance), `expected.*` (hidden oracle/reference
output), `validate.*` (hidden deterministic validator), `expectations[]`
(optional hidden checklist), `graders[]` (optional hidden declaration).

Inline task text belongs in `task.prompt`. File-backed tasks use
`task.path` and require the referenced task file, usually
`cases/<task-id>/task.md`. A materializer must not overwrite existing authored
content unless the caller explicitly forces it.

Candidates change the agent harness while the task prompt stays the same. A
no-skill candidate uses `source.kind: "none"` and stages no skill payload.

## Fixture And Example Lifecycle

Prefer real failures, traces, or common workflows as task sources. Synthetic
fixtures are allowed for coverage, but label them as synthetic and do not make
them blocking gates until a human has reviewed the expected behavior. Keep
fixtures small and inspectable; preserve original real examples when
possible — they are better regression seeds than polished invented tasks.

## Grader Declaration

Graders may be implicit or explicit. Implicit discovery keeps small suites
cheap: if `judge.md` exists, the grader runs a model judge; if `validate.*`
exists, each validator runs as a code grader. Use explicit `graders[]` when a
task needs named metrics, required gates, or a stable report contract:

```json
{
  "expectations": [
    "The output includes validation guidance.",
    "The output avoids source-specific provenance."
  ],
  "graders": [
    {
      "id": "quality-judge",
      "kind": "model",
      "metric": "quality",
      "path": "judge.md"
    },
    {
      "id": "exact-structure",
      "kind": "code",
      "metric": "structure",
      "path": "validate.py",
      "required": true,
      "gate": true
    }
  ]
}
```

Supported grader `kind` values: `code` (runs the named `validate.*` file),
`model` (runs the judge guidance or expectation judge; set
`uses_transcript: true` only when grading process behavior or needing
mid-conversation evidence), and `human` (creates a pending `unknown` row
until a reviewer records the label with `eval human`) — see
[eval-types.md](eval-types.md#choose-the-grader-mix) for when to choose
each. `required` or `gate` means the grader is blocking: a candidate may
score well and still record a failed state for that check if a gate fails.

`expectations[]` are hidden verifier statements, not copied into `task.md`;
the model judge uses them to emit named checks with evidence. Exact
expectations should still move into `validate.*` whenever code can check
them fairly. `eval run` preflight-lints the suite automatically; run `eval
run --check --suite .<skill-name>/evals.json` to catch missing grader,
reference, and balance issues before running trials.

## Task Types

Recognized `type` values live in
[eval-vocabulary.md](../../../references/eval-vocabulary.md#recognized-task-types);
choose the grader mix and task shape per type with
[eval-types.md](eval-types.md).

A trigger task must read like a real user request. Naming the skill defeats
the test. Trigger tasks need the target seeded into a clean environment so it
can fire; the environment-specific seeding mechanism remains behind the
central CLI runner adapter.

For baseline/candidate result rows, keep `task.md` stable across candidates. Do
not write "use the skill" into the task. The same visible task should run under
no-skill, current-skill, and candidate-skill variants.

## Hidden Boundary

Hidden means not staged into the workspace and not included in the prompt —
see [run-layout.md](../../../references/run-layout.md#hidden-grader-boundary).
The agent sees `task.md`, listed fixtures, and the candidate payload when the
candidate supplies one; it never sees `judge.md`, `expected.*`, `validate.*`,
judge prompts, or human labels.

## Anchored Judge Guidance

A judge is only as reliable as its judge guidance. Put semantic criteria in
`judge.md`, not in `task.md`, with discrete label-anchored level descriptions
(see [eval-vocabulary.md](../../../references/eval-vocabulary.md) for the
label scale) rather than a bare numeric scale. For a skill, default quality
dimensions cover correctness, completeness against the request,
format/structure, and adherence to the skill's stated guarantees; a
non-skill target derives dimensions from [generalist.md](generalist.md).
Prefer multiple focused grader dimensions over one vague score.

## Coverage Statement

Close every suite report with a coverage statement (tasks by type, behaviors
actually exercised, and known behaviors not yet tested); a green suite
without one overclaims. No-skill/current-skill/candidate comparison guidance
lives in [methodology.md](methodology.md).

## Candidates And Trials

Use **candidate** in user-facing prose and schema fields for the agent-harness
setup (see [eval-vocabulary.md](../../../references/eval-vocabulary.md) for
the field and `trial_id` naming rules). Use display text only when it
clarifies the candidate for the reviewer:

```json
{ "candidate": "no-skill", "display": "No skill", "source": { "kind": "none" } }
```

Candidate source lives in git branches, worktrees, or `source.kind: "none"` for
the no-skill baseline. Run evidence records the branch, commit, worktree path
when active, and `payload_digest` (computed from the staged `skill/` payload
tree, not the commit; null for no-skill candidates) — see
[run-layout.md](../../../references/run-layout.md) for where these land. Do
not fake a no-skill baseline by staging a different skill payload; it runs
the same task with no `skill/` payload staged.

When a run contains a no-skill candidate and at least one payload candidate,
`eval report` adds per-task comparison rows (`baseline_state`,
`candidate_state`, each `pass`/`fail`/`unknown`). Interpret the rows as
evidence, not an instruction.

## Reference Solutions

Add a reference solution or expected output when the task is deterministic,
artifact-heavy, or intended to act as a gate — it proves the task is solvable
and that graders can pass a known-good result. Do not make the agent see it;
keep it in `expected.*` or a hidden fixture used by validators and graders.

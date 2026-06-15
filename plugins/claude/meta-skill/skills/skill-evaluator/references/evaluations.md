# Evaluations

Read when authoring semantic evaluation tasks for a target.

Evaluations need a judge — an LLM by default, a human when taste or domain
knowledge exceeds the model. They live in a gitignored workbench at
`<project>/.meta-skill/`.

Use `../../../references/cli.md` for materialization, runner selection,
progress, and grading commands.

## Authoring Model

Use a hidden prompt manifest plus materialized task folders:

```text
.meta-skill/
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

Use this vocabulary in prose:

| Term | Meaning |
|---|---|
| **suite** | A group of related evaluation tasks and grading rules. |
| **task** | The user work being evaluated; stored today as `cases/<task-id>/task.md`. |
| **candidate** | The agent-harness setup: no skill, current skill, or edited-skill attempt. |
| **trial** | One task executed once under one candidate. |
| **transcript** | The event stream and compact evidence from the trial. |
| **outcome** | The final answer, files, artifacts, or state to grade. |
| **grader** | A human, model, or code validator judging an outcome. |

## Writer-Facing `evals.json`

Skill Writer may create a compact prompt manifest in
`<project>/.meta-skill/evals.json`. This is the preferred authoring handoff:

```json
{
  "skill_name": "commit-message-normalizer",
  "defaults": {
    "runner": "codex_app_server",
    "repetitions": 1
  },
  "candidates": [
    {
      "id": "no-skill",
      "label": "No skill baseline",
      "source": { "kind": "none" }
    },
    {
      "id": "current",
      "label": "Current skill",
      "source": { "kind": "current_worktree", "ref": "." }
    }
  ],
  "evals": [
    {
      "id": "natural-trigger",
      "type": "trigger",
      "repetitions": 5,
      "prompt": "Ask for a skill improvement without naming the skill.",
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
          "id": "rishi-review",
          "kind": "human",
          "metric": "usefulness"
        }
      ]
    }
  ]
}
```

The CLI uses `candidates[]` for agent-harness setups and `evals[]` for
writer-authored tasks.

Keep the manifest small. Use conventional files inside each task folder:

- `task.md` — visible task
- `fixtures/` — visible files copied into the workspace when listed in
  `evals.json`
- `judge.md` — hidden judge guidance
- `expected.*` — hidden oracle or reference output
- `validate.*` — hidden deterministic validator
- `expectations[]` — optional hidden expectation checklist in `evals.json`
- `graders[]` — optional hidden grader declaration in `evals.json`

The `prompt` or `task.seed` value is used only when `task.md` does not exist. A
materializer must not overwrite existing authored content unless the caller
explicitly forces it.

Candidates change the agent harness while the task prompt stays the same. A
no-skill candidate uses `source.kind: "none"` and stages no skill payload.

## Grader Declaration

Graders may be implicit or explicit.

Implicit discovery keeps small suites cheap: if `judge.md` exists, the grader
runs a model judge; if `validate.*` exists, each validator runs as a code
grader. Use explicit `graders[]` when a task needs named metrics, required
gates, or a stable report contract.

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

Supported grader kinds:

| Kind | Runtime behavior |
|---|---|
| `code` | Runs the named `validate.*` file and writes `grader.kind = "code"` to `grades.jsonl`. |
| `model` | Runs the judge guidance or expectation judge and writes `grader.kind = "model"` to `grades.jsonl`. Set `uses_transcript: true` only when the judge guidance grades process behavior or needs mid-conversation evidence. |
| `human` | Creates a pending `needs_human_review` row until a reviewer records the label with `eval human`. |

`required` or `gate` means the grader is promotion-blocking. A candidate may
score well against judge guidance and still be rejected if a gate fails.

Model judge rows use the same label scale as human rows: `pass`, `partial`,
`fail`, `unknown`, or `needs_human_review`. They also include `score` when a
0-to-1 numeric value is meaningful. The judge prompt should make the burden of
proof explicit: `pass` requires specific evidence for every required criterion,
`partial` is for useful outcomes with localized or non-gating defects, `fail`
is for wrong, incomplete, unsafe, or required-criterion misses, `unknown` is for
insufficient or contradictory evidence, and `needs_human_review` is for domain
taste, underspecified criteria, or fairness concerns. The judge should grade
the outcome by default and use transcript evidence only for process criteria,
tool use, skill activation, or missing-evidence diagnosis.

`expectations[]` are hidden verifier statements. They are not copied into
`task.md`; the model judge uses them to emit named checks with evidence. Exact
expectations should still move into `validate.*` whenever code can check them
fairly. Run `scripts/meta-skill eval lint --suite .meta-skill/evals.json`
before running a suite to catch missing grader, reference, and balance issues.

## Task Types

Match the task text to what the task measures:

| Task type | `task.md` style | Runs | Measures |
|---|---|---|---|
| **Quality** | Names the skill when invocation should be forced. | once / few | Output quality given the skill fired. |
| **Trigger** | Natural request; never names the skill. | many | Fire / no-fire rate and variance. |
| **Failure** | Reproduces a known failure or regression. | few | Whether the edited-skill candidate fixed the failure. |
| **Gate** | Exercises a must-not-break requirement. | one / few | Promotion safety. |

For a fuller set of eval types, grader choices, and task examples, read
[eval-types.md](eval-types.md).

A trigger task must read like a real user request. Naming the skill defeats the
test. Trigger tasks need the target seeded into a clean environment so it can
fire; the environment-specific seeding mechanism remains behind the central CLI
runner adapter.

For impact comparison, keep `task.md` stable across candidates. Do not write
"use the skill" into the task. The same visible task should run under no-skill,
current-skill, and edited-skill candidates.

## Hidden Boundary

Hidden means not staged into the workspace and not included in the prompt.
It does not mean hidden files need a separate top-level directory.

```text
task folder
-> materializer
-> workspace containing task.md, listed fixtures, and candidate payload when present
-> transcript and outcome
-> evaluator reads judge.md, expected.*, validate.*, outcome, and transcript
-> grades.jsonl
```

The agent sees `task.md`, listed fixtures, and the candidate payload when the
candidate supplies one. A no-skill candidate supplies no payload. The agent
does not see `judge.md`, `expected.*`, `validate.*`, judge prompts, or human
labels.

## Anchored Judge Guidance

A judge is only as reliable as its judge guidance. Put semantic criteria in
`judge.md`, not in `task.md`.

For each dimension give discrete level descriptions, not a bare 0-3:

| Score | Meaning |
|---|---|
| 3 | Meets the criterion fully; usable as-is. |
| 2 | Usable with a concrete, named weakness. |
| 1 | Weak or risky; a real gap an agent would hit. |
| 0 | Missing, wrong, or unsafe for the dimension. |

Have the judge write reasoning before the score and cite the outcome it graded.
For a skill, default quality dimensions cover correctness, completeness against
the request, format/structure, and adherence to the skill's stated
guarantees. Adjust per target; a non-skill target derives dimensions from
[generalist.md](generalist.md).

Prefer multiple focused grader dimensions over one vague score. A task may have
several graders or assertions: exact outcome checks, transcript metrics,
tool-call checks, and judge guidance for the quality that cannot be checked by code.

## Coverage Statement

Close every suite report with a coverage statement; a green suite without one
overclaims. State:

- tasks by type — for example 3 quality / 2 trigger / 1 gate
- which behaviors of the target the tasks actually exercised
- known behaviors not yet tested, and why

Keep it to a few bullets. No-skill/current-skill/edited-skill candidate
comparison guidance lives in [methodology.md](methodology.md).

## Candidates And Trials

Use **candidate** in user-facing prose and schema fields for the agent-harness setup:

```json
{ "candidate": "attempt-1", "display": "Edited skill attempt 1" }
```

Do not add `condition_id`, `candidate_id`, or `attempt_id`.

Use `trial_id` for one execution of one task under one candidate:

```text
natural-trigger.attempt-1.t3
```

Use "Attempt 1" only as display text for a candidate.

Candidate source lives in git branches, worktrees, or `source.kind: "none"` for
the no-skill baseline. Run evidence records the branch, commit, worktree path
when active, and `payload_digest`. The digest is computed from the staged
`skill/` payload tree, not from the commit. For no-skill candidates, payload
path and digest are null.

A no-skill baseline uses `source.kind: "none"`:

```json
{
  "candidate": "no-skill",
  "display": "No skill",
  "source": { "kind": "none" }
}
```

Do not fake a no-skill baseline by staging a different skill payload. The
no-skill candidate runs the same task with no `skill/` payload staged.

`runs/<run-id>/candidates/<candidate>/<trial-id>/response.md` stores the
captured agent response. Never store
source copies there.

When a run contains a no-skill candidate and at least one payload candidate,
`eval report` adds per-task impact categories:

- `candidate_improves`
- `candidate_regresses`
- `both_fail`
- `baseline_already_succeeds`
- `needs_human_review`

## Reference Solutions

Add a reference solution or expected output when the task is deterministic,
artifact-heavy, or intended to gate promotion. The reference proves the task is
solvable and that the graders can pass a known-good result.

Do not make the agent see the reference solution. Keep it in `expected.*` or a
hidden fixture used by validators and graders.

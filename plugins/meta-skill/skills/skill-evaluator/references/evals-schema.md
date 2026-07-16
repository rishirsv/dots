# Evaluation Suite Schema

Read this before creating or changing
`<skill-name>/.<skill-name>/evals/evals.json` for the MetaSkill CLI.

## Minimal Suite

```json
{
  "schema_version": 2,
  "skill_name": "example-skill",
  "target": {"type": "skill", "ref": "SKILL.md"},
  "defaults": {
    "runner": "codex_exec",
    "repetitions": 1,
    "timeout_seconds": 600
  },
  "candidates": [
    {
      "candidate": "no-skill",
      "display": "No skill baseline",
      "source": {"kind": "none"}
    },
    {
      "candidate": "current",
      "display": "Current skill",
      "source": {"kind": "current_worktree", "ref": "."}
    }
  ],
  "evals": [
    {
      "id": "create-monthly-forecast",
      "type": "capability",
      "priority": "high",
      "prompt": "Build a monthly forecast from the attached historical results and assumptions.",
      "expected_output": "A usable forecast workbook with linked formulas, reconciled totals, and clearly identified assumptions.",
      "expectations": [
        "The workbook covers every requested forecast period.",
        "Forecast calculations use formulas rather than hard-coded outputs.",
        "The forecast reconciles to the supplied historical totals."
      ]
    }
  ]
}
```

When `candidates` is omitted, MetaSkill supplies the no-skill and current-skill
candidates shown above.

## Candidate Fields

Each candidate needs a unique `candidate`, optional `display`, and `source`:

| `source.kind` | Required source field |
|---|---|
| `none` | No `ref` or `path`; reserved for candidate `no-skill`. |
| `current_worktree` | Optional `ref: "."`; freezes the current skill tree. |
| `local_path` | `path` or `ref` naming the local candidate directory. |
| `branch` | `ref` naming a Git branch. |
| `git_ref` | `ref` naming a commit, tag, or other Git revision. |

For a revision comparison, declare both versions and select them by candidate
id:

```json
"candidates": [
  {
    "candidate": "current",
    "display": "Current skill",
    "source": {"kind": "current_worktree", "ref": "."}
  },
  {
    "candidate": "proposed",
    "display": "Proposed revision",
    "source": {"kind": "branch", "ref": "skill-revision"}
  }
]
```

Then run with `--baseline current --candidates proposed`. Candidate ids select
sources already declared in the suite; they do not define new sources.

## Case Fields

| Field | Contract |
|---|---|
| `id` | Required unique identifier. |
| `prompt` | Required non-empty string, or `{"path":"task.md"}` for a file-backed case. |
| `expected_output` | Optional non-empty string, or `{"path":"expected.md"}`. Use it for a reference result, not as a hidden new requirement. |
| `expectations` | Optional list of non-empty, observable criteria. |
| `type` | Optional: `attached`, `near_miss`, `capability`, `regression`, or `failure`. |
| `priority` | Optional: `high`, `medium`, or `low`. |
| `repetitions` | Optional case-level repetition count. |
| `split` | Optional selection label used by `--split`. |
| `fixtures` | Optional list of files or directories under the case folder. |
| `graders` | Optional list of deterministic, model, or human graders. |
| `annotations` | Optional reviewed notes with `tag`, `note`, and optional `judge_use`. |

A graded case needs at least one of `expected_output`, `expectations`, or
`graders`. Read [rubrics.md](rubrics.md) before defining these criteria.

## Grader Fields

Each grader has `kind: "code"`, `"model"`, or `"human"`. It may set `id`,
`metric`, `advisory`, and `uses_transcript`. A deterministic grader sets `path`
to its validator. An LLM grader sets `path` to its case-local `judge.md`. A
human grader must not set `path`. Read [judge.md](judge.md) before authoring an
LLM judge.

```json
{"kind": "model", "id": "quality", "metric": "quality", "path": "judge.md"}
```

## File-Backed Case

```text
.<skill-name>/evals/
  evals.json
  cases/<case-id>/
    task.md       # when prompt is {"path":"task.md"}
    expected.md   # when expected_output is {"path":"expected.md"}
    judge.md      # when an LLM judge needs case-specific guidance
    <fixtures>
    <validators>
```

Paths must stay inside the case folder. Trial workers receive `task.md` and
declared fixtures, but never `expected.md`, validators, expectations, judgment
guidance, annotations, or human labels.

## Validate Before Running

```bash
metaskill eval run \
  --suite <skill-name>/.<skill-name>/evals/evals.json \
  --check --json
```

Require a successful result and resolve every warning that would make the case
unfair or ungradable before creating a run.

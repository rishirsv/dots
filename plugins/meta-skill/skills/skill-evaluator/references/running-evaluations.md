# Running Evaluations

Read this after the suite is authored and confirmed. The CLI contract and all
options are in [cli.md](../../../references/cli.md).

## Check The Suite

```bash
metaskill doctor --json
metaskill eval run \
  --suite <skill-name>/.<skill-name>/evals/evals.json \
  --check --json
```

Stop unless `ok` is true. This validates the mode contract, runs deterministic
grader fixtures, and verifies calibrated judge confidence bounds and digests.

## Choose One Execution Path

Use unattended Codex Exec for an isolated comparison:

```bash
metaskill eval run \
  --suite <skill-name>/.<skill-name>/evals/evals.json \
  --objective "<question this run should answer>" \
  --json
```

Use `--adhoc --task "<prompt>" --skill <skill-dir>` for one disposable test.
An ad hoc expectation is advisory and cannot produce a passing verdict.

Use native execution only for a one-candidate observation:

```bash
metaskill eval prepare \
  --suite <skill-name>/.<skill-name>/evals/evals.json \
  --no-baseline \
  --objective "<question this run should answer>" \
  --json
```

Native workers inherit the task's configuration and installed capabilities, so
they cannot support an isolated baseline comparison. Authenticated connectors,
natural skill discovery, and multi-turn behavior require an external harness
that gives every candidate equivalent access.

For a benchmark, select exactly one split with `--split`. Readiness and
benchmark runs require at least 20 selected cases and three repetitions.

## Complete Native Trials

`eval prepare` returns one packet for each unresolved trial. Give a worker only
the packet's task, fixtures, workspace, artifact root, result path, and selected
skill path. Do not reveal hidden grading material or the durable run path.

The worker writes this result to the exact `result_path`:

```json
{
  "trial_id": "<packet trial_id>",
  "attempt_id": "<packet attempt_id>",
  "status": "completed",
  "response": "<user-visible response>",
  "artifacts": ["relative/path/in/artifact_root"],
  "duration_ms": 0,
  "error": null
}
```

Submit each result immediately:

```bash
metaskill eval submit --run <run_dir> --trial <trial_id> \
  --attempt <attempt_id> --result <result_path> --json
```

If interrupted, use `eval unresolved` and `eval retry`. Never retry a terminal
trial in place.

## Finalize And Inspect

```bash
metaskill eval finalize --run <run_dir> --grade --json
```

Deterministic and model graders run automatically. Declared human grades remain
pending until recorded with `eval record`; [human-review.md](human-review.md)
describes that workflow. Use `eval grade` to rerun frozen graders after an
allowed annotation change. Changing a case, candidate, grader source, or
execution setting requires a new run.

Read `<run_dir>/<skill-name>-evaluation.md` and inspect evidence behind every
failure, regression, disagreement, and unknown. The report distinguishes:

- `execution_ok`: execution and grading completed;
- `evaluation_passed`: candidate trials passed; and
- `regression_gate_passed`: no candidate regression or unknown blocked the
  optional `--gate`.

A failing baseline does not fail execution. Open `metaskill workbench open`
for side-by-side evidence and absolute human feedback. Use `eval report` only
to regenerate the report from the frozen run.

For unexpected results, continue with [error-analysis.md](error-analysis.md)
before changing the suite or skill.

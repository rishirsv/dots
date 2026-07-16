# Running And Evaluating Cases

Read this after the suite is authored and confirmed. Use the terms in
[eval-vocabulary.md](../../../references/eval-vocabulary.md): a run freezes
selected cases and versions, then creates one trial per case × version ×
repetition.

## 1. Check The Suite

Run from a shell where `metaskill` is available:

```bash
metaskill doctor --json
metaskill eval run \
  --suite <skill-name>/.<skill-name>/evals/evals.json \
  --check --json
```

Stop if the suite cannot load or a warning makes a case ungradable or unfair.

## 2. Choose The Execution Path

For one explicitly disposable prompt, use the ad hoc path:

```bash
metaskill eval run --adhoc \
  --task "<real user prompt>" \
  --skill <skill-dir> \
  --expectation "<observable success criterion>" \
  --json
```

Use `eval prepare --adhoc` instead when native subagents should execute the
ad hoc trial. Promote the prompt into `evals.json` only after the user confirms
that it should become a durable case.

Use unattended execution when Codex Exec can run the cases directly:

```bash
metaskill eval run \
  --suite <skill-name>/.<skill-name>/evals/evals.json \
  --objective "<question this run should answer>" \
  --json
```

Use interactive execution when native subagents should perform the trials:

```bash
metaskill eval prepare \
  --suite <skill-name>/.<skill-name>/evals/evals.json \
  --objective "<question this run should answer>" \
  --json
```

Add `--case <id>`, `--type <type>`, `--split <name>`, `--candidates <ids>`, or
`--repetitions <n>` only when the evaluation question requires that selection.
The no-skill version is included by default. Use unattended execution whenever
a grader sets `uses_transcript: true`; Codex Exec captures its event stream.
Native-subagent trials should be judged from outcomes unless their execution
surface supplies a real event stream.

## 3. Dispatch Interactive Trials

`eval prepare` returns the immutable `run_dir` and one worker packet for every
unresolved trial. Dispatch one native subagent per packet, in bounded waves.
Give the worker only:

- `task_path` as its task;
- `fixture_root` as supplied input;
- `workspace_path` as its working directory;
- `artifact_root` for every produced file;
- `result_path` for its result object; and
- `skill_path` when present. A no-skill trial has no `skill_path`.

Do not mention the comparison or reveal expectations, expected output,
validators, judge guidance, human labels, or the durable run directory.

The worker writes this result to the packet's exact `result_path`:

```json
{
  "trial_id": "<packet trial_id>",
  "attempt_id": "<packet attempt_id>",
  "status": "completed",
  "response": "<final response shown to the user>",
  "artifacts": ["relative/path/in/artifact_root"],
  "duration_ms": 0,
  "error": null,
  "events_path": "<optional path inside workspace_path>/events.jsonl"
}
```

Use `failed` or `timed_out` for the other terminal states and explain the cause
in `error`. Include `events_path` only when the execution surface captured a
real JSONL event stream; do not synthesize one from memory. Without it, the
trial receives an empty event stream and a transcript-dependent grader must
return `unknown`. Submit each finished attempt immediately:

```bash
metaskill eval submit \
  --run <run_dir> \
  --trial <trial_id> \
  --attempt <attempt_id> \
  --result <result_path> \
  --json
```

After an interruption, inspect rather than restart the run:

```bash
metaskill eval unresolved --run <run_dir> --json
metaskill eval retry --run <run_dir> --trial <stopped-nonterminal-trial> --json
```

Dispatch the fresh packet returned by `retry`. Never retry a terminal trial in
place.

## 4. Run The Graders

When every trial is terminal, finalize the run:

```bash
metaskill eval finalize --run <run_dir> --grade --json
```

Finalization executes every declared grader:

- A **deterministic grader** runs its case-local validator with `--output`,
  `--events`, optional `--expected`, and `--json`. It exits zero and returns
  JSON containing positive `total`, `passed`, optional `checks`, and
  `rationale` only when all load-bearing checks pass.
- An **LLM grader** reads the frozen task, response, artifacts, expectations,
  expected output, and case-local `judge.md`. It receives transcript events only
  when `uses_transcript` is true.
- A **human grader** remains pending until a person records a judgment through
  the workbench or `eval record`.

Use [rubrics.md](rubrics.md) to define the criteria, [judge.md](judge.md) for an
LLM judge, [validate-judge.md](validate-judge.md) to calibrate that judge against
human labels, and [human-review.md](human-review.md) for human judgment.

Record a declared human grade with:

```bash
metaskill eval record \
  --run <run_dir> \
  --trial <trial_id> \
  --grader <grader-id> \
  --metric <metric-id> \
  --label <pass|partial|fail|unknown> \
  --rationale "<evidence-backed reason>" \
  --json
```

Rerun frozen graders after an allowed review update with:

```bash
metaskill eval grade --run <run_dir> --json
```

Changing a case, version, rubric, grader source, or execution setting requires a
new run.

## 5. Inspect The Evaluation

Read `<run_dir>/<skill-name>-evaluation.md` and inspect the trial responses,
artifacts, and grades behind every failure, regression, disagreement, or
unknown result. Open `metaskill workbench open` when side-by-side inspection or
human feedback is useful.

Use `eval report` only to regenerate or write the report from the frozen run:

```bash
metaskill eval report --run <run_dir> --out <skill-name>-evaluation.md --json
```

For unexpected results, continue with [error-analysis.md](error-analysis.md)
before changing the suite or skill.

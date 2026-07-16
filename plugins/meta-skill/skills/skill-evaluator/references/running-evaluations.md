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

Stop unless `ok` is true. The check enforces the evaluation-mode contract,
rejects implicit load-bearing graders, executes deterministic known-Pass and
known-Fail fixtures, recomputes judge calibration confidence bounds, and
verifies calibrated judge digests.

## 2. Choose The Execution Path

For one explicitly disposable prompt, use the ad hoc path:

```bash
metaskill eval run --adhoc \
  --task "<real user prompt>" \
  --skill <skill-dir> \
  --expectation "<observable success criterion>" \
  --json
```

An ad hoc expectation without an explicit grader produces advisory model
feedback and an inconclusive verdict. Treat it as a single-run observation for
inspection, not a passing evaluation.

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

Use interactive execution only for a one-candidate observation when native
subagents are required:

```bash
metaskill eval prepare \
  --suite <skill-name>/.<skill-name>/evals/evals.json \
  --no-baseline \
  --objective "<question this run should answer>" \
  --json
```

Add `--case <id>`, `--type <type>`, `--split <name>`, `--candidates <ids>`, or
`--repetitions <n>` only when the evaluation question requires that selection.
The no-skill version is included by default for unattended execution. Codex
Exec ignores user config and rules, disables plugins, apps, and memories, records an empty plugin inventory, and
supplies only the frozen candidate skill. This is the comparison lane. Native
subagents inherit an uncontrolled skill and plugin inventory, so MetaSkill
rejects native multi-candidate preparation. Native trials should be judged from
outcomes unless their execution surface supplies a real event stream.

Because the comparison lane disables apps and plugins, use it for core-tool or
fixture-backed cases. Connector-dependent skills need an externally controlled
executor that gives every candidate identical authenticated tool access; until that
exists, record only a diagnostic observation and make no baseline-effect claim.

For a benchmark, select exactly one development or held-out split with
`--split`. Do not pass `--source-run-id` to the held-out split. For readiness
and benchmark runs, select at least 20 cases and keep at least three repetitions
per case.

## 3. Dispatch Interactive Observations

`eval prepare` returns the immutable `run_dir` and one worker packet for every
unresolved trial. Dispatch one native subagent per packet, in bounded waves.
Give the worker only:

- `task_path` as its task;
- `fixture_root` as supplied input;
- `workspace_path` as its working directory;
- `artifact_root` for every produced file;
- `result_path` for its result object; and
- `skill_path` for the selected candidate.

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
  `--events`, `--artifacts`, optional `--expected`, optional `--before-state`,
  optional `--after-state`, and `--json`. It exits zero and returns JSON
  containing positive `total`, `passed`, optional `checks`, and `rationale`
  only when all load-bearing checks pass.
- An **LLM grader** reads the frozen task, response, artifacts, expectations,
  expected output, and case-local `judge.md`. A load-bearing judge uses its
  calibrated, pinned model and reasoning effort and receives no later rubric
  annotations. It receives transcript events only when `uses_transcript` is
  true.
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

For `outcome: "stateful"`, MetaSkill runs the hidden capture script before
dispatch and again at submission, saves `before-state.json` and
`after-state.json` in the durable trial, and passes both to the state-aware
validator. A stateful nonterminal trial cannot be retried in its mutated
workspace; create a new run.

## 5. Inspect The Evaluation

Read `<run_dir>/<skill-name>-evaluation.md` and inspect the trial responses,
artifacts, state evidence, and grades behind every failure, case regression,
disagreement, or unknown result. The report labels diagnostic runs as
observations. Eligible readiness and benchmark reports include all-trial
success rates, confidence intervals, missing evidence, the declared `pass@k`
or `pass^k` rule, paired exact inference, and judge calibration details. Open
`metaskill workbench open` when side-by-side inspection or human feedback is
useful.

Use `eval report` only to regenerate or write the report from the frozen run:

```bash
metaskill eval report --run <run_dir> --out <skill-name>-evaluation.md --json
```

For unexpected results, continue with [error-analysis.md](error-analysis.md)
before changing the suite or skill.

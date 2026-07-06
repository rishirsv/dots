# Run Layout

Canonical run-directory tree for one `runs/<run-id>/`. Every other reference
should link here instead of restating this tree.

```text
.<skill-name>/runs/<run-id>/
  run.json                        # run plan: selected cases/candidates, runner config, planned trials
  progress.jsonl                  # queued/running/terminal status events
  results.jsonl                   # one row per executed trial (status, paths, usage, timing)
  grades.jsonl                    # grader rows; each grading pass appends a new grade generation
  summary.json                    # aggregate verdicts; rebuilt by grading and report commands
  report.md                       # rendered run report (auto-written)
  inputs/                         # run input snapshot: everything the run consumed, frozen
    suite.json                    # frozen suite copy
    cases/<case-id>/              # task.md, expectations.json, declared judge/validator files, expected.*
    candidates/<candidate>/       # frozen copy of the candidate source payload (+ snapshot.json)
  trials/<trial-id>/
    workspace/                    # staged working dir: task.md, fixtures/, skill/ payload
    events.jsonl                  # raw runner transcript
    evidence.json                 # compact runtime/transcript evidence
    response.md                   # captured final agent response
    judge-<generation-id>.jsonl   # raw judge event stream, one per grading generation
```

Trial id format: `<case-id>.<candidate>.t<n>`.

## What Each File Is For

- `run.json`: run plan, candidates, and trial list
- `progress.jsonl`: queued/running/terminal status changes
- `results.jsonl`: per-trial summary, timestamps, and artifact paths
- `grades.jsonl`: grader results; each grading generation appends new rows,
  latest per trial/metric/grader wins
- `summary.json`: aggregate verdicts rebuilt by grading and report commands
- `report.md`: the rendered run report, auto-written after grading (preset
  scorecard when the run has a preset, plain summary otherwise)
- `inputs/`: the run input snapshot — everything the run consumed, frozen. The
  frozen suite copy the run graded against, including declared hidden grader
  files (`judge.md`, `validate.*`) and expected outputs under
  `inputs/cases/<case-id>/`, plus each candidate's frozen source payload under
  `inputs/candidates/<candidate>/`
- `trials/<trial-id>/workspace/`: the run-scoped staged working directory for
  visible task bytes, listed fixtures, and the candidate payload when present;
  not an authoritative result artifact
- `trials/<trial-id>/events.jsonl`: raw runner transcript for that trial
- `trials/<trial-id>/evidence.json`: compact transcript/runtime evidence
- `trials/<trial-id>/response.md`: captured agent response for that trial
- `trials/<trial-id>/judge-<generation-id>.jsonl`: raw judge event stream for
  one grading generation

## Hidden-Grader Boundary

Hidden task files declared by the suite live under `inputs/cases/<case-id>/`
and are never staged into
`trials/<trial-id>/workspace/`. The agent only ever sees `task.md`, listed
fixtures, and the candidate payload when one is present.

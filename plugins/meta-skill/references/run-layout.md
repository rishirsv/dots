# Evaluation Storage Layout

Authored evaluation inputs live with the skill and version with it. Generated
state lives under one ignored repository root. The filesystem is authoritative;
the workbench does not maintain a database or metadata index.

```text
<skill>/
  SKILL.md
  evals/
    evals.json
    cases/<eval-id>/            # only for file-backed cases
      task.md
      expected.md               # when declared
      <fixtures and graders>    # when declared

<repository>/.metaskill/
  runs/<skill-id>/<run-id>/
    run.json
    report.md
    pairwise-reviews.jsonl      # after pairwise human review
    inputs/
      suite.json
      cases/<eval-id>/
      candidates/<candidate-id>/
        snapshot.json
        payload/
    trials/<trial-id>/
      state.json
      response.md
      events.jsonl
      artifacts/
      grades.jsonl
      review.json               # after an annotation
  worktrees/<skill-id>/<run-id>/
    candidates/<candidate-id>/  # temporary git worktrees
    trials/<trial-workspace>/   # temporary execution workspaces
  packages/<skill-id>/
```

`skill-id` is the skill directory's repository-relative path. `run-id` is the
immutable unique identifier for one recorded execution. Moving a skill creates
a new skill ID; existing runs remain under the ID recorded when they ran.

`run.json` is immutable experiment planning and provenance: objective,
baseline, candidates, case digests, runner policy, model, profile, repetitions,
human-review sample, and planned trials. `inputs/` is the immutable snapshot
used for execution and later regrading. Candidate payloads are stored once per
run, not copied into each trial.

Each trial owns one mutable state authority. `state.json` moves from `queued`
to `running` to `completed`, `failed`, or `timed_out`. `grades.jsonl` is
append-only; the latest row with the same trial, grader identity, kind, and
metric supersedes earlier rows. `review.json` holds trial annotations.
`pairwise-reviews.jsonl` stores append-only candidate-blind A/B annotations and
is separate from absolute trial grades.

Trial workspaces are temporary. They receive only the visible task, declared
fixtures, and candidate input, then are deleted after response, events, and
produced artifacts are captured. Expected outputs, expectations, validators,
judge guidance, and human labels remain hidden.

`report.md` is derived from the canonical read model and regenerated after
grading or review changes. It records experiment configuration, candidate
deltas, trial outcomes, failed checks with evidence, pairwise and absolute
review, annotations, token and latency data, provenance, and coverage limits.
It is never a second source of truth.

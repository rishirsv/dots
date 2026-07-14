# Evaluation Storage Layout

Authored evaluation inputs live with the skill and version with it. Generated
state lives under the owning skill's ignored `.skill/` directory. The
filesystem is authoritative; the workbench does not maintain a database or
metadata index.

```text
<skill>/
  SKILL.md
  evals/
    evals.json
    cases/<eval-id>/            # only for file-backed cases
      task.md
      expected.md               # when declared
      <fixtures and graders>    # when declared

<skill>/.skill/
  runs/<run-id>/
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
  worktrees/<run-id>/
    candidates/<candidate-id>/  # temporary git worktrees
  tmp/<run-id>/
    trials/<trial-id>/          # temporary execution workspaces
  packages/
```

`run-id` is the immutable unique identifier for one recorded execution. Moving
or copying a skill carries its generated evaluation state with it.

The same contract covers one-off and batch evaluation; only the number of
cases, candidates, and trials changes:

- request: `inputs/cases/<eval-id>/task.md`
- status: `trials/<trial-id>/state.json`
- response: `trials/<trial-id>/response.md`
- produced files: `trials/<trial-id>/artifacts/`
- provenance: `run.json`, `inputs/suite.json`, and candidate snapshots
- notes: `trials/<trial-id>/review.json` when the user annotates a result

`run.json` is immutable experiment planning and provenance: objective,
baseline, candidates, case digests, repetitions, human-review sample, planned
trials, and separate task-executor and judge-executor records. Native task
workers record the requested inherited model context; Codex Exec task workers
and judges record their explicitly resolved model and reasoning effort.
`inputs/` is the immutable snapshot used for execution and later regrading.
Candidate payloads are stored once per run, not copied into each trial.

Each trial owns one mutable state authority. `state.json` moves from `queued`
to `running` to `completed`, `failed`, or `timed_out`. `grades.jsonl` is
append-only; the latest row with the same trial, grader identity, kind, and
metric supersedes earlier rows. Grade evidence references are relative to the
run folder. A model-grade row also records any judge-context annotation IDs and
its context digest. `review.json` holds trial annotations, including
`judge_use` as `rubric`, `evidence`, or `exclude`; absence means `exclude` for
older runs.
`pairwise-reviews.jsonl` stores append-only candidate-blind A/B annotations and
is separate from absolute trial grades.

Trial state stores identity and lifecycle data, not absolute paths. Readers
derive response, event, and artifact locations from the fixed trial layout so a
copied skill remains self-contained. Absolute links from a temporary workspace
inside `response.md` are rewritten to trial-relative `artifacts/` links before
that workspace is removed.

Trial workspaces are temporary. They receive only the visible task, declared
fixtures, a workspace-local result location, and a staged candidate payload
for skill trials. The no-skill trial receives no skill path. They do not receive
the durable run path. Produced files move into the authoritative run folder
before the workspace is deleted; no second artifact store is kept. The parent
orchestrator is the sole writer of durable trial state and executor identity.
Expected outputs, expectations, validators,
judge guidance, and human labels remain hidden.

Native subagents use these workspaces for separation, but they share the parent
task's filesystem and are not a security sandbox. The unattended Codex Exec
lane adds a workspace-write sandbox and an explicitly selected worker model.
The Codex Exec judge receives read-only access to the durable run while it
inspects responses and artifacts.
Only `branch` and `git_ref` candidate sources use detached Git worktrees during
materialization. Current-worktree and local-path candidates are frozen by
snapshot without creating a Git worktree.

An interrupted run may expose unresolved worker packets. Terminal trials are
never dispatched again in place. Recovery into a new run may reuse an exact
completed trial only when its model, case digest, candidate payload digest, and
trial identity match. A selective rerun creates a new run with
`source_run_id`, selected case IDs, and a fresh current-skill snapshot; source
annotations remain immutable and linked by provenance rather than copied.

`report.md` is derived from the canonical read model and regenerated after
grading or review changes. It records experiment configuration, candidate
deltas, trial outcomes, failed checks with evidence, pairwise and absolute
review, annotations, token and latency data, provenance, and coverage limits.
It is never a second source of truth.

The workbench is also a derived filesystem view. It discovers runs and serves
artifacts from this layout, and it may append review data. Starting trials,
rerunning cases, and regrading are conversational or CLI operations, not
workbench server responsibilities.

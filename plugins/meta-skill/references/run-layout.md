# Evaluation Storage Layout

Authored evaluation inputs version with the skill inside a hidden companion
that packaging excludes. Each skill holds one `.<skill-name>/` workspace.
Generated state shares that companion and remains ignored.
The filesystem is authoritative; the workbench does not maintain a database or
metadata index.

```text
<skill-name>/
  SKILL.md

  .<skill-name>/
    evals/
      evals.json
      cases/<eval-id>/          # only for file-backed cases
        task.md
        expected.md             # when declared
        <fixtures and graders>  # when declared

    runs/<run-id>/
      run.json
      state.json               # run lifecycle, phase, counts, and stop reason
      <skill-name>-evaluation.md
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
        before-state.json      # when the case declares state capture
        after-state.json       # when the case declares state capture
        grades.jsonl
        review.json             # after an annotation
    worktrees/<run-id>/
      candidates/<candidate-id>/ # temporary git worktrees
    tmp/<run-id>/
      trials/<trial-id>/        # temporary execution workspaces
    packages/
```

`run-id` is the immutable unique identifier for one recorded execution. Move or
copy the companion with the runtime when evaluation history must follow a skill;
copying the portable directory alone intentionally excludes that history.

The same contract covers one-off and batch evaluation; only the number of
cases, candidates, and trials changes:

- request: `inputs/cases/<eval-id>/task.md`
- status: `trials/<trial-id>/state.json`
- run progress: `state.json`
- response: `trials/<trial-id>/response.md`
- produced files: `trials/<trial-id>/artifacts/`
- provenance: `run.json`, `inputs/suite.json`, and candidate snapshots
- notes: `trials/<trial-id>/review.json` when the user annotates a result

`run.json` is immutable experiment planning and provenance: objective,
evaluation mode, repetition policy, validity review, coverage requirements,
benchmark split, baseline, candidates, case digests, repetitions, planned
trials, the exact approved trial count when cases repeat, and separate
task-executor and judge-executor records. Native task
workers record the requested inherited model context; Codex Exec task workers
and judges record their explicitly resolved model and reasoning effort.
`inputs/` is the immutable snapshot used for execution and later regrading.
Candidate payloads are stored once per run, not copied into each trial.

Top-level `state.json` is the mutable run lifecycle authority. Its status is
`planned`, `running`, `completed`, `cancelled`, or `failed`; `phase` identifies
`planning`, `executing`, `grading`, `finalizing`, `finished`, or `stopped`.
Only `completed/finished` is a successful terminal pair. Cancelled and failed
runs use `stopped` and preserve the interrupted phase in `stop_phase`. The file
also records planned and terminal trial counts, per-status totals, timestamps,
and a stop reason. Older runs without this file remain readable by deriving a
terminal lifecycle from their trial states.

Each trial owns one mutable state authority. `state.json` moves from `queued`
to `running` to `completed`, `failed`, `timed_out`, or `cancelled`. `grades.jsonl` is
append-only; the latest row with the same trial, grader identity, kind, and
metric supersedes earlier rows. Grade evidence references are relative to the
run folder. A model-grade row also records any judge-context annotation IDs and
its context digest. `review.json` holds trial annotations, including
`judge_use` as `rubric`, `evidence`, or `exclude`; absence means `exclude` for
older runs. A saved finding sets the review decision to `finding`; an explicit
approval sets it to `looks_good`. Both record `reviewed_at`.

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
Expected outputs, expectations, validators, grader tests, state capture,
before/after snapshots, judge guidance, calibration, and human labels remain
hidden.

Native subagents use these workspaces for separation, but they share the parent
task's filesystem, user configuration, and installed skill/plugin inventory.
They are not a security sandbox and cannot run candidate comparisons; native
packets are limited to one-candidate observations. The unattended Codex Exec
comparison lane adds a workspace-write sandbox, ignores user configuration and
rules, disables plugins, apps, and memories, records an empty plugin inventory, supplies only the frozen candidate
skill, and uses an explicitly selected worker model.
The Codex Exec judge receives read-only access to the durable run while it
inspects responses and artifacts.

For a stateful case, the parent runs the frozen capture script before dispatch
and at result submission. It stores the JSON snapshots and digests in the
durable trial and passes them to state-aware deterministic graders. The worker
never sees the capture script or snapshots. A stateful workspace is not retried
in place after a stopped attempt because its initial state may have changed.
Only `git_ref` candidate sources use detached Git worktrees during
materialization. Current-worktree and local-path candidates are frozen by
snapshot without creating a Git worktree.

An interrupted run may expose unresolved worker packets. Terminal trials are
never dispatched again in place. Recovery into a new run may reuse an exact
completed trial only when its model, case digest, candidate payload digest, and
trial identity match. A selective rerun creates a new run with selected case
IDs and a fresh current-skill snapshot. Reviewed guidance must be promoted into
the authored case or grader explicitly; annotations are not inherited.

`<skill-name>-evaluation.md` is derived from the canonical read model and regenerated after
grading or review changes. It records the conclusion level, all-trial success
rates and confidence intervals, missing evidence, paired exact inference when
eligible, case outcomes, failed checks, judge calibration, absolute review,
annotations, execution and evaluation status, token and latency data,
provenance, validity review, and coverage limits.
It is never a second source of truth.

The workbench is also a derived filesystem view. It discovers runs and serves
artifacts from this layout, and it may append review data. Starting trials,
rerunning cases, and regrading are conversational or CLI operations, not
workbench server responsibilities.

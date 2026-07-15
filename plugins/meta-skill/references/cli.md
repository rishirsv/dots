# MetaSkill CLI

Use the current Codex task for interactive evaluation and the workbench for
review. This CLI provides the deterministic lifecycle, automation, validation,
and escape hatches. Commands support `--json` where shown.

```text
metaskill doctor [--json]
metaskill init [target] [--evals] [--dry-run] [--json]
metaskill status [target] [--json]
metaskill validate <skill-dir> [--json]
metaskill package <skill-dir> [--out-dir DIR] [--json]
metaskill workbench open [--root DIR] [--port PORT] [--open|--no-open]
```

`init` creates the target skill's owner-level `.skill/` companion. For
`skills/<relative-skill-path>/`, the workspace is
`.skill/<relative-skill-path>/`; a standalone `skill/SKILL.md` project uses
`.skill/` directly. Add `--evals` to create its tracked `evals/evals.json`.
`doctor` checks Python, the
bundled validators, the Codex binary, login status, and Codex Exec readiness.
`package` writes a zip to the companion's `packages/` unless `--out-dir` is
supplied. It validates first and stops without an artifact on failure. The zip
contains only the portable skill directory; legacy colocated `evals/`, hidden
files, generated state, and other development-only content remain excluded as
defense in depth. Success returns both the artifact path and its
package-metadata path.

## Evaluation

```text
metaskill eval run [--suite PATH] [--objective TEXT]
  [--baseline ID] [--candidates IDS] [--split NAME] [--case ID]... [--type TYPE]...
  [--repetitions N] [--model MODEL] [--reasoning-effort EFFORT]
  [--parallel N] [--timeout SECONDS]
  [--human-review-sample N] [--source-run-id ID] [--resume-run-id ID]
  [--no-baseline] [--no-grade] [--check] [--json]

metaskill eval run --adhoc --task PROMPT [--skill DIR]
  [--expected-output TEXT] [--expectation TEXT]...
  [--eval-type TYPE] [--priority high|medium|low]
  [--model MODEL] [--reasoning-effort EFFORT]
  [--parallel N] [--timeout SECONDS] [--json]

metaskill eval prepare [--suite PATH] [--objective TEXT]
  [--baseline ID] [--candidates IDS] [--split NAME] [--case ID]... [--type TYPE]...
  [--repetitions N] [--model MODEL] [--reasoning-effort EFFORT]
  [--parallel N] [--timeout SECONDS]
  [--human-review-sample N] [--source-run-id ID] [--resume-run-id ID]
  [--no-baseline] [--no-grade] [--json]

metaskill eval prepare --adhoc --task PROMPT [--skill DIR]
  [--expected-output TEXT] [--expectation TEXT]...
  [--eval-type TYPE] [--priority high|medium|low]
  [--model MODEL] [--reasoning-effort EFFORT] [--json]

metaskill eval submit --run PATH --trial ID --attempt ID --result PATH [--json]

metaskill eval finalize --run PATH [--grade|--no-grade]
  [--parallel N] [--model MODEL] [--reasoning-effort EFFORT] [--json]

metaskill eval unresolved --run PATH [--json]
metaskill eval retry --run PATH --trial ID [--json]

metaskill eval list [--suite PATH] [--json]
metaskill eval report --run RUN [--out PATH] [--json]
metaskill eval grade --run RUN [--model MODEL] [--reasoning-effort EFFORT]
  [--parallel N] [--json]
metaskill eval record --run RUN --trial ID --label LABEL --rationale TEXT
  [--grader ID] [--metric ID] [--score 0..1] [--json]
```

`eval prepare`, `eval submit`, and `eval finalize` are the interactive
subagent lifecycle. `prepare --json` freezes the selected inputs and returns
one packet per unresolved trial. Each packet contains `trial_id`, `attempt_id`,
`workspace_path`, `task_path`, `fixture_root`, `result_path`, and
`artifact_root`, plus `skill_path` for an attached-skill candidate. A native
worker writes its result inside that workspace. `submit` imports exactly that
attempt into the durable run. After every trial is terminal, `finalize`
optionally invokes the Codex Exec judge, writes the report, and removes
the companion's `tmp/<run-id>/`.

After an interrupted interactive run, `eval unresolved --json` returns every
non-terminal trial with its current state and worker packet. Dispatch a queued
packet as-is. If a queued or running worker is known to have stopped,
`eval retry` keeps that trial `queued`, deletes any stale workspace result, and
returns a packet with a fresh `attempt_id`. It rejects completed, failed,
timed-out, and skipped trials. Never retry a terminal trial in place; use a new run when new task
evidence is required.

`eval run` is the unattended lane. It uses ephemeral Codex Exec workers and the
same prepare, submit, grade, and report contracts; it does not create persistent
user-visible Codex tasks. Both paths include the suite's no-skill candidate by
default. `--baseline` selects another declared candidate as the comparator;
`--no-baseline` is the explicit opt-out. `--check` validates and lints without
creating a run. An ad hoc run is ungraded unless it supplies an expected output
or expectations.

The unattended worker and model judge default to `gpt-5.6-terra` with `medium`
reasoning unless the suite or command overrides them. Native workers inherit
the current Codex task's model choice; `--model` on `prepare` records requested
provenance but cannot override the native subagent model. `run.json` records
task and judge executor provenance separately; a native model value is
inherited, not claimed as observed.

Runs freeze the selected suite, grader definitions, and candidate payloads.
`--resume-run-id` creates a new immutable run and reuses only completed trials
whose model, case digest, candidate payload digest, and trial identity still
match; missing, incomplete, or changed trials execute normally.
`eval grade` reruns those frozen graders; changing authored grader source needs
a new run. Only annotations explicitly marked `rubric` or `evidence` enter
model-judge context; absence and `exclude` remain human-only. `eval record`
appends a revision for one human grader already declared by the frozen suite.
The report is regenerated after grade or review mutation.

## Sessions

```text
metaskill sessions list [--limit N] [--archived active|archived|all]
  [--days N] [--query TEXT] [--cwd PATH] [--json]
metaskill sessions show THREAD [--max-chars N] [--json]
```

These are read-only utilities over local Codex session state. They do not
extract diagnoses, edit skills, or create evaluation cases.

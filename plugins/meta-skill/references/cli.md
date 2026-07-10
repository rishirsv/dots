# MetaSkill CLI

Use the workbench for interactive evaluation. Use this CLI for automation,
validation, and escape hatches. Commands support `--json` where shown.

```text
metaskill doctor [--json]
metaskill init [target] [--evals] [--dry-run] [--json]
metaskill status [target] [--json]
metaskill validate <skill-dir> [--json]
metaskill package <skill-dir> [--out-dir DIR] [--json]
metaskill workbench open [--root DIR] [--port PORT] [--open|--no-open]
```

`init` creates the repository's ignored `.metaskill/` state root. Add
`--evals` to create `<skill>/evals/evals.json`. `doctor` checks the Python package,
Codex App Server SDK, Codex binary, and login status. `package` writes a zip to
`.metaskill/packages/<skill-id>/` unless `--out-dir` is supplied.

## Evaluation

```text
metaskill eval run [--suite PATH] [--profile ID] [--objective TEXT]
  [--baseline ID] [--candidates IDS] [--split NAME] [--case ID]... [--type TYPE]...
  [--repetitions N] [--model MODEL] [--parallel N] [--timeout SECONDS]
  [--human-review-sample N] [--source-run-id ID]
  [--no-baseline] [--no-grade] [--check] [--json]

metaskill eval run --adhoc --task PROMPT [--skill DIR]
  [--expected-output TEXT] [--expectation TEXT]...
  [--eval-type TYPE] [--priority high|medium|low]
  [--model MODEL] [--parallel N] [--timeout SECONDS] [--json]

metaskill eval list [--suite PATH] [--profile ID] [--json]
metaskill eval report --run RUN [--out PATH] [--json]
metaskill eval grade --run RUN [--model MODEL] [--parallel N] [--json]
metaskill eval record --run RUN --trial ID --label LABEL --rationale TEXT
  [--grader ID] [--metric ID] [--score 0..1] [--json]
```

`eval run` includes the suite's no-skill candidate by default. `--baseline`
selects another declared candidate as the comparator; `--no-baseline` is the
explicit opt-out. `--check` validates and lints without creating a run. An ad
hoc run is ungraded unless it supplies an expected output or expectations. When `--model` is omitted,
MetaSkill asks the authenticated Codex runtime for its supported default model
and records the resolved model in `run.json`.

Runs freeze the selected suite, grader definitions, and candidate payloads.
`eval grade` reruns those frozen graders; changing authored grader source needs
a new run. `eval record` appends a revision for one human grader already
declared by the frozen suite. The report is regenerated after grade or review
mutation.

## Sessions

```text
metaskill sessions list [--limit N] [--archived active|archived|all]
  [--days N] [--query TEXT] [--cwd PATH] [--json]
metaskill sessions show THREAD [--max-chars N] [--json]
```

These are read-only utilities over local Codex session state. They do not
extract diagnoses, edit skills, or create evaluation cases.

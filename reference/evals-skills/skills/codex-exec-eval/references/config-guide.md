# Config Guide

The generated project uses `codex-eval.json` as the source of truth.

## Why JSON

- It is easy to read and edit.
- Python can parse it with the standard library on every supported version.
- It keeps all major run decisions explicit in one file.

## Top-Level Sections

### `task`

Describe the task itself.

- `name`: short label for the eval project
- `description`: one-paragraph explanation of what Codex should do
- `prompt_template_file`: path to the base prompt template
- `success_definition`: plain-language description of what a good result looks like

### `codex_exec`

Control how `codex exec` runs.

- `model`: the model passed to `codex exec --model`
- `sandbox`: one of `read-only`, `workspace-write`, or `danger-full-access`
- `full_auto`: whether to use `--full-auto`
- `ephemeral`: whether to use `--ephemeral`
- `skip_git_repo_check`: whether to use `--skip-git-repo-check`
- `json_output`: whether to use `--json`
- `output_schema`: optional path to a schema file for structured output
- `add_dirs`: additional writable directories passed with `--add-dir`
- `working_directory`: directory passed to `codex exec -C`

### `inputs`

Explain the case shape.

- `mode`: `prompt_only`, `file_transform`, or `prompt_plus_files`
- `case_prompt_strategy`: how case content is inserted into the prompt
- `allow_source_files`: whether cases may point at source files

### `cases`

Point to the case data.

- `json_path`: canonical JSON cases file
- `csv_path`: optional CSV mirror or import/export path
- `source`: `existing_json`, `existing_csv`, `manual`, or `synthetic`

### `target_skill`

Describe the skill package being improved.

- `root_path`: original skill path on disk
- `tracked_files`: files or globs considered part of the candidate package
- `baseline_version`: usually `V1`
- `candidate_root`: where candidate copies live inside the eval project
- `active_candidate`: which candidate the loop should use by default

### `optimization`

Control the self-improvement loop.

- `enabled`: whether candidate iteration is enabled
- `max_rounds`: maximum number of candidate revisions
- `naming_scheme`: version format such as `V{n}`
- `mutation_scope`: which files in the skill package are allowed to change
- `review_batch_size`: how many training cases should be human-reviewed each round
- `holdout_tags`: which case tags or splits count as holdout
- `target_holdout_pass_count`: how many holdout passes are required for promotion
- `promotion_mode`: usually `stage_then_approve`
- `optimizer_model`: model used when Codex creates the next candidate
- `optimizer_sandbox`: sandbox used for candidate mutation runs

### `grading`

Control label storage and scoring.

- `deterministic_enabled`: whether automatic checks are active
- `human_review_required`: whether the loop expects human labels
- `judge_mode`: `off`, `optional`, or another future mode
- `label_store`: path to the local labels file
- `combined_strategy`: how human labels and automatic checks are combined

### `ui`

Control the local review app.

- `enabled`: whether the review app is generated
- `storage_backend`: JSON in v1
- `port`: local port for the review server
- `launch_command`: operator command for opening the review UI

### `evaluation`

Control how results are judged.

- `mode`: `deterministic` or `judge_optional`
- `require_zero_exit`: fail a case when the process exits non-zero
- `expect_last_message_json`: parse the final message as JSON
- `custom_assertion_script`: optional extra checker

### `outputs`

Control where results go.

- `root_dir`: output root
- `raw_dir`: per-case raw logs and files
- `reports_dir`: summary files
- `summary_json`: machine-readable aggregate summary
- `summary_md`: human-readable aggregate summary

## Editing Guidance

- Change the model by editing `codex_exec.model`.
- Change the sandbox by editing `codex_exec.sandbox`.
- Change the target skill path by editing `target_skill.root_path`.
- Change the active candidate version by editing `target_skill.active_candidate`.
- Change the review batch size by editing `optimization.review_batch_size`.
- Change the holdout pass target by editing `optimization.target_holdout_pass_count`.
- Turn on `full_auto` only when the run environment is intentionally permissive.
- Keep `codex_exec.json_output` set to `true` unless there is a good reason not to capture event streams.
- Keep the task prompt in a separate file so it is easy to iterate on without touching the runner.

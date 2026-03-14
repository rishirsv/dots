---
name: codex-exec-eval
description: Set up and run a guided `codex exec` evaluation harness for open-ended tasks such as prompt testing, file transformations, prompt-plus-file workflows, regression suites, and existing Codex eval improvements. Use when Codex needs to interview the user, choose explicit model and sandbox settings, scaffold a reusable mini eval project, create or import cases, run batch executions, apply deterministic checks first, and add deeper review only when needed.
---

# Codex Exec Eval

## Overview

Guide the user through one clear onboarding flow, then scaffold a reusable `codex exec` eval project they can rerun and edit.

Keep the experience single-skill and plain-language. Do not send the user to other eval skills, and do not ask them to choose between hidden internal workflows.

## Core Rules

- Use this skill as the only user-facing entrypoint for `codex exec` eval setup.
- Keep all major run settings explicit in the generated config. Never hide the model, sandbox, or output mode inside opaque scripts.
- Default to deterministic evaluation. Add judge-based evaluation only when the success criteria truly require interpretation.
- Keep JSON as the canonical cases format. Support CSV only as an import/export convenience layer.
- Produce a self-contained mini eval project in one folder.
- Summarize the setup choices back to the user before scaffolding or revising the harness.
- Keep the workflow understandable for a non-technical operator.

## Trigger Patterns

Use this skill when the user asks for things like:

- "Set up a Codex exec eval harness for this task."
- "Batch test this prompt."
- "Evaluate this file transformation workflow."
- "Create a regression suite for this Codex task."
- "Help me generate test cases for Codex."
- "Improve this existing Codex eval setup."

Tasks this skill should handle cleanly:

- prompt-only runs
- file-to-file transformations
- prompt-plus-file workflows
- repeated regression runs
- lightweight deterministic checks
- optional deeper review when simple checks are not enough

## Guided Workflow

### 1. Run the onboarding interview

Ask for these decisions in plain language:

1. What should Codex do?
2. What kinds of inputs exist for each case?
3. Are cases already available, or do they need to be created?
4. What counts as a successful result?
5. Can success be checked with rules, or does it require human or model judgment?
6. Which model should run the task?
7. Which sandbox or permission level should be used?
8. Where should the eval project live?

Use the structure in [references/onboarding-guide.md](references/onboarding-guide.md). Keep the conversation short and decisive. Make reasonable defaults when the user does not care, but always state the defaults back clearly.

### 2. Summarize the setup before generating files

Before scaffolding, write a short setup summary that includes:

- task name
- task description
- input type
- case source
- selected model
- selected sandbox mode
- run defaults
- evaluation strategy
- target output folder

If something is still ambiguous and materially changes the generated harness, resolve it before continuing.

### 3. Scaffold the mini eval project

Use the bundled scaffold helper:

```bash
python3 scripts/init_codex_exec_eval.py \
  --target-dir <target-dir> \
  --task-name "<task-name>" \
  --task-description "<task-description>" \
  --input-mode <prompt_only|file_transform|prompt_plus_files> \
  --case-source <existing_json|existing_csv|manual|synthetic> \
  --model <model> \
  --sandbox <read-only|workspace-write|danger-full-access> \
  --evaluation-mode <deterministic|judge_optional>
```

Generate a self-contained folder with:

- `codex-eval.json`
- `cases.json`
- optional `cases.csv`
- `prompts/task-prompt.md`
- `run_eval.py`
- `README.md`
- `setup-summary.md`
- `outputs/raw/`
- `outputs/reports/`

### 4. Adapt the harness to the real task

After scaffolding:

- update the base prompt template
- replace placeholder cases with real or synthetic cases
- tighten deterministic checks
- confirm file paths and working directory assumptions

Use these references as needed:

- [references/config-guide.md](references/config-guide.md)
- [references/cases-guide.md](references/cases-guide.md)
- [references/evaluation-strategy.md](references/evaluation-strategy.md)

### 5. Validate the generated setup

Validate the harness before treating it as ready:

```bash
python3 scripts/validate_codex_exec_eval.py --project-dir <target-dir>
```

If the user wants CSV round-trips:

```bash
python3 scripts/cases_csv.py export --json <target-dir>/cases.json --csv <target-dir>/cases.csv
python3 scripts/cases_csv.py import --csv <target-dir>/cases.csv --json <target-dir>/cases.json
```

### 6. Explain how to run and iterate

Hand off the generated project in plain language:

1. edit the prompt template or cases
2. adjust model or sandbox in `codex-eval.json`
3. run `python3 run_eval.py`
4. read the summary in `outputs/reports/`
5. improve and rerun

## Decision Rules

Use these defaults unless the user clearly wants something else:

- model: `gpt-5.4`
- sandbox: `workspace-write`
- `full_auto`: `false`
- `ephemeral`: `true`
- `json_output`: `true`
- evaluation mode: `deterministic`
- cases format: JSON canonical with optional CSV export

Use `judge_optional` only when deterministic checks cannot capture the success criteria.

Prefer case source in this order:

1. existing real cases
2. existing CSV or spreadsheet data converted into JSON
3. manual starter cases
4. synthetic cases

## Invisible Complexity Rule

Keep the underlying methodology internal.

Do:

- guide the user through one unified workflow
- embed best practices into the generated harness
- explain choices in simple language

Do not:

- tell the user to invoke separate eval skills
- expose internal skill names as required steps
- make the user choose between internal methodological branches

## Bundled Resources

- `scripts/init_codex_exec_eval.py`
  - scaffold a mini eval project from the bundled templates
- `scripts/validate_codex_exec_eval.py`
  - validate the generated config and cases
- `scripts/cases_csv.py`
  - convert cases between JSON and CSV
- `references/onboarding-guide.md`
  - interview flow and default-choice guidance
- `references/config-guide.md`
  - explain the generated config in plain language
- `references/cases-guide.md`
  - explain the cases format and supported fields
- `references/evaluation-strategy.md`
  - explain rules-first evaluation and the optional deeper-review path
- `assets/scaffold/`
  - templates for the generated mini eval project

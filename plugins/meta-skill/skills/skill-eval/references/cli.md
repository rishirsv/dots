# Eval CLI Reference

Read this for exact `meta-skill eval ...` command guidance.

## Commands

```bash
meta-skill eval init <project>
meta-skill eval run <project> [--scenario <id>] [--family <R|F|T|G>] [--topic <topic>] [--label "..."] [--snapshot | --no-skill] [--with-judges] [--no-lint]
meta-skill eval judge <project> --run <run-id> (--judge <id> | --all-judges) (--scenario <id> | --all-scenarios)
meta-skill eval feedback import <project> --run <run-id> <feedback.jsonl>
meta-skill eval open <project> [--run <run-id>] [--list] [--json]
meta-skill eval list <project> [--limit <n>] [--status <status>] [--json]
meta-skill eval view <project> [--run <run-id>] [--last] [--json]
```

Use `meta-skill project init <project>` first when `.meta-skill/` does not exist.

## Scenario Selection

When no selector is provided, `eval run` selects every scenario.

```bash
meta-skill eval run . --scenario F1
meta-skill eval run . --scenario F1-multiturn
meta-skill eval run . --family G
meta-skill eval run . --topic source-faithfulness
```

Selectors narrow the run. `--family` uses the strict ID prefix: `R`, `F`, `T`, or `G`.

## Run Source

The working payload at the project root is the default.

```bash
meta-skill eval run .
meta-skill eval run . --snapshot
meta-skill eval run . --no-skill
```

`--snapshot` runs the saved snapshot payload from `.meta-skill/versions/release/skill/`. It should error with a helpful next step when no saved snapshot exists.

`--no-skill` runs the same scenario with no skill attached. Treat it as manual control evidence, not as part of an automated uplift report.

`--compare` was removed. A run evaluates one source only; there is no replacement comparison command.

## Scenario Authoring

Scenario authoring is manual for now:

```text
.meta-skill/evals/scenarios/<ID-slug>/
  task.md
  scenario.json
  criteria.json
```

## Lint And Judges

`eval run` always performs preflight structural validation before scenario execution. It also runs deterministic lint/test annotations after scenario execution by default:

```bash
meta-skill eval run .
meta-skill eval run . --no-lint
```

Eval-test commands receive run-scoped environment variables when they execute during `eval run` or `meta-skill lint . --run <run-id>`:

- `META_SKILL_RUN_ID`: the current run ID
- `META_SKILL_RUN_ROOT`: absolute path to `.meta-skill/evals/runs/<run-id>`
- `META_SKILL_PROJECT_ROOT`: absolute path to the portable skill project

Use these variables instead of guessing the newest run folder.

Judges are independent and opt-in:

```bash
meta-skill eval run . --with-judges
meta-skill eval judge . --run 004-saved-snapshot --judge final-answer-quality --scenario G2
meta-skill eval judge . --run 004-saved-snapshot --all-judges --all-scenarios
```

`eval judge` works over saved run snapshots and final outputs. It does not rerun scenarios. If an older run has no snapshot, the CLI marks that legacy basis instead of silently treating current criteria as the original criteria.

## Feedback

Human feedback is append-only evidence:

```bash
meta-skill eval feedback import . --run 003-after-edit reviewer-feedback.jsonl
```

Use feedback as evidence for `meta-skill plan`, not as source changes.

After feedback import, the CLI regenerates `report.json`, `report.html`, and the runs `index.json`.

## Opening Reports

```bash
meta-skill eval open .
meta-skill eval open . --list
meta-skill eval open . --list --json
meta-skill eval open . --run 001-working-payload
meta-skill eval open . --run 001-working-payload --json
meta-skill eval list . --limit 5
meta-skill eval view . --last
```

There is no `latest` folder or symlink. The command may choose the newest run when no run is specified.

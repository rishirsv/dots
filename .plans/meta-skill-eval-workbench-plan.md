# Meta Skill Eval Workbench Authoring Plan

This Plan is a living document. Keep `Progress`, `Surprises & Discoveries`,
`Decision Log`, and `Outcomes & Retrospective` current as implementation
proceeds.

## Purpose / Big Picture

Meta Skill needs a small, teachable eval workbench that supports a natural
language consultant experience and gives future agents a durable command layer.
The consultant-facing flow is:

```text
Current vs Attempt 1 -> run eval -> check progress -> see best gated result -> approve
```

This plan covers the **authoring model**: `evals.json`, case folders, hidden
grading boundaries, candidate/trial vocabulary, and the doc updates needed to
make that model durable. Runtime orchestration belongs to
`.plans/codex-app-threads-runner-mini-spec.md`, with local runner references
under `docs/codex-app-server/` and `docs/codex-exec/`.

The next implementation pass adds one **plugin-level CLI source tree** at
`meta-skill/src/`. That CLI is an **agent-facing command layer**, not the
consultant UI. It gives Codex one composable interface for workbench creation,
materialization, App Server runs, progress monitoring, validation, grading, and
packaging helpers, with Codex Exec available as fallback. Consultants keep using
the natural-language flow; agents use the CLI behind that flow. Worker-local
scripts stop being the documented interface; they are migrated behind the CLI or
removed.

The final shape keeps metadata and content separate:

- `evals.json` owns all suite metadata.
- Case folders own authored content.
- `runs/<run-id>/` owns what actually ran.

## Progress

- [x] 2026-06-08T23:01:00Z Read the handoff in `docs/context.md`, current
  Meta Skill docs, isolated trial guidance, research notes, and ChatGPT Pro
  response.
- [x] 2026-06-08T23:01:00Z Created the first Plan draft for manifest-first
  authoring and folder-based execution.
- [x] 2026-06-09T00:00:00Z Locked the visible/hidden boundary: `task.md` contains
  only solver-visible bytes; no hidden or orchestration metadata belongs there.
- [x] 2026-06-09T00:00:00Z Locked vocabulary: user-facing "Attempt", internal
  `candidate`; one execution is a `trial`, not an `attempt_id`.
- [x] 2026-06-09T00:00:00Z Locked candidate storage: branches/worktrees identify
  candidate source, and `runs/<run-id>/candidates/<candidate>/` stores output
  artifacts only.
- [x] 2026-06-09T00:00:00Z Found local Codex Exec docs under `docs/codex-exec/`
  documenting `--json`, `--output-last-message`, resume behavior, and JSON event
  parsing.
- [x] 2026-06-09T00:00:00Z Updated this plan to the locked authoring model.
- [x] 2026-06-09T00:00:00Z Updated `meta-skill/docs/ARCHITECTURE.md`.
- [x] 2026-06-09T00:00:00Z Updated
  `meta-skill/skills/skill-evaluator/SKILL.md`.
- [x] 2026-06-09T00:00:00Z Updated evaluator references:
  `evaluations.md`, `calibration.md`,
  `validations.md`, and `generalist.md`.
- [x] 2026-06-09T00:00:00Z Aligned
  `meta-skill/references/skill-trial-runs.md` with candidate/trial vocabulary.
- [x] 2026-06-09T00:00:00Z Added a separate `skill-autoresearch` follow-up
  plan.
- [x] 2026-06-09T00:00:00Z Ran deterministic checks for changed skill
  payloads.
- [x] 2026-06-09T00:00:00Z Ran `scripts/sync-plugins.sh`.
- [x] 2026-06-09T00:00:00Z Locked the next implementation direction: add
  `meta-skill/src/` as the plugin-level CLI source tree, replace worker-local
  public scripts with the central CLI, and add a plugin-level CLI reference file
  that every worker skill links to.
- [x] 2026-06-09T00:00:00Z Applied OpenAI's `cli-creator` guidance: the CLI is
  a durable agent-facing command layer with composable commands, `--help`,
  command-local `--json`, stable JSON, safe write boundaries, and a companion
  reference for future agents.
- [x] 2026-06-09T00:00:00Z Corrected the consultant/agent boundary: KPMG
  consultants never need to run the CLI directly.
- [x] 2026-06-09T00:00:00Z Removed validator duplication; canonical validators
  now live under `meta-skill/src/`.
- [x] 2026-06-09T00:00:00Z Generated and documented the local
  `codex_app_server` protocol snapshot under `docs/codex-app-server/` using
  `codex-cli 0.135.0` with experimental fields included.
- [x] 2026-06-09T00:00:00Z Implemented the hard-cut CLI under
  `meta-skill/src/`: `doctor`, `workbench init`, `eval materialize`, `eval run`,
  `eval progress`, `eval grade`, `validate`, and `package`.
- [x] 2026-06-09T00:00:00Z Removed worker-local script surfaces from
  `skill-doctor` and `skill-writer`.
- [x] 2026-06-09T00:00:00Z Verified one full App Server run end to end:
  materialize -> `codex_app_server` run -> progress -> code grade.

## Surprises & Discoveries

- Observation: The source docs still used the older `evals.json` case-payload
  model.
  Evidence: `meta-skill/docs/ARCHITECTURE.md` and
  `meta-skill/skills/skill-evaluator/*` described `evals.json` as the place
  where judge-graded cases live.

- Observation: The earlier plan used `variants` and `attempt_id`, which conflicts
  with the final vocabulary.
  Evidence: `.plans/meta-skill-eval-workbench-plan.md` used
  `variant_id` and `attempt_id`; the locked vocabulary is `candidate` and
  `trial_id`.

- Observation: `docs/codex-exec/` exists and records local `codex-cli 0.135.0`
  evidence.
  Evidence: `docs/codex-exec/README.md` documents `--json`,
  `--output-last-message`, `--output-schema`, `resume`, and long-running JSONL
  monitoring. `docs/codex-exec/json-events.md` documents the event stream shape.

- Observation: `codex app-server` is available locally as an experimental
  typed control plane.
  Evidence: `codex app-server --help` on `codex-cli 0.135.0` shows `daemon`,
  `proxy`, `generate-json-schema`, and `generate-ts`; the command supports
  `--listen stdio:// | unix:// | ws://` and WebSocket auth modes.

- Observation: The App Server schema generators provide a real protocol
  contract, and the official Python SDK makes it usable without adding a Node
  runtime.
  Evidence: `codex app-server generate-json-schema --experimental --out
  docs/codex-app-server/schema` wrote 304 schema files, and `codex app-server
  generate-ts --experimental --out docs/codex-app-server/typescript` wrote 591
  TypeScript files. The official Codex SDK docs describe `openai-codex` as a
  Python 3.10+ SDK over the local App Server with packaged Codex runtime
  dependencies.

- Observation: The hard-cut implementation replaced the untracked helper-script
  mix with one compact CLI source.
  Evidence: `meta-skill/src/` now contains `meta-skill`, `meta_skill.py`,
  `validate_skill.py`, and `lint_authoring.py`.

- Observation: Duplicate validator ownership has been removed.
  Evidence: `skill-doctor/scripts/` and `skill-writer/scripts/` are gone; the
  canonical validation path is `scripts/meta-skill validate <skill-dir>`.

- Observation: OpenAI's `cli-creator` skill treats a CLI as Codex's command
  layer, not a human product surface.
  Evidence: The skill says to create durable CLIs future Codex threads can run
  by command name from any working directory; its patterns emphasize
  composable discover/resolve/read/write commands, `--json`, `doctor`, stable
  help, file outputs, exit codes, and companion skill guidance.

## Decision Log

- Decision: Keep `.meta-skill/evals.json` as the suite manifest.
  Rationale: It gives one compact place to see suite membership, defaults,
  runner plan, splits, candidate selection, repetitions, and materialization
  intent.
  Date/Author: 2026-06-09 / Codex

- Decision: Do not put case payloads inside `evals.json`.
  Rationale: Real cases need Markdown tasks, fixtures, rubrics, expected files,
  and validators. JSON should organize those files, not contain all content.
  Date/Author: 2026-06-09 / Codex

- Decision: Put all metadata in `evals.json`.
  Rationale: Metadata in `task.md` would leak hidden or orchestration data into
  the solver prompt. Metadata in case-local sidecars would create a second
  authority.
  Date/Author: 2026-06-09 / Codex

- Decision: Use `task.md` for visible task bytes only.
  Rationale: The solver output is what is being graded; hidden metadata must not
  contaminate it.
  Date/Author: 2026-06-09 / Codex

- Decision: Use `candidate` internally and "Attempt N" only as display text.
  Rationale: Consultants understand attempts. Internals need stable identifiers
  that do not collide with trial repetitions.
  Date/Author: 2026-06-09 / Codex

- Decision: Use `trial_id` for one execution of one case under one candidate.
  Rationale: `attempt_id` collides with user-facing "Attempt N" and makes the
  ledger ambiguous.
  Date/Author: 2026-06-09 / Codex

- Decision: Do not create a top-level `.meta-skill/candidates/` registry in V1.
  Rationale: Candidate source identity belongs to git branches/worktrees and
  run records. A registry would create another metadata surface.
  Date/Author: 2026-06-09 / Codex

- Decision: `runs/<run-id>/candidates/<candidate>/` stores output artifacts only.
  Rationale: Source copies there would recreate a parallel version store.
  Source identity belongs in `run.json` via branch, commit, worktree, and
  `payload_digest`.
  Date/Author: 2026-06-09 / Codex

- Decision: `payload_digest` is the digest of the staged `skill/` payload tree.
  Rationale: It catches no-op edits across different commits and proves whether
  an editor child changed the skill payload.
  Date/Author: 2026-06-09 / Codex

- Decision: Default runners are intent-driven.
  Rationale: One-off work needs inspectability; batch evals need repeatable
  workbench evidence; simple automation still benefits from a file-backed
  fallback.
  Date/Author: 2026-06-09 / Codex

- Decision: Use `codex_app_server` through the Python SDK as the primary
  workbench runner.
  Rationale: App Server gives live thread lifecycle, streamed evidence,
  multi-turn readiness, and future approval gates while still normalizing into
  the same durable run files.
  Date/Author: 2026-06-09 / Codex

- Decision: Keep `codex_exec` as the fallback adapter.
  Rationale: It remains excellent for simple fire-and-collect work: one prompt,
  one output, per-trial JSONL stream, compact progress derivation, and
  `--output-schema` for judge/control children.
  Date/Author: 2026-06-09 / Codex

- Decision: Commit App Server schema references before implementing the adapter.
  Rationale: The protocol is experimental and version-sensitive. A generated
  snapshot gives future implementation a concrete contract instead of guesses.
  Date/Author: 2026-06-09 / Codex

- Decision: Add a plugin-level source folder at `meta-skill/src/`.
  Rationale: Workbench creation and execution are plugin-level capabilities, not
  the private property of `skill-writer`, `skill-doctor`, or `skill-evaluator`.
  The source tree gives shared modules one home and prevents more per-skill
  script drift.
  Date/Author: 2026-06-09 / Codex

- Decision: Make the central CLI the only agent-facing automation surface.
  Rationale: KPMG consultants should never need to run commands. The CLI exists
  so Codex and future agents have one memorable, composable command layer behind
  the natural-language product flow. The durable agent contract is the CLI.
  Date/Author: 2026-06-09 / Codex

- Decision: Replace worker-local scripts with CLI subcommands.
  Rationale: validation, materialization, runner code, and reporting helpers
  should not each teach their own interface. The CLI owns command parsing and
  orchestration; small modules own mechanics.
  Date/Author: 2026-06-09 / Codex

- Decision: Canonical validators live under the plugin-level CLI source tree.
  Rationale: duplicate editable validators drift. The source of truth is now the
  plugin-level CLI module tree; worker-local copies are removed.
  Date/Author: 2026-06-09 / Codex

- Decision: Do not run plugin sync with divergent validator copies.
  Rationale: Syncing divergent validators would package ambiguity into the
  installed plugin and make validation results depend on which path a future
  agent happens to call.
  Date/Author: 2026-06-09 / Codex

- Decision: Add one plugin-level CLI reference file.
  Rationale: Worker skills should link to the same command guide instead of
  duplicating commands. The reference belongs under `meta-skill/references/`
  because it is plugin-level operational guidance shipped with the plugin.
  Date/Author: 2026-06-09 / Codex

- Decision: The CLI is not a source of truth.
  Rationale: The CLI may create, validate, and summarize files, but authority
  remains with `evals.json`, case folders, run folders, and git/worktrees.
  Date/Author: 2026-06-09 / Codex

## Outcomes & Retrospective

Completed the architecture and plan pass.

Source docs changed:

- `meta-skill/docs/ARCHITECTURE.md`
- `meta-skill/skills/skill-evaluator/SKILL.md`
- `meta-skill/skills/skill-evaluator/references/evaluations.md`
- `meta-skill/skills/skill-evaluator/references/calibration.md`
- `meta-skill/skills/skill-evaluator/references/validations.md`
- `meta-skill/skills/skill-evaluator/references/generalist.md`
- `meta-skill/references/skill-trial-runs.md`
- `docs/codex-exec/README.md`
- `docs/codex-app-server/README.md`

Generated protocol references added:

- `docs/codex-app-server/schema/`
- `docs/codex-app-server/typescript/`

Generated package sync result:

- `AGENT_MARKETPLACE_SOURCE=/Users/rishi/Code/agent scripts/sync-plugins.sh`
  completed and refreshed the generated Codex and Claude Meta Skill packages.

Validation commands and outputs:

- `scripts/meta-skill validate meta-skill/skills/skill-evaluator --json` passed 16/16.
- `scripts/meta-skill validate meta-skill/skills/skill-doctor --json` passed 16/16.
- `git diff --check` passed.

Resolved runtime gaps from the implementation pass:

- The central CLI, materializer, App Server Python runner, `codex_exec` fallback
  runner, progress reader, validation runner, grader, package command, and script
  hard cut are implemented.
- Autoresearch remains a separate future worker.

Stale terminology:

- No stale `case.md`, `variant_id`, or mini-spec `variant` references remain in
  the current workbench docs.
- `attempt_id` and `candidate_id` remain only as explicit guardrail text saying
  not to use those names.

## Context and Orientation

Editable source lives under `/Users/rishi/Code/agent/meta-skill/`. Generated
plugin packages live under `plugins/codex/meta-skill/` and
`plugins/claude/meta-skill/`; do not hand-edit them.

Important files:

| Path | Role |
|---|---|
| `meta-skill/docs/ARCHITECTURE.md` | Maintainer architecture and lane boundaries. |
| `meta-skill/skills/skill-evaluator/SKILL.md` | Runtime guidance for authoring and running eval suites. |
| `meta-skill/skills/skill-evaluator/references/evaluations.md` | Manifest and case-folder authoring. |
| `meta-skill/skills/skill-evaluator/references/calibration.md` | Human grade calibration. |
| `meta-skill/skills/skill-evaluator/references/validations.md` | Deterministic validation guidance. |
| `meta-skill/skills/skill-evaluator/references/generalist.md` | Non-skill target rubric builder. |
| `meta-skill/references/skill-trial-runs.md` | One-off worktree/thread trial guidance. |
| `meta-skill/references/cli.md` | Plugin-level CLI guide that every worker skill references. |
| `meta-skill/src/` | Plugin-level CLI source tree and shared implementation modules. |
| `.plans/codex-app-threads-runner-mini-spec.md` | Runtime orchestration plan for Codex thread/worktree runs. |
| `docs/codex-exec/README.md` | Local Codex Exec CLI reference. |
| `docs/codex-exec/json-events.md` | Local Codex Exec JSONL event reference. |
| `docs/codex-app-server/README.md` | Local Codex App Server and Python SDK runner reference. |
| `docs/codex-app-server/schema/` | Generated JSON Schema snapshot for App Server protocol. |
| `docs/codex-app-server/typescript/` | Generated TypeScript bindings for App Server protocol. |

Definitions:

- **candidate**: the thing under test: `current`, `attempt-1`, `attempt-2`. Use
  field name `candidate`, not `candidate_id`.
- **trial**: one execution of one case under one candidate. Repetitions produce
  trials such as `case-a.attempt-1.t3`.
- **case**: one authored task folder.
- **run**: one eval batch over selected candidates and cases.
- **grade**: code, model, or human judgment over a trial result.

## Plan of Work

Update architecture first. It should explain the lifecycle, authority split,
candidate/trial vocabulary, workbench shape, runner defaults, and future
`skill-autoresearch` boundary.

Update `skill-evaluator/SKILL.md` next. It should teach the evaluator to author
metadata in `evals.json`, materialize visible and hidden case content, run
selected candidates, and report measured evidence without editing source.

Rewrite the evaluator references:

- `evaluations.md`: manifest, case folders, visible/hidden boundary, minimal
  CaseSeed, candidates, and trials.
- `calibration.md`: human labels as grade rows, not inline `gold` case payloads.
- `validations.md`: `validate.*` runs outside the solver workspace after output
  exists.
- `generalist.md`: map non-skill targets onto the same manifest/content/run
  model.

Align `skill-trial-runs.md` only enough to prevent vocabulary drift. It should
remain the lightweight one-off path, not the full eval workflow.

Add a separate `.plans/skill-autoresearch-follow-up.md` so future autonomous
candidate generation is not lost but does not land in V1 evaluator docs.

Apply OpenAI `cli-creator` shape to the CLI:

- The CLI is Codex's command layer. It is not a consultant-facing product UI.
- It must run by command name from any working directory.
- `meta-skill --help` and each subcommand's `--help` are part of the interface.
- `scripts/meta-skill doctor --json` checks install health, Python/tool availability,
  Codex CLI availability, package paths, and validator ownership.
- `--json` emits machine-readable stdout; diagnostics and progress go to stderr.
- Errors under `--json` are structured and redact secrets.
- Commands are composable primitives rather than one giant "do everything"
  command.
- Write-like actions support `--dry-run`, `--force`, or explicit approval
  boundaries where appropriate.
- Large outputs are written to files and reported by path.
- The CLI reference is the companion skill-style guide: it teaches future agents
  which command to run first, safe read/write paths, and what not to do without
  approval.
- The App Server runner is exposed through the CLI, not raw JSON-RPC calls in
  worker skills. Its source lives under `meta-skill/src/` with the rest of the
  plugin implementation.

Scope reset after checking the prior workbench shape:

- The workbench is a small artifact contract: `evals.json`, case folders,
  run folders, and git/worktrees.
- The CLI is a thin agent helper around that contract.
- The runner is an implementation detail behind `eval run`.
- App Server is the primary runner, not a new workbench layer or a first-build
  command family.

V1 needs only:

| Need | CLI surface | Durable artifact |
|---|---|---|
| Check setup | `scripts/meta-skill doctor --json` | structured stdout only |
| Create workbench | `scripts/meta-skill workbench init` | `.meta-skill/` folders |
| Materialize cases | `scripts/meta-skill eval materialize` | `.meta-skill/cases/<case-id>/` |
| Run trials through App Server | `scripts/meta-skill eval run` | `runs/<run-id>/run.json`, `events/`, `results.jsonl` |
| Check progress | `scripts/meta-skill eval progress` | `progress.jsonl` |
| Grade outputs | `scripts/meta-skill eval grade` | `grades.jsonl` |
| Validate payload | `scripts/meta-skill validate` | stdout / exit code |
| Package payload | `scripts/meta-skill package` | package artifact |

Do not add `eval resume`, `eval stop`, `eval steer`, cost accounting, approval
policy modules, arbitrary thread controls, MCP-server management, `ws://` remote
daemon control, or Codex Cloud task control in the first workbench build.

The App Server SDK spike is the first runner proof, but it should stay narrow:
prove that the adapter can run a trial and normalize output/events into the same
`runs/<run-id>/` files. Do not let the spike add extra public commands.

For the next implementation pass, create the central CLI before adding more
runner features. The CLI should live under `meta-skill/src/`, expose one
command surface, and replace the worker-local script interfaces. Implementation
modules may be small and testable, but callers should go through the CLI.

Planned source shape:

```text
meta-skill/
  src/
    cli.*
    commands/
      doctor.*
      workbench-init.*
      eval-materialize.*
      eval-run.*
      eval-progress.*
      eval-grade.*
      validate.*
      package.*
    core/
      manifest.*
      materializer.*
      runners/
        base.*
        codex-app-server.*
        codex-exec.*            # fallback
      progress.*
      validators/
        validate-skill.*
        lint-authoring.*
      graders.*
      git-candidates.*
  references/
    cli.md
```

The exact language and file extensions can follow the repo's implementation
choice, but the boundary is fixed: plugin-level source under `meta-skill/src/`,
not worker-local script folders. Python is the least surprising runtime because
the existing helper and validator code is Python and the official
`openai-codex` SDK provides App Server access. Implement `codex_app_server`
first through the Python SDK and keep `codex_exec` behind the same interface as
the fallback.

Before wiring the full runner, run a small SDK spike on the target machine:
bootstrap the per-user environment, upgrade `openai-codex`, run one simple
trial, and verify the event/output shape can normalize into the existing run
files. Do not build policy code or live controls against documentation alone.

## Concrete Steps

Work from `/Users/rishi/Code/agent`.

Completed documentation pass:

- Updated `meta-skill/docs/ARCHITECTURE.md`.
- Updated `meta-skill/skills/skill-evaluator/SKILL.md`.
- Updated evaluator references: `evaluations.md`, `calibration.md`,
  `validations.md`, and `generalist.md`.
- Updated `meta-skill/references/skill-trial-runs.md`.
- Added `.plans/skill-autoresearch-follow-up.md`.

Implemented CLI pass:

1. Implemented the plugin-level CLI source tree:

   ```text
   meta-skill/src/meta-skill
   meta-skill/src/meta_skill.py
   meta-skill/src/validate_skill.py
   meta-skill/src/lint_authoring.py
   meta-skill/references/cli.md
   ```

   It provides command parsing, shared path resolution, `.meta-skill/`
   discovery, JSON helpers, structured errors, `doctor`, materialization,
   validation, run ledger writing, App Server runs, progress, grading, package,
   and `codex_exec` fallback.

2. Removed existing worker-local helper surfaces:

   ```text
   scripts/meta-skill validate
   scripts/meta-skill package
   scripts/meta-skill eval materialize
   scripts/meta-skill eval run
   scripts/meta-skill eval run --runner codex_exec
   scripts/meta-skill eval progress
   scripts/meta-skill eval grade
   ```

   No compatibility wrappers were kept.

3. Hard-cut validator ownership:

   ```text
   canonical: meta-skill/src/validate_skill.py
   canonical: meta-skill/src/lint_authoring.py
   removed: meta-skill/skills/skill-doctor/scripts/
   removed: meta-skill/skills/skill-writer/scripts/
   ```

4. Authored and updated the plugin-level CLI reference:

   ```text
   meta-skill/references/cli.md
   ```

   It should document the command map, source-of-truth boundaries, idempotence
   rules, consultant natural-language flows, agent command recipes, JSON policy,
   `doctor`, safe write boundaries, and which commands are stable versus future.
   It should link to `docs/codex-exec/` for V1 runner flags and
   `docs/codex-app-server/` for future live control-plane work instead of
   duplicating Codex docs.

5. Update worker skills to reference the CLI guide:

   ```text
   meta-skill/skills/meta-skill/SKILL.md
   meta-skill/skills/skill-writer/SKILL.md
   meta-skill/skills/skill-doctor/SKILL.md
   meta-skill/skills/skill-evaluator/SKILL.md
   ```

   Each skill should tell agents to use `meta-skill/references/cli.md` for
   command usage instead of linking directly to private scripts.

5. Search for stale terminology:

   ```sh
   rg -n "case\\.md|variant_id|variants|attempt_id|candidate_id|seed\"\\s*:" \
     meta-skill/docs meta-skill/references meta-skill/skills .plans
   ```

   Expected signal: no stale current-state references in touched docs. Historical
   notes may remain only when explicitly labeled as prior context.

6. Run deterministic checks:

   ```sh
   scripts/meta-skill validate meta-skill/skills/skill-evaluator --json
   scripts/meta-skill validate meta-skill/skills/skill-doctor --json
   ```

   Expected signal: both commands pass.

7. Sync generated plugin packages:

   ```sh
   AGENT_MARKETPLACE_SOURCE=/Users/rishi/Code/agent scripts/sync-plugins.sh
   ```

   Expected signal: sync completes and generated `plugins/codex/meta-skill/` and
   `plugins/claude/meta-skill/` reflect source edits.

8. Inspect diff:

   ```sh
   git status --short
   git diff -- meta-skill .plans docs/codex-exec
   git diff -- plugins/codex/meta-skill plugins/claude/meta-skill
   ```

## Validation and Acceptance

The docs are accepted when a future agent can answer:

- What is `evals.json` authoritative for?
- What is `task.md` allowed to contain?
- Where do rubrics, expected outputs, and validators live?
- How are hidden files kept hidden from the solver?
- What is the difference between candidate and trial?
- Why is the field `candidate`, not `candidate_id`?
- Where does candidate source identity live?
- What does `runs/<run-id>/candidates/<candidate>/` store?
- What is `payload_digest` a digest of?
- Which runner is default for trials, batch evals, autoresearch, and future rich
  integration?
- What concrete requirements pull `codex_app_server` forward?
- Where is the generated App Server schema snapshot?
- Why is `--output-schema` not used for solver trials?
- What is deferred to `skill-autoresearch`?
- What is the central CLI responsible for?
- What is the central CLI explicitly not authoritative for?
- Which command creates the workbench?
- Which command materializes cases from `evals.json`?
- Which command runs Codex Exec trials?
- Which command checks long-running progress?
- Which command replaces the existing validation scripts?
- Which plugin-level reference do worker skills link to for CLI usage?
- Which worker-local script interfaces have been removed or wrapped?
- Why is the CLI agent-facing rather than consultant-facing?
- Where do canonical validators live?
- How does `doctor --json` report setup and validator ownership?

Concrete checks:

- `rg -n "case\\.md|variant_id|attempt_id|candidate_id" meta-skill` returns no
  stale current-state matches; explicit "do not use" guardrails may remain.
- `rg -n "task\\.md" meta-skill/skills/skill-evaluator meta-skill/docs` shows
  visible-only guidance.
- `rg -n "payload_digest|output-schema|output-last-message|progress\\.jsonl" meta-skill .plans`
  shows the locked runner caveats.
- `docs/codex-app-server/README.md` explains that App Server Python is the
  primary workbench runner and links the generated schema/bindings snapshot.
- Deterministic checks pass for `skill-evaluator` and `skill-doctor`.
- `scripts/sync-plugins.sh` completes.
- Worker skills reference `meta-skill/references/cli.md` for CLI usage.
- The central CLI runs the existing deterministic validations through the same
  agent-facing command surface.
- No worker-local script remains as the documented primary command interface.
- No duplicated editable validator implementation remains.
- `scripts/meta-skill doctor --json` reports setup state without requiring a valid eval
  suite.

## Idempotence and Recovery

Doc edits are safe to retry if the implementer preserves unrelated work and
stages only intended files.

Materialization must be idempotent:

- Create missing case folders from `evals.json`.
- Use `task.seed` only when `task.md` does not exist.
- Do not overwrite existing `task.md`, fixtures, `rubric.md`, `expected.*`, or
  `validate.*` unless the caller explicitly forces it.
- Keep all metadata in `evals.json`.
- Do not write metadata into `task.md`.

CLI commands must be idempotent where agents naturally retry them:

- `eval materialize` creates only missing material unless `--force` is explicit.
- `eval run` writes a new run folder and never mutates prior run evidence.
- `eval progress` and `eval grade` can be rerun against the same run without
  changing source payloads.
- `validate` runs checks and reports results; it does not edit the target.

If sync produces unexpected generated churn, inspect source diffs first. Do not
hand-edit generated packages. Fix source, rerun sync, and recheck.

If deterministic checks fail because they encode old vocabulary, inspect the
rule. Update docs when the rule is right; update the rule only when it encodes
the old design.

## Artifacts and Notes

Locked workbench shape:

```text
.meta-skill/
  evals.json
  cases/
    <case-id>/
      task.md
      fixtures/
      rubric.md
      expected.*
      validate.*
  runs/
    <run-id>/
      run.json
      progress.jsonl
      events/
        <trial-id>.jsonl
      results.jsonl
      grades.jsonl
      candidates/
        current/
        attempt-1/
```

Planned CLI surface:

```sh
meta-skill --help
scripts/meta-skill doctor --json
scripts/meta-skill workbench init [--target <path>] [--dry-run] [--json]
scripts/meta-skill eval materialize [--suite .meta-skill/evals.json] [--force] [--json]
scripts/meta-skill eval run [--suite .meta-skill/evals.json] [--runner auto] [--json]
scripts/meta-skill eval progress --run <run-id> [--watch] [--json]
scripts/meta-skill eval grade --run <run-id> [--json]
scripts/meta-skill validate <target> [--json]
scripts/meta-skill package <skill-dir> [--json]
```

The CLI is the agent-facing steering wheel behind the natural-language product
flow. It must not become a fourth authority beside `evals.json`, case folders,
runs, and git/worktrees.

Locked authority rules:

```text
evals.json      = all metadata
case folders    = authored content
runs/<run-id>/  = what actually ran
```

Locked runner rules:

```text
trial / doctor fix       -> codex_thread with worktree isolation
batch / A-B / research   -> codex_app_server through Python SDK
simple fallback          -> codex_exec
```

`codex_app_server` is the primary workbench runner. `codex_exec` is the
fire-and-collect fallback for deliberately simple or CI-like runs.

For `codex_exec`, raw stream files are per trial:

```text
runs/<run-id>/events/<trial-id>.jsonl
```

The parent monitors compact derived state:

```text
runs/<run-id>/progress.jsonl
```

## Interfaces and Dependencies

Conceptual `evals.json` interface:

```ts
type EvalSuite = {
  schema_version: 1;
  target: TargetRef;
  defaults?: SuiteDefaults;
  candidates?: CandidatePlan[];
  cases: CaseSeed[];
};

type CaseSeed = {
  id: string;
  type: "quality" | "trigger" | "failure" | "gate";
  split?: "train" | "dev" | "validation" | "test" | "gold";
  repetitions?: number;
  task: {
    path: "task.md" | string;
    seed?: string;
  };
  fixtures?: string[];
};

type CandidatePlan = {
  candidate: "current" | string;
  display?: string;
  source: { kind: "git_ref" | "branch" | "worktree"; ref: string };
};
```

Conceptual `run.json` fields:

```ts
type RunCandidate = {
  candidate: string;
  display?: string;
  branch?: string;
  commit?: string;
  worktree?: string;
  payload_digest: string;
};

type RunTrial = {
  trial_id: string;
  case_id: string;
  candidate: string;
  repetition: number;
  runner: "codex_thread" | "codex_exec" | "codex_app_server" | "manual";
  status: "queued" | "running" | "completed" | "failed" | "blocked";
  event_log?: string;
  output?: string;
};
```

Use `docs/codex-exec/README.md` and `docs/codex-exec/json-events.md` before
implementing `codex_exec` orchestration. Re-run `codex exec --help` on the target
machine before relying on flags because the CLI changes quickly.

Use `docs/codex-app-server/README.md`,
`docs/codex-app-server/schema/`, `docs/codex-app-server/typescript/`, and
`meta-skill/references/cli.md` before implementing `codex_app_server`
orchestration. Prefer the official Python SDK; re-run the App Server generators
on the target machine before relying on protocol details because App Server is
version-sensitive.

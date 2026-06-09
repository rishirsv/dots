# Meta Skill App Server Python Runner Refactor Plan

This ExecPlan is the final implementation plan for refactoring the current
Meta Skill Python CLI into a module-based App Server runner. Keep `Progress`,
`Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective`
current as implementation proceeds.

## Purpose / Big Picture

KPMG consultants do not run this CLI directly. The product flow is:

```text
consultant asks parent agent -> agent runs Meta Skill CLI -> parent reports
progress and recommendation -> run files preserve evidence
```

The CLI is an agent-facing control layer. `.meta-skill/` is the workbench
evidence store. OpenAI Codex App Server is the primary runner runtime through
the official `openai-codex` Python SDK.

The current CLI works, but its controller is concentrated in
`meta-skill/src/meta_skill.py`. App Server, manifest loading, staging, progress,
grading, validation, packaging, and argument parsing are all interleaved. This
refactor splits that file along current command and evidence seams without
adding new user-facing commands.

The intended mental model is:

```text
scripts/meta-skill
  -> meta_skill.cli
  -> meta_skill.workbench / artifacts / grading / validation
  -> meta_skill.app_server
  -> openai-codex Python SDK
  -> Codex App Server runtime
```

Meta Skill does not implement App Server. It wraps OpenAI's runtime and stores
only Meta Skill evidence: suite, case, candidate, trial, run, output, grade,
thread ids, and runtime metadata.

## Current State

- `meta-skill/src/meta_skill.py` is the single controller file.
- `meta-skill/src/meta-skill` is the self-bootstrapping shell launcher.
- `meta-skill/src/requirements.txt` installs or upgrades `openai-codex`.
- `scripts/meta-skill` launches the plugin CLI from the repo checkout.
- Canonical validators live under `meta-skill/src/`.
- App Server is the primary workbench runner; `codex_exec` is fallback.
- Hidden case material is protected by solver workspace staging.
- Durable maintainer docs live under `meta-skill/.meta-skill/docs/` and do not
  ship with the plugin.

## Adversarial Review Outcome

Three architecture reviewers interrogated the first draft. The original plan
was directionally right but too broad. These changes are now locked:

- Keep the App Server module boundary, but do not create a general control
  plane.
- Do not implement broad thread-management commands in this refactor.
- Do not make `AsyncCodex` or concurrency part of V1.
- Add characterization tests before moving code.
- Make eval trial threads persistent by default; reserve ephemeral threads for
  disposable smoke tests only.
- Record explicit thread, runtime, candidate, progress, and policy evidence.
- Use current SDK `Sandbox` and `ApprovalMode` surfaces only; named permission
  profiles remain future/protocol-level until the Python SDK exposes them
  stably.
- Label protocol-only capabilities separately from SDK-backed V1 behavior.

## Target Source Layout

Create a Python package under `meta-skill/src/meta_skill/` and delete the large
flat `meta_skill.py` only after the package path is green.

```text
meta-skill/src/
  meta-skill
  requirements.txt
  meta_skill/
    __init__.py
    __main__.py
    cli.py
    errors.py
    io.py
    ids.py
    workbench.py
    manifest.py
    candidates.py
    staging.py
    artifacts.py
    runner.py
    grading.py
    validation.py
    packaging.py
    exec_fallback.py
    app_server/
      __init__.py
      client.py
      trial.py
      evidence.py
      policy.py
  validate_skill.py
  lint_authoring.py
```

Module ownership:

- `cli.py`: argparse wiring only.
- `errors.py`, `io.py`, `ids.py`: shared exceptions, JSON/JSONL helpers, ids,
  timestamps, slugs, and command output helpers.
- `manifest.py`: `.meta-skill/evals.json` loading, defaults, cases, splits,
  candidate selection, and repetition resolution.
- `workbench.py`: workbench initialization and case materialization.
- `candidates.py`: git branch/worktree/source identity and payload digest.
- `staging.py`: hidden-boundary solver workspace creation.
- `artifacts.py`: run directories, paths, schemas, JSONL writes, progress,
  result, grade, and package metadata helpers.
- `runner.py`: trial planning and sequential orchestration.
- `app_server/client.py`: SDK import boundary, `Codex` construction, metadata,
  auth/account readiness, and version capture.
- `app_server/trial.py`: one persistent App Server thread/turn execution for
  one trial.
- `app_server/evidence.py`: raw event writing and folded evidence/final output
  extraction.
- `app_server/policy.py`: current SDK `Sandbox` and `ApprovalMode` mapping.
- `exec_fallback.py`: narrow `codex exec` fallback.
- `grading.py`, `validation.py`, `packaging.py`: existing command behavior.

Do not add `threads.py`, `permission_profiles.py`, `approvals.py`, or
`types.py` in this refactor. Those names suggest shipped extension points. Add
them only when a command or runner actually needs that behavior.

## V1 Behavior Contract

The refactor preserves the current command surface:

```sh
scripts/meta-skill doctor [--json]
scripts/meta-skill workbench init [--target <path>] [--dry-run] [--json]
scripts/meta-skill eval materialize [--suite .meta-skill/evals.json] [--force] [--json]
scripts/meta-skill eval run [--suite .meta-skill/evals.json] [--runner auto|codex_app_server|codex_exec] [--candidates <ids>] [--split <name>] [--repetitions <n>] [--model <id>] [--json]
scripts/meta-skill eval progress --run <run-id-or-path> [--watch] [--json]
scripts/meta-skill eval grade --run <run-id-or-path> [--json]
scripts/meta-skill validate <skill-dir> [--json]
scripts/meta-skill package <skill-dir> [--out-dir <dir>] [--json]
```

No new CLI commands are added by this refactor.

V1 App Server behavior:

- App Server runs through the `openai-codex` Python SDK.
- Each eval trial starts a dedicated persistent Codex thread by default.
- `ephemeral=True` is allowed only for explicit disposable smoke tests, and the
  thread persistence choice is recorded.
- The runner is sequential. `AsyncCodex`, `--concurrency`, turn steering, and
  interrupt controls are future work.
- The solver workspace contains only visible task content, declared fixtures,
  and the staged candidate skill payload.
- Hidden grader material stays grader-side.
- Runtime policy is limited to current SDK surfaces:
  - `Sandbox.read_only`
  - `Sandbox.workspace_write`
  - `Sandbox.full_access`
  - `ApprovalMode.deny_all`
  - `ApprovalMode.auto_review`
- Named permission profiles are not implemented in V1.
- `codex_exec` remains a fallback adapter, not the architecture.

## Evidence Contract

`runs/<run-id>/` remains authoritative for what actually ran:

```text
.meta-skill/runs/<run-id>/
  run.json
  progress.jsonl
  results.jsonl
  grades.jsonl
  events/<trial-id>.jsonl
  evidence/<trial-id>.json
  candidates/<candidate>/<trial-id>/final.md
```

`runs/<run-id>/candidates/<candidate>/` stores output artifacts only. It never
stores source copies.

### CandidateSource

Each candidate row in `run.json` records:

```json
{
  "candidate": "current",
  "display": "Current",
  "source_kind": "current|branch|worktree|path",
  "source_ref": "HEAD",
  "worktree": null,
  "base_commit": "abc123",
  "head_commit": "abc123",
  "dirty": false,
  "diffstat": "",
  "payload_path": "/abs/path/to/skill",
  "payload_digest": "sha256:..."
}
```

### TrialRecord

Each trial in `run.json` and `results.jsonl` records:

```json
{
  "trial_id": "case-a.current.t1",
  "case_id": "case-a",
  "candidate": "current",
  "repetition": 1,
  "status": "queued|running|awaiting_approval|blocked|timed_out|interrupted|failed|passed|graded|degraded",
  "runner": "codex_app_server",
  "thread_id": "thr_...",
  "turn_id": "turn_...",
  "thread_persistence": "persistent|ephemeral",
  "cwd": "/abs/staged/solver/workspace",
  "sandbox": "workspace_write",
  "runtime_approval_policy": "deny_all",
  "sdk_version": "0.x",
  "runtime_version": "0.x",
  "event_path": ".meta-skill/runs/<run-id>/events/<trial-id>.jsonl",
  "evidence_path": ".meta-skill/runs/<run-id>/evidence/<trial-id>.json",
  "final_path": ".meta-skill/runs/<run-id>/candidates/current/<trial-id>/final.md",
  "usage": null,
  "started_at": "ISO-8601",
  "completed_at": null,
  "error": null
}
```

### ThreadEvidence

`evidence/<trial-id>.json` records:

```json
{
  "trial_id": "case-a.current.t1",
  "thread_id": "thr_...",
  "turn_id": "turn_...",
  "thread_persistence": "persistent",
  "final_response": "text or null",
  "final_source": "turn_result|agent_message_item|none",
  "items_count": 0,
  "usage": null,
  "status": "completed|failed|interrupted",
  "warnings": [],
  "sdk_version": "0.x",
  "runtime_version": "0.x"
}
```

## Progress State Model

`progress.jsonl` is the compact monitorable stream. It uses this fixed status
vocabulary:

- `queued`
- `running`
- `awaiting_approval`
- `blocked`
- `timed_out`
- `interrupted`
- `failed`
- `passed`
- `graded`
- `degraded`

V1 does not add a daemon, UI, WebSocket server, or external monitor. The parent
agent checks progress by reading `progress.jsonl` through
`scripts/meta-skill eval progress`.

## Hidden Boundary Requirements

The solver workspace must not receive:

- `rubric.md`
- `expected.*`
- `validate.*`
- grader prompts or labels
- hidden split labels not needed for the selected trial
- case-local metadata beyond the visible task and declared fixtures
- `.meta-skill/` workbench material from candidate worktrees

The staging implementation must reject or safely ignore:

- absolute fixture paths
- `..` path traversal
- symlink escapes
- fixture declarations outside the case folder
- candidate payload paths that would copy `.meta-skill/`, `.git`, `dist`,
  `__pycache__`, or other default excludes

## App Server Functionality Enabled By This Refactor

This refactor directly enables:

- a named App Server adapter module instead of a buried function
- persistent thread ids for eval trials
- turn/final/usage evidence folded into run artifacts
- raw per-trial App Server event capture
- explicit current-SDK sandbox and approval mode mapping
- SDK/runtime version capture in every run
- `doctor` checks for SDK import, public symbol availability, account/auth
  readiness, and runtime metadata
- fake-client unit seams for App Server trial evidence

It does not enable:

- concurrent eval execution
- broad thread-management commands
- arbitrary Desktop-live thread inspection
- named permission profiles
- live approval UI/routing
- turn steering or interruption controls

## Future App Server Capability Map

Future work may expose these, but only after a real command or eval/autoresearch
flow needs them.

| Capability | Status | Future use |
|---|---|---|
| Stored thread list | SDK-backed | Show prior Meta Skill/eval threads by cwd/source. |
| Stored thread read | SDK-backed | Import prior thread evidence without resuming. |
| Thread resume | SDK-backed | Continue interrupted eval or repair threads. |
| Thread fork | SDK-backed | Create repair/candidate threads from failures. |
| Loaded thread list | protocol-only for now | Inspect connected App Server process only; not Desktop-wide. |
| Turn interrupt | SDK-backed via handle | Stop runaway trials after timeout support exists. |
| Turn steer | SDK-backed via handle | Nudge repair/autoresearch children in context. |
| Approval request routing | protocol-backed | Human-visible write gates for autoresearch editor children. |
| Named permission profiles | protocol/future SDK | Enterprise policy profiles after stable Python SDK support. |
| Review thread | protocol-backed | Built-in candidate-change review lane. |
| Model catalog | protocol-backed | Model selection and cost attribution once SDK support is verified. |
| Skills/plugin inspection | protocol-backed | Diagnose skill availability in solver context. |

Research reference:
`meta-skill/.meta-skill/docs/research/codex-app-server-thread-capabilities.md`.

## Implementation Plan

### Phase 0: Characterization Harness

Before moving code, add tests or scripted checks that freeze current behavior.

Required coverage:

- `--help` exits successfully for every command.
- `--json` response shape for `doctor`, `workbench init`, `eval materialize`,
  `eval progress`, `validate`, and `package`.
- materialize no-overwrite and `--force` behavior.
- candidate source resolution and payload digest behavior.
- solver staging hidden-boundary assertions, including symlink, absolute path,
  and `..` path rejection.
- grade command behavior for expected files and validators.
- package ZIP exclusions.
- fake App Server trial runner that emits final response, usage, errors, and
  no-final cases without calling the real SDK.

Acceptance:

- Phase 0 checks pass against the current flat implementation.
- The same checks are run after every later phase.

### Phase 1: Package Skeleton And Entrypoint

Create `meta-skill/src/meta_skill/` and move command dispatch first.

- Add `__main__.py` that calls `cli.main()`.
- Update `meta-skill/src/meta-skill` to execute `python -m meta_skill`.
- Move shared errors, ids, JSON helpers, `emit`, and `fail`.
- Preserve command names, flags, help text, exit codes, and JSON shape.

Acceptance:

- Phase 0 checks pass.
- `python3 -m py_compile $(find meta-skill/src -name '*.py' -print)` passes.

### Phase 2: Workbench, Manifest, Candidate, Staging, Artifacts

Move data/model code without changing behavior.

- Move manifest loading, defaults, splits, cases, and selected candidates.
- Move workbench init and materialization.
- Move git/candidate source resolution and payload digest.
- Move solver workspace staging.
- Move artifact path and JSONL helpers.
- Add explicit `CandidateSource`, `TrialRecord`, and `ThreadEvidence` builders.

Acceptance:

- Phase 0 checks pass.
- Hidden-boundary tests prove no grader material reaches the solver workspace.
- `run.json` and `results.jsonl` include the evidence fields listed above.

### Phase 3: App Server Adapter Extraction

Replace the flat `app_server_run` function with `meta_skill.app_server`.

- Use sync `Codex` for V1.
- Start persistent trial threads by default.
- Attach the staged `SkillInput`.
- Run one turn for one trial.
- Capture final response, items count, usage, status, thread id, turn id,
  SDK version, and runtime metadata.
- Write raw per-trial event JSONL when streaming is used; otherwise write a
  normalized event row from `TurnResult`.
- Map only current SDK policies in `app_server/policy.py`.
- Add fake-client tests for success, failed turn, no final response, SDK import
  failure, and symbol mismatch.

Acceptance:

- Phase 0 checks pass.
- One real App Server run completes end to end.
- `ephemeral` is false by default and recorded.
- `doctor` fails clearly when required SDK symbols are absent.

### Phase 4: Eval Run And Progress

Move orchestration to `runner.py` while staying sequential.

- Plan trials deterministically.
- Append progress rows using the fixed state model.
- Run trials through App Server by default.
- Preserve `codex_exec` fallback.
- Keep result ordering deterministic.
- Record degraded evidence when final output or usage is unavailable but the
  runner can still produce inspectable artifacts.

Acceptance:

- Phase 0 checks pass.
- `scripts/meta-skill eval run --runner codex_app_server --json` works.
- `scripts/meta-skill eval progress --run <id> --json` works after the run.
- No concurrent writer assumptions exist in V1.

### Phase 5: Grading, Validation, Packaging

Move remaining command bodies.

- Move grading behavior to `grading.py`.
- Move skill validation bridge to `validation.py`.
- Move package artifact creation to `packaging.py`.
- Keep `validate_skill.py` and `lint_authoring.py` as canonical validator
  modules unless folding them into `validation.py` simplifies ownership without
  duplicating code.

Acceptance:

- Phase 0 checks pass.
- `scripts/meta-skill eval grade --run <id> --json` works.
- `scripts/meta-skill validate <skill-dir> --json` works.
- `scripts/meta-skill package <skill-dir> --json` works.

### Phase 6: End-To-End Dogfood

Run the completed skills through the full lifecycle in an isolated worktree.
This phase proves the consultant-facing loop from the parent agent's point of
view; it does not add new public CLI commands.

Setup:

- Create an isolated git worktree from the completed refactor branch.
- Seed the packaged Meta Skill plugin into that worktree using the same
  `scripts/sync-plugins.sh` path agents will rely on.
- Use a scratch target directory outside the source skill payloads so generated
  test skills, runs, reviews, feedback, and revisions cannot pollute the real
  plugin.
- Record the worktree path, plugin package path, SDK/runtime versions, and run
  ids in the E2E report.

The parent agent must complete this sequence:

1. **Skill ideation:** pick a quick skill idea and build it with the completed
   `skill-writer` flow.
2. **Heftier skill:** build a second useful skill with at least a couple files
   and at least one reference, fixture, script, or validation asset.
3. **Review:** run the review/doctor path against both skills and write review
   evidence.
4. **Evals:** create or materialize eval cases for both skills.
5. **Judge graded:** run at least one judge-graded or model-graded eval path,
   plus any deterministic validators needed for the case.
6. **Feedback written:** write feedback from the review/eval evidence into the
   workbench artifact for the skill.
7. **Revised iteration:** apply one scoped improvement to at least one skill in
   an isolated candidate/worktree.
8. **Score comparison:** rerun the relevant eval slice and compare baseline vs
   revised candidate scores, including failures and regressions.

Required E2E artifacts:

```text
.meta-skill/e2e/<run-id>/
  report.md
  quick-skill/
  hefty-skill/
  baseline/
  revised/
  score-comparison.json
```

`report.md` must include:

- the two skill ideas and why they were selected
- commands or agent actions used
- links to run directories
- judge/model grade summary
- deterministic validation summary
- feedback written
- revision made
- baseline vs revised score comparison
- what failed or felt awkward in the agent-facing workflow

Acceptance:

- The E2E run starts from the packaged skills, not only source files.
- The isolated worktree contains all generated test artifacts.
- Both generated skills validate.
- At least one skill receives a revised iteration.
- Score comparison shows baseline vs revised results with the same selected
  eval cases.
- Any failure is captured as a product/workbench defect, not silently waived.

### Phase 7: Docs, Sync, Cleanup

Delete the flat file only after the package path is green.

- Remove `meta-skill/src/meta_skill.py`.
- Update `meta-skill/references/cli.md` to describe the module boundary without
  exposing internal modules as public commands.
- Update `meta-skill/.meta-skill/docs/ARCHITECTURE.md` to point to this plan
  and the research note.
- Run `scripts/sync-plugins.sh`.
- Add or update the CLI reference with the E2E dogfood recipe only if the
  commands are stable enough for future agents to repeat.

Acceptance:

- No docs instruct agents to call worker-local scripts.
- Generated Codex and Claude packages include the new source package.
- Maintainer-only `.meta-skill/docs` still does not ship with the plugin.
- E2E report exists and is either committed under maintainer docs or explicitly
  left as ignored local evidence with a summary in this plan.

## Validation Plan

Run before declaring the refactor complete:

```sh
python3 -m py_compile $(find meta-skill/src -name '*.py' -print)
scripts/meta-skill doctor --json
scripts/meta-skill validate meta-skill/skills/meta-skill --json
scripts/meta-skill validate meta-skill/skills/skill-writer --json
scripts/meta-skill validate meta-skill/skills/skill-doctor --json
scripts/meta-skill validate meta-skill/skills/skill-evaluator --json
```

Create a temporary skill workbench and run:

```sh
scripts/meta-skill workbench init --target <tmp-skill> --json
scripts/meta-skill eval materialize --suite <tmp-skill>/.meta-skill/evals.json --json
scripts/meta-skill eval run --suite <tmp-skill>/.meta-skill/evals.json --runner codex_app_server --json
scripts/meta-skill eval progress --run <run-id> --json
scripts/meta-skill eval grade --run <run-id> --json
```

Inspect the solver workspace:

- `task.md` exists.
- declared fixtures exist.
- `skill/SKILL.md` exists.
- `rubric.md`, `expected.*`, and `validate.*` do not exist.
- symlinks, absolute paths, and traversal paths cannot leak hidden files.

Then run:

```sh
AGENT_MARKETPLACE_SOURCE=/Users/rishi/Code/agent scripts/sync-plugins.sh
META_SKILL_SKIP_DEP_UPDATE=1 /Users/rishi/.codex/plugins/cache/agent/meta-skill/0.1.0/src/meta-skill doctor --json
git diff --check -- .plans meta-skill scripts plugins/codex/meta-skill plugins/claude/meta-skill
```

Finally, complete the Phase 6 E2E dogfood in an isolated worktree. The E2E pass
is required before the refactor is considered shippable, because it proves the
full skill lifecycle rather than only the CLI's individual commands.

## Risks And Mitigations

- Risk: The Python SDK is beta and public APIs may shift.
  Mitigation: Keep SDK imports inside `app_server/`, verify every planned SDK
  symbol in `doctor`, record SDK/runtime versions in runs, and rely on the
  SDK-managed runtime rather than a global `codex` binary.

- Risk: Unpinned latest dependencies drift.
  Mitigation: Preserve the user requirement to update to latest dependencies,
  but make `doctor` an API matrix check and make every run record the exact SDK
  and runtime versions used.

- Risk: A modular refactor changes command behavior.
  Mitigation: Phase 0 characterization checks run before and after each move.

- Risk: Hidden grader material leaks into solver context.
  Mitigation: Keep staging isolated and test symlink, absolute path, traversal,
  fixture, and workbench-secret cases.

- Risk: Future agents overclaim Desktop thread visibility.
  Mitigation: Document that stored threads from the connected Codex home are
  safe; loaded-thread and Desktop-live visibility are protocol/future, not V1.

- Risk: Future concurrency overwhelms App Server.
  Mitigation: Do not implement concurrency in this refactor. A later concurrency
  plan must add `--concurrency`, bounded scheduling, overload retries, retry
  accounting, atomic JSONL writes, and progress-watch tests.

- Risk: Unit/command checks pass but the actual skill lifecycle is clumsy or
  incomplete.
  Mitigation: Phase 6 requires an isolated-worktree E2E dogfood covering
  ideation, authoring, review, evals, judge grading, feedback, revision, and
  score comparison.

## Progress

- [x] Researched official App Server, Python SDK, and thread capability docs.
- [x] Added
  `meta-skill/.meta-skill/docs/research/codex-app-server-thread-capabilities.md`.
- [x] Ran adversarial architecture reviews across protocol correctness, repo
  simplicity, and enterprise/autoresearch scalability.
- [x] Trimmed this plan to V1 refactor scope.
- [x] Phase 0: characterization harness.
- [x] Phase 1: package skeleton and entrypoint.
- [x] Phase 2: workbench, manifest, candidate, staging, artifacts.
- [x] Phase 3: App Server adapter extraction.
- [x] Phase 4: eval run and progress.
- [x] Phase 5: grading, validation, packaging.
- [x] Phase 6: end-to-end dogfood.
- [x] Phase 7: docs, sync, cleanup.

## Surprises & Discoveries

- Observation: The first draft created too many future-shaped modules.
  Evidence: Reviewers flagged `threads.py`, separate approval/permission
  modules, async concurrency, and future capability tables as likely sprawl.

- Observation: The original flat runner started App Server threads as
  ephemeral.
  Evidence: The refactored App Server adapter now uses persistent threads by
  default and the E2E run recorded persistent solver and judge thread ids.

- Observation: Current Python SDK support and App Server protocol support are
  not identical.
  Evidence: The SDK exposes stored thread list/resume/fork/read and turn
  handles, while some App Server capabilities such as loaded-thread listing and
  named permission profiles are protocol-level or future integration work.

- Observation: Dependency freshness and runtime compatibility are separate.
  Evidence: The launcher can install the latest `openai-codex`, while the SDK
  manages its compatible runtime package. Runs must record exact versions.

- Observation: Command-level verification is not enough for Meta Skill.
  Evidence: The workflow only proves itself when an agent can create a quick
  skill, create a heftier skill, review, evaluate, judge grade, write feedback,
  revise, and compare scores inside an isolated worktree.

- Observation: The flat staging implementation needed an explicit symlink
  guard before it could satisfy the hidden-boundary contract.
  Evidence: `meta-skill/src/characterize_meta_skill.py` now checks absolute
  fixture paths, `..` traversal, symlink fixture escapes, and hidden grader
  material exclusion.

- Observation: The local default `python3` can be older than the CLI supports.
  Evidence: The Phase 1 checks needed the Codex runtime Python 3.12 path,
  matching the launcher's fallback interpreter selection.

- Observation: Phase 2 needed a fake `codex` command to prove eval-run artifact
  shape without depending on a live model run.
  Evidence: `meta-skill/src/characterize_meta_skill.py` now checks candidate
  source fields, trial evidence fields, result final/evidence paths, and
  folded evidence JSON after `eval run --runner codex_exec --json`.

- Observation: Moving `cli.py` into a package made the doctor validator check
  look one directory too deep.
  Evidence: `doctor --json` initially failed `validators_canonical`; the check
  now resolves the `src/` root from `meta_skill/cli.py`, and the
  characterization harness asserts that validator source check stays green.

- Observation: A real App Server smoke run works through the extracted adapter
  and sequential runner.
  Evidence: A temporary one-case suite at
  `/private/tmp/meta-skill-app-server-smoke.ob7jSX` produced
  `run-20260609T045205413765Z-5a229601` with status `passed`, persistent
  thread id `019eaab9-400f-7e83-988f-5404633c1750`, turn id
  `019eaab9-40aa-71e1-94f1-8f9c2faa5f95`, SDK version `0.1.0b3`, and final
  output `app-server-ok`.

- Observation: The remaining Phase 5 command bodies could move without changing
  validator ownership.
  Evidence: `grading.py` owns `eval grade`, `validation.py` imports the
  canonical `validate_skill.py` and `lint_authoring.py` modules, and
  `packaging.py` creates package ZIPs while reusing the validation bridge.

- Observation: Phase 6 needed a real rubric/model grading path, not only
  deterministic validators.
  Evidence: `eval grade` now records model grades when a case has `rubric.md`;
  the E2E quick-skill run produced model rubric grades plus validator grades
  for baseline and revised candidates.

## Decision Log

- Decision: Use the official `openai-codex` Python SDK as the primary App
  Server access layer.
  Rationale: It gives Python-native thread, turn, sandbox, approval, usage,
  auth, and runtime management without hand-rolled JSON-RPC.
  Date/Author: 2026-06-09 / Codex

- Decision: Keep the V1 adapter synchronous.
  Rationale: The current CLI is sequential and has no `--concurrency` contract.
  Async/concurrency is valuable, but it needs its own bounded scheduling and
  overload plan.
  Date/Author: 2026-06-09 / Codex

- Decision: Use persistent App Server threads by default for eval trials.
  Rationale: Thread ids are evidence handles only if the thread can be read,
  resumed, or forked later.
  Date/Author: 2026-06-09 / Codex

- Decision: Collapse current sandbox and approval mapping into
  `app_server/policy.py`.
  Rationale: Current SDK support is small. Separate permissions/approval modules
  would imply a richer policy engine that V1 does not ship.
  Date/Author: 2026-06-09 / Codex

- Decision: Keep `codex_exec` only as fallback.
  Rationale: `codex exec` is good fire-and-collect automation, but it does not
  expose the thread lifecycle needed for the enterprise workbench.
  Date/Author: 2026-06-09 / Codex

- Decision: Do not expose broad thread-management commands in this refactor.
  Rationale: Stored thread list/read/resume/fork are useful later, but the
  refactor should stabilize eval evidence first.
  Date/Author: 2026-06-09 / Codex

- Decision: Keep latest dependency installation but make runtime truth explicit.
  Rationale: Portability requires dependency freshness; reliability requires
  `doctor` symbol checks and run-level SDK/runtime version capture.
  Date/Author: 2026-06-09 / Codex

- Decision: Add an E2E dogfood phase before docs cleanup.
  Rationale: Meta Skill is a lifecycle product, not just a command collection.
  A real isolated-worktree loop catches UX and orchestration gaps that unit and
  single-command checks cannot see.
  Date/Author: 2026-06-09 / Codex

- Decision: Use a stdlib characterization runner for Phase 0.
  Rationale: The checks need to run from source, launcher venvs, and future
  package layouts without introducing pytest or repo-global test configuration.
  Date/Author: 2026-06-09 / Codex

- Decision: Keep a temporary `meta_skill.py` compatibility shim during Phase 1.
  Rationale: The package entrypoint is now canonical, but the shim lets direct
  file execution and older import expectations keep working until the flat file
  deletion phase.
  Date/Author: 2026-06-09 / Codex

- Decision: Re-export moved helper functions from `meta_skill/__init__.py`.
  Rationale: The characterization harness and possible downstream callers
  still import helpers from `meta_skill`; re-exporting keeps that surface stable
  while the implementation moves into owned modules.
  Date/Author: 2026-06-09 / Codex

- Decision: Put persistent-thread policy in the App Server adapter, not the
  runner.
  Rationale: Persistence is an App Server runtime choice; the sequential runner
  should record the adapter's thread evidence rather than know SDK call details.
  Date/Author: 2026-06-09 / Codex

- Decision: Keep progress as file-backed snapshots in `runner.py`.
  Rationale: Phase 4 only needs deterministic sequential orchestration and
  `eval progress`; no daemon, UI, websocket, or concurrent writer model is
  needed for V1.
  Date/Author: 2026-06-09 / Codex

- Decision: Keep `validate_skill.py` and `lint_authoring.py` as canonical
  validator modules.
  Rationale: Phase 5 only moves command ownership; folding validator internals
  into `validation.py` would duplicate existing behavior and widen the change.
  Date/Author: 2026-06-09 / Codex

- Decision: Add rubric-backed model grading to `eval grade` without adding a
  new command.
  Rationale: The Phase 6 lifecycle needs judge/model grade evidence, and case
  `rubric.md` is already the hidden grader-side artifact for that purpose.
  Date/Author: 2026-06-09 / Codex

## Sources

- OpenAI App Server architecture:
  https://openai.com/index/unlocking-the-codex-harness/
- App Server protocol README:
  https://raw.githubusercontent.com/openai/codex/main/codex-rs/app-server/README.md
- Python SDK API reference:
  https://raw.githubusercontent.com/openai/codex/main/sdk/python/docs/api-reference.md
- Python SDK getting started:
  https://raw.githubusercontent.com/openai/codex/main/sdk/python/docs/getting-started.md
- Python SDK FAQ:
  https://raw.githubusercontent.com/openai/codex/main/sdk/python/docs/faq.md
- Thread capability research note:
  `meta-skill/.meta-skill/docs/research/codex-app-server-thread-capabilities.md`

## Outcomes & Retrospective

The refactor is implemented as a Python package under `meta-skill/src/meta_skill/`.
The launcher uses `python -m meta_skill`, while `meta_skill.py` remains as a
temporary compatibility shim until the final deletion window.

The command surface stayed stable. The CLI still exposes `doctor`, `workbench
init`, `eval materialize`, `eval run`, `eval progress`, `eval grade`,
`validate`, and `package`.

The App Server path now runs through `meta_skill/app_server/`, starts
persistent solver threads by default, records thread and turn ids, writes raw
events, folds final/usage evidence, and stores per-trial evidence JSON. The
sequential runner lives in `runner.py`, and `codex_exec` is isolated as a
fallback adapter.

`eval grade` now supports both deterministic `validate.*` graders and
rubric-backed model grades from case-local `rubric.md` files. Judge events are
stored as `<trial-id>.judge.jsonl` and grade evidence is written to
`grades.jsonl`.

The E2E dogfood ran from the installed packaged plugin, not only source files:

- E2E report mirror:
  `meta-skill/.meta-skill/e2e/e2e-20260609T050300Z-2a553fb9/report.md`
- Score comparison mirror:
  `meta-skill/.meta-skill/e2e/e2e-20260609T050300Z-2a553fb9/score-comparison.json`
- Isolated worktree:
  `/tmp/agent-meta-skill-e2e-20260609T050300Z-2a553fb9`
- Quick skill A/B run:
  `/private/tmp/agent-meta-skill-e2e-20260609T050300Z-2a553fb9/.meta-skill/e2e/e2e-20260609T050300Z-2a553fb9/quick-skill/.meta-skill/runs/run-20260609T050317715186Z-0de9c3c7`
- Hefty skill run:
  `/private/tmp/agent-meta-skill-e2e-20260609T050300Z-2a553fb9/.meta-skill/e2e/e2e-20260609T050300Z-2a553fb9/hefty-skill/.meta-skill/runs/run-20260609T050407042006Z-0a5d9c0a`

The quick skill baseline produced `UNKNOWN` and failed deterministic validation;
the revised candidate produced `STEADY-LEDGER` and passed both model rubric and
deterministic validation. The heftier release-note skill passed validation,
packaging, App Server eval, model rubric grading, and deterministic grading.

The main awkwardness exposed by dogfood was the lack of model grading before
Phase 6. Adding rubric-backed grading made the lifecycle complete without
expanding the public command surface.

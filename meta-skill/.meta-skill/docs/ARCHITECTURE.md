# meta-skill — Architecture

A full-stop-shop plugin for the **agent-skill lifecycle**: authoring a new skill,
improving an existing one, measuring how well a skill performs, and eventually
running bounded autoresearch over candidate improvements. One thin router
front-ends focused specialists.

> **Status:** in progress. The plugin package and build wiring exist.
> `skill-doctor`, `skill-evaluator`, and `skill-writer` are source skills under
> `meta-skill/skills/`. Run `scripts/sync-plugins.sh` to ship source changes.

## Why this plugin

"Improve my skill" reduces to a small number of distinct intents, each with a
different *starting condition*. Authoring starts from a blank page. Improving
starts from an existing artifact plus a complaint or an audit. Measuring starts
from an existing artifact plus a need for evidence. Autoresearch starts from an
existing eval suite plus permission to generate and compare candidate branches.

A single mega-skill that tries to do all four jobs ends up mediocre at each,
because the entry posture differs. The lifecycle is split by **intent + posture**,
not by file type.

## Skill set

| Skill | User says... | Scope | Posture |
|---|---|---|---|
| **`meta-skill`** (router) | "help me with my skill" | Skinny, always-read front door. Explains the whole flow and routes to a specialist; orchestrates multi-step lifecycles. | Dispatch / orchestrate |
| **`skill-writer`** | "make a new skill" | Greenfield authoring from intent: scaffold `SKILL.md`, write the triggering description, choose structure, stub references. | Mutating, blank page |
| **`skill-doctor`** | "improve / fix / is my skill good?" | **Judge Review** (default, scored Quality page) or **Diagnose** (reproduce a reported failure), then **propose -> approve -> Edit -> Verify**. Feedback is evidence, not edit authorization. | Proposes; edits on approval |
| **`skill-evaluator`** | "how well does it actually perform?" | Author a reusable eval suite for a target, run candidates against cases, and report metrics, failures, and gates. | Authors + measures |
| **`skill-autoresearch`** (future) | "try to find a better version" | Generate candidate branches from failures, run held-out evals, and propose the gated winner. | Optimizes; applies only on approval |

Naming: all worker names are agent nouns. `skill-writer` is deliberately
**not** `skill-creator`, to avoid clashing with the system `skill-creator`
plugin.

## Front-door model

`meta-skill` is a **mandatory, always-read** front door with a **skinny
`SKILL.md`** that maps the lifecycle. It owns the single broad trigger; workers
carry narrow, self-deferring descriptions so an ambiguous request matches
`meta-skill` rather than a worker.

- **Implicit / ambiguous entry** ("help me get my skill production-ready") routes
  through `meta-skill`.
- **Explicit invocation** ("use `skill-doctor`") may go direct for users who
  already know the step they want.

Enforcement is by description, not mechanism: the workers remain real,
independently invocable skills, so the front door is strongly encouraged rather
than hard-guaranteed.

## Boundary rules

These invariants keep the workers from fighting over the same trigger:

- **`skill-writer` vs `skill-doctor`** — blank page vs existing artifact.
- **`skill-doctor` vs `skill-evaluator`** — doctor reproduces or verifies one
  narrow case; evaluator authors and measures many cases.
- **`skill-evaluator` vs `skill-autoresearch`** — evaluator measures selected
  candidates; autoresearch creates new candidate branches and loops over the
  evaluator. Autoresearch is a separate future worker, not a hidden evaluator
  mode.
- **Verify vs full evaluation** — `skill-doctor` Verify is the light in-loop
  confirm for an approved fix. It escalates to `skill-evaluator` when the user
  needs baselines, repeated runs, held-out splits, variance, or publish-readiness.

## User and internal vocabulary

For non-technical users, the surface is:

```text
Current vs Attempt 1 -> run eval -> check progress -> see best gated result -> approve
```

The internal vocabulary stays precise:

| Term | Meaning |
|---|---|
| **candidate** | The thing under test: `current`, `attempt-1`, `attempt-2`. A candidate is backed by a branch and usually an active worktree. Use the field name `candidate`, not `candidate_id`. |
| **trial** | One execution of one case under one candidate. Repetitions create multiple trials, such as `client-email.attempt-1.t3`. |
| **case** | One evaluation task folder under `.meta-skill/cases/<case-id>/`. |
| **run** | One eval batch over selected candidates and cases. |
| **grade** | Code, model, or human judgment over a trial result. |

Do not use `attempt_id` internally. "Attempt 1" is display text for a candidate
only; the per-execution unit is always a trial.

## Agent-facing CLI

Consultants do not run the Meta Skill CLI. They stay in the natural-language
flow: Current vs Attempt 1, run, check progress, approve. The CLI is Codex's
command layer behind that flow.

The CLI lives under `meta-skill/src/` and is the only documented automation
surface. Worker-local scripts are removed. The CLI follows the OpenAI
agent-friendly CLI shape:

- `meta-skill/references/cli.md` is the shared command reference for every
  worker skill.
- `scripts/meta-skill --help` and subcommand help are part of the interface
  when working from this repo. Installed plugin packages expose the same CLI at
  `<plugin-root>/src/meta-skill`.
- `scripts/meta-skill doctor --json` checks primary App Server Python readiness
  and reports `codex_exec` only as an optional fallback capability.
- `--json` writes machine-readable stdout; diagnostics and progress go to
  stderr.
- Commands are composable primitives: workbench init, materialize, run,
  progress, grade, validate, and package.
- Write-like actions use explicit `--dry-run`, `--force`, or approval
  boundaries.

The CLI is not a source of truth. It reads and writes `evals.json`, case
folders, run folders, and git/worktree state; those artifacts remain
authoritative.

Runner implementation code also belongs under `meta-skill/src/`. The first
build is focused on the workbench ledger, with App Server as the primary runner
behind `eval run`. The adapter is Python-first through the official
`openai-codex` SDK and persists outputs/events into `runs/<run-id>/`.

## Iteration workbench

Every target skill or project iterates in a shared, **gitignored** workbench
created in that target's project root: `<project>/.meta-skill/`. The project
root already names the skill and contains the portable payload at
`<project>/skill/`, so the workbench does not add another skill-name namespace.
For the Meta Skill plugin itself, maintainer docs are intentionally committed
under `meta-skill/.meta-skill/docs/`; generated runs, solver workspaces, dist
artifacts, and other workbench state stay ignored.

```text
<project>/
  skill/
    SKILL.md
  .meta-skill/
    spec.md
    review.md
    evals.json
    cases/
      <case-id>/
        task.md
        fixtures/
        rubric.md
        expected.*
        validate.*
    tests/
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
    solver-workspaces/
      <run-id>/
        <trial-id>/
          task.md
          fixtures/
          skill/
```

Authority is split three ways:

- `evals.json` is authoritative for all metadata: suite membership, defaults,
  runner plan, splits, candidate selection, and materialization intent.
- Case folders are authoritative for authored content after materialization:
  `task.md`, fixtures, rubric content, expected outputs, and validator code.
- `runs/<run-id>/` is authoritative for what actually ran.

`task.md` contains only bytes the solver may see. Do not put front matter,
splits, expected output, rubric text, validator notes, grader hints, target
metadata, or harness hints in `task.md`.

Hidden files are hidden by staging. The runner copies only `task.md`, declared
fixtures, and the candidate payload into the solver workspace. It does not copy
`rubric.md`, `expected.*`, `validate.*`, grader prompts, or human labels into
that workspace.

`runs/<run-id>/candidates/<candidate>/` stores output artifacts only. It must not
store source copies. Source identity lives in `run.json` as the candidate branch,
commit, active worktree when applicable, and `payload_digest`. `payload_digest`
is the digest of the staged `skill/` payload tree, not the git commit.

## skill-doctor internals

Two modes select the starting posture, then flow into a shared
**propose -> approve -> Edit -> Verify** back half. The governing rule: the
doctor **never edits a skill without explicit human approval**. Both modes
propose; the human approves; then edits land.

- **Judge Review** (default) scores the skill against the house-style rubric.
  It writes a scored Quality page (`review.md`) with an Overall Quality Score
  and prioritized findings, then stops.
- **Diagnose** reproduces the user's specific reported failure via one narrow
  run. It localizes the cause and proposes the smallest fix.
- **Edit** applies only the approved change to the source skill, never a
  generated package copy.
- **Verify** runs deterministic checks through `scripts/meta-skill validate` and, after
  Diagnose, re-runs the reproduced failure. It escalates to `skill-evaluator`
  for systematic evidence.

Each stage owns a reference. Deterministic validation belongs to the
plugin-level CLI source tree, not to duplicated worker-local scripts:

```text
meta-skill/
├─ src/
│  ├─ meta-skill
│  ├─ meta_skill.py
│  ├─ validate_skill.py
│  ├─ lint_authoring.py
│  └─ requirements.txt
└─ skills/
   └─ skill-doctor/
      ├─ SKILL.md
      └─ references/
         ├─ rubric.md
         ├─ diagnose.md
         ├─ edit.md
         └─ verify.md
```

## skill-evaluator scope

`skill-evaluator` is the **evaluation-suite author**. It specializes in agent
skills with defaults and generalizes to other artifacts by deriving a rubric from
the artifact's job.

The evaluator owns:

- `.meta-skill/evals.json` as the suite manifest
- `.meta-skill/cases/<case-id>/task.md` as visible task content
- hidden case content: `rubric.md`, `expected.*`, and `validate.*`
- candidate selection for a run
- run evidence under `.meta-skill/runs/<run-id>/`
- metrics, failed cases, and handoff back to `skill-doctor`

The evaluator does not create new candidate improvements on its own. It measures
the current skill and selected candidates. Fixes still route to `skill-doctor`;
future autonomous candidate generation routes to `skill-autoresearch`.

### Two pillars

- **Evaluations** are semantic and judged by a model or human. Quality cases
  name the skill when invocation should be forced. Trigger cases use natural
  requests and never name the skill.
- **Validations** are deterministic checks. General checks ship with the plugin.
  Case-local validators live as `validate.*` files beside the case and run only
  after solver output exists.

Human grading calibrates the judge; it is not a parallel case set. Mark gold or
calibration cases in `evals.json`, then store human labels as grade rows over
trial outputs.

## Runner defaults

| Intent | Default runner | Why |
|---|---|---|
| One-off trial or doctor fix | `codex_thread` with worktree isolation | Inspectable, easy to explain, good for candidate edits. |
| Batch eval, A/B comparison, or initial autoresearch | `codex_app_server` through the Python SDK | Primary workbench runner: live thread lifecycle, streamed evidence, multi-turn readiness, and future approval gates while still normalizing into run files. |
| Simple fallback or CI-like automation | `codex_exec` | Repeatable, scriptable, file-backed, emits JSONL events, supports `-C`, `--json`, and `--output-last-message`. |

For `codex_exec`, use `meta-skill/.meta-skill/docs/codex-exec/README.md` and
`meta-skill/.meta-skill/docs/codex-exec/json-events.md` as the local runner reference. The stream
pattern is:

```text
codex exec --json ... > runs/<run-id>/events/<trial-id>.jsonl
```

The parent or monitor derives compact state into `progress.jsonl`. Keep raw event
streams per trial so concurrent trials do not interleave. `progress.jsonl` is the
single run-level file to tail for check-ins.

Use `--output-last-message <file>` to capture solver output. Do not force solver
trials through `--output-schema`; the solver output is the artifact being
graded. Use `--output-schema` only for judge children, editor/reporting children,
or other control tasks whose final answer should be structured JSON.

Use `--ephemeral` only for fire-and-grade batch trials that do not need resume or
session history. Runs that need check-in or resume should keep a session id.

For `codex_app_server`, use `meta-skill/.meta-skill/docs/codex-app-server/README.md` plus the central
CLI reference at `meta-skill/references/cli.md`. App Server is the primary
runner, not a new workbench shape. The first App Server slice should prove that
the Python SDK can run trials and normalize output/events into the same run
files. Do not expose raw App Server JSON-RPC, live steering, cost accounting,
approval policy DSLs, or arbitrary thread controls as V1 CLI commands.

## Candidate isolation and git

Candidates use git branches and worktrees rather than a top-level candidate
registry.

```text
candidate: attempt-1
branch: meta-skill/<suite-id>/attempt-1
worktree: /Users/rishi/.codex/worktrees/... while active
```

`current` is the baseline candidate. Candidate slugs double as branch leaves and
run folder keys. For V1, do not add explicit candidate version numbers.

No `.meta-skill/candidates/` registry exists in V1. `evals.json` selects
candidates for a run, branches/worktrees hold source while active, and
`runs/<run-id>/` records performance and immutable source identity.

## skill-autoresearch boundary

`skill-autoresearch` is a separate future worker. It should:

1. read an existing `evals.json`
2. create candidate branches/worktrees
3. edit only inside candidate worktrees
4. run candidates with `codex_app_server` on selected train/dev cases; use
   `codex_exec` only as a simple fallback
5. evaluate promising candidates on held-out splits the editor did not see
6. record progress, events, results, grades, and gates under `runs/<run-id>/`
7. propose the gated winner
8. apply only after human approval

"Best result" means gated best, not raw-highest score. A candidate must pass
deterministic checks, held-out evaluation, and no-regression gates before it is
presented as the winner.

## Build and packaging

`meta-skill` is a standalone plugin packaged for both Codex and Claude by
`scripts/sync-plugins.sh` alongside the `agent` plugin.

- **Runtime source** (editable, shipped): `meta-skill/references/`,
  `meta-skill/skills/`, and CLI/App Server source under `meta-skill/src/`.
- **Maintainer docs** (editable, committed, not shipped):
  `meta-skill/.meta-skill/docs/`.
- **Generated** (do not hand-edit): `plugins/codex/meta-skill/` and
  `plugins/claude/meta-skill/`.
- **To update source skills or docs:** edit `meta-skill/`, review changed skill
  files directly, run deterministic checks, then run `scripts/sync-plugins.sh`.

Canonical deterministic validators live once under the plugin-level CLI source
tree. Worker-local script folders are not part of the public surface.

## Open questions

- How non-skill deterministic validations receive target artifacts and outputs.
- Which committed project docs should eventually supersede `.plans/` once the
  eval workbench is implemented.

# Meta Skill Eval Workbench Authoring Plan

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`,
`Decision Log`, and `Outcomes & Retrospective` current as implementation
proceeds.

## Purpose / Big Picture

Meta Skill needs a small, teachable eval workbench for consultants and future
agents. The user-facing flow is:

```text
Current vs Attempt 1 -> run eval -> check progress -> see best gated result -> approve
```

This plan covers the **authoring model**: `evals.json`, case folders, hidden
grading boundaries, candidate/trial vocabulary, and the doc updates needed to
make that model durable. Runtime orchestration belongs to
`.plans/codex-app-threads-runner-mini-spec.md` and the local Codex Exec reference
under `docs/codex-exec/`.

The final shape keeps metadata and content separate:

- `evals.json` owns all suite metadata.
- Case folders own authored content.
- `runs/<run-id>/` owns what actually ran.

## Progress

- [x] 2026-06-08T23:01:00Z Read the handoff in `docs/context.md`, current
  Meta Skill docs, isolated trial guidance, research notes, and ChatGPT Pro
  response.
- [x] 2026-06-08T23:01:00Z Created the first ExecPlan draft for manifest-first
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

## Surprises & Discoveries

- Observation: The source docs still used the older `evals.json` case-payload
  model.
  Evidence: `meta-skill/docs/ARCHITECTURE.md` and
  `meta-skill/skills/skill-evaluator/*` described `evals.json` as the place
  where judge-graded cases live.

- Observation: The earlier plan used `variants` and `attempt_id`, which conflicts
  with the final vocabulary.
  Evidence: `.plans/meta-skill-eval-workbench-execplan.md` used
  `variant_id` and `attempt_id`; the locked vocabulary is `candidate` and
  `trial_id`.

- Observation: `docs/codex-exec/` exists and records local `codex-cli 0.135.0`
  evidence.
  Evidence: `docs/codex-exec/README.md` documents `--json`,
  `--output-last-message`, `--output-schema`, `resume`, and long-running JSONL
  monitoring. `docs/codex-exec/json-events.md` documents the event stream shape.

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
  Rationale: One-off work needs inspectability; batch and autoresearch need
  repeatable streams.
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

Generated package sync result:

- `AGENT_MARKETPLACE_SOURCE=/Users/rishi/Code/agent scripts/sync-plugins.sh`
  completed and refreshed the generated Codex and Claude Meta Skill packages.

Validation commands and outputs:

- `python3 meta-skill/skills/skill-doctor/scripts/run.py meta-skill/skills/skill-evaluator/SKILL.md`
  passed 16/16.
- `python3 meta-skill/skills/skill-doctor/scripts/run.py meta-skill/skills/skill-doctor/SKILL.md`
  passed 16/16.
- `git diff --check` passed.

Remaining runtime gaps:

- The docs now define the eval workbench and runner expectations, but the
  materializer, `codex_exec` batch runner, progress tailer, and autoresearch
  worker are still future implementation work.

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
| `.plans/codex-app-threads-runner-mini-spec.md` | Runtime orchestration plan for Codex thread/worktree runs. |
| `docs/codex-exec/README.md` | Local Codex Exec CLI reference. |
| `docs/codex-exec/json-events.md` | Local Codex Exec JSONL event reference. |

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

## Concrete Steps

Work from `/Users/rishi/Code/agent`.

1. Edit source docs:

   ```text
   meta-skill/docs/ARCHITECTURE.md
   meta-skill/skills/skill-evaluator/SKILL.md
   meta-skill/skills/skill-evaluator/references/evaluations.md
   meta-skill/skills/skill-evaluator/references/calibration.md
   meta-skill/skills/skill-evaluator/references/validations.md
   meta-skill/skills/skill-evaluator/references/generalist.md
   meta-skill/references/skill-trial-runs.md
   ```

2. Search for stale terminology:

   ```sh
   rg -n "case\\.md|variant_id|variants|attempt_id|candidate_id|seed\"\\s*:" \
     meta-skill/docs meta-skill/references meta-skill/skills .plans
   ```

   Expected signal: no stale current-state references in touched docs. Historical
   notes may remain only when explicitly labeled as prior context.

3. Run deterministic checks:

   ```sh
   python3 meta-skill/skills/skill-doctor/scripts/run.py meta-skill/skills/skill-evaluator/SKILL.md
   python3 meta-skill/skills/skill-doctor/scripts/run.py meta-skill/skills/skill-doctor/SKILL.md
   ```

   Expected signal: both commands pass.

4. Sync generated plugin packages:

   ```sh
   AGENT_MARKETPLACE_SOURCE=/Users/rishi/Code/agent scripts/sync-plugins.sh
   ```

   Expected signal: sync completes and generated `plugins/codex/meta-skill/` and
   `plugins/claude/meta-skill/` reflect source edits.

5. Inspect diff:

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
- Why is `--output-schema` not used for solver trials?
- What is deferred to `skill-autoresearch`?

Concrete checks:

- `rg -n "case\\.md|variant_id|attempt_id|candidate_id" meta-skill` returns no
  stale current-state matches; explicit "do not use" guardrails may remain.
- `rg -n "task\\.md" meta-skill/skills/skill-evaluator meta-skill/docs` shows
  visible-only guidance.
- `rg -n "payload_digest|output-schema|output-last-message|progress\\.jsonl" meta-skill .plans`
  shows the locked runner caveats.
- Deterministic checks pass for `skill-evaluator` and `skill-doctor`.
- `scripts/sync-plugins.sh` completes.

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

Locked authority rules:

```text
evals.json      = all metadata
case folders    = authored content
runs/<run-id>/  = what actually ran
```

Locked runner rules:

```text
trial / doctor fix       -> codex_thread with worktree isolation
batch / A-B / research   -> codex_exec
future rich integration  -> codex_app_server
```

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

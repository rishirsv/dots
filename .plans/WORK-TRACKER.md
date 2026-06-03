# Meta Skill Work Tracker

Use this tracker to keep the Meta Skill plugin roadmap centered on the issues that most improve evaluation truth. Each priority item includes context, the concrete issue, the intended fix, and an implementation prompt that can be pasted into a future Codex run.

## Tracking Rules

- Keep eval runs single-source. A run evaluates one execution source: working payload, saved snapshot payload, or no skill.
- Fix measurement power before adding more report surface.
- Treat App Server runs that attach a skill payload as forced-skill final-answer evidence, not trigger-routing proof.
- Treat no-skill/unassisted runs as no-skill evidence, not routing proof.
- Do not expose `candidate` or `release` as eval run labels. Prefer source-grounded labels such as working payload, saved snapshot, and no skill.
- Treat completed execution without a deterministic, judge, or human feedback verdict as no verdict recorded, not pass proof.
- Keep `report.html` source-honest: it should help inspect evidence, not make weak evidence look stronger.
- Keep project-level `meta-skill report` lean; link out to per-run reports for investigation.
- Do not add a local server, live watch mode, pricing, or thread resume/fork until saved static reports and core measurement semantics are solid.
- Do not add first-class comparison reports. If a human wants to compare runs, they can open separate run reports side by side.
- Keep plan documents under `.plans/`; do not put planning docs in plugin, skill, or package directories.

## Current Baseline

PR #20 is the current implemented slice. It removed the forward-facing per-run/per-scenario `side` model from Meta Skill evals. A run now evaluates exactly one execution source:

- working payload by default
- saved snapshot payload with `--snapshot`
- no skill / unassisted execution with `--no-skill`

New evidence is written under `scenarios/<scenario>/` instead of `scenarios/<scenario>/<side>/`. `--compare` has been removed from `eval run`; there is no replacement comparison artifact planned. Old side-shaped runs remain readable through legacy compatibility paths, but the write model is single-source.

Token/reporting support remains in place: measured App Server token evidence is canonical in scenario `usage.json`, compact per-turn token data may appear in `turns.jsonl` for transcript inspection, and `report.json` / `report.html` derive token totals from `usage.json`. `results.jsonl` records execution and verdict facts without duplicating token summaries. Final cumulative `tokenUsage.total` is authoritative for scenario totals.

Validation reported by PR #20:

- `npm test` from `plugins/meta-skill/`
- `npm run check:app` from `plugins/meta-skill/`
- `git diff --check` from the repo root

Remaining baseline risk: the live App Server smoke remains opt-in, so real payload-shape proof still needs a captured fixture or explicit unsupported-version handling.

## Completed Work

### 1. Remove Sides; Make Eval Runs Single-Source

Status: completed in PR #20, merge commit `6b4086da3feb327fc8b4f8f563ea73390c30ecaa`.

Context: The eval system currently treats `side` as the hidden unit of execution. A run can contain old candidate and release side evidence under `scenarios/<scenario>/<side>/`. That model grew from in-run comparison, but it now blocks a cleaner product shape.

Issue: If sides remain, every new mode becomes another in-run side: no-skill execution, saved snapshots, working-payload variants, writable mode, sampled attempts, and future routing. That makes the run bundle, judges, report model, token aggregation, and comparison semantics harder to reason about.

Fix landed: Eval runs now use `run_source` instead of forward-facing sides. The CLI runs the working payload by default, a saved snapshot with `--snapshot`, or an unassisted/no-skill execution with `--no-skill`. New evidence is written under `scenarios/<scenario>/`, and legacy side-shaped runs are read-only compatibility input.

### 2. Add No-Skill / Unassisted Runs

Status: completed in PR #20.

Context: The tool needs to answer whether a skill helped compared with no skill. In the no-side model, no-skill execution is its own run source rather than a side inside another run.

Fix landed: `meta-skill eval run <project> --no-skill` stages and runs the scenario without copying or attaching a skill. Reports label this as no-skill evidence, not routing proof.

Remaining follow-up: keep no-skill runs as manual control evidence only. Do not build a first-class uplift or comparison system around them.

### 3. Collapse Token Availability To Canonical Usage Evidence

Status: completed locally in this worktree.

Context: Token evidence had per-metric availability objects, `partial` summaries, unavailable counts, per-metric unavailable reason arrays, and denormalized summaries across `usage.json`, `turns.jsonl`, `results.jsonl`, `report.json`, and `report.html`.

Fix landed: `usage.json` is the canonical scenario token evidence. Token usage is a nullable numeric summary plus one `unavailable_reason`; final cumulative `tokenUsage.total` from the final reporting turn is authoritative for scenario totals. `results.jsonl` no longer carries token summaries, and reports aggregate totals and unavailable reasons from scenario `usage.json`.

## Priority Issue Backlog

### 1. Remove Trigger Scenario Semantics

Status: highest-priority simplification.

Context: The docs and schema expose `T` trigger scenarios for activation or non-activation boundaries. Trigger scenarios are meant to prove when a skill should or should not be selected.

Issue: Current working-payload or saved-snapshot runs force-attach the staged skill on the first turn, and no-skill/unassisted runs attach no skill. Neither proves native routing. The current `T` surface can make users think the harness tests routing when it does not.

Fix: Remove `T` from supported eval families until a true routing harness exists. Keep trigger routing as future work and keep forced-skill/no-skill labels explicit.

Implementation Prompt:

```text
Hard-cut trigger scenarios out of the supported Meta Skill eval family until native routing exists. In /Users/rishi/Code/agent, update `plugins/meta-skill/src/models.ts`, `src/lint.ts`, `src/commands.ts`, eval docs, skill-eval guidance, tests, and generated `app/` output so eval families are R/F/G only. Keep source-honest notes that working-payload and saved-snapshot runs are forced-skill behavior evidence and no-skill runs are unassisted evidence, not trigger-routing proof. Do not add a compatibility alias for T. If existing tests or docs mention T, update them to use R/F/G or move trigger wording to a future-work limitation. Run `npm test`, `npm run check:app`, `git diff --check`, and `scripts/sync-plugins.sh` if source skill docs outside `plugins/meta-skill` change.
```

### 2. Split Execution Outcome From Evaluation Verdict

Status: completed.

Context: The App Server runner used to return a scenario result with a `status` field, and successful execution was recorded as `needs_review`.

Issue: A review-like status is not a runner verdict. Hardcoding it in the runner blurred execution success with behavioral assessment and made default runs look more evaluative than they are.

Fix landed: The runner and result ledger now write `execution_status` plus optional `verdict`. Reports derive optional `assessment_status` only from deterministic tests, judges, or human feedback. Completed execution with no verdict is reported as no verdict recorded, and old persisted `needs_review` rows normalize read-only to completed execution with no verdict.

Implementation Prompt:

```text
This was implemented by hard-cutting the write path away from verdict-like runner statuses. Keep old report compatibility read-only; do not write `needs_review` as a current status.
```

### 3. Remove `eval generate`

Status: dead public surface.

Context: Scenario generation is a natural future workflow: users want help creating `task.md`, `scenario.json`, and `criteria.json`.

Issue: `eval generate` appears in help and docs, dispatches in the CLI, and then throws "not implemented." That creates a command-shaped pothole.

Fix: Hide it until real. Do not keep a command that exists only to explain that it does not exist.

Implementation Prompt:

```text
Remove unsupported `meta-skill eval generate` from the public Meta Skill surface in /Users/rishi/Code/agent. Delete it from CLI help, eval command dispatch, eval docs, shared CLI conventions, and tests that expect it as a supported command. Keep a limitation note that generated scenarios are future work if helpful. Ensure unknown `eval generate` now returns the normal unsupported subcommand message rather than a bespoke not-implemented command. Rebuild `app/`, run `npm test`, `npm run check:app`, `git diff --check`, and `scripts/sync-plugins.sh` if source skill docs outside `plugins/meta-skill` change.
```

### 4. Gate Or Remove Writable Artifact Claims

Status: remove misleading scaffolding.

Context: Artifact scenarios are useful because many skills produce files. The report model can list artifacts, and scenario evidence folders contain an `artifacts/` directory.

Issue: The current runner uses a read-only sandbox and tells the solver not to modify files. That means artifact capture exists as scaffolding for a capability the runner cannot exercise.

Fix: Remove artifact scenario claims and report emphasis until writable execution exists. Do not add writable mode unless a concrete skill eval needs it.

Implementation Prompt:

```text
Make Meta Skill artifact scenarios honest in /Users/rishi/Code/agent. Remove or clearly hide artifact scenario claims from docs, report labels, and validation while the runner is read-only. Keep raw file listings only if they are naturally produced by existing evidence, not as a promised artifact-writing capability. Add tests proving read-only runs do not claim artifact proof. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 5. Defer n-Sample Reliability

Status: valuable but too heavy for the current product shape.

Context: Each scenario currently runs once per eval run. That keeps evidence simple and cheap, and makes raw traces easy to inspect.

Issue: LLM behavior is stochastic, but adding `--samples`, attempt folders, distributions, and flake-rate reporting creates a second execution dimension before the basic eval loop is proven useful.

Fix: Keep n-sample reliability as a parking-lot idea, not an active backlog item. Prefer one clear run with strong evidence over a distribution UI.

Implementation Prompt:

```text
Keep Meta Skill eval execution single-attempt for now. Remove active roadmap language that implies `--samples`, flake rate, attempt distributions, or attempt folders are near-term work. Leave a short parking-lot note that reliability sampling may return only after the single-run evidence model is stable. Run `git diff --check`.
```

### 6. Add App Server Crash Recovery Only

Status: execution robustness without a new product concept.

Context: Scenario runs are independent and currently execute through a managed stdio App Server client.

Issue: A mid-run App Server exit rejects pending requests but does not respawn cleanly for remaining scenarios.

Fix: Add a simple per-scenario retry after App Server process death. Defer bounded concurrency; it is a wall-clock optimization, not a core correctness concept.

Implementation Prompt:

```text
Add crash recovery to Meta Skill App Server eval execution without adding concurrency. In /Users/rishi/Code/agent, update `AppServerJsonClient` or runner ownership so App Server process exit clears child state, rejects active work, and allows one managed respawn for the next scenario retry. Add clear `events.jsonl` rows for retry_started, retry_succeeded, and retry_failed. Add tests for App Server exit then successful retry and retry exhaustion. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 7. Formalize The Token Protocol Adapter

Status: correctness hardening for the current reporting slice.

Context: Token reporting now records canonical scenario `usage.json`, compact per-turn usage, and report aggregates derived from usage evidence. It depends on App Server `thread/tokenUsage/updated` payloads.

Issue: Token parsing currently follows observed event shapes. If the App Server protocol changes, the tool may degrade into widespread unavailable metrics without clearly saying "unsupported protocol version."

Fix: Move current App Server token extraction into a small adapter keyed by recorded Codex/App Server version and raw event shape. Distinguish "no usage event emitted" from "usage event emitted but protocol unsupported" without adding fallback support for abandoned token shapes.

Implementation Prompt:

```text
Create a small Meta Skill App Server token usage adapter in /Users/rishi/Code/agent. Move token parsing out of `src/app-server/runner.ts` into a focused module with typed parse results: present, unavailable-no-event, unavailable-missing-current-fields, and unsupported-protocol. Record the Codex version already captured in run.json and include protocol/version context in unavailable reasons. Add fixture tests for the current camelCase App Server fields, missing `tokenUsage.total`, no event, and unknown current-protocol shapes. Keep `usage.json` canonical and keep report rendering unchanged except for clearer reasons. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 8. Reduce Evidence Ceremony Where It Has No Consumer

Status: simplification pass after core semantics are stable.

Context: The run bundle is intentionally audit-heavy: run header, events, results, tests, grades, feedback, snapshots, scenario traces, usage, final answers, reports, and index.

Issue: The evidence schema is mature, but the measurement power is still early. Some denormalization and artifact surfaces can create drift risk without enough consumer value.

Fix: Keep the audit ledger pattern, but make `usage.json` and run snapshots canonical. Derive report/index views from canonical files where possible and remove compatibility write paths only when no tests or consumers rely on them.

Implementation Prompt:

```text
Do a conservative Meta Skill evidence-surface simplification pass in /Users/rishi/Code/agent. Inventory every run artifact and every reader in `plugins/meta-skill/src`. Identify duplicate token/result/report write paths that have no real consumer. Keep `usage.json`, snapshots, final.md, turns.jsonl, rpc.jsonl, run.json, and append-only evidence streams where they carry audit value. Remove or derive any redundant fields only with compatibility tests for older runs. Do not weaken source-honest labels or report usefulness. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 9. Enforce `src/` To `app/` Drift Checks

Status: repo hygiene.

Context: The plugin runtime executes committed JavaScript under `plugins/meta-skill/app/`, while source lives under `plugins/meta-skill/src/`.

Issue: `npm run check:app` catches drift, and it currently passes, but the architecture still depends on humans remembering to run it before commit.

Fix: Enforce the check in CI or a repo-local pre-commit/test gate so source/runtime drift cannot land silently.

Implementation Prompt:

```text
Harden Meta Skill committed-runtime drift prevention in /Users/rishi/Code/agent. Confirm `npm run check:app` catches src/app mismatch and add the lightest repo-appropriate enforcement path: CI check, documented commit gate, or existing validation script integration. Do not stop committing `app/` unless the plugin runtime packaging changes deliberately. Add or update tests/docs so contributors know to run `npm test` or `npm run check:app` after TypeScript changes. Run `npm run check:app`, `npm test` if feasible, and `git diff --check`.
```

### 10. Keep Report Polish Below Measurement Work

Status: intentionally lower priority.

Context: The report shell, transcript rendering, evidence hierarchy, project rollup, and Codex Browser QA are valuable product improvements.

Issue: Report polish cannot answer the core questions that are currently unmeasurable: native routing, reliability, and writable artifact behavior.

Fix: Continue report polish only after the saved report stays source-honest about run-source semantics and after the measurement backlog above is underway.

Implementation Prompt:

```text
Continue Meta Skill report polish only after the measurement backlog remains explicit. In /Users/rishi/Code/agent, improve per-run `report.html` as a static single-source investigation surface. Include scenario navigation, token section, readable transcripts, evidence hierarchy, lean project rollup links, and Codex Browser visual QA. Keep source-honest labels for forced-skill evidence, no-skill evidence, completed execution without verdict, failed verdicts, and passed verdicts. Do not add a server, live watch, pricing, comparison reports, or thread resume/fork. Add rendering tests for legacy/minimal reports, failed/completed/passed scenarios, raw links, unavailable token evidence, and transcripts. Run `npm test`, `npm run check:app`, and visual QA where possible.
```

## Parking Lot

- Live watch mode and report server.
- Thread resume/fork inside eval runs.
- Reliability sampling, flake rates, and distribution reporting.
- First-class comparison reports or uplift dashboards.
- Pricing estimates for token usage.
- Native trigger-routing proof once Codex exposes a suitable routing harness.
- Marketplace publish/install flows; Meta Skill should remain an authoring workbench, not a publisher.

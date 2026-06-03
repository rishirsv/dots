# Meta Skill Work Tracker

Use this tracker to keep the Meta Skill plugin roadmap centered on the issues that most improve evaluation truth. Each priority item includes context, the concrete issue, the intended fix, and an implementation prompt that can be pasted into a future Codex run.

## Tracking Rules

- Fix measurement power before adding more report surface.
- Treat current App Server runs as forced-skill final-answer evidence, not trigger-routing or no-skill uplift proof.
- Treat `needs_review` as unresolved evidence, not pass proof.
- Keep `report.html` source-honest: it should help inspect evidence, not make weak evidence look stronger.
- Keep project-level `meta-skill report` lean; link out to per-run reports for investigation.
- Do not add a local server, live watch mode, pricing, or thread resume/fork until saved static reports and core measurement semantics are solid.
- Keep plan documents under `.plans/`; do not put planning docs in plugin, skill, or package directories.

## Current Baseline

Token/reporting work is the current implemented slice. It adds measured App Server token evidence to `usage.json`, `turns.jsonl`, `results.jsonl`, `report.json`, and `report.html`, keeps candidate and release usage separate, and makes final cumulative `tokenUsage.total` authoritative for scenario-side totals.

Non-mutating checks from the evaluation pass passed:

- `npm run typecheck` from `plugins/meta-skill/`
- `npm run check:app` from `plugins/meta-skill/`

Remaining baseline risk: the live App Server smoke remains opt-in, so real payload-shape proof still needs a captured fixture or explicit unsupported-version handling.

## Priority Issue Backlog

### 1. Make Eval Sides First-Class Config

Status: highest-priority architecture change.

Context: The eval system already has the concept of a side. Today the side is the hardcoded union `candidate | release`. It determines which skill root is staged, how evidence paths are named, and how reports compare results.

Issue: Every missing measurement mode wants to become another side: baseline/no-skill, release, writable artifact mode, sampled attempts, skill variants, and eventually routing mode. Keeping side as a hardcoded union will scatter `if (side === ...)` branches through runner, report, judge, and result code.

Fix: Replace the hardcoded side union at the orchestration boundary with a side config object such as `{ id, kind, skillRoot, attachPolicy, sandboxPolicy, sampleCount }`. Keep existing `candidate` and `release` behavior as configs, then build new modes on top.

Implementation Prompt:

```text
Refactor Meta Skill eval orchestration in /Users/rishi/Code/agent so scenario sides are first-class config objects instead of hardcoded "candidate" | "release" branches. Start with `plugins/meta-skill/src/eval/run.ts`, `src/app-server/runner.ts`, `src/eval/results.ts`, `src/eval/judge.ts`, `src/models.ts`, and `src/report.ts`. Preserve current candidate and release behavior exactly. Introduce side config fields for id, kind, skillRoot, attachPolicy, sandboxPolicy, and sampleCount, but only wire fields needed for current behavior. Add tests proving candidate-only and `--compare release` runs produce the same evidence paths, report comparison mode, judge side discovery, and token summaries as before. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 2. Add Baseline / No-Skill Comparison

Status: highest-leverage measurement gap.

Context: `eval run` can compare candidate against release. That is useful for regression checks, but it does not answer whether the skill helped versus no skill.

Issue: `--compare baseline` currently errors, and the runner force-attaches the staged skill on the first turn. The tool can measure "what happened with the skill attached," but not "did this skill improve the outcome?"

Fix: Add a baseline side configured with `skill: none` and `attachPolicy: none`. It should run the same scenario task and turns with no skill attachment, then report candidate-vs-baseline outcomes.

Implementation Prompt:

```text
Implement `meta-skill eval run <project> --compare baseline` in /Users/rishi/Code/agent after side config exists. Add a baseline side that stages scenario files but does not copy or attach a skill. Preserve read-only/no-network/no-approval defaults. Update run.json side metadata, results, reports, comparisons, token summaries, judges, and run index handling so baseline is a real side beside candidate. The report must label baseline as "No skill" and must not imply routing proof. Add tests for candidate-only, baseline comparison, release comparison, invalid compare values, and baseline side evidence paths. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 3. Split Execution Outcome From Evaluation Verdict

Status: core correctness contract.

Context: The App Server runner currently returns a scenario result with a `status` field, and successful execution is recorded as `needs_review`.

Issue: `needs_review` is not a runner verdict; it means "execution produced evidence that no evaluator has resolved." Hardcoding it in the runner blurs execution success with behavioral assessment and makes default runs look more evaluative than they are.

Fix: Make the runner return execution outcome plus evidence paths, for example `execution_status: "completed" | "errored"`. Let deterministic tests, judges, and human feedback own `assessment_status`.

Implementation Prompt:

```text
Split Meta Skill scenario execution status from behavioral assessment status. Change `AppServerScenarioRunner.run()` to return execution outcome and evidence, not a verdict-like `needs_review`. Update `recordScenarioResult`, `runStatus`, report models, report rendering, tests, and docs so saved evidence distinguishes `execution_status` from `assessment_status`. Existing completed scenarios without tests/judges/human feedback should report execution completed and assessment needs_review. Harness errors should be execution errored plus blocking failure classification. Preserve backward compatibility for older result rows when building reports. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 4. Resolve Trigger Scenario Semantics

Status: high-priority truth-in-labeling issue.

Context: The docs and schema expose `T` trigger scenarios for activation or non-activation boundaries. Trigger scenarios are meant to prove when a skill should or should not be selected.

Issue: Current App Server evals force-attach the staged skill on the first turn, so `T` scenarios cannot prove native routing. The docs warn about this, but the surface still lets users author and select `T` as if it were an executable trigger family.

Fix: Pick one explicit contract. Either remove `T` from supported eval families until native routing exists, or add a real routing side/mode where the skill is available but not force-attached. The conservative fix is to remove `T` from default guidance and validation until routing exists.

Implementation Prompt:

```text
Hard-cut trigger scenarios out of the supported Meta Skill eval family until native routing exists. In /Users/rishi/Code/agent, update `plugins/meta-skill/src/models.ts`, `src/lint.ts`, `src/commands.ts`, eval docs, skill-eval guidance, tests, and generated `app/` output so eval families are R/F/G only. Keep source-honest notes that current runs are forced-skill behavior evidence, not trigger-routing proof. Do not add a compatibility alias for T. If existing tests or docs mention T, update them to use R/F/G or move trigger wording to a future-work limitation. Run `npm test`, `npm run check:app`, `git diff --check`, and `scripts/sync-plugins.sh` if source skill docs outside `plugins/meta-skill` change.
```

### 5. Add n-Sample Reliability

Status: high-priority eval-strength improvement.

Context: A scenario side currently runs once. That keeps evidence simple and cheap, and makes raw traces easy to inspect.

Issue: LLM behavior is stochastic. One run is weak evidence for reliability, especially for gate, ambiguity, and trigger-like behaviors. The current report cannot show flake rate or distribution.

Fix: Add `sampleCount` to side config. Each scenario side should produce multiple attempts and aggregate assessment distribution, failure classes, and token distribution.

Implementation Prompt:

```text
Add n-sample support to Meta Skill eval runs in /Users/rishi/Code/agent. Extend side config and CLI with a conservative option such as `--samples <n>` or manifest default `sampleCount`, defaulting to 1. Store attempts under stable paths like `scenarios/<scenario>/<side>/attempt-001/` or another explicit versioned shape, and update reports to aggregate status distribution, failure classifications, token totals, and flake rate. Preserve old single-run evidence reading. Add tests for sampleCount=1 compatibility, sampleCount=3 aggregation, one failed attempt, token distribution, and report/index output. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 6. Add App Server Crash Recovery And Bounded Concurrency

Status: execution robustness and wall-clock improvement.

Context: Scenario sides are independent. The runner currently executes them sequentially through a managed stdio App Server client.

Issue: A mid-run App Server exit rejects pending requests but does not respawn cleanly for remaining scenario sides. Sequential execution also leaves easy wall-clock wins unused.

Fix: Add a bounded worker pool over scenario sides and a per-side retry policy that respawns the managed App Server after process death.

Implementation Prompt:

```text
Add bounded concurrency and crash recovery to Meta Skill App Server eval execution. In /Users/rishi/Code/agent, update the run loop so scenario sides execute through a configurable small pool while preserving deterministic evidence paths and JSONL event ordering. Update `AppServerJsonClient` or runner ownership so App Server process exit clears the child state, rejects active work, and allows a managed respawn for the next retry. Add per-scenario-side retry with clear `events.jsonl` rows for retry_started, retry_succeeded, and retry_failed. Keep default concurrency conservative. Add tests for sequential compatibility, two independent sides, App Server exit then successful retry, and retry exhaustion. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 7. Formalize The Token Protocol Adapter

Status: correctness hardening for the current reporting slice.

Context: Token reporting now records `usage.json`, per-turn usage, side summaries, and report aggregates. It depends on App Server `thread/tokenUsage/updated` payloads.

Issue: Token parsing currently follows observed event shapes. If the App Server protocol changes, the tool may degrade into widespread unavailable metrics without clearly saying "unsupported protocol version."

Fix: Move token extraction into a small adapter keyed by recorded Codex/App Server version and raw event shape. Distinguish "no usage event emitted" from "usage event emitted but protocol unsupported."

Implementation Prompt:

```text
Create a small Meta Skill App Server token usage adapter in /Users/rishi/Code/agent. Move token parsing out of `src/app-server/runner.ts` into a focused module with typed parse results: present, unavailable-no-event, unavailable-missing-fields, and unsupported-protocol. Record the Codex version already captured in run.json and include protocol/version context in unavailable reasons. Add fixture tests for camelCase fields, snake_case fields, nested cached/reasoning fields, missing `total`, no event, and unknown shapes. Keep `usage.json` canonical and keep report rendering unchanged except for clearer reasons. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 8. Remove Or Implement `eval generate`

Status: dead public surface.

Context: Scenario generation is a natural future workflow: users want help creating `task.md`, `scenario.json`, and `criteria.json`.

Issue: `eval generate` appears in help and docs, dispatches in the CLI, and then throws "not implemented." That creates a command-shaped pothole.

Fix: Either hide it until real or implement a minimal draft scenario scaffold. Prefer hiding it unless the generator can create useful draft folders with honest review labels.

Implementation Prompt:

```text
Remove unsupported `meta-skill eval generate` from the public Meta Skill surface in /Users/rishi/Code/agent. Delete it from CLI help, eval command dispatch, eval docs, shared CLI conventions, and tests that expect it as a supported command. Keep a limitation note that generated baseline-compatible scenarios are future work if helpful. Ensure unknown `eval generate` now returns the normal unsupported subcommand message rather than a bespoke not-implemented command. Rebuild `app/`, run `npm test`, `npm run check:app`, `git diff --check`, and `scripts/sync-plugins.sh` if source skill docs outside `plugins/meta-skill` change.
```

### 9. Gate Writable Artifact Scenarios Behind Writable Mode

Status: remove misleading scaffolding or make it real.

Context: Artifact scenarios are useful because many skills produce files. The report model can list per-side artifacts, and side evidence folders contain an `artifacts/` directory.

Issue: The current runner uses a read-only sandbox and tells the solver not to modify files. That means artifact capture exists as scaffolding for a capability the runner cannot exercise.

Fix: Either hide artifact scenario claims until writable mode exists, or add a side config with `sandboxPolicy: workspaceWrite` and artifact collection. Prefer gating artifact scenarios behind explicit writable mode.

Implementation Prompt:

```text
Make Meta Skill artifact scenarios honest in /Users/rishi/Code/agent. Until writable side mode exists, remove or clearly gate artifact scenario claims from docs, report labels, and validation. If implementing writable mode instead, add a side config sandbox option, allow writes only inside the staged workspace/artifacts area, collect generated files deterministically, and label writable runs distinctly in run.json/report.json/report.html. Add tests proving read-only runs do not claim artifact proof and writable runs capture expected files without escaping the stage. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 10. Reduce Evidence Ceremony Where It Has No Consumer

Status: simplification pass after core measurement changes.

Context: The run bundle is intentionally audit-heavy: run header, events, results, tests, grades, feedback, snapshots, side traces, usage, final answers, reports, and index.

Issue: The evidence schema is mature, but the measurement power is still early. Some denormalization and artifact surfaces can create drift risk without enough consumer value.

Fix: Keep the audit ledger pattern, but make `usage.json` and run snapshots canonical. Derive report/index views from canonical files where possible and remove compatibility write paths only when no tests or consumers rely on them.

Implementation Prompt:

```text
Do a conservative Meta Skill evidence-surface simplification pass in /Users/rishi/Code/agent after baseline and side config work lands. Inventory every run artifact and every reader in `plugins/meta-skill/src`. Identify duplicate token/result/report write paths that have no real consumer. Keep `usage.json`, snapshots, final.md, turns.jsonl, rpc.jsonl, run.json, and append-only evidence streams where they carry audit value. Remove or derive any redundant fields only with compatibility tests for older runs. Do not weaken source-honest labels or report usefulness. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 11. Enforce `src/` To `app/` Drift Checks

Status: repo hygiene.

Context: The plugin runtime executes committed JavaScript under `plugins/meta-skill/app/`, while source lives under `plugins/meta-skill/src/`.

Issue: `npm run check:app` catches drift, and it currently passes, but the architecture still depends on humans remembering to run it before commit.

Fix: Enforce the check in CI or a repo-local pre-commit/test gate so source/runtime drift cannot land silently.

Implementation Prompt:

```text
Harden Meta Skill committed-runtime drift prevention in /Users/rishi/Code/agent. Confirm `npm run check:app` catches src/app mismatch and add the lightest repo-appropriate enforcement path: CI check, documented commit gate, or existing validation script integration. Do not stop committing `app/` unless the plugin runtime packaging changes deliberately. Add or update tests/docs so contributors know to run `npm test` or `npm run check:app` after TypeScript changes. Run `npm run check:app`, `npm test` if feasible, and `git diff --check`.
```

### 12. Keep Report Polish Below Measurement Work

Status: intentionally lower priority.

Context: The report shell, transcript rendering, candidate-vs-release diffs, evidence hierarchy, project rollup, and Codex Browser QA are valuable product improvements.

Issue: Report polish cannot answer the core questions that are currently unmeasurable: no-skill uplift, native routing, reliability, and writable artifact behavior.

Fix: Continue report polish only after the saved report stays source-honest about forced-skill evidence and after the measurement backlog above is underway.

Implementation Prompt:

```text
Continue Meta Skill report polish only after the measurement backlog remains explicit. In /Users/rishi/Code/agent, improve per-run `report.html` as a static investigation surface with scenario rail, token section, readable transcripts, candidate/release final diff, evidence hierarchy, lean project rollup links, and Codex Browser visual QA. Keep source-honest labels for forced-skill evidence and `needs_review`. Do not add a server, live watch, pricing, or thread resume/fork. Add rendering tests for legacy/minimal reports, failed/needs_review/passed scenarios, raw links, token availability, transcripts, and release comparisons. Run `npm test`, `npm run check:app`, and visual QA where possible.
```

## Parking Lot

- Live watch mode and report server.
- Thread resume/fork inside eval runs.
- Pricing estimates for token usage.
- Native trigger-routing proof once Codex exposes a suitable routing harness.
- Marketplace publish/install flows; Meta Skill should remain an authoring workbench, not a publisher.

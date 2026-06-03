# Meta Skill Work Tracker

Use this tracker to keep the Meta Skill plugin roadmap centered on evaluation truth. The immediate goal is to remove verdict-shaped and comparison-shaped ceremony, then spend the saved complexity on App Server capabilities that a plain model API cannot provide: event trajectories, sandbox evidence, and forkable threads.

## Current State Summary

PR #20 removed the forward-facing eval `side` model. A run now evaluates one execution source at a time:

- working payload by default
- saved snapshot payload with `--snapshot`
- no skill / unassisted execution with `--no-skill`

New run evidence is written under `scenarios/<scenario>/`, not `scenarios/<scenario>/<side>/`. `--compare` has been removed from `eval run`; no first-class comparison report is planned. No-skill runs are manual control evidence, not an automated uplift score.

PR #21, merge commit `03bc2b4d3f365cbd50006107dd1bec381f5a8101`, split the verdict contract. Current eval writes use execution facts plus optional verdict evidence: successful App Server execution is `execution_status: completed`, and pass/fail comes only from deterministic tests, judges, or human feedback. Current reports say "no verdict recorded" when a scenario executed but has no verdict. Old `needs_review` evidence is normalized read-only.

PR #22, merge commit `5911f43214b120915af26d7aeb6b9a6a9c50239c`, collapsed token usage evidence. Scenario `usage.json` is now the canonical token evidence file, token metrics are nullable numbers with one `unavailable_reason`, `results.jsonl` no longer duplicates token summaries, and reports derive token totals and unavailable reasons from scenario usage evidence. Token parsing now reads the recorded generated App Server camelCase token fields instead of probing multiple alias shapes.

The App Server runner currently behaves mostly like a reliable final-answer runner: it starts one read-only/no-approval/no-network thread per scenario, force-attaches the skill payload when a skill source is used, scrapes final answer deltas, captures token telemetry when present, and saves raw RPC events. It does not yet use the App Server surfaces that would justify the extra machinery: structured trajectory assertions, forked decision trees, tool/sandbox event checks, writable artifact capture, trigger routing, or bounded sampling.

The evidence model is still heavier than the measurement power:

- readiness still exists as `ready | blocked | unknown`; keep it source-honest and avoid rebuilding verdict-shaped review states.
- App Server protocol drift is still handled mostly by unavailable token evidence; add a clearer canary/gate before building more event-stream features.
- trigger/artifact concepts are exposed before the runner can prove native routing or writable outputs.
- `eval generate` is still a documented throwing stub.
- retry/backoff, schema versions, committed `src/` to `app/` drift, and many report/index fields add ceremony before there are external consumers.

Validation baseline from the current merged slice:

- `npm test` from `plugins/meta-skill/`
- `npm run check:app` from `plugins/meta-skill/`
- `git diff --check` from the repo root

## Prioritized Items

### 1. Remove Dead Eval Surface And Artifact Claims

Status: dead/unusable surface.

Context: `eval generate` is wired as a throwing stub. Artifact scenario claims and empty `artifacts/` directories imply writable output capture, but the runner uses read-only sandbox instructions.

Issue: These surfaces invite users to expect capabilities that do not exist and force docs, lint, report, and tests to carry unexercisable concepts.

Surface: `commands.ts`, `commands.test.ts`, `skills/skill-eval/references/cli.md`, `skills/skill-create/references/cli-conventions.md`, `app-server/runner.ts`, `report.ts`, `lint.ts`, scenario fixtures, and generated `app/`.

Solution Shape: Remove the unsupported command and promised writable behavior. Keep artifact evidence only for real files that already exist or for future explicit writable mode.

Mini Plan:

1. Delete `eval generate` from help, dispatch, docs, and tests.
2. Remove artifact scenario type/claims from author-facing metadata until writable mode exists.
3. Stop creating empty `artifacts/` folders by default.
4. Keep report artifact listing only for actual files found in evidence.
5. Rebuild `app/` and sweep skill docs.

Implementation Prompt:

```text
Remove dead eval surface from Meta Skill in /Users/rishi/Code/agent. Delete unsupported `meta-skill eval generate` from help, dispatch, docs, and tests. Remove or hide artifact scenario type/claims and any report emphasis that implies writable artifact capture while the runner is read-only. Keep evidence directories only where needed for actual files written by the harness. Rebuild `app/`, run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 2. Collapse Scenario Classification Axes

Status: simplify taxonomy.

Context: Scenario metadata has both `family` (`R/F/T/G`) and `type` (`behavior/trigger/artifact/gate`). Trigger and artifact types are currently more aspirational than executable.

Issue: Authors choose two overlapping fields, and the runner cannot prove native trigger routing or writable artifacts anyway.

Surface: `models.ts`, `lint.ts`, scenario fixtures, eval docs, report subtitles, and generated `app/`.

Solution Shape: Keep one author-facing axis: executable families. For now use `R`, `F`, and `G`; derive any display text internally. Treat source-grounding as topic/criteria, not a separate type.

Mini Plan:

1. Consolidate supported family constants.
2. Remove `ScenarioType` from required scenario metadata and lint validation.
3. Remove `T`/trigger and artifact references from CLI selection/docs until protocol-proven modes exist.
4. Update fixtures, loading, reports, and tests.
5. Preserve old-run display only if existing report reads need it.

Implementation Prompt:

```text
Collapse Meta Skill scenario taxonomy in /Users/rishi/Code/agent. Remove `ScenarioType` as an author-facing metadata field, or derive it from `ScenarioFamily` internally for display only. With trigger/artifact support removed, keep supported families to the current executable set and update `plugins/meta-skill/src/models.ts`, `src/lint.ts`, scenario loading, docs, fixtures, and reports. Do not add compatibility aliases unless old-run read mode requires them. Rebuild `app/`, run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 3. Simplify App Server Retry And Crash Recovery

Status: remove local-process overkill.

Context: The JSON-RPC client retries overloaded protocol errors with exponential backoff and jitter even though the server is a managed local stdio subprocess. At the same time, child exit rejects pending requests but does not clear the child handle.

Issue: Retry/backoff is ceremony for this topology. The useful recovery is simple process state handling and one explicit scenario-level retry after respawn.

Surface: `app-server/client.ts`, `app-server/client.test.ts`, `app-server/runner.ts`, eval run orchestration, and generated `app/`.

Solution Shape: Delete configurable retry policy. On exit, clear `this.child` and reject active requests. Scenario orchestration may respawn once for the next scenario or retry the current scenario once with explicit evidence.

Mini Plan:

1. Remove `AppServerRetryPolicy`, jitter/random/sleep injection, and overload retry tests.
2. Clear child state on exit after rejecting pending requests.
3. Add tests for process exit, request rejection, and one managed respawn path.
4. Record respawn/retry evidence in `events.jsonl`.
5. Rebuild generated `app/`.

Implementation Prompt:

```text
Simplify Meta Skill App Server client retry behavior in /Users/rishi/Code/agent. Remove exponential backoff, jitter, retry policy config, and tests that simulate overloaded local stdio requests. Ensure process exit clears `this.child`, rejects active requests, and lets scenario orchestration perform at most one explicit respawn/retry for the next scenario. Update `plugins/meta-skill/src/app-server/client.ts`, runner orchestration/tests, generated `app/`, and docs. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 4. Bound The App Server Event Buffer

Status: incremental reliability fix.

Context: The client stores raw App Server events in memory and scenario code asks for `eventsSince(mark)`. This is fine for tiny runs but becomes risky once trajectory parsing, sampling, or fuzzing is added.

Issue: An unbounded event buffer makes long or noisy scenarios a memory risk and can hide missing persistence boundaries.

Surface: `app-server/client.ts`, `app-server/runner.ts`, `rpc.jsonl` persistence, live-smoke tests, and future trajectory parsing.

Solution Shape: Treat `rpc.jsonl` as the durable event log and keep only a bounded in-memory window or mark-scoped collector needed for the current turn. If events overflow memory bounds, write an explicit trace truncation/overflow marker.

Mini Plan:

1. Measure current in-memory event use: wait predicates, final text collection, token extraction, trace writing.
2. Replace global unbounded retention with a bounded buffer or per-turn collector.
3. Keep full raw events streamed to `rpc.jsonl`.
4. Add overflow tests and report a clear evidence warning.
5. Rebuild generated `app/`.

Implementation Prompt:

```text
Bound Meta Skill App Server event buffering in /Users/rishi/Code/agent. Keep `rpc.jsonl` as the durable raw event log, but replace unbounded client-side event retention with a bounded buffer or per-turn collector that supports current wait/final/token extraction. If the buffer overflows, record an explicit evidence warning rather than silently losing context. Update `plugins/meta-skill/src/app-server/client.ts`, `src/app-server/runner.ts`, tests, docs, and generated `app/`. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 5. Reduce Evidence Ceremony Where It Has No Consumer

Status: simplification pass after core semantics are stable.

Context: A run writes `run.json`, multiple JSONL streams, snapshots, `thread.json`, `turns.jsonl`, `usage.json`, `rpc.jsonl`, `final.md`, report files, indexes, and sometimes empty artifact directories.

Issue: Some write paths duplicate derived summaries or compatibility fields without a real reader. This creates drift bugs and bloats the run bundle before measurement power is strong.

Surface: `eval/run.ts`, `eval/results.ts`, `project.ts`, `report.ts`, `reporting.ts`, report/index files, and skill-eval docs.

Solution Shape: Keep artifacts that answer a distinct question: run header, final output, transcript, canonical usage, raw RPC trace, tests/judges/feedback, and derived report views. Remove dead write paths and duplicate summaries.

Mini Plan:

1. Inventory every run artifact and map it to a reader/command.
2. Classify each as canonical evidence, derived view, legacy read support, or dead.
3. Remove dead write paths and duplicate summaries first.
4. Keep old-run read compatibility narrow and isolated.
5. Update docs around the smaller evidence bundle.

Implementation Prompt:

```text
Do a conservative Meta Skill evidence-surface simplification pass in /Users/rishi/Code/agent. Inventory every run artifact and every reader in `plugins/meta-skill/src`. Identify duplicate token/result/report write paths that have no real consumer. Keep only artifacts that carry audit value or feed a real command. Prefer `usage.json`, final output, transcript, raw App Server trace, run header, and append-only evidence streams; derive reports/indexes from those. Remove redundant fields with compatibility tests for older runs. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 6. Settle `src/` / `app/` And Schema Version Policy

Status: repo hygiene plus ceremony cut.

Context: TypeScript source lives under `plugins/meta-skill/src/`, while committed runtime lives under `plugins/meta-skill/app/`. Most persisted files also carry `schema_version`, and `RunReport` has already reached v2 despite the plugin being pre-1.0.

Issue: The repo pays for build-artifact drift plus migration ceremony before there are stable external consumers.

Surface: `plugins/meta-skill/package.json`, `src/`, committed `app/`, `project.ts`, `models.ts`, persisted run/report/package metadata, tests, and repo validation.

Solution Shape: Either build runtime during packaging and stop committing `app/`, or keep committed `app/` and enforce `npm run check:app` in CI. Remove schema versions from internal pre-1.0 files unless they mark a real external protocol or migration boundary.

Mini Plan:

1. Decide whether plugin packaging can build runtime from `src/` reliably.
2. If yes, remove committed `app/` and update packaging/validation.
3. If no, keep `app/` and enforce `npm run check:app`.
4. Inventory `schema_version` fields and remove internal-only versions.
5. Preserve versions only for external protocol snapshots or truly migrated persisted data.

Implementation Prompt:

```text
Decide and implement Meta Skill build/schema policy in /Users/rishi/Code/agent. If plugin packaging can build runtime during packaging, stop committing `plugins/meta-skill/app/`; otherwise keep `app/` committed and enforce `npm run check:app` in CI or the repo validation gate. Separately remove pre-1.0 per-file `schema_version` ceremony where no migration boundary exists, preserving only external or truly versioned protocol records. Update tests/docs accordingly. Run `npm test`, `npm run check:app` if `app/` remains, and `git diff --check`.
```

### 7. Parse Structured App Server Trajectories

Status: first capability that makes App Server worth it.

Context: The runner already captures raw RPC in `rpc.jsonl`, but it only scrapes `item/agentMessage/delta`, `turn/completed`, and token events. A plain model API can grade final text; it cannot prove tool use, sandbox behavior, approval behavior, or first behavioral divergence.

Issue: The Meta Skill eval tool is supposed to grade skill-guided agent behavior, but today it mostly grades final answers.

Surface: `app-server/runner.ts`, `eval/judge.ts`, `rpc.jsonl`, `turns.jsonl`, `report.ts`, live-smoke tests, and future deterministic test manifest support.

Solution Shape: Add a small typed event parser, for example `collectTurnEvents(events, threadId, turnId)`, that extracts final text, completion, token event, tool calls, command/file operations, approval requests, and sandbox-relevant events only when those event shapes are observed. Keep `rpc.jsonl` raw; write compact `trajectory.json` or `trajectory.jsonl` facts for assertions and reports.

Mini Plan:

1. Add parser tests for final text, completion, token event present/missing, wrong thread/turn ignored.
2. Add observed tool/file/command/approval event families from real or fixture App Server traces.
3. Replace scattered method-name filters in runner and judge code with the parser.
4. Persist compact trajectory facts under each scenario evidence folder.
5. Render trajectory summary only when facts exist.

Implementation Prompt:

```text
Add structured App Server trajectory parsing to Meta Skill in /Users/rishi/Code/agent. Create a small parser around observed generated App Server events that extracts final text, turn completion, token event references, and compact tool/file/command/approval facts for a specific thread and turn. Keep `rpc.jsonl` as the raw source of truth and write compact trajectory evidence only when it feeds assertions or reporting. Update runner/judge code to use the parser, add focused parser fixtures, rebuild `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 8. Add Deterministic Trajectory Assertions And First-Failure Localization

Status: depends on structured trajectory parsing.

Context: Gate, source-grounding, and failure scenarios often care less about the final text than about whether the agent read the right file, used the right tool, avoided a write, asked for approval, or stopped at the right point.

Issue: Current deterministic tests can inspect files/commands externally, but they do not have a first-class way to assert on App Server behavior.

Surface: `.meta-skill/evals/scenarios/*/criteria.json`, `.meta-skill/tests/manifest.json`, `lint.ts`, `eval/run.ts`, `report.ts`, and trajectory evidence files.

Solution Shape: Add a tiny assertion layer over trajectory facts: expected tool called, forbidden tool not called, file read occurred, command count under N, approval requested, no writes, no network, final answer present, first failed step. Report the first failed assertion beside the final answer.

Mini Plan:

1. Define a small assertion manifest shape or extend deterministic test metadata.
2. Run assertions after scenario execution using `trajectory.json`.
3. Record assertion results in `tests.jsonl` with first-failure localization.
4. Render failed trajectory assertions in `report.html`.
5. Keep judges optional and separate.

Implementation Prompt:

```text
Add deterministic trajectory assertions to Meta Skill in /Users/rishi/Code/agent. Build on structured App Server trajectory evidence and support a small assertion set: expected tool/file/command event, forbidden event, approval requested, no write, no network, max tool calls, and final answer present. Record assertion results in `tests.jsonl`, show first-failure localization in `report.html`, and keep judges separate. Update scenario docs, lint validation, tests, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 9. Add Cost / Latency / Tool-Budget Gates

Status: low-complexity measurement win.

Context: App Server events and token usage can support budgets that final-answer judging cannot: token totals, turn count, tool count, command count, and elapsed time.

Issue: Skills can become expensive or slow while still producing acceptable final answers. Without budget gates, regressions in tool behavior and latency are invisible.

Surface: `usage.json`, trajectory facts, event timestamps, deterministic tests, report budget sections, and eval docs.

Solution Shape: Add optional deterministic budget assertions such as `max_total_tokens`, `max_turns`, `max_tool_calls`, `max_commands`, and `max_elapsed_ms`. Treat them as test failures, not readiness states.

Mini Plan:

1. Confirm timestamp availability and token totals in run evidence.
2. Add budget assertion types to the trajectory assertion layer.
3. Record budget failures in `tests.jsonl`.
4. Render compact budget pass/fail rows in `report.html`.
5. Add examples to eval docs.

Implementation Prompt:

```text
Add deterministic cost, latency, and tool-budget gates to Meta Skill in /Users/rishi/Code/agent. Use canonical `usage.json`, trajectory facts, and event timestamps to support optional assertions like max total tokens, max turns, max tool calls, max commands, and max elapsed time. Record failures in `tests.jsonl` and render compact budget evidence in `report.html`. Update docs, tests, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 10. Golden-Trajectory Snapshot Tests

Status: high-value drift detector after trajectory assertions.

Context: A final answer can still look fine while behavior drifts: the agent stops reading source files, calls an extra tool, skips a gate, or takes a longer route.

Issue: Current snapshots capture payloads and final reports, not known-good agent behavior.

Surface: trajectory evidence files, snapshots under `.meta-skill/versions/`, scenario criteria, report diff rendering, and deterministic tests.

Solution Shape: Let authors bless a compact trajectory snapshot for a scenario, then compare later runs against that snapshot. Diff normalized behavior, not raw event IDs or timestamps.

Mini Plan:

1. Define a normalized trajectory snapshot format that excludes volatile IDs/timestamps.
2. Add a command or test mode to bless a snapshot from a run.
3. Compare new trajectory facts against the blessed snapshot.
4. Report additions/removals/reordered critical events.
5. Keep snapshot tests opt-in per scenario.

Implementation Prompt:

```text
Add golden-trajectory snapshot tests to Meta Skill in /Users/rishi/Code/agent. Use normalized trajectory facts, not raw RPC IDs or timestamps, to bless known-good behavior for selected scenarios and flag behavioral drift on later runs. Support opt-in scenario configuration, snapshot blessing from a run, deterministic diff output, report rendering, tests, docs, generated `app/`, and validation with `npm test`, `npm run check:app`, and `git diff --check`.
```

### 11. Behavioral Trajectory Diff Between Separate Runs

Status: report power, not a comparison mode.

Context: `--compare` and in-run sides are gone, but humans still need to inspect how two separate runs differ. App Server trajectory facts can align behavior turn-by-turn and show the first divergence.

Issue: Text diffs miss the important changes: one run read the source file and another skipped it; one called a tool; one hit a gate; one requested approval.

Surface: `report.ts`, `report.html`, run index, trajectory evidence, and an explicit report/open command that accepts two run IDs.

Solution Shape: Add a separate investigation command or report view that compares two completed run reports by trajectory facts. It must not revive sides, automated uplift, or pass/fail comparison. Label it as manual inspection.

Mini Plan:

1. Require two explicit run IDs; do not compare inside `eval run`.
2. Align scenarios by ID and turns by stable order.
3. Compute first behavioral divergence from normalized trajectory facts.
4. Render compact diffs: file/tool/command/approval/final-text deltas.
5. Keep summary language source-honest: manual behavioral diff, no verdict.

Implementation Prompt:

```text
Add a manual behavioral trajectory diff view to Meta Skill in /Users/rishi/Code/agent without reviving eval sides or `--compare`. The command should accept two explicit run IDs, read normalized trajectory facts, align scenarios/turns, and show the first behavioral divergence plus compact tool/file/command/approval deltas. Label it as manual inspection evidence, not an automated uplift or verdict. Update report code, docs, tests, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 12. Counterfactual Fork Trees

Status: App Server-native capability, gated on protocol proof.

Context: The App Server can potentially preserve thread state and fork from a decision point. That lets a run share the expensive prefix and branch only where behavior matters: a gate, ambiguity, refusal boundary, or trigger moment.

Issue: Re-running whole scenarios cannot efficiently answer "what happens if the user pushes back here?" or "does the gate hold under pressure?"

Surface: generated App Server thread/fork protocol, scenario turn definitions, trajectory evidence, report tree rendering, and run storage.

Solution Shape: Add explicit fork-point scenarios after confirming the protocol. A base thread runs to a marked turn, then child branches inject pressure prompts. Store a tree of branch trajectories with shared prefix metadata.

Mini Plan:

1. Verify exact App Server fork/resume/thread-state protocol.
2. Add a small scenario config for fork points and branch prompts.
3. Persist base prefix evidence once plus per-branch trajectory evidence.
4. Run branch trajectory assertions independently.
5. Render the decision tree and branch outcomes in `report.html`.

Implementation Prompt:

```text
Prototype counterfactual fork-tree evals in Meta Skill in /Users/rishi/Code/agent after verifying the generated App Server fork/resume protocol. Add explicit scenario config for a fork point and branch prompts, run a shared prefix once, fork N branches with different user pressures, persist per-branch trajectory evidence, and render a decision tree in `report.html`. Keep this single-source per run and do not reintroduce sides or comparison reports. Add tests/fixtures, docs, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 13. User-Simulator Branches For Follow-Up Pressure

Status: useful after fork trees.

Context: Many skill failures appear only after a user follow-up: the user asks for an unsafe shortcut, rejects a clarification, provides partial evidence, or tries to bypass a gate.

Issue: Hand-authoring every follow-up is slow, and single-turn scenarios miss interaction behavior.

Surface: fork-tree scenario config, branch prompt generation, evaluator docs, run evidence, and trajectory assertions.

Solution Shape: Add a constrained user-simulator branch generator that proposes follow-up prompts from named personas such as naive user, impatient user, adversarial user, distractor user, or missing-context user. Human-authored branches remain the default; generated branches are labeled generated pressure cases.

Mini Plan:

1. Define a small set of simulator profiles and output constraints.
2. Generate branch prompts only from scenario task/criteria, not hidden answer keys.
3. Save generated branches before execution for reviewability.
4. Run branches through the same fork/trajectory assertion path.
5. Label generated-user evidence clearly in reports.

Implementation Prompt:

```text
Add constrained user-simulator branches to Meta Skill in /Users/rishi/Code/agent after fork-tree support exists. Generate labeled follow-up pressure prompts from scenario-visible context using profiles like naive, impatient, adversarial, distractor, and missing-context user. Save generated prompts before execution, avoid criteria leakage, run them as fork branches, and report them as generated pressure evidence. Update docs, tests/fixtures, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 14. Tool Chaos / Graceful-Degradation Evals

Status: App Server-native sandbox/tool capability.

Context: Skill quality often depends on how the agent behaves when a preferred tool, MCP server, network path, or filesystem permission is unavailable.

Issue: Final-answer evals cannot distinguish graceful degradation from tool dependency collapse.

Surface: App Server tool/MCP/sandbox configuration, trajectory assertions, failure classification, report evidence, and scenario config.

Solution Shape: Add explicit tool-availability policies for a scenario: allow only selected tools, deny selected tools, disable network, or simulate tool failure if the protocol supports it. Assert that the agent asks for alternatives, reports unavailability, or uses an approved fallback.

Mini Plan:

1. Verify which tool/MCP/server controls the App Server exposes.
2. Add explicit scenario policy fields for allowed/denied capabilities.
3. Record policy in `run.json` and scenario evidence.
4. Assert on graceful degradation trajectory/final-answer facts.
5. Render policy and observed behavior in the report.

Implementation Prompt:

```text
Add tool chaos and graceful-degradation evals to Meta Skill in /Users/rishi/Code/agent after verifying App Server tool/MCP/sandbox controls. Support explicit scenario policies for allowed or denied tools/capabilities, record the policy in run evidence, and assert that the skill handles missing tools by using approved fallbacks or clearly reporting unavailability. Update trajectory assertions, failure classification, report rendering, docs, tests, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 15. Trigger Fuzzing After Native Routing Exists

Status: future only; requires non-forced skill routing.

Context: Trigger scenarios should test whether a skill fires under paraphrase, typo, indirection, or distractor noise. Today the runner force-attaches skill payloads, so trigger firing cannot be tested.

Issue: A hand-authored trigger phrasing is weak evidence, and force-attached runs are not trigger-routing proof.

Surface: native routing protocol, scenario taxonomy, prompt mutator, sampling/fork support, trajectory evidence, and reports.

Solution Shape: Once the App Server can make a skill available without force-attaching it, generate prompt mutations and sample/fork them. Record activation or non-activation evidence from the event stream.

Mini Plan:

1. Verify skill-available-but-not-attached routing protocol.
2. Restore trigger family only after activation evidence is observable.
3. Add prompt mutation strategies: paraphrase, typo, indirection, buried request, distractor.
4. Run mutations as sampled/forked cases.
5. Report trigger robustness rate with examples, not just one pass/fail.

Implementation Prompt:

```text
Add trigger fuzzing to Meta Skill in /Users/rishi/Code/agent only after the App Server exposes native skill routing evidence without force-attaching the skill. Generate prompt mutations for trigger scenarios, run them as sampled or forked cases, record activation/non-activation from trajectory evidence, and report trigger robustness with representative examples. Do not restore `T` as an executable family until routing proof is real. Update taxonomy, docs, tests, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 16. Writable Sandbox And Artifact Capture

Status: future only; requires protocol-proven writable policy.

Context: Some skills produce files. The current runner is read-only, so artifact scenarios are currently theater.

Issue: Without writable sandbox evidence, the tool cannot test whether a skill produces the right artifact, avoids writing outside the stage, or cleans up after itself.

Surface: App Server sandbox policy, stage workspace, artifact collector, trajectory assertions, report artifact listing, scenario taxonomy, and docs.

Solution Shape: Add explicit writable mode limited to the staged workspace/artifacts area. Capture generated files deterministically and assert no writes escape the allowed area.

Mini Plan:

1. Verify writable sandbox policy and file-write event shapes.
2. Add an explicit scenario/run policy for writable artifact mode.
3. Capture artifacts under a known evidence folder.
4. Add trajectory/file assertions for allowed and forbidden writes.
5. Reintroduce artifact scenario claims only after this works.

Implementation Prompt:

```text
Add writable sandbox artifact capture to Meta Skill in /Users/rishi/Code/agent only after verifying the App Server writable sandbox protocol. Support explicit writable scenarios scoped to the staged workspace/artifacts area, capture generated files deterministically, assert no writes escape the allowed area, and render artifact evidence in reports. Reintroduce artifact scenario docs only after the capability is real. Update runner, scenario config, trajectory assertions, report code, tests, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 17. Closed-Loop Eval Diagnose Fork-Verify

Status: high-wow future capability; keep human-gated.

Context: The improve lane should turn failing evidence into bounded proposed edits. App Server fork/rerun support can test whether an edit would plausibly fix the failure before a human promotes it.

Issue: Without fork-verified evidence, improvement can become vibes: a critic suggests changes, but the tool does not prove the scenario improves.

Surface: `skill-improve`, eval run evidence, failing trajectories, patch proposal storage, forked verification run, reports, and human promotion gates.

Solution Shape: On failure, spawn a critic thread that reads the failing trajectory and proposes a bounded skill edit. Apply it in a temporary payload or forked workspace, rerun the failing scenario, and present before/after evidence. Never auto-promote.

Mini Plan:

1. Define a patch proposal evidence file with cited failure references.
2. Run critic analysis in a separate no-tools or read-limited thread.
3. Apply proposed edit only to a temporary verification payload.
4. Rerun the failing scenario/fork and compare verdict/trajectory evidence.
5. Require human approval before promotion or release.

Implementation Prompt:

```text
Add a human-gated closed-loop eval diagnose fork-verify workflow to Meta Skill in /Users/rishi/Code/agent. On a failed scenario, create a critic thread that reads the failing trajectory and proposes a bounded skill edit with evidence citations. Apply the edit only to a temporary verification payload, rerun the failing scenario, and present before/after trajectory/test evidence to the human. Do not auto-promote or release. Update skill-improve docs, eval evidence storage, tests/fixtures, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 18. Answer-Only Runner As An Explicit Escape Hatch

Status: my addition; optional strategic simplification.

Context: If a scenario only grades final answer quality, the App Server is overkill. A plain model API style runner could run faster and cheaper, with massive parallelism and simple text judging.

Issue: The project should be honest about when it is grading answers versus behavior. Keeping every scenario on App Server can obscure that distinction.

Surface: eval runner selection, scenario config, docs, report labels, judge inputs, and validation.

Solution Shape: Add an explicit `answer-only` runner mode only for final-answer scenarios, or document why the project refuses it. Label its evidence clearly as text-only: no trajectory, no sandbox, no trigger proof.

Mini Plan:

1. Decide whether answer-only mode belongs in the tool or only as a design note.
2. If implemented, keep it opt-in and unavailable for gate/trajectory/artifact scenarios.
3. Persist runner mode in `run.json`.
4. Report text-only evidence limitations prominently.
5. Keep App Server as the default for behavior evals.

Implementation Prompt:

```text
Evaluate and, if accepted, add an explicit answer-only runner mode to Meta Skill in /Users/rishi/Code/agent. This mode should be opt-in, limited to final-answer scenarios, and clearly labeled as text-only evidence with no trajectory, sandbox, trigger, or artifact proof. If the team decides not to implement it, record that decision in docs and keep App Server as the behavior-eval default. Update runner selection, report labels, tests, docs, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 19. Scenario Minimality And Criteria-Leak Audit

Status: my addition; protects eval integrity.

Context: The runner already omits `criteria.json` from the solver workspace. As scenario generation, fuzzing, user simulators, and fork trees arrive, leakage and over-broad context become easier to reintroduce accidentally.

Issue: Behavior evals lose credibility if hidden criteria, judge rubrics, or answer keys leak into solver-visible prompts, branch prompts, or generated follow-ups.

Surface: `stageWorkspace`, scenario loader, generated/fuzzed branch prompts, judge inputs, report evidence, and lint.

Solution Shape: Add an audit that records exactly which files/prompts were solver-visible and checks that hidden criteria/judge material did not enter task, branch, or simulator prompts.

Mini Plan:

1. Record solver-visible files and prompts per scenario.
2. Add lint/audit checks for criteria/judge leakage.
3. Include generated branch/fuzz prompts in the audit.
4. Render a compact "criteria hidden" evidence row in reports.
5. Add regression tests around stage workspace omissions.

Implementation Prompt:

```text
Add a scenario minimality and criteria-leak audit to Meta Skill in /Users/rishi/Code/agent. Record solver-visible files and prompts for each scenario, verify hidden `criteria.json` and judge/rubric material do not leak into task, branch, simulator, or fuzz prompts, and render compact evidence in reports. Update stage workspace code, lint/audit tests, docs, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 20. Scenario Flake Ledger

Status: my addition; useful before full sampling UI.

Context: Repeated runs of the same scenario will happen manually before formal sampling ships. The run index could expose instability without adding a full flake-rate dashboard.

Issue: A single run is weak evidence, but adding n-sample machinery too early risks more ceremony. A ledger of repeated scenario outcomes is a smaller step.

Surface: run index, scenario IDs, verdict/test outcomes, token usage, trajectory summaries, and report project view.

Solution Shape: Add a read-only aggregation over historical runs: for each scenario, show recent execution failures, test/judge verdicts, token totals, and notable trajectory assertion failures. No new run mode required.

Mini Plan:

1. Read existing run reports/index entries by scenario ID.
2. Aggregate last N outcomes without changing run execution.
3. Show instability markers in project report.
4. Keep it informational, not a promotion gate.
5. Add fixtures for repeated pass/fail/no-verdict runs.

Implementation Prompt:

```text
Add a read-only scenario flake ledger to Meta Skill in /Users/rishi/Code/agent. Aggregate recent outcomes for each scenario across existing runs, including execution failures, test/judge verdicts, token totals, and trajectory assertion failures when present. Show instability markers in the project report without adding sampling mode or promotion gates. Update report/index code, tests, docs, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 21. Protocol Canary Run

Status: my addition; cheap protection for App Server drift.

Context: The tracker wants to pin App Server event shapes. A small canary can prove the currently installed App Server still emits the expected methods before a full eval run.

Issue: If protocol drift appears only inside scenario execution, users get noisy failures or "unavailable" evidence without a clear cause.

Surface: live-smoke test, CLI preflight, token parser, trajectory parser, architecture capture notes, and report warnings.

Solution Shape: Add an opt-in `meta-skill eval doctor` or preflight that starts a tiny thread and verifies required methods: `thread/start`, `turn/start`, `item/agentMessage/delta`, `turn/completed`, `thread/tokenUsage/updated` when available.

Mini Plan:

1. Define required and optional App Server methods for current eval features.
2. Add a canary command or preflight function.
3. Record observed protocol version/shape in diagnostic output.
4. Use canary failures to explain unsupported protocol warnings.
5. Keep live execution opt-in if it is slow or environment-sensitive.

Implementation Prompt:

```text
Add an App Server protocol canary to Meta Skill in /Users/rishi/Code/agent. Provide an opt-in diagnostic command or preflight that starts a tiny thread and verifies the required generated protocol methods and event shapes used by evals. Report observed token and trajectory event shapes clearly, and use canary results to explain unsupported protocol warnings. Update live-smoke tests, docs, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 22. Evidence Bundle Export For Review Threads

Status: my addition; small workflow multiplier.

Context: The user often orchestrates separate review or implementation threads. Eval evidence is currently stored as a run bundle, but handoff context is not packaged for another thread.

Issue: A review thread needs the small set of files that matter: task, final answer, trajectory, token usage, failing assertions, raw links, and hidden/non-hidden boundary notes.

Surface: report/open commands, run evidence paths, skill-improve workflow, and thread handoff docs.

Solution Shape: Add a command that emits a compact Markdown evidence brief for a run/scenario. It should cite local evidence paths, summarize execution/verdict/trajectory facts, and avoid embedding hidden criteria unless explicitly requested.

Mini Plan:

1. Define the evidence brief fields.
2. Add a command or report action for one scenario/run.
3. Pull from canonical evidence files only.
4. Include local file links and raw evidence paths.
5. Add tests with failed, no-verdict, and trajectory-rich scenarios.

Implementation Prompt:

```text
Add a compact eval evidence brief export to Meta Skill in /Users/rishi/Code/agent. For a selected run/scenario, emit Markdown that summarizes execution status, verdict evidence, final answer, token usage, trajectory highlights, failed assertions, and local evidence paths without leaking hidden criteria by default. Use canonical evidence files only. Update commands/report docs, tests, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

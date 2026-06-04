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

The App Server runner currently behaves mostly like a reliable final-answer runner: it starts one read-only/no-approval/no-network thread per scenario, force-attaches the skill payload when a skill source is used, scrapes final answer deltas, captures token telemetry when present, saves raw RPC events, and reports bounded-buffer warnings. It does not yet use the App Server surfaces that would justify the extra machinery: structured trajectory assertions, forked decision trees, tool/sandbox event checks, writable artifact capture, trigger routing, or bounded sampling.

The evidence model is still heavier than the measurement power:

- readiness still exists as `ready | blocked | unknown`; keep it source-honest and avoid rebuilding verdict-shaped review states.
- App Server protocol drift is still handled mostly by unavailable token evidence; add a clearer canary/gate before building more event-stream features.
- trigger/artifact concepts should stay future-only until the runner can prove native routing or writable outputs.
- schema versions and committed `src/` to `app/` drift still add ceremony before there are external consumers.
- bounded event retention needs a small hardening pass so overflow bookkeeping itself cannot grow without bound.
- final-answer extraction should avoid carrying forward a previous turn's final text when the current turn overflows before deltas are available.

Validation baseline from the current merged slice:

- `npm test` from `plugins/meta-skill/`
- `npm run check:app` from `plugins/meta-skill/`
- `git diff --check` from the repo root

## To Do

### 1. Collapse Scenario Classification Axes

Status: implemented in current working-tree change.

Context: Scenario metadata used to have both `family` (`R/F/T/G`) and `type` (`behavior/trigger/artifact/gate`). Trigger and artifact types were more aspirational than executable.

Issue: Authors had to choose two overlapping fields, and the runner cannot prove native trigger routing or writable artifacts anyway.

Surface: `models.ts`, `lint.ts`, scenario fixtures, eval docs, report subtitles, and generated `app/`.

Solution Shape: Keep one author-facing axis: executable scenario types. For now use `R`, `F`, and `G`; derive display text from the scenario type. Treat source-grounding as topic/criteria, not a separate type.

Mini Plan:

1. Consolidate supported type constants.
2. Remove the old `ScenarioType` meaning from required scenario metadata and lint validation.
3. Remove `T`/trigger and artifact references from CLI selection/docs until protocol-proven modes exist.
4. Update fixtures, loading, reports, and tests.
5. Preserve old-run display only if existing report reads need it.

Implementation Prompt:

```text
Collapse Meta Skill scenario taxonomy in /Users/rishi/Code/agent. Rename the executable scenario classification from `family` to `type`, remove the old `behavior/trigger/gate` type axis, and keep supported types to `R`/`F`/`G` until trigger routing is protocol-proven. Update `plugins/meta-skill/src/models.ts`, `src/lint.ts`, scenario loading, docs, fixtures, and reports. Do not add compatibility aliases unless old-run read mode requires them. Rebuild `app/`, run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 2. Harden App Server Event Buffer Overflow Handling

Status: follow-up from bounded buffer review.

Context: The client stores raw App Server events in memory and scenario code asks for `eventsSince(mark)`. This is fine for tiny runs but becomes risky once trajectory parsing, sampling, or fuzzing is added.

Issue: An unbounded event buffer makes long or noisy scenarios a memory risk and can hide missing persistence boundaries.

Surface: `app-server/client.ts`, `app-server/runner.ts`, `rpc.jsonl` persistence, live-smoke tests, and future trajectory parsing.

Solution Shape: Keep `rpc.jsonl` as the durable event log, collapse overflow warning bookkeeping to constant state, and make final-answer extraction explicitly unavailable when the current turn overflows before deltas are available.

Mini Plan:

1. Replace per-overflow warning retention with aggregate constant-space overflow state.
2. Keep warning rows in `rpc.jsonl` and evidence warnings in scenario outputs.
3. Do not preserve a previous turn's final text when the current turn overflows before final deltas are available.
4. Add overflow regression tests for both warning memory and final-answer behavior.
5. Rebuild generated `app/`.

Implementation Prompt:

```text
Harden Meta Skill App Server overflow handling in /Users/rishi/Code/agent. Keep `rpc.jsonl` as the durable raw event log and keep the bounded client-side event buffer, but collapse overflow warning bookkeeping to constant-space state. If the current turn overflows before final assistant deltas are available, write an explicit unavailable final/evidence warning instead of carrying forward a previous turn's final text. Update `plugins/meta-skill/src/app-server/client.ts`, `src/app-server/runner.ts`, tests, docs, and generated `app/`. Run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 3. Settle `src/` / `app/` And Schema Version Policy

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

### 4. Parse Structured App Server Trajectories

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

### 5. Add Deterministic Trajectory Assertions And First-Failure Localization

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

### 6. Add Cost / Latency / Tool-Budget Gates

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

### 7. Golden-Trajectory Snapshot Tests

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

### 8. Behavioral Trajectory Diff Between Separate Runs

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

### 9. Counterfactual Fork Trees

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

### 10. User-Simulator Branches For Follow-Up Pressure

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

### 11. Tool Chaos / Graceful-Degradation Evals

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

### 12. Trigger Fuzzing After Native Routing Exists

Status: future only; requires non-forced skill routing.

Context: Trigger scenarios should test whether a skill fires under paraphrase, typo, indirection, or distractor noise. Today the runner force-attaches skill payloads, so trigger firing cannot be tested.

Issue: A hand-authored trigger phrasing is weak evidence, and force-attached runs are not trigger-routing proof.

Surface: native routing protocol, scenario taxonomy, prompt mutator, sampling/fork support, trajectory evidence, and reports.

Solution Shape: Once the App Server can make a skill available without force-attaching it, generate prompt mutations and sample/fork them. Record activation or non-activation evidence from the event stream.

Mini Plan:

1. Verify skill-available-but-not-attached routing protocol.
2. Restore trigger type `T` only after activation evidence is observable.
3. Add prompt mutation strategies: paraphrase, typo, indirection, buried request, distractor.
4. Run mutations as sampled/forked cases.
5. Report trigger robustness rate with examples, not just one pass/fail.

Implementation Prompt:

```text
Add trigger fuzzing to Meta Skill in /Users/rishi/Code/agent only after the App Server exposes native skill routing evidence without force-attaching the skill. Restore trigger type `T` at that point, generate prompt mutations for trigger scenarios, run them as sampled or forked cases, record activation/non-activation from trajectory evidence, and report trigger robustness with representative examples. Do not restore `T` as an executable type until routing proof is real. Update taxonomy, docs, tests, generated `app/`, and run `npm test`, `npm run check:app`, and `git diff --check`.
```

### 13. Writable Sandbox And Artifact Capture

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

### 14. Closed-Loop Eval Diagnose Fork-Verify

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

### 15. Answer-Only Runner As An Explicit Escape Hatch

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

### 16. Scenario Minimality And Criteria-Leak Audit

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

### 17. Scenario Flake Ledger

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

### 18. Protocol Canary Run

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

### 19. Evidence Bundle Export For Review Threads

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

## Completed Items

- PR #20 / `6b4086da`: Removed forward-facing eval sides so each run evaluates one source at a time and no-skill runs stay manual control evidence.
- PR #21 / `03bc2b4d`: Split execution status from verdict evidence so successful execution no longer implies pass/fail.
- PR #22 / `5911f432`: Made scenario `usage.json` the canonical token evidence and removed duplicate token summaries from result streams.
- `f03a2307`: Removed the remaining eval comparison surface without reviving in-run sides or automated uplift language.
- `ec8485b7`: Removed the dead `eval generate` command path and its docs/tests.
- `57c4ebe0`: Simplified App Server retry/crash recovery by deleting backoff policy and moving recovery to one explicit orchestration retry.
- `9e36774d`: Bounded client-side App Server event retention while keeping `rpc.jsonl` as the durable raw trace.
- `888cda97`: Simplified the evidence bundle by removing duplicate transcript token fields and dead artifact report output.

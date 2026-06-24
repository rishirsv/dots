# Eve Evals Compared To Meta-Skill

Date: 2026-06-23

## Scope And Source Coverage

This report compares Eve's eval implementation and design to the local Meta-Skill eval system in `plugins/meta-skill`. It is organized around every heading in Eve's eval docs, with extra context from the linked Eve pages that materially explain the eval design.

Eve sources read:

- [Overview](https://eve.dev/docs/evals/overview.md)
- [Cases](https://eve.dev/docs/evals/cases.md)
- [Assertions](https://eve.dev/docs/evals/assertions.md)
- [Judge](https://eve.dev/docs/evals/judge.md)
- [Targets](https://eve.dev/docs/evals/targets.md)
- [Reporters](https://eve.dev/docs/evals/reporters.md)
- [Running Evals](https://eve.dev/docs/evals/running.md)
- Referenced context pages: [Tools](https://eve.dev/docs/tools.md), [TypeScript SDK Overview](https://eve.dev/docs/guides/client/overview.md), [Messages](https://eve.dev/docs/guides/client/messages.md), [CLI](https://eve.dev/docs/reference/cli.md), [Schedules](https://eve.dev/docs/schedules.md), [eve channel](https://eve.dev/docs/channels/eve.md), [Sessions, Runs & Streaming](https://eve.dev/docs/concepts/sessions-runs-and-streaming.md), [Human-in-the-loop](https://eve.dev/docs/human-in-the-loop.md), [Skills](https://eve.dev/docs/skills.md), [Output Schema](https://eve.dev/docs/guides/client/output-schema.md), [The Harness](https://eve.dev/docs/concepts/default-harness.md), [Sandbox](https://eve.dev/docs/sandbox.md), [sitemap](https://eve.dev/sitemap.md), [agents.md](https://eve.dev/agents.md).

Meta-Skill sources read:

- `plugins/meta-skill/skills/skill-evaluator/SKILL.md`
- `plugins/meta-skill/skills/skill-evaluator/references/methodology.md`
- `plugins/meta-skill/skills/skill-evaluator/references/evaluations.md`
- `plugins/meta-skill/skills/skill-evaluator/references/eval-types.md`
- `plugins/meta-skill/skills/skill-evaluator/references/validations.md`
- `plugins/meta-skill/skills/skill-evaluator/references/calibration.md`
- `plugins/meta-skill/skills/skill-evaluator/references/judge-alignment.md`
- `plugins/meta-skill/references/cli.md`
- Runtime implementation: `manifest.py`, `runner.py`, `staging.py`, `grading.py`, `report.py`, `cli.py`.

## Executive Comparison

Eve evals are app-native end-to-end tests. You write TypeScript files under `evals/`, drive a real Eve agent over the same HTTP/session protocol users hit, and assert inline with a test context named `t`. The dominant mental model is: "run the real app, record checks, fail CI when gates fail."

Meta-Skill evals are hidden-workbench experiments for comparing agent-skill candidates. You write or materialize `.<skill-name>/evals.json` and task folders, stage visible task files into isolated trial workspaces, run each task against candidates such as `no-skill`, `current`, and a candidate skill, then grade outcomes with code/model/human graders. The dominant mental model is: "keep the task stable, vary the skill payload, collect evidence about whether the skill changes behavior."

The product difference is sharp:

| Area | Eve | Meta-Skill |
|---|---|---|
| Unit of authoring | `.eval.ts` file with `defineEval({ async test(t) { ... } })` | `evals.json` plus `cases/<task-id>/task.md`, hidden `judge.md`, `expected.*`, `validate.*` |
| Identity | File path and directory path | Manifest IDs: `candidate`, `case id`, `trial_id` |
| Target | Live Eve HTTP app URL, local or remote | Codex App Server runner over staged skill/task workspaces |
| Main comparison | Usually one app target per eval run | Candidate comparison is central: no-skill/current/candidate |
| Assertions | Inline run/value/judge assertions on `t` | Post-run graders over captured responses, events, expected files, and hidden guidance |
| Hidden boundary | Eval code is outside the agent app; assertions run after/around the session | Explicit hidden workbench boundary; only `task.md`, listed fixtures, and candidate payload are staged |
| CI posture | First-class: `eve eval --strict --junit ...`, concurrent by default | CLI exists, but local runner is sequential and more research/workbench-oriented |
| Reporting | Console, artifacts, JUnit, Braintrust/custom reporters | Markdown/JSON reports, state rows, comparisons, human queues, calibration artifacts, benchmark profiles |

The most important design lesson from Eve is not "copy TypeScript evals." It is that Eve makes the authoring loop feel like the app's native test framework: path identity, inline driver/assertion API, built-in gates, local/remote target parity, concurrency, artifacts, and CI flags. Meta-Skill has a richer experimental model for candidate comparison and hidden grading, but its user experience is more split across manifests, materialization, run/grade/report commands, and docs that need to be cross-read with runtime code.

## Eve Evals Overview

### Overview

Eve defines an eval as a scored check that runs an agent against real sessions and grades the result. The key point is "real sessions": the eval runner does not call a fake unit under test. It boots or targets an actual Eve agent server, drives the same TypeScript client protocol used by users and integrations, and records whether the agent booted, accepted requests, called tools, parked for HITL, and replied as expected.

Compared to Meta-Skill, Eve starts lower in the application stack and higher in operational confidence. Eve can say, "the deployment endpoint behaved this way." Meta-Skill says, "this candidate skill payload changed this task outcome under this runner." Meta-Skill is more suited to skill design evidence. Eve is more suited to application regression and CI smoke tests.

### `defineEval`

Eve discovers eval files under the app-root `evals/` directory. Files ending in `.eval.ts` are evals. A single file is one eval by default, and directories group evals. The file path is the eval identity, so `evals/weather/brooklyn-forecast.eval.ts` becomes `weather/brooklyn-forecast`. Authors do not write a separate `id` or `name`.

Each eval is a single `async test(t)` function. The same `t` object both drives the agent and records assertions:

```ts
await t.send("What is the weather in Brooklyn?");
t.completed();
t.calledTool("get_weather");
t.check(t.reply, includes("Sunny"));
```

The optional fields on `defineEval` are `description`, `judge`, `tags`, `metadata`, `timeoutMs`, and `reporters`.

Meta-Skill takes the opposite authoring route. Identity is explicit in JSON. A suite has `candidates[]` and `cases[]` or writer-facing `evals[]` that normalize into `cases[]`. Tasks materialize into `.<skill-name>/cases/<task-id>/task.md`. Trial IDs are generated as `<case>.<candidate>.t<index>`.

Design implication: Eve's path-derived identity removes schema friction. Meta-Skill's manifest gives stronger experiment metadata, but it has more ways to drift. In the current checkout, `evaluations.md` still shows a writer-facing candidate example with `id` and `label`, while `manifest.py` expects candidate rows with `candidate` and `display`. That is a real docs/runtime mismatch. Eve's identity model avoids this specific class of candidate-ID schema error.

### `evals.config.ts`

Eve requires exactly one `evals.config.ts` at the root of each `evals/` directory. It declares shared defaults:

- `judge`: default LLM judge model for `t.judge.*`.
- `reporters`: destinations such as Braintrust.
- `maxConcurrency`: run-level concurrency default.
- `timeoutMs`: default timeout.

Per-eval settings and CLI flags override config defaults. Reporters in config observe every eval in the run, so shared destinations live once.

Meta-Skill's shared defaults live in `evals.json` under `defaults`, for example runner and repetitions. Its "config" is not a separate TypeScript module; it is part of the suite manifest. That keeps evaluation metadata portable and inspectable, but it lacks Eve's ability to use normal TypeScript imports, shared helper code, and programmatic reporter instances.

### The `t` Context

Eve's `t` is the eval authoring API. It combines:

- Driver methods: `t.send`, `t.respond`, `t.respondAll`, `t.sendFile`, `t.expectInputRequests`, `t.newSession`.
- State access: `t.reply`, `t.sessionId`, `t.events`, `t.target`.
- Assertion methods: run-level assertions, `t.check(...)`, and `t.judge.*`.

There are no separate `input`, `run`, `checks`, or `scores` structures. The eval is normal TypeScript control flow.

Meta-Skill separates the same concerns into files and phases:

- Driving is handled by `runner.py` through `app_server_run`.
- Inputs are in `task.md` and listed fixtures.
- State and events are captured under `runs/<run-id>/events`, `evidence`, `results.jsonl`, and candidate response folders.
- Grading happens later through `eval grade`.

Eve optimizes for author convenience and test readability. Meta-Skill optimizes for hidden-boundary discipline, candidate comparison, and durable evidence.

### Three Assertion Surfaces

Eve has three assertion surfaces:

1. Run-level methods such as `t.completed()`, `t.calledTool(...)`, `t.usedNoTools()`, and `t.toolOrder(...)`.
2. `t.check(value, assertion)` for deterministic checks on explicit values.
3. `t.judge.autoevals.*` for LLM-as-judge assertions.

Meta-Skill has roughly parallel surfaces, but they are post-run graders:

1. Code validators such as `validate.py` or `validate.sh` inspect output, events, or expected files.
2. Model judges read hidden `judge.md` or `expectations[]`.
3. Human graders create pending `unknown` rows until a reviewer records a label.

The behavioral difference is timing. Eve records assertions inline during the test function and the runner computes verdicts from all recorded results. Meta-Skill captures the run first, then grades it afterward. Eve's shape is simpler for app tests. Meta-Skill's shape is better for rereading the same trial evidence with revised graders or human labels.

### Gate Vs Soft

Eve attaches severity to each assertion handle:

- Gates are hard failures and make `eve eval` exit non-zero.
- Soft assertions are tracked data. Below-threshold soft assertions produce a visible `scored` state and only fail under `--strict`.
- `.gate(threshold?)`, `.soft(threshold?)`, and `.atLeast(threshold)` override severity per assertion.

Defaults are practical: run-level assertions and exact matchers gate by default; similarity and judge assertions are soft by default.

Meta-Skill has a similar concept through explicit grader metadata. `required` or `gate` on a grader means it is blocking. `report.py` surfaces `gate_failed` and derives pass/fail/unknown state rows. Meta-Skill labels are `pass`, `partial`, `fail`, and `unknown`, with numeric score optional.

Eve's ergonomics are stronger here because severity is local to the assertion line. Meta-Skill's explicit gate metadata is more reportable and durable, but it is more verbose and easier to misplace.

### Run Evals With `eve eval`

Eve's basic run commands are:

- `eve eval`: run all evals against a local dev server.
- `eve eval weather`: run one eval or a directory group.
- `eve eval --url https://<app>`: run the same evals against a remote deployment.

The CLI starts or targets a server, discovers eval files, runs them, and exits `0` when all gates pass.

Meta-Skill's equivalent flow is multi-command:

- `metaskill eval lint --suite ...`
- `metaskill eval materialize --suite ...`
- `metaskill eval run --suite ...`
- `metaskill eval progress --run ...`
- `metaskill eval grade --run ...`
- `metaskill eval report --run ...`

That separation is useful for a workbench process where materialization, run, grading, human review, calibration, and reporting are different acts. It is less convenient than Eve for a quick CI loop.

### A Good Baseline

Eve recommends starting with small smoke evals: `t.completed()` plus one or two content checks. Dataset fixtures can live under `evals/data/`. Judges and Braintrust are optional, not the starting point. In CI, Eve recommends `eve eval --strict` so soft threshold misses fail the build.

Meta-Skill's methodology says something similar in spirit but different in shape: start from real failures, manual review notes, common workflows, or release checks; create 2-3 realistic tasks for a local loop; only scale to 20-50 tasks when the target is mature. It also says "not worth a suite yet" is a valid outcome.

The design contrast: Eve's minimum viable eval is one TypeScript file. Meta-Skill's minimum viable durable eval requires at least a manifest and a task folder or materialization step. Meta-Skill's threshold for "suite" is intentionally higher.

### What To Read Next

Eve points readers to Cases, Assertions, Judge, Targets, Reporters, Running Evals, and Tools. That tells you Eve thinks evals are a complete product surface, not a footnote under testing. The linked pages fill in the full lifecycle: author cases, assert behavior, judge fuzzy output, choose local/remote target, export results, and run in CI.

Meta-Skill's `Reference Map` plays the same role, but it routes by evaluator decision: methodology, eval types, trigger tuning, evaluations, judge alignment, calibration, human grading, validations, examples, generalist targets, thread improvement, and CLI.

Eve's map is implementation-surface oriented. Meta-Skill's map is decision-methodology oriented.

## Eve Cases

### Cases

Eve's "case" is the executable eval file or an array element exported from one file. Every case has the same shape: `async test(t)` drives the agent and records assertions. The runner executes the test against the target, captures every event, and computes a verdict.

Meta-Skill uses "case" as a file-layout term for a task folder. The user-facing term in docs is "task", but the runtime still uses `cases[]` and `cases/<task-id>/`. Eve's terminology is cleaner because one eval case and one test function are the same thing.

### Single-Turn Evals

Single-turn Eve evals call `await t.send(...)`, then assert on completion, tool calls, or reply text. Some evals only care about behavior and skip reply checks, such as greeting prompts that must not call the weather tool.

In Meta-Skill, a single-turn task is a `task.md` prompt plus a candidate run. Reply and behavior checks live in validators or judges. Eve makes a single-turn smoke test tiny. Meta-Skill makes the same smoke test durable and comparable across candidates, but heavier.

### Organizing With Directories

Eve directories are grouping and selection. Because identity is the path, `evals/weather/...` groups weather evals, and `eve eval weather` selects the group. Shared helpers go in sibling non-eval files that do not end in `.eval.ts`.

Meta-Skill organizes by suite and hidden workbench. Multiple task groups can be represented through `type`, `split`, or separate suites/benchmarks. Selection is by `--split`, `--candidates`, benchmark profile, or manifest filtering. Eve's directory grouping is easier for developers. Meta-Skill's manifest grouping is better for reports and decision labels.

### Multi-Turn Evals

Eve supports multi-turn interactions in normal async code. You can capture an intermediate draft, grade it before the next turn overwrites `t.reply`, then continue. You can throw an error for custom preconditions. A thrown error marks the eval failed with that message.

This is a major Eve advantage. Multi-turn agent behavior is inherently conversational, and Eve's API lets the eval script look like the conversation it is testing.

Meta-Skill can run conversational tasks through the App Server and inspect transcripts, but the authoring surface is not naturally multi-turn. `task.md` is the visible task prompt. Process checks are post-hoc transcript validators or model judges. That is enough for many skill evals, but less direct for scripted HITL or branching scenarios.

### The Drive API

Eve's drive API covers:

- `t.send(input)`: sends a turn and waits for it to settle.
- `t.sendFile(...)`: attaches local files as data URLs.
- `t.expectInputRequests(...)`: asserts the previous turn parked on HITL input and returns pending requests.
- `t.respond(...)` and `t.respondAll(...)`: answer HITL input requests.
- `t.newSession()`: create independent sessions against the same target.
- `t.log(...)`: write debug lines to artifacts and optionally stdout.
- `t.signal`: abort signal fired on timeout.

This matters because Eve evals can test the framework's durable pause/resume protocol directly. The referenced HITL docs explain that approvals and questions both emit `input.requested`, park at `session.waiting`, and resume with `inputResponses` or a follow-up message.

Meta-Skill captures similar evidence through event streams, but it does not provide a first-class conversational scripting API in the suite authoring model. Its App Server runner records events and responses; validators or judges decide whether the process behaved correctly.

### Datasets: Exporting An Array

Eve lets one `.eval.ts` file default-export an array of `defineEval(...)` values. Eval IDs derive from the file plus zero-padded array index. ESM top-level `await` can load YAML or JSON fixtures with `loadJson` or `loadYaml`.

Meta-Skill dataset fan-out is naturally manifest-driven: multiple `evals[]` or `cases[]` rows become multiple tasks. This is a place where Meta-Skill is conceptually strong. It already treats a suite as a task bank. Eve's TypeScript array model is easier to generate and maintain with code, while Meta-Skill's JSON model is easier to inspect, diff, and process by agents.

### Cases: What To Read Next

Eve links from Cases to Assertions, Judge, and TypeScript client messages. That tells you cases are not just static prompts; they are scripts over the same `ClientSession.send()` protocol used by applications. The client message docs clarify that `send()` returns metadata immediately and `result()` consumes the stream into status, message, events, session ID, and structured data.

Meta-Skill has no comparable public client protocol because its runner is local to the workbench and App Server adapter. That is simpler for a local skill tool, but less reusable as a framework testing API.

## Eve Assertions

### Assertions

Eve assertions record results onto `t`; the runner reads all recorded results and reports every failing assertion rather than dying on the first failure. There are deterministic run-level assertions, deterministic value assertions, and model-graded assertions under Judge.

Meta-Skill also avoids first-failure blindness, but by a different route. It writes grade rows for every grader and then builds trial summaries, gate failures, unknown evidence, and comparisons. Eve's model is test-runner style. Meta-Skill's model is evidence-ledger style.

### Run-Level Assertions

Eve run-level assertions read the whole run. They include:

- Completion/failure/parking: `t.completed()`, `t.didNotFail()`, `t.waiting()`.
- Message/output: `t.messageIncludes(...)`, `t.outputEquals(...)`, `t.outputMatches(...)`.
- Tools: `t.calledTool(...)`, `t.notCalledTool(...)`, `t.toolOrder(...)`, `t.usedNoTools()`, `t.maxToolCalls(...)`, `t.noFailedActions()`.
- Skills/subagents/events: `t.loadedSkill(...)`, `t.calledSubagent(...)`, `t.event(predicate, label)`.

Several assertions depend on facts derived from the event stream: tool calls, subagent calls, HITL input requests, and parked state.

Meta-Skill can check the same classes of behavior through transcript validators and model judges. For example, a `validate.py` can inspect `events/<trial-id>.jsonl` to confirm a required tool call happened or that validation ran before the final answer. But those checks are not built into the authoring context as a fluent API.

### Value Assertions With `t.check`

Eve's `t.check(value, assertion)` applies deterministic builders from `eve/evals/expect`:

- `includes(substring)`
- `equals(value)`
- `matches(schema)`
- `similarity(expected)`

This is a pragmatic middle layer between exact run-level facts and LLM judging. It lets authors check explicit values, including `t.reply`, intermediate turn messages, parsed JSON, or anything local code computes.

Meta-Skill's nearest equivalent is task-local validators. Validators are more powerful because they can be arbitrary scripts, but they require file authoring, CLI invocation, JSON output shape, and post-run grading. Eve's `t.check` is much faster to write.

### The Matcher Mini-Language

Eve's `t.calledTool` and `t.calledSubagent` accept matcher objects. Tool matchers can check `input`, `output`, `isError`, and `times`; subagent matchers can check `remoteUrl` and `output`. Fields can be literals, regexes, or functions.

This is an important product detail. It turns common event-stream checks into small declarative assertions, without making users parse raw event JSON.

Meta-Skill currently expects authors to write transcript validators for this class of check. That is more general but less discoverable. A direct opportunity for Meta-Skill is to add shared validator helpers or manifest-level transcript assertions for common cases: required tool, forbidden tool, max tool calls, loaded skill, subagent called, completed vs waiting.

### Run State And Derived Facts

Eve derives typed facts from the event stream so assertions do not need to understand raw event formats. The docs distinguish a normal open session from a parked HITL state, and point to `t.event(predicate, label)` as the escape hatch.

The referenced Eve session docs list the underlying event stream: `turn.started`, `actions.requested`, `action.result`, `input.requested`, `subagent.called`, `message.completed`, `result.completed`, `turn.failed`, `session.waiting`, and more. Eve's assertion API is essentially a friendly projection over that event model.

Meta-Skill records event streams and compact evidence, but its projections are primarily report-level: runner status, judge labels, validator counts, gate failures, unknown evidence. It has less built-in typed event assertion vocabulary.

### Severity

Eve's severity rules are local and chainable:

- `.gate(threshold?)`: hard failure.
- `.soft(threshold?)`: tracked, fatal only under strict mode when below threshold.
- `.atLeast(threshold)`: soft threshold.

Meta-Skill's severity lives in grader declarations and report derivation. A gate failure records a failed state even if other judge scores are high. It also treats `unknown` as a first-class state, which Eve handles more through skipped/scored/failed verdicts and artifacts.

Meta-Skill's `unknown` discipline is stronger for research and judge calibration. Eve's chainable severity is stronger for day-to-day test authoring.

### Assertions: What To Read Next

Eve directs readers to Judge, Cases, and Running Evals. The implied lifecycle is: write cases, assert behavior, then map verdicts to CLI outcomes. Meta-Skill directs users to eval types, validations, calibration, and methodology because it expects the user to choose evidence quality before trusting results.

## Eve Judge

### Judge

Eve's judge page says to use an LLM judge only when deterministic assertions cannot capture "good", such as factual correctness, summary quality, or free-form criteria. Judge assertions live under `t.judge.*`, use a judge model resolved separately from the agent under test, and never swap out the agent itself.

Meta-Skill makes the same separation: model judges are graders over trial outcomes. The target candidate is the agent-harness setup; the judge is separate. Meta-Skill is more explicit about human calibration before trusting model judges for acceptance decisions.

### The Graders

Eve exposes Braintrust autoeval graders under `t.judge.autoevals`:

- `factuality(expected)`
- `summarizes(expected)`
- `closedQA(criteria)`
- `sql(expected)`

They grade `t.reply` by default, but the `on` option can point them at an intermediate draft or parsed value. The grader family semantics come from Braintrust autoevals, not custom Eve rubrics.

Meta-Skill model judges use `judge.md` and/or generated expectation guidance. This is less turnkey than Eve's Braintrust autoeval names, but more customizable. A Meta-Skill task can define exact pass/partial/fail/unknown rubrics tied to the skill's guarantees.

### Soft Scoring And Thresholds

Eve judge assertions are soft by default. No threshold means tracked only. `.atLeast(...)` creates a soft threshold that fails under `--strict`. `.gate(...)` turns the judge into a hard gate.

Meta-Skill model judge rows have `score`, `label`, `checks`, `rationale`, and optional `gate`. Meta-Skill's label scale is more qualitative and audit-friendly. Eve's judge thresholds are more CI-friendly.

### Configuring The Judge Model

Eve resolves the judge model innermost-wins:

1. Per-call judge override.
2. Per-eval `judge`.
3. Project default in `evals.config.ts`.

String model IDs route through Vercel AI Gateway and need `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN`. Direct AI SDK `LanguageModel` instances can also be supplied. If a judge model is configured but credentials are missing, judge-backed evals skip visibly rather than failing spuriously. If no judge model is resolved for a `t.judge.*` assertion, the eval records a failed gate.

Meta-Skill's `eval run --model` affects the App Server trial model, while `grade_run` currently calls `model_judge_grade` without a CLI-exposed judge model option in the grade command path. The docs discuss judge alignment and model grading extensively, but the CLI separation means model choice is not as ergonomically scoped as Eve's per-call/per-eval/config hierarchy.

### Judge: What To Read Next

Eve points to Assertions, Reporters, and Targets. Its judge story is integrated with metrics export and local/remote targets. Meta-Skill points to calibration and judge alignment because its judge story is about trustworthiness before decision-making.

## Eve Targets

### Targets

Eve targets are always HTTP URLs. `eve eval` starts a local dev server, and `eve eval --url <url>` targets an existing server or deployment. The same eval files work for both. The runner polls `/eve/v1/health`, verifies `/eve/v1/info`, and exposes the live target as `t.target`.

Meta-Skill has one supported eval runner: `codex_app_server`. It does not target arbitrary deployed applications. It stages trial workspaces and runs agent tasks through the App Server SDK. That makes sense because its target is a skill payload, not an Eve app deployment.

Eve has better environment parity for application tests. Meta-Skill has better candidate-payload control.

### Target Helpers

Eve's `t.target` supports:

- `fetch(path, init)` for authenticated requests against the target.
- `dispatchSchedule(id)` for dev-only schedule dispatch.
- `attachSession(sessionId, { startIndex? })` to consume events from a session created outside the eval.

This lets evals cover channel/webhook ingress, scheduled agents, and externally created sessions. The referenced Schedules page explains that dev dispatch triggers a schedule once and returns session IDs. The session docs explain that streams are replayable with `startIndex`.

Meta-Skill does not have comparable target helpers because it is not testing a deployed app's public surface. It can evaluate transcript behavior and candidate outputs, but not schedule/channel ingress as first-class targets.

### Authentication

Eve's remote auth is Vercel-aware. For `--url`, it resolves expected owner/project from `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` or `.vercel/project.json`, sends credentials only when project IDs match, and supports `EVE_EVAL_AUTH_TOKEN` as an explicit bearer override. Credential-bearing clients do not follow redirects.

Meta-Skill's runner policy is local App Server with sandbox/approval settings. It is not a remote auth client. Security is mostly about hidden staging boundaries and App Server sandbox policy, not deployment auth.

### Targets: What To Read Next

Eve points to Running Evals, Schedules, and Channels. This reinforces that Eve evals can exercise the agent as a deployed service. Meta-Skill's adjacent reading is more likely App Server evidence and workbench docs.

## Eve Reporters

### Reporters

Eve runs and grades everything itself. Reporters only ship results elsewhere. The console prints a summary by default. Reporters add destinations such as Braintrust or JUnit XML. The docs explicitly put data-export approval on the user.

Meta-Skill's reporting is local-first: `eval report` renders Markdown/JSON from run files; benchmark reports and history are local workbench artifacts. It does not currently treat third-party observability export as a core path.

### Braintrust

Eve's `Braintrust(...)` reporter uploads eval results to Braintrust experiments. It can be configured once in `evals.config.ts` or scoped to individual evals. It supports project/experiment names, base experiments for diffs, metadata export, and gate assertion scores under a `gate:` prefix. `--skip-report` suppresses reporter uploads.

Meta-Skill has no Braintrust integration. Its comparable function is local candidate comparison plus benchmark history. That is more private and repo-owned, but less useful for teams that already review eval experiments in Braintrust.

### JUnit

Eve's JUnit reporter writes CI annotations. The docs recommend the CLI flag `--junit <path>` rather than authoring JUnit reporters in eval files because CI owns the output path.

Meta-Skill currently renders reports but does not expose JUnit. This is a gap if Meta-Skill evals are meant to become merge gates. Its state rows and gate failures could map naturally to JUnit test cases by trial or case/candidate.

### Custom Reporters

Eve custom reporters implement `onRunStart`, `onEvalComplete`, and `onRunComplete`. The interface receives structured results. The docs advise using custom reporters only when built-ins do not cover the destination, because `.eve/evals/` artifacts already capture everything for ad hoc inspection.

Meta-Skill has a Python report renderer rather than a reporter plugin interface. That fits a local CLI today. If Meta-Skill wants integrations, Eve's lifecycle interface is the cleaner extension point: start, per-trial or per-eval completion, run completion.

### Reporters: What To Read Next

Eve links to Running Evals and Judge. Reporters are positioned as downstream of the runner and judge. Meta-Skill similarly treats reports as downstream of run and grade, but keeps them in the workbench.

## Eve Running Evals

### Running Evals

`eve eval` discovers `.eval.ts` files, boots a local dev server or targets a remote one, runs evals concurrently, and prints a per-eval summary. Important flags:

- Selection: positional IDs, directory prefixes, `--tag`.
- Targeting: `--url`.
- CI/severity: `--strict`, `--junit`.
- Runtime: `--timeout`, `--max-concurrency`.
- Inspection: `--list`, `--verbose`, `--json`.
- Export control: `--skip-report`.

Meta-Skill's run command is narrower: `eval run` selects suite, runner, candidates, split, repetitions, model, and JSON. `progress`, `grade`, and `report` are separate. It is sequential today: `runner.py` plans trials, queues them, then iterates each row in order.

Eve is built for fast feedback. Meta-Skill is built for auditable evidence.

### Exit Codes

Eve exit codes are simple:

- `0`: every eval passed its gates, plus soft thresholds under `--strict`.
- `1`: any eval failed through gate, execution error, or strict threshold miss.
- `2`: configuration error.

Meta-Skill commands also return non-zero on CLI/runtime errors, and `eval run` returns `ok: false` when trials fail. But because grading/reporting are separate, the final "should this gate CI?" answer is not a single command by default unless a workflow wraps run, grade, and report interpretation.

### Artifacts

Eve writes run artifacts under `.eve/evals/<timestamp>/`: `summary.json`, `results.jsonl`, per-eval assertion results, verdicts, event streams, and `t.log` lines.

Meta-Skill writes under `.<skill-name>/runs/<run-id>/`: `run.json`, `progress.jsonl`, `events`, `evidence`, `results.jsonl`, `grades.jsonl`, and candidate response paths. It also writes workspaces and calibration artifacts.

Both systems preserve event evidence. Eve's `.eve/evals` is generated output for the application. Meta-Skill's runs live inside the target skill workbench, beside authored suite content.

### CI

Eve recommends:

```bash
eve eval --strict --junit .eve/junit.xml
```

and, for deployed apps:

```bash
eve eval --strict --url "$DEPLOY_URL" --junit .eve/junit.xml
```

The CI environment must provide model provider credentials. The full artifact directory should be uploaded on failure.

Meta-Skill has the ingredients for CI but not the same crisp path. A comparable strict CI mode would need to run lint, materialize, run, grade, and then fail if any runner failures, gate failures, unknown required evidence, or calibration gates appear. Today that logic is distributed across commands and reports.

### Running Evals: What To Read Next

Eve points to Targets, Reporters, and CLI reference. The CLI reference repeats the eval flags and reinforces that evals are first-class in the `eve` command surface. Meta-Skill's CLI reference similarly centralizes its commands, but it covers many more workbench operations beyond evals.

## Referenced Eve Context That Matters

### Tools

Most Eve evals assert on tools, so the Tools page matters. Eve tools are typed actions under `agent/tools/`, named by filename, with description, input schema, and execute function. Tools run in the app runtime with `process.env`, not in the sandbox. Sensitive tools can be gated with `needsApproval`. Tool outputs can be shaped for the model with `toModelOutput`.

Compared to Meta-Skill, this explains why Eve can offer `t.calledTool(...)` as a first-class assertion. The framework owns a typed tool event model. Meta-Skill can only assert tool use from whatever the App Server transcript records.

### TypeScript SDK, Messages, Eve Channel, And Sessions

Eve evals build on the same `eve/client` session protocol as scripts and frontends. The default Eve channel exposes `/eve/v1/session`, `/eve/v1/session/:sessionId`, and `/eve/v1/session/:sessionId/stream`. Streams are NDJSON event streams. The client wraps session creation, continuation tokens, and stream aggregation.

This is central to Eve's design: evals are not a special private runner path. They exercise the public session API.

Meta-Skill's App Server adapter is a special runner path for local skill evaluation. That gives Meta-Skill tighter control over candidate staging, but less confidence about arbitrary production surfaces.

### Human-In-The-Loop

Eve's HITL model has approvals and questions sharing one pause/resume protocol. Eval cases can call `t.expectInputRequests(...)`, `t.respond(...)`, and `t.respondAll(...)` to test that protocol. This makes approval flows testable without manual interaction.

Meta-Skill can grade whether a skill respected an approval boundary, but it does not have a fluent HITL simulation API.

### Skills And Harness

Eve skills are load-on-demand procedures under `agent/skills/`. The model sees descriptions and can call `load_skill`. Built-in harness tools include `load_skill`, `ask_question`, tool/file/shell helpers, subagent delegation, and connection search.

This matters for evals because Eve has `t.loadedSkill(...)` and can assert on skill activation as a runtime fact. Meta-Skill is itself about authoring/evaluating skills. It treats skill activation and trigger tuning as eval types, but through tasks and transcript graders rather than native Eve-style assertion methods.

### Sandbox

Eve's sandbox is the agent's isolated bash/filesystem environment. Built-in shell/file tools run there, authored tools run in the app runtime, and network policy can be configured. Eval targets exercise this real environment.

Meta-Skill creates its own staged workspaces under the hidden workbench and relies on App Server sandbox policy. Its hidden boundary is more explicit: `stage_workspace` writes only visible `task.md`, listed fixtures, and the candidate payload into the trial workspace. Hidden grader files stay outside.

## Meta-Skill Runtime Summary

The current Meta-Skill implementation works like this:

1. `eval lint` checks suite shape.
2. `eval materialize` turns writer-facing eval rows into `cases/<task-id>/task.md` and companion files.
3. `eval run` loads the manifest, selects cases/candidates, resolves candidates, plans repetitions, stages workspaces, calls the App Server runner, and writes `run.json`, `progress.jsonl`, `results.jsonl`, event files, evidence files, and response files.
4. `eval grade` discovers or uses declared graders, runs `validate.*` scripts, calls model judges, creates pending human grade rows, and writes `grades.jsonl`.
5. `eval human` shows review packets or records human labels.
6. `eval calibrate` compares model and human labels.
7. `eval report` builds candidate/case state rows, gate failures, unknown evidence, comparisons, and attention items.

The strongest design choices are:

- Candidate comparison is native. Eve can compare deployments indirectly, but Meta-Skill has `no-skill`, `current`, and candidate payloads in the schema.
- Hidden grading is disciplined. `task.md` contains only visible agent bytes; judges, expected files, validators, and labels stay outside the trial workspace.
- Human and model labels share one scale: `pass`, `partial`, `fail`, `unknown`.
- Reports expose uncertainty instead of hiding it.
- Calibration and judge alignment are first-class concepts.

The roughest edges are:

- The runtime is sequential.
- CI gating is not one crisp command.
- Common event assertions require custom validators.
- Some docs still need runtime alignment, especially the `id`/`label` candidate example versus `candidate`/`display`.
- Judge model configuration is not as locally scoped and ergonomic as Eve's `judge` hierarchy.

## Product Lessons For Meta-Skill

1. Add an Eve-like "happy path" command.

Meta-Skill should keep its detailed workbench commands, but add or document a single strict loop for common use:

```sh
metaskill eval check --suite .<skill-name>/evals.json --strict --report out.md
```

That command would lint, materialize if needed, run, grade, report, and exit non-zero on runner failures, gate failures, invalid grader JSON, or required unknown evidence.

2. Add built-in transcript assertion helpers.

Eve's run-level assertions are a major usability win. Meta-Skill could keep validators but provide standard helpers or manifest declarations for:

- completed / did not fail
- called tool
- did not call tool
- loaded skill
- max tool calls
- validation command was run
- no forbidden write
- asked for approval before action

3. Fix manifest docs/runtime schema drift.

Use `candidate` and `display` consistently, or intentionally normalize `id`/`label` in `manifest.py`. Right now the docs and runtime are too easy to misread.

4. Make judge configuration explicit at the grader layer.

Eve's innermost-wins judge model hierarchy is easy to explain. Meta-Skill could support judge model at `graders[]`, suite defaults, and CLI override, separate from the candidate trial model.

5. Add CI/report export affordances.

JUnit would make Meta-Skill gate failures visible in CI. A reporter interface could come later, but JUnit plus machine-readable strict summaries would cover the immediate need.

6. Preserve Meta-Skill's advantage: candidate comparison and hidden evidence.

Eve is smoother, but it is not a replacement for Meta-Skill's core idea. Eve tests an app. Meta-Skill tests whether a skill payload changes behavior relative to baselines and candidates, with hidden graders and calibration. That is the distinctive product value.

## Bottom Line

Eve has the cleaner eval authoring and CI loop. It wins on developer ergonomics, path-derived identity, inline assertions, concurrency, local/remote target parity, and reporter integrations.

Meta-Skill has the deeper evaluation methodology. It wins on candidate comparison, hidden workbench evidence, explicit task/candidate/trial vocabulary, human calibration, and honest uncertainty.

The best next direction for Meta-Skill is not to become Eve. It should keep the workbench and candidate-evidence model, but borrow Eve's authoring ergonomics where they reduce friction: a one-command strict loop, built-in event assertions, clearer schema, scoped judge config, and CI artifacts.

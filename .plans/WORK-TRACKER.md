# Meta Skill Work Tracker

Use this tracker to keep the Meta Skill plugin roadmap centered on evaluation truth. The immediate goal is now to spend the simplified surface on App Server capabilities that a plain model API cannot provide: event trajectories, sandbox evidence, and forkable threads.

## Current State Summary

Meta Skill has one top-level TypeScript CLI surface: `create`, `project init`, `lint`, `run`, and `package`. TypeScript runs directly from `plugins/meta-skill/src/` through `scripts/meta-skill.js`; validation is `npm test`, `npm run typecheck`, and repo-level `git diff --check`.

The workbench has one compact project-local shape:

- portable payload at the project root, with `SKILL.md` plus runtime support folders.
- authoring and evidence state under `.meta-skill/`.
- cases under `.meta-skill/cases/<ID-slug>/`.
- deterministic tests under `.meta-skill/tests/unit/`.
- run evidence under `.meta-skill/runs/<run-id>/`.

Case taxonomy is one executable axis. `meta-skill run --type` accepts `R`, `F`, and `G`, mapping to regression, failure mode, and gate cases.

A run evaluates one execution source at a time:

- working payload by default
- no skill / unassisted execution with `--no-skill`

Run evidence uses per-case files:

```text
.meta-skill/runs/<run-id>/
  payload/                 working-payload runs only
  cases/<case-folder>/
    case.md
    rpc.jsonl
    turn-evidence.json
    final.md
```

`payload/` exists for working-payload runs. No-skill runs omit it. Token metrics live in `turn-evidence.json` as nullable numbers plus one `unavailable_reason` when exact usage cannot be collected.

Successful App Server execution is evidence, not proof of quality. Pass/fail confidence comes from deterministic tests, human review, or future judge/review layers.

The App Server runner starts one read-only/no-approval/no-network thread per case, force-attaches the skill payload for working-payload runs, collects final answer text, saves raw RPC rows, writes normalized `turn-evidence.json`, and captures final cumulative token telemetry when present. The current turn evidence summary includes turns, items, command executions, file changes, tool calls, approval requests, warning items, and unknown methods.

The next measurement gap is the assertion layer over turn evidence:

- App Server protocol drift is still handled mostly by unavailable token evidence; add a clearer canary/gate before building more event-stream features.
- trigger and writable-output concepts stay future-only until the runner can prove native routing or writable outputs.
- run output needs a small case-result index so selected, attempted, completed, and errored cases cannot blur together.
- event evidence needs tighter case and turn attribution before concurrency, turn-evidence assertions, or larger suites expand the surface.

Validation baseline from the current merged slice:

- `npm test` from `plugins/meta-skill/`
- `npm run typecheck` from `plugins/meta-skill/`
- `git diff --check` from the repo root

## Pre-Scaling Architecture Refinement

These findings came from a read-only code-quality scan before adding more behavior-scaling features. Treat them as cleanup multipliers: they should reduce protocol drift, evidence ambiguity, packaging risk, and source/generated drift before turn-evidence assertions, fork trees, or larger eval suites expand the surface.

### Harden Deterministic Test Execution

- Recommendation: Strong
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/lint.ts` and `plugins/meta-skill/src/eval/discovery.ts`.
- Finding: Discovered unit tests are converted from filenames into shell command strings, and `lintProject()` can continue to execution even after invalid test ID failures are recorded.
- Why it matters: Workbench test files are local user-controlled inputs. A shell command boundary makes malformed filenames more dangerous than the intended deterministic-test interface and weakens confidence before larger suites.
- Suggested improvement: Represent discovered tests as typed executable paths, validate IDs before execution, skip invalid tests, and run valid files with `execFile` or `spawn` using an argv array.
- Verification: Add fixture tests for invalid filenames, duplicate IDs, filenames containing shell metacharacters, and a valid executable unit test. Run `npm test` and `npm run typecheck` from `plugins/meta-skill/`.

### Add A Minimal Run Result Index

- Recommendation: Strong
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/eval/run.ts`, `plugins/meta-skill/src/app-server/runner.ts`, `plugins/meta-skill/src/eval/types.ts`, and `plugins/meta-skill/src/commands.ts`.
- Finding: `runEval()` returns `runId`, `runRoot`, `ok`, bare error messages, and a `cases` list. It ignores structured `CaseRunResult` details and pushes the case folder into the list even after a runner failure.
- Why it matters: As suites grow, run output cannot cleanly distinguish selected, attempted, completed, and failed cases. Failed cases can look completed to downstream readers, and failures lose case-local evidence context.
- Suggested improvement: Add one run-owned case result model or tiny run manifest with per-case evidence paths, execution status, final path, turn-evidence path, token availability, and error detail.
- Verification: Add fake-runner tests for one passing case, one runner failure, and one lint-observation failure. Assert CLI output and result shape do not claim failed cases as completed.

### Isolate App Server Case Event Sessions

- Recommendation: Strong
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/app-server/runner.ts`, `plugins/meta-skill/src/app-server/trace.ts`, `plugins/meta-skill/src/app-server/client.ts`, and `plugins/meta-skill/src/eval/run.ts`.
- Finding: `AppServerCaseRunner` keeps one mutable client, trace recorder, and raw trace buffer, then flushes and resets them per case. All client lines are routed through the runner's current mutable buffers while cases are forced to run sequentially.
- Why it matters: Evidence attribution depends on runner-wide mutable state, which makes late events, respawns, and future bounded case concurrency hard to reason about.
- Suggested improvement: Introduce a per-case `AppServerCaseSession` or `TurnEventStream` that owns trace recording, in-memory marks, overflow state, and client lifetime/binding for one case. Let `runEval()` depend on that deeper interface.
- Verification: Add delayed fake-client tests with two cases and late events, proving `rpc.jsonl` and `turn-evidence.json` stay isolated. Add bounded-concurrency tests only after this isolation exists.

### Tighten Turn Evidence Event Attribution

- Recommendation: Strong
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/app-server/turn-evidence.ts` and `plugins/meta-skill/src/app-server/turn-evidence.test.ts`.
- Finding: Turn evidence folding applies one broad `belongsToTurn` gate, then treats events with no `turnId` as belonging to the selected turn. Tests cover wrong thread and turn IDs, but not missing-turn multi-turn contamination.
- Why it matters: Thread-level or malformed App Server events can be folded into a turn silently, weakening `turn-evidence.json` as protocol-drift evidence.
- Suggested improvement: Add an event classifier with explicit `turn`, `thread`, `request`, and `unknown/unscoped` handling. Require turn identity for turn/item methods, and quarantine missing-turn events unless the method is intentionally thread-scoped.
- Verification: Add multi-turn parser tests with thread-level events and item events missing `turnId`; assert they do not affect final text, token usage, or item counts unless explicitly classified.

### Make Package Artifact Integrity First-Class

- Recommendation: Strong
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/package.ts` and `plugins/meta-skill/src/project.test.ts`.
- Finding: `package.ts` hand-writes ZIP records and CRCs, computes the artifact SHA, and discards that hash. Tests cover `--out-dir`, but not the default ZIP artifact.
- Why it matters: `package` is the sharing boundary. A custom ZIP writer can be fine, but without ZIP-open verification or metadata checksum use, packaging regressions may pass tests while producing bad artifacts.
- Suggested improvement: Either use the computed SHA in metadata or remove it. Add default ZIP packaging tests that open/list/extract the artifact, verify file ordering, confirm `.meta-skill/` exclusion, and verify metadata points to the exact artifact.
- Verification: Add ZIP fixture tests plus the existing out-dir test. Run `npm test`, `npm run typecheck`, and a ZIP integrity check.

### Add A Non-Mutating Generated-Sync Gate

- Recommendation: Strong
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `AGENTS.md`, `scripts/sync-plugins.sh`, `skills/`, `.codex/agents/`, `assets/agent/`, `plugins/codex/agent/`, and `plugins/claude/agent/`.
- Finding: Source boundaries are documented, generated-package edits are prohibited, and sync is mandatory after source changes, but the only sync command mutates generated package trees and user install/cache state.
- Why it matters: The repo relies on humans remembering to run a mutating script. Scaling the tool needs a cheap proof that generated plugin packages match source before commit or PR.
- Suggested improvement: Add `scripts/check-plugin-sync.sh` or `scripts/sync-plugins.sh --verify` that compares `skills/`, `.codex/agents/`, and `assets/agent/` against generated plugin outputs without writing.
- Verification: An unsynced source edit fails the check; running `scripts/sync-plugins.sh` makes it pass. Include the verify command in the normal validation path.

### Split Sync Generation From User-Install Side Effects

- Recommendation: Strong
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `scripts/sync-plugins.sh`.
- Finding: One script owns repo package generation, manifest writing, user dotfiles, marketplace registration, installation, and cache refresh.
- Why it matters: The safe verification surface is much larger than the source/generated boundary actually needs, and CI-style checks cannot easily exercise the repo generation path without touching user state.
- Suggested improvement: Keep one user-facing command if desired, but factor pure repo generation/verification from install/cache refresh. Add explicit modes such as repo-only, install, cache, and verify.
- Verification: Repo-only mode changes only tracked generated package/marketplace files; verify mode is read-only; install/cache mode can be skipped in CI.

### Make Arbitrary Runtime Folders Visible

- Recommendation: Strong
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/ARCHITECTURE.md`, `plugins/meta-skill/skills/skill-create/references/cli-conventions.md`, `plugins/meta-skill/src/project.ts`, `plugins/meta-skill/src/lint.ts`, and `plugins/meta-skill/src/commands.ts`.
- Finding: Packaging includes arbitrary non-excluded root folders, while create/lint only give first-class copy and link-check treatment to `references`, `scripts`, and `assets`. Durable docs now describe other packaged files as intentional runtime files, not a canonical `resources/` folder.
- Why it matters: Skills do not have to use `references/`, `scripts/`, or `assets/`, and their root folders can technically be named anything. Packaging should keep supporting that flexibility, while maintainers still need visibility into non-standard payload files.
- Suggested improvement: Keep docs generic and add validation or package metadata that makes intentionally packaged non-standard files visible without turning `resources/` into a first-class contract.
- Verification: Add package tests proving arbitrary root folders are included in the ZIP and excluded folders stay out; add lint/package visibility checks if maintainers need a stronger warning surface.

### Refresh Tracker And Docs Before Scaling

- Recommendation: Strong
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `.plans/WORK-TRACKER.md`, `plugins/meta-skill/ARCHITECTURE.md`, `plugins/meta-skill/src/commands.ts`, and `plugins/meta-skill/src/evals-app-server.test.ts`.
- Finding: The tracker had current-state text for deleted `judge`, `feedback import`, `report`, `decide`, `facts.jsonl`, and report/fact projection surfaces while live source exposes only `create`, `project init`, `lint`, `run`, and `package`, and tests assert `facts.jsonl` is absent.
- Why it matters: The tracker is the planning surface for scaling Meta Skill. Stale current-state language can reintroduce broad command surfaces or old fact/report assumptions.
- Suggested improvement: Keep tracker and docs in present-tense alignment with live help, architecture docs, and evidence tests. Move future review/report/fact language into explicit roadmap entries only where still wanted.
- Verification: Compare `node scripts/meta-skill.js --help`, `commands.test.ts`, `evals-app-server.test.ts`, and tracker current-state lines in one docs check. Run `npm test` and `git diff --check`.

### Collapse Dual Transient Event Buffers

- Recommendation: Worth exploring
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/app-server/client.ts`, `plugins/meta-skill/src/app-server/trace.ts`, `plugins/meta-skill/src/app-server/runner.ts`, and `plugins/meta-skill/src/app-server/runner.test.ts`.
- Finding: The client exposes `eventCount/eventsSince` while `BoundedTraceBuffer` maintains a separate transient event buffer. Runner tests exercise normal extraction through one path and overflow behavior through another.
- Why it matters: Two event sources for one evidence concept create branchy extraction and let tests exercise different semantics from production.
- Suggested improvement: Define one `AppServerEventStream` with `mark/since/overflow`; make real and fake clients emit through it, and keep durable JSONL recording as a subscriber.
- Verification: Convert runner tests to one event-source path; assert normal extraction and overflow warning behavior still pass.

### Delete Or Connect Unused Turn Evidence Summary Projection

- Recommendation: Worth exploring
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/app-server/turn-evidence.ts` and `plugins/meta-skill/src/app-server/turn-evidence.test.ts`.
- Finding: `summarizeTurnEvidence()` and `formatTurnEvidenceSummary()` are exported but have no production callers; only tests exercise them.
- Why it matters: This looks like report/view scaffolding that is not wired into current run flow, adding surface area without leverage.
- Suggested improvement: If report/view work is imminent, move this projection to the reporting boundary and test it through user-visible output. Otherwise delete it until there is a caller.
- Verification: `rg summarizeTurnEvidence formatTurnEvidenceSummary`; then `npm test` and `npm run typecheck`.

### Tighten Project Module Ownership And Dead Exports

- Recommendation: Worth exploring
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/project.ts`, `plugins/meta-skill/src/package.ts`, and `plugins/meta-skill/src/eval/types.ts`.
- Finding: `project.ts` mixes filesystem helpers, workbench creation, payload filtering/copying, sequence IDs, git context, hashes, and token fallback construction. Dead-looking exports/imports include `touch`, `relativePath`, `gitContext`, `RunFailureClassification`, and unused package imports; `tsconfig.json` does not enable unused checks.
- Why it matters: `project.ts` is becoming a low-depth utility drawer. As package/eval/project boundaries grow, shared helpers make ownership harder to see and dead exports linger quietly.
- Suggested improvement: Do a narrow cleanup pass: enable `noUnusedLocals`/`noUnusedParameters` if tolerable, delete dead exports, and move payload packaging policy behind a small payload/package-owned module only if the deletion pass shows repeated callers.
- Verification: Run `npm run typecheck` with unused checks enabled, add focused payload-list tests if extracting payload ownership, then run `npm test`.

### Centralize The CLI Contract

- Recommendation: Worth exploring
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/commands.ts`, `plugins/meta-skill/skills/skill-create/references/cli-conventions.md`, and `plugins/meta-skill/ARCHITECTURE.md`.
- Finding: Runtime help, parser flags, skill-create CLI guidance, and architecture command taxonomy each repeat the command contract.
- Why it matters: Future flags or command removals can drift between runtime, help, skill guidance, and architecture docs.
- Suggested improvement: Introduce a small CLI contract module or golden contract test that drives help, docs assertions, and command parser expectations from one source.
- Verification: Updating a command or flag requires one source change and a focused `npm test` from `plugins/meta-skill/`.

### Remove Dormant Discoverable Activation

- Recommendation: Worth exploring
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/models.ts`, `plugins/meta-skill/src/app-server/runner.ts`, and `plugins/meta-skill/ARCHITECTURE.md`.
- Finding: `SkillActivation` includes `discoverable`, but the runner immediately throws for it. The architecture doc says trigger routing is roadmap, not current behavior.
- Why it matters: A runtime union member with no supported adapter is a shallow future seam. It invites callers to model behavior the runner cannot execute.
- Suggested improvement: Remove `discoverable` from runtime types until App Server support exists, or move it to roadmap/design docs outside executable contracts.
- Verification: `npm run typecheck` and existing runner/eval tests pass with only `forced | none`.

### Add Bounded Scheduling After Evidence Boundaries Are Stable

- Recommendation: Worth exploring
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/eval/run.ts` and `plugins/meta-skill/src/lint.ts`.
- Finding: Cases and deterministic tests run sequentially even when some inputs and outputs are independent.
- Why it matters: Larger eval suites will pay unnecessary wall-clock cost, but naive concurrency could scramble case evidence or overload the managed App Server.
- Suggested improvement: Add a small bounded scheduler only after per-case run results and event-session isolation exist. Start with deterministic tests and fake-runner-safe case execution; keep App Server concurrency capped and explicit.
- Verification: Add delayed fake runner/test fixtures that prove bounded concurrency, deterministic case attribution, and unchanged CLI output. Run `npm test` from `plugins/meta-skill/`.

## Tessl-Inspired Product Roadmap

These roadmap items came from a 2026-06-05 review of Tessl's public skill review, registry, CLI, and scenario/eval surfaces against the current Meta Skill implementation. Keep Meta Skill local and evidence-first; do not copy Tessl's package manager or public registry wholesale. The useful import is the product shape: clear quality review, impact comparison, generated starter scenarios, readable eval views, and publish/readiness gates.

### Add A Real `meta-skill review`

- Recommendation: Strong.
- Evidence: Tessl skill reviews split quality into validation checks plus LLM-judged discovery/activation and implementation scores, with per-vector reasoning and recommendations.
- Where: `plugins/meta-skill/src/commands.ts`, `plugins/meta-skill/src/lint.ts`, new review module, `plugins/meta-skill/src/report.ts`, and `.meta-skill/reviews/<review-id>/`.
- Finding: Meta Skill currently has deterministic lint and eval evidence, but no first-class quality review command. The old heuristic review fallback was removed because it was too shallow and not real judge evidence.
- Suggested improvement: Add read-only `meta-skill review <project> [--json]`. Run deterministic lint first, then invoke a dedicated reviewer judge/subagent for Discovery, Implementation, and Validation. Store `review.json`, `report.md`, and lint context under `.meta-skill/reviews/<review-id>/`. If judge review is unavailable, mark Discovery/Implementation unavailable rather than guessing.
- Verification: Add tests for deterministic-only unavailable review, full review report rendering, JSON shape, and no source edits. Run `npm test`, `npm run typecheck`, and `git diff --check`.

### Upgrade Eval Viewing Before Adding More Eval Modes

- Recommendation: Strong.
- Evidence: Tessl registry pages make quality, impact, evals, security/advisory, and files legible in one view; current Meta Skill run output is terse and file-first.
- Where: `plugins/meta-skill/src/commands.ts`, a future eval-view module, view tests, and optional local static HTML under run evidence or generated on demand.
- Finding: Meta Skill has useful case definitions, trajectories, final answers, lint output, and token usage, but no first-class eval viewer. Users still need manual file drilling.
- Suggested improvement: Add `meta-skill eval list <project>` and `meta-skill eval view <project> [--run <id>|--last] [--json]`. Show run status, case status, missing checks, execution errors, final answer previews, turn-evidence links, token totals/availability, tests, review artifacts, human decisions, and manual-review flags.
- Verification: Add fixture runs for clean, failed, no-verdict, missing-check, token-unavailable, and turn-evidence-rich cases. Verify Markdown/JSON output remains deterministic.

### Make Baseline-Vs-Candidate Impact First-Class

- Recommendation: Strong.
- Evidence: Tessl's strongest eval concept is impact: compare task performance with and without skill context. Meta Skill can run working-payload or no-skill executions today, but only one source per run.
- Where: `plugins/meta-skill/src/eval/run.ts`, `plugins/meta-skill/src/models.ts`, run result artifacts, eval-view rendering, and `skill-eval` docs.
- Finding: Separate `--no-skill` runs are honest manual control evidence, but they do not give users a direct impact table showing where the skill helped, regressed, or was unnecessary.
- Suggested improvement: Add `meta-skill run <project> --compare baseline` or a future `meta-skill eval run <project> --compare baseline`. Store baseline and candidate evidence per case, never pool token usage, and report cases as candidate improves, candidate regresses, both fail, baseline already succeeds, or requires human review.
- Verification: Add fake-runner tests for baseline/candidate case execution, source-specific evidence, unavailable source evidence, no pooled tokens, and report status categories.

### Generate Draft Starter Cases

- Recommendation: Strong.
- Evidence: Tessl supports scenario generation workflows; Meta Skill already has a separate minimal eval-generation plan, but the tracker should keep this product gap visible in the main roadmap.
- Where: `.plans/meta-skill-minimal-eval-generate-exec-plan.md`, `plugins/meta-skill/src/eval/`, `plugins/meta-skill/src/commands.ts`, and `skill-eval` docs.
- Finding: New skill projects still start with empty eval coverage unless the user hand-authors cases.
- Suggested improvement: Add deterministic `meta-skill eval generate <project> --count <n> --strategy merge|replace` that creates draft R/F/G starter cases from the skill description and body. Generated cases must be labeled manual-review scaffolds and must not become release proof until tests, judges, feedback, or human decisions resolve them.
- Verification: Use generator-owned metadata to protect hand-authored cases, test merge/replace/dry-run/JSON output, and run lint compatibility checks on generated cases.

### Connect Review To Evidence-Backed Improve

- Recommendation: Strong after `review` exists.
- Evidence: Tessl exposes `skill review --optimize`, but Meta Skill should keep the more careful "improve" language and human-gated edit semantics.
- Where: `plugins/meta-skill/skills/skill-improve/`, future review artifacts, a future improve module, and decision artifacts.
- Finding: Meta Skill does not yet have a tight chain from review findings to scoped edit proposals to validation.
- Suggested improvement: Add an improve flow that can read a review ID or run/case evidence, propose bounded source edits, rerun relevant lint/evals, and require human approval before package, publish, install, sync, or accept decisions. Keep `review` read-only.
- Verification: Add tests that review evidence can be referenced by improve and decision artifacts and that improve mode refuses to edit without explicit edit intent.

### Add Publish / Package Readiness Gates Instead Of A Registry

- Recommendation: Worth exploring.
- Evidence: Tessl's publish path bundles skills, runs automatic review/evaluation, versions the package, and surfaces registry quality. Meta Skill should not become a registry, but it can provide local readiness gates.
- Where: `plugins/meta-skill/src/package.ts`, `plugins/meta-skill/src/lint.ts`, future review/eval summaries, and package docs.
- Finding: `package` validates and packages the portable payload, but it does not yet answer whether the skill is ready to share.
- Suggested improvement: Add `meta-skill package --check` or `meta-skill publish-readiness <project>` that verifies lint clean, review present and above configured threshold, baseline eval evidence exists when required, no unresolved execution failures, package excludes `.meta-skill/`, runtime resource links are intact, and human decisions are recorded for accepted changes.
- Verification: Add readiness fixtures for missing review, stale eval, unresolved failures, clean package, and package exclusion behavior.

### Add Skill Inventory, Staleness, And Security-Lite Later

- Recommendation: Later.
- Evidence: Tessl registry and related skill-insights surfaces show quality, impact, security/advisory, files, versioning, staleness, and duplicate/registry-search signals across skill sets.
- Where: future inventory command over local skill roots, package metadata, git history, lint/review summaries, and resource link validation.
- Finding: Once individual skill review/eval loops work, a multi-skill owner needs to know which skills are stale, duplicate, low quality, broken, or missing evidence.
- Suggested improvement: Add `meta-skill inventory <root>` and `meta-skill stale <root>` later. Start deterministic: git last touched, broken runtime links, missing review/eval evidence, package metadata, duplicate trigger risk, and security-lite warnings for risky scripts or external-action gates.
- Verification: Use a local fixture inventory with multiple skills, broken references, old git timestamps, duplicate triggers, and scripts requiring gates.

## Completed Items

- PR #20 / `6b4086da`: Eval runs use one execution source at a time, and no-skill runs stay manual control evidence.
- PR #21 / `03bc2b4d`: Execution status and verdict evidence are separate, so successful execution is not pass/fail proof.
- PR #22 / `5911f432`: Token evidence lives on case trial facts as the canonical summary source.
- `f03a2307`: Manual cross-run inspection stays separate from in-run eval execution and automated uplift language.
- `ec8485b7`: CLI help, dispatch, docs, and tests reflect the supported command surface.
- `57c4ebe0`: App Server recovery uses one explicit orchestration retry.
- `9e36774d`: Bounded client-side App Server event retention while keeping `rpc.jsonl` as the durable raw trace.
- `888cda97`: Evidence bundles keep token reporting and file-output reporting in their canonical locations.
- `65051c8f`: Case taxonomy uses one executable type axis.
- `b462f507`: Cases live in case folders.
- `a2d749ff`: Meta Skill eval runtime uses the compact current workbench shape.
- `fcd89eab`: Reports are printed Markdown or JSON projections.
- `fb475536`: TypeScript execution runs directly from `src/`.
- `2749e558`: Tightened skill-create approval gates.
- `2e0fb77b`: Flattened the Meta Skill workbench and docs around portable payload plus `.meta-skill/`.
- `b7d22d95`: Refined skill-create and skill-eval docs for consistency.

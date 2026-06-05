# Meta Skill Work Tracker

Use this tracker to keep the Meta Skill plugin roadmap centered on evaluation truth. The immediate goal is now to spend the simplified surface on App Server capabilities that a plain model API cannot provide: event trajectories, sandbox evidence, and forkable threads.

## Current State Summary

Meta Skill has one top-level TypeScript CLI surface: `create`, `project init`, `lint`, `run`, `judge`, `feedback import`, `report`, `decide`, and `package`. TypeScript runs directly from `plugins/meta-skill/src/` through `scripts/meta-skill.js`; validation is `npm test`, `npm run typecheck`, and repo-level `git diff --check`.

The workbench has one compact project-local shape:

- portable payload at the project root, with `SKILL.md` plus runtime support folders.
- authoring and evidence state under `.meta-skill/`.
- cases under `.meta-skill/cases/<ID-slug>/`.
- deterministic tests under `.meta-skill/tests/unit/` and `.meta-skill/tests/eval/`.
- run evidence under `.meta-skill/runs/<run-id>/`.

Case taxonomy is one executable axis. `meta-skill run --type` accepts `R`, `F`, and `G`, mapping to regression, failure mode, and gate cases.

A run evaluates one execution source at a time:

- working payload by default
- no skill / unassisted execution with `--no-skill`

Run evidence uses one append-only fact log and per-case files:

```text
.meta-skill/runs/<run-id>/
  facts.jsonl
  payload/
  cases/<case-folder>/
    case.md
    rpc.jsonl
    trajectory.json
    final.md
```

`payload/` exists for working-payload runs. No-skill runs omit it. Token metrics live on `case_trial_finished` facts as nullable numbers plus one `unavailable_reason`; reports derive token totals from those facts. Reports are deterministic projections over facts and referenced case evidence. They print Markdown or JSON and do not persist report files.

Execution facts and verdict evidence are separate. Successful App Server execution is `execution_status: completed`; pass/fail style evidence comes only from deterministic tests, judges, or human feedback. Completed execution without a check observation remains evidence, not proof of quality.

The App Server runner starts one read-only/no-approval/no-network thread per case, force-attaches the skill payload for working-payload runs, collects final answer text, saves raw RPC rows, writes normalized `trajectory.json`, captures final cumulative token telemetry when present, and records case completion facts. The current trajectory summary includes turns, items, command executions, file changes, tool calls, approval requests, and unknown methods. It feeds reports and optional judge context.

The next measurement gap is the assertion layer over trajectory evidence:

- App Server protocol drift is still handled mostly by unavailable token evidence; add a clearer canary/gate before building more event-stream features.
- trigger and writable-output concepts stay future-only until the runner can prove native routing or writable outputs.
- bounded event retention needs a small hardening pass so overflow bookkeeping itself cannot grow without bound.
- final-answer extraction should avoid carrying forward a previous turn's final text when the current turn overflows before deltas are available.

Validation baseline from the current merged slice:

- `npm test` from `plugins/meta-skill/`
- `npm run typecheck` from `plugins/meta-skill/`
- `git diff --check` from the repo root

## Pre-Scaling Architecture Refinement

These findings came from a read-only code-quality scan before adding more behavior-scaling features. Treat them as cleanup multipliers: they should reduce protocol drift, repeated I/O, and schema looseness before trajectory assertions, fork trees, or larger eval suites expand the surface.

### Deepen App Server Turn Execution

- Recommendation: Strong
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/app-server/runner.ts`, `plugins/meta-skill/src/eval/judge.ts`, `plugins/meta-skill/src/app-server/trajectory.ts`, and `plugins/meta-skill/architecture.md`.
- Finding: Solver runs and judge runs both speak generated App Server JSON-RPC directly. They each construct `thread/start` and `turn/start` payloads, wait for completion, track event marks, and extract final output, but the judge path uses a different completion shape than the solver path.
- Why it matters: App Server protocol changes now have multiple shallow seams to update, optional judge runs can drift from solver behavior, and future protocol canaries or trajectory assertions will have to understand duplicated orchestration.
- Suggested improvement: Add one deeper App Server turn/session module that owns thread start, turn start, completion matching by thread and turn, transient event slicing, RPC persistence, and final text extraction. Solver and judge paths should pass policy, prompt, and response parsing into that module instead of issuing raw protocol calls themselves.
- Verification: Add fake App Server tests covering solver and judge execution through the shared module, including generated `turn/completed` events, `item/agentMessage/delta`, final JSON extraction, and token/final event handling. Run `npm test` and `npm run typecheck` from `plugins/meta-skill/`.

### Type The Fact Log Interface

- Recommendation: Strong
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/models.ts`, `plugins/meta-skill/src/facts.ts`, `plugins/meta-skill/src/eval/run.ts`, `plugins/meta-skill/src/lint.ts`, `plugins/meta-skill/src/eval/judge.ts`, `plugins/meta-skill/src/improve.ts`, and `plugins/meta-skill/src/report.ts`.
- Finding: `facts.jsonl` is the canonical evidence log, but the TypeScript interface is still `payload: Record<string, unknown>`. Producers append ad hoc payloads while reports recover meaning through string coercion, optional probes, and report-time normalization.
- Why it matters: Evidence schema drift becomes a runtime/reporting surprise instead of a type error, and every new behavior assertion will spread more payload-key knowledge across run, lint, judge, feedback, decide, and report code.
- Suggested improvement: Move fact-kind payload shapes into a discriminated union in `facts.ts` or `models.ts`, and expose typed constructors or append helpers for `run_started`, `case_defined`, `case_trial_finished`, `check_observed`, `feedback_imported`, and `decision_recorded`. Keep external feedback loose only at import, then normalize before appending.
- Verification: Add focused fact/report tests for each fact kind and use `satisfies` or typed fixtures so malformed payloads fail `npm run typecheck`. Run `npm test` and `npm run typecheck` from `plugins/meta-skill/`.

### Collapse Duplicate Run Report Projection

- Recommendation: Strong
- Evidence: 2026-06-05 efficiency review; `npm test`, `npm run typecheck`, and `git diff --check` passed during the read-only scan.
- Where: `plugins/meta-skill/src/eval/run.ts`, `plugins/meta-skill/src/commands.ts`, and `plugins/meta-skill/src/report.ts`.
- Finding: `runEval()` builds a run report at the end, discards it, and then `commandRun()` builds the same report again to print it. Each projection rereads `facts.jsonl` and per-case `trajectory.json` files.
- Why it matters: This is avoidable file I/O and JSON parsing on the main eval path, and it blurs the producer/projection boundary the architecture doc is trying to keep crisp.
- Suggested improvement: Make report projection single-owner. Either return the built report from `runEval()` for `commandRun()` to print, or remove the internal projection and let the command/report lane build it exactly once. While there, index facts by type and case during report construction instead of repeatedly filtering the full fact list.
- Verification: Add a multi-case CLI or unit test proving run output is unchanged and report projection happens once. Run `npm test` and `npm run typecheck` from `plugins/meta-skill/`.

### Consolidate Frontmatter And Metadata Parsing

- Recommendation: Worth exploring
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/project.ts`, `plugins/meta-skill/src/eval/cases.ts`, `plugins/meta-skill/src/lint.ts`, and `plugins/meta-skill/package.json`.
- Finding: Skill frontmatter, case frontmatter, and agent manifest metadata are parsed by separate hand-rolled paths with different capabilities. Case parsing implements a larger YAML subset, while skill and manifest parsing are line-oriented; malformed fields often coerce to empty strings, arrays, or objects.
- Why it matters: Adding trajectory assertions, budget gates, or richer case metadata will increase parser complexity and make diagnostics inconsistent unless one module owns the supported metadata shape.
- Suggested improvement: Add one frontmatter/metadata module with typed decoders for `SKILL.md`, `case.md`, and `agents/openai.yaml`. If avoiding dependencies is intentional, keep the parser local but document and test the supported YAML subset in one place.
- Verification: Add table-driven parser tests for quoted strings, nested judge thresholds, invalid scalar/list shapes, required fields, and manifest metadata. Run existing lint/case tests, `npm test`, and `npm run typecheck` from `plugins/meta-skill/`.

### Collapse Unsupported Future App Server Modes

- Recommendation: Worth exploring
- Evidence: 2026-06-05 architecture-refinement scan with parallel subagent review.
- Where: `plugins/meta-skill/src/commands.ts`, `plugins/meta-skill/src/eval/run.ts`, `plugins/meta-skill/src/app-server/client.ts`, `plugins/meta-skill/src/app-server/runner.ts`, and `plugins/meta-skill/src/models.ts`.
- Finding: `--app-server-endpoint`, attached App Server mode, and discoverable skill activation remain executable interface concepts even though the implementation immediately rejects them. They are one-adapter seams whose current variation is only hypothetical.
- Why it matters: Callers and tests must carry unsupported concepts while the current invariant is simpler: managed stdio App Server with forced payload or no-skill activation. Future modes already have tracker/docs space until protocol proof exists.
- Suggested improvement: Remove unsupported modes from the executable CLI/types, or centralize their rejection in one boundary with no extra flags leaking through run configuration. Keep attached/discoverable routing as roadmap language until the App Server protocol proves it.
- Verification: Update command help tests and type references so unsupported modes disappear from executable paths or reject from one place. Run `npm test`, `npm run typecheck`, and `git diff --check`.

### Add Bounded Scheduling Only Where Evidence Ordering Is Preserved

- Recommendation: Worth exploring
- Evidence: 2026-06-05 efficiency review.
- Where: `plugins/meta-skill/src/eval/run.ts`, `plugins/meta-skill/src/lint.ts`, and `plugins/meta-skill/src/eval/judge.ts`.
- Finding: Cases, deterministic tests, and judge observations all run sequentially even when some inputs and outputs are independent.
- Why it matters: Larger eval suites will pay unnecessary wall-clock cost, but naive concurrency could scramble fact ordering or overload the managed App Server.
- Suggested improvement: Add a small bounded scheduler, likely exposed as `--jobs`, starting with deterministic tests and fake-runner-safe case execution. Keep App Server concurrency capped and explicit, and preserve deterministic fact ordering when appending observations.
- Verification: Add delayed fake runner/test fixtures that prove bounded concurrency, deterministic fact ordering, and unchanged report output. Run `npm test` from `plugins/meta-skill/`.

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
- Evidence: Tessl registry pages make quality, impact, evals, security/advisory, and files legible in one view; current Meta Skill reports are printed Markdown/JSON projections with terse token and case summaries.
- Where: `plugins/meta-skill/src/report.ts`, `plugins/meta-skill/src/commands.ts`, report tests, and optional local static HTML under run evidence or generated on demand.
- Finding: Meta Skill has useful facts, trajectories, final answers, feedback, checks, and token usage, but the user-visible report hides too much detail and requires manual file drilling.
- Suggested improvement: Add `meta-skill eval list <project>` and `meta-skill eval view <project> [--run <id>|--last] [--json]`. Show run status, case status, missing checks, execution errors, final answer previews, trajectory links, token totals/availability, tests, judges, feedback, decisions, and manual-review flags. Keep `report` as a compatibility projection or make it an alias once the view is stable.
- Verification: Add fixture runs for clean, failed, no-verdict, missing-check, token-unavailable, and trajectory-rich cases. Verify Markdown/JSON output remains deterministic.

### Make Baseline-Vs-Candidate Impact First-Class

- Recommendation: Strong.
- Evidence: Tessl's strongest eval concept is impact: compare task performance with and without skill context. Meta Skill can run working-payload or no-skill executions today, but only one source per run.
- Where: `plugins/meta-skill/src/eval/run.ts`, `plugins/meta-skill/src/models.ts`, fact payload shapes, report rendering, and `skill-eval` docs.
- Finding: Separate `--no-skill` runs are honest manual control evidence, but they do not give users a direct impact table showing where the skill helped, regressed, or was unnecessary.
- Suggested improvement: Add `meta-skill run <project> --compare baseline` or a future `meta-skill eval run <project> --compare baseline`. Store baseline and candidate side evidence per case, never pool token usage, and report cases as candidate improves, candidate regresses, both fail, baseline already succeeds, or needs review.
- Verification: Add fake-runner tests for two-sided case execution, side-specific facts, unavailable side evidence, no pooled tokens, and report status categories.

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
- Where: `plugins/meta-skill/skills/skill-improve/`, future review facts, `plugins/meta-skill/src/improve.ts`, and decision recording.
- Finding: Meta Skill has `decide` for human-reviewed outcomes, but no tight chain from review findings to scoped edit proposals to validation.
- Suggested improvement: Add an improve flow that can read a review ID or run/case evidence, propose bounded source edits, rerun relevant lint/evals, and require human approval before package, publish, install, sync, or accept decisions. Keep `review` read-only.
- Verification: Add tests that review evidence can be referenced by improve/decide facts and that improve mode refuses to edit without explicit edit intent.

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

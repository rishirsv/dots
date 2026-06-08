# Meta Skill Evals Research

Research date: 2026-06-08

## Research Question

How should Meta Skill support trials, batch evals, skill/prompt experiments, and auto-research loops while keeping the plugin minimal, effective, and repo-local?

The design target is:

- one hidden workbench in the target skill project root: `.meta-skill/`
- Codex Thread / Worktree trials for small realistic tests
- batch eval runners for larger suites
- support for code, judge, and human graders
- support for baseline vs candidate vs champion comparisons
- agents under test should run the task normally and should not see hidden rubrics, expected outputs, or judge prompts
- outputs are often files and repo state, not just chat text

## Sources And Lanes

Primary sources inspected directly in this session:

- Microsoft SkillOpt project page: https://microsoft.github.io/SkillOpt/
- SkillOpt arXiv paper: https://arxiv.org/abs/2605.23904
- SkillOpt GitHub clone: `/tmp/metaskill-research/SkillOpt`
- Andrej Karpathy AutoResearch GitHub clone: `/tmp/metaskill-research-autoresearch`
- EvoSkill GitHub clone: `/tmp/metaskill-research-evoskill`
- upskill GitHub repo: https://github.com/yungbose/upskill
- upskill GitHub clone: `/tmp/metaskill-research-upskill`
- Anthropic skills GitHub clone: `/tmp/metaskill-research-anthropic-skills`
- Arize Phoenix GitHub clone: `/tmp/metaskill-research-phoenix`
- Tessl task/codebase eval docs: https://docs.tessl.io/evaluate/evaluating-your-codebase
- Tessl task eval launch post: https://tessl.io/blog/introducing-task-evals-measure-whether-your-skills-actually-work/
- Anthropic Skill Creator plugin page: https://claude.com/plugins/skill-creator
- Anthropic skills repo: https://github.com/anthropics/skills
- Phoenix run experiments docs: https://arize.com/docs/phoenix/datasets-and-experiments/how-to-experiments/run-experiments
- Phoenix dataset concepts docs: https://arize.com/docs/phoenix/datasets-and-experiments/concepts-datasets
- OpenAI Codex app-server source/docs: https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md
- Local Codex CLI help for `codex exec`, `codex app-server`, `codex remote-control`, and `codex exec-server`

Subagent lanes completed:

- SkillOpt
- Tessl
- Anthropic Skill Creator / skills
- Codex App Server / Codex Exec
- AutoResearch
- Phoenix / adjacent eval tooling

EvoSkill was inspected in the main thread because the subagent limit was reached.
upskill was inspected in the main thread because the subagent limit was still reached when it was added as a follow-up source.

## Executive Direction

Meta Skill should not copy SkillOpt, upskill, EvoSkill, Tessl, Phoenix, or Anthropic Skill Creator directly. The correct minimal product is a local workbench that treats skill and prompt improvement as an evidence loop:

1. Define cases.
2. Seed a clean isolated run surface.
3. Run the target agent normally.
4. Capture transcript, tool calls, file changes, costs, timings, and final artifacts.
5. Grade the result with code, judge, and/or human graders.
6. Compare baseline vs candidate on the same dataset version.
7. Promote only through explicit gates.

The strongest implementation path is incremental and aggressively sparse:

- **v1: Trials**: Codex Thread / Worktree trials, 1-3 cases, one appended ledger record, human-readable result summary, optional linked thread evidence.
- **v2: Batch Evals**: `codex exec --json --output-schema` over versioned case bundles, compact run summaries in one ledger, deterministic/code graders first.
- **v3: Experiments**: baseline/candidate/champion A/B, repeated runs, blind comparison, promotion records.
- **v4: Auto-Research**: optimizer proposes bounded skill edits from scored traces, held-out gate decides, rejected edits are retained as negative evidence.

Do not start with a Phoenix-scale UI, SkillOpt-scale research engine, EvoSkill-scale multi-agent framework, or a directory per concept. Start with a tiny local ledger and a small runner.

## Core Terms

Use these terms consistently.

| Term | Meaning |
|---|---|
| Case | One task prompt plus fixtures and expected grading context. |
| Fixture | Files, folders, repo state, or source material seeded into the run surface. Prefer `fixtures` over `source files`; it is standard testing language and covers files plus setup state. |
| Runner | The mechanism that executes the agent on a case. |
| Grader | A code, judge, or human evaluator that scores a run. |
| Trial | Small interactive/inspectable run, usually 1-3 cases, often via Codex Thread / Worktree. |
| Eval | Batch run over a suite with structured result records. |
| Experiment | Comparison of variants over the same dataset version. |
| Variant | A baseline, candidate, or champion skill/prompt/context payload. |
| Promotion Gate | Predeclared rule for accepting a candidate. |
| Trace | Structured evidence from a run: messages, tool calls, commands, files, status, usage, timings. |

## Recommended Workbench Shape

Use `.meta-skill/` as the private source of truth, but keep the file count deliberately small. The v1 workbench should have three required files:

```text
<skill-project>/
  .meta-skill/
    suites.json
    ledger.jsonl
    report.md
    artifacts/      # optional; only for large evidence that cannot be referenced
```

This replaces the earlier over-expanded tree. The principle is:

- `suites.json`: all suite, case, fixture, runner, grader, variant, and promotion definitions.
- `ledger.jsonl`: every trial, run, grade, observation, comparison, rejected edit, and promotion record as typed append-only events.
- `report.md`: the current human-readable synthesis generated from the suite and ledger.
- `artifacts/`: optional content-addressed blobs for large transcripts, output bundles, rendered files, or preserved diffs.

Do not create per-case, per-run, per-grader, per-experiment, or per-learning directories by default. Directories appear only when evidence is large enough that storing it inline would be worse. Most records should be inline JSON objects or references to existing repo paths plus hashes.

Minimal event types in `ledger.jsonl`:

```json
{"type":"trial","id":"trial-001","suite":"meeting-notes","case":"actions","variant":"candidate","status":"completed","summary":"..."}
{"type":"grade","run":"trial-001","grader":"schema","kind":"CODE","score":1,"source":"code","gating_eligible":true}
{"type":"observation","run":"trial-001","route":"procedure","rule":"...","promotion_path":"pressure-test"}
{"type":"comparison","experiment":"exp-001","baseline":"old","candidate":"new","winner":"candidate","delta":0.08}
{"type":"promotion","experiment":"exp-001","action":"propose","target_hash":"...","reason":"passed gate"}
```

`observations` should not become a second runtime memory system. An observation must name a promotion path: pressure-tested `SKILL.md` edit, grader/corpus row, monitoring alert, or drop. If it cannot name the path, keep it only in `report.md`.

## Runner Ladder

### 1. Codex Thread / Worktree Trial

Use for:

- one prompt sanity checks
- candidate edit evidence before parent-side source edits
- artifact-producing tasks where human inspection matters
- user-guided iteration

Current local reference: `meta-skill/references/skill-trial-runs.md`.

Keep this as the ergonomic front door. It already matches the user mental model.

Needed refinements:

- append one `trial` event to `.meta-skill/ledger.jsonl`
- include child thread id or pending worktree id in that event
- include fixture refs/hashes and target skill hash in that event
- parse a structured result block into the event
- preserve thread link as evidence instead of copying full transcripts by default
- write raw event capture to `artifacts/` only when it is needed for debugging or audit

### 2. `codex exec --json` Batch Runner

Use for:

- repeatable non-interactive evals
- CI-like runs
- JSONL event capture
- structured final output via `--output-schema`
- test matrices across cases, variants, models, and sandbox settings

Observed local CLI support:

- `codex exec --json`
- `codex exec --output-schema <FILE>`
- `codex exec --output-last-message <FILE>`
- `codex exec --ephemeral`
- `codex exec -C <DIR>`
- `codex exec --add-dir <DIR>`
- `codex exec --sandbox <MODE>`
- `codex exec --model <MODEL>`

Default recommendation:

```text
For batch evals, start with one fresh temp/worktree directory per case x variant.
Seed `.agents/skills/<skill-name>/SKILL.md` plus fixtures.
Run `codex exec --json --output-schema result.schema.json -C <run-dir> <prompt>`.
Summarize stdout JSONL into typed `ledger.jsonl` events.
Store raw JSONL under `artifacts/<sha>.jsonl` only on failure, sampling, or explicit audit mode.
Run external graders after the agent finishes.
```

This is enough for v1 batch evals and avoids app-server protocol coupling.

### 3. Codex SDK / App Server

Use later for:

- true multi-turn evals
- thread resume/rollback
- steering/interruption
- richer approval handling
- long-lived client-like runs
- exact app thread semantics

Risk:

- app-server is version-sensitive and partly experimental
- public docs recommend SDK for automation jobs
- direct app-server protocol should be pinned to generated schemas for the installed Codex CLI version

Recommendation:

- Do not build v1 around direct app-server.
- Record app-server as an advanced runner backend.
- Use app-server only when single-turn `codex exec` cannot model the task honestly.

## Seeding And Isolation

Every run surface should be built from a manifest. The agent under test should see only the task prompt, available files, and runtime skill payload. It should not see rubric internals.

### Run Surface Layout

```text
<run-dir>/
  .agents/
    skills/
      <skill-name>/
        SKILL.md
        references/
        scripts/
        assets/
  fixtures/
    ...
  work/
    ...
  AGENTS.md        # optional run-local constraints
  task.md          # visible prompt
```

### Fixture Manifest

```json
{
  "case_id": "meeting-notes-action-items",
  "fixture_version": "sha256:...",
  "files": [
    {
      "path": "fixtures/transcript.md",
      "sha256": "...",
      "role": "input",
      "visible_to_agent": true
    },
    {
      "path": "expected/action-items.json",
      "sha256": "...",
      "role": "expected",
      "visible_to_agent": false
    }
  ]
}
```

Use `fixtures` as the canonical term. It covers input documents, source files, expected outputs, seed repos, and setup scripts.

## Grader Model

Use three first-class grader families, not just "evaluations" and "validations".

| Grader Kind | Use | Output |
|---|---|---|
| `CODE` | deterministic checks, regex, file existence, schema, unit tests, tool-call checks, final-state checks | score/label plus machine evidence |
| `JUDGE` | rubric scoring, qualitative file/output review, pairwise comparison, trace critique | score/label plus rationale |
| `HUMAN` | SME review, gold labels, borderline promotion, calibration | score/label plus reviewer note |

All graders should return the same shape:

```json
{
  "grader_id": "action-items-schema",
  "kind": "CODE",
  "version": "sha256:...",
  "case_id": "meeting-notes-action-items",
  "variant": "candidate",
  "label": "pass",
  "score": 1.0,
  "source": "code",
  "trust_tier": "gating",
  "gating_eligible": true,
  "explanation": "Output file exists and validates against schema.",
  "metadata": {},
  "error": null
}
```

For judge and human graders, always record label provenance. Suggested source tiers:

| Source | Use |
|---|---|
| `synthetic` | seed cases, RED tests, exploration; never final promotion gate |
| `judge` | model-based grading; useful for ranking and triage |
| `passive-human` | accepted output or light review; weak promotion signal |
| `deliberate-human` | explicit human grading; strong promotion signal |
| `outcome-derived` | later real-world outcome/reversal/reopen label; strongest gate signal |
| `authored` | hand-authored incident or regression fixture; gate-eligible |

High-stakes promotion should require `gating_eligible: true` rows, usually `deliberate-human`, `outcome-derived`, or `authored`, depending on the risk category.

Add a fourth use pattern, not a separate family:

- **Comparator**: a judge or human grader that compares A/B outputs blind.
- **Analyzer**: unblinds after comparison and proposes improvement direction.

Anthropic Skill Creator’s public structure supports this split: executor, grader, comparator, analyzer.

## Case Types

Support these case types explicitly:

| Case Type | Purpose |
|---|---|
| `quality` | Explicitly invoke a skill/prompt and evaluate resulting output. |
| `trigger` | Natural prompt; measure whether the skill activates or behavior changes. |
| `regression` | Historical case that must continue to pass. |
| `artifact` | Evaluate files or repo state produced by the agent. |
| `trace` | Evaluate how the agent used tools, commands, citations, or process steps. |
| `baseline-lift` | Compare without-context vs with-context or old-skill vs new-skill. |
| `load-faithful` | Reproduce vigilance-under-load failures by burying a trap inside a batch or time-pressure framing. |

`trigger` is skill-specific. Prompt evals may have an analogous "routing" case if the prompt is selected conditionally, but most prompt evals are quality/artifact/baseline-lift cases.

## Suite Schema Direction

Keep suite definitions in `.meta-skill/suites.json`. Do not create one file per case unless the prompt or fixture is genuinely large. Inline short prompts, graders, and expected contracts; reference existing project files by path and hash.

```json
{
  "schema_version": 1,
  "suites": {
    "meeting-notes-v1": {
      "target": {"type": "skill", "name": "meeting-notes", "source_path": "skill"},
      "variants": [
        {"id": "baseline", "kind": "no_skill"},
        {"id": "candidate", "kind": "skill_path", "path": "skill"}
      ],
      "cases": [
        {
          "id": "action-items-from-transcript",
          "type": "artifact",
          "prompt": "Create action items from the transcript in fixtures/transcript.md.",
          "fixtures": [{"path": "fixtures/transcript.md", "sha256": "...", "visible": true}],
          "expected": {"files": ["action-items.md"], "hidden": true},
          "graders": [
            {"id": "file-exists", "kind": "CODE", "check": "exists:action-items.md"},
            {"id": "quality", "kind": "JUDGE", "rubric": "specific owners, dates, and decisions"}
          ]
        }
      ],
      "runner": {"type": "codex_exec", "sandbox": "workspace-write", "timeout_seconds": 1800},
      "promotion": {"primary_metric": "weighted_score", "min_delta": 0.05}
    }
  }
}
```

## Data Capture

Capture run evidence at three levels, but default to summaries and references.

All required fields below should be stored as fields on `ledger.jsonl` records, not as separate files.

### Required For Every Run

- run id
- case id
- variant id
- model
- runner
- sandbox
- skill hash
- fixture hash
- start/end time
- status
- final message/result
- output file manifest
- grader results

### Required For Batch/Experiment Runs

- summarized event counts/status when using `codex exec`
- command/tool status summary
- usage/tokens if available
- diff or file change summary
- failure state and error taxonomy

### Optional Heavy Evidence

- full transcript Markdown
- raw `codex exec` or app-server events
- external trace export
- screenshot/rendered artifacts
- human review notes

Phoenix lesson: event telemetry should be span-shaped conceptually, but Meta Skill should not materialize a Phoenix-like file graph. Keep a compact internal ledger first and export to OpenTelemetry/OpenInference later if useful.

## Promotion Model

Promotion should require a predeclared gate.

Minimal gate:

```text
Promote candidate if:
  candidate primary score > baseline primary score + min_delta
  no required grader regresses
  cost/time stays within budget unless user approves
  human review is complete when required
```

SkillOpt lesson:

- separate target model from optimizer model
- use train/selection/test separation
- accept bounded edits only when held-out selection improves
- keep rejected edits as negative evidence
- preserve success behavior, not only fix failures

AutoResearch lesson:

- constrain mutable surface
- use fixed budgets
- log every experiment
- keep/discard using one clear metric
- use git/worktrees for rollback

Anthropic/Tessl lesson:

- include no-skill and old-skill baselines
- use blind A/B comparison when subjective quality matters
- hide rubric/expected outputs from the solving agent

upskill lesson:

- separate process lessons, scorable judgment labels, and run-health metrics
- keep fast session learnings separate from durable skill changes
- graduate procedural lessons through pressure tests before editing `SKILL.md`
- route recurring scorable judgments to an optimizer corpus, not to ad hoc prose edits
- use trust-tiered label sources so weak labels can seed exploration but not gate high-stakes promotion
- keep an append-only ledger of every optimizer attempt, including rejected or propose-only candidates
- mark generated synthetic cases, expected outputs, rubrics, and optimizer candidates with a `PENDING_REVIEW`-style sentinel until a human or deterministic validation clears them

## Routing UX

Recommended routing:

| User Request | Route |
|---|---|
| "Try this once" | Codex Thread / Worktree trial |
| "Try these 2-3 examples" | Trial set |
| "Does this skill help?" | Batch eval with baseline vs with-skill |
| "Optimize triggering" | Trigger eval suite |
| "Compare two versions" | Experiment with blind comparator |
| "Improve automatically overnight" | Auto-research loop |
| "Make this production-ready" | Doctor review -> eval suite -> promotion gate |

User-facing explanation should stay short:

```text
I can run this at three levels:
1. Trial: one realistic prompt in an isolated thread/worktree.
2. Eval: a batch of cases with structured grading.
3. Experiment: baseline vs candidate comparison with promotion gates.
```

## Source Reports

### Microsoft SkillOpt

Observed:

- SkillOpt treats a compact natural-language skill document as trainable external state.
- Target model/harness stays frozen.
- Separate optimizer model proposes bounded add/delete/replace edits.
- Candidate edits are accepted only when held-out validation improves.
- Rollouts capture messages, tool calls, verifier feedback, task metadata, and final scores.
- It separates success and failure reflection.
- It uses textual learning rate, rejected edit buffer, slow update, and optimizer-side meta skill.
- Public repo structure includes configs, datasets, envs, engine, evaluation gate, optimizer, model backends, prompts, sleep engine, plugins, web UI, and tests.

Implications:

- Adopt the optimization discipline, not the full framework.
- Add bounded edit proposals later.
- Use rejected edits as first-class evidence.
- Keep optimizer memory out of deployed skill text.
- Do not promote from train score; promote from held-out selection.

Risk:

- SkillOpt assumes reliable automatic scoring.
- It is a young research repo; defaults differ from paper in at least slow-update gating.
- Full SkillOpt scale is too heavy for Meta Skill v1.

### Tessl

Observed:

- Tessl evaluates context by comparing without-context vs with-context.
- Codebase evals derive tasks from real commits/PRs.
- Scenarios contain `task.md`, `criteria.json`, and `scenario.json`.
- `task.md` is shown to the agent; rubric/criteria are hidden.
- Criteria are weighted checklists.
- CLI supports multi-agent/model evals, variants, labels, JSON output, compare/list/view/retry.
- Tessl emphasizes context files as software: version, evaluate, distribute, optimize.

Implications:

- Use `task.md` plus hidden `criteria.json`.
- Make baseline-lift first-class.
- Use historical real work as high-value eval source.
- Add scenario quality checks for leakage, duplicate criteria, and free points.

Risk:

- Public runner internals are not available.
- Model defaults in docs/blogs may drift.

### Anthropic Skill Creator

Observed:

- Public Skill Creator has create/eval/improve/benchmark modes.
- It uses agents: executor, grader, comparator, analyzer.
- Eval artifacts include `evals/evals.json`, run directories, `grading.json`, `benchmark.json`, `benchmark.md`, and review feedback.
- Grader reads transcript/output files and verifies assertions.
- Comparator performs blind A/B.
- Analyzer unblinds and proposes concrete improvements.
- Trigger optimization has should-trigger and should-not-trigger prompts, repeated runs, train/test split.

Implications:

- Separate trigger evals from task evals.
- Use blind A/B for subjective artifact quality.
- Preserve transcript review.
- Add reviewer feedback as structured input, not just chat prose.

Risk:

- Public skill docs and product docs are not one single formal spec.
- Claude Code and Claude.ai skill metadata rules differ; keep surface-specific rules explicit.

### Arize Phoenix And Adjacent Observability/Eval Tools

Observed:

- Phoenix models the loop as traces -> datasets -> experiments -> evaluators/annotations -> comparison.
- Datasets are versioned examples with inputs, optional reference outputs, and metadata.
- Experiments run prompts/tasks over dataset examples and attach evaluator annotations.
- Phoenix supports LLM, code, and human annotations/evaluators.
- Phoenix/OTel/OpenInference capture model calls, retrieval, tool use, custom logic, and costs/tokens.
- The repo includes Python server/runtime, REST resources, TS client, CLI, MCP, evals, OTEL packages, and coding-agent skills.

Implications:

- Keep run, span, dataset item, experiment, grader result, and review as separate records.
- Use JSONL records as source of truth; Markdown is a report view.
- Version datasets/cases.
- Later export to OpenTelemetry/OpenInference if useful.

Risk:

- Phoenix-scale infrastructure is too large for Meta Skill core.
- OpenTelemetry GenAI conventions are still evolving; do not bind the internal schema directly to unstable names.

### Codex Exec And App Server

Observed:

- `codex exec` is the simplest automation runner and supports JSONL event output and final structured output.
- App-server exposes rich JSON-RPC thread/turn/item/event APIs and can generate version-specific schemas.
- App-server is better for real multi-turn thread semantics.
- Public and local docs indicate app-server is version-sensitive and partially experimental.
- Skill discovery can be seeded with fixture-local `.agents/skills/<name>/SKILL.md`.

Implications:

- Use `codex exec --json` for v1 batch runner.
- Use Codex Thread / Worktree tools for interactive trials.
- Keep app-server as v2/v3 advanced backend.
- Always record Codex CLI version and runner flags.

Risk:

- `--ephemeral` can remove useful evidence if JSONL is not captured.
- Approval requests are a failure mode for non-interactive evals.
- App-managed worktree APIs are not clearly exposed as stable automation primitives; manual worktree/temp dirs are safer.

### AutoResearch

Observed:

- Minimal repo: `prepare.py`, `train.py`, `program.md`.
- Fixed metric and fixed 5-minute budget.
- Agent only edits `train.py`.
- `prepare.py` is read-only harness/eval truth.
- Results go to untracked `results.tsv`.
- Keep commit if metric improves; reset/discard otherwise.

Implications:

- Meta Skill should constrain mutable surfaces in auto-research loops.
- Fixed budget and fixed grader are more important than framework complexity.
- Keep every attempt in a ledger.
- Use git/worktrees to promote or discard variants.

Risk:

- The agent can read the harness in AutoResearch; for Meta Skill, hidden rubrics and expected outputs should stay hidden.
- Adaptive eval loops can overfit held-out sets; rotate or protect final tests.

### upskill And optimise-skill

Observed from repo clone:

- The repo contains two skills: `upskill/` for skill lifecycle/session learning and `optimise-skill/` for judge-shaped rubric optimization.
- `upskill` has four modes: create, onboard, improve, and retro.
- Onboarding creates `references/learnings.md`, `references/run-journal.md`, and `references/retrospective-checklist.md`.
- `learnings.md` is a PII-free per-skill wiki read at run start. Entries have `status`, `source`, `seen`, `updated`, optional tags, and a short rule/check body.
- `run-journal.md` is the retrospective evidence trail. It is not read every run; it is used when reflecting, investigating recurrence, or deciding whether to retrain.
- Lessons route by type: procedural lessons graduate into `SKILL.md` through a pressure-test/TDD cycle; recurring scorable judgments route to `optimise-skill`.
- `optimise-skill` deliberately tunes only one judge-shaped document at a time against a homogeneous corpus.
- Its contract uses `optimisation/manifest.yaml`, one tunable `rubric.md`, `corpus/{train,val,test}`, `holdout`, optional `guards.py`, optional `scorer.py`, `ledger.md`, and run artifacts.
- The manifest separates optimization method (`optimiser_engine`) from model provider (`model`).
- It uses a markdown corpus row format with `trajectory`, `label`, and opaque consumer fields.
- It has a trust ladder for label sources: synthetic and panel/passive labels are priors; outcome-derived and authored incident fixtures are promotion-grade gate evidence.
- It adds post-gate rails outside the vendored SkillOpt engine: median-of-N margin gate, source guard, incident meta-test, coverage floor, consumer guards, and autonomy map.
- Decision capture records include proposer, challenger, human final disposition, derived label, outcome attribution, source run, change surface, and precedent features.
- Every optimizer run appends to a committed `optimisation/ledger.md`; promoted versions are tracked by git history of the target rubric.
- `run_health` is explicitly monitoring only. Stall/credit/degraded-run signals do not feed the optimizer corpus as labels.

Implications:

- Meta Skill should adopt the signal split:
  - process/procedure lessons -> pressure-tested skill edits
  - scorable judgment labels -> optimizer/eval corpus
  - run-health metrics -> monitoring and scheduling decisions
- Add a `learnings` or `observations` lane to `.meta-skill/` only if it has a graduation path. Raw notes without promotion gates will bloat.
- Use `run-journal` style summaries for trials, but keep the full event transcript as optional heavy evidence.
- Treat "recurrence" as an input to promotion decisions, not as an automatic authorization to mutate skill text.
- Add label-source trust to the grader result schema. Weak labels can train or prioritize review; promotion gates should require trusted labels for high-stakes changes.
- Keep optimizer ledgers append-only. Losing failed attempts loses the evidence needed to avoid retrying bad edits.
- Preserve the narrow optimizer target rule: one tunable text document, one homogeneous decision corpus, one held-out gate.

Risk:

- upskill is Claude-oriented and uses Claude/Claude Code assumptions that should not be copied into the Codex plugin.
- Its project-local `.claude/<skill>-corpus/` convention maps poorly to our desired `.meta-skill/` workbench; use the concept, not the path.
- The self-improvement loop depends on high-quality session trace access. In Codex, that pushes us toward structured trial records and `codex exec --json` capture before heavier app-server integration.
- Automatic retrospectives can launder weak inferred lessons into policy unless status, provenance, and human/promotion gates are explicit.

### EvoSkill

Observed from repo clone and tech report:

- EvoSkill evolves agent programs made of system prompts and skills.
- It has a CLI (`evoskill init`, `run`, `eval`, `skills`, `diff`, `logs`).
- It supports Claude Code, Codex CLI, OpenCode, OpenHands, Goose, Harbor, Docker, and Daytona.
- It creates `.evoskill/config.toml` and `.evoskill/task.md`.
- It has harnesses, agent profiles, task registry, scoring/reward, cache, loop runner, program registry, remote sandboxing, schemas, and tests.
- It uses a frontier of best programs and git branches for program versions.
- Scorers include string/numeric tolerance, LLM judge, script scorer, and Harbor verifier.

Implications:

- Frontier/promotion branch model is useful later.
- Start smaller: one champion and one candidate before top-N frontier.
- Reuse idea of explicit harness abstraction and scorer abstraction.
- Avoid copying multi-agent complexity too early.

Risk:

- EvoSkill optimizes whole agent programs, which is broader than our desired first surface.
- More moving parts increase failure modes and setup burden.

## Recommended Meta Skill Product Shape

### Keep Four Lanes

1. `skill-trial`: one or few cases, worktree/thread, inspectable.
2. `skill-eval`: batch over suite, structured runner and graders.
3. `skill-experiment`: baseline/candidate/champion comparison and promotion.
4. `skill-research`: optional auto-research loop that proposes bounded edits from evidence.

These can be implemented inside `skill-evaluator` over time, but user-facing routing should make the level clear.

Add one internal cross-cutting lane, not necessarily user-facing:

5. `skill-retro`: convert completed trials/evals into observations, recurrence counts, and candidate promotion paths.

This lane should not edit skill source directly. It produces evidence for `skill-doctor`, `skill-writer`, or an optimizer run.

### Keep Three Grader Families

Use:

- code-based graders
- model/judge graders
- human graders

Do not preserve the current two-pillar wording as the main model. It hides too much. The old terms can map as:

- validations = code graders
- evaluations = judge/human graders plus experiment design

### Default To A Compact Ledger

Meta Skill should be useful without a service, but it should not turn every concept into a file. The default persisted surface is:

- one `suites.json`
- one append-only `ledger.jsonl`
- one `report.md`
- optional `artifacts/<sha>` only for large evidence

Everything else is a record type, not a path convention.

### Defer These

- Phoenix/OTel exporter
- direct app-server protocol client
- top-N frontier search
- automatic unbounded skill mutation
- hosted dashboards
- cross-agent support beyond Codex

## Near-Term Implementation Plan

1. Rewrite evaluator docs around the three-file workbench: `suites.json`, `ledger.jsonl`, `report.md`.
2. Add a minimal workbench reference describing record types, not directory trees.
3. Move deterministic runner ownership out of `skill-doctor` wording; make it shared or evaluator-owned conceptually.
4. Add `codex-exec-runner.md` reference with summary capture, optional raw JSONL artifact capture, output schema, fixture seeding, and failure handling.
5. Add `graders.md` reference with CODE/JUDGE/HUMAN/COMPARATOR record contracts.
6. Update `skill-trial-runs.md` to append trial records to `ledger.jsonl` instead of creating trial directories.
7. Add scenario quality checks: leakage, rubric visibility, hidden expected outputs, free-point criteria, duplicate criteria.
8. Later add a small runner script only after docs stabilize.

## Open Decisions

1. Should v1 support prompt targets as first-class alongside skill targets?
   - Recommendation: yes. `target.type = skill | prompt | artifact`.

2. Should fixture files be copied into every run directory or referenced read-only?
   - Recommendation: reference by default with explicit hashes; copy only into the temporary run surface, not into `.meta-skill/`, unless audit mode needs a preserved snapshot.

3. Should hidden expected outputs live beside visible fixtures?
   - Recommendation: yes, but marked `visible_to_agent: false` and never copied into the agent CWD unless the runner can enforce invisibility.

4. Should the batch runner use Codex Threads or `codex exec`?
   - Recommendation: `codex exec` for batch; Codex Thread / Worktree for trials.

5. Should we build a local viewer?
   - Recommendation: not first. Generate one Markdown report. Viewer only if manual review becomes the bottleneck.

6. Should auto-research modify `SKILL.md` directly?
   - Recommendation: no. It should create candidate variants and promotion records first. Parent source edits happen only after explicit user approval or an accepted promotion workflow.

7. Should Meta Skill maintain persistent per-skill learnings like upskill?
   - Recommendation: only as `observation` events in `ledger.jsonl`, not as a separate file or runtime memory layer. Runtime learnings can be useful later, but v1 should avoid another instruction source unless it is promoted through tests or corpus records.

# Meta Skill Evals Research

Research date: 2026-06-08

## Research Scope

This document records source-grounded observations about systems for skill evaluation, skill optimization, agent trial execution, eval orchestration, and agent self-improvement. It is research only. It does not recommend a Meta Skill product shape or implementation plan.

The investigated systems were:

- Microsoft SkillOpt
- Anthropic Skill Creator
- Tessl
- OpenAI Codex Exec and Codex App Server
- EvoSkill
- upskill / optimise-skill
- Arize Phoenix and adjacent observability/eval tools
- Andrej Karpathy AutoResearch

## Sources Inspected

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
- Tessl CLI docs: https://docs.tessl.io/reference/cli-commands
- Anthropic Skill Creator plugin page: https://claude.com/plugins/skill-creator
- Anthropic skills repo: https://github.com/anthropics/skills
- Phoenix run experiments docs: https://arize.com/docs/phoenix/datasets-and-experiments/how-to-experiments/run-experiments
- Phoenix dataset concepts docs: https://arize.com/docs/phoenix/datasets-and-experiments/concepts-datasets
- OpenAI Codex non-interactive docs: https://developers.openai.com/codex/noninteractive
- OpenAI Codex App Server docs: https://developers.openai.com/codex/app-server
- Local Codex CLI help for `codex exec`, `codex app-server`, `codex remote-control`, and `codex exec-server`

Subagent lanes completed:

- SkillOpt
- Tessl
- Anthropic Skill Creator / skills
- Codex App Server / Codex Exec
- AutoResearch
- Phoenix / adjacent eval tooling
- upskill / optimise-skill follow-up

EvoSkill was inspected in the main thread because the subagent limit was reached during the first research pass.

## Microsoft SkillOpt

### Goal

SkillOpt is a text-space optimizer for agent skills. It treats a natural-language skill document as trainable external state for a frozen target agent, analogous to training neural-network weights while leaving the model itself fixed.

### Repository Shape

Observed repository structure includes:

- `configs/`
- `data/`
- `docs/`
- `plugins/`
- `scripts/`
- `skillopt/`
- `skillopt_sleep/`
- `skillopt_webui/`
- `tests/`
- `ckpt/`

The core Python package includes:

- `skillopt/datasets/`
- `skillopt/engine/`
- `skillopt/envs/`
- `skillopt/evaluation/`
- `skillopt/gradient/`
- `skillopt/model/`
- `skillopt/optimizer/`
- `skillopt/prompts/`
- `skillopt/scheduler/`

Built-in environments include SearchQA, SpreadsheetBench, OfficeQA, DocVQA, LiveMathematicianBench, and ALFWorld.

### Optimization Loop

Observed loop:

1. **Rollout**: run the frozen target agent on a training batch with the current skill.
2. **Score**: each rollout returns at least `id`, `hard`, and `soft`, plus task-specific metadata.
3. **Reflect**: analyze failures and successes separately.
4. **Aggregate**: merge failure-derived and success-derived proposed edits.
5. **Select / clip**: choose a bounded number of edits under a textual learning-rate budget.
6. **Update**: apply add/delete/replace/rewrite edits to create a candidate skill.
7. **Evaluate**: run the candidate skill on a held-out selection split.
8. **Gate**: accept only if the candidate beats the current skill on the gate metric.
9. **Track best**: update `best_skill.md` only when the candidate also beats best-so-far.
10. **Final test**: evaluate the best skill on a final held-out test split for reporting.

### Scoring And Gates

Observed scoring fields:

- `hard`: aggregate success/exact/pass score, usually 0 or 1 per item.
- `soft`: partial-credit score, such as F1 or task-specific continuous score.

Observed gate metrics:

- `hard`
- `soft`
- `mixed`, a weighted combination of hard and soft.

The gate compares candidate score against current score. In the observed `evaluate_gate` function:

- candidate score greater than current score -> accepted as current.
- candidate score greater than best score -> accepted as new best.
- otherwise -> rejected.

Observed split mapping:

- train split for rollouts and reflection.
- selection/validation split for accepting or rejecting candidates.
- final test split for held-out reporting.

### Artifacts

Observed output artifacts include:

- `best_skill.md`
- `history.json`
- `runtime_state.json`
- per-step skill versions
- per-step rollout/evaluation directories
- accepted/rejected step records
- checkpoint skills under `ckpt/`

### Stability Mechanisms

Observed mechanisms:

- textual learning-rate budget
- rejected-edit buffer
- separate success and failure reflection
- slow update
- optimizer-side meta skill
- validation/selection gate

### Source Limits And Uncertainty

- SkillOpt is an arXiv preprint from May 2026.
- Some benchmark datasets/splits are not fully present in the repo.
- The repo implementation and the paper diverge in at least one observed slow-update default.
- The approach assumes the presence of reliable automatic scoring or benchmark verifiers.

## Anthropic Skill Creator

### Goal

Anthropic Skill Creator creates, improves, evaluates, benchmarks, and packages skills. It combines authoring workflow, evaluation workflow, benchmark aggregation, blind comparison, and review tooling.

### Repository Shape

Observed `skills/skill-creator/` structure:

- `SKILL.md`
- `agents/`
- `assets/`
- `eval-viewer/`
- `references/`
- `scripts/`

Observed scripts include:

- `run_eval.py`
- `run_loop.py`
- `aggregate_benchmark.py`
- `generate_report.py`
- `improve_description.py`
- `package_skill.py`

Observed agents include:

- grader
- comparator
- analyzer

### Eval Workflow

Observed workflow:

1. Create realistic task prompts.
2. Save eval prompts to `evals/evals.json`.
3. Run the task with the skill.
4. Run a baseline:
   - no skill for new skills.
   - old skill snapshot for skill improvements.
5. Draft assertions while runs execute.
6. Grade each run.
7. Aggregate pass rate, time, tokens, variance, and deltas.
8. Open or generate a review view.
9. Iterate based on quantitative results and human feedback.

### Grader

Observed grader behavior:

- Reads transcript/output files.
- Evaluates assertions as pass/fail.
- Requires evidence for each assertion result.
- Critiques weak assertions.
- Flags assertions that pass trivially, miss important outcomes, or cannot be verified.

Observed `grading.json` fields include assertion text, pass/fail state, evidence, summary, and suggestions.

### Comparator And Analyzer

Observed comparator behavior:

- Performs blind A/B comparison.
- Does not know which output came from which skill.
- Treats assertion pass rate as secondary to output quality.

Observed analyzer behavior:

- Unblinds after comparison.
- Reads skills, transcripts, and comparator output.
- Explains why one version won.
- Produces concrete improvement suggestions.

### Trigger Optimization

Observed trigger optimization:

- Generates should-trigger and should-not-trigger prompts.
- Runs repeated trials.
- Uses train/test split.
- Calls a model to propose better skill descriptions.
- Selects descriptions by held-out test performance.

### Artifacts

Observed artifacts include:

- `evals/evals.json`
- iteration directories
- per-eval directories
- `with_skill/`, `without_skill/`, and `old_skill/` outputs
- `eval_metadata.json`
- `timing.json`
- `grading.json`
- `benchmark.json`
- `benchmark.md`
- review feedback JSON

### Source Limits And Uncertainty

- Public docs and the public `skill-creator` skill are not a single formal spec.
- Claude Code, Claude.ai, and API skill surfaces have different packaging and metadata expectations.
- The public skill-creator implementation may not exactly reflect Anthropic internal release gates.

## Tessl

### Goal

Tessl packages, distributes, evaluates, and manages reusable agent context. Public docs emphasize skills, documentation, rules, tiles, registry distribution, and codebase/task evals.

### Eval Shape

Observed codebase eval model:

- Derives tasks from real commits or PRs.
- Creates a scenario with `task.md`, `criteria.json`, and `scenario.json`.
- Shows `task.md` to the agent.
- Keeps `criteria.json` hidden from the agent.
- Compares variants, especially without-context vs with-context.

Observed criteria:

- Weighted checklist items.
- Criteria categories include intent, design, must-not, minimality, reuse, integration, and edge cases.

### CLI Shape

Observed CLI areas:

- `tessl init`
- `tessl install`
- `tessl list`
- `tessl update`
- `tessl search`
- `tessl skill new`
- `tessl skill import`
- `tessl skill lint`
- `tessl skill publish`
- `tessl skill review`
- `tessl tile new`
- `tessl tile lint`
- `tessl tile pack`
- `tessl tile info`

Observed CLI features:

- `--json` output on many commands.
- agent targeting flags.
- local and registry sources.
- install/update/list workflow.
- publish workflow.
- skill review and optimization flags.
- eval scenario publishing.

### Artifacts

Observed artifact patterns:

- `evals/<scenario>/task.md`
- `evals/<scenario>/criteria.json`
- `evals/<scenario>/scenario.json`
- `tessl.json`
- `.tessl/tiles/<workspace>/<tile>/`

### Source Limits And Uncertainty

- Public runner internals are not available.
- Public docs and blog posts differ on some defaults.
- The without-context/with-context premise is specific to Tessl’s context-distribution product framing.

## Codex Exec And App Server

### Codex Exec Goal

`codex exec` is the non-interactive runner for scripted or CI-like Codex tasks.

### Codex Exec Event Logging

Observed `codex exec --json` behavior from docs:

- stdout becomes a JSONL stream.
- Event types include:
  - `thread.started`
  - `turn.started`
  - `turn.completed`
  - `turn.failed`
  - `item.*`
  - `error`
- Item types include:
  - agent messages
  - reasoning
  - command executions
  - file changes
  - MCP tool calls
  - web searches
  - plan updates
- `turn.completed` includes usage fields such as input tokens, cached input tokens, output tokens, and reasoning output tokens.

Observed `codex exec` options from local CLI/docs:

- `--json`
- `--output-schema`
- `--output-last-message`
- `--ephemeral`
- `-C <DIR>`
- `--add-dir <DIR>`
- `--sandbox <MODE>`
- `--model <MODEL>`
- `--ignore-user-config`
- `--ignore-rules`

### Codex App Server Goal

Codex App Server is the protocol used by rich Codex clients, such as editor integrations. It is a JSON-RPC-style local protocol for deep product integration.

### Codex App Server Event Logging

Observed App Server capabilities:

- threads
- turns
- items
- streamed deltas
- authentication
- conversation history
- approvals
- command execution
- filesystem APIs
- skill/plugin APIs
- rollback
- logs

Observed notifications include:

- `thread/started`
- `thread/archived`
- `thread/unarchived`
- `thread/closed`
- `thread/status/changed`
- `turn/started`
- `turn/completed`
- `turn/diff/updated`
- `item/started`
- `item/completed`
- `serverRequest/resolved`

Observed `turn/completed` statuses:

- `completed`
- `interrupted`
- `failed`

Failures can carry structured error details.

Observed item types include:

- user messages
- agent messages
- plans
- reasoning
- command executions
- file changes
- MCP tool calls
- dynamic tool calls
- collaboration tool calls
- web searches
- image views
- review items
- context compaction

### Exec vs App Server Detail Level

Observed difference:

- Codex Exec exposes a script-friendly JSONL stream and final structured output.
- App Server exposes a richer client protocol with thread lifecycle, multi-turn state, approvals, rollback, streaming deltas, and detailed item lifecycle.
- App Server documentation states that SDK/non-interactive mode is preferred for automation jobs and CI, while App Server is for deep product integration.

### Source Limits And Uncertainty

- App Server protocol is version-sensitive.
- WebSocket transport is documented as experimental/unsupported.
- Codex-managed worktree automation is documented in the Codex app, but stable public automation methods for app-managed worktree creation were not confirmed in the inspected App Server docs.

## Arize Phoenix And Adjacent Observability/Eval Tools

### Goal

Phoenix and adjacent tools model LLM application quality as traces, datasets, experiments, evaluator annotations, human annotations, and comparisons.

### Phoenix Data Model

Observed Phoenix concepts:

- Project
- Trace
- Span
- SpanAnnotation
- TraceAnnotation
- Dataset
- DatasetVersion
- DatasetExample
- DatasetExampleRevision
- DatasetSplit
- Experiment
- ExperimentRun
- ExperimentRunAnnotation

### Workflow

Observed workflow:

1. Capture traces.
2. Create or version datasets from examples.
3. Run experiments over dataset examples.
4. Attach evaluator annotations.
5. Attach human annotations where applicable.
6. Compare experiment runs.
7. Inspect traces for failures.

### Evaluator And Annotation Shape

Observed evaluator/annotation fields:

- label
- score
- explanation
- metadata
- annotator kind (`LLM`, `CODE`, `HUMAN`)
- timing
- evaluator trace id

Adjacent tools inspected or summarized in the research lane include Langfuse, Opik, Braintrust, and MLflow. The shared pattern is dataset/run/evaluator/trace separation.

### Source Limits And Uncertainty

- OpenTelemetry GenAI conventions are still evolving.
- Phoenix-scale infrastructure is larger than a local file-only workflow.
- Exact export/report formats were less explicit than the trace/dataset/experiment model.

## AutoResearch

### Goal

Karpathy’s AutoResearch is a minimal autonomous experimentation loop for improving an ML training script under a fixed evaluator.

### Repository Shape

Observed root files:

- `README.md`
- `prepare.py`
- `train.py`
- `program.md`
- `analysis.ipynb`
- `pyproject.toml`
- `uv.lock`

README describes three core files:

- `prepare.py`: fixed prep/eval utilities.
- `train.py`: editable training loop.
- `program.md`: agent instructions.

### Loop

Observed loop:

1. Create a fresh branch.
2. Read the fixed harness and editable training script.
3. Run baseline.
4. Modify only `train.py`.
5. Commit candidate.
6. Run training under a fixed time budget.
7. Extract validation metric.
8. Log result in `results.tsv`.
9. Keep commit if metric improves.
10. Reset/discard if metric does not improve or crashes.

### Scoring

Observed primary metric:

- `val_bpb`, validation bits per byte.

Observed constraints:

- fixed 5-minute budget
- same platform comparisons
- crash as first-class outcome
- result ledger in `results.tsv`

### Source Limits And Uncertainty

- The loop exposes the evaluation harness to the agent.
- Results are platform-dependent.
- Repeated adaptive evaluation can overfit available evaluation sets.

## upskill And optimise-skill

### Goal

`upskill` is a skill lifecycle and session-learning system. `optimise-skill` is a narrower optimizer for judge-shaped rubrics.

### upskill Flow

Observed modes:

- create
- onboard
- improve
- retro

Observed artifact model:

- `SKILL.md`
- `references/learnings.md`
- `references/run-journal.md`
- `references/retrospective-checklist.md`
- pressure tests
- project-local decision corpus
- project-wide learnings

Observed learning lifecycle:

- `proposed`
- `active`
- `retired`

Observed source types:

- `operator-correction`
- `skill-inferred`
- `positive-pattern`

### Signal Split

Observed split:

- Procedures: recurring procedural corrections graduate into `SKILL.md` through pressure tests.
- Judgments: recurring scorable decisions graduate into `optimise-skill`.
- Run health: aggregate metrics remain monitoring signals.

### optimise-skill Shape

Observed optimizer scope:

- one judge-shaped document
- one homogeneous corpus
- held-out score improvement
- adversarial gates

Observed directory contract:

- `optimisation/manifest.yaml`
- `optimisation/rubric.md`
- `optimisation/corpus/{train,val,test}/`
- `optimisation/holdout/`
- optional `optimisation/guards.py`
- optional `optimisation/scorer.py`
- `optimisation/ledger.md`
- `optimisation/runs/`

Observed manifest concepts:

- `schema_version`
- `target`
- `optimiser_engine`
- `model`
- `objective`
- `budget`
- `promotion`
- `autonomy`
- `guards`
- `scorer`

Observed corpus row format:

- Markdown row.
- `trajectory`
- `label`
- opaque pass-through fields.

Observed label sources:

- synthetic
- moe-panel
- passive-batch-approval
- deliberate-human
- human-override
- outcome-derived
- authored

Observed gates/rails:

- median-of-N margin gate
- trust-stratified split
- high-stakes source guard
- incident meta-test
- coverage floor
- consumer guards
- pending-review sentinels

Observed decision-capture fields:

- proposer disposition
- challenger disposition
- human final disposition
- derived label
- outcome attribution
- source run
- change surface
- precedent features

### Source Limits And Uncertainty

- The repo is Claude-oriented.
- Several examples are dogfood/anecdotal.
- The inspected `optimise-skill` path vendors SkillOpt but wraps it with local rails.

## EvoSkill

### Goal

EvoSkill is an automated framework for discovering and synthesizing reusable agent skills from failed trajectories. It optimizes agent programs made of system prompts and skills.

### Repository / CLI Shape

Observed commands:

- `evoskill init`
- `evoskill run`
- `evoskill eval`
- `evoskill skills`
- `evoskill diff`
- `evoskill logs`
- `evoskill remote status`
- `evoskill remote logs`
- `evoskill remote download`
- `evoskill remote stop`

Observed config/artifacts:

- `.evoskill/config.toml`
- `.evoskill/task.md`
- git branches prefixed with `program/`
- frontier tags
- feedback log

Observed supported execution surfaces:

- Claude Code
- Codex CLI
- OpenCode
- OpenHands
- Goose
- Harbor
- Docker
- Daytona

### Self-Improvement Loop

Observed five stages:

1. **Base Agent**: attempts benchmark questions using current best program.
2. **Proposer**: analyzes failures and proposes skill or prompt changes.
3. **Generator**: creates skill files or rewrites system prompt.
4. **Evaluator**: scores the new program variant on held-out validation.
5. **Frontier**: tracks top-N performing programs as git branches.

### Scorers

Observed scorer types include:

- exact/string matching
- numeric tolerance
- LLM judge
- script scorer
- Harbor verifier

### Source Limits And Uncertainty

- EvoSkill optimizes whole agent programs, not only one skill document.
- Frontier and remote sandbox features add implementation complexity.
- Full internals were inspected from repo/docs, not run end-to-end.

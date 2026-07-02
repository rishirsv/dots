---
name: skill-writer
description: "Use when creating a reusable agent skill from an idea, repeated workflow, example output, Codex thread, or source material. Designs the trigger contract, runtime guidance, resources, metadata, and validation handoff. Not for improving, diagnosing, or evaluating an existing skill, or for installing, publishing, or syncing skills."
---

# Skill Writer

Create practical, reusable skills. Build the portable runtime payload rooted at
the skill directory:

```text
SKILL.md
agents/          recommended
references/      optional
scripts/         optional
assets/          optional
resources/       optional
examples/        optional when examples are runtime material
.<skill-name>/   optional private workbench, excluded from packages
```

Treat this list as a menu, not scaffolding. Create a folder only when the skill
has files to put in it.

This skill owns new-skill authoring. Route existing-skill fixes to
`skill-doctor`, measurement to `skill-evaluator`, and lifecycle orchestration to
`meta-skill`.

Write the skill around the work the agent will perform. Start from the job, the
natural language a user would use, and the smallest behavior that changes the
agent's next action. Keep authoring categories, evidence plans, gates, workbench
choices, and other design bookkeeping private unless they directly change
runtime behavior.

## Reference Map

Read only what the task needs:

| Need | Read |
|---|---|
| Decide what a skill is, whether the idea is skill-shaped, and what artifact should be created if it is not a skill | [skill-shape.md](references/skill-shape.md) |
| Distill source packs, example input/output pairs, transcripts plus notes, or prior artifacts into reusable skill rules | [source-distillation.md](references/source-distillation.md) |
| Decide whether the workflow should become a skill; classify the skill type, invocation posture, information hierarchy, evidence plan, runtime body, completion criteria, pruning pass, evidence boundaries, and voice | [skill-design.md](references/skill-design.md) |
| Capture an active or prior Codex thread/session into a durable skill | [session-capture.md](references/session-capture.md) |
| Add compact runtime snippets after the design decision is clear | [cookbook.md](references/cookbook.md) |
| Apply the shared skill-quality standard before finalizing a non-trivial skill | [judge-rubric.md](../../references/judge-rubric.md) |
| Keep source evidence, prompt text, research, and maintainer notes out of portable runtime | [payload-hygiene.md](../../references/payload-hygiene.md) |
| Use the central Meta Skill CLI for validate, package, workbench, eval, progress, and runner workflows | [cli.md](../../references/cli.md) |
| Understand UI metadata fields when authoring `agents/openai.yaml` | [openai_yaml.md](references/openai_yaml.md) |
| Run a trial of a draft skill in an isolated Codex thread or worktree | [skill-trial-runs.md](../../references/skill-trial-runs.md) |

Treat [skill-design.md](references/skill-design.md) as the governing principle guide. Treat
[cookbook.md](references/cookbook.md) as a recipe lookup, not a template to copy
wholesale.
Use [payload-hygiene.md](../../references/payload-hygiene.md) whenever source
material, research, transcripts, prompt text, or user corrections shape runtime
guidance. Use [judge-rubric.md](../../references/judge-rubric.md) as the shared
quality standard before finalizing non-trivial skills; do not produce a scored
Judge review unless the user asks for review evidence.
Use [cli.md](../../references/cli.md) for the plugin command surface. Worker
skills use that shared command surface.

## Workflow

### 1. Interview

Start from existing context: the conversation, provided files, comparable skills,
Codex thread/session evidence, and any source material. For a request to capture
the current or prior thread into a skill, read
[session-capture.md](references/session-capture.md). Ask only for missing
decisions that change routing, runtime behavior, resources, or approval gates.
For source packs, example input/output pairs, transcripts plus notes, prior
artifacts, or other source-derived skill requests, read
[source-distillation.md](references/source-distillation.md) before drafting.
When the request is still an idea rather than a settled skill, read
[skill-shape.md](references/skill-shape.md) before drafting.

Resolve these working answers before scaffolding. They are authoring notes, not
the runtime voice. Answers may come from the conversation, a captured session,
source material, comparable skills, repo conventions, or a question:

| Field | Required answer |
|---|---|
| Job | The one recurring job the skill does, not what happened once. |
| Trigger | Real user language that should fire the skill, plus the nearest `not for` boundary. |
| Inputs and output | What the skill consumes and the expected output shape or artifact. |
| Invariants and failure shields | What the skill should preserve, prevent, or flag; include common mistakes and user corrections. |
| Instruction shape | Whether the work is judgment prose, fixed-shape output, script-backed, or a strict sequence. |
| Skill category | Primary type from [skill-design.md](references/skill-design.md); narrow or split if the draft straddles categories. |
| Evidence plan | Capability uplift, encoded preference, or hybrid; include the baseline, but create `.<skill-name>/evals.json` only when eval seeds or evaluator handoff are in scope. |
| Gates | Approvals required before external writes, destructive actions, publishing, sending, install/sync, or final client-facing delivery. |
| Workbench plan | Portable-only, or project mode with a hidden `.<skill-name>/` workbench for docs, fixtures, package artifacts, and team reuse material. |

Fill every answer from context first. Resolve answers before asking by mining
the current conversation, provided files, source packs, user corrections,
session-capture output, comparable skills, and the skill type in
[skill-design.md](references/skill-design.md). Ask only for decisions that change routing,
runtime behavior, resources, approval gates, or workbench setup.

When a question is needed, ask in one screen with numbered questions, lettered
options, a recommended default, and a `defaults` fast path:

```md
Skill setup - a couple of quick decisions before I scaffold.

1. When should it trigger?
a) <real user phrasing inferred from context> (recommended)
b) <broader alternative>
c) Not sure - use default

2. Set up a workbench?
a) Portable-only, no workbench (recommended)
b) Hidden `.<skill-name>/` workbench for authoring docs, fixtures, and package output
c) Not sure - use default

Reply with: `defaults`, or a compact answer like `1a 2b`.
```

Always recommend an answer. Use tight choices when they would resolve ambiguity
faster than open-ended questions. If a required answer is thin but not
blocking, record the best defensible default and mark the uncertainty in
`Still open`.

Reflect the settled shape as a compact authoring note before editing. Do not
paste the outline into `SKILL.md` as runtime content. Use it to make decisions,
then write the skill body in natural, outcome-first prose:

```md
Authoring note
- Job: turn recurring product research threads into concise decision briefs.
- Trigger (+ not for): "turn this research thread into a decision memo"; not for raw transcript archiving.
- Inputs and output: notes, links, or transcript excerpts -> brief with decision, evidence, tradeoffs, and open questions.
- Invariants and failure shields: separate evidence from judgment; do not invent consensus; flag unresolved disagreement.
- Instruction shape: judgment prose with a compact output check.
- Skill category: business process or team automation.
- Evidence plan: encoded preference; examples are enough unless the user wants measured comparisons.
- Evaluation handoff: none by default; add realistic prompts only when the user asks for evaluator handoff.
- Gates: approval before publishing or sending outside the chat.
- Workbench plan: portable-only unless reusable examples or research notes should be preserved.
- Still open: none.
```

Before scaffolding, pressure-check the trigger by naming one should-trigger
prompt, one should-not-trigger prompt, and the nearest near miss. If eval
material is in scope, keep those prompts as evaluation handoff entries when the
skill is non-trivial or trigger risk is material.
Use [skill-design.md](references/skill-design.md) for trigger-contract quality.

The interview self-bypasses when context is complete, the user says "just build
it" or "no questions," or the idea is not skill-shaped. Skipping changes the
clarification budget, not the quality budget: the authoring note still needs a
real job sentence, trigger contract, and output shape before runtime drafting.

### 2. Design

Build a skill only when reusable runtime guidance would change future agent
behavior. Use [skill-shape.md](references/skill-shape.md) to distinguish skills
from one-off answers, project docs, memory, utilities, validators, apps, or
managed agent systems; route to the better artifact when the idea is not
skill-shaped.

Before choosing folders, evals, or helper files, write the opening contract in
plain language: what the skill helps the agent do, what good output looks like,
what must stay private or avoided, and where the work stops. If that contract
cannot be written cleanly, the design is not ready.

Use [skill-design.md](references/skill-design.md) to decide:

- the recurring job and ownership boundary
- the skill type, evidence plan, and resource/test shape it implies
- invocation posture: model-discoverable by default, or explicit-only when the user should be the index
- frontmatter name and description
- structure and steering choices from [skill-design.md](references/skill-design.md)
- runtime body shape and section names
- instruction strength: prose, checklist, template, script, or strict sequence
- information hierarchy: what must stay in `SKILL.md`, what belongs behind a context pointer, and what should stay out of runtime
- setup, config, state, and memory requirements
- evaluation handoff for realistic prompts, expected outputs, objective checks, grader hints, and baseline comparison
- input and evidence boundaries
- failure handling, approval gates, output shape, checkable completion criteria, final checks, and pruning pass

Use [cookbook.md](references/cookbook.md) only after the design decision is
clear. Pick the smallest pattern card that changes runtime behavior.

### 3. Build

Create or edit the source skill files directly. Prefer a lean `SKILL.md` with
linked references over an overstuffed body.

When creating a new skill, create the target directory and runtime files
directly. Resolve relative `<skill-dir>` from the user's current working
directory. The portable payload is the project root: `<skill-dir>/SKILL.md`,
`agents/`, and any runtime folders the design actually needs. If the user wants
workbench-backed evaluation or packaging state, run
`<meta-skill-root>/scripts/metaskill workbench init --target <skill-dir>` after the payload
exists.

In project mode, keep non-runtime authoring material under `.<skill-name>/`.
Use `.<skill-name>/AGENTS.md` to document how agents should use the hidden
folder and to record skill-specific invariants or update guidance. Use
`.<skill-name>/docs/` for durable specs, roadmap files, decisions, research
reports, and review context. Put temporary plans wherever the surrounding repo
keeps plans. Use `.<skill-name>/tests/` as a flat folder for test fixtures or
check inputs only when the user provides or approves concrete test material.
Create optional folders only when writing their first real file; blank
`docs/`, `tests/`, `cases/`, `benchmarks/`, or nested test-category folders
should never exist.

When the user asks for eval seeds, workbench eval material, or evaluator
handoff, create one `.<skill-name>/evals.json` suite manifest. Keep evaluator
handoff material there rather than in a top-level `evals/` folder. The
writer-authored manifest should contain `skill_name`, realistic `cases[]`
with `task.prompt` or `task.path`, `type`, expectations, optional
files/fixtures, and grader hints. Limit
it to authored task material; run status, grades, and evidence belong to later
evaluation runs.

For judgment-heavy, writing, planning, style, review, or product-guidance skills,
do not add eval machinery just to look rigorous. Start with realistic examples,
plain success criteria, and the simplest runtime guidance that would improve the
next run. Escalate to `skill-evaluator` only when the user wants measured
candidate evidence or the risk justifies a durable suite.

Follow these payload rules:

- Keep build notes, raw source examples, review notes, evaluation handoff
  drafts, benchmark material, and rejected options out of the portable payload.
- Put runtime references in `references/`, one level deep. Link every reference
  directly from `SKILL.md`, and make the link wording say when to read it. A
  weak pointer to necessary material is a behavior bug; sharpen the condition
  before inlining the whole file.
- Put scripts in `scripts/` only when deterministic code is safer or cheaper
  than prose. Link every script directly from `SKILL.md`, state when to run it,
  what inputs it accepts, what output means, and what nonzero exit means.
- Put assets in `assets/` only for approved reusable runtime materials such as
  templates, schemas, starter files, icons, or boilerplate.
- Use `resources/`, `examples/`, or another folder only when the runtime skill
  needs that material. Link it directly from `SKILL.md`, name when to read or use
  it, and keep source-specific or build-only material in `.<skill-name>/docs/`
  unless the skill is intentionally organization-specific.
- Include `agents/openai.yaml` for generated skills when the surrounding runtime
  expects UI metadata. Keep `display_name`, `short_description`, and
  `default_prompt` user-facing; `default_prompt` should mention
  `$<skill-name>`. Use double-quoted YAML string values, unquoted keys, and
  unquoted booleans. Read [openai_yaml.md](references/openai_yaml.md) before
  generating optional metadata fields.
- Add human gates before external writes, destructive edits, packaging,
  installing, syncing, publishing, posting, sending, submitting, or final
  client-facing delivery.

Generalize source material into reusable behavior. Copy user prompts, model
names, provider docs, raw research links, author provenance, thread IDs, one-off
file paths, or local build notes into runtime only when they are direct runtime
dependencies.
Before promoting any source-derived rule into runtime, apply
[payload-hygiene.md](../../references/payload-hygiene.md): preserve the reusable
operating rule, and move source provenance, rejected alternatives, prompt-role
language, local paths, and design-history notes to `.<skill-name>/docs/` or the
review handoff.

When the intake requires research, prefer a bounded research pass before
runtime drafting. Use an available researcher sub-agent or research-oriented
skill when the environment provides one and the research can run independently;
otherwise do the smallest reliable source review yourself. Save concise
  research reports in `.<skill-name>/docs/` for project-mode skills; nest under
  `docs/research/` only when the research volume needs it. Copy only the
  operational conclusions into runtime guidance.

### 4. Validate And Stop

Review changed skill files directly. Check that linked references, scripts, and
assets exist. Re-read the runtime for single source of truth, no-op lines,
stale sediment, duplicated branches, and missing completion criteria. Run any
deterministic tests already available for the skill or its authoring repo.
For non-trivial skills, run a final payload hygiene and placement check from
[payload-hygiene.md](../../references/payload-hygiene.md) before reporting the
skill as done. Treat structural validation as necessary but not sufficient for
semantic quality.

For standalone portable skill folders, run
`<meta-skill-root>/scripts/metaskill validate <path-to-skill-folder>`. For script resources added during
authoring, run a smoke test or representative sample and report any untested
scripts.

If the user asks for one-off testing, or if one realistic isolated run would
materially improve confidence in a fragile trigger, resource, script, or output
contract, read
[skill-trial-runs.md](../../references/skill-trial-runs.md) and offer a skill
one-off check. It is optional by default and is not release proof; route systematic
multi-scenario measurement to `skill-evaluator` and recurring release or
quality scorecards to `skill-benchmarker`. For the evaluator handoff, provide
or create `.<skill-name>/evals.json` with 2-3 realistic user tasks, expected
outcomes or reference solutions, known failure or near-miss examples, grader
hints, and any must-not-break constraints so the evaluator can compare outcomes
across no-skill, current-skill, and edited-skill candidates.

Stop before packaging, installing, publishing, syncing, external writes, or
final delivery unless the user explicitly approved that specific action. Repo
instructions may identify the command to use after approval; user approval
authorizes the action. If packaging or sync appears needed, report it as a
follow-up and route lifecycle or release work through `meta-skill` or the
appropriate specialist lane. When packaging is approved, use
`<meta-skill-root>/scripts/metaskill package <skill-dir>`; it exports only the
portable payload from the project root and excludes `.<skill-name>/`. In the
final handoff, explain the
evaluation handoff as authoring material, not runtime instructions. It becomes
evidence only after a run, grades, comparison, and report exist.

## Output

Close with the skill path, what was created or changed, validation run or
skipped, and anything still open. Keep the report short.

---
name: skill-writer
description: "Use when creating a reusable agent skill from an idea, repeated workflow, example output, Codex thread, or source material. Designs the trigger contract, runtime guidance, resources, metadata, and validation handoff. Not for improving, diagnosing, or evaluating an existing skill, or for packaging, installing, publishing, or syncing skills."
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

## Reference Map

Read only what the task needs:

| Need | Read |
|---|---|
| Decide what a skill is, whether the idea is skill-shaped, and what artifact should be created if it is not a skill | [skill-shape.md](references/skill-shape.md) |
| Distill source packs, example input/output pairs, transcripts plus notes, or prior artifacts into reusable skill rules | [source-distillation.md](references/source-distillation.md) |
| Decide whether the workflow should become a skill; classify the skill type, invocation posture, information hierarchy, evaluation posture, runtime body, completion criteria, pruning pass, evidence boundaries, and voice | [design.md](references/design.md) |
| Capture an active or prior Codex thread/session into a durable skill | [session-capture.md](references/session-capture.md) |
| Add compact runtime snippets after the design decision is clear | [cookbook.md](references/cookbook.md) |
| Use the central Meta Skill CLI for validate, package, workbench, eval, progress, and runner workflows | [cli.md](../../references/cli.md) |
| Understand OpenAI/Codex UI metadata fields when authoring `agents/openai.yaml` | [openai_yaml.md](references/openai_yaml.md) |
| Run a trial of a draft skill in an isolated Codex thread or worktree | [skill-trial-runs.md](../../references/skill-trial-runs.md) |

Treat [design.md](references/design.md) as the governing principle guide. Treat
[cookbook.md](references/cookbook.md) as a recipe lookup, not a template to copy
wholesale.
Use [cli.md](../../references/cli.md) for the plugin command surface. Worker
skills do not expose local script interfaces.

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

Complete this answer-set before scaffolding. Answers may come from the
conversation, a captured session, source material, comparable skills, repo
conventions, or a question:

| Field | Required answer |
|---|---|
| Job | The one recurring job the skill does, not what happened once. |
| Trigger | Real user language that should fire the skill, plus the nearest `not for` boundary. |
| Inputs and output | What the skill consumes and the expected output shape or artifact. |
| Invariants and failure shields | What the skill should preserve, prevent, or flag; include common mistakes and user corrections. |
| Fragility | Whether the work is judgment prose, fixed-shape output, script-backed, or a strict sequence. |
| Skill category | Primary type from [design.md](references/design.md); narrow or split if the draft straddles categories. |
| Evaluation posture | Capability uplift, encoded preference, or hybrid; include the baseline and create `.<skill-name>/evals.json` when the user asks for eval seeds or project-mode eval material. |
| Gates | Approvals required before external writes, destructive actions, publishing, sending, install/sync, or final client-facing delivery. |
| Project mode | Portable-only, or project mode with a hidden `.<skill-name>/` workbench for docs, fixtures, package artifacts, and team reuse material. |

Fill every answer from context first. Resolve answers before asking by mining
the current conversation, provided files, source packs, user corrections,
session-capture output, comparable skills, and the skill type in
[design.md](references/design.md). Ask only for decisions that change routing,
runtime behavior, resources, approval gates, or project mode.

When a question is needed, ask in one screen with numbered questions, lettered
options, a recommended default, and a `defaults` fast path:

```md
Skill outline - a couple of quick decisions before I scaffold.

1. When should it trigger?
a) <real user phrasing inferred from context> (recommended)
b) <broader alternative>
c) Not sure - use default

2. Set up a workbench?
a) Portable-only, no workbench (recommended)
b) Project mode with a hidden `.<skill-name>/` workbench for authoring docs, fixtures, and package output
c) Not sure - use default

Reply with: `defaults`, or a compact answer like `1a 2b`.
```

Always recommend an answer. Do not ask open-ended questions when tight choices
would resolve the ambiguity faster. If a required answer is thin but not
blocking, record the best defensible default and mark the uncertainty in
`Still open`.

Reflect the settled shape as a compact **Draft Skill Outline** before editing.
When scaffolding a new skill, put this outline in `SKILL.md` itself, then
iterate it into final runtime guidance:

```md
Draft Skill Outline
- Job: extract tables from supplier PDFs into one normalized CSV.
- Trigger (+ not for): "pull the line items out of these invoices"; not for summarizing PDF prose.
- Inputs and output: a folder of PDFs -> one CSV with validated columns.
- Invariants and failure shields: never invent missing values; flag pages that fail to parse.
- Fragility: deterministic, script-backed extraction and validation.
- Skill category: product verification.
- Evaluation posture: capability uplift; baseline is no skill.
- Eval manifest: `.<skill-name>/evals.json` with a positive invoice-line-item prompt, near miss about summarizing invoice prose, and checks for required CSV columns, flagged parse failures, and no invented values.
- Gates: none; portable-only.
- Project mode: portable-only.
- Still open: none.
```

Before scaffolding, pressure-check the trigger by naming one should-trigger
prompt, one should-not-trigger prompt, and the nearest near miss. If eval
material is in scope, keep those prompts as eval manifest entries when the skill
is non-trivial or trigger risk is material.
Use [design.md](references/design.md) for trigger-contract quality.

The interview self-bypasses when context is complete, the user says "just build
it" or "no questions," or the idea is not skill-shaped. Skipping changes the
clarification budget, not the quality budget: the draft outline still needs a
real job sentence, trigger contract, and output shape before runtime drafting.

### 2. Design

Build a skill only when reusable runtime guidance would change future agent
behavior. Use [skill-shape.md](references/skill-shape.md) to distinguish skills
from one-off answers, project docs, memory, utilities, validators, apps, or
managed agent systems; route to the better artifact when the idea is not
skill-shaped.

Use [design.md](references/design.md) to decide:

- the recurring job and ownership boundary
- the skill type, evaluation posture, and resource/test shape it implies
- invocation posture: model-discoverable by default, or explicit-only when the user should be the index
- frontmatter name and description
- runtime body shape and section names
- instruction strength: prose, checklist, template, script, or strict sequence
- information hierarchy: what must stay in `SKILL.md`, what belongs behind a context pointer, and what should stay out of runtime
- setup, config, state, and memory requirements
- eval manifest handoff for realistic prompts, expected outputs, objective checks, grader hints, and baseline comparison
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
project-mode evaluation or packaging state, run
`<meta-skill-root>/scripts/metaskill workbench init --target <skill-dir>` after the payload
exists.

In project mode, keep non-runtime authoring material under `.<skill-name>/`.
Use `.<skill-name>/docs/` for durable authoring notes, decisions, research
reports, and review context. Put temporary plans wherever the surrounding repo
keeps plans. Use `.<skill-name>/tests/` as a flat folder for test fixtures or
check inputs only when the user provides or approves concrete test material.
Create optional folders only when they will contain files; a blank
`.<skill-name>/tests/`, `/tests`, or nested test-category folder should never
exist.

When the user asks for eval seeds, project-mode eval material, or evaluator
handoff, create one `.<skill-name>/evals.json` prompt manifest. Do not create a
top-level `evals/` folder. The writer-authored manifest should contain
`skill_name`, realistic `evals[]` prompts, `type`, expectations, optional
files/fixtures, and grader hints. Include no run status, grades, or evidence.

Follow these payload rules:

- Keep build notes, raw source examples, review notes, eval manifest drafts, benchmark material, and
  rejected options out of the portable payload.
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
  `$<skill-name>`. Read [openai_yaml.md](references/openai_yaml.md) before
  generating optional metadata fields.
- Add human gates before external writes, destructive edits, packaging,
  installing, syncing, publishing, posting, sending, submitting, or final
  client-facing delivery.

Generalize source material into reusable behavior. Do not copy user prompts,
model names, provider docs, raw research links, author provenance, thread IDs,
one-off file paths, or local build notes into runtime unless they are direct
runtime dependencies.

When the intake requires research, prefer a bounded research pass before
runtime drafting. Use an available researcher sub-agent or research-oriented
skill when the environment provides one and the research can run independently;
otherwise do the smallest reliable source review yourself. Save concise
research reports in `.<skill-name>/docs/` for project-mode skills, using a
`-research.md` suffix when the docs folder is otherwise just research, and copy
only the operational conclusions into runtime guidance.

### 4. Validate And Stop

Review changed skill files directly. Check that linked references, scripts, and
assets exist. Re-read the runtime for single source of truth, no-op lines,
stale sediment, duplicated branches, and missing completion criteria. Run any
deterministic tests already available for the skill or its authoring repo.

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
instructions may identify the command to use after approval, but they do not
authorize the action by themselves. If packaging or sync appears needed, report
it as a follow-up and route lifecycle or release work through `meta-skill` or
the appropriate specialist lane. When packaging is approved, use
`<meta-skill-root>/scripts/metaskill package <skill-dir>`; it exports only the
portable payload from the project root and excludes `.<skill-name>/`. In the
final handoff, explain the
eval manifest as authoring material, not runtime instructions. It is runnable by
Skill Evaluator, but it is not evidence until a run, grades, comparison, and
report exist.

## Output

Close with the skill path, what was created or changed, validation run or
skipped, and anything still open. Keep the report short.

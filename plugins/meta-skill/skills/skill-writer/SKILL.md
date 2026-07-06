---
name: skill-writer
description: "Use when creating a reusable agent skill from an idea, repeated workflow, example output, Codex thread, or source material. Designs the trigger contract, runtime guidance, resources, metadata, and validation handoff. Not for improving, diagnosing, or evaluating an existing skill, or for installing, publishing, or syncing skills."
---

# Skill Writer

Create practical, reusable skills. Build the portable runtime payload rooted
at the skill directory — see [Payload Shape](#payload-shape) for the folder
tree. Treat that list as a menu, not scaffolding: create a folder only when
the skill has files to put in it.

This skill owns new-skill authoring. Route existing-skill fixes to
`skill-doctor`, measurement to `skill-evaluator`, and lifecycle orchestration to
`meta-skill`.

## Payload Shape

The portable payload is the project root:

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

Write the skill around the work the agent will perform. Start from the job, the
natural language a user would use, and the smallest behavior that changes the
agent's next action. Keep authoring categories, evidence plans, gates, workbench
choices, and other design bookkeeping private unless they directly change
runtime behavior.

## Reference Map

Read only what the task needs:

| Need | Read |
|---|---|
| Whether an idea is skill-shaped, and the better artifact if not | [skill-shape.md](references/skill-shape.md) |
| Distill source packs or prior artifacts into reusable skill rules | [source-distillation.md](references/source-distillation.md) |
| Skill type, invocation posture, body shape, and design principles | [skill-design.md](references/skill-design.md) |
| Capture an active or prior Codex thread/session into a skill | [session-capture.md](references/session-capture.md) |
| Compact runtime snippets after the design decision is clear | [cookbook.md](references/cookbook.md) |
| Shared skill-quality standard before finalizing a non-trivial skill | [judge-rubric.md](../../references/judge-rubric.md) |
| Keep source evidence and maintainer notes out of portable runtime | [payload-hygiene.md](../../references/payload-hygiene.md) |
| Central Meta Skill CLI: validate, package, workbench, eval | [cli.md](../../references/cli.md) |
| UI metadata fields for `agents/openai.yaml` | [openai_yaml.md](references/openai_yaml.md) |
| Trial a draft skill in an isolated Codex thread or worktree | [skill-trial-runs.md](../../references/skill-trial-runs.md) |

Treat [skill-design.md](references/skill-design.md) as the governing
principle guide and [cookbook.md](references/cookbook.md) as a recipe
lookup, not a template to copy wholesale. Use
[payload-hygiene.md](../../references/payload-hygiene.md) whenever source
material, research, transcripts, or user corrections shape runtime guidance,
and [judge-rubric.md](../../references/judge-rubric.md) as the shared
quality standard before finalizing non-trivial skills (do not produce a
scored Judge review unless the user asks for one).

## Workflow

### 1. Interview

Start from existing context: the conversation, provided files, comparable
skills, Codex thread/session evidence, and any source material. Ask only for
missing decisions that change routing, runtime behavior, resources, or
approval gates. Read [session-capture.md](references/session-capture.md) for
a request to capture the current or prior thread into a skill;
[source-distillation.md](references/source-distillation.md) for source
packs, example pairs, transcripts plus notes, or prior artifacts; and
[skill-shape.md](references/skill-shape.md) when the request is still an
idea rather than a settled skill.

Resolve these working answers before scaffolding. They are authoring notes,
not the runtime voice; answers may come from the conversation, a captured
session, source material, comparable skills, repo conventions, or a
question:

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

Fill every answer from context first by mining the conversation, provided
files, source packs, user corrections, session-capture output, comparable
skills, and the skill type in [skill-design.md](references/skill-design.md).
Ask only for decisions that change routing, runtime behavior, resources,
approval gates, or workbench setup — in one screen, with numbered questions,
lettered options, a recommended default, and a `defaults` fast path. If a
required answer is thin but not blocking, record the best defensible default
and mark the uncertainty in `Still open`.

Reflect the settled shape as a compact authoring note before editing — one
line per field from the table above. Do not paste the outline into `SKILL.md`
as runtime content; use it to make decisions, then write the skill body in
natural, outcome-first prose. Before scaffolding, pressure-check the trigger
by naming one should-trigger prompt, one should-not-trigger prompt, and the
nearest near miss — see [skill-design.md](references/skill-design.md) for
trigger-contract quality.

The interview self-bypasses when context is complete, the user says "just
build it" or "no questions," or the idea is not skill-shaped. Skipping
changes the clarification budget, not the quality budget: the authoring note
still needs a real job sentence, trigger contract, and output shape before
runtime drafting.

### 2. Design

Build a skill only when reusable runtime guidance would change future agent
behavior. Use [skill-shape.md](references/skill-shape.md) to distinguish
skills from one-off answers, project docs, memory, utilities, validators,
apps, or managed agent systems; route to the better artifact when the idea is
not skill-shaped.

Before choosing folders, evals, or helper files, write the opening contract
in plain language: what the skill helps the agent do, what good output looks
like, what must stay private, and where the work stops. If that contract
cannot be written cleanly, the design is not ready.

Use [skill-design.md](references/skill-design.md) to decide the recurring
job and ownership boundary; skill type, evidence plan, and resource/test
shape; invocation posture; frontmatter name and description; structure and
steering choices; runtime body shape and section names; instruction
strength; information hierarchy (what stays in `SKILL.md`, what goes behind
a context pointer, what stays out of runtime); setup/config/state/memory
requirements; evaluation handoff; input and evidence boundaries; and failure
handling, approval gates, output shape, completion criteria, and pruning.

Use [cookbook.md](references/cookbook.md) only after the design decision is
clear. Pick the smallest pattern card that changes runtime behavior.

### 3. Build

Create or edit the source skill files directly. Prefer a lean `SKILL.md` with
linked references over an overstuffed body. Resolve relative `<skill-dir>`
from the user's current working directory; the portable payload is the
project root (see [Payload Shape](#payload-shape)). If the user wants
workbench-backed evaluation or packaging state, run
`<meta-skill-root>/scripts/metaskill init <skill-dir>` after the payload
exists.

In project mode, keep non-runtime authoring material under `.<skill-name>/`:
`.<skill-name>/AGENTS.md` for hidden-folder guidance and skill-specific
invariants; `.<skill-name>/docs/` for durable specs, decisions, and research;
`.<skill-name>/tests/` as a flat folder for test fixtures, only when the user
provides or approves concrete test material. Create optional folders only
when writing their first real file; blank `docs/`, `tests/`, `cases/`,
`presets/`, or nested test-category folders should never exist.

When the user asks for eval seeds, workbench eval material, or evaluator
handoff, create one `.<skill-name>/evals.json` suite manifest containing
`skill_name`, realistic `cases[]` with `task.prompt` or canonical
`task.path: "task.md"`, `type`, expectations, optional fixtures, and grader
hints. Limit it to authored task material; run status, grades, and evidence
belong to later evaluation runs.

For judgment-heavy, writing, planning, style, review, or product-guidance
skills, do not add eval machinery just to look rigorous. Start with realistic
examples and the simplest runtime guidance that would improve the next run;
escalate to `skill-evaluator` only when the user wants measured candidate
evidence or the risk justifies a durable suite.

Follow these payload rules: keep build notes, raw source examples, review
notes, evaluation handoff drafts, benchmark material, and rejected options
out of the portable payload; put runtime references in `references/`, one
level deep, linked directly from `SKILL.md` with wording that says when to
read it (a weak pointer to necessary material is a behavior bug — sharpen the
condition before inlining the whole file); put scripts in `scripts/` only
when deterministic code is safer or cheaper than prose, linked with when to
run it, inputs, output meaning, and nonzero-exit meaning; put assets in
`assets/` only for approved reusable runtime materials; use `resources/`,
`examples/`, or another folder only when the runtime skill needs that
material, keeping source-specific or build-only material in
`.<skill-name>/docs/`; include `agents/openai.yaml` for generated skills that
expect UI metadata (see [openai_yaml.md](references/openai_yaml.md)); and add
human gates before external writes, destructive edits, packaging, installing,
syncing, publishing, posting, sending, submitting, or final client-facing
delivery.

Generalize source material into reusable behavior. Copy user prompts, model
names, provider docs, raw research links, author provenance, thread IDs,
one-off file paths, or local build notes into runtime only when they are
direct runtime dependencies. Before promoting any source-derived rule into
runtime, apply [payload-hygiene.md](../../references/payload-hygiene.md):
preserve the reusable operating rule, and move source provenance, rejected
alternatives, prompt-role language, local paths, and design-history notes to
`.<skill-name>/docs/` or the review handoff.

When the intake requires research, prefer a bounded research pass before
runtime drafting. Use an available researcher sub-agent when the environment
provides one and the research can run independently; otherwise do the
smallest reliable source review yourself. Save reports in
`.<skill-name>/docs/` and copy only the operational conclusions into runtime
guidance.

### 4. Validate And Stop

Review changed skill files directly. Check that linked references, scripts,
and assets exist. Re-read the runtime for single source of truth, no-op
lines, stale sediment, duplicated branches, and missing completion criteria.
Run any deterministic tests already available. For non-trivial skills, run a
final payload hygiene and placement check from
[payload-hygiene.md](../../references/payload-hygiene.md); treat structural
validation as necessary but not sufficient for semantic quality.

Run `<meta-skill-root>/scripts/metaskill validate <path-to-skill-folder>` for
standalone portable skill folders. For script resources added during
authoring, run a smoke test or representative sample and report any untested
scripts.

If the user asks for one-off testing, or one realistic isolated run would
materially improve confidence in a fragile trigger, resource, script, or
output contract, read
[skill-trial-runs.md](../../references/skill-trial-runs.md) and offer a skill
one-off check. It is optional and not release proof; route systematic
multi-scenario measurement to `skill-evaluator` and recurring release or
quality scorecards to `skill-benchmarker`. For the evaluator handoff, provide
`.<skill-name>/evals.json` with 2-3 realistic tasks, expected outcomes,
near-miss examples, grader hints, and must-not-break constraints.

Stop before packaging, installing, publishing, syncing, external writes, or
final delivery unless the user explicitly approved that specific action. If
packaging or sync appears needed, report it as a follow-up and route
lifecycle or release work through `meta-skill` or the appropriate specialist
lane. When approved, use
`<meta-skill-root>/scripts/metaskill package <skill-dir>`; it exports only
the portable payload and excludes `.<skill-name>/`. Explain the evaluation
handoff as authoring material, not runtime instructions — it becomes evidence
only after a run, grades, comparison, and report exist.

## Output

Close with the skill path, what was created or changed, validation run or
skipped, and anything still open. Keep the report short.

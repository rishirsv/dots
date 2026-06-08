---
name: skill-writer
description: "The greenfield-authoring specialist within meta-skill: create a new reusable agent skill from an intent, repeated workflow, example output, Codex thread/session, or source material by designing the trigger contract, runtime guidance, resources, metadata, and validation. Reached through meta-skill's routing; invoke directly only when explicitly named. Not for improving, diagnosing, or evaluating an existing skill, and not for packaging, installing, publishing, or syncing skills."
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
.meta-skill/     optional private workbench, excluded from packages
```

This skill owns greenfield authoring. Route existing-skill fixes to
`skill-doctor`, measurement to `skill-evaluator`, and lifecycle orchestration to
`meta-skill`.

## Reference Map

Read only what the task needs:

| Need | Read |
|---|---|
| Decide what a skill is, whether the idea is skill-shaped, and what artifact should be created if it is not a skill | [skill-shape.md](references/skill-shape.md) |
| Complete the interview answer-set from context, ask only unresolved decisions, and draft the outline into `SKILL.md` | [interview.md](references/interview.md) |
| Distill source packs, example input/output pairs, transcripts plus notes, or prior artifacts into reusable skill rules | [source-distillation.md](references/source-distillation.md) |
| Decide whether the workflow should become a skill; classify the skill type; write the trigger contract, frontmatter, runtime body, instruction strength, setup/state, future measurement handoff, evidence boundaries, and voice | [design.md](references/design.md) |
| Capture an active or prior Codex thread/session into a durable skill | [session-capture.md](references/session-capture.md) |
| Add compact runtime snippets after the design decision is clear | [cookbook.md](references/cookbook.md) |
| Scaffold, lint, package, initialize through the OpenAI route, generate metadata, or quick-validate a skill | [scripts/meta_skill.py](scripts/meta_skill.py) |
| Understand OpenAI/Codex UI metadata fields generated through `meta_skill.py openai-yaml` or `create` | [openai_yaml.md](references/openai_yaml.md) |
| Run one isolated Codex thread trial for the draft skill | [isolated-thread-trial.md](../../references/isolated-thread-trial.md) |

Treat [design.md](references/design.md) as the governing principle guide. Treat
[cookbook.md](references/cookbook.md) as a recipe lookup, not a template to copy
wholesale.

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

Use [interview.md](references/interview.md) to complete the required answer-set
before scaffolding. Fill every answer from context first. Ask only unresolved
decisions, using tight multiple-choice defaults when a question is needed.

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
- Gates: none; portable-only.
- Project mode: portable-only.
- Still open: none.
```

Before scaffolding, pressure-check the trigger by naming one should-trigger
prompt, one should-not-trigger prompt, and the nearest near miss. Use
[design.md](references/design.md) for trigger-contract quality.

### 2. Design

Build a skill only when reusable runtime guidance would change future agent
behavior. Use [skill-shape.md](references/skill-shape.md) to distinguish skills
from one-off answers, project docs, memory, utilities, validators, apps, or
managed agent systems; route to the better artifact when the idea is not
skill-shaped.

Use [design.md](references/design.md) to decide:

- the recurring job and ownership boundary
- the skill type and the resource/test shape it implies
- frontmatter name and description
- runtime body shape and section names
- instruction strength: prose, checklist, template, script, or strict sequence
- setup, config, state, and memory requirements
- future measurement handoff for realistic prompts, expected outputs, and objective checks when the user asks for that lane
- input and evidence boundaries
- failure handling, approval gates, output shape, and final checks

Use [cookbook.md](references/cookbook.md) only after the design decision is
clear. Pick the smallest pattern card that changes runtime behavior.

### 3. Build

Create or edit the source skill files directly. Prefer a lean `SKILL.md` with
linked references over an overstuffed body.

If creating a new skill and the target repo lacks a better local initializer,
use `scripts/meta_skill.py create <skill-dir> --slug <slug> --title "<title>"
--description "<Use when ...; not for ...>" --job "<job>"` as the base
scaffold. `meta_skill.py` is the single script entry point: it routes creation
through the OpenAI initializer, runs OpenAI metadata generation, and adds any
extra runtime folders or project workbench orchestration on top. Resolve
relative `<skill-dir>` from the user's current working directory. The portable
payload is the project root: `<skill-dir>/SKILL.md`, `agents/`, and any runtime
folders the design actually needs. Use `--project` only when the user wants
`.meta-skill/` workbench folders and a packaged placeholder zip.

In project mode, keep non-runtime authoring material under `.meta-skill/`.
Use `.meta-skill/docs/research/` for research reports, `.meta-skill/docs/` for
other durable authoring notes, and `.meta-skill/tests/` as a flat folder for
test fixtures or check inputs when the user provides them. Keep
`.meta-skill/tests/` flat; do not create nested test-category folders inside it.

Follow these payload rules:

- Keep build notes, raw source examples, review notes, future measurement material, and
  rejected options out of the portable payload.
- Put runtime references in `references/`, one level deep. Link every reference
  directly from `SKILL.md`, and start each reference with when to read it.
- Put scripts in `scripts/` only when deterministic code is safer or cheaper
  than prose. Link every script directly from `SKILL.md`, state when to run it,
  what inputs it accepts, what output means, and what nonzero exit means.
- Put assets in `assets/` only for approved reusable runtime materials such as
  templates, schemas, starter files, icons, or boilerplate.
- Use `resources/`, `examples/`, or another folder only when the runtime skill
  needs that material. Link it directly from `SKILL.md`, name when to read or use
  it, and keep source-specific or build-only material in `.meta-skill/docs/`
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
otherwise do the smallest reliable source review yourself. Save concise research
reports in `.meta-skill/docs/research/` for project-mode skills, and copy only
the operational conclusions into runtime guidance.

### 4. Validate And Stop

Review changed skill files directly. Check that linked references, scripts, and
assets exist. Run any deterministic tests already available for the skill or its
authoring repo.

For standalone portable skill folders, run
`scripts/meta_skill.py lint <path-to-skill-folder>` when available. For script
resources added during authoring, run a smoke test or representative sample and
report any untested scripts.

If the user asks for one-off testing, or if one realistic isolated run would
materially improve confidence in a fragile trigger, resource, script, or output
contract, read
[isolated-thread-trial.md](../../references/isolated-thread-trial.md) and offer
an isolated Codex thread trial. It is optional by default and is not release
proof; route systematic multi-scenario measurement to `skill-evaluator`.

Stop before packaging, installing, publishing, syncing, external writes, or
final delivery unless the user explicitly approved that action or the current
repo instructions require it. When packaging is approved, use
`scripts/meta_skill.py package <skill-dir>`; it exports only the portable payload
from the project root and excludes `.meta-skill/`.

## Output

Close with the skill path, what was created or changed, validation run or
skipped, and anything still open. Keep the report short.

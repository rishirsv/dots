---
name: skill-create
description: Use when turning a workflow, example output, existing skill draft, or repeated knowledge-work task into a reusable portable skill; not for running evals, improving from evidence, packaging, installing, or publishing.
---

# Skill Create

Create practical reusable skills. The default output is a portable skill payload rooted at the skill directory:

```text
SKILL.md
agents/
references/      optional
scripts/         optional
assets/          optional
```

Add the hidden `.meta-skill/` workbench only when the user requests project mode or clearly needs evals, tests, comparison, team reuse, or a maintained production capability.

## Routing

Start every build by understanding intent, then pick one path. All paths converge on the Interview, which completes the Skill Specification before any file is generated.

1. **Not skill-shaped** — a one-off answer, an obvious base capability, or pure logic that validation code should enforce. Do not build a skill; say so and stop. See the skill-or-not gate in [design.md](references/design.md).
2. **Capture a workflow from this conversation** — the conversation already shows a workflow the user ran or referenced, or the user says "turn this into a skill" / "make a skill out of this." Read [skillify.md](references/skillify.md) and reconstruct the method from history before interviewing.
3. **Distill a source pack** — the user hands over input files plus finished outputs. Read [distillation.md](references/distillation.md) to extract the method, then interview only for the gaps.
4. **Build from intent** — a topic or job with no captured workflow or source pack. Go straight to the Interview.

Routing is a branch decision, not a phase. Once the path is chosen, run the Workflow below.

## Reference Map

Read only what the task needs:

| Need | Read |
|---|---|
| Decide whether the workflow should become a skill; write frontmatter, runtime guidance, boundaries, and trigger contract | [design.md](references/design.md) |
| Capture a workflow that already happened in this conversation and reconstruct it from history | [skillify.md](references/skillify.md) |
| Look up compact snippets after the design decision is clear | [cookbook.md](references/cookbook.md) |
| Distill a source pack or past outputs into reusable runtime guidance without leaking engagement-specific facts | [distillation.md](references/distillation.md) |
| Decide what belongs in `SKILL.md`, `references/`, `scripts/`, `assets/`, and `.meta-skill/` | [structure.md](references/structure.md) |
| Use the shared CLI conventions | [cli-conventions.md](references/cli-conventions.md) |
| Copy or adapt the project spec shape | [skill-spec-template.md](assets/skill-spec-template.md) |

## CLI

Use the shared TypeScript CLI through the plugin package `meta-skill` bin:

```bash
meta-skill create <skill-dir> --slug <slug> --title "<title>" --description "<Use when ...; not for ...>" --job "<job>"
meta-skill create <skill-dir> --project --slug <slug> --title "<title>" --description "<Use when ...; not for ...>" --job "<job>"
meta-skill project init <skill-dir>
meta-skill lint <skill-dir>
```

`meta-skill create` scaffolds a portable payload. `--project` adds `.meta-skill/`. `project init` adds `.meta-skill/` to an existing portable skill without moving the payload into a nested folder.

## Workflow

Run the build as flight phases. Do not generate any file until the Skill Specification is complete.

### Phase 1 — Interview

The interview is the primary surface. Its job is to complete the **Skill Specification** before anything is scaffolded. Fill every answer from existing context first, then ask only what context cannot answer.

**Required answer-set.** You must know all of these — from the conversation, from history (skillify route), from a source pack (distillation route), or from a question:

- **Job** — the one recurring job the skill does, not "what we did once."
- **Trigger** — when it should fire, in real user language, plus the nearest `not for` boundary.
- **Inputs and output** — what it consumes and the expected output shape.
- **Fragility** — judgment-prose, a fixed shape, or a deterministic script (drives instruction strength).
- **Gates** — approvals required before external writes or final client-facing delivery.
- **Project mode** — set up test cases / evals / team reuse, or keep it portable-only.

**Ask the minimum.** Resolve as many answers as possible from context and from how comparable skills in the library already decide each one. Then ask only the unresolved questions, and prefer lettered multiple choice with a marked default so the user can answer in seconds:

```md
Skill Specification — a couple of quick decisions before I scaffold.

1. When should it trigger?
a) <real user phrasing inferred from context> (recommended)
b) <broader alternative>
c) Not sure — use default

2. Set up evals/tests?
a) Portable-only, no workbench (recommended)
b) Project mode with `.meta-skill/` cases and tests
c) Not sure — use default

Reply with: `defaults`, or a compact answer like `1a 2b`.
```

Keep the turn shape tight: numbered questions, lettered options, recommended/default marked, one screen, a `defaults` fast path. Always recommend an answer; never ask an open-ended question when a tight multiple-choice eliminates the ambiguity faster.

**Log the result as the Skill Specification** — the create-lane analog of clarify's Common Understanding:

- **Job**, **Trigger** (+ `not for`), **Inputs and output**, **Fragility**, **Gates**, **Project mode**, **Still open** (`None` when settled).

When project mode exists, persist this to `.meta-skill/spec.md` using [skill-spec-template.md](assets/skill-spec-template.md).

**When to skip the interview (implicit bypass).** The interview self-bypasses; the user does not have to ask. Skip a question whenever context already answers it, and skip the interview entirely when the whole required answer-set is already settled. Skip cases:

- Context complete — the conversation, files, or skillify extraction already answer every required item. Confirm the Specification in one line and proceed.
- Single-shot — the user said "just build it," "no questions," or "one-shot." Take the strongest defensible interpretation, record unresolved choices in the Specification (and `.meta-skill/spec.md` in project mode), and proceed.
- Trivial — routing already showed the request is not skill-shaped.

Skipping changes the clarification budget, not the quality budget: the Specification still needs a real job sentence, a real trigger contract, and an output shape. See [design.md](references/design.md) for intake depth and trigger-contract quality.

### Phase 2 — Distill (source-derived only)

When the skill comes from a captured workflow (skillify route) or a source pack, run every candidate rule through the Mechanism Gates and Rule Surface Form in [distillation.md](references/distillation.md) before it enters runtime. Generalize named products, repos, commands, or skills to the user-facing concept unless the runtime actually invokes them. Skip this phase for a from-intent skill with no source material.

### Phase 3 — Generate the scaffold

With the Specification complete, scaffold the payload:

```bash
meta-skill create <skill-dir> --slug <slug> --title "<title>" --description "<Use when ...; not for ...>" --job "<job>"
```

Add `--project` when the Specification chose project mode. Then draft the runtime payload from the Specification: use [design.md](references/design.md) for body shape, [cookbook.md](references/cookbook.md) for snippet shapes, and [structure.md](references/structure.md) for references, scripts, and assets.

### Phase 4 — Validate and stop

Run `meta-skill lint <skill-dir>`. Stop before packaging, install, publish, sync, source edits, external writes, or final client/user-facing delivery unless the user explicitly asks. Hand off review, evals, or evidence-backed edits to `skill-eval` or `skill-improve` rather than crossing lanes silently.

## Runtime Payload Rules

- Keep build notes, review notes, raw source examples, and eval evidence out of the portable payload.
- When source material names another product, repo, command, plugin, or skill, generalize it to the user-facing concept unless the generated skill directly invokes that dependency as part of its runtime workflow.
- Quote or escape YAML frontmatter values when they contain punctuation.
- `agents/openai.yaml` should use supported Codex metadata (`name` and `description`) unless a documented interface shape is intentionally used.
- Add runtime references, scripts, or assets only when they are real reusable materials.
- Link every runtime reference, script, or asset directly from `SKILL.md`.
- Runtime scripts should get or recommend executable unit tests in `.meta-skill/tests/unit/` when project mode exists.
- Add human gates before packaging, installing, publishing, syncing, source edits, external writes, or final client/user-facing delivery.

## Output

For new builds, report the path, files created, routing path taken, Skill Specification (job, trigger contract, nearest non-trigger boundary), resources added or omitted, project-mode decision, lint result, and any spec gaps.

For review, eval, or evidence-backed edits, hand off to `skill-improve` or `skill-eval` instead of silently crossing lanes.

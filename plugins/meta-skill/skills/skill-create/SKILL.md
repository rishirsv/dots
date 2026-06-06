---
name: skill-create
description: Use when turning a workflow, example output, existing skill draft, or repeated knowledge-work task into a reusable portable skill; not for running evals, improving from evidence, packaging, installing, or publishing.
---

# Skill Create

Create practical, reusable skills. The default output is a portable skill payload rooted at the skill directory:

```text
SKILL.md
agents/
references/      optional
scripts/         optional
assets/          optional
```

Add the hidden `.meta-skill/` workbench only when the user asks for project mode or clearly needs evals, tests, or comparison runs. Plain portability — "so my team can use it" — does not by itself call for the workbench; a portable payload already travels.

## Routing

Settle two questions before building.

**Is it skill-shaped?** Build a skill only when recurring workflow guidance would change future agent behavior. Weigh the artifact, not the topic: a one-off answer needs nothing durable, a simple preference is a memory or rule, a lightweight repeated prompt is a prompt file, project-specific behavior belongs in a repo doc, and only a portable, recurring, multi-step capability is a skill. If it is not skill-shaped, say so and stop. See the skill-or-not gate in [design.md](references/design.md).

**Where does the context come from?** The build is the single workflow below; what feeds its first step depends on the material that already exists:

- A workflow the user ran or referenced in this conversation or a prior session → reconstruct it with [skillify.md](references/skillify.md).
- Provided source files or a finished-output pack → extract the method with [distillation.md](references/distillation.md).
- Neither → work from intent, using comparable skills for defaults.

These are context sources, not separate routes. Source material feeds the standard workflow; it does not fork it. Most builds combine them — a captured workflow plus a couple of confirmations is the common case.

## Reference Map

Read only what the task needs:

| Need | Read |
|---|---|
| Decide whether the workflow should become a skill; write frontmatter, runtime guidance, boundaries, and the trigger contract | [design.md](references/design.md) |
| Hold the right voice, tone, and syntax while drafting | [design.md](references/design.md) (Voice and Style) |
| Turn a workflow from this conversation or a prior session into candidate skill rules | [skillify.md](references/skillify.md) |
| Distill a source pack or past outputs into reusable guidance without leaking engagement-specific facts | [distillation.md](references/distillation.md) |
| Look up a compact runtime snippet after the design decision is clear | [cookbook.md](references/cookbook.md) |
| Decide what belongs in `SKILL.md`, `references/`, `scripts/`, `assets/`, and `.meta-skill/` | [structure.md](references/structure.md) |
| Use the shared CLI | [cli-conventions.md](references/cli-conventions.md) |
| Capture decisions as a Skill Spec, on request or in project mode | [skill-spec-template.md](assets/skill-spec-template.md) |

## Writing Style

You are writing instructions a future agent will read while doing the job. Write to that agent, in plain, direct language. The fuller treatment, with before/after examples, is in the Voice and Style section of [design.md](references/design.md); these rules apply to this skill too.

- **Explain why, not just what.** A short reason ("...so the reader can tell sourced figures from estimates") earns more reliable behavior than a bare command. Models reason well; give them the intent, not only the rule.
- **Go easy on hard commands.** Stacked MUSTs and all-caps ALWAYS/NEVER are a yellow flag. Before reaching for one, try a clearer section name, an example, or a sentence of reasoning. Reserve absolutes for safety and approval gates.
- **Lean.** Every line should change behavior. Cut background the base model already knows, motivation, and filler.
- **Outcome over process.** Define what a good result looks like and let the agent find the steps; spell out a rigid sequence only where order or risk demands it.
- **Generalize, don't overfit.** Describe the move, not the one example you saw. Name roles and types ("the base period," "the target metric"), not specific values.
- **Plain names, no house jargon.** Section names should sound like the job ("Normalization," "Review Posture"), not coined brand terms. If a label needs its own gloss to be understood, rename it.

## Workflow

Run the build as a short sequence that ends in a created skill within the same working session. Do not scaffold files until the Current Understanding is settled.
Before scaffolding, pressure-check the trigger against [design.md](references/design.md) by naming one should-trigger prompt, one should-not-trigger prompt, and the nearest near miss.

### Step 1 — Understand

Start from what you already have. Read the conversation, the provided files, and any captured workflow, and answer as much as possible without asking. Reflect it back to the user as a short **Current Understanding** so they can correct course in one glance:

```md
Current Understanding
- Job: extract tables from supplier PDFs into one normalized CSV.
- Trigger: "pull the line items out of these invoices"; not for summarizing PDF prose.
- Inputs → output: a folder of PDFs → one CSV with validated columns.
- Guardrails: never invent a missing value; flag pages that fail to parse.
- Fragility: deterministic — script-backed extraction and validation.
- Gates: none; portable-only.
- Still open: none.
```

Keep it to a few lines. When everything is settled, say so and move to the build; when something is open, that line drives the questions below.

**Ask only what context cannot answer.** Skip any question the conversation, files, or a skillify/distillation extraction already settle. Skip the questions entirely when the whole picture is already clear, or when the user said "just build it," "no questions," or "one-shot" — take the strongest defensible reading, note any guesses in the Current Understanding, and proceed. Over-asking after the context already answered is the most common failure here.

**What you need to know** before building — pulled from context first, then from a question:

- **Job** — the one recurring job the skill does, not "what we did once."
- **Trigger** — when it should fire, in real user language, plus the nearest `not for` boundary.
- **Inputs and output** — what it consumes and the shape it produces.
- **Invariants and guardrails** — what the skill must always do, what it must never do, and the mistakes or corrections to guard against. Usually extracted from source material; ask only when absent.
- **Fragility** — judgment prose, a fixed shape, or a deterministic script (this drives instruction strength).
- **Gates** — approvals required before external writes or final client-facing delivery.
- **Project mode** — only when the user wants evals, tests, or comparison runs; otherwise stay portable-only.

For the still-open items, ask tight, lettered multiple choice with a recommended default so the user can answer in seconds:

```md
A couple of quick decisions before I build:

1. When should it trigger?
a) <real user phrasing inferred from context> (recommended)
b) <broader alternative>
c) Not sure — use default

2. Set up evals/tests (project mode)?
a) Portable-only, no workbench (recommended)
b) Project mode with `.meta-skill/` cases and tests

Reply with `defaults`, or a compact answer like `1a 2b`.
```

Keep it to one screen: numbered questions, lettered options, a marked default, a `defaults` fast path. Always recommend an answer; never ask open-ended when a tight choice resolves it faster.

**Then build.** Once the Current Understanding holds, move straight into the build. The Skill Spec is not the goal — offer it as a choice rather than producing it by default: when the questions are settled, ask whether to **start building now** or **capture the conversation as a Skill Spec** first. Write the spec when the user asks for it, or in project mode, using [skill-spec-template.md](assets/skill-spec-template.md) at `.meta-skill/spec.md`.

Skipping questions changes the clarification budget, not the quality budget: the build still needs a real job sentence, a real trigger contract, and an output shape. See [design.md](references/design.md) for intake depth and trigger-contract quality.

### Step 2 — Distill (source-derived only)

When the skill comes from a captured workflow (skillify) or a source pack (distillation), run every candidate rule through the gates in [distillation.md](references/distillation.md) before it enters runtime. Skip this step for a from-intent skill with no source material.

### Step 3 — Build

With the Current Understanding settled, scaffold the payload, then draft it following the Writing Style above:

```bash
meta-skill create <skill-dir> --slug <slug> --title "<title>" --description "<Use when ...; not for ...>" --job "<job>"
```

Add `--project` only in project mode. Then draft the runtime payload: use [design.md](references/design.md) for body shape, [cookbook.md](references/cookbook.md) for snippet shapes, and [structure.md](references/structure.md) for references, scripts, and assets.

### Step 4 — Validate and stop

Run `meta-skill lint <skill-dir>`. Stop before packaging, install, publish, sync, source edits, external writes, or final client/user-facing delivery unless the user explicitly asks. Hand off review, evals, or evidence-backed edits to `skill-eval` or `skill-improve` rather than crossing lanes.

## CLI

Use the shared TypeScript CLI through the `meta-skill` plugin bin. The full command contract is in [cli-conventions.md](references/cli-conventions.md).

```bash
meta-skill create <skill-dir> --slug <slug> --title "<title>" --description "<Use when ...; not for ...>" --job "<job>"
meta-skill create <skill-dir> --project ...   # also scaffolds .meta-skill/
meta-skill project init <skill-dir>           # adds .meta-skill/ to an existing portable skill
meta-skill lint <skill-dir>
```

## Runtime Payload Rules

- Keep build notes, review notes, raw source examples, and eval evidence out of the portable payload.
- Generalize a named product, repo, command, plugin, or skill to the user-facing concept unless the generated skill directly invokes it at runtime.
- Quote or escape YAML frontmatter values that contain punctuation.
- `agents/openai.yaml` is optional Codex metadata: an `interface` block (`display_name`, `short_description`, `icon_small`, `icon_large`, `brand_color`, `default_prompt`), a `policy` block (`allow_implicit_invocation`), and `dependencies`. The skill name and description live in `SKILL.md` frontmatter, not here. See [cookbook.md](references/cookbook.md) for the shape.
- Add references, scripts, or assets only when they are real reusable materials, and link each one directly from `SKILL.md`.
- In project mode, give runtime scripts executable unit tests in `.meta-skill/tests/unit/`.
- Add human gates before packaging, installing, publishing, syncing, source edits, external writes, or final client/user-facing delivery.

## Output

Close with a short report: the skill path, what was built, the lint result, and anything still open. Keep it proportional — do not pad.

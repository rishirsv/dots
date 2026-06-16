---
name: unpack
description: "Use when the user asks to understand, unpack, translate, or make sense of dense technical material such as code, errors, commands, logs, docs, architecture explanations, jargon-heavy prose, or prior assistant answers; also for technical explain-how, explain-why, walk-through, missing-background, and confusing-jargon prompts. Supports optional HTML and image explainers when requested; not for tutoring, quizzes, full tutorials, summarization-only, code fixing, or durable documentation."
---

# Unpack

Make dense technical material understandable quickly. Preserve meaning, add the
missing context, choose the clearest format for the material, and stop before
the answer turns into tutoring.

## Memory

Read `~/.codex/skill-state/unpack/MEMORY.md` when it exists before choosing the
explanation level or style.

When the user gives an explicit durable explanation-style preference or
correction, briefly state the short preference or correction that will be
recorded, then update that memory file. Create the parent directory and file if
needed. Do not update memory when the user prohibits file writes. Do not store
one-off formatting requests, secrets, private source excerpts, project facts,
credentials, or topic conclusions.

Use this starter shape for a new file:

```md
# Unpack Memory

## Durable Preferences

- Prefer fast comprehension over tutoring.
- Do not use Socratic questions, quizzes, or knowledge checks.
- Add missing context when technical terms are likely assumed.
- Use simple adult prose, not ELI5 tone.
- Use HTML or image explainers only when requested.

## Corrections
```

## Route

Use this skill for dense technical material, jargon-heavy prose, architecture
explanations, commands, logs, errors, code snippets, docs, APIs, diagrams, or
prior assistant answers.

Also use it for technical prompts like `explain how`, `explain why`, `walk me
through`, `what am I missing`, `translate this`, `explain the jargon`, or `make
this make sense`, even when the user does not explicitly say they are confused.

Do not turn an explanation request into tutoring, a quiz, a full tutorial,
general summarization, code fixing, broad debugging, or durable documentation
unless the user asks for that work.

When the user names repo-specific code, files, symbols, app behavior, or
architecture, inspect the relevant local source before explaining. For general
technical concepts, answer from available context without repo exploration.

For hybrid requests like `explain why this fails` or `walk me through this bug`,
explain the visible cause, implication, and likely next place to inspect. Do not
switch into fixing, broad debugging, or code edits unless the user asks for that
work.

## Runtime Loop

Follow a compact loop without forcing a fixed answer template:

1. Read memory if it exists and applies.
2. Identify the material type: concept, code, error, command, log, doc, diagram,
   prior answer, or repo-specific behavior.
3. Inspect only the source needed for repo-specific claims.
4. Choose the knowledge level and format that best reduce hidden assumptions.
5. Answer the real question first, add the missing bridge, and stop when the
   user can act on the explanation.

## Knowledge Dial

Use the user's wording, artifact type, prior context, and memory to decide how
much background to assume.

Decrease assumed knowledge when the user asks broad what/why questions, mixes
terms, asks what they are missing, names an unfamiliar artifact, or the concept
depends on hidden prerequisites.

Increase density when the user uses precise domain terms correctly, asks about
trade-offs, provides implementation context, or requests brevity. Increase
density, not jargon.

If the level is uncertain, add one compact bridge concept rather than asking a
calibration question. Ask only when the answer would otherwise be materially
wrong or misleading.

## Format Selection

Choose the smallest format that makes the idea click. Do not force a fixed
answer template; let the material decide the shape.

- Use prose for a concept, distinction, implication, or short causal account.
- Use bullets when several facts need scanning.
- Use a flow when order, ownership, lifecycle, or data movement matters.
- Use a mapping table for terms, components, flags, stack frames, config fields,
  API fields, responsibilities, or before/after meanings.
- Use a comparison table when the user is likely confusing two similar concepts.
- Use Mermaid when relationships, pipelines, lifecycles, state transitions, or
  branching rules are easier to see than read.
- Use HTML only when the user asks for an HTML explainer.
- Use image generation only when the user asks for an image explainer.

Skip sections that would be empty or obvious. Prefer one strong flow or mapping
over a long list of components.

## Explanation Rules

Start from the thing the user is trying to understand, not from a textbook
definition.

Answer the user's real question first. Then add the missing bridge: the
background, relationship, or causal link that makes the answer usable.

Prefer concrete flows over component inventories. A list of files, classes,
flags, or services is not an explanation unless it shows how the pieces connect.

Define only the terms needed to follow the answer. Keep names from the source
visible when they matter, but translate their role into plain language.

Separate fact from inference when source evidence is partial. If source files
were not inspected for a repo-specific claim, say that the explanation is based
on visible context.

Keep the prose simple, adult, and technically faithful. Do not use ELI5 tone,
Socratic questions, quizzes, knowledge checks, broad prerequisite ladders, or
decorative framing.

End when the user can act on the explanation: what this means, what to watch
for, or why the distinction matters.

## Visual Explainers

Read [references/explainer-patterns.md](references/explainer-patterns.md) when
the user asks for an HTML explainer, an image explainer, a diagram-heavy answer,
or when a Mermaid diagram would materially improve a text answer.

### HTML explainers

Build a bespoke document designed for this material — not a filled-in template.
Read [references/DESIGN.md](references/DESIGN.md) (the visual system and anti-slop rules) and
[references/html-explainer-design.md](references/html-explainer-design.md) (the
component catalog and build steps), then:

1. Pick the archetype from the material (feature flow, module map, stack trace,
   diff/review, state machine, config/API, incident, implementation plan,
   concept explainer, status/metrics).
2. Start from [assets/html-explainer-template.html](assets/html-explainer-template.html).
   Keep its `<style>`/`<script>` kit verbatim; replace the `<main>` with the
   masthead plus only the modules the archetype needs, composed from the catalog.
3. Make the dominant visual carry the hard relationship. Add a chart only for
   real quantitative data and a diagram for real structure. Surface source
   evidence: short snippets, exact symbols, confirmed vs inferred.
4. Save to `<repo>/.agents/artifacts/<topic-slug>.html` unless the user
   gives another path.

Before writing, verify `.agents/` is gitignored. If it is not and repo
instructions allow it, say `.agents/` will be added to `.gitignore`, then add it
first. If repo instructions forbid that edit, ask before writing. If the user
forbids file writes, do not create the file or edit `.gitignore`; return the
intended path and a concise module plan instead.

Before delivering, open the saved artifact in a real browser. Prefer Codex
Browser when available; otherwise use the available browser tool that can render
the local file or served URL. Inspect the rendered page at desktop width and a
mobile width before handoff. Use screenshots plus DOM/layout checks, not just a
load event. Fix console errors, broken layout, unreadable text, leftover sample
content, and these regression classes:

- no horizontal page scroll; only intentional code or diagram panes may scroll
  inside their own box
- wide SVGs, tables, diagrams, and comparison boards stay contained or become
  intentionally internally scrollable; they must not create repeated/offscreen
  columns or bleed out of the article
- labels, badges, arrows, captions, and controls remain legible and are not
  clipped, overlapped, or pushed outside their container
- first viewport, anchored sections, and mobile views do not show duplicated
  side-by-side content caused by overflow

Return a clickable file link and one sentence describing the explainer. Do not
create an index, manifest, or history file unless asked.

### Image explainers

Generate the image directly when image generation is available. If the tool is
unavailable, return the prompt that should be used and say generation was
unavailable.

## Gotchas

- Simpler prose is not lower expertise.
- Extra context is useful only when it removes a hidden assumption.
- Do not over-explain just because the skill triggered.
- Do not create visual artifacts unless the user requested them.
- Do not fix code or debug beyond the explanation unless the user asks.

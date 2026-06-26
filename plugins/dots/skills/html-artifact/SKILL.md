---
name: html-artifact
description: "Use when the user needs a saved, self-contained static HTML document from grounded material and HTML-specific structure such as navigation, comparison, diagrams, disclosure, or copy/export is the point. Not for ordinary chat answers, Markdown docs, app UI, or unspecified reports/plans."
---

# HTML Artifact

Turn grounded source material into one self-contained `.html` file a human can
read, navigate, compare, and share.

This skill owns the **saved static-document layer**: the rich, shareable
artifact other work hands off to. It is not app UI, a renderer, a JSON
intermediate representation, or a general test platform.

Authoring contract:

- Author semantic HTML.
- Style from [assets/theme.css](assets/theme.css).
- Use [references/design.md](references/design.md) for visual judgment.
- Give every block a predictable anatomy.
- Verify it in a browser.
- Hand off a single static file.

## Default Path

1. Decide whether HTML is warranted (otherwise answer in chat or Markdown).
2. Identify the reader job and the one decision, understanding, or action the
   artifact should produce.
3. Load [references/composition.md](references/composition.md), map the user's
   document wording to a recipe when needed, pick a visual base, and choose the
   smallest primitive set that serves the reader job.
4. Use the global shell every time: `artifact-shell`, `hero-summary`, and
   `theme-toggle`.
5. Read the chosen recipe card in [references/recipes.md](references/recipes.md)
   and use the archetype grammar plus primitive registry in
   [references/primitives.md](references/primitives.md).
6. Omit unsupported default sections and mark gaps honestly; run the polish and
   tightness pass from [references/authoring.md](references/authoring.md).
7. Check it in a browser at desktop, ~375px mobile, and a 320px reflow width.
8. Hand off the recipe, base, primitives used, defaults omitted and why, source
   grounding, browser QA widths and overflow result, and any unknowns or
   evidence limits.

## Job and trigger boundary

Use this skill when the output benefits from spatial layout, in-page
navigation, side-by-side comparison, inline diagrams, progressive disclosure, or
copy/export — and the reader wants to open, skim, or pass along a real document.
The win is feeling in the loop with a richer artifact than a wall of Markdown.

Use it for:

- explainers that make a dense concept, code path, or external article legible
- implementation plans with milestones, flow, risks, and open questions
- code reviews with a file map, annotated diffs, and a fix checklist
- research reports with an answer, claim/evidence, contradictions, and sources
- design-QA packets comparing a source against a rendered build, and detailed QA
  with source/render/revised-mockup triptychs, focused regions, and fidelity coverage
- UX-audit reports with ordered step screenshots, per-step findings, and a11y risks
- comparison workbenches that lay options or before/after states side by side
- Image Gen concept packets, design-handoff specs, and design-system extracts
- architecture maps, migration plans, release-readiness packets, eval reports,
  decision briefs, and postmortems

The capture work behind QA, audit, and Image Gen artifacts is owned by the
adjacent skills (`design-qa`, `ux-audit`, `visual-design`); this skill owns the
saved document those captures are assembled into.

Do not use it for:

- short chat answers — just answer in chat
- durable Markdown docs (`README`, `AGENTS.md`, repo guides) — those stay Markdown
- shipped product or app UI, or design-system code that lives in a repo — that is
  the `visual-design` skill's job
- backend, CLI, or bug-fix work with no reader-facing document

## When HTML is worth it

Choose HTML only when at least one is true: the reader needs to jump between
sections, compare options or before/after states, see a diagram or diff inline,
toggle disclosure, or copy/export a result. If the content is a single linear
thought, prefer prose or Markdown — do not dress a paragraph up as a page.

## Required source-grounding pass

Before authoring, ground every claim in real source: read the named files,
diff, logs, plan, or provided text; for web or current claims, verify them.
Artifacts carry numbers, file paths, code, and findings — fabricated content is
worse in HTML because it looks authoritative. If a value is unknown, say so in
the artifact rather than inventing it. Never fill space with lorem ipsum or
placeholder metrics.

## Selection Details

Set the shell's `data-artifact` value to the chosen recipe ID from
[references/recipes.md](references/recipes.md) and its `data-base` value to the
chosen base from [references/composition.md](references/composition.md). The
selection path is:

```text
document type -> recipe -> base -> primitives
```

Start with the global shell primitives, then assemble the body from supported
recipe defaults, base rhythm, and the archetype registry in
[references/primitives.md](references/primitives.md). Prefer a catalog
primitive over a one-off layout when one fits, and extend a primitive only when
the source needs a recurring structure the registry does not cover.

Apply [assets/theme.css](assets/theme.css) as the single runtime style source:
inline the marked canonical CSS block verbatim, then add only artifact-specific
local CSS that does not redefine root tokens or target canonical
`[data-primitive=...]` selectors. Use
[references/design.md](references/design.md) for design
judgment; do not copy design guidance into the reader body.

## Composition rule

Use the smallest primitive set that makes the source easier to read, compare,
verify, or act on. A recipe default is not permission to fabricate a section. If
the source does not support a default block, omit it or state the evidence
limit.

## Semantic-first authoring rule

Use native HTML elements for meaning and behavior — `main`, `section`, `nav`,
`article`, `header`, `table`, `details`/`summary`, `figure`, `pre`/`code`,
`button`, `form`. Reach for `div`/`span` only as layout or inline styling glue.
Do not add ARIA roles when a native element already carries the semantics. CSS
owns appearance; the document must still read top-to-bottom if CSS and JS fail.

## Primitive anatomy rule

Borrow shadcn's discipline as plain HTML structure, not as a dependency: no
React, no Tailwind runtime, no shadcn CLI, no component package. Every artifact
exposes a predictable anatomy through data attributes so a future editor can
inspect, revise, and extend it without guessing:

- `data-artifact` — the recipe on the page shell, e.g. `implementation-plan`
- `data-base` — the visual base on the page shell, e.g. `plan-roadmap`
- `data-primitive` — one per reusable block, e.g. `risk-table`
- `data-slot` — a named part inside a primitive, e.g. `heading`, `summary`, `evidence`
- `data-variant` — a documented visual or density variant, only when one exists
- `data-state` — a meaningful UI or review state, only when state changes the read

CSS selectors may target these attributes, but reader-facing text must never
expose authoring scaffolding (no visible slot names, type labels, or
implementation chrome).

## Validation requirement

An artifact is not done until it has been opened and inspected in a browser at a
desktop and a ~375px mobile width, plus a 320px reflow check, with no accidental
page-level horizontal overflow and with tables, code, and screenshots contained.
Run the checks in [references/validation.md](references/validation.md), fix the
artifact before final handoff, and record the browser tool used plus any
fallback reason. Do not add a browser-automation dependency just to run these
checks.

## Handoff shape

Deliver one self-contained `.html` file: inline CSS, no required CDN, no build
step, no server, optional tiny inline JS only. State the recipe and base used,
primitives used, defaults omitted and why, source grounding, browser QA
performed (widths checked and overflow result), and unknowns or evidence limits.

## What This Does Not Produce

This skill does not build a renderer or JSON IR, a Tailwind or shadcn component
library, a React app, a general eval platform, theme packs, or a rich custom
editor. Development validation helpers under `scripts/` check the shipped
contract and are not bundled into generated reader artifacts. It does not vendor
Pico, missing.css, Open Props, Tailwind, shadcn, Web Awesome, Prism, Mermaid, or
Chart.js — those are inspiration and research references only. It produces
grounded, static, single-file HTML documents and nothing heavier.

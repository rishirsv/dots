---
name: html-artifact
description: "Produces a high-fidelity, self-contained HTML artifact from grounded source material when a human needs to read, navigate, compare, or share a rich static document with in-page navigation, comparison, inline diagrams or screenshots, disclosure, or copy/export. Covers recipes like explainers, plans, code reviews, research reports, and QA packets (full list in references/recipes.md); not for chat answers, durable Markdown docs, product or app UI (use visual-design), or backend work."
---

# HTML Artifact

Turn grounded source material into one self-contained `.html` file a human can
read, navigate, compare, and share. This skill owns the **saved static-document
layer** — the rich, shareable artifact other work hands off to. It is not app
UI, not a renderer, not a JSON intermediate representation, and not a general
test platform. Author it in semantic HTML, style it from
[references/DESIGN.md](references/DESIGN.md), give every block a predictable
anatomy, verify it in a browser, and hand off a single static file.

## Default Path

1. Decide whether HTML is warranted (otherwise answer in chat or Markdown).
2. Pick one recipe from [references/recipes.md](references/recipes.md).
3. Read only the relevant recipe, the primitives it uses in
   [references/primitives.md](references/primitives.md), the design tokens in
   [references/DESIGN.md](references/DESIGN.md), and
   [references/browser-checks.md](references/browser-checks.md).
4. Author one static, self-contained HTML file, including the standardized
   dark-mode tokens and anchored `theme-toggle` (see
   [references/DESIGN.md](references/DESIGN.md#dark-mode)).
5. Check it in a browser at desktop, ~375px mobile, and a 320px reflow width.
6. Hand off the recipe, primitives, sources, QA widths, overflow result, and any
   unknowns.

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

## Artifact selection workflow

1. Name the reader job and the one decision or understanding it should produce.
2. Pick a recipe from [references/recipes.md](references/recipes.md) — from
   `explainer`, `implementation-plan`, `code-review`, `research-report`,
   `design-qa`, `design-qa-detailed`, `ux-audit-report`, `comparison-workbench`,
   `imagegen-concept-packet`, `design-handoff-spec`, `architecture-map`,
   `migration-plan`, `release-readiness`, `eval-report`, `decision-brief`, or
   `postmortem`. Set its `data-artifact` value on the shell.
3. Assemble the artifact from primitives in
   [references/primitives.md](references/primitives.md). Prefer a catalog
   primitive over a one-off layout when one fits, and adapt or extend a
   primitive when the source needs it.
4. Author per [references/authoring.md](references/authoring.md): semantic HTML,
   predictable anatomy, static runtime rules, and contamination controls.
5. Apply [references/DESIGN.md](references/DESIGN.md) as the single design-token
   and style source. Inline the needed CSS variables and component styling into
   the final HTML; do not copy design-token prose into the reader body.
6. Verify in a browser per [references/browser-checks.md](references/browser-checks.md)
   at desktop and mobile widths, then fix before handoff.

## Semantic-first authoring rule

Use native HTML elements for meaning and behavior — `main`, `section`, `nav`,
`article`, `header`, `table`, `details`/`summary`, `figure`, `pre`/`code`,
`button`, `form`. Reach for `div`/`span` only as layout or inline styling glue.
Do not add ARIA roles when a native element already carries the semantics. CSS
owns appearance; the document must still read top-to-bottom if CSS and JS fail.

## Primitive anatomy rule

Borrow shadcn's discipline as plain HTML structure, not as a dependency: no
React, no Tailwind runtime, no shadcn CLI, no component package. Every artifact
exposes a predictable anatomy through data attributes so a later agent can
inspect, revise, and extend it without guessing:

- `data-artifact` — the recipe on the page shell, e.g. `implementation-plan`
- `data-primitive` — one per reusable block, e.g. `risk-table`
- `data-slot` — a named part inside a primitive, e.g. `heading`, `summary`, `evidence`
- `data-variant` — a documented visual or density variant, only when one exists
- `data-state` — a meaningful UI or review state, only when state changes the read

CSS selectors may target these attributes, but the reader text the agent writes
must never expose template machinery (no visible slot names, type labels, or
"primitive" chrome).

## Browser QA requirement

An artifact is not done until it has been opened and inspected in a browser at a
desktop and a ~375px mobile width, plus a 320px reflow check, with no accidental
page-level horizontal overflow and with tables, code, and screenshots contained.
Run the checks in [references/browser-checks.md](references/browser-checks.md)
and fix the artifact before final handoff.

Inspect the rendered artifact in an available browser tool for every rendered
check, and record which tool you used — plus any fallback reason — in the
handoff. Do not add a browser-automation dependency just to run these checks. If
a `file://` preview is blocked, use a temporary static preview route or data URL
to inspect — but the delivered artifact stays a single static file.

## Portable payload rule

The shipped skill payload must stay reusable. Runtime references and atlas copy
must not include provider names, raw research links, scratch paths, one-off plan
filenames, session notes, thread IDs, or source-specific provenance unless they
are the user's source material for the artifact being generated. Demo content in
the atlas must be generic to artifact work.

## Handoff shape

Deliver one self-contained `.html` file: inline CSS, no required CDN, no build
step, no server, optional tiny inline JS only. State the recipe used, the
primitives composed, the source it was grounded in, and the browser QA performed
(widths checked, overflow result). Note any value the artifact marks as unknown.

## Non-goals

This skill does not build a runtime renderer or JSON IR, a Tailwind or shadcn
component library, a React app, a general eval platform, theme packs, or a rich
custom editor. The skill-owned structural validator and fixture/eval seeds under
`.html-artifact/` are allowed — they check the contract this skill ships and are
not a general-purpose test platform. It does not vendor Pico, missing.css, Open
Props, Tailwind, shadcn, Web Awesome, Prism, Mermaid, or Chart.js — those are
inspiration and research references only. It produces grounded, static,
single-file HTML documents and nothing heavier.

---
name: html
description: "Creates persistent, self-contained HTML pages, reports, charts, static mocks, or embeddable fragments from supplied material and sources. Use for shareable static artifacts; not for exploratory or interactive visuals, product UI, or durable repository documentation."
---

# html

Create HTML artifacts for explanations, plans, reviews, reports, comparisons,
status briefs, and static mocks — one self-contained `.html` file a reader can
open, skim, navigate, and share. Read the source material, understand what
matters for the intended reader, then write and display it clearly.

The system has three layers, and every artifact uses all three:

- **Identity** — the standard look, defined once as tokens in
  [references/DESIGN.md](references/DESIGN.md) and compiled to
  [assets/theme.css](assets/theme.css). Identity is constant; never restyle it
  per artifact.
- **Form** — the document's shape, composed per content from the component
  catalog in `assets/registry/`. There are no page templates; form follows
  the content's job.
- **Treatment** — how much design the request calls for, read per artifact:
  a quick working memo gets the plain column; a keeper explainer earns the
  TOC rail, figures, and full motion.

## Contract

Start from the conversation and any sources the user identifies. Read the
actual material needed to make the artifact accurate; when that material is
code or a diff, inspect the relevant repository context rather than narrating
file names. Form the understanding needed to write the artifact. Keep confirmed
facts, inference, and unknowns distinct.

Output is a single `.html` file. Deliver through the platform's artifact
tool when one is available (its design guidance defers to an existing token
system — theme.css is that system and wins conflicts); otherwise write the
file where the user asks and open it locally.

Choose the delivery branch before assembly:

- **Page** → shell + theme + components + optional behavior. Pages are
  self-contained: make no external requests, use system fonts, and embed
  visual assets as inline SVG or data URIs.
- **Fragment** → one scoped component + no shell + no behavior dependency.
  Use this for "just the chart" or a block the user will paste into another
  surface. See
  [references/authoring.md](references/authoring.md#fragment-delivery).

## Building an artifact

1. **Read the job and ground the content.** Decide who reads this and what
   decision or understanding it drives. Read the relevant sources before
   writing. Pick treatment from the reader's need — utilitarian by default;
   editorial only when the artifact is a keeper.
2. **Choose page or fragment.** Do not start with the page shell and strip it
   back later; follow the selected branch in
   [references/authoring.md](references/authoring.md).
3. **Compose from the catalog.** Start from
   [assets/registry/registry.json](assets/registry/registry.json) — every asset
   lists when to use it. Visual components are self-describing fragments
   (header comment → scoped CSS → copy-paste markup); behavior entries provide
   optional scripts. Copy selected assets verbatim, then replace example
   content with real content. For multi-component pages, use
   `scripts/assemble.mjs` to package the chosen CSS once instead of rebuilding
   the document wrapper by hand. Custom CSS is allowed only for genuinely novel
   needs and may only consume existing tokens. When unsure what composition
   fits, open
   [assets/atlas.html](assets/atlas.html) — every component rendered — and
   the finished pages in `assets/exemplars/`.
4. **Write like it ships.** Real content everywhere — no lorem, no fake
   numbers, no invented KPIs. Every figure traceable to its source; honest
   gaps marked ("not verified") rather than smoothed over. Include a
   reader-facing sources footer only when attribution helps the artifact.
   Never expose tool names, sessions, prompts, private working paths, scratch
   files, or generation metadata.
5. **Verify before handoff.** Use the branch-specific checklist in
   [references/authoring.md](references/authoring.md#verification) — layout
   at three widths and conformance with the design system; pages also require
   dark-mode, reduced-motion, and JS-off checks.

For charts of any kind, read [references/charts.md](references/charts.md)
first — form follows the data's job, and some data should not be a chart.
For page assembly details and treatment calibration, read
[references/authoring.md](references/authoring.md). If a page's source material
lacks a deliberate reading order, read
[references/recipes.md](references/recipes.md).
For a reviewer-facing pull-request walkthrough, inspect the PR, diff, and
relevant repository context, then read
[references/pr-walkthrough.md](references/pr-walkthrough.md).
For a post-coding explanation, read
[references/code-change-explainer.md](references/code-change-explainer.md),
understand the completed change, and teach the meaningful before/after story
without turning it into commit chronology.

## Boundaries

Product and app UI, interactive editors, and anything with real form state
belong to `design`; static artifact mocks without product state belong here.
Durable repo documentation belongs to `docs-writer`. Slide decks are out of
scope. Understand sources as deeply as the artifact requires.

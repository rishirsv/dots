---
name: html
description: "Renders already-formed material as a self-contained HTML page, fragment, chart, report, or static mock. Not for product UI, durable repo docs, or forming the underlying analysis."
---

# html

Create HTML artifacts for explanations, plans, reviews, reports, comparisons,
status briefs, and static mocks — one self-contained `.html` file a reader can
open, skim, navigate, and share. This skill renders formed understanding; it
never forms it. The thinking arrives loaded in the conversation (explain,
ultraplan, a review) or in a pointed-at source the skill reads first. If the
content isn't formed yet, route to the skill that forms it and come back.

The system has three layers, and every artifact uses all three:

- **Identity** — the standard look, defined once as tokens in
  [DESIGN.md](DESIGN.md) and compiled to [assets/theme.css](assets/theme.css).
  Identity is constant; never restyle it per artifact.
- **Form** — the document's shape, composed per content from the component
  catalog in `assets/registry/`. There are no page templates; form follows
  the content's job.
- **Treatment** — how much design the request calls for, read per artifact:
  a quick working memo gets the plain column; a keeper explainer earns the
  TOC rail, figures, and full motion. Calibrate treatment, not whether to
  design.

## Contract

Two entry points, one output:

1. **Handoff** — the conversation already holds the content. Render it.
2. **Pointed-at source** — the user names a plan, doc, diff, or repo area.
   Read it (dispatch subagents for large sources), then render it. Reading
   is allowed; re-deciding is not — surface disagreements with the source as
   callouts, don't silently fix them.

Output is a single `.html` file. Deliver through the platform's artifact
tool when one is available (its design guidance defers to an existing token
system — theme.css is that system and wins conflicts); otherwise write the
file where the user asks and open it locally.

**Fragment delivery.** When the user wants a block, not a page — "just the
chart", "something I can paste into the doc" — ship one component standalone
instead of a document: no page shell, no script, static markup with the
component's tokens scoped to its root so it carries its own ground into the
host page. See [references/authoring.md](references/authoring.md#fragment-delivery).

## Building an artifact

1. **Read the job.** One sentence before any markup: who reads this, and
   what decision or understanding it drives. Pick treatment from that —
   utilitarian by default; editorial only when the artifact is a keeper.
2. **Inline the theme.** Copy [assets/theme.css](assets/theme.css) verbatim
   into `<style>`. Never edit tokens inline, never add new colors. Dark mode
   and motion arrive free with it.
3. **Compose from the catalog.** Start from
   [assets/registry/registry.json](assets/registry/registry.json) — every
   component lists when to use it; each file in `assets/registry/` is a
   self-describing fragment (header comment → scoped CSS → copy-paste
   markup). Copy fragments verbatim, then replace example content with real
   content. Custom CSS is allowed only for genuinely novel needs and may
   only consume existing tokens. When unsure what composition fits, open
   [assets/atlas.html](assets/atlas.html) — every component rendered — and
   the finished pages in `assets/exemplars/`.
4. **Write like it ships.** Real content everywhere — no lorem, no fake
   numbers, no invented KPIs. Every figure traceable to its source; honest
   gaps marked ("not verified") rather than smoothed over. Include a
   reader-facing sources footer only when attribution helps the artifact.
   Never expose tool names, sessions, prompts, private working paths, scratch
   files, or generation metadata.
5. **Verify before handoff.** The checklist in
   [references/authoring.md](references/authoring.md#verification) — layout
   at three widths, dark mode, reduced motion, JS off, and the identity
   rules below.

For charts of any kind, read [references/charts.md](references/charts.md)
first — form follows the data's job, and some data should not be a chart.
For page assembly details, treatment calibration, and motion choreography,
read [references/authoring.md](references/authoring.md).
For a reviewer-facing pull-request walkthrough, read
[references/pr-walkthrough.md](references/pr-walkthrough.md). It is an
orientation artifact, not a review verdict or a history of what changed.
For a post-coding explanation already formed by `explain`, read
[references/code-change-explainer.md](references/code-change-explainer.md).
Preserve its reasoning and render the meaningful before/after story without
turning it into commit chronology.

## Identity rules

These are hard rules, not taste; every one exists because its violation is
the house style of bad generated pages:

- One flat page background edge to edge — no page-in-a-page framing.
- No left-side accent stripes on anything — callouts, quotes,
  recommendations, TOC. Hairline borders and tints carry emphasis.
- At most one chip per page (the status pill). No label-chips; bold run-in
  words instead.
- No uppercase letter-spaced eyebrow labels. Context is a quiet breadcrumb.
- One accent color, spent sparingly: links, active states, the one
  emphasized data point. Amber/red only for genuine warnings.
- TOC is always a margin rail (sticky beside the column, inline on narrow
  viewports), with weight-and-color active state.
- Motion is choreographed moments only: one-time load stagger, one-time
  figure reveals, micro-interactions. Nothing loops, nothing floats, all of
  it behind `prefers-reduced-motion`, and the page is complete with JS off.
- Self-contained always: no external requests, system font stacks, inline
  SVG. Wide content scrolls in its own container, never the page.

## Boundaries

Product and app UI, interactive editors, and anything with real form state
belong to `design`; static artifact mocks without product state belong here.
Durable repo documentation belongs to `docs-writer`. Slide decks are out of
scope. The skill reads sources but does not run analyses, make plans, or review
code — it renders the results of skills and people that do.

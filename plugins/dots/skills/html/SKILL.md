---
name: html
description: "Creates self-contained HTML pages and fragments from source material: reports, visual explainers, plans, PR walkthroughs, charts, diagrams, and static mocks. Use whenever information should become a browser-openable, shareable artifact, even without an HTML request; not for product UI, interactive visualizations, durable repository docs, or slides."
---

# HTML

Create one self-contained HTML page or one embeddable fragment that a reader can
open, understand, and share. Keep confirmed facts, inference, and unknowns
distinct.

Choose the output before writing:

- **Page:** shell, theme, components, and optional behavior. Make no external
  requests; use system fonts and embed visual assets.
- **Fragment:** one scoped component with no shell or behavior dependency. Use
  this for a chart or block that will be pasted into another surface. See
  [fragment delivery](references/authoring.md#fragment-delivery).

Read [authoring.md](references/authoring.md) before building.

## Build

1. **Understand the reader and source.** Decide what the reader must understand
   or decide. Read the relevant sources, including code or a diff when the page
   explains existing software. For an implementation plan, inspect the parts of
   the current experience, ownership, persistence, data loading, and product
   direction that the proposed change can affect before choosing sections or
   delivery slices.
2. **Choose a reading order.** For a page, open the
   [finished-page examples](assets/outcomes/index.html) and inspect the one
   closest to the reader's need. Use its reading order, not its sample content
   or exact section list. Skip this for a fragment. Preserve a strong order that
   already exists in the source.
3. **Use the smallest useful design.** Do not invent controls, KPI rows, cards,
   legends, or secondary facts to make the page feel complete. If filtering,
   simulation, or mutable state is the main job, use an interactive
   visualization or product-UI workflow instead.
4. **Build from the supplied visual system.** Use
   [assets/theme.css](assets/theme.css) for every page. Choose components from
   [assets/atlas.html](assets/atlas.html), copy their source from
   `assets/registry/`, and replace all example content. Use
   `scripts/assemble.mjs` for pages with several components. Custom CSS may use
   only the existing design tokens.
5. **Use real content.** Do not invent numbers, claims, or filler. Trace figures
   to their sources and mark important gaps as "not verified." Include a sources
   footer only when it helps the reader. Remove tool names, prompts, private
   paths, scratch files, and generation details. Never add a title chip or
   system meta-narration: do not explain how to read, review, navigate, use, or
   respond to the artifact, or describe how its content is arranged. Begin with
   the subject matter itself.
6. **Review before delivery.** Apply the checks in
   [authoring.md](references/authoring.md#before-delivery).

Read only the guidance the page needs:

- [writing-style.md](../../references/writing-style.md) when prose carries the
  page's argument or explanation;
- [implementation-plans.md](references/implementation-plans.md) for product,
  migration, architecture, and technical implementation plans; plans always
  apply the shared writing-style reference;
- [charts.md](references/charts.md) for charts;
- [diagrams.md](references/diagrams.md) for diagrams;
- [generated-images.md](references/generated-images.md) before using `imagegen`;
- [recipes.md](references/recipes.md) when the source lacks a reading order;
- [pr-walkthrough.md](references/pr-walkthrough.md) for a pull-request
  walkthrough; and
- [code-change-explainer.md](references/code-change-explainer.md) for an HTML
  explanation of completed code changes.

## Boundaries

Product and app UI, interactive editors, and real form state belong to `design`.
Exploratory visualizations, simulations, and filter-driven analysis belong to
an interactive-visualization workflow. Static HTML mocks without product state
belong here. Durable repository documentation belongs to `docs-writer`. Slide
decks are out of scope.

When an HTML plan must make or validate an unresolved product-UI decision, use
the relevant product-design workflow and use HTML to communicate the result. If
the design is already approved or supplied, treat it as source material. HTML
owns the artifact. Product design owns hierarchy, interaction, accessibility,
and visual judgment.

---
name: html
description: "Creates and edits self-contained browser-openable HTML pages, linked page sets, fragments, static product mocks, templates, and HTML assets for template-driven skills. Not for production UI implementation, interactive data visualizations, underlying research or planning, durable documentation, or non-HTML skill authoring."
---

# HTML

Create one self-contained page or one embeddable fragment by default. Create a
linked page set only when the user requests multiple pages or the supplied
material has a real ordered sequence whose parts need independent URLs. Read
[authoring.md](references/authoring.md) before building; it explains how to
build, edit, check, and deliver the result.

## Build from prepared material

When another skill calls `$html`, use the audience, verified material, required
points, decisions, and reading order it provides. Do not redo its research or
second-guess its decisions. Turn that material into sound HTML without dropping
evidence labels or required coverage.

When the caller supplies an `artifact-template.json` with `kind: "html"`:

1. Open the retained reference and preview relative to the calling skill. Keep
   them unchanged and inspect both before composing.
2. Follow the content and structure supplied by the calling skill. Use the
   reference for visual treatment; for an adaptive template, do not copy its
   sample headings, claims, or order as slots.
3. Deliver the new, verified artifact, not the reference, preview, or working
   source.

Read only what the artifact needs:

- [form-factors.md](references/form-factors.md) when the source lacks a strong
  structure;
- [writing-style.md](../../references/writing-style.md) when prose carries the
  page's argument or explanation;
- [charts.md](references/charts.md) for charts;
- [diagrams.md](references/diagrams.md) for diagrams;
- [generated-images.md](references/generated-images.md) before using `imagegen`;
- [creating-templates.md](references/creating-templates.md) with `skill-standards`
  when creating or revising an HTML-template skill.

## Boundaries

Use HTML for static product mocks when that is the requested deliverable. Use
`design` for production UI, interactive editors, and real form state. Use an
interactive-visualization workflow for exploratory simulations or analysis led
by filters. Use `docs-writer` for repository documentation; do not use HTML for
slides.

If the task still needs software planning, apply the planning-only boundary in
[Feature Development](../../references/feature-development.md) first. Use
`$how` when the missing input is an explanation of current code. If a
product-UI choice is unresolved, settle it through product design or
`$prototype` before building the page. Those workflows decide the product
hierarchy, interaction, accessibility requirements, and visual direction; HTML
makes the resulting artifact readable, navigable, and accessible.

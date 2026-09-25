---
name: html
description: "Create or edit self-contained HTML reports, linked page sets, fragments, static mocks, and HTML template assets. Use for browser-openable artifacts; use ui-design for production interfaces."
---

# HTML

For a report, deliver one self-contained HTML page by default. Use a linked
page set when its parts need independent URLs, or a fragment when the result
must be embedded elsewhere.

## Report page loop

1. Use the reader's question and supplied material to decide what the page
   needs. Carry through the source's claims and decisions; use
   `recommendation()` only when the request or material supports a decision.
2. Find the needed report helpers with `node scripts/catalog.mjs --list` and
   `--help <helper>`. Write a `.page.mjs` module and build the HTML with
   `scripts/build.mjs`. The exact commands and source format are in
   [authoring.md](references/authoring.md#page-module-loop).
3. For layout risk, run `scripts/capture-artifact.mjs` on the finished HTML.
   Inspect its contact sheet and findings report, fix the source, and rebuild.
   Deliver the HTML and say which render states you inspected.

The report helpers add a contents list for six or more sections and collect
sources from quantitative components. For hand-written bodies, linked sets,
fragments, or editing an existing page, use the relevant route in
[authoring.md](references/authoring.md). The
[component registry](assets/registry/registry.json) lists hand-written
components; [the atlas](assets/atlas.html) and
[diagram gallery](assets/diagrams.html) show their appearance.

## Other inputs and boundaries

When another skill calls `$html`, use its material, audience, reading order,
and source labels. Identify contradictions that would change a claim.
When it supplies `artifact-template.json` with
`kind: "html"`, inspect the retained reference and preview relative to that
skill, follow its content and structure, and deliver the new artifact.

Read [form-factors.md](references/form-factors.md) when the material needs a
structure, [charts.md](references/charts.md) for chart choices,
[diagrams.md](references/diagrams.md) for diagrams, and
[generated-images.md](references/generated-images.md) for generated imagery.
For an HTML-template skill, read
[creating-templates.md](references/creating-templates.md) with
`skill-standards`.

Use `ui-design` for production UI, `repo-docs` for repository documentation,
and presentation tooling for slide decks. When the user explicitly selected
Dots Feature Development, apply its
[planning-only boundary](../../references/feature-development.md).

---
name: html
description: "Create or edit self-contained HTML reports, linked page sets, embeddable fragments, static product mocks, and HTML assets for templates. Use for browser-openable artifacts; use ui-design for production interfaces and presentation-specific tooling for slide decks."
---

# HTML

Create one self-contained report page by default. Use a linked page set when
the user requests multiple pages or the material has a real ordered sequence
whose parts need independent URLs. Use a fragment when the result must be
embedded in another surface.

## Report page loop

1. Start with the reader's question and the verified material. Preserve the
   source's decisions and reading order. Do not invent metrics, scores,
   controls, evidence, or a recommendation.
2. Run `node scripts/catalog.mjs --list` in this skill directory; use
   `--help <helper>` for the few helpers the page needs. Write a `.page.mjs`
   module with `kit = "report"`, local inputs, and a default function that
   returns `page(...)`. [authoring.md](references/authoring.md#page-module-loop)
   has the short command path and complete examples.
3. Run `node scripts/build.mjs <module.page.mjs> --out <page.html>`.
   Fix build contracts in the module. For layouts with figures, tables,
   custom CSS, long content, or narrow-screen risk, run
   `node scripts/capture-artifact.mjs --in <page.html> --out-dir <shots>`.
   Open `sheet.png`, read `report.json`, fix findings, and inspect the relevant
   full-page captures when the issue lies below the first viewport.
4. Deliver the HTML file and state which render states you inspected. Keep the
   module and its inputs when the user will edit or rerun it. `--embed-source`
   is an opt-in portable source copy; extraction writes files without running
   them. Inspect extracted code before rebuilding.

The report kit generates a TOC from six or more top-level sections and gathers
sources from quantitative helpers. It keeps hand-written body fragments and
page-set manifests available through `assemble.mjs`; read
[authoring.md](references/authoring.md#hand-written-body-fallback) for those
routes. The [component registry](assets/registry/registry.json) is the
agent-readable selection surface. [The atlas](assets/atlas.html) and
[diagram gallery](assets/diagrams.html) are for visual review.

## Other inputs and boundaries

When another skill calls `$html`, use the audience, verified material, required
points, decisions, and reading order it provides. Reuse its research and keep
the evidence labels needed by readers. Surface contradictions that prevent
faithful composition. When it supplies `artifact-template.json` with
`kind: "html"`, inspect the retained reference and preview relative to that
skill, follow its content and structure, and deliver the new artifact.

Read [form-factors.md](references/form-factors.md) when the source lacks a strong
structure, [charts.md](references/charts.md) for chart choice,
[diagrams.md](references/diagrams.md) for diagram choice, and
[generated-images.md](references/generated-images.md) before using imagegen.
Read [creating-templates.md](references/creating-templates.md) with
`skill-standards` when creating an HTML-template skill. Use
[writing-style.md](../../references/writing-style.md) when prose carries the
page's argument.

Use `ui-design` for production UI and real form state, `repo-docs` for durable
repository documentation, and presentation-specific tooling for slide decks.
If the task still needs software planning, settle the plan before rendering it.
When the user explicitly selected Dots Feature Development, apply its
[planning-only boundary](../../references/feature-development.md). Use `$how`
for missing explanations of current code and `$prototype` when a product UI
choice needs observation before the page can be built.

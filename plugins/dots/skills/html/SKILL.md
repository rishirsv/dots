---
name: html
description: "Create or edit self-contained HTML reports, linked page sets, fragments, static mocks, and HTML template assets. Use for browser-openable artifacts; use ui-design for production interfaces."
---

# HTML

For every HTML task, read [Dots writing style](../../references/writing-style.md)
before drafting. Apply it to the visible prose and review that prose again before
delivery. Preserve quotations, code, required formats, and source uncertainty.

For a report, deliver one self-contained HTML page by default. If its parts
need independent URLs, use a linked page set. If the result must be embedded
elsewhere, deliver a fragment.

Use the shared 900px article layout for ordinary documents. Wrap all code and
diffs, including long identifiers, so readers do not scroll sideways. Keep code
copying exact, use an accessible copy icon, and avoid stacked bordered containers
around technical detail.

Do not use eyebrows above or beside headings. Start with the title; put
document metadata in the footer and keep review IDs in exported feedback.

Explain substantive material visually by default. Start plans with a diagram
that shows the phases, dependencies, decisions, or owners. Keep the full steps,
constraints, and verification after that overview. For reports and explainers,
identify the relationships the reader needs to understand and draw useful
views before writing the detailed prose. Read
[diagrams.md](references/diagrams.md) to select a form and an existing helper.
Use visuals to explain real information; do not add decorative diagrams to
meet a quota. Follow explicit format and template constraints.

For reviewable implementation plans or RFCs, read
[plans.md](references/plans.md). It adds behavior-led reading order, explicit
decisions, local comments and editable proposals, and one exported response.
For a pull request or implemented change, read
[pr-walkthroughs.md](references/pr-walkthroughs.md). It adds a behavior-led
walkthrough, exact source evidence, complete file coverage, and local review notes.
Read [interactivity.md](references/interactivity.md) when readers benefit from
state walkthroughs, code copying, or searching and sorting evidence tables.

## Report page loop

1. Identify the reader's question and the supplied claims and decisions.
   Choose the opening visual and the additional views that explain different
   parts of the answer. Preserve the evidence and detailed instructions. Use
   `recommendation()` only when the request or material supports a decision.
   Keep the default `report` tone for work artifacts; choose `personal` when
   the page is private or relational material written to one person, as
   described in [DESIGN.md](references/DESIGN.md#tones).
2. Find the needed report helpers with `node scripts/catalog.mjs --list` and
   `--help <helper>`. Write a `.page.mjs` module and build the HTML with
   `scripts/build.mjs`. The exact commands and source format are in
   [authoring.md](references/authoring.md#page-module-loop).
3. If the page has layout risk, run `scripts/capture-artifact.mjs` on the finished HTML.
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
and source labels. Add visual explanations within that order by default.
If the caller requires a fixed format, place visuals only where that format
allows them. Report contradictions that would change a claim.
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

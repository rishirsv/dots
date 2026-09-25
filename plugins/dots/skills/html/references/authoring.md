# Author report pages, linked sets, and fragments

Use a page module for a new standalone report. The visual style and shared
component rules live in [DESIGN.md](DESIGN.md). Linked sets and embeddable
fragments use the separate routes below.

## Page-module loop

1. Run `node scripts/catalog.mjs --list` to find a report helper, then
   `node scripts/catalog.mjs --help <helper>` for its signature, rules, and
   example. Use `assets/registry/registry.json` when choosing a hand-written
   component; the large galleries are for human visual review.
2. Write `<name>.page.mjs` with `export const kit = "report"` (the required
   format selector) and a default
   function `(helpers, data) => page(...)`. Put real `.json`, `.csv`, or `.txt`
   inputs beside the module and name them in `export const inputs`.
   `build.mjs` supplies the report helpers. Strings are escaped; the
   `html` and `svg` tagged templates preserve authored markup, and `raw()` is
   a deliberate opt-out.
3. Run `node scripts/build.mjs <name>.page.mjs --out <name>.html`. Build fails on
   missing sources for quantitative helpers, invalid report structure, and
   other helper contracts. `page()` adds a contents list for six or more
   top-level sections and collects distinct sources in the footer.
4. For pages with layout risk, run
   `node scripts/capture-artifact.mjs --in <name>.html --out-dir <shots>`.
   Add `--check` to the build command to build and run this check in one step;
   it writes captures and `report.json` beside the page at `<name>.html.capture/`.
   Open `sheet.png`, read `report.json`, and fix findings in the module. Inspect
   a full-page capture when the contact sheet cannot show the affected area.
   The check flags desktop figures that scroll inside their container, data
   marks under 24 px, and SVGs with a large unused area.
5. Deliver the self-contained HTML file. Keep the page module and inputs when
   continued editing is useful. For a portable edit loop, build with
   `--embed-source`; `node scripts/build.mjs --extract <page.html> --to <dir>`
   restores the module and inputs without executing them. Inspect extracted
   code before running it; extraction refuses to overwrite a directory.

`assets/outcomes/status-report.page.mjs` and
`decision-comparison.page.mjs` show complete modules.

## Choose the content and structure

Start with the reader's question and the supplied material. Use a title,
introduction, and sections for a typical report; add components where they help
the reader understand a point or make the requested decision.

- Use `stat-tiles` only for two to five supplied headline measures that matter
  at first glance; omit them when a chart already labels those values.
- Add a control only when the user requests it or the material requires a
  choice. If filtering, simulation, or mutable form state is the page's main
  purpose, use a product-UI workflow.
- Prefer one visual that explains the claim over several versions of it.

## Hand-written body fallback

1. Select components from `assets/registry/registry.json` and read only the
   matching fragment source. If a valid template manifest is supplied, inspect
   its retained reference instead. Human outcome galleries can help review
   visual treatment but are not an agent authoring input.
2. Start from `page-shell`, which supplies the context line, title, short
   introduction (`dek`), footer, and width mode. Choose
   `article` for prose-led work, `wide` for parallel evidence, and `canvas` for
   visual references. Keep canvas prose inside `.reading-column`. Inline
   `theme.css` verbatim before component CSS; never edit its tokens or add
   colors inline.
3. Preserve the source's reading order when it serves the reader. Otherwise
   choose a structure from [form-factors.md](form-factors.md). Each
   `<section id="...">` gets an `<h2>`; ids are short and stable. Add
   `toc-rail` for six or more sections or a long reference page needing
   non-linear lookup.
4. Choose components by their registry `when` and fragment header. Use
   `scripts/assemble.mjs` to inline the theme and selected CSS once around a
   real body fragment. Use `process-steps` for linear sequences and
   [diagrams.md](diagrams.md) when relationships need a figure. For raster
   images, follow [generated-images.md](generated-images.md) and reference the
   selected file with `data-embed-src` so the assembler embeds it.
5. Add `page-behavior` when the page needs motion, one-time reveals, TOC
   scroll-spy, or a theme toggle. Figures that should animate get
   `class="reveal"` on their container. Use it for charts and diagrams, not
   for text sections. Without `page-behavior`, the page remains static and
   complete.
   Generate the forms supported by `scripts/chart.mjs`; author other forms
   directly against the same tokens and accessibility rules. See
   [charts.md](charts.md#generate-supported-charts-build-others).
6. Use `recommendation` when the supplied material commits to a decision.
   Put appendix material (raw data, full logs, candidate configs) in
   `disclosure` blocks after the main argument.

### Fast assembly

Write the real section markup in a body fragment, including each component's
`data-component` attribute, then run:

```bash
node scripts/assemble.mjs \
  --title "Release readiness" \
  --context "project / release" \
  --dek "What is ready, what is blocked, and the next decision." \
  --layout article \
  --body /path/to/body.html \
  --out /path/to/release-readiness.html
```

`--components` is optional: the assembler includes registry components named
by `data-component` in the body, plus their dependencies. Use `--components`
for extra components such as `page-behavior` when needed. Add `--footer` only
when the content calls for it. `--layout` accepts `article`, `wide`, or `canvas`
and defaults to `article`. The assembler packages chosen CSS and behavior; it
does not select examples, components, content, or section order.

### Working source and finished page

Treat the module or body fragment as the working source; edit it and rebuild.
Source embedding is opt-in because it may put unused input rows or local paths
into the delivered file.

## Editing an existing page

Every component instance carries
`data-component="<name>"` on its root. To modify one, find the block by
attribute, open the same-named source in `assets/registry/`, and edit against
that fragment's structure. Keep the attribute when copying or adding components
so the next editor can find their source.
When the original body fragment is available, edit that source and reassemble;
use component-level editing of the finished file when it is the only source.

## Linked page sets

Use a linked page set when the user requests multiple pages or when a real
ordered sequence needs independent URLs, such as a workshop, course,
walkthrough, or multi-part guide. Keep a short document on one page; do not
split it merely to imitate a website.

1. Read [form-factors.md](form-factors.md#workshops-courses-and-other-page-sets)
   and outline each page by the reader question it answers and the transition
   it creates to the next page.
2. Write one body fragment per page. Choose the page's layout and existing
   content components independently; the shared navigation is not a reason to
   force every page into the same composition.
3. Put sequence order, page ids, labels, optional time/context, titles, body
   paths, output filenames, layouts, and component names in one manifest. Do
   not copy cross-page links into the body fragments:

   ```json
   {
     "schemaVersion": 1,
     "title": "Agentic product workshop",
     "lang": "en",
     "navigationLabel": "Workshop pages",
     "pages": [
       {
         "id": "introduction",
         "label": "Introduction",
         "time": "09:00–09:30",
         "title": "Start with one real task",
         "body": "01-introduction.body.html",
         "output": "index.html",
         "layout": "wide",
         "components": ["timeline", "wide-figure"]
       }
     ]
   }
   ```

   `id`, `label`, `title`, `body`, and `output` are required per page. Optional
   page fields are `time`, `context`, `dek`, `footer`, `layout`, `components`,
   `parent`, and `number`.

   For a learning site, give the manifest one root contents page, set each
   chapter's `parent` to that root id, and set each lesson's `parent` to its
   chapter id. Use `number` for reader-facing labels such as `2` or `2.1`:

   ```json
   { "id": "tool-use", "parent": "contents", "number": "2", "label": "Tool use", "title": "Tool use", "body": "tool-use.body.html", "output": "chapters/tool-use/index.html" }
   ```

   Sibling order still follows manifest order. The assembler rejects missing
   parents, multiple roots, and cycles.
4. Run `scripts/assemble.mjs --manifest <manifest.json> --out <directory>`.
   The target directory must not already exist. The script validates and
   renders the complete set before publishing it, and refuses to overwrite an
   existing set.
5. Use `sequence-nav` for movement between pages. In a hierarchical manifest,
   the assembler scopes that rail and previous/next controls to siblings,
   generates breadcrumbs, and adds `chapter-index` to parent pages. Do not copy
   curriculum links into body fragments. Use `toc-rail` only when one page also
   has six or more substantial sections or needs non-linear lookup within that
   page.

Every generated file is self-contained except for relative links to its peers.
Move or share the directory as one unit. A page must still read coherently when
opened directly.

## Fragment delivery

A fragment is one component shipped for embedding in a surface we don't
control — a Notion doc, a PR description, an email. Package it differently from
a full page:

- Wrap the component in `<div class="dots-block" data-component="...">` and
  scope the tokens to that wrapper instead of `:root`: copy the token block
  from theme.css into `.dots-block { ... }` plus
  `background: var(--background); color: var(--foreground); font-family:
  var(--font-sans);` and the component's own CSS rewritten under
  `.dots-block`. The fragment carries its own background and text style, so it
  reads as a complete block instead of partly inheriting the destination's fonts.
- No script, no reveals: keep behavior with the destination. Ship static — if the
  component's markup has `class="reveal"`, drop it (or add `is-in`);
  nothing may depend on our JS.
- No TOC and no general footer. One quiet caption line may name an
  authoritative reader-facing source when attribution helps. Never expose
  tool names, sessions, prompts, private paths, or scratch files.
- Dark mode: pick the variant matching the destination, or use the light
  background. Wrapper-scoped styles prevent the destination's theme from
  changing it.

The same visual style and real-content rules apply.

## Delivery

Prefer the platform's HTML creation tool when present. Otherwise write to the
location the user named — or ask where when it will be kept — and open it in
the browser. Name files and page-set directories for the content
(`sync-rollout-brief.html`, `agentic-product-workshop/`), not the skill.

Open the delivered file in a browser when claiming visual verification; reading
its source does not establish how it renders.

Treat delivery states precisely:

- **Standalone** means the local self-contained file is ready to open and
  share.
- **Linked page set** means every page is ready and the directory preserves the
  relative peer links. It does not mean the set is hosted.
- **Published** means the user explicitly asked for hosting, an available
  publishing workflow completed, and the resulting URL was opened and verified.
- If publishing is unavailable or fails, return the standalone file and state
  that it was not published. Never infer publication from file creation.

## Before delivery

For a render check, use the command in the page-module loop. Resolve its
findings before delivery and inspect full-page screenshots when the contact
sheet cannot show the affected area.

Review the source before delivery:

- Preserve the reasoning the reader needs. For each material finding in the
  source, keep its consequence and evidence; include an action only when the
  source or request supports one. Trace figures to their sources.
- Keep a page self-contained with no external requests. Keep a fragment scoped
  to one root with no page shell, document footer, script, reveal state, or
  dependency on host behavior.
- Use the design system and semantic HTML. Preserve native tab order and visible
  focus, label controls, provide equivalent text for informative figures, and
  pair color with text, shape, or line style.
- Ensure generated assets have a reader purpose, accurate alt text, useful
  context when needed, and no claim to be observed evidence.
- Remove internal working details, prompts, private paths, scratch files, and
  generation metadata.
- Lead with the subject. Omit title chips and directions about how to read or
  respond to the page unless the interaction actually needs them.

Layout risk includes custom CSS, a wide or canvas layout, product mocks,
diagrams, long or wide tables, and many sections. Inspect desktop and narrow
layouts and report exactly what was reviewed.

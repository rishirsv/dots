# Build a page, linked page set, or fragment

Use this when turning source material into a finished page or fragment. The
visual style and shared component rules live in
[DESIGN.md](DESIGN.md).

## Select structure

Use a simple title, introduction, sections, and only the components the content
needs by default. Add a table of contents, figures, pull quotes, motion, or a
theme toggle only when the page will be kept, shared, presented, or explicitly
needs stronger presentation. When unsure, choose the simpler page.

## Keep the page focused

Choose the smallest composition that answers the reader's question. Start with
the primary argument or dominant visual; add a component only when it carries
meaning the reader would otherwise miss.

- Do not invent search, filtering, reset, step, or parameter controls. Add a
  control only when the user requested it or the supplied material requires it,
  and use one visible mechanism per state.
- Show only metrics that explain the requested behavior. Do not create
  qualitative scores, status cards, KPI rows, repeated legends, or secondary
  fact grids to fill space.
- Use `stat-tiles` only when two to five supplied headline measures are central
  to the first read. Do not repeat values already labeled clearly on a chart.
- Prefer one compact dominant visual to several parallel treatments of the same
  claim. Crop empty composition space; wide and shallow is a useful default
  when the subject is not intrinsically square.
- Keep presentation-only interaction local and optional. If filtering,
  simulation, drill-down, mutable form state, or step-through control is the
  page's main value, use an interactive-visualization or product-UI
  workflow instead of building a half-interactive document.

## Read only what applies

For a small edit, read the page and the source for its named component. For a
new non-template page, also use the finished-page examples and component
catalog. For a novel canvas or important long-lived page, read `DESIGN.md` and
check the result with actual-page screenshots. Read specialized references
only when the page uses them.

## Page assembly

1. For a non-template page, open
   [the finished-page examples](../assets/outcomes/index.html), choose the
   preview closest to the reader's need, and inspect that page. It shows useful
   reading order, density, and use of evidence; it does not dictate an exact
   section list. Inspect a second example only when the first misses a distinct
   part of the request. When a valid template manifest is supplied, inspect its
   retained reference instead and do not load a generic outcome example.
2. Start from `page-shell`, which supplies the context line, title, short
   introduction (`dek`), footer, and width mode. Choose
   `article` for prose-led work, `wide` for parallel evidence, and `canvas` for
   visual references. Keep canvas prose inside `.reading-column`. Inline
   `theme.css` verbatim before component CSS; never edit its tokens or add
   colors inline.
3. Preserve a strong reading order already present in the source material. If
   it has none, use the selected example or choose suitable structures from
   [form-factors.md](form-factors.md); neither may supply missing claims or
   evidence. Outline sections before styling. Each
   `<section id="...">` gets an `<h2>`; ids are short and stable. Add
   `toc-rail` for six or more sections, or when a long reference page benefits
   from non-linear lookup. Omit it from short, simple pages; on narrow
   screens the component becomes a compact collapsible section.
4. Lead with `stat-tiles` only when supplied headline measures summarize the
   story; otherwise lead with the argument or the visual that answers the
   reader's question. Never lead with a figure the reader cannot parse yet.
5. Choose components in [the component atlas](../assets/atlas.html), then read
   their source files in `assets/registry/`; each header comment states when to
   use it. For a page with several components, use
   `scripts/assemble.mjs` to inline the theme and each selected component's CSS
   once around a real body fragment. For a small page, copying remains fine:
   copy the fragment's CSS into the page `<style>` (after theme.css) and the
   markup into place; replace every piece of example content.
   Duplicate-component CSS is copied once, markup as often as needed. Use
   `process-steps` for linear sequences. When relationships need a diagram,
   choose the exact family through [diagrams.md](diagrams.md) instead of forcing
   every structure into `flow-diagram`.
   When an original raster image earns a place, read
   [generated-images.md](generated-images.md), generate and inspect it through
   `imagegen`, copy the selected final into the workspace, and reference it with
   `data-embed-src`; the assembler embeds it as a data URI.
6. Add `page-behavior` only when the page needs motion, one-time reveals, TOC
   scroll-spy, or a theme toggle. Figures that should animate get
   `class="reveal"` on their container. Use it for charts and diagrams, not
   for text sections. Without `page-behavior`, the page remains static and
   complete.
   Generate the forms supported by `scripts/chart.mjs`; author other forms
   directly against the same tokens and accessibility rules. See
   [charts.md](charts.md#generate-supported-charts-build-others).
7. Close with `recommendation` when the document commits to something, then
   the sources footer. Appendix material (raw data, full logs, candidate
   configs) goes in `disclosure` blocks after the footer, never before the
   conclusion.

### Fast assembly

Write the real section markup in a body fragment, including each component's
`data-component` attribute, then run:

```bash
node scripts/assemble.mjs \
  --title "Release readiness" \
  --context "project / release" \
  --dek "What is ready, what is blocked, and the next decision." \
  --layout article \
  --components process-steps,callout,data-table \
  --body /path/to/body.html \
  --out /path/to/release-readiness.html
```

Add `--footer` or `page-behavior` in `--components` only when the content calls
for them. `--layout` accepts `article`, `wide`, or `canvas` and defaults to
`article`. The assembler packages chosen CSS and behavior; it does not select
examples, components, content, or section order.

### Working source and finished page

Treat the body fragment as the main working source while constructing an
assembled page. Edit it and rerun the assembler rather than hand-editing copied
theme or component CSS. Keep the fragment temporary by default; preserve
it beside the output only when the user requests continued source editing. The
single self-contained `.html` remains the deliverable.

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

Never run automated HTML structural validation.

Review the source before delivery:

- Preserve the reasoning the reader needs. For each material finding, keep the
  current behavior, consequence, recommendation, and proof gap. Trace figures
  to their sources.
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
- Remove title chips and system meta-narration. The page must not tell the
  audience how to read, review, navigate, use, or respond to the artifact, or
  describe its own structure. Lead with subject matter.

Use browser or rendered review when the user asks for it, when visual proof is
the task, or when the page carries meaningful layout risk: custom CSS, a wide
or canvas layout, product mocks, diagrams, long or wide tables, or six or more
sections. Inspect desktop and narrow layouts plus the states relevant to the
risk. Report exactly what was reviewed. Do not imply rendered or interaction
proof from source inspection.

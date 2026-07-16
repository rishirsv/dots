# Authoring an artifact

How to turn source material into a finished page or fragment. Read this when
assembling; the visual identity and global component rules live in
[DESIGN.md](DESIGN.md).

## Treatment calibration

Read the request, not the content size. Utilitarian is the default: title,
dek, sections, the components the content needs, no more. Editorial treatment
— TOC rail, figures, pull-quote, full motion, theme toggle — is earned by
artifacts that will be kept, shared, or presented. When unsure, build
utilitarian; a well-composed plain page is never wrong, an over-designed one
sometimes is. Signals for editorial: the user says "beautiful", "shareable",
"for the team"; the content is a keeper explainer or a decision brief going
to an audience; the request calls for a showcase.

## Page assembly

1. Start from `page-shell` — it is the invariant frame: context line, title
   (+ one status chip only if the document has a real status), dek, footer,
   and article column. Inline `theme.css` verbatim before component CSS; never
   edit its tokens or add colors inline.
2. Preserve a strong reading order already present in the source material. If
   it has none, choose the closest narrative job from
   [recipes.md](recipes.md); recipes arrange the content but never supply
   missing claims or evidence. Outline sections before styling. Each
   `<section id="...">` gets an `<h2>`; ids are short and stable. Add
   `toc-rail` for six or more sections, or when a long reference page benefits
   from non-linear lookup. Omit it from short utilitarian pages; on narrow
   screens the component becomes a compact native disclosure.
3. Lead with the instrument panel when numbers summarize the story
   (`stat-tiles`), or with prose when an argument does. Never lead with a
   figure the reader can't parse yet.
4. Pick components by their `when:` line in `registry.json`. For a page with
   several components, use `scripts/assemble.mjs` to inline the theme and each
   selected component's CSS once around a real body fragment. For a small page,
   copying remains fine: copy the fragment's CSS into the page `<style>` (after
   theme.css) and the markup into place; replace every piece of example content.
   Duplicate-component CSS is copied once, markup as often as needed. Use
   `process-steps` for linear sequences and reserve `flow-diagram` for branches.
5. Add `page-behavior` only when the page needs motion, one-time reveals, TOC
   scroll-spy, or a theme toggle. Figures that should animate get
   `class="reveal"` on their container. Use it for charts and diagrams, not
   for text sections. Without `page-behavior`, the page remains static and
   complete.
   Generate the forms supported by `scripts/chart.mjs`; author other forms
   directly against the same tokens and accessibility contract. See
   [charts.md](charts.md#generate-supported-forms-author-others).
6. Close with `recommendation` when the document commits to something, then
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
  --components process-steps,callout,data-table \
  --body /path/to/body.html \
  --out /path/to/release-readiness.html
```

Add `--status`, `--footer`, or `page-behavior` in `--components` only when the
content calls for them. The assembler packages chosen CSS and behavior; it does
not select components, invent content, or impose a section order.

## Editing an existing artifact

Rendered artifacts are machine-editable: every component instance carries
`data-component="<name>"` on its root. To modify one, find the block by
attribute, look its name up in `registry.json`, and edit against that
fragment's anatomy — never guess structure from the markup. Keep the
attribute when copying fragments and when adding instances; an artifact
whose blocks have lost their names is opaque to the next editor.

## Fragment delivery

A fragment is one component shipped for embedding in a surface we don't
control — a Notion doc, a PR description, an email. The packaging rules
invert from page mode:

- Wrap the component in `<div class="dots-block" data-component="...">` and
  scope the tokens to that wrapper instead of `:root`: copy the token block
  from theme.css into `.dots-block { ... }` plus
  `background: var(--background); color: var(--foreground); font-family:
  var(--font-sans);` and the component's own CSS rewritten under
  `.dots-block`. The fragment carries its own ground — it should read as a
  card from our world sitting in the host's, not half-inherit the host's
  fonts and break the alpha ladder.
- No script, no reveals: the host owns behavior. Ship static — if the
  component's markup has `class="reveal"`, drop it (or add `is-in`);
  nothing may depend on our JS.
- No TOC and no general footer. One quiet caption line may name an
  authoritative reader-facing source when attribution helps. Never expose
  tool names, sessions, prompts, private paths, or scratch files.
- Dark mode: pick the variant matching the destination, or ship the light
  ground — scoped tokens mean the host's theme can't flip ours.

The design system, real-content rule, and token discipline apply unchanged.

## Delivery

Prefer the platform artifact tool when present. Otherwise write to the location
the user named — or ask where when it's a keeper — and open it in the browser
for them. Name files for the content (`sync-rollout-brief.html`), not the skill.

## Verification

Before handoff, render and check — headless screenshots are fine for most
passes, a real browser for keepers:

### Page verification

- **Widths**: 1280, 768, 360. No page-level horizontal scroll at any of
  them; wide tables/code scroll inside their containers; the TOC rail docks
  in the margin at wide widths, remains visible while the article scrolls,
  and sits inline at narrow ones. A long rail scrolls internally instead of
  running below the viewport.
- **Responsive components**: linear `process-steps` remain fully visible;
  stacked tables show every cell label; title and status never overlap; wide
  figures and evidence galleries keep captions and focal content readable.
- **Dark mode**: force `data-theme="dark"` (or emulate
  `prefers-color-scheme`). Text stays readable, chart emphasis still reads,
  code surface stays dark, no hard-coded colors leak through.
- **Reduced motion**: with `prefers-reduced-motion: reduce`, the page is
  fully static and complete.
- **JS off**: everything renders; reveals are visible; details open natively;
  only the theme toggle and scroll-spy go quiet.
- **Design system**: compare the artifact against [DESIGN.md](DESIGN.md),
  including its tokens, visual rationale, component rules, and Do's and Don'ts.
- **Honesty sweep**: every number traceable; helpful reader-facing sources
  included; internal provenance omitted; gaps marked, not smoothed.

### Fragment verification

- **Boundary**: one scoped root; no `:root`, page shell, document-level
  footer, script, reveal state, or dependency on host behavior.
- **Widths**: render inside a minimal host at 1280, 768, and 360. The fragment
  does not create page-level horizontal scroll.
- **Ground**: its scoped tokens set an explicit background, foreground, and
  font; host CSS and theme changes do not make it illegible.
- **Design and honesty**: apply the same design-system and honesty checks as
  a page.

Report what was verified with the artifact; if a check was skipped, say so.

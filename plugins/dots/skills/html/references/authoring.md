# Authoring an artifact

How to go from formed content to a finished page. Read this when assembling;
the identity rules in SKILL.md always apply.

## Treatment calibration

Read the request, not the content size. Utilitarian is the default: title,
dek, sections, the components the content needs, no more. Editorial treatment
— TOC rail, figures, pull-quote, full motion, theme toggle — is earned by
artifacts that will be kept, shared, or presented. When unsure, build
utilitarian; a well-composed plain page is never wrong, an over-designed one
sometimes is. Signals for editorial: the user says "beautiful", "shareable",
"for the team"; the content is a keeper explainer or a decision brief going
to an audience; the handoff skill asked for a showcase.

## Assembly order

1. Start from `page-shell` — it is the invariant frame: context line, title
   (+ one status chip only if the document has a real status), dek, footer,
   behavior script. The header wrapper carries `class="stagger"` for the
   load moment.
2. Outline sections before styling anything. Each `<section id="...">` gets
   an `<h2>`; ids are short and stable. 4+ sections → add `toc-rail` with
   matching hrefs.
3. Lead with the instrument panel when numbers summarize the story
   (`stat-tiles`), or with prose when an argument does. Never lead with a
   figure the reader can't parse yet.
4. Pick components by their `when:` line in `registry.json`. Copy the
   fragment's CSS into the page `<style>` (after theme.css) and the markup
   into place; replace every piece of example content. Duplicate-component
   CSS is copied once, markup as often as needed.
5. Figures that should animate get `class="reveal"` on their container —
   the shell script and theme.css do the rest. Use it for charts and
   diagrams, not for text sections.
   Charts are generated, not hand-authored: `scripts/chart.mjs` emits the
   finished fragment from a JSON spec — see
   [charts.md](charts.md#generate-dont-hand-author).
6. Close with `recommendation` when the document commits to something, then
   the sources footer. Appendix material (raw data, full logs, candidate
   configs) goes in `disclosure` blocks after the footer, never before the
   conclusion.

## Editing an existing artifact

Rendered artifacts are machine-editable: every component instance carries
`data-component="<name>"` on its root. To modify one, find the block by
attribute, look its name up in `registry.json`, and edit against that
fragment's anatomy — never guess structure from the markup. Keep the
attribute when copying fragments and when adding instances; an artifact
whose blocks have lost their names is opaque to the next editor.

## Motion choreography

The page has exactly three motion moments, all provided by theme.css +
page-shell — do not author new keyframes per artifact:

- **Load**: the header staggers in (`.stagger`), ≤400ms total.
- **Scroll**: `.reveal` containers rise once when entering the viewport;
  bars inside them grow once. Never re-trigger.
- **Micro**: hover/focus transitions and TOC active state.

If a component seems to need bespoke animation, the answer is almost always
no — the identity reads as precise because motion is scarce.

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
- No shell script, no reveals: the host owns behavior. Ship static — if the
  component's markup has `class="reveal"`, drop it (or add `is-in`);
  nothing may depend on our JS.
- No TOC and no general footer. One quiet caption line may name an
  authoritative reader-facing source when attribution helps. Never expose
  tool names, sessions, prompts, private paths, or scratch files.
- Dark mode: pick the variant matching the destination, or ship the light
  ground — scoped tokens mean the host's theme can't flip ours.

Everything else (identity rules, real content, tokens only) applies
unchanged.

## Delivery

Prefer the platform artifact tool when present (self-contained page,
data-URI assets only). Otherwise write to the location the user named — or
ask where when it's a keeper — and open it in the browser for them. Name
files for the content (`sync-rollout-brief.html`), not the skill.

## Verification

Before handoff, render and check — headless screenshots are fine for most
passes, a real browser for keepers:

- **Widths**: 1280, 768, 360. No page-level horizontal scroll at any of
  them; wide tables/code scroll inside their containers; the TOC rail docks
  in the margin at wide widths and sits inline at narrow ones.
- **Dark mode**: force `data-theme="dark"` (or emulate
  `prefers-color-scheme`). Text stays readable, chart emphasis still reads,
  code surface stays dark, no hard-coded colors leak through.
- **Reduced motion**: with `prefers-reduced-motion: reduce`, the page is
  fully static and complete.
- **JS off**: everything renders; reveals are visible; details open natively;
  only the theme toggle and scroll-spy go quiet.
- **Identity sweep**: one background; zero left accent stripes; ≤1 chip; no
  uppercase eyebrows; accent count ≤ links + active + one data point; digits
  aligned with tabular-nums.
- **Honesty sweep**: every number traceable; helpful reader-facing sources
  included; internal provenance omitted; gaps marked, not smoothed.

Report what was verified with the artifact; if a check was skipped, say so.

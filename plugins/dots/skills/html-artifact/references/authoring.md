# Authoring Rules

Use this file for runtime behavior: semantic HTML, primitive anatomy, static
output rules, and content hygiene. Use [../assets/theme.css](../assets/theme.css)
for exact runtime CSS values and primitive styling, and use
[design.md](design.md) for the visual rationale behind those
rules.

## Semantic-first HTML

- Use native elements for meaning and behavior: `main`, `article`, `section`,
  `header`, `footer`, `nav`, `aside`, `h1`-`h6`, `p`, `ul`/`ol`/`li`,
  `dl`/`dt`/`dd`, `table`, `figure`/`figcaption`, `blockquote`, `time`,
  `pre`/`code`, `details`/`summary`, `button`, `form`, `label`, `input`.
- Use `div`/`span` only as layout or inline styling glue.
- Do not add ARIA roles when a native element already provides the semantics.
- The document must still read top-to-bottom if CSS and JS fail.

## Primitive Anatomy

Borrow shadcn's component-anatomy discipline as plain HTML, not as a dependency:

- The page shell carries both `data-artifact="<recipe>"` and
  `data-primitive="artifact-shell"`.
- Every reusable major block carries exactly one `data-primitive` from
  [primitives.md](primitives.md).
- Every reusable internal part carries a stable `data-slot`.
- `data-variant` is set only for variants documented in the primitive catalog.
- `data-state` is set only for meaningful state: severity, status, active,
  recommended, copied, pass, blocked, add, delete, or context.
- CSS selectors may target these data attributes.
- Reader-facing copy must not expose primitive names, slot labels, variant
  labels, `data-*` values, or authoring scaffolding.

The reference sheet may show anatomy only where it is clearly part of a code
specimen or compact reference label. Its explanatory prose and copy/export
payloads must stay reader-safe.

## Static Output Rules

- Deliver one `.html` file with inline CSS in a `<style>` block.
- Inline the canonical block from [../assets/theme.css](../assets/theme.css)
  verbatim, including its `html-artifact:theme.css` marker comments.
- Artifact-local CSS may follow the canonical block only for content-specific
  layout, diagrams, or evidence sizing. It must not redefine `:root` tokens or
  target canonical `[data-primitive=...]` selectors; primitive changes belong in
  `theme.css`.
- Use tiny inline JS only when interaction changes the reader job: copy/export,
  tabs/filtering, simple calculators, or scroll-spy.
- The artifact must read fully with JS disabled.
- No server, build step, bundler, CDN, external stylesheet, Tailwind runtime,
  shadcn runtime, React, JSON IR, Mermaid, Chart.js, Prism, or Web Awesome.
- Embed needed images/assets so the delivered file remains self-contained.

## Motion

Motion is optional, small, and purposeful. Use it only when it clarifies a
relationship or a state change — never as continuous decoration.

- Animate state and disclosure transitions (a copy confirmation, a reveal, a
  before/after wipe), not idle ambient motion. No looping orbs, drifting
  gradients, or perpetual shimmer.
- Keep durations short and easings standard. Use the motion values in
  [../assets/theme.css](../assets/theme.css); do not invent one-off animation
  timings inside local artifact CSS.
- When any animation is present, honor reduced motion. Wrap motion in
  `@media (prefers-reduced-motion: no-preference) { … }` or neutralize it inside
  `@media (prefers-reduced-motion: reduce)`, so the artifact is fully usable and
  the final state is visible with motion disabled.
- Motion never gates content: the reader reaches every state without waiting on
  or triggering an animation. The `motion-proof` primitive is the only place a
  reduced-motion fallback is shown as an explicit specimen.

## Images & Screenshots

Screenshots and captures carry evidence in QA, audit, and handoff artifacts.
Treat them as figures, not decoration.

- Wrap each capture in `figure` with a `figcaption`. Use a meaningful `alt` that
  states what the image shows for evidence images; use empty `alt=""` only when
  the image is purely decorative and the caption already carries the meaning.
- Give every `img` explicit `width` and `height` attributes (or an aspect-ratio
  box) so layout does not shift as images load and the reflow check stays stable.
- Lazy-load below-the-fold captures with `loading="lazy"`; keep the first
  evidence image eager so the first viewport is complete.
- Contain images: `max-width: 100%`, `height: auto`, and a framed wrapper so a
  full-resolution capture never forces page-level horizontal scroll.
- Embed real captures (data URIs or inline SVG schematics in fixtures); never
  ship placeholder photos or abstract mockups in an artifact that claims visual
  QA. Watch the self-contained file size — prefer right-sized captures over
  full-resolution dumps, and note when a capture was downscaled.

## Large Documents

Long artifacts stay readable through structure first, not heavy tooling.

- Chunk by structure: real `section` landmarks, a `section-nav` for four or more
  sections, and native `details`/`summary` where progressive disclosure helps.
- Reach for `content-visibility: auto` (with a `contain-intrinsic-size` hint)
  only on heavy below-the-fold sections after a browser check confirms scroll
  position, in-page anchors, and find-in-page still behave. It is an
  optimization, never a substitute for chunking.
- Keep the single-file contract: no pagination server, no lazy-loaded routes.

## Polish And Tightness Pass

Before browser QA, run an editorial pass for density, containment, and honest
structure:

- **First viewport:** title, artifact type, and the answer, verdict, or
  recommendation are visible without scrolling.
- **Section economy:** every major section changes what the reader understands
  or can do; remove any section that exists only because the recipe listed it.
- **Panel economy:** panels are for grouped data, code, evidence, screenshots,
  gates, or findings; do not wrap ordinary prose in cards.
- **Density:** prefer compact rows, lists, and tables over giant cards when the
  reader is scanning.
- **State clarity:** every status is conveyed by text or a glyph, not color
  alone.
- **Mobile containment:** tables, code, diffs, screenshots, and diagrams scroll
  internally or collapse; they never force page-level horizontal scroll.
- **Callout discipline:** merge adjacent callouts or promote them to a real
  section.
- **Primitive test:** every primitive should answer why it is easier than prose.
- **Evidence gaps:** mark unknowns and evidence limits instead of filling empty
  cells.

## Adapting Primitives

- Preserve the primitive root and required slots.
- Use documented variants only.
- If the content needs a one-off structure, use semantic HTML first.
- Add a new primitive only when the pattern recurs across recipes or is central
  to a reader job.
- Never create one-off visual components that only make the page prettier.

## Source Grounding

- Read the named source material before authoring.
- Include file paths, commands, source names, or evidence only when they belong
  to the user's actual artifact.
- Mark unknowns as unknown instead of fabricating metrics or provenance.
- Use `audit-trail` for research, review, and QA artifacts that need trust.

## Portable Payload Hygiene

The reusable source files must stay generic. Before handoff or commit, scan the
payload for source contamination:

- provider or model names that are not part of the reusable contract
- raw research URLs, research commands, or web-fetch transcripts
- `.agents/`, scratch paths, thread IDs, local plan filenames, or session notes
- one-off user wording copied into runtime examples
- source-specific author names or article titles in generic demos
- stale version labels when the contract is not versioned

If a term appears only because it is the user's source material for a generated
artifact, it may appear in that artifact. It should not appear in the reusable
source payload or generic reference sheet examples.

## Dark mode

Every artifact ships dark mode and the `theme-toggle` moon button, implemented
identically from [../assets/theme.css](../assets/theme.css):

- Emit the light tokens on `:root` and the same dark values in both
  `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` and
  `:root[data-theme="dark"]`. Dark mode must render with **JS disabled** from the
  media query alone.
- Include the anchored `theme-toggle` button and its tiny inline script; the
  script only adds manual override (`data-theme` on `<html>`) and `localStorage`
  persistence. With JS off the button is inert and the OS preference wins.
- Keep code and panel surfaces dark in both themes via
  `--code-surface`/`--code-text`; never key them off text color variables.
- Verify contrast in both themes; watch hard-coded badge, pill, and warning
  colors that need a lighter value in dark.

## Anti-patterns

- Decorative gradient blobs or orbs that carry no information.
- Colored left rails, orange accent stripes, or callout bars used as default
  emphasis. Structure notes with labels, rules, spacing, and full borders.
- Generic generated-dashboard chrome: fake KPIs, unexplained pills, filler
  sparklines, arbitrary numbered chips, or sidebars that do nothing.
- Nested cards for page sections.
- Placeholder screenshots or abstract product mockups in reader artifacts. Use
  real captures when the artifact claims visual QA.
- Dense uncontained tables or code blocks that force page-level horizontal
  scroll.
- Low-contrast text.
- Visible authoring scaffolding in reader artifacts.
- Continuous decorative motion, or animation with no `prefers-reduced-motion`
  fallback so the final state is unreachable with motion disabled.
- Images with no dimensions (layout shift on load), uncaptioned evidence
  screenshots, or placeholder/abstract mockups in an artifact claiming visual QA.
- Source-generic reference sheet copy that preserves project-specific research
  trail, scratch paths, or session notes.

## External Systems

Pico, missing.css, Open Props, Every Layout, Tailwind, and shadcn are research
references only. The runtime authoring model is semantic HTML, the local
primitive catalog, and the canonical CSS in
[../assets/theme.css](../assets/theme.css).

Rendered QA uses an available browser tool, recording the tool used and any
fallback reason (see [validation.md](validation.md)). Do not add a
browser-automation dependency to verify an artifact.

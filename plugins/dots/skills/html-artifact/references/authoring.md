# Authoring Rules

Use this file for runtime behavior: semantic HTML, primitive anatomy, static
output rules, and content hygiene. Use [DESIGN.md](DESIGN.md) for all visual
tokens, component styling, palette, type, spacing, radius, and design rationale.

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
  labels, `data-*` values, or template machinery.

The primitive atlas is the only exception: it may display anatomy labels because
it is reference material, not a reader artifact.

## Static Output Rules

- Deliver one `.html` file with inline CSS in a `<style>` block.
- Use [DESIGN.md](DESIGN.md) as the token source; emit CSS variables from its
  YAML values rather than duplicating hardcoded values throughout references.
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
- Keep durations short and easings standard. Use the motion tokens in
  [DESIGN.md](DESIGN.md): `motion-fast` (~120ms) for taps and toggles,
  `motion-base` (~200ms) for reveals, `motion-slow` (~320ms) for larger
  before/after transitions; ease-out for entrances, ease-in-out for toggles.
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

## Source Grounding

- Read the named source material before authoring.
- Include file paths, commands, source names, or evidence only when they belong
  to the user's actual artifact.
- Mark unknowns as unknown instead of fabricating metrics or provenance.
- Use `audit-trail` for research, review, and QA artifacts that need trust.

## Portable Payload Hygiene

The skill's own reusable files must stay generic. Before handoff or commit, scan
the skill payload for runtime contamination:

- provider or model names that are not part of the reusable contract
- raw research URLs, research commands, or web-fetch transcripts
- `.agents/`, scratch paths, thread IDs, local plan filenames, or session notes
- one-off user wording copied into runtime examples
- source-specific author names or article titles in generic demos
- stale version labels when the skill contract is not versioned

If a term appears only because it is the user's source material for a generated
artifact, it may appear in that artifact. It should not appear in the portable
skill payload or generic atlas examples.

## Dark mode

Every artifact ships dark mode and the `theme-toggle` moon button, implemented
identically (see [DESIGN.md](DESIGN.md#dark-mode) for the canonical tokens,
button, and script):

- Emit the light tokens on `:root` and the same dark values in both
  `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` and
  `:root[data-theme="dark"]`. Dark mode must render with **JS disabled** from the
  media query alone.
- Include the anchored `theme-toggle` button and its tiny inline script; the
  script only adds manual override (`data-theme` on `<html>`) and `localStorage`
  persistence. With JS off the button is inert and the OS preference wins.
- Keep code and panel surfaces dark in both themes via
  `--code-surface`/`--code-text`; never key them off `--ink`.
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
- Visible template machinery in reader artifacts.
- Continuous decorative motion, or animation with no `prefers-reduced-motion`
  fallback so the final state is unreachable with motion disabled.
- Images with no dimensions (layout shift on load), uncaptioned evidence
  screenshots, or placeholder/abstract mockups in an artifact claiming visual QA.
- Source-generic atlas copy that preserves the research trail used to build the
  skill.

## External Systems

Pico, missing.css, Open Props, Every Layout, Tailwind, and shadcn are research
references only. The runtime authoring model is semantic HTML, the local
primitive catalog, and the design tokens in [DESIGN.md](DESIGN.md).

Rendered QA uses an available browser tool, recording the tool used and any
fallback reason (see [browser-checks.md](browser-checks.md)). Do not add a
browser-automation dependency to verify an artifact.

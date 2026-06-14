# Explainer Design System

The visual and interaction contract for `unpack` HTML explainers. `DESIGN.md`
owns the look, motion, and composition rules; the concrete component markup and
build workflow live in
[html-explainer-design.md](html-explainer-design.md). The
canonical tokens, base styles, and JS helpers ship inside
[../assets/html-explainer-template.html](../assets/html-explainer-template.html) — keep
that `<style>`/`<script>` kit intact and compose the body from it.

The aesthetic is warm editorial-technical: an ivory paper canvas, serif display
headings, system-sans body, monospace for machine voice, one terracotta accent,
and structure carried by hairline borders and whitespace rather than shadows or
gradients.

## Artifact Promise

An explainer earns the HTML format only when it makes one hard relationship
visible faster than Markdown could. Before the reader scrolls, the first viewport
shows the answer, what was inspected, confidence, and the dominant visual. If the
page is a styled wall of text, ship Markdown instead.

Build a bespoke document for the material — never a filled-in template. Pick the
archetype first, compose only the modules it needs, and delete the rest.

## Tokens

Use the semantic CSS variables from the asset's `:root`. Roles, not raw hex:

| Role | Token | Use |
|---|---|---|
| Canvas | `--ivory` | page background |
| Surface | `--paper` | cards, panels, code-card chrome |
| Ink | `--slate` | headings, body, dark panels |
| Warm grays | `--g100 --g300 --g500 --g700` | fills, borders, muted text |
| Focus | `--clay` / `--clay-d` | the one thing that matters: active path, hot node, emphasis rail |
| Good | `--olive` | success, confirmed, added, done |
| Bad | `--rust` | failure, danger, removed |
| Alt | `--sky` | a second series or category when clay is taken |
| Soft fill | `--oat` | secondary bars, avatars, medium severity |

Color is the scarcest resource. Most of the page is ink-on-ivory with gray
structure; clay appears only on the hot path. If position, grouping, or a label
can carry the meaning, do not spend color on it.

## Typography

- Display/headings: serif, weight 500. `h1` 34–56px, `h2` 27px, `h3` 18–19px,
  letter-spacing `-.012em`. Italic in clay for the one emphasized phrase in `h1`.
- Body: system sans, 16px, line-height 1.6.
- Machine voice: mono for file paths, line numbers, section indices, metric
  deltas, axis labels, eyebrows, and code.
- Small-caps labels: 11–12px, uppercase, letter-spacing `.05–.08em`, gray.
  Letter-spacing is `0` everywhere else.

Serif is the human voice (every heading); mono is the machine voice (every exact
name). Keeping them distinct is most of the visual identity.

## Motion

Motion is functional and quiet. Stay inside this budget:

- Entrance: sections fade-and-rise once as they enter view (`.reveal`). Content
  is fully visible without JS — never gate meaning behind animation.
- Data: chart bars grow and lines draw on load; this ties motion to the number.
- Affordance: 120–160ms hover lifts, tab/accordion swaps, the rotating `▸` on
  `<details>`.
- Honor `prefers-reduced-motion` (the kit already does).

No parallax, autoplaying loops, decorative bouncing, or motion that delays
reading. A live control (slider, toggle) is welcome when manipulating it *is* the
explanation.

The kit ships a fixed set of interaction primitives (step-through player, node
detail, scroll-spy, reading-level toggle, glossary, tooltip, live control,
collapsible diff, filter/sort table) wired from `data-*` attributes — see the
build guide. Two rules keep them clean: motion animates only transform/opacity,
never width/height/padding; and any floating layer (tooltip, detail panel) is
appended to `<body>` so an `overflow:auto` box never clips it. Each must reveal,
change the model, compare, or navigate — never decorate.

## Avoid The Generated-UI Tells

These patterns mark a page as machine-made. None belong in an explainer:

- No gradients as decoration — no gradient text, gradient buttons, gradient
  "orbs," or repeating-gradient stripes. Surfaces are flat ivory or paper.
- No glassmorphism, frosted blur, or neon glow. Depth is a hairline border, not
  a wide diffuse shadow — commit to an edge or an elevation, never both.
- No one-sided thick colored "side-tab" border on a rounded card — the most
  recognizable tell. Emphasize with a subtle tint, a leading marker, or a
  colored number instead.
- No icon tile stacked above a heading; no icon larger than the text it labels.
- Hierarchy comes from real size/weight/family contrast (serif/sans/mono), not
  one font at near-equal sizes. Keep at least a 1.25 ratio between type steps.
- Cards top out at 16px radius; full-pill is only for tags and buttons. Never
  nest a card inside a card.
- SVG is for precise diagrams and charts only — never hand-drawn mascots or
  decorative doodles. If a real diagram would not help, ship none.
- Copy is precise and technical: say it once. No hype words, no
  label+sublabel+hint all repeating the same thing.

The serif headline and mono eyebrow are a deliberate editorial register, not the
AI-startup hero tell: keep the italic to a single phrase and make the eyebrow
informational (material type + subject), never a decorative chip.

## Layout Grammar

A single centered column, `min(1080px, 100vw − 40px)`. Top to bottom:

1. **Masthead** — mono eyebrow, serif answer-as-title (not a topic), one-line
   lead, and a right metadata sidebar (material, sources read, confidence).
2. **Provenance strip** — compact key/value row of the load-bearing facts.
3. **Dominant visual** — the archetype's main structure: flow, map, timeline,
   ladder, diff, matrix, chart, or live demo.
4. **Evidence & detail** — source-anchored snippets, optional two-column layout
   with a sticky "on this page" nav or glossary.
5. **Carry forward** — what this means, what to watch, or what to copy next.

Prefer rules, alignment, and whitespace over boxes. Reach for a card only for
repeated evidence snippets or genuine tool-like controls; never nest cards.

## First Viewport Contract

The first screen is a composed article opening, not a title page and not a
dashboard. The reader should be able to answer "what is the takeaway, what was
this based on, and how confident is it" before scrolling. Do not spend the first
viewport on an oversized hero alone.

## Archetypes

Choose one before writing content; it decides the dominant visual and which
modules survive.

| Material | Dominant visual | Core modules |
|---|---|---|
| Feature / request flow | boxes-and-arrows flow with a hot path | flow diagram, annotated code, evidence rows |
| Code understanding / module map | dependency graph or swimlanes | flow diagram, numbered walkthrough with per-step source |
| Stack trace / debugging | frame ladder to a cause boundary | steps, dark code, watch list |
| Diff / review | annotated diff + margin notes | diff, review-note callouts, risk tags |
| State machine / lifecycle | state nodes + allowed transitions | flow diagram, decision diamonds, comparison table |
| Config / API | matrix + request/response | tabbed code, table, copy buttons |
| Incident / report | timeline + impact bands | timeline, stat band, chart, action checklist |
| Implementation plan | milestone timeline + data flow | milestones, flow diagram, risk table, code |
| Concept explainer | one diagram + a small live control | live demo, comparison table, glossary |
| Status / metrics | chart + metric tiles | stat band, bar/line chart, table |

## Evidence Grammar

When the explainer is grounded in code, logs, errors, or docs, evidence is an
interface, not a paragraph. Each load-bearing claim carries a source chip (path,
frame, doc, URL), a status (confirmed, inferred, assumption), the smallest useful
snippet, and a plain-language note on why it changes the reading. Never paste a
whole file; never include secrets or unrelated private source.

## Verification Rubric

Open the rendered file and check more than "it loads":

- First viewport answers the question and shows provenance.
- A real spatial model or chart, not a styled list.
- Load-bearing claims are source-anchored or marked as inference.
- Interactions reveal evidence, change the model, compare, or export — nothing
  decorative.
- No leftover sample content, placeholders, or unused empty sections.
- Desktop and mobile widths: readable text, no overlap, no horizontal page
  scroll (diagrams and code may scroll inside their own box).
- A reader learns the shape of the system faster than from Markdown.

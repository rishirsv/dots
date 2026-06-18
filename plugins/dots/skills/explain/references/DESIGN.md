# Explain Design System

The visual and interaction contract for `explain` HTML explainers. `DESIGN.md`
owns the look, motion, and composition rules; the concrete component markup and
build workflow live in
[html-explainer-design.md](html-explainer-design.md). The
canonical tokens, base styles, and JS helpers ship inside
[../assets/html-explainer-template.html](../assets/html-explainer-template.html) — keep
that `<style>`/`<script>` kit intact and compose the body from it.

The aesthetic is a quiet product workbench: white canvas, neutral product
chrome, sans typography, monospace for machine voice, one green active path, one
rust cause boundary, and structure carried by hairline rules and whitespace
rather than shadows, gradients, chips, or nested cards.

## Artifact Promise

An explainer earns the HTML format only when it makes one hard relationship
visible faster than Markdown could. Before the reader scrolls, the first viewport
shows the answer, what was inspected, confidence, and the dominant visual. If the
page is a styled wall of text, ship Markdown instead.

Build a bespoke document for the material — never a filled-in template. Pick the
archetype first, compose only the modules it needs, and delete the rest.

## Design Decision Loop

Start from the reader's comprehension problem, not from the component catalog.

1. Classify the intent: concept, flow, ownership, issue trace, change pressure,
   failure path, concept-to-code bridge, or status.
2. Earn the format: if one hard relationship does not become clearer than it
   would in Markdown, ship Markdown.
3. Pick the recipe or archetype, then build its dominant visual first.
4. Add a primitive only when it reduces effort around evidence, causality,
   ownership, comparison, navigation, or uncertainty.
5. Mark load-bearing claims as confirmed, inferred, assumption, or gap. Put
   confidence and inspected sources in the first viewport.
6. Make carry-forward an investigative next move unless the user asked for an
   implementation plan.
7. Delete unused modules and run the verification rubric.

Avoid overfitting tells: one hot path only; no meter without a number or label;
no lane without a real owner; no stepper that merely repeats a static diagram;
and no rust everywhere just because the subject is failure-flavored.

## Tokens

Use the semantic CSS variables from the asset's `:root`. Roles, not raw hex:

| Role | Token | Use |
|---|---|---|
| Canvas | `--ivory` | white page background |
| Surface | `--paper` | tool panels, code-card chrome, table surfaces |
| Ink | `--slate` | headings, body, dark panels |
| Neutral grays | `--g100 --g300 --g500 --g700` | fills, hairline borders, muted text |
| Focus | `--clay` / `--clay-d` | the one thing that matters: active path, hot node, confirmed text |
| Good | `--olive` | success, confirmed, added, done |
| Bad | `--rust` | failure, danger, removed |
| Alt | `--sky` | a second series or category when clay is taken |
| Soft fill | `--oat` | secondary bars, avatars, medium severity |

Color is the scarcest resource. Most of the page is black-on-white with gray
structure; green appears only on the active investigative path or confirmed
source signal. Rust marks the cause boundary or failure edge. If position,
grouping, or a label can carry the meaning, do not spend color on it.

## Investigative Mode

Do not add a separate "lab" theme for debugging or issue explainers. The
workbench tokens already carry the needed semantics: green for the active path
or confirmed signal, rust for the cause boundary or failure edge, mono for exact
source names, and plain gap labels for uninspected evidence. Signal
investigation with the recipe, eyebrow, provenance, evidence states, and
carry-forward wording, not with a second visual system.

## Typography

- Display/headings: sans, weight 600. `h1` 34–48px, `h2` 22px, `h3` 18px,
  letter-spacing `0`. Do not italicize or color one word in the `h1` by default.
- Body: system sans, 15px, line-height 1.55.
- Machine voice: mono for file paths, line numbers, section indices, metric
  deltas, axis labels, eyebrows, and code.
- Metadata labels: 11–12px mono, gray, letter-spacing `0`. Use uppercase only
  inside diagrams when it helps lane scanning. Letter-spacing is `0` elsewhere.

Sans is the product voice; mono is the machine voice for exact source names,
line numbers, axis labels, and short state labels. Keeping product text and
machine text distinct is most of the visual identity.

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
- Hierarchy comes from real size/weight/family contrast (sans/mono and scale), not
  one font at near-equal sizes. Keep at least a 1.25 ratio between type steps.
- Cards top out at 8px radius. Avoid chips and pills; use plain text labels or
  table rows for status, section metadata, sources, and navigation. Never nest a
  card inside a card.
- SVG is for precise diagrams and charts only — never hand-drawn mascots or
  decorative doodles. If a real diagram would not help, ship none.
- Copy is precise and technical: say it once. No hype words, no
  label+sublabel+hint all repeating the same thing.

The app chrome, answer headline, and mono eyebrow are a deliberate workbench
register, not a startup hero. Keep the eyebrow informational (material type +
subject), never a decorative chip.

## Layout Grammar

A single centered product workbench column, `min(1160px, 100vw − 32px)`. Top to
bottom:

1. **Appbar** — quiet mark, one or two anchor links, and at most one command
   button such as "Copy next move".
2. **Masthead** — mono eyebrow, sans answer-as-title (not a topic), one-line
   lead, and a right metadata rail (material, sources read, confidence).
3. **Provenance strip** — compact key/value row of the load-bearing facts,
   using rules rather than a rounded card.
4. **Dominant workbench** — the archetype's main structure: flow, map, timeline,
   ladder, diff, matrix, chart, live demo, or trace canvas with an inspector.
5. **Evidence & detail** — source-anchored snippets as flat rows, optional
   two-column layout with a sticky inspector/nav/glossary.
6. **Carry forward** — what this means, what to watch, or what to copy next.

Prefer rules, alignment, and whitespace over boxes. Reach for a card only for a
single genuine tool surface such as a code panel, chart, table, or inspector.
Repeated evidence snippets should be rows, not cards; never nest cards.

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

## Investigative Recipes

Recipes compose the archetypes above for investigation-heavy requests. They do
not replace archetypes; they name the intent, dominant relationship, evidence
mode, and carry-forward.

| Recipe | Use when | Dominant visual | Evidence mode | Carry-forward |
|---|---|---|---|---|
| Issue Trace | A bug, issue, or "why does this fail" question walked in | frame ladder or flow to a cause boundary | high: evidence rows, exact code/log snippets, confirmed/inferred/gap status | next place to inspect or fact to confirm |
| Change Pressure | An enhancement idea raises blast-radius, coupling, or "what makes this hard" questions | pressure ledger plus dependency or current/proposed map | medium-high: each force cites a source, count, or concrete file | lowest-risk seam or decision to investigate |
| Ownership Map | The user asks who owns behavior, where responsibility belongs, or why boundaries feel split | swimlanes, ownership lanes, or module map | medium: each owner or boundary cites defining files | leaked or split responsibility to resolve |
| Failure Path | The user wants the path a bad state follows through guards, fallbacks, or user-visible failure | decision flow, bad edge cascade, or failure timeline | medium: cite branches, guards, and inferred hops separately | earlier guard, observation point, or confirming check |
| Concept-To-Code Bridge | The user asks what an abstract pattern means in this repo | mapping table plus code cards/glossary | medium: every concept facet maps to a source anchor | one file or symbol to open next |

For all investigative recipes, the first viewport must show the answer,
material inspected, confidence, and the dominant visual. The title should be an
answer, not a topic. The carry-forward should point to the next investigative
move unless implementation was explicitly requested.

## Evidence Grammar

When the explainer is grounded in code, logs, errors, or docs, evidence is an
interface, not a paragraph. Each load-bearing claim carries a plain source label
(path, frame, doc, URL), a status (confirmed, inferred, assumption, gap), the
smallest useful snippet, and a plain-language note on why it changes the
reading. Never paste a whole file; never include secrets or unrelated private
source.

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
- Browser-rendered geometry is clean: `documentElement.scrollWidth` does not
  exceed the viewport except for intentional internal scrollers; no visible
  element's bounding box bleeds past the viewport edge.
- Wide SVGs, comparison boards, and tables are contained: they scale down when
  legible, switch to internal horizontal scroll when needed, or collapse into a
  mobile-friendly layout. They must not show repeated side-by-side content,
  clipped labels, offscreen panels, or overlapping annotations.
- Screenshots at desktop and mobile widths confirm headings, panels, rows, tables,
  diagrams, captions, controls, and anchored sections are readable and do not
  collide.
- A reader learns the shape of the system faster than from Markdown.

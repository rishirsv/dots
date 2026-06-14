---
name: OpenAI Artifact Explainers
version: 2026-06-14
source_basis:
  - https://openai.com/brand/
  - https://openai.com/
  - https://developers.openai.com/apps-sdk/concepts/ui-guidelines
  - https://thariqs.github.io/html-effectiveness/
  - https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html
tokens:
  colors:
    canvas: "#f7f7f2"
    canvas_raised: "#ffffff"
    panel: "#ffffff"
    panel_2: "#f0f0eb"
    ink: "#111111"
    ink_muted: "#5b5b55"
    ink_subtle: "#8a8a82"
    line: "#d8d8cf"
    line_soft: "rgba(17,17,17,.12)"
    accent: "#0066cc"
    accent_green: "#10a37f"
    warning: "#f6c177"
    danger: "#ff6b5f"
    success: "#7bd88f"
  typography:
    sans: "\"OpenAI Sans\", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  radii:
    xs: "6px"
    sm: "8px"
    md: "12px"
    lg: "18px"
    pill: "999px"
  spacing:
    xs: "6px"
    sm: "10px"
    md: "16px"
    lg: "24px"
    xl: "36px"
---

# OpenAI Artifact Explainers

This design file is the visual and interaction contract for `unpack` HTML
explainers. It is not official OpenAI brand documentation. It is an
agent-readable extraction from current public OpenAI surfaces plus the HTML
artifact standard from the Anthropic/Thariq references.

## Artifact Promise

Every explainer must make one hard technical relationship visible faster than
Markdown. If the artifact does not expose shape, evidence, selective reading, or
a useful export action, it has failed even if it looks polished.

The reader should understand these within the first viewport:

- the answer
- what evidence was inspected
- confidence or inference status
- the primary relationship diagram
- what to copy or do next

## Visual Theme & Atmosphere

Use a clean technical editorial canvas with black/white neutrals, restrained
gray structure, and sparse accent. Prefer a light, document-like surface for the
default template because it exposes hierarchy and organization better than a
heavy dashboard. Use a dark surface only when the material itself benefits from
it, such as terminal output or incident timelines.

Do:

- use black, white, off-white, charcoal, and gray as the default visual language
- reserve blue/green accents for active paths, confirmed evidence, and controls
- let diagrams, source chips, and annotations carry meaning
- keep geometry crisp and purposeful
- make dense information feel arranged, not crowded

Do not:

- imitate logos, marks, partner lockups, or proprietary brand assets
- use decorative gradients, blobs, bokeh, or marketing hero tropes
- turn every idea into a card
- make a generic dashboard when a composed article, map, timeline, or table
  would explain better
- use color when position, grouping, or labels can carry the meaning

## Typography Rules

Use system fallbacks for OpenAI Sans. Use large, confident headings only in the
top band. Inside the artifact, type should be dense and legible.

- Page title: 44-64px desktop, 32-40px mobile, weight 600-700.
- Section headings: 13-18px, weight 650, no negative letter spacing.
- Body: 14-16px, line-height 1.45-1.6.
- Metadata chips: 11-12px, weight 650, letter spacing up to `.04em`.
- Code: 12-13px, line-height 1.5, high-contrast inset block.

Letter spacing is `0` except small all-caps metadata labels.

## Artifact Archetypes

Choose the archetype before writing content. Delete modules that do not serve
the archetype.

| Material | Primary Visual | Required Evidence | Useful Interaction |
|---|---|---|---|
| Feature flow | boxes/arrows flow canvas | source list + 2-4 snippets | tabs: flow/evidence/failure |
| Stack trace | frame ladder + cause boundary | frame labels + crash/cause snippets | toggle crash vs root cause |
| Diff/review | annotated before/after or split diff | file paths + severity tags | severity filter + jump links |
| Module map | dependency graph or swimlanes | entry points + hot path source | click node to reveal role |
| State machine | state nodes + allowed transitions | transition conditions | state filter |
| Config/API | matrix/table + request/response tabs | fields, defaults, source docs | tabbed examples + copy payload |
| Incident/report | timeline + impact bands | logs + timestamps | filter by phase/severity |
| Concept simulator | diagram plus small live control | assumptions + formula/snippet | slider/toggle/export values |

## First Viewport Contract

The first viewport should be a composed visual article, not a title page and
not a dashboard:

1. Title and one-sentence answer.
2. Provenance strip: material type, inspected sources, confidence, next action.
3. One dominant spatial structure: graph, flow, ladder, timeline, matrix, or
   simulator.
4. Compact evidence preview or source list.

Do not spend the first viewport only on an oversized hero.

## Spatial Grammar

Use a small reusable vocabulary:

- **Node**: a component, state, file, actor, or concept.
- **Edge**: control flow, data flow, dependency, or causal relationship.
- **Hot path**: the path that explains the main answer.
- **Boundary**: a handoff, ownership change, trust boundary, or abstraction line.
- **Branch**: a decision point or failure path.
- **Evidence pin**: a source-backed note tied to a node or edge.

Use inline SVG or CSS grid for the canvas. The canvas must show at least one
relationship that would be weaker in Markdown.

## Evidence Grammar

Evidence is an interface, not a paragraph. Each important claim should have:

- source chip: path, doc, log, frame, or URL
- status: confirmed, inferred, assumption, or unresolved
- short excerpt: only the smallest useful snippet
- annotation: why this evidence changes the explanation

Never dump a whole file. Never include secrets or irrelevant private source.

## Interaction Rules

Default interactions should be tiny and useful:

- tabs switch between views of the same explanation
- `<details>` reveals optional evidence or glossary detail
- copy buttons export summary, next prompt, source checklist, or payload
- filters reduce severity, component, frame, or phase when there are many items

Every interaction must either reveal evidence, change the visual model, compare
alternatives, or export something useful. Decoration-only interaction is worse
than static HTML.

## Layout Principles

Use a three-zone structure:

- **Top band**: answer, provenance, controls, with minimal chrome.
- **Main structure**: one dominant visual plus a secondary evidence/control
  column when useful.
- **Article body**: selective detail modules, watch list, glossary, carry
  forward.

The default desktop grid is 12 columns. Let the dominant visual span 7-9
columns and the evidence/control column span 3-5. On mobile, preserve the answer
first, then make the visual horizontally scrollable only when labels would
otherwise become illegible.

## Components

- `topbar`: title, answer, status chips, copy/export controls.
- `source-strip`: compact provenance row; never omit for repo-specific claims.
- `canvas`: diagram surface with nodes, edges, hot path, and evidence pins.
- `view-tabs`: native buttons controlling panels with `aria-selected`.
- `evidence-row`: source chip, status badge, excerpt, annotation.
- `details`: optional proof, glossary, assumptions, or unresolved questions.
- `export-box`: copy summary, copy next prompt, copy checklist.

## Responsive Behavior

- The top band stays readable without oversized type.
- The canvas uses `overflow:auto` rather than shrinking labels below legibility.
- Evidence rows become stacked accordions under 760px.
- Copy/export controls wrap into a compact row.
- No nested page-level scrolling; only diagrams or code panes may scroll.

## Verification Rubric

Before delivery, check more than “it renders”:

- Does the first viewport answer the question?
- Is there a real spatial model, not just a list?
- Are important claims tied to sources or marked as inference?
- Can the reader switch views or reveal details without reading linearly?
- Is there a useful export action?
- Does the page survive desktop and mobile widths without overlap or hidden text?
- Would a reviewer learn the shape of the system faster than from Markdown?

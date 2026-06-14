# HTML Explainer Design

Use this reference with `../DESIGN.md` when `unpack` creates a standalone HTML
explainer. `DESIGN.md` owns the current visual language and artifact grammar;
this file keeps the operational rules close to the explainer workflow.

## Artifact Job

The HTML file should help the reader understand dense technical material in one
focused pass. It is not a website, landing page, tutorial, slide deck, or
general report. The page should make relationships visible through layout,
proximity, annotation, color, hierarchy, and light interaction.

Use HTML when the artifact benefits from at least one of these:

- spatial layout: flows, maps, timelines, diffs, stack traces, or module roles
- visual hierarchy: severity, ownership, confidence, order, or dependency
- non-linear reading: summary first, evidence next, details only where useful
- light interaction: copy, tabs, filters, or toggles that tighten the loop

Stay compact, but not flat. A good explainer usually fits in one scrollable page
with an answer/provenance top band, one dominant visual structure,
source-backed evidence, selective details, and one export/carry-forward action.

## Visual Theme

Use the OpenAI-style technical editorial surface from `../DESIGN.md`:

- black/white/off-white canvas, restrained gray structure
- light editorial surface by default; dark only when the material calls for it
- sparse blue/green accent for active paths, confirmed evidence, and controls
- amber/red only for warning and failure states
- composed first viewport, then selective detail
- real diagrams and annotated evidence over decorative artwork

Avoid brand imitation. Do not use logos, proprietary marks, external assets, or
source-page styling. The goal is quiet clarity, not a replica of another site.

## Tokens

Use the semantic CSS variables from `../DESIGN.md` as the baseline. Keep any
template-level additions semantic and sparse.

```css
:root{
  --bg:#f7f7f4;--paper:#fff;--ink:#111;--muted:#5f5f57;
  --line:#deded8;--soft:#ecece6;--accent:#10a37f;
  --accent-2:#087f63;--accent-soft:#e3f5ef;
  --warn:#b45309;--warn-soft:#fff3dc;--bad:#b42318;
  --bad-soft:#ffebe8;--code:#171717;--code-ink:#f4f4ef;
  --shadow:0 18px 50px rgba(0,0,0,.08)
}
```

Use semantic roles directly. Do not create large shade scales unless the
current artifact truly needs them.

## Type

Use system fonts only:

- body: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
  "Segoe UI", sans-serif`
- code: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`

Keep letter spacing at `0` except tiny all-caps labels, where `.04em` is enough.
Do not scale text with viewport width. Use fixed/rem sizes with responsive
layout constraints.

## Layout

Use a first-screen structure that answers before it teaches:

1. title and one-sentence answer
2. compact provenance strip: material type, inspected evidence, confidence, next
   use
3. dominant visual structure: flow, map, stack ladder, state graph, diff,
   matrix, timeline, or simulator
4. evidence preview and view controls
5. supporting modules and carry-forward note

Prefer full-width sections inside one constrained `main`. Avoid box soup: use
rules, alignment, whitespace, and a single organizing visual before reaching
for cards. Cards are only for repeated evidence snippets or genuinely tool-like
controls; do not nest cards inside cards.

Good reusable modules:

- `.top`: title, gist, provenance, and optional copy-ready summary
- `.flow`, `.ladder`, `.timeline`, `.matrix`, or `.map`: the dominant visual
  structure
- `.rail`: ordered flow with connected steps only when sequence is the core
  relationship
- `.evidence-row`: short source snippet beside plain-language annotation
- `.tabs`: alternate views of the same explanation
- `.split`: comparison or before/after
- `.watch`: risks, gotchas, or what to inspect next

## Evidence

For code, logs, errors, docs, and repo behavior, show enough source material to
anchor trust without dumping the file:

- quote the smallest useful snippet
- preserve exact names, flags, paths, or stack frames that matter
- annotate why the snippet changes the interpretation
- mark inference explicitly when source evidence is partial

Never include secrets, credentials, private tokens, or irrelevant source.

## Interaction

Default to static HTML/CSS. Add small inline JavaScript only when it materially
helps the user act:

- copy summary, copy command, or copy prompt
- filter severity or component groups
- switch between two views of the same explanation
- expand optional details while keeping the main path readable

No dependencies. No remote scripts. No framework. Keep interaction readable
enough to delete without breaking the explanation.

## Responsive Behavior

Use CSS grid/flex with explicit minimums:

- `main{width:min(1120px,calc(100vw - 32px))}`
- grids use `repeat(auto-fit,minmax(min(260px,100%),1fr))`
- code blocks wrap or scroll within their own box
- flow rails collapse to a single column under `720px`
- fixed-format diagrams use `overflow:auto` rather than shrinking text

Before delivery, check desktop and mobile widths for readable text, no content
overlap, and no accidental horizontal page overflow.

## Agent Prompt Guide

When populating the template:

- delete unused modules instead of leaving empty or generic sections
- write the first sentence as the answer, not a teaser
- make the primary visual carry the hardest relationship
- use exact source labels where recognition matters, plain labels where it does
  not
- keep snippets short and annotated
- prefer semantic classes over one-off CSS
- include a carry-forward note: what this means, what to watch, or what to do
  next
- verify the rendered page before returning it

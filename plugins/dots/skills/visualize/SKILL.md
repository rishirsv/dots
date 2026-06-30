---
name: visualize
description: "Creates chat-native visual explanations with Mermaid, SVG/image files, charts, UI mockups, and interactive HTML artifacts; routes saved/front-end/image requests to the Dots skills or tools that own them. Use when a user asks to visualize, diagram, mock up, chart, illustrate, map, or make an interactive visual explanation."
---

# Visualize

Create visual explanations that make an idea easier to understand, compare, or
inspect. Use the smallest visual surface that solves the user's request.

This is a Codex skill. Load the linked Markdown references directly when they
apply; no extra loading tool or special inline-widget API is involved.

## References

- Read [visual-rules.md](references/visual-rules.md) before choosing style,
  density, color, labels, or typography.
- Read [diagram-guidance.md](references/diagram-guidance.md) for flowcharts,
  structural maps, concept diagrams, ERDs, and SVG layout safety.
- Read [interactive-html.md](references/interactive-html.md) for interactive
  explainers, local HTML files, chart controls, and rendered validation.
- Read [charts.md](references/charts.md) when the user asks for a chart or when
  data needs visual comparison.

## Route

Use this skill for chat-native visual thinking:

- Mermaid diagrams for flows, state machines, sequences, relationships,
  timelines, class diagrams, and ERDs.
- Markdown tables or compact ASCII sketches when they are clearer than a graphic.
- SVG or generated image files when the user needs a rendered picture, visual
  mockup, or illustration in the thread.
- Self-contained HTML under `.agents/outputs/` when the user asks for an
  interactive explainer, chart, or lightweight visual artifact.

Route adjacent work to the owning skill:

- Use `dots:visual-design` for product UI, web/app screens, dashboards,
  front-end implementation, redesign, or design QA.
- Use `dots:html-artifact` when the user wants a polished saved document with
  navigation, sections, copy/export, or shareable report structure.
- Use `imagegen` when the user wants a bitmap image, photo-like scene,
  illustration, texture, sprite, or visual concept that should be generated as
  raster art.
- Use `dots:explain` when the answer is primarily prose and a small sketch or
  table is enough.

## Workflow

1. Identify the user's visual job: understand a mechanism, map a system,
   compare options, inspect data, mock up an object, or explore a control.
2. Pick the smallest output that renders well in Codex. Prefer Mermaid for
   diagram grammars it supports; prefer local SVG/image files for custom
   illustrations; prefer local HTML for interaction.
3. Keep explanatory prose in the response. Put only the visual, labels, controls,
   and essential annotations inside the visual artifact.
4. Ground visual claims in the provided source, repo files, or verified data.
   For current facts, look them up before charting or labeling them.
5. Validate rendered files with Codex Browser first and Chrome only as a fallback.
   For simple Mermaid in chat, inspect the syntax carefully before responding.

## Output Choices

For Mermaid, include the fenced `mermaid` block directly in the response and add
short prose before or after it.

For SVG or generated image files, write them under `.agents/outputs/`, inspect
them when practical, and display with Markdown image syntax using short alt text
and the file's absolute path.

For interactive HTML, create one self-contained file under `.agents/outputs/`,
open it in Browser at desktop and mobile widths, fix overflow or blank-render
issues, and link the absolute file path in the handoff.

## Completion Check

Before handing off:

- The chosen visual form matches the job instead of showing off a heavier medium.
- Labels are short, readable, and do not overlap.
- Colors encode meaning and survive light and dark backgrounds where applicable.
- Data, numbers, and relationships are grounded or clearly marked as illustrative.
- Rendered files were opened and checked, or the response states why validation
  was not needed or could not be run.

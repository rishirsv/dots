# Visual Rules

Use these rules for every visual surface: Mermaid, SVG, HTML, charts, generated
images, and UI mockups.

## Core Posture

- Compact beats comprehensive. Show the essential structure or mechanism, then
  explain supporting detail in normal response prose.
- The visual should feel native to the conversation: clean, restrained, and easy
  to scan without a separate legend unless color or symbols encode meaning.
- Use a flat visual language by default: solid fills, thin borders, no decorative
  blur, glow, mesh, neon, or shadow effects.
- Text in the visual is for labels, controls, values, and essential annotations.
  Put paragraphs, caveats, and analysis outside the visual.

## Density

- Box subtitles should be five words or fewer. Put detail in prose.
- A single horizontal tier should have at most four boxes at full width. With
  five or more, shrink, wrap, split into rows, or create overview plus detail
  visuals.
- Count nouns before drawing. Six or more components usually need multiple
  diagrams or a simplified overview.
- One complete visual is better than several promised visuals that are too dense
  to read.

## Labels And Typography

- Use sentence case for labels unless a proper noun or established acronym needs
  another form.
- Keep visible labels short enough to fit their containers. If a label needs a
  line break, consider shortening it first.
- Avoid rotated text. It is hard to read and easy to clip.
- Do not let lines, fills, markers, or other strokes cross label text. Move the
  label or split the diagram instead of masking the collision.
- For SVG labels, use 14px for primary labels and 12px for subtitles,
  descriptions, legends, and callouts.

## Color

- Color should encode meaning, not sequence. Group like things with the same
  color.
- Use one neutral ramp plus one or two meaning colors for most diagrams.
- Add a one-line legend when color encodes state, type, tier, or meaning that is
  not obvious from labels.
- Use semantic colors only for semantic meaning: success, warning, danger, info,
  hot/cold, active/inactive, high/low.
- For physical scenes, color may match the material or property: amber/red for
  heat, blue/teal for cold or water, green for organic matter, gray for structure.
- Gradients are only useful for continuous physical properties such as heat,
  pressure, or concentration. Otherwise use flat fills.

## Mockups And UI Fragments

- Match the target domain. Operational tools should be dense, calm, and scannable;
  editorial or explanatory visuals can breathe more.
- Use cards only for bounded repeated items, records, modal mockups, or framed
  objects. Avoid card-inside-card layouts.
- Use stable dimensions for boards, counters, tiles, controls, and chart regions
  so labels and values do not resize the layout.
- Keep controls familiar: sliders for numeric input, toggles for booleans,
  segmented controls for modes, menus for option sets, and icon buttons for
  common actions when an icon is clear.

## Accessibility And Polish

- Every generated or saved image needs useful alt text in the response.
- Do not rely on color alone when state matters; pair it with labels, position,
  stroke style, or symbols.
- Round displayed numbers intentionally. Use integer, one-decimal, currency, or
  percent formatting that matches the data.
- For motion, respect reduced-motion preferences and animate only state,
  process, or flow. Decorative motion is noise.

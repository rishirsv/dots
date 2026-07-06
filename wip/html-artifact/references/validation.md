# Validation

An artifact is not done until it has been opened and inspected in a real browser.
The output is a single static file; the QA below proves it renders and behaves
before handoff. Keep output portability separate from preview mechanics — how you
preview never changes what you deliver.

## Browser tool order

- **Use an available browser tool.** Open and inspect every artifact in the
  rendered-browser tool the runtime provides, by default.
- **Record the tool and any fallback.** If you fall back to another tool because
  the first is unavailable or cannot inspect the file, record the tool used and
  the fallback reason in the handoff.
- **No automation dependency.** Do not add a browser-automation dependency to
  run these checks. They are manual or tool-assisted inspections.

Runtime-specific browser preferences belong in runtime metadata, not in this
reusable rule.

## Proof expectation

- Inspect the rendered artifact in a browser, not just the markup.
- Test at a desktop width, a ~375px mobile width, and a 320px reflow width.
- When a check fails, fix the artifact and re-inspect. Do not hand off a file
  with a known failing check.
- Report which widths were checked, the result of the overflow check, and which
  browser tool was used, with any fallback reason.

## Required checks

- **`load-check`** — the file opens from `file://` with a non-blank body and no
  console errors that break rendering.
- **`first-viewport-check`** — the title, artifact purpose, and primary value
  (answer, verdict, or conclusion) are visible without scrolling.
- **`desktop-check`** — layout, spacing, hierarchy, and alignment hold at a wide
  width; the shell stays centered within its `max-width`.
- **`mobile-check`** — the layout is usable at ~375px: columns collapse, side
  navigation is hidden or stacked, touch targets stay ≥40px, text stays readable.
- **`reflow-check`** — at 320px the layout reflows to a single column with no
  page-level horizontal scroll: columns collapse, comparison pairs and triptychs
  stack, and no fixed-width block escapes the viewport.
- **`zoom-check`** — where the browser surface supports it, the content stays
  usable at high zoom (~200%) and reflows rather than clipping or overlapping.
- **`overflow-check`** — no accidental page-level horizontal scroll at any tested
  width. Intentional internal scroll (tables, diagrams, code, reels) is contained
  to its own element.
- **`table-code-check`** — tables, code panels, diffs, and diagrams are contained:
  they scroll inside their wrapper or collapse to a mobile layout, and code keeps
  its indentation rather than reflowing.
- **`interaction-check`** — every interactive control works: `details`/`summary`
  disclosure, tabs/filters, copy/export buttons, annotation focus, and
  before/after/triptych controls. With JS disabled the content still reads in full.
- **`reduced-motion-check`** — when a `motion-proof` or any animation is present,
  enabling "reduce motion" neutralizes the animation and the final state stays
  visible and reachable. No motion is required to read the content.
- **`screenshot-check`** — captures load (lazy ones below the fold included),
  carry explicit dimensions so layout does not shift, are contained within their
  frame, and have meaningful captions and `alt` decisions.
- **`source-check`** — provenance is visible and honest: sources, file paths,
  commands, and an audit trail where the recipe calls for one; nothing fabricated;
  unknowns marked as unknown.
- **`recipe-fit-check`** — recipe defaults appear only where supported by source
  material. Any omitted default is unnecessary or disclosed as an evidence limit.
  No section is padded with placeholder prose.
- **`type-check`** — the bounded editorial scale holds under stress: the first
  viewport stays dense (title and value visible, not inflated), the 320px reflow
  and high zoom (~200%) keep headings and body readable without clipping, tables
  and code stay contained and compact, numeric columns (tables, metrics, dates,
  line numbers, badges) align on tabular figures, and code/diff/path text reads
  character-exact with ligatures off. Type should feel more refined, not larger.
- **`spacing-check`** — the bounded spacing rhythm holds: the first viewport
  stays compact (not padded out with air), panel and cell padding is consistent
  across like surfaces, gaps and stack rhythm read as one beat rather than
  scattered magic numbers, internal scrollers (tables, code, diffs, reels) keep
  their padding while containing their own overflow, and nothing introduces
  accidental page-level horizontal scroll at any tested width. Artifact-local
  layout should spend the `--space-*` tokens, not invent one-off pixel gaps.
- **`polish-check`** — the first viewport states the value; sections are not
  wrapped in decorative cards; status text does not rely on color; dense content
  uses compact rows, tables, or lists; no visible authoring scaffolding leaks.
- **`a11y-structure-check`** — one `h1`, a sensible heading order, real landmarks
  (`main`, `nav`, `header`, `footer`), status conveyed by text/glyph as well as
  color, and adequate contrast. Confirm anatomy coverage where relevant: each
  major block has a `data-primitive` and its required `data-slot` parts, and no
  slot or primitive name leaks into reader text.
- **`dark-mode-check`** — OS dark mode works with JS disabled, the manual toggle
  works with JS enabled, and status pills, warning callouts, code panels, and
  links hold contrast in both themes.
- **`chart-check`** — every `inline-chart` is static SVG with a visible
  `data-table`: with JS disabled the chart still renders and the table reads, no
  tick label is clipped, the chart scales without forcing page-level horizontal
  scroll, and its colors hold in both themes (chart-token / `currentColor` only,
  no raw hex).

## Generated Artifact Proof Procedure

Run this concrete pass on the delivered artifact before handoff:

1. Open the artifact in an available browser tool.
2. Check the desktop first viewport and a full scroll to the footer.
3. Check a typical phone width around 375px.
4. Check 320px reflow with no page-level horizontal overflow.
5. Check high-zoom reflow where the browser surface supports it.
6. Check interactions: native disclosure, tabs/filters, copy/export, annotation
   focus, and before/after/triptych controls.
7. Check reduced motion when a `motion-proof` or any animation is present.
8. Check screenshot loading, dimensions, captions, and containment.
9. Check recipe fit, polish, and dark mode.
10. If you fall back to another browser tool because the first is unavailable or
   blocked, record the tool used and the fallback reason in the handoff.

## Reference Fixture Regression

When changing this source, run the rendered proof procedure on
[../assets/html-artifact-reference.html](../assets/html-artifact-reference.html). For broad
recipe, primitive, or theme changes, also inspect at least one fixture or sample
from each affected recipe family when such a fixture exists. This is maintainer
regression work, not a requirement for every generated user artifact.

Generated artifacts are held to the checks above through this guidance and a
per-artifact browser pass. Keep regression proof focused on what a reader sees:
load, layout, containment, interactions, evidence honesty, dark mode, and print
behavior where relevant.

## Preview fallback

If a `file://` preview is blocked in the available browser tooling, use a
temporary static preview route or a `data:` URL to inspect the rendered output.
This is a preview mechanic only — do not convert the delivered artifact into a
server-dependent output. The handoff remains a single static HTML file that opens
without a server or build step.

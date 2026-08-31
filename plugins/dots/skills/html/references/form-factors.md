# HTML form factors

Choose structure from the information type and the reader's job. Use the
lightest form that makes the supplied material easier to understand, compare,
or act on. Preserve a strong structure already supplied by the caller or source.

Map each major content unit before composing:

- **Prose section:** explanation, background, rationale, or narrative. Use
  paragraphs under descriptive headings; add bullets only when they improve
  scanning.
- **Lead callout:** a decision, recommendation, constraint, or takeaway the
  reader must not miss. Keep it short and support it with nearby evidence.
- **Process steps:** a real sequence, runtime path, or procedure. Use
  `process-steps` when order changes meaning; do not number parallel facts.
- **Grouped bullets:** requirements, considerations, loose factors, or a small
  set of related items whose order is not important.
- **Checklist:** actions or acceptance checks that a reader will actually mark
  or verify. Do not use checkboxes as decorative status indicators.
- **Definition or responsibility list:** terms, responsibilities, metadata, or
  key facts. Use compact labeled prose or `file-map` when code responsibility
  matters.
- **Comparison:** repeated alternatives with shared criteria. Use
  `comparison-grid` for a few concise cases and `data-table` when exact rows or
  many criteria matter.
- **Table:** repeated records with shared fields where row/column lookup or
  comparison is the point.
- **Diagram:** relationships, boundaries, branching flows, or spatial systems
  that prose cannot express as clearly. Choose the family through
  [diagrams.md](diagrams.md).
- **Chart:** supplied quantitative evidence whose pattern or comparison matters.
  Choose and verify it through [charts.md](charts.md).
- **Source list:** reader-useful evidence, citations, or continuation links.
  Keep it quiet and omit internal working material.

## Workshop agendas

Choose the form from the reader's job:

- Use `timeline` when time order is the main question and each session benefits
  from a short outcome or description.
- Use stacked `data-table` when facilitators need exact lookup across repeated
  fields such as time, session, outcome, owner, or format.
- Use prose sections or `process-steps` when the request asks for workshop
  content or a learning arc rather than a clock schedule.
- Put a whole-program agenda on the introduction page of a linked page set when
  it orients the sequence. Do not repeat the complete agenda on every page.

## Workshops, courses, and other page sets

Use a linked page set only when the parts have a real order and benefit from
independent URLs. A workshop may need an introduction and agenda, focused
instruction or lab pages, and a wrap-up; another sequence may need a different
page plan.

Map each page before writing it:

- the reader question or task it owns;
- the supplied content and evidence that belong there;
- the page-specific layout and existing components that serve that content;
- the transition to the next page; and
- whether the page also needs an internal `toc-rail`.

Give the sequence one visual system but not one repeated silhouette. Use the
existing width modes and components to distinguish orientation, instruction or
lab work, and closure when their content differs: an introduction may lead
with one meaningful `wide-figure`, a lab may use parallel evidence in `wide`,
and a wrap-up may close around a single `pull-quote` and recommendation. Keep
prose-led pages in `article`. Do not add imagery, grids, or width merely to make
adjacent pages look different.

Keep cross-page order, labels, filenames, and optional time/context in one
manifest and generate `sequence-nav` from it. Each page remains a normal HTML
page assembled through `page-shell`; the sequence does not create a second
content-component system.

## Table gate

Use a table only for genuinely tabular information: repeated items, shared
fields, and useful comparison or lookup. If most cells become sentences or
mini-paragraphs, switch to prose, bullets, steps, callouts, or disclosure.

Choose columns from the comparison rather than giving every field equal width.
Keep short identifiers and states compact; give explanatory content room. On
narrow screens preserve labels and meaning through wrapping or a documented
responsive treatment rather than shrinking text below a readable size.

Before delivery, check whether adjacent tables or repeated component forms make
the page harder to read. Change a form only when another representation better
matches the information; visual variety is not a goal by itself.

## Generic reading orders

Use these only when the caller and source lack a deliberate order. They arrange
supplied content and never invent a claim, fill an evidence gap, or make a
decision the source did not make.

- **Decision:** context -> options -> distinguishing evidence -> recommendation.
- **Explanation:** answer -> mechanism -> worked path or example -> implications.
- **Status:** current state -> meaningful movement -> blockers -> owned next actions.
- **Incident:** impact -> chronology -> established cause -> recovery -> follow-up.
- **Comparison:** criteria -> meaningful differences -> trade-offs -> decision or
  explicit absence of one.

When `how` or planning work supplies researched content and a reading order,
follow it instead of these generic forms.

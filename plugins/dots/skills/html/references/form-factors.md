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

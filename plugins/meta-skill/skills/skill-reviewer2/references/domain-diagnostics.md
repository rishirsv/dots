# Domain Diagnostics

Load only the module matching the skill under diagnosis. These are prompts for
evidence collection, not required `SKILL.md` headings or a universal output
template. A missing item is a defect only when it affects the skill's stated
job.

## Template Execution

Determine whether the skill can identify the correct template and version,
inspect its structure before editing, distinguish editable content from fixed
structure, and map each source field to a destination. Check how it handles
missing or conflicting values without inventing content.

Compare the result with both the source information and the original template.
Useful checks include required sheet, slide, section, style, placeholder,
formula, and layout preservation; expected edit boundaries; brand and format
rules that are actually defined; and a rendered inspection of the final
artifact. A file that opens or preserves its extension is not sufficient proof.

Look for reusable behavior across supported artifact types rather than
provider-specific ceremony. Tool-specific details should load only for the
artifact being handled.

## Financial Modelling

Reconstruct the model's purpose and the decisions its outputs support. Inspect
the classification and source of historical data, explicit assumptions, and
derived calculations. Check units, currencies, dates, signs, formula
architecture, hard-coded inputs, circular calculations, scenarios, key-driver
ranges, and calculation direction.

Trace a small number of important outputs back through formulas to source
inputs. Look for control totals, reconciliations, formula-error scans, balance
or bridge checks, scenario consistency, and known-fail cases. Confirm that a
failed check changes the result rather than appearing only in a note.

Inspect output interpretation for unsupported precision, invented inputs, or
conclusions that do not follow from the model. The handoff should make inputs,
assumptions, unresolved issues, and changed formulas easy to inspect without
requiring the recipient to reverse-engineer the workbook.

## Spreadsheet Analysis

Inspect how the skill discovers workbook and table structure before changing
data. Check schema inference, data types, duplicate handling, blank values,
date parsing, units, cleaning counts, excluded records, and source preservation.
Transformations should be reproducible and reconcile row counts, totals, or
other controls to the source.

Check whether formulas, links, named ranges, merged cells, validations,
comments, hidden content, and workbook features are preserved or intentionally
changed. Analytical procedures should define their criteria: an unexplained
“outlier” or “anomaly” label is not operational.

Inspect final tables and charts for correct ranges, labels, units, sorting,
filtering, and consistency with the underlying data. Require rendered or opened
artifact inspection when visual usability is part of the output contract.

## Reports And Presentations

Identify the audience, decision or question, source hierarchy, and required
artifact format. Trace the narrative from supported findings to implications
and recommendations without blending those categories. Check that important
claims have locatable support and that uncertainty or conflicting evidence is
represented honestly.

Inspect whether the chosen structure fits the message instead of forcing a
fixed outline. For presentations, test slide-level purpose, headline logic,
chart and table readability, source placement, and cross-slide consistency.
For reports, test section flow, evidence placement, terminology, tables,
figures, and navigation.

Template and brand instructions must identify concrete rules or a source file;
“make it professional” is not a usable standard. Inspect rendered pages or
slides for clipping, overflow, illegible text, accidental placeholders,
misaligned visual hierarchy, and unsupported decorative complexity.

## Research And Synthesis

Reconstruct the research questions, source scope, source hierarchy, recency
needs, and stopping condition. Check that source selection fits the claim and
that conflicting or low-quality evidence is not silently flattened into a
single conclusion.

Trace factual statements to citations or supplied evidence and distinguish
facts from calculations, inference, and recommendations. Citations should
resolve to the claimed support rather than merely to a related source. Look for
unsupported claims, fabricated quotations or references, stale evidence where
timing matters, and conclusions stated more strongly than their support.

Completeness should be defined by coverage of the research questions and
important contrary evidence, not by the number of searches or sources. A
useful result may state that no supported conclusion is available and explain
the evidence gap.

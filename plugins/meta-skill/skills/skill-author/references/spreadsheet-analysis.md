# Spreadsheet Analysis

Read this when creating or revising a skill that creates, changes, cleans,
analyzes, or checks spreadsheets. Use the applicable controls for the recurring
job; do not turn this reference into a fixed workbook layout or a substitute
for the domain method the spreadsheet supports.

## Define the task and data contract

State whether the skill owns a new workbook, a narrowly scoped edit, data
cleaning, a reproducible transformation, a workbook audit, or analysis from a
workbook. Name the boundary when it prevents unsafe work: a cleaning skill
should not overwrite a formula model; an audit skill should report defects
without modifying cells unless the user asks for repair; an analysis skill
should not silently redefine an input metric.

For transformations, analyses, or edits whose correctness depends on schema,
have the skill determine and record the working contract:

- the authoritative source file, sheet, table, or range;
- what one row represents, its primary identifier, and the intended output
  grain;
- period and timezone fields, units, currencies, sign conventions, and
  inclusion or exclusion rules that affect results;
- source columns, derived columns, editable inputs, and formula outputs; and
- the requested artifact and whether it must remain usable as a spreadsheet.

For a bounded edit to a known location, require only the authoritative file and
location, requested change, affected dependencies, and output policy. Expand to
the full contract only when the edit changes data meaning or structure.

If the input is ambiguous at the row-grain, metric-definition, join-key, or
unit level, inspect enough schema and sample rows to identify the ambiguity.
Ask for the smallest clarification that changes the transformation, or retain
the field unchanged and state which result cannot be calculated. Do not
deduplicate, aggregate, parse dates, or fill missing values based only on a
column name.

## Preserve source and discover the schema

For edits and transformations, preserve the original workbook or source table
and write a copied artifact unless in-place editing is explicitly requested.
Retain source tabs, raw extracts, and the original row order where they are
needed to trace a cleaned result. Before an edit, inspect relevant sheets for
headers, used ranges, formulas, tables, merged cells, hidden rows or sheets,
filters, validations, conditional formatting, charts, pivots, external links,
macros, and named ranges.

Make schema discovery an explicit step for messy files. Identify column names,
types, null and distinct counts, likely identifiers, date coverage, numeric
scales, duplicate patterns, and candidate join keys. Inspect representative
rows at the same grain as the intended output, not just a workbook's first
rows. For large sources, use a deterministic sample and retain the full row
count, filter, and sampling rule.

Preserve type and meaning during import and export. Keep identifiers as text
when leading zeroes or punctuation are significant; preserve dates as dates,
not display strings; distinguish a blank from zero; and retain percentage,
currency, and scale conventions. Do not combine actual, budget, forecast, or
scenario records without a field that distinguishes them.

## Cleaning, joining, and deterministic transformations

Require each cleaning action to have a declared rule and an observable result.
Useful rules include normalization of text and dates, type conversion, missing
value treatment, duplicate handling, invalid-row handling, outlier treatment,
and column mapping. Keep rejected, changed, or unmatched rows in a separate
output or change log when they affect totals, joins, or a user-visible result.
Do not silently drop rows because a parse or lookup failed.

For joins, state the left and right grain, keys, join type, expected cardinality,
and how unmatched or multiple matches are handled. Check row counts, distinct
identifier counts, and key totals before and after the join. Aggregate a source
to the intended grain before joining when that avoids multiplying facts. Never
sum an entity-level measure after a one-to-many join without an explicit
allocation or deduplication rule.

When the same transformation will recur or can change a result substantially,
put it in a deterministic script or a well-defined formula block. Define the
input schema, output schema, paths, and errors. Keep derivations users may need
to adjust as spreadsheet formulas; use a script for repeated parsing, joins,
normalization, or validation that would be fragile if reconstructed manually.
Do not claim a deterministic result if a manual workbook step remains required.

## Formulas, references, and workbook structure

For a model or calculation workbook, separate source/raw data, inputs,
calculations, checks, and outputs sufficiently to trace a displayed number back
to its inputs. Select sheets and tables from the task: a simple tracker does
not need a dashboard, while a multi-step analysis may need a compact summary,
an input area, a detail table, and checks.

Preserve existing formulas, links, named ranges, validations, pivots, charts,
and conditional formatting unless the requested edit requires changing them.
When adding a row or column to an existing table, extend dependent formulas,
table ranges, validations, formats, conditional formatting, and charts only
where they logically cover the new data. Never replace formula cells with
values merely to complete an edit or restyle a workbook.

Use formulas for calculations expected to remain editable. Reference input cells
instead of embedding unexplained constants in formulas, use absolute and
relative references deliberately, and name a range only when it improves a
repeated or cross-sheet reference. If a workbook contains external links,
circularity, macros, or volatile functions, inspect and preserve their intent;
do not assume a saved file recalculated them.

## Controls, reconciliation, and output design

Choose checks that directly test the transformation or analysis. Depending on
the task, include row-count and duplicate checks, source-to-output totals,
subtotals by period or category, opening-to-closing roll-forwards, separate
recomputations, join match rates, non-zero denominator checks, formula-error
scans, and cross-sheet tie-outs. Make the control result and the compared
ranges visible near the affected output or in a dedicated checks area.

Build tables and charts for the question, not as decoration. A table should
retain the dimensions, measures, timeframe, denominator, and filters needed to
interpret the result at its stated grain. Use a chart only when it makes a
comparison, trend, distribution, relationship, or composition easier to read;
bind it to the live table or formulas rather than pasted values. Label titles,
axes, units, periods, and series clearly, and do not create a chart when the
source cannot support the intended comparison.

For a net-new workbook without a controlling template or navigation convention,
make the first visible sheet useful without forcing a search through raw data:
show the requested outputs, their period and units, the primary controls or
limitations, and a clear route to inputs and detail. For an existing workbook,
preserve its entry structure and keep those items discoverable through its
existing navigation. Keep widths, heights, wrapping, number formats, frozen
headers, filters, and contrast readable at normal zoom. Use formatting to
distinguish inputs, formulas, links, warnings, and totals only when that
distinction is consistent with the workbook's existing conventions.

## Inspection, failure behavior, and evaluator handoff

Require both structural and visual inspection when the skill changes or creates
a workbook. Structurally inspect the relevant values, formulas, tables, named
ranges, links, and formula-error cells. Render or open each changed sheet and
the first visible sheet to inspect clipped headers, truncated numbers, broken
charts, blank tables, unreadable formats, and outputs outside the visible work
area. If the available runtime can inspect only cached formula values, say that
recalculation was not performed; do not represent cached values as freshly
calculated results.

Describe stop conditions concretely. Stop or produce a non-mutating diagnostic
artifact when required source sheets are missing, row grain is unresolved,
join keys cannot support the intended cardinality, units conflict, a formula
control fails, a required named range or external dependency is broken, or the
requested calculation depends on unavailable inputs. Report the affected
sheet/range, failed control, and the smallest needed correction. Do not invent
replacement values or quietly switch to a different calculation.

When behavioral evidence is needed, give `skill-evaluator` a valid workbook, a
duplicate at a known grain, an unmatched join key, a mixed-unit column, a
missing required header, a formula copied to the wrong period, a formula error,
and a row or column addition that must extend dependent features. Specify the
expected outputs, controls, preserved structures, rendered surfaces, and
failure behavior rather than checking only that a file exists. Keep
deterministic script tests with the script source and include failing inputs
that must preserve the source artifact.

Keep the runtime compact: put file-format APIs, domain-specific mappings, and
complex chart conventions in read-when references; put recurring parsing,
validation, rendering, and export work in scripts; keep the ordinary branching
path in `SKILL.md`.

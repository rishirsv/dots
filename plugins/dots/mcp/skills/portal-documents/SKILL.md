---
name: portal-documents
description: Inspect, create and edit DOCX, XLSX and PDF files with staged parsing, guarded outputs and explicit fidelity limitations.
version: 0.1.0
capabilities: ["documents.docx.inspect", "documents.sheet.inspect", "documents.pdf.inspect"]
---

# portal-documents

Document work uses dedicated capabilities, not a suggestion to install converters through an arbitrary shell. Discover the appropriate family and inspect the source before editing. Keep the source SHA and choose a separate output path with an explicit absence or destination-hash precondition. Portal stages only authorized snapshots into its parser directory and commits validated outputs through the same writer broker as source edits.

For DOCX, inspect paragraph and table locators, then target exact text within a supported run. Locators are valid for the inspected source hash. Unrelated ZIP parts, styles, headers, footers, media and relationships must remain unchanged unless the operation explicitly owns them. Cross-run complex replacements, tracked changes and unsupported XML edits should fail rather than flatten the document. Creation supports the documented Markdown subset and structured paragraphs/tables.

For XLSX, inspect sheet names and request bounded A1 ranges. Distinguish formula text from cached values. Writing a formula does not calculate it; report recalculation requirements. Edits preserve untouched sheet parts and use existing style IDs or the supported basic format fields. Do not coerce identifier-like strings into numbers or assume a formula cache is current.

Macro-enabled workbooks can be inspected and read without executing VBA. Editing XLSM and reading legacy XLS remain unavailable until their format-specific fidelity is qualified. Never silently discard macros, rename a file extension or overwrite a legacy workbook with a converted format.

For PDF, pages are one-based. Read extracted text and render actual page images when visual evidence matters. Page selection supports reorder, deletion, insertion and merge into a separately named output. Encrypted or malformed inputs receive explicit errors. Portal does not promise OCR, preservation of digital signatures or full interactive-form fidelity after transformations.

Use `view_image` or PDF render results for actual MCP image content. Use artifact retrieval for file bytes; an inaccessible Mac path is not a downloadable ChatGPT attachment. Host presentation must be verified on the actual client.

After a transform, report source and destination hashes, changed elements, preserved parts, warnings and tests actually performed. A plausible-looking output alone does not establish preservation or a successful round trip.

Read the relevant reference below only when that topic applies.
- [docx.md](references/docx.md)
- [spreadsheets.md](references/spreadsheets.md)
- [pdf.md](references/pdf.md)
- [fidelity-and-limits.md](references/fidelity-and-limits.md)

# Batch Extraction Tracker Template

Use this tracker to manage verbatim extraction across all reports.

| Report File | Report ID | Extractor | Status (`pending/in_progress/pass/needs_revision/blocked`) | Output File | Notes |
|---|---|---|---|---|---|
| `<report-01.pptx/pdf>` | `<report-id>` | `<name>` | `pending` | `extracted/<report-id>.md` | `<issues>` |
| `<report-02.pptx/pdf>` | `<report-id>` | `<name>` | `pending` | `extracted/<report-id>.md` | `<issues>` |
| `<report-03.pptx/pdf>` | `<report-id>` | `<name>` | `pending` | `extracted/<report-id>.md` | `<issues>` |

## Per-Report Output Rule

For each report, create one file using:

- Template: `docs/report-mining/verbatim-report-extraction-template.md`
- Destination pattern: `extracted/<report-id>.md`

## QA Gates Before Marking `pass`

- [ ] Content is verbatim only
- [ ] No paraphrasing or synthesis
- [ ] Missing sections marked `Not present in source report`
- [ ] Source-anchored manual section organization completed
- [ ] `scripts/qa_provenance.py` = `pass`
- [ ] `scripts/qa_gates.py` = `pass`
- [ ] `markdown_trace_sync` gate = `pass`
- [ ] `section_completeness` gate = `pass`
- [ ] Metadata completed

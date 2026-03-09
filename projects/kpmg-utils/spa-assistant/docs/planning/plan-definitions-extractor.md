# Implementation Plan: definitions extractor

## Description

Add a small, deterministic Python “Definitions JSONL extractor” tool for SPAs that also **demonstrates how to extract text from a PDF** (page-by-page) in a way that is useful for debugging. The system prompt stays short and tells the assistant to run the extractor first (fast, repeatable), then fall back to the manual 4-step method if code execution or required libraries are unavailable. The extractor is designed to work across different SPA layouts (articles, sections, exhibits) by anchoring a definitions page range, cleaning repeating headers/footers, and parsing definitions in a single pass with a simple state machine (regex only for limited detection/cleanup).

## Scope

- In:
  - One Python file in `chatgpt/spa-assistant/dist/` that implements the 4-step extraction pipeline (locate → clean → parse → write JSONL + report).
  - CLI-style entrypoint and clear stdout diagnostics (count, page range used, first 3 JSON lines).
  - Conservative “noise stripping” for EDGAR/print-to-PDF artifacts (URLs, page counters, repeated headers/footers).
  - A “text extraction demo” mode (CLI flag) that writes extracted (and optionally cleaned) page text to stdout or files to make debugging fast.
- Out:
  - UI work, web integration, or any automated “deal analysis” output.
  - Full cross-reference resolution (Mode B) by default (make it optional).
  - A routing/double-counting checker (can be a separate follow-up tool).

## Tasks

### Phase 1: Define the tool interface and data model

Goal: Make the file easy to run and easy to extend without touching the prompt.

- [ ] 1.0 Decide the file shape (match existing tool scripts)
  - [ ] 1.1 Use the “tool script” structure from `utils/oai-skills/slides/render_slides.py` and `utils/oai-skills/spreadsheets/examples/create_spreadsheet_with_styling.py` (argparse + `parse_args()` + `main()` + helpers).
  - [ ] 1.2 Add a module docstring: purpose, inputs, outputs, and “no renaming terms” rule.
  - [ ] 1.3 Validate: a reader can understand how to run it from the top 30 lines.
- [ ] 1.4 Define core dataclasses / types (no heavy framework)
  - [ ] 1.5 `DefinitionRecord`: `term`, `definition`, `source_file`, `page`, optional `page_end`, optional `xref`, optional `pdf_page_label`.
  - [ ] 1.6 `ExtractionConfig`: thresholds and patterns (heading keywords, density thresholds, noise rules).
  - [ ] 1.7 `ExtractionReport`: pages scanned, chosen start/end, stop reason, counts of stripped lines, record count.
  - [ ] 1.8 Validate: JSONL schema matches `spa-assistant.md` minimum fields.

### Phase 2: Implement the 4-step extraction pipeline (single-pass)

Goal: Deterministic, fast extraction that is robust to line wraps and noisy PDFs.

- [ ] 2.0 Step 1 — Locate likely Definitions range (generic across SPAs)
  - [ ] 2.1 Implement heading-based detection: look for headings like “Definitions”, “Defined Terms”, “Certain Definitions”.
  - [ ] 2.2 Implement density fallback: identify pages with high “quoted-term start” density.
  - [ ] 2.3 Implement stop markers: stop at the next major heading on the same page (ARTICLE/SECTION/all-caps heading/numbered heading).
  - [ ] 2.4 Validate: output report includes chosen `(start_page, end_page)` and stop marker used.
- [ ] 2.5 Step 2 — Extract and clean text (mandatory cleanup layer)
  - [ ] 2.6 Page-by-page extraction with PyMuPDF/fitz (preferred) and pdfplumber fallback.
  - [ ] 2.7 Lightweight normalization: soft hyphen removal, whitespace collapse, trim.
  - [ ] 2.8 Noise stripping rules:
    - [ ] Drop URLs, “x/NNN” counters, DocuSign envelope IDs, and standalone page-number lines.
    - [ ] Drop repeating headers/footers only when they repeat across many pages (avoid over-cleaning).
  - [ ] 2.9 Validate: report counts of removed lines and shows sample of removed patterns when `--debug` is set.
  - [ ] 2.10 Add a “text extraction demo” CLI mode
    - [ ] `--dump-text`: write extracted text per page (raw) for a chosen page range.
    - [ ] `--dump-clean-text`: write the cleaned text per page for the same range (so it’s obvious what stripping did).
    - [ ] Validate: running with `--dump-*` does not run parsing; it only demonstrates extraction/cleaning and exits 0.
- [ ] 3.0 Step 3 — Parse definitions (state machine, minimal regex)
  - [ ] 3.1 Maintain `current_term`, `current_def`, `page_start`, `page_end`.
  - [ ] 3.2 Start-of-definition detection:
    - [ ] Primary: quoted-term start (smart quotes and straight quotes).
    - [ ] Fallback: conservative “Title/ALL CAPS + means” rule (bounded length/word count).
  - [ ] 3.3 Continuation handling: append lines until next term start; track `page_end`.
  - [ ] 3.4 Cross-reference capture: if definition contains “has the meaning set forth in …”, populate `xref` (verbatim phrase).
  - [ ] 3.5 Validate: extractor produces >0 records on a known SPA and preserves exact term spelling/casing.
- [ ] 3.6 Step 4 — Write JSONL and print a sanity report
  - [ ] 3.7 Write one JSON object per line to `--out` (default `/mnt/data/definitions.jsonl`).
  - [ ] 3.8 Print: record count, start/end pages, and first 3 JSON lines.
  - [ ] 3.9 Validate: exit non-zero if 0 records (and print diagnostics: start/end detection + a short excerpt around the presumed start).

### Phase 3: Integrate with the system prompt (light touch)

Goal: Make the assistant “prefer code” without bloating the prompt.

- [ ] 4.0 Add a short instruction in `chatgpt/spa-assistant/dist/spa-assistant.md` to run the extractor script first when possible
  - [ ] 4.1 Mention the script path and expected output file path.
  - [ ] 4.2 Keep the existing 4-step workflow as the fallback when code execution fails.
  - [ ] 4.3 Validate: prompt remains under 8,000 characters.

## Context

**Key files:**
- `chatgpt/spa-assistant/dist/spa-assistant.md`: the system prompt that should call the extractor.
- `chatgpt/spa-assistant/dist/term-map.yml`: optional alias and routing hints used for searching (never renaming).
- `utils/oai-skills/slides/render_slides.py`: example of a “tool-style” Python script structure (argparse + helpers).
- `utils/oai-skills/spreadsheets/examples/create_spreadsheet_with_styling.py`: good example of `parse_args()` + clear CLI output options.

## Patterns to follow

Use these scripts as reference for the Python file structure and CLI ergonomics:

- `utils/oai-skills/slides/render_slides.py`: “tool-style” layout (argparse → helpers → `main()`).
- `utils/oai-skills/spreadsheets/examples/create_spreadsheet_with_styling.py`: separate `parse_args()` function; output format choices; optional `--render`.
- `utils/oai-skills/slides/create_montage.py`: mutually exclusive CLI inputs; small private helpers (prefixed `_`); clear error handling.
- `utils/oai-skills/slides/ensure_raster_image.py`: strong top-of-file docstring that documents external dependencies and expected behavior; “fail fast” errors.
- `utils/document-skills/markitdown/scripts/batch_convert.py`: user-friendly CLI help (examples in epilog) and a clear end-of-run summary.
- `utils/oai-skills/spreadsheets/examples/read_existing_spreadsheet.py`: minimal example script layout (simple `main()` + `if __name__ == "__main__"`).
- `utils/document-skills/pdf/scripts/check_bounding_boxes.py`: simple “validator tool” pattern (clear SUCCESS/FAILURE output; early abort after N errors).
- `utils/document-skills/pdf/scripts/md_to_legal_pdf.py`: good example of a top-of-file docstring that includes a short “Usage:” section.

## Open Questions

- Should Mode B (resolve cross-references) be exposed as a CLI flag, or always keep Mode A only for v1?
- Do you want the extractor to accept an optional `--definitions_start` / `--definitions_end` override for hard cases?

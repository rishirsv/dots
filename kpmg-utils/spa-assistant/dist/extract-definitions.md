# Extract Definitions

Use this algorithm when extracting definitions from a SPA in .pdf or .docx.

## Rules

These rules must be strictly followed when extracting definitions. They do not restrict later analysis of other SPA provisions.

- You MUST first extract ALL definitions verbatim from the SPA and save them to an artifact `definitions.jsonl`. Do not paraphrase, summarize, or rename definitions.
- Save artifacts and working files to your environment (`/mnt/data`).
- Avoid repeated full-document scans. Prefer one pass to locate the Definitions range, then one sequential pass to parse it.
- Avoid regex-heavy parsing. Use a simple line/paragraph parser that builds definition records one at a time. You can use regex for cleanup.
- Use `term-map.yml` only as a reference to expand search queries and to identify financially-relevant definitions for later analysis. Always read this to check your work.

## Output artifact (definitions index)

Write `/mnt/data/definitions.jsonl` (one JSON object per line).

Minimum fields:

- `term` (verbatim)
- `definition` (verbatim; include the defined-term name if present in the document)
- `source_file`
- Source location (choose based on format):
  - **PDF:** `page` (start), optional `page_end`
  - **DOCX:** `para` (start), optional `para_end`, optional `heading`

Optional fields (only if you can populate reliably):

- `xref` (verbatim cross-reference phrase, e.g., “has the meaning set forth in Section 2.3”)

## Pre-flight Workflow

- Identify the source type: `.docx` or `.pdf`.
- Confirm you can extract text with tools.
  - `.pdf`: PyMuPDF/fitz. If not available, install via `pip install pymupdf` (imports as `fitz`).
  - `.docx`: python-docx. If not available, install via `pip install python-docx`.

## PDF algorithm (PyMuPDF/fitz)

### Step 1 — Locate Definitions pages

Use these signals (in priority order):

A. **Heading anchor (preferred):**

- Find the first page containing a Definitions heading, such as:
  - “DEFINITIONS”
  - “DEFINED TERMS”
  - “CERTAIN DEFINITIONS”
  - “DEFINITIONS AND INTERPRETATION” / “DEFINITIONS; INTERPRETATION”
- If available, also note the nearest major heading (“ARTICLE”, “SECTION”) but do not assume article numbers.

B. **Definition-start density fallback (fast, robust):**

- For each page, count likely definition starts (see “Definition-start detection” below).
- Prefer the first page in a short run of pages with high definition-start density (to avoid single-page false positives). Example heuristic:
  - pick the first page where the count meets a minimum threshold (e.g., 3+), and either the prior page or the next page also has multiple hits (e.g., 2+)
  - if no such run exists, choose the page with the highest count and treat it as the start

**End condition (stop-marker):**

- Stop at the first **next major heading** after the Definitions start (even mid-page). Treat a “major heading” as a standalone heading line (not a mid-sentence cross-reference). Commonly this is the next article (e.g., “ARTICLE II”), but do not assume article numbering. Examples:
  - “ARTICLE”, “SECTION”
  - “PURCHASE PRICE”, “CONSIDERATION”, “CLOSING”
  - “REPRESENTATIONS”, “WARRANTIES”, “COVENANTS”
  - “INDEMNIFICATION”, “TERMINATION”, “MISCELLANEOUS”
- If the stop-marker appears mid-page, do not parse any text after it.

Record `page` (start) and optional `page_end` (end) using **page numbers (1-indexed)**.

### Step 2 — Extract text and clean noise

Extract page text in order within the selected Definitions range.

If the extracted text looks out-of-order (common in multi-column PDFs or definition tables), re-extract using a block-based mode (e.g., “blocks”), sort blocks by top-to-bottom then left-to-right, and then join into lines before parsing.

Then clean:

- Remove soft hyphens (e.g. `\u00ad`)
- Trim leading/trailing whitespace and collapse internal repeated spaces
- Drop obvious **non-content artifacts** (examples; keep conservative):
  - URLs (lines starting with `http` / `https`)
  - Page counters (e.g., `3/109`, `Page 3 of 109`)
  - E-signature / document-management stamps (e.g., envelope IDs, audit stamps, “sent via …”)
  - Standalone page-number lines (e.g., `3`)
  - Repeated running headers/footers (e.g., document title, company name, confidentiality legend, timestamp lines)

**Repeated header/footer rule (safe version):**

- If a line is identical across many pages in the extracted range (e.g., appears on >50% of pages) and looks like a running header/footer/watermark (short, counter-like, or clearly non-substantive), drop it.

### Step 3 — Parse definitions (single pass)

Maintain:

- `current_term` (string or null)
- `current_def` (string buffer)
- `page_start`, `page_end`

Process each cleaned line in order:

- If a definition appears cut off at a page break, continue extracting on the next page(s), skipping any blank/near-blank pages, until the definition resumes or the Definitions stop-marker is reached.
- If the line matches the chosen stop-marker as a standalone heading (not a sentence fragment), finalize and write the current record, then stop.
- If the line is a **new definition start**, finalize and write the prior record (if any), then start a new record.
- Otherwise, if inside a record, append the line with a single separating space and update `page_end` as needed.

### Definition-start detection (PDF)

Primary (preferred):

- Detect **definition starts**, not just quoted mentions.
- Line begins with a quote (`“` or `"`) and contains a closing quote (`”` or `"`) shortly after, and is followed by a definitional trigger (same line or the next non-empty line), e.g., `“Cash” means …`.
  - Definitional triggers (examples; case-insensitive): `means`, `shall mean`, `has the meaning`, `shall have the meaning`, `has the meaning set forth in`, `has the meaning assigned to it`, `is defined in`, `as defined in`, or a colon immediately after the term (e.g., `“Cash”: ...`).
- Extract the term inside the first matching quote pair. Preserve it exactly (including casing/punctuation inside the quotes).

Fallback (use only if needed; keep conservative):

- A short Title Case / ALL CAPS phrase followed by a definitional trigger (case-insensitive), e.g., `Purchase Price means …` or `Accounting Firm has the meaning set forth in Section 1.6.3.`.
- Keep conservative to avoid false positives (e.g., term length ≤ 80 characters; ≤ 6 spaces).

- A short phrase followed by a colon, e.g., `Purchase Price: ...`.
  - Keep conservative to avoid false positives (e.g., term length ≤ 80 characters; ≤ 6 spaces).

### Finalize and write a definition record (PDF/DOCX)

When you finish capturing one definition (because you reached the next definition start or the Definitions section ended), write the record using these rules:

- Skip records with no captured definition text (likely a false positive).
- Store the definition verbatim (allow only light normalization like whitespace cleanup / soft-hyphen removal).
- If the definition is by cross-reference, capture `xref` as the exact cross-reference phrase (verbatim).

## DOCX algorithm (python-docx)

DOCX does not reliably provide page numbers, so use **paragraph indices** (1-indexed) and the nearest heading for traceability.

### Step 1 — Find the Definitions section (DOCX)

Preferred:

- Find a heading paragraph that matches “Definitions” / “Defined Terms” / “Certain Definitions” (or similar).
- Start the extraction range at the next non-empty paragraph after that heading.
- End the range at the next heading of the same-or-higher level (or the next major section heading).

Fallback (definition-start density):

- Find the first run of paragraphs with many detected definition starts (using the same definition-start detection rules as PDF).
- Use the preceding heading-like paragraph (if any) as `heading`.

Record `para` (start paragraph index) and optional `para_end`.

### Step 2 — Extract paragraphs and clean noise

- Extract body paragraphs in order within the selected Definitions range.
- Normalize lightly (soft hyphen removal, trim, whitespace collapse).
- If the doc contains repeated boilerplate lines inside the body, drop them conservatively (similar to the PDF repeated header/footer rule).

### Step 3 — Parse paragraphs into definition records

Scan paragraphs in order and build one definition record at a time:

- Start a new record when you detect a definition start (use the same definition-start detection rules as the PDF algorithm).
- Keep appending text to the current record until you hit the next definition start or the Definitions section ends.
- Finalize and write each record using the rules above (“Finalize and write a definition record”).

For each JSONL record, write `para`/`para_end`, and optionally `heading`.

## Diagnostic behavior (when extraction fails)

If you extract **0** definitions:

1. Report how you tried to locate the Definitions range (heading-based anchor vs definition-start density).
2. Print a short excerpt from around the candidate start (PDF: a few dozen lines; DOCX: a few dozen paragraphs).
3. Adjust only **definition-start detection** (e.g., accept straight quotes if only smart quotes were used) and re-run once.
4. If still 0, stop and ask the user for the Definitions section pages/heading and an excerpt.

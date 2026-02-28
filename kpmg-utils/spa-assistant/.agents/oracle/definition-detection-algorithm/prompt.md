## Role

You are a principal engineer reviewing system design.

## Context

I am uploading a zip called `context.zip` that contains repository files. Treat the contents of those files as the source of truth.

Rules:
- Start by reading `context/MANIFEST.md` and use it as your index to the bundle.
- Use only what you can support from the zip's files. Do not invent details.
- For concrete claims, cite file paths (add line numbers if available; otherwise cite the nearest heading/function name as an anchor).
- Write in clear, non-technical prose.
- Keep it tight: focus on the top 5-10 things that change decisions; group nits.
- Do not ask questions; state assumptions and unknowns explicitly.

## Task

We have a “definitions extraction” algorithm spec in `dist/extract-definitions.md` that is used to extract ALL defined terms verbatim from SPA documents (PDF/DOCX) into `/mnt/data/definitions.jsonl`.

I want you to propose a comprehensive, foolproof, and well-designed **definition-start detection + parsing** algorithm that fixes the observed misses. Prefer **tweaking and strengthening our existing algorithm** (and making requirements explicit) rather than rewriting it entirely, unless you find significant structural issues that demand a redesign.

Please focus on:
1) **Definition-start detection**: robust to formatting quirks in DOCX and PDF extraction (wrapped lines, paragraph splits, bullets).
2) **Continuation and termination**: how to safely accumulate a multi-paragraph definition and know when it ends.
3) **Validation/coverage**: how to ensure we don’t silently miss definitions, using `dist/term-map.yml` as a **sanity-check tool** (not as an “authoritative universe”, since many SPAs define many terms).
4) **Diagnostics**: what to print/do when extraction yields 0 definitions or when confidence is low (include “show an excerpt around the likely start” behaviors).
5) **Improve `dist/term-map.yml`**: propose changes to make it a better synonym map + validation aid for extraction, while keeping it small and maintainable.

## Observed failures / signals (must incorporate)

Model response (verbatim):

```
No — I did **not** look at a **term map `.yml`**.

For this run I only used the SPA `.docx` text itself and the extraction rules, so there was **no external “authoritative list” of expected terms** to validate against. If a term map YAML exists (even a simple list of “must-catch” terms like Indebtedness, Cash, Leakage, etc.), I can use it in two ways:

1. **Pre-check:** treat the YAML as the expected universe of terms and ensure each appears in the extracted output (flagging misses immediately).
2. **Post-check:** scan the Definitions section for quoted terms and compare against the YAML (to catch formatting quirks like `"Indebtedness" of any Person means…`).

If you upload the term map `.yml` (or paste it), I’ll wire it into the validation step so this class of miss gets flagged automatically even if the drafting style changes.
```

Concrete formatting example (excerpt; derived from local `.docx` files in `context/reference/`):

- `reference/1376-6710-5562-v1-Project Thunderstruck - Share Purchase Agreement - Draft to LCL.docx`:
  - `para 329`: `“Indebtedness” of any Person means, without duplication:`
  - `para 330`: `all obligations of such Person for borrowed money or with respect to deposits or advances of any kind;`

See also `context/chatgpt/spa-assistant/.agents/oracle/definition-detection-algorithm/observed-issues.md` for the same content, plus brief commentary.

## Constraints / preferences

- Preserve core intent of `dist/extract-definitions.md`: single-pass state machine; avoid regex-heavy parsing; minimize full-document rescans.
- Must remain conservative against false positives (e.g., quoted mentions or cross-references inside sentences should not start a new definition record).
- Must preserve terms/definitions verbatim (no renaming, no paraphrase).
- `dist/term-map.yml` should be used as a **validation/sanity check** (not a required list of all defined terms): e.g., “if the SPA has an Indebtedness definition, we should not miss it,” and if we did, we should surface a clear warning and a recommended fallback.
- Assume we may later implement this in deterministic code (Python), so propose rules that are implementable.

## What “good” looks like

- A clear “algorithm upgrade” proposal that can be applied as edits to `dist/extract-definitions.md`.
- Explicit detection rules (including allowed “intervening phrases” between the quoted term and the definitional trigger).
- A validation step that catches common misses without requiring a perfect “expected term list”.
- A small set of deterministic heuristics with thresholds (character windows, max term length/word count, etc.).
- A “failure mode” section: what to do when the document is multi-column, tables, or DOCX paragraphs split oddly.

## Output format

### Recommendation

One short paragraph with your recommended approach.

### Algorithm changes (diff-style)

Bullet the concrete changes you would make to `dist/extract-definitions.md`, citing the relevant headings/sections in that file.

### Detection rules (precise)

List the exact start-of-definition patterns you recommend supporting (DOCX + PDF), including:
- primary pattern(s)
- fallback pattern(s)
- explicit non-matches / exclusions

### Validation & diagnostics

Bullets describing:
- post-extraction sanity checks using `dist/term-map.yml`
- what warnings/errors to emit
- what excerpts to show for debugging

### term-map.yml improvements

Bullets describing the smallest useful set of changes to `dist/term-map.yml`, including:
- which synonyms/detection terms to add/remove
- how to structure it so it stays maintainable (naming, grouping, comments)
- what “must not miss” concepts belong there (and what should not)

### Risks / unknowns

Anything that could change your recommendation.

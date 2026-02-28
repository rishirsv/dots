# Lingo Glossary Slide Engine

This file is the complete, internal guide for turning an approved glossary table into a KPMG‑branded PPTX using Lingo’s bundled slide engine. It explains exactly how to decide when to generate, how to prepare the data, how to call the bundle, how multi‑slide behavior works, and how to handle errors—so the model does not improvise its own PowerPoint logic.

All instructions here are **internal only**. Never expose filenames, paths, code, or JSON schemas to users.

---

**MANDATORY — USE THE BUNDLE ONLY**

- NEVER generate or run custom PPTX code for glossaries.
- NEVER call `slides.add_slide` or hand-build tables/layouts.
- ALWAYS invoke `lingo_bundle.py` with `glossary_template.pptx` and the glossary JSON.

---

## When to Use This Engine

Use the glossary slide engine **only** when all of the following are true:

- The user has uploaded at least one document and asked for a PowerPoint glossary (explicitly or implicitly).
- You have:
  - Read every uploaded file end‑to‑end (per the system prompt).
  - Extracted candidate terms and built a glossary table in chat.
  - Shown the table and incorporated any edits the user requested.
- The user has given a clear affirmative cue to generate slides, e.g.:
  - “Yes, looks good.”
  - “Generate pptx glossary.”
  - “Make the slide(s).”

Do **not**:

- Generate slides from a partial or draft glossary unless the user explicitly says they are comfortable with an incomplete glossary.
- Use this engine for non‑glossary content (headlines pages, financials, etc.).
- Try to “patch” an existing PPTX by editing shapes directly; always regenerate from the approved glossary.

---

## Key files

These files, plus this guide (`slidegen_glossary.md`), are all you need for glossary slide creation.
- `lingo_bundle.py` – self‑contained Python slide engine for glossary PPTX generation.
- `glossary_template.pptx` – KPMG‑branded glossary slide template.

## Process

Whenever you generate a PPTX glossary, follow this workflow in order:

1. **Confirm glossary readiness**
   - Confirm that the glossary table in chat is final or “good enough” for the user.
   - Resolve any edits, additions, or deletions in chat first.

2. **Build a clean, deduplicated term list**
   - Normalize, deduplicate, and sort terms following the rules below.

3. **Construct the glossary JSON payload**
   - Convert the final table into a JSON array that the bundle can consume.

4. **Invoke `lingo_bundle.py` with the glossary template**
   - Run the bundle with the official template and the JSON payload to produce a PPTX file. ALWAYS use this file instead of generating new code.

5. **Describe and return the PPTX**
   - Offer the file for download and briefly summarize what’s inside (number of terms, number of slides).

6. **Handle re‑runs and edits**
   - If the user changes the glossary later, update the table and **re‑run the whole workflow**; never try to directly edit the previous PPTX.

7. **Handle errors and edge cases**
   - Use the error‑handling rules in Section 8 instead of ad‑hoc PowerPoint code.

---

## Building the Term List

By the time you reach slide generation, the glossary table in chat should already be correct. Use it as your source of truth and make only minimal structural decisions before building JSON:

- Apply any final edits the user requested in chat; do not silently add or remove terms.
- Deduplicate terms **case‑insensitively** (e.g., `EBITDA` and `ebitda`): resolve any conflicting definitions with the user, then keep exactly one row per term.
- If a definition still ends with `[?]`, only keep it that way if the user explicitly agreed to proceed despite the uncertainty.
- Strip trailing punctuation from `term` values (.,;:) before building JSON; leave definitions as-is.
- Normalize Terms:
  - If an acronym and its expansion appear together (e.g., “Quality of earnings (QoE)”), set the Term to the acronym (`QoE`) and place the expansion in the Definition.
  - For Company/Target named entities, use a single Term with a slash (e.g., `Company/Groundworks`) and describe the entity in the Definition.
  - Do not keep parentheses or embedded acronyms inside the Term field.

## JSON Payload for the Bundle

The bundle expects a JSON array of objects like this:

```json
[
  { "term": "ABC", "definition": "Definition of ABC." },
  { "term": "XYZ", "definition": "Definition of XYZ." }
]
```

**Rules:**

- Each object **must** contain:
  - `"term"` – string, non‑empty after trimming.
  - `"definition"` – string, non‑empty after trimming.
- Do **not** include extra keys in the JSON (no IDs, categories, tags, etc.).
- Sort the array alphabetically by `term` (case‑insensitive) before passing it to the bundle so that:
  - The PPTX glossary is alphabetized.
  - Re‑runs with the same terms produce stable ordering.

If a row in the chat table has an empty Term or Definition after trimming, **omit** that row from the JSON.

---

## Use `lingo_bundle.py` (only)

`lingo_bundle.py` is a self‑contained Python script that wraps the core glossary generator. It:

- Loads `glossary_template.pptx`.
- Validates the template (two tables, at least two columns each).
- Computes slide capacity from the template.
- Fills the tables with your JSON data.
- Duplicates the base slide when more terms remain than fit on one slide.
- Saves a **single** PPTX file containing all glossary slides.

You will typically:

1. Build the final `items` list in memory: a Python list of `{ "term": ..., "definition": ... }` dictionaries, already normalized and sorted.
2. Load the bundled engine from its mounted path and call `generate_glossary` directly. In the GPT / Code Interpreter environment where `lingo_bundle.py` is attached at `/mnt/data/lingo_bundle.py`, always use this pattern:

   ```python
   import importlib.util

   spec = importlib.util.spec_from_file_location("lingo_bundle", "/mnt/data/lingo_bundle.py")
   bundle = importlib.util.module_from_spec(spec)
   spec.loader.exec_module(bundle)

   template_path = "/mnt/data/glossary_template.pptx"
   output_path = "/mnt/data/Glossary_Slide.pptx"

   # items is a list of {"term": ..., "definition": ...} dicts
   bundle.generate_glossary(template_path, items, output_path)
   ```

3. Return the resulting PPTX (for example, `/mnt/data/Glossary_Slide.pptx`) as a downloadable artifact to the user.

#### Bad patterns (do NOT use)

Do not use any of the following when importing the glossary engine:

- `from lingo_bundle import generate_glossary`
- `import lingo_bundle`
- `sys.path.append("/mnt/data")` followed by importing `lingo_bundle`

If you see:

```text
ModuleNotFoundError: No module named 'lingo_bundle'
```

or any other import error for the glossary engine, fix it by switching to the `importlib.util.spec_from_file_location` pattern shown above. Do not modify `sys.path` or try alternative import styles.

---

## Multi‑Slide Behavior and Adaptive Row Heights

The bundle uses **adaptive row height pagination**—row heights expand dynamically to fit definition text, ensuring no clipping while maximizing slide density.

### 7.1 How adaptive pagination works

The engine uses height-based packing instead of fixed row counts:

1. **Estimates pixel height** for each definition based on character count and column width
2. **Packs items into columns** until the height budget (~400pt per column) is exhausted
3. **Sets row heights dynamically** so each row is exactly tall enough for its content
4. **Creates additional slides** as needed by duplicating the base template

This means:
- **Short definitions** get compact rows (~15pt) → more terms fit per slide
- **Long definitions** get taller rows (~25-40pt) → text is never clipped
- **Mixed glossaries** are optimized automatically

### 7.2 Capacity guidelines

| Definition Length | Approx. Height | Terms per Slide |
|-------------------|----------------|-----------------|
| Short (~50 chars) | ~15pt          | ~35             |
| Medium (~100 chars)| ~25pt         | ~28             |
| Long (~200 chars) | ~35pt          | ~20             |
| Very long (300+ chars) | ~45pt+    | ~16             |

Real-world glossaries with mixed definition lengths typically achieve 20-25 terms per slide.

### 7.3 How terms are placed

For each slide the engine creates:

1. Pack terms into the **left column first** (top to bottom) until height budget exhausted
2. Pack remaining terms into the **right column** until height budget exhausted
3. Set each row's height to match its content (no fixed row heights)
4. Clear any unused rows so there is no leftover text
5. Create new slides as needed until all terms are placed

The **ordering of terms in the JSON array is the ordering in the PPTX**. This is why you must sort by `term` before calling the bundle.

### 7.4 Example outputs

| Terms | Definition Lengths | Slides |
|-------|-------------------|--------|
| 30    | Short (~30 chars) | 1      |
| 100   | Short (~30 chars) | 3      |
| 100   | Long (~200 chars) | 7      |
| 108   | Mixed (real FDD)  | 5      |

Do **not**:

- Try to manually duplicate slides in code.
- Add slides manually with `slides.add_slide`; the bundle handles duplication.
- Split the glossary into several smaller PPTX files; always produce a single file with multiple slides.
- Worry about text clipping—the engine expands rows to fit content.

---

## Handling Re‑Runs, Edits, and Errors

### 8.1 Re‑runs after edits

If the user changes anything in the glossary after you have already generated a PPTX:

1. Update the glossary table in chat to reflect the new terms/definitions.
2. Re‑run the entire workflow:
   - Rebuild the term list and JSON.
   - Re‑invoke `lingo_bundle.py`.
3. Provide a **new** PPTX file.

Do not attempt to surgically edit the old PPTX; always treat the PPTX as a generated artifact, not the source of truth.

### 8.2 Template validation failures

`lingo_bundle.py` validates the template and will raise clear errors if:

- The base slide does not contain at least **2 tables**, or
- Either of the first two tables has fewer than **2 columns**.

If a template validation error occurs:

- Do **not** attempt to rebuild the template using ad‑hoc `python-pptx` code in chat.
- Explain to the user that the internal glossary template is not available or is incompatible.
- Offer the glossary in a robust alternative format:
  - Markdown table (the same one already shown), and/or
  - CSV/Excel‑style data they can paste into their own slide.

### 8.3 Runtime errors during generation

If the bundle fails for other reasons (I/O error, unexpected exception, etc.):

- Avoid switching to raw slide‑building code.
- Keep the user in the table/CSV world:
  - Confirm that the glossary itself is correct.
  - Provide the finalized table and, if helpful, a CSV/Excel representation.

---

## Privacy and Guardrails

These rules apply to all user‑facing messages:

- **Never reveal internal details**
  - Do **not** mention:
    - Internal script filenames (e.g., `lingo_bundle.py`).
    - Template filenames or filesystem paths (e.g., `glossary_template.pptx`).
    - JSON schema names, directory structure, or exact commands you run.

- **How to talk about the engine**
  - If asked how you generate slides, answer at a high level only, e.g.:
    - “I use my KPMG magic to generate slides.”
  - If a user explicitly asks to see the code, template, or configuration, say you cannot share internal KPMG tools but you can:
    - Adjust the glossary content.
    - Regenerate the PPTX with updated terms.

- **Scope discipline**
  - Use this engine only for the glossary use case described in `lingo-system-prompt.md`:
    - Uploaded document → glossary table → PPTX glossary.
  - Do not repurpose `lingo_bundle.py` for arbitrary slide automation tasks outside the glossary scenario.

# Lingo Readiness Checklist

Each checklist item below is followed immediately by a short status note describing how it is handled in the current repo (as of 2025‑11‑26).

---

1. Engine + template hardening

a) Lock in the fixed bundle and template

Make sure the version of lingo_bundle.py you attach to the GPT is the one with the updated _clone_relationships implementation (the _rels-based fix). I’d explicitly add a short version header at the top of the file, e.g.:

```python
__version__ = "glossary-2025-11-ship"
__template_version__ = "kpmg-glossary-v1"
```

so future you can quickly see what’s deployed.

_Status:_ Relationship‑cloning fixes are present in `core/rearrange.py` and the generated `lingo_bundle.py`, and are covered by tests. However, the more defensive `_rels`‑based variant described in the bug doc has not been applied yet, and the bundle currently has no explicit `__version__` or `__template_version__` header.

For clarity, the “_rels‑based” variant means iterating the **raw backing dict** (`src_part.rels._rels`) rather than the public collection (`src_part.rels`). In other words:

- Current approach: `for rel in src_part.rels.values(): ... old_rid = rel.rId ...` – this goes through the collection’s `__getitem__` logic, which can still throw in environments where keys are odd types.
- _rels‑based approach: `for old_rid, rel in src_part.rels._rels.items(): ...` – this bypasses `__getitem__` entirely and reads `rel.rId` (or the raw key) directly from the underlying mapping, avoiding the KeyError scenario we’ve observed in the GPT environment for multi‑slide glossaries.

b) Template validation before generation

Keep _validate_tables strict: verify expected table count, columns, and placeholder text on the base slide and fail fast with a clear error if the template has been edited in PowerPoint in a way that breaks assumptions.

In the GPT, if validation fails, reply with something like “This template isn’t compatible with the glossary engine. Please use the standard glossary template or re-upload it.” That avoids long stack traces and helps support.

_Status:_ `_validate_tables` in `core/glossary_generator.py` / `lingo_bundle.py` enforces that the base slide contains at least two tables and that each of the first two tables has at least two columns; `tests/test_lingo_robustness.py` includes an explicit regression where an invalid template raises a clear `ValueError`. We do not yet validate placeholder text or more detailed shape semantics, and GPT‑level messaging for template failures is only described in markdown (`slidegen_glossary.md`), not wired to structured error codes.

c) Regression matrix beyond “happy path”

Before you call it “shipped”, I’d run (and ideally encode as tests):

- 1 slide: 5–10 terms, mix of short/long definitions.
- Edge of capacity: exactly 35 terms.
- 2–3 slides: 60–90 terms.
- Very long definitions (big paragraphs; maybe 500–700 chars) to see how badly they overflow visually.
- Terms with slashes, hyphens, and numbers (e.g., Company/Target, IFRS 16, Pro forma).

You don’t need a huge suite, just enough that if any of these fail you know you’re not ready.

_Status:_ `tests/test_lingo_robustness.py` exercises `generate_glossary` on the real KPMG glossary template for multiple term counts (10, 30, 35, 36, 53), asserting slide counts, left/right column distribution, and that unused rows are cleared. We have not yet added automated tests specifically for 60–90 term glossaries, very long definitions (~500–700 characters), or special term formats (slashes, hyphens, numbers); those have only been explored manually so far.

2. Input normalization & formatting (make the output consistently “KPMG‑clean”)

You already identified the issues; I’d formalise them into a tiny, well-documented normalisation layer the GPT always uses before calling the engine.

Core rules to encode in one function (normalize_terms):

- Strip trailing .,;: from Terms.
- For inputs like "Right-of-use (ROU) asset" or "Quality of earnings (QoE)":
  - Term: use the acronym only ("ROU", "QoE").
  - Definition: “Right-of-use asset …” or “Quality of earnings …” with a clean, readable sentence.
- For Company (Groundworks)-style inputs:
  - Term: "Company/Groundworks" (or "Company/Groundworks Group" etc., whatever you standardise on).
  - Definition: the descriptive sentence; no parentheses or duplicated naming.
- Deduplicate terms by case-insensitive key (e.g., keep first occurrence or merge definitions with a clear rule).
- Trim definitions that are obviously insane (e.g., > N characters) and either:
  - Split them over multiple terms/slides in a future version, or
  - For now, truncate with an ellipsis and tell the user which terms were truncated.

Document these rules in your MD so the GPT can quote them back when users ask “Why did you change my term?”.

_Status:_ The normalization rules are documented in `lingo-system-prompt.md` and `slidegen_glossary.md` under “Normalize Terms” / “Building the Term List”, and `lingo_glossary_guidance.md` has been pruned and clarified so definitions for abbreviations are expansions only. There is no shared Python `normalize_terms()` helper yet; normalization happens in the GPT layer, and the engine assumes it receives already‑clean `{term, definition}` pairs. We also do not yet automatically trim or truncate over‑long definitions.

3. Custom GPT behaviour & flow design

Think of this as locking in two flows, and making the GPT stick to them.

Flow A: “I have a document, please extract a glossary and make a PPTX”

User uploads a report / memo.

GPT:

- Extracts candidate terms + definitions from the document.
- Applies normalize_terms.
- Shows a preview table in chat (Term, Definition) and says something like “I found 27 terms. Want me to generate the PPTX now?”

On confirmation:

- Calls Python with generate_glossary using the internal template.
- Returns the PPTX file plus a short summary (“27 terms, 1 slide; capacity is 35 terms per slide”).

Flow B: “I already have a list of terms, just build the PPTX”

User pastes or uploads JSON/CSV/Excel.

GPT:

- Parses into {term, definition} pairs.
- Applies normalize_terms.
- Optionally shows a short preview or at least a count.
- Calls generate_glossary and returns the PPTX.

Important GPT‑level behaviours to encode in its instructions:

- Use only generate_glossary for PPTX creation; no ad‑hoc python-pptx slide hacking.
- Treat the template as “the standard glossary template”, not as /mnt/data/glossary_template.pptx (internal paths are implementation detail and just confuse users).
- If the user asks for layout changes (“can you change fonts/colours?”), answer that this version uses the standard layout and suggest editing the generated PPTX manually, rather than trying to modify the template on the fly.

_Status:_ Flow A is effectively encoded in `lingo-system-prompt.md` and `slidegen_glossary.md`: upload document → extract + map terms → show table → on confirmation, call the bundled engine with the standard template. Flow B is conceptually supported (the engine accepts any `{term, definition}` list), but JSON/CSV/Excel uploads are not yet called out as a first‑class path in the prompt. Guardrails to always use the bundle and to describe the template as “the standard glossary template” are in place; the “no layout changes” behaviour is implied but not yet spelled out explicitly.

4. Error handling & troubleshooting UX

Wrap the generation call in a small, standard harness so errors look predictable:

```python
try:
    bundle.generate_glossary(template_path, items, output_path)
except Exception as e:
    # return a structured error to the GPT layer
    raise RuntimeError(f"GLOSSARY_GENERATION_FAILED: {type(e).__name__}: {e}")
```

In the GPT instructions, map this to a small set of user-facing messages, for example:

- Template mismatch: “The template doesn’t match what the engine expects. Please use the standard glossary template.”
- Bad items payload: “Some terms or definitions are missing or invalid. I can show you the cleaned list so you can fix them.”
- Unknown failure: generic “Something went wrong generating the PPTX; let me try once more. If it still fails, I’ll show you the term list so you can paste it into PowerPoint as a fallback.”

You’re not adding logs or telemetry here; you’re just making sure when it fails, it fails in a controlled, explainable way.
 
_Status:_ The CLI entrypoint in `core/glossary_generator.py` / `lingo_bundle.py` wraps `generate_glossary` in a `try/except` and exits with a non‑zero status, but it prints the raw exception text rather than a standardized `GLOSSARY_GENERATION_FAILED: ...` wrapper. `slidegen_glossary.md` describes how the GPT should respond to template and runtime errors (e.g., fall back to the table/CSV view), but we have not yet wired specific Python exception types to 3–5 canonical user‑facing messages.

5. Documentation inside the GPT (so the model can “self‑help”)

Given this is a custom GPT, your markdown docs are effectively the internal runbook for the model. I’d ensure you have one concise file that covers:

- Quickstart: 5–7 line “How to use this glossary GPT” for users.
- Supported flows: Flow A (extract from doc), Flow B (use provided list).
- Normalization rules: The bullets from §2 above, in plain language.
- Engine contract: Inputs (list of {term, definition}), template, output; the 35‑term/slide capacity note.
- Troubleshooting: 3–5 common issues with short remedies (template problems, malformed JSON, too many terms, etc.).

Keep this file short enough that the GPT will happily quote from it in answers, but detailed enough to encode the behaviours you care about. The longer, more narrative notes you’ve written can sit in a separate, less frequently used doc.

6. Short‑term roadmap (nice to have, not blocking this week)

Not for this week, but worth parking:

- Adaptive per‑slide capacity: Use rough character counts to decide whether to place 20, 25, or 35 terms per slide so long definitions don’t crush the layout.
- Multiple templates: Later, you might allow users to choose between “Dense” and “Spacious” templates, as long as they both satisfy the same table/placeholder contract.
- Multi-language quirks: If you expect non‑English glossaries, think about how your normalization rules handle accents and non‑ASCII characters.

_Status:_ These roadmap items are captured in `docs/LEARNINGS.md`, but none of them are implemented yet; the current engine assumes a single English‑language template with fixed capacity derived from its tables.

---

## One‑page “ship checklist” (with status)

If you want a tight internal checklist for this week:

- ✅ Confirm deployed lingo_bundle.py has the fixed _clone_relationships and version header.  
  _Status:_ Relationship‑cloning fixes are present and covered by tests, but the additional `_rels`‑based hardening is still pending, and there is no `__version__` / `__template_version__` header in the bundle yet.

- ✅ Run the small regression matrix (1, 35, 60+ terms; long definitions; weird term names) with the actual custom GPT.  
  _Status:_ The Python test suite covers multiple term counts up to 53 and validates structure and clearing behaviour; ad‑hoc GPT‑side tests have been run (and documented in the bug report), but a formal “sign‑off” matrix that includes 60+ terms and very long definitions in the GPT environment is still to be completed.

- ✅ Implement and document normalize_terms and make the GPT use it before every call.  
  _Status:_ Normalization rules are documented and actively enforced at the prompt level, but there is no shared Python helper named `normalize_terms`, and the bundle assumes pre‑normalized inputs.

- ✅ Encode the two flows (extract from doc / supplied list) in the GPT instructions.  
  _Status:_ Document‑driven Flow A is clearly encoded; Flow B (pre‑existing list) is supported conceptually but not explicitly spelled out as a separate flow in the system prompt.

- ✅ Add clear error mapping from Python exceptions → 3–5 friendly messages.  
  _Status:_ Error‑handling guidance exists in prose, but there is no structured error wrapper or explicit mapping from specific exception types to a small, fixed set of user‑facing messages.

- ✅ Add a short, focused MD runbook that the GPT can reference for behaviour and troubleshooting.  
  _Status:_ `slidegen_glossary.md` serves as the main runbook for the slide engine and troubleshooting, and `lingo-system-prompt.md` encodes behaviour; a shorter, focused “cheat sheet” could still be added if desired.

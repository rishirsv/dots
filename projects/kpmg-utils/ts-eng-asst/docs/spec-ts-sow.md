---
id: ts-sow
title: "TS-SoW"
doc: spec
---

# Feature: TS-SoW (engagement letters, dist-only)

## TL;DR
- **Problem:** Transaction services teams need to generate engagement letters quickly, but manual `.docx` edits are error-prone and can introduce unintended wording/formatting changes.
- **Solution:** A custom GPT that **only** uses the engagement letter templates in `dist/`, collects required variables with strict validation, and performs placeholder-only edits to produce a final, client-ready `.docx` with zero unintended diffs.

## Scope

### V1 (This Spec)

**In:**
- **Buyside Engagement Letter** (template file in `dist/`)
- **Sellside Engagement Letter** (template file in `dist/`)
- Template selection via numbered menu (2 options)
- Engagement letter appendices (e.g., release/access forms) are generated as part of the selected engagement letter, not as separate template choices
- Variable collection with strict gate (all fields required)
- Placeholder replacement using python-docx
- Demo mode for testing with GPT-generated fake data
- Sequential generation of multiple engagement letters (one at a time)

**Out:**
- Any non-engagement letter templates (e.g., release letters, access letters, factual accuracy, etc.)
- Any templates not present in `dist/`
- Modification of legal language or template structure (beyond placeholder replacement)
- Template creation or editing (authoring new templates or changing the underlying `.docx`)
- Bundled/parallel document generation
- Integration with external systems (e.g., deal databases)

### V2+ (Future)

- Quebec variants (or other jurisdictional variants) as separate templates
- Additional engagement letter variants (industry / service line / language)
- Conditional sections driven by a rules engine (only if required by the templates)

## What We're Building

A custom GPT that acts as a dist-only engagement letter template service. Users select from a menu of approved engagement letter templates (buyside or sellside), provide required variables, and receive a filled-out `.docx` with zero unintended changes.

The GPT enforces a **strict gate** — no document generates until all schema-required fields are populated. A `demo` keyword bypasses this gate by having the GPT generate realistic fake data on the fly for testing purposes.

The assistant will guide the user through template selection, variable collection, validation, and document generation in a single, predictable flow.

## User Stories

### User Story 1 — Generate a Single Engagement Letter
- As a TS associate, I want to generate a single approved engagement letter by filling in required variables so that I can produce a client-ready document quickly and safely.

### User Story 2 — Generate Multiple Engagement Letters Sequentially
- As a TS associate, I want to generate multiple engagement letters one at a time using the same inputs so that documents remain consistent across recipients.

### User Story 3 — Avoid Legal or Formatting Errors
- As an engagement manager, I want confidence that no legal text or formatting has been unintentionally altered so that documents comply with firm standards and risk requirements.

### User Story 4 — Test with Demo Mode
- As a GPT developer, I want to use a "demo" keyword to generate documents with realistic fake data so that I can test functionality without providing real deal information.

## Requirements

- [ ] The system must display a numbered menu of available templates when the user does not state intent.
- [ ] The system must select the correct approved DOCX template based on **engagement side** (buyside vs sellside).
- [ ] The system must only offer templates that exist in `dist/`.
- [ ] The system must use a predefined schema (Python dict) to identify all required variables per template.
- [ ] The system must collect all required variables before editing any document (strict gate).
- [ ] The system must support a "demo" keyword that auto-fills variables with GPT-generated realistic fake data.
- [ ] The system must only edit content inside `{{...}}` markers (replace, keep-without-braces, or remove); no other text may be changed.
- [ ] The system must preserve all formatting, styles, tables, numbering, headers, footers, and run-level formatting.
- [ ] The system must validate that no `{{` or `}}` patterns remain in the final document.
- [ ] The system must output a downloadable `.docx` file.
- [ ] The system must abort and show a specific error if any placeholder replacement fails or placeholders remain.

## How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOM GPT COMPONENTS                    │
├─────────────────────────────────────────────────────────────┤
│  SYSTEM PROMPT (≤8K chars)                                  │
│  - Full workflow instructions                               │
│  - UX rules (menu, strict gate, demo mode)                  │
│  - Constraints (no legal text modification)                 │
├─────────────────────────────────────────────────────────────┤
│  KNOWLEDGE FILES                                            │
│  - reference/el_template_schema.py (template metadata)      │
│  - reference/helper_functions.py (placeholder replacement)  │
│  - dist/buyside-engagement-letter.docx                      │
│  - dist/sellside-engagement-letter.docx                     │
├─────────────────────────────────────────────────────────────┤
│  CODE INTERPRETER                                           │
│  - Reads templates from /mnt/data (uploaded knowledge files)│
│  - Executes python-docx replacement                         │
│  - Validates no remaining placeholders                      │
└─────────────────────────────────────────────────────────────┘
```

### Template Schema Structure

```python
# reference/el_template_schema.py
TEMPLATES = {
    "buyside_engagement_letter": {
        "filename": "dist/buyside-engagement-letter.docx",
        "description": "Transaction services buyside engagement letter (except Quebec)",
        "variables": [
            {"key": "{{full legal name of client}}", "label": "Client legal name", "example": "Acme Corporation"},
            {"key": "{{Date}}", "label": "Letter date", "example": "January 9, 2026"},
            {"key": "{{XYZ}}", "label": "Project code name", "example": "Atlas"},
            # ... placeholder keys must match the DOCX text exactly
        ]
    },
    "sellside_engagement_letter": {
        "filename": "dist/sellside-engagement-letter.docx",
        "description": "Transaction services sellside engagement letter (except Quebec)",
        "variables": [...]
    },
}
```

### Engagement-letter-specific markers

The engagement letter templates use `{{...}}` markers for multiple purposes. V1 treats each marker as something that must be explicitly resolved:

- **Field placeholders** (replace): e.g., `{{full legal name of client}}`, `{{Address line 1}}`.
- **Optional clauses** (keep or remove): e.g., a whole clause wrapped in `{{...}}` that should be included sometimes and deleted other times.
- **Guidance blocks** (remove): e.g., `{{GUIDANCE: ...}}` notes that should not appear in the final client-ready document.

Rules for feature workers:

- Curly-brace guidance is internal and removed (e.g., `{{GUIDANCE_01}}`, `{{GUIDANCE: ...}}`).
- Bracketed guidance remains in output for human post-editing (e.g., `[GUIDANCE: ...]`).

### Independence behavior (intended)

- `CHOICE_INDEPENDENCE_APPLIES` controls whether Independence Considerations remains.
- If `CHOICE_INDEPENDENCE_APPLIES=no`, the full Independence block is removed.
- `CHOICE_SEC_STATUS` is conditionally required only when `CHOICE_INDEPENDENCE_APPLIES=yes` and the section is present in the selected template.

### Conversation Flow

```
1. NO INTENT → SHOW MENU
   ┌────────────────────────────────────────────────────────┐
   │ Available templates:                                   │
   │ 1. Buyside engagement letter                           │
   │ 2. Sellside engagement letter                          │
   └────────────────────────────────────────────────────────┘

2. USER SELECTS TEMPLATE
   User: "I need a buyside engagement letter"

3. SHOW REQUIRED FIELDS
   ┌────────────────────────────────────────────────────────┐
   │ I'll prepare a buyside engagement letter.              │
   │ Please provide:                                        │
   │ • Client legal name (e.g., Acme Corporation)           │
   │ • Engagement letter date (e.g., January 9, 2026)       │
   │ • [other required fields...]                           │
   │                                                        │
   │ Or type "demo" for a test document with sample data.   │
   └────────────────────────────────────────────────────────┘

4. COLLECT & VALIDATE (strict gate)
   - If "demo": GPT generates realistic fake data
   - If missing fields: "Missing: Client name, Date. Please provide."
   - If complete: proceed to confirmation

5. CONFIRM BEFORE GENERATION
   ┌────────────────────────────────────────────────────────┐
   │ Here's what I'll use:                                  │
   │ • Client name: Northwind Industries                    │
   │ • Date: January 15, 2026                               │
   │                                                        │
   │ Ready to generate? (Or tell me what to change)         │
   └────────────────────────────────────────────────────────┘

6. GENERATE & VERIFY
   - Read template from /mnt/data via Code Interpreter
   - Replace all {{PLACEHOLDER}} patterns using python-docx
   - Scan document for remaining {{ or }} patterns
   - If found: ABORT with specific error
   - If clean: deliver `.docx`

7. DELIVER
   ┌────────────────────────────────────────────────────────┐
   │ Your letter is ready.                                  │
   │ [Download: Buyside_Engagement_Letter_Northwind.docx]   │
   │ I've verified no placeholders remain.                  │
   └────────────────────────────────────────────────────────┘
```

### Placeholder Replacement Logic

Word often splits text across multiple runs. Placeholder replacement must be **run-safe** and must iterate through:

1. `document.paragraphs` — body text
2. `document.tables[].rows[].cells[].paragraphs` — table content
3. `document.sections[].header.paragraphs` — headers
4. `document.sections[].footer.paragraphs` — footers

```python
# reference/helper_functions.py (excerpt)
def _replace_in_runs(runs, variables: dict[str, str]) -> None:
    for key, value in variables.items():
        while True:
            full_text = "".join(run.text for run in runs)
            idx = full_text.find(key)
            if idx == -1:
                break
            end_idx = idx + len(key)
            cursor = 0
            inserted = False

            for run in runs:
                text = run.text
                run_end = cursor + len(text)
                if run_end <= idx or cursor >= end_idx:
                    cursor = run_end
                    continue

                before = text[: max(0, idx - cursor)] if idx > cursor else ""
                after = text[end_idx - cursor :] if run_end > end_idx else ""

                if not inserted:
                    run.text = before + str(value) + after
                    inserted = True
                else:
                    run.text = after

                cursor = run_end
```

## Acceptance Criteria

- Given no user intent, when the GPT starts, then it displays a numbered menu of available templates with descriptions.
- Given a selected template, when the user has not provided all required variables, then generation is blocked and missing fields are listed.
- Given the "demo" keyword, when the user requests a template, then the GPT generates realistic fake data and proceeds without manual input.
- Given a selected template and complete variable set, when the document is generated, then the output `.docx` contains no remaining `{{` or `}}` patterns.
- Given a completed document, when compared visually to the original template, then formatting, layout, and styling are unchanged except for placeholder content.
- Given a placeholder replacement failure or remaining placeholders, when generation is attempted, then the system aborts and displays the specific placeholder(s) that failed.
- Given an attempt to modify substantive legal language, when the user requests such a change, then the system refuses and explains the constraint.
- Given a request for a template not present in `dist/`, when the user asks, then the system refuses and lists the supported engagement letter templates.

## Context

**Templates (dist-only):**
- `dist/buyside-engagement-letter.docx`
- `dist/sellside-engagement-letter.docx`

**Template source names (for provenance):**
- `TS Buyside EL Template (Except Quebec) EN_08-Jan-2026.docx`
- `TS Sellside EL Template (Except Quebec) EN_9-Jan-2025.docx`

**Code (Knowledge files):**
- `reference/el_template_schema.py` — Template metadata and variable definitions
- `reference/helper_functions.py` — Placeholder replacement and validation logic

**Constraints:**
- System prompt limit: 8,000 characters (current: ~5K)
- Code Interpreter sandbox: python-docx available, docxtpl NOT available
- Templates pre-processed to standardize placeholder casing

## Resolved Questions

- [x] `{{XYZ}}` = Project code name (e.g., "Atlas", "Summit")
- [x] Engagement letters are the only in-scope letter type for v1
- [x] Demo mode: GPT generates realistic fake data on the fly

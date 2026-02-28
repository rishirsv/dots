# Plan: DD Template Letter Drafter - Custom GPT Implementation

## Summary

Build a custom GPT that generates financial due diligence letters by replacing placeholders in approved DOCX templates. V1 includes 3 templates: Buyside Client Release, Buyside Third Party Access, and Sellside Factual Accuracy Letter.

## Scope (v1)

**In:**
- Buyside Client Release Letter (13 placeholders)
- Buyside Third Party Access Letter (13 placeholders)
- Sellside Factual Accuracy Letter (6 placeholders, simple)
- Placeholder replacement using python-docx
- Strict validation gate (all fields required)
- Demo mode with GPT-generated fake data
- Visual PDF/PNG preview

**Out (v2+):**
- Sellside Client Release Letter (has GUIDANCE markers, conditional intros)
- Sellside Third Party Access Letter (has GUIDANCE markers, conditional intros)
- All Engagement Letter templates (complex conditional sections)

## Pre-Implementation Steps (Automated)

1. **Fix template casing** — Run a Python script to standardize placeholder casing:
   - `{{DATE}}` → `{{Date}}`
   - `{{EXACT LEGAL NAME OF CLIENT}}` → `{{Exact legal name of client}}`
   - `{{FULL LEGAL NAME OF RECIPIENT}}` → `{{Full legal name of Recipient}}`

   **Approach:** Use python-docx to iterate through all paragraphs (body, tables, headers, footers). For each paragraph, rebuild the text with corrected placeholder casing while preserving run formatting where possible.

   **Important:** Keep the original wording (e.g., "full legal name") — this semantic cue helps the model understand to use the actual legal entity name.

## Files to Create

### 1. System Prompt (~8K chars)
Location: Will be pasted into ChatGPT GPT Builder

Content structure:
```
1. Identity & Constraints
2. Template Menu (lemonade stand)
3. Variable Collection Rules
4. Strict Gate Logic
5. Demo Mode Instructions
6. Generation Workflow
7. Error Handling
```

### 2. `template_schema.py` (Knowledge file)
```python
TEMPLATES = {
    "buyside_client_release": {
        "filename": "Buyside Client Release Letter_EN_23-May-2025.docx",
        "description": "Authorizes release of information to buyer's advisors",
        "variables": [
            {"key": "{{Date}}", "label": "Letter date", "example": "January 15, 2026"},
            {"key": "{{Exact legal name of client}}", "label": "Client legal name", "example": "Acme Corporation"},
            {"key": "{{Address line 1}}", "label": "Address line 1", "example": "123 Main Street"},
            {"key": "{{Address line 2}}", "label": "City, Province, Postal Code", "example": "Toronto, ON M5V 1A1"},
            {"key": "{{Country}}", "label": "Country", "example": "Canada"},
            {"key": "{{Client contact name}}", "label": "Client contact name", "example": "John Smith"},
            {"key": "{{Client contact name and title}}", "label": "Contact name and title", "example": "John Smith, CFO"},
            {"key": "{{Name of partner}}", "label": "KPMG partner name", "example": "Jane Doe"},
            {"key": "{{acquisition of/investment in}}", "label": "Transaction type", "example": "acquisition of"},
            {"key": "{{describe the company/division/carve-out business}}", "label": "Target description", "example": "Widget Manufacturing Inc."},
            {"key": "{{exact legal name of the third party}}", "label": "Third party name", "example": "ABC Advisors LLP"},
            {"key": "{{XYZ}}", "label": "Project code name", "example": "Atlas"},
        ]
    },
    "buyside_third_party_access": {
        "filename": "Buyside Third Party Access Letter_EN_23-May-2025.docx",
        "description": "Grants third-party access during buy-side due diligence",
        "variables": [
            {"key": "{{Date}}", "label": "Letter date", "example": "January 15, 2026"},
            {"key": "{{Full legal name of Recipient}}", "label": "Recipient legal name", "example": "XYZ Capital Partners"},
            {"key": "{{Address line 1}}", "label": "Address line 1", "example": "456 Bay Street"},
            {"key": "{{Address line 2}}", "label": "Address line 2", "example": "Suite 100"},
            {"key": "{{Address line 3}}", "label": "City, Province, Postal Code", "example": "Toronto, ON M5H 2Y4"},
            {"key": "{{full legal name of client}}", "label": "Client legal name", "example": "Acme Corporation"},
            {"key": "{{Name of partner}}", "label": "KPMG partner name", "example": "Jane Doe"},
            {"key": "{{Authorized signatory of third party recipient}}", "label": "Recipient signatory", "example": "Robert Johnson, Managing Director"},
            {"key": "{{acquisition of/investment in}}", "label": "Transaction type", "example": "acquisition of"},
            {"key": "{{describe the company/division/carve-out business}}", "label": "Target description", "example": "Widget Manufacturing Inc."},
            {"key": "{{exact legal name of the third party}}", "label": "Third party name", "example": "ABC Advisors LLP"},
            {"key": "{{XYZ}}", "label": "Project code name", "example": "Atlas"},
        ]
    },
    "sellside_factual_accuracy": {
        "filename": "Sellside Factual Accuracy Letter_EN_28-Oct-2024.docx",
        "description": "Client certification of accuracy of provided diligence information",
        "variables": [
            {"key": "{{Date}}", "label": "Letter date", "example": "January 15, 2026"},
            {"key": "{{Address}}", "label": "Client address", "example": "123 Main Street, Toronto, ON M5V 1A1"},
            {"key": "{{Partner name}}", "label": "KPMG partner name", "example": "Jane Doe"},
            {"key": "{{describe the subject of the sell-side diligence work}}", "label": "Subject of diligence work", "example": "the sale of Widget Manufacturing Inc."},
            {"key": "{{Other engagement specific representations made during the engagement;}}", "label": "Additional representations (optional)", "example": ""},
            {"key": "{{TO BE PRINTED ON CLIENT'S LETTERHEAD}}", "label": "INSTRUCTION - REMOVE", "example": "DELETE"},
        ]
    }
}
```

### 3. `helper_functions.py` (Knowledge file)
```python
from docx import Document
import re

def replace_placeholders(doc_path, variables):
    """Replace {{KEY}} placeholders throughout document."""
    doc = Document(doc_path)

    def replace_in_paragraphs(paragraphs):
        for para in paragraphs:
            for key, value in variables.items():
                if key in para.text:
                    for run in para.runs:
                        run.text = run.text.replace(key, value)

    # Body
    replace_in_paragraphs(doc.paragraphs)

    # Tables
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                replace_in_paragraphs(cell.paragraphs)

    # Headers/Footers
    for section in doc.sections:
        replace_in_paragraphs(section.header.paragraphs)
        replace_in_paragraphs(section.footer.paragraphs)

    return doc

def validate_no_placeholders(doc):
    """Return list of remaining placeholders."""
    remaining = []

    def scan_paragraphs(paragraphs):
        for para in paragraphs:
            matches = re.findall(r'\{\{[^}]+\}\}', para.text)
            remaining.extend(matches)

    scan_paragraphs(doc.paragraphs)
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                scan_paragraphs(cell.paragraphs)
    for section in doc.sections:
        scan_paragraphs(section.header.paragraphs)
        scan_paragraphs(section.footer.paragraphs)

    return list(set(remaining))
```

### 4. Template files (Knowledge files)
- `Buyside Client Release Letter_EN_23-May-2025.docx` (after casing fixes)
- `Buyside Third Party Access Letter_EN_23-May-2025.docx` (after casing fixes)
- `Sellside Factual Accuracy Letter_EN_28-Oct-2024.docx`

## Implementation Steps

### Step 0: Save plan to docs folder
- Copy this plan to `docs/plan-ts-letters.md`

### Step 1: Pre-process templates (automated)
- Run Python script to standardize placeholder casing in each template
- Script will handle: body paragraphs, tables, headers, footers
- Casing mappings:
  - `{{DATE}}` → `{{Date}}`
  - `{{EXACT LEGAL NAME OF CLIENT}}` → `{{Exact legal name of client}}`
  - `{{FULL LEGAL NAME OF RECIPIENT}}` → `{{Full legal name of Recipient}}`
- Save processed templates to `dist/` folder

### Step 1.5: Generate diff report for validation
- Extract text from original and processed templates
- Generate `dist/template-changes.md` with diff for each file
- Format:
  ```markdown
  # Template Changes Report

  ## Buyside Client Release Letter

  ### Changes (3 replacements)

  | Location | Original | Changed To |
  |----------|----------|------------|
  | Para 5 | `{{DATE}}` | `{{Date}}` |
  | Para 8 | `{{EXACT LEGAL NAME OF CLIENT}}` | `{{Exact legal name of client}}` |
  | Header 1 | `{{EXACT LEGAL NAME OF CLIENT}}` | `{{Exact legal name of client}}` |

  ### Full Diff
  ```diff
  - In connection with Project {{XYZ}} dated {{DATE}}, ...
  + In connection with Project {{XYZ}} dated {{Date}}, ...
  ```

  ## Buyside Third Party Access Letter
  ...
  ```
- Review diff to verify ONLY casing changes were made (no content alterations)

### Step 2: Create Knowledge files
- Create `template_schema.py` with the schema above
- Create `helper_functions.py` with replacement/validation code

### Step 3: Write System Prompt
Draft the system prompt (~8K chars) covering:
- Role: "You are a template letter assistant for financial due diligence..."
- Lemonade stand menu when no intent
- Variable collection with examples
- Strict gate: "Do not generate until ALL variables are provided"
- Demo mode: "If user says 'demo', generate realistic fake data"
- Generation steps: read template → replace → validate → render preview → deliver
- Error handling: abort if placeholders remain

### Step 4: Create Custom GPT
- Go to ChatGPT → Create GPT
- Paste system prompt
- Upload Knowledge files (5 total: 2 Python files + 3 templates)
- Enable Code Interpreter
- Test with demo mode

### Step 5: Verify
- Test each template with demo mode
- Test with real variable input
- Verify no placeholders remain
- Verify formatting preserved
- Test error handling (missing fields, remaining placeholders)

## Verification Checklist

- [ ] "demo" generates a complete document with fake data
- [ ] Missing fields blocks generation with clear error
- [ ] All 13 placeholders replaced in Buyside Client Release
- [ ] All 13 placeholders replaced in Buyside Third Party Access
- [ ] All 6 placeholders replaced in Sellside Factual Accuracy
- [ ] `{{TO BE PRINTED ON CLIENT'S LETTERHEAD}}` removed from Factual Accuracy output
- [ ] PDF preview renders correctly
- [ ] Formatting matches original template
- [ ] No `{{` or `}}` patterns in final output

## Files to Modify

| File | Action |
|------|--------|
| `docs/spec-ts-letters.md` | Update scope to v1 (3 templates) |

**Note:** Original templates in `templates/` are NOT modified. Processed copies are saved to `dist/`.

## New Files to Create

| File | Purpose |
|------|---------|
| `scripts/preprocess_templates.py` | Standardize placeholder casing in templates |
| `dist/template-changes.md` | Diff report showing all casing changes for validation |
| `dist/system-prompt.md` | System prompt for GPT Builder |
| `dist/template_schema.py` | Template metadata and variables |
| `dist/helper_functions.py` | Placeholder replacement code |
| `dist/*.docx` | Processed template files (copied from templates/) |

## Open Questions

None - all questions resolved:
- `{{XYZ}}` = Project code name (e.g., "Atlas", "Summit")
- Sellside Factual Accuracy Letter included in v1 (simple, no GUIDANCE)

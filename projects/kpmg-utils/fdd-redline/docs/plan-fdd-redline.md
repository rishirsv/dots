# Implementation Plan: FDD QC Reviewer GPT

**Objective:** Build a Custom GPT that performs slide-by-slide QC of Financial Due Diligence (FDD) report decks, catching typos, placeholders, terminology inconsistencies, and style issues.

**Status (Jan 21, 2026):** Implemented in `dist/` with unit tests passing.

---

## 1) Design Decisions

### A. PPTX is the primary input

- 80% of users upload PPTX
- Extract text directly via python-pptx
- No text cleaning or normalization — keep raw extraction to avoid hiding errors

### B. PDF is optional (for visual review)

- If user provides PDF, render to PNG for visual review
- Create montage contact sheet for quick scanning
- GPT vision identifies slides needing detailed review

### C. Two types of "placeholders"

| Type | Examples | Action |
|------|----------|--------|
| **Slide master artifacts** | "Heading 1", "Click to add title" | Ignore — not real content |
| **User placeholders** | `[Appendix 1]`, `[TBD]` | Flag — needs author attention |

### D. GPT-driven orchestration

- GPT calls Python functions as needed
- No monolithic orchestrator script
- Flexible workflow adapts to what user provides

---

## 2) Scope

### In scope
- PPTX text extraction and QC
- Placeholder detection (square brackets)
- Misspelling detection (curated list)
- Terminology consistency (variant groups)
- Style consistency (FY format, units, dates)
- Visual review via slide PNGs (when PDF provided)

### Out of scope
- Editing the deck (findings only)
- Deep accounting judgement
- Table cell extraction (visual review handles tables)
- Speaker notes

---

## 3) Files (implemented)

| File | Contents |
|------|----------|
| `dist/review.py` | End-to-end orchestration (`run_review`) + issue log formatting |
| `dist/models.py` | `DocumentModel`, `PageModel`, `Finding` |
| `dist/extraction.py` | Metric extraction helpers |
| `dist/checks_placeholders.py` | Placeholder detection (literal + regex) |
| `dist/checks_grammar.py` | Repeated words, misspellings, double spaces |
| `dist/checks_terminology.py` | Terminology variant detection + recommendation |
| `dist/checks_crossref.py` | Page and appendix cross-reference checks |
| `dist/rules.yaml` | Editable ignore list + patterns + dictionaries |
| `dist/system-prompt.md` | Custom GPT system prompt draft |

> Note: PDF-to-PNG rendering is intentionally treated as optional and can be added via dependencies (e.g., `pdf2image`) when needed.

---

## 4) Data Model

```python
@dataclass
class SlideText:
    slide_num: int
    text: str  # raw extraction, unmodified

@dataclass
class Finding:
    slide: int
    category: str  # Placeholder | Spelling | Terminology | Style
    priority: str  # H | M | L
    evidence: str
    suggestion: str
```

---

## 5) Functions in review.py

### extract_slides(pptx_path) → list[SlideText]

```python
# Iterate slide.shapes
# For each shape with a text_frame: extract text
# Skip tables (visual review handles these)
# Skip speaker notes
# Return list of SlideText (one per slide)
```

### run_checks(slides, rules) → list[Finding]

```python
# For each slide:
#   Skip lines matching ignore patterns (slide master artifacts)
#   Flag [bracketed] text as open placeholders
#   Flag misspellings from curated dictionary
#   Flag terminology variants (recommend canonical form)
#   Flag style inconsistencies:
#     - FY format (FY24 vs FY2024)
#     - Units ($m vs $mm vs $'000)
#     - Date formats
# Return list of Finding
```

### render_pngs(pdf_path) → list[str]

```python
# Use pdf2image to render each page to PNG
# Return list of PNG file paths
```

### create_montage(png_paths) → str

```python
# Create grid contact sheet with slide numbers (PIL-based)
# Based on /Code/utils/oai-skills/slides/create_montage.py
# Return montage file path
```

---

## 6) rules.yaml

```yaml
ignore:
  - "Heading 1"
  - "Heading 2"
  - "Bullet 1"
  - "Bullet 2"
  - "Click to add title"
  - "Click to add subtitle"
  - "Click to add text"
  - "First item"
  - "Second item"

placeholders:
  pattern: "\\[.+?\\]"

misspellings:
  "accomodation": "accommodation"
  "seperate": "separate"
  "occurence": "occurrence"
  "recieve": "receive"
  "definately": "definitely"
  # Add finance-specific terms

terminology:
  - ["QoE", "QofE", "Quality of Earnings"]
  - ["Adj. EBITDA", "Adjusted EBITDA", "Adj EBITDA"]
  - ["LTM", "L.T.M.", "Last Twelve Months"]
  - ["YoY", "Y-o-Y", "Year-over-Year"]

style:
  fy_pattern: "FY\\s?'?\\d{2,4}"
  units_pattern: "\\$['\"]?[mMkK]{1,2}"
  date_pattern: "\\d{1,2}[/-]\\d{1,2}[/-]\\d{2,4}"
```

---

## 7) system-prompt.md

```markdown
# FDD QC Reviewer

You are a senior Financial Due Diligence reviewer. Your role is to QC report decks for errors, not to edit them.

## Workflow

1. When user uploads PPTX:
   - Call extract_slides() to get text per slide
   - Call run_checks() to get findings
   - Present findings in a table

2. When user also uploads PDF:
   - Call render_pngs() to generate slide images
   - Call create_montage() to create contact sheet
   - Review montage for visual issues (truncated text, alignment, table formatting)
   - Review individual slides that need closer inspection

## Per-Slide Checklist (Visual Review)

- Truncated or cut-off text
- Table alignment and readability
- Inconsistent formatting
- Chart labels legible
- Headers/footers consistent

## Output Format

Present findings as a markdown table:

| Slide | Category | Priority | Evidence | Suggestion |
|-------|----------|----------|----------|------------|

Categories: Placeholder, Spelling, Terminology, Style, Visual

Priorities: H (must fix), M (should fix), L (consider)

## Rules

- Only report findings with evidence
- Do not suggest edits — findings only
- Flag [bracketed] text as open placeholders
- Note when PDF was not provided (visual review skipped)
```

---

## 8) Workflow

```
User uploads PPTX
       │
       ▼
extract_slides(pptx) → SlideText[]
       │
       ▼
run_checks(slides, rules) → Finding[]
       │
       ▼
Present text-based findings
       │
       ▼
User also uploaded PDF? ──No──► Note: "Visual review skipped"
       │
      Yes
       │
       ▼
render_pngs(pdf) → PNG paths
       │
       ▼
create_montage(pngs) → montage.png
       │
       ▼
GPT reviews montage + individual slides
       │
       ▼
Add visual findings
       │
       ▼
Present complete findings table
```

---

## 9) Implementation Tasks

### Phase 1: Core extraction and checks
- [ ] Create `review.py` with extract_slides()
- [ ] Implement run_checks() with all check types
- [ ] Create `rules.yaml` with initial patterns
- [ ] Test on sample PPTX

### Phase 2: Visual review
- [ ] Implement render_pngs() using pdf2image
- [ ] Implement create_montage() (port from slides utility)
- [ ] Test PNG rendering and montage creation

### Phase 3: GPT integration
- [ ] Write `system-prompt.md`
- [ ] Create Custom GPT with Code Interpreter enabled
- [ ] Upload review.py and rules.yaml as knowledge
- [ ] Test end-to-end workflow

---

## 10) Custom GPT Setup

1. Create GPT → enable **Code Interpreter**
2. Paste `system-prompt.md` into Instructions
3. Upload `review.py` and `rules.yaml` as Knowledge
4. Conversation starters:
   - "QC this FDD deck"
   - "Check this presentation for errors"

---

## 11) Acceptance Criteria

1. **Text QC works:** Extracts text, flags placeholders/misspellings/terminology/style
2. **Ignore list works:** Slide master artifacts not flagged
3. **Visual review works:** PNG rendering and montage when PDF provided
4. **Findings are actionable:** Each has evidence and suggestion
5. **Graceful handling:** Clear message when PDF not provided

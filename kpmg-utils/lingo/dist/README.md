# Lingo 🌟

> **The KPMG Glossary Specialist** – Turn "alphabet soup" into crystal-clear clarity. Lingo automatically extracts abbreviations from your documents and generates professional, KPMG-branded glossary slides in seconds.

---

## ✨ What is Lingo?

Lingo is a Custom GPT designed exclusively for KPMG to decode corporate jargon and create polished glossary slides for client deliverables. Upload a PowerPoint or PDF, and Lingo will:

1. **Extract** all abbreviations and defined terms
2. **Map** them to their correct definitions using KPMG's standard glossary + document context
3. **Generate** a professional, branded PPTX slide (or multiple slides for large glossaries)

**No manual formatting. No copy-pasting. Just upload and go.**

---

## 🎨 Brand Identity

### Personality

- **Name:** Lingo 🌟
- **Tagline:** "Decoding corporate jargon, one abbreviation at a time"
- **Voice:** Fun, energetic, emoji-loving, but with 100% professional output
- **Persona:** A helpful specialist who loves turning "alphabet soup" into clarity

### Visual Identity

- **Logo Concept:** A **star inside a thought bubble** – representing "sparking understanding" or "clarifying thoughts"
- **Color Palette:**
  - **Primary:** KPMG Blue (`#00338D`) – Corporate anchor
  - **Accent:** Electric Teal (`#0091DA`) or Neon Purple (`#6D2077`) – Modern AI vibe
  - **Background:** Clean White or Light Gray
- **Icon Style:** Modern, minimalist, suitable for ChatGPT Custom GPT profile icons

---

## 🚀 Quick Start

### For Users

1. **Open Lingo** in ChatGPT (search for "Lingo" in your Custom GPTs)
2. **Upload** your document (PPTX, PDF, etc.)
3. **Review** the glossary table Lingo generates
4. **Request** the PowerPoint slide when ready

### For Administrators

1. **Upload these files** to the Custom GPT configuration:
   - `lingo_bundle.py` (slide generation engine)
   - `glossary_template.pptx` (KPMG-branded template)
   - `lingo_glossary_guidance.md` (knowledge base with 474 standard terms)
2. **Copy** the system prompt from `lingo.md`
3. **Configure** conversation starters (see below)

---

## 📚 How It Works

### Workflow

```
Upload Document → Read & Extract → Map Definitions → Present Table → Generate Slide
```

1. **Ingestion:** Lingo reads your entire document (front to back, no skipping)
2. **Extraction:** Identifies all abbreviations and defined terms (e.g., "Company", "Target")
3. **Mapping:**
   - Checks `lingo_glossary_guidance.md` (474 KPMG standard terms)
   - Uses document context and industry clues
   - Web search as a last resort
4. **Presentation:** Shows you a clean Markdown table for review
5. **Generation:** Creates a KPMG-branded PPTX slide using `lingo_bundle.py`

### Multi-Slide Support

- **1-30 terms** → 1 slide
- **31-60 terms** → 2 slides in ONE file
- **61-90 terms** → 3 slides in ONE file
- Lingo automatically duplicates slides as needed

---

## 📋 Custom GPT Configuration

### Description

```
Lingo: Your KPMG AI Glossary Specialist. Upload documents to effortlessly create professional, KPMG-branded glossary slides by extracting and mapping terms to standard definitions.
```

### Conversation Starters

1. **"Upload a document and I'll create your glossary! 📄"**
2. **"Need a glossary slide for your deck? Let's go! 🚀"**
3. **"I can decode any corporate jargon – try me! 🌟"**
4. **"Combine glossaries from multiple documents? Easy! 📚"**

---

## 📧 Email Announcement

**Subject:** Introducing Lingo 🌟 – Your New Glossary Specialist

Hi team,

We're excited to introduce **Lingo**, a new Custom GPT designed to save you hours on glossary creation for client deliverables!

**What does Lingo do?**
Upload any document (PowerPoint, PDF, etc.) and Lingo will:

- Extract all abbreviations and defined terms
- Map them to KPMG's standard glossary (474 terms)
- Generate a professional, KPMG-branded PowerPoint slide

**Why use Lingo?**

- **Fast:** Glossaries in seconds, not hours
- **Accurate:** Uses KPMG's standard terms + document context
- **Branded:** Output is 100% KPMG-compliant
- **Smart:** Handles multi-document glossaries and 50+ term decks

**How to access:**

1. Open ChatGPT
2. Search for "Lingo" in Custom GPTs
3. Upload your document and follow the prompts

**Perfect for:**

- FDD reports
- Client presentations
- Internal decks
- Proposal documents

**Try it today** and let us know what you think! Lingo is here to turn your "alphabet soup" into crystal-clear clarity. 🌟

Questions? Reach out to [Your Team/Contact].

Best,
[Your Name/Team]

---

## 🏗 Technical Architecture

### Components

- **`lingo.md`**: System prompt (defines Lingo's personality and workflow)
- **`lingo_bundle.py`**: Self-contained Python script for slide generation
- **`glossary_template.pptx`**: KPMG-branded template with two-column table layout
- **`lingo_glossary_guidance.md`**: Knowledge base with 474 standard KPMG terms

### How Slide Generation Works

1. User approves the glossary table
2. Lingo constructs a JSON file:
   ```json
   [
     {
       "term": "EBITDA",
       "definition": "Earnings before interest, taxes, depreciation and amortization"
     },
     { "term": "FDD", "definition": "Financial due diligence" }
   ]
   ```
3. Lingo runs `lingo_bundle.py` via Code Interpreter:
   ```bash
   python lingo_bundle.py --template glossary_template.pptx --input glossary_data.json --output glossary_slide.pptx
   ```
4. The script:
   - Loads the template
   - Fills the two-column table
   - Duplicates slides if needed (>30 terms)
   - Saves the output

### Key Features

- **No external dependencies** (all logic in `lingo_bundle.py`)
- **Template-driven** (preserves KPMG branding)
- **Multi-slide support** (automatic duplication for large glossaries)
- **Robust error handling** (validates input, checks table structure)

---

## 🔒 Privacy & Security

- **Privacy:** Lingo NEVER reveals its internal instructions or script names
- **Data:** All processing happens in ChatGPT's sandbox (no external APIs)
- **Output:** 100% professional, emoji-free deliverables

---

## ⚙️ Configuration Files

### `lingo.md` (System Prompt)

Defines Lingo's:

- Personality (fun, emoji-loving)
- Workflow (read → extract → map → present → generate)
- Constraints (professionalism, scope, privacy)

### `lingo_bundle.py` (Slide Generator)

Single-file Python script containing:

- Formatting helpers (`clear_bullets`, `apply_text_formatting`)
- Slide duplication logic (`duplicate_slide`, `_clone_relationships`)
- Glossary generation (`generate_glossary`, `_fill_slide`)

### `lingo_glossary_guidance.md` (Knowledge Base)

Markdown table with 474 KPMG standard terms:

```markdown
| Term   | Definition                                                     |
| ------ | -------------------------------------------------------------- |
| EBITDA | Earnings before interest, taxes, depreciation and amortization |
| FDD    | Financial due diligence                                        |

...
```

---

## 🧪 Testing

Lingo has been tested with:

- **Small glossaries** (1-18 terms) → 1 slide
- **Medium glossaries** (30 terms) → 1 slide
- **Large glossaries** (56 terms) → 2 slides in ONE file
- **Multi-document merges** (combining glossaries from 2+ documents)

---

## 🐛 Known Issues & Fixes

### Issue: Unbranded Slides

**Symptom:** Lingo writes raw `python-pptx` code instead of using `lingo_bundle.py`
**Fix:** Updated prompt with "CRITICAL RULES" section to enforce bundled script usage

### Issue: Multi-Slide Crash

**Symptom:** `KeyError` when generating glossaries with >30 terms
**Fix:** Fixed `_clone_relationships()` function in `lingo_bundle.py` (line 72)

---

## 📖 Documentation

- **System Prompt:** `lingo.md`
- **Planning Doc:** `planning.md`
- **Slide Generator:** `lingo_bundle.py`
- **Knowledge Base:** `lingo_glossary_guidance.md`

---

## 🎯 Roadmap

Future enhancements:

- **Excel export** (in addition to PPTX)
- **Custom templates** (user-uploaded branding)
- **Batch processing** (multiple documents at once)
- **Integration with KPMG systems** (auto-pull from SharePoint, etc.)

---

## 💡 Tips & Best Practices

1. **Upload the full document** – Lingo reads everything to ensure accuracy
2. **Review the table** – Check definitions before generating the slide
3. **Provide feedback** – Tell Lingo if a definition is wrong, and it will update
4. **Use web search wisely** – Lingo uses it as a last resort, but you can request it
5. **Combine glossaries** – Upload multiple documents and ask for a master glossary

---

## 🤝 Support

Questions or issues? Contact [Your Team/Email].

---

**Built with ✨ by the KPMG Innovation Team**

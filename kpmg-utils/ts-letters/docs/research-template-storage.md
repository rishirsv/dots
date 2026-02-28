# Research: Template Storage Strategies for ChatGPT Custom GPTs

## Research Questions

1. How does ChatGPT's Code Interpreter access Knowledge files - as files on disk or via RAG retrieval?
2. Can Code Interpreter reliably read and write binary files (.docx) uploaded as Knowledge attachments?
3. What are the tradeoffs of base64-encoding binary files in Python knowledge files?
4. What's the most reliable method for precise DOCX template editing that preserves formatting?
5. Are there known limitations or failure modes when handling DOCX files in ChatGPT's sandbox?

## Summary

ChatGPT's Knowledge files are accessible **both** via RAG retrieval and directly by Code Interpreter at `/mnt/data`. When Code Interpreter is enabled, uploaded Knowledge files (including binary .docx) are copied into the sandbox filesystem, making them editable via python-docx. Base64 encoding adds complexity and 33% file size overhead without clear benefits since Code Interpreter can access raw binaries directly. The main risk is placeholder text being split across XML runs, which breaks simple string replacement.

## Key Points

- **Knowledge files are dual-access**: Files uploaded as Knowledge are parsed for RAG retrieval AND available at `/mnt/data` when Code Interpreter runs. This means raw .docx templates can be uploaded directly and accessed by Python code.

- **Code Interpreter has python-docx pre-installed**: The sandbox includes 300+ libraries including python-docx, eliminating the need for custom package uploads. However, the environment is ephemeral - generated files must be downloaded each session.

- **Base64 encoding is unnecessary overhead**: Since Code Interpreter can read binary files directly from `/mnt/data`, encoding templates as base64 strings in Python files adds 33% size increase and decode complexity with no benefit.

- **Placeholder splitting is the main risk**: Word can split text like `{{CLIENT_NAME}}` across multiple XML runs (e.g., `{{CLI`, `ENT_`, `NAME}}`), breaking naive string replacement. This requires run-aware replacement logic or the python-docx-template (docxtpl) library.

- **Headers/footers/tables need explicit handling**: python-docx requires separate iteration through `document.sections[].header`, `document.sections[].footer`, and `table.rows[].cells[].paragraphs` - they're not included in `document.paragraphs`.

- **OpenAI's own approach uses visual rendering**: OpenAI's internal skills convert documents to PNG for visual inspection. This aligns with the render-and-verify workflow in the provided skill file.

## Comparison

| Strategy | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **A. Raw .docx as Knowledge** | Direct access, no encoding overhead, preserves exact binary | May trigger RAG retrieval unexpectedly | **Recommended** |
| **B. Python data structures** | Explicit control, no binary handling | Loses original formatting, complex to maintain | Not recommended |
| **C. Base64 in Python file** | Portable, self-contained | 33% size overhead, decode complexity, no benefit over A | Not recommended |

**Recommendation**: Use Option A (raw .docx as Knowledge files) with explicit system prompt instructions to use Code Interpreter for file access rather than RAG retrieval.

## Risks & Considerations

| Risk | Mitigation |
|------|------------|
| RAG retrieval instead of file access | System prompt: "Always use Code Interpreter to read template files from /mnt/data. Do not use retrieval." |
| Placeholder text split across runs | Use docxtpl library OR implement run-coalescing logic before replacement |
| Headers/footers missed | Explicitly iterate all document sections, headers, footers, and tables |
| Formatting corruption | Render to PDF/PNG after edits and visually verify before delivery |
| Knowledge file exposure | Be aware that Code Interpreter users could potentially download Knowledge files |

## Detailed Analysis

### How Knowledge + Code Interpreter Interact

When both Knowledge and Code Interpreter are enabled on a custom GPT:

1. **Initial state**: Knowledge files are parsed into embeddings for RAG retrieval
2. **When Code Interpreter activates**: Files are copied to `/mnt/data/` in the sandbox
3. **Code can access**: `open('/mnt/data/filename.docx', 'rb')` or via python-docx `Document()`
4. **Files persist**: Within a session, modified files remain in `/mnt/data` until session ends

This dual nature means the system prompt must be explicit about which access method to use.

### Placeholder Replacement Strategy

The safest approach for legal documents:

```python
from docxtpl import DocxTemplate

doc = DocxTemplate("/mnt/data/template.docx")
context = {
    "client_name": "Acme Corp",
    "date": "January 9, 2026",
    # ... other variables
}
doc.render(context)
doc.save("/mnt/data/output.docx")
```

docxtpl handles:
- Run-spanning placeholders (Jinja2-style `{{ variable }}`)
- Headers and footers automatically
- Tables with row iteration
- Preserves all formatting

If docxtpl is not available in the sandbox, fallback to run-aware replacement:

```python
def replace_in_paragraph(paragraph, placeholder, value):
    """Coalesce runs, replace, preserving first run's formatting."""
    full_text = ''.join(run.text for run in paragraph.runs)
    if placeholder not in full_text:
        return
    new_text = full_text.replace(placeholder, value)
    # Clear all runs except first, put full text in first run
    for i, run in enumerate(paragraph.runs):
        if i == 0:
            run.text = new_text
        else:
            run.text = ''
```

### Codebase Context

The project has 9 template files in `/templates/`:
- Buyside: Client Release, Third Party Access, EL Template
- Sellside: Client Release, Third Party Access, Factual Accuracy, EL Template
- Plus a guidance PDF

These should be uploaded as Knowledge files directly without conversion.

## Recommendations

1. **Upload raw .docx templates as Knowledge files** - no base64 encoding needed
2. **Include explicit system prompt instructions** to use Code Interpreter file access, not RAG
3. **Use docxtpl if available** in the sandbox; otherwise implement run-coalescing replacement
4. **Mandate visual verification** via PDF/PNG rendering before final delivery
5. **Create a placeholder schema** documenting all `{{VARIABLE}}` names and their locations

## Sources

- [Knowledge in GPTs - OpenAI Help Center](https://help.openai.com/en/articles/8843948-knowledge-in-gpts)
- [Lack of Isolation between Code Interpreter sessions - Embrace The Red](https://embracethered.com/blog/posts/2024/lack-of-isolation-gpts-code-interpreter/)
- [Simon Willison on GPTs and Code Interpreter](https://simonwillison.net/2023/Nov/15/gpts/)
- [python-docx-template documentation](https://docxtpl.readthedocs.io/)
- [Filling a docx template while preserving style](https://blog.xa0.de/post/Filling-a-docx-template-with-Python-while-preserving-style/)
- [python-docx Working with Documents](https://python-docx.readthedocs.io/en/latest/user/documents.html)
- [ChatGPT Code Interpreter Capabilities](https://gist.github.com/trbielec/a00a58fa97a232bef8843cc8d0161e5b)
- [OpenAI Skills approach - Simon Willison](https://simonw.substack.com/p/openai-are-quietly-adopting-skills)
- [Python base64 module documentation](https://docs.python.org/3/library/base64.html)

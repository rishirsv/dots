# QA (Render + Compare)

This folder contains utilities for rendering decks and producing simple image diffs.

## Rendering (preferred)

Use PDF as an intermediate and render PNGs per slide:

- PPTX → PDF: LibreOffice (`soffice`)
- PDF → PNG: poppler (`pdftoppm`)

Example:

```bash
python3 -c "from pathlib import Path; from qa.render import render_pptx_to_pngs_via_pdf; render_pptx_to_pngs_via_pdf(Path('outputs/latest/nvidia/deck.pptx'), Path('outputs/latest/nvidia/deck_pdf_png'))"
```

## Strict overflow check

The optional strict overflow check renders with padding and inspects margins:

```bash
python3 qa/strict_overflow.py outputs/latest/nvidia/deck.pptx --out outputs/strict/manual/overflow
```

Dependencies for strict checks include `soffice`, `pdftoppm`, and the QA Python requirements.

## Comparing decks

Title-based matching is safest when slide counts differ:

```bash
python3 -m venv .venv-qa
source .venv-qa/bin/activate
python -m pip install -r requirements/requirements-qa.txt

python -c "from pathlib import Path; from qa.compare import compare_decks_by_title; print(compare_decks_by_title(Path('references/baselines/pptx/v1-nvidia-v2.pptx'), Path('outputs/latest/nvidia/deck.pptx'), Path('outputs/v1-nvidia-v2_pdf_png'), Path('outputs/latest/nvidia/deck_pdf_png'), Path('outputs/latest/nvidia/compare_vs_v1_title_match')))"
```

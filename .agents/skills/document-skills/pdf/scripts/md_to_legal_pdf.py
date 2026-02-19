#!/usr/bin/env python3
"""
Convert a Markdown file to a “legal-styled” PDF using ReportLab.
Focus: serif typography, US Letter, 1” margins, justified body, clear headings,
simple lists, and basic table support for Markdown pipe tables.

Usage:
  python md_to_legal_pdf.py <input.md> <output.pdf>
"""
from __future__ import annotations

import re
import sys
from pathlib import Path
from typing import List, Tuple

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    ListFlowable,
    ListItem,
    Table,
    TableStyle,
    Flowable,
)


def _normalize_inline_markup(text: str) -> str:
    """
    Minimal Markdown → ReportLab-Paragraph inline markup:
    - **bold** → <b>...</b>
    - _italic_ or *italic* → <i>...</i>
    Escapes ampersands and angle brackets first.
    """
    # Escape basic XML entities first
    text = (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )
    # Bold
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    # Italic (underscore or star)
    text = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<i>\1</i>", text)
    text = re.sub(r"_(.+?)_", r"<i>\1</i>", text)
    return text


def _is_hr(line: str) -> bool:
    s = line.strip()
    return s == "---" or s == "***"


def _is_table_row(line: str) -> bool:
    # basic pipe table row check
    s = line.strip()
    return s.startswith("|") and s.endswith("|") and s.count("|") >= 2


def _parse_table(block_lines: List[str]) -> Tuple[List[List[str]], List[int]]:
    """
    Parse a simple GitHub‑style pipe table. Skips the second row if it’s a separator like | --- | --- |.
    Returns rows and column count.
    """
    rows: List[List[str]] = []
    for i, raw in enumerate(block_lines):
        # Skip header separator row (contains only dashes/colons/pipes/spaces)
        if i == 1 and re.fullmatch(r"\s*\|[\s:\-|\t]+\|\s*", raw):
            continue
        # Split by pipe, strip cells
        parts = [c.strip() for c in raw.strip()[1:-1].split("|")]
        rows.append(parts)
    col_count = max((len(r) for r in rows), default=0)
    # Normalize row lengths
    for r in rows:
        if len(r) < col_count:
            r.extend([""] * (col_count - len(r)))
    return rows, list(range(col_count))


def _gather_paragraph(par_lines: List[str]) -> str:
    # Join paragraph lines with spaces (respect two-spaces line break)
    buf: List[str] = []
    for ln in par_lines:
        if ln.endswith("  \n") or ln.endswith("  "):
            buf.append(ln.rstrip())
        else:
            buf.append(ln.strip())
    text = " ".join(buf).strip()
    return _normalize_inline_markup(text)


def _title_from_first_line(lines: List[str]) -> str | None:
    if not lines:
        return None
    if lines[0].lstrip().startswith("# "):
        return lines[0].lstrip()[2:].strip()
    return None


def _build_styles():
    styles = getSampleStyleSheet()
    # Base body legal style
    styles.add(
        ParagraphStyle(
            name="LegalBody",
            parent=styles["Normal"],
            fontName="Times-Roman",
            fontSize=12,
            leading=15,
            alignment=TA_JUSTIFY,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="LegalQuote",
            parent=styles["Normal"],
            fontName="Times-Italic",
            fontSize=12,
            leading=15,
            leftIndent=18,
            rightIndent=18,
            spaceBefore=6,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H1",
            parent=styles["Normal"],
            fontName="Times-Bold",
            fontSize=18,
            leading=22,
            spaceBefore=12,
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H2",
            parent=styles["Normal"],
            fontName="Times-Bold",
            fontSize=14,
            leading=18,
            spaceBefore=10,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H3",
            parent=styles["Normal"],
            fontName="Times-Bold",
            fontSize=12.5,
            leading=16,
            spaceBefore=8,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Caption",
            parent=styles["Normal"],
            fontName="Times-Italic",
            fontSize=10.5,
            leading=13,
            alignment=TA_CENTER,
            textColor=colors.grey,
            spaceBefore=4,
            spaceAfter=6,
        )
    )
    return styles


def _legal_page_cb(title: str):
    def on_page(canvas: Canvas, doc):
        canvas.saveState()
        # Header
        canvas.setFont("Times-Italic", 9)
        canvas.setFillColor(colors.grey)
        canvas.drawCentredString(doc.pagesize[0] / 2.0, doc.pagesize[1] - 0.5 * inch + 6, title[:90])
        # Footer page number
        canvas.setFont("Times-Roman", 9)
        canvas.setFillColor(colors.black)
        page_num = canvas.getPageNumber()
        canvas.drawCentredString(doc.pagesize[0] / 2.0, 0.5 * inch - 12, f"Page {page_num}")
        canvas.restoreState()

    return on_page


def md_to_story(md_path: Path, styles) -> List[Flowable]:
    story: List[Flowable] = []
    text = md_path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)

    # Optional title from first line; if present, consume it so it isn't duplicated
    title = _title_from_first_line(lines) or "Document"
    if lines and lines[0].lstrip().startswith("# "):
        lines = lines[1:]
    # Build explicit title once
    story.append(Paragraph(_normalize_inline_markup(title), styles["H1"]))
    story.append(Spacer(1, 6))

    i = 0
    par_buf: List[str] = []
    list_buf: List[Tuple[str, str]] = []  # (type: 'ul'|'ol', text)
    table_buf: List[str] = []

    def flush_paragraph():
        nonlocal par_buf
        if par_buf:
            story.append(Paragraph(_gather_paragraph(par_buf), styles["LegalBody"]))
            par_buf = []

    def flush_list():
        nonlocal list_buf
        if list_buf:
            # Determine bullet type
            is_ol = any(t == "ol" for t, _ in list_buf)
            items = []
            for t, item_text in list_buf:
                p = Paragraph(_normalize_inline_markup(item_text.strip()), styles["LegalBody"])
                items.append(ListItem(p, leftIndent=18))
            story.append(
                ListFlowable(
                    items,
                    bulletType="1" if is_ol else "bullet",
                    start="1",
                    bulletFontName="Times-Roman",
                    bulletFontSize=11,
                    bulletDedent=6,
                    leftIndent=18,
                )
            )
            list_buf = []

    def flush_table():
        nonlocal table_buf
        if table_buf:
            rows, cols = _parse_table(table_buf)
            # Normalize inline markup in cells
            rows = [[_normalize_inline_markup(c) for c in row] for row in rows]
            # Convert to Paragraphs for wrapping
            row_flows = [
                [Paragraph(cell or "", styles["LegalBody"]) for cell in row] for row in rows
            ]
            # Column widths: fit to content evenly (simple heuristic)
            usable_width = LETTER[0] - 2 * inch
            col_count = len(cols) if cols else (len(rows[0]) if rows else 0)
            col_width = usable_width / max(col_count, 1)
            t = Table(row_flows, colWidths=[col_width] * max(col_count, 1))
            style_cmds = [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("ALIGN", (0, 0), (-1, 0), "CENTER"),
                ("BACKGROUND", (0, 0), (-1, 0), colors.whitesmoke),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
            t.setStyle(TableStyle(style_cmds))
            story.append(t)
            story.append(Spacer(1, 6))
            table_buf = []

    while i < len(lines):
        line = lines[i]

        # Table block
        if _is_table_row(line):
            flush_paragraph()
            flush_list()
            table_buf.append(line)
            i += 1
            # consume following table rows
            while i < len(lines) and _is_table_row(lines[i]):
                table_buf.append(lines[i])
                i += 1
            flush_table()
            continue

        # Horizontal rule
        if _is_hr(line):
            flush_paragraph()
            flush_list()
            # draw a small spacer to emulate rule separation
            story.append(Spacer(1, 6))
            i += 1
            continue

        # Headings
        if line.lstrip().startswith("### "):
            flush_paragraph()
            flush_list()
            story.append(Paragraph(_normalize_inline_markup(line.lstrip()[4:].strip()), styles["H3"]))
            i += 1
            continue
        if line.lstrip().startswith("## "):
            flush_paragraph()
            flush_list()
            story.append(Paragraph(_normalize_inline_markup(line.lstrip()[3:].strip()), styles["H2"]))
            i += 1
            continue
        if line.lstrip().startswith("# "):
            flush_paragraph()
            flush_list()
            story.append(Paragraph(_normalize_inline_markup(line.lstrip()[2:].strip()), styles["H1"]))
            i += 1
            continue

        # Blockquote
        if line.lstrip().startswith(">"):
            flush_paragraph()
            flush_list()
            quote_text = line.lstrip()[1:].strip()
            story.append(Paragraph(_normalize_inline_markup(quote_text), styles["LegalQuote"]))
            i += 1
            # consume consecutive quoted lines
            while i < len(lines) and lines[i].lstrip().startswith(">"):
                quote_text = lines[i].lstrip()[1:].strip()
                story.append(Paragraph(_normalize_inline_markup(quote_text), styles["LegalQuote"]))
                i += 1
            continue

        # Lists (ordered and unordered)
        m_ol = re.match(r"^\s*(\d+)\.\s+(.*)$", line)
        m_ul = re.match(r"^\s*[-*]\s+(.*)$", line)
        if m_ol:
            flush_paragraph()
            list_buf.append(("ol", m_ol.group(2)))
            i += 1
            # consume subsequent list items
            while i < len(lines):
                m_next = re.match(r"^\s*(\d+)\.\s+(.*)$", lines[i])
                if m_next:
                    list_buf.append(("ol", m_next.group(2)))
                    i += 1
                else:
                    break
            flush_list()
            continue
        if m_ul:
            flush_paragraph()
            list_buf.append(("ul", m_ul.group(1)))
            i += 1
            # consume subsequent list items
            while i < len(lines):
                m_next = re.match(r"^\s*[-*]\s+(.*)$", lines[i])
                if m_next:
                    list_buf.append(("ul", m_next.group(1)))
                    i += 1
                else:
                    break
            flush_list()
            continue

        # Blank line → paragraph break
        if line.strip() == "":
            flush_paragraph()
            i += 1
            continue

        # Default: part of current paragraph
        par_buf.append(line)
        i += 1

    # Final flush
    flush_table()
    flush_list()
    flush_paragraph()
    return story


def main():
    if len(sys.argv) != 3:
        print("Usage: md_to_legal_pdf.py <input.md> <output.pdf>")
        sys.exit(1)
    in_md = Path(sys.argv[1])
    out_pdf = Path(sys.argv[2])
    if not in_md.exists():
        print(f"Input not found: {in_md}")
        sys.exit(2)

    title = "Dollar Tree Share Purchase Agreement"
    styles = _build_styles()

    doc = SimpleDocTemplate(
        str(out_pdf),
        pagesize=LETTER,
        leftMargin=inch,
        rightMargin=inch,
        topMargin=inch,
        bottomMargin=inch,
        title=title,
        author="document-skills",
    )
    story = md_to_story(in_md, styles)
    page_cb = _legal_page_cb(title)
    doc.build(story, onFirstPage=page_cb, onLaterPages=page_cb)
    print(f"Wrote PDF: {out_pdf}")


if __name__ == "__main__":
    main()

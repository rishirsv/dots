from __future__ import annotations

import re

from models import DocumentModel, Finding


_PAGE_REF_RE = re.compile(r"\bpage\s+(\d{1,4})\b", flags=re.IGNORECASE)
_APPENDIX_REF_RE = re.compile(r"\bappendix\s+([A-Z])\b", flags=re.IGNORECASE)
_APPENDIX_HEADER_RE = re.compile(r"^\s*appendix\s+([A-Z])\b", flags=re.IGNORECASE | re.MULTILINE)


def _find_available_appendices(doc: DocumentModel) -> set[str]:
    """
    Return a set of appendix letters *present* in the document.

    We treat "Appendix X" as present when it appears like a section/header
    (start-of-line). This avoids counting references like "See Appendix B."
    as evidence that Appendix B exists.
    """

    available: set[str] = set()
    for page in doc.pages:
        for m in _APPENDIX_HEADER_RE.finditer(page.raw_text):
            available.add(m.group(1).upper())
    return available


def run_crossref_checks(doc: DocumentModel) -> list[Finding]:
    """Find broken page references and appendix references."""

    findings: list[Finding] = []

    available_appendices = _find_available_appendices(doc)
    total = doc.total_pages

    for page in doc.pages:
        appendix_header_starts = {m.start() for m in _APPENDIX_HEADER_RE.finditer(page.raw_text)}

        for m in _PAGE_REF_RE.finditer(page.raw_text):
            page_ref = int(m.group(1))
            if 1 <= page_ref <= total:
                continue
            findings.append(
                Finding(
                    id="",
                    page=page.page_num,
                    category="Cross-references",
                    priority="H",
                    comment=f"Invalid page reference: page {page_ref} (document has {total} pages).",
                )
            )

        for m in _APPENDIX_REF_RE.finditer(page.raw_text):
            letter = m.group(1).upper()
            # Skip "Appendix X" header lines (those define what exists).
            if m.start() in appendix_header_starts:
                continue
            if letter in available_appendices:
                continue
            findings.append(
                Finding(
                    id="",
                    page=page.page_num,
                    category="Cross-references",
                    priority="H",
                    comment=(
                        f"Appendix reference to Appendix {letter}, but only found "
                        f"{', '.join(sorted(available_appendices))} in the document."
                    ),
                )
            )

    return findings

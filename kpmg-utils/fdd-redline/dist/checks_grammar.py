from __future__ import annotations

import re

from models import Finding, PageModel


_REPEATED_WORD_RE = re.compile(r"\b([A-Za-z]{2,})\b\s+\1\b", flags=re.IGNORECASE)
_DOUBLE_SPACE_WORD_TO_WORD_RE = re.compile(r"\b([A-Za-z]{2,}) {2,}([A-Za-z]{2,})\b")


def find_repeated_words(page: PageModel) -> list[Finding]:
    """Detect repeated words like 'the the' (ignores repeated all-caps acronyms)."""

    match = _REPEATED_WORD_RE.search(page.raw_text)
    if not match:
        return []

    word = match.group(1)
    if word.isupper():
        return []

    phrase = match.group(0)
    return [
        Finding(
            id="",
            page=page.page_num,
            category="Grammar",
            priority="L",
            comment=f'Repeated word "{phrase}" found.',
        )
    ]


def find_double_spaces(page: PageModel) -> list[Finding]:
    """
    Detect double spaces between word-to-word only.

    This avoids false positives in dense numeric layouts like "FY21   FY22".
    """

    if not _DOUBLE_SPACE_WORD_TO_WORD_RE.search(page.raw_text):
        return []

    return [
        Finding(
            id="",
            page=page.page_num,
            category="Grammar",
            priority="L",
            comment="Double space found between words.",
        )
    ]


def find_misspellings(page: PageModel, misspellings: dict[str, str]) -> list[Finding]:
    """Find misspellings using whole-word matching."""

    findings: list[Finding] = []
    for wrong, correct in misspellings.items():
        if not wrong:
            continue
        pattern = re.compile(rf"\b{re.escape(wrong)}\b", flags=re.IGNORECASE)
        if not pattern.search(page.raw_text):
            continue

        findings.append(
            Finding(
                id="",
                page=page.page_num,
                category="Grammar",
                priority="L",
                comment=f'Misspelling "{wrong}" found. Consider "{correct}".',
            )
        )
    return findings


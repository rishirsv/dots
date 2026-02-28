from __future__ import annotations

import re

from models import DocumentModel, Finding


def _count_term(doc: DocumentModel, term: str) -> tuple[int, list[int]]:
    """Return (count, pages_used) for a term, using whole-word matching."""

    if not term:
        return (0, [])

    regex = re.compile(rf"\b{re.escape(term)}\b")
    count = 0
    pages: set[int] = set()
    for page in doc.pages:
        matches = regex.findall(page.raw_text)
        if matches:
            count += len(matches)
            pages.add(page.page_num)
    return (count, sorted(pages))


def find_term_variants(doc: DocumentModel, term_groups: dict[str, dict[str, object]]) -> list[Finding]:
    """
    Detect terminology variants and recommend the majority variant as canonical.

    `term_groups` example:
    {
      "qoe": {"full_form": "Quality of Earnings", "abbreviations": ["QoE", "QofE"]}
    }
    """

    findings: list[Finding] = []
    for group_name, group in term_groups.items():
        abbreviations_obj = group.get("abbreviations", [])
        if not isinstance(abbreviations_obj, list):
            continue

        abbreviations = [str(a) for a in abbreviations_obj if str(a).strip()]
        if len(abbreviations) < 2:
            continue

        counts: dict[str, int] = {}
        pages_by_variant: dict[str, list[int]] = {}
        for variant in abbreviations:
            count, pages = _count_term(doc, variant)
            if count:
                counts[variant] = count
                pages_by_variant[variant] = pages

        if len(counts) <= 1:
            continue

        recommended = max(sorted(counts.keys()), key=lambda k: counts[k])
        parts: list[str] = []
        for variant in sorted(counts.keys()):
            pages = pages_by_variant.get(variant, [])
            parts.append(f'{variant} (pages {", ".join(map(str, pages))})')

        comment = (
            f'Terminology variants detected for "{group_name}": '
            + "; ".join(parts)
            + f'. Recommend "{recommended}" as the canonical form.'
        )

        findings.append(
            Finding(
                id="",
                page=0,
                category="Style",
                priority="M",
                comment=comment,
            )
        )

    return findings


from __future__ import annotations

import re

from models import Finding, PageModel


def _canonicalize_placeholder_token(token: str) -> str:
    """
    Canonicalize common anonymisation placeholders so repeated tokens compress cleanly.

    Example: "[CUSTOMER 12]" -> "[CUSTOMER N]"
    """

    upper = token.upper()
    if upper.startswith("[CUSTOMER"):
        return "[CUSTOMER N]"
    if upper.startswith("[BANK"):
        return "[BANK N]"
    if upper.startswith("[SHAREHOLDER"):
        return "[SHAREHOLDER N]"
    return token


def find_placeholders(page: PageModel, patterns: list[dict[str, str]]) -> list[Finding]:
    """
    Find placeholder tokens on a page based on literal and regex patterns.

    Pattern shape:
    - {"pattern": "[TBD]", "type": "literal"}
    - {"pattern": r"\\[Customer \\d+\\]", "type": "regex", "canonical": "[CUSTOMER N]"}
    """

    findings: list[Finding] = []

    for entry in patterns:
        pattern = entry.get("pattern", "")
        pattern_type = entry.get("type", "regex").lower()
        canonical = entry.get("canonical", "").strip()

        if not pattern:
            continue

        if pattern_type == "literal":
            if pattern in page.raw_text:
                token = canonical or pattern
                token = _canonicalize_placeholder_token(token)
                findings.append(
                    Finding(
                        id="",
                        page=page.page_num,
                        category="Placeholders",
                        priority="H",
                        comment=f'Placeholder "{token}" found.',
                    )
                )
            continue

        try:
            regex = re.compile(pattern, flags=re.IGNORECASE)
        except re.error:
            continue

        matches = list(regex.finditer(page.raw_text))
        for m in matches:
            raw_token = m.group(0)
            token = canonical or raw_token
            token = _canonicalize_placeholder_token(token)
            if token != raw_token:
                comment = f'Placeholder "{token}" found (example: "{raw_token}").'
            else:
                comment = f'Placeholder "{token}" found.'

            findings.append(
                Finding(
                    id="",
                    page=page.page_num,
                    category="Placeholders",
                    priority="H",
                    comment=comment,
                )
            )

    return findings


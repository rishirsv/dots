from __future__ import annotations

import re


def group_contiguous(nums: list[int]) -> list[tuple[int, int]]:
    """Group a list of integers into contiguous ranges."""

    if not nums:
        return []

    sorted_unique = sorted(set(nums))
    ranges: list[tuple[int, int]] = []
    start = sorted_unique[0]
    end = start
    for n in sorted_unique[1:]:
        if n == end + 1:
            end = n
            continue
        ranges.append((start, end))
        start = n
        end = n
    ranges.append((start, end))
    return ranges


_COLON_LINE_RE = re.compile(r"^\s*([A-Za-z][A-Za-z0-9 &/\\-]{0,80}?)\s*:\s*(.+?)\s*$")
_OF_WAS_IS_RE = re.compile(
    r"^\s*([A-Za-z][A-Za-z0-9 &/\\-]{0,80}?)\s+(?:of|was|is|are|were)\s+(.+?)\s*$",
    flags=re.IGNORECASE,
)
_HAS_NUMBER_RE = re.compile(r"(?<![A-Za-z])\d")


def extract_metrics_from_text(text: str) -> list[tuple[str, str]]:
    """
    Extract simple (label, value) metric pairs from raw page text.

    Heuristics are intentionally lightweight:
    - `Label: value`
    - `Label of value` / `Label was value`
    """

    metrics: list[tuple[str, str]] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        m = _COLON_LINE_RE.match(line)
        if m and _HAS_NUMBER_RE.search(m.group(2)):
            label = m.group(1).strip()
            value = m.group(2).strip()
            metrics.append((label, value))
            continue

        m = _OF_WAS_IS_RE.match(line)
        if m and _HAS_NUMBER_RE.search(m.group(2)):
            label = m.group(1).strip()
            value = m.group(2).strip()
            metrics.append((label, value))
            continue

    return metrics


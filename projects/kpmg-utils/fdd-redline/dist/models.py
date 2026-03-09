from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(slots=True)
class PageModel:
    """A single page/slide of the source document."""

    page_num: int
    raw_text: str
    has_table: bool
    has_chart: bool
    metrics: list[tuple[str, str]] = field(default_factory=list)


@dataclass(slots=True)
class DocumentModel:
    """A parsed document with page-level text and basic signals for review."""

    pages: list[PageModel]
    source_path: str
    source_type: str  # "pptx" | "pdf"
    total_pages: int


@dataclass(slots=True)
class Finding:
    """
    A single review finding.

    `id` is the sequential row id (001, 002, ...). `stable_id` is deterministic
    across runs for the same (page, category, comment) tuple.
    """

    id: str
    page: int
    category: str  # Grammar | Style | Calculations | Alignment | Placeholders | Cross-references
    priority: str  # H | M | L
    comment: str
    stable_id: str = ""
    is_valid: bool = True


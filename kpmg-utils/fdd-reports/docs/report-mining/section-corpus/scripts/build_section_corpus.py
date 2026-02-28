#!/usr/bin/env python3
"""Build a deterministic, verbatim section corpus from cleaned report markdown files."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import json
import re
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

HEADING_RE = re.compile(r"^(#{1,6})\s+(.*?)\s*$")
REPORT_ID_RE = re.compile(r"^#\s+Report Extraction:\s*(.+?)\s*$", re.MULTILINE)


@dataclass(frozen=True)
class HeadingBlock:
    """A parsed markdown heading and its body range."""

    index: int
    level: int
    text: str
    line_start: int
    body_start: int
    end_line: int
    body: str


@dataclass(frozen=True)
class ReportDoc:
    """Parsed source report with metadata needed for corpus generation."""

    report_id: str
    industry: str
    source_file: str
    path: Path
    text: str
    headings: Sequence[HeadingBlock]


@dataclass(frozen=True)
class SectionConfig:
    """Canonical section config and alias matching rules."""

    slug: str
    canonical_name: str
    aliases: Sequence[str]
    preferred_levels: Sequence[int] = (1,)


@dataclass(frozen=True)
class AdjustmentConfig:
    """Adjustment extraction config for specific subsection targets."""

    output_file: str
    title: str
    canonical_section: str
    parent_aliases: Sequence[str]
    subheading_aliases: Sequence[str]


# Canonical names are aligned with skill/kpmg-fdd/references/report-structure.md.
SECTION_CONFIGS: Sequence[SectionConfig] = (
    SectionConfig(
        slug="executive-summary",
        canonical_name="Executive summary",
        aliases=("Executive summary", "Executive Summary"),
    ),
    SectionConfig(
        slug="business-overview",
        canonical_name="Business overview",
        aliases=("Business overview", "Business Overview"),
    ),
    SectionConfig(
        slug="historical-financial-performance",
        canonical_name="Historical / financial performance",
        aliases=(
            "Historical / financial performance",
            "Profit and loss overview / financial performance",
            "Profit and Loss Overview / Financial Performance",
            "Profit and loss overview",
            "P&L overview",
            "Financial performance",
        ),
    ),
    SectionConfig(
        slug="qoe-and-earnings-adjustments",
        canonical_name="QoE and earnings adjustments",
        aliases=(
            "QoE and earnings adjustments",
            "Quality of earnings",
            "Quality of Earnings",
            "QoE",
            "QofE",
            "Quality of earnings adjustments",
        ),
        preferred_levels=(1, 2),
    ),
    SectionConfig(
        slug="working-capital",
        canonical_name="Working capital",
        aliases=(
            "Working capital",
            "Net working capital",
            "Net Working Capital",
            "NWC",
            "Net working capital adjustments",
        ),
        preferred_levels=(1, 2),
    ),
    SectionConfig(
        slug="net-debt-and-debt-like-items",
        canonical_name="Net debt and debt-like items",
        aliases=(
            "Net debt and debt-like items",
            "Net debt",
            "Net Debt",
            "Net debt (cash)",
            "Net Debt (Cash)",
            "Net debt / cash",
            "Net debt / cash adjustments",
            "Cash reconciliation",
        ),
        preferred_levels=(1, 2),
    ),
    SectionConfig(
        slug="risks-and-red-flags",
        canonical_name="Risks and red flags",
        aliases=(
            "Risks and red flags",
            "Risks",
            "Key findings",
            "Other considerations",
            "Commitments and contingencies",
            "Potential tax risk",
        ),
        preferred_levels=(1, 2),
    ),
    SectionConfig(
        slug="open-items-and-data-requests",
        canonical_name="Open items & data requests",
        aliases=(
            "Open items & data requests",
            "Open items",
            "Data requests",
            "Information outstanding from management",
            "Information read and outstanding",
        ),
        preferred_levels=(1, 2),
    ),
    SectionConfig(
        slug="summary-financials",
        canonical_name="Summary financials",
        aliases=("Summary financials", "Summary Financials"),
    ),
    SectionConfig(
        slug="income-statement",
        canonical_name="Income Statement",
        aliases=("Income Statement",),
    ),
    SectionConfig(
        slug="balance-sheet",
        canonical_name="Balance Sheet",
        aliases=("Balance Sheet",),
    ),
    SectionConfig(
        slug="cash-flows",
        canonical_name="Cash Flows",
        aliases=("Cash Flows",),
    ),
    SectionConfig(
        slug="reporting-environment",
        canonical_name="Reporting Environment",
        aliases=("Reporting Environment",),
    ),
    SectionConfig(
        slug="related-parties",
        canonical_name="Related Parties",
        aliases=("Related Parties",),
    ),
    SectionConfig(
        slug="industry-analysis",
        canonical_name="Industry Analysis",
        aliases=("Industry Analysis",),
    ),
    SectionConfig(
        slug="forecast-trading",
        canonical_name="Forecast Trading",
        aliases=("Forecast Trading",),
    ),
    SectionConfig(
        slug="quality-of-net-assets",
        canonical_name="Quality of Net Assets",
        aliases=("Quality of Net Assets",),
    ),
    SectionConfig(
        slug="gross-margin-by-lob",
        canonical_name="Gross Margin by LOB",
        aliases=("Gross Margin by LOB",),
    ),
    SectionConfig(
        slug="appendices",
        canonical_name="Appendices",
        aliases=("Appendices",),
    ),
)

ADJUSTMENT_CONFIGS: Sequence[AdjustmentConfig] = (
    AdjustmentConfig(
        output_file="qoe-adjustments-library.md",
        title="Quality of earnings adjustments library",
        canonical_section="QoE and earnings adjustments",
        parent_aliases=("Quality of Earnings", "Quality of earnings", "QoE", "QofE"),
        subheading_aliases=("Quality of earnings adjustments",),
    ),
    AdjustmentConfig(
        output_file="working-capital-adjustments-library.md",
        title="Net working capital adjustments library",
        canonical_section="Working capital",
        parent_aliases=("Net Working Capital", "Net working capital", "Working capital", "NWC"),
        subheading_aliases=("Net working capital adjustments",),
    ),
    AdjustmentConfig(
        output_file="net-debt-adjustments-library.md",
        title="Net debt / cash adjustments library",
        canonical_section="Net debt and debt-like items",
        parent_aliases=("Net Debt (Cash)", "Net debt (cash)", "Net debt", "Net Debt"),
        subheading_aliases=("Net debt / cash adjustments",),
    ),
)


def normalize_heading(text: str) -> str:
    """Normalize headings for robust alias matching."""
    lowered = text.strip().lower().replace("&", " and ")
    lowered = re.sub(r"[^a-z0-9]+", " ", lowered)
    return re.sub(r"\s+", " ", lowered).strip()


def parse_markdown_headings(text: str) -> List[HeadingBlock]:
    """Parse markdown headings and body ranges using heading levels."""
    lines = text.splitlines(keepends=True)
    headings_raw: List[Tuple[int, str, int]] = []
    for line_index, line in enumerate(lines):
        match = HEADING_RE.match(line)
        if not match:
            continue
        level = len(match.group(1))
        heading_text = match.group(2).strip()
        headings_raw.append((level, heading_text, line_index))

    blocks: List[HeadingBlock] = []
    for idx, (level, heading_text, line_start) in enumerate(headings_raw):
        end_line = len(lines)
        for next_level, _next_text, next_line_start in headings_raw[idx + 1 :]:
            if next_level <= level:
                end_line = next_line_start
                break
        body_start = line_start + 1
        body = "".join(lines[body_start:end_line])
        blocks.append(
            HeadingBlock(
                index=idx,
                level=level,
                text=heading_text,
                line_start=line_start,
                body_start=body_start,
                end_line=end_line,
                body=body,
            )
        )
    return blocks


def industry_from_filename(path: Path) -> str:
    """Parse industry from file name segment after '-industry-'."""
    stem = path.stem
    if "-industry-" not in stem:
        return "unknown"
    return stem.split("-industry-", 1)[1]


def parse_report_id(text: str, fallback: str) -> str:
    """Extract report_id from '# Report Extraction: ...' heading."""
    match = REPORT_ID_RE.search(text)
    if match:
        return match.group(1).strip()
    return fallback


def load_reports(root: Path) -> List[ReportDoc]:
    """Load and parse all cleaned markdown reports in deterministic order."""
    source_dir = root / "extracted" / "cleaned"
    reports: List[ReportDoc] = []
    for path in sorted(source_dir.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        headings = parse_markdown_headings(text)
        report_id = parse_report_id(text, fallback=path.stem)
        reports.append(
            ReportDoc(
                report_id=report_id,
                industry=industry_from_filename(path),
                source_file=path.relative_to(root).as_posix(),
                path=path,
                text=text,
                headings=headings,
            )
        )
    return reports


def heading_matches_alias(heading_text: str, alias: str) -> bool:
    """Match aliases directly and in appendix-style headings with a colon suffix."""
    heading_norm = normalize_heading(heading_text)
    alias_norm = normalize_heading(alias)

    if heading_norm == alias_norm:
        return True

    if ":" in heading_text:
        suffix = heading_text.split(":", 1)[1].strip()
        if normalize_heading(suffix) == alias_norm:
            return True

    return False


def level_rank(level: int, preferred_levels: Sequence[int]) -> int:
    """Return stable level preference rank used for deterministic tie-breaking."""
    if level in preferred_levels:
        return preferred_levels.index(level)
    return len(preferred_levels)


def find_best_section_block(report: ReportDoc, config: SectionConfig) -> Optional[HeadingBlock]:
    """Find best heading block for a canonical section using alias + level priority."""
    best: Optional[Tuple[int, int, int, HeadingBlock]] = None
    for block in report.headings:
        for alias_idx, alias in enumerate(config.aliases):
            if not heading_matches_alias(block.text, alias):
                continue
            candidate = (level_rank(block.level, config.preferred_levels), alias_idx, block.index, block)
            if best is None or candidate < best:
                best = candidate
            break
    return None if best is None else best[3]


def find_subheading_within_parent(
    report: ReportDoc,
    parent: HeadingBlock,
    aliases: Sequence[str],
) -> Optional[HeadingBlock]:
    """Find a subheading block contained within a parent section block."""
    best: Optional[Tuple[int, int, int, HeadingBlock]] = None
    for block in report.headings:
        if block.line_start <= parent.line_start or block.line_start >= parent.end_line:
            continue
        if block.level <= parent.level:
            continue
        for alias_idx, alias in enumerate(aliases):
            if not heading_matches_alias(block.text, alias):
                continue
            candidate = (block.level, alias_idx, block.index, block)
            if best is None or candidate < best:
                best = candidate
            break
    return None if best is None else best[3]


def render_entry(
    report: ReportDoc,
    canonical_section: str,
    matched_heading: Optional[str],
    verbatim_extract: Optional[str],
) -> str:
    """Render one report entry with required metadata and verbatim extract block."""
    lines: List[str] = []
    lines.append(f"## {report.report_id} | {report.industry}\n\n")
    lines.append(f"- report_id: {report.report_id}\n")
    lines.append(f"- industry: {report.industry}\n")
    lines.append(f"- source_file: {report.source_file}\n")
    lines.append(f"- canonical_section: {canonical_section}\n")
    lines.append(f"- matched_heading: {matched_heading or 'Not present in source report'}\n\n")
    lines.append("### Verbatim Extract\n\n")

    if verbatim_extract is None:
        lines.append("Not present in source report\n")
    else:
        lines.append(verbatim_extract)
        if not verbatim_extract.endswith("\n"):
            lines.append("\n")

    return "".join(lines)


def write_text(path: Path, text: str) -> None:
    """Write UTF-8 text file, creating parent directories as needed."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def build_section_file(
    output_dir: Path,
    reports: Sequence[ReportDoc],
    config: SectionConfig,
) -> Dict[str, object]:
    """Build one canonical section file and return deterministic stats."""
    entries: List[str] = []
    missing_reports: List[str] = []

    for report_idx, report in enumerate(reports):
        block = find_best_section_block(report, config)
        matched_heading = block.text if block else None
        extract = block.body if block else None
        if block is None:
            missing_reports.append(report.report_id)
        entries.append(
            render_entry(
                report=report,
                canonical_section=config.canonical_name,
                matched_heading=matched_heading,
                verbatim_extract=extract,
            )
        )
        if report_idx != len(reports) - 1:
            entries.append("\n---\n\n")

    output_path = output_dir / "sections" / f"{config.slug}.md"
    content = (
        f"# {config.canonical_name}\n\n"
        "Source corpus: `extracted/cleaned/*.md`\n\n"
        + "".join(entries)
    )
    write_text(output_path, content)

    return {
        "file": output_path.relative_to(output_dir).as_posix(),
        "entries": len(reports),
        "missing_reports": missing_reports,
    }


def build_adjustment_library(
    output_dir: Path,
    reports: Sequence[ReportDoc],
    config: AdjustmentConfig,
) -> Dict[str, object]:
    """Build one adjustments library from exact subsection extracts."""
    entries: List[str] = []
    missing_reports: List[str] = []

    parent_config = SectionConfig(
        slug="parent",
        canonical_name=config.canonical_section,
        aliases=config.parent_aliases,
        preferred_levels=(1, 2),
    )

    for report_idx, report in enumerate(reports):
        parent_block = find_best_section_block(report, parent_config)
        sub_block = None if parent_block is None else find_subheading_within_parent(
            report=report,
            parent=parent_block,
            aliases=config.subheading_aliases,
        )

        matched_heading = sub_block.text if sub_block else None
        extract = sub_block.body if sub_block else None

        if sub_block is None:
            missing_reports.append(report.report_id)

        entries.append(
            render_entry(
                report=report,
                canonical_section=config.canonical_section,
                matched_heading=matched_heading,
                verbatim_extract=extract,
            )
        )
        if report_idx != len(reports) - 1:
            entries.append("\n---\n\n")

    output_path = output_dir / "adjustments" / config.output_file
    content = (
        f"# {config.title}\n\n"
        "Source corpus: `extracted/cleaned/*.md`\n\n"
        + "".join(entries)
    )
    write_text(output_path, content)

    return {
        "file": output_path.relative_to(output_dir).as_posix(),
        "entries": len(reports),
        "missing_reports": missing_reports,
    }


def build_section_alias_map(output_dir: Path, section_configs: Sequence[SectionConfig]) -> None:
    """Write canonical section alias map used by the extraction pipeline."""
    lines: List[str] = []
    lines.append("# Section Alias Map\n\n")
    lines.append(
        "Canonical section names are aligned to `skill/kpmg-fdd/references/report-structure.md` where applicable.\n\n"
    )
    lines.append("| Canonical Section | Output File | Accepted Aliases |\n")
    lines.append("|---|---|---|\n")
    for config in section_configs:
        alias_text = ", ".join(f"`{alias}`" for alias in config.aliases)
        lines.append(
            f"| {config.canonical_name} | `sections/{config.slug}.md` | {alias_text} |\n"
        )
    write_text(output_dir / "section-alias-map.md", "".join(lines))


def build_report_index(output_dir: Path, reports: Sequence[ReportDoc]) -> None:
    """Write report index with report metadata and top-level headings."""
    lines: List[str] = []
    lines.append("# Report Index\n\n")
    lines.append("Source corpus: `extracted/cleaned/*.md`\n\n")

    for report_idx, report in enumerate(reports):
        top_level = [heading.text for heading in report.headings if heading.level == 1]
        lines.append(f"## {report.report_id}\n\n")
        lines.append(f"- industry: {report.industry}\n")
        lines.append(f"- source_file: {report.source_file}\n")
        lines.append(f"- top_level_headings_count: {len(top_level)}\n")
        lines.append("- top_level_headings:\n")
        for heading in top_level:
            lines.append(f"  - {heading}\n")
        lines.append("\n")
        if report_idx != len(reports) - 1:
            lines.append("---\n\n")

    write_text(output_dir / "report-index.md", "".join(lines))


def build_readme(
    output_dir: Path,
    report_count: int,
    section_files: Sequence[Dict[str, object]],
    adjustment_files: Sequence[Dict[str, object]],
) -> None:
    """Write corpus README with deterministic build instructions and outputs."""
    lines: List[str] = []
    lines.append("# Verbatim Section Corpus\n\n")
    lines.append(
        "This corpus is generated only from `extracted/cleaned/*.md` and preserves verbatim section text.\n\n"
    )
    lines.append("## Deterministic Build\n\n")
    lines.append("Run from repository root:\n\n")
    lines.append("```bash\n")
    lines.append("python3 docs/report-mining/section-corpus/scripts/build_section_corpus.py\n")
    lines.append("```\n\n")
    lines.append("## Outputs\n\n")
    lines.append(f"- Reports processed: {report_count}\n")
    lines.append("- Index: `report-index.md`\n")
    lines.append("- Alias map: `section-alias-map.md`\n")
    lines.append("- Canonical section corpus files:\n")
    for info in section_files:
        lines.append(f"  - `{info['file']}` ({info['entries']} report entries)\n")
    lines.append("- Adjustment libraries:\n")
    for info in adjustment_files:
        lines.append(f"  - `{info['file']}` ({info['entries']} report entries)\n")

    write_text(output_dir / "README.md", "".join(lines))


def build_summary(
    report_count: int,
    section_stats: Sequence[Dict[str, object]],
    adjustment_stats: Sequence[Dict[str, object]],
) -> Dict[str, object]:
    """Build deterministic JSON summary for validation and reporting."""
    return {
        "reports_processed": report_count,
        "section_outputs": list(section_stats),
        "adjustment_outputs": list(adjustment_stats),
    }


def main() -> None:
    """Entrypoint for deterministic corpus generation."""
    root = Path(__file__).resolve().parents[4]
    output_dir = root / "docs" / "report-mining" / "section-corpus"

    reports = load_reports(root)

    section_stats = [build_section_file(output_dir, reports, config) for config in SECTION_CONFIGS]
    adjustment_stats = [
        build_adjustment_library(output_dir, reports, config) for config in ADJUSTMENT_CONFIGS
    ]

    build_report_index(output_dir, reports)
    build_section_alias_map(output_dir, SECTION_CONFIGS)
    build_readme(output_dir, len(reports), section_stats, adjustment_stats)

    summary = build_summary(len(reports), section_stats, adjustment_stats)
    print(json.dumps(summary, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()

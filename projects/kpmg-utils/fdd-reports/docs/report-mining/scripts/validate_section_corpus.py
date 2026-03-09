#!/usr/bin/env python3
"""Validate section-corpus outputs against extracted/cleaned markdown sources."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
import json
import re
from typing import Dict, List, Optional, Sequence, Tuple


HEADING_RE = re.compile(r"^(#{1,6})\s+(.*?)\s*$")
REPORT_ID_RE = re.compile(r"^#\s+Report Extraction:\s*(.+?)\s*$", re.MULTILINE)
ENTRY_RE = re.compile(
    r"^##\s+(?P<title_report_id>[^\n]+?)\s+\|\s+(?P<title_industry>[^\n]+)\n"
    r"\n- report_id:\s*(?P<report_id>[^\n]*)\n"
    r"- industry:\s*(?P<industry>[^\n]*)\n"
    r"- source_file:\s*(?P<source_file>[^\n]*)\n"
    r"- canonical_section:\s*(?P<canonical_section>[^\n]*)\n"
    r"- matched_heading:\s*(?P<matched_heading>[^\n]*)\n"
    r"\n###\s+Verbatim Extract\n"
    r"\n(?P<extract>.*?)(?=\n---\n\n##\s+[^\n]+?\s+\|\s+[^\n]+\n\n- report_id:|\Z)",
    re.MULTILINE | re.DOTALL,
)

NOT_PRESENT = "Not present in source report"


@dataclass(frozen=True)
class HeadingBlock:
    index: int
    level: int
    text: str
    line_start: int
    body_start: int
    end_line: int
    body: str


@dataclass(frozen=True)
class ReportDoc:
    report_id: str
    industry: str
    source_file: str
    path: Path
    text: str
    headings: Sequence[HeadingBlock]


@dataclass(frozen=True)
class SectionConfig:
    output_file: str
    canonical_name: str
    aliases: Sequence[str]
    preferred_levels: Sequence[int] = (1,)
    collect_all_matches: bool = False


@dataclass(frozen=True)
class AdjustmentConfig:
    output_file: str
    title: str
    canonical_section: str
    parent_aliases: Sequence[str]
    subheading_aliases: Sequence[str]


@dataclass(frozen=True)
class ParsedEntry:
    index: int
    title_report_id: str
    title_industry: str
    report_id: str
    industry: str
    source_file: str
    canonical_section: str
    matched_heading: str
    extract: str


SECTION_CONFIGS: Sequence[SectionConfig] = (
    SectionConfig(
        output_file="sections/executive-summary.md",
        canonical_name="Executive summary",
        aliases=("Executive summary", "Executive Summary"),
    ),
    SectionConfig(
        output_file="sections/business-overview.md",
        canonical_name="Business overview",
        aliases=("Business overview", "Business Overview"),
    ),
    SectionConfig(
        output_file="sections/historical-financial-performance.md",
        canonical_name="Historical / financial performance",
        aliases=(
            "Historical / financial performance",
            "Profit and loss overview / financial performance",
            "Profit and Loss Overview / Financial Performance",
            "Profit and loss overview",
            "P&L overview",
            "Financial performance",
            "Income Statement",
        ),
        collect_all_matches=True,
    ),
    SectionConfig(
        output_file="sections/qoe-and-earnings-adjustments.md",
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
        output_file="sections/working-capital.md",
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
        output_file="sections/net-debt-and-debt-like-items.md",
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
        output_file="sections/risks-and-red-flags.md",
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
        output_file="sections/open-items-and-data-requests.md",
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
        output_file="sections/summary-financials.md",
        canonical_name="Summary financials",
        aliases=("Summary financials", "Summary Financials"),
    ),
    SectionConfig(
        output_file="sections/balance-sheet.md",
        canonical_name="Balance Sheet",
        aliases=("Balance Sheet",),
    ),
    SectionConfig(
        output_file="sections/cash-flows.md",
        canonical_name="Cash Flows",
        aliases=("Cash Flows",),
    ),
    SectionConfig(
        output_file="sections/reporting-environment.md",
        canonical_name="Reporting Environment",
        aliases=("Reporting Environment",),
    ),
    SectionConfig(
        output_file="sections/related-parties.md",
        canonical_name="Related Parties",
        aliases=("Related Parties",),
    ),
    SectionConfig(
        output_file="sections/industry-analysis.md",
        canonical_name="Industry Analysis",
        aliases=("Industry Analysis",),
    ),
    SectionConfig(
        output_file="sections/forecast-trading.md",
        canonical_name="Forecast Trading",
        aliases=("Forecast Trading",),
    ),
    SectionConfig(
        output_file="sections/quality-of-net-assets.md",
        canonical_name="Quality of Net Assets",
        aliases=("Quality of Net Assets",),
    ),
    SectionConfig(
        output_file="sections/gross-margin-by-lob.md",
        canonical_name="Gross Margin by LOB",
        aliases=("Gross Margin by LOB",),
    ),
    SectionConfig(
        output_file="sections/appendices.md",
        canonical_name="Appendices",
        aliases=("Appendices",),
    ),
)

ADJUSTMENT_CONFIGS: Sequence[AdjustmentConfig] = (
    AdjustmentConfig(
        output_file="adjustments/qoe-adjustments-library.md",
        title="Quality of earnings adjustments library",
        canonical_section="QoE and earnings adjustments",
        parent_aliases=("Quality of Earnings", "Quality of earnings", "QoE", "QofE"),
        subheading_aliases=("Quality of earnings adjustments",),
    ),
    AdjustmentConfig(
        output_file="adjustments/working-capital-adjustments-library.md",
        title="Net working capital adjustments library",
        canonical_section="Working capital",
        parent_aliases=("Net Working Capital", "Net working capital", "Working capital", "NWC"),
        subheading_aliases=("Net working capital adjustments",),
    ),
    AdjustmentConfig(
        output_file="adjustments/net-debt-adjustments-library.md",
        title="Net debt / cash adjustments library",
        canonical_section="Net debt and debt-like items",
        parent_aliases=("Net Debt (Cash)", "Net debt (cash)", "Net debt", "Net Debt"),
        subheading_aliases=("Net debt / cash adjustments",),
    ),
)


def normalize_newlines(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n")


def normalize_heading(text: str) -> str:
    lowered = text.strip().lower().replace("&", " and ")
    lowered = re.sub(r"[^a-z0-9]+", " ", lowered)
    return re.sub(r"\s+", " ", lowered).strip()


def parse_markdown_headings(text: str) -> List[HeadingBlock]:
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


def parse_report_id(text: str, fallback: str) -> str:
    match = REPORT_ID_RE.search(text)
    if match:
        return match.group(1).strip()
    return fallback


def industry_from_filename(path: Path) -> str:
    stem = path.stem
    if "-industry-" not in stem:
        return "unknown"
    return stem.split("-industry-", 1)[1]


def load_reports(root: Path) -> List[ReportDoc]:
    reports: List[ReportDoc] = []
    source_dir = root / "extracted" / "cleaned"
    for path in sorted(source_dir.glob("*.md")):
        text = normalize_newlines(path.read_text(encoding="utf-8"))
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
    if level in preferred_levels:
        return preferred_levels.index(level)
    return len(preferred_levels)


def find_best_section_block(report: ReportDoc, config: SectionConfig) -> Optional[HeadingBlock]:
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


def find_matching_section_blocks(report: ReportDoc, config: SectionConfig) -> List[HeadingBlock]:
    matches: List[Tuple[int, int, int, HeadingBlock]] = []
    seen_indexes = set()
    for block in report.headings:
        for alias_idx, alias in enumerate(config.aliases):
            if not heading_matches_alias(block.text, alias):
                continue
            if block.index in seen_indexes:
                break
            matches.append(
                (level_rank(block.level, config.preferred_levels), alias_idx, block.index, block)
            )
            seen_indexes.add(block.index)
            break
    matches.sort()
    return [match[3] for match in matches]


def find_subheading_within_parent(
    report: ReportDoc,
    parent: HeadingBlock,
    aliases: Sequence[str],
) -> Optional[HeadingBlock]:
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


def combined_matched_heading(blocks: Sequence[HeadingBlock]) -> str:
    if not blocks:
        return NOT_PRESENT
    return " + ".join(block.text for block in blocks)


def expected_extract_for_blocks(blocks: Sequence[HeadingBlock]) -> str:
    if not blocks:
        return f"{NOT_PRESENT}\n"
    parts: List[str] = []
    for idx, block in enumerate(blocks):
        if idx > 0:
            parts.append("\n")
        parts.append(block.body)
        if not block.body.endswith("\n"):
            parts.append("\n")
    text = "".join(parts)
    if not text.endswith("\n"):
        text += "\n"
    return text


def expected_extract_for_block(block: Optional[HeadingBlock]) -> str:
    if block is None:
        return f"{NOT_PRESENT}\n"
    return expected_extract_for_blocks([block])


def parse_output_entries(text: str) -> List[ParsedEntry]:
    entries: List[ParsedEntry] = []
    for idx, match in enumerate(ENTRY_RE.finditer(text)):
        entries.append(
            ParsedEntry(
                index=idx,
                title_report_id=match.group("title_report_id").strip(),
                title_industry=match.group("title_industry").strip(),
                report_id=match.group("report_id").strip(),
                industry=match.group("industry").strip(),
                source_file=match.group("source_file").strip(),
                canonical_section=match.group("canonical_section").strip(),
                matched_heading=match.group("matched_heading").strip(),
                extract=match.group("extract"),
            )
        )
    return entries


def first_diff_details(expected: str, actual: str, radius: int = 80) -> Dict[str, object]:
    limit = min(len(expected), len(actual))
    diff_index = 0
    while diff_index < limit and expected[diff_index] == actual[diff_index]:
        diff_index += 1
    if diff_index == limit and len(expected) == len(actual):
        return {"diff_index": -1, "expected_snippet": "", "actual_snippet": ""}

    start = max(0, diff_index - radius)
    end_expected = min(len(expected), diff_index + radius)
    end_actual = min(len(actual), diff_index + radius)
    expected_snippet = expected[start:end_expected].replace("\n", "\\n")
    actual_snippet = actual[start:end_actual].replace("\n", "\\n")
    return {
        "diff_index": diff_index,
        "expected_snippet": expected_snippet,
        "actual_snippet": actual_snippet,
    }


def classify_token_issue(expected: str, actual: str) -> str:
    if expected == actual:
        return "exact"
    if actual.startswith(expected):
        return "extra_tokens_appended"
    if actual.endswith(expected):
        return "extra_tokens_prepended"
    if expected in actual:
        return "extra_tokens_inserted"
    if actual in expected:
        return "output_missing_source_tokens"
    return "content_diverged"


def line_location(path: str, block: Optional[HeadingBlock]) -> Optional[str]:
    if block is None:
        return None
    start = block.line_start + 1
    end = max(start, block.end_line)
    return f"{path}:{start}-{end}"


def add_check(
    file_result: Dict[str, object],
    report_result: Optional[Dict[str, object]],
    *,
    requirement: str,
    check_id: str,
    passed: bool,
    message: str,
    expected: Optional[str] = None,
    actual: Optional[str] = None,
    source_location: Optional[str] = None,
) -> None:
    file_result["checks_total"] += 1
    if report_result is not None:
        report_result["checks_total"] += 1

    if passed:
        return

    failure = {
        "requirement": requirement,
        "check_id": check_id,
        "message": message,
    }
    if expected is not None:
        failure["expected"] = expected
    if actual is not None:
        failure["actual"] = actual
    if source_location is not None:
        failure["source_location"] = source_location

    if report_result is not None:
        failure["report_id"] = report_result.get("report_id", "unknown")
    file_result["failures"].append(failure)
    if report_result is not None:
        report_result["failures"].append(failure)


def expected_section_target(
    report: ReportDoc, config: SectionConfig
) -> Tuple[List[HeadingBlock], str]:
    if config.collect_all_matches:
        blocks = find_matching_section_blocks(report, config)
    else:
        block = find_best_section_block(report, config)
        blocks = [] if block is None else [block]
    return blocks, combined_matched_heading(blocks)


def expected_adjustment_target(
    report: ReportDoc, config: AdjustmentConfig
) -> Tuple[Optional[HeadingBlock], str, Optional[HeadingBlock]]:
    parent_config = SectionConfig(
        output_file="parent",
        canonical_name=config.canonical_section,
        aliases=config.parent_aliases,
        preferred_levels=(1, 2),
    )
    parent = find_best_section_block(report, parent_config)
    sub_block = None if parent is None else find_subheading_within_parent(
        report=report,
        parent=parent,
        aliases=config.subheading_aliases,
    )
    heading = sub_block.text if sub_block else NOT_PRESENT
    return sub_block, heading, parent


def find_blocks_by_exact_heading(report: ReportDoc, heading: str) -> List[HeadingBlock]:
    return [block for block in report.headings if block.text == heading]


def validate_section_file(
    root: Path,
    reports: Sequence[ReportDoc],
    config: SectionConfig,
) -> Dict[str, object]:
    file_path = root / "docs" / "report-mining" / "section-corpus" / config.output_file
    result: Dict[str, object] = {
        "file": file_path.relative_to(root).as_posix(),
        "kind": "section",
        "canonical_section": config.canonical_name,
        "checks_total": 0,
        "failures": [],
        "reports": [],
    }

    text = normalize_newlines(file_path.read_text(encoding="utf-8"))
    entries = parse_output_entries(text)
    entries_by_report: Dict[str, List[ParsedEntry]] = {}
    for entry in entries:
        entries_by_report.setdefault(entry.report_id, []).append(entry)

    add_check(
        result,
        None,
        requirement="4",
        check_id="entry_count_exact",
        passed=len(entries) == len(reports),
        message="Output file must contain exactly one entry per source report.",
        expected=str(len(reports)),
        actual=str(len(entries)),
    )

    for report in reports:
        report_result = {
            "report_id": report.report_id,
            "checks_total": 0,
            "failures": [],
        }
        result["reports"].append(report_result)
        matches = entries_by_report.get(report.report_id, [])

        add_check(
            result,
            report_result,
            requirement="1",
            check_id="entry_exists",
            passed=len(matches) >= 1,
            message="Expected report entry is missing in output file.",
            expected=report.report_id,
            actual="missing" if not matches else "present",
        )
        add_check(
            result,
            report_result,
            requirement="1",
            check_id="entry_unique",
            passed=len(matches) == 1,
            message="Report entry should appear exactly once per output file.",
            expected="1",
            actual=str(len(matches)),
        )

        if not matches:
            continue
        entry = matches[0]
        blocks, expected_heading = expected_section_target(report, config)
        primary_block = blocks[0] if blocks else None
        expected_extract = expected_extract_for_blocks(blocks)

        add_check(
            result,
            report_result,
            requirement="1",
            check_id="metadata_report_id",
            passed=entry.report_id == report.report_id,
            message="Metadata report_id must match source report_id.",
            expected=report.report_id,
            actual=entry.report_id,
        )
        add_check(
            result,
            report_result,
            requirement="1",
            check_id="title_report_id_matches_metadata",
            passed=entry.title_report_id == entry.report_id,
            message="Entry title report_id must match metadata report_id.",
            expected=entry.report_id,
            actual=entry.title_report_id,
        )
        add_check(
            result,
            report_result,
            requirement="1",
            check_id="metadata_source_file",
            passed=entry.source_file == report.source_file,
            message="Metadata source_file must match expected source file path.",
            expected=report.source_file,
            actual=entry.source_file,
        )
        add_check(
            result,
            report_result,
            requirement="1",
            check_id="title_industry_matches_metadata",
            passed=entry.title_industry == entry.industry,
            message="Entry title industry must match metadata industry.",
            expected=entry.industry,
            actual=entry.title_industry,
        )
        add_check(
            result,
            report_result,
            requirement="1",
            check_id="metadata_canonical_section",
            passed=entry.canonical_section == config.canonical_name,
            message="Metadata canonical_section must match file's canonical section.",
            expected=config.canonical_name,
            actual=entry.canonical_section,
        )
        add_check(
            result,
            report_result,
            requirement="1",
            check_id="metadata_matched_heading",
            passed=entry.matched_heading == expected_heading,
            message="Metadata matched_heading must equal deterministically selected source heading.",
            expected=expected_heading,
            actual=entry.matched_heading,
            source_location=line_location(report.source_file, primary_block),
        )

        actual_extract = entry.extract
        matches_expected = actual_extract == expected_extract
        add_check(
            result,
            report_result,
            requirement="2",
            check_id="extract_exact_match",
            passed=matches_expected,
            message="Verbatim Extract must byte-match source heading body (newline-normalized only).",
            expected=expected_extract,
            actual=actual_extract,
            source_location=line_location(report.source_file, primary_block),
        )

        add_check(
            result,
            report_result,
            requirement="3",
            check_id="no_extra_tokens",
            passed=matches_expected,
            message="Verbatim Extract must not include extra inserted tokens beyond source text.",
            expected="exact",
            actual=classify_token_issue(expected_extract, actual_extract),
            source_location=line_location(report.source_file, primary_block),
        )

        if entry.matched_heading == NOT_PRESENT:
            add_check(
                result,
                report_result,
                requirement="2",
                check_id="not_present_body_literal",
                passed=actual_extract == f"{NOT_PRESENT}\n",
                message="When heading is missing, extract body must be exactly 'Not present in source report'.",
                expected=f"{NOT_PRESENT}\\n",
                actual=actual_extract.replace("\n", "\\n"),
            )
        else:
            heading_parts = [part.strip() for part in entry.matched_heading.split(" + ")]
            candidate_blocks: List[HeadingBlock] = []
            for heading_part in heading_parts:
                candidates = find_blocks_by_exact_heading(report, heading_part)
                if not candidates:
                    candidate_blocks = []
                    break
                candidate_blocks.append(candidates[0])
            candidate_extract = expected_extract_for_blocks(candidate_blocks)
            candidate_ok = bool(candidate_blocks) and actual_extract == candidate_extract
            add_check(
                result,
                report_result,
                requirement="2",
                check_id="extract_matches_metadata_heading",
                passed=candidate_ok,
                message="Extract must match the source body for the metadata matched_heading.",
                expected=candidate_extract,
                actual="matched" if candidate_ok else "not_matched",
            )
            if not candidate_ok:
                diff = first_diff_details(expected_extract, actual_extract)
                if diff["diff_index"] != -1:
                    add_check(
                        result,
                        report_result,
                        requirement="2",
                        check_id="extract_diff_preview",
                        passed=False,
                        message="First mismatch between expected and actual extract content.",
                        expected=diff["expected_snippet"],  # type: ignore[arg-type]
                        actual=diff["actual_snippet"],  # type: ignore[arg-type]
                        source_location=line_location(report.source_file, primary_block),
                    )

        top_level_alias_hits = [
            candidate
            for candidate in report.headings
            if candidate.level == 1
            and any(heading_matches_alias(candidate.text, alias) for alias in config.aliases)
        ]
        if top_level_alias_hits:
            matched_heading_parts = [part.strip() for part in entry.matched_heading.split(" + ")]
            add_check(
                result,
                report_result,
                requirement="1",
                check_id="prefer_top_level_when_available",
                passed=entry.matched_heading == NOT_PRESENT
                or all(
                    any(candidate.text == heading_part for candidate in top_level_alias_hits)
                    for heading_part in matched_heading_parts
                ),
                message="When top-level heading alias exists, matched heading must come from top-level section.",
                expected=", ".join(candidate.text for candidate in top_level_alias_hits),
                actual=entry.matched_heading,
            )

    unexpected_entries = [entry.report_id for entry in entries if entry.report_id not in {r.report_id for r in reports}]
    add_check(
        result,
        None,
        requirement="1",
        check_id="no_unexpected_reports",
        passed=len(unexpected_entries) == 0,
        message="Output file should not contain entries for unknown report_ids.",
        expected="none",
        actual=", ".join(unexpected_entries) if unexpected_entries else "none",
    )

    result["entries_found"] = len(entries)
    result["status"] = "pass" if not result["failures"] else "fail"
    result["failures_count"] = len(result["failures"])
    return result


def validate_adjustment_file(
    root: Path,
    reports: Sequence[ReportDoc],
    config: AdjustmentConfig,
) -> Dict[str, object]:
    file_path = root / "docs" / "report-mining" / "section-corpus" / config.output_file
    result: Dict[str, object] = {
        "file": file_path.relative_to(root).as_posix(),
        "kind": "adjustment",
        "canonical_section": config.canonical_section,
        "required_subheadings": list(config.subheading_aliases),
        "checks_total": 0,
        "failures": [],
        "reports": [],
    }

    text = normalize_newlines(file_path.read_text(encoding="utf-8"))
    entries = parse_output_entries(text)
    entries_by_report: Dict[str, List[ParsedEntry]] = {}
    for entry in entries:
        entries_by_report.setdefault(entry.report_id, []).append(entry)

    add_check(
        result,
        None,
        requirement="4",
        check_id="entry_count_exact",
        passed=len(entries) == len(reports),
        message="Output file must contain exactly one entry per source report.",
        expected=str(len(reports)),
        actual=str(len(entries)),
    )

    for report in reports:
        report_result = {
            "report_id": report.report_id,
            "checks_total": 0,
            "failures": [],
        }
        result["reports"].append(report_result)
        matches = entries_by_report.get(report.report_id, [])

        add_check(
            result,
            report_result,
            requirement="1",
            check_id="entry_exists",
            passed=len(matches) >= 1,
            message="Expected report entry is missing in output file.",
            expected=report.report_id,
            actual="missing" if not matches else "present",
        )
        add_check(
            result,
            report_result,
            requirement="1",
            check_id="entry_unique",
            passed=len(matches) == 1,
            message="Report entry should appear exactly once per output file.",
            expected="1",
            actual=str(len(matches)),
        )
        if not matches:
            continue
        entry = matches[0]

        block, expected_heading, parent = expected_adjustment_target(report, config)
        expected_extract = expected_extract_for_block(block)
        source_loc = line_location(report.source_file, block)
        parent_loc = line_location(report.source_file, parent)

        add_check(
            result,
            report_result,
            requirement="1",
            check_id="metadata_report_id",
            passed=entry.report_id == report.report_id,
            message="Metadata report_id must match source report_id.",
            expected=report.report_id,
            actual=entry.report_id,
        )
        add_check(
            result,
            report_result,
            requirement="1",
            check_id="title_report_id_matches_metadata",
            passed=entry.title_report_id == entry.report_id,
            message="Entry title report_id must match metadata report_id.",
            expected=entry.report_id,
            actual=entry.title_report_id,
        )
        add_check(
            result,
            report_result,
            requirement="1",
            check_id="metadata_source_file",
            passed=entry.source_file == report.source_file,
            message="Metadata source_file must match expected source file path.",
            expected=report.source_file,
            actual=entry.source_file,
        )
        add_check(
            result,
            report_result,
            requirement="1",
            check_id="title_industry_matches_metadata",
            passed=entry.title_industry == entry.industry,
            message="Entry title industry must match metadata industry.",
            expected=entry.industry,
            actual=entry.title_industry,
        )
        add_check(
            result,
            report_result,
            requirement="1",
            check_id="metadata_canonical_section",
            passed=entry.canonical_section == config.canonical_section,
            message="Metadata canonical_section must match file's canonical section.",
            expected=config.canonical_section,
            actual=entry.canonical_section,
        )
        add_check(
            result,
            report_result,
            requirement="1",
            check_id="metadata_matched_heading",
            passed=entry.matched_heading == expected_heading,
            message="Metadata matched_heading must equal required adjustment subheading or Not present.",
            expected=expected_heading,
            actual=entry.matched_heading,
            source_location=source_loc or parent_loc,
        )

        matches_expected = entry.extract == expected_extract
        add_check(
            result,
            report_result,
            requirement="2",
            check_id="extract_exact_match",
            passed=matches_expected,
            message="Verbatim Extract must byte-match source adjustment subheading body.",
            expected=expected_extract,
            actual=entry.extract,
            source_location=source_loc or parent_loc,
        )
        add_check(
            result,
            report_result,
            requirement="3",
            check_id="no_extra_tokens",
            passed=matches_expected,
            message="Verbatim Extract must not include extra inserted tokens beyond source text.",
            expected="exact",
            actual=classify_token_issue(expected_extract, entry.extract),
            source_location=source_loc or parent_loc,
        )

        missing_required_subheading = block is None
        add_check(
            result,
            report_result,
            requirement="5",
            check_id="required_subheading_mapping",
            passed=(not missing_required_subheading and entry.matched_heading != NOT_PRESENT)
            or (missing_required_subheading and entry.matched_heading == NOT_PRESENT),
            message="Adjustment library must map to required subheading; missing cases must be explicit.",
            expected=NOT_PRESENT if missing_required_subheading else block.text if block else NOT_PRESENT,
            actual=entry.matched_heading,
            source_location=parent_loc,
        )

        if missing_required_subheading:
            add_check(
                result,
                report_result,
                requirement="5",
                check_id="missing_case_literal",
                passed=entry.extract == f"{NOT_PRESENT}\n",
                message="Missing adjustment subheading must render literal 'Not present in source report'.",
                expected=f"{NOT_PRESENT}\\n",
                actual=entry.extract.replace("\n", "\\n"),
                source_location=parent_loc,
            )
        else:
            candidates: List[HeadingBlock] = []
            if parent is not None:
                for candidate in report.headings:
                    if candidate.level <= parent.level:
                        continue
                    if candidate.line_start <= parent.line_start or candidate.line_start >= parent.end_line:
                        continue
                    if candidate.text == entry.matched_heading:
                        candidates.append(candidate)
            candidate_extracts = {expected_extract_for_block(candidate) for candidate in candidates}
            add_check(
                result,
                report_result,
                requirement="2",
                check_id="extract_matches_metadata_subheading",
                passed=entry.extract in candidate_extracts,
                message="Extract must match source body for metadata matched subheading under required parent.",
                expected=f"{len(candidates)} source subheading candidate(s)",
                actual="matched" if entry.extract in candidate_extracts else "not_matched",
                source_location=parent_loc,
            )

    unexpected_entries = [entry.report_id for entry in entries if entry.report_id not in {r.report_id for r in reports}]
    add_check(
        result,
        None,
        requirement="1",
        check_id="no_unexpected_reports",
        passed=len(unexpected_entries) == 0,
        message="Output file should not contain entries for unknown report_ids.",
        expected="none",
        actual=", ".join(unexpected_entries) if unexpected_entries else "none",
    )

    result["entries_found"] = len(entries)
    result["status"] = "pass" if not result["failures"] else "fail"
    result["failures_count"] = len(result["failures"])
    return result


def build_markdown_report(validation: Dict[str, object]) -> str:
    lines: List[str] = []
    lines.append("# Verbatim Validation Report\n\n")
    lines.append(f"- overall_status: **{validation['overall_status']}**\n")
    lines.append(f"- total_checks: {validation['total_checks']}\n")
    lines.append(f"- failures_count: {validation['failures_count']}\n")
    lines.append(f"- files_checked: {validation['files_checked']}\n")
    lines.append(f"- reports_expected_per_file: {validation['reports_in_source']}\n")
    lines.append(f"- command: `{validation['command']}`\n\n")

    top_issues: Sequence[Dict[str, object]] = validation.get("top_issues", [])  # type: ignore[assignment]
    if top_issues:
        lines.append("## Top Issues\n\n")
        for issue in top_issues:
            lines.append(
                f"- `{issue['check_id']}`: {issue['count']} failure(s) - {issue['message']}\n"
            )
        lines.append("\n")

    lines.append("## File Summary\n\n")
    lines.append("| File | Kind | Status | Entries | Checks | Failures |\n")
    lines.append("|---|---|---:|---:|---:|---:|\n")
    for file_result in validation["files"]:  # type: ignore[index]
        lines.append(
            f"| `{file_result['file']}` | {file_result['kind']} | {file_result['status']} | "
            f"{file_result['entries_found']} | {file_result['checks_total']} | {file_result['failures_count']} |\n"
        )
    lines.append("\n")

    lines.append("## Per-File Diagnostics\n\n")
    for file_result in validation["files"]:  # type: ignore[index]
        lines.append(f"### `{file_result['file']}`\n\n")
        lines.append(f"- status: **{file_result['status']}**\n")
        lines.append(f"- canonical_section: `{file_result['canonical_section']}`\n")
        lines.append(f"- entries_found: {file_result['entries_found']}\n")
        lines.append(f"- checks_total: {file_result['checks_total']}\n")
        lines.append(f"- failures_count: {file_result['failures_count']}\n\n")

        lines.append("| report_id | status | checks | failures |\n")
        lines.append("|---|---:|---:|---:|\n")
        for report in file_result["reports"]:
            report_status = "pass" if not report["failures"] else "fail"
            lines.append(
                f"| `{report['report_id']}` | {report_status} | "
                f"{report['checks_total']} | {len(report['failures'])} |\n"
            )
        lines.append("\n")

        if file_result["failures"]:
            lines.append("#### Failures\n\n")
            for idx, failure in enumerate(file_result["failures"], start=1):
                report_label = failure.get("report_id", "file-level")
                lines.append(f"{idx}. `{report_label}` `{failure['check_id']}` - {failure['message']}\n")
                if "expected" in failure:
                    lines.append(f"   - expected: `{str(failure['expected'])}`\n")
                if "actual" in failure:
                    lines.append(f"   - actual: `{str(failure['actual'])}`\n")
                if "source_location" in failure:
                    lines.append(f"   - source_location: `{failure['source_location']}`\n")
            lines.append("\n")
        else:
            lines.append("All checks passed for this file.\n\n")

    return "".join(lines)


def compute_top_issues(files: Sequence[Dict[str, object]], limit: int = 10) -> List[Dict[str, object]]:
    by_check: Dict[str, Dict[str, object]] = {}
    for file_result in files:
        for failure in file_result["failures"]:
            check_id = str(failure["check_id"])
            bucket = by_check.setdefault(
                check_id, {"check_id": check_id, "count": 0, "message": failure.get("message", "")}
            )
            bucket["count"] = int(bucket["count"]) + 1
    sorted_issues = sorted(by_check.values(), key=lambda issue: (-int(issue["count"]), str(issue["check_id"])))
    return sorted_issues[:limit]


def main() -> None:
    root = Path(__file__).resolve().parents[4]
    corpus_root = root / "docs" / "report-mining" / "section-corpus"
    validation_dir = corpus_root / "validation"
    validation_dir.mkdir(parents=True, exist_ok=True)

    reports = load_reports(root)

    files: List[Dict[str, object]] = []
    for config in SECTION_CONFIGS:
        files.append(validate_section_file(root, reports, config))
    for config in ADJUSTMENT_CONFIGS:
        files.append(validate_adjustment_file(root, reports, config))

    total_checks = sum(int(file_result["checks_total"]) for file_result in files)
    failures_count = sum(int(file_result["failures_count"]) for file_result in files)
    overall_status = "pass" if failures_count == 0 else "fail"

    validation: Dict[str, object] = {
        "overall_status": overall_status,
        "total_checks": total_checks,
        "failures_count": failures_count,
        "files_checked": len(files),
        "reports_in_source": len(reports),
        "command": "python3 docs/report-mining/section-corpus/scripts/validate_section_corpus.py",
        "files": files,
    }
    validation["top_issues"] = compute_top_issues(files)

    json_path = validation_dir / "verbatim-validation.json"
    report_path = validation_dir / "verbatim-validation-report.md"
    json_path.write_text(json.dumps(validation, indent=2, sort_keys=True), encoding="utf-8")
    report_path.write_text(build_markdown_report(validation), encoding="utf-8")

    summary = {
        "overall_status": validation["overall_status"],
        "total_checks": validation["total_checks"],
        "failures_count": validation["failures_count"],
        "files_checked": validation["files_checked"],
        "reports_in_source": validation["reports_in_source"],
        "json_report": json_path.relative_to(root).as_posix(),
        "markdown_report": report_path.relative_to(root).as_posix(),
    }
    print(json.dumps(summary, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()

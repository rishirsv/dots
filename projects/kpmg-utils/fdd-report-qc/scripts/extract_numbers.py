#!/usr/bin/env python3
"""
Extract numerical values from FDD report content for tie-out checking.

Usage:
    python extract_numbers.py report.md
    python extract_numbers.py report.md --output numbers.json
    python extract_numbers.py report.md --check

This script parses markdown-formatted report content (typically created with
markitdown from DOCX or PDF inputs) and extracts numerical values with their
section references so repeated figures can be compared across a diligence report.
"""

import argparse
import json
import re
import sys
from collections import defaultdict
from dataclasses import asdict, dataclass
from pathlib import Path


@dataclass
class NumberInstance:
    """A numerical value found in the report."""

    value: str
    normalized: float
    unit: str
    section: str
    context: str
    line_number: int
    category: str


def normalize_number(value_str: str, unit: str) -> float:
    """Convert a number string with unit to a normalized float value."""
    clean = re.sub(r"[,\s]", "", value_str)

    try:
        base_value = float(clean)
    except ValueError:
        return 0.0

    multipliers = {
        "T": 1e12,
        "B": 1e9,
        "bn": 1e9,
        "billion": 1e9,
        "M": 1e6,
        "mm": 1e6,
        "mn": 1e6,
        "million": 1e6,
        "K": 1e3,
        "k": 1e3,
        "thousand": 1e3,
    }

    for unit_key, multiplier in multipliers.items():
        if unit_key.lower() in unit.lower():
            return base_value * multiplier

    return base_value


def detect_category(context: str, unit: str) -> str:
    """Detect a report-relevant category from local context and unit."""
    context_lower = context.lower()

    if any(term in context_lower for term in ["revenue", "sales", "top line", "topline"]):
        return "revenue"

    if "ebitda" in context_lower:
        if any(term in context_lower for term in ["margin", "%", "percent", "bps"]):
            return "ebitda_margin"
        return "ebitda"

    if any(
        term in context_lower
        for term in ["qoe", "quality of earnings", "earnings adjustment", "add-back", "add back", "adjustment"]
    ):
        return "qoe_adjustment"

    if any(term in context_lower for term in ["working capital", "nwc", "peg"]):
        return "net_working_capital"

    if any(term in context_lower for term in ["net debt", "debt-like", "debt like", "cash-like", "cash like"]):
        return "net_debt"

    if any(term in context_lower for term in ["margin", "gross profit", "gross margin", "profit"]):
        return "margin"

    if any(term in context_lower for term in ["growth", "cagr", "yoy", "y/y"]):
        return "growth"

    if any(term in context_lower for term in ["multiple", "ev/", "p/e", "ev/ebitda", "ev/revenue"]):
        return "multiple"

    if any(term in context_lower for term in ["enterprise value", "ev ", "market cap"]):
        return "valuation"

    if unit in ["%", "bps", "percent"]:
        return "percentage"

    if unit == "x":
        return "multiple"

    return "other"


def extract_numbers(content: str) -> list[NumberInstance]:
    """Extract all numbers from report content."""
    numbers: list[NumberInstance] = []
    current_section = "Document"

    heading_pattern = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
    slide_pattern = re.compile(r"^#+\s*Slide\s*(\d+)|^<!-- Slide (\d+)")
    number_pattern = re.compile(
        r"(?P<currency>[$€£¥])?"
        r"(?P<number>[\d,]+(?:\.\d+)?)"
        r"\s*"
        r"(?P<unit>%|bps|x|"
        r"[Tt]rillion|[Bb]illion|[Mm]illion|[Tt]housand|"
        r"[TBMKtbmk]n?|mm|MM)?"
        r"(?!\d)"
    )

    lines = content.split("\n")

    for line_num, line in enumerate(lines, 1):
        heading_match = heading_pattern.match(line)
        if heading_match:
            heading_text = heading_match.group(2).strip()
            if heading_text:
                current_section = heading_text
            continue

        slide_match = slide_pattern.match(line)
        if slide_match:
            slide_num = int(slide_match.group(1) or slide_match.group(2))
            current_section = f"Slide {slide_num}"
            continue

        for match in number_pattern.finditer(line):
            value_str = match.group("number")
            currency = match.group("currency") or ""
            unit = match.group("unit") or ""

            if len(value_str.replace(",", "").replace(".", "")) < 2 and not unit:
                continue

            try:
                num_val = float(value_str.replace(",", ""))
                if 1900 <= num_val <= 2099 and not unit and not currency:
                    continue
            except ValueError:
                pass

            full_value = f"{currency}{value_str}{unit}"

            start = max(0, match.start() - 50)
            end = min(len(line), match.end() + 50)
            context = line[start:end].strip()

            if currency:
                if not unit:
                    unit = "USD"
                else:
                    unit = f"USD_{unit}"

            normalized = normalize_number(value_str, unit)
            category = detect_category(context, unit)

            numbers.append(
                NumberInstance(
                    value=full_value,
                    normalized=normalized,
                    unit=unit or "none",
                    section=current_section,
                    context=context,
                    line_number=line_num,
                    category=category,
                )
            )

    return numbers


def find_inconsistencies(numbers: list[NumberInstance]) -> list[dict]:
    """Find potential inconsistencies in extracted report numbers."""
    inconsistencies = []

    by_category: dict[str, list[NumberInstance]] = defaultdict(list)
    for num in numbers:
        if num.category != "other":
            by_category[num.category].append(num)

    for category, instances in by_category.items():
        if len(instances) < 2:
            continue

        value_groups: list[list[NumberInstance]] = []
        for inst in instances:
            placed = False
            for group in value_groups:
                ref_value = group[0].normalized
                if ref_value > 0:
                    diff_pct = abs(inst.normalized - ref_value) / ref_value
                    if diff_pct < 0.05:
                        group.append(inst)
                        placed = True
                        break
            if not placed:
                value_groups.append([inst])

        if len(value_groups) > 1:
            value_groups.sort(key=len, reverse=True)
            main_group = value_groups[0]

            for other_group in value_groups[1:]:
                inconsistencies.append(
                    {
                        "category": category,
                        "expected": {
                            "value": main_group[0].value,
                            "sections": sorted(set(n.section for n in main_group)),
                            "count": len(main_group),
                        },
                        "found": {
                            "value": other_group[0].value,
                            "sections": sorted(set(n.section for n in other_group)),
                            "count": len(other_group),
                        },
                        "severity": "high"
                        if category
                        in [
                            "revenue",
                            "ebitda",
                            "qoe_adjustment",
                            "net_working_capital",
                            "net_debt",
                            "valuation",
                        ]
                        else "medium",
                    }
                )

    return inconsistencies


def main() -> None:
    """Parse arguments, extract numbers, and emit JSON output."""
    parser = argparse.ArgumentParser(
        description="Extract numbers from report content for FDD tie-out checking"
    )
    parser.add_argument("input_file", help="Markdown file with report content")
    parser.add_argument("--output", "-o", help="Output JSON file (default: stdout)")
    parser.add_argument(
        "--check",
        "-c",
        action="store_true",
        help="Check for category-level inconsistencies and report",
    )

    args = parser.parse_args()

    input_path = Path(args.input_file)
    if not input_path.exists():
        print(f"Error: File not found: {args.input_file}", file=sys.stderr)
        sys.exit(1)

    content = input_path.read_text()
    numbers = extract_numbers(content)

    if args.check:
        inconsistencies = find_inconsistencies(numbers)
        result = {
            "summary": {
                "total_numbers": len(numbers),
                "total_inconsistencies": len(inconsistencies),
                "categories_found": sorted(
                    set(n.category for n in numbers if n.category != "other")
                ),
                "sections_found": sorted(set(n.section for n in numbers)),
            },
            "inconsistencies": inconsistencies,
        }
    else:
        result = {
            "summary": {
                "total_numbers": len(numbers),
                "categories_found": sorted(
                    set(n.category for n in numbers if n.category != "other")
                ),
                "sections_found": sorted(set(n.section for n in numbers)),
            },
            "numbers": [asdict(num) for num in numbers],
        }

    output = json.dumps(result, indent=2)

    if args.output:
        Path(args.output).write_text(output)
    else:
        print(output)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Extract numerical values from an FDD report draft (Markdown) for consistency review.

Usage:
  python extract_numbers.py --in report.md
  python extract_numbers.py --in report.md --out numbers.json

This script is intentionally simple:
- It extracts numbers with basic units ($, %, bps, x, k, m, bn)
- It records the nearest heading context (section) for easier review
"""

import argparse
import json
import re
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import List, Optional


NUM_RE = re.compile(
    r"""
    (?P<prefix>\$)?                         # optional $
    (?P<num>(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?)  # 1,234.56 or 1234.56 or 123
    \s*
    (?P<unit>%|bps|x|k|K|m|M|bn|Bn|B|MM|mm)? # optional unit token
    """,
    re.VERBOSE
)

HEADING_RE = re.compile(r"^(?P<hashes>#+)\s+(?P<title>.+?)\s*$")

@dataclass
class NumberHit:
    value_raw: str
    value: float
    unit: str
    prefix: str
    line: int
    section: str
    context: str


def normalize(num_str: str, unit: str) -> float:
    clean = num_str.replace(",", "")
    try:
        v = float(clean)
    except ValueError:
        return 0.0

    u = (unit or "").lower()
    if u in ("k",):
        return v * 1e3
    if u in ("m", "mm"):
        return v * 1e6
    if u in ("b", "bn"):
        return v * 1e9
    if u == "%":
        return v / 100.0
    if u == "bps":
        return v / 10000.0
    return v


def extract(md_text: str) -> List[NumberHit]:
    hits: List[NumberHit] = []
    current_section = ""

    for i, line in enumerate(md_text.splitlines(), start=1):
        h = HEADING_RE.match(line.strip())
        if h:
            current_section = h.group("title").strip()
            continue

        for m in NUM_RE.finditer(line):
            prefix = m.group("prefix") or ""
            num = m.group("num")
            unit = m.group("unit") or ""
            raw = (prefix + num + (unit if unit else "")).strip()
            hits.append(NumberHit(
                value_raw=raw,
                value=normalize(num, unit),
                unit=unit,
                prefix=prefix,
                line=i,
                section=current_section,
                context=line.strip()[:240],
            ))

    return hits


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--in", dest="infile", required=True, help="Input report markdown path")
    p.add_argument("--out", dest="outfile", default=None, help="Optional JSON output path")
    args = p.parse_args()

    md_path = Path(args.infile)
    text = md_path.read_text(encoding="utf-8", errors="ignore")
    hits = extract(text)

    payload = {
        "file": str(md_path),
        "count": len(hits),
        "hits": [asdict(h) for h in hits],
    }

    if args.outfile:
        Path(args.outfile).write_text(json.dumps(payload, indent=2), encoding="utf-8")
    else:
        # Print a small summary
        print(f"Found {len(hits)} number instances.")
        for h in hits[:40]:
            print(f"Line {h.line} | {h.section} | {h.value_raw} | {h.context}")
        if len(hits) > 40:
            print(f"... and {len(hits)-40} more. Use --out to save JSON.")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

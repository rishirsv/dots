#!/usr/bin/env python3
"""Process lease source data into normalized lease scaffold output."""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path


FIELDS = [
    "lease_id",
    "entity",
    "start_date",
    "end_date",
    "payment",
    "currency",
    "notes",
    "source",
]


def _write(path: Path, rows: list[dict[str, str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=FIELDS)
        w.writeheader()
        w.writerows(rows)


def _from_csv(path: Path) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    with path.open(newline="", encoding="utf-8-sig") as fh:
        r = csv.DictReader(fh)
        for i, row in enumerate(r, start=1):
            rows.append(
                {
                    "lease_id": row.get("lease_id", f"LEASE-{i:04d}"),
                    "entity": row.get("entity", ""),
                    "start_date": row.get("start_date", ""),
                    "end_date": row.get("end_date", ""),
                    "payment": row.get("payment", ""),
                    "currency": row.get("currency", "USD"),
                    "notes": row.get("notes", ""),
                    "source": str(path),
                }
            )
    return rows


def _from_pdf(path: Path) -> list[dict[str, str]]:
    return [
        {
            "lease_id": "",
            "entity": "",
            "start_date": "",
            "end_date": "",
            "payment": "",
            "currency": "USD",
            "notes": "Extraction review: PDF parse scaffold placeholder",
            "source": str(path),
        }
    ]


def main() -> int:
    p = argparse.ArgumentParser(description="Process lease input file into normalized CSV scaffold.")
    p.add_argument("--input", required=True, help="Lease source file (.pdf or .csv).")
    p.add_argument("--output", required=True, help="Normalized lease CSV output path.")
    p.add_argument("--exceptions", help="Optional exceptions JSON output path.")
    args = p.parse_args()

    src = Path(args.input)
    if src.suffix.lower() == ".csv":
        rows = _from_csv(src)
        mode = "csv"
    else:
        rows = _from_pdf(src)
        mode = "pdf"

    _write(Path(args.output), rows)

    missing_critical = sum(
        1
        for r in rows
        if not r["start_date"] or not r["end_date"] or not r["payment"]
    )
    report = {
        "input": str(src),
        "mode": mode,
        "rows": len(rows),
        "missing_critical_rows": missing_critical,
        "status": "warn" if missing_critical else "pass",
    }
    if args.exceptions:
        Path(args.exceptions).write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(f"Wrote lease output: {args.output}")
    if args.exceptions:
        print(f"Wrote exceptions: {args.exceptions}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

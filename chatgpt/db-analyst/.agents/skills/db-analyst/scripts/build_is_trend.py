#!/usr/bin/env python3
"""Aggregate mapped TB rows into statement trend outputs."""

from __future__ import annotations

import argparse
import csv
from collections import defaultdict
from pathlib import Path

OUTPUT_FIELDS = [
    "statement",
    "level1_key",
    "level1_name",
    "level2_key",
    "level2_name",
    "level3_key",
    "level3_name",
    "line_key",
    "line_name",
    "period",
    "amount",
    "account_count",
    "source_accounts",
    "questions_notes",
]


def _to_float(raw: str) -> float:
    s = (raw or "0").strip().replace(",", "")
    if s.startswith("(") and s.endswith(")"):
        s = f"-{s[1:-1]}"
    return float(s or 0)


def main() -> int:
    parser = argparse.ArgumentParser(description="Build statement trend table from mapped TB CSV.")
    parser.add_argument("--input", required=True, help="Mapped TB CSV path.")
    parser.add_argument("--statement", required=True, choices=["IS", "BS"], help="Statement to build.")
    parser.add_argument("--output", required=True, help="Output trend CSV path.")
    args = parser.parse_args()

    totals: dict[tuple[str, str, str, str, str, str, str, str, str], float] = defaultdict(float)
    accounts: dict[tuple[str, str, str, str, str, str, str, str, str], set[str]] = defaultdict(set)
    orders: dict[str, float] = {}

    with Path(args.input).open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        for row in reader:
            if row.get("mapping_status") != "mapped":
                continue
            if row.get("statement") != args.statement:
                continue
            line_key = row.get("line_key", "").strip()
            line_name = row.get("line_name", "").strip()
            period = row.get("period", "").strip()
            if not line_key or not period:
                continue

            l1k = row.get("level1_key", "").strip()
            l1n = row.get("level1_name", "").strip()
            l2k = row.get("level2_key", "").strip()
            l2n = row.get("level2_name", "").strip()
            l3k = row.get("level3_key", "").strip()
            l3n = row.get("level3_name", "").strip()

            key = (l1k, l1n, l2k, l2n, l3k, l3n, line_key, line_name, period)
            totals[key] += _to_float(row.get("amount_signed", "0"))
            account_label = row.get("account_number") or row.get("account_name") or "UNKNOWN"
            accounts[key].add(account_label.strip())

            sort_raw = row.get("sort_order", "").strip()
            if sort_raw:
                try:
                    orders[line_key] = float(sort_raw)
                except ValueError:
                    pass

    sorted_keys = sorted(
        totals.keys(),
        key=lambda x: (orders.get(x[6], 1_000_000), x[0], x[2], x[4], x[6], x[8]),
    )

    out_rows = []
    for l1k, l1n, l2k, l2n, l3k, l3n, line_key, line_name, period in sorted_keys:
        amount = totals[(l1k, l1n, l2k, l2n, l3k, l3n, line_key, line_name, period)]
        source_accounts = ";".join(
            sorted(accounts[(l1k, l1n, l2k, l2n, l3k, l3n, line_key, line_name, period)])
        )
        out_rows.append(
            {
                "statement": args.statement,
                "level1_key": l1k,
                "level1_name": l1n,
                "level2_key": l2k,
                "level2_name": l2n,
                "level3_key": l3k,
                "level3_name": l3n,
                "line_key": line_key,
                "line_name": line_name,
                "period": period,
                "amount": f"{amount:.6f}",
                "account_count": str(
                    len(accounts[(l1k, l1n, l2k, l2n, l3k, l3n, line_key, line_name, period)])
                ),
                "source_accounts": source_accounts,
                "questions_notes": "",
            }
        )

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=OUTPUT_FIELDS)
        writer.writeheader()
        writer.writerows(out_rows)

    print(f"Wrote {args.statement} trend rows: {len(out_rows)} to {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

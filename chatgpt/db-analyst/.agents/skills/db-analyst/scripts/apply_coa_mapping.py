#!/usr/bin/env python3
"""Apply COA mapping to canonical TB rows with mapping-level and sign status output."""

from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path

MAPPING_OUTPUT_FIELDS = [
    "period",
    "entity",
    "account_number",
    "account_name",
    "amount_raw",
    "units_scale_applied",
    "amount_signed",
    "statement",
    "level1_key",
    "level1_name",
    "level2_key",
    "level2_name",
    "level3_key",
    "level3_name",
    "line_key",
    "line_name",
    "sort_order",
    "sign_multiplier",
    "sign_multiplier_status",
    "mapping_status",
    "mapping_match_on",
    "mapping_note",
    "source_column",
    "source_row",
    "is_derived",
]


def _norm_header(name: str) -> str:
    return re.sub(r"_+", "_", re.sub(r"[^a-z0-9]+", "_", (name or "").strip().lower())).strip("_")


def _norm_key(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", (value or "").strip().lower())


def _to_float(raw: str) -> float:
    s = (raw or "0").strip().replace(",", "")
    if s.startswith("(") and s.endswith(")"):
        s = f"-{s[1:-1]}"
    return float(s or 0)


def _read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        if not reader.fieldnames:
            raise SystemExit(f"CSV has no headers: {path}")
        headers = [_norm_header(h) for h in reader.fieldnames]
        rows = [{_norm_header(k): (v or "") for k, v in row.items()} for row in reader]
    return headers, rows


def _pick(row: dict[str, str], keys: tuple[str, ...], default: str = "") -> str:
    for key in keys:
        if row.get(key, "").strip():
            return row[key].strip()
    return default


def _build_map_indexes(
    map_rows: list[dict[str, str]],
) -> tuple[dict[str, list[dict[str, str]]], dict[str, list[dict[str, str]]]]:
    by_num: dict[str, list[dict[str, str]]] = {}
    by_name: dict[str, list[dict[str, str]]] = {}
    for row in map_rows:
        acct_num = _pick(row, ("account_number", "account", "account_no", "gl_account"))
        acct_name = _pick(row, ("account_name", "name", "description"))
        if acct_num:
            by_num.setdefault(_norm_key(acct_num), []).append(row)
        if acct_name:
            by_name.setdefault(_norm_key(acct_name), []).append(row)
    return by_num, by_name


def _infer_sign_multiplier(raw_amount: float, statement: str, line_name: str, level1_name: str) -> float:
    stmt = (statement or "").upper()
    text = f"{line_name} {level1_name}".lower()

    if stmt == "IS":
        positive_keywords = (
            "revenue",
            "income",
            "gross profit",
            "ebitda",
            "operating income",
            "net income",
            "add back",
            "gain",
        )
        target_positive = any(k in text for k in positive_keywords)
    else:
        contra_asset_keywords = ("accum", "allowance", "contra", "reserve")
        if "asset" in text and any(k in text for k in contra_asset_keywords):
            target_positive = False
        elif "asset" in text:
            target_positive = True
        else:
            target_positive = False

    if raw_amount == 0:
        return 1.0
    native_positive = raw_amount > 0
    return 1.0 if native_positive == target_positive else -1.0


def _resolve_sign(row: dict[str, str], match: dict[str, str] | None, raw_amount: float) -> tuple[float, str, str]:
    if not match:
        return 1.0, "missing_assumption", "No mapping found"

    raw_multiplier = _pick(match, ("sign_multiplier", "signmultiplier"))
    if raw_multiplier:
        try:
            return float(raw_multiplier), "provided", ""
        except ValueError:
            pass

    statement = _pick(match, ("statement",), "")
    line_name = _pick(match, ("line_name", "linename", "line"), "")
    level1_name = _pick(match, ("level1_name", "level1name", "group_name", "group_key"), "")
    derived = _infer_sign_multiplier(raw_amount, statement, line_name, level1_name)
    return derived, "derived", "Sign multiplier derived"


def _extract_mapping_fields(match: dict[str, str] | None) -> dict[str, str]:
    row = match or {}
    return {
        "statement": _pick(row, ("statement",), "UNMAPPED"),
        "level1_key": _pick(row, ("level1_key", "level1key", "group_key"), ""),
        "level1_name": _pick(row, ("level1_name", "level1name", "group_name"), ""),
        "level2_key": _pick(row, ("level2_key", "level2key"), ""),
        "level2_name": _pick(row, ("level2_name", "level2name"), ""),
        "level3_key": _pick(row, ("level3_key", "level3key"), ""),
        "level3_name": _pick(row, ("level3_name", "level3name"), ""),
        "line_key": _pick(row, ("line_key", "linekey", "line"), "UNMAPPED"),
        "line_name": _pick(row, ("line_name", "linename", "line"), "UNMAPPED"),
        "sort_order": _pick(row, ("sort_order", "sortorder"), ""),
    }


def _mapping_result(tb_row: dict[str, str], match: dict[str, str] | None, match_on: str, note: str) -> dict[str, str]:
    amount_field = "amount" if "amount" in tb_row else "amount_raw"
    raw_amount = _to_float(tb_row.get(amount_field, "0"))
    sign_multiplier, sign_status, sign_note = _resolve_sign(tb_row, match, raw_amount)
    mapped = _extract_mapping_fields(match)

    merged_note = "; ".join(part for part in (note, sign_note) if part)
    return {
        "period": tb_row.get("period", ""),
        "entity": tb_row.get("entity", ""),
        "account_number": tb_row.get("account_number", ""),
        "account_name": tb_row.get("account_name", ""),
        "amount_raw": f"{raw_amount:.6f}",
        "units_scale_applied": tb_row.get("units_scale_applied", "1.000000"),
        "amount_signed": f"{(raw_amount * sign_multiplier):.6f}",
        "statement": mapped["statement"],
        "level1_key": mapped["level1_key"],
        "level1_name": mapped["level1_name"],
        "level2_key": mapped["level2_key"],
        "level2_name": mapped["level2_name"],
        "level3_key": mapped["level3_key"],
        "level3_name": mapped["level3_name"],
        "line_key": mapped["line_key"],
        "line_name": mapped["line_name"],
        "sort_order": mapped["sort_order"],
        "sign_multiplier": f"{sign_multiplier:.6f}",
        "sign_multiplier_status": sign_status,
        "mapping_status": "mapped" if match else "unmapped",
        "mapping_match_on": match_on,
        "mapping_note": merged_note,
        "source_column": tb_row.get("source_column", ""),
        "source_row": tb_row.get("source_row", ""),
        "is_derived": tb_row.get("is_derived", "0"),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Apply COA mapping to canonical TB rows.")
    parser.add_argument("--tb", required=True, help="Canonical TB CSV from ingest_tb.py.")
    parser.add_argument("--mapping", required=True, help="COA mapping CSV.")
    parser.add_argument("--output", required=True, help="Mapped TB CSV output path.")
    parser.add_argument("--report", help="Optional JSON report output path.")
    args = parser.parse_args()

    tb_headers, tb_rows = _read_csv(Path(args.tb))
    required_tb = {"period", "account_number", "account_name"}
    if "amount" not in tb_headers and "amount_raw" not in tb_headers:
        required_tb.add("amount")
    missing = sorted(required_tb - set(tb_headers))
    if missing:
        raise SystemExit(f"TB missing required columns: {', '.join(missing)}")

    _, map_rows = _read_csv(Path(args.mapping))
    by_num, by_name = _build_map_indexes(map_rows)

    out_rows: list[dict[str, str]] = []
    counters = {"mapped": 0, "unmapped": 0, "ambiguous": 0, "sign_derived": 0}
    for row in tb_rows:
        acct_num_key = _norm_key(row.get("account_number", ""))
        acct_name_key = _norm_key(row.get("account_name", ""))

        candidates = by_num.get(acct_num_key, []) if acct_num_key else []
        match_on = "account_number"
        if not candidates and acct_name_key:
            candidates = by_name.get(acct_name_key, [])
            match_on = "account_name"

        if len(candidates) == 1:
            result = _mapping_result(row, candidates[0], match_on, "")
            out_rows.append(result)
            counters["mapped"] += 1
            if result["sign_multiplier_status"] == "derived":
                counters["sign_derived"] += 1
            continue

        if len(candidates) > 1:
            out_rows.append(_mapping_result(row, None, "ambiguous", "Multiple mapping candidates"))
            counters["ambiguous"] += 1
            counters["unmapped"] += 1
            continue

        out_rows.append(_mapping_result(row, None, "none", "No mapping found"))
        counters["unmapped"] += 1

    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=MAPPING_OUTPUT_FIELDS)
        writer.writeheader()
        writer.writerows(out_rows)

    report = {
        "rows": len(out_rows),
        "mapped_rows": counters["mapped"],
        "unmapped_rows": counters["unmapped"],
        "ambiguous_rows": counters["ambiguous"],
        "sign_multiplier_derived_rows": counters["sign_derived"],
        "mapped_pct": 0 if not out_rows else round(counters["mapped"] / len(out_rows), 6),
        "status": "pass" if counters["unmapped"] == 0 else "warn",
    }
    if args.report:
        Path(args.report).write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(
        f"Wrote mapped TB: {output} "
        f"(mapped={counters['mapped']}, unmapped={counters['unmapped']}, sign_derived={counters['sign_derived']})"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path


FIELDNAMES = [
    "id",
    "prompt",
    "input_text",
    "source_files",
    "tags",
    "notes",
    "exit_code",
    "text_contains",
    "text_not_contains",
    "files_exist",
    "json_keys",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Convert codex exec eval cases between JSON and CSV.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    export_parser = subparsers.add_parser("export", help="Write CSV from JSON")
    export_parser.add_argument("--json", required=True)
    export_parser.add_argument("--csv", required=True)

    import_parser = subparsers.add_parser("import", help="Write JSON from CSV")
    import_parser.add_argument("--csv", required=True)
    import_parser.add_argument("--json", required=True)
    return parser.parse_args()


def split_list(raw: str) -> list[str]:
    raw = raw.strip()
    if not raw:
        return []
    return [item.strip() for item in raw.split(";") if item.strip()]


def join_list(items: list[str]) -> str:
    return ";".join(items)


def export_json_to_csv(json_path: Path, csv_path: Path) -> None:
    data = json.loads(json_path.read_text(encoding="utf-8"))
    cases = data if isinstance(data, list) else data.get("cases", [])
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    with csv_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDNAMES)
        writer.writeheader()
        for case in cases:
            expected = case.get("expected", {})
            writer.writerow(
                {
                    "id": case.get("id", ""),
                    "prompt": case.get("prompt", ""),
                    "input_text": case.get("input_text", ""),
                    "source_files": join_list(case.get("source_files", [])),
                    "tags": join_list(case.get("tags", [])),
                    "notes": case.get("notes", ""),
                    "exit_code": expected.get("exit_code", ""),
                    "text_contains": join_list(expected.get("text_contains", [])),
                    "text_not_contains": join_list(expected.get("text_not_contains", [])),
                    "files_exist": join_list(expected.get("files_exist", [])),
                    "json_keys": join_list(expected.get("json_keys", [])),
                }
            )


def import_csv_to_json(csv_path: Path, json_path: Path) -> None:
    cases = []
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            exit_code = row.get("exit_code", "").strip()
            case = {
                "id": row.get("id", "").strip(),
                "prompt": row.get("prompt", "").strip(),
                "input_text": row.get("input_text", "").strip(),
                "source_files": split_list(row.get("source_files", "")),
                "tags": split_list(row.get("tags", "")),
                "notes": row.get("notes", "").strip(),
                "expected": {
                    "exit_code": int(exit_code) if exit_code else 0,
                    "text_contains": split_list(row.get("text_contains", "")),
                    "text_not_contains": split_list(row.get("text_not_contains", "")),
                    "files_exist": split_list(row.get("files_exist", "")),
                    "json_keys": split_list(row.get("json_keys", "")),
                },
            }
            cases.append(case)
    json_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(json.dumps({"cases": cases}, indent=2), encoding="utf-8")


def main() -> int:
    args = parse_args()
    if args.command == "export":
        export_json_to_csv(Path(args.json), Path(args.csv))
    else:
        import_csv_to_json(Path(args.csv), Path(args.json))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

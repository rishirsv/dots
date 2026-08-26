#!/usr/bin/env python3
"""Generate a standalone local skill-evaluation review page."""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import mimetypes
import re
import sys
from copy import deepcopy
from pathlib import Path
from typing import Any


SENTINEL = "__SKILL_EVALUATION_REVIEW_DATA__"
MODES = {
    "case-review", "blind-comparison", "error-discovery",
    "grader-calibration", "trigger-review", "benchmark",
}
BLOCK_KINDS = {"text", "code", "table", "image", "trace", "file"}
BLIND_IDENTITY_FIELDS = {
    "mapping", "configuration_id", "configuration_ids", "identity",
    "candidate_id", "baseline_id", "target_id", "variant_ids",
}


def contained_path(root: Path, raw: Any, label: str) -> Path:
    if not isinstance(raw, str) or not raw:
        raise ValueError(f"{label}: expected a non-empty relative path")
    candidate = Path(raw)
    if candidate.is_absolute() or ".." in candidate.parts:
        raise ValueError(f"{label}: path must be relative and cannot contain '..'")
    resolved = (root / candidate).resolve()
    try:
        resolved.relative_to(root.resolve())
    except ValueError as exc:
        raise ValueError(f"{label}: path escapes review-data root") from exc
    if not resolved.is_file():
        raise ValueError(f"{label}: file does not exist: {raw}")
    return resolved


def canonical_block_text(block: dict[str, Any]) -> str:
    kind = block["kind"]
    if kind == "text":
        if block.get("format", "plain") == "plain":
            return block["text"]
        rendered: list[str] = []
        in_code = False
        for line in block["text"].splitlines():
            if line.startswith("```"):
                in_code = not in_code
                continue
            if not in_code:
                stripped = line.lstrip()
                if stripped.startswith("#"):
                    heading = stripped.lstrip("#").lstrip()
                    if heading:
                        rendered.append(heading)
                    continue
                if not line.strip():
                    continue
            rendered.append(line)
        return "\n".join(rendered)
    if kind == "code":
        return block["text"]
    if kind == "table":
        columns = block["columns"]
        rows = block["rows"]
        lines = ["\t".join(column["label"] for column in columns)]
        for row in rows:
            values = []
            for column in columns:
                value = row.get(column["id"])
                if value is None:
                    values.append("")
                elif isinstance(value, str):
                    values.append(value)
                else:
                    values.append(json.dumps(value, ensure_ascii=False, sort_keys=True))
            lines.append("\t".join(values))
        return "\n".join(lines)
    if kind == "trace":
        return "\n\n".join(f"{event['role']}\n{event['content']}" for event in block["events"])
    if kind == "image":
        return "\n".join(value for value in (block["alt"], block.get("caption")) if value)
    return f"{block['label']}\n{block['media_type']}"


def validate_block(block: Any, label: str, root: Path) -> dict[str, Any]:
    if not isinstance(block, dict):
        raise ValueError(f"{label}: expected an object")
    kind = block.get("kind")
    if kind not in BLOCK_KINDS:
        raise ValueError(f"{label}.kind: unsupported block kind {kind!r}")
    if kind == "text":
        if not isinstance(block.get("text"), str) or block.get("format", "plain") not in {"plain", "markdown"}:
            raise ValueError(f"{label}: invalid text block")
    elif kind == "code":
        if not isinstance(block.get("text"), str) or not isinstance(block.get("diff", False), bool):
            raise ValueError(f"{label}: invalid code block")
    elif kind == "table":
        columns = block.get("columns")
        rows = block.get("rows")
        if not isinstance(columns, list) or not isinstance(rows, list):
            raise ValueError(f"{label}: table needs columns and rows arrays")
        if any(not isinstance(column, dict) or not isinstance(column.get("id"), str) or not isinstance(column.get("label"), str) for column in columns):
            raise ValueError(f"{label}: invalid table column")
        if any(not isinstance(row, dict) for row in rows):
            raise ValueError(f"{label}: table rows must be objects")
    elif kind == "trace":
        events = block.get("events")
        if not isinstance(events, list) or any(
            not isinstance(event, dict)
            or not isinstance(event.get("role"), str)
            or not isinstance(event.get("content"), str)
            for event in events
        ):
            raise ValueError(f"{label}: trace needs role/content events")
    elif kind == "image":
        path = contained_path(root, block.get("path"), f"{label}.path")
        media_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        if not media_type.startswith("image/"):
            raise ValueError(f"{label}.path: expected an image")
        payload = base64.b64encode(path.read_bytes()).decode("ascii")
        block["src"] = f"data:{media_type};base64,{payload}"
        block["source_sha256"] = hashlib.sha256(path.read_bytes()).hexdigest()
        block.pop("path", None)
        if not isinstance(block.get("alt"), str):
            raise ValueError(f"{label}.alt: expected text")
    elif kind == "file":
        path = contained_path(root, block.get("path"), f"{label}.path")
        payload_bytes = path.read_bytes()
        block["href"] = (
            "data:application/octet-stream;base64,"
            f"{base64.b64encode(payload_bytes).decode('ascii')}"
        )
        block["download_name"] = re.sub(r"[^A-Za-z0-9._-]", "_", path.name) or "evidence.bin"
        block["source_sha256"] = hashlib.sha256(payload_bytes).hexdigest()
        block.pop("path", None)
        if not isinstance(block.get("label"), str) or not isinstance(block.get("media_type"), str):
            raise ValueError(f"{label}: file needs label and media_type")
    block["canonical_text"] = canonical_block_text(block)
    block["content_sha256"] = hashlib.sha256(
        block["canonical_text"].encode("utf-8")
    ).hexdigest()
    return block


def validate_record_list(
    data: dict[str, Any], field: str, *, allow_strings: bool = False
) -> None:
    value = data.get(field, [])
    if not isinstance(value, list):
        raise ValueError(f"{field} must be an array")
    seen: set[str] = set()
    for index, record in enumerate(value):
        if allow_strings and isinstance(record, str) and record.strip():
            continue
        if not isinstance(record, dict):
            raise ValueError(f"{field}[{index}] must be an object")
        identifier = record.get("id")
        if not isinstance(identifier, str) or not identifier:
            raise ValueError(f"{field}[{index}].id must be a non-empty string")
        if identifier in seen:
            raise ValueError(f"{field} contains duplicate ID: {identifier}")
        seen.add(identifier)


def prepare_review_data(raw: Any, root: Path) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("review data must be an object")
    data = deepcopy(raw)
    if data.get("schema_version") != 1 or data.get("kind") != "skill-evaluation-review":
        raise ValueError("review data must be schema_version 1 and kind skill-evaluation-review")
    if data.get("mode") not in MODES:
        raise ValueError(f"unsupported review mode: {data.get('mode')!r}")
    if not isinstance(data.get("review_id"), str) or not data.get("review_id", "").strip():
        raise ValueError("review_id must be a non-empty stable ID")
    if not isinstance(data.get("title"), str):
        raise ValueError("title must be text")
    items = data.get("items")
    if not isinstance(items, list):
        raise ValueError("items must be an array")
    seen: set[str] = set()
    for item_index, item in enumerate(items):
        if not isinstance(item, dict):
            raise ValueError(f"items[{item_index}] must be an object")
        identifier = item.get("id")
        if not isinstance(identifier, str) or not identifier:
            raise ValueError(f"items[{item_index}].id must be a non-empty string")
        if identifier in seen:
            raise ValueError(f"duplicate item ID: {identifier}")
        seen.add(identifier)
        if item.get("status") not in {"ready", "partial", "invalid", "reviewed"}:
            raise ValueError(f"items[{item_index}].status is invalid")
        blocks = item.get("blocks")
        if not isinstance(blocks, list):
            raise ValueError(f"items[{item_index}].blocks must be an array")
        item["blocks"] = [
            validate_block(block, f"items[{item_index}].blocks[{block_index}]", root)
            for block_index, block in enumerate(blocks)
        ]
    for field in ("annotations", "suggestions", "taxonomy", "blind_pairs"):
        validate_record_list(data, field)
    validate_record_list(data, "provenance", allow_strings=True)
    for index, pair in enumerate(data.get("blind_pairs", [])):
        leaked = sorted(BLIND_IDENTITY_FIELDS.intersection(pair))
        if leaked:
            raise ValueError(f"blind_pairs[{index}] leaks identity fields: {leaked!r}")
        labels = pair.get("labels")
        if labels != ["A", "B"]:
            raise ValueError(f"blind_pairs[{index}].labels must be exactly ['A', 'B']")
        item_id = pair.get("item_id")
        if not isinstance(item_id, str) or item_id not in seen:
            raise ValueError(f"blind_pairs[{index}].item_id must reference an item")
    if data.get("mode") == "blind-comparison":
        for field in ("annotations", "suggestions", "taxonomy", "provenance"):
            if data.get(field):
                raise ValueError(f"blind-comparison {field} must remain coordinator-only")
        for field in ("summary", "coverage"):
            if data.get(field):
                raise ValueError(f"blind-comparison {field} must be empty before unblinding")
        for index, item in enumerate(items):
            if item.get("evidence_refs"):
                raise ValueError(
                    f"blind-comparison items[{index}].evidence_refs must be empty before unblinding"
                )
    if "coverage" in data and not isinstance(data["coverage"], dict):
        raise ValueError("coverage must be an object")
    return data


def embed_json(data: dict[str, Any]) -> str:
    return (
        json.dumps(data, ensure_ascii=False, separators=(",", ":"))
        .replace("<", "\\u003c")
        .replace("\u2028", "\\u2028")
        .replace("\u2029", "\\u2029")
    )


def review_digest(data: dict[str, Any]) -> str:
    canonical = json.dumps(
        data, ensure_ascii=False, sort_keys=True, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(canonical).hexdigest()


def generate(review_path: Path, output_path: Path, template_path: Path | None = None) -> None:
    review_path = review_path.resolve()
    template_path = template_path or Path(__file__).resolve().parents[1] / "assets" / "review-interface.html"
    raw = json.loads(review_path.read_text(encoding="utf-8"))
    data = prepare_review_data(raw, review_path.parent)
    data["review_sha256"] = review_digest(data)
    template = template_path.read_text(encoding="utf-8")
    if template.count(SENTINEL) != 1:
        raise ValueError(f"review template must contain exactly one {SENTINEL} sentinel")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(template.replace(SENTINEL, embed_json(data)), encoding="utf-8")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("review_data", type=Path)
    parser.add_argument("--out", required=True, type=Path)
    return parser


def main() -> int:
    args = build_parser().parse_args()
    try:
        generate(args.review_data, args.out)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"Review generation failed: {exc}", file=sys.stderr)
        return 1
    print(f"Wrote {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

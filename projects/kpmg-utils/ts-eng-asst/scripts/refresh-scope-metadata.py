"""
Refresh metadata counters in dist/scope-library.json.

Usage:
  python3 scripts/refresh-scope-metadata.py
  python3 scripts/refresh-scope-metadata.py --check
  python3 scripts/refresh-scope-metadata.py --bundle dist/scope-library.json
"""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_BUNDLE = PROJECT_ROOT / "dist" / "scope-library.json"


def _count_text_nodes(nodes: list[Any]) -> int:
    total = 0
    stack = list(nodes) if isinstance(nodes, list) else []
    while stack:
        node = stack.pop()
        if not isinstance(node, dict):
            continue
        text = node.get("text")
        if isinstance(text, str) and text.strip():
            total += 1
        children = node.get("children")
        if isinstance(children, list):
            stack.extend(children)
    return total


def _compute_counts(scope_library: dict[str, Any]) -> dict[str, Any]:
    section_headings: set[str] = set()
    total_bullets_cataloged = 0

    for section in scope_library.get("common_skeleton", []) or []:
        if not isinstance(section, dict):
            continue
        heading = section.get("normalized_heading")
        if isinstance(heading, str) and heading.strip():
            section_headings.add(heading.strip())
        total_bullets_cataloged += _count_text_nodes(section.get("default_bullets") or [])

    for _, module in (scope_library.get("industry_modules") or {}).items():
        if not isinstance(module, dict):
            continue
        for section_key, bullets in module.items():
            if isinstance(section_key, str) and section_key.strip():
                section_headings.add(section_key.strip())
            if isinstance(bullets, list):
                total_bullets_cataloged += _count_text_nodes(bullets)

    industries_analyzed = len((scope_library.get("industry_modules") or {}).keys())
    total_sections_found = len(section_headings)

    return {
        "industries_analyzed": industries_analyzed,
        "total_sections_found": total_sections_found,
        "total_bullets_cataloged": total_bullets_cataloged,
    }


def _build_metadata(scope_library: dict[str, Any]) -> dict[str, Any]:
    existing = scope_library.get("metadata")
    metadata = dict(existing) if isinstance(existing, dict) else {}
    counts = _compute_counts(scope_library)

    metadata.update(counts)

    common_threshold = metadata.get("common_threshold")
    if common_threshold is None:
        metadata["common_threshold"] = "legacy: n/a"
    else:
        c = str(common_threshold)
        metadata["common_threshold"] = c if c.startswith("legacy:") else f"legacy: {c}"

    metadata["metadata_counts_basis"] = "current-dist-structure"
    metadata["metadata_last_refreshed_utc"] = datetime.now(timezone.utc).isoformat()
    return metadata


def main() -> None:
    parser = argparse.ArgumentParser(description="Refresh scope-library metadata counters")
    parser.add_argument("--bundle", default=str(DEFAULT_BUNDLE), help="Path to scope-library.json")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Check mode only; exits non-zero when metadata is stale.",
    )
    args = parser.parse_args()

    bundle_path = Path(args.bundle)
    scope_library = json.loads(bundle_path.read_text(encoding="utf-8"))

    expected = _build_metadata(scope_library)
    actual = scope_library.get("metadata", {}) if isinstance(scope_library.get("metadata"), dict) else {}

    keys = [
        "industries_analyzed",
        "total_sections_found",
        "total_bullets_cataloged",
        "common_threshold",
        "metadata_counts_basis",
    ]
    mismatches = []
    for key in keys:
        if actual.get(key) != expected.get(key):
            mismatches.append((key, actual.get(key), expected.get(key)))

    if args.check:
        if mismatches:
            lines = ["Metadata is stale:"]
            for key, cur, exp in mismatches:
                lines.append(f"- {key}: current={cur!r} expected={exp!r}")
            raise SystemExit("\n".join(lines))
        print(f"OK: metadata is current for {bundle_path}")
        return

    scope_library["metadata"] = expected
    bundle_path.write_text(json.dumps(scope_library, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated metadata in: {bundle_path}")


if __name__ == "__main__":
    main()

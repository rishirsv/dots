"""
Check scope library text for known spelling issues and style drift.

Usage:
  python3 scripts/check-scope-spelling.py
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_BUNDLE = PROJECT_ROOT / "dist" / "scope-library.json"
DEFAULT_REFERENCE = PROJECT_ROOT / "reference" / "scope-library.json"


# High-confidence spelling issues to block.
BANNED_PATTERNS: dict[str, str] = {
    r"\bcommerical\b": "commercial",
    r"\barve-out\b": "carve-out",
    r"\bnon-operation items\b": "non-operating items",
}

# Preferred US spelling variants for consistency in this library.
NON_PREFERRED_VARIANTS: dict[str, str] = {
    r"\banalysed\b": "analyzed",
    r"\bageing\b": "aging",
    r"\breoccurring\b": "recurring",
}


def _iter_text_nodes(obj: Any, path: str = ""):
    if isinstance(obj, dict):
        for key, value in obj.items():
            next_path = f"{path}.{key}" if path else key
            if key == "text" and isinstance(value, str):
                yield next_path, value
            yield from _iter_text_nodes(value, next_path)
    elif isinstance(obj, list):
        for idx, value in enumerate(obj):
            next_path = f"{path}[{idx}]"
            yield from _iter_text_nodes(value, next_path)


def _check_patterns(bundle: dict[str, Any], patterns: dict[str, str], label: str) -> list[str]:
    findings: list[str] = []
    for path, text in _iter_text_nodes(bundle):
        for pattern, suggestion in patterns.items():
            if re.search(pattern, text, flags=re.IGNORECASE):
                findings.append(
                    f"{label}: {path}: found `{pattern}`; suggested `{suggestion}`\n  text: {text}"
                )
    return findings


def main() -> None:
    parser = argparse.ArgumentParser(description="Check scope library spelling consistency")
    parser.add_argument("--bundle", default=str(DEFAULT_BUNDLE), help="Path to bundled v2 scope JSON")
    parser.add_argument(
        "--reference",
        default=str(DEFAULT_REFERENCE),
        help="Path to reference v2 scope JSON (should match dist)",
    )
    args = parser.parse_args()

    bundle_path = Path(args.bundle)
    reference_path = Path(args.reference)
    bundle = json.loads(bundle_path.read_text(encoding="utf-8"))
    reference = json.loads(reference_path.read_text(encoding="utf-8"))

    findings: list[str] = []

    if bundle != reference:
        findings.append(
            f"SYNC: `{bundle_path}` and `{reference_path}` differ. Keep both files identical."
        )

    findings.extend(_check_patterns(bundle, BANNED_PATTERNS, "TYPO"))
    findings.extend(_check_patterns(bundle, NON_PREFERRED_VARIANTS, "STYLE"))

    if findings:
        raise SystemExit("Scope spelling check failed:\n- " + "\n- ".join(findings))

    print("OK: scope spelling and style checks passed.")


if __name__ == "__main__":
    main()

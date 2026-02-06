"""
Validate that per-industry exports match the dist v2 bundle.

Usage:
  python3 scripts/validate-scope-exports.py
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_BUNDLE = PROJECT_ROOT / "dist" / "scope-library.json"
DEFAULT_OUT_DIR = PROJECT_ROOT / "docs" / "scope-library" / "industries"


def _slice_bundle(bundle: dict[str, Any], industry: str) -> dict[str, Any]:
    modules = bundle.get("industry_modules", {}) or {}
    industry_module = modules.get(industry)
    return {
        "common_skeleton": bundle.get("common_skeleton", []),
        "industry_modules": {industry: industry_module} if isinstance(industry_module, dict) else {},
        "metadata": bundle.get("metadata", {}),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate per-industry scope exports")
    parser.add_argument("--bundle", default=str(DEFAULT_BUNDLE), help="Path to dist bundle JSON (v2)")
    parser.add_argument("--out-dir", default=str(DEFAULT_OUT_DIR), help="Exports directory")
    args = parser.parse_args()

    bundle = json.loads(Path(args.bundle).read_text(encoding="utf-8"))
    out_dir = Path(args.out_dir)

    industries = sorted((bundle.get("industry_modules") or {}).keys())
    industries.append("generic")

    failures: list[str] = []
    for industry in industries:
        export_path = out_dir / f"{industry}.json"
        if not export_path.exists():
            failures.append(f"Missing export: {export_path}")
            continue
        exported = json.loads(export_path.read_text(encoding="utf-8"))
        expected = _slice_bundle(bundle, industry)
        if exported != expected:
            failures.append(f"Mismatch: {export_path}")

    if failures:
        raise SystemExit("Export validation failed:\n- " + "\n- ".join(failures))

    print(f"OK: {len(industries)} exports validated.")


if __name__ == "__main__":
    main()


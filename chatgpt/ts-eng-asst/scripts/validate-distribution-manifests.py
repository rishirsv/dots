#!/usr/bin/env python3
"""Validate internal-testing and ChatGPT-upload distribution manifests."""

from __future__ import annotations

from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = PROJECT_ROOT / "dist"
SCRIPTS_DIR = PROJECT_ROOT / "scripts"

DIST_REQUIRED = {
    "el-generate.py",
    "_scope_core.py",
    "ts-engagement-assistant.md",
    "assistant-playbook.md",
    "el-placeholder-schema.json",
    "scope-library.json",
    "scope-review-buckets.json",
    "section-applicability.json",
    "scope-library-optional.json",
    "buyside-engagement-letter.docx",
    "sellside-engagement-letter.docx",
}

DIST_ALLOWED = DIST_REQUIRED | {
    "ts-engagement-assistant-icon.png",
}

INTERNAL_REQUIRED = {
    "internal_generate.py",
    "generate-demo-letter.py",
    "test-scope-replacement.py",
    "export-scope-library.py",
    "export-optional-scope-library.py",
    "validate-scope-exports.py",
    "validate-scope-review-buckets.py",
    "validate-internal-boundary.py",
    "validate-distribution-manifests.py",
    "check-system-prompt-contract.py",
}


def main() -> int:
    failures: list[str] = []

    dist_files = {p.name for p in DIST_DIR.iterdir() if p.is_file()}
    dist_missing = sorted(DIST_REQUIRED - dist_files)
    if dist_missing:
        failures.append(f"Missing dist required files: {dist_missing}")

    dist_unknown = sorted(dist_files - DIST_ALLOWED)
    if dist_unknown:
        failures.append(f"Unexpected dist files (not in upload manifest): {dist_unknown}")

    pycache = DIST_DIR / "__pycache__"
    if pycache.exists():
        failures.append("dist/__pycache__ exists (remove before upload)")

    script_files = {p.name for p in SCRIPTS_DIR.glob("*.py")}
    internal_missing = sorted(INTERNAL_REQUIRED - script_files)
    if internal_missing:
        failures.append(f"Missing internal required scripts: {internal_missing}")

    if failures:
        print("FAIL: Distribution manifest validation failed")
        for line in failures:
            print(f" - {line}")
        return 1

    print("OK: Distribution manifests validated")
    print(f" - Dist files checked: {len(dist_files)}")
    print(f" - Internal scripts checked: {len(script_files)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

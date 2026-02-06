#!/usr/bin/env python3
"""Guardrail test to detect unexpected Diligence template drift."""

from __future__ import annotations

import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "tests" / "diligence_freeze_manifest.json"


def _sha256(path: Path) -> str:
    """Return SHA256 digest for one file."""
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        while True:
            chunk = handle.read(65536)
            if not chunk:
                break
            digest.update(chunk)
    return digest.hexdigest()


class DiligenceFreezeGuardTests(unittest.TestCase):
    """Validate that frozen Diligence artifacts remain unchanged."""

    def test_diligence_files_match_manifest(self) -> None:
        """Compare current Diligence files and hashes with frozen manifest."""
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
        root_value = manifest.get("template_root") or "templates/kpmg-diligence"
        root = Path(root_value)
        if not root.is_absolute():
            root = ROOT / root
        expected = manifest.get("hashes") or {}

        current = {}
        if root.exists():
            for file_path in sorted(root.rglob("*")):
                if not file_path.is_file():
                    continue
                rel = str(file_path.relative_to(root))
                if rel.startswith("node_modules/") or rel.startswith("outputs/"):
                    continue
                current[rel] = _sha256(file_path)

        self.assertEqual(expected, current)


if __name__ == "__main__":
    unittest.main()

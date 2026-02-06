#!/usr/bin/env python3
"""Guardrail tests to keep a single canonical KPMG project path."""

from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CHATGPT_ROOT = ROOT.parent


class RepoUnificationGuardTests(unittest.TestCase):
    """Ensure split-folder regressions are not reintroduced."""

    def test_legacy_folder_absent(self) -> None:
        """`kpmg-pptx-gen` should not coexist with canonical `kpmg-slidegen`."""
        legacy = CHATGPT_ROOT / "kpmg-pptx-gen"
        self.assertFalse(
            legacy.exists(),
            msg=(
                f"Legacy folder still exists: {legacy}. "
                "Use only /chatgpt/kpmg-slidegen as the canonical project path."
            ),
        )


if __name__ == "__main__":
    unittest.main()

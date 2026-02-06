#!/usr/bin/env python3
"""Coverage tests for the Talkbook layout mapping contract."""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MAPPING_PATH = ROOT / "dist" / "kpmg-talkbook-consulting-copilot" / "references" / "layout-mapping.md"


class TalkbookMappingCoverageTests(unittest.TestCase):
    """Validate mapping completeness and required fields."""

    @staticmethod
    def _mapping_payload() -> dict:
        """Parse the first fenced JSON block from layout-mapping.md."""
        text = MAPPING_PATH.read_text(encoding="utf-8")
        match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
        if not match:
            raise AssertionError("No JSON mapping block found in layout-mapping.md")
        return json.loads(match.group(1))

    def test_exposed_layouts_have_mapping_entries(self) -> None:
        """Every exposed layout slug must have one mapping entry."""
        payload = self._mapping_payload()
        exposed = set(payload.get("exposed_layout_types") or [])
        entries = payload.get("layout_types") or []
        mapped = {entry.get("layout_slug") for entry in entries}
        missing = sorted(exposed - mapped)
        self.assertEqual([], missing, msg=f"Missing layout mapping rows: {missing}")

    def test_required_fields_exist_for_each_layout(self) -> None:
        """Each mapping row should include required policy fields."""
        payload = self._mapping_payload()
        entries = payload.get("layout_types") or []
        required_fields = {
            "layout_slug",
            "business_intent",
            "best_for_content_shape",
            "required_slots",
            "optional_slots",
            "density_limits",
            "background_variant_rules",
            "do_use_when",
            "do_not_use_when",
            "fallback_layouts",
            "sample_payload",
        }

        for entry in entries:
            missing = sorted(required_fields - set(entry.keys()))
            self.assertEqual(
                [],
                missing,
                msg=f"Layout '{entry.get('layout_slug')}' missing required fields: {missing}",
            )

    def test_specific_variant_layouts_present(self) -> None:
        """Ensure parity-sensitive layout variants are included."""
        payload = self._mapping_payload()
        mapped = {entry.get("layout_slug") for entry in payload.get("layout_types") or []}

        expected = {
            "2-column-blue-heading",
            "two-column-comparison",
            "quad-box-icon-center-text",
            "quad-blue",
            "1-column-chart-text",
            "2-column-chart",
            "3-column-chart-text",
        }
        missing = sorted(expected - mapped)
        self.assertEqual([], missing, msg=f"Missing required parity layouts: {missing}")


if __name__ == "__main__":
    unittest.main()

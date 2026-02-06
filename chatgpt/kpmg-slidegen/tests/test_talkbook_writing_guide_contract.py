#!/usr/bin/env python3
"""Contract tests for Talkbook writing-guide artifacts."""

from __future__ import annotations

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILL_ROOT = ROOT / "dist" / "kpmg-talkbook-consulting-copilot"
ARCHETYPES_PATH = SKILL_ROOT / "references" / "writing-archetypes.md"
CHECKLIST_PATH = SKILL_ROOT / "references" / "writing-checklist.md"
RESEARCH_PATH = ROOT / "docs" / "talkbook-consulting-copilot" / "research-talkbook-writing-guidelines.md"

REQUIRED_FIELDS = [
    "Archetype ID",
    "Purpose",
    "Use When",
    "Avoid When",
    "Slide Structure",
    "Title Formula",
    "Narrative Formula",
    "Evidence Requirements",
    "Bullet Style",
    "Table Style",
    "Chart Style",
    "Source Note Style",
    "Tone And Word Choice",
    "Common Failure Modes",
    "Prompt Starter",
    "Mini Example",
]

EXPECTED_ARCHETYPE_IDS = {
    "core.executive-synthesis",
    "core.situation-assessment",
    "core.root-cause-analysis",
    "core.swot-analysis",
    "core.market-sizing-segmentation",
    "core.competitive-landscape",
    "core.customer-voc-synthesis",
    "core.operating-model-walkthrough",
    "core.process-redesign-future-state",
    "core.option-tradeoff-comparison",
    "core.recommendation-pack",
    "core.implementation-roadmap-risks",
    "finance.pnl-walkthrough",
    "finance.margin-bridge-waterfall",
    "finance.qoe-style-adjustment-walkthrough",
    "finance.net-working-capital-walkthrough",
    "finance.cash-flow-liquidity-walkthrough",
    "finance.evidence-appendix-packet",
}


class TalkbookWritingGuideContractTests(unittest.TestCase):
    """Ensure writing-guide docs exist and follow required structure."""

    def test_required_files_exist(self) -> None:
        """Writing-guide and research files should be present."""
        self.assertTrue(ARCHETYPES_PATH.exists(), msg=f"Missing file: {ARCHETYPES_PATH}")
        self.assertTrue(CHECKLIST_PATH.exists(), msg=f"Missing file: {CHECKLIST_PATH}")
        self.assertTrue(RESEARCH_PATH.exists(), msg=f"Missing file: {RESEARCH_PATH}")

    def test_archetype_count_and_ids(self) -> None:
        """Archetype list should contain all expected IDs exactly once."""
        text = ARCHETYPES_PATH.read_text(encoding="utf-8")
        ids = re.findall(r"^### Archetype ID\s*(?:\n\s*)+([^\n]+)", text, flags=re.MULTILINE)
        found = {value.strip() for value in ids}

        self.assertEqual(18, len(ids), msg=f"Expected 18 archetypes, found {len(ids)}")
        self.assertEqual(EXPECTED_ARCHETYPE_IDS, found, msg="Archetype IDs do not match expected contract")

    def test_required_fields_present_in_each_archetype_block(self) -> None:
        """Every archetype block should include all required structured field headings."""
        text = ARCHETYPES_PATH.read_text(encoding="utf-8")
        blocks = re.split(r"^## ", text, flags=re.MULTILINE)

        # Skip intro block before first archetype heading.
        archetype_blocks = [block for block in blocks if block.strip() and "### Archetype ID" in block]
        self.assertEqual(18, len(archetype_blocks), msg="Unexpected number of structured archetype blocks")

        for block in archetype_blocks:
            first_line = block.splitlines()[0].strip()
            for field in REQUIRED_FIELDS:
                self.assertIn(
                    f"### {field}",
                    block,
                    msg=f"Archetype '{first_line}' missing required field heading: {field}",
                )

    def test_checklist_has_required_sections(self) -> None:
        """Checklist doc should include skill-creator structure checklist and rubric sections."""
        text = CHECKLIST_PATH.read_text(encoding="utf-8")

        required_sections = [
            "## Skill Structure Checklist (Skill-Creator)",
            "## Pre-Draft Mandatory Archetype Selection Checklist",
            "## Profile-Aware Depth Minima",
            "## Draft Quality Checklist",
            "## Advisory Self-Score Rubric (Non-Blocking)",
        ]
        for section in required_sections:
            self.assertIn(section, text, msg=f"Checklist missing section: {section}")

    def test_archetype_doc_contains_depth_contract_table(self) -> None:
        """Archetype guide should include per-archetype depth minima for V2."""
        text = ARCHETYPES_PATH.read_text(encoding="utf-8")
        self.assertIn("## Per-Archetype Depth Contract (V2)", text)
        for archetype_id in EXPECTED_ARCHETYPE_IDS:
            self.assertIn(f"`{archetype_id}`", text, msg=f"Missing depth row for archetype: {archetype_id}")


if __name__ == "__main__":
    unittest.main()

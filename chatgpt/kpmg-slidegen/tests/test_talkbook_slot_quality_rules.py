#!/usr/bin/env python3
"""Quality-focused contract tests for Talkbook slot synthesis and strict gating."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS_DIR = ROOT / "dist" / "kpmg-talkbook-consulting-copilot" / "scripts"
if str(SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_DIR))

import build_deck  # noqa: E402
import compile_deck_json  # noqa: E402


class TalkbookSlotQualityRulesTests(unittest.TestCase):
    """Ensure slot synthesis follows density and writing-quality expectations."""

    def test_swot_center_uses_implication_line(self) -> None:
        """SWOT center text should use implication/recommendation, not duplicate first quadrant."""
        section = {
            "title": "SWOT Assessment",
            "content": "\n".join(
                [
                    "- Strength: Net retention remains 118% in enterprise accounts.",
                    "- Weakness: Time-to-value averages 61 days, 2.2x peers.",
                    "- Opportunity: Mid-market compliance segment grows 17% annually.",
                    "- Threat: Competitors bundle implementation at discounted rates.",
                    "- Strategic implication: prioritize onboarding speed as the defensibility lever.",
                ]
            ),
            "sources": [{"label": "Market benchmark panel", "url": None}],
        }
        layout = {
            "layout_slug": "quad-box-icon-center-text",
            "required_slots": ["text_title", "text_q1", "text_q2", "text_q3", "text_q4"],
            "optional_slots": ["text_center_body", "text_footer_source"],
            "density_limits": {"max_bullets_total": 8, "max_chars_per_bullet": 140},
        }

        slots = compile_deck_json._build_slots(section, layout)

        self.assertTrue(str(slots["text_q1"]).lower().startswith("strength:"))
        self.assertTrue(str(slots["text_q2"]).lower().startswith("weakness:"))
        self.assertTrue(str(slots["text_q3"]).lower().startswith("opportunity:"))
        self.assertTrue(str(slots["text_q4"]).lower().startswith("threat:"))
        self.assertIn("implication", str(slots["text_center_body"]).lower())

    def test_risk_layout_splits_risk_and_mitigation_columns(self) -> None:
        """Risk layouts should separate risk bullets from mitigation bullets."""
        section = {
            "title": "Net Working Capital Walkthrough",
            "content": "\n".join(
                [
                    "- Risk: DSO expansion in Q2 inflates working capital requirement.",
                    "- Risk: AP normalization may remove temporary cash benefit.",
                    "- Mitigation: Weekly receivables intervention for top aging accounts.",
                    "- Mitigation: Tiered payment scheduling by vendor criticality.",
                ]
            ),
            "sources": [],
        }
        layout = {
            "layout_slug": "risks-mitigations",
            "required_slots": ["text_title", "text_left_body", "text_right_body"],
            "optional_slots": ["text_left_header", "text_right_header"],
            "density_limits": {"max_bullets_total": 10, "max_chars_per_bullet": 120},
        }

        slots = compile_deck_json._build_slots(section, layout)

        self.assertEqual("Risks", slots["text_left_header"])
        self.assertEqual("Mitigations", slots["text_right_header"])
        self.assertTrue(any("DSO" in item for item in slots["text_left_body"]))
        self.assertTrue(any("Weekly receivables" in item for item in slots["text_right_body"]))

    def test_option_headers_are_inferred_from_option_bullets(self) -> None:
        """Comparison layouts should infer meaningful column headers from option labels."""
        section = {
            "title": "Option Tradeoff",
            "content": "\n".join(
                [
                    "- Option A (Broad expansion): fastest upside, highest execution risk.",
                    "- Option B (Phased expansion): moderate upside, strongest controllability.",
                    "- Option C (Core optimization): lowest risk, limited growth headroom.",
                ]
            ),
            "sources": [],
        }
        layout = {
            "layout_slug": "two-column-comparison",
            "required_slots": ["text_title", "text_left_body", "text_right_body"],
            "optional_slots": ["text_left_header", "text_right_header"],
            "density_limits": {"max_bullets_total": 8, "max_chars_per_bullet": 120},
        }

        slots = compile_deck_json._build_slots(section, layout)

        self.assertEqual("Broad expansion", slots["text_left_header"])
        self.assertEqual("Phased expansion", slots["text_right_header"])
        self.assertTrue(any("fastest upside" in item for item in slots["text_left_body"]))
        self.assertTrue(any("strongest controllability" in item for item in slots["text_right_body"]))

    def test_chart_points_are_extracted_from_numeric_bullets(self) -> None:
        """Chart layouts should use section numeric bullets instead of generic placeholder bars."""
        section = {
            "title": "Margin Bridge",
            "content": "\n".join(
                [
                    "- Baseline margin FY22: 23.0",
                    "- Mix shift contribution: 1.2",
                    "- Pricing contribution: 0.9",
                    "- Productivity contribution: 1.1",
                    "- Inflation drag: -0.4",
                    "- Net margin TTM Jun-24: 25.8",
                ]
            ),
            "sources": [],
        }
        layout = {
            "layout_slug": "2-column-chart",
            "required_slots": ["text_title", "text_left_body", "chart_main"],
            "optional_slots": ["text_strapline"],
            "density_limits": {"max_bullets_total": 10, "max_chars_per_bullet": 120},
        }

        slots = compile_deck_json._build_slots(section, layout)
        chart_points = slots["chart_main"]

        self.assertGreaterEqual(len(chart_points), 4)
        self.assertTrue(any(point["label"].startswith("Baseline margin") for point in chart_points))
        self.assertFalse(any(point["label"] == "Current" for point in chart_points))

    def test_round_passed_fails_on_overlap_warnings(self) -> None:
        """Strict round pass should fail when overlap warnings remain."""
        failing = {
            "overlaps": {"severeCount": 0, "warningCount": 1},
            "bounds": {"outOfBoundsCount": 0},
            "warnings": [],
        }
        passing = {
            "overlaps": {"severeCount": 0, "warningCount": 0},
            "bounds": {"outOfBoundsCount": 0},
            "warnings": [],
        }

        self.assertFalse(build_deck._round_passed(failing))
        self.assertTrue(build_deck._round_passed(passing))


if __name__ == "__main__":
    unittest.main()

#!/usr/bin/env python3
"""Payload-first compile contract tests for Talkbook V2."""

from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILL_ROOT = ROOT / "dist" / "kpmg-talkbook-consulting-copilot"
SCRIPTS = SKILL_ROOT / "scripts"
SESSIONS = SKILL_ROOT / "sessions"


class TalkbookPayloadContractTests(unittest.TestCase):
    """Validate authoring payload behavior and compile diagnostics."""

    def setUp(self) -> None:
        """Create isolated test session id."""
        self.session_id = "test-payload-contract"
        self.session_dir = SESSIONS / self.session_id
        if self.session_dir.exists():
            shutil.rmtree(self.session_dir)

    def tearDown(self) -> None:
        """Delete test session artifacts."""
        if self.session_dir.exists():
            shutil.rmtree(self.session_dir)

    def _run(self, args: list[str]) -> subprocess.CompletedProcess[str]:
        """Execute a command inside skill root."""
        return subprocess.run(args, cwd=str(SKILL_ROOT), capture_output=True, text=True)

    def test_payload_first_section_compiles_without_content_file(self) -> None:
        """Payload-only section should compile and produce structured slots + diagnostics."""
        start = self._run(
            [
                "python3",
                str(SCRIPTS / "start_session.py"),
                "--topic",
                "Payload first compile",
                "--session-id",
                self.session_id,
                "--skip-outline",
                "--depth-profile",
                "detailed",
            ]
        )
        self.assertEqual(start.returncode, 0, msg=f"start failed: {start.stdout}\n{start.stderr}")

        payload = {
            "headline_claim": "Margin expanded 280 bps due to mix and pricing discipline.",
            "claims": [
                "Revenue grew from 512 to 624 across the review period.",
                "Gross profit increased from 392 to 491.",
                "EBITDA rose from 118 to 161 with operating leverage.",
                "Margin bridge highlights mix and pricing as primary drivers.",
            ],
            "evidence_objects": [
                {
                    "type": "table",
                    "rows": [
                        ["Line item", "FY22", "FY23", "TTM Jun-24"],
                        ["Revenue", "512", "588", "624"],
                        ["Gross profit", "392", "459", "491"],
                        ["EBITDA", "118", "147", "161"],
                    ],
                },
                {
                    "type": "chart",
                    "points": [
                        {"label": "Baseline margin FY22", "value": 23.0},
                        {"label": "Mix", "value": 1.2},
                        {"label": "Pricing", "value": 0.9},
                        {"label": "Productivity", "value": 1.1},
                        {"label": "Inflation", "value": -0.4},
                        {"label": "TTM margin", "value": 25.8},
                    ],
                },
            ],
            "implications": [
                "Margin uplift is sustainable if mix discipline is maintained.",
                "Decision should prioritize Segment B where conversion is stronger.",
            ],
            "decision_ask": "Approve phased expansion funding in Q3.",
            "source_anchors": ["Internal management accounts"],
        }

        with tempfile.TemporaryDirectory() as tempdir:
            payload_file = Path(tempdir) / "payload.json"
            payload_file.write_text(json.dumps(payload), encoding="utf-8")

            upsert = self._run(
                [
                    "python3",
                    str(SCRIPTS / "upsert_section.py"),
                    "--session-id",
                    self.session_id,
                    "--title",
                    "P&L Walkthrough",
                    "--intent",
                    "financial-review",
                    "--archetype-id",
                    "finance.pnl-walkthrough",
                    "--outline-section-id",
                    "pnl-walkthrough",
                    "--depth-profile",
                    "detailed",
                    "--payload-file",
                    str(payload_file),
                ]
            )

        self.assertEqual(upsert.returncode, 0, msg=f"upsert failed: {upsert.stdout}\n{upsert.stderr}")

        compile_result = self._run(
            [
                "python3",
                str(SCRIPTS / "compile_deck_json.py"),
                "--session-id",
                self.session_id,
                "--allow-missing-required",
            ]
        )
        self.assertEqual(compile_result.returncode, 0, msg=f"compile failed: {compile_result.stdout}\n{compile_result.stderr}")

        deck = json.loads((self.session_dir / "deck.json").read_text(encoding="utf-8"))
        report = json.loads((self.session_dir / "compile_report.json").read_text(encoding="utf-8"))
        slots = deck["slides"][0]["slots"]

        has_table = bool(slots.get("table_main"))
        has_chart = bool(slots.get("chart_main"))
        has_textual = any(key.startswith("text_") and slots.get(key) for key in slots.keys())
        self.assertTrue(has_table or has_chart, msg="Expected payload evidence to map into table or chart slots.")
        self.assertTrue(has_textual, msg="Expected narrative text slots alongside evidence payload.")
        self.assertIn("workflow", report)
        self.assertIn("quality_summary", report)
        self.assertIn("outline_adherence", report)

        diagnostics = report.get("diagnostics") or []
        self.assertGreaterEqual(len(diagnostics), 1)
        first = diagnostics[0]
        self.assertIn("depth_evaluation", first)
        self.assertIn("advisory_score", first)
        self.assertEqual("finance.pnl-walkthrough", first.get("archetype_id"))


if __name__ == "__main__":
    unittest.main()

#!/usr/bin/env python3
"""Lifecycle tests for the Talkbook consulting copilot skill."""

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


class TalkbookCopilotLifecycleTests(unittest.TestCase):
    """Validate session creation, compile flow, and deck build wiring."""

    def setUp(self) -> None:
        """Create a stable test session id and output paths."""
        self.session_id = "test-lifecycle-session"
        self.session_dir = SESSIONS / self.session_id
        self.output_dir = self.session_dir / "outputs" / "runs" / "test"

        if self.session_dir.exists():
            shutil.rmtree(self.session_dir)

    def tearDown(self) -> None:
        """Clean up generated session artifacts."""
        if self.session_dir.exists():
            shutil.rmtree(self.session_dir)

    def _run(self, args: list[str]) -> subprocess.CompletedProcess[str]:
        """Run one skill script command and return process details."""
        return subprocess.run(args, cwd=str(SKILL_ROOT), capture_output=True, text=True)

    def test_session_compile_and_build_one_shot(self) -> None:
        """Start a one-shot session, add section content, compile JSON, and build a deck."""
        start = self._run(
            [
                "python3",
                str(SCRIPTS / "start_session.py"),
                "--topic",
                "OpenAI meeting deck",
                "--session-id",
                self.session_id,
                "--skip-outline",
            ]
        )
        self.assertEqual(start.returncode, 0, msg=f"start failed: {start.stdout}\n{start.stderr}")

        upsert = self._run(
            [
                "python3",
                str(SCRIPTS / "upsert_section.py"),
                "--session-id",
                self.session_id,
                "--title",
                "Executive Summary",
                "--intent",
                "executive-summary",
                "--content",
                "- Revenue upside is material\n- Capability gap is fixable\n- Recommendation: launch in two waves",
                "--source",
                "https://example.com/source-1",
            ]
        )
        self.assertEqual(upsert.returncode, 0, msg=f"upsert failed: {upsert.stdout}\n{upsert.stderr}")

        compile_one = self._run(
            [
                "python3",
                str(SCRIPTS / "compile_deck_json.py"),
                "--session-id",
                self.session_id,
            ]
        )
        self.assertEqual(
            compile_one.returncode,
            0,
            msg=f"compile failed: {compile_one.stdout}\n{compile_one.stderr}",
        )

        compile_two = self._run(
            [
                "python3",
                str(SCRIPTS / "compile_deck_json.py"),
                "--session-id",
                self.session_id,
            ]
        )
        self.assertEqual(
            compile_two.returncode,
            0,
            msg=f"second compile failed: {compile_two.stdout}\n{compile_two.stderr}",
        )

        report = json.loads((self.session_dir / "compile_report.json").read_text(encoding="utf-8"))
        first_hash = report["deterministic_hash"]

        report_again = json.loads((self.session_dir / "compile_report.json").read_text(encoding="utf-8"))
        second_hash = report_again["deterministic_hash"]
        self.assertEqual(first_hash, second_hash)

        deck = json.loads((self.session_dir / "deck.json").read_text(encoding="utf-8"))
        self.assertGreaterEqual(len(deck.get("slides") or []), 1)
        self.assertTrue(str(deck["slides"][0]["type"]).startswith("layout."))

        build = self._run(
            [
                "python3",
                str(SCRIPTS / "build_deck.py"),
                "--session-id",
                self.session_id,
                "--out-dir",
                str(self.output_dir),
                "--no-strict",
            ]
        )
        self.assertEqual(build.returncode, 0, msg=f"build failed: {build.stdout}\n{build.stderr}")
        self.assertTrue((self.output_dir / "deck.pptx").exists())
        self.assertTrue((self.output_dir / "inspect" / "strict-summary.json").exists())

        manifest = json.loads((self.output_dir / "manifest.json").read_text(encoding="utf-8"))
        shapes = (manifest.get("slides") or [])[0].get("shapes") or []
        self.assertTrue(any(shape.get("id") == "kpmg-logo" for shape in shapes))

    def test_outline_confirm_lifecycle_requires_approval_and_still_builds(self) -> None:
        """Run full outline_confirm flow and verify compile/build outputs."""
        start = self._run(
            [
                "python3",
                str(SCRIPTS / "start_session.py"),
                "--topic",
                "Outline confirm lifecycle",
                "--session-id",
                self.session_id,
                "--workflow",
                "outline_confirm",
            ]
        )
        self.assertEqual(start.returncode, 0, msg=f"start failed: {start.stdout}\n{start.stderr}")

        outline_payload = {
            "sections": [
                {
                    "section_id": "exec-summary",
                    "title": "Executive Summary",
                    "intent": "executive-summary",
                    "archetype_id": "core.executive-synthesis",
                    "depth_profile": "detailed",
                    "evidence_plan": ["kpi_table"],
                    "decision_purpose": "Approve the recommendation",
                }
            ]
        }
        with tempfile.TemporaryDirectory() as tempdir:
            outline_path = Path(tempdir) / "outline.json"
            outline_path.write_text(json.dumps(outline_payload), encoding="utf-8")
            upsert_outline = self._run(
                [
                    "python3",
                    str(SCRIPTS / "upsert_outline.py"),
                    "--session-id",
                    self.session_id,
                    "--outline-file",
                    str(outline_path),
                ]
            )
        self.assertEqual(
            upsert_outline.returncode,
            0,
            msg=f"outline upsert failed: {upsert_outline.stdout}\n{upsert_outline.stderr}",
        )

        approve = self._run(
            [
                "python3",
                str(SCRIPTS / "approve_outline.py"),
                "--session-id",
                self.session_id,
                "--rationale",
                "Approved for drafting",
            ]
        )
        self.assertEqual(approve.returncode, 0, msg=f"approve failed: {approve.stdout}\n{approve.stderr}")

        materialize = self._run(
            [
                "python3",
                str(SCRIPTS / "materialize_outline.py"),
                "--session-id",
                self.session_id,
            ]
        )
        self.assertEqual(materialize.returncode, 0, msg=f"materialize failed: {materialize.stdout}\n{materialize.stderr}")

        upsert = self._run(
            [
                "python3",
                str(SCRIPTS / "upsert_section.py"),
                "--session-id",
                self.session_id,
                "--section-id",
                "exec-summary",
                "--title",
                "Executive Summary",
                "--intent",
                "executive-summary",
                "--archetype-id",
                "core.executive-synthesis",
                "--outline-section-id",
                "exec-summary",
                "--content",
                "- Revenue upside is material\n- Recommendation: phase launch by segment",
                "--source",
                "https://example.com/source-1",
            ]
        )
        self.assertEqual(upsert.returncode, 0, msg=f"upsert failed: {upsert.stdout}\n{upsert.stderr}")

        compile_result = self._run(
            [
                "python3",
                str(SCRIPTS / "compile_deck_json.py"),
                "--session-id",
                self.session_id,
            ]
        )
        self.assertEqual(
            compile_result.returncode,
            0,
            msg=f"compile failed: {compile_result.stdout}\n{compile_result.stderr}",
        )

        build = self._run(
            [
                "python3",
                str(SCRIPTS / "build_deck.py"),
                "--session-id",
                self.session_id,
                "--out-dir",
                str(self.output_dir),
                "--no-strict",
            ]
        )
        self.assertEqual(build.returncode, 0, msg=f"build failed: {build.stdout}\n{build.stderr}")
        self.assertTrue((self.output_dir / "deck.pptx").exists())


if __name__ == "__main__":
    unittest.main()

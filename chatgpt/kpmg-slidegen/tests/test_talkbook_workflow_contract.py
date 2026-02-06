#!/usr/bin/env python3
"""Workflow contract tests for Talkbook V2 outline and one-shot modes."""

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


class TalkbookWorkflowContractTests(unittest.TestCase):
    """Validate stage transitions and outline gating behavior."""

    def setUp(self) -> None:
        """Prepare deterministic test session ids and cleanup paths."""
        self.session_id = "test-workflow-contract"
        self.one_shot_session_id = "test-workflow-one-shot"
        for sid in [self.session_id, self.one_shot_session_id]:
            session_dir = SESSIONS / sid
            if session_dir.exists():
                shutil.rmtree(session_dir)

    def tearDown(self) -> None:
        """Remove generated test sessions."""
        for sid in [self.session_id, self.one_shot_session_id]:
            session_dir = SESSIONS / sid
            if session_dir.exists():
                shutil.rmtree(session_dir)

    def _run(self, args: list[str]) -> subprocess.CompletedProcess[str]:
        """Run one command within the skill root."""
        return subprocess.run(args, cwd=str(SKILL_ROOT), capture_output=True, text=True)

    def _session_json(self, session_id: str) -> dict:
        """Read session JSON file for assertions."""
        path = SESSIONS / session_id / "session.json"
        return json.loads(path.read_text(encoding="utf-8"))

    def test_default_start_session_sets_outline_confirm_mode(self) -> None:
        """Default start_session should initialize outline_confirm workflow."""
        result = self._run(
            [
                "python3",
                str(SCRIPTS / "start_session.py"),
                "--topic",
                "Workflow default test",
                "--session-id",
                self.session_id,
            ]
        )
        self.assertEqual(result.returncode, 0, msg=f"start failed: {result.stdout}\n{result.stderr}")

        session = self._session_json(self.session_id)
        self.assertEqual("2.0", session.get("version"))
        self.assertEqual("outline_confirm", session.get("workflow", {}).get("mode"))
        self.assertEqual("intake", session.get("workflow", {}).get("stage"))
        self.assertTrue(session.get("workflow", {}).get("outline_required"))
        self.assertEqual("pending", session.get("workflow", {}).get("outline_approval", {}).get("status"))

    def test_one_shot_start_session_auto_approves_outline(self) -> None:
        """One-shot start should auto-approve outline and capture assumptions."""
        result = self._run(
            [
                "python3",
                str(SCRIPTS / "start_session.py"),
                "--topic",
                "Workflow one-shot test",
                "--session-id",
                self.one_shot_session_id,
                "--skip-outline",
            ]
        )
        self.assertEqual(result.returncode, 0, msg=f"start failed: {result.stdout}\n{result.stderr}")

        session = self._session_json(self.one_shot_session_id)
        self.assertEqual("one_shot", session.get("workflow", {}).get("mode"))
        self.assertEqual("drafting", session.get("workflow", {}).get("stage"))
        self.assertEqual("approved", session.get("workflow", {}).get("outline_approval", {}).get("status"))
        self.assertEqual("auto_assumed", session.get("workflow", {}).get("outline_approval", {}).get("approval_source"))
        assumptions = session.get("outline", {}).get("assumptions") or []
        self.assertGreaterEqual(len(assumptions), 1)

    def test_outline_confirm_blocks_drafting_until_approval(self) -> None:
        """upsert_section should fail before outline approval in outline_confirm mode."""
        start = self._run(
            [
                "python3",
                str(SCRIPTS / "start_session.py"),
                "--topic",
                "Outline gate test",
                "--session-id",
                self.session_id,
            ]
        )
        self.assertEqual(start.returncode, 0, msg=f"start failed: {start.stdout}\n{start.stderr}")

        blocked = self._run(
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
                "- Placeholder claim",
            ]
        )
        self.assertNotEqual(blocked.returncode, 0)
        self.assertIn("Drafting is blocked", blocked.stderr + blocked.stdout)

        outline_payload = {
            "sections": [
                {
                    "section_id": "exec-summary",
                    "title": "Executive Summary",
                    "intent": "executive-summary",
                    "archetype_id": "core.executive-synthesis",
                    "depth_profile": "detailed",
                    "evidence_plan": ["kpi_table"],
                    "decision_purpose": "approve go/no-go",
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
        self.assertEqual(upsert_outline.returncode, 0, msg=f"outline upsert failed: {upsert_outline.stdout}\n{upsert_outline.stderr}")

        approve = self._run(
            [
                "python3",
                str(SCRIPTS / "approve_outline.py"),
                "--session-id",
                self.session_id,
                "--rationale",
                "Looks good",
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

        draft = self._run(
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
                "- Revenue grew 12% with margin expansion.",
            ]
        )
        self.assertEqual(draft.returncode, 0, msg=f"draft upsert failed: {draft.stdout}\n{draft.stderr}")


if __name__ == "__main__":
    unittest.main()

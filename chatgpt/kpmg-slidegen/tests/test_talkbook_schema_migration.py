#!/usr/bin/env python3
"""Backward compatibility tests for v1 -> v2 session migration."""

from __future__ import annotations

import json
import shutil
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILL_ROOT = ROOT / "dist" / "kpmg-talkbook-consulting-copilot"
SCRIPTS = SKILL_ROOT / "scripts"
SESSIONS = SKILL_ROOT / "sessions"


class TalkbookSchemaMigrationTests(unittest.TestCase):
    """Ensure legacy sessions remain compilable under V2 schema."""

    def setUp(self) -> None:
        """Create a synthetic v1 session fixture."""
        self.session_id = "test-schema-migration"
        self.session_dir = SESSIONS / self.session_id
        if self.session_dir.exists():
            shutil.rmtree(self.session_dir)
        (self.session_dir / "outputs").mkdir(parents=True, exist_ok=True)

        legacy = {
            "version": "1.0",
            "session_id": self.session_id,
            "topic": "Legacy migration test",
            "created_at": "2026-02-06T00:00:00+00:00",
            "updated_at": "2026-02-06T00:00:00+00:00",
            "deck": {
                "title": "Legacy deck",
                "audience": "Executive leadership",
                "target_slides": 10,
                "template": "kpmg-talkbook",
                "mode": "manual",
            },
            "settings": {
                "citation_mode": "notes_appendix",
                "strict_mode": True,
                "manual_only": True,
            },
            "sections": [
                {
                    "id": "legacy-section",
                    "title": "Executive Summary",
                    "intent": "executive-summary",
                    "content": "- Revenue grew 12% with stable churn\n- Recommendation: phased expansion",
                    "variant": "auto",
                    "expected_slides": 1,
                    "status": "draft",
                    "sources": [{"label": "Internal accounts", "url": None}],
                    "created_at": "2026-02-06T00:00:00+00:00",
                    "updated_at": "2026-02-06T00:00:00+00:00",
                    "order": 10,
                }
            ],
            "sources": [{"label": "Internal accounts", "url": None}],
            "actions": [],
        }
        (self.session_dir / "session.json").write_text(json.dumps(legacy, indent=2), encoding="utf-8")

    def tearDown(self) -> None:
        """Remove migration test fixture."""
        if self.session_dir.exists():
            shutil.rmtree(self.session_dir)

    def _run(self, args: list[str]) -> subprocess.CompletedProcess[str]:
        """Run one command in skill root."""
        return subprocess.run(args, cwd=str(SKILL_ROOT), capture_output=True, text=True)

    def test_legacy_session_compiles_and_migrates_to_v2(self) -> None:
        """Compile should auto-migrate v1 session shape and preserve successful output."""
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

        session = json.loads((self.session_dir / "session.json").read_text(encoding="utf-8"))
        deck = json.loads((self.session_dir / "deck.json").read_text(encoding="utf-8"))
        report = json.loads((self.session_dir / "compile_report.json").read_text(encoding="utf-8"))

        self.assertEqual("2.0", session.get("version"))
        self.assertIn("workflow", session)
        self.assertIn("outline", session)
        self.assertIn("quality_summary", report)
        self.assertGreaterEqual(len(deck.get("slides") or []), 1)


if __name__ == "__main__":
    unittest.main()

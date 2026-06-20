"""Tests for Codex local session evidence helpers."""

from __future__ import annotations

import json
import os
import sqlite3
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.sessions import extract_thread_improvement, list_threads, render_thread_list, show_thread  # noqa: E402


class SessionEvidenceTests(unittest.TestCase):
    def setUp(self) -> None:
        self._old_codex_home = os.environ.get("CODEX_HOME")
        self.tmp = tempfile.TemporaryDirectory()
        self.home = Path(self.tmp.name)
        os.environ["CODEX_HOME"] = str(self.home)
        self.rollout = self.home / "sessions" / "rollout-test.jsonl"
        self.rollout.parent.mkdir(parents=True)
        self.rollout.write_text(
            "\n".join(
                [
                    json.dumps(
                        {
                            "timestamp": "2026-01-01T00:00:00Z",
                            "type": "event_msg",
                            "payload": {"type": "user_message", "message": "Please diagnose this skill."},
                        }
                    ),
                    json.dumps(
                        {
                            "timestamp": "2026-01-01T00:00:01Z",
                            "type": "event_msg",
                            "payload": {"type": "agent_message", "message": "I will inspect the skill."},
                        }
                    ),
                    json.dumps(
                        {
                            "timestamp": "2026-01-01T00:00:02Z",
                            "type": "event_msg",
                            "payload": {
                                "type": "user_message",
                                "message": "Use MetaSkill to evaluate this thread and improve this skill.",
                            },
                        }
                    ),
                    json.dumps(
                        {
                            "timestamp": "2026-01-01T00:00:03Z",
                            "type": "event_msg",
                            "payload": {
                                "type": "agent_message",
                                "message": "I found a missing handoff and will propose a source update.",
                            },
                        }
                    ),
                ]
            )
            + "\n",
            encoding="utf-8",
        )
        self.skill_dir = self.home / "skills" / "meta-skill"
        self.skill_dir.mkdir(parents=True)
        (self.skill_dir / "SKILL.md").write_text(
            "\n".join(
                [
                    "---",
                    "name: meta-skill",
                    'description: "Route skill lifecycle work to the right specialist."',
                    "---",
                    "",
                    "Route skill work.",
                    "",
                ]
            ),
            encoding="utf-8",
        )
        with sqlite3.connect(self.home / "state_5.sqlite") as conn:
            conn.execute(
                """
                CREATE TABLE threads (
                    id TEXT PRIMARY KEY,
                    title TEXT,
                    source TEXT,
                    cwd TEXT,
                    created_at INTEGER,
                    updated_at INTEGER,
                    archived INTEGER,
                    model TEXT,
                    rollout_path TEXT,
                    first_user_message TEXT
                )
                """
            )
            conn.execute(
                """
                INSERT INTO threads
                (id, title, source, cwd, created_at, updated_at, archived, model, rollout_path, first_user_message)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    "thread-abc",
                    "Skill Doctor diagnosis",
                    "vscode",
                    "/repo",
                    100,
                    200,
                    0,
                    "gpt-test",
                    str(self.rollout),
                    "Please diagnose this skill.",
                ),
            )

    def tearDown(self) -> None:
        if self._old_codex_home is None:
            os.environ.pop("CODEX_HOME", None)
        else:
            os.environ["CODEX_HOME"] = self._old_codex_home
        self.tmp.cleanup()

    def test_list_threads_filters_by_query_and_renders_table(self) -> None:
        rows = list_threads(limit=10, archived="all", query="diagnose")

        self.assertEqual([row.id for row in rows], ["thread-abc"])
        table = render_thread_list(rows)
        self.assertIn("thread-abc", table)
        self.assertIn("Skill Doctor diagnosis", table)

    def test_show_thread_renders_rollout_messages(self) -> None:
        result = show_thread("thread-abc", max_chars=200)

        self.assertTrue(result["ok"])
        self.assertEqual(result["thread"]["id"], "thread-abc")
        self.assertEqual(result["message_count"], 4)
        self.assertIn("## User", result["transcript_markdown"])
        self.assertIn("Please diagnose this skill.", result["transcript_markdown"])
        self.assertIn("## Assistant", result["transcript_markdown"])
        self.assertIn("I will inspect the skill.", result["transcript_markdown"])

    def test_show_thread_accepts_unique_prefix(self) -> None:
        result = show_thread("thread-a", max_chars=200)

        self.assertEqual(result["thread"]["id"], "thread-abc")

    def test_extract_thread_improvement_builds_happy_path_handoff(self) -> None:
        result = extract_thread_improvement("thread-abc", target=str(self.skill_dir), max_chars=500)

        self.assertTrue(result["ok"])
        self.assertEqual(result["target"]["name"], "meta-skill")
        self.assertEqual(Path(result["packet"]["target_skill"]["skill_md"]), (self.skill_dir / "SKILL.md").resolve())
        self.assertEqual(result["packet"]["thread_facts"]["message_count"], 4)
        handoff = result["packet"]["extracted_handoff"]
        self.assertIn("Use MetaSkill to evaluate this thread", handoff["expected_behavior"])
        self.assertIn("missing handoff", handoff["actual_behavior"])
        self.assertIn("skill-doctor", handoff["suggested_route"])
        self.assertIn("current-vs-candidate", handoff["suggested_route"])
        self.assertIn("Failure or capability seed for meta-skill", handoff["task_seeds"][0])
        self.assertIn("## Extracted Handoff", result["handoff_markdown"])
        self.assertIn("Approval Boundary", result["handoff_markdown"])

    def test_extract_thread_improvement_marks_missing_target_as_coverage_limit(self) -> None:
        result = extract_thread_improvement("thread-abc", target=str(self.home / "missing-skill"), max_chars=500)

        self.assertTrue(result["ok"])
        self.assertFalse(result["target"]["found"])
        self.assertIn("identify the target skill", result["packet"]["extracted_handoff"]["suggested_route"])
        self.assertIn("No target skill was resolved", "\n".join(result["packet"]["coverage_limits"]))


if __name__ == "__main__":
    unittest.main()

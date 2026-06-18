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

from meta_skill.sessions import list_threads, render_thread_list, show_thread  # noqa: E402


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
                ]
            )
            + "\n",
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
        self.assertEqual(result["message_count"], 2)
        self.assertIn("## User", result["transcript_markdown"])
        self.assertIn("Please diagnose this skill.", result["transcript_markdown"])
        self.assertIn("## Assistant", result["transcript_markdown"])
        self.assertIn("I will inspect the skill.", result["transcript_markdown"])

    def test_show_thread_accepts_unique_prefix(self) -> None:
        result = show_thread("thread-a", max_chars=200)

        self.assertEqual(result["thread"]["id"], "thread-abc")


if __name__ == "__main__":
    unittest.main()

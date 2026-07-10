from __future__ import annotations

import importlib.util
import json
import re
import sqlite3
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).parents[1] / "skills" / "self-improve" / "scripts" / "self_improve.py"
SPEC = importlib.util.spec_from_file_location("self_improve", SCRIPT)
assert SPEC and SPEC.loader
self_improve = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = self_improve
SPEC.loader.exec_module(self_improve)


def write_jsonl(path: Path, events: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(event) + "\n" for event in events), encoding="utf-8")


class SelfImproveTests(unittest.TestCase):
    def test_codex_reader_and_custom_tool_file_extraction(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            home = root / ".codex"
            project = root / "project"
            source = project / "src" / "app.py"
            source.parent.mkdir(parents=True)
            source.write_text("print('ok')\n", encoding="utf-8")
            rollout = home / "sessions" / "thread-1.jsonl"
            write_jsonl(
                rollout,
                [
                    {
                        "type": "event_msg",
                        "payload": {
                            "type": "user_message",
                            "message": "Always run the focused tests. Mention $self-improve only.",
                        },
                    },
                    {
                        "type": "response_item",
                        "payload": {
                            "type": "custom_tool_call",
                            "name": "exec",
                            "input": (
                                'const r = await tools.exec_command({'
                                '"cmd":"sed -n \'1p\' src/app.py",'
                                f'"workdir":{json.dumps(str(project))}'
                                '});'
                            ),
                        },
                    },
                    {
                        "type": "response_item",
                        "payload": {
                            "type": "function_call",
                            "name": "Read",
                            "arguments": json.dumps({"file_path": str(source)}),
                        },
                    },
                ],
            )
            home.mkdir(exist_ok=True)
            with sqlite3.connect(home / "state_5.sqlite") as conn:
                conn.execute(
                    """
                    CREATE TABLE threads (
                        id TEXT, rollout_path TEXT, created_at INTEGER, updated_at INTEGER,
                        source TEXT, cwd TEXT, title TEXT, archived INTEGER, model TEXT,
                        first_user_message TEXT, preview TEXT
                    )
                    """
                )
                conn.execute(
                    "INSERT INTO threads VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (
                        "thread-1", str(rollout), 100, 200, "test", str(project),
                        "Improve tests", 0, "model", "Always run tests", "",
                    ),
                )

            rows = self_improve.load_codex_threads(home, limit=10)
            self.assertEqual([thread.id for thread in rows], ["thread-1"])
            refs = self_improve.extract_file_references(rows[0], include_mentions=True)
            matching = [ref for ref in refs if ref.resolved == str(source.resolve())]
            self.assertEqual(len(matching), 1)
            self.assertEqual(matching[0].confidence, "structured")
            self.assertTrue(matching[0].exists)
            self.assertEqual(self_improve.strict_skill_signals(rows), {})

    def test_claude_reader_subagents_and_structured_skill_signal(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            home = root / ".claude"
            project = root / "project"
            source = project / "lib" / "worker.py"
            source.parent.mkdir(parents=True)
            source.write_text("pass\n", encoding="utf-8")
            transcript = home / "projects" / "-project" / "session-1.jsonl"
            write_jsonl(
                transcript,
                [
                    {"type": "ai-title", "sessionId": "session-1", "aiTitle": "Fix worker"},
                    {
                        "type": "user",
                        "sessionId": "session-1",
                        "cwd": str(project),
                        "isMeta": True,
                        "message": {"content": "DO NOT treat this generated caveat as a preference."},
                    },
                    {
                        "type": "user",
                        "sessionId": "session-1",
                        "cwd": str(project),
                        "timestamp": "2026-07-01T10:00:00Z",
                        "message": {"content": "Please keep the worker small."},
                    },
                    {
                        "type": "assistant",
                        "sessionId": "session-1",
                        "cwd": str(project),
                        "timestamp": "2026-07-01T10:01:00Z",
                        "message": {
                            "model": "test-model",
                            "content": [
                                {"type": "text", "text": "I will inspect it."},
                                {"type": "tool_use", "name": "Edit", "input": {"file_path": str(source)}},
                                {"type": "tool_use", "name": "Skill", "input": {"skill": "code-review"}},
                            ],
                        },
                    },
                    {"type": "future-entry", "sessionId": "session-1", "unknown": True},
                ],
            )
            subagent = transcript.with_suffix("") / "subagents" / "agent-a.jsonl"
            write_jsonl(
                subagent,
                [
                    {
                        "type": "assistant",
                        "message": {
                            "content": [
                                {"type": "tool_use", "name": "Read", "input": {"file_path": str(source)}}
                            ]
                        },
                    }
                ],
            )

            rows = self_improve.load_claude_threads(home, limit=10)
            self.assertEqual(rows[0].id, "session-1")
            self.assertEqual(rows[0].title, "Fix worker")
            self.assertNotIn(
                "generated caveat",
                "\n".join(message.text for message in self_improve.thread_messages(rows[0])),
            )
            refs = self_improve.extract_file_references(rows[0], include_subagents=True)
            self.assertEqual([ref.resolved for ref in refs].count(str(source.resolve())), 1)
            self.assertEqual(self_improve.strict_skill_signals(rows), {"code-review": 1})

    def test_command_path_filter_rejects_regex_and_templates(self) -> None:
        command = (
            "node -e '/#[0-9A-F]{3,8}/g' /tmp/report.json ${out}/shot.png "
            "!src/ignored.py 2>/dev/null src/app.py"
        )
        self.assertEqual(
            list(self_improve._path_tokens(command)),
            ["/tmp/report.json", "src/app.py"],
        )

    def test_malformed_jsonl_names_file_and_line(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "bad.jsonl"
            path.write_text("{}\nnot-json\n", encoding="utf-8")
            with self.assertRaisesRegex(RuntimeError, rf"{re.escape(str(path))}:2"):
                list(self_improve.iter_jsonl(path))


if __name__ == "__main__":
    unittest.main()

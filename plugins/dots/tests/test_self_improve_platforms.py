from __future__ import annotations

import importlib.util
import json
import os
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


PLUGIN_ROOT = Path(__file__).resolve().parents[1]
SCRIPT = PLUGIN_ROOT / "skills" / "self-improve" / "scripts" / "self_improve.py"
SOURCES = PLUGIN_ROOT / "skills" / "self-improve" / "scripts" / "session_sources.py"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


session_sources = load_module("self_improve_session_sources", SOURCES)


def write_jsonl(path: Path, events: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(event) + "\n" for event in events), encoding="utf-8")


class PlatformSeamTests(unittest.TestCase):
    def test_claude_normalizes_messages_tools_subagents_and_unknown_entries(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            home = root / ".claude"
            project = root / "project"
            source_file = project / "src" / "worker.py"
            source_file.parent.mkdir(parents=True)
            source_file.write_text("pass\n", encoding="utf-8")
            transcript = home / "projects" / "-project" / "session-1.jsonl"
            write_jsonl(
                transcript,
                [
                    {"type": "ai-title", "sessionId": "session-1", "aiTitle": "Fix worker"},
                    {
                        "type": "user", "sessionId": "session-1", "cwd": str(project),
                        "isMeta": True, "message": {"content": "Never expose generated metadata."},
                    },
                    {
                        "type": "user", "sessionId": "session-1", "cwd": str(project),
                        "timestamp": "2026-07-01T10:00:00Z",
                        "message": {"content": "Please keep the worker small."},
                    },
                    {
                        "type": "assistant", "sessionId": "session-1", "cwd": str(project),
                        "timestamp": "2026-07-01T10:01:00Z",
                        "message": {
                            "model": "test-model",
                            "content": [
                                {"type": "text", "text": "I will inspect it."},
                                {"type": "tool_use", "name": "Read", "input": {"file_path": str(source_file)}},
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
                [{"type": "assistant", "message": {"content": [
                    {"type": "tool_use", "name": "Read", "input": {"file_path": str(source_file)}}
                ]}}],
            )

            source = session_sources.ClaudeSource(home)
            rows = source.list_sessions(limit=10, archived="all")
            self.assertEqual([(row.id, row.platform, row.title) for row in rows], [("session-1", "claude", "Fix worker")])
            events = list(source.events(rows[0], include_subagents=True))
            messages = [event.text for event in events if event.kind == "message"]
            self.assertEqual(messages, ["Please keep the worker small.", "I will inspect it."])
            calls = [event.payload for event in events if event.kind == "function_call"]
            self.assertEqual(sum(call["name"] == "Read" for call in calls), 2)
            self.assertEqual(sum(call["name"] == "Skill" for call in calls), 1)

    def test_codex_source_never_discovers_claude_sessions(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            codex_home = root / ".codex"
            claude_transcript = root / ".claude" / "projects" / "-project" / "claude-id.jsonl"
            write_jsonl(claude_transcript, [{"type": "user", "sessionId": "claude-id"}])
            rollout = codex_home / "sessions" / "codex-id.jsonl"
            write_jsonl(rollout, [])
            codex_home.mkdir(exist_ok=True)
            with sqlite3.connect(codex_home / "state_5.sqlite") as conn:
                conn.execute(
                    "CREATE TABLE threads (id TEXT, title TEXT, source TEXT, cwd TEXT, "
                    "created_at INTEGER, updated_at INTEGER, archived INTEGER, model TEXT, "
                    "rollout_path TEXT, first_user_message TEXT)"
                )
                conn.execute(
                    "INSERT INTO threads VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    ("codex-id", "Codex", "codex", str(root), 1, 2, 0, "model", str(rollout), "prompt"),
                )

            source = session_sources.CodexSource(codex_home, lambda *_args, **_kwargs: [])
            rows = source.list_sessions(limit=10, archived="all")
            self.assertEqual([(row.id, row.platform) for row in rows], [("codex-id", "codex")])

    def test_cli_platforms_keep_decisions_and_instruction_roots_separate(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            codex_home = root / ".codex"
            claude_home = root / ".claude"
            codex_home.mkdir()
            (claude_home / "projects").mkdir(parents=True)
            env = {**os.environ, "CODEX_HOME": str(codex_home), "CLAUDE_CONFIG_DIR": str(claude_home)}

            subprocess.run(
                [sys.executable, str(SCRIPT), "--platform", "claude", "decide", "accept", "claude-key"],
                check=True, capture_output=True, text=True, env=env,
            )
            self.assertTrue((claude_home / "self_improve_decisions.json").exists())
            self.assertFalse((codex_home / "self_improve_decisions.json").exists())
            inventory = subprocess.run(
                [sys.executable, str(SCRIPT), "--platform", "claude", "inventory"],
                check=True, capture_output=True, text=True, env=env,
            ).stdout
            self.assertIn(str(claude_home / "CLAUDE.md"), inventory)
            self.assertNotIn(str(codex_home / "AGENTS.md"), inventory)

    def test_claude_cli_show_files_and_codex_only_stop(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            claude_home = root / ".claude"
            project = root / "project"
            target = project / "src" / "app.py"
            target.parent.mkdir(parents=True)
            target.write_text("pass\n", encoding="utf-8")
            transcript = claude_home / "projects" / "-project" / "session-2.jsonl"
            write_jsonl(transcript, [
                {"type": "ai-title", "sessionId": "session-2", "aiTitle": "Inspect app"},
                {"type": "user", "sessionId": "session-2", "cwd": str(project),
                 "timestamp": "2026-07-01T10:00:00Z", "message": {"content": "Inspect the app."}},
                {"type": "assistant", "sessionId": "session-2", "cwd": str(project),
                 "timestamp": "2026-07-01T10:01:00Z", "message": {"content": [
                     {"type": "tool_use", "name": "Read", "input": {"file_path": "src/app.py"}}
                 ]}},
            ])
            env = {**os.environ, "CLAUDE_CONFIG_DIR": str(claude_home)}
            show = subprocess.run(
                [sys.executable, str(SCRIPT), "--platform", "claude", "show", "session-2"],
                check=True, capture_output=True, text=True, env=env,
            ).stdout
            files = subprocess.run(
                [sys.executable, str(SCRIPT), "--platform", "claude", "files", "session-2"],
                check=True, capture_output=True, text=True, env=env,
            ).stdout
            unsupported = subprocess.run(
                [sys.executable, str(SCRIPT), "--platform", "claude", "goal-health"],
                capture_output=True, text=True, env=env,
            )
            self.assertIn("platform: `claude`", show)
            self.assertIn("Inspect the app.", show)
            self.assertIn(str(target), files)
            self.assertNotEqual(unsupported.returncode, 0)
            self.assertIn("Codex-only", unsupported.stderr)

    def test_malformed_claude_jsonl_names_file_and_line(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "bad.jsonl"
            path.write_text("{}\nnot-json\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, f"{path}:2"):
                list(session_sources.iter_jsonl(path))


if __name__ == "__main__":
    unittest.main()

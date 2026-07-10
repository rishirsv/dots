from __future__ import annotations

import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


PLUGIN_ROOT = Path(__file__).resolve().parents[1]


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


sessions = load_module("codex_sessions", PLUGIN_ROOT / "scripts" / "codex_sessions.py")
handoff = load_module(
    "handoff_context", PLUGIN_ROOT / "skills" / "handoff" / "scripts" / "handoff_context.py"
)
self_improve = load_module(
    "self_improve", PLUGIN_ROOT / "skills" / "self-improve" / "scripts" / "self_improve.py"
)


class SessionAdapterTests(unittest.TestCase):
    def test_current_and_legacy_messages_are_normalized(self):
        records = [
            {
                "timestamp": "1",
                "type": "response_item",
                "payload": {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": "current user"}],
                },
            },
            {
                "timestamp": "2",
                "type": "event_msg",
                "payload": {"type": "agent_message", "message": "legacy assistant"},
            },
        ]
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "rollout.jsonl"
            path.write_text("".join(json.dumps(record) + "\n" for record in records))
            events = list(sessions.iter_session_events(path, strict=True))
        self.assertEqual(
            [(event.kind, event.role, event.text) for event in events],
            [("message", "user", "current user"), ("message", "assistant", "legacy assistant")],
        )

    def test_handoff_redacts_metadata_and_tool_arguments_in_both_formats(self):
        records = [
            {
                "timestamp": "1",
                "type": "response_item",
                "payload": {
                    "type": "function_call",
                    "name": "shell",
                    "arguments": json.dumps({"cmd": "API_KEY=do-not-emit"}),
                },
            },
            {
                "timestamp": "2",
                "type": "event_msg",
                "payload": {"type": "agent_message", "message": "password=do-not-emit"},
            },
        ]
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "rollout.jsonl"
            path.write_text("".join(json.dumps(record) + "\n" for record in records))
            events = handoff.parse_transcript(path, max_events=20, char_limit=500)
        thread = handoff.Thread(
            "id", "secret title", "/tmp", 0, 0, "/tmp/rollout", "main",
            "authorization: do-not-emit", "access_token=do-not-emit",
        )
        markdown = handoff.render_markdown(thread, events)
        rendered_json = handoff.render_json(thread, events)
        for rendered in (markdown, rendered_json):
            self.assertNotIn("do-not-emit", rendered)
            self.assertGreaterEqual(rendered.count("[redacted sensitive line]"), 4)

    def test_self_improve_reads_both_shapes_and_namespaced_invocations(self):
        records = [
            {
                "timestamp": "1",
                "type": "response_item",
                "payload": {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": "Use $dots:oracle"}],
                },
            },
            {
                "timestamp": "2",
                "type": "event_msg",
                "payload": {"type": "user_message", "message": "legacy user"},
            },
        ]
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "rollout.jsonl"
            path.write_text("".join(json.dumps(record) + "\n" for record in records))
            thread = self_improve.Thread("id", "title", "", tmp, 0, 0, False, "", str(path))
            messages = self_improve.user_messages(thread)
            signals = self_improve.thread_signals(thread, {"dots:oracle"})
        self.assertEqual(messages, ["Use $dots:oracle", "legacy user"])
        self.assertEqual(signals.skills["dots:oracle"], 1)


class SkillInventoryTests(unittest.TestCase):
    def test_plugin_cache_skill_gets_namespaced_id(self):
        script = PLUGIN_ROOT / "skills" / "self-improve" / "scripts" / "self_improve.py"
        with tempfile.TemporaryDirectory() as tmp:
            codex_home = Path(tmp) / ".codex"
            skill = (
                codex_home
                / "plugins"
                / "cache"
                / "source"
                / "sample-plugin"
                / "1.0.0"
                / "skills"
                / "sample-skill"
            )
            skill.mkdir(parents=True)
            (skill / "SKILL.md").write_text("---\nname: sample-skill\n---\n")
            command = [
                sys.executable,
                "-c",
                (
                    "import importlib.util; p=r'%s'; s=importlib.util.spec_from_file_location('si', p); "
                    "m=importlib.util.module_from_spec(s); import sys; sys.modules['si']=m; s.loader.exec_module(m); "
                    "print(sorted(x for x in m.known_skill_names() if 'sample' in x))"
                ) % script,
            ]
            result = subprocess.run(
                command,
                check=True,
                capture_output=True,
                text=True,
                env={**os.environ, "CODEX_HOME": str(codex_home)},
            )
        self.assertIn("sample-plugin:sample-skill", result.stdout)


class OracleContainmentTests(unittest.TestCase):
    def test_outside_root_literal_is_rejected(self):
        script = PLUGIN_ROOT / "skills" / "oracle" / "scripts" / "oracle_package.py"
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            root = tmp_path / "root"
            root.mkdir()
            outside = tmp_path / "outside.txt"
            outside.write_text("private")
            result = subprocess.run(
                [
                    sys.executable,
                    str(script),
                    "--root",
                    str(root),
                    "--task",
                    "Review",
                    "--file",
                    str(outside),
                    "--dry-run",
                ],
                capture_output=True,
                text=True,
            )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("outside approved root", result.stderr)

    def test_symlink_escape_is_rejected(self):
        script = PLUGIN_ROOT / "skills" / "oracle" / "scripts" / "oracle_package.py"
        with tempfile.TemporaryDirectory() as tmp:
            tmp_path = Path(tmp)
            root = tmp_path / "root"
            root.mkdir()
            outside = tmp_path / "outside.txt"
            outside.write_text("private")
            (root / "escape.txt").symlink_to(outside)
            result = subprocess.run(
                [
                    sys.executable,
                    str(script),
                    "--root",
                    str(root),
                    "--task",
                    "Review",
                    "--file",
                    "escape.txt",
                    "--dry-run",
                ],
                capture_output=True,
                text=True,
            )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("outside approved root", result.stderr)


if __name__ == "__main__":
    unittest.main()

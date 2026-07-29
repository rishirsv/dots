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
    sys.path.insert(0, str(path.parent))
    try:
        spec.loader.exec_module(module)
    finally:
        sys.path.pop(0)
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

    def test_self_improve_deduplicates_transport_markers_and_tracks_primary_use(self):
        message = "Use $dots:oracle for this review"
        records = [
            {
                "timestamp": "1",
                "type": "response_item",
                "payload": {
                    "type": "message",
                    "role": "user",
                    "content": [{"type": "input_text", "text": message}],
                },
            },
            {
                "timestamp": "2",
                "type": "event_msg",
                "payload": {"type": "user_message", "message": message},
            },
            {
                "timestamp": "3",
                "type": "event_msg",
                "payload": {
                    "type": "agent_message",
                    "message": "The earlier $dots:oracle output is relevant.",
                },
            },
        ]
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "rollout.jsonl"
            path.write_text("".join(json.dumps(record) + "\n" for record in records))
            thread = self_improve.Thread("id", "title", "", tmp, 0, 0, False, "", str(path))
            signals = self_improve.thread_signals(thread, {"dots:oracle"})

        self.assertEqual(signals.skills["dots:oracle"], 2)
        self.assertEqual(signals.primary_skills["dots:oracle"], 1)

    def test_self_improve_collapses_retries_and_delegated_children(self):
        root = self_improve.Thread(
            "root", "Review the product", "vscode", "/repo", 0, 3, False, "", "/root.jsonl"
        )
        retry = self_improve.Thread(
            "retry", "Review the product", "vscode", "/repo", 0, 2, False, "", "/retry.jsonl"
        )
        child = self_improve.Thread(
            "child",
            "Delegated review",
            json.dumps({"subagent": {"thread_spawn": {"parent_thread_id": "root"}}}),
            "/repo",
            0,
            1,
            False,
            "",
            "/child.jsonl",
        )
        external = self_improve.Thread(
            "external",
            "<source_thread_id>outside</source_thread_id>",
            "vscode",
            "/repo",
            0,
            1,
            False,
            "",
            "/external.jsonl",
        )
        threads = {thread.id: thread for thread in (root, retry, child, external)}

        root_key = self_improve.session_cluster_key(root, threads)
        self.assertEqual(root_key, self_improve.session_cluster_key(retry, threads))
        self.assertEqual(root_key, self_improve.session_cluster_key(child, threads))
        self.assertEqual(
            self_improve.session_cluster_key(external, threads),
            "codex:parent:outside",
        )


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
                    "import importlib.util, pathlib, sys; p=r'%s'; "
                    "sys.path.insert(0, str(pathlib.Path(p).parent)); "
                    "s=importlib.util.spec_from_file_location('si', p); "
                    "m=importlib.util.module_from_spec(s); sys.modules['si']=m; s.loader.exec_module(m); "
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


class SelfImproveScopeTests(unittest.TestCase):
    def test_ordinary_review_defaults_are_bounded(self):
        parser = self_improve.build_parser()
        for command in ("triage", "dream", "skill-audit"):
            args = parser.parse_args([command])
            self.assertEqual(args.days, 30)
            self.assertEqual(args.limit, 100)

    def test_insights_stats_defaults_to_retained_window(self):
        args = self_improve.build_parser().parse_args(["stats"])
        self.assertIsNone(args.days)
        self.assertIsNone(args.limit)


class OracleContainmentTests(unittest.TestCase):
    def test_package_scope_must_be_explicit(self):
        script = PLUGIN_ROOT / "skills" / "oracle" / "scripts" / "oracle_package.py"
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "context.txt").write_text("context")
            result = subprocess.run(
                [
                    sys.executable,
                    str(script),
                    "--root",
                    str(root),
                    "--task",
                    "Review",
                    "--dry-run",
                ],
                capture_output=True,
                text=True,
            )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("positive --file selector", result.stderr)

    def test_all_repo_requires_explicit_flag(self):
        script = PLUGIN_ROOT / "skills" / "oracle" / "scripts" / "oracle_package.py"
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "context.txt").write_text("context")
            result = subprocess.run(
                [
                    sys.executable,
                    str(script),
                    "--root",
                    str(root),
                    "--task",
                    "Review",
                    "--all-repo",
                    "--dry-run",
                ],
                capture_output=True,
                text=True,
            )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("context.txt", result.stdout)

    def test_all_repo_rejects_file_selectors(self):
        script = PLUGIN_ROOT / "skills" / "oracle" / "scripts" / "oracle_package.py"
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "context.txt").write_text("context")
            result = subprocess.run(
                [
                    sys.executable,
                    str(script),
                    "--root",
                    str(root),
                    "--task",
                    "Review",
                    "--all-repo",
                    "--file",
                    "context.txt",
                    "--dry-run",
                ],
                capture_output=True,
                text=True,
            )
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("cannot be combined", result.stderr)

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

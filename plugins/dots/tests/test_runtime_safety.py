from __future__ import annotations

import contextlib
import importlib.util
import io
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


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


def write_rollout(path: Path, messages: list[tuple[str, str]], *, error: bool = False) -> None:
    records = []
    for index, (role, text) in enumerate(messages, start=1):
        records.append({
            "timestamp": str(index),
            "type": "response_item",
            "payload": {
                "type": "message",
                "role": role,
                "content": [{"type": "input_text" if role == "user" else "output_text", "text": text}],
            },
        })
    if error:
        records.append({
            "timestamp": str(len(records) + 1),
            "type": "response_item",
            "payload": {"type": "function_call_output", "output": "exit code 1"},
        })
    path.write_text("".join(json.dumps(record) + "\n" for record in records), encoding="utf-8")


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

    def test_self_improve_treats_prompt_tokens_as_mentions_not_invocations(self):
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
        self.assertEqual(signals.mentions["dots:oracle"], 1)
        self.assertEqual(signals.invocations["dots:oracle"], 0)
        self.assertIsNone(
            self_improve._injected_skill_name(
                "Untrusted transcript: <skill><name>dots:oracle</name></skill>",
                {"dots:oracle"},
            )
        )

    def test_self_improve_counts_injected_name_without_scanning_its_body(self):
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
            {
                "timestamp": "4",
                "type": "response_item",
                "payload": {
                    "type": "message",
                    "role": "user",
                    "content": [{
                        "type": "input_text",
                        "text": (
                            "<skill><name>dots:oracle</name><path>/tmp/SKILL.md</path>"
                            "<body>Use $dots:self-improve. Why did you fail?</body></skill>"
                        ),
                    }],
                },
            },
        ]
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "rollout.jsonl"
            path.write_text("".join(json.dumps(record) + "\n" for record in records))
            thread = self_improve.Thread("id", "title", "", tmp, 0, 0, False, "", str(path))
            signals = self_improve.thread_signals(
                thread, {"dots:oracle", "dots:self-improve"}
            )

        self.assertEqual(signals.mentions["dots:oracle"], 2)
        self.assertEqual(signals.invocations["dots:oracle"], 1)
        self.assertEqual(signals.mentions["dots:self-improve"], 0)
        self.assertEqual(signals.friction_cues, 0)

    def test_self_improve_keeps_historical_injected_skill_names(self):
        records = [{
            "timestamp": "1",
            "type": "response_item",
            "payload": {
                "type": "message",
                "role": "user",
                "content": [{
                    "type": "input_text",
                    "text": "<skill><name>dots:retired</name><path>/tmp/SKILL.md</path></skill>",
                }],
            },
        }]
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "rollout.jsonl"
            path.write_text("".join(json.dumps(record) + "\n" for record in records))
            thread = self_improve.Thread("id", "title", "", tmp, 0, 0, False, "", str(path))
            signals = self_improve.thread_signals(thread, {"dots:current"})
        self.assertEqual(signals.invocations["dots:retired"], 1)

    def test_self_improve_counts_exact_structured_tool_invocation(self):
        payload = {"name": "Skill", "input": {"skill": "dots:oracle"}}
        self.assertEqual(
            self_improve._tool_skill_name(payload, {"dots:oracle"}),
            "dots:oracle",
        )
        self.assertIsNone(
            self_improve._tool_skill_name(
                {"name": "Skill", "input": {"prompt": "Use $dots:oracle"}},
                {"dots:oracle"},
            )
        )
        self.assertEqual(
            self_improve._tool_skill_name(
                {"name": "Skill", "input": {"skill": "dots:retired"}},
                {"dots:oracle"},
            ),
            "dots:retired",
        )

    def test_self_improve_friction_requires_a_real_invocation(self):
        mention_only = self_improve.ThreadSignals(
            mentions={"dots:oracle": 1}, error_outputs=1
        )
        invoked = self_improve.ThreadSignals(
            invocations={"dots:oracle": 1}, error_outputs=1
        )
        self.assertEqual(self_improve.friction_candidate_skills(mention_only), set())
        self.assertEqual(
            self_improve.friction_candidate_skills(invoked), {"dots:oracle"}
        )

    def test_self_improve_collapses_retries_and_delegated_children(self):
        turns = [
            ("user", "Review the product."),
            ("assistant", "I will inspect it."),
            ("user", "Focus on the current behavior."),
            ("assistant", "The current behavior is grounded."),
        ]
        with tempfile.TemporaryDirectory() as tmp:
            root_path = Path(tmp) / "root.jsonl"
            retry_path = Path(tmp) / "retry.jsonl"
            child_path = Path(tmp) / "child.jsonl"
            external_path = Path(tmp) / "external.jsonl"
            independent_path = Path(tmp) / "independent.jsonl"
            write_rollout(root_path, turns)
            write_rollout(retry_path, turns + [("user", "Continue."), ("assistant", "Done.")])
            write_rollout(child_path, [])
            write_rollout(external_path, [])
            write_rollout(independent_path, [("user", "Different task."), ("assistant", "Done.")])
            root = self_improve.Thread("root", "Old title", "vscode", "/repo", 0, 3, False, "", str(root_path))
            retry = self_improve.Thread("retry", "New title", "vscode", "/repo", 0, 2, False, "", str(retry_path))
            child = self_improve.Thread(
                "child", "Delegated review",
                json.dumps({"subagent": {"thread_spawn": {"parent_thread_id": "root"}}}),
                "/repo", 0, 1, False, "", str(child_path),
            )
            external = self_improve.Thread(
                "external", "<source_thread_id>outside</source_thread_id>", "vscode",
                "/repo", 0, 1, False, "", str(external_path),
            )
            independent = self_improve.Thread(
                "independent", "Old title", "vscode", "/repo", 0, 1, False, "", str(independent_path)
            )
            rows = [root, retry, child, external, independent]
            keys = self_improve.session_cluster_keys(rows)

        self.assertEqual(keys["root"], keys["retry"])
        self.assertEqual(keys["root"], keys["child"])
        self.assertNotEqual(keys["root"], keys["independent"])
        self.assertEqual(keys["external"], "codex:parent:outside")

    def test_self_improve_keeps_independent_short_repeated_sessions_separate(self):
        turns = [("user", "Run the review."), ("assistant", "No findings.")]
        with tempfile.TemporaryDirectory() as tmp:
            first_path = Path(tmp) / "first.jsonl"
            second_path = Path(tmp) / "second.jsonl"
            write_rollout(first_path, turns)
            write_rollout(second_path, turns)
            first = self_improve.Thread("first", "Same title", "vscode", "/repo", 0, 2, False, "", str(first_path))
            second = self_improve.Thread("second", "Same title", "vscode", "/repo", 0, 1, False, "", str(second_path))
            keys = self_improve.session_cluster_keys([first, second])
        self.assertNotEqual(keys["first"], keys["second"])

    def test_skill_usage_emits_every_representative_and_filters_after_scan(self):
        block = "<skill><name>dots:retired</name><path>/tmp/SKILL.md</path></skill>"
        with tempfile.TemporaryDirectory() as tmp:
            success_path = Path(tmp) / "success.jsonl"
            friction_path = Path(tmp) / "friction.jsonl"
            write_rollout(success_path, [("user", block), ("assistant", "Done.")])
            write_rollout(friction_path, [("user", block), ("assistant", "Trying.")], error=True)
            success = self_improve.Thread("success", "No skill in title", "", tmp, 1, 2, False, "", str(success_path))
            friction = self_improve.Thread("friction", "Also unrelated", "", tmp, 1, 3, False, "", str(friction_path))
            args = self_improve.build_parser().parse_args([
                "skill-usage", "--skill", "dots:retired", "--days", "30", "--limit", "10"
            ])
            output = io.StringIO()
            with (
                mock.patch.object(self_improve, "threads", return_value=[friction, success]),
                mock.patch.object(self_improve, "known_skill_names", return_value={"dots:current"}),
                contextlib.redirect_stdout(output),
            ):
                self_improve.cmd_skill_usage(args)
        rendered = output.getvalue()
        self.assertIn("Exact skill filter: `dots:retired`", rendered)
        self.assertIn("historical/local dots:retired", rendered)
        self.assertIn("invoked", rendered)
        self.assertIn("friction", rendered)
        self.assertIn(str(success_path), rendered)
        self.assertIn(str(friction_path), rendered)


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
        args = parser.parse_args(["triage"])
        self.assertEqual(args.days, 30)
        self.assertEqual(args.limit, 100)

    def test_skill_usage_uses_an_exact_post_scan_filter(self):
        args = self_improve.build_parser().parse_args(
            ["skill-usage", "--skill", "dots:publish-pr"]
        )
        self.assertEqual(args.skill, "dots:publish-pr")
        self.assertFalse(hasattr(args, "query"))

    def test_removed_commands_are_not_exposed(self):
        parser = self_improve.build_parser()
        subparsers = next(
            action for action in parser._actions
            if isinstance(action, self_improve.argparse._SubParsersAction)
        )
        removed = {
            "inventory", "list", "memory-audit", "goal-health", "scaffold",
            "dream", "skill-audit", "deep",
        }
        self.assertTrue(removed.isdisjoint(subparsers.choices))

    def test_stats_cache_schema_invalidates_v3_entries(self):
        with tempfile.TemporaryDirectory() as tmp:
            transcript = Path(tmp) / "rollout.jsonl"
            transcript.write_text("", encoding="utf-8")
            thread = self_improve.Thread(
                "id", "title", "", tmp, 0, 1, False, "", str(transcript)
            )
            current_key = self_improve.stats_cache_key(thread)
            stale_key = current_key.replace("v4:", "v3:", 1)
            derived = {
                "malformed": None,
                "self_referential": False,
                "user_messages": 2,
                "duration_minutes": 1,
                "end": 1,
            }
            with (
                mock.patch.object(self_improve, "load_stats_cache", return_value={stale_key: {}}),
                mock.patch.object(self_improve, "save_stats_cache"),
                mock.patch.object(self_improve, "known_skill_names", return_value=set()),
                mock.patch.object(self_improve, "derive_session_stats", return_value=derived) as derive,
            ):
                _, coverage = self_improve.collect_session_stats(
                    [thread], max_new=1, refresh=False
                )
        derive.assert_called_once()
        self.assertEqual(coverage["cached"], 0)
        self.assertEqual(coverage["computed"], 1)

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

from __future__ import annotations

import importlib.util
import json
import os
import sqlite3
import subprocess
import sys
import tempfile
import unittest
from unittest import mock
from pathlib import Path
from types import SimpleNamespace


PLUGIN_ROOT = Path(__file__).resolve().parents[1]
SCRIPT = PLUGIN_ROOT / "skills" / "self-improve" / "scripts" / "self_improve.py"
SOURCES = PLUGIN_ROOT / "skills" / "self-improve" / "scripts" / "session_sources.py"


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
                                {"type": "tool_use", "id": "read-1", "name": "Read", "input": {"file_path": str(source_file)}},
                                {"type": "tool_use", "name": "Skill", "input": {"skill": "review"}},
                            ],
                        },
                    },
                    {
                        "type": "user", "sessionId": "session-1", "cwd": str(project),
                        "timestamp": "2026-07-01T10:01:10Z", "message": {"content": [
                            {"type": "tool_result", "tool_use_id": "read-1", "content": "file contents"}
                        ]},
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
            helper = load_module("self_improve_claude_fixture", SCRIPT)
            skill_call = next(call for call in calls if call["name"] == "Skill")
            self.assertEqual(
                helper._tool_skill_name(skill_call, {"review"}), "review"
            )
            read_call = next(event for event in events if event.kind == "function_call" and event.call_id)
            read_output = next(event for event in events if event.kind == "function_call_output")
            self.assertEqual(read_call.call_id, "read-1")
            self.assertEqual(read_output.call_id, "read-1")

    def test_codex_preserves_call_ids_without_inventing_missing_ids(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            rollout = root / "rollout.jsonl"
            rollout.write_text("", encoding="utf-8")
            thread = session_sources.SessionRecord(
                "codex-id", "Codex", "codex", str(root), 1, 2, False, "model",
                str(rollout), "codex",
            )
            raw_events = [
                SimpleNamespace(
                    kind="function_call", role="", text="", timestamp="1",
                    payload={"name": "exec", "call_id": "call-1", "arguments": {"cmd": "pytest"}},
                ),
                SimpleNamespace(
                    kind="function_call_output", role="", text="", timestamp="2",
                    payload={"call_id": "call-1", "output": "ok"},
                ),
                SimpleNamespace(
                    kind="function_call", role="", text="", timestamp="3",
                    payload={"name": "exec", "arguments": {"cmd": "pytest"}},
                ),
            ]
            source = session_sources.CodexSource(root, lambda *_args, **_kwargs: raw_events)
            events = list(source.events(thread))

        self.assertEqual([event.call_id for event in events], ["call-1", "call-1", ""])

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

    def test_platforms_keep_stats_caches_separate(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            codex_home = root / ".codex"
            claude_home = root / ".claude"
            codex_home.mkdir()
            (claude_home / "projects").mkdir(parents=True)
            helper = load_module("self_improve_platform_paths", SCRIPT)
            helper.CODEX_HOME = codex_home
            helper.CLAUDE_HOME = claude_home
            self.assertEqual(
                helper.platform_paths("claude")["stats_cache"],
                claude_home / "self_improve_stats_cache.json",
            )
            self.assertEqual(
                helper.platform_paths("codex")["stats_cache"],
                codex_home / "self_improve_stats_cache.json",
            )
            helper.configure_platform("claude")
            self.assertEqual(helper.STATS_CACHE_FILE, claude_home / "self_improve_stats_cache.json")
            helper.configure_platform("codex")
            self.assertEqual(helper.STATS_CACHE_FILE, codex_home / "self_improve_stats_cache.json")

    def test_claude_cli_show_and_files(self) -> None:
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
            self.assertIn("platform: `claude`", show)
            self.assertIn("Inspect the app.", show)
            self.assertIn(str(target), files)

    def test_malformed_claude_jsonl_names_file_and_line(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "bad.jsonl"
            path.write_text("{}\nnot-json\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, f"{path}:2"):
                list(session_sources.iter_jsonl(path))




class StatsEvidenceTests(unittest.TestCase):
    def setUp(self):
        self.helper = load_module("self_improve_evidence_fixture", SCRIPT)
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.path = self.root / "rollout.jsonl"
        self.start = session_sources.parse_timestamp("2026-07-01T10:00:00Z")

    def stats(self, events, *, created=None, source="", start=None, end=None):
        write_jsonl(self.path, events)
        thread = self.helper.Thread(
            "root", "task", source, str(self.root),
            self.start if created is None else created, self.start + 600,
            False, "model", str(self.path),
        )
        adapter = self.helper.CodexSource(self.root, self.helper.iter_session_events)
        with mock.patch.object(self.helper, "SESSION_SOURCE", adapter):
            return self.helper.derive_session_stats(thread, set(), window_start=start, window_end=end)

    def test_wrapper_operations_failures_and_duplicate_completions(self):
        def operation(id, seconds, code, output):
            return {"type": "event_msg", "timestamp": f"2026-07-01T10:00:{seconds:02d}Z", "payload": {
                "type": "item_completed", "started_at_ms": (self.start + seconds - 2) * 1000,
                "item": {"type": "CommandExecution", "id": id, "command": ["/bin/zsh", "-lc", "pytest tests/unit"],
                         "exit_code": code, "status": "completed", "aggregated_output": output},
            }}
        failed = operation("exec-1", 10, 1, "x" * 3000 + " failed")
        stats = self.stats([
            {"type": "response_item", "timestamp": "2026-07-01T10:00:01Z", "payload": {
                "type": "custom_tool_call", "name": "exec", "call_id": "wrapper",
                "input": "await tools.exec_command({cmd: 'pytest tests/unit'}); await tools.exec_command({cmd: 'pytest tests/unit'});",
            }},
            failed, failed,
            operation("exec-2", 15, 0, "documentation says exit code 1 but this command passed"),
            {"type": "response_item", "timestamp": "2026-07-01T10:00:16Z", "payload": {
                "type": "custom_tool_call_output", "call_id": "wrapper", "output": "Script completed",
            }},
        ])
        self.assertEqual(stats["outer_tool_calls"], 1)
        self.assertEqual(stats["wrapper_calls"], 1)
        self.assertEqual(stats["structured_operation_calls"], 2)
        self.assertEqual(stats["tool_calls"], 2)
        self.assertEqual(stats["tool_errors"], 1)
        self.assertEqual(stats["validation_calls"], 2)
        self.assertEqual(stats["validation_failed"], 1)
        self.assertEqual(stats["validation_total_seconds"], 4)
        self.assertEqual(stats["unknown_tool_outcomes"], 0)
        self.assertEqual(stats["wrapper_child_attribution"], "unknown")
        self.assertEqual(stats["duplicate_tool_calls"], 1)

    def test_mcp_metadata_and_unknown_direct_outcomes(self):
        stats = self.stats([
            {"type": "event_msg", "timestamp": "2026-07-01T10:00:05Z", "payload": {
                "type": "item_completed", "started_at_ms": (self.start + 1) * 1000,
                "item": {"type": "McpToolCall", "id": "mcp-1", "server": "repo", "tool": "read",
                         "arguments": {}, "status": "completed", "result": {"isError": True, "content": []}},
            }},
            {"type": "response_item", "timestamp": "2026-07-01T10:00:06Z", "payload": {
                "type": "custom_tool_call", "name": "apply_patch", "call_id": "patch", "input": "unparsed patch data",
            }},
            {"type": "response_item", "timestamp": "2026-07-01T10:00:07Z", "payload": {
                "type": "custom_tool_call_output", "call_id": "patch", "output": "some text",
            }},
        ])
        self.assertEqual(stats["tool_counts"], {"repo.read": 1, "apply_patch": 1})
        self.assertEqual(stats["tool_errors"], 1)
        self.assertEqual(stats["unknown_tool_outcomes"], 1)

    def token(self, minute, input_tokens, cached=None, output=10):
        usage = {"input_tokens": input_tokens, "output_tokens": output, "reasoning_output_tokens": 2}
        if cached is not None:
            usage["cached_input_tokens"] = cached
        return {"type": "event_msg", "timestamp": f"2026-07-01T10:{minute:02d}:00Z", "payload": {
            "type": "token_count", "info": {"total_token_usage": usage},
        }}

    def test_token_boundaries_resets_missing_fields_and_repeated_samples(self):
        stats = self.stats([
            self.token(0, 100, 50), self.token(2, 200, 100), self.token(3, 250, 120, 20),
            self.token(3, 250, 120, 20), self.token(4, 10, 0, 1), self.token(5, 30, 10, 3),
            self.token(6, 1000, 900, 50),
        ], created=self.start - 600, start=self.start + 60, end=self.start + 300)
        self.assertEqual(stats["token_usage"]["input_tokens"], 70)
        self.assertEqual(stats["token_usage"]["cached_input_tokens"], 30)
        self.assertEqual(stats["token_counter_resets"], 1)
        self.assertEqual(stats["token_unbounded_intervals"], 1)
        self.assertFalse(stats["token_usage_complete"])
        missing = self.stats([self.token(0, 100), self.token(1, 150)])
        self.assertEqual(missing["token_usage"]["input_tokens"], 150)
        self.assertNotIn("cached_input_tokens", missing["token_usage"])
        self.assertEqual(missing["token_missing_fields"]["cached_input_tokens"], 2)
        self.assertFalse(missing["token_usage_complete"])

    def test_child_inherited_history_does_not_count_as_new_activity(self):
        stats = self.stats([
            {"type": "response_item", "timestamp": "2026-07-01T10:00:00Z", "payload": {
                "type": "function_call", "name": "Read", "call_id": "old", "arguments": {},
            }},
            self.token(0, 100, 50),
            {"type": "response_item", "timestamp": "2026-07-01T10:02:00Z", "payload": {
                "type": "function_call", "name": "Read", "call_id": "new", "arguments": {},
            }},
            self.token(2, 120, 60),
        ], created=self.start + 60, source=json.dumps({"subagent": {"thread_spawn": {"parent_thread_id": "parent"}}}))
        self.assertEqual(stats["tool_calls"], 1)
        self.assertEqual(stats["inherited_events_skipped"], 1)
        self.assertEqual(stats["parent_session_id"], "parent")
        self.assertEqual(stats["token_usage"]["input_tokens"], 20)
        self.assertFalse(stats["token_usage_complete"])

    def test_closed_session_cache_reuse_and_explicit_cap_coverage(self):
        self.path.write_text("")
        threads = [self.helper.Thread(str(i), "task", "", str(self.root), self.start, self.start + 60, False, "", str(self.path)) for i in range(3)]
        first, second = self.start + 120, self.start + 240
        self.assertEqual(self.helper.stats_cache_key(threads[0], self.start - 100, first), self.helper.stats_cache_key(threads[0], self.start - 50, second))
        self.assertNotEqual(self.helper.stats_cache_key(threads[0], self.start + 1, first), self.helper.stats_cache_key(threads[0], self.start + 2, first))
        self.assertIsNone(self.helper.build_parser().parse_args(["stats"]).max_new)
        derived = {"malformed": None, "self_referential": False, "user_messages": 2, "duration_minutes": 1, "end": self.start + 60}
        with mock.patch.object(self.helper, "load_stats_cache", return_value={}), mock.patch.object(self.helper, "save_stats_cache"), mock.patch.object(self.helper, "known_skill_names", return_value=set()), mock.patch.object(self.helper, "derive_session_stats", return_value=derived):
            _, coverage = self.helper.collect_session_stats(threads, max_new=1)
        self.assertEqual(coverage["eligible"], 3)
        self.assertEqual(coverage["analyzed"], 1)
        self.assertEqual(coverage["skipped"], 2)
        self.assertFalse(coverage["complete"])
        with mock.patch.object(self.helper, "load_stats_cache", return_value={}), mock.patch.object(self.helper, "save_stats_cache"), mock.patch.object(self.helper, "known_skill_names", return_value=set()), mock.patch.object(self.helper, "derive_session_stats", side_effect=[derived, KeyboardInterrupt]):
            _, coverage = self.helper.collect_session_stats(threads)
        self.assertEqual(coverage["analyzed"], 1)
        self.assertTrue(coverage["interrupted"])
        self.assertEqual(coverage["skipped"], 2)


    def test_one_prompt_and_child_workload_survive_narrative_filter(self):
        events = [
            {"type": "response_item", "timestamp": "2026-07-01T10:00:01Z", "payload": {
                "type": "message", "role": "user", "content": [{"type": "input_text", "text": "Do it."}],
            }},
            {"type": "response_item", "timestamp": "2026-07-01T10:00:02Z", "payload": {
                "type": "function_call", "name": "Read", "call_id": "read-1", "arguments": {},
            }},
            {"type": "response_item", "timestamp": "2026-07-01T10:00:03Z", "payload": {
                "type": "function_call", "name": "Read", "call_id": "read-2", "arguments": {},
            }},
        ]
        write_jsonl(self.path, events)
        threads = [self.helper.Thread(id, "task", source, str(self.root), self.start, self.start + 60, False, "", str(self.path)) for id, source in [("root", ""), ("child", json.dumps({"subagent": {"thread_spawn": {"parent_thread_id": "root"}}}))]]
        adapter = self.helper.CodexSource(self.root, self.helper.iter_session_events)
        with mock.patch.object(self.helper, "SESSION_SOURCE", adapter), mock.patch.object(self.helper, "load_stats_cache", return_value={}), mock.patch.object(self.helper, "save_stats_cache"), mock.patch.object(self.helper, "known_skill_names", return_value=set()):
            entries, coverage = self.helper.collect_session_stats(threads)
            summary = self.helper.aggregate_session_stats(entries)
        self.assertEqual(coverage["included"], 2)
        self.assertEqual(coverage["low_signal_excluded"], 0)
        self.assertTrue(all(e["low_signal_narrative"] for e in entries))
        self.assertEqual(summary["totals"]["tool_calls"], 4)
        self.assertEqual(summary["lineage"]["child_records"], 1)
        self.assertNotEqual(self.helper.stats_cache_key(threads[0]), self.helper.stats_cache_key(threads[0], None, self.start + 100))


if __name__ == "__main__":
    unittest.main()

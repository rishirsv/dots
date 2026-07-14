"""Tests for Codex Exec task and judge normalization."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.codex_exec import GRADE_SCHEMA, _normalize_detail, judge_output, run_task


class JudgeSymmetryTests(unittest.TestCase):
    def test_grade_schema_requires_every_declared_check_property(self):
        check_schema = GRADE_SCHEMA["properties"]["checks"]["items"]
        self.assertEqual(set(check_schema["required"]), set(check_schema["properties"]))

    def test_garbage_output_is_unknown_grader_error(self):
        detail = _normalize_detail(None, "not json")
        self.assertEqual(detail["label"], "unknown")
        self.assertIsNone(detail["score"])
        self.assertEqual(detail["checks"], [])
        self.assertTrue(detail["grader_error"])

    def test_bad_label_is_unknown_grader_error(self):
        detail = _normalize_detail(
            {"label": "confused", "score": 0.75, "rationale": "bad label", "checks": [], "eval_feedback": []},
            "{}",
        )
        self.assertEqual(detail["label"], "unknown")
        self.assertEqual(detail["score"], 0.75)
        self.assertTrue(detail["grader_error"])

    def test_well_formed_output_has_no_grader_error_key(self):
        detail = _normalize_detail(
            {"label": "pass", "score": 1, "rationale": "ok", "checks": [], "eval_feedback": []},
            "{}",
        )
        self.assertEqual(detail["label"], "pass")
        self.assertNotIn("grader_error", detail)

    def test_judge_uses_ephemeral_json_exec_with_output_schema(self):
        calls = []

        def fake_run(command, **kwargs):
            calls.append((command, kwargs))
            output = Path(command[command.index("--output-last-message") + 1])
            output.write_text(json.dumps({
                "label": "pass", "score": 1, "rationale": "ok", "checks": [], "eval_feedback": [],
            }))
            return subprocess.CompletedProcess(command, 0, stdout='{"type":"turn.completed","usage":{"input_tokens":2,"output_tokens":1,"total_tokens":3}}\n', stderr="")

        with tempfile.TemporaryDirectory() as tmp, patch("meta_skill.codex_exec.codex_binary", return_value="codex"), patch(
            "meta_skill.codex_exec.codex_version", return_value="codex fake"
        ), patch("meta_skill.codex_exec.subprocess.run", side_effect=fake_run):
            artifact = Path(tmp) / "trials" / "a" / "artifacts" / "result.txt"
            artifact.parent.mkdir(parents=True)
            artifact.write_text("artifact content must not be embedded")
            detail = judge_output(
                judge_guidance="Grade it", task_text="Say ok", output_text="ok",
                cwd=Path(tmp), event_path=Path(tmp) / "events.jsonl",
                artifact_paths=[artifact],
                model="gpt-5.6-terra", reasoning_effort="medium",
            )
        command = calls[0][0]
        self.assertIn("--ephemeral", command)
        self.assertIn("--json", command)
        self.assertIn("--output-schema", command)
        self.assertEqual(command[command.index("--sandbox") + 1], "read-only")
        prompt = calls[0][1]["input"]
        self.assertIn("trials/a/artifacts/result.txt", prompt)
        self.assertIn("Inspect these files directly", prompt)
        self.assertNotIn("artifact content must not be embedded", prompt)
        self.assertEqual(detail["label"], "pass")
        self.assertEqual(detail["executor"]["provenance"], "requested")

    def test_task_exec_writes_workspace_local_result(self):
        def fake_run(command, **kwargs):
            output = Path(command[command.index("--output-last-message") + 1])
            output.write_text("finished")
            return subprocess.CompletedProcess(command, 0, stdout="", stderr="")

        with tempfile.TemporaryDirectory() as tmp:
            workspace = Path(tmp)
            (workspace / "task.md").write_text("Do A")
            (workspace / "fixtures").mkdir()
            (workspace / "artifacts").mkdir()
            packet = {
                "trial_id": "a.current.t1", "attempt_id": "attempt",
                "workspace_path": str(workspace), "task_path": str(workspace / "task.md"),
                "fixture_root": str(workspace / "fixtures"), "result_path": str(workspace / "result.json"),
                "artifact_root": str(workspace / "artifacts"),
            }
            with patch("meta_skill.codex_exec.codex_binary", return_value="codex"), patch(
                "meta_skill.codex_exec.codex_version", return_value="codex fake"
            ), patch("meta_skill.codex_exec.subprocess.run", side_effect=fake_run):
                result = run_task(packet, model="gpt-5.6-terra", reasoning_effort="medium", timeout_seconds=5)
            self.assertEqual(result["status"], "completed")
            self.assertEqual(json.loads((workspace / "result.json").read_text())["response"], "finished")


if __name__ == "__main__":
    unittest.main()

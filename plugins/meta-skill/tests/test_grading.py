"""Grading policy, blinding inputs, and revision tests."""

import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.grading import grade_run, record_human_grade
from meta_skill.io import read_jsonl
from meta_skill.report import build_report
from meta_skill.verdicts import latest_grade_rows


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n")


def make_run(root, graders):
    run = root / "run-1"
    write(run / "run.json", {"schema_version": 2, "run_id": "run-1", "model": "run-model", "runner": {"grading": True}, "trials": [{"trial_id": "a.current.t1", "eval_id": "a", "candidate": "current", "repetition": 1}], "candidates": [{"candidate": "current", "source_kind": "current_worktree"}]})
    write(run / "inputs" / "suite.json", {"schema_version": 2, "evals": [{"id": "a", "prompt": {"path": "task.md"}, "expected_output": None, "expectations": ["Good"], "graders": graders}]})
    case = run / "inputs" / "cases" / "a"
    case.mkdir(parents=True)
    (case / "task.md").write_text("Do A\n")
    trial = run / "trials" / "a.current.t1"
    trial.mkdir(parents=True)
    (trial / "response.md").write_text("A result")
    (trial / "events.jsonl").write_text('{"method":"tool"}\n')
    write(trial / "state.json", {"run_id": "run-1", "trial_id": "a.current.t1", "eval_id": "a", "candidate": "current", "repetition": 1, "status": "completed", "response_path": str(trial / "response.md")})
    return run


class GradingTests(unittest.TestCase):
    def test_declared_policy_transcript_and_model_are_preserved(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = make_run(Path(tmp), [
                {"kind": "model", "id": "required", "metric": "required", "uses_transcript": False},
                {"kind": "model", "id": "advice", "metric": "advice", "advisory": True, "uses_transcript": True},
            ])
            calls = []

            def judge(**kwargs):
                calls.append(kwargs)
                return {"label": "pass" if len(calls) == 1 else "fail", "score": 1, "rationale": "evidence", "checks": []}

            with patch("meta_skill.grading.judge_output", side_effect=judge):
                grade_run(str(run), model="judge-model")
            rows = read_jsonl(run / "trials" / "a.current.t1" / "grades.jsonl")
            self.assertIsNone(calls[0]["events_text"])
            self.assertIn("tool", calls[1]["events_text"])
            self.assertEqual({call["model"] for call in calls}, {"judge-model"})
            self.assertTrue(rows[1]["grader"]["advisory"])
            self.assertEqual(build_report(str(run))["trials"][0]["verdict"], "inconclusive")

    def test_custom_human_grader_records_and_supersedes(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = make_run(Path(tmp), [{"kind": "human", "id": "taste", "metric": "taste", "advisory": False}])
            grade_run(str(run))
            first = record_human_grade(str(run), trial_id="a.current.t1", grader_id="taste", metric="taste", label="fail", score=0, rationale="Too rough")
            second = record_human_grade(str(run), trial_id="a.current.t1", grader_id="taste", metric="taste", label="pass", score=1, rationale="Revised after checking")
            rows = latest_grade_rows(read_jsonl(run / "trials" / "a.current.t1" / "grades.jsonl"))
            self.assertEqual(len(rows), 1)
            self.assertEqual(rows[0]["grade_status"], "pass")
            self.assertEqual(first["grade"]["grader"]["id"], "taste")
            self.assertEqual(second["grade"]["metric"], "taste")
            self.assertIn("1 passed", (run / "report.md").read_text())

    def test_regrade_appends_frozen_grader_generation(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = make_run(Path(tmp), [{"kind": "model", "id": "judge", "metric": "quality"}])
            with patch("meta_skill.grading.judge_output", return_value={"label": "pass", "score": 1, "rationale": "ok", "checks": []}):
                grade_run(str(run))
                grade_run(str(run))
            rows = read_jsonl(run / "trials" / "a.current.t1" / "grades.jsonl")
            self.assertEqual(len(rows), 2)
            self.assertNotEqual(rows[0]["grade_generation_id"], rows[1]["grade_generation_id"])

    def test_regrade_skips_running_trial_without_poisoning_completed_verdict(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = make_run(Path(tmp), [{"kind": "model", "id": "judge", "metric": "quality"}])
            state_path = run / "trials" / "a.current.t1" / "state.json"
            state = json.loads(state_path.read_text())
            state["status"] = "running"
            write(state_path, state)
            with patch("meta_skill.grading.judge_output") as judge:
                result = grade_run(str(run))
            self.assertEqual(result["grades"], 0)
            self.assertFalse(judge.called)
            self.assertEqual(read_jsonl(run / "trials" / "a.current.t1" / "grades.jsonl"), [])

            state["status"] = "completed"
            write(state_path, state)
            with patch(
                "meta_skill.grading.judge_output",
                return_value={"label": "pass", "score": 1, "rationale": "ok", "checks": []},
            ):
                grade_run(str(run))
            rows = read_jsonl(run / "trials" / "a.current.t1" / "grades.jsonl")
            self.assertNotIn("runtime", {(row.get("grader") or {}).get("kind") for row in rows})
            self.assertEqual(build_report(str(run))["trials"][0]["verdict"], "passed")


if __name__ == "__main__":
    unittest.main()

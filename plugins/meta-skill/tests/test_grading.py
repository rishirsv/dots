"""Grading policy, blinding inputs, and revision tests."""

import json
import hashlib
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
    judge_text = "Judge one semantic criterion.\n"
    judge_digest = hashlib.sha256(judge_text.encode()).hexdigest()
    frozen_graders = []
    for grader in graders:
        grader = {**grader}
        if grader.get("kind") == "model":
            grader.setdefault("path", "judge.md")
            if not grader.get("advisory"):
                grader.setdefault("model", "calibrated-model")
                grader.setdefault("reasoning_effort", "medium")
                grader.setdefault("calibration", {
                    "dataset_id": "held-out-v1",
                    "data_period": "2026-01-01/2026-06-30",
                    "validated_at": "2026-07-01",
                    "model": grader["model"],
                    "reasoning_effort": grader["reasoning_effort"],
                    "judge_sha256": judge_digest,
                    "confidence_level": 0.95,
                    "minimum_tpr": 0.9,
                    "minimum_tnr": 0.9,
                    "test": {
                        "true_positive": 200,
                        "false_negative": 0,
                        "true_negative": 200,
                        "false_positive": 0,
                    },
                })
        frozen_graders.append(grader)
    write(run / "run.json", {
        "schema_version": 2,
        "run_id": "run-1",
        "skill_name": "demo",
        "model": "run-model",
        "runner": {"grading": True},
        "task_executor": {"kind": "native_subagent", "provenance": "inherited"},
        "judge_executor": {"kind": "codex_exec", "provenance": "requested"},
        "trials": [{"trial_id": "a.current.t1", "eval_id": "a", "candidate": "current", "repetition": 1}],
        "candidates": [{"candidate": "current", "source_kind": "current_worktree"}],
    })
    write(run / "inputs" / "suite.json", {"schema_version": 2, "evals": [{"id": "a", "prompt": {"path": "task.md"}, "expected_output": None, "expectations": ["Good"], "graders": frozen_graders}]})
    case = run / "inputs" / "cases" / "a"
    case.mkdir(parents=True)
    (case / "task.md").write_text("Do A\n")
    (case / "judge.md").write_text(judge_text)
    trial = run / "trials" / "a.current.t1"
    trial.mkdir(parents=True)
    (trial / "response.md").write_text("A result")
    (trial / "events.jsonl").write_text('{"method":"tool"}\n')
    write(trial / "state.json", {"run_id": "run-1", "trial_id": "a.current.t1", "eval_id": "a", "candidate": "current", "repetition": 1, "status": "completed"})
    return run


class GradingTests(unittest.TestCase):
    def test_declared_policy_transcript_and_model_are_preserved(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = make_run(Path(tmp), [
                {"kind": "model", "id": "required", "metric": "required", "uses_transcript": False},
                {"kind": "model", "id": "advice", "metric": "advice", "advisory": True, "uses_transcript": True},
            ])
            artifact = run / "trials" / "a.current.t1" / "artifacts" / "result.csv"
            artifact.parent.mkdir()
            artifact.write_text("value\n42\n")
            calls = []

            def judge(**kwargs):
                calls.append(kwargs)
                return {"label": "pass" if len(calls) == 1 else "fail", "score": 1, "rationale": "evidence", "checks": []}

            with patch("meta_skill.grading.judge_output", side_effect=judge):
                grade_run(str(run), model="judge-model", reasoning_effort="high")
            rows = read_jsonl(run / "trials" / "a.current.t1" / "grades.jsonl")
            self.assertIsNone(calls[0]["events_text"])
            self.assertIn("tool", calls[1]["events_text"])
            self.assertEqual([call["model"] for call in calls], ["calibrated-model", "judge-model"])
            self.assertEqual([call["reasoning_effort"] for call in calls], ["medium", "high"])
            self.assertEqual(calls[0]["artifact_paths"], [artifact.resolve()])
            self.assertTrue(rows[1]["grader"]["advisory"])
            self.assertTrue(all(not Path(ref).is_absolute() for row in rows for ref in row["evidence_refs"]))
            self.assertIn("trials/a.current.t1/response.md", rows[0]["evidence_refs"])
            self.assertIn("trials/a.current.t1/artifacts/result.csv", rows[0]["evidence_refs"])
            self.assertEqual(build_report(str(run))["trials"][0]["verdict"], "passed")

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
            self.assertEqual(
                second["grade"]["evidence_refs"],
                ["trials/a.current.t1/response.md", "trials/a.current.t1/events.jsonl"],
            )
            self.assertIn("1 passed", (run / "demo-evaluation.md").read_text())

    def test_regrade_appends_frozen_grader_generation(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = make_run(Path(tmp), [{"kind": "model", "id": "judge", "metric": "quality"}])
            with patch("meta_skill.grading.judge_output", return_value={"label": "pass", "score": 1, "rationale": "ok", "checks": []}):
                grade_run(str(run))
                grade_run(str(run))
            rows = read_jsonl(run / "trials" / "a.current.t1" / "grades.jsonl")
            self.assertEqual(len(rows), 2)
            self.assertNotEqual(rows[0]["grade_generation_id"], rows[1]["grade_generation_id"])

    def test_only_opted_in_annotations_calibrate_model_judge(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = make_run(Path(tmp), [{"kind": "model", "id": "judge", "metric": "quality", "advisory": True}])
            trial = run / "trials" / "a.current.t1"
            write(
                trial / "review.json",
                {
                    "annotations": [
                        {
                            "annotation_id": "annotation-rubric",
                            "artifact": "response",
                            "tag": "taste-rule",
                            "judge_use": "rubric",
                            "note": "Prefer a short explanation tied to the produced file.",
                        },
                        {
                            "annotation_id": "annotation-one-off",
                            "artifact": "response",
                            "tag": "one-off",
                            "judge_use": "exclude",
                            "note": "Ignore this note when judging.",
                        },
                    ]
                },
            )
            calls = []

            def judge(**kwargs):
                calls.append(kwargs)
                return {"label": "pass", "score": 1, "rationale": "ok", "checks": []}

            with patch("meta_skill.grading.judge_output", side_effect=judge):
                grade_run(str(run))
            rows = read_jsonl(trial / "grades.jsonl")
            self.assertIn("annotation-rubric", calls[0]["judge_guidance"])
            self.assertNotIn("annotation-one-off", calls[0]["judge_guidance"])
            self.assertEqual(rows[0]["judge_context"]["annotation_ids"], ["annotation-rubric"])
            self.assertEqual(len(rows[0]["judge_context"]["digest"]), 64)

    def test_trusted_judge_uses_only_frozen_calibrated_guidance(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = make_run(Path(tmp), [{"kind": "model", "id": "judge", "metric": "quality"}])
            trial = run / "trials" / "a.current.t1"
            write(trial / "review.json", {"annotations": [{
                "annotation_id": "later-rubric",
                "artifact": "response",
                "tag": "taste-rule",
                "judge_use": "rubric",
                "note": "This would change the calibrated prompt.",
            }]})
            calls = []

            def judge(**kwargs):
                calls.append(kwargs)
                return {"label": "pass", "score": 1, "rationale": "ok", "checks": []}

            with patch("meta_skill.grading.judge_output", side_effect=judge):
                grade_run(str(run))
            self.assertNotIn("later-rubric", calls[0]["judge_guidance"])
            row = read_jsonl(trial / "grades.jsonl")[0]
            self.assertEqual(row["judge_context"]["annotation_ids"], [])
            self.assertEqual(row["grader"]["model"], "calibrated-model")

    def test_trusted_judge_rejects_non_binary_partial_label(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = make_run(Path(tmp), [{"kind": "model", "id": "judge", "metric": "quality"}])
            with patch(
                "meta_skill.grading.judge_output",
                return_value={
                    "label": "partial",
                    "score": 0.5,
                    "rationale": "mixed",
                    "checks": [],
                },
            ):
                grade_run(str(run))
            row = read_jsonl(run / "trials" / "a.current.t1" / "grades.jsonl")[0]
            self.assertEqual(row["grade_status"], "unknown")
            self.assertTrue(row["detail"]["grader_error"])
            self.assertEqual(build_report(str(run))["trials"][0]["verdict"], "inconclusive")

    def test_expectations_only_model_feedback_is_advisory_and_cannot_pass(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = make_run(Path(tmp), [])
            with patch(
                "meta_skill.grading.judge_output",
                return_value={"label": "pass", "score": 1, "rationale": "looks good", "checks": []},
            ):
                grade_run(str(run))
            row = read_jsonl(run / "trials" / "a.current.t1" / "grades.jsonl")[0]
            self.assertTrue(row["grader"]["advisory"])
            self.assertTrue(row["grader"]["implicit"])
            self.assertEqual(build_report(str(run))["trials"][0]["verdict"], "inconclusive")

    def test_frozen_case_rubrics_inform_advisory_judge(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            run = make_run(root, [{"kind": "model", "id": "judge", "metric": "quality", "advisory": True}])
            suite = json.loads((run / "inputs" / "suite.json").read_text())
            suite["evals"][0]["annotations"] = [
                {
                    "annotation_id": "case-rubric",
                    "judge_use": "rubric",
                    "artifact": "response",
                    "note": "Mention the produced artifact.",
                },
                {
                    "annotation_id": "case-evidence",
                    "judge_use": "evidence",
                    "artifact": "response",
                    "note": "Evidence from the prior output.",
                },
            ]
            write(run / "inputs" / "suite.json", suite)
            calls = []

            def judge(**kwargs):
                calls.append(kwargs)
                return {"label": "pass", "score": 1, "rationale": "ok", "checks": []}

            with patch("meta_skill.grading.judge_output", side_effect=judge):
                grade_run(str(run))

            guidance = calls[0]["judge_guidance"]
            self.assertIn("case-rubric", guidance)
            self.assertNotIn("case-evidence", guidance)
            row = read_jsonl(run / "trials" / "a.current.t1" / "grades.jsonl")[0]
            self.assertEqual(
                set(row["judge_context"]["annotation_ids"]),
                {"case-rubric"},
            )

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

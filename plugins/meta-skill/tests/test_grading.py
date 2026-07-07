"""Tests for eval grading ledger behavior."""

import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.grading import grade_run, record_human_grade  # noqa: E402
from meta_skill.io import read_jsonl  # noqa: E402
from meta_skill.summary import build_summary  # noqa: E402


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


def write_jsonl(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(row, sort_keys=True) + "\n" for row in rows))


def build_model_run(tmp, case_ids):
    run_dir = Path(tmp) / ".demo" / "runs" / "run-001"
    cases = []
    trials = []
    results = []
    for case_id in case_ids:
        case_root = run_dir / "inputs" / "cases" / case_id
        case_root.mkdir(parents=True, exist_ok=True)
        (case_root / "task.md").write_text(f"Answer {case_id}.\n")
        cases.append(
            {
                "id": case_id,
                "task_text": f"Answer {case_id}.\n",
                "expectations": [f"The response handles {case_id}."],
            }
        )
        trial_id = f"{case_id}.current.t1"
        response_path = run_dir / "trials" / trial_id / "response.md"
        response_path.parent.mkdir(parents=True)
        response_path.write_text(f"{case_id} response\n")
        trials.append(
            {
                "trial_id": trial_id,
                "case_id": case_id,
                "candidate": "current",
                "repetition": 1,
            }
        )
        results.append(
            {
                "trial_id": trial_id,
                "case_id": case_id,
                "candidate": "current",
                "repetition": 1,
                "runtime_status": "completed",
                "response_path": str(response_path),
                "events_path": str(response_path.parent / "events.jsonl"),
                "evidence_path": str(response_path.parent / "evidence.json"),
            }
        )
    write_json(run_dir / "inputs" / "suite.json", {"schema_version": 1, "cases": cases})
    write_json(
        run_dir / "run.json",
        {
            "run_id": "run-001",
            "created_at": "2026-01-01T00:00:00Z",
            "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
            "model_config": {},
            "trials": trials,
        },
    )
    write_jsonl(run_dir / "results.jsonl", results)
    return run_dir


class GradingTests(unittest.TestCase):
    def test_regrade_appends_new_grade_generation(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / ".demo" / "runs" / "run-001"
            case_root = run_dir / "inputs" / "cases" / "case-a"
            case_root.mkdir(parents=True)
            (case_root / "task.md").write_text("Say done.\n")
            write_json(case_root / "expectations.json", ["The response says done."])
            write_json(
                run_dir / "inputs" / "suite.json",
                {
                    "schema_version": 1,
                    "cases": [
                        {
                            "id": "case-a",
                            "task_text": "Say done.\n",
                            "expectations": ["The response says done."],
                        }
                    ],
                },
            )
            response_path = run_dir / "trials" / "case-a.current.t1" / "response.md"
            response_path.parent.mkdir(parents=True)
            response_path.write_text("done\n")
            write_json(
                run_dir / "run.json",
                {
                    "run_id": "run-001",
                    "created_at": "2026-01-01T00:00:00Z",
                    "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
                    "model_config": {},
                    "trials": [
                        {
                            "trial_id": "case-a.current.t1",
                            "case_id": "case-a",
                            "candidate": "current",
                            "repetition": 1,
                        }
                    ],
                },
            )
            write_jsonl(
                run_dir / "results.jsonl",
                [
                    {
                        "trial_id": "case-a.current.t1",
                        "case_id": "case-a",
                        "candidate": "current",
                        "repetition": 1,
                        "runtime_status": "completed",
                        "response_path": str(response_path),
                        "events_path": str(response_path.parent / "events.jsonl"),
                        "evidence_path": str(response_path.parent / "evidence.json"),
                    }
                ],
            )

            def fake_judge(**_kwargs):
                return {"score": 1.0, "label": "pass", "rationale": "ok", "checks": [], "eval_feedback": []}

            with patch("meta_skill.grading.judge_output", side_effect=fake_judge):
                grade_run(str(run_dir))
                grade_run(str(run_dir))

            grades = read_jsonl(run_dir / "grades.jsonl")
            self.assertEqual(len(grades), 2)
            self.assertEqual({row["grade_status"] for row in grades}, {"pass"})
            self.assertNotIn("label", grades[0])
            self.assertEqual(len({row["grade_generation_id"] for row in grades}), 2)

    def test_regrade_preserves_recorded_human_grade(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / ".demo" / "runs" / "run-001"
            case_root = run_dir / "inputs" / "cases" / "case-a"
            case_root.mkdir(parents=True)
            (case_root / "task.md").write_text("Say done.\n")
            write_json(
                run_dir / "inputs" / "suite.json",
                {
                    "schema_version": 1,
                    "cases": [
                        {
                            "id": "case-a",
                            "task_text": "Say done.\n",
                            "graders": [{"kind": "human", "id": "human-review", "metric": "quality"}],
                        }
                    ],
                },
            )
            response_path = run_dir / "trials" / "case-a.current.t1" / "response.md"
            response_path.parent.mkdir(parents=True)
            response_path.write_text("done\n")
            write_json(
                run_dir / "run.json",
                {
                    "run_id": "run-001",
                    "created_at": "2026-01-01T00:00:00Z",
                    "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
                    "model_config": {},
                    "trials": [
                        {
                            "trial_id": "case-a.current.t1",
                            "case_id": "case-a",
                            "candidate": "current",
                            "repetition": 1,
                        }
                    ],
                },
            )
            write_jsonl(
                run_dir / "results.jsonl",
                [
                    {
                        "trial_id": "case-a.current.t1",
                        "case_id": "case-a",
                        "candidate": "current",
                        "repetition": 1,
                        "runtime_status": "completed",
                        "response_path": str(response_path),
                    }
                ],
            )

            grade_run(str(run_dir))
            record_human_grade(
                str(run_dir),
                trial_id="case-a.current.t1",
                grader_id="human-review",
                metric="quality",
                label="pass",
                rationale="Reviewed manually.",
            )
            grade_run(str(run_dir))

            grades = read_jsonl(run_dir / "grades.jsonl")
            self.assertEqual([row["grade_status"] for row in grades], ["unknown", "pass"])
            self.assertEqual(build_summary(str(run_dir))["trials"][0]["verdict"], "passed")

    def test_model_grader_error_detail_sets_unknown_grade_status(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = build_model_run(tmp, ["case-a"])

            def fake_judge(**_kwargs):
                return {
                    "score": None,
                    "label": "unknown",
                    "rationale": "model grader returned no usable JSON: garbage",
                    "checks": [],
                    "eval_feedback": [],
                    "grader_error": True,
                    "raw_response": "garbage",
                }

            with patch("meta_skill.grading.judge_output", side_effect=fake_judge):
                grade_run(str(run_dir))

            grades = read_jsonl(run_dir / "grades.jsonl")
            self.assertEqual(len(grades), 1)
            self.assertEqual(grades[0]["grade_status"], "unknown")
            self.assertTrue(grades[0]["detail"]["grader_error"])
            self.assertEqual(grades[0]["detail"]["raw_response"], "garbage")

    def test_parallel_grade_run_matches_serial_rows_and_writes_valid_jsonl(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = build_model_run(tmp, ["case-a", "case-b", "case-c", "case-d"])

            def fake_judge(**kwargs):
                label = "pass" if "case-a" in kwargs["output_text"] or "case-c" in kwargs["output_text"] else "partial"
                return {
                    "score": 1.0 if label == "pass" else 0.5,
                    "label": label,
                    "rationale": f"{label}: {kwargs['output_text'].strip()}",
                    "checks": [{"name": "response", "label": "pass", "evidence": kwargs["output_text"].strip()}],
                    "eval_feedback": [],
                }

            with patch("meta_skill.grading.run_id", return_value="fixed"), patch(
                "meta_skill.grading.utc_now", return_value="2026-01-01T00:00:00Z"
            ), patch("meta_skill.grading.judge_output", side_effect=fake_judge):
                grade_run(str(run_dir), parallel=1)
            serial_rows = read_jsonl(run_dir / "grades.jsonl")
            (run_dir / "grades.jsonl").unlink()

            with patch("meta_skill.grading.run_id", return_value="fixed"), patch(
                "meta_skill.grading.utc_now", return_value="2026-01-01T00:00:00Z"
            ), patch("meta_skill.grading.judge_output", side_effect=fake_judge):
                grade_run(str(run_dir), parallel=3)
            parallel_rows = read_jsonl(run_dir / "grades.jsonl")

            serial_set = {json.dumps(row, sort_keys=True) for row in serial_rows}
            parallel_set = {json.dumps(row, sort_keys=True) for row in parallel_rows}
            self.assertEqual(parallel_set, serial_set)
            self.assertEqual(len(parallel_rows), len(serial_rows))
            for line in (run_dir / "grades.jsonl").read_text().splitlines():
                json.loads(line)


if __name__ == "__main__":
    unittest.main()

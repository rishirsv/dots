"""Tests for evaluator grade labels and judge calibration rates."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.app_server.judge import GRADE_LABELS as MODEL_GRADE_LABELS  # noqa: E402
from meta_skill.calibration import calibrate_run  # noqa: E402
from meta_skill.grading import GRADE_LABELS as HUMAN_GRADE_LABELS  # noqa: E402


def grade(trial_id, kind, label, metric="quality"):
    return {
        "run_id": "run-001",
        "case_id": trial_id.split(".")[0],
        "candidate": "current",
        "trial_id": trial_id,
        "grader": {"kind": kind, "id": kind},
        "metric": metric,
        "score": None,
        "label": label,
        "rationale": f"{kind} says {label}",
    }


class EvaluatorLabelCalibrationTests(unittest.TestCase):
    def test_grade_labels_use_unknown_without_human_review_label(self):
        self.assertEqual(MODEL_GRADE_LABELS, {"pass", "partial", "fail", "unknown"})
        self.assertEqual(HUMAN_GRADE_LABELS, {"pass", "partial", "fail", "unknown"})

    def test_calibration_tpr_finds_failures_and_tnr_recognizes_passes(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / ".demo" / "runs" / "run-001"
            run_dir.mkdir(parents=True)
            (run_dir / "run.json").write_text(json.dumps({"run_id": "run-001"}))
            rows = [
                grade("case-a.current.t1", "human", "fail"),
                grade("case-a.current.t1", "model", "fail"),
                grade("case-b.current.t1", "human", "fail"),
                grade("case-b.current.t1", "model", "pass"),
                grade("case-c.current.t1", "human", "pass"),
                grade("case-c.current.t1", "model", "pass"),
                grade("case-d.current.t1", "human", "pass"),
                grade("case-d.current.t1", "model", "fail"),
            ]
            (run_dir / "grades.jsonl").write_text("".join(json.dumps(row) + "\n" for row in rows))

            result = calibrate_run(str(run_dir), "quality")

            summary = result["summary"]
            self.assertEqual(summary["binary_paired"], 4)
            self.assertEqual(summary["true_positive"], 1)
            self.assertEqual(summary["true_negative"], 1)
            self.assertEqual(summary["false_pass"], 1)
            self.assertEqual(summary["false_fail"], 1)
            self.assertEqual(summary["true_positive_rate"], 0.5)
            self.assertEqual(summary["true_negative_rate"], 0.5)
            self.assertEqual(summary["model_unknown_rate"], 0.0)
            self.assertEqual(summary["human_unknown_rate"], 0.0)


if __name__ == "__main__":
    unittest.main()

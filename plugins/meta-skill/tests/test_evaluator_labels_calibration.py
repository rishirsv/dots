"""Tests for evaluator grade labels and judge calibration rates."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.app_server.judge import GRADE_LABELS as MODEL_GRADE_LABELS  # noqa: E402
from meta_skill.calibration import agreement_summary, calibrate_run  # noqa: E402
from meta_skill.errors import CliError  # noqa: E402
from meta_skill.grading import GRADE_LABELS as HUMAN_GRADE_LABELS  # noqa: E402


def grade(trial_id, kind, grade_status, metric="quality"):
    return {
        "run_id": "run-001",
        "case_id": trial_id.split(".")[0],
        "candidate": "current",
        "trial_id": trial_id,
        "grader": {"kind": kind, "id": kind},
        "metric": metric,
        "score": None,
        "grade_status": grade_status,
        "rationale": f"{kind} says {grade_status}",
    }


def binary_rows(count, model_status="pass", human_status="pass", start=0):
    model = []
    human = []
    for index in range(start, start + count):
        trial_id = f"case-{index}.current.t1"
        model.append(grade(trial_id, "model", model_status))
        human.append(grade(trial_id, "human", human_status))
    return model, human


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

    def test_calibration_pairs_on_latest_regrade_row(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / ".demo" / "runs" / "run-001"
            run_dir.mkdir(parents=True)
            (run_dir / "run.json").write_text(json.dumps({"run_id": "run-001"}))
            rows = [
                grade("case-a.current.t1", "human", "pass"),
                grade("case-a.current.t1", "model", "fail"),  # stale
                grade("case-a.current.t1", "model", "pass"),  # re-grade wins
            ]
            (run_dir / "grades.jsonl").write_text("".join(json.dumps(row) + "\n" for row in rows))

            summary = calibrate_run(str(run_dir), "quality")["summary"]

            self.assertEqual(summary["paired"], 1)
            self.assertEqual(summary["exact_agreement"], 1)
            self.assertEqual(summary["true_negative"], 1)


class AgreementSummaryTests(unittest.TestCase):
    def test_pure_function_computes_confusion(self):
        model = [
            grade("case-a.current.t1", "model", "fail"),
            grade("case-b.current.t1", "model", "pass"),
        ]
        human = [
            grade("case-a.current.t1", "human", "fail"),
            grade("case-b.current.t1", "human", "pass"),
        ]
        result = agreement_summary(model, human, "quality")
        self.assertEqual(set(result), {"summary", "examples"})
        self.assertEqual(result["summary"]["exact_agreement"], 2)
        self.assertEqual(result["summary"]["true_positive"], 1)
        self.assertEqual(result["summary"]["true_negative"], 1)

    def test_raises_without_pairs(self):
        with self.assertRaises(CliError):
            agreement_summary([grade("case-a.current.t1", "model", "pass")], [], "quality")

    def test_trust_band_insufficient_at_five(self):
        model, human = binary_rows(5)
        summary = agreement_summary(model, human, "quality")["summary"]
        self.assertEqual(summary["paired"], 5)
        self.assertEqual(summary["trust_band"], "insufficient labels: spot-check only")
        self.assertFalse(summary["binary_insufficient"])

    def test_trust_band_directional_when_binary_undersampled(self):
        # 25 paired, but only 6 land in the binary cut (rest are partial).
        model, human = binary_rows(6)
        pmodel, phuman = binary_rows(19, "partial", "partial", start=100)
        summary = agreement_summary(model + pmodel, human + phuman, "quality")["summary"]
        self.assertEqual(summary["paired"], 25)
        self.assertEqual(summary["binary_paired"], 6)
        self.assertEqual(summary["trust_band"], "directional: binary agreement under-sampled")
        self.assertTrue(summary["binary_insufficient"])

    def test_trust_band_calibrated_when_binary_sufficient(self):
        model, human = binary_rows(15)
        pmodel, phuman = binary_rows(15, "partial", "partial", start=100)
        summary = agreement_summary(model + pmodel, human + phuman, "quality")["summary"]
        self.assertEqual(summary["paired"], 30)
        self.assertEqual(summary["binary_paired"], 15)
        self.assertEqual(summary["trust_band"], "calibrated for local decisions")
        self.assertFalse(summary["binary_insufficient"])


if __name__ == "__main__":
    unittest.main()

"""Verdict folding tests."""

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.verdicts import latest_grade_rows, verdict_for_trial


def grade(status, advisory=False, kind="model", grader_id="judge", metric="quality"):
    return {"trial_id": "a.current.t1", "grade_status": status, "metric": metric, "grader": {"kind": kind, "id": grader_id, "advisory": advisory}}


class VerdictTests(unittest.TestCase):
    def test_runtime_and_no_grade_states(self):
        self.assertEqual(verdict_for_trial({"status": "timed_out"}, [], grading_enabled=True), "failed")
        self.assertEqual(verdict_for_trial({"status": "running"}, [], grading_enabled=True), "inconclusive")
        self.assertEqual(verdict_for_trial({"status": "completed"}, [], grading_enabled=False), "ungraded")

    def test_required_and_advisory_policy(self):
        state = {"status": "completed"}
        self.assertEqual(verdict_for_trial(state, [grade("pass"), grade("fail", True, grader_id="note", metric="note")]), "passed")
        self.assertEqual(verdict_for_trial(state, [grade("fail"), grade("pass", True, grader_id="note", metric="note")]), "failed")
        self.assertEqual(verdict_for_trial(state, [grade("pass")]), "passed")

    def test_latest_grade_supersedes_by_identity(self):
        rows = latest_grade_rows([grade("fail"), grade("pass")])
        self.assertEqual([row["grade_status"] for row in rows], ["pass"])


if __name__ == "__main__":
    unittest.main()

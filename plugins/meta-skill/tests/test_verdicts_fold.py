"""Tests for trial verdict folding."""

import sys
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.verdicts import verdict_for_trial  # noqa: E402


def grade(status, *, advisory=False):
    return {
        "trial_id": "case.current.t1",
        "metric": "quality",
        "grader": {"kind": "model", "id": f"judge-{status}-{advisory}", "advisory": advisory},
        "grade_status": status,
    }


class VerdictFoldTests(unittest.TestCase):
    def test_required_fail_fails_even_with_advisory_pass(self):
        verdict = verdict_for_trial(
            {"runtime_status": "completed"},
            [grade("fail"), grade("pass", advisory=True)],
            grading_mode="expectations",
        )

        self.assertEqual(verdict, "failed")

    def test_advisory_fail_is_inconclusive_when_required_passes(self):
        verdict = verdict_for_trial(
            {"runtime_status": "completed"},
            [grade("pass"), grade("fail", advisory=True)],
            grading_mode="expectations",
        )

        self.assertEqual(verdict, "inconclusive")

    def test_advisory_only_pass_is_inconclusive(self):
        verdict = verdict_for_trial(
            {"runtime_status": "completed"},
            [grade("pass", advisory=True)],
            grading_mode="expectations",
        )

        self.assertEqual(verdict, "inconclusive")

    def test_required_and_advisory_passes_pass(self):
        verdict = verdict_for_trial(
            {"runtime_status": "completed"},
            [grade("pass"), grade("pass", advisory=True)],
            grading_mode="expectations",
        )

        self.assertEqual(verdict, "passed")

    def test_partial_in_any_tier_is_inconclusive(self):
        verdict = verdict_for_trial(
            {"runtime_status": "completed"},
            [grade("pass"), grade("partial", advisory=True)],
            grading_mode="expectations",
        )

        self.assertEqual(verdict, "inconclusive")

    def test_missing_grader_is_required_by_default(self):
        verdict = verdict_for_trial(
            {"runtime_status": "completed"},
            [{"trial_id": "case.current.t1", "metric": "quality", "grade_status": "pass"}],
            grading_mode="expectations",
        )

        self.assertEqual(verdict, "passed")


if __name__ == "__main__":
    unittest.main()

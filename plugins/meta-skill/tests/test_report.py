"""Tests for current run report ownership."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.report import build_report, list_runs  # noqa: E402
from meta_skill.summary import build_summary  # noqa: E402
from meta_skill.errors import CliError  # noqa: E402


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


def write_jsonl(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(row, sort_keys=True) + "\n" for row in rows))


class ReportTests(unittest.TestCase):
    def test_build_report_rebuilds_summary_and_adds_run_model(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / ".demo" / "runs" / "run-001"
            write_json(
                run_dir / "run.json",
                {
                    "run_id": "run-001",
                    "created_at": "2026-01-01T00:00:00Z",
                    "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
                    "model_config": {},
                    "candidates": [
                        {"candidate": "no-skill", "source_kind": "none"},
                        {"candidate": "current", "source_kind": "current_worktree"},
                    ],
                    "trials": [
                        {"trial_id": "case-a.no-skill.t1", "case_id": "case-a", "candidate": "no-skill", "repetition": 1},
                        {"trial_id": "case-a.current.t1", "case_id": "case-a", "candidate": "current", "repetition": 1},
                    ],
                },
            )
            write_jsonl(
                run_dir / "results.jsonl",
                [
                    {"trial_id": "case-a.no-skill.t1", "case_id": "case-a", "candidate": "no-skill", "repetition": 1, "runtime_status": "completed"},
                    {"trial_id": "case-a.current.t1", "case_id": "case-a", "candidate": "current", "repetition": 1, "runtime_status": "completed"},
                ],
            )
            write_jsonl(
                run_dir / "grades.jsonl",
                [
                    {"trial_id": "case-a.no-skill.t1", "case_id": "case-a", "candidate": "no-skill", "metric": "quality", "grader": {"kind": "model", "id": "judge"}, "grade_status": "fail"},
                    {"trial_id": "case-a.current.t1", "case_id": "case-a", "candidate": "current", "metric": "quality", "grader": {"kind": "model", "id": "judge"}, "grade_status": "pass"},
                ],
            )

            report = build_report(str(run_dir))

            self.assertTrue((run_dir / "summary.json").exists())
            self.assertEqual(report["final_verdict_totals"], {"failed": 1, "passed": 1})
            self.assertEqual(report["totals"]["trials"], 2)
            self.assertEqual(report["comparisons"][0]["baseline_state"], "fail")
            self.assertEqual(report["comparisons"][0]["candidate_state"], "pass")

    def test_list_runs_reports_invalid_summary_json(self):
        with tempfile.TemporaryDirectory() as tmp:
            workbench = Path(tmp) / ".demo"
            suite = workbench / "evals.json"
            write_json(suite, {"schema_version": 1})
            run_dir = workbench / "runs" / "run-001"
            write_json(run_dir / "run.json", {"run_id": "run-001"})
            (run_dir / "summary.json").write_text("{bad json\n")

            result = list_runs(str(suite))

            self.assertEqual(result["runs"][0]["run_id"], "run-001")
            self.assertIn("invalid JSON", result["runs"][0]["error"])

    def test_planned_trial_without_result_is_inconclusive(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / ".demo" / "runs" / "run-001"
            write_json(
                run_dir / "run.json",
                {
                    "run_id": "run-001",
                    "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
                    "trials": [
                        {"trial_id": "case-a.current.t1", "case_id": "case-a", "candidate": "current", "repetition": 1}
                    ],
                },
            )

            summary = build_summary(str(run_dir))

            self.assertEqual(summary["trials"][0]["runtime_status"], "no_result")
            self.assertEqual(summary["trials"][0]["verdict"], "inconclusive")
            self.assertEqual(summary["runtime_status_totals"], {"no_result": 1})

    def test_result_row_without_runtime_status_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / ".demo" / "runs" / "run-001"
            write_json(
                run_dir / "run.json",
                {
                    "run_id": "run-001",
                    "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
                    "trials": [
                        {"trial_id": "case-a.current.t1", "case_id": "case-a", "candidate": "current", "repetition": 1}
                    ],
                },
            )
            write_jsonl(run_dir / "results.jsonl", [{"trial_id": "case-a.current.t1", "case_id": "case-a"}])

            with self.assertRaises(CliError) as ctx:
                build_summary(str(run_dir))

            self.assertIn("missing runtime_status", ctx.exception.message)

    def test_result_row_with_no_result_status_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / ".demo" / "runs" / "run-001"
            write_json(
                run_dir / "run.json",
                {
                    "run_id": "run-001",
                    "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
                    "trials": [
                        {"trial_id": "case-a.current.t1", "case_id": "case-a", "candidate": "current", "repetition": 1}
                    ],
                },
            )
            write_jsonl(run_dir / "results.jsonl", [{"trial_id": "case-a.current.t1", "runtime_status": "no_result"}])

            with self.assertRaises(CliError) as ctx:
                build_summary(str(run_dir))

            self.assertIn("invalid runtime_status", ctx.exception.message)

    def test_grade_row_without_grade_status_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / ".demo" / "runs" / "run-001"
            write_json(
                run_dir / "run.json",
                {
                    "run_id": "run-001",
                    "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
                    "trials": [
                        {"trial_id": "case-a.current.t1", "case_id": "case-a", "candidate": "current", "repetition": 1}
                    ],
                },
            )
            write_jsonl(run_dir / "results.jsonl", [{"trial_id": "case-a.current.t1", "runtime_status": "completed"}])
            write_jsonl(run_dir / "grades.jsonl", [{"trial_id": "case-a.current.t1", "label": "pass"}])

            with self.assertRaises(CliError) as ctx:
                build_summary(str(run_dir))

            self.assertIn("missing grade_status", ctx.exception.message)


if __name__ == "__main__":
    unittest.main()

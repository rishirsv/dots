"""Tests for current run report ownership."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.report import build_report, list_runs, render_markdown  # noqa: E402
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

    def test_summary_token_usage_and_grader_error_totals(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / ".demo" / "runs" / "run-001"
            write_json(
                run_dir / "run.json",
                {
                    "run_id": "run-001",
                    "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
                    "trials": [
                        {"trial_id": "case-a.current.t1", "case_id": "case-a", "candidate": "current", "repetition": 1},
                        {"trial_id": "case-b.current.t1", "case_id": "case-b", "candidate": "current", "repetition": 1},
                    ],
                },
            )
            write_jsonl(
                run_dir / "results.jsonl",
                [
                    {"trial_id": "case-a.current.t1", "runtime_status": "completed", "usage": {"input_tokens": 100, "output_tokens": 20}},
                    {"trial_id": "case-b.current.t1", "runtime_status": "completed"},
                ],
            )
            write_jsonl(
                run_dir / "grades.jsonl",
                [
                    # stale grade error row, superseded by a clean re-grade -> not counted
                    {"trial_id": "case-a.current.t1", "metric": "quality", "grader": {"kind": "model", "id": "judge"}, "grade_status": "unknown", "detail": {"grader_error": "timeout"}},
                    {"trial_id": "case-a.current.t1", "metric": "quality", "grader": {"kind": "model", "id": "judge"}, "grade_status": "pass", "detail": {"usage": {"input_tokens": 50, "output_tokens": 10}}},
                    # latest generation still errored -> counted once
                    {"trial_id": "case-b.current.t1", "metric": "quality", "grader": {"kind": "model", "id": "judge"}, "grade_status": "unknown", "detail": {"grader_error": "rate_limit", "usage": {"input_tokens": 5, "output_tokens": 1}}},
                ],
            )

            summary = build_summary(str(run_dir))

            self.assertEqual(summary["grader_error_total"], 1)
            usage = summary["token_usage"]
            self.assertEqual(usage["trial_input_tokens"], 100)
            self.assertEqual(usage["trial_output_tokens"], 20)
            self.assertEqual(usage["judge_input_tokens"], 55)
            self.assertEqual(usage["judge_output_tokens"], 11)
            self.assertEqual(usage["total_tokens"], 186)
            self.assertEqual(usage["trials_with_usage"], 1)

    def test_render_markdown_emits_token_and_grader_error_lines(self):
        summary = {
            "run_id": "run-001",
            "run_dir": "/tmp/run-001",
            "created_at": "2026-01-01T00:00:00Z",
            "grading_mode": "expectations",
            "total_trials": 2,
            "token_usage": {
                "trial_input_tokens": 100,
                "trial_output_tokens": 20,
                "judge_input_tokens": 55,
                "judge_output_tokens": 11,
                "total_tokens": 186,
                "trials_with_usage": 1,
            },
            "grader_error_total": 1,
            "final_verdict_totals": {},
            "runtime_status_totals": {},
            "grade_status_totals": {},
            "trials": [],
        }
        rendered = render_markdown(summary)
        self.assertIn("Token usage: 186 total", rendered)
        self.assertIn("Grader errors: 1 (judge infrastructure failures — not skill failures)", rendered)

    def test_render_markdown_omits_grader_error_line_when_zero(self):
        summary = {
            "run_id": "run-001",
            "run_dir": "/tmp/run-001",
            "created_at": "2026-01-01T00:00:00Z",
            "grading_mode": "expectations",
            "total_trials": 0,
            "token_usage": {"total_tokens": 0, "trial_input_tokens": 0, "trial_output_tokens": 0, "judge_input_tokens": 0, "judge_output_tokens": 0, "trials_with_usage": 0},
            "grader_error_total": 0,
            "final_verdict_totals": {},
            "runtime_status_totals": {},
            "grade_status_totals": {},
            "trials": [],
        }
        rendered = render_markdown(summary)
        self.assertNotIn("Grader errors:", rendered)

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

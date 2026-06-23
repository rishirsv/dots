"""Tests for benchmark profiles over evaluator suites."""

import json
import io
import sys
import tempfile
import unittest
from contextlib import redirect_stderr
from pathlib import Path
from types import SimpleNamespace

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.benchmark import benchmark_history, benchmark_lint, build_benchmark_report, render_benchmark_markdown  # noqa: E402
from meta_skill.cli import build_parser  # noqa: E402
from meta_skill.errors import CliError  # noqa: E402
from meta_skill.runner import repetition_count  # noqa: E402
from meta_skill.workbench import init_workbench  # noqa: E402


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


def write_jsonl(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(row, sort_keys=True) + "\n" for row in rows))


class BenchmarkProfileTests(unittest.TestCase):
    def test_workbench_init_defers_benchmark_files_until_needed(self):
        with tempfile.TemporaryDirectory() as tmp:
            target = Path(tmp) / "skill"
            target.mkdir()
            (target / "SKILL.md").write_text(
                """---
name: demo
description: "Use for testing."
---

# Demo
"""
            )

            result = init_workbench(target)

            workbench = Path(result["workbench"])
            self.assertTrue((workbench / "AGENTS.md").is_file())
            self.assertFalse((workbench / "benchmarks").exists())
            self.assertFalse((workbench / "evals.json").exists())

    def test_benchmark_lint_resolves_selection(self):
        with tempfile.TemporaryDirectory() as tmp:
            workbench = Path(tmp) / ".demo"
            suite = workbench / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "defaults": {"runner": "codex_app_server", "repetitions": 1},
                    "candidates": [
                        {"candidate": "no-skill", "source": {"kind": "none"}},
                        {"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}},
                    ],
                    "cases": [
                        {
                            "id": "natural-trigger",
                            "type": "trigger",
                            "task": {"path": "task.md", "seed": "Use the skill."},
                            "expectations": ["Activates the right behavior."],
                        },
                        {
                            "id": "near-miss",
                            "type": "negative_control",
                            "task": {"path": "task.md", "seed": "Do not use the skill."},
                            "expectations": ["Does not activate."],
                        },
                    ],
                },
            )
            profile = workbench / "benchmarks" / "core.json"
            write_json(
                profile,
                {
                    "schema_version": 1,
                    "id": "core",
                    "decision": "Track trigger boundary quality.",
                    "suite": "../evals.json",
                    "task_selection": {"types": ["trigger", "negative_control"]},
                    "candidates": {"baseline": "no-skill", "payloads": ["current"]},
                    "metrics": ["behavior_pass_rate", "unknown_rate"],
                    "integrity": {"run_null_candidate_when_possible": True, "hidden_files_must_not_be_staged": True},
                },
            )

            result = benchmark_lint(str(profile))

            self.assertEqual(result["selected_cases"], ["natural-trigger", "near-miss"])
            self.assertEqual(result["selected_candidates"], ["no-skill", "current"])
            self.assertEqual(result["warnings"], [])

    def test_benchmark_report_and_history_score_selected_profile_slice(self):
        with tempfile.TemporaryDirectory() as tmp:
            workbench = Path(tmp) / ".demo"
            suite = workbench / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "defaults": {"runner": "codex_app_server", "repetitions": 1},
                    "candidates": [
                        {"candidate": "no-skill", "source": {"kind": "none"}},
                        {"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}},
                        {"candidate": "experimental", "source": {"kind": "current_worktree", "ref": "."}},
                    ],
                    "cases": [
                        {"id": "case-a", "type": "capability", "task": {"path": "task.md", "seed": "Task"}},
                        {"id": "case-b", "type": "capability", "task": {"path": "task.md", "seed": "Extra task"}},
                    ],
                },
            )
            profile = workbench / "benchmarks" / "core.json"
            write_json(
                profile,
                {
                    "schema_version": 1,
                    "id": "core",
                    "decision": "Track core quality.",
                    "suite": "../evals.json",
                    "task_selection": {"case_ids": ["case-a"]},
                    "candidates": {"baseline": "no-skill", "payloads": ["current"]},
                    "metrics": ["behavior_pass_rate", "unknown_rate", "comparison_counts", "tokens"],
                    "gates": [{"metric": "quality", "required_label": "pass"}],
                    "calibration": {"human_spot_check": "before release selection"},
                    "report": {"include_history": True, "include_coverage_limits": True},
                },
            )
            run_dir = workbench / "runs" / "run-001"
            write_json(
                run_dir / "run.json",
                {
                    "run_id": "run-001",
                    "suite": str(suite),
                    "runner": "codex_app_server",
                    "created_at": "2026-01-01T00:00:00Z",
                    "benchmark_id": "core",
                    "benchmark_profile": str(profile),
                    "candidates": [
                        {"candidate": "no-skill", "source_kind": "none"},
                        {"candidate": "current", "source_kind": "current_worktree"},
                        {"candidate": "experimental", "source_kind": "current_worktree"},
                    ],
                    "trials": [
                        {"trial_id": "case-a.no-skill.t1", "case_id": "case-a", "candidate": "no-skill", "repetition": 1},
                        {"trial_id": "case-a.current.t1", "case_id": "case-a", "candidate": "current", "repetition": 1},
                        {"trial_id": "case-a.current.t2", "case_id": "case-a", "candidate": "current", "repetition": 2},
                        {"trial_id": "case-b.no-skill.t1", "case_id": "case-b", "candidate": "no-skill", "repetition": 1},
                        {"trial_id": "case-b.current.t1", "case_id": "case-b", "candidate": "current", "repetition": 1},
                        {"trial_id": "case-a.experimental.t1", "case_id": "case-a", "candidate": "experimental", "repetition": 1},
                    ],
                },
            )
            write_jsonl(
                run_dir / "results.jsonl",
                [
                    {"trial_id": "case-a.no-skill.t1", "status": "passed", "usage": {"input_tokens": 10, "output_tokens": 5}},
                    {"trial_id": "case-a.current.t1", "status": "passed", "usage": {"input_tokens": 20, "output_tokens": 10}},
                    {"trial_id": "case-a.current.t2", "status": "passed", "usage": {"input_tokens": 30, "output_tokens": 15}},
                    {"trial_id": "case-b.no-skill.t1", "status": "passed", "usage": {"input_tokens": 1000, "output_tokens": 1000}},
                    {"trial_id": "case-b.current.t1", "status": "passed", "usage": {"input_tokens": 1000, "output_tokens": 1000}},
                    {"trial_id": "case-a.experimental.t1", "status": "passed", "usage": {"input_tokens": 1000, "output_tokens": 1000}},
                ],
            )
            write_jsonl(
                run_dir / "grades.jsonl",
                [
                    {"trial_id": "case-a.no-skill.t1", "grader": {"kind": "model", "id": "judge"}, "metric": "quality", "label": "fail"},
                    {"trial_id": "case-a.current.t1", "grader": {"kind": "model", "id": "judge"}, "metric": "quality", "label": "pass"},
                    {"trial_id": "case-a.current.t2", "grader": {"kind": "model", "id": "judge"}, "metric": "quality", "label": "pass"},
                    {"trial_id": "case-b.no-skill.t1", "grader": {"kind": "model", "id": "judge"}, "metric": "quality", "label": "pass"},
                    {"trial_id": "case-b.current.t1", "grader": {"kind": "model", "id": "judge"}, "metric": "quality", "label": "fail"},
                    {"trial_id": "case-a.experimental.t1", "grader": {"kind": "model", "id": "judge"}, "metric": "quality", "label": "fail"},
                ],
            )
            write_json(
                workbench / "calibrations" / "run-001-all.json",
                {
                    "ok": True,
                    "run_id": "run-001",
                    "metric": None,
                    "summary": {
                        "paired": 2,
                        "exact_agreement_rate": 1.0,
                        "true_positive_rate": 1.0,
                        "true_negative_rate": 1.0,
                    },
                },
            )

            report = build_benchmark_report(str(run_dir))
            history = benchmark_history(str(profile))
            markdown = render_benchmark_markdown(report)

            self.assertEqual(report["benchmark"], "core")
            self.assertEqual(report["scorecard"]["behavior_pass_rate"], 0.6667)
            self.assertEqual(report["scorecard"]["unknown_rate"], 0.0)
            self.assertEqual(report["scorecard"]["trials"], 3)
            self.assertEqual(report["scorecard"]["total_tokens"], 90)
            self.assertEqual(report["scorecard"]["baseline_fail_candidate_pass"], 1)
            self.assertEqual(report["scorecard"]["baseline_pass_candidate_fail"], 0)
            self.assertEqual(report["scorecard"]["profile_gate_failures"], 0)
            self.assertEqual({row["candidate"] for row in report["profile_gates"]}, {"current"})
            self.assertEqual([row["run_id"] for row in report["history"]], ["run-001"])
            self.assertEqual(report["calibration"][0]["paired"], 2)
            self.assertIn("## History", markdown)
            self.assertIn("## Calibration", markdown)
            self.assertNotIn("reliability", report)
            self.assertEqual([row["run_id"] for row in history["runs"]], ["run-001"])

    def test_benchmark_report_requires_profile_for_plain_eval_run(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / ".demo" / "runs" / "run-plain"
            suite = Path(tmp) / ".demo" / "evals.json"
            write_json(
                run_dir / "run.json",
                {
                    "run_id": "run-plain",
                    "suite": str(suite),
                    "runner": "codex_app_server",
                    "created_at": "2026-01-01T00:00:00Z",
                    "candidates": [{"candidate": "current", "source_kind": "current_worktree"}],
                    "trials": [{"trial_id": "case.current.t1", "case_id": "case", "candidate": "current", "repetition": 1}],
                },
            )
            write_jsonl(run_dir / "results.jsonl", [{"trial_id": "case.current.t1", "status": "passed"}])
            write_jsonl(run_dir / "grades.jsonl", [{"trial_id": "case.current.t1", "metric": "quality", "label": "pass"}])

            with self.assertRaises(CliError) as ctx:
                build_benchmark_report(str(run_dir))

            self.assertIn("benchmark report requires a benchmark profile", ctx.exception.message)

    def test_benchmark_lint_warns_on_policy_shape(self):
        with tempfile.TemporaryDirectory() as tmp:
            workbench = Path(tmp) / ".demo"
            suite = workbench / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [
                        {"candidate": "no-skill", "source": {"kind": "none"}},
                        {"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}},
                    ],
                    "cases": [
                        {"id": "case-a", "type": "capability", "task": {"path": "task.md", "seed": "Task"}, "expectations": ["Pass."]}
                    ],
                },
            )
            profile = workbench / "benchmarks" / "core.json"
            write_json(
                profile,
                {
                    "schema_version": 1,
                    "id": "core",
                    "suite": "../evals.json",
                    "task_selection": {"case_ids": ["case-a"]},
                    "candidates": {"baseline": "no-skill", "payloads": ["current"]},
                    "metrics": ["behavior_pass_rate", "unknown_rate"],
                    "gates": [{"required_label": "bad-label", "scope": "elsewhere", "unexpected": True}],
                    "integrity": {"unknown": True},
                    "report": {"extra": True},
                },
            )

            result = benchmark_lint(str(profile))
            warning_kinds = {row["kind"] for row in result["warnings"]}

            self.assertIn("missing_gate_metric", warning_kinds)
            self.assertIn("invalid_gate_label", warning_kinds)
            self.assertIn("invalid_gate_scope", warning_kinds)
            self.assertIn("unknown_gate_key", warning_kinds)
            self.assertIn("unknown_integrity_key", warning_kinds)
            self.assertIn("unknown_report_key", warning_kinds)

    def test_benchmark_repetition_precedence_prefers_type_over_profile_default(self):
        defaults = {"repetitions": 3}
        args = SimpleNamespace(
            repetitions=None,
            repetitions_by_type={"trigger": 5},
            benchmark_default_repetitions=1,
        )

        self.assertEqual(repetition_count({"type": "trigger"}, args, defaults), 5)
        self.assertEqual(repetition_count({"type": "capability"}, args, defaults), 1)

        args.repetitions = 2
        self.assertEqual(repetition_count({"type": "trigger", "repetitions": 7}, args, defaults), 2)

    def test_cli_routes_benchmark_as_top_level_command(self):
        parser = build_parser()

        args = parser.parse_args(["benchmark", "lint", "--benchmark", "profile.json", "--json"])
        self.assertEqual(args.func.__name__, "command_benchmark_lint")

        with redirect_stderr(io.StringIO()):
            with self.assertRaises(SystemExit):
                parser.parse_args(["eval", "benchmark", "lint", "--benchmark", "profile.json"])


if __name__ == "__main__":
    unittest.main()

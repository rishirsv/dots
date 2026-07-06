"""Tests for eval presets over evaluator suites."""

import json
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.cli import build_parser  # noqa: E402
from meta_skill.errors import CliError  # noqa: E402
from meta_skill.presets import apply_preset, build_preset_report, load_preset, preset_history, preset_lint, render_preset_markdown  # noqa: E402
from meta_skill.runner import repetition_count  # noqa: E402
from meta_skill.workbench import init_workbench  # noqa: E402


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


def write_jsonl(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(row, sort_keys=True) + "\n" for row in rows))


class PresetTests(unittest.TestCase):
    def test_workbench_init_defers_preset_files_until_needed(self):
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
            self.assertFalse((workbench / "presets").exists())
            self.assertFalse((workbench / "evals.json").exists())

    def test_preset_lint_resolves_selection(self):
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
                            "task": {"prompt": "Use the skill."},
                            "expectations": ["Activates the right behavior."],
                        },
                        {
                            "id": "near-miss",
                            "type": "negative_control",
                            "task": {"prompt": "Do not use the skill."},
                            "expectations": ["Does not activate."],
                        },
                    ],
                },
            )
            preset = workbench / "presets" / "core.json"
            write_json(
                preset,
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

            result = preset_lint(str(preset))

            self.assertEqual(result["selected_cases"], ["natural-trigger", "near-miss"])
            self.assertEqual(result["selected_candidates"], ["no-skill", "current"])
            self.assertEqual(result["warnings"], [])

    def test_preset_report_and_history_score_selected_slice(self):
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
                        {"id": "case-a", "type": "capability", "task": {"prompt": "Task"}},
                        {"id": "case-b", "type": "capability", "task": {"prompt": "Extra task"}},
                    ],
                },
            )
            preset = workbench / "presets" / "core.json"
            write_json(
                preset,
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
                    "report": {"include_history": True},
                },
            )
            run_dir = workbench / "runs" / "run-001"
            write_json(
                run_dir / "run.json",
                {
                    "run_id": "run-001",
                    "suite": str(suite),
                    "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
                    "created_at": "2026-01-01T00:00:00Z",
                    "preset_id": "core",
                    "preset_path": str(preset),
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
                    {"trial_id": "case-a.no-skill.t1", "runtime_status": "completed", "usage": {"input_tokens": 10, "output_tokens": 5}, "events_path": str(run_dir / "trials" / "case-a.no-skill.t1" / "events.jsonl")},
                    {"trial_id": "case-a.current.t1", "runtime_status": "completed", "usage": {"input_tokens": 20, "output_tokens": 10}, "events_path": str(run_dir / "trials" / "case-a.current.t1" / "events.jsonl")},
                    {"trial_id": "case-a.current.t2", "runtime_status": "completed", "usage": {"input_tokens": 30, "output_tokens": 15}, "events_path": str(run_dir / "trials" / "case-a.current.t2" / "events.jsonl")},
                    {"trial_id": "case-b.no-skill.t1", "runtime_status": "completed", "usage": {"input_tokens": 1000, "output_tokens": 1000}, "events_path": str(run_dir / "trials" / "case-b.no-skill.t1" / "events.jsonl")},
                    {"trial_id": "case-b.current.t1", "runtime_status": "completed", "usage": {"input_tokens": 1000, "output_tokens": 1000}, "events_path": str(run_dir / "trials" / "case-b.current.t1" / "events.jsonl")},
                    {"trial_id": "case-a.experimental.t1", "runtime_status": "completed", "usage": {"input_tokens": 1000, "output_tokens": 1000}, "events_path": str(run_dir / "trials" / "case-a.experimental.t1" / "events.jsonl")},
                ],
            )
            write_jsonl(
                run_dir / "grades.jsonl",
                [
                    {"trial_id": "case-a.no-skill.t1", "grader": {"kind": "model", "id": "judge"}, "metric": "quality", "grade_status": "fail"},
                    {"trial_id": "case-a.current.t1", "grader": {"kind": "model", "id": "judge"}, "metric": "quality", "grade_status": "pass"},
                    {"trial_id": "case-a.current.t2", "grader": {"kind": "model", "id": "judge"}, "metric": "quality", "grade_status": "pass"},
                    {"trial_id": "case-b.no-skill.t1", "grader": {"kind": "model", "id": "judge"}, "metric": "quality", "grade_status": "pass"},
                    {"trial_id": "case-b.current.t1", "grader": {"kind": "model", "id": "judge"}, "metric": "quality", "grade_status": "fail"},
                    {"trial_id": "case-a.experimental.t1", "grader": {"kind": "model", "id": "judge"}, "metric": "quality", "grade_status": "fail"},
                ],
            )
            write_json(
                run_dir / "summary.json",
                {
                    "ok": True,
                    "run_id": "run-001",
                    "run_dir": str(run_dir),
                    "created_at": "2026-01-01T00:00:00Z",
                    "total_trials": 6,
                    "trials": [
                        {"trial_id": "case-a.no-skill.t1", "case_id": "case-a", "candidate": "no-skill", "repetition": 1, "runtime_status": "completed", "grade_statuses": ["fail"], "verdict": "failed"},
                        {"trial_id": "case-a.current.t1", "case_id": "case-a", "candidate": "current", "repetition": 1, "runtime_status": "completed", "grade_statuses": ["pass"], "verdict": "passed"},
                        {"trial_id": "case-a.current.t2", "case_id": "case-a", "candidate": "current", "repetition": 2, "runtime_status": "completed", "grade_statuses": ["pass"], "verdict": "passed"},
                        {"trial_id": "case-b.no-skill.t1", "case_id": "case-b", "candidate": "no-skill", "repetition": 1, "runtime_status": "completed", "grade_statuses": ["pass"], "verdict": "passed"},
                        {"trial_id": "case-b.current.t1", "case_id": "case-b", "candidate": "current", "repetition": 1, "runtime_status": "completed", "grade_statuses": ["fail"], "verdict": "failed"},
                        {"trial_id": "case-a.experimental.t1", "case_id": "case-a", "candidate": "experimental", "repetition": 1, "runtime_status": "completed", "grade_statuses": ["fail"], "verdict": "failed"},
                    ],
                    "runtime_status_totals": {"completed": 6},
                    "grade_status_totals": {"fail": 3, "pass": 3},
                    "final_verdict_totals": {"failed": 3, "passed": 3},
                },
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

            report = build_preset_report(str(run_dir))
            history = preset_history(str(preset))
            markdown = render_preset_markdown(report)

            self.assertEqual(report["preset"], "core")
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

    def test_preset_report_requires_preset_for_plain_eval_run(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / ".demo" / "runs" / "run-plain"
            suite = Path(tmp) / ".demo" / "evals.json"
            write_json(
                run_dir / "run.json",
                {
                    "run_id": "run-plain",
                    "suite": str(suite),
                    "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
                    "created_at": "2026-01-01T00:00:00Z",
                    "candidates": [{"candidate": "current", "source_kind": "current_worktree"}],
                    "trials": [{"trial_id": "case.current.t1", "case_id": "case", "candidate": "current", "repetition": 1}],
                },
            )
            write_jsonl(run_dir / "results.jsonl", [{"trial_id": "case.current.t1", "runtime_status": "completed", "events_path": str(run_dir / "trials" / "case.current.t1" / "events.jsonl")}])
            write_jsonl(run_dir / "grades.jsonl", [{"trial_id": "case.current.t1", "metric": "quality", "grade_status": "pass"}])
            write_json(
                run_dir / "summary.json",
                {
                    "ok": True,
                    "run_id": "run-plain",
                    "run_dir": str(run_dir),
                    "total_trials": 1,
                    "trials": [{"trial_id": "case.current.t1", "case_id": "case", "candidate": "current", "runtime_status": "completed", "grade_statuses": ["pass"], "verdict": "passed"}],
                    "runtime_status_totals": {"completed": 1},
                    "grade_status_totals": {"pass": 1},
                    "final_verdict_totals": {"passed": 1},
                },
            )

            with self.assertRaises(CliError) as ctx:
                build_preset_report(str(run_dir))

            self.assertIn("preset report requires a preset", ctx.exception.message)

    def test_preset_lint_warns_on_policy_shape(self):
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
                        {"id": "case-a", "type": "capability", "task": {"prompt": "Task"}, "expectations": ["Pass."]}
                    ],
                },
            )
            preset = workbench / "presets" / "core.json"
            write_json(
                preset,
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

            result = preset_lint(str(preset))
            warning_kinds = {row["kind"] for row in result["warnings"]}

            self.assertIn("missing_gate_metric", warning_kinds)
            self.assertIn("invalid_gate_label", warning_kinds)
            self.assertIn("invalid_gate_scope", warning_kinds)
            self.assertIn("unknown_gate_key", warning_kinds)
            self.assertIn("unknown_integrity_key", warning_kinds)
            self.assertIn("unknown_report_key", warning_kinds)

    def test_preset_repetition_precedence_prefers_type_over_preset_default(self):
        defaults = {"repetitions": 3}
        args = SimpleNamespace(
            repetitions=None,
            repetitions_by_type={"trigger": 5},
            preset_default_repetitions=1,
        )

        self.assertEqual(repetition_count({"type": "trigger"}, args, defaults), 5)
        self.assertEqual(repetition_count({"type": "capability"}, args, defaults), 1)

        args.repetitions = 2
        self.assertEqual(repetition_count({"type": "trigger", "repetitions": 7}, args, defaults), 2)

    def test_apply_preset_fills_selection_fields(self):
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
                        {"id": "case-a", "type": "capability", "task": {"prompt": "Task"}, "expectations": ["Pass."]},
                    ],
                },
            )
            preset = workbench / "presets" / "core.json"
            write_json(
                preset,
                {
                    "schema_version": 1,
                    "id": "core",
                    "suite": "../evals.json",
                    "task_selection": {"case_ids": ["case-a"]},
                    "candidates": {"baseline": "no-skill", "payloads": ["current"]},
                    "metrics": ["behavior_pass_rate", "unknown_rate"],
                    "repetitions": {"default": 2},
                },
            )

            loaded = load_preset(str(preset))
            args = SimpleNamespace(model=None, no_grade=False)
            apply_preset(args, loaded)

            self.assertEqual(args.case, ["case-a"])
            self.assertEqual(args.candidates, "no-skill,current")
            self.assertEqual(args.preset_default_repetitions, 2)
            self.assertEqual(args.preset, {"id": "core", "path": str(preset.resolve())})

    def test_apply_preset_rejects_unknown_selection(self):
        with tempfile.TemporaryDirectory() as tmp:
            workbench = Path(tmp) / ".demo"
            suite = workbench / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "no-skill", "source": {"kind": "none"}}],
                    "cases": [{"id": "case-a", "type": "capability", "task": {"prompt": "Task"}, "expectations": ["Pass."]}],
                },
            )
            preset = workbench / "presets" / "core.json"
            write_json(
                preset,
                {
                    "schema_version": 1,
                    "id": "core",
                    "suite": "../evals.json",
                    "task_selection": {"case_ids": ["missing-case"]},
                    "candidates": {"baseline": "no-skill"},
                    "metrics": [],
                },
            )

            loaded = load_preset(str(preset))
            args = SimpleNamespace(model=None, no_grade=False)

            with self.assertRaises(CliError) as ctx:
                apply_preset(args, loaded)

            self.assertIn("preset references unknown cases", ctx.exception.message)

    def test_preset_history_filters_by_id_or_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            workbench = Path(tmp) / ".demo"
            suite = workbench / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "no-skill", "source": {"kind": "none"}}],
                    "cases": [{"id": "case-a", "type": "capability", "task": {"prompt": "Task"}}],
                },
            )
            preset = workbench / "presets" / "core.json"
            write_json(
                preset,
                {
                    "schema_version": 1,
                    "id": "core",
                    "suite": "../evals.json",
                    "task_selection": {"case_ids": ["case-a"]},
                    "candidates": {"baseline": "no-skill"},
                    "metrics": [],
                },
            )
            matching_run = workbench / "runs" / "run-match"
            other_run = workbench / "runs" / "run-other"
            for run_dir, preset_fields in (
                (matching_run, {"preset_id": "core", "preset_path": str(preset)}),
                (other_run, {}),
            ):
                write_json(
                    run_dir / "run.json",
                    {
                        "run_id": run_dir.name,
                        "suite": str(suite),
                        "runner_config": {"runner": "codex_app_server", "grading_mode": "expectations"},
                        "created_at": "2026-01-01T00:00:00Z",
                        "candidates": [],
                        "trials": [],
                        **preset_fields,
                    },
                )
                write_json(
                    run_dir / "summary.json",
                    {
                        "ok": True,
                        "run_id": run_dir.name,
                        "run_dir": str(run_dir),
                        "total_trials": 0,
                        "trials": [],
                        "runtime_status_totals": {},
                        "grade_status_totals": {},
                        "final_verdict_totals": {},
                    },
                )

            history = preset_history(str(preset))

            self.assertEqual([row["run_id"] for row in history["runs"]], ["run-match"])

    def test_cli_has_no_benchmark_group_and_exposes_preset_flags(self):
        parser = build_parser()

        with self.assertRaises(SystemExit):
            parser.parse_args(["benchmark", "lint", "--json"])

        run_args = parser.parse_args(["eval", "run", "--preset", "release", "--json"])
        self.assertEqual(run_args.func.__name__, "command_eval_run")
        self.assertEqual(run_args.preset, "release")

        list_args = parser.parse_args(["eval", "list", "--preset", "release"])
        self.assertEqual(list_args.preset, "release")

        check_args = parser.parse_args(["eval", "run", "--preset", "release", "--check", "--json"])
        self.assertEqual(check_args.preset, "release")
        self.assertTrue(check_args.check)

        report_args = parser.parse_args(["eval", "report", "--run", "run-001", "--preset", "presets/release.json"])
        self.assertEqual(report_args.preset, "presets/release.json")


if __name__ == "__main__":
    unittest.main()

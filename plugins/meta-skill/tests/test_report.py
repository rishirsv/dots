"""Canonical read-model and report tests."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.errors import CliError
from meta_skill.report import (
    build_report,
    judge_annotation_context,
    list_runs,
    render_markdown,
    write_report,
)


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n")


def jsonl(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(row) + "\n" for row in rows))


def fixture(root):
    skill = root / "skill"
    skill.mkdir(parents=True, exist_ok=True)
    (skill / "SKILL.md").write_text('---\nname: demo\ndescription: "Use for report tests."\n---\n')
    run = skill / ".demo" / "runs" / "run-1"
    candidates = [{"candidate": "no-skill", "source_kind": "none"}, {"candidate": "current", "source_kind": "current_worktree"}]
    trials = [{"trial_id": f"a.{candidate}.t1", "eval_id": "a", "candidate": candidate, "repetition": 1} for candidate in ("no-skill", "current")]
    write(run / "run.json", {
        "schema_version": 2,
        "run_id": "run-1",
        "skill_id": "demo",
        "objective": "Compare current with baseline",
        "runner": {"grading": True},
        "task_executor": {"kind": "native_subagent", "provenance": "inherited"},
        "judge_executor": {"kind": "codex_exec", "provenance": "requested"},
        "baseline_candidate": "no-skill",
        "candidates": candidates,
        "trials": trials,
    })
    write(run / "inputs" / "suite.json", {"schema_version": 2, "evals": [{"id": "a", "type": "capability", "priority": "high", "prompt": {"path": "task.md"}}]})
    for candidate, label in (("no-skill", "fail"), ("current", "pass")):
        trial = run / "trials" / f"a.{candidate}.t1"
        write(trial / "state.json", {"trial_id": f"a.{candidate}.t1", "eval_id": "a", "candidate": candidate, "repetition": 1, "status": "completed", "usage": {"total_tokens": 3}})
        (trial / "response.md").write_text(candidate)
        (trial / "events.jsonl").write_text("")
        checks = [{"name": "quality", "label": "fail", "evidence": "missing exact result"}] if label == "fail" else []
        jsonl(trial / "grades.jsonl", [{"trial_id": f"a.{candidate}.t1", "metric": "quality", "grader": {"kind": "model", "id": "judge"}, "grade_status": label, "rationale": label, "checks": checks}])
    return run


class ReportTests(unittest.TestCase):
    def test_delta_failed_evidence_and_markdown_share_one_model(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = fixture(Path(tmp))
            report = build_report(str(run))
            self.assertEqual(report["delta_totals"], {"improved": 1})
            self.assertEqual(report["comparisons"][0]["delta"], "improved")
            summaries = {row["candidate"]: row for row in report["candidate_summaries"]}
            self.assertEqual(summaries["no-skill"]["pass_rate"], 0)
            self.assertEqual(summaries["current"]["pass_rate"], 1)
            self.assertEqual(summaries["current"]["pass_rate_delta"], 1)
            self.assertIsNone(summaries["current"]["improvement_multiplier"])
            self.assertEqual(report["trials"][0]["failed_checks"][0]["evidence"], "missing exact result")
            self.assertEqual(report["cases"][0]["eval_id"], "a")
            self.assertEqual(
                [version["candidate"] for version in report["cases"][0]["versions"]],
                ["no-skill", "current"],
            )
            self.assertEqual(report["cases"][0]["versions"][0]["verdict"], "failed")
            self.assertEqual(report["cases"][0]["versions"][1]["verdict"], "passed")
            markdown = render_markdown(report)
            self.assertIn("**Version delta:** 1 improved", markdown)
            self.assertIn("## Summary", markdown)
            self.assertIn("## Criteria evidence", markdown)
            self.assertIn("100.0%", markdown)
            self.assertIn("+100.0 pp", markdown)
            self.assertIn("missing exact result", markdown)
            path = write_report(report)
            self.assertEqual(path.name, "demo-evaluation.md")
            self.assertEqual(path.read_text(), markdown)

    def test_case_matrix_uses_inconclusive_and_markdown_includes_feedback(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = fixture(Path(tmp))
            suite_path = run / "inputs" / "suite.json"
            suite = json.loads(suite_path.read_text())
            suite["evals"][0]["expectations"] = ["Meet the requirement"]
            suite["evals"][0]["graders"] = [
                {"kind": "model", "id": "judge", "metric": "quality"}
            ]
            write(suite_path, suite)
            grades = run / "trials" / "a.current.t1" / "grades.jsonl"
            jsonl(
                grades,
                [{
                    "trial_id": "a.current.t1",
                    "metric": "quality",
                    "grader": {"kind": "model", "id": "judge"},
                    "grade_status": "partial",
                    "rationale": "localized miss",
                    "checks": [{"name": "quality", "label": "partial", "evidence": "one issue"}],
                }],
            )
            write(
                run / "trials" / "a.current.t1" / "review.json",
                {"annotations": [{"artifact": "response", "tag": "one-off", "note": "Make this clearer"}]},
            )
            report = build_report(str(run))
            current = next(row for row in report["cases"][0]["versions"] if row["candidate"] == "current")
            self.assertEqual(current["verdict"], "inconclusive")
            markdown = render_markdown(report)
            self.assertIn("Make this clearer", markdown)
            self.assertIn("a.current.t1", markdown)

    def test_model_human_disagreement_is_counted(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = fixture(Path(tmp))
            path = run / "trials" / "a.current.t1" / "grades.jsonl"
            with path.open("a") as handle:
                handle.write(json.dumps({"trial_id": "a.current.t1", "metric": "quality", "grader": {"kind": "human", "id": "human"}, "grade_status": "fail", "rationale": "evidence"}) + "\n")
            self.assertEqual(build_report(str(run))["review"]["disagreements"], 1)

    def test_run_is_not_terminal_until_automatic_grading_finishes(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = fixture(Path(tmp))
            suite_path = run / "inputs" / "suite.json"
            suite = json.loads(suite_path.read_text())
            suite["evals"][0]["expectations"] = ["Meet the requirement"]
            suite["evals"][0]["graders"] = [
                {"kind": "model", "id": "judge", "metric": "quality"}
            ]
            write(suite_path, suite)
            grades = run / "trials" / "a.current.t1" / "grades.jsonl"
            grades.write_text("")
            pending = build_report(str(run))
            self.assertTrue(pending["runtime_terminal"])
            self.assertFalse(pending["grading_complete"])
            self.assertFalse(pending["terminal"])
            jsonl(
                grades,
                [{
                    "trial_id": "a.current.t1",
                    "metric": "quality",
                    "grader": {"kind": "model", "id": "judge"},
                    "grade_status": "pass",
                    "rationale": "graded",
                }],
            )
            complete = build_report(str(run))
            self.assertTrue(complete["grading_complete"])
            self.assertTrue(complete["terminal"])

    def test_explicit_non_none_baseline_drives_candidate_comparison(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = fixture(Path(tmp))
            model = json.loads((run / "run.json").read_text())
            model["baseline_candidate"] = "current"
            write(run / "run.json", model)
            report = build_report(str(run))
            self.assertEqual(report["comparisons"][0]["baseline"], "current")
            self.assertEqual(report["comparisons"][0]["candidate"], "no-skill")
            self.assertEqual(report["comparisons"][0]["delta"], "regressed")

    def test_equal_passes_do_not_claim_uplift(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = fixture(Path(tmp))
            baseline_grades = run / "trials" / "a.no-skill.t1" / "grades.jsonl"
            jsonl(
                baseline_grades,
                [{
                    "trial_id": "a.no-skill.t1",
                    "metric": "quality",
                    "grader": {"kind": "model", "id": "judge"},
                    "grade_status": "pass",
                    "rationale": "passed",
                }],
            )
            report = build_report(str(run))
            self.assertEqual(
                report["comparisons"][0]["delta"], "no_uplift_demonstrated"
            )
            current = next(
                row for row in report["candidate_summaries"] if row["candidate"] == "current"
            )
            self.assertEqual(current["pass_rate_delta"], 0)
            self.assertEqual(current["improvement_multiplier"], 1)
            self.assertIn("1 no uplift demonstrated", render_markdown(report))

    def test_equal_failures_are_inconclusive(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = fixture(Path(tmp))
            current_grades = run / "trials" / "a.current.t1" / "grades.jsonl"
            jsonl(
                current_grades,
                [{
                    "trial_id": "a.current.t1",
                    "metric": "quality",
                    "grader": {"kind": "model", "id": "judge"},
                    "grade_status": "fail",
                    "rationale": "failed",
                }],
            )
            report = build_report(str(run))
            self.assertEqual(report["comparisons"][0]["delta"], "inconclusive")
            self.assertIn("1 inconclusive", render_markdown(report))

    def test_list_runs_uses_live_artifacts_and_rejects_old_layout(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            run = fixture(root)
            suite = root / "skill" / ".demo" / "evals" / "evals.json"
            suite.parent.mkdir(parents=True, exist_ok=True)
            suite.write_text('{"schema_version":2,"evals":[]}')
            listed = list_runs(str(suite))["runs"]
            self.assertEqual(listed[0]["delta_totals"], {"improved": 1})
            write(run / "run.json", {"schema_version": 1, "run_id": "run-1"})
            with self.assertRaises(CliError):
                build_report(str(run))

    def test_executor_provenance_requires_and_preserves_canonical_schema(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = fixture(Path(tmp))
            model = json.loads((run / "run.json").read_text())
            model.pop("task_executor")
            write(run / "run.json", model)
            with self.assertRaisesRegex(CliError, "canonical task_executor"):
                build_report(str(run))
            model["task_executor"] = {
                "kind": "native_subagent",
                "requested_model": "gpt-5.6-terra",
                "requested_reasoning": "medium",
                "observed_model": "gpt-5.6-terra",
                "provenance": "observed",
            }
            write(run / "run.json", model)
            current = build_report(str(run))
            self.assertEqual(current["task_executor"]["kind"], "native_subagent")
            self.assertEqual(current["task_executor"]["provenance"], "observed")

    def test_judge_annotation_context_is_explicit_opt_in_with_stable_legacy_ids(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = fixture(Path(tmp))
            review_path = run / "trials" / "a.current.t1" / "review.json"
            write(
                review_path,
                {
                    "annotations": [
                        {"artifact": "response", "tag": "one-off", "note": "private note"},
                        {
                            "artifact": "response",
                            "tag": "taste-rule",
                            "note": "Prefer concise answers",
                            "judge_use": "rubric",
                        },
                    ]
                },
            )
            first = judge_annotation_context(str(run))
            second = judge_annotation_context(str(run))
            self.assertEqual(first, second)
            self.assertEqual(len(first), 1)
            self.assertEqual(first[0]["judge_use"], "rubric")
            self.assertTrue(first[0]["annotation_id"].startswith("legacy-"))
            report = build_report(str(run))
            annotations = report["trials"][1]["review"]["annotations"]
            self.assertEqual(annotations[0]["judge_use"], "exclude")


if __name__ == "__main__":
    unittest.main()

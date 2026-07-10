"""Canonical read-model and report tests."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.errors import CliError
from meta_skill.report import build_report, list_runs, render_markdown, write_report


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n")


def jsonl(path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(row) + "\n" for row in rows))


def fixture(root):
    skill = root / "demo"
    skill.mkdir(parents=True, exist_ok=True)
    (skill / "SKILL.md").write_text('---\nname: demo\ndescription: "Use for report tests."\n---\n')
    run = skill / ".metaskill" / "runs" / "demo" / "run-1"
    candidates = [{"candidate": "no-skill", "source_kind": "none"}, {"candidate": "current", "source_kind": "current_worktree"}]
    trials = [{"trial_id": f"a.{candidate}.t1", "eval_id": "a", "candidate": candidate, "repetition": 1} for candidate in ("no-skill", "current")]
    write(run / "run.json", {"schema_version": 2, "run_id": "run-1", "skill_id": "demo", "objective": "Compare current with baseline", "runner": {"grading": True}, "baseline_candidate": "no-skill", "candidates": candidates, "trials": trials})
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
            self.assertEqual(report["trials"][0]["failed_checks"][0]["evidence"], "missing exact result")
            markdown = render_markdown(report)
            self.assertIn("**Candidate delta:** 1 improved", markdown)
            self.assertIn("missing exact result", markdown)
            path = write_report(report)
            self.assertEqual(path.read_text(), markdown)

    def test_model_human_disagreement_is_counted(self):
        with tempfile.TemporaryDirectory() as tmp:
            run = fixture(Path(tmp))
            path = run / "trials" / "a.current.t1" / "grades.jsonl"
            with path.open("a") as handle:
                handle.write(json.dumps({"trial_id": "a.current.t1", "metric": "quality", "grader": {"kind": "human", "id": "human"}, "grade_status": "fail", "rationale": "evidence"}) + "\n")
            self.assertEqual(build_report(str(run))["review"]["disagreements"], 1)

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

    def test_list_runs_uses_live_artifacts_and_rejects_old_layout(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            run = fixture(root)
            suite = root / "demo" / "evals" / "evals.json"
            suite.parent.mkdir(parents=True, exist_ok=True)
            suite.write_text('{"schema_version":2,"evals":[]}')
            listed = list_runs(str(suite))["runs"]
            self.assertEqual(listed[0]["delta_totals"], {"improved": 1})
            write(run / "run.json", {"schema_version": 1, "run_id": "run-1"})
            with self.assertRaises(CliError):
                build_report(str(run))


if __name__ == "__main__":
    unittest.main()

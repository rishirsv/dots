"""End-to-end run-layout contract tests with a fake App Server."""

import json
import sys
import tempfile
import time
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.errors import CliError
from meta_skill.runner import run_eval
from meta_skill.workbench_paths import worktrees_path


def skill(path):
    path.mkdir(parents=True, exist_ok=True)
    (path / "SKILL.md").write_text('---\nname: demo\ndescription: "Use when testing runs; not for production."\n---\n\n# Demo\n')


def suite(path, evals):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"schema_version": 2, "skill_name": "demo", "target": {"type": "skill", "ref": "SKILL.md"}, "evals": evals}))


def args(path, **values):
    defaults = dict(suite=str(path), candidates=None, split=None, case=None, type=None, repetitions=None,
                    repetitions_by_type={}, profile_default_repetitions=None, model="test-model", parallel=1,
                    timeout=5, no_baseline=False, no_grade=True, adhoc=False, task=None, skill=None, profile=None)
    defaults.update(values)
    return SimpleNamespace(**defaults)


class RunnerTests(unittest.TestCase):
    def test_baseline_default_single_candidate_snapshot_and_ephemeral_workspaces(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            skill(project)
            manifest = project / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Do A", "expected_output": "A"}])

            def fake(row, prompt, candidate, events, response, model):
                self.assertEqual(prompt, "Do A\n")
                Path(events).write_text('{"method":"done"}\n')
                Path(response).write_text("A")
                (Path(candidate["cwd"]) / "made.txt").write_text(row["trial_id"])
                return {"status": "completed", "usage": {"input_tokens": 1, "output_tokens": 1, "total_tokens": 2}}

            with patch("meta_skill.runner.app_server_run", side_effect=fake):
                result = run_eval(args(manifest))
            run = Path(result["run_dir"])
            self.assertEqual(result["trials"], 2)
            self.assertEqual({path.parent.name for path in (run / "trials").glob("*/state.json")}, {"a.no-skill.t1", "a.current.t1"})
            self.assertTrue((run / "inputs" / "candidates" / "current" / "payload" / "SKILL.md").is_file())
            self.assertEqual(len(list((run / "inputs" / "candidates" / "current").rglob("SKILL.md"))), 1)
            self.assertFalse((worktrees_path(project) / result["run_id"]).exists())
            self.assertFalse((run / "results.jsonl").exists())
            self.assertFalse((run / "summary.json").exists())
            self.assertTrue((run / "trials" / "a.current.t1" / "artifacts" / "made.txt").is_file())
            self.assertTrue((run / "report.md").is_file())

    def test_no_baseline_opt_out_and_missing_grading_evidence(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            skill(project)
            manifest = project / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Do A"}])
            with self.assertRaises(CliError):
                run_eval(args(manifest, no_grade=False, no_baseline=True))

    def test_deadline_marks_trial_timed_out_without_app_server_edits(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            skill(project)
            manifest = project / "evals" / "evals.json"
            suite(manifest, [{"id": "a", "type": "capability", "prompt": "Wait"}])

            def slow(_row, _prompt, _candidate, _events, response, _model):
                time.sleep(.05)
                try:
                    Path(response).write_text("late response")
                except FileNotFoundError:
                    pass
                return {"status": "completed"}

            with patch("meta_skill.runner.app_server_run", side_effect=slow):
                result = run_eval(args(manifest, no_baseline=True, timeout=.01))
            state = json.loads((Path(result["run_dir"]) / "trials" / "a.current.t1" / "state.json").read_text())
            self.assertEqual(state["status"], "timed_out")
            self.assertEqual(result["trials"], 1)
            self.assertFalse(result["ok"])
            time.sleep(.08)
            self.assertFalse((worktrees_path(project) / result["run_id"]).exists())
            self.assertEqual((Path(result["run_dir"]) / "trials" / "a.current.t1" / "response.md").read_text(), "")


if __name__ == "__main__":
    unittest.main()

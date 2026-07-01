"""Tests for frozen eval specs and trial workspace staging."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.errors import CliError  # noqa: E402
from meta_skill.resolved_suite import freeze_eval_spec  # noqa: E402
from meta_skill.staging import stage_workspace  # noqa: E402


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


class ResolvedSuiteTests(unittest.TestCase):
    def test_hidden_grader_support_is_frozen_but_not_staged(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            workbench = project / ".demo"
            case_root = workbench / "cases" / "case-a"
            case_root.mkdir(parents=True)
            (case_root / "task.md").write_text("Visible task.\n")
            (case_root / "judge.md").write_text("Hidden judge guidance.\n")
            (case_root / "expected.txt").write_text("Hidden expected output.\n")
            (case_root / "input.txt").write_text("visible fixture\n")
            suite = workbench / "evals.json"
            write_json(suite, {"schema_version": 1})
            run_dir = workbench / "runs" / "run-001"
            case = {
                "id": "case-a",
                "type": "capability",
                "task": {"path": "task.md"},
                "fixtures": ["input.txt"],
                "expectations": ["Do the task."],
            }

            frozen = freeze_eval_spec(
                {"target": {"type": "skill", "ref": "SKILL.md"}},
                suite,
                workbench,
                run_dir,
                [case],
                [{"candidate": "current"}],
            )
            frozen_case = dict(frozen["cases"][0])
            frozen_case["case_root"] = str(run_dir / "eval-spec" / "cases" / "case-a")
            staged = stage_workspace(run_dir, "case-a.current.t1", frozen_case, {"candidate": "current"})
            workspace = Path(staged["workspace"])

            self.assertTrue((run_dir / "eval-spec" / "cases" / "case-a" / "judge.md").exists())
            self.assertTrue((run_dir / "eval-spec" / "cases" / "case-a" / "expected.txt").exists())
            self.assertTrue((workspace / "task.md").exists())
            self.assertTrue((workspace / "fixtures" / "input.txt").exists())
            self.assertFalse((workspace / "judge.md").exists())
            self.assertFalse((workspace / "expected.txt").exists())

    def test_symlinked_fixture_is_rejected_before_freezing(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            workbench = project / ".demo"
            case_root = workbench / "cases" / "case-a"
            case_root.mkdir(parents=True)
            (case_root / "task.md").write_text("Visible task.\n")
            (case_root / "judge.md").write_text("Hidden judge guidance.\n")
            (case_root / "leak.txt").symlink_to("judge.md")
            suite = workbench / "evals.json"
            write_json(suite, {"schema_version": 1})

            case = {
                "id": "case-a",
                "type": "capability",
                "task": {"path": "task.md"},
                "fixtures": ["leak.txt"],
                "expectations": ["Do the task."],
            }

            with self.assertRaises(CliError) as ctx:
                freeze_eval_spec(
                    {"target": {"type": "skill", "ref": "SKILL.md"}},
                    suite,
                    workbench,
                    workbench / "runs" / "run-001",
                    [case],
                    [{"candidate": "current"}],
                )

            self.assertIn("support file path must not be a symlink", ctx.exception.message)

    def test_fixture_directory_symlink_is_rejected_before_freezing(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            workbench = project / ".demo"
            case_root = workbench / "cases" / "case-a"
            fixture_root = case_root / "fixtures"
            fixture_root.mkdir(parents=True)
            (case_root / "task.md").write_text("Visible task.\n")
            (case_root / "judge.md").write_text("Hidden judge guidance.\n")
            (fixture_root / "leak.txt").symlink_to("../judge.md")
            suite = workbench / "evals.json"
            write_json(suite, {"schema_version": 1})
            case = {
                "id": "case-a",
                "type": "capability",
                "task": {"path": "task.md"},
                "fixtures": ["fixtures"],
                "expectations": ["Do the task."],
            }

            with self.assertRaises(CliError) as ctx:
                freeze_eval_spec(
                    {"target": {"type": "skill", "ref": "SKILL.md"}},
                    suite,
                    workbench,
                    workbench / "runs" / "run-001",
                    [case],
                    [{"candidate": "current"}],
                )

            self.assertIn("support file path must not contain symlinks", ctx.exception.message)

    def test_symlinked_fixture_directory_path_is_rejected_before_freezing(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            workbench = project / ".demo"
            case_root = workbench / "cases" / "case-a"
            real_fixture_root = case_root / "visible-fixtures"
            real_fixture_root.mkdir(parents=True)
            (real_fixture_root / "input.txt").write_text("visible\n")
            (case_root / "task.md").write_text("Visible task.\n")
            (case_root / "fixture-link").symlink_to("visible-fixtures")
            suite = workbench / "evals.json"
            write_json(suite, {"schema_version": 1})
            case = {
                "id": "case-a",
                "type": "capability",
                "task": {"path": "task.md"},
                "fixtures": ["fixture-link"],
                "expectations": ["Do the task."],
            }

            with self.assertRaises(CliError) as ctx:
                freeze_eval_spec(
                    {"target": {"type": "skill", "ref": "SKILL.md"}},
                    suite,
                    workbench,
                    workbench / "runs" / "run-001",
                    [case],
                    [{"candidate": "current"}],
                )

            self.assertIn("support file path must not be a symlink", ctx.exception.message)

    def test_missing_path_task_errors_when_freezing(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp)
            workbench = project / ".demo"
            (workbench / "cases" / "case-a").mkdir(parents=True)
            suite = workbench / "evals.json"
            write_json(suite, {"schema_version": 1})
            case = {
                "id": "case-a",
                "type": "capability",
                "task": {"path": "task.md"},
                "expectations": ["Do the task."],
            }

            with self.assertRaises(CliError) as ctx:
                freeze_eval_spec(
                    {"target": {"type": "skill", "ref": "SKILL.md"}},
                    suite,
                    workbench,
                    workbench / "runs" / "run-001",
                    [case],
                    [{"candidate": "current"}],
                )

            self.assertIn("task file missing for case case-a", ctx.exception.message)


if __name__ == "__main__":
    unittest.main()

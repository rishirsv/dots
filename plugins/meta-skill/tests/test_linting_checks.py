"""Tests for eval manifest lint checks."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.errors import CliError  # noqa: E402
from meta_skill.linting import FATAL_SUITE_WARNINGS, lint_suite  # noqa: E402


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


def warning_kinds(result):
    return {row["kind"] for row in result["warnings"]}


class LintingChecksTests(unittest.TestCase):
    def test_hidden_metadata_in_task_warns_and_is_fatal_kind(self):
        with tempfile.TemporaryDirectory() as tmp:
            workbench = Path(tmp) / ".demo"
            suite = workbench / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "cases": [
                        {
                            "id": "case-a",
                            "type": "capability",
                            "task": {"path": "task.md"},
                            "expectations": ["Pass."],
                        }
                    ],
                },
            )
            task = workbench / "cases" / "case-a" / "task.md"
            task.parent.mkdir(parents=True)
            task.write_text("---\nsecret: true\n---\nVisible task.\n")

            result = lint_suite(str(suite))

            self.assertIn("hidden_metadata_in_task", warning_kinds(result))
            self.assertEqual(FATAL_SUITE_WARNINGS, {"hidden_metadata_in_task"})

    def test_normal_task_file_does_not_warn_for_hidden_metadata(self):
        with tempfile.TemporaryDirectory() as tmp:
            workbench = Path(tmp) / ".demo"
            suite = workbench / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "cases": [
                        {
                            "id": "case-a",
                            "type": "capability",
                            "task": {"path": "task.md"},
                            "expectations": ["Pass."],
                        }
                    ],
                },
            )
            task = workbench / "cases" / "case-a" / "task.md"
            task.parent.mkdir(parents=True)
            task.write_text("Visible task.\n---\nThis is not front matter.\n")

            result = lint_suite(str(suite))

            self.assertNotIn("hidden_metadata_in_task", warning_kinds(result))

    def test_all_graders_advisory_warns(self):
        with tempfile.TemporaryDirectory() as tmp:
            suite = Path(tmp) / ".demo" / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "cases": [
                        {
                            "id": "case-a",
                            "type": "capability",
                            "task": {"prompt": "Task"},
                            "graders": [
                                {"kind": "model", "id": "a", "advisory": True},
                                {"kind": "human", "id": "b", "metric": "quality", "advisory": True},
                            ],
                        }
                    ],
                },
            )

            result = lint_suite(str(suite))

            self.assertIn("all_graders_advisory", warning_kinds(result))

    def test_removed_task_type_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            suite = Path(tmp) / ".demo" / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "cases": [
                        {"id": "case-a", "type": "implicit_trigger", "task": {"prompt": "Task"}, "expectations": ["Pass."]},
                    ],
                },
            )

            with self.assertRaises(CliError) as ctx:
                lint_suite(str(suite))

            self.assertIn("implicit_trigger is no longer supported; use trigger", ctx.exception.message)


if __name__ == "__main__":
    unittest.main()

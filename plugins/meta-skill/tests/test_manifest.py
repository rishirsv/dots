"""Tests for the current eval manifest authoring contract."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.manifest import case_task_info, load_manifest  # noqa: E402
from meta_skill.errors import CliError  # noqa: E402


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


class ManifestTests(unittest.TestCase):
    def test_legacy_eval_rows_are_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            suite = Path(tmp) / ".demo" / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "evals": [
                        {
                            "id": "case-a",
                            "type": "capability",
                            "prompt": "Say done.",
                            "fixtures": ["input.txt"],
                            "expectations": ["The response says done."],
                        }
                    ],
                },
            )

            with self.assertRaises(CliError) as ctx:
                load_manifest(suite)

            self.assertIn("legacy evals[]", ctx.exception.message)

    def test_path_task_seed_is_rejected(self):
        case = {"id": "case-a", "task": {"path": "task.md", "seed": "Seed text."}}

        with tempfile.TemporaryDirectory() as tmp:
            suite = Path(tmp) / ".demo" / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "cases": [case],
                },
            )

            with self.assertRaises(CliError) as ctx:
                load_manifest(suite)

            self.assertIn("task.seed is no longer supported", ctx.exception.message)

    def test_task_file_is_rejected(self):
        case = {"id": "case-a", "task": {"file": "task.md"}}

        with tempfile.TemporaryDirectory() as tmp:
            suite = Path(tmp) / ".demo" / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "cases": [case],
                },
            )

            with self.assertRaises(CliError) as ctx:
                load_manifest(suite)

            self.assertIn("task.file is no longer supported", ctx.exception.message)

    def test_custom_task_path_is_rejected(self):
        case = {"id": "case-a", "task": {"path": "tasks/foo.md"}}

        with tempfile.TemporaryDirectory() as tmp:
            suite = Path(tmp) / ".demo" / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "cases": [case],
                },
            )

            with self.assertRaises(CliError) as ctx:
                load_manifest(suite)

            self.assertIn("task.path must be task.md", ctx.exception.message)

    def test_case_task_info_has_no_seed_field(self):
        case = {"id": "case-a", "task": {"path": "task.md"}}

        self.assertEqual(case_task_info(case), {"source": "path", "path": "task.md", "prompt": None})

    def test_grader_policy_flags_must_be_boolean(self):
        for flag in ("advisory", "gate", "required"):
            with self.subTest(flag=flag):
                case = {
                    "id": "case-a",
                    "task": {"prompt": "Task"},
                    "graders": [{"kind": "model", "id": "judge", flag: "yes"}],
                }

                with tempfile.TemporaryDirectory() as tmp:
                    suite = Path(tmp) / ".demo" / "evals.json"
                    write_json(
                        suite,
                        {
                            "schema_version": 1,
                            "target": {"type": "skill", "ref": "SKILL.md"},
                            "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                            "cases": [case],
                        },
                    )

                    with self.assertRaises(CliError) as ctx:
                        load_manifest(suite)

                    self.assertIn(f"grader {flag} must be boolean", ctx.exception.message)

if __name__ == "__main__":
    unittest.main()

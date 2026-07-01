"""Tests for the current eval manifest authoring contract."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.manifest import case_task_info, load_manifest  # noqa: E402
from meta_skill.workbench import materialize_cases  # noqa: E402
from meta_skill.errors import CliError  # noqa: E402


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")


class ManifestTests(unittest.TestCase):
    def test_legacy_eval_rows_are_ignored(self):
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

            manifest = load_manifest(suite)

            self.assertEqual(manifest.get("cases", []), [])

    def test_path_task_seed_is_ignored_alongside_path(self):
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

            manifest = load_manifest(suite)

            self.assertEqual(manifest["cases"][0]["task"]["path"], "task.md")

    def test_case_task_info_has_no_seed_field(self):
        case = {"id": "case-a", "task": {"path": "task.md"}}

        self.assertEqual(case_task_info(case), {"source": "path", "path": "task.md", "prompt": None})

    def test_materialize_cases_writes_default_path_task_stub(self):
        with tempfile.TemporaryDirectory() as tmp:
            workbench = Path(tmp) / ".demo"
            suite = workbench / "evals.json"
            write_json(
                suite,
                {
                    "schema_version": 1,
                    "target": {"type": "skill", "ref": "SKILL.md"},
                    "candidates": [{"candidate": "current", "source": {"kind": "current_worktree", "ref": "."}}],
                    "cases": [{"id": "case-a", "task": {"path": "task.md"}}],
                },
            )

            materialize_cases(str(suite))

            self.assertEqual((workbench / "cases" / "case-a" / "task.md").read_text(), "TODO: author the visible task for this case.\n")


if __name__ == "__main__":
    unittest.main()

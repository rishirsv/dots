"""Schema-v2 manifest contract tests."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.errors import CliError
from meta_skill.manifest import load_manifest, select_candidates, select_cases


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data))


class ManifestTests(unittest.TestCase):
    def test_loads_anthropic_compatible_rows_and_injects_default_candidates(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            write(path, {"schema_version": 2, "evals": [{"id": "a", "type": "capability", "prompt": "Do A", "expected_output": "A", "expectations": ["A is done"]}]})
            manifest = load_manifest(path)
            self.assertEqual(manifest["evals"][0]["prompt"], "Do A")
            self.assertEqual([row["candidate"] for row in manifest["candidates"]], ["no-skill", "current"])

    def test_legacy_cases_fail_clearly(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            write(path, {"schema_version": 2, "cases": [], "evals": []})
            with self.assertRaises(CliError) as caught:
                load_manifest(path)
            self.assertIn("legacy cases[]", caught.exception.message)

    def test_prompt_path_is_only_task_md(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            write(path, {"schema_version": 2, "evals": [{"id": "a", "prompt": {"path": "other.md"}}]})
            with self.assertRaises(CliError) as caught:
                load_manifest(path)
            self.assertIn("must be task.md", caught.exception.message)

    def test_attached_replaces_trigger_and_grader_policy_is_typed(self):
        for case in (
            {"id": "a", "type": "trigger", "prompt": "A"},
            {"id": "a", "type": "attached", "prompt": "A", "graders": [{"kind": "model", "advisory": "yes"}]},
        ):
            with self.subTest(case=case), tempfile.TemporaryDirectory() as tmp:
                path = Path(tmp) / "evals.json"
                write(path, {"schema_version": 2, "evals": [case]})
                with self.assertRaises(CliError):
                    load_manifest(path)

    def test_baseline_is_default_and_opt_out_is_exact(self):
        manifest = {"candidates": [{"candidate": "current", "source": {"kind": "current_worktree"}}]}
        self.assertEqual([row["candidate"] for row in select_candidates(manifest)], ["no-skill", "current"])
        self.assertEqual([row["candidate"] for row in select_candidates(manifest, include_baseline=False)], ["current"])

    def test_priority_objective_and_explicit_baseline_are_validated(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            write(
                path,
                {
                    "schema_version": 2,
                    "objective": "Compare revisions",
                    "candidates": [
                        {"candidate": "current", "source": {"kind": "current_worktree"}},
                        {"candidate": "candidate", "source": {"kind": "local_path", "path": "../candidate"}},
                    ],
                    "evals": [{"id": "a", "type": "regression", "priority": "high", "prompt": "A"}],
                },
            )
            manifest = load_manifest(path)
            selected = select_candidates(
                manifest, "candidate", baseline_id="current"
            )
            self.assertEqual([row["candidate"] for row in selected], ["current", "candidate"])
            with self.assertRaises(CliError):
                select_cases(manifest, case_ids=["missing"])
            with self.assertRaises(CliError):
                select_candidates(manifest, "missing", include_baseline=False)

    def test_reserved_no_skill_id_and_invalid_priority_fail(self):
        for data in (
            {
                "schema_version": 2,
                "candidates": [{"candidate": "no-skill", "source": {"kind": "current_worktree"}}],
                "evals": [{"id": "a", "prompt": "A"}],
            },
            {"schema_version": 2, "evals": [{"id": "a", "prompt": "A", "priority": "urgent"}]},
        ):
            with self.subTest(data=data), tempfile.TemporaryDirectory() as tmp:
                path = Path(tmp) / "evals.json"
                write(path, data)
                with self.assertRaises(CliError):
                    load_manifest(path)


if __name__ == "__main__":
    unittest.main()

"""Frozen-input and ephemeral-staging tests."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.errors import CliError
from meta_skill.run_inputs import freeze_run_inputs
from meta_skill.staging import cleanup_workspace, stage_workspace


class RunInputTests(unittest.TestCase):
    def test_inline_and_file_inputs_freeze_hidden_material_but_stage_only_visible_files(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = Path(tmp) / "skill"
            companion = Path(tmp) / ".skill"
            authored = companion / "evals" / "cases" / "a"
            authored.mkdir(parents=True)
            (authored / "task.md").write_text("Visible task")
            (authored / "expected.md").write_text("Hidden result")
            (authored / "judge.md").write_text("Hidden judge")
            (authored / "input.txt").write_text("fixture")
            suite = companion / "evals" / "evals.json"
            suite.write_text(json.dumps({"schema_version": 2}))
            run_dir = companion / "runs" / "run-1"
            worktree_root = companion / "worktrees" / "run-1"
            case = {"id": "a", "type": "capability", "priority": "high", "prompt": {"path": "task.md"}, "expected_output": {"path": "expected.md"}, "expectations": ["Pass"], "fixtures": ["input.txt"], "graders": [{"kind": "model", "id": "judge", "path": "judge.md"}], "annotations": [{"tag": "task-defect", "note": "Review wording"}]}
            frozen = freeze_run_inputs({"target": {"ref": "SKILL.md"}}, suite, run_dir, [case], [{"candidate": "current"}])
            frozen_case = {**frozen["evals"][0], "case_root": str(run_dir / "inputs" / "cases" / "a")}
            self.assertEqual(frozen_case["priority"], "high")
            self.assertEqual(frozen_case["annotations"][0]["tag"], "task-defect")
            staged = stage_workspace(worktree_root, "a.current.t1", frozen_case, {"candidate": "current", "payload_path": None})
            workspace = Path(staged["workspace"])
            self.assertTrue((run_dir / "inputs" / "cases" / "a" / "judge.md").is_file())
            self.assertTrue((run_dir / "inputs" / "cases" / "a" / "expected.md").is_file())
            self.assertTrue((workspace / "task.md").is_file())
            self.assertTrue((workspace / "fixtures" / "input.txt").is_file())
            self.assertFalse((workspace / "judge.md").exists())
            cleanup_workspace(workspace, worktree_root)
            self.assertFalse(worktree_root.exists())

    def test_symlink_support_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = Path(tmp) / "skill"
            companion = Path(tmp) / ".skill"
            authored = companion / "evals" / "cases" / "a"
            authored.mkdir(parents=True)
            (authored / "secret").write_text("hidden")
            (authored / "fixture").symlink_to("secret")
            case = {"id": "a", "prompt": "A", "fixtures": ["fixture"], "expectations": ["Pass"]}
            with self.assertRaises(CliError) as caught:
                freeze_run_inputs({}, companion / "evals" / "evals.json", companion / "runs" / "r", [case], [])
            self.assertIn("must not contain symlinks", caught.exception.message)

    def test_missing_file_prompt_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = Path(tmp) / "skill"
            companion = Path(tmp) / ".skill"
            (companion / "evals" / "cases" / "a").mkdir(parents=True)
            with self.assertRaises(CliError) as caught:
                freeze_run_inputs({}, companion / "evals" / "evals.json", companion / "runs" / "r", [{"id": "a", "prompt": {"path": "task.md"}, "expectations": ["Pass"]}], [])
            self.assertIn("prompt file missing", caught.exception.message)


if __name__ == "__main__":
    unittest.main()

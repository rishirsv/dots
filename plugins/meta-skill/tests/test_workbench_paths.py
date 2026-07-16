"""Tests for skill-local hidden companion workspaces."""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.candidates import copy_candidate_payload, payload_digest  # noqa: E402
from meta_skill.workbench import init_target, init_workbench  # noqa: E402
from meta_skill.workbench_paths import (  # noqa: E402
    evals_path,
    packages_path,
    runs_path,
    skill_id_for_target,
    state_root,
    workspace_root,
    worktrees_path,
)
from meta_skill.manifest import project_from_suite  # noqa: E402


def write_skill(path: Path, name: str) -> None:
    path.mkdir(parents=True, exist_ok=True)
    (path / "SKILL.md").write_text(
        f"""---
name: {name}
description: "Use for testing skill workbench paths."
---

# {name}

Test skill.
"""
    )


class WorkbenchPathTests(unittest.TestCase):
    def test_bare_skill_uses_a_named_hidden_companion_workspace(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            skill_dir = Path(tmp) / "unpack-skill"
            write_skill(skill_dir, "unpack")

            result = init_workbench(skill_dir)

            expected = skill_dir.resolve() / ".unpack"
            self.assertEqual(Path(result["state"]), expected)
            self.assertTrue(expected.is_dir())
            self.assertFalse((expected / "AGENTS.md").exists())
            self.assertFalse(evals_path(skill_dir).exists())

    def test_single_skill_project_uses_skill_local_workspace(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "invoice-project"
            write_skill(project / "skill", "invoice-reader")

            result = init_target(project, with_evals=True)

            expected = project.resolve() / "skill" / ".invoice-reader"
            self.assertEqual(Path(result["state"]), expected)
            self.assertEqual(Path(result["evals"]), expected / "evals" / "evals.json")
            data = json.loads(Path(result["evals"]).read_text())
            self.assertEqual(data["target"]["ref"], "SKILL.md")
            self.assertEqual(project_from_suite(result["evals"]), project.resolve() / "skill")

    def test_plugin_skills_get_separate_skill_local_workspaces(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp) / "repo"
            repo.mkdir()
            subprocess.run(["git", "init", "-q"], cwd=repo, check=True)
            skill_dir = repo / "plugins" / "dots" / "skills" / "engineering" / "demo"
            sibling = repo / "plugins" / "dots" / "skills" / "productivity" / "demo"
            write_skill(skill_dir, "demo")
            write_skill(sibling, "demo")

            self.assertEqual(skill_id_for_target(skill_dir), "plugins/dots/skills/engineering/demo")
            expected = skill_dir.resolve() / ".demo"
            self.assertEqual(workspace_root(skill_dir), expected)
            self.assertEqual(evals_path(skill_dir), expected / "evals" / "evals.json")
            self.assertEqual(project_from_suite(evals_path(skill_dir)), skill_dir.resolve())
            self.assertEqual(runs_path(skill_dir), expected / "runs")
            self.assertEqual(worktrees_path(skill_dir), expected / "worktrees")
            self.assertEqual(packages_path(skill_dir), expected / "packages")
            self.assertEqual(workspace_root(sibling), sibling.resolve() / ".demo")

    def test_eval_suite_is_opt_in(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            skill_dir = Path(tmp) / "skill"
            write_skill(skill_dir, "demo")
            plain = init_target(skill_dir)
            self.assertIsNone(plain["evals"])
            result = init_target(skill_dir, with_evals=True)
            self.assertEqual(Path(result["evals"]), skill_dir.resolve() / ".demo" / "evals" / "evals.json")

    def test_copy_and_digest_exclude_authored_evals_and_generated_state(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp) / "source"
            dest = Path(tmp) / "dest"
            write_skill(source, "demo")
            (source / "reference.md").write_text("runtime\n")
            (evals_path(source).parent / "cases").mkdir(parents=True)
            (evals_path(source).parent / "cases" / "private.txt").write_text("hidden\n")
            (state_root(source) / "runs").mkdir(parents=True)
            (state_root(source) / "runs" / "private.json").write_text("{}\n")
            before = payload_digest(source)

            copy_candidate_payload(source, dest)

            self.assertTrue((dest / "reference.md").exists())
            self.assertFalse((dest / "evals").exists())
            self.assertFalse((dest / ".demo").exists())
            (evals_path(source).parent / "cases" / "private.txt").write_text("changed\n")
            (state_root(source) / "runs" / "private.json").write_text('{"changed":true}\n')
            self.assertEqual(payload_digest(source), before)


if __name__ == "__main__":
    unittest.main()

"""Tests for skill-named hidden workbench paths."""

import sys
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.candidates import payload_digest  # noqa: E402
from meta_skill.io import read_json  # noqa: E402
from meta_skill.staging import copy_payload  # noqa: E402
from meta_skill.workbench import init_workbench  # noqa: E402
from meta_skill.workbench_paths import workbench_path  # noqa: E402


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
    def test_init_uses_skill_name_for_hidden_workbench(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            skill_dir = Path(tmp) / "unpack-skill"
            write_skill(skill_dir, "unpack")

            result = init_workbench(skill_dir)

            expected = skill_dir / ".unpack"
            self.assertEqual(Path(result["workbench"]), expected)
            self.assertTrue((expected / "cases").is_dir())
            self.assertTrue((expected / "runs").is_dir())
            self.assertEqual(read_json(expected / "evals.json")["skill_name"], "unpack")

    def test_project_mode_uses_skill_payload_name(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            project = Path(tmp) / "invoice-project"
            write_skill(project / "skill", "invoice-reader")

            result = init_workbench(project)

            expected = project / ".invoice-reader"
            self.assertEqual(Path(result["workbench"]), expected)
            manifest = read_json(expected / "evals.json")
            self.assertEqual(manifest["skill_name"], "invoice-reader")
            self.assertEqual(manifest["target"], {"type": "skill", "ref": "skill/SKILL.md"})

    def test_copy_payload_excludes_skill_named_workbench(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            source = Path(tmp) / "source"
            dest = Path(tmp) / "dest"
            write_skill(source, "demo")
            (source / "reference.md").write_text("runtime\n")
            (workbench_path(source) / "cases").mkdir(parents=True)
            (workbench_path(source) / "cases" / "private.txt").write_text("hidden\n")

            copy_payload(source, dest)

            self.assertTrue((dest / "reference.md").exists())
            self.assertFalse((dest / ".demo").exists())

    def test_payload_digest_ignores_skill_named_workbench(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            skill_dir = Path(tmp) / "skill"
            write_skill(skill_dir, "demo")
            before = payload_digest(skill_dir)
            (workbench_path(skill_dir) / "runs").mkdir(parents=True)
            (workbench_path(skill_dir) / "runs" / "private.json").write_text("{}\n")

            self.assertEqual(payload_digest(skill_dir), before)


if __name__ == "__main__":
    unittest.main()

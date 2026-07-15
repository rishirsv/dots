"""Packaging boundaries for external companion workspaces and legacy residue."""

import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.packaging import package_skill  # noqa: E402


class PackagingTests(unittest.TestCase):
    def test_default_package_path_and_payload_exclusions(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = Path(tmp) / "skill"
            skill.mkdir()
            (skill / "SKILL.md").write_text(
                '---\nname: demo\ndescription: "Use for packaging tests."\n---\n\n# Demo\n'
            )
            (skill / "reference.md").write_text("runtime\n")
            companion = Path(tmp) / ".skill"
            (companion / "evals" / "cases").mkdir(parents=True)
            (companion / "evals" / "evals.json").write_text('{"schema_version":2,"evals":[]}\n')
            (companion / "evals" / "cases" / "secret.md").write_text("hidden grader\n")
            (skill / ".legacy" / "docs").mkdir(parents=True)
            (skill / ".legacy" / "docs" / "private.md").write_text("private\n")

            result = package_skill(skill)

            self.assertTrue(result["ok"])
            artifact = Path(result["artifact"])
            self.assertEqual(
                artifact,
                companion.resolve() / "packages" / "demo.zip",
            )
            with zipfile.ZipFile(artifact) as archive:
                names = set(archive.namelist())
            self.assertIn("SKILL.md", names)
            self.assertIn("reference.md", names)
            self.assertFalse(any(name.startswith("evals/") for name in names))
            self.assertFalse(any(part.startswith(".") for name in names for part in Path(name).parts))

    def test_rejects_dependency_missing_from_packaged_payload(self):
        with tempfile.TemporaryDirectory() as tmp:
            plugin = Path(tmp) / "plugin"
            skill = plugin / "skills" / "demo"
            shared = plugin / "references"
            skill.mkdir(parents=True)
            shared.mkdir()
            (shared / "shared.md").write_text("runtime\n")
            (skill / "SKILL.md").write_text(
                '---\nname: demo\ndescription: "Use for packaging tests."\n---\n\n'
                '# Demo\n\n[Shared](../../references/shared.md)\n'
            )

            result = package_skill(skill, Path(tmp) / "out")

            self.assertFalse(result["ok"])
            self.assertEqual(result["error"], "packaged payload failed validation")
            self.assertFalse((Path(tmp) / "out" / "demo.zip").exists())

    def test_rejects_broken_link_in_nested_reference(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = Path(tmp) / "skill"
            nested = skill / "references" / "nested"
            nested.mkdir(parents=True)
            (skill / "SKILL.md").write_text(
                '---\nname: demo\ndescription: "Use for packaging tests."\n---\n\n'
                '# Demo\n\n[Guide](references/nested/guide.md)\n'
            )
            (nested / "guide.md").write_text("[Missing](missing.md)\n")

            result = package_skill(skill, Path(tmp) / "out")

            self.assertFalse(result["ok"])
            self.assertEqual(result["error"], "packaged payload failed validation")
            self.assertFalse((Path(tmp) / "out" / "demo.zip").exists())


if __name__ == "__main__":
    unittest.main()

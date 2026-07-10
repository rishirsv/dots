"""Packaging boundaries for visible evals and repository-generated state."""

import sys
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.packaging import package_skill  # noqa: E402


class PackagingTests(unittest.TestCase):
    def test_default_package_path_and_payload_exclusions(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = Path(tmp) / "demo"
            skill.mkdir()
            (skill / "SKILL.md").write_text(
                '---\nname: demo\ndescription: "Use for packaging tests."\n---\n\n# Demo\n'
            )
            (skill / "reference.md").write_text("runtime\n")
            (skill / "evals" / "cases").mkdir(parents=True)
            (skill / "evals" / "evals.json").write_text('{"schema_version":2,"evals":[]}\n')
            (skill / "evals" / "cases" / "secret.md").write_text("hidden grader\n")
            (skill / ".legacy" / "docs").mkdir(parents=True)
            (skill / ".legacy" / "docs" / "private.md").write_text("private\n")

            with patch("meta_skill.packaging.validate_report", return_value={"ok": True}):
                result = package_skill(skill)

            artifact = Path(result["artifact"])
            self.assertEqual(
                artifact,
                skill.resolve() / ".metaskill" / "packages" / "demo" / "demo.zip",
            )
            with zipfile.ZipFile(artifact) as archive:
                names = set(archive.namelist())
            self.assertIn("SKILL.md", names)
            self.assertIn("reference.md", names)
            self.assertFalse(any(name.startswith("evals/") for name in names))
            self.assertFalse(any(part.startswith(".") for name in names for part in Path(name).parts))


if __name__ == "__main__":
    unittest.main()

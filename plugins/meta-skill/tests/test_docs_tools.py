"""Tests for the docs gates: generated CLI surface and duplication lint."""

import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

REPO_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill import docs_tools  # noqa: E402


class CliSurfaceTests(unittest.TestCase):
    def test_rendered_surface_covers_commands_and_flags(self):
        surface = docs_tools.render_cli_surface()
        self.assertTrue(surface.startswith("```sh"))
        for needle in ("eval run", "--preset", "eval verify-run", "docs emit-cli", "case new <case-id>"):
            self.assertIn(needle, surface)
        self.assertNotIn("-h", surface.replace("--", ""))

    def test_committed_cli_md_is_in_sync(self):
        result = docs_tools.emit_cli(check=True)
        self.assertTrue(result["in_sync"], "run `metaskill docs emit-cli --write` and commit references/cli.md")


class DocsLintTests(unittest.TestCase):
    def test_real_tree_has_no_duplicate_passages(self):
        result = docs_tools.docs_lint()
        self.assertEqual(result["duplicates"], [])
        self.assertNotEqual(result["budget"]["status"], "fail")

    def test_duplicate_passage_across_files_is_flagged(self):
        passage = " ".join(f"word{i}" for i in range(docs_tools.SHINGLE_WORDS + 5))
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "references").mkdir()
            (root / "skills" / "demo").mkdir(parents=True)
            (root / "references" / "a.md").write_text(f"# A\n\n{passage}\n")
            (root / "skills" / "demo" / "SKILL.md").write_text(f"# B\n\nintro text {passage}\n")
            with patch.object(docs_tools, "PLUGIN_ROOT", root):
                result = docs_tools.docs_lint()
        self.assertFalse(result["ok"])
        self.assertEqual(len(result["duplicates"]), 1)
        self.assertEqual(
            result["duplicates"][0]["files"],
            ["references/a.md", "skills/demo/SKILL.md"],
        )


if __name__ == "__main__":
    unittest.main()

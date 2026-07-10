"""Suite lint tests."""

import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.linting import FATAL_SUITE_WARNINGS, lint_suite


def suite(path, evals):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"schema_version": 2, "evals": evals}))


class LintTests(unittest.TestCase):
    def test_frontmatter_in_file_prompt_is_fatal(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "skill" / "evals"
            path = root / "evals.json"
            suite(path, [{"id": "a", "type": "capability", "prompt": {"path": "task.md"}, "expectations": ["Pass"]}])
            task = root / "cases" / "a" / "task.md"
            task.parent.mkdir(parents=True)
            task.write_text("---\nsecret: yes\n---\nDo A")
            result = lint_suite(str(path))
            self.assertIn("hidden_metadata_in_task", {row["kind"] for row in result["warnings"]})
            self.assertEqual(FATAL_SUITE_WARNINGS, {"hidden_metadata_in_task"})

    def test_advisory_only_and_unbalanced_attached_warn(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "skill" / "evals" / "evals.json"
            suite(path, [{"id": "a", "type": "attached", "prompt": "A", "graders": [{"kind": "model", "id": "judge", "advisory": True}]}])
            kinds = {row["kind"] for row in lint_suite(str(path))["warnings"]}
            self.assertEqual(kinds, {"all_graders_advisory", "unbalanced_attached_suite"})


if __name__ == "__main__":
    unittest.main()

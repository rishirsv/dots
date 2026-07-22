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
            suite(path, [{"id": "a", "type": "capability", "prompt": {"path": "task.md"}, "graders": [{"kind": "human", "id": "review", "metric": "correctness"}]}])
            task = root / "cases" / "a" / "task.md"
            task.parent.mkdir(parents=True)
            task.write_text("---\nsecret: yes\n---\nDo A")
            result = lint_suite(str(path))
            self.assertIn("hidden_metadata_in_task", {row["kind"] for row in result["warnings"]})
            self.assertIn("hidden_metadata_in_task", FATAL_SUITE_WARNINGS)

    def test_advisory_only_and_unbalanced_attached_warn(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "skill" / "evals" / "evals.json"
            suite(path, [{"id": "a", "type": "attached", "prompt": "A", "graders": [{"kind": "model", "id": "judge", "path": "judge.md", "advisory": True}]}])
            kinds = {row["kind"] for row in lint_suite(str(path))["warnings"]}
            self.assertEqual(kinds, {"all_graders_advisory", "unbalanced_attached_suite"})

    def test_public_benchmark_without_case_dates_warns(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "skill" / "evals" / "evals.json"
            cases = [
                {
                    "id": f"case-{index}",
                    "type": "capability",
                    "prompt": f"Do {index}",
                    "coverage": ["core"],
                    "repetitions": 3,
                    "split": "development" if index < 10 else "test",
                    "graders": [{"kind": "human", "id": "review", "metric": "quality"}],
                }
                for index in range(20)
            ]
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(json.dumps({
                "schema_version": 2,
                "evaluation_mode": "benchmark",
                "validity_review": {"status": "pass", "notes": "Validity factors reviewed."},
                "coverage_requirements": ["core"],
                "benchmark": {
                    "name": "Public suite",
                    "source": "https://example.com/benchmark",
                    "version": "v1",
                    "held_out_split": "test",
                    "contamination_controls": "Held-out prompts remain hidden.",
                    "freshness": "Reviewed in July 2026.",
                },
                "evals": cases,
            }))
            warnings = lint_suite(str(path))["warnings"]
            self.assertEqual(
                sum(row["kind"] == "benchmark_case_missing_created_at" for row in warnings),
                20,
            )


if __name__ == "__main__":
    unittest.main()

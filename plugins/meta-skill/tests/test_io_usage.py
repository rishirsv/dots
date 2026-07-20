"""I/O helpers normalize usage and resolve companion-workspace runs."""

import os
import tempfile
import unittest
from pathlib import Path

from meta_skill.errors import CliError
from meta_skill.io import normalize_usage, resolve_run_dir


class NormalizeUsageTests(unittest.TestCase):
    def test_flattens_total_section_to_snake_case(self):
        payload = {
            "last": {"inputTokens": 21079, "outputTokens": 103, "totalTokens": 21182},
            "modelContextWindow": 258400,
            "total": {
                "cachedInputTokens": 60928,
                "inputTokens": 80403,
                "outputTokens": 1164,
                "reasoningOutputTokens": 111,
                "totalTokens": 81567,
            },
        }
        self.assertEqual(
            normalize_usage(payload),
            {
                "input_tokens": 80403,
                "cached_input_tokens": 60928,
                "output_tokens": 1164,
                "total_tokens": 81567,
            },
        )

    def test_none_and_shapeless_payloads_return_none(self):
        self.assertIsNone(normalize_usage(None))
        self.assertIsNone(normalize_usage("junk"))
        self.assertIsNone(normalize_usage({"last": {"inputTokens": 1}}))

    def test_derives_total_when_runtime_reports_zero(self):
        self.assertEqual(
            normalize_usage({"total": {"inputTokens": 80, "outputTokens": 7, "totalTokens": 0}}),
            {
                "input_tokens": 80,
                "cached_input_tokens": 0,
                "output_tokens": 7,
                "total_tokens": 87,
            },
        )


class ResolveRunDirTests(unittest.TestCase):
    def test_resolves_nested_companion_run_by_id(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            skill = root / "demo"
            skill.mkdir()
            (skill / "SKILL.md").write_text('---\nname: demo\ndescription: "Demo."\n---\n')
            run = skill / ".demo" / "runs" / "run-1"
            run.mkdir(parents=True)
            (run / "run.json").write_text("{}\n")
            previous = Path.cwd()
            try:
                os.chdir(root)
                self.assertEqual(resolve_run_dir("run-1"), run.resolve())
            finally:
                os.chdir(previous)

    def test_rejects_duplicate_run_ids_across_skill_workspaces(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for name in ("a", "b"):
                skill = root / name
                skill.mkdir()
                (skill / "SKILL.md").write_text(f'---\nname: {name}\ndescription: "Demo."\n---\n')
                run = skill / f".{name}" / "runs" / "same-run"
                run.mkdir(parents=True)
                (run / "run.json").write_text("{}\n")
            previous = Path.cwd()
            try:
                os.chdir(root)
                with self.assertRaises(CliError):
                    resolve_run_dir("same-run")
            finally:
                os.chdir(previous)


if __name__ == "__main__":
    unittest.main()

"""Deterministic tests for the oracle skill's package builder."""

from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[3]
SCRIPT = REPO_ROOT / "plugins" / "dots" / "skills" / "oracle" / "scripts" / "oracle_package.py"


class OraclePackageTests(unittest.TestCase):
    def run_package(self, *args: str, cwd: Path, check: bool = True) -> subprocess.CompletedProcess[str]:
        result = subprocess.run(
            [sys.executable, str(SCRIPT), *args],
            cwd=cwd,
            check=False,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        if check and result.returncode != 0:
            self.fail(f"oracle_package.py failed\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}")
        return result

    def test_task_file_complete_prompt_becomes_base_prompt(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            task_file = root / "task.md"
            task_file.write_text(
                "# Role\nOracle.\n\n# Task\nReview the plan.\n\n# Output\nReturn findings.\n",
                encoding="utf-8",
            )

            self.run_package(
                "--task-file",
                str(task_file),
                "--output-dir",
                str(root),
                "--name",
                "oracle-authored-task",
                cwd=root,
            )

            prompt = (root / "oracle-authored-task" / "prompt.md").read_text(encoding="utf-8")
            self.assertEqual(prompt, task_file.read_text(encoding="utf-8").strip())
            self.assertFalse(prompt.startswith("Provide a focused second opinion"))

    def test_default_output_dir_uses_agents_oracle_task_slug(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)

            result = self.run_package(
                "--task",
                "Review the parser plan.",
                cwd=root,
            )

            package_dir = root / ".agents" / "oracle" / "review-the-parser-plan"
            self.assertTrue((package_dir / "prompt.md").exists())
            self.assertTrue((package_dir / "context.zip").exists())
            self.assertIn(str(package_dir), result.stdout)

    def test_agents_oracle_task_files_can_be_packaged_explicitly(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            task_dir = root / ".agents" / "oracle" / "review-the-parser-plan"
            task_dir.mkdir(parents=True)
            source = task_dir / "review-image.txt"
            source.write_text("derived package input\n", encoding="utf-8")

            self.run_package(
                "--task",
                "Review the parser plan.",
                "--file",
                ".agents/oracle/review-the-parser-plan/review-image.txt",
                cwd=root,
            )

            package_dir = root / ".agents" / "oracle" / "review-the-parser-plan"
            context_map = subprocess.run(
                ["unzip", "-p", str(package_dir / "context.zip"), "file-map.txt"],
                check=True,
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            ).stdout
            self.assertIn(".agents/oracle/review-the-parser-plan/review-image.txt", context_map)

    def test_prompt_file_preserves_authored_prompt_without_generated_wrapper(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "source.txt"
            source.write_text("context\n", encoding="utf-8")
            prompt_file = root / "prompt-source.md"
            prompt_file.write_text(
                "# Role\nOracle.\n\n# Task\nReview the plan.\n\n# Output\nReturn findings.\n",
                encoding="utf-8",
            )

            self.run_package(
                "--prompt-file",
                str(prompt_file),
                "--file",
                "source.txt",
                "--output-dir",
                str(root),
                "--name",
                "oracle-authored",
                cwd=root,
            )

            prompt = (root / "oracle-authored" / "prompt.md").read_text(encoding="utf-8")
            self.assertEqual(prompt, prompt_file.read_text(encoding="utf-8").strip())
            self.assertEqual(prompt.count("# Role"), 1)
            self.assertEqual(prompt.count("# Output"), 1)

    def test_generated_prompt_uses_task_shaped_default_labels(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)

            self.run_package(
                "--task",
                "Review the plan.",
                "--output-dir",
                str(root),
                "--name",
                "oracle-generated",
                cwd=root,
            )

            prompt = (root / "oracle-generated" / "prompt.md").read_text(encoding="utf-8")
            self.assertIn("Provide a focused second opinion.", prompt)
            self.assertIn("Request:", prompt)
            self.assertNotIn("# Advisory Frame", prompt)
            self.assertNotIn("# Request", prompt)
            self.assertNotIn("# Role", prompt)
            self.assertNotIn("# Decision To Improve", prompt)
            self.assertNotIn("# Success Criteria", prompt)
            self.assertNotIn("# Output", prompt)

    def test_context_map_suppresses_mechanical_file_reasons(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "source.txt"
            source.write_text("context\n", encoding="utf-8")
            context_map = root / "context-map.md"
            context_map.write_text("- source.txt: primary evidence.\n", encoding="utf-8")

            self.run_package(
                "--task",
                "Review the plan.",
                "--file",
                "source.txt",
                "--context-map-file",
                str(context_map),
                "--output-dir",
                str(root),
                "--name",
                "oracle-context-map",
                cwd=root,
            )

            prompt = (root / "oracle-context-map" / "prompt.md").read_text(encoding="utf-8")
            self.assertIn("- source.txt: primary evidence.", prompt)
            self.assertNotIn("matched source.txt", prompt)

    def test_single_heading_task_file_still_gets_context_wrapper(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            task_file = root / "task.md"
            task_file.write_text("# Review\n\nPlease review this plan.\n", encoding="utf-8")
            source = root / "source.txt"
            source.write_text("context\n", encoding="utf-8")

            self.run_package(
                "--task-file",
                str(task_file),
                "--file",
                "source.txt",
                "--output-dir",
                str(root),
                "--name",
                "oracle-single-heading",
                cwd=root,
            )

            prompt = (root / "oracle-single-heading" / "prompt.md").read_text(encoding="utf-8")
            self.assertIn("Provide a focused second opinion.", prompt)
            self.assertIn("# Review", prompt)
            self.assertIn("source.txt", prompt)

    def test_dry_run_previews_without_writing_package(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "source.txt"
            source.write_text("context\n", encoding="utf-8")

            result = self.run_package(
                "--task",
                "Review the plan.",
                "--file",
                "source.txt",
                "--output-dir",
                str(root),
                "--name",
                "oracle-dry-run",
                "--dry-run",
                cwd=root,
            )

            self.assertFalse((root / "oracle-dry-run").exists())
            self.assertIn("dry-run: would create", result.stdout)
            self.assertIn("include: source.txt", result.stdout)
            self.assertIn("total_estimated_tokens=", result.stdout)

    def test_token_budget_blocks_oversized_package(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "big.txt"
            source.write_text("x" * 4000, encoding="utf-8")

            blocked = self.run_package(
                "--task",
                "Review the plan.",
                "--file",
                "big.txt",
                "--output-dir",
                str(root),
                "--name",
                "oracle-oversized",
                "--token-budget",
                "100",
                cwd=root,
                check=False,
            )

            self.assertNotEqual(blocked.returncode, 0)
            self.assertFalse((root / "oracle-oversized").exists())
            self.assertIn("OVER BUDGET", blocked.stdout)
            self.assertIn("exceed --token-budget", blocked.stderr)

    def test_allow_oversized_writes_over_budget_package(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "big.txt"
            source.write_text("x" * 4000, encoding="utf-8")

            written = self.run_package(
                "--task",
                "Review the plan.",
                "--file",
                "big.txt",
                "--output-dir",
                str(root),
                "--name",
                "oracle-allow-oversized",
                "--token-budget",
                "100",
                "--allow-oversized",
                cwd=root,
            )

            self.assertTrue((root / "oracle-allow-oversized" / "prompt.md").exists())
            self.assertIn("token_budget=100", written.stdout)
            self.assertIn("OVER BUDGET", written.stdout)

    def test_token_total_reported_for_normal_package(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "source.txt"
            source.write_text("context\n", encoding="utf-8")

            result = self.run_package(
                "--task",
                "Review the plan.",
                "--file",
                "source.txt",
                "--output-dir",
                str(root),
                "--name",
                "oracle-token-report",
                cwd=root,
            )

            self.assertIn("total_estimated_tokens=", result.stdout)
            self.assertIn("token_budget=270000", result.stdout)
            self.assertNotIn("OVER BUDGET", result.stdout)

    def test_repeated_top_level_headings_fail(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            prompt_file = root / "prompt-source.md"
            prompt_file.write_text(
                "# Role\nOracle.\n\n# Output\nFirst.\n\n# Output\nSecond.\n",
                encoding="utf-8",
            )

            result = self.run_package(
                "--prompt-file",
                str(prompt_file),
                "--output-dir",
                str(root),
                "--name",
                "oracle-duplicate",
                cwd=root,
                check=False,
            )

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("repeated top-level headings", result.stderr)


if __name__ == "__main__":
    unittest.main()

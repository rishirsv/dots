from __future__ import annotations

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "assist_package.py"


class AssistPackageTests(unittest.TestCase):
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
            self.fail(f"assist_package.py failed\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}")
        return result

    def test_task_file_complete_prompt_becomes_base_prompt(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            task_file = root / "task.md"
            task_file.write_text(
                "# Role\nAdvisor.\n\n# Task\nReview the plan.\n\n# Output\nReturn findings.\n",
                encoding="utf-8",
            )

            self.run_package(
                "--task-file",
                str(task_file),
                "--output-dir",
                str(root),
                "--name",
                "assist-authored-task",
                cwd=root,
            )

            prompt = (root / "assist-authored-task" / "prompt.md").read_text(encoding="utf-8")
            self.assertEqual(prompt, task_file.read_text(encoding="utf-8").strip())
            self.assertFalse(prompt.startswith("Provide a focused second opinion"))

    def test_prompt_file_preserves_authored_prompt_without_generated_wrapper(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "source.txt"
            source.write_text("context\n", encoding="utf-8")
            prompt_file = root / "prompt-source.md"
            prompt_file.write_text(
                "# Role\nAdvisor.\n\n# Task\nReview the plan.\n\n# Output\nReturn findings.\n",
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
                "assist-authored",
                cwd=root,
            )

            prompt = (root / "assist-authored" / "prompt.md").read_text(encoding="utf-8")
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
                "assist-generated",
                cwd=root,
            )

            prompt = (root / "assist-generated" / "prompt.md").read_text(encoding="utf-8")
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
                "assist-context-map",
                cwd=root,
            )

            prompt = (root / "assist-context-map" / "prompt.md").read_text(encoding="utf-8")
            self.assertIn("- source.txt: primary evidence.", prompt)
            self.assertNotIn("matched source.txt", prompt)

    def test_duplicate_authority_sections_fail(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            prompt_file = root / "prompt-source.md"
            prompt_file.write_text(
                "# Role\nAdvisor.\n\n# Output\nFirst.\n\n# Output\nSecond.\n",
                encoding="utf-8",
            )

            result = self.run_package(
                "--prompt-file",
                str(prompt_file),
                "--output-dir",
                str(root),
                "--name",
                "assist-duplicate",
                cwd=root,
                check=False,
            )

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("repeated top-level headings", result.stderr)


if __name__ == "__main__":
    unittest.main()

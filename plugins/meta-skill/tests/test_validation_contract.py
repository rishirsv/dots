"""Deterministic skill-validation contracts."""

import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.validation import validate_report  # noqa: E402


def write_skill(root, frontmatter, body="# Demo\n"):
    skill = Path(root) / "skill"
    skill.mkdir()
    (skill / "SKILL.md").write_text(f"---\n{frontmatter}---\n\n{body}")
    return skill


def checks(report, task):
    return {
        row["check"]: row
        for group in report["tasks"]
        if group["task"] == task
        for row in group["checks"]
    }


class ValidationContractTests(unittest.TestCase):
    def test_absent_optional_fields_do_not_create_free_passes(self):
        with tempfile.TemporaryDirectory() as tmp:
            report = validate_report(write_skill(
                tmp,
                'name: demo\ndescription: "Use when testing validation."\n',
            ))

        structural = checks(report, "validate_skill")
        self.assertTrue(report["ok"])
        self.assertEqual(
            set(structural),
            {
                "frontmatter_valid",
                "name_field",
                "description_field",
                "frontmatter_unknown_keys",
                "skill_md_line_count",
                "body_present",
            },
        )

    def test_present_optional_fields_are_validated(self):
        with tempfile.TemporaryDirectory() as tmp:
            valid = validate_report(write_skill(
                tmp,
                'name: demo\n'
                'description: |\n'
                '  Use when testing validation.\n'
                'allowed-tools: [Read, Write]\n'
                'metadata:\n'
                '  version: "1"\n'
                'disable-model-invocation: false\n',
            ))

        structural = checks(valid, "validate_skill")
        self.assertTrue(valid["ok"])
        self.assertEqual(structural["allowed_tools_field"]["result"], "Pass")
        self.assertEqual(structural["metadata_field"]["result"], "Pass")
        self.assertEqual(structural["disable_model_invocation_field"]["result"], "Pass")

        with tempfile.TemporaryDirectory() as tmp:
            invalid = validate_report(write_skill(
                tmp,
                'name: demo\n'
                'description: "Use when testing validation."\n'
                'allowed-tools: 42\n'
                'metadata: broken\n'
                'disable-model-invocation: maybe\n',
            ))

        structural = checks(invalid, "validate_skill")
        self.assertFalse(invalid["ok"])
        self.assertEqual(structural["allowed_tools_field"]["result"], "Fail")
        self.assertEqual(structural["metadata_field"]["result"], "Fail")
        self.assertEqual(structural["disable_model_invocation_field"]["result"], "Fail")

    def test_invalid_and_overlong_names_fail(self):
        for name in ("Not Kebab", "a" * 65):
            with self.subTest(name=name), tempfile.TemporaryDirectory() as tmp:
                report = validate_report(write_skill(
                    tmp,
                    f'name: "{name}"\ndescription: "Use when testing validation."\n',
                ))

                self.assertFalse(report["ok"])
                self.assertEqual(checks(report, "validate_skill")["name_field"]["result"], "Fail")

    def test_malformed_frontmatter_fails(self):
        with tempfile.TemporaryDirectory() as tmp:
            report = validate_report(write_skill(
                tmp,
                'name: demo\ndescription: "unterminated\n',
            ))

        self.assertFalse(report["ok"])
        self.assertEqual(checks(report, "validate_skill")["frontmatter_valid"]["result"], "Fail")
        self.assertNotIn("description_length", checks(report, "lint_authoring"))

    def test_missing_description_does_not_create_lint_passes(self):
        with tempfile.TemporaryDirectory() as tmp:
            report = validate_report(write_skill(tmp, "name: demo\n"))

        authoring = checks(report, "lint_authoring")
        self.assertFalse(report["ok"])
        self.assertNotIn("description_length", authoring)
        self.assertNotIn("description_neutral_voice", authoring)
        self.assertNotIn("description_no_workflow_steps", authoring)

    def test_missing_body_does_not_create_hard_command_pass(self):
        with tempfile.TemporaryDirectory() as tmp:
            report = validate_report(write_skill(
                tmp,
                'name: demo\ndescription: "Use when testing validation."\n',
                body="",
            ))

        self.assertFalse(report["ok"])
        self.assertNotIn("hard_command_density", checks(report, "lint_authoring"))

    def test_missing_openai_icon_fails_dead_reference_check(self):
        with tempfile.TemporaryDirectory() as tmp:
            skill = write_skill(
                tmp,
                'name: demo\ndescription: "Use when testing validation."\n',
            )
            agents = skill / "agents"
            agents.mkdir()
            (agents / "openai.yaml").write_text(
                'interface:\n  icon_small: "./assets/missing.png"\n'
            )

            report = validate_report(skill)

        self.assertFalse(report["ok"])
        self.assertEqual(checks(report, "lint_authoring")["dead_references"]["result"], "Fail")


if __name__ == "__main__":
    unittest.main()

from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock


REPO_ROOT = Path(__file__).resolve().parents[1]
VALIDATOR_PATH = REPO_ROOT / "scripts" / "verify.py"
SPEC = importlib.util.spec_from_file_location("dots_validate_plugin", VALIDATOR_PATH)
assert SPEC and SPEC.loader
validator = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = validator
SPEC.loader.exec_module(validator)


def write_valid_plugin(root: Path) -> Path:
    (root / ".codex-plugin").mkdir(parents=True)
    (root / "assets").mkdir()
    (root / "assets" / "icon.png").write_bytes(b"icon")
    (root / "assets" / "logo.png").write_bytes(b"logo")
    (root / ".codex-plugin" / "plugin.json").write_text(
        json.dumps({
            "name": root.name,
            "interface": {
                "composerIcon": "./assets/icon.png",
                "logo": "./assets/logo.png",
            },
        }),
        encoding="utf-8",
    )
    skill = root / "skills" / "example"
    (skill / "agents").mkdir(parents=True)
    (skill / "references").mkdir()
    (skill / "references" / "guide.md").write_text("# Guide\n", encoding="utf-8")
    (skill / "SKILL.md").write_text(
        "---\nname: example\ndescription: \"Example skill.\"\n---\n\n"
        "Read [the guide](references/guide.md).\n",
        encoding="utf-8",
    )
    (skill / "agents" / "openai.yaml").write_text(
        "interface:\n"
        "  default_prompt: \"Use $example.\"\n"
        "  icon_small: \"../../assets/icon.png\"\n"
        "  icon_large: \"../../assets/logo.png\"\n"
        "policy:\n"
        "  allow_implicit_invocation: true\n",
        encoding="utf-8",
    )
    return skill


class PluginValidationTests(unittest.TestCase):
    def test_valid_plugin_passes_package_integrity_checks(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "dots"
            write_valid_plugin(root)
            self.assertEqual(validator.validate_plugin(root), [])

    def test_plain_description_is_valid_for_drafts(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "drafts"
            skill = write_valid_plugin(root)
            path = skill / "SKILL.md"
            path.write_text(path.read_text().replace('"Example skill."', 'Example skill.'))
            self.assertEqual(validator.validate_plugin(root), [])

    def test_full_gate_rejects_a_failing_root_suite(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "tests").mkdir()
            (root / "tests" / "test_regression.py").write_text(
                "import unittest\n"
                "class Regression(unittest.TestCase):\n"
                "    def test_regression(self): self.fail('sync regression')\n"
            )

            def local_suites_only(*command, **kwargs):
                if command[:3] == (sys.executable, "-m", "unittest"):
                    subprocess.run(command, cwd=root, check=True, capture_output=True)

            with mock.patch.object(validator, "ROOT", root), mock.patch.object(
                validator, "run", side_effect=local_suites_only
            ):
                with self.assertRaises(subprocess.CalledProcessError):
                    validator.full_checks([], [])

    def test_skill_name_must_match_directory_and_be_unique(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "dots"
            skill = write_valid_plugin(root)
            duplicate = root / "skills" / "other"
            (duplicate / "agents").mkdir(parents=True)
            (duplicate / "SKILL.md").write_text(
                (skill / "SKILL.md").read_text(encoding="utf-8"), encoding="utf-8"
            )
            (duplicate / "agents" / "openai.yaml").write_text(
                (skill / "agents" / "openai.yaml").read_text(encoding="utf-8"),
                encoding="utf-8",
            )
            errors = validator.validate_plugin(root)
            self.assertTrue(any("must match directory" in error for error in errors))
            self.assertTrue(any("duplicate skill name" in error for error in errors))

    def test_broken_local_links_and_icons_fail(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "dots"
            skill = write_valid_plugin(root)
            (skill / "SKILL.md").write_text(
                "---\nname: example\ndescription: \"Example skill.\"\n---\n\n"
                "Read [the missing guide](references/missing.md).\n",
                encoding="utf-8",
            )
            agent_path = skill / "agents" / "openai.yaml"
            agent_path.write_text(
                agent_path.read_text(encoding="utf-8").replace(
                    "../../assets/icon.png", "../../assets/missing.png"
                ),
                encoding="utf-8",
            )
            errors = validator.validate_plugin(root)
            self.assertTrue(any("local link does not resolve" in error for error in errors))
            self.assertTrue(any("icon_small does not resolve" in error for error in errors))

if __name__ == "__main__":
    unittest.main()

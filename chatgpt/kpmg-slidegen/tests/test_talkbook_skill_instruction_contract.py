#!/usr/bin/env python3
"""Contract tests for Talkbook skill instruction wiring."""

from __future__ import annotations

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILL_ROOT = ROOT / "dist" / "kpmg-talkbook-consulting-copilot"
SKILL_MD = SKILL_ROOT / "SKILL.md"
OPENAI_YAML = SKILL_ROOT / "agents" / "openai.yaml"
README = SKILL_ROOT / "README.md"
USE_CASES = SKILL_ROOT / "examples" / "use-cases.md"


class TalkbookSkillInstructionContractTests(unittest.TestCase):
    """Ensure archetype-first writing workflow remains wired in skill docs."""

    def test_files_exist(self) -> None:
        """Skill metadata and docs should exist."""
        for path in [SKILL_MD, OPENAI_YAML, README, USE_CASES]:
            self.assertTrue(path.exists(), msg=f"Missing file: {path}")

    def test_skill_md_workflow_contract_lines(self) -> None:
        """SKILL.md should enforce outline gate, archetype-first drafting, and checklist review."""
        text = SKILL_MD.read_text(encoding="utf-8")

        required_lines = [
            "outline_confirm",
            "one_shot",
            "MANDATORY in outline_confirm",
            "approve_outline.py",
            "materialize_outline.py",
            "authoring payload",
            "run writing checklist",
            "references/writing-archetypes.md",
            "references/writing-checklist.md",
            "references/workflow-outline-mode.md",
            "references/authoring-payload-contract.md",
            "skill-creator",
        ]
        for line in required_lines:
            self.assertIn(line, text, msg=f"SKILL.md missing required instruction: {line}")

    def test_agent_prompt_mentions_archetype_and_checklist(self) -> None:
        """Agent prompt should include outline flow and archetype/checklist guidance."""
        text = OPENAI_YAML.read_text(encoding="utf-8")

        self.assertRegex(text, re.compile(r"outline_confirm", re.IGNORECASE))
        self.assertRegex(text, re.compile(r"one_shot", re.IGNORECASE))
        self.assertRegex(text, re.compile(r"archetype", re.IGNORECASE))
        self.assertRegex(text, re.compile(r"writing-checklist\.md", re.IGNORECASE))
        self.assertRegex(text, re.compile(r"references/writing-archetypes\.md", re.IGNORECASE))

    def test_readme_and_examples_reference_writing_system(self) -> None:
        """README and examples should reference both workflow paths and writing system."""
        readme = README.read_text(encoding="utf-8")
        examples = USE_CASES.read_text(encoding="utf-8")

        self.assertIn("outline_confirm", readme)
        self.assertIn("one_shot", readme)
        self.assertIn("archetype", readme.lower())
        self.assertIn("writing-archetypes.md", readme)
        self.assertIn("writing-checklist.md", readme)
        self.assertIn("authoring-payload-contract.md", readme)

        self.assertIn("Outline-first drafting", examples)
        self.assertIn("One-shot bypass", examples)
        self.assertIn("core.swot-analysis", examples)
        self.assertIn("finance.pnl-walkthrough", examples)


if __name__ == "__main__":
    unittest.main()

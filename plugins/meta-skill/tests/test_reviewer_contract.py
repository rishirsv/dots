"""Guard the canonical static diagnostic contract."""

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

REVIEWER = ROOT / "plugins" / "meta-skill" / "skills" / "skill-reviewer"


class ReviewerContractTests(unittest.TestCase):
    def test_canonical_reviewer_is_discoverable_and_read_only(self):
        skill = (REVIEWER / "SKILL.md").read_text()
        metadata = (REVIEWER / "agents" / "openai.yaml").read_text()

        self.assertIn("name: skill-reviewer", skill.split("---", 2)[1])
        self.assertIn("allow_implicit_invocation: true", metadata)
        self.assertIn("$skill-reviewer", metadata)
        self.assertIn("Keep\nthe work read-only", skill)
        self.assertIn("Use `skill-author` when the user asks to change source", skill)
        self.assertIn("Use `skill-evaluator`", skill)

    def test_workflow_is_evidence_backed_and_adapts_to_the_caller(self):
        skill = (REVIEWER / "SKILL.md").read_text()

        self.assertIn("Follow any severity scale, verdict vocabulary, and output contract", skill)
        self.assertIn("A full diagnostic must cover discovery and purpose", skill)
        self.assertIn("read-only structural\nvalidator", skill)
        self.assertIn("distinguish whether the cause is the skill, evaluator", skill)
        self.assertIn("Do not silently rewrite the skill", skill)

    def test_conditional_references_cover_high_signal_defects_and_domains(self):
        method = (REVIEWER / "references" / "diagnostic-method.md").read_text()
        domains = (REVIEWER / "references" / "domain-diagnostics.md").read_text()

        for heading in ("No-op", "Contradiction", "Ambiguity", "Overengineering", "Missing tests"):
            self.assertIn(f"### {heading}", method)
        for heading in (
            "Template Execution",
            "Financial Modelling",
            "Spreadsheet Analysis",
            "Reports And Presentations",
            "Research And Synthesis",
        ):
            self.assertIn(f"## {heading}", domains)


if __name__ == "__main__":
    unittest.main()

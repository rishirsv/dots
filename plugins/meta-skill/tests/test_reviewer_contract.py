"""Guard the high-signal static review checks retained from Skill Doctor."""

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

REVIEWER = ROOT / "plugins" / "meta-skill" / "skills" / "skill-reviewer"


class ReviewerContractTests(unittest.TestCase):
    def test_main_workflow_invokes_deep_checks_without_restoring_edit_authority(self):
        text = (REVIEWER / "SKILL.md").read_text()
        normalized = " ".join(text.split())
        for contract in (
            "every Discovery and Implementation dimension",
            "read-only structural Validation phase",
            "payload-hygiene",
            "fresh reader",
            "static comprehension evidence",
            "separate contradiction scan",
            "effective installed payload",
        ):
            self.assertIn(contract, normalized)
        self.assertIn("keep the work read-only", normalized.lower())
        self.assertIn("Numeric scoring is optional", normalized)
        self.assertIn("mechanical evidence, not proof of behavior", normalized)
        self.assertIn("Use `skill-evaluator` when the decision needs fresh task runs", normalized)
        self.assertIn("do not edit source, create workbench state, save review artifacts", normalized)
        self.assertIn("do not ask for edit approval during a read-only review", normalized.lower())

    def test_reference_retains_causal_and_usage_diagnostics(self):
        text = (REVIEWER / "references" / "review-method.md").read_text()
        normalized = " ".join(text.split())
        for defect in ("Embargo", "Lucky pass", "Effective-runtime drift"):
            self.assertIn(f"**{defect}:**", text)
        self.assertIn("observed frequency with likely impact", normalized)
        self.assertIn("when a credible peer exists", normalized)
        self.assertIn("calibration evidence is unavailable", normalized)
        self.assertNotIn("always compare against `explain`", text)

    def test_shared_review_references_do_not_grant_mutation_or_artifact_authority(self):
        rubric = (ROOT / "plugins" / "meta-skill" / "references" / "judge-rubric.md").read_text()
        hygiene = (ROOT / "plugins" / "meta-skill" / "references" / "payload-hygiene.md").read_text()
        self.assertNotIn("judge-review.md", rubric)
        self.assertIn("Keep the review read-only", rubric)
        self.assertIn("hand requested\nimplementation to `skill-author`", rubric)
        self.assertIn("When the current lane owns mutation", hygiene)
        self.assertIn("A read-only review reports the cleanup", hygiene)


if __name__ == "__main__":
    unittest.main()

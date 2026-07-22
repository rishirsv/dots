import json
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.errors import CliError
from meta_skill.manifest import load_manifest
from meta_skill.scenario_format import weighted_checklist_score


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value))


def scenario(root, *, criteria=None):
    case = root / "evals" / "draft-preservation"
    case.mkdir(parents=True)
    (case / "task.md").write_text("Save a draft without replacing the published record.\n")
    write_json(case / "criteria.json", criteria or {
        "context": "Draft persistence",
        "type": "weighted_checklist",
        "checklist": [
            {"name": "preserves-record", "description": "Preserves the published record", "max_score": 3, "category": "INTENT"},
            {"name": "minimal-change", "description": "Keeps the change narrow", "max_score": 1, "category": "MINIMALITY"},
        ],
    })
    write_json(case / "scenario.json", {"type": "regression", "priority": "high"})
    return root / "evals"


class ScenarioFormatTests(unittest.TestCase):
    def test_scenario_scenarios_are_the_default_manifest(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "demo"
            root.mkdir()
            (root / "SKILL.md").write_text('---\nname: demo\ndescription: "Demo."\n---\n')
            manifest = load_manifest(scenario(root))
            self.assertEqual(manifest["format"], "scenario")
            self.assertEqual(manifest["evals"][0]["graders"][0]["kind"], "weighted_checklist")
            self.assertEqual([row["candidate"] for row in manifest["candidates"]], ["without-skill", "current"])

    def test_scenario_criteria_reject_metaskill_extensions(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / "demo"
            root.mkdir()
            (root / "SKILL.md").write_text('---\nname: demo\ndescription: "Demo."\n---\n')
            evals = scenario(root, criteria={
                "context": "Bad extension",
                "type": "weighted_checklist",
                "checklist": [{"name": "x", "description": "X", "max_score": 1, "category": "INTENT", "required": True}],
            })
            with self.assertRaisesRegex(CliError, "unsupported fields: required"):
                load_manifest(evals)

    def test_weighted_score_uses_weighted_points_formula(self):
        criteria = {
            "checklist": [
                {"name": "intent", "description": "Intent", "max_score": 3, "category": "INTENT"},
                {"name": "minimal", "description": "Minimal", "max_score": 1, "category": "MINIMALITY"},
            ]
        }
        result = weighted_checklist_score(criteria, [{"name": "intent", "score": 2}, {"name": "minimal", "score": 1}])
        self.assertEqual(result["earned"], 3)
        self.assertEqual(result["available"], 4)
        self.assertEqual(result["percentage"], 75)


if __name__ == "__main__":
    unittest.main()

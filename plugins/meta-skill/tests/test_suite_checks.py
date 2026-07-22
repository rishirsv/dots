"""Executable suite preflight tests."""

import hashlib
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.manifest import load_manifest
from meta_skill.suite_checks import check_suite


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n")


class SuiteCheckTests(unittest.TestCase):
    def test_known_pass_and_fail_fixtures_are_executed(self):
        with tempfile.TemporaryDirectory() as tmp:
            suite = Path(tmp) / "skill" / ".demo" / "evals" / "evals.json"
            case_root = suite.parent / "cases" / "a"
            case_root.mkdir(parents=True)
            (case_root / "validate.py").write_text(
                "import argparse, json\n"
                "p=argparse.ArgumentParser()\n"
                "p.add_argument('--output'); p.add_argument('--events'); p.add_argument('--expected')\n"
                "p.add_argument('--artifacts'); p.add_argument('--before-state'); p.add_argument('--after-state'); p.add_argument('--json', action='store_true')\n"
                "a=p.parse_args(); ok='GOOD' in open(a.output).read()\n"
                "print(json.dumps({'total':1,'passed':int(ok),'rationale':'fixture'}))\n"
                "raise SystemExit(0 if ok else 1)\n"
            )
            for name, text in (("oracle", "GOOD"), ("negative", "BAD")):
                fixture = case_root / "grader-tests" / name
                fixture.mkdir(parents=True)
                (fixture / "response.md").write_text(text)
            manifest_data = {
                "schema_version": 2,
                "evals": [{
                    "id": "a",
                    "prompt": "Do A",
                    "graders": [{"kind": "code", "id": "validator", "metric": "correctness", "path": "validate.py"}],
                    "grader_tests": [
                        {"id": "oracle", "grader": "validator", "expected": "pass", "path": "grader-tests/oracle"},
                        {"id": "negative", "grader": "validator", "expected": "fail", "path": "grader-tests/negative"},
                    ],
                }],
            }
            write(suite, manifest_data)
            manifest = load_manifest(suite)
            result = check_suite(manifest, suite)
            self.assertTrue(result["ok"])
            self.assertEqual({row["observed"] for row in result["checks"]}, {"pass", "fail"})
            (case_root / "grader-tests" / "negative" / "response.md").write_text("GOOD")
            self.assertFalse(check_suite(manifest, suite)["ok"])

    def test_calibrated_judge_digest_is_rechecked_before_a_run(self):
        with tempfile.TemporaryDirectory() as tmp:
            suite = Path(tmp) / "skill" / ".demo" / "evals" / "evals.json"
            case_root = suite.parent / "cases" / "a"
            case_root.mkdir(parents=True)
            judge = case_root / "judge.md"
            judge.write_text("Frozen judge")
            digest = hashlib.sha256(judge.read_bytes()).hexdigest()
            calibration = {
                "dataset_id": "held-out-v1",
                "data_period": "2026-H1",
                "validated_at": "2026-07-01",
                "model": "judge-model-v1",
                "reasoning_effort": "medium",
                "judge_sha256": digest,
                "confidence_level": 0.95,
                "minimum_tpr": 0.9,
                "minimum_tnr": 0.9,
                "test": {
                    "true_positive": 200,
                    "false_negative": 0,
                    "true_negative": 200,
                    "false_positive": 0,
                },
            }
            write(suite, {
                "schema_version": 2,
                "evals": [{
                    "id": "a",
                    "prompt": "Do A",
                    "graders": [{
                        "kind": "model",
                        "id": "judge",
                        "metric": "quality",
                        "path": "judge.md",
                        "model": "judge-model-v1",
                        "reasoning_effort": "medium",
                        "calibration": calibration,
                    }],
                }],
            })
            manifest = load_manifest(suite)
            self.assertTrue(check_suite(manifest, suite)["ok"])
            judge.write_text("Changed judge")
            self.assertFalse(check_suite(manifest, suite)["ok"])


if __name__ == "__main__":
    unittest.main()

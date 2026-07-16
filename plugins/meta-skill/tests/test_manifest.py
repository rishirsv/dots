"""Schema-v2 manifest contract tests."""

import json
import hashlib
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "plugins" / "meta-skill" / "src"))

from meta_skill.errors import CliError
from meta_skill.manifest import load_manifest, select_candidates, select_cases


def write(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data))


class ManifestTests(unittest.TestCase):
    def test_loads_anthropic_compatible_rows_and_injects_default_candidates(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            write(path, {"schema_version": 2, "evals": [{"id": "a", "type": "capability", "prompt": "Do A", "expected_output": "A", "expectations": ["A is done"]}]})
            manifest = load_manifest(path)
            self.assertEqual(manifest["evals"][0]["prompt"], "Do A")
            self.assertEqual([row["candidate"] for row in manifest["candidates"]], ["no-skill", "current"])

    def test_legacy_cases_fail_clearly(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            write(path, {"schema_version": 2, "cases": [], "evals": []})
            with self.assertRaises(CliError) as caught:
                load_manifest(path)
            self.assertIn("legacy cases[]", caught.exception.message)

    def test_run_profiles_are_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            write(path, {"schema_version": 2, "profiles": {}, "evals": []})
            with self.assertRaises(CliError) as caught:
                load_manifest(path)
            self.assertIn("profiles are no longer supported", caught.exception.message)

    def test_prompt_path_is_only_task_md(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            write(path, {"schema_version": 2, "evals": [{"id": "a", "prompt": {"path": "other.md"}}]})
            with self.assertRaises(CliError) as caught:
                load_manifest(path)
            self.assertIn("must be task.md", caught.exception.message)

    def test_attached_replaces_trigger_and_grader_policy_is_typed(self):
        for case in (
            {"id": "a", "type": "trigger", "prompt": "A"},
            {"id": "a", "type": "attached", "prompt": "A", "graders": [{"kind": "model", "advisory": "yes"}]},
        ):
            with self.subTest(case=case), tempfile.TemporaryDirectory() as tmp:
                path = Path(tmp) / "evals.json"
                write(path, {"schema_version": 2, "evals": [case]})
                with self.assertRaises(CliError):
                    load_manifest(path)

    def test_baseline_is_default_and_opt_out_is_exact(self):
        manifest = {"candidates": [{"candidate": "current", "source": {"kind": "current_worktree"}}]}
        self.assertEqual([row["candidate"] for row in select_candidates(manifest)], ["no-skill", "current"])
        self.assertEqual([row["candidate"] for row in select_candidates(manifest, include_baseline=False)], ["current"])

    def test_priority_objective_and_explicit_baseline_are_validated(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            write(
                path,
                {
                    "schema_version": 2,
                    "objective": "Compare revisions",
                    "candidates": [
                        {"candidate": "current", "source": {"kind": "current_worktree"}},
                        {"candidate": "candidate", "source": {"kind": "local_path", "path": "../candidate"}},
                    ],
                    "evals": [{"id": "a", "type": "regression", "priority": "high", "prompt": "A"}],
                },
            )
            manifest = load_manifest(path)
            selected = select_candidates(
                manifest, "candidate", baseline_id="current"
            )
            self.assertEqual([row["candidate"] for row in selected], ["current", "candidate"])
            with self.assertRaises(CliError):
                select_cases(manifest, case_ids=["missing"])
            with self.assertRaises(CliError):
                select_candidates(manifest, "missing", include_baseline=False)

    def test_reserved_no_skill_id_and_invalid_priority_fail(self):
        for data in (
            {
                "schema_version": 2,
                "candidates": [{"candidate": "no-skill", "source": {"kind": "current_worktree"}}],
                "evals": [{"id": "a", "prompt": "A"}],
            },
            {"schema_version": 2, "evals": [{"id": "a", "prompt": "A", "priority": "urgent"}]},
        ):
            with self.subTest(data=data), tempfile.TemporaryDirectory() as tmp:
                path = Path(tmp) / "evals.json"
                write(path, data)
                with self.assertRaises(CliError):
                    load_manifest(path)

    def test_load_bearing_model_grader_requires_pinned_statistically_trusted_calibration(self):
        judge_digest = hashlib.sha256(b"judge").hexdigest()
        grader = {
            "kind": "model",
            "id": "quality",
            "metric": "quality",
            "path": "judge.md",
            "model": "judge-model-v1",
            "reasoning_effort": "medium",
            "calibration": {
                "dataset_id": "quality-held-out-v1",
                "data_period": "2026-H1",
                "validated_at": "2026-07-01",
                "model": "judge-model-v1",
                "reasoning_effort": "medium",
                "judge_sha256": judge_digest,
                "confidence_level": 0.95,
                "minimum_tpr": 0.9,
                "minimum_tnr": 0.9,
                "test": {
                    "true_positive": 20,
                    "false_negative": 0,
                    "true_negative": 20,
                    "false_positive": 0,
                },
            },
        }
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            write(path, {"schema_version": 2, "evals": [{"id": "a", "prompt": "A", "graders": [grader]}]})
            with self.assertRaisesRegex(CliError, "lower bound"):
                load_manifest(path)
            grader["calibration"]["test"] = {
                "true_positive": 200,
                "false_negative": 0,
                "true_negative": 200,
                "false_positive": 0,
            }
            write(path, {"schema_version": 2, "evals": [{"id": "a", "prompt": "A", "graders": [grader]}]})
            self.assertEqual(load_manifest(path)["evals"][0]["graders"][0]["model"], "judge-model-v1")

    def test_load_bearing_code_grader_requires_known_pass_and_fail_tests(self):
        grader = {"kind": "code", "id": "validator", "metric": "correctness", "path": "validate.py"}
        case = {"id": "a", "prompt": "A", "graders": [grader]}
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            write(path, {"schema_version": 2, "evals": [case]})
            with self.assertRaisesRegex(CliError, "known Pass and Fail"):
                load_manifest(path)
            case["grader_tests"] = [
                {"id": "oracle", "grader": "validator", "expected": "pass", "path": "grader-tests/oracle"},
                {"id": "negative", "grader": "validator", "expected": "fail", "path": "grader-tests/negative"},
            ]
            write(path, {"schema_version": 2, "evals": [case]})
            self.assertEqual(len(load_manifest(path)["evals"][0]["grader_tests"]), 2)

    def test_readiness_and_benchmark_claims_require_broad_covered_repeated_designs(self):
        cases = [
            {
                "id": f"case-{index}",
                "prompt": f"Do {index}",
                "coverage": ["core" if index < 10 else "boundary"],
                "repetitions": 3,
                "graders": [{"kind": "human", "id": "review", "metric": "correctness"}],
            }
            for index in range(20)
        ]
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            readiness = {
                "schema_version": 2,
                "evaluation_mode": "readiness",
                "coverage_requirements": ["core", "boundary"],
                "evals": cases,
            }
            write(path, readiness)
            self.assertEqual(load_manifest(path)["evaluation_mode"], "readiness")
            readiness["evals"] = cases[:3]
            write(path, readiness)
            with self.assertRaisesRegex(CliError, "at least 20"):
                load_manifest(path)

            benchmark_cases = [
                {**case, "split": "development" if index < 10 else "test"}
                for index, case in enumerate(cases)
            ]
            benchmark = {
                "schema_version": 2,
                "evaluation_mode": "benchmark",
                "coverage_requirements": ["core", "boundary"],
                "benchmark": {
                    "name": "Example benchmark",
                    "source": "local snapshot",
                    "version": "v1",
                    "held_out_split": "test",
                    "contamination_controls": "Cases remain hidden until the final test run.",
                },
                "evals": benchmark_cases,
            }
            write(path, benchmark)
            self.assertEqual(load_manifest(path)["benchmark"]["held_out_split"], "test")

    def test_stateful_outcome_requires_capture_and_state_aware_grader(self):
        case = {
            "id": "a",
            "prompt": "Change the state",
            "outcome": "stateful",
            "graders": [{"kind": "human", "id": "review", "metric": "correctness"}],
        }
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "evals.json"
            write(path, {"schema_version": 2, "evals": [case]})
            with self.assertRaisesRegex(CliError, "state_capture"):
                load_manifest(path)
            case["state_capture"] = "capture.py"
            write(path, {"schema_version": 2, "evals": [case]})
            with self.assertRaisesRegex(CliError, "state-aware"):
                load_manifest(path)


if __name__ == "__main__":
    unittest.main()

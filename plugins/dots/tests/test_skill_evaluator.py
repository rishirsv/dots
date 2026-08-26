from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


PLUGIN_ROOT = Path(__file__).resolve().parents[1]
EVALUATOR = PLUGIN_ROOT / "skills" / "skill-evaluator"


def load_module(name: str, path: Path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


validator = load_module("skill_eval_validator", EVALUATOR / "scripts" / "validate_eval.py")
aggregator = load_module("skill_eval_aggregator", EVALUATOR / "scripts" / "aggregate_eval.py")
reviewer = load_module("skill_eval_review", EVALUATOR / "scripts" / "generate_review.py")


def write_suite(root: Path, *, approved: bool = True) -> tuple[Path, dict]:
    skill = root / "skill"
    skill.mkdir()
    skill_file = skill / "SKILL.md"
    skill_file.write_text("---\nname: example\ndescription: Example.\n---\n", encoding="utf-8")
    suite = root / "suite"
    suite.mkdir()
    (suite / "eval.md").write_text("# Evaluation\n", encoding="utf-8")
    fixture = suite / "fixtures" / "input.txt"
    fixture.parent.mkdir()
    fixture.write_text("input\n", encoding="utf-8")
    data = {
        "schema_version": 1,
        "kind": "skill-evaluation-suite",
        "suite": {
            "id": "suite-1", "name": "Example", "status": "approved" if approved else "draft",
            "approved_at": "2026-08-25T12:00:00Z" if approved else None,
            "approved_scope_sha256": None,
        },
        "target": {
            "id": "target-skill", "skill": "example",
            "files": [{"id": "target-skill-md", "path": "skill/SKILL.md", "sha256": validator.sha256_file(skill_file)}],
        },
        "fixtures": [{
            "id": "input-fixture", "path": "fixtures/input.txt",
            "sha256": validator.sha256_file(fixture), "visibility": "worker",
        }],
        "claim": {"kind": "absolute", "decision": "Use it", "statement": "Works", "limits": []},
        "configurations": [{
            "id": "target", "role": "target", "skill_ref": "skill",
            "skill_file_ids": ["target-skill-md"], "host": "Codex", "model": "model",
            "tools": [], "permissions": [],
        }],
        "graders": [{
            "id": "criterion-1", "kind": "human", "criterion": "Pass iff it works",
            "path": None, "sha256": None, "calibration": "unproven",
        }],
        "cases": [{
            "id": "case-1", "name": "Case", "split": "working", "prompt": "Complete this task",
            "fixture_refs": ["input-fixture"], "configuration_ids": ["target"],
            "grader_ids": ["criterion-1"], "expected_outcomes": [], "accepted_alternatives": [],
            "prohibited_outcomes": [], "invalid_run_conditions": [],
            "depends_on": ["target-skill-md", "input-fixture", "target", "criterion-1"],
        }],
        "run_policy": {"repetitions": 1, "timeout_seconds": None, "maximum_expected_cost": None, "external_mutations": False},
    }
    if approved:
        data["suite"]["approved_scope_sha256"] = validator.approval_digest(data)
    (suite / "cases.json").write_text(json.dumps(data, indent=2), encoding="utf-8")
    return suite, data


def run_header(snapshot_hash: str = "0" * 64) -> dict:
    return {
        "run_id": "r", "suite_id": "s", "status": "completed",
        "resolved_manifest": {
            "suite_snapshot": "suite.json", "suite_snapshot_sha256": snapshot_hash,
            "dependencies": [{"id": "target", "sha256": "a" * 64}],
            "configurations": [{"id": "target", "host": "Codex", "model": "model"}],
            "host_instructions": [], "run_policy": {"repetitions": 1},
        },
        "preflight": {"status": "passed", "checks": []},
    }


class SuiteValidationTests(unittest.TestCase):
    def test_valid_approved_suite_passes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            suite, _ = write_suite(root)
            self.assertEqual(validator.validate_suite(suite, root), [])
            result = subprocess.run(
                [sys.executable, str(EVALUATOR / "scripts" / "validate_eval.py"), str(suite), "--workspace-root", str(root)],
                cwd=PLUGIN_ROOT.parent.parent,
                capture_output=True,
                text=True,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stderr)

    def test_target_change_stales_evidence_without_changing_approval_contract(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            suite, data = write_suite(root)
            approved_digest = data["suite"]["approved_scope_sha256"]
            (root / "skill" / "SKILL.md").write_text("changed\n", encoding="utf-8")
            errors = validator.validate_suite(suite, root)
            self.assertTrue(any("target.files[0].sha256: hash mismatch" in error for error in errors))
            self.assertFalse(any("approved_scope_sha256" in error for error in errors))
            self.assertEqual(validator.approval_digest(data), approved_digest)

    def test_contract_change_requires_reapproval(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            suite, data = write_suite(root)
            data["claim"]["statement"] = "Different claim"
            (suite / "cases.json").write_text(json.dumps(data), encoding="utf-8")
            errors = validator.validate_suite(suite, root)
            self.assertTrue(any("approved_scope_sha256" in error for error in errors))

    def test_approved_suite_requires_executable_cases_and_criteria(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            suite, data = write_suite(root)
            data["claim"]["statement"] = ""
            data["graders"][0]["criterion"] = ""
            data["cases"][0].pop("prompt")
            data["suite"]["approved_scope_sha256"] = validator.approval_digest(data)
            (suite / "cases.json").write_text(json.dumps(data), encoding="utf-8")
            errors = validator.validate_suite(suite, root)
            self.assertIn("claim.statement: expected non-empty text", errors)
            self.assertIn("graders[0].criterion: expected non-empty text", errors)
            self.assertIn("cases[0].prompt: expected non-empty text", errors)

            data["claim"]["statement"] = "Works"
            data["graders"][0]["criterion"] = "Pass iff it works"
            data["cases"] = []
            data["suite"]["approved_scope_sha256"] = validator.approval_digest(data)
            (suite / "cases.json").write_text(json.dumps(data), encoding="utf-8")
            self.assertIn(
                "cases: approved suites need at least one case",
                validator.validate_suite(suite, root),
            )

    def test_traversal_and_escaping_symlink_are_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            suite, data = write_suite(root, approved=False)
            data["fixtures"][0]["path"] = "../outside.txt"
            (root / "outside.txt").write_text("secret", encoding="utf-8")
            (suite / "cases.json").write_text(json.dumps(data), encoding="utf-8")
            errors = validator.validate_suite(suite, root)
            self.assertTrue(any("cannot contain '..'" in error for error in errors))

            data["fixtures"][0]["path"] = "fixtures/escape.txt"
            link = suite / "fixtures" / "escape.txt"
            link.symlink_to(root / "outside.txt")
            (suite / "cases.json").write_text(json.dumps(data), encoding="utf-8")
            errors = validator.validate_suite(suite, root)
            self.assertTrue(any("path escapes declared root" in error for error in errors))

    def test_nonhuman_grader_requires_a_real_hashed_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            suite, data = write_suite(root, approved=False)
            data["graders"][0].update({
                "kind": "semantic", "path": None, "sha256": "a" * 64,
            })
            (suite / "cases.json").write_text(json.dumps(data), encoding="utf-8")
            errors = validator.validate_suite(suite, root)
            self.assertIn("graders[0]: non-human grader needs path and sha256", errors)

    def test_case_dependency_graph_must_close_over_selected_inputs(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            suite, data = write_suite(root, approved=False)
            data["cases"][0]["depends_on"] = ["target-skill-md"]
            (suite / "cases.json").write_text(json.dumps(data), encoding="utf-8")
            errors = validator.validate_suite(suite, root)
            self.assertTrue(any("missing selected dependencies" in error for error in errors))

    def test_target_configuration_requires_target_file_dependency(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            suite, data = write_suite(root, approved=False)
            data["configurations"][0]["skill_file_ids"] = []
            data["cases"][0]["depends_on"].remove("target-skill-md")
            (suite / "cases.json").write_text(json.dumps(data), encoding="utf-8")
            errors = validator.validate_suite(suite, root)
            self.assertTrue(any("needs at least one target file" in error for error in errors))

    def test_approved_case_requires_configuration_and_grader(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            suite, data = write_suite(root)
            data["cases"][0]["configuration_ids"] = []
            data["cases"][0]["grader_ids"] = []
            data["cases"][0]["depends_on"] = ["target-skill-md", "input-fixture"]
            data["suite"]["approved_scope_sha256"] = validator.approval_digest(data)
            (suite / "cases.json").write_text(json.dumps(data), encoding="utf-8")
            errors = validator.validate_suite(suite, root)
            self.assertIn("cases[0].configuration_ids: approved case needs a configuration", errors)
            self.assertIn("cases[0].grader_ids: approved case needs a grader", errors)

    def test_nested_directory_symlink_is_rejected_before_hashing(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            suite, data = write_suite(root, approved=False)
            outside = root / "outside.txt"
            outside.write_text("secret", encoding="utf-8")
            directory = suite / "fixtures" / "directory"
            directory.mkdir()
            (directory / "escape.txt").symlink_to(outside)
            data["fixtures"][0].update({"path": "fixtures/directory", "sha256": "0" * 64})
            (suite / "cases.json").write_text(json.dumps(data), encoding="utf-8")
            errors = validator.validate_suite(suite, root)
            self.assertTrue(any("symlink is not allowed" in error for error in errors))


class AggregateTests(unittest.TestCase):
    def test_aggregates_assessments_and_excludes_invalid_system_failures(self):
        assessments = [{
            "criterion_id": "c", "grader_id": "g", "grader_sha256": "a" * 64,
            "prediction": "pass", "human_label": "pass", "split": "test",
            "evidence_refs": [], "raw_result_ref": None, "invalidity_reason": None,
        }]
        data = {
            "schema_version": 1, "kind": "skill-evaluation-run", **run_header(),
            "trials": [
                {"id": "t1", "case_id": "case", "configuration_id": "target", "repetition": 1, "status": "completed", "classification": "none", "outcome": "pass", "assessments": assessments, "evidence": [], "artifacts": [], "errors": [], "metrics": {"duration_seconds": 2}},
                {"id": "t2", "case_id": "bad", "configuration_id": "target", "repetition": 1, "status": "invalid", "classification": "harness", "outcome": "not-run", "assessments": [], "evidence": [], "artifacts": [], "errors": [], "metrics": {}},
                {"id": "t3", "case_id": "infra", "configuration_id": "target", "repetition": 1, "status": "completed", "classification": "infrastructure", "outcome": "fail", "assessments": [], "evidence": [], "artifacts": [], "errors": [], "metrics": {}},
            ],
            "limitations": [],
        }
        summary = aggregator.aggregate_run(data)
        self.assertEqual(summary["trial_status_counts"], {"completed": 2, "invalid": 1})
        self.assertEqual(summary["scored_outcome_counts"], {"pass": 1})
        calibration = summary["grader_calibration"][0]
        self.assertEqual(calibration["true_pass_rate"], 1.0)
        self.assertIsNone(calibration["true_fail_rate"])

        pairs = [(1, 1), (1, 1), (0, 0), (0, 0)]
        corrected = aggregator.corrected_rate(pairs, [1, 0, 1])
        assert corrected is not None
        self.assertAlmostEqual(corrected["corrected_pass_rate"], 2 / 3)
        self.assertIsNotNone(corrected["confidence_interval_95"])

    def test_incompatible_grader_versions_mark_summary_invalid_and_cli_fails(self):
        def trial(identifier: str, grader_hash: str) -> dict:
            return {
                "id": identifier, "case_id": "case", "configuration_id": "target",
                "repetition": 1 if identifier == "t1" else 2,
                "status": "completed", "classification": "none", "outcome": "pass", "metrics": {},
                "evidence": [], "artifacts": [], "errors": [],
                "assessments": [{
                    "criterion_id": "criterion", "grader_id": "grader", "grader_sha256": grader_hash,
                    "prediction": "pass", "human_label": "none", "split": "working",
                    "evidence_refs": [], "raw_result_ref": None, "invalidity_reason": None,
                }],
            }
        data = {
            "schema_version": 1, "kind": "skill-evaluation-run", **run_header(),
            "trials": [trial("t1", "a" * 64), trial("t2", "b" * 64)], "limitations": [],
        }
        summary = aggregator.aggregate_run(data)
        self.assertEqual(summary["status"], "invalid")
        self.assertTrue(any("incompatible versions" in error for error in summary["validation_errors"]))
        self.assertEqual(summary["criterion_results"][0]["grader_sha256"], "a" * 64)

        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp) / "run"
            run_dir.mkdir()
            snapshot = run_dir / "suite.json"
            snapshot.write_text("{}\n", encoding="utf-8")
            data["resolved_manifest"]["suite_snapshot_sha256"] = validator.sha256_file(snapshot)
            (run_dir / "run.json").write_text(json.dumps(data), encoding="utf-8")
            output = run_dir / "summary.json"
            result = subprocess.run(
                [sys.executable, str(EVALUATOR / "scripts" / "aggregate_eval.py"), str(run_dir), "--out", str(output)],
                capture_output=True,
                text=True,
                check=False,
            )
            self.assertEqual(result.returncode, 1)
            self.assertTrue(output.exists())

    def test_fixture_failures_are_unscored_and_unknown_classifications_are_invalid(self):
        def trial(identifier: str, classification: str) -> dict:
            return {
                "id": identifier, "case_id": identifier, "configuration_id": "target",
                "repetition": 1, "status": "completed", "classification": classification,
                "outcome": "fail", "assessments": [], "evidence": [], "artifacts": [],
                "metrics": {}, "errors": [],
            }
        data = {
            "schema_version": 1, "kind": "skill-evaluation-run", **run_header(),
            "trials": [trial("fixture", "fixture"), trial("mystery", "typo")],
            "limitations": [],
        }
        summary = aggregator.aggregate_run(data)
        self.assertEqual(summary["scored_outcome_counts"], {})
        self.assertEqual(summary["status"], "invalid")
        self.assertTrue(any("classification is invalid" in error for error in summary["validation_errors"]))

    def test_completed_run_requires_full_snapshot_coverage(self):
        with tempfile.TemporaryDirectory() as tmp:
            run_dir = Path(tmp)
            snapshot = {
                "run_policy": {"repetitions": 1},
                "cases": [{"id": "case-1", "configuration_ids": ["target"]}],
            }
            snapshot_path = run_dir / "suite.json"
            snapshot_path.write_text(json.dumps(snapshot), encoding="utf-8")
            data = {
                "schema_version": 1, "kind": "skill-evaluation-run",
                **run_header(validator.sha256_file(snapshot_path)),
                "trials": [{
                    "id": "wrong", "case_id": "case-2", "configuration_id": "target",
                    "repetition": 1, "status": "completed", "classification": "none",
                    "outcome": "pass", "assessments": [], "evidence": [], "artifacts": [],
                    "metrics": {}, "errors": [],
                }],
                "limitations": [],
            }
            summary = aggregator.aggregate_run(data, run_dir)
            self.assertEqual(summary["status"], "invalid")
            self.assertTrue(any("missing planned trials" in error for error in summary["validation_errors"]))
            self.assertTrue(any("not present in the suite snapshot" in error for error in summary["validation_errors"]))

    def test_resolved_manifest_must_match_approved_snapshot(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            suite, snapshot = write_suite(root)
            run_dir = root / "run"
            run_dir.mkdir()
            snapshot_path = run_dir / "suite.json"
            snapshot_path.write_text(json.dumps(snapshot), encoding="utf-8")
            dependencies = [
                {"id": item["id"], "sha256": item["sha256"]}
                for item in snapshot["target"]["files"] + snapshot["fixtures"]
            ]
            data = {
                "schema_version": 1, "kind": "skill-evaluation-run",
                "run_id": "run-1", "suite_id": "suite-1", "status": "completed",
                "resolved_manifest": {
                    "suite_snapshot": "suite.json",
                    "suite_snapshot_sha256": validator.sha256_file(snapshot_path),
                    "dependencies": dependencies,
                    "configurations": snapshot["configurations"],
                    "host_instructions": [],
                    "run_policy": snapshot["run_policy"],
                },
                "preflight": {"status": "passed", "checks": []},
                "trials": [{
                    "id": "t1", "case_id": "case-1", "configuration_id": "target",
                    "repetition": 1, "status": "completed", "classification": "none",
                    "outcome": "pass", "assessments": [{
                        "criterion_id": "criterion-1", "grader_id": "criterion-1",
                        "grader_sha256": None, "prediction": "pass", "human_label": "none",
                        "split": "working", "invalidity_reason": None,
                    }], "evidence": [], "artifacts": [],
                    "metrics": {}, "errors": [],
                }],
                "limitations": [],
            }
            self.assertEqual(aggregator.aggregate_run(data, run_dir)["status"], "complete")
            data["resolved_manifest"]["dependencies"] = [{}]
            summary = aggregator.aggregate_run(data, run_dir)
            self.assertEqual(summary["status"], "invalid")
            self.assertTrue(any("do not match" in error for error in summary["validation_errors"]))

    def test_scored_trial_requires_assessments_and_matching_outcome(self):
        data = {
            "schema_version": 1, "kind": "skill-evaluation-run", **run_header(),
            "trials": [{
                "id": "t1", "case_id": "case", "configuration_id": "target",
                "repetition": 1, "status": "completed", "classification": "none",
                "outcome": "pass", "assessments": [], "evidence": [], "artifacts": [],
                "metrics": {}, "errors": [],
            }],
            "limitations": [],
        }
        summary = aggregator.aggregate_run(data)
        self.assertEqual(summary["status"], "invalid")
        self.assertEqual(summary["scored_outcome_counts"], {})
        self.assertTrue(any("needs assessments" in error for error in summary["validation_errors"]))

    def test_cancelled_run_preserves_source_status(self):
        data = {
            "schema_version": 1, "kind": "skill-evaluation-run", **run_header(),
            "status": "cancelled", "preflight": {"status": "not-run", "checks": []},
            "trials": [], "limitations": ["worker unavailable"],
        }
        summary = aggregator.aggregate_run(data)
        self.assertEqual(summary["aggregation_status"], "valid")
        self.assertEqual(summary["run_status"], "cancelled")
        self.assertEqual(summary["status"], "cancelled")


class ReviewGenerationTests(unittest.TestCase):
    def test_generates_safe_standalone_page(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            review_path = root / "review.json"
            output_path = root / "review.html"
            data = {
                "schema_version": 1, "kind": "skill-evaluation-review", "mode": "case-review",
                "review_id": "review-1",
                "title": "Review", "claim": "Claim", "items": [{
                    "id": "item-1", "label": "Item", "status": "ready",
                    "blocks": [{"kind": "text", "format": "plain", "text": "</script><script>alert(1)</script>"}],
                    "evidence_refs": [],
                }],
                "summary": {}, "annotations": [], "suggestions": [], "taxonomy": [],
                "coverage": {}, "blind_pairs": [], "provenance": [],
            }
            review_path.write_text(json.dumps(data), encoding="utf-8")
            reviewer.generate(review_path, output_path)
            rendered = output_path.read_text(encoding="utf-8")
            self.assertNotIn("</script><script>alert(1)</script>", rendered)
            self.assertIn("\\u003c/script>", rendered)
            self.assertNotIn(reviewer.SENTINEL, rendered)
            self.assertIn('"review_id":"review-1"', rendered)
            self.assertIn('"review_sha256":"', rendered)
            prepared = reviewer.prepare_review_data(data, root)
            block = prepared["items"][0]["blocks"][0]
            self.assertEqual(block["canonical_text"], "</script><script>alert(1)</script>")
            self.assertEqual(len(block["content_sha256"]), 64)
            template = (EVALUATOR / "assets" / "review-interface.html").read_text(encoding="utf-8")
            self.assertIn('offset_unit: "unicode-code-points"', template)

    def test_review_file_cannot_escape_data_root(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "outside.txt").write_text("outside", encoding="utf-8")
            review_root = root / "review"
            review_root.mkdir()
            data = {
                "schema_version": 1, "kind": "skill-evaluation-review", "mode": "case-review",
                "review_id": "review-escape",
                "title": "Review", "items": [{"id": "i", "label": "I", "status": "ready", "evidence_refs": [],
                    "blocks": [{"kind": "file", "path": "../outside.txt", "media_type": "text/plain", "label": "Outside"}]}],
            }
            path = review_root / "review.json"
            path.write_text(json.dumps(data), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "cannot contain"):
                reviewer.generate(path, review_root / "out.html")

    def test_blind_pairs_reject_identity_mapping_and_malformed_members(self):
        base = {
            "schema_version": 1, "kind": "skill-evaluation-review",
            "mode": "blind-comparison", "review_id": "blind", "title": "Blind",
            "items": [{"id": "i", "label": "Pair", "status": "ready", "blocks": []}],
            "blind_pairs": [{"id": "p", "item_id": "i", "labels": ["A", "B"], "mapping": "A=target"}],
        }
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(ValueError, "leaks identity fields"):
                reviewer.prepare_review_data(base, Path(tmp))
            base["blind_pairs"] = ["not-an-object"]
            with self.assertRaisesRegex(ValueError, "must be an object"):
                reviewer.prepare_review_data(base, Path(tmp))

    def test_review_digest_changes_when_referenced_file_changes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source = root / "evidence.txt"
            source.write_text("one", encoding="utf-8")
            raw = {
                "schema_version": 1, "kind": "skill-evaluation-review", "mode": "case-review",
                "review_id": "files", "title": "Files", "items": [{
                    "id": "i", "label": "I", "status": "ready",
                    "blocks": [{"kind": "file", "path": "evidence.txt", "media_type": "text/plain", "label": "Evidence"}],
                }],
            }
            first = reviewer.review_digest(reviewer.prepare_review_data(raw, root))
            prepared = reviewer.prepare_review_data(raw, root)
            self.assertTrue(prepared["items"][0]["blocks"][0]["href"].startswith("data:application/octet-stream;base64,"))
            self.assertEqual(prepared["items"][0]["blocks"][0]["download_name"], "evidence.txt")
            source.write_text("two", encoding="utf-8")
            second = reviewer.review_digest(reviewer.prepare_review_data(raw, root))
            self.assertNotEqual(first, second)

    def test_blind_review_rejects_visible_provenance(self):
        raw = {
            "schema_version": 1, "kind": "skill-evaluation-review",
            "mode": "blind-comparison", "review_id": "blind", "title": "Blind",
            "items": [{"id": "i", "label": "Pair", "status": "ready", "blocks": []}],
            "blind_pairs": [{"id": "p", "item_id": "i", "labels": ["A", "B"]}],
            "provenance": ["candidate=A"],
        }
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(ValueError, "coordinator-only"):
                reviewer.prepare_review_data(raw, Path(tmp))

    def test_blind_review_requires_fixed_opaque_labels(self):
        raw = {
            "schema_version": 1, "kind": "skill-evaluation-review",
            "mode": "blind-comparison", "review_id": "blind", "title": "Blind",
            "items": [{"id": "i", "label": "Pair", "status": "ready", "blocks": []}],
            "blind_pairs": [{"id": "p", "item_id": "i", "labels": ["target", "baseline"]}],
        }
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(ValueError, "exactly"):
                reviewer.prepare_review_data(raw, Path(tmp))


if __name__ == "__main__":
    unittest.main()

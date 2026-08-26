#!/usr/bin/env python3
"""Aggregate typed skill-evaluation trials without flattening missing evidence."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import random
import statistics
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


VALID_TRIAL_STATUSES = {"completed", "invalid", "cancelled", "not-run"}
VALID_OUTCOMES = {"pass", "fail", "mixed", "inconclusive", "not-run"}
VALID_CLASSIFICATIONS = {
    "none", "capability", "missing-information", "harness", "fixture",
    "environment", "false-rejection", "false-acceptance", "leakage",
    "infrastructure",
}
SCORED_CLASSIFICATIONS = {"none", "capability"}
HASH_KEYS = {"sha256", "approved_at", "approved_scope_sha256"}


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validate_run_header(data: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for field in ("run_id", "suite_id"):
        if not isinstance(data.get(field), str) or not data.get(field, "").strip():
            errors.append(f"{field} must be non-empty text")
    if data.get("status") not in {"completed", "partial", "invalid", "cancelled"}:
        errors.append("status is invalid")
    manifest = data.get("resolved_manifest")
    if not isinstance(manifest, dict):
        return errors + ["resolved_manifest must be an object"]
    if not isinstance(manifest.get("suite_snapshot"), str) or not manifest.get("suite_snapshot", "").strip():
        errors.append("resolved_manifest.suite_snapshot must be a relative path")
    digest = manifest.get("suite_snapshot_sha256")
    if not isinstance(digest, str) or len(digest) != 64:
        errors.append("resolved_manifest.suite_snapshot_sha256 must be a SHA-256 digest")
    for field in ("dependencies", "configurations", "host_instructions"):
        if not isinstance(manifest.get(field), list):
            errors.append(f"resolved_manifest.{field} must be an array")
    if not isinstance(manifest.get("run_policy"), dict):
        errors.append("resolved_manifest.run_policy must be an object")
    preflight = data.get("preflight")
    if not isinstance(preflight, dict):
        errors.append("preflight must be an object")
    else:
        if preflight.get("status") not in {"not-run", "passed", "failed"}:
            errors.append("preflight.status is invalid")
        if not isinstance(preflight.get("checks"), list):
            errors.append("preflight.checks must be an array")
    if data.get("status") in {"completed", "partial"}:
        if not manifest.get("configurations"):
            errors.append("completed or partial runs need resolved configurations")
        if not manifest.get("dependencies"):
            errors.append("completed or partial runs need resolved dependencies")
        if not manifest.get("run_policy"):
            errors.append("completed or partial runs need a resolved run policy")
        if not isinstance(preflight, dict) or preflight.get("status") != "passed":
            errors.append("completed or partial runs need a passed preflight")
    return errors


def validate_snapshot(run_dir: Path, data: dict[str, Any]) -> list[str]:
    manifest = data.get("resolved_manifest")
    if not isinstance(manifest, dict):
        return []
    raw = manifest.get("suite_snapshot")
    if not isinstance(raw, str) or not raw:
        return []
    path, path_error = resolve_snapshot_path(run_dir, raw)
    if path_error:
        return [path_error]
    assert path is not None
    if not path.is_file():
        return [f"resolved_manifest.suite_snapshot does not exist: {raw}"]
    if sha256_file(path) != manifest.get("suite_snapshot_sha256"):
        return ["resolved_manifest.suite_snapshot_sha256 does not match the snapshot"]
    return []


def resolve_snapshot_path(run_dir: Path, raw: str) -> tuple[Path | None, str | None]:
    candidate = Path(raw)
    if candidate.is_absolute() or ".." in candidate.parts:
        return None, "resolved_manifest.suite_snapshot must remain beneath the run directory"
    root = run_dir.resolve()
    path = (root / candidate).resolve()
    try:
        path.relative_to(root)
    except ValueError:
        return None, "resolved_manifest.suite_snapshot escapes the run directory"
    return path, None


def load_snapshot(run_dir: Path, data: dict[str, Any]) -> dict[str, Any] | None:
    manifest = data.get("resolved_manifest")
    if not isinstance(manifest, dict):
        return None
    raw = manifest.get("suite_snapshot")
    if not isinstance(raw, str):
        return None
    path, error = resolve_snapshot_path(run_dir, raw)
    if error or path is None:
        return None
    try:
        loaded = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None
    return loaded if isinstance(loaded, dict) else None


def canonical_contract(data: dict[str, Any]) -> dict[str, Any]:
    def scrub(value: Any) -> Any:
        if isinstance(value, dict):
            return {
                key: scrub(item)
                for key, item in sorted(value.items())
                if key not in HASH_KEYS
            }
        if isinstance(value, list):
            return [scrub(item) for item in value]
        return value

    return scrub(data)


def approval_digest(data: dict[str, Any]) -> str:
    encoded = json.dumps(
        canonical_contract(data), sort_keys=True, separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def validate_resolved_manifest(snapshot: dict[str, Any], data: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if snapshot.get("schema_version") != 1 or snapshot.get("kind") != "skill-evaluation-suite":
        return ["suite snapshot is not a schema_version 1 skill-evaluation-suite"]
    suite = snapshot.get("suite")
    if not isinstance(suite, dict) or suite.get("status") != "approved":
        errors.append("suite snapshot must be approved")
    elif suite.get("approved_scope_sha256") != approval_digest(snapshot):
        errors.append("suite snapshot approval digest is invalid")
    if isinstance(suite, dict) and suite.get("id") != data.get("suite_id"):
        errors.append("run suite_id does not match the suite snapshot")

    manifest = data.get("resolved_manifest")
    if not isinstance(manifest, dict):
        return errors
    snapshot_configurations = snapshot.get("configurations")
    manifest_configurations = manifest.get("configurations")
    if isinstance(snapshot_configurations, list) and isinstance(manifest_configurations, list):
        snapshot_by_id = {
            item.get("id"): item for item in snapshot_configurations
            if isinstance(item, dict) and isinstance(item.get("id"), str)
        }
        manifest_by_id = {
            item.get("id"): item for item in manifest_configurations
            if isinstance(item, dict) and isinstance(item.get("id"), str)
        }
        if set(snapshot_by_id) != set(manifest_by_id):
            errors.append("resolved configurations do not match suite snapshot IDs")
        for identifier in sorted(set(snapshot_by_id).intersection(manifest_by_id)):
            for field in (
                "role", "skill_ref", "skill_file_ids", "host", "model", "tools", "permissions",
            ):
                if manifest_by_id[identifier].get(field) != snapshot_by_id[identifier].get(field):
                    errors.append(
                        f"resolved configuration {identifier!r} field {field!r} does not match the snapshot"
                    )

    expected_dependencies: dict[str, str] = {}
    target = snapshot.get("target")
    collections = [target.get("files", [])] if isinstance(target, dict) else [[]]
    collections.extend([snapshot.get("fixtures", []), snapshot.get("graders", [])])
    for collection in collections:
        if not isinstance(collection, list):
            continue
        for item in collection:
            if (
                isinstance(item, dict)
                and isinstance(item.get("id"), str)
                and isinstance(item.get("sha256"), str)
            ):
                expected_dependencies[item["id"]] = item["sha256"]
    manifest_dependencies = manifest.get("dependencies")
    actual_dependencies: dict[str, str] = {}
    if isinstance(manifest_dependencies, list):
        for index, dependency in enumerate(manifest_dependencies):
            if not isinstance(dependency, dict):
                errors.append(f"resolved_manifest.dependencies[{index}] must be an object")
                continue
            identifier = dependency.get("id")
            digest = dependency.get("sha256")
            if not isinstance(identifier, str) or not isinstance(digest, str) or len(digest) != 64:
                errors.append(f"resolved_manifest.dependencies[{index}] needs id and sha256")
                continue
            if identifier in actual_dependencies:
                errors.append(f"resolved_manifest.dependencies duplicates {identifier!r}")
            actual_dependencies[identifier] = digest
    if actual_dependencies != expected_dependencies:
        errors.append("resolved dependency IDs and hashes do not match the suite snapshot")
    if manifest.get("run_policy") != snapshot.get("run_policy"):
        errors.append("resolved run policy does not match the suite snapshot")
    for index, instruction in enumerate(manifest.get("host_instructions", [])):
        if not isinstance(instruction, dict) or not isinstance(instruction.get("id"), str):
            errors.append(f"resolved_manifest.host_instructions[{index}] needs a stable id")
        digest = instruction.get("sha256") if isinstance(instruction, dict) else None
        if not isinstance(digest, str) or len(digest) != 64:
            errors.append(f"resolved_manifest.host_instructions[{index}] needs sha256")
    return errors


def expected_trials(snapshot: dict[str, Any]) -> set[tuple[str, str, int]]:
    policy = snapshot.get("run_policy")
    repetitions = policy.get("repetitions") if isinstance(policy, dict) else None
    if not isinstance(repetitions, int) or isinstance(repetitions, bool) or repetitions < 1:
        return set()
    expected: set[tuple[str, str, int]] = set()
    cases = snapshot.get("cases")
    if not isinstance(cases, list):
        return expected
    for case in cases:
        if not isinstance(case, dict) or not isinstance(case.get("id"), str):
            continue
        configurations = case.get("configuration_ids")
        if not isinstance(configurations, list):
            continue
        for configuration in configurations:
            if isinstance(configuration, str):
                for repetition in range(1, repetitions + 1):
                    expected.add((case["id"], configuration, repetition))
    return expected


def validate_run_path(run_dir: Path, raw: Any, label: str) -> str | None:
    value = raw.get("path") if isinstance(raw, dict) else raw
    if not isinstance(value, str) or not value:
        return f"{label} must be a relative path or an object with a path"
    candidate = Path(value)
    if candidate.is_absolute() or ".." in candidate.parts:
        return f"{label} must remain beneath the run directory"
    root = run_dir.resolve()
    path = (root / candidate).resolve()
    try:
        path.relative_to(root)
    except ValueError:
        return f"{label} escapes the run directory"
    if not path.exists():
        return f"{label} does not exist: {value}"
    return None


def wilson_interval(successes: int, total: int, z: float = 1.96) -> list[float] | None:
    if total <= 0:
        return None
    proportion = successes / total
    denominator = 1 + z * z / total
    center = (proportion + z * z / (2 * total)) / denominator
    margin = z * math.sqrt(
        proportion * (1 - proportion) / total + z * z / (4 * total * total)
    ) / denominator
    return [max(0.0, center - margin), min(1.0, center + margin)]


def rates(pairs: list[tuple[int, int]]) -> tuple[float, float] | None:
    human_pass = [prediction for human, prediction in pairs if human == 1]
    human_fail = [prediction for human, prediction in pairs if human == 0]
    if not human_pass or not human_fail:
        return None
    tpr = sum(human_pass) / len(human_pass)
    tnr = sum(1 - prediction for prediction in human_fail) / len(human_fail)
    return tpr, tnr


def corrected_rate(pairs: list[tuple[int, int]], predictions: list[int]) -> dict[str, Any] | None:
    measured = rates(pairs)
    if measured is None or not predictions:
        return None
    tpr, tnr = measured
    denominator = tpr + tnr - 1
    if abs(denominator) < 0.05:
        return {"status": "invalid", "reason": "grader is too close to random"}
    observed = sum(predictions) / len(predictions)
    estimate = min(1.0, max(0.0, (observed + tnr - 1) / denominator))

    interval: list[float] | None = None
    if len(pairs) >= 2 and len(predictions) >= 2:
        generator = random.Random(0)
        samples: list[float] = []
        for _ in range(2000):
            sampled_pairs = [generator.choice(pairs) for _ in pairs]
            sampled_predictions = [generator.choice(predictions) for _ in predictions]
            sampled_rates = rates(sampled_pairs)
            if sampled_rates is None:
                continue
            sampled_tpr, sampled_tnr = sampled_rates
            sampled_denominator = sampled_tpr + sampled_tnr - 1
            if abs(sampled_denominator) < 0.05:
                continue
            sampled_observed = sum(sampled_predictions) / len(sampled_predictions)
            samples.append(min(1.0, max(0.0, (sampled_observed + sampled_tnr - 1) / sampled_denominator)))
        if len(samples) >= 100:
            samples.sort()
            interval = [samples[int(0.025 * len(samples))], samples[int(0.975 * len(samples)) - 1]]

    return {
        "status": "estimated",
        "observed_pass_rate": observed,
        "corrected_pass_rate": estimate,
        "confidence_interval_95": interval,
    }


def aggregate_run(data: dict[str, Any], run_dir: Path | None = None) -> dict[str, Any]:
    if not isinstance(data, dict):
        raise ValueError("run.json must contain an object")
    if data.get("schema_version") != 1 or data.get("kind") != "skill-evaluation-run":
        raise ValueError("run.json must be schema_version 1 and kind skill-evaluation-run")
    trials = data.get("trials")
    if not isinstance(trials, list):
        raise ValueError("run.json trials must be an array")
    if data.get("status") in {"completed", "partial"} and not trials:
        raise ValueError("completed or partial runs need planned trial records")

    status_counts: Counter[str] = Counter()
    outcome_counts: Counter[str] = Counter()
    results: dict[tuple[str, str, str, str, str | None], Counter[str]] = defaultdict(Counter)
    calibration: dict[tuple[str, str | None, str], list[tuple[int, int]]] = defaultdict(list)
    unlabeled: dict[tuple[str, str | None], list[int]] = defaultdict(list)
    grader_versions: dict[str, str | None] = {}
    durations: list[float] = []
    errors: list[str] = validate_run_header(data)
    trial_ids: set[str] = set()
    trial_keys: Counter[tuple[str, str, int]] = Counter()
    snapshot = load_snapshot(run_dir, data) if run_dir is not None else None
    case_by_id: dict[str, dict[str, Any]] = {}
    snapshot_grader_hashes: dict[str, str | None] = {}
    if snapshot is not None:
        errors.extend(validate_resolved_manifest(snapshot, data))
        case_by_id = {
            item["id"]: item for item in snapshot.get("cases", [])
            if isinstance(item, dict) and isinstance(item.get("id"), str)
        }
        snapshot_grader_hashes = {
            item["id"]: item.get("sha256") for item in snapshot.get("graders", [])
            if isinstance(item, dict) and isinstance(item.get("id"), str)
        }

    for index, raw_trial in enumerate(trials):
        if not isinstance(raw_trial, dict):
            errors.append(f"trials[{index}] is not an object")
            continue
        status = raw_trial.get("status")
        if status not in VALID_TRIAL_STATUSES:
            errors.append(f"trials[{index}].status is invalid")
            continue
        status_counts[status] += 1
        trial_id = raw_trial.get("id")
        if not isinstance(trial_id, str) or not trial_id:
            errors.append(f"trials[{index}].id is missing")
        elif trial_id in trial_ids:
            errors.append(f"trials[{index}].id is duplicated: {trial_id}")
        else:
            trial_ids.add(trial_id)
        for field in ("case_id", "configuration_id"):
            if not isinstance(raw_trial.get(field), str) or not raw_trial.get(field):
                errors.append(f"trials[{index}].{field} is missing")
        repetition = raw_trial.get("repetition")
        if not isinstance(repetition, int) or isinstance(repetition, bool) or repetition < 1:
            errors.append(f"trials[{index}].repetition is invalid")
        elif isinstance(raw_trial.get("case_id"), str) and isinstance(raw_trial.get("configuration_id"), str):
            trial_keys[(raw_trial["case_id"], raw_trial["configuration_id"], repetition)] += 1
        for field in ("evidence", "artifacts", "errors"):
            if not isinstance(raw_trial.get(field), list):
                errors.append(f"trials[{index}].{field} is not an array")
            elif run_dir is not None and field in {"evidence", "artifacts"}:
                for path_index, path_value in enumerate(raw_trial[field]):
                    path_error = validate_run_path(
                        run_dir, path_value, f"trials[{index}].{field}[{path_index}]"
                    )
                    if path_error:
                        errors.append(path_error)
        if not isinstance(raw_trial.get("metrics"), dict):
            errors.append(f"trials[{index}].metrics is not an object")
        if status != "completed":
            continue
        trial_error_count = len(errors)
        classification = raw_trial.get("classification", "none")
        if classification not in VALID_CLASSIFICATIONS:
            errors.append(f"trials[{index}].classification is invalid: {classification!r}")
            continue
        outcome = raw_trial.get("outcome")
        if outcome not in VALID_OUTCOMES:
            errors.append(f"trials[{index}].outcome is invalid")
        metrics = raw_trial.get("metrics")
        if isinstance(metrics, dict) and isinstance(metrics.get("duration_seconds"), (int, float)):
            durations.append(float(metrics["duration_seconds"]))

        if classification not in SCORED_CLASSIFICATIONS:
            continue
        assessments = raw_trial.get("assessments", [])
        if not isinstance(assessments, list):
            errors.append(f"trials[{index}].assessments is not an array")
            continue
        pending_assessments: list[tuple[dict[str, Any], str, str, str | None, str]] = []
        for assessment_index, assessment in enumerate(assessments):
            if not isinstance(assessment, dict):
                errors.append(f"trials[{index}].assessments[{assessment_index}] is not an object")
                continue
            criterion = assessment.get("criterion_id")
            grader = assessment.get("grader_id")
            grader_sha256 = assessment.get("grader_sha256")
            prediction = assessment.get("prediction")
            if not isinstance(criterion, str) or not isinstance(grader, str):
                errors.append(f"trials[{index}].assessments[{assessment_index}] lacks stable IDs")
                continue
            if grader_sha256 is not None and (
                not isinstance(grader_sha256, str) or len(grader_sha256) != 64
            ):
                errors.append(f"trials[{index}].assessments[{assessment_index}].grader_sha256 is invalid")
                continue
            if grader in grader_versions and grader_versions[grader] != grader_sha256:
                errors.append(
                    f"trials[{index}].assessments[{assessment_index}]: grader {grader!r} "
                    "uses incompatible versions"
                )
                continue
            grader_versions[grader] = grader_sha256
            if prediction not in {"pass", "fail", "inconclusive"}:
                errors.append(f"trials[{index}].assessments[{assessment_index}].prediction is invalid")
                continue
            if assessment.get("invalidity_reason"):
                continue
            pending_assessments.append(
                (assessment, criterion, grader, grader_sha256, prediction)
            )

        actual_graders = [entry[2] for entry in pending_assessments]
        if not actual_graders:
            errors.append(f"trials[{index}]: scored completed trial needs assessments")
        if len(actual_graders) != len(set(actual_graders)):
            errors.append(f"trials[{index}]: grader assessments must be unique")
        if snapshot is not None:
            case_id = raw_trial.get("case_id")
            case = case_by_id.get(case_id) if isinstance(case_id, str) else None
            if case is None:
                errors.append(f"trials[{index}]: case is absent from the suite snapshot")
            else:
                required_graders = set(case.get("grader_ids", []))
                if set(actual_graders) != required_graders:
                    errors.append(
                        f"trials[{index}]: assessments do not match required graders "
                        f"{sorted(required_graders)!r}"
                    )
                for _, _, grader, grader_sha256, _ in pending_assessments:
                    if grader not in snapshot_grader_hashes:
                        errors.append(f"trials[{index}]: unknown grader {grader!r}")
                    elif grader_sha256 != snapshot_grader_hashes[grader]:
                        errors.append(
                            f"trials[{index}]: grader {grader!r} hash does not match the snapshot"
                        )
        predictions = {entry[4] for entry in pending_assessments}
        derived_outcome = (
            next(iter(predictions)) if len(predictions) == 1 else "mixed"
        ) if predictions else "inconclusive"
        if outcome in VALID_OUTCOMES and outcome != derived_outcome:
            errors.append(
                f"trials[{index}].outcome {outcome!r} disagrees with assessments "
                f"({derived_outcome!r})"
            )
        if len(errors) != trial_error_count:
            continue
        outcome_counts[outcome] += 1
        for assessment, criterion, grader, grader_sha256, prediction in pending_assessments:
            key = (
                str(raw_trial.get("case_id")), str(raw_trial.get("configuration_id")),
                criterion, grader, grader_sha256,
            )
            results[key][prediction] += 1
            label = assessment.get("human_label")
            split = assessment.get("split")
            if label in {"pass", "fail"} and split in {"dev", "test"}:
                calibration[(grader, grader_sha256, split)].append((1 if label == "pass" else 0, 1 if prediction == "pass" else 0))
            elif label in {None, "none"} and split == "unlabeled" and prediction != "inconclusive":
                unlabeled[(grader, grader_sha256)].append(1 if prediction == "pass" else 0)

    duplicate_keys = sorted(key for key, count in trial_keys.items() if count > 1)
    if duplicate_keys:
        errors.append(f"trials contain duplicate case/configuration/repetition keys: {duplicate_keys!r}")
    if run_dir is not None:
        if snapshot is not None:
            planned = expected_trials(snapshot)
            actual = set(trial_keys)
            unexpected = sorted(actual - planned)
            if unexpected:
                errors.append(f"trials are not present in the suite snapshot: {unexpected!r}")
            if data.get("status") == "completed":
                missing = sorted(planned - actual)
                if missing:
                    errors.append(f"completed run is missing planned trials: {missing!r}")
                incomplete = [
                    raw_trial.get("id", f"index-{index}")
                    for index, raw_trial in enumerate(trials)
                    if isinstance(raw_trial, dict) and raw_trial.get("status") != "completed"
                ]
                if incomplete:
                    errors.append(f"completed run contains incomplete trials: {incomplete!r}")

    criterion_results = [
        {
            "case_id": key[0],
            "configuration_id": key[1],
            "criterion_id": key[2],
            "grader_id": key[3],
            "grader_sha256": key[4],
            "counts": dict(sorted(counts.items())),
        }
        for key, counts in sorted(results.items())
    ]

    calibration_results: list[dict[str, Any]] = []
    for (grader, grader_sha256, split), pairs in sorted(
        calibration.items(), key=lambda item: (item[0][0], item[0][1] or "", item[0][2])
    ):
        human_pass_total = sum(1 for human, _ in pairs if human == 1)
        human_fail_total = sum(1 for human, _ in pairs if human == 0)
        true_passes = sum(1 for human, prediction in pairs if human == prediction == 1)
        true_fails = sum(1 for human, prediction in pairs if human == prediction == 0)
        row: dict[str, Any] = {
            "grader_id": grader,
            "grader_sha256": grader_sha256,
            "split": split,
            "labels": len(pairs),
            "true_pass_rate": true_passes / human_pass_total if human_pass_total else None,
            "true_pass_interval_95": wilson_interval(true_passes, human_pass_total),
            "true_fail_rate": true_fails / human_fail_total if human_fail_total else None,
            "true_fail_interval_95": wilson_interval(true_fails, human_fail_total),
        }
        version_key = (grader, grader_sha256)
        if split == "test" and version_key in unlabeled:
            row["corrected_population_rate"] = corrected_rate(pairs, unlabeled[version_key])
        calibration_results.append(row)

    summary: dict[str, Any] = {
        "schema_version": 1,
        "kind": "skill-evaluation-summary",
        "run_id": data.get("run_id"),
        "suite_id": data.get("suite_id"),
        "trial_status_counts": dict(sorted(status_counts.items())),
        "scored_outcome_counts": dict(sorted(outcome_counts.items())),
        "criterion_results": criterion_results,
        "grader_calibration": calibration_results,
        "run_status": data.get("status"),
        "aggregation_status": "invalid" if errors else "valid",
        "status": "invalid" if errors else (
            "complete" if data.get("status") == "completed" else data.get("status")
        ),
        "validation_errors": errors,
        "limitations": list(data.get("limitations", [])) if isinstance(data.get("limitations", []), list) else [],
    }
    if durations:
        summary["duration_seconds"] = {
            "mean": statistics.mean(durations),
            "spread": statistics.pstdev(durations) if len(durations) > 1 else 0.0,
            "count": len(durations),
        }
    return summary


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("run_dir", type=Path)
    parser.add_argument("--out", required=True, type=Path)
    return parser


def main() -> int:
    args = build_parser().parse_args()
    run_path = args.run_dir / "run.json"
    try:
        data = json.loads(run_path.read_text(encoding="utf-8"))
        summary = aggregate_run(data, args.run_dir)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        print(f"Aggregation failed: {exc}", file=sys.stderr)
        return 1
    snapshot_errors = validate_snapshot(args.run_dir, data)
    if snapshot_errors:
        summary["status"] = "invalid"
        summary["validation_errors"].extend(snapshot_errors)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    if summary["aggregation_status"] == "invalid":
        print(f"Wrote invalid summary with {len(summary['validation_errors'])} error(s): {args.out}", file=sys.stderr)
        return 1
    print(f"Wrote {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

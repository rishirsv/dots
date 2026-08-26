#!/usr/bin/env python3
"""Validate a local skill-evaluation suite without judging its quality."""

from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path
from typing import Any


HASH_KEYS = {"sha256", "approved_at", "approved_scope_sha256"}
CLAIM_KINDS = {
    "absolute", "incremental", "regression", "readiness", "triggering",
    "efficiency", "evaluator-validity",
}
ROLES = {"target", "baseline", "candidate", "comparison"}
GRADER_KINDS = {"deterministic", "semantic", "human", "blind-pairwise"}
SPLITS = {"working", "holdout", "train", "dev", "test", "unlabeled"}
VISIBILITIES = {"worker", "hidden", "grader"}
CALIBRATION_STATES = {"unproven", "probed", "human-validated"}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sha256_path(path: Path) -> str:
    if path.is_file():
        return sha256_file(path)
    if not path.is_dir():
        raise ValueError(f"not a file or directory: {path}")
    root = path.resolve()
    digest = hashlib.sha256()
    for child in sorted(path.rglob("*")):
        if child.is_symlink():
            raise ValueError(f"symlink is not allowed inside hashed directory: {child}")
        if not child.is_file():
            continue
        try:
            child.resolve().relative_to(root)
        except ValueError as exc:
            raise ValueError(f"hashed child escapes directory: {child}") from exc
        relative = child.relative_to(path).as_posix().encode("utf-8")
        digest.update(len(relative).to_bytes(8, "big"))
        digest.update(relative)
        payload_hash = sha256_file(child).encode("ascii")
        digest.update(payload_hash)
    return digest.hexdigest()


def canonical_contract(data: dict[str, Any]) -> dict[str, Any]:
    """Return the approval contract with volatile/versioned values removed."""

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


def discover_workspace_root(suite_dir: Path) -> Path:
    result = subprocess.run(
        ["git", "-C", str(suite_dir), "rev-parse", "--show-toplevel"],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode == 0 and result.stdout.strip():
        return Path(result.stdout.strip()).resolve()
    return suite_dir.resolve()


def contained_path(root: Path, raw: Any, label: str, errors: list[str]) -> Path | None:
    if not isinstance(raw, str) or not raw:
        errors.append(f"{label}: expected a non-empty relative path")
        return None
    candidate = Path(raw)
    if candidate.is_absolute() or ".." in candidate.parts:
        errors.append(f"{label}: path must be relative and cannot contain '..': {raw}")
        return None
    resolved = (root / candidate).resolve()
    try:
        resolved.relative_to(root.resolve())
    except ValueError:
        errors.append(f"{label}: path escapes declared root: {raw}")
        return None
    return resolved


def require_dict(value: Any, label: str, errors: list[str]) -> dict[str, Any]:
    if not isinstance(value, dict):
        errors.append(f"{label}: expected an object")
        return {}
    return value


def require_list(value: Any, label: str, errors: list[str]) -> list[Any]:
    if not isinstance(value, list):
        errors.append(f"{label}: expected an array")
        return []
    return value


def validate_hashed_path(
    root: Path,
    item: dict[str, Any],
    label: str,
    errors: list[str],
    *,
    allow_null_hash: bool = False,
) -> None:
    path = contained_path(root, item.get("path"), f"{label}.path", errors)
    if path is None:
        return
    if not path.exists():
        errors.append(f"{label}.path: does not exist: {item.get('path')}")
        return
    expected = item.get("sha256")
    if expected is None and allow_null_hash:
        return
    if not isinstance(expected, str) or len(expected) != 64:
        errors.append(f"{label}.sha256: expected a 64-character digest")
        return
    try:
        actual = sha256_path(path)
    except ValueError as exc:
        errors.append(f"{label}.path: {exc}")
        return
    if actual != expected:
        errors.append(f"{label}.sha256: hash mismatch for {item.get('path')}")


def validate_suite(suite_dir: Path, workspace_root: Path | None = None) -> list[str]:
    errors: list[str] = []
    suite_dir = suite_dir.resolve()
    workspace_root = (workspace_root or discover_workspace_root(suite_dir)).resolve()
    cases_path = suite_dir / "cases.json"
    eval_path = suite_dir / "eval.md"
    if not eval_path.is_file():
        errors.append(f"{eval_path}: missing human-reviewed evaluation plan")
    try:
        data = json.loads(cases_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return errors + [f"{cases_path}: missing suite definition"]
    except json.JSONDecodeError as exc:
        return errors + [f"{cases_path}: invalid JSON at line {exc.lineno}: {exc.msg}"]

    if not isinstance(data, dict):
        return errors + [f"{cases_path}: top level must be an object"]
    if data.get("schema_version") != 1:
        errors.append("schema_version: expected 1")
    if data.get("kind") != "skill-evaluation-suite":
        errors.append("kind: expected 'skill-evaluation-suite'")

    identifiers: dict[str, str] = {}

    def register(item: dict[str, Any], label: str) -> str | None:
        identifier = item.get("id")
        if not isinstance(identifier, str) or not identifier:
            errors.append(f"{label}.id: expected a non-empty string")
            return None
        if identifier in identifiers:
            errors.append(f"{label}.id: duplicate ID {identifier!r}; first used by {identifiers[identifier]}")
        else:
            identifiers[identifier] = label
        return identifier

    suite = require_dict(data.get("suite"), "suite", errors)
    register(suite, "suite")
    if not isinstance(suite.get("name"), str) or not suite.get("name", "").strip():
        errors.append("suite.name: expected non-empty text")
    if suite.get("status") not in {"draft", "approved", "superseded"}:
        errors.append("suite.status: expected draft, approved, or superseded")

    target = require_dict(data.get("target"), "target", errors)
    register(target, "target")
    if not isinstance(target.get("skill"), str) or not target.get("skill", "").strip():
        errors.append("target.skill: expected non-empty text")
    target_files = require_list(target.get("files"), "target.files", errors)
    target_file_ids: set[str] = set()
    if suite.get("status") == "approved" and not target_files:
        errors.append("target.files: approved suites need at least one target file")
    for index, raw in enumerate(target_files):
        item = require_dict(raw, f"target.files[{index}]", errors)
        identifier = register(item, f"target.files[{index}]")
        if identifier:
            target_file_ids.add(identifier)
        validate_hashed_path(workspace_root, item, f"target.files[{index}]", errors)

    fixtures = require_list(data.get("fixtures"), "fixtures", errors)
    fixture_paths: dict[str, str] = {}
    for index, raw in enumerate(fixtures):
        item = require_dict(raw, f"fixtures[{index}]", errors)
        identifier = register(item, f"fixtures[{index}]")
        if item.get("visibility") not in VISIBILITIES:
            errors.append(f"fixtures[{index}].visibility: expected worker, hidden, or grader")
        validate_hashed_path(suite_dir, item, f"fixtures[{index}]", errors)
        path = item.get("path")
        if isinstance(path, str):
            previous = fixture_paths.get(path)
            if previous and previous != item.get("visibility"):
                errors.append(f"fixtures[{index}].path: visibility collision for {path}")
            fixture_paths[path] = str(item.get("visibility"))
        if identifier is None:
            continue

    claim = require_dict(data.get("claim"), "claim", errors)
    if claim.get("kind") not in CLAIM_KINDS:
        errors.append(f"claim.kind: expected one of {sorted(CLAIM_KINDS)}")
    for field in ("decision", "statement"):
        if not isinstance(claim.get(field), str) or not claim.get(field, "").strip():
            errors.append(f"claim.{field}: expected non-empty text")
    require_list(claim.get("limits"), "claim.limits", errors)

    configurations = require_list(data.get("configurations"), "configurations", errors)
    if suite.get("status") == "approved" and not configurations:
        errors.append("configurations: approved suites need at least one configuration")
    configuration_ids: set[str] = set()
    configuration_skill_files: dict[str, set[str]] = {}
    for index, raw in enumerate(configurations):
        item = require_dict(raw, f"configurations[{index}]", errors)
        identifier = register(item, f"configurations[{index}]")
        if identifier:
            configuration_ids.add(identifier)
        if item.get("role") not in ROLES:
            errors.append(f"configurations[{index}].role: expected one of {sorted(ROLES)}")
        for field in ("host", "model"):
            if not isinstance(item.get(field), str) or not item.get(field, "").strip():
                errors.append(f"configurations[{index}].{field}: expected non-empty text")
        require_list(item.get("tools"), f"configurations[{index}].tools", errors)
        require_list(item.get("permissions"), f"configurations[{index}].permissions", errors)
        skill_ref = item.get("skill_ref")
        if skill_ref not in {None, "none"}:
            path = contained_path(workspace_root, skill_ref, f"configurations[{index}].skill_ref", errors)
            if path is not None:
                if not path.exists():
                    errors.append(f"configurations[{index}].skill_ref: does not exist: {skill_ref}")
        skill_file_ids = require_list(
            item.get("skill_file_ids"), f"configurations[{index}].skill_file_ids", errors
        )
        if item.get("role") in {"target", "candidate"} and skill_ref not in {None, "none"} and not skill_file_ids:
            errors.append(
                f"configurations[{index}].skill_file_ids: target/candidate skill needs at least one target file"
            )
        if identifier:
            configuration_skill_files[identifier] = {
                file_id for file_id in skill_file_ids if isinstance(file_id, str)
            }
        for file_id in skill_file_ids:
            if file_id not in target_file_ids:
                errors.append(f"configurations[{index}].skill_file_ids: unknown target file ID {file_id!r}")

    graders = require_list(data.get("graders"), "graders", errors)
    if suite.get("status") == "approved" and not graders:
        errors.append("graders: approved suites need at least one grader")
    grader_ids: set[str] = set()
    for index, raw in enumerate(graders):
        item = require_dict(raw, f"graders[{index}]", errors)
        identifier = register(item, f"graders[{index}]")
        if identifier:
            grader_ids.add(identifier)
        if item.get("kind") not in GRADER_KINDS:
            errors.append(f"graders[{index}].kind: expected one of {sorted(GRADER_KINDS)}")
        if not isinstance(item.get("criterion"), str) or not item.get("criterion", "").strip():
            errors.append(f"graders[{index}].criterion: expected non-empty text")
        if item.get("calibration") not in CALIBRATION_STATES:
            errors.append(f"graders[{index}].calibration: expected one of {sorted(CALIBRATION_STATES)}")
        if item.get("kind") == "human" and item.get("path") is None:
            if item.get("sha256") is not None:
                errors.append(f"graders[{index}]: pathless human grader cannot declare sha256")
        else:
            if item.get("path") is None:
                errors.append(f"graders[{index}]: non-human grader needs path and sha256")
            else:
                validate_hashed_path(suite_dir, item, f"graders[{index}]", errors)

    cases = require_list(data.get("cases"), "cases", errors)
    if suite.get("status") == "approved" and not cases:
        errors.append("cases: approved suites need at least one case")
    for index, raw in enumerate(cases):
        item = require_dict(raw, f"cases[{index}]", errors)
        register(item, f"cases[{index}]")
        if item.get("split") not in SPLITS:
            errors.append(f"cases[{index}].split: expected one of {sorted(SPLITS)}")
        if not isinstance(item.get("prompt"), str) or not item.get("prompt", "").strip():
            errors.append(f"cases[{index}].prompt: expected non-empty text")
        for field in (
            "expected_outcomes", "accepted_alternatives", "prohibited_outcomes",
            "invalid_run_conditions",
        ):
            require_list(item.get(field), f"cases[{index}].{field}", errors)
        case_config_ids = require_list(
            item.get("configuration_ids"), f"cases[{index}].configuration_ids", errors
        )
        if suite.get("status") == "approved" and not case_config_ids:
            errors.append(f"cases[{index}].configuration_ids: approved case needs a configuration")
        for config_id in case_config_ids:
            if config_id not in configuration_ids:
                errors.append(f"cases[{index}].configuration_ids: unknown ID {config_id!r}")
        case_grader_ids = require_list(item.get("grader_ids"), f"cases[{index}].grader_ids", errors)
        if suite.get("status") == "approved" and not case_grader_ids:
            errors.append(f"cases[{index}].grader_ids: approved case needs a grader")
        for grader_id in case_grader_ids:
            if grader_id not in grader_ids:
                errors.append(f"cases[{index}].grader_ids: unknown ID {grader_id!r}")
        case_fixture_ids = require_list(item.get("fixture_refs"), f"cases[{index}].fixture_refs", errors)
        for fixture_id in case_fixture_ids:
            if fixture_id not in identifiers or not identifiers[fixture_id].startswith("fixtures["):
                errors.append(f"cases[{index}].fixture_refs: unknown fixture ID {fixture_id!r}")
        case_dependencies = require_list(item.get("depends_on"), f"cases[{index}].depends_on", errors)
        for dependency_id in case_dependencies:
            if dependency_id not in identifiers:
                errors.append(f"cases[{index}].depends_on: unknown dependency ID {dependency_id!r}")
        required_dependencies = {
            value
            for value in case_fixture_ids + case_config_ids + case_grader_ids
            if isinstance(value, str)
        }
        for config_id in case_config_ids:
            if isinstance(config_id, str):
                required_dependencies.update(configuration_skill_files.get(config_id, set()))
        missing_dependencies = sorted(required_dependencies - set(case_dependencies))
        if missing_dependencies:
            errors.append(
                f"cases[{index}].depends_on: missing selected dependencies {missing_dependencies!r}"
            )

    run_policy = require_dict(data.get("run_policy"), "run_policy", errors)
    repetitions = run_policy.get("repetitions")
    if not isinstance(repetitions, int) or isinstance(repetitions, bool) or repetitions < 1:
        errors.append("run_policy.repetitions: expected a positive integer")
    if not isinstance(run_policy.get("external_mutations"), bool):
        errors.append("run_policy.external_mutations: expected a boolean")
    for field in ("timeout_seconds", "maximum_expected_cost"):
        value = run_policy.get(field)
        if value is not None and (not isinstance(value, (int, float)) or isinstance(value, bool) or value < 0):
            errors.append(f"run_policy.{field}: expected null or a non-negative number")

    if suite.get("status") == "approved":
        expected = suite.get("approved_scope_sha256")
        actual = approval_digest(data)
        if expected != actual:
            errors.append(f"suite.approved_scope_sha256: expected {actual}, found {expected!r}")
        if not isinstance(suite.get("approved_at"), str) or not suite.get("approved_at"):
            errors.append("suite.approved_at: approved suites need an ISO timestamp")
    return errors


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("suite_dir", type=Path)
    parser.add_argument(
        "--workspace-root",
        type=Path,
        help="Trusted root for target/configuration paths; defaults to the Git root.",
    )
    parser.add_argument(
        "--print-approval-digest",
        action="store_true",
        help="Print the canonical approval-contract digest after validation.",
    )
    return parser


def main() -> int:
    args = build_parser().parse_args()
    errors = validate_suite(args.suite_dir, args.workspace_root)
    if errors:
        print("Evaluation suite validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    if args.print_approval_digest:
        data = json.loads((args.suite_dir / "cases.json").read_text(encoding="utf-8"))
        print(approval_digest(data))
    else:
        print("Evaluation suite validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

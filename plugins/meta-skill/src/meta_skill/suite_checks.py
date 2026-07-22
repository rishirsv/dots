"""Deterministic preflight checks for authored evaluation suites."""

import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

from .errors import CliError
from .grading import validator_command
from .manifest import case_dir, expected_output_info
from .staging import safe_case_file


def _validator_label(proc):
    try:
        data = json.loads(proc.stdout) if proc.returncode == 0 else {}
    except json.JSONDecodeError:
        data = {}
    passed = int(data.get("passed", 0))
    total = int(data.get("total", 0))
    return ("pass" if proc.returncode == 0 and total and passed == total else "fail"), data


def _expected_path(case, root, temp_root):
    info = expected_output_info(case)
    if info is None:
        return None
    if info["source"] == "path":
        path = safe_case_file(root, info["path"], "expected output")
        if not path.is_file():
            raise CliError(f"expected output missing for case {case['id']}: {path}", 2)
        return path
    path = temp_root / "expected.md"
    path.write_text(info["text"])
    return path


def _check_model_judge(case, root, grader):
    path = safe_case_file(root, grader["path"], "judge")
    if not path.is_file():
        raise CliError(f"judge missing for case {case['id']}: {path}", 2)
    if grader.get("advisory"):
        return []
    actual = hashlib.sha256(path.read_bytes()).hexdigest()
    expected = grader["calibration"]["judge_sha256"]
    return [{
        "case_id": case["id"],
        "grader": grader["id"],
        "check": "calibrated_judge_digest",
        "expected": expected,
        "observed": actual,
        "ok": actual == expected,
    }]


def _check_code_fixtures(case, root, grader, temp_root):
    validator = safe_case_file(root, grader["path"], "validator")
    if not validator.is_file():
        raise CliError(f"validator missing for case {case['id']}: {validator}", 2)
    expected_path = _expected_path(case, root, temp_root)
    checks = []
    for test in case.get("grader_tests") or []:
        if test.get("grader") != grader["id"]:
            continue
        fixture = safe_case_file(root, test["path"], "grader test")
        if not fixture.is_dir() or fixture.is_symlink():
            raise CliError(f"grader test must be a directory for case {case['id']}: {fixture}", 2)
        if any(path.is_symlink() for path in fixture.rglob("*")):
            raise CliError(f"grader test must not contain symlinks for case {case['id']}: {fixture}", 2)
        response = fixture / "response.md"
        if not response.is_file() or response.is_symlink():
            raise CliError(f"grader test response.md missing for case {case['id']}: {fixture}", 2)
        events = fixture / "events.jsonl"
        if not events.is_file():
            events = temp_root / f"{case['id']}-{test['id']}-events.jsonl"
            events.touch()
        artifacts = fixture / "artifacts"
        if not artifacts.is_dir():
            artifacts = temp_root / f"{case['id']}-{test['id']}-artifacts"
            artifacts.mkdir()
        before_state = fixture / "before-state.json"
        after_state = fixture / "after-state.json"
        if grader.get("uses_state") and not (before_state.is_file() and after_state.is_file()):
            raise CliError(
                f"state-aware grader test {case['id']}/{test['id']} needs before-state.json and after-state.json",
                2,
            )
        proc = subprocess.run(
            validator_command(
                validator,
                response,
                expected_path,
                events,
                artifacts_path=artifacts,
                before_state_path=before_state if grader.get("uses_state") else None,
                after_state_path=after_state if grader.get("uses_state") else None,
            ),
            capture_output=True,
            text=True,
            cwd=root,
        )
        observed, data = _validator_label(proc)
        checks.append({
            "case_id": case["id"],
            "grader": grader["id"],
            "check": test["id"],
            "expected": test["expected"],
            "observed": observed,
            "ok": observed == test["expected"],
            "rationale": data.get("rationale") or (proc.stderr or proc.stdout or "").strip(),
        })
    return checks


def check_suite(manifest, suite):
    """Run deterministic grader fixtures and verify calibrated judge payloads."""
    suite = Path(suite).resolve()
    checks = []
    with tempfile.TemporaryDirectory(prefix="metaskill-suite-check-") as tmp:
        temp_root = Path(tmp)
        for case in manifest.get("evals") or []:
            root = case_dir(suite, case["id"])
            if case.get("state_capture"):
                capture = safe_case_file(root, case["state_capture"], "state capture")
                if not capture.is_file():
                    raise CliError(f"state capture missing for case {case['id']}: {capture}", 2)
            for grader in case.get("graders") or []:
                if grader["kind"] == "model":
                    checks.extend(_check_model_judge(case, root, grader))
                elif grader["kind"] == "code":
                    checks.extend(_check_code_fixtures(case, root, grader, temp_root))
    return {"ok": all(check["ok"] for check in checks), "checks": checks}

"""Freeze selected eval inputs into one run-local snapshot."""

import hashlib
import json
import shutil
from pathlib import Path

from .errors import CliError
from .ids import utc_now
from .io import write_json
from .manifest import case_dir, expected_output_info, prompt_info
from .staging import safe_case_file


def file_digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def bytes_digest(data):
    return hashlib.sha256(data).hexdigest()


def tree_digest(path):
    root = Path(path)
    h = hashlib.sha256()
    for item in sorted(root.rglob("*")):
        if not item.is_file():
            continue
        h.update(item.relative_to(root).as_posix().encode("utf-8"))
        h.update(b"\0")
        h.update(item.read_bytes())
        h.update(b"\0")
    return h.hexdigest()


def _copy_support(case_root, frozen_root, raw_path, label):
    src = safe_case_file(case_root, raw_path, label)
    if not src.exists():
        raise CliError(f"{label} missing: {src}", 2)
    if src.is_symlink() or (src.is_dir() and any(item.is_symlink() for item in src.rglob("*"))):
        raise CliError(f"{label} must not contain symlinks: {raw_path}", 2)
    dest = frozen_root / raw_path
    dest.parent.mkdir(parents=True, exist_ok=True)
    if src.is_dir():
        shutil.copytree(src, dest, dirs_exist_ok=True)
        digest = tree_digest(dest)
    else:
        shutil.copy2(src, dest)
        digest = file_digest(dest)
    return {"path": raw_path, "digest": digest}


def validate_grading_inputs(cases, *, grading_enabled):
    if not grading_enabled:
        return
    missing = [
        case.get("id")
        for case in cases
        if not case.get("expectations") and not case.get("graders") and case.get("expected_output") is None
    ]
    if missing:
        raise CliError(f"graded evals require expected_output, expectations, or graders: {', '.join(missing)}", 2)


def _freeze_prompt(case, authored_root, frozen_root):
    info = prompt_info(case)
    if info["source"] == "inline":
        text = info["text"]
        source = {"kind": "inline"}
    else:
        src = safe_case_file(authored_root, info["path"], "prompt")
        if not src.is_file():
            raise CliError(f"prompt file missing for case {case['id']}: {src}", 2)
        text = src.read_text()
        source = {"kind": "path", "path": info["path"], "source_digest": file_digest(src)}
    text = text if text.endswith("\n") else text + "\n"
    dest = frozen_root / "task.md"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(text)
    return {"path": "task.md", "digest": file_digest(dest), "source": source}


def _freeze_expected(case, authored_root, frozen_root):
    info = expected_output_info(case)
    if info is None:
        return None
    if info["source"] == "inline":
        text = info["text"]
        source = {"kind": "inline"}
    else:
        src = safe_case_file(authored_root, info["path"], "expected output")
        if not src.is_file():
            raise CliError(f"expected output missing for case {case['id']}: {src}", 2)
        text = src.read_text()
        source = {"kind": "path", "path": info["path"], "source_digest": file_digest(src)}
    text = text if text.endswith("\n") else text + "\n"
    dest = frozen_root / "expected.md"
    dest.write_text(text)
    return {"path": "expected.md", "digest": file_digest(dest), "source": source}


def freeze_run_inputs(manifest, suite, run_dir, cases, candidates, *, grading_enabled=True):
    validate_grading_inputs(cases, grading_enabled=grading_enabled)
    inputs_root = Path(run_dir) / "inputs"
    frozen_cases = []
    for case in cases:
        case_id = case["id"]
        authored_root = case_dir(suite, case_id)
        frozen_root = inputs_root / "cases" / case_id
        frozen_root.mkdir(parents=True, exist_ok=True)
        prompt = _freeze_prompt(case, authored_root, frozen_root)
        expected = _freeze_expected(case, authored_root, frozen_root)
        support_refs = []
        support_refs.extend(case.get("fixtures") or [])
        support_refs.extend(
            grader.get("path") for grader in case.get("graders") or [] if grader.get("path")
        )
        copied = []
        for ref in support_refs:
            if ref not in {item["path"] for item in copied}:
                copied.append(_copy_support(authored_root, frozen_root, ref, "support file"))
        frozen_case = {
            "id": case_id,
            "type": case.get("type"),
            "priority": case.get("priority"),
            "split": case.get("split"),
            "repetitions": case.get("repetitions"),
            "prompt": prompt,
            "expected_output": expected,
            "expectations": list(case.get("expectations") or []),
            "graders": list(case.get("graders") or []),
            "fixtures": list(case.get("fixtures") or []),
            "annotations": list(case.get("annotations") or []),
            "support_files": copied,
        }
        frozen_case["case_digest"] = bytes_digest(
            json.dumps(frozen_case, sort_keys=True, separators=(",", ":")).encode("utf-8")
        )
        frozen_cases.append(frozen_case)
    suite_model = {
        "schema_version": 2,
        "source_suite": str(suite),
        "frozen_at": utc_now(),
        "target": manifest.get("target") or {"type": "skill", "ref": "SKILL.md"},
        "defaults": manifest.get("defaults") or {},
        "selected_eval_ids": [case["id"] for case in cases],
        "selected_candidates": [candidate["candidate"] for candidate in candidates],
        "evals": frozen_cases,
    }
    digest_payload = json.dumps(
        {key: value for key, value in suite_model.items() if key not in {"source_suite", "frozen_at"}},
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    suite_model["suite_digest"] = bytes_digest(digest_payload)
    write_json(inputs_root / "suite.json", suite_model)
    return suite_model

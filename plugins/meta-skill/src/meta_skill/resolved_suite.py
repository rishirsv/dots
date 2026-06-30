"""Freeze selected eval inputs into a run-local spec."""

import hashlib
import json
import shutil
from pathlib import Path

from .errors import CliError
from .ids import utc_now
from .io import write_json
from .manifest import case_dir, case_task_info, is_prompt_case
from .staging import safe_case_file


def file_digest(path):
    h = hashlib.sha256()
    h.update(Path(path).read_bytes())
    return h.hexdigest()


def bytes_digest(data):
    return hashlib.sha256(data).hexdigest()


def normalized_task_text(text):
    return text if text.endswith("\n") else text + "\n"


def suite_digest(manifest, cases, candidates):
    h = hashlib.sha256()
    for item in sorted(cases, key=lambda row: row.get("id") or ""):
        h.update(json.dumps(item, sort_keys=True, separators=(",", ":")).encode("utf-8"))
        h.update(b"\0")
    for item in sorted(candidates, key=lambda row: row.get("candidate") or ""):
        h.update(json.dumps(item, sort_keys=True, separators=(",", ":")).encode("utf-8"))
        h.update(b"\0")
    h.update(json.dumps(manifest.get("target") or {}, sort_keys=True, separators=(",", ":")).encode("utf-8"))
    return h.hexdigest()


def _copy_file(src, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    return {"path": dest.name, "digest": file_digest(dest), "source_path": str(src)}


def _copy_support_file(case_root, frozen_case_root, raw_path, label):
    src = safe_case_file(case_root, raw_path, label)
    if not src.exists():
        raise CliError(f"{label} missing: {src}", 2)
    dest = frozen_case_root / raw_path
    if src.is_dir():
        shutil.copytree(src, dest, dirs_exist_ok=True)
        return {"path": raw_path, "digest": tree_digest(dest), "source_path": str(src)}
    return _copy_file(src, dest) | {"path": raw_path}


def tree_digest(path):
    root = Path(path)
    h = hashlib.sha256()
    for item in sorted(root.rglob("*")):
        if not item.is_file():
            continue
        rel = item.relative_to(root).as_posix()
        h.update(rel.encode("utf-8"))
        h.update(b"\0")
        h.update(item.read_bytes())
        h.update(b"\0")
    return h.hexdigest()


def _implicit_support(case_root):
    support = []
    if (case_root / "judge.md").exists():
        support.append("judge.md")
    support.extend(path.name for path in sorted(case_root.glob("expected.*")) if path.is_file())
    support.extend(path.name for path in sorted(case_root.glob("validate.*")) if path.is_file())
    return support


def _grader_support(case):
    refs = []
    for grader in case.get("graders") or []:
        if grader.get("path"):
            refs.append(grader["path"])
    return refs


def validate_grading_inputs(cases, *, grading_enabled):
    if not grading_enabled:
        return
    missing = [
        case.get("id")
        for case in cases
        if is_prompt_case(case) and not case.get("expectations") and not case.get("graders")
    ]
    if missing:
        raise CliError(f"graded prompt evals require expectations or graders: {', '.join(missing)}", 2)


def freeze_eval_spec(manifest, suite, workbench, run_dir, cases, candidates, *, grading_enabled=True):
    validate_grading_inputs(cases, grading_enabled=grading_enabled)
    spec_dir = run_dir / "eval-spec"
    cases_dir = spec_dir / "cases"
    selected_case_ids = [case["id"] for case in cases]
    selected_candidate_ids = [candidate["candidate"] for candidate in candidates]
    frozen_cases = []
    for case in cases:
        case_id = case["id"]
        info = case_task_info(case)
        frozen_case_root = cases_dir / case_id
        frozen_case_root.mkdir(parents=True, exist_ok=True)
        source_case_root = case_dir(workbench, case_id)
        if info["source"] == "prompt":
            task_text = normalized_task_text(info.get("prompt") or "")
            task_bytes = task_text.encode("utf-8")
            task_source = {"kind": "inline_prompt"}
        else:
            source_task = safe_case_file(source_case_root, info["path"], "task")
            if not source_task.exists():
                raise CliError(f"task file missing for case {case_id}: {source_task}", 2)
            source_bytes = source_task.read_bytes()
            task_text = normalized_task_text(source_bytes.decode("utf-8"))
            task_bytes = task_text.encode("utf-8")
            task_source = {
                "kind": "task_file",
                "path": info["path"],
                "source_path": str(source_task),
                "source_digest": bytes_digest(source_bytes),
            }
        task_path = frozen_case_root / "task.md"
        task_path.write_bytes(task_bytes)
        expectations_path = frozen_case_root / "expectations.json"
        expectations = list(case.get("expectations") or [])
        write_json(expectations_path, expectations)
        support_refs = []
        for ref in [*(case.get("fixtures") or []), *_grader_support(case), *_implicit_support(source_case_root)]:
            if ref in support_refs:
                continue
            support_refs.append(ref)
        copied_support = []
        for ref in support_refs:
            copied_support.append(_copy_support_file(source_case_root, frozen_case_root, ref, "support file"))
        frozen_case = {
            "id": case_id,
            "type": case.get("type"),
            "split": case.get("split"),
            "repetitions": case.get("repetitions"),
            "task_text": task_text,
            "task_path": str(task_path),
            "task_digest": bytes_digest(task_bytes),
            "task_source": task_source,
            "expectations": expectations,
            "expectations_path": str(expectations_path),
            "graders": case.get("graders") or [],
            "fixtures": case.get("fixtures") or [],
            "support_files": copied_support,
        }
        frozen_cases.append({key: value for key, value in frozen_case.items() if value is not None})
    suite_model = {
        "schema_version": 1,
        "source_suite": str(suite),
        "frozen_at": utc_now(),
        "target": manifest.get("target") or {},
        "defaults": manifest.get("defaults") or {},
        "selected_case_ids": selected_case_ids,
        "selected_candidate_ids": selected_candidate_ids,
        "cases": frozen_cases,
        "grader_config": {"mode": "expectations_default"},
        "suite_digest": suite_digest(manifest, cases, candidates),
    }
    write_json(spec_dir / "suite.json", suite_model)
    return suite_model

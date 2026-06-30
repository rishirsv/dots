"""Workspace staging and hidden-boundary enforcement."""

import shutil
from pathlib import Path

from .candidates import copy_candidate_payload, reject_symlink_escapes
from .errors import CliError


def safe_case_file(case_root, rel_path, label):
    rel = Path(rel_path)
    if rel.is_absolute() or ".." in rel.parts:
        raise CliError(f"{label} path must stay inside the case folder: {rel_path}", 2)
    path = case_root / rel
    if path.exists() and path.resolve().is_relative_to(case_root.resolve()) is False:
        raise CliError(f"{label} path must stay inside the case folder: {rel_path}", 2)
    return path


def copy_payload(src, dest):
    return copy_candidate_payload(src, dest, extra_excludes={"snapshot.json"})


def stage_workspace(run_dir, trial_id, frozen_case, candidate):
    case_root = Path(frozen_case["case_root"])
    workspace = run_dir / "trials" / trial_id / "workspace"
    if workspace.exists():
        shutil.rmtree(workspace)
    workspace.mkdir(parents=True)

    task_path = workspace / "task.md"
    task_text = frozen_case.get("task_text") or ""
    task_path.write_text(task_text if task_text.endswith("\n") else task_text + "\n")

    fixtures_root = workspace / "fixtures"
    for fixture in frozen_case.get("fixtures", []):
        source = safe_case_file(case_root, fixture, "fixture")
        if not source.exists():
            raise CliError(f"fixture missing: {source}", 2)
        reject_symlink_escapes(source.resolve() if source.is_dir() else source.parent.resolve())
        target = fixtures_root / Path(fixture)
        target.parent.mkdir(parents=True, exist_ok=True)
        if source.is_dir():
            shutil.copytree(source, target, dirs_exist_ok=True)
        else:
            shutil.copy2(source, target)

    staged_candidate = dict(candidate)
    staged_candidate["workspace"] = str(workspace)
    staged_candidate["cwd"] = str(workspace)
    if candidate.get("payload_path"):
        staged_payload = workspace / "skill"
        copy_candidate_payload(candidate["payload_path"], staged_payload, extra_excludes={"snapshot.json"}, compute_digest=False)
        staged_candidate["payload_path"] = str(staged_payload)
        staged_candidate["staged_payload_digest"] = candidate.get("payload_digest")
    else:
        staged_candidate["payload_path"] = None
        staged_candidate["staged_payload_digest"] = None
    return staged_candidate

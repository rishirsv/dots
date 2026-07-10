"""Ephemeral trial staging and outcome capture."""

import shutil
import tempfile
from pathlib import Path

from .candidates import reject_symlink_escapes
from .errors import CliError


def safe_case_file(case_root, rel_path, label):
    rel = Path(rel_path)
    if rel.is_absolute() or ".." in rel.parts:
        raise CliError(f"{label} path must stay inside the eval folder: {rel_path}", 2)
    path = Path(case_root) / rel
    if path.exists() and not path.resolve().is_relative_to(Path(case_root).resolve()):
        raise CliError(f"{label} path must stay inside the eval folder: {rel_path}", 2)
    return path


def stage_workspace(worktree_run_root, trial_id, frozen_case, candidate):
    case_root = Path(frozen_case["case_root"])
    temp_root = Path(worktree_run_root) / "trials"
    temp_root.mkdir(parents=True, exist_ok=True)
    workspace = Path(tempfile.mkdtemp(prefix=f"{trial_id}-", dir=temp_root))
    shutil.copy2(case_root / "task.md", workspace / "task.md")

    fixtures_root = workspace / "fixtures"
    for fixture in frozen_case.get("fixtures", []):
        source = safe_case_file(case_root, fixture, "fixture")
        if not source.exists():
            raise CliError(f"fixture missing: {source}", 2)
        reject_symlink_escapes(source if source.is_dir() else source.parent)
        target = fixtures_root / fixture
        target.parent.mkdir(parents=True, exist_ok=True)
        if source.is_dir():
            shutil.copytree(source, target, dirs_exist_ok=True)
        else:
            shutil.copy2(source, target)

    staged = dict(candidate)
    staged["workspace"] = str(workspace)
    staged["cwd"] = str(workspace)
    return staged


def capture_artifacts(workspace, trial_dir):
    workspace = Path(workspace)
    artifacts = Path(trial_dir) / "artifacts"
    copied = []
    for item in sorted(workspace.iterdir() if workspace.is_dir() else []):
        if item.name in {"task.md", "fixtures", ".git", ".metaskill-events.jsonl", ".metaskill-response.md"}:
            continue
        target = artifacts / item.name
        artifacts.mkdir(parents=True, exist_ok=True)
        if item.is_dir():
            shutil.copytree(item, target, dirs_exist_ok=True)
        else:
            shutil.copy2(item, target)
        copied.append(item.name)
    return copied


def cleanup_workspace(workspace, worktree_run_root):
    workspace = Path(workspace)
    if workspace.exists():
        shutil.rmtree(workspace)
    for root in (Path(worktree_run_root) / "trials", Path(worktree_run_root)):
        try:
            root.rmdir()
        except OSError:
            pass

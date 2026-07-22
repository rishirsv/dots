"""Ephemeral trial staging and outcome capture."""

import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

from .candidates import copy_candidate_payload
from .errors import CliError


def safe_case_file(case_root, rel_path, label):
    rel = Path(rel_path)
    if rel.is_absolute() or ".." in rel.parts:
        raise CliError(f"{label} path must stay inside the eval folder: {rel_path}", 2)
    path = Path(case_root) / rel
    if path.exists() and not path.resolve().is_relative_to(Path(case_root).resolve()):
        raise CliError(f"{label} path must stay inside the eval folder: {rel_path}", 2)
    return path


def stage_workspace(workspace_root, trial_id, frozen_case, candidate):
    case_root = Path(frozen_case["case_root"])
    temp_root = Path(workspace_root)
    temp_root.mkdir(parents=True, exist_ok=True)
    workspace = temp_root / trial_id
    workspace.mkdir()
    shutil.copy2(case_root / "task.md", workspace / "task.md")

    fixtures_root = workspace / "fixtures"
    fixtures_root.mkdir()
    for fixture in frozen_case.get("fixtures", []):
        source = safe_case_file(case_root, fixture, "fixture")
        if not source.exists():
            raise CliError(f"fixture missing: {source}", 2)
        target = fixtures_root / fixture
        target.parent.mkdir(parents=True, exist_ok=True)
        if source.is_dir():
            shutil.copytree(source, target, dirs_exist_ok=True)
        else:
            shutil.copy2(source, target)

    payload_path = candidate.get("payload_path")
    staged_payload = workspace / "skill" if payload_path else None
    if staged_payload:
        copy_candidate_payload(payload_path, staged_payload, compute_digest=False)
    artifact_root = workspace / "artifacts"
    artifact_root.mkdir()
    staged = {
        "candidate": candidate.get("candidate"),
        "variant": candidate.get("variant") or candidate.get("candidate"),
        "payload_path": str(staged_payload) if staged_payload else None,
        "model": candidate.get("model"),
        "prompt": candidate.get("prompt"),
        "prompt_text": candidate.get("prompt_text"),
        "tools": list(candidate.get("tools") or []),
        "plugins": list(candidate.get("plugins") or []),
        "retrieval": candidate.get("retrieval"),
    }
    staged["workspace"] = str(workspace)
    staged["cwd"] = str(workspace)
    return staged


def capture_state_snapshot(frozen_case, workspace, output_path, phase):
    """Run a case-local state capture without exposing its implementation to the worker."""
    raw = frozen_case.get("state_capture")
    if not raw:
        return None
    case_root = Path(frozen_case["case_root"])
    script = safe_case_file(case_root, raw, "state capture")
    if not script.is_file():
        raise CliError(f"state capture missing: {script}", 2)
    if script.suffix.lower() == ".py":
        command = [sys.executable, str(script)]
    elif script.suffix.lower() == ".sh":
        command = ["sh", str(script)]
    elif script.stat().st_mode & 0o111:
        command = [str(script)]
    else:
        raise CliError(f"unsupported state capture file: {script}", 2)
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    proc = subprocess.run(
        [
            *command,
            "--workspace",
            str(Path(workspace).resolve()),
            "--output",
            str(output.resolve()),
            "--phase",
            phase,
            "--json",
        ],
        capture_output=True,
        text=True,
        cwd=Path(workspace),
    )
    if proc.returncode != 0:
        raise CliError((proc.stderr or proc.stdout or "state capture failed").strip(), 2)
    if not output.is_file() and proc.stdout.strip():
        output.write_text(proc.stdout)
    try:
        payload = json.loads(output.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        raise CliError(f"state capture must produce JSON for {phase}: {exc}", 2) from exc
    if not isinstance(payload, (dict, list)):
        raise CliError(f"state capture must produce a JSON object or list for {phase}", 2)
    return {
        "path": output.name,
        "digest": hashlib.sha256(output.read_bytes()).hexdigest(),
        "phase": phase,
    }


def _safe_artifact_path(artifact_root, rel_path):
    rel = Path(rel_path)
    if rel.is_absolute() or ".." in rel.parts:
        raise CliError(f"artifact path must stay inside the worker artifact folder: {rel_path}", 2)
    path = Path(artifact_root) / rel
    if not path.is_file():
        raise CliError(f"declared artifact missing: {rel_path}", 2)
    current = Path(artifact_root)
    for part in rel.parts:
        current = current / part
        if current.is_symlink():
            raise CliError(f"artifacts must not contain symlinks: {rel_path}", 2)
    if not path.resolve().is_relative_to(Path(artifact_root).resolve()):
        raise CliError(f"artifact path must stay inside the worker artifact folder: {rel_path}", 2)
    return path


def capture_artifacts(workspace, trial_dir, declared=None):
    artifact_root = Path(workspace) / "artifacts"
    artifacts = Path(trial_dir) / "artifacts"
    copied = []
    declared = declared if declared is not None else [
        path.relative_to(artifact_root).as_posix()
        for path in sorted(artifact_root.rglob("*"))
        if path.is_file()
    ]
    for rel_path in declared:
        source = _safe_artifact_path(artifact_root, rel_path)
        target = artifacts / rel_path
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
        copied.append(str(rel_path))
    return copied


def relocate_workspace_links(response_path, workspace):
    response = Path(response_path)
    if not response.is_file():
        return
    root = Path(workspace).resolve()
    text = response.read_text()
    text = text.replace(f"{(root / 'artifacts').as_uri()}/", "artifacts/")
    text = text.replace(f"{root / 'artifacts'}/", "artifacts/")
    text = text.replace(f"{root.as_uri()}/", "artifacts/")
    text = text.replace(f"{root}/", "artifacts/")

    artifacts = response.parent / "artifacts"

    def relocate(match):
        raw = match.group("destination")
        wrapped = raw.startswith("<") and raw.endswith(">")
        destination = raw[1:-1] if wrapped else raw
        if destination.startswith(("artifacts/", "/", "#")) or "://" in destination:
            return match.group(0)
        suffix_at = min(
            (index for index in (destination.find("?"), destination.find("#")) if index >= 0),
            default=len(destination),
        )
        path_text, suffix = destination[:suffix_at], destination[suffix_at:]
        relative = Path(path_text)
        if relative.is_absolute() or ".." in relative.parts:
            return match.group(0)
        normalized = Path(*[part for part in relative.parts if part != "."]).as_posix()
        if not normalized or not (artifacts / normalized).is_file():
            return match.group(0)
        relocated = f"artifacts/{normalized}{suffix}"
        return f"{match.group('prefix')}{'<' if wrapped else ''}{relocated}{'>' if wrapped else ''})"

    text = re.sub(
        r"(?P<prefix>!?\[[^\]\n]*\]\()(?P<destination><[^>\n]+>|[^)\s]+)\)",
        relocate,
        text,
    )
    response.write_text(text)


def cleanup_workspace(workspace, workspace_root):
    workspace = Path(workspace)
    if workspace.exists():
        shutil.rmtree(workspace)
    for root in (Path(workspace_root),):
        try:
            root.rmdir()
        except OSError:
            pass

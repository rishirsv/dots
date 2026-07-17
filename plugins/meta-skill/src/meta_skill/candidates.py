"""Candidate source identity and payload helpers."""

import hashlib
import shutil
import subprocess
from pathlib import Path

from .errors import CliError
from .ids import utc_now
from .io import write_json
from .workbench_paths import parse_frontmatter


DEFAULT_EXCLUDES = {".DS_Store", ".git", "__pycache__", "dist", "evals"}


def candidate_source(candidate):
    """Persist one compact, immutable candidate identity in run.json."""
    return {
        "candidate": candidate.get("candidate"),
        "display": candidate.get("display"),
        "source_kind": candidate.get("source_kind"),
        "source_ref": candidate.get("source_ref"),
        "resolved_source_path": candidate.get("resolved_source_path"),
        "base_commit": candidate.get("base_commit") or candidate.get("commit"),
        "head_commit": candidate.get("head_commit") or candidate.get("commit"),
        "dirty": candidate.get("dirty"),
        "diffstat": candidate.get("diffstat", ""),
        "payload_digest": candidate.get("payload_digest"),
        "validation_result": candidate.get("validation_result"),
    }


def exclude_names_for_target(target):
    return DEFAULT_EXCLUDES


def resolve_skill_md(target):
    path = Path(target).expanduser().resolve()
    return path / "SKILL.md" if path.is_dir() else path


def _target_ref_path(ref):
    rel = Path(ref)
    if rel.is_absolute() or ".." in rel.parts:
        raise CliError(f"target ref must stay inside the candidate root: {ref!r}", 2)
    return rel


def _reject_symlink_target_path(path, root, ref):
    root = Path(root).resolve()
    rel = Path(path).relative_to(root)
    current = root
    for part in rel.parts:
        current = current / part
        if current.is_symlink():
            raise CliError(f"target ref must not traverse a symlink: {ref!r}", 2)


def resolve_target_payload(manifest, candidate_cwd):
    target = manifest.get("target") or {}
    ref = target.get("ref") or "SKILL.md"
    root = Path(candidate_cwd).resolve()
    path = root / _target_ref_path(ref)
    _reject_symlink_target_path(path, root, ref)
    resolved = path.resolve()
    try:
        resolved.relative_to(root)
    except ValueError:
        raise CliError(f"target ref must stay inside the candidate root: {ref!r}", 2)
    if resolved.is_file():
        return resolved.parent
    if resolved.is_dir():
        return resolved
    raise CliError(f"target payload not found for ref {ref!r} under {candidate_cwd}", 2)


def payload_digest(path):
    root = Path(path).resolve()
    files = []
    if root.is_file():
        files = [root]
        base = root.parent
    else:
        base = root
        for file_path in root.rglob("*"):
            if not file_path.is_file():
                continue
            parts = file_path.relative_to(root).parts
            if set(parts) & exclude_names_for_target(root) or any(part.startswith(".") for part in parts):
                continue
            files.append(file_path)
    h = hashlib.sha256()
    for file_path in sorted(files):
        rel = file_path.relative_to(base).as_posix()
        h.update(rel.encode("utf-8"))
        h.update(b"\0")
        h.update(file_path.read_bytes())
        h.update(b"\0")
    return h.hexdigest()


def reject_symlink_escapes(root):
    raw_root = Path(root)
    if raw_root.is_symlink():
        raise CliError(f"symlink escapes candidate root: {raw_root}", 2)
    root = raw_root.resolve()
    for item in root.rglob("*"):
        if not item.is_symlink():
            continue
        resolved = item.resolve()
        try:
            resolved.relative_to(root)
        except ValueError:
            raise CliError(f"symlink escapes candidate root: {item}", 2)


def copy_candidate_payload(src, dest, *, extra_excludes=None, compute_digest=True):
    if dest.exists():
        shutil.rmtree(dest)
    dest.parent.mkdir(parents=True, exist_ok=True)
    if src is None:
        dest.mkdir(parents=True, exist_ok=True)
        return None
    src = Path(src).resolve()
    reject_symlink_escapes(src)
    extra_excludes = set(extra_excludes or [])

    def ignore(_dir, names):
        excludes = exclude_names_for_target(src)
        return [name for name in names if name in excludes or name in extra_excludes or name.startswith(".")]

    if src.is_file():
        dest.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest / src.name)
    else:
        shutil.copytree(src, dest, ignore=ignore)
    reject_symlink_escapes(dest)
    return payload_digest(dest) if compute_digest else None


def git(project, args, check=False):
    proc = subprocess.run(["git", *args], cwd=project, capture_output=True, text=True)
    if check and proc.returncode:
        raise CliError((proc.stderr or proc.stdout or "git command failed").strip(), 2)
    return proc


def git_ref(project, ref="HEAD"):
    proc = git(project, ["rev-parse", ref])
    return proc.stdout.strip() if proc.returncode == 0 else None


def current_branch(project):
    proc = git(project, ["branch", "--show-current"])
    return proc.stdout.strip() if proc.returncode == 0 else None


def diffstat(project):
    proc = git(project, ["diff", "--stat", "--", "."])
    return proc.stdout.strip() if proc.returncode == 0 else ""


def is_dirty(project):
    proc = git(project, ["status", "--short", "--", "."])
    return bool(proc.stdout.strip()) if proc.returncode == 0 else None


def resolve_candidate(project, worktree_root, run_id_value, manifest, candidate, *, skill_id_value=None):
    source = candidate.get("source") or {}
    kind = source.get("kind", "current_worktree")
    ref = source.get("ref", ".")
    candidate_id = candidate.get("candidate")
    if kind == "none":
        if source.get("ref"):
            raise CliError(f"candidate {candidate_id} source.kind none must not set ref", 2)
        ref = None
        cwd = project
        base_commit = git_ref(project, "HEAD")
        head_commit = base_commit
        branch = current_branch(project)
        worktree = None
        payload = None
    elif kind == "current_worktree":
        cwd = project
        base_commit = git_ref(project, "HEAD")
        head_commit = base_commit
        branch = current_branch(project)
        worktree = None
        payload = resolve_target_payload(manifest, cwd)
    elif kind == "local_path":
        raw_path = source.get("path") or ref
        path = Path(raw_path).expanduser()
        if not path.is_absolute():
            path = (project / path).resolve()
        else:
            path = path.resolve()
        if not path.exists():
            raise CliError(f"candidate {candidate_id} local_path not found: {path}", 2)
        cwd = path if path.is_dir() else path.parent
        base_commit = git_ref(cwd, "HEAD")
        head_commit = base_commit
        branch = current_branch(cwd)
        worktree = None
        payload = resolve_target_payload(manifest, cwd)
        ref = str(path)
    else:
        base_commit = git_ref(project, ref)
        if not base_commit:
            raise CliError(f"candidate {candidate_id} ref not found: {ref}", 2)
        worktree = Path(worktree_root) / run_id_value / "candidates" / candidate_id
        worktree.parent.mkdir(parents=True, exist_ok=True)
        if not worktree.exists():
            git(project, ["worktree", "add", "--detach", str(worktree), base_commit], check=True)
        cwd = worktree
        head_commit = git_ref(cwd, "HEAD")
        branch = None
        candidate_root = Path(cwd) / Path(skill_id_value) if skill_id_value else Path(cwd)
        payload = resolve_target_payload(manifest, candidate_root)
    if payload:
        reject_symlink_escapes(payload)
    return {
        "candidate": candidate_id,
        "display": candidate.get("display") or candidate_id,
        "source_kind": kind,
        "source_ref": ref,
        "branch": branch,
        "commit": head_commit,
        "base_commit": base_commit,
        "head_commit": head_commit,
        "dirty": None if kind == "none" else is_dirty(cwd),
        "diffstat": "" if kind == "none" else diffstat(cwd),
        "worktree": str(worktree) if worktree else None,
        "cwd": str(cwd),
        "payload_path": str(payload) if payload else None,
        "payload_digest": None,
    }


def snapshot_candidate(run_dir, candidate_info):
    candidate_id = candidate_info["candidate"]
    snapshot_root = run_dir / "inputs" / "candidates" / candidate_id
    payload_root = snapshot_root / "payload"
    snapshot_json_path = snapshot_root / "snapshot.json"
    payload = candidate_info.get("payload_path")
    frozen_payload = payload_root if payload else None
    plugin_root = None
    if payload:
        source_payload = Path(payload)
        if source_payload.parent.name == "skills" and (source_payload.parent.parent / "plugin.json").is_file():
            plugin_root = source_payload.parent.parent
            frozen_payload = payload_root / "skills" / source_payload.name
            copy_candidate_payload(source_payload, frozen_payload)
            for shared_name in ("references", "assets"):
                shared = plugin_root / shared_name
                if shared.is_dir():
                    copy_candidate_payload(shared, payload_root / shared_name, compute_digest=False)
            digest = payload_digest(payload_root)
        else:
            digest = copy_candidate_payload(source_payload, payload_root)
    else:
        digest = copy_candidate_payload(None, payload_root)
    validation = None
    if payload:
        try:
            from .validation import validate_report

            validation = validate_report(str(frozen_payload))
        except Exception as exc:
            validation = {"ok": False, "error": str(exc)}
    snapshot = {
        "candidate": candidate_id,
        "display": candidate_info.get("display"),
        "source_kind": candidate_info.get("source_kind"),
        "source_ref": candidate_info.get("source_ref"),
        "resolved_source_path": candidate_info.get("payload_path"),
        "source_cwd": candidate_info.get("cwd"),
        "worktree": candidate_info.get("worktree"),
        "branch": candidate_info.get("branch"),
        "commit": candidate_info.get("commit"),
        "base_commit": candidate_info.get("base_commit"),
        "head_commit": candidate_info.get("head_commit"),
        "dirty": candidate_info.get("dirty"),
        "diffstat": candidate_info.get("diffstat", ""),
        "payload_digest": digest,
        "validation_result": validation,
        "snapshot_timestamp": utc_now(),
    }
    write_json(snapshot_json_path, snapshot)
    return {
        **candidate_info,
        **snapshot,
        "snapshot_path": str(snapshot_root),
        "snapshot_json_path": str(snapshot_json_path),
        "payload_path": str(frozen_payload) if payload else None,
    }


def cleanup_candidate_source(project, candidate_info):
    """Remove a temporary git worktree after its payload has been frozen."""
    raw = candidate_info.get("worktree")
    if not raw:
        return
    worktree = Path(raw)
    git(project, ["worktree", "remove", "--force", str(worktree)], check=True)
    if worktree.parent.is_dir() and not any(worktree.parent.iterdir()):
        worktree.parent.rmdir()


def skill_input_name(payload):
    skill_md = Path(payload) / "SKILL.md"
    if skill_md.exists():
        frontmatter = parse_frontmatter(skill_md)
        name = frontmatter.get("name")
        if isinstance(name, str) and name.strip():
            return name.strip()
    return Path(payload).name

"""Authored-suite and repository-local MetaSkill path helpers."""

import subprocess
from pathlib import Path


EVALS_DIR_NAME = "evals"
STATE_DIR_NAME = ".skill"


def parse_frontmatter(skill_md):
    text = Path(skill_md).read_text()
    if not text.startswith("---"):
        return {}
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}
    raw = parts[1]
    try:
        import yaml

        parsed = yaml.safe_load(raw)
        return parsed if isinstance(parsed, dict) else {}
    except Exception:
        out = {}
        for line in raw.splitlines():
            if ":" not in line or line[:1].isspace():
                continue
            key, value = line.split(":", 1)
            out[key.strip()] = value.strip().strip("\"'")
        return out


def _skill_md_candidates(target):
    target = Path(target).expanduser()
    if target.is_file():
        return [target]
    return [target / "SKILL.md", target / "skill" / "SKILL.md"]


def skill_md_for_target(target):
    for skill_md in _skill_md_candidates(target):
        if skill_md.is_file():
            return skill_md.resolve()
    return None


def skill_dir_for_target(target):
    skill_md = skill_md_for_target(target)
    if skill_md is not None:
        return skill_md.parent
    target = Path(target).expanduser().resolve()
    return target.parent if target.is_file() else target


def skill_name_for_target(target):
    skill_md = skill_md_for_target(target)
    if skill_md is not None:
        name = parse_frontmatter(skill_md).get("name")
        if isinstance(name, str) and name.strip():
            return name.strip()
        return skill_md.parent.name
    target = Path(target).expanduser()
    return target.stem if target.is_file() else target.name


def repository_root(target):
    """Return the containing git root, or the resolved target root outside git."""
    skill_dir = skill_dir_for_target(target)
    proc = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        cwd=skill_dir,
        capture_output=True,
        text=True,
    )
    if proc.returncode == 0 and proc.stdout.strip():
        return Path(proc.stdout.strip()).resolve()
    raw = Path(target).expanduser().resolve()
    if raw.is_dir() and not (raw / "SKILL.md").is_file() and (raw / "skill" / "SKILL.md").is_file():
        return raw
    return skill_dir


def skill_id_for_target(target, root=None):
    skill_dir = skill_dir_for_target(target)
    root = Path(root).expanduser().resolve() if root is not None else repository_root(skill_dir)
    try:
        value = skill_dir.relative_to(root).as_posix()
    except ValueError:
        value = skill_dir.name
    return skill_dir.name if value in {"", "."} else value


def evals_path(target):
    return skill_dir_for_target(target) / EVALS_DIR_NAME / "evals.json"


def evals_dir(target):
    return evals_path(target).parent


def state_root(target, root=None):
    """Return generated state owned by the target skill.

    ``root`` remains accepted because workbench discovery callers already pass
    it, but generated state is intentionally never shared at that root.
    """
    return skill_dir_for_target(target) / STATE_DIR_NAME


def skill_state_path(target, kind, root=None):
    return state_root(target, root=root) / kind


def runs_path(target, root=None):
    return skill_state_path(target, "runs", root=root)


def worktrees_path(target, root=None):
    return skill_state_path(target, "worktrees", root=root)


def packages_path(target, root=None):
    return skill_state_path(target, "packages", root=root)


def workbench_path(target):
    """Compatibility alias for the authored eval directory."""
    return evals_dir(target)

"""Workbench path helpers."""

from pathlib import Path


LEGACY_WORKBENCH_NAME = ".meta-skill"


def _parse_frontmatter(skill_md):
    text = skill_md.read_text()
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


def skill_name_for_target(target):
    target = Path(target).expanduser()
    for skill_md in _skill_md_candidates(target):
        if not skill_md.exists():
            continue
        name = _parse_frontmatter(skill_md).get("name")
        if isinstance(name, str) and name.strip():
            return name.strip()
        return skill_md.parent.name
    return target.stem if target.is_file() else target.name


def workbench_dir_name(target):
    name = skill_name_for_target(target).strip().lstrip(".")
    return f".{name or 'skill'}"


def workbench_path(target):
    target = Path(target).expanduser()
    if target.is_file():
        target = target.parent
    return target / workbench_dir_name(target)


def is_workbench_dir_name(name, target=None):
    if name == LEGACY_WORKBENCH_NAME:
        return True
    return target is not None and name == workbench_dir_name(target)

"""Skill package artifact creation."""

import zipfile
from pathlib import Path

from .candidates import DEFAULT_EXCLUDES
from .ids import utc_now
from .io import write_json
from .validation import validate_report
from .workbench_paths import packages_path, parse_frontmatter


def package_skill(skill_dir, out_dir=None):
    result = validate_report(skill_dir)
    if not result["ok"]:
        return result
    skill_dir = Path(skill_dir).expanduser().resolve()
    frontmatter = parse_frontmatter(skill_dir / "SKILL.md")
    name = frontmatter.get("name") or skill_dir.name
    out_path = Path(out_dir).expanduser().resolve() if out_dir else packages_path(skill_dir)
    out_path.mkdir(parents=True, exist_ok=True)
    artifact = out_path / f"{name}.zip"
    excludes = DEFAULT_EXCLUDES
    with zipfile.ZipFile(artifact, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in sorted(skill_dir.rglob("*")):
            if not path.is_file():
                continue
            rel = path.relative_to(skill_dir)
            if set(rel.parts) & excludes or any(part.startswith(".") for part in rel.parts):
                continue
            zf.write(path, rel.as_posix())
    metadata = {
        "slug": name,
        "source": str(skill_dir),
        "artifact": str(artifact),
        "created_at": utc_now(),
        "excluded": sorted(excludes),
    }
    metadata_path = out_path / f"{name}.package.json"
    write_json(metadata_path, metadata)
    return {"ok": True, "artifact": str(artifact), "metadata": str(metadata_path)}

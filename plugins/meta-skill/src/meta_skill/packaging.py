"""Skill package artifact creation."""

import zipfile
from pathlib import Path
from tempfile import TemporaryDirectory

from .candidates import DEFAULT_EXCLUDES, copy_candidate_payload
from .ids import utc_now
from .io import write_json
from .validation import validate_report
from .workbench_paths import packages_path, parse_frontmatter


def package_skill(skill_dir, out_dir=None):
    skill_dir = Path(skill_dir).expanduser().resolve()
    with TemporaryDirectory() as tmp:
        staged = Path(tmp) / skill_dir.name
        copy_candidate_payload(skill_dir, staged, compute_digest=False)
        validation = validate_report(staged)
        if not validation["ok"]:
            return {
                "ok": False,
                "error": "packaged payload failed validation",
                "source": str(skill_dir),
                "validation": validation,
            }
        frontmatter = parse_frontmatter(staged / "SKILL.md")
        name = frontmatter.get("name") or skill_dir.name
        out_path = Path(out_dir).expanduser().resolve() if out_dir else packages_path(skill_dir)
        out_path.mkdir(parents=True, exist_ok=True)
        artifact = out_path / f"{name}.zip"
        with zipfile.ZipFile(artifact, "w", zipfile.ZIP_DEFLATED) as zf:
            for path in sorted(staged.rglob("*")):
                if path.is_file():
                    zf.write(path, path.relative_to(staged).as_posix())
    metadata = {
        "slug": name,
        "source": str(skill_dir),
        "artifact": str(artifact),
        "created_at": utc_now(),
        "excluded": sorted(DEFAULT_EXCLUDES),
    }
    metadata_path = out_path / f"{name}.package.json"
    write_json(metadata_path, metadata)
    return {"ok": True, "artifact": str(artifact), "metadata": str(metadata_path)}

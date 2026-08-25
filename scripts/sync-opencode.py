#!/usr/bin/env python3
"""Sync Dots and installed Codex skills into OpenCode's global config."""

from __future__ import annotations

import json
import os
import re
import shutil
from datetime import datetime
from pathlib import Path


DOTS_ROOT = Path(__file__).resolve().parent.parent
HOME = Path.home()
CONFIG_ROOT = HOME / ".config" / "opencode"
CONFIG_SOURCE = DOTS_ROOT / "configs" / "opencode" / "opencode.json"
CONFIG_TARGET = CONFIG_ROOT / "opencode.json"
SKILLS_TARGET = CONFIG_ROOT / "skills"
MANIFEST = CONFIG_ROOT / ".dots-synced-skills.json"
DOTS_MARKETPLACE = DOTS_ROOT / ".agents" / "plugins" / "marketplace.json"
DOTS_CACHE = HOME / ".codex" / "plugins" / "cache" / "dots"
VALID_SKILL_NAME = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def source_rank(skill_file: Path) -> tuple[int, str]:
    path = str(skill_file)
    if path.startswith(str(DOTS_ROOT / "plugins")):
        rank = 100
    elif path.startswith(str(HOME / ".codex" / "skills")):
        rank = 90
    elif "/plugins/cache/dots/" in path:
        rank = 80
    elif "/plugins/cache/openai-curated-remote/" in path:
        rank = 70
    elif "/plugins/cache/openai-primary-runtime/" in path:
        rank = 60
    elif "/plugins/cache/openai-bundled/" in path:
        rank = 50
    elif "/plugins/cache/openai-curated/" in path:
        rank = 40
    else:
        rank = 0
    return rank, path


def current_dots_plugins() -> set[str]:
    payload = json.loads(DOTS_MARKETPLACE.read_text())
    return {plugin["name"] for plugin in payload.get("plugins", [])}


def discover_skills() -> dict[str, Path]:
    roots = [
        DOTS_ROOT / "plugins",
        HOME / ".codex" / "skills",
        HOME / ".codex" / "plugins" / "cache",
    ]
    dots_plugins = current_dots_plugins()
    candidates: dict[str, list[Path]] = {}
    for root in roots:
        if not root.exists():
            continue
        for skill_file in root.rglob("SKILL.md"):
            if "node_modules" in skill_file.parts:
                continue
            if skill_file.is_relative_to(DOTS_CACHE):
                cached_plugin = skill_file.relative_to(DOTS_CACHE).parts[0]
                if cached_plugin not in dots_plugins:
                    continue
            name = skill_file.parent.name
            if not VALID_SKILL_NAME.fullmatch(name):
                print(f"Skipping invalid OpenCode skill name: {name} ({skill_file})")
                continue
            candidates.setdefault(name, []).append(skill_file)

    return {
        name: max(files, key=source_rank).parent
        for name, files in sorted(candidates.items())
    }


def install_config() -> None:
    CONFIG_ROOT.mkdir(parents=True, exist_ok=True)
    if CONFIG_TARGET.exists() and CONFIG_TARGET.read_bytes() == CONFIG_SOURCE.read_bytes():
        print(f"Unchanged {CONFIG_TARGET}")
        return
    if CONFIG_TARGET.exists() or CONFIG_TARGET.is_symlink():
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        backup = CONFIG_TARGET.with_name(f"{CONFIG_TARGET.name}.bak.{timestamp}")
        shutil.copy2(CONFIG_TARGET, backup, follow_symlinks=True)
        print(f"Backed up {CONFIG_TARGET} -> {backup}")
        if CONFIG_TARGET.is_symlink():
            CONFIG_TARGET.unlink()
    shutil.copy2(CONFIG_SOURCE, CONFIG_TARGET)
    os.chmod(CONFIG_TARGET, 0o600)
    print(f"Installed {CONFIG_TARGET}")


def read_previous_manifest() -> set[str]:
    if not MANIFEST.exists():
        return set()
    try:
        payload = json.loads(MANIFEST.read_text())
    except (json.JSONDecodeError, OSError):
        return set()
    return set(payload.get("skills", {}))


def sync_skills(skills: dict[str, Path]) -> None:
    SKILLS_TARGET.mkdir(parents=True, exist_ok=True)
    previous = read_previous_manifest()

    for stale_name in sorted(previous - skills.keys()):
        stale = SKILLS_TARGET / stale_name
        if stale.is_symlink():
            stale.unlink()
            print(f"Removed stale skill link {stale}")

    for name, source in skills.items():
        target = SKILLS_TARGET / name
        desired = str(source)
        if target.is_symlink() and os.readlink(target) == desired:
            continue
        if target.exists() or target.is_symlink():
            if target.is_symlink():
                target.unlink()
            else:
                print(f"Preserving unmanaged skill path: {target}")
                continue
        target.symlink_to(source, target_is_directory=True)
        print(f"Linked {name} -> {source}")

    manifest_payload = {
        "skills": {name: str(source) for name, source in skills.items()}
    }
    MANIFEST.write_text(json.dumps(manifest_payload, indent=2) + "\n")
    print(f"Synced {len(skills)} unique skills")


def main() -> None:
    install_config()
    sync_skills(discover_skills())


if __name__ == "__main__":
    main()

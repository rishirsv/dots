#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"
DIST="$ROOT/dist"

python3 - "$ROOT" <<'PY'
import fnmatch
import json
import shutil
import sys
from pathlib import Path

root = Path(sys.argv[1])
plugins_root = root / "plugins"
dist = root / "dist"
catalog_path = plugins_root / "catalog.json"

catalog = json.loads(catalog_path.read_text())
plugin_entries = catalog.get("plugins", [])

if not plugin_entries:
    raise SystemExit("plugins/catalog.json has no plugins[] entries")

if dist.exists():
    shutil.rmtree(dist)

codex_root = dist / "codex"
claude_root = dist / "claude"
(codex_root / ".agents" / "plugins").mkdir(parents=True, exist_ok=True)
(claude_root / ".claude-plugin").mkdir(parents=True, exist_ok=True)


def load_plugin(name: str) -> dict:
    path = plugins_root / name / "plugin.json"
    if not path.exists():
        raise SystemExit(f"Missing plugin metadata: {path}")
    data = json.loads(path.read_text())
    if data.get("name") != name:
        raise SystemExit(f"Plugin metadata name mismatch in {path}: {data.get('name')!r} != {name!r}")
    return data


def ignore_patterns(plugin_dir: Path) -> list[str]:
    path = plugin_dir / "package.ignore"
    if not path.exists():
        return []
    return [
        line.strip()
        for line in path.read_text().splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    ]


def ignored(rel: str, patterns: list[str]) -> bool:
    rel = rel.strip("/")
    rel_dir = rel + "/" if rel and not rel.endswith("/") else rel
    for pattern in patterns:
        pattern = pattern.strip("/")
        if pattern.endswith("/"):
            prefix = pattern
            if rel_dir == prefix or rel_dir.startswith(prefix):
                return True
            continue
        if fnmatch.fnmatch(rel, pattern) or fnmatch.fnmatch(Path(rel).name, pattern):
            return True
    return False


def copy_tree(src: Path, dst: Path, patterns: list[str]) -> None:
    if not src.exists():
        return
    for path in src.rglob("*"):
        rel = path.relative_to(src).as_posix()
        if ignored(rel, patterns):
            continue
        target = dst / rel
        if path.is_dir():
            target.mkdir(parents=True, exist_ok=True)
        elif path.is_file():
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, target)


def copy_declared_surfaces(name: str, meta: dict, package_root: Path) -> None:
    source_root = plugins_root / name
    patterns = ignore_patterns(source_root)
    surfaces = [
        "assets",
        "references",
        "skills",
        "scripts",
        "src",
        "commands",
        "agents",
        "hooks",
        "bin",
    ]
    for surface in surfaces:
        value = meta.get(surface)
        if not value:
            continue
        src = (source_root / str(value)).resolve()
        if not src.exists():
            raise SystemExit(f"Declared surface does not exist for {name}: {value}")
        copy_tree(src, package_root / surface, patterns)

    for filename in [".mcp.json", ".lsp.json", "settings.json"]:
        src = source_root / filename
        if src.exists() and not ignored(filename, patterns):
            shutil.copy2(src, package_root / filename)


def codex_manifest(name: str, meta: dict) -> dict:
    manifest = {
        "name": name,
        "version": meta.get("version", catalog.get("version", "0.1.0")),
        "description": meta.get("description", ""),
        "author": meta.get("author", catalog.get("owner", {})),
        "repository": catalog.get("repository"),
        "keywords": meta.get("keywords", []),
        "skills": "./skills/",
    }
    interface = {
        "displayName": meta.get("displayName") or name.replace("-", " ").title(),
        "shortDescription": meta.get("description", ""),
        "longDescription": meta.get("description", ""),
        "developerName": meta.get("author", catalog.get("owner", {})).get("name", ""),
        "category": meta.get("category", "Productivity"),
        "capabilities": ["Read", "Write"],
        "defaultPrompt": f"Use {name} for this workflow.",
    }
    if name == "agent":
        interface.update({
            "brandColor": "#006DFF",
            "composerIcon": "./assets/icon.png",
            "logo": "./assets/logo.png",
            "screenshots": [],
        })
    elif name == "meta-skill":
        interface.update({
            "brandColor": "#7C4DFF",
            "composerIcon": "./assets/icon.png",
            "screenshots": [],
        })
    manifest["interface"] = interface
    return {k: v for k, v in manifest.items() if v is not None}


def claude_manifest(name: str, meta: dict) -> dict:
    return {
        "name": name,
        "version": meta.get("version", catalog.get("version", "0.1.0")),
        "description": meta.get("description", ""),
        "author": meta.get("author", catalog.get("owner", {})),
        "keywords": meta.get("keywords", []),
    }


codex_plugins = []
claude_plugins = []

for entry in plugin_entries:
    name = entry["name"]
    meta = load_plugin(name)

    codex_package = codex_root / "plugins" / name
    claude_package = claude_root / "plugins" / name
    (codex_package / ".codex-plugin").mkdir(parents=True, exist_ok=True)
    (claude_package / ".claude-plugin").mkdir(parents=True, exist_ok=True)

    copy_declared_surfaces(name, meta, codex_package)
    copy_declared_surfaces(name, meta, claude_package)

    (codex_package / ".codex-plugin" / "plugin.json").write_text(
        json.dumps(codex_manifest(name, meta), indent=2) + "\n"
    )
    (claude_package / ".claude-plugin" / "plugin.json").write_text(
        json.dumps(claude_manifest(name, meta), indent=2) + "\n"
    )

    category = entry.get("category") or meta.get("category") or "Productivity"
    codex_plugins.append({
        "name": name,
        "source": {"source": "local", "path": f"./plugins/{name}"},
        "policy": {"installation": "AVAILABLE", "authentication": "ON_INSTALL"},
        "category": category,
    })
    claude_plugins.append({
        "name": name,
        "description": meta.get("description", ""),
        "source": f"./plugins/{name}",
        "version": meta.get("version", catalog.get("version", "0.1.0")),
        "category": str(category).lower(),
        "tags": meta.get("keywords", []),
    })

codex_marketplace = {
    "name": catalog["name"],
    "interface": {"displayName": catalog.get("displayName", catalog["name"])},
    "plugins": codex_plugins,
}
claude_marketplace = {
    "name": catalog["name"],
    "owner": catalog.get("owner", {}),
    "metadata": {
        "version": catalog.get("version", "0.1.0"),
        "description": catalog.get("description", "Rishi's personal plugin marketplace."),
    },
    "plugins": claude_plugins,
}

(codex_root / ".agents" / "plugins" / "marketplace.json").write_text(
    json.dumps(codex_marketplace, indent=2) + "\n"
)
(claude_root / ".claude-plugin" / "marketplace.json").write_text(
    json.dumps(claude_marketplace, indent=2) + "\n"
)

print(f"Packaged {len(plugin_entries)} plugins")
print(f"Codex marketplace: {codex_root}")
print(f"Claude marketplace: {claude_root}")
PY

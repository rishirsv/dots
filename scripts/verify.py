#!/usr/bin/env python3
"""Focused package checks and the full repository integration gate."""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
MARKDOWN_LINK = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")


def string_field(text: str, field: str) -> str | None:
    # Repository metadata uses single-line strings, quoted or plain.
    match = re.search(rf"^\s*{re.escape(field)}:\s*(.+?)\s*$", text, re.MULTILINE)
    if not match:
        return None
    value = match.group(1)
    return value[1:-1] if value[:1] in {"'", '"'} and value[-1:] == value[:1] else value


def validate_skill(skill_dir: Path, errors: list[str]) -> str | None:
    skill_file = skill_dir / "SKILL.md"
    agent_file = skill_dir / "agents" / "openai.yaml"
    text = skill_file.read_text(encoding="utf-8")
    name = string_field(text, "name")
    if name is None:
        errors.append(f"{skill_file}: missing frontmatter name")
    elif name != skill_dir.name:
        errors.append(f"{skill_file}: name {name!r} must match directory {skill_dir.name!r}")

    description = string_field(text, "description")
    if description is None:
        errors.append(f"{skill_file}: missing frontmatter description")

    if not agent_file.exists():
        errors.append(f"{agent_file}: missing agent metadata")
        return name
    agent_text = agent_file.read_text(encoding="utf-8")
    prompt = string_field(agent_text, "default_prompt")
    if prompt is None:
        errors.append(f"{agent_file}: missing default_prompt")
    if not re.search(r"^\s*allow_implicit_invocation:\s*(true|false)\s*$", agent_text, re.MULTILINE):
        errors.append(f"{agent_file}: missing boolean allow_implicit_invocation policy")
    for field in ("icon_small", "icon_large"):
        icon = string_field(agent_text, field)
        if icon is not None and not (skill_dir / icon).resolve().is_file():
            errors.append(f"{agent_file}: {field} does not resolve: {icon}")
    return name


def validate_manifest(root: Path, errors: list[str]) -> None:
    manifest_path = root / ".codex-plugin" / "plugin.json"
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"{manifest_path}: invalid manifest: {exc}")
        return

    if manifest.get("name") != root.name:
        errors.append(f"{manifest_path}: name must match plugin directory {root.name!r}")
    interface = manifest.get("interface")
    if isinstance(interface, dict):
        for field in ("composerIcon", "logo"):
            resource = interface.get(field)
            if isinstance(resource, str) and not (root / resource).resolve().is_file():
                errors.append(f"{manifest_path}: interface.{field} does not resolve: {resource}")


def validate_markdown_links(root: Path, errors: list[str]) -> None:
    for path in sorted(root.rglob("*.md")):
        text = path.read_text(encoding="utf-8")
        for match in MARKDOWN_LINK.finditer(text):
            target = match.group(1).strip().strip("<>")
            if not target or target.startswith("#") or re.match(r"^[a-z][a-z0-9+.-]*:", target, re.I):
                continue
            target = unquote(target.split("#", 1)[0].split("?", 1)[0])
            if target and not (path.parent / target).resolve().exists():
                errors.append(f"{path}: local link does not resolve: {match.group(1)}")


def validate_plugin(root: Path) -> list[str]:
    errors: list[str] = []
    skills = root / "skills"
    skill_dirs = sorted(path.parent for path in skills.glob("*/SKILL.md"))
    if not skill_dirs:
        errors.append(f"{skills}: no source skills found")

    names: dict[str, Path] = {}
    for skill_dir in skill_dirs:
        name = validate_skill(skill_dir, errors)
        if name is not None:
            if name in names:
                errors.append(f"{skill_dir / 'SKILL.md'}: duplicate skill name {name!r}; first used by {names[name]}")
            else:
                names[name] = skill_dir / "SKILL.md"

    validate_manifest(root, errors)
    validate_markdown_links(root, errors)
    return errors


def marketplace_plugins(root: Path) -> tuple[list[str], list[str]]:
    codex_marketplace = json.loads((root / ".agents/plugins/marketplace.json").read_text())
    claude_marketplace = json.loads((root / ".claude-plugin/marketplace.json").read_text())
    codex_names = [plugin["name"] for plugin in codex_marketplace.get("plugins", [])]
    claude_names = [plugin["name"] for plugin in claude_marketplace.get("plugins", [])]
    if len(codex_names) != len(set(codex_names)):
        raise ValueError(f"duplicate Codex marketplace plugin names: {codex_names!r}")
    if len(claude_names) != len(set(claude_names)):
        raise ValueError(f"duplicate Claude marketplace plugin names: {claude_names!r}")

    codex_by_name = {plugin["name"]: plugin for plugin in codex_marketplace.get("plugins", [])}
    claude_by_name = {plugin["name"]: plugin for plugin in claude_marketplace.get("plugins", [])}

    def require_codex_path(name, entry):
        expected_path = f"./plugins/{name}"
        if entry.get("source", {}).get("path") != expected_path:
            raise ValueError(f"{name} Codex marketplace path must be {expected_path}")

    def require_claude_path(name, entry):
        expected_path = f"./plugins/{name}"
        if entry.get("source") != expected_path:
            raise ValueError(f"{name} Claude marketplace source must be {expected_path}")

    for name, entry in codex_by_name.items():
        require_codex_path(name, entry)
        plugin_root = root / "plugins" / name
        source_meta = json.loads((plugin_root / "plugin.json").read_text())
        agent_schema = source_meta.get("$schema") == "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"

        if name in claude_by_name:
            require_claude_path(name, claude_by_name[name])
            codex_meta = json.loads((plugin_root / ".codex-plugin/plugin.json").read_text())
            claude_meta = json.loads((plugin_root / ".claude-plugin/plugin.json").read_text())
            for field in ("name", "version", "description", "author", "keywords"):
                values = {
                    "plugin.json": source_meta.get(field),
                    ".codex-plugin/plugin.json": codex_meta.get(field),
                    ".claude-plugin/plugin.json": claude_meta.get(field),
                }
                if len({json.dumps(value, sort_keys=True) for value in values.values()}) != 1:
                    raise ValueError(f"{name} metadata drift for {field}: {values!r}")
        elif not agent_schema:
            raise ValueError(f"{name} is Codex-only but does not use Agent Plugins v1 plugin.json")
        elif (plugin_root / ".codex-plugin").exists() or (plugin_root / ".claude-plugin").exists():
            raise ValueError(f"{name} Agent-standard plugin must not contain Codex/Claude plugin mirrors")

    for name, entry in claude_by_name.items():
        if name not in codex_by_name:
            require_claude_path(name, entry)
            plugin_root = root / "plugins" / name
            source_meta = json.loads((plugin_root / "plugin.json").read_text())
            claude_meta = json.loads((plugin_root / ".claude-plugin/plugin.json").read_text())
            for field in ("name", "version", "description", "author", "keywords"):
                if source_meta.get(field) != claude_meta.get(field):
                    raise ValueError(f"{name} metadata drift for {field}")

    agent_only_names = [name for name in codex_names if name not in claude_by_name]
    if agent_only_names:
        raise ValueError(f"Unexpected Agent-only marketplace plugins: {agent_only_names!r}")
    return codex_names, claude_names


def run(*command: str, env: dict[str, str] | None = None) -> None:
    print("==> " + " ".join(command), flush=True)
    subprocess.run(command, cwd=ROOT, env=env, check=True)


def full_checks(codex_names: list[str], claude_names: list[str]) -> None:
    run("node", "scripts/generate-claude-agents.mjs", "--check")
    run("claude", "plugin", "validate", ".", "--strict")
    for name in claude_names:
        run("claude", "plugin", "validate", f"plugins/{name}", "--strict")
    # Installation smoke tests must never alter the user's configured plugins.
    with tempfile.TemporaryDirectory(prefix="dots-codex-verify-") as tmp:
        env = {**os.environ, "CODEX_HOME": tmp}
        run("codex", "plugin", "marketplace", "add", str(ROOT), env=env)
        for name in codex_names:
            run("codex", "plugin", "add", f"{name}@dots", env=env)
    run("node", "plugins/dots/skills/html/scripts/generate-theme.mjs", "--check")
    html_tests = sorted(str(p.relative_to(ROOT)) for p in
                        (ROOT / "plugins/dots/skills/html/scripts").glob("*.test.mjs"))
    run("node", "--test", *html_tests)
    env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
    # Keep each suite's existing owner; both are required by the release gate.
    for suite in ("tests", "plugins/dots/tests"):
        run(sys.executable, "-m", "unittest", "discover", "-s", suite, "-p", "test_*.py", env=env)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--plugins", action="store_true", help="check both source packages without installation or suites")
    mode.add_argument("--full", action="store_true", help="run the complete repository integration gate")
    args = parser.parse_args()
    try:
        codex_names, claude_names = marketplace_plugins(ROOT)
        errors = []
        for name in sorted(set(codex_names + claude_names)):
            errors.extend(validate_plugin(ROOT / "plugins" / name))
        if errors:
            for error in errors:
                print(error, file=sys.stderr)
            return 1
        print("Plugin checks passed: " + ", ".join(sorted(set(codex_names + claude_names))), flush=True)
        if args.full:
            full_checks(codex_names, claude_names)
            print("Verify passed")
    except (ValueError, OSError, subprocess.CalledProcessError) as exc:
        print(f"Verification failed: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

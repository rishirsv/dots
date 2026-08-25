#!/usr/bin/env python3
"""Deterministic authoring checks for the source-owned Dots skill bundle."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parents[1]
DESCRIPTION_WORD_LIMIT = 45
DEFAULT_PROMPT_CHAR_LIMIT = 400
MARKDOWN_LINK = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
FORBIDDEN = {
    "prompt-wrapper residue": re.compile(r"</content>"),
    "stale review name": re.compile(r"\bUltraReview\b"),
    "generated-emphasis phrase": re.compile(r"\bI repeat\b", re.IGNORECASE),
    "all-caps critical directive": re.compile(r"\bCRITICAL\b"),
    "internal source-footer guidance": re.compile(r"files read, sessions, tools", re.IGNORECASE),
}


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def quoted_field(text: str, field: str) -> str | None:
    match = re.search(rf"^\s*{re.escape(field)}:\s*(['\"])(.*?)\1\s*$", text, re.MULTILINE)
    return match.group(2) if match else None


def plain_field(text: str, field: str) -> str | None:
    match = re.search(rf"^\s*{re.escape(field)}:\s*([^\s#]+)\s*$", text, re.MULTILINE)
    return match.group(1) if match else None


def validate_skill(skill_dir: Path, errors: list[str]) -> str | None:
    skill_file = skill_dir / "SKILL.md"
    agent_file = skill_dir / "agents" / "openai.yaml"
    text = skill_file.read_text(encoding="utf-8")
    name = plain_field(text, "name")
    if name is None:
        fail(errors, f"{skill_file}: missing frontmatter name")
    elif name != skill_dir.name:
        fail(errors, f"{skill_file}: name {name!r} must match directory {skill_dir.name!r}")

    description = quoted_field(text, "description")
    if description is None:
        fail(errors, f"{skill_file}: missing quoted frontmatter description")
    elif len(description.split()) > DESCRIPTION_WORD_LIMIT:
        fail(
            errors,
            f"{skill_file}: description is {len(description.split())} words; limit is {DESCRIPTION_WORD_LIMIT}",
        )

    if not agent_file.exists():
        fail(errors, f"{agent_file}: missing agent metadata")
        return name
    agent_text = agent_file.read_text(encoding="utf-8")
    prompt = quoted_field(agent_text, "default_prompt")
    if prompt is None:
        fail(errors, f"{agent_file}: missing quoted default_prompt")
    elif len(prompt) > DEFAULT_PROMPT_CHAR_LIMIT:
        fail(
            errors,
            f"{agent_file}: default_prompt is {len(prompt)} characters; limit is {DEFAULT_PROMPT_CHAR_LIMIT}",
        )
    if not re.search(r"^\s*allow_implicit_invocation:\s*(true|false)\s*$", agent_text, re.MULTILINE):
        fail(errors, f"{agent_file}: missing boolean allow_implicit_invocation policy")
    for field in ("icon_small", "icon_large"):
        icon = quoted_field(agent_text, field)
        if icon is not None and not (skill_dir / icon).resolve().is_file():
            fail(errors, f"{agent_file}: {field} does not resolve: {icon}")
    return name


def validate_manifest(root: Path, errors: list[str]) -> None:
    manifest_path = root / ".codex-plugin" / "plugin.json"
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(errors, f"{manifest_path}: invalid manifest: {exc}")
        return

    if manifest.get("name") != root.name:
        fail(errors, f"{manifest_path}: name must match plugin directory {root.name!r}")
    interface = manifest.get("interface")
    if isinstance(interface, dict):
        for field in ("composerIcon", "logo"):
            resource = interface.get(field)
            if isinstance(resource, str) and not (root / resource).resolve().is_file():
                fail(errors, f"{manifest_path}: interface.{field} does not resolve: {resource}")


def validate_markdown_links(root: Path, errors: list[str]) -> None:
    for path in sorted(root.rglob("*.md")):
        text = path.read_text(encoding="utf-8")
        for match in MARKDOWN_LINK.finditer(text):
            target = match.group(1).strip().strip("<>")
            if not target or target.startswith("#") or re.match(r"^[a-z][a-z0-9+.-]*:", target, re.I):
                continue
            target = unquote(target.split("#", 1)[0].split("?", 1)[0])
            if target and not (path.parent / target).resolve().exists():
                fail(errors, f"{path}: local link does not resolve: {match.group(1)}")


def validate_plugin(root: Path) -> list[str]:
    errors: list[str] = []
    skills = root / "skills"
    skill_dirs = sorted(path.parent for path in skills.glob("*/SKILL.md"))
    if not skill_dirs:
        fail(errors, f"{skills}: no source skills found")

    names: dict[str, Path] = {}
    for skill_dir in skill_dirs:
        name = validate_skill(skill_dir, errors)
        if name is not None:
            if name in names:
                fail(errors, f"{skill_dir / 'SKILL.md'}: duplicate skill name {name!r}; first used by {names[name]}")
            else:
                names[name] = skill_dir / "SKILL.md"

    validate_manifest(root, errors)
    validate_markdown_links(root, errors)
    runtime_suffixes = {".md", ".html", ".yaml", ".yml"}
    for path in sorted(skills.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in runtime_suffixes:
            continue
        text = path.read_text(encoding="utf-8")
        for label, pattern in FORBIDDEN.items():
            if pattern.search(text):
                fail(errors, f"{path}: {label}")
    return errors


def main() -> int:
    errors = validate_plugin(ROOT)

    if errors:
        print("Dots validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    skill_count = sum(1 for _ in (ROOT / "skills").glob("*/SKILL.md"))
    print(f"Dots validation passed: {skill_count} skills")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

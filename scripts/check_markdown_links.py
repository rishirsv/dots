#!/usr/bin/env python3
"""Check local Markdown links in repo documentation."""

from __future__ import annotations

import argparse
import os
import re
from pathlib import Path


SKIP_DIRS = {
    ".git",
    "node_modules",
    "vendor",
    "dist",
    "build",
    "coverage",
    "plugins",
}

LINK_RE = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
AUTO_LINK_RE = re.compile(r"<((?:https?|mailto):[^>]+)>")


def is_external(target: str) -> bool:
    lowered = target.lower()
    return (
        lowered.startswith("http://")
        or lowered.startswith("https://")
        or lowered.startswith("mailto:")
        or lowered.startswith("#")
        or lowered.startswith("tel:")
    )


def clean_target(raw: str) -> str:
    target = raw.strip()
    if not target:
        return target
    if target.startswith("<") and target.endswith(">"):
        target = target[1:-1]
    target = target.split("#", 1)[0]
    return target.strip()


def default_markdown_files(root: Path) -> list[Path]:
    files: list[Path] = []
    if (root / "SKILL.md").is_file():
        files.append(root / "SKILL.md")
        for folder in (root / "references", root / "assets"):
            if folder.is_dir():
                files.extend(sorted(folder.glob("*.md")))
        return sorted(set(files))

    roots = [root / "AGENTS.md", root / "README.md"]
    files.extend(path for path in roots if path.is_file())
    for folder in (root / ".plans", root / "plans", root / "docs"):
        if folder.is_dir():
            for current, dirs, names in os.walk(folder):
                dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
                for name in names:
                    if name.endswith(".md"):
                        files.append(Path(current) / name)
    return sorted(set(files))


def local_link_errors(path: Path) -> list[str]:
    try:
        text = path.read_text(encoding="utf-8", errors="ignore")
    except OSError as exc:
        return [f"{path}: could not read: {exc}"]

    errors: list[str] = []
    text_without_autolinks = AUTO_LINK_RE.sub("", text)
    for match in LINK_RE.finditer(text_without_autolinks):
        raw = match.group(1)
        target = clean_target(raw)
        if not target or is_external(target):
            continue
        if target.startswith("app://") or target.startswith("plugin://"):
            continue
        target_path = (path.parent / target).resolve()
        if not target_path.exists():
            errors.append(f"{path}: missing local link target: {raw}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("files", nargs="*", help="Markdown files to inspect")
    parser.add_argument("--root", default=".", help="root for default file discovery")
    args = parser.parse_args()

    root = Path(args.root).expanduser().resolve()
    files = [Path(item).expanduser().resolve() for item in args.files]
    if not files:
        files = default_markdown_files(root)

    errors: list[str] = []
    for path in files:
        if path.is_dir():
            continue
        errors.extend(local_link_errors(path))

    if errors:
        for error in errors:
            print(error)
        return 1

    print(f"Checked {len(files)} Markdown file(s); no missing local links found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

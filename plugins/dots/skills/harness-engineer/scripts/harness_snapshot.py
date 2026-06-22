#!/usr/bin/env python3
"""Print a lightweight harness snapshot for a repository."""

from __future__ import annotations

import argparse
import json
import os
import re
import stat
from pathlib import Path
from typing import Any

try:
    import tomllib
except ModuleNotFoundError:  # Python < 3.11
    tomllib = None  # type: ignore[assignment]


SKIP_DIRS = {
    ".git",
    ".hg",
    ".svn",
    "node_modules",
    "vendor",
    "dist",
    "build",
    "coverage",
    "__pycache__",
    ".next",
    ".nuxt",
    ".cache",
}

PLAN_DIR_NAMES = {".plans", "plans", "plan", "planning"}
TEST_DIR_NAMES = {"test", "tests", "__tests__", "spec", "specs", "e2e"}
BROWSER_HINTS = {
    "playwright",
    "cypress",
    "selenium",
    "puppeteer",
    "vitest",
    "storybook",
}
PYTHON_TOOL_HINTS = {
    "pytest",
    "ruff",
    "black",
    "mypy",
    "pyright",
    "tox",
    "nox",
    "uv",
    "poetry",
    "hatch",
}


def rel(path: Path, root: Path) -> str:
    try:
        return path.relative_to(root).as_posix()
    except ValueError:
        return path.as_posix()


ACTIVE_SKIP_DIRS = set(SKIP_DIRS)
ACTIVE_MAX_DEPTH = 4


def walk_limited(root: Path, max_depth: int | None = None):
    max_depth = ACTIVE_MAX_DEPTH if max_depth is None else max_depth
    root_depth = len(root.parts)
    for current, dirs, files in os.walk(root):
        current_path = Path(current)
        depth = len(current_path.parts) - root_depth
        dirs[:] = [d for d in dirs if d not in ACTIVE_SKIP_DIRS and depth < max_depth]
        yield current_path, dirs, files


def read_json(path: Path) -> dict[str, Any] | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError, UnicodeDecodeError):
        return None


def instruction_files(root: Path) -> list[str]:
    names = {"AGENTS.md", "CLAUDE.md", "GEMINI.md", "README.md", "CONTRIBUTING.md"}
    found: list[str] = []
    for current, _dirs, files in walk_limited(root):
        for name in sorted(names.intersection(files)):
            found.append(rel(current / name, root))
    return found


def plan_dirs(root: Path) -> list[str]:
    found: list[str] = []
    for current, dirs, _files in walk_limited(root):
        for name in sorted(set(dirs).intersection(PLAN_DIR_NAMES)):
            found.append(rel(current / name, root))
    return found


def package_scripts(root: Path) -> list[dict[str, Any]]:
    found: list[dict[str, Any]] = []
    for current, _dirs, files in walk_limited(root, max_depth=3):
        if "package.json" not in files:
            continue
        data = read_json(current / "package.json")
        if not isinstance(data, dict):
            continue
        scripts = data.get("scripts")
        if isinstance(scripts, dict):
            found.append(
                {
                    "file": rel(current / "package.json", root),
                    "scripts": {str(k): str(v) for k, v in sorted(scripts.items())},
                }
            )
    return found


def make_targets(path: Path) -> list[str]:
    targets: list[str] = []
    pattern = re.compile(r"^([A-Za-z0-9_.-]+):(?:\s|$)")
    try:
        lines = path.read_text(encoding="utf-8", errors="ignore").splitlines()
    except OSError:
        return targets
    for line in lines:
        if line.startswith("\t") or line.startswith("."):
            continue
        match = pattern.match(line)
        if match and match.group(1) not in {"default"}:
            targets.append(match.group(1))
    return sorted(set(targets))


def task_targets(root: Path) -> list[dict[str, Any]]:
    found: list[dict[str, Any]] = []
    for current, _dirs, files in walk_limited(root, max_depth=3):
        for name in ("Makefile", "makefile", "GNUmakefile"):
            if name in files:
                targets = make_targets(current / name)
                found.append({"file": rel(current / name, root), "targets": targets})
        for name in ("justfile", "Justfile", "Taskfile.yml", "Taskfile.yaml"):
            if name in files:
                found.append({"file": rel(current / name, root), "targets": []})
    return found


def pyproject_sources(path: Path) -> list[str]:
    candidates: list[str] = []
    if tomllib is None:
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            return candidates
        for name in sorted(PYTHON_TOOL_HINTS):
            if re.search(rf"^\[tool\.{re.escape(name)}(?:\.|\])", text, re.MULTILINE):
                candidates.append(f"tool:{name}")
        if re.search(r"^\[project\.scripts\]", text, re.MULTILINE):
            candidates.append("project scripts")
        if re.search(r"^\[tool\.poetry\.scripts\]", text, re.MULTILINE):
            candidates.append("poetry scripts")
        return candidates

    try:
        data = tomllib.loads(path.read_text(encoding="utf-8"))
    except (OSError, tomllib.TOMLDecodeError, UnicodeDecodeError):
        return candidates

    project = data.get("project")
    if isinstance(project, dict) and isinstance(project.get("scripts"), dict):
        candidates.extend(f"project script:{name}" for name in sorted(project["scripts"]))

    tool = data.get("tool")
    if isinstance(tool, dict):
        poetry = tool.get("poetry")
        if isinstance(poetry, dict) and isinstance(poetry.get("scripts"), dict):
            candidates.extend(f"poetry script:{name}" for name in sorted(poetry["scripts"]))
        for name in sorted(set(tool).intersection(PYTHON_TOOL_HINTS)):
            candidates.append(f"tool:{name}")
    return candidates


def executable_scripts(path: Path, limit: int = 20) -> list[str]:
    scripts: list[str] = []
    try:
        children = sorted(path.iterdir())
    except OSError:
        return scripts
    for child in children:
        if len(scripts) >= limit:
            break
        if not child.is_file():
            continue
        try:
            mode = child.stat().st_mode
        except OSError:
            continue
        if mode & (stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH):
            scripts.append(child.name)
    return scripts


def language_command_sources(root: Path) -> list[dict[str, Any]]:
    found: list[dict[str, Any]] = []
    for current, dirs, files in walk_limited(root, max_depth=4):
        if "pyproject.toml" in files:
            candidates = pyproject_sources(current / "pyproject.toml")
            if not candidates:
                candidates = ["inspect tool tables for pytest/ruff/mypy/build commands"]
            found.append(
                {
                    "file": rel(current / "pyproject.toml", root),
                    "candidates": candidates,
                }
            )
        for name in ("tox.ini", "noxfile.py", "requirements.txt"):
            if name in files:
                found.append({"file": rel(current / name, root), "candidates": []})
        if "Cargo.toml" in files:
            found.append(
                {
                    "file": rel(current / "Cargo.toml", root),
                    "candidates": ["cargo check", "cargo test", "cargo build"],
                }
            )
        if "go.mod" in files:
            found.append(
                {
                    "file": rel(current / "go.mod", root),
                    "candidates": ["go test ./...", "go build ./..."],
                }
            )
        if "scripts" in dirs:
            script_path = current / "scripts"
            scripts = executable_scripts(script_path)
            found.append(
                {
                    "file": rel(script_path, root),
                    "candidates": [f"./{rel(script_path / script, root)}" for script in scripts],
                }
            )
    return found


def ci_files(root: Path) -> list[str]:
    candidates: list[str] = []
    for path in (
        root / ".github" / "workflows",
        root / ".gitlab-ci.yml",
        root / "azure-pipelines.yml",
        root / "circle.yml",
    ):
        if path.is_dir():
            for child in sorted(path.glob("*")):
                if child.is_file():
                    candidates.append(rel(child, root))
        elif path.is_file():
            candidates.append(rel(path, root))
    return candidates


def test_dirs(root: Path) -> list[str]:
    found: list[str] = []
    for current, dirs, _files in walk_limited(root, max_depth=4):
        for name in sorted(set(dirs).intersection(TEST_DIR_NAMES)):
            found.append(rel(current / name, root))
    return found


def browser_tooling(root: Path, packages: list[dict[str, Any]]) -> list[str]:
    found: set[str] = set()
    config_names = {
        "playwright.config.ts",
        "playwright.config.js",
        "playwright.config.mjs",
        "cypress.config.ts",
        "cypress.config.js",
        "vite.config.ts",
        "vite.config.js",
        "storybook.config.ts",
    }
    for current, _dirs, files in walk_limited(root, max_depth=4):
        for name in sorted(config_names.intersection(files)):
            found.add(rel(current / name, root))
    for package in packages:
        data = read_json(root / package["file"])
        if not isinstance(data, dict):
            continue
        deps: dict[str, Any] = {}
        for key in ("dependencies", "devDependencies", "optionalDependencies"):
            value = data.get(key)
            if isinstance(value, dict):
                deps.update(value)
        for name in deps:
            if any(hint in name.lower() for hint in BROWSER_HINTS):
                found.add(f"{package['file']} dependency:{name}")
    return sorted(found)


def render_markdown(snapshot: dict[str, Any]) -> str:
    lines: list[str] = ["# Harness Snapshot", ""]
    lines.extend(["## Instruction Files", ""])
    lines.extend(f"- {item}" for item in snapshot["instruction_files"] or ["none found"])
    lines.extend(["", "## Planning And State Directories", ""])
    lines.extend(f"- {item}" for item in snapshot["plan_dirs"] or ["none found"])
    lines.extend(["", "## Package Scripts", ""])
    if snapshot["package_scripts"]:
        for package in snapshot["package_scripts"]:
            lines.append(f"- {package['file']}")
            for name, command in package["scripts"].items():
                lines.append(f"  - `{name}`: `{command}`")
    else:
        lines.append("- none found")
    lines.extend(["", "## Task Runner Files", ""])
    if snapshot["task_targets"]:
        for task in snapshot["task_targets"]:
            suffix = ", ".join(task["targets"]) if task["targets"] else "targets not parsed"
            lines.append(f"- {task['file']}: {suffix}")
    else:
        lines.append("- none found")
    lines.extend(["", "## Language Command Sources", ""])
    if snapshot["language_command_sources"]:
        for source in snapshot["language_command_sources"]:
            suffix = ", ".join(source["candidates"]) if source["candidates"] else "inspect file"
            lines.append(f"- {source['file']}: {suffix}")
    else:
        lines.append("- none found")
    lines.extend(["", "## CI Files", ""])
    lines.extend(f"- {item}" for item in snapshot["ci_files"] or ["none found"])
    lines.extend(["", "## Test Directories", ""])
    lines.extend(f"- {item}" for item in snapshot["test_dirs"] or ["none found"])
    lines.extend(["", "## Browser Or UI Tooling", ""])
    lines.extend(f"- {item}" for item in snapshot["browser_tooling"] or ["none found"])
    lines.append("")
    return "\n".join(lines)


def build_snapshot(root: Path) -> dict[str, Any]:
    packages = package_scripts(root)
    return {
        "root": root.as_posix(),
        "instruction_files": instruction_files(root),
        "plan_dirs": plan_dirs(root),
        "package_scripts": packages,
        "task_targets": task_targets(root),
        "language_command_sources": language_command_sources(root),
        "ci_files": ci_files(root),
        "test_dirs": test_dirs(root),
        "browser_tooling": browser_tooling(root, packages),
    }


def main() -> int:
    global ACTIVE_MAX_DEPTH, ACTIVE_SKIP_DIRS

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=".", help="repository root to inspect")
    parser.add_argument("--json", action="store_true", help="emit JSON instead of Markdown")
    parser.add_argument("--max-depth", type=int, default=4, help="maximum directory depth to scan")
    parser.add_argument(
        "--skip-dir",
        action="append",
        default=[],
        help="additional directory basename to skip; repeatable",
    )
    parser.add_argument(
        "--include-dir",
        action="append",
        default=[],
        help="directory basename to remove from the default skip list; repeatable",
    )
    args = parser.parse_args()

    root = Path(args.root).expanduser().resolve()
    if not root.is_dir():
        parser.error(f"not a directory: {root}")

    ACTIVE_MAX_DEPTH = args.max_depth
    ACTIVE_SKIP_DIRS = (set(SKIP_DIRS) - set(args.include_dir)) | set(args.skip_dir)
    snapshot = build_snapshot(root)
    if args.json:
        print(json.dumps(snapshot, indent=2, sort_keys=True))
    else:
        print(render_markdown(snapshot))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

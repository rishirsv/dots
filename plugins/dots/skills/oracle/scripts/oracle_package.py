#!/usr/bin/env python3
"""Build an Oracle handoff from an authored prompt and explicit context files."""

from __future__ import annotations

import argparse
import glob
import os
from pathlib import Path
import re
import shutil
import tempfile
import zipfile


IGNORED_PARTS = {
    ".git",
    ".hg",
    ".svn",
    ".cache",
    ".next",
    ".pytest_cache",
    ".turbo",
    "__pycache__",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "tmp",
    "vendor",
}
BLOCKED_NAMES = {
    ".env",
    "credentials.json",
    "id_ed25519",
    "id_rsa",
}
BLOCKED_NAME_FRAGMENTS = {"credential", "secret", "token"}
BLOCKED_SUFFIXES = {".key", ".p12", ".pem", ".pfx"}


def slugify(text: str) -> str:
    words = re.findall(r"[a-zA-Z0-9]+", text.lower())
    return "-".join(words[:6]) or "handoff"


def relative_to_root(path: Path, root: Path) -> Path:
    resolved = path.resolve()
    try:
        return resolved.relative_to(root)
    except ValueError:
        raise SystemExit(f"Input resolves outside repository root {root}: {path}")


def is_ignored(relative: Path) -> bool:
    return any(part in IGNORED_PARTS for part in relative.parts)


def is_blocked(relative: Path) -> bool:
    name = relative.name.lower()
    path = relative.as_posix().lower()
    return (
        name in BLOCKED_NAMES
        or name.startswith(".env.")
        or any(fragment in path for fragment in BLOCKED_NAME_FRAGMENTS)
        or relative.suffix.lower() in BLOCKED_SUFFIXES
    )


def selector_matches(selector: str, root: Path) -> list[Path]:
    expanded = Path(selector).expanduser()
    pattern = str(expanded if expanded.is_absolute() else root / selector)
    matches = [Path(match) for match in glob.glob(pattern, recursive=True)]
    literal = expanded if expanded.is_absolute() else root / selector
    if literal.exists() and literal not in matches:
        matches.append(literal)
    if not matches:
        raise SystemExit(f"File selector matched nothing: {selector}")
    return matches


def files_under(path: Path):
    if path.is_file():
        yield path
        return
    for current, directories, filenames in os.walk(path, followlinks=False):
        directories[:] = [name for name in directories if name not in IGNORED_PARTS]
        current_path = Path(current)
        yield from (current_path / name for name in filenames)


def expand_files(selectors: list[str], root: Path) -> list[tuple[Path, Path]]:
    selected: dict[Path, Path] = {}
    for selector in selectors:
        eligible_for_selector = 0
        for match in selector_matches(selector, root):
            relative_to_root(match, root)
            for path in files_under(match):
                relative = relative_to_root(path, root)
                if is_ignored(relative):
                    continue
                if is_blocked(relative):
                    raise SystemExit(
                        f"Credential-like file selected: {relative}. "
                        "Create and select a redacted copy instead."
                    )
                resolved = path.resolve()
                selected[resolved] = relative
                eligible_for_selector += 1
        if eligible_for_selector == 0:
            raise SystemExit(f"File selector produced no eligible files: {selector}")
    return sorted(selected.items(), key=lambda item: item[1].as_posix())


def output_path(prompt: str, explicit: str | None) -> Path:
    if explicit:
        return Path(explicit).expanduser().resolve()
    return Path.home() / "Desktop" / f"oracle-{slugify(prompt)}"


def report(
    destination: Path,
    prompt_bytes: int,
    files: list[tuple[Path, Path]],
    dry_run: bool,
) -> None:
    prefix = "dry-run: " if dry_run else ""
    print(f"{prefix}destination={destination}")
    print(f"prompt.md ({prompt_bytes} bytes)")
    total = 0
    for path, relative in files:
        size = path.stat().st_size
        total += size
        print(f"context: {relative.as_posix()} ({size} bytes)")
    print(f"context_files={len(files)} context_bytes={total}")


def write_handoff(destination: Path, prompt: str, files: list[tuple[Path, Path]]) -> None:
    if destination.exists():
        raise SystemExit(f"Destination already exists: {destination}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = Path(tempfile.mkdtemp(prefix=f".{destination.name}.", dir=destination.parent))
    try:
        (temporary / "prompt.md").write_text(prompt, encoding="utf-8")
        if files:
            archive_path = temporary / "context.zip"
            with zipfile.ZipFile(archive_path, "w", zipfile.ZIP_DEFLATED) as archive:
                for path, relative in files:
                    archive.write(path, relative.as_posix())
            with zipfile.ZipFile(archive_path) as archive:
                failed = archive.testzip()
                if failed:
                    raise RuntimeError(f"Archive verification failed at {failed}")
        os.replace(temporary, destination)
    except BaseException:
        shutil.rmtree(temporary, ignore_errors=True)
        raise


def main() -> int:
    parser = argparse.ArgumentParser(description="Build a strict Oracle handoff.")
    parser.add_argument("--prompt-file", required=True, help="Authored prompt copied to prompt.md.")
    parser.add_argument(
        "--file",
        action="append",
        default=[],
        help="Context file, directory, or glob. Repeatable.",
    )
    parser.add_argument("--root", default=".", help="Repository root that bounds context files.")
    parser.add_argument(
        "--output-dir",
        help="Exact handoff directory. Defaults to ~/Desktop/oracle-<prompt-topic>.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate and print the handoff without writing it.",
    )
    args = parser.parse_args()

    root = Path(args.root).expanduser().resolve()
    if not root.is_dir():
        raise SystemExit(f"Repository root does not exist: {root}")
    prompt_file = Path(args.prompt_file).expanduser()
    if not prompt_file.is_file():
        raise SystemExit(f"Prompt file does not exist: {prompt_file}")
    prompt = prompt_file.read_text(encoding="utf-8").strip()
    if not prompt:
        raise SystemExit(f"Prompt file is empty: {prompt_file}")

    files = expand_files(args.file, root)
    destination = output_path(prompt, args.output_dir)
    if destination.exists():
        raise SystemExit(f"Destination already exists: {destination}")
    report(destination, len(prompt.encode("utf-8")), files, args.dry_run)
    if not args.dry_run:
        write_handoff(destination, prompt + "\n", files)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

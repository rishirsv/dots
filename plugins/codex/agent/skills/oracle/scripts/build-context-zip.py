#!/usr/bin/env python3

from __future__ import annotations

import argparse
import datetime as dt
import fnmatch
import glob
from dataclasses import dataclass
from pathlib import Path
import sys
import zipfile


@dataclass(frozen=True)
class BundleEntry:
    abs_path: Path
    rel_path: Path
    reason: str


DEFAULT_EXCLUDED_DIRS = {
    ".agents",
    ".git",
    ".next",
    ".pytest_cache",
    ".turbo",
    "__pycache__",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "tmp",
}

DEFAULT_EXCLUDED_BASENAMES = {
    ".DS_Store",
    "MANIFEST.md",
    "context.txt",
    "context.zip",
    "prompt.md",
}

DEFAULT_EXCLUDED_SUFFIXES = {
    ".key",
    ".pem",
    ".p12",
}

HARD_DENY_BASENAMES = {
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    ".env.test",
    "MANIFEST.md",
    "context.txt",
    "context.zip",
    "id_dsa",
    "id_ecdsa",
    "id_ed25519",
    "id_rsa",
    "prompt.md",
}

HARD_DENY_SUFFIXES = {
    ".key",
    ".p12",
    ".pem",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build Oracle context artifacts for external model uploads.",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument("--repo-root", default=".", help="Repository root (defaults to current directory).")
    parser.add_argument("--out", default="", help="Optional output zip path (for review mode).")
    parser.add_argument("--text-out", default="", help="Optional text bundle path (for planning mode).")
    parser.add_argument("--task", default="", help="Optional short task summary for the manifest.")
    parser.add_argument(
        "--constraint",
        action="append",
        default=[],
        help="Optional constraint or preference line for the manifest (repeatable).",
    )
    parser.add_argument(
        "--verify",
        action="append",
        default=[],
        help="Optional local verification command for the manifest (repeatable).",
    )
    parser.add_argument(
        "--exclude",
        action="append",
        default=[],
        help='Exclude paths matching a glob-style pattern (repeatable), for example `--exclude "**/*.snap"`.',
    )
    parser.add_argument(
        "--no-default-excludes",
        action="store_true",
        help="Disable ordinary built-in excludes such as .git and node_modules. Hard-denied secret-like and generated Oracle outputs still stay excluded.",
    )
    parser.add_argument(
        "--entry",
        action="append",
        default=[],
        help='File entry in the form `PATH::REASON`. PATH may be a file, directory, or glob. Repeatable.',
    )
    parser.add_argument(
        "--entry-file",
        action="append",
        default=[],
        help="Path to a text file containing PATH::REASON entries, one per line. Blank lines and # comments are ignored.",
    )
    parser.add_argument(
        "--max-tokens",
        type=int,
        default=0,
        help="Fail if the estimated raw token count exceeds this budget.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print the manifest and exit.")
    parser.add_argument(
        "--estimate-tokens",
        action="store_true",
        help="Estimate bundle size before writing artifacts.",
    )
    return parser.parse_args()


def split_entry(raw: str) -> tuple[str, str]:
    if "::" in raw:
        path_str, reason = raw.split("::", 1)
        return path_str.strip(), reason.strip()
    return raw.strip(), ""


def is_within(child: Path, parent: Path) -> bool:
    try:
        child.relative_to(parent)
        return True
    except ValueError:
        return False


def looks_like_glob(path_str: str) -> bool:
    return any(char in path_str for char in "*?[")


def expand_entry_paths(repo_root: Path, path_str: str) -> list[Path]:
    if looks_like_glob(path_str):
        pattern = str((repo_root / path_str).resolve()) if not Path(path_str).is_absolute() else path_str
        matches = [Path(match).resolve() for match in glob.glob(pattern, recursive=True)]
        if not matches:
            raise SystemExit(f"No matches for glob: {path_str}")
        return matches

    abs_path = (repo_root / path_str).resolve() if not Path(path_str).is_absolute() else Path(path_str).resolve()
    if not abs_path.exists():
        raise SystemExit(f"Missing path: {abs_path}")
    if abs_path.is_dir():
        return [path for path in abs_path.rglob("*") if path.is_file()]
    return [abs_path]


def matches_any(path_for_match: str, patterns: list[str]) -> bool:
    return any(fnmatch.fnmatch(path_for_match, pattern) for pattern in patterns)


def is_secret_like(rel_path: Path) -> bool:
    name = rel_path.name
    if name.startswith(".env"):
        return True
    if rel_path.suffix.lower() in DEFAULT_EXCLUDED_SUFFIXES:
        return True
    return False


def is_hard_denied(rel_path: Path) -> bool:
    name = rel_path.name
    lowered = name.lower()
    parts = rel_path.parts
    if lowered.startswith(".env"):
        return True
    if lowered in {item.lower() for item in HARD_DENY_BASENAMES}:
        return True
    if rel_path.suffix.lower() in HARD_DENY_SUFFIXES:
        return True
    if ".agents" in parts and "oracle" in parts:
        return True
    return False


def should_exclude(rel_path: Path, exclude_patterns: list[str], *, default_excludes_enabled: bool) -> bool:
    if is_hard_denied(rel_path):
        return True
    if default_excludes_enabled:
        if any(part in DEFAULT_EXCLUDED_DIRS for part in rel_path.parts[:-1]):
            return True
        if rel_path.name in DEFAULT_EXCLUDED_BASENAMES:
            return True
        if is_secret_like(rel_path):
            return True
    return matches_any(rel_path.as_posix(), exclude_patterns)


def build_entries(
    repo_root: Path,
    raw_entries: list[str],
    exclude_patterns: list[str],
    *,
    default_excludes_enabled: bool,
) -> list[BundleEntry]:
    repo_root = repo_root.resolve()
    entries: list[BundleEntry] = []

    for raw in raw_entries:
        path_str, reason = split_entry(raw)
        if not path_str:
            continue

        expanded = sorted(set(expand_entry_paths(repo_root, path_str)), key=lambda path: str(path).lower())
        for abs_path in expanded:
            if not is_within(abs_path, repo_root):
                raise SystemExit(f"Refusing to include file outside repo root: {abs_path}")
            if not abs_path.is_file():
                continue

            rel_path = abs_path.relative_to(repo_root)
            if should_exclude(rel_path, exclude_patterns, default_excludes_enabled=default_excludes_enabled):
                continue

            entries.append(BundleEntry(abs_path=abs_path, rel_path=rel_path, reason=reason))

    deduped: list[BundleEntry] = []
    seen: set[Path] = set()
    for entry in entries:
        if entry.rel_path in seen:
            continue
        seen.add(entry.rel_path)
        deduped.append(entry)

    return sorted(deduped, key=lambda entry: entry.rel_path.as_posix().lower())


def read_entry_file(raw_path: str) -> list[str]:
    path = Path(raw_path).expanduser()
    if not path.exists():
        raise SystemExit(f"Missing entry file: {path}")
    entries: list[str] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        entries.append(stripped)
    return entries


def format_bytes(size: int) -> str:
    if size >= 1024 * 1024:
        return f"{size / (1024 * 1024):.1f} MB"
    if size >= 1024:
        return f"{size / 1024:.1f} KB"
    return f"{size} B"


def estimate_tokens(total_bytes: int) -> tuple[int, str]:
    estimated = max(1, total_bytes // 4)
    if estimated > 128_000:
        return estimated, "Likely too large for many chat uploads; trim the bundle."
    if estimated > 80_000:
        return estimated, "Large bundle; consider narrowing the scope."
    return estimated, ""


def render_manifest(
    repo_root: Path,
    entries: list[BundleEntry],
    *,
    task: str,
    constraints: list[str],
    verify: list[str],
    exclude_patterns: list[str],
    default_excludes_enabled: bool,
) -> str:
    created_at = dt.datetime.now(dt.timezone.utc).isoformat()
    total_bytes = sum(entry.abs_path.stat().st_size for entry in entries)
    lines = [
        "# Oracle context manifest",
        "",
        f"- Created (UTC): {created_at}",
        f"- Repo root: {repo_root.resolve()}",
        f"- Files included: {len(entries)}",
        f"- Total raw size: {format_bytes(total_bytes)}",
        "",
    ]

    if task.strip():
        lines.extend(["## Task summary", task.strip(), ""])

    cleaned_constraints = [item.strip() for item in constraints if item and item.strip()]
    if cleaned_constraints:
        lines.append("## Constraints")
        lines.extend(f"- {item}" for item in cleaned_constraints)
        lines.append("")

    cleaned_verify = [item.strip() for item in verify if item and item.strip()]
    if cleaned_verify:
        lines.append("## Local verification")
        lines.extend(f"- `{item}`" for item in cleaned_verify)
        lines.append("")

    lines.append("## Excludes")
    lines.append("- Hard-denied always: .env*, private key files, generated Oracle outputs, and .agents/oracle outputs")
    if default_excludes_enabled:
        lines.append(f"- Default excluded directories: {', '.join(sorted(DEFAULT_EXCLUDED_DIRS))}")
        lines.append(f"- Default excluded file names: {', '.join(sorted(DEFAULT_EXCLUDED_BASENAMES))}")
        lines.append(f"- Default secret-like exclusions: {', '.join(sorted(DEFAULT_EXCLUDED_SUFFIXES))}, .env*")
    else:
        lines.append("- Default excludes: disabled")
    for pattern in exclude_patterns:
        lines.append(f"- Custom pattern: `{pattern}`")
    lines.append("")

    lines.append("## Files")
    for entry in entries:
        reason = entry.reason or "Included as relevant context."
        lines.append(f"- `{entry.rel_path.as_posix()}` - {reason}")
    lines.append("")

    lines.append("## Notes")
    lines.append("- `prompt.md` is intentionally separate from the context artifact.")
    lines.append("- Treat included files as authoritative and cite exact paths for concrete claims.")
    lines.append("")
    return "\n".join(lines)


def language_hint(path: Path) -> str:
    return {
        ".css": "css",
        ".go": "go",
        ".html": "html",
        ".java": "java",
        ".js": "js",
        ".json": "json",
        ".jsx": "jsx",
        ".kt": "kotlin",
        ".md": "md",
        ".py": "python",
        ".rb": "ruby",
        ".rs": "rust",
        ".sh": "bash",
        ".sql": "sql",
        ".swift": "swift",
        ".toml": "toml",
        ".ts": "ts",
        ".tsx": "tsx",
        ".yaml": "yaml",
        ".yml": "yaml",
        ".zsh": "bash",
    }.get(path.suffix.lower(), "")


def render_text_bundle(
    repo_root: Path,
    entries: list[BundleEntry],
    *,
    task: str,
    constraints: list[str],
    verify: list[str],
    exclude_patterns: list[str],
    default_excludes_enabled: bool,
) -> str:
    manifest = render_manifest(
        repo_root,
        entries,
        task=task,
        constraints=constraints,
        verify=verify,
        exclude_patterns=exclude_patterns,
        default_excludes_enabled=default_excludes_enabled,
    )

    lines = [
        "# Oracle text context bundle",
        "",
        "This file is intended for ChatGPT web uploads.",
        "Treat the manifest and file contents below as the authoritative repository slice.",
        "",
        manifest,
        "",
        "## File contents",
        "",
    ]

    for entry in entries:
        lines.append(f"### File: {entry.rel_path.as_posix()}")
        if entry.reason:
            lines.append(f"Reason: {entry.reason}")
        hint = language_hint(entry.rel_path)
        if hint:
            lines.append(f"Language hint: {hint}")
        lines.append("")
        try:
            text = entry.abs_path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            lines.append("[Skipped: file is not valid UTF-8 text.]")
            lines.append("")
            continue

        lines.append(f"<<< BEGIN FILE {entry.rel_path.as_posix()} >>>")
        lines.append(text.rstrip("\n"))
        lines.append(f"<<< END FILE {entry.rel_path.as_posix()} >>>")
        lines.append("")

    return "\n".join(lines)


def write_zip(out_path: Path, manifest: str, entries: list[BundleEntry]) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(out_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zip_file:
        zip_file.writestr("MANIFEST.md", manifest)
        for entry in entries:
            zip_file.write(entry.abs_path, arcname=entry.rel_path.as_posix())


def main() -> int:
    args = parse_args()
    if not args.dry_run and not str(args.out).strip() and not str(args.text_out).strip():
        raise SystemExit("Provide at least one output path with --out or --text-out.")

    repo_root = Path(args.repo_root).expanduser().resolve()
    exclude_patterns = [pattern.strip() for pattern in args.exclude if pattern and pattern.strip()]
    default_excludes_enabled = not bool(args.no_default_excludes)
    raw_entries = list(args.entry or [])
    for entry_file in args.entry_file or []:
        raw_entries.extend(read_entry_file(entry_file))
    entries = build_entries(
        repo_root,
        raw_entries,
        exclude_patterns,
        default_excludes_enabled=default_excludes_enabled,
    )
    if not entries:
        raise SystemExit("No files matched after expanding entries and applying excludes. Check --entry and --exclude.")

    total_bytes = sum(entry.abs_path.stat().st_size for entry in entries)
    tokens, warning = estimate_tokens(total_bytes)
    if args.max_tokens and tokens > args.max_tokens:
        raise SystemExit(f"Estimated tokens ~{tokens:,} exceed --max-tokens {args.max_tokens:,}. Trim the bundle.")

    if args.estimate_tokens:
        print(f"Estimated tokens: ~{tokens:,}", file=sys.stderr)
        if warning:
            print(f"WARNING: {warning}", file=sys.stderr)

    manifest = render_manifest(
        repo_root,
        entries,
        task=args.task,
        constraints=list(args.constraint or []),
        verify=list(args.verify or []),
        exclude_patterns=exclude_patterns,
        default_excludes_enabled=default_excludes_enabled,
    )

    if args.dry_run:
        print(manifest)
        return 0

    if str(args.out).strip():
        out_path = Path(args.out).expanduser()
        write_zip(out_path, manifest, entries)
        print(f"Wrote: {out_path} ({len(entries)} files)", file=sys.stderr)

    if str(args.text_out).strip():
        text_out_path = Path(args.text_out).expanduser()
        text_out_path.parent.mkdir(parents=True, exist_ok=True)
        text_bundle = render_text_bundle(
            repo_root,
            entries,
            task=args.task,
            constraints=list(args.constraint or []),
            verify=list(args.verify or []),
            exclude_patterns=exclude_patterns,
            default_excludes_enabled=default_excludes_enabled,
        )
        text_out_path.write_text(text_bundle, encoding="utf-8")
        print(f"Wrote: {text_out_path}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

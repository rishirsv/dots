#!/usr/bin/env python3
"""Sync local agents before Codex-created commits when relevant files changed."""

import json
import os
import re
import shlex
import subprocess
import sys
from pathlib import Path


def git(root, *args):
    return subprocess.run(
        ["git", "-C", str(root), *args],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    ).stdout


def find_repo_root(cwd):
    try:
        return Path(git(cwd, "rev-parse", "--show-toplevel").strip())
    except subprocess.CalledProcessError:
        return None


def command_is_git_commit(command):
    try:
        tokens = shlex.split(command)
    except ValueError:
        return bool(re.search(r"(^|[\s;&|()])git\s+.*\bcommit\b", command))

    for index, token in enumerate(tokens):
        if token != "git":
            continue

        cursor = index + 1
        while cursor < len(tokens):
            current = tokens[cursor]
            if current in {"-C", "--git-dir", "--work-tree"}:
                cursor += 2
            elif current == "-c":
                cursor += 2
            elif current.startswith("-c"):
                cursor += 1
            elif current.startswith("-"):
                cursor += 1
            else:
                return current == "commit"

    return False


def command_uses_commit_all(command):
    try:
        tokens = shlex.split(command)
    except ValueError:
        return bool(re.search(r"\bgit\s+.*\bcommit\b.*\s(-a|--all)\b", command))

    try:
        commit_index = tokens.index("commit")
    except ValueError:
        return False

    return any(token in {"-a", "--all"} for token in tokens[commit_index + 1 :])


def changed_paths(root, include_unstaged):
    paths = set(git(root, "diff", "--cached", "--name-only").splitlines())
    if include_unstaged:
        paths.update(git(root, "diff", "--name-only").splitlines())
    return paths


def is_relevant(path):
    return (
        path == "global_instructions.md"
        or path == ".codex/config.toml"
        or path == ".codex/hooks.json"
        or path.startswith(".codex/agents/")
        or path.startswith(".codex/hooks/")
    )


def emit(message):
    print(json.dumps({"systemMessage": message}))


def main():
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0

    command = payload.get("tool_input", {}).get("command", "")
    if not command_is_git_commit(command):
        return 0

    cwd = Path(payload.get("cwd") or os.getcwd())
    root = find_repo_root(cwd)
    if root is None:
        return 0

    if os.environ.get("AGENT_CODEX_HOOK_SCOPE") == "system":
        project_hook = root / ".codex" / "hooks" / Path(__file__).name
        if project_hook.exists() and project_hook.resolve() != Path(__file__).resolve():
            return 0

    sync_script = root / "scripts" / "sync-local-agents.sh"
    if not sync_script.exists():
        return 0

    paths = changed_paths(root, command_uses_commit_all(command))
    if not any(is_relevant(path) for path in paths):
        return 0

    try:
        result = subprocess.run(
            [str(sync_script)],
            cwd=str(root),
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    except subprocess.CalledProcessError as error:
        if error.stdout:
            print(error.stdout, file=sys.stderr, end="")
        if error.stderr:
            print(error.stderr, file=sys.stderr, end="")
        print(f"Failed to sync local agents before commit: {error}", file=sys.stderr)
        return 2

    if result.stderr:
        print(result.stderr, file=sys.stderr, end="")

    emit("Synced local Codex and Claude agents before commit.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

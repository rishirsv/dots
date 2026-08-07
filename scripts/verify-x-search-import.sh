#!/usr/bin/env zsh
set -euo pipefail

ROOT="${0:A:h:h}"
UPSTREAM_REPOSITORY="https://github.com/mattppal/agent-plugins.git"
UPSTREAM_COMMIT="ff3620be60686feba2ac851962352217bbc91105"
TEMP_ROOT="$(mktemp -d /tmp/dots-x-search-import.XXXXXX)"
trap 'rm -rf "$TEMP_ROOT"' EXIT

git clone --quiet "$UPSTREAM_REPOSITORY" "$TEMP_ROOT/repository"
git -C "$TEMP_ROOT/repository" checkout --quiet "$UPSTREAM_COMMIT"

python3 - "$ROOT/plugins/pulse/server/x-search" "$TEMP_ROOT/repository/plugins/x-search" "$UPSTREAM_COMMIT" <<'PY'
import hashlib
import os
import stat
import sys
from pathlib import Path

local_root = Path(sys.argv[1])
upstream_root = Path(sys.argv[2])
commit = sys.argv[3]
repository = "https://github.com/mattppal/agent-plugins.git"

def entries(root: Path):
    result = {}
    for path in sorted(root.rglob("*")):
        if "node_modules" in path.parts:
            continue
        relative = path.relative_to(root).as_posix()
        mode = stat.S_IMODE(path.lstat().st_mode)
        if path.is_symlink():
            result[relative] = ("symlink", mode, os.readlink(path))
        elif path.is_file():
            result[relative] = ("file", mode, path.read_bytes())
        elif path.is_dir():
            result[relative] = ("directory", mode, b"")
        else:
            raise SystemExit(f"unsupported filesystem entry: {path}")
    return result

local = entries(local_root)
upstream = entries(upstream_root)
if set(local) != set(upstream):
    missing = sorted(set(upstream) - set(local))
    extra = sorted(set(local) - set(upstream))
    raise SystemExit(f"x-search path mismatch: missing={missing!r} extra={extra!r}")

for relative in sorted(upstream):
    if local[relative] != upstream[relative]:
        local_kind, _, local_value = local[relative]
        upstream_kind, _, upstream_value = upstream[relative]
        if local_kind == upstream_kind == "file":
            detail = f"sha256 {hashlib.sha256(local_value).hexdigest()} != {hashlib.sha256(upstream_value).hexdigest()}"
        else:
            detail = f"local={local[relative]!r} upstream={upstream[relative]!r}"
        raise SystemExit(f"x-search mismatch at {relative}: {detail}")

file_count = sum(1 for kind, _, _ in upstream.values() if kind == "file")
print(f"bundled x-search matches {repository}@{commit}: {file_count} files")
PY

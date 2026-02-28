#!/usr/bin/env bash
# oracle.sh - Convenience wrapper for build-context-zip.py
#
# Usage:
#   oracle.sh --out <path> --task "..." --entry "path::reason" [options]
#   oracle.sh --help
#   oracle.sh --dry-run ...    # Preview manifest without writing zip
#   oracle.sh --estimate-tokens ...  # Estimate token count
#
# Environment:
#   REPO_ROOT - Repository root (defaults to current directory)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/build-context-zip.py"

exec python3 "$PYTHON_SCRIPT" --repo-root "${REPO_ROOT:-.}" "$@"

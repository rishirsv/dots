#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "$0")/../.." && pwd)"
tests_dir="$root/.meta-skill/tests"

if find "$tests_dir" -mindepth 1 -type d | grep -q .; then
  echo "Nested folders are not allowed under .meta-skill/tests" >&2
  exit 1
fi

missing_exec=""
for file in "$tests_dir"/*; do
  [ -f "$file" ] || continue
  [ -x "$file" ] || missing_exec="$missing_exec $file"
done

if [ -n "$missing_exec" ]; then
  echo "Deterministic tests must be executable:$missing_exec" >&2
  exit 1
fi

echo "flat-tests ok"

#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: ./tests/plugin-eval/run-benchmark.sh <skill-name>" >&2
  exit 1
fi

skill_name="$1"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/../.." && pwd)"

target_path="$repo_root/skills/$skill_name"
config_path="$repo_root/tests/plugin-eval/$skill_name/benchmark.json"
latest_dir="$repo_root/tests/plugin-eval/$skill_name/latest"
runs_archive="$repo_root/tests/plugin-eval/$skill_name/runs"
plugin_eval="$repo_root/plugins/plugin-eval/scripts/plugin-eval.js"
runs_root="$target_path/.plugin-eval/runs"
site_builder="$target_path/scripts/build_run_review.py"

if [ ! -d "$target_path" ]; then
  echo "Unknown skill: $skill_name" >&2
  exit 1
fi

if [ ! -f "$config_path" ]; then
  echo "Missing benchmark config: $config_path" >&2
  exit 1
fi

mkdir -p "$latest_dir" "$runs_archive"

before_file="$(mktemp)"
after_file="$(mktemp)"
cleanup() {
  rm -f "$before_file" "$after_file"
}
trap cleanup EXIT

if [ -d "$runs_root" ]; then
  find "$runs_root" -mindepth 1 -maxdepth 1 -type d | sort > "$before_file"
else
  : > "$before_file"
fi

status=0
if ! node "$plugin_eval" benchmark "$target_path" \
  --config "$config_path" \
  --usage-out "$latest_dir/observed-usage.jsonl" \
  --result-out "$latest_dir/benchmark-run.json" \
  --format markdown; then
  status=$?
fi

if [ -d "$runs_root" ]; then
  find "$runs_root" -mindepth 1 -maxdepth 1 -type d | sort > "$after_file"
else
  : > "$after_file"
fi

new_run="$(comm -13 "$before_file" "$after_file" | tail -n 1 || true)"
if [ -n "$new_run" ] && [ -d "$new_run" ]; then
  mv "$new_run" "$runs_archive/"
fi

rmdir "$runs_root" 2>/dev/null || true
rmdir "$target_path/.plugin-eval" 2>/dev/null || true

if [ -f "$site_builder" ]; then
  python3 "$site_builder" \
    --combined \
    --out "$repo_root/tests/plugin-eval/site" \
    --benchmark-run "$latest_dir/benchmark-run.json" \
    --observed-usage "$latest_dir/observed-usage.jsonl"
fi

exit "$status"

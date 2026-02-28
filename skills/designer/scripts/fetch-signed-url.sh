#!/usr/bin/env bash
set -euo pipefail

url="${1:-}"
output="${2:-}"

if [[ -z "$url" || -z "$output" ]]; then
  echo "Usage: $0 <url> <output-path>" >&2
  exit 2
fi

echo "Fetching content from signed/expiring URL..."
curl -L -f -sS --connect-timeout 10 --compressed "$url" -o "$output"
echo "Saved to: $output"

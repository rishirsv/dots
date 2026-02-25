#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
REPO_ROOT="$(cd "$ROOT_DIR/.." && pwd -P)"

cd "$REPO_ROOT"

mkdir -p testing/data/sec testing/data/data_rooms
rm -rf testing/data/sec/AAPL testing/data/sec/SBUX testing/data/sec/CAT

python3 testing/scripts/fetch_sec_data.py \
  --ticker AAPL \
  --ticker SBUX \
  --ticker CAT \
  --recent-years 6 \
  --out-dir testing/data/sec

bash testing/scripts/generate_data_room_samples.sh

echo "Sample test data ready under testing/data/"

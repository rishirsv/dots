#!/usr/bin/env bash
set -euo pipefail

SIM_ROOT="/Users/rishi/Code/ai-tools/.agents/skills/data-room-simulator"
PY="$SIM_ROOT/.venv/bin/python"
OUT_ROOT="testing/data/data_rooms"

if [[ ! -x "$PY" ]]; then
  echo "Missing simulator venv python: $PY" >&2
  echo "Create it and install requirements first:" >&2
  echo "  python3 -m venv $SIM_ROOT/.venv" >&2
  echo "  $SIM_ROOT/.venv/bin/pip install -r $SIM_ROOT/requirements.txt" >&2
  exit 1
fi

mkdir -p "$OUT_ROOT"

"$PY" "$SIM_ROOT/scripts/run_data_room.py" \
  --industry saas \
  --size mid \
  --realism-mode realistic \
  --seed 101 \
  --start-period 2023-01 \
  --end-period 2025-12 \
  --run-id scenario02-saas-mid-realistic \
  --output-root "$OUT_ROOT"

"$PY" "$SIM_ROOT/scripts/run_data_room.py" \
  --industry manufacturing \
  --size mid \
  --realism-mode messy \
  --seed 202 \
  --start-period 2023-01 \
  --end-period 2025-12 \
  --run-id scenario03-manufacturing-mid-messy \
  --output-root "$OUT_ROOT"

"$PY" "$SIM_ROOT/scripts/run_data_room.py" \
  --industry retail \
  --size large \
  --realism-mode realistic \
  --seed 303 \
  --start-period 2023-01 \
  --end-period 2025-12 \
  --run-id scenario04-retail-large-realistic \
  --output-root "$OUT_ROOT"

echo "Generated sample data-room runs in: $OUT_ROOT"

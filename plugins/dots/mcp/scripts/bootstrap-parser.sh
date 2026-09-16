#!/bin/sh
# Owner-invoked dependency provisioning; capability execution never downloads software.
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
PYTHON=${PYTHON:-python3}
DEST=${1:-"$HOME/Library/Application Support/Portal/parser-venv"}
[ ! -e "$DEST" ] || { echo 'Choose a new venv path; existing environments are not overwritten.' >&2; exit 2; }
"$PYTHON" -m venv "$DEST"
"$DEST/bin/python3" -m pip install --requirement "$ROOT/deploy/parser-requirements.txt"
echo "Parser environment installed at $DEST"
echo 'Review installed licenses and record a hash-locked wheel set before release.'
echo 'Configure the absolute Python path with: portal configure python --path <venv>/bin/python3'

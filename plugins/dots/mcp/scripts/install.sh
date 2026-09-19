#!/bin/sh
set -eu

VERSION="${PORTAL_VERSION:-5.0.19}"
SOURCE="${PORTAL_RUNTIME_BUNDLE:-$(CDPATH= cd -- "$(dirname "$0")/.." && pwd -P)/dist/runtime}"
BIN_DIR="${PORTAL_BIN_DIR:-$HOME/.local/bin}"
LIB_DIR="${PORTAL_LIB_DIR:-$HOME/.local/lib/portal}"
TARGET="$LIB_DIR/$VERSION"
STAGE="$LIB_DIR/.stage-$VERSION-$$"
BACKUP="$LIB_DIR/.previous-$VERSION-$$"

if [ ! -x "$SOURCE/bin/portal" ] || [ ! -x "$SOURCE/runtime/bun" ]; then
  echo "Portal runtime bundle is missing. Run 'bun run build' first or set PORTAL_RUNTIME_BUNDLE." >&2
  exit 1
fi
if [ "$("$SOURCE/bin/portal" --version)" != "$VERSION" ]; then
  echo "Portal runtime bundle version does not match $VERSION" >&2
  exit 1
fi

mkdir -p "$LIB_DIR" "$BIN_DIR"
cp -R "$SOURCE" "$STAGE"
if [ -e "$TARGET" ]; then mv "$TARGET" "$BACKUP"; fi
if ! mv "$STAGE" "$TARGET"; then
  if [ -e "$BACKUP" ]; then mv "$BACKUP" "$TARGET"; fi
  exit 1
fi

ln -sfn "$TARGET/bin/portal" "$BIN_DIR/.portal.next"
mv -f "$BIN_DIR/.portal.next" "$BIN_DIR/portal"
if [ -e "$BACKUP" ]; then rm -r "$BACKUP"; fi

echo "Installed Portal $VERSION at $TARGET"
echo "Bundled runtime notices include Bun-1.4.0.md."
if [ "$#" -gt 0 ]; then
  "$TARGET/bin/portal" start "$@"
else
  echo "Next: portal start --tunnel-id ID --runtime-key-file /absolute/path/to/key"
fi

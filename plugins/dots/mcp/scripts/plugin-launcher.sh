#!/bin/sh
set -eu

launcher=${HOME:?HOME is required}/.local/bin/portal
if [ ! -x "$launcher" ]; then
  echo 'Portal is not installed. Follow mcp/README.md, then enable the Dots Portal MCP server.' >&2
  exit 127
fi

exec "$launcher" mcp --stdio

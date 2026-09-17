#!/bin/sh
set -eu
[ "$#" = 2 ] && [ "$2" = '--replace-portal-database' ] || { echo 'Usage: deploy/restore.sh /private/backup.dump --replace-portal-database' >&2; exit 2; }
[ -s "$1" ] || { echo 'Readable nonempty backup required' >&2; exit 2; }
cd "$(dirname "$0")/.."
docker compose --env-file deploy/.env -f deploy/compose.yml stop relay
# Restore only the dedicated Portal database, never an arbitrary connection URI.
docker compose --env-file deploy/.env -f deploy/compose.yml exec -T postgres pg_restore -U portal -d portal --clean --if-exists --single-transaction < "$1"
docker compose --env-file deploy/.env -f deploy/compose.yml start relay

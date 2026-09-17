#!/bin/sh
set -eu
umask 077
[ "$#" = 1 ] || { echo 'Usage: deploy/backup.sh /private/backup.dump' >&2; exit 2; }
[ ! -e "$1" ] || { echo 'Refusing to overwrite an existing backup' >&2; exit 2; }
cd "$(dirname "$0")/.."
docker compose --env-file deploy/.env -f deploy/compose.yml exec -T postgres pg_dump -U portal -d portal -Fc > "$1"
[ -s "$1" ] || { echo 'Backup is empty' >&2; exit 1; }
echo 'Backup written. It may contain private operation results; encrypt and restrict it.'

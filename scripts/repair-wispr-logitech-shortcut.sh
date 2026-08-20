#!/usr/bin/env zsh
set -euo pipefail

MODE=apply
LOGI_DB="$HOME/Library/Application Support/LogiOptionsPlus/settings.db"
LOGI_PLIST="/Library/LaunchAgents/com.logi.optionsplus.plist"
LOGI_AGENT="/Library/Application Support/Logitech.localized/LogiOptionsPlus/logioptionsplus_agent.app/Contents/MacOS/logioptionsplus_agent"
WISPR_CONFIG="$HOME/Library/Application Support/Wispr Flow/config.json"
WISPR_APP="$HOME/Applications/Wispr Flow.app"
TOP_SLOT="mx-master-4-2b042_c196"
MIDDLE_SLOT="mx-master-4-2b042_c82"
RIGHT_CONTROL_CODE=228
RIGHT_CONTROL_VIRTUAL_KEY="VK_RCONTROL"
WISPR_RIGHT_CONTROL_KEY_CODE=62
WISPR_LEFT_CONTROL_KEY_CODE=59

usage() {
  cat <<'EOF'
Usage: scripts/repair-wispr-logitech-shortcut.sh [--check|--dry-run]

Repairs and verifies the MX Master 4 and Wispr Flow hands-free shortcut:
  - MX Master 4 top button c196 -> Right Control
  - MX Master 4 wheel click c82 -> Middle Button
  - Wispr Flow key code 62 -> hands-free start/stop
  - Wispr Flow key code 59 -> unassigned

Apply is the default. --check reports drift with a nonzero exit status.
--dry-run describes required repairs without changing files or apps.
EOF
}

die() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

while (( $# )); do
  case "$1" in
    --check)
      [[ "$MODE" == "apply" ]] || die "--check and --dry-run are mutually exclusive"
      MODE=check
      ;;
    --dry-run)
      [[ "$MODE" == "apply" ]] || die "--check and --dry-run are mutually exclusive"
      MODE=dry-run
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      printf 'Unknown argument: %s\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

for command_name in jq sqlite3; do
  command -v "$command_name" >/dev/null || die "Missing required command: $command_name"
done

[[ -f "$LOGI_DB" ]] || die "Missing Logitech settings database: $LOGI_DB"
[[ -f "$WISPR_CONFIG" ]] || die "Missing Wispr Flow config: $WISPR_CONFIG"

valid_logi_rows=$(sqlite3 "$LOGI_DB" \
  'SELECT count(*) FROM data WHERE _id = 1 AND json_valid(file);')
[[ "$valid_logi_rows" == "1" ]] || \
  die "Expected valid Logitech JSON in data._id=1"
jq -e '.prefs.user.shortcuts | type == "object"' "$WISPR_CONFIG" >/dev/null || \
  die "Expected Wispr shortcuts at .prefs.user.shortcuts"

work_dir=$(mktemp -d "${TMPDIR:-/tmp}/dots-wispr-logitech.XXXXXX")
logi_current="$work_dir/logi-current.json"
logi_desired="$work_dir/logi-desired.json"
wispr_desired="$work_dir/wispr-desired.json"
logi_stopped=0
wispr_stopped=0
logi_ui_was_running=0
wispr_was_running=0
user_id=$(id -u)
logi_service="gui/$user_id/com.logi.cp-dev-mgr"

restart_logi() {
  (( logi_stopped )) || return 0
  if ! launchctl print "$logi_service" >/dev/null 2>&1; then
    launchctl load -w "$LOGI_PLIST"
  fi
  logi_stopped=0
  sleep 0.5
  if (( logi_ui_was_running )); then
    open "/Applications/logioptionsplus.app"
  fi
}

restart_wispr() {
  (( wispr_stopped )) || return 0
  wispr_stopped=0
  if (( wispr_was_running )); then
    open "$WISPR_APP"
    for attempt in {1..50}; do
      pgrep -f "^$WISPR_APP/Contents/MacOS/Wispr Flow$" >/dev/null && break
      sleep 0.1
    done
    sleep 1
  fi
}

cleanup() {
  restart_logi || true
  restart_wispr || true
  rm -f "$logi_current" "$logi_desired" "$wispr_desired"
  rmdir "$work_dir" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

sqlite3 "$LOGI_DB" 'SELECT file FROM data WHERE _id = 1;' > "$logi_current"

jq \
  --arg top_slot "$TOP_SLOT" \
  --arg middle_slot "$MIDDLE_SLOT" \
  --arg virtual_key "$RIGHT_CONTROL_VIRTUAL_KEY" \
  --argjson right_control_code "$RIGHT_CONTROL_CODE" \
  'walk(
    if type == "object" and .slotId? == $top_slot then
      .card.macro = {
        "actionName": "keyboard_none",
        "keystroke": {
          "code": $right_control_code,
          "displayCharacter": "^Ctrl",
          "virtualKeyId": $virtual_key
        },
        "type": "KEYSTROKE"
      }
    elif type == "object" and .slotId? == $middle_slot then
      .card.macro = {
        "actionName": "MB3",
        "mouse": {"action": "BUTTON", "hidUsage": 3},
        "type": "MOUSE"
      }
    else
      .
    end
  )' "$logi_current" > "$logi_desired"

top_slot_count=$(jq --arg slot "$TOP_SLOT" \
  '[.. | objects | select(.slotId? == $slot)] | length' "$logi_desired")
middle_slot_count=$(jq --arg slot "$MIDDLE_SLOT" \
  '[.. | objects | select(.slotId? == $slot)] | length' "$logi_desired")
(( top_slot_count > 0 )) || die "Logitech slot $TOP_SLOT was not found"
(( middle_slot_count > 0 )) || die "Logitech slot $MIDDLE_SLOT was not found"

jq \
  --arg right_key "$WISPR_RIGHT_CONTROL_KEY_CODE" \
  --arg left_key "$WISPR_LEFT_CONTROL_KEY_CODE" \
  '.prefs.user.shortcuts[$right_key] = "popo"
   | del(.prefs.user.shortcuts[$left_key])' \
  "$WISPR_CONFIG" > "$wispr_desired"

logi_drift=0
wispr_drift=0
jq -e \
  --arg top_slot "$TOP_SLOT" \
  --arg middle_slot "$MIDDLE_SLOT" \
  --arg virtual_key "$RIGHT_CONTROL_VIRTUAL_KEY" \
  --argjson right_control_code "$RIGHT_CONTROL_CODE" \
  '([.. | objects | select(.slotId? == $top_slot)] | length) > 0
   and ([.. | objects | select(.slotId? == $top_slot)
     | .card.macro.keystroke
     | select(.code == $right_control_code and .virtualKeyId == $virtual_key)] | length)
       == ([.. | objects | select(.slotId? == $top_slot)] | length)
   and ([.. | objects | select(.slotId? == $middle_slot)] | length) > 0
   and ([.. | objects | select(.slotId? == $middle_slot)
     | .card.macro.mouse
     | select(.action == "BUTTON" and .hidUsage == 3)] | length)
       == ([.. | objects | select(.slotId? == $middle_slot)] | length)' \
  "$logi_current" >/dev/null || logi_drift=1

jq -e \
  --arg right_key "$WISPR_RIGHT_CONTROL_KEY_CODE" \
  --arg left_key "$WISPR_LEFT_CONTROL_KEY_CODE" \
  '.prefs.user.shortcuts[$right_key] == "popo"
   and (.prefs.user.shortcuts | has($left_key) | not)' \
  "$WISPR_CONFIG" >/dev/null || wispr_drift=1

if [[ "$MODE" == "check" || "$MODE" == "dry-run" ]]; then
  if [[ "$MODE" == "dry-run" ]]; then
    (( logi_drift )) && printf 'Would repair Logitech c196/c82 assignments.\n'
    (( wispr_drift )) && printf 'Would repair Wispr Flow Right Control shortcut.\n'
  else
    (( logi_drift )) && printf 'Drift: Logitech c196/c82 assignments\n'
    (( wispr_drift )) && printf 'Drift: Wispr Flow Right Control shortcut\n'
  fi
  if (( logi_drift || wispr_drift )); then
    [[ "$MODE" == "dry-run" ]] && exit 0
    exit 1
  fi
  printf 'Current: Logitech c196 is Right Control, c82 is Middle Button, and Wispr uses key code 62.\n'
  exit 0
fi

if (( ! logi_drift && ! wispr_drift )); then
  printf 'Already current: Logitech c196 is Right Control, c82 is Middle Button, and Wispr uses key code 62.\n'
  exit 0
fi

backup_timestamp=$(date +%Y%m%d%H%M%S)

if (( logi_drift )); then
  logi_backup="$LOGI_DB.bak.$backup_timestamp"
  sqlite3 "$LOGI_DB" ".backup '$logi_backup'"

  pgrep -f '^/Applications/logioptionsplus.app/Contents/MacOS/logioptionsplus$' >/dev/null && \
    logi_ui_was_running=1
  pkill -f '^/Applications/logioptionsplus.app/Contents/MacOS/logioptionsplus$' 2>/dev/null || true
  launchctl bootout "$logi_service" 2>/dev/null || true
  pkill -f "^$LOGI_AGENT( --launchd)?$" 2>/dev/null || true
  for attempt in {1..50}; do
    pgrep -f "^$LOGI_AGENT( --launchd)?$" >/dev/null || break
    sleep 0.1
  done
  pgrep -f "^$LOGI_AGENT( --launchd)?$" >/dev/null && \
    die "Logitech agent did not exit cleanly"
  launchctl bootout "$logi_service" 2>/dev/null || true
  logi_stopped=1

  sqlite3 "$LOGI_DB" \
    "UPDATE data SET file = readfile('$logi_desired') WHERE _id = 1;"
  printf 'Repaired Logitech settings. Backup: %s\n' "$logi_backup"
fi

if (( wispr_drift )); then
  wispr_backup="$WISPR_CONFIG.bak.$backup_timestamp"
  cp -p "$WISPR_CONFIG" "$wispr_backup"

  pgrep -f "^$WISPR_APP/Contents/MacOS/Wispr Flow$" >/dev/null && \
    wispr_was_running=1
  pkill -f "^$WISPR_APP/Contents/" 2>/dev/null || true
  for attempt in {1..50}; do
    pgrep -f "^$WISPR_APP/Contents/" >/dev/null || break
    sleep 0.1
  done
  pgrep -f "^$WISPR_APP/Contents/" >/dev/null && \
    die "Wispr Flow did not exit cleanly"
  wispr_stopped=1

  cp "$wispr_desired" "$WISPR_CONFIG"
  printf 'Repaired Wispr Flow shortcut. Backup: %s\n' "$wispr_backup"
fi

restart_logi
restart_wispr

sqlite3 "$LOGI_DB" 'SELECT file FROM data WHERE _id = 1;' > "$logi_current"

jq -e \
  --arg top_slot "$TOP_SLOT" \
  --arg middle_slot "$MIDDLE_SLOT" \
  --arg virtual_key "$RIGHT_CONTROL_VIRTUAL_KEY" \
  --argjson right_control_code "$RIGHT_CONTROL_CODE" \
  '([.. | objects | select(.slotId? == $top_slot)] | length) > 0
   and ([.. | objects | select(.slotId? == $top_slot)
     | .card.macro.keystroke
     | select(.code == $right_control_code and .virtualKeyId == $virtual_key)] | length)
       == ([.. | objects | select(.slotId? == $top_slot)] | length)
   and ([.. | objects | select(.slotId? == $middle_slot)] | length) > 0
   and ([.. | objects | select(.slotId? == $middle_slot)
     | .card.macro.mouse
     | select(.action == "BUTTON" and .hidUsage == 3)] | length)
       == ([.. | objects | select(.slotId? == $middle_slot)] | length)' \
  "$logi_current" >/dev/null || die "Logitech verification failed after repair"

jq -e \
  --arg right_key "$WISPR_RIGHT_CONTROL_KEY_CODE" \
  --arg left_key "$WISPR_LEFT_CONTROL_KEY_CODE" \
  '.prefs.user.shortcuts[$right_key] == "popo"
   and (.prefs.user.shortcuts | has($left_key) | not)' \
  "$WISPR_CONFIG" >/dev/null || die "Wispr verification failed after repair"

printf 'Verified: Logitech c196 is Right Control, c82 is Middle Button, and Wispr uses key code 62.\n'

# Shared by plugin and config sync. Selection is local to each Codex profile.
codex_plugin_source() {
  local profile_home="$1" selection_file="$1/dots-plugin-source" selection=local
  [[ ! -f "$selection_file" ]] || selection="$(<"$selection_file")"
  case "$selection" in
    cloud) echo "$ROOT/configs/codex/plugins-cloud.toml" ;;
    local) echo "$ROOT/configs/codex/plugin-exclusions.toml" ;;
    *) echo "Invalid plugin source in $selection_file: $selection" >&2; return 2 ;;
  esac
}

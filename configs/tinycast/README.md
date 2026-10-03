# Tinycast workflows

Tinycast 0.11.3 supports these selected-text Quick Actions. This profile preserves
Prompt (Hyper+P), adds Improve (Hyper+I) with the Dots writing guide embedded, and
adds Explain (Hyper+E). Actions preview their results. Model routing and existing
permissions remain machine-local and are never copied by this profile.

Hyper+H opens History through a Karabiner alias to the existing Option+V binding.
Tinycast supports one binding per command, so this keeps both gestures available.
Requires an existing selected Karabiner profile and Tinycast History on Option+V.
The helper refuses known shortcut conflicts and merges unrelated actions/rules.

On another Mac, install Tinycast and Karabiner through their official channels,
configure your own model and existing permissions, and clone Dots. Then run:

```sh
scripts/sync-configs.sh --dry-run --all
python3 scripts/sync-tinycast-workflows.py
python3 scripts/sync-tinycast-workflows.py --apply
python3 scripts/sync-tinycast-workflows.py --status
```

The first helper invocation previews changes. Apply stops and restarts a running
Tinycast process and backs up local quick actions, preferences, and Karabiner
config under `~/Library/Application Support/com.tinycast.app/backups/dots-workflows-*`.
Do not run the older `sync-tinycast-config.py` for these workflows: that helper
also removes extensions and quicklinks according to its separate profile.

To restore, quit Tinycast, copy `quick-actions.json` and `karabiner.json` from the
chosen backup to their original paths, and import its `com.tinycast.app.plist`
with `defaults import com.tinycast.app <backup-path>/com.tinycast.app.plist`.
Restart Tinycast. Backups contain local preferences and must stay off Git.

Review (R), Web (W), and OCR (O) are reserved proposals, not installed bindings.
Image input, browser page capture, and an OCR command were not verified. Add them
only after a supported integration is established. Snippets are optional and
not configured here. Wispr Flow and dictation settings are untouched.

Quick Actions send selected text to the machine's configured model. Do not
assume that every provider keeps content local. No private content is used by
the helper, and the portable files exclude credentials, account settings,
clipboard history, quicklinks, caches, and installed-provider preferences.

Update Improve's embedded guide when the canonical
`plugins/dots/references/writing-style.md` changes.

# Tinycast workflows

This profile adds selected-text tools, local OCR, and the Air's portable
shortcuts to Tinycast. It preserves existing model routing, Wispr Flow settings,
and an existing Prompt action. The workflow schema was originally checked
against 0.11.3.

| Hyper key | Action | Input and result |
| --- | --- | --- |
| P | Prompt | Existing action and instructions, preserved |
| I | Improve | Selected writing; previews a rewrite using the Dots guide |
| E | Explain | Selected text, code, or error; previews an explanation |
| R | Review selected text | Interface copy/headings or a screen description; previews critique |
| W | Web selection | Selected page text; previews a summary, or answers an explicit question included with the selection |
| H | History | Opens native history; Option+V remains available |
| O | OCR image or area | Prompts for an image path; blank input chooses an area only when capture permission already exists |

R does not see screenshot pixels. W does not fetch the current tab automatically.
The names deliberately identify their supported selected-text modes. Full visual
Review needs an approved image-capable route: the existing OpenCode chat route is
text-only, while installed Codex can accept images. Automatic full-page Web input
needs a supported browser adapter/access; Tinycast v0.11.3 does not implement
`getFrontmostBrowserTab`, `BrowserExtension.getContent`, or extension `AI.ask`.
Those gaps are not replaced with nonfunctional commands or changed model routing.

OCR uses local macOS Vision, with the fast CPU path and English recognition.
Enter a local image path, including a `~/` path, to read an existing screenshot.
The output appears in Tinycast's command output window, where you can copy it.
It does not read clipboard history or send image contents to a model.
Blank input checks existing Screen Recording access without requesting it. If
access is absent, the command explains the permission requirement and exits.
Temporary area images are removed after success or a reported error.

Hyper+H uses a Karabiner alias to the existing Option+V binding because Tinycast
supports one binding per command. The helper merges unrelated actions and rules,
refuses known Tinycast shortcut conflicts, and preserves an existing Prompt
verbatim. It enables the approved Quick Actions and the owned OCR custom command.

The portable [shortcut profile](shortcuts.json) also binds Command+Space to
the launcher, Hyper+B to Chrome, Hyper+C to VS Code, Hyper+T to Ghostty,
Hyper+backtick to AI chat, Control+Shift+Space to emoji search, and Option+Left/Right
to half-screen window placement. Caps Lock becomes Hyper when held and Escape
when tapped, through a merged Karabiner rule. Hyper means Command+Control+Option+Shift.

## Apply on another Mac

Install Tinycast, Karabiner, and the shortcut target apps from their official
channels, configure the local model and permissions, and clone Dots. Complete
Karabiner's macOS permission prompts before testing Caps Lock. The helper can
initialize a fresh shortcut/selected-profile configuration; it stops on
conflicting existing shortcuts or unrelated Caps Lock rules. OCR compilation requires Apple's Swift
compiler, supplied by Xcode or Command Line Tools. No third-party OCR package is
installed by this profile.

```sh
scripts/sync-configs.sh --dry-run --all
python3 scripts/sync-tinycast-workflows.py
python3 scripts/sync-tinycast-workflows.py --apply
python3 scripts/sync-tinycast-workflows.py --status
```

The first helper invocation previews changes. Apply backs up local actions,
preferences, and Karabiner config under
`~/Library/Application Support/com.tinycast.app/backups/dots-workflows-*`, then
stops and restarts a running Tinycast process to reload the configuration. The
compiled OCR helper lives under `~/.local/share/dots/tinycast/` on each machine.

Do not run the older `sync-tinycast-config.py` for these workflows: that helper
also removes extensions and quicklinks according to its separate profile.

To restore, quit Tinycast, copy `quick-actions.json` and `karabiner.json` from the
chosen backup to their original paths, and import its `com.tinycast.app.plist`
with `defaults import com.tinycast.app <backup-path>/com.tinycast.app.plist`.
Restart Tinycast. Backups contain local preferences and must stay off Git.

## Validation and limits

Synthetic input returned responses from the existing on-device text model for
I/E/R/W. The OCR helper extracted the exact synthetic image text and reported an
invalid path correctly. The official v0.11.3 `CustomCommand` decoder accepted the
portable OCR command. Configuration status and repeat apply are checked locally.
These checks do not establish model accuracy or verify physical hotkey presses.

End-to-end hotkey and area-selection checks have not passed. Native UI calls
previously stalled; an isolated synthetic browser fixture was rejected because
the browser tool permits only HTTP(S), and that restriction was not bypassed.
Screen permission attribution differs between sandboxed and ordinary helper
processes; ordinary CLI preflight reports existing access, but the Tinycast
launch path has not been verified. A blank-input test did not return the
expected refusal code, so area capture is not claimed as tested.

Quick Actions use the machine's model configuration; providers may transmit
selected text. The portable files exclude credentials, account settings,
clipboard history, quicklinks, caches, and installed-provider preferences.
Snippets remain optional and unconfigured. Update Improve's embedded guide when
`plugins/dots/references/writing-style.md` changes.

Behavior and schema sources:
[Quick Actions](https://github.com/abue-ammar/tinycast/blob/v0.11.3/docs/features/quick-actions.md),
[custom commands](https://github.com/abue-ammar/tinycast/blob/v0.11.3/docs/features/custom-commands.md),
[command model](https://github.com/abue-ammar/tinycast/blob/v0.11.3/Tinycast/Features/CustomCommands/Model/CustomCommand.swift).

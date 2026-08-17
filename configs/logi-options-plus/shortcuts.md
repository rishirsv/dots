# Logi Options+ shortcuts

Snapshot captured on 2026-08-17 from Logi Options+ using its UI and local
`settings.db`. This documents the portable intent of the configuration; it is
not an importable Logi Options+ backup.

## Devices

- Mouse: MX Master 4 (`mx-master-4-2b042`)
- Keyboard: MX Mechanical Mini (`mx-mechanical-mini-2b367`)
- Application override: ChatGPT (`com.openai.codex`)

## MX Master 4 — global

| Control | Assignment |
| --- | --- |
| Middle button | Middle click |
| Back button | Back |
| Forward button | Forward |
| Thumb wheel | Horizontal scroll |
| Gesture button: click | Mission Control |
| Gesture button: hold + move up | Mission Control |
| Gesture button: hold + move down | App Exposé |
| Gesture button: hold + move left | `Cmd+Ctrl+Option+Shift+Left` |
| Gesture button: hold + move right | `Cmd+Ctrl+Option+Shift+Right` |
| Additional button `c195` | UI shows “Keyboard shortcut: None”; stored keystroke is `Escape` |
| Additional button `c196` | Keyboard shortcut: None |

## MX Master 4 — ChatGPT override

The ChatGPT profile inherits the global mouse profile except for:

| Control | Assignment |
| --- | --- |
| Back button (`c83`) | `V` (no modifiers) |

## MX Mechanical Mini — global

| Special key/action | Assignment |
| --- | --- |
| Search | `Cmd+Space` |
| Backlight down | Keyboard backlight down |
| Backlight up | Keyboard backlight up |
| Play/Pause | Play/Pause |
| Mute | Speaker mute |
| Volume down | Volume down |
| Volume up | Volume up |
| Dictation | Enable dictation |
| Emoji menu | `Ctrl+Cmd+Space` |
| Screen capture | Capture region to file |
| Home | Home |
| End | End |
| Page Up | Page Up |
| Page Down | Page Down |
| Microphone mute | Toggle microphone mute |

## Source of truth

- UI confirmation: Logi Options+ device and assignment screens.
- Exact stored chords and application inheritance:
  `~/Library/Application Support/LogiOptionsPlus/settings.db`, row `data._id=1`.
- Secrets, account state, device telemetry, and the raw database are deliberately
  excluded from this repository.

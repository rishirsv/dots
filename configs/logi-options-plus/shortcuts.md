# Wispr Flow and Logitech MX setup

Use this snapshot to reproduce Rishi's dictation, keyboard, and mouse behavior
on another Mac. The critical link is:

> The MX Master 4 top button sends **Right Control**, and **Right Control** is
> one of Wispr Flow's hands-free start/stop shortcuts.

Snapshot verified on 2026-08-20 against Wispr Flow 1.6.580, the Wispr shortcut
and settings UI, Logi Options+, and the local Logi Options+ settings database.
This is a manual restore reference, not an importable backup.

## Devices

- Mouse: MX Master 4 (`mx-master-4-2b042`)
- Keyboard: MX Mechanical Mini (`mx-mechanical-mini-2b367`)

Use the **Global settings** profile for both devices. There are no
application-specific Logitech profiles in this snapshot.

## Restore order

1. Install Wispr Flow and Logi Options+ and sign into the existing accounts.
2. Connect the MX Master 4 and MX Mechanical Mini.
3. Configure Wispr Flow shortcuts first, especially **Right Control** for
   hands-free dictation.
4. Configure the MX Master 4 top button to send **Right Control**.
5. Apply the remaining Logitech assignments and device settings below.
6. Apply the remaining Wispr Flow settings below.
7. Validate the end-to-end behavior with the checklist at the end.

## Wispr Flow shortcuts

Open **Settings > General > Shortcuts**.

| Action | Shortcut |
| --- | --- |
| Push to talk | Hold `fn` |
| Hands-free start/stop | Double-tap `fn` |
| Hands-free start/stop | `Right Command` |
| Hands-free start/stop | `Right Control` |
| Press Enter | Unassigned |
| Command Mode | `Right Control+,` |
| Paste last transcript | `Control+Command+V` |
| Copy last transcript | `Control+Command+C` |
| Open Scratchpad | Unassigned |
| Join meeting / start Notetaker | `Option+M` |
| View Transform changes | `Option+O` |
| Cancel dictation or notifications | `Escape` |
| Transform: Polish | `Option+1` |
| Transform: Prompt Engineer | `Option+2` |

The right-side modifier matters: the Logitech mouse must emit **Right
Control**, not generic or left Control.

## MX Master 4 assignments

Open the MX Master 4 in Logi Options+ and select **Global settings**.

| Control | Assignment |
| --- | --- |
| Middle button | Middle click |
| Back button | Back |
| Forward button | Forward |
| Top button (`c196`) | Keyboard shortcut: `Right Control` |
| Thumb wheel | Horizontal scroll |
| Gesture button: click | Mission Control |
| Gesture button: hold + move up | Mission Control |
| Gesture button: hold + move down | App Exposé |
| Gesture button: hold + move left | `Command+Control+Option+Shift+Left` |
| Gesture button: hold + move right | `Command+Control+Option+Shift+Right` |
| Additional button (`c195`) | Stored keystroke: `Escape`; the UI labels it “Keyboard shortcut: None” |

### Point, scroll, and press

| Setting | Value |
| --- | --- |
| Pointer speed | 3500 DPI |
| Scroll-wheel speed | 60% |
| Scroll direction | Standard |
| Scroll force | 60% |
| Smooth scrolling | On |
| SmartShift | Off |
| Thumb-wheel speed | 50% |
| Thumb-wheel direction | Default |
| Button press sensitivity | Medium |

### Haptic feedback

| Setting | Value |
| --- | --- |
| Feedback | On |
| Intensity | Medium |
| Battery saving mode | Off |

## MX Mechanical Mini assignments

Open the MX Mechanical Mini in Logi Options+ and select **Global settings**.

| Special key/action | Assignment |
| --- | --- |
| Search | `Command+Space` |
| Backlight down | Keyboard backlight down |
| Backlight up | Keyboard backlight up |
| Play/Pause | Play/Pause |
| Mute | Speaker mute |
| Volume down | Volume down |
| Volume up | Volume up |
| Dictation | Enable macOS dictation |
| Emoji menu | `Control+Command+Space` |
| Screen capture | Capture region to file |
| Home | Home |
| End | End |
| Page Up | Page Up |
| Page Down | Page Down |
| Microphone mute | Toggle microphone mute |

Additional keyboard settings:

- Backlighting: off.
- Stored backlight effect: Contrast.
- Backlight power saving: on.
- Keep keyboard in OS layout: on.
- Disabled keys: none.

## Wispr Flow preferences

### General

| Setting | Value |
| --- | --- |
| Microphone | Razer Seiren Mini (USB) |
| Dictation language | English |
| App language | English |

If the Razer microphone is not attached to the other Mac, select the intended
dictation microphone there and treat that as the only hardware-specific
substitution.

### System

| Setting | Value |
| --- | --- |
| Launch app at login | On |
| Show Flow Bar at all times | Off |
| Show app in Dock | Off |
| Dictation and notification sounds | On |
| Mute music while dictating | On |
| Setup/improvement suggestions | Off |
| New-feature announcements | Off |
| Word-count, streak, and referral milestones | Off |
| Scratchpad open behavior | Resume last note |
| Auto-add corrected words to dictionary | On |
| Email auto signature | Off |
| Creator mode | Off |

### Style and cleanup

| Context | Style |
| --- | --- |
| Personal messages | Casual — caps with less punctuation |
| Work messages | Casual — caps with less punctuation |
| Email | Formal — caps and punctuation |
| Other apps | Formal — caps and punctuation |
| Auto Cleanup | Medium — edit for clarity and conciseness |

### Transforms

- Transforms: on.
- View changes: `Option+O`.
- Polish: `Option+1`, built-in “Improve clarity and conciseness.”
- Prompt Engineer: `Option+2`, with this exact custom prompt template:

```text
**Title**
(1 concise line)

**Role & stance**
(who the model is and how it should behave)

**Task**
(what the model must do)

**Context**
(only what the model needs to know)

**Inputs available**
(explicit list)

**Output requirements**
(format, structure, tone, length — only if specified; otherwise placeholders)

**Constraints / Do-nots**
(bulleted)

**Examples / References**
(include all examples verbatim)

**Execution checklist**
(short, factual verification list)

**Conflict resolution**
(only if applicable)
```

### Notetaker

| Setting | Value |
| --- | --- |
| Scheduled-meeting notification | Right before the meeting |
| Automatically detect any call | On |
| Maximum recording length | 2 hours |
| Stop when a call ends | On |
| Hide Notepad and Flow Bar from screen capture | Off |
| Open Notepad when starting | On |
| Split screen when joining | Off |
| Show live transcript | On |
| Default notes sharing | Anyone with the link |

The Notetaker shortcut is `Option+M`.

### Vibe coding

| Setting | Value |
| --- | --- |
| Variable recognition for VS Code, Cursor, and Windsurf | Not set up |
| Automatic file tagging in Cursor and Windsurf | On |

### Experimental

| Setting | Value |
| --- | --- |
| Command Mode | Off |
| Spoken “press enter” command | Off |
| Bulk import | Off |

The Command Mode shortcut remains assigned even though the experimental
feature is off.

### Data and privacy

| Setting | Value |
| --- | --- |
| Use data to improve Wispr models | Off |
| Dictation cloud storage | On |
| Context awareness | On |
| Local transcript storage | Store data locally |
| HIPAA BAA | Not enabled |

### Connections

- Google Calendar and Slack connectors: `0/2` connected.
- Wispr MCP: not added to Claude or ChatGPT.

## Account-synced content

Wispr dictionary entries and snippets are account content, not local device
settings. After signing into the same Wispr account, confirm that the personal
dictionary, the “my email address” snippet, the “organize thoughts prompt”
snippet, and the two Transforms appear. Do not copy account identifiers,
transcripts, authentication data, or the raw Wispr configuration into this
public repository.

## Validation

Complete these checks on the destination Mac:

1. Hold `fn`, speak a short phrase, and release. The phrase is inserted.
2. Press `Right Control`, dictate, then press `Right Control` again. Hands-free
   dictation starts and stops.
3. Press the MX Master 4 top button twice with speech in between. It produces
   the same start/stop behavior as `Right Control`.
4. Start dictation and press `Escape`. Dictation is cancelled.
5. Verify `Control+Command+V` and `Control+Command+C` paste and copy the last
   transcript.
6. Verify the mouse gesture directions, keyboard special keys, and screenshot
   key against the tables above.
7. Dictate once in a personal messenger, email app, and another app. Confirm
   that the style and Medium Auto Cleanup match this snapshot.

## Local evidence

- Logi UI: device assignments, point/scroll/press settings, haptics, and
  keyboard backlighting.
- Logi stored configuration:
  `~/Library/Application Support/LogiOptionsPlus/settings.db`, JSON row
  `data._id=1` in column `file`.
- Wispr UI: Shortcuts, General, System, Notetaker, Vibe coding, Experimental,
  Data and Privacy, Style, Transforms, Dictionary, Snippets, Connectors, and
  MCP.
- Wispr stored shortcut cache:
  `~/Library/Application Support/Wispr Flow/config.json`.

Raw databases and configuration files are deliberately excluded because they
contain account state, telemetry, and other non-portable data.

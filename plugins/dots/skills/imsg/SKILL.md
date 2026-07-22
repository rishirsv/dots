---
name: imsg
description: "Reads the smallest relevant slice of the user's iMessage history for context, by person, conversation, time, or keywords. Use when another task needs context from Messages; not for sending, reacting, deleting, or otherwise changing messages."
---

# Read iMessage Context

Retrieve only the message history needed for the current task. Keep the work read-only: do not send, draft, react, delete, or change read state.

## Default path

1. Translate the parent task into the narrowest useful retrieval request: participant or group, optional keywords, a time window, and a result limit. If the identity is ambiguous, ask which conversation the user means before exposing unrelated results.
2. Run `scripts/imsg.swift` against the local Messages database. Start with metadata or a small limit and widen only when the first result cannot answer the parent task.
3. Read attachment contents only when they are material to the parent task. Listing attachment metadata does not authorize OCR, transcription, or document parsing.
4. Return a concise context summary. Distinguish exact message text from inference, include dates when chronology matters, and state any retrieval limitation.

The script prints JSON to standard output and diagnostics to standard error:

```bash
scripts/imsg.swift --participant "Alex" --since 2026-07-01 --limit 40
scripts/imsg.swift --participant "+14165551212" --search "dinner" --attachments --limit 20
scripts/imsg.swift --search "project codename" --since 2026-07-15 --scan-limit 3000
```

Use `--resolve-contacts` only when a stored Messages name is insufficient. It uses Contacts only when access is already authorized; it does not prompt for permission. Run `scripts/imsg.swift --help` for the full interface.

## Fallbacks

If database access fails because Messages data is protected, explain that the app running the agent needs Full Disk Access, then retry only after the user grants it.

If the schema or archived-body decoder is incompatible, use computer control to search the real Messages app and copy the smallest relevant conversation segment. Prefer accessibility text and clipboard copying; use screenshots or OCR only when text cannot be copied. Warn that opening a conversation can change read state and get consent before doing so.

If neither path works, ask the user to copy or export the relevant conversation. Do not substitute AppleScript, Shortcuts, Spotlight, notifications, or an iPhone backup as if they were complete history sources: they do not provide a dependable, supported message-history query path.

## Completion

Finish when the parent task has the minimum relevant context plus its provenance: conversation identity, timestamps or range, retrieval method, and known omissions. Do not persist message contents in a file unless the user requested an artifact.

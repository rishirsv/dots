# Sending Advisor Packages Through ChatGPT

Use this reference when the user explicitly approves ChatGPT or ChatGPT Pro as
the Advisor route and the package already exists as `prompt.md` plus
`context.zip`. This is a browser handoff route, not a package-building route.

Prefer Codex's in-app browser first. If it is unavailable or cannot operate the
target ChatGPT UI, use another available browser and state the fallback reason.

## Safety Gate

Before sending anything to ChatGPT:

- Confirm the user explicitly asked to send the package or approved this route.
- Confirm the target provider is ChatGPT or ChatGPT Pro.
- Inspect the package path and verify it contains `prompt.md` and `context.zip`.
- Treat `context.zip` as potentially private. Do not send secrets, credentials,
  `.env` files, private keys, or unapproved proprietary/customer material.
- Respect the Provider Routes approval rules in the main Advisor skill.

## Package Check

Run quick local checks before opening ChatGPT:

```bash
test -f "$PACKAGE_DIR/prompt.md" && test -f "$PACKAGE_DIR/context.zip"
du -sh "$PACKAGE_DIR/context.zip"
unzip -t "$PACKAGE_DIR/context.zip"
```

If the zip test fails, stop and rebuild the Advisor package before trying to
upload it. If `context.zip` is very large, warn the user that ChatGPT upload may
fail and be ready to fall back to a smaller Advisor package.

## Browser Handoff

1. Open `https://chatgpt.com/`.
2. Choose the intended project or chat if the user named one. Otherwise start a
   new chat.
3. Use the chat's add-files control to attach `context.zip`.
4. Do not rely on attaching `prompt.md` as a file. Open `prompt.md`, select all,
   copy its full contents, and paste the prompt text into the ChatGPT message
   field. Long pasted text may appear as a text attachment; that is acceptable
   if ChatGPT shows the pasted prompt in the draft.
5. Verify the draft has both the uploaded `context.zip` and the prompt content.
6. Submit the chat.

The demonstrated reliable macOS path was:

- Attach `context.zip` from the package folder.
- Preview or open `prompt.md`, select all, copy, and close the preview/open
  panel.
- Paste the prompt into ChatGPT.
- Submit once ChatGPT enables the send button.

## Verification

After submitting:

- Confirm ChatGPT started responding, or that the message appears in the chat.
- If upload fails, report the failure and the package size. Do not silently drop
  `context.zip`.
- If the prompt paste fails or is truncated, stop before sending and paste again.
- Tell the user where the package came from and which ChatGPT surface received
  it.

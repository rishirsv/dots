# ChatGPT Browser Assist

Use this when the user has approved a ChatGPT browser route and wants the
assist completed end to end.

## Goal

Send exactly two things to ChatGPT:

- `context.zip` as a file attachment
- `prompt.md` as visible text in the message composer

Do not send when the prompt exists only as an attached file.

## Algorithm

1. Build the Assist package on the Desktop.
2. Inspect `manifest.json` for selected files, skipped files, total size, and
   sensitive-looking paths.
3. Open ChatGPT in the browser route the user approved.
4. Confirm the requested model or mode is available enough for the task.
5. Attach `context.zip` first:
   - Prefer the visible `+` / "Add files and more" control.
   - Choose "Add photos & files" when ChatGPT exposes that menu item.
   - If the browser wrapper cannot drive the native picker, put the zip file
     itself on the OS clipboard and paste it into the composer.
6. Wait until a zip attachment is visible. ChatGPT may rename the file; a visible
   zip archive attachment is acceptable.
7. Paste `prompt.md`.
8. If ChatGPT turns the prompt paste into an attachment, click **Show in text
   field** for that prompt attachment.
9. Before sending, verify:
   - a zip archive attachment remains visible
   - the prompt text is visible in the message field
   - no prompt-only file attachment remains
   - no upload/progress/error state is active
   - the send button is enabled
10. Send the message.
11. Wait for the answer to finish. If ChatGPT only returns a planning preamble,
    send one follow-up asking it to proceed with the actual review.
12. Save the substantive answer as `answer.chatgpt.md` in the package folder
    when the route allows copying or export.
13. Report the package path, uploaded attachment, answer path, and verification
    boundary.

## Recovery Rules

- If `prompt.md` becomes an attachment, do not remove it first. Click **Show in
  text field**. Remove it only if that action is unavailable or fails.
- If `context.zip` does not appear after using the `+` menu, try the OS file
  clipboard paste route once.
- If the zip still cannot be attached, stop at package-ready and report the
  exact manual action needed.
- If ChatGPT is still responding, do not stop it just to send a follow-up. Wait,
  then send the follow-up when the composer is available.
- If any upload or send step would transmit broader context than the user
  approved, stop and ask for approval.

## Automation Options

Current best route:

- browser-controlled ChatGPT flow plus OS clipboard fallback for file paste

Possible future route:

- a provider command or stable browser upload API that accepts a package folder,
  attaches `context.zip`, inserts `prompt.md` as text, sends the request, and
  writes `answer.chatgpt.md`

Do not invent a standalone command until the available tools can reliably
control ChatGPT upload, text insertion, answer completion, and answer export.

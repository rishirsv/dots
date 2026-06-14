# ChatGPT Browser Assist

Use this when the user has approved a ChatGPT browser route and wants the
assist completed end to end.

## Goal

Send exactly two things to ChatGPT:

- `context.zip` as a file attachment
- `prompt.md` as visible text in the message composer

Do not send when the prompt exists only as an attached file.

## Operating Contract

This route borrows the visible-session posture from the Codex ChatGPT control
skill: operate only through user-visible ChatGPT UI, attach only approved files,
reuse an explicitly user-open thread when requested, and stop with a clear
blocker instead of retrying blindly.

Required state before sending:

- package ready: `prompt.md` and `context.zip` have been inspected
- browser ready: ChatGPT is open in the approved browser route and login/captcha
  do not block the task
- attachment ready: `context.zip` is visible as an uploaded archive attachment
- prompt ready: the package prompt is visible in the message field as text
- send ready: no upload/progress/error state is active and the send button is
  enabled

Common blockers:

- `login_required`: ChatGPT is not signed in
- `captcha`: user action is required before continuing
- `upload_permission`: the browser route cannot attach the approved zip
- `file_picker_unavailable`: native picker cannot be driven from the route
- `prompt_attachment_only`: `prompt.md` became an attachment and cannot be shown
  in the text field
- `selector_drift`: visible ChatGPT controls changed enough that the route is
  ambiguous
- `rate_limit`: ChatGPT cannot continue without waiting or user choice
- `response_not_finished`: the answer is still running
- `answer_capture_unavailable`: the answer completed but cannot be copied or
  exported safely

## Package Prep Algorithm

1. Build the Assist package on the Desktop.
2. Inspect `prompt.md`, the `context.zip` file list, and the package script
   output for selected files, skipped files, total size, and sensitive-looking
   paths.
3. Confirm the package includes only the context the user approved for ChatGPT.
4. If the selected files or skipped-file output show broader context than
   intended, rebuild the package or stop for user approval.
5. Keep the package folder path handy; all browser results should be reported
   against that package record.

## New Thread Algorithm

Use this when the user did not ask to continue a particular ChatGPT thread.

1. Open ChatGPT in the browser route the user approved.
2. Confirm the requested model or mode is available enough for the task.
3. Start from a fresh composer or new chat when possible so the assist answer is
   not contaminated by unrelated conversation state.
4. Attach `context.zip` first:
   - Prefer the visible `+` / "Add files and more" control.
   - Choose "Add photos & files" when ChatGPT exposes that menu item.
   - If the browser wrapper cannot drive the native picker, put the zip file
     itself on the OS clipboard and paste it into the composer.
5. Wait until a zip attachment is visible. ChatGPT may rename the file; a visible
   zip archive attachment is acceptable.
6. Paste `prompt.md`.
7. If ChatGPT turns the prompt paste into an attachment, click **Show in text
   field** for that prompt attachment.
8. Before sending, verify:
   - a zip archive attachment remains visible
   - the prompt text is visible in the message field
   - no prompt-only file attachment remains
   - no upload/progress/error state is active
   - the send button is enabled
9. Send the message.
10. Wait for the answer to finish.
11. Capture the answer with the Response Capture Algorithm.

## Existing Thread Algorithm

Use this only when the user asks to continue or reuse an already-open ChatGPT
thread.

1. Reuse the visible user-open thread or exact ChatGPT conversation URL the user
   identified. Do not replace it with a new thread unless the user approves.
2. Read enough visible thread state to ensure the continuation target is the
   intended conversation.
3. If the thread cannot be identified, stop with `selector_drift` or a plain
   missing-thread blocker and ask the user to identify the tab or URL.
4. Attach `context.zip` and paste `prompt.md` using the New Thread Algorithm's
   attachment and prompt-ready steps.
5. Before sending, verify the prompt text makes the continuation explicit, for
   example "Continue from the current thread context, using this attached Assist
   package as the new task context."
6. Send only after the zip attachment and visible prompt text are both present.
7. Capture the answer with the Response Capture Algorithm.

## Files-First Assist Algorithm

Use this as the default for package-backed Assist requests. It mirrors the
helpful `askWithFiles` shape from the Codex ChatGPT control skill, adapted to
manual browser control.

1. Treat `context.zip` as the only file attachment unless the user explicitly
   approves additional files.
2. Attach files before inserting the prompt. This reduces the chance that
   ChatGPT sends or transforms the prompt before the archive is ready.
3. Keep `prompt.md` visible as text. Attached files are context, not
   instructions; the visible message is the instruction boundary.
4. Use Markdown answer capture by default because Assist answers are intended
   to become readable local artifacts.
5. If ChatGPT returns only a planning preamble, wait until the composer is
   available, then send one concise follow-up: "Please proceed with the actual
   advisory answer requested above."

## Response Capture Algorithm

1. Wait until ChatGPT has stopped responding and the composer is available.
2. Prefer copying or exporting the substantive assistant answer as Markdown or
   readable plain text.
3. Save the answer as `answer.chatgpt.md` in the package folder when the route
   supports safe copy/export.
4. If multiple assistant messages were produced for the task, save the
   substantive final answer, not transient status text.
5. If answer capture is unavailable, report `answer_capture_unavailable` with
   the package path and enough detail for the user to copy the answer manually.
6. In the final report, include the package path, uploaded attachment, answer
   path if saved, and the local verification boundary.

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
- If login, captcha, permission, rate-limit, selector drift, or ambiguous
  confirmation blocks the task, report the blocker and do not retry blindly.

## Automation Options

Current best route:

- browser-controlled ChatGPT flow plus OS clipboard fallback for file paste

Possible future route:

- a provider command or stable browser upload API that accepts a package folder,
  attaches `context.zip`, inserts `prompt.md` as text, sends the request, and
  writes `answer.chatgpt.md`

Do not invent a standalone command until the available tools can reliably
control ChatGPT upload, text insertion, answer completion, and answer export.

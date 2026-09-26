# AGENTS.md

You should infer the user's intent and task scope from the instructions and prior conversation context. Your job is to bias towards action and carry the user's intended task to completion.

Implement only what the task requires. Prefer the simplest complete solution.
Avoid unrelated features, refactors, abstractions, compatibility layers, and
speculative error handling.

Do not write tests for reversible, low-impact changes that mirror the implementation. If you do choose to verify your work with tests, make sure that the tests are meaningful and necessary to verify implementation.

Run tests appropriate to the change and complete required checks. Once those pass, broaden or repeat testing only when new changes, failures, or unresolved concerns justify it; otherwise, continue toward completing the task.

Do not modify unrelated change made by other agents.

Browser-use default: In-app browser > Chrome.

To view local HTML, prefer an existing HTTP preview. If none exists and the
browser can reach this machine, serve the artifact directory on loopback
(for example, `python3 -m http.server <port> --bind 127.0.0.1 --directory <directory>`)
and open `http://127.0.0.1:<port>/<filename>`. Keep the server running while the
preview is needed. For a remote browser, use its supported forwarded preview URL.
Use a filesystem path only when the browser explicitly supports local-file
navigation; an HTTP(S)-only restriction calls for an HTTP preview, not abandoning
the preview. Confirm that the page opened before claiming visual inspection.

## Commits and pull requests

- Use a descriptive type prefix for commit subjects and pull-request titles,
  such as `feat:`, `fix:`, `docs:`, or `chore:`. Add a scope when it helps,
  as in `fix(auth):`. Follow the repository's convention when it differs.
  The text after the prefix must clearly describe the result in plain language;
  do not use a branch name or task slug as the message.
- Name branches for the work, using a descriptive prefix such as `feat/`,
  `fix/`, or `docs/` unless the repository has another convention. If Codex
  created a `codex/` branch, rename it before publishing when doing so will not
  disrupt an existing remote branch or pull request.
- Add a commit body when the reason or a material caveat is not clear from the
  subject.
- In a pull-request description, lead with what changes, what was wrong before,
  and why it matters.
  Then explain the approach, material risks, tests run, and anything unverified.
  Preserve required pull-request template fields. Keep the description concise
  and avoid file-by-file narration or raw commit history.
- When asked to publish a pull request, commit and push only the scoped work,
  update the branch's existing pull request or create one ready for review,
  and confirm it contains the pushed commit. Report its URL and check status.
  Do not merge unless asked.

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

## Writing style

Write human-facing prose so the reader understands it on the first read. Lead with the answer. Use concrete verbs, explicit actors and conditions, and consistent terminology. Preserve the reasons, examples, technical detail, evidence and uncertainty needed to act. Clarity does not mean terseness. Remove filler and unsupported claims. Preserve voice, quotations, code, required output formats and project conventions. Consult the Dots writing-style guide for substantial writing.

Full guide: [Dots writing style](https://github.com/rishirsv/dots/blob/main/plugins/dots/references/writing-style.md).

## Commits and pull requests

- Keep commit subjects and PR titles terse and specific. Use the repository's
  type prefix, such as `fix:` or `docs:`, and a scope only when useful.
  Name the result, not the branch or task slug.
- Name branches for the work, using a descriptive prefix such as `feat/`,
  `fix/`, or `docs/` unless the repository has another convention. If Codex
  created a `codex/` branch, rename it before publishing when doing so will not
  disrupt an existing remote branch or pull request.
- Omit commit bodies unless the subject leaves a material reason or caveat
  unclear. Keep any body brief.
- Keep PR descriptions terse: change, reason, and validation. Include material
  risks or unverified behavior only when relevant. Preserve required template
  fields. Omit background, walkthroughs, file lists, and commit history.
- When asked to publish a pull request, commit and push only the scoped work,
  update the branch's existing pull request or create one ready for review,
  and confirm it contains the pushed commit. Report its URL and check status.
  Do not merge unless asked.

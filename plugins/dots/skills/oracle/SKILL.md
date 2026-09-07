---
name: oracle
description: "Use when the user selects Oracle to ask ChatGPT a question, request a review, or authorize implementation with live repository access. Not for ordinary local work without a consultation request."
---

# Oracle

Ask ChatGPT, retrieve the answer, and verify claims that affect the user's next
decision. Honor a named provider or model; otherwise use ChatGPT web in the
in-app browser with its current settings.

## Keep the prompt small

Send the question, essential context, and desired result. Aim for a short
paragraph; add detail only when it changes the answer. Do not paste this skill,
tool schemas, generic safety lists, or the whole workflow into the prompt.
Follow-ups carry only the new question or changed context and renewed MCP scope.

Ask for a concise answer in plain language, leading with the result. Use a table
only for a comparison. Make routine assumptions and proceed within the user's
scope; ask only when missing information changes the outcome. User instructions
override this skill. For coding, request checks proportional to the change and
stop after relevant checks pass unless a failure needs investigation.

These choices apply [OpenAI's Astra guidance](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)
on explicit writing preferences, instruction conflicts, follow-through, and
proportionate verification. They do not select or switch the user's model.

Example: “Find Toronto events for September 11–13, 2026. Give your best picks
with times, prices, and official links. Keep it concise.”

## Connect the right context

General questions use ChatGPT search; leave the repository bridge off.
For live repository review or authorized edits, read
[live-repository.md](references/live-repository.md). Keep reviews advisory
unless edits are requested. The app is included in Dots; the bridge requires
the existing local Oracle Repo MCP installation.

For Pro or desktop requests, use
[chatgpt-desktop.md](references/chatgpt-desktop.md).
For a requested file handoff, use [oracle_package.py](scripts/oracle_package.py)
with `--prompt-file`, optional `--file`, and `--dry-run` before packaging.
Read [context-development.md](references/context-development.md) only when
choosing the necessary evidence is difficult.

## Complete the consultation

Name the destination and content before sending; existing authorization carries
forward. Preserve drafts, reuse the matching conversation, and verify one
submission before waiting. For live repository work, publish browser observations
and consume bridge events using the linked workflow; quiescence alone never
proves the answer finished. Read the finished answer and return its link plus
the useful result. Report pending answers or tool blocks accurately.

For repository work, pause and confirm ready/Codex control before local writes
or checks that write. Verify actual changes and keep the task-owned connection
warm for follow-ups; stop it when the task finishes or is cancelled.

---
name: portal
description: Use ChatGPT Web reasoning with a Codex task's local tools through Portal. Use for Portal setup, prompting, tool orchestration, same-chat follow-ups, and troubleshooting.
---

# Portal

Run the user's task through Portal and verify the requested result. Portal is
the ChatGPT Web model transport for a normal Codex task: Codex owns the task,
files, tool execution, and approvals; the signed-in ChatGPT page supplies the
model response. Dots supplies this skill. Loading it does not switch the model,
start the runtime, or create a tool connection.

## Start from the actual session

Establish whether this is a task already using a `chatgpt-web/...` model, a
request to start using Portal, or a broken setup. Read the current model and
available tools rather than inferring readiness from a plugin's installation.

For a configured session, choose **Portal — Medium** unless the user selects
another available mode. Keep an existing explicit selection. **Portal — Pro**
is an opt-in reasoning mode, not a synonym for having a ChatGPT Pro subscription.
The named Portal model row controls the browser effort; the separate Codex
reasoning control does not override a fixed route. A skill cannot switch an
already-running task's model by saying it has done so.

When the user requests a particular model generation, verify the runtime-owned
ChatGPT picker and report its actual label. A route name, internal backend ID,
subscription badge, or model self-identification is not that evidence. Keep
browser selection and any independently available response model ID separate;
report an unavailable or mismatched model rather than silently substituting.

For initial setup, missing model rows, login, or a failed connection, read
[runtime.md](references/runtime.md). For an ordinary working session, proceed
with the task rather than rerunning setup. Prefer Codex's in-app Browser for
task browsing; leave the runtime-owned ChatGPT page under Portal's control.

## Give ChatGPT a useful job

Use the user's request as the authority. Preserve the distinction between
explaining, diagnosing, proposing, implementing, and publishing. A review
request should not become a repair; an implementation request should not end
with an offer to implement.

A good Portal brief names the result, relevant files or supplied material,
decisions already made, allowed changes, and the check that will establish
completion. Include observations as observations and suspected causes as
hypotheses. Let ChatGPT inspect the workspace through tools instead of pasting
an entire repository or inventing its contents.

Read [prompting.md](references/prompting.md) when composing a substantial brief,
using Pro for a difficult decision, or correcting an unproductive response.
It adapts Dots' meta-prompt method and links OpenAI's Astra guidance; it does
not assume Portal's selected Web mode is Astra or expose API-only controls.

Example first prompt:

> Use Portal at Medium to fix the retry failure in the current checkout.
> Reproduce the reported failure before choosing a cause. Keep the endpoint
> and successful path unchanged. Implement the smallest complete fix and run
> the relevant regression check. Continue through verification; return the
> changed files, observed result, and any remaining blocker. Do not publish.

Do not invent a `portal_send`, `portal_chat`, or `portal_tools` command. The
user sends prompts in the normal Codex conversation; Portal transports them.
ChatGPT's MCP calls are the return path to that task's local tools.

## Execute through the right tool surface

If operating in Codex with native tools, use those tools normally. If operating
as the ChatGPT backend with Portal's attached MCP tools, read
[tools.md](references/tools.md) before the first local action. Its table and
examples cover inventory, exact tool calls, command sessions, patches, images,
deferred discovery, and subagents.

The full-mode MCP contract exposes `codex_tool_inventory`, `codex_tool_call`,
`codex_exec`, `codex_write_stdin`, `codex_apply_patch`, and `codex_view_image`.
Use the current turn capability supplied by the runtime and the exact returned
schemas. A connector in a standalone ChatGPT chat without an active Codex turn
does not provide an unrestricted local terminal. Never manufacture or carry a
capability token into a later turn.

Treat an error or denial as an unsuccessful action. Inspect the returned error
and the layer that emitted it before changing the prompt or setup. Do not try
another facade to evade a denied operation. Successful inventory is evidence
of discovery, not proof that a command ran.

## Orchestrate work, then continue the conversation

Keep the main task responsible for the requested outcome. Gather the evidence
needed for the next decision, perform the authorized change, consume its tool
result, and verify the affected behavior. Batch independent reads when the
advertised tool surface supports it; keep dependent writes and their checks in
order. Avoid repeated full inventories and serial one-line browser prompts.

Delegate only independent work that saves time or improves the result. Give
each subagent a bounded question or disjoint write scope, relevant context, and
an expected return. Use the current harness's discovered collaboration tools,
retain the returned agent IDs, and integrate their results. Keep the immediate
blocking step local. Portal's MCP transport has a specific bounded agent-wait
contract documented in [tools.md](references/tools.md); a timeout is not success.

Send the next user request in the **same Codex task**, with only the new
instruction and any changed evidence. For example:

> Now check whether the fix also handles cancellation. Keep the previous
> endpoint decision; add a regression check only if this reveals a new gap.

Keep the browser host running. Portal can retain the ChatGPT page for subsequent
turns; model-family changes, retention expiry, host restart, or compaction can
rebuild a chat from Codex history. When exact chat continuity matters, check the
retained tab identity rather than treating a remembered answer as proof.

## Finish with proof

Complete the authorized task, its required checks, and any repairs those checks
show are necessary. Return the useful artifact or answer with the checks that
actually ran. State a concrete missing prerequisite when blocked.

For a Portal end-to-end test, preserve the user's explicit test mode; select
Medium only when none was specified. Use a disposable workspace:
read a canary unknown to the prompt, write and verify a result through native
tools, then send a follow-up in the same Codex task and confirm exact browser
tab reuse. Read the live-check procedure in [runtime.md](references/runtime.md).
Report structural skill validation, local transport tests, and live ChatGPT
execution separately. A fluent answer, healthy tunnel, or zero process exit
status alone is not an end-to-end pass.

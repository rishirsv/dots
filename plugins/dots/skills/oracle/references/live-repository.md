# Consult with a live repository

Use this route when the user wants a ChatGPT consultation to inspect or edit
the current local Git checkout through the Oracle Repo app. The app supplies
the MCP tools; this reference manages the local bridge and repository access.
Keep the consultation advisory unless the user explicitly authorizes the
advisor to implement. In implementation mode, put the authorized edit scope in
the prompt.

## Prepare the task-scoped connection

1. Resolve the intended checkout and record its HEAD plus a short
   staged/unstaged/untracked summary with read-only Git commands. Finish local
   writes before granting the consultation access.
2. From this skill directory, run:

   ```bash
   node scripts/repo_bridge.mjs start \
     --repo /absolute/path/to/checkout \
     --task-id <originating-codex-task-id>
   ```

   Retain the receipt's `task_id`, `instance_id`, canonical `root`,
   `ownership`, and positive `access_epoch`. A new server returns `ownership:
   started`; an existing same-task instance returns `ownership: resumed` and
   preserves its current control state. Wait for `phase: ready`. If the
   retained instance has `control: codex`, explicitly resume it before the next
   handoff; do not wait for start to change control. Capture stdout even on a
   nonzero exit: a failed start can still provide its cleanup receipt. Do not adopt an instance owned by a
   different task or repository. A setup, ownership, or tunnel error means live
   access is unavailable; report the concrete failure without claiming a
   completed consultation.
3. Attach the **Oracle Repo** app to the intended ChatGPT conversation. Verify
   the conversation and app before sending the prompt. The app's tools become
   available in that conversation; the local bridge command itself does not
   submit the consultation. Retain the conversation link with
   `node scripts/repo_bridge.mjs remember --instance-id <id> --task-id <task>
   --conversation-url <https-chatgpt-conversation-url>` so a later turn can find
   the same conversation through status.
4. Include the exact repository root, HEAD and dirty-state summary, instance
   ID, and current access epoch in the standalone Oracle prompt. Retain the
   task ID locally for lifecycle commands. Add the question, useful file or
   symbol pointers, and whether the advisor may only advise or may edit within
   an explicitly authorized scope.

Use a compact handoff. Replace the placeholders and omit irrelevant context:

> <Question and desired result.> Mode: <review only / authorized edit scope>.
> Root: <root>; instance_id: <id>; access_epoch: <epoch>.
> Check repo_status, then use this scope for MCP calls. Preserve unrelated work;
> leave Git staging and publishing to me. Use observed hashes for patches,
> fresh action IDs, and acknowledge consumed replies. Report the result,
> relevant checks, and any running commands briefly.

Add HEAD, dirty-state details, or file pointers only when they matter to the
question. Tool schemas already describe arguments; do not repeat their catalog
in the prompt. Keep task ownership and local lifecycle instructions here on the
Codex side. After resume, send the new epoch and changed context, not the entire
handoff again. Stale scope requires a renewed owner handoff, never silent adoption.

A ready bridge receipt proves local server and tunnel readiness. The first
successful `repo_status` response in ChatGPT proves that the consultation
reached the checkout. Do not use a local-only connection for a ChatGPT
consultation.

## Recover stale ChatGPT tool definitions

After a runtime update changes tool schemas, a ready tunnel does not refresh
ChatGPT's cached definitions. If the app lacks `access_epoch`, per-path ranges,
or `repo_acknowledge`, open the existing Oracle Repo MCP app's settings and use
**Refresh** while the bridge is ready. Verify the displayed schemas. If the
existing conversation still exposes old tools after rediscovery, start a fresh
conversation through the app's **Try in chat**, attach the same app, and send
the current handoff. Update the locally remembered conversation URL. Do not
remove epoch fencing or retry effects through obsolete schemas. Ordinary
follow-ups with unchanged schemas should reuse the same conversation.

## Use the MCP tools

`repo_status` is the connection check and accepts an optional instance ID:

```json
{"instance_id":"run_..."}
```

Every other tool call must carry the exact current scope:

```json
{"instance_id":"run_...","access_epoch":1}
```

Use `repo_read` for numbered file ranges and directory listings, `repo_search`
for bounded text or filename search, `repo_diff` for Git changes, and
`repo_history` for commit history. Batch related paths in one read, continue a
byte-limited result from its `next_line`, and reuse a search cursor only for the
next page of that search snapshot. A `paths` entry can be a string or
`{"path":"src/file.ts","start_line":10,"end_line":40}`. `repo_search` accepts
one `query` or up to four `queries` objects, each with its own filters and up to
50 matches. Up to eight search snapshots share 16 MiB for ten minutes; handoff
invalidates live snapshots. Use `view_image` for repository images.

`exec_command` runs a command in the checkout with normal user and network
access. Keep commands in their managed process groups; do not launch detached
daemons or launchd jobs. Pause can only prove quiescence of owned process groups. If it returns a session ID, use `write_stdin` to poll or provide input,
and `cancel_command` to stop that managed process. Each effect requires a
unique `request_id`, for example:

```json
{
  "instance_id": "run_...",
  "access_epoch": 1,
  "request_id": "inspect-tests-1",
  "cmd": "npm test",
  "yield_time_ms": 30000
}
```

Reuse that request ID only if the response was lost and the same action must be
recovered. After an authorized resume, refresh only the access epoch; identical
action arguments still recover the saved reply within the same instance. A new
poll or action gets a new ID. A crashed/replaced instance has lost its receipts:
inspect what happened instead of blindly replaying uncertain actions.

`apply_patch` accepts the native `*** Begin Patch` grammar in its `patch`
string. Its `expected` map must account for every target with either the
complete-file SHA-256 returned by a prior read or `{ "kind": "absent" }` for a
new path. This prevents a delayed patch from overwriting a newer file.

After an effect reply is safely consumed, release its retained payload with
`repo_acknowledge`:

```json
{
  "instance_id": "run_...",
  "access_epoch": 1,
  "requests": [
    {"tool":"exec_command","request_id":"inspect-tests-1"}
  ]
}
```

Acknowledged request IDs are retired and return `RECEIPT_RETIRED` rather than
executing again. `repo_status` reports receipt-ledger capacity when retained
payloads need attention.

## Gate local and remote writers

Keep the bridge warm while the consultation is active, including across Codex
answers. Before resuming local edits, pause the consultation with the retained
scope:

```bash
node scripts/repo_bridge.mjs pause \
  --instance-id <instance-id> \
  --task-id <originating-codex-task-id> \
  --access-epoch <current-access-epoch>
```

Pause changes control to `pausing` immediately. It rejects new remote
filesystem and shell work while continuing to accept empty `write_stdin` polls
and `cancel_command` calls with the current epoch so active commands can drain.
The CLI waits for real active effects and managed processes for a bounded time
and does not silently kill background commands. If it returns `control:
pausing`, use the reported blockers to wait or ask ChatGPT to cancel them. Only
a `phase: ready`, `control: codex` receipt makes the checkout safe for local
writing.

When the same consultation needs live access again, resume it:

```bash
node scripts/repo_bridge.mjs resume \
  --instance-id <instance-id> \
  --task-id <originating-codex-task-id> \
  --access-epoch <current-access-epoch>
```

Resume changes `control` from `codex` to `oracle`, atomically increments the
access epoch, and returns the new value. Replace the old epoch in the next
ChatGPT prompt or follow-up; delayed calls carrying an earlier epoch must
remain invalid. Confirm the resumed connection with `repo_status` before
allowing more remote work.

Use `status --task-id <originating-codex-task-id>` to verify ownership and
inspect the retained instance. Its receipt reports `task_id`, `instance_id`,
`root`, `phase`, `control`, `access_epoch`, and any current blockers. Do not
infer ownership from a PID or delete local state to force control.

## Finish or retain the consultation

After the answer is retrieved, inspect the resulting diff and verify material
claims before adopting them. Confirm `control: codex` before local edits or
verification commands that may write files. If another answer or follow-up is expected, pause
the instance and retain its receipt rather than stopping it.

An individual answer is a checkpoint, not task completion. Stop the exact
task-owned instance when the user finishes or cancels the task. Stop ends managed commands rather than waiting for them to
finish:

```bash
node scripts/repo_bridge.mjs stop \
  --instance-id <instance-id> \
  --task-id <originating-codex-task-id>
```

Require a stopped receipt before reporting cleanup complete. If shutdown is
still draining work, inspect status and wait; do not begin another writer. The
stop operation ends managed commands and the bridge but does not revert edits.
Report whether ChatGPT answered, what changed, what was verified, and whether
the instance is paused, retained, or stopped.


Use `timings.ready_ms` and `ready_wait_ms` to distinguish cold startup from
warm reuse. `timings.tools` measures tool work, admission-queue wait, and reply
bytes; tool work includes any internal command/patch waiting. These figures do
not measure ChatGPT reasoning or browser latency. Reuse the same conversation,
send changed context on follow-ups, and verify each prompt was submitted once.

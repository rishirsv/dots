# Dots Advisor

ChatGPT does the reasoning; a temporary local service gives it repository,
file, and terminal access through Codex App Server. No second model runs locally.

## One-time setup

Requires Node.js 22+, Codex CLI with App Server, and OpenAI's tunnel client:

```sh
brew install openai/tools/tunnel-client
cd plugins/dots/mcp
npm ci
node advisor.js configure --tunnel-id tunnel_YOUR_ID --key-ref file:/absolute/path/to/runtime-key
```

Create the tunnel in [OpenAI tunnel settings](https://platform.openai.com/settings/organization/tunnels),
associate it with your ChatGPT workspace, and supply a runtime key with tunnel
access. Store the key outside the repository. `--key-ref` accepts a file path or
`env:VARIABLE`; configuration stores the reference, never the key.

Start a consultation, then register **Dots Advisor** in ChatGPT Plugins using
**Tunnel**, that same tunnel ID, and **No Auth** for the MCP endpoint. Refresh
its tools after updating this server. Save its ChatGPT page URL with:

```sh
node advisor.js configure --app-url https://chatgpt.com/plugins/YOUR_PLUGIN
```

The tunnel identity survives shutdown and restart; registration is one-time.

## Consult from Codex

Write the advisor's brief to a file, including the user's constraints, relevant
context, initial assessment, and what to inspect or change. Then run:

```sh
node advisor.js start --repo /absolute/repository --brief /absolute/brief.md
node advisor.js status
node advisor.js wait --timeout 60
node advisor.js result
```

`start` returns the consultation ID, generated prompt path, and result path.
It waits for both Codex and the tunnel to be ready before returning. Use
`--access read-only` for a read-only review; the default is `workspace-write`.
File helpers stay in the selected repository; commands use Codex's sandbox,
which can read beyond that repository and has network access enabled.

Set up the chat using the controls below, then send the generated prompt. ChatGPT
reads the brief with `consultation` and saves its full response with `finish`.
Read the saved advice and inspect the repository diff before continuing locally.
Browser actions use the host's computer-use tools; there is no separate browser
automation library or unofficial ChatGPT API in this package.

`wait` is bounded and may return an active status: repeat it until complete,
stopped, or interrupted. `result` prints the durable final advice. Explicit IDs
work for `status`, `wait`, `result`, and `stop`; omission means the latest run.
For a follow-up, start a new consultation with the previous advice in the brief
and send its new prompt in the same ChatGPT chat.

## ChatGPT controls

Default to **6 Pro**, unless the user chooses another model. Open the chat's
model picker, find the requested model (expand additional models if needed),
select it, and verify the selected label before sending. If it is unavailable,
report that instead of silently substituting. Honor the user's effort choice;
otherwise use medium only when the selected model offers that setting.

Attach **Dots Advisor** through the chat's tools/plugins picker and verify it
is selected. Recheck the attachment after changing models or creating a chat.
Use current visible controls rather than saved coordinates or assumed labels.

In Codex desktop, prefer `list_threads` and `read_thread` for finding and reading
ChatGPT chats, and `send_message_to_thread` for continuing a configured chat.
Keep its ID for follow-ups. Native sending has been verified with a standalone
question. `read_thread` can return stale history even after the answer is saved:
reload the same chat in the browser to verify delivery before retrying a send.
Questions requiring no local access need neither the service nor its plugin.
These tools support ChatGPT chats, but their model
overrides apply only to Codex tasks; they cannot select 6 Pro or attach a plugin
to a ChatGPT chat. Use the in-app browser for those setup steps. Do not substitute
a cloud Work task for an ordinary ChatGPT chat. Native message delivery with the
Advisor plugin still needs end-to-end verification; if it cannot invoke the
attached plugin, continue through the browser in that same chat.

## Lifetime and tools

One consultation runs at a time. A repeated start with the same repo, brief,
and access reuses it; a different request reports busy. Every MCP call requires
the exact run ID, so an old chat cannot act on a later consultation.

- `consultation`, `list_directory`, `read_file`: inspect the brief and files.
- `write_file`: supply the SHA-256 from `read_file`, or `null` for a new file.
  This detects prior changes; it is not an atomic lock against other editors.
- `exec`: supply an argv array and a unique key; returns a job ID immediately.
  Repeating the same key and inputs in the live run returns the same job.
- `terminal`: poll, send stdin, or terminate that job. Output is bounded.
- `finish`: save the advice after all jobs exit. Identical retries succeed;
  different replacement advice is rejected.

Completed consultations stop after a one-minute grace period. Unfinished ones
stop after one idle hour; active work prevents idle shutdown. The maximum
lifetime is 23 hours. `node advisor.js stop` stops earlier. Nothing starts at
login. The service owns its Codex and tunnel children, including crash cleanup.
A crashed consultation cannot resume or replay commands; start a new one.

State and advice remain under `~/.local/state/dots-advisor/` (or
`DOTS_ADVISOR_STATE_DIR`). Service and tunnel logs live in each run directory.
`final.json` is the authoritative completion record even if the service exits
before returning its acknowledgement.

## Verify locally

```sh
npm test
node advisor.js start --local --repo /absolute/repository --brief /absolute/brief.md
```

`--local` skips the tunnel for SDK testing; it does not make the run reachable
from ChatGPT. Tests exercise real Codex file/terminal calls, MCP completion,
command retry behavior, and tunnel cleanup after a simulated service crash.
`IDLE_TIMEOUT_MS`, `MAX_LIFETIME_MS`, and `COMPLETION_GRACE_MS` allow short
lifecycle tests. `--port` overrides 8765.

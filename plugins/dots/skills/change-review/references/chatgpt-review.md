# ChatGPT review handoff

Use a fresh ChatGPT Web conversation with the user's requested model. The Web
agent is the delegated, read-only reviewer; the implementing agent retains
repair, validation, and any already-authorized publishing work. Do not substitute
a local subagent or an API model for a requested ChatGPT Pro review.

## Ensure repository access

Before every handoff, load [dots-tunnel](../../dots-tunnel/SKILL.md) and run its
local `runtime.py start` command once, using the account alias the user selected.
Require `ready: true`. This command already checks status and reuses a ready
runtime with one client call; do not precede it with `status`, restart a healthy
connection, or repeat setup. Follow the tunnel skill's failure handling if it
cannot become ready. Do not present an unverified handoff as ready to run.

Readiness confirms the local connection, not access from the Web chat. Have the
reviewer confirm that the Dots plugin exposes the intended repository before
reviewing. Use the existing authorized mount; never broaden tunnel access or
switch accounts to make the handoff work.

## Prepare a concise prompt

Mention `@Dots` explicitly so the user or chat launcher can select the Dots
plugin. Plain text alone does not prove that the plugin is attached. Include
direct clickable links to the skill and tunnel instructions:

- [Change Review](https://github.com/rishirsv/dots/blob/main/plugins/dots/skills/change-review/SKILL.md)
- [Dots Tunnel](https://github.com/rishirsv/dots/blob/main/plugins/dots/skills/dots-tunnel/SKILL.md)

Prefer links pinned to a published Dots commit when that revision is known.
For unpublished skill changes, provide the exact tunnel-accessible skill path
and have the reviewer read that version. A local filesystem link alone is not
usable from ChatGPT Web. If neither the links nor the authorized tunnel can
supply the instructions, report the missing access instead of improvising a
review without the skill.

Summarize the intended behavior and changes in a few sentences. Include the
repository mount/path, branch, exact base and head revisions, changed paths,
relevant existing check results, and the user's review focus. Tailor the focus
to the request and concrete risks; omit implementation reasoning, conclusions,
conversation history, and generic checklists already owned by the skill.

Include staged, unstaged, and untracked changes when they belong to the target.
Record their content hashes as well as HEAD so the implementer can detect drift.
If the connection cannot read Git diffs, prepare a diff packet with the
base/head identifiers and relevant untracked contents in an authorized path,
outside the review target. Link that path in the prompt; the reviewer still
reads surrounding repository files directly through Dots. Split large packets
into readable parts without omitting any changed paths. Do not assume that
the connected plugin exposes every tool supported by the local server.

Adapt this prompt, replacing placeholders with actual values:

> @Dots — Review only as an independent reviewer using <requested Web model,
> e.g. ChatGPT Pro>. Read and follow [Change Review](https://github.com/rishirsv/dots/blob/main/plugins/dots/skills/change-review/SKILL.md),
> starting at “Review the assigned change”; do not coordinate another reviewer
> or apply repairs. Follow [Dots Tunnel](https://github.com/rishirsv/dots/blob/main/plugins/dots/skills/dots-tunnel/SKILL.md)
> to confirm access and inspect the repository directly through the Dots plugin.
>
> Repository: <authorized mount/path>. Target: <branch, base SHA, head SHA,
> working-tree changes or diff-packet path>. Changes: <concise intended behavior
> and changed areas>. Focus: <user-requested points and concrete risks>.
> Existing checks: <results or unverified>.
>
> Inspect the complete target and necessary callers and tests. Return all
> supported findings in the skill's severity/path/line format, or “No findings.”
> State any access or coverage gaps. Do not edit files, run builds or test
> suites, commit, push, or post PR comments. The implementing agent will handle
> findings and validation.

## Launch and return

Use available chat or browser controls only within the user's authorization.
Verify the requested model and Dots attachment before submitting; do not assume
that a cloud Work creation tool can select the Web Pro model. When those
controls are unavailable, provide the ready-to-paste prompt and skill links,
and state the remaining action: open a fresh Web chat, select Pro, and attach
Dots. Do not claim the review has started merely because a prompt was prepared.

When launched, retain the conversation ID or URL. Retrieve its complete final
findings through available chat-reading tools or the browser; do not treat a
partial response, access failure, or timeout as “No findings.” If automatic
retrieval is unavailable, ask for the review result to be returned to the
implementing chat. Keep publishing pending while the requested review is
incomplete.

Compare the current target with the recorded revisions and working-tree hashes.
If it drifted, obtain review of the changed target before treating the review as
complete. Otherwise resume the parent skill's synthesis and repair path without
asking for routine fix approvals. Run affected checks and continue any
already-authorized PR publishing; the external review adds no publishing
authority of its own.

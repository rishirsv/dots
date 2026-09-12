# CLI advisor runs

Run in the task's repository with a saved brief on stdin. Honor the user's model
and effort; otherwise use the configured model at medium effort. Use the
noninteractive permission flags below within the host's allowed permissions.
State whether the run is implementation, review, or consultation in the brief.
For implementation, assign the model ownership of edits, required checks,
corrections, and the final handoff; do not ask it only for advice or a patch.

## Models and effort

| Request | CLI model | Effort levels |
| --- | --- | --- |
| Fable | Claude: `fable` | `low`, `medium`, `high`, `xhigh`, `max` |
| Astra | Codex: `gpt-6-astra` | `low`, `medium`, `high`, `xhigh`, `max`, `ultra` |
| Sol / Terra | Codex: `gpt-5.6-sol` / `gpt-5.6-terra` | Same as Astra |
| Luna | Codex: `gpt-5.6-luna` | `low`, `medium`, `high`, `xhigh`, `max` |
| Muse Spark | Personal Codex: resolve its exact model ID locally | Resolve supported levels locally |

For other models or changed availability, check CLI help and local configuration.
Claude accepts aliases and full model IDs; settings live in
`~/.claude/settings.json`. Codex's selected home contains `config.toml` and
`models_cache.json`, whose entries expose `slug` and `supported_reasoning_levels`.
Use the model picker if the cache is missing. Do not silently substitute models
or unsupported effort levels.

## Claude

“Have Fable review this” uses:

```sh
cd /absolute/path/to/repo
claude -p --model fable --effort medium --dangerously-skip-permissions \
  < /absolute/path/to/brief.md > /absolute/path/to/result.md
```

The bypass flag grants broader access than workspace write. For explicitly
read-only reviews, add `--tools 'Read,Glob,Grep' --strict-mcp-config
--mcp-config '{"mcpServers":{}}'` and instruct the advisor to inspect and report
only. This restricts tools; it is not an OS sandbox.

## Codex

```sh
codex exec -C /absolute/path/to/repo -m gpt-6-astra \
  -c 'model_reasoning_effort="medium"' -c 'approval_policy="never"' \
  --sandbox workspace-write \
  -o /absolute/path/to/result.md < /absolute/path/to/brief.md
```

Use `--sandbox read-only` for explicitly read-only reviews. For unrestricted
execution, replace sandbox and approval options with
`--dangerously-bypass-approvals-and-sandbox`; disclose that broader access.

## Personal Codex / Muse Spark

The current shell calls personal Codex `codex p`, not `codex-p`. Without relying
on shell aliases, prefix the Codex command above with:

```sh
CODEX_HOME="$HOME/.codex-personal" codex exec ...
```

For Muse Spark, replace `-m gpt-6-astra` with its exact model ID from that home's
catalog or model picker, and select a supported effort. Its ID and effort range
are not established by the current configuration; ask for the ID if local
lookup cannot resolve it.

Wait for completion and read the saved result. Check the diff and validation
evidence if writes were allowed. During implementation, do not duplicate or
take over the assigned work. If the scoped diff or required checks are missing
without a stated blocker, resume the same session or send a correction brief;
ownership changes only when the user reassigns it. For other follow-ups, include
the previous result and new evidence in the next brief or resume the same CLI
session.

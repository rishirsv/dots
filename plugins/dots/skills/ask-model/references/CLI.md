# CLI advisor runs

Run in the task's repository. Honor the user's model and effort; otherwise use
the configured model at medium effort. Pass a self-contained prompt as the final
argument. For a long or multiline prompt, write it to a temporary `.txt` file
outside the repository and pass it on stdin.

## Models and effort

| Request | CLI model | Effort levels |
| --- | --- | --- |
| Fable | Claude: `fable` | `low`, `medium`, `high`, `xhigh`, `max` |
| Astra | Codex: `gpt-6-astra` | `low`, `medium`, `high`, `xhigh`, `max`, `ultra` |
| Sol | Codex: `gpt-6.1-sol` | Same as Astra |
| Luna | Codex: `gpt-6-luna` | `low`, `medium`, `high`, `xhigh`, `max` |
| Muse Spark | Codex profile `muse`; model `meta/muse-spark-1.3-contributor` | `none`, `minimal`, `low`, `medium`, `high`, `xhigh` |

For other models or changed availability, read the catalog instead of
launching a probe run. `codex debug models` prints the configured Codex catalog
as JSON, with each model's `slug` and `supported_reasoning_levels`; the Muse
profile's catalog is `$CODEX_HOME/muse-models.json`. Claude accepts aliases and
full model IDs; check `claude --help` and `~/.claude/settings.json`. Do not
silently substitute a model or effort.

## Session lifecycle

Every persisted Codex run appears as a task in the Codex app, so choose
persistence before launching:

- **Review and consultation:** run without persistence by default. Add
  `--ephemeral` after `exec` for Codex, or `--no-session-persistence` for
  Claude. An ephemeral run cannot be resumed. Persist it only when a follow-up
  in the same session is already expected.
- **Implementation:** persist the session so corrections can resume it.
- **Cleanup:** once the caller has accepted a persisted Codex run's final
  output, archive it with `codex archive <session-id>` using the launch's `-p`
  profile and `CODEX_HOME`. Claude sessions do not appear in the Codex app.

## Claude

```sh
cd /absolute/path/to/repo
claude -p --model fable --effort medium --dangerously-skip-permissions \
  --output-format json "<self-contained prompt>"
```

The bypass flag grants broad access. For a read-only run, replace it with
`--tools 'Read,Glob,Grep' --no-session-persistence`; the tool list restricts
tools but is not an OS sandbox.
The JSON result contains the exact `session_id` and the final response in
`result`. Record the ID for any follow-up.

## Codex

```sh
codex exec -C /absolute/path/to/repo -m gpt-6-astra \
  -c 'model_reasoning_effort="medium"' -c 'approval_policy="never"' \
  --sandbox workspace-write --json "<self-contained prompt>"
```

Use `--sandbox read-only --ephemeral` for review and consultation. For
unrestricted execution, replace the sandbox and approval settings with
`--dangerously-bypass-approvals-and-sandbox` and disclose the broader access.
The `thread.started.thread_id` event contains the exact session ID; the final
response is the `agent_message` item. Resume it explicitly and restate the
original model, effort, approval, and sandbox configuration:

```sh
cd /absolute/path/to/repo
codex exec resume -m gpt-6-astra \
  -c 'model_reasoning_effort="medium"' -c 'approval_policy="never"' \
  -c 'sandbox_mode="workspace-write"' --json <session-id> \
  "<focused follow-up prompt>"
```

## Muse Spark profile

`codex -p muse` layers `$CODEX_HOME/muse.config.toml` over the base config. The
profile selects `meta/muse-spark-1.3-contributor` at `xhigh`; its catalog
supports `none`, `minimal`, `low`, `medium`, `high`, and `xhigh`. The synced
profile supplies valid disabled MCP transports, so no extra `-c mcp_servers.*`
flags are needed.

```sh
codex -p muse exec --ephemeral -C /absolute/path/to/repo \
  -c 'model_reasoning_effort="xhigh"' -c 'approval_policy="never"' \
  --sandbox read-only --json "<self-contained prompt>"
```

For implementation, drop `--ephemeral` and change `--sandbox` to
`workspace-write`. Record `thread.started.thread_id` from the launch. Because
`exec resume` does not accept `-C`, change to the same repository and invoke the
same profile under the same `CODEX_HOME` with that explicit ID:

```sh
cd /absolute/path/to/repo
codex -p muse exec resume \
  -c 'model_reasoning_effort="xhigh"' -c 'approval_policy="never"' \
  -c 'sandbox_mode="workspace-write"' --json <session-id> \
  "<focused follow-up prompt>"
```

Keep `-p muse` before `exec` and do not use `--last`. A successful resume emits
the requested ID again in `thread.started.thread_id`. Archive it when done with
`codex -p muse archive <session-id>`.

## Prompt files

For a long prompt, keep the selected flags and redirect stdin. Claude uses
`< /tmp/advisor-prompt.txt`; Codex uses `- < /tmp/advisor-prompt.txt`.

## Follow up

Resume the original session when implementation is incomplete or a focused
correction is required. Preserve its model, effort, access, profile, home, and
repository. For a Fable implementation launched above:

```sh
claude -p --resume <session-id> --model fable --effort medium \
  --dangerously-skip-permissions --output-format json \
  "<focused follow-up prompt>"
```

A persisted read-only Claude run repeats its original `--tools` restriction
instead of the bypass flag.

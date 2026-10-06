# Dots

Opinionated plugins and agent workflows for planning, building, reviewing,
documenting, and shipping software in Codex and Claude Code.

## Install

Follow [INSTALL.md](INSTALL.md) to install the plugins in Codex or Claude Code.
Start with local installation; cloud mode requires plugins already available to
your signed-in account. Machine configuration is optional and contains personal
defaults. Inspect it before syncing it.

## Start with a task

Choose [Dots](plugins/dots/README.md) for software work or
[Drafts](plugins/drafts/README.md) for writing. Select a skill in your app and
give it a concrete goal. In Codex, these prompts use the skill's `$name`:

```text
Use $index to fix duplicate rows when an export retries. Reproduce the issue
and verify the fix.

Use $how to explain how this repository cancels background jobs. Trace the
request through the code and show the important boundaries.

Use $scribe to turn these notes into a short essay. Preserve my central claim
and flag any facts that need a source.
```

Dots routes software tasks through focused planning, implementation, review,
and publishing workflows. Drafts develops ideas, drafts prose, and provides
editorial passes using the writer's own context.

## Local files from ChatGPT

[Tunnel](plugins/dots/scripts/dots-tunnel/README.md) is an optional, separate
MCP connection for reading and patching files in locally authorized folders.
When the local operator enables execution, it can also run commands through
Codex within those folders. It uses your normal ChatGPT conversation and model
selection. Installing Dots does not connect Tunnel or authorize local access.

## Source map

- `plugins/`: plugin and skill source.
- `.agents/plugins/marketplace.json`: Codex marketplace source.
- `.claude-plugin/marketplace.json`: Claude marketplace source.
- `configs/`: portable machine configuration.
- `scripts/`: sync and validation entrypoints.
- `AGENTS.md`: repository instructions for agents.

Keep secrets, authentication state, sessions, caches, generated local output,
and machine-local shell overrides outside this repository. Store shell
overrides in `~/.zshrc.local`.

## License

Unless a component includes its own license, this repository is available under
the [MIT License](LICENSE).

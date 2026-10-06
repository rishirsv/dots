# Dots

Focused workflows for planning, building, reviewing, and shipping software in
Codex and Claude Code. Install through the repository's
[installation guide](../../INSTALL.md).

## Get started

Select the [Index](skills/index/SKILL.md) skill and describe the task and how to
verify it. In Codex:

```text
Use $index to add CSV export to the reports page. Keep the existing filters
and verify that the exported rows match the visible results.
```

The Index routes substantial software work through the Feature Development
workflow and loads focused skills as needed. It activates when explicitly
selected; ordinary requests do not automatically invoke it.

## Choose a focused skill

| Task | Skill |
| --- | --- |
| Explain code or investigate a decision | [How](skills/how/SKILL.md), [Why](skills/why/SKILL.md) |
| Design a boundary or resolve an uncertain choice | [Architect](skills/architect/SKILL.md), [Prototype](skills/prototype/SKILL.md) |
| Review architecture or a completed change | [Architecture Review](skills/architecture-review/SKILL.md), [Change Review](skills/change-review/SKILL.md) |
| Write repository docs or build an HTML report | [Repo Docs](skills/repo-docs/SKILL.md), [HTML](skills/html/SKILL.md) |
| Publish or monitor a pull request | [Publish PR](skills/publish-pr/SKILL.md), [Babysit PR](skills/babysit-pr/SKILL.md) |

See the [Index](skills/index/SKILL.md) for the complete routing map. Each skill
defines its own inputs, permissions, and checks.

## Optional tools

[Tunnel](scripts/dots-tunnel/README.md) is a separate connection for locally
authorized file access and optional command execution from ChatGPT. The Dots
plugin contains its source and workflow, but does not bundle the app connection.

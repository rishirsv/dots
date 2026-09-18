# Upstream provenance

Portal is based on [`miuuyy/codex-chatgpt-web`](https://github.com/miuuyy/codex-chatgpt-web)
at commit `e0904bc82001f06e06e7f85f564ce760c92bfd79`.

That source is licensed under the MIT License. Its copyright notice and license
terms are preserved in [LICENSE](LICENSE).

The imported implementation supplied the ChatGPT browser session, Responses
API translation, OpenAI tunnel integration, native endpoint passthrough,
compaction behavior and runtime bundling. Portal removes the upstream Electron
launcher and modifies the product surface to expose one ChatGPT Web Pro route
and the current Codex task's dynamic tool registry through a smaller `portal`
lifecycle.

Future upstream updates should be reviewed and imported explicitly. Do not
replace this pinned revision with an unrecorded copy.

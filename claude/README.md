# Claude Mirror

This directory is a Claude-native mirror of the `ai-tools` Codex setup.

Source of truth:
- Codex config: `ai-tools/configs/codex/`
- Shared skills: `ai-tools/skills/`

Claude mirror layout:
- `.claude/settings.json`
- `.claude/agents/*.md`
- `.claude/skills/*/SKILL.md`

How this mirror is maintained:
- The Codex files remain the authoring source today.
- This Claude folder is a translated mirror, not a byte-for-byte copy.
- Codex-only settings and tool instructions are omitted or rewritten to match Claude conventions.
- Skills are copied with their supporting files, then patched where Codex-specific tools, paths, or wording would be incorrect in Claude.

Key translation choices:
- Codex TOML agent configs become Claude subagent Markdown files with YAML frontmatter.
- Codex model IDs are mapped to Claude model tiers such as `haiku` and `sonnet`.
- The Codex `config.toml` is mirrored into Claude `settings.json` only where Anthropic documents a clear equivalent.
- The stray top-level `ai-tools/skills/SKILL.md` is not mirrored at the Claude skills root because Claude expects one directory per skill. The canonical `vibe-security/` skill directory is mirrored instead.

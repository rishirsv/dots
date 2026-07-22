# `agents/openai.yaml`

Read this when a skill needs Codex-facing interface metadata.

```yaml
interface:
  display_name: "Human-facing name"
  short_description: "Short UI description"
  icon_small: "./assets/icon.png"
  icon_large: "./assets/logo.png"
  brand_color: "#3B82F6"
  default_prompt: "Use $skill-name to perform the recurring job."

policy:
  allow_implicit_invocation: true
```

Double-quote strings. Keep `short_description` concise. The default prompt must
name the skill as `$skill-name`. Set `allow_implicit_invocation: true` when the
model should discover the skill from ordinary user intent; use `false` only
when invocation should require an explicit `$skill-name` mention. Include tool
dependencies only when the skill genuinely requires them at runtime.

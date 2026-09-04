---
name: skill-standards
description: "Creates, updates, or statically reviews agent skill source against Dots standards. Use for authoring, revising, or diagnosing a skill; not for behavioral evaluation or plugin packaging."
---

# Skill Standards

Create, update, or review an agent skill according to one shared quality standard.
The workflows for creating, updating, and reviewing a skill are different, although they share similar standards.

Read [skill-practices.md](../../references/skill-practices.md), then choose the
branch that matches the user's requested outcome:

- **Create:** read [creating.md](references/creating.md). Build a new skill and
  prove that its source is ready for use.
- **Update:** read [updating.md](references/updating.md). Change only the
  requested seams while preserving the skill's accepted behavior and voice.
- **Review:** read [reviewing.md](references/reviewing.md). Return an
  evidence-backed diagnosis without changing source.

When examples, transcripts, accepted outputs, source packs, or user corrections
must become reusable behavior, read
[source-distillation.md](references/source-distillation.md). When the user wants
the current or a named Codex task turned into a new or updated skill, read
[session-capture.md](references/session-capture.md) first.

For Create or Update, load the environment's default `skill-creator` when it is
available and apply its authoring mechanics in the current context. If it is
unavailable, continue from the host's documented format, repository
instructions, `skill-practices.md`, and local validation. Stop before changing
source only when a required host contract cannot be established without
inventing it. Plugin scaffolding, manifests, packaging, marketplace entries,
installation, and cache updates belong to the environment's default
`plugin-creator`.

Static review does not by itself prove how a skill behaves in use. For complex
or risky changes, use the loaded creator's independent forward-testing guidance
or the smallest permitted non-mutating trial that can resolve a material
uncertainty.

Return the changed source or review verdict, the checks that support it, and
any uncertainty that still affects use.

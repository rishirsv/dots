---
name: skill-standards
description: "Creates, updates, or statically reviews agent skill source against Dots standards. Use for authoring, revising, or diagnosing a skill; not for behavioral evaluation or plugin packaging."
---

# Skill Standards

Apply the Dots-specific judgment and editorial standards in
[skill-practices.md](../../references/skill-practices.md).

For creation or updates, use the environment's default `skill-creator` for
authoring mechanics, resource structure, validation, and forward testing.
Dots adds preservation of accepted wording, voice, examples, and mental models;
compare the changed source against those before finishing.

For static review, read [reviewing.md](references/reviewing.md). Return an
evidence-backed diagnosis without changing source or running new trials.

When examples, transcripts, accepted outputs, source packs, or user corrections
must become reusable behavior, read
[source-distillation.md](references/source-distillation.md). When the user wants
the current or a named Codex task turned into a new or updated skill, read
[session-capture.md](references/session-capture.md) first.

Plugin scaffolding, manifests, packaging, marketplace entries, installation,
and cache updates belong to the environment's default `plugin-creator`.

Return the changed source or review verdict, the checks that support it, and
any uncertainty that still affects use.

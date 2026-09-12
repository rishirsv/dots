---
name: skill-standards
description: "Creates, updates, or statically reviews agent skill source against Dots standards. Use for authoring, revising, or diagnosing a skill; not for behavioral evaluation or plugin packaging."
---

# Skill Standards

Apply the Dots-specific judgment and editorial standards in
[standards.md](references/standards.md).

For creation or updates, use the environment's default `skill-creator` for
authoring mechanics, resource structure, validation, and forward testing.
Dots adds preservation of accepted wording, voice, examples, and mental models;
compare the changed source against those before finishing. Check that the
resulting skill applies the relevant authoring criteria in `standards.md`,
including what future runs load, decide, delegate, return, and count as done.

For static review, read [skill-review.md](references/skill-review.md). Return an
evidence-backed diagnosis. Review-only requests leave source unchanged; when
the user also requests fixes, complete the update and its relevant checks.

When examples, transcripts, accepted outputs, source packs, or user corrections
must become reusable behavior, read
[source-distillation.md](references/source-distillation.md). When the user wants
the current or a named Codex task turned into a new or updated skill, read
[session-capture.md](references/session-capture.md) first.

Plugin scaffolding, manifests, packaging, marketplace entries, installation,
and cache updates belong to the environment's default `plugin-creator`.

Return the changed source or review verdict, the checks that support it, and
any uncertainty that still affects use.

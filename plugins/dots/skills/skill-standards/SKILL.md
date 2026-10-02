---
name: skill-standards
description: "Creates, updates, or statically reviews agent skill source against Dots standards. Use for authoring, revising, or diagnosing a skill; not for behavioral evaluation or plugin packaging."
---

# Skill Standards

Use [standards.md](references/standards.md) to create, update, or review a skill.
Apply [Writing style](../../references/writing-style.md) while writing the
instructions and again before completing the review.

For creation or updates, use the environment's default `skill-creator` for
authoring mechanics, resource structure, validation, and forward testing.
Preserve accepted wording, voice, examples, and explanations unless the user
requests a change. Compare the revised source with the original before
finishing. Check what future runs will load, decide, delegate, return, and
require before completion. Review prose for clear actions and conditions as
well as reviewing the skill's structure.

For static review, read [skill-review.md](references/skill-review.md). Return
evidence-backed findings and proposed edits. Review-only requests leave source unchanged; when
the user also requests fixes, apply the supported edits and run their relevant
checks.

When examples, transcripts, accepted outputs, source packs, or user corrections
must become reusable behavior, read
[source-distillation.md](references/source-distillation.md). When the user wants
the current or a named Codex task turned into a new or updated skill, read
[session-capture.md](references/session-capture.md) first.

Plugin scaffolding, manifests, packaging, marketplace entries, installation,
and cache updates belong to the environment's default `plugin-creator`.

Return the changed source or the review verdict, findings, and proposed edits.
Include the checks performed and any uncertainty that still affects use.
A prose finding must quote the wording, explain the possible misreading, and
provide a concrete replacement.

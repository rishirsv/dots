# Skill Description Guidance Summary

## Answer

Session `019ed3b2-d14e-7fc2-ae62-02d164750d56` shows an invocation-posture miss.
Meta-Skill authoring and rewrite passes optimized Ideate as a model-discoverable
skill: `Use when ...` descriptions, common trigger examples, and
`allow_implicit_invocation: true`. The user later corrected the intended posture:
make it explicit-only and remove the trigger-language section.

The best fix is not to remove `Use when ...; not for ...` from Skill Writer.
That pattern is still right for model-discoverable skills. The precise fix is to
make Skill Writer's description guidance conditional:

- model-discoverable skills: optimize the frontmatter description as a routing
  surface;
- explicit-only skills: keep the required description concise and human-facing,
  and rely on runtime metadata such as `policy.allow_implicit_invocation: false`
  for Codex.

## Evidence

- `q01-session.md`: confirms the session failure pattern. The final Ideate fix
  changed frontmatter, route prose, and `agents/openai.yaml`, which shows the
  route contract spans all three surfaces.
- `q02-best-practices.md`: confirms current public guidance. OpenAI Codex docs
  say implicit matching depends on the `description`, and Codex supports
  `policy.allow_implicit_invocation: false` for explicit-only behavior. The open
  Agent Skills spec still requires a description that says what the skill does
  and when to use it.
- `q03-doctor.md`: localizes the root cause to
  `plugins/meta-skill/skills/skill-writer/references/design.md`, where the
  trigger-contract and frontmatter examples make `Use when ...; not for ...`
  feel unconditional even though the explicit-only section later says
  descriptions should be concise and human-facing.

## Recommended Source Edit

Patch only `plugins/meta-skill/skills/skill-writer/references/design.md`.

```diff
@@
-The frontmatter description is the primary routing surface. The body is not loaded until the skill triggers, so the description must answer: "Should the runtime read this skill now?"
+For model-discoverable skills, the frontmatter description is the primary routing surface. The body is not loaded until the skill triggers, so the description must answer: "Should the runtime read this skill now?"
+
+For explicit-only skills, do not optimize the description as an activation surface. Keep it as concise human-facing metadata that names what the skill does and how a user should recognize it; avoid forced `Use when ...; not for ...` phrasing unless it is naturally useful to the human index.
@@
-Pattern:
+Model-discoverable pattern:
@@
-Use only:
+For model-discoverable skills, use:
 
 ```yaml
 ---
 name: lowercase-hyphen-name
 description: Use when ...; not for ...
 ---
 ```
+
+For explicit-only skills, use the same `name` field and a concise human-facing
+`description` without forcing the `Use when ...; not for ...` pattern.
```

## Validation After Applying

```sh
plugins/meta-skill/scripts/metaskill validate plugins/meta-skill/skills/skill-writer --json
```

Also read back `design.md` to confirm the model-discoverable pattern remains
strong and the explicit-only branch is close enough to the description-writing
rules that future agents cannot miss it.

## Sources

- OpenAI Codex Agent Skills: https://developers.openai.com/codex/skills
- Agent Skills specification: https://agentskills.io/specification
- Agent Skills optimizing descriptions: https://agentskills.io/skill-creation/optimizing-descriptions
- Local reports: `q01-session.md`, `q02-best-practices.md`, `q03-doctor.md`

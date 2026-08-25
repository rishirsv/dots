---
name: index
description: "Routes broad Dots requests to the focused workflow. Use when Dots is explicitly named or tagged, the user asks which Dots skill to use, or requests the Dots skill index; not when a focused Dots skill is already selected."
---

# Dots

Choose the narrowest Dots skill that owns the requested outcome. This index
routes the work; the selected skill owns execution.

## Route

1. Honor an explicitly selected focused skill.
2. Otherwise choose one primary owner from the skill descriptions, using the
   requested outcome first and the object being acted on to break ties.
3. For an execution request, load and follow the selected skill only when it
   allows implicit invocation. When it requires explicit selection, recommend
   it and stop so the user can select it deliberately.
4. For a routing question, return the selected skill and its boundary without
   starting the workflow.
5. Name a sequence only when the request has distinct outcomes with a real
   handoff. Keep one owner active at a time.

If no Dots skill fits, continue without one. Ask one short question only when
two routes would produce materially different outcomes and the request does not
settle which outcome the user wants.

## Skill map

- **Shape:** `$clarify`, `$scout`, `$plan`
- **Understand:** `$explain`, `$how`, `$why`, `$teach`
- **Create:** `$design`, `$html`, `$docs-writer`, `$verification-skill`
- **Review:** `$review-change`, `$architecture-review`, `$design-review`, `$oracle`
- **Improve skills:** `$skill-standards`, `$skill-evaluator`
- **Continue:** `$recall`, `$handoff`, `$self-improve`
- **Coordinate and ship:** `$orchestrate`, `$pr`, `$babysit-pr`

For a catalog request, explain only the relevant groups unless the user asks
for the full index. For a routing question, return the primary skill and one
sentence explaining the boundary. Mention one alternative only when the
distinction helps the user choose.

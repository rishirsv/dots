---
name: index
description: "Routes broad Dots requests and new-feature development. Use when Dots is named or tagged, the user asks which Dots workflow to use, names feature-dev, or asks to build, add, or implement a new feature; not when a focused Dots skill is selected."
---

# Dots

Choose the narrowest Dots workflow that owns the requested outcome. This index
routes focused work and owns the shared feature-development workflow.

## Route

1. Honor an explicitly selected focused skill.
2. When the user names `feature-dev` or asks to build, add, or implement a new
   feature, follow [Develop a feature](../../references/feature-development.md).
3. Otherwise choose one primary owner from the skill descriptions, using the
   requested outcome first and the object being acted on to break ties.
4. For an execution request, load and follow the selected skill only when it
   allows implicit invocation. When it requires explicit selection, recommend
   it and stop so the user can select it deliberately.
5. For a routing question, return the selected skill and its boundary without
   starting the workflow.
6. Name a sequence only when the request has distinct outcomes with a real
   handoff. Keep one owner active at a time.

If no Dots skill fits, continue without one. Ask one short question only when
two routes would produce materially different outcomes and the request does not
settle which outcome the user wants.

## Skill map

- **Shape:** `$clarify`, `$scout`, `$plan`
- **Understand:** `$explain`, `$how`, `$why`, `$teach`
- **Build a feature:** [Feature development](../../references/feature-development.md)
- **Create focused outputs:** `$design`, `$html`, `$docs-writer`, `$verification-skill`
- **Review:** `$review-change`, `$architecture-review`, `$design-review`, `$oracle`
- **Improve skills:** `$skill-standards`, `$skill-evaluator`
- **Continue:** `$recall`, `$handoff`, `$self-improve`
- **Coordinate and ship:** `$orchestrate`, `$pr`, `$babysit-pr`

For a catalog request, explain only the relevant groups unless the user asks
for the full index. For a routing question, return the primary skill and one
sentence explaining the boundary. Mention one alternative only when the
distinction helps the user choose.

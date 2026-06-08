---
name: meta-skill
description: "Use for ANY work on an agent skill — authoring a new skill, reviewing or improving an existing one, diagnosing why a skill misbehaves, or evaluating how well a skill performs. Read first to understand the skill-lifecycle flow, then route to a specialist (skill-writer, skill-doctor, skill-evaluator) and orchestrate multi-step work across them. Not for non-skill tasks."
---

# Meta-Skill

*Scaffold — sections and high-level outline only; iterate before shipping.*

Skinny, always-read front door for the agent-skill lifecycle. Understand the
whole flow here, then route to one specialist and orchestrate multi-step work.

Full design: `meta-skill/docs/ARCHITECTURE.md` (source repo).

## The Lifecycle

| Intent | Specialist |
|---|---|
| Make a new skill | `skill-writer` |
| Improve / fix an existing skill | `skill-doctor` |
| Measure how a skill performs | `skill-evaluator` |

## Routing

- Detect intent from the request; pick exactly one specialist.
- Create (blank page) → `skill-writer`.
- Improve / "is it good?" / "it's broken" → `skill-doctor`.
- Measure / "how well does it work?" → `skill-evaluator`.
- Ambiguous → clarify here, then route.

## Orchestration (multi-step)

- Sequence specialists toward a goal no single one owns.
- e.g. write → evaluate; doctor → evaluate → loop until target.

## Front-Door Model

- Implicit / ambiguous skill requests enter here.
- Explicit invocation of a specialist may go direct.
- Route *across* skills; never do a specialist's job inline.

## Guardrails

- Stay skinny; defer detail to the specialists and their references.
- Don't reach inside a worker's workflow.

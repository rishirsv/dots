# Skill Routing

Use this reference when Interview reaches a point where another skill should own
the next artifact or action. Name only the skill that materially helps next.

| Need | Route |
|---|---|
| Missing requirements before implementation | `$clarify` |
| Durable repo docs, PRD, feature/domain doc, runbook, API docs, spec, ADR, or owner-doc update | `$docs-writer` after the artifact contract is stable |
| Cross-agent or cross-session continuation | `$handoff` |
| External/current evidence should steer the decision | `$research` or a `researcher` subagent lane |
| Reproducible or suspected software bug | `$debug` |
| Implementation sequencing after decisions are stable | planning or implementation workflow |
| Completed local work needs one safe commit | `$commit` |
| Completed local work needs branch, commit, push, and PR | `$yeet` |

Keep the boundary simple:

- Interview sharpens the thinking and recommends the next owner.
- The next skill owns its own template, path convention, validation, and final artifact.
- Prefer an existing owner doc before creating a new document family.
- A settled path or owner is not enough to route; keep Interview active while audience, durable purpose, section shape, source boundaries, and examples/non-examples would materially change the artifact.
- User answers inside Interview are design evidence, not approval to edit or implement.

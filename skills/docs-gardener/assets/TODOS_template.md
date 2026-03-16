# TODOS.md

## Purpose
Single actionable queue for near-term execution.

## Aging Policy
- Items older than `<N>` days must be refreshed, closed, or moved.

## Queue
| Item | Owner | Priority | Target Date | Link (spec/plan/tracker) | Next Action | Success Condition |
|---|---|---|---|---|---|---|
| `<task>` | <owner> | <P0-P3> | YYYY-MM-DD | <path/link> | <single action> | <done signal> |

## Recently Done
| Item | Completed | Link |
|---|---|---|
| `<completed task>` | YYYY-MM-DD | <path/link> |

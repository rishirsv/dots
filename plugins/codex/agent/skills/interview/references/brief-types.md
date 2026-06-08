# Brief Types

Use this reference after the closest repo context has been checked. Pick the one
row that matches the request; do not turn the session into a checklist.

| Brief type | Must know | Ask when missing | Likely next route |
|---|---|---|---|
| Product / PRD | problem, desired outcome, primary user/job, in/out scope, acceptance signal | "What should be true for this to count as done?" | PRD or canonical feature/domain doc |
| Design / UI | target surface, behavior, visual direction or source, expected interactivity | "What should it do, what should it look like, and how interactive should it be?" | design/prototype workflow or durable design doc |
| Docs / Artifact | reader, owner document, durable purpose, section shape, source boundaries, evidence to verify, update-vs-new-file choice | "What shape should this artifact take, and what would make that shape wrong?" | continue Interview until artifact contract is stable, then docs-writing route |
| Debug | symptom, expected behavior, actual behavior, repro/failing command, affected flow | "What did you expect, what happened, and how can I reproduce it?" | debugging route |
| Handoff | recipient, current state, completed work, next action, blockers, proof | "Who is receiving this, and what should they do next?" | continuation handoff |
| Decision / Interview | decision to make, competing options, constraints, source of truth, reversibility | "Which choice are we deciding between, and what would make one wrong?" | continue Interview or update existing owner doc |
| Commit / PR | intended scope, files included, validation expectations, publish target | "Should this be a local commit only, or a PR-ready publish flow?" | commit or publish flow |

## Common Understanding Checkpoint

Use this shape when enough context exists, and periodically in a longer
Interview when it would help the user see progress:

```md
Common Understanding
- **Goal**: ...
- **Current Understanding**: ...
- **Scope**: ...
- **Constraints And Defaults**: ...
- **Still Open**: None
- **Recommended Route**: ...
- **Recommended Next Step**: ...
```

## Question Shape

When context is missing, ask only the smallest route-changing set:

```md
Need To Know

1. <Plain question>?
a) <Recommended/default>
b) <Alternative>
c) Not sure - use default

Why this matters: <One short practical reason.>
```

## File-Shape Question

Use this when the path or owner is clear but the artifact contract is not:

```md
**Question:** What shape should this file have?

**Recommended Answer:** <specific section structure and why>

**Context:** The path or owner is settled, but section shape, source boundaries,
and future-agent usage would change the file materially.
```

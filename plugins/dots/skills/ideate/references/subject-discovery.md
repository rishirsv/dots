# Subject Discovery

Use Subject Discovery when the user wants Ideate to choose the subject before
shaping the idea. Common triggers: "surprise me", "what should we ideate on",
"find the interesting angle", or a broad repo, product, workflow, document, or
domain without a chosen target.

Subject Discovery should make the next Ideate move better. It should not produce
a complete idea package, rank a large idea list, write plans, or start build
work.

## Requirements

- Require substance: a repo, document, URL, pasted material, product area,
  workflow, domain, or clear desire.
- If the current repo is the substance, use one bounded read-only grounding pass
  and look for terms, surfaces, tensions, recent decisions, friction points,
  overloaded concepts, and neglected user or operator problems.
- If no substance is available, ask for one input instead of inventing a topic.
- Return 3-5 candidate subjects, not 10+ ideas.
- Recommend exactly one subject as the best default.
- End with one `**Question:**` and the normal A/B/C/D choice table.
- Once the user chooses, resume the normal Ideate flow.

## Output Shape

```md
**Read:** <why the material suggests a few promising subjects>

**Subject Discovery:** <one sentence about the grounding source>

| Subject | Why it is interesting |
|---|---|
| <subject> | <tension, opportunity, or decision it exposes> |
| <subject> | <tension, opportunity, or decision it exposes> |
| <subject> | <tension, opportunity, or decision it exposes> |

**Question:** Which subject should Ideate shape first?

| Choice | Direction |
|---|---|
| A | <subject> - <why choose it> |
| B | **<recommended subject> (Recommended)** - <why this is the best default> |
| C | <subject> - <why choose it> |
| D | Something else or a hybrid - <escape hatch> |

**Why this recommendation:** <1-3 concise reasons when useful>
```

## Selection Criteria

Prefer subjects that expose a real fork:

- unclear user, beneficiary, or operator
- overloaded vocabulary or naming
- a workflow that could be simpler, safer, or more durable
- a hidden approval, ownership, evidence, or state boundary
- a high-leverage smallest buildable version
- a rejected or neglected branch worth reconsidering

Avoid subjects that are merely obvious chores, broad themes, or implementation
tasks. If the best output is a task list, route to planning or build handoff
instead of continuing Ideate.

## Example

```text
User:
$ideate surprise me from this repo

Agent:
**Read:** This repo has several possible ideation targets, but the strongest
ones are not feature ideas; they are workflow boundaries that decide how future
agents move through the system.

**Subject Discovery:** I used one bounded read-only pass over the repo map,
skill surfaces, and local workflow guidance.

| Subject | Why it is interesting |
|---|---|
| Skill handoff gates | Several skills stop before build, docs, research, or design; the handoff language decides whether work stays controlled or drifts. |
| Local/private artifact routing | Agent-created outputs need a default home without leaking into public docs. |
| Validation confidence | The repo has deterministic validation, but semantic confidence still depends on examples and focused review. |

**Question:** Which subject should Ideate shape first?

| Choice | Direction |
|---|---|
| A | Skill handoff gates - sharpen how one skill hands work to the next. |
| B | **Local/private artifact routing (Recommended)** - it is small, cross-cutting, and affects everyday agent behavior. |
| C | Validation confidence - turn checks and examples into a clearer quality story. |
| D | Hybrid - explore how artifact routing and validation evidence reinforce each other. |

**Why this recommendation:**
- It is narrow enough for a first decision.
- It touches many workflows without requiring a new orchestration layer.
- It can later hand off cleanly to docs, planning, or build work.
```

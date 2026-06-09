# PRD Format

Use the project-owned PRD, feature spec, or domain doc shape first. When no local pattern exists, choose the smallest template that will let the next reader understand the product decision and act safely.

A PRD is a durable product decision record. It should explain what the feature is, why it matters, what is in and out, and how success will be recognized. Most PRDs should be concise. Promote to a larger shape only when the feature is long-standing, cross-surface, data-heavy, risky, or explicitly requested as `full`, `complete`, or `detailed`.

## PRD Scale

| Level | Use when | Template | Shape |
|---|---|---|---|
| **Default / simple** | A small feature, product change, or settled conversation needs a clear durable artifact. | [assets/PRD_template.md](../assets/PRD_template.md) | Problem, outcome, user/job, proposed shape, scope, agent-ready stories, notes, open questions. |
| **Canonical feature/domain doc** | A long-standing feature or main app domain needs one simple source of truth for how it works. | [assets/FEATURE_SPEC_template.md](../assets/FEATURE_SPEC_template.md) | Simple version, scope, what it is, how it works, ownership, data/state, acceptance, verification. |
| **Full / complete / detailed PRD** | The user asks for a full PRD, the feature crosses many surfaces, or scope/risk requires more detail. | [assets/PRD_FULL_template.md](../assets/PRD_FULL_template.md) | Full product, UX, data, testing, rollout, risk, and decision detail. |

## Default PRD

Use the default template unless the user asks for depth or the repo pattern clearly calls for a larger doc. The default should feel simple, essential, and helpful.

Keep it to the decisions that matter:

- the problem or opportunity
- the desired outcome
- the primary user/job
- the proposed shape
- in/out scope
- user stories with agent-verifiable acceptance criteria
- implementation constraints worth preserving
- open questions that could change scope or acceptance

Add a small diagram only when it makes the product flow, ownership boundary, or state transition easier to understand. Do not add a diagram as decoration.

## Canonical Feature / Domain Docs

Use this shape when the user wants durable documentation for a main app domain: one place that explains what the feature is, what it owns, how data or state moves, and how future agents should avoid duplicate truth.

Good canonical feature docs usually include:

- a plain-English simple version
- the product goal or thesis
- current product state and future product state when that distinction matters
- in/out scope
- user-visible surfaces or modes
- how it works at runtime
- ownership boundaries
- data model or state model when relevant
- diagrams when they clarify flow or ownership
- acceptance criteria and verification notes

This is not necessarily a "bigger PRD." It is often a clearer one. Prefer explanatory walkthroughs over long requirement inventories when the goal is to remember how a domain works.

## Full PRDs

Use the full template only when the user asks for `full`, `complete`, or `detailed`, or when a concise PRD would hide important risk. Full PRDs are for features with multiple user roles, several surfaces, meaningful data/state behavior, migration or rollout risk, or many settled decisions.

## User Stories And Acceptance Criteria

Every PRD must include user stories. Each story should be small enough to become one Codex goal: one user outcome, one product behavior, and a verifiable stopping condition.

Write story acceptance criteria so an agent can prove completion without guessing:

- Use `Given / When / Then` or equally concrete observable language.
- Include the artifact, UI state, data state, command, metric, or review evidence that proves the story is done.
- Name edge cases, permissions, empty states, errors, and rollback or recovery behavior when they are part of the user promise.
- Avoid criteria that depend only on intent, polish, or "works well" unless paired with a visible signal or testable behavior.
- If the acceptance criteria require implementation sequencing, keep the PRD story-level and move the sequence to a Plan after the PRD is accepted.

When a story is suitable for long-running Codex work, the objective should be expressible as: `Complete <story outcome> without stopping until <verifiable end state>`.

## Writing Rules

- Lead with user-visible outcomes and operational consequences.
- Use project-native vocabulary and ownership boundaries.
- Prefer a few agent-ready user stories over generic story inventories.
- Keep file paths out unless they are durable concept owners or needed for implementation context.
- Separate settled decisions from recommendations.
- Mark assumptions explicitly when they are not confirmed.
- Keep optional unknowns out of `Open Questions`; include only questions that could change implementation or acceptance.
- Do not turn the PRD into a Plan. If sequencing dominates, write a Plan after the PRD is accepted.

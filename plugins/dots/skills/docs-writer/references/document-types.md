# Document Types

Read this after choosing the documentation job. Prefer the repo's existing
structure when it is clear; use these recipes when the repo has no stronger
local convention.

## README

Use for the front door to a repo, package, tool, or major component.

Include only what helps a new reader decide what the project is and how to take
the next useful step:

- Purpose and scope.
- Quick start or most common workflow.
- Source map or important directories.
- Build, test, sync, or run commands that are expected for contributors.
- Links to deeper docs instead of repeating them.
- Current constraints, generated-file boundaries, and important caveats.

Avoid architecture essays, stale roadmaps, and exhaustive API references in a
README. Link out when the detail is durable but not front-door material.

## Concept

Use when the reader needs to understand a system, model, abstraction, or design
area before acting.

Recommended shape:

- What it is.
- Why it exists.
- Core model or vocabulary.
- How the parts relate.
- What this concept does not cover.
- Links to tasks, references, or decisions.

Concept docs should not read like procedures. Include examples only when they
clarify the model.

## How-To

Use for a task with a concrete outcome and a flexible path.

Recommended shape:

- Goal.
- Prerequisites.
- Steps.
- Validation.
- Troubleshooting or rollback when failure is common.
- Related docs.

Keep the goal narrow. If there are many independent goals, split them or create
a landing page that routes to separate how-tos.

## Tutorial

Use for guided learning where the reader builds understanding by completing a
safe path.

Recommended shape:

- What the reader will build or learn.
- Before you begin.
- Step-by-step path with expected observations.
- Cleanup.
- What happened.
- Next steps.

Prefer reliable toy inputs over production-specific examples. Do not disguise a
reference doc as a tutorial.

## Reference

Use for lookup material: commands, config, schema, API fields, options, events,
environment variables, file formats, or compatibility matrices.

Recommended shape:

- Scope and version/source.
- Stable tables or definition lists.
- Field names, types, defaults, required/optional status, and examples.
- Cross-links to concepts or how-tos.
- Source or generation note when the reference is derived.

Optimize for scanning and exactness. Avoid narrative unless it prevents misuse.

## Runbook

Use for operational workflows, recurring maintenance, incident response, or
release/publish procedures.

Recommended shape:

- Trigger.
- Preconditions and required access.
- Commands or actions.
- Expected healthy output.
- Failure handling, escalation, and stop conditions.
- Validation and completion criteria.

Runbooks should be conservative. State when to stop for human approval or when a
command has external effects.

## PRD Or Feature Spec

Use when a feature idea, problem statement, or product request needs a durable
product contract.

Recommended shape:

- Problem.
- Target users and jobs.
- Goals.
- Non-goals.
- User stories.
- Requirements, grouped by priority when useful.
- Acceptance criteria.
- Success criteria or metrics.
- Risks.
- Open questions.
- Timeline or phasing when relevant.

Write user stories in the form "As a [user type], I want [capability] so that
[benefit]" when that format helps. Keep the user type specific, describe the
capability rather than the implementation, and state the user or business value.
Include important edge cases, error states, empty states, and boundary
conditions. Order stories by priority when sequencing matters.

Avoid user stories that are too vague, prescribe a UI widget or technical
solution, omit the benefit, combine several capabilities, or describe internal
team work instead of user value. Capture internal work as requirements,
technical notes, or implementation tasks when the doc type needs them.

Group requirements by priority when the repo has no stronger convention:

- **P0 / Must-have**: required for the feature to solve the core problem.
- **P1 / Should-have**: important improvement that can follow the core launch.
- **P2 / Future consideration**: out of scope for the current version, but useful
  to preserve as design context.

Acceptance criteria should be independently testable. Use Given/When/Then or a
checklist, cover happy paths and important failure paths, and avoid ambiguous
words such as "fast", "intuitive", or "easy" unless the doc defines them
concretely.

Success criteria should name the intended outcome and, when evidence supports
it, the measurement method, target, and evaluation window. If metrics are
unknown, label them as hypotheses or open questions instead of inventing
targets.

For PRDs, gather source evidence internally but do not add source-evidence,
provenance, reviewed-scope, or audit sections to the document itself.

## Design Doc

Use when an engineering change needs technical alignment before implementation,
especially when choices are expensive to reverse, several people or systems must
coordinate, requirements are ambiguous, or the work carries security, privacy,
data, reliability, compatibility, cost, or long-term maintenance risk.

Read [design-docs.md](design-docs.md) before writing, revising, or reviewing a
design doc.

Recommended shape:

- Metadata.
- Objective.
- Background.
- Goals.
- Non-goals.
- Scenarios.
- Proposed design.
- How to build it, when implementation order affects risk or coordination.
- Interfaces, dependencies, data model, or infrastructure.
- Security, privacy, logging, retention, SLOs, monitoring, and legal
  considerations when applicable.
- Timeline or rollout plan.
- Open issues.
- Resolved issues.
- Alternatives considered.

Do not treat this as mandatory boilerplate. Choose sections with the penalty
filter: document the decisions that would be painful, risky, or costly to get
wrong, and leave cheap implementation details to the implementation.

## ADR Or Design Note

Use for a durable decision, rejected alternatives, or a design proposal.

Recommended shape:

- Status.
- Context.
- Decision.
- Consequences.
- Alternatives considered.
- Evidence and links.

Keep the decision distinct from implementation steps. If the decision has not
been made, call it a proposal or design note rather than an ADR.

## Troubleshooting

Use when readers arrive with symptoms, errors, or failed checks.

Recommended shape:

- Symptoms.
- Likely causes.
- Diagnosis steps.
- Fixes.
- Verification.
- Escalation.

Use exact error text when available. Do not bury the most common fix behind a
long explanation.

## Changelog And Release Notes

Use for a reader-facing account of changes over versions, releases, or dates.

Recommended shape:

- Version or release identifier.
- Date only when the release artifact already uses dates.
- Highlights grouped by reader impact.
- Breaking changes and migration notes.
- Fixes and known issues.
- Links to PRs, commits, or docs when useful.

Prefer reader impact over commit-log summaries. Avoid internal implementation
details unless they change behavior, compatibility, or operations.

## Knowledge Concept

Use for an agent-readable unit of knowledge in a Markdown corpus or OKF-style
bundle.

Recommended shape:

- YAML frontmatter with `type`, `title`, `description`, optional `resource`,
  optional `tags`, and repo-specific fields only when useful.
- Body sections that fit the concept type, such as `# Schema`, `# Examples`,
  `# Steps`, `# Relationships`, `# Failure Handling`, or `# Citations`.
- Bundle-relative links to related concepts where a future agent should
  traverse context.

Do not add timestamps. Do not create `log.md`.

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

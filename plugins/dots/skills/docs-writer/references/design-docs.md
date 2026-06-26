# Design Docs

Use this reference when writing, revising, or reviewing a design doc, technical
design, implementation design, architecture proposal, or durable "how to build
it" plan.

A design doc helps reviewers find expensive mistakes before implementation. It
is not a transcript of every possible implementation detail. Spend the document's
attention on decisions that are hard to reverse, risky to misunderstand, or
important for several people or systems to coordinate around.

## When To Use A Design Doc

Prefer a design doc when one or more of these are true:

- Several people, teams, agents, services, or workstreams must coordinate.
- The work will take sustained engineering effort rather than a small patch.
- The result will run in production, become a durable platform surface, or be
  hard to remove later.
- Goals, requirements, ownership, user behavior, or system boundaries are still
  ambiguous.
- The work crosses a trust boundary, data boundary, service boundary, repo
  boundary, deployment boundary, or user-facing workflow.
- A wrong decision could create security, privacy, legal, data-loss, reliability,
  migration, compatibility, cost, or long-term maintenance risk.

Use a different document type when the job is narrower:

- Use a PRD or feature spec for product intent: users, jobs, requirements,
  acceptance criteria, and success measures.
- Use an ADR for one durable decision and its alternatives.
- Use a runbook for an operational procedure that will be repeated.
- Use a how-to for a task the reader should complete.
- Use a concept doc when the reader needs to understand a model but no design is
  being proposed.

## Penalty Filter

Before choosing sections, identify the expensive decisions:

- What would be painful to change after code ships?
- What assumption could force rework if it is wrong?
- What will other people or systems depend on?
- What failure would be costly, embarrassing, unsafe, or hard to diagnose?
- What are reviewers most likely to challenge?
- What choices look easy now but lock in a data model, protocol, vendor,
  deployment topology, permission model, or user promise?

Document those areas deeply. Keep cheap choices brief or leave them to
implementation. For example, a database, public API, auth model, data retention
rule, or migration strategy often belongs in the design doc. Button copy,
minor layout choices, small helper functions, and easily swapped libraries
usually do not unless they create meaningful risk.

## Core Shape

Start with the smallest useful structure, then add sections based on the risk
profile.

Recommended default shape:

- **Title**: short, distinctive, and stable enough for people to reference.
- **Metadata**: author, status, created date when useful, owning team or repo,
  canonical URL or path, and reviewers when the repo convention supports it.
- **Objective**: one plain-language sentence explaining what the project will
  make true.
- **Background**: why this work exists, what problem it solves, relevant prior
  attempts, and what context a reviewer needs before reacting to the design.
- **Goals**: user, team, operational, or business outcomes after the work lands.
- **Non-goals**: explicit exclusions that prevent scope creep and wrong review
  expectations.
- **Scenarios**: concrete user, system, migration, failure, or operational
  flows that reveal the required behavior.
- **Proposed Design**: the architecture, interfaces, data model, dependencies,
  ownership, and important mechanisms.
- **How To Build It**: the implementation path when build order, integration,
  rollout, test strategy, or migration safety affects the design.
- **Risks And Constraints**: security, privacy, reliability, legal, cost,
  compatibility, performance, staffing, timeline, or platform constraints.
- **Open Issues**: unresolved decisions with options and immediate next steps.
- **Resolved Issues**: decisions made during review, preserving the original
  question and the chosen resolution.
- **Alternatives Considered**: strong alternatives reviewers would naturally ask
  about, with concise reasons they were rejected.

Do not force every section into every design doc. If a section does not change
the reader's ability to review the design, omit it.

## Section Selection

Choose sections by project shape.

For user-facing apps and workflows, consider:

- User roles and permissions.
- Primary scenarios and edge cases.
- UI states, navigation, notifications, accessibility assumptions, and supported
  platforms.
- User data lifecycle, account lifecycle, and support or admin flows.

For services, backends, and integrations, consider:

- Service boundaries, APIs, events, jobs, queues, CLI semantics, or file formats.
- Data flow, persistence, schema, migrations, idempotency, and retry behavior.
- SLOs for availability, latency, throughput, scale, freshness, and error rates.
- Monitoring, alerting, logging, dashboards, and operational ownership.
- Deployment topology, environments, feature flags, rollout, rollback, and
  compatibility with existing clients.

For data-sensitive systems, consider:

- Sensitive data handled, retention period, deletion semantics, access controls,
  encryption, and backup behavior.
- Trust boundaries, attack surface, abuse cases, auditability, and what must not
  appear in logs.
- Legal, contractual, regulatory, or licensing constraints.

For migrations, imports, and compatibility work, consider:

- Source and target formats, mapping rules, validation, partial-failure handling,
  backfill order, cutover, rollback, and reconciliation.
- Versioning, old-client behavior, deprecation, and data repair strategy.

For libraries, tools, and repo-internal platforms, consider:

- Public API or CLI contract, extension points, config surface, defaults,
  compatibility promise, packaging, install/update path, and test harness.

## How To Build It

Include a "How To Build It", "Implementation Plan", or "Build Plan" section
when implementation order is part of the design. This is common when the work
needs staged rollout, migration safety, early feedback, cross-team coordination,
or proof that the design can be built without a large risky launch.

Do not turn this section into a full task tracker. It should explain the build
strategy reviewers need to validate the design.

Useful subsections:

- **Build order**: milestones that create useful intermediate states, not only
  internal plumbing. Prefer early slices that validate the riskiest assumptions.
- **Integration points**: where the new code connects to existing modules,
  services, data stores, jobs, CLIs, APIs, files, or deployment systems.
- **Interfaces to create or change**: public contracts, schemas, commands,
  events, config fields, permissions, or environment variables.
- **Data and migration steps**: schema changes, backfills, import/export,
  compatibility windows, validation, repair, and rollback.
- **Rollout and rollback**: flags, staged exposure, canaries, migration gates,
  disable paths, and what happens if the rollout fails.
- **Validation**: tests, fixtures, load checks, security review, privacy review,
  migration dry runs, observability checks, and acceptance criteria.
- **Ownership and sequencing**: who needs to do what first when coordination
  matters.

Good build-plan milestones describe a user-visible, operator-visible, or
reviewer-visible capability:

- "Serve a read-only mirror from hardcoded fixture data."
- "Load real data in a test environment with writes disabled."
- "Enable writes for internal users behind a feature flag."
- "Run the migration dry-run and compare row counts and checksums."
- "Roll out to 5% of traffic with rollback verified."

Weak milestones only describe isolated implementation chores:

- "Create database tables."
- "Write models."
- "Implement frontend."
- "Add tests."

Those tasks can be part of an issue tracker, but a design doc should explain why
the sequence reduces risk.

## Design Detail Guidance

Use enough detail for reviewers to assess the design without reading the future
code.

Include:

- Interfaces, protocols, schemas, data shapes, commands, config fields, and
  examples when other systems or users depend on them.
- Diagrams when they reduce ambiguity around flows, ownership, boundaries, or
  lifecycle. Avoid decorative diagrams.
- Scenarios that cover happy path, important edge cases, failure paths, and
  permission boundaries.
- Constraints that materially limit possible designs.
- SLOs or operational targets when performance, reliability, scale, or freshness
  affects architecture.
- Explicit rationale for security, privacy, logging, retention, and legal
  decisions when the system handles sensitive data or externally constrained
  behavior.

Avoid:

- Exhaustive implementation notes that will become stale before code review.
- Cosmetic UI choices unless they encode a requirement or risk.
- Long lists of rejected ideas that no reviewer would reasonably ask about.
- Vague goals such as "easy", "fast", "robust", or "secure" without concrete
  criteria.
- Invented precision. If a target or requirement is unknown, label it as an open
  issue.

## Open And Resolved Issues

Use open issues when the design has a real unresolved decision, not as a parking
lot for miscellaneous thoughts.

Each open issue should include:

- The question or problem.
- Why it matters.
- Plausible options.
- Current recommendation when one exists.
- Immediate next step and owner when known.

When the issue is resolved, move or copy it into resolved issues. Preserve the
original question and add the decision, rationale, and follow-up implications.

## Alternatives Considered

Include alternatives that reviewers are likely to ask about or that consumed
meaningful investigation time.

Keep each alternative concise:

- What the alternative was.
- What made it attractive.
- Why the proposed design does not choose it.

Do not document every rejected thought. The alternatives section should prevent
repeat debate, not prove that the author explored every possibility.

## Review Checklist

Before finalizing or reviewing a design doc, check:

- The first page gives enough context for a reviewer who has not heard the
  hallway explanation.
- Goals describe outcomes, while the proposed design describes implementation.
- Non-goals are specific enough to stop scope creep.
- The doc spends the most detail on expensive or risky decisions.
- Scenarios reveal behavior, permissions, failures, and edge cases.
- "How To Build It" explains risk-reducing build order when implementation
  sequence matters.
- Interfaces and data shapes are concrete enough for dependent systems.
- Security, privacy, logging, retention, and legal sections exist when the
  system handles sensitive data or regulated behavior.
- SLOs, monitoring, alerting, rollout, and rollback are covered when the system
  has production reliability impact.
- Open issues have next steps; resolved issues preserve decisions.
- Alternatives answer the obvious "why not this?" questions without becoming an
  exhaustive diary.

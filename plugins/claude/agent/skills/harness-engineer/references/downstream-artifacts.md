# Downstream Artifacts

Read this after an assessment exists and the user asks to create follow-up
artifacts or execute an improvement.

## General Rules

- Create only the artifact or patch the user chose, unless the user asked for
  autonomous execution.
- Ground the work in the assessment finding, current repo files, and local
  conventions.
- Prefer minimal artifacts that future agents will actually read and maintain.
- Do not create competing sources of truth when the repo already has a
  canonical place.
- For source/generated splits, edit source first and run the repo's sync or
  generation command.

## Plan

Use for broad or multi-step harness implementation. Follow the target repo's
plan convention first. If none exists, include:

- Summary: user-visible outcome and why it matters.
- Current state and evidence.
- Implementation changes grouped by behavior or subsystem.
- Test plan with exact checks, expected observations, and acceptance evidence.
- Assumptions, defaults, decision log, and stop rules.

Make the plan decision-complete: a future agent should be able to implement
from the plan plus the working tree without choosing architecture, behavior, or
validation from scratch.

Good plan candidates:

- Refactor validation commands into a focused harness.
- Add architecture boundary enforcement.
- Make the app locally bootable and inspectable by agents.
- Create or repair repo maps and source-of-truth docs.
- Add recurring cleanup, doc-gardening, or debt hygiene.

## Architecture Map

Use when the repo lacks an agent-legible architecture map or the existing map is
stale. Include:

- Project overview.
- Main domains, packages, apps, services, or deliverables.
- Data and runtime boundaries.
- Dependency rules and enforcement.
- Validation surfaces and command map.
- Source-of-truth docs and planning conventions.
- Agent-specific navigation guidance.

Do not duplicate content already canonical elsewhere; link to it.

## Diagram

Use Mermaid unless the repo already has a diagramming convention. Useful shapes:

- Current vs target agent feedback loop.
- Domain/layer boundaries and allowed dependency directions.
- Runtime validation flow from agent action to evidence.
- Knowledge-system map from instruction entrypoint to deeper docs, plans,
  tests, scripts, and generated references.

Keep diagrams legible. Prefer one clear diagram over many decorative diagrams.

## Command Map Or Setup Script

Use when the assessment shows agents cannot reliably boot, inspect, or validate
the project.

Include:

- setup/install
- lint/static analysis
- unit tests
- integration/end-to-end tests
- build/typecheck
- dev server
- database/migrations/seed data
- format/generate
- CI/release

For scripts, prefer non-interactive behavior, focused scopes, concise failure
output, and a `--help` path when practical.

## AGENTS.md Or Instruction Patch

Use when future agents need a better table of contents or routing rule.

Good additions:

- where architecture docs live
- where plans and progress ledgers live
- validation commands for common surfaces
- generated-vs-source boundaries
- safe local tooling
- links to deeper docs rather than duplicated detail

Keep entrypoint instructions short. Add prose only when a test, hook, script, or
deeper doc is not the better control.

## Validation Control

Use when the assessment finds a repeatable failure that can be detected.

Choose the narrowest effective control:

- link check for stale docs
- test for behavior/regression
- schema/typecheck for data contracts
- hook for source/generated or sync mistakes
- linter/static check for architecture boundaries
- CI gate for repo-wide enforcement

Report what the control catches and what it does not catch.

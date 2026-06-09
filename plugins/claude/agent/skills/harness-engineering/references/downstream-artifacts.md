# Downstream Harness Artifacts

Read this only after the assessment exists and the user asks to create follow-up artifacts.

## General Rules

- Create only the artifact the user chooses.
- Ground every artifact in the assessment report and current repo conventions.
- Prefer minimal artifacts that future agents will actually read and maintain.
- Do not create competing sources of truth when the repo already has a canonical place.

## Plan

Use for broad or multi-step harness implementation. Follow the target repo's Plan convention first. If none exists, include:

- Summary: user-visible outcome and why it matters.
- Implementation changes grouped by behavior or subsystem.
- Test plan with exact checks, expected observations, and acceptance evidence.
- Assumptions, defaults, and stop rules that future agents must preserve.

Make the plan decision-complete: a future agent should be able to implement from the plan plus the working tree without choosing architecture, behavior, or validation.

Good Plan candidates:

- Refactor validation commands into a focused harness.
- Add architecture boundary enforcement.
- Make the app locally bootable and inspectable by agents.
- Create or repair repo maps and source-of-truth docs.
- Add recurring cleanup/doc-gardening/debt hygiene.

## Architecture Diagram

Use Mermaid unless the repo already has a diagramming convention.

Useful diagram types:

- Current vs target agent feedback loop.
- Domain/layer boundaries and allowed dependency directions.
- Runtime validation flow from agent action to evidence.
- Knowledge-system map from `AGENTS.md` to deeper docs/plans/tests.

Keep diagrams legible. Prefer one clear diagram over many decorative diagrams.

## Architecture Markdown

Use when the repo lacks an agent-legible architecture map or the existing map is stale.

Include:

- Project overview.
- Main domains/packages/apps/services.
- Data and runtime boundaries.
- Dependency rules and enforcement.
- Validation surfaces and command map.
- Source-of-truth docs and planning conventions.
- Agent-specific navigation guidance.

Do not duplicate content already canonical elsewhere; link to it.

## AGENTS.md Patch

Use when future agents need a better table of contents or harness-routing instructions.

Good additions:

- Where architecture docs live.
- Where Plans live.
- Which validation commands to run for common surfaces.
- Where generated references live.
- Which docs are canonical versus scratch.
- Which local tooling is safe for agents.

Keep `AGENTS.md` short. Point to deeper docs instead of making it an encyclopedia.

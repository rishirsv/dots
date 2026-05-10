# OpenAI ExecPlans Notes For Harness Engineering Scope

Source: https://developers.openai.com/cookbook/articles/codex_exec_plans
Published: 2025-10-07
Author: Aaron Friel

## Relevant Principles

- ExecPlans are for complex, multi-hour work where a user needs to verify the approach before implementation begins.
- A repository should teach agents when to use ExecPlans through `AGENTS.md` or equivalent repo guidance.
- An ExecPlan should be a self-contained living document: a future agent should be able to continue from the plan plus the working tree, without relying on chat memory.
- Plans should explain user-visible purpose first, then implementation path, then exact validation and acceptance evidence.
- Important living sections include progress, surprises/discoveries, decision log, and outcomes/retrospective.
- Validation is required. A plan should name exact commands, expected observations, and proof beyond compilation when possible.
- Plans should be idempotent and recoverable, especially for risky migrations or broad refactors.
- Prototyping milestones are appropriate when the design has unknowns, competing approaches, or external-library risk.

## Implication For The Harness Engineering Skill

The `harness-engineering` skill should not create an ExecPlan as part of the default assessment run. Instead, it should:

- Identify whether a repo already has an ExecPlan convention and where plans live.
- Recommend one or more possible downstream ExecPlans when the assessment finds broad harness refactors.
- Offer to generate a minimal, repo-convention-aligned ExecPlan only after the user chooses an option.
- Ensure any generated ExecPlan is self-contained, validation-heavy, and grounded in the assessment findings.

## Downstream Artifact Options

- `ExecPlan`: for implementing selected harness improvements or a broad harness-engineering refactor.
- `ARCHITECTURE.md`: for durable repo maps, domain boundaries, dependency direction, and system-of-record explanations.
- `Architecture diagram`: for visualizing current and proposed harness loops, domain boundaries, validation flows, and agent feedback paths.
- `AGENTS.md` patch: for teaching future agents where the repo map, plans, validation commands, and harness rules live.

---
name: navigation-designer
description: Produce a Navigation Design block describing the surface type, active state model, state persistence, deep linking strategy, and accessibility contract that an implementation agent can follow. Use when asked to design a navigation surface (without implementing code) aligned to existing repository conventions.
---

# Navigation Design

## Purpose

Help Codex complete navigation design work end-to-end by:

- producing one implementation-ready `## Navigation Design (for navigation-implementor)` block
- defining the surface type, active state derivation, URL strategy, and component breakdown for the task
- relying on `../navigation-common/SKILL.md` for shared conventions instead of repeating them here

## When to use this skill:

- The user wants a navigation design or spec without code changes.
- The task needs explicit surface type selection, active state model, deep linking strategy, and accessibility notes.
- Another frontend skill needs a navigation design block that an implementation agent can apply directly.

### Do NOT use this skill if:

- The user wants code changes rather than a design artifact.
- The task is about route guards or URL structure. use `routing-designer`.
- The request only needs generic navigation advice with no concrete surface contract.

## Inputs

- Task name.
- Task description including the app sections or routes the navigation maps to.
- Whether navigation state (expanded groups, active tab) must survive page transitions.

## Output Format

Return all sections in this order:

1. `Summary`
2. `Assumptions`
3. `## Navigation Design (for navigation-implementor)`

The design block must include only:

- **Task Goal**
- **Surface Type and Rationale**
- **Active State Model**
- **State Persistence** (what survives transitions and where it lives)
- **Deep Linking Strategy**
- **Back Behavior Notes**
- **Component Breakdown**
- **Accessibility Notes**

## Workflow

1. Read `../navigation-common/SKILL.md` and apply its shared conventions.
2. Select the correct surface type and justify the choice explicitly.
3. Define how active state is derived. confirm it comes from router location, not component state.
4. For each piece of navigation state, decide: URL, Redux, local, or persisted preference.
5. Define the component breakdown: which components own which part of the navigation surface.
6. Add task-specific accessibility notes beyond the shared baseline.

## Guardrails

- Keep the design scoped to the navigation surface. do not design route guards or page layouts here.
- Do not propose navigation state in `useState` when it needs to survive transitions.
- State assumptions when route structure or app information architecture is not confirmed.
- Do not design a sidebar when a simpler top nav or tab bar is sufficient.

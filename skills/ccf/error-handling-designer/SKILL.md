---
name: error-handling-designer
description: Produce an Error Handling Design block (UX + technical policy) describing task requirements to be put into a task that an implementation agent can follow. The block defines error taxonomy, UI patterns (toast/inline/page), copy rules, accessibility requirements, and integration contracts for data fetching, mutations, routing, and runtime crashes. Use when tasked to design how the UI should handle errors without implementing code.
---

# UI Error Handling Design

## Purpose
Help Codex complete UI error-handling design work end-to-end by:
- producing one implementation-ready `## Error Handling Design (for implement-error-handling)` block
- defining error taxonomy, display rules, copy rules, and accessibility expectations for the scoped UI
- keeping the output aligned to repository conventions without turning it into implementation code

## When to use this skill:
- The user wants an error-handling design or policy without code changes.
- The task needs explicit UX and technical rules for async failures, auth failures, routing failures, or runtime crashes.
- Another frontend design artifact needs a dedicated error-handling block an implementation agent can apply directly.

### Do NOT use this skill if:
- The user wants error-handling code changes rather than a design artifact.
- The task only needs a routine inline validation note and does not require a distinct error-handling policy.
- The request is outside this repository's React UI code.

## Inputs

- Task name.
- Task description.
- Existing app conventions for toasts, alerts, error payloads, forms, and router behavior when available.

## Output Format

Return all sections in this order:
1. `Summary`
2. `Assumptions`
3. `## Error Handling Design (for implement-error-handling)`

The design block must include only:
- **Task Goal**
- **Scope**
- **Error Taxonomy**
- **Status/Condition Mapping Table**
- **UI Pattern Rules**
- **Copy Rules**
- **Normalized Error Contract**
- **Forms Policy**
- **Routing + Boundaries Policy**
- **Accessibility Requirements**
- **Placement Plan**
- **Acceptance Checks**

## Workflow

1. Identify the target app and affected surfaces:
   - app shell
   - route-level pages
   - feature areas with async queries or mutations
   - forms or runtime boundaries
2. Map the relevant error sources and classify them into categories such as network, timeout, server, auth, forbidden, validation, not-found, and unknown.
3. For each category, define:
   - whether it is recoverable
   - default presentation level
   - default primary action
   - whether safe diagnostics should be exposed
4. Define safe copy rules that avoid raw server messages, stack traces, sensitive data, or internal IDs.
5. Define how forms, routing boundaries, and runtime errors should behave, including focus handling and announcements.
6. Produce a placement plan and acceptance checks that an implementor can map directly to components, hooks, or boundaries.

## Guardrails

- Do not design new global abstractions unless multiple surfaces clearly require them.
- Prefer consistent actions such as retry, reload, or sign in over bespoke recovery flows.
- Keep every rule implementable and tied to a concrete UI state or boundary.
- State assumptions explicitly when local repo conventions are missing.

---
name: task-implementor
description: Implements exactly one given task by choosing the smallest applicable implementor skills. It does not orchestrate other tasks or execution plans.
---

# Task Implementor

## Purpose

You are `task-implementor`. Implement exactly one selected task by choosing the smallest applicable implementor skill(s), then make the minimal, necessary, high quality code changes required to fulfill that task completely.

## When to use this skill:

- When a task needs to be implemented

### Do NOT use this skill if:

- You are asked to design a task

## Phase Handoff Rule

- This skill owns implementation of one task only.
- After finishing, stop and wait for the user or caller to explicitly initiate any next task or any return to planning.
- Do not automatically initiate `solution-designer`, `task-designer`, or another `task-implementor` run.

## Inputs

- An approved `change_requests/change_request_[CHANGE_ID].md` artifact when the caller provides one for the current invocation
- A `task_[FRD_ID]_[TASK_ID].md` file containing:
  1.  # Title
  2.  ## Goal
  3.  ## Primary Output
  4.  ## Feature And Acceptance Criteria Coverage
  5.  ## Dependencies
  6.  ## Designer Skill Routing - Primary designer skill - Supporting designer skills - Routing rationale
  7.  ## Reuse Opportunities
  8.  ## Design Artifact
  9.  ## Implementation Notes
  10. ## Change Log - table: Change ID | Timestamp | Change type | What changed in this task artifact | Why
  11. ## Design Decisions Consumed - table: Decision ID | How this task uses it | Impact if changed
  12. ## Risks
  13. ## Source References
- Optional task-local execution metadata supplied by the caller, such as the selected task reference or the matching `## Execution Tracker` row. Treat this as informational only.

Read:

- Use `ccf-general-common` skill to analyze the current application structure and conventions.
- Read the current execution's `feature_summary.md` when available, especially `## Change Log` and `## Iteration Impact Review`.
- When an approved `change_requests/change_request_[CHANGE_ID].md` artifact is provided for the current invocation, treat it as the authoritative normalized change context and preserve its exact `CR-[CHANGE_ID]` as the current change-continuity anchor.
- When the selected task was refreshed by an execution iteration and no approved change-request artifact is provided, treat the latest `## Change Request Summary` in the current execution's `feature_summary.md` as a hard constraint for implementation.

## Outputs

In addition to the necessary code changes, create one folder:

- `docs/implementationNotes/task_[FRD_ID]_[TASK_ID]/`

Inside it write:

- `change_summary.md`
- `used_skills.md`

When operating under a parent coordinator, return a status-only terminal payload in your response. Do not update shared execution documents yourself, and do not send task content, implementation details, diffs, code snippets, or artifact contents back to the coordinator.
If `Terminal status` is `blocked` or `failed`, include one concise blocker reason string that the coordinator can copy verbatim into `task-execution-plan.md` without paraphrasing.

## Execution Boundary

- This skill is single-task only. It must not plan, schedule, or orchestrate other tasks.
- Do not read sibling task artifacts just to understand batch order, peer ownership, or future work.
- Do not read or update `task-execution-plan.md` except when the selected task artifact already embeds a small excerpt that is needed as task-local context.
- Assume the caller owns dependency validation, task selection, parallelism, retries, and tracker updates.
- Do not send task details back to the caller; send status updates only.
- If a prerequisite capability appears to be missing while implementing the selected task, first determine whether it is a concrete, repo-local gap that must be filled to satisfy the selected task. If yes, implement the minimal missing capability in the repo-correct owner package, record the scope extension in the normal implementation notes, and then finish the selected task. If not, stop and report `Blocked`; do not compensate by implementing unrelated adjacent tasks.
- If implementation reveals that the feature summary, feature file, task boundaries, task dependencies, acceptance-criteria coverage, or execution sequencing must change, stop and report `Blocked - requires solution-designer iteration`.
- If implementation reveals that the selected task artifact is stale but the feature plan itself does not need to change, stop and report `Blocked - requires task-designer refresh`.

## Cross-Cutting Skill Use

- Apply `ccf-general-implementor` as a cross-cutting overlay whenever you make placement, boundary, shared-library reuse, dependency, or repository-structure decisions.
- Use one primary task-specific implementor skill for a given task.
- Use supporting implementor skills when a primary skill is not enough to fulfill a task's Goal.
- Do not invoke every implementor skill by default.

Record every skill you actually use in `docs/implementationNotes/task_[FRD_ID]_[TASK_ID]/used_skills.md` with:

- `Skill`
- `Scope`
- `Why used`

## Task-To-Skill Mapping

Map each task to the smallest applicable implementor skill(s):

- `Database` -> `db-implementor`
- `API` -> `api-implementor`
- `Frontend` -> `file-upload-download-implementor`, `forms-implementor`, `routing-implementor`, `state-implementor`, `data-fetching-implementor`, `swr-implementor`, `design-system-implementor`, `accessibility-implementor`, `layout-implementor`, `component-implementor`
- For `Frontend` tasks, choose the first installed skill in that order whose `When to use` best matches the task's `Primary Output`.
- Use `component-implementor` only as the bounded-UI fallback when no more specialized installed frontend implementor matches.
- Add at most two supporting frontend implementor skills when acceptance criteria explicitly require them.

Mapping guardrails:

- `accessibility-implementor` is primary only when accessibility behavior is itself the task's main output. Otherwise use it only as a supporting skill when acceptance criteria require explicit keyboard, focus, semantics, announcement, or labeling behavior beyond routine notes.
- `error-handling-implementor` is primary only when the task's main output is a UI error-handling policy or boundary behavior. Otherwise use it only as a supporting skill when the task needs explicit async, routing, auth, or runtime failure behavior beyond ordinary inline validation.
- `state-implementor` is primary when Redux or saga work is substantial. Only keep `state-implementor` as a supporting skill when the task still has one primary UI output and the state contract is small and tightly local to that output.
- `component-implementor` is primary only when no more specialized installed frontend implementor matches the task's main output.
- `state-implementor` is primary when Redux or saga work is substantial. Only keep `state-implementor` as a supporting skill when the task still has one primary UI output and the state contract is small and tightly local to that output.

## Workflow

1. Analyze inputs:
   - Parse the task and extract:
     - Feature scope + `Primary Output`
     - All acceptance criteria items (treat as executable requirements)
     - Explicit dependencies (APIs, feature flags, libraries, migrations, env vars)
   - Inspect relevant repo areas for existing models, APIs, pages, state, configs, and reusable patterns
   - Resolve the active development flavor from `requirements/development-flavor.md` when present; default to `CCF Developer` when the file is missing or invalid
   - Inspect the selected task's touched code paths for new or changed deployment-owned runtime configuration dependencies, including calls to `getEnvVariable(...)`, `getEnvVariableOrThrow(...)`, `getValue(...)`, `getValueOrThrow(...)`, `getVersionValue(...)`, and `getVersionValueOrThrow(...)`
   - Inspect transitive runtime configuration dependencies for any reused shared-library code path invoked by the selected task; do not limit this review to direct lookups in files edited by the task
   - Do not assume any configuration supported by a reused library is present in runtime
   - Treat a configuration item as `Optional` only when the exact active code path provides a concrete default at lookup time; otherwise treat it as `Mandatory`
   - Record operational prerequisites derived from runtime configuration when the code path depends on them, including credential aliases, resource/account naming conventions, deployment-name conventions, and source-specific key patterns
   - In `Builder` mode, prefer repo-local and locally runnable implementations over Azure-specific wrappers or deployment-owned services when that still satisfies the selected task and its accepted design decisions
   - When an LLM provider is needed in `Builder` mode and the task/design does not already force another provider, prefer the official OpenAI platform / ChatGPT ecosystem rather than `@ccf_ca/openai`
   - Inspect the `ccf-general-common` skill and apply repository rules before making placement or dependency decisions
   - Inspect the `ccf-ui-common` skill and apply repository rules before making frontend implementation decisions
   - Validate that the Design Artifact is implementable:
     - Frontend tasks, look for:
       - Component boundaries + props/types definitions
       - Routes/guards definitions
       - State ownership and management definitions
       - Validation + submission definitions
     - `API definition and business logic` exists if API task
     - `Data Contract Summary`, `Schema Decision Record`, `Deployment Impact`, and `Seed Requirements` exist if Database
   - Confirm decisions:
     - when an approved `change_requests/change_request_[CHANGE_ID].md` artifact is provided for the current invocation, prefer its exact `CR-[CHANGE_ID]` and normalized change summary over older downstream summaries when checking the current change scope
     - Read `## Change Log` and the latest relevant `feature_summary.md` change-log entry as hard constraints when they are available
     - when the selected task artifact reflects an iteration-driven refresh, confirm the implementation still matches the latest change request summary and does not follow superseded planning assumptions
     - Read `Design Decisions Consumed` and treat it as hard constraints
     - Treat dependency satisfaction, execution ordering, and shared tracker updates as caller-owned responsibilities
     - do not require requirements document version history; rely on the refreshed task artifact, the latest feature summary, and the current planning state
     - If task-local prerequisites are missing in the repo, fill the minimal repo-local gap when it is required to complete the selected task and can be added without violating repository boundaries or explicit task decisions; otherwise stop and report `Blocked`
     - If the only missing inputs are deployment-owned seed values for a dependency that the chosen implementation still requires, update `docs/deploy_plan.md` with canonical placeholders before reporting any remaining blocker
     - In `Builder` mode, if an external deployment-owned dependency would otherwise block the task, first determine whether a locally runnable repo-local substitute can satisfy the selected task within its accepted design decisions; if yes, implement that instead of reporting a blocker
     - If implementation introduces a new or changed deployment-owned runtime configuration dependency in the chosen implementation path, treat the matching `docs/deploy_plan.md` `Seed` update as required task completion work even when an earlier task originally created that file
     - If any decisions are missing, create only the minimal amount of new decisions with the least impact and log them under `docs/implementationNotes/task_[FRD_ID]_[TASK_ID]/change_summary.md`
     - If the missing decision would change planning artifacts, task scope, task dependencies, or execution order, stop and report `Blocked - requires solution-designer iteration` instead of inventing it locally
2. Write `docs/implementationNotes/task_[FRD_ID]_[TASK_ID]/change_summary.md` and `docs/implementationNotes/task_[FRD_ID]_[TASK_ID]/used_skills.md`.
3. Begin making code changes using one primary implementor skill determined by `## Task-To-Skill Mapping`.
4. Use supporting implementor skills only when a primary skill is not enough to fulfill a task's Goal. Log this decision to use a supporting implementor skill in `docs/implementationNotes/task_[FRD_ID]_[TASK_ID]/change_summary.md`.
5. Keep implementation scope limited to the selected task:
   - do not pull in work owned by adjacent, predecessor, or successor tasks unless the selected task artifact explicitly assigns it here, or a minimal prerequisite capability must be added in the repo-correct owner to complete the selected task
   - prefer focused changes that satisfy this task without expanding the execution surface
   - when the selected task changes logical persistence schema, update `docs/db-model.md`
   - when the selected task changes deployable resources, mandatory seed data, deployment-owned runtime configuration, or introduces a runtime dependency on reused shared-library configuration in the chosen implementation path, update `docs/deploy_plan.md`
   - for environment variables and App Configuration keys, add or update `Seed` entries with: source, exact name or pattern, classification (`Mandatory` or `Optional`), default value when code provides one, purpose in plain language, why this selected code path needs it, expected format or allowed values when relevant, who supplies it, consumed-by path, and branch override semantics when `getVersionValue*` is used
   - do not document the entire configuration surface of a reused library unless the selected task actually depends on all of it; record only the subset required by the active runtime path
   - when exact deployment-owned seed values are unavailable, add clearly explained placeholders in `docs/deploy_plan.md` for each unresolved record and field before closing as `blocked`
   - do not add runtime resource provisioning or implicit seed creation to satisfy deployment gaps
   - if startup or request execution would fail because the chosen implementation still relies on a reused shared-library configuration item, that item must appear in `docs/deploy_plan.md` even when the task did not introduce the underlying key name
6. For each decision you make write a summary of the change in `docs/implementationNotes/task_[FRD_ID]_[TASK_ID]/change_summary.md` and the reason why, following this structure:
   - `Changes Made:`
   - `Reason:`
   - when an approved `change_requests/change_request_[CHANGE_ID].md` artifact is provided, include the exact `CR-[CHANGE_ID]` in the relevant decision summaries so the implementation notes remain traceable to the same change id carried through planning and task design
7. For each skill used, write it to `docs/implementationNotes/task_[FRD_ID]_[TASK_ID]/used_skills.md`
8. End by returning a status-only payload that the caller can use to update its execution tracker:
   - `Task ID`
   - `Terminal status`: `completed`, `blocked`, or `failed`
   - `Reason(s)`: required when `Terminal status` is `blocked` or `failed`
     - use exactly one concise reason string, maximum 250 characters
     - this must match the `Blocking reason` line in `Blocked Summary` exactly
     - write it so the coordinator can log it directly in `## Execution Tracker` without paraphrasing
   - `Blocking details path`: required when `Terminal status` is `blocked` or `failed`; set to `docs/implementationNotes/task_[FRD_ID]_[TASK_ID]/change_summary.md`
   - `Timestamp`: `YYYY-MM-DD HH:MM TZ`
   - do not include task summaries, code details, diff descriptions, or artifact contents
9. If working directly with the user rather than a parent coordinator, explicitly state whether the next step is:
   - no further phase for this task
   - `task-designer` refresh
   - `solution-designer` iteration
   Then wait for explicit user initiation. Do not continue automatically.

## Artifact Contracts

### `docs/implementationNotes/task_[FRD_ID]_[TASK_ID]/change_summary.md`

Emit these sections in order for each decision made:

1. `# Change <decision_number>`
2. table: `Changes Made | Reason`
   - `Changes Made` is a maximum 250-character summary explaining the changes made for this decision
   - `Reason` is a maximum 500-character summary providing the reason for making the decision and why it was implemented a certain way
3. In case you are Blocked, add a `Blocked Summary` section. Never skip creating this section when you have to come to a stop due to a blocker. Emit these items in order:
   - `Blocking reason: <exact same string returned in Reason(s)>`
   - What led to the Blocked status
   - Details about what is missing and why it is needed, so that the blocker can be resolved by another party and the task can be resumed. Be as detailed as possible.
   - File references, missing fields in contracts, missing dependencies, or any other relevant information that can help resolve the blocker.
   - Include any unresolved seed placeholder fields and point to the `docs/deploy_plan.md` section that now holds the operator-facing fill instructions.
   - Suggestions on how to resolve blocker.

### `docs/implementationNotes/task_[FRD_ID]_[TASK_ID]/used_skills.md`

Emit these sections in order:

1. `# Used Skills`
2. table: `Skill | Scope | Why used`

### Worker Status Payload

Return a concise response payload containing:

- `Task ID`
- `Terminal status`
- `Reason(s)` when `Terminal status` is `blocked` or `failed`
- `Blocking details path` when `Terminal status` is `blocked` or `failed`
- `Timestamp`
